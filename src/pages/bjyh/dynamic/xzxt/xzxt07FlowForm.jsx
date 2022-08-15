import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import {vpQuery, vpAdd, VpAlertMsg} from 'vpreact';
import {registerWidgetPropsTransform,registerWidget,getCommonWidgetPropsFromFormData} from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'
import {common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';

// 新增系统流程架构管理办公室节点
class xzxt07FlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("xzxt07FlowForm");
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value == "SYSF" ? true : false
        validationRequireField(_this, 'skfbldfsyj', scondition)

        // console.log("e",e);

        // let handlers = _this.state.handlers;

        // if(e.target.value == "SYSF"){
        //     for (let index = 0; index < handlers.length; index++) {
        //         let key = handlers[index].stepkey;
        //         let label = key + '_label';
        //         console.log("label",label);



        //         let keylabel = _this.state.formData.findWidgetByName('sid-CFC333A5-1F1B-4F80-A10C-C8EA54695CD3_label');

        //         console.log("keylabel",keylabel);

        //         if (handlers[index].stepname == "信科部负责人维护新增系统相关信息") {
        //             keylabel.field.hidden = true;
        //         } else if (handlers[index].stepname == "架构管理办公室审核") {
        //             keylabel.field.hidden = false;
        //         }
        //     }
        // }
    }

    /**
     * 表单提交前
     * @param formData
     * @returns {Promise<any>}
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'skfbldfsyj', true);
    }
}

xzxt07FlowForm = FlowForm.createClass(xzxt07FlowForm);
export default xzxt07FlowForm;