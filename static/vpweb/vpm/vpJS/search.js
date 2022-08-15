//查找弹出窗口公用函数
var Search = {
	//查找用户
	user: function (obj){
		
		window.request = new Object();
		window.request.userID = obj.userID || "0";
		window.request.userName = obj.userName || "";
		var userIDCur = obj.userID || "0";
		var userNameCur = userName = obj.userName || "";
		var frameid = obj.frameid ||"";
		//是否有高级查找
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
		if(obj.multiple){//多选
			url = '/project/share/user/searchUserMultiple.jsp?objid='+obj.name+para;
		}else{//单选
			url = '/project/share/user/searchUser.jsp?objid='+obj.name+para;
		}
		//解决用户选择器乱码
		url = encodeURI(encodeURI(url));
		if (obj.search == 1) {
			var map = {};
			map['fromType'] = 'search';
			dialog.openQuerySearch('用户选择器', url, map);
		}
		else if (obj.search == 2) { // 流程选择用户
			var map = {};
			map['fromType'] = 'flow';
			dialog.openQueryEdit('用户选择器', url, map);
		}
		else if (obj.search == 3) { // 新建项目对象
			var map = {};
			map['fromType'] = 'newindex';
			dialog.openQueryEditIdex('用户选择器', url, map);
		}
		else if (obj.search == 4) { // 修改项目对象
			var map = {};
			map['fromType'] = 'editindex';
			dialog.openQueryEditIdex('用户选择器', url, map);
		}else if (obj.search == 5) { // 修改项目对象
			var map = {};
			map['fromType'] = 'editindex';
			dialog.openQuerySearchModel('用户选择器', url, map);
		}else if(obj.search == 6){
			parent.dialog.openQueryEdit('用户选择器', url);
		}else if(obj.search == 7){
			parent.parent.dialog.openQueryEdit('用户选择器', url);
		}else if(obj.search == 8){
			parent.parent.parent.dialog.openQueryEdit('用户选择器', url);
		}else if(obj.search == 88){ //文档用户组维护
			parent.parent.parent.dialog.openQueryEditIdex('用户选择器', url);
		}else if(obj.search == 9){
			parent.parent.parent.parent.dialog.openQueryEdit('用户选择器', url);
		}
		else {
			try{
				parent.parent.dialog.openQueryEdit('用户选择器', url);
			}catch(e){
				parent.parent.parent.dialog.openQueryEdit('用户选择器', url);
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
		if(obj.multiple){//多选
			url = '/project/system/workitem/searchEntityMultiToolBar.jsp?objectID=2635&objid='+obj.name + param;
		}else{//单
			url = '/project/system/workitem/searchEntityToolBar.jsp?objectID=2635&objid='+obj.name + param;
		}
		//解决对象选择器乱码
		//alert(url);
		url = encodeURI(encodeURI(url));
		var map = {};
		map['fromType'] = 'pjinfos';
		map['snamevalue'] = oel.value;
		parent.parent.dialog.openQueryEdit('应用系统选择器', url, map);
	},
	docUserGroup:function(obj){
		window.request = new Object();
		if(obj.multiple){//多选
			//Common.showModalWin('/project/share/doc/searchUserGroup.jsp?signle=0', window, 702, 572);
			dialog.openQuerySearch("文档用户组选择器",'/project/share/doc/searchUserGroup.jsp?signle=0&fieldID='+obj.name);
		}else{//单选
			//Common.showModalWin('/project/share/doc/searchUserGroup.jsp?signle=1', window, 702, 572);
			dialog.openQuerySearch("文档用户组选择器",'/project/share/doc/searchUserGroup.jsp?signle=1');
		}
		
		//var objData = window.request.resData;
		//return objData;
		
	},
	//查找项目
	project: function (obj){
		debugger;
		window.request = new Object();
		window.request.projectID = obj.projectID || "0";
		window.request.projectName = obj.projectName || "";
		window.request.selectprojectname=obj.selectprojectname || "";
		//是否有高级查找
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
		if(obj.multiple){//多选
			url = '/project/share/project/searchProjectMultiple.jsp?type='+type+'&from='+obj.from+para;
		}else{//单
			url = '/project/share/project/searchProject.jsp?type='+type+'&sprojectname='+sprojectname+'&from='+obj.from+para;
		}
		//解决项目选择器乱码
		//alert(url);
		url = encodeURI(encodeURI(url));
		var titleStr = '项目选择器';
		if(type=='2'){
			titleStr = '项目群/项目选择器';
		}else if(type=='0'){
			titleStr = '项目群选择器';
		}
		if (obj.search == 1) {
			var map = {};
			map['fromType'] = 'search';
			map['snamevalue'] = projectNameCur;
			dialog.openQuerySearch(titleStr, url, map);
		}
		else if (obj.search == 3) { // 新建项目对象
			var map = {};
			map['fromType'] = 'newindex';
			map['snamevalue'] = projectNameCur;
			dialog.openQueryEditIdex(titleStr, url, map);
		}
		else if (obj.search == 4) { // 修改项目对象
			var map = {};
			map['fromType'] = 'editindex';
			map['snamevalue'] = projectNameCur;
			dialog.openQueryEditIdex(titleStr, url, map);
		}
		else if (obj.search == 5) { // 系统管理中
			var map = {};
			map['fromType'] = 'system';
			map['snamevalue'] = projectNameCur;
			parent.parent.dialog.openQuery(titleStr, url, map);
		}
		else if(obj.search == 6){//合同中收付款履行跟踪关联项目
			var map = {};
			map['snamevalue'] = projectNameCur;
			parent.dialog.openQueryEdit(titleStr, url, map);
		}
		else if(obj.search == 7){ // 流程子页面
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
	//查找合同、自定义实体
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
		if(obj.multiple){//多选
			url = '/project/system/workitem/searchEntityMultiToolBar.jsp?objectID='+obj.objectID+'&objid='+obj.name+'&curEId='+obj.curEId + param;
		}else{//单
			url = '/project/system/workitem/searchEntityToolBar.jsp?objectID='+obj.objectID+'&objid='+obj.name+'&curEId='+obj.curEId + param;
		}
		//alert(url);
		//解决对象选择器乱码
		url = encodeURI(encodeURI(url));
		//pp['snamevalue'] = oel.value;
		if (obj.objectID=='21') {
			var projectID = obj.projectID;
			var phaseID = obj.phaseID;
			var phaseName = obj.phaseName;
			var fieldID = obj.fieldID;
			url = '/project/share/phase/searchPhase.jsp?fieldID='+fieldID+'&projectID='+projectID+'&phaseID='+phaseID+'&phaseName='+phaseName;
			//解决对象选择器乱码
			url = encodeURI(encodeURI(url));
			if(obj.search == 2){
				dialog.openQuerySearchModel('对象选择器', url, pp);
			}else{
				dialog.openQuerySearch('对象选择器', url, pp);
			}
		}
		else if(obj.objectID=='1032'){
			var tu = "/project/vn/rdirsel.jsp?entityId=1032&projectid="+(obj.projectID||'')+'&id='+obj.dirID;
			parent.parent.dialog.openQueryEdit('对象选择器', tu, pp);
		}else{
			if(parent.parent.parent.location.href.indexOf("pjinfos") != -1){
				if(obj.objectID=='1662'){//项目-项目团队-干系人管理
					parent.parent.dialog.openQuery('对象选择器', url, pp);
				}else{
					parent.parent.dialog.openQueryEdit('对象选择器', url, pp);//项目-研发管理-缺陷
				}
			}else{
				if (obj.search == 1) {
					var map = {};
					map['fromType'] = 'search';
					map['snamevalue'] = oel==undefined?'':oel.value;
					dialog.openQuerySearch('对象选择器', url, map);
				}else if(obj.search == 2){
					var map = {};
					map['fromType'] = 'relation';
					map['snamevalue'] = oel==undefined?'':oel.value;
					parent.parent.dialog.openQueryEdit('对象选择器', url, map);
				}
				else {
					if (pp == undefined) {
						var map = {};
						map['fromType'] = 'relation';
						map['snamevalue'] = oel==undefined?'':oel.value;
						if(parent.parent.location.href.indexOf("pjinfos")!=-1){
							parent.parent.dialog.openQuery('对象选择器', url, pp);
						}else{
							parent.parent.dialog.openQueryEdit('对象选择器', url, map);
						}
						
					}
					else {				
						if (pp['flowtype'] == '1') {
							parent.parent.parent.parent.parent.dialog.openQueryEdit('对象选择器', url, pp);
						}
						else {
							if(parent.parent.location.href.indexOf("pjinfos")!=-1){
								// parent.parent.dialog.openQueryEdit('对象选择器', url, pp);
								parent.parent.dialog.openQuery('对象选择器', url, pp);
							}else{
								parent.parent.parent.parent.dialog.openQueryEdit('对象选择器', url, pp);
							}
						}
					}
				}
			}
		}
		
	},
	//查找部门
	department: function (obj){
		window.request = new Object();
		window.request.deptID = obj.departmentID || "0";
		window.request.deptName = obj.departmentName || "";
		window.request.isUserWorkdepartment = obj.isUserWorkdepartment || false;//默认查所有，如果是true，则只查登陆用户工作单位。
		//-----------------------------------
		var deptIDCur = obj.departmentID || "0";
		var deptNameCur = obj.departmentName || "";
		var isUserWorkdepartmentCur = obj.isUserWorkdepartment || false;//默认查所有，如果是true，则只查登陆用户工作单位。
		//是否有高级查找
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
		if(obj.multiple){//多选
			url = '/project/share/dept/searchDepartmentMultiple.jsp?objid='+obj.name+para;
		}else{//单选
			url = '/project/share/dept/searchDepartment.jsp?objid='+obj.name+para;
		}
		//解决部门择器乱码
		//alert(url);
		url = encodeURI(encodeURI(url));
		if (obj.search == 1) {
			var map = {};
			map['fromType'] = 'search';
			dialog.openQuerySearch('部门选择器', url, map);
		}
		else if (obj.search == 3) { // 新建项目对象
			var map = {};
			map['fromType'] = 'newindex';
			dialog.openQueryEditIdex('部门选择器', url, map);
		}
		else if (obj.search == 4) { // 修改项目对象
			var map = {};
			map['fromType'] = 'editindex';
			dialog.openQueryEditIdex('部门选择器', url, map);
		}else if (obj.search == 5) { // 修改项目对象
			var map = {};
			map['fromType'] = 'editindex';
			dialog.openQuerySearchModel('部门选择器', url, map);
		}else if (obj.search == 6) { // 修改项目对象
			var map = {};
			map['fromType'] = 'flowinfo';
			parent.parent.parent.dialog.openQuerySearchModel('部门选择器', url, map);
		}
		else if(obj.search == 8){
			parent.parent.parent.dialog.openQueryEdit('部门选择器', url);
		}
		else {
			parent.parent.dialog.openQueryEdit('部门选择器', url);
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
	//注册实体的查找函数
	SearchFns[0] = function(data, callBack){//项目群
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
	SearchFns[1] = function(data, callBack){//项目
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
	SearchFns[6] = function(data, callBack){//部门
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
	SearchFns[7] = function(data, callBack){//用户
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
	SearchFns[21] = function(data, callBack){//阶段
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
	SearchFns[2000] = function(data, callBack){//合同，实体，wbs, 高层计划元素，工作项，自定义实体，风险，问题 
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
	var mhtmlHeight =  screen.availHeight - 160; // window.screen.availHeight - 60;//获得窗口的垂直位置;
	var mhtmlWidth = screen.availWidth - 200; // window.screen.availWidth - 15; //获得窗口的水平位置; 
	var iLeft = (window.screen.availWidth - mhtmlWidth) / 2; //获得窗口的垂直位置;
	var iTop = (window.screen.availHeight - mhtmlHeight) / 2; //获得窗口的水平位置;
	/*
	var mhtmlHeight =  screen.availHeight - 60; // window.screen.availHeight - 60;//获得窗口的垂直位置;
	var mhtmlWidth = screen.availWidth - 15; // window.screen.availWidth - 15; //获得窗口的水平位置; 
	var iLeft = 0; //获得窗口的垂直位置;
	var iTop = 0; //获得窗口的水平位置;
	*/
	window.open(url, '在线文档', 'height='+mhtmlHeight+',width='+mhtmlWidth+',top='+iTop+',left='
		+iLeft+',toolbar=no,menubar=no,scrollbars=no,resizable=yes, location=no,status=no');  
}