//���ҵ������ڹ��ú���
var Search = {
	//�����û�
	user: function (obj){
		
		window.request = new Object();
		window.request.userID = obj.userID || "0";
		window.request.userName = obj.userName || "";
		var userIDCur = obj.userID || "0";
		var userNameCur = userName = obj.userName || "";
		var frameid = obj.frameid ||"";
		//�Ƿ��и߼�����
		if(obj.conditionFlag == undefined){
			window.request.conditionFlag = true;
		}else{
			window.request.conditionFlag = obj.conditionFlag;
		}
		
		var para = "";
		if(obj.roleID){
			para += "&roleID=" + obj.roleID;
		}else{
			para += "&roleID=0"
		}
		if(obj.componentID){
			para += "&componentID=" + obj.componentID;
		}else{
			para += "&componentID=0"
		}
		if(frameid){
			para += "&frameid=" + frameid;
		}else{
			para += "&frameid="
		}
		para += "&userIDCur="+userIDCur+"&userNameCur="+userNameCur;
		if (obj.paraMap) {
			for (var key in obj.paraMap) {  
				para += "&" + key + "=" + obj.paraMap[key];
			} 
		}
		var url = "";
		if(obj.multiple){//��ѡ
			url = '/project/share/user/searchUserMultiple.jsp?objid='+obj.name+para;
		}else{//��ѡ
			url = '/project/share/user/searchUser.jsp?objid='+obj.name+para;
		}
		//����û�ѡ��������
		url = encodeURI(encodeURI(url));
		if (obj.search == 1) {
			var map = {};
			map['fromType'] = 'search';
			dialog.openQuerySearch('�û�ѡ����', url, map);
		}
		else if (obj.search == 2) { // ����ѡ���û�
			var map = {};
			map['fromType'] = 'flow';
			dialog.openQueryEdit('�û�ѡ����', url, map);
		}
		else if (obj.search == 3) { // �½���Ŀ����
			var map = {};
			map['fromType'] = 'newindex';
			dialog.openQueryEditIdex('�û�ѡ����', url, map);
		}
		else if (obj.search == 4) { // �޸���Ŀ����
			var map = {};
			map['fromType'] = 'editindex';
			dialog.openQueryEditIdex('�û�ѡ����', url, map);
		}else if (obj.search == 5) { // �޸���Ŀ����
			var map = {};
			map['fromType'] = 'editindex';
			dialog.openQuerySearchModel('�û�ѡ����', url, map);
		}else if(obj.search == 6){
			parent.dialog.openQueryEdit('�û�ѡ����', url);
		}else if(obj.search == 7){
			parent.parent.dialog.openQueryEdit('�û�ѡ����', url);
		}else if(obj.search == 8){
			parent.parent.parent.dialog.openQueryEdit('�û�ѡ����', url);
		}else if(obj.search == 88){ //�ĵ��û���ά��
			parent.parent.parent.dialog.openQueryEditIdex('�û�ѡ����', url);
		}else if(obj.search == 9){
			parent.parent.parent.parent.dialog.openQueryEdit('�û�ѡ����', url);
		}
		else {
			try{
				parent.parent.dialog.openQueryEdit('�û�ѡ����', url);
			}catch(e){
				parent.parent.parent.dialog.openQueryEdit('�û�ѡ����', url);
			}
		}
	},
	yyxt: function (obj){
		var oel = document.getElementById(obj.name);
		//obj.id = oel.getAttribute("hidID");
		var param = '';
		if (oel != null) {
			param = '&iid='+oel.getAttribute("hidID")+"&namedsp="+oel.value;
		}
		if (obj.paraMap) {
			for (var key in obj.paraMap) {  
				param += "&" + key + "=" + obj.paraMap[key];
			} 
		}
		var url = '';
		if(obj.multiple){//��ѡ
			url = '/project/system/workitem/searchEntityMultiToolBar.jsp?objectID=2635&objid='+obj.name + param;
		}else{//��
			url = '/project/system/workitem/searchEntityToolBar.jsp?objectID=2635&objid='+obj.name + param;
		}
		//�������ѡ��������
		//alert(url);
		url = encodeURI(encodeURI(url));
		var map = {};
		map['fromType'] = 'pjinfos';
		map['snamevalue'] = oel.value;
		parent.parent.dialog.openQueryEdit('Ӧ��ϵͳѡ����', url, map);
	},
	docUserGroup:function(obj){
		window.request = new Object();
		if(obj.multiple){//��ѡ
			//Common.showModalWin('/project/share/doc/searchUserGroup.jsp?signle=0', window, 702, 572);
			dialog.openQuerySearch("�ĵ��û���ѡ����",'/project/share/doc/searchUserGroup.jsp?signle=0&fieldID='+obj.name);
		}else{//��ѡ
			//Common.showModalWin('/project/share/doc/searchUserGroup.jsp?signle=1', window, 702, 572);
			dialog.openQuerySearch("�ĵ��û���ѡ����",'/project/share/doc/searchUserGroup.jsp?signle=1');
		}
		
		//var objData = window.request.resData;
		//return objData;
		
	},
	//������Ŀ
	project: function (obj){
		debugger;
		window.request = new Object();
		window.request.projectID = obj.projectID || "0";
		window.request.projectName = obj.projectName || "";
		window.request.selectprojectname=obj.selectprojectname || "";
		//�Ƿ��и߼�����
		if(obj.conditionFlag == undefined){
			window.request.conditionFlag = true;
		}else{
			window.request.conditionFlag = obj.conditionFlag;
		}
		var type = "2";
		
		if(obj.type != undefined){
			type = obj.type;
		}
		var projectIDCur = obj.projectID || "0";
		var projectNameCur = obj.projectName || "";
		var objid = obj.name || "";
		var sprojectname=obj.selectprojectname || "";
		console.log(sprojectname);
		var para = "";
		var url = "";
		para += "&objid="+objid+"&projectIDCur="+projectIDCur+"&projectNameCur="+projectNameCur;
		if (obj.paraMap) {
			for (var key in obj.paraMap) {  
				para += "&" + key + "=" + obj.paraMap[key];
			} 
		}
		if(obj.multiple){//��ѡ
			url = '/project/share/project/searchProjectMultiple.jsp?type='+type+'&from='+obj.from+para;
		}else{//��
			url = '/project/share/project/searchProject.jsp?type='+type+'&sprojectname='+sprojectname+'&from='+obj.from+para;
		}
		//�����Ŀѡ��������
		//alert(url);
		url = encodeURI(encodeURI(url));
		var titleStr = '��Ŀѡ����';
		if(type=='2'){
			titleStr = '��ĿȺ/��Ŀѡ����';
		}else if(type=='0'){
			titleStr = '��ĿȺѡ����';
		}
		if (obj.search == 1) {
			var map = {};
			map['fromType'] = 'search';
			map['snamevalue'] = projectNameCur;
			dialog.openQuerySearch(titleStr, url, map);
		}
		else if (obj.search == 3) { // �½���Ŀ����
			var map = {};
			map['fromType'] = 'newindex';
			map['snamevalue'] = projectNameCur;
			dialog.openQueryEditIdex(titleStr, url, map);
		}
		else if (obj.search == 4) { // �޸���Ŀ����
			var map = {};
			map['fromType'] = 'editindex';
			map['snamevalue'] = projectNameCur;
			dialog.openQueryEditIdex(titleStr, url, map);
		}
		else if (obj.search == 5) { // ϵͳ������
			var map = {};
			map['fromType'] = 'system';
			map['snamevalue'] = projectNameCur;
			parent.parent.dialog.openQuery(titleStr, url, map);
		}
		else if(obj.search == 6){//��ͬ���ո������и��ٹ�����Ŀ
			var map = {};
			map['snamevalue'] = projectNameCur;
			parent.dialog.openQueryEdit(titleStr, url, map);
		}
		else if(obj.search == 7){ // ������ҳ��
			var map = {};
			map['fromType'] = 'subflow';
			map['frameid'] = obj.frameid;
			map['snamevalue'] = projectNameCur;
			parent.parent.parent.parent.parent.dialog.openQueryEdit(titleStr, url, map);
		}
		else if(obj.search == 8){
			var map = {};
			map['snamevalue'] = projectNameCur;
			parent.parent.parent.dialog.openQueryEdit(titleStr, url, map);
		}
		else {
			var map = {};
			map['snamevalue'] = projectNameCur;
			parent.parent.dialog.openQueryEdit(titleStr, url, map);
		}
	},
	//���Һ�ͬ���Զ���ʵ��
	entityLayer: function (obj, pp){debugger;
		var oel = document.getElementById(obj.name);
		var param = '';
		if (oel != null) {
			param = '&idval='+oel.getAttribute("hidID")+"&namedsp="+oel.value;
		}
		param += "&iid="+obj.iid;
		if(obj.frameid){
			param += "&frameid=" + obj.frameid;
		}else{
			param += "&frameid="
		}
		if (obj.paraMap) {
			for (var key in obj.paraMap) {  
				param += "&" + key + "=" + obj.paraMap[key];
			} 
		}
		var url = '';
		if(obj.multiple){//��ѡ
			url = '/project/system/workitem/searchEntityMultiToolBar.jsp?objectID='+obj.objectID+'&objid='+obj.name+'&curEId='+obj.curEId + param;
		}else{//��
			url = '/project/system/workitem/searchEntityToolBar.jsp?objectID='+obj.objectID+'&objid='+obj.name+'&curEId='+obj.curEId + param;
		}
		//alert(url);
		//�������ѡ��������
		url = encodeURI(encodeURI(url));
		//pp['snamevalue'] = oel.value;
		if (obj.objectID=='21') {
			var projectID = obj.projectID;
			var phaseID = obj.phaseID;
			var phaseName = obj.phaseName;
			var fieldID = obj.fieldID;
			url = '/project/share/phase/searchPhase.jsp?fieldID='+fieldID+'&projectID='+projectID+'&phaseID='+phaseID+'&phaseName='+phaseName;
			//�������ѡ��������
			url = encodeURI(encodeURI(url));
			if(obj.search == 2){
				dialog.openQuerySearchModel('����ѡ����', url, pp);
			}else{
				dialog.openQuerySearch('����ѡ����', url, pp);
			}
		}
		else if(obj.objectID=='1032'){
			var tu = "/project/vn/rdirsel.jsp?entityId=1032&projectid="+(obj.projectID||'')+'&id='+obj.dirID;
			parent.parent.dialog.openQueryEdit('����ѡ����', tu, pp);
		}else{
			if(parent.parent.parent.location.href.indexOf("pjinfos") != -1){
				if(obj.objectID=='1662'){//��Ŀ-��Ŀ�Ŷ�-��ϵ�˹���
					parent.parent.dialog.openQuery('����ѡ����', url, pp);
				}else{
					parent.parent.dialog.openQueryEdit('����ѡ����', url, pp);//��Ŀ-�з�����-ȱ��
				}
			}else{
				if (obj.search == 1) {
					var map = {};
					map['fromType'] = 'search';
					map['snamevalue'] = oel==undefined?'':oel.value;
					dialog.openQuerySearch('����ѡ����', url, map);
				}else if(obj.search == 2){
					var map = {};
					map['fromType'] = 'relation';
					map['snamevalue'] = oel==undefined?'':oel.value;
					parent.parent.dialog.openQueryEdit('����ѡ����', url, map);
				}
				else {
					if (pp == undefined) {
						var map = {};
						map['fromType'] = 'relation';
						map['snamevalue'] = oel==undefined?'':oel.value;
						if(parent.parent.location.href.indexOf("pjinfos")!=-1){
							parent.parent.dialog.openQuery('����ѡ����', url, pp);
						}else{
							parent.parent.dialog.openQueryEdit('����ѡ����', url, map);
						}
						
					}
					else {				
						if (pp['flowtype'] == '1') {
							parent.parent.parent.parent.parent.dialog.openQueryEdit('����ѡ����', url, pp);
						}
						else {
							if(parent.parent.location.href.indexOf("pjinfos")!=-1){
								// parent.parent.dialog.openQueryEdit('����ѡ����', url, pp);
								parent.parent.dialog.openQuery('����ѡ����', url, pp);
							}else{
								parent.parent.parent.parent.dialog.openQueryEdit('����ѡ����', url, pp);
							}
						}
					}
				}
			}
		}
		
	},
	//���Ҳ���
	department: function (obj){
		window.request = new Object();
		window.request.deptID = obj.departmentID || "0";
		window.request.deptName = obj.departmentName || "";
		window.request.isUserWorkdepartment = obj.isUserWorkdepartment || false;//Ĭ�ϲ����У������true����ֻ���½�û�������λ��
		//-----------------------------------
		var deptIDCur = obj.departmentID || "0";
		var deptNameCur = obj.departmentName || "";
		var isUserWorkdepartmentCur = obj.isUserWorkdepartment || false;//Ĭ�ϲ����У������true����ֻ���½�û�������λ��
		//�Ƿ��и߼�����
		if(obj.conditionFlag == undefined){
			window.request.conditionFlag = true;
		}else{
			window.request.conditionFlag = obj.conditionFlag;
		}
		
		var url = "";
		var para = "&deptIDCur="+deptIDCur+"&deptNameCur="+deptNameCur+"&isUserWorkdepartmentCur="+isUserWorkdepartmentCur;
		if (obj.paraMap) {
			for (var key in obj.paraMap) {  
				para += "&" + key + "=" + obj.paraMap[key];
			} 
		}
		if(obj.multiple){//��ѡ
			url = '/project/share/dept/searchDepartmentMultiple.jsp?objid='+obj.name+para;
		}else{//��ѡ
			url = '/project/share/dept/searchDepartment.jsp?objid='+obj.name+para;
		}
		//���������������
		//alert(url);
		url = encodeURI(encodeURI(url));
		if (obj.search == 1) {
			var map = {};
			map['fromType'] = 'search';
			dialog.openQuerySearch('����ѡ����', url, map);
		}
		else if (obj.search == 3) { // �½���Ŀ����
			var map = {};
			map['fromType'] = 'newindex';
			dialog.openQueryEditIdex('����ѡ����', url, map);
		}
		else if (obj.search == 4) { // �޸���Ŀ����
			var map = {};
			map['fromType'] = 'editindex';
			dialog.openQueryEditIdex('����ѡ����', url, map);
		}else if (obj.search == 5) { // �޸���Ŀ����
			var map = {};
			map['fromType'] = 'editindex';
			dialog.openQuerySearchModel('����ѡ����', url, map);
		}else if (obj.search == 6) { // �޸���Ŀ����
			var map = {};
			map['fromType'] = 'flowinfo';
			parent.parent.parent.dialog.openQuerySearchModel('����ѡ����', url, map);
		}
		else if(obj.search == 8){
			parent.parent.parent.dialog.openQueryEdit('����ѡ����', url);
		}
		else {
			parent.parent.dialog.openQueryEdit('����ѡ����', url);
		}
	},
	SearchFns:{}
};
(function(){
	var SearchFns = Search.SearchFns;
	Search.getSearcher = function(entityId){
		var fn;
		if(",9,21,22,23,24,31,91,92,2000,41,45,46,".indexOf(","+entityId+",")>=0 
				|| (1000<entityId && entityId<=1999) || (2000<entityId && entityId<=2999)
				|| (200<entityId && entityId<=240)){
			fn = SearchFns[2000];
		}else{
			fn = SearchFns[entityId];
		}
		return fn;
	}
	//ע��ʵ��Ĳ��Һ���
	SearchFns[0] = function(data, callBack){//��ĿȺ
		var objData = {
				projectID: data.id,
				projectName: data.name,
				type: "0",
				multiple: data.isMult,
				paraMap: data.paraMap
		};
		objData.name = data.inputid;
		objData.search = 1;
		objData = Search.project(objData);
		if(objData){
			callBack({
				id: objData.projectID,
				name: objData.projectName
			});
		}
	};
	SearchFns[1] = function(data, callBack){//��Ŀ
		var objData = {
				projectID: data.id,
				projectName: data.name,
				type: "1",
				multiple: data.isMult,
				paraMap: data.paraMap
		};
		objData.name = data.inputid;
		objData.search = 1;
		objData = Search.project(objData);
		if(objData){
			callBack({
				id: objData.projectID,
				name: objData.projectName
			});
		}
	};
	SearchFns[6] = function(data, callBack){//����
		var objData = {
				departmentID: data.id,
				departmentName: data.name,
				multiple: data.isMult,
				paraMap: data.paraMap,
				isUserWorkdepartment:data.isReport||false
		};
		objData.name = data.inputid;
		objData.search = 1;
		objData = Search.department(objData);
	};
	SearchFns[7] = function(data, callBack){//�û�
		var objData = {
				userID: data.id,
				userName: data.name,
				multiple: data.isMult,
				paraMap: data.paraMap
		};
		objData.name = data.inputid;
		objData.search = 1;
		objData = Search.user(objData);
		if(objData){
			callBack({
				id: objData.userID,
				name: objData.userName
			});
		}
	};
	SearchFns[21] = function(data, callBack){//�׶�
		var x=700;
		var y=340;
		var xx=(window.screen.width-x)/2;
		var yy=(window.screen.height-y)/2;
		Common.showModalWin("/project/share/searchPhase.jsp",window,x,y, function(res){
			if(res){
				callBack({
					id: res.id,
					name: res.name
				});
			}
		});
	};
	SearchFns[2000] = function(data, callBack){//��ͬ��ʵ�壬wbs, �߲�ƻ�Ԫ�أ�������Զ���ʵ�壬���գ����� 
		var objData = {
				multiple: data.isMult,
				paraMap: data.paraMap
		};
		objData.objectID = (data.params && data.params.entityId) || data.entityId;
		objData.name = data.inputid;
		objData.search = 1;
		objData = Search.entityLayer(objData);
		if(objData){
			callBack({
				id: objData.objectID,
				name: objData.objectName
			});
		}
	};
})();


function openViewFile(url) {
	var mhtmlHeight =  screen.availHeight - 160; // window.screen.availHeight - 60;//��ô��ڵĴ�ֱλ��;
	var mhtmlWidth = screen.availWidth - 200; // window.screen.availWidth - 15; //��ô��ڵ�ˮƽλ��; 
	var iLeft = (window.screen.availWidth - mhtmlWidth) / 2; //��ô��ڵĴ�ֱλ��;
	var iTop = (window.screen.availHeight - mhtmlHeight) / 2; //��ô��ڵ�ˮƽλ��;
	/*
	var mhtmlHeight =  screen.availHeight - 60; // window.screen.availHeight - 60;//��ô��ڵĴ�ֱλ��;
	var mhtmlWidth = screen.availWidth - 15; // window.screen.availWidth - 15; //��ô��ڵ�ˮƽλ��; 
	var iLeft = 0; //��ô��ڵĴ�ֱλ��;
	var iTop = 0; //��ô��ڵ�ˮƽλ��;
	*/
	window.open(url, '�����ĵ�', 'height='+mhtmlHeight+',width='+mhtmlWidth+',top='+iTop+',left='
		+iLeft+',toolbar=no,menubar=no,scrollbars=no,resizable=yes, location=no,status=no');  
}