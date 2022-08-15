/**
 * vrm editor
 * @author huangyong@chtech.cn
 * @since v1.0.0
 * @date 2018-05-14 09:00
 * @Copyright 本内容仅限于北京维普时代内部传阅，禁止外泄以及其他商业用途
 */
(function (window, $) {

    // 验证是否引用jquery
    if (!$ || !$.fn || !$.fn.jquery) {
        alert('在引用wd-core.js之前，先引用jQuery，否则无法使用 vrm editor');
        return;
    }

    // 定义扩展函数
    var _ve = function (fn) {
        var VE = window.vrmEditor;
        if (VE) {
            // 执行传入的函数
            fn(VE, $);
        }
    };

    //定义构造函数
    (function (window, $) {
        if (window.vrmEditor) {
            alert('一个页面不能重复引用VRM编辑器！！！');
            return;
        }

        //绑定编辑器
        var VE = function (elem) {
            var $body = $('body');
            if ($body.hasClass('vrm-editor')) {
                alert('页面已经初始化 wd editor!!!');
            }

            this.init();
        }

        VE.fn = VE.prototype;
        VE.$body = $('body');
        VE.$document = $(document);
        VE.$window = $(window);
        VE.version = 'v1.0.0';

        window.vrmEditor = VE;

        //初始基础
        VE.init = function (fn) {
            if (!VE._inits) {
                VE._inits = [];
            }

            VE._inits.push(fn);
        }

        //插件实例化vrm editor之前执行
        VE.plugin = function (fn) {
            if (!VE._plugins) {
                VE._plugins = [];
            }

            VE._plugins.push(fn);
        }

        //插件将会页内容渲染后执行
        VE.pluginPageRender = function (fn) {
            if (!VE._pageRenders) {
                VE._pageRenders = [];
            }
            VE._pageRenders.push(fn);
        }

        //插件将树渲染后执行
        VE.pluginTreeRender = function (fn) {
            if (!VE._treeRenders) {
                VE._treeRenders = [];
            }
            VE._treeRenders.push(fn);
        }

    })(window, $);

    //ve show
    _ve(function (VE, $) {
        var Show = function () {
            this.__show = true;
        }

        Show.fn = Show.prototype;
        //Show expose vrm editor
        VE.Show = Show;

        Show.fn.getShow = function () {
            return this.__show;
        }

        //设置元素展示
        Show.fn.setShow = function () {
            var self = this;
            self.__show = true;
            return self;
        }

        //设置元素展示还是隐藏
        Show.fn.setHide = function () {
            var self = this;
            self.__show = false;
            return self;
        }
    });

    /*---------------------------------------content data loader start---------------------------*/
    //page data loader
    _ve(function (VE, $) {
        //分页默认配置
        PageDataLoader.defaultOptions = {
            el: '', // class|id|jquery 绑定渲染对象
            url: '', //请求url
            maxLoadLimit: 80, //最大规模同时抓取大纲限制数
            contextLoadLimitPercent: [0.3, 0.4], //上下文加载数量向上或者向下 default 0.3系数 加载数量 = maxLoadLimit*contextLoadLimitPercent
            fnSuccess: null, //{$content 加载内容, targetOutlineId //目标, type //加载类型 none|up|down}
            fnTreeLoad: null, //树加载
            fnError: null,
            canEdit: 0, //是否编辑模式 0 or null不能编辑  1 可编辑
            initEvent: null // 初始化事件
        }

        /**
         * 内容初始化器
         * @param {object} editor 编辑器
         * @param {json} options 初始化参数
         */
        function PageDataLoader(editor, options) {
            var self = this;
            self.options = $.extend(PageDataLoader.defaultOptions, options)
            self.$body = $(self.options.el);
            self.options.initEvent && this.options.initEvent(self.$body);
            self.editor = editor;

            //绑定下拉内容和上拉内容
            $(this.editor.$upPull).bind('click', function () {
                var $outline = self.editor.$editorContent.find('div.wd-outline:first')
                self.upPageClick($outline.data('outlineid'));
            })

            $(this.editor.$downPull).bind('click', function () {
                var $outline = self.editor.$editorContent.find('div.wd-outline:last')
                self.downPageClick($outline.data('outlineid'));
            })

            self.init();
        }

        PageDataLoader.prototype = {
            constructor: PageDataLoader,
            /**
             * 记录页已经初始化
             */
            pageInit: false,
            /**
             * 初始化分页数据加载器
             */
            init: function () {
                this.pageInit = true;
                this.page('none');
            },

            //导航滚动定位
            scrollOutLine: function (id) {
                if (!id) {
                    return;
                }

                id = '#p-' + id;

                //滚动
                var mainContainer = self.editor.$scroll;
                //滚动
                mainContainer.animate({
                    scrollTop: $(id).offset().top - mainContainer.offset().top + mainContainer.scrollTop()
                }, 500);
            },

            /**
             * 定位文档内容如果不存在刷新文档内容进行定位
             * @param {string} outlineId 大纲Id
             */
            location: function (outlineId) {
                var self = this;
                if (!outlineId) {
                    return;
                }

                //定位文档内容
                var $outline = $('#p-' + outlineId);
                if ($outline.length > 0) {
                    //定位大纲
                    self.scrollOutLine(outlineId);
                } else {
                    self.page('none', outlineId);
                }
            },

            /**
             * 刷新内容且定位大纲内容
             * @param {String} outlineId 
             */
            refreshWithLocation: function (outlineId) {
                var self = this;
                if (!outlineId) {
                    return;
                }

                self.page('none', outlineId);
            },

            /**
             * 刷新内容且定位大纲内容
             * @param {String} outlineId 
             */
            refresh: function (outlineId) {
                var self = this;
                self.page('none', outlineId, true);
            },
            /**
             * 上一页加载
             * @param {string} outlineId 大纲Id
             */
            upPageClick: function (outlineId) {
                if (!outlineId) {
                    return;
                }
                this.page('up', outlineId);
            },
            /**
             * 下一页加载
             * @param {string} outlineId 大纲Id
             */
            downPageClick: function (outlineId) {
                if (!outlineId) {
                    return;
                }
                this.page('down', outlineId);
            },

            /**
             * 分页加载
             * @param {string} pageType 分页类型 up:上一页、down:下一页、none:初始化分页
             * @param {string} outlineId 参照分页大纲Id
             * @param {boolean} disableLocation 禁用激活
             */
            page: function (pageType, outlineId, disableLocation) {
                var that = this;
                WD_URL.rest.ajax({
                    url: config.contentUrl(),
                    type: 'GET',
                    data: {
                        //目标大纲
                        targetOutlineId: outlineId,
                        //最大加载量
                        maxLoadLimit: that.options.maxLoadLimit,
                        //上下文加载限制量
                        contextLoadLimitPercent: that.options.contextLoadLimitPercent.join('|'),
                        //加载内容方式 none|up|down
                        type: pageType || 'none'
                    },
                    dataType: 'json',
                    beforeSend: function () {
                        $.mask_element('.vrm-content-loading');
                    }
                }, function (data) {
                    $.mask_close('.vrm-content-loading');
                    that.editor.$editorContent.empty();
                    that.editor.$editorContent.append($(template.render(VE.Outline.getOutlineRenderTpl(), data)));
                    that.editor.myeditor.edit = false;

                    //执行用于自定义组件
                    var _pageRenders = VE._pageRenders;
                    if (_pageRenders && _pageRenders.length) {
                        $.each(_pageRenders, function (k, val) {
                            val.call(that.editor, that.editor.$editorContent);
                        });
                    }

                    if (vpCommons.isBoolean(disableLocation) 
                        && disableLocation) {
                        return ;
                    }

                    if (!!outlineId) {
                        that.location(outlineId);
                    }
                }, function () {
                    $.mask_close('.vrm-content-loading');
                })
            }
        }

        PageDataLoader.fn = PageDataLoader.prototype;
        VE.PageDataLoader = PageDataLoader;
    });

    /*---------------------------------------content data loader end-----------------------------*/

    /*---------------------------------------tree start------------------------------------------*/
    //绑定ztree
    _ve(function (VE, $) {

        function Tree(docstruct) {
            this.docstruct = docstruct;
            this.editor = docstruct.editor;
            this.$dom = $('<div class="ztree outline-tree tree-list" id="tree-' + new Date().valueOf() + '"></div>');
            this.treeMenu = new VE.TreeMenu(this);
            treeFunction.tree = this;
        }

        Tree.fn = Tree.prototype;
        VE.Tree = Tree;

        var treeFunction = {
            /**
             * 修改树节点UI显示
             * @param {string} treeId  树ID
             * @param {object} treeNode  树节点
             */
            addDiyDom: function (treeId, treeNode) {
                var tree = treeFunction.tree;
                //修改显示节点名称
                var $title = $('#' + treeNode.tId + '_span');
                if (treeNode.origChapNum) {
                    $title.prepend(treeNode.origChapNum);
                    treeNode.name = treeNode.origChapNum + treeNode.name;
                }

                treeNode.propertys = treeNode.propertys || {};
                var _extends = [];
                if (treeNode.propertys.busFlag) {
                    _extends.push('<span class="label label-info outline_control_point">' + treeNode.propertys.busFlagName + '</span>');
                }
                //根据大纲的修改状态显示不同的颜色
                if(treeNode.propertys.changeStatus==1){
                    $('#' + treeNode.tId+ '_span').addClass('outline-bg-modify');
                }else if(treeNode.propertys.changeStatus==2){
                    $('#' + treeNode.tId+ '_span').addClass('outline-bg-add');
                }
                $title.after(_extends.join(''));
                
                var onRender = tree.onRender;
                //call onReader
                if (onRender && typeof onRender === 'function') {
                    onRender.call(tree, treeId, treeNode);
                }
            },

            /**
             * 点击前
             * @param {string} treeId 树ID
             * @param {object} treeNode 树节点
             */
            beforeClick: function (treeId, treeNode) {
                var tree = treeFunction.tree;
                tree.editor.content.pageDataLoader.location(treeNode.tid);

                var onBeforeClick = tree.onBeforeClick;

                //call onBeforeClick
                if (onBeforeClick && typeof onBeforeClick === 'function') {
                    return onBeforeClick.call(tree, treeId, treeNode);
                }

                return true;
            },

            /**
             * 点击事件
             * @param {event} event 事件
             * @param {string} treeId 树id
             * @param {object} treeNode 树节点
             */
            click: function (event, treeId, treeNode) {
                var tree = treeFunction.tree;
                var onClick = tree.onClick;

                //call onClick
                if (onClick && typeof onClick === 'function') {
                    onClick.call(tree, event, treeId, treeNode);
                }
            },

            /**
             * 右击事件
             * @param {event} event 事件
             * @param {string} treeId 树id
             * @param {object} treeNode 树节点
             */
            rightClick: function (event, treeId, treeNode) {
                var tree = treeFunction.tree;
                tree.showMenu(treeNode);

                var onRightClick = tree.onRightClick;
                //call onReader
                if (onRightClick && typeof onRightClick === 'function') {
                    onRightClick.call(tree, event, treeId, treeNode);
                }
            },
            /**
             * 拖拽前事件
             * @param {string} treeId 树节点
             * @param {Array} treeNodes 拖拽节点集合
             * @param {Object} targetNode 目标节点
             * @param {string} moveType 移动类型  "inner"：成为子节点，"prev"：成为同级前一个节点，"next"：成为同级后一个节点
             * @param {boolean} isCopy 拖拽节点操作是 复制 或 移动
             */
            beforeDrop: function (treeId, treeNodes, targetNode, moveType, isCopy) {
                var tree = treeFunction.tree;
                var onBeforeDrop = tree.onBeforeDrop;

                //call onBeforeDrop
                if (onBeforeDrop && typeof onBeforeDrop === 'function') {
                    return onBeforeDrop.call(tree, treeId, treeNodes, targetNode, moveType, isCopy);
                }

                return false;
            },
            /**
             * 拖拽成功后回调事件
             * @param event
             * @param treeId
             * @param treeNodes
             * @param targetNode
             * @param moveType
             * @param isCopy
             */
            drop: function (event, treeId, treeNodes, targetNode, moveType, isCopy) {
                var tree = treeFunction.tree;
                var onDrop = tree.onDrop;

                //call onDrop
                if (onDrop && typeof onDrop === 'function') {
                    onDrop.call(tree, event, treeId, treeNodes, targetNode, moveType, isCopy);
                }
            }
        }

        Tree.treeSetting = {
            view: {
                showLine: true,
                showIcon: true,
                selectedMulti: false,
                dblClickExpand: false,
                addDiyDom: treeFunction.addDiyDom
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
                    enable: true,
                    idKey: "tid",
                    pIdKey: "pid",
                    rootPId: 0
                }
            },
            callback: {
                beforeClick: treeFunction.beforeClick,
                onDrop: treeFunction.drop,
                onClick: treeFunction.click,
                beforeDrop: treeFunction.beforeDrop,
                onRightClick: treeFunction.rightClick,
                beforeDrag : function () {
                    //关闭拖拽功能
                    return false;
                }
            }
        };

    });

    //树init 绑定ztree树
    _ve(function (VE, $) {
        var Tree = VE.Tree;

        Tree.fn.init = function (callback) {
            var self = this,
                editor = self.editor;

            WD_URL.rest.ajaxMask({
                maskEl: self.$dom,
                maskinfo: '导航加载中...',
                url: config.navTreeUrl(),
                type: 'GET'
            }, function (data) {
                if (data && data.length > 0) {
                    $('div.js-addOutlineFirst').hide();
                } else {
                    $('div.js-addOutlineFirst').show();
                }
                //初始化数据 绑定树和ztree
                self.ztree = $.fn.zTree.init(self.$dom, Tree.treeSetting, data);
                //执行用于自定义组件
                var _treeRenders = VE._treeRenders;
                if (_treeRenders && _treeRenders.length) {
                    $.each(_treeRenders, function (k, val) {
                        val.call(editor, self);
                    });
                }

                if (vpCommons.isFunction(callback)) {
                    callback.call(self);
                }
            })
        }
    });

    //tree api
    _ve(function (VE, $) {

        var Tree = VE.Tree;

        /**
         * 刷新
         * @param callback 回调函数
         */
        Tree.fn.refreshTree = function (callback) {
            this.init(callback);
        }

        //刷新树和内容
        Tree.fn.refreshTreeAndContent = function () {
            var self = this;
            editor = self.editor;

            //初始化内容
            editor.content.pageDataLoader.page();
            //更新title
            editor.docTitle.updateTitle();
            //更新树内容
            self.refreshTree();
        }

        /**
         *  展开 / 折叠 全部节点
         *  <p>
         *      true 展开所有、false折叠所有
         * @param {boolean }expandFlag
         */
        Tree.fn.expandAll = function (expandFlag) {
            var self = this;
            var ztree = self.ztree;
            ztree.expandAll(expandFlag);
        }

        /**
         * 根据文档搜索tree 节点集合
         * @param {string} text 大纲文本信息
         * @return {Array} nodes
         */
        Tree.fn.findByText = function (text) {
            if (!text || !$.trim(text)) {
                return [];
            }

            var self = this;
            var ztree = self.ztree;

            return ztree.getNodesByFilter(function (node) {
                return node.name.indexOf(text) > -1;
            })
        }

        /**
         * 根据tid搜索tree 节点集合
         * @param {string} tid 树节点id
         * @return {Object} treeNode
         */
        Tree.fn.findById = function (tid) {
            var self = this;
            var ztree = self.ztree;

            var treeNodes = ztree.getNodesByFilter(function (node) {
                return node.tid == tid;
            })

            if (treeNodes && treeNodes.length > 0) {
                return treeNodes[0];
            } else {
                return null;
            }
        }

        /**
         * 选中节点
         * @param {Object} treeNode树节点
         */
        Tree.fn.selectNode = function (treeNode) {
            var self = this;
            self.ztree.selectNode(treeNode);
        }

        /**
         * 是否激活菜单
         * <p>
         *     true 显示菜单、false禁用菜单
         * @return {boolean}
         */
        Tree.fn.enableMenu = function () {
            return true;
        }

        /**
         *  显示树菜单
         * @param {Object } treeNode 树节点
         */
        Tree.fn.showMenu = function (treeNode) {
            var self = this;
            if (!self.enableMenu()) {
                return;
            }

            var treeMenu = self.treeMenu.dynamicDom(treeNode);
            if (treeMenu.checkShow()) {
                var $target = $("#" + treeNode.tId + "_a").addClass('js-tree-rightclick rightclick-selectd');
                self.selectNode(treeNode);

                WD_UTILS.popover($target, {
                    trigger: 'sticky',
                    placement: 'horizontal',
                    title: false,
                    arrow: false,
                    cache: false,
                    delay: 0,
                    content: treeMenu.$treeMenu,
                    onShow: function ($element) {
                        $element.find('li').click(function (e) {
                            e.stopPropagation();

                            var id = $(this).data('id');
                            var menuItem = treeMenu.getMenuItem(id);
                            if (!menuItem) {
                                return;
                            }

                            //判断树菜单按钮已经禁用
                            var disable = menuItem.disable.call(self, treeNode);
                            if (disable) {
                                return;
                            }

                            menuItem.clickEvent.call(self, treeNode);
                            $target.removeClass('js-tree-rightclick rightclick-selectd').webuiPopover('destroy');
                        });
                    },
                    onHide: function ($element) {
                        $target.removeClass('js-tree-rightclick rightclick-selectd').webuiPopover('destroy');
                    }
                });

                $(document).click(function (e) {
                    var $target = $('a.js-tree-rightclick');
                    if ($target.length > 0) {
                        $target.removeClass('js-tree-rightclick rightclick-selectd').webuiPopover('destroy');
                    }
                });
            }
        }

        /**
         * 获取节点业务ID
         * @param {Object} treeNode 节点
         * @return {Array} tids集合
         */
        Tree.fn.getCurBusId = function (treeNode) {
            return treeNode ? treeNode.tid : null;
        }

        /**
         * 获取当前节点和节点下所有子节点业务IDs
         * @param {Object} treeNode 节点
         * @return {Array} busIds集合
         */
        Tree.fn.getCurAndAllChildBusIds = function (treeNode) {
            var busIds = [];
            if (!treeNode) {
                return busIds;
            }

            function loop(treeNode, busIds) {
                busIds.push(treeNode.tid);
                if (treeNode.children.length > 0) {
                    for (var i = 0; i < treeNode.children.length; i++) {
                        loop(treeNode.children[i], busIds);
                    }
                }
            }

            loop(treeNode, busIds);

            return busIds;
        }

        /**
         * 获取子节点下业务IDs
         * @param {Object} treeNode 节点
         * @return {Array} busIds集合
         */
        Tree.fn.getChildBusIds = function (treeNode) {
            var busIds = [];
            if (!treeNode) {
                return busIds;
            }

            if (treeNode.children && treeNode.children.length > 0) {
                for (var i = 0; i < treeNode.children.length; i++) {
                    busIds.push(treeNode.children[i].tid);
                }
            }

            return busIds;
        }

        /**
         * 获取所有子节点下业务IDs
         * @param {Object} treeNode 节点
         * @return {Array} busIds集合
         */
        Tree.fn.getAllChildBusIds = function (treeNode) {
            var busIds = [];
            if (!treeNode) {
                return busIds;
            }

            function loop(curTreeNode, busIds) {
                if (curTreeNode.tid != treeNode.tid) {
                    busIds.push(curTreeNode.tid);
                }

                if (curTreeNode.children && curTreeNode.children.length > 0) {
                    for (var i = 0; i < curTreeNode.children.length; i++) {
                        loop(curTreeNode.children[i], busIds);
                    }
                }
            }

            loop(treeNode, busIds);

            return busIds;
        }

        /**
         * 获取子节点
         */
        Tree.fn.getChild = function (treeNode) {
            return treeNode ? treeNode.children : [];
        }

        /**
         * 获取所有子节点
         */
        Tree.fn.getAllChilds = function (treeNode) {
            var childNodes = [];
            if (!treeNode) {
                return childNodes;
            }

            function loop(curTreeNode, childNodes) {
                if (curTreeNode != treeNode) {
                    childNodes.push(curTreeNode);
                }

                if (curTreeNode.children && curTreeNode.children.length > 0) {
                    for (var i = 0; i < curTreeNode.children.length; i++) {
                        loop(curTreeNode.children[i], busIds);
                    }
                }
            }

            loop(treeNode, childNodes);

            return childNodes;
        }

        /**
         * 获取根节点
         * @param {Object} treeNode 树节点
         * @return {Array} treeNodes
         */
        Tree.fn.getRootsNodes = function () {
            var self = this;

            return self.ztree.getNodesByFilter(function (node) {
                return node.level == 0
            });
        }


        /**
         * 刷新title
         * @param {any} outlines 大纲集合
         */
        Tree.fn.refreshTitle = function (outlines) {
            if (!outlines) return;

            var self = this;

            /**
             * 更新title
             * @param outline
             */
            function updateTitle(outline) {
                var treeNode = self.findById(outline.docOutlineId);
                if (treeNode) {
                    var origChapNum = outline.origChapNum || treeNode.origChapNum;
                    treeNode.name = origChapNum  + outline.outlineName;
                    treeNode.origChapNum = origChapNum;
                    self.updateNodeAndOutline(treeNode, outline);
                }
            }

            if (VE.isArray(outlines)) {
                $.each(outlines, function (k, outline) {
                    updateTitle(outline);
                })
            } else {
                updateTitle(outlines);
            }
        }

        /**
         * 移除树节点和孩子节点
         * @param {Object} treeNode 树节点
         */
        Tree.fn.removeSelfAndChildNode = function (treeNode) {
            var self = this;
            self.removeChildNodes(treeNode);
            self.removeNode(treeNode);
        }

        /**
         * 移除本节点
         * @param {Object} treeNode 树节点
         */
        Tree.fn.removeNode = function (treeNode) {
            var self = this;
            self.ztree.removeNode(treeNode);
            VE.Outline.removeById(treeNode.tid);
        }

        /**
         * 清空某父节点的子节点
         * @param {Object} treeNode 树节点
         * @return {Array[Object]} treeNodes
         */
        Tree.fn.removeChildNodes = function (treeNode) {
            var self = this;
            var tids = self.getAllChildBusIds(treeNode);
            if (tids && tids.length > 0) {
                $.each(tids, function (k, tid) {
                    VE.Outline.removeById(tid);
                })
            }

            self.ztree.removeChildNodes(treeNode);
        }

        /**
         * 获取最后子节点
         * @param {Object} treeNode 树节点
         * @return {Object} treeNode
         */
        Tree.fn.getLastChildNode = function (treeNode) {
            var self = this;
            if (treeNode.children && treeNode.children.length > 0) {
                return self.getLastChildNode(treeNode.children[treeNode.children.length - 1]);
            } else {
                return treeNode;
            }
        }

        /**
         * 获取最后孩子节点排序索引
         * @param treeNode
         * @return {Integer} 索引
         */
        Tree.fn.getLastChildNodeDispIndex = function (treeNode) {
            var self = this;
            return self.getLastChildNode(treeNode).displayIndex;
        }

        /**
         * 获取node在tree索引
         * @param treeNode
         * @return {Integer} 索引
         */
        Tree.fn.getNodeIndex = function (treeNode) {
            var self = this;
            return self.ztree.getNodeIndex(treeNode);
        }


        /**
         * parentNode = null 插入节点成为根节点
         * 添加字节点到末尾
         * @param {Object} parentNode 父节点
         * @param {Object} newNode 新节点
         * @return {Object} treeNode 节点
         */
        Tree.fn.addNode = function (parentNode, newNode) {
            var self = this;
            return self.ztree.addNodes(parentNode, -1, newNode)[0];
        }

        /**
         *
         * parentNode = null 插入节点成为根节点
         * 添加子节点集合末尾(默认插入到父节点最后面)
         * @param {Object} parentNode 父节点
         * @param {Array[Object]} newNodes 新节点集合
         * @return {Array[Object]} treeNodes 节点集合
         */
        Tree.fn.addNodes = function (parentNode, newNodes) {
            var self = this;
            return self.ztree.addNodes(parentNode, -1, newNodes);
        }

        /**
         * parentNode = null 插入节点成为根节点
         * 添加子节点集合到指定位置
         * @param parentNode 父节点
         * @param {Integer} targetIndex 目标插入位置
         * @param {Array[Object]} n ewNodes 新节点集合
         * @return {Array[Object]} treeNodes 节点集合
         */
        Tree.fn.addNodes = function (parentNode, targetIndex, newNodes) {
            var self = this;
            return self.ztree.addNodes(parentNode, targetIndex, newNodes);
        }

        /**
         * parentNode = null 插入节点成为根节点
         * 添加子节点到指定位置
         * @param {Object} parentNode 父节点
         * @param {Integer} targetIndex 目标索引位置
         * @param {Object} newNode 新节点
         * @return {Object} treeNode节点
         */
        Tree.fn.addNode = function (parentNode, targetIndex, newNode) {
            var self = this;
            return self.ztree.addNodes(parentNode, targetIndex, newNode)[0];
        }

        /**
         * 大纲创建树节点
         * @param {Object} outline 大纲对象
         * @return {Object} treeNode
         */
        Tree.fn.createNodeByOutline = function (outline) {
            return {
                name: outline.outlineName,
                tid: outline.docOutlineId,
                pid: outline.parentId,
                open: true,
                origChapNum: outline.origChapNum,
                code: outline.origChapNum,
                displayIndex: outline.dispIndx,
                children: []
            }
        }

        /**
         * 更新大纲节点
         * @param {Object} treeNode 树节点
         * @param {Object} outline 大纲对象
         */
        Tree.fn.updateNodeAndOutline = function (treeNode, outline) {
            var self = this;
            //更新大纲节点
            treeNode.propertys.changeStatus = outline.changeStatus;
            self.ztree.updateNode(treeNode);
            //更新大纲状态显示
            if(treeNode.propertys.changeStatus==1){  //修改
                $('#' + treeNode.tId+ '_span').addClass('outline-bg-modify');
            }else if(treeNode.propertys.changeStatus==2){ //新增
                $('#' + treeNode.tId+ '_span').addClass('outline-bg-add');
            }else if(treeNode.propertys.changeStatus==0){ //不变
                $('#' + treeNode.tId+ '_span').removeClass('outline-bg-modify');
                $('#' + treeNode.tId+ '_span').removeClass('outline-bg-add');
            }
            //更新大纲信息
            VE.Outline.update(outline);
        }

        /**
         * 获取根节点下子节点集合
         * @return {Array} treeNodes 节点集合
         */
        Tree.fn.getNodes = function () {
            var self = this;
            return self.ztree.getNodes();
        }

        /**
         * 批量更新树节点和文档
         * @param {Array} outlines 大纲节点集合
         */
        Tree.fn.batchUpdateNodeAndOutline = function (outlines) {
            var self = this;
            if (outlines && outlines.length > 0) {
                var cacheNodes = {};

                //缓存大纲树所有节点 大纲ID-节点
                loopTreeNodes(self.getNodes());

                function loopTreeNodes(rootNodes) {
                    if (rootNodes && rootNodes.length > 0) {
                        $.each(rootNodes, function (i, node) {
                            cacheNodes[node.tid] = node;
                            loopTreeNodes(node.children)
                        })
                    }
                }

                $.each(outlines, function (i, curOutline) {
                    //修改树节点
                    var node = cacheNodes[curOutline.docOutlineId];
                    if (node) {
                        node.name = curOutline.origChapNum + curOutline.outlineName;
                        node.origChapNum = curOutline.origChapNum;
                        node.displayIndex = curOutline.dispIndx;
                        self.updateNodeAndOutline(node, curOutline);
                    }
                })
            }
        }

        /**
         *  获取节点的父节点
         * @param {Object} treeNode 树节点
         * @return {Object} parentNode 父节点
         */
        Tree.fn.getParentNode = function (treeNode) {
            return treeNode.getParentNode();
        }

        /**
         * 增加业务标识
         * @param {Object} treeNode 树节点
         * @param {String} busFlag 业务标识
         * @param {String} busFlagName 业务标识名称
         */
        Tree.fn.addBusFlag = function (treeNode, busFlag, busFlagName) {
            if (!treeNode.propertys.busFlag) {
                treeNode.propertys.busFlag = busFlag;
                treeNode.propertys.busFlagName = busFlagName;
                var $title = $('#' + treeNode.tId + '_a');
                $title.append('<span class="label label-info outline_control_point">' + busFlagName + '</span>');
            }
        }

        /**
         * 移除业务标识
         * @param {Object} treeNode 树节点
         */
        Tree.fn.removeBusFlagById = function (id) {
            var self = this;
            self.removeBusFlag(self.findById(id));
        }

        /**
         * 移除业务标识
         * @param {Object} treeNode 树节点
         */
        Tree.fn.removeBusFlag = function (treeNode) {
            if (treeNode) {
                treeNode.propertys.busFlag = null;
                treeNode.propertys.busFlagName = '';
                var $title = $("#" + treeNode.tId + "_a");
                $title.find('.outline_control_point').remove();
            }
        }

        /**
         * 滚动定位
         * @param {String} outlineId 大纲Id
         */
        Tree.fn.locationById = function (outlineId) {
            var self = this;
            var treeNode = self.findById(outlineId);

            self.location(treeNode);
        }

        /**
         * 滚动定位
         * @param {ztree Node} treeNode 树节点
         */
        Tree.fn.location = function (treeNode) {
            var self = this;
            if (treeNode) {
                var pNode = treeNode.getParentNode();
                self.ztree.expandNode(pNode, true, true, true);
                self.selectNode(treeNode);
            }
        }

        /**
         * 获取选中节点
         */
        Tree.fn.getSelectedNodes = function () {
            var self = this;
            return self.ztree.getSelectedNodes();
        }

        /**
         * 更新指定大纲树节点的颜色状态
         * @author qinlz
         * @param outlineId 大纲Id
         * @param changeStatus 变更状态
         */
        Tree.fn.updateOutlineStatusColor = function(outlineId,changeStatus) {
            //1.获取大纲id对应的树节点
            var self = this;
            var treeNode = self.findById(outlineId);
            //2.根据changeStatus改变节点的显示样式
            treeNode.propertys.changeStatus = changeStatus;
            self.ztree.updateNode(treeNode);
            //更新大纲状态颜色显示
            if(treeNode.propertys.changeStatus==1){  //修改
                $('#' + treeNode.tId+ '_span').addClass('outline-bg-modify');
            }else if(treeNode.propertys.changeStatus==2){ //新增
                $('#' + treeNode.tId+ '_span').addClass('outline-bg-add');
            }else if(treeNode.propertys.changeStatus==0){ //不变
                $('#' + treeNode.tId+ '_span').removeClass('outline-bg-modify');
                $('#' + treeNode.tId+ '_span').removeClass('outline-bg-add');
            }
        }

        /**
         * [{id:'大纲id',chapNum：'章节号'}...]
         * 更新tree大纲章节号和右侧内容文本章节号信息
         * @param chapNums 章节号集合
         */
        Tree.fn.updateChapNums = function (chapNums) {
            var self = this;
            if (vpCommons.isArray(chapNums)) {
                $.each(chapNums, function (i, v) {
                    var treeNode = self.findById(v.id);
                    if (treeNode) {
                        if (treeNode.origChapNum != v.chapNum) {
                            //获取大纲名称和章节号
                            var outlineName = treeNode.name.replace(treeNode.origChapNum,'');
                            var newChapNum = v.chapNum || treeNode.origChapNum;

                            //更新大纲
                            var outline = {};
                            outline.docOutlineId = v.id;
                            outline.outlineName = outlineName;
                            outline.origChapNum = newChapNum;
                            outline.changeStatus = v.changeStatus;
                            //更新树节点
                            treeNode.name = newChapNum + outline.outlineName;
                            treeNode.origChapNum = newChapNum;
                        
                            self.updateNodeAndOutline(treeNode, outline);
                        }
                    }
                })
            }
        }

        /**
         * 获取最新包含业务标识节点
         * @param {string} outlineId 大纲id
         * @return {ztree node} 树节点
         */
        Tree.fn.getAncestorContainBusFlag = function (outlineId) {
            var self = this;
            var currNode = self.findById(outlineId);
            if (!currNode) {
                return null;
            }


            function getAncestorContainBusFlag(currNode0) {
                var pNode = currNode0.getParentNode();
                return pNode != null 
                ? (pNode.propertys && pNode.propertys.busFlag) 
                ? pNode: getAncestorContainBusFlag(pNode) : null;
            }

            if (currNode.propertys && currNode.propertys.busFlag) {
                return currNode;
            } else {
                return getAncestorContainBusFlag(currNode);
            }
        }


    });

    //tree menu
    _ve(function (VE, $) {
        var TreeMenu = function (tree) {
            this.tree = tree;
            this.menuItems = [];
            this.$treeMenu = $('<ul class="tree-menu"></ul>');
            this.initDom();
        }

        TreeMenu.fn = TreeMenu.prototype;
        //TreeMenu expose VE
        VE.TreeMenu = TreeMenu;
    });

    //tree menu api
    _ve(function (VE, $) {
        var TreeMenu = VE.TreeMenu;

        //树节点
        TreeMenu.fn.checkShow = function (treeNode) {
            var self = this;
            if (self.$treeMenu.find('li').length == 0) {
                return false;
            }

            return true;
        }

        /**
         * 动态计算dom
         * @param {Object} treeNode 树节点
         * @return {VE.TreeMenu} 菜单
         */
        TreeMenu.fn.dynamicDom = function (treeNode) {
            var self = this;
            //清空子节点
            self.$treeMenu.empty();

            $.each(self.menuItems, function (k, menuItem) {
                if (self.tree.editor.scene && !self.tree.editor.scene.auth(menuItem.optId)) {
                    return true;
                }

                if (menuItem.show.call(menuItem, treeNode)) {
                    self.$treeMenu.append(menuItem.$dom);

                    var disable = menuItem.disable.call(menuItem, treeNode);
                    if (disable) {
                        menuItem.$dom.addClass('wd-disabled');
                    }
                }
            })

            return self;
        }

        //初始化菜单
        TreeMenu.fn.initDom = function () {
            var self = this;
            self.addMenuItems();

            $.each(self.menuItems, function (k, menuItem) {
                self.$treeMenu.append(menuItem.$dom);
            })
        }

        //添加菜单项
        TreeMenu.fn.addMenuItems = function () {
            var self = this;
            $.each(VE.TreeMenu.menusItemFn, function (k, menuItemFn) {
                var treeMenuItem = menuItemFn.call();

                if (treeMenuItem && treeMenuItem instanceof VE.TreeMenuItem) {
                    self.menuItems.push(treeMenuItem);
                }
            })
        }

        /**
         * 获取菜单项
         * @param {string} menuItemId 菜单项Id
         * @return {VE.TreeMenuItem} 菜单项
         */
        TreeMenu.fn.getMenuItem = function (menuItemId) {
            var self = this;
            var targetMenuItem;

            if (!menuItemId) {
                return targetMenuItem;
            }

            $.each(self.menuItems, function (k, menuItem) {
                if (menuItemId && menuItemId == menuItem.id) {
                    targetMenuItem = menuItem;
                    return;
                }
            })

            return targetMenuItem;
        }
    });

    //create tree menu item
    _ve(function (VE, $) {

        VE.TreeMenu.menusItemFn = [];

        VE.TreeMenu.createMenuItem = function (fn) {
            VE.TreeMenu.menusItemFn.push(fn);
        }
    });

    //tree menu item
    _ve(function (VE, $) {
        var TreeMenuItem = function (settings) {
            this.text = settings.text;
            this.id = settings.id;
            this.optId = settings.optId;
            this.clickEvent = VE.isFunction(settings.clickEvent) ? settings.clickEvent : function () {};
            this.show = VE.isFunction(settings.show) ? settings.show : function () {
                return true;
            };
            this.disable = VE.isFunction(settings.disable) ? settings.disable : function () {
                return false;
            };
            this.initDom();
        }

        TreeMenuItem.fn = TreeMenuItem.prototype;
        //TreeMenuItem expose VE
        VE.TreeMenuItem = TreeMenuItem;

        TreeMenuItem.fn.initDom = function () {
            var self = this;
            self.$dom = $('<li data-id="' + self.id + '">' + self.text + '</li>');
        }
    });

    /*--------------------------------------tree end-----------------------------------------*/

    /*--------------------------------------DocStruct start----------------------------------*/
    //InputSearch
    _ve(function (VE, $) {
        var InputSearch = function (docstruct) {
            this.docstruct = docstruct;
            this.$dom = $('<div class="input-group m-t-sm">' +
                '<input type="text" class="form-control vrm-form-control" placeholder="' + (VE.config.docstruct.inputSerachPlaceholder || '搜索大纲名称') + '">' +
                '<span class="input-group-btn">' +
                '<button type="button" class="btn btn-default"><i class="fa fa-search"></i></button>' +
                '</span>' +
                '</div>');
            this.eventInputSearch();
        }

        InputSearch.fn = InputSearch.prototype;
        //DocStruct expose vrm editor
        VE.InputSearch = InputSearch;

        InputSearch.fn.eventInputSearch = function () {
            var self = this;

            self.$dom.find('input').keyup(function (e) {
                var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                if (keyCode == 13) {
                    self.docstruct.inputSearchResult.render(searchOutLineByTitle(self.docstruct, this));
                }
                return false;
            });

            self.$dom.find('button').click(function () {
                self.docstruct.inputSearchResult.render(searchOutLineByTitle(self.docstruct, self.$dom.find('input')));
            });
        }

        function searchOutLineByTitle(docstruct, input) {
            return docstruct.tree.findByText($(input).val());
        }
    });

    //InputSearchResult
    _ve(function (VE, $) {
        var InputSearchResult = function (docstruct) {
            this.docstruct = docstruct;
            this.$domCount = $('<span class="badge input-search-result-count"></span>');
            this.$dom = $('<ul class="list-group todo-list"></ul>');
        }

        InputSearchResult.fn = InputSearchResult.prototype;
        VE.InputSearchResult = InputSearchResult;
        //InputSearchResult expose vrm editor

        var InputSearchResult = VE.InputSearchResult;

        /**
         * 渲染数据
         * @param {array treenode} arrayData 树节点集合
         */
        InputSearchResult.fn.render = function (arrayData) {
            var self = this;
            self.$dom.empty();
            self.$domCount.empty();

            if (arrayData && arrayData.length == 0) {
                return;
            }

            self.$domCount.text(arrayData.length);
            //模板化数据
            self.$dom.append(template.render(getTpl(), {
                list: arrayData
            }));
            //事件
            self.$dom.find('li').click(function () {
                self.docstruct.editor
                    .content.pageDataLoader.location($(this).data('target-href'));
                $(this).addClass('active').siblings().removeClass('active');
            })

            //show tab
            self.$domCount.closest("a").tab('show');
        }

        function getTpl() {
            return '{{each list as node}}<li class="list-group-item" data-target-href="{{node.tid}}">' +
                '{{node.name}}</li>{{/each}}';
        }
    });

    //DocStruct menu
    _ve(function (VE, $) {
        var DocStructMenu = function (docstruct) {
            this.optId = 'docstruct-menu'
            this.docstruct = docstruct;
            this.menuItems = [];
            this.initDom();
            this.render();
            this.eventMenu();
        }

        DocStructMenu.fn = DocStructMenu.prototype;
        //DocStructMenu expose VE
        VE.DocStructMenu = DocStructMenu;
    });

    //DocStruct menu api
    _ve(function (VE, $) {
        var DocStructMenu = VE.DocStructMenu;

        //初始化菜单
        DocStructMenu.fn.initDom = function () {
            var self = this;
            this.$dom = $('<ul class="dropdown-menu select-menu"></ul>');
            self.addMenuItems();
        }

        //添加菜单项
        DocStructMenu.fn.addMenuItems = function () {
            var self = this;
            $.each(VE.DocStructMenu.menusItemFn, function (k, menuItemFn) {
                var treeMenuItem = menuItemFn.call();

                if (treeMenuItem && treeMenuItem instanceof VE.DocStructMenuItem) {
                    self.menuItems.push(treeMenuItem);
                }
            })
        }

        //渲染
        DocStructMenu.fn.render = function () {
            var self = this;
            if (self.docstruct.editor.scene && !self.docstruct.editor.scene.auth(self.optId)) {
                self.$dom.hide();
                return;
            }


            $.each(self.menuItems, function (k, menuItem) {
                if (self.docstruct.editor.scene && !self.docstruct.editor.scene.auth(menuItem.optId)) {
                    return true;
                }

                var show = menuItem.show.call(menuItem);
                if (show) {
                    self.$dom.append(menuItem.$dom);
                    var disable = menuItem.disable.call(menuItem);
                    if (disable) {
                        menuItem.$dom.addClass('wd-disabled');
                    }
                }
            })
        }

        /**
         * 获取菜单项
         * @param {string} menuItemId 菜单项Id
         * @return {VE.DocStructMenuItem} 菜单项
         */
        DocStructMenu.fn.getMenuItem = function (menuItemId) {
            var self = this;
            var targetMenuItem;

            if (!menuItemId) {
                return targetMenuItem;
            }

            $.each(self.menuItems, function (k, menuItem) {
                if (menuItemId && menuItemId == menuItem.id) {
                    targetMenuItem = menuItem;
                    return;
                }
            })

            return targetMenuItem;
        }

        /**
         * 激活菜单事件
         */
        DocStructMenu.fn.eventMenu = function () {
            var self = this;

            self.$dom.find('li').click(function () {
                var id = $(this).data('id');
                var menuItem = self.getMenuItem(id);

                //判断是否禁用
                var disable = menuItem.disable.call(self);
                if (disable) {
                    return;
                }

                menuItem.clickEvent.call(self);
            })
        }
    });

    //create tree menu item
    _ve(function (VE, $) {

        VE.DocStructMenu.menusItemFn = [];

        VE.DocStructMenu.createMenuItem = function (fn) {
            VE.DocStructMenu.menusItemFn.push(fn);
        }
    });

    //DocStruct menu item
    _ve(function (VE, $) {
        var DocStructMenuItem = function (settings) {
            this.id = settings.id;
            this.optId = settings.optId;
            this.text = settings.text;
            this.disable = VE.isFunction(settings.disable) ? settings.disable : function () {
                return false
            };
            this.show = VE.isFunction(settings.show) ? settings.show : function () {
                return true
            };
            this.clickEvent = VE.isFunction(settings.clickEvent) ? settings.clickEvent : function () {};
            this.icon = settings.icon;
            this.initDom();
        }

        DocStructMenuItem.fn = DocStructMenuItem.prototype;
        //DocStructMenuItem expose VE
        VE.DocStructMenuItem = DocStructMenuItem;

        DocStructMenuItem.fn.initDom = function () {
            var self = this;
            self.$dom = $(template.render(getMenuItemTpl(), self));
        }

        function getMenuItemTpl() {
            return '<li data-id="{{id}}"><a href="javascript:;" class="fz12"><i class="fa {{icon}} fa-fw text-primary"></i>{{text}}</a></li>';
        }
    });

    //DocStruct
    _ve(function (VE, $) {

        var DocStruct = function (editor) {
            this.editor = editor;
            this.inputSearch = new VE.InputSearch(this);
            this.menu = new VE.DocStructMenu(this);
            this.tree = new VE.Tree(this);
            this.inputSearchResult = new VE.InputSearchResult(this);
            //初始化dom
            this.initDom();
            //初始数据
            this.initData();
            //初始化权限
            this.initAuth();
        }

        DocStruct.fn = DocStruct.prototype;
        //DocStruct expose vrm editor
        VE.DocStruct = DocStruct;
    });

    //DocStruct api
    _ve(function (VE, $) {
        var DocStruct = VE.DocStruct;

        //get doc struct title
        DocStruct.fn.getTitle = function () {
            return VE.config.docstruct.title;
        };

        //init dom
        DocStruct.fn.initDom = function () {
            var self = this;
            self.$dom = $('<!--左侧大纲--><div class="vrm-slide vrm-dagang bg-gray"></div>');
            self.$dom.append('<!-- 这个图标是收缩后才显示 -->' +
                '<div class="vrm-slide-icon p-b-xs">' +
                '<i class="fa fa-exchange cursor text-muted fr vrm-slide-close" data-toggle="tooltip" data-placement="top" title="展开"></i>' +
                '</div>');
            var $box = $('<div class="vrm-box full-height p-sm"></div>');
            self.$title = $('<div class="vrm-box-title b-b p-b-xs">' + (self.getTitle() || "文档结构图") + '' +
                '<i class="fa fa-exchange cursor text-muted fr vrm-slide-close" data-toggle="tooltip" data-placement="top" title="收起"></i>' +
                '</div>');

            //创建title
            $box.append(self.$title);
            //创建搜索框
            $box.append(self.inputSearch.$dom);

            //创建tab
            var $domBody = $('<div class="vrm-box-content"></div>');
            $domBody.append('<div class="tabs-container full-height">' +
                '                        <ul class="nav nav-tabs myTab">' +
                '                            <li role="presentation" class="tab-item active" data-toggle="tab">' +
                '                                <a data-toggle="tab" href="#tab-1" aria-expanded="false">大纲</a>' +
                '                            </li>' +
                '                            <li role="presentation" class="tab-item" data-toggle="tab">' +
                '                                <a data-toggle="tab" href="#tab-2" aria-expanded="false">结果 </a>' +
                '                            </li>' +
                '                            <li role="presentation" class="dropdown fr wd-docstructmenu">' +
                '                                <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">' +
                '                                    <i class="fa fa-angle-double-down" data-toggle="tooltip" data-placement="right" title="更多导航功能"></i>' +
                '                                </a>' +
                '                            </li>' +
                '                        </ul>' +
                '                        <div id="myTabContent" class="tab-content scroll">' +
                '                            <div id="tab-1" class="tab-pane active">' +
                '                                <!-- 没有大纲时显示按钮 -->' +
                '                                <div class="p-sm text-center js-addOutlineFirst" data-optid="docstruct-menu-blankaddoutline">' +
                '                                    <a href="javascript:;" id="addOutlineFirst" class="text-primary">暂无大纲，点击添加大纲</a>' +
                '                                </div>' +
                '                                <div class="p-sm wd-tree"></div>' +
                '                            </div>' +
                '                            <div id="tab-2" class="tab-pane">' +
                '                                <div class="panel-body">' +
                '                                    <div class="input-search-result panel-box"></div>' +
                '                                </div>' +
                '                            </div>' +
                '                        </div>');

            $domBody.find('li.tab-item:eq(1) a').append(self.inputSearchResult.$domCount);
            $domBody.find('div.input-search-result').append(self.inputSearchResult.$dom);
            $domBody.find('li.wd-docstructmenu').append(self.menu.$dom);

            //绑定下拉刷新
            $domBody.find('li.wd-docstructmenu').on('show.bs.dropdown', function () {
                self.menu.render();
            });

            $domBody.find('div.wd-tree').append(self.tree.$dom);

            $box.append($domBody);
            //显示区域
            self.$dom.append($box);
            //文档结构附加编辑内容区域
            self.editor.$editorMain.append(self.$dom);
        }

        //init data
        DocStruct.fn.initData = function () {
            var self = this;
            self.tree.init();
        }

        //init auth
        DocStruct.fn.initAuth = function () {
            var self = this;
            if (!self.editor.scene.auth('docstruct-menu-blankaddoutline')) {
                $(".js-addOutlineFirst").remove();
            }    
        }
    });

    /*--------------------------------------DocStruct end--------------------------------------*/

    // 对象配置
    _ve(function (VE, $) {

        VE.fn.initDefaultConfig = function () {
            var editor = this;
            editor.config = $.extend({}, VE.config);
        };

    });

    //预定义配置 config
    _ve(function (VE, $) {
        VE.config = {};

        //打印日志
        VE.config.printLog = true;

        VE.config.docstruct = {};
        VE.config.docstruct.inputSerachPlaceholder = '搜索大纲名称';
        VE.config.docstruct.title = '文档结构图';

        //headertoolbar
        VE.config.headertoolbar = {};
    });

    //初始化结构
    _ve(function (VE, $) {
        VE.fn.init = function () {
            //初始化默认配置
            this.initDefaultConfig();
            //增加编辑body
            this.initEditorBody();
            //初始化Dom结构
            this.initEditorContainer();
            //add header toolbar
            this.addHeaderToolbar();
            //add menu container
            this.addToolbar();
            //初始化顶部菜单
            this.headertoolbarmenus = {};
        }
    });

    //初始化编辑body
    _ve(function (VE, $) {
        VE.fn.initEditorBody = function () {
            this.$editorBody = VE.$body.addClass('vrm-editor vrm-minWidth full-height bg-gray pr overflow');
        }
    });

    //初始化编辑容器
    _ve(function (VE, $) {
        VE.fn.initEditorContainer = function () {
            //word容器区
            this.$editorContainer = $('<!-- 主体内容区 --><div class="vrm-word"></div>');
            this.$editorMain = $('<div class="vrm-word-main"></div>');
            this.$editorContainer.append(this.$editorMain);
        };
    });

    /*-----------------------------------header toolbar start---------------------------------*/
    //header toolbar
    _ve(function (VE, $) {
        var HeaderToolBar = function (editor) {
            this.editor = editor;
            this.init();
        }

        HeaderToolBar.fn = HeaderToolBar.prototype;
        //headerToolBar expose vrm editor
        VE.HeaderToolBar = HeaderToolBar;

        HeaderToolBar.fn.init = function () {
            var self = this;
            self.$headertoolbarContainer = $('<!-- 顶部 --><div class="vrm-header bg-white clearfix b-b"></div>');
            self.$headertoolbarLeft = $('<div class="fl p-r-sm"></div>');
            self.$headertoolbarRight = $('<div class="fr p-r-sm"></div>');
            self.$headertoolbarContainer.append(self.$headertoolbarLeft);
            self.$headertoolbarContainer.append('<div class="vrm-content-loading"></div>')
            self.$headertoolbarContainer.append(self.$headertoolbarRight);
        }

        //headetoolbar render
        HeaderToolBar.fn.render = function () {
            var $headertoolbarContainer = this.$headertoolbarContainer;
            var $editorBody = this.editor.$editorBody;
            $editorBody.append($headertoolbarContainer);
        }

        //headetoolbar append headerMenu
        HeaderToolBar.fn.appendHeaderMenu = function (headerMenu) {
            var editor = this.editor;
            var headertoolbar = editor.headertoolbar;
            var $headertoolbarLeft = headertoolbar.$headertoolbarLeft;
            $headertoolbarLeft.append(headerMenu.getDom())
        }

        //展开浏览器适配
        HeaderToolBar.fn.addFullScreen = function () {
            var $fullScreen = $('<div class="vrm-top-icon cursor p-sm max-windown">' +
                '   <i class="fa fa-expand text-primary"></i>' +
                '</div>');

            var fullScreenHtml = "<table class='table table-hover m-b-none'>" +
                "<thead>" +
                "<tr><th style='width: 30%'>浏览器</th><th style='width: 40%'>快捷键(开启)</th><th style='width: 30%'>快捷键(退出)</th></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr><td>通用</td><td>F11</td><td>F11</td></tr>" +
                "<tr><td>Edge</td><td>ALT+Win+Enter</td><td>ALT+Win+Enter</td></tr>" +
                "</tbody>" +
                "</table>";

            this.$headertoolbarRight.append($fullScreen);

            $fullScreen.popover({
                trigger: 'hover',
                container: 'body',
                placement: 'bottom',
                html: true,
                content: fullScreenHtml
            })
        }

        HeaderToolBar.fn.addOnline = function (userid, userName){
            if (this.$headertoolbarRight.find('img[data-userid="'+userid+'"]').length > 0) {
                return;
            } 

            this.$headertoolbarRight.prepend('<img data-userid="'+userid+'" data-name="'+userName+'" style="border-radius: 100%; margin-right:2px; width:32px; height:32px;" title="'+userName+'">');
            namedavatar.setImgs(this.$headertoolbarRight.find('img[data-userid="'+userid+'"]'), 'data-name');
        }

        HeaderToolBar.fn.removeOnline = function(userid) {
            this.$headertoolbarRight.find('img[data-userid="'+userid+'"]').remove();
        }
    });

    //增加 header menu 容器
    _ve(function (VE, $) {
        VE.fn.addHeaderToolbar = function () {
            var editor = this;
            editor.headertoolbar = new VE.HeaderToolBar(editor);
        }
    });

    //header menu
    _ve(function (VE, $) {


        function getMenuTpl() {
            return '<div class="dropdown-toggle p-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<i class="fa {{iconClass}}" data-toggle="tooltip" data-placement="bottom" title="{{title}}"></i>' +
                '<span class="text-muted f12"> {{title}}</span>' +
                '</div>';
        }
        /**
         *  {
         *    editor : '绑定编辑器'
         *    id : '顶部菜单ID'
         *    title : '顶部菜单名称',
         *    show : '是否显示函数'
         *    iconClass:'fa-icon'
         *  }
         *
         * @return {HeaderMenu}
         * @constructor
         */
        var HeaderMenu = function (settings) {
            this.editor = settings.editor;
            this.id = settings.id;
            this.optId = settings.optId;
            this.title = settings.title;
            this.iconClass = settings.iconClass
            this.show = VE.isFunction(settings.show) ? settings.show : function () {
                return true
            };
            this.dropDownList = settings.dropDownList;
            this.$dom = $('<div class="vrm-top-icon cursor"></div>');
            this.$dom.append($(template.render(getMenuTpl(), this)))
        }

        HeaderMenu.fn = HeaderMenu.prototype;

        //header menu expose vrm editor
        VE.HeaderMenu = HeaderMenu;

        HeaderMenu.fn.getDom = function () {
            return this.$dom;
        }

        HeaderMenu.fn.render = function () {
            var self = this;
            var editor = self.editor;
            var headertoolbar = editor.headertoolbar;

            if (editor.scene && !editor.scene.auth(self.optId)) {
                return;
            }

            headertoolbar.appendHeaderMenu(self);

            if (self.dropDownList) {
                this.$dom.addClass('dropdown');
                self.dropDownList.bindMount(self);
                self.$dom.append(self.dropDownList.getDom());
            }

            var onRender = self.onRender;
            //call onReader
            if (onRender && typeof onRender === 'function') {
                onRender.call(this);
            }

            //动态下拉
            self.$dom.on('show.bs.dropdown', function () {
                self.dropDownList.render();
            });
        }
    });

    //add header menu
    _ve(function (VE, $) {

        //存储创建菜单函数
        VE.createHeaderToolBarMenuFns = [];
        VE.createHeaderToolBarMenu = function (fn) {
            VE.createHeaderToolBarMenuFns.push(fn);
        }

        //增加编辑菜单
        VE.fn.addHeaderToolBarMenus = function () {
            var editor = this;

            //回调创建函数
            $.each(VE.createHeaderToolBarMenuFns, function (k, menuFn) {
                var headerMenu = menuFn.call(editor);

                if (headerMenu && headerMenu instanceof VE.HeaderMenu) {
                    editor.headertoolbarmenus[headerMenu.id] = headerMenu;
                }
            })
        }
    });

    /*-----------------------------------header toolbar end-------------------------------------*/

    /*-----------------------------------toolbar start---------------------------------------*/
    //toolbar构造函数
    _ve(function (VE, $) {
        var ToolBar = function (editor) {
            this.editor = editor;
            this.init();
        };

        ToolBar.fn = ToolBar.prototype;
        //toolbar expose vrm editor
        VE.ToolBar = ToolBar;
    });

    //toolbar api
    _ve(function (VE, $) {
        var ToolBar = VE.ToolBar;

        //init
        ToolBar.fn.init = function () {
            var self = this;
            self.$toolbar = $('<!-- 工具条按钮 --><div class="vrm-toolbar-wrapper p-sm text-center"></div>');
        }

        //toolbar render
        ToolBar.fn.render = function () {
            var $toolbar = this.$toolbar;
            var $editorBody = this.editor.$editorBody;

            $editorBody.append($toolbar);
        }

        var widgetHandler = [];
        //注册widget
        ToolBar.registerWidgetHandler = function (t, n) {
            $.each(t.split(/\s+/), function (t, o) {
                widgetHandler[o] = n
            })
        }

        function _dialog(e, t, n) {
            var o = e._cmd;
            if (e._dialog) {
                var a = UEDITOR_CONFIG.UEDITOR_HOME_URL + "dialogs/",
                    i = e._dialog,
                    l = "vrm_" + (+new Date).toString(36),
                    s = new FUI.Dialog(i),
                    r = $(s.getBodyElement()),
                    c = $EDITORUI[l] = {
                        _ishidden: !0,
                        editor: n,
                        className: "wrm-dialog-" + o,
                        uiName: "dialog",
                        onok: function () {},
                        onclose: function () {},
                        oncancel: function () {},
                        dialog: s,
                        reset: function () {
                            r.html('<iframe id="' + l + '_iframe" width="100%" height="' + (i.height - 70) + '" class="wrm-dialog-iframe" src="' + a + o + "/" + o + '.html" frameborder="0">')
                        },
                        open: function () {
                            s.open()
                        },
                        close: function () {
                            s.close()
                        },
                        isHidden: function () {
                            return c._ishidden
                        },
                        buttons: s.getButtons()
                    };
                s.on("ok", function () {
                        return c.onok.apply(n, arguments) === !1 ? !1 : void 0
                    }),
                    s.on("close", function () {
                        c.onclose.apply(n, arguments),
                            setTimeout(function () {
                                r.html("")
                            })
                    }),
                    s.on("cancel", function () {
                        c.oncancel.apply(n, arguments)
                    }),
                    s.on("open", function () {
                        c._ishidden = !1
                    }),
                    s.on("close", function () {
                        c._ishidden = !0
                    }),
                    s.positionTo(document.body),
                    t.on("click", function () {
                        c.reset(),
                            s.open()
                    })
            }
        }

        function _popup(e, t, n) {
            var o = e._cmd;
            if (e._popup) {
                var a = UEDITOR_CONFIG.UEDITOR_HOME_URL + "dialogs/",
                    i = e._popup,
                    l = "vrm_" + (+new Date).toString(36),
                    s = new FUI.Popup(i),
                    r = $(s.getElement()).find(".fui-panel-content"),
                    c = $EDITORUI[l] = {
                        _ishidden: !0,
                        editor: n,
                        className: "wrm-dialog-" + o,
                        uiName: "popup",
                        onok: function () {},
                        onclose: function () {},
                        oncancel: function () {},
                        popup: s,
                        reset: function () {
                            r.html('<iframe id="' + l + '_iframe" class="wrm-dialog-iframe" src="' + a + o + "/" + o + '.html" frameborder="0">')
                        },
                        open: function () {
                            s.show()
                        },
                        close: function () {
                            s.close()
                        },
                        isHidden: function () {
                            return c._ishidden
                        },
                        getDom: function (e) {
                            var t;
                            return t = "iframe" == e ? r.find("iframe")[0] : "body" == e || "content" == e ? r[0] : s.getElement()
                        }
                    };
                s.positionTo(t),
                    t.on("click", function () {
                        c.reset(),
                            s.show()
                    })
            }
        }

        function _copyAndCut(e, t, n) {
            n.on("zeroclipboardready", function (e, o) {
                o.clip(t.getElement()),
                    o.on("copy", function () {
                        "cut" == arguments[0].target.id && n.execCommand("inserthtml", UE.dom.domUtils.fillChar)
                    })
            })
        }

        function _simpleUpload(e, t, n) {
            n.fireEvent.call(n, "simpleuploadbtnready", t.getElement())
        }

        function _preview() {}

        /**
         *  注册widget为button元素在editor事件绑定
         *  @param i widget object
         *  @param fui button el
         *  @param ueditor editor object
         */
        ToolBar.registerWidgetHandler("Button", function (i, fui, ueditor) {
            var cmd = i._cmd;
            if ("forecolor" == cmd || "backcolor" == cmd) {
                var c = new FUI.ColorPicker({
                    clearText: "清除颜色",
                    commonText: "通用颜色",
                    standardText: "标准颜色",
                    resize: "none"
                });
                c.attachTo(fui),
                    c.on("selectcolor", function (e, t) {
                        ueditor.execCommand(cmd, t || 'default')
                    })
            } else
                i._dialog || i._popup || fui.on("click", function () {
                    ueditor.execCommand(cmd)
                });

            return ueditor.on("selectionchange", function () {
                    var e = ueditor.queryCommandState(cmd);
                    fui[-1 == e ? "disable" : "enable"](),
                        fui[1 == e ? "addClass" : "removeClass"]("fui-button-pressed")
                }),
                ("copy" == i.id || "cut" == i.id) && _copyAndCut.call(this, i, fui, ueditor),
                "simpleupload" == i.id && _simpleUpload.call(this, i, fui, ueditor),
                "preview" == i.id && _preview.call(this, i, fui, ueditor),
                _dialog.call(this, i, fui, ueditor),
                _popup.call(this, i, fui, ueditor),
                fui
        })

        /**
         *  注册widget为InputMenu元素在editor事件绑定
         *  @param e widget object
         *  @param t button fui
         *  @param n editor object
         */
        ToolBar.registerWidgetHandler("InputMenu", function (e, t, n) {
            function o(e) {
                e && (t.selectByValue(e) || t.clearSelect(),
                    a(e),
                    t.setValue(e))
            }

            function a(n) {
                "fontfamily" == l && $.each(e.menu.items, function (e, t) {
                    return t.value.replace(/[', ]/g, "") == n.replace(/[', ]/g, "") ? (n = t.label.text,
                        !1) : void 0
                }), t.__inputWidget.setValue(n)
            }

            function i() {
                return t.__inputWidget.getValue()
            }

            {
                var l = e._cmd;
                e.menu.items
            }
            return "fontfamily" == l && $(".fui-input", t.getElement()).attr({
                    readonly: "readonly",
                    unselectable: "on"
                }),
                t.on("itemclick inputcomplete", function (e, t) {
                    var o = t.value;
                    "fontsize" == l && /^[\d]+$/.test(o) && (o += "px"), n.execCommand(l, o)
                }),
                n.on("selectionchange", function () {
                    var e = n.queryCommandState(l);
                    t[-1 == e ? "disable" : "enable"](),
                        t[1 == e ? "addClass" : "removeClass"]("fui-button-pressed");
                    var a = n.queryCommandValue(l);
                    o(a)
                }),
                t.__menuWidget.on("inputcomplete", function () {
                    t.setValue(i())
                }), t
        })

        /**
         *  注册widget为ButtonMenu元素在editor事件绑定
         *  @param e widget object
         *  @param buttonFui button fui
         *  @param n editor object
         */
        ToolBar.registerWidgetHandler("ButtonMenu", function (e, buttonFui, n) {
            var cmd = e._cmd;
            return buttonFui.on("btnclick", function (e) {
                $(e.target).hasClass("fui-button-menu-down") || n.execCommand(cmd, buttonFui.getValue())
            }), buttonFui.on("select", function () {
                n.execCommand(cmd, buttonFui.getValue())
            }), buttonFui
        })

        /**
         *  注册widget为TablePicker元素在editor事件绑定
         *  @param e widget object
         *  @param fui  el
         *  @param n editor object
         */
        ToolBar.registerWidgetHandler("TablePicker", function (e, fui, ueditor) {
            var cmd = e._cmd;
            return fui.on("pickerselect", function (e, t) {
                    ueditor.execCommand(cmd, {
                        border: 1,
                        numCols: t.col,
                        numRows: t.row,
                        tdvalign: "top"
                    })
                }),
                ueditor.on("selectionchange", function () {
                    var s = ueditor.queryCommandState(cmd);
                    fui[-1 == s ? "disable" : "enable"](),
                        fui[1 == s ? "addClass" : "removeClass"]("fui-button-pressed")
                }), fui
        })

        ToolBar.ConfigTraveller = function (e, t) {
            if (e) {
                t(e);
                var n = "Tabs" === e.clazz ? e.panels : e.widgets;
                if (n && n.length)
                    for (var o = 0; o < n.length; o++)
                        ToolBar.ConfigTraveller(n[o], t)
            }
        }

        ToolBar.fn.initFuiMenu = function (menuConfig) {
            var self = this;

            self.menuWidget = FUI.Creator.parse(menuConfig);
            var $toolbarMenu = $(self.menuWidget.__element);
            $toolbarMenu.find('div.fui-button, div.fui-input-menu, div.fui-button-menu').attr('data-toggle', 'tooltip').attr('data-placement', 'bottom');
            $toolbarMenu.find('div.fui-label').remove();
            editor.toolbar.$toolbar.append($toolbarMenu);

            //增加按钮tip
            editor.toolbar.$toolbar.find('[data-toggle="tooltip"]').tooltip({
                'container': 'body',
                'delay': {
                    "show": 300,
                    "hide": 100
                }
            })

            ToolBar.ConfigTraveller(menuConfig, function (e) {
                e.clazz && e.id && (e._cmd = e._cmd || e.id,
                    e._dialog && (e._dialog.className = "vrm-dialog vrm-dialog-" + e.id),
                    e._popup && (e._popup.className = "vrm-popup vrm-popup-" + e.id))
            })

            ToolBar.ConfigTraveller(menuConfig, function (t) {
                var o = widgetHandler[t.clazz],
                    a = FUI.widgets[t.id];
                a && o && o.call(self, t, a, self.editor.myeditor.ueditor);
            })

            self.editor.myeditor.disable();
        }

    });

    //toolbar bind ueditor
    _ve(function (VE, $) {

        var MyEditor = function (editor) {
            this.usecount = 0;
            this.editor = editor;
            this.edit = false;
            this.ueditor = new UE.ui.Editor({
                toolbars: [
                    ["message", "editword"]
                ],
                initialStyle: "body{overflow-x:hidden!important;}p{word-wrap:break-word;}p{text-align:justify;letter-spacing:.001cm}table td,table th{border-color:#444444!important;padding:2px 8px;}",
                initialContent: "",
                autoClearinitialContent: true,
                focus: true,
                enableDragUpload: false,
                zIndex: 10,
                elementPathEnabled: false,
                wordCount: false
            });

        }

        MyEditor.fn = MyEditor.prototype;

        //ueditor expose vrm editor
        VE.MyEditor = MyEditor;


        //修复table html显示
        function tableFn($currentContent) {
            return $currentContent.find('table').attr({
                    cellspacing: 0,
                    cellpadding: 0
                }).css({
                    'border-collapse': 'collapse'
                })
                .find('td').css({
                    'border-bottom-color': '#000000',
                    'border-bottom-style': 'solid',
                    'border-bottom-width': '0.75pt',
                    'border-left-color': '#000000',
                    'border-left-style': 'solid',
                    'border-left-width': '0.75pt',
                    'border-right-color': '#000000',
                    'border-right-style': 'solid',
                    'border-right-width': '0.75pt',
                    'border-top-color': '#000000',
                    'border-top-style': 'solid',
                    'border-top-width': '0.75pt'
                });
        }

        //执行命令
        MyEditor.fn.excCmd = function (cmd, opt) {
            var self = this;
            if (opt) {
                self.ueditor.execCommand(cmd, opt)
            } else {
                self.ueditor.execCommand(cmd)
            }
        }

        //禁用工具头
        MyEditor.fn.disable = function () {
            var self = this;
            var widgets = self.editor.toolbar.menuWidget.getWidgets();
            $.each(widgets, function (i, widget) {
                if (widget.widgetName == 'TablePicker') {
                    widget.__buttonWidget.disable();
                } else {
                    widget.disable();
                }
            })
        }

        //启用工具头
        MyEditor.fn.enable = function () {
            var self = this;
            var widgets = self.editor.toolbar.menuWidget.getWidgets();
            $.each(widgets, function (i, widget) {
                if (widget.widgetName == 'TablePicker') {
                    widget.__buttonWidget.enable();
                } else {
                    widget.enable();
                }
            })
        }

        //判断是否编辑中
        MyEditor.fn.editing = function () {
            return this.edit;
        }

        //获取正在编辑目标
        MyEditor.fn.getEditTarget = function () {
            var self = this;
            if (self.editing()) {
                return $('.wd-editor-location');
            }
            return null;
        }

        //获取编辑目标所在大纲
        MyEditor.fn.getEditOutlineTarget = function () {
            var self = this;
            if (self.editing()) {
                return $('.wd-editor-location').closest('.wd-outline')
            }
            return null;
        }

        /**
         * 关闭编辑器
         */
        MyEditor.fn.__closeEdit = function (callback) {

            var self = this,
                ueditor = self.ueditor,
                $body = VE.$body;

            if (!self.editing()) {
                return;
            }

            if (ueditor.container && self.editing()) {
                $body.append(ueditor.container.parentNode);
                ueditor.reset();
                ueditor.setHide();
                setTimeout(function () {
                    ueditor.fireEvent('contentchange');
                }, 500);
            }

            setTimeout(function () {
                self.edit = false;
                self.disable();
            }, 500)


            if (callback && typeof callback == 'function') {
                callback(self, self.editor);
            }
        }

        /**
         * 绑定编辑器
         * @param {element jquery} $container  定位容器 （class="wd-wk"元素）
         * @param {element jquery} $content  编辑器获取内容元素 （class="wd-wk-content"元素）
         * @param {json} serverparam  提交服务器数据 （提交后台数据）
         * @param {function} callback 开启回调函数
         * @param {function} errorFn 开启编辑失败
         */
        MyEditor.fn.openEdit = function ($container, $content, callback, errorFn) {
            if (!($container instanceof jQuery) || !$container.hasClass('wd-wk')) {
                errorFn && errorFn.call(this, '编辑内容不存在');
                return;
            }

            //当前已经编辑
            if ($container.hasClass('wd-editor-location')) {
                errorFn && errorFn.call(this, '当前内容已开启编辑模式');
                return;
            }

            var $body = VE.$body,
                $wklocation = $body.find('.wd-editor-location');
            if ($wklocation.length > 0) {
                errorFn && errorFn.call(this, '已存在内容编辑区域', $wklocation);
                return;
            }

            var self = this,
                ueditor = self.ueditor,
                editorId = 'editor-' + new Date().valueOf();

            if (self.usecount > 0) {
                $container.addClass('wd-editor-location').append(ueditor.container.parentNode);
                setTimeout(function () {
                    ueditor.setContent($content.html());
                    ueditor.show();

                    self.usecount++;
                }, 100);
            } else {
                $container.addClass('wd-editor-location') //标记当前内容编辑
                    .append('<div id="' + editorId + '" style="width: 100%"></div>'); //存放编辑器ID

                ueditor.render(editorId);
                var it = setInterval(function () {
                    if (ueditor.body) {
                        clearInterval(it);
                        ueditor.setContent($content.html());
                    }
                    self.usecount++;
                }, 100);
            }

            $content.hide();

            //设置额外数据
            ueditor.setOpt('__data__', {
                docId: config.getDocId(),
                token:vp.cookie.getToken()
            })
            self.edit = true;
            self.enable();

            if (callback && typeof callback === 'function') {
                callback(self, self.editor);
            }
        }

        /**
         * 保存退出编辑器
         * @param {function} saveCallBack 保存回调事件
         * @param {function} callback 回调事件
         */
        MyEditor.fn.saveExitEdit = function (saveCallBack) {
            var self = this;
            if (!self.editing()) {
                return;
            }

            if (saveCallBack && typeof saveCallBack === 'function') {
                saveCallBack.call(self);
            }
        }

        /**
         * 保存成功编辑回调函数
         * @param callback
         */
        MyEditor.fn.saveExitEditOkFn = function (callback) {
            var self = this,
                ueditor = self.ueditor,
                $wdEditLocation = $('.wd-editor-location');

            if (!self.editing()) {
                return;
            }
            //$wdEditLocation.find('.wd-wk-content').html(ueditor.getContent());
            self.exitEdit(callback);
        }

        /**
         * 退出编辑器
         * @param {boolean} isSaveContent 是否保存内容
         * @param {function} callback 回调函数
         */
        MyEditor.fn.exitEdit = function (callback) {
            var self = this;
            if (!self.editing()) {
                return;
            }

            var $wdEditLocation = $('.wd-editor-location');
            if ($wdEditLocation.length > 0) {
                var $content = $wdEditLocation.find('.wd-wk-content');
                tableFn($content);
                $content.show();

                $wdEditLocation.removeClass('wd-editor-location');
            }

            self.__closeEdit(callback);
        }
    });

    //ueditor plguin
    _ve(function (VE, $) {

        UE.plugin.register("justify", function () {
                var e = this;
                return {
                    commands: {
                        justifyleft: {
                            execCommand: function () {
                                e.execCommand("justify", "left")
                            },
                            queryCommandState: function () {
                                return -1 == e.queryCommandState("justify") ? -1 : "left" == e.queryCommandValue("justify") ? 1 : 0
                            }
                        },
                        justifycenter: {
                            execCommand: function () {
                                e.execCommand("justify", "center")
                            },
                            queryCommandState: function () {
                                return -1 == e.queryCommandState("justify") ? -1 : "center" == e.queryCommandValue("justify") ? 1 : 0
                            }
                        },
                        justifyright: {
                            execCommand: function () {
                                e.execCommand("justify", "right")
                            },
                            queryCommandState: function () {
                                return -1 == e.queryCommandState("justify") ? -1 : "right" == e.queryCommandValue("justify") ? 1 : 0
                            }
                        },
                        justifyjustify: {
                            execCommand: function () {
                                e.execCommand("justify", "justify")
                            },
                            queryCommandState: function () {
                                return -1 == e.queryCommandState("justify") ? -1 : "justify" == e.queryCommandValue("justify") ? 1 : 0
                            }
                        }
                    }
                }
        }),

        UE.plugin.register("blockindent", function () {
            var e = this,
                t = function () {
                    var t = UE.dom.domUtils.filterNodeList(e.selection.getStartElementPath(), "p h1 h2 h3 h4 h5 h6");
                    return t && t.style.marginLeft && Math.round(parseInt(t.style.marginLeft) / 32)
                };
            return {
                commands: {
                    blockindent: {
                        execCommand: function () {
                            var t = e.queryCommandValue("blockindent");
                            e.execCommand("paragraph", "p", {
                                style: "margin-left:" + (32 * ++t + "px")
                            })
                        },
                        queryCommandValue: t
                    },
                    blockoutdent: {
                        execCommand: function () {
                            var t = e.queryCommandValue("blockoutdent");
                            t > 0 && e.execCommand("paragraph", "p", {
                                style: "margin-left:" + (32 * --t + "px")
                            })
                        },
                        queryCommandValue: t
                    }
                }
            }
        }),

        UE.plugin.register("hotkey.save", function () {
            return {
                shortcutkey : {hotkeysave : 'ctrl+83'},
                commands: {
                    hotkeysave: {
                        notNeedUndo: true,
                        ignoreContentChange: true,
                        execCommand: function () {
                            if (UE.utils.isFunction(VE.editorContentSave)) {
                                VE.editorContentSave();
                            }
                        }
                    }
                }
            }
        }),

        UE.plugins['insertwordimages'] = function () {
            var me = this;
            me.commands['insertwordimages'] = {
                execCommand: function (cmd, opt) {
                    opt = UE.utils.isArray(opt) ? opt : [opt];
                    if (!opt.length) {
                        return;
                    }
                    range = me.selection.getRange(),
                        img = range.getClosedNode();

                    if (me.fireEvent('beforeinsertimage', opt) === true) {
                        return;
                    }

                    function unhtmlData(imgCi) {

                        UE.utils.each('width,height,border,hspace,vspace'.split(','), function (item) {

                            if (imgCi[item]) {
                                imgCi[item] = parseInt(imgCi[item], 10) || 0;
                            }
                        });

                        UE.utils.each('src,_src'.split(','), function (item) {

                            if (imgCi[item]) {
                                imgCi[item] = UE.utils.unhtmlForUrl(imgCi[item]);
                            }
                        });
                        UE.utils.each('title,alt'.split(','), function (item) {

                            if (imgCi[item]) {
                                imgCi[item] = UE.utils.unhtml(imgCi[item]);
                            }
                        });
                    }

                    if (img && /img/i.test(img.tagName) && (img.className != "edui-faked-video" || img.className.indexOf("edui-upload-video") != -1) && !img.getAttribute("word_img")) {
                        var first = opt.shift();
                        var floatStyle = first['floatStyle'];
                        delete first['floatStyle'];
                        UE.dom.domUtils.setAttributes(img, first);
                        me.execCommand('imagefloat', floatStyle);
                        if (opt.length > 0) {
                            range.setStartAfter(img).setCursor(false, true);
                            me.execCommand('insertimage', opt);
                        }

                    } else {
                        var html = [],
                            str = '',
                            ci;
                        ci = opt[0];
                        if (opt.length == 1) {
                            unhtmlData(ci);

                            str = '<img src="' + ci.src + '" ' + (ci._src ? ' _src="' + ci._src + '" ' : '') +
                                (' class="chtech-img ' + (ci['type'] == 'ole' ? 'chtech-ole' : '') + '"') +
                                (ci.width ? 'width="' + ci.width + '" ' : '') +
                                (ci.height ? ' height="' + ci.height + '" ' : '') +
                                (ci['floatStyle'] == 'left' || ci['floatStyle'] == 'right' ? ' style="float:' + ci['floatStyle'] + ';"' : '') +
                                (ci.title && ci.title != "" ? ' title="' + ci.title + '"' : '') +
                                (ci.border && ci.border != "0" ? ' border="' + ci.border + '"' : '') +
                                (ci['type'] == 'ole' && ci.alt && ci.alt != "" ? ' alt="' + ci.alt + '"' : '') +
                                (ci.tagUUID != "" ? ' data-tag-uuid="' + ci.tagUUID + '"' : '') +
                                (ci.hspace && ci.hspace != "0" ? ' hspace = "' + ci.hspace + '"' : '') +
                                (ci.vspace && ci.vspace != "0" ? ' vspace = "' + ci.vspace + '"' : '') + '/>';
                            if (ci['floatStyle'] == 'center') {
                                str = '<p style="text-align: center">' + str + '</p>';
                            }
                            html.push(str);

                        } else {
                            for (var i = 0; ci = opt[i++];) {
                                unhtmlData(ci);
                                str = '<p ' + (ci['floatStyle'] == 'center' ? 'style="text-align: center" ' : '') + '><img src="' + ci.src + '" ' +
                                    (' class="chtech-img ' + (ci['type'] == 'ole' ? 'chtech-ole' : '') + '"') +
                                    (ci.width ? 'width="' + ci.width + '" ' : '') + (ci._src ? ' _src="' + ci._src + '" ' : '') +
                                    (ci.height ? ' height="' + ci.height + '" ' : '') +
                                    ' style="' + (ci['floatStyle'] && ci['floatStyle'] != 'center' ? 'float:' + ci['floatStyle'] + ';' : '') +
                                    (ci.border || '') + '" ' +
                                    (ci['type'] == 'ole' && ci.alt && ci.alt != "" ? ' alt="' + ci.alt + '"' : '') +
                                    (ci.tagUUID != "" ? ' data-tag-uuid="' + ci.tagUUID + '"' : '') +
                                    (ci.title ? ' title="' + ci.title + '"' : '') + ' /></p>';
                                html.push(str);
                            }
                        }

                        me.execCommand('insertHtml', html.join(''));
                    }

                    me.fireEvent('afterinsertimage', opt)
                }
            }
        }
    });

    //增加 toolbar 到vrm editor
    _ve(function (VE, $) {
        VE.fn.addToolbar = function () {
            var editor = this;
            editor.toolbar = new VE.ToolBar(editor);
            editor.myeditor = new VE.MyEditor(editor);
        }
    });

    //fui menu
    _ve(function (VE, $) {

        VE.fn.renderFUIMenu = function () {
            var editor = this;
            var toolbar = editor.toolbar;

            var menuConfig = {
                clazz: "Panel",
                className: "vrm-line vrm-line-2",
                widgets: [{
                    clazz: "Button",
                    id: "undo",
                    className: "vrm-btn vrm-btn-undo",
                    text: "撤销"
                }, {
                    clazz: "Button",
                    id: "redo",
                    className: "vrm-btn vrm-btn-redo",
                    text: "恢复"
                }, {
                    clazz: "Button",
                    id: "copy",
                    className: "vrm-btn vrm-btn-copy",
                    text: "复制"
                }, {
                    clazz: "Button",
                    id: "removeformat",
                    className: "vrm-btn vrm-btn-removeformat",
                    text: "清除格式"
                }, {
                    clazz: "Button",
                    id: "autotypeset",
                    className: "vrm-btn vrm-btn-autotypeset",
                    text: "自动格式化"
                }, {
                    clazz: "Button",
                    id: "formatmatch",
                    className: "vrm-btn vrm-btn-formatmatch",
                    text: "格式刷"
                }, {
                    clazz: "InputMenu",
                    id: "fontfamily",
                    className: "vrm-input-menu-fontfamily",
                    text: "字体格式",
                    select: 1,
                    input: {
                        placeholder: "字体格式"
                    },
                    menu: {
                        items: function () {
                            var items = [];
                            return $.each([{
                                name: "songti",
                                val: "宋体,SimSun"
                            }, {
                                name: "yahei",
                                val: "微软雅黑,Microsoft YaHei"
                            }, {
                                name: "kaiti",
                                val: "楷体,楷体_GB2312, SimKai"
                            }, {
                                name: "heiti",
                                val: "黑体, SimHei"
                            }, {
                                name: "lishu",
                                val: "隶书, SimLi"
                            }, {
                                name: "andaleMono",
                                val: "andale mono"
                            }, {
                                name: "arial",
                                val: "arial, helvetica,sans-serif"
                            }, {
                                name: "arialBlack",
                                val: "arial black,avant garde"
                            }, {
                                name: "comicSansMs",
                                val: "comic sans ms"
                            }, {
                                name: "impact",
                                val: "impact,chicago"
                            }, {
                                name: "timesNewRoman",
                                val: "times new roman"
                            }], function (t, n) {
                                items.push({
                                    value: n.val,
                                    label: {
                                        text: n.val,
                                        style: {
                                            "font-family": n.val,
                                            "font-size": "18px"
                                        }
                                    }
                                })
                            }), items
                        }()
                    }
                }, {
                    clazz: "InputMenu",
                    id: "fontsize",
                    className: "vrm-input-menu-fontsize",
                    text: "字号",
                    select: 1,
                    input: {
                        placeholder: "字号"
                    },
                    menu: {
                        items: function () {
                            var items = [];
                            return $.each([10, 11, 12, 14, 16, 18, 20, 24, 36], function (k, t) {
                                items.push({
                                    value: t + "px",
                                    label: {
                                        text: t + "px",
                                        style: {
                                            "font-size": t + "px"
                                        }
                                    }
                                })
                            }), items
                        }()
                    }
                }, {
                    clazz: "Button",
                    id: "bold",
                    className: "vrm-btn vrm-btn-bold",
                    text: "加粗"
                }, {
                    clazz: "Button",
                    id: "italic",
                    className: "vrm-btn vrm-btn-italic",
                    text: "倾斜"
                }, {
                    clazz: "Button",
                    id: "underline",
                    className: "vrm-btn vrm-btn-underline",
                    text: "下划线"
                }, {
                    clazz: "Button",
                    id: "strikethrough",
                    className: "vrm-btn vrm-btn-strikethrough",
                    text: "删除线"
                }, {
                    clazz: "Button",
                    id: "forecolor",
                    className: "vrm-btn vrm-btn-forecolor",
                    text: "文字颜色"
                }, {
                    clazz: "Button",
                    id: "backcolor",
                    className: "vrm-btn vrm-btn-backcolor",
                    text: "背景颜色"
                }, {
                    clazz: "ButtonMenu",
                    id: "unorderedlist",
                    _cmd: "insertunorderedlist",
                    className: "vrm-btnmenu-unorderedlist",
                    text: "项目编号",
                    selected: 1,
                    buttons: [{
                        className: "fui-button-menu-button"
                    }, {
                        className: "fui-button-menu-down"
                    }],
                    menu: {
                        items: [{
                            label: "○ 空心项目符号",
                            value: "circle"
                        }, {
                            label: "● 实心项目符号",
                            value: "disc"
                        }, {
                            label: "■ 方形项目符号",
                            value: "square"
                        }]
                    }
                }, {
                    clazz: "ButtonMenu",
                    id: "orderedlist",
                    _cmd: "insertorderedlist",
                    className: "vrm-btnmenu-orderedlist",
                    text: "编号",
                    selected: 0,
                    buttons: [{
                        className: "fui-button-menu-button"
                    }, {
                        className: "fui-button-menu-down"
                    }],
                    menu: {
                        items: [{
                            label: "1., 2., 3., 4.,  ",
                            value: "decimal"
                        }, {
                            label: "a., b., c., d.,  ",
                            value: "lower-alpha"
                        }, {
                            label: "i., ii., iii., iv.,  ",
                            value: "lower-roman"
                        }, {
                            label: "A., B., C., D.,  ",
                            value: "upper-alpha"
                        }, {
                            label: "I., II., III., IV.,  ",
                            value: "upper-roman"
                        }]
                    }
                }, {
                    clazz: "Button",
                    id: "justifyleft",
                    className: "vrm-btn vrm-btn-justifyleft",
                    text: "向左对齐"
                }, {
                    clazz: "Button",
                    id: "justifycenter",
                    className: "vrm-btn vrm-btn-justifycenter",
                    text: "居中对齐"
                }, {
                    clazz: "Button",
                    id: "justifyright",
                    className: "vrm-btn vrm-btn-justifyright",
                    text: "向右对齐"
                }, {
                    clazz: "Button",
                    id: "justifyjustify",
                    className: "vrm-btn vrm-btn-justifyjustify",
                    text: "两端对齐"
                }, {
                    clazz: "Button",
                    id: "blockindent",
                    className: "vrm-btn vrm-btn-blockindent",
                    text: "增加缩进"
                }, {
                    clazz: "Button",
                    id: "blockoutdent",
                    className: "vrm-btn vrm-btn-blockoutdent",
                    text: "减少缩进"
                }, {
                    clazz: "ButtonMenu",
                    id: "lineheight",
                    className: "vrm-btnmenu-lineheight",
                    text: "行高",
                    selected: 0,
                    buttons: [{
                        className: "fui-button-menu-button"
                    }, {
                        className: "fui-button-menu-down"
                    }],
                    menu: {
                        items: function () {
                            var items = [];
                            return $.each([1, 1.5, 1.75, 2, 3, 4, 5], function (k, t) {
                                items.push({
                                    value: t,
                                    label: t
                                })
                            }), items
                        }()
                    }
                }, {
                    clazz: "Button",
                    id: "spechars",
                    className: "vrm-btn vrm-btn-spechars",
                    text: "字符",
                    _dialog: {
                        width: 620,
                        height: 575,
                        caption: "插入字符"
                    }
                }, {
                    clazz: "TablePicker",
                    id: "inserttable",
                    _cmd: "inserttable",
                    button: {
                        className: "vrm-btn vrm-btn-inserttable",
                        text: "插入表格"
                    }
                }, {
                    clazz: "Button",
                    id: "wordfile",
                    className: "vrm-btn vrm-btn-wordfile",
                    text: "插入附件",
                    _dialog: {
                        width: 660,
                        height: 470,
                        caption: ""
                    }
                }]
            }

            toolbar.initFuiMenu(menuConfig);
        }

    });
    /*-----------------------------------toolbar  end----------------------------------*/

    //dropdownList
    _ve(function (VE, $) {

        function getDropDownTpl() {
            return '{{each list as li i}}<li><a href="javascript:;">{{if li.iconClass}}<i class="fa {{li.iconClass}}"></i> {{/if}}{{li.text}}</a></li>{{/each}}';
        }

        var DropDownList = function (settings) {
            this.editor = settings.editor;
            this.data = VE.isArray(settings.data) ? settings.data : [];
            this.target = settings.target;
            this.$dom = $('<ul class="dropdown-menu"></ul>')
            $.each(this.data, function (i, v) {
                v.disable = VE.isFunction(v.disable) ? v.disable : function () {
                    return false
                };
                v.show = VE.isFunction(v.show) ? v.show : function () {
                    return true
                };
                v.clickEvent = VE.isFunction(v.clickEvent) ? v.clickEvent : function () {};
            })
            this.__init();
        }

        DropDownList.fn = DropDownList.prototype;
        //DropDownList expose vrm editor
        VE.DropDownList = DropDownList;

        DropDownList.fn.__init = function () {
            var self = this;
            //初始化dom
            self.__initDom();
            self.__bindEvent();
        }

        DropDownList.fn.getDom = function () {
            return this.$dom;
        }

        DropDownList.fn.bindMount = function (target) {
            this.target = target;
        }

        //初始化 dom
        DropDownList.fn.__initDom = function () {
            var self = this;
            self.$dom.empty();
            self.$dom.append(template.render(getDropDownTpl(), {
                list: self.data
            }));

            //增加disable
            self.$dom.find('li').each(function (k, li) {
                if (self.editor.scene && !self.editor.scene.auth(self.data[k].optId)) {
                    $(li).addClass('wd-hide');
                    return true;
                }

                var show = self.data[k].show.call(self.editor, self);
                if (!show) {
                    $(li).addClass('wd-hide');
                } else {
                    $(li).removeClass('wd-hide');
                }

                var disable = self.data[k].disable.call(self.editor, self);
                if (disable) {
                    $(li).addClass('wd-disabled');
                } else {
                    $(li).removeClass('wd-disabled');
                }
            })

            if (self.data.length == 0 
                || self.$dom.find('li.wd-hide').length == self.data.length) {
                    self.$dom.addClass('wd-hide');
            }
        }

        //bind event
        DropDownList.fn.__bindEvent = function () {
            var self = this;
            var data = self.data;

            $(self.$dom).on('click', 'li', function () {
                var index = $(this).index();
                //判断是显示
                var show = data[index].show.call(self.editor, self);
                if (!show) {
                    return false;
                }

                //判断是否禁用
                var disable = data[index].disable.call(self.editor, self);
                if (disable) {
                    return false;
                }
                //点击事件
                data[index].clickEvent.call(self.editor, self);
            })
        }

        DropDownList.fn.render = function () {
            var self = this;
            self.__initDom();
        }
    });

    //outline menu
    _ve(function (VE, $) {
        //construct
        var OutlineMenu = function (settings) {
            this.optId = settings.optId;
            this.$outline = settings.$outline;
            this.editor = settings.editor;
            this.show = settings.show || function () {
                return true;
            };
            this.menuItems = [];
            if (this.$outline && this.$outline.length > 0) {
                this.$dom = settings.$outline.find('.wd-outline-menu');
                this.__initEvent();
            }
        }

        OutlineMenu.fn = OutlineMenu.prototype;

        //OutlineMenu expose vrm editor
        VE.OutlineMenu = OutlineMenu;

        //初始化事件
        OutlineMenu.fn.__initEvent = function () {
            var self = this;

            //大纲绑定菜单渲染
            self.$outline.bind('menu.render', function () {
                self.render();
            })
        }

        //绑定挂载大纲
        OutlineMenu.fn.bindMount = function ($outline) {
            var self = this;
            self.$outline = $outline;
            self.$outline.data('menu', self);
            self.$dom = self.$outline.find('.wd-outline-menu');
            self.__initEvent();
            return self;
        }

        //add menu item
        OutlineMenu.fn.addMenuItem = function (item) {
            var self = this;
            if (!item || !(item instanceof VE.OutlineMenuItem)) {
                return;
            }

            self.menuItems.push(item);
        }

        //add render item
        OutlineMenu.fn.render = function () {
            var self = this;
            //过滤封面大纲
            if (!self.$dom || self.$dom.length == 0) {
                return;
            }

            if (self.editor.scene && !self.editor.scene.auth(self.optId)) {
                return;
            }

            //销毁之前显示的tip
            self.$dom.find('[data-toggle="tooltip"]').tooltip('destroy');

            //清空
            self.$dom.empty();

            //判断是否显示
            if (!self.show()) {
                return;
            }

            //判断是否有功能项
            if (!self.menuItems || self.menuItems.length == 0) {
                return;
            }

            //计算渲染
            var index = 0;
            var menuItemRendereds = {};

            function getTpl(menuItem) {
                var tpl = '<div class="wd-outline-menu-btn btn-group fl vrm-tool text-center" role="group">' +
                    '<a href="javascript:;" {{if type == "dropdownUl" || type == "dropdownPanel"}}data-toggle="dropdown"{{/if}}>' +
                    '<i class="fa {{icon}} fa-fw green" data-toggle="tooltip" data-placement="top" title="{{title}}"></i>' +
                    '</a>' +
                    '{{if type == "dropdownUl"}}<ul class="wd-custom-render dropdown-menu dropdown-ul"></ul>{{/if}}' +
                    '{{if type == "dropdownPanel"}}<div class="wd-custom-render dropdown-menu dropdown-menu-normal p-sm"></div>{{/if}}' +
                    '</div>';

                return template.render(tpl, menuItem);
            }

            $.each(self.menuItems, function (i, menuItem) {
                if (!menuItem.title || !menuItem.icon) {
                    return true;
                }

                if (self.editor.scene && !self.editor.scene.auth(menuItem.optId)) {
                    return true;
                }

                //判断是否展示
                if (!menuItem.show.call(self)) {
                    return true;
                }

                var $menuItem = $(getTpl(menuItem));

                //判断是否禁用
                if (menuItem.disable.call(self)) {
                    $menuItem.addClass('wd-disabled');
                }

                if (menuItem.type == 'dropdownUl' || menuItem.type == 'dropdownPanel') {
                    menuItem.render.call(self, $menuItem.find('.wd-custom-render'));
                }

                //设置缓存标记
                $menuItem.data('index', index);
                menuItemRendereds[index] = menuItem;

                //添加dom
                self.$dom.append($menuItem);
                index++;
            })


            //事件绑定
            self.$dom.find('.wd-outline-menu-btn').click(function () {
                var index = $(this).data('index');
                var menuItem = menuItemRendereds[index];

                //判断是否禁用
                var disable = menuItem.disable.call(self);
                if (disable) {
                    return;
                }

                //回调点击事件
                menuItem.clickEvent.call(self);
            })

            //增加功能按钮切换展示
            self.$dom.append('<a href="javascript:;" class="vrm-minibtn text-center fl">' +
                '<i class="fa fa-bars fa-fw text-muted" data-toggle="tooltip" data-placement="right" title="更多"></i>' +
                '</a>');

            //实现功能按钮切换功能
            self.$dom.find('.vrm-minibtn').click(function (event) {
                self.$dom.toggleClass('tool-open');
            });


            self.$dom.find('[data-toggle="tooltip"]').tooltip({
                'delay': {
                    "show": 300,
                    "hide": 100
                },
                'container': 'body'
            });
        }
    });

    //outline menu item
    _ve(function (VE, $) {

        /**
         *  {title:'名称', type:[button、dropdown、other|]}
         * @param settings
         * @constructor
         */
        var OutlineMenuItem = function (settings) {
            this.optId = settings.optId;
            this.title = settings.title;
            this.type = settings.type;
            this.icon = settings.icon;
            this.disable = VE.isFunction(settings.disable) ? settings.disable : function () {
                return false;
            };
            this.show = VE.isFunction(settings.show) ? settings.show : function () {
                return true;
            };
            this.render = VE.isFunction(settings.render) ? settings.render : function () {};
            this.clickEvent = VE.isFunction(settings.clickEvent) ? settings.clickEvent : function () {};
        }

        OutlineMenuItem.fn = OutlineMenuItem.prototype;

        //OutlineMenuItem expose vrm editor
        VE.OutlineMenuItem = OutlineMenuItem;
    });

    //Tag
    _ve(function (VE, $) {

        /**
         * 标签
         * {
         *     container:渲染容器
         *     target:绑定对象
         *     type:显示类型 button| label （不支持移除事件）
         *     style:{className:'样式', icon:'': nobg:'true|false'}
         *     text:'标签显示内容'
         *     onlyRead:只读模式'true|false'
         *     remove:'移除事件'
         *     show:'是否显示'
         * }
         * @constructor
         */
        var Tag = function (settings) {
            this.id = settings.id || VE.uuid();
            this.container = settings.container;
            this.target = settings.target;
            this.type = settings.type || 'label'
            this.style = settings.style || {
                className: '',
                icon: '',
                nobg: false
            };
            this.text = settings.text;
            this.onlyRead = settings.onlyRead || false;
            this.openClick = settings.openClick || false;
            this.remove = settings.remove || function () {};
            this.show = settings.show || function () {
                return true
            };
            this.clickEvent = settings.clickEvent || function () {};
        };

        Tag.fn = Tag.prototype;
        //Tag expose vrm editor
        VE.Tag = Tag;

        Tag.fn.__init = function () {
            var self = this;
            var show = self.show.call(self);
            if (!show) {
                return;
            }

            self.$dom = $(template.render(getTpl(), self));
            if (self.onlyRead) {
                self.$dom.find('span.times').remove();
                return;
            }

            self.$dom.find('span.times').click(function () {
                self.remove.call(self);
            })

            if (self.openClick) {
                self.$dom.find('span.times').remove();
                self.$dom.click(function () {
                    self.clickEvent.call(self);
                })
            }
        }

        //设置读模式 true||false
        Tag.fn.setOnlyRead = function (mod) {
            var self = this;
            self.onlyRead = mod || false;
            self.render();
        }

        //渲染
        Tag.fn.render = function () {
            var self = this;
            self.__init();
            return self;
        }

        //移除自身dom
        Tag.fn.removeDom = function () {
            var self = this;
            if (self.onlyRead) {
                return;
            }

            self.$dom && self.$dom.remove();
            if (typeof self.container.removeTag === 'function') {
                self.container.removeTag(self);
            }
        }

        //标签点击事件
        Tag.fn.clickEvent = function () {
            var self = this;
            self.click();
        }

        //获取dom
        Tag.fn.getDom = function () {
            return this.$dom;
        }

        function getTpl() {
            return '{{if type == "button"}}<button type="button" class="btn {{style.className||"btn-default"}} {{if style.nobg}}nobg{{/if}} btn-xs pr vrm-tag"><span class="times">x</span>{{if style.icon}}<i class="fa {{style.icon}} fa-fw"></i>{{/if}} {{text}}</button>{{/if}}' +
                '{{if type=="label"}}<span class="label {{style.className || "label-default"}} vrm-tag">{{if style.icon}}<i class="fa {{style.icon}} fa-fw"></i>{{/if}} {{text}}</span>{{/if}}';
        }
    });

    //OutlineTags
    _ve(function (VE, $) {

        /**
         * {
         *   editor:'vrm editor'
         *   $outline : '大纲对象'
         * }
         * @param obj 对象 {editor、}
         * @constructor
         */
        var OutlineTags = function (settings) {
            this.editor = settings.editor;
            this.$outline = settings.$outline;
            this.$dom = $('<div class="label-box m-t-sm p-sm clearfix vrm-tags tag-' + VE.uuid() + '" role="alert"><div class="fl"></div><div class="fr"></div></div>');
            this.leftTags = [];
            this.rightTags = [];
        }

        OutlineTags.fn = OutlineTags.prototype;
        //Tag expose vrm editor
        VE.OutlineTags = OutlineTags;

        /**
         * 创建大纲内容标签
         * @param target 创建位置目标
         * @param position 创建位置 before | after | inner 默认inner
         * @return {OutlineTags}
         */
        OutlineTags.fn.createPostion = function (target, position) {
            var self = this;

            if (position == 'after') {
                $(target).after(self.getDom());
            } else if (position == 'before') {
                $(target).before(self.getDom());
            } else {
                $(target).append(self.getDom());
            }

            return self;
        }

        /**
         * 绑定vrm editor
         * @param {VE.VRMeditor} editor vrmeditor
         */
        OutlineTags.fn.withEditor = function (editor) {
            var self = this;
            self.editor = editor;
            return self;
        }

        /**
         * 绑定大纲
         * @param {JQuery} $outline 大纲对象
         */
        OutlineTags.fn.withOutline = function ($outline) {
            var self = this;
            self.$outline = $outline;
            return self;
        }

        //增加左侧标签
        OutlineTags.fn.addLeftTags = function (tag) {
            if (tag && tag instanceof VE.Tag) {
                this.leftTags.push(tag);
            }
        }

        //增加右侧标签
        OutlineTags.fn.addRightTags = function (tag) {
            if (tag && tag instanceof VE.Tag) {
                this.rightTags.push(tag);
            }
        }

        //渲染
        OutlineTags.fn.render = function () {
            var self = this;
            //大纲设置tags关联self
            self.$outline.data('tags', self);

            var $leftContainer = self.$dom.find('.fl').empty();
            var $rightContainer = self.$dom.find('.fr').empty();

            $.each(self.leftTags, function (k, tag) {
                $leftContainer.append(tag.render().getDom());
            })

            $.each(self.rightTags, function (k, tag) {
                $rightContainer.append(tag.render().getDom());
            })

            //判断显示还是隐藏
            if (self.leftTags.length == 0 && self.rightTags == 0) {
                this.$dom.hide();
            } else {
                this.$dom.show();
            }

            return self;
        }

        //获取dom
        OutlineTags.fn.getDom = function () {
            var self = this;
            return this.$dom;
        }

        //移除标签
        OutlineTags.fn.removeTag = function (tag) {
            var self = this;
            $.each(self.leftTags, function (k, ltag) {
                if (ltag == tag) {
                    self.leftTags.splice(k, 1);
                    return false;
                }
            })

            $.each(self.rightTags, function (k, rtag) {
                if (rtag == tag) {
                    self.rightTags.splice(k, 1);
                    return false;
                }
            })

            self.render();
        }

        //通过标签id 移除标签
        OutlineTags.fn.removeTagById = function (id) {
            var self = this;

            $.each(self.leftTags, function (k, ltag) {
                if (ltag.id == id) {
                    self.leftTags.splice(k, 1);
                    return false;
                }
            })

            $.each(self.rightTags, function (k, rtag) {
                if (rtag.id == id) {
                    self.rightTags.splice(k, 1);
                    return false;
                }
            })

            self.render();
        }

        //通过标签id 移除标签
        OutlineTags.fn.findTagById = function (id) {
            var self = this;
            var tag = null;
            $.each(self.leftTags, function (k, ltag) {
                if (ltag.id == id) {
                    tag = ltag;
                    return false;
                }
            })

            $.each(self.rightTags, function (k, rtag) {
                if (rtag.id == id) {
                    tag = rtag;
                    return false;
                }
            })
            return tag;
        }
    });

    //Toolbox
    _ve(function (VE, $) {
        /**
         *  {
         *      editor : 'vrm editor'
         *      target : '关联目标对象'
         *  }
         * @param settings
         * @constructor
         */
        var ToolBox = function (settings) {
            this.optId = settings.optId;
            this.editor = settings.editor;
            this.target = settings.target || {};
            this.show = VE.isFunction(settings.show) ? settings.show : function () {
                return true
            };
            this.boxs = [];
        }

        ToolBox.fn = ToolBox.prototype;
        //ToolBox expose vrm editor
        VE.ToolBox = ToolBox;

        //添加按钮
        ToolBox.fn.addBtn = function (btn) {
            var self = this;
            if (btn && btn instanceof VE.Button) {
                self.boxs.push(btn);
            }
        }
        /**
         * 绑定挂载目标
         * @param {Object} target 目标
         */
        ToolBox.fn.bindMount = function (target) {
            var self = this;
            self.target = target;
            return self;
        }

        /**
         * 绑定提示显示
         * @param {JQuery} $tip 绑定提示对象
         */
        ToolBox.fn.bindTip = function ($tip) {
            var self = this;

            //场景权限控制
            if (self.editor.scene && !self.editor.scene.auth(self.optId)) {
                $tip.remove();
                return;
            }

            $tip.popover({
                trigger: 'click',
                container: $tip,
                placement: 'right',
                html: true,
                content: self.render().getDom()
            }).on('show.bs.popover', function () {
                self.render();
            });

            
            $tip.mouseleave(function () {
                $tip.popover('hide');
            })

            return self;
        }

        //渲染
        ToolBox.fn.render = function () {

            var self = this;

            if (!this.$dom) {
                this.$dom = $('<div class="vrm-tool-box"></div>');
            }

            self.$dom.empty();
            if (!self.show()) {
                return self;
            }

            $.each(self.boxs, function (k, box) {
                if (self.editor.scene && !self.editor.scene.auth(box.optId)) {
                    return true;
                }

                box.setContainer(self);
                var show = box.show.call(box);
                if (show) {
                    self.$dom.append(box.render().getDom());
                }
            })

            return self;
        }

        //获取工具盒子
        ToolBox.fn.getDom = function () {
            return this.$dom;
        }

    });

    //Button
    _ve(function (VE, $) {
        var Button = function (settings) {
            this.optId = settings.optId;
            this.container = settings.container;
            this.text = settings.text;
            this.style = settings.style || {};
            this.clickEvent = VE.isFunction(settings.clickEvent) ? settings.clickEvent : function () {};
            this.disable = VE.isFunction(settings.disable) ? settings.disable : function () {
                return false
            }
            this.show = VE.isFunction(settings.show) ? settings.show : function () {
                return true
            };
        }

        Button.fn = Button.prototype;
        //Button expose vrm editor
        VE.Button = Button;

        //初始化
        Button.fn.__init = function () {
            var self = this;
            self.$dom = $(template.render(getTpl(), self));

            self.$dom.click(function () {
                if (self.disable.call(self)) {
                    return false;
                }
                self.clickEvent.call(self);
            })
        }

        //设置容器
        Button.fn.setContainer = function (container) {
            var self = this;
            self.container = container;
            return self;
        }

        //渲染
        Button.fn.render = function () {
            var self = this;
            self.__init();
            return self;
        }

        //获取dom
        Button.fn.getDom = function () {
            var self = this;
            if (self.disable.call(self)) {
                self.$dom.addClass('wd-disabled');
            } else {
                self.$dom.removeClass('wd-disabled');
            }
            return self.$dom;
        }

        function getTpl() {
            return '<button type="button" class="btn {{style.className || "btn-default"}} btn-xs m-t-xs pr">{{if style.icon}}<i class="fa {{style.icon}} fa-fw"></i>{{/if}} {{text}}</button>';
        }
    });

    //WKContent
    _ve(function (VE, $) {
        var WkContent = function (obj) {
            this.$outline = obj.$outline;
            this.data = obj.data;
        }

        WkContent.fn = WkContent.prototype;
        //WkContent expose vrm editor
        VE.WkContent = WkContent;

        WkContent.fn.create = function (callback) {
            var self = this;
            var $wk = $(template.render(WkContent.getTpl(), self.data));
            self.$outline.append($wk);
            if (VE.isFunction(callback)) {
                callback($wk);
            }
        }


        /**
         * 根据wkid获取内容对象
         * @param {JQuery|String} o 大纲JQuery对象|大纲ID
         * @param {String} wkid 条目Id
         */
        WkContent.findBywkId = function (o, wkid) {
            var $outline = o;
            if (VE.isString(o) || VE.isNum(o)) {
                $outline = VE.Outline.findOutline(o);
            }

            var $wk;
            $outline.find('.wd-wk').each(function (i, v) {
                var $wk0 = $(v);
                if ($wk0.data('wkid') == wkid) {
                    $wk = $wk0;
                    return;
                }
            })

            return $wk;
        }

        /**
         * 根据wkid获取容器删除wkContent
         * @param {JQuery} $wk 条目对象
         */
        WkContent.getContainer = function ($wk) {
            return $wk.closest('.wd-wk-container');
        }

        /**
         * 提供与大纲关联渲染模板
         * @return {string}
         */
        WkContent.getTplRelOutline = function () {
            return ' <div class="mousepanel panel panel-default m-t-sm pr wd-wk-container {{outline.wkItem.changeStatus==1? "wd-border-modify":outline.wkItem.changeStatus==2?"wd-border-new":"wd-border-default"}} ">' +
                '<div class="wk-edit-widget panel-heading text-right panel-default">' +
                '<a><i class="fa fa-edit fa-fw" data-toggle="tooltip" data-placement="top" title="编辑"></i></a>' +
                '</div>' +
                '<div class="wk-exit-widget panel-footer panel-heading text-right wd-hide">' +
                '<div class="fr">' +
                ' <a tabindex="0" href="javascript:;" class="show js-wk-btn-save" >' +
                '     <i class="fa fa-save fa-fw" data-toggle="tooltip" data-placement="right" title="保存退出"></i>' +
                ' </a>' +
                ' <a tabindex="1" href="javascript:;" class="show js-wk-btn-cancel">' +
                '     <i class="fa fa-times fa-fw text-danger" data-toggle="tooltip" data-placement="right" title="取消"></i>' +
                ' </a>' +
                '</div>' +
                '</div>' +
                '<div data-wkid="{{outline.wkItem.docWkItmId}}" class="wd-wk"><div class="wd-wk-content panel-body">{{@ outline.wkItem.wkItmContent? outline.wkItem.wkItmContent : "<p></p>" }}</div></div>' +
                '</div>';
        }


        /**
         * 不与大纲关联模板 单独创建内容使用
         * @return {string}
         */
        WkContent.getTpl = function () {
            return ' <div class="mousepanel panel panel-default m-t-sm pr wd-wk-container {{changeStatus==1? "wd-border-modify":changeStatus==2?"wd-border-new":"wd-border-default"}} ">' +
                '<div class="wk-edit-widget panel-heading text-right panel-default">' +
                '<a><i class="fa fa-edit fa-fw" data-toggle="tooltip" data-placement="top" title="编辑"></i></a>' +
                '</div>' +
                '<div class="wk-exit-widget panel-footer panel-heading text-right wd-hide">' +
                '<div class="fr">' +
                '<a tabindex="0" href="javascript:;" class="show js-wk-btn-save" >' +
                '<i class="fa fa-save fa-fw" data-toggle="tooltip" data-placement="right" title="保存退出"></i>' +
                '</a>' +
                '<a tabindex="1" href="javascript:;" class="show js-wk-btn-cancel">' +
                '<i class="fa fa-times fa-fw text-danger" data-toggle="tooltip" data-placement="right" title="取消"></i>' +
                ' </a>' +
                '</div>' +
                '</div>' +
                '<div data-wkid="{{docWkItmId}}" class="wd-wk"><div class="wd-wk-content panel-body">{{@ wkItmContent? wkItmContent : "<p></p>" }}</div></div>' +
                '</div>';
        }
    });

    //Outline
    _ve(function (VE, $) {
        var Outline = function (obj) {
            this.editor = obj.editor;
            this.$outline = obj.$outline;
        }

        Outline.fn = Outline.prototype;
        //Outline expose vrm editor
        VE.Outline = Outline;


        /**
         * 移除大纲
         * @param {String} outlineId 大纲ID
         * @return {*|jQuery|HTMLElement} 大纲对象
         */
        Outline.removeById = function (outlineId) {
            Outline.remove(Outline.findOutline(outlineId));
        }

        /**
         * 移除大纲
         * @param {JQuery} $outline 大纲对象
         */
        Outline.remove = function ($outline) {
            if ($outline && $outline.length > 0) {
                $outline.remove();
            }
        }

        /**
         * 查找大纲对象
         * @param {String} outlineId 大纲ID
         * @return {*|jQuery|HTMLElement} 大纲对象
         */
        Outline.findOutline = function (outlineId) {
            return $('#p-' + outlineId);
        }

        /**
         * 移除管控点标识
         * @param {JQuery} $outline 大纲对象
         */
        Outline.removeBusFlagData = function ($outline) {
            if ($outline && $outline.length > 0) {
                $outline.attr('data-busflag', '').removeData('busflag')
            }
        }

        /**
         * 添加管控点data
         * @param {JQuery} $outline 大纲
         * @param {String} busflag 业务标识
         */
        Outline.addBusFlagData = function ($outline, busflag) {
            if ($outline && $outline.length > 0) {
                $outline.attr('data-busflag', busflag).data('busflag', busflag)
            }
        }

        /**
         * 增加标签同时增加业务状态
         * @param {JQuery} $outline 大纲
         * @param {String} busFlag 业务标识
         * @param {String} busFlagName 业务标签名称
         * @param {function} removeTagCallback 业务标签删除回调函数
         */
        Outline.addBusFlagTag = function ($outline, busFlag, busFlagName, removeTagCallback) {
            if ($outline && $outline.length > 0) {
                var tags = $outline.data('tags');
                if (!tags) {
                    return;
                }

                //判断标签是否已经存在
                var tag = tags.findTagById('busflag-' + $outline.data('outlineid'));
                if (tag) {
                    return;
                }

                if (busFlag) {
                    tags.addLeftTags(new VE.Tag({
                        id: 'busflag-' + $outline.data('outlineid'),
                        container: tags,
                        target: $outline,
                        type: 'button',
                        style: {className: 'btn-warning',icon: 'fa-thumb-tack'},
                        text: busFlagName,
                        onlyRead: !tags.editor.scene.auth('outline-menu-delbusflag'),
                        remove: function () {
                            if (VE.isFunction(removeTagCallback)) {
                                removeTagCallback.call(this);
                            }
                        }
                    }));

                    tags.render();
                }

                Outline.addBusFlagData($outline, busFlag);
            }
        }

        /**
         * 移除标签且移除大纲业务标识状态
         * @param {String} outlineId 大纲ID
         */
        Outline.removeBusFlagTagById = function (outlineId) {
            Outline.removeBusFlagTag(Outline.findOutline(outlineId))
        }

        /**
         * 移除标签且移除大纲业务标识状态
         * @param {JQuery} $outline 大纲对象
         */
        Outline.removeBusFlagTag = function ($outline) {
            if ($outline && $outline.length > 0) {
                var tags = $outline.data('tags');
                if (tags) {
                    tags.removeTagById('busflag-' + $outline.data('outlineid'));
                }

                Outline.removeBusFlagData($outline);
            }
        }

        /**
         * 通过ID删除大纲
         * @param {Array} outlineIds 大纲ID集合
         */
        Outline.deleteByOutlineIds = function (outlineIds) {
            if (!outlineIds) {
                return;
            }

            if (VE.isArray(outlineIds)) {
                $.each(outlineIds, function (k, outlineId) {
                    Outline.findOutline(outlineId).remove();
                })
            } else {
                Outline.findOutline(outlineIds).remove();
            }
        }

        /**
         * 插入大纲
         * {
         *    editor : '编辑器'
         *    outline :'大纲'
         *    posOutlineId:'大纲ID'
         *    pos :'位置' before | after 默认after
         * }
         * @param {json} obj 插入对象
         * @return {VE.Outline} vrm editor大纲对象
         */
        Outline.insertOutline = function (obj) {
            var outline = new Outline({
                editor: obj.editor,
                $outline: $(template.render(VE.Outline.getTpl(), obj))
            });

            var $posOutline = Outline.findOutline(obj.posOutlineId);
            //未找到目标大纲
            if ($posOutline.length == 0) {
                var $editorContent = obj.editor.$editorContent;
                $editorContent.append(outline.$outline);
            } else if (obj.pos === 'before') {
                $posOutline.before(outline.$outline);
            } else {
                $posOutline.after(outline.$outline);
            }

            //大纲绑定功能菜单
            if (outline.editor.skeleton.outlineMenu instanceof VE.OutlineMenu) {
                VE.clone(outline.editor.skeleton.outlineMenu).bindMount(outline.$outline).render();
            }

            //大纲绑定标签容器
            var containerTags = new VE.OutlineTags({
                editor: outline.editor,
                $outline: outline.$outline
            });

            containerTags.createPostion(outline.$outline.find('.vrm-pannel-head'), 'after').render();

            //绑定tip
            VE.tooltip(outline.$outline);

            return outline;
        }

        /**
         *
         * 插入大纲
         *  {
         *    editor : '编辑器'
         *    outline :'大纲'
         *    posOutlineId:'大纲ID'
         *    pos :'位置' before | after
         * }
         *
         * example :
         *   VE.Outline.insertOutlineWithContent({
         *          editor : menu.editor,
         *          outline : {
         *              docOutlineId: '107419646432371000',
         *              outlineLvl:'0',
         *              origChapNum:'4',
         *              outlineName:'测试',
         *              wkItem:{
         *                  docWkItmId: '11000001',
         *                  wkItmContent:'tttt',
         *              }
         *          },
         *          pos:'after' //before | after
         *          posOutlineId:'10741964643237888'
         *      });
         * @param {json} obj 插入对象
         * @return {VE.Outline} vrm editor大纲对象
         */
        Outline.insertOutlineWithContent = function (obj) {
            var outline = new Outline({
                editor: obj.editor,
                $outline: $(template.render(VE.Outline.getOutlineWithContentTpl(), obj))
            });

            var $posOutline = Outline.findOutline(obj.posOutlineId);
            //未找到目标大纲
            if ($posOutline.length == 0) {
                var $editorContent = obj.editor.$editorContent;
                $editorContent.append(outline.$outline);
            } else if (obj.pos === 'before') {
                $posOutline.before(outline.$outline);
            } else {
                $posOutline.after(outline.$outline);
            }

            //大纲绑定功能菜单
            if (outline.editor.skeleton.outlineMenu instanceof VE.OutlineMenu) {
                VE.clone(outline.editor.skeleton.outlineMenu).bindMount(outline.$outline).render();
            }

            //大纲绑定标签容器
            var containerTags = new VE.OutlineTags({
                editor: outline.editor,
                $outline: outline.$outline
            });

            containerTags.createPostion(outline.$outline.find('.vrm-pannel-head'), 'after').render();
            //内容绑定编辑工具
            outline.editor.$editorBody.triggerHandler('wd.outline.content.bindedit', outline.$outline);
            //绑定tip
            VE.tooltip(outline.$outline);

            return outline;
        }

        /**
         * 修改大纲内容的变更状态颜色
         * @param parentWk 大纲对象
         * @param changeStatus 
         */
        Outline.updateOutlineContentBoxColor = function(obj,changeStatus){
            //获取大纲对象
            if(changeStatus == 0){
                obj.removeClass('wd-border-modify');
                obj.removeClass('wd-border-new');
                obj.addClass('wd-border-default');
            }else if(changeStatus == 1){
                obj.removeClass('wd-border-default');
                obj.removeClass('wd-border-new');
                obj.addClass('wd-border-modify');
            }else if(changeStatus == 2){
                obj.removeClass('wd-border-default');
                obj.removeClass('wd-border-modify');
                obj.addClass('wd-border-new');
            }
        }

        /**
         * 修改大纲内容标题状态颜色
         * @param obj  大纲对象
         * @param changeStatus  变更状态
         */
        Outline.updateOutlineTitleColor = function(outlineId,changeStatus){
            var $outline = Outline.findOutline(outlineId);
            //更具修改状态显示响应的颜色标记
            if(changeStatus==1){
                $outline.find(".wd-outline-title").addClass('outline-content-modify');
            }else if(changeStatus == 2){
                $outline.find(".wd-outline-title").addClass('outline-content-add');
            }else{
                $outline.find(".wd-outline-title").removeClass('outline-content-modify');
                $outline.find(".wd-outline-title").removeClass('outline-content-add');
            }
        }

        /**
         * 更新大纲名称
         * @param {String} outlineId 大纲Id
         * @param {Object} obj 大纲对象 至少包含参数{origChapNum、outlineName}
         */
        Outline.update = function (obj) {
            if (VE.isUndefined(obj)) {
                return;
            }

            var $outline = VE.Outline.findOutline(obj.docOutlineId);
            if ($outline.length > 0) {
                $outline.find('.wd-outline-title').text((obj.origChapNum || $outline.data('outlineno')) + ' ' + obj.outlineName);
                $outline.attr('data-outlinelevel', obj.outlineLvl || $outline.data('outlinelevel'));
                $outline.attr('data-busflag', obj.busFlag || $outline.data('busflag'));
                $outline.attr('data-outlineno', obj.origChapNum || $outline.data('outlineno'));
                //更具修改状态显示响应的颜色标记
                if(obj.changeStatus==1){
                    $outline.find(".wd-outline-title").addClass('outline-content-modify');
                }else if(obj.changeStatus == 2){
                    $outline.find(".wd-outline-title").addClass('outline-content-add');
                }else{
                    $outline.find(".wd-outline-title").removeClass('outline-content-modify');
                    $outline.find(".wd-outline-title").removeClass('outline-content-add');
                }
            }
        }


        /**
         * 提供完整渲染模板
         * @return {string}
         */
        Outline.getOutlineRenderTpl = function () {
            return '{{each content as outline i}}' +
                '        <div id="p-{{outline.docOutlineId}}" data-outlineid="{{outline.docOutlineId}}" data-outlinelevel="{{outline.outlineLvl}}" data-busflag="{{outline.busFlag}}" data-outlineno="{{outline.origChapNum}}" class="wd-outline vrm-panel m-b-md">' +
                '           {{if outline.docOutlineType != 1}}' +
                '           <div class="vrm-pannel-head clearfix pr">' +
                '              <div class="wd-outline-title vrm-pannel-title {{outline.changeStatus==1? "outline-content-modify":outline.changeStatus==2?"outline-content-add":""}} f16 fl">{{outline.origChapNum}} {{outline.outlineName}}</div>' +
                '              <div class="wd-outline-menu vrm-pannel-tool fr f12"></div>' +
                '              <div class="vrm-line"></div>' +
                '           </div>' +
                '           {{/if}}' +
                '            {{if outline.wkItem.docWkItmId}}' +
                                    VE.WkContent.getTplRelOutline() +
                '            {{/if}} ' +
                '        </div>' +
                '       {{/each}}';
        }

        /**
         * 提供创建大纲模板
         */
        Outline.getTpl = function () {
            return '<div id="p-{{outline.docOutlineId}}" data-outlineid="{{outline.docOutlineId}}" data-outlinelevel="{{outline.outlineLvl}}" data-busflag="{{outline.busFlag}}" data-outlineno="{{outline.origChapNum}}" class="wd-outline vrm-panel m-b-md">' +
                '<div class="vrm-pannel-head clearfix pr">' +
                '<div class="wd-outline-title vrm-pannel-title f16 fl">{{outline.origChapNum}} {{outline.outlineName}}</div>' +
                '<div class="wd-outline-menu vrm-pannel-tool fr f12"></div>' +
                '<div class="vrm-line"></div>' +
                '</div>'
            '</div>';
        }

        /**
         * 提供创建大纲内容模板
         */
        Outline.getOutlineWithContentTpl = function () {
            return '<div id="p-{{outline.docOutlineId}}" data-outlineid="{{outline.docOutlineId}}" data-outlinelevel="{{outline.outlineLvl}}" data-busflag="{{outline.busFlag}}" data-outlineno="{{outline.origChapNum}}" class="wd-outline vrm-panel m-b-md">' +
                '<div class="vrm-pannel-head clearfix pr">' +
                '<div class="wd-outline-title vrm-pannel-title {{outline.changeStatus==1? "outline-content-modify":outline.changeStatus==2?"outline-content-add":""}} f16 fl">{{outline.origChapNum}} {{outline.outlineName}}</div>' +
                '<div class="wd-outline-menu vrm-pannel-tool fr f12"></div>' +
                '<div class="vrm-line"></div>' +
                '</div>' +
                '{{if outline.wkItem.docWkItmId}}' +
                VE.WkContent.getTplRelOutline() +
                '{{/if}} ' +
                '</div>';
        }
    });

    //view
    _ve(function (VE, $) {
        var View = function (editor) {
            this.editor = editor;
        }

        View.fn = View.prototype;
        //view expose vrm editor
        VE.View = View;

        /**
         * 
         * 视图渲染
         * @param {String} mod  视图key
         * @param {String} text 视图名称
         */
        View.fn.render = function (mod, text) {
            var self = this,
                mod = mod || self.editor.$contentBody.data('view') || 'content';

            if (mod == 'content') {
                self.__contentView();
            } else if (mod == 'outline') {
                self.__outlineView();
            } else if (mod == 'point') {
                self.__busView();
            }

            self.editor.$contentBody.data('view', mod);
        }

        View.fn.__contentView = function () {
            self.editor.$editorContainerBody.find('.wd-outline').show();
            self.editor.$editorContainerBody.find('.wd-wk-container').show();
        }

        View.fn.__outlineView = function () {
            self.editor.$editorContainerBody.find('.wd-outline').show();
            self.editor.$editorContainerBody.find('.wd-wk-container').hide();
        }

        View.fn.__busView = function () {
            self.editor.$editorContainerBody.find('.wd-wk-container').hide();
            self.editor.$editorContainerBody.find('.wd-outline').each(function (i, o) {
                var $outline = $(o);
                if (!!$outline.data('busflag')) {
                    $outline.show();
                } else {
                    $outline.hide();
                }
            });
        }
    });

    //rightbox 
    _ve(function (VE, $) {

        // Private attributes and method
        var getPadding = function ($el, side) {
            var padding = $el.css('padding-' + side);
            return padding ? +padding.substring(0, padding.length - 2) : 0;
        };

        var sidePosition = function ($el) {
            var paddingLeft = getPadding($el, 'left');
            var paddingRight = getPadding($el, 'right');
            return ($el.width() + paddingLeft + paddingRight) + "px";
        };

        //生成ID
        function getID() {
            return 'rightbox-' + new Date().valueOf();
        }

        //获取面板
        function getPanelTpl() {
            return '<div id="{{id}}" class="panel vrm-rightbox {{className}}">' +
                '<div class="panel-heading vrm-rightbox-heading"> ' +
                '<h3 class="panel-title vrm-rightbox-title">{{title}}<span class="fa fa-close pull-right vrm-rightbox-close" title="关闭"></span></h3>' +
                '</div>' +
                '<div class="panel-body vrm-rightbox-body">' +
                '<div class="vrm-rightbox-loading" style="text-align: center"><i class="fa fa-spinner fa-spin fa-5x"></i> 数据加载中...</div>' +
                '<div class="vrm-rightbox-content"></div>' +
                '</div>' +
                '</div>';
        }

        /**
         *  {
         *   id : '面板唯一标识' 可选
         *   className : 面板样式文件可选 由于自定义 可选
         *   title : '面板名称' 必选
         * }
         * @param {*} options 
         */
        var Panel = function (options) {
            this.id = options.id || getID();
            this.className = options.className;
            this.title = options.title || '标题';
            this.__init();
            return this.$dom;
        }

        Panel.fn = Panel.prototype;
        Panel.fn.__init = function () {
            var self = this;
            self.$dom = $(template.render(getPanelTpl(), self));
            VE.$body.append(self.$dom);
        }

        var RightBox = function (options) {
            // Define default setting
            var setting = {
                width: 250,
                position: "right",
                speed: 300, //ms
                trigger: undefined,
                autoEscape: false,
                times: true,
                closeel: '.vrm-rightbox-close',
                init: function () {},
                show: function () {},
                shown: function () {},
                hidden: function () {},
                hide: function () {},
                autoDestroy: true,
                top: 0,
                closeByOverlay: true,
                "zIndex": 9999,
                overlayColor: 'rgba(0,0,0,0.5)'
            };

            // Attributes
            this.setting = $.extend(setting, options);
            this.element = new Panel(this.setting);
            this.contentbody = this.element.find('.vrm-rightbox-content');
            this.init();
        }

        RightBox.fn = RightBox.prototype;
        VE.RightBox = RightBox;

        RightBox.fn.init = function () {
                var self = this;
                var setting = this.setting;
                var $el = this.element;

                var transition = "all ease " + setting.speed + "ms";
                $el.css({
                    position: "fixed",
                    width: setting.width,
                    transition: transition,
                    height: "100%",
                    top: setting.top
                }).css(setting.position, "-" + sidePosition($el));

                $el.css('z-index', setting.zIndex);
                self.overlayElement = $("<div class='rightbox-overlay'></div>")
                    .hide()
                    .css({
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        'z-index': setting.zIndex - 1,
                        'background-color': setting.overlayColor
                    }).click(function () {
                        if (setting.closeByOverlay) {
                            self.hide();
                        }
                    });

                $("body").prepend(self.overlayElement);

                // Add close stage
                $el.data("rightbox", false);

                // Attach trigger using click event
                if (setting.trigger && setting.trigger.length > 0) {
                    setting.trigger.on('click.rightbox', function () {
                        if (!$el.data("rightbox")) { // Show
                            self.show();
                        } else { // Hide
                            self.hide();
                        }
                    });
                }

                // Bind hide event to ESC
                if (setting.autoEscape) {
                    $(document).on('keydown.rightbox', function (e) {
                        if ($('input:focus, textarea:focus').length === 0) {
                            if (e.keyCode === 27 && $el.data("rightbox")) { // ESC
                                self.hide();
                            }
                        }
                    });
                }

                setting.init($el, self);
                $el.find(setting.closeel).click(function () {
                    self.hide();
                })
            },

            RightBox.fn.show = function () {
                var self = this;
                var setting = this.setting;
                var $el = this.element;
                var $overlayElement = this.overlayElement;

                setting.show($el, self, self.contentbody);

                $overlayElement.show();

                // slide the panel
                $el.css(setting.position, "0px");
                if (setting.push) {
                    if (setting.position === "left") {
                        $("body").css("left", sidePosition($el));
                    } else {
                        $("body").css("left", "-" + sidePosition($el));
                    }
                }
                $el.data("rightbox", true);

                setTimeout(function () {
                    setting.shown($el, self, self.contentbody);
                }, setting.speed);
            },

            RightBox.fn.hide = function () {
                var self = this;
                var setting = this.setting;
                var $el = this.element;
                var $overlayElement = this.overlayElement;

                // trigger hide() method
                setting.hide($el, self);

                $el.css(setting.position, "-" + sidePosition($el));
                $el.data("rightbox", false);

                setTimeout(function () {
                    $overlayElement.hide();

                    setting.hidden($el, self);

                    if (self.setting.autoDestroy) {
                        self.remove();
                    }
                }, setting.speed);
            },

            RightBox.fn.closeLoading = function () {
                var $el = this.element;
                $el.find('.vrm-rightbox-loading').remove()
            }

        RightBox.fn.remove = function () {
            if (this.setting.trigger && this.setting.trigger.length > 0) {
                this.setting.trigger.off('.rightbox');
            }
            if (this.overlayElement && this.overlayElement.length > 0) {
                this.overlayElement.remove();
            }
            if (this.element && this.element.length > 0) {
                this.element.remove();
            }
        }
    });

    /*------------------------------------render start------------------------------------*/

    //帮助类
    _ve(function (VE, $) {

        // IE8 [].indexOf()
        if (!Array.prototype.indexOf) {
            //IE低版本不支持 arr.indexOf
            Array.prototype.indexOf = function (elem) {
                var i = 0,
                    length = this.length;
                for (; i < length; i++) {
                    if (this[i] === elem) {
                        return i;
                    }
                }
                return -1;
            };
            //IE低版本不支持 arr.lastIndexOf
            Array.prototype.lastIndexOf = function (elem) {
                var length = this.length;
                for (length = length - 1; length >= 0; length--) {
                    if (this[length] === elem) {
                        return length;
                    }
                }
                return -1;
            };
        }

        // console.log && console.warn && console.error
        var console = window.console;
        var emptyFn = function () {};
        $.each(['info', 'log', 'warn', 'error'], function (key, value) {
            if (console == null) {
                VE[value] = emptyFn;
            } else {
                VE[value] = function (info) {
                    // 通过配置来控制打印输出
                    if (VE.config && VE.config.printLog) {
                        console[value]('vrmeditor提示: ' + info);
                    }
                };
            }
        });

        VE.uuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        /**
         * 判断boolean
         * @param value
         * @return {boolean}
         */
        VE.isBoolean = function (value) {
            return Object.prototype.toString.call(value) === '[object Boolean]';
        }

        /**
         * 判断字符串
         * @param value
         * @return {boolean}
         */
        VE.isString = function (value) {
            return Object.prototype.toString.call(value) === '[object String]';
        }

        /**
         * 判断数字
         * @param value
         * @return {boolean}
         */
        VE.isNum = function (value) {
            return Object.prototype.toString.call(value) === '[object Number]';
        }

        /**
         * 判断undefined
         * @param value
         * @return {boolean}
         */
        VE.isUndefined = function (value) {
            return Object.prototype.toString.call(value) === '[object Undefined]';
        }

        /**
         * 判断数组
         * @param value
         * @return {boolean}
         */
        VE.isArray = function (value) {
            return Object.prototype.toString.call(value) === '[object Array]';
        }

        /**
         * 判断函数
         * @param value
         * @return {boolean}
         */
        VE.isFunction = function (value) {
            return Object.prototype.toString.call(value) === '[object Function]';
        }

        /**
         * 克隆对象 只支持 Object 不支持Array
         * @param obj
         * @return {{}}
         */
        VE.clone = function (obj) {
            return $.extend(true, {}, obj);
        }

        /**
         * 目标对象显示提示
         * @param {JQuery} $target 目标对象
         */
        VE.tooltip = function ($target) {
            if ($target && $target.length > 0) {
                $target.find('[data-toggle="tooltip"]').tooltip({
                    'delay': {
                        "show": 300,
                        "hide": 100
                    },
                    'container': 'body'
                })
            }
        }
    });

    //内容数据加载
    _ve(function (VE, $) {
        var Content = function (editor) {
            this.editor = editor;
            this.initDom();
            this.init();
        }

        Content.fn = Content.prototype;
        VE.Content = Content;
    });

    //初始化内容
    _ve(function (VE, $) {

        var Content = VE.Content;

        Content.fn.init = function () {
            var self = this,
                editor = self.editor;
            self.pageDataLoader = new VE.PageDataLoader(editor);
        }

        Content.fn.initDom = function () {
            var self = this;
            var editor = self.editor;

            editor.$editorContainerBody = $(' <!-- 主题内容 --><div class="vrm-content-wraper p-t-xs full-height"></div>');
            editor.$scrollTitle = $('<div class="vrm-current-scan-postion"></div>')
            editor.$contentBody = $('<div class="vrm-content"></div>');
            //editor.$mask = $('<div class="vrm-content-loading"></div>');
            editor.$docTitle = $('<h3 class="wd-title text-center vrm-content-title m-t-none p-b-md b-b"></h3>');
            editor.$editorContent = $('<div class="p-t-sm"></div>');
            editor.$upPull = $('<div class="wrm-pull-up vrm-pull" data-toggle="tooltip" data-placement="right" title="向上加载内容"><i class="fa fa-angle-double-up fa-3x"></i></div>');
            editor.$downPull = $('<div class="wrm-pull-down vrm-pull" data-toggle="tooltip" data-placement="right"  title="向下加载内容"><i class="fa fa-angle-double-down fa-3x"></i></div>')

            editor.$editorContainerBody.append(editor.$scrollTitle);
            editor.$editorContainerBody.append(editor.$contentBody);
            editor.$contentBody.append(editor.$docTitle);
            //editor.$contentBody.append(editor.$mask);
            editor.$contentBody.append(editor.$editorContent);
            editor.$contentBody.append(editor.$upPull);
            editor.$contentBody.append(editor.$downPull);

            editor.$gotop = $('<div class="wrm-go-top" data-toggle="tooltip" data-placement="top" title="回到顶部"><a><i class="fa fa-long-arrow-up"></i></a></div>');
            editor.$editorContainerBody.append(editor.$gotop);
            editor.$editorMain.append(editor.$editorContainerBody);

            editor.$scroll = editor.$editorMain.find('.vrm-content-wraper');
        }
    });

    //处理word title init
    _ve(function (VE, $) {
        var DocTitle = function (editor) {
            this.editor = editor;
            this.init();
        }

        DocTitle.fn = DocTitle.prototype;

        function ajaxTitle(editor) {
            WD_URL.rest.ajax({
                url: config.docUrl(),
                type: 'GET'
            }, function (data) {
                editor.$docTitle.text(data ? data.docName : '');
                VE.$document.find('title').text(data ? data.docName : '');
            })
        }

        DocTitle.fn.init = function () {
            var self = this,
                editor = self.editor;
            ajaxTitle(editor);
        }

        DocTitle.fn.updateTitle = function () {
            var self = this,
                editor = self.editor;
            ajaxTitle(editor);
        }

        VE.DocTitle = DocTitle;
    });

    //创建内容
    _ve(function (VE, $) {
        VE.fn.initContent = function () {
            this.docstruct = new VE.DocStruct(this);
            this.content = new VE.Content(this);
            this.docTitle = new VE.DocTitle(this);
            this.view = new VE.View(this);
        }
    });

    //渲染header menu toolbar
    _ve(function (VE, $) {
        VE.fn.renderHeaderToolBar = function () {
            var editor = this;

            editor.headertoolbar.render();
        }
    });

    //渲染 menu
    _ve(function (VE, $) {
        VE.fn.renderHeaderMenus = function () {
            var editor = this;
            var menus = editor.headertoolbarmenus;
            var menu;
            $.each(menus, function (k, v) {
                menu = v;
                if (!menu) {
                    return;
                }

                if (!menu.show.call(menu)) {
                    return;
                }

                menu.render();
            });

            editor.headertoolbar.addFullScreen();
        }
    });

    //渲染editor menu toolbar
    _ve(function (VE, $) {
        VE.fn.renderToolBar = function () {
            var editor = this;

            editor.toolbar.render();
        }
    });

    //渲染editor container
    _ve(function (VE, $) {
        VE.fn.renderEditorContainer = function () {
            var editor = this;
            var $editorContainer = editor.$editorContainer;
            var $editorBody = editor.$editorBody;

            $editorBody.append($editorContainer);
        }
    });

    //bind gotop
    _ve(function (VE, $) {
        VE.fn.goTop = function () {

            var editor = this;
            editor.$gotop.goTop(300, editor.$scroll);
        }
    });

    //创建vrm editor
    _ve(function (VE, $) {
        VE.fn.create = function () {
            var editor = this;

            if (!VE.$body || VE.$body.length == 0) {
                VE.$body = $('body');
                VE.$document = $(document);
                VE.$window = $(window);
            }

            //初始化骨架
            editor.skeleton = {};

            //初始化基础
            var _inits = VE._inits;
            if (_inits && _inits.length) {
                $.each(_inits, function (k, val) {
                    val.call(editor);
                });
            }
            
            //add end render header menu toolbar
            editor.addHeaderToolBarMenus();
            editor.renderHeaderMenus();
            editor.renderHeaderToolBar();

            //add end render editor menu toolbar
            editor.renderFUIMenu();
            editor.renderToolBar();

            //render editor container
            editor.renderEditorContainer();

            //加载内容
            editor.initContent();
            //置顶
            editor.goTop();
            //integration image user
            namedavatar.config({
                nameType: 'lastName'
            })

            if (window.vrmeditor == void 0) {
                window.vrmeditor = editor;
            }

            //执行用于自定义组件
            var _plugins = VE._plugins;
            if (_plugins && _plugins.length) {
                $.each(_plugins, function (k, val) {
                    val.call(editor);
                });
            }
        }
    });

    /*------------------------------------render end------------------------------------*/

    //版本展示
    _ve(function (VE, $) {
        // 版权提示
        VE.info('编辑页面由www.vpsoft.com提供 vrmEditor版本' + VE.version);
    });

    return window.vrmEditor;

})(window, jQuery);

//scene auth
(function () {
    var VE = window.vrmEditor;

    VE.init(function () {
        var editor = this;

        WD_URL.rest.ajaxMask({
            async: false,
            maskinfo: '文档初始化中...',
            maskEl: VE.$body,
            url: config.senceUrl(),
            type: 'GET'
        }, function (json) {
            editor.scene = json;
            editor.scene.auth = function (optId) {
                if (!optId) {
                    return false;
                }
                return editor.scene.indexOf(optId) > -1;
            }
        })
    });

})(window);

//event
(function () {
    var VE = window.vrmEditor;

    VE.plugin(function () {
        var editor = this;

        $(editor.$editorBody).bind('wd.outline.content.bindedit', '.wd-outline', function (e, outline) {
            var $outline = $(outline);

            var $wk = $outline.find('.wd-wk');
            if ($wk && $wk.length == 0) {
                return;
            }

            var $edit = $outline.find('.wk-edit-widget');
            var toolBox = VE.clone(editor.skeleton.wkToolBox);

            var boxs = [];
            $.each(editor.skeleton.wkToolBox.boxs, function (k, box) {
                boxs.push(VE.clone(box));
            })

            toolBox.boxs = boxs;
            toolBox.bindMount($wk).bindTip($edit.find('a'));
        })
    });

})(window);

//vrm editor 自定义扩展清单
(function (window, $) {
    var VE = window.vrmEditor;
    if (!VE) {
        return;
    }

    //自定义大纲功能按钮追加
    VE.Content.customOutlineAppendMenuItemExt = function (menu) {}

    //自定义内容编辑按钮项追加
    VE.Content.customContentAppendMenuItemExt = function ($outline) {}

    //自定义文档结构菜单项目
    VE.DocStructMenu.customCreateMenuItem = function (fn) {
        VE.DocStructMenu.createMenuItem(fn);
    }

    //自定义创建树菜单项
    VE.TreeMenu.customCreateMenuItem = function (fn) {
        VE.TreeMenu.createMenuItem(fn);
    }

    //自定义创建顶部菜单
    VE.HeaderMenu.customCreateHeaderToolBarMenu = function (fn) {
        VE.createHeaderToolBarMenu(fn);
    }
})(window, jQuery);

//vrm editor goto
(function (window, $) {
    $.fn.goTop = function (speed, dom) {
        var _this = this;
        var $body = $('body');
        var p = $('.vrm-content');

        _this.css("position", "fixed");
        //var clientHeight = document.documentElement.clientHeight; //获取可视区域的高度
        var height_block = speed ? speed : 300; //将高度分成N段
        var thisFn = {
            onScroll: function () {
                //获取滚动条的滚动高度
                var osTop = '';
                if (dom) {
                    osTop = $(dom).scrollTop();
                } else {
                    osTop = document.documentElement.scrollTop || document.body.scrollTop;
                }
                var is_show = _this.css("display");
                if (osTop > 0) {
                    if (is_show == 'none') {
                        _this.fadeIn();
                        $body.addClass('scroll')
                    }

                    var $outline = getOutlines();

                    var len = $outline.length - 1;
                    for (; len > 0; len--) {
                        var that = $outline.eq(len);
                        var offset = that.offset();
                        if (offset && osTop >= Math.abs(offset.top - p.offset().top)) {
                            $('.vrm-current-scan-postion').text(that.find('.wd-outline-title').text());
                            break;
                        }
                    }

                }
                if (osTop == 0) {
                    _this.fadeOut();
                    $body.removeClass('scroll');
                }
            },
            goTopFn: function () {
                //获取滚动条的滚动高度
                var osTop = '';
                //用于设置速度差，产生缓动的效果
                var speed = 0;

                if (dom) {
                    osTop = $(dom).scrollTop();
                    speed = Math.floor(-osTop * 10 / height_block);
                    $(dom).scrollTop(osTop + speed);
                } else {
                    osTop = document.documentElement.scrollTop || document.body.scrollTop;
                    speed = Math.floor(-osTop * 10 / height_block);
                    document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
                }

                var is_show = _this.css("display");
                if (osTop > 0) {
                    if (is_show == 'none') {
                        _this.fadeIn();
                        $body.addClass('scroll')
                    }
                    setTimeout(function () {
                        thisFn.goTopFn();
                    }, 1);
                }
            }
        };

        if (dom) {
            $(dom).on('scroll', function () {
                thisFn.onScroll();
            });
        } else {
            window.onscroll = function () {
                thisFn.onScroll();
            }
        }

        //回到顶部按钮点击事件
        $body.find(".wrm-go-top").off();

        $body.on("click", ".wrm-go-top", function () {
            thisFn.goTopFn();
        });

        function getOutlines() {
            return $body.find('div.wd-outline');
        }
    }
})(window, jQuery);

/*
 * vrm content loading
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	//给窗口添加滚动事件，在滚动时遮罩跟着元素移动
	$(window).bind("scroll",function() {
		var masks = $(".vrm-mask");
		for (var i = 0; i < masks.length; i++) {
			var ele_id = $(masks[i]).attr("ele");
			var eleTop= $(ele_id).offset().top;
			var gun = $(document).scrollTop();
            var top = eleTop-gun;
			$(masks[i]).css({
				"top": top+'px'
			});
		}
	});
	
	//timeout cache
	var cache = {};
	
	/*
	 * certain element loading mask
	 */
	$.mask_element = function(ele_id, timeout){
		//判断当前元素是否已经添加遮罩，如果已添加，则直接返回
		if($(".vrm-mask[ele='"+ele_id+"']").length > 0){
			return;
		}
		//添加遮罩元素
		var mask = '<div class="vrm-mask" ele='+ele_id+' style="width: '+$(ele_id).width()+'px !important; height: '+$(ele_id).height()+'px !important; left: '+$(ele_id).offset().left+'px !important; top: '+$(ele_id).offset().top+'px !important;"><div>内容加载中...</div></div>';
		$("body").append(mask);
		clearTimeout(cache[ele_id]);
		if(timeout && timeout > 0){
			var s = setTimeout(function(){
				$(".vrm-mask[ele='"+ele_id+"']").remove();
			}, timeout);
			cache[ele_id] = s;
		}
	}
	
	/*
	 * close certain loading mask
	 */
	$.mask_close = function(ele_id){
		$(".vrm-mask[ele='"+ele_id+"']").remove();
	}
	
	/*
	 * close all loading mask
	 */
	$.mask_close_all = function(){
		$(".vrm-mask").remove();
	}
}));

//chtech-ole file download
(function (window, $) {
    var VE = window.vrmEditor;

    VE.plugin(function () {
        var $body = VE.$body;

        function isMouseLeaveOrEnter(e, handler) {
            var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
            while (reltg && reltg != handler) {
                reltg = reltg.parentNode;
            }

            $('.box-img-download').on('click', function () {
                var $that = $(this),
                    $img = $that.prev('img.chtech-ole'),
                    uuid = $img.attr('data-tag-uuid');

                downloadWordOleFile(uuid);
            });
            return (reltg != handler);
        }

        $body.on('mouseover', 'img.chtech-ole', function () {
            var $img = $(this),
                $boxImg = $img.parent('.box-img');

            if ($boxImg.length > 0) {
                return;
            }
            $boxImg = $('<div class="box-img" style="position: relative; display: inline;"></div>');
            $img.wrap($boxImg);
            $img.after('<a class="box-img-download" style="position: absolute;right: 0px; cursor: pointer; font-size:14px;" title="下载">' +
                '<i class="fa fa-download fa-2x" aria-hidden="true"></i></a>');
        })

        $body.on('mouseout', '.box-img', function (ev) {
            if (!isMouseLeaveOrEnter(ev, this)) {
                return false;
            }

            var $boxImg = $(this);
            if ($boxImg.length > 0) {
                var $img = $boxImg.find('img.chtech-ole');
                $img.next('.box-img-download').remove();
                $img.unwrap();
            }
        })
    })

    function downloadWordOleFile(uuid) {
        WD_URL.rest.ajax({
            url: config.checkFileExistUrl(),
            type: "GET",
            data: {
                atchUuid: uuid
            }
        }, function (data) {
            if (data === 'exist') {
                WD_URL.rest.download(config.downloadAtchUrl() + "?atchUuid=" + uuid);
            } else if (data === 'error') {
                show_message('下载附件异常', 'error');
            }
        })
    }
})(window, jQuery);

// tooltip
$(function () {
    
    $('[data-toggle="tooltip"]').tooltip({
        'delay': {
            "show": 300,
            "hide": 100
        },
        'container': 'body'
    });

    // popover
    $('[data-toggle="popover"]').popover({
        'delay': {
            "show": 300,
            "hide": 100
        }
    });

    // 左侧大纲收缩
    $('.vrm-slide-close').on('click', function (event) {
        $(this).closest('.vrm-slide').toggleClass('vrm-slide-mini');
    });

    $(".vrm-content-wraper").on('scroll', function (e) {
        var scrollTop = $(".vrm-content-wraper")[0].scrollTop;
        $(".mousepanel").each(function (index, element) {
            var offset = element.offsetTop;
            var Height = element.offsetHeight;
            if (scrollTop > offset && scrollTop < offset + Height) {
                var top = scrollTop - offset;
                $(element).children(".panel-heading").css("top", top + "px")
            } else {
                $(element).children(".panel-heading").removeAttr('style')
            }
        });
    });
})
