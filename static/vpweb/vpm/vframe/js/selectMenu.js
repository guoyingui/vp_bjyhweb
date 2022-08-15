;_vp_menu_list = {};
_vp_menu_item_list = {};
/** 
 * cfg: {
 * 		id: "selectMenu",
 * 		width: 200,
 * 		menuParam: {},
 * 		afterHide: fn1,
 * 		callBack: fn2
 * }
 */
VpMenu = function(config){
	if(_vp_menu_list[config.id]){
		return _vp_menu_list[config.id];
	}
	var cfg = config;
	this.id = cfg.id;
	var defParams = cfg.menuParam;
	var params = defParams;
	var itemList = {length:0};
	var $eventObj;
	var afterHide = cfg.afterHide || function(){};
	var callBack = cfg.callBack;
	
	var $body = $(document.body);
	var $outDiv = function(){
		var $div = $("<div id=\""+this.id+"\" class=\"float_div\" style=\"z-index:-9999;\"></div>");
		$div.width(cfg.width);
		//$div.hide();
		$body.append($div);
		return $div;
	}();
	var $innerDiv = function(){
		var $div = $("<div class=\"float_div_nr\"></div>");
		return $div;
	}();
	$outDiv.append($innerDiv);
	
	this.appendItem = function(item){
		itemList[item.id] = item;
		itemList.length++;
		$innerDiv.append(item.getDom());
	}
	this.clearItem = function (){
		while ($innerDiv[0].firstChild)
			$innerDiv[0].removeChild($innerDiv[0].firstChild);
		itemList = {};
		itemList.length = 0;
	}
	this.removeItem = function(itemId){
		itemList[itemId].removeMySelf();
	}
	this.setMenuParams = function(menuParams){
		params = $.extend({}, defParams, menuParams);
	}
	this.show = function(obj, offset_top, offset_left){
		$eventObj = $(obj);
		var count = 0;
		if(itemList.length<1){
			return false;
		}
		var mTop = $eventObj.offset().top+offset_top;
		var mleft = $eventObj.offset().left+offset_left;
		if($outDiv.height()<document.body.scrollHeight){
			if(mTop+$outDiv.height()>document.body.scrollHeight){
				mTop = mTop - $outDiv.height() - offset_top;
			}
		}
		if ($outDiv.width() < document.body.scrollWidth) {
			if (mleft + $outDiv.width() > document.body.scrollWidth) {
				mleft = mleft - $outDiv.width() - offset_left;
			}
		}
		$outDiv.css("top",mTop);
		$outDiv.css("left",mleft);
		$outDiv.css("z-index", 65536);
		//$outDiv.show();
		return true;
	}
	/**
	 * 
	 * data: {
	 * 		menuParam:{},
	 * 		items:[item1,item2]
	 * }
	 * or
	 * data:{
	 * 		menuParam:{},
	 * 		items:[{item:item1,itemParam:{pa:"a1",pb:"a2"}}
	 * 			,item2]
	 * }
	 */
	this.init = function(data){
		params = $.extend({}, defParams, data.menuParam);
		this.clearItem();
		var obj, item, itemParams = undefined;
		for(var i=0;i<data.items.length;i++){
			obj = data.items[i];
			if(obj.item){
				item = obj.item;
				itemParams = obj.itemParam;
			}else{
				item = obj;
			}
			if(item.type == "item"){
				item.setItemParams(itemParams);
				item.setMenu(this);
//				item.setGlobalParams(this.params);
			}
			this.appendItem(item);
		}
	}
	this.isShow = function(){
		return $outDiv.css("z-index")>0;
	}
	this.hide = function(){
		//$outDiv.hide();
		$outDiv.css("z-index", -9999);
		afterHide($eventObj[0]);
	}
	this.hideMenu=function(){
		for(var menuId in _vp_menu_list){
			if(_vp_menu_list[menuId].isShow()){
				_vp_menu_list[menuId].hide();
			}
		}
	};
	$body.bind("mousedown",this.hideMenu );
	
	this.clickItem = function(item){
		callBack({id:item.id, menuParam: params, itemParam: item.getItemParams()});
	}
	_vp_menu_list[this.id] = this;
}
/**
 * cfg: {
 * 		id:0,
 * 		text:"",
 * 		itemParam: {}
 * }
 */
VpMenuItem = function(config){
	var cfg = config;
	this.id = cfg.id;
	this.type = "item";
	var defParams = cfg.itemParam;
	var itemParams = defParams;
	var menu = undefined;
	var itemSelf = this;
	var docElement = function(){
		var $item = $("<div id=\""+this.id+"\" class=\"float_div_font\"></div>");
		var $iconDiv = $("<div class=\"float_div_font_icon\"></div>");
		var $textDiv = $("<div class=\"float_div_font_font\">"+cfg.text+"</div>");
		$item.append($iconDiv);
		$item.append($textDiv);
		
		var mouseOver = function(e){
			var $target = $(e.currentTarget);
			$target.removeClass("float_div_font");
			$target.addClass("floatdiv_font_hover");
		}
		var mouseOut = function(e){
			var $target = $(e.currentTarget);
			$target.removeClass("floatdiv_font_hover");
			$target.addClass("float_div_font");
		}
		$item.hover(mouseOver, mouseOut);
		
		$item.mousedown(function(){
			menu.clickItem(itemSelf);
		});
		return $item;
	}();
	
	this.setItemParams = function(data){
		itemParams = $.extend({}, defParams, data);
	}
	this.getItemParams = function(){
		return itemParams;
	}
	this.setMenu = function (parent){
		menu = parent;
	}
	this.getDom = function(){
		return docElement;
	}
	this.removeMySelf = function(){
		var itemDom = this.getDom()[0];
		itemDom.parentNode.removeChild(itemDom);
	}
	_vp_menu_item_list[this.id] = this;
}
VpMenuLine = function(id){
	this.id = id;
	this.type = "line";
	var $lineDom = $("<div id=\""+id+"\" class=\"float_div_line\"></div>");
	this.getDom = function(){
		return $lineDom;
	}
	_vp_menu_item_list[this.id] = this;
}
/**
 * 苏军峰：Ext列表初始化时不加载倒三角操作按钮，初始化完成后再加载。
 */
ListOperMenu = function (conf){
	var $operDiv = $(conf.operDiv);
	var beforeShow = conf.beforeShow;
	var afterHide = conf.vpMenuCfg.afterHide;
	
	var _afterHide = function(obj){
		if(afterHide)afterHide();
		obj.status = "";
		$(obj).mouseout();
	}
	conf.vpMenuCfg.afterHide = _afterHide;
	var vpmenu = new VpMenu(conf.vpMenuCfg);
	
	var _clickOpr = function(event){
		var obj = event.target;
		try{
			beforeShow($(obj).attr("index"));
		}catch(e){
			alert(e);
		}
		if(vpmenu.show(obj, 17,15)){
			obj.status = "clicked";
			obj.src = "/project/vframe/images/other/icon_openvisited.gif";
		}
		
	}
	var _itemOver = function(event){
		var obj = event.target;
		if(!obj.status || !obj.status=="clicked"){
			obj.src = "/project/vframe/images/other/icon_openhover.gif";
		}
	}
	var _itemOut = function(event){
		var obj = event.target;
		if(!obj.status || !obj.status=="clicked"){
			obj.src = "/project/vframe/images/other/icon_openlink.gif";
		}
	}
	$operDiv.each(function(){
		var $currDiv = $(this);
		var $oper = $("<img src=\"/project/vframe/images/other/icon_openlink.gif\" />");
		$oper.attr("index", $currDiv.attr("index"));
		$currDiv.append($oper);
		$oper.mouseover(_itemOver);
		$oper.mouseout(_itemOut);
		$oper.click( _clickOpr);
	});
	return vpmenu;
}
/**
 * 王澜涛：Ext列表初始化时就加载倒三角操作按钮
 */
ListOperMenu2 = function (conf){
	var $operDiv = $(conf.operDiv);
	var beforeShow = conf.beforeShow;
	var afterHide = conf.vpMenuCfg.afterHide;
	
	var _afterHide = function(obj){
		if(afterHide)afterHide();
		obj.status = "";
		$(obj).mouseout();
	}
	conf.vpMenuCfg.afterHide = _afterHide;
	var vpmenu = new VpMenu(conf.vpMenuCfg);
	
	window._clickOpr = function(obj){
		//var obj = event.target;
		try{
			beforeShow($(obj).attr("index"));
		}catch(e){
			alert(e);
		}
		if(vpmenu.show(obj, -20, -15)){ // 高层计划位置问题   if(vpmenu.show(obj, 17,15)){
			obj.status = "clicked";
			obj.src = "/project/vframe/images/other/icon_openvisited.gif";
		}
		
		if(event.stopPropagation){
			event.stopPropagation();
			event.preventDefault();
		}else{
			event.cancelBubble=true;
		}
	}
	window._itemOver = function(obj){
		//var obj = event.target;
		if(!obj.status || !obj.status=="clicked"){
			obj.src = "/project/vframe/images/other/icon_openhover.gif";
		}
	}
	window._itemOut = function(obj){
		//var obj = event.target;
		if(!obj.status || !obj.status=="clicked"){
			obj.src = "/project/vframe/images/other/icon_openlink.gif";
		}
	}
	/*$operDiv.each(function(){
		var $currDiv = $(this);
		var $oper = $("<img src=\"/project/vframe/images/other/icon_openlink.gif\" />");
		$oper.attr("index", $currDiv.attr("index"));
		$currDiv.append($oper);
		$oper.mouseover(_itemOver);
		$oper.mouseout(_itemOut);
		$oper.click( _clickOpr);
	});*/
	return vpmenu;
}