
$(function () {
    //计算元素集合的总宽度
    function calSumWidth(elements) {
        var width = 0;
        $(elements).each(function () {
            width += $(this).outerWidth(true);
        });
        return width;
    }
    //滚动到指定选项卡
    function scrollToTab(element) {
        var marginLeftVal = calSumWidth($(element).prevAll()), marginRightVal = calSumWidth($(element).nextAll());
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
        //可视区域tab宽度
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(".page-tabs-content").outerWidth() < visibleWidth) {
            scrollVal = 0;
        } else if (marginLeftVal + $(element).outerWidth(true) > visibleWidth) {
            scrollVal = marginLeftVal + $(element).outerWidth(true) - visibleWidth;
        }
        $('.page-tabs-content').animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "1000");
    }
    //查看左侧隐藏的选项卡
    function scrollTabLeft() {
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
        //可视区域tab宽度
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        if ($(".page-tabs-content").width() < visibleWidth) {
            return false;
        } else {
            $('.page-tabs-content').animate({
                marginLeft: 0 
            }, "1000")
        }
        ;
    }
    //查看右侧隐藏的选项卡
    function scrollTabRight() {
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
        //可视区域tab宽度
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(".page-tabs-content").width() < visibleWidth) {
            scrollVal = 0;
        } else {
            scrollVal = $(".page-tabs-content").width() - visibleWidth;
            if (scrollVal > 0) {
                $('.page-tabs-content').animate({
                    marginLeft: 0 - scrollVal + 'px'
                }, "1000");
            }
        }
    }

    //通过遍历给菜单项加上data-index属性
    $(".J_menuItem").each(function (index) {
        if (!$(this).attr('data-index')) {
            $(this).attr('data-index', index);
        }
    });

    function menuItem() {
        // 获取标识数据
        var dataUrl = $(this).attr('href'),
            dataIndex = $(this).data('index'),
            menuName = $.trim($(this).text()),
            flag = true;
        if (dataUrl == undefined || dataUrl == '' || $.trim(dataUrl).length == 0)return false;

        // 选项卡菜单已存在
        $('.J_menuTab').each(function () {
            if ($(this).data('id') == dataUrl) {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                    scrollToTab(this);
                    // 显示tab对应的内容区
                    $('.J_mainContent .J_iframe').each(function () {
                        if ($(this).data('id') == dataUrl) {
                            $(this).show().siblings('.J_iframe').hide();
                            return false;
                        }
                    });
                }
                flag = false;
                return false;
            }
        });

        // 选项卡菜单不存在
        if (flag) {
            var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
            $('.J_menuTab').removeClass('active');

            // 添加选项卡对应的iframe
            var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
            $('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);

            //显示loading提示
//            var loading = layer.load();
//
//            $('.J_mainContent iframe:visible').load(function () {
//                //iframe加载完成后隐藏loading提示
//                layer.close(loading);
//            });
            // 添加选项卡
            $('.J_menuTabs .page-tabs-content').append(str);
            scrollToTab($('.J_menuTab.active'));
        }
        return false;
    }

    $('.J_menuItem').on('click', menuItem);

    // 关闭选项卡菜单
    function closeTab() {
        var closeTabId = $(this).parents('.J_menuTab').data('id');
        var currentWidth = $(this).parents('.J_menuTab').width();

        // 当前元素处于活动状态
        if ($(this).parents('.J_menuTab').hasClass('active')) {

            // 当前元素后面有同辈元素，使后面的一个元素处于活动状态
            if ($(this).parents('.J_menuTab').next('.J_menuTab').size()) {

                var activeId = $(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').data('id');
                $(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').addClass('active');

                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == activeId) {
                        $(this).show().siblings('.J_iframe').hide();
                        return false;
                    }
                });

                var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                if (marginLeftVal < 0) {
                    $('.page-tabs-content').animate({
                        marginLeft: (marginLeftVal + currentWidth) + 'px'
                    }, "fast");
                }

                //  移除当前选项卡
                $(this).parents('.J_menuTab').remove();

                // 移除tab对应的内容区
                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
            }

            // 当前元素后面没有同辈元素，使当前元素的上一个元素处于活动状态
            if ($(this).parents('.J_menuTab').prev('.J_menuTab').size()) {
                var activeId = $(this).parents('.J_menuTab').prev('.J_menuTab:last').data('id');
                $(this).parents('.J_menuTab').prev('.J_menuTab:last').addClass('active');
                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == activeId) {
                        $(this).show().siblings('.J_iframe').hide();
                        return false;
                    }
                });

                //  移除当前选项卡
                $(this).parents('.J_menuTab').remove();

                // 移除tab对应的内容区
                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
            }
        }
        // 当前元素不处于活动状态
        else {
            //  移除当前选项卡
            $(this).parents('.J_menuTab').remove();

            // 移除相应tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == closeTabId) {
                    $(this).remove();
                    return false;
                }
            });
            
        }
        // 移除选项卡重新定位位置
        $('.J_tabShowActive').trigger('click')
        return false;
    }

    $('.J_menuTabs').on('click', '.J_menuTab i', closeTab);

    //关闭其他选项卡
    function closeOtherTabs(){
        $('.page-tabs-content').children("[data-id]").not(":first").not(".active").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        $('.page-tabs-content').css("margin-left", "0");
    }
    $('.J_tabCloseOther').on('click', closeOtherTabs);

    //滚动到已激活的选项卡
    function showActiveTab(){
        scrollToTab($('.J_menuTab.active'));
    }
    $('.J_tabShowActive').on('click', showActiveTab);


    // 点击选项卡菜单
    function activeTab() {
        
        if (!$(this).hasClass('active')) {
            var currentId = $(this).data('id');
            // 显示tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == currentId) {
                    $(this).show().siblings('.J_iframe').hide();
                    return false;
                }
            });
            $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
            scrollToTab(this);
        }else{ //用于是当前tab标签，但不是当前tab标签默认页时恢复

            $('.J_mainContent .J_iframe').each(function () {
                var currentId = $(this).data('id');
                if ($(this).attr('src') != currentId) {
                    $(this).attr('src',currentId)
                    return false;
                }
            });
        }
    }
    // 调用外部传入的数据
    var strArr = [
        {
            className : 'J_tabNewOpen',
            title : '新窗口打开'
        },
        {
            className : 'J_tabCloseOther',
            title : '关闭其他菜单'
        },
        {
            className : 'J_tabCloseAll',
            title : '关闭全部菜单'
        }
    ]
    // 添加导航上右键菜单
    $('.J_menuTabs').on('contextmenu', '.J_menuTab',function(e){
        // 禁掉默认右键菜单
        e.preventDefault();
        // 取到鼠标右键点击的位置（相对父级的定位）
        var oX = $($(this)[0]).offset().left - $('#page-wrapper').offset().left + e.offsetX + 5;
        var oY = e.offsetY + 5;
        // 先写好最外层div,然后再在里面嵌套菜单内容
        var str = '<div class="tabs-contextmenu p-xs animated fadeInRight" style="top:'+oY+'px;left:'+oX+'px;"><ul>';
        // 考虑到'首页'的存在，所以有必要对首页单独设置
        if($(e.target).index()>0){
            $.each(strArr, function (index, conf) {
                str += '<li class="'+ conf.className +'"><a>'+ conf.title +'</a></li>'
            })
        }else{
            str +='<li class="J_tabNewOpen"><a>新窗口打开</a></li>'+
                '<li class="J_tabCloseAll"><a>关闭全部菜单</a></li>'
        }
        str += '</ul></div>'
        // 删除所有菜单上的右键菜单
        $($(this)[0]).siblings('div').remove();
        // 在当前菜单上创建右键菜单
        $($(this)[0]).after(str);
        // 右键菜单中的菜单禁用右键
        $('.tabs-contextmenu').on('contextmenu', function(event) {
            event.preventDefault();
        });
    });




    // 如果点击的不是导航上关闭弹出
     $(document).on('mouseup', function(event) {
        event.preventDefault();
        // 当前点击的最近父级是否有div来判断是否有打开的右键菜单
        if(!$($(event.target)[0]).closest('.page-tabs-content').children('div').length > 0){
            $('.page-tabs-content').children('div').remove();
        }
    });

    $('.J_menuTabs').on('click', '.J_menuTab', activeTab);

    //刷新iframe
    function refreshTab() {
        var target = $('.J_iframe[data-id="' + $(this).data('id') + '"]');
        var url = target.attr('src');
       //显示loading提示
       var loading = layer.load();
       target.attr('src', url).load(function () {
           //关闭loading提示
           layer.close(loading);
       });
    }
    // 双击刷新
    $('.J_menuTabs').on('dblclick', '.J_menuTab', refreshTab);

    // 右键菜单点击事件
    $('.J_menuTabs').on('mouseup', 'li', function(event) {
        if(event.which == 3){
            event.preventDefault();
        }else{
            switch(event.currentTarget.className){
                case 'J_tabNewOpen':
                    window.open($(this).closest('div').prev('.J_menuTab').data('id'));
                break;
                case 'J_tabCloseOther':
                    closeOtherTabs()
                break;
                case 'J_tabCloseAll':
                    $('.page-tabs-content').children("[data-id]").not(":first").each(function () {
                        $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
                        $(this).remove();
                    });
                    $('.page-tabs-content').children("[data-id]:first").each(function () {
                        $('.J_iframe[data-id="' + $(this).data('id') + '"]').show();
                        $(this).addClass("active");
                    });
                    $('.page-tabs-content').css("margin-left", "0");
                break;
                case 'dd':
                alert('abc')
                break;
                default:

            }
            
            // 在新窗口打开时关闭当前
            $(this).closest('div').remove(); 
        }
        
    });


    // 左移按扭
    $('.J_tabLeft').on('click', scrollTabLeft);

    // 右移按扭
    $('.J_tabRight').on('click', scrollTabRight);

    // 关闭全部
    $('.J_tabCloseAll').on('click', function () {
        $('.page-tabs-content').children("[data-id]").not(":first").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        $('.page-tabs-content').children("[data-id]:first").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').show();
            $(this).addClass("active");
        });
        $('.page-tabs-content').css("margin-left", "0");
    });

});
