webpackJsonp([32],{1046:function(e,t,a){"use strict";function s(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(363),n=s(l),i=a(802),c=s(i),d=a(155),o=s(d),r=a(785),p=s(r),u=a(688),m=s(u),f=a(54),y=s(f),h=a(55),g=s(h),v=a(59),V=s(v),E=a(93),k=s(E),C=a(8),N=s(C),D=a(4);a(1047);var w=function(e){function t(e){(0,y["default"])(this,t);var a=(0,V["default"])(this,(t.__proto__||(0,m["default"])(t)).call(this,e));return a.systemRole=function(){var e=a;(0,D.vpQuery)("/{vpplat}/api/pur/point",{saccesskey:"system"}).then(function(t){var a=!0;t.data.system>0&&(a=!1),e.setState({disabled:a})})},a.getDataServer=function(){(0,D.vpAdd)("/{vpplat}/vfm/cfgDictionary/getDictionaryDataTree",{}).then(function(e){a.setState({gData:e.data,treeKey:a.treeKey++})})},a.onDragEnter=function(e){},a.onDrop=function(e){},a.onBeforeDrop=function(e){return new p["default"](function(e,t){setTimeout(function(){return e(!1)},1e3)})},a.onDragOver=function(e){},a.titleNode=function(e){var t;return N["default"].createElement("div",{className:"tree-node pr",style:{marginLeft:-10}},N["default"].createElement("div",{onClick:function(){return a.nodeclick(e)}},N["default"].createElement(D.VpIcon,{className:"tree-icon treeIconColor",type:"file-text"}),e.name),N["default"].createElement("div",{className:"tree-options"},N["default"].createElement("div",null,a.state.disabled?null:0==e.pid?N["default"].createElement(D.VpTooltip,{title:"新建"},N["default"].createElement(D.VpIconFont,(t={className:"tree-icon",onClick:function(){return a.nodeAddModel(!0,e)}},(0,o["default"])(t,"className","cursor m-lr-xs text-success"),(0,o["default"])(t,"type","vpicon-plus-circle"),t))):null)))},a.nodeclick=function(e){var t=a;if(t.state.saveType.iid=e.tid,t.state.saveType.type=e.itype,0==e.pid){t.state.saveType.ispoint="1",t.setState({firstDiv:"block",secondDiv:"none",saveType:t.state.saveType});var s={iid:e.tid};(0,D.vpAdd)("/{vpplat}/cfgdictionary/get",{sparam:(0,c["default"])(s)}).then(function(e){if(e.data.success){var a=[];if(e.data.childdata.length>0&&e.data.childdata.map(function(e,t){e.key=e.iid,a.push(e)}),t.setState({itemFirstLists:a}),e.data.childdata.length<1){var s=[{iid:"",key:"this.fristDivKeys--",sname:"",ssequencekey:"",scode:"",sdescription:""}];t.setState({itemFirstLists:s})}}else(0,D.VpAlertMsg)({message:"消息提示",description:"数据异常，请联系管理员",type:"error",showIcon:!0})})}else{t.state.saveType.ispoint="0",t.state.saveType.type="1",t.setState({firstDiv:"none",secondDiv:"block",saveType:t.state.saveType});var s={idictionaryid:e.tid};(0,D.vpAdd)("/{vpplat}/cfgdictionary/getSub",{sparam:(0,c["default"])(s)}).then(function(e){if(e.data.success){var s=[];if(e.data.subdata.length>0&&e.data.subdata.map(function(e,t){e.key=e.iid,s.push(e)}),t.setState({itemSecondLists:e.data.subdata}),e.data.subdata.length<1){var l=[{iid:"",sname:"",ssequencekey:"",key:a.secondDivKeys--,scode:"",sdescription:"",iflag:0}];t.setState({itemSecondLists:l})}}else(0,D.VpAlertMsg)({message:"消息提示",description:"数据异常，请联系管理员",type:"error",showIcon:!0})})}},a.addNewFirstModalDataDiv=function(){var e=a.state.firstModalData.osub;e.push({iid:"",key:a.fristModelKey--,ivalue:"",stext:"",ssequencekey:"",sdescription:"",idefaultvalue:0,iflag:0}),a.state.firstModalData.osub=e,a.setState({firstModalData:a.state.firstModalData})},a.deleteRowFirstModelDiv=function(e){a.state.firstModalData.osub.map(function(t,s){t.iid==e&&a.state.firstModalData.osub.splice(s,1)});a.setState({firstModalData:a.state.firstModalData})},a.addNewFirstDiv=function(){a.setState({itemFirstLists:[].concat((0,n["default"])(a.state.itemFirstLists),[{iid:"",key:a.fristDivKeys--,sname:"",ssequencekey:"",scode:"",sdescription:""}])})},a.deleteRowFirstDiv=function(e){a.state.itemFirstLists.map(function(t,s){t.iid==e&&a.state.itemFirstLists.splice(s,1)}),a.setState({itemFirstLists:a.state.itemFirstLists})},a.addNewSecondtDiv=function(){a.setState({itemSecondLists:[].concat((0,n["default"])(a.state.itemSecondLists),[{iid:"",sname:"",ssequencekey:"",key:a.secondDivKeys--,scode:"",sdescription:""}])})},a.deleteRowSecondDiv=function(e){a.state.itemSecondLists.map(function(t,s){t.iid==e&&a.state.itemSecondLists.splice(s,1)}),a.setState({itemSecondLists:a.state.itemSecondLists})},a.handleInputChange=function(e){var t=e.target.value,s=$(e.target).attr("data-idx"),l=$(e.target).attr("data-key"),n={};n="1"==a.state.saveType.ispoint?a.state.itemFirstLists.find(function(e){return e.key==s}):a.state.itemSecondLists.find(function(e){return e.key==s}),n[l]=t,a.state.itemFirstLists.map(function(e,t){}),a.setState({itemFirstLists:a.state.itemFirstLists,itemSecondLists:a.state.itemSecondLists})},a.handleSwitchChange=function(e,t,s){var l=a.state.saveType,n=a.state.itemSecondLists;n="1"==l.ispoint?a.state.itemFirstLists:a.state.itemSecondLists;var i=-1;n.map(function(t,a){t.iid==e&&(i=a)}),n[i][s]=t?0:1,a.setState({itemSecondLists:a.state.itemSecondLists})},a.saveeditlist=function(){var e=a.state.saveType,t=e.ispoint;if(""==t)return void(0,D.VpAlertMsg)({message:"消息提示",description:"请先选择功能树节点！",type:"warning",showIcon:!0},3);if("1"==t){var s=!0;if(a.state.itemFirstLists.map(function(e,t){null!=e.sname&&""!=e.sname||(s=!1)}),!s)return void(0,D.VpAlertMsg)({message:"消息提示",description:"分组名称不能为空",type:"warning",showIcon:!0},3);e.osub=a.state.itemFirstLists}else if("0"==t){var l=!0;if(a.state.itemSecondLists.map(function(e,t){isNaN(e.ssequencekey)&&(l=!1)}),!l)return void(0,D.VpAlertMsg)({message:"消息提示",description:"排序码只能数字组成！",type:"warning",showIcon:!0},3);e.osub=a.state.itemSecondLists}e.osub.map(function(t,a){t.iid<0&&(e.osub[a].iid="0")}),(0,D.vpAdd)("/{vpplat}/cfgdictionary/save",{sparam:(0,c["default"])(e)}).then(function(e){e.data.success?(a.setState({treeKey:a.treeKey++}),(0,D.VpAlertMsg)({message:"消息提示",description:e.data.msg,type:"success",showIcon:!0}),"1"==t&&(a.getDataServer(),a.treeRef.setNewData(a.state.gData))):(0,D.VpAlertMsg)({message:"消息提示",description:e.data.msg,type:"error",showIcon:!0})})},a.treeOnclick=function(e,t){},a.nodeAddModel=function(e,t){var s=a;s.state.firstModalData.iparent=t.tid,s.state.firstModalData.osub=[],a.setState({visible:!0,modalTypeFlag:"1",snameShowFlag:!1,surlShowFlag:!1,firstModalData:a.state.firstModalData}),a.modalKey=Math.random()},a.handleOk=function(){var e=a.state.firstModalData;a.setState({snameShowFlag:null==e.sname||""==e.sname,scodeShowFlag:null==e.scode||""==e.scode},function(e){a.state.snameShowFlag||a.state.scodeShowFlag}),null!=e.sname&&""!=e.sname&&null!=e.scode&&""!=e.scode&&(0,D.vpAdd)("/{vpplat}/cfgdictionary/save",{sparam:(0,c["default"])(e)}).then(function(e){e.data.success?((0,D.VpAlertMsg)({message:"消息提示",description:e.data.msg,type:"success",showIcon:!0}),a.getDataServer(),a.treeRef.setNewData(a.state.gData),a.setState({visible:!1})):(0,D.VpAlertMsg)({message:"消息提示",description:rst.msg,type:"error",showIcon:!0})})},a.handleCancel=function(){a.setState({visible:!1})},a.modalHandleInputChange=function(e){var t=a,s=e.target.value,l=$(e.target).attr("data-idx"),n=$(e.target).attr("data-key"),i={};"1"==a.state.modalTypeFlag&&("parent"==l?t.state.firstModalData[n]=s:(i=t.state.firstModalData.osub.find(function(e){return e.key==l}),i[n]=s)),a.setState({firstModalData:a.state.firstModalData})},a.modalHandleSwitchChange=function(e,t,s,l){var n={};if("1"==a.state.modalTypeFlag)if(n=a.state.itemFirstLists,l)n=a.state.firstModalData,n[s]=t?0:1;else{n=a.state.firstModalData.osub;var i=-1;n.map(function(t,a){t.key==e&&(i=a)}),n[i][s]=t?"iflag"==s?0:1:"iflag"==s?1:0}a.setState({firstModalData:a.state.firstModalData})},a.VpCheckboxonChange=function(e){"checked"==a.state.value[0]?(a.setState({checked:!1}),a.setState({value:[]})):(a.setState({checked:!0}),a.setState({value:["checked"]}))},a.state={gData:[],loading:!1,visible:!1,itemFirstLists:[{ssequencekey:"",iid:"-1",sname:"",scode:" ",sdescription:" ",Key:0}],itemSecondLists:[{key:-2,ssequencekey:"",iid:"-1",sname:"",iflag:"0",itype:"",ivalue:"",stext:"",sdescription:""}],secondDiv:"none",saveType:{iid:"",type:"",ispoint:"",osub:[]},modalTypeFlag:"",firstModalData:{iid:"",iparent:"",sname:"",scode:"",osub:[{key:0,iid:"",ivalue:"",stext:"",iflag:1,ssequencekey:"",sdescription:"",idefaultvalue:0}]},snameShowFlag:!1,scodeShowFlag:!1,disabled:!0},a.fristDivKeys=-2,a.secondDivKeys=-2,a.fristModelKey=-2,a.treeKey=1,a.modalKey=1,a}return(0,k["default"])(t,e),(0,g["default"])(t,[{key:"componentWillMount",value:function(){this.getDataServer()}},{key:"componentDidMount",value:function(){var e=window.vp.config.isOpenMenu,t=$(document).height(),a=0,s=0;0==e?(a=t-115,s=t-175):(a=t-149,s=t-209),$(".cfgDictionary").find(".scrollBar-div").height(a),$(".cfgDictionary").find(".content").height(s),this.systemRole()}},{key:"componentWillUnmount",value:function(){this.setState=function(e,t){}}},{key:"render",value:function(){var e=this;return N["default"].createElement("div",{className:"full-height cfgDictionary"},N["default"].createElement(D.VpRow,{gutter:10},N["default"].createElement(D.VpCol,{className:"gutter-row",span:4},N["default"].createElement("div",{className:"p-b-sm fw b-b funcpressi bg-white gutter-box"},"  数据字典")),N["default"].createElement(D.VpCol,{className:"gutter-row",span:20},N["default"].createElement("div",{className:"p-b-sm fw b-b funcpressi bg-white gutter-box"},"  数据字典明细（注意：删除后需要点保存数据才生效)"))),N["default"].createElement(D.VpRow,{gutter:10},N["default"].createElement(D.VpCol,{span:4},N["default"].createElement("div",{className:"scrollBar-div"},N["default"].createElement(D.VpTree,{ref:function(t){return e.treeRef=t},draggable:!0,key:this.treeKey,onDragEnter:this.onDragEnter,titleNode:this.titleNode,treeData:this.state.gData,onDrop:this.onDrop,onBeforeDrop:this.onBeforeDrop,onDragOver:this.onDragOver,onSelect:this.treeOnclick}),N["default"].createElement(D.VpModal,{ref:"modal",width:"70%",visible:this.state.visible,title:"新建",onOk:this.handleOk,onCancel:this.handleCancel,okText:"保存",destroyOnClose:!0,wrapClassName:"cfgDictionary",key:this.modalKey},N["default"].createElement("div",{className:"modal-Info-div"},N["default"].createElement(D.VpRow,{gutter:10,className:"modal-Vprow"},N["default"].createElement(D.VpCol,{span:3,className:"p-l-sm"},"分组编号:"),N["default"].createElement(D.VpCol,{span:6,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text","data-key":"sname","data-idx":"parent",onChange:this.modalHandleInputChange}),this.state.snameShowFlag?N["default"].createElement("span",{className:"span-content"},N["default"].createElement(D.VpIcon,{type:"cross-circle",className:""}),"必填"):null),N["default"].createElement(D.VpCol,{span:3,offset:1,className:"p-l-sm"},"分组名称:"),N["default"].createElement(D.VpCol,{span:6,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text","data-key":"scode","data-idx":"parent",onChange:this.modalHandleInputChange}),this.state.scodeShowFlag?N["default"].createElement("span",{className:"span-content"},N["default"].createElement(D.VpIcon,{type:"cross-circle",className:""}),"必填"):null))),N["default"].createElement("div",{className:"b-b p-sm"},N["default"].createElement("h5",{className:"box-title"},"数据字典明细")),N["default"].createElement("div",{className:"modal-div"},N["default"].createElement(D.VpRow,{className:"contentVprow"},N["default"].createElement(D.VpCol,{span:4,className:"p-l-sm"},"选项值"),N["default"].createElement(D.VpCol,{span:4,className:"p-l-sm"},"选项名称"),N["default"].createElement(D.VpCol,{span:4,className:"p-l-sm"},"排序码"),N["default"].createElement(D.VpCol,{span:7,className:"p-l-sm"},"描述"),N["default"].createElement(D.VpCol,{span:2,className:"p-l-sm"},"默认值"),N["default"].createElement(D.VpCol,{span:2,className:"p-l-sm"},"状态")),this.state.firstModalData.osub.map(function(t,a){return N["default"].createElement(D.VpRow,{key:t.key,className:"contentVprow"},N["default"].createElement(D.VpCol,{span:4,className:"p-l-sm"},N["default"].createElement(D.VpTooltip,{title:"删除"},N["default"].createElement(D.VpIconFont,{className:"tree-icon vp-delete minus-circle",onClick:function(){return e.deleteRowFirstModelDiv(t.iid)},type:"vpicon-minus-circle"})),N["default"].createElement(D.VpInput,{type:"text","data-key":"ivalue","data-idx":t.key,onChange:e.modalHandleInputChange})),N["default"].createElement(D.VpCol,{span:4,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text","data-key":"stext","data-idx":t.key,onChange:e.modalHandleInputChange})),N["default"].createElement(D.VpCol,{span:4,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text","data-key":"ssequencekey","data-idx":t.key,onChange:e.modalHandleInputChange})),N["default"].createElement(D.VpCol,{span:7,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text","data-key":"sdescription","data-idx":t.key,onChange:e.modalHandleInputChange})),N["default"].createElement(D.VpCol,{span:2,className:"p-l-sm"},N["default"].createElement(D.VpCheckbox,{options:[{label:"",value:"checkbox"}],onChange:function(a){return e.modalHandleSwitchChange(t.key,a,"idefaultvalue")}}," */}")),N["default"].createElement(D.VpCol,{span:2,className:"p-l-sm"},N["default"].createElement(D.VpTooltip,{placement:"right",title:1==t.iflag?"是":"否"},N["default"].createElement(D.VpFSwitch,{className:"VpFSwitch",defaultChecked:0==t.iflag,"data-key":"iflag",onChange:function(a){return e.modalHandleSwitchChange(t.key,a,"iflag")}}))))}),N["default"].createElement(D.VpRow,{className:"m-t-sm"},N["default"].createElement("a",{onClick:this.addNewFirstModalDataDiv},N["default"].createElement(D.VpIcon,{type:"plus-circle",className:"m-l-sm m-r-xs"}),"再添加一个")))))),N["default"].createElement(D.VpCol,{span:20},N["default"].createElement("div",{className:"p-b-sm fw b-b funcpressi bg-white content scroll"},N["default"].createElement("div",{className:"p-lg  quotacontent"},N["default"].createElement("div",{className:"scrollBar-div-right",style:{display:this.state.firstDiv}},N["default"].createElement(D.VpRow,{className:"contentVprow"},N["default"].createElement(D.VpCol,{span:6,className:"p-l-sm"},"分组编号"),N["default"].createElement(D.VpCol,{span:6,className:"p-l-sm"},"分组名称"),N["default"].createElement(D.VpCol,{span:6,className:"p-l-sm"},"排序码"),N["default"].createElement(D.VpCol,{span:6,className:"p-l-sm"},"描述")),this.state.itemFirstLists.map(function(t,a){return N["default"].createElement(D.VpRow,{key:t.key,className:"contentVprow"},N["default"].createElement(D.VpCol,{span:6,className:"p-l-sm"},t.iid<0||""==t.iid||3==t.itype?N["default"].createElement(D.VpTooltip,{title:"删除"},N["default"].createElement(D.VpIconFont,{className:"tree-icon vp-delete minus-circle",onClick:function(){return e.deleteRowFirstDiv(t.iid)},type:"vpicon-minus-circle"})):null,N["default"].createElement(D.VpFInput,{type:"text",defaultValue:t.scode,"data-key":"scode","data-idx":t.key,onChange:e.handleInputChange,placeholder:"请输入分组编号"})),N["default"].createElement(D.VpCol,{span:6,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text",defaultValue:t.sname,"data-key":"sname","data-idx":t.key,onChange:e.handleInputChange,placeholder:"请输入分组名称"})),N["default"].createElement(D.VpCol,{span:6,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text",defaultValue:t.ssequencekey,"data-key":"ssequencekey","data-idx":t.key,onChange:e.handleInputChange,placeholder:"请输入排序码"})),N["default"].createElement(D.VpCol,{span:6,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text",defaultValue:t.sdescription,"data-key":"sdescription","data-idx":t.key,onChange:e.handleInputChange,placeholder:"请输入描述"})))}),N["default"].createElement(D.VpRow,{className:"m-t-sm"},N["default"].createElement("a",{onClick:this.addNewFirstDiv},N["default"].createElement(D.VpIcon,{type:"plus-circle",className:"m-l-sm m-r-xs"}),"再添加一个"))),N["default"].createElement("div",{className:"scrollBar-div-right",style:{display:this.state.secondDiv}},N["default"].createElement(D.VpRow,{className:"contentVprow"},N["default"].createElement(D.VpCol,{span:5,className:"p-l-sm"},"字典编码"),N["default"].createElement(D.VpCol,{span:5,className:"p-l-sm"},"字典名称"),N["default"].createElement(D.VpCol,{span:5,className:"p-l-sm"},"排序码"),N["default"].createElement(D.VpCol,{span:7,className:"p-l-sm"},"描述"),N["default"].createElement(D.VpCol,{span:2,className:"p-l-sm"},"状态")),this.state.itemSecondLists.map(function(t,a){return N["default"].createElement(D.VpRow,{key:t.key,className:"contentVprow"},N["default"].createElement(D.VpCol,{span:5,className:"p-l-sm"},t.key<0||0!=t.itype?N["default"].createElement(D.VpTooltip,{title:"删除"},N["default"].createElement(D.VpIconFont,{className:"tree-icon vp-delete minus-circle",onClick:function(){return e.deleteRowSecondDiv(t.iid)},type:"vpicon-minus-circle"})):null,N["default"].createElement(D.VpInput,{type:"text",defaultValue:t.ivalue,"data-key":"ivalue","data-idx":t.key,onChange:e.handleInputChange,placeholder:"请输入选项值"})),N["default"].createElement(D.VpCol,{span:5,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text",defaultValue:t.stext,"data-key":"stext","data-idx":t.key,onChange:e.handleInputChange,placeholder:"请输入选项名称"})),N["default"].createElement(D.VpCol,{span:5,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text",defaultValue:t.ssequencekey,"data-key":"ssequencekey","data-idx":t.key,onChange:e.handleInputChange,placeholder:"请输入排序码"})),N["default"].createElement(D.VpCol,{span:7,className:"p-l-sm"},N["default"].createElement(D.VpInput,{type:"text",defaultValue:t.sdescription,"data-key":"sdescription","data-idx":t.key,onChange:e.handleInputChange,placeholder:"请输入描述"})),N["default"].createElement(D.VpCol,{span:2,className:"p-l-sm"},N["default"].createElement(D.VpTooltip,{placement:"right",title:0==t.iflag?"启用":"禁用"},N["default"].createElement(D.VpFSwitch,{className:"VpFSwitch",defaultChecked:0==t.iflag,"data-key":"iflag",onChange:function(a){return e.handleSwitchChange(t.key,a,"iflag")}}))))}),N["default"].createElement(D.VpRow,{className:"m-t-sm"},this.state.disabled?null:N["default"].createElement("a",{onClick:this.addNewSecondtDiv},N["default"].createElement(D.VpIcon,{type:"plus-circle",className:"m-l-sm m-r-xs"}),"再添加一个"))))),N["default"].createElement(D.VpRow,{className:"footFixedCfg b-t p-sm text-center bg-white"},this.state.disabled?null:N["default"].createElement(D.VpButton,{loading:this.state.loading,onClick:this.saveeditlist,className:"vp-btn-br",type:"primary"},"保存")))))}}]),t}(C.Component);t["default"]=w},1047:function(e,t,a){var s=a(1048);"string"==typeof s&&(s=[[e.id,s,""]]);var l={hmr:!0};l.transform=void 0;a(439)(s,l);s.locals&&(e.exports=s.locals)},1048:function(e,t){}});