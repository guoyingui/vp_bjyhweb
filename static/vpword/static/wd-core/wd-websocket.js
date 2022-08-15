/**
 * vrm-socket-io
 * @author huangyong@chtech.cn
 * @since v2.0.0
 * @date 2018-05-14 09:00
 * @Copyright 本内容仅限于北京维普时代内部传阅，禁止外泄以及其他商业用途
 */
(function (window, $) {
    var VE = window.vrmEditor;

    VE.plugin(function () {
        var editor = this;
        var Outline = VE.Outline;
        var token = vp.cookie.getToken();
        var tree =  this.docstruct.tree;
        var view = this.view;

        editor.socket = io.connect(vp.config.URL.odm_websocket+'/docroom' ,{
            query: {token: token, docId: config.getDocId()}
        })
        //在线
        editor.socket.on('connect', function () {
            VE.log('token='+token+'服务器连接成功.....')
        })
        //监控服务器断开连接
        editor.socket.on('disconnect', function () {
            VE.log('token='+token+'断开服务器连接.....')
        })

        //监听在线
        editor.socket.on('online', function (userList) {
            for (var i = 0, len = userList.length; i < len; i++) {
                editor.headertoolbar.addOnline(userList[i].token, userList[i].userName);
            }
        })
        //一个页面多开tab 监听离线
        editor.socket.on('offline', function (token) {
            editor.headertoolbar.removeOnline(token);
        })
        //监听网络中断
        editor.socket.on('connect_error', function () {
            show_message("connect websocket error", "error");
        })
        //监控解析进度消息
        editor.socket.on('doc process msg', function (code, data) {
            processModal.$processText.append('<li>'+data+'</li>');
            processModal.$processCurText.text('当前位置：'+data);
        })
        //监控解析进度失败消息
        editor.socket.on('doc process errMsg', function (code, data) {
            var $container =  processModal.$processText.append('<li>'+data+'</li>');
            $container.scrollTop($container[0].scrollHeight);
        })
        //监控解析进度百分比
        editor.socket.on('doc process percent', function (code, percent) {
            processModal.init(percent);
        })
        //监控解析开始
        editor.socket.on('doc process start', function (code, data) {
            var $container =  processModal.$processText.append('<li>'+data+'</li>');
            $container.scrollTop($container[0].scrollHeight);
        })
        //监控解析结束
        editor.socket.on('doc process end', function (code, data) {
            var $container =  processModal.$processText.append('<li>'+data+'</li>');
            $container.scrollTop($container[0].scrollHeight);
            processModal.$processStatus.text('解析完成');
            show_message('解析完成', "success");
        })
        //监控解析错误
        editor.socket.on('doc parse error', function (code, data) {
            processModal.$processStatus.text('解析失败');
            var code = /^VP(\d{1})/.exec(code)[1]
            if (code == 3) {
                show_message(data, "error");
            } else {
                show_message(data, "warning");
            }
            if (data) {
                var $container =  processModal.$processText.append('<li>'+data+'</li>');
                $container.scrollTop($container[0].scrollHeight);
            }
        })
        //监控文档锁
        editor.socket.on('doc lock', function (code, data) {
            var pushResult = JSON.parse(data);
            VE.LOCK.addTitleLockHelper(pushResult);
        })  
         //监控文档解锁
        editor.socket.on('doc unlock', function (code, data) {
            VE.LOCK.removeDocTag();
        })  
        //监控文档刷新
        editor.socket.on('doc refresh', function (code, data) {    
            show_message(data, "info",{
                progressBar : true,
                closeButton : false,
                onHidden: function () {
                    if (window['processModal'] != void 0) {
                        processModal.dialogClose();
                    }
                    tree.refreshTreeAndContent();
                }
            })
        })

        //监控大纲添加锁
        editor.socket.on('doc outline lock', function (code, data) {
            var pushResult = JSON.parse(data);
            VE.LOCK.addOutlineLockHelper(pushResult);
        })

        //监控大纲下载加锁
        editor.socket.on('doc outline download lock',function(code,data) {
            var pushResult = JSON.parse(data);
            VE.LOCK.addOutlineDownloadLockHelper(pushResult);
        }) 

        //监控解除大纲下载锁
        editor.socket.on('doc outline download unlock',function(code,data){
            VE.LOCK.removeDocOutlineDownloadTag(data,"_selflock"); 
            VE.LOCK.removeDocOutlineDownloadTag(data,"_otherlock");
        })

        //监控大纲解锁
        editor.socket.on('doc outline unlock', function (code, data) {
            VE.LOCK.removeDocOutlineTag(data,"_selflock");
            VE.LOCK.removeDocOutlineTag(data,"_otherlock");
        })

        //监控修改大纲名称
        editor.socket.on('doc outline rename', function (data) {    
            tree.refreshTitle(JSON.parse(data));
        })
         
        //监控新增大纲 大纲前=1 大纲后=2 大纲内=3
        editor.socket.on('doc outline add', function (data) {    
            var pushResult = JSON.parse(data);
            var position = pushResult.position;
            var markOutlineId = pushResult.markOutlineId;
            var data = pushResult.data;

            function buildNode (v) {
                return {
                    name : v.outlineName,
                    tid : v.outlineId,
                    pid: v.parentId,
                    origChapNum : '',
                    propertys : {},
                    outlineUuid : v.outlineUuid
                }
            }

            function insertContent(v, posOutlineId, pos) {
                Outline.insertOutlineWithContent({
                    editor : editor,
                    outline : {
                         docOutlineId: v.outlineId,
                         outlineLvl:v.outlineLvl,
                         origChapNum:v.origChapNum,
                         outlineName:v.outlineName,
                         changeStatus:v.changeStatus,
                         wkItem : !!v.wkItem ? {
                            docWkItmId: v.wkItem.docWkItmId,
                            wkItmContent:v.wkItem.wkItmContent,
                            changeStatus:v.wkItem.changeStatus
                         }: {}
                    },
                    posOutlineId : posOutlineId,
                    pos : pos
                })
            }

            //基于大纲创建文档
            if (markOutlineId) {
                var markNode = tree.findById(markOutlineId);
                var parentNode = (position == 1 || position == 2) ? markNode.getParentNode() : markNode;
                var newNode = null;
                var posOutlineId = '';
                $.each(data, function (i, v) {
                    var firstPosOutlineId = '';
                    var pos = 'after';
                    if (position == 1) {
                        if (!parentNode && i == 0) {
                            firstPosOutlineId = markOutlineId;
                            pos = 'before';
                        } else {
                            firstPosOutlineId = markNode.getPreNode() ? markNode.getPreNode().tid : parentNode.tid;
                        }
                        var currIndex = tree.getNodeIndex(markNode);
                        newNode = tree.addNode(parentNode, currIndex, buildNode(v));
                    } else if (position == 2) {
                        firstPosOutlineId = markNode.tid;
                        var currIndex = !!newNode ? tree.getNodeIndex(newNode)
                            : tree.getNodeIndex(markNode);
                        newNode = tree.addNode(parentNode,currIndex+1, buildNode(v));
                    } else if (position == 3) {
                        firstPosOutlineId = tree.getLastChildNode(parentNode).tid;
                        newNode = tree.addNode(parentNode, -1, buildNode(v));
                    }

                    insertContent(v, posOutlineId || firstPosOutlineId, pos);
                    posOutlineId = v.outlineId
                })
                Outline.findOutline(pushResult.markOutlineId);
            } else {
                $('div.js-addOutlineFirst').hide();
                var posOutlineId = '';
                $.each(data, function (i, v) {
                    tree.addNode(null, buildNode(v));
                    insertContent(v, posOutlineId);
                    posOutlineId = v.outlineId
                })
            }
            WD_URL.rest.ajax({
                url : config.chapNums(),
                type : 'GET'
            }, function (data) {
                tree.updateChapNums(data);
            })
        });

        //监控大纲删除
        editor.socket.on('doc outline delete', function (data) {
            var treeNode = tree.findById(data);

            //判断是否更新章节号
            if (treeNode) {
                //获取兄弟节点
                var nextNode = treeNode.getNextNode();
                tree.removeSelfAndChildNode(treeNode);

                var isUpdateChapNum = !!nextNode;
                 //获取章节号更新
                if (isUpdateChapNum) {
                    WD_URL.rest.ajax({
                        url : config.chapNums(),
                        type : 'GET'
                    }, function (data) {
                       tree.updateChapNums(data);
                    })
                }
            }
            if (tree.getNodes().length == 0) {
                $('div.js-addOutlineFirst').show();
            }
        });

        //设置条目
        editor.socket.on('doc outline setpoint', function (data) {
            var pushResult = JSON.parse(data);
            if (vpCommons.isArray(pushResult.points)) {
                $.each(pushResult.points, function (v, point) {
                    var treeNode = tree.findById(point.outlineId);
                    if (treeNode) {
                        tree.addBusFlag(treeNode, point.busFlag, point.busFlagName);
                    }
              
                    Outline.addBusFlagTag(
                        Outline.findOutline(point.outlineId),
                        point.busFlag, 
                        point.busFlagName, 
                        function () {
                            var self = this;
                            message_dialog('Confirm', {
                                content: '确定取消条目?',
                                confirm: function () {
                                    WD_URL.rest.ajaxMask({
                                        url: !!editor.scene&& editor.scene.auth("outline-menu-delbusflaguseodmflag")? config.onlyCancelControlPoint(): config.cancelControlPoint(),
                                        type: 'PUT',
                                        data: {outlineIds: self.target.data('outlineid')},
                                        dataType: 'json',
                                        maskinfo: '取消中...'
                                    }, function (json) {
                                        show_message("取消成功！", "success");
                                    }, function (json) {
                                        show_message("取消失败", "error");
                                    })
                                }
                            })
                    })
                })
           }
        })

        //取消条目
        editor.socket.on('doc outline unsetpoint', function (data) {
            var pushResult = JSON.parse(data);
            if (vpCommons.isArray(pushResult.outlineIds)) {
                $.each(pushResult.outlineIds, function (v, outlineId) {
                    Outline.removeBusFlagTagById(outlineId);
                    tree.removeBusFlagById(outlineId);
                })
                view.render();
           }
        })

        //监控文档刷新
        editor.socket.on('doc outline tree refresh', function (code, data) {
            var treeNodes = tree.getSelectedNodes();
            var markTid = null;
            if (vpCommons.isArray(treeNodes) && treeNodes.length > 0) {
                markTid = treeNodes[0].tid;
            }
            //校验文档是否编辑
            if (editor.myeditor.editing()) {
                editor.__status__  = 'tick-refresh-content'
            } else {
                tree.refreshTree(function () {
                    if (vpCommons.isNotEmpty(markTid)) {
                        tree.locationById(markTid);
                        editor.content.pageDataLoader.refreshWithLocation(markTid);
                    } else {
                        editor.content.pageDataLoader.refresh(markTid);
                    }
                })
            }

            if (window['processModal'] != void 0) {
                processModal.dialogClose();
            }
        })
        
        //监控删除内容
        editor.socket.on('doc wkitem delete', function (data) {
            var pushResult = JSON.parse(data);  
            if (pushResult.docWkItmId) {
                var $wk = $('.wd-wk[data-wkid='+pushResult.docWkItmId+']');
                if ($wk.length > 0) {
                    $wk.closest('.wd-wk-container').remove();
                }
            }
            //修改大纲内容标题颜色
            Outline.updateOutlineTitleColor(pushResult.outlineId,pushResult.changeStatus);
            //更新大纲树节点状态颜色
            tree.updateOutlineStatusColor(pushResult.outlineId,pushResult.changeStatus);
        })

        //监控新增内容
        editor.socket.on('doc wkitem add', function (data) {   
            var pushResult = JSON.parse(data);
            var $outline = Outline.findOutline(pushResult.outlineId);
            if ($outline.length > 0) {
                new VE.WkContent({
                    $outline: $outline,
                    data: pushResult.data
                }).create(function ($wk) {
                    editor.$editorBody.triggerHandler('wd.outline.content.bindedit', $outline);
                })
            }
            //修改大纲内容标题颜色
            Outline.updateOutlineTitleColor(pushResult.outlineId,pushResult.data.changeStatus);
            //更新大纲树节点状态颜色
            tree.updateOutlineStatusColor(pushResult.outlineId,pushResult.data.changeStatus);
        })

        //监控内容编辑
        editor.socket.on('doc wkitem edit', function (data) {
            var pushResult = JSON.parse(data);
            var $outline = Outline.findOutline(pushResult.outlineId);
            if ($outline.length > 0) {
                var $wk = $outline.find('.wd-wk[data-wkid='+pushResult.wkId+']');
                if ($wk.length > 0) {
                    $wk.find('.wd-wk-content').html(pushResult.content);
                }
            }
            //修改大纲内容标题颜色
            Outline.updateOutlineTitleColor(pushResult.outlineId,pushResult.docOutlineChangeStatus)
            if (typeof(pushResult.wkItmChangeStatus) != "undefined"){
                var $parentWk = $wk.parent();
                //修改大纲内容框状态颜色
                Outline.updateOutlineContentBoxColor($parentWk,pushResult.wkItmChangeStatus);
            }
            //更新大纲树节点状态颜色
            tree.updateOutlineStatusColor(pushResult.outlineId,pushResult.docOutlineChangeStatus);
        })

        //监控内容上传
        editor.socket.on('doc wkitem upload', function (data) {
            var pushResult = JSON.parse(data);
            var $outline = Outline.findOutline(pushResult.outlineId);
            if ($outline.length > 0) {
                var $wk = $outline.find('.wd-wk[data-wkid='+pushResult.wkId+']');
                if ($wk.length > 0) {
                    $wk.find('.wd-wk-content').html(pushResult.content);
                }
            } 
            //修改大纲内容标题颜色
            Outline.updateOutlineTitleColor(pushResult.outlineId,pushResult.docOutlineChangeStatus)
            if (typeof(pushResult.wkItmChangeStatus) != "undefined"){
                var $parentWk = $wk.parent();
                //修改大纲内容框状态颜色
                Outline.updateOutlineContentBoxColor($parentWk,pushResult.wkItmChangeStatus)
            }
            //更新大纲树节点状态颜色
            tree.updateOutlineStatusColor(pushResult.outlineId,pushResult.docOutlineChangeStatus);
        })

        //监控下载进度消息
        editor.socket.on('download msg', function (code, data) {
            downloadModal.$processText.append('<li>'+data+'</li>');
            downloadModal.$processCurText.text('当前位置：'+data);
        })
        //监控下载进度百分比
        editor.socket.on('download percent', function (code, percent) {
            downloadModal.init(percent);
        })
        //监控下载开始
        editor.socket.on('download start', function (code, data) {
            var $container =  downloadModal.$processText.append('<li>'+data+'</li>');
            $container.scrollTop($container[0].scrollHeight);
        })
        //监控下载结束
        editor.socket.on('download end', function (code, opertaskId) {
            downloadModal.$processStatus.text('文件生成完成');
            setTimeout(function () {
                downloadModal.dialogClose(function () {
                    vrmEditor.LOCK.removeDocLock();
                });
            },2000);

            WD_URL.rest.download(config.downloadFile() + "?opertaskId=" + opertaskId);
        })
        //监控下载错误
        editor.socket.on('download error', function (code, data) {
            downloadModal.$processStatus.text('文件生成失败');
            downloadModal.$processText.append('<li>文件生成失败</li>');

            //锁定文档下载异常自动解锁
            if (downloadModal.data.type == 1) {
                vrmEditor.LOCK.removeDocLock();
            }
           
            var code = /^VP(\d{1})/.exec(code)[1]

            if (code == 3) {
                show_message(data, "error");
            } else {
                show_message(data, "warning");
            }
        })
    })
})(window, jQuery);


//状态变化刷新内容
(function(window, $) {
    var VE = window.vrmEditor;

    VE.plugin(function () {
        var editor = this;
        var tree =  this.docstruct.tree;
        editor.checkRefreshContent = function () {
            if (editor.__status__ == 'tick-refresh-content') {
                var treeNodes = tree.getSelectedNodes();
                var markTid = null;
                if (vpCommons.isArray(treeNodes) && treeNodes.length > 0) {
                    markTid = treeNodes[0].tid;
                }
                tree.refreshTree(function () {
                    if (vpCommons.isNotEmpty(markTid)) {
                        tree.locationById(markTid);
                        editor.content.pageDataLoader.refreshWithLocation(markTid);
                    } else {
                        editor.content.pageDataLoader.refresh(markTid);
                    }
                })
            }  
        }
    });

})(window, jQuery);