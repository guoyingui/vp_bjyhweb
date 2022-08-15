import React, { Component } from "react"
import {common, validationRequireField} from '../code';

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {
    vpAdd, VpButton, VpModal, vpQuery, VpTable,
} from 'vpreact';
import accessFlowForm from "../flowAccess/accessFlowForm";
import ModUserButton from "../../../templates/dynamic/Flow/ModUserButton";
import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";

//分行自建项目申请--流程--项目经理组织相关部门评审
class xmjlzzxgbmFlowReviewForm extends accessFlowForm.Component {

    constructor(props) {
        super(props)
        this.state={
            ...this.state,
            his_rev: false,  // 历史评审模态框显示隐藏
            now_rev: false,  // 本次变更模态框显示隐藏
            historyReview_table_headers: [],//历史评审表头
            historyReview_data_url: "/{bjyh}/flowAccess/hiAssesslist",
            nowReview_data_url: "/{bjyh}/flowAccess/nowAssesslist",
            historyReview_data: [],
            addtype: 4,
            accessType:'sp',
            resultVal:{
                1:'同意立项',
                2:'不同意立项',
                3:'退回修改文档'
            }
        }
        // this.state.moduserprops={
        //     ismoduser:true,//是否启用更改处理人
        // }
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        let _this = this
        let ipsjg = findWidgetByName.call(data.form,'ipsjg')
        ipsjg.field.widget.default_value = 1    // 默认同意立项
        return new Promise(resolve => {
            let handlers = data.handlers
            if (handlers) {
                for (let i = 0; i < handlers.length; i++) {
                    if (handlers[i].flag == 'SYSI') {
                        handlers[i].ids = common.userid
                        handlers[i].names = common.nickname
                    } else if (handlers[i].flag == 'SYSJ') {
                        vpQuery('/{bjyh}/fhzjxmsq/getIcreatorByFlowEntityId',{ entityId: _this.props.iobjectid
                        }).then((res) => {
                            if (res) {
                                handlers[i].ids = res.data.iid + ""
                                handlers[i].names = res.data.sname
                            }
                            resolve(data)
                        })
                    }
                }
            }
            resolve(data)
        })
    }
    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e, slected_val) {
        super.handleCondition(e)
        let _this = this
        let flag = slected_val != 'SYSI' ? true : false
        validationRequireField(_this,  'sdescription', flag)
    }

    onDataLoadSuccess = formData => {
        let _this = this
        let ipsjg = formData.findWidgetByName('ipsjg')
        // if (ipsjg.field.fieldProps.initialValue != 1) {
        //     validationRequireField(_this,  'sdescription', true)
        // }
        //项目经理结论radio点击事件
        if (ipsjg) {
            ipsjg.field.fieldProps.onChange = e =>{
                let val = e.target.value
                let eobj = {target:{value:''}}
                let selected_val = ''
                switch(val*1){
                    case 1:
                        selected_val = 'SYSI'
                        break
                    case 2:
                        selected_val = 'SYSI'
                        break
                    case 3:
                        selected_val = 'SYSJ'
                        break
                }
                this.props.form.setFieldsValue({scondition: selected_val})
                eobj.target.value = selected_val
                if (val * 1 == 2) {
                    selected_val = 'SYSK'
                }
                this.handleCondition(eobj, selected_val)
            }
        }
    }

    /**
     * 表单提交之后
     * @param formData
     * @param btnName
     * @returns {Promise<any>}
     */
    onSaveSuccess(formData,btnName){
        let _this = this
        if (btnName == 'ok') {
            let ipsjg = _this.props.form.getFieldValue("ipsjg")
            let flag = ipsjg ? ipsjg == 2 ? true : false : false
            if (flag) {
                return new Promise(resolve => {
                    vpAdd('/{bjyh}/fhzjxmsq/updateCommentByCond',{
                        procInstId: _this.props.piid,
                        // procInstId: 'ff1970a9-daaf-11e9-b7e9-7c5cf86def35',
                        // taskId: '5665173b-de7b-11e9-81f3-7c5cf86def35'
                        taskId: _this.props.staskid
                    }).then(res=>{
                        // console.log(res.data ? "流程意见修改成功" : "流程意见修改失败")
                        resolve(true)
                    })
                })
            }
        }
    }




    componentWillMount() {
        super.componentWillMount()
        this.historyReview()
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
                        handler: this.state.subflag?this.modifyUser:null,
                        className: `vp-btn-br ${this.state.subflag?'':'disabled'}`,
                        size: "default"
                    });
                }
            }

            // this.state.moduserprops.ismoduser ? defaultBtns.moduser={
            //     name: 'moduser',
            //     text: '更改处理人',
            //     className: "ghost inline-display m-r-xs vp-btn-br",
            //     type: "ghost",
            //     render(btnItem,_thisform){
            //         let {handler,render,...btnProps} = btnItem;
            //         return <ModUserButton {...btnDefaultProps} btnProps={btnProps} {..._this.state.moduserprops} />
            //     }
            // }:null
            // if(this.state.accessCreator == common.userid){
                buttons.push({
                    name: "historyReviewBnt",
                    text: "历史评审",
                    validate: false,
                    handler: this.historyReviewBnt,
                    className: `vp-btn-br`,
                    size: "default"
                });
            // }
            if(this.state.accessCreator != common.userid){
                buttons.push({
                    name: "nowReviewBnt",
                    text: "本次评审",
                    validate: false,
                    handler: this.nowReviewBnt,
                    className: `vp-btn-br`,
                    size: "default"
                });
            }
            buttons.push("cancel");
        }
        return buttons;
    }

    historyReviewBnt = () => {
        this.setState({his_rev:true})
        this.setFormSubmiting(false)
    }

    nowReviewBnt = () => {
        this.setState({now_rev:true})
        this.setFormSubmiting(false)
    }

    historyReview = () => {
        let _this = this
        let headerNew = [
            { title: '评审人', dataIndex: 'assesserval',key:'assesserval', width: '20px',
                render: (text, record,index) => {
                    //return obj 
                    return record.p_assesser!=-1?'':text          
                }
            },
            { title: '预评审人', dataIndex: 'p_assesserval',key:'p_assesserval', width: '20px',
                render: (text, record,index) => {
                    if(record.p_assesser!=-1){
                        return record.assesserval;
                    }else{
                        return text
                    }
                }
            },
            { title: '状态', dataIndex: 'status',key:'status', width: '20px',
                render: (text, record) => {
                    let statname='';

                    switch (text*1) {
                        case 0:
                            statname='未下发'
                            break;
                        case 1:
                            statname='未反馈';
                            break;
                        case 2:
                            statname='已反馈';
                            break;
                        default:
                            statname='';
                            break;
                    }
                    return statname;
                }
            },
            { title: '操作时间', dataIndex: 'resdate',key:'resdate',type:'date' ,width: '70px',

            },
            { title: '评审结论', dataIndex: 'results',key:'results',width: '60px',
                render: (text, record) => {
                    if(record.status==1){
                        return ""
                    }
                    if(text==1){
                        return "同意立项";
                    }else if(text==2){
                        return "不同意立项";
                    }else if(text==3){
                        return "退回修改文档"
                    }
                }
            },
            { title: '是否召开评审会', dataIndex: 'is_meeting',key:'is_meeting',width: '60px',
                render:  (text, record) => {
                    if(text==1){
                        return "是";
                    }else{
                        return "否";
                    }
                }
            },
            { title: '评审意见', dataIndex: 'advice',key:'advice',width: '150px',
                render: (text, record) => {
                    if(record.status==1){
                        return ""
                    }else{ 
                        return <div style={{  whiteSpace: 'normal' ,display: 'inline-block', wordWrap: 'break-word' }}   title={text}>{text}</div>
                    }
                }
            }
        ];
        _this.setState({historyReview_table_headers: headerNew})
    }
    closeHistoryReview = () => {
        this.setState({ his_rev: false });
        this.setState({ now_rev: false });
    }
    getHistoryReview = () => {
        return (<div className="split-modal-content f14">
            <div className="p-sm" style={{mixHeight:'320px' ,maxHeight: '80%', overflow: 'auto' }}>
                <VpTable
                    className="xmjlzzxgbmps"
                    controlAddButton={
                        (numPerPage, resultList) => {
                            this.controlAddButton_ods(numPerPage, resultList)
                        }
                    }
                    params={{
                        piid:this.props.piid,
                        taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId
                    }}
                    pagination={false}
                    columns={this.state.historyReview_table_headers}
                    dataUrl={this.state.his_rev ? this.state.historyReview_data_url : this.state.nowReview_data_url}

                />
            </div>
        </div>)
    }
    controlAddButton_ods = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length, 'xmjlzzxgbmps')
        console.log(theight);
        
        this.setState({
            tableHeight: theight
        })
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
                    title={(this.state.his_rev ? "历史" : "本次") + "评审"}
                    width="60%"
                    visible={this.state.his_rev || this.state.now_rev}
                    onCancel={this.closeHistoryReview}
                    footer={
                        <div className="text-center">
                            <VpButton type="primary" onClick={this.closeHistoryReview}>关闭</VpButton>
                        </div>
                    }>
                    {this.getHistoryReview()}
                </VpModal>
            </div>
        )
    }
}

xmjlzzxgbmFlowReviewForm = FlowForm.createClass(xmjlzzxgbmFlowReviewForm)
export default xmjlzzxgbmFlowReviewForm
