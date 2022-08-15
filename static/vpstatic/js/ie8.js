/*
 * author jiangsw
 * date 2018-06-05
 */
$(function() {
    // 兼容IE9下的placeholder
    function placeholderSupport() {
        return 'placeholder' in document.createElement('input');
    }
    if (!placeholderSupport()) { // 判断浏览器是否支持 placeholder
        $("[placeholder]").each(function() {
            var _this = $(this);
            var left = _this.css("padding-left");
            _this.wrap("<span class='v-pr'></span>"); // 访止日期选择框里有多个的情况下会重叠
            _this.closest('.ant-input-group').addClass('v-input-group');
            _this.parent().append('<span class="placeholder" data-type="placeholder" style="left: ' + left + '">' + _this.attr("placeholder") + '</span>');
            if (_this.val() != "") {
                _this.parent().find("span.placeholder").hide();
            } else {
                _this.parent().find("span.placeholder").show();
            }
        }).on("focus", function() {
            $(this).parent().find("span.placeholder").hide();
        }).on("blur", function() {
            var _this = $(this);
            if (_this.val() != "") {
                _this.parent().find("span.placeholder").hide();
            } else {
                _this.parent().find("span.placeholder").show();
            }
        });
        // 点击表示placeholder的标签相当于触发input
        $("span.placeholder").on("click", function() {
            $(this).hide();
            $(this).siblings("[placeholder]").trigger("click");
            $(this).siblings("[placeholder]").trigger("focus");
        });
    }
})
// 在IE8上禁掉console
window._console = window.console;//将原始console对象缓存
window.console = (function (orgConsole) {
    return {//构造的新console对象
        log: getConsoleFn("log"),
        debug: getConsoleFn("debug"),
        info: getConsoleFn("info"),
        warn: getConsoleFn("warn"),
        exception: getConsoleFn("exception"),
        assert: getConsoleFn("assert"),
        dir: getConsoleFn("dir"),
        dirxml: getConsoleFn("dirxml"),
        trace: getConsoleFn("trace"),
        group: getConsoleFn("group"),
        groupCollapsed: getConsoleFn("groupCollapsed"),
        groupEnd: getConsoleFn("groupEnd"),
        profile: getConsoleFn("profile"),
        profileEnd: getConsoleFn("profileEnd"),
        count: getConsoleFn("count"),
        clear: getConsoleFn("clear"),
        time: getConsoleFn("time"),
        timeEnd: getConsoleFn("timeEnd"),
        timeStamp: getConsoleFn("timeStamp"),
        table: getConsoleFn("table"),
        error: getConsoleFn("error"),
        memory: getConsoleFn("memory"),
        markTimeline: getConsoleFn("markTimeline"),
        timeline: getConsoleFn("timeline"),
        timelineEnd: getConsoleFn("timelineEnd")
    };
    function getConsoleFn(name) {
        return function actionConsole() {
            if (typeof (orgConsole) !== "object") return;
            if (typeof (orgConsole[name]) !== "function") return;//判断原始console对象中是否含有此方法，若没有则直接返回
            return orgConsole[name].apply(orgConsole, Array.prototype.slice.call(arguments));//调用原始函数
        };
    }
}(window._console));

// 处理 ie 下表格固定列无法滚动
function tableFiexedScroll(inner) {
    if ($(".ant-table-body-inner").length) {
        $($(".ant-table-body")).on("scroll", function (params) {
            $(".ant-table-body-inner").scrollTop(this.scrollTop);
            $(".ant-table-header").scrollLeft(this.scrollLeft);
        });
        $(".ant-table-body-inner").on("scroll", function (params) {
            $(".ant-table-body").scrollTop(this.scrollTop);
        });
    }
}
