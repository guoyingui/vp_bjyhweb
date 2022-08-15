import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import {vpQuery, vpAdd, VpAlertMsg} from 'vpreact';
import {registerWidgetPropsTransform,registerWidget,getCommonWidgetPropsFromFormData} from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'
import {common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';

class kjsx04 extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("kjsx04");
    }

        /**
      * 监听单选框
      * @param e
      */
     handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value == "SYSF" ? true : false
        validationRequireField(_this, 'skfbldspyj', scondition)
    }

    /**
     * 表单提交前
     * @param formData
     * @returns {Promise<any>}
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'skfbldspyj', true)
    }
}

kjsx04 = FlowForm.createClass(kjsx04);
export default kjsx04;