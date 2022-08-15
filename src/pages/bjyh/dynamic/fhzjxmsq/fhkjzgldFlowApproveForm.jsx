import React, { Component } from "react"

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {nextStepHandler} from './fhzjxmsq';
import {fhzjxmsq, validationRequireField, singleInputFill} from '../code';

//分行自建项目申请--流程--分行科技主管领导审批
class fhkjzgldFlowApproveForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        return nextStepHandler(data, fhzjxmsq.lcyhz_fhkjld, 'SYSA')
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSB' ? true : false
        validationRequireField(_this,  'sfhkjzgldshyj', flag)
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     * @return Promise<any> 如果返回false,则不执行保存，不返回或返回其他值都执行保存
     *
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'sfhkjzgldshyj', true)
    }
}

fhkjzgldFlowApproveForm = FlowForm.createClass(fhkjzgldFlowApproveForm)
export default fhkjzgldFlowApproveForm
