

( function() {
	  if (Sch.util && Sch.util.Date) {
				Ext.apply(Sch.util.Date, {
						getReadableNameOfUnit : function(unit, v) {
							switch (unit.toLowerCase()) {
							case this.YEAR:
								return v ? "年" : "年";
							case this.QUARTER:
								return v ? "季度" : "季度";
							case this.MONTH:
								return v ? "月" : "月";
							case this.WEEK:
								return v ? "星期" : "星期";
							case this.DAY:
								return v ? "天" : "天";
							case this.HOUR:
								return v ? "小时" : "小时";
							case this.MINUTE:
								return v ? "分钟" : "分钟";	
							case this.SECOND:
								return "秒";
							case this.MILLI:
								return "毫";
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
            Sch.plugin.CurrentTimeLine.prototype.tooltipText = '当前时间';
    	  }
    }
    if (Sch.plugin) {
    	  if(Gnt.plugin.DependencyEditor) {
            Gnt.plugin.DependencyEditor.prototype.fromText = '前置任务';
            Gnt.plugin.DependencyEditor.prototype.toText = '后续任务';
            Gnt.plugin.DependencyEditor.prototype.typeText = '链接类型';
            Gnt.plugin.DependencyEditor.prototype.lagText = '滞后时间';
            Gnt.plugin.DependencyEditor.prototype.endToStartText = '完成-开始 (FS)';
            Gnt.plugin.DependencyEditor.prototype.startToStartText = '开始-开始 (SS)';
            Gnt.plugin.DependencyEditor.prototype.endToEndText = '完成-完成 (FF)';
            Gnt.plugin.DependencyEditor.prototype.startToEndText = '开始-完成 (SF)';
    	  }
    	  if(Gnt.plugin.TaskContextMenu) {
            Ext.override(Gnt.plugin.TaskContextMenu, {
                texts : {
                    newTaskText : '新建任务',
                    newMilestoneText : '新建里程碑',
                    deleteTask : '删除任务',
                    editLeftLabel : '编辑左侧标签',
                    editRightLabel : '编辑右侧标签',
                    add : '添加...',
                    deleteDependency : '删除依赖关系...',
                    addTaskAbove : '上方任务',
                    addTaskBelow : '下方任务',
                    addMilestone : '里程碑',
                    addSubtask : '子任务',
                    addSuccessor : '后续任务',
                    addPredecessor : '前置任务'
                }
            });    	  
        }
        if(Gnt.plugin.Printable) {
    	  } 
    }
    if (Gnt.feature) {
    	  if(Gnt.feature.DependencyDragDrop) {
            Gnt.feature.DependencyDragDrop.prototype.fromText = '从: <strong>{0}</strong> {1}<br/>',
            Gnt.feature.DependencyDragDrop.prototype.toText = '到: <strong>{0}</strong> {1}',
            Gnt.feature.DependencyDragDrop.prototype.startText = '开始';
            Gnt.feature.DependencyDragDrop.prototype.endText = '完成';
    	  }
    }
    if (Gnt.Tooltip) {
				Gnt.Tooltip.prototype.startText = "开始: ";
				Gnt.Tooltip.prototype.endText = "完成: ";
				Gnt.Tooltip.prototype.durationText = "持续时间:";
				Gnt.Tooltip.prototype.dayText = "d";
    }
    
    var M = Sch.preset.Manager;
    var vp = M.getPreset('hourAndDay');

    if (vp) {
        vp.displayDateFormat = 'g:i A';
        vp.headerConfig.middle.dateFormat = 'g A';
        vp.headerConfig.top.dateFormat = 'Y年m月d日';
    } 
    
    vp = M.getPreset('dayAndWeek');
    if (vp) {
        vp.displayDateFormat = 'm/d h:i A';
        vp.headerConfig.middle.dateFormat = 'Y年m月d日';
        vp.headerConfig.top.renderer = function(start, end, cfg) {
            var w = start.getWeekOfYear();
            return 'w.' + ((w < 10) ? '0' : '') + w + ' ' + Sch.util.Date.getShortMonthName(start.getMonth()) + ' ' + start.getFullYear();
        };
    } 

    vp = M.getPreset('weekAndDay');
    if (vp) {
        vp.displayDateFormat = 'm月d日';
        vp.headerConfig.bottom.dateFormat = 'm月d日';
        vp.headerConfig.middle.dateFormat = 'Y年m月d日';
        vp.headerConfig.middle.align = 'center';
    }
    
    vp = M.getPreset('weekAndMonth');
    if (vp) {
        vp.displayDateFormat = 'Y年m月d日';
        vp.headerConfig.middle.dateFormat = 'm月d日';
        vp.headerConfig.top.dateFormat = 'Y年m月d日';
    } 

    vp = M.getPreset('monthAndYear');
    if (vp) {
        vp.displayDateFormat = 'Y年m月d日';
        vp.headerConfig.middle.dateFormat = 'Y年m月';
        vp.headerConfig.top.dateFormat = 'Y年';
    } 

    vp = M.getPreset('year');
    if (vp.year) {
        vp.displayDateFormat = 'Y年m月d日';
        vp.headerConfig.bottom.renderer = function(start, end, cfg) {
            return Ext.String.format('{0}季度', Math.floor(start.getMonth() / 3) + 1);
        };
        vp.headerConfig.middle.dateFormat = 'Y年';
    }
     
    vp = M.getPreset('weekAndDayLetter');
    if (vp) {
        vp.displayDateFormat = 'm月d日';
        vp.headerConfig.bottom.dateFormat = 'm月d日';
        vp.headerConfig.middle.dateFormat = 'Y年m月d日';
        vp.headerConfig.middle.align = 'center';
    }
    
    vp = M.getPreset('weekDateAndMonth');
    if (vp) {
        vp.displayDateFormat = 'Y年m月d日';
        vp.headerConfig.middle.dateFormat = 'd';
        vp.headerConfig.top.dateFormat = 'Y年m月';
        vp.headerConfig.top.align = 'center';
    }    
	Ext.Date.dayNames=['日','一','二','三','四','五','六'];
	
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
			return v;
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
	
	
	
	
	vpGantt.refreshResIds=function(as,taskId){
		;
	};
	
	
	
	var treeStartEdit=Sch.plugin.TreeCellEditing.prototype.startEdit;
	Sch.plugin.TreeCellEditing.prototype.startEdit=function(a,f){
		
		treeStartEdit.apply(this,arguments);
	};
	
	
})();