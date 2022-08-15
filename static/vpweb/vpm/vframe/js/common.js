
//向服务器发送请求，支持多浏览器
function sendData(url) {
	
    var responseData;
    $.ajax({
        url: url,                               
        type: 'post',                                                 
        async: false,
        global: true,
        beforeSend: function() {
        },
        complete: function() {
        },
        success: function(json) { responseData = json; }
    });

    return responseData;
}
var Common = {
	//弹出消息框
	showMessage: function(str){
		alert(str);
	},
	//弹出确认消息框
	showConfirm: function(str){
		return window.confirm(str);
	},
	// 弹出全屏层窗口
	showFullLayer: function (url, winTitle) {
		if (top.document.getElementById('barFrame') != null || top.document.getElementById('barFrame') != undefined) {
			try	{
				top.document.getElementById('top').contentWindow.lock();
				top.document.getElementById('barFrame').contentWindow.lock();
			}
			catch (e) {
			}
		}
		var twidth = document.body.clientWidth - 4;
		var theight = document.body.clientHeight - (Common.Browser.isChrome()?98:44);
		var img = '<img src="/project/vframe/dialog/edit.ico.png" style="position: relative; margin-right: 2px; vertical-align: middle; height: 24px;"/>';
		JqueryDialog.Open(img+winTitle, url, twidth, theight);
	},
	// 弹出层窗口
	showLayer: function (url, winTitle) {
		var twidth = (screen.availWidth-(Common.Browser.isChrome()?(109+100):(100+130)));
		var theight = (screen.availHeight-(Common.Browser.isChrome()?(157+106):(100+133)));
		var img = '<img src="/project/vframe/dialog/edit.ico.png" style="position: relative; margin-right: 2px; vertical-align: middle; height: 24px;"/>';
		JqueryDialog.Open(img+winTitle, url, twidth, theight);
	},
	// 弹出层窗口
	showCustLayer: function (url, winTitle, twidth, theight) {
		var img = '<img src="/project/vframe/dialog/zoom.png" style="position: relative; margin-right: 2px; vertical-align: middle; height: 24px;"/>';
		JqueryDialog.Open(img+winTitle, url, twidth, theight, 70, 50);
	},
	// 弹出层窗口
	showCustLayer: function (url, winTitle, twidth, theight, top, left) {
		var img = '<img src="/project/vframe/dialog/zoom.png" style="position: relative; margin-right: 2px; vertical-align: middle; height: 24px;"/>';
		JqueryDialog.Open(img+winTitle, url, twidth, theight, top, left);
	},
	// 弹出层窗口
	showCustLayer: function (url, winTitle, twidth, theight, top, left, type) {
		var img = "";
		if (type == 1) {
			img = '<img src="/project/vframe/dialog/edit.ico.png" style="position: relative; margin-right: 2px; vertical-align: middle; height: 24px;"/>';
		}
		else {
			img = '<img src="/project/vframe/dialog/zoom.png" style="position: relative; margin-right: 2px; vertical-align: middle; height: 24px;"/>';
		}
		JqueryDialog.Open(img+winTitle, url, twidth, theight, top, left);
	},
	//弹出窗口
	showWin: function(url, descData){
		var winName = "";	//encodeURIComponent(url);
//		var twidth = (screen.availWidth-(Common.Browser.isChrome()?9:0));
//		var theight = (screen.availHeight-(Common.Browser.isChrome()?57:0));
		var twidth = window.screen.availWidth-10;//(screen.availWidth-(Common.Browser.isChrome()?109:100));
		var theight = window.screen.availHeight-60;//(screen.availHeight-(Common.Browser.isChrome()?157:100));//
		var str = "top=0,left=0,"+
			"width="+twidth+", " +
			"height="+theight;
		if(descData){
			if(descData.title){
				winName = descData.title;
			}
			if(descData.width && descData.height){
				var left=0;//(window.screen.width-descData.width)/2;
				var top=0;//(window.screen.height-descData.height)/2;
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
	//弹出窗口
	showFullWin: function(url, descData){
		var winName = "";	//encodeURIComponent(url);
//		var twidth = (screen.availWidth-(Common.Browser.isChrome()?9:0));
//		var theight = (screen.availHeight-(Common.Browser.isChrome()?57:0));
		var twidth = screen.availWidth;//(screen.availWidth-(Common.Browser.isChrome()?109:100));
		var theight = screen.availHeight;//(screen.availHeight-(Common.Browser.isChrome()?157:100));//
		var str = "top=0px,left=0px,"+
			"width="+twidth+"px, " +
			"height="+theight+"px";
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
	showNewProject:function(url,objName){
		if(parent.parent.parent.location.href.indexOf("index.jsp")!=-1){
			parent.parent.parent.parent.dialog.openFull("项目-->"+objName, url);
		}else{
			parent.dialog.openFull("项目-->"+objName, url);
		}
	},
	//弹出模态窗口
	openModalWin: function(data){
		if(this.getVer().ie == '6.0' && data.y){
			data.y += 33;
		}
		var res = window.showModalDialog(
				data.url,
				data.para,
				"dialogWidth="+(data.x||300)+"px; "+
				"dialogHeight="+(data.y||400)+"px; "+
				"status=no; help=no;"+
				"scroll="+(data.scroll||"no")
		);
		if(data.handle){
			data.handle(res);
		}
		return res;
	},
	//弹出模态窗口
	showModalWin: function(url,para,x,y, handle){
		return this.openModalWin({
			url: url,
			para: para,
			x: x,
			y: y,
			handle: handle
		});
	},
	showModalWinYes: function(url,para,x,y, handle){
		return this.openModalWin({
			url: url,
			para: para,
			x: x,
			y: y,
			handle: handle,
			scroll: "yes"
		});
	},
	/**
	 * 用open弹出窗口模拟模态窗口，使用方法与showModalWin相似
	 * 区别之一是，弹出窗口最顶层使用公共框架，参数url所引用的页面被嵌入到
	 * 框架页面内的iframe元素内，因此top属性实际引用的window对象是公共框
	 * 架，使用需注意。
	 * 区别之二是，弹出窗口中，一定要在页面完全加载完才能使用
	 * window.dialogArgument, window.returnValue和window.close();
	 * 或者直接使用top.dialogArgument, top.returnValue和top.close();
	 * 区别之三是，禁止使用top.location.reload()和top.location="xx"等刷新
	 * 整个窗口的行为（可以submit，window.location.reload()等刷新
	 * 内层iframe的方法）。
	 */
	showModalWin2: function (url,para,x,y,handle){
		if(Common.Browser.isIE()){
			return Common.showModalWin(url, para, x, y, handle);
		}
		var frameUrl = "/project/vframe/openModalFrame.jsp";
		var winInfo = {win: undefined, close: false, returnValue: undefined};
		winInfo.win = Common.showWin(frameUrl+"?FRAMEcontentUrlFRAME="+url, {width: x, height: y});
		winInfo.win.dialogArguments = para;

		//初始化弹出窗口
		var initTimeId
		initTimeId = setInterval(function(){
			if(winInfo.win.init){
				clearInterval(initTimeId);
				winInfo.win.init.call(winInfo.win);
			}
		},50);
		
		//Div层遮住父页面
		var cloudTime = {time: 0};
		cloudTime.timeId = setInterval(function(){
			if(top.cloud){
				clearInterval(cloudTime.timeId);
				top.cloud();
			}else if(cloudTime.time++>200){//设置10秒后超时
				clearInterval(cloudTime.timeId);
			}
		}, 50);
		
		//关闭弹出窗口后的回调函数，data为窗口返回值，通过top.returnValue=XXX设置
		var handleFn = function(data){
			if(top.unCloud){
				top.unCloud();
			}
			if(handle){
				handle(data);
			}
		}
		
		//弹出窗口关闭时执行
		Common.bindEvent(winInfo.win, "beforeunload", function(){
			winInfo.closed = true;
			winInfo.returnValue = winInfo.win.returnValue;
		});
		
		//监听弹出窗口是否关闭，监听程序没有放在beforeunload里是因为
		//调用handleFn的线程应是父页面的脚本线程
		var timeId;
		timeId = setInterval(function(){
			if(winInfo.closed){
				clearInterval(timeId);
				handleFn(winInfo.returnValue);
			}
		}, 50);
	},
	//添加左侧菜单点击后的url参数 xxx.jsp?key=value
	addMenuUrlPara: function(key,value){
		functionPageFrame = top.frames["menuFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["menuFrame"];
	  	}else{
	   	    functionPageFrame = top.document.getElementById("menuFrame").contentWindow;
	   	}
	   	*/
	   	if (functionPageFrame != undefined) {
	   		functionPageFrame.bar.addUrlPara(key,value);
		}
	},
	//删除左侧菜单点击后的url参数 只对addMenuUrlPara添加的参数有效
	delMenuUrlPara: function(key){
		functionPageFrame = top.frames["menuFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["menuFrame"];
	  	}else{
	   	    functionPageFrame = top.document.getElementById("menuFrame").contentWindow;
	   	}
	   	*/
	   	if (functionPageFrame != undefined) {
	   		functionPageFrame.bar.delUrlPara(key);
		}
	},
	//清空左侧菜单点击后的url参数 只对addMenuUrlPara添加的参数有效
	clearMenuUrlPara: function(){
		functionPageFrame = top.frames["menuFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["menuFrame"];
	  	}else{
	   	    functionPageFrame = top.document.getElementById("menuFrame").contentWindow;
	   	}
	   	*/
	   	if (functionPageFrame != undefined) {
	   		functionPageFrame.bar.clearUrlPara();
		}
	},
	//设置左侧菜单的选中状态 参数 itemID 对应xml中的菜单项ID
	selectMenuItem: function(itemID){
		functionPageFrame = top.frames["menuFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["menuFrame"];
	  	}else{
	   	    functionPageFrame = top.document.getElementById("menuFrame").contentWindow;
	   	}
	   	*/
	   	if (functionPageFrame != undefined) {
	   		functionPageFrame.bar.selectItem(itemID);
		}
	},
	//设置左侧导航的选中状态 参数 itemID 对应xml中的菜单项ID
	selectNavItem: function(itemID){
		functionPageFrame = top.frames["barFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["barFrame"];
	  	}else{
	   	    functionPageFrame = top.document.getElementById("barFrame").contentWindow;
	   	}
	   	*/
	   	if (functionPageFrame != undefined) {
	   		functionPageFrame.bar.selectItem(itemID);
		}
	},
	//展开备注中的文本 obj：点击的th，textObj：备注的id
	showText: function(obj,textObj){
		textObj = document.getElementById(textObj);
		
		var childObj = document.getElementsByTagName('div');
		for(var i=0;i<childObj.length;i++){
			if(childObj[i].className == 'lableExpand'){
				childObj[i].className = 'lableClose';
				if(this.getOs()=='Firefox'||this.Browser.isChrome){
					textObj.rows = 2;
				}else{
					textObj.style.posHeight = 28;
				}
				break;
			}
			if(childObj[i].className == 'lableClose'){
				if(textObj.scrollHeight < 32){
					return;
				}
				childObj[i].className = 'lableExpand';
				if(this.getOs()=='Firefox'||this.Browser.isChrome){
					textObj.rows = textObj.scrollHeight/15 + 3;
				}else{
					textObj.style.posHeight = textObj.scrollHeight + 30;
				}
				break;
			}
		}
	},
	 getOs:function(){ 
	    var OsObject = ""; 
	   if(navigator.userAgent.indexOf("MSIE")>0) { 
	        return "MSIE"; 
	   } 
	   if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){ 
	        return "Firefox"; 
	   } 
	   if(isSafari=navigator.userAgent.indexOf("Safari")>0) { 
	        return "Safari"; 
	   }  
	   if(isCamino=navigator.userAgent.indexOf("Camino")>0){ 
	        return "Camino"; 
	   } 
	   if(isMozilla=navigator.userAgent.indexOf("Gecko")>0){ 
	        return "Gecko"; 
	   } 
	   if(isMozilla=navigator.userAgent.indexOf("Chrome")>0){ 
	        return "Chrome"; 
	   } 
	},
	//展开/收缩 obj:点击的div对象 divName：展开/收缩的对象id
	displayGroup: function(obj,divName){
		var objArr = obj.getElementsByTagName('div');
		for(var i=0;i<objArr.length;i++){
			if(objArr[i].className == 'formgroup_icon_hidden'){
				objArr[i].className = 'formgroup_icon_visible';
				break;
			}
			if(objArr[i].className == 'formgroup_icon_visible'){
				objArr[i].className = 'formgroup_icon_hidden';
				break;
			}
		}
		
		var objGroup = document.getElementById(divName);
		if(objGroup.style.display == undefined || objGroup.style.display == ''){
			objGroup.style.display = 'none';
		}else{
			objGroup.style.display = '';
		}
	},
	//设置左侧菜单是否可用 只对弹出窗口的菜单有效
	setMenuBarDisable: function(isDisable){
		functionPageFrame = top.frames["menuFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["menuFrame"];
	  	}else{
	   	    functionPageFrame = top.document.getElementById("menuFrame").contentWindow;
	   	}
	   	*/
		if (functionPageFrame != undefined) {
	   		functionPageFrame.bar.disable(isDisable);
		}
	},
	//设置左侧菜单是否可用 只对弹出窗口的菜单有效（按ID隐藏）
	setMenuBarDisableForSelectedID: function(isDisable,disableID){
		functionPageFrame = top.frames["menuFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["menuFrame"];
	  	}else{
	   	    functionPageFrame = top.document.getElementById("menuFrame").contentWindow;
	   	}
	   	*/
		if (functionPageFrame != undefined) {
	   		functionPageFrame.bar.disableForSelectedID(isDisable,disableID);
		}
	},
	//设置顶部的当前操作对象名称 只对弹出窗口的当前操作对象有效
	setTitleObjectName: function(str){
		functionPageFrame = top.frames["topFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["topFrame"];
	  	}else{
	   	    functionPageFrame = top.document.getElementById("topFrame").contentWindow;
	   	}
	   	*/
	   	functionPageFrame.document.getElementById("titleObjectName").innerHTML = str;
	},
	//设置顶部的分类名称 只对弹出窗口的分类名称有效 由menuBar自动调用
	setTitleText: function(str){
		functionPageFrame = top.frames["topFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["topFrame"];
	  	}else{
	   	    functionPageFrame = top.document.getElementById("topFrame").contentWindow;
	   	}
	   	*/
	   	functionPageFrame.document.getElementById("titleText").innerHTML = str;
	},
	//刷新左侧菜单 只对弹出窗口的菜单有效
	setMenuBarRefurbish: function(paras){
		functionPageFrame = top.frames["menuFrame"];
		//if(document.all){
		//	functionPageFrame = top.document.frames["menuFrame"];
	  	//}else{
	   	//    functionPageFrame = top.document.getElementById("menuFrame").contentWindow;
	   	//}
		functionPageFrame.location.href="/project/vframe/openWindowMenuAction.do?"+paras.replaceAll(';','&')
		//parent.parent.changeFrameSrc("/project/vframe/openWindowMenuAction.do?"+paras.replaceAll(';','&'));
	},	
	//向服务器发送请求，支持多浏览器
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
	        		if(json.indexOf('系统session超时')!=-1){
	        			//alert("系统超时，操作失败，请重新登录后再次点击按钮操作！" );
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
	        		alert("运行时脚本错误：" + e.message);
	        	}
	        },
			error:function(x,t,e){
				if(x.responseText.indexOf('系统session超时')!=-1){
					//alert("系统超时，操作失败，请重新登录后再次点击按钮操作！" );
					Common.showModalWin("/project/timeOutLogin.jsp", "login", 400, 120, function(res){});
					reFn({timeOut:true});
				}
				
			}
	    });
	},
	//设置右侧的当前操作对象名称和图标，只对非弹出窗口有效，由navigationBar自动调用
	setRightTitle: function(titleText,icon,url){
		if(url != NULL){
		   	//右侧url的设定
		   	if(url != ""){

		   		while(url.indexOf("&") != -1){
		   			url = url.replace("&",",,");
		   		}
		   		if(icon && icon.indexOf("/project/")!=0){
		   			icon = "/project/vframe/images/title/" + icon;
		   		}

				var right=top.document.getElementById("right");
				
				if(right){
					right.src = 'about:blank';
					try{
					    var rightiframe = right.contentWindow;
						rightiframe.document.write('');
						rightiframe.document.clear();
					}catch(e){};
					try{
						top.document.body.removeChild(right);
					}catch(e){};	
				}

				top.document.getElementById("right").src = "/project/titleAction.do?titleText=" + titleText + "&titleIcon=" + icon +"&url=" + url;
				return;
		   	}
		}
	  	var functionPageFrame = "";
	  	var obj;
		functionPageFrame = top.frames["right"].document;
		obj = functionPageFrame.getElementById("btnCustomPage");
		/*
	  	if(document.all){
			functionPageFrame = top.document.frames["right"].document;
			//首页导航时，多了一个[自定义主页]按钮
			obj = top.document.frames["right"].document.getElementById("btnCustomPage");
	
	  	}else{
	   	    functionPageFrame = top.document.getElementById("right").contentWindow.document;
	   	    //首页导航时，多了一个[自定义主页]按钮
	   	    obj = top.document.getElementById("right").contentWindow.document.getElementById("btnCustomPage");
	   	}
	   	*/
	   	//[自定义主页]按钮 显示/隐藏
	  	if(obj != undefined){
			if(titleText == "我的主页"){
				obj.style.display = "";
			}else{
				obj.style.display = "none";
			}
		}
		//设置右侧标题和图片
	   	functionPageFrame.getElementById("titleText").innerHTML = titleText;
	   	if(icon != undefined && icon != '' ){
	   		var str = "<img src='/project/vframe/images/title/" + icon + "' />";
	   		functionPageFrame.getElementById("titleIcon").innerHTML = str;
	   	}else{
	   		functionPageFrame.getElementById("titleIcon").innerHTML = '';
	   	}
	},
	//查找框中的 [输入要查询的内容] 文字的效果
	searchTextChange: function(btn){
		with(btn){
			if(className == 'search_textempty'){
				value = '';
				className = 'search_textinput';
			}else{
				if(trim(value) == ''){
					value = '输入要查询的内容';
					className = 'search_textempty';
				}
			}
		}
	},
	//快速查找中的 [xxxxxx] 文字的效果
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
	//快速查找中的 [xxxxxx] 文字的效果
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
	//设置按钮不可用
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
	//设置按钮不可用
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
	//设置按钮可用
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
	//设置按钮隐藏
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
	},
	//设置按钮菜单显示
	buttonShowMenu: function(btn){
		var timeId;
		timeId = setInterval(function(){
			if(parent.ToolBar == NULL){
				btn = ToolBar.getButton(btn);
			}else{
				btn = parent.ToolBar.getButton(btn);
			}
			if(btn){
				clearInterval(timeId);
				btn.showMenu();
			}
		}, 100);
	},
	//设置按钮菜单隐藏
	buttonHideMenu: function(btn){
		var timeId;
		timeId = setInterval(function(){
			if(parent.ToolBar == NULL){
				btn = ToolBar.getButton(btn);
			}else{
				btn = parent.ToolBar.getButton(btn);
			}
			if(btn){
				clearInterval(timeId);
				btn.hideMenu();
			}
		}, 100);
	},
	//设置按钮显示
	buttonShow: function(btn){
		var timeId;
		timeId = setInterval(function(){
			if(parent.ToolBar == NULL){
				btn = ToolBar.getButton(btn);
			}else{
				btn = parent.ToolBar.getButton(btn);
			}
			if(btn){
				clearInterval(timeId);
				btn.show();
			}
		}, 100);
	},
	//获取浏览器版本 判断浏览器版本只需用if(Sys.ie == '8.0')或if(Sys.firefox == '3.0')等形式
	getVer: function(){
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        //以下进行测试
        //if (Sys.ie) document.write('IE: ' + Sys.ie);
        //if (Sys.firefox) document.write('Firefox: ' + Sys.firefox);
        //if (Sys.chrome) document.write('Chrome: ' + Sys.chrome);
        //if (Sys.opera) document.write('Opera: ' + Sys.opera);
        //if (Sys.safari) document.write('Safari: ' + Sys.safari);
        
        return Sys;
	},
	//添加左侧菜单点击后的url参数 xxx.jsp?key=value
	setMenuOnBeforeSelect: function(handle){
		if(!(handle instanceof Function)){
			throw new Error(-1, "参数必须为Function类型");
		}
		functionPageFrame = top.frames["menuFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["menuFrame"];
	  	}else{
	   	    functionPageFrame = top.document.getElementById("menuFrame").contentWindow;
	   	}
	   	*/
		if (functionPageFrame != undefined) {
	   		functionPageFrame.bar.appendOnBeforeSelect(handle);
		}
	},
	removeMenuOnBeforeSelect: function(){
		functionPageFrame = top.frames["menuFrame"];
		/*
		if(document.all){
			functionPageFrame = top.document.frames["menuFrame"];
		}else{
			functionPageFrame = top.document.getElementById("menuFrame").contentWindow;
		}
		*/
		if (functionPageFrame != undefined) {
	   		functionPageFrame.bar.clearOnBeforeSelect();
		}
	},
	setMenuBeforeClickOpenState: function(open){
		top.beForeClickOpen = open;
	},
	setMenuBeforeClickHandle: function(handle){
		if(!(handle instanceof Function)){
			throw new Error(-1, "参数必须为Function类型！");
		}
		//top.beforeClick = handle;
	},
	bindEvent: function(obj, str, fn){
		str = str.replace(/^on/, "");
		if(obj.addEventListener){
			obj.addEventListener(str, fn, false)
		}else{
			obj.attachEvent("on"+str, fn);
		}
	},
	//数据格式的相关处理
	Data: {
		//返回当前时间 格式为 yyyy-MM-dd hh:mm:ss
		getDate: function(){
		    var objDate=new Date();//创建一个日期对象表示当前时间

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
		//判断是否是数字 否返回false
		isNumber: function(str){
			if(str.match("\^[-]?[0-9]+([.][0-9]*)?\$")){
			       return true;
			}else{
			       return false;
			}
		},
		//替换字符串 str 被替换的字符串 x 被替换的字符 y 替换后的字符
		replaceAll: function(str, x, y){
			while(str.indexOf(x) != -1){
				str = str.replace(x,y);
			}
			return str;
		}
	},
	clickANode: function (aNode) {
		if(aNode.click){
			aNode.click();
		}else if (document.createEvent) {  
			var event = document.createEvent("MouseEvents");  
			event.initMouseEvent("click", true, true, window,  
					0, 0, 0, 0, 0,  
					false, false, false, false,  
					0, null);  
			aNode.dispatchEvent(event);  
		}
	},
	//获取字符串的字符长度 中文为2 英文为1
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
	}
}
Common.WBS = (function(){
	var MENU_CFG_FILENAME_STD = "wbs_task_std";
	var MENU_CFG_FILENAME_2ND = "wbs_task_2nd";
	var MENU_CFG_FILENAME_STD2 = "wbs_task_std2";//任务管理方式为：MS PROJECT
	var MENU_CFG_FILENAME_2ND2 = "wbs_task_2nd2";//任务管理方式为：MS PROJECT
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
//			url += "&rightFrame="+(Common.Data.replaceAll(rightUrl, '&',';'));
		}
		return url;
	}
	var aaa = "";
	var openWin = function(title, url){
		if (parent.parent.parent.dialog == undefined) {
			parent.parent.parent.parent.dialog.openWBS('WBS详细-->'+title, url);
		}
		else {
			if(parent.parent.parent.location.href.indexOf("wbsViewCard")!=-1){
				parent.parent.parent.parent.dialog.openWBS('WBS详细-->'+title, url);
			}else if(parent.parent.location.href.indexOf("tabs.jsp")!=-1){
				parent.parent.dialog.openWBS('WBS详细-->'+title, url);				
			}else if(parent.parent.location.href.indexOf("pjinfos")!=-1){
				parent.parent.dialog.openWBS('WBS详细-->'+title, url);				
			}else{
				parent.parent.parent.dialog.openWBS('WBS详细-->'+title, url);
			}
		}
		/*
		if(Common.Browser.isGCFInstalled()){//在IE用chorme插件下用下边方式打开，如果都用这种方式打开，在chorme的27.0.xxx和28.0.xxx会出错
			var aNode = document.createElement("a");
			aNode.href = url;
			aNode.rel = "noreferrer";
			aNode.target = "_blank";
			aNode.style.display = "none";
			document.body.appendChild(aNode);
			Common.clickANode(aNode);
			document.body.removeChild(aNode);
		}else{
			Common.showWin(url);
		}
		*/
	}
	this.openStdWin = function(pptype,entityId, taskId, rightUrl, params, selectedItem){
		var url = getUrl(entityId, taskId, MENU_CFG_FILENAME_STD, selectedItem, rightUrl, params);
		if(pptype=='0'){
			url = getUrl(entityId, taskId, MENU_CFG_FILENAME_STD2, selectedItem, rightUrl, params);
		}
		openWin(params.taskname, url + "&stype=tabs");
		
//		Common.showWin(url);
	}
	
	this.openStdWinNew = function(pptype,entityId, taskId, rightUrl, params, selectedItem){
		var url = getUrl(entityId, taskId, MENU_CFG_FILENAME_STD, selectedItem, rightUrl, params);
		if(pptype=='0'){
			url = getUrl(entityId, taskId, MENU_CFG_FILENAME_STD2, selectedItem, rightUrl, params);
		}
		var map ={};
		map['tipName']= params.taskname
		parent.parent.cwindow.openNew(url + "&stype=tabs&sfrom=mytask",map);
		
	}
	this.open2ndWin = function(pptype,entityId, taskId, rightUrl, params, selectedItem){
		var url = getUrl(entityId, taskId, MENU_CFG_FILENAME_2ND, selectedItem, rightUrl, params);
		if(pptype=='0'){
			url = getUrl(entityId, taskId, MENU_CFG_FILENAME_2ND2, selectedItem, rightUrl, params);
		}
		openWin(params.taskname, url + "&stype=tabs");
//		Common.showWin(url);
	}
	return this;
})();
Common.Tips = {
	initTip: function (tipId,ctrlWin){
		var tipInitUrl = "/project/mywork/tipsAction.do?sdo=getTipCfg";
		Common.sendFormData(tipInitUrl,undefined,function(res){
			if(!res||!res.success){
				return;
			}
			if(!top.initComplete){
				top.initTopFrameMap();
			}
			ctrlWin.tip = new ctrlWin.Tip(res.data);
			if(res.data.autoPop==1){
				if(ctrlWin.tip){
					ctrlWin.tip.showTip();
				}
			}
		},{tipId:tipId, t:Math.random()});
	}
};
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
		if(ua.indexOf("rv:11.0") !=-1 ){
			return true;
		}
		else {
			return isIE10;
		}
	}
	this.isGCFInstalled = function(){
		return isGCF;
	}
	this.isIE = function(){
		return isIE;
	}
	return this;
})();
Common.concatParams = function(obj, token){
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
Common.changeStr = function(str){
	var chars=["~","!","@","#","$","%","^","&","*","(",")","-","_","+","=","\\","|","[","]","{","}",":",";","\"","\'",",",".","/","<",">","?"];
	var chars2=["~","!","@","＃","$","％","^","&","*","(",")","-","_","+","=","＼","|","[","]","{","}",":","；","\"","\'","，",".","/","<",">","？"];
	var s =str;
	var a = s.split("");
	var b = "";
	for(var i=0;i<a.length;i++){
		var c = "";
		var d = false;
		for(var j=0;j<chars.length;j++){
			if(a[i].indexOf(chars[j])!=-1){
				c = chars2[j];
				d = true;
			}
		}
		if(d){
			b = b+c;
		}else{
			b = b+a[i];
		}
	}
	return b;
}
Common.getObjUrl = (function(){
	var action = "/project/vframe/openWindowAction.do";
	var openObj = function(data){
		var topFrame = "topFrame="
			+"objTitle="+data.objTitle
			+";objName="+data.objName
			+";objIcon="+data.objIcon
			+";objType=";
		var leftFrame = "leftFrame="
			+"fileName="+data.fileName
			+(data.selectItemID?"selectItemID="+data.selectItemID:"")
			+";"+Common.concatParams(data.params, ";");
		return action+"?winTitle="+data.winTitle+"&"+topFrame+"&"+leftFrame+"&rightFrame=";
	}
	return openObj;
})();
Common.getLayerObjUrl = (function(){
	var url = '/project/vocation/workItem/workItemInfoToolbarAction.do';
	var openObj = function(data){
		var leftFrame = "fileName="+data.fileName
			+(data.selectItemID?"selectItemID="+data.selectItemID:"")
			+"&"+Common.concatParams(data.params, "&");
		return url+"?winTitle=&"+leftFrame;
	}
	return openObj;
})();
(function(){
	var numToStr = function(num){
		if(num<10){
			num = "0"+num;
		}else{
			num = ""+num;
		}
		return num;
	}
	var parseDate = function(date){
		var obj = {
			year : date.getFullYear(),
			month : numToStr(date.getMonth()+1),
			date : numToStr(date.getDate()),
			hours : numToStr(date.getHours()),
			minutes : numToStr(date.getMinutes()),
			seconds : numToStr(date.getSeconds())
		}
		return obj;
	}
	Common.Data.formatDate = function(date, pattern){
		if(!date)return "";
		var obj = parseDate(date);
		var res = pattern;
		res = res.replaceAll("yyyy", obj.year);
		res = res.replaceAll("MM", obj.month);
		res = res.replaceAll("dd", obj.date);
		res = res.replaceAll("HH", obj.hours);
		res = res.replaceAll("mm", obj.minutes);
		res = res.replaceAll("ss", obj.seconds);
		return res;
	}
})();
function doSelectFilter(v) {
	var objs = document.getElementsByName("filters");
	for (var i = 0; i < objs.length; i++) {
		if (objs[i].getAttribute("value") == v) {
			objs[i].className = "currentFilter";
		}
		else {
			objs[i].className = "filter";
		}
	}
	changeFilter(v);
}
// add by chenxl 20170719 按钮靠右之后
// type 0 列表，除“新建”外，都是图标；1 表单中按钮
// rel  1 关系列表；0 列表
function doButton(array,type,rel){
	for(var i = 0; i < array.length; i++){
	 	var obj = array[i];
	 	if(obj.id=='addBtn'||obj.id=='relBtn'||obj.id=='importPhaseBtn'||obj.id=='exportTaskBtn'){
		 	$("#newtoolbar").append('<button id="'+obj.id+'" type="button"  class="'+obj.id+'" onclick="fclickBtn(this,'+rel+')" >'+obj.text+'</button>&nbsp;&nbsp');
	 	}else{
	 		if('1'==type){
	 			$("#newtoolbar").append('<button id="'+obj.id+'" type="button"  class="'+obj.id+type+'" onclick="fclickBtn(this,'+rel+')">'+obj.text+'</button>&nbsp;&nbsp');
	 		}else{
	 			if(obj.id=='mapmsgbt'){//镜像消息
	 				var txt = obj.text=="无镜像消息"?"无镜像消息":"新镜像消息";
	 				var str = obj.text.replace(txt,"");
	 				$("#newtoolbar").append('<input id="'+obj.id+'" type="button"  class="'+obj.id+" "+obj.iconCls+'" onclick="fclickBtn(this,'+rel+')"  title="'+txt+'" style="background-color: #ffffff;"/>'+str+'&nbsp;&nbsp');
	 			}else{
	 				$("#newtoolbar").append('<input id="'+obj.id+'" type="button"  class="'+obj.id+" "+obj.iconCls+'" onclick="fclickBtn(this,'+rel+')"  title="'+obj.text+'" style="background-color: #ffffff;"/>&nbsp;&nbsp');
	 		 	}
		 	}
	 	}
	 }
	 
}

function getText(){

}
function fclickBtn(obj,rel){
	// var getText = new function(){};
	debugger;
	if(obj.id.indexOf('stat_')>-1){
		var bb = $(('#'+obj.id)).text();
		var aa = new function(){};
		aa.getText= function (){ return bb;};
		obj = {buttonID:obj.id,text:'',iconCls:'',iconEl:aa};
	}else{
		obj = {buttonID:obj.id,text:'',iconCls:''};
	}
	
	
	try{
		// 从关系过来的
		if('1'==rel){
			document.getElementById("formIframe").contentWindow.clickBtnForRel(obj);
		}else{
			document.getElementById("formIframe").contentWindow.clickBtn(obj);
		}
	}catch(e){
		try{
			// 从关系过来的
			if('1'==rel){
				document.getElementById("infoIframe").contentWindow.clickBtnForRel(obj);
			}else{
				document.getElementById("infoIframe").contentWindow.clickBtn(obj);
			}
		}catch(e){
			clickBtn(obj);
		}
	}
}