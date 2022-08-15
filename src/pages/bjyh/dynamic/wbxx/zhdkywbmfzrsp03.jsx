import React, {
    Component
} from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery,
    vpAdd,
    VpAlertMsg
} from 'vpreact';
import { validationRequireField, singleInputFill } from '../code';

//总行对口业务部门负责人审批
class zhdkywbmfzrsp03 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData, _handlers) => {
        let _this = this;
        //分支判断
        const rywbldsp = formData.findWidgetByName('rywbldsp');
        const scondition = formData.findWidgetByName('scondition');
        
        if(scondition && 'SYSN,SYSF'.includes(scondition.field.fieldProps.initialValue)){
            let flag = 'SYSN,SYSF'.includes(scondition.field.fieldProps.initialValue) ? true : false
            rywbldsp.field.hidden = flag
            !flag ? rywbldsp.field.fieldProps.rules = [{
                required: true, message: "内容不能为空。"
            }] : rywbldsp.field.fieldProps.rules[0].required = flag

        }
    }

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = 'SYSN,SYSF'.includes(e.target.value) ? true : false
        validationRequireField(_this, 'szhlxrsp', flag)
        const {formData} = _this.state
        const rywbldsp = formData.findWidgetByName('rywbldsp');
        
        rywbldsp.field.hidden = flag
        !flag ? rywbldsp.field.fieldProps.rules = [{
            required: true, message: "内容不能为空。"
        }] : rywbldsp.field.fieldProps.rules[0].required = !flag
        validationRequireField(_this, 'rywbldsp', !flag)
    }

    onBeforeSave(formData, btnName) {
        singleInputFill(formData, btnName, 'szhlxrsp', true)
    }

}

zhdkywbmfzrsp03 = FlowForm.createClass(zhdkywbmfzrsp03);
export default zhdkywbmfzrsp03;