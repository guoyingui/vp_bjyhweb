import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { VpSearchInput } from 'vpbusiness';

import {
    VpButton,VpModal,VpTag,VpRow,VpCol,VpTable,vpAdd,vpQuery,VpAlertMsg 
} from 'vpreact';

import {
    registerWidgetPropsTransform,
    registerWidget,
    getCommonWidgetPropsFromFormData
} from '../../../templates/dynamic/Form/Widgets';

class accessFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state={
            ...this.state,
            split_user:false,
            table_userHeaders:[],//选择用户表头
            searchStr: "",//快速搜索
            selectItem: [],//已选择的评审人
            entity_data_url:'/{vpplat}/vfrm/entity/dynamicListData',
            accessCreator:'',
            select_type:'radio',
            assesserData:{tcount:0}
        }
    }
    
    componentWillMount() {
        super.componentWillMount()
        this.getStepInfo()
        this.getUserHeader()
    }

    onGetListSuccess(obj){
        
    }

    /* onDataLoadSuccess = (formData,handlers) => {
        let rpsry = formData.findWidgetByName('rpsry');
        if(rpsry){
            let psryids = rpsry.field.fieldProps.initialValue
            let param = {
                idList:psryids,
                piid:this.props.piid,
                taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId
            }

            vpAdd("/{bjyh}/flowAccess/addAssesser", {
                param:JSON.stringify(param)
            }).then((response) => {
                accessThis.object.child.tableRef.getTableData()//刷新子页面
            })
        }
    } */

    getStepInfo(){
        vpAdd("{bjyh}/customFlowConf/getStepInfo", {
            piid:this.props.piid,
            taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId
        }).then((response) => {            
            const setObj = {'accessCreator':response.data.assignee_}
            if(response.data.end_time_){  
                setObj.isStepOver=true
            }
            this.setState(setObj);  
        })
            this.getAssessInfo()
    }

    getAssessInfo(){
        vpAdd("/{bjyh}/flowAccess/assesslist", {
            piid:this.props.piid,
            taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId,
            assessid:this.props.assessid
        }).then((response) => {            
            let resultList = response.data.resultList
            let subflag = true
            let assesserData ={}
            resultList.map((item,i)=>{
                if(item.iid == this.props.assessid){
                //此时已莺飞草长，爱的人正在路上 我知他风雨兼程，途径日暮不赏
                    assesserData = item
                    if(item.status==1){
                        //subflag = false
                    }
                }
            })
            
            //其他操作
            this.onGetListSuccess({
                assesserData:assesserData,
                resultList:resultList,
                subflag:subflag
            }) 

            this.setState({
                assesserData:assesserData,
                resultList:resultList,
                subflag:subflag},
                ()=>{this.getButtons()}) 
        })
    }

    //底部按钮设置
    getCustomeButtons(){
        let buttons = this.props.buttons; 
          
        if(!buttons){
            //如果没有自定义按钮，用默认的
            buttons = [];
            if(this.props.staskid){
                if(this.isCreator()){
                    buttons.push({name: "ok",
                    text: "结束评审",
                    validate: true,
                    handler: this.handleSubmit,
                    className: "m-r-xs vp-btn-br",
                    type: "primary",
                    size: "default"})
                }else{
                    buttons.push({name: "ok",
                    text: "提交",
                    validate: true,
                    handler: this.handleSubmit,
                    className: "m-r-xs vp-btn-br",
                    type: "primary",
                    size: "default"})
                }
                buttons.push("save");
                if(this.props.ijump){
                    //自由跳转
                    buttons.push("jump");
                }
                if(!this.isCreator()){
                    buttons.push({
                        name: "modify",
                        text: "指定评审人",
                        validate: false,
                        handler:this.modifyUser,
                        className: `vp-btn-br`,
                        size: "default"
                    });
                }
            }
            buttons.push("cancel");
        }
        return buttons;
    }

    modifyUser=(values,_this2)=>{
        this.setState({split_user:true})
        _this2.setFormSubmiting(false);
        ////this.props.refreshList && this.props.refreshList();
        //_this2.cancelModal && _this2.cancelModal();
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
            if(this.state.select_type==='radio'){
                comments = []
            }
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
        this.setState({
            selectItem:this.state.selectItem.concat(selectedRows)
        });
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
        this.setState({ selectUserItem: [], selectedUserRowKeys: [] })
        this.setState({ split_user: false });
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
            type:this.state.select_type
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

    splitUserOk =()=>{
        //console.log('splitUserOk ',this.state);
        let _this = this;
        let accessThis = this.getChildPoint();
        const resultUserids = accessThis.object.state.resultUserids
        let accesspersonids=[]
        this.state.selectItem.map((item, i) => {
            if(vp.cookie.getTkInfo('userid')==item.iid){
    
            }else{
                accesspersonids.push(item.iid);
            }
            //accesspersonids.push(item.iid);
        })
        this.setState({ split_user: false });
        if(accesspersonids.length>0){
            let param = {
                idlist:accesspersonids,
                taskid:_this.props.taskid||_this.props.staskid||_this.props.formData.curtask.taskId
                ||_this.bindThis.props.taskid||_this.bindThis.props.staskid||_this.bindThis.props.formData.curtask.taskId,// 父页面不同于子页面
                piid:_this.props.piid||_this.bindThis.props.taskid,
                p_assesser:accessThis.object.state.accesserData.p_assesser,
                assessid:accessThis.object.state.accesserData.iid
            }

            vpAdd("/{bjyh}/flowAccess/addAssesser", {
                param:JSON.stringify(param),
                addtype:this.state.addtype||'4'
            }).then((response) => {
                VpAlertMsg({
                    message: "消息提示",
                    description: '操作成功！',
                    type: "info",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 3)
                
                /* accessThis.object.child.tableRef.getTableData()//刷新子页面
                let buttons = this.state.newButtons
                buttons[0].className = buttons[0].className+' disabled'
                buttons[0].handler=null
                buttons[1].className = buttons[0].className+' disabled'
                buttons[1].handler=null
                buttons[2].className = buttons[2].className+' disabled'
                buttons[2].handler=null
                this.setState({newButtons:buttons}) */
                this.cancelModal()
            }) 
        }else{
            VpAlertMsg({
                message: "消息提示",
                description: '重复添加！',
                type: "warning",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        }
    }

    getChildPoint = () =>{
        if(this.subFormList){
            if(this.subFormList.length>1){
                this.subFormList.map=item=>{
                    if(item.fieldName==='sassess'){
                        return item
                    }else{
                        return null
                    }
                }
            }else{
                return this.subFormList[0]
            }
        }else{
            return null
        }
    }

    isCreator=()=>{
        if(this.props.assessid){
            return false
        }else{
            return this.state.accessCreator==vp.cookie.getTkInfo('userid') 
        }
    }


    render(){
        return (
            <div className="full-height">
                {super.render()}
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
            </div>
        )
    }

}
accessFlowForm = FlowForm.createClass(accessFlowForm);
export default accessFlowForm;