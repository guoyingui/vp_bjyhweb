
var gatWayUrl = vp.config.URL.localHost;  //vp.gateway.handleGateWay('{gatWayUrl}');
var dev = vp.config.URL.devMode.enabled;
var uihost = vp.config.URL.jsonHost;
var msgtimeout = 5000;
var token = vp.cookie.getToken();

function getUploadPath() {
	if (dev) {
		return vp.gateway.handleGateWay("/{vpplat}");
	}
	else {
		return gatWayUrl + "/zuul/" + vp.config.SETTING.vpplat; // IE8下不支持replace
	}
	// return vp.gateway.handleGateWay((gatWayUrl + (dev?"":"/zuul") + "/{vpplat}"));
}

function getWorkflowPath() {
	return vp.gateway.handleGateWay('{vpflow}');
}

function getVfmRootPath() {
	return vp.gateway.handleGateWay('{vpplat}');
}

function getVpmPath() {
	return vp.gateway.handleGateWay('{vpmprovider}');
}

function getPagePath() {
	return vp.gateway.handleGateWay('{vpui}') + "/vpweb";
}

function getFlowPagePath() {
	return vp.gateway.handleGateWay('{vpui}') + "/vpflow";
}

String.prototype.replaceAll = function (s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

//设置cookie
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1);
		if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
	}
	return "";
}
//清除cookie
function clearCookie(name) {
	setCookie(name, "", -1);
}

//$.getScript("/project/agile/js/plugins/layer/layer.min.js");  //加载js文件
var msg001 = "VIEW-100001：格式解析错误";
var msg002 = "VIEW-100002：数据请求发生错误";
var msg003 = "VIEW-100003：绑定容器不存在";
var msg004 = "VIEW-100004：未定义的实现方法";

var lbl001 = "请输入您需要的内容…";
var lbl002 = "无符合条件数据";

function isInclude(name) {
	var js = /js$/i.test(name);
	var es = document.getElementsByTagName(js ? 'script' : 'link');
	for (var i = 0; i < es.length; i++)
		if (es[i][js ? 'src' : 'href'].indexOf(name) != -1) return true;
	return false;
}

function loadjs(id,url){
	  var  xmlHttp = null;  
  if(window.ActiveXObject){//IE  
      try {  
   //IE6以及以后版本中可以使用  
   xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");  
      } catch (e) {  
   //IE5.5以及以后版本可以使用  
   xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
      }  
  }else if(window.XMLHttpRequest){  
      //Firefox，Opera 8.0+，Safari，Chrome  
      xmlHttp = new XMLHttpRequest();  
  }  
  //采用同步加载  
  xmlHttp.open("GET",url,false);  
  //发送同步请求，如果浏览器为Chrome或Opera，必须发布后才能运行，不然会报错  
  xmlHttp.send(null);  
  //4代表数据发送完毕  
  if( xmlHttp.readyState == 4 )
{  
      //0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存  
      if((xmlHttp.status >= 200 && xmlHttp.status <300) || xmlHttp.status == 0 || xmlHttp.status == 304){  
   var myBody = document.getElementsByTagName("head")[0];  
   var myScript = document.createElement( "script" );  
   myScript.language = "javascript";  
   myScript.type = "text/javascript";  
   myScript.id = id;  
   try{  
       //IE8以及以下不支持这种方式，需要通过text属性来设置  
       myScript.appendChild(document.createTextNode(xmlHttp.responseText));  
   }catch (ex){  
       myScript.text = xmlHttp.responseText;  
   }  
   myBody.appendChild(myScript);  
   return true;  
      }else{  
   return false;  
      }  
  }else{  
      return false;  
  }  
}

/*
* @function 动态加载css文件
* @param {string} options.url -- css资源路径
* @param {function} options.callback -- 加载后回调函数
* @param {string} options.id -- link标签id
*/
function loadCss(options){
    var url = options.url,
        callback = typeof options.callback == "function" ? options.callback : function(){},
        id = options.id,
        node = document.createElement("link"),
        supportOnload = "onload" in node,
        isOldWebKit = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, "$1") < 536, // webkit旧内核做特殊处理
        protectNum = 300000; // 阈值10分钟，一秒钟执行pollCss 500次
        
    node.rel = "stylesheet";
    node.type = "text/css";
    node.href = url;
    if( typeof id !== "undefined" ){
        node.id = id;
    }
    document.getElementsByTagName("head")[0].appendChild(node);
    
    // for Old WebKit and Old Firefox
    if (isOldWebKit || !supportOnload) {
        // Begin after node insertion
        setTimeout(function() {
            pollCss(node, callback, 0);
        }, 1);
        return;
    }

    if(supportOnload){
        node.onload = onload;
        node.onerror = function() {
            // 加载失败(404)
            onload();
        }
    }else{
        node.onreadystatechange = function() {
            if (/loaded|complete/.test(node.readyState)) {
                onload();
            }
        }
    }

    function onload() {
        // 确保只跑一次下载操作
        node.onload = node.onerror = node.onreadystatechange = null;

        // 清空node引用，在低版本IE，不清除会造成内存泄露
        node = null;

        callback();
    }
    
    // 循环判断css是否已加载成功
    /*
    * @param node -- link节点
    * @param callback -- 回调函数
    * @param step -- 计步器，避免无限循环
    */
    function pollCss(node, callback, step){
        var sheet = node.sheet,
            isLoaded;
            
        step += 1;
        
        // 保护，大于10分钟，则不再轮询
        if(step > protectNum){
            isLoaded = true;
            
            // 清空node引用
            node = null;
            
            callback();
            return;
        }

        if(isOldWebKit){
            // for WebKit < 536
            if(sheet){
                isLoaded = true;
            }
        }else if(sheet){
            // for Firefox < 9.0
            try{
                if(sheet.cssRules){
                    isLoaded = true;
                }
            }catch(ex){
                // 火狐特殊版本，通过特定值获知是否下载成功
                // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
                // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
                // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
                if(ex.name === "NS_ERROR_DOM_SECURITY_ERR"){
                    isLoaded = true;
                }
            }
        }

        setTimeout(function() {
            if(isLoaded){
                // 延迟20ms是为了给下载的样式留够渲染的时间
                callback();
            }else{
                pollCss(node, callback, step);
            }
        }, 20);
    }
}

function loadScript(url, callback) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	if (typeof (callback) != "undefined") {
		if (script.readyState) {
			script.onreadystatechange = function () {
				if (script.readyState == "loaded" || script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			};
		}
		else {
			script.onload = function () {
				callback();
			};
		}
	}
	script.src = url;
	document.body.appendChild(script);
}

// loadScript("/global.js", function () { });
// loadScript("/project/agile/js/jquery.min-1.12.4.js", function () { });
// loadScript("/project/agile/js/plugins/layer/layer.min.js", function () { });

function getParameter(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

function vpAjax(url, param, type, callback) {

	//console.log(getVfmRootPath() + url);

	if (url.indexOf("http") < 0) {
		url = getVfmRootPath() + url;
	}

	var headers = {
		Locale: 'zh_CN'
	}

	if(token){
		if (url.indexOf("?") != -1) {
			url += "&access_token=" + token;
		}
		else {
			url += "?access_token=" + token;
		}

		headers.Authorization = 'Bearer ' + token;
	}
	
	$.ajax({
		type: type || 'GET',
		url: url,
		headers: headers,
		data: param || {},
		async: false, //false代表只有在等待ajax执行完毕后才执行,默认是true
		dataType: "json",
		success: function (rst, status, xhr) {
			if (rst.data != undefined && jQuery.isFunction(callback)) {
				if (rst.data.success == false) {
					layer.msg(rst.data.msg, { icon: 2, time: msgtimeout });
				}
				callback.call(this, rst.data);
			}
			else {
				layer.msg(rst.msg, { icon: 2, time: msgtimeout });
			}
		},
		complete: function (xhr, status) {
		},
		error: function (xhr, status, res) {
			try {
				if (xhr.status == 401 && xhr.responseJSON.redirectUrl) {
					top.window.location.href = vp.gateway.handleGateWay(xhr.responseJSON.redirectUrl);
				} 
				else if (xhr.status == 401) {
					top.window.location.href = gatWayUrl + "/login";
				} 
				else {
					var data = eval('[' + xhr.responseText + ']')[0];
					var smsg = "";
					if (data.msg == undefined) {
						smsg = data.exception;					
						if (smsg == 'com.netflix.zuul.exception.ZuulException') {
							smsg = "访问服务异常，请检查服务启动状态和网络状态。";
						}
					}
					else {
						smsg = data.infocode + "：" + data.msg;
					}
					layer.msg(smsg, { icon: 2, time: msgtimeout });
				}
			}
			catch (e) {
				layer.msg("系统异常，请与系统管理员联系。", { icon: 2, time: msgtimeout });
			}
		}
	});
}

function vpPostAjax(url, param, type, callback) {
	vpAjax(url, { sparam: JSON.stringify(param) }, "POST", callback);
}

$.fn.serializeJSON = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

/* ================================================ 对象封装 ================================================ */
var Search = (function (window) {
	var Search = function (obj) {
		return new Search.fn.init(obj);
	}

	Search.fn = Search.prototype = {
		constructor: Search,
		init: function (obj) {
			this.obj = obj;
			this.parseEl = function () {
				this.parseHtml(this.obj);
			};
		},
		parseHtml: function (obj) {
			var html = '';
			var fieldid = obj.id;
			if (obj.id == undefined) {
				fieldid = "vpquick";
			}
			html += '<input type="text" id="' + fieldid + '" value="" placeholder="' + lbl001 + '" class="form-control input-sm padding-right-30 vp-radius">';
			html += '<i class="fa fa-search"></i>';

			if (obj.el == undefined || $("#" + obj.el).length == 0) {
				layer.msg(msg003, { icon: 2, time: msgtimeout });
			}
			else {
				$("#" + obj.el).html(html);

				$(".fa-search").click(function () {
					var param = {};
					param["quickvalue"] = $(this).parent().find("input").val(); // encodeURI($(this).parent().find("input").val());
					param["curr"] = "1";
					reload(param);
					// otreetable.reload(param);
				});
			}
			return html;
		}
	}

	Search.fn.init.prototype = Search.fn;

	return Search;
})();


var Filter = (function (window) {
	var Filter = function (obj) {
		return new Filter.fn.init(obj);
	}

	Filter.fn = Filter.prototype = {
		constructor: Filter,
		init: function (obj) {
			this.obj = obj;
			this.parseEl = function () {
				this.parseHtml(this.obj);
			};
		},
		parseHtml: function (obj) {
			var html = '';
			var curfilter = '';
			$.each(obj.data, function (i, item) {
				if (item.iscurrent) {
					curfilter = 'active';
				}
				else {
					curfilter = '';
				}
				html += '<label class="btn btn-sm btn-white table-choose ' + curfilter + '" value="' + item.value + '">' + item.text + '</label>'
			});

			if (obj.el == undefined || $("#" + obj.el).length == 0) {
				layer.msg(msg003, { icon: 2, time: msgtimeout });
			}
			else {
				$("#" + obj.el).html(html);

				$("#" + obj.el + ">label").click(function () {
					$(this).parent().find(".active").removeClass("active");
					$(this).addClass("active");

					var param = {};
					param["filtervalue"] = $(this).attr("value");
					param["curr"] = "1";
					reload(param);
				});
			}
			return html;
		}
	}

	Filter.fn.init.prototype = Filter.fn;

	return Filter;
})();

var ListTool = (function (window) {
	var ListTool = function (obj) {
		return new ListTool.fn.init(obj);
	}

	ListTool.fn = ListTool.prototype = {
		constructor: ListTool,
		init: function (obj) {
			this.obj = obj;
			this.parseEl = function () {
				this.parseHtml(this.obj);
			};
		},
		parseHtml: function (obj) {
			var html = '';
			var primary = '';
			$.each(obj.data, function (i, item) {
				if (item.id == obj.primary) {
					primary = 'btn-primary';
				}
				else {
					primary = 'btn-default btn-outline';
				}

				html += '<li class="pull-right" data-toggle="tooltip" data-placement="left" title=' + item.title + '>';
				html += '  <div data-toggle="dropdown" id=' + item.id + '>';
				html += '    <button class="btn ' + primary + ' btn-circle dropdown-toggle" type="button">';
				html += '      <i class="fa ' + item.faclass + '"></i>';
				html += '    </button>';
				html += '  </div>';
				html += '</li>';
			});

			if (obj.el == undefined || $("#" + obj.el).length == 0) {
				layer.msg(msg003, { icon: 2, time: msgtimeout });
			}
			else {
				$("#" + obj.el).html(html);
			}
			return html;
		}
	}

	ListTool.fn.init.prototype = ListTool.fn;

	return ListTool;
})();


var PageBar = (function (window) {
	var PageBar = function (obj) {
		return new PageBar.fn.init(obj);
	}

	PageBar.fn = PageBar.prototype = {
		constructor: PageBar,
		init: function (obj) {
			this.obj = obj;
			this.parseEl = function () {
				this.parseHtml(this.obj);
			};
		},
		parseHtml: function (obj) {
			var html = '';

			html += '<div id="layui-table-page1"><div class="layui-box layui-laypage layui-laypage-default" id="layui-laypage-1"><a href="javascript:;" class="layui-laypage-prev layui-disabled" data-page="0"><i class="layui-icon"></i></a><span class="layui-laypage-curr"><em class="layui-laypage-em"></em><em>1</em></span><a href="javascript:;" data-page="2">2</a><a href="javascript:;" data-page="3">3</a><span class="layui-laypage-spr">…</span><a href="javascript:;" class="layui-laypage-last" title="尾页" data-page="100">100</a><a href="javascript:;" class="layui-laypage-next" data-page="2"><i class="layui-icon"></i></a><span class="layui-laypage-skip">到第<input type="text" min="1" value="1" class="layui-input">页<button type="button" class="layui-laypage-btn">确定</button></span><span class="layui-laypage-count">共 1000 条</span><span class="layui-laypage-limits"><select lay-ignore=""><option value="10" selected="">10 条/页</option><option value="20">20 条/页</option><option value="30">30 条/页</option><option value="40">40 条/页</option><option value="50">50 条/页</option><option value="60">60 条/页</option><option value="70">70 条/页</option><option value="80">80 条/页</option><option value="90">90 条/页</option></select></span></div></div>';

			if (obj.el == undefined || $("#" + obj.el).length == 0) {
				layer.msg(msg003, { icon: 2, time: msgtimeout });
			}
			else {
				$("#" + obj.el).html(html);
			}
			return html;
		}
	}

	PageBar.fn.init.prototype = PageBar.fn;

	return PageBar;
})();


var TreeTable = (function (window) {
	var TreeTable = function (obj) {
		return new TreeTable.fn.init(obj);
	}

	TreeTable.fn = TreeTable.prototype = {
		constructor: TreeTable,
		init: function (obj) {
			this.obj = obj;
			this.parseEl = function () {
				this.parseHtml(this.obj);
			};
			this.getParam = function () {
				return this.obj;
			};
			this.reload = function (p) {
				this.reloadTree(p);
			};
		},
		parseHtml: function (obj) {
			if (obj.el == undefined || $("#" + obj.el).length == 0) {
				layer.msg(msg003, { icon: 2, time: msgtimeout });
			}
			else {
				$("#" + obj.el).parent().height($("body").height() - 110);
				vptree(obj);
			}
		},
		reloadTree: function (obj) {
			treeReload(obj);
		}
	}

	TreeTable.fn.init.prototype = TreeTable.fn;

	return TreeTable;
})();


var ListTable = (function (window) {
	var ListTable = function (obj) {
		return new ListTable.fn.init(obj);
	}

	ListTable.fn = ListTable.prototype = {
		constructor: ListTable,
		init: function (obj) {
			this.obj = obj;
			this.parseEl = function () {
				this.parseHtml(this.obj);
			};
			this.getParam = function () {
				return this.obj;
			};
			this.reload = function (p) {
				this.reloadList(p);
			};
			this.getTable = function (p) {
				return layui.table;
			};
		},
		parseHtml: function (obj) {
			if (obj.el == undefined || $("#" + obj.el).length == 0) {
				layer.msg(msg003, { icon: 2, time: msgtimeout });
			}
			else {
				$("#" + obj.el).parent().height($("body").height() - 120);
				if (obj.radio) {
					var html = '';
					html += '<script type="text/html" id="selectBar">';
					html += '  <a lay-event="radio"><input type="radio" name="radio" value="radio" title=" "></a>';
					html += '</script>';
					$("#" + obj.el).after(html);
				}

				var param = obj.param;
				obj.param = param;
				if (obj.param.initlimit != undefined) {
					obj.param.limit = obj.param.initlimit;
				}
				loadListData(obj);
			}
			// alert($("body").parent().attr("href"));
		},
		reloadList: function (param) {
			var oparam = olisttable.getParam();
			var obj = oparam.param;
			for (var key in param) {
				obj[key] = param[key];
			}
			oparam.param = obj;
			loadListData(oparam);
		}
	}

	ListTable.fn.init.prototype = ListTable.fn;

	return ListTable;
})();

function loadListData(obj) {
	vpPostAjax(obj.vpurl, obj.param, 'GET', function (rst) {
		if (typeof(accesslevel) != 'undefined') {
			accesslevel = (rst.accesslevel==undefined?-1:rst.accesslevel);
		}
		var header = rst.headers;
		if (obj.checkbox) {
			header.unshift({ type: 'checkbox', width: 46 });
		}
		else if (obj.radio) {
			header.unshift({ field: 'iid', title: '', width: 46, toolbar: '#selectBar' });
		}

		if (obj.toolbar) {
			header.push({ field: 'right', fixed: 'right', title: '操作', width: ((obj.toolbarwidth == undefined) ? 80 : obj.toolbarwidth), toolbar: "#vpbar" });
		}

		layui.use('table', function () {
			olisttable.getTable().render({
				elem: '#' + obj.el,
				id: 'vptable',
				cols: [header],
				height: ((obj.showpage != false) ? 'full-130' : 'full-122'),
				data: rst.data,
				limit: ((obj.showpage != false) ? rst.numperpage : 100),
				page: false,
				initSort: {
					field: rst.sortfield || 'ssequencekey',
					type: rst.sorttype || 'asc'
				}
			});

			olisttable.getTable().on('tool(vpclick)', function (odata) {  // odata.data 当前行数据  odata.event event参数对应的值  odata.tr 当前行tr的DOM对象
				if (obj.toolbarevent != undefined) {
					try {
						eval(obj.toolbarevent)(odata);
					}
					catch (exception) {
						layer.msg(msg004 + obj.toolbarevent, { icon: 2, time: msgtimeout });
					}
				}
				else {
					doListEvent(odata);
				}
			});
			olisttable.getTable().on('sort(vpclick)', function (o) {
				var param = obj.param;
				param['sortfield'] = o.field;
				param['sorttype'] = o.type;
				obj.param = param;
				loadListData(obj);
			});
		});
		if (obj.showpage != false) {
			var curlimit = 10;
			if (obj.param.initlimit != undefined) {
				curlimit = obj.param.initlimit;
			}
			$("#vppagebar").show();
			layui.use(['laypage', 'layedit'], function () {
				this.laypage.render({
					elem: 'vppagebar',
					count: rst.totalrows,
					limit: rst.numperpage,
					curr: rst.currentpage,
					limits: [curlimit * 1, curlimit * 2, curlimit * 5],
					layout: ['count', 'first', 'prev', 'page', 'next', 'last', 'limit', 'skip'],
					jump: function (o, first) {
						if (!first) {
							var param = obj.param;
							param['limit'] = o.limit;
							param['curr'] = o.curr;
							obj.param = param;
							loadListData(obj);
						}
					}
				});
			});
		}
		else {
			$("#vppagebar").hide();
		}
	});
}

var FormView = (function (window) {
	var FormView = function (obj) {
		return new FormView.fn.init(obj);
	}

	FormView.fn = FormView.prototype = {
		constructor: FormView,
		init: function (obj) {
			this.obj = obj;
			this.parseEl = function (title) {
				this.obj['title'] = title;
				this.parseHtml(this.obj);
			};
		},
		parseHtml: function (obj) {
			if (obj.el == undefined || $("#" + obj.el).length == 0) {
				layer.msg(msg003, { icon: 2, time: msgtimeout });
			}
			else {
				var oparam = {};
				// $("#"+obj.el).parent().height($("body").height() - 110);
				var html = '';
				//html += '<div class="spin-icon" onclick="closeDrawer(\'#'+obj.el+'\')">';
				//html += '  <i class="fa fa-times"></i>';
				//html += '</div>';
				html += '<div class="drawer-box">';

				html += '  <div class="padding-10">';
				html += '    <div class="ibox m-b-xxl">';
				//html += '      <div class="topFixed" id="vpclose" data-toggle="tooltip" data-placement="left" title="关闭">';
				html += '      <div class="" style="display:inline-block" id="vpclose" data-toggle="tooltip" data-placement="left" title="关闭">';
				html += '        <img src="../../images/vpclose.png" onclick="closeDrawer(\'#' + obj.el + '\')">';
				html += '      </div>';
				//html += '      <div class="topFixed" style="left: 30px;" id="vpeditformtitle" data-toggle="tooltip" data-placement="left" title="'+obj.title+'">';
				html += '      <div class="" style="left: 30px;display:inline-block" id="vpeditformtitle" data-toggle="tooltip" data-placement="left" title="' + obj.title + '">';
				html += '        <i class="fa fa-info-circle text-muted"></i>';
				html += '      </div>';
				html += '      <div class="tabs-container p-t-lg">';
				//html += '        <ul class="nav nav-tabs topFixed-tab" id="entitytabs" style="display: block; margin-left: 20px;">';
				html += '        <ul class="nav nav-tabs topFixed-tab" id="entitytabs" style="position:absolute;left: 30px;display: block; margin-left: 20px;">';
				//alert(11);
				var defaulturl = '';
				var defaultclass = '';
				var tabdefault = parseInt(obj.tabdefault);
				$.each(obj.data, function (i, item) {
					defaultclass = '';
					if (obj.tabdefault == i || ((obj.tabdefault == undefined || tabdefault == "NaN" || tabdefault >= item.length || tabdefault < 0) && i == 0)) {
						defaultclass = 'active';
						defaulturl = item.url;
					}

					var cururl = item.url;
					if (cururl.indexOf("?") != -1) {
						cururl = cururl + "&iid=" + $('#vpeditform').attr("iid");
					} else {
						cururl = cururl + "?iid=" + $('#vpeditform').attr("iid");
					}

					if ($('#vpeditform').attr("iid") != '0') {
						//defaulturl = item.url;												
						if ('entity_vari.html' == item.url && ($('#vpeditform').attr("iflowtype") == 2 || $('#vpeditform').attr("iflowtype") == 3)) {
							html += '<li class="vpcfgflow" url="' + cururl + '" toolbar="' + item.toolbar + '"><a>' + item.text + '</a></li>';
						}
						else if ('entity_vari.html' != item.url) {
							html += '<li class="' + defaultclass + '" url="' + cururl + '" toolbar="' + item.toolbar + '"><a>' + item.text + '</a></li>';
						}
						else {
							html += '<li class="vpcfgflow" url="' + cururl + '" toolbar="' + item.toolbar + '" style="display: none;"><a>' + item.text + '</a></li>';
						}
					}
					else if (i==0) { // 等于0时
						html += '<li class="' + defaultclass + '" url="' + cururl + '" toolbar="' + item.toolbar + '"><a>' + item.text + '</a></li>';
					}
				});
				html += '        </ul>';

				/*
				html += '  <div class="padding-10" style="padding-top: 0px;">';
				html += '    <div class="ibox m-b-xxl">';               
                html += '      <div class="tabs-container">';
				html += '		 <div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief"><ul class="nav-tabs layui-tab-title">';
				$.each(obj.data, function(i, item) {
					if (i == 0) {
						html += '<li class="layui-this" url="'+item.url+'">'+item.text+'</li>';
					}
					else {
						html += '<li class="" url="'+item.url+'">'+item.text+'</li>';
					}
				});
				html += '		 </ul></div>';
				*/

				html += '        <div class="tab-content">';
				html += '        <div id="frm" style="height: 546px; padding-bottom: 40px;" class="">';
				html += '          <iframe id="frminfo" src="' + defaulturl + '" style="border: 0px; width: 100%; height: 100%;"></iframe>';
				html += '        </div>';
				html += '        <div id="btnbutton" class="btnFixed text-center" style="position: absolute;bottom: 5px; display: block;">';
				//html += '          <button class="btn btn-sm btn-outline btn-primary" id="saveBtn">保存</button>';
				html += '        </div>';
				html += '      </div>';
				html += '    </div>';
				html += '  </div>';
				html += '</div>';

				$("#" + obj.el).html(html);

				$("#" + obj.el).find(".nav-tabs>li").click(function () {
					// layui-this  active
					$(this).parent().find(".layui-this").removeClass("layui-this");
					$(this).addClass("layui-this");
					$(this).parent().find(".active").removeClass("active");
					$(this).addClass("active");
					$("#frminfo").attr("src", $(this).attr("url"));
					var h = document.body.clientHeight - 20;
					if ($(this).attr("toolbar") != 'true') {
						$("#btnbutton").hide();
						
						$("#frminfo").height(h);
						$("#frm").height(h);
						$('.drawer-box').height(h + 25 +'px');
					}
					else {
						$("#btnbutton").show();
						h = h - 60;
						$("#frminfo").height(h);
						$("#frm").height(h);
					}
				});
			}
		}
	}

	FormView.fn.init.prototype = FormView.fn;

	return FormView;
})();


var FormObject = (function (window) {
	var FormObject = function (obj) {
		return new FormObject.fn.init(obj);
	}

	FormObject.fn = FormObject.prototype = {
		constructor: FormObject,
		init: function (obj) {
			this.obj = obj;
			this.parseEl = function () {
				this.parseHtml(this.obj);
			};
		},
		parseHtml: function (obj) {
			if (obj.el == undefined || $("#" + obj.el).length == 0) {
				layer.msg(msg003, { icon: 2, time: msgtimeout });
			}
			else {
				//$("#"+obj.el).parent().height($("body").height() - 110);
				var html = "";
				html += '<form class="form-horizontal" id="oForm">';
				vpPostAjax(obj.vpurl + '?method=getform', obj.param, 'GET', function (rst) {
					if (rst.success) {
						$.each(rst.data, function (i, item) {
							if (item.ishow == '0') {
								html += '<div class="ibox-title border-bottom p-l-none" style="margin-bottom: 10px;" id="' + item.scode + '">';
								html += '	<h5>' + item.sname + '</h5>';
								html += '	<div class="ibox-tools" style=" float: left; top: -7px; left: 5px;">';
								html += '		<a class="collapse-link" data-toggle="tooltip" data-placement="right" title="收起">';
								html += '			<i class="fa fa-caret-up"></i>';
								html += '		</a>';
								html += '	</div>';
								html += '</div>';

								html += '<div class="ibox-content p-n clearfix">';
								for (var j = 0; j < item.oattr.length; j++) {
									html += '<div class="form-group">';
									var subitem = item.oattr[j];
									html += '	<div class="col-sm-6">';
									html += '		<label class="col-sm-2 col-md-3 control-label text-ellipsis">' + subitem.slabel + '</label>';
									html += '		<div class="col-sm-8 col-md-9">';
									html += '			<input id="' + subitem.sfield + '" name="' + subitem.sfield + '" class="form-control" type="text">';
									html += '		</div>';
									html += '	</div>';

									j++;
									subitem = item.oattr[j];
									html += '	<div class="col-sm-6">';
									html += '		<label class="col-sm-2 col-md-3 control-label text-ellipsis">' + subitem.slabel + '</label>';
									html += '		<div class="col-sm-8 col-md-9">';
									html += '			<input id="' + subitem.sfield + '" name="' + subitem.sfield + '" class="form-control" type="text" aria-required="true" aria-invalid="false" class="valid">';
									html += '		</div>';
									html += '	</div>';
									html += '</div>';
								}
								/*
								$.each(item.oattr, function(j) {
									html += '<div class="form-group">';
									html += '	<div class="">';
									html += '		<label class="col-sm-2 col-md-3 control-label text-ellipsis">'+subitem.slabel+'</label>';
									html += '		<div class="col-sm-8 col-md-9">';
									html += '			<input id="'+subitem.sfield+'" name="'+subitem.sfield+'" class="form-control" type="text" value="'+subitem.svalue+'">';
									html += '		</div>';
									html += '	</div>';
									html += '</div>';
								});
								*/
								html += '</div>';
							}
						});
					}
				});
				html += '</form>';
				$("#" + obj.el).html(html);

				//折叠ibox
				$('.collapse-link').click(function () {
					var ibox = $(this).closest('div.ibox');
					var button = $(this).find('i');
					var content = ibox.find('div.ibox-content');
					content.slideToggle(200);
					button.toggleClass('fa-caret-up').toggleClass('fa-caret-down');
					//ibox.toggleClass('').toggleClass('border-bottom');
					setTimeout(function () {
						ibox.resize();
						ibox.find('[id^=map-]').resize();
					}, 50);
				});
			}
		}
	}

	FormObject.fn.init.prototype = FormObject.fn;

	return FormObject;
})();


var RelationTool = (function (window) {
	var RelationTool = function (obj) {
		return new RelationTool.fn.init(obj);
	}

	RelationTool.fn = RelationTool.prototype = {
		constructor: RelationTool,
		init: function (obj) {
			this.obj = obj;
			this.parseEl = function () {
				this.parseHtml(this.obj);
			};
		},
		parseHtml: function (obj) {
			var html = '';
			var primary = '';
			$.each(obj.data, function (i, item) {
				if (item.id == obj.primary) {
					primary = 'add-childwork text-primary';
				}
				else {
					primary = 'collapse-link';
				}

				html += '<a class="' + primary + '" data-toggle="tooltip" data-placement="left" title="" data-original-title="' + item.title + '" id="' + item.id + '">';
				html += '	<i class="fa ' + item.faclass + '"></i>';
				html += '</a>';
			});

			if (obj.el == undefined || $("#" + obj.el).length == 0) {
				layer.msg(msg003, { icon: 2, time: msgtimeout });
			}
			else {
				$("#" + obj.el).html(html);
			}
			return html;
		}
	}

	RelationTool.fn.init.prototype = RelationTool.fn;

	return RelationTool;
})();


function openWindow(url, title, param, callback) {
	layer.open({
		type: 2, // 可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
		maxmin: true,
		title: title,
		area: ['80%', '96%'],
		resize: false,
		btn: param.btn,
		btnAlign: 'c',
		shift: 2,
		shade: 0.3,
		content: [url], //iframe的url，no代表不显示滚动条
		yes: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", parent.document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 1);
				}
				else {
					$(".layui-layer-btn0", parent.document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		btn2: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", parent.document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 2);
				}
				else {
					$(".layui-layer-btn0", parent.document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		btn3: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", parent.document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 3);
				}
				else {
					$(".layui-layer-btn0", parent.document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
			return false;
		},
		btn4: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", parent.document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 4);
				}
				else {
					$(".layui-layer-btn0", parent.document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		btn5: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", parent.document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 5);
				}
				else {
					$(".layui-layer-btn0", parent.document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		end: function () { //此处用于演示
			//alert('我可以传值给父层！这里是回调函数')
		}
	});
}
function openWindowfirst(url, title, param, callback) {
	layer.open({
		type: 2, // 可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
		maxmin: true,
		title: title,
		area: ['80%', '96%'],
		resize: false,
		btn: param.btn,
		btnAlign: 'c',
		shift: 2,
		shade: 0.3,
		content: [url], //iframe的url，no代表不显示滚动条
		yes: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 1);
				}
				else {
					$(".layui-layer-btn0", document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		btn2: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 2);
				}
				else {
					$(".layui-layer-btn0", document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		btn3: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 3);
				}
				else {
					$(".layui-layer-btn0", document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
			return false;
		},
		btn4: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 4);
				}
				else {
					$(".layui-layer-btn0", document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		btn5: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 5);
				}
				else {
					$(".layui-layer-btn0", document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		end: function () { //此处用于演示
			//alert('我可以传值给父层！这里是回调函数')
		}
	});
}

function openWindow1(url, title, param, callback, width, height) {
	layer.open({
		type: 2, // 可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
		maxmin: true,
		title: title,
		area: [width + '%', height + 'px'],
		resize: false,
		btn: param.btn,
		btnAlign: 'c',
		shift: 2,
		shade: 0.3,
		content: [url], //iframe的url，no代表不显示滚动条
		yes: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", parent.document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 1);
				}
				else {
					$(".layui-layer-btn0", parent.document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		btn2: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", parent.document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 2);
				}
				else {
					$(".layui-layer-btn0", parent.document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		btn3: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", parent.document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 3);
				}
				else {
					$(".layui-layer-btn0", parent.document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
			return false;
		},
		btn4: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", parent.document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 4);
				}
				else {
					$(".layui-layer-btn0", parent.document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		btn5: function (index, layero) {
			try {
				if (!$(".layui-layer-btn0", parent.document).hasClass("layui-btn-disabled")) {
					eval(callback)(index, layero, 5);
				}
				else {
					$(".layui-layer-btn0", parent.document).addClass("layui-btn-disabled")
				}
			}
			catch (exception) {
				layer.msg(msg004 + callback, { icon: 2, time: msgtimeout });
			}
			return false;
		},
		end: function () { //此处用于演示
			//alert('我可以传值给父层！这里是回调函数')
		}
	});
}





$(document).keyup(function (event) {
	if (event.keyCode == 13) {
		$(':focus').parent().find("i").click(); // 回车直接执行快速搜索
		/*
		if ($(':focus').parent().find("i").length == 0) {
			if ($('#btnbutton button', parent.document).attr("disabled") != 'disabled') {
				$('#btnbutton', parent.document).click();
			}
		}
		else {
			$(':focus').parent().find("i").click();
		}
		*/
	}
});

function formview(obj) {
	if (obj == undefined) {
		$('#vpeditform').attr("iid", 0);
		oformview.parseEl('新建');
	}
	else {
		$('#vpeditform').attr("iid", obj.iid);
		$('#vpeditform').attr("iflowtype", obj.iflowtype);
		if (obj.accesslevel != undefined) {
			$('#vpeditform').attr("accesslevel", obj.accesslevel);
		}
		if (obj.smodelid != undefined) {
			$('#vpeditform').attr("ientityid", obj.iflowentityid);
			$('#vpeditform').attr("skey", obj.skey);
		}

		oformview.parseEl("实体->" + obj.sname);
	}
	$('#vpeditform').css({ "position": "fixed", "margin-top": "0px", "z-index": "115" });
	$('#vpeditform').find("#entitytabs .active").click();

	newadd('#vpeditform', 'right');
}

function reload(param) {
	var oparam = {};
	if (typeof (otreetable) != 'undefined') {
		oparam = otreetable.getParam();
	}
	else if (typeof (olisttable) != 'undefined') {
		oparam = olisttable.getParam();
	} else {
		reloadPage(param);
		return;
	}
	var obj = oparam.param;
	for (var key in param) {
		obj[key] = param[key];
	}
	oparam.param = obj;


	if (typeof (otreetable) != 'undefined') {
		otreetable.reload(param);
	}
	else if (typeof (olisttable) != 'undefined') {
		olisttable.reload(param);
	}
}

/*
function treeReload(param) {
	var oparam = otreetable.getParam();
	var obj = oparam.param;
	for(var key in param) {
		obj[key] = param[key];   
    }
	oparam.param = obj;
	vptree(oparam);
}

function listReload(param) {
	var oparam = olisttable.getParam();
	var obj = oparam.param;
	for(var key in param) {
		obj[key] = param[key];   
    }
	oparam.param = obj;
	loadListData(oparam);
}
*/

function doListEvent(obj) {
	var data = obj.data;
	var layEvent = obj.event;
	if (layEvent == 'btnpub') {

	}
	else if (layEvent == 'btnunpub') {

	}
	else {
		formview(data);
	}
}

function addCookie(name, value, expireHours) {
	var cookieString = name + "=" + escape(value);
	//判断是否设置过期时间
	if (expireHours > 0) {
		var date = new Date();
		date.setTime(date.getTime() + expireHours * 24 * 3600 * 1000);
		cookieString = cookieString + ";expires=" + date.toGMTString();
	}
	document.cookie = cookieString;
}

function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		return unescape(arr[2]);
	}
	else {
		return "";
	}
}

function deleteCookie(name) {
	var date = new Date();
	date.setTime(date.getTime() - 10000);
	document.cookie = name + "=v; expires=" + date.toGMTString();
}

function loadLoding() {
	var shtml = '<style>'
		+ '.spinner {'
		+ '  width: 30px;'
		+ '  height: 30px;'
		+ '  position: absolute;  z-index:1000; '
		+ '  margin: 100px auto;'
		+ '}'
		+ '.double-bounce1, .double-bounce2 {'
		+ '  width: 100%;'
		+ '  height: 100%;'
		+ '  border-radius: 50%;'
		+ '  background-color: #2db7f5;'
		+ '  opacity: 0.6;'
		+ '  position: absolute;'
		+ '  top: 0;'
		+ '  left: 0;'
		+ '  -webkit-animation: bounce 2.0s infinite ease-in-out;'
		+ '  animation: bounce 2.0s infinite ease-in-out;'
		+ '}'
		+ '.double-bounce2 {'
		+ '  -webkit-animation-delay: -1.0s;'
		+ '  animation-delay: -1.0s;'
		+ '}'
		+ '@-webkit-keyframes bounce {'
		+ '  0%, 100% { -webkit-transform: scale(0.0) }'
		+ '  50% { -webkit-transform: scale(1.0) }'
		+ '}'
		+ '@keyframes bounce {'
		+ '  0%, 100% {'
		+ '    transform: scale(0.0);'
		+ '    -webkit-transform: scale(0.0);'
		+ '  } 50% {'
		+ '    transform: scale(1.0);'
		+ '    -webkit-transform: scale(1.0);'
		+ '  }'
		+ '}'
		+ '</style>'
		+ '<div class="spinner">'
		+ '  <div class="double-bounce1"></div>'
		+ '  <div class="double-bounce2"></div>'
		+ '</div>';
	document.write(shtml);
}