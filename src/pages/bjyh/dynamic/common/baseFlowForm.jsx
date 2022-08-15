import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd
} from 'vpreact';

import {
    registerWidgetPropsTransform,
    registerWidget,
    getCommonWidgetPropsFromFormData
} from '../../../templates/dynamic/Form/Widgets';


/**
 * 此页面为每个流程的公共模板页面
 */
class baseFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("this.props:",this.props)
    }

    

}
baseFlowForm = FlowForm.createClass(baseFlowForm);
export default baseFlowForm;