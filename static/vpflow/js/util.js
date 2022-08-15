$.fn.serializeJSON = function()
{
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
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

//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
//清除cookie
function clearCookie(name) {
    setCookie(name, "", -1);
}

function getVpwebPath(){
	return "http://localhost/vpweb/";
}

function getRootPath() {
    var pathName = document.location.pathname;   
    var result = "/" + pathName.split("/")[1];   
    return result;
} 


function vpAjax(url, param, type, callback) {
	console.log(getRootPath() + url);

	if (url.indexOf("http")<0) {
		url = getRootPath() + url;
	}

	$.ajax({  
		type: type || 'GET', 
		url: url,
		headers:{
			Authorization:'Bearer '+localStorage.getItem('access_token'),
			Locale:'zh_CN'
		},
		data: param || {}, 
		async: false, //false代表只有在等待ajax执行完毕后才执行,默认是true
		dataType: "json", 
		success: function(rst, status, xhr) {
			console.log(rst);
			if (rst.data != undefined && jQuery.isFunction(callback)) {
				callback.call(this, rst.data);
			}
			else {
				layer.msg(rst.msg, { icon: 2, time: 3000 });
			}
		},
		complete: function(xhr, status) {
		},
		error: function(xhr, status, res) {
			try
			{				
				var data = eval('['+xhr.responseText+']')[0];
				var smsg = "";
				if (data.infocode == undefined) {
					smsg = data.exception;
				}
				else {
					smsg = data.infocode + "：" + data.msg;	
				}
				layer.msg(smsg, { icon: 2, time: 3000 });
			}
			catch (e)
			{
				layer.msg("无法解析的错误信息", { icon: 2, time: 3000 });
			}
		}
	});
}

function vpPostAjax(url, param, type, callback) {
	vpAjax(url, { sparam : JSON.stringify(param) }, "POST", callback);
}