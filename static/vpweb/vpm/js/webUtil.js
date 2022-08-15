/*
(function(){//chrome下弹出模态窗口后再父页面遮一层蒙版，组织用户操作
	if(!top.initTopFrameMap){//非FrameSet页面
		top.cloud = function(){
			var twin = top.window;
			if(twin.document.body){
				var cloudDiv = twin.document.createElement("div");
				cloudDiv.id = "becloudDiv";
				cloudDiv.className = "becloud-div";
				twin.document.body.appendChild(cloudDiv);
			}
		}
		top.unCloud = function(){
			var twin = top.window;
			if(twin.document.body){
				var cloudDiv = twin.document.getElementById("becloudDiv");
				twin.document.body.removeChild(cloudDiv);
			}
		}
	}else if(!top.initComplete){//frameset页面
		top.initTopFrameMap();
	}
	var ua = navigator.userAgent.toLowerCase();
	if(!/\bchrome\b/.test(ua))return;//非Chrome则不需要初始化
	var showModalDialogFn = window.showModalDialog;
	window.showModalDialog = function(){
		top.cloud();
		var res;
		//alert(arguments[0]);
		var url_ = arguments[0];
		var title_ = '';
		if (url_.indexOf("searchdpt.jsp") != -1) {
			title_ = "选择部门";
			url_ = "/project/share/dept/searchDepartmentMultiple.jsp"
		}
		else if (url_.indexOf("searchproject.jsp") != -1) {
			title_ = "选择项目";
			url_ = ""
		}
		dialog.openQuerySearch(title_, url_);
		//var res = showModalDialogFn.apply(window, arguments);
		top.unCloud();
		return res;
	}
})();
*/
function getright(url){
	document.forms[0].target="right";
	document.forms[0].action=url;
 	document.forms[0].submit();
}   
function get(url){
	document.forms[0].action=url;
 	document.forms[0].submit();
}

function move(flag){
   	var menu = document.getElementById("menu");
	var currentPos = menu.scrollLeft;
	if(flag == "right"){
		currentPos += 50;
	}else{
		currentPos -= 50;
	}
	menu.scrollLeft = currentPos;
}

//document.write("<sc" + "ript type='text/javascript' src='/project/js/tt.js'></scr" + "ipt>");
//将form.submit()方法重写 为了防止多次点击按钮提交相同的请求
//重复提交可能造成数据重复
var submitCode;
try{
   window.onload = onLoad;
}catch(e){
alert(e);
}

function onLoad(){
   try{
      //先将原方法拷贝出来
      submitCode = document.forms[0].submit;
      //重写方法到onSubmit
      document.forms[0].submit = onSubmit;
      //设置按钮工具条宽度
      setButtonBar();
   }catch(e){
//alert('onLoad:'+e);
   }
}
//页面document.forms[0].submit()时会自动调此方法
function onSubmit(){
   //alert("请等待.........");
   try{
      //将原方法恢复
      document.forms[0].submit = submitCode;
   }catch(e){
//alert('onSubmit:'+e);
   }
   //第一次提交
   document.forms[0].submit();
   //提交后 将document.forms[0].submit()方法禁用 只有页面重新刷新后方法才被激活
   //可以保证只提交一次
   document.forms[0].submit = null;
}
//按钮工具条自动适应宽度----------------------------------------------------------------
//重写window.onresize事件
window.onresize = setButtonBar;
//设置按钮工具条宽度
function setButtonBar(){
try{
   //找到按钮工具条的table对象句柄
   var buttonBar;
   var obj = document.getElementsByTagName("table");
   for(var i=0;i<obj.length;i++){
      if(obj[i].background == "/project/images/system/bg_tool.gif"){
         buttonBar = obj[i];
         break;
      }
   }
   buttonBar.width = "100%";

   var bodyWidth = window.document.body.clientWidth;
   var scrollWidth = window.document.body.scrollWidth;

   //如果当前页面的宽度超出了body的宽度 就以最大的宽度设置按钮工具条宽度
   if(window.document.body.scrollWidth > window.document.body.clientWidth){
   	buttonBar.width = window.document.body.scrollWidth;
   }
   //window.status = "body:" + window.document.body.clientWidth + " scroll:" + window.document.body.scrollWidth + " parent:" + parentScrollWidth;
}
catch(e){
//alert('setButtonBar:'+e);
   //网页中没有按钮工具条的table
   //window.status = e.message;
   //window.status = "body:" + window.document.body.clientWidth + " scroll:" + window.document.body.scrollWidth;
}
}


//----------------------------------------------------------------
//控制页面上的一个层的隐藏和显示
//obj 为层对象
//img 为图片对象 可切换图片 不需要切换时参数可不传或随便传
function displayDIV(obj,img){
	if(obj.style.display=="none"){
		obj.style.display="";
		obj.style.position="static";
                try{
                  img.src="/project/images/system/arr_main_001.gif";
                }catch(e){}
	}else{
		obj.style.display="none";
		obj.style.position="absolute";
                try{
		  img.src="/project/images/system/arr_main_002.gif";
                }catch(e){}
	}
}
/**
 * 鼠标离开按钮上时 切换样式
 *
 * @param btn 网页上的按钮对象
 */
function btnOut(btn)
{
  btn.className = "buttonOut";
  btn.blur();
}
/**
 * 鼠标移动到按钮上时 切换样式
 *
 * @param btn 网页上的按钮对象
 */
function btnMove(btn)
{
  btn.className = "buttonMove";
}
/**
 * 完成页面的提交动作
 *
 * @param frameName 提交到哪一层框架的框架名字 如果是当前页时使用_self 如果是父框架使用_parent
 * @param url 提交的url
 */
function toSubmit(frameName,url){
   document.forms[0].target=frameName;
   document.forms[0].action=url;
   document.forms[0].submit();
}
//关闭详细信息页签
function hiddenFrame(){
   try{
   var obj=top.right.functionPage;
   obj.document.all("mainFrame").cols="*,0"
   }catch(e){}
}
//显示详细信息页签
function showFrame(width){
   try{
   var obj=top.right.functionPage;
   obj.document.all("mainFrame").cols=width+",*";
   }catch(e){}
}
function showFrameUserpanel(cols){
   try{
   var obj=top.right;
   obj.document.all("mainFrame").cols=cols;
   }catch(e){}
}
//向action发送请求 返回信息
function sendData(url,data){
	var xmlhttp;
   if(navigator.userAgent.indexOf("MSIE")>0){
	   xmlhttp = new ActiveXObject("MSXML2.XMLHTTP");
   }else{
	   xmlhttp=new XMLHttpRequest();
   }
   try{
      xmlhttp.open("POST", url ,false);//同步发送数据
      //xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      //xmlhttp.setRequestHeader("Content-Length",data.length);
      xmlhttp.send(data);
      res = xmlhttp.responseText;
      return res;
   }catch(e){
      alert("连接服务器异常：\n"+e.name+"\n"+e.message);
   }
}
//添加Cookie
//该函数接收3个参数：cookie名称，cookie值，以及在多少小时后过期。
//这里约定expireHours为0时不设定过期时间，即当浏览器关闭时cookie自动消失。
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
//获取指定名称的cookie值
//该函数返回名称为name的cookie值，如果不存在则返回空
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)) {
        return unescape(arr[2]); 
	}
    else {
        return ""; 
	}
	/*
      var strCookie=document.cookie;
      var arrCookie=strCookie.split("; ");
      for(var i=0;i<arrCookie.length;i++){
            var arr=arrCookie[i].split("=");
            if(arr[0]==name)return arr[1];
      }
      return "";
	  */
}
//删除指定名称的cookie\
//该函数可以删除指定名称的cookie，其实现如下：
function deleteCookie(name){
       var date=new Date();
       date.setTime(date.getTime()-10000);
       document.cookie=name+"=v; expires="+date.toGMTString();
}

function insertControl(cls, w, h,id) {
      var str = '';
          str += '<object  id ="' + id + '" width="'+ w +'" height="'+ h +'" classid="clsid:' + cls + '">';
          str += '</object>';
      document.write(str);
}

function insertControlTree(cls,w, h,id,frozen) {
   var para = '';
   //是否锁定列
   if(frozen != undefined){
      para = '<param name="setFrozen" value="'+frozen+'" />';
   }
      var str = '';
          str += '<object  id ="' + id + '" width="'+ w +'" height="'+ h +'" classid="clsid:' + cls + '">';
          str += '<param name="AllowDrag" value="false" />'+para+'</object>';
      document.write(str);
}

//function insertControlTree(cls, w, h,id) {
//      var str = '';
//          str += '<object  id ="' + id + '" width="'+ w +'" height="'+ h +'" classid="clsid:' + cls + '">';
//          str += '<param name="AllowDrag" value="false" /></object>';
//      document.write(str);
//}

function toNumber(num,offset){
   number = new Number(num);
   if(offset == undefined){
      return number.toFixed(2);
   }else{
      return number.toFixed(offset);
   }
}
function trim(str){  //删除左右两端的空格
	 return str.replace(/(^\s*)|(\s*$)/g, "");
	}
	function ltrim(str){  //删除左边的空格
	 return str.replace(/(^\s*)/g,"");
	}
	function rtrim(str){  //删除右边的空格
	 return str.replace(/(\s*$)/g,"");
	}

//window.location.hash=Math.random()*10000;

//var oDiv=document.createElement("script");
//oDiv.setAttribute("src","/project/js/jquery-latest.js");
//document.appendChild(oDiv);

//$(function(){
//	alert('js');
//});

String.prototype.replaceAll  = function(s1,s2){   
return this.replace(new RegExp(s1,"gm"),s2);   
}
Date.prototype.format = function(format) //author: meizz 
{ 
  var o = { 
    "M+" : this.getMonth()+1, //month 
    "d+" : this.getDate(),    //day 
    "h+" : this.getHours(),   //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter 
    "S" : this.getMilliseconds() //millisecond 
  } 
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1, 
    (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o)if(new RegExp("("+ k +")").test(format)) 
    format = format.replace(RegExp.$1, 
      RegExp.$1.length==1 ? o[k] : 
        ("00"+ o[k]).substr((""+ o[k]).length)); 
  return format; 
}
function DateAdd(interval,number,date){
number = parseInt(number);
if (typeof(date)=="string"){
    date=date.replaceAll('-','/');
	date = new Date(date.replaceAll('-','/'));
}
switch(interval){
case "y": date.setFullYear(date.getFullYear()+number); break;
case "m": date.setMonth(date.getMonth()+number); break;
case "d": date.setDate(date.getDate()+number); break;
case "w": date.setDate(date.getDate()+7*number); break;
case "h": date.setHours(date.getHour()+number); break;
case "n": date.setMinutes(date.getMinutes()+number); break;
case "s": date.setSeconds(date.getSeconds()+number); break;
case "l": date.setMilliseconds(date.getMilliseconds()+number); break;
} 
return date.format('yyyy-MM-dd');
}




function Map() {   
 var struct = function(key, value) {   
  this.key = key;   
  this.value = value;   
 }   
    
 var put = function(key, value){   
  for (var i = 0; i < this.arr.length; i++) {   
   if ( this.arr[i].key === key ) {   
    this.arr[i].value = value;   
    return;   
   }   
  }   
   this.arr[this.arr.length] = new struct(key, value);   
 }   
    
 var get = function(key) {   
  for (var i = 0; i < this.arr.length; i++) {   
   if ( this.arr[i].key === key ) {   
     return this.arr[i].value;   
   }   
  }   
  return null;   
 }   
    
 var remove = function(key) {   
  var v;   
  for (var i = 0; i < this.arr.length; i++) {   
   v = this.arr.pop();   
   if ( v.key === key ) {   
    continue;   
   }   
   this.arr.unshift(v);   
  }   
 }   
    
 var size = function() {   
  return this.arr.length;   
 }   
    
 var isEmpty = function() {   
  return this.arr.length <= 0;   
 }   
  
 this.arr = new Array();   
 this.get = get;   
 this.put = put;   
 this.remove = remove;   
 this.size = size;   
 this.isEmpty = isEmpty;   
} 

 function   sleep(n)   
      {   
          var   start=new   Date().getTime();   
          while(true)   if(new   Date().getTime()-start>n)   break;   
      } 
      
     
//重写event，以便支持firefox---------------------------------------------
 function __firefox(){
	 if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){ //如果是Firefox，则加入下面的属性和方法
		 try{
			 HTMLElement.prototype.__defineGetter__("runtimeStyle", __element_style);
		     window.constructor.prototype.__defineGetter__("event", __window_event);
		     Event.prototype.__defineGetter__("srcElement", __event_srcElement);
		     HTMLElement.prototype.__defineGetter__("innerText", __DOM_innerText);
		     HTMLElement.prototype.__defineSetter__("innerText", __DOM_innerTextSet);
		 }catch(e){
			 
		 }
	 } 
 }
 function __DOM_innerText(){
 	return this.textContent;
 }
 function __DOM_innerTextSet(l){
 	return this.textContent = l;
 }
 function __element_style(){
     return this.style;
 }
 function __window_event(){
     return __window_event_constructor();
 }
 function __event_srcElement(){
     return this.target;
 }
 function __window_event_constructor(){
     if(document.all){
         return window.event;
     }
     var _caller = __window_event_constructor.caller;
     while(_caller!=null){
         var _argument = _caller.arguments[0];
         if(_argument){
             var _temp = _argument.constructor;
             if(_temp.toString().indexOf("Event")!=-1){
                 return _argument;
             }
         }
         _caller = _caller.caller;
     }
     return null;
 }
 if(window.addEventListener){
     __firefox();
 }
 //重写event结束---------------------------------------------     
 // 流程中查看IT需求和业务需求详细方法
 function doMoreInfo(event,entityId,entityInsId,entityInsName,flowId,flowInsId,stepId,stepInsId) {
	if (entityId == 212 || entityId == 211) {
		var srtn = sendData("/project/vn/manager/contentsAction.do?sdo=getReqStoreID&objectID="
				+entityInsId+"&objectType="+entityId);
		var url = "/project/vframe/openWindowAction.do?winTitle="+srtn.split(",")[1]+"&topFrame=objTitle="
			+srtn.split(",")[1]+";objName="+entityInsName+";objType=信息;objIcon=52R2.png"
			+ "&leftFrame=fileName=demandinfo"+entityId+";objectID="+entityId+";projectID=;workItemID="+entityInsId
			+ ";loadextramenu=1;display=1;start=1;limit=50;rtype=1;iid="+entityInsId+";eid="+entityId;
		url += "&rightFrame=/project/vn/manager/demandInfoToolbarAction.do?objectID="+entityId
			+ ";projectID=;workItemID="+entityInsId+";libraryID="+srtn.split(",")[0]+";reqId="+entityInsId
			+ ";channel=mainPage;fromType=mywork;";	
		Common.showWin(url);
	}
}


String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g,"");
}