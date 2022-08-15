try {
	Ext.define("Gnt.column.PercentDone", {
		extend : "Ext.grid.column.Column",
		alias : "widget.percentdonecolumn",
		requires : [ "Ext.form.field.Number"],
		header : "% Done",
		dataIndex : "PercentDone",
		width : 40
	});
	Ext.Element.prototype.focus=function(defer,dom) {
		var me = this;
		dom = dom || me.dom;
		try {
		    if (Number(defer)) {
		        Ext.defer(me.focus, defer, null, [null, dom]);
		    } else {
		      // void(dom.focus());
		    }
		} catch(e) {}
		return me;
	};
	function getPageId(){
		if(vpGantt&&vpGantt.reportId)
		return vpGantt.reportId+'_curPage';
	}
	function getConId(){
		if(vpGantt&&vpGantt.reportId)
		return vpGantt.reportId+'_con';
	}
	Ext.require(['Gnt.panel.Gantt', 'Sch.plugin.TreeCellEditing', 'Gnt.column.PercentDone', 'Gnt.column.StartDate', 'Gnt.column.EndDate', 'Gnt.column.Duration', 'Gnt.widget.AssignmentCellEditor', 'Gnt.column.ResourceAssignment', 'Gnt.model.Assignment']);
	vpGantt.pageInputBlur=false;
	Gnt.data.TaskStore.prototype.getTotalCount=function() {
      return vpGantt.recordCount;
	};
	vpGantt.getParentCurPage=function(){
		var me=this;
		return parent[me.reportId+'_curPage'];
	}
	vpGantt.setParentCurPage=function(page){
		var me=this;
		return parent[me.reportId+'_curPage']=page;
	}
	vpGantt.setParentCondition=function(con){
		var me=this;
		return parent[me.reportId+'_con']=con;
	}
	vpGantt.setCurPage=function(page){
		var me=this;
		me.curPage=page;
		me.setParentCurPage(page);
		window.location.reload();
	};
	 Ext.PagingToolbar.prototype.beforePageText='第';
	 var preOnPagingKeyDown=Ext.PagingToolbar.prototype.onPagingKeyDown;
	 Ext.PagingToolbar.prototype.onPagingKeyDown = function(field, e){
		 	preOnPagingKeyDown.apply(this,arguments);
	        vpGantt.pageInputBlur=true;
	    };

	

	 Ext.PagingToolbar.prototype.moveFirst = function(){
		 vpGantt.setParentCondition
		 vpGantt.setCurPage(1)
	 }; 
	 Ext.PagingToolbar.prototype.moveLast = function(field, e){
		 (function(){
			 var me = this;
			 vpGantt.setCurPage(me.getPageData().pageCount)
		 }).apply(this,arguments);
		 
	 };   
	 Ext.PagingToolbar.prototype.doRefresh=function(){
		 window.location.reload();
	 };
	 
	Gnt.data.TaskStore.prototype.loadPage=function(page, options) {
		if(vpGantt.pageInputBlur){
			vpGantt.setCurPage(page);
		}
    	vpGantt.loadData();
    	var me = this;
    	me.currentPage = page;
    	setTimeout(function(){
    	    vpGantt.tpbar.onLoad();
    	},10);
	};
	Gnt.data.TaskStore.prototype.nextPage=function(options) {
		vpGantt.setCurPage(this.currentPage + 1);
	    //this.loadPage(this.currentPage + 1, options);
	};
	Gnt.data.TaskStore.prototype.previousPage=function(options) {
		vpGantt.setCurPage(this.currentPage - 1);
	    //this.loadPage(this.currentPage - 1, options);
	};
	Gnt.data.TaskStore.prototype.clearData=function(){
	    var me = this;
	    me.data.each(function(record) {
	        record.unjoin(me);
	    });
	
	    me.data.clear();
	};

	vpGantt.taskStore = Ext.create("Gnt.data.TaskStore", {
		pageSize:vpGantt.pageSize,
		buffered: false,
		model: 'Gnt.model.Task',
		proxy: {
			type: 'memory',
			reader: {
				type: 'json',
				root:'tasks',
				totalProperty:'totalNum'
			}
		}
	});
	vpGantt.setPanelHeight=function(height){
		var me=this;
		if(parent.MeterUtil){
			parent.MeterUtil.setMeterHeightForDrillGrid(me.panelId,height);

		}
	};
	vpGantt.removeTool=function(tool){
		var me=this;
		if(parent.MeterUtil){
			parent.MeterUtil.removeMeterTool(me.panelId,tool);

    	}
	};
	vpGantt.showNoDataPage=function(){
    	var me=this, maindiv=jQuery(document.body);
		maindiv.height(50);
		maindiv.css({'text-align':'center','overflow-x':'hidden'});
		maindiv.html('<div style="border:0px solid #000;line-height:50px;height:50px;margin-left:atuo;margin-right:atuo;font-weight:bold;font-size:12px;">暂无数据！</div>');
		me.setPanelHeight(50);
		me.removeTool('dump');
    };
    vpGantt.getParas=function(){
    	var me=this,paras={
				themethod: 'loadReportData',
				reportId:me.reportId,
				projectId:me.projectId,
				drillDown:0,
				drillPara:'',
				curPage:me.curPage
			};
    	if(parent[me.reportId+'_con']){
    		paras.condition=parent[me.reportId+'_con'];
    	}
    	return paras;
    };
	vpGantt.getData = function() {
		if(timeOut){
			var me=this;
			me.data=null;
			me.gridMask.hide();
			return null;
		}
		try{
		var me=this;
		if(!me.getParentCurPage()){
			me.setParentCurPage(1);
		}
		me.curPage=me.getParentCurPage();

		var data;
		if(!me.projectId||me.projectId=='null')
			me.projectId=0;
		jQuery.ajax({
			url: '/project/report/selDefineReportAction.do',
			data:me.getParas(),
			type: 'post',
			async: false,
			success: function(res) {
				data=res;
			},
			error:function(x,t,e){
				if(x.responseText.indexOf('系统session超时')!=-1){
					timeOut=true;
					alert('系统session超时，请重新登录');
					vpGantt.gridMask.hide();
				}
				data=[];
			},
			dataType: 'json'
		});
			if(!data[0]||data[0].length<1){
				me.showNoDataPage();
				return null;
			}
			
			me.recordCount=data[1];
			me.startDateStr=data[3];
			me.endDateStr=data[4];
			data=data[0];
			me.firstItemDate=data[0].StartDate;
			for(var i=0;i<data.length;i++){
				var cur=data[i];
				cur.leaf=true;
				cur.Id=i+1;
				if (cur.projectid != '' && cur.projectid != 'null' && cur.projectid != null) {
					cur.IndicateLight=cur.projectid;
				}
				else {
					cur.IndicateLight=cur.rpt_url;
				}
			}
			me.data=data;
		return data;
		}catch(e){
			vpGantt.setParentCurPage(1);
			return null;
		}
	};

	vpGantt.columns = [
	{
		xtype: 'treecolumn',
		header: '名称',
		sortable: false,
		menuDisabled: true,
		align: 'left',
		dataIndex: 'Name',
		width: 140,
		field: {
			allowBlank: false
		},
		renderer: function(v, metaData, record, rowIdx, colIdx, store) {
				metaData.tdCls = 'no-icon';		
				return '<lable onclick=\'showWin("'+record.get('IndicateLight')+'\","'+record.get("Name")+'");\'>'+v+'</lable>';
		}
	},
	{
		header: '开始日期',
		xtype: 'startdatecolumn',
		menuDisabled: true,
		sortable: false,
		width: 75
	},
	{
		header: '完成日期',
		xtype: 'enddatecolumn',
		menuDisabled: true,
		sortable: false,
		width: 75
	},
	{
		header: '%',
		xtype: 'percentdonecolumn',
		menuDisabled: true,
		sortable: false,
		hidden: true,
		width: 40,
		renderer:function( v ){
			return '<div style="text-align:right;width:100%;">'+v + '&nbsp;&nbsp;</div>';
		}
	},
		{
			header: 'url',
			dataIndex:'IndicateLight',
			menuDisabled: true,
			sortable: false,
			width: 75,
			hidden:true
		},
		{
			header: 'objid',
			dataIndex:'objid',
			menuDisabled: true,
			sortable: false,
			width: 0,
			hidden:true
		}
	];
	vpGantt.colSlider = new Ext.create("Ext.slider.Single", {
		value: Sch.preset.Manager.getPreset('weekAndDayLetter').timeColumnWidth,
		width: 120,
		minValue: 80,
		maxValue: 240,
		increment: 10
	});
	

	vpGantt.ganttzoom = {
		minValue: 40,
		maxValue: 240,
		increment: 10,
		curValue: Sch.preset.Manager.getPreset('weekAndDayLetter').timeColumnWidth,
		changeBt: function() {
			if (vpGantt.ganttzoom.curValue == vpGantt.ganttzoom.maxValue) {
				Ext.getCmp('gantt-zoom-bt').setDisabled(true);
			} else if (vpGantt.ganttzoom.curValue == vpGantt.ganttzoom.minValue) {
				Ext.getCmp('gantt-shrink-bt').setDisabled(true);
			} else if (vpGantt.ganttzoom.curValue == (vpGantt.ganttzoom.minValue + 50)) {
				Ext.getCmp('gantt-shrink-bt').setDisabled(false);
			} else if (vpGantt.ganttzoom.curValue == (vpGantt.ganttzoom.maxValue - 50)) {
				Ext.getCmp('gantt-zoom-bt').setDisabled(false);
			}
		},
		add: function() {
			if (vpGantt.ganttzoom.curValue < vpGantt.ganttzoom.maxValue) {
				vpGantt.ganttzoom.curValue += 50;
				vpGantt.ganttzoom.changeBt();
				vpGantt.gantt.setTimeColumnWidth(vpGantt.ganttzoom.curValue);
			}
		},
		sub: function() {
			if (vpGantt.ganttzoom.curValue > vpGantt.ganttzoom.minValue) {
				vpGantt.ganttzoom.curValue -= 50;
				vpGantt.ganttzoom.changeBt();
				vpGantt.gantt.setTimeColumnWidth(vpGantt.ganttzoom.curValue);
			}
		}
	};
	
	vpGantt.colSlider = new Ext.create("Ext.slider.Single", {
		value: Sch.preset.Manager.getPreset('weekAndDayLetter').timeColumnWidth,
		width: 120,
		minValue: 20,
		maxValue: 240,
		increment: 10
	});
	vpGantt.colSlider.on({
		change: function(slider, value) {
			vpGantt.gantt.setTimeColumnWidth(value, true);
		},
		changecomplete: function(slider, value) {
			vpGantt.gantt.setTimeColumnWidth(value);
		}
	});
	vpGantt.dateUnitChange = {
		curUnit: 3,
		unitList: ['year', 'monthAndYear', 'weekDateAndMonth', 'weekAndDayLetter'],
		getCurVP: function(tend) {
			if (tend === '-') return this.unitList[--this.curUnit];
			else if (tend === '+') return this.unitList[++this.curUnit];
			else return this.unitList[this.curUnit];
		},
		add: function() {
			vpGantt.gantt.switchViewPreset(this.getCurVP('+'), vpGantt.startDate, vpGantt.endDate, true);
			if (this.curUnit == (this.unitList.length - 1)) Ext.getCmp('gantt-zoom-bt').setDisabled(true);
			if (this.curUnit == 1) Ext.getCmp('gantt-shrink-bt').setDisabled(false);
		},
		sub: function() {
			vpGantt.gantt.switchViewPreset(this.getCurVP('-'), vpGantt.startDate, vpGantt.endDate, true);
			if (this.curUnit == 0) Ext.getCmp('gantt-shrink-bt').setDisabled(true);
			if (this.curUnit == (this.unitList.length - 2)) Ext.getCmp('gantt-zoom-bt').setDisabled(false);
		}
	};

	vpGantt.scrollToDate=function(date){
		try{
			var sd=Math.round(this.startDate.getTime()/86400000),ed=Math.round(this.endDate.getTime()/86400000),cd=Math.round(date.getTime()/86400000);
			if(sd<=cd&&cd<=ed){
				var distance = this.getNormalView().getXYFromDate(date,true)[0],unitNum=4,offsetRight=unitNum*22;
				var scrollerOwner = this.getNormalView().up("[scrollerOwner]"), hScroller = scrollerOwner.getHorizontalScroller();
				if(hScroller){
					hScroller.setScrollLeft(distance>offsetRight?distance-offsetRight:distance);
				}
		        
			}
		}catch(e){
			;
		}
		
	};
	
	vpGantt.buttons =[
	{
		text: '放大',
		iconCls: 'gantt-zoom-bt',
		id: 'gantt-zoom-bt',
		disabled: true,
		width: 60,
		handler: function() {
			vpGantt.dateUnitChange.add();
		}
	},
	{
		text: '缩小',
		iconCls: 'gantt-shrink-bt',
		id: 'gantt-shrink-bt',
		width: 60,
		disabled: false,
		handler: function() {
			vpGantt.dateUnitChange.sub();
		}},
	"->", "<div id=\"_tipsDiv\" style=\"width: 100px;\"></div>"];
	vpGantt.disableBt = function(bt) {
		if(Ext.getCmp(bt)){
			Ext.getCmp(bt).setDisabled(true);
		}
	};
	vpGantt.enableBt = function(bt) {
		if(Ext.getCmp(bt)){
			Ext.getCmp(bt).setDisabled(false);
		}
	};
	vpGantt.setBtText=function(bt,text){
		if(Ext.getCmp(bt)){
			Ext.getCmp(bt).setText(text);
		}
	};

	vpGantt.setStores = function(tStore, store) {
		vpGantt.taskStore = tStore;
		vpGantt.store = store;
	};

	
	Ext.onReady(function() {
		vpGantt.buildGantt();
		
	});
	vpGantt.buildGantt = function() {
		//vpGantt.initPageingbar();
		if(vpGantt.getData()){
			if(timeOut){
				vpGantt.gridMask.hide();
				return;
			}
			vpGantt.buildGrid();
			setTimeout("vpGantt.loadPage()", 1);
		}
		
	};


	vpGantt.parseDate = function(str) {
		try{
			var year = str.substring(0, 4),
			month = str.substring(5, 7),
			day = str.substring(8, 10);
			return new Date(year, (parseInt(month, 10) - 1), day);
		}catch(e){
			return this.startDate||new Date();
		}
	};

	vpGantt.initDateScope = function() {
		var me=this;
		if(me.startDateStr){
			vpGantt.startDate =vpGantt.parseDate(me.startDateStr);
		}else{
			vpGantt.startDate=new Date();
			vpGantt.startDate.setMonth(vpGantt.startDate.getMonth()-1);
		}
		if(me.endDateStr){
			vpGantt.endDate =vpGantt.parseDate(me.endDateStr);
		}else{
			vpGantt.endDate=new Date();
			vpGantt.endDate.setMonth(vpGantt.endDate.getMonth()+1);
		}


		if (!vpGantt.startDate || !vpGantt.endDate || (vpGantt.endDate.getTime() < vpGantt.startDate.getTime())) {
			alert('开始日期或完成日期异常，请检查项目的基本信息！');
			vpGantt.gridMask.hide();
		}

	};
	vpGantt.tpbar= Ext.create('Ext.PagingToolbar', {
        store: vpGantt.taskStore,
        items:vpGantt.buttons
       // displayInfo: true,
       // displayMsg: 'Displaying topics {0} - {1} of {2}',
       // emptyMsg: "No topics to display",
       
    });
	vpGantt.buildGrid = function() {
		var me=this;
		me.initDateScope();
		me.gantt = Ext.create('Gnt.panel.Gantt', {
			height: me.getTotalHeight(),
			width: Gantt.width,
			border:false,
			renderTo: Ext.get(vpGantt.ganttdiv),
			multiSelect: false,
			leftLabelField: {
				dataIndex: 'Name',
				editor: {
					xtype: 'textfield'
				}
			},
			enableDependencyDragDrop: false,
			enableTaskDragDrop: false,
			highlightWeekends: true,
			showTodayLine: true,
			loadMask: true,
			snapToIncrement: true,
			startDate: vpGantt.startDate,
			endDate: vpGantt.endDate,
			viewPreset: 'weekAndDayLetter',
			columns: vpGantt.columns,
			//tbar: vpGantt.buttons,
			tbar:vpGantt.tpbar,
			taskStore: vpGantt.taskStore,
			stripeRows: true,
			  viewConfig:{
				  	forceFit:false,
					getRowClass : function(record,rowIndex,rowParams,store){ 
	                    if(record.data.KeyTask){
	                        return 'key-path-cls';
	                    }                        
	                }                       
			}
		});
		vpGantt.bindResize();
	};
	vpGantt.getGanttView=function(){
		return this.gantt.lockedGrid.getView();
	};
	vpGantt.getNormalView=function(){
		return this.gantt.normalGrid.getView();
	};

	vpGantt.loadData = function() {
		
		var me=this;
		if(me.DataLoaded)return;
		var d1=new Date();
		this.taskStore.proxy.data = me.data;
		
		this.taskStore.load();
		vpGantt.scrollToDate(me.parseDate(me.firstItemDate)||me.startDate);
		vpGantt.gridMask.hide();
		me.changeHeight();
		me.DataLoaded=true;
	};
	vpGantt.getTotalHeight=function(){
		
		var me=this,
		totalHeight=0;
		if(parent.MeterUtil){
			totalHeight=(me.data.length||1)*24+97;
		}else{
			totalHeight=document.body.scrollHeight;
		}
		
		return totalHeight;
	}
	vpGantt.changeHeight = function() {
		if(parent.MeterUtil){
			var me=this,totalHeight=me.getTotalHeight();
			//me.gantt.setHeight(totalHeight);
			me.setPanelHeight(totalHeight);
		}
	};
	
	vpGantt.loadPage = function() {
		try {
			this.taskStore.loadPage(this.curPage);
			if(loaded){
				loaded();
			}
		} catch(e) {
			alert(e.message);
			vpGantt.gridMask.hide();
		}
	};

	var SelfReportDriver={
			resetGridWidth:function(){
				var me=this;
				if(document.body.scrollWidth-document.body.clientWidth<10){
					me.gantt.setWidth(document.body.clientWidth);
				}
				
			},
			setCondition:function(condition){
		    	var me=vpGantt;
		    	me.setParentCondition(condition);
		    	vpGantt.setParentCurPage(1);
		    	setTimeout(function(){
					window.location.reload();
				},100);
		    }
		};
	
	
	



	

	vpGantt.bindResize = function() {
		vpGantt.preWidth = document.body.clientWidth;
		if (window.addEventListener) {
			window.addEventListener('resize',
			function() {
				if (document.body.clientWidth < vpGantt.preWidth) vpGantt.gantt.setWidth(document.body.clientWidth + 17);
				else vpGantt.gantt.setWidth(document.body.clientWidth);
				vpGantt.gantt.setHeight(document.body.clientHeight);
				vpGantt.preWidth = document.body.clientWidth;
			},
			false);
		} else {
			window.attachEvent('onresize',
			function() {
				vpGantt.gantt.setWidth(document.body.clientWidth);
				vpGantt.gantt.setHeight(document.body.clientHeight);
			});
		}
	};


	
} catch(e) {
	//alert(e.message);
	if(vpGantt&&vpGantt.gridMask)
		vpGantt.gridMask.hide();
}