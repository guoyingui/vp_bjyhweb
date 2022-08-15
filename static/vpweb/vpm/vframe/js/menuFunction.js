function newPJ(){
        var url = "/project/vframe/openWindowAction.do?winTitle=项目";
			url += "&topFrame=objTitle=项目名称;objName=新建项目;objType=基本信息;objIcon=open_manager.gif";
			url += "&leftFrame=fileName=newpjinfos";
			url += "&rightFrame=/project/wbs/getProjectInfoToolbarAction.do?typeID=1";

	Common.showWin(url,window,1000,600,'yes');	   
}


function newPF(){
        var url = "/project/vframe/openWindowAction.do?winTitle=项目群";
			url += "&topFrame=objTitle=项目群名称;objName=新建项目群;objType=基本信息;objIcon=position_managerG.gif";
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