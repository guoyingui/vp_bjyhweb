import React from 'react';
import ReactDOM from 'react-dom';
import { Router,hashHistory, Route,IndexRoute } from 'react-router';
import { createStore} from 'redux';
import { Provider, connect } from 'react-redux';
import  {App,NotFind}  from 'vplat';
import reducer from 'reduxs/reducers/reducer';
import {changeLanguage} from 'reduxs/actions/action';
import {
	VpLocaleProvider,
	VpIframeRouter
} from 'vpreact';
import enUS from 'antd/lib/locale-provider/en_US';
import "./routes";

import './index.less';

if(vp.config.URL.console && !vp.config.URL.devflag){
	// 全局js异常捕获
	window.onerror = function (msg, url, l) {
		console.log(msg, url, l);
		// VpMsgError("该页面服务异常!", 3)
		return true
	}
}


//  window.app 路由 父项目
class Blank extends React.Component{
	render(){
		return <div></div>
	}
}
let app = window.vpapp || {};
let routesList = app.routes || [];
routesList.push({code: "iframe", path: "/index", component: VpIframeRouter});
let route = routesList.length > 0 ? routesList.map(item => {
	if(item.path === '/'){
		return  <IndexRoute key={item.code} component={item.component}/>
	}
	if (item.code === "iframe") {
		return  <Route key={item.code} path={item.path} component={item.component}/>
	}
	return  <Route key={item.code} path={item.path} getComponent={item.component}/>
}) : <IndexRoute component={Blank}/> 

const store = createStore(reducer);
class AllRoutes extends React.Component {
	componentWillMount(){
    	window.LOCALE = sessionStorage.getItem('LOCALE') || 'zh';
    }
	render() {
		let href = window.location.href;
		let navfalg = 1,
		noMenuList = []; // 开发模式下不显示菜单的路由String
		for (let index = 0; index < noMenuList.length; index++) {
			if (href.indexOf(noMenuList[index]) != "-1") {
				navfalg = false;
				break;
			}
		}
		return (
			<VpLocaleProvider locale={window.LOCALE =='en'? enUS : null}>

					<Router history={hashHistory}>
						<Route path="/" component={
							process.env.NODE_ENV ? null : 
							navfalg ? App : null
						}>
							{ route }
							<Route path="*" component={NotFind}/>
						</Route>
					</Router>

			</VpLocaleProvider>
		);
	}
}

const mapStateToProps = state => {
	return {
		LOCALE: state.language
	}
}
const mapDispatchToProps = dispatch => {
	return {
	  changeLanguage: lang => {
		dispatch(changeLanguage(lang))
	  }
	}
}
AllRoutes = connect(mapStateToProps,
	mapDispatchToProps)(AllRoutes)

const _body = document.getElementsByTagName("body")[0],
_div = document.createElement("div");
process.env.NODE_ENV == "production" ? _div.className = "pro-app-box" : _div.className = "dev-app-box";
_div.id = entryId;
_body.insertBefore(_div, _body.childNodes[0]);

const render = () => {
	ReactDOM.render(
		<Provider store={store}>
		    <AllRoutes />
	    </Provider>,
	  	document.getElementById(entryId)
	);
};

setTimeout(render, 0);
