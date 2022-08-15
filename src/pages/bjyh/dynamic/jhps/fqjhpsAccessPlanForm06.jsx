import React, { Component } from "react";
import { vpQuery,vpAdd,VpMWarning } from 'vpreact';
import accessPlanFlowForm from "../flowAccess/accessPlanFlowForm";
import { fileValidation } from '../code'
import { findFiledByName } from 'utils/utils';

/**
 * 计划评审流程--发起计划评审流程
 */
class fqjhpsAccessPlanForm06 extends accessPlanFlowForm.Component {
    constructor(props) {
        super(props);
    }
    onGetFormDataSuccess = data => {
        let handlers = data.handlers
        let promise = new Promise(resolve => {
            if(!this.props.isHistory) { 
                vpAdd('/{vpplat}/objteam/getObjTeam',{
                    ientityid:this.props.iobjectentityid,
                    iid:this.props.iobjectid
                }).then((res) => {
                    if(res){
                        res.data.data.map(item=>{
                            switch (item.iroleid*1) {
                                case 6://项目经理
                                    handlers.map(element => {
                                        if(element.flag === 'SYSE'){
                                            element.ids = item.iuserid
                                            element.names = item.username
                                        } else if(element.flag === 'SYSQ'){
                                            element.ids=vp.cookie.getTkInfo('userid')
                                            element.names=vp.cookie.getTkInfo('nickname')
                                        } 
                                    })
                                break;
                            }
                        })
                    }
                    resolve(data)
                })
            } else {
                resolve(data)
            }    
        })
        return promise
    }
    //数据加载成功
    onDataLoadSuccess = (formData,handlers) => {
        let _this = this;
        const isHistory = _this.props.isHistory
         //84-5需求5、1）需求分析流程的【发起需求评审】审批节点、项目计划评审流程的【发起计划评审】审批节点、
        // 阶段需求评审流程的【发起需求评审】审批节点、
        // 阶段业务测试用例评审流程的【发起业务测试用例评审】审批节点中的“评审人员”
        // 字段中自动带出项目的“开发负责人”“项目经理”“需求提出人”“测试负责人”四个字段的内容
        let rpsry = formData.findWidgetByName('rpsry');

        return new Promise(resolve => {
            if(!isHistory && !rpsry.field.fieldProps.initialValue) {
                vpQuery('/{bjyh}/xqfx/queryProjectRole',{ iid: _this.props.iobjectid,flag:1
                    }).then((response) => {
                        if(response!=null){
                            _this.props.form.setFieldsValue({
                                'rpsry':response.userids,//id
                                'rpsry_label':response.usernames//显示的汉字
                            })
                            rpsry.field.props.widget.default_value = response.userids
                            rpsry.field.props.widget.default_label = response.usernames
                            rpsry.field.props.initialName = response.usernames
                            rpsry.field.fieldProps.initialValue = response.userids
                            _this.forceUpdate()
                        }
                        resolve(formData)
                    })
            } else {
                resolve(formData)
            }
        })
    }

    //切换审批结果时改变button的名字
    handleCondition(e){
        super.handleCondition(e);
        let scondition = e.target.value
        const buttons =  this.state.newButtons
        buttons.map(item => {
            if(item.name === 'ok'){
                if(scondition !== 'SYSQ'){
                    item.text = '提交'
                }else{
                    item.text = '发起评审'
                }
            }
        })
        this.setState({newButtons:buttons})
    }


}
fqjhpsAccessPlanForm06 = accessPlanFlowForm.createClass(fqjhpsAccessPlanForm06);
export default fqjhpsAccessPlanForm06;