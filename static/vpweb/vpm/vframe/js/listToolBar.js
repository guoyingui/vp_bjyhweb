/*
	������
	����Ӱ�ť���˵�
*/
var NULL=null;
var ListToolBar = {

	_toobar_render: NULL,
	_call_back_fn: NULL,
	_formIframe: NULL,
	
	/*
		��ʼ��������
		string render����Ӧҳ��div��id
		string callBackFn����ť�����ص��ĺ�������
	*/
	init: function(render,callBackFn){
		this._call_back_fn = callBackFn;
		
		//��ӹ�����������ʽ
		this._toobar_render = new Ext.Toolbar({ctCls:'right_toolbar'});
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
				disabled: btn.disabled,//�Ƿ����
				hidden : btn.hidden,//�Ƿ���ʾ
				handler:function(){//����¼�
					this.blur();
				   	var f = eval(fn);
				   	var resObj = new Object();
				   	resObj.iconEl = this;//�л��ȴ�ͼƬ��Ext���
				   	resObj.buttonID = btn.id;//��ťid
				   	//���ûص����������ز���resObj
				   	f(resObj);

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
