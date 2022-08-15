/*
renderer ���� ����

value : Object 
��Ԫ�������ֵ��The data value for the cell.

metadata : Object 
��Ԫ��Ԫ���ݣ�Cell metadata��������Ҳ�����������е����ԣ�An object in which you may set the following attributes: 

			css : String 
			��Ԫ��CSS��ʽ�ַ�����������tdԪ���ϡ�A CSS class name to add to the cell's TD element.
			
			attr : String 
			һ��HTML���Ե��ַ������������ڱ��Ԫ���ڵ���������Ԫ�أ���'style="color:red;"'����An HTML attribute definition string to apply to the data container element within the table cell (e.g. 'style="color:red;"').


record : Ext.data.record 
����������ȡ��Ext.data.Record��The Ext.data.Record from which the data was extracted.

rowIndex : Number 
��������Row index

colIndex : Number 
��������Column index

store : Ext.data.Store 
��Record����ȡ��Ext.data.Store����The Ext.data.Store object from which the Record was extracted.

*/
Ext.override(Ext.data.HttpProxy,{
    onRead: function(action, o, response) {
		var result;
		try {
			result = o.reader.read(response);
		} catch(e) {
			this.fireEvent('loadexception', this, o, response, e);
			this.fireEvent('exception', this, 'response', action, o, response, e);
			o.request.arg.responseText=response.responseText;
			o.request.callback.call(o.request.scope, null, o.request.arg, false);
			return;
		}
		if (result.success === false) {
			this.fireEvent('loadexception', this, o, response);
			var res = o.reader.readResponse(action, response);
			this.fireEvent('exception', this, 'remote', action, o, res, null);
		} else {
			this.fireEvent('load', this, o, o.request.arg);
		}
		o.request.callback.call(o.request.scope, result, o.request.arg, result.success);
	}
});
   
var NULL = undefined;

//����ҳ��Grid���
var GridList = function(data){
	/*
 	*�޸�chrome��ͷ�ܿ����ÿ�е��ܿ�Ȳ�һ�µ�bug
 	*/
		Ext.override(Ext.grid.GridView,{
		        getColumnStyle : function(colIndex, isHeader) {
		            var colModel  = this.cm,
		                colConfig = colModel.config,
		                style     = isHeader ? '' : colConfig[colIndex].css || '',
		                align     = colConfig[colIndex].align;
		            if(Ext.isChrome){
		               style += String.format("width: {0};", parseInt(this.getColumnWidth(colIndex))-2+'px');
		           }else{
		               style += String.format("width: {0};", this.getColumnWidth(colIndex));
		           }
		           if (colModel.isHidden(colIndex)) {
		               style += 'display: none; ';
		           }
		           if (align) {
		               style += String.format("text-align: {0};", align);
		           }
		          return style;
		       }
		});
	
	var ds;
	var cmList = [];
	var dsList = [];
	//ȫѡ��ť��ID
	var checkerID = data.renderTo + "_Chkall";
	
	var defaultParams = data.defaultParams || {};    //modify by sujf ����Ĭ��������� Object����
	 
	//���ص�div�Զ�100%��ȣ����ڼ���grid�Ŀ��
	if(document.getElementById("hidden_width") == NULL){
		var mydiv = document.createElement("div");
		mydiv.setAttribute("id","hidden_width");
		document.body.appendChild(mydiv);
	}
	
	var columnList = data.column;
	if (data.hide) {
		//ColumnModel�еĶ���
		var cmobj = new Object();
		
		cmobj.header = '<div id="divTree" style="cursor: pointer;" title="'+(data.defaultHide?"��ʾ����":"����������")+'" onclick="doDisplayTree(this,'+data.defaultHide+')"><img src="/project/vframe/images/'+(data.defaultHide?"menuItem":"menuItem2")+'.gif" style="margin-left: -9px"/></div>';
		cmobj.fixed = true;//�����Ըı���
		cmobj.menuDisabled = true;//û�в˵�
		cmobj.width = 12;
		cmobj.dataIndex = '';
		cmobj.sortable = false;
		cmobj.renderer = function(value,metadata,record,rowIndex){
			return "";
		};
		//��ӵ���һ�е�λ����
		cmList.push(cmobj);
	}

	//�����ѡ��ťʱ�����
	if(data.selector != NULL){
		if(data.selector.type == 'checkbox'){
			
			//ColumnModel�еĶ���
			var cmobj = new Object();
			
			cmobj.header = '<input class="gridlist-hd-checker" type="checkbox" id="'+checkerID+'"/>';
			cmobj.fixed = true;//�����Ըı���
			cmobj.menuDisabled = true;//û�в˵�
			cmobj.width = 25;
			cmobj.dataIndex = 'btnGridChkall';
			cmobj.sortable = false;
			cmobj.renderer = function(value,metadata,record,rowIndex){
				var disable = '';
				if(data.selector.disableCondition != null){
					if(eval(data.selector.disableCondition)){
						disable = 'style="display:none"';
					}
				}
				if(data.selectorCenter){
					var columnHeight = data.columnHeight / 2; 
					return '<div style="height:'+data.columnHeight+'px;padding-top:'+columnHeight+'px"><input class="gridlist-td-checker" type="checkbox" name="'+data.selector.name+'" value="'+record.get(data.selector.valueName)+'" rowIndex="'+rowIndex+'" rowID="'+record.id+'" '+disable+'/></div>';
				}else{
					return '<input class="gridlist-td-checker" type="checkbox" name="'+data.selector.name+'" value="'+record.get(data.selector.valueName)+'" rowIndex="'+rowIndex+'" rowID="'+record.id+'" '+disable+'/>';
				}
			};
			//��ӵ���һ�е�λ����
			cmList.push(cmobj);
		}
	}
	//�����ѡ��ťʱ�����
	if(data.selector != NULL){
		if(data.selector.type == 'radio'){
			
			//ColumnModel�еĶ���
			var cmobj = new Object();
			
			cmobj.header = 'ѡ��';
			cmobj.fixed = true;//�����Ըı���
			cmobj.menuDisabled = true;//û�в˵�
			cmobj.width = 35;
			cmobj.dataIndex = 'btnGridChkall';
			cmobj.sortable = false;
			cmobj.renderer = function(value,metadata,record,rowIndex){
				var disable = '';
				if(data.selector.disableCondition != null){
					if(eval(data.selector.disableCondition)){
						disable = 'style="display:none"';
					}
				}
				return '<input class="gridlist-td-checker" type="radio" name="'+data.selector.name+'" value="'+record.get(data.selector.valueName)+'" rowIndex="'+rowIndex+'" rowID="'+record.id+'" '+disable+'/>'
			};
			//��ӵ���һ�е�λ����
			cmList.push(cmobj);
		}
	}
	//�����
	for(var i=0;i<columnList.length;i++){
		var c = columnList[i];
		
		if(c.header != "hidden"){
			//ColumnModel�еĶ���
			var cmobj = new Object();
			
			//����
			cmobj.header = c.header;
			//id
			cmobj.dataIndex = c.id;
			//�Զ�չ������id
			if(data.autoExpandColumn == c.id){
				cmobj.id = c.id;
			}
			//���
			cmobj.width = c.width;
			//�Ƿ�����Ĭ��Ϊtrue
			if(c.sortable != NULL){
				cmobj.sortable = c.sortable;
			}else{
				cmobj.sortable = true;
			}
			//�Զ�����չ����
			if(c.renderer != NULL){
				cmobj.renderer = c.renderer;
			}
			//��ֹ�пɱ䶯��С
			if(c.resizable != NULL){
				cmobj.resizable = c.resizable;
			}
			//��ֹ�в˵�
			if(c.menuDisabled != NULL){
				cmobj.menuDisabled = c.menuDisabled;
			}
			//��ֹ������
			if(c.hideable != NULL){
				cmobj.hideable = c.hideable;
			}
			//�Ƿ�����
			if(c.hidden != NULL){
				cmobj.hidden = c.hidden;
			}
			//�����Զ�����ʽ
			if(c.css != NULL){
				cmobj.css = c.css;
			}
			cmList.push(cmobj);
		}
		
		//Store�еĶ���
		var dsobj = new Object();
		
		dsobj.name = c.id;
		dsobj.type = c.type;
		dsobj.convert = c.convert;
		
		dsList.push(dsobj);
		dsList.push({name:'_errMessage',type:'string'});
	}
	
	var selectPageSize = '';
	selectPageSize += '<select id="selectPageSize">';
	selectPageSize += '<option value="-1">�Զ�������</option>';
	selectPageSize += '<option value="10">10</option>';
	selectPageSize += '<option value="15">15</option>';
	selectPageSize += '<option value="20">20</option>';
	selectPageSize += '<option value="25">25</option>';
	selectPageSize += '<option value="30">30</option>';
	selectPageSize += '<option value="35">35</option>';
	selectPageSize += '<option value="40">40</option>';
	selectPageSize += '</select>';
	
	var selectPageSizeFix = '';
	selectPageSizeFix += '<select id="selectPageSize" style="display:none;">';
	selectPageSizeFix += '<option value="10">10</option>';
	selectPageSizeFix += '</select>';
	
	var dspmsg = true;
	if (data.displayMsg != null) {
		dspmsg = data.displayMsg;
    }
    if (dspmsg == false) {
    	selectPageSize = selectPageSizeFix;
    }
	else {
		selectPageSize = '';
	}
	
	//ColumnModel����
	var cm = new Ext.grid.ColumnModel(cmList);
	
	//����Դ����
	ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({url:data.url}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalProperty',
			root: 'root',
			successProperty: 'successProperty',
			autoLoad: true
		},dsList),
		remoteSort: data.remoteSort,//ͨ������������
		baseParams: defaultParams //modify by sujf 2011-10-21 ����Ĭ���������
	});

	//grid������ѡ��
	var gridPanelConfig = {
		el: data.renderTo,//htmlԪ�أ�������ʾGrid
		ds: ds,//����Դ
		cm: cm,//�ж���
		//viewConfig:{scrollOffset:2},
		//width:document.getElementById("hidden_width").offsetWidth,
		stripeRows: true,//��grid�������б���ɫ��ͬ
		loadMask: false,//�Ƿ���ʾ���ض���
		autoScroll:true,
		enableColumnMove:data.enableColumnMove,//��ק�У�������ʱĬ��������ק��   add by liujie
		//�ײ���ҳ����������
		bbar: new Ext.PagingToolbar({
			pageSize: data.pageSize,//ÿҳ��ʾ�ļ�¼��
			store: ds,//����Դ
			emptyMsg:'<b>û������</b>',
			displayInfo: dspmsg,
			items:['-',selectPageSize],
			height:28
		})
	};
	if(data.processPanleCfg){
		data.processPanleCfg(gridPanelConfig);
	}
	if(data.afterRenderer){
		gridPanelConfig.viewConfig = {listeners:{refresh:data.afterRenderer}};
	}
	//������קʱ����     add by liujie
	if(data.enableColumnMove != NULL){
		gridPanelConfig.enableColumnMove = data.enableColumnMove;
	}else{
		gridPanelConfig.enableColumnMove = true;//Ĭ��Ϊ������ק
	}
	//���Զ�չ����ʱ����
	if(data.autoExpandColumn != NULL){
		gridPanelConfig.autoExpandColumn = data.autoExpandColumn;
	}
	//��ҳʱ����
	if(data.pageSize == NULL){
		delete gridPanelConfig.bbar;
	}
	//���ø߶ȣ�û�и߶�ʱ�Զ��ſ�
	if(data.height != NULL){
		if(data.height == '100%'){
			gridPanelConfig.height = getBodyHeight();
		}else{
			gridPanelConfig.height = data.height;
		}
	}
	//���ÿ�ȣ�û�п��ʱ�Զ��ſ�
	if(data.width != NULL){
		if(data.width == '100%'){
			gridPanelConfig.width = document.getElementById("hidden_width").offsetWidth;
		}else{
			gridPanelConfig.width = data.width;
		}
	}
	else {
		gridPanelConfig.width = document.getElementById("hidden_width").offsetWidth;
	}
	
	//Grid����
	var gridPanel_my = new Ext.grid.GridPanel(gridPanelConfig);
	
	this.orginGrid = gridPanel_my;
	
	//������ɺ����
	if(data.pageSize != NULL){
		gridPanel_my.on("afterrender",function(){
			//û������ʱ�����õ���ҳ�Ĳ���
			with(gridPanel_my.getBottomToolbar()){
				if(cursor == 0){
					inputItem.disable();
					//refresh.hide();//ˢ�°�ť
					inputItem.setValue(0);//����ҳ��
					afterTextItem.setText(String.format(afterPageText, "0"));//��ҳ��
				}
			}
		},this);
	}
	
	//������ɺ����
	ds.on("load",function(){
		if(data.pageSize != NULL){
			//û������ʱ�����õ���ҳ�Ĳ���
			with(gridPanel_my.getBottomToolbar()){
				if(ds.getCount() == 0){
					inputItem.disable();
					//refresh.hide();//ˢ�°�ť
					inputItem.setValue(0);//����ҳ��
					afterTextItem.setText(String.format(afterPageText, "0"));//��ҳ��
				}else{
					inputItem.enable();
					//refresh.show();
				}
			}
		}
		//ȫѡ��ťΪδѡ��״̬
		if(data.selector != NULL){
			if(document.getElementById(checkerID))
				document.getElementById(checkerID).checked = false;
		}
		if(data.onload != NULL){
			data.onload(ds);
		}
	});
	//��Ⱦ���
	gridPanel_my.render();
	
	//�Զ�����
	if(data.autoLoad){
		ds.load({params:{start:0, limit:data.pageSize},
			callback : function(r, options, success) {
				if (success == false) {
					if(options.responseText.indexOf('ϵͳsession��ʱ')!=-1){
						//alert("ϵͳ��ʱ������ʧ�ܣ������µ�¼���ٴε����ť������" );
						Common.showModalWin("/project/timeOutLogin.jsp", "login", 400, 120, function(res){});
					}else{
						alert("��ʱ���û���ֹ���б����ʧ��");
					}
				}else{
					if(r != '' && r.length > 0){
						var msg = r[0].get('_errMessage');
						if(msg != '' && msg != NULL){
							alert("����ʧ�ܣ�������ˢ��ҳ��.\n" + msg);
						}
					}
				}
			}
		});
	}
	
	//����ȫѡ��ť�¼�
	var chkallFn = function (){
		var objArr = document.getElementsByName(data.selector.name);
		for(var i =0;i<objArr.length;i++){
			if(objArr[i].style.display == 'none'){
				continue;
			}
			objArr[i].checked = this.checked;
			if(this.checked){
				gridPanel_my.getView().onRowSelect(i);
			}else{
				gridPanel_my.getView().onRowDeselect(i);
			}
		}
	}

	//��ȫѡ�¼�
	if(data.selector != NULL){ 
		if(document.getElementById(checkerID))
			document.getElementById(checkerID).onclick = chkallFn;
	}
	
	//��ѡ ��ʱ����Ҫ
	var chkRowsFn = function(){
		if(this.checked){
			//gridPanel_my.getView().onRowSelect(this.rowIndex);
		}else{
			//gridPanel_my.getView().onRowDeselect(this.rowIndex);
		}
	}
	var me = this;
	//window���ڸı��Сʱ�Ŀ������
	if(window.addEventListener){ // Mozilla, Netscape, Firefox
		window.addEventListener('resize', function(){me.resize();}, false);
			/*
        window.addEventListener('resize', function(){
        	if(data.width != NULL){
				if(data.width == '100%'){
					gridPanel_my.setWidth(document.getElementById("hidden_width").offsetWidth);
				}
			}
        	if(data.height != NULL){
				if(data.height == '100%'){
					gridPanel_my.setHeight(getBodyHeight());
				}else{
					gridPanel_my.setHeight(data.height);
				}
			}
        }, false);
        */
    } else { // IE
    	window.attachEvent('resize', function(){me.resize();});
    	/*
        window.attachEvent('onresize', function(){
        
        	if(data.width != NULL){
				if(data.width == '100%'){
					gridPanel_my.setWidth(document.getElementById("hidden_width").offsetWidth);
				}
			}
        	if(data.height != NULL){
				if(data.height == '100%'){
					gridPanel_my.setHeight(getBodyHeight());
				}else{
					gridPanel_my.setHeight(data.height);
				}
			}
        });
        */
    }
    
    //�ӷ������˻�ȡ���ݲ�����
    //url��������ָ����û��ָ��ʱʹ��ds��ָ����
    this.load = function(urlStr, paramData){//modify by sujf 2011-10-21 ����������� paramData object����
    	if(urlStr != NULL){
    		ds.proxy = new Ext.data.HttpProxy({url:urlStr});
    	}
    	if(paramData != NULL){
    		ds.baseParams = Ext.apply({},paramData,defaultParams);//modify by sujf 2011-10-21 ����������� paramData object����
    	}
		ds.load({params:{start:0, limit:data.pageSize},
			callback : function(r, options, success) {
				if (success == false) {
					if(options.responseText.indexOf('ϵͳsession��ʱ')!=-1){
						//alert("ϵͳ��ʱ������ʧ�ܣ������µ�¼���ٴε����ť������" );
						Common.showModalWin("/project/timeOutLogin.jsp", "login", 400, 120, function(res){});
					}else{
						alert("��ʱ���û���ֹ���б����ʧ��");
					}
				}else{
					if(r != '' && r.length > 0){
						var msg = r[0].get('_errMessage');
						if(msg != '' && msg != NULL){
							alert("����ʧ�ܣ�������ˢ��ҳ��.\n" + msg);
						}
					}
				}
			}
		});
    };
    
	//���´ӷ������˻�ȡ���ݲ�����,ʹ��ds��ָ����url
    this.reload = function(){
    	ds.reload();
    };
    
    //��ȡ���ݣ�����record������
    this.getData = function(){
		var length = ds.getCount();
		var str = "";
		var record = [];

		for(var i =0;i<length;i++){
			var row = ds.getAt(i);
			
			record.push(row);
		}
		return record;
    };
    //ɾ��ѡ�����
    this.deleteRow = function(){
    	var arr = document.getElementsByName(data.selector.name);
    	var record = [];
    	for(var i=0;i<arr.length;i++){
    		var obj = arr[i];
    		if(obj.checked){
	    		var row = ds.getById(obj.getAttribute("rowID"));
	    		record.push(row);
    		}
    	}
    	
    	for(var i=0;i<record.length;i++){
    		ds.remove(record[i]);
    	}
    }
    //ɾ�����е���
    this.deleteAll = function(){
    	ds.removeAll();
    }
    //��ȡstore����
    this.getStore = function(){
    	return ds;
    }
    //�����
    this.addRow = function(index,record){
		ds.insert(index,record);
    }
    this.selectRow = function(index){
    	gridPanel_my.getView().onRowSelect(index);
    }
    this.focusRow = function(index){
    	gridPanel_my.getView().focusRow(index);
    }
    //��ȡѡ�е����ݣ�����record�����飬ûѡ��ʱ�������ݳ���Ϊ0
    this.getSelections = function(){
    	var arr = document.getElementsByName(data.selector.name);
    	var record = [];
    	for(var i=0;i<arr.length;i++){
    		var obj = arr[i];
    		if(obj.checked){
	    		var row = ds.getById(obj.attributes["rowID"].value);
	    		record.push(row);
    		}
    	}
    	return record;
    };
    //��ȡds�еĵ�ǰ������ ���� sortInfo = {field: field, direction: dir} û������ʱ ����undefined
    this.getSortInfo = function(){
    	return ds.sortInfo;
    }
    //�ӷ������˻�ȡ���ݲ�����
    //url��������ָ����û��ָ��ʱʹ��ds��ָ����
    var changePageSize = function(){
    	var obj = document.getElementById("selectPageSize");
    	if(obj.value != '-1'){
    		gridPanel_my.getBottomToolbar().pageSize = parseInt(obj.value);
    		data.pageSize = obj.value;//modify by sujf 2011-10-21   ����ı�ÿҳ��¼���Ժ��ٵ���load����ʱ������ÿҳ��¼������Ч������
    		ds.load({params:{start:0, limit:obj.value}});
    		obj.options[0].selected = true;
    		obj.blur();
    	}
    };
    //��ҳʱ����
	if(data.pageSize != NULL){
		//Ext.get('selectPageSize').on('change',changePageSize);
	}
	this.setWidth = function (widthNum){
		gridPanel_my.setWidth(widthNum);
	}
	this.setHeight = function (heightNum){
		gridPanel_my.setHeight(heightNum);
	}
	this.reSetWidth = function(){
		if(data.width == NULL || data.width == '100%'){
			this.setWidth(document.getElementById("hidden_width").offsetWidth);
		}else{
			this.setWidth(data.width);
		}
	}
	this.reSetHeight = function(){
		if(data.height == NULL || data.height == '100%'){
			this.setHeight(getBodyHeight());
		}else{
			this.setHeight(data.height);
		}
	}
	this.resizeTime = 0;
    this.resize = function(){
    	this.reSetWidth();
		this.reSetHeight();
		if(this.resizeTime++==0){
			this.resize();
			this.resizeTime=0;
		}
    }
}

function getBodyHeight(){
	var height = 0;
	/*
	var headObj = document.getElementById('headRegion');
	var headObjHeight = 0;
	var bodyHeight = document.body.clientHeight;
	if(headObj != NULL){
		headObjHeight = headObj.offsetHeight;
	}
	
	var toolbarObj = document.getElementById('toolbar');
	var toolbarObjHeight = 0;
	if(toolbarObj != NULL){
		toolbarObjHeight = toolbarObj.offsetHeight;
	}
	*/
	if (document.getElementById('headRegionMyWork') == null && parent.location.href.indexOf("index.jsp") != -1) {
		var titleRegion = document.getElementById('titleRegion');
		if (titleRegion == null) {
			titleRegion = parent.document.getElementById('titleRegion');
		}
		if(titleRegion != NULL){ 
			height += titleRegion.offsetHeight;
		}
		
		var headRegion = document.getElementById('headRegion');		
		if (headRegion == null || headRegion.offsetHeight == 0) {
			headRegion = parent.document.getElementById('headRegion');
		}
		if(headRegion != NULL){ 
			height += headRegion.offsetHeight - 1;
		}
		/*
		var toolbarObj = document.getElementById('toolbar');
		if (toolbarObj == null || toolbarObj.offsetHeight == 0) {
			toolbarObj = parent.document.getElementById('toolbar');
		}
		if(toolbarObj != NULL){ 
			height += toolbarObj.offsetHeight;
		}
		*/
		bodyHeight = document.body.clientHeight - height;
	}
	else {		
		var headRegion = document.getElementById('headRegion');	
		if (headRegion == null || headRegion.offsetHeight == 0) {
			bodyHeight = document.body.clientHeight;
		}
		else {
			if(headRegion != NULL){ 
				height += headRegion.offsetHeight - 1;
			}
			bodyHeight = document.body.clientHeight - height;
		}
	}
	return bodyHeight;
}