/**
 * 文档操作前检查信息： 如检查大纲是否存在，检查文档是否锁定，检查大纲锁等等
 */
//文档锁信息 扩充功能
(function (window, $) {
    var VE = window.vrmEditor;
    var Outline = VE.Outline;

    VE.plugin(function() {
        var editor = this;
        
        VE.CHECK = {
            //检查大纲名称是否重复
            checkOutlineExist: function () {
                WD_URL.rest.ajax({
                    url: config.checkOutline(),
                    type: 'GET',
                    data: {
                        outlineName: $.trim(value),
                        parentId: $("#parentId").val()
                    }
                }, function (json) {
                    _r = json.vaidResult
                })
            },
            //检查大纲是否存在
            checkOutlineExist: function (outlineId) {
                var def = $.Deferred();
                WD_URL.rest.ajax({
                    url: config.checkOutlineExist(),
                    type: 'GET',
                    data: {docId: config.getDocId(), docOutlineId: outlineId}
                }, function (data) {
                }).then(function (data) {
                    if (data.data && data.data.result == "true") {
                        def.resolve(true);
                    } else {
                        show_message('文档大纲已删除，或不存在!', 'error');
                        editor.docstruct.tree.refreshTreeAndContent();
                        def.reject();
                    }
                })
                return def.promise();
            },
            //检查大纲是否被锁
            checkOutlineLock: function (outlineId) {
                var def = $.Deferred();
                WD_URL.rest.ajax({
                    url: config.checkOutlineLock(),
                    type: 'GET',
                    data: {docId: config.getDocId(), docOutlineId: outlineId}
                }, function (data) {
    
                }).then(function (data) {
                    if (data.data.length > 0) {
                         /**
                         * 查看前端是否已经加了标签，如没加锁标签，则更新
                         */
                        $.each(data.data, function (i, lockInfo) {
                            if (lockInfo.datatype == 1) {
                                show_message("文档已被锁,不允许操作", 'error');
                                def.reject();  
                                VE.LOCK.addTitleLockHelper(lockInfo);
                            } else if(lockInfo.datatype == 4){ //上级存在大纲下载锁
                                if(lockInfo.tmpselflock){
                                    def.resolve(true);
                                }else{
                                    show_message("大纲或上级大纲存在下载锁,不允许操作",'error');
                                    def.reject();
                                }
                            } else if(lockInfo.datatype == 2){
                                if (lockInfo.tmpselflock) { //自身锁可解锁
                                    VE.LOCK.addDocOutlineSelfLockTag(lockInfo.docoutlineid);
                                    def.resolve(true);
                                } else {
                                    VE.LOCK.addDocOutlineOtherLockTag(lockInfo);
                                    show_message("文档大纲中存在锁,不允许操作", 'error');
                                    def.reject();      
                                }
                            }
                        })
                        
                    } else {
                        //移除标签
                        VE.LOCK.removeDocTag();
                        VE.LOCK.removeDocOutlineTag(outlineId,"_selflock"); 
                        VE.LOCK.removeDocOutlineTag(outlineId,"_otheroock");
                        def.resolve(true);
                    }
                })
                return def.promise();
            },
            //验证大纲及其下级子大纲是否有锁
            checkLockChild: function (outlineId) {
                var def = $.Deferred();
                WD_URL.rest.ajax({
                    url: config.checkLockChild(),
                    type: 'GET',
                    data: {docId: config.getDocId(), docOutlineId: outlineId}
                }, function (data) {
    
                }).then(function (data) {
                    if (data.data.length > 0) {
                        var isOutlineExistLock = false;
                        var isOutlineDownloadExistLock = false;
                        var isDocExistLock = false;
                        $.each(data.data,function (i,lockInfo) {
                            if (lockInfo.datatype == 1) { //验证文档锁
                                isDocExistLock = true;
                                VE.LOCK.addTitleLockHelper(lockInfo);
                            } else if(lockInfo.datatype == 4) { //验证文档大纲下载锁
                                if(!lockInfo.tmpselflock){ //自身锁可解锁
                                    isOutlineDownloadExistLock = true;
                                }
                            } else if(lockInfo.datatype == 2){ //验证大纲锁
                                if (lockInfo.tmpselflock) { //自身锁可解锁
                                    VE.LOCK.addDocOutlineSelfLockTag(lockInfo.docoutlineid);
                                } else {
                                    isOutlineExistLock = true;   
                                    VE.LOCK.addDocOutlineOtherLockTag(lockInfo);
                                }
                            }
                        })
                        if(isOutlineExistLock){
                            show_message('文档大纲或者其子大纲中存在锁,不允许操作!', 'error');
                            def.reject();
                        }else if(isDocExistLock){
                            show_message("文档已被锁,不允许操作", 'error');
                            def.reject();  
                        }else if(isOutlineDownloadExistLock){
                            show_message("文档大纲或者其上级大纲存在下载锁,不允许操作",'error');
                            def.reject();
                        }else{
                            def.resolve(true);
                        }
                    } else {
                        def.resolve(true);
                    }
                })
                return def.promise();
            },

            checkAllLock:function () {
                var def = $.Deferred();
                WD_URL.rest.ajax({
                    url     :config.listOtherLock()
                }, function (json) {
                    var map = json;
                    var docId = config.getDocId();
                    var $outlines = editor.$editorContent.find('div.wd-outline');
                    //遍历文档大纲
                    if(map){
                        if(!$.isEmptyObject(map["docLock"])){
                            var docMap = map["docLock"];
                            VE.LOCK.addTitleLockHelper(docMap[docId]);
                            show_message("文档已被锁,不允许操作", 'error');
                            def.reject();       
                        }else if(!$.isEmptyObject(map["outlineLock"])){
                            var outlineMap = map["outlineLock"];
                            $.each($outlines, function (i, outline) {
                                var $outline = $(outline),
                                    tmpSelfLock = null,
                                    docRecordLockId = null,
                                    $outlineId = $outline.data('outlineid');
                                if(!$.isEmptyObject(outlineMap[$outlineId])){
                                    VE.LOCK.addOutlineLockHelper(outlineMap[$outlineId]);
                                }
                            });
                            show_message("文档大纲中存在锁,不允许操作", 'error');
                            def.reject(); 
                        }else{
                            def.resolve(true);
                        }
                    }else{
                        def.resolve(true);
                    }
                })  
                return def.promise();  
            },

            //检查大纲是否存在，并检查大纲是否被锁住
            checkOutlineInfo: function (outlineId) {
                return VE.CHECK.checkOutlineExist(outlineId).then(
                    function (data) {
                       return VE.CHECK.checkOutlineLock(outlineId);
                    });
            },
            //检查大纲是否存在，并检查大纲是否被锁住
            checkOutlineInfoAndAddLock: function (outlineId) {
                return VE.CHECK.checkOutlineExist(outlineId).then(
                    function (data) {
                      return  VE.CHECK.checkOutlineLock(outlineId);
                    }).then(function (data) {
                      return  VE.LOCK.addDocOutlineLock(outlineId);
                });
            },
    
             //检查大纲是否存在，并检查大纲是否被锁住
            checkOutlineChildInfo: function (outlineId) {
                return VE.CHECK.checkOutlineExist(outlineId).then(
                    function (data) {
                        return VE.CHECK.checkLockChild(outlineId);
                    });
            }
        }
    })
})(window, jQuery);





