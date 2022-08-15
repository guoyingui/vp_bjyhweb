String.prototype.replaceAll = function(s1,s2) { 
    return this.replace(new RegExp(s1,"gm"),s2); 
}

var OpenObject = {
	/**
	 * 弹出项目群对象的基本信息页面
	 * entityInsID:对象实例ID
	 * entityInsName：对象实例名称
	 * selectItemID：弹出窗默认被选中的左侧链接
	 */
	openProjectGroup:function(entityInsID,entityInsName,selectItemID){
		var url = "/project/vframe/openWindowAction.do?winTitle=项目群";
		    url += "&topFrame=objTitle=项目群名称;objName="+entityInsName+";objType=基本信息;objIcon=open_managerG.gif";
		    url += "&leftFrame=fileName=pfinfos;projectID="+entityInsID+";selectItemID="+selectItemID+";objectID=0;workItemID="+entityInsID+";loadextramenu=1;display=1;start=1;limit=50;rtype=1;iid="+entityInsID+";eid=0";
		    url += "&rightFrame=/project/wbs/projectManageMenuAction.do?projectID="+entityInsID+";projectName="+entityInsName+";typeID=0;parentID=0";
		//parent.parent.parent.parent.parent.dialog.openFull('项目群-->'+entityInsName, url);
		parent.parent.parent.parent.dialog.openFullModel('项目群-->'+entityInsName, url);
		//Common.showWin(url);
	},
	openProject:function(entityInsID,entityInsName,selectItemID){
		var url = "/project/vframe/openWindowAction.do?winTitle=项目";
		    url += "&topFrame=objTitle=项目名称;objName="+entityInsName+";objType=基本信息;objIcon=open_manager.gif";
		    url += "&leftFrame=fileName=pjinfos;projectID="+entityInsID+";selectItemID="+selectItemID+";objectID=1;workItemID="+entityInsID+";loadextramenu=1;display=1;start=1;limit=50;rtype=1;iid="+entityInsID+";eid=1";
		    url += "&rightFrame=/project/wbs/projectManageMenuAction.do?projectID="+entityInsID+";projectName="+entityInsName+";typeID=1;parentID=0";
	    //parent.parent.parent.parent.parent.dialog.openFull('项目-->'+entityInsName, url);
		parent.parent.parent.parent.dialog.openFullModel('项目-->'+entityInsName, url);
		// Common.showWin(url);
	},
	openPhase:function(phaseID,phaseName,phaseOrStep,ptype,projectID){//ptype   0：项目群   1：项目
		var objecttype = "21";
		var fliename="phasebar";
	  	var winTitle="阶段";
	  	var objTitle="阶段名称";
	  	var icons="open_phase.gif";
	  	if(phaseOrStep=="1"){
	  		fliename="taskbar";
	  		winTitle="活动";
	  		objTitle="活动名称";
	  		icons="open_gcjh.gif";
	  		objecttype = "24";
	  	}else if(phaseOrStep=="2"){
	  		fliename="deliverablesbar";
	  		winTitle="交付物";
	  		objTitle="交付物名称";
	  		icons="open_object.gif";
	  		objecttype = "22";
	  	}else if(phaseOrStep=="3"){
	  		fliename="milestonebar";
	  		winTitle="里程碑";
	  		objTitle="里程碑名称";
	  		icons="open_milestone.gif";
	  		objecttype = "23";
	  	}
	  	if(ptype == "0"){
  			fliename += "_pf";
  		}
		/*
	  	var url = "/project/vframe/openWindowAction.do?winTitle="+winTitle;
		url += "&topFrame=objTitle="+objTitle+";objName="+phaseName+";objType=基本信息;objIcon="+icons;
		url += "&leftFrame=fileName="+fliename;
		url += ";projectID="+projectID;
		url += ";objectid="+phaseID;
		url += ";objecttype="+objecttype;
		url += ";flag=phaseinfo;workItemID="+phaseID+";loadextramenu=1;display=1;start=1;limit=50;rtype=1;iid="+phaseID+";eid="+objecttype;
		url += "&rightFrame=/project/wbs/phase/phaseInfoToolbarAction.do?methodtemplateID=0;phaseOrStep="+phaseOrStep+";parentPhaseID=0;phaseID="+phaseID+";projectID="+projectID+";objectID="+phaseID+";objecttype="+objecttype;
		//parent.parent.parent.parent.parent.dialog.openFull(winTitle+'-->'+phaseName, url);
		// Common.showWin(url);	  
		*/	

		var url="/project/wbs/phase/phaseInfoToolbarAction.do?methodtemplateID=0&fromPageFlag=viewph&isRel=0&phaseOrStep="+phaseOrStep
			+"&parentPhaseID=0&phaseID="+phaseID+"&typeID="+objecttype+"&projectID="+projectID+"&objectID="+phaseID;
		var url2 = "/project/vframe/openWindowAction.do?winTitle="+winTitle;
			url2 += "&topFrame=objTitle="+objTitle+";objName="+phaseName+";objType=基本信息;objIcon="+icons;
			url2 += "&leftFrame=disable=true;fileName="+fliename;
			url2 += ";projectID=<%=projectID%>";
			url2 += ";objectid="+phaseID;
			url2 += ";objecttype="+objecttype;
			url2 += ";flag=phaseinfo;workItemID="+phaseID+";loadextramenu=1;display=1;start=1;limit=50;rtype=1;iid="+phaseID+";eid="+objecttype;
			url2 += "&rightFrame="+url;
			//isClose = Common.showWin(url2);	
		
		var urll = url.replaceAll(";","&");

		// parent.parent.parent.parent.dialog.openEdit(winTitle+'-->'+phaseName, urll);
		var map = {};
		map['tipName'] = winTitle+'-->'+phaseName; 
		parent.parent.parent.parent.cwindow.openNew(urll, map);
	}
};
