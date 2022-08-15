import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import {vpQuery, vpAdd, VpAlertMsg} from 'vpreact';
import {registerWidgetPropsTransform,registerWidget,getCommonWidgetPropsFromFormData} from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'
import {common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';

// 新增系统流程架构管理办公室节点
class bgxt05FlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("bgxt05FlowForm");
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value == "SYSD" ? true : false
        validationRequireField(_this, 'sxkbldshyj', scondition)
    }

    /**
     * 表单提交前
     * @param formData
     * @returns {Promise<any>}
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'sxkbldshyj', true)
    }
}

bgxt05FlowForm = FlowForm.createClass(bgxt05FlowForm);
export default bgxt05FlowForm;