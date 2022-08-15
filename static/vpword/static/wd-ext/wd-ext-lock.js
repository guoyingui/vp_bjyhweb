
//文档锁信息 扩充功能
(function () {
    var $ = window.jQuery;
    var VE = window.vrmEditor;
   
    var Outline = VE.Outline;
    /**
     * 当页面加载时，加载锁标签
     */
    VE.pluginPageRender(function ($editorContent) {
        var editor = this;
        //获取大纲
        var $outlines = editor.$editorContent.find('div.wd-outline');
        VE.LOCK.initLockTag($outlines);
    })

    VE.plugin(function () {
        VE.LOCK = {
            initLockTag:function ($outlines) {
                WD_URL.rest.ajax({
                    url: config.listLock()
                }, function (json) {
                    var map = json;
                    var docId = config.getDocId();
                    //遍历文档大纲
                    if(map){
                        //如果有文档锁则大纲下载锁和大纲锁不显示
                        //如果有大纲下载锁则大纲锁不显示
                        if(!$.isEmptyObject(map["docLock"])){
                            var docMap = map["docLock"];
                            VE.LOCK.addTitleLockHelper(docMap[docId]);
                        }else if(!$.isEmptyObject(map["outlineDownloadLock"])){
                            var outlineDownloadMap = map["outlineDownloadLock"];
                            $.each($outlines,function(i,outline) {
                                var $outline = $(outline),
                                    $outlineId = $outline.data('outlineid');
                                if(!$.isEmptyObject(outlineDownloadMap[$outlineId])){
                                    VE.LOCK.addOutlineDownloadLockHelper(outlineDownloadMap[$outlineId]);
                                }
                            });  
                        }else if(!$.isEmptyObject(map["outlineLock"])){
                            var outlineMap = map["outlineLock"];
                            $.each($outlines, function (i, outline) {
                                var $outline = $(outline),
                                    $outlineId = $outline.data('outlineid');
                                if(!$.isEmptyObject(outlineMap[$outlineId])){
                                    VE.LOCK.addOutlineLockHelper(outlineMap[$outlineId]);
                                }
                            });
                        }
                    }
                });
            },
            /**
             * 添加自身文档锁
             */
            addDocSelfLockTag:function(){
                var title =  $(".vrm-content-title");
                if(title.find(".vrm-doc-lock").length <= 0){
                    $(".vrm-content-title").append('<button type="button" class="btn btn-success  btn-xs pr vrm-tag vrm-doc-lock"><span class="times vrm-doc-lock-del" >x</span><i class="fa fa-lock  vrm-doc-lock">已锁</i></button>' );
                    $(".vrm-doc-lock-del").on('click', function (e) {
                        e.stopPropagation();
                        message_dialog('Confirm', {
                            title : '提示',
                            content : '确认解锁该文档 ？',
                            confirm : function () {
                                VE.LOCK.removeDocLock();
                            }
                        })
                    });
                }
            },

            /**
             * 添加自身文档锁
             */
            addDocOtherLockTag:function($lockInfo){
                var title =  $(".vrm-content-title");
                if(title.find(".vrm-doc-lock").length  <= 0 ){
                    $(".vrm-content-title").append('<button type="button" class="btn btn-danger  btn-xs pr vrm-tag"><i class="fa fa-lock  vrm-doc-lock">已锁</i></button>' );
                }
            },

            addTitleLockHelper:function ($lockInfo) {
                var $wordDocTitle = $(".vrm-content-title");
                if($wordDocTitle.find(".vrm-doc-lock").length <= 0){
                    if($.isEmptyObject($lockInfo) || $lockInfo.tmpselflock){ //自身锁可解锁
                        VE.LOCK.addDocSelfLockTag();
                    }else{
                        VE.LOCK.addDocOtherLockTag($lockInfo);
                    }
                }
            },

            /**
             * 移除文档锁
             */
            removeDocTag:function(){
                var $wordDocTitle = $(".vrm-content-title");
                var $lock = $wordDocTitle.find('.vrm-doc-lock');
                if ($lock.length > 0) {
                    $lock.parent('button').remove()
                }
            },
            /**
             * 添加他人锁标签(不可删除)
             */
            addDocOutlineOtherLockTag:function(lockData){
                var outlineId = lockData.docoutlineid;
                var $outline = Outline.findOutline(outlineId);
                if($outline && $outline.length > 0 && !VE.LOCK.checkOutlineTagById(outlineId,"_otherlock")){
                    var containerTags = $outline.data('tags');
                    containerTags.addRightTags(new VE.Tag({
                            container : containerTags,
                            id:outlineId+"_otherlock",
                            target:$outline,
                            type:'label',
                            style: {
                                icon:'fa-lock',
                                className : 'label-danger'
                            },
                            text:lockData.lockownername +'已锁',
                            show : function () {
                                return true;
                            },
                        })
                    );
                    containerTags.render();
                }
            },
            /**
             * 添加自身大纲锁标签(可删除)
             */
            addDocOutlineSelfLockTag:function(outlineId){
                var $outline = Outline.findOutline(outlineId);
                if($outline && $outline.length > 0  && !VE.LOCK.checkOutlineTagById(outlineId,"_selflock")){
                    var containerTags = $outline.data('tags');
                    containerTags.addRightTags(new VE.Tag({
                            container : containerTags,
                            target:$outline,
                            id:outlineId+"_selflock",
                            type:'button',
                            style: {
                                icon:'fa-lock',
                                className : 'btn-success'
                            },
                            text:'已锁',
                            show : function () {
                                return true;
                            },
                            remove : function () {
                                var self = this;
                                message_dialog('Confirm',{
                                    content:'确认解锁大纲？',
                                    confirm: function () {
                                        VE.LOCK.removeDocOutlineLock(outlineId,self);
                                    }
                                })
                            },
                        })
                    );
                    containerTags.render();
                }
            },

            addOutlineLockHelper:function($lockInfo){
                if($lockInfo.tmpselflock){ //自身锁可解锁
                    VE.LOCK.addDocOutlineSelfLockTag($lockInfo.docoutlineid);
                }else{
                    VE.LOCK.addDocOutlineOtherLockTag($lockInfo);
                }
            },

            /**
             * 移除文档锁
             */
            removeDocOutlineTag:function(outlineId,tag){
                var $outline = Outline.findOutline(outlineId);
                if($outline && $outline.length > 0){
                    var containerTags = $outline.data('tags');
                    containerTags.removeTagById(outlineId+tag);
                }
            },

            /**
             * 添加锁
             * @param $outline
             */
            addTitleLockHelper : function($lockInfo){
                var $wordDocTitle = $(".vrm-content-title");
                if($wordDocTitle.find(".vrm-doc-lock").length <= 0){
                    if($.isEmptyObject($lockInfo) || $lockInfo.tmpselflock){ //自身锁可解锁
                        VE.LOCK.addDocSelfLockTag();
                    }else{
                        VE.LOCK.addDocOtherLockTag();
                        // $wordDocTitle.attr('data-is-lock',true).data('is-lock',true);
                    }
                }
            },

            /***
             * 添加锁信息
             * @param docId
             * @param outlineId
             */
            addDocLock:function () {
                var def = $.Deferred();
                var title =  $(".vrm-content-title");
                if(title.find(".vrm-doc-lock").length <=0){
                    return WD_URL.rest.ajax({
                        url:config.saveDocLock()
                    },function(data){
                        VE.LOCK.addDocSelfLockTag();
                    });
                }
            },
            /***
             * 移除文档锁信息
             * @param docId
             * @param outlineId
             * @param callback
             */
            removeDocLock:function () {
                return WD_URL.rest.ajax({
                    url:config.deleteDocLock(),
                    type:'GET'
                },function(data){
                    VE.LOCK.removeDocTag();
                });
            },

            /***
             * 添加文档锁信息
             * @param docId
             * @param outlineId
             */
            addDocOutlineLock:function (outlineId) {
                return WD_URL.rest.ajax({
                    url:config.saveDocOutlineLock(),
                    data:{docId:config.getDocId(),docOutlineId:outlineId}
                },function(data){
                    VE.LOCK.addDocOutlineSelfLockTag(outlineId);
                })
            },

            /***
             * 移除锁信息
             * @param docId
             * @param outlineId
             * @param callback
             */
            removeDocOutlineLock:function (outlineId, obj, callback) {
                return WD_URL.rest.ajax({
                    url:config.deleteDocOutlineLock(),
                    data:{docId:config.getDocId(),docOutlineId:outlineId},
                    type:'GET'
                },function(data){
                    if(obj != null){
                        obj.removeDom();
                    }else{
                        VE.LOCK.removeDocOutlineTag(outlineId,"_selflock");
                    }

                    if (VE.isFunction(callback)) {
                        callback();
                    }
                });
            },

            /**
             * 判断大纲锁是否存在
             */
            checkOutlineTagById:function(outlineId,tag){
                var $outline = Outline.findOutline(outlineId);
                if($outline && $outline.length >0){
                    var containerTags = $outline.data('tags');
                    var tag = containerTags.findTagById(outlineId+tag);
                    if(tag == null){
                        return false;
                    }else{
                        return true;
                    }
                }
            },

            /***
             * 添加大纲下载锁信息
             * @author qinlz
             * @param docId
             * @param outlineId
             */
            addDocOutlineDownloadLock:function (outlineId) {
                return WD_URL.rest.ajax({
                    //保存文档大纲下载锁信息
                    url:config.saveDocOutlineDownloadLock(),
                    data:{docId:config.getDocId(),docOutlineId:outlineId}
                },function(data){
                    //添加下载锁标签
                    VE.LOCK.addDocOutlineDownLoadSelfLockTag(outlineId);
                })
            },
            /***
             * 移除文档大纲下载锁信息
             */
            removeDocOutlineDownloadLock:function(outlineId, obj, callback){
                return WD_URL.rest.ajax({
                    url:config.deleteDocOutlineDownloadLock(),
                    data:{docId:config.getDocId(),docOutlineId:outlineId},
                    type:'GET'
                },function(data){
                    if(obj != null){
                        obj.removeDom();
                    }else{
                        VE.LOCK.removeDocOutlineTag(outlineId,"_selflock");
                    }
                    if (VE.isFunction(callback)) {
                        callback();
                    }
                });
            },
            /**
             * 移除文档大纲下载锁标签
             * @author qinlz
             */
            removeDocOutlineDownloadTag:function(outlineId,tag){
                var $outline = Outline.findOutline(outlineId);
                if($outline && $outline.length > 0){
                    var containerTags = $outline.data('tags');
                    containerTags.removeTagById(outlineId+tag);
                }
            },
            /**
             * 添加文档大纲下载锁标签工具方法
             */
            addOutlineDownloadLockHelper:function($lockInfo){
                if($lockInfo.tmpselflock){
                    VE.LOCK.addDocOutlineDownLoadSelfLockTag($lockInfo.docoutlineid);
                }else{
                    VE.LOCK.addDocOutlineDownloadOtherLockTag($lockInfo);
                }
            },
             /**
             * 添加自身大纲下载锁标签(可删除)
             */
            addDocOutlineDownLoadSelfLockTag:function(outlineId){
                var $outline = Outline.findOutline(outlineId);
                if($outline && $outline.length > 0  && !VE.LOCK.checkOutlineTagById(outlineId,"_selflock")){
                    var containerTags = $outline.data('tags');
                    containerTags.addRightTags(new VE.Tag({
                            container : containerTags,
                            target:$outline,
                            id:outlineId+"_selflock",
                            type:'button',
                            style: {
                                icon:'fa-lock',
                                className : 'btn-success'
                            },
                            text:'下载锁定',
                            show : function () {
                                return true;
                            },
                            remove : function () {
                                var self = this;
                                message_dialog('Confirm',{
                                    content:'确认解锁大纲？',
                                    confirm: function () {
                                        VE.LOCK.removeDocOutlineDownloadLock(outlineId,self);
                                    }
                                })
                            },
                        })
                    );
                    containerTags.render();
                }
            },
            /**
             * 添加文档大纲下载锁他人锁标签(不可删除)
             */
            addDocOutlineDownloadOtherLockTag:function(lockData){
                var outlineId = lockData.docoutlineid;
                var $outline = Outline.findOutline(outlineId);
                if($outline && $outline.length > 0 && !VE.LOCK.checkOutlineTagById(outlineId,"_otherlock")){
                    var containerTags = $outline.data('tags');
                    containerTags.addRightTags(new VE.Tag({
                            container : containerTags,
                            id:outlineId+"_otherlock",
                            target:$outline,
                            type:'label',
                            style: {
                                icon:'fa-lock',
                                className : 'label-danger'
                            },
                            text:lockData.lockownername +'下载锁定',
                            show : function () {
                                return true;
                            },
                        })
                    );
                    containerTags.render();
                }
            }
        }
    })
})();


