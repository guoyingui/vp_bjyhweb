String.prototype.replaceAll = function(s1,s2) { 
    return this.replace(new RegExp(s1,"gm"),s2); 
}

var OpenObject = {
	/**
	 * ������ĿȺ����Ļ�����Ϣҳ��
	 * entityInsID:����ʵ��ID
	 * entityInsName������ʵ������
	 * selectItemID��������Ĭ�ϱ�ѡ�е��������
	 */
	openProjectGroup:function(entityInsID,entityInsName,selectItemID){
		var url = "/project/vframe/openWindowAction.do?winTitle=��ĿȺ";
		    url += "&topFrame=objTitle=��ĿȺ����;objName="+entityInsName+";objType=������Ϣ;objIcon=open_managerG.gif";
		    url += "&leftFrame=fileName=pfinfos;projectID="+entityInsID+";selectItemID="+selectItemID+";objectID=0;workItemID="+entityInsID+";loadextramenu=1;display=1;start=1;limit=50;rtype=1;iid="+entityInsID+";eid=0";
		    url += "&rightFrame=/project/wbs/projectManageMenuAction.do?projectID="+entityInsID+";projectName="+entityInsName+";typeID=0;parentID=0";
		//parent.parent.parent.parent.parent.dialog.openFull('��ĿȺ-->'+entityInsName, url);
		parent.parent.parent.parent.dialog.openFullModel('��ĿȺ-->'+entityInsName, url);
		//Common.showWin(url);
	},
	openProject:function(entityInsID,entityInsName,selectItemID){
		var url = "/project/vframe/openWindowAction.do?winTitle=��Ŀ";
		    url += "&topFrame=objTitle=��Ŀ����;objName="+entityInsName+";objType=������Ϣ;objIcon=open_manager.gif";
		    url += "&leftFrame=fileName=pjinfos;projectID="+entityInsID+";selectItemID="+selectItemID+";objectID=1;workItemID="+entityInsID+";loadextramenu=1;display=1;start=1;limit=50;rtype=1;iid="+entityInsID+";eid=1";
		    url += "&rightFrame=/project/wbs/projectManageMenuAction.do?projectID="+entityInsID+";projectName="+entityInsName+";typeID=1;parentID=0";
	    //parent.parent.parent.parent.parent.dialog.openFull('��Ŀ-->'+entityInsName, url);
		parent.parent.parent.parent.dialog.openFullModel('��Ŀ-->'+entityInsName, url);
		// Common.showWin(url);
	},
	openPhase:function(phaseID,phaseName,phaseOrStep,ptype,projectID){//ptype   0����ĿȺ   1����Ŀ
		var objecttype = "21";
		var fliename="phasebar";
	  	var winTitle="�׶�";
	  	var objTitle="�׶�����";
	  	var icons="open_phase.gif";
	  	if(phaseOrStep=="1"){
	  		fliename="taskbar";
	  		winTitle="�";
	  		objTitle="�����";
	  		icons="open_gcjh.gif";
	  		objecttype = "24";
	  	}else if(phaseOrStep=="2"){
	  		fliename="deliverablesbar";
	  		winTitle="������";
	  		objTitle="����������";
	  		icons="open_object.gif";
	  		objecttype = "22";
	  	}else if(phaseOrStep=="3"){
	  		fliename="milestonebar";
	  		winTitle="��̱�";
	  		objTitle="��̱�����";
	  		icons="open_milestone.gif";
	  		objecttype = "23";
	  	}
	  	if(ptype == "0"){
  			fliename += "_pf";
  		}
		/*
	  	var url = "/project/vframe/openWindowAction.do?winTitle="+winTitle;
		url += "&topFrame=objTitle="+objTitle+";objName="+phaseName+";objType=������Ϣ;objIcon="+icons;
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
			url2 += "&topFrame=objTitle="+objTitle+";objName="+phaseName+";objType=������Ϣ;objIcon="+icons;
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
