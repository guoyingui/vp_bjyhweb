/*
	������
	����Ӱ�ť���˵�
*/
var NULL=null;
var SiftToolBar = {

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
	addright: function(btn){
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
			
			el.add('->',_button);//���
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

function addSifterBts(){
	SiftToolBar.init('sifttoolbar','clickBtn');
    var genBtn = {id: 'viewBtn',text:'���ɱ���',iconCls:'btn_icon_032'};
    var calBtn = {id: 'cancelBtn',text:'�ر�',iconCls:'btn_icon_008'};
	SiftToolBar.add(genBtn);
	SiftToolBar.add(calBtn);
	SiftToolBar.doLayout();
}

var pagepart1='<\%@ page contentType="text/html; charset=GBK" \%>\r\n'+
	'<html>\r\n'+
	'<head>\r\n'+
	'<META HTTP-EQUIV="Pragma" CONTENT="no-cache">\r\n'+
	'<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">\r\n'+
	'<title>\r\n'+
	'</title>\r\n'+
	'<jsp:include flush="true" page="/include.jsp?file=jquery,ext,toolBar"></jsp:include>\r\n'+
	'<link href="/project/css/style.css" rel="stylesheet" type="text/css">\r\n'+
	'<script type="text/javascript" src="../js/jquery-1.3.2.js"></script>\r\n'+
	'<script language="javascript" src="/project/js/siftButton.js"></script>\r\n'+
	'<script src="/project/vframe/js/common.js"></script>\r\n'+
	'<script src="/project/vframe/js/search.js"></script>\r\n'+
	'<script language="javascript">\r\n'+
	'	var shouldInit=true;\r\n'+
	'</script>\r\n'+
	'</head>\r\n'+
	'<body bgcolor="#f5f5f5" >\r\n'+
	'	<div id="sifttoolbar"></div>\r\n'+
	'	<div   style="position:static;z-index:1;" >\r\n';
	

var pagepart3='</div><\/body>\r\n'+
			'<script language="javascript" >\r\n'+
			'Ext.onReady(function(){\r\n'+
			'		addSifterBts();\r\n'+	
			'});\r\n'+
			'function clickBtn(resObj){\r\n'+	
			'		switch(resObj.buttonID){\r\n'+
			'				case "viewBtn":\r\n'+
			'					collectParameters();\r\n'+
			'					break;\r\n'+
			'				case "cancelBtn":\r\n'+
			'					window.close();\r\n'+
			'					break;\r\n'+
			'		}\r\n'+
			'}\r\n'+
			'function collectParameters(){\r\n'+
			'	window.opener=window.opener==undefined?window.dialogArguments:window.opener;\r\n'+
			'	var reportParameters=window.opener.reportParameters;\r\n'+
			'	jQuery(\'.reportparameter\').each(function(){\r\n'+
			'		eval(\'reportParameters.\'+jQuery(this).attr(\'para-name\')+\'="";\');\r\n'+
			'	});\r\n'+
			'	jQuery(\'.reportparameter\').each(function(){\r\n'+
			'		if(jQuery(this).attr(\'type\')==\'checkbox\'||jQuery(this).attr(\'type\')==\'radio\'){\r\n'+
			'			if(!jQuery(this).is(\':checked\'))\r\n'+
			'				return;\r\n'+
			'		}\r\n'+
			'		if(eval(\'reportParameters.\'+jQuery(this).attr(\'para-name\'))!=\'\')\r\n'+
			'			eval(\'reportParameters.\'+jQuery(this).attr(\'para-name\')+\'+=",\'+jQuery(this).val()+\'"\');\r\n'+
			'		else\r\n'+
			'			eval(\'reportParameters.\'+jQuery(this).attr(\'para-name\')+\'="\'+jQuery(this).val()+\'"\');\r\n'+
			'	});\r\n'+
			'	window.opener.refrashReport();\r\n'+
			'	window.close();\r\n'+
			'}\r\n'+
			'</script>\r\n'+
			'</html>\r\n';
			

function genJspParameter(contentstr){
	return pagepart1+contentstr+pagepart3;
}
