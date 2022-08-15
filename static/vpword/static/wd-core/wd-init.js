//扩展自定义内容保存
(function (window, $) {
    var VE = window.vrmEditor;
    if (!VE) {
        return;
    }

    VE.plugin(function () {
        var editor = this;
        VE.editorContentSave = function () {
            if (editor.myeditor.editing()) {
                var $outline = editor.myeditor.getEditOutlineTarget(),
                    wkid = $outline.find('.wd-wk').data("wkid");

                editor.myeditor.saveExitEdit(function () {
                    var self = this;
                    var content = self.ueditor.getContent() || '<p></p>';
                    WD_URL.rest.ajaxMask({
                        url: config.saveContentUrl(),
                        type: 'PUT',
                        data: {docWkItmId: wkid, wkItmContent: content},
                        maskinfo: '保存中...'
                    }, function (json) {
                        show_message("保存成功", "success");
                    })
                })           
            }
        }
    })
})(window, jQuery);

//header toolbar menu init
(function (VE, $) {
    // 创建文件菜单
    VE.createHeaderToolBarMenu(function () {
        var editor = this;
        var headerMenu = new VE.HeaderMenu({
            id          : 'file',
            optId       : 'headermenu-file',
            title       : '文件',
            editor      : editor,
            dropDownList: new VE.DropDownList({
                editor : editor,
                data: [
                    {
                        optId   : 'headermenu-file-lockdown',
                        text    : '锁定下载',
                        clickEvent: function () {
                            message_dialog('Confirm', {
                                content: '是否锁定下载文档',
                                confirm: function () {
                                    window.vrmEditor.CHECK.checkAllLock().then(function () {
                                        window.vrmEditor.LOCK.addDocLock();
                                        vpUtils.modeWithSave({
                                            url: config.downloadHtml(),
                                            title: '下载提示',
                                            onshown: function (dialog) {
                                                downloadModal.setEventData('doc download',{
                                                    docId: config.getDocId(),
                                                    type : 1
                                                })
                                                downloadModal.setDialog(dialog);
                                            },
                                            btns:[]
                                        })
                                    });
                                }
                            })
                        }
                    },
                    {
                        optId   : 'headermenu-file-unlockupload',
                        text    : '解锁上传',
                        clickEvent: function () {
                            var self = this;
                            VE.CHECK.checkAllLock().then(function (){
                                vpUtils.modeWithSave({
                                    url: config.uploadDoc(),
                                    title: '上传文档',
                                    onshown: function (dialog) {
                                        //加载数据
                                        uploadForm.loadData(dialog, {
                                            docId: config.getDocId(),
                                            url: config.uploadDocUrl(),
                                            tree: self.docstruct.tree
                                        });
                                    },
                                    ok_callback: function (dialog) {
                                        uploadForm.save(dialog);
                                    }
                                })
                            });
                        }
                    },
                    {
                        optId   : 'headermenu-file-savelocal',
                        text    : '保存为本地文件',
                        clickEvent: function () {
                            message_dialog('Confirm', {
                                content: '是否下载文档',
                                confirm: function () {
                                    vpUtils.modeWithSave({
                                        url: config.downloadHtml(),
                                        title: '下载提示',
                                        onshown: function (dialog) {
                                            downloadModal.setEventData('doc download',{
                                                docId: config.getDocId(),
                                                type : 0
                                            })
                                            downloadModal.setDialog(dialog);
                                        },
                                        btns:[]
                                    })
                                }
                            })
                        }
                    }
                ]
            })
        });
        return headerMenu;
    });
    // 创建编辑菜单
    VE.createHeaderToolBarMenu(function () {
        var editor = this;
        var headerMenu = new VE.HeaderMenu({
            id          : 'edit',
            optId       : 'headermenu-edit',
            title       : '编辑',
            editor      : editor,
            dropDownList: new VE.DropDownList({
                editor : editor,
                data: [
                    {
                        optId   : 'headermenu-edit-exit',
                        text    : '退出编辑区域',
                        disable : function () {
                            return !editor.myeditor.editing();
                        },
                        clickEvent: function () {
                            if (editor.myeditor.editing()) {
                                var $outline = editor.myeditor.getEditOutlineTarget(),
                                    $edit = $outline.find('.wk-edit-widget'),
                                    $exitEdit = $outline.find('.wk-exit-widget'),
                                    wkid = $outline.find('.wd-wk').data("wkid");
    
                                    message_dialog('Confirm', {
                                        content: '退出编辑区域',
                                        confirmButton: '保存退出',
                                        confirm: function () {
                                            editor.myeditor.saveExitEdit(function () {
                                                var self = this;
                                                var content = self.ueditor.getContent() || '<p></p>';
                                                var outlineId = $outline.data('outlineid');
                                                WD_URL.rest.ajaxMask({
                                                    url: config.saveContentUrl(),
                                                    type: 'PUT',
                                                    data: {docWkItmId: wkid, wkItmContent: content},
                                                    maskinfo: '保存中...'
                                                }, function (json) {
                                                    self.saveExitEditOkFn(function () {
                                                        $exitEdit.addClass('wd-hide');
                                                        $edit.removeClass('wd-hide');
                                                        VE.LOCK.removeDocOutlineLock(outlineId);
                                                        show_message('操作成功,点击添加修订记录','info', { 
                                                               onclick:function () {
                                                                    vpUtils.modeWithSave({
                                                                        url: config.toAddRevise(),
                                                                        size: BootstrapDialog.SIZE_WIDE,
                                                                        title: '添加修订记录',
                                                                        onshown: function (dialog) {
                                                                            dialog.$outline = $outline;
                                                                            dialog.$modalDialog.css('width', $(window).width() * 0.6);
                                                                            // 加载数据
                                                                            recordForm.loadData(dialog, {
                                                                                dataType: 3,
                                                                                addReviseType:1,
                                                                                changeType:2,
                                                                                docOutlineId: outlineId,
                                                                                reportHtml:json.reportHtml,
                                                                                orgdocWkItmContent:json.orgdocWkItmContent,
                                                                                newdocWkItmContent:json.newdocWkItmContent,
                                                                                beforeContent:json.beforeContent,
                                                                                afterContent : json.afterContent,
                                                                                url:config.saveReviseUrl()
                                                                            });
                                                                            
                                                                        }, ok_callback: function (dialog) {
                                                                            recordForm.save();
                                                                        }                                        
                                                                    });
                                                                },
                                                                "timeOut": "8000"
                                                            }
                                                        );

                                                        editor.checkRefreshContent();
                                                    })
                                                    show_message("保存成功", "success");
                                                })
                                            });
                                        },
                                        cancelButton: '退出',
                                        cancel: function () {
                                            editor.myeditor.exitEdit(function () {
                                                $exitEdit.addClass('wd-hide');
                                                $edit.removeClass('wd-hide');
                                                VE.LOCK.removeDocOutlineLock($outline.data('outlineid'));
                                                editor.checkRefreshContent(); 
                                            });
                                        }
                                    })
                            } else {
                                show_message("暂无内容正在进行编辑!", 'warning');
                            }
                        }
                    },
                    {
                        optId   : 'headermenu-edit-location',
                        text    : '定位编辑区域',
                        disable : function () {
                            return !editor.myeditor.editing();
                        },
                        clickEvent: function () {
                            if (editor.myeditor.editing()) {
                                var $outline = editor.myeditor.getEditOutlineTarget();
                                if ($outline && $outline.length > 0) {
                                    editor.content.pageDataLoader.location($outline.data('outlineid'))
                                }
                            } else {
                                show_message("暂无内容进行编辑!", 'warning');
                            }
                        }
                    }
                ]
            })
        });
        return headerMenu;
    });

    // 创建视图菜单
    VE.createHeaderToolBarMenu(function () {
        var editor = this;

        var headerMenu = new VE.HeaderMenu({
            id          : 'view',
            optId       : 'headermenu-view',
            title       : '视图',
            editor      : editor,
            dropDownList: new VE.DropDownList({
                editor : editor,
                data: [
                    {
                        optId   : 'headermenu-view-content',
                        text    : '内容视图',
                        clickEvent: function () {
                            var editor = this;
                            editor.view.render('content');
                          
                        }
                    },
                    {
                        optId   : 'headermenu-view-outline',
                        text    : '大纲视图',
                        clickEvent: function () {
                            var editor = this;
                            editor.view.render('outline', '大纲视图');
                        }
                    },
                    {
                        optId   : 'headermenu-view-point',
                        text    : '条目大纲视图',
                        clickEvent: function () {
                            var editor = this;
                            editor.view.render('point', '条目大纲视图');
                        }
                    }
                ]
            })
        });
        //页面中插入模态框
        return headerMenu;
    });

    // 创建需求管理菜单
    VE.createHeaderToolBarMenu(function () {
        var editor = this;

        var headerMenu = new VE.HeaderMenu({
            id          : 'advFunc',
            optId       : 'headermenu-advfunc',
            title       : '需求管理',
            editor      : editor,
            dropDownList: new VE.DropDownList({
                editor : editor,
                data: [
                    {
                        optId   : 'headermenu-advfunc-doclock',
                        text    : '文档锁信息',
                        clickEvent: function () {
                            BootstrapDialog.show({
                                title: "文档锁信息",
                                closable: true,
                                message: function () {
                                    return $('<div></div>').load(config.toLock());
                                },
                                onshow: function (dialog) {
                                    dialog.$modalDialog.css('width', $(window).width() * 0.85);
                                },
                                size: 'size-wide',
                                buttons: [{
                                    label: "关闭",
                                    cssClass: "btn-primary",
                                    icon: "fa fa-times-circle",
                                    action: function (dialog) {
                                        dialog.close();
                                    }
                                }
                                ]
                            });
                        }
                    },
                    {
                        optId   : 'headermenu-advfunc-lookrevise',
                        text    : '查看修订记录', 
                        clickEvent: function () {
                            vpUtils.modeWithClose({
                                title: "查看修订记录",
                                size: BootstrapDialog.SIZE_WIDE,
                                url: config.toRevise(),
                                onshown: function (dialog) {
                                    dialog.$modalDialog.css('width', $(window).width() * 0.7);
                                    reviseRecord.loadData(dialog);
                                }
                            });
                        }
                    },
                    {
                        optId   : 'headermenu-advfunc-batchsetpoint',
                        text    : '批量设置条目',
                        clickEvent: function () {
                            vpUtils.modeWithSave({
                                title: "批量设置条目",
                                size: BootstrapDialog.SIZE_WIDE,
                                url: config.toControlPoint(),
                                onshown: function (dialog) {
                                    dialog.$modalDialog.css('width', $(window).width() * 0.7);
                                    ctlPointTree.loadData(dialog, {
                                        tree: editor.docstruct.tree
                                    });
                                },
                                ok_callback: function (dialog) {
                                    ctlPointTree.saveCtlPoint();
                                }
                            });
                        }
                    },
                    {
                        optId   : 'headermenu-advfunc-reqkitbox',
                        text    : '需求工具箱',
                        clickEvent: function () {
                            var editor = this;
                            if (!editor.reqkitbox) {
                                editor.reqkitbox = true;
                                layer.open({
                                    type: 1,
                                    anim:2,
                                    title:'需求工具箱',
                                    shade:false,
                                    offset: 'rt',
                                    content: '<div id="reqkitbox"></div>',
                                    shadeClose:true,
                                    area: ['30%','80%'],
                                    success : function (layero, index) {
                                        vpUtils.loadPage(layero.find('#reqkitbox'), config.reqKitBoxHtml())
                                    },
                                    end : function () {
                                        editor.reqkitbox = false;
                                    }
                                })
                            }
                        }
                    }
                ]
            })
        });
        return headerMenu;
    });
})(window.vrmEditor, $);

//DocStruct menu
(function (VE, $) {

    VE.DocStructMenu.createMenuItem(function () {
        return new VE.DocStructMenuItem({
            id      : 'expandAll',
            optId   : 'docstruct-menu-expandall',
            text    : '全部展开',
            icon    : 'fa-plus',
            clickEvent: function () {
                var menu = this;
                menu.docstruct.tree.expandAll(true);
            }
        });
    });

    VE.DocStructMenu.createMenuItem(function () {
        return new VE.DocStructMenuItem({
            id      : 'flodAll',
            optId   : 'docstruct-menu-flodall',
            text    : '全部折叠',
            icon    : 'fa-minus',
            clickEvent: function () {
                var menu = this;
                menu.docstruct.tree.expandAll(false);
            }
        });
    });

    VE.DocStructMenu.createMenuItem(function () {
        return new VE.DocStructMenuItem({
            id      : 'refreshAll',
            optId   : 'docstruct-menu-refreshall',
            text    : '刷新大纲和内容',
            icon    : 'fa-refresh',
            clickEvent: function () {
                var menu = this;
                menu.docstruct.tree.refreshTreeAndContent();
            }
        });
    });

    VE.DocStructMenu.createMenuItem(function () {
        return new VE.DocStructMenuItem({
            id      : 'setOrginalNo',
            optId   : 'docstruct-menu-setorginalno',
            text    : '设置起始章节号',
            icon    : 'fa-gear',
            clickEvent: function () {
                var menu = this;
                vpUtils.modeWithSave({
                    url: config.toSetStart(),
                    title: '设置起始章节号',
                    onshown: function (dialog) {
                        //加载数据
                        startNumForm.loadData(dialog, {
                            url: config.setStart(),
                            tree: menu.docstruct.tree
                        });
                    },
                    ok_callback: function (dialog) {
                        startNumForm.save(dialog);
                    }
                });
            }
        });
    });
})(window.vrmEditor, $);

//tree menu
(function () {
    var VE = window.vrmEditor;
    var $ = window.jQuery;
    var Outline = VE.Outline;

    //适用vrm
    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'setBusflag',
            optId   : 'tree-menu-setbusflag',
            text    : '设置条目',
            //是否显示  show不存在时默认显示
            show: function (treeNode) {
                return !treeNode.propertys.busFlag;
            },
            clickEvent: function (treeNode) {
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    WD_URL.rest.ajaxMask({
                        url: config.setControlPointUrl(),
                        type: 'PUT',
                        data: {
                            outlineIds: treeNode.tid,
                            busFlag:1
                        },
                        dataType: 'json',
                        maskinfo: '设置中...'
                    }, function (json) {
                        show_message("设置成功！", "success");
                    }, function () {
                        show_message("设置失败！", "error");
                    })
                })
            }
        });
    });

    //适用vrm
   /* VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'editbusflag',
            optId   : 'tree-menu-editbusflag',
            text    : '属性编辑',
            //是否显示  show不存在时默认显示
            show: function (treeNode) {
                return treeNode.propertys.busFlag;
            },
            clickEvent: function (treeNode) {
                WD_URL.rest.ajax({
                    url: config.getDocArtInsInfo(),
                    type:'GET',
                    data:{
                        docId : config.getDocId(),
                        uuid : treeNode.outlineUuid
                    }
                }, function (data) {
                    if (data) {
                        layer.open({
                            type: 2,
                            title:data.sname,
                            shadeClose:true,
                            area: ['70%','100%'],
                            anim:2,
                            move:false,
                            offset: 'rt',
                            content: vp.config.URL.appMainUrl+'#/vrm/artdetail/'+data.ientityid+'/'+data.iid
                        });
                    } else {
                        show_message('数据丢失','error');
                    }
                })
            }
        });
    }); */

    //适用vrm
    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'cancelBusflag',
            optId   : 'tree-menu-cancelbusflag',
            text    : '取消条目',
            //是否显示  show不存在时默认显示
            show: function (treeNode) {
                return !!treeNode.propertys.busFlag;
            },
            clickEvent: function (treeNode) {
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    message_dialog('Confirm', {
                        content: '确定取消条目?',
                        confirm: function () {
                            WD_URL.rest.ajaxMask({
                                url: config.cancelControlPoint(),
                                type: 'PUT',
                                data: {outlineIds: treeNode.tid},
                                dataType: 'json',
                                maskinfo: '取消中...'
                            }, function (json) {
                                show_message("取消成功！", "success");
                            }, function () {
                                show_message("取消失败", "error");
                            })
                        }
                    });
                })
            }
        });
    });

    //适用odm
    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'onlysetbusflag',
            optId   : 'tree-menu-onlysetbusflag',
            text    : '设置条目',
            //是否显示  show不存在时默认显示
            show: function (treeNode) {
                return !treeNode.propertys.busFlag;
            },
            clickEvent: function (treeNode) {
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    WD_URL.rest.ajaxMask({
                        url: config.onlySetControlPoint(),
                        type: 'PUT',
                        data: {outlineIds: treeNode.tid, busFlag:1},
                        dataType: 'json',
                        maskinfo: '设置中...'
                    }, function (json) {
                        show_message("设置成功！", "success");
                    }, function () {
                        show_message("设置失败！", "error");
                    })
                })
            }
        });
    });

    //适用odm
    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'onlycancelbusflag',
            optId   : 'tree-menu-onlycancelbusflag',
            text    : '取消条目',
            //是否显示  show不存在时默认显示
            show: function (treeNode) {
                return !!treeNode.propertys.busFlag;
            },
            clickEvent: function (treeNode) {
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    message_dialog('Confirm', {
                        content: '确定取消条目?',
                        confirm: function () {
                            WD_URL.rest.ajaxMask({
                                url: config.onlyCancelControlPoint(),
                                type: 'PUT',
                                data: {outlineIds: treeNode.tid},
                                dataType: 'json',
                                maskinfo: '取消中...'
                            }, function (json) {
                                show_message("取消成功！", "success");
                            }, function () {
                                show_message("取消失败", "error");
                            })
                        }
                    });
                })
            }
        });
    });


    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'rename',
            optId   : 'tree-menu-rename',
            text    : '重命名大纲',
            clickEvent: function (treeNode) {
                var tree = this;
                window.vrmEditor.CHECK.checkOutlineInfoAndAddLock(treeNode.tid).then(function () {
                        vpUtils.modeWithSave({
                            url: config.toOutlineRename(),
                            title: '大纲重命名',
                            onshown: function (dialog) {
                                //加载数据
                                outlineForm.loadData(dialog, {
                                    tree: tree,
                                    docOutlineId: treeNode.tid,
                                    parentId: treeNode.pid,
                                    outlineName : treeNode.name.replace(treeNode.origChapNum,"")
                                });
                            },
                            ok_callback: function (dialog) {
                                outlineForm.save(dialog);
                            },
                            cancel_callback: function (dialog) {
                                window.vrmEditor.LOCK.removeDocOutlineLock(treeNode.tid);
                            }
                        });
                    }
                );
            }
        });
    });

    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'delOutline',
            optId   : 'tree-menu-deloutline',
            text    : '删除大纲',
            clickEvent: function (treeNode) {
                var tree = this;
                var pNode = treeNode.getParentNode();
                window.vrmEditor.CHECK.checkOutlineChildInfo(treeNode.tid).then(function () {
                    message_dialog('Confirm', {
                        content: '确定删除此大纲吗?',
                        confirm: function () {
                            WD_URL.rest.ajaxMask({
                                url: config.deleteOutlineUrl()+"&docOutlineId="+treeNode.tid,
                                type: 'DELETE',
                                dataType: 'json',
                                maskinfo: '删除中...'
                            }, function (json) {
                                show_message("删除成功!", "success");
                                //触发父节点寻找祖先条目变化
                                if (pNode) {
                                    VE.SUBSCRIBE.docArtChange(pNode.tid);  
                                }
                            }, function () {
                                show_message("删除失败", "error");
                            })
                        }
                    })
                })
            }
        });
    });

   
    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'addOutlineLower',
            optId   : 'tree-menu-addoutlinelower',
            text    : '新增大纲【下级】',
            clickEvent: function (treeNode) {
                var tree = this;
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    vpUtils.modeWithSave({
                        url: config.toAddOutline(),
                        title: '新增大纲【下级】',
                        onshown: function (dialog) {
                            //加载数据
                            addOutlineForm.loadData({
                                dialog: dialog,
                                tree:tree,
                                docOutlineId: treeNode.tid,
                                parentId : treeNode.tid,
                                positionType: 3
                            });
                        },
                        ok_callback: function (dialog) {
                            addOutlineForm.save();
                        }
                    })
                })
            }
        });
    });

    

    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'addOutlineSiblingAbove',
            optId   : 'tree-menu-addoutlinesiblingabove',
            text    : '新增大纲【同级上方】',
            clickEvent: function (treeNode) {
                var tree = this;
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    vpUtils.modeWithSave({
                        url: config.toAddOutline(),
                        title: '新增大纲【同级上方】',
                        onshown: function (dialog) {
                            //加载数据
                            addOutlineForm.loadData({
                                dialog: dialog,
                                tree : tree,
                                docOutlineId: treeNode.tid,
                                parentId : treeNode.pid,
                                positionType: 1
                            });

                        },
                        ok_callback: function (dialog) {
                            addOutlineForm.save(dialog);
                        }
                    })
                 })
            }
        });
    });

    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'addOutlineSiblingLower',
            optId   : 'tree-menu-addoutlinesiblinglower',
            text    : '新增大纲【同级下方】',
            clickEvent: function (treeNode) {
                var tree = this;
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    vpUtils.modeWithSave({
                        url: config.toAddOutline(),
                        title: '新增大纲【同级下方】',
                        onshown: function (dialog) {
                            //加载数据
                            addOutlineForm.loadData({
                                dialog: dialog,
                                tree : tree,
                                docOutlineId: treeNode.tid,
                                parentId : treeNode.pid,
                                positionType: 2
                            });
                        },
                        ok_callback: function (dialog) {
                            addOutlineForm.save(dialog);
                        }
                    })
                })
            }
        });
    });


    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'uploadInner',
            optId   : 'tree-menu-uploadinner',
            text    : '导入文档【下级】',
            clickEvent: function (treeNode) {
                var tree = this;
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    vpUtils.modeWithSave({
                        url: config.toImportOutline(),
                        title: '导入文档【下级】',
                        ok_callback: function (dialog) {
                            importOutlineForm.save({
                                dialog: dialog,
                                tree : tree,
                                docOutlineId: treeNode.tid,
                                positionType: 3
                            });
                        }
                    })
                })
            }
        });
    });

    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'uploadPrev',
            optId   : 'tree-menu-uploadprev',
            text    : '导入文档【同级上方】',
            clickEvent: function (treeNode) {
                var tree = this;
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    vpUtils.modeWithSave({
                        url: config.toImportOutline(),
                        title: '导入文档【同级上方】',
                        ok_callback: function (dialog) {
                            importOutlineForm.save({
                                dialog: dialog,
                                tree : tree,
                                docOutlineId: treeNode.tid,
                                positionType: 1
                            });
                        }
                    })
                })
            }
        });
    });

    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'uploadNext',
            optId   : 'tree-menu-uploadnext',
            text    : '导入文档【同级下方】',
            clickEvent: function (treeNode) {
                var tree = this;
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    vpUtils.modeWithSave({
                        url: config.toImportOutline(),
                        title: '导入文档【同级下方】',
                        ok_callback: function (dialog) {
                            importOutlineForm.save({
                                dialog: dialog,
                                tree : tree,
                                docOutlineId: treeNode.tid,
                                positionType: 2
                            });
                        }
                    })
                })
            }
        });
    });

    
    //锁定下载大纲下的所有
    VE.TreeMenu.createMenuItem(function () { 
        return new VE.TreeMenuItem({
            id      : 'downloadbyoutline',
            optId   : 'tree-menu-downloadbyoutline',
            text    : '锁定下载',
            clickEvent: function (treeNode) {
                var tree = this;
                window.vrmEditor.CHECK.checkOutlineChildInfo(treeNode.tid).then(function () {
                    message_dialog('Confirm', {
                        content: '确定下载大纲下所有内容?',
                        confirm: function () {
                            //添加大纲下载锁信息
                            window.vrmEditor.LOCK.addDocOutlineDownloadLock(treeNode.tid).then(function(){
                                vpUtils.modeWithSave({
                                    url: config.downloadHtml(),
                                    title: '下载提示',
                                    onshown: function (dialog) {
                                        downloadModal.setEventData('doc download outline part',{
                                            docId: config.getDocId(),
                                            outlineId:treeNode.tid,
                                            startOrigChapNum:treeNode.origChapNum,  //起始章节号
                                            type : 1
                                        })
                                        downloadModal.setDialog(dialog);
                                    },
                                    btns:[]
                                })
                            });
                        }
                    })
                })
            }
        });
    });

    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id: 'uploadreplaceoutline',
            optId: 'tree-menu-uploadreplaceoutline',
            text: '解锁上传',
            clickEvent: function (treeNode) {
                var self = this;
                window.vrmEditor.CHECK.checkOutlineChildInfo(treeNode.tid).then(function () { //验证所选大纲及其所有子大纲下是否有锁
                    vpUtils.modeWithSave({
                        url: config.uploadDocOutline(),
                        title: '上传文档',
                        onshown: function (dialog) {
                            //加载数据
                            uploadForm.loadData(dialog, {
                                docId: config.getDocId(),
                                outlineId: treeNode.tid,
                                outlineUuid: treeNode.outlineUuid,
                                startOrigChapNum: treeNode.origChapNum,
                                url: config.uploadDocUrl(),
                                tree: self.docstruct.tree
                            });
                        },
                        ok_callback: function (dialog) {
                            uploadForm.save(dialog);
                        }
                    })
                })
            }
        });
    });
    

   VE.TreeMenu.createMenuItem(function () {
       return new VE.TreeMenuItem({
           id: 'upGradeOutline',
           optId: 'tree-menu-upgradeoutline',
           text: '升级大纲',
           clickEvent: function (treeNode) {
               var pNode = treeNode.getParentNode();
               if (pNode) {
                    var tree = this;
                    window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                        message_dialog('Confirm', {
                            content: '确定升级此大纲吗?',
                            confirm: function () {
                                WD_URL.rest.ajaxMask({
                                    url: config.outlineUpGrade(),
                                    type: 'PUT',
                                    dataType: 'json',
                                    data: {
                                        docOutlineId: treeNode.tid,
                                        changeType: 'up'
                                    },
                                    maskinfo: '升级中...'
                                }, function (json) {
                                    show_message("升级成功!", "success");
                                    tree.refreshTreeAndContent();
                                })
                            }
                        })
                    })
               } else {
                    show_message("已经是顶级大纲，不允许升级!", "warning");
               }
           }
       });
   });

    VE.TreeMenu.createMenuItem(function () {
        return new VE.TreeMenuItem({
            id      : 'deGradeOutline',
            optId   : 'tree-menu-degradeoutline',
            text    : '降级大纲',
            clickEvent: function (treeNode) {
                var tree = this;
                window.vrmEditor.CHECK.checkOutlineInfo(treeNode.tid).then(function () {
                    message_dialog('Confirm', {
                        content: '确定降级此大纲吗?',
                        confirm: function () {
                            WD_URL.rest.ajaxMask({
                                url: config.outlineUpGrade(),
                                type: 'PUT',
                                dataType: 'json',
                                data : {docOutlineId:treeNode.tid,changeType:'de'},
                                maskinfo: '降级中...'
                            }, function (json) {
                                show_message("降级成功!", "success");
                                tree.refreshTreeAndContent();
                            })
                        }
                    })
                })
            }
        });
    });

})(window);

//tree 事件功能
(function () {
    var VE = window.vrmEditor;
    var $ = window.jQuery;

    var Tree = VE.Tree;

    //树插件
    VE.pluginTreeRender(function (tree) {
        var editor = this;
        VE.log('------------pluginTreeRender--------------');
    })

    /**
     * 控制菜单显示
     * @return {boolean}
     */
    Tree.fn.enableMenu = function () {
        return true;
    }

    Tree.fn.onBeforeClick = function (treeId, treeNode) {
        var tree = this;
        VE.log("tree node click before");
        return true;
    }

    Tree.fn.onClick = function (event, treeId, treeNode) {
        var tree = this;
        VE.log("tree node tree click");
    }

    Tree.fn.onRightClick = function (event, treeId, treeNode) {
        var tree = this;
        VE.log("tree node tree right click");
    }

    Tree.fn.onBeforeDrop = function (treeId, treeNodes, targetNode, moveType, isCopy) {
        var tree = this;
        WD_URL.rest.ajaxMask({
               url: config.moveOutline(),
               type: 'PUT',
               maskinfo: '移动中...',
               async:false,
               data:{
                    moveType:moveType,
                    docOutlineId:treeNodes[0].tid,
                    targetOutlineId:targetNode.tid
               }
           }, function () {
               show_message("移动成功！", "success");
               return true;
           });
           return false;
    }

    Tree.fn.onDrop = function (event, treeId, treeNodes, targetNode, moveType, isCopy) {
        var tree = this;
        VE.log("tree draw tree drop");
    }
})(window);

//content outline menu
(function () {

    var VE = window.vrmEditor;
    var $ = window.jQuery;

    VE.plugin(function () {
        VE.info('---------------初始化outline menu骨架开始 plugin-------------------');
        var editor = this;
        var outlineMenu = editor.skeleton.outlineMenu = new VE.OutlineMenu({
            optId : 'outline-menu',
            editor: editor,
            show: function () {
                return true;
            }
        });

        //默认创建
        var menuItem0 = new VE.OutlineMenuItem({
            optId   : 'outline-menu-location',
            title   : '定位大纲',
            type    : 'button',
            icon    : 'fa-map-marker',
            clickEvent: function () {
                var menu = this;
                menu.editor.docstruct.tree.locationById(menu.$outline.data("outlineid"));
            }
        });

        //默认创建
        var menuItem1 = new VE.OutlineMenuItem({
            optId   : 'outline-menu-addcontent',
            title   : '加内容',
            type    : 'button',
            icon    : 'fa-plus',
            disable : function () {
                var menu = this;
                return menu.$outline.find('.wd-wk').length > 0;
            },
            clickEvent: function () {
                var menu = this;
                VE.CHECK.checkOutlineInfo(menu.$outline.data("outlineid")).then(function (){
                    WD_URL.rest.ajax({
                        url: config.addContentUrl(),
                        data: {docOutlineId: menu.$outline.data("outlineid")},
                        type: "POST"
                    }, function (data) {
                        show_message('内容添加成功','success');
                    });
                })
            }
        });

        var menuItem2 = new VE.OutlineMenuItem({
            optId   : 'outline-menu-addrevise',
            title   : '添加修订记录',
            type    : 'button',
            icon    : 'fa-tags',
            show: function () {
                var menu = this;
                return true;
            },
            clickEvent: function () {
                var menu = this;
                var docOutlineId = menu.$outline.data("outlineid");
                
                WD_URL.rest.ajax({
                    url: config.getOutlineDiffHtmlUrl()+"?docOutlineId="+docOutlineId,
                    type: 'GET'
                }, function (json) {
                    vpUtils.modeWithSave({
                        url: config.toAddRevise(),
                        size: BootstrapDialog.SIZE_WIDE,
                        title: '添加修订记录',
                        onshown: function (dialog) {
                            dialog.$outline = menu.$outline;
                            dialog.$modalDialog.css('width', $(window).width() * 0.6);
                            //加载数据
                            recordForm.loadData(dialog, {
                                dataType: 2,
                                changeType:2,
                                docOutlineId: docOutlineId,
                                reportHtml:json.reportHtml,
                                beforeContent:json.beforeContent,
                                afterContent : json.afterContent
                            });
                            
                        },
                        ok_callback: function (dialog) {
                            recordForm.save();
                        }
                    });
                });      
            }
        });

        //添加预定义菜单项
        outlineMenu.addMenuItem(menuItem0);
        outlineMenu.addMenuItem(menuItem1);
        outlineMenu.addMenuItem(menuItem2);

        //自定义大纲功能菜单按钮
        VE.Content.customOutlineAppendMenuItemExt(outlineMenu);

        VE.info('---------------初始化outline menu骨架完毕 plugin-------------------');
    });
})(window);

//content wk content menu
(function () {

    var VE = window.vrmEditor;
    var $ = window.jQuery;

    VE.plugin(function () {
        VE.info('---------------初始化wkcontent menu骨架开始 plugin-------------------');
        var editor = this;
        var toolBox = editor.skeleton.wkToolBox = new VE.ToolBox({
            optId : 'outline-content-menu',
            editor: editor,
            show: function () {
                return true;
            }
        });


        var btnEdit = new VE.Button({
            optId       : 'outline-content-menu-edit',
            container   :  toolBox,
            text        : '编辑',
            style       : {
                className: 'btn-success',
                icon: 'fa-edit'
            },
            clickEvent  : function () {
                var self = this;
                var $outline = self.container.target.closest('.wd-outline');
                if (!editor.myeditor.editing()) {
                    VE.CHECK.checkOutlineInfoAndAddLock($outline.data("outlineid")).then(function (){
                        WD_URL.rest.ajax({
                            url: config.checkWkitmExistUrl(),
                            type: 'GET',
                            data: {docWkItmId: self.container.target.data("wkid")}
                        }, function (json) {
                            self.container.target.find('.wd-wk-content').html(json);
                            editor.myeditor.openEdit(self.container.target, self.container.target.find('.wd-wk-content'));
                            self.container.target.closest('.wd-wk-container').find('.wk-edit-widget').addClass('wd-hide');
                            self.container.target.closest('.wd-wk-container').find('.wk-exit-widget').removeClass('wd-hide');
                        });
                    });
                } else {
                    show_message("已存在内容正在编辑,即将自动至编辑区域！", "warning");
                    var $outline = editor.myeditor.getEditOutlineTarget();
                    if ($outline && $outline.length > 0) {
                        editor.content.pageDataLoader.location($outline.data('outlineid'))
                    }
                }
            }
        })

        var btnDel = new VE.Button({
            optId       : 'outline-content-menu-del',
            container   : toolBox,
            text        : '删除',
            style       : {
                className: 'btn-danger',
                icon: 'fa-trash-o'
            },
            clickEvent: function () {
                var self = this;
                var $outline = self.container.target.closest('.wd-outline');
                var menu =  $outline.data('menu');     

                VE.CHECK.checkOutlineInfo($outline.data("outlineid")).then(function (){
                    message_dialog('Confirm', {
                        content: '确定删除此条目吗?',
                        confirm: function () {
                            WD_URL.rest.ajaxMask({
                                url: config.deleteWkItmUrl() + '?docWkItmId=' + self.container.target.data("wkid"),
                                type: 'DELETE',
                                maskinfo: '删除中...'
                            }, function () {
                                VE.WkContent.getContainer(self.container.target).remove();
                                if (menu) {
                                    menu.render();
                                }
                                show_message("删除成功！", "success");
                                VE.SUBSCRIBE.docArtChange($outline.data("outlineid"));
                            })
                        }
                    })
                })
            }
        })

        var btnUploadDoc = new VE.Button({
            optId       : 'outline-content-menu-upload',
            container   : toolBox,
            text        : '上传',
            style       : {
                className: 'btn-info',
                icon: 'fa-upload'
            },
            clickEvent  : function () {
                var self = this;
                var $outline = self.container.target.closest('.wd-outline'); 

                VE.CHECK.checkOutlineInfo($outline.data("outlineid")).then(function (){
                    vpUtils.modeWithSave({
                        url: config.uploadWkItm(),
                        title: '上传条目内容',
                        onshown: function (dialog) {
                            //加载数据
                            wordContentFileForm.loadData(dialog, {
                                docWkItmId: self.container.target.data("wkid"),
                                url: config.uploadWkItmUrl()
                            });
                        },
                        ok_callback: function (dialog) {
                            dialog.$content = self.container.target.find(".wd-wk-content");
                            dialog.$outline = $outline;                            
                            wordContentFileForm.save(dialog);
                        }
                    });
                })
            }
        })

        var btnDownDoc = new VE.Button({
            optId       : 'outline-content-menu-download',
            container   : toolBox,
            text        : '下载',
            style       : {
                className: 'btn-info',
                icon: 'fa-download'
            },
            clickEvent: function () {
                var self = this;
                var $outline = self.container.target.closest('.wd-outline'); 

                VE.CHECK.checkOutlineInfo($outline.data("outlineid")).then(function (){
                    WD_URL.rest.ajaxMask({
                        url: config.getOperTaskIdUrl(),
                        type: 'GET',
                        data: {docWkItmId: self.container.target.data("wkid")},
                        maskinfo: '下载中...'
                    }, function (json) {
                        WD_URL.rest.download(config.downloadWkItmUrl() + "?opertaskId=" + json);
                        VE.LOCK.addDocOutlineLock($outline.data('outlineid'));
                    })
                })
            }
        })

        var addRevise = new VE.Button({
            optId       : 'outline-content-menu-addrevise',
            container   : toolBox,
            text        : '添加修订记录',
            style       : {
                className: 'btn-info',
                icon: 'fa-tags'
            },
            clickEvent  : function () {
                var self = this;
                var $outline = self.container.target.closest('.wd-outline'); 
                var docOutlineId = $outline.data("outlineid");
                
                WD_URL.rest.ajax({
                    url: config.getWkItmDiffHtmlUrl()+"?docOutlineId="+docOutlineId,
                    type: 'GET'
                }, function (json) {
                    vpUtils.modeWithSave({
                        url: config.toAddRevise(),
                        size: BootstrapDialog.SIZE_WIDE,
                        title: '添加修订记录',
                        onshown: function (dialog) {
                            dialog.$outline = $outline;
                            dialog.$modalDialog.css('width', $(window).width() * 0.6);
                            //加载数据
                            recordForm.loadData(dialog, {
                                dataType: 3,
                                docOutlineId: docOutlineId,
                                reportHtml:json.reportHtml,
                                orgdocWkItmContent:json.orgdocWkItmContent,
                                newdocWkItmContent:json.newdocWkItmContent,
                                beforeContent:json.beforeContent,
                                afterContent : json.afterContent,
                                url:config.saveReviseUrl(),
                            });
                            
                        },
                        ok_callback: function (dialog) {
                            recordForm.save();
                        }
                    });
                });                 
            }
        })

        //添加编辑内容骨架
        toolBox.addBtn(btnEdit);
        toolBox.addBtn(btnDel);
        toolBox.addBtn(btnUploadDoc);
        toolBox.addBtn(btnDownDoc);
        toolBox.addBtn(addRevise);

        //自定义大纲功能菜单按钮
        VE.Content.customContentAppendMenuItemExt(toolBox);

        VE.info('---------------初始化wkcontent menu骨架完毕 plugin-------------------');
    });
})(window);

//页面内容加载完毕后初始化操作
(function (window) {

    var VE = window.vrmEditor;
    var $ = window.jQuery;

    VE.pluginPageRender(function ($editorContent) {
        var editor = this;

        //获取大纲
        var $outlines = editor.$editorContent.find('div.wd-outline');

        //大纲内容绑定大纲操作
        $.each($outlines, function (i, outline) {

            var $outline = $(outline);


            //克隆骨架
            VE.clone(editor.skeleton.outlineMenu).bindMount($outline).render();

            //大纲绑定标签
            bindTags(editor, $outline);

            //绑定内容编辑按钮
            editor.$editorBody.triggerHandler('wd.outline.content.bindedit', $outline);

            //绑定tooltip事件
            VE.tooltip($outline);
        });
    })

    //大纲绑定标签
    function bindTags(editor, $outline) {

        var containerTags = new VE.OutlineTags({
            editor: editor,
            $outline: $outline
        });

        containerTags.createPostion($outline.find('.vrm-pannel-head'), 'after').render();
    }
})(window);

//wk content wk-edit-widget wk-exit-widget
(function () {

    var VE = window.vrmEditor;
    var $ = window.jQuery;

    VE.pluginPageRender(function ($editorContent) {
        var editor = this;

        editor.$editorBody.off('click','a.js-wk-btn-save');
        editor.$editorBody.off('click','a.js-wk-btn-cancel');

        editor.$editorBody.on('click', 'a.js-wk-btn-save', function () {
            var $exitEdit = $(this).closest('.wk-exit-widget'),
                $edit = $exitEdit.prev('.wk-edit-widget');
            wkid = $exitEdit.next('.wd-wk').data('wkid');

            editor.myeditor.saveExitEdit(function () {
                var self = this;
                var content = self.ueditor.getContent() || '<p></p>';
                var outlineId = $exitEdit.closest('.wd-outline').data('outlineid');
                WD_URL.rest.ajaxMask({
                    url: config.saveContentUrl(),
                    type: 'PUT',
                    data: {docWkItmId: wkid, wkItmContent: content},
                    maskinfo: '保存中...'
                }, function (json) {
                    self.saveExitEditOkFn(function () {
                        $exitEdit.addClass('wd-hide');
                        $edit.removeClass('wd-hide');
                        VE.LOCK.removeDocOutlineLock(outlineId);
                        show_message('操作成功,点击添加修订记录','info', {
                                onclick:function () {
                                    vpUtils.modeWithSave({
                                        url: config.toAddRevise(),
                                        size: BootstrapDialog.SIZE_WIDE,
                                        title: '添加修订记录',
                                        onshown: function (dialog) {
                                            dialog.$outline = $exitEdit.closest('.wd-outline');
                                            dialog.$modalDialog.css('width', $(window).width() * 0.6);
                                            //加载数据
                                            recordForm.loadData(dialog, {
                                                dataType: 3,
                                                addReviseType:1,
                                                changeType:2,
                                                docOutlineId: outlineId,
                                                reportHtml:json.reportHtml,
                                                orgdocWkItmContent:json.orgdocWkItmContent,
                                                newdocWkItmContent:json.newdocWkItmContent,
                                                beforeContent:json.beforeContent,
                                                afterContent : json.afterContent,
                                                url:config.saveReviseUrl(),
                                            });
                                            
                                        },
                                        ok_callback: function (dialog) {
                                            recordForm.save();
                                        }                                        
                                    });
                                },
                                timeOut: 8000
                            }
                        );
                        editor.checkRefreshContent();
                    })

                    VE.SUBSCRIBE.docArtChange(outlineId);
                })
            });
        })

        editor.$editorBody.on('click', 'a.js-wk-btn-cancel', function () {
            var $exitEdit = $(this).closest('.wk-exit-widget'),
                $edit = $exitEdit.prev('.wk-edit-widget');

            message_dialog('Confirm', {
                content: '是否强制退出，内容不做保存!',
                confirm: function () {
                    editor.myeditor.exitEdit(function () {
                        $exitEdit.addClass('wd-hide');
                        $edit.removeClass('wd-hide');
                        VE.LOCK.removeDocOutlineLock($exitEdit.closest('.wd-outline').data('outlineid'));
                        editor.checkRefreshContent();
                    });
                }
            })
        });
    });
})(window);

//batch set busflag
(function (window) {
    var VE = window.vrmEditor;
    var Outline = VE.Outline;
    var $ = window.jQuery;

    VE.pluginPageRender(function ($editorContent) {
        var editor = this;
        WD_URL.rest.ajax({
            url: config.getPoint(),
            type: 'GET'
        }, function (pointList) {
            $.each(pointList, function (k, outline) {
                Outline.addBusFlagTag(
                    Outline.findOutline(outline.outlineId),
                    outline.busFlag, 
                    outline.busFlagName, 
                    function () {
                        var self = this;
                        //移除掉大纲树里面的条目标识
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
                });
            })
        })
    })
})(window);


(function (window) {
    var VE = window.vrmEditor;
    var $ = window.jQuery;
    VE.pluginTreeRender(function (tree) {
        var editor = this;
        editor.docstruct.$dom.off('click','#addOutlineFirst');
        editor.docstruct.$dom.on('click', '#addOutlineFirst', function () {
            vpUtils.modeWithSave({
                url: config.toAddOutline(),
                title: '新增大纲',
                onshown: function (dialog) {
                    //加载数据
                    addOutlineForm.loadData({
                        dialog: dialog,
                        tree:editor.docstruct.tree
                    });
                },
                ok_callback: function (dialog) {
                    addOutlineForm.save();
                }
            });
        })
    })
})(window);


(function (window) {
    var VE = window.vrmEditor;
    var Outline = VE.Outline;
    var $ = window.jQuery;

    VE.pluginPageRender(function ($editorContent) {
        var editor = this;
        var $outlines = editor.$editorContent.find('div.wd-outline');
        WD_URL.rest.ajax({
            url     : config.listOutLineIdsUrl(),
            type:'GET'
        }, function (json) {
            if(json&&json.length>0){
                $.each($outlines, function (i, outline) {
                    var $outline = $(outline),
                        outlineId = $outline.data('outlineid');
                    var index = $.inArray(parseInt(outlineId),json);
                    if(index >= 0)
                        VE.REVISE.addCtlReviseHelper($outline);
                });
            }            
        })
    });
    VE.plugin(function () {
        VE.REVISE = {
            /**
             * 添加查看修订记录标签(不可删除)
             */
            addCtlReviseHelper:function($outline){
                var outlineId = $outline.data("outlineid");
                if($outline && $outline.length > 0){
                    var containerTags = $outline.data('tags');
                    containerTags.addRightTags(new VE.Tag({
                            container : containerTags,
                            id:outlineId+"_revise",
                            target:$outline,
                            type:'button',
                            style: {
                                icon:'fa-tag',
                                className : 'btn-warning listRevise'
                            },
                            openClick:true,
                            text:'查看修订记录',
                            show : function () {
                                return true;
                            },                            
                            clickEvent:function(){
                                vpUtils.modeWithClose({
                                    title: "查看修订记录",
                                    size: BootstrapDialog.SIZE_WIDE,
                                    url: config.toRevise(),
                                    onshown: function (dialog) {
                                        dialog.$outlineId = outlineId;
                                        dialog.$modalDialog.css('width', $(window).width() * 0.7);
                                        reviseRecord.loadData(dialog);
                                    }
                                });
                            }
                        })
                    );
                    containerTags.render();
                }
            },
        };
    })
})(window);

//配置订阅时间
(function () {
    var VE = window.vrmEditor;

    VE.plugin(function () {
        var editor = this;
        VE.SUBSCRIBE = {
            docArtChange : function (outlineid) {
                var busFlagNode = editor.docstruct.tree.getAncestorContainBusFlag(outlineid);
                if (busFlagNode) {
                    WD_URL.rest.ajax({
                        url: config.subscribeDocArtChangeUrl(),
                        type:'POST',
                        data:{docId : config.getDocId(), uuid : busFlagNode.outlineUuid}
                    }, function (data) {
                        VE.log('触发'+busFlagNode.name+'条目订阅变化');
                    })
                }
            }
        }
    })
})(window);

