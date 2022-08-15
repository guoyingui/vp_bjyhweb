/**
 * @view GridTree
 * @comment GridTree
 * @component 
 */
Ext.override(Ext.data.HttpProxy,{
    onRead: function(action, o, response) {
		var result;
		try {
			result = o.reader.read(response);
		} catch(e) {
			this.fireEvent('loadexception', this, o, response, e);
			this.fireEvent('exception', this, 'response', action, o, response, e);
			o.request.arg.responseText=response.responseText;
			o.request.callback.call(o.request.scope, null, o.request.arg, false);
			return;
		}
		if (result.success === false) {
			this.fireEvent('loadexception', this, o, response);
			var res = o.reader.readResponse(action, response);
			this.fireEvent('exception', this, 'remote', action, o, res, null);
		} else {
			this.fireEvent('load', this, o, o.request.arg);
		}
		o.request.callback.call(o.request.scope, result, o.request.arg, result.success);
	}
});

NULL = undefined;
//var myMask;
GridTree = function(config){
	
	//config
	//列表渲染后调用
	if(config.afterRenderer){
		this.viewConfig.listeners = {refresh:config.afterRenderer};
	}
	config.autoLoad = false;
	this.config = config;
	Ext.apply(this, config);
	

	GridTree.superclass.constructor.call(this, config);
};

Ext.extend(GridTree, Ext.ux.maximgb.tg.GridPanel, {
    //language define
	locale: {
		
	},
	autoScroll: true,
	stripeRows: true,
	viewConfig : {
  		enableRowBody : true
  	},
  	enableColumnMove: true,
  	loadMask: true,
//  	enableColumnResize:false,   //false：禁止改变列宽  true：可以改变列宽
//  	layout: 'fit',
//  	height: 200,
//  	width: 900,
//  	viewConfig: {
//  		scrollDelay: false
//  	},
  	defaultParams: {},
    initComponent: function(){
	var cmList = [];
	var dsList = [];
	 
	//隐藏的div自动100%宽度，用于计算grid的款度
	if(document.getElementById("hidden_width") == NULL){
		var mydiv = document.createElement("div");
		mydiv.setAttribute("id","hidden_width");
		document.body.appendChild(mydiv);
	}
	
	var changeheigh=0;//重新设置高度
	if(this.changeheigh !=null){
		changeheigh=this.changeheigh;
	}
	//myMask = new Ext.LoadMask(Ext.getBody(), {msg:"正在加载数据..."});
	//if(this.myMask!=null){
	//	myMask.show();//显示正在加载的div
	//}
	//添加列
	for(var i=0;i<this.column.length;i++){
		var c = this.column[i];
		
		if(c.header != "hidden"){
			//ColumnModel列的定义
			var cmobj = new Object();
			
			//标题
			cmobj.header = c.header;
			//id
			cmobj.dataIndex = c.id;
			//自动展开的列id
			if(this.autoExpandColumn == c.id || this.master_column_id == c.id){
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
		
	}
	
	dsList.push({name: '_id', type: 'int'});
	dsList.push({name: '_parent', type: 'string'});
	dsList.push({name: '_is_leaf', type: 'bool'});
	
	var record = Ext.data.Record.create(dsList);
	
   	//数据源定义
   	var url=this.url;
  	this.store = new Ext.ux.maximgb.tg.AdjacencyListStore({
		reader: new Ext.data.JsonReader({
				totalProperty: 'totalProperty',
				id: '_id',
				root: 'root',
				successProperty: 'successProperty'
			}, record),
		proxy: new Ext.data.HttpProxy({url:url})
    });
    
    this.columns = cmList;
        	
	//grid的配置选项
	var pageSize=10;
	if(this.pageSize&&this.pageSize>0)
		pageSize=this.pageSize;

	
	if(this.hasPageingbar){
		this.bbar=new Ext.PagingToolbar({
            pageSize: pageSize,
            store: this.store,
            //displayInfo: true,
            displayMsg: 'Displaying da0ta {0} - {1} of {2}',
            emptyMsg: "No data to display",
            height:28
            
        });
		/*gridPanelConfig.bbar=new Ext.ux.maximgb.tg.PagingToolbar({
            pageSize: pageSize,
            store: ds,
            displayInfo: true,
            displayMsg: '显示第 {0}-{1} 条   共 {2}',
            emptyMsg: "没有数据"
        });*/
	}
	   
    //设置高度，没有高度时自动撑开
	if(this.height != NULL){
		if(this.height == '100%'){
			this.height = this.getBodyHeight()-changeheigh;
		}
	}
    //设置宽度，没有宽度时自动撑开
	if(this.width != NULL){
		if(this.width == '100%'){
			this.width = document.body.clientWidth;
		}
	}
	
	if(this.expand){
		this.store.on('load',function(store,record, options){
　　			this.store.expandAll();
		},this);
		this.store.on('reload',function(store,record, options){
　　			this.store.expandAll();
		},this);
	}
	
		var me = this;
    	var gridtree = this;
    	//window窗口改变大小时的宽度设置
    	if(window.addEventListener){ // Mozilla, Netscape, Firefox
			window.addEventListener('resize', function(){me.resize();}, false);
			/*
            window.addEventListener('resize', function(){
            	if(gridtree.config.width != NULL){
    				if(gridtree.config.width == '100%'){
    					gridtree.setWidth(document.getElementById("hidden_width").offsetWidth);
    				}
    			}
            	if(gridtree.config.height != NULL){
    				if(gridtree.config.height == '100%'){
    					gridtree.setHeight(gridtree.getBodyHeight()-changeheigh);
    				}
    			}

            }, false);
			*/
        } else { // IE
			window.attachEvent('resize', function(){me.resize();});
			/*
            window.attachEvent('onresize', function(){
            	if(gridtree.config.width != NULL){
    				if(gridtree.config.width == '100%'){
    					gridtree.setWidth(document.getElementById("hidden_width").offsetWidth);
    				}
    			}
            	if(gridtree.config.height != NULL){
    				if(gridtree.config.height == '100%'){
    					gridtree.setHeight(gridtree.getBodyHeight()-changeheigh);
    				}
    			}
            });
			*/
        }
        if(this.expandNodeEvent != NULL){
    	    this.store.on("expandnode",function(o,record){
    	    	this.expandNodeEvent(this.store.indexOf(record),record);
    	    }, this);
        }
    	
        GridTree.superclass.initComponent.call(this);
    },
    listeners: {
    	afterrender: function(){
    		if(this.afterrenderStoreLoaded)return;
        	if(!this.hasPageingbar){
        		this.store.load({
        			params: this.defaultParams,
        			callback : this.dsCallBack, 
        			scope: this
        		});
        	}else{
        		this.store.load({
        			params: Ext.apply({start:0, limit:this.pageSize}, this.defaultParams),    			
        			callback : this.dsCallBack, 
        			scope: this
        		});
        	}
        	this.afterrenderStoreLoaded = true;
    	}
    },
    dsCallBack: function(r, options, success) {
		if (success == false) {
			if(options.responseText.indexOf('系统session超时')!=-1){
				//alert("系统超时，操作失败，请重新登录后再次点击按钮操作！" );
				Common.showModalWin("/project/timeOutLogin.jsp", "login", 400, 120, function(res){});
			}else{
				alert("超时或被用户中止，列表加载失败");
			}
		}else{
			if(r != '' && r.length > 0){
				var msg = r[0].get('_errMessage');
				if(msg != '' && msg != NULL){
					alert("加载失败，请重新刷新页面.\n" + msg);
				}
			}
		}
	},
	load: function(urlStr, params){
    	if(urlStr != NULL){
    		this.store.proxy = new Ext.data.HttpProxy({url:urlStr});
    	}
    	var paramData = Ext.apply({}, params, this.defaultParams);
    	if(!this.hasPageingbar){
    		this.store.load({
    			params: paramData,
    			callback : this.dsCallBack, 
    			scope: this
    		});
    	}else{
    		this.store.load({
    			params: Ext.apply(paramData, {start:0, limit:this.pageSize}),    			
    			callback : this.dsCallBack, 
    			scope: this
    		});
    	}
	},
	reload: function(){
		this.store.reload();
	},
	getData: function(){
		var length = this.store.getCount();
		var str = "";
		var record = [];

		for(var i =0;i<length;i++){
			var row = this.store.getAt(i);
			
			record.push(row);
		}
		return record;
    },
    resize: function(){
    	this.setWidth(document.getElementById("hidden_width").offsetWidth);
		this.setHeight(this.getBodyHeight());
    },
    clearSelect: function(){
    	var linenum=this.getSelectionModel().lastActive;
    	this.getSelectionModel().deselectRow(linenum);
    },
    addRow: function(index,record){
		this.store.insert(index,record);
    },
	getSelectRow: function(){
		var linenum=this.getSelectionModel().lastActive;
    	return this.getData()[linenum]; 
    },
    getChildNode: function(record){
		return this.store.getNodeChildren(record);
    },
    getBodyHeight: function(){
    	var headObj = document.getElementById('headRegion');
    	var headObjHeight = 0;
    	var bodyHeight = document.body.clientHeight;
    	if(headObj != NULL){
    		headObjHeight = headObj.offsetHeight;
    	}
    	
    	bodyHeight = bodyHeight -  headObjHeight;
    	return bodyHeight;
    },
    selectRow: function(index){
    	this.getView().onRowSelect(index);
    },
    getStore: function(){
    	return this.store;
    }
});
//Ext.reg('GridTree', GridTree);

/**
 * @class BufferGridTreeView
 * @extends Ext.ux.maximgb.tg.GridView
 * @author Qiao Jian
 */
BufferGridTreeView = Ext.extend(Ext.ux.maximgb.tg.GridView, 
{       
	rowHeight : 22,
	borderHeight : 2,
	scrollDelay: 100,
	cacheSize: 10,
	cleanDelay: 500,
	lazyLoadTime: 1,
	lazyLoadNum: 100,
	isBuffered : true,
	
	constructor : function() {
		this.addEvents("togglerow");
		BufferGridTreeView.superclass.constructor.apply(this, arguments);
//		this.on("togglerow", this.update, this);
		this.on("togglerow", this.lazyUpdate, this);
	},
	
    initTemplates : function()
    {
        BufferGridTreeView.superclass.initTemplates.call(this);
        
		var ts = this.templates;
		ts.rowHolder = new Ext.Template(
				"<div class=\"x-grid3-row {alt}\" style=\"{tstyle};{display_style}\"></div>");
		ts.rowHolder.disableFormats = true;
		ts.rowHolder.compile();
		ts.rowBody = new Ext.Template(
				"<table class=\"x-grid3-row-table\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"{tstyle}\">",
				"<tbody><tr>{cells}</tr>",
				(this.enableRowBody ? "<tr class=\"x-grid3-row-body-tr\" style=\"{bodyStyle}\"><td colspan=\"{cols}\" class=\"x-grid3-body-cell\" tabIndex=\"0\" hidefocus=\"on\"><div class=\"x-grid3-row-body\">{body}</div></td></tr>"
						: ""), "</tbody></table>");
		ts.rowBody.disableFormats = true;
		ts.rowBody.compile();
    },

	getVisibleRowCount : function(){
		var rh = this.getCalculatedRowHeight(), 
			visibleHeight = this.scroller.dom.clientHeight;
		return (rh < 1) ? 0 : Math.ceil(visibleHeight / rh);
	},
	
	getStyleRowHeight : function(){
		return Ext.isBorderBox ? (this.rowHeight + this.borderHeight) : this.rowHeight;
	},

	getCalculatedRowHeight : function(){
		return this.rowHeight + this.borderHeight;
	},
	
	getVisibleRows: function(){
		var count = this.getVisibleRowCount(), 
			dataStore = this.ds, 
			sc = this.scroller.dom.scrollTop, 
			start = Math.max((sc === 0 ? 0 : Math.floor(sc/ this.getCalculatedRowHeight()) - 1), 0), 
			startCount = 0, 
			length = dataStore.getCount(), 
			dsCount = 0;
		while (startCount < start && dsCount < length) {
			if (dataStore.isVisibleNode(dataStore.getAt(dsCount)))
				startCount++;
			dsCount++;
		}
		start = dsCount;
		startCount = 0;
		count += 2;
		while (startCount < count && dsCount < length) {
			if (dataStore.isVisibleNode(dataStore.getAt(dsCount)))
				startCount++;
			dsCount++;
		}
		return {
			first : start,
			last : Math.min(dsCount, length - 1)
		};	
	},
	
    doRender : function(cs, rs, ds, startRow, colCount, stripe, onlyBody, visibleRows)
    { 	
        var ts = this.templates, 
        	ct = ts.cell, 
        	rt = ts.row, 
        	rb = ts.rowBody, 
        	last = colCount-1,
        	rh = this.getStyleRowHeight(),
		    vr = visibleRows?visibleRows:this.getVisibleRows(),
		    vrc = this.getVisibleRowCount(),
		    altCnt = 0, 
		    tstyle = 'width:'+this.getTotalWidth()+';height:'+rh+'px;';

        var buf = [], cb, c, p = {}, rp = {tstyle: tstyle}, r;
        for (var j = 0, len = rs.length; j < len; j++) {
            r = rs[j]; cb = [];
            var rowIndex = (j+startRow);
            var visible = rowIndex >= vr.first && rowIndex <= vr.last;
			var nodeVisible = ds.isVisibleNode(r);
            if(visible && nodeVisible){
                var row_render_res = this.renderRow(r, rowIndex, colCount, ds, this.cm.getTotalWidth());
                if (row_render_res === false) {
                    for (var i = 0; i < colCount; i++) {
                        c = cs[i];
                        p.id = c.id;
                        p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                        p.attr = p.cellAttr = "";
                        p.value = c.renderer.call(c.scope, r.data[c.name], p, r, rowIndex, i, ds);                              
                        p.style = c.style;
                        if(Ext.isEmpty(p.value)){
                            p.value = "&#160;";
                        }
                        if(this.markDirty && r.dirty && typeof r.modified[c.name] !== 'undefined'){
                            p.css += ' x-grid3-dirty-cell';
                        }
                        if (c.id == this.grid.master_column_id) {
    						var depth = ds.getNodeDepth(r);
    						p.treeui = this.renderCellTreeUI(r, ds, depth);
    						p.css += (" sch-gantt-tree-level-" + depth)+ (ds.isLeafNode(r) ? " sch-gantt-leaf-cell": " sch-gantt-parent-cell");
    						ct = ts.mastercell;
                        }
                        else {
                            ct = ts.cell;
                        }
                        cb[cb.length] = ct.apply(p);
                    }
                }
                else {
                    cb.push(row_render_res);
                }
            }
            var alt = [];
            if (!nodeVisible)
				rp.display_style = "display: none;";
			else {
				if (stripe && ((altCnt + 1) % 2 === 0))
					alt[0] = "x-grid3-row-alt";
				altCnt++;
				rp.display_style = "";
			}
            if (r.dirty) {
                alt[1] = " x-grid3-dirty-row";
            }
            rp.cols = colCount;
            if(this.getRowClass){
                alt[2] = this.getRowClass(r, rowIndex, rp, ds);
            }
            rp.alt = alt.join(" ");
            rp.cells = cb.join("");
            rp.level = ds.getNodeDepth(r);
            buf[buf.length] =  !(visible && nodeVisible) ? ts.rowHolder.apply(rp) : (onlyBody ? rb.apply(rp) : rt.apply(rp));
        }
        return buf.join("");
    },
    
	isRowRendered: function(index){
		var row = this.getRow(index);
		return row && row.childNodes.length > 0;
	},
	
	syncScroll: function(){
		BufferGridTreeView.superclass.syncScroll.apply(this, arguments);
		var top = this.scroller.getScroll().top;
		if (top !== this.lastScrollTop) {
			this.update();
			this.lastScrollTop = top;
		}
	},

	update: function(){
		if (this.scrollDelay) {
			if (!this.renderTask) {
				this.renderTask = new Ext.util.DelayedTask(this.doUpdate, this);
			}
			this.renderTask.delay(this.scrollDelay);
		}else{
			this.doUpdate();
		}
	},
    
    onRemove : function(ds, record, index, isUpdate){
        BufferGridTreeView.superclass.onRemove.call(this, ds, record, index, isUpdate);
        if(isUpdate !== true){
            this.update();
        }
    },
    
	doUpdate: function(){
		if (this.getVisibleRowCount() > 0) {
			var g = this.grid, 
            cm = g.colModel, 
            ds = g.store,
	        cs = this.getColumnData(),
	        vr = this.getVisibleRows(),
            row, record;
			var partnum = this.lazyLoadNum;
			var partcount = 0;
			var partstart = vr.first;
			var partend = vr.first+partnum-1;
			var count = vr.last-vr.first+1;
			
	        if(count>partnum && Ext.isIE){
				var lazytime = 0;
				do{
					this.lazyDoPartUpdate(partstart, partend, lazytime);
					partcount += partnum;
					partstart += partnum;
					partend += partnum;
					lazytime += this.lazyLoadTime;
				}while(count>partcount);
			}else{
				for (var i = vr.first; i <= vr.last; i++) {
					row = this.getRow(i);
					record = ds.getAt(i);
					if(!this.isRowRendered(i) && ds.isVisibleNode(record)){
						var html = this.doRender(cs, [ds.getAt(i)], ds, i, cm.getColumnCount(), g.stripeRows, true, vr);
						row.innerHTML = html;
					}
				}
				this.clean();
				if(!this.grid.loadMask){
					this.grid.loadMask = new Ext.LoadMask(this.grid.bwrap,
		                    Ext.apply({store:this.grid.store}, this.grid.loadMask));
				}
				this.grid.loadMask.hide();
			}
		}
	},
	
	doPartUpdate: function(start, end){
		var g = this.grid, 
        cm = g.colModel, 
        ds = g.store,
        cs = this.getColumnData(),
        vr = this.getVisibleRows(),
        row, record;
		end = (end>vr.last)?vr.last:end;
		for (var i = start; i <= end; i++) {
			row = this.getRow(i);
			record = ds.getAt(i);
			if(!this.isRowRendered(i) && ds.isVisibleNode(record)){
				var html = this.doRender(cs, [ds.getAt(i)], ds, i, cm.getColumnCount(), g.stripeRows, true, vr);
				row.innerHTML = html;
			}
		}
		if(end>=vr.last){ 
			this.clean();
			if(!this.grid.loadMask){
				this.grid.loadMask = new Ext.LoadMask(this.grid.bwrap,
	                    Ext.apply({store:this.grid.store}, this.grid.loadMask));
			}
			this.grid.loadMask.hide();
		}
	},
	
	lazyDoPartUpdate: function(start, end, lazytime){
		with (this) { setTimeout( function() {
			doPartUpdate(start, end) 
			}, lazytime );}
	},


	lazyUpdate: function(){
		with (this) { setTimeout( function() { update() }, lazyLoadTime );}
	},
	
	clean : function(){
		if(!this.cleanTask){
			this.cleanTask = new Ext.util.DelayedTask(this.doClean, this);
		}
		this.cleanTask.delay(this.cleanDelay);
	},

	doClean: function(){
		if (this.getVisibleRowCount() > 0) {
			var vr = this.getVisibleRows();
			vr.first -= this.cacheSize;
			vr.last += this.cacheSize;
			var i = 0, 
			rows = this.getRows();
			if(vr.first <= 0){
				i = vr.last + 1;
			}
			for(var len = this.ds.getCount(); i < len; i++){
				if ((i < vr.first || i > vr.last) && rows[i].innerHTML) {
					rows[i].innerHTML = '';
				}
			}
		}
	},
    
    removeTask: function(name){
        var task = this[name];
        if(task && task.cancel){
            task.cancel();
            this[name] = null;
        }
    },
    
    destroy : function(){
        this.removeTask('cleanTask');
        this.removeTask('renderTask');  
        BufferGridTreeView.superclass.destroy.call(this);
    },

	layout: function(){
		BufferGridTreeView.superclass.layout.call(this);
		this.update();
	},

	lazyExpandRow: function(start, end, record, lazytime){
		with (this) { setTimeout( function() {
			partExpandRow(start, end, record) 
			}, lazytime );}
	},
	
	partExpandRow: function(start, end, record){
		var ds = this.ds, i, len, row, pmel, children, index, child_index;
		children = ds.getNodeChildren(record);
		end = (end>children.length)?children.length:end;
		for (i = start; i < end; i++) {
            child_index = ds.indexOf(children[i]);
            row = this.getRow(child_index);
            row.style.display = 'block';
            if (ds.isExpandedNode(children[i])) {
                this.expandRow(child_index, true);
            }
        }
		if(end>=children.length){
//    		if (!skip_process)
    			this.processRows(0);
    		this.fireEvent("togglerow", this, record, true);
		}
	},
	
	expandRow : function(record, skip_process){
		var ds = this.ds, i, len, row, pmel, children, index, child_index;
		if (typeof record == "number") {
			index = record;
			record = ds.getAt(index);
		} else
			index = ds.indexOf(record);
		
		skip_process = skip_process || false;
		
		row = this.getRow(index);
		
		pmel = Ext.fly(row).child(".ux-maximgb-tg-elbow-active");
		if (pmel) {
            if (ds.hasNextSiblingNode(record)) {
                pmel.removeClass(this.collapsed_icon_class);
                pmel.removeClass(this.last_collapsed_icon_class);
                pmel.addClass(this.expanded_icon_class);
//                pmel.addClass(this.loading_class);
            }
            else {
                pmel.removeClass(this.collapsed_icon_class);
                pmel.removeClass(this.last_collapsed_icon_class);
                pmel.addClass(this.last_expanded_icon_class);
//                pmel.addClass(this.loading_class);
            }
		}
		
		if (ds.isLeafNode(record))
			return;
		children = ds.getNodeChildren(record);
		if(!children.length)
			return;

		if(!this.grid.loadMask){
			this.grid.loadMask = new Ext.LoadMask(this.grid.bwrap,
                    Ext.apply({store:this.grid.store}, this.grid.loadMask));
		}
		this.grid.loadMask.show();

		if (ds.isVisibleNode(record)) {
			var partnum = this.lazyLoadNum;
			var partcount = 0;
			var partstart = 0;
			var partend = partnum;
			var count = children.length;
			if(count>partnum && Ext.isIE){
				var lazytime = 0;
				do{
					this.lazyExpandRow(partstart, partend, record, lazytime);
					partcount += partnum;
					partstart += partnum;
					partend += partnum;
					lazytime += this.lazyLoadTime;
				}while(count>partcount);
			}else{
	            for (i = 0, len = children.length; i < len; i++) {
		              child_index = ds.indexOf(children[i]);
		              row = this.getRow(child_index);
		              row.style.display = 'block';
		              if (ds.isExpandedNode(children[i])) {
		                  this.expandRow(child_index, true);
		              }
		         }
			}
			if (!skip_process)
				this.processRows(0);
	
			this.fireEvent("togglerow", this, record, true);
		}
	},
	
	lazyCollapseRow: function(start, end, record, lazytime){
		with (this) { setTimeout( function() {
			partCollapseRow(start, end, record) 
			}, lazytime );}
	},
	
	partCollapseRow: function(start, end, record){
		var ds = this.ds, i, len, row, pmel, children, index, child_index;
		children = ds.getNodeChildren(record);
		end = (end>0)?end:0;
        for (i = (start-1); i > (end-1); i--) {
            child_index = ds.indexOf(children[i]);
            row = this.getRow(child_index);
            if (row.style.display != 'none') {
                row.style.display = 'none'; 
                this.collapseRow(child_index, true);
            }
        }
		if(end<=0){
//			if (!skip_process)
				this.processRows(0);
			this.fireEvent("togglerow", this, record, true);
		}
	},
	collapseRow : function(record, skip_process){
		var ds = this.ds, i, len, children, pmel, row, index, child_index;
		if (typeof record == "number") {
			index = record;
			record = ds.getAt(index)
		} else
			index = ds.indexOf(record);
		
		skip_process = skip_process || false;
		
		row = this.getRow(index);
		
		pmel = Ext.fly(row).child(".ux-maximgb-tg-elbow-active");
		if (pmel) {
            if (ds.hasNextSiblingNode(record)) {
                pmel.removeClass(this.expanded_icon_class);
                pmel.removeClass(this.last_expanded_icon_class);
//                pmel.addClass(this.loading_class);
                pmel.addClass(this.collapsed_icon_class);
            }
            else {
                pmel.removeClass(this.expanded_icon_class);
                pmel.removeClass(this.last_expanded_icon_class);
//                pmel.addClass(this.loading_class);
                pmel.addClass(this.last_collapsed_icon_class);
            }
		}
		
		if (ds.isLeafNode(record))
			return;
        children = ds.getNodeChildren(record);
        if(!children.length)
        	return;

		if(!this.grid.loadMask){
			this.grid.loadMask = new Ext.LoadMask(this.grid.bwrap,
                    Ext.apply({store:this.grid.store}, this.grid.loadMask));
		}
		this.grid.loadMask.show();
		var partnum = this.lazyLoadNum;
		var partcount = 0;
		var partstart = children.length;
		var partend = children.length - partnum;
		var count = children.length;
		if(count>partnum && Ext.isIE){
			var lazytime = 0;
			do{
				this.lazyCollapseRow(partstart, partend, record, lazytime);
				partcount += partnum;
				partstart -= partnum;
				partend -= partnum;
				lazytime += this.lazyLoadTime;
			}while(count>partcount);
		}else{
			for (i = 0, len = children.length; i < len; i++) {
	            child_index = ds.indexOf(children[i]);
	            row = this.getRow(child_index);
	            if (row.style.display != 'none') {
	                row.style.display = 'none'; 
	                this.collapseRow(child_index, true);
	            }
	        }
			if (!skip_process)
				this.processRows(0);
			this.fireEvent("togglerow", this, record, true);
		}
	}	
});
//Ext.reg('BufferGridTreeView', BufferGridTreeView);
/**
 * @class BufferGridTree
 * @extends Ext.ux.maximgb.tg.GridPanel
 * @author Qiao Jian
 */
NULL = undefined;
BufferGridTree = function(config){
	
	//config
	//列表渲染后调用
	if(config.afterRenderer){
		this.viewConfig.listeners = {refresh:config.afterRenderer};
	}
	config.autoLoad = false;
	this.config = config;
	Ext.apply(this, config);

	BufferGridTree.superclass.constructor.call(this, config);
};

Ext.extend(BufferGridTree, Ext.ux.maximgb.tg.GridPanel, {
    //language define
	locale: {
		
	},
	autoScroll: true,
	stripeRows: true,
	viewConfig : {
  		enableRowBody : true
  	},
  	enableColumnMove: true,
  	loadMask: true,
//  	layout: 'fit',
//  	height: 200,
//  	width: 900,
  	defaultParams: {},
    initComponent: function(){
//    	BLANK_IMAGE_URL = "project/images/default/s.gif";
//    	var ds;
    	var cmList = [];
    	var dsList = [];
    	//隐藏的div自动100%宽度，用于计算grid的款度
    	if(document.getElementById("hidden_width") == NULL){
    		var mydiv = document.createElement("div");
    		mydiv.setAttribute("id","hidden_width");
    		document.body.appendChild(mydiv);
    	}
    	
//    	if(this.loadMask == NULL){
//    		this.loadMask = true;
//    	}
    	var changeheigh=0;//重新设置高度
    	if(this.changeheigh !=null){
    		changeheigh=this.changeheigh;
    	}
    	//myMask = new Ext.LoadMask(Ext.getBody(), {msg:"正在加载数据..."});
    	//if(this.myMask!=null){
    	//	myMask.show();//显示正在加载的div
    	//}
    	//添加列
    	for(var i=0;i<this.column.length;i++){
    		var c = this.column[i];
    		if(c.header != "hidden"){
    			//ColumnModel列的定义
    			var cmobj = new Object();	
    			//标题
    			cmobj.header = c.header;
    			//id
    			cmobj.dataIndex = c.id;
    			//自动展开的列id
    			if(this.autoExpandColumn == c.id || this.master_column_id == c.id){
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
    		
    	}
    	dsList.push({name: '_id', type: 'int'});
    	dsList.push({name: '_parent', type: 'string'});
    	dsList.push({name: '_is_leaf', type: 'bool'});   	
    	var record = Ext.data.Record.create(dsList);
    	
       	//数据源定义
    	var url = this.url;
    	this.store = new Ext.ux.maximgb.tg.AdjacencyListStore({
    		reader: new Ext.data.JsonReader({
    				totalProperty: 'totalProperty',
    				id: '_id',
    				root: 'root',
    				successProperty: 'successProperty'
    			}, record),
    		proxy: new Ext.data.HttpProxy({
    			url: url
    		})
        });
//    	this.columns = this.column;
    	this.columns = cmList;
//        this.store = ds;
    	//grid的配置选项
    	var pageSize=10;
    	if(this.pageSize&&this.pageSize>0)
    		pageSize=this.pageSize;
    	
//    	
//    	var gridPanelConfig = {
////    		      trackMouseOver: false,
//          	renderTo: this.renderTo,//html元素，用于显示Grid
//          	store: ds,//数据源
//          	//width: document.body.clientWidth,
//          	//height: getBodyHeight(),
//          	autoScroll: true,
//          	enableColumnMove:this.enableColumnMove,//拖拽列（不设置时默认允许拖拽）   add by liujie
//          	columns: cmList,//ColumnModel定义
//          	stripeRows: true,//让grid相邻两行背景色不同
//          	loadMask: this.loadMask,//是否显示加载动画
//          	viewConfig : {
//          		enableRowBody : true
//          	}
//    	};
    	
    	if(this.hasPageingbar){
    		this.bbar=new Ext.PagingToolbar({
                pageSize: pageSize,
                store: this.store,
                //displayInfo: true,
                displayMsg: 'Displaying da0ta {0} - {1} of {2}',
                emptyMsg: "No data to display",
                height:28
                
            });
    		/*gridPanelConfig.bbar=new Ext.ux.maximgb.tg.PagingToolbar({
                pageSize: pageSize,
                store: ds,
                displayInfo: true,
                displayMsg: '显示第 {0}-{1} 条   共 {2}',
                emptyMsg: "没有数据"
            });*/
    	}
    	
    	//有自动展开列时设置
//    	if(this.autoExpandColumn != NULL){
//    		gridPanelConfig.autoExpandColumn = this.autoExpandColumn;
//    	}
    	//允许拖拽时设置     add by liujie
//    	if(this.enableColumnMove != NULL){
//    		gridPanelConfig.enableColumnMove = this.enableColumnMove;
//    	}else{
//    		gridPanelConfig.enableColumnMove = true;//默认为可以拖拽
//    	}
    	//树视图节点列的ID
//    	if(this.master_column_id != NULL){
//    		gridPanelConfig.master_column_id = this.master_column_id;
//    	}
        
        //设置高度，没有高度时自动撑开
    	if(this.height != NULL){
    		if(this.height == '100%'){
    			this.height = this.getBodyHeight()-changeheigh;
//    		}else{
//    			this.height = this.height;
    		}
    	}
        //设置宽度，没有宽度时自动撑开
    	if(this.width != NULL){
    		if(this.width == '100%'){
    			this.width = document.body.clientWidth;
//    		}else{
//    			this.width = this.width;
    		}
    	}
    	
    	if(this.expand){
    		this.store.on('load',function(store,record, options){
    　　			this.store.expandAll();
    		},this);
    		this.store.on('reload',function(store,record, options){
    　　			this.store.expandAll();
    		},this);
    	}
    	
//    	if(!this.hasPageingbar){
//    		this.store.load({
//    			callback : this.dsCallBack, 
//    			scope: this
//    		});
//    	}else{
//    		this.store.load({
//    			params:{start:0, limit:pageSize},    			
//    			callback : this.dsCallBack, 
//    			scope: this
//    		});
//    	}
		var me = this;
    	var gridtree = this;
    	//window窗口改变大小时的宽度设置
    	if(window.addEventListener){ // Mozilla, Netscape, Firefox
			window.addEventListener('resize', function(){me.resize();}, false);
			/*
            window.addEventListener('resize', function(){
            	if(gridtree.config.width != NULL){
    				if(gridtree.config.width == '100%'){
    					gridtree.setWidth(document.getElementById("hidden_width").offsetWidth);
    				}
    			}
            	if(gridtree.config.height != NULL){
    				if(gridtree.config.height == '100%'){
    					gridtree.setHeight(gridtree.getBodyHeight()-changeheigh);
    				}
    			}

            }, false);
			*/
        } else { // IE
			window.attachEvent('resize', function(){me.resize();});
			/*
            window.attachEvent('onresize', function(){
            	if(gridtree.config.width != NULL){
    				if(gridtree.config.width == '100%'){
    					gridtree.setWidth(document.getElementById("hidden_width").offsetWidth);
    				}
    			}
            	if(gridtree.config.height != NULL){
    				if(gridtree.config.height == '100%'){
    					gridtree.setHeight(gridtree.getBodyHeight()-changeheigh);
    				}
    			}
            });
			*/
        }
        if(this.expandNodeEvent != NULL){
    	    this.store.on("expandnode",function(o,record){
    	    	this.expandNodeEvent(this.store.indexOf(record),record);
    	    }, this);
        }
    	
        BufferGridTree.superclass.initComponent.call(this);
    },
    getView : function()
    {
        if (!this.view) {
            this.view = new BufferGridTreeView(this.viewConfig);
        }
        return this.view;
    },
    listeners: {
    	afterrender: function(){
    		if(this.afterrenderStoreLoaded) return;
        	if(!this.hasPageingbar){
        		this.store.load({
        			params:this.defaultParams,
        			callback : this.dsCallBack, 
        			scope: this
        		});
        	}else{
        		this.store.load({
        			params: Ext.apply({start:0, limit:this.pageSize}, this.defaultParams), 		
        			callback : this.dsCallBack, 
        			scope: this
        		});
        	}
        	this.afterrenderStoreLoaded = true;
    	}
    },
    dsCallBack: function(r, options, success) {
		if (success == false) {
			if(options.responseText.indexOf('系统session超时')!=-1){
				//alert("系统超时，操作失败，请重新登录后再次点击按钮操作！" );
				Common.showModalWin("/project/timeOutLogin.jsp", "login", 400, 120, function(res){});
			}else{
				alert("超时或被用户中止，列表加载失败");
			}
		}else{
			if(r != '' && r.length > 0){
				var msg = r[0].get('_errMessage');
				if(msg != '' && msg != NULL){
					alert("加载失败，请重新刷新页面.\n" + msg);
				}
			}
		}
		//if(myMask!=null||myMask!='undefined'){
		//	myMask.hide();
		//}
	},
	load: function(urlStr, params){
    	if(urlStr != NULL){
    		this.store.proxy = new Ext.data.HttpProxy({url:urlStr});
    	}
    	var paramData = Ext.apply({}, params, this.defaultParams);
    	if(!this.hasPageingbar){
    		this.store.load({
    			params: paramData,
    			callback : this.dsCallBack, 
    			scope: this
    		});
    	}else{
    		this.store.load({
    			params: Ext.apply(paramData, {start:0, limit:this.pageSize}),
    			callback : this.dsCallBack, 
    			scope: this
    		});
    	}
	},
	reload: function(){
		this.store.reload();
	},
	getData: function(){
		var length = this.store.getCount();
		var str = "";
		var record = [];

		for(var i =0;i<length;i++){
			var row = this.store.getAt(i);
			
			record.push(row);
		}
		return record;
    },
    resize: function(){
    	this.setWidth(document.getElementById("hidden_width").offsetWidth);
		this.setHeight(this.getBodyHeight());
    },
    clearSelect: function(){
    	var linenum=this.getSelectionModel().lastActive;
    	this.getSelectionModel().deselectRow(linenum);
    },
    addRow: function(index,record){
		this.store.insert(index,record);
    },
    getChildNode: function(record){
		return this.store.getNodeChildren(record);
    },
    getBodyHeight: function(){
    	var headObj = document.getElementById('headRegion');
    	var headObjHeight = 0;
    	var bodyHeight = document.body.clientHeight;
    	if(headObj != NULL){
    		headObjHeight = headObj.offsetHeight;
    	}
    	
    	bodyHeight = bodyHeight -  headObjHeight;
    	return bodyHeight;
    }
});
//Ext.reg('BufferGridTree', BufferGridTree);

NewGridTree = function(config, nums){
	if (nums==NULL||nums<200) {
		return new GridTree(config);
	} else {
		return new BufferGridTree(config);
    }
};

(function(){
		document.write('<style id="btn-css" type="text/css">'+
						'.x-panel-bbar .x-toolbar{padding:3px 0px 3px 0px !important; }'+
						'.x-toolbar-cell .x-btn-text{font-size:0px !important;height:15px !important;}'+
						'</style>');
})();
