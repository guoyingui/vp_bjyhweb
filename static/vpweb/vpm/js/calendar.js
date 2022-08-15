/*
var obj;
var start_date;
var end_date;
var message="";
*/
/*
date_obj:显示选择日期值的控件的对象名称
date1:进行比较的第一个日期的对象名称
date2:进行比较的第二个日期的对象名称
msg:当日期比较失败时提示的信息

日期比较的规则为date1不能大于date2

如果没有比较时 前3个参数相同 msg="" 即可

例:
使用时将calendar.js加载到页面中 调用showCalendar方法把相应的参数传入即可

start_date 为开始日期
end_date 为结束日期

<input type="text" name="start_date"><img src="date_ico.gif" onclick="showCalendar(start_date,start_date,end_date,'开始日期不能大于结束日期!')">
<input type="text" name="end_date"><img src="date_ico.gif" onclick="showCalendar(end_date,start_date,end_date,'结束日期不能小于开始日期!')">
*/
var Utils = {
	replaceAll: function(str, sOld, sNew){
		while(str.indexOf(sOld)>0){
			str = str.replace(sOld, sNew);
		}
		return str;
	},
	bindEvent: function(obj, str, fn){
		str = str.replace(/^on/, "");
		if(obj.addEventListener){
			obj.addEventListener(str, fn, false)
		}else{
			obj.attachEvent("on"+str, fn);
		}
	},
	getScrollTop : function(){
		var point = {};
		if(typeof window.pageYOffset != 'undefined') {
			point.x = window.pageXOffset;
			point.y = window.pageYOffset;
		}
		// 如果浏览器支持 compatMode, 并且指定了 DOCTYPE, 通过 documentElement 获取滚动距离作为页面和视窗间的距离
		// IE 中, 当页面指定 DOCTYPE, compatMode 的值是 CSS1Compat, 否则 compatMode 的值是 BackCompat
		else if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
			point.x = document.documentElement.scrollLeft;
			point.y = document.documentElement.scrollTop;
		}
		// 如果浏览器支持 document.body, 可以通过 document.body 来获取滚动高度，如果是在ifram里面，用document.body可以获取iframe中滚动条的位置。
		else if(typeof document.body != 'undefined') {
			point.x = document.body.scrollLeft;
			point.y = document.body.scrollTop;
		}
		return point;
	}
}
var Calendar = function(cfg){
	this.init(cfg);
	var me = this;
	Utils.bindEvent(document.body, "mousedown", function(){
		me.hide();
	});
}
Calendar.prototype = {
		createEle: function(){
			var crtEl = function(tag){
				return document.createElement(tag);
			}
			var cb = crtEl("div");
			cb.style.position = "absolute";
			cb.style.top = 0;
			cb.style.left = 0;
			cb.style.zIndex = 100;
			cb.style.border="1px solid #000";
			cb.style.backgroundColor = "#FFF";
			cb.style.display = "none";
			
			var cf = crtEl("iframe");
			cf.scrolling = "no";
			cf.src = "/project/calendar/calendarNew.html";
			cf.width="196px";
			cf.height="191px";
			cf.frameBorder = 0;
			
			cb.appendChild(cf);
			document.body.appendChild(cb);
			
			this.ele = cb;
			this.calendarWin = cf;
		},
		show: function(top, left){
			if(top+180>document.body.clientHeight){
				top = document.body.clientHeight - 180;
			}
			if(left+185>document.body.clientWidth){
				left = document.body.clientWidth - 185;
			}
			var point = Utils.getScrollTop();
			this.ele.style.top = (top + point.y) + "px";
			this.ele.style.left = (left + point.x) + "px"; 
			this.ele.style.display = "";
		},
		hide: function(){
			this.ele.style.display = "none";
		},
		init: function(){
			this.createEle();
		},
		initCalendar: function(dateStr, callBack, scope){
			this.dateStr = dateStr;
			this.callBack = callBack;
			this.scope = scope;
			var timeId;
			var me = this;
			timeId = setInterval(function(){
				var cWin = me.calendarWin.contentWindow;
				if(cWin && cWin.initCalendar){
					clearInterval(timeId);
					timeId = undefined;
					cWin.initCalendar(me.dateStr, me.callBack, me.scope);
				}
			}, 50);
		}
};
var _calendar;
function showCalendar(date_obj,date1,date2,msg){
	/*
	obj=date_obj;
	start_date=date1;
	end_date=date2;
	message=msg;
	var winObj=window.showModalDialog("/project/calendar/calendar.html",window,"dialogheight:195px;dialogWidth:250px;dialogtop:"+event.screenY+";dialogleft:"+event.screenX+";help:no;scroll:no;status:no;")
	*/
	
	//=========new Calendar===========
	var scope = {
		obj: date_obj,
		start_date: date1,
		end_date: date2,
		message: msg,
		callback: function(newDate, calendarInstance){
			var oldVal = this.obj.value;
			this.obj.value = newDate==""?"":calendarInstance.date2Str(newDate);
			if(this.start_date!=undefined && this.start_date!="" && this.start_date.value!="" 
					&& this.end_date!=undefined && this.end_date!="" && this.end_date.value!=""
					&& Utils.replaceAll(this.start_date.value, "-", "")/1 > Utils.replaceAll(this.end_date.value, "-", "")/1){
				alert(this.message);
				this.obj.value = oldVal;
				calendarInstance.setSelectedDate(oldVal==""?undefined:calendarInstance.str2Date(oldVal));
				calendarInstance.drawCalendar();
				return;
			}
			var onPropertyChangeFn =this.obj.getAttribute("onpropertychange");
			var onChangeFn =this.obj.onchange;
			if(typeof onPropertyChangeFn == "string"){
				eval(onPropertyChangeFn);
			}
			if(typeof onChangeFn == "function"){
				onChangeFn();
			}
			if(window.changeCalendar){
				changeCalendar(this.obj);
			}
			_calendar.hide();
		}
	};
	if(!_calendar){
		_calendar = new Calendar();
	}
	_calendar.initCalendar(date_obj.value, scope.callback, scope);
	var left = event.clientX;
	var top = event.clientY;
	window.setTimeout(function(){
		_calendar.show(top, left);
	},50);
}
