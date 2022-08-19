import dynamicModule from './pages/dynamicIndex';
import { extend } from "utils/utils";
import Demo from "./pages/bjyh/dynamic/index/index";
//import Demo from "./pages/custom/Workbench/index";


!function initRouter(params) {
	// 子项目路由
	let childApp = window.vpapp = window.vpapp || {};
	childApp.definde = extend({}, (childApp.definde || {}), dynamicModule)
	childApp.routes = (childApp.routes || []).concat([
		{
			//首页
			code: "demo",
			path: "/",
			component: Demo
		},
		{
			code: 'hello',
			path: '/hello',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/demo/hello').default);
				}, 'home'))
			}
		},
		{
			//工作流列表页
			code: "customWorkflow",
			path: "/custom/workflow",
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/custom/Flow/FlowList').default);
				}, 'customWorkflow'))
			}
		},
		// {
        //     //工作待办项
        //     code: "customWorkItem",
        //     path: "/customWorkItem",
        //     component: (location, cb) => {
        //         wrapper(require.ensure([], require => {
        //             cb(null, require('pages/custom/List/myworkitem').default);
        //         }, 'customWorkItem'))
        //     }
        // },
		{
			code: 'form',
			path: '/form',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/demo/customForm').default);
				}, 'form'))
			}
		},
		{
			code: 'dynamicform',
			path: '/dynamicform/:entityid',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/demo/customDynamicForm').default);
				}, 'dynamicform'))
			}
		},
		{
			code: 'customlist',
			path: 'bjyh/customlist/:entityid/:iid',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/custom/List/bjyhEntityList').default);
				}, 'customlist'))
			}
		},
		 {
			//漏洞修复
		 	code: 'ldxflist',
		 	path: 'bjyh/ldxflist/:entityid/:iid',
		 	component: (location, cb) => {
		 		wrapper(require.ensure([], require => {
		 			cb(null, require('pages/bjyh/dynamic/ldxf/customList').default);
		 		}, 'ldxflist'))
		 	}
		 },
		{
			code: 'report',
			path: 'bjyh/report',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/custom/Reports/InnerReport').default);
				}, 'report'))
			}
		},
		{
			// 实用工具
			code: 'usualTools',
			path: '/bjyh/usualTools',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/Tools/usualTools').default);
				}, 'usualTools'))
			}
		},
		{//项目延期
			code: 'projectDelayed',
			path: 'bjyh/projectDelayed',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/dynamic/project/projectDelayed').default);
				}, 'projectDelayed'))
			}
		},
		{
			//报表看板
			code: 'reportboard',
			path: 'bjyh/reportboard',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/ReportBoard/index').default);
				}, 'reportboard'))
			}
		},
		// {
		// 	//架构评审列表
		// 	code: 'jgpscustomlist',
		// 	path: 'bjyh/jgpscustomlist/:entityid/:iid',
		// 	component: (location, cb) => {
		// 		wrapper(require.ensure([], require => {
		// 			cb(null, require('pages/bjyh/dynamic/jgps/jgpsList').default);
		// 		}, 'jgpscustomlist'))
		// 	}
		// },
		// {
		// 	//架构评审查询列表-lmm
		// 	code: 'jgpscxcustomlist',
		// 	path: 'bjyh/jgpscxcustomlist/:entityid/:iid',
		// 	component: (location, cb) => {
		// 		wrapper(require.ensure([], require => {
		// 			cb(null, require('pages/bjyh/dynamic/jgps/jgpscxList').default);
		// 		}, 'jgpscxcustomlist'))
		// 	}
		// },
		{
			//項目風險列表
			code: 'xmfxcustomlist',
			path: 'bjyh/xmfxcustomlist/:entityid/:iid',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/dynamic/xmfx/xmfxList').default);
				}, 'xmfxcustomlist'))
			}
		},
		{
			//需求用例列表
			code: 'ylcx',
			path: 'bjyh/ylcxlist',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/dynamic/ylcx/ProjectCaseList').default);
				}, 'ylcxlist'))
			}
		},
		{
			//上帝模式
			code: 'godMode',
			path: 'bjyh/godMode',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/dynamic/GodMode/godMode').default);
				}, 'godMode'))
			}
		},
		{
			// 有assessid的评审
			code: "customFlowHandlerAssessid",
			path: "/bjyh/flowHandler/:taskId/:assessid",
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/WorkFlow/CustomFlowHandler').default);
				}, 'customFlowHandlerAssessid'))
			}
		},
		{
			// 无assessid的评审
			code: "customFlowHandler",
			path: "/bjyh/flowHandler/:taskId",
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/WorkFlow/CustomFlowHandler').default);
				}, 'customFlowHandler'))
			}
		},
		{
			//项目总览
			code: "projectOverview",
			path: "/bjyh/projectOverview",
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/dynamic/projectOverview/index').default);
				}, 'projectOverview'));
			}
		},
		{
			//专项分析
			code: "Analysisview",
			path: "/bjyh/Analysisview",
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/dynamic/Analysisview/index').default);
				}, 'Analysisview'));
			}
		},
		{
			//业务视图
			code: "businessview",
			path: "/bjyh/businessview",
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/dynamic/businessview/businessview').default);
				}, 'businessview'))
			}
		},
		{
			code: 'wbxxList',
			path: 'bjyh/wbxxList/:entityid/:iid',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/dynamic/wbxx/wbxxList').default);
				}, 'wbxxList'))
			}
		},
		// TODO 项目子风险
		{
			code: 'xmfxList',
			path: 'bjyh/xmfxList/:entityid/:iid',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/bjyh/dynamic/xmfx/xmfxList').default);
				}, 'xmfxList'))
			}
		},
	]);

	function wrapper(loadComponent) {
		let React = null;
		let Component = null;
		let Wrapped = props => (
			<div className="namespace">
				<Component {...props} />
			</div>
		);
		return async () => {
			React = require('react');
			Component = await loadComponent();
			return Wrapped;
		};
	}
}()



