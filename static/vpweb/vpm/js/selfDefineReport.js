
Ext.ux.maximgb.tg.GridView.prototype.getStripeClsGroup=function(toggle){
	var me=this;
	if(toggle){
		if(!me.groupStripeCls||me.groupStripeCls=='vp-group-stripe-weight'){
			me.groupStripeCls=' ';
		}else{
			me.groupStripeCls='vp-group-stripe-weight';
		}
	}
	return me.groupStripeCls;
};
Ext.ux.maximgb.tg.GridView.prototype.getStripeClsByLevel=function(level){
	return '  vp-tree-level-'+level;
};
Ext.ux.maximgb.tg.GridView.prototype.doRender=function(cs, rs, ds, startRow, colCount, stripe)
{
    var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount-1;
    var tstyle = 'width:'+this.getTotalWidth()+';';
    var buf = [], cb, c, p = {}, rp = {tstyle: tstyle}, r;
    for (var j = 0, len = rs.length; j < len; j++) {
        r = rs[j]; cb = [];
        var rowIndex = (j+startRow);
        
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
                // ----- Modification start
                if (c.id == this.grid.master_column_id) {
                    p.treeui = this.renderCellTreeUI(r, ds);
                    ct = ts.mastercell;
                }
                else {
                    ct = ts.cell;
                }
                // ----- End of modification
                var leaf=r.data['_is_leaf'];
                if(leaf){           
                	cb[cb.length] = ct.apply(p);
                }else{
                	p.style=tstyle;
                	p.css+=' '+this.skip_width_update_class;
                	cb[cb.length] = ct.apply(p);
                	break;
                }
                
            }
        }else {
            cb.push(row_render_res);
        }
        
        var alt = [];/*,noParent=r.data['_parent'],noParent=(noParent==undefined||noParent==null||noParent=='null'||noParent=='');
        alt[3] =this.getStripeCls(noParent);*/
        if (r.dirty) {
            alt[1] = " x-grid3-dirty-row";
        }
        rp.cols = colCount;
        if(this.getRowClass){
            alt[2] = this.getRowClass(r, rowIndex, rp, ds);
        }
        rp.alt = alt.join(" ");
        rp.cells = cb.join("");
        // ----- Modification start
        if (!ds.isVisibleNode(r)) {
            rp.display_style = 'display: none;';
        }
        else {
            rp.display_style = '';
        }
        rp.level = ds.getNodeDepth(r);
        rp.alt+=this.getStripeClsByLevel(rp.level)
        // ----- End of modification
        buf[buf.length] =  rt.apply(rp);
    }
    return buf.join("");
};

//2013-09-02 自定义报表 chrome下宽度 
Ext.override(Ext.grid.GridView,{
   getColumnWidth: function(col) {
	   var w;
	   if(Ext.isChrome){
		   w = this.cm.getColumnWidth(col)-2;
       }else{
    	   w = this.cm.getColumnWidth(col);
       }
       if (Ext.isNumber(w)) {
           return (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2) ? w: (w - this.borderWidth > 0 ? w - this.borderWidth: 0)) + 'px';
       }
       return w;
   }
});

var SelfReportDriver={
		panelTitleHeight:0,
		chartHeight:300,
		tipHeight:35,
		drillPanelTitleHeight:25,
		headerHeight:24,
		gridHeight:0,
		pageingbarHeight:26,
		scrollbarHeight:25,
		rowHeight:24,
		chartWidth:document.body.scrollWidth,
		outPanelDis:10,
		drillPara:'',
		entityId:1,
		drillDown:0,
		legendColNum:7,
		legendWidth:70,
		legendHeight:30,
		chartMargin:50,
		getOpenUrl:function(id,name){
			var url= '/project/vframe/openWindowAction.do?winTitle=项目&topFrame=objTitle=项目名称;objName={objectName};objType=基本信息;objIcon=open_manager.gif&leftFrame=fileName=pjinfos;projectID={objectId};selectItemID=20;objectID=1;workItemID={objectId};loadextramenu=1;display=1;start=1;limit=50;rtype=1;iid={objectId};eid=1&rightFrame=/project/wbs/projectManageMenuAction.do?projectID={objectId};projectName={objectName};typeID=1;parentID=0';
			url=url.replace(/{objectId}/g,id);
			url=url.replace(/{objectName}/g,name);
			return url;
		},
		cfg:null,
		layout:{
			piechartDrillDown:'piechartDrillDown',
			columnchartDrillDown:'columnchartDrillDown',
			bubblechartDirllDown:'bubblechartDirllDown',
			simpleGrid:'simpleGrid'
		},
		setCfg:function(cfg){
			var me=this;
			this.cfg=cfg;
			this.setChartCfg(cfg.chart);
			this.setGridCfg(cfg.grid);
		},
		setGridCfg:function(cfg){
			if(cfg){
				this.gridcfg=cfg;
			}
			
		},
		resetGridWidth:function(width){
			if(!width){
				width=document.body.clientWidth;
			}
			if(width<50){
				return ;
			}
			var me=this;
			if(me.grid){
				jQuery('#grid-div').width(width);
	    		jQuery('#grid-td').width(width);
	    		jQuery('#grid-tr').width(width);
	    		jQuery('#grid-table').width(width);
	    		jQuery('#main-div').width(width);
	    		setTimeout(function(){
	    			me.grid.setWidth(width);
	    		},100);
			}
			if(me.chartcfg){
				jQuery('#main-div').width(width);
				if(!me.grid){
					jQuery('#tip-td').width(width);
					jQuery('#tip-tr').width(width);
				}
				jQuery('#chart-div').width(width);
	    		jQuery('#chart-td').width(width);
	    		jQuery('#chart-tr').width(width);
	    		if(me.chart){
	    			me.chart.invalidateSize()
	    		}
				
				
				
			}
			
		},
		
		setCondition:function(condition){
				var me=this;
				me.condition=condition;
				parent.condition=condition;
				setTimeout(function(){
					window.location.reload();
				},100);
				
		},
		setChartCfg:function(cfg){
			if(cfg){
				this.chartcfg=cfg;
				this.hideGrid();
			}else{
				this.hideChart();
			}
		},
		setReportSize:function(){
			var me=this;
			me.calcuComponentsSize();
			me.setChartSize();
			me.setGridHeight();
			me.setPanelHeight();
		},
		init:function(id,position,cfg){
			this.setReportId(id);
			this.setPosition(position,cfg);
			
			this.genReport(cfg);
		},
		getLegenIncrementHeight:function(num){
			var me=this;
			if(!me.preDataLength){
				me.preDataLength=0;
			}
			num-=me.preDataLength;

			var me=this;
			var width=me.chartWidth-me.chartMargin;
			var rowCols=width/me.legendWidth;
			if(rowCols>me.legendColNum){
				rowCols=me.legendColNum;
			}
			var rows=num/rowCols;
			return me.legendHeight*(Math.floor(rows));
		},
		getIncrementSize:function(){
			var me=this,width=0,height=0;
			if(!me.chartcfg){
				width= 0;
			}else{
				if(me.drillDown==0){
					if(me.chartcfg.type=='pie'){
						var xAxis=me.chartcfg.xAxis,curData=me.curData;
						/*for(var i=0;i<curData.length;i++){
							var curLength=curData[i][xAxis].length;
							if(curLength>width){
								width=curLength;
							}
						}
						width*=14*2;
						width+=600;*/
						height+=me.getLegenIncrementHeight(curData.length);
					}else if(me.chartcfg.type=='column'){
						var xAxis=me.chartcfg.xAxis,curData=me.curData;
						for(var i=0;i<curData.length;i++){
							var curLength=curData[i][xAxis].length;
							if(curLength>width){
								width=curLength;
							}
						}
						width=width>10?(width-10)*14*(Math.sqrt(2)/2):width;
						height=width;
						height+=me.getLegenIncrementHeight(me.chartcfg.yAxis.length);
					}else if(me.chartcfg.type=='bubble'){
						width= 0;
						height+=me.getLegenIncrementHeight(me.chartcfg.valueAxis.length);
					}
				}
				
			}
			return {width:0,height:height};
		},
		calcuComponentsSize:function(){
			var me=this;
			if(me.drillDown==1)
				return;
			var size=me.getIncrementSize(),bodyWidth=document.body.scrollWidth,width=me.chartWidth+size.width;
			//me.commonWidth=(width>bodyWidth?width:bodyWidth);
			me.commonWidth=width;
			me.chartWidth=me.commonWidth;
			me.chartHeight+=size.height;
			if(size.width<1){
				jQuery('#main-div').css({'overflow-x':'hidden'});
			}
		},
		hideGrid:function(){
			var me=this;
			me.gridDisplay=false;
			me.gridHeight=0;
			jQuery('#grid-table').css('display','none');
			
		},
		setChartSize:function(){
			var me=this,chartHeight,chartWidth;
			if(me.drillDown==1){
				return ;
			}
			if(me.chartcfg){
				chartHeight=me.chartHeight,chartWidth=me.chartWidth;	
			}else{
				chartHeight=0,chartWidth=me.chartWidth;
			}
			//chartWidth=me.getFusionWidth(chartWidth);
			jQuery('#chart-div').height(chartHeight);
			jQuery('#chart-td').height(chartHeight);
			jQuery('#chart-tr').height(chartHeight);
			//jQuery('#chart-table').height(chartHeight);
			jQuery('#main-div').width(document.body.scrollWidth);
			jQuery('#chart-div').width(chartWidth);
			
		},
		getFusionWidth:function(pwidth){
			var me=this,gridcfg=me.gridcfg,tw=0;
			if(gridcfg&&gridcfg.columns&&gridcfg.columns.length>0){
				var columns=gridcfg.columns,len=gridcfg.columns.length;
				for(var i=0;i<len;i++){
					var cur= columns[i],width=cur.width||100;
					tw+=width+2;
				}
			}
			tw+=18;
			tw=Math.max(pwidth,tw);
			if(tw>document.body.scrollWidth){
				jQuery('#main-div').css('overflow-x','scroll');
			}
			return tw;
			
		},
		showGrid:function(){
			var me=this;
			me.genGrid();
			jQuery('#grid-table').css('display','block');
			me.gridDisplay=true;
		},
		showDDGrid:function(){
			var me=this;
			me.showGrid();
		},
		resetGridHeight:function(){
			var me=this;
			if(me.grid){
				me.grid.setHeight(me.getGridHeight());
			}
		},
		getTotalHeight:function(){
			var me=this,height=0;
			if(me.drillDown==1){
				height=me.panelTitleHeight+me.chartHeight+
				me.drillPanelTitleHeight+
				me.headerHeight+
				me.gridHeight+
				me.pageingbarHeight+
				me.scrollbarHeight;
			}else{
				if(me.chartcfg){
					height=me.panelTitleHeight+me.chartHeight+me.getTipHeight(me.cfg);
				}else{
					height=me.drillPanelTitleHeight+
					me.headerHeight+
					me.gridHeight+
					me.pageingbarHeight+
					me.scrollbarHeight;
				}
				
			}	
			return height;
		},
		isIE:function(){
			var isIE=false;
			var ua = navigator.userAgent.toLowerCase();
			if (window.ActiveXObject)
				isIE = ua.match(/msie ([\d.]+)/).length>0;
			return isIE;
		},
		doLayOut:function(reset){
			if(parent.doLayOut){
				parent.doLayOut(reset);
			}
		},
		setPanelHeight:function(height){
			var me=this;
			if(height){
				if(parent.setPanelHeight){
					parent.setPanelHeight(height);
				}
			}else{
				var totalHeight=this.getTotalHeight();
				var pheight=totalHeight;
				if(me.isIE()){
					pheight-=10;
				} 
				if(parent.setPanelHeight){
					parent.setPanelHeight(pheight);
				}else{
					if(me.drillDown==1)
						jQuery('#main-div').css({'overflow-y':'scroll'});
					if(pheight>document.body.scrollHeight)
						jQuery('#main-div').css({'overflow-y':'scroll'});
				}
			}		
		},
		hideChart:function(){
			var me=this;
			me.chartDisplay=false;
			me.chartHeight=0;
			jQuery('#chart-table').css('display','none');
		},
		showChart:function(){
			this.chartDisplay=true;
			jQuery('#chart-table').css('display','block');
		},
		genReportCfg:function(){
			var me=this;
			var reportCfg= {
			    	layout:me.getLayout(),
			    	gridConfig:me.getGridCfg(),
			    	chartConfig:me.getChartCfg(),
					action:'/project/org/stdReport/genReportAction.do',
					defaultParas:{
						themethod:'getReportData',
						reportId:me.cfg.reportId
					}
			    };
			return reportCfg;
		},
		getChartCfg:function(){
			var cfg=this.cfg;
			return cfg.chart;
		},
		genFields:function(){
			var gridcfg=this.gridcfg;
			this.fields=[];
			for(var i=0;i<gridcfg.columns.length;i++){
				var cur=gridcfg.columns[i];
				this.fields.push({
	                 name:cur.id
	             });
			}
			this.fields.push({name:'rpt_url'});
			this.fields.push({name: '_id', type: 'int'});
			this.fields.push({name: '_parent', type: 'string'});
			this.fields.push({name: '_is_leaf', type: 'bool'});
			this.record = Ext.data.Record.create(this.fields);
		},
		imgRenderer:function(v){
			if(v.length<2)
				return '';
			if(v.indexOf('#')!=-1){
				var srcs=v.split('#');
				return '<img src="'+srcs[0]+'" title="'+srcs[1]+'"/>';
			}else{
				return '<img src="'+v+'"  />';
			}
		},
		dateRenderer:function(v){
			return v.substring(0,10);
		},
		setRenderer:function(obj,column){
			var me=this;
			if(obj.dataType==2){
				column.renderer=me.moneyRenderer;
			}else if(obj.dataType==4){
				column.renderer=me.numberRenderer;
			}else if(obj.dataType==110){
				column.renderer=me.imgRenderer;
			}
		},
		genColumns:function(){
			var me=this,gridcfg=me.gridcfg;
			me.columns=[];
			me.totalWidth=0;
			for(var i=0;i<gridcfg.columns.length;i++){
				var cur= gridcfg.columns[i],width=cur.width||100;
				if(i==0){
					width=width<120?120:width;
				}
				var column={
		                 id       :cur.id,
		                 header   :cur.header, 
		                 sortable :false, 
		                 dataIndex:cur.id,
		                 width:width,
		                 menuDisabled:true
		             };
				me.setRenderer(cur,column);

				me.columns.push(column);
				me.totalWidth+=width;
			}
			me.columns.push({
                id       :'rpt_url',
                header   :'', 
                sortable :false, 
                dataIndex:'rpt_url',
                hidden:true
            });
			if(me.columns.length>0){
				var curRenderer=me.columns[0].renderer;
				if(curRenderer){
					me.columns[0].renderer=function(v,m,record){
						var url=record.get('rpt_url');
						if(url&&url!=''){
							return '<a href=\'javascript:void(0);\' onclick=\'Common.showWin("'+record.get('rpt_url')+'\");\'>'+curRenderer(v)+'</a>';
						}else{
							return v;
						}
					};
				}else{
					me.columns[0].renderer=function(v,m,record){
						var url=record.get('rpt_url');
						if(url&&url!=''){
							if(url.indexOf("/project/wbs/projectManageMenuAction.do")!=-1){
								if(parent.parent.parent.parent.location.href.indexOf("index.jsp")!=-1){
									return '<a href=\'javascript:void(0);\' onclick=\'parent.parent.parent.parent.dialog.openFull("项目", "'+record.get('rpt_url')+'\")\'>'+v+'</a>';
								}else{
									return '<a href=\'javascript:void(0);\' onclick=\'parent.dialog.openFull("项目", "'+record.get('rpt_url')+'\")\'>'+v+'</a>';
								}
							}else{
								return '<a href=\'javascript:void(0);\' onclick=\'Common.showWin("'+record.get('rpt_url')+'\");\'>'+v+'</a>';
							}
						}else{
							return v;
						}
					};
				}
				
			}
		},
		loadTableData:function(store){
			var me=this;
			me.getData();
			
			me.store.loadData(me.curData,false);
		},
		setTextLeft:function(){
			var me=this,data=me.curData;
			var style=document.createElement('style');
			style.setAttribute('type','text/css');
			var head = document.getElementsByTagName('head').item(0);
			head.appendChild(style);
			if((data&&data[0]&&(data[0]._is_leaf))){	
				if(me.isIE()){
					style.styleSheet.cssText='.ux-maximgb-tg-level-0 .ux-maximgb-tg-uiwrap{display:none;}';
				}else{
					var tnode=document.createTextNode('.ux-maximgb-tg-level-0 .ux-maximgb-tg-uiwrap{display:none;}');
					style.appendChild(tnode);
				}
			}else{
				if((!data)||data.length<1){
					return;
				}
				var depth=0;
				for(;depth<data.length;depth++){
					if(data[depth]._is_leaf){
						break;
					}
				}
				if(me.isIE()){
					style.styleSheet.cssText='.vp-tree-level-'+(depth-3)+'{background-color:#9ab4ce!important;} .vp-tree-level-'+(depth-2)+'{background-color:#b9cee6!important;} .vp-tree-level-'+(depth-1)+'{background-color:#dde7f2!important;}.vp-tree-level-'+depth+'{background-color:#fff!important;}';
				}else{
					var tnode=document.createTextNode('.vp-tree-level-'+(depth-3)+'{background-color:#9ab4ce!important;} .vp-tree-level-'+(depth-2)+'{background-color:#b9cee6!important;} .vp-tree-level-'+(depth-1)+'{background-color:#dde7f2!important;}.vp-tree-level-'+depth+'{background-color:#fff!important;}');
					style.appendChild(tnode);
				}
			}
			
		},
		genPagingbar:function(){
			var me=this, gridcfg=me.gridcfg;

			Ext.ux.maximgb.tg.AdjacencyListStore.prototype.getTotalCount=function() {

		          return me.gridcfg.recordCount;
		    };
		    Ext.PagingToolbar.prototype.doLoad=function(start){
		            var o = {}, pn = this.getParams();
		            o[pn.start] = start;
		            o[pn.limit] = me.gridcfg.pageSize;
		            if(this.fireEvent('beforechange', this, o) !== false){
		            	me.gridcfg.curPage=(start/me.gridcfg.pageSize)+1;
		            	me.loadTableData();
		            	//this.inputItem.setValue(me.gridcfg.curPage);
		            	//this.cursor=start;
		            	var p = this.getParams();
		                this.cursor = o.start || 0;
		                var d = this.getPageData(), ap = d.activePage, ps = d.pages;
		                this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
		                this.inputItem.setValue(ap);
		                this.first.setDisabled(ap == 1);
		                this.prev.setDisabled(ap == 1);
		                this.next.setDisabled(ap == ps);
		                this.last.setDisabled(ap == ps);
		                this.refresh.enable();
		                this.updateInfo();
		                this.fireEvent('change', this, d);
		            }
		            me.store.expandAll();
		        };
		   Ext.PagingToolbar.readPage=function(d){

		            var v = this.inputItem.getValue(), pageNum;
		            if (!v || isNaN(pageNum = parseInt(v, 10))) {
		                this.inputItem.setValue(d.activePage);
		                return false;
		            }
		            return pageNum;
		        };
			me.pageingbar= ((gridcfg.hasPageingbar||gridcfg.pageSize)? new Ext.PagingToolbar({
				pageSize:gridcfg.pageSize,
                store:me.store,
                displayInfo: true,
                displayMsg: '共 {2}条&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
                emptyMsg: "没有数据可以显示",
                listeners:{
                	change:function(e){
                		
                	}
                }
                
            }):null);
		},
		getGridHeight:function(){
			
			var me=this, height= me.drillPanelTitleHeight+
			me.headerHeight+
			me.gridHeight+
			me.pageingbarHeight+
			me.scrollbarHeight;
			
			return height;
		},
		genGridCfg:function(){
			var me=this;
			var data=me.getData();
			me.setTextLeft();
			if(!data){
				return;
			}
			me.genStore();
			me.genColumns();
			me.genPagingbar();
			var width=document.body?document.body.clientWidth:0;
			if(me.position=='default'){
				if(me.chartcfg){
					width=me.chartWidth;
				}else{
					width=me.commonWidth;
				}
			}
			
			//width=me.getFusionWidth(width);
			
			jQuery('#grid-div').width(width);
			jQuery('#grid-td').width(width);
			jQuery('#grid-tr').width(width);
			var gcfg= {
				master_column_id :me.columns[0].dataIndex,
				remoteSort: false,
	            store: me.store,
	            columns:me.columns,
	            bbar:me.pageingbar,
	            stripeRows: true,
	            width:width,
	            height:me.getGridHeight(),
	            autoScroll:true,
	           // enableColumnResize:false,
	            viewConfig : {
	              	enableRowBody : true
	              }
	            };
			if(me.drillDown==1){
				gcfg.title=(me.gridTitle==''?'&nbsp;':me.gridTitle);	
			}
			if(me.totalWidth<width){
				gcfg.autoExpandColumn=me.columns[me.columns.length-1].id;
			}
			return gcfg;
		},
		getLayout:function(){
			return this.cfg.layout;
		},
		showReport:function(reportId){
			var me=this;
			jQuery.ajax({
				url: '/project/org/stdReport/selfDefineReportAction.do',
				data: {
					themethod: 'loadReportCfg',
					reportId:reportId,
					drillDown:me.drillDown
				},
				type: 'post',
				async: false,
				success: function(res) {
					
				},
				failure:function(){
					//alert('session超时！');
					return;
				},
				dataType: 'json'
			});
		},
		getTableData:function(){
			
		},
		getParas:function(){
			var me=this;
			var paras= {
				themethod: 'loadReportData',
				reportId:me.reportId,
				projectId:me.projectId,
				drillDown:me.drillDown,
				drillPara:me.drillPara,
				curPage:(me.gridcfg&&me.gridcfg.curPage?me.gridcfg.curPage:-1)
			};
			if(parent.condition){
				paras.condition=parent.condition;
			}
			return paras;
		},
		getHttpData:function(){
			var data,me=this;
			if(!me.projectId)
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
						//alert('系统session超时，请重新登录');//session超时登录
						window.showModalDialog(
								"/project/timeOutLogin.jsp",
								"",
								"dialogWidth=400px; "+
								"dialogHeight=120px; "+
								"status=no; help=no;"+
								"scroll=no");
					}
					data=[];
				},
				dataType: 'json'
			});
			return data;
		},
		getData:function(){
			var me=this,chartcfg=me.chartcfg;
			var data=me.getHttpData();
			var type=me.cfg.type;
			if((me.gridcfg&&me.drillDown==1&&!me.gridcfg.onlyCount)||(me.gridcfg&&!me.chartcfg&&!me.gridcfg.onlyCount)){
				if(!data||!data[0]||data[0].length<1){
					me.showNoDataPage();
					return;
				}else{
					
					if(type!=2&&type!=3&&type!=12)
						me.addPanelTool('dump');
				}
				if(me.gridcfg){
					me.gridcfg.recordCount=data[1];
				}
				data=data[0];
			}else{
				if(!data||data.length<1){
					me.showNoDataPage();
					return;
				}else{
					if(type!=2&&type!=3&&type!=12)
						me.addPanelTool('dump');
				}
				
			}
			
			me.decoCurData(data);
			me.setReportSize();
			return me.curData;
		},
		decoCurData:function(chartData){
			var me=this,chartcfg=me.chartcfg;
			if(chartcfg&&chartcfg.maxCount&&this.drillDown==0){
				chartData=(chartData.length>chartcfg.maxCount?chartData.slice(0,chartcfg.maxCount):chartData);
			}
			if(me.curData){
				me.preDataLength=me.curData.length;
			}
			me.curData=chartData;
		},
		collectColors:function(){
			return;
			var me=this,curData=me.curData,chartcfg=me.chartcfg,colors=[],index=[];
			if(chartcfg&&chartcfg.type=='bubble'){
				if(curData.length>0){
					for(var i=0;i<me.curData.length;i++){
						var cur=curData[i],contained=false;
						for(var j=0;j<index.length;j++){
							if(index[j]==cur.index){
								contained=true;
							}
						}
						if(!contained){
							index.push(cur.index);
							colors.push(cur.color);
						}
							
					
					}
				}
				me.colors=colors;
			}
		},
		genStore:function(data){
			var me=this;
			me.genFields();
			me.store = new Ext.ux.maximgb.tg.AdjacencyListStore({
            	autoLoad:false,
            	reader: new Ext.data.JsonReader({id: '_id'}, me.record)
            });
			return me.store;
		},
		getTipHeight:function(cfg){
			var me=this;
			if(!me.tipHeightSetted){
				if(cfg.chart&&cfg.grid){
					var tip=document.getElementById('tip-td');
					if(tip){
						tip=tip.style;
						var height=me.tipHeight+'px';
						tip.height=height;
						tip.lineHeight=height;
						tip.width=me.chartWidth+'px';
						
						document.getElementById('tip-tr').style.display='block';
					}
					
				}else{
					var tip=document.getElementById('tip-tr');
					if(tip){
						tip=tip.style;
						tip.display='none';
					}
					me.tipHeight=0;
				}
				me.tipHeightSetted=true;
			}
			if(me.drillDown==1){
				me.tipHeight=0;
			}
			return me.tipHeight;
		},
		setPosition:function(position,cfg){
			var me=this;
			me.position=position;
			if(position=='default'){
				this.chartHeight=document.body.scrollHeight-15-me.getTipHeight(cfg);
				if(cfg.chart)
					this.chartWidth=document.body.scrollWidth-15;
			}
			if(me.isIE()){
				me.rowHeight=24;
			}
		},
		setGridHeight:function(){
			var me=this,num=(me.curData?me.curData.length:0), gridcfg=me.gridcfg;
			if(!gridcfg||(gridcfg&&gridcfg.onlyCount)||(me.chartcfg&&me.drillDown==0)){
				return;
			}
			if(me.position=='default'&&!me.chartcfg){
				me.gridHeight=document.body.scrollHeight-
				me.drillPanelTitleHeight-
				me.headerHeight-
				me.pageingbarHeight-
				me.scrollbarHeight;
			}else{
				if(gridcfg.pageSize){
					me.gridHeight=num*me.rowHeight;
				}else{
					me.gridHeight=num*me.rowHeight;
					me.pageingbarHeight=0;
				}
					
				if(me.drillDown==0){
					me.drillPanelTitleHeight=0;			
					
				}
				var griddivHeight=me.drillPanelTitleHeight+
				me.headerHeight+
				me.gridHeight+
				me.pageingbarHeight+
				me.scrollbarHeight;
	    		jQuery('#grid-div').height(griddivHeight);
	    		jQuery('#grid-td').height(griddivHeight);
	    		jQuery('#grid-tr').height(griddivHeight);
	    		if(!me.chartcfg){
	    			jQuery('#main-div').height(griddivHeight);
	    		}
			}
			me.resetGridHeight();
		},
		genGrid:function(){
			var me=this;
		
			if(me.gridcfg&&me.gridcfg.onlyCount){
				var data=me.getData();
				me.showOnlyCountPage(data[0]);
			}else{
				var cfg=me.genGridCfg()
				if(!cfg){
					return;
				}
				if(me.grid){
					me.grid.destroy();
				}

				setTimeout(function(){
					me.grid = new Ext.ux.maximgb.tg.GridPanel(cfg);
					me.grid.render('grid-div');
					me.store.loadData(me.curData);
					me.store.expandAll();
				},1);
				
				//return me.grid;
			}
			
		},
		loadFirstPage:function(){
			var me=this;
			if(me.curData.length>0)
				me.store.load({params:{start:0,limit:me.gridcfg.pageSize||10000}});
		},
		preHeight:0,
		gridDisplay:false,
		itemClick:function(item){
			var me=SelfReportDriver;
			if(!me.gridcfg){
				return;
			}
			me.hideTipDiv();
			me.drillDown=1;
			me.gridcfg.curPage=1;
			Array.prototype.pushStr=function(str){
				this.push('"'+str+'"');
			};
			var paras=[];
			if(me.chartcfg.type=='pie'){
				var dc=item.dataItem.dataContext;
				paras.pushStr(dc.slice);
				me.gridTitle=item.dataItem.title||'';
			}else if(me.chartcfg.type=='column'){
				var dc=item.item.dataContext;
				if(me.chartcfg.yAxis.length==0){
					paras.pushStr(dc.group);
				}else{
					paras.pushStr(dc.group);
					paras.pushStr(item.graph.valueField);
				}
				var title=item.graph.title;
				me.gridTitle=item.item.category||'';
				if(title&&title!=''){
					me.gridTitle+='-'+title;
				}
					
				
			}else if(me.chartcfg.type=='bubble'){
				var dc=item.item.dataContext;
				paras.pushStr(dc.x);
				paras.pushStr(dc.y);
				paras.pushStr(dc.series);
				//me.gridTitle=item.graph.title+'(x:'+dc.x+',y:'+dc.y+')';
				me.gridTitle=item.graph.title;
			}
			me.drillPara=encodeURIComponent('['+paras.join(',')+']');
			if(!me.graphData){
				me.graphData=me.curData;
			}
			me.showDDGrid();
        },
        hideTipDiv:function(){
        	var tip=document.getElementById('tip-tr');
        	if(tip){
        		tip.style.display='none';
        	}
        },
        setReportId:function(id){
        	this.reportId=id;
        },
        showReportContent:function(){
        	var me=this;
        	if(me.chartcfg){
				me.genChart();
			}else if(me.gridcfg){
				me.gridcfg.curPage=1;
				me.hideChart();
				me.showGrid();
			}
        },
		genReport:function (cfg) {
			var me=this;
			me.setCfg(cfg)
			me.showReportContent();
        	
        },
        moneyRenderer:function(value){
        		if(value==''||isNaN(value))return value;
        		value = value.replaceAll(",", "");
        		var vstr=new String(value),index=vstr.indexOf('.'),ll=(index>-1?index-1:(vstr.length-1)),newstr='';
        		for(var i=ll;i>-1;){
        			newstr=vstr.charAt(i--)+newstr;
        			if(i!=-1&&(ll-i)%3==0&&(vstr.charAt(i)!='-'&&vstr.charAt(i)!='+')){
        				newstr=','+newstr;
        			}
        		}
        		if(index>-1){
        			newstr+='.'+vstr.substring(index+1,vstr.length)+((vstr.length-index<3)?(vstr.length-index<2?'00':'0'):'');
        		}else{
        			newstr+='.00';
        		}
        		return '<div style="width:100%;text-align:right;">'+newstr+'</div>';
        },
        numberRenderer:function(value){
        	 return '<div style="width:100%;text-align:right;">'+value+'</div>';
        },
        removePreChart:function(){
        	var cDom=document.getElementById("chart-div");
        	if(cDom)
        		cDom.innerHTML='';
        },
        genChart:function(){
        	var me=this,chartcfg=me.chartcfg;
        	me.getData();
    		if(chartcfg.type=='pie'){
        		me.genPieChart();
        	}else if(chartcfg.type=='column'){
        		me.genColumnChart();
        	}else if(chartcfg.type=='bubble'){
        		me.genBubbleChart();
        	}
        },
        genLegend:function(){
        	var me=this,legend = new AmCharts.AmLegend();
            legend.align = "center";
            legend.markerType = "square";
			legend.labelText="[[title]]";
			legend.valueText="";
			legend.position="bottom";
			legend.maxColumns=me.legendColNum;
			//chart.labelRadius = -30;
			legend.markerSize=12;
			legend.switchType='v';
			return legend;
        },
        genPieChart:function(){
        	
        	var me=this,chart = new AmCharts.AmPieChart();
        	chart.dataProvider=me.curData;
            if(!chart.dataProvider){
            	return;
            }
            chart.titleField = me.chartcfg.xAxis;
            chart.valueField =me.chartcfg.yAxis;
            chart.labelText="[[value]]";
            chart.labelRadius = -20;
			chart.startDuration = 0;
			
            chart.addLegend(me.genLegend());
            // WRITE
            chart.addListener('clickSlice',SelfReportDriver.itemClick);
            chart.write("chart-div");
            var div=document.getElementById("main-div");
            if(div&&div.scrollWidth){
            	var barlength=div.scrollWidth*(div.clientWidth/div.scrollWidth);           
                div.scrollLeft+=(div.scrollWidth-barlength)/2;
            }
            me.chart=chart;
        },
        trimGroup:function(group){
        	var me=this, len=5,res='';
        	if(group){
        		res = group.substring(0,len);
        	}
        	return res;
        },
        setAxisName:function(axis,name){
        	axis.title = name;
        	axis.titleFontSize=12;
        	axis.titleBold = false;
        	axis.titleColor = "#6D869F";
        	//axis.titleColor = "#000000";
        },
        genColumnChart:function(){
        	var me=this,chartcfg=me.chartcfg,chart = new AmCharts.AmSerialChart();
        	chart.dataProvider=me.curData;
            if(!chart.dataProvider){
            	return;
            }
            chart.categoryField = chartcfg.xAxis;
            chart.color = "#000";
            chart.fontSize = 12;
            chart.startDuration = 0;
            chart.plotAreaFillAlphas = 0.2;
          
            // AXES
            // category
            var categoryAxis = chart.categoryAxis;
            
            categoryAxis.gridAlpha = 0.2;
            categoryAxis.gridPosition = "start";
            categoryAxis.gridColor = "#FFFFFF";
            categoryAxis.axisColor = "#ccc";
            categoryAxis.axisAlpha = 0.5;
            categoryAxis.dashLength = 5;
			categoryAxis.labelRotation=30;
			categoryAxis.fontSize=12;
			me.setAxisName(categoryAxis, (chartcfg.xAxisName||''));
            // value
            var valueAxis = new AmCharts.ValueAxis();
            if(chartcfg.isCluster==1){
            	valueAxis.stackType = "regular";
            }
            //valueAxis.stackType = "3d"; // This line makes chart 3D stacked (columns are placed one behind another)
            valueAxis.gridAlpha = 0.2;
            valueAxis.gridColor = "#FFFFFF";
            valueAxis.axisColor = "#ccc";
            valueAxis.axisAlpha = 0.5;
            valueAxis.dashLength = 5;
            if(chartcfg.yAxisName&&chartcfg.yAxisName=='记录数'){
            	valueAxis.integersOnly=true;
            }
            me.setAxisName(valueAxis, (chartcfg.yAxisName||''));
            //valueAxis.unit = "%";
            chart.addValueAxis(valueAxis);
			
            var yAxis=chartcfg.yAxis,legends=chartcfg.legends;
            yAxis=(yAxis.length>chartcfg.maxSeries)?yAxis.slice(0,chartcfg.maxSeries):yAxis;
            // GRAPHS         
            for(var i=0;i<yAxis.length;i++){  
	            var graph = new AmCharts.AmGraph();
	            graph.title =legends[i];
	            graph.valueField = yAxis[i];
	            graph.type = "column";
	            graph.lineAlpha = 0;
	            graph.fillAlphas = 1;
	            graph.balloonText ="[[category]]-[[title]]:[[value]]";
	            chart.addGraph(graph);
            } 
            
            if(yAxis.length==0){
            	var graph = new AmCharts.AmGraph();
	            graph.title = "";
	            graph.valueField = "valueAxis";
	            graph.type = "column";
	            graph.lineAlpha = 0;
	            graph.fillAlphas = 1;
	            graph.balloonText = "[[category]]:[[value]]";
	            chart.addGraph(graph);
            }else{
         	   var legend = new AmCharts.AmLegend();
                chart.addLegend(this.genLegend());
                
            }
           chart.addListener('clickGraphItem',SelfReportDriver.itemClick);
           chart.write("chart-div");
           me.chart=chart;
        },
        setBubbleR:function(){
        	var me=this, height=me.chartHeight-100,width=me.chartHeight-100;
        	var r=Math.min(height,width);
        	me.bubbleMaxR=r;
        	me.bubbleMinR=5;
        	me.bus=15;
        },
        genBubbleChart:function(){
        	var me=this,chartcfg=me.chartcfg,chart = new AmCharts.AmXYChart();
        	me.rowHeight=25;
        		chart.dataProvider=me.curData;
                if(!chart.dataProvider){
                	return;
                }
                me.setBubbleR();
                chart.startDuration = 0;

                // X
                var xAxis = new AmCharts.ValueAxis();
                xAxis.axisColor = "#ccc";
                xAxis.position = "bottom";
                xAxis.autoGridCount = true;
                me.setAxisName(xAxis, (chartcfg.xAxisName||''));
                chart.addValueAxis(xAxis);

                // Y
                var yAxis = new AmCharts.ValueAxis();
                yAxis.axisColor = "#ccc";
                yAxis.position = "left";
                yAxis.autoGridCount = true;
                
                me.setAxisName(yAxis, (chartcfg.yAxisName||''));
                chart.addValueAxis(yAxis);
                
                var fData=[],data=me.curData,maxValue=0,chartCfg=chartcfg,
                colors=chartCfg.colors,index=chartCfg.index,xAxis=chartCfg.xAxis,
                yAxis=chartCfg.yAxis,valueAxis=chartCfg.valueAxis,legends=chartCfg.legends;
                for(var i=0;i<valueAxis.length;i++){
                	var graph = new AmCharts.AmGraph();
                    graph.bulletSizeField = valueAxis[i]; // valueField responsible for the size of a bullet
                    graph.minBulletSize=1;//me.bubbleMinR;
                    //graph.maxBulletSize=me.bubbleMaxR;
                	graph.descriptionField = valueAxis[i]+'_desc';
                    graph.title=legends[i];
    				//graph.colorField='color';
    			    graph.lineColor=colors[index[i]];
    			    graph.xField = xAxis[i];
                    graph.yField = yAxis[i];
                    graph.lineAlpha = 0;
                   // graph.balloonText ="[[title]]:[[description]]";
                    graph.balloonText ="[[description]]";
                    graph.bullet = "bubble";
                    chart.addGraph(graph);
                    var curValAxis=valueAxis[i],maxR=me.bubbleMaxR,rUnit=me.bus;
                    for(var j=0;j<data.length;j++){
                    	var cur=data[j],curVal=cur[curValAxis];
                    	var prefix=cur['prefix'];
                    	if(curVal&&curVal!="0"){
                    		var desVal=parseFloat(curVal,10);
                    		cur[curValAxis]=desVal;
                    		//curVal=desVal*rUnit;
                    		//cur[curValAxis]=(curVal>maxR?maxR:curVal);
                    		cur[curValAxis+'_desc']=(!prefix||prefix==''?'':(prefix+':'))+(desVal==''?0:desVal);
                    		if(desVal>maxValue){
                    			maxValue=desVal;
                    		}
                    	
                    	}else{
                    		//cur[curValAxis]=me.bubbleMinR;
                    		cur[curValAxis]=0;
                    		cur[curValAxis+'_desc']=(!prefix||prefix==''?'':(prefix+':'))+(curVal||'');
                    	}
                    }               
                }
                
                for(var i=0;i<valueAxis.length;i++){
            		var curValAxis=valueAxis[i];
                    for(var j=0;j<data.length;j++){
                    	var cur=data[j],curVal=cur[curValAxis];
                    	var value=(me.bubbleMaxR*curVal)/maxValue;
                    	if(value==0){
                    		cur[curValAxis]=me.bubbleMinR;
                    	}else if(value<rUnit){
                    		cur[curValAxis]=rUnit;
                    	}else {
                    		cur[curValAxis]=value;
                    	}
                    	
                    }
            	}
                chart.addLegend(me.genLegend());
                chart.addListener('clickGraphItem',SelfReportDriver.itemClick);
                // WRITE                                
                chart.write("chart-div");
                me.chart=chart;

        },
        genBubbleChartOld:function(){
        	var me=this,chart = new AmCharts.AmXYChart();
        	me.rowHeight=25;
        		chart.dataProvider=me.curData;
                if(!chart.dataProvider){
                	return;
                }
                me.setBubbleR();
                chart.startDuration = 0;

                // X
                var xAxis = new AmCharts.ValueAxis();
                xAxis.axisColor = "#ccc";
                xAxis.position = "bottom";
                xAxis.autoGridCount = true;
                chart.addValueAxis(xAxis);

                // Y
                var yAxis = new AmCharts.ValueAxis();
                yAxis.axisColor = "#ccc";
                yAxis.position = "left";
                yAxis.autoGridCount = true;
                chart.addValueAxis(yAxis);
                
                var data=me.curData,maxValue=0,chartCfg=me.chartcfg,
                colors=chartCfg.colors,index=chartCfg.index,xAxis=chartCfg.xAxis,
                yAxis=chartCfg.yAxis,valueAxis=chartCfg.valueAxis,legends=chartCfg.legends;
                for(var i=0;i<valueAxis.length;i++){
                	var graph = new AmCharts.AmGraph();
                    graph.bulletSizeField = valueAxis[i]; // valueField responsible for the size of a bullet
                    graph.minBulletSize=me.bubbleMinR;
                    //graph.maxBulletSize=me.bubbleMaxR;
                	graph.descriptionField = valueAxis[i]+'_desc';
                    graph.title=legends[i];
    				//graph.colorField='color';
    			    graph.lineColor=colors[index[i]];
    			    graph.xField = xAxis[i];
                    graph.yField = yAxis[i];
                    graph.lineAlpha = 0;
                   // graph.balloonText ="[[title]]:[[description]]";
                    graph.balloonText ="[[description]]";
                    graph.bullet = "bubble";
                    chart.addGraph(graph);
                    var curValAxis=valueAxis[i];
                    for(var j=0;j<data.length;j++){
                    	var cur=data[j],curVal=cur[curValAxis];
                    	if(curVal){
                    		curVal=parseFloat(curVal,10);
                    		cur[curValAxis]=curVal;
                    		var prefix=cur['prefix'];
                    		cur[curValAxis+'_desc']=(prefix==''?'':(prefix+':'))+(curVal==''?0:curVal);
                    		if(curVal>maxValue){
                    			maxValue=curVal;
                    		}
                    	}else{
                    		cur[curValAxis+'_desc']=(prefix==''?'':(prefix+':'))+curVal;
                    	}
                    }
                }
                if(maxValue>me.bubbleMaxR){
                	for(var i=0;i<valueAxis.length;i++){
                		var curValAxis=valueAxis[i];
                        for(var j=0;j<data.length;j++){
                        	var cur=data[j],curVal=cur[curValAxis];
                        	cur[curValAxis]=(me.bubbleMaxR*curVal)/maxValue;
                        }
                	}
                }
                chart.addLegend(me.genLegend());
                chart.addListener('clickGraphItem',SelfReportDriver.itemClick);
                // WRITE                                
                chart.write("chart-div");
                me.chart=chart;

        },
        showNoCfgPage:function(){
        	var me=this, maindiv=jQuery(document.body);
			maindiv.height(50);
			maindiv.css({'text-align':'center','overflow-x':'hidden'});
			maindiv.html('<div style="border:0px solid #000;line-height:50px;height:50px;margin-left:atuo;margin-right:atuo;font-weight:bold;font-size:12px;">未检测到报表配置数据,请确认!</div>');
			me.setPanelHeight(50);
			me.removePanelTool('dump');
        },
        showOnlyCountPage:function(count){
        	var me=this, maindiv=jQuery(document.body);
			maindiv.height(50);
			maindiv.css({'text-align':'center','overflow-x':'hidden'});
			maindiv.html('<div style="border:0px solid #000;line-height:50px;height:50px;margin-left:atuo;margin-right:atuo;font-weight:bold;font-size:12px;">共有条'+count+'记录</div>');
			me.setPanelHeight(50);
			me.removePanelTool('dump');
        },
        showNoDataPage:function(){
        	var me=this, maindiv=jQuery(document.body);
    		maindiv.height(50);
    		maindiv.css({'text-align':'center','overflow-x':'hidden'});
    		maindiv.html('<div style="border:0px solid #000;line-height:50px;height:50px;margin-left:atuo;margin-right:atuo;font-weight:bold;font-size:12px;">暂无数据！</div>');
    		me.setPanelHeight(50);
    		me.removePanelTool('dump');
			
        },
        addPanelTool:function(tool){
        	if(parent.addPanelTool){
        		parent.addPanelTool(tool);
        	}
        },
        removePanelTool:function(tool){
        	if(parent.removePanelTool){
        		parent.removePanelTool(tool);
        	}
        },
        loadCfg:function(reportId){
        	var cfg,me=this;
        	jQuery.ajax({
    			url:'/project/report/selDefineReportAction.do',
    			data: {
    				themethod:'getReportConfig',
    				codeType:'utf-8',
    				reportId:reportId,
    				projectId:0,
    				drillDown:me.drillDown
    			},
    			type: 'post',
    			async: false,
    			success: function(res) {
    				cfg=res
    			},
				failure:function(){
					//alert('session超时！');
					return;
				},
    			dataType: 'json'
    		});
        	return cfg;
        },
        setSail:function(reportId,position,projectId){
        	var me=this;
        	me.projectId=(projectId||0);
        	AmCharts.ready(function(){
        		var cfg=me.loadCfg(reportId);
        		if(!cfg){
        			me.showNoCfgPage();
					return;
				}
        		me.init(reportId,position,cfg);
        		
        	 });
        		
        }
        ,
        dump:function(){
        	var me=this,chartcfg=me.chartcfg,gridcfg=me.gridcfg;
        	if(gridcfg&&!chartcfg){
        		return me.getGridDumpObj();
        	}else if(chartcfg.type=='pie'){
        		return me.getPieDumpObj();
        	}else if(chartcfg.type=='column'){
        		return me.getColumnDumpObj();
        	}
        },
        getGridDumpObj:function(){
        	var me=this;
        	var hasData=((me.curData&&me.curData.length>0)?true:false);
        	return {
        		cfg:{type:0,
        			reportId:me.reportId,
        			projectId:me.projectId,
        			condition:parent.condition,
        			hasData:hasData
        			}
        	};
        },
        getPieDumpObj:function(){
        	var me=this,cfg=me.chartcfg;
        	return {
        		cfg:{
        			type:10,
        			reportId:me.reportId,
        			group:cfg.xAxis,
        			value:cfg.yAxis,
        			condition:parent.condition,
        			maxGroup:cfg.maxCount
        		},
        		data:me.graphData||me.curData
        	};
        },
        getColumnDumpObj:function(){
        	var me=this,cfg=me.chartcfg;
        	var legends,series;
        	if(cfg.yAxis.length==0){
        		legends=[''];
        		series=['valueAxis'];
        	}else{
        		legends=cfg.legends;
        		series=cfg.yAxis;
        	}
        	return {
        		cfg:{
	        			type:11,
	        			reportId:me.reportId,
	        			group:cfg.xAxis,
	        			series:series,//数组
	        			legends:legends,//数组
	        			maxGroup:cfg.maxCount,
	        			maxSeries:cfg.maxSeries,
	        			condition:parent.condition,
	        			isPileUp:cfg.isCluster
        			},
        		data:me.graphData||me.curData
        	};
        }
};
 (function() {
	if (window.addEventListener) {
		window.addEventListener('resize',
		function() {
			SelfReportDriver.resetGridWidth();
		},
		false);
	} else {
		window.attachEvent('onresize',
		function() {
			SelfReportDriver.resetGridWidth();
		});
	}
})();
