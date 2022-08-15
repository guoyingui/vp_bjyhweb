//查找弹出窗口公用函数
var Search = {
	//查找用户
	user: function (obj){
		window.request = new Object();
		window.request.userID = obj.userID || "0";
		window.request.userName = obj.userName || "";
		
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
		if(obj.multiple){//多选
			Common.showModalWin('/project/share/usero/searchUserMultiple.jsp?'+para, window, 802, 572);
		}else{//单选
			Common.showModalWin('/project/share/usero/searchUser.jsp?'+para, window, 702, 572);
		}
		
		var objData = window.request.resData;
		return objData;
	},
	//查找项目
	project: function (obj){
		window.request = new Object();
		window.request.projectID = obj.projectID || "0";
		window.request.projectName = obj.projectName || "";
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
		
		if(obj.multiple){//多选
			Common.showModalWin('/project/share/projecto/searchProjectMultiple.jsp?type='+type+'&from='+obj.from, window, 802, 572);
		}else{//单
			Common.showModalWin('/project/share/projecto/searchProject.jsp?type='+type+'&from='+obj.from, window, 702, 572);
		}
		
		var objData = window.request.resData;
		return objData;
	},
	//查找合同、自定义实体
	entity: function (obj){
		window.request = new Object();
		window.request.projectID = obj.projectID==undefined?"0":obj.projectID;
		window.request.projectName = obj.projectName==undefined?"":obj.projectName;
		var object = undefined;
		var isMult = !!obj.multiple;
		if("45"==obj.objectID){//预算
			Common.showModalWin("/project/finance/budgetManager/searchBudgetToolbar.jsp?entityId=45&mult="+isMult, null, 800, 600, function(data){
				if(!data)return;
				object = {objectID: "", objectName: ""};
				for(var i=0, len=data.length; i<len; i++){
					object.objectID += (i==0?"":",")+data[i].id;
					object.objectName += (i==0?"":",")+data[i].name;
				}
			});
		}else if("46"==obj.objectID){//费用
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
		}else if("1032"==obj.objectID){//选择需求目录
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
	//查找部门
	department: function (obj){
		window.request = new Object();
		window.request.deptID = obj.departmentID || "0";
		window.request.deptName = obj.departmentName || "";
		window.request.isUserWorkdepartment = obj.isUserWorkdepartment || false;//默认查所有，如果是true，则只查登陆用户工作单位。
		//是否有高级查找
		if(obj.conditionFlag == undefined){
			window.request.conditionFlag = true;
		}else{
			window.request.conditionFlag = obj.conditionFlag;
		}
		if(obj.multiple){//多选
			Common.showModalWin('/project/share/depto/searchDepartmentMultiple.jsp', window, 802, 572);
		}else{//单选
			Common.showModalWin('/project/share/depto/searchDepartment.jsp', window, 702, 572);
		}
		
		var objData = window.request.resData;
		return objData;
	},
	docUserGroup:function(obj){
		window.request = new Object();
		if(obj.multiple){//多选
			Common.showModalWin('/project/share/doc/searchUserGroup.jsp?signle=0&isOld='+obj.isOld, window, 702, 572);
		}else{//单选
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
	//注册实体的查找函数
	SearchFns[0] = function(data, callBack){//项目群
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
	SearchFns[1] = function(data, callBack){//项目
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
	SearchFns[6] = function(data, callBack){//部门
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
	SearchFns[7] = function(data, callBack){//用户
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