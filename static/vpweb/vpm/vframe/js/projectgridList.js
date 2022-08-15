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

//带分页的Grid表格
var GridList = function(data){
	/*
 	*修复chrome表头总宽度与每行的总宽度不一致的bug
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
				var disable = '';
				if(data.selector.disableCondition != null){
					if(eval(data.selector.disableCondition)){
						disable = 'style="display:none"';
					}
				}
				return '<input class="gridlist-td-checker" type="checkbox" name="'+data.selector.name+'" value="'+record.get(data.selector.valueName)+'" rowIndex="'+rowIndex+'" rowID="'+record.id+'" '+disable+'/>'
			};
			//添加到第一列的位置上
			cmList.push(cmobj);
		}
	}
	//添加列
	for(var i=0;i<columnList.length;i++){
		var c = columnList[i];
		
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
			//是否排序，默认为true
			if(c.sortable != NULL){
				cmobj.sortable = c.sortable;
			}else{
				cmobj.sortable = true;
			}
			//自定义扩展函数
			if(c.renderer != NULL){
				cmobj.renderer = c.renderer;
			}
			//禁止列可变动大小
			if(c.resizable != NULL){
				cmobj.resizable = c.resizable;
			}
			//禁止列菜单
			if(c.menuDisabled != NULL){
				cmobj.menuDisabled = c.menuDisabled;
			}
			//禁止隐藏列
			if(c.hideable != NULL){
				cmobj.hideable = c.hideable;
			}
			cmList.push(cmobj);
		}
		
		//Store列的定义
		var dsobj = new Object();
		
		dsobj.name = c.id;
		dsobj.type = c.type;
		
		dsList.push(dsobj);
		dsList.push({name:'_errMessage',type:'string'});
	}
	
	var selectPageSize = '';
	selectPageSize += '<select id="selectPageSize">';
	selectPageSize += '<option value="-1">自定义行数</option>';
	selectPageSize += '<option value="10">10</option>';
	selectPageSize += '<option value="15">15</option>';
	selectPageSize += '<option value="20">20</option>';
	selectPageSize += '<option value="25">25</option>';
	selectPageSize += '<option value="30">30</option>';
	selectPageSize += '<option value="35">35</option>';
	selectPageSize += '<option value="40">40</option>';
	selectPageSize += '</select>';
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
		},dsList),
		remoteSort: data.remoteSort//通过服务器排序
	});

	//grid的配置选项
	var gridPanelConfig = {
		el: data.renderTo,//html元素，用于显示Grid
		ds: ds,//数据源
		cm: cm,//列定义
		//viewConfig:{scrollOffset:2},
		//width:document.getElementById("hidden_width").offsetWidth,
		stripeRows: true,//让grid相邻两行背景色不同
		loadMask: true,//是否显示加载动画
		//底部分页工具条定义
		bbar: new Ext.PagingToolbar({
			pageSize: data.pageSize,//每页显示的记录数
			store: ds,//数据源
			emptyMsg:'<b>没有数据</b>',
			displayInfo: true,
			items:['-',selectPageSize]
		})
	};
	//渲染完成后调用，每次load或reload后均会调用
	if(data.afterRenderer){
		gridPanelConfig.viewConfig = {listeners:{refresh:data.afterRenderer}};
	}
	//有自动展开列时设置
	if(data.autoExpandColumn != NULL){
		gridPanelConfig.autoExpandColumn = data.autoExpandColumn;
	}
	//分页时设置
	if(data.pageSize == NULL){
		delete gridPanelConfig.bbar;
	}
	//设置高度，没有高度时自动撑开
	if(data.height != NULL){
		if(data.height == '100%'){
			gridPanelConfig.height = getBodyHeight();
		}else{
			gridPanelConfig.height = data.height;
		}
	}
	//设置宽度，没有宽度时自动撑开
	if(data.width != NULL){
		if(data.width == '100%'){
			gridPanelConfig.width = document.getElementById("hidden_width").offsetWidth;
		}else{
			gridPanelConfig.width = data.width;
		}
	}
	
//Grid定义
	//aishifu
	var gridPanel_my = new Ext.grid.GridPanel(gridPanelConfig);
	var cb = new Ext.grid.RowSelectionModel({   
		singleSelect:true //如果值是false，表明可以选择多行；否则只能选择一行  
		

	});   

	gridPanel_my.addListener('rowclick', rowclickFn);   
	  
		function rowclickFn(grid, rowindex, e){   
			var hidProjectid = document.getElementById("hidProjectid");
			var innerhtml = "";
			grid.getSelectionModel().each(function(rec){   
			var sm = grid.getSelectionModel();
			var record = sm.getSelected();
			//hidProjectid.removeChild();
			innerhtml+="<input type=\"hidden\" name=\"projectids\" value="+rec.get('projectid')+">";
			
		});   
			hidProjectid.innerHTML=innerhtml;
	}  
	


//gridPanel_my.on("rowcontextmenu'",function(gridPanel_my,rowIndex,e)
//	{
//	e.preventDefault();
//    gridPanel_my.getSelectionModel().selectRow(rowIndex);
//    rightClick.showAt(e.getXY());
//})

	//加载完成后调用
	if(data.pageSize != NULL){
		gridPanel_my.on("afterrender",function(){
			//没有数据时，禁用掉翻页的操作
			with(gridPanel_my.getBottomToolbar()){
				if(cursor == 0){
					inputItem.disable();
					//refresh.hide();//刷新按钮
					inputItem.setValue(0);//输入页码
					afterTextItem.setText(String.format(afterPageText, "0"));//总页码
				}
			}
		},this);
	}
	
	//加载完成后调用
	ds.on("load",function(){
		if(data.pageSize != NULL){
			//没有数据时，禁用掉翻页的操作
			with(gridPanel_my.getBottomToolbar()){
				if(ds.getCount() == 0){
					inputItem.disable();
					//refresh.hide();//刷新按钮
					inputItem.setValue(0);//输入页码
					afterTextItem.setText(String.format(afterPageText, "0"));//总页码
				}else{
					inputItem.enable();
					//refresh.show();
				}
			}
		}
		//全选按钮为未选择状态
		if(data.selector != NULL){
			document.getElementById(checkerID).checked = false;
		}
		if(data.onload != NULL){
			data.onload(ds);
		}
	});

	//渲染表格
	gridPanel_my.render();
	//自动加载
	if(data.autoLoad){
		ds.load({params:{start:0, limit:data.pageSize},
			callback : function(r, options, success) {
				if (success == false) {
					alert("加载失败，请重新刷新页面.");
				}else{
					if(r != '' && r.length > 0){
						var msg = r[0].get('_errMessage');
						if(msg != '' && msg != NULL){
							alert("加载失败，请重新刷新页面.\n" + msg);
						}
					}
				}
			}
		});
	}
	
	//定义全选按钮事件
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

	//绑定全选事件
	if(data.selector != NULL){
		document.getElementById(checkerID).onclick = chkallFn;
	}
	
	//单选 暂时不需要
	var chkRowsFn = function(){
		if(this.checked){
			//gridPanel_my.getView().onRowSelect(this.rowIndex);
		}else{
			//gridPanel_my.getView().onRowDeselect(this.rowIndex);
		}
	}
	
	var me = this;
	//window窗口改变大小时的宽度设置
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
    
    //从服务器端获取数据并加载
    //url可以重新指定，没有指定时使用ds中指定的
    this.load = function(urlStr){
    	if(urlStr != NULL){
    		ds.proxy = new Ext.data.HttpProxy({url:urlStr});
    	}
		ds.load({params:{start:0, limit:data.pageSize},
			callback : function(r, options, success) {
				if (success == false) {
					alert("加载失败，请重新刷新页面.");
				}else{
					if(r != '' && r.length > 0){
						var msg = r[0].get('_errMessage');
						if(msg != '' && msg != NULL){
							alert("加载失败，请重新刷新页面.\n" + msg);
						}
					}
				}
			}
		});
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
    //删除选择的行
    this.deleteRow = function(){
    	var arr = document.getElementsByName(data.selector.name);
    	var record = [];
    	for(var i=0;i<arr.length;i++){
    		var obj = arr[i];
    		if(obj.checked){
	    		var row = ds.getById(obj.rowID);
	    		record.push(row);
    		}
    	}
    	
    	for(var i=0;i<record.length;i++){
    		ds.remove(record[i]);
    	}
    }
    //删除所有的行
    this.deleteAll = function(){
    	ds.removeAll();
    }
    //获取store对象
    this.getStore = function(){
    	return ds;
    }
    //添加行
    this.addRow = function(index,record){
		ds.insert(index,record);
    }
    this.selectRow = function(index){
    	gridPanel_my.getView().onRowSelect(index);
    }
    this.focusRow = function(index){
    	gridPanel_my.getView().focusRow(index);
    }
    //获取选中的数据，返回record的数组，没选中时返回数据长度为0
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
    //获取ds中的当前的排序 返回 sortInfo = {field: field, direction: dir} 没有排序时 返回undefined
    this.getSortInfo = function(){
    	return ds.sortInfo;
    }
    //从服务器端获取数据并加载
    //url可以重新指定，没有指定时使用ds中指定的
    var changePageSize = function(){
    	var obj = document.getElementById("selectPageSize");
    	if(obj.value != '-1'){
    		gridPanel_my.getBottomToolbar().pageSize = parseInt(obj.value);
    		ds.load({params:{start:0, limit:obj.value}});
    		obj.options[0].selected = true;
    		obj.blur();
    	}
    };
    //分页时设置
	if(data.pageSize != NULL){
		Ext.get('selectPageSize').on('change',changePageSize);
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
	/*
	var headObj = document.getElementById('headRegion');
	var headObjHeight = 0;
	var bodyHeight = document.body.clientHeight;
	if(headObj != NULL){
		headObjHeight = headObj.offsetHeight;
	}
	
	bodyHeight = bodyHeight -  headObjHeight;
	return bodyHeight;
	*/
	var height = 0;
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
		height += headRegion.offsetHeight;
	}


	var toolbarObj = document.getElementById('toolbar');
	if (toolbarObj == null) {
		toolbarObj = parent.document.getElementById('toolbar');
	}
	if(toolbarObj != NULL){ 
		height += toolbarObj.offsetHeight;
	}
	bodyHeight = document.body.clientHeight - height;
	return bodyHeight;
}