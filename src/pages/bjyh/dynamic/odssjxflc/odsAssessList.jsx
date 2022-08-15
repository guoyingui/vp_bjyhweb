import React, { Component } from "react";
import EntityList from '../../../templates/dynamic/List/index';
import {
    EditTableCol, RightBox,
    VpDTable,VpSearchInput,VpVerifyTableCol
} from 'vpbusiness';

import { VpInput,VpTooltip,VpIcon,VpButton,VpModal,VpTag,VpIconGroup,VpRadioGroup,VpRadio,VpConfirm,
    VpRow,VpCol,VpTable,vpQuery,vpAdd,VpAlertMsg,VpUpLoad,VpPopconfirm,VpForm,VpFCheckbox,
    VpSwitch
} from 'vpreact';

import Problemlist from "../flowAccess/problemList";
import {VpFUploader} from '../../../templates/dynamic/Form/VpFUploader';

const EditTable = EntityList.EditTable;
class CustomEditTable extends EditTable.Component{
    constructor(props) {
        super(props);
        this.state={
            editrowdata: {},//需要保存的编辑数据
            tableloading: false,
            data:[],//EditTableCol的callback
            addPersonButton:false,//添加评审人按钮显示
            sendAccessButton:false,//发送评审按钮显示
            rowSpanArray:[],
            resultUserids:[]
        }
     
    }
     
    updateStatus=(stateObj)=>{
        let _this = this;
        _this.props.updateStatus(
            stateObj
        );
    }
    

    /**
     * CustomEditTable渲染完成
     */
    componentDidMount() {
        this.props.onRef(this);    
    }

    /**
     * 获取表头
     */
    getEditHeader = () => {
        let _this = this;
        let _headerNew = [
            { title: '评审人', dataIndex: 'assesserval',key:'assesserval',
                render: (text, record,index) => {
                    let obj ={
                        children:record.p_assesser?record.p_assesserval:text,
                        props:{
                            rowSpan:this.state.rowSpanArray[index]
                        }
                    }
                    //return obj 
                    return record.p_assesser!=-1?'':text          
                }
            },
            { title: '预评审人', dataIndex: 'p_assesserval',key:'p_assesserval',
                render: (text, record,index) => {
                    if(record.p_assesser!=-1){
                        return record.assesserval;
                    }else{
                        return text
                    }
                }
            },
            { title: '状态', dataIndex: 'status',key:'status',
                render: (text, record) => {
                    let statname='';
                    
                    switch (text*1) {
                        case 0:statname='未下发';break;
                        case 1:statname='未反馈';break;
                        case 2:statname='已反馈';break;
                        case 4:statname='已转发';break;
                        default:statname='';break;
                    }
                    return statname;
                }
            },
            { title: '操作时间', dataIndex: 'resdate',key:'resdate',type:'date'
               
            },
            { title: '评审结论', dataIndex: 'results',key:'results',
                render: (text, record) => {
                    if(record.status==1){
                        return ""
                    }
                    if(text==1){
                        return "通过";
                    }else if(text==2){
                        return "不通过";
                    }else if(text==3){
                        return "有条件通过"
                    }
                }
            },
            { title: '是否召开评审会', dataIndex: 'is_meeting',key:'is_meeting',
            render: (text, record) => {
                if(text==1){
                    return "是";
                }else{
                    return "否";
                }
            }
            },
            { title: '评审意见', dataIndex: 'advice',key:'advice',
                render: (text, record) => {
                    if(record.status==1){
                        return ""
                    }else{
                        return text
                    }
                }
            },
            { title: '评审问题', dataIndex: 'pinfo',key:'pinfo',
                render:  (text, record) => {
                    return text
                }
            },{ title: '操作', dataIndex: 'do',key:'do',
            render:  (text, record) => {
                const obj = {
                    children: text,
                    props: {},
                };

                let optionsData = [{placement:'top', title:'查看详情', className: 'text-primary', type: 'vpicon-see-o',onClick: 'toProblemInfo'}];
                if(this.props.accessCreator == vp.cookie.getTkInfo("userid") && !this.props.isStepOver){
                    optionsData.push(
                        {placement:'top', title:'下发评审', className: 'text-primary', type: 'vpicon-edit',onClick: 'reSendAccess'},
                    );
                    if(record.config==1||record.p_assesser!=-1){

                    }else{
                        optionsData.push(
                            {placement:'left', title:'删除', className: 'text-danger', type: 'vpicon-shanchu',onClick: 'deleteConfirm'}
                        );
                    }
                }

                return (
                    <VpIconGroup clickParams={[record]} bindThis={this} optionsData={optionsData}/>
                )
            }}
        ];
        _this.onLoadHeaderSuccess(_headerNew);
        _this.setState({ table_headers: _headerNew, tableloading: false });
    }

    //操作列按钮方法
    toProblemInfo = (record) => {
        console.log('toProblemInfo',record);
        this.props.toProblemInfo(record);
    }
     //重新下发 调用父组件
    reSendAccess = (record) => {
        let {iid,assesser,status} = record
	    if(status=='1'){return}
	    let _this = this;
        let idarr = [];
        idarr.push(iid);
        let userids = [];
        userids.push(assesser);
        vpAdd("/{bjyh}/flowAccess/updateStatus", {
            idlist:idarr.toString()
        }).then((response) => {
            VpAlertMsg({
                message: "消息提示",
                description: `下发成功`,
                type: "info",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
            _this.tableRef.getTableData()//刷新子页面
            _this.props.parent.odsTableRef.getTableData();
        })
    }
  
    

    /**
     * 表格自定义属性
     * @returns {}
     */
    getCustomTableOptions(){
        let _this = this
        return {
            //dataUrl:'/{bjyh}/flowAccess/getListData',
            dataUrl:'/{bjyh}/flowAccess/assesslist',
            params:{
                piid:_this.props.piid,
                taskid:_this.props.taskid||_this.props.staskid||_this.props.formData.curtask.taskId,
                assessid:_this.props.parentForm && _this.props.parentForm.props.assessid
            },
            rowKey:'iid',
            tableOptions:[],//底部功能按钮
            bordered:true,
            className:'accessList',
            size:'small',
            pagination: false,
        }
    }

    //数据加载完成后
    controlAddButton = (numPerPage, resultList) => {
        console.log(numPerPage,resultList);
        //let theight = vp.computedHeight(resultList.length, '.accessList')
        //设置展开行
        //theight = theight;
        this.setState({
            tableloading: false,
            tableHeight: resultList.length==0?200:resultList.length*40+10,
        })

        //加载完后 值传给父组件
        let accesserData = {}
        let resultUserids=[]
        let subflag = true
        for (let index = 0; index < resultList.length; index++) {
            resultUserids = [...resultUserids,resultList[index].assesser*1]
            if(resultList[index].assesser == vp.cookie.getTkInfo('userid')){
                accesserData = {...resultList[index]}
            }else if(resultList[index].status==1){
                subflag = false
            }
        }
        if(!accesserData.results) accesserData.results=1
        if(!accesserData.advice) accesserData.advice=''
        
        this.props.updateStatus({
            'accesserData':accesserData,
            'showProblist':true,
            'resultList':resultList,
            'resultUserids':resultUserids,
            'subflag':subflag
        })
    }

    //行删除操作
    deleteConfirm = (record) =>{
        vpQuery('/{bjyh}/flowAccess/deletePersonByid',{
            ...record
        }).then((response)=>{
            console.log(response);
            this.tableRef.getTableData();
            this.props.parent.odsTableRef.getTableData();
        })
    }

    render(){
        return (
            <div className={"batch-table" }>
               {super.render()}
            </div>
        )
    }

}

class T extends EntityList.Component {
    constructor(props){
        super(props);
        //给当前list起个唯一名称
        this._contextid = this.props._contextid || new Date().getTime();
        

        this.state = {
            split_user:false,
            table_userHeaders:[],//选择用户表头
            searchStr: "",//快速搜索
            selectItem: [],//已选择的评审人
            selectedRowKeys:[],
            entity_data_url:"/{vpplat}/vfrm/entity/dynamicListData",
            resultList:[],//所有评委信息
            resultUserids:[],//所有userid
            odsTableData:[],
            accessCreator:'',
            accesserData:{},
            showProblist:false,//问题列表是否显示
            showRightBox:false,
            toInfoData:{},
            sdesc:'',//风险分析汇总
            isStepOver:false,//是否是已结束的流程
            rowSpanArray:[],//合并单元格参数
            resultVal:{
                1:'通过',
                2:'不通过',
                3:'有条件通过'
            }
        }
        
        console.log(" 评审子页面props... ",this);
    }
    //提交提示
    confirm=(options,callback)=>{
        VpConfirm({
            title: '提示',
            content: '还有未反馈的评审,确认是否提交',
            onOk(){callback(null,null)},
            onCancel(){callback(true,null)}
        }); 
    }

    alertMsg=(desc,type,message)=>{
        return(
            VpAlertMsg({
                message: message||"消息提示",
                description: desc||'!',
                type: type||'info',
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        )
    }

    /**
     * 注册子表单到父表单参数
     */
    getRegisterSubFormOptions(){
        return {
            asyncSave: true, //是否是同时保存主子表，如果为true,则子表单类必须实现getFormValues接口,如果为false,则实现onSave接口
            onValidate:"onValidate", //如果默认的onValidate与类有冲突时，可以使用自定义名称替换onValidate函数
            onSave:"onSave",  //如果默认的onSave与类有冲突时，可以使用自定义名称替换onSave函数
            getFormValues:"getFormValues", //如果默认的getFormValues与类有冲突时，可以使用自定义名称替换getFormValues函数
            //onMainFormSaveSuccess:"onMainFormSaveSuccess"  //同步保存时，主表单保存成功后
        }
    }

    /**
     * 校验接口,提供给父表单保存前校验时调用
     * @param callback 交验后回调
     */
    onValidate(options,callback){
        //如果需要取父表单数据，可以通过this.parentForm.props.form.getFieldsValue()取到
        console.log('onValidate.',options.btnName);
        switch (options.btnName) {
            case 'ok':
              let _accesserData = this.state.accesserData    
              let list = [...this.state.resultList]
                    let arr =[],arr1=[]
                    list.map((item, i) => {
                        if(item.status=='0'){
                            arr.push(item.assesserval);
                        }else if(item.status=='1'){
                            arr1.push(item.assesserval);
                        }
                })
                if(vp.cookie.getTkInfo('userid')==this.state.accessCreator){
                   if(list.length===0){
                        this.alertMsg('还未添加评审人！','error')
                        callback(true,null) 
                   }else if(arr.length>0){
                        this.alertMsg('还有未下发的评审','error')
                        callback(true,null)
                   }else if(arr1.length>0){
                        this.confirm(options,callback)
                   }else{
                        callback(null,null)
                   }
                }else{
                    if(_accesserData.results=='2' && _accesserData.advice===''){
                        this.alertMsg('请填写评审意见','error')
                        callback(true,null)
                    }
                    callback(null,null) 
                }
                break;
            case 'save':
                //this.confirm(options,callback)
                callback(null,null)
                break;
        }
    }
    onSave(options,successCallback,errorCallback){
        console.log('onSave..');
        errorCallback(null,null)  
    }
    getFormValues(options,errorCallback){
        let _this = this
        console.log('getFormValues',options);
        let subflag = options.btnName
        if(vp.cookie.getTkInfo('userid')==this.state.accessCreator){
            vpAdd("/{bjyh}/flowAccess/saveDetial", {
                taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId,
                piid:this.props.piid,
                sdesc:this.state.sdesc,
                
            }).then((response) => {
                if(response.status === 200){
                    errorCallback(null,null)
                }else{
                    console.error('接口调用失败'); 
                    errorCallback(true,null)
                }
            })  
        }else{
            //将评审人的状态改成已反馈
            this.state.odsTableData.map(item=>{
                if(options.btnName==='ok'){//如果'提交'时表单上默认的'是'赋值
                    item.sfqr = item.sfqr?item.sfqr:'是'
                    item.sftysyfhxf = item.sftysyfhxf?item.sftysyfhxf:'是'
                    item.sftyxf = item.sftyxf?item.sftyxf:'是'
                }else{
                    item.sfqr = item.sfqr==='是'?'':item.sfqr 
                    item.sftysyfhxf = item.sftysyfhxf==='是'?'':item.sftysyfhxf 
                    item.sftyxf = item.sftyxf==='是'?'':item.sftyxf 
                }
            })
            vpAdd("/{bjyh}/flowAccess/subAccessForm_ods", {
                type:'ods',method:options.btnName,
                sparam:JSON.stringify(this.state.accesserData),
                odsparam:JSON.stringify(this.state.odsTableData),
                stepcode:this.props.stepcode
            }).then((response) => {
                errorCallback(null,null)
            })
            
        }
    }
    onMainFormSaveSuccess(saveReturnData){
        console.log('onMainFormSaveSuccess',saveReturnData,this.listRef);
        this.listRef.tableRef.reloadTable();
    }

    //注册子表单到父表单中,
    registerSubForm(){
        //调用this.props.registerSubForm注册子表单到父表单中，父表单返回父表单this
        this.parentForm = this.props.registerSubForm(this.props.field_name,this,this.getRegisterSubFormOptions());
    }

    componentWillMount() {
        this.getUserHeader();
        //this.getAccesserData()
        //this.getStepInfo();
        this.registerSubForm();//syn parentPage
        this.getODSheader();
        //this.setODSperson();//添加评审人时 预选ods的相关角色
        //解决问题被遮住的问题
        $('.footFixed').css('z-index',1)
    }
    componentDidMount() {
        if(!window.flowtabs){
            window.flowtabs={};
        }
        this.getStepInfo()        
        $('.footFixed').css('z-index',1)
    }

    //获取步骤信息
    getStepInfo = () =>{
        //console.log('隐藏预设处理人1. getStepInfo...',this);
        vpAdd("{bjyh}/customFlowConf/getStepInfo", {
            piid:this.props.piid,
            taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId
        }).then((response) => {
            //console.log('getStepInfo..',response);
            const setObj = {'accessCreator':response.data.assignee_}
            if(response.data.end_time_){
                setObj.isStepOver=true
            }
            this.setState(setObj);  
            
            //评委隐藏预设处理人
            if(vp.cookie.getTkInfo('userid')!=response.data.assignee_ && !setObj.isStepOver){
                let _this = this;
                let groups = _this.parentForm.state.formData.groups;
                //预设处理人和步骤意见
                for (let index = 0; index < groups.length; index++) {
                    const element = groups[index];
                    if(element.group_code==='flow_handler'){
                        if(element.fields.length>0){
                            element.fields[0].fieldProps.rules[0].required=false
                        }
                        groups.splice(index,1)
                        index--
                    }else if(element.group_code==='info'){
                        groups.splice(index,1)
                        index--
                    }
                }
                _this.parentForm.props.form.resetFields()
                _this.parentForm.props.formData.form.groups=groups
                //再做个假的保存
                _this.parentForm.setState({
                    getCustomSaveUrl:'/{bjyh}/flowAccess/fakeSave',
                    getCustomSubmitUrl:'/{bjyh}/flowAccess/fakeSave',
                    groups:[...groups]
                })
                _this.parentForm.forceUpdate()

                let buttons = this.parentForm.state.newButtons
                buttons.map(item=>{
                    if(item.name==='moduser'){
                        item.className = 'hidden'
                    }   
                })
                _this.parentForm.setState({newButtons:buttons})
            }
        })
    }

    //获取评委人信息
    /* getAccesserData = ()=>{
        let _this = this
        vpAdd("/{vpplat}/assess/assesslist", {
            piid:_this.props.piid,
            taskid:_this.props.taskid||_this.props.staskid||_this.props.formData.curtask.taskId
        }).then((response) => {
            //this.child.tableRef.getTableData()//刷新子页面
            let resultList = response.data.resultList
            let accesserData = {}
            for (let index = 0; index < resultList.length; index++) {
                if(resultList[index].assesser == vp.cookie.getTkInfo('userid')){
                    accesserData = {...resultList[index]}
                    break
                }
            }
            _this.setState({accesserData})
        })
    } */

    /**
     * 弹出添加评审人窗口
     */
    addPerson = (record) => {
        let _this = this;
        _this.setODSperson()
        _this.updateStatus({
            split_user: true,
            searchStr: ""
        });
    }

    /**
     * 下发评审
     */
    sendAccess = (v) => {
        let _this = this;
        let idarr = [],arr2=[];
        
        let data = this.child.tableRef.getCurrentData()
        let userids = [];
        data.map((item, i) => {
            if(item.status==0){
                idarr.push(item.iid);
                userids.push(item.assesser);
            }
            if(!item.accesserrole){
                arr2.push(item.assesserval)
            }
        })
        
        if(!idarr.length>0){
            this.alertMsg('没有可下发的评审','error')
            return
        }
        
        vpAdd("/{bjyh}/flowAccess/batchUpdateStatus", {
            param:JSON.stringify({
                idlist:idarr.toString(),
                userids:userids.toString(),
                taskid:_this.props.taskid||_this.props.staskid||_this.props.formData.curtask.taskId,
                piid:_this.props.piid,
            })
        }).then((response) => {
            VpAlertMsg({
                message: "消息提示",description: '下发成功',
                type: "info",onClose: this.onClose,
                closeText: "关闭",showIcon: true
            }, 3)
            this.child.tableRef.getTableData()//刷新子页面
            this.odsTableRef.getTableData()//刷新ods子页面
        })

    }

    /**
     * 评审人OK
     */
    splitUserOk = () => {
        console.log('splitUserOk ',this.state);
        let _this = this;
        const resultUserids = this.state.resultUserids
        let accesspersonids=[]
        this.state.selectItem.map((item, i) => {            
            if(resultUserids.indexOf(item.iid*1)!=-1||(item.iid*1)==vp.cookie.getTkInfo('userid')){

            }else{
                accesspersonids.push(item.iid);
            }
        })
        this.setState({ split_user: false });
        if(accesspersonids.length>0){
            this.addAssesserFunc(accesspersonids);
        }
    }

    addAssesserFunc=(ids)=>{
        let _this = this
        let param = {
            idlist:ids,
            taskid:_this.props.taskid||_this.props.staskid||_this.props.formData.curtask.taskId,
            piid:_this.props.piid,
        }

        vpAdd("/{vpplat}/assess/addAssesser", {
            param:JSON.stringify(param)
        }).then((response) => {
            VpAlertMsg({
                message: "消息提示",
                description: '操作成功！',
                type: "info",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
            _this.child.tableRef.getTableData()//刷新子页面
            _this.odsTableRef.getTableData()//刷新ods子页面
        }) 
    }    
    
    //ONCLOSE
    onClose(item, i) {
        let newList = [...this.state.selectItem.slice(0, i), ...this.state.selectItem.slice(i + 1)];
        this.setState({
            selectItem: newList,
            selectedRowKeys: newList.map((item, i) => {
                return item.iid
            })
        })
    }
    getUserContent = () => {
        if (this.state.split_user) {
            return this.showUsertem();
        } else {
            return '';
        }
    }

    handleUserSelect = (record, selected, selectedRows) => {
        this.setState({ record });
        let idx = 0;
        if (selected) {
            let comments = this.state.selectItem
            comments.push(record)
            this.setState({
                selectItem: comments
            })
        } else {
            this.state.selectItem.forEach((element, i) => {
                if (element.key === record.key) {
                    idx = i
                }
            });
            this.setState({
                selectItem: [...this.state.selectItem.slice(0, idx), ...this.state.selectItem.slice(idx + 1)]
            })
        }        
    }

    //全选
    handleSelectAll = (selected, selectedRows, changeRows) => {   
        let selectItem = this.state.selectItem
        if(selected){
            this.setState({selectItem:selectItem.concat(selectedRows)})
        }else{
            selectItem = selectItem.filter(i=>{
                if(!JSON.stringify(changeRows).includes(JSON.stringify(i))){
                    return i
                }
            })
            this.setState({selectItem:selectItem})
        }
    }
    /**
     * 快速搜索
     */
    handlesearch = () => {
        this.setState({
            searchStr: this.searchValue
        }, () => {
            this.VpTable.getTableData();
        })
    }
    /**
     * 快速搜索框
     */
    handleChange = (e) => {
        this.searchValue = e.target.value;
    }

    /**
     * 选中事件
     */
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    /**
    * 系统负责人弹框取消
    */
   handleUserCancel = (e) => {
        this.setState({ selectItem: [], selectedRowKeys: [] })
        this.setState({ split_user: false });
    }

    //获取用户header
    getUserHeader() {
        vpQuery("{vpplat}/vfrm/entity/getheaders", {
            entityid: 2
        }).then((response) => {
            const table_userHeaders = this.initHeaders(response.data.grid.fields);
            this.setState({table_userHeaders})
        })
    }

    // 初始化表头信息
    initHeaders(table_headers) {
        let headers = table_headers.map((item, i) => {
            let column = { title: item.field_label, width: item.width, dataIndex: item.field_name, key: i }
            if (item.sort) {
                column.sorter = true;
            }
            return column
        })        
        return headers;
    }
    /**
     * 显评审人信息
     */
    showUsertem = () => {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            onSelect: this.handleUserSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        return (<div className="split-modal-content f14">
            <VpRow>
                <VpCol span={5} className="p-tb-xs">
                    <VpSearchInput onPressEnter={this.handlesearch}
                        searchButton={this.handlesearch} onChange={this.handleChange} placeholder="输入用户编号或者名称" />
                </VpCol>
            </VpRow>
            <div className="p-sm" style={{mixHeight:'320px' ,maxHeight: '350px', overflow: 'auto' }}>
                <VpTable
                    className="m-tb-sm"
                    rowSelection={rowSelection}
                    columns={this.state.table_userHeaders}
                    dataUrl={this.state.entity_data_url}
                    params={({
                        "quickSearch": this.state.searchStr,
                        "viewtype": "list", "entityid": 2, "viewcode": "list",
                        "currentkey": "filter", 
                    })}

                />
            </div>
            <VpRow>
                <VpCol span={24}>
                    <span className="inline-display">要添加的评审人:</span>
                    <div className="split-tag-select bg-white b m-t-sm p-sm" style={{ minHeight: '100px' }}>
                        {
                            this.state.selectItem.map((item, i) => {
                                return (
                                    <VpTag key={item.iid} closable onClose={this.onClose.bind(this, item, i)}>
                                        <span title={item.sname}>{item.sname}</span>
                                    </VpTag>
                                )
                            })
                        }
                    </div>
                </VpCol>
            </VpRow>
        </div>)
    }

    //通过 不通过
    accessRadioChange=(e)=>{
        let _this = this
        let accesserData = _this.state.accesserData
        accesserData.results=e.target.value
        _this.setState({
            accesserData
        })
    }

    //评审意见
    accessInputChange=(e)=>{
        let _this = this
        let accesserData = _this.state.accesserData
        accesserData.advice=e.target.value
        _this.setState({
            accesserData
        })
    }

    //查看问题列表
    _renderRightBoxBody(){
         let props = {
            entityid:16,
            accesserData:this.state.toInfoData,
            disable:true,
            resultVal:this.state.resultVal
         }         
         return <Problemlist taskid={this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId} piid={this.props.piid} {...props} >
            </Problemlist> 
     }

    //关闭侧滑
    closeRightModal=()=>{
        this.setState({
            showRightBox:false
        })
        //this.tableRef.getTableData();
    }
    toProblemInfo=(record)=>{    
        this.setState({
            showRightBox:true,
            toInfoData:{...record}
        })
    }

    /**
     * 更新此组件的state方法
     */
    updateStatus = (v) =>{
        this.setState(v);
    }

    /**
     * 父组件调用子组件
     */
    testChild = (ref) => {
      this.child = ref
    }
    getAccessFileRef = ref =>{
        this.AccessFileRef=ref
    }

    /* ODS相关 */
    getODSheader = ()=>{
        let _this = this
        let stepcode = _this.props.stepcode
        let ods_header = [
            { title: '评审人', dataIndex: 'assesserval',key:'assesserval',
                render: (text, record,index) => {
                    let obj ={
                        children:record.p_assesser!=-1?'':text,
                        props:{}
                    }
                    obj.props.rowSpan=_this.state.rowSpanArray[index]
                    
                    //return obj 
                    return record.p_assesser!=-1?'':text
                }
            },
            { title: '预评审人', dataIndex: 'p_assesserval',key:'p_assesserval',
                render: (text, record,index) => {

                    let obj ={
                        children:record.p_assesser!=-1?record.assesserval:text,
                        props:{}
                    }
                    obj.props.rowSpan=_this.state.rowSpanArray[index]
                    
                    //return obj
                    return record.p_assesser!=-1?record.assesserval:text
                }
            },
            { title: '状态', dataIndex: 'status',key:'status',
                render: (text, record) => {
                    let statname='';
                    switch (text*1) {
                        case 0:statname='未下发';break;
                        case 1:statname='未反馈';break;
                        case 2:statname='已反馈';break;
                        case 4:statname='已转发';break;
                        default:statname='';break;
                    }
                    return statname;
                }
            },
            {title: '英文表名', dataIndex: 'ywbm', key: 'ywbm'},
            {title: '中文表名', dataIndex: 'zwbm', key: 'zwbm'},
            {title: '字段名', dataIndex: 'zdm', key: 'zdm'},
            {title: '所属系统', dataIndex: 'ssxtvalue', key: 'ssxtvalue'},
            {title: '归属总行业务部门', dataIndex: 'gszhywbmvalue', key: 'gszhywbmvalue'},
        ]
        
        if(stepcode && stepcode=='ywbmsp'){
            let arr1 = [
                {title: '是否同意下发', dataIndex: 'sftyxf', key: 'sftyxf',
                render: (text, record) => {
                    let widget= {
                        "widget_type": "select",
                        "widget_name": "sftyxf",
                        "default_value_name":"sftyxf",
                        "load_template":[
                            {"value":'是',"label":'是'},
                            {"value":'否',"label":'否'},
                        ]
                    }
                    if(this.state.accessCreator!=vp.cookie.getTkInfo('userid') && !this.state.isStepOver){
                        return (
                            <EditTableCol value={text||'是'} record={record} id="role" widget={widget} />
                            )
                    }else{
                        return text;
                    }
                }
            },
            {title: '是否同意所有分行下发', dataIndex: 'sftysyfhxf', key: 'sftysyfhxf',
                render: (text, record) => {
                    let widget= {
                        "widget_type": "select",
                        "widget_name": "sftysyfhxf",
                        "default_value_name":"sftysyfhxf",
                        "load_template":[
                            {"value":'是',"label":'是'},
                            {"value":'否',"label":'否'},
                        ]
                    }
                    if(this.state.accessCreator!=vp.cookie.getTkInfo('userid') && !this.state.isStepOver){
                        return (
                            <EditTableCol value={text||'是'} record={record} id="role2" widget={widget} />
                            )
                    }else{
                        return text;
                    }
                }
            }]
            ods_header = ods_header.concat(arr1)
        }else{
            ods_header.push(
                {title: '是否确认', dataIndex: 'sfqr', key: 'sfqr',editable: true,
                render: (text, record) => {
                    let widget= {
                        "widget_type": "select",
                        "widget_name": "sfqr",
                        "default_value_name":"sfqr",
                        "load_template":[
                            {"value":'是',"label":'是'},
                            {"value":'否',"label":'否'},
                        ]
                    }
                    if(this.state.accessCreator!=vp.cookie.getTkInfo('userid') && !this.state.isStepOver){
                        return (
                            <EditTableCol value={text||'是'} record={record} id="role"  widget={widget} />
                            )
                    }else{
                        return text;
                    }
                }
            })
        }

        this.setState({
            ods_header:ods_header
        })
    }

    setODSperson =()=>{
        let _this = this
        let flag = _this.props.stepcode//步骤区分
        if(flag==='ywbmsp'){
            return ;
        }
        vpQuery("{bjyh}/odssjxflc/getOds2DataAPersonByFlowID", {
            piid:this.props.piid,
            flag:flag
        }).then((response) => {
            console.log('setODSperson_',response);
            let initPerson=[]
            let initItem=[]
            if(response.data.length>0){
                let resultUserids = this.state.resultUserids 
                for(let val of response.data) {
                    if(resultUserids.includes(val.iid*1)||this.state.selectedRowKeys.includes(val.iid+'')){

                    }else{
                        initPerson.push(val.iid.toString())
                        initItem.push(val)
                    }
                }
                
                _this.setState({
                    selectItem:[...this.state.selectItem,...initItem],
                    selectedRowKeys:[...initPerson]
                })
            }
        })
    }

    controlAddButton_ods = (numPerPage, resultList) => {
            this.state.odsTableData = resultList;
            console.log('ODSList',resultList);
            
            //计算合并单元格rowSpan
            let rowSpanArray = new Array(resultList.length)
            
            let fristdata = resultList[0]
            let fristdataIdx = 0

            resultList.forEach((item,index,arr)=>{
                if(index===0){
                    rowSpanArray[0]=1
                }else{
                    let assesser = item.assesser
                    if(assesser===fristdata.assesser){//若此条数据等于fristdata
                        rowSpanArray[index] = 0
                        rowSpanArray[fristdataIdx] = rowSpanArray[fristdataIdx]+1
                    }else{
                        fristdata = resultList[index]
                        fristdataIdx = index
                        rowSpanArray[index]=1
                    }
                }
            })

            this.setState({rowSpanArray:rowSpanArray})

    }

    gettitleRender=()=>{
        if(this.state.accessCreator == vp.cookie.getTkInfo('userid') || this.state.isStepOver){
            return
        }
        if(this.props.stepcode==='kjfzersp'){
            return(
            <div id='switch'>
                全部是否确认 ： <VpSwitch defaultChecked={true} onChange={e=>this.switchChange(e,'sfqr')} 
                checkedChildren="是" unCheckedChildren="否" />
            </div>
            )
        }else{
            return(
            <div id='switch'>
                全部是否同意下发 ： <VpSwitch defaultChecked={true} onChange={e=>this.switchChange(e,'sftyxf')} 
                checkedChildren="是" unCheckedChildren="否" />
                &nbsp;&nbsp;&nbsp;全部是否同意所有分行下发 ： <VpSwitch defaultChecked={true} onChange={e=>this.switchChange(e,'sftysyfhxf')} 
                checkedChildren="是" unCheckedChildren="否" />
            </div> 
            )
        }
        
    }

    switchChange=(flag,name)=>{
        let _this = this
        let _odsTableData = _this.state.odsTableData
        switch (flag) {
            case true:
                _odsTableData.map(item=>{
                    item[name] = '是'
                })
                _this.setState({odsTableData:_odsTableData})
                break;
        
            case false:
                _odsTableData.map(item=>{
                    item[name] = '否'
                })
                _this.setState({odsTableData:_odsTableData})
                break;
        }

    }

    render() {
        return (
            <div className="full-height p-sm bg-white pr requirement">
                <div id='accessList'>
                    {this.state.accessCreator == vp.cookie.getTkInfo('userid') && !this.state.isStepOver?
                    <VpCol span={24} className="text-right">
                            <VpButton type="primary" className="vp-btn-br" onClick={this.addPerson} className="m-l-xs">
                                添加评审人
                            </VpButton>

                            <VpButton type="primary" className="vp-btn-br" onClick={this.sendAccess} className="m-l-xs">
                                下发评审
                            </VpButton>
                    </VpCol>
                    :null
                    }
                    <CustomEditTable updateStatus={this.updateStatus} toProblemInfo={this.toProblemInfo}
                                    {...this.props} {...this.state} type={"edit"} 
                        onRef={this.testChild} parent={this}
                    />
                </div>
                
                <div id='odsData'>
                    <VpDTable
                        queryMethod="POST"
                        ref={table => this.odsTableRef = table}
                        controlAddButton={
                            (numPerPage, resultList) => {
                                this.controlAddButton_ods(numPerPage, resultList)
                            }
                        }
                        dataUrl={'/{bjyh}/odssjxflc/getChild2DataByFlowId'}
                        params={{
                            piid:this.props.piid,
                            taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId,
                            stepcode:this.props.stepcode,//区分取数据方法
                            auth:this.state.accessCreator==vp.cookie.getTkInfo('userid')?true:false,
                        }}
                        title={this.gettitleRender}
                        pagination={false}
                        className="odsTable"
                        expandIconColumnIndex={0}
                        columns={this.state.ods_header}
                        bindThis={this}
                        rowKey={"key"}
                        showTotal={false}
                        resize
                        //scroll={{ y: this.state.tableHeight }}
                    />

                </div>

                {this.state.accessCreator != vp.cookie.getTkInfo('userid')&&!this.state.isStepOver?               
                <div>

                    <div className='ant-row ant-form-item'>
                        <VpCol span="3" className='ant-form-item-label'>
                            <label>评审结论</label>
                        </VpCol>
                        <VpCol span="8" className='ant-form-item-control' >
                            <VpRadioGroup defaultValue={this.state.accesserData.results+''} 
                                            onChange={e=>this.accessRadioChange(e,'results')} 
                                            value={this.state.accesserData.results+''}>
                                    <VpRadio key='results1' value='1'>通过</VpRadio>
                                    <VpRadio key='results3' value='3'>有条件通过</VpRadio>
                                    <VpRadio key='results2' value='2'>不通过</VpRadio>
                            </VpRadioGroup>
                        </VpCol>
                    </div>

                    <div className='ant-row ant-form-item'>    
                        <VpCol span="3" className='ant-form-item-label'>
                            <label>评审意见</label>
                        </VpCol>
                        <VpCol span="21" className='ant-form-item-control' >
                            <VpInput type='textarea' rows={4} maxLength={2000}
                                        value={this.state.accesserData.advice||''} 
                                        onChange={this.accessInputChange}>
                            </VpInput>
                        </VpCol>
                    </div>
                </div>    
                :null
                }

                <VpModal
                        title="添加评审人员"
                        width="60%"
                        visible={this.state.split_user}
                        onOk={this.splitUserOk}
                        onCancel={this.handleUserCancel}
                        footer={
                            <div className="text-center">
                                <VpButton type="primary" onClick={this.splitUserOk}>确定</VpButton>
                                <VpButton type="ghost" onClick={this.handleUserCancel}>取消</VpButton>
                            </div>
                        }>
                        {this.getUserContent()}
                </VpModal>

                <RightBox
                    max={false}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}  closeModal={this.closeRightModal}>
                    {this.state.showRightBox ? this._renderRightBoxBody() : null}
                </RightBox>
            </div>
        )
    }
}
T = EntityList.createClass(T); 
export default T;