import React, { Component } from "react"
import {common, fhzjxmsq, validationRequireField, singleInputMonitor, singleInputFill} from '../code';

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {findWidgetByName} from '../../../templates/dynamic/Form/Widgets'
import accessFlowForm from "../flowAccess/accessFlowForm";

//ODS数据下发流程--流程--总行科技系统负责人审批
class zhkjxtfzrFlowApproveForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单加载前，重写单选及流程处理人
     * @param data
     */
    onGetFormDataSuccess = data => {
        let sconditionField = findWidgetByName.call(data.form,"scondition") ;
        let szjbmspField = findWidgetByName.call(data.form,'szjjs');
        console.log('szjbmspField',szjbmspField)
        if(sconditionField && szjbmspField){
            // 隐藏的按钮的value值
            let option = szjbmspField.field.widget.default_value == 0 ? 'SYSG' : 'SYSF'
            // 默认单选选中
            let defaultOption = szjbmspField.field.widget.default_value == 0 ? 'SYSF' : 'SYSG'
            // 获取全部单选按钮
            let options =  sconditionField.field.widget.load_template
            // 隐藏指定单选按钮
            let newOptions = options.filter(v => v.value != option);
            data.scondition = defaultOption;
            sconditionField.field.widget.default_value = defaultOption;
            sconditionField.field.widget.load_template = newOptions;
        }
    }

    /**
     * 监听单选框
     * @param ek
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSH' ? true : false
        validationRequireField(_this, 'sdescription', flag)
    }

    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'sdescription', false)
    }

}

zhkjxtfzrFlowApproveForm = FlowForm.createClass(zhkjxtfzrFlowApproveForm)
export default zhkjxtfzrFlowApproveForm
