import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';


class xmzxhpjFlowForm01 extends FlowForm.Component {
    constructor(props) {
        super(props);

    }
    // 加载成功后执行
    onDataLoadSuccess = (formData,_handlers) => {
        let _this = this;
        let ssjyyxg = formData.findWidgetByName('ssjyyxg');
        ssjyyxg.field.props.placeholder = '项目实际应用效果包括但不限于项目投产后的投资收益、市场反馈、应用效果等，以分析项目的投资效益和建设成果。';
        
    }

}
xmzxhpjFlowForm01 = FlowForm.createClass(xmzxhpjFlowForm01);
export default xmzxhpjFlowForm01;