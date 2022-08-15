function WCalenar(config){
	this.cfg=config;
	this.curDate=new Date();
	this.curDate=new Date(this.curDate.getFullYear(),this.curDate.getMonth(),this.curDate.getDate());
	this.dateList=[];
	this.target=null;
	window.WorkCalendar=this;
	this.handleYearList=function(){
		var ylist=document.getElementById('w-cal-year-list');
		if(ylist.style.display==""||ylist.style.display=="none")
			ylist.style.display="block";
		else
			ylist.style.display="none";
	};
	this.nextMonth=function(){
		this.curDate.setMonth(this.curDate.getMonth()+1);
		this.genMonthDayList();
		this.refreshCal();
	};
	this.preMonth=function(){
		this.curDate.setMonth(this.curDate.getMonth()-1);
		this.genMonthDayList();
		this.refreshCal();
	};
	this.changeYear=function(year){
		this.handleYearList();
		this.curDate.setFullYear(year);
		this.genMonthDayList();
		this.refreshCal();
	};
	this.toToday=function(){
		this.curDate=new Date();
		this.curDate=new Date(this.curDate.getFullYear(),this.curDate.getMonth(),this.curDate.getDate());
		this.genMonthDayList();
		this.refreshCal();
	};
	this.genMonthDayList=function(){
		this.dateList=[];
		this.curMFirstDay=new Date(this.curDate.getFullYear(),this.curDate.getMonth(),1);
		this.ListFirstDay=new Date(this.curMFirstDay.getTime()-((this.curMFirstDay.getDay()>0?this.curMFirstDay.getDay()-1:6)*86400000));
		for(var i=0;i<42;i++){
			this.dateList.push(new Date(this.ListFirstDay.getTime()+(i*86400000)));
		}
	};
	this.init=function(){
		this.target=document.getElementById(this.cfg.renderTo);
		this.specialDays=this.cfg.specialDays;//[]
		this.weekend=this.cfg.weekend||[];//[]
		this.genMonthDayList();
	};
	this.init();
	
	
	this.getCalHeader=function(){
		return this.curDate.getFullYear()+'年'+(this.curDate.getMonth()+1)+'月';
	};
	this.isWeekend=function(date){
		var isRight=false;
		if(this.weekend&&this.weekend.length>0){
			for(var i=0;i<this.weekend.length;i++){
				if(date.getDay()==this.weekend[i]){
					isRight=true;
					break;
				}
			}
		}
		return isRight;
		
	};
	this.isHoliday=function(){
		var isRight=false;
		if(this.weekend&&this.weekend.length>0){
			for(var i=0;i<this.weekend.length;i++){
				if(date.getDay()==this.weekend[i]){
					isRight=true;
					break;
				}
			}
		}
		return isRight;
	};
	this.getYearCls=function(year){
		var cls='normal-year';
		if(year==this.curDate.getFullYear()){
			cls = 'cur-year';
		}
		return cls;
	};
	this.genYearList=function(){
		var fyear=this.curDate.getFullYear()-5,
		 header='<div id="w-cal-year-list">'+
				'	<table id="years-table">';
				for(var i=0;i<10;i++){
					header+='<tr><td class="'+this.getYearCls(fyear+i)+'" onclick="WorkCalendar.changeYear('+(fyear+i)+');"><a href="javascript:void(0);">'+(fyear+i)+'年</a></td></tr>';
				}
				header+='</table></div>';
		return header;
	};
	this.getHeader=function(){
		var header='<div  id="cal-header">'+
						'<div  id="pre-month-bt"  onclick="WorkCalendar.preMonth();"><a href="javascript:void(0);"><</a></div>'+
						'<div id="cal-title-div" onclick="WorkCalendar.handleYearList();"><a href="javascript:void(0);" id="cal-header-a">'+this.getCalHeader()+'</a></div>'+
						'<div id="next-month-bt" onclick="WorkCalendar.nextMonth();"><a href="javascript:void(0);">></a></div>'+
						'</div>'+this.genYearList();
		return header;
	};
	
	this.isSpecial=function(date){
		var special=false;
		if(!this.specialDays||this.specialDays.length<1)
			return special;
		else{
			for(var i=0;i<this.specialDays.length;i++){
				if(this.specialDays[i].dateL==date.getTime()){
					special=true;
					break;
				}
			}
		}
		return special;
	};
	this.getDayClsAndWithLink=function(date){
		var cls,withLink=true,special=this.isSpecial(date);
		if(date.getMonth()!=this.curDate.getMonth()){
			if(this.isWeekend(date))
				cls=(!special?'other-month-holiday':'other-month-day');
			else
				cls=(!special?'other-month-day':'other-month-holiday');
			withLink=false;
		}else{
			if(date.getTime()==this.curDate.getTime()){
				if(this.isWeekend(date))
					cls=(!special?'holidayset':'the-current-day');
				else
					cls=(!special?'the-current-day':'holidayset');
			}else{
				if(this.isWeekend(date)){
					cls=(!special?'holiday':'holidayset');
				}else{
					cls=(!special?'normal-day':'holidayset');
				}
			}
		}
		return {cls:cls,withLink:withLink};
	};
		this.getContentTableInner=function(){
		var content='';
		for(var i=0;i<42;i++){
			var cdate=this.dateList[i];
			if(i%7==0){
				content+='<tr>';
			}						
			content+=this.getDayHtml(cdate);
			if(i%7==6){
				content+='</tr>';
			}
		}
		return content;
	};
	this.refreshHeader=function(){
		var header=document.getElementById('cal-header-a');
		header.innerHTML=this.getCalHeader();
	};
	this.refreshContent=function(){

		document.getElementById('cal-content-table-outer').innerHTML=this.getContentTable();
	};
	this.refreshCal=function(){
		this.refreshHeader();
		this.refreshContent();
	};
	this.refreshSpecialDays=function(lTime,isWorkday,special){
		if(!this.specialDays)this.specialDays=[];
		if(special){
			this.specialDays.push({dateL:lTime,isWorkday:isWorkday});
		}else{
			if(this.specialDays.length<1)return;
			else{
				for(var i=0;i<this.specialDays.length;i++){
					if(this.specialDays[i].dateL==lTime){
						this.specialDays.splice(i,1);
						break;
					}
				}
			}
		}
	};
	this.reverseThis=function(obj){
		
		var isWorkday=false,isWeekend=this.isWeekend(new Date(parseInt(obj.getAttribute('time')))),special=false;
		
		if(obj.className=='the-current-day'){
			obj.className='holidayset';
			isWorkday=false;
			special=isWeekend?false:true;
		}else if(obj.className=='normal-day'){ // 周一到周五时，默认处理
			obj.className='holidayset';
			isWorkday=false;
			special=isWeekend?false:true;
		}else if(obj.className=='holiday'){  // 周未时，默认处理
			obj.className=isWeekend?'holidayset':'normal-day';//'normal-day';
			isWorkday=true;
			special=isWeekend?true:false;
		}else if(obj.className=='holiday-current'){
			obj.className='the-current-day';
			isWorkday=true;
			special=isWeekend?true:false;
		}else if(obj.className=='holidayset'){  
			obj.className=isWeekend?'holiday':'normal-day';;
		}
		this.refreshSpecialDays(obj.getAttribute('time'),isWorkday,special);
	};
	
	
	this.getDayHtml=function(cdate){
		var obj=this.getDayClsAndWithLink(cdate);
		return '<td class="'+obj.cls+'" '+(obj.withLink?'onclick="WorkCalendar.reverseThis(this);"':'')+' time="'+cdate.getTime()+'">'+(obj.withLink?'<div class="day-inner-div" ><a href="javascript:void(0);"  >':'<div style="color:#aaa;">')+cdate.getDate()+(obj.withLink?'</a>':'')+'</div></td>';
	};

	this.getContentTable=function(){
		return '<table id="cal-content-table">'+this.getContentTableInner()+'</table>';
	};
	this.getContentInner=function(){
		var content='<table id="day-name-table">'+
					'	<tr ><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td></tr>'+
					'</table><div id="cal-content-table-outer">'+this.getContentTable()+'</div>';
					
		return content;
	};
	this.getContent=function(){
		var content='<div id="cal-content">'+this.getContentInner()+'</div>';
			return content;
	};
	
	this.getFooter=function(){
		return 	'<div id="cal-footer"><div id="cal-today-div"  onclick="WorkCalendar.toToday();"><a href="javascript:void(0);">今天</a></div></div>';
	};
	this.getHtml=function(){
		var str= '<div id="w-calendar">'+this.getHeader()+this.getContent()+this.getFooter()+'</div>';
		return str;
	};
	this.doLayout=function(){
		this.target.innerHTML=this.getHtml();
	};
	this.attachEvent=function(){
	};
	this.getSpecialDaysJson=function(){
		
		if(!this.specialDays||this.specialDays.length==0){
			return '[]';
		}else{
			var json='[';
			for(var i=0;i<this.specialDays.length;i++){
					var cur=this.specialDays[i];
					if(i==0){
						json+='{dateL:'+cur.dateL+',isWorkday:'+cur.isWorkday+'}';
					}else{
						json+=',{dateL:'+cur.dateL+',isWorkday:'+cur.isWorkday+'}';
					}
			}
			json+=']';
		}
		return json;
	};
	this.doLayout();
}
