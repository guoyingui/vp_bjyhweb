/*
	������
	����Ӱ�ť���˵�
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
	��ʼ��������
	string render����Ӧҳ��div��id
	string callBackFn����ť�����ص��ĺ�������
	*/
	init: function(render,callBackFn,toolBarClass){
		this._call_back_fn = callBackFn;
		
		//��ӹ�����������ʽ
		this._toobar_render = new Ext.Toolbar({ctCls:(toolBarClass||'right_toolbar')});
		this._toobar_render.render(render);
	},
	
	/*
		��ȡ����������
	*/
	getEl: function(){
		return this._toobar_render;
	},
	
	/*
		��Ӱ�ť
		object btn����ť����
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
		
		//����Ext��ť����
		if(btn.menu == NULL){
			var _button = new Ext.Button({
				id: btn.id,//id
				text: btn.text,//��ť�ı�
				iconCls: btn.iconCls,//��ťͼ��
				icon: btn.icon,
				cls: !btn.iconCls && btn.icon ? 'x-btn-text-icon' : '',
				disabled: btn.disabled,//�Ƿ����
				hidden : btn.hidden,//�Ƿ���ʾ
				handler:function(){//����¼�
					this.blur();
					
					var withObj;
					
					//���������iframe�����window���
					if(document.all){//IE
						withObj = document.frames[0].window;
				  	}else{//Firefox
				   	    withObj = document.getElementsByTagName("iframe")[0].contentWindow;
				   	}
				   	
	//			   	with(withObj){
				   		var f = withObj[fn];
				   		
				   		var resObj = new Object();
				   		
				   		resObj.iconEl = _button;//�л��ȴ�ͼƬ��Ext���
				   		resObj.buttonID = this.id;//��ťid
				   		
				   		//���ûص����������ز���resObj
				   		f.call(withObj, resObj);
	//		  	 	}
				}
			});
			
			el.add(_button);//���
		}
		
		//����Ext�˵�����
		if(btn.menu != NULL){
			var itemList = [];
			var context = this.context;
			//��Ӳ˵����б�
			for(var i=0;i<btn.menu.items.length;i++){
				var item = btn.menu.items[i];
				var itemObj = new Object();
				
				//�˵��ָ���
				if(item == '-'){
					itemList.push(item);
					continue;
				}
				
				itemObj.id = item.id;//�˵���id
				itemObj.text = item.text;//�˵����ı�
				itemObj.iconCls = item.iconCls;//�˵���ͼ��
				itemObj.handler = function(){//����¼�
					this.blur();
					
					var withObj;
					
					//���������iframe�����window���
					if(document.all){//IE
						withObj = document.frames[0].window;
				  	}else{//Firefox
				   	    withObj = document.getElementsByTagName("iframe")[0].contentWindow;
				   	}
				   	
	//			   	with(withObj){
				   		var f = withObj[fn];
				   		
				   		var resObj = new Object();
				   		
				   		resObj.iconEl = _button;//�л��ȴ�ͼƬ��Ext���
				   		resObj.buttonID = this.id;//��ťid
				   		
				   		//���ûص����������ز���resObj
				   		f.call(withObj, resObj);
	//			   	}
				};
				
				itemList.push(itemObj);
			}
			
			var _button = new Ext.Button({
				id: btn.id,//id
				text: btn.text,//��ť�ı�
				iconCls: btn.iconCls,//��ťͼ��
				icon: btn.icon,
				cls: !btn.iconCls && btn.icon ? 'x-btn-text-icon' : '',
				disabled: btn.disabled,//�Ƿ����
				hidden : btn.hidden,//�Ƿ���ʾ
				menu:{
					items: itemList //�˵���
			    }
			});
			
			el.add(_button);//���
		}
	},
	
	/*
		��Ⱦ
	*/
	doLayout:function(){
		var el = this.getEl();
		el.doLayout();//��Ⱦ
	},
	
	//��ȡ��ť��extԪ��
	getButton: function(btnName){
		return Ext.getCmp(btnName);
	}
};
/*
	������
	����Ӱ�ť���˵�
*/
var ToolBar = new VPToolBar();