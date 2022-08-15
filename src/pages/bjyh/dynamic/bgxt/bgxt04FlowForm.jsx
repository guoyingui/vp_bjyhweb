import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import {vpQuery, vpAdd, VpAlertMsg} from 'vpreact';
import {registerWidgetPropsTransform,registerWidget,getCommonWidgetPropsFromFormData} from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'

// 新增系统流程架构管理办公室节点
class bgxt04FlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("bgxt04FlowForm");
    }
}

bgxt04FlowForm = FlowForm.createClass(bgxt04FlowForm);
export default bgxt04FlowForm;