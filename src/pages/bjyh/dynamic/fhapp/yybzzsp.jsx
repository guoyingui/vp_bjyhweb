import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";


//分行APP上线申请 运营部组长审批
class yybzzsp extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("yybzzsp");
    }
    onGetFormDataSuccess(data) {
        let _this = this
        console.log("data", data)
        console.log("data", data.handlers.length)
         
    }

     
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'syybzzspyj', true)
        }
    }
     /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value
        console.log("scondition",scondition)
        console.log("_this",_this)
        if(scondition=="SYSRQ"){
            //拒绝：设置【是否直接到运营部】=1
            // 是否直接到运营部 ssfzjdyyb 
            _this.props.form.setFieldsValue({
                'ssfzjdyyb':"1"
            })
        }
        let flag = e.target.value == 'SYSRQ' ? true : false
        validationRequireField(_this, 'syybzzspyj', flag)
    }


}

yybzzsp = FlowForm.createClass(yybzzsp);
export default yybzzsp;