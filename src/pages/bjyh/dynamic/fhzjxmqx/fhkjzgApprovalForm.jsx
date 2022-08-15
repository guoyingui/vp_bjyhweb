import React, { Component } from "react"
import {
    vpQuery,
} from 'vpreact'

import {common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

//分行自建项目取消--流程--分行主管科技行领导审批
class fhkjzgApprovalForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        let _this = this
        return new Promise(resolve => {
            vpQuery('/{bjyh}/fhzjxmqx/getDesignatedNodePer',{ sname: fhzjxmsq.lcbzbm_xmjlcs, entityId: _this.props.iobjectid
            }).then((response) => {
                if (response.data.length > 0) {
                    // 自动获取该项目的项目经理和开发负责人
                    for (let i = 0; i < data.handlers.length; i++) {
                        if (data.handlers[i].flag != 'SYSB') {
                            data.handlers[i].ids = response.data[0].userid
                            data.handlers[i].names = response.data[0].username
                        }
                    }
                }
                resolve(data)
            })
        })
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value == "SYSB" ? true : false
        validationRequireField(_this, 'sfhkjldqxyj', scondition)
    }

    /**
     * 表单提交前
     * @param formData
     * @returns {Promise<any>}
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'sfhkjldqxyj', true)
    }
}
fhkjzgApprovalForm = FlowForm.createClass(fhkjzgApprovalForm)
export default fhkjzgApprovalForm
