layui.define(['jquery'], function (exports) {
    var $ = layui.jquery;

    var treeSetting = {
        view: {
            fontCss: getFontCss,
            showLine: true,
            showIcon: true,
            selectedMulti: false,
            dblClickExpand: false,
            addDiyDom: function (treeId, treeNode) {
                //修改显示节点名称
                var $title = $('#' + treeNode.tId + '_span');
                var _extends = [];
                if (treeNode.propertys.assetTypeName) {
                    _extends.push('<span class="label label-info outline_control_point">' + treeNode.propertys.assetTypeName + '</span>');
                }
                $title.after(_extends.join(''));
            },
            addHoverDom: function (treeId, treeNode) {
                var $a = $("#" + treeNode.tId + "_a"),
                    $btnMore = $a.find("span.search");
                if ($btnMore.length > 0) {
                    return;
                } else {
                    var ckStr = "<span class='search' title='查看详情' data-id='" + treeNode.tid + "' data-name='" + treeNode.name + "'>" +
                                    "<i class='fa fa-search-plus tree-compatible-fa fa-icon'></i>"+
                                "</span>";
                    $a.append(ckStr);
                }
            },
            removeHoverDom: function (treeId, treeNode) {
                $("#" + treeNode.tId + "_a").find("span.search").remove();
            }
        },
        edit: {
            drag: {
                autoExpandTrigger: true,
                prev: true,
                next: true,
                isCopy: true,
                isMove: true
            },
            enable: true,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        data: {
            simpleData: {
                enable: false
            }
        },
        callback: {
            onClick: function  (event, treeId, treeNode) {
                layer.open({
                    type: 2,
                    title:treeNode.name,
                    shadeClose:true,
                    area: ['70%','100%'],
                    anim:2,
                    move:false,
                    offset: 'rt',
                    content: vp.config.URL.appMainUrl+'#/vrm/asset/workspace/'+treeNode.attributes.reqAssetId
                });
            },
            beforeDrag: function () {
                return false;
            }
        }
    };

    function initTree(treeId) {
        WD_URL.rest.ajaxMask({
            url: config.assetFrameUrl(),
            type: 'GET',
            maskinfo: '内容加载中...',
            maskEl: $('#' + treeId).closest('.layui-tab-content')
        }, function (data) {
            assetframe.tree = $.fn.zTree.init($('#' + treeId), treeSetting, data);
        })
    }

    var assetframe = {
        init: initTree,
        search : function (value) {
            changeColor(assetframe.tree, 'name', value);
        }
    }

    exports('assetframe', assetframe);
})