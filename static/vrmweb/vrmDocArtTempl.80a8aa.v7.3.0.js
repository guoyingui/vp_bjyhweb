webpackJsonp([15],{991:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function n(e){this.entityid=e,this.attrKey="entity"+e+"_attr",this.discussKey="entity"+e+"_discuss",this.summaryKey="entity"+e+"_summary",this.permisions=undefined,"function"!=typeof this.userId&&(n.prototype.userId=function(){return vp.cookie.getTkInfo().userid}),"function"!=typeof this.getPermisions&&(n.prototype.getPermisions=function(e){var t=this,a={};a[this.attrKey]="",a[this.discussKey]="",a[this.summaryKey]="",(0,c.vpQuery)(d.apiPrePointsUrl,{sparam:(0,o["default"])(a)}).then(function(a){a&&"object"==(void 0===a?"undefined":(0,l["default"])(a))&&(t.permisions=a.data,"function"==typeof e&&e(a.data))})}),"function"!=typeof this.isAttWrite&&(n.prototype.isAttWrite=function(){return this.permisions&&(1==this.permisions[this.attrKey]||1==this.permisions[this.summaryKey])}),"function"!=typeof this.isAttRead&&(n.prototype.isAttRead=function(){var e=this.permisions&&(0==this.permisions[this.attrKey]||0==this.permisions[this.summaryKey]);return e|=this.isAttWrite()}),"function"!=typeof this.isDiscussWrite&&(n.prototype.isDiscussWrite=function(){return this.permisions&&(1==this.permisions[this.discussKey]||1==this.permisions[this.summaryKey])}),"function"!=typeof this.isDiscussRead&&(n.prototype.isDiscussRead=function(){return this.permisions&&(0==this.permisions[this.discussKey]||1==this.permisions[this.discussKey])})}Object.defineProperty(t,"__esModule",{value:!0}),t.VrmAuthUtil=undefined;var s=a(60),l=i(s),r=a(796),o=i(r),c=a(4),d=a(784);t.VrmAuthUtil=n},1024:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(14),s=i(n),l=a(796),r=i(l),o=a(687),c=i(o),d=a(54),u=i(d),p=a(55),m=i(p),h=a(59),f=i(h),v=a(93),y=i(v),g=a(8),b=i(g),D=a(4),k=a(652),E=a(828),T=i(E),w=a(804),x=i(w),V=a(784);a(1025);var _=a(813),A=a(836),S=i(A),C=a(786),F=a(991),R=function(e){function t(e){(0,u["default"])(this,t);var a=(0,f["default"])(this,(t.__proto__||(0,c["default"])(t)).call(this,e));return a.closeParseWindow=function(){var e=a,t=e.record,i=e.operate;1==i&&((0,D.VpMsgLoading)("打开文档页面中...",1.5),setTimeout(function(){window.open("../vpword/index.html?busSceneCode=arttpl_edit&docId="+t.idoc_id)},1500)),4==i?((0,D.VpMsgLoading)("打开文档页面中...",1.5),setTimeout(function(){window.open("../vpword/index.html?busSceneCode=arttpl_view&docId="+t.idoc_id)},1500)):2==i?((0,D.VpMsgLoading)("打开复制页面中...",1.5),e.getCopyFormData(),setTimeout(function(){e.setState({copyVisible:!0,currentDocArtTpliid:t.iid})},1500)):3==i&&((0,D.VpMsgLoading)("发布中...",1.5),setTimeout(function(){(0,D.vpEdit)("{vpvrm}/vrm/docArtTempl/releaseDocArtTempl",{sparam:(0,r["default"])(t),entityid:e.state.entityid,iid:t.iid},"",5e9).then(function(t){e.VpTable.getTableData(),C.RestAlertMsg.showSuccess({msg:"发布成功！"})})},1500)),e.VpTable.getTableData()},a.parseDoc=function(e,t){(0,a.refs.parseProgress.startParse)(t.idoc_id)},a.renderHeight=function(e,t){var i=vp.computedHeight(t.length,".docArtTplTable");a.setState({maxHeight:i,spinStatus:!1,res:t.length})},a.getFormData=function(e,t){a.getDynamicTabs(t,e),(0,D.vpQuery)(V.entityFormDataUrl,{entityid:a.state.entityid,iid:e}).then(function(e){var t=e.data.form;a.setState({isAdd:!0,increaseData:t})})},a.onToggle=function(e){a.setState({openKeys:e.open?e.keyPath:e.keyPath.slice(1)})},a.shrinkLeft=function(e){a.setState({shrinkShow:!a.state.shrinkShow})},a.handleClick=function(e){var t="0";e.keyPath.indexOf("filter")>-1&&(t=e.key),a.setState({menuSelectKey:e.key,filtervalue:t,openKeys:e.keyPath.slice(1),currentkey:e.keyPath.slice(1)[0]})},a.handleLike=function(e,t,i){a.stopEvent(e),(0,D.vpAdd)(V.entityHandLikeUrl,{ientityid:t,iid:i}).then(function(e){a.VpTable.getTableData()})},a.discuss=function(e,t){a.stopEvent(e);var i="entity"+a.state.entityid+"_discuss",n=e.target.getAttribute("data");a.record=t,a.setState({iid:t.iid,showRightBox:!0,operType:n,defaultActiveKey:i,rightBox_type:n}),a.getFormData(t.iid,!0)},a.authManage=function(e,t){var i="entity"+a.state.entityid+"_authority";a.record=t,a.setState({iid:t.iid,showRightBox:!0,operType:"edit",defaultActiveKey:i,rightBox_type:"edit"}),a.getFormData(t.iid,!0)},a.handleVisibleChange=function(e,t){a.record=t},a.rowClick=function(e,t){a.record=e;var i="entity"+a.state.entityid+"_attr";a.setState({showRightBox:!0,operType:"edit",rightBox_type:"edit",defaultActiveKey:i,readOrWrite:e&&1==e.istatusvpval?1:0},function(){a.props.setBreadCrumb(e.sname)}),a.getFormData(e.iid,!0)},a.handleModal=function(e,t,i,n){e.preventDefault,a.record=t,i=i||"1",a.setState({showRightBox:!0,operType:n,rightBox_type:n,defaultActiveKey:"0",createType:i,doctplDocId:""}),"add"==n?a.getFormData("",!1):(n="edit")&&a.getFormData(t.iid,!0)},a.getAllDoctplData=function(e){(0,D.vpQuery)("{vpvrm}/vrm/reqDocTpl/listAll",{entityid:137,fparam:(0,r["default"])(a.fparam)}).then(function(e){var t=e.data?e.data:[],i=a.jointDoctplHtml(t,-1);a.setState({doctplListData:t,doctplListDataHtml:i})})},a.doctplChecked=function(e,t,i,n,s){var l=a.jointDoctplHtml(a.state.doctplListData,t),r=a.props.form,o=r.setFieldsValue;r.getFieldValue;o({doctplField:i}),a.setState({doctplCheckedData:t,doctplListDataHtml:l,doctplDocId:n,doctplFilecode:"",doctplFilename:i})},a.jointDoctplHtml=function(e,t){return b["default"].createElement("div",null,b["default"].createElement("div",{className:"docTplClass"},b["default"].createElement("div",{className:0==t?"docTplChecked":"docTplp-sm file-box",onClick:function(e){return a.doctplChecked(e,0,"空白文档",1,0)}},b["default"].createElement("div",{className:"docTplimg text-muted",title:"空白文档"},b["default"].createElement("img",{src:file1,className:"docTplimgSize"})),b["default"].createElement("div",{className:"characterSize"},"空白文档"))),e.map(function(e){return b["default"].createElement("div",{className:"docTplClass"},b["default"].createElement("div",{className:t==e.iid?"docTplChecked":"docTplp-sm file-box",onClick:function(t){return a.doctplChecked(t,e.iid,e.sname,e.idoc_id,e.sfilecode)}},b["default"].createElement("div",{className:"docTplimg text-muted",title:e.sname},b["default"].createElement("img",{src:file2,className:"docTplimgSize"})),b["default"].createElement("div",{className:"characterSize"},e.sname)))}))},a.getCopyFormData=function(e,t){(0,D.vpQuery)(V.entityFormDataUrl,{entityid:a.state.entityid,iid:e,viewcode:"copyform"}).then(function(e){a.setState({copyIncreaseData:e.data.form})})},a.copyDocArtTplEdit=function(){return b["default"].createElement(k.VpDynamicForm,{ref:function(e){return a.dynamic=e},bindThis:a,formData:a.state.copyIncreaseData,form:a.props.form,noFooter:!0})},a.copyDocArtTplHandleOk=function(e){var t=(a.props.form,a);a.props.form.validateFields(function(e,i){e||((0,D.vpAdd)("{vpvrm}/vrm/docArtTempl/copyDocArtTempl",{sparam:(0,r["default"])(i),iid:t.state.currentDocArtTpliid,entityid:t.state.entityid}).then(function(e){t.VpTable.getTableData(),C.RestAlertMsg.showSuccess({msg:"复制成功！"})}),a.setState({copyVisible:!1}))})},a.state={table_headers:[],tabs_array:[],spinStatus:!1,rightBox_type:"",url:"{vpvrm}/vrm/docArtTempl/listPageDocArt",item:"",operType:"",uploadUrl:V.uploadUrl,loading:!1,searchStr:"",increaseData:"",entityid:141,ientityid:41,listData:[],filters:[],statusFilters:[],classFilters:[],shrinkShow:!0,openKeys:["filter"],currentkey:"filter",filtervalue:"0",menuSelectKey:"0",showRightBox:!1,defaultActiveKey:"0",searchData:null,createType:1,doctplListData:[],doctplCheckedData:0,doctplListDataHtml:"",doctplDocId:"",doctplFilecode:"",doctplFilename:"",entityListData:[],copyVisible:!1,currentDocArtTpliid:"0",maxHeight:"auto",copyIncreaseData:[]},a.handlesearch=a.handlesearch.bind(a),a.handleChange=a.handleChange.bind(a),a.saveRowData=a.saveRowData.bind(a),a.editDocArtTpl=a.editDocArtTpl.bind(a),a.handleModal=a.handleModal.bind(a),a.saveDocVer=a.saveDocVer.bind(a),a.getDynamicTabs=a.getDynamicTabs.bind(a),a.viewDocArtTpl=a.viewDocArtTpl.bind(a),a.docDownloadRightBox=a.docDownloadRightBox.bind(a),a.handleDelete=a.handleDelete.bind(a),a.getFilter=a.getFilter.bind(a),a.handleLike=a.handleLike.bind(a),a.discuss=a.discuss.bind(a),a.doctplChecked=a.doctplChecked.bind(a),a.authManage=a.authManage.bind(a),a.handleCopy=a.handleCopy.bind(a),a.handleUnRelease=a.handleUnRelease.bind(a),a.handleRelease=a.handleRelease.bind(a),a.dynamicFormOnlod=a.dynamicFormOnlod.bind(a),a.getPermisions=a.getPermisions.bind(a),a}return(0,y["default"])(t,e),(0,m["default"])(t,[{key:"componentWillMount",value:function(){this.getHeader(),this.getFilter(),this.getPermisions()}},{key:"componentDidMount",value:function(){this.operate="",this.record=""}},{key:"getEntityid",value:function(){return this.props.params.entityid?this.props.params.entityid:void RestAlterMsg.showError("实体ID丢失")}},{key:"getFuniid",value:function(){return this.props.location.state.funiid?this.props.location.state.funiid:void RestAlterMsg.showError("功能链接ID丢失")}},{key:"getHeader",value:function(){var e=this;(0,D.vpQuery)(V.entityHeaderUrl,{entityid:this.state.entityid,viewcode:"list"}).then(function(t){var a=e.initHeaders(t.data.grid.fields);e.setState({table_headers:a})})}},{key:"getPermisions",value:function(){this.vrmAuthUtil||(this.vrmAuthUtil=new F.VrmAuthUtil(this.getEntityid())),this.vrmAuthUtil.getPermisions()}},{key:"initHeaders",value:function(e){var t=this,a=this,i=e.map(function(e,t){var a="";return a="istatus"==e.field_name?{title:e.field_label,dataIndex:e.field_name,key:e.field_name,sorter:!0,width:e.iwidth,render:function(e,t,a){return t&&1==t.istatusvpval?b["default"].createElement(D.VpTag,{color:"blue",className:"vp-btn-br p-lr-lg"},"草稿"):b["default"].createElement(D.VpTag,{color:"green",className:"vp-btn-br p-lr-lg"},"已发布")}}:{title:e.field_label,dataIndex:e.field_name,key:e.field_name,sorter:!0,width:e.iwidth},"istatusid"==e.field_name&&(a.render=function(e,t){return b["default"].createElement("div",{className:"indic-wrapper"},b["default"].createElement(D.VpIconFont,{type:"vpicon-circle-o text-primary",className:"m-r-xs"}),e)}),a});i.push({title:"解析状态",dataIndex:"iextrac_status",key:"iextrac_status",width:"100",render:function(e,t,a){return t?0==t.iextrac_statusvpval?b["default"].createElement(D.VpTag,{color:"red",className:"vp-btn-br p-lr-lg"},"未解析"):1==t.iextrac_statusvpval?b["default"].createElement(D.VpTag,{color:"yellow",className:"vp-btn-br p-lr-lg"},"解析中"):2==t.iextrac_statusvpval?b["default"].createElement(D.VpTag,{color:"green",className:"vp-btn-br p-lr-lg"},"已解析"):"":""}});var n={title:"操作",key:"operation",fixed:"right",width:"120",render:function(e,i,n){return b["default"].createElement("div",null,b["default"].createElement(D.VpTooltip,{placement:"top",title:0==i.ilike?"关注":"取消关注"},b["default"].createElement(D.VpIconFont,{onClick:function(e){return a.handleLike(e,i.ientityid,i.iid)},className:"text-primary m-lr-xs cursor",type:1==i.ilike?"vpicon-star":"vpicon-star-o"})),a.vrmAuthUtil.isDiscussRead()||a.vrmAuthUtil.isDiscussWrite()?b["default"].createElement(D.VpTooltip,{placement:"top",title:"评论"},b["default"].createElement(D.VpIconFont,{onClick:function(e){return t.discuss(e,i)},data:"edit",className:"text-primary m-lr-xs cursor",type:"vpicon-pinglun"})):null,a.vrmAuthUtil.isAttWrite()?i&&1==i.istatusvpval?b["default"].createElement(D.VpTooltip,{placement:"top",title:"发布"},b["default"].createElement(D.VpIconFont,{onClick:function(e){return a.handleRelease(e,i)},data:"publish",className:"text-primary m-lr-xs cursor",type:"vpicon-check-circle-o"})):b["default"].createElement(D.VpTooltip,{placement:"top",title:"取消发布"},b["default"].createElement(D.VpIconFont,{onClick:function(e){return a.handleUnRelease(e,i)},data:"unpublish",className:"text-danger m-lr-xs cursor",type:"vpicon-close-circle"})):null,a.vrmAuthUtil.isAttRead()?b["default"].createElement(D.VpTooltip,{placement:"top",title:"更多"},b["default"].createElement("span",{className:"m-lr-xs cursor"},b["default"].createElement(D.VpDropdown,{overlay:b["default"].createElement(D.VpMenu,null,b["default"].createElement(D.VpMenuItem,{key:"0"},b["default"].createElement("div",{onClick:function(e){return a.viewDocArtTpl(e,i)}},b["default"].createElement(D.VpIconFont,{className:"cursor m-r-xs f16 text-primary",type:"vpicon-see-o"}),"查看文档")),a.vrmAuthUtil.isAttWrite()&&1==i.istatusvpval?b["default"].createElement(D.VpMenuItem,{key:"1"},b["default"].createElement("div",{onClick:function(e){return a.editDocArtTpl(e,i)}},b["default"].createElement(D.VpIconFont,{className:"cursor m-r-xs f16 text-primary",type:"vpicon-edit"}),"编辑文档")):null,a.vrmAuthUtil.isAttWrite()?b["default"].createElement(D.VpMenuItem,{key:"2"},b["default"].createElement("div",{onClick:function(e){return a.handleCopy(e,i)}},b["default"].createElement(D.VpIconFont,{className:"cursor m-r-xs f16 text-primary",type:"vpicon-copy"}),"复制文档")):null,a.vrmAuthUtil.isAttWrite()&&1==i.istatusvpval?b["default"].createElement(D.VpMenuItem,{key:"3"},b["default"].createElement(D.VpPopconfirm,{title:"确定删除?",onConfirm:function(e){return a.handleDeletefunction(e,i)}},b["default"].createElement("div",null,b["default"].createElement(D.VpIconFont,{className:"cursor m-r-xs f16 text-danger",type:"vpicon-shanchu"}),"删除"))):null),trigger:["click"],getPopupContainer:function(e){return document.getElementById("table")}},b["default"].createElement(D.VpIcon,{"data-id":i.iid,className:"cursor",type:"ellipsis",onClick:function(e){return e.stopPropagation()}})))):null)}};return i.push(n),i}},{key:"stopEvent",value:function(e){var t=e;t&&t.stopPropagation?(t.stopPropagation(),t.preventDefault()):window.event&&(t.cancelBubble=!0,t.returnValue=!1)}},{key:"handleCopy",value:function(e,t){var a=this;a.operate=2,a.record=t,2==t.iextrac_statusvpval?(this.getCopyFormData(),a.setState({copyVisible:!0,currentDocArtTpliid:t.iid})):1==t.iextrac_statusvpval?C.RestAlertMsg.showWarning({msg:"文件正在解析,请稍等刷新页面重试！"}):0==t.iextrac_statusvpval?this.parseDoc(e,t):console.log("record.iextrac_statusvpval is error")}},{key:"handleDeletefunction",value:function(e,t){var a=this;a.setState({spinStatus:!0}),(0,D.vpRemove)("{vpvrm}/vrm/docArtTempl/deleteDocArtTempl",{iid:t.iid,entityid:a.state.entityid,docId:t.idoc_id},"",5e9).then(function(e){a.setState({spinStatus:!1}),a.VpTable.getTableData(),C.RestAlertMsg.showSuccess({msg:"删除成功！"})})["catch"](function(e){a.setState({spinStatus:!1})})}},{key:"handleRelease",value:function(e,t){this.stopEvent(e);var a=this;a.record=t,a.operate=3,2==t.iextrac_statusvpval?(0,D.vpEdit)("{vpvrm}/vrm/docArtTempl/releaseDocArtTempl",{sparam:(0,r["default"])(t),entityid:this.state.entityid,iid:t.iid},"",5e9).then(function(e){a.VpTable.getTableData(),C.RestAlertMsg.showSuccess({msg:"发布成功！"})}):1==t.iextrac_statusvpval?C.RestAlertMsg.showWarning({msg:"文件正在解析,请稍等刷新页面重试！"}):0==t.iextrac_statusvpval?this.parseDoc(e,t):console.log("record.iextrac_statusvpval is error")}},{key:"handleUnRelease",value:function(e,t){this.stopEvent(e);var a=this;(0,D.vpEdit)("{vpvrm}/vrm/docArtTempl/unReleaseDocArtTempl",{sparam:(0,r["default"])(t),entityid:this.state.entityid,iid:t.iid},"",5e9).then(function(e){C.RestAlertMsg.showSuccess({msg:"撤销发布成功！"}),a.VpTable.getTableData()})}},{key:"handleDelete",value:function(e,t){var a=this;a.setState({spinStatus:!0}),(0,D.vpRemove)("{vpvrm}/vrm/doc/delete",{iid:t.iid,entityid:a.state.entityid,docId:t.idoc_id},5e9).then(function(e){a.setState({spinStatus:!1}),a.VpTable.getTableData(),C.RestAlertMsg.showSuccess({msg:"删除成功！"})})["catch"](function(e){_this.setState({spinStatus:!1})})}},{key:"listDownloadOutline",value:function(){var e=this,t=e.record.sname+"-文档导出";return b["default"].createElement(S["default"],{docId:e.record.idoc_id,docname:t})}},{key:"saveDocVer",value:function(e,t){var a=this;a.setState({spinStatus:!0}),(0,D.vpAdd)("{vpodm}/vrm/reqDocBl/saveWordDocBl",{docId:t.idoc_id,docReqId:t.iid},"",5e9).then(function(e){a.VpTable.getTableData(),a.setState({spinStatus:!1}),C.RestAlertMsg.showSuccess({msg:"保存版本成功！"})})}},{key:"docDownloadRightBox",value:function(e,t){this.record=t,2==t.iextrac_statusvpval?this.setState({rightBox_type:"showDownload",spinStatus:!1,showRightBox:!0,increaseData:{}}):1==t.iextrac_statusvpval?C.RestAlertMsg.showWarning({msg:"文件正在解析,请稍后..."}):0==t.iextrac_statusvpval?this.parseDoc(e,t):console.log("record.iextrac_statusvpval is error")}},{key:"saveRowData",value:function(e,t){t.preventDefault();var a=this;this.props.form.validateFields(function(e,t){if(t.file_label&&!t.file)return void C.RestAlertMsg.showWarning({msg:"文件正在上传中...请稍后再次点击提交！"});e||(a.setState({loading:!0}),(0,D.vpAdd)("{vpvrm}/vrm/docArtTempl/saveDocArtTempl",{sparam:(0,r["default"])(t),entityid:a.state.entityid},"",5e9).then(function(e){a.setState({showRightBox:!1,rightBox_type:"",loading:!1,doctplDocId:"",doctplFilecode:"",doctplFilename:""}),a.VpTable.getTableData()})["catch"](function(e){a.setState({loading:!1})}))})}},{key:"getFilter",value:function(){var e=this;(0,D.vpQuery)(V.entityFilterConfigUrl,{entityid:e.state.entityid}).then(function(t){if(t.hasOwnProperty("data")&&t.data.hasOwnProperty("search")){var a=t.data.search.filters;e.setState({filters:a})}})}},{key:"getDynamicTabs",value:function(e,t){var a=this;e?(0,D.vpAdd)(V.entityDynamicTabsUrl,{entityid:this.state.entityid,iid:t}).then(function(e){var t=e.data.tabs;console.log(t.join(",")),a.setState({tabs_array:t})}):this.setState({tabs_array:[]})}},{key:"editDocArtTpl",value:function(e,t){this.operate=1,this.record=t,2==t.iextrac_statusvpval?window.open("../vpword/index.html?busSceneCode=arttpl_edit&docId="+t.idoc_id):1==t.iextrac_statusvpval?C.RestAlertMsg.showWarning({msg:"文件正在解析,请稍等刷新页面重试！"}):0==t.iextrac_statusvpval?this.parseDoc(e,t):console.log("record.iextrac_statusvpval is error")}},{key:"viewDocArtTpl",value:function(e,t){this.operate=4,this.record=t,2==t.iextrac_statusvpval&&null!=t.idoc_id?window.open("../vpword/index.html?busSceneCode=arttpl_view&docId="+t.idoc_id):0==t.iextrac_statusvpval?this.parseDoc(e,t):1==t.iextrac_statusvpval&&(C.RestAlertMsg.showWarning({msg:"文件正在解析,请稍后点击..."}),this.VpTable.getTableData())}},{key:"closeRightModal",value:function(e){var t=this;this.setState({showRightBox:!1,rightBox_type:""},function(){t.props.setBreadCrumb()})}},{key:"handlesearch",value:function(){this.setState({searchStr:this.searchValue})}},{key:"handleChange",value:function(e){this.searchValue=e.target.value}},{key:"getCopyBoxContent",value:function(){var e=this;return e.state.copyVisible?e.copyDocArtTplEdit():null}},{key:"getBoxContent",value:function(){return"add"==this.state.rightBox_type||"edit"==this.state.rightBox_type?this.editDom():"showDownload"==this.state.rightBox_type?this.listDownloadOutline():""}},{key:"dynamicFormOnlod",value:function(){var e=this.props.form;e.setFieldsValue,e.getFieldValue}},{key:"editDom",value:function(){var e=this,t=this;if(this.state.showRightBox){var a=this.props.form,i=a.getFieldProps,n=(a.getFieldValue,a.setFieldsValue,{labelCol:{span:5,offset:3},wrapperCol:{span:14}}),l=this.state.tabs_array.length?null:"1"==this.state.createType?b["default"].createElement(D.VpCol,{key:"0",span:12},b["default"].createElement(D.VpInputUploader,{form:this.props.form,item:{field_name:"file",widget_type:"inputupload",field_label:"选择文档",validator:{required:!1},all_line:2,tips:"请选择文档（*.doc,*.docx)",widget:{accept:{title:"Doc",extensions:"docx,doc"},upload_url:this.state.uploadUrl}},placeholder:"请选择文档",className:"vrm-VpInputUploader"})):b["default"].createElement("div",null,b["default"].createElement("div",null,b["default"].createElement(D.VpCol,{key:"0",span:12},b["default"].createElement(D.VpFInput,(0,s["default"])({label:"需求文档模板"},n,i("doctplField",{rules:[{required:!0,message:"请选择需求文档模板"}]}),{disabled:"true"})))),b["default"].createElement("div",null,b["default"].createElement(D.VpCol,{key:"0",span:24},t.state.doctplListDataHtml)));return b["default"].createElement(D.VpTabs,{defaultActiveKey:this.state.defaultActiveKey,onChange:this.tabsChange,destroyInactiveTabPane:!0},this.state.tabs_array.length?this.state.tabs_array.map(function(t,a){if(t.staburl){if("1"==t.ilinktype)return b["default"].createElement(D.VpTabPane,{tab:t.sname,key:t.skey},b["default"].createElement(VpIframe,{url:t.staburl+"?entityid="+e.state.entityid+"&iid="+e.state.entityiid}));var i=t.staburl.split("?"),n=(i[0],"");i.length>1&&(n=i[1]);var s=(0,_.requireFile)(t.staburl);return b["default"].createElement(D.VpTabPane,{tab:t.sname,key:t.skey},b["default"].createElement(s,{skey:t.skey,stabparam:n,isflow:!1,formData:e.state.increaseData,entityid:e.state.entityid,iid:e.record.iid,entityrole:"1"==t.iaccesslevel&&"1"==e.state.readOrWrite,add:!1,row_id:e.record.iid,row_entityid:e.state.entityid,closeRightModal:function(){return e.closeRightModal()},refreshList:function(){return e.VpTable.getTableData()},docid:e.record.idoc_id,busObjType:1}))}return b["default"].createElement(D.VpTabPane,{tab:t.sname,key:a+"tabs"})}):b["default"].createElement(D.VpTabPane,{tab:"属性",key:0},b["default"].createElement(k.VpDynamicForm,{ref:function(t){return e.dynamic=t},bindThis:this,formData:this.state.increaseData,form:this.props.form,okText:"提交",onLoad:this.dynamicFormOnlod,handleOk:this.saveRowData,loading:this.state.loading,extraComponent:[b["default"].createElement("div",{className:"accessory bg-white full-height"},b["default"].createElement(D.VpRow,{style:{padding:"0 16px"}},l))]})))}return null}},{key:"render",value:function(){var e=this,t=this;return b["default"].createElement("div",{className:"business-container pr full-height entity-reqdoc"},b["default"].createElement("div",{className:"subAssembly b-b bg-white",style:t.props.style},b["default"].createElement(D.VpRow,{className:"p-b-sm"},b["default"].createElement(D.VpCol,{span:4},b["default"].createElement("div",{className:"m-b-sm search"},b["default"].createElement(k.VpSearchInput,{onPressEnter:t.handlesearch,searchButton:t.handlesearch,onChange:t.handleChange,placeholder:"请输入名称或编号搜索..."}))),t.vrmAuthUtil.isAttWrite()?b["default"].createElement(D.VpCol,{span:20,className:"text-right"},b["default"].createElement(D.VpTooltip,{placement:"top",title:"快速创建"},b["default"].createElement(D.VpButton,{onClick:function(e){return t.handleModal(e,null,"1","add")},data:"add","data-type":"1",type:"primary",className:"m-l-xs",shape:"circle"},b["default"].createElement(D.VpIcon,{data:"add","data-type":"1",type:"plus"})))):"")),b["default"].createElement("div",{className:"business-wrapper p-t-sm full-height"},b["default"].createElement("div",{className:"bg-white p-sm full-height entity-reqdoclist"},b["default"].createElement(D.VpRow,{gutter:16,className:"full-height"},b["default"].createElement(D.VpCol,{span:t.state.shrinkShow?"4":"0",className:"full-height pr menuleft"},b["default"].createElement("div",{className:"full-height scroll-y"},b["default"].createElement(D.VpMenu,{className:"full-height",onClick:t.handleClick,openKeys:t.state.openKeys,onOpen:t.onToggle,onClose:t.onToggle,mode:"inline",selectedKeys:[t.state.menuSelectKey]},b["default"].createElement(D.VpSubMenu,{key:"filter",title:b["default"].createElement("span",null,b["default"].createElement(D.VpIconFont,{type:"vpicon-filter",className:"m-r-xs"}),b["default"].createElement("span",null,"过滤器"))},t.state.filters.map(function(e,t){return b["default"].createElement(D.VpMenuItem,{key:e.value},e.name)})))),t.state.shrinkShow?b["default"].createElement("div",{className:"navswitch cursor text-center",onClick:t.shrinkLeft},b["default"].createElement(D.VpIconFont,{type:"vpicon-navclose"})):null),b["default"].createElement(D.VpCol,{span:t.state.shrinkShow?"20":"24",className:"full-height scroll-y",id:"table"},t.state.shrinkShow?null:b["default"].createElement("div",{className:"shrink p-tb-sm cursor text-center",onClick:t.shrinkLeft},b["default"].createElement(D.VpIconFont,{type:"vpicon-navopen"})),b["default"].createElement(D.VpSpin,{spinning:t.state.spinStatus},b["default"].createElement(D.VpTable,{ref:function(t){return e.VpTable=t},columns:t.state.table_headers,resize:!0,className:"docArtTplTable",scroll:{y:t.state.maxHeight},controlAddButton:t.renderHeight,onRowClick:t.rowClick,dataUrl:t.state.url,queryMethod:"GET",params:{condition:(0,r["default"])(t.state.searchData),quickSearch:t.state.searchStr,viewtype:"list",viewcode:"list",entityid:t.state.entityid,filtervalue:t.state.filtervalue,currentkey:t.state.currentkey}})))))),b["default"].createElement(k.RightBox,{max:!0,button:b["default"].createElement("div",{className:"icon p-xs",onClick:t.closeRightModal.bind(t)},b["default"].createElement(D.VpTooltip,{placement:"top",title:x["default"].drawerSpinIcon[window.LOCALE]},b["default"].createElement(D.VpIcon,{type:"right"}))),show:this.state.showRightBox},this.getBoxContent()),b["default"].createElement(D.VpModal,{title:"模板复制",visible:this.state.copyVisible,onCancel:function(){return e.setState({copyVisible:!1})},onOk:this.copyDocArtTplHandleOk.bind(this),okText:"确定",cancelText:"取消",height:500,width:650,className:"selfSetBottomclass vrm-art-ant-modal-body-form"},t.getCopyBoxContent()),b["default"].createElement(T["default"],{ref:"parseProgress",closeFn:function(){e.closeParseWindow()}}))}}]),t}(b["default"].Component);t["default"]=R=(0,D.VpFormCreate)(R)},1025:function(e,t,a){var i=a(1026);"string"==typeof i&&(i=[[e.id,i,""]]);var n={hmr:!0};n.transform=void 0;a(439)(i,n);i.locals&&(e.exports=i.locals)},1026:function(e,t){}});