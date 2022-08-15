//判断浏览器
var browser = function () {
    var isIE = !!window.ActiveXObject || "ActiveXObject" in window;
    var isIE10 = isIE && !!window.atob;
    var isIE9 = isIE && document.addEventListener && !window.atob;
    var isIE8 = isIE && document.querySelector && !document.addEventListener;
    var isIE7 = isIE && window.XMLHttpRequest && !document.querySelector;
    var isIE6 = isIE && !window.XMLHttpRequest;

    return {
        isIE: isIE
        , isIE6: isIE6
        , isIE7: isIE7
        , isIE8: isIE8
        , isIE9: isIE9
        , isIE10: isIE10
        , isEdge: navigator.userAgent.indexOf("Edge") > -1
    };
}();

(function (window, $) {
    if (!$.download) {
        $(function () {
            jQuery('<iframe src="" style="display:none" id="ajaxiframedownload"></iframe>')
                .appendTo('body');
        });

        $.download = function (url) {
            //url and data options required
            if (url) {
                //send request
                var el = $('#ajaxiframedownload');
                el.attr('src', url);
            };
        };
    }
})(window, jQuery);

/**
 * 封装ajax
 * req {url:'url'、type:'get|post|put|delete'、data:{}、async:'true|false'、traditional:'true|false'}
 * @param {json} req 请求对象  默认post异步请求
 * @param {function} successFn 成功请求后调用
 * @param {function} errorFn 失败后调用
 * @param {jquery} $mask 遮罩对象
 */
function ajax(req, successFn, errorFn, $mask) {
    if (!req) {
        throw "未设置请求对象!"
    }
    if (!req.url) {
        throw "请求地址url不合法!"
    }

    if (!successFn && vpCommons.isFunction(successFn)) {
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
            $mask && mask_load($mask, 'close');

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
            $mask && mask_load($mask, 'close');
            //检查是否数据丢失
            if (json && json.infocode && json.infocode == 'VP000000') {
                successFn && successFn(json.data);
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

var WD_URL = {};
/**
 * 全局通用ajax请求
 * @type {{ajax: URL.rest.ajax, ajaxMask: URL.rest.ajaxMask}}
 */
WD_URL.rest = {
    /**
     * ajax 请求
     * @param {json} req 请求
     * @param {function} successFn 成功函数
     * @param {function} errorFn 失败函数
     */
    ajax: function (req, successFn, errorFn) {
        return ajax(req, successFn, errorFn);
    },

    /**
     * ajax 遮罩请求
     * req {maskEl:'遮罩元素'、maskinfo:'遮罩信息'}
     * @param {json} req 请求
     * @param {function} successFn 成功函数
     * @param {function} errorFn 失败函数
     */
    ajaxMask: function (req, successFn, errorFn) {
        mask_load(req.maskEl || 'body', 'open', req.maskinfo || '执行中...', function ($mask) {
            ajax(req, successFn, errorFn, $mask)
        })
    },
    /**
	 * 下载
     * @param url {string} 请求地址
     */
    download: function (url) {
        if (url) {
            if (url.indexOf('?') > -1) {
                url = url + '&access_token=' + vp.cookie.getToken();
            } else {
                url = url + '?access_token=' + vp.cookie.getToken();
            }
            $('#ajaxiframedownload').attr('src', url);
        };
    },
}

/**
 * 消息弹出框
 * @param {string} type 消息类型 alert|Confirm
 * @param {json}  options 消息参数
 * <p>
 *     {theme:'',title:'',content:'',confirm:function, confirmButton:'',cancelButton:'',cancel:function}
 */
function message_dialog(type, options) {
    if (type === 'alert') {
        $.alert({
            theme: options.theme || 'bootstrap',
            title: (options.title === undefined) ? '提示' : options.title,
            content: options.content,
            buttons: {
                confirm: {
                    text: options.confirmButton || '确定',
                    btnClass: 'btn-info',
                    action: function () {
                        if (typeof options.confirm === "function") {
                            options.confirm()
                        }
                    }
                }
            }
        });
    } else if (type === 'Confirm') {
        $.confirm({
            theme: options.theme || 'bootstrap',
            title: (options.title === undefined) ? '提示' : options.title,
            content: options.content,
            buttons: {
                confirm: {
                    text: options.confirmButton || '确定',
                    btnClass: 'btn-info',
                    action: function () {
                        if (typeof options.confirm === "function") {
                            options.confirm()
                        }
                    }
                },
                cancel: {
                    text: options.cancelButton || '取消',
                    btnClass: 'btn-default',
                    action: function () {
                        if (typeof options.cancel === "function") {
                            options.cancel()
                        }
                    }
                }
            }
        });
    }
}

/**
 * 遮罩加载
 * @param {any} el 元素
 * @param {string} method 遮罩打开还是关闭 open 打开 、close关闭
 * @param {string} text 显示文本
 * @param {function} callback 回调函数
 */
function mask_load(el, method, text, callback) {
    var promise = WD_UTILS.promise();

    if (method === "close") {
        $(el).mLoading('destroy');
    } else if (method === "open") {
        $(el).mLoading({ text: text });

        promise.done(callback);
        promise.resolve($(el));
    }

    return promise;
}

/**
 * @param {string} message 消息内容
 * @param {string} msgLevel 消息级别 success、error、info、warning
 */
function show_message(message, msgLevel, opt) {
    var promise = WD_UTILS.promise();
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



var WD_UTILS = {
    //获取延迟对象
    promise: function () {
        return $.Deferred();
    },
    /**
     * @param {any} el 元素
     * @param {json} options 参数
     * @param {function} callback 回调函数
     */
    popover: function (el, options, callback) {
        var promise = WD_UTILS.promise();
        //参数
        options = $.extend({}, {
            trigger: 'click',
            title: 'WebUI Popover ',
            content: '<p>This is webui popover demo.</p><p>just enjoy it and have fun !</p>',
            width: 'auto',
            height: 'auto',
            multi: false,
            closeable: false,
            style: '',
            delay: 300,
            padding: true,
            backdrop: false
        }, options);
        //回调
        promise.done(callback);
        $(el).webuiPopover('destroy').webuiPopover(options);
        //延迟对象处理成功
        promise.resolve($(el));

        return promise;
    }
}

window.vpUtils = window.vpUtils || {}

window.vpUtils = {

    /**
         * 表达提交
         * @method formSubmit
         * @param form {string or jquery element} 表单ID或者jquery表单
         * @param req {}
         * ```{
         *		url {string} 请求地址 为空获取表单action
         *		data {json}
         * 		mask {jquery element or boolean} 遮罩元素 如果是true 默认获取元素 .car-page
         * 		maskinfo {string} 遮罩显示元素 -缺省 执行中
         * ```}
         * 返回的json 是data里面的数据！
         * @param maskinfo {string} 遮罩信息
         */
    formSubmit: function (form, req, successFn, errorFn, $mask) {
        var mask = req && req.mask;
        if (mask) {
            req.mask = vpCommons.isBoolean(req.mask) ? '.car-page' : req.mask;
            mask_load(req.maskEl || 'body', 'open', req.maskinfo || '正在提交请稍等..', function () {
                ajaxSubmit(form, req || {}, successFn, errorFn, req.maskEl || 'body');
            })
        } else {
            ajaxSubmit(form, req || {}, successFn, errorFn);
        }

        function ajaxSubmit(form, req, successFn, errorFn, $mask) {
            $(form).ajaxSubmit({
                headers: {
                    'Authorization': 'Bearer ' + vp.cookie.getToken(),
                    'Locale': window.LOCALE == 'zh' ? 'zh_CN' : 'en_US',
                },
                dataType: 'json',
                url:  req.url,
                data: req.data,
                type: req.method || 'post',
                error: function (xhr, textStatus, errorThrown) {
                    $mask && mask_load($mask, 'close');
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
                        location = '../../login.html';
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
                    $mask && mask_load($mask, 'close');
                    //检查是否数据丢失
                    if (json && json.infocode && json.infocode == 'VP000000') {
                        successFn(json.data);
                    } else if (json.msg) {
                        show_message(json.msg, 'error');
                    }
                }
            });
        };
    },

    /**
	 * 表达提交 
	 * @method formSubmit
	 * @param form {string or jquery element} 表单ID或者jquery表单
	 * @param req {}
	 * ```{
	 *		url {string} 请求地址 为空获取表单action
	 *		data {json}
	 * 		mask {jquery element or boolean} 遮罩元素 如果是true 默认获取元素 .car-page
	 * 		maskinfo {string} 遮罩显示元素 -缺省 执行中
	 * ```}
     * 返回的json 是data里面的数据！
	 * @param maskinfo {string} 遮罩信息
     */
    formSubmitMask: function (form, req, successFn, errorFn) {
        mask_load(req.maskEl || 'body', 'open', req.maskinfo || '执行中...', function ($mask) {
            vpUtils.formSubmit(form, req, successFn, errorFn, $mask)
        })
    },
    /**
	 * ajax 获取页面
     * @param el {string | element | jquery element} 元素唯一标识 or 元素 or jquery包装元素
     * @param url {string} 请求地址 -不能为空
     * @param data {json} 请求数据 -默认 {}
	 * @param fn {function} 页面加载回调函数（不管成功和失败）
	 * @return {jquery element}
     */
    loadPage: function (el, url, data, fn) {
        if (!url) {
            throw "url 不能为空!"
        };
        return $(el).load(url + '?_t=' + new Date().valueOf(), data, function (response, textStatus, xhr) {
            if (typeof fn === 'function') {
                fn();
            }
        });
    },


    /**
     * bootstrap模态框加载，有保存按钮
     * @param btns {btns} 按钮，默认有保存和关闭按钮，可以传入按钮进行扩展
     * @param url {string} 请求地址 -不能为空
     * @param queryData {json} 请求数据 -默认 {}
	 * @param ok_callback {function} 点击保存按钮的事件
     * @param cancel_callback {function} 点击取消的事件
     * @param callback {function}回调函数
     */
    modeWithSave: function (param, callback) {
        if (param.dialogid) _dialogId = param.dialogid;
        else _dialogId = 'dialog_' + new Date().valueOf();
        btns = param.btns || [{
            label: '保存',
            name: 'submit',
            cssClass: 'btn-primary',
            icon: 'fa fa-save',
            action: function (dialog) {
                flag = false;
                this.disable().spin();
                if (param.ok_callback != null)
                    flag = param.ok_callback(dialog, this);
                if (flag)
                    dialog.close();
                this.stopSpin().enable();
            }
        }, {
            label: '关闭',
            icon: 'fa fa-times-circle',
            cssClass: 'btn-default',
            action: function (dialog) {
                if (param.cancel_callback != null) param.cancel_callback(dialog);
                dialog.close();
            }
        }];
        var o = $.extend({ closeByBackdrop: false, closeByKeyboard: false }, { message: vpUtils.loadPage($('<div></div>'), param.url, param.queryData), id: _dialogId, buttons: btns }, param);
        var dialog = BootstrapDialog.show(o);
        if (typeof callback == 'function') {
            callback(dialog);
        }
    },

    /**
     * bootstrap模态框加载，无保存按钮
     * @param param 
     * @param callback
     */
    modeWithClose: function (param, callback) {
        if (param.dialogid) _dialogId = param.dialogid;
        else _dialogId = 'dialog_' + new Date().valueOf();
        btns = param.btns ||
            [{
                label: '关闭',
                icon: 'fa fa-times-circle',
                cssClass: 'btn-primary',
                action: function (dialog) {
                    if (param.cancel_callback != null) param.cancel_callback();
                    dialog.close();
                }
            }];
        var o = $.extend({ closeByBackdrop: false, closeByKeyboard: false }, { message: vpUtils.loadPage($('<div></div>'), param.url, param.queryData), id: _dialogId, buttons: btns }, param);
        var dialog = BootstrapDialog.show(o);
        if (typeof callback == 'function') {
            callback(dialog);
        }
    },

    //表单验证插件
    formvalidation: function (el, options, callback) {
        var promise = vpUtils.promise();
        var opts = $.extend({}, options);
        var form = $(el);
        form.bootstrapValidator(opts)
            //表单校验成功事件
            .on('success.form.bv', function (e) {
                var _bootstrapValidator = $(this).data('bootstrapValidator');
                if (typeof opts.submitHandler == 'function') {
                    opts.submitHandler(this, _bootstrapValidator, e);
                }
                e.preventDefault();
                //补入表单校验失败处理函数
            }).on('error.form.bv', function (e) {
                var _bootstrapValidator = $(this).data('bootstrapValidator');
                if (typeof opts.submitError == 'function') {
                    opts.submitError(this, _bootstrapValidator, e);
                }
                e.preventDefault();
            });

        promise.then(callback);
        promise.resolve(form.data('bootstrapValidator'), form);
        return promise;
    },


    //select2插件
    select2: function (el, options, callback) {
        var defaultOpts = { width: 'resolve', language: "zh-CN", placeholder: '请选择', openOnEnter: true, allowClear: true, theme: "bootstrap" };
        var opts = $.extend({}, defaultOpts, options);
        $(el).select2(opts);
        var value = $(el).attr("defaultValue");
        if (value) {
            if (value.split(',').length > 1)
                $(el).val(value.split(',')).trigger('change');
            else
                $(el).val(value).trigger('change');
        }
        if (typeof callback == 'function') {
            callback($(el));
        }
    },


    file: function (el, options) {
        var promise = vpUtils.promise();

        var defaultOpts = { buttonText: '选择', buttonName: 'btn-primary btn-lg', icon: false, placeholder: '请选择上传文件' };
        var opts = $.extend({}, defaultOpts, options);
        $(el).filestyle(opts);
        promise.resolve($(el));
        return promise;
    },

    promise: function () {
        return $.Deferred();
    },

    /**
     * showIndex		| bool   | 是否显示索引
     * showCheckbox		| bool   | 是否显示多选框
     * showOpt			| bool   | 是否显示详情页 show:true,isleaf : function(data,row){return true;}
     * treeGrid			| object | 表格树 {expand:false,ajax:{},isleaf:function(data){return data.children && data.children.length>0;}}
     * pagination		| bool   | 是否显示分页工具栏，默认true
     * mergeCellsByTier | string | 分级合并单元格，多个用逗号隔开
     * mustInfo         | boolean| 必须显示分页信息 优先级 大于pagination对于分页信息控制
     * @param el
     * @param options
     * @param callback
     * @returns
     */
    dataTable: function (el, options, callback) {
        var promise = vpUtils.promise();
        options = $.extend({
            pagination: options.pagination || true,//分页
            "mergeCellsByTier": '',//合并单元格
            fnFormatDetails: function (oTable, nTr, pdataId) {
                oTable.fnOpen(nTr, '加载中~', 'details');
            }
        }, options);
        if (typeof options.pagination == 'boolean') {
            if (options.pagination) {
                $.extend(options, {
                    paging: true,
                    info: true
                });
            } else {
                $.extend(options, {
                    paging: false,
                    info: false
                });
            }
        }
        if (typeof options.mustInfo == 'boolean') {
            if (options.mustInfo) {
                $.extend(options, {
                    info: true
                });
            } else {
                $.extend(options, {
                    info: false
                });
            }
        }
        if (options.mergeCellsByTier) {
            if (!options.fnDrawCallback) {
                //重绘完毕
                options.fnDrawCallback = function (oSettings) {
                    this.api().columns().mergeCellsByTier(options.mergeCellsByTier);
                };
            }
        }
        if (!options.showOpt || typeof options.showOpt == 'boolean') {
            options.showOpt = {
                show: !!options.showOpt
            };
        }
        options.showOpt = $.extend({
            show: false,
            close: 'glyphicon glyphicon-plus',
            open: 'glyphicon glyphicon-minus',
            style: '',
            data: '',
            isleaf: function (data, row) { return true; }
        }, options.showOpt);
        if (options.columns) {
            //索引
            if (options.showIndex) {
                options.columns.splice(0, 0, {
                    data: "__index__",
                    name: "__index__",
                    "type": "index",
                    title: '序号',
                    orderable: false,
                    width: '50px'
                });
                if (options.data) {
                    $.each(options.data, function (i, row) {
                        if (!row.__index__) {
                            row.__index__ = i + 1;
                        }
                    });
                }
                $(el).on('draw.dt', function (e, settings) {
                    var table = new $.fn.dataTable.Api(settings);
                    var nodes = table.column(function (idx, data, node) {
                        var opts = table.column(idx).options();
                        return opts.type == 'index';
                    }).nodes();
                    if (nodes) {
                        nodes.each(function (cell, i) {
                            //i 从0开始，所以这里先加1
                            i = i + 1;
                            //服务器模式下获取分页信息，使用 DT 提供的 API 直接获取分页信息
                            var page = table.page.info();
                            //当前第几页，从0开始
                            var pageno = page.page;
                            //每页数据
                            var length = page.length;
                            //行号等于 页数*每页数据长度+行号
                            var columnIndex = (i + pageno * length);
                            cell.innerHTML = columnIndex;
                        });
                    }
                });
                $(el).on('expandRow.dt', function (e, rowData, settings) {
                    var space = function (data) {
                        if (data._tgParent) {
                            return space(data._tgParent) + "&nbsp;";
                        }
                        return "";
                    }
                    if (rowData.aoChildrenData) {
                        var table = new $.fn.dataTable.Api(settings);
                        var colIndex = table.column(function (idx, data, node) {
                            var opts = table.column(idx).options();
                            return opts.type == 'index';
                        }).index();
                        var rowIndex = rowData.idx;
                        var parentIndex = $(table.cell(rowIndex, colIndex).node()).text();
                        for (var i = 0; i < rowData.aoChildrenData.length; i++) {
                            var c = rowData.aoChildrenData[i];
                            $(table.cell(rowIndex + (i + 1), colIndex).node()).html(space(c) + parentIndex + "." + (i + 1));
                        }
                    }
                });
            }
        }
        var _this = $(el).dataTable(options);
        promise.done(callback);
        //返回table查询对象 ，table实例化对象
        promise.resolve(_this.api(), _this);

        //监控浏览器放大缩写导致列和内容不对称
        $(window).resize(function () {
            _this.api().columns.adjust();
        });
        return promise;
    },
    /**
     * 弹出框插件
     * @param el 定位元素
     * @param options 参数
     */
    popover : function (el,options, callback) {
    	var _el;
    	if (typeof el == 'string') {
    		_el = $(el);
        }else if(typeof el == 'object'){
        	_el = el;
        }
        var settings = {
                trigger:'click',
                title:'WebUI Popover ',
                content:'<p>This is webui popover demo.</p><p>just enjoy it and have fun !</p>',
                width:'auto',
                height:'auto',
                multi:false,
                closeable:false,
                style:'',
                delay:300,
                padding:true,
                backdrop:false
        };
        _el.webuiPopover('destroy').webuiPopover($.extend({},settings,options));
    }
}
vpCommons = {
    isFunction: function (value) {
        return Object.prototype.toString.call(value) === '[object Function]';
    },
    isEmpty: function (value) {
        if (vpCommons.trim(value)) return false;
        return true;
    },
    isNotEmpty: function (value) {
        if (vpCommons.trim(value)) return true;
        return false;
    },
    //清除字符串2边空
    trim: function (val) {
        if (typeof val == 'undefined' || val == null || val == '') return '';
        if (typeof val == 'string') return $.trim(val);
        return val;
    },
    isBoolean: function (value) {
        return Object.prototype.toString.call(value) === '[object Boolean]';
    },
    isArray : function (value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }
}

vpUtils.Str = {
    //清除字符串2边空
    trim: function (val) {
        if (typeof val == 'undefined' || val == null || val == '') return '';
        if (typeof val == 'string') return $.trim(val);
        return val;
    },
    /**
    * 获得字符串实际长度，中文2，英文1
    * @param str 要获得长度的字符串
    */
    getLength: function (str) {
        if (true && vpUtils.Str.trim(str)) {
            var realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;
                else realLength += 2;
            }
            return realLength;
        } else {
            return 0;
        }

    },
    /** 
     * js截取字符串，中英文都能用 
     * @param str：需要截取的字符串 
     * @param len: 需要截取的长度 
     */
    cutStr: function (str, len) {
        var str_length = 0;
        var str_len = 0;
        str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4  
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；  
        if (str_length < len) {
            return str;
        }
    },
    changeToStr:function(arr){
        var str = '';
        if(arr.length>0){
            for(var i=0;i<arr.length;i++){
                if(i == arr.length-1){
                    str+=arr[i];
                }else{
                    str = str +arr[i]+",";
                }
            }
        }
        return str.trim();
    }
}

vpUtils.date = {

    /**
     * java后台日期格式转换
     * javaLongDate:20160405150902884
     * format:[yyyy-MM-dd|yyyy-MM-dd HH:mm|yyyy-MM-dd HH:mm:ss]
     * 默认：yyyy-MM-dd HH:mm:ss
     */
    formatJavaStr: function (javaLongDate, format) {
        if (javaLongDate == undefined || javaLongDate == null || javaLongDate == '') return '';
        javaLongDate = javaLongDate + '';
        if (format == undefined) { format = 'yyyy-MM-dd HH:mm:ss'; }
        if (format == 'yyyy-MM-dd') { return javaLongDate.substring(0, 4) + '-' + javaLongDate.substring(4, 6) + '-' + javaLongDate.substring(6, 8); };
        if (format == 'yyyy-MM-dd HH:mm') { return javaLongDate.substring(0, 4) + '-' + javaLongDate.substring(4, 6) + '-' + javaLongDate.substring(6, 8) + '&nbsp;' + javaLongDate.substring(8, 10) + ':' + javaLongDate.substring(10, 12); };
        if (format == 'yyyy-MM-dd HH:mm:ss') { return javaLongDate.substring(0, 4) + '-' + javaLongDate.substring(4, 6) + '-' + javaLongDate.substring(6, 8) + '' + '&nbsp;' + javaLongDate.substring(8, 10) + ':' + javaLongDate.substring(10, 12) + ':' + javaLongDate.substring(12, 14); };
    }
};

vpUtils.Url = {
        //跳转到指定地址
        location: function (url) {
            setTimeout(function () {
                location = url;
            }, 100);
        },
        getUrlParam: function (url, name) {
            if (!url)
                return null;
            var reg = new RegExp("(^|&|\\\?)" + name + "=([^&]*)(&|$)");
            var pos = url.indexOf("?");
            if (pos == -1) {
                return "";
            }
            url = url.substring(pos + 1);
            var r = url.match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }
}

