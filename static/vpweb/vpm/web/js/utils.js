String.prototype.replaceAll = function(s1,s2){ 
	return this.replace(new RegExp(s1,"gm"),s2); 
}

function addCookie(name,value,expireHours){
	var cookieString=name+"="+escape(value);
	//判断是否设置过期时间
	if(expireHours>0){
		var date=new Date();
		date.setTime(date.getTime() + expireHours * 24 * 3600 * 1000);
		cookieString=cookieString+";expires="+date.toGMTString();
	}
	document.cookie=cookieString;
}

function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)) {
		return unescape(arr[2]); 
	}
	else {
		return ""; 
	}
}

function deleteCookie(name){
	var date=new Date();
	date.setTime(date.getTime()-10000);
	document.cookie=name+"=v; expires="+date.toGMTString();
}

function loadScript(url, callback) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	if(typeof(callback) != "undefined"){
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

function loadData(url, callback) {
	$.ajax({  
		type: "GET", 
		url: url,
		data: {}, 
		async: true, 
		dataType: "json", 
		success: function(data) {
			try	{
				if(typeof(callback) != "undefined") {
					callback(data);
				}
			}
			catch (e) {
				alert("解析错误:"+e);
			}
		},
		error: function(ht) {  
			 debugger;
			if (ht.responseText.indexOf("session") == 29) {
				alert("系统超时，请重新登录");  
				parent.parent.parent.location = "/project/";
			}
			else {
				alert("系统错误，请重试");  
			}
		}
	});
}

function formIsChangle(form) {
  for (var i = 0; i < form.elements.length; i++) {
    var element = form.elements[i];
    var type = element.type;
    if (type == "checkbox" || type == "radio") {
      if (element.checked != element.defaultChecked) {
        return true;
      }
    }
    else if (type == "hidden" || type == "password" ||
             type == "text" || type == "textarea") {
      if (element.value != element.defaultValue) {
        return true;
      }
    }
    else if (type == "select-one" || type == "select-multiple") {
      for (var j = 0; j < element.options.length; j++) {
        if (element.options[j].selected !=
            element.options[j].defaultSelected) {
          return true;
        }
      }
    }
  }
  return false;
}

var msg = {
	//弹出消息框
	showMessage: function(str){
		alert(str);
	},
	//弹出确认消息框
	showConfirm: function(str){
		return window.confirm(str);
	}
}