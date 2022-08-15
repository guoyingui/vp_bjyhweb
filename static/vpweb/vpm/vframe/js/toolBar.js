/*
	工具条
	可添加按钮、菜单
*/
var VPToolBar = function (cfg){
	this.construct(cfg);
}
VPToolBar.prototype = {
	construct: function(cfg){
		this._toobar_render = NULL;
		this._call_back_fn = NULL;
		this._formIframe = NULL;
	},
	/*
	初始化工具条
	string render：对应页面div的id
	string callBackFn：按钮点击后回调的函数名称
	*/
	init: function(render,callBackFn,toolBarClass){
		this._call_back_fn = callBackFn;
		
		//添加工具条背景样式
		this._toobar_render = new Ext.Toolbar({ctCls:(toolBarClass||'right_toolbar')});
		this._toobar_render.render(render);
	},
	
	/*
		获取工具条对象
	*/
	getEl: function(){
		return this._toobar_render;
	},
	
	/*
		添加按钮
		object btn：按钮对象
	*/
	add: function(btn){
		var el = this.getEl();
		var fn = this._call_back_fn;
		
		if(btn == '|'){
			el.add({xtype:'tbseparator'});
			return;
		}
		
		if(btn.disabled == NULL){
			btn.disabled = false;
		}
		if(btn.hidden == NULL){
			btn.hidden = false;
		}
		
		//设置Ext按钮对象
		if(btn.menu == NULL){
			var _button = new Ext.Button({
				id: btn.id,//id
				text: btn.text,//按钮文本
				iconCls: btn.iconCls,//按钮图标
				icon: btn.icon,
				cls: !btn.iconCls && btn.icon ? 'x-btn-text-icon' : '',
				disabled: btn.disabled,//是否可用
				hidden : btn.hidden,//是否显示
				handler:function(){//点击事件
					this.blur();
					
					var withObj;
					
					//操作区域的iframe对象的window句柄
					if(document.all){//IE
						withObj = document.frames[0].window;
				  	}else{//Firefox
				   	    withObj = document.getElementsByTagName("iframe")[0].contentWindow;
				   	}
				   	
	//			   	with(withObj){
				   		var f = withObj[fn];
				   		
				   		var resObj = new Object();
				   		
				   		resObj.iconEl = _button;//切换等待图片的Ext句柄
				   		resObj.buttonID = this.id;//按钮id
				   		
				   		//调用回调函数，返回参数resObj
				   		f.call(withObj, resObj);
	//		  	 	}
				}
			});
			
			el.add(_button);//添加
		}
		
		//设置Ext菜单对象
		if(btn.menu != NULL){
			var itemList = [];
			var context = this.context;
			//添加菜单项列表
			for(var i=0;i<btn.menu.items.length;i++){
				var item = btn.menu.items[i];
				var itemObj = new Object();
				
				//菜单分隔符
				if(item == '-'){
					itemList.push(item);
					continue;
				}
				
				itemObj.id = item.id;//菜单项id
				itemObj.text = item.text;//菜单项文本
				itemObj.iconCls = item.iconCls;//菜单项图标
				itemObj.handler = function(){//点击事件
					this.blur();
					
					var withObj;
					
					//操作区域的iframe对象的window句柄
					if(document.all){//IE
						withObj = document.frames[0].window;
				  	}else{//Firefox
				   	    withObj = document.getElementsByTagName("iframe")[0].contentWindow;
				   	}
				   	
	//			   	with(withObj){
				   		var f = withObj[fn];
				   		
				   		var resObj = new Object();
				   		
				   		resObj.iconEl = _button;//切换等待图片的Ext句柄
				   		resObj.buttonID = this.id;//按钮id
				   		
				   		//调用回调函数，返回参数resObj
				   		f.call(withObj, resObj);
	//			   	}
				};
				
				itemList.push(itemObj);
			}
			
			var _button = new Ext.Button({
				id: btn.id,//id
				text: btn.text,//按钮文本
				iconCls: btn.iconCls,//按钮图标
				icon: btn.icon,
				cls: !btn.iconCls && btn.icon ? 'x-btn-text-icon' : '',
				disabled: btn.disabled,//是否可用
				hidden : btn.hidden,//是否显示
				menu:{
					items: itemList //菜单项
			    }
			});
			
			el.add(_button);//添加
		}
	},
	
	/*
		渲染
	*/
	doLayout:function(){
		var el = this.getEl();
		el.doLayout();//渲染
	},
	
	//获取按钮的ext元素
	getButton: function(btnName){
		return Ext.getCmp(btnName);
	}
};
/*
	工具条
	可添加按钮、菜单
*/
var ToolBar = new VPToolBar();