/*
var obj;
var start_date;
var end_date;
var message="";
*/
/*
date_obj:��ʾѡ������ֵ�Ŀؼ��Ķ�������
date1:���бȽϵĵ�һ�����ڵĶ�������
date2:���бȽϵĵڶ������ڵĶ�������
msg:�����ڱȽ�ʧ��ʱ��ʾ����Ϣ

���ڱȽϵĹ���Ϊdate1���ܴ���date2

���û�бȽ�ʱ ǰ3��������ͬ msg="" ����

��:
ʹ��ʱ��calendar.js���ص�ҳ���� ����showCalendar��������Ӧ�Ĳ������뼴��

start_date Ϊ��ʼ����
end_date Ϊ��������

<input type="text" name="start_date"><img src="date_ico.gif" onclick="showCalendar(start_date,start_date,end_date,'��ʼ���ڲ��ܴ��ڽ�������!')">
<input type="text" name="end_date"><img src="date_ico.gif" onclick="showCalendar(end_date,start_date,end_date,'�������ڲ���С�ڿ�ʼ����!')">
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
		// ��������֧�� compatMode, ����ָ���� DOCTYPE, ͨ�� documentElement ��ȡ����������Ϊҳ����Ӵ���ľ���
		// IE ��, ��ҳ��ָ�� DOCTYPE, compatMode ��ֵ�� CSS1Compat, ���� compatMode ��ֵ�� BackCompat
		else if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
			point.x = document.documentElement.scrollLeft;
			point.y = document.documentElement.scrollTop;
		}
		// ��������֧�� document.body, ����ͨ�� document.body ����ȡ�����߶ȣ��������ifram���棬��document.body���Ի�ȡiframe�й�������λ�á�
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
