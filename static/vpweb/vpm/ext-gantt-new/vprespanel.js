var vpResourceEditor={
	gridName:"treepanel",
	hiddenResColumn:'ResIds',
	loadTaskAssign:function(r){
		var me=this,resIds=r.get(this.hiddenResColumn),data=[],cache=this.resCache;
		if(resIds&&resIds.length>0){
			var rs=resIds.split(',');
			for(var i=0,l=rs.length;i<l;i++){
				var res=rs[i].split('#'),user=cache[res[0]];
				if(user){
					data.push({id:res[0],name:user.name||'',iconType:user.iconType,percent:res[1]});
				}
				
			}
		}
		me.assignStore.loadData(data);
		//me.assignGrid.doLayout();
		
	},
	overrideExt:function(){
		Ext.define("vp.field.Assignment", {
			extend: "Ext.form.field.Picker",
			alias: ["widget.vpassignmentfield", "widget.vpassignmenteditor"],
			alternateClassName: "vp.widget.VPAssignmentField",
			matchFieldWidth: false,
			editable: false,
			task: null,
			assignmentStore: null,
			resourceStore: null,
			gridConfig: null,
			formatString: "{0} [{1}%]",
			expandPickerOnFocus: true,
			afterRender: function() {
				this.callParent(arguments);
				this.on("expand", this.onPickerExpand, this);
				if (this.expandPickerOnFocus) {
					this.on("focus",
					function() {
						this.expand()
					},
					this)
				}
			},
			createPicker: function() {
				
				var a=vpResourceEditor.getPanel();
				a.field=this;
				return a;
			},
			setTask: function(a) {
				this.task = a
				vpResourceEditor.task=a;
			},
			
			onPickerExpand: function() {
				var rc=vpResourceEditor.resCombobox;
				rc.reset();
				//rc.clearValue();
				rc.doQuery(rc.allQuery, true);
				rc.inputEl.focus();
				try{
					jQuery('#search-res-td .x-boundlist-list-ct').get()[0].scrollTop=0;
				}catch(e){;}
				rc.focus();
				var a = this.resourceStore,
				b = this.picker;
				//b.loadTaskAssignments(this.task.getInternalId());
				vpGantt.resListPiker=b;
				vpGantt.resResourceStore=a;
				vpGantt.resEditTaskId=this.task.getInternalId();
				vpResourceEditor.loadTaskAssign(this.task);
				setTimeout(function(){rc.inputEl.focus();},200);
				return;
				
			},
			collapseIf: function(b) {
				return;
				var a = this;
				if (this.picker && !b.getTarget(".x-editor") && !b.getTarget(".x-menu-item")) {
					a.callParent(arguments)
				}
			},
			mimicBlur: function(b) {
				var a = this;
				if (!b.getTarget(".x-editor") && !b.getTarget(".x-menu-item")) {
					a.callParent(arguments)
				}
			},
			getDisplayValue: function(r) {
				var  resIds=r.get(vpResourceEditor.hiddenResColumn),str=[],cache=vpResourceEditor.resCache;
				if(resIds&&resIds.length>0){
					var rs=resIds.split(',');
					for(var i=0,l=rs.length;i<l;i++){
						var res=rs[i].split('#'),percent=parseFloat(res[1]),cur=cache[res[0]];
						if(cur){
							str.push((cur.name||'')+(percent==100?'':'['+percent+'%]'));
						}
						
					}
				}
				return str.join(',');
			}
		});
		
		
		
		Ext.define("vp.column.ResourceAssignment", {
			extend: "Ext.grid.column.Column",
			alias: "widget.vpresourceassignmentcolumn",
			requires: ["vp.field.Assignment"],
			text: "Assigned Resources",
			//tdCls: "sch-assignment-cell",
			showUnits: true,
			field: null,
			constructor: function(a) {
				a = a || {};
				var b = a.field || a.editor;
				delete a.field;
				delete a.editor;
				a.editor = b || {
					formatString: "{0}" + (this.showUnits ? " [{1}%]": "")
				};
				if (! (a.editor instanceof Ext.form.Field)) {
					a.editor = Ext.ComponentManager.create(a.editor, "vpassignmentfield")
				}
				a.field = a.editor;
				this.callParent([a]);
				this.scope = this
			},
			afterRender: function() {
				var a = this.up(vpResourceEditor.gridName);
				a.on("beforeedit",
				function(b, c) {
					if (this.field.setTask) {
						this.field.setTask(c.record)
					}
				},
				this);
				this.callParent(arguments)
			},
			renderer: function(b, c, r) {
				return this.field.getDisplayValue(r)
			}
		});

		
		
		Ext.define('vpResourceComboBox', {
			extend:Ext.form.field.ComboBox,
			initComponent: function() {
				var me = this;
				me.callParent();
				//wlt added
				var checkElInt=setInterval(function(){
					if(me.bodyEl){
						me.onFocus({});
						me.doQuery(me.allQuery, true);
			            me.inputEl.focus();
						//me.picker.realHide();

			            me.isExpanded;
			            vpResourceEditor.resPanel.hide();
						clearInterval(checkElInt);
						
					}
				},50);
			},
			createPicker: function() {
				var me = this,
	            picker,
	            pickerCfg = Ext.apply({
	                xtype: 'boundlist',
	                pickerField: me,
	                selModel: {
	                    mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
	                },
	                floating: true,
	                hidden: true,
	                store: me.store,
	                renderTo:'search-res-td',
	                displayField: me.displayField,
	                focusOnToFront: false,
	                pageSize: me.pageSize,
	                tpl: me.tpl
	            }, me.listConfig, me.defaultListConfig);

	        picker = me.picker = Ext.widget(pickerCfg);
	        if (me.pageSize) {
	            picker.pagingToolbar.on('beforechange', me.onPageChange, me);
	        }

	        me.mon(picker, {
	            //itemclick: me.onItemClick,
	            refresh: me.onListRefresh,
	            scope: me
	        });

	        me.mon(picker.getSelectionModel(), {
	            beforeselect: me.onBeforeSelect,
	            beforedeselect: me.onBeforeDeselect,
	          //  selectionchange: me.onListSelectionChange,
	            scope: me
	        });
				//picker.realHide=picker.hide;
				picker.hide=function(){};
				picker.un('itemclick');
				picker.on({itemclick:function(o, record, item, index, e, eOpts){
					vpResourceEditor.addSingleRes(record);
				}});
				vpResourceEditor.boundListPiker=picker;
				picker.on({highlightitem:function(v, record,eOpts){
					vpResourceEditor.highlightItem=picker.getRecord(record);
				}});
				return picker;
			}
		});
	},
	addSingleRes:function(record){
		var data={id:record.get('Id'),percent:record.get('Units'),name:record.get('Name'),iconType:record.get('IconType')};
		vpResourceEditor.assignStore.loadData([data],true);
	},
	showAddRes:true,
	showaddVirtualRes:true,
	set:function(name,func){
		this[name]=func;
	},
	updateTaskAssign:function(){
		
	},
	saveTaskAssignAbs:function(){
		var str=[];
		vpResourceEditor.assignStore.each(function(g) {
			var p = g.get('percent');
			if (p > 0) {
				str.push(g.get('id')+'#'+p);
			}
		});
		//alert(str.join(','));
		 vpResourceEditor.task.set('hiddenResColumn',str.join(','))
	},

	saveTaskAssign:function(){
		var e = vpResourceEditor.task.get('Id'),c = [];
		vpResourceEditor.assignStore.each(function(g) {
			var f = g.get('percent');
			if (f > 0) {
				c.push({taskId:e,resId:g.get('id'),percent:f});
			}
		});
		vpGantt.refreshResIds(c,vpResourceEditor.task);
	},
	okFunc:function(){
		
		var rc=vpResourceEditor.resCombobox;
		rc.reset();
		rc.doQuery(rc.allQuery, true);
		var field=this.resPanel.field;
		field.collapse();
		field.fireEvent("blur", field);
		setTimeout(function(){vpResourceEditor.saveTaskAssign()},10);
		
	},
	cancelFunc:function(){
		try{
			var field=this.resPanel.field;
			field.collapse();
			field.fireEvent("blur", field);
		}catch(e){
			;
		}
	},
	getResStore:function(){
		//alert('Please set the function \'setResstoreFunc()\'first!');
		return [];
	},
	addResText:'分配资源',
	assignedResTitle:'已分配资源',
	showPercent:true,
	initFrame:function(){
		var me=this;
		me.overrideExt();
		var config={
			cls:'res-edit-panel',
			width:385,
			height:195,
			renderTo:document.body,
			floating:true,
			frame: true,
			bodyPadding:0,
			html:'<table class="resource-table">'+
					'<tr><td class="res-td " id="search-res-td" style="border-left:1px solid #b5b8c8!important;border-top:1px solid #b5b8c8!important;border-right:1px solid #b5b8c8!important;"></td><td class="res-td "  style="border-left:1px solid #b5b8c8!important;border-top:1px solid #b5b8c8!important;border-right:1px solid #b5b8c8!important;"><div id="assigned-title">'+me.assignedResTitle+'</div></td></tr>'+
					'<tr><td class="res-td " style="border-right:1px solid #b5b8c8!important;border-left:1px solid #b5b8c8!important;border-bottom:1px solid #b5b8c8!important;"><div class="bombobox-holder"></div></td><td class="res-td" style="border-right:1px solid #b5b8c8!important;border-left:1px solid #b5b8c8!important;border-bottom:1px solid #b5b8c8!important;"><div class="selected-rs" id="sel-rs"></div></td></tr>'+
					'<tr><td class="res-td add-res-bt" id="addres-td" >'+
					(me.showAddRes?'&nbsp;<a  href="#" onclick="vpResourceEditor.addRes();"><img src="../../vpm/images/btn_addzy.gif"/>'+me.addResText+'</a>':'')+
					(me.showaddVirtualRes?'&nbsp;&nbsp;&nbsp;<a   href="#" onclick="vpResourceEditor.addVirtualRes();"><img src="../../vpm/images/btn_addxnzy.gif"/>锟斤拷锟斤拷锟斤拷源</a>':'')+
					'</td><td id="res-button-td" class="res-td" style="padding-top:1px;">'+
						'<div id="ok-res-win" style="float:left;"></div>'+
						'<div style="width:12px;float:left;">&nbsp;</div>'+
						'<div id="cancle-res-win" style="float:left;"><div/>'+
					'</td></tr>'+
				  '</table>'
		}
        me.resPanel=Ext.widget('panel',config);
		me.resPanel.hide();
		me.resPanel.loadTaskAssignments=function(){
			me.loadRes();
		};
		Ext.create('Ext.Button', {
		    text: '确定',
		    renderTo: 'ok-res-win',
			height:22,
			width:45,
		    handler: function() {
		      me.okFunc();
		    }
		});
		
		Ext.create('Ext.Button', {
		    text: '取消',
		    width:45,
			height:22,
		    renderTo: 'cancle-res-win',
		    handler: function() {
		    	me.cancelFunc();
		    }
		});

		return vpResourceEditor.buildContent();
	},
	buildContent:function(){
		var me=this;
		me.newResCmp();
		me.newAssignGrid();
		return  me.resPanel;
	},
	newResCmp:function(){
		var me=this;
		Ext.define('Resource', {
			extend: 'Ext.data.Model',
			fields: [
				{type: 'string', name: 'Id'},
				{type: 'string', name: 'Name'},
				{type: 'string', name: 'IconType'},
				{type: 'string', name: 'Units'}
			]
		});
		me.resourceStore=Ext.create('Ext.data.Store', {
	        autoDestroy: true,
	        model: 'Resource'//,
	       // data: ress
	    });
	    me.resCombobox = Ext.create('vpResourceComboBox', {
	        renderTo: 'search-res-td',
	        displayField: 'Name',
	        width: 160,
	        store: me.resourceStore,
	        enableKeyEvents:true,
	        queryMode: 'local',
			listConfig:{maxHeight:134,maxWidth:160,tpl : '<tpl for="."><div style="width:160px;overflow:hidden;" class="x-boundlist-item  <tpl if="xindex%2==0">zebra2</tpl>"><div class="reslist-icon{IconType}">{Name}</div></div></tpl>'},
	        typeAhead: false
	    });
	    me.resCombobox.on({keydown:function(f,e,c){
	    	if(e.getKey()==13){
	    		setTimeout(function(){
	    			me.resCombobox.inputEl.focus();
	    			if(vpResourceEditor.highlightItem){
	    				vpResourceEditor.addSingleRes(vpResourceEditor.highlightItem);
	    				//vpResourceEditor.boundListPiker.clearHightlight();
	    				vpResourceEditor.boundListPiker.deselect(vpResourceEditor.highlightItem);
	    			}
	    		},200);
	    	}
	    }});
	    //me.loadRes();
	},
	staticRes:[
	  		            {"Id":"1","Name":"Alabama","slogan":"The Heart of Dixie"}
			        ],
	resCache:{},
	resetResCache:function(data){
		var cache={};
		if(data&&data.length<1){
			;
		}else{
			for(var i=0,l=data.length;i<l;i++){
				var d=data[i];
				cache[d.Id]={name:d.Name,iconType:d.IconType};
			}
		}
		this.resCache=cache;
	},
	loadRes:function(pdata){
		var me=this;
		var data=me.getResStore();
		data=data.length>0?data:(pdata||[]);
		me.resetResCache(data);
		me.resourceStore.loadData(data);
		me.resourceStore.sort([
		                       	{
		         		                  property : 'IconType',
		         		                  direction: 'ASC'
		         		              }/*,
		         		              {
		         		                  property : 'Name',
		         		                  direction: 'ASC'
		         		              }*/
		         		          ]);
	},
	newAssignGrid:function(){
		var me=this;
		Ext.define('User', {
		    extend: 'Ext.data.Model',
		    fields: [
		       {name: 'percent', type: 'number'},
		       {name: 'id', type: 'string'},
		       {name: 'iconType', type: 'string'},
		       {name: 'name'}
		    ]
		});
		me.assignStore = Ext.create('Ext.data.Store', {
		        id: 'store',
		      //  data: createFakeData(10),
		        model: 'User',
		        proxy: {
		            type: 'memory'
		        }
		    });
		    /*me.assignStore.on('add',function(){
				alert(me.assignStore.getCount());
			});
			me.assignStore.on('remove',function(){
				alert(me.assignStore.getCount());
			});*/
			var assignStore =me.assignStore
			window.delR=function(id){
				assignStore.remove(assignStore.findRecord('id',id));
			};
		    me.assignGrid = Ext.create('Ext.grid.Panel', {
		        width: '100%',
		        height: '100%',
		        store: me.assignStore,
		        loadMask: false,
				overflowX:'hidden',
				plugins:['bufferedrenderer',new Ext.grid.plugin.CellEditing({clicksToEdit: 1})],
		        columns:[{
		            text: '',
					width:20,
					align:'left',
					tdCls:'assign-list-td',
					style:{
						paddingLef:'0px'
					},
					renderer:function(v,m,r,i){
						return '<a href="#" onclick="delR(\''+r.get('id')+'\')"><img src="../../vpm/vframe/images/btnIcon/btn_icon_delete.gif"></a>';
					}
		        },{
		            text: 'Name',
		            sortable: true,
		            dataIndex: 'name',
		            tdCls:'assign-list-td',
					flex:1,
					width:me.showPercent?126:190,
					maxWidth:me.showPercent?142:190,
					renderer:function(v,m,r,i){
						if(parseInt(r.get('iconType'))==1){
							m.tdCls = 'res-vir-icon';
						}else{
							m.tdCls = 'res-real-icon';
						}
						return v;
					}
		        },{
		            text: 'iconType',
		            sortable: true,
		            dataIndex: 'iconType',
		            tdCls:'assign-list-td',
					hidden:true
		        },{
		            text: 'Rating',
		            width: 50,
		            hidden:!me.showPercent,
		            sortable: true,
		            dataIndex: 'percent',
		            tdCls:'assign-list-td',
					align:'center',
					editor: {
		                    xtype: 'numberfield',
		                    allowBlank: false,
		                    minValue: 0
		                },
					renderer:function(v){
						return v+'%';
					}
		        }],
		        renderTo:'sel-rs'
		    });
		   // me.loadAssignGrid();
	},
	dynamicData:function(count){
	        var firstNames   = ['Ed', 'Tommy', 'Aaron', 'Abe', 'Jamie', 'Adam', 'Dave', 'David', 'Jay', 'Nicolas', 'Nige'],
	            lastNames    = ['Spencer', 'Maintz', 'Conran', 'Elias', 'Avins', 'Mishcon', 'Kaneda', 'Davis', 'Robinson', 'Ferrero', 'White'],
	            ratings      = [1, 2, 3, 4, 5];

	        var data = [];
	        for (var i = 0; i < (count || 25); i++) {
	            var ratingId    = Math.floor(Math.random() * ratings.length),
	                firstNameId = Math.floor(Math.random() * firstNames.length),
	                lastNameId  = Math.floor(Math.random() * lastNames.length),

	                rating      = ratings[ratingId],
	                name        = Ext.String.format("{0} {1}", firstNames[firstNameId], lastNames[lastNameId]);

	            data.push({
	                id: 'rec-' + i,
	                percent: rating,
	                name: name
	            });
	        }
	        return data;
	},
	loadAssignGrid:function(){
		var me=this;
		var data=me.dynamicData(10);
		me.assignStore.loadData(data);
	},
	getPanel:function(){
		return  this.resPanel;
	}
};


Ext.onReady(function() {
    var panel=vpResourceEditor.initFrame();
});
