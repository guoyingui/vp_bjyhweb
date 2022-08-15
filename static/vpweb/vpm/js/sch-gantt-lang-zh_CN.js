/**
 * @view
 * @comment English translations for the Scheduler && Gantt component
 * @component
 * @note To change locale for month/day names you have to use the Ext JS language pack. 
 * @author Qiao Jian
 */

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
})();