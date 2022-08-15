/*
renderer 方法 参数

value : Object 
单元格的数据值。The data value for the cell.

metadata : Object 
单元格元数据（Cell metadata）对象。你也可以设置下列的属性：An object in which you may set the following attributes: 

			css : String 
			单元格CSS样式字符串，作用在td元素上。A CSS class name to add to the cell's TD element.
			
			attr : String 
			一段HTML属性的字符串，将作用于表格单元格内的数据容器元素（如'style="color:red;"'）。An HTML attribute definition string to apply to the data container element within the table cell (e.g. 'style="color:red;"').


record : Ext.data.record 
从数据中提取的Ext.data.Record。The Ext.data.Record from which the data was extracted.

rowIndex : Number 
行索引。Row index

colIndex : Number 
列索引。Column index

store : Ext.data.Store 
从Record中提取的Ext.data.Store对象。The Ext.data.Store object from which the Record was extracted.

*/
var NULL = undefined;

//可编辑的Grid表格
var GridListEdit = function(data){
	BLANK_IMAGE_URL = "project/images/default/s.gif";
	var ds;
	var cmList = [];
	var dsList = [];
	//全选按钮的ID
	var checkerID = data.renderTo + "_Chkall";
	 
	//隐藏的div自动100%宽度，用于计算grid的款度
	if(document.getElementById("hidden_width") == NULL){
		var mydiv = document.createElement("div");
		mydiv.setAttribute("id","hidden_width");
		document.body.appendChild(mydiv);
	}
	
	var columnList = data.column;
	//如果有选择按钮时则添加
	if(data.selector != NULL){
		//复选框
		if(data.selector.type == 'checkbox'){
			
			//ColumnModel列的定义
			var cmobj = new Object();
			
			cmobj.header = '<input class="gridlist-hd-checker" type="checkbox" id="'+checkerID+'"/>';
			cmobj.fixed = true;//不可以改变宽度
			cmobj.menuDisabled = true;//没有菜单
			cmobj.width = 25;
			cmobj.dataIndex = 'btnGridChkall';
			cmobj.sortable = false;
			cmobj.renderer = function(value,metadata,record,rowIndex){
				return '<input class="gridlist-td-checker" type="checkbox" name="'+data.selector.name+'" value="'+record.get(data.selector.valueName)+'" rowIndex="'+rowIndex+'" rowID="'+record.id+'"/>'
			};
			//添加到第一列的位置上
			cmList.push(cmobj);
		}
	}
	//添加列
	for(var i=0;i<columnList.length;i++){
		var c = columnList[i];
		//隐藏的列不作为显示项
		if(c.header != "hidden"){
			//ColumnModel列的定义
			var cmobj = new Object();
			//标题
			cmobj.header = c.header;
			//id
			cmobj.dataIndex = c.id;
			//自动展开的列id
			if(data.autoExpandColumn == c.id){
				cmobj.id = c.id;
			}
			//宽度
			cmobj.width = c.width;
			//是否排序，默认为false
			if(c.sortable != NULL){
				cmobj.sortable = c.sortable;
			}else{
				cmobj.sortable = true;
			}
			//自定义扩展函数
			if(c.renderer != NULL){
				cmobj.renderer = c.renderer;
			}
			if(c.editable  != NULL){
				cmobj.editable  = c.editable ;
			}else{
				cmobj.editable=true;
			}
			//类型
			if(c.editor){
				cmobj.editor = c.editor.className ? new className(c.editor) : c.editor;
			}else if(c.type == 'string'){
				cmobj.editor = new Ext.form.TextField();
			}else if(c.type == 'number'){
				cmobj.editor = new Ext.form.NumberField();
			}else if(c.type == 'date'){
				cmobj.editor = new Ext.form.DateField({format: 'Y年m月d日'});
				cmobj.renderer = Ext.util.Format.dateRenderer('Y年m月d日');
			}
			
			cmList.push(cmobj);
		}
		
		//Store列的定义
		var dsobj = new Object();
		
		dsobj.name = c.id;
		dsobj.type = c.type;
		
		dsList.push(dsobj);
		
	}
	
	//添加行时所用的数据模板
	var rowRecord = new Ext.data.Record.create(dsList);
	
	//ColumnModel定义
	var cm = new Ext.grid.ColumnModel(cmList);
	
	//数据源定义
	
	ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({url:data.url}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalProperty',
			root: 'root',
			successProperty: 'successProperty',
			autoLoad: true
		},dsList)
	});
	//配置行的选择样式
	var sm = new Ext.grid.RowSelectionModel({
		singleSelect: false
	});
	//grid的配置选项
	var gridPanelConfig = {
		el: data.renderTo,//html元素，用于显示Grid
		ds: ds,//数据源
		cm: cm,//列定义
		sm: sm,
		//viewConfig:{scrollOffset:2},
		//width:document.getElementById("hidden_width").offsetWidth,
		stripeRows: true,//让grid相邻两行背景色不同
		trackMouseOver: true,//鼠标经过效果
		clicksToEdit: 1//单击编辑
	};
	//有自动展开列时设置
	if(data.autoExpandColumn != NULL){
		gridPanelConfig.autoExpandColumn = data.autoExpandColumn;
	}
	//设置高度，没有高度时自动撑开
	if(data.height != NULL){
		if(data.height == 'max'){
			gridPanelConfig.height = document.body.clientHeight;
		}else{
			gridPanelConfig.height = data.height;
		}
	}
	
	//Grid定义
	var gridPanel_my = new Ext.grid.EditorGridPanel(gridPanelConfig);
	//加载完成后调用
	ds.on("load",function(){
		if(data.selector != NULL){
			//全选按钮为未选择状态
			document.getElementById(checkerID).checked = false;
		}
	});

	//渲染表格
	gridPanel_my.render();
	
	//自动加载
	if(data.autoLoad){
		ds.load({params:{start:0, limit:10}});
	}
	
	//定义全选按钮事件
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
	//绑定全选事件
	if(data.selector != NULL){
		document.getElementById(checkerID).onclick = chkallFn;
	}
	
	//单选 暂时不需要
	var chkRowsFn = function(){
		if(this.checked){
			//gridPanel_my.sm.selectRow(this.rowIndex,true);
		}else{
			//gridPanel_my.getView().onRowDeselect(this.rowIndex);
		}
	}
   	//window窗口改变大小时的宽度设置
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
    //从服务器端获取数据并加载
    //url可以重新指定，没有指定时使用ds中指定的
    this.load = function(urlStr){
    	if(urlStr != NULL){
    		ds.proxy = new Ext.data.HttpProxy({url:urlStr});
    	}
    	ds.load({params:{start:0, limit:10}});
    };
	//重新从服务器端获取数据并加载,使用ds中指定的url
    this.reload = function(){
    	ds.reload();
    };
    //获取数据，返回record的数组
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
    //获取选中的数据，返回record的数组，没选中时返回数据长度为0
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
    //删除选中的行记录，仅本地，不包含服务器
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
    //删除所有行记录，仅本地，不包含服务器
    this.deleteAllRow = function(){
        var record=this.getData();
    	for(var i=0;i<record.length;i++){
    		ds.remove(record[i]);
    	}
    }
    //在最下面追加一条新的记录
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