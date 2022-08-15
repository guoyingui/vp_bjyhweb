/*
	工具条
	可添加按钮、菜单
*/
var NULL=null;
var ListToolBar = {

	_toobar_render: NULL,
	_call_back_fn: NULL,
	_formIframe: NULL,
	
	/*
		初始化工具条
		string render：对应页面div的id
		string callBackFn：按钮点击后回调的函数名称
	*/
	init: function(render,callBackFn){
		this._call_back_fn = callBackFn;
		
		//添加工具条背景样式
		this._toobar_render = new Ext.Toolbar({ctCls:'right_toolbar'});
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
				disabled: btn.disabled,//是否可用
				hidden : btn.hidden,//是否显示
				handler:function(){//点击事件
					this.blur();
				   	var f = eval(fn);
				   	var resObj = new Object();
				   	resObj.iconEl = this;//切换等待图片的Ext句柄
				   	resObj.buttonID = btn.id;//按钮id
				   	//调用回调函数，返回参数resObj
				   	f(resObj);

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
