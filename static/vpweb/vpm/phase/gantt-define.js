var console={
		warn:function(){},
		log:function(){}
}
 var Gantt={edit:true,topOffSet:'0'};


 function logOut(){
 	window.parent.top.location="/project/logout.jsp";

 }
 function getOs(){ 
    var OsObject = ""; 
   if(navigator.userAgent.indexOf("MSIE")>0) { 
        return "MSIE"; 
   } 
   if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){ 
        return "Firefox"; 
   } 
   if(isSafari=navigator.userAgent.indexOf("Safari")>0) { 
        return "Safari"; 
   }  
   if(isCamino=navigator.userAgent.indexOf("Camino")>0){ 
        return "Camino"; 
   } 
   if(isMozilla=navigator.userAgent.indexOf("Gecko")>0){ 
        return "Gecko"; 
   } 
   
} 


 var showwin=true;
 	if(((navigator.userAgent.indexOf("chromeframe")>=0))||((navigator.userAgent.indexOf("Chrome")>=0))) {
 	 	showwin=false;
	}
	if (window.ActiveXObject) {
         try {
             if (new ActiveXObject('ChromeTab.ChromeFrame')){
                showwin=false;
             }
         } catch(e) {
         }
     }
   if(showwin){
 		//Common.showModalWin('/project/wbs/task/explorerTip.html',window, 570, 330);
 		Gantt.height=document.body.clientHeight-2;
 	}else{
 		Gantt.height=document.body.clientHeight;
 	}
	Gantt.topOffSet='5';
	Gantt.leftOffSet='5';
	Gantt.width=document.body.clientWidth;
	
	var vpGantt={
			newId:1,
			gantt:null,
			columns:null,
		    buttons:null,
		    rowMenu:null,
		    resourceStore:null,
		    assignmentStore:null,
		    taskStore:null,
		    ganttdiv:"gatt-grid-div",
		    ganttEl:null,
		    gridMask:null,
		    initMask:function(){
		       this.ganttEl=Ext.get(this.ganttdiv);
		       this.gridMask=new Ext.LoadMask(this.ganttEl, {msg:"正在加载数据..."});
		       this.gridMask.show();
			},
			isDurationInt:false,
			cusFiledIndex:0
	};