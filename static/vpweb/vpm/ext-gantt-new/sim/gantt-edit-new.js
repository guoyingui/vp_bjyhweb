//try {
	
//	Ext.require(['Gnt.panel.Gantt', 'Sch.plugin.TreeCellEditing', 'Gnt.column.PercentDone', 'Gnt.column.StartDate', 'Gnt.column.EndDate', 'Gnt.column.Duration', 'Gnt.widget.AssignmentCellEditor', 'Gnt.column.ResourceAssignment', 'Gnt.model.Assignment']);
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
			Option2:0,
			children: []
		});
		newM.childNodes = [];
		return newM;
	}
	vpGantt.getNodesList = function(store, ja) {
		var a = [];
		for (var i = 0; i < ja.length; i++) {
			a.push(vpGantt.getSingleElement(store, ja[i]));
		}
		return a;
	};
	vpGantt.getSingleElement = function(store, json) {
		var curHas = (json.children && json.children.length > 0);
		var curMd = new store.model({
			WorkLoad: json.WorkLoad,
			DependencyTask: json.DependencyTask,
			ResIds: json.ResIds,
			IndicateLight: json.IndicateLight,
			Id: json.Id,
			PercentDone: json.PercentDone,
			Name: json.Name,
			StartDate: json.StartDate,
			EndDate: json.EndDate,
			Duration: json.Duration,
			Priority: json.Priority,
			DurationUnit: 'd',
			Responsible: json.Responsible,
			BaselineStartDate: json.BaselineStartDate,
			BaselineEndDate: json.BaselineEndDate,
			BaselineWorkLoad: json.BaselineWorkLoad,
			expanded: json.expanded,
			leaf: !curHas,
			Option2:json.Option2
		});
		curMd.childNodes = [];
		if (curHas) {
			var cs = [];
			for (var i = 0; i < json.children.length; i++) cs.push(vpGantt.getSingleElement(store, json.children[i]));
			curMd.appendChild(cs);
		}
		return curMd;
	};
	
	
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
			Option2:0,
			DurationUnit: (c && c.get("DurationUnit")) || "d",
			leaf: true
		});
		return a;
	};
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
	/*vpGantt.assignmentStore = Ext.create("Gnt.data.AssignmentStore", {
		model: 'Assignment',
		resourceStore: vpGantt.resourceStore,
		proxy: {
			type: 'memory',
			reader: {
				type: 'json'
			}
		},
		 root : 'assignments'
	});*/
	vpGantt.doRollUp = false;
	vpGantt.isDoRollUp = function() {
		return this.doRollUp;
	};
	vpGantt.setDoRollUp = function() {
		this.doRollUp = arguments[0];
	};
	vpGantt.getCalendar = function() {
		var data,result=[];
		jQuery.ajax({
			url: '/project/system/workCalendarAction.do',
			data: {
				themethod: 'getCalItemsByPID',
				projectID:vpGantt.getProjectId()
			},
			type: 'post',
			async: false,
			success: function(res) {
				data = res;
			},
			dataType: 'json'
		});
		if(data.length>0){
			var workday=false,cur;
			for(var i=0;i<data.length;i++){
				cur=data[i];
				workday=cur.isWorkday;
				result.push({Date:new Date(cur.dateL),IsWorkingDay:workday,Availability:workday?"00:00-24:00":null});
			}
		}
		return new Gnt.data.Calendar({
			data: result
		});
	};
	vpGantt.taskStore = Ext.create("Gnt.data.TaskStore", {
		recalculateParents: vpGantt.isDoRollUp(),
		calendar: vpGantt.getCalendar(),
		buffered: true,
		model: 'Task',
		proxy: {
			type: 'memory',
			reader: {
				type: 'json'
			}
		}
	});
	/*vpGantt.getDataUrl = function(projectId, taskId) {
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
	};*/
	/*vpGantt.assignmentEditor = Ext.create('Gnt.widget.AssignmentCellEditor', {
		assignmentStore: vpGantt.assignmentStore,
		resourceStore: vpGantt.resourceStore
	});*/
	vpGantt.rendeIndicater = function(v,m,r,ri) {
		if(vpGantt.getTaskId()=='null'&&arguments[3]==0){
			return '';
		}
		var lightsStr = '',
		t1 = v.charAt(1),
		t2,
		t3,
		t4 = v.charAt(10),
		l1 = v.charAt(1),
		l2 = v.charAt(4),
		l3 = v.charAt(7),
		l4 = v.charAt(10);
		//l5 = v.charAt(13);
		if (l1 == '0') {
			l1 = 'icon_wks.gif';
		} else if (l1 == '1') {
			l1 = 'icon_jxz.gif';
		} else {
			l1 = 'icon_ywc.gif';
		}
		for (var i = 0; i < vpGantt.stateList.length; i++) {
			if (vpGantt.stateList[i].id == t1) {
				t1 = vpGantt.stateList[i].value;
				break;
			}
		}
		var flags='<div style="border:0px solid #000;position:relative;width:16px;text-align:center;left:-8px;"><img  src="/project/images/wbstask/' + l1 + '" title="' + t1 + '" />';
		if(parseInt(r.get('Option2'))==0){
			flags+='<img  src="/project/images/wbstask/icon_cjyes.gif" title="可裁剪" />'
		}else{
			flags+='<img  src="/project/images/wbstask/icon_cjno.gif" title="不可裁剪" />'
		}
		flags+='</div>';
		return flags;
	};
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


/*	vpGantt.colSlider = new Ext.create("Ext.slider.Single", {
		value: Sch.preset.Manager.getPreset('weekAndDayLetter').timeColumnWidth,
		width: 120,
		minValue: 80,
		maxValue: 240,
		increment: 10
	});*/
	vpGantt.showEditingMask = function() {
		vpGantt.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
			msg: "正在编辑数据..."
		});
		vpGantt.gridMask.show();
	};
	vpGantt.hideEditingMask = function() {
		vpGantt.gridMask.hide();
	};
	vpGantt.getRootNode=function(){
		if(!this.rootNode){
			this.rootNode=this.gantt.getTaskStore().getRootNode().childNodes[0];
		}
		return this.rootNode;
	}
	vpGantt.rootIsEmpty=function(){
		var rootNode = this.getRootNode();
		return rootNode.childNodes.length<1;
	}
	vpGantt.getAllTasksStr = function() {
		var rootNode = this.getRootNode(),tasks = ['{"tasks":['];
		//if(vpGantt.getTaskId() != 'null'){
		//	rootNode=rootNode.childNodes.length>0?rootNode.childNodes[0]:rootNode;
		//}
		for (var i = 0,l=rootNode.childNodes.length; i <l ; i++) {
			if (i < 1){
				tasks.push( this.getSingleNodeStr(rootNode.childNodes[i]));
			}else{
				tasks.push( ',' + this.getSingleNodeStr(rootNode.childNodes[i]));
			}
		}
		tasks.push( ']}');
		tasks = encodeURIComponent(tasks.join(''));
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
		var curStr = ['{']; 
		var subFs=vpGantt.submitFileds;
		for(var w=0,l1=subFs.length;w<l1;w++){
			var cf=subFs[w];
			if(w==0){
				curStr.push( '"'+cf.name+'":"' +cf.getVal(snode));
			}else{
				curStr.push( '","'+cf.name+'":"' +cf.getVal(snode));
			}
		}
		curStr.push('","children":[');
		for (var i = 0,l2=snode.childNodes.length; i <l2; i++) {
			if (i < 1) curStr.push( this.getSingleNodeStr(snode.childNodes[i]));
			else curStr.push(',' + this.getSingleNodeStr(snode.childNodes[i]));
		}
		curStr.push(']}');
		return curStr.join('');
	};
	vpGantt.addSomeBrotherU = function(thecount) {
		var curcount = thecount,
		cur = vpGantt.getSelSingleTask(),
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
				leaf: true,
				Option2:0
			});
			parentNode.insertBefore(newTask, cur);
			newTask.commit();
		}
		vpGantt.changeComponent.insertRecords(false, true, thecount);
		vpGantt.gridMask.hide();
	};
	vpGantt.addSomeBrotherD = function(thecount) {
		var curcount = thecount,
		cur = vpGantt.getSelSingleTask(),
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
				leaf: true,
				Option2:0
			});
			parentNode.insertBefore(newTask, cur.nextSibling);
			newTask.commit();
		}
		vpGantt.changeComponent.insertRecords(false, true, thecount);
		vpGantt.gridMask.hide();
	};
	vpGantt.getNewStartDate = function(parentNode) {
		var today = new Date();
		if (parentNode && ((vpGantt.getTaskId()=='null'&&!parentNode.parentNode.isRoot())||(vpGantt.getTaskId()!='null'&&!parentNode.isRoot()))) {
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
		root = this.getRootNode(),
		curEndDate = new Date(curdate.getTime() + (3600 * 1000 * 24));
		root.set("leaf", false);
		while (curcount--) {
			var newTask = new Gnt.model.Task({
				IndicateLight: '{0}{0}{0}{0}',
				Id: 'T_' + vpGantt.newId,
				BaselineWorkLoad: 0,
				PercentDone: 0,
				Name: 'newTask_' + vpGantt.newId++,
				StartDate: curdate,
				EndDate: curEndDate,
				BaselineStartDate: '',
				BaselineEndDate: '',
				WorkLoad: 0,
				Duration: 1,
				DurationUnit: "d",
				leaf: true,
				Option2:0
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
		cur = vpGantt.getSelSingleTask();
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
		var cur = vpGantt.getSelSingleTask();
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
		var cur = vpGantt.getSelSingleTask();
		if (cur.parentNode.childNodes.length == 1) {
			cur.parentNode.set("leaf", true)
		}
		cur.remove();
		vpGantt.changeComponent.setOtherChanged(true);
		vpGantt.gridMask.hide();
	};
	vpGantt.upGrade = function() {
		var cur = vpGantt.getSelSingleTask(),
		hasfellow = cur.nextSibling;
		var curParent = cur.parentNode;
		if (curParent.isRoot()||(curParent.parentNode&&curParent.parentNode.isRoot())) {
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
		var cur = vpGantt.getSelSingleTask();
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
			var curTaskId = (toolbar ? vpGantt.getTaskId() : vpGantt.getSelSingleTask().get("Id"));
			vpGantt.showModalWin('/project/wbs/task/import4ProjectTask.jsp?isTemplate=0&projectID=' + projectId + '&taskid=' + curTaskId + '&pos=' + pos + '&idIsReal=' + toolbar, title, height, width);
		} else vpGantt.showModalWin('/project/wbs/task/import4Project.jsp?isTemplate=0&projectID=' + projectId + '&pos=' + pos + '&idIsReal=' + toolbar, title, height, width);
	};
	


/*	vpGantt.ganttzoom = {
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
	};*/
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
	vpGantt.getRootData=function(){
		
		var root=vpGantt.getRootNode() ,curStr=["{"];
		var subFs=vpGantt.submitFileds;
		for(var w=0;w<subFs.length;w++){
			var cf=subFs[w];
			if(w==0){
				curStr.push('"'+cf.name+'":"' +cf.getVal(root));
			}else{
				curStr.push('","'+cf.name+'":"' +cf.getVal(root));
			}
		}
		curStr.push('"}');
		curStr = encodeURIComponent(curStr.join(''));
		return curStr;
	};
	vpGantt.saveAllData = function(quit) {
		if(vpGantt.getTaskId() == 'null'){
			vpGantt.saveDataWithoutRoot(quit);
		}else{
			jQuery.ajax({
				url: '/project/wbs/ganttLoadAction.do',
				data: {
					projectId: vpGantt.getProjectId(),
					taskId:vpGantt.getTaskId(),
					codetype: 'utf8',
					themethod: 'saveRootTasks',
					tasks:vpGantt.getRootData()
				},
				type: 'post',
				async: false,
				success: function(res) {
					if(res.success){
						vpGantt.saveDataWithoutRoot(quit);
					}
				},
				dataType: 'json'
			});
		}
		
	};
	vpGantt.saveDataWithoutRoot=function(quit){
		jQuery.ajax({
			url: '/project/wbs/ganttLoadAction.do',
			data: {
				projectId: vpGantt.getProjectId(),
				taskId: vpGantt.getTaskId() == 'null' ? 0 : vpGantt.getTaskId(),
				codetype: 'utf8',
				themethod: 'saveTasks',
				tasks: vpGantt.getAllTasksStr()
			},
			type: 'post',
			async: false,
			success: function(res) {
				if (res.success) {
					vpGantt.changeComponent.clear();
					//window.location.reload();
					if(quit){
						top.window.close();
					}
					vpGantt.reloadProject();
					return;
					vpGantt.reload(res.data);
					vpGantt.changeComponent.clear();
					vpGantt.disableBt('gantt-save-bt');
					vpGantt.disableBt('gantt-saveAndClose-bt');
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
	/*vpGantt.colSlider = new Ext.create("Ext.slider.Single", {
		value: Sch.preset.Manager.getPreset('weekAndDayLetter').timeColumnWidth,
		width: 120,
		minValue: 20,
		maxValue: 240,
		increment: 10
	});*/
	/*vpGantt.colSlider.on({
		change: function(slider, value) {
			vpGantt.gantt.setTimeColumnWidth(value, true);
		},
		changecomplete: function(slider, value) {
			vpGantt.gantt.setTimeColumnWidth(value);
		}
	});*/
	/*vpGantt.dateUnitChange = {
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
	};*/
	vpGantt.reloadProject=function(){
		//window.location.reload();
		//location.href=location.href;
		
		var url=location.href;
		url=url.replace('#','');
		url+='&ctime='+(new Date().getTime());
		location.href = url;
	};
	/*vpGantt.scrollToDate=function(date){
		try{
			vpGantt.gantt.scrollToDate(date);
		}catch(e){
			;
		}
		
	};*/
	vpGantt.calendarWin=null;
	vpGantt.CalendarTitle= '项目日历';
	vpGantt.showCalendar=function(e){
		var pjID=this.getProjectId();
		var width = (width || 310),
		height = (height || 335),
		//x = (document.body.clientWidth - width) / 2,
		//y = (document.body.clientHeight - height) / 2,
		src='/project/wbs/task/pjCalendar.jsp?projectID='+vpGantt.getProjectId()+'&editable='+(this.changeComponent.isChanged()?0:1);
		vpGantt.calendarWin = Ext.create('Ext.Window', {
			width: width,
			height: height,
			title:vpGantt.CalendarTitle,
			modal: true,
			x: e.getX()+100,
			y: e.getY()+20,
			headerPosition: 'top',
			layout: 'fit',
			items: {
				border: 0,
				html: ' <iframe src="' + src + '" style="text-align:center;width:100%;height:100%;" name="bottom" scrolling="NO" frameborder="0" noresize>'
			},
			closeAction: 'destroy',
			closable: true,
			bodyBorder: false
		});
		vpGantt.calendarWin.show();
	};
	vpGantt.closeCalendar=function(){
		vpGantt.calendarWin.close();
	};
	vpGantt.showAddResWin=function(){
		window.afterselectUsers=function(){
			var data=window.request.resData;
			if(data.userID&&data.userID!=''){
				var ids=(data.userID.split(',')),names=(data.userName.split(',')),sdates=[],edates=[],assigments=[];
				for(var i=0;i<ids.length;i++){
					sdates.push(vpGantt.startDate.getYMD());
					edates.push(vpGantt.endDate.getYMD());
					assigments.push(100);
				}
			jQuery.ajax({
					url: '/project/wbs/addAppointedResourceAction.do',
					data: {
						ajax:'true',
						projectID:vpGantt.getProjectId(),
						userID:ids,
						projectPlanstartdate:sdates,
						projectPlanenddate:edates,
						assignmentpercent:assigments,
						remark2:''
					},
					type: 'post',
					async: false,
					success: function(res) {
					
					},
					dataType: 'json'
				});
			
				for(var i=0;i<ids.length;i++){
					vpGantt.addResource(ids[i],names[i],'0');
				}
				vpGantt.resListPiker.loadTaskAssignments();
			}	
			
		};
		
		Search.user({conditionFlag:true,multiple:true});
	}
	
	vpGantt.clickN=0;
	vpGantt.newTaskByNum=function(num){
		var curdate = vpGantt.getNewStartDate(),
		curcount = num/100,
		curEndDate = new Date(curdate.getTime() + (3600 * 1000 * 24));
		//if(vpGantt.clickN==0){
			root = this.getRootNode(),
			
			root.set("leaf", false);
			while (curcount>0) {
				var newTask = new Gnt.model.Task({
					IndicateLight: '{0}{0}{0}{0}',
					Id: 'T_' + vpGantt.newId,
					BaselineWorkLoad: 0,
					PercentDone: 0,
					Name: 'newTask_' + vpGantt.newId++,
					StartDate: curdate,
					EndDate: curEndDate,
					BaselineStartDate: '',
					BaselineEndDate:'',
					RealStartDate:'',
					RealEndDate:'',
					WorkLoad: 0,
					Duration: 1,
					DurationUnit: "d",
					leaf: true,
					Option2:0
				});
				newTask.commit();
				root.appendChild(newTask);
				curcount--;
			}
			root.expand();
		//}
		
		
		
		
			
		var rootNode = this.getRootNode();
		var newMap={};
		vpGantt.accessAllNodes(rootNode, {
			func: function(snode) {
				if (snode.isRoot()||newMap[snode.get('Id')]) 
					return;
				if (snode.get('leaf')) {
					snode.set("leaf", false);
					var sNum=10;
					while (sNum--) {
						var nid='T_' + vpGantt.newId;
						newMap[nid]=true;
						var newTask = new Gnt.model.Task({
							IndicateLight: '{0}{0}{0}{0}',
							Id: nid,
							BaselineWorkLoad: 0,
							PercentDone: 0,
							Name: 'newTask_' + vpGantt.newId++,
							StartDate: curdate,
							EndDate: curEndDate,
							BaselineStartDate: '',
							BaselineEndDate:'',
							RealStartDate:'',
							RealEndDate:'',
							WorkLoad: 0,
							Duration: 1,
							DurationUnit: "d",
							leaf: true,
							Option2:0
						});
						newTask.commit();
						snode.appendChild(newTask);

					}
					snode.commit();
					snode.expand();
				}
			}
		});

		newMap={};
		vpGantt.accessAllNodes(rootNode, {
			func: function(snode) {
				if (snode.isRoot()||newMap[snode.get('Id')]) 
					return;
				if (snode.get('leaf')) {
					snode.set("leaf", false);
					var sNum=10;
					while (sNum--) {
						var nid='T_' + vpGantt.newId;
						newMap[nid]=true;
						var newTask = new Gnt.model.Task({
							IndicateLight: '{0}{0}{0}{0}',
							Id: nid,
							BaselineWorkLoad: 0,
							PercentDone: 0,
							Name: 'newTask_' + vpGantt.newId++,
							StartDate: curdate,
							EndDate: curEndDate,
							BaselineStartDate: '',
							BaselineEndDate:'',
							RealStartDate:'',
							RealEndDate:'',
							WorkLoad: 0,
							Duration: 1,
							DurationUnit: "d",
							leaf: true,
							Option2:0
						});
						newTask.commit();
						snode.appendChild(newTask);

					}
					snode.commit();
					snode.expand();
				}
			}
		});
		vpGantt.gridMask.hide();
		
		
	}
	vpGantt.buttons = (vpGantt.getTaskId() == 'null' ? [
/*		{
			text: '新建x条',
			width: 60,
			iconCls: 'gantt-save-bt',
			id: 'gantt-save-btd',
			handler: function() {
				var tempA=window.prompt('输入新建条数','');
				
				vpGantt.newTaskByNum(tempA);
			}
		},*/
	  {
		text: '保存',
		width: 60,
		iconCls: 'gantt-save-bt',
		disabled: true,
		id: 'gantt-save-bt',
		handler: function() {
			vpGantt.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
				msg: "正在保存数据..."
			});
			vpGantt.gridMask.show();
			setTimeout("vpGantt.saveAllData()", 10);
		}
	},{
		text: '保存并退出',
		width: 90,
		iconCls: 'gantt-saveAndClose-bt',
		disabled: true,
		id: 'gantt-saveAndClose-bt',
		handler: function() {
			vpGantt.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
				msg: "正在保存数据..."
			});
			vpGantt.gridMask.show();
			setTimeout("vpGantt.saveAllData(true)", 10);
		}
	},{
		text: '关闭',
		width: 60,
		iconCls: 'gantt-close-bt',
		disabled: false,
		id: 'gantt-close-bt',
		handler: function() {
			top.window.close();
		}
	},
	{
		text: '新建',
		width: 60,
		iconCls: 'gantt-new-bt',
		id: 'gantt-new-bt',
		handler: function() {
			vpGantt.showEditingMask();
			setTimeout("vpGantt.rootAddChildren(1)", 10);
		}
	},
	{
		text: '批量新建',
		width: 90,
		iconCls: 'gantt-newsome-bt',
		id: 'gantt-newsome-bt',
		menu: [{
			iconCls: 'arrow2r',
			text: '2条任务',
			handler: function() {
				vpGantt.showEditingMask();
				setTimeout("vpGantt.rootAddChildren(2)", 10);
			}
		},
		{
			iconCls: 'arrow2r',
			text: '3条任务',
			handler: function() {
				vpGantt.showEditingMask();
				setTimeout("vpGantt.rootAddChildren(3)", 10);
			}
		},
		{
			iconCls: 'arrow2r',
			text: '5条任务',
			handler: function() {
				vpGantt.showEditingMask();
				setTimeout("vpGantt.rootAddChildren(5)", 10);
			}
		},
		{
			iconCls: 'arrow2r',
			text: '10条任务',
			handler: function() {
				vpGantt.showEditingMask();
				setTimeout("vpGantt.rootAddChildren(10)", 10);
			}
		}]
	},
	{
		text: 'Project导入',
		iconCls: 'gantt-import-bt',
		id: 'gantt-importpj-bt',
		width: 90,
		handler: function() {
			setTimeout("vpGantt.importProject(false,true,0)", 10);
		}
	},
	{
		text: '模板导入',
		iconCls: 'gantt-importtp-bt',
		id: 'gantt-importtp-bt',
		width: 75,
		handler: function() {
			setTimeout("vpGantt.importTemplate(false,true,0)", 10);
		}
	},
	{
		text: '排程',
		width: 60,
		iconCls: 'gantt-schedule-bt',
		id: 'gantt-schedule-bt',
		disabled: true,
		hidden:true,
		id: 'gantt-schedule-bt',
		handler: function() {
			vpGantt.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
				msg: "正在刷新数据..."
			});
			vpGantt.gridMask.show();
			setTimeout("vpGantt.saveAllData()", 10);
		}
	},
	{
		text: '生成计划时间',
		iconCls: 'gantt-genplan-bt',
		id: 'gantt-genplan-bt',
		width: 100,
		handler: vpGantt.showGenPlanWin
	},
	/*{
		text: '添加资源',
		iconCls: 'gantt-addres-bt',
		id: 'gantt-addres-bt',
		disabled: false,
		width: 75,
		handler: function() {
			vpGantt.showAddResWin();
		}
	},*/
	{
		text: '虚拟资源管理',
		iconCls: 'gantt-mgvirres-bt',
		id: 'gantt-mgvirres-bt',
		disabled: false,
		width: 100,
		handler: function() {
			vpGantt.virtualResMg();
		}
	},
	{
		text: '资源替换',
		iconCls: 'gantt-replaceres-bt',
		id: 'gantt-replaceres-bt',
		disabled: false,
		width: 75,
		handler: function() {
			//vpGantt.showAddResWin();
			vpGantt.replaceRes();
		}
	},
	{
		text: '项目日历',
		iconCls: 'gantt-pjcal-bt',
		id: 'gantt-pjcal-bt',
		disabled: false,
		width: 75,
		handler: function(bt,e) {
			vpGantt.showCalendar(bt.getEl());
		}
	},{
		text: '切换视图',
		iconCls: 'gantt-viewchange-bt',
		id: 'gantt-viewchange-bt',
		disabled: false,
		width: 75,
		handler: function() {
			jQuery.ajax({
				url: '/project/wbs/ganttLoadAction.do?themethod=setWorkPlanView&withgantt=1',
				type: 'get',
				async: false,
				success: function(res) {
				}
			});
			window.location.href=window.location.href.replace('/sim/ganttEdit-new.jsp','/ganttEdit-new.jsp');
		}
	},/*,
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
		}
	},
	{
		text: '关键路径',
		iconCls: 'gantt-keyPath-bt',
		id: 'gantt-keyPath-bt',
		width: 75,
		disabled: false,
		handler: function() {
			vpGantt.toggleKeyPath(false);
		}    
	},{
		text:'close',
		id:'gantt-test-bt',
		width: 60,
		disabled: false,
		handler: function() {
			top.open('','_self','');
			top.close();
		}
	},*/
	"->", "<div id=\"_tipsDiv\" style=\"width: 100px;\"></div>"]:[{
		text: '保存',
		width: 60,
		iconCls: 'gantt-save-bt',
		disabled: true,
		id: 'gantt-save-bt',
		handler: function() {
			vpGantt.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
				msg: "正在保存数据..."
			});
			vpGantt.gridMask.show();
			setTimeout("vpGantt.saveAllData()", 10);
		}
	},{
		text: '保存并退出',
		width: 90,
		iconCls: 'gantt-saveAndClose-bt',
		disabled: true,
		id: 'gantt-saveAndClose-bt',
		handler: function() {
			vpGantt.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
				msg: "正在保存数据..."
			});
			vpGantt.gridMask.show();
			setTimeout("vpGantt.saveAllData(true)", 10);
		}
	},{
		text: '关闭',
		width: 60,
		iconCls: 'gantt-close-bt',
		disabled: false,
		id: 'gantt-close-bt',
		handler: function() {
			top.window.close();
		}
	},
	{
		text: '新建',
		width: 60,
		iconCls: 'gantt-new-bt',
		id: 'gantt-new-bt',
		handler: function() {
			vpGantt.showEditingMask();
			setTimeout("vpGantt.rootAddChildren(1)", 10);
		}
	},
	{
		text: '批量新建',
		width: 90,
		iconCls: 'gantt-newsome-bt',
		id: 'gantt-newsome-bt',
		menu: [{
			iconCls: 'arrow2r',
			text: '2条任务',
			handler: function() {
				vpGantt.showEditingMask();
				setTimeout("vpGantt.rootAddChildren(2)", 10);
			}
		},
		{
			iconCls: 'arrow2r',
			text: '3条任务',
			handler: function() {
				vpGantt.showEditingMask();
				setTimeout("vpGantt.rootAddChildren(3)", 10);
			}
		},
		{
			iconCls: 'arrow2r',
			text: '5条任务',
			handler: function() {
				vpGantt.showEditingMask();
				setTimeout("vpGantt.rootAddChildren(5)", 10);
			}
		},
		{
			iconCls: 'arrow2r',
			text: '10条任务',
			handler: function() {
				vpGantt.showEditingMask();
				setTimeout("vpGantt.rootAddChildren(10)", 10);
			}
		}]
	},
	{
		text: 'Project导入',
		iconCls: 'gantt-import-bt',
		id: 'gantt-importpj-bt',
		width: 90,
		handler: function() {
			setTimeout("vpGantt.importProject(false,true,0)", 10);
		}
	},
	{
		text: '模板导入',
		iconCls: 'gantt-importtp-bt',
		id: 'gantt-importtp-bt',
		width: 75,
		handler: function() {
			setTimeout("vpGantt.importTemplate(false,true,0)", 10);
		}
	},
	{
		text: '排程',
		width: 60,
		iconCls: 'gantt-schedule-bt',
		id: 'gantt-schedule-bt',
		disabled: true,
		hidden:true,
		id: 'gantt-schedule-bt',
		handler: function() {
			vpGantt.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
				msg: "正在刷新数据..."
			});
			vpGantt.gridMask.show();
			setTimeout("vpGantt.saveAllData()", 10);
		}
	},
	{
		text: '生成计划时间',
		iconCls: 'gantt-genplan-bt',
		id: 'gantt-genplan-bt',
		width: 100,
		handler: vpGantt.showGenPlanWin
	},
	/*{
		text: '添加资源',
		iconCls: 'gantt-addres-bt',
		id: 'gantt-addres-bt',
		disabled: false,
		width: 75,
		handler: function() {
			vpGantt.showAddResWin();
		}
	},*/
	
	{
		text: '资源替换',
		iconCls: 'gantt-replaceres-bt',
		id: 'gantt-replaceres-bt',
		disabled: false,
		width: 75,
		handler: function() {
			vpGantt.replaceRes();
		}
	},{
		text: '切换视图',
		iconCls: 'gantt-viewchange-bt',
		id: 'gantt-viewchange-bt',
		disabled: false,
		width: 75,
		handler: function() {
			jQuery.ajax({
				url: '/project/wbs/ganttLoadAction.do?themethod=setWorkPlanView&withgantt=1',
				type: 'get',
				async: false,
				success: function(res) {
				}
			});
			window.location.href=window.location.href.replace('/sim/ganttEdit-new.jsp','/ganttEdit-new.jsp');
		}
	},
/*	{
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
		}
	},*/
	/*,{
		text: '关键路径',
		iconCls: 'gantt-keyPath-bt',
		id: 'gantt-keyPath-bt',
		width: 75,
		disabled: false,
		handler: function() {
			vpGantt.toggleKeyPath(false);
		}   
	} */
	"->", "<div id=\"_tipsDiv\" style=\"width: 100px;\"></div>"]);
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
	vpGantt.sortSels=function(){
		var cs=vpGantt.gantt.getSelectionModel().selected.items;
		var res=[];
		for(var i=0,l=cs.length;i<l;i++){
			res.push(cs[i]);
		}
		res.sort(function(a,b){
			return a.rIndex-b.rIndex;
		});
		
		var finalRes=[],parentId=-1,curL1code='';
		for(var i=0,l=res.length;i<l;i++){
			var cur=res[i];
			if(parentId==-1){
				parentId=cur.parentNode.internalId;
				curL1code=cur.getWBSCode();
				finalRes.push(cur);
			}else{
				if(parentId==cur.parentNode.internalId){
					curL1code=cur.getWBSCode();
					finalRes.push(cur);
				}else{
					if(cur.getWBSCode().indexOf(curL1code)==0){
						;
					}else{
						vpGantt.errorCopyRange=true;
						//vpGantt.disablePaste();
						if(!vpGantt.isDeselecting){
							alert('多选的情况下,请选择兄弟节点！');
						}
						//vpGantt.clearNewSels();
						return;
					}
				}
			}
		}
		//vpGantt.enablePaste();
		vpGantt.errorCopyRange=false;
		vpGantt.selRecords=finalRes;
		return finalRes;
	};
	vpGantt.clearNewSels=function(){
		var model=vpGantt.gantt.getSelectionModel();
		var cs=model.selected.items,temp=[];
		for(var i=0,l=cs.length;i<l;i++){
			temp.push(cs[i]);
		}
		var pres=vpGantt.selRecords||[],parentId;
		if(pres.length>0){
			parentId=pres[0].parentNode.internalId;
		}else{
			parentId=temp[0].parentNode.internalId;
		}
		vpGantt.isAutoClearing=true;
		for(var i=0,l=temp.length;i<l;i++){
			var cur=temp[i];
			if(cur.parentNode.internalId!=parentId){
				model.deselect(cur.rIndex);
			}
		}
		vpGantt.isAutoClearing=false;
		vpGantt.sortSels();
	}
	vpGantt.getSelRecords=function(){
		return vpGantt.selRecords||[];
	};
	vpGantt.deselectSels=function(){
		var model=vpGantt.gantt.getSelectionModel();
		model.deselectAll();
		
	}
	vpGantt.changeComponent = {
		otherChanged: false,
		changed:false,
		setChanged:function(val){
			if(this.changed=val){
				//vpGantt.CalendarTitle= '查看项目日历';
				vpGantt.CalendarTitle= '项目日历';
				vpGantt.setBtText('gantt-pjcal-bt',vpGantt.CalendarTitle);
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
				vpGantt.enableBt('gantt-saveAndClose-bt');
				vpGantt.enableBt('gantt-schedule-bt');
				vpGantt.disableImport();
			} else {
				vpGantt.disableBt('gantt-save-bt');
				vpGantt.disableBt('gantt-saveAndClose-bt');
				vpGantt.disableBt('gantt-schedule-bt');
				vpGantt.enableImport();
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
					vpGantt.enableBt('gantt-saveAndClose-bt');
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
	vpGantt.getSelSingleTask=function(){
		//return vpGantt.gantt.getSelectionModel().selected.first();
		return vpGantt.curSelTask;
	};
	vpGantt.cacheTask=function(id,task){
		if(!vpGantt.taskCache){
			vpGantt.taskCache={};
		}
		vpGantt.taskCache[id]=task;
	};
	vpGantt.getSelTaskCount=function(){
		return vpGantt.gantt.getSelectionModel().selected.getCount();
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
	vpGantt.beforeRootTask=function(){
		
	};
	Ext.dd.DragSource.override({
		onBeforeDrag: function() {
			if(vpGantt.getSelTaskCount()>1){
				return false;
			}else{
				this.callOverridden(arguments);
			}
			
		},
		onDragDrop: function() {
			this.callOverridden(arguments);
			vpGantt.changeComponent.dragChange.calcuWorkLoad();
		}
	});
	Ext.grid.CellEditor.override({
		context: null,
		startEdit: function(c, b, a) {
			var me=this;
			this.context = a;
			this.callOverridden(arguments);
			me.field.selectText();
		},
		completeEdit: function(a) {
			this.callOverridden(arguments);
			if(this.context&&this.context.record){
				vpGantt.changeComponent.normalChange.setLast(this.context.record);
			}
			vpGantt.setEditingWorkLoad(false);
		}
	});
	/*vpGantt.genResCls=function(){

		var ResIcons=[{Type:1,Url:'/project/images/wbstask/icon_task_milestone.gif'},
		              {Type:2,Url:'/project/images/wbstask/icon_taskgz.gif'},
		              {Type:3,Url:'/project/images/wbstask/icon_taskzy.gif'}
		              ];
		var css=[];
		this.iconMap={};
		for(var i=0,ri=ResIcons,l=ri.length;i<l;i++){
			var cur=ri[i];
			css.push('.resicon-c'+cur.Type+' .x-res-icon{width:16px;background:url('+cur.Url+');}');
			this.iconMap[cur.Type]='resicon-c'+cur.Type;
		}
		document.getElementById('res-icon-css').innerHTML=css.join('\r\n');
	};
	*/
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
	Ext.onReady(function() {
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
			            }
			            
			            else {
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

		
		
		
	});
	vpGantt.buildGantt = function() {
		vpGantt.buildGrid();
		setTimeout("vpGantt.loadData()", 1);
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
	vpGantt.setStateList = function() {
		this.stateList = arguments[0];
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
	
	vpGantt.decoBts=function(){
		var hbts=this.hiddenBtMap;
		var bts=vpGantt.buttons;
		if(hbts){
			for(var i=0,len=bts.length;i<len;i++){
				var cur=bts[i];
				if(hbts[cur.id]){
					cur.hidden=true;
				}
			}
		}
	};

	
	vpGantt.initDateScope=function(){
		var res=vpGantt.loadedProInfo;
		vpGantt.initUECs(res);
		vpGantt.initHiddenBts(res);
		vpGantt.startDate = vpGantt.parseDate(res.projects ? res.projects[0].From: '2011-11-01');
		vpGantt.endDate = vpGantt.parseDate(res.projects ? res.projects[0].To: '2011-11-01');
		
		vpGantt.setStateList(res.statlists);
		vpGantt.setProgressList(res.progresslists);
		var syscfg=res.syscfg;
		vpGantt.setHoursPerDay((syscfg&&syscfg.hoursOfday)?parseFloat(syscfg.hoursOfday,10):8);
		
		
		if (!vpGantt.startDate || !vpGantt.endDate || (vpGantt.endDate.getTime() < vpGantt.startDate.getTime())) {
			alert('项目预测开始日期或完成日期异常，请检查项目的基本信息！');
			vpGantt.gridMask.hide();
		}
		if (!res.statlists || !res.progresslists || (res.statlists.length == 0) || (res.progresslists.length == 0)) {
			alert('系统状态列表或进度状态列表配置异常，请检查！');
			vpGantt.gridMask.hide();
		}
	}
	vpGantt.buildGrid = function() {
		vpGantt.initDateScope();
		vpGantt.decoBts();
		vpGantt.gantt = Ext.create('Gnt.panel.Gantt', {
			height: Gantt.height,
			width: Gantt.width,
			renderTo: Ext.get(vpGantt.ganttdiv),
			selModel:{allowDeselect:true,mode:'multi'},
			/*leftLabelField: {
				dataIndex: 'Name',
				editor: {
					xtype: 'textfield'
				}4
			},*/
			/*eventRenderer: function(task) {
				if (vpGantt.assignmentStore.findExact('TaskId', task.data.Id) >= 0) {
					return {
						ctcls: 'resources-assigned'
					};
				}
			},*/
			//resizeHandles: "none",
			loadMask: true,
			highlightWeekends:true,
			skipWeekendsDuringDragDrop:false,
			snapToIncrement: true,
			cascadeChanges: true,
			plugins : [
		                Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit:1 }),
		                { ptype : 'bufferedrenderer' }
		            ],
		    viewConfig:{
		    	plugins:[{
                ptype           : 'treeviewdragdrop',
                containerScroll : true
            }]},
			//startDate: vpGantt.startDate,
			//endDate: vpGantt.endDate,
			columns: vpGantt.columns,
			tbar: vpGantt.buttons,
			dependencyStore: vpGantt.dependencyStore,
			resourceStore: vpGantt.resourceStore,
			//assignmentStore: vpGantt.assignmentStore,
			taskStore: vpGantt.taskStore,
			stripeRows: true/*,
		    lockedViewConfig  : {
                getRowClass : function(rec) { return rec.isRoot() ? 'root-row' : ''; },
                plugins : {
                    ptype           : 'treeviewdragdrop',
                    containerScroll : true
                }
            }*/
		});
		vpGantt.gantt.view.on('beforedrop', function(node, data, overModel, dropPosition, dropHandlers) {
		    if(dropPosition=='before'&&overModel.parentNode&&overModel.parentNode.isRoot()){
		    	return false;
		    }
		});
		vpGantt.gantt.on('select',function(o, record, index, eOpts){
			
			
			record.data.rIndex=index;
			record.rIndex=index;
			if(record.data.depth==1){
				o.deselect(index);
			}
			
		});
		vpGantt.gantt.on('deselect',function(o, record, index, eOpts){
			vpGantt.isDeselecting=true;
		});
/*		vpGantt.showCopyBt1=function(){
			if(!vpGantt.errorCopyRange){
				vpGantt.copybt1.style.display='block';
			}
		};
		vpGantt.showCopyBt2=function(){
			if(!vpGantt.errorCopyRange){
				vpGantt.copybt2.style.display='block';
			}
			
		};
		vpGantt.hideCopyBt1=function(){
			vpGantt.copybt1.style.display='none';
		};
		vpGantt.hideCopyBt2=function(){
			vpGantt.copybt2.style.display='none';
		};*/
	
		vpGantt.gantt.on('selectionchange',function(o, record, index, eOpts){
			
			var res=vpGantt.sortSels();
			vpGantt.isDeselecting=false;
			
		});
		vpGantt.gantt.on('beforeitemexpand',function(o, record, index, eOpts){
			vpGantt.deselectSels();
			return true;
			if(vpGantt.getSelTaskCount()>1){
				return false;
			}
		});
		vpGantt.gantt.on('beforeitemcollapse',function(o, record, index, eOpts){
			vpGantt.deselectSels();
			return true;
			if(vpGantt.getSelTaskCount()>1){
				return false;
			}
		}); 

		vpGantt.bindResize();
	};
	/*vpGantt.getGanttView=function(){
		return this.gantt.getView();
	};

	vpGantt.toggleKeyPath=function(fromRowClick){ 
		this.keyPathShow=(!!!this.keyPathShow);
		var css=document.getElementById("grid-select-css"),show=this.keyPathShow, rootNode = this.getRootNode(),view=this.getGanttView(),nView=this.getNormalView();
		if(show){
			css.setAttribute("href","/project/css/gantt-key-path-selected.css");
		}else{
			css.setAttribute("href","/project/css/gantt-key-path-normal.css");
		}
		
		
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
	vpGantt.hideCopyBts=function(){

		vpGantt.willHideCBt=true;
		vpGantt.hidecbtsInt=setTimeout(function(){
			if(vpGantt.willHideCBt){
				vpGantt.hideCopyBt1();
				vpGantt.hideCopyBt2();
			}
		},200);
	};
	vpGantt.showCopyBts=function(){

		vpGantt.willHideCBt=false;
		vpGantt.showCopyBt1();
		vpGantt.showCopyBt2();
	};
	vpGantt.reload = function(data) {
		var tasks;
		if(vpGantt.getTaskId()!= 'null'){
			tasks=data.tasks
		}else{
			tasks=[{KeyTask:false,IndicateLight:"{-1}{-1}{-1}{-1}","Id":null,leaf:false,Name:vpGantt.getProjectName(),expanded:true,children:data.tasks}];
		}
		this.taskStore.proxy.data = tasks;
		
		data.resources=vpGantt.removeDupRes(data.resources);
		vpGantt.initResourceEditor(data.resources);
		this.resourceStore.proxy.data = data.resources;
		this.dependencyStore.proxy.data = data.dependencies;
		this.resourceStore.load();
		this.taskStore.load();
		this.dependencyStore.load();
		this.gridMask.hide();
		
	};
 
	vpGantt.loadData = function() {
		try {
			//var data = vpGantt.getData(vpGantt.getProjectId(), vpGantt.getTaskId() == 'null' ? 0 : vpGantt.getTaskId());
			
			if(!vpGantt.data){
				setTimeout(vpGantt.loadData,10);
				return;
			}
			
			vpGantt.reload(vpGantt.data);
	    	vpGantt.genResCls(vpGantt.data);
		} catch(e) {
			alert(e.message);
			vpGantt.gridMask.hide();
		}
	};
	vpGantt.refreshData = function(taskId, pos, idIsReal) {
		vpGantt.modalWinClose();
		vpGantt.gridMask = new Ext.LoadMask(this.ganttEl, {
			msg: "正在加载数据..."
		});
		vpGantt.gridMask.show();
		//try {
			vpGantt.loadData();

		//} catch(e) {
		//	alert(e.message);
		//	vpGantt.gridMask.hide();
		//}
		vpGantt.gridMask.hide();
		vpGantt.modalWinClose();
	};
	vpGantt.inject2Node = function(node, data, pres) {
		this.dependencyStore.loadData(pres.dependencies, true);
		node.removeAll();
		node.appendChild(this.getNodesList(this.gantt.getTaskStore(), data));
	};
	
	vpGantt.enablePaste = function() {
		return;
		vpGantt.enableRowMenuItem(15);
		vpGantt.enableRowMenuItem(16);
		vpGantt.enableRowMenuItem(17);
	};
	
	vpGantt.disablePaste = function() {
		return;
		vpGantt.disableRowMenuItem(15);
		vpGantt.disableRowMenuItem(16);
		vpGantt.disableRowMenuItem(17);
	};
	
	vpGantt.createRowMenu = function() {
		vpGantt.rowMenu = Ext.create('Ext.menu.Menu', {
			id: 'rowMenu',
			items: [{
				iconCls: 'arrow2r',
				text: '新建同级(上方插入)',
				handler: function() {
					vpGantt.showEditingMask();
					setTimeout("vpGantt.addSomeBrotherU(1)", 10);
				}
			},
			{
				iconCls: 'arrow2r',
				text: '新建同级(下方添加)',
				handler: function() {
					vpGantt.showEditingMask();
					setTimeout("vpGantt.addSomeBrotherD(1)", 10);
				}
			},
			{
				iconCls: 'arrow2r',
				text: '新建下级',
				handler: function() {
					vpGantt.showEditingMask();
					setTimeout("vpGantt.addChildren(1)", 10);
				}
			},
			{
				iconCls: 'arrow2r',
				text: '批量新建同级(上方插入)',
				menu: {
					items: [{
						iconCls: 'arrow2r',
						text: '2条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addSomeBrotherU(2)", 10);
						}
					},
					{
						iconCls: 'arrow2r',
						text: '3条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addSomeBrotherU(3)", 10);
						}
					},
					{
						iconCls: 'arrow2r',
						text: '5条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addSomeBrotherU(5)", 10);
						}
					},
					{
						iconCls: 'arrow2r',
						text: '10条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addSomeBrotherU(10)", 10);
						}
					}]
				}
			},
			{
				iconCls: 'arrow2r',
				text: '批量新建同级(下方添加)',
				menu: {
					items: [{
						iconCls: 'arrow2r',
						text: '2条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addSomeBrotherD(2)", 10);
						}
					},
					{
						iconCls: 'arrow2r',
						text: '3条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addSomeBrotherD(3)", 10);
						}
					},
					{
						iconCls: 'arrow2r',
						text: '5条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addSomeBrotherD(5)", 10);
						}
					},
					{
						iconCls: 'arrow2r',
						text: '10条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addSomeBrotherD(10)", 10);
						}
					}]
				}
			},
			{
				iconCls: 'arrow2r',
				text: '批量新建下级',
				menu: {
					items: [{
						iconCls: 'arrow2r',
						text: '2条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addChildren(2)", 10);
						}
					},
					{
						iconCls: 'arrow2r',
						text: '3条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addChildren(3)", 10);
						}
					},
					{
						iconCls: 'arrow2r',
						text: '5条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addChildren(5)", 10);
						}
					},
					{
						iconCls: 'arrow2r',
						text: '10条任务',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.addChildren(10)", 10);
						}
					}]
				}
			},
			{
				iconCls: 'arrow2r',
				text: '删除',
				handler: function() {
					vpGantt.showEditingMask();
					setTimeout("vpGantt.delTask(10)", 10);
				}
			},
			'-', {
				iconCls: 'arrow2r',
				text: '升级',
				handler: function() {
					vpGantt.showEditingMask();
					setTimeout("vpGantt.upGrade()", 10);
				}
			},
			{
				iconCls: 'arrow2r',
				text: '降级',
				handler: function() {
					vpGantt.showEditingMask();
					setTimeout("vpGantt.downGrade()", 10);
				}
			},
			'-',{iconCls: 'arrow2r',
				 text:'Project导入',
				 menu:{
					items:[{
								iconCls: 'arrow2r',
								text: '导入同级(上方插入)',
								handler: function() {
									setTimeout("vpGantt.importProject(true,false,2)", 10);
								}
							},
							{
								iconCls: 'arrow2r',
								text: '导入同级(下方添加)',
								handler: function() {
									setTimeout("vpGantt.importProject(true,false,1)", 10);
								}
							},
							{
								iconCls: 'arrow2r',
								text: '导入下级',
								handler: function() {
									setTimeout("vpGantt.importProject(true,false,0)", 10);
								}
							}
						]
				 }
				},{iconCls: 'arrow2r',
					 text:'	WBS模板导入',
					 menu:{
						items:[{
									iconCls: 'arrow2r',
									text: '导入同级(上方插入)',
									handler: function() {
										setTimeout("vpGantt.importTemplate(true,false,2)", 10);
									}
								},
								{
									iconCls: 'arrow2r',
									text: '导入同级(下方添加)',
									handler: function() {
										setTimeout("vpGantt.importTemplate(true,false,1)", 10);
									}
								},
								{
									iconCls: 'arrow2r',
									text: '导入下级',
									handler: function() {
										setTimeout("vpGantt.importTemplate(true,false,0)", 10);
									}
								}
							]
					 }
					},'-', {
						iconCls: 'arrow2r',
						text: '复制',
						handler: function() {
							//vpGantt.showEditingMask();
							setTimeout("vpGantt.doCopySingleSel()", 10);
						}
					},
					{
						iconCls: 'arrow2r',
						text: '粘贴',
						handler: function() {
							vpGantt.showEditingMask();
							setTimeout("vpGantt.doPasteSingleSel(1)", 10);
						}
					},
					{iconCls: 'arrow2r',
						 text:'选择性粘贴',
						 menu:{
							items:[{
									iconCls: 'arrow2r',
									text: '下方粘贴',
									handler: function() {
										vpGantt.showEditingMask();
										setTimeout("vpGantt.doPasteSingleSel(2)", 10);
									}
								},
								{
									iconCls: 'arrow2r',
									text: '粘贴为子任务',
									handler: function() {
										vpGantt.showEditingMask();
										setTimeout("vpGantt.doPasteSingleSel(3)", 10);
									}
								}
								]
						 }
						}
					]
		});
		
	};
	
	vpGantt.getRootNode=function(){
		if(!this.rootNode){
			this.rootNode=this.gantt.getTaskStore().getRootNode().childNodes[0];
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
	vpGantt.showTPPreviewWin=function(pid){
		var width = document.body.clientWidth,
		height = document.body.clientHeight,
		x = (document.body.clientWidth - width) / 2,
		y = (document.body.clientHeight - height) / 2,
		//src='/project/wbs/tasktemplate/tasktemplateGantt225/editTemplate.jsp?preview=1&projectid='+pid;
		src='/project/wbs/tasktemplate/editTemplate.jsp?preview=1&projectid='+pid;
		this.TPPreviewWin = Ext.create('Ext.Window', {
			width: width,
			height: height,
			title: ' 预览模板',
			modal: true,
			x: x,
			y: 0,
			headerPosition: 'top',
			layout: 'fit',
			items: {
				border: 0,
				html: '<iframe src="' + src + '" style="text-align:center;width:100%;height:100%;" name="bottom" scrolling="NO" frameborder="0" noresize></iframe>'
			},
			buttons: [{
				text: '导入',
				xtype: 'button',
				handler: function() {vpGantt.doImportTemplate(pid);}
			},
			{
				text: '选择其它模板',
				xtype: 'button',
				handler: function() {vpGantt.closeTPPreviewWin();}
			}
			],
			closeAction: 'destroy',
			closable: true,
			bodyBorder: false
		});
		//this.hideImportTpWin();
		this.TPPreviewWin.show();
	};
	vpGantt.hideImportTpWin=function(){
		this.importTpWin.hide();
	};
	
	
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
	vpGantt.temOldIDCatch=[];
	vpGantt.decorateForImTT=function(tasks){
		for(var i=0;i<tasks.length;i++){
			this.accessAllJsonNodes(tasks[i],{func:function(node){
				var curId='T_'+vpGantt.newId++;
				vpGantt.temOldIDCatch[parseInt(node.Id)]=curId;
				node.Id=curId;
			}});
		}
		
		for(var j=0;j<tasks.length;j++){
			this.accessAllJsonNodes(tasks[j],{func:function(node){
				var curDepens=node.DependencyTask;
				if(curDepens==null||curDepens==''){
					return;
				}else{
					var ids=curDepens.split(','),desids='';
					for(var m=0;m<ids.length;m++){
						if(m==0){
							desids+=vpGantt.temOldIDCatch[parseInt(ids[m])];
						}else{
							desids+=','+vpGantt.temOldIDCatch[parseInt(ids[m])];
						}
						node.DependencyTask=desids;
					}
				}
				
			}});
		}
		vpGantt.temOldIDCatch=[];
	};
	vpGantt.getTemplateData = function(projectId) {
		var data;
		jQuery.ajax({
			url: '/project/wbs/wbstemplateaction.do',
			data: {
				themethod: 'loadTemplate',
				projectid: projectId
			},
			type: 'post',
			async: false,
			success: function(res) {
				data = res;
			},
			dataType: 'json'
		});
		return data;
	};
	vpGantt.getTemplateNodes=function(pid){
		var tasks=this.getTemplateData(pid).tasks,res=[];
		this.decorateForImTT(tasks);
		return this.getNodesList(this.gantt.getTaskStore(), tasks);

	};
	vpGantt.doImportTemplaterr=function(pid){
		this.closePreviewWin();
		this.closeImportTpWin();
		this.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
			msg: "正在编辑数据..."
		});
		this.gridMask.show();
		var nodes=this.getTemplateNodes(pid);
		if(nodes.length>0){
			 curTask=vpGantt.getSelSingleTask();
			if(this.imTTPara.task){
				if(this.imTTPara.pos=='0'){
					if(curTask.childNodes.length<1){
						this.insertNodes(curTask,nodes);
					}else{
						this.insertNodes(curTask,nodes,curTask.childNodes[0]);
					}
				}else if(this.imTTPara.pos=='1'){
					this.insertNodes(curTask.parentNode,nodes,curTask.nextSibling);
				}else{
					this.insertNodes(curTask.parentNode,nodes,curTask);
				}
			}else{
				var rootNode=this.getRootNode();
				rootNode.removeAll();
				this.insertNodes(rootNode,nodes);
			}
			vpGantt.changeComponent.setOtherChanged(true);
		}else{
			alert('导入模板为空!');
		}
		this.gridMask.hide();
	};
	   vpGantt.doImportTemplate=function(pid){
			this.closePreviewWin();
			this.closeImportTpWin();
			this.gridMask = new Ext.LoadMask(vpGantt.ganttEl, {
				msg: "正在编辑数据..."
			});
			jQuery.ajax({
				url: '/project/wbs/wbstemplateaction.do',
				data: {
					themethod: 'importTemplate',
					projectid: vpGantt.getProjectId(),
					templateid:pid,
					isFromTemplate:false,
					isTask:vpGantt.imTTPara.task,
					pos:vpGantt.imTTPara.pos,
					taskid:(vpGantt.imTTPara.task?(vpGantt.imTTPara.toolbar?vpGantt.getTaskId():vpGantt.getSelSingleTask().get("Id")):0),
					idIsReal:(vpGantt.imTTPara.task&&vpGantt.imTTPara.toolbar)
				},
				type: 'post',
				async: false,
				success: function(res) {
					vpGantt.reloadProject();
				},
				dataType: 'json'
			});
			this.gridMask.hide();
		};
	vpGantt.importTemplate = function(task, toolbar, pos) {
		if (vpGantt.getTaskId() != 'null') task = true;
		vpGantt.imTTPara={task:task,toolbar:toolbar,pos:pos};
		if((!this.rootIsEmpty())&&toolbar){
		 Ext.MessageBox.confirm('导入位置提示', 'WBS计划模板将会导入在当前任务计划的最后（根节点处）。<br/>如需在在某个任务节点处导入，请通过节点下拉操作处理！<br/><br/>请确认是否继续？',function(bt){
			if(bt=='yes'){
				//vpGantt.doImportTemplate(task, toolbar, pos);
				vpGantt.showImportTpWin();
			}
		 });
		}else{
			//vpGantt.doImportTemplate(task, toolbar, pos);
			vpGantt.showImportTpWin();
		}
	};
	vpGantt.disableImport = function() {
		vpGantt.disableBt('gantt-importpj-bt');
		vpGantt.disableBt('gantt-importtp-bt');
		vpGantt.disableBt('gantt-mgvirres-bt');
		vpGantt.disableBt('gantt-replaceres-bt');
		
		vpGantt.disableRowMenuItem(11);
		vpGantt.disableRowMenuItem(12);
		//vpGantt.disablePaste();
		//vpGantt.disableRowMenuItem(13);
	};
	vpGantt.enableImport = function() {
		vpGantt.enableBt('gantt-importpj-bt');
		vpGantt.enableBt('gantt-importtp-bt');
		vpGantt.enableBt('gantt-mgvirres-bt');
		vpGantt.enableBt('gantt-replaceres-bt');
		vpGantt.enableRowMenuItem(11);
		vpGantt.enableRowMenuItem(12);
		//vpGantt.enableRowMenuItem(13);
	};
	
	
	

	
	
	vpGantt.disableCopy= function() {

		vpGantt.disableRowMenuItem(14);
	};
	vpGantt.enableCopy= function() {

		vpGantt.enableRowMenuItem(14);
	};
	
	
	vpGantt.disableRowMenuItem = function(index) {
		vpGantt.rowMenu.items.getAt(index).disable();
	};
	vpGantt.enableRowMenuItem = function(index) {
		vpGantt.rowMenu.items.getAt(index).enable();
	};
	vpGantt.genPlanByType = function(type) {
		var rootNode = this.getRootNode();
		type = (type == '0' ? type: (type == '1' ? '2': 'all'));
		vpGantt.accessAllNodes(rootNode, {
			type: type,
			func: function(snode) {
				if (snode.isRoot()) return;
				if (snode.get("IndicateLight").charAt(1) == this.type || this.type == 'all') {
					/*snode.setValue({
						BaselineStartDate: snode.get("StartDate"),
						BaselineEndDate: snode.get("EndDate") ? (snode.get("Duration") == 0 ? snode.get("EndDate") : new Date(snode.get("EndDate").getTime() - 1)) : '',
						BaselineWorkLoad: snode.get("WorkLoad")
					});*/
					snode.setBaselineStartDate(snode.get("StartDate"));
					snode.setBaselineEndDate(snode.get("EndDate") ? (snode.get("Duration") == 0 ? snode.get("EndDate") : new Date(snode.get("EndDate").getTime() - 1)) : '');
					snode.setBaselineWorkLoad(snode.get("WorkLoad"));
					snode.callStore('afterEdit');
				}
			}
		});
		vpGantt.changeComponent.setOtherChanged(true);
		vpGantt.gridMask.hide();
		vpGantt.modalWinClose();
	};
	vpGantt.modalWinClose = function() {
		if (vpGantt.modalWin) vpGantt.modalWin.close();
	};
	vpGantt.hoursPerDay = 8;
	vpGantt.setHoursPerDay=function(num){
		vpGantt.hoursPerDay=num;
	};
	vpGantt.calcuWorkLoad = function(record) {
		var added, workload = record.get("WorkLoad"),
		duration=0,
		resNum=0,res,persent=0.0;
		if (record.get("ResIds") == '' || record.get("Duration") == '' || record.get("Duration") == 0) {
			resNum = 0;
			duration = 0;
		} else {
			//resNum = record.get("ResIds").split(',').length;
			res=record.get("ResIds").split(',');
			duration = record.get("Duration");
			for(var i=0;i<res.length;i++){
				persent+=(parseFloat(res[i].split('#')[1],10)/100.0);
			}
		}

		
		nowvalue = persent * vpGantt.hoursPerDay * duration;
		
		//pre{
		//nowvalue = resNum * vpGantt.hoursPerDay * duration;}
		
		nowvalue=vpGantt.getWLByPrecision(nowvalue);
		/*record.setValue({
			WorkLoad: nowvalue
		});*/
		record.setWorkLoad(nowvalue);
		record.callStore('afterEdit');
		if (!vpGantt.isDoRollUp()) return;
		var curp = record.parentNode;
		while (curp && !curp.isRoot()) {
			var pDuration = 0;
			for (var i = 0; i < curp.childNodes.length; i++) {
				var cd = curp.childNodes[i].data.WorkLoad;
				pDuration += (cd == '' ? 0 : cd);
			}
			curp.set({
				WorkLoad: pDuration
			});
			curp = curp.parentNode;
		}
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
	vpGantt.addResourceReserved=function(id,name){
		var exsist=false;
		this.resourceStore.each(function(item){
			if(parseInt(id)==parseInt(item.get('Id'))){
				exsist=true;
				return false;
			}
		});
		if(!exsist){
			this.resourceStore.add({Id:id,Name:name});
		}
		vpGantt.moveAGrid();
	};
	vpGantt.addResource=function(id,name,type){
		var exsist=false,idsArray=[],i=0;
		this.resourceStore.each(function(item){
			if(parseInt(id)==parseInt(item.get('Id'))){
				exsist=true;
				//item.set("Units",100);
				vpGantt.resourceStore.add({Id:id,Name:name,Units:100,IconType:type||-1});
				vpResourceEditor.assignStore.loadData([{id:id,percent:100,name:name,iconType:type||-1}],true);
				//vpGantt.resourceStore.remove(item);
				
				return false;
			}
		});
		if(!exsist){
			this.resourceStore.add({Id:id,Name:name,Units:100,IconType:type});
			vpResourceEditor.assignStore.loadData([{id:id,percent:100,name:name,iconType:type||-1}],true);
		}
	}
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
		
		  Common.showModalWin('/project/wbs/virtualResourceAction.do?wbs=wbs&event=getResource&projectID='+vpGantt.getProjectId(),window, 660, 500,function(obj){
			  if(obj){
					vpGantt.reloadProject();
				}
			});


	};
	vpGantt.closeReplaceWin=function(refresh){
		this.replaceResWin.close();
		if(refresh){
			vpGantt.reloadProject();
		}
		  
	}
	vpGantt.showResReplaceWin=function(){
		
		var url='/project/wbs/virtualResourceAction.do?wbs=wbs&event=getResType&projectID='+vpGantt.getProjectId();
		var width = 450,
		height = 320,
		x = (document.body.clientWidth - width) / 2,
		y = (document.body.clientHeight - height) / 2,
		src='';
		this.replaceResWin = Ext.create('Ext.Window', {
			width: width,
			height: height,
			title: '资源替换',
			modal: true,
			x: x,
			y: 30,
			headerPosition: 'top',
			layout: 'fit',
			items: {
				border: 0,
				html: '<iframe src="' + url + '" style="text-align:center;width:100%;height:100%;" name="bottom" scrolling="NO" frameborder="0" noresize>'
			},
			closeAction: 'destroy',
			closable: true,
			bodyBorder: false
		});
		
		this.replaceResWin.show();
	};
	vpGantt.replaceRes=function(){
		vpGantt.showResReplaceWin();
		
	};
	
	vpGantt.reSortRes=function(){
		vpGantt.resResourceStore.sort([
		             
		              {
		                  property : 'IconType',
		                  direction: 'ASC'
		              },
		              {
		                  property : 'Name',
		                  direction: 'ASC'
		              }
		          ]);
		
	};
	vpGantt.addVirtualRes=function(){
		Common.showModalWin('/project/wbs/virtualResourceAction.do?wbs=wbs&event=getResource&add=res&projectID='+vpGantt.getProjectId(),window, 385, 290,function(obj){
			if(obj&&obj.id&&obj.name){
				vpGantt.addResource(obj.id,obj.name,1);
				
				try{
					//vpGantt.reSortRes();
					vpGantt.resListPiker.loadTaskAssignments(vpGantt.resEditTaskId);
				}catch(e){
					;
				}
				
			}
		});
	};
	
	vpGantt.getResGridBts=function(){
		
		return ["<div id=\"res-bt1\" class=\"add-res-div\" ><a href=\"#\" onclick=\"vpGantt.showAddResWin()\">+资源</a>",
		        "<div id=\"res-bt2\" class=\"add-res-div\" ><a href=\"#\" onclick=\"vpGantt.addVirtualRes()\">+虚拟资源</a>"
		        ];
	};
	
	vpGantt.withChrome=function(){
		return (navigator.userAgent.toLowerCase().indexOf('chrome')>-1);
	};
	vpGantt.moveAGrid=function(){ 
		return;
		var css=document.getElementById("grid-assigngrid-css");
		if((!this.withChrome())&&this.resourceStore.getCount()>4){
			css.setAttribute("href","/project/css/gnt-asgrid-move.css");
			//alert(css.getAttribute("href"));
		}else{
			css.setAttribute("href","");
		}
		
		
	};
	
	vpGantt.getUECMap=function(){
		return this.uecmap||{};
	};
	
		
	vpGantt.initResourceEditor=function(res){
		vpResourceEditor.set('getResStore',function(){
			var da=vpGantt.resourceStore.data,ds=[];
			if(da&&da.items&&da.items.length>0){
				items=da.items;
				for(var i =0;i<items.length;i++){
					ds.push(items[i].data);
				}
			}
			return ds;
		});
		vpResourceEditor.loadRes(res);
		vpResourceEditor.set('addRes',vpGantt.showAddResWin);
		vpResourceEditor.set('addVirtualRes',vpGantt.addVirtualRes);
	};
	vpGantt.isCopy=function(e){
		if(e.ctrlKey&&e.keyCode==67){
			return true;
		}else{
			return false;
		}
	};
	vpGantt.getCopyFs=function(){
		if(this.copyFs){
			return this.copyFs;
		}else{
			var fs=vpGantt.submitFileds,cfs=[];
			for(var i=0,l=fs.length;i<l;i++){
				cfs.push(fs[i].name);
			}
			this.copyFs=cfs;
			return cfs;
		}
	};
	vpGantt.addCopyDepens=function(task){
		var curDepens=task.DependencyTask||'';
		curDepens=curDepens.split(',');
		if(curDepens.length>0){
			var deStore = vpGantt.dependencyStore;
			var m = [];
			for (var i=0,l=curDepens.length; i<l; i++) {
				m.push(new Gnt.model.Dependency({
					fromTask:curDepens[i],
					toTask:task.Id,
					type: '2',
					lag: '0',
					lagUnit:'d'
				}));
			}
			if (m.length > 0) {
				deStore.add(m)
			}
		}
		
	};
	vpGantt.parse2SimpleObjArray=function(ts){
		/*if(Object.prototype.toString.apply(ts)=='[object Array]'){
			ts.
		}*/
		var res=[],fs=vpGantt.getCopyFs();
		for(var i=0,l=ts.length;i<l;i++){
			var task=ts[i];
			/*var cur={
					PercentDone: task.get('PercentDone'),
					BaselineWorkLoad: task.get('BaselineWorkLoad'),
					WorkLoad: task.get('WorkLoad'),
					Name: task.get('Name'),
					StartDate: task.get('StartDate'),
					EndDate: task.get('EndDate'),
					BaselineStartDate: task.get('BaselineStartDate'),
					BaselineEndDate: task.get('BaselineEndDate'),
					Duration:task.get('Duration'),
					DurationUnit: "d",
					leaf: task.get('leaf'),
					expanded:true,
					Option2:task.get('Option2')
			};*/
			var cur={};
			for(var j=0,len=fs.length;j<len;j++){
				var id=fs[j];
				cur[id]=task.get(id);
			}
			if(task.childNodes){
				cur.childNodes=vpGantt.parse2SimpleObjArray(task.childNodes);
			}
			res.push(cur);
		}
		return res;
	};
	vpGantt.doCopy=function(){
		var rs=vpGantt.sortSels();
		this.copiedTasks=vpGantt.parse2SimpleObjArray(rs);
	};
	vpGantt.doCopySingleSel=function(){
		this.copiedTasks=vpGantt.parse2SimpleObjArray([vpGantt.curSelTask]);
	};
	vpGantt.getCopiedTasks=function(){
		return this.copiedTasks;
	};
	vpGantt.isPaste=function(e){
		if(e.ctrlKey&&e.keyCode==86){
			return true;
		}else{
			return false;
		}
	};
	vpGantt.pasteSingleTask=function(parent,tar,task){
		task.IndicateLight='{0}{0}{0}{0}';
		task.Id='T_' + vpGantt.newId++;
		task.expanded=true;
		/*{
			IndicateLight: '{0}{0}{0}{0}',
			Id: 'T_' + vpGantt.newId++,
			PercentDone: task['PercentDone'],
			BaselineWorkLoad:  task['BaselineWorkLoad'],
			WorkLoad:  task['WorkLoad'],
			Name:  task['Name'],
			StartDate:  task['StartDate'],
			EndDate:  task['EndDate'],
			BaselineStartDate:  task['BaselineStartDate'],
			BaselineEndDate:  task['BaselineEndDate'],
			Duration: task['Duration'],
			DurationUnit: "d",
			leaf:  task['leaf'],
			expanded:true,
			Option2: task['Option2']
		}*/
		var newTask = new Gnt.model.Task(task);
		vpGantt.addCopyDepens(task);
	
		var cn=task.childNodes;
		if(cn&&cn.length>0){
			for(var i=0;i<cn.length;i++){
				var c=cn[i];
				vpGantt.pasteSingleTask(newTask,null,c);
			}
		}
		newTask.commit();
		if(tar){
			parent.insertBefore(newTask, tar);
		}else{
			parent.appendChild(newTask);
			parent.set('leaf',false);
			parent.expand();
		}
		vpGantt.changeComponent.setOtherChanged(true);
		
	};
	vpGantt.doPasteSingleSel=function(pos){
		vpGantt.doPaste(vpGantt.curSelTask,pos);
	};
	vpGantt.doPaste=function(tar,pos){
		pos=pos||1;
		vpGantt.gridMask.show();
		setTimeout(function(){
			var cs=vpGantt.gantt.getSelectionModel().selected.items;
			if(!tar&&(cs.length>1||cs.length<1)){
				 Ext.MessageBox.alert('提示', '请选择要粘贴到的目标位置！',function(bt){vpGantt.pasteHold=false;});
			}else{
				tar=tar||cs[0];
				var selTasks=vpGantt.getCopiedTasks()||[];
				if(selTasks.length<1){
					alert('您未复制任何记录！');
					vpGantt.gridMask.hide();
					return;
				}
				//tar.cancelEdit();
				var parent;
				if(pos==1){
					parent=tar.parentNode;
					tar=tar;
				}else if(pos==2){
					parent=tar.parentNode;
					tar=tar.nextSibling||null;
				}else{
					parent=tar;
					tar=null;
				}
				for(var i=0;i<selTasks.length;i++){
					var cur=selTasks[i];
					vpGantt.pasteSingleTask(parent,tar,cur);
				}
				//tar.reject();
			}
			vpGantt.gridMask.hide();
		},10);
		
	};
	vpGantt.endCopy=function(e){
		if(e.keyCode==67){
			return true;
		}else{
			return false;
		}
	};
	if (window.addEventListener) {
		window.addEventListener('keydown',
		function(e) {

			if(e.keyCode==67){
				if(vpGantt.isCopy(e)&&!vpGantt.copyHold){
					//doCopy
					vpGantt.doCopy();
					vpGantt.copyHold=true;
				}
			}
			if(e.keyCode==86){
				//alert('86'+vpGantt.isPaste(e)+' '+(vpGantt.pasteHold));
				if(vpGantt.isPaste(e)&&!vpGantt.pasteHold){
					//doPaste
					vpGantt.pasteHold=true;
					vpGantt.doPaste();
					
					
				}
			}
		},
		false);
		window.addEventListener('keyup',
				function(e) {

				if(e.keyCode==67){
					vpGantt.copyHold=false;
				}
				if(e.keyCode==86){
					vpGantt.pasteHold=false;
				}
				},
				false);
	} else {

		document.attachEvent('onkeydown',
				function(e) {
					if(e.keyCode==67){
						if(vpGantt.isCopy(e)&&!vpGantt.copyHold){
							//doCopy
							vpGantt.doCopy();
							vpGantt.copyHold=true;
						}
					}
					if(e.keyCode==86){
						//alert('86'+vpGantt.isPaste(e)+' '+(vpGantt.pasteHold));
						if(vpGantt.isPaste(e)&&!vpGantt.pasteHold){
							//doPaste
							vpGantt.pasteHold=true;
							vpGantt.doPaste();
							
							
						}
					}
				});
		document.attachEvent('onkeyup',
						function(e) {

						if(e.keyCode==67){
							vpGantt.copyHold=false;
						}
						if(e.keyCode==86){
							vpGantt.pasteHold=false;
						}
						}
						);
	}
	
//} catch(e) {
//	alert(e.message);
//	vpGantt.gridMask.hide();
//}