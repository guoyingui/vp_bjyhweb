(function () {
    var root = self;
    /**
     * @param {string} message 消息内容
     * @param {string} msgLevel 消息级别 success、error、info、warning
     */
    function show_message(message, msgLevel, opt) {
        var promise = $.Deferred();
        var config = {
            "closeButton": true,//显示关闭按钮
            "positionClass": "toast-top-center",//显示位置
            "showDuration": "300",//显示的动画时间
            "hideDuration": "500",//消失的动画时间
            "timeOut": "4000", //展现时间
            "extendedTimeOut": "1000",//加长展示时间
            "showEasing": "swing",//显示时的动画缓冲方式
            "hideEasing": "linear",//消失时的动画缓冲方式
            "showMethod": "fadeIn",//显示时的动画方式
            "hideMethod": "fadeOut" //消失时的动画方式
        }

        //合并对象
        $.extend(config, opt || {});

        toastr[msgLevel](message, '', config);
        promise.resolve();
        return promise;
    }

    function imagePreview (el, options, callback) {
        $(el).each(function () {
            $(this).attr('data-src',$(this).attr('src'));
            $(this).attr('data-caption',$(this).attr('title'));
        });

        var options  = $.extend({
            draggable:false,
            headToolbar: ['close'],
            footToolbar: [
                'zoomIn',
                'zoomOut',
                'prev',
                'fullscreen',
                'next',
                'actualSize',
                'rotateRight'
            ],
            callbacks : {
                beforeOpen : function (obj,data) {},
                opened : function (obj,data) {},
                beforeClose : function (obj,data) {},
                closed : function (obj,data) {},
                beforeChange : function (obj,data) {},
                changed : function (obj,data) {}
            }
        }, options);

        $(el).magnify(options);
    }

    /**
     * 封装ajax
     * req {url:'url'、type:'get|post|put|delete'、data:{}、async:'true|false'、traditional:'true|false'}
     * @param {json} req 请求对象  默认post异步请求
     * @param {function} successFn 成功请求后调用
     * @param {function} errorFn 失败后调用
     */
    function ajax(req, successFn, errorFn) {
        if (!req) {
            throw "未设置请求对象!"
        }
        if (!req.url) {
            throw "请求地址url不合法!"
        }

        if (!(typeof successFn == 'function')) {
            throw "successFn 必须是函数!"
        }

        return $.ajax({
            headers: {
                'Authorization': 'Bearer ' + vp.cookie.getToken(),
                'Content-Type': req.contentType || 'application/x-www-form-urlencoded',
                'Locale': window.LOCALE == 'zh' ? 'zh_CN' : 'en_US',
            },
            url:  req.url,
            type: req.type || 'post',
            data: req.data || {},
            dataType: 'json',
            timeout: 600000,	//10分钟超时
            async: req.async,
            cache: false,
            traditional: req.traditional || true,
            beforeSend: req.beforeSend || function (){},
            error: function (xhr, textStatus, errorThrown) {
                var regex = /^VP(\d{1})/
                if (textStatus == "error" && xhr.status == 500) {
                    var json = xhr.responseJSON;
                    if (regex.test(json.infocode)) {
                        var code = regex.exec(json.infocode)[1];
                        if (code == 1) {
                            show_message(xhr.responseJSON.msg, 'info');
                        } else if (code == 2) {
                            show_message(xhr.responseJSON.msg, 'warning');
                        } else if (code == 3) {
                            show_message(xhr.responseJSON.msg, 'error');
                        }
                    } else {
                        show_message('后台服务器错误!', 'error');
                    }
                }
                else if (textStatus == "error" && xhr.status == 404) {
                    show_message(xhr.responseJSON.msg || '请求地址异常!', 'error');
                }
                else if (textStatus == "error" && xhr.status == 400) {
                    show_message(xhr.responseJSON.msg || '地址参数异常!', 'error');
                }
                else if (textStatus == "error" && xhr.status == 401) {
                    location =  '/index.html';
                }
                else if (textStatus == "timeout") {
                    show_message('请求超时！请稍后再试!', 'error');
                }
                else if (textStatus == "error") {
                    show_message('网络异常,请刷新网页后重试!', 'error');
                }
                else {
                    show_message('网络异常,请刷新网页后重试!', 'error');
                }

                if (typeof errorFn === 'function') {
                    errorFn();
                }
            },
            success: function (json) {
                //检查是否数据丢失
                if (json && json.infocode && json.infocode == 'VP000000') {
                    successFn(json.data);
                } else if (json && json.infocode && json.infocode.indexOf('VP2') > 0) {
                    show_message(json.msg, 'warning');
                }  else if (json && json.infocode && json.infocode.indexOf('VP1') > 0) {
                    show_message(json.msg, 'info');
                } else {
                    show_message(json.msg, 'error');
                }
            }
        });
    }

    root.initData = function ($old, $new, entityid, iids, callback) {
        ajax({
            url: vp.gateway.handleGateWay('{vpvrm}/vrm/docArt/getContents?entityid='+entityid+'&iids='+iids),
            type:'GET'
        }, function (data) {
            $old.find('.header').text('旧版本:' + data[0].sbus_version)
            $old.find('.content').html(data[0].html)
            $new.find('.header').text('新版本：'+ data[1].sbus_version)
            $new.find('.content').html(data[1].html)
            callback.call(this);
        })
    }

    root.imagePreview = imagePreview;
})();

