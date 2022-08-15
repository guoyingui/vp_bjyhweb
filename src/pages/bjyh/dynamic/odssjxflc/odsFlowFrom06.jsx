import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';

import {
    formDataToWidgetProps
} from '../../../templates/dynamic/Form/Widgets';
import {validationRequireField, singleInputFill,xmsqHiddenColumn  } from '../code';
import {findFiledByName} from 'utils/utils';

class odsFlowFrom06 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    onBeforeSave = (_formData,_btnName)=>{
        singleInputFill(_formData, _btnName, 'zhjkrhzpsyj', true)
    }   

}
odsFlowFrom06 = FlowForm.createClass(odsFlowFrom06);
export default odsFlowFrom06;