webpackJsonp([9],{1546:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=a(852),s=i(o),n=a(54),l=i(n),r=a(55),d=i(r),u=a(59),f=i(u),c=a(93),p=i(c),m=a(8),y=i(m),h=a(4),v=a(1027),k=i(v),w=a(992),g=a(816),b=a(1547),_=i(b);a(1549);var E=function(e){function t(e){(0,l["default"])(this,t);var a=(0,f["default"])(this,(t.__proto__||(0,s["default"])(t)).call(this,e));return a.addNewDom=function(){var e=a.state.record;return a.state.isHistoryTask?y["default"].createElement(_["default"],{activityName:e.activityName,usermode:a.state.usermode,stepkey:e.activityId,staskid:a.state.staskid,piid:e.piId,pdid:e.pdId,iobjectentityid:a.state.flowentityid,iobjectid:a.state.flowiid,entityid:e.iflowentityid,endTime:e.endTime,operrole:a.state.operrole,closeRight:function(){return a.closeRightModal()}}):y["default"].createElement(k["default"],{activityName:a.state.activityName,usermode:a.state.usermode,stepkey:e.activityId,staskid:a.state.staskid,piid:e.piId,pdid:e.pdId,iobjectentityid:a.state.flowentityid,iobjectid:a.state.flowiid,entityid:e.iflowentityid,endTime:e.endTime,assessid:a.props.assessid,operrole:a.state.operrole,closeRight:function(){return a.closeRightModal()}})},a.closeRightModal=function(){window.location.replace("")},a.closeRightBox=function(){window.location.replace("")},a.state={isHistoryTask:!1,show:!0},a}return(0,p["default"])(t,e),(0,d["default"])(t,[{key:"componentDidMount",value:function(){this.loadTaskInfo(this.props.taskId,this.props.assessid)}},{key:"componentWillReceiveProps",value:function(e,t){e.taskId!=this.props.taskId&&this.loadTaskInfo(e.taskId,this.props.assessid)}},{key:"loadTaskInfo",value:function(e,t){var a=this;(0,h.vpQuery)("/{vpflow}/rest/process/task-info_assess",{taskId:e,assessid:t}).then(function(t){if(t.data==undefined)a.loadHistoryTaskInfo(e,t.msg);else{var i=t.data;a.setTaskData(i,!1)}})}},{key:"loadHistoryTaskInfo",value:function(e,t){var a=this,i=this;(0,h.vpQuery)("/{vpflow}/foticflow/entity/history-task-info",{taskId:e}).then(function(e){if(e.data==undefined)return void(0,h.VpAlertMsg)({message:"消息提示",description:e.msg||t,type:"error",onClose:a.onClose,closeText:"关闭",showIcon:!0},5);var o=e.data;i.setTaskData(o,!0)})}},{key:"setTaskData",value:function(e,t){this.setState({showRightBox:!0,record:e.record,staskid:e.taskId,operrole:e.operrole,flowiid:e.objectId,usermode:!0,flowentityid:e.entityId,activityName:e.activityName,isHistoryTask:t})}},{key:"render",value:function(){return this.state.record?y["default"].createElement("div",null,y["default"].createElement(g.RightBox,{className:"custom-flow-handler-right-box-max",max:!0,button:y["default"].createElement("div",{className:"icon p-xs",onClick:this.closeRightBox},y["default"].createElement(h.VpTooltip,{placement:"top",title:""},y["default"].createElement(h.VpIcon,{type:"right"}))),tips:y["default"].createElement("div",{className:"tips p-xs"},y["default"].createElement(h.VpTooltip,{placement:"top",title:"0000"},y["default"].createElement(h.VpIcon,{type:"exclamation-circle text-muted m-r-xs"}))),show:this.state.showRightBox},this.state.showRightBox?this.addNewDom():null)):null}}]),t}(m.Component);t["default"]=(0,w.menuEntryWrap)(E)},1547:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){return{}}function s(e,t){return{}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(14),l=i(n),r=a(852),d=i(r),u=a(54),f=i(u),c=a(55),p=i(c),m=a(59),y=i(m),h=a(93),v=i(h),k=a(8),w=i(k),g=a(4),b=a(875),_=a(1548),E=i(_),T=a(1028),I=i(T),x=a(1031),N=i(x),j=function(e){function t(e){(0,f["default"])(this,t);var a=(0,y["default"])(this,(t.__proto__||(0,d["default"])(t)).call(this,e));return a.state={flowtabs_array:[],spinning:!1},a}return(0,v["default"])(t,e),(0,p["default"])(t,[{key:"componentWillMount",value:function(){this.loadFormData()}},{key:"componentWillReceiveProps",value:function(e,t){}},{key:"loadFormData",value:function(){var e=this.props,t=e.entityid,a=e.iobjectentityid,i=e.iobjectid,o=e.piid,s=e.staskid,n=e.stepkey,l=this;(0,g.vpQuery)("/{vpflow}/cust/flowentity/getform",{entityid:t,iobjectentityid:a,iobjectid:i,piid:o,staskid:s,stepkey:n,isHistory:!0}).then(function(e){var t=e.data.formurl,a=e.data.flowtabs_array,i=e.data;l.setState({formData:i,flowtabs_array:a,ijump:"0"==i.ijump,formurl:t})})}},{key:"_renderFlowForm",value:function(){var e=(0,l["default"])({},this.props,{formData:this.state.formData});return w["default"].createElement("div",{className:"form-edit-table full-height bg-white scroll-y"},this.renderFlowForm(e))}},{key:"renderFlowForm",value:function(e){var t=E["default"];return w["default"].createElement(t,e)}},{key:"render",value:function(){var e=this;this.props.form.getFieldProps;return 0==this.state.flowtabs_array.length?w["default"].createElement("div",null):w["default"].createElement(g.VpSpin,{spinning:this.state.spinning,size:"large"},w["default"].createElement("div",{className:"flowtabs workflow full-height"},w["default"].createElement(g.VpTabs,{defaultActiveKey:"0",onChange:this.tabsChange},this.state.flowtabs_array.map(function(t,a){return"flow_step"==t.skey?w["default"].createElement(g.VpTabPane,{tab:e.props.activityName||t.sname,key:a},e._renderFlowForm()):"flow_diagram"==t.skey?w["default"].createElement(g.VpTabPane,{tab:t.sname,key:a},w["default"].createElement("div",{style:{height:"100%"}},w["default"].createElement(I["default"],{pdid:e.props.pdid,piid:e.props.piid}))):"flow_log"==t.skey?w["default"].createElement(g.VpTabPane,{tab:t.sname,key:a},w["default"].createElement("div",{className:"full-height bg-white scroll-y"},w["default"].createElement(N["default"],{piid:e.props.piid}))):"flow_approvallog"==t.skey?w["default"].createElement(g.VpTabPane,{tab:t.sname,key:a},w["default"].createElement("div",{className:"full-height bg-white scroll-y"})):w["default"].createElement(g.VpTabPane,{tab:"没有配置",key:a})}))))}}]),t}(k.Component);t["default"]=function C(e){var t=(0,g.VpFormCreate)((0,b.connect)(o,s)(e));return t.Component=e,t.createClass=C,t}(j)},1548:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=a(852),s=i(o),n=a(54),l=i(n),r=a(55),d=i(r),u=a(59),f=i(u),c=a(93),p=i(c),m=a(8),y=(i(m),a(983)),h=i(y),v=(a(4),function(e){function t(){return(0,l["default"])(this,t),(0,f["default"])(this,(t.__proto__||(0,s["default"])(t)).apply(this,arguments))}return(0,p["default"])(t,e),(0,d["default"])(t,[{key:"getCustomeButtons",value:function(){return[]}}]),t}(h["default"].Component));t["default"]=h["default"].createClass(v)},1549:function(e,t,a){var i=a(1550);"string"==typeof i&&(i=[[e.id,i,""]]);var o={hmr:!0};o.transform=void 0;a(439)(i,o);i.locals&&(e.exports=i.locals)},1550:function(e,t){}});