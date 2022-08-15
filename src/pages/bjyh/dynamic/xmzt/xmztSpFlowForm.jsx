import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import { common, validationRequireField, singleInputFill } from '../code';


//项目暂停审批节点
class  xmztSpFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log('xmztSpFlowForm',this);
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {

        let _this = this
        // 审批意见
        let spyjValue = ''
        return new Promise(resolve => {
            this.getThisRole((res) => {
                if (res != null && res.length != 0) {
                    // 开发负责人与项目经理是不是同一人 需要
                    if (res.length != 2) {
                        //收缩节点 意见订制
                        spyjValue = formData.findWidgetByName(res[0].rolename == "项目经理" ? 'skffzrqr' : 'spmqr')
                        spyjValue.field.props.disabled = true
                        formData.groups[spyjValue.groupIndex].group_type = 2
                    }
                }
                resolve(formData)
            })
        })
    }

    /**
     * 获取当前登录人在该项目中的角色
     * @param callback
     */
    getThisRole(callback) {
        let _this = this
        let userid=vp.cookie.getTkInfo('userid');
        vpQuery('/{bjyh}/xmqx/queryDesignatedRoleByProjectId',{tableName:"BOBJ_PROJECT_SUSPEND_EXT", projectid: _this.props.iobjectid
        }).then((response) => {
            console.log("response",response);
            console.log("response.data.length",response.data.length);
            if (response.data.length > 0) {
                let thisrole = response.data.filter(v => v.iuserid == userid)
                callback(thisrole)
            }
            callback(null)
        })
    }

    /**
     * 提交保存之前进行审批意见赋值
     * @param formData
     * @param btnName
     */
    onBeforeSave (formData, btnName) {
        let _this=this;
        if (btnName == 'ok') {
            return new Promise(resolve => {
                this.getThisRole((res) => {
                    if (res != null) {
                        // 开发负责人与项目经理是同一人
                        if (res.length == 2) {
                            singleInputFill(formData, btnName, 'spmqr', true)
                            singleInputFill(formData, btnName, 'skffzrqr', false)
                            resolve(formData)
                        } else {
                            singleInputFill(formData, btnName, res[0].rolename == "项目经理" ? 'spmqr' : 'skffzrqr', true)
                            resolve(formData)
                        }
                        resolve(formData)
                    } else {
                        resolve(formData)
                    }
                })
            })
        }
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value
        let flag = e.target.value == 'SYSB' ? true : false
        //skffzryj sxmjlyj
            this.getThisRole((res) => {
                if (res != null) {
                    // 开发负责人与项目经理是同一人
                    if (res.length == 2) {
                        validationRequireField(_this, 'spmqr', flag)
                        validationRequireField(_this, 'skffzrqr', flag)
                    } else {
                        validationRequireField(_this, res[0].rolename == "项目经理" ? 'spmqr' : 'skffzrqr', flag)
                    }
                }
            })
    }

    /**
     * 校验当前审批人意见
     * @param fieldProp
     */
    validationRequireField = (fieldProp,flag) => {
        let _this = this
        _this.props.form.resetFields(['sdescription'])
        let rules = _this.state.formData.findWidgetByName(fieldProp).field.fieldProps.rules
        rules[1] = {required: flag, message: "请填写拒绝意见！"}
        _this.props.form.validateFields([fieldProp], {force: true})
    }
}

xmztSpFlowForm=FlowForm.createClass(xmztSpFlowForm);
export default xmztSpFlowForm;