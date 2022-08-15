




var reportParameters={
	dumpExcel:'0',
	thegrid:'first',
	setParameter:function(){
		this[arguments[0]]=arguments[1];
	}
};
var reportDefConfig={
	firstColFunc:undefined,
	chartHeight:300,
	chartWidth:400,
	gridTitle:'数据分析',
	gridMargins:'5 5 5 0',
	chartdefPosition:'north',
	blankTitle:'&nbsp;',
	noTitle:'',
	chartPath:'/download/',
	chartImageLoded:false,
	chartdiv:'vp-charts-container',
	gridType:{
		lockingGrid:'lockingGrid',
		listGrid:'listGrid',
		treeGrid:'treeGrid'
	},
	layoutType:{
		singleGrid:'singleGrid',
		singleChart:'singleChart',
		chartAndGrid:'chartAndGrid',
		tchart_blgrg:'t-chart_b-lgrg'
	},
	chartPosition:{
		right:'right',
		top:'top',
		bottom:'bottom',
		left:'left'
	}
	,
	chartType:{
		pieChart:'pieChart',
		lineChart:'lineChart',
		columnChart:'columnChart',
		barChart:'barChart',
		groupColumnChart:'groupColumnChart',
		columnChartRowMapping:'columnChartRowMapping'
	},
	isHasData:false
};

var Report=function(config){
	this.config=config;
	this.layoutItems=[];
	this.innerPanel;
	this.outterPanel;
	this.gridMargins;
	this.chartMargins;
	
	this.doLayout=function(){
		this.configReportdiv();
		this.configDefparas();
		this.genChart();
		this.genGrid();
		this.genInnerPanel();
		this.genOutterPanel();
	    this.showGrid();
	    this.showSifterWindow();

	};
	
	this.hasData =function(){
		return reportDefConfig.isHasData;
	};
	this.showSifterWindow=function(){
		if(!this.config.showSifter)
			return;
		
		//if(this.config.showSifter.show){
			if(!this.config.showSifter.func)
				alert('请配置展示过滤器应调用的方法！');
			else{
				this.config.showSifter.func();
			}
				
		//}
	};
	this.genUrl=function(reportParas){
		if(!reportParas){
			reportParas=reportParameters;
		}else{
			for(var vattr in reportParas){
				reportParameters[vattr]=reportParas[vattr];
			}
		}

		var url=config.action;
		var i=0, paras='';
		for(var vattr in reportParameters){
			i++;
			paras +=vattr+'='+reportParameters[vattr]+'&';
		}
		
		if(i>0)
			url+='?'+paras+'layout='+config.layout+'&time='+ (new Date().getTime());
		return url;
	};
	
	
	this.configReportdiv=function(){
		
		var innerdiv='<div id="outter-div" style="text-align:left;margin-left:auto;margin-right:auto;width:100%;height:100%;">'+
					 '	<div id="outter-panel" style="margin-left:auto;margin-right:auto;border-left:1px solid  #aaa;border-right:1px solid  #aaa;border-bottom:1px solid  #aaa;height:100%;">'+
					 '		<div id="inner-panel" style="border:0px solid  #aaa;"></div>'+
					 '	</div>'+
					 '</div>';
		jQuery('#'+config.reportdiv).html(innerdiv);
		
		var cssobj={
			//'text-align':"center",
			width:"100%",
			'margin-left':"auto",
			'margin-right':"auto",
			display:"block"
		};
		jQuery('#'+config.reportdiv).css(cssobj);
	};
	
	
	
	this.genInnerPanel=function(){
		this.innerPanel = new Ext.Panel({
				border:true,
				layout: 'border',
				renderTo:'inner-panel',
				items:this.layoutItems
			 });
	};
	
	
	this.genOutterPanel=function(){
		this.outterPanel=new Ext.Panel({
		        title:reportDefConfig.noTitle,
		        collapsible:false,
		        renderTo: 'outter-panel',
		        height:Ext.get(this.config.reportdiv).getComputedHeight(),
		        border:false,
		        layout:'fit',
		        items:[this.innerPanel]
		    });
	};
	
	
	this.genChart=function(){
		if(config.layout==reportDefConfig.layoutType.singleGrid)
			return;
		
		this.configChart();
		this.configChartParas();
		this.pushChartItem();
		
	};
	
	
	this.pushChartItem=function(){
	
		this.chartMargins='5 5 5 5';
		this.gridMargins='0 0 0 0';
		var position=reportDefConfig.chartdefPosition;
		if(config.layout==reportDefConfig.layoutType.singleChart){
			position='center';
			
		} 	
		if(this.config.layout==reportDefConfig.layoutType.chartAndGrid){
			if(this.config.chartPosition===reportDefConfig.chartPosition.left){
				VPChartcfg.setLegendPosition('bottom');
				VPChartcfg.setConfigPieMarginTop(true);
				position='west';
				this.gridMargins='5 5 5 0';
			}else if(this.config.chartPosition===reportDefConfig.chartPosition.top){
				VPChartcfg.setLegendPosition('right');
				position='north';
				this.gridMargins='0 5 5 5';
			}else if(this.config.chartPosition===reportDefConfig.chartPosition.bottom){
				VPChartcfg.setLegendPosition('right');
				position='south';
				this.gridMargins='5 5 0 5';
			}else if(this.config.chartPosition===reportDefConfig.chartPosition.right){
				
				VPChartcfg.setLegendPosition('bottom');
				VPChartcfg.setConfigPieMarginTop(true);
				position='east';
				this.gridMargins='5 0 5 5';
			}
		}
		var charthight=config.chartHeight||reportDefConfig.chartHeight;
		var chartWidth=config.chartWidth||reportDefConfig.chartWidth;
		var chartitem={region:position,width:chartWidth,height:charthight,autoScroll:true,margins:this.chartMargins,html:'<div id="vp-charts-container" style="width:100%;height:100%;" ></div>'};
		chartitem.collapsible=(this.config.chartCollapse?true:false);
		this.pushItem(chartitem);
	};
	
	
	this.configChart=function(){		

			switch(this.config.chartConfig.chartType){
			case reportDefConfig.chartType.pieChart:
				VPChartcfg.chartCfg=VPChartcfg.pieChartcfg;
				VPChartcfg.showChart=VPChartcfg.showPiechart;
				//if(!VPChartcfg.contains0)
				//	this.config.chartConfig.contains0?(VPChartcfg.contains0=this.config.chartConfig.contains0):(VPChartcfg.contains0=false);
				break;
	
			case reportDefConfig.chartType.columnChart:
				VPChartcfg.chartCfg=VPChartcfg.columnChartcfg;
				VPChartcfg.showChart=VPChartcfg.showCloumnChart;
				break;
				
			case reportDefConfig.chartType.lineChart:
				VPChartcfg.chartCfg=VPChartcfg.lineChartcfg;
				VPChartcfg.showChart=VPChartcfg.showLineChart;
				VPChartcfg.chartCfg.graphs[0]={
							title:"",
							valueField:null,
							bullet:"round",
							balloonText:"[[category]]:[[value]]",
							lineAlpha:1
						};
				break;
			
			case reportDefConfig.chartType.barChart:
				VPChartcfg.chartCfg=VPChartcfg.barChartcfg;
				VPChartcfg.showChart=VPChartcfg.showBarChart;
				VPChartcfg.chartCfg.rotate=true;
				break;
			case reportDefConfig.chartType.groupColumnChart:
				VPChartcfg.chartCfg=VPChartcfg.columnChartcfg;
				VPChartcfg.showChart=VPChartcfg.showGroupColumnChart;
				break;
			case reportDefConfig.chartType.columnChartRowMapping:
				VPChartcfg.chartCfg=VPChartcfg.columnChartcfg;
				VPChartcfg.showChart=VPChartcfg.showColumnChartRowMapping;
				break;
		}
	};
	
	this.configChartParas=function(){
		reportParameters.chartType=this.config.chartConfig.chartType;
		reportParameters.xAxis=this.config.chartConfig.xAxis;
		reportParameters.yAxis=this.config.chartConfig.yAxis;
		reportParameters.xAxisName=this.config.chartConfig.xAxisName;
		reportParameters.yAxisName=this.config.chartConfig.yAxisName;
		reportParameters.allowDecimals=this.config.chartConfig.allowDecimals;
		reportParameters.chartTitle=this.config.chartConfig.title;
		reportParameters.chartSubtitle=this.config.chartConfig.subtitle;
		reportParameters.legend=this.config.chartConfig.legend;
		reportParameters.filterData=(this.config.chartConfig.withFilter?true:false);
		this.config.chartConfig.legendx!==undefined?(reportParameters.legendx=this.config.chartConfig.legendx):null;
		this.config.chartConfig.legendy!==undefined?(reportParameters.legendy=this.config.chartConfig.legendy):null;
		reportParameters.headers=(this.config.gridConfig?this.config.gridConfig.column:[]);
		VPChartcfg.setfilterDataFunc(reportParameters);
	};
	
	this.pushItem=function(item){
		if(item!=null)
			this.layoutItems.push(item);
	};
	
	
	this.genGrid=function (){
		if(config.layout==reportDefConfig.layoutType.singleChart)
			return;
		this.configGridLayout();		
	};
	
	this.configGridLayout=function(){
		switch(this.config.layout){
			case reportDefConfig.layoutType.tchart_blgrg:
				this.configLAndRGridFunctions();
				this.configLAndRGrid();
				break;
	
			default :
				this.configDefFunctions();
				this.configSigleGrid();
				break;
		}
	};
	
	this.configLAndRGridFunctions=function(){
		this.showGrid=this.showLRListGrid;
		this.reloadGridData=this.reloadLRListGridData;
		reportDefConfig.firstColFunc=config.gridConfig.lg.column[0].renderer;
		config.gridConfig.lg.column[0].renderer=this.showChartRenderer;						
	};
	
	this.configLAndRGrid=function(){
			var zsItems=[];
			this.config.gridConfig.lg.renderTo='grid-divl';
			this.config.gridConfig.rg.renderTo='grid-divr';
			var ltitle='';
			var rtitle='';
	
			if(!this.config.gridConfig.lg.width)
				this.config.gridConfig.lg.width=700;
			var lwidth=this.config.gridConfig.lg.width;
			var rwidth=Ext.getBody().getComputedWidth()-this.config.gridConfig.lg.width;
			zsItems.push({region:'center',title:ltitle,width:lwidth,collapsible:false,margins:'0 5 5 5',html:'<div id="grid-divl" style="border:1px solid #d0d0d0;height:100%;"></div>'});
			zsItems.push({region:'east',title:rtitle,width:rwidth,collapsible:false,margins:'0 5 5 0',html:'<div id="grid-divr" style="border:1px solid #d0d0d0;height:100%;"></div>'});
			this.config.gridConfig.rg.width=undefined;
			this.config.gridConfig.lg.width=undefined;
			
			this.pushItem({region:'center',xtype:'panel',
				border:true,
				layout: 'border',
				//renderTo:'inner-panel',
				items:zsItems
			 });
			
	};
	this.configSigleGrid=function(){
			
			this.config.gridConfig.renderTo='grid-div';
			var title=reportDefConfig.gridTitle;
			if(config.layout==reportDefConfig.layoutType.singleGrid){
				this.gridMargins='0 0 0 0';
				//title=defConfig.blankTitle;
				title=reportDefConfig.noTitle;
			}
	
			this.pushItem({region:'center',autoScroll:false,layout:'fit',title:title,collapsible:false,margins:this.gridMargins,html:'<div id="grid-div" style="border:1px solid #d0d0d0;height:100%;width:100%;"></div>'});
			
	
	}
	this.configDefFunctions=function(){
		switch(config.gridConfig.gridType){
			case reportDefConfig.gridType.listGrid:
				this.showGrid=this.showListGrid;
				this.reloadGridData=this.reloadListGridData;
				reportDefConfig.firstColFunc=config.gridConfig.column[1].renderer;
				config.gridConfig.column[1].renderer=this.showChartRenderer;
				break;
	
			case reportDefConfig.gridType.treeGrid:
				this.showGrid=this.showTreeGrid;
				this.reloadGridData=this.reloadTreeGridData;
				reportDefConfig.firstColFunc=config.gridConfig.column[1].renderer;
				config.gridConfig.column[1].renderer=this.showChartRenderer;
				break;
				
			case reportDefConfig.gridType.lockingGrid:
				this.showGrid=this.showLockingGrid;
				this.reloadGridData=this.reloadLockingGridData;
				reportDefConfig.firstColFunc=config.gridConfig.userCm[1].renderer;
				config.gridConfig.userCm[1].renderer=this.showChartRenderer;
				break;
		}
	};
	
	this.reConfigRenderers=function(){

		switch(config.gridConfig.gridType){
			case reportDefConfig.gridType.listGrid:
				reportDefConfig.firstColFunc=config.gridConfig.column[1].renderer;
				config.gridConfig.column[1].renderer=this.showChartRenderer;
				break;
	
			case reportDefConfig.gridType.treeGrid:

				reportDefConfig.firstColFunc=config.gridConfig.column[1].renderer;
				config.gridConfig.column[1].renderer=this.showChartRenderer;
				break;
				
			case reportDefConfig.gridType.lockingGrid:
				reportDefConfig.firstColFunc=config.gridConfig.userCm[1].renderer;
				config.gridConfig.userCm[1].renderer=this.showChartRenderer;
				break;
		}
	};
	this.configDefparas=function(){
		if(!this.config.action){
			alert('请设置action参数！');
			
		}else
			this.genUrl(this.config.defaultParas);
	};
	
	this.showGrid=function(){
		;
	};
	
	this.listgridl,this.listgridr;
	this.showLRListGrid=function(){
		this.config.gridConfig.lg.height=Ext.get('grid-divl').getComputedHeight();
		this.config.gridConfig.rg.height=Ext.get('grid-divr').getComputedHeight();
		this.config.gridConfig.lg.url=this.config.gridConfig.rg.url=this.genUrl();
		this.listgridl=new GridList(this.config.gridConfig.lg);
		this.listgridr=new GridList(this.config.gridConfig.rg);
		jQuery('#grid-divl').find('.x-panel-body').each(function(){
				jQuery(this).css('height',(Ext.get('grid-divl').getComputedHeight()-5)+'px');
		});
		jQuery('#grid-divr').find('.x-panel-body').each(function(){
				jQuery(this).css('height',(Ext.get('grid-divr').getComputedHeight()-5)+'px');
		});
	};
	
	
	this.reloadLRListGridData=function(){
		reportParameters.thegrid='first';
		this.listgridl.load(this.genUrl());
		reportParameters.thegrid='second';
		this.listgridr.load(this.genUrl());
		reportParameters.thegrid='all';
	}
	
	
	
	this.listgrid;
	this.showListGrid=function(){
		this.config.gridConfig.height=Ext.get('grid-div').getComputedHeight();
		this.config.gridConfig.width=Ext.get('grid-div').getComputedWidth();
		
		this.config.gridConfig.url=this.genUrl();
		this.listgrid=new GridList(this.config.gridConfig);
		var barHeight=30;
		if(!this.config.gridConfig.pageSize)
			barHeight=5;
		jQuery('#grid-div').find('.x-panel-body').each(function(){
				jQuery(this).css('height',(Ext.get('grid-div').getComputedHeight()-barHeight)+'px');
		});
	};
	
	
	this.reloadListGridData=function(){
		this.listgrid.load(this.genUrl());
	}
	
	
	
	this.lockgrid;
	this.showLockingGrid=function(){
		 initMask(this.config.gridConfig.renderTo);
		 showMask();
		 this.config.gridConfig.height=Ext.get('grid-div').getComputedHeight();
		 this.lockgrid=new LockGrid(this.config.gridConfig);
	};
	this.reloadLockingGridData=function(){
		 showMask();
		this.lockgrid.load(this.genUrl(),this.config.gridConfig.pageSize);
	};
	
	
	
	
	
	
	this.treegrid;
	this.showTreeGrid=function(){
		this.config.gridConfig.height=Ext.get('grid-div').getComputedHeight();
		this.treegrid = new GridTree(this.config.gridConfig);
	};
	this.reloadTreeGridData=function(){
		this.treegrid.load(this.genUrl());
	};
	
	
	 
	this.showChartRenderer=function(value,metadata,record,rowIndex){
			if(rowIndex==0){
				reportDefConfig.isHasData=true;
				if(VPChartcfg.showChart)
					VPChartcfg.showChart(false,record);
			}

		if(reportDefConfig.firstColFunc)
				return (reportDefConfig.firstColFunc)(value,metadata,record,rowIndex);
		else
				return value;

	};
	
	this.reloadReport=function(){
		this.removeChart();
		this.isHasData=false;
		if(this.config.layout!=reportDefConfig.layoutType.singleChart)
			this.reloadGridData();
		else
			this.reloadSingleChart();
	};
	
	this.removeChart=function(){
		jQuery('#'+reportDefConfig.chartdiv).html('');
	};
	this.reloadSingleChart=function(){
		var url=this.genUrl();
		  jQuery.ajax({
	        url: url,                               
	        type: 'post',                                                 
	        async: false,
	        success: function(res){
	        	
				res=eval("("+res+")");
				if(res.root.length>0)
					reportDefConfig.isHasData=true;
				if(VPChartcfg.showChart)
					VPChartcfg.showChart(true,res);
	        }
	    });
	};
	
	
	
	this.dumpExcel=function(){
		if(!this.hasData()){
			alert('没有数据，无法导出！');
			return;
		}
		reportParameters.dumpExcel='1';
		var url=this.genUrl();
		reportParameters.dumpExcel='0';
		  jQuery.ajax({
	        url: url,                               
	        type: 'post',                                                 
	        async: false,
	        success: function(res){
					res = eval("(" + res + ")");
					if(res.success){
						//Common.showMessage("导出成功");
						var obj = document.getElementById("dowloadFrame");
						obj.src = "/project/system/tools/downloadFileUtilAction.do?fileName="+res.fileName;
					}else{
						Common.showMessage("导出失败\n" + res.errMessage);
					}
	        }
	    });
	
	};
	
	this.reconfigGridAndLoad=function(){
		this.removeGrid();
		this.config.gridConfig=arguments[0];
		this.reConfigRenderers();
		this.showGrid();
		this.reloadReport();
	};
	
	this.removeGrid=function(){
		jQuery('#grid-div').html('');
	};
	
};


(function(url){ 
	var rootObject=document.getElementsByTagName("head")[0];
	var oXmlHttp; 
	if(window.XMLHttpRequest){
		oXmlHttp= new XMLHttpRequest() ;
    }else if(window.ActiveXObject){//IE 
    	oXmlHttp= new ActiveXObject("MsXml2.XmlHttp");
    }   
    oXmlHttp.onreadystatechange=function(){ 
        if (oXmlHttp.readyState == 4){
            if ( oXmlHttp.status == 200||oXmlHttp.status==304){ 
            	var oScript = document.createElement("script"); 
              	oScript.type = "text/javascript"; 
              	oScript.src = url; 
              	rootObject.appendChild(oScript); 
            }else{ 
                alert( 'XML request error: ' + oXmlHttp.statusText + ' (' + oXmlHttp.status + ')' ) ; 
            } 
        } 
     };
  oXmlHttp.open('GET', url, false); 
  oXmlHttp.send(null); 
  var oScript = document.createElement("script");
  oScript.type = "text/javascript";  
  oScript.text = oXmlHttp.responseText; 
  rootObject.appendChild(oScript);
})("/project/js/amcharts.js");
/*
(function(){

var amcharts=document.createElement("script");   
amcharts.type = "text/javascript";   
amcharts.src ='/project/js/amcharts.js';   
document.getElementsByTagName("head")[0].appendChild(amcharts); 
})();

*/


var VPChartcfg={};
VPChartcfg.setLegendPosition=function(pos){
	this.chartCfg.legend.position=pos;
};
VPChartcfg.title={text: ''};
VPChartcfg.subtitle={text: ''};
VPChartcfg.contains0=true;
VPChartcfg.configPieMarginTop=false;
VPChartcfg.legend={
			layout: 'vertical',//'horizontal',vertical
			align: 'right',
			verticalAlign: 'top',
			x:-100,
			y: 30,
			itemWidth:120,
			floating: true,
			borderWidth: 0,
			backgroundColor: '#FFFFFF',
			width:120,
			//height:50,
			labelFormatter:function(){
				return '<div style="font-size:13px;border:0px solid #000;v-align:bottom;line-height:13px;top:3px;position:relative;">'+this.name+'</div>';
			}
		};
VPChartcfg.getLegend=function(){
	return VPChartcfg.legend;
};
VPChartcfg.setConfigPieMarginTop=function(){
	this.configPieMarginTop=arguments[0];
};

VPChartcfg.getConfigPieMarginTop=function(){
	return this.configPieMarginTop;
};


VPChartcfg.margin={
	right:150,
	left:100,
	top:50,
	bottom:30
};




VPChartcfg.lineChartcfg=VPChartcfg.columnChartcfg=VPChartcfg.barChartcfg={
		createType:"AmSerialChart",
		type:'columnChart',
		target:reportDefConfig.chartdiv,
		dataProvider:null,
		categoryField:null,
		rotate:false,
		//depth3D:5,
		//angle:60,
		categoryAxis:{
			gridPosition:"start",
			labelRotation:45,
			axisColor:"#DADADA",
			fillAlpha:1,
			gridAlpha:0,
			fillColor:"#FAFAFA",
			title:""
		},
		valueAxis:{
			axisColor:"#DADADA",
			title:"",
			gridAlpha:0.1
		},
		graphs:[{
			title:"",
			valueField:null,
			type:"column",
			balloonText:"[[category]]:[[value]]",
			lineAlpha:0,
			//fillColors:"#bf1c25",
			fillAlphas:1
		}],
		legend:{
			position:'right',
			borderAlpha:0,
			horizontalGap:10,
			autoMargins:false,
			marginLeft:20,
			marginRight:20,
			switchType:"v"
		}
	};


VPChartcfg.pieChartcfg={
		target:reportDefConfig.chartdiv,
		createType:"AmPieChart",
		type:"pieChart",
        dataProvider:null,
        titleField:null,
        valueField:null,
        legend:{
        	align:"center",
            markerType:"square",
 			labelText:"[[title]]",
 			valueText:"",
 			position:"bottom",
 			maxColumns:3,
 			switchType:"v"
        }
};
AmChartUtil={
		check:function(citem){
			if(!citem){
				return false;
			}else{
				return true;
			}
		},
		removePreChart:function(){
			jQuery('#'+reportDefConfig.chartdiv).html('');
		},
		genTypeChart:function(cfg){
			
			var chart;
			if(cfg.createType=="AmSerialChart"){
				
				chart= new AmCharts.AmSerialChart(); 
				chart.categoryField = cfg.categoryField;         
				chart.rotate = cfg.rotate;
				this.loadPros(chart.categoryAxis,cfg.categoryAxis);
				chart.addValueAxis(this.loadPros(new AmCharts.ValueAxis(),cfg.valueAxis));
				 for(var i=0;i<cfg.graphs.length;i++){
					chart.addGraph(this.loadPros(new AmCharts.AmGraph(),cfg.graphs[i]));
				 }
			}else if(cfg.createType=="AmPieChart"){
				chart= new AmCharts.AmPieChart(); 
				this.loadPros(chart,cfg);

			}
			return chart;
		},
		loadPros:function(des,src){
			for(var i in src){
				des[i]=src[i];
			}
			return des;
		},
		createChart:function(cfg){
			this.cfg=cfg;
			var chart = this.genTypeChart(cfg);
			chart.dataProvider = cfg.dataProvider;
			if(cfg.title)
				chart.addTitle(cfg.title);
			chart.labelRadius = -30;
			chart.addLegend(this.genLengend(cfg));
			this.removePreChart();
			chart.write(cfg.target);
			return chart;

			
		},genLengend:function(cfg){
			return this.loadPros(new AmCharts.AmLegend(),cfg.legend);
			
		}
	};
VPChartcfg.genDefCharts=function (){
	this.collectDefData.apply(this,arguments);
	this.changChartHeight();
	 AmChartUtil.createChart(this.chartCfg);
	
};
VPChartcfg.isIE=function(){
	var isIE=false;
	var ua = navigator.userAgent.toLowerCase();
	if (window.ActiveXObject)
		isIE = ua.match(/msie ([\d.]+)/).length>0;
	return isIE;
};


VPChartcfg.changChartHeight=function(){
	if(this.chartCfg.type=='bar'){
		if(this.chartCfg.dataProvider.length>15){
			var height=this.chartCfg.dataProvider.length*20;
			if(Ext.get(reportDefConfig.chartdiv).getComputedHeight()<height)
				jQuery('#'+reportDefConfig.chartdiv).css('height',height+'px');
		}
	}
	//if(!VPChartcfg.isIE()){
		var target=jQuery('#'+this.chartCfg.target);
		var parent=target.parent('.x-panel-body');
		parent.css('border','1px solid #d0d0d0');
	//}
	
};

VPChartcfg.pieMinPercent=0.015;
VPChartcfg.setfilterDataFunc=function(reportPara){
	if(reportPara.filterData){
		VPChartcfg.isChartData=function(data,isRecord){
			if(isRecord){
				return data.get('isChartData');
			}else{
				return data['isChartData'];
			}
		};
	}else{
		VPChartcfg.isChartData=function(data,isRecord){
			return true;
		};
	}
}
VPChartcfg.showPiechart=function(){
		var singleChart=arguments[0];
		var x,y,xAxis=reportParameters.xAxis,yAxis=reportParameters.yAxis,jroot,dataArray=new Array();
		if(!singleChart){
			var store=arguments[1].store;
			var length=store.getCount();
			for (var i=0;i<length;i++){
				
				var cur=store.getAt(i);
				if(!this.isChartData(cur,true)){
					continue;
				}
				x=cur.get(xAxis);
				y=parseFloat(cur.get(yAxis));
				dataArray.push({xAxis:x,yAxis:y});
				
			}	
		}else{
			jroot=arguments[1].root;
			var length=jroot.length;
			for (var i=0;i<length;i++){
				var cur=jroot[i];
				if(!this.isChartData(cur,false)){
					continue;
				}
				x=cur[xAxis];
				y=parseFloat(cur[yAxis]);
				dataArray.push({xAxis:x,yAxis:y});
			}
				
		}
		this.chartCfg.dataProvider=dataArray;
		this.chartCfg.titleField="xAxis";
		this.chartCfg.valueField="yAxis";
		this.configOddsInfo();
		//this.configPiesSize();	
		 AmChartUtil.createChart(this.chartCfg);			
};


VPChartcfg.configPiesSize=function(){
	if(this.getConfigPieMarginTop())
		VPChartcfg.pieChartcfg.chart.marginTop=-155;
	   //	VPChartcfg.pieChartcfg.chart.marginTop=(-30)-(Ext.get(reportDefConfig.chartdiv).getComputedHeight()-Ext.get(reportDefConfig.chartdiv).getComputedWidth());
	else
			VPChartcfg.pieChartcfg.chart.marginTop=30; 
			  
			
		
	    VPChartcfg.pieChartcfg.chart.marginLeft=115;
	    VPChartcfg.pieChartcfg.chart.marginRight=115;
	    //VPChartcfg.pieChartcfg.chart.marginTop=50;
	    VPChartcfg.pieChartcfg.chart.marginBottom=10;
};



VPChartcfg.showLineChart=function(){
	this.genDefCharts.apply(this,arguments);
	
 	
}

VPChartcfg.collectDefData=function(){
	var singleChart=arguments[0];
	var x,y,xAxis=reportParameters.xAxis,yAxis=reportParameters.yAxis,jroot,dataArray=[];
	if(!singleChart){
		var store=arguments[1].store,length=store.getCount();
		for (var i=0;i<length;i++){
			var cur=store.getAt(i);
			if(!this.isChartData(cur,true)){
				continue;
			}
			var curo={};
			curo[xAxis]=cur.get(xAxis);
			curo[yAxis]=cur.get(yAxis);
			dataArray.push(curo);
		}	
	}else{
		jroot=arguments[1].root;
		var length=jroot.length;
		for (var i=0;i<length;i++){
			var cur=jroot[i];
			if(!this.isChartData(cur,false)){
				continue;
			}
			
			//dataArrayy.push(parseFloat(y));
			var curo={};
			curo[xAxis]=cur[xAxis];
			curo[yAxis]=cur[yAxis];
			dataArray.push(curo);
		}				
	}

	this.chartCfg.dataProvider=dataArray;
	this.chartCfg.categoryField=xAxis;
	this.chartCfg.graphs[0].valueField=yAxis;
	VPChartcfg.configOddsInfo();
};

VPChartcfg.collectGroupColumnData=function(){
	var singleChart=arguments[0];
	var x,y,jroot,graphs=[],
	xAxis=reportParameters.xAxis,yAxis=reportParameters.yAxis,dataArray=[];
	for(var j=0;j<yAxis.length;j++){
			graphs[j]={
				title:"",
				valueField:yAxis[j],
				type:"column",
				balloonText:"[[category]]:[[value]]",
				lineAlpha:0,
				fillAlphas:1
			};
	}
	if(!singleChart){
		var store=arguments[1].store;
		var length=store.getCount();
		for (var i=0;i<length;i++){
			var cur=store.getAt(i);
			if(!this.isChartData(cur,true)){
				continue;
			}
			
			var curo={};
			curo[xAxis]=cur.get(xAxis);
			for(var j=0;j<yAxis.length;j++){
				var curY=yAxis[j];
				curo[curY]=cur.get(curY);
			}
			dataArray.push(curo);
		}	
	}else{
		jroot=arguments[1].root;
		var length=jroot.length;
		for (var i=0;i<length;i++){
			var cur=jroot[i];
			if(!this.isChartData(cur,false)){
				continue;
			}
			var curo={};
			curo[xAxis]=cur[xAxis];
			for(var j=0;j<yAxis.length;j++){
				var curY=yAxis[j];
				curo[curY]=cur[curY];
			}
			dataArray.push(curo);
			
			
		}				
	}
	
	
	
	
	this.chartCfg.dataProvider=dataArray;
	this.chartCfg.categoryField=xAxis;
	this.chartCfg.graphs=graphs;
	VPChartcfg.configOddsInfo();
}
VPChartcfg.showGroupColumnChart=function(){
	VPChartcfg.collectGroupColumnData.apply(this,arguments);
	this.changChartHeight();
	AmChartUtil.createChart(this.chartCfg);
};

VPChartcfg.configOddsInfo=function(){
	if(reportParameters.legend&&(reportParameters.chartType!='pieChart')){
		var legend=reportParameters.legend ,yAxis=reportParameters.yAxis;
		if((typeof legend==='object')&&(legend.constructor===Array)){
			if((typeof yAxis==='object')&&(yAxis.constructor===Array)&&(yAxis.length==legend.length)){
				for(var i=0;i<legend.length;i++){
					this.chartCfg.graphs[i].title=legend[i];
				}
			}else{
				
				alert('your chartConfig is wrrong!');
			}
			
		}else{
			this.chartCfg.graphs[0].title=legend;
		}
	}
	
	if(reportParameters.xAxisName&&this.chartCfg.categoryAxis)
		this.chartCfg.categoryAxis.title=reportParameters.xAxisName;
		
	if(reportParameters.yAxisName&&this.chartCfg.valueAxis)
		this.chartCfg.valueAxis.title=reportParameters.yAxisName;
		
	if(reportParameters.chartTitle)
		this.chartCfg.title=reportParameters.chartTitle;
		
	if(reportParameters.chartSubtitle)
		this.chartCfg.subtitle=reportParameters.chartSubtitle;	
	
	if(reportParameters.legendx)
		this.chartCfg.legend.x=reportParameters.legendx;
	if(reportParameters.legendy)
		this.chartCfg.legend.y=reportParameters.legendy;

	if(this.chartCfg.valueAxis&&reportParameters.allowDecimals===false)
		this.chartCfg.valueAxis.integersOnly=true;
};

VPChartcfg.showCloumnChart=function(){
	this.genDefCharts.apply(this,arguments);
};


VPChartcfg.showBarChart=function(){
		this.genDefCharts.apply(this,arguments);	
	
};


VPChartcfg.collectColumnChartRowMapData=function(){
	var singleChart=arguments[0];
	var x,y,jroot,dataArrayx=new Array(),dataArrayxHeaders=new Array(),dataArray=new Array(),headers=reportParameters.headers;
	
	for(var i=1;i<headers.length;i++){
		if(!(headers[i].hidden&&headers[i].hidden==true)){
			dataArrayxHeaders.push(headers[i].header);
			dataArrayx.push(headers[i].id);
		}
	}
	if(!singleChart){
		var store=arguments[1].store;
		var length=store.getCount();
		for (var i=0;i<length;i++){
			var cur=store.getAt(i);
			if(!this.isChartData(cur,true)){
				continue;
			}
			
			for(var k=0;k<dataArrayx.length;k++){
				var curo={};
				curo.xAxis=dataArrayxHeaders[k];
				curo.yAxis=cur.get(dataArrayx[k]);
				dataArray.push(curo);
			}

			if(!this.isChartData(cur,true)){
				break;
			}
		}	
	}else{
		jroot=arguments[1].root;
		var length=jroot.length;
		for (var i=0;i<length;i++){
			var cur=jroot[i];
			if(!this.isChartData(cur,false)){
				continue;
			}
			
			for(var k=0;k<dataArrayx.length;k++){
				var curo={};
				curo.xAxis=dataArrayxHeaders[k];
				curo.yAxis=cur[dataArrayx[k]];
				dataArray.push(curo);
			}

			
			if(!this.isChartData(cur,false)){
				break;
			}
		}				
	}

	this.chartCfg.dataProvider=dataArray;
	this.chartCfg.categoryField='xAxis';
	this.chartCfg.graphs[0].valueField='yAxis';
	VPChartcfg.configOddsInfo();
}

VPChartcfg.showColumnChartRowMapping=function(){
	VPChartcfg.collectColumnChartRowMapData.apply(this,arguments);
	this.changChartHeight();
	AmChartUtil.createChart(this.chartCfg);

};



function textAlignRight(){return '<div style="width:100%;text-align:right;">'+arguments[0]+'</div>';}
(function(){
					document.write('<style type="text/css">'+
						//	'.x-panel-body{border:1px solid #d0d0d0;}'+
									'.x-panel-bbar .x-toolbar{padding:3px 0px 3px 0px !important; }'+
									'.x-toolbar-cell .x-btn-text{font-size:0px !important;height:15px !important;}'+
									'</style>');
})();


