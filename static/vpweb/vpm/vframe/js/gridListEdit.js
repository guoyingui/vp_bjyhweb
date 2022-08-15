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
var NULL = undefined;

//�ɱ༭��Grid���
var GridListEdit = function(data){
	BLANK_IMAGE_URL = "project/images/default/s.gif";
	var ds;
	var cmList = [];
	var dsList = [];
	//ȫѡ��ť��ID
	var checkerID = data.renderTo + "_Chkall";
	 
	//���ص�div�Զ�100%��ȣ����ڼ���grid�Ŀ��
	if(document.getElementById("hidden_width") == NULL){
		var mydiv = document.createElement("div");
		mydiv.setAttribute("id","hidden_width");
		document.body.appendChild(mydiv);
	}
	
	var columnList = data.column;
	//�����ѡ��ťʱ�����
	if(data.selector != NULL){
		//��ѡ��
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
				return '<input class="gridlist-td-checker" type="checkbox" name="'+data.selector.name+'" value="'+record.get(data.selector.valueName)+'" rowIndex="'+rowIndex+'" rowID="'+record.id+'"/>'
			};
			//��ӵ���һ�е�λ����
			cmList.push(cmobj);
		}
	}
	//�����
	for(var i=0;i<columnList.length;i++){
		var c = columnList[i];
		//���ص��в���Ϊ��ʾ��
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
			//�Ƿ�����Ĭ��Ϊfalse
			if(c.sortable != NULL){
				cmobj.sortable = c.sortable;
			}else{
				cmobj.sortable = true;
			}
			//�Զ�����չ����
			if(c.renderer != NULL){
				cmobj.renderer = c.renderer;
			}
			if(c.editable  != NULL){
				cmobj.editable  = c.editable ;
			}else{
				cmobj.editable=true;
			}
			//����
			if(c.editor){
				cmobj.editor = c.editor.className ? new className(c.editor) : c.editor;
			}else if(c.type == 'string'){
				cmobj.editor = new Ext.form.TextField();
			}else if(c.type == 'number'){
				cmobj.editor = new Ext.form.NumberField();
			}else if(c.type == 'date'){
				cmobj.editor = new Ext.form.DateField({format: 'Y��m��d��'});
				cmobj.renderer = Ext.util.Format.dateRenderer('Y��m��d��');
			}
			
			cmList.push(cmobj);
		}
		
		//Store�еĶ���
		var dsobj = new Object();
		
		dsobj.name = c.id;
		dsobj.type = c.type;
		
		dsList.push(dsobj);
		
	}
	
	//�����ʱ���õ�����ģ��
	var rowRecord = new Ext.data.Record.create(dsList);
	
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
		},dsList)
	});
	//�����е�ѡ����ʽ
	var sm = new Ext.grid.RowSelectionModel({
		singleSelect: false
	});
	//grid������ѡ��
	var gridPanelConfig = {
		el: data.renderTo,//htmlԪ�أ�������ʾGrid
		ds: ds,//����Դ
		cm: cm,//�ж���
		sm: sm,
		//viewConfig:{scrollOffset:2},
		//width:document.getElementById("hidden_width").offsetWidth,
		stripeRows: true,//��grid�������б���ɫ��ͬ
		trackMouseOver: true,//��꾭��Ч��
		clicksToEdit: 1//�����༭
	};
	//���Զ�չ����ʱ����
	if(data.autoExpandColumn != NULL){
		gridPanelConfig.autoExpandColumn = data.autoExpandColumn;
	}
	//���ø߶ȣ�û�и߶�ʱ�Զ��ſ�
	if(data.height != NULL){
		if(data.height == 'max'){
			gridPanelConfig.height = document.body.clientHeight;
		}else{
			gridPanelConfig.height = data.height;
		}
	}
	
	//Grid����
	var gridPanel_my = new Ext.grid.EditorGridPanel(gridPanelConfig);
	//������ɺ����
	ds.on("load",function(){
		if(data.selector != NULL){
			//ȫѡ��ťΪδѡ��״̬
			document.getElementById(checkerID).checked = false;
		}
	});

	//��Ⱦ���
	gridPanel_my.render();
	
	//�Զ�����
	if(data.autoLoad){
		ds.load({params:{start:0, limit:10}});
	}
	
	//����ȫѡ��ť�¼�
	var chkallFn = function (){
		var objArr = document.getElementsByName(data.selector.name);
		for(var i =0;i<objArr.length;i++){
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
		document.getElementById(checkerID).onclick = chkallFn;
	}
	
	//��ѡ ��ʱ����Ҫ
	var chkRowsFn = function(){
		if(this.checked){
			//gridPanel_my.sm.selectRow(this.rowIndex,true);
		}else{
			//gridPanel_my.getView().onRowDeselect(this.rowIndex);
		}
	}
   	//window���ڸı��Сʱ�Ŀ������
	if(window.addEventListener){ // Mozilla, Netscape, Firefox
        window.addEventListener('resize', function(){
        	gridPanel_my.setWidth(document.getElementById("hidden_width").offsetWidth);
        	if(data.height != NULL){
				if(data.height == 'max'){
					gridPanel_my.setHeight(document.body.clientHeight);
				}
			}
        }, false);
    } else { // IE
        window.attachEvent('onresize', function(){
        	gridPanel_my.setWidth(document.getElementById("hidden_width").offsetWidth);
        	if(data.height != NULL){
				if(data.height == 'max'){
					gridPanel_my.setHeight(document.body.clientHeight);
				}
			}
        });
    }
    //�ӷ������˻�ȡ���ݲ�����
    //url��������ָ����û��ָ��ʱʹ��ds��ָ����
    this.load = function(urlStr){
    	if(urlStr != NULL){
    		ds.proxy = new Ext.data.HttpProxy({url:urlStr});
    	}
    	ds.load({params:{start:0, limit:10}});
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
    //��ȡѡ�е����ݣ�����record�����飬ûѡ��ʱ�������ݳ���Ϊ0
    this.getSelections = function(){
    	var arr = document.getElementsByName(data.selector.name);
    	var record = [];
    	for(var i=0;i<arr.length;i++){
    		var obj = arr[i];
    		if(obj.checked){
	    		var row = ds.getById(obj.getAttribute('rowID'));
	    		record.push(row);
    		}
    	}
    	return record;
    };
    //ɾ��ѡ�е��м�¼�������أ�������������
    this.deleteRow = function(){
    	var arr = document.getElementsByName(data.selector.name);
    	var record = [];
    	for(var i=0;i<arr.length;i++){
    		var obj = arr[i];
    		if(obj.checked){
	    		var row = ds.getById(obj.getAttribute('rowID'));
	    		record.push(row);
    		}
    	}
    	
    	for(var i=0;i<record.length;i++){
    		ds.remove(record[i]);
    	}
    }
    //ɾ�������м�¼�������أ�������������
    this.deleteAllRow = function(){
        var record=this.getData();
    	for(var i=0;i<record.length;i++){
    		ds.remove(record[i]);
    	}
    }
    //��������׷��һ���µļ�¼
    this.addRow = function(){
    	var rowInfo = new Object();
    	for(var i=0;i<dsList.length;i++){
    		var info = dsList[i];
    		eval("rowInfo." + info.name + " = ''");
    	}
		var r = new rowRecord(rowInfo);
		
		gridPanel_my.stopEditing();
		ds.add(r);
		gridPanel_my.startEditing(0,0);
    }
}