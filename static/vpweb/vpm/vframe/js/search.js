//���ҵ������ڹ��ú���
var Search = {
	//�����û�
	user: function (obj){
		window.request = new Object();
		window.request.userID = obj.userID || "0";
		window.request.userName = obj.userName || "";
		
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
		if(obj.multiple){//��ѡ
			Common.showModalWin('/project/share/usero/searchUserMultiple.jsp?'+para, window, 802, 572);
		}else{//��ѡ
			Common.showModalWin('/project/share/usero/searchUser.jsp?'+para, window, 702, 572);
		}
		
		var objData = window.request.resData;
		return objData;
	},
	//������Ŀ
	project: function (obj){
		window.request = new Object();
		window.request.projectID = obj.projectID || "0";
		window.request.projectName = obj.projectName || "";
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
		
		if(obj.multiple){//��ѡ
			Common.showModalWin('/project/share/projecto/searchProjectMultiple.jsp?type='+type+'&from='+obj.from, window, 802, 572);
		}else{//��
			Common.showModalWin('/project/share/projecto/searchProject.jsp?type='+type+'&from='+obj.from, window, 702, 572);
		}
		
		var objData = window.request.resData;
		return objData;
	},
	//���Һ�ͬ���Զ���ʵ��
	entity: function (obj){
		window.request = new Object();
		window.request.projectID = obj.projectID==undefined?"0":obj.projectID;
		window.request.projectName = obj.projectName==undefined?"":obj.projectName;
		var object = undefined;
		var isMult = !!obj.multiple;
		if("45"==obj.objectID){//Ԥ��
			Common.showModalWin("/project/finance/budgetManager/searchBudgetToolbar.jsp?entityId=45&mult="+isMult, null, 800, 600, function(data){
				if(!data)return;
				object = {objectID: "", objectName: ""};
				for(var i=0, len=data.length; i<len; i++){
					object.objectID += (i==0?"":",")+data[i].id;
					object.objectName += (i==0?"":",")+data[i].name;
				}
			});
		}else if("46"==obj.objectID){//����
			Common.showModalWin("/project/finance/feeManager/searchFeeToolbar.jsp?entityId=46&mult="+isMult, null, 800, 600, function(data){
				if(!data)return;
				object = {objectID: "", objectName: ""};
				for(var i=0, len=data.length; i<len; i++){
					object.objectID += (i==0?"":",")+data[i].id;
					object.objectName += (i==0?"":",")+data[i].name;
				}
			});
		}else if("41"==obj.objectID){
			Common.showModalWin("/project/share/doc/searchDocToolbar.jsp?entityId=41&mult="+isMult, null, 800 ,600, function(res){
				if(res){
					object = {objectID: "", objectName: ""};
					for(var i=0, len=res.length; i<len; i++){
						object.objectID += (i==0?"":",")+res[i].id;
						object.objectName += (i==0?"":",")+res[i].name;
					}
				}
			});
		}else if("1032"==obj.objectID){//ѡ������Ŀ¼
			Common.showModalWin("/project/vn/rdirsel.jsp?entityId=1032&projectid="+(obj.projectID||'')+'&id='+obj.dirID, null, 600 ,500, function(res){
				if(!res)return;
				if(res){
					object = {objectID: "", objectName: "",projectID:"",projectName:""};
					if(res.length>0){
						object={objectID:res[0].id,objectName:res[0].name,projectID:res[0].projectid,projectName:res[0].projectname};
					}
					
				}
			});
		}else{
			Common.showModalWin('/project/system/workitem/searchEntityToolBar.jsp?'+(isMult?'':'isradio=true')+'&objectID='+obj.objectID+'&projectID='+obj.projectID+'&projectName='+obj.projectName+'&entityname='+(obj.objectName||""), window, 902, 602);
		}
		
		var objData = window.request.resData;
		if("45"==obj.objectID || "46"==obj.objectID || "41"==obj.objectID||"1032"==obj.objectID){
			return object;
		}else{
			return objData;
		}
	},
	//���Ҳ���
	department: function (obj){
		window.request = new Object();
		window.request.deptID = obj.departmentID || "0";
		window.request.deptName = obj.departmentName || "";
		window.request.isUserWorkdepartment = obj.isUserWorkdepartment || false;//Ĭ�ϲ����У������true����ֻ���½�û�������λ��
		//�Ƿ��и߼�����
		if(obj.conditionFlag == undefined){
			window.request.conditionFlag = true;
		}else{
			window.request.conditionFlag = obj.conditionFlag;
		}
		if(obj.multiple){//��ѡ
			Common.showModalWin('/project/share/depto/searchDepartmentMultiple.jsp', window, 802, 572);
		}else{//��ѡ
			Common.showModalWin('/project/share/depto/searchDepartment.jsp', window, 702, 572);
		}
		
		var objData = window.request.resData;
		return objData;
	},
	docUserGroup:function(obj){
		window.request = new Object();
		if(obj.multiple){//��ѡ
			Common.showModalWin('/project/share/doc/searchUserGroup.jsp?signle=0&isOld='+obj.isOld, window, 702, 572);
		}else{//��ѡ
			Common.showModalWin('/project/share/doc/searchUserGroup.jsp?signle=1&isOld='+obj.isOld, window, 702, 572);
		}
		
		var objData = window.request.resData;
		return objData;
		
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
				multiple: data.isMult
		};
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
				multiple: data.isMult
		};
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
				isUserWorkdepartment:data.isReport||false
		};
		objData = Search.department(objData);
		if(objData){
			callBack({
				id: objData.departmentID,
				name: objData.departmentName
			});
		}
	};
	SearchFns[7] = function(data, callBack){//�û�
		var objData = {
				userID: data.id,
				userName: data.name,
				multiple: data.isMult
		};
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
				multiple: data.isMult
		};
		objData.objectID = (data.params && data.params.entityId) || data.entityId;
		objData = Search.entity(objData);
		if(objData){
			callBack({
				id: objData.objectID,
				name: objData.objectName
			});
		}
	};
})();