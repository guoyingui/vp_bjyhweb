import React, { Component } from "react"
import {common, fhzjxmsq, validationRequireField, singleInputMonitor, singleInputFill} from '../code';

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

//分行自建项目申请--流程--分行主管科技领导审批
class fhzgkjldFlowApproveForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSD' ? true : false
        validationRequireField(_this,  'sfhkjldyj', flag)
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     * @return Promise<any> 如果返回false,则不执行保存，不返回或返回其他值都执行保存
     *
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'sfhkjldyj', true)
    }
}

fhzgkjldFlowApproveForm = FlowForm.createClass(fhzgkjldFlowApproveForm)
export default fhzgkjldFlowApproveForm
