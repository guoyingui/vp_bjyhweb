webpackJsonp([26],{1030:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var i=a(363),l=n(i),s=a(802),o=n(s),d=a(395),r=n(d),c=a(688),A=n(c),u=a(54),f=n(u),p=a(55),h=n(p),m=a(59),v=n(m),g=a(93),y=n(g),w=a(8),b=n(w),k=a(4),D=a(652),C=a(1031),E=n(C),x=function(e){function t(e){(0,f["default"])(this,t);var a=(0,v["default"])(this,(t.__proto__||(0,A["default"])(t)).call(this,e));return a.getExpandedRowa=function(e,t){var n=a,i=t;if(e.length){var l=[];e.map(function(e){i.push(e.iid),e.hasOwnProperty("children")&&(l=n.getExpandedRowa(e.children,i),l.map(function(e){-1==i.findIndex(function(t){return e===t})&&i.push(e)}))})}return i},a.state={filters:[],showRightBox:!1,table_headers:[],table_array:[],cur_page:1,page:1,pagination:{},limit:10,sortfield:"",sorttype:"",increaseData:[],formdata:[],entityid:"",iids:"",row_id:"",entityiid:"",visible:!1,modaltitle:"",selectiid:"",entityrole:!1,expandedRowKeys:[],tableHeight:""},a.handleCancel=a.handleCancel.bind(a),a.handleOk=a.handleOk.bind(a),a.tableChange=a.tableChange.bind(a),a.onRowClick=a.onRowClick.bind(a),a.getHeader=a.getHeader.bind(a),a.getData=a.getData.bind(a),a.queryFormData=a.queryFormData.bind(a),a.saveRowData=a.saveRowData.bind(a),a.okModal=a.okModal.bind(a),a.cancelModal=a.cancelModal.bind(a),a.onExpand=a.onExpand.bind(a),a.menuClick=a.menuClick.bind(a),a.handleDropDown=a.handleDropDown.bind(a),a.toolBarClick=a.toolBarClick.bind(a),a}return(0,y["default"])(t,e),(0,h["default"])(t,[{key:"componentWillMount",value:function(){this.getHeader(),this.getData()}},{key:"componentDidMount",value:function(){}},{key:"getHeader",value:function(){var e=this;(0,k.vpAdd)("/{vpplat}/vfm/cost/getTreeHeader",{}).then(function(t){if(t&&t.hasOwnProperty("data")&&(e.setState({loading:!1}),t.data.hasOwnProperty("grid"))){var a=[];if(t.data.grid.hasOwnProperty("fields")){t.data.grid.fields.map(function(e,t){var n=void 0,i=void 0,l=void 0,s=void 0;for(var o in e)"field_label"==o?n=e[o]:"field_name"==o&&(i=e[o]),"fixed"==o&&(s=e[o]),"field_width"==o&&(l=e[o]);n&&i&&("left"==s||"right"==s?a.push({title:n,dataIndex:i,key:i,width:l,fixed:s}):a.push({title:n,dataIndex:i,key:i,fixed:s,width:250}))});var n=b["default"].createElement(k.VpMenu,{onClick:e.menuClick},b["default"].createElement(k.VpMenuItem,{key:"new"},b["default"].createElement("a",null,"新建")),b["default"].createElement(k.VpMenuItem,{key:"delete"},b["default"].createElement("a",null,"删除"))),i={title:"操作",key:"menu",width:90,render:function(t,a){return b["default"].createElement("span",{style:{textAlign:"center"}},b["default"].createElement(k.VpDropdown,{overlay:n,trigger:["click"],getPopupContainer:function(){return document.body}},b["default"].createElement(k.VpIcon,{"data-id":a.iid,className:"cursor",type:"vpicon-navlist",onClick:function(t){return e.handleDropDown(t)}})))}};a.push(i),e.setState({table_headers:a})}}})["catch"](function(e){})}},{key:"getData",value:function(){var e=this;(0,k.vpAdd)("/{vpplat}/vfm/cost/getTreeData",{}).then(function(t){var a=t.data.page,n=function(){return"共"+a.totalRows+"条"},i=vp.computedHeight(a.totalRows,".budgetTable");e.setState({tableHeight:i,table_array:a.resultList,cur_page:a.currentPage,total_rows:a.totalRows,num_perpage:a.numPerPage,pagination:{showTotal:n,pageSize:a.numPerPage,showSizeChanger:!1,showQuickJumper:!1}});var l=e.getExpandedRowa(a.resultList,[]);e.setState({expandedRowKeys:l},function(){})})["catch"](function(e){"function"!=typeof e||e()})}},{key:"tableChange",value:function(e,t,a){var n=this,i="";"descend"===a.order?i="desc":"ascend"===a.order&&(i="asc"),this.setState({cur_page:e.current||this.state.cur_page,sortfield:a.field,sorttype:i,limit:e.pageSize||this.state.limit},function(){n.getData()})}},{key:"okModal",value:function(){this.setState({increaseData:{},visible:!1})}},{key:"cancelModal",value:function(){this.setState({increaseData:{},visible:!1})}},{key:"handleDropDown",value:function(e){e.stopPropagation(),this.setState({selectiid:e.target.dataset.id})}},{key:"handleCancel",value:function(){this.setState({increaseData:{},visible:!1})}},{key:"handleOk",value:function(){}},{key:"saveRowData",value:function(e,t){var a=this;(0,r["default"])(e).forEach(function(t,a){e[t]==undefined?e[t]="":null==e[t]&&(e[t]=0)});var n=a.state.newType;e.newType=n,"new"==n?e.iparentid=a.state.selectiid:e.iid=a.state.selectiid,(0,k.vpAdd)("/{vpplat}/vfm/cost/save",{sparam:(0,o["default"])(e)}).then(function(e){e.data.success?a.setState({visible:!1,increaseData:{}},a.getData()):(0,k.VpAlertMsg)({message:"消息提示",description:e.data.msg,type:"error",closeText:"关闭",showIcon:!0},5)})}},{key:"onRowClick",value:function(e,t){if("false"==e.onclick);else{this.setState({increaseData:{},selectiid:e.iid,visible:!0}),this.queryFormData(e.iid,e.sname,"edit")}}},{key:"queryFormData",value:function(e,t,a){var n=this,i="",l="";"0"==e?(i="新建",l=this.state.selectiid):i="成本科目>"+t,(0,k.vpAdd)("/{vpplat}/vfm/cost/getNewForm",{newType:"costaccount",iid:e,iparentid:l}).then(function(e){n.setState({modaltitle:i,increaseData:e.data.form,newType:a,entityrole:!0,visible:!0})})}},{key:"toolBarClick",value:function(e){var t=this;"new"==e&&this.setState({visible:!0,selectiid:"0",increaseData:{}},function(){t.queryFormData("0","",e)})}},{key:"menuClick",value:function(e,t,a){var n=this,i=e.key;if("new"==i)this.setState({visible:!0,increaseData:{}},function(){n.queryFormData("0","",i)});else if("delete"==i){var l=this;(0,k.vpAdd)("/{vpplat}/vfm/cost/delete",{deleteType:"costaccount",iid:this.state.selectiid}).then(function(e){e.data.success?l.getData():(0,k.VpAlertMsg)({message:"消息提示",description:e.data.msg,type:"error",closeText:"关闭",showIcon:!0},5)})}}},{key:"onExpand",value:function(e,t){if(e)this.setState({expandedRowKeys:[].concat((0,l["default"])(this.state.expandedRowKeys),[t.iid])},function(){});else{var a=this.state.expandedRowKeys.findIndex(function(e){return t.iid===e});this.setState({expandedRowKeys:[].concat((0,l["default"])(this.state.expandedRowKeys.slice(0,a)),(0,l["default"])(this.state.expandedRowKeys.slice(a+1)))},function(){})}}},{key:"render",value:function(){var e=this,t={entityrole:this.state.entityrole};return b["default"].createElement("div",{className:"full-height"},b["default"].createElement("div",{className:"b-b bg-white p-sm"},b["default"].createElement(k.VpRow,{gutter:10},b["default"].createElement(k.VpCol,{className:"gutter-row",span:23},b["default"].createElement("span",null,b["default"].createElement("img",{src:E["default"]}),b["default"].createElement("font",{color:"red"}," 注: 必须设置二级科目"))),b["default"].createElement(k.VpCol,{className:"gutter-row",span:1},b["default"].createElement(k.VpTooltip,{placement:"top",title:"新增"},b["default"].createElement(k.VpButton,{type:"primary",className:"m-r-sm",shape:"circle",icon:"plus",onClick:function(){return e.toolBarClick("new")}}))))),b["default"].createElement("div",{className:"business-wrapper p-t-sm scroll-y",id:"table"},b["default"].createElement("div",{className:" bg-white"},b["default"].createElement(k.VpTable,{className:"budgetTable",onExpand:this.onExpand,expandedRowKeys:this.state.expandedRowKeys,columns:this.state.table_headers,dataSource:this.state.table_array,onChange:this.tableChange,onRowClick:this.onRowClick,pagination:this.state.pagination,expandIconColumnIndex:0,scroll:{y:this.state.tableHeight},resize:!0}))),this.state.visible?b["default"].createElement(k.VpModal,{title:this.state.modaltitle,visible:this.state.visible,onOk:function(){return e.okModal()},onCancel:function(){return e.cancelModal()},width:"70%",footer:null,wrapClassName:"modal-no-footer"},b["default"].createElement(D.VpDynamicForm,{className:"p-sm full-height scroll p-b-xxlg",formData:this.state.increaseData,handleOk:this.saveRowData,handleCancel:this.handleCancel,params:t,okText:"提 交"})):"")}}]),t}(w.Component);t["default"]=x=(0,k.VpFormCreate)(x)},1031:function(e,t){e.exports="data:image/gif;base64,R0lGODlhEAAQAOYAAAAAAP///+zhl+/lovXvwvbwxvbxzffy0Pjz0uzfk+zgluzgmO3hme3hm+3im+3inPHnrfTtwvTtw/bwyenZiejXierai+vcjunajevcj+vbkevclO3gmvDmsvHntuXQeufSfufUgOjWhOfUg+fVg+nXh/LoveTLdeXNd+XNeeXPeeXOeufSgO7fqOTIceTKcuTKc9y7XuLDauLDa+PEbePFbeTHcd/BbuTHcuLIe+HGfeLIf+bPj+jTlNewUdq0V9q3XOHEetCiP9GjQNiwVMqXMcuYM8uZM8uYNM2bN8ybOc2cO8+fPNChPs6ePtGkSNKlTdSKPtSDPtR5PtRyPv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFUALAAAAAAQABAAAAeMgFWCgkZFTE2Fg4qCSkQ4NjQyPkWLgk43KylUVBozMUOLRUEVIyxTUxsuMz+Ug0UtFhQlIiEfJy4ySYpHEQwZF5sLKjA1oK4SEAoJpxwgKC5CikUdBQMCUlINISovSIs6BwQDUVEOJB9AS6E9CBPkDxg5T5VVRTseBggmPFD0rkUAW/kbSLCgwYOKAgEAOw=="}});