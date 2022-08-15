import React, { Component } from "react"
import {common, fhzjxmsq, validationRequireField, singleInputMonitor, singleInputFill} from '../code';

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

//ODS数据下发流程--流程--分行主管科技领导审批
class fhzgkjldFlowApproveForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    onDataLoadSuccess = formData => {
        let _this = this
        console.log('_this', _this)
        console.log('formData', formData)
    }
    /**
     * 监听单选框
     * @param ek
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSB' ? true : false
        validationRequireField(_this,  'sfhldyj', flag)
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     */
    onBeforeSave = (formData, btnName) => {
        console.log('formData', formData)
        singleInputFill(formData, btnName, 'sfhldyj', true)
    }
}

fhzgkjldFlowApproveForm = FlowForm.createClass(fhzgkjldFlowApproveForm)
export default fhzgkjldFlowApproveForm
