<%@ page contentType="text/html;charset=GBK"%>
<html xmlns="http://www.w3.org/1999/xhtml" style="height:100%">
<head>

<title>编辑任务计划</title>

<script src="/project/vframe/js/common.js" type="text/javascript"></script>
<link href="/project/ext42/resources/css/ext-all-gray.css" rel="stylesheet" type="text/css" />
<link href="/project/ext-gantt-new/sim/resources/css/sch-gantt-all.css" rel="stylesheet" type="text/css" />
<link href="/project/ext-gantt-new/sim/resources/css/gantt-edit.css" rel="stylesheet" type="text/css" />
<link href="/project/css/gantt-key-path-normal.css" rel="stylesheet" type="text/css" id="grid-select-css"/>
<style type="text/css">
#res-bt1{
	width:40px;
}
#res-bt2{
	width:70px;
}
.add-res-div{
	
	border:0px solid #000;
	text-align:left;
	
}
.add-res-div a{
	border:0px solid #000;
	position:relative;
	left:0px;
	cursor:hand;
	TEXT-DECORATION:none;
}

.head-table td{
	text-align:center;
	font-size:12px;
	border:0px solid #000;
	height:100%;
}

.un-edit-col{
	background-color:#eee!important;
	cursor:default!important;
	color:#6f6f6f!important;
}
.un-edit-col div{
	cursor:default!important;  
}
.x-tree-expander{
	top:1px!important;
}
.sch-ganttpanel .x-splitter-vertical {
	background-color: rgb(240, 244, 250);
	border-right: 1px solid #ccc;
}
.x-header-text{
	text-align:left;
}
.x-header-text-container{
	text-align:left;
}
/*
.x-grid-cell .x-grid-td{
	line-height:20px;
	height:20x!important;
}
.x-grid-cell-inner{
line-height:20px;
}
.x-grid-cell-editor{
	height:20px;
}
.x-tree-node-text{
	line-height:21px;
}
.x-grid-row{
	height:20px;
}
.x-grid-td{
	height:20px;
}
.sch-ganttpanel .x-grid-cell{
	height:20px;
}*/
.x-tip{
	display:none;
}
.sch-todayLine{
	border-left-color:red!important;
}
.x-grid-table{
	position:relative!important;
}
/* .x-column-header-inner{
	padding-top:5px!important;
	padding-bottom:5px!important;
} */

.x-column-header-text{
	text-align:center;
}

.x-column-header-align-right .x-column-header-text {
	margin-right: 0px;
}
.x-column-header-align-right {
	text-align: left;
}
/*.x-menu-item-active{
	border-top:1px!important;
}*/


/*
	keyTask
*/


.sch-gantt-key-parenttask-bar {
	height:10px;
	cursor:pointer;
	border:1px solid red;
	background:#d7580b;
	position:relative;
	left:-6px
	cursor:move;
}

.sch-gantt-key-task-bar {
	/*
	border:1px solid #3172d7;
	*/
	border:1px solid red;
	height:15px;
	border-radius:2px;
	-ms-border-radius:2px;
	-o-border-radius:2px;
	-moz-border-radius:2px;
	-webkit-border-radius:2px;
	background:#d7580b;
	cursor:move;
}

.x-grid-row-selected .sch-gantt-key-parenttask-bar{
	border-color:#00CD00;
}
.x-grid-row-selected .sch-gantt-key-task-bar{
	border-color:#00CD00;
}

.x-grid-row-selected .sch-gantt-key-parenttask-bar .sch-gantt-parenttask-arrow {
	border:0;
	width:0;
	height:0;
	position:absolute;
	border-color:#00CD00 transparent transparent;
	border-style:solid;
	border-width:6px 6px 0
}



.sch-ganttpanel-showbaseline .sch-gantt-key-task-bar,.sch-ganttpanel-showbaseline .sch-gantt-task-bar,.sch-ganttpanel-showbaseline .sch-gantt-parenttask-bar,.sch-ganttpanel-showbaseline .sch-gantt-key-parenttask-bar {
	height:7px
}
.sch-ganttpanel-showbaseline .sch-gantt-key-parenttask-bar .sch-gantt-progress-bar {
	height:5px
}
.sch-gantt-parenttask-bar,.sch-gantt-key-parenttask-bar,.sch-gantt-task-bar,.sch-gantt-key-task-bar {
	-webkit-box-shadow:1px 1px 2px rgba(150,150,150,0.5);
	-moz-box-shadow:1px 1px 2px rgba(150,150,150,0.5);
	-ms-box-shadow:1px 1px 2px rgba(150,150,150,0.5);
	box-shadow:1px 1px 2px rgba(150,150,150,0.5)
}
.sch-gantt-key-parenttask-bar .sch-gantt-progress-bar {
	height:8px;
	top:0;
	left:0;
	background-color:#fff3a5;
	overflow:hidden
}

.sch-gantt-parenttask-baseline .sch-gantt-key-parenttask-bar,.sch-gantt-parenttask-baseline .sch-gantt-parenttask-bar,.sch-gantt-task-baseline .sch-gantt-task-bar {
	cursor:auto!important;
	height:6px;
	background:#eee;
	border:1px solid orange;
	overflow:hidden!important;
	border-radius:2px;
	-moz-border-radius:2px;
	-webkit-border-radius:2px;
}

.sch-gantt-parenttask-baseline .sch-gantt-key-parenttask-bar{
	cursor:auto!important;
	height:6px;
	background:#eee;
	border:1px solid orange;
	overflow:hidden!important;
	border-radius:2px;
	-moz-border-radius:2px;
	-webkit-border-radius:2px;
}
.sch-gantt-task-baseline .sch-gantt-key-task-bar {
	cursor:auto!important;
	height:6px;
	background:#eee;
	border:1px solid orange;
	overflow:hidden!important;
	border-radius:2px;
	-moz-border-radius:2px;
	-webkit-border-radius:2px;
}

.sch-ganttview-readonly .sch-ganttview-readonly .sch-gantt-task-bar,.sch-ganttview-readonly .sch-gantt-key-task-bar {
	cursor:auto
}







.x-ie7 .sch-gantt-dragproxy .sch-gantt-key-milestone-diamond-ct,.x-ie8 .sch-gantt-dragproxy .sch-gantt-key-milestone-diamond-ct {
	position: relative;
	top: -3px
}
.sch-gantt-topbottom-labels .sch-gantt-key-milestone-diamond-ct {
	height: 14px;
	width: 14px
}
.sch-gantt-key-milestone-diamond-ct {
	position: relative;
	z-index: 2;
	height: 50%

}
.sch-ganttpanel-showbaseline .sch-gantt-key-milestone-diamond-ct {
	height: 38%
}
.x-strict .x-ie8 .sch-gantt-key-milestone-diamond-ct .sch-gantt-terminal {
	margin-top: -2px
}
.x-strict .x-ie7 .sch-gantt-key-milestone-diamond-ct .sch-gantt-terminal {
	margin-top: -7px
}
.x-strict .x-ie8 .sch-gantt-key-milestone-diamond-ct .sch-gantt-terminal-end,.x-strict .x-ie7 .sch-gantt-key-milestone-diamond-ct .sch-gantt-terminal-end {
	right: -17px
}
.x-quirks .x-ie .sch-gantt-key-milestone-diamond-ct {
	top: -17px;
	position: relative;
	left: -3px
}
.x-strict .x-ie8 .sch-gantt-key-milestone-diamond-ct,.x-strict .x-ie7 .sch-gantt-key-milestone-diamond-ct {
	margin-left: -2px
}

.sch-gantt-key-milestone-diamond-ct .sch-gantt-milestone-diamond{
	background-color:#d7580b;
	border: 1px solid red;
}
.x-grid-row-selected .sch-gantt-key-milestone-diamond-ct .sch-gantt-milestone-diamond{
	border: 1px solid #00CD00;
}
.x-grid-row{
	height:22px;
}
.sch-ganttpanel .x-grid-cell {
	height: 20px;
}
.x-form-item-body {
	position:relative;
}
.x-border-box .x-grid-editor input{
	position:relative;

 	height:21px!important;
}

.x-grid-row-focused .x-grid-td {
	border:0px!important;
}
.x-tree-arrows .x-tree-expander {
background: url(/project/ext42/resources/themes/images/gray/tree/arrows.gif) no-repeat 0 0;
}



.x-form-trigger{
	height:21px!important;
	height:22px!important\0;
}
.x-form-date-trigger{
	height:21px!important;
	height:22px!important\0;
}
.x-grid-editor .x-form-trigger-wrap .x-form-spinner-up{
	height:11px!important;
}
.x-form-arrow-trigger{
	height:21px!important;
	height:22px!important\0;
}
.x-boundlist-item{
	text-align:left;
}
/*.x-panel-header-text-container-default{
		font-family:"";
}*/
/*.x-column-header{
	font-family: Arial Helvetica !important;
	font-size:12px;
	font:12px/1.5 arial,\5b8b\4f53,helvetica,sans-serif;
}
.x-btn-inner{
	font-family: Arial Helvetica !important;
	font-size:12px!important;
}*/

.x-column-header{
	font:12px/1.5 arial,\5b8b\4f53,helvetica,sans-serif!important;
}
.x-btn-inner{
	font:12px/1.5 arial,\5b8b\4f53,helvetica,sans-serif!important;
}
.sch-simple-timeheader{
	font:12px/1.5 arial,\5b8b\4f53,helvetica,sans-serif!important;
}
.x-column-header-inner{
	text-align:center;
}
.x-grid-header-ct{
	text-align:left!important;
}
.x-tree-view{
	text-align:left!important;
}
.x-boundlist-item {
	text-align: left;
	height: 22px!important;
}
.x-column-header{
	background:url(/project/images/header-bg.jpg) repeat-x 0px top!important;
	
}
.x-grid-header-ct{
border-bottom:1px solid #c5c5c5!important;
border-top:0px !important;
}
.x-tree-panel .x-box-inner{
	background:url(/project/images/header-bg.jpg) repeat-x 0px top!important;
}
</style>
<style id="res-icon-css" type="text/css">
</style>
<link href="" id="grid-assigngrid-css" rel="stylesheet" type="text/css" />
<script src="/project/js/jquery-1.3.2.js" type="text/javascript"></script>
</head>
<body  id="gatt-grid-div"  style="overflow: hidden; text-align:center;width:100%;height:100%;">
</body>


<script >
function checkWin(win,cf){
	if(win){
		setTimeout(function(){
			checkWin(win,cf);
		},500);
	}else{
		cf();
	}
}

var console={
		warn:function(){},
		log:function(){}
}
 var Gantt={edit:true,topOffSet:'0'};

Common.setMenuBeforeClickHandle(function(){
         var bool = window.confirm("您还有数据尚未保存，确定离开此页吗？");
         if(bool)
         	Common.setMenuBeforeClickOpenState(false);
         return bool;
	});
window.onbeforeunload=function(){

	if(top.beForeClickOpen)
		return '你还有数据尚未保存，是否需要保存?';
	else
		return ;
};

 function logOut(){
 	window.parent.top.location="/project/logout.jsp";

 }
 function getOs() 
{ 
    var OsObject = ""; 
   if(navigator.userAgent.indexOf("MSIE")>0) { 
        return "MSIE"; 
   } 
   if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){ 
        return "Firefox"; 
   } 
   if(isSafari=navigator.userAgent.indexOf("Safari")>0) { 
        return "Safari"; 
   }  
   if(isCamino=navigator.userAgent.indexOf("Camino")>0){ 
        return "Camino"; 
   } 
   if(isMozilla=navigator.userAgent.indexOf("Gecko")>0){ 
        return "Gecko"; 
   } 
   
} 

var showwin=true;//<0||(navigator.userAgent.indexOf("MSIE")>0&&navigator.userAgent.indexOf("chromeframe")<0)
 	if(((navigator.userAgent.indexOf("chromeframe")>=0))||((navigator.userAgent.indexOf("Chrome")>=0))) {
 	 	showwin=false;
	}
	if (window.ActiveXObject) {
         try {
             if (new ActiveXObject('ChromeTab.ChromeFrame')){
                showwin=false;
             }
         } catch(e) {
         }
     }
   //if(showwin){
 	//	Common.showModalWin('/project/wbs/task/explorerTip.html',window, 570, 330);
 	//	Gantt.height=document.body.clientHeight-2;
 	//}else{
 		Gantt.height=document.body.clientHeight;
 	//}
 	
   Gantt.topOffSet='5';
	Gantt.leftOffSet='5';
	Gantt.width=document.body.clientWidth;

  
 // return false;
</script>
<script src="/project/ext42/ext-all.js" type="text/javascript"></script>
<script src="/project/ext42/ext4-lang-zh_CN.js" type="text/javascript"></script>
<script language="javascript">
/* Ext.override(Ext.panel.Panel,{
	collapse: function(direction, animate) {        
		var me = this,
        collapseDir = direction || me.collapseDirection,
        ownerCt = me.ownerCt;

	    if (me.isCollapsingOrExpanding) {
	        return me;
	    }
	
	    if (arguments.length < 2) {
	        animate = me.animCollapse;
	    }
	
	    if (me.collapsed || me.fireEvent('beforecollapse', me, direction, animate) === false) {
	        return me;
	    }
	
	    if (ownerCt && me.isPlaceHolderCollapse()) {
	        me.placeholderCollapse(direction, animate);
	        if(me.collapseDirection=='right'){
	        	var ph=document.getElementById(me.placeholder.id),pn=ph.parentNode;
	            //pn.removeChild(ph);
	            document.getElementById(me.id).style.visibility='visible';
	            ph.style.display='none';
	            var et=me.tools[1]||me.tools[0];
	            if(et.type=='collapse-right'){
	            	et.setType('collapse-left');
	            }else{
	            	et.setType('collapse-right');
	            }
	        }
	        
	        return me;
	        
	    }
	
	    me.collapsed = collapseDir;
	    me.beginCollapse();
	
	    me.getHierarchyState().collapsed = true;
	    me.fireHierarchyEvent('collapse');
	
	    me.doCollapseExpand(1, animate);
	   return me;
    },
    expand: function(animate) {
    	var me = this;

        if (me.isCollapsingOrExpanding) {
            return me;
        }

        if (!arguments.length) {
            animate = me.animCollapse;
        }

        if (!me.collapsed && !me.floatedFromCollapse) {
            return me;
        }

        if (me.fireEvent('beforeexpand', me, animate) === false) {
            return me;
        }

        delete this.getHierarchyState().collapsed;

        if (me.isPlaceHolderCollapse()) {
             me.placeholderExpand(animate);
             if(me.collapseDirection=='right'){
             	var ph=document.getElementById(me.placeholder.id),pn=ph.parentNode;
                 //pn.removeChild(ph);
                 document.getElementById(me.id).style.visibility='visible';
                 ph.style.display='none';
                 var et=me.tools[1]||me.tools[0];
                 if(et.type=='collapse-right'){
                 	et.setType('collapse-left');
                 }else{
                 	et.setType('collapse-right');
                 }
             }
             return me;
        }

        me.restoreHiddenDocked();
        me.beginExpand();
        me.collapsed = false;

        return me.doCollapseExpand(2, animate);
    }
});
 */






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
var vpGantt={
		newId:1,
		gantt:null,
		columns:null,
	    buttons:null,
	    rowMenu:null,
	    resourceStore:null,
	    assignmentStore:null,
	    taskStore:null,
	    ganttdiv:"gatt-grid-div",
	    ganttEl:null,
	    gridMask:null,
	    initMask:function(){
	       this.ganttEl=Ext.get(this.ganttdiv);
	       this.gridMask=new Ext.LoadMask(this.ganttEl, {msg:"正在加载数据..."});
	       this.gridMask.show();
		},
		getTaskId:function(){
			return '<%=request.getParameter("wbsObjId")%>';
		},
		getProjectId:function(){
			return '<%=request.getParameter("projectID")%>';
		},
		getProjectName:function(){
			return '<%=request.getParameter("projectName")%>';
		},
		isDurationInt:false,
		cusFiledIndex:0,
		comboBoxData:{}
};
vpGantt.getDataUrl = function(projectId, taskId) {
	vpGantt.data=null;
	jQuery.ajax({
		url: '/project/wbs/ganttLoadAction.do',
		data: {
			themethod: 'loadEditGanttData',
			projectId: projectId,
			taskId: taskId
		},
		type: 'post',
		async: true,
		success: function(res) {
			vpGantt.data = res;
		},
		dataType: 'json'
	});
	//return data;
};
vpGantt.getDataUrl(vpGantt.getProjectId(), vpGantt.getTaskId() == 'null' ? 0 : vpGantt.getTaskId());
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
	vpGantt.curSelTask=vpGantt.taskCache[obj.getAttribute('id')];
}
function itemOver(obj){
	if(!obj.status || !obj.status=="clicked"){
		obj.src = "/project/vframe/images/other/icon_openhover.gif";
	}
}
function itemOut(obj){
	if(!obj.status || !obj.status=="clicked"){
		obj.src = "/project/vframe/images/other/icon_openlink.gif";
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
, {
	name : "ResIds",
	type : "string"
},{
	name : "DependencyTask",
	type : "string"
},{
	name : "IndicateLight",
	type : "string"
},{
	name : "WorkLoad",
	type : "number"
},{
	name:"BaselineWorkLoad",
	type : "number"
},{
	name:"BaselineDuration",
	type : "int"
} ,{
	name : "KeyTask",
	type : "boolean",
	defaultValue : false
},{
	name : "Option2",
	type : "number",
	defaultValue : 0
},
{
	name: "RealStartDate",
	type: "date",
	dateFormat: "c"
},
{
	name: "RealEndDate",
	type: "date",
	dateFormat: "c"
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
								//locked:true,
								vpId:'Id',
								predDef:true,
								
								renderer: function(v, m, r) {
									return v;
								}
							},
							IndicateLight:{
								header: ' ',
								width: 32,
								minWidth: 32,
								dataIndex: 'IndicateLight',
								sortable: false,
								menuDisabled: true,
								//locked:true,
								align: 'center',
								vpId:'IndicateLight',
								predDef:true,
								renderer: function(){
									return vpGantt.rendeIndicater.apply(this,arguments);
								}
							},
							zs:{
								header: '  ',
								id: 'zs',
								type: 'string',
								vpId:'zs',
								sortable: false,
								menuDisabled: true,
								//locked:true,
								width: 20,
								minWidth: 20,
								predDef:true,
								renderer: function(value, metadata, record, rowIndex) {
									if(arguments[3]==0){
										return '';
									}
									var id="op_div_"+record.get('Id');
									vpGantt.cacheTask(id,record);
									var content = "<img id=\""+id+"\" style=\"border:0px solid #000;width:16px;position:relative;left:-4px;\" onMouseOver=\"itemOver(this);\"  onMouseOut=\"itemOut(this);\"  onClick=\"clickOpr(this, " + rowIndex + ")\"" + " src=\"/project/vframe/images/other/icon_openlink.gif\"" + " />";
									return content;
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
								width: 240,
								minWidth: 240,
								predDef:true,
								//locked:true,
								field: {
									allowBlank: false
								},
								renderer: function(value, metaData, record, rowIdx, colIdx, store) {
									if(vpGantt.getTaskId()=='null'&&rowIdx==0){
										metaData.tdCls = 'project';
										return value;
										
									}
									if (record.get('leaf')) {
										metaData.tdCls = 'task';
									}
									if (record.get('Duration') < vpGantt.getWorkLoadPrecision()) {
										metaData.tdCls = 'milestone';
									}
									if (!record.get('leaf')) {
										metaData.tdCls = 'abstract-task';
									}
									return value;
								},
								autoExpand:true
							},
							Duration:{
								header: '工期<br/>',
								xtype: 'durationcolumn',
								dataIndex : "Duration",
								menuDisabled: true,
								sortable: false,
								align: 'right',
								vpId:'Duration',
								predDef:true,
								width: 50,
								minWidth: 50
							},
							StartDate:{
								header:'预测开始<br/>日期',
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
								header:'预测完成<br/>日期',
								xtype: 'enddatecolumn',
								dataIndex : "EndDate",
								menuDisabled: true,
								sortable: false,
								vpId:'EndDate',
								predDef:true,
								width: 76,
								minWidth: 76
							},
							WorkLoad:{
								header:'预测<br/>工时',
								xtype: 'workloadcolumn',
								dataIndex : "WorkLoad",
								menuDisabled: true,
								align: 'right', 
								sortable: false,
								width: 45,
								minWidth: 45,
								vpId:'WorkLoad',
								predDef:true,
								renderer:function(v){
									if(vpGantt.getTaskId()=='null'&&arguments[3]==0){
										return '';
									}
									return vpGantt.getWLByPrecision(v);
								}
								
							},
							DependencyTask:{
								header: '前置<br/>',
								width: 35,
								minWidth: 35,
								sortable: false,
								menuDisabled: true,
								vpId:'DependencyTask',
								predDef:true,
							    xtype : 'predecessorcolumn'
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
								renderer:function(v){
									if(vpGantt.getTaskId()=='null'&&arguments[3]==0){
										return '';
									}else{
										return v;
									}
								}
							},
							VP_resource:{
								header: '资源<br/>',
								menuDisabled: true,
								sortable: false,
								width: 100,
								minWidth: 100,
								vpId:'VP_resource',
								predDef:true,
								xtype: 'vpresourceassignmentcolumn'
							},
							RealStartDate:{
								header:'实际开始<br/>日期',
								xtype: 'realstartdatecolumn',
								dataIndex : "RealStartDate",
								menuDisabled: true,
								sortable: false,
								vpId:'RealStartDate',
								predDef:true,
								width: 76,
								minWidth: 76
							},
							RealEndDate:{
								header:'实际完成<br/>日期',
								xtype: 'realenddatecolumn',
								dataIndex : "RealEndDate",
								menuDisabled: true,
								sortable: false,
								vpId:'RealEndDate',
								predDef:true,
								width: 76,
								minWidth: 76
							},
							ResIds:{
								header: 'resIds',
								sortable: false,
								menuDisabled: true,
								hidden: true,
								width: 60,
								minWidth: 60,
								vpId:'ResIds',
								predDef:true,
								dataIndex: 'ResIds'
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
								minWidth: 76
							},
							BaselineEndDate:{
								header:'计划完成<br/>日期',
								xtype: 'baselineenddatecolumn',
								dataIndex : "BaselineEndDate",
								menuDisabled: true,
								sortable: false,
								vpId:'BaselineEndDate',
								predDef:true,
								width: 76,
								minWidth: 76
							},
							BaselineWorkLoad:{
								header:'计划<br/>工时',
								xtype: 'baselineworkloadcolumn',
								dataIndex : "BaselineWorkLoad",
								menuDisabled: true,
								sortable: false,
								align: 'right',
								width: 45,
								minWidth: 45,
								vpId:'BaselineWorkLoad',
								predDef:true,
								renderer: function(b, c, a) {
									if(vpGantt.getTaskId()=='null'&&arguments[3]==0){
										return '';
									}
									if (!Ext.isNumber(b)) {
										return ""
									}
									b = parseFloat(Ext.Number.toFixed(b, this.decimalPrecision));
									return b + '&nbsp;&nbsp;';
								}
							},
							Option2:{
								header: '裁剪',
								dataIndex:'Option2',
								menuDisabled: true,
								hidden:true,
								sortable: false,
								vpId:'Option2',
								predDef:true,
								width:35,
								minWidth: 35
							}
							
						};
vpGantt.submitFileds=[
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
                      { 
                    	name:'Duration',
                    	getVal:function(snode){
							return snode.get("Duration");
                      	}
                      },
                      {name:'WorkLoad',getVal:function(snode){
							return vpGantt.trimWLValue(snode.get("WorkLoad"));
                      }},
                      {name:'RealStartDate',getVal:function(snode){
                    	  return (snode.get("RealStartDate") ? snode.get("RealStartDate").getFullTime() : '');
                      }},
                      {name:'RealEndDate',getVal:function(snode){
							return (snode.get("RealEndDate") ? snode.get("RealEndDate").getFullTime() : '');
                      }},
                      {name:'BaselineStartDate',getVal:function(snode){
                    	  return (snode.get("BaselineStartDate") ? snode.get("BaselineStartDate").getFullTime() : '');
                      }},
                      {name:'BaselineEndDate',getVal:function(snode){
							return (snode.get("BaselineEndDate") ? snode.get("BaselineEndDate").getFullTime() : '');
                      }},
                      {name:'BaselineDuration',getVal:function(snode){
							return (snode.get("BaselineDuration") || 0);
                      }},
                      {name:'BaselineWorkLoad',getVal:function(snode){
							return snode.get("BaselineWorkLoad");
                      }},
                      {name:'DependencyTask',getVal:function(snode){
							return snode.get("DependencyTask");
                      }},
                      {name:'ResIds',getVal:function(snode){
							return snode.get("ResIds");
                      }},
                      {name:'Option2',getVal:function(snode){
							return snode.get("Option2");
                      }}
                      ];
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
	return;
	if(f&&f.columnid){
		var preDefCol=vpGantt.preDefColumns[f.columnid];
		if(f.header){
			preDefCol.header=f.header;
		}
		if(f.width){
			preDefCol.width=f.width;
		}
	}

};
vpGantt.columns = [
                   vpGantt.preDefColumns.Id,
                   vpGantt.preDefColumns.IndicateLight,
                   vpGantt.preDefColumns.zs,
                   vpGantt.preDefColumns.Name,
                   vpGantt.preDefColumns.Duration,
                   vpGantt.preDefColumns.StartDate,
                   vpGantt.preDefColumns.EndDate,
                   vpGantt.preDefColumns.WorkLoad,
                   vpGantt.preDefColumns.DependencyTask,
                   vpGantt.preDefColumns.PercentDone,
                   vpGantt.preDefColumns.DependencyTask_hide,
                   vpGantt.preDefColumns.VP_resource,
                   vpGantt.preDefColumns.RealStartDate,
                   vpGantt.preDefColumns.RealEndDate,
                   vpGantt.preDefColumns.ResIds,
                   vpGantt.preDefColumns.BaselineStartDate,
                   vpGantt.preDefColumns.BaselineEndDate,
                   vpGantt.preDefColumns.BaselineWorkLoad,
                   vpGantt.preDefColumns.Option2

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
			var val=snode.get(this.name).replace(/\"/g, '\'');
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
	vpGantt.submitFileds.push(subField);
	return field;
};

vpGantt.addCusColumns=function(cols){
	for(var i=0;i<cols.length;i++){
		var col=cols[i];
		var di=vpGantt.addCusFields(col).name;
		var w=col.width?(parseInt(col.width)||100):100;
		var cusColumn={
			header: col.header+'<br/>',
			dataIndex:di,
			xtype: vpGantt.getCusColType(col.type),
			menuDisabled: true,
			hidden:false,
			sortable: false,
			width:w,
			minWidth:w
		};
		vpGantt.addCusColumn(cusColumn);
	}
	
};

	    
vpGantt.initComboboxData=function(objs){
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

	if(obj){
		var cols=obj.cols;
		if(cols&&cols.length>0){
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
	                paddingTop: (pt<10?5:pt)+ 'px',
	                paddingBottom: (pt<10?5:pt) + 'px'
	            });
	        }
	    }
	}
	
	
	if ((Ext.isIE6 || Ext.isIEQuirks) && me.triggerEl) {
	    me.triggerEl.setHeight(titleHeight);
	}
};

vpGantt.preLoadedProejctInfo = function() {
	jQuery.ajax({
		url: '/project/wbs/ganttLoadAction.do',
		data: {
			themethod: 'getProjectInfos',
			projectId: vpGantt.getProjectId(),
			taskId: vpGantt.getTaskId() == 'null' ? 0 : vpGantt.getTaskId()
		},
		type: 'post',
		async: false,
		success: function(res) {
			//vpGantt.startDate = vpGantt.parseDate('2013-2-01');
			//vpGantt.endDate = vpGantt.parseDate('2013-12-31');
			vpGantt.loadedProInfo=res;
			vpGantt.initColumns(res.columnCfg);
			var nw=parseFloat(res.nameWidth,10);
			if(nw>0){
				vpGantt.preDefColumns.Name.width=nw;
				vpGantt.preDefColumns.Name.minWidth=nw;
			}
			vpGantt.ganttHidden=(res.ganttHidden===undefined)?false:res.ganttHidden;
		},
		dataType: 'json'
	});
};
vpGantt.preLoadedProejctInfo();
</script>
<link href="/project/ext-gantt-new/vprespanel.css" rel="stylesheet" type="text/css" />
<script src="/project/ext-gantt-new/vprespanel.js?version=9" type="text/javascript"></script>

<script src="/project/ext-gantt-new/sim/gnt-2.25-debug.js?version=12" type="text/javascript"></script>
<script src="/project/ext-gantt-new/sim/sch-gantt-lang-zh_CN.js?version=9" type="text/javascript"></script>

<script src="/project/ext-gantt-new/sim/gantt-edit-new.js?version=9" type="text/javascript"></script>
<script src="/project/vframe/js/search.js?version=1000001" type="text/javascript"></script>

</html>