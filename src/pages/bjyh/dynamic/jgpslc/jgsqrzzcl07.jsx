/*
 * @author: SL.
 */
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

//结束预审
class jgsqrzzcl07 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData, _handlers) => {
        let _this = this;

    }

    onBeforeSave(formData, btnName) {
        let sparam = JSON.parse(formData.sparam);
        let scondition = sparam.scondition
        if(btnName == "ok"){
            if(scondition === 'SYSF'){
                sparam.sjumpflag02 = 'SYSG'
            }
        }
        formData.sparam=JSON.stringify(sparam)
        singleInputFill(formData, btnName, 'sjgszzqrclyj', true)
    }
    //sjgszzqrclyj
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSF' ? true : false
        validationRequireField(_this, 'sjgszzqrclyj', flag)
    }

}
jgsqrzzcl07 = FlowForm.createClass(jgsqrzzcl07);
export default jgsqrzzcl07;