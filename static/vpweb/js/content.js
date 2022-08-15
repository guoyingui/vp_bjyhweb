function $childNode(name) {
    return window.frames[name]
}

// tooltips
$('body').tooltip({
    selector: "[data-toggle=tooltip]",
    container: "body"
});

// 使用animation.css修改Bootstrap Modal
$('.modal').appendTo("body");

$("[data-toggle=popover]").popover();

//折叠ibox
$('.collapse-link').click(function() {
    var ibox = $(this).closest('div.ibox');
    var button = $(this).find('i');
    var content = ibox.find('div.ibox-content');
    content.slideToggle(200);
    button.toggleClass('fa-caret-up').toggleClass('fa-caret-down');
    ibox.toggleClass('').toggleClass('border-bottom');
    setTimeout(function() {
        ibox.resize();
        ibox.find('[id^=map-]').resize();
    }, 50);
});

//关闭ibox
$('.close-link').click(function() {
    var content = $(this).closest('div.ibox');
    content.remove();
});

// 新增卡片
$('.card-add').click(function() {
    var content = $(this).closest('div.ibox-title').siblings('div.ibox-content').children('div.input-group');
    content.removeClass('hide').addClass('animated fadeInUp');
});

//判断当前页面是否在iframe中
// if (top == this) {
//     var gohome = '<div class="gohome"><a class="animated bounceInUp" href="index.html?v=4.0" title="返回首页"><i class="fa fa-home"></i></a></div>';
//     $('body').append(gohome);
// }

//animation.css
function animationHover(element, animation) {
    element = $(element);
    element.hover(
        function() {
            element.addClass('animated ' + animation);
        },
        function() {
            //动画完成之前移除class
            window.setTimeout(function() {
                element.removeClass('animated ' + animation);
            }, 2000);
        });
}

//拖动面板
function WinMove(className) {
    var element = ".tab-content [class*=col]";
    var handle = className;
    var connect = ".tab-content [class*=col]";
    $(element).sortable({
            handle: handle,
            connectWith: connect,
            tolerance: 'pointer',
            forcePlaceholderSize: true,
            opacity: 0.8,
        })
        .disableSelection();
};
// 头部搜索
$('#searchBtn').click(function(event) {
    $(this).closest('.navbar-form-custom').toggleClass('vp-open');
});

//工作室选择
$('.navbar .workbox-ul li').each(function(index, el) {
    $(this).on('click', function() {
        $('.workname span').text($(this).find('.name').text());
        $('.workbox-list li').removeClass('active');
        $(this).addClass('active');
        $('#content-main').children('iframe[name=iframe0]')[0].src = 'board.html'

    })
});
//首页头部 编辑工作室
$('.workselect').on('click', function(event) {
    event.preventDefault();
    $('#defaultIframe').contents().find(".set-studio").trigger('click');
    return false
});
// 首页头部下拉 创建工作室
$('#creatWork').on('click', function(event) {
    $('#defaultIframe').contents().find("#chutiyan").trigger('click');
    return false
});
// 鼠标移到我的工作室出现编辑图标
$('.workbox-link').hover(function() {
    $(this).children('.workselect').removeClass('vp-hide');
}, function() {
    $(this).children('.workselect').addClass('vp-hide');
});
// 看板界面的收缩左侧
$('.toggle-icon').on('click', function(event) {
    $('.vp-project-board-box').toggleClass('mini-left');
    $(this).children('.fa').toggleClass('fa-angle-left').toggleClass('fa-angle-right');
});
// 右侧滑动层
/*
 * 参数：滑出元素  滑出方向
 */
function newadd(el, direction) {

    switch (direction) {
        case 'left':
            $(el).removeClass('hide slideOutLeft').addClass('animated slideInLeft');
            break;
        case 'right':
            $(el).removeClass('hide slideOutRight').addClass('drawer-right animated slideInRight');
            break;
        case 'top':
            $(el).removeClass('hide fadeOutDown').addClass('drawer-right animated fadeInDown');
            break;
        case 'bottom':
            $(el).removeClass('hide fadeOutUp').addClass('drawer-right animated fadeInUp');
            break;
        default:
            $(el).removeClass('hide').addClass('drawer-right animated slideInRight');
    }
}

function closeDrawer(el) {
    parent.window.app.setBreadCrumb()
    if ($(el).hasClass('slideInLeft')) {
        $(el).removeClass('slideInLeft').addClass('slideOutLeft');
    } else if ($(el).hasClass('slideInRight')) {
        $(el).removeClass('slideInRight').addClass('slideOutRight');
    } else if ($(el).hasClass('fadeInDown')) {
        $(el).removeClass('fadeInDown').addClass('fadeOutDown');
    } else if ($(el).hasClass('fadeInUp')) {
        $(el).removeClass('fadeInUp').addClass('fadeOutUp');
    }
}

/*
* 默认滚动条在移入的时候显示
* 添加此方法的时候请先给{el}加上overflow-hid
*/
function showScroll(el){
    $(el).addClass('overflow-hid');
    $(el).hover(function() {
        $(this).addClass('overflow-over');
        $(this).removeClass('overflow-hid')
    }, function() {
        $(this).removeClass('overflow-over');
        $(this).addClass('overflow-hid')
    });
}

/*
* 下拉菜单dropdown-menu默认是当点击下拉菜单的任一位置就会关闭
* 给需要点击的元素添加属性data-stopPropagation="true"即可阻止冒泡(关闭)
*/ 
$('.dropdown-menu').on('click', '[data-stopPropagation]', function(evt) {
    evt.stopPropagation();
});