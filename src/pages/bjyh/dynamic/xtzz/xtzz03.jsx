import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { registerWidgetPropsTransform, registerWidget, getCommonWidgetPropsFromFormData } from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'
import { common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';

class xtzz03 extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("xtzz03");
    }

    onBeforeSave(formData, btnName) {
        let _this = this
        //流程步骤通用定制
        singleInputFill(formData, btnName, 'sdescription', true)
    }


    onDataLoadSuccess = (formData, handlers) => {
        let _this = this;
        //是否涉及外部数据 isjwbsh
        let ipsjg = formData.findWidgetByName('ipsjg');
        //默认屏蔽两个节点
        let scondition = formData.findWidgetByName('scondition')
        ipsjg.field.fieldProps.onChange = function (value) {
            console.log("value:", value.target.value);
            let val = value.target.value
            let eobj = { target: { value: '' } }

            switch (val * 1) {
                case 0:
                    validationRequireField(_this, 'sdescription', false)
                    break
                case 1:
                    validationRequireField(_this, 'sdescription', true)
                    break
            }
        }
    }
}

xtzz03 = FlowForm.createClass(xtzz03);
export default xtzz03;