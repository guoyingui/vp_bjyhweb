
Ext.ux.Portal = Ext.extend(Ext.Panel, {
    layout : 'column',
    autoScroll : true,
    cls : 'x-portal',
    defaultType : 'portalcolumn',
    
    initComponent : function(){
        Ext.ux.Portal.superclass.initComponent.call(this);
        this.addEvents({
            validatedrop:true,
            beforedragover:true,
            dragover:true,
            beforedrop:true,
            drop:true
        });
    },

    initEvents : function(){
        Ext.ux.Portal.superclass.initEvents.call(this);
        this.dd = new Ext.ux.Portal.DropZone(this, this.dropConfig);
    },
    
    beforeDestroy : function() {
        if(this.dd){
            this.dd.unreg();
        }
        Ext.ux.Portal.superclass.beforeDestroy.call(this);
    }
});

Ext.reg('portal', Ext.ux.Portal);

Ext.ux.Portal.DropZone = Ext.extend(Ext.dd.DropTarget, {
    
    constructor : function(portal, cfg){
        this.portal = portal;
        Ext.dd.ScrollManager.register(portal.body);
        Ext.ux.Portal.DropZone.superclass.constructor.call(this, portal.bwrap.dom, cfg);
        portal.body.ddScrollConfig = this.ddScrollConfig;
    },
    
    ddScrollConfig : {
        vthresh: 50,
        hthresh: -1,
        animate: true,
        increment: 200
    },

    createEvent : function(dd, e, data, col, c, pos){
        return {
            portal: this.portal,
            panel: data.panel,
            columnIndex: col,
            column: c,
            position: pos,
            data: data,
            source: dd,
            rawEvent: e,
            status: this.dropAllowed
        };
    },

    notifyOver : function(dd, e, data){
        var xy = e.getXY(), portal = this.portal, px = dd.proxy;

        // case column widths
        if(!this.grid){
            this.grid = this.getGrid();
        }

        // handle case scroll where scrollbars appear during drag
        var cw = portal.body.dom.clientWidth;
        if(!this.lastCW){
            this.lastCW = cw;
        }else if(this.lastCW != cw){
            this.lastCW = cw;
            portal.doLayout();
            this.grid = this.getGrid();
        }

        // determine column
        var col = 0, xs = this.grid.columnX, cmatch = false;
        for(var len = xs.length; col < len; col++){
            if(xy[0] < (xs[col].x + xs[col].w)){
                cmatch = true;
                break;
            }
        }
        // no match, fix last index
        if(!cmatch){
            col--;
        }

        // find insert position
        var p, match = false, pos = 0,
            c = portal.items.itemAt(col),
            items = c.items.items, overSelf = false;

        for(var len = items.length; pos < len; pos++){
            p = items[pos];
            var h = p.el.getHeight();
            if(h === 0){
                overSelf = true;
            }
            else if((p.el.getY()+(h/2)) > xy[1]){
                match = true;
                break;
            }
        }

        pos = (match && p ? pos : c.items.getCount()) + (overSelf ? -1 : 0);
        var overEvent = this.createEvent(dd, e, data, col, c, pos);

        if(portal.fireEvent('validatedrop', overEvent) !== false &&
           portal.fireEvent('beforedragover', overEvent) !== false){

            // make sure proxy width is fluid
            px.getProxy().setWidth('auto');

            if(p){
                px.moveProxy(p.el.dom.parentNode, match ? p.el.dom : null);
            }else{
                px.moveProxy(c.el.dom, null);
            }

            this.lastPos = {c: c, col: col, p: overSelf || (match && p) ? pos : false};
            this.scrollPos = portal.body.getScroll();

            portal.fireEvent('dragover', overEvent);

            return overEvent.status;
        }else{
            return overEvent.status;
        }

    },

    notifyOut : function(){
        delete this.grid;
    },

    notifyDrop : function(dd, e, data){
        delete this.grid;
        if(!this.lastPos){
            return;
        }
        var c = this.lastPos.c, 
            col = this.lastPos.col, 
            pos = this.lastPos.p,
            panel = dd.panel,
            dropEvent = this.createEvent(dd, e, data, col, c,
                pos !== false ? pos : c.items.getCount());

        if(this.portal.fireEvent('validatedrop', dropEvent) !== false &&
           this.portal.fireEvent('beforedrop', dropEvent) !== false){

            dd.proxy.getProxy().remove();
            panel.el.dom.parentNode.removeChild(dd.panel.el.dom);
            
            if(pos !== false){
                c.insert(pos, panel);
            }else{
                c.add(panel);
            }
            
            c.doLayout();

            this.portal.fireEvent('drop', dropEvent);

            // scroll position is lost on drop, fix it
            var st = this.scrollPos.top;
            if(st){
                var d = this.portal.body.dom;
                setTimeout(function(){
                    d.scrollTop = st;
                }, 10);
            }

        }
        delete this.lastPos;
    },

    // internal cache of body and column coords
    getGrid : function(){
        var box = this.portal.bwrap.getBox();
        box.columnX = [];
        this.portal.items.each(function(c){
             box.columnX.push({x: c.el.getX(), w: c.el.getWidth()});
        });
        return box;
    },

    // unregister the dropzone from ScrollManager
    unreg: function() {
        Ext.dd.ScrollManager.unregister(this.portal.body);
        Ext.ux.Portal.DropZone.superclass.unreg.call(this);
    }
});



Ext.ux.PortalColumn = Ext.extend(Ext.Container, {
    layout : 'anchor',
    //autoEl : 'div',//already defined by Ext.Component
    defaultType : 'portlet',
    cls : 'x-portal-column'
});

Ext.reg('portalcolumn', Ext.ux.PortalColumn);




Ext.ux.Portlet = Ext.extend(Ext.Panel, {
    anchor : '100%',
    frame : true,
    collapsible : true,
    draggable : false,
    cls : 'x-portlet'
});

Ext.reg('portlet', Ext.ux.Portlet);

Ext.Panel.prototype.toggleCollapse=function(animate){
    this[this.collapsed ? 'expand' : 'collapse'](animate);
    var refresh=this.getTool('refresh');
    if(this.collapsed){
    	if(refresh){
    		refresh.show();
    	}
    }else{
    	if(refresh){
    		refresh.hide();
    	}
    }
    return this;
};
Ext.QuickTips.init();
var ToolButtons={
		toggle:{
		    id:'stoggle',
		    handler: function(e, target, panel){
		    	panel[panel.collapsed ? 'expand' : 'collapse'](false);
		    	var tools=['filte','refresh','gear'];
		    	for(var i=0;i<tools.length;i++){
		    		var tool=panel.getTool(tools[i]);
		    		if(tool){
		    			 if(panel.collapsed){
				    	    	tool.hide();
				    	    }else{
				    	    	tool.show();
				    	    }
		    		}
		    	}
		    	if(panel.shouldResetWidth){
		    		var frame=window.frames[MeterUtil.getFrameId(panel.getId())];
					if(frame&&frame.reseGridWidth){
						frame.reseGridWidth(panel.getWidth());
					}
		    	}
		    	MeterUtil.doLayOut(true);
		    	
		    },
		    qtip:'仪表伸缩'
		},
		refresh:{
		    id:'refresh',
		    handler: function(e, target, panel){
		    	var pid=panel.getId(),curp=window.frames[MeterUtil.getFrameId(pid)];
		    	if(curp.getPageId){
		    		window[curp.getPageId()]=1;
			   		window[curp.getConId()]=undefined;
		    	}
		    	MeterUtil.clearPanelCache(panel,pid);
		    	MeterUtil.addLoadingDiv(pid);
		    	curp.location.reload();
		    },
		    qtip:'刷新'
		    
		},
		close:{
		    id:'close',
		    handler: function(e, target, panel){
		        panel.ownerCt.remove(panel, true);
		    	
		    },
		    qtip:'关闭'
		},
		dump:{
		    id:'dump',
		    handler: function(e, target, panel){
		    	var curp=window.frames[MeterUtil.getFrameId(panel.getId())];
		    	if(curp.dump){
		    		var data=curp.dump();
					exportExcel(data);
		    	}
		    },
		    qtip:'导出'
		},
		filte:{
		    id:'filte',
		    handler: function(e, target, panel){
		    	var pid=panel.getId();
		    	if(MeterUtil){
		    		MeterUtil.loadCon(panel,pid);
		    	}
		    },
		    qtip:'筛选'
		    	
		},
		help:{
		    id:'help',
		    on:{'mouseover' :function(e){
		    	var ss=e.getTarget('.x-panel',10,true);
		    	var p=Ext.getCmp(ss.id);
		    	if(!p.tip){
		    		p.tip=new Ext.ToolTip({mouseOffset:[-160,0],width:150,target:p.getTool('help'),html:MeterUtil.tips[ss.id]||'暂无描述'});
		    	}
		    	setTimeout(function(){
			    	try{
			    		p.tip.show();
				    }catch(e){}
		    	},100);
		    },
		    scope:this
		    }
		    
		},
		settings:{
		    id:'gear',
		    handler: function(e, target, panel){
		    	window.frames[MeterUtil.getFrameId(panel.getId())].callSetting();
		        
		    },
		    qtip:'设置'
		},
		maximize:{
		    id:'maximize',
		    handler: function(e, target, panel){
		    	//var curp=window.frames[MeterUtil.getFrameId(panel.getId())];
		    	//Common.showWin(curp.location.href,window,window.screen.availWidth-10,window.screen.availHeight-30);
		    	
		    	var o=MeterUtil.rptsCache[panel.getId()],icon='open_table.gif';
		    	if(!o.allowAccess){
		    		return;
		    	}
		    	jQuery.ajax({
		    		url:'/project/report/dashboard/dashboardAction.do',
	    			data: {
	    				themethod:'loadRptIconType',
	    				rptid:o.reportId
	    			},
	    			type: 'post',
	    			async: false,
	    			success: function(res) {
	    				res=eval('('+res+')');
	    				if(parseInt(res.iconType)!=1){
	    					icon='open_table_pic.gif';
	    				}
	    			},
	    			dataType: 'text'
	    		});
		    	var rptUrl = "/project/vframe/openWindowNoMenuAction.do?";
				rptUrl += "winTitle="+o.title; 
				rptUrl += "&topFrame=objTitle=报表类型;"
					+"objName=组织级报表;"
					+"objType="+o.title+";"
					+"objIcon="+icon;
				rptUrl += "&rightFrame="+o.url; 
				Common.showWin(rptUrl);
		    },
		    qtip:'最大化'
		    
		}
};
var prBts={
		toggle:{
		    id:'prtoggle',
		    handler: function(e, target, panel){
		    	panel[panel.collapsed ? 'expand' : 'collapse'](false);
		    	var tools=['prfilte','prrefresh','prgear'];
		    	for(var i=0;i<tools.length;i++){
		    		var tool=panel.getTool(tools[i]);
		    		if(tool){
		    			 if(panel.collapsed){
				    	    	tool.hide();
				    	    }else{
				    	    	tool.show();
				    	    }
		    		}
		    	}
		    	MeterUtil.doLayOut(true);
		    	
		    },
		    qtip:'仪表伸缩'
		},
		refresh:{
		    id:'prrefresh',
		    handler: function(e, target, panel){
		    	var pid=panel.getId(),curp=window.frames[MeterUtil.getFrameId(pid)];
		    	
		    	
		    	MeterUtil.addLoadingDiv(pid);
		    	curp.location.reload();
		    },
		    qtip:'刷新'
		    
		},
		close:{
		    id:'prclose',
		    handler: function(e, target, panel){
		        panel.ownerCt.remove(panel, true);
		    	
		    },
		    qtip:'关闭'
		},
		dump:{
		    id:'prdump',
		    handler: function(e, target, panel){
		    	var curp=window.frames[MeterUtil.getFrameId(panel.getId())];
		    	if(curp.prDump){
		    		curp.prDump();
		    	}
		    },
		    qtip:'导出'
		},
		filte:{
		    id:'prfilte',
		    handler: function(e, target, panel){
		    	var curp=window.frames[MeterUtil.getFrameId(panel.getId())];
		    	if(curp.prFilte){
		    		curp.prFilte();
		    	}
		    },
		    qtip:'筛选'
		    	
		},
		maximize:{
		    id:'prmaximize',
		    handler: function(e, target, panel){
		    	var curp=window.frames[MeterUtil.getFrameId(panel.getId())];
		    	if(curp.prMaximize){
		    		curp.prMaximize();
		    	}
		    },
		    qtip:'最大化'
		    	
		},
		help:{
		    id:'help',
		    on:{'mouseover' :function(e){
		    	var ss=e.getTarget('.x-panel',10,true);
		    	var p=Ext.getCmp(ss.id);
		    	if(!p.tip){
		    		p.tip=new Ext.ToolTip({mouseOffset:[-160,0],width:150,target:p.getTool('help'),html:MeterUtil.tips[ss.id]||'暂无描述'});
		    	}
		    	setTimeout(function(){
			    	try{
			    		p.tip.show();
				    }catch(e){}
		    	},100);
		    },
		    scope:this
		    }
		    
		}
};




var ToolSet={
		defBtns:[ToolButtons.refresh,ToolButtons.toggle,ToolButtons.close],
		selfRptButtons:[ToolButtons.dump,ToolButtons.filte,ToolButtons.toggle,ToolButtons.refresh,ToolButtons.help,ToolButtons.maximize,ToolButtons.close],
		todayMsg:[ToolButtons.refresh,ToolButtons.toggle,ToolButtons.settings,ToolButtons.close],
		onlyClose:[ToolButtons.close]
},
MeterUtil={
		indexL:0,
		indexR:0,
		defHeight:230,
		noRightPageHeight:80,
		pannelNum:0,
		getTools:function(obj){
			if(obj.toolType=='prbts'&&obj.prbts&&obj.prbts.length>0){
				var bts=[],abts=obj.prbts;
				for(var i=0;i<abts.length;i++){
					if(prBts[abts[i]]){
						bts.push(prBts[abts[i]]);
					}
					
				}
				return bts;
			}else{
				return ToolSet[obj.toolType];
			}
			
		},
		rptCfgs:{},
		panels:{},
		isBubble:function(reportId){
			
			var me=this, cfg,bubble=false;
			if(!this.rptCfgs['rpt_'+reportId]){
				jQuery.ajax({
	    			url:'/project/report/selDefineReportAction.do',
	    			data: {
	    				themethod:'getReportConfig',
	    				codeType:'utf-8',
	    				reportId:reportId,
	    				projectId:0,
	    				drillDown:0
	    			},
	    			type: 'post',
	    			async: false,
	    			success: function(res) {
	    				cfg=res
	    			},
	    			dataType: 'json'
	    		});
	        	
	        	this.rptCfgs['rpt_'+reportId]=cfg;
			}else{
				cfg=this.rptCfgs['rpt_'+reportId];
			}
        	
        	if(cfg&&cfg.chart&&cfg.chart.type=='bubble'){
        		bubble=true;
        	}
        	return bubble;
		},
		isIE8Bubble:function(reportId){
			var me=this;
        	return me.isBubble(reportId)&&me.isIE8();
		},
		toolDelArray:[],
		panelUrlsL:[],
		panelUrlsR:[],
		collectUrls:function(obj){
			if(obj.position=='left'){
				this.panelUrlsL.push(obj);
			}else{
				this.panelUrlsR.push(obj);
			}
			
		},
		hideCondition:function(pid){
			var panel = Ext.getCmp(pid);
    		var cWin = panel.filterIframe.contentWindow;
    		cWin.clearHeightSetters();
    		
			jQuery('#'+pid+'-con-div').css({display:'none'});
			var ch=this.hCaches[pid],p=Ext.getCmp(pid);
			if(ch){
				p.setHeight(ch);
			}
			p.conHide=true;
		},
		toggleUrl:function(obj){
			obj.index++;
			var urls,me=this;
			if(obj.left){
				obj.urls=me.panelUrlsR;
				obj.left=false;
			}else{
				obj.urls=me.panelUrlsL;
				obj.left=true;
			}
			
			
		},
		loadUrls:function(){
			var me=this,length=Math.max(this.panelUrlsL.length||0,this.panelUrlsR.length||0)*2;
			if(length<1)return;
			
			
			var iObj={urls:me.panelUrlsL,left:true,index:0,getUrl:function(){
				return this.urls[Math.floor(this.index/2)];
			}};
			
			if(iObj.urls.length>0){
				me.loadContent(iObj.getUrl());
				me.toggleUrl(iObj);
			}else{
				me.toggleUrl(iObj);
				me.loadContent(iObj.getUrl());
				me.toggleUrl(iObj);
			}
			var  intv=setInterval(function(){
				if(iObj.index==length){
					clearInterval(intv);
					return;
				}else{
					var url=iObj.getUrl();
					if(url){
						me.loadContent(url);
					}
					me.toggleUrl(iObj);
				}
				
			},500);
			
		},
		loadContent:function(cur){
			var curEl=document.getElementById(cur.frameId);
			curEl.setAttribute('src',cur.url);
		},
		genSelfRptUrl:function(reportId,panelId){
			var me=this,url='';  
			//0:table 2:gantt 3:calendar 10 pie 11 column 12 bubble
			if(me.isIE8Bubble(reportId)){
				url='/project/report/stdreport/selfDeffiningLayout.jsp?isBubble=1&reportId='+reportId+'&panelId='+panelId+'&projectId='+catchObj.projectId;
			}else if(me.isGanttRpt(reportId)){
				url='/project/report/stdreport/ganttChart.jsp?from=panel&reportId='+reportId+'&panelId='+panelId+'&projectId='+catchObj.projectId;
				me.toolDelArray.push({id:panelId,tool:'dump'});
			}else if(me.isCalendarRpt(reportId)){
				url='/project/report/stdreport/calendarChart.jsp?from=panel&reportId='+reportId+'&panelId='+panelId+'&projectId='+catchObj.projectId;
				me.toolDelArray.push({id:panelId,tool:'dump'});
			}else{
				
				url='/project/report/stdreport/selfDeffiningLayout.jsp?isBubble=0&reportId='+reportId+'&panelId='+panelId+'&projectId='+catchObj.projectId;

			}
			if(me.isBubble(reportId)){
				me.toolDelArray.push({id:panelId,tool:'dump'});
			}
			if(me.withExtGrid(reportId)){
				url+='&withExt=1';
			}else{
				url+='&withExt=0';
			}
			this.panels[panelId]=reportId;
			return url;
		},
		isGanttRpt:function(reportId){
			var me=this, rcfg=me.rptCfgs['rpt_'+reportId];
			if(rcfg.type==2){
				return true;
			}else{
				return false;
			}
		},
		isCalendarRpt:function(reportId){
			var me=this, rcfg=me.rptCfgs['rpt_'+reportId];
			if(rcfg.type==3){
				return true;
			}else{
				return false;
			}
		},
		withExtGrid:function(reportId){
			var me=this, rcfg=me.rptCfgs['rpt_'+reportId];
			if(rcfg.type==0&&!rcfg.grid.onlyCount){
				return true;
			}else{
				return false;
			}
		},
		frames:[],
		tips:{},
		setButtons:function(obj){
			if(obj.url.indexOf('buttonType')!=-1){
				obj.toolType='todayMsg';
			}else{
				obj.toolType='defBtns';
			}
			var url=obj.url;
			url=url.replace(/\s/g,'');
			var ms=url.match(/\b(buttons=\w+){1}(\,\w+)*(&|$)/);
			if(ms&&ms.length>0){
				var res=ms[0].replace(/&/g,'');
				if(res.indexOf('=')!=-1){
					res=res.substring(res.indexOf('=')+1).split(',');
					if(res.length>0){
						obj.toolType='prbts';
						obj.prbts=res;
					}
				}
				
			}
			
		},
		rptsCache:{},
		genMeter:function(obj){
			var me=this, panelId=obj.position+"-meter-"+(obj.position=="left"?this.indexL++:this.indexR++);
			me.rptsCache[panelId]=obj;
			var frameId=me.getFrameId(panelId);
			var url='';
			if(obj.allowAccess){
				if(obj.type==-2){
					obj.toolType='selfRptButtons';
					url=me.genSelfRptUrl(obj.reportId,panelId);
				}else{
					this.setButtons(obj);
					url=obj.url+(obj.url.indexOf('?')==-1?'?':'&')+'panelId='+panelId;
					url+='&projectId='+catchObj.projectId;
				}
			}else{
				obj.height= this.noRightPageHeight;
				
				obj.toolType='onlyClose';
				me.toolDelArray.push({id:panelId,tool:'toggle'});
				if(obj.url){
					url='/project/report/stdreport/noRightPage.jsp?panelId='+panelId;
				}else{
					url='/project/report/stdreport/noUrl.jsp?panelId='+panelId;
				}
			}
			this.collectUrls({url:url,frameId:frameId,position:obj.position});
			url='';
			this.pannelNum++;
			this.frames.push(frameId);
			this.tips[panelId]=obj.desc;
			return {
		     	id:panelId,
		    	title:obj.title,
		    	tools:me.getTools(obj),
		    	height:(obj.height||this.defHeight),
		    	html:me.getHtml(frameId, panelId,url),
		    	collapsible:false,
		    	desc:obj.desc
		    };
		},
		addLoadingDiv:function(panelId){
			var me=this,frameId=me.getFrameId(panelId);
			document.getElementById(panelId+'-div').style.display="block";
		},
		getLoadingDiv:function(frameId){
			return '<div id="'+
				frameId+'-loading" class="loading" style="z-index:100;position:absolute;"><div class="loding_position"><div class="loading_image"></div></div></div>';
		},
		getHtml:function(frameId,panelId,url){
			var me=this;
			return '<div style="width:100%;height:100%;"><div id="'+panelId+'-con-div" style="position:absolute;z-index:1000;left:-1px;border-bottom:1px solid #d0d0d0;display:none;"></div><div id="'+panelId+'-div">'+
			me.getLoadingDiv(frameId)+
			'</div><iframe scrolling="no" panelId="'+
			panelId+
			'" style="z-index:1;width:100%;height:100%;"  name="'+
			frameId+
			'"  id="'+
			frameId+
			'"   src="'+
			url+
			'" frameborder="0" ></iframe></div>';
		},
		meterNum:0,
		genMeters:function(lst){
			var result=[];
			for(var i=0;i<lst.length;i++){
				result[i]=this.genMeter(lst[i]);
			}
			this.meterNum+=lst.length;
			return result;
		},
		getPanelSize:function(id){
			var panel=Ext.getCmp(id);
			return {height:panel.getHeight(),width:panel.getWidth()};
		},
		setPanelHeight:function(id,height){
			Ext.getCmp(id).setHeight(height+(this.isIE()?40:30));
		},
		removeMeterTool:function(id,tool){
			var p=Ext.getCmp(id);
			if(p){
				var tool=p.getTool(tool);
				if(tool){
					tool.hide();
				}
			}
			
		},addMeterTool:function(id,tool){
			var p=Ext.getCmp(id);
			if(p){
				var tool=p.getTool(tool);
				if(tool){
					tool.show();
				}
			}
		},
		loaded:false,
		loadedNum:0,
		doLayOut:function(reset){
			var me=this;
			if(!me.loaded){
				if(++me.loadedNum==me.meterNum){
					me.loaded=true;
				}
				if(!me.loaded){
					return;
				}
			}
			
			var vp=this.viewport;
			if(!vp.preH){
				vp.preH=0;
			}
			var preH=vp.preH,vh=jQuery(jQuery('.x-column-inner')[0]).height(),vw=vp.getWidth(),dh=jQuery(jQuery('.x-panel-body')[0]).height();
			if((dh-preH)*(dh-vh)>(-0.1)){
				return ;
			}
			if(reset){
				var frames=this.frames;
				for(var i=0;i<frames.length;i++){
					var curf=frames[i],frame=document.getElementById(curf);
					if(frame&&frame.getAttribute('src').indexOf('calendarChart.jsp')!=-1){
						frame.style.width='70%';
					}
				}
			}
			this.viewport.doLayout();
			if(reset){
				var frames=this.frames;
				for(var i=0;i<frames.length;i++){
					var curf=frames[i],frame=window.frames[curf],pid=me.getPanelId(curf);
					if(frame){
						var eframe=document.getElementById(curf);
						if(eframe&&eframe.getAttribute('src').indexOf('calendarChart.jsp')!=-1){
							eframe.style.width='100%';
						}
						var curP=Ext.getCmp(pid);
						if(curP.collapsed){
							curP.shouldResetWidth=true;
						}else{
							var setGridWidth=frame.reseGridWidth;
							if(setGridWidth){
								setGridWidth(curP.getWidth());
							}
						}
						
					}
					me.setConditionWidth(pid)
				}
			}
			vp.preH=vh;
		},
		getFrameId:function(pid){
			return 'iframe-'+pid;
		},
		getPanelId:function(fid){
			return fid.substring(7);
		},
		setMeterHeight:function(id,height){
			var me=this, cp=Ext.getCmp(id);
			height+=(this.isIE()?37:25)
			if(!cp.loadFirstHeight){
				cp.setHeight(height);
				cp.loadFirstHeight=true;
			}else{
				cp.setHeight(height);
			}
			me.removeLoadingNode(id);
			me.hCaches[id]=height;
			setTimeout(function(){me.doLayOut(true);},10);
			
		},
		removeLoadingNode:function(id){
			var me=this, frameId=me.getFrameId(id);
			var loadingNode = document.getElementById(frameId+'-loading');
			if(loadingNode){
				loadingNode.parentNode.style.display='none';
			}
		},
		setMeterHeightForDrillGrid:function(id,height){
			var curPanel=Ext.getCmp(id);
			curPanel.setHeight(height+(this.isIE()?40:30));
		},
		resizePanel:function(obj){
			var win=obj;
			var doc=win.Document||win.contentDocument;
			if (doc.getElementById){
				 MeterUtil.setMeterHeight(win.getAttribute('panelId'),doc.body.scrollHeight);
			}
		},
		isIE:function(){
			var isIE=false;
			var ua = navigator.userAgent.toLowerCase();
			if (window.ActiveXObject)
				isIE = ua.match(/msie ([\d.]+)/).length>0;
			return isIE;
		},
		isIE8:function(){
			var isIE8v=false;
			var ua = navigator.userAgent.toLowerCase();
			isIE8v = ua.indexOf('msie 8.0')!=-1;
			return isIE8v;
		},
		delPanelsTool:function(){
			var me=this,ids=me.toolDelArray;
			for(var i=0;i<ids.length;i++){
				var cur=ids[i];
				me.removeMeterTool(cur.id,cur.tool);
			}
		},
		setCondition:function(pid,condition){
			var win=window.frames[MeterUtil.getFrameId(pid)];
			if(win.setCondition){
				win.setCondition(condition);
			}
			
		},
		genDashboard:function(lms,rms){
			var me=this;
			this.viewport=new Ext.Viewport({
				   id:'port-div',
			       layout:'border',
				   border:'none',
			        items:[{
			            xtype:'portal',
			            region:'center',
			            items:[{
			                columnWidth:.5,
			                style:'padding:15px 20px 20px 20px',
			                items:me.genMeters(lms)
			            },{
			                columnWidth:.5,
			                style:'padding:15px 20px 0px 0px',
			                items:me.genMeters(rms)
			            }]
			        }]
			    });
			
			setTimeout(function(){
				me.loadUrls();
				me.delPanelsTool();},500);
			
			return this.viewport;
			
			
		},
		hCaches:{},
		setConHeight:function(pid,height){
				var conDiv=jQuery('#'+pid+'-con-div');
				var conFrame=jQuery('#con-frame-'+pid);
//				var h=height+35;
				var h=height;
				conFrame.height(h);
				conDiv.height(h);
				var p=Ext.getCmp(pid);
				if((p.getHeight()-30)<h){
					p.setHeight(h+30);
				}
		},
		clearPanelCache:function(panel,pid){
			this.hCaches[pid]=null;
			panel.isloadedCondition = false;
			var conDiv=$('#'+pid+'-con-div');
    		conDiv.css({display:'none'});
		}
		,loadCon:function(panel,pid){
    		var data; 
	    	jQuery.ajax({
    			url:'/project/report/selDefineReportAction.do',
    			data: {
    				themethod:'getCondition',
    				codeType:'utf-8',
    				reportId:MeterUtil.panels[pid]
    			},
    			type: 'post',
    			async: false,
    			success: function(res) {
    				data=res
    			},
    			dataType: 'json'
    		});
	    	var i=0;
	    	if(!(data&&data.fieldList&&data.fieldList.length>0))
	    		return;
	    	var array=data.fieldList;
	    	for(var j=0;j<array.length;j++){
	    		if(!array[j].hide){
	    			i=1;
	    			break;
	    		}
	    	}
	    	if(i>0){
	    		if(!panel.isloadedCondition){
	    			var box=panel.getBox();
	    			if(!panel.filterIframe){
	    				panel.filterIframe = $('<iframe src="/project/share/filterForm.jsp" id="con-frame-'+pid+'" frameborder="0"  style="width:'+(box.width)+'px;height:100%;"/>')[0];
	    			}else{
	    				panel.filterIframe.contentWindow.location.reload();
	    			}
		    		var conDiv=$('#'+pid+'-con-div');
		    		conDiv.append(panel.filterIframe);
		    		conDiv.css({display:'block',height:'0px'});
		    		var style=document.getElementById('con-frame-'+pid).style;
		    		style.position='relative';
		    		style.zIndex='10000';
		    		
		    		
		    		var timeId;
		    		var cWin = panel.filterIframe.contentWindow;
		    		timeId = setInterval(function(){
		    			if(cWin && cWin.initForm){
							clearInterval(timeId);
							cWin.pId=pid;
							cWin.initForm(data);
		    			}
		    		}, 100);
		    		panel.isloadedCondition = true;
		    	}else{
		    		var box=panel.getBox();
		    		var conDiv=$('#'+pid+'-con-div');
		    		var wpx=(box.width)+'px';
		    		conDiv.css({width:wpx,display:'block'});
		    		var style=document.getElementById('con-frame-'+pid).style;
		    		style.width=wpx;
		    		var h=conDiv.height();
		    		var p=Ext.getCmp(pid);
					if(p.getHeight()<(h+30)){
						p.setHeight(h+30);
					}
		    	}
	    		var interValId;
	    		interValId = setInterval(function(){
	    			var cWin = panel.filterIframe.contentWindow;
	    			if(cWin && cWin.addHeightSetter){
						clearInterval(interValId);
			    		cWin.addHeightSetter();
	    			}
	    		}, 100);
	    		panel.conHide=false;
	    	}
	    
		},
		setConditionWidth:function(pid){
			var p=Ext.getCmp(pid);
			if(p&&p.conHide===false){
				var conDiv=$('#'+pid+'-con-div');
	    		var wpx=(p.getWidth())+'px';
	    		conDiv.css({width:wpx});
	    		var style=document.getElementById('con-frame-'+pid).style;
	    		style.width=wpx;
			}
		}
};
//导出Excel
function exportExcel(obj){
	if(obj){
		var type = obj.cfg.type;
		var dataObj = new Object();
		dataObj.projectId = obj.cfg.projectId;
		dataObj.reportId = obj.cfg.reportId;
		dataObj.type = type;
		dataObj.condition = obj.cfg.condition;
		//type    0：table 10:pie 11:column
		if(type == 0){//表格
			if(obj.cfg.hasData == false){
				alert("没有可导出的数据！");
				return false;
			}
			dataObj.templateName = "table";
		}else if(type == 10){//饼图
			if(obj.data == undefined){
				alert("没有可导出的数据！");
				return false;
			}
			dataObj.group = obj.cfg.group;
			dataObj.value = obj.cfg.value;
			dataObj.templateName = "pie";
			dataObj.dataStr = JSON.stringify(obj.data);
		}else if(type == 11){//柱状图
			if(obj.data == undefined){
				alert("没有可导出的数据！");
				return false;
			}
			var isPileUp = obj.cfg.isPileUp;
			//isPileUp    0:no 1:yes堆积 
			if(obj.cfg.legends.length == 1 &&obj.cfg.legends[0] == ""){
				dataObj.templateName = "columnSingleSeries";
			}else{
				if(isPileUp == 1){
					dataObj.templateName = "columnDJ";
				}else{
					dataObj.templateName = "column";
				}
			}
			dataObj.group = obj.cfg.group;
			dataObj.titleStr = JSON.stringify(obj.cfg);
			dataObj.dataStr = JSON.stringify(obj.data);
		}
		var toURL = "/project/report/reportExportExcelAction.do";
		Common.sendFormData(toURL,undefined,function(res) {
			if(res.timeOut){
				alert('系统session超时，请重新登录');
			}else{
				if (res.success) {
					var obj = document.getElementById("dowloadFrame");
					obj.src = "/project/report/downloadFileAction.do?fileName="+res.fileName;
				} else {
					alert("导出失败");
				}
			}
			
		}, dataObj);
	}
}




