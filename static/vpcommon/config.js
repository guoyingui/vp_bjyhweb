!function () {
    if(!window.vp){
        window.vp = {};
    }

	var result = document.location.href.split("/"); 
	var shttp = result[0];
	var shostport = result[2].split(":");
	var sport = 80;
	var shost = shostport[0];
	if (shostport.length == 2) {
		sport = shostport[1];
	}
	var srootpath = '';
	var devflag = true;		                                                  // 网关开关， 是否开发模式，true表为是，false表为否
	var gatWayUrl = "";
	var devhost = shttp + "//" + shost + ":" + sport;
	var odmurl = "";
	var xqyl = "http://10.51.88.10:8090";

	if (devflag) {
		gatWayUrl = "http://bjyh.vpsoft.cn:8888/vpgatway";		                      // 开发时，同一个应用服务中可以启用这个模式  http://vpsoft.iok.la:16108
		sport = 8101;										                      // 开发时，指向本地的react工程端口
		odmurl = "http://bjyh.vpsoft.cn:8080";
		// 增加报表服务访问地址配置（注意不能以/结尾）
		//window.rpthost = window.location.protocol+"//"+window.location.host;
		window.rpthost = "http://bjyh.vpsoft.cn:8080";
	}else {
		//gatWayUrl = devhost + "/vpgatway";					                  // 服务和网关在一个服务器上时
		//srootpath = '/valm';                                                      // 部署工作流访问UI界面需要
		gatWayUrl = "http://test.yf.vpsoft.cn/vpgatway";	                          // 服务和网关在不同服务器时，指定固定的网关地址 http://dev.yf.vpsoft.cn/vpgatway
		odmurl = "http://odm.dev.yf.vpsoft.cn";
		// 增加报表服务访问地址配置（注意不能以/结尾）
		window.rpthost = "http://report.zbbankpro.yf.vpsoft.cn";
	}

    window.vp.config = {
        "URL": {
            "localHost": gatWayUrl,
			"jsonHost": devhost,
			"console": true,                                                     // 是否开启前端控制台日志输出和全局异常捕获
			"devflag": devflag,
			"rootpath": srootpath,
			"timeout": 60000,                                                     // 毫秒单位
            "upload": gatWayUrl + "/zuul/{vpplat}/file/uploadfile",
            "download": gatWayUrl + "/zuul/{vpplat}/file/downloadfile",
			"odm_websocket": odmurl,
			'workFlow': 'vpflow',
			'systemtitle': '121ddff',
			'vpaddress':'192.168.1.140:8081',//vp老系统跳转地址
			'fileView':false,
			"devMode": {
				"enabled": devflag,                                               // 网关开关
				"proxy": {                                                        // 网关转开发服务器(注意：上传附件时，需要将网关服务器bootstrap.yml中地址指向对应的开发服务器才行)
					'vtmprovider': 'http://bjyh.vpsoft.cn:8888'
					,'vrmprovider': 'http://bjyh.vpsoft.cn:8888/vrmprovider'	          // 示例
					,'odmprovider': 'http://bjyh.vpsoft.cn:8888/vrmprovider'
					,'vpplatprovider': 'http://bjyh.vpsoft.cn:8888/vpplatprovider'
					,'vpflowprovider': 'http://bjyh.vpsoft.cn:8888/vpflowprovider'
					,'vpmprovider': 'http://bjyh.vpsoft.cn:8888/vpmprovider'
					,'bjyhprovider': 'http://bjyh.vpsoft.cn:8888/bjyhprovider'
				}
			},
			'errormsg': {
                title: "",                                                        // 不填会显示默认
                content: "<p class='m-t-sm'>联系：XXX</p><p>电话：010-567822255</p><p>邮箱：support@gmail.com</p>"
            },
        },
        "SETTING": {
			'vpcloud-auth'      :   '',
			'vpplat'            :   'vpplatprovider',						      // 网关假名，对应网关应用中的bootstrap.yml
			'vpflow'            :   'vpflowprovider',							  // 网关假名，对应网关应用中的bootstrap.yml
			'vpmprovider'       :   'vpmprovider',							      // 网关假名，对应网关应用中的bootstrap.yml
			'vtm'               :   'vtmprovider',
			'vpodm'				:	'vrmprovider',
			'vpvrm'				:	'vrmprovider',
			'bjyh'				:	'bjyhprovider',
			'vpgatway'			:   gatWayUrl,
			'vpui'              :   devhost                                       //指向根应用
        },
		"weblist":[   // 应用集合，注意frameweb入口工程放在第一位；如果各应用都有首页 ,最后一个应用优先级最高
			'vpplatweb'
		],
		"themeId": "demoid", //全局菜单主题颜色自定义 id
		"isOpenMenu": 0 ,     // 0: 左侧菜单; 1: 头部菜单; 2: 左侧头部菜单
		"pagination":{
			'defaultPageSize': 10,                                                // 初始的每页条数Number 默认10
			'pageSizeOptions': []                                                 // 自定义每页可以显示多少条 默认['10', '20', '30', '40']
		},
		"vpmbuttonvisible": { //项目自定义参数设置 0:不显示 1:显示
			'phasemirror': 1,           //高层计划镜像
			'phasemirrorview': 1,       //高层计划视图
			'phasemilestoneview': 1,    //高层计划里程碑视图
			'phasebaselinecompare': 1,  //高层计划基线比较
			'wbsmirror': 1,             //wbs计划镜像
			'wbsmirrorview': 1,         //wbs计划镜像视图
			'wbscomparegantt': 1,       //wbs比较甘特图
			'wbsIsShowTab': true,      //wbs中tab显示
		},
		"jgjk":{//跟IT资产架构平台接口url
			"xqbg":{
				'xqbgListUrl':xqyl+'/system/vp/query',//需求变更流程list接口
				'uploadfileUrl':xqyl+'/system/file/uploadfile',//上传附件接口
				'downloadfileUrl':xqyl+'/system/file/downloadfile',
				'getAttrByIdUrl':xqyl+'',//根据用例id获取详细信息url
				'saveReqCaseUrl':xqyl+'/system/vp/operate',//保存用例接口
				'xqbgRelReqCaseListUrl':xqyl+'/system/vp/relatedProjectCaseChangeList',//需求变更关联用例列表接口
				'xqbgRelReqCaseUrl':xqyl+'/system/vp/insertChangeCorrelationVpCase',//需求变更关联用例列表接口
				'xmsqcancelRelReqCaseUrl':xqyl+'/system/vp/cacleVpCase',//需求变更取消关联用例接口
				'reTryRelReqCaseUrl':xqyl+'/system/vp/reconnectVpCase',//重新关联接口
				'reqCaseTypeUrl':xqyl+'我是用例类型接口',//用例类型接口
				'taskListUrl':xqyl+'/system/needCase/getTasksForVp2',//任务列表接口
				'getprevireurl':xqyl+'/files/',//删除单个用例接口
				'deleteVpCaseAdd':xqyl+'/system/vp/deleteVpCaseAdd',//删除单个用例接口
				'relatedProjectAndCase':xqyl+'/system/vp/relatedProjectAndCase',//项目关联用例
			},
			"ylxz":{
			  'xzuploadfileUrl':xqyl+'/system/file/uploadfile',//新增单个文件上传接口
			  'downloadfileUrl':xqyl+'/system/file/downloadfile',//附件下载接口
			  'batchFileUpload':xqyl+'/system/file/batchuploadfile',//批量上传附件地址接口

			  'ylglzymlist':xqyl+'/system/vp/query',//普通查询用例列表接口
			  'hqylglzymlist':xqyl+'/system/vp/countersignExamineList',//流程第四步-领导会签列表接口
			  'xghqylglzymlist':xqyl+'/system/vp/countersignExamineEmpList',//流程第二步-相关会签列表接口

			  'hqswitchFlag':xqyl+'/system/vp/modifyCountersignExamineCaseStatus',//流程第四步-领导会签通过不通过按钮传参接口
			  'xghqswitchFlag':xqyl+'/system/vp/modifyCountersignExamineCaseStatusEmp',//流程第二步-相关会签通过不通过按钮传参接口

			  'xghqcheckyllist':xqyl+'/system/vp/noPassEmp',//流程第二步-相关用户会签节点调用判断当下用例是否全部不通过 都不通过allNoPass，true； 每个人都不通过userNoPass，true；
			  'cscheckyllist':xqyl+'/system/vp/noPassForFistExamine',//流程第三步-初审判断当前用例是否全部不通过
			  
			  'batchYlupload':xqyl+'/system/file/uploadexcel',//批量用例上传接口
			  'getXqylDeptList':xqyl+'/system/vp/getVpCaseDepartmentId',//第一步获取当前流程对应的所有用例部门
			  'queryNoPassYlList':xqyl+'/system/vp/relatedProjectCaseChangeList',//查询未通过的用例列表接口
			  'switchFlag':xqyl+'/system/vp/fistExamineFinish',//通过不通过按钮传参接口

			  'xzsave':xqyl+'/system/vp/operate',//新增用例保存接口
			  'deleteyl':xqyl+'/system/vp/deleteVpCaseAdd',//删除单个用例接口
			  'addtaskList':xqyl+'/system/needCase/getTasksForVp',//获取任务列表接口
			  'savePassYl':xqyl+'/system/vp/insertChangeCorrelationVpCase',//关联未通过的用例接口
			  'checkRfj':xqyl+'/system/vp/getCaseAndFileByFlowId ',//检查当前流程下的所有用例是否都有附件
			},
			"sxsq":{
				'sxsqRelReqCaseListUrl':xqyl+'/system/vp/relatedProjectCaseChangeList',//上线申请关联用例列表接口
				'sxsqRelReqCaseUrl':xqyl+'/system/vp/insertChangeCorrelationVpCase',//上线申请关联用例列表接口
				'sxsqListUrl':xqyl+'/system/vp/query',//上线申请流程list接口
				'deleteCase':xqyl+'/system/vp/deleteVpCaseAdd',//删除单个用例接口
				},
			"xmyl":{
				'xmylRelReqCaseListUrl':xqyl+'/system/needCase/getNeedCases'
			}

		}
    };
}()