String.prototype.replaceAll = function(s1,s2) { 
    return this.replace(new RegExp(s1,"gm"),s2); 
}

var Common = {
	//������Ϣ��
	showMessage: function(str){
		alert(str);
	},
	//����ȷ����Ϣ��
	showConfirm: function(str){
		return window.confirm(str);
	},
	//��������
	showWin: function(url, descData){
		var winName = "";	
		var twidth = (screen.availWidth-(Common.Browser.isChrome()?109:100));
		var theight = (screen.availHeight-(Common.Browser.isChrome()?157:100));//
		var str = "top=50,left=50,"+
			"width="+twidth+", " +
			"height="+theight;
		if(descData){
			if(descData.title){
				winName = descData.title;
			}
			if(descData.width && descData.height){
				var left=(window.screen.width-descData.width)/2;
				var top=(window.screen.height-descData.height)/2;
				str = "top="+top+",left="+left+",width="+descData.width+",height="+descData.height;
			}
			if(descData.scroll){
				str+= ",scroll="+(descData.scroll||"no");
			}
		}
		winName = Common.Data.replaceAll(winName, '/', 'A');
		winName = Common.Data.replaceAll(winName, '%', 'A');
		winName = Common.Data.replaceAll(winName, '(', 'A');
		winName = Common.Data.replaceAll(winName, ')', 'A');
		winName = Common.Data.replaceAll(winName, '.', 'A');
		winName = Common.Data.replaceAll(winName, '-', 'A');
		var popWindow = window.open(url,winName,str);
		popWindow.focus();
		return popWindow;
	},
	//���������������֧�ֶ������
	sendFormData: function(url,obj,reFn,data,options) {
		var objClass = "";
		if(obj != undefined){
			objClass = obj.iconCls;
		}
	    var responseData;
	    var async = true;
	    if(options && options.async!==undefined){
	    	async = options.async;
	    }
	    $.ajax({
	        url: url,                               
	        type: 'post',                                                 
	        async: async,
	        data: data,
	        beforeSend: function() {
	        	if(obj != undefined){
	        		obj.setIconClass('button_wait_icon');
	        		try{
	        			with(parent.document.getElementById("wait_div")){
		        			style.width = document.body.clientWidth + 'px';
		        			style.height = document.body.clientHeight + 'px';
		        			className = 'wait_div_style_dis';
	        			}
	        		}catch(e){}
	        	}
	        },
	        complete: function() {
	        	if(obj != undefined){
	        		obj.setIconClass(objClass);
	        		try{
		        		with(parent.document.getElementById("wait_div")){
		        			className = 'wait_div_style';
	        			}
	        		}catch(e){}
	        	}
	        },
	        success: function(json){
	        	try{
	        		if(json.indexOf('ϵͳsession��ʱ')!=-1){
	        			Common.showModalWin("/project/timeOutLogin.jsp", "login", 400, 120, function(res){});
	        			reFn({timeOut:true});
					}else{
						var resObj = json;
		        		
		        		try{
		        			resObj = eval("(" + resObj + ")");
		
		        		}catch(e){}
		        		
		        		reFn(resObj);
					}
	        		
	        		
	        	}catch(e){
	        		alert("����ʱ�ű�����" + e.message);
	        	}
	        },
			error:function(x,t,e){
				if(x.responseText.indexOf('ϵͳsession��ʱ')!=-1){
					Common.showModalWin("/project/timeOutLogin.jsp", "login", 400, 120, function(res){});
					reFn({timeOut:true});
				}
				
			}
	    });
	},
	//���ݸ�ʽ����ش���
	Data: {
		//���ص�ǰʱ�� ��ʽΪ yyyy-MM-dd hh:mm:ss
		getDate: function(){
		    var objDate=new Date();//����һ�����ڶ����ʾ��ǰʱ��

			var dateFmt = "yyyy-MM-dd hh:mm:ss";
			with(objDate){
				var month = getMonth()+1;
				var date = getDate();
				var hours = getHours();
				var minutes = getMinutes();
				var seconds = getSeconds();
		
				if(month < 10){
					month = "0" + month;
				}
				if(date < 10){
					date = "0" + date;
				}
				if(hours < 10){
					hours = "0" + hours;
				}
				if(minutes < 10){
					minutes = "0" + minutes;
				}
				if(seconds < 10){
					seconds = "0" + seconds;
				}
				dateFmt = dateFmt.replace('yyyy', getFullYear());
				dateFmt = dateFmt.replace('MM', month);
				dateFmt = dateFmt.replace('dd', date);
				dateFmt = dateFmt.replace('hh', hours);
				dateFmt = dateFmt.replace('mm', minutes);
				dateFmt = dateFmt.replace('ss', seconds);
			}
		
			return dateFmt;
		},
		//�ж��Ƿ������� �񷵻�false
		isNumber: function(str){
			if(str.match("\^[-]?[0-9]+([.][0-9]*)?\$")){
			       return true;
			}else{
			       return false;
			}
		},
		//�滻�ַ��� str ���滻���ַ��� x ���滻���ַ� y �滻����ַ�
		replaceAll: function(str, x, y){
			while(str.indexOf(x) != -1){
				str = str.replace(x,y);
			}
			return str;
		}
	},
	//���ٲ����е� [xxxxxx] ���ֵ�Ч��
	quickSearchText: function(btn,xxx){
		with(btn){
			if(className == 'inputSearch_empty'){
				value = '';
				className = 'inputSearch_input';
			}else{
				if(trim(value) == ''){
					value = xxx;
					className = 'inputSearch_empty';
				}
			}
		}
	},	
	//���ٲ����е� [xxxxxx] ���ֵ�Ч��
	quickSearchTextByClass: function(btn,xxx,styleName){
		with(btn){
			if(className == styleName + '_empty'){
				value = '';
				className = styleName;
			}else{
				if(trim(value) == ''){
					value = xxx;
					className = styleName + '_empty';
				}
			}
		}
	},
	//��ȡ�ַ������ַ����� ����Ϊ2 Ӣ��Ϊ1
	getCharLen: function getCharLen(str){
		var len = 0;
		for(var i=0;i<str.length;i++){
			if(str.charCodeAt(i) < 255){
				len++;
			}else{
				len+=2;
			}
		}
		return len;
	},
	//���ð�ť������
	buttonDisabled: function(btn){
		var timeId;
		timeId = setInterval(function(){
			if(parent.ToolBar == NULL){
				btn = ToolBar.getButton(btn);
			}else{
				btn = parent.ToolBar.getButton(btn);
			}
			if(btn){
				clearInterval(timeId);
				btn.disable();
			}
		}, 100);
	},
	//���ð�ť������
	buttonDisabled4List: function(btn){
		var timeId;
		timeId = setInterval(function(){
				btn = ListToolBar.getButton(btn);
				if(btn){
					clearInterval(timeId);
					btn.disable();
				}
		}, 100);
	},
	//���ð�ť����
	buttonEnable: function(btn){
		var timeId;
		timeId = setInterval(function(){
			if(parent.ToolBar == NULL){
				btn = ToolBar.getButton(btn);
			}else{
				btn = parent.ToolBar.getButton(btn);
			}
			if(btn){
				clearInterval(timeId);
				btn.enable();
			}
		}, 100);
	},
	//���ð�ť����
	buttonHide: function(btn){
		var timeId;
		timeId = setInterval(function(){
			if(parent.ToolBar == NULL){
				btn = ToolBar.getButton(btn);
			}else{
				btn = parent.ToolBar.getButton(btn);
			}
			if(btn){
				clearInterval(timeId);
				btn.hide();
			}
		}, 100);
	}
}

Common.Browser = (function(){
	var ua = navigator.userAgent.toLowerCase(),
    check = function(r){
        return r.test(ua);
    },
    isChrome = check(/\bchrome\b/),
    isGCF = check(/chromeframe/),
    isOpera = check(/opera/),
    isIE = !isOpera && check(/msie/),
    isIE7 = isIE && check(/msie 7/),
    isIE8 = isIE && check(/msie 8/),
    isIE9 = isIE && check(/msie 9/),
    isIE10 = isIE && check(/msie 10/),
    isFireFox = check(/firefox/),
    isIE6 = isIE && !isIE7 && !isIE8 && !isIE9 && !isIE10;

	this.isFireFox = function (){
		return isFireFox;
	}
	this.isChrome = function (){
		return isChrome;
	}
	this.isIE10 = function (){
		return isIE10;
	}
	this.isGCFInstalled = function(){
		return isGCF;
	}
	this.isIE = function(){
		return isIE;
	}
	return this;
})();

//��action�������� ������Ϣ
function sendData(url,data){
	var xmlhttp;
   if(navigator.userAgent.indexOf("MSIE")>0){
	   xmlhttp = new ActiveXObject("MSXML2.XMLHTTP");
   }else{
	   xmlhttp=new XMLHttpRequest();
   }
   try{
      xmlhttp.open("POST", url ,false);//ͬ����������
      //xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      //xmlhttp.setRequestHeader("Content-Length",data.length);
      xmlhttp.send(data);
      res = xmlhttp.responseText;
      return res;
   }catch(e){
      alert("���ӷ������쳣��\n"+e.name+"\n"+e.message);
   }
}

//���Cookie
//�ú�������3��������cookie���ƣ�cookieֵ���Լ��ڶ���Сʱ����ڡ�
//����Լ��expireHoursΪ0ʱ���趨����ʱ�䣬����������ر�ʱcookie�Զ���ʧ��
function addCookie(name,value,expireHours){
      var cookieString=name+"="+escape(value);
      //�ж��Ƿ����ù���ʱ��
      if(expireHours>0){
             var date=new Date();
             date.setTime(date.getTime() + expireHours * 24 * 3600 * 1000);
             cookieString=cookieString+";expires="+date.toGMTString();
      }
      document.cookie=cookieString;
}
//��ȡָ�����Ƶ�cookieֵ
//�ú�����������Ϊname��cookieֵ������������򷵻ؿ�
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)) {
        return unescape(arr[2]); 
	}
    else {
        return ""; 
	}
}
//ɾ��ָ�����Ƶ�cookie\
//�ú�������ɾ��ָ�����Ƶ�cookie����ʵ�����£�
function deleteCookie(name){
       var date=new Date();
       date.setTime(date.getTime()-10000);
       document.cookie=name+"=v; expires="+date.toGMTString();
}

function doClose() {
	try{
	   dialog.close();
	}catch(e){
		cwindow.close();
	}
}

function doClose1() {
	try{
		cwindow.close();// dialog.close();
	}catch(e){
		cwindow.close();
	}
}



function btnMove(o) {
}
function btnOut(o) {
}

Common.WBS = (function(){
	var MENU_CFG_FILENAME_STD = "wbs_task_std";
	var MENU_CFG_FILENAME_2ND = "wbs_task_2nd";
	var MENU_CFG_FILENAME_STD2 = "wbs_task_std2";//�������ʽΪ��MS PROJECT
	var MENU_CFG_FILENAME_2ND2 = "wbs_task_2nd2";//�������ʽΪ��MS PROJECT
	var concatParams = function(obj, token){
		var paramsStr = ""; 
		if(obj==undefined)return paramsStr;
		if(token==undefined)token = ",";
		for(var f in obj){
			paramsStr += f+"="+(obj[f]==undefined?"":obj[f])+token;
		}
		if(paramsStr.length>0){
			paramsStr = paramsStr.substring(0, paramsStr.length-token.length);
		}
		return paramsStr;
	}
	var getUrl = function(entityId, taskId, fileName, selectedItem, rightUrl, params){
		if(!selectedItem)selectedItem="20";
		var params = concatParams(params, ";")+";selectItemID="+selectedItem;
		var url = "/project/vframe/openWindowAction.do"+
			"?entityId="+entityId+"&wbsObjId="+taskId+"&fileName="+fileName+"&selectItemID="+selectedItem+"&params="+params;
		if(rightUrl){
		}
		return url;
	}
	var aaa = "";
	var openWin = function(title, url){
		if (parent.parent.parent.dialog == undefined) {
			parent.dialog.openWBS('WBS��ϸ-->'+title, url);
		}
		else {
			parent.parent.parent.dialog.openWBS('WBS��ϸ-->'+title, url);
		}
	}
	this.openStdWin = function(pptype,entityId, taskId, rightUrl, params, selectedItem){
		var url = getUrl(entityId, taskId, MENU_CFG_FILENAME_STD, selectedItem, rightUrl, params);
		if(pptype=='0'){
			url = getUrl(entityId, taskId, MENU_CFG_FILENAME_STD2, selectedItem, rightUrl, params);
		}
		openWin(params.taskname, url + "&stype=tabs");
	}
	this.open2ndWin = function(pptype,entityId, taskId, rightUrl, params, selectedItem){
		var url = getUrl(entityId, taskId, MENU_CFG_FILENAME_2ND, selectedItem, rightUrl, params);
		if(pptype=='0'){
			url = getUrl(entityId, taskId, MENU_CFG_FILENAME_2ND2, selectedItem, rightUrl, params);
		}
		openWin(params.taskname, url + "&stype=tabs");
	}
	return this;
})();

