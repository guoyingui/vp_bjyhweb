webpackJsonp([4],{875:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var s=a(395),n=i(s),o=a(786),d=i(o),l=a(688),c=i(l),r=a(54),h=i(r),u=a(55),p=i(u),f=a(59),y=i(f),g=a(93),v=i(g),w=a(8),m=i(w),b=a(4),R=a(652),S=a(876),k=i(S),x=function(e){function t(e){(0,h["default"])(this,t);var a=(0,y["default"])(this,(t.__proto__||(0,c["default"])(t)).call(this,e));return a.state={filters:[],showRightBox:!1,table_headers:[],table_array:[],cur_page:1,page:1,pagination:{},limit:10,sortfield:"",sorttype:"",increaseData:[],formdata:[],visible:!1,modaltitle:"",selectiid:"",tableHeight:0},a.handleCancel=a.handleCancel.bind(a),a.handleOk=a.handleOk.bind(a),a.tableChange=a.tableChange.bind(a),a.getHeader=a.getHeader.bind(a),a.getData=a.getData.bind(a),a.saveRowData=a.saveRowData.bind(a),a.okModal=a.okModal.bind(a),a.cancelModal=a.cancelModal.bind(a),a.onExpand=a.onExpand.bind(a),a.onRowClick=a.onRowClick.bind(a),a.closeRightModal=a.closeRightModal.bind(a),a}return(0,v["default"])(t,e),(0,p["default"])(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({entityid:this.props.entityid,iid:this.props.iid},function(){e.getHeader(),e.getData()})}},{key:"componentDidMount",value:function(){var e=vp.computedHeight(this.state.table_array.length,".pjcost",195);this.setState({tableHeight:e})}},{key:"getHeader",value:function(){var e=this,t={listType:"pjcost",entityid:this.state.entityid};(0,b.vpAdd)("/{vpmprovider}/vpm/cost/getListHeader",{sparam:(0,d["default"])(t)}).then(function(t){if(t&&t.hasOwnProperty("data")&&(e.setState({loading:!1}),t.data.hasOwnProperty("grid"))){var a=[];t.data.grid.hasOwnProperty("fields")&&(t.data.grid.fields.map(function(e,t){var i=void 0,s=void 0,n=void 0,o=void 0;for(var d in e)"field_label"==d?i=e[d]:"field_name"==d&&(s=e[d]),"fixed"==d&&(o=e[d]),"field_width"==d&&(n=e[d]);i&&s&&("left"==o||"right"==o?a.push({title:i,dataIndex:s,key:s,width:n,fixed:o}):a.push({title:i,dataIndex:s,key:s,fixed:o}))}),e.setState({table_headers:a}))}})["catch"](function(e){})}},{key:"getData",value:function(){var e=this,t={listType:"pjcost",currentPage:this.state.cur_page,pageSize:this.state.limit,entityid:this.state.entityid};(0,b.vpAdd)("/{vpmprovider}/vpm/cost/getListData",{sparam:(0,d["default"])(t)}).then(function(t){var a=t.data,i=function(){return"共"+a.totalRows+"条"},s=0;s=vp.computedHeight(a.totalRows,".pjcost",195),e.setState({tableHeight:s,table_array:a.resultList,cur_page:a.currentPage,total_rows:a.totalRows,num_perpage:a.numPerPage,pagination:{total:a.totalRows,showTotal:i,pageSize:a.numPerPage,onShowSizeChange:e.onShowSizeChange,showSizeChanger:!0,showQuickJumper:!0}})})["catch"](function(e){"function"!=typeof e||e()})}},{key:"onShowSizeChange",value:function(e){}},{key:"tableChange",value:function(e,t,a){var i=this,s="";"descend"===a.order?s="desc":"ascend"===a.order&&(s="asc"),this.setState({cur_page:e.current||this.state.cur_page,sortfield:a.field,sorttype:s,limit:e.pageSize||this.state.limit},function(){i.getData()})}},{key:"okModal",value:function(){this.setState({visible:!1})}},{key:"cancelModal",value:function(){this.setState({visible:!1})}},{key:"handleCancel",value:function(){this.setState({visible:!1})}},{key:"handleOk",value:function(){this.saveRowData(this.props.form.getFieldsValue())}},{key:"saveRowData",value:function(e){var t=this;(0,n["default"])(e).forEach(function(t,a){e[t]==undefined?e[t]="":null==e[t]&&(e[t]=0)}),e.iid=this.state.selectiid;var a=!0;""==e.dstartday?(a=!1,(0,b.VpAlertMsg)({message:"消息提示",description:"请选择开始日期！",type:"error",closeText:"关闭",showIcon:!0},5)):""==e.dendday?(a=!1,(0,b.VpAlertMsg)({message:"消息提示",description:"请选择结束日期！",type:"error",closeText:"关闭",showIcon:!0},5)):""==e.fhourrate&&(a=!1,(0,b.VpAlertMsg)({message:"消息提示",description:"请选择填写正常工时费率！",type:"error",closeText:"关闭",showIcon:!0},5)),e.dstartday>e.dendday&&(a=!1,(0,b.VpAlertMsg)({message:"消息提示",description:"开始时间必须早于或等于结束时间！",type:"error",closeText:"关闭",showIcon:!0},5)),e.newType="pjcost",e.dstartday=new Date(e.dstartday).Format("yyyy-MM-dd"),e.dendday=new Date(e.dendday).Format("yyyy-MM-dd"),a&&(0,b.vpAdd)("/{vpmprovider}/vpm/cost/save",{sparam:(0,d["default"])(e)}).then(function(e){e.data.success?t.setState({visible:!1,increaseData:{}},t.getData()):(0,b.VpAlertMsg)({message:"消息提示",description:e.data.msg,type:"error",closeText:"关闭",showIcon:!0},5)})}},{key:"onRowClick",value:function(e){this.setState({showRightBox:!0,iid:e.iid,rightTitle:"项目类型 > "+e.sname}),this.loadRightWindow()}},{key:"onExpand",value:function(e,t){}},{key:"loadRightWindow",value:function(){return m["default"].createElement(b.VpTabs,{defaultActiveKey:"0",onChange:this.tabsChange},m["default"].createElement(b.VpTabPane,{tab:this.state.rightTitle,key:"0"},m["default"].createElement(k["default"],{disabled:this.props.disabled,iid:this.state.iid})))}},{key:"closeRightModal",value:function(){this.setState({showRightBox:!1})}},{key:"render",value:function(){return m["default"].createElement("div",{className:"overflow"},m["default"].createElement("div",{className:"bg-white p-lr-sm full-height scroll-y"},m["default"].createElement("div",{className:"bg-white"},m["default"].createElement(b.VpTable,{className:"pjcost",onExpand:this.onExpand,columns:this.state.table_headers,dataSource:this.state.table_array,onChange:this.tableChange,onRowClick:this.onRowClick,pagination:this.state.pagination,scroll:{y:this.state.tableHeight},resize:!0}))),m["default"].createElement(R.RightBox,{max:this.state.max,button:m["default"].createElement("div",{className:"icon p-xs",onClick:this.closeRightModal},m["default"].createElement(b.VpTooltip,{placement:"top",title:""},m["default"].createElement(b.VpIcon,{type:"right"}))),show:this.state.showRightBox},this.state.showRightBox?this.loadRightWindow():null))}}]),t}(w.Component);t["default"]=x=(0,b.VpFormCreate)(x)},876:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var s=a(363),n=i(s),o=a(786),d=i(o),l=a(688),c=i(l),r=a(54),h=i(r),u=a(55),p=i(u),f=a(59),y=i(f),g=a(93),v=i(g),w=a(8),m=i(w),b=a(4),R=function(e){function t(e){(0,h["default"])(this,t);var a=(0,y["default"])(this,(t.__proto__||(0,c["default"])(t)).call(this,e));return a.state={filters:[],showRightBox:!1,table_headers:[],table_array:[],cur_page:1,page:1,pagination:{},limit:10,sortfield:"",sorttype:"",increaseData:[],formdata:[],entityid:"",iids:"",row_id:"",entityiid:"",entityrole:!1,selectItem:[],selectedRowKeys:[],expandedRowKeys:[]},a.tableChange=a.tableChange.bind(a),a.getHeader=a.getHeader.bind(a),a.getData=a.getData.bind(a),a.onExpand=a.onExpand.bind(a),a.toolBarClick=a.toolBarClick.bind(a),a.onRowClick=a.onRowClick.bind(a),a.handleSelect=a.handleSelect.bind(a),a.handleSelectAll=a.handleSelectAll.bind(a),a.onSelectChange=a.onSelectChange.bind(a),a}return(0,v["default"])(t,e),(0,p["default"])(t,[{key:"componentWillReceiveProps",value:function(e){var t=this;e.entityid==this.state.entityid&&e.iid==this.state.iid||this.setState({entityid:e.entityid,iid:e.iid},function(){t.getHeader(),t.getData()})}},{key:"componentWillMount",value:function(){var e=this;this.setState({entityid:this.props.entityid,iid:this.props.iid},function(){e.getHeader(),e.getData()})}},{key:"componentDidMount",value:function(){}},{key:"getHeader",value:function(){var e=this,t={listType:"pjcost",classid:this.state.iid};(0,b.vpAdd)("/{vpmprovider}/vpm/cost/getTreeHeader",{sparam:(0,d["default"])(t)}).then(function(t){if(t&&t.hasOwnProperty("data")&&(e.setState({loading:!1}),t.data.hasOwnProperty("grid"))){var a=[];if(t.data.grid.hasOwnProperty("fields")){t.data.grid.fields.map(function(e,t){var i=void 0,s=void 0,n=void 0,o=void 0;for(var d in e)"field_label"==d?i=e[d]:"field_name"==d&&(s=e[d]),"fixed"==d&&(o=e[d]),"field_width"==d&&(n=e[d]);i&&s&&("left"==o||"right"==o?a.push({title:i,dataIndex:s,key:s,width:n,fixed:o}):a.push({title:i,dataIndex:s,key:s,fixed:o}))});var i=[];a.filter(function(e){return"sname"==e.dataIndex}).map(function(e){e.width=280,i.push(e)}),a.map(function(e,t){"sname"!=e.dataIndex&&i.push(e)}),e.setState({table_headers:i})}}})["catch"](function(e){})}},{key:"getData",value:function(){var e=this,t={listType:"pjcost",classid:this.state.iid};(0,b.vpAdd)("/{vpmprovider}/vpm/cost/getTreeData",{sparam:(0,d["default"])(t)}).then(function(t){var a=t.data.page,i=t.data.list,s=function(){return"共"+a.totalRows+"条"};e.setState({table_array:a.resultList,cur_page:a.currentPage,total_rows:a.totalRows,num_perpage:a.numPerPage,pagination:{showTotal:s,pageSize:a.numPerPage,showSizeChanger:!1,showQuickJumper:!1}});var n=[],o=[];i.map(function(e,t){"true"==e.ischecked&&o.push(e.iid),n.push(e.iid)}),e.setState({selectedRowKeys:o,expandedRowKeys:n})})["catch"](function(e){"function"!=typeof e||e()})}},{key:"tableChange",value:function(e,t,a){var i=this,s="";"descend"===a.order?s="desc":"ascend"===a.order&&(s="asc"),this.setState({cur_page:e.current||this.state.cur_page,sortfield:a.field,sorttype:s,limit:e.pageSize||this.state.limit},function(){i.getData()})}},{key:"onRowClick",value:function(e){var t=this,a=this.state.selectedRowKeys.findIndex(function(t){return e.iid===t}),i=!0;-1!=a&&(i=!1),i?this.setState({selectedRowKeys:[].concat((0,n["default"])(this.state.selectedRowKeys),[e.iid])},function(){e.pid>0&&t.cascadeSelectParent(e.pid),e.hasOwnProperty("children")&&t.cascadeSelect(e,i)}):this.setState({selectedRowKeys:[].concat((0,n["default"])(this.state.selectedRowKeys.slice(0,a)),(0,n["default"])(this.state.selectedRowKeys.slice(a+1)))},function(){e.hasOwnProperty("children")&&t.cascadeSelect(e,i)})}},{key:"handleSelect",value:function(e,t){var a=this,i=0;t?this.setState({selectedRowKeys:[].concat((0,n["default"])(this.state.selectedRowKeys),[e.iid])},function(){e.pid>0&&a.cascadeSelectParent(e.pid),e.hasOwnProperty("children")&&a.cascadeSelect(e,t)}):(this.state.selectedRowKeys.forEach(function(t,a){t===e.iid&&(i=a)}),this.setState({selectedRowKeys:[].concat((0,n["default"])(this.state.selectedRowKeys.slice(0,i)),(0,n["default"])(this.state.selectedRowKeys.slice(i+1)))},function(){e.hasOwnProperty("children")&&a.cascadeSelect(e,t)}))}},{key:"cascadeSelectParent",value:function(e){-1==this.state.selectedRowKeys.findIndex(function(t){return e===t})&&this.setState({selectedRowKeys:[].concat((0,n["default"])(this.state.selectedRowKeys),[e])})}},{key:"cascadeSelect",value:function(e,t){var a=this,i=0,s=[];if(e.hasOwnProperty("children")&&e.children.forEach(function(e,n){i=a.state.selectedRowKeys.findIndex(function(t){return e.iid===t}),t?-1==i&&s.push(e.iid):-1!=i&&s.push(e.iid)}),t)this.setState({selectedRowKeys:[].concat((0,n["default"])(this.state.selectedRowKeys),s)},function(){});else{var o=[];this.state.selectedRowKeys.forEach(function(e,t){-1==(i=s.findIndex(function(t){return e===t}))&&o.push(e)}),this.setState({selectedRowKeys:o},function(){})}}},{key:"onSelectChange",value:function(e){this.setState({selectedRowKeys:e})}},{key:"handleSelectAll",value:function(e,t,a){this.setState({selectItem:t})}},{key:"toolBarClick",value:function(e){if("save"==e){var t={newType:"pjcost",classid:this.state.iid,ids:this.state.selectedRowKeys};(0,b.vpAdd)("/{vpmprovider}/vpm/cost/save",{sparam:(0,d["default"])(t)}).then(function(e){e.data.success?(0,b.VpAlertMsg)({message:"消息提示",description:"保存成功！",type:"success",closeText:"关闭",showIcon:!0},5):(0,b.VpAlertMsg)({message:"消息提示",description:e.data.msg,type:"error",closeText:"关闭",showIcon:!0},5)})}}},{key:"onExpand",value:function(e,t){if(e)this.setState({expandedRowKeys:[].concat((0,n["default"])(this.state.expandedRowKeys),[t.iid])},function(){});else{var a=this.state.expandedRowKeys.findIndex(function(e){return t.iid===e});this.setState({expandedRowKeys:[].concat((0,n["default"])(this.state.expandedRowKeys.slice(0,a)),(0,n["default"])(this.state.expandedRowKeys.slice(a+1)))},function(){})}}},{key:"render",value:function(){var e=this,t=this.state.selectedRowKeys,a={type:"checkbox",selectedRowKeys:t,onSelect:this.handleSelect,onSelectAll:this.handleSelectAll,onChange:this.onSelectChange};return m["default"].createElement("div",{className:"bg-white scroll full-height p-b-xxlg"},m["default"].createElement("div",{className:"p-sm"},m["default"].createElement(b.VpTable,{onExpand:this.onExpand,columns:this.state.table_headers,dataSource:this.state.table_array,onChange:this.tableChange,onRowClick:this.onRowClick,pagination:this.state.pagination,rowSelection:a,rowKey:function(e){return e.iid},expandedRowKeys:this.state.expandedRowKeys,resize:!0})),m["default"].createElement("div",{className:"footer-button-wrap ant-modal-footer",style:{position:"absolute"}},this.props.disabled?null:m["default"].createElement(b.VpButton,{className:"vp-btn-br",type:"primary",icon:"",onClick:function(){return e.toolBarClick("save")}},"保存")))}}]),t}(w.Component);t["default"]=R=(0,b.VpFormCreate)(R)}});