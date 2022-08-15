/*
 选择对象弹出框,参数说明：
cfg选择框配置信息：cfg.entityID（实体ID）、cfg.multiple（是否多选）、cfg.checkedObjID（当前选中值）、cfg.condition（条件值）
callback处理已选数据的回调函数
调用方式如：chosenEntity(cfg,function(data){});其中回调函数的唯一参数data就是选中的返回值（配置参数为多选时返回值是json数组，单选为json对象）
*/
var commonCFG;
var Chosen = {
	chosenEntity: function (cfg,callback){
		commonCFG = cfg;//设置参数
		// alert(commonCFG.irolegroupid);
		layer.open({
	        type: 2, // 可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
	        maxmin: true,
			title: '选择对象',
	        btn: ['确定', '取消'],
	        btnAlign:'c',
	        area: [cfg.width||'70%', cfg.height||'578px'],
	        resize: false,
	        shift: 2,
	        shade: 0.3,
	        content: ['../../vfm/sys/chosenEntity.html'], //iframe的url，no代表不显示滚动条
	        success: function(layero, index){
	        	layero.find('.layui-layer-btn').css('text-align', 'center');
	        },
	        yes: function(index, layero){
	            //按钮【按钮一】的回调
	            //alert('按钮【按钮一】的回调');
	            var resData = $(layero).find("iframe")[0].contentWindow.returnData();
	            if(resData){
	            	//alert('我是返回数据：'+resData);
	            	if(resData.length>0){
	            		callback(resData);
		            	layer.close(index);
	            	}else{
	            		//layer.confirm("尚未选择任何一条数据，请确认是否清除数据？",{ title: "确认清除？" },function(indexc){
	            			callback(resData);
	            			//layer.close(indexc);
	            			layer.close(index);
	            		//});
	            	}
	            }else{
	            	//layer.confirm("尚未选择任何一条数据，请确认是否清除数据？",{ title: "确认清除？" },function(indexc){
	            		callback(resData);
	            		//layer.close(indexc);
            			layer.close(index);
            		//});
	            }
	        },
	        end: function(){ //此处用于演示
	            //alert('我可以传值给父层！这里是回调函数')
	        }
	    });
		$('iframe').contents().find('.layui-layer-btn').css('text-align', 'center');
	},
	getUserCols: function (cfg){//用户列表表头设置
		var selector = {field:'left', title: '', width:60,toolbar:'#barDemo'};
		if(cfg.multiple){
			selector = {checkbox: true, fixed: true};
		}
		var	coloums = [
	                [selector,
	                {
	                    field: 'scode',
	                    title: '用户编码',
	                    sort: true,
						event: 'click'
	                },	
	                {
	                    field: 'sname',
	                    title: '用户名',
						event: 'click'
	                },  
	                {
	                    field: 'loginname',
	                    title: '登录名',
						event: 'click'
	                },  
	                {
	                    field: 'departmentname',
	                    title: '归属部门',
						event: 'click'
	                }/*,  
	                {
	                    field: 'email',
	                    title: '邮箱',
	                    sort: true
	                },  
	                {
	                    field: 'modifyperson',
	                    title: '最后修改时间',
	                    sort: true
	                },  
	                {
	                    field: 'modifydate',
	                    title: '最后修改人',
	                    sort: true
	                }*/]
	            ];
		return coloums;
	},
	getDepartmentCols: function (){//部门列表表头设置
		var selector = {field:'left', title: '', width:60,toolbar:'#barDemo'};
		if(cfg.multiple){
			selector = {checkbox: true, fixed: true};
		}
		var	coloums = [
	                [selector,
					{
	                    field: 'scode',
	                    title: '部门编码',
	                    sort: true,
						event: 'click'
	                }, {
	                    field: 'sname',
	                    title: '部门名称',
						event: 'click'
	                }, {
	                    field: 'owner',
	                    title: '负责人',
						event: 'click'
	                }/*, {
	                    field: 'modifyperson',
	                    title: '最后修改人'
	                },  {
	                    field: 'modifydate',
	                    title: '最后修改时间',
	                    sort: true
	                }*/]
	            ];
		return coloums;
	},
	getProjectCols: function (){//项目列表表头设置
		var selector = {field:'left', title: '', width:60,toolbar:'#barDemo'};
		if(cfg.multiple){
			selector = {checkbox: true, fixed: true};
		}
		var	coloums = [
	                [selector,
					{
	                    field: 'scode',
	                    title: '项目编码',
	                    sort: true,
						event: 'click'
	                }, {
	                    field: 'sname',
	                    title: '项目名称',
						event: 'click'
	                }, {
	                    field: 'departmentname',
	                    title: '归属部门',
						event: 'click'
	                }, {
	                    field: 'owner',
	                    title: '项目经理',
						event: 'click'
	                }/*, {
	                    field: 'modifyperson',
	                    title: '最后修改人'
	                },  {
	                    field: 'modifydate',
	                    title: '最后修改时间',
	                    sort: true
	                }*/]
	            ];
		return coloums;
	},
	getPhaseCols: function (){//高层计划列表表头设置
		var selector = {field:'left', title: '', width:60,toolbar:'#barDemo'};
		if(cfg.multiple){
			selector = {checkbox: true, fixed: true};
		}
		var colsName = '阶段名称';
		if(cfg.entityID=='22'){
			colsName = '交付物名称';
		}else if(cfg.entityID=='23'){
			colsName = '里程碑名称';
		}else if(cfg.entityID=='24'){
			colsName = '活动名称';
		}
		var	coloums = [
	                [selector,
					{
	                    field: 'sname',
	                    title: colsName,
						event: 'click'
	                }, {
	                    field: 'departmentname',
	                    title: '归属部门',
						event: 'click'
	                }, {
	                    field: 'projectname',
	                    title: '归属项目',
						event: 'click'
	                }, {
	                    field: 'owner',
	                    title: '负责人',
						event: 'click'
	                }/*, {
	                    field: 'modifyperson',
	                    title: '最后修改人'
	                },  {
	                    field: 'modifydate',
	                    title: '最后修改时间',
	                    sort: true
	                }*/]
	            ];
		return coloums;
	},
	getTaskCols: function (){//任务计划列表表头设置
		var selector = {field:'left', title: '', width:60,toolbar:'#barDemo'};
		if(cfg.multiple){
			selector = {checkbox: true, fixed: true};
		}
		var	coloums = [
	                [selector,
					{
	                    field: 'name',
	                    title: '任务计划名称',
						event: 'click'
	                }, {
	                    field: 'departmentname',
	                    title: '归属部门',
						event: 'click'
	                }, {
	                    field: 'projectname',
	                    title: '归属项目',
						event: 'click'
	                }, {
	                    field: 'owner',
	                    title: '负责人',
						event: 'click'
	                }/*, {
	                    field: 'modifyperson',
	                    title: '最后修改人'
	                },  {
	                    field: 'modifydate',
	                    title: '最后修改时间',
	                    sort: true
	                }*/]
	            ];
		return coloums;
	},
	getWorkitemCols: function (){//工作项列表表头设置
		var selector = {field:'left', title: '', width:60,toolbar:'#barDemo'};
		if(cfg.multiple){
			selector = {checkbox: true, fixed: true};
		}
		var	coloums = [
	                [selector,
					{
	                    field: 'scode',
	                    title: '编码',
	                    sort: true,
						event: 'click'
	                }, {
	                    field: 'sname',
	                    title: '名称',
						event: 'click'
	                }, {
	                    field: 'departmentname',
	                    title: '归属部门',
						event: 'click'
	                }, {
	                    field: 'owner',
	                    title: '负责人',
						event: 'click'
	                }/*, {
	                    field: 'modifyperson',
	                    title: '最后修改人'
	                },  {
	                    field: 'modifydate',
	                    title: '最后修改时间',
	                    sort: true
	                }*/]
	            ];
		return coloums;
	},
	getFlowgroupCols: function (){//流程组表头
		var selector = {field:'left', title: '', width:60,toolbar:'#barDemo'};
		if(cfg.multiple){
			selector = {checkbox: true, fixed: true};
		}
		var	coloums = [
			[selector,
				{
					field: 'iid',
					title: '编码',
					sort: true,
					event: 'click'
				}, {
				field: 'sname',
				title: '名称',
				event: 'click'
			}]
		];
		return coloums;
	},
	getUserGroupCols: function (){//用户组表头
		var selector = {field:'left', title: '', width:60,toolbar:'#barDemo'};
		if(cfg.multiple){
			selector = {checkbox: true, fixed: true};
		}
		var	coloums = [
			[selector,
				{
					field: 'iid',
					title: '编码',
					sort: true,
					event: 'click'
				}, 
				{
					field: 'sname',
					title: '名称',
					event: 'click'
				}, 
				{
					field: 'sdescription',
					title: '描述',
					event: 'click'
				}
			]
		];
		return coloums;
	}
}