import React, { Component } from 'react'; //必须引入，因为jsx最终会被编译成React调用函数
import { VpFormCreate, VpForm, VpFInput, VpButton, VpCheckbox, VpFRadio, VpRadio, VpRadioGroup ,VpFCheckbox,vpAdd  } from 'vpreact';

import FlowForm from '../../templates/dynamic/Flow/FlowForm';

class Workflow extends FlowForm.Component {
    constructor(props){
        super(props);
    }

    onGetFormDataSuccess(data){
        if(data && data.handlers && data.handlers.length){
            data.handlers[0].ids = "1";
            data.handlers[0].names = "管理员";
        }
    }
}
Workflow = FlowForm.createClass(Workflow);
export default Workflow;