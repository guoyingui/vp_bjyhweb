

vpGantt.pareseDate=function(d){
	if(!d)return ;
	d=d.split('-');
	var date=new Date();
	date.setFullYear(parseInt(d[0]));
	date.setMonth(parseInt(d[1].replace(/^0/,''))-1);
	date.setDate(parseInt(d[2].replace(/^0/,'')));
	return date;
}
vpGantt.setCfgParas=function(){
	var g=vpGantt.gCfg;
	vpGantt.showDetail=function(taskId){
		
		g.editFunc(taskId,vpGantt.recordCache[taskId]);
	}
	vpGantt.recordCache={};
	vpGantt.enDrag=g.enDrag===false?false:true;
	vpGantt.taskPartTitle=g.taskPartTitle||'任务树';
	vpGantt.ganttPartTitle=g.ganttPartTitle||'甘特图';
	vpGantt.taskPartWidth=g.taskPartWidth||800;
	vpGantt.saveUrl=g.saveDataUrl;
	vpGantt.saveParas=g.saveParas||{
		themethod: 'loadEditGanttData',
		projectId:616,
		taskId:0
	};
	vpGantt.loadUrl=g.loadDataUrl;
	vpGantt.loadParas=g.loadParas||{testPara:'test'};
	
	vpGantt.startDate = vpGantt.pareseDate(g.startDate);
	vpGantt.endDate = vpGantt.pareseDate(g.endDate);
	
	var fullscreen=10,st=vpGantt.startDate.getTime(),et=vpGantt.endDate.getTime(), weekNum=Math.ceil((et-st)/604800000)-1;
	
	if(weekNum<fullscreen){
		var sn= Math.ceil((fullscreen-weekNum)/2),en=fullscreen-weekNum-sn;
		vpGantt.startDate=new Date(st-(604800000*sn));
		vpGantt.endDate=new Date(et+(604800000*en));
	}
	
	vpGantt.showCompareGantt=!!g.showCompareGantt;
	vpGantt.colsCfg=g.colsCfg;
	vpGantt.resortCols=g.resortCols;
	vpGantt.skipAllHoliday=g.skipAllHoliday||false;
	vpGantt.buildedListen=g.listen||function(){};
	if(g.contextFunc){
		for(var f in g.contextFunc){
			if(Object.prototype.toString.apply(g.contextFunc[f])=='[object Function]'){
				window[f]=g.contextFunc[f];
			}
		}
	}
};
vpGantt.setCfgParas();

//编辑视图编辑时滚动问题
Ext.view.Table.prototype.focusRow=function(rowIdx){
	 var me = this,
           row,
           gridCollapsed = me.ownerCt && me.ownerCt.collapsed,
           record;

       
       if (me.isVisible(true) && !gridCollapsed && (row = me.getNode(rowIdx, true)) && me.el) {
           record = me.getRecord(row);
           rowIdx = me.indexInStore(row);

           
           me.selModel.setLastFocused(record);
			//tested
           //row.focus();
           me.focusedRow = row;
           me.fireEvent('rowfocus', record, row, rowIdx);
       }
};

vpGantt.log=function(obj){


};
vpGantt.showWindow=function(url){

   var x=600;
   var y=300;
   var xx=(window.screen.width-x)/2;
   var yy=(window.screen.height-y)/2;
   window.open(url,"abc","top="+yy+",left="+xx+",width="+x+",height="+y+",scrollbars=yes,resizable=yes");
}
vpGantt.initMask();


function clickOpr(obj, rowIndex){
	var cur=Ext.get(obj);
	vpGantt.rowMenu.showAt(cur.getX()+17,cur.getY()+3);
}
function itemOver(obj){
	if(!obj.status || !obj.status=="clicked"){
		obj.src = "../../vpm/vframe/images/other/icon_openhover.gif";
	}
}
function itemOut(obj){
	if(!obj.status || !obj.status=="clicked"){
		obj.src = "../../vpm/vframe/images/other/icon_openlink.gif";
	}
}
vpGantt.taskFields=[{
	name: "Id"
},
{
	name: "Duration",
	type: "number",
	useNull: true
},
{
	name: "Effort",
	type: "number",
	useNull: true
},
{
	name: "EffortUnit",
	type: "string",
	defaultValue: "h"
},
{
	name: "CalendarId",
	type: "string"
},
{
	name: "Note",
	type: "string"
},
{
	name: "DurationUnit",
	type: "string",
	defaultValue: "d",
	convert: function(a) {
		return a || "d"
	}
},
{
	name: "PercentDone",
	type: "number",
	defaultValue: 0
},
{
	name: "ManuallyScheduled",
	type: "boolean",
	defaultValue: false
},
{
	name: "SchedulingMode",
	type: "string",
	defaultValue: "Normal"
},
{
	name: "BaselineStartDate",
	type: "date",
	dateFormat: "c"
},
{
	name: "BaselineEndDate",
	type: "date",
	dateFormat: "c"
},
{
	name: "BaselinePercentDone",
	type: "int",
	defaultValue: 0
},
{
	name: "Draggable",
	type: "boolean",
	persist: false,
	defaultValue: true
},
{
	name: "Resizable",
	persist: false
},
{
	name: "PhantomId",
	type: "string"
},
{
	name: "PhantomParentId",
	type: "string"
},
{
	name: "index",
	type: "int",
	persist: true
}

//vp自己的东西
,{
	name : "DependencyTask",
	type : "string"
},{
	name : "KeyTask",
	type : "boolean",
	defaultValue : false
}
];
vpGantt.preDefColumns={	
							Id:{
								header: 'ID<br/>',
								sortable: false,
								width: 40,
								minWidth: 40,
								dataIndex: 'Id',
								menuDisabled: true,
								vpId:'Id',
								predDef:true,
								renderer: function(v, m, r) {
									return v;
								}
							},zs:{
								header: '  ',
								id: 'zs',
								type: 'string',
								vpId:'zs',
								sortable: false,
								menuDisabled: true,
								hidden:true,
								width: 20,
								minWidth: 20,
								predDef:true,
								renderer: function(value, metadata, record, rowIndex) {
									return '';
								}
							},
							
							Name:{
								xtype: 'treecolumn',
								dataIndex: 'Name',
								header: '任务名称<br/>',
								vpId:'Name',
								sortable: false,
								menuDisabled: true,
								align: 'left',
								width: 140,
								minWidth: 140,
								predDef:true,
								field: {
									allowBlank: false
								},
								renderer: function(value, metaData, record, rowIdx, colIdx, store) {
									if (record.get('leaf')) {
										metaData.tdCls = 'task';
									}
									if (record.get('Duration') < vpGantt.getWorkLoadPrecision()) {
										metaData.tdCls = 'milestone';
									}
									if (!record.get('leaf')) {
										metaData.tdCls = 'abstract-task';
									}
									var tid=record.get("Id");
									tid.replace(/\s+/g,'');
									if(vpGantt.recordCache){
										vpGantt.recordCache[tid]=record;
									}
									return '<a href="javascript:void(0);"  onclick="vpGantt.showDetail(\''+tid+'\');">'+value+'</a>';
								},
								autoExpand:true
							},
							StartDate:{
								header:'开始日期<br/>',
								xtype: 'startdatecolumn',
								dataIndex : "StartDate",
								menuDisabled: true,
								sortable: false,
								vpId:'StartDate',
								predDef:true,
								width: 76,
								minWidth: 76
							},
							EndDate:{
								header:'完成日期<br/>',
								xtype: 'enddatecolumn',
								dataIndex : "EndDate",
								menuDisabled: true,
								sortable: false,
								vpId:'EndDate',
								predDef:true,
								width: 76,
								minWidth: 76
							},
							PercentDone:{
								header: '%<br/>',
								xtype: 'percentdonecolumn',
								dataIndex : "PercentDone",
								menuDisabled: true,
								align: 'right',
								sortable: false,
								hidden: false,
								vpId:'PercentDone',
								predDef:true,
								width: 45,
								minWidth: 45,
								hidden:true
							},
							DependencyTask:{
								header: '前置<br/>',
								width: 35,
								minWidth: 35,
								sortable: false,
								menuDisabled: true,
								vpId:'DependencyTask',
								predDef:true,
							    xtype : 'predecessorcolumn',
							    hidden:true
							},
							DependencyTask_hide:{
								header: '前置-pre',
								width: 35,
								minWidth: 35,
								sortable: false,
								menuDisabled: true,
								hidden: true,
								xtype: 'dependencytaskcolumn',
								vpId:'DependencyTask-hide',
								predDef:true,
								dataIndex : "DependencyTask"
							},
							BaselineStartDate:{
								header:'计划开始<br/>日期',
								xtype: 'baselinestartdatecolumn',
								dataIndex : "BaselineStartDate",
								menuDisabled: true,
								sortable: false,
								vpId:'BaselineStartDate',
								predDef:true,
								width: 76,
								minWidth: 76,
								hidden:!vpGantt.showCompareGantt
							},
							BaselineEndDate:{
								header:'计划完成<br/>日期',
								xtype: 'baselineenddatecolumn',
								dataIndex : "BaselineEndDate",
								menuDisabled: true,
								sortable: false,
								vpId:'BaselineEndDate',
								predDef:true,
								width: 78,
								minWidth: 76,
								hidden:!vpGantt.showCompareGantt
							}
							
						};
/*vpGantt.submitFileds=[
                      {name:'Id',getVal:function(snode){ 
                    	  return snode.get("Id")
                      }},
                      {name:'leaf',getVal:function(snode){
                    	  return !snode.hasChildNodes();
                      }},
                      {name:'Name',getVal:function(snode){
                    	  return snode.get("Name").replace(/\"/g, '\'') 
                    	}},
                      {name:'PercentDone',getVal:function(snode){
                    	  return (snode.get("PercentDone") == '' ? 0 : snode.get("PercentDone"));
                      }},
                      {	name:'StartDate',
                    	getVal:function(snode){
                    	 	return  snode.get("StartDate").getFullTime();
                      	}
                      },
                      {name:'EndDate',getVal:function(snode){
                    	  	return snode.get("EndDate").getFullTime();
                      }},
                      {name:'DependencyTask',getVal:function(snode){
							return snode.get("DependencyTask");
                      }},
                      {name:'ResIds',getVal:function(snode){
							return snode.get("ResIds");
                      }}
                      ];*/
vpGantt.isPreDefFields=function(f){
	var b=false;
	if(f&&f.columnid){
		if(vpGantt.preDefColumns[f.columnid]&&vpGantt.preDefColumns[f.columnid].predDef){
			b= true;
		}
	}
	return b;
};
vpGantt.decoPreDefFields=function(f){

	if(f&&f.columnid){
		var preDefCol=vpGantt.preDefColumns[f.columnid];
		
		/*
		if(f.header){
			preDefCol.header=f.header;
		}
		if(f.width){
			preDefCol.width=f.width;
		}
		if(f.hidden){
			preDefCol.hidden=true;
		}*/
		for(var i in f){
			preDefCol[i]=f[i];
		}
		return preDefCol;
	}
};
vpGantt.columns = [
                   vpGantt.preDefColumns.Id,
                   vpGantt.preDefColumns.zs,
                   vpGantt.preDefColumns.Name,
                   vpGantt.preDefColumns.StartDate,
                   vpGantt.preDefColumns.EndDate,
                   vpGantt.preDefColumns.DependencyTask,
                   vpGantt.preDefColumns.PercentDone,
                   vpGantt.preDefColumns.BaselineStartDate,
                   vpGantt.preDefColumns.BaselineEndDate

];
vpGantt.typeMap={
		comboBox:'vpcomboxcolumn',
		number:'vpnumbercolumn',
		string:'vpstringcolumn',
		date:'vpdatecolumn'
};

vpGantt.getCusColType=function(type){
	return this.typeMap[type]||type;
};
vpGantt.addCusColumn=function(col){
	vpGantt.columns.push(col);
};



vpGantt.addCusFields=function(cfg){
	var field={name:cfg.columnid},subField={name:cfg.columnid};
	if(cfg.type=='date'){
		field.type='date';
		field.dateFormat="c";
		subField.getVal=function(snode){
			var val=snode.get(this.name);
			val=val?val.getFullTime() : '';
			return val
		};
	}else if(cfg.type=='string'||cfg.type=='comboBox'){
		field.type='string';
		subField.getVal=function(snode){
			var val=snode.get(this.name);
			return val||'';
		};
	}else if(cfg.type=='number'){
		field.type='number';
		field.defaultValue=0;
		subField.getVal=function(snode){
			var val=snode.get(this.name);
			return (val===undefined?0:val);
		};
	}
	vpGantt.taskFields.push(field);
	//vpGantt.submitFileds.push(subField);
	return field;
};

vpGantt.addSingleCol=function(col){
	var di=vpGantt.addCusFields(col).name;
	var w=col.width?(parseInt(col.width)||100):100;
	var cusColumn={
		header: col.header+'<br/>',
		dataIndex:di,
		//xtype: vpGantt.getCusColType(col.type),
		type:col.type,
		menuDisabled: true,
		
		hidden:false||(!!col.hidden),
		sortable: false,
		width:w,
		minWidth:w
	};
	if(col.type=='number'){
		cusColumn.type='number';
	}else{
		cusColumn.xtype=vpGantt.getCusColType(col.type);
	}
	if(col.renderer){
		cusColumn.renderer=col.renderer;
	}
	return cusColumn;
}
vpGantt.addCusColumns=function(cols){
	for(var i=0;i<cols.length;i++){
		var col=cols[i];
		vpGantt.addCusColumn(vpGantt.addSingleCol(col));
	}
	
};

	    
vpGantt.initComboboxData=function(objs){
	vpGantt.comboBoxData={};
	var valMap=vpGantt.comboBoxData;
	for(var i=0;i<objs.length;i++){
		var obj=objs[i];
		var states = Ext.create('Ext.data.Store', {fields: ['val', 'name'], data:obj.data});
		var renderMap={},data=obj.data;
		for(var j=0;j<data.length;j++){
			renderMap[data[j]['val']]=data[j]['name'];
		}
		valMap[obj.id]={
				store:states,
				renMap:renderMap
		}
	}
};





vpGantt.getComboRenderText=function(colId,val){
	var res='';
	var valMap=vpGantt.comboBoxData;
	if(valMap){
		var obj=valMap[colId];
		if(obj){
			var renMap=obj['renMap'];
			if(renMap){
				var str=renMap[val];
				if(str==undefined||str==null){
					str='';
				}
				res=str;
			}
		}
	}
	return res;
};
vpGantt.getComboStore=function(colId){

	var valMap=vpGantt.comboBoxData;
	if(valMap){
		var obj=valMap[colId];
		if(obj){
			var store=obj['store'];
			return store;
		}
	}
};



vpGantt.isArray=function(o){
	return Object.prototype.toString.apply(o)=='[object Array]';
};
vpGantt.initColumns=function(obj){
	obj=vpGantt.colsCfg;
	if(obj){
		var cols=obj.cols;
		if(cols&&cols.length>0){
			if(vpGantt.resortCols){
				var resCols=[];
				for(var i=0;i<cols.length;i++){
					var col=cols[i];
					if(vpGantt.isPreDefFields(col)){
						resCols.push(vpGantt.decoPreDefFields(col));
					}else{
						resCols.push(vpGantt.addSingleCol(col));
					}
				}
				vpGantt.columns=resCols;
			}else{
				var cusCols=[];
				
				for(var i=0;i<cols.length;i++){
					var col=cols[i];
					if(vpGantt.isPreDefFields(col)){
						vpGantt.decoPreDefFields(col);
					}else{
						cusCols.push(col);
					}
				}
				vpGantt.addCusColumns(cusCols);
			}
			
			
		}
		if(obj.comboData){
			var comboData=[];
			for(var i=0;i<obj.comboData.length;i++){
				var cur=obj.comboData[i];
				//if(vpGantt.isArray(cur)){
					comboData.push({id:cur.id,data:cur.data});
				//}
			}
			vpGantt.initComboboxData(comboData);
		}
	}
	
	
};

vpGantt.initColumns();


vpGantt.getTaskFields=function(){
	return vpGantt.taskFields;
};

var ep=Ext.grid.column.Column.prototype;
ep.setPadding=function(headerContext, availableHeight) {
	    var me = this,
	    textHeight = me.textEl.dom.offsetHeight,
	    titleEl = me.titleEl,
	    titleHeight = titleEl.dom.offsetHeight,
	    pt, pb;
	
	
	availableHeight -= headerContext.borderInfo.height;
	
	
	if (headerContext.innerCtContext) {
	    me.layout.innerCt.setHeight(availableHeight - titleHeight);
	}
	
	else {
	    if (titleHeight < availableHeight) {
	
	        
	        if (textHeight) {
	            titleHeight = availableHeight;
	            availableHeight -= textHeight;
	            pt = Math.floor(availableHeight / 2);
	            pb = availableHeight - pt;
	            titleEl.setStyle({
	                paddingTop: pt + 'px',
	                paddingBottom: pt + 'px'
	            });
	        }
	    }
	}
	
	
	if ((Ext.isIE6 || Ext.isIEQuirks) && me.triggerEl) {
	    me.triggerEl.setHeight(titleHeight);
	}
};

