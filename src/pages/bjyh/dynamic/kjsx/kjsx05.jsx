import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import {vpQuery, vpAdd, VpAlertMsg} from 'vpreact';
import {registerWidgetPropsTransform,registerWidget,getCommonWidgetPropsFromFormData} from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'
import {common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';

class kjsx05 extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("kjsx05");
    }

        /**
      * 监听单选框
      * @param e
      */
     handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value == "SYSF" ? true : false
        validationRequireField(_this, 'syybldspyj', scondition)
    }

    /**
     * 表单提交前
     * @param formData
     * @returns {Promise<any>}
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'syybldspyj', true)
    }
}

kjsx05 = FlowForm.createClass(kjsx05);
export default kjsx05;