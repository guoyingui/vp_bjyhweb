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
import accessFlowForm from "../flowAccess/accessFlowForm";

//架构管理办公室结束线上架构预审
class jgglbgsJSxsys05 extends accessFlowForm.Component {
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
            if(scondition === 'SYSJ'){
                sparam.sjumpflag02 = 'SYSI'
            }
        }
        formData.sparam=JSON.stringify(sparam)
        singleInputFill(formData, btnName, 'sdescription', true)
    }

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSJ' ? true : false
        validationRequireField(_this, 'sdescription', flag)
    }

}
jgglbgsJSxsys05 = FlowForm.createClass(jgglbgsJSxsys05);
export default jgglbgsJSxsys05;