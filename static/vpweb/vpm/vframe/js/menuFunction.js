function newPJ(){
        var url = "/project/vframe/openWindowAction.do?winTitle=��Ŀ";
			url += "&topFrame=objTitle=��Ŀ����;objName=�½���Ŀ;objType=������Ϣ;objIcon=open_manager.gif";
			url += "&leftFrame=fileName=newpjinfos";
			url += "&rightFrame=/project/wbs/getProjectInfoToolbarAction.do?typeID=1";

	Common.showWin(url,window,1000,600,'yes');	   
}


function newPF(){
        var url = "/project/vframe/openWindowAction.do?winTitle=��ĿȺ";
			url += "&topFrame=objTitle=��ĿȺ����;objName=�½���ĿȺ;objType=������Ϣ;objIcon=position_managerG.gif";
			url += "&leftFrame=fileName=newpfinfos";
			url += "&rightFrame=/project/wbs/getProjectInfoToolbarAction.do?typeID=0";

	Common.showWin(url,window,1000,600,'yes');	   
}

function newTemplatePhase(){
	var functionPageFrame = top.document.frames["right"];
	
	with(functionPageFrame.document.frames["formIframe"].window){
		sel_phaseID = "0";
		addItem(0);
	}
}