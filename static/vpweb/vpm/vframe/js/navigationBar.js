var _iconShow= "/project/images/cssImages/left_nav_h.gif";
var _iconHide= "/project/images/cssImages/left_nav_v.gif";
var _menuHeight = 0;
var _bodyHeight = 0;
/** 
* getItemHtml
* 拼装菜单ITEM的HTML
* 
* @author wudi
* @param index 索引 为生成所需ID而用
* @param data 包含所用属性的json对象
* @return String 拼装好的HTML
*/ 
var q = 0;
function getItemHtml(index,data){
	var str = '';
	var icon = data.icon;
	if(data.icon && data.icon.indexOf("/project/")!=0){
		icon = "/project/vframe/images/nav/"+data.icon;
	}
	var current = "";
	//if(data.expand == 'true' && data.expand){
	var s1 = "<img name=\"co\" src=\"/project/vframe/images/icon_jie_open.gif\" style=\"padding-top:15px;padding-left:10px;\">";
	if(index==0){
		current = 'class="slidenav_li current"';
		//str += '<div id="menuItemInfo'+index+'" class="left_nav_nr" style="display:none">';
	}else{
		s1 = "<img name=\"co\" src=\"/project/vframe/images/icon_jie_close.gif\" style=\"padding-top:15px;padding-left:10px;\">";
		current = 'class="slidenav_li"';
		//str += '<div id="menuItemInfo'+index+'" class="left_nav_nr" style="display:none">';
	}
	if(data.body.length == 0){
		//str += '<div class="left_nav">';
		//	str += '<div class="left_nav_icon"><img src="'+icon+'" /></div>';
	    //   	str += '<div class="left_nav_title"><a href="#" onclick="clickUrl(\'\',\''+data.text+'\',\''+data.rightIcon+'\',\''+data.url+'\');">'+data.text+'</a></div>';	
	    //str += '</div>';
		str += '<li '+current+' >';
		str += '	<span class="menu_title"><img src="'+icon+'" style="padding-top:7px;"/>&nbsp;'+data.text+s1+'</span>';
		str += '    <ul class="small_ul">';
		str += '    </ul>';
		str += '</li>';
	    return str;
	}else{
		str += '<li '+current+'>';
		str += '	<span class="menu_title"><img src="'+icon+'" style="padding-top:7px;"/>&nbsp;'+data.text+s1+'</span>';
		str += '    <ul class="small_ul">';
		
		//str += '    	<li><span>仪表盘1</span></li>';
		//str += '        <li class="current"><span>仪表盘2</span></li>';
		//str += '        <li><span>仪表盘3</span></li>';
		
		//str += '<div class="left_nav" onclick="menuHeadClick('+index+');">';
		//	str += '<div class="left_nav_icon"><img src="'+icon+'" /></div>';
	    //   	str += '<div class="left_nav_title"><a href="#">'+data.text+'</a></div>';	
	   // str += '</div>';
	}

	var bodyData = data.body;
	
	//str += '<table id="menuItemTable'+index+'" width="100%" border="0" cellspacing="0" cellpadding="0">';
	
   	for(var i=0;i<bodyData.length;i++){
		var itemData = bodyData[i];
		var itemText = itemData.text;
		var itemUrl = itemData.url;
		var itemID = itemData.id;
		var itemIcon = itemData.rightIcon;
		var itemClick = itemData.onClick;
		if(itemIcon == undefined){
			itemIcon = data.rightIcon;
			itemData.rightIcon = data.rightIcon;
		}

		if(itemData.child != undefined){
			if(itemData.child.length == NULL){
				var arr = [];
				arr.push(itemData.child);
				itemData.child = arr;
			}
			//str += '<tr>';
			//str += '<td class="left_nav_link_icon"><img style="margin-top: 4px;" id="childItemImg'+itemID+'" onclick="clickChildItem('+index+',\''+itemID+'\');" style="cursor:pointer" src="/project/vframe/images/icon_left_sec_open.gif"/></td>';
			//str += '<td width="124"><a href="#" onclick="clickChildItem('+index+',\''+itemID+'\');">'+itemText+'</a></td>';
			//str += '</tr>';
			//str += '<tr id="childItem'+itemID+'">';
			//str += '<td>&nbsp;</td>';
			//str += '<td>';
			//str += '<table class="left_nav_open" width="100%" border="0" cellspacing="0" cellpadding="0">'
			for(var j=0;j<itemData.child.length;j++){
				itemID = itemData.child[j].id;
				itemText = itemData.child[j].text;
				itemUrl = itemData.child[j].url;
				itemClick = itemData.child[j].onClick;
				if(itemData.child[j].rightIcon != NULL && itemData.child[j].rightIcon != ""){
					itemIcon = itemData.child[j].rightIcon;
				}else{
					itemIcon = itemData.rightIcon;
				}
				var currentItem = "";
				var itemidCurrent = getCookie("vp_itemid");  
				if(itemidCurrent==itemID)currentItem='class="current"';
				
				//str += '<tr class="left_nav_link" id="'+itemID+'">';
				// 功能ID
				
				if(itemClick == NULL){
					//alert("1---"+itemText);
				//	str += '<td><a href="#" onclick="clickUrl(\''+itemID+'\',\''+itemText+'\',\''+itemIcon+'\',\''+itemUrl+'\');">'+itemText+'</a></td>';
					str += '    	<li  '+currentItem+'><span id="'+itemID+'" onclick="clickUrl(\''+itemID+'\',\''+itemText+'\',\''+itemIcon+'\',\''+itemUrl+'\');">'+itemText+'</span></li>';
				}else{
					//alert("2---"+itemText);
				//	str += '<td><a href="#" onclick="' + itemClick + '">'+itemText+'</a></td>';
					str += '    	<li  '+currentItem+'><span id="'+itemID+'" onclick="' + itemClick + '">'+itemText+'</span></li>';
				}
				//str += '</tr>';
				//str += '        <li class="current"><span>仪表盘2</span></li>';
			}
			//str += '</table>';
			//str += '</td>';
			//str += '</tr>';
		}else{
			var currentItem = "";
			var itemidCurrent = getCookie("vp_itemid");  
			if(itemidCurrent==itemID)currentItem='class="current"';
			//str += '<tr class="left_nav_link" id="'+itemID+'">';
			//str += '<td class="left_nav_link_icon"><img style="margin-top: 4px;" src="/project/vframe/images/icon_left_sec.gif"/></td>';
			if(itemClick == NULL){
				//alert("3---"+itemText);
				str += '    	<li id="'+itemID+'" '+currentItem+'><span onclick="clickUrl(\''+itemID+'\',\''+itemText+'\',\''+itemIcon+'\',\''+itemUrl+'\');">'+itemText+'</span></li>';
				//str += '<td width="124"><a href="#" onclick="clickUrl(\''+itemID+'\',\''+itemText+'\',\''+itemIcon+'\',\''+itemUrl+'\');">'+itemText+'</a></td>';
			}else{
				//alert("4---"+itemText);
				str += '    	<li id="'+itemID+'" '+currentItem+'><span onclick="' + itemClick + '">'+itemText+'</span></li>';
				//str += '<td width="124"><a href="#" onclick="' + itemClick + '">'+itemText+'</a></td>';
			}
			//str += '</tr>';
		}
   	}
	//str += '</table>';
    //str += '</div>';
    str += '    </ul>';
	str += '</li>';
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
	str += '<ul class="slidenav_ul" id="leftMenuBox">';//'<div id="leftMenuBox" class="left_box" style="height:'+(height>0?height:0)+'px;">';
	//str += '<table id="leftMenuBoxTable" width="147" height="'+height+'" border="0" cellspacing="0" class="left">';
	//str += '<tr><td valign="top" width="147">';
	for(var i=0;i<itemList.length;i++){
		str += itemList[i];
    }
    //str += '</td></tr></table>';
    str += '</ul>';//'</div>';
    return str;
}
var NavigationBar = function(objData,elementID){
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
		for(var i=0;i<dataList.length;i++){
			var obj = dataList[i];
			if(obj.expand == 'true' && obj.expand){
				menuHeadClick(i);
				break;
			}
		}
		
		this.selectItem(this.selectItemID);
	};
	this.selectItem = function(itemID){
		var dataList = this.menuData;
		for(var i=0;i<dataList.length;i++){
			var obj = dataList[i].body;
			//一级菜单
			for(var j=0;j<obj.length;j++){
				var itemData = obj[j];
				if(itemData.id == itemID){
					var itemText = itemData.text;
					var itemUrl = itemData.url;
					//if(dataList[i].expand == false){
						//menuHeadClick(i);
					//}
					var icon = itemData.rightIcon;
					if(icon == undefined){
						icon = dataList[i].rightIcon;
					}
					if(icon == undefined){
						icon = menuData.rightIcon;
					}
					//selectMenuItem(itemID,itemText,icon,itemUrl);
					//menuHeadClick(i);
					clickUrl(itemData.id,itemText,icon,itemUrl);
					//Common.setRightTitle(itemText,icon,itemUrl);
					// oyq 需要增加事件
					return;
				}
				//二级菜单
				if(itemData.child != NULL){
					for(var k=0;k<itemData.child.length;k++){
						var child = itemData.child[k];
						if(child.id == itemID){
							var itemText = child.text;
							var itemUrl = child.url;
							//if(dataList[i].expand == false){
								//menuHeadClick(i);
							//}
							
							var icon = child.rightIcon;
							if(icon == NULL){
								icon = itemData.rightIcon;
							}
							if(icon == undefined){
								icon = dataList[i].rightIcon;
							}
							if(icon == undefined){
								icon = menuData.rightIcon;
							}
							selectMenuItem(child.id,itemText,icon,itemUrl);
							menuHeadClick(i);
							return;
						}
					}
				}
			}
		}
	};
};

//点击菜单项事件
function clickUrl(menuItemID,menuItemText,menuItemIcon,url){
  window.focus();  
  addCookie("vp_itemid", menuItemID, 365*99);
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

  var functionPageFrame;
	//menuItemIcon = menuItemIcon.replace(".gif","_b.gif");
	if(menuItemIcon == undefined || menuItemIcon == 'undefined'){
		menuItemIcon = ''; 
	}
  	try{
  		//onItemClick已被定义时，对顶部[当前位置条]内容的控制，onItemClick的内容由调用者实现
  		//onItemClick(menuItemID,menuItemText,menuItemIcon,url);
  		if(menuItemText.indexOf('[') > 0){
  			menuItemText = menuItemText.substring(0,menuItemText.indexOf('['));
  		}

		if (tabs == 'tabs' && url != '/project/cmmi/rptModules/listToolbar.jsp?moduleType=1') {
			if (top.document.getElementById("right").src.indexOf("tabtitle.jsp") == -1) {
				top.document.getElementById("right").src = "/project/vframe/tabtitle.jsp?stext="
					+menuItemText+"&menuItemID="+menuItemID+"&url="+url.replaceAll('&','＆');
			}
			else {
				var objTbl = top.document.getElementById("right").contentWindow.tabs;
				var cells = objTbl.rows.item(0).cells;
				var bl = true;
				for (var ii = 0; ii < cells.length; ii++) {
					cells[ii].setAttribute("class","tab");
					if (cells[ii].id == 'tab'+menuItemID) {
						cells[ii].setAttribute("class","tabhit");
						bl = false;
					}
				}
				if (bl) {
					var newCell = objTbl.rows.item(0).insertCell(cells.length);
					newCell.id = "tab"+menuItemID;
					//newCell.innerHTML = menuItemText;
					newCell.innerHTML = '<a href="#" onclick="doTab(this.parentNode)">'+menuItemText+'</a><img src="/project/vframe/images/tab-close.gif"'
						+'style="vertical-align:middle; margin-left: 3px;" onclick="doDelTab(this.parentNode)">';
					
					newCell.setAttribute("url", url);
					//newCell.setAttribute("onclick", "doTab(this)");
					newCell.setAttribute("class", "tabhit");
				}
				top.document.getElementById("right").contentWindow.functionPage.location = url;
			}			
		}
		else {
  			Common.setRightTitle(menuItemText,menuItemIcon,url);
		}
  	}catch(e){}
  	/*
	if(document.all){
		functionPageFrame = top.document.frames["right"].document;
  	}else{
   	    functionPageFrame = top.document.getElementById("right").contentWindow.document;
   	}
   	//右侧url的设定
   	if(url != ""){
		functionPageFrame.getElementById("functionPage").src=url;
   	}
   	*/
}

//点击菜单项事件
function selectMenuItem(menuItemID,menuItemText,menuItemIcon,url){
  window.focus();
  $("#"+menuItemID).parent().addClass('current').siblings().removeClass('current');
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

  var functionPageFrame;
	//menuItemIcon = menuItemIcon.replace(".gif","_b.gif");
	if(menuItemIcon == undefined || menuItemIcon == 'undefined'){
		menuItemIcon = ''; 
	}
  	try{
  		//onItemClick已被定义时，对顶部[当前位置条]内容的控制，onItemClick的内容由调用者实现
  		//onItemClick(menuItemID,menuItemText,menuItemIcon,url);
  		if(menuItemText.indexOf('[') > 0){
  			menuItemText = menuItemText.substring(0,menuItemText.indexOf('['));
  		}
  		Common.setRightTitle(menuItemText,menuItemIcon,url);
  	}catch(e){}

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
	//document.getElementById("leftMenuBoxTable").style.height = document.body.clientHeight -1 + "px";
	var height = document.body.clientHeight -1;
	document.getElementById("leftMenuBox").style.height = (height<0?0:height) + "px";
	setMenuHeight();
}

function menuHeadClick(index){
	addCookie("vp_areaid", index, 365*99);
	/*
	var menus = document.getElementsByTagName("div");
	for(var i=0;i<menus.length;i++){
		var obj = menus[i];
		if(obj.className == "left_nav_nr"){
			obj.style.display = "none";
			obj.style.visibility = "hidden";
		}
	}
	
	var menuItem = document.getElementById("menuItemInfo" + index);
	var menuTable = document.getElementById("menuItemTable" + index);
	//menuItem.style.height = _menuHeight;
	
	if(menuItem.style.display == "none"){
		menuItem.style.display = "";
		menuItem.style.visibility = "visible";
	}else{
		menuItem.style.display = "none";
		menuItem.style.visibility = "hidden";
	}
	if(menuTable.offsetHeight - 2 > _menuHeight){
		menuItem.style.overflowY = "scroll";
		menuTable.style.width = "129px";
	}else{
		menuItem.style.overflowY = "hidden";
	}
	//alert(_menuHeight);
	//alert(menuTable.offsetHeight);
	//alert(menuItem.scrollHeight);
	*/
}

function clickChildItem(index,id){
	var menuItem = document.getElementById("childItem" + id);
	var menuItemImg = document.getElementById("childItemImg" + id);
	if(menuItem.style.display == "none"){
		menuItem.style.display = "";
		menuItemImg.src = "/project/vframe/images/icon_left_sec_open.gif";
	}else{
		menuItem.style.display = "none";
		menuItemImg.src = "/project/vframe/images/icon_left_sec_close.gif";
	}
	
	var menuItem = document.getElementById("menuItemInfo" + index);
	var menuTable = document.getElementById("menuItemTable" + index);

	if(menuTable.offsetHeight - 2 > _menuHeight){
		menuItem.style.overflowY = "scroll";
	}else{
		menuItem.style.overflowY = "hidden";
	}
}

function setMenuHeight(){
	var menus = document.getElementsByTagName("div");
	var height;
	var maxMenu = 0;
	var screenHeight = document.body.clientHeight -1;
	for(var i=0;i<menus.length;i++){
		var obj = menus[i];
		if(obj.className == "left_nav"){
			height = obj.offsetHeight;
			maxMenu++;
		}
	}

	var height = screenHeight - height * maxMenu - 10 + maxMenu + 1;
	_menuHeight = height;
	
	for(var i=0;i<menus.length;i++){
		var obj = menus[i];
		if(obj.className == "left_nav_nr"){
			obj.style.height = (height<0?0:height) + "px";
		}
	}
	
	for(var i=0;i<maxMenu;i++){
		var menuItem = document.getElementById("menuItemInfo" + i);
		var menuTable = document.getElementById("menuItemTable" + i);

		if(menuTable.offsetHeight - 2 > _menuHeight){
			menuItem.style.overflowY = "scroll";
		}else{
			menuItem.style.overflowY = "hidden";
		}
	}
}
function clickItem(itemId){
	var tdNodes = document.getElementById(itemId).children;
	var itemNode = undefined;
	for(var i=0;i<tdNodes.length;i++){
		var c = tdNodes[i];
		if(c.nodeName=="TD"){
			var aNodes = c.children;
			for(var j=0;j<aNodes.length;j++){
				var a = aNodes[j];
				if(a.nodeName=="A"){
					itemNode = a;
					break;
				}
			}
			if(itemNode)break;
		}
	}
	itemNode.onclick.call(itemNode);
}