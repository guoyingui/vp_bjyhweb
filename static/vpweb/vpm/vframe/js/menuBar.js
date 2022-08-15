var _iconShow= "/project/vframe/images/icon_opennew_lef_open.gif";
var _iconHide= "/project/vframe/images/icon_opennew_lef_close.gif";
var _url_para = [];
/** 
* getItemHtml
* 拼装菜单ITEM的HTML
* 
* @author wudi
* @param index 索引 为生成所需ID而用
* @param data 包含所用属性的json对象
* @return String 拼装好的HTML
*/ 

function getItemHtml(index,data){
	var str = '';
	var iconID = 'icon' + index;
	str += '<div class="newopen_left_nav" onclick="menuHeadClick('+index+')">';
		str += '<div class="left_nav_icon"><img src="/project/vframe/images/nav/'+data.icon+'" /></div>';
       	str += '<div class="newopen_left_nav_title"><a href="#">'+data.text+'</a></div>';	
    
	if(data.expand != 'undefined' && data.expand){
		str += '<div class="newopen_left_nav_icon"><img id="'+iconID+'" src="'+_iconShow+'" /></div>';
	}else{
		str += '<div class="newopen_left_nav_icon"><img id="'+iconID+'" src="'+_iconHide+'" /></div>';
	}
	
	str += '</div>';
	
	if(data.expand == 'true' && data.expand){
		str += '<div id="menuItemInfo'+index+'" class="newopen_left_nav_nr">';
	}else{
		str += '<div id="menuItemInfo'+index+'" class="newopen_left_nav_nr" style="display:none">';
	}
	
	var bodyData = data.body;
	
	str += '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
   	for(var i=0;i<bodyData.length;i++){
		var itemData = bodyData[i];
		var itemText = itemData.text;
		var itemUrl = itemData.url;
		var itemID = itemData.id;
		var itemIcon = itemData.rightIcon;
		var itemClick = itemData.onClick;
		var itemdisplayflag=itemData.displayflag;
		var itemclass="menu_disable";
		var itemTextIcon = itemData.textIcon;
		
		if(itemIcon == undefined){
			itemIcon = data.rightIcon;
		}
		
		if(itemTextIcon == NULL || itemTextIcon == ""){
			itemTextIcon = "";
		}else{
			itemTextIcon = '<img src="'+itemTextIcon+'"/>';
		}
		 
        if(itemdisplayflag != undefined){
			if(itemdisplayflag=='1' || itemdisplayflag=='2'){
			   itemclass="menu_enable";
			}
		}

		if(itemData.child != undefined){
			if(itemData.child.length == NULL){
				var arr = [];
				arr.push(itemData.child);
				itemData.child = arr;
			}
			str += '<tr>';
			str += '<td class="left_nav_link_icon"><img style="margin-top: 5px;" id="childItemImg'+itemID+'" onclick="clickChildItem(\''+itemID+'\');" style="cursor:pointer" src="/project/vframe/images/icon_left_sec_open.gif"/></td>';
			str += '<td width="124"><a href="#" onclick="clickChildItem(\''+itemID+'\');">'+itemText+'</a></td>';
			str += '</tr>';
			str += '<tr id="childItem'+itemID+'">';
			str += '<td>&nbsp;</td>';
			str += '<td>';
			str += '<table class="left_nav_open" width="100%" border="0" cellspacing="0" cellpadding="0">'
			for(var j=0;j<itemData.child.length;j++){
				itemID = itemData.child[j].id;
				itemText = itemData.child[j].text;
				itemUrl = itemData.child[j].url;
				itemClick = itemData.child[j].onClick;
				itemdisplayflag=itemData.displayflag;
				itemclass="menu_disable";
				
				if(itemIcon == undefined){
					itemIcon = data.rightIcon;
				}
		        if(itemdisplayflag != undefined){
					if(itemdisplayflag=='1' || itemdisplayflag=='2'){
					   itemclass="menu_enable";
					}
				}
				str += '<tr class="left_nav_link" id="'+itemID+'">';
				
				if(itemClick == NULL){
					str += '<td class="'+itemclass+'"><a href="#" onclick="clickUrl(\''+itemID+'\',\''+itemText+'\',\''+itemIcon+'\',\''+itemUrl+'\');">'+itemText + itemTextIcon+'</a></td>';
				}else{
					str += '<td class="'+itemclass+'"><a href="#" onclick="' + itemClick + '">'+itemText + itemTextIcon+'</a></td>';
				}
				str += '</tr>';
			}
			str += '</table>';
			str += '</td>';
			str += '</tr>';
		}else{

			str += '<tr class="left_nav_link" id="'+itemID+'">';
			str += '<td class="left_nav_link_icon"><img style="margin-top: 5px;" src="/project/vframe/images/icon_left_sec.gif"/></td>';
			if(itemClick == NULL){
				str += '<td id="state'+itemID+'" class="'+itemclass+'" width="124"><a href="#" onclick="clickUrl(\''+itemID+'\',\''+itemText+'\',\''+itemIcon+'\',\''+itemUrl+'\');">'+itemText + itemTextIcon+'</a></td>';
			}else{
				str += '<td id="state'+itemID+'" class="'+itemclass+'" width="124"><a href="#" onclick="' + itemClick + '">'+itemText + itemTextIcon+'</a></td>';
			}
			str += '</tr>';
		}
   	}
	str += '</table>';
	
    str += '</div>';
    
    return str;
}

/** 
* getBoxHtml
* 拼装菜单的HTML
* 
* @author wudi
* @param itemList 菜单包含的子项
* @return String 拼装好的HTML
*/ 

function getBoxHtml(itemList){
	var str = '';
	var height = document.body.clientHeight -1;
	str += '<div id="leftMenuBox" class="left_box" style="height:'+(height>0?height:0)+'px;">';
	//str += '<table id="leftMenuBoxTable" width="147" height="'+height+'" border="0" cellspacing="0" class="left">';
	//str += '<tr><td valign="top" width="147">';
	for(var i=0;i<itemList.length;i++){
		str += itemList[i];
    }
    //str += '</td></tr></table>';
    str += '</div>';
    return str;
}
var menuResizer = {
	menu: undefined,
	resize: function(){
		if(!this.menu)return;
		var rc = this.menu.lastChild;
		if(rc){
			rc.style.height = (document.body.clientHeight > rc.offsetTop?document.body.clientHeight  - rc.offsetTop:document.body.clientHeight) + "px";
		}
	}
};
(function(){
	var fn = function(){
		menuResizer.resize();
	}
	if(window.addEventListener){
		window.addEventListener("resize", fn, false)
	}else{
		window.attachEvent("onresize", fn);
	}
})();
var _menuBar = undefined;
var _leftItemID = new Array();
var MenuBar = function(objData,elementID){
	if(objData.data.length == undefined){
		var arr = [];
		arr.push(objData.data);
		objData.data = arr;
	}
	for(var i=0;i<objData.data.length;i++){
		if(objData.data[i].body == undefined){
			var arr = [];
			objData.data[i].body = arr;
		}
		if(objData.data[i].body.length == undefined){
			var arr = [];
			arr.push(objData.data[i].body);
			objData.data[i].body = arr;
		}
	}
	this.menuData = objData.data;
	this.element = document.getElementById(elementID);
	this.selectItemID = objData.selectItemID;
	this.selChangeRight = objData.selChangeRight||true;
	this.init = function(){
		var menuList = [];
		var dataList = this.menuData;

		for(var i=0;i<dataList.length;i++){
			var obj = dataList[i];
			if(obj.rightIcon == undefined){
				obj.rightIcon = objData.rightIcon;
			}
			if(obj.icon == undefined){
				obj.icon = 'blank.gif';
			}
			menuList.push(getItemHtml(i,obj));
		}
		
		this.element.innerHTML = getBoxHtml(menuList);
		setMenuHeight();
		menuResizer.menu = this.element.firstChild;
		menuHeadClick(0);
		menuResizer.resize();
//		this.selectItem(this.selectItemID);
	};
	this.selectItem = function(itemID){
		var dataList = this.menuData;
		var clicked = false;
		for(var i=0;i<dataList.length;i++){
			var obj = dataList[i].body;
			for(var j=0;j<obj.length;j++){
				var itemData = obj[j];
				_leftItemID.push(itemData.id);
				if(itemData.id == itemID){
					var itemText = itemData.text;
					var itemUrl = itemData.url;
					if(dataList[i].expand == false){
						menuHeadClick(i);
					}
					var icon = itemData.rightIcon;
					if(icon == undefined){
						icon = dataList[i].rightIcon;
					}
					if(icon == undefined){
						icon = menuData.rightIcon;
					}
					data = {menuItem: itemData};
					clickUrl(itemID,itemText,icon,this.selChangeRight?itemUrl:'');
					clicked = true;
					return;
				}
			}
		}
		if(!clicked){
			//this.selectItem(this.selectItemID);
			//alert("您没有权限查看页面");//liujie   如果没有权限则没有任何可选中的链接，会导致死循环。
			var isSelectItem = false;
			for(var i =0;i<_leftItemID.length;i++){
				if(_leftItemID[i] == this.selectItemID){
					isSelectItem = true;
				}
			}
			if(isSelectItem){
				this.selectItem(this.selectItemID);
			}else{
				if(_leftItemID[0]){
					this.selectItem(_leftItemID[0]);
				}
			}
		}
	};
	this.disable = function(isDisable){
		var dataList = this.menuData;
		for(var i=0;i<dataList.length;i++){
			var obj = dataList[i].body;
			for(var j=0;j<obj.length;j++){
				var itemData = obj[j];
				if(isDisable){
					if(itemData.id != this.selectItemID){
						var itemCt = document.getElementById("state" + itemData.id);
						itemCt.className = 'menu_disable';
					}
				}else{
					var itemCt = document.getElementById("state" + itemData.id);
					itemCt.className = 'menu_enable';
				}
			}
		}
	};
	this.disableForSelectedID = function(isDisable,disableID){
		var dataList = this.menuData;
		for(var i=0;i<dataList.length;i++){
			var obj = dataList[i].body;
			for(var j=0;j<obj.length;j++){
				var itemData = obj[j];
				if(isDisable){
					if(itemData.id != this.selectItemID){
						if(itemData.id==disableID){
							var itemCt = document.getElementById("state" + itemData.id);
							itemCt.className = 'menu_disable';
						}
					}
				}else{
					var itemCt = document.getElementById("state" + itemData.id);
					itemCt.className = 'menu_enable';
				}
			}
		}
	};
	this.addUrlPara = function(key,value){
		_url_para[key] = value;
	}
	this.delUrlPara = function(key){
		var arr = [];
		for(k in _url_para){
			if(key == k){
				continue;
			}
			arr[k] = _url_para[k];
		}
		_url_para = arr;
	}
	this.clearUrlPara = function(){
		_url_para = [];
	}
	this.getItem = function(itemId){
		var dataList = this.menuData;
		for(var i=0;i<dataList.length;i++){
			var obj = dataList[i].body;
			for(var j=0;j<obj.length;j++){
				var itemData = obj[j];
				if(itemData.id == itemId){
					return itemData;
				}
			}
		}
	}
	_menuBar = this;
};
top.beForeClickOpen = false;
//点击菜单项事件
function clickUrl(menuItemID,menuItemText,menuItemIcon,url){
  window.focus();
  
  if(top.beForeClickOpen && !top.beforeClick(menuItemID, url)){
	  return;
  };
 
  var isWbsView = url.indexOf("wbsViewCard.jsp")>-1;
  var isChrome = /Chrome/.test(navigator.userAgent);
  var isGCFinstalled = /chromeframe/.test(navigator.userAgent);
  if((top.isGCF==0 && isGCFinstalled && isWbsView && !isChrome) || (top.isGCF==1 && !isWbsView)){
  	top.changeFrameUrl(isWbsView?1:0, menuItemID);
  	return;
  }
  
  var itemData = _menuBar.getItem(menuItemID);
  var displayflag = itemData.displayflag;

  //如果为disable状态，return
  var itemCt = document.getElementById("state" + menuItemID);
  if(itemCt.className == 'menu_disable'){
  	return;
  }
  
  var allChildItem = document.getElementsByTagName("tr");
  //设置选中的颜色
  for(var i=0;i<allChildItem.length;i++){
	var item = allChildItem[i];
	if(item.className == "left_nav_link" || item.className == "left_nav_visited"){
		if(item.className == "left_nav_visited"){
			item.className = "left_nav_link";
		}
		if(item.id == menuItemID){
			item.className = "left_nav_visited";
		}
	}
  }
  
  try{
  		Common.setTitleText(menuItemText);
  }catch(e){}
  
   	//右侧url的设定
   	if(url != ""){

	   	var urlPara = "";
	   	for(key in _url_para){
	   		if(urlPara == ""){
	   			urlPara += key + "=" + _url_para[key];
	   		}else{
	   			urlPara += "&" + key + "=" + _url_para[key];
	   		}
	   	}
	   	if(url.indexOf("?") != -1){
	   		url += "&" + urlPara;
	   	}else{
	   		url += "?" + urlPara;
	   	}

	   	if(displayflag){
	   		url+='&displayflag='+displayflag;
	   	}
	   	url+='&r='+Math.random()*10000;

	   	setRightURL(url);
   	}
}
function setRightURL(url){
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
		right.src = url;
	}else{
		window.setTimeout(function(){
			setRightURL(url);
		}, 50);
	}
}
if(window.addEventListener){ // Mozilla, Netscape, Firefox
	window.addEventListener('resize', function(){
		setHeight();
	}, false);
} else { // IE
	window.attachEvent('onresize', function(){
		setHeight();
	});
}

function setHeight(){
	var height = document.body.clientHeight -1;
	document.getElementById("leftMenuBox").style.height = (height>0?height:0) + "px";
	setMenuHeight();
}
function setMenuHeight(){
	var menus = document.getElementsByTagName("div");
	var height;
	var maxMenu = 0;
	var screenHeight = document.body.clientHeight -1;
	for(var i=0;i<menus.length;i++){
		var obj = menus[i];
		if(obj.className == "newopen_left_nav"){
			height = obj.offsetHeight;
			maxMenu++;
		}
	}

	var height = screenHeight - height * maxMenu - 10 + maxMenu + 1;
	_menuHeight = height;
	
	for(var i=0;i<menus.length;i++){
		var obj = menus[i];
		if(obj.className == "newopen_left_nav_nr"){
			obj.style.height = (height<0?0:height) + "px";
		}
	}
	
	for(var i=0;i<maxMenu;i++){
		var menuItem = document.getElementById("menuItemInfo" + i);
		var menuTable = document.getElementById("menuItemTable" + i);
		if(menuTable){
			if(menuTable.offsetHeight - 2 > _menuHeight){
				menuItem.style.overflowY = "scroll";
			}else{
				menuItem.style.overflowY = "hidden";
			}
		}
	}
}
function menuHeadClick(index){
	//modify by liujie V5.5.3.0 20140217 对象弹出窗口左侧导航只展开一个组
	var menus = document.getElementsByTagName("div");
	var ii = 0;
	for(var i=0;i<menus.length;i++){
		var obj = menus[i];
		if(obj.className == "newopen_left_nav"){
			var menuItem = document.getElementById("menuItemInfo" + ii);
			var icon = document.getElementById("icon" + ii);
			menuItem.style.display = "none";
			icon.src = _iconHide;
			ii++;
		}
	}
	
	var menuItem = document.getElementById("menuItemInfo" + index);
	var icon = document.getElementById("icon" + index);
	if(menuItem.style.display == "none"){
		menuItem.style.display = "";
		icon.src = _iconShow;
	}else{
		menuItem.style.display = "none";
		icon.src = _iconHide;
	}
	menuResizer.resize();
}

function clickChildItem(id){
	var menuItem = document.getElementById("childItem" + id);
	var menuItemImg = document.getElementById("childItemImg" + id);
	if(menuItem.style.display == "none"){
		menuItem.style.display = "";
		menuItemImg.src = "/project/vframe/images/icon_left_sec_open.gif";
	}else{
		menuItem.style.display = "none";
		menuItemImg.src = "/project/vframe/images/icon_left_sec_close.gif";
	}
}
