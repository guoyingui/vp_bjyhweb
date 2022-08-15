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
		
		if(this.config.showSifter.show){
			if(!this.config.showSifter.func)
				alert('请配置展示过滤器应调用的方法！');
			else{
				this.config.showSifter.func();
			}
				
		}
	}
	this.genUrl=function(reportParas){
		if(!reportParas){
			reportParas=reportParameters;
		}else{
			for(var vattr in reportParas){
				eval('reportParameters.'+vattr+'=reportParas.'+vattr);
			}
		}

		var url=config.action;
		var i=0, paras='';
		for(var vattr in reportParameters){
			i++;
			paras +=vattr+'='+eval('reportParameters.'+vattr)+'&';
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
			'text-align':"center",
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
				VPChartcfg.setLeftLegend();
				VPChartcfg.setConfigPieMarginTop(true);
				position='west';
				this.gridMargins='5 5 5 0';
			}else if(this.config.chartPosition===reportDefConfig.chartPosition.top){
				VPChartcfg.setTopLegend();
				position='north';
				this.gridMargins='0 5 5 5';
			}else if(this.config.chartPosition===reportDefConfig.chartPosition.bottom){
				VPChartcfg.setTopLegend();
				position='south';
				this.gridMargins='5 5 0 5';
			}else if(this.config.chartPosition===reportDefConfig.chartPosition.right){
				
				VPChartcfg.setLeftLegend();
				VPChartcfg.setConfigPieMarginTop(true);
				position='east';
				this.gridMargins='5 0 5 5';
			}
		}
		var charthight=config.chartHeight||reportDefConfig.chartHeight;
		var chartitem={region:position,width:500,height:charthight,autoScroll:true,margins:this.chartMargins,html:'<div style="width:100%;height:100%;border:1px solid #d0d0d0;text-align:center;" ><div id="vp-charts-container" style="width:100%;height:100%;margin-left:auto;margin-right:auto;border:0px solid #000;" ><div></div>'};
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
				VPChartcfg.chartCfg=VPChartcfg.splineCfg;
				VPChartcfg.showChart=VPChartcfg.showLineChart;
				break;
			
			case reportDefConfig.chartType.barChart:
				VPChartcfg.chartCfg=VPChartcfg.barChartcfg;
				VPChartcfg.showChart=VPChartcfg.showBarChart;
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



(function(){
	
	var hightcharts=document.createElement("script");   
	hightcharts.type = "text/javascript";   
	hightcharts.src ='/project/js/highcharts.js';   
	document.getElementsByTagName("head")[0].appendChild(hightcharts); 
	
})();



var VPChartcfg={};
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


VPChartcfg.setLeftLegend=function(){
	this.chartCfg.legend={
			layout: 'horizontal',//'horizontal',vertical
			//align: 'right',
			verticalAlign: 'bottom',
			//x:-100,
			//y:30,
			//itemWidth:200,
			floating: true,
			borderWidth: 0,
			backgroundColor: '#FFFFFF',
			//width:200,
			//height:100
			labelFormatter:function(){
				return '<div style="height:20px;font-size:13px;border:0px solid #000;v-align:bottom;line-height:13px;position:relative;"><div style="position:relative;top:4px;">'+this.name+'</div></div>';
			}
		};
};

VPChartcfg.setTopLegend=function(){

	this.chartCfg.legend={
			layout: 'horizontal',//'horizontal',vertical
			align: 'right',
			verticalAlign: 'top',
			x:-100,
			y: 0,
			itemWidth:100,
			floating: true,
			borderWidth: 0,
			backgroundColor: '#FFFFFF',
			width:220
			//height:100,
			
			,labelFormatter:function(){
				return '<div style="height:20px;font-size:13px;border:0px solid #000;v-align:bottom;line-height:13px;top:1px;position:relative;"><div style="position:relative;top:2px;">'+this.name+'</div></div>';
			}
		};
};

VPChartcfg.margin={
	right:150,
	left:100,
	top:50,
	bottom:30
};

VPChartcfg.pieChartcfg={
	chart:{
		renderTo:reportDefConfig.chartdiv ,
		plotBackgroundColor: null,
		plotBorderWidth: 0,
		plotShadow: true,
		borderWidth: 0,
		plotHeight:200,
		marginTop:0
	},
	title:VPChartcfg.title,
	subtitle: VPChartcfg.subtitle,
	tooltip: {
		formatter: function() {
				return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage,2)+'%';
		}
	},
	plotOptions: {
		pie: {
			allowPointSelect: true,
			//cursor: 'pointer',
			dataLabels: {
				enabled: true,
				formatter:function(){ return '<div style="border:0px solid #000;><div style="position:relative;height:100%;"><div style="position:relative;top:2px;">'+this.point.name+'</div></div></div>';}
			},
			showInLegend: true
		}
	},
	legend: VPChartcfg.getLegend(),
	series: [{
		type: 'pie'

		//name: 'Browser share',
		//data:null
		}]									
};



VPChartcfg.columnChartcfg={

	chart: {
		renderTo:reportDefConfig.chartdiv,
		type: 'column',
		marginRight:VPChartcfg.margin.right
	},
	title: VPChartcfg.title,
	subtitle: VPChartcfg.subtitle,
	xAxis: {
		title:{text:''},
		categories: null,
		labels: {
			rotation: -45,
			align: 'right',
			style: {
				 font: 'normal 13px Verdana, sans-serif'
			}
		}
	},
	yAxis: {
		min: 0,
		title: {
			text: ''
		}
	},
	legend: VPChartcfg.getLegend(),
	tooltip: {
		formatter: function() {
			return  '<b>'+ this.series.name +'</b><br/>'+ this.x +':'+Highcharts.numberFormat(this.y, 2);
		}
	},
	series: [{
		name: '',
		data:null,
		dataLabels: {
			enabled: true,
			rotation: 0,
			color: '#000000',
			align: 'center',
			x: 0,
			y: 0,
			formatter: function() {
				return this.y;
			},
			style: {
				font: 'normal 13px Verdana, sans-serif'
			}
		}			
	}]
};

VPChartcfg.splineCfg={
	chart: {
		renderTo:reportDefConfig.chartdiv,
		type: 'spline',
		marginRight:VPChartcfg.margin.right
	},
	title:VPChartcfg.title,
	subtitle:VPChartcfg.subtitle,
	xAxis: {
		title:{text:''},
		categories:null
	},
	yAxis: {
		title: {
			text: ''
		},
		min: -1
	},
	tooltip: {
		formatter: function() {
			return '<b>'+ this.series.name +'</b><br/>'+this.x +': '+ this.y ;
		}
	},
	legend: VPChartcfg.getLegend(),
	series: [{
		name: '',
		data:null
	}]
};

VPChartcfg.barChartcfg={
	chart: {
		renderTo:reportDefConfig.chartdiv,
		type: 'bar',
		marginRight:VPChartcfg.margin.right
	},
	title: VPChartcfg.title,
	subtitle:VPChartcfg.subtitle,
	xAxis: {
		categories:null,
		title: {
			text: ''
		},
		labels:{
			formatter:function(){return '<div style="height:100%;position:relative;border:0px solid #000;top:3px;"><div style="0px solid #000;font-size:12px;top:2px;">'+this.value+'</div></div>';}
		}
	},
	yAxis: {
		min: 0,
		title: {
			text: ''
		},
		allowDecimals:true
	},
	tooltip: {
		formatter: function() {
			return  '<b>'+ this.series.name +'</b><br/>'+this.x +': '+ this.y;
		}
	},
	plotOptions: {
		bar: {
			dataLabels: {
				enabled: true
			}
		}
	},
	legend:VPChartcfg.getLegend(),
	credits: {
		enabled: false
	},
 series: [{
		name: '',
		data:null,
		dataLabels: {
			enabled: true,
			rotation: 0,
			color: '#000000',
			//align: 'middle',
			x: 10,
			y: 0,
			formatter: function() {
				return this.y;
			},
			style: {
				font: 'normal 13px Verdana, sans-serif'
			}
		}			
	}]
};

VPChartcfg.genCharts=function (){
		this.defCollectData.apply(this,arguments);
		this.changChartHeight();
		new Highcharts.Chart(this.chartCfg);
		
};

VPChartcfg.changChartHeight=function(){
if(this.chartCfg.chart.type=='bar'){
	
	if(this.chartCfg.series[0].data.length>15){
		var height=this.chartCfg.series[0].data.length*20;
		if(Ext.get(reportDefConfig.chartdiv).getComputedHeight()<height)
			jQuery('#'+reportDefConfig.chartdiv).css('height',height+'px');
	}
	}
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
		var x,y,jroot,dataArray=new Array(),ttotal=0.0;
		if(!singleChart){
			var store=arguments[1].store;
			var length=store.getCount();
			for (var i=0;i<length;i++){
				
				var cur=store.getAt(i);
				if(!this.isChartData(cur,true)){
					continue;
				}
				x=cur.get(reportParameters.xAxis);
				y=parseFloat(cur.get(reportParameters.yAxis));
				if(y!=0||this.contains0){
					dataArray.push({name:x,y:y});
					ttotal+=y;
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
				x=cur[reportParameters.xAxis];
				y=parseFloat(cur[reportParameters.yAxis]);
				if(y!=0||this.contains0){
					dataArray.push({name:x,y:y});
					ttotal+=y;
				}
			}
				
		}
		if((!this.contains0)&&(ttotal==0.0))
			return;
		var realArray=[],otherNum=0.0;
		if(!this.contains0){
			for(var j=0;j<dataArray.length;j++){
				
				if((dataArray[j].y/ttotal)<this.pieMinPercent)
					otherNum +=dataArray[j].y;
				else
					realArray.push(dataArray[j]);
			}
			if(otherNum!=0)
				realArray.push({name:'(其他)',y:otherNum});
		}else{
			realArray=dataArray;
		}
		
		if(realArray[0]){
			realArray[0]['sliced']=true;
			realArray[0]['selected']=true;
		}
		this.chartCfg.series[0].data=realArray;

		this.configOddsInfo();
		this.configPiesSize();	
		new Highcharts.Chart(this.chartCfg);			
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

		this.genCharts.apply(this,arguments);	
 	
}


VPChartcfg.defCollectData=function(){
		var singleChart=arguments[0];
		var x,y,jroot,dataArrayx=new Array(),dataArrayy=new Array();
		if(!singleChart){
			var store=arguments[1].store,length=store.getCount();
			for (var i=0;i<length;i++){
				var cur=store.getAt(i);
				if(!this.isChartData(cur,true)){
					continue;
				}
				x=cur.get(reportParameters.xAxis);
				y=cur.get(reportParameters.yAxis);
				dataArrayx.push(x);
				dataArrayy.push(parseFloat(y));
			}	
		}else{
			jroot=arguments[1].root;
			var length=jroot.length;
			for (var i=0;i<length;i++){
				var cur=jroot[i];
				if(!this.isChartData(cur,false)){
					continue;
				}
				x=cur[reportParameters.xAxis];
				y=cur[reportParameters.yAxis];
				dataArrayx.push(x);
				dataArrayy.push(parseFloat(y));
			}				
		}

		this.chartCfg.series[0].data=dataArrayy;
		this.chartCfg.xAxis.categories=dataArrayx;
		VPChartcfg.configOddsInfo();
};


VPChartcfg.configOddsInfo=function(){
		if(reportParameters.legend){
			var legend=reportParameters.legend ,yAxis=reportParameters.yAxis;
			if((typeof legend==='object')&&(legend.constructor===Array)){
				if((typeof yAxis==='object')&&(yAxis.constructor===Array)&&(yAxis.length==legend.length)){
					for(var i=0;i<legend.length;i++){
						this.chartCfg.series[i].name=legend[i];
					}
				}else{
					
					alert('your chartConfig is wrrong!');
				}
				
			}else{
				this.chartCfg.series[0].name=legend;
			}
		}
		
		if(reportParameters.xAxisName&&this.chartCfg.xAxis&&this.chartCfg.xAxis.title)
			this.chartCfg.xAxis.title.text=reportParameters.xAxisName;
			
		if(reportParameters.yAxisName&&this.chartCfg.yAxis&&this.chartCfg.yAxis.title)
			this.chartCfg.yAxis.title.text=reportParameters.yAxisName;
			
		if(reportParameters.chartTitle)
			this.chartCfg.title.text=reportParameters.chartTitle;
			
		if(reportParameters.chartSubtitle)
			this.chartCfg.subtitle.text=reportParameters.chartSubtitle;	
		
		if(reportParameters.legendx)
			this.chartCfg.legend.x=reportParameters.legendx;
		if(reportParameters.legendy)
			this.chartCfg.legend.y=reportParameters.legendy;

		if(this.chartCfg.yAxis&&reportParameters.allowDecimals===false)
			this.chartCfg.yAxis.allowDecimals=reportParameters.allowDecimals;
};


VPChartcfg.showCloumnChart=function(){
		
		this.genCharts.apply(this,arguments);	
};


VPChartcfg.showBarChart=function(){
		
		this.genCharts.apply(this,arguments);	
};
VPChartcfg.showGroupColumnChart=function(){

	var singleChart=arguments[0];
	var x,y,jroot,dataArrayx=new Array(),dataArrayy=new Array(),
	xAxis=reportParameters.xAxis,yAxis=reportParameters.yAxis;
	for(var j=0;j<yAxis.length;j++){
			dataArrayy[j]={data:[]};
	}
	if(!singleChart){
		var store=arguments[1].store;
		var length=store.getCount();
		for (var i=0;i<length;i++){
			var cur=store.getAt(i);
			if(!this.isChartData(cur,true)){
				continue;
			}
			
			x=cur.get(xAxis);	
			dataArrayx.push(x);
			
			for(var j=0;j<yAxis.length;j++){
				y=cur.get(yAxis[j]);
				dataArrayy[j].data.push(parseFloat(y));
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
			
			x=cur[xAxis];
			dataArrayx.push(x);
			
			for(var j=0;j<yAxis.length;j++){
				y=cur[yAxis[j]];
				dataArrayy[j].data.push(parseFloat(y));
			}
		}				
	}

	this.chartCfg.series=dataArrayy;
	this.chartCfg.xAxis.categories=dataArrayx;
	this.configOddsInfo();
	new Highcharts.Chart(this.chartCfg);	

};


VPChartcfg.showColumnChartRowMapping=function(){

	var singleChart=arguments[0];
	var x,y,jroot,dataArrayx=new Array(),dataArrayxHeaders=new Array(),dataArrayy=new Array(),headers=reportParameters.headers;
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
				y=cur.get(dataArrayx[k]);
				dataArrayy.push(parseFloat(y));
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
				y=cur[dataArrayx[k]];
				dataArrayy.push(parseFloat(y));
			}

			
			if(!this.isChartData(cur,false)){
				break;
			}
		}				
	}

	this.chartCfg.series[0].data=dataArrayy;
	this.chartCfg.xAxis.categories=dataArrayxHeaders;
	VPChartcfg.configOddsInfo();
	new Highcharts.Chart(this.chartCfg);	

};



function textAlignRight(){return '<div style="width:100%;text-align:right;">'+arguments[0]+'</div>';}
(function(){
					document.write('<style type="text/css">'+
									'.x-panel-bbar .x-toolbar{padding:3px 0px 3px 0px !important; }'+
									'.x-toolbar-cell .x-btn-text{font-size:0px !important;height:15px !important;}'+
									'</style>');
})();
