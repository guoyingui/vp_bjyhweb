import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { registerWidgetPropsTransform, registerWidget, getCommonWidgetPropsFromFormData } from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'
import { common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';

class xtzz01 extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("xtzz01");
    }

    onDataLoadSuccess = (formData, handlers) => {
        var rxtmc = formData.findWidgetByName("rxtmc");
        let _this = this
        vpQuery('/{bjyh}/xzxt/getsystem_jl', {
            iid: rxtmc.field.fieldProps.initialValue
        }).then((response1) => {
            _this.state.handlers.map(item => {
                console.log('22222', response1);
                let data = response1.data;
                if (item.stepname === '信息科技管理部发起评审') {
                    item.names = data.sname
                    item.ids = data.iid
                    _this.props.form.setFieldsValue({
                        [item.stepkey]: data.iid,
                        [item.stepkey + '_label']: data.sname
                    })
                }
            })
        })
    }
}

xtzz01 = FlowForm.createClass(xtzz01);
export default xtzz01;