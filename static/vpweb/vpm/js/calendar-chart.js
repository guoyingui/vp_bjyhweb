var CalendarChart=function(cfg){
	Date.prototype.getDateStr=function(){
		var year=this.getFullYear();
		var month=this.getMonth()+1;
		var day=this.getDate();
		month=(month>9?month:'0'+month);
		day=(day>9?day:'0'+day);
		return year+'-'+month+'-'+day;
	};
	this.position=cfg.position;
	this.projectId=cfg.projectId;
	this.reportId=cfg.reportId;
	this.panelId=cfg.panelId;
	this.borderType=0;
	this.span=1;
	if(!window.calChartIndex){
		window.calChartCache=[];
		window.calChartIndex=0;
	}else{
		window.calChartIndex++;
	}
	this.index=window.calChartIndex;
	window.calChartCache.push(this);
	this.Matrix=[6,7];
	this.dayMilis=86400000;
	
	
	this.initCurDate=function(year,month){
		var me=this, date=me.curFirstDay;
		var curI=date.getDay();
		curI=(curI==0?7:curI);
		this.curDate= new Date(date.getTime()-this.dayMilis*(curI-1));
	};
	this.getDateClsPrefix=function(){
		var date=this.curDate,curdate=this.dateVal,today=this.todayVal,clsPrefix;
		if(date.getFullYear()==curdate.year&&date.getMonth()==curdate.month&&date.getDate()==today.date&&curdate.year==today.year&&curdate.month==today.month){
			clsPrefix= 'today';
			this.outterBgColor=' background-color:#f9e9cf; ';
		}else if(date.getFullYear()==curdate.year&&date.getMonth()==curdate.month){
			
			clsPrefix= 'same-month';
			this.outterBgColor=' ';
		}else {
			
			clsPrefix= 'other-month';
			this.outterBgColor=' background-color:#ebebeb; ';
		}
		
		if(date.getDay()==0||date.getDay()==6){
			clsPrefix='weekend-unit '+clsPrefix;
		}
		return clsPrefix;
	
	};
	this.getTitleDateStr=function(){
		var date=this.curDate;
		return (date.getMonth()+1)+'月'+date.getDate()+'日';
	};
	this.initDateInfo=function(){
		var clsPrefix=this.getDateClsPrefix(),table='',title='',content='';
		if(clsPrefix!=''){
			table=clsPrefix+'-table';
			title=clsPrefix+'-title';
			content=clsPrefix+'-content';
		}
		this.dateCls={
				table:table,
				title:title,
				content:content
			};
	};
	this.destroyDateInfo=function(){
		return;
		delete this.dateCls;
	};
	this.genToolbar=function(){
		var str='<table style="border:0px;border-collapse:collapse;width:'+this.totalWidth+'px;"><tr>'+
				//'<td class="tool-td "></td>'+
				'<td class="tool-td" style="text-align:center;"><table style="border:1px;border-collapse:collapse;margin-left:auto;margin-right:auto;"><tr><td class="tool-td-left"><div class="pre-month-icon" onclick="window.calChartCache['+this.index+'].pushDataByTrend(-1);"></div></td>'+
				'<td class="tool-td-center" ><div class="choose-date" id="date-div" onclick="window.calChartCache['+this.index+'].showDatepicker();"></div></td>'+
				'<td class="tool-td-right"><div class="next-month-icon" onclick="window.calChartCache['+this.index+'].pushDataByTrend(1);"></div></td>'+
				//'<td class="tool-td "></td>'+
				'</tr></table></td>'+
				'</tr></table>';
		return str;
	};

	this.showDatepicker=function(){

			var me=this,scope = {
				callback: function(date, calendarInstance){
					if(!date){
						date=new Date();
					}
					var year=date.getFullYear(),month=date.getMonth();
					me.datePicker.hide();
					me.pushMonthData2Frame(year,month)
					
				}
			};
			if(!this.datePicker){
				this.datePicker = new Calendar();
			}
			this.datePicker.initCalendar('', scope.callback, scope);
			var left =(document.getElementById('inner-div').scrollWidth-177)/2;
			var top = 20;
			window.setTimeout(function(){
				me.datePicker.show(top, left);
			},50);
	};
	this.genWeekTitle=function(){
		var str='',wTitles=['一','二','三','四','五','六','日'];
		str+='<table style="border:0px;border-collapse:collapse;width:'+this.totalWidth+'px"><tr class="week-title-tr">';
		for(var i=0;i<wTitles.length;i++){
			str+='<td style="width:'+this.tdWidth+'px;'+this.getWeekTitleTdBorder(i)+'">周'+wTitles[i]+'</td>';
		}
		str+='</tr></table>';
		return str;
	};
	this.getWeekTitleTdBorder=function(x){
		if(this.borderType==1){
			return ' border-top:0px;border-bottom:0px; ';
		}else{
			if(x<6){
				return ' border-top:0px;border-bottom:0px;border-left:0px; ';
			}else{
				return ' border:0px; '
			}
			 
		}
	};
	this.getLenendTr=function(){
		var me=this;
		var str='<table style="border-collapse:collapse;width:'+this.totalWidth+'px;border:0px;height:30px;"><tr class="legend-tr"><td  colspan= 7 style="padding:0px;'+me.getLegendTdBorder()+'"><div style="float:left;width:50px;text-align:left;"><div class="pro-start-div"></div>开始</div> <div style="float:left;width:70px;text-align:left;"><div class="pro-end-div"></div>结束</div></td></tr></table>';
		return str;
	};
	this.getTestPros=function(){
		var date=this.curDate,curdate=this.dateVal,me=this;
		if(!this.interval)this.interval=1;
		if(!(date.getFullYear()==curdate.year&&date.getMonth()==curdate.month)){
			return '<tr><td class=""></td></tr>';
		}else{
			var str='';
			for(var i=0;i<me.data.length;i++){
				var curdata=me.data[i]
				if(curdata.CurDate.substring(0,10)==date.getDateStr()){
					var curStr='<tr><td class="content-td '+this.dateCls.content+'" style="font-size:12px;width:100%!important;"><a href="#" class="cal-item-link" taskid="'+curdata.taskid+'"  url="'+curdata.rpt_url+'" '+me.getItemOnClick()+' name="'+curdata.Name+'"><div class="pro-'+(parseInt(curdata.datype,10)==1?'start':'end')+'-div"></div>'+curdata.Name+'</a></td></tr>';
					str+=curStr;
				}
			}

			str+='<tr><td class="'+this.dateCls.content+'"></td></tr>';
			return str;
		}
		
	};
	this.getItemOnClick=function(obj){
		return ' onclick="openUrl(this)" '
	};
	window.openUrl=function(obj){
		//Common.showWin(obj.getAttribute('url'));
			//parent.parent.dialog.openEdit($(obj).attr("name"),obj.getAttribute('url'));
		// 
		var stmpUrl = "/project/system/tools/genValueBySql.jsp?sql=select projectid||'~'||metatype from tk_baseinfo where taskid="+$(obj).attr("taskid");
		$.get(stmpUrl,null,function(data) {
			var rtndata = data.trim().split("~");
			try {
				var tname = $(obj).attr("name");
				var turl = obj.getAttribute('url');
				var projectid = rtndata[0];

				var objectID=33;//叶子任务
				switch(rtndata[1]){
						case 1:
							objectID=32;//里程碑
							break;
						case 2:
							objectID=34;//摘要任务
							break;
						case 4:
							objectID=34;//摘要任务
							break;
				}
				$.ajax({
					type : "post",
					url : "/project/mywork/getProjectWBSType.do?taskid="+$(obj).attr("taskid"),
					data: {taskid:  $(obj).attr("taskid")},
					success : function(data) {
						if(data=='-1'){
							alert("查询项目任务管理工具类型出错！");
						}else{
							var pptype = data;
							Common.WBS.openStdWin(pptype,objectID, $(obj).attr("taskid"), '/project/mywork/taskTrackMain.jsp',
									 {wbsObjectID:objectID,'objectID':objectID,projectID:projectid,workItemID:$(obj).attr("taskid"),detailobjectid:$(obj).attr("taskid"),loadextramenu:1,display:1,start:1,limit:50,rtype:1,iid:$(obj).attr("taskid"),eid:objectID,taskID:$(obj).attr("taskid"),taskname:tname});
						}
					},
					//dataType : "json",
					cache : false
				});
			}
			catch (e)
			{ }
		});
		/*
		var tname = $(obj).attr("name");
		var turl = obj.getAttribute('url');
		if (parent.location.href.indexOf("/project/report/dashboard/dashboard.jsp?type=1") == -1) {
			dialog.openEdit(tname,turl);
		}
		else {
			parent.parent.parent.dialog.openEdit(tname,turl);
		}
		*/
	}
	this.getDataRows=function(){
		var date=this.curDate,curdate=this.dateVal;
		if(!(date.getFullYear()==curdate.year&&date.getMonth()==curdate.month)){
			return '<tr><td class=""></td></tr>';
		}else{
			var str='<tr><td class="content-td '+this.dateCls.content+'" style="font-size:12px;"><div class="pro-end-div"></div>测试项目</td></tr>';
			str+='<tr><td class="'+this.dateCls.content+'"></td></tr>';
			this.interval++;
			return str;
		}
		
	};
	this.getDateTable=function(){
		
		var tablestr= 
				'<table class="unit-table '+this.dateCls.table+'">'+
				'<tr><td class="'+this.dateCls.title+' unit-title">'+this.getTitleDateStr()+'</td></tr>'+
				//'<tr><td class="content-td '+this.dateCls.content+'">'+this.curDate.getDate()+'</td></tr>'+
				this.getTestPros()+
				'</table>';
		this.destroyDateInfo();
		return tablestr;
	
	};
	
	this.nextDate=function(){
		return this.curDate.setTime(this.curDate.getTime()+this.dayMilis);
	};
	this.initFrameOdds=function(){
		this.tdWidth=Math.floor((document.body.clientWidth-(this.borderType
				==1?8:0))/7);
		//this.totalWidth=this.tdWidth*7+8;
		this.totalWidth=document.body.clientWidth;
		if(this.position=='default'){
			this.totalHeight=document.body.scrollHeight;
			this.contentHeight=this.totalHeight-80;
		}
		
	};
	this.getContentTableHeightCss=function(){
		if(this.position=='default'){
			return 'height:'+this.contentHeight+'px;overflow-x:hidden;overflow-y:auto;'
		}else{
			return 'overflow-x:hidden;overflow-y:hidden;';
		}
	};
	this.clearPreSel=function(){
		var obj=this.selectObj;
		if(obj){
			this.accessTDs(obj,function(item){
				item.style.backgroundColor=item.getAttribute('bg');
			});
			obj.style.backgroundColor=obj.getAttribute('bg');
			obj.setAttribute('selected',0);
		}
	};
	this.selectTd=function(obj){
		this.clearPreSel();
		this.accessTDs(obj,function(item){
			item.setAttribute('bg',obj.style.background);
			item.style.backgroundColor='#c1cfdc';
		});
		obj.setAttribute('selected',1);
		obj.setAttribute('bg',obj.style.background);
		obj.style.backgroundColor='#c1cfdc';
		this.selectObj=obj;
	};
	this.releaseTd=function(obj){
		var callBack=function(item){
				item.style.backgroundColor=item.getAttribute('bg');
			};
		obj.setAttribute('selected',0);
		obj.style.backgroundColor=obj.getAttribute('bg');
		return callBack;
	}
	this.selectDay=function(obj){
		if((!obj.getAttribute('selected'))||obj.getAttribute('selected')==0){
			this.selectTd(obj);
		}
	};
	this.accessTDs=function(obj,callBack){
		var tables=obj.childNodes;
		if(tables&&tables[0]&&tables[0].rows){
			var rows=tables[0].rows;
			for(var i=0;i<rows.length;i++){
				var curRow=rows[i],cells=curRow.cells;
				for(var j=0;j<cells.length;j++){
					callBack(cells[j]);
				}
			}
		}
		
	};
	this.setCondition=function(condition){
		var me=this;
		me.condition=condition;
		me.pushDataByTrend(0);
	};
	this.getParas=function(){
		var me=this,year=me.curFirstDay.getFullYear(),month=me.curFirstDay.getMonth()+1;
		month=month<10?('0'+month):month;
		var paras={
				themethod: 'loadReportData',
				reportId:me.reportId,
				projectId:me.projectId,
				drillDown:1,
				drillPara:encodeURIComponent('["'+year+'","'+month+'"]'),
				curPage:1
			};
		if(me.condition){
			paras.condition=me.condition;
		}
		return paras;
	};
	this.getData=function(){
		var me=this,data;
		var hasData=true;
		jQuery.ajax({
			url: '/project/report/selDefineReportAction.do',
			data: me.getParas(),
			type: 'post',
			async: false,
			success: function(res) {
				data=res;
			},
			error:function(x,t,e){
				if(x.responseText.indexOf('系统session超时')!=-1){
					alert('系统session超时，请重新登录');
				}
				hasData=false;
				
			},
			dataType: 'json'
		});
		if(hasData){
			if(!data[0]||data[0].length<1){
				//me.showNoDataPage();
				//return;
				data=[];
			}else{
				data=data[0];
			}
			me.data=data;
		}else{
			data=[];
			me.data=data;
		}
		return data;
	};
	this.showNoDataPage=function(){
    	var me=this, maindiv=jQuery(document.body);
		maindiv.height(70);
		maindiv.css({'text-align':'center','overflow-x':'hidden'});
		maindiv.html('<div style="border:0px solid #000;line-height:60px;height:60px;margin-left:atuo;margin-right:atuo;font-weight:bold;font-size:12px;">暂无数据！</div>');
		me.setPanelHeight(80);
    };
    this.setPanelHeight=function(height){
		var me=this;
		if(parent.MeterUtil){
			parent.MeterUtil.setMeterHeightForDrillGrid(me.panelId,height);

		}
	};
	this.genContentDivStr=function(){
		var tableStr='<div id="content-div" style="width:'+this.totalWidth+'px;'+this.getContentTableHeightCss()+'margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px;border:0px;padding:0px;position:relative;"></div>';
		return tableStr;
	};
	this.isIE=function(){
		var isIE=false;
		var ua = navigator.userAgent.toLowerCase();
		if (window.ActiveXObject)
			isIE = ua.match(/msie ([\d.]+)/).length>0;
		return isIE;
	};
	this.getTdHeight=function(){
		var height=Math.ceil((document.body.scrollHeight-78)/6);
		height=Math.max(height,70);
		return height;
	};
	
	this.getOutterBgColor=function(){
		if(this.isIE()){
			return this.outterBgColor;
		}else{
			return '';
		}
		
		
	};
	this.genContentTableStr=function(){
		
		var me=this;
		me.getData();
		if(!me.data)me.data=[];
		var tdHeight=me.getTdHeight();//,mt=me.Matrix;
		var tableStr='<table id="content-table" class="calendar-content-table" cellspacing=1 style="width:'+me.totalWidth+'px;position:relative;">';
		var border='';	
		for(var i=0;i<6;i++){
				
				tableStr+='<tr>';
				for(var j=0;j<7;j++,me.nextDate()){
					border=me.getCalenderTdBorder(i,j);
					me.initDateInfo();
					tableStr+='<td '+me.getOnClick()+' class="outer-td" style="'+border+'width:'+me.tdWidth+'px!important;'+this.getOutterBgColor()+'">'+me.getDateTable()+'</td>';
				}
				tableStr+='</tr>';
			}
		tableStr+='</table>';
		return tableStr;
	};
	this.genCalendarFrame=function(){
		var me=this;
		me.initFrameOdds();
		var tableStr='';
		tableStr+=me.genToolbar();
		tableStr+=me.genWeekTitle();
		tableStr+=me.genContentDivStr();
		tableStr+=me.getLenendTr();
		me.tableStr=tableStr;
		document.getElementById('inner-div').innerHTML=tableStr;
	};
	
	this.getOnClick=function(){
		if(this.dateCls.table.indexOf('other-month')!=-1){
			return '';
		}else{
			return 'onclick="window.calChartCache['+this.index+'].selectDay(this);"';
		}
		
	};
	this.fixlayOut=function(){
		var me=this
		if(this.position=='default'){
			var dh=document.body.scrollHeight-78,
			th=document.getElementById('content-table').scrollHeight;
			//alert(dh+'-'+th);
			if(dh>th){
				document.getElementById('content-table').style.height=dh+'px';
				
			}
			
		}
		//me.fixOutterTdHeight();
	};
	
	this.fixOutterTdHeight=function(){
		return;
		var rows=document.getElementById('content-table').rows;
		for(var i=0;i<rows.length;i++){
			var row=rows[i],cells=row.cells,height;
			for(var j=0;j<cells.length;j++){
				var cell=cells[j];
				if(j==0){
					height=cell.scrollHeight;			
				}
				cell.childNodes[0].style.height=height+'px';
				
			}
		}
		
	};
	this.initToday=function(){
		var me=this;
		if(!me.today){
			me.today=new Date();
			me.todayVal={
				year:me.today.getFullYear(),
				month:me.today.getMonth(),
				date:me.today.getDate()
			};
		}
	};
	this.initFirstDay=function(year,month){
		var me=this;
		if(!me.curFirstDay){
			me.curFirstDay=new Date();
		}
		var date=me.curFirstDay;
		date.setYear(year);
		date.setMonth(month);
		date.setDate(1);
		me.dateVal={
			year:date.getFullYear(),
			month:date.getMonth(),
			date:date.getDate()
		};
		this.initCurDate();
	};
	this.pushDataByTrend=function(trend){
		var me=this;
		if(!me.curFirstDay){
			me.curFirstDay=new Date();
		}
		var year=this.curFirstDay.getFullYear(),month=this.curFirstDay.getMonth()+(trend*this.span);
		this.pushMonthData2Frame(year,month);
	};
	this.pushMonthData2Frame=function(year,month){
		this.initFirstDay(year,month);
		var calStr=this.genContentTableStr();
		if(calStr){
			this.text('date-div',this.getCurMonthTxt());
			document.getElementById('content-div').innerHTML=calStr;
			this.fixlayOut();
		}
		this.refreshPanel();
	};
	this.text=function(id,text){
		var txtel=document.createTextNode(text);
		var el=document.getElementById(id),y;
		//el.appendChild(txtel);
		if(el.childNodes&&(y=el.childNodes[0])){
			el.removeChild(y);
		}
		el.appendChild(txtel);
	};
	this.getCurMonthTxt=function(){
		var date=this.curFirstDay;
		var year=date.getFullYear();
		var month=date.getMonth();
		return year+'年'+(month+1)+'月';
	};
	this.refreshPanel=function(){
		var me=this;
		if(me.position=='panel'){
			parent.MeterUtil.setMeterHeight(me.panelId,document.getElementById('inner-div').scrollHeight-(me.isIE()?10:0));
		}

	};
	this.showCalTable=function(){
		this.genCalendarFrame();
		this.pushDataByTrend(0);
	};
	this.getLegendTdBorder=function(){
		if(this.borderType==1){
			return ''
		}else{
			return ' border-bottom:0px;border-left:0px;border-right:0px; ';
		}
		
	};
	this.getCalenderTdBorder=function(x,y){
		var type=1;
		if(x==0){
			if(y<6){
				type=1;
			}else{
				type=2;
			}
		}else{
			if(y<6){
				type=3;
			}else{
				type=4;
			}
		}
		var border='';
		if(this.borderType==1){
			if(type==1||type==2){
				border= ' border-top:0px;border-bottom:0px;';
			}else if(type==3||type==4){
				border= ' border-bottom:0px;';
			}
		}else{
			if(type==1){
				border= ' border-top:0px;border-left:0px;border-bottom:0px; ';
			}else if(type==2){
				border= ' border-top:0px;border-left:0px;border-right:0px;border-bottom:0px; ';
			}else if(type==3){
				border= ' border-bottom:0px;border-left:0px; ';
			}else if(type==4){
				border= ' border-bottom:0px;border-left:0px;border-right:0px; ';
			}
			
		}
		return border;
	};
	this.bindResize=function(){
		var me=this;
		if (window.addEventListener) {
			window.addEventListener('resize',
			function() {
				me.showCalTable();
			},
			false);
		} else {
			window.attachEvent('onresize',
			function() {
				me.showCalTable();
			});
		}
	};
	this.bindResize();
	this.initToday();
	
};
