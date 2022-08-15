

( function() {
	  if (Sch.util && Sch.util.Date) {
				Ext.apply(Sch.util.Date, {
						getReadableNameOfUnit : function(unit, v) {
							switch (unit.toLowerCase()) {
							case this.YEAR:
								return v ? "��" : "��";
							case this.QUARTER:
								return v ? "����" : "����";
							case this.MONTH:
								return v ? "��" : "��";
							case this.WEEK:
								return v ? "����" : "����";
							case this.DAY:
								return v ? "��" : "��";
							case this.HOUR:
								return v ? "Сʱ" : "Сʱ";
							case this.MINUTE:
								return v ? "����" : "����";	
							case this.SECOND:
								return "��";
							case this.MILLI:
								return "��";
							}
							throw "Incorrect UnitName";
						}
	      });
	  }
    if (Sch.plugin) {
    	  if(Sch.plugin.Lines) {
    	  }
    	  if(Sch.plugin.Zones) {
    	  }
    	  if(Sch.plugin.Pan) {
    	  }
    	  if(Sch.plugin.Printable) {
    	  }
    	  if(Sch.plugin.TreeCellEditing) {
    	  }
    	  if(Sch.plugin.CurrentTimeLine) {
            Sch.plugin.CurrentTimeLine.prototype.tooltipText = '��ǰʱ��';
    	  }
    }
    if (Sch.plugin) {
    	  if(Gnt.plugin.DependencyEditor) {
            Gnt.plugin.DependencyEditor.prototype.fromText = 'ǰ������';
            Gnt.plugin.DependencyEditor.prototype.toText = '��������';
            Gnt.plugin.DependencyEditor.prototype.typeText = '��������';
            Gnt.plugin.DependencyEditor.prototype.lagText = '�ͺ�ʱ��';
            Gnt.plugin.DependencyEditor.prototype.endToStartText = '���-��ʼ (FS)';
            Gnt.plugin.DependencyEditor.prototype.startToStartText = '��ʼ-��ʼ (SS)';
            Gnt.plugin.DependencyEditor.prototype.endToEndText = '���-��� (FF)';
            Gnt.plugin.DependencyEditor.prototype.startToEndText = '��ʼ-��� (SF)';
    	  }
    	  if(Gnt.plugin.TaskContextMenu) {
            Ext.override(Gnt.plugin.TaskContextMenu, {
                texts : {
                    newTaskText : '�½�����',
                    newMilestoneText : '�½���̱�',
                    deleteTask : 'ɾ������',
                    editLeftLabel : '�༭����ǩ',
                    editRightLabel : '�༭�Ҳ��ǩ',
                    add : '���...',
                    deleteDependency : 'ɾ��������ϵ...',
                    addTaskAbove : '�Ϸ�����',
                    addTaskBelow : '�·�����',
                    addMilestone : '��̱�',
                    addSubtask : '������',
                    addSuccessor : '��������',
                    addPredecessor : 'ǰ������'
                }
            });    	  
        }
        if(Gnt.plugin.Printable) {
    	  } 
    }
    if (Gnt.feature) {
    	  if(Gnt.feature.DependencyDragDrop) {
            Gnt.feature.DependencyDragDrop.prototype.fromText = '��: <strong>{0}</strong> {1}<br/>',
            Gnt.feature.DependencyDragDrop.prototype.toText = '��: <strong>{0}</strong> {1}',
            Gnt.feature.DependencyDragDrop.prototype.startText = '��ʼ';
            Gnt.feature.DependencyDragDrop.prototype.endText = '���';
    	  }
    }
    if (Gnt.Tooltip) {
				Gnt.Tooltip.prototype.startText = "��ʼ: ";
				Gnt.Tooltip.prototype.endText = "���: ";
				Gnt.Tooltip.prototype.durationText = "����ʱ��:";
				Gnt.Tooltip.prototype.dayText = "d";
    }
    
    var M = Sch.preset.Manager;
    var vp = M.getPreset('hourAndDay');

    if (vp) {
        vp.displayDateFormat = 'g:i A';
        vp.headerConfig.middle.dateFormat = 'g A';
        vp.headerConfig.top.dateFormat = 'Y��m��d��';
    } 
    
    vp = M.getPreset('dayAndWeek');
    if (vp) {
        vp.displayDateFormat = 'm/d h:i A';
        vp.headerConfig.middle.dateFormat = 'Y��m��d��';
        vp.headerConfig.top.renderer = function(start, end, cfg) {
            var w = start.getWeekOfYear();
            return 'w.' + ((w < 10) ? '0' : '') + w + ' ' + Sch.util.Date.getShortMonthName(start.getMonth()) + ' ' + start.getFullYear();
        };
    } 

    vp = M.getPreset('weekAndDay');
    if (vp) {
        vp.displayDateFormat = 'm��d��';
        vp.headerConfig.bottom.dateFormat = 'm��d��';
        vp.headerConfig.middle.dateFormat = 'Y��m��d��';
        vp.headerConfig.middle.align = 'center';
    }
    
    vp = M.getPreset('weekAndMonth');
    if (vp) {
        vp.displayDateFormat = 'Y��m��d��';
        vp.headerConfig.middle.dateFormat = 'm��d��';
        vp.headerConfig.top.dateFormat = 'Y��m��d��';
    } 

    vp = M.getPreset('monthAndYear');
    if (vp) {
        vp.displayDateFormat = 'Y��m��d��';
        vp.headerConfig.middle.dateFormat = 'Y��m��';
        vp.headerConfig.top.dateFormat = 'Y��';
    } 

    vp = M.getPreset('year');
    if (vp.year) {
        vp.displayDateFormat = 'Y��m��d��';
        vp.headerConfig.bottom.renderer = function(start, end, cfg) {
            return Ext.String.format('{0}����', Math.floor(start.getMonth() / 3) + 1);
        };
        vp.headerConfig.middle.dateFormat = 'Y��';
    }
     
    vp = M.getPreset('weekAndDayLetter');
    if (vp) {
        vp.displayDateFormat = 'm��d��';
        vp.headerConfig.bottom.dateFormat = 'm��d��';
        vp.headerConfig.middle.dateFormat = 'Y��m��d��';
        vp.headerConfig.middle.align = 'center';
    }
    
    vp = M.getPreset('weekDateAndMonth');
    if (vp) {
        vp.displayDateFormat = 'Y��m��d��';
        vp.headerConfig.middle.dateFormat = 'd';
        vp.headerConfig.top.dateFormat = 'Y��m��';
        vp.headerConfig.top.align = 'center';
    }    
	Ext.Date.dayNames=['��','һ','��','��','��','��','��'];
	
	Ext.define("Gnt.column.DependenTask.Editor", {
		extend : "Ext.grid.CellEditor",
		alias : "widget.dependencytaskcolumneditor",
		constructor : function(a) {
			a = a || {};
			a.field = a.field || Ext.create("Ext.form.field.Text");
			this.callParent([ a ])
		},
		completeEdit : function(a) {
			vpGantt.setEditingDependencies(true);
			 this.callParent(arguments);
			 if(this.context.record.isModified('DependencyTask')){
				 var toId=this.context.record.get("Id"),fromId=this.context.record.get("DependencyTask"),type=2;
				 vpGantt.setDependency(fromId,toId,type);
				 this.context.record.commit();
			 }
			 vpGantt.setEditingDependencies(false);
		}
	});

	Ext.define("Gnt.column.DependencyTask", {
		extend : "Ext.grid.column.Column",
		alias : "widget.dependencytaskcolumn",
		requires : [ "Ext.form.field.Text", "Gnt.column.DependenTask.Editor" ],
		header : "DependencyTask",
		dataIndex : "DependencyTask",
		width : 80,
		//format : "0",
		align : "left",
		constructor : function(a) {
			a = a || {};
			a.editor = a.editor || Ext.create("Gnt.column.DependenTask.Editor");
			this.scope = this;
			this.callParent([ a ])
		}
	});


	Ext.define("Gnt.column.WorkLoad.Editor", {
		extend : "Ext.grid.CellEditor",
		alias : "widget.workloadcolumneditor",
		decimalPrecision : 2,
		context:null,
		constructor : function(a) {
			a = a || {};
			a.field =  Ext.create("Ext.form.field.Number", {
				decimalPrecision : 2
			});
			this.callParent([ a ])
		},
		startEdit : function(c, b, a) {
			this.context = a;
			//this.field.durationUnit = a.record.get("DurationUnit");
			return this.callParent(arguments);
		},
		completeEdit : function(a) {
			 vpGantt.setEditingWorkLoad(true);
			 this.callParent(arguments);
			 vpGantt.setEditingWorkLoad(false);
		}
	});

	Ext.define("Gnt.column.BaselineWorkLoad.Editor", {
		extend : "Ext.grid.CellEditor",
		alias : "widget.baselineworkloadeditor",
		decimalPrecision : 2,
		context:null,
		constructor : function(a) {
			a = a || {};
			a.field =Ext.create("Ext.form.field.Number", {
				decimalPrecision : 2
			});
			this.callParent([ a ])
		},
		startEdit : function(c, b, a) {
			this.context = a;
			return this.callParent(arguments);
		},
		completeEdit : function(a) {
			
			 this.callParent(arguments);
			 if(this.context.record.isModified('BaselineWorkLoad')){
			 	
				 //var toId=this.context.record.get("Id"),fromId=this.context.record.get("DependencyTask"),type=2;
				// vpGantt.setDependency(fromId,toId,type);
				// this.context.record.commit();
			 }
		}
	});
	
	
	Ext.define("Gnt.column.WorkLoad", {
		extend : "Ext.grid.column.Column",
		alias : "widget.workloadcolumn",
		requires : [ "Ext.form.field.Number", "Gnt.column.WorkLoad.Editor" ],
		header : "WorkLoad",
		dataIndex : "WorkLoad",
		//width : 40,
		//format : "0.00",
		align : "left",
		decimalPrecision : 2,
		constructor : function(a) {
			a = a || {};
			a.editor =Ext.create("Gnt.column.WorkLoad.Editor", {
				decimalPrecision : 2
			});
			this.scope = this;
			this.callParent([ a ])
		}
	});


	

	Ext.define("Gnt.column.BaselineWorkLoad", {
		extend : "Ext.grid.column.Column",
		alias : "widget.baselineworkloadcolumn",
		requires : [ "Ext.form.field.Number", "Gnt.column.BaselineWorkLoad.Editor" ],
		header : "BaselineWorkLoad",
		//dataIndex : "BaselineWorkLoad",
		//width : 40,
		//format : "0",
		align : "left",
		decimalPrecision : 2,
		constructor : function(a) {
			a = a || {};
			a.editor =Ext.create("Gnt.column.BaselineWorkLoad.Editor", {
				decimalPrecision : 2
			});
			this.scope = this;
			this.callParent([ a ])
		}
	});
	Ext.define("Gnt.column.BaselineStartDate",
			{
				extend : "Ext.grid.column.Date",
				alias : "widget.baselinestartdatecolumn",
				header : "BaselineStartDate",
				format : "Y-m-d",
				dataIndex : "BaselineStartDate",
				width : 100,
				align : "left",
				field : { 
					xtype : "datefield",
					format : "Y-m-d"
				},
				afterRender : function() {
					this.callParent(arguments);
					this.tree = this.ownerCt.up("treepanel");
					this.tree.on("edit", this.onTreeEdit, this)
				},
				onTreeEdit : function(b, a) {
					if (a.column instanceof this.self&& (a.value - a.originalValue !== 0)) {
						if(a.value==null){
							a.value = a.originalValue;
						}
						var baseend=a.record.get("BaselineEndDate");
						a.record.set({BaselineStartDate:a.value,BaselineEndDate:(baseend>a.value?baseend:a.value)});
					}
				}
			});
			
	Ext.define("Gnt.column.BaselineEndDate", {
		extend : "Ext.grid.column.Date",
		alias : "widget.baselineenddatecolumn",
		header : "BaselineEndDate",
		format : "Y-m-d",// H:i:s
		width : 100,
		align : "left",
		dataIndex : "BaselineEndDate",
		field : {
			xtype : "datefield",
			format : "Y-m-d"
		},
		constructor : function() {
			this.callParent(arguments);
			this.scope = this;
			this.renderer = this.rendererFunc
		},
		rendererFunc : function(b, c, a) {
			if (b) {
				//if(a.get("Duration")==0)
				//	b = Sch.util.Date.add(b, Sch.util.Date.MILLI, 1); //-----
				return Ext.util.Format.date(b, this.format)
			}
		},
		afterRender : function() {
			this.callParent(arguments);
			this.tree = this.ownerCt.up("treepanel");
			this.tree.on({
				edit : this.onTreeEdit,
				beforeedit : this.onBeforeTreeEdit,
				scope : this
			})
		},
		onBeforeTreeEdit : function(a) {
			if (a.column == this) {
			//	a.value = Sch.util.Date.add(a.value, Sch.util.Date.MILLI, -1)
			}
		},
		onTreeEdit : function(b, a) {
			//var c = Sch.util.Date.add(a.value, Sch.util.Date.DAY, 1);
			
			var c=a.value;
			if (a.column == this && c - a.originalValue !== 0) {
				if(a.value==null){
					a.value = a.originalValue;
				}
				//a.record.set({BaselineEndDate:a.value});
				//a.record.setEndDate(c, false)
				var basestart=a.record.get("BaselineStartDate");
				a.record.set({BaselineEndDate:a.value,BaselineStartDate:(basestart<a.value?basestart:a.value)});
			}
		}
	});	
	

	Ext.define("Gnt.column.RealStartDate",
			{
				extend : "Ext.grid.column.Date",
				alias : "widget.realstartdatecolumn",
				header : "RealStartDate",
				format : "Y-m-d",
				dataIndex : "RealStartDate",
				width : 100,
				align : "left",
				field : { 
					xtype : "datefield",
					format : "Y-m-d"
				},
				afterRender : function() {
					this.callParent(arguments);
					this.tree = this.ownerCt.up("treepanel");
					this.tree.on("edit", this.onTreeEdit, this)
				},
				onTreeEdit : function(b, a) {
					if (a.column instanceof this.self&& (a.value - a.originalValue !== 0)) {
						/*if(a.value==null){
							a.value = a.originalValue;
						}*/
						var baseend=a.record.get("RealEndDate");
						a.record.set({RealStartDate:a.value});
					}
					if(a.field=='RealStartDate'){
						if(!a.value){
							a.record.set('RealEndDate','');
							a.record.set('PercentDone',0);
						}else{
							if(a.record.get("RealEndDate")){
								var rs=a.value;
								var re=a.record.get("RealEndDate");
								a.record.set('RealEndDate',rs.getTime()>re.getTime()?rs:re);
							}
						}
					}
				}
			});
			
	Ext.define("Gnt.column.RealEndDate", {
		extend : "Ext.grid.column.Date",
		alias : "widget.realenddatecolumn",
		header : "RealEndDate",
		format : "Y-m-d",// H:i:s
		width : 100,
		align : "left",
		dataIndex : "RealEndDate",
		allowBlank:true,
		field : {
			xtype : "datefield",
			format : "Y-m-d"
		},
		constructor : function() {
			this.callParent(arguments);
			this.scope = this;
			this.renderer = this.rendererFunc
		},
		rendererFunc : function(b, c, a) {
			if (b) {
				//if(a.get("Duration")==0)
				//	b = Sch.util.Date.add(b, Sch.util.Date.MILLI, 1); //-----
				return Ext.util.Format.date(b, this.format)
			}
		},
		afterRender : function() {
			this.callParent(arguments);
			this.tree = this.ownerCt.up("treepanel");
			this.tree.on({
				edit : this.onTreeEdit,
				beforeedit : this.onBeforeTreeEdit,
				scope : this
			})
		},
		onBeforeTreeEdit : function(a) {
			if (a.column == this) {
			//	a.value = Sch.util.Date.add(a.value, Sch.util.Date.MILLI, -1)
			}
		},
		onTreeEdit : function(b, a) {
			//var c = Sch.util.Date.add(a.value, Sch.util.Date.DAY, 1);
			
			var c=a.value;
			if (a.column == this && c - a.originalValue !== 0) {
				/*if(a.value==null){
					a.value = a.originalValue;
				}*/
				//a.record.set({BaselineEndDate:a.value});
				//a.record.setEndDate(c, false)
				var basestart=a.record.get("RealStartDate");
				a.record.set({RealEndDate:a.value});
			}
			
			if(a.field=='RealEndDate'){
				if(!a.value){
					
					if(a.record.get('PercentDone')==100){
						a.record.set('PercentDone',99);
					}
					
				}else{
					if(!a.record.get("RealStartDate")){
						var re=a.value;
						var s=a.record.get("StartDate");
						a.record.set('RealStartDate',s.getTime()>re.getTime()?re:s);
					}else{
						var re=a.value;
						var rs=a.record.get("RealStartDate");
						a.record.set('RealStartDate',rs.getTime()>re.getTime()?re:rs);
						
					}
					a.record.set('PercentDone',100);
				}
			}
		}
	});	

	Ext.define("Gnt.column.VPDateColumn", {
		extend : "Ext.grid.column.Date",
		alias : "widget.vpdatecolumn",
		header : "Date",
		format : "Y-m-d",// H:i:s
		width : 100,
		align : "left",
		field : { 
			xtype : "datefield",
			format : "Y-m-d"
		},
		afterRender : function() {
			this.callParent(arguments);
			this.tree = this.ownerCt.up("treepanel");
			this.tree.on("edit", this.onTreeEdit, this)
		},
		onTreeEdit : function(b, a) {
			/*if (a.column instanceof this.self&& (a.value - a.originalValue !== 0)) {
				if(a.value==null){
					a.value = a.originalValue;
				}
				var baseend=a.record.get("RealEndDate");
				a.record.set({RealStartDate:a.value,RealEndDate:(baseend>a.value?baseend:a.value)});
			}*/
		}
	});
	
	
	
	Ext.define("Gnt.column.ComboBox.Editor", {
		extend : "Ext.grid.CellEditor",
		alias : "widget.vpcomboxeditor",
		context:null,
		constructor : function(a) {
			a = a || {};
			var comboxStore=vpGantt.getComboStore(a.colId);
			a.field =  Ext.create('Ext.form.ComboBox', {
			    store:comboxStore ,
			    queryMode: 'local',
			    displayField:'name',
			    valueField: 'val'
			});
			this.callParent([ a ])
		},
		startEdit : function(c, b, a) {
			this.context = a;
			return this.callParent(arguments);
		},
		completeEdit : function(a) {
			//		 vpGantt.setEditingWorkLoad(true);
			return  this.callParent(arguments);
			//		 vpGantt.setEditingWorkLoad(false);
			
		}
	});
	
	
	Ext.define("Gnt.column.ComboBoxColumn", {
		extend : "Ext.grid.column.Column",
		requires : ["Ext.form.ComboBox","Gnt.column.ComboBox.Editor" ],
		header : "comboxTest",
		align : "left",
		alias : "widget.vpcomboxcolumn",
		constructor : function(a) {
			a = a || {};
			a.editor =Ext.create("Gnt.column.ComboBox.Editor",{colId:a.dataIndex});
			this.scope = this;
			this.callParent([ a ])
		},
		renderer:function(v){
			try{
				return vpGantt.getComboRenderText(this.dataIndex,v);
			}catch(e){
				;
			}
			return v;
		}
	});
	
	
	Ext.define("Gnt.column.Number.Editor", {
		extend : "Ext.grid.CellEditor",
		alias : "widget.vpnumbereditor",
		context:null,
		constructor : function(a) {
			a = a || {};
			a.field =Ext.create("Ext.form.field.Number", {
				decimalPrecision : 2
			});
			this.callParent([ a ])
		},
		startEdit : function(c, b, a) {
			this.context = a;
			return this.callParent(arguments);
		},
		completeEdit : function(a) {
			return  this.callParent(arguments);
		}
	});
	
	
	Ext.define("Gnt.column.NumberColumn", {
		extend : "Ext.grid.column.Column",
		requires : ["Ext.form.field.Number","Gnt.column.Number.Editor" ],
		header : "",
		align : "right",
		alias : "widget.vpnumbercolumn",
		constructor : function(a) {
			a = a || {};
			a.editor =Ext.create("Gnt.column.Number.Editor");
			this.scope = this;
			this.callParent([ a ])
		},
		renderer:function(v){
			if(vpGantt.getTaskId()=='null'&&arguments[3]==0){
				return '';
			}else{
				return v;
			}
			v+='';
			var i=v.indexOf('.'),p,s;
			
			if(i>-1){
				p=v.substring(0,i);
				s=v.substring(i);
			}else{
				p=v;
				s='';
			}
			var l=p.length;
			if(l>3){
				var fi=l%3;
				var i,res=[],m=fi;
				if(fi!=0){
					res.push(p.substring(0,fi));
				}
				for(;m+3<l;m+=3){
					res.push(p.substring(m,m+3));
				}
				res.push(p.substring(m,l));
				return res.join(',')+s;
			}else{
				return v;
			}
			
		}
	});
	
	
	Ext.define("Gnt.column.String.Editor", {
		extend : "Ext.grid.CellEditor",
		alias : "widget.vpstringeditor",
		context:null,
		constructor : function(a) {
			a = a || {};
			a.field =  Ext.create('Ext.form.field.Text');
			this.callParent([ a ])
		},
		startEdit : function(c, b, a) {
			this.context = a;
			return this.callParent(arguments);
		},
		completeEdit : function(a) {
			return  this.callParent(arguments);
			
		}
	});
	
	
	Ext.define("Gnt.column.StringColumn", {
		extend : "Ext.grid.column.Column",
		requires : [ "Ext.form.field.Text", "Gnt.column.String.Editor" ],
		header : "",
		align : "left",
		alias : "widget.vpstringcolumn",
		constructor : function(a) {
			a = a || {};
			a.editor =Ext.create("Gnt.column.String.Editor");
			this.scope = this;
			this.callParent([ a ])
		},
		renderer:function(v){
			return v;
		}
	});
	
	
	
	
	/*vpGantt.refreshResIds=function(as,taskId){
		try{
			var task=vpGantt.gantt.getTaskStore().getById(taskId);
			var res=[];
			for(var i=0;i<as.length;i++){
				res.push(as[i].getResourceId()+'#'+as[i].getUnits());
			}

			task.setResIds(res.join(','));
			vpGantt.calcuWorkLoad(task);
		}catch(e){
			;
		}
		vpGantt.changeComponent.setOtherChanged(true);
	};*/
	vpGantt.refreshResIds=function(as,task){
		try{
			var res=[];
			for(var i=0;i<as.length;i++){
				var cur=as[i];
				res.push(cur.resId+'#'+cur.percent);
			}
			task.setResIds(res.join(','));
			vpGantt.calcuWorkLoad(task);
		}catch(e){
			;
		}
		vpGantt.changeComponent.setOtherChanged(true);
	};
	
	
	var treeStartEdit=Sch.plugin.TreeCellEditing.prototype.startEdit;
	Sch.plugin.TreeCellEditing.prototype.startEdit=function(a,f){
		try{
			if(a.parentNode.isRoot()&&vpGantt.getTaskId()=='null'){
				return;
			}
			if(vpGantt.getUECMap){
				var umap=vpGantt.getUECMap()||{};
				if(umap[f.dataIndex]){
					return ;
				}
			}
		}catch(e){
			;
		}
		treeStartEdit.apply(this,arguments);
	};
	
	
})();