try {
	
	function getSigleTask(taskStore, leaf) {
		var date = new Date(2010, 1, 2);
		var newM = new taskStore.model({
			PercentDone: 0,
			Name: 'newTask',
			StartDate: date,
			EndDate: date,
			Duration: 0,
			DurationUnit: 'd',
			leaf: leaf,
			children: []
		});
		newM.childNodes = [];
		return newM;
	}

	
	
	function copyTask(c) {
		var curStartDate, curEndDate;
		curStartDate = c.get("StartDate");
		curEndDate = new Date(c.get("StartDate").getTime() + (3600 * 24 * 1000));
		var a = new Gnt.model.Task({
			IndicateLight: '{0}{0}{0}{0}',
			Id: 'T_' + vpGantt.newId,
			PercentDone: 0,
			BaselineWorkLoad: 0,
			WorkLoad: 0,
			Name: 'newTask_' + vpGantt.newId++,
			StartDate: curStartDate,
			EndDate: curEndDate,
			BaselineStartDate: '',
			BaselineEndDate: '',
			Duration: 1,
			DurationUnit: (c && c.get("DurationUnit")) || "d",
			leaf: true
		});
		return a;
	};
	
	vpGantt.genNode=function(cfg){
		
		
		cfg.children=[{}];
		cfg.DurationUnit="d"
		var newnode=new Gnt.model.Task(cfg);
		
		newnode.commit();
		return newnode;
	}
	
	Ext.define("Task", {
		extend: "Gnt.model.Task",
		associations: [{
			model: 'Assignment',
			name: 'assignments',
			type: 'hasMany',
			primaryKey: 'Id',
			foreignKey: 'TaskId',
			associationKey: 'assignments'
		}]
	});
	Ext.define("Assignment", {
		extend: "Gnt.model.Assignment",
		belongsTo: 'Task'
	});
	vpGantt.resourceStore = Ext.create("Gnt.data.ResourceStore", {
		model: 'Gnt.model.Resource',
		proxy: {
			type: 'memory',
			reader: {
				type: 'json'
			}
		}
	});
	vpGantt.assignmentStore = Ext.create("Gnt.data.AssignmentStore", {
		model: 'Assignment',
		resourceStore: vpGantt.resourceStore,
		proxy: {
			type: 'memory',
			reader: {
				type: 'json'
			}
		},
		 root : 'assignments'
	});
	vpGantt.doRollUp = false;
	vpGantt.isDoRollUp = function() {
		return this.doRollUp;
	};
	vpGantt.setDoRollUp = function() {
		this.doRollUp = arguments[0];
	};

	vpGantt.taskStore = Ext.create("Gnt.data.TaskStore", {
		recalculateParents:vpGantt.isDoRollUp(),
		calendar:new Gnt.data.Calendar({
			weekendsAreWorkdays:vpGantt.skipAllHoliday||false
		}),
		buffered: false,
		model: 'Task',
		proxy: {
			type: 'memory',
			reader: {
				type: 'json'
			}
		}
	});
    
	vpGantt.getData = function() {
		//debugger;
		var resdata;
		jQuery.ajax({
			url:vpGantt.loadUrl,
			data: vpGantt.loadParas ,
			type: 'post',
			async: false,
			success: function(res) {
				resdata = res.data.json;
			},
			dataType: 'json'
		});
		return resdata;
	};
	vpGantt.assignmentEditor = Ext.create('Gnt.widget.AssignmentCellEditor', {
		assignmentStore: vpGantt.assignmentStore,
		resourceStore: vpGantt.resourceStore
	});

	vpGantt.workLoadPrecision=0.01;
	vpGantt.setWorkLoadPrecision=function(wp){
		this.workLoadPrecision=wp;
	};
	vpGantt.getWorkLoadPrecision=function(){
		return this.workLoadPrecision;
	};
	vpGantt.getWLByPrecision=function(v){
		var preBig=(1/this.workLoadPrecision);
		return Math.round(parseFloat(v)*preBig)/preBig;
	};


	vpGantt.colSlider = new Ext.create("Ext.slider.Single", {
		value: Sch.preset.Manager.getPreset('weekAndDayLetter').timeColumnWidth,
		width: 120,
		minValue: 80,
		maxValue: 240,
		increment: 10
	});
	vpGantt.showEditingMask = function() {
		if(!vpGantt.gridMask){
			vpGantt.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
				msg: "正在编辑数据..."
			});
		}
		
		vpGantt.gridMask.show();
	};
	vpGantt.hideEditingMask = function() {
		if(vpGantt.gridMask){
			vpGantt.gridMask.hide();
		}
		
	};
	vpGantt.getRootNode=function(){
		if(!this.rootNode){
			this.rootNode=this.gantt.getTaskStore().getRootNode();
		}
		return this.rootNode;
	}
	vpGantt.rootIsEmpty=function(){
		var rootNode = this.getRootNode();
		return rootNode.childNodes.length<1;
	}
	vpGantt.getAllTasksStr = function() {
		var rootNode = this.getRootNode(),
		tasks = '{"tasks":[';
		for (var i = 0; i < rootNode.childNodes.length; i++) {
			if (i < 1) tasks += this.getSingleNodeStr(rootNode.childNodes[i]);
			else tasks += ',' + this.getSingleNodeStr(rootNode.childNodes[i]);
		}
		tasks += ']}';
		tasks = encodeURIComponent(tasks);
		return tasks;
	};
	Date.prototype.getFullTime = function() {
		return this.getFullYear() + '-' + (this.getMonth() > 8 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)) + '-' + this.getDate()+' '
		+this.getHours()+':'+this.getMinutes()+':'+this.getSeconds();
	};
	Date.prototype.getYMD = function() {
		//return this.getFullTime();
		return this.getFullYear() + '-' + (this.getMonth() > 8 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)) + '-' + this.getDate();
	};
	
	vpGantt.trimWLValue=function(v){
		return this.getWLByPrecision(v);
	};
	vpGantt.getSingleNodeStr = function(snode) {
		var curHas = snode.hasChildNodes();
		var curStr = '{'; 

		var subFs=vpGantt.submitFileds;
		for(var w=0;w<subFs.length;w++){
			var cf=subFs[w];
			if(w==0){
				curStr += '"'+cf.name+'":"' +cf.getVal(snode);
			}else{
				curStr += '","'+cf.name+'":"' +cf.getVal(snode);
			}
		}
		curStr +='","children":[';
		for (var i = 0; i < snode.childNodes.length; i++) {
			if (i < 1) curStr += this.getSingleNodeStr(snode.childNodes[i]);
			else curStr += ',' + this.getSingleNodeStr(snode.childNodes[i]);
		}
		curStr += ']}';
		return curStr;
	};
	vpGantt.addSomeBrotherU = function(thecount) {
		var curcount = thecount,
		cur = vpGantt.gantt.getSelectionModel().selected.first(),
		parentNode = cur.parentNode,
		sdate = vpGantt.getNewStartDate(parentNode);
		var curEndDate = new Date(sdate.getTime() + (3600 * 24 * 1000));
		while (curcount-->0) {
			var newTask = new Gnt.model.Task({
				IndicateLight: '{0}{0}{0}{0}',
				Id: 'T_' + vpGantt.newId,
				PercentDone: 0,
				BaselineWorkLoad: 0,
				WorkLoad: 0,
				Name: 'newTask_' + vpGantt.newId++,
				StartDate: sdate,
				EndDate: curEndDate,
				BaselineStartDate: '',
				BaselineEndDate: '',
				Duration: 1,
				DurationUnit: "d",
				leaf: true
			});
			parentNode.insertBefore(newTask, cur);
			newTask.commit();
		}
		vpGantt.changeComponent.insertRecords(false, true, thecount);
		vpGantt.gridMask.hide();
	};
	vpGantt.addSomeBrotherD = function(thecount) {
		var curcount = thecount,
		cur = vpGantt.gantt.getSelectionModel().selected.first(),
		parentNode = cur.parentNode,
		sdate = vpGantt.getNewStartDate(parentNode);
		var curEndDate = new Date(sdate.getTime() + (3600 * 24 * 1000));
		while (curcount-->0) {
			var newTask = new Gnt.model.Task({
				IndicateLight: '{0}{0}{0}{0}',
				Id: 'T_' + vpGantt.newId,
				PercentDone: 0,
				BaselineWorkLoad: 0,
				WorkLoad: 0,
				Name: 'newTask_' + vpGantt.newId++,
				StartDate: sdate,
				EndDate: curEndDate,
				BaselineStartDate: '',
				BaselineEndDate: '',
				Duration: 1,
				DurationUnit: "d",
				leaf: true
			});
			parentNode.insertBefore(newTask, cur.nextSibling);
			newTask.commit();
		}
		vpGantt.changeComponent.insertRecords(false, true, thecount);
		vpGantt.gridMask.hide();
	};
	vpGantt.getNewStartDate = function(parentNode) {
		var today = new Date();
		if (parentNode && !parentNode.isRoot()) {
			if (today.getTime() > parentNode.get("StartDate").getTime()) {
				return new Date(today.getFullYear(), today.getMonth(), today.getDate());
			} else return parentNode.get("StartDate");
		} else {
			if (today.getTime() > vpGantt.startDate.getTime() && today.getTime() < vpGantt.endDate.getTime()) {
				return new Date(today.getFullYear(), today.getMonth(), today.getDate());
			} else return vpGantt.startDate;
		}
	};
	vpGantt.rootAddChildren = function(thecount) {
		var curdate = vpGantt.getNewStartDate(),
		curcount = thecount,
		root = this.gantt.getTaskStore().getRootNode(),
		curEndDate = new Date(curdate.getTime() + (3600 * 1000 * 24));
		root.set("leaf", false);
		while (curcount--){
			var newTask = new Gnt.model.Task({
				Id: 'T_' + vpGantt.newId,
				PercentDone: 0,
				Name: 'newTask_' + vpGantt.newId++,
				StartDate: curdate,
				EndDate: curEndDate,
				WorkLoad: 0,
				Duration: 1,
				DurationUnit: "d",
				leaf: true
			});
			newTask.commit();
			root.appendChild(newTask);
		}
		root.expand();
		vpGantt.changeComponent.insertRecords(false, true, thecount);
		vpGantt.gridMask.hide();
	};
	vpGantt.addChildren = function(thecount) {
		var curcount = thecount,
		cur = this.gantt.getSelectionModel().selected.first();
		cur.set("leaf", false);
		while (curcount--) {
			var newTask = copyTask(cur);
			newTask.commit();
			cur.appendChild(newTask);
		}
		cur.expand();
		vpGantt.changeComponent.insertRecords(false, true, thecount);
		vpGantt.gridMask.hide();
	};
	vpGantt.downGrade = function() {
		var cur = vpGantt.gantt.getSelectionModel().selected.first();
		if (!cur.previousSibling) {
			alert('当前任务之前没有同级任务,不能对其进行降级!');
			vpGantt.gridMask.hide();
			return;
		} else {
			var preNode = cur.previousSibling;
			preNode.set("leaf", false);
			preNode.appendChild(cur);
			preNode.expand()
		}
		if (vpGantt.isDoRollUp()) {
			var curParent = cur.parentNode;
			while (curParent) {
				if (curParent.childNodes.length > 0) {
					var wlNum = 0;
					for (var i = 0; i < curParent.childNodes.length; i++) {
						if (curParent.childNodes[i].get("WorkLoad") != '');
						wlNum += curParent.childNodes[i].get("WorkLoad");
					}
					curParent.set({
						WorkLoad: wlNum
					});
				}
				curParent = curParent.parentNode;
			}
		}
		vpGantt.changeComponent.setOtherChanged(true);
		vpGantt.gridMask.hide();
	};
	vpGantt.accessAllNodes = function(node, callObj) {
		callObj.func(node);
		if (node.childNodes) for (var i = 0; i < node.childNodes.length; i++) {
			this.accessAllNodes(node.childNodes[i], callObj);
		}
	};
	vpGantt.delTask = function() {
		var cur = vpGantt.gantt.getSelectionModel().selected.first();
		if (cur.parentNode.childNodes.length == 1) {
			cur.parentNode.set("leaf", true)
		}
		cur.remove();
		vpGantt.changeComponent.setOtherChanged(true);
		vpGantt.gridMask.hide();
	};
	vpGantt.upGrade = function() {
		var cur = vpGantt.gantt.getSelectionModel().selected.first(),
		hasfellow = cur.nextSibling;
		var curParent = cur.parentNode;
		if (curParent.isRoot()) {
			alert('当前任务为顶层任务,不能对其进行升级!');
			vpGantt.gridMask.hide();
			return;
		}
		var cArray = new Array(),
		nextNode = cur.nextSibling;
		if (nextNode) {
			var b = new Date(9999, 0, 0),
			c = new Date(0),
			e = cur;
			while (nextNode) {
				cArray.push(nextNode);
				if (vpGantt.isDoRollUp()) {
					var f = nextNode;
					b = Sch.util.Date.min(b, f.get("StartDate") || b);
					c = Sch.util.Date.max(c, f.get("EndDate") || c);
				}
				nextNode = nextNode.nextSibling;
			}
			if (vpGantt.isDoRollUp()) {
				var sDate = e.get("StartDate").toString(),
				eDate = e.get("EndDate").toString(),
				db = b.toString(),
				dc = c.toString();
				if (b > c) {
					c = b;
				}
				if (e.get("StartDate") - b !== 0) {
					e.set("StartDate", b);
				}
				if (e.get("EndDate") - c !== 0) {
					e.set("EndDate", c);
				}
				var duration = e.calculateDuration(e.get("StartDate"), e.get("EndDate"), e.get("DurationUnit"));
				e.set("Duration", duration);
			}
		}
		if (curParent.nextSibling) curParent.parentNode.insertBefore(cur, curParent.nextSibling);
		else curParent.parentNode.appendChild(cur);
		if (cArray.length > 0) {
			cur.appendChild(cArray);
			cur.set("leaf", false);
			cur.expand();
		}
		curParent.set("leaf", curParent.childNodes.length < 1);
		if (vpGantt.isDoRollUp()) {
			if (hasfellow) {
				var wlNum = 0;
				for (var i = 0; i < cur.childNodes.length; i++) {
					if (cur.childNodes[i].get("WorkLoad") != '');
					wlNum += cur.childNodes[i].get("WorkLoad");
				}
				cur.set({
					WorkLoad: wlNum
				});
			}
			while (curParent) {
				if (curParent.childNodes.length > 0) {
					var wlNum = 0;
					for (var i = 0; i < curParent.childNodes.length; i++) {
						if (curParent.childNodes[i].get("WorkLoad") != '');
						wlNum += curParent.childNodes[i].get("WorkLoad");
					}
					curParent.set({
						WorkLoad: wlNum
					});
				}
				curParent = curParent.parentNode;
			}
		}
		vpGantt.changeComponent.setOtherChanged(true);
		vpGantt.gridMask.hide();
	};
	vpGantt.importChildren = function() {
		var cur = vpGantt.gantt.getSelectionModel().selected.first();
		if (!cur.get('leaf')) {
			alert('当前节点不是叶子节点,不能对其进行任务导入!');
			return;
		}
		var tTaskStore = vpGantt.gantt.getTaskStore();
		injectNodes2Node(cur, tTaskStore, 200);
		cur.expand();
	};
	vpGantt.importProject = function(task, toolbar, pos) {
		if (vpGantt.getTaskId() != 'null') task = true;
		var title = '导入Project文件',
		height = 180,
		width = 400,
		projectId = vpGantt.getProjectId();
		if (task) {
			var curTaskId = (toolbar ? vpGantt.getTaskId() : vpGantt.gantt.getSelectionModel().selected.first().get("Id"));
			vpGantt.showModalWin('/project/wbs/task/import4ProjectTask.jsp?isTemplate=0&projectID=' + projectId + '&taskid=' + curTaskId + '&pos=' + pos + '&idIsReal=' + toolbar, title, height, width);
		} else vpGantt.showModalWin('/project/wbs/task/import4Project.jsp?isTemplate=0&projectID=' + projectId + '&pos=' + pos + '&idIsReal=' + toolbar, title, height, width);
	};
	


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
	vpGantt.afterEWIndecator = 1;
	vpGantt.afterEWClose = function() {
		if (vpGantt.afterEWIndecator == -1||vpGantt.afterEWIndecator=='-1') {
			vpGantt.changeComponent.clear();
			top.open('','_self','');
			top.close();
		} else {
			vpGantt.changeComponent.clear();
			vpGantt.reloadProject();
		}
	};
	vpGantt.showErrorMsg = function() {
		if (!vpGantt.genPlanWin) vpGantt.genPlanWin = Ext.create('Ext.Window', {
			width: 450,
			height: 300,
			modal: true,
			x: 450,
			y: 200,
			headerPosition: 'top',
			layout: 'fit',
			items: {
				autoScroll: true,
				border: 0,
				html: '<div style="width:100%;height:100%;border:0px solid #000;background-color:#ddd;"  ><div id="error-div"></div><div id="error-detail" style="border:0px solid #000;background-color:#ddd;" ></div></div>'
			},
			buttons: [{
				text: '关闭',
				xtype: 'button',
				handler: function() {
					vpGantt.afterEWClose();
				}
			}],
			closeAction: 'hide',
			closable: false,
			bodyBorder: false
		});
		vpGantt.genPlanWin.show();
	};
	vpGantt.modalWin;
	vpGantt.showModalWin = function(src, title, height, width) {
		var width = (width || 450),
		height = (height || 300),
		x = (document.body.clientWidth - width) / 2,
		y = (document.body.clientHeight - height) / 2;
		vpGantt.modalWin = Ext.create('Ext.Window', {
			width: width,
			height: height,
			title: title,
			modal: true,
			x: x,
			y: y - 120,
			headerPosition: 'top',
			layout: 'fit',
			items: {
				border: 0,
				html: ' <iframe src="' + src + '" style="width:100%;height:100%;" name="bottom" scrolling="NO" frameborder="0" noresize>'
			},
			closeAction: 'destroy',
			closable: true,
			bodyBorder: false
		});
		vpGantt.modalWin.show();
		jQuery('#wlt-modalWin').css('display', 'block');
	};
	vpGantt.genPlan = function(type) {
		vpGantt.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
			msg: "正在复制数据..."
		});
		vpGantt.gridMask.show();
		setTimeout("vpGantt.genPlanByType(" + type + ")", 10);
	};
	vpGantt.showGenPlanWin = function() {
		if ((! (navigator.userAgent.indexOf("chromeframe") > 0)) && (!(navigator.userAgent.indexOf("Chrome") > 0))) vpGantt.showModalWin('/project/wbs/task/genPlanWindow.jsp', '生成任务计划', 230);
		else vpGantt.showModalWin('/project/wbs/task/genPlanWindow.jsp', '生成任务计划', 215);
	};
	vpGantt.saveAllData = function() {
		/* {
				projectId: vpGantt.getProjectId(),
				taskId: vpGantt.getTaskId() == 'null' ? 0 : vpGantt.getTaskId(),
				codetype: 'utf8',
				themethod: 'saveTasks',
				tasks: vpGantt.getAllTasksStr()
			}
		 * */
		var subData=vpGantt.saveParas;
		subData.tasks=vpGantt.getAllTasksStr();
		jQuery.ajax({
			url:vpGantt.saveUrl||'/project/wbs/ganttLoadAction.do',
			data:subData,
			type: 'post',
			async: false,
			success: function(res) {
				if (res.success) {
					vpGantt.changeComponent.clear();
					//window.location.reload();
					vpGantt.reloadProject();
					return;
					vpGantt.reload(res.data);
					vpGantt.changeComponent.clear();
					vpGantt.disableBt('gantt-save-bt');
					vpGantt.disableBt('gantt-schedule-bt');
					vpGantt.enableImport();
					vpGantt.gridMask.hide();
				} else {
					//vpGantt.afterEWIndecator = (res.failMsgID<0 ? -1 : 1);
					vpGantt.afterEWIndecator = res.failMsgID;
					vpGantt.gridMask.hide();
					vpGantt.showErrorMsg();
					jQuery('#error-div').html(res.failMsg);
					if (res.items && res.items.length > 0) {
						var detailTab = '<table id="error-detail-tab" width="100%"><tr width="30%" class="first-tr"><td width="30%">ID</td><td width="30%">名称</td><td width="30%">前置</td></tr>'
						for (var i = 0,
						items = res.items; i < items.length; i++) {
							detailTab += '<tr><td colspan=3 style="font-weight:bold;font-size:10px;height:20px;">环路' + (i + 1) + '</td></tr>';
							for (var j = 0,
							inItems = items[i].item; j < inItems.length; j++) {
								detailTab += '<tr><td>' + inItems[j].id + '</td><td>' + inItems[j].name + '</td><td>' + inItems[j].preid + '</td></tr>';
							}
						}
						detailTab += '</table>';
						jQuery('#error-detail').html(detailTab);
					}
				}
			},
			dataType: 'json'
		});
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
			vpGantt.gantt.switchViewPreset(this.getCurVP('+'), vpGantt.startDate, vpGantt.endDate, false);
			if (this.curUnit == (this.unitList.length - 1)) Ext.getCmp('gantt-zoom-bt').setDisabled(true);
			if (this.curUnit == 1) Ext.getCmp('gantt-shrink-bt').setDisabled(false);
		},
		sub: function() {
			vpGantt.gantt.switchViewPreset(this.getCurVP('-'), vpGantt.startDate, vpGantt.endDate, false);
			if (this.curUnit == 0) Ext.getCmp('gantt-shrink-bt').setDisabled(true);
			if (this.curUnit == (this.unitList.length - 2)) Ext.getCmp('gantt-zoom-bt').setDisabled(false);
		}
	};
	vpGantt.reloadProject=function(){
		//window.location.reload();
		//location.href=location.href;
		
		var url=location.href;
		url=url.replace('#','');
		url+='&ctime='+(new Date().getTime());
		location.href = url;
	};
	vpGantt.scrollToDate=function(date){
		try{
			vpGantt.gantt.scrollToDate(date);
		}catch(e){
			;
		}
		
	};

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
	vpGantt.changeComponent = {
		otherChanged: false,
		changed:false,
		setChanged:function(val){
			if(this.changed=val){
				vpGantt.CalendarTitle= '项目日历';
				//vpGantt.setBtText('gantt-pjcal-bt',vpGantt.CalendarTitle);
			}
		},
		getChanged:function(){
			return this.changed;
		},
		setOtherChanged: function() {
			this.otherChanged = arguments[0];
			this.setChanged(this.otherChanged?true:this.getChanged());
			if (this.otherChanged) Common.setMenuBeforeClickOpenState(true);
			vpGantt.changeComponent.changeSaveAndScheduleBtState();
		},
		
		insertRecords: function(old, add, num) {
			this.setOtherChanged(true);
		},
		dragChanged: false,
		isChanged: function() {
			return this.otherChanged || this.dragChanged;
		},
		changeSaveAndScheduleBtState: function() {
			if (this.isChanged()) {
				vpGantt.enableBt('gantt-save-bt');
				vpGantt.enableBt('gantt-schedule-bt');
				//vpGantt.disableImport();
			} else {
				vpGantt.disableBt('gantt-save-bt');
				vpGantt.disableBt('gantt-schedule-bt');
				//vpGantt.enableImport();
			}
		},
		normalChange: {
			isNormalChanged: function() {
				return (this.records.oldDeleteLength != 0) || (this.records.insertLength != 0) || (this.records.updateLength != 0);
			},
			lastChange: null,
			records: {
				updateRecords: {},
				insertLength: 0,
				oldDeleteLength: 0,
				updateLength: 0,
				maxLength: 5,
				addUpdateLength: function(add) {
					if (add) this.updateLength++;
					else this.updateLength--;
					vpGantt.changeComponent.changeSaveAndScheduleBtState();
				},
				changeInsertLength: function(old, add, num) {
					old ? (add ? this.oldDeleteLength += num: this.oldDeleteLength -= num) : (add ? this.insertLength += num: this.insertLength -= num);
					vpGantt.changeComponent.changeSaveAndScheduleBtState();
				}
			},
			curModified: function() {
				if (!this.lastChange) return false;
				else {
					
					//return this.lastChange.isModified("ResIds") || this.lastChange.isModified("Id") || this.lastChange.isModified("Name") || this.lastChange.isModified("StartDate") || this.lastChange.isModified("EndDate") || this.lastChange.isModified("Duration") || this.lastChange.isModified("DurationUnit") || this.lastChange.isModified("PercentDone") || this.lastChange.isModified("WorkLoad") || this.lastChange.isModified("BaselineStartDate") || this.lastChange.isModified("BaselineEndDate") || this.lastChange.isModified("BaselineDuration") || this.lastChange.isModified("BaselineWorkLoad") || this.lastChange.isModified("DependencyTask");
					var cols=vpGantt.columns,changed=false;
					for(var i=0;i<cols.length;i++){
						if(this.lastChange.isModified(cols[i].dataIndex)){
							changed=true;
							break;
						}
					}
					return changed;
				}
			},
			setLast: function(cur) {
				this.lastChange = cur;
				if (this.curModified()) {
					vpGantt.changeComponent.setOtherChanged(true);
				} else {
					return;
				}
			}
		},
		dragChange: {
			sourceNodeId: null,
			sourceNodeName: null,
			targetNodeId: null,
			targetNodeName: null,
			preParent: null,
			curParent: null,
			hangon: false,
			setParaAndSend: function(src, des, position) {
				
				this.sourceNodeId = src.get("Id");
				this.sourceNodeName = src.get("Name");
				this.targetNodeId = des.get("Id");
				this.targetNodeName = des.get("Name");
				if (vpGantt.changeComponent.dragChanged = true) {
					vpGantt.enableBt('gantt-save-bt');
					vpGantt.enableBt('gantt-schedule-bt');
					vpGantt.disableImport();
				}
				vpGantt.changeComponent.setChanged(vpGantt.changeComponent.dragChanged?true:vpGantt.changeComponent.getChanged());
				if (vpGantt.changeComponent.dragChanged) Common.setMenuBeforeClickOpenState(true);
				this.preParent = src.parentNode;
				if (position == 'apend') {
					if (this.preParent.get("Id") == des.get("Id")) return;
					else {
						this.curParent = this.des;
					}
				} else if (position == 'after') {
					if (this.preParent.get("Id") == des.parentNode.get("Id")) return;
					else {
						this.curParent = des.parentNode;
					}
				} else if (position == 'before') {
					if (this.preParent.get("Id") == des.parentNode.get("Id")) return;
					else {
						this.curParent = des.parentNode;
					}
				}
				this.hangon = true;
			},
			calcuWorkLoad: function() {
				if (!this.hangon || !vpGantt.isDoRollUp()) return;
				var preParent = this.preParent,
				curParent = this.curParent;
				var j = 1,
				array = new Array();
				array.push(preParent);
				array.push(curParent);
				while (j > ( - 1)) {
					var wlNum = 0;
					if (array[j].childNodes && array[j].childNodes.length > 0) {
						for (var i = 0; i < array[j].childNodes.length; i++) {
							if (array[j].childNodes[i].get("WorkLoad") != '');
							wlNum += array[j].childNodes[i].get("WorkLoad");
						}
						array[j].set("WorkLoad", wlNum);
					}
					j--;
				}
				preParent = preParent.parentNode,
				curParent = curParent.parentNode;
				while (preParent) {
					var wlNum = 0;
					if (preParent.childNodes && preParent.childNodes.length > 0) {
						for (var i = 0; i < preParent.childNodes.length; i++) {
							if (preParent.childNodes[i].get("WorkLoad") != '');
							wlNum += preParent.childNodes[i].get("WorkLoad");
						}
						preParent.set("WorkLoad", wlNum);
					}
					preParent = preParent.parentNode;
				}
				while (curParent) {
					var wlNum = 0;
					if (curParent.childNodes && curParent.childNodes.length > 0) {
						for (var i = 0; i < curParent.childNodes.length; i++) {
							if (curParent.childNodes[i].get("WorkLoad") != '');
							wlNum += curParent.childNodes[i].get("WorkLoad");
						}
						curParent.set("WorkLoad", wlNum);
					}
					curParent = curParent.parentNode;
				}
				this.preParent = null,
				this.curParent = null,
				this.hangon = false;
			}
		},
		clear: function() {
			this.otherChanged = false;
			this.dragChanged = false;
			Common.setMenuBeforeClickOpenState(false);
		}
	};
	vpGantt.setStores = function(tStore, store) {
		vpGantt.taskStore = tStore;
		vpGantt.store = store;
	};
	vpGantt.editingDependencys = false;
	vpGantt.setEditingDependencies = function() {
		this.editingDependencys = arguments[0];
	};
	vpGantt.isEditingDependencies = function() {
		return this.editingDependencys;
	};
	vpGantt.setDependency = function(from, to, type) {
		this.store.each(function(record) {
			if (record.get("To") === to) this.store.remove(record);
		});
		if (from === '') return;
		var froms = from.split(',');
		if (froms.length < 1) {;
		} else {
			var noids = '',
			canids = '',
			nocount = 0,
			cancount = 0;
			for (var i = 0; i < froms.length; i++) {
				if (!vpGantt.taskStore.getNodeById(froms[i])) {
					if (nocount++!=0) noids += ',' + froms[i];
					else noids += froms[i];
					continue;
				}
				if (this.taskStore.isValidDependency(froms[i], to)) {
					this.store.add(new this.store.model({
						From: froms[i],
						To: to,
						Type: type
					}));
					if (cancount++!=0) canids += ',' + froms[i];
					else canids += froms[i];
				} else {
					if (nocount++!=0) noids += ',' + froms[i];
					else noids += froms[i];
				}
			}
			var curto = vpGantt.taskStore.getNodeById(to);
			curto.set("DependencyTask", canids);
			if (nocount > 0) alert('任务 ' + noids + ' 不能被设置为当前任务的前置任务!');
		}
	};
	Ext.tree.ViewDropZone.override({
		handleNodeDrop: function(data, targetNode, position) {
			vpGantt.changeComponent.dragChange.setParaAndSend(data.records[0], targetNode, position);
			var srcParent = data.records[0].parentNode;
			if (srcParent.childNodes.length == 1) {
				srcParent.set("leaf", true);
				srcParent.callStore('afterEdit');
			}
			this.callOverridden(arguments);
		}
	});
	Ext.dd.DragSource.override({
		onDragDrop: function() {
			this.callOverridden(arguments);
			vpGantt.changeComponent.dragChange.calcuWorkLoad();
		}
	});
	Ext.dd.DragSource.override({
		onDragDrop: function() {
			this.callOverridden(arguments);
			vpGantt.changeComponent.dragChange.calcuWorkLoad();
		}
	});
	Ext.grid.CellEditor.override({
		context: null,
		startEdit: function(c, b, a) {
			this.context = a;
			this.callOverridden(arguments);
		},
		completeEdit: function(a) {
			this.callOverridden(arguments);
			if(this.context&&this.context.record){
				vpGantt.changeComponent.normalChange.setLast(this.context.record);
			}
			vpGantt.setEditingWorkLoad(false);
		}
	});
	
	vpGantt.getResIcon=function(ct){
		return this.iconMap[ct+''];
		
	};
	vpGantt.genResCls=function(data){
		this.iconMap={};
		var ResIcons=data.resIcons;
		if(!(ResIcons&&ResIcons.length>0)){
			return;
		}
		for(var i=0,ri=ResIcons,l=ri.length;i<l;i++){
			var cur=ri[i];
			this.iconMap[cur.Type]=cur.Url;
		}

	};
	
	
	vpGantt.dependencyStorea = new Ext.data.JsonStore({
		idProperty: 'Id',
		proxy: {
			type: 'memory',
			reader: {
				type: 'json'
			}
		},
		fields: [{
			name: 'From'
		},
		{
			name: 'To'
		},
		{
			name: 'Type'
		}]
	});
	vpGantt.dependencyStore = Ext.create("Gnt.data.DependencyStore", {
		idProperty: 'Id',
		model: 'Gnt.model.Dependency',
		proxy: {
			type: 'memory',
			reader: {
				type: 'json'
			}
		}
	});
	vpGantt.parseDate = function(str) {
		var year = str.substring(0, 4),
		month = str.substring(5, 7),
		day = str.substring(8, 10);
		return new Date(year, (parseInt(month, 10) - 1), day);
	};

	vpGantt.setProgressList = function() {
		this.progressList = arguments[0];
	};
	
	vpGantt.initUECs=function(res){
		this.uecmap={};
		var a=res.uneditcols;
		if(a){
			for(var i=0,len=a.length;i<len;i++){
				this.uecmap[a[i]]=true;
				var cols=vpGantt.columns;
				for(var j=0;j<cols.length;j++){
					var cur=cols[j];
					if(cur&&cur.dataIndex==a[i]){
						cur.tdCls='un-edit-col';
					}
				}
			}
		}
	};
	vpGantt.initHiddenBts=function(res){
		this.hiddenBtMap={};
		var a=res.hiddenBts;
		/*var a=[
		   	"gantt-save-bt",		//保存按钮
			"gantt-genplan-bt",		//生成计划时间按钮
			"gantt-new-bt",			//新建按钮
			"gantt-newsome-bt",		//新建按钮
			"gantt-importpj-bt",	//Project导入按钮
			"gantt-importtp-bt",		//模板导入按钮
			"gantt-mgvirres-bt",		//虚拟资源管理按钮
			"gantt-replaceres-bt",		//资源替换按钮
			"gantt-pjcal-bt",		//项目日历按钮
			"gantt-zoom-bt",		//放大按钮
			"gantt-shrink-bt"		//缩小按钮
		];*/
		if(a){
			for(var i=0,len=a.length;i<len;i++){
				this.hiddenBtMap[a[i]]=true;
			}
		}

	};
	


	
	vpGantt.initDateScope=function(){

		if (!vpGantt.startDate || !vpGantt.endDate || (vpGantt.endDate.getTime() < vpGantt.startDate.getTime())) {
			alert('开始日期或完成日期存在错误，请检查基本信息！');
			vpGantt.gridMask.hide();
		}

	}
	vpGantt.buildGrid = function() {
		vpGantt.initDateScope();
		vpGantt.gantt = Ext.create('Gnt.panel.Gantt', {
			height: Gantt.height,
			width: Gantt.width,
			renderTo: Ext.get(vpGantt.ganttdiv),
			region          : 'center',
			multiSelect: false,
			leftLabelField: {
				dataIndex: 'Name',
				editor: {
					xtype: 'textfield'
				}
			},
			eventRenderer: function(task) {
				if (vpGantt.assignmentStore.findExact('TaskId', task.data.Id) >= 0) {
					return {
						ctcls: 'resources-assigned'
					};
				}
			},
			resizeHandles: "none",
			highlightWeekends: true,
			showTodayLine: true,
			loadMask: true,
			enableDependencyDragDrop: false,
			enableTaskDragDrop: false,
			enableDragCreation:false,
			snapToIncrement: true,
			plugins : [
		                { ptype : 'bufferedrenderer' }
		            ],
			startDate: vpGantt.startDate,
			endDate: vpGantt.endDate,
			viewPreset: 'weekAndDayLetter',
			columns: vpGantt.columns,
			//tbar: vpGantt.buttons,
			dependencyStore: vpGantt.dependencyStore,
			resourceStore: vpGantt.resourceStore,
			assignmentStore: vpGantt.assignmentStore,
			taskStore: vpGantt.taskStore,
			stripeRows: true,
			enableBaseline: vpGantt.showCompareGantt,
	        baselineVisible: vpGantt.showCompareGantt,
		    lockedViewConfig  : {
                getRowClass : function(rec) { return rec.isRoot() ? 'root-row' : ''; }
			//,

                // Enable node reordering in the locked grid
               /* plugins : vpGantt.enDrag?{
                    ptype           : 'treeviewdragdrop',
                    containerScroll : true
                }:[]*/
            },
			lockedGridConfig : {
                width       : vpGantt.taskPartWidth,
                title       : vpGantt.taskPartTitle,
                collapsible : true,
                forceFit : false
            },
            schedulerConfig : {
                collapsible : true,
                title : vpGantt.ganttPartTitle
            },
			  viewConfig:{
				  	//forceFit:false,
					getRowClass : function(record,rowIndex,rowParams,store){ 
	                    if(record.data.KeyTask){
	                        return 'key-path-cls';
	                    }                        
	                }                       
			}
		});
		//alert(vpGantt.gantt.getSchedulingView().highlightCriticalPaths(true));
		vpGantt.bindResize();
		if(vpGantt.buildedListen){
			vpGantt.buildedListen(vpGantt);
		}
		
	};
	vpGantt.getGanttView=function(){
		return this.gantt.lockedGrid.getView();
	};
	vpGantt.getNormalView=function(){
		return this.gantt.normalGrid.getView();
	};
	vpGantt.toggleKeyPath=function(fromRowClick){ 
		this.keyPathShow=(!!!this.keyPathShow);
		var css=document.getElementById("grid-select-css"),show=this.keyPathShow, rootNode = this.getRootNode(),view=this.getGanttView(),nView=this.getNormalView();
		if(show){
			css.setAttribute("href","/project/css/gantt-key-path-selected.css");
		}else{
			css.setAttribute("href","/project/css/gantt-key-path-normal.css");
		}
		
		
	};
	/*vpGantt.toggleKeyPath=function(fromRowClick){
		this.isEditingKeyPath=true;
		this.keyPathShow=(!!!this.keyPathShow);
		var css=document.getElementById("grid-select-css"),show=this.keyPathShow, rootNode = this.getRootNode(),view=this.getGanttView(),nView=this.getNormalView();
		if(show){
			css.setAttribute("href","/project/css/gantt-key-path-selected.css");
		}else{
			css.setAttribute("href","/project/css/gantt-key-path-normal.css");
		}
		
		vpGantt.accessAllNodes(rootNode, {
			show: show,
			func: function(snode) {
				if (snode.isRoot()) return;
				nView.deselect(snode,true,false);
				if (snode.get("KeyTask")) {
					if(show){
						nView.addRowCls(snode,'key-path-cls');
						view.addRowCls(snode,'key-path-cls');
						//nView.select(snode,true,false);
						
					}else{
						nView.removeRowCls(snode,'key-path-cls');
						view.removeRowCls(snode,'key-path-cls');
						//nView.deselect(snode,true,false);
						
					}
					
				}
			}
		});
		this.isEditingKeyPath=false;
	};*/
	vpGantt.removeDupRes=function(ress){
		var result=[],addMap={};
		for(var i=0;i<ress.length;i++){
			if(addMap[ress[i]['Id']]){
				;
			}else{
				addMap[ress[i]['Id']]=true;
				result.push(ress[i]);
			}
			
		}
		return result;
	};
	vpGantt.reload = function(data) {
		//data=eval('({"tasks":[{"KeyTask":true,"IndicateLight":"{0}{2}{0}{0}","Id":"7","leaf":true,"Name":"newTask_1","PercentDone":"0.0","StartDate":"2011-10-25 00:00:00","EndDate":"2011-10-29 00:00:00","Duration":"4.0","DurationUnit":"d","WorkLoad":"0.0","BaselineStartDate":"2011-10-31 00:00:00","BaselineEndDate":"2011-10-31 23:59:59","BaselineDuration":"1.0","BaselineWorkLoad":"0.0","DependencyTask":"","ResIds":""},{"IndicateLight":"{0}{2}{0}{0}","Id":"8","leaf":true,"Name":"newTask_2","PercentDone":"0.0","StartDate":"2011-10-31 00:00:00","EndDate":"2011-11-04 00:00:00","Duration":"4.0","DurationUnit":"d","WorkLoad":"0.0","BaselineStartDate":"2011-10-31 00:00:00","BaselineEndDate":"2011-10-31 23:59:59","BaselineDuration":"1.0","BaselineWorkLoad":"0.0","DependencyTask":"7","ResIds":""},{"IndicateLight":"{0}{2}{0}{0}","Id":"9","leaf":true,"Name":"newTask_3","PercentDone":"0.0","StartDate":"2011-11-04 00:00:00","EndDate":"2011-11-10 00:00:00","Duration":"4.0","DurationUnit":"d","WorkLoad":"0.0","BaselineStartDate":"2011-10-31 00:00:00","BaselineEndDate":"2011-10-31 0:0:0","BaselineDuration":"1.0","BaselineWorkLoad":"0.0","DependencyTask":"8","ResIds":""},{"KeyTask":true,"IndicateLight":"{0}{2}{0}{0}","Id":"10","leaf":true,"Name":"newTask_1","PercentDone":"0.0","StartDate":"2011-11-10 00:00:00","EndDate":"2011-11-10 00:00:00","Duration":"0.0","DurationUnit":"d","WorkLoad":"0.0","BaselineStartDate":"2011-10-17 00:00:00","BaselineEndDate":"2011-10-20 23:59:59","BaselineDuration":"4.0","BaselineWorkLoad":"0.0","DependencyTask":"9","ResIds":""}],"assignments":[],"resources":[{"Id":"1","Name":"administrator","Units":"100"},{"Id":"1","Name":"administrator","Units":"110"},{"Id":"1","Name":"administrator","Units":"100"},{"Id":"518","Name":"h","Units":"100"},{"Id":"519","Name":"hh","Units":"100"},{"Id":"519","Name":"hh","Units":"100"},{"Id":"519","Name":"hh","Units":"100"},{"Id":"519","Name":"hh","Units":"22"},{"Id":"519","Name":"hh","Units":"100"},{"Id":"519","Name":"hh","Units":"100"},{"Id":"519","Name":"hh","Units":"100"},{"Id":"519","Name":"hh","Units":"80"},{"Id":"2","Name":"user","Units":"100"},{"Id":"516","Name":"user1","Units":"100"},{"Id":"515","Name":"wangxf","Units":"100"},{"Id":"520","Name":"管理员","Units":"100"},{"Id":"517","Name":"管理员","Units":"100"},{"Id":"517","Name":"管理员","Units":"100"}],"dependencies":[{"From":"7","To":"8","Type":"2","Key":true},{"From":"8","To":"9","Type":"2","Key":true},{"From":"9","To":"10","Type":"2","Key":true}]})');
		//debugger;
		try{
			this.taskStore.proxy.data = data.tasks;		
			this.taskStore.load();
			this.dependencyStore.proxy.data = data.dependencies||[];
			this.dependencyStore.load();
		}catch(e){
			;
		}
		this.gridMask.hide();
	};
	vpGantt.loadData = function() {
		try {
			var data = vpGantt.getData();
			vpGantt.reload(data);
	    	vpGantt.scrollToDate(new Date());
	    	//vpGantt.genResCls(data);
	    	setTimeout(function(){
	    		resizeColumnHeader(vpGantt.showCompareGantt);
	    		if(vpGantt.showCompareGantt){
	    			$("#tool-1036").click(function() {	
		    			resizeColumnHeader(vpGantt.showCompareGantt);
		    			$("#tool-1044").unbind("click");
		    			$("#tool-1044").click(function() {	
		    				resizeColumnHeader(vpGantt.showCompareGantt);
			    		});
		    		});
	    			$("#tool-1037").click(function() {	
		    			resizeColumnHeader(vpGantt.showCompareGantt);
		    			$("#tool-1045").unbind("click");
		    			$("#tool-1045").click(function() {	
		    				resizeColumnHeader(vpGantt.showCompareGantt);
			    		});
		    		});
	    		} else {
	    			$("#tool-1042").click(function() {	
		    			resizeColumnHeader();
		    			$("#tool-1050").unbind("click");
		    			$("#tool-1050").click(function() {	
		    				resizeColumnHeader(vpGantt.showCompareGantt);
			    		});
		    		});
		    		$("#tool-1043").click(function() {	
		    			resizeColumnHeader(vpGantt.showCompareGantt);
		    			$("#tool-1051").unbind("click");
		    			$("#tool-1051").click(function() {	
		    				resizeColumnHeader(vpGantt.showCompareGantt);
			    		});
		    		});
	    		}
	    		
	    		$("#ganttpanel-1014-locked-splitter-collapseEl").click(function() {	
	    			resizeColumnHeader(vpGantt.showCompareGantt);
	    		});
	    	}, 500);
		} catch(e) {
			alert(e.message);
			vpGantt.gridMask.hide();
		}
	};
	function resizeColumnHeader(isCompare){
		if(isCompare){
			$("#timeaxiscolumn-1030-titleEl").find(".sch-header-row-middle ").find(".sch-column-header").each(function(i,item){
				//alert($(item).width());
				$(item).attr('style','position : static; text-align: center; width: 139px;');
			});
			$("#timeaxiscolumn-1030-titleEl").find(".sch-header-row-bottom ").find(".sch-column-header").each(function(i,item){
				//alert($(item).width());
				$(item).attr('style','position : static; text-align: center; width: 19px;');
			});
		} else {
			$("#timeaxiscolumn-1036-titleEl").find(".sch-header-row-middle ").find(".sch-column-header").each(function(i,item){
				//alert($(item).width());
				$(item).attr('style','position : static; text-align: center; width: 139px;');
			});
			$("#timeaxiscolumn-1036-titleEl").find(".sch-header-row-bottom ").find(".sch-column-header").each(function(i,item){
				//alert($(item).width());
				$(item).attr('style','position : static; text-align: center; width: 19px;');
			});
		}
	}
	vpGantt.refreshData = function(taskId, pos, idIsReal) {
		vpGantt.modalWinClose();
		vpGantt.gridMask = new Ext.LoadMask(this.ganttEl, {
			msg: "正在加载数据..."
		});
		vpGantt.gridMask.show();
		try {
			vpGantt.loadData();

		} catch(e) {
			alert(e.message);
			vpGantt.gridMask.hide();
		}
		vpGantt.gridMask.hide();
		vpGantt.modalWinClose();
	};
	vpGantt.inject2Node = function(node, data, pres) {
		this.dependencyStore.loadData(pres.dependencies, true);
		node.removeAll();
		node.appendChild(this.getNodesList(this.gantt.getTaskStore(), data));
	};
	
	
	vpGantt.isArray=function(o){
		return Object.prototype.toString.apply(o)=='[object Array]';
	}
	vpGantt.parseMenu=function(){
		var rowMenu=vpGantt.gCfg.rowMenu;
		if(!(rowMenu&&rowMenu.length>0)){
			return {};
		}
		var ret={id:'rowMenu'};
		ret.items=vpGantt.parseMenuByGroup(rowMenu);
		return ret;
	};
	vpGantt.parseSingleItem=function(o){
		o.iconCls='arrow2r';
		if(o.handler){
			var func=o.handler;
			o.handler=function(){
				var taskId=cur = vpGantt.gantt.getSelectionModel().selected.first().get("Id");
				func(taskId);
			};
		}
		if(o.children&&o.children.length>0){
			o.menu={items:vpGantt.parseMenuByGroup(o.children)};
		}
		return o;
	};
	vpGantt.parseMenuByGroup=function(cfg){
		var items=[];
		for(var i=0,l1=cfg.length;i<l1;i++){
			var g=cfg[i];
			if((i!=0&&vpGantt.isArray(g))||(i>0&&vpGantt.isArray(cfg[i-1]))){
				items.push('-');
			}

			if(vpGantt.isArray(g)){
				for(var j=0,l2=g.length;j<l2;j++){
					var item=g[j];
					items.push(vpGantt.parseSingleItem(item));
				}
			}else{
				items.push(vpGantt.parseSingleItem(g));
				
			}	
		}
		return items;
		
	};
	vpGantt.createRowMenu = function() {
		var rect=vpGantt.parseMenu();
		vpGantt.rowMenu = Ext.create('Ext.menu.Menu',rect);
		return;

	};
	
	vpGantt.getRootNode=function(){
		if(!this.rootNode){
			this.rootNode=this.gantt.getTaskStore().getRootNode();
		}
		return this.rootNode;
	}
	vpGantt.rootIsEmpty=function(){
		var rootNode = this.getRootNode();
		return rootNode.childNodes.length<1;
	};
	vpGantt.closeTPPreviewWin=function(){
		this.closePreviewWin();
		
		
	};
	vpGantt.closePreviewWin=function(){
		if(this.TPPreviewWin)
			this.TPPreviewWin.close();
	}
	

	
	vpGantt.closeImportTpWin=function(){
		if(this.importTpWin)
		this.importTpWin.close();
	};
	vpGantt.showImportTpWin=function(){
			var width = 600,
			height = 300,
			x = (document.body.clientWidth - width) / 2,
			y = (document.body.clientHeight - height) / 2,
			src='/project/wbs/tasktemplate/templateSelect.jsp?importOpr=1&projectid='+vpGantt.getProjectId();
			this.importTpWin = Ext.create('Ext.Window', {
				width: width,
				height: height,
				title: '选择导入模板',
				modal: true,
				x: x,
				y: 30,
				headerPosition: 'top',
				layout: 'fit',
				items: {
					border: 0,
					html: '<iframe src="' + src + '" style="text-align:center;width:100%;height:100%;" name="bottom" scrolling="NO" frameborder="0" noresize></iframe>'
				},
				closeAction: 'destroy',
				closable: true,
				bodyBorder: false,
				draggable:false
			});
		this.importTpWin.show();
	
		
	};
	
	vpGantt.insertNodes=function(parent,nodes,mark){
		if(mark){
			for(var i=0;i<nodes.length;i++){
				var curTask=nodes[i];
				parent.insertBefore(curTask, mark);
				curTask.commit();
			}
		}else{
			parent.set("leaf", false);
			for(var i=0;i<nodes.length;i++){
				var curTask=nodes[i];
				curTask.commit();
				parent.appendChild(curTask);
			}
			parent.expand();
		}
	};
	vpGantt.accessAllJsonNodes = function(node, callObj) {
		callObj.func(node);
		if (node.children&&node.children.length>0) 
			for(var i = 0; i < node.children.length; i++){
			this.accessAllJsonNodes(node.children[i], callObj);
		}
	};
	
	vpGantt.disableRowMenuItem = function(index) {
		var item=vpGantt.rowMenu.items.getAt(index);
		if(item){
			item.disable();
		}
		
	};
	vpGantt.enableRowMenuItem = function(index) {
		var item=vpGantt.rowMenu.items.getAt(index);
		if(item){
			item.enable();
		}
	};

	vpGantt.modalWinClose = function() {
		if (vpGantt.modalWin) vpGantt.modalWin.close();
	};
	vpGantt.hoursPerDay = 8;
	vpGantt.setHoursPerDay=function(num){
		vpGantt.hoursPerDay=num;
	};
	vpGantt.calcuWorkLoad = function(record) {
	};
	this.editingWorkLoad = false;
	vpGantt.isEditingWorkLoad = function() {
		return this.editingWorkLoad;
	};
	vpGantt.setEditingWorkLoad = function(bl) {
		this.editingWorkLoad = bl;
	};
	vpGantt.bindResize = function() {
		if (window.addEventListener) {
			window.addEventListener('resize',
			function() {

				vpGantt.gantt.setWidth(document.body.clientWidth);
				vpGantt.gantt.setHeight(document.body.clientHeight);

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
	vpGantt.newResId=100;
	
	vpGantt.addResource=function(id,name,type){

	}
	
	vpGantt.buildGantt = function() {
		vpGantt.buildGrid();
		setTimeout("vpGantt.loadData()", 1);
	};
	
	
	Ext.Error.raise = function(err) {
		err = err || {};
		if (Ext.isString(err)) {
			err = {
				msg: err
			};
		}
		var method = this.raise.caller;
		if (method) {
			if (method.$name) {
				err.sourceMethod = method.$name;
			}
			if (method.$owner) {
				err.sourceClass = method.$owner.$className;
			}
		}
		if (Ext.Error.handle(err) !== true) {
			var msg = Ext.Error.prototype.toString.call(err);
			Ext.log({
				msg: msg,
				level: 'error',
				dump: err,
				stack: true
			});
		}
	};
	vpGantt.virtualResMg=function(){

		  
	};

	vpGantt.reSortRes=function(){
		
	};
	vpGantt.addVirtualRes=function(){

	};
	
	vpGantt.getResGridBts=function(){
		
		return [];
	};
	
	vpGantt.withChrome=function(){
		return (navigator.userAgent.toLowerCase().indexOf('chrome')>-1);
	};

	
	vpGantt.getUECMap=function(){
		return this.uecmap||{};
	};
	
	vpGantt.initPhaseGnt = function () {
		Ext.define('Ext.grid.plugin.BufferedRendererTableView', {
		    override: 'Ext.view.Table',
		    onAdd: function(store, records, index) {
		        var bufferedRenderer = this.bufferedRenderer,
		            rows = this.all;
		        if(bufferedRenderer && ((rows.getCount() + records.length) > bufferedRenderer.viewSize||true)) {
		        	try{
		        		if (index < rows.startIndex + bufferedRenderer.viewSize && (index + records.length) > rows.startIndex) {
			                this.onDataRefresh();
			                this.refresh();
			            }else {
			                bufferedRenderer.stretchView(this, bufferedRenderer.getScrollHeight());
			            }
		        	}catch(e){;}
		            
		        }
		        
		        
		        
		        else {
		            this.callParent([store, records, index]);
		        }
		    },

		    
		    onRemove: function(store, records, indices) {

		        
		        if (this.bufferedRenderer) {
		            this.onDataRefresh();
		        }
		        
		        
		        
		        else {
		            this.callParent([store, records, indices]);
		        }
		    }
		});
		
		Ext.define('Ext.grid.plugin.BufferedRendererTreeView', {
		    override: 'Ext.tree.View',

		    onRemove: function(store, records, indices) { 
		    	
		        if (this.bufferedRenderer) {
		            this.onDataRefresh();
		            try{
		            	vpGantt.gantt.getSchedulingView().refreshKeepingScroll();
		            }catch(e){;}
		            
		        }else {
		            this.callParent([store, records, indices]);
		        }
		    }    
		});
		vpGantt.buildGantt();
		vpGantt.createRowMenu();
	};
	vpGantt.initPhaseGnt();
} catch(e) {
	alert(e.message);
	vpGantt.gridMask.hide();
}