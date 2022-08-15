import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";


//分行APP上线申请 业务代表节点
class hfzgldsp extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("hfzgldsp");
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
            singleInputFill(formData, btnName, 'sfhzghldspyj', true)
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
        
        let flag = e.target.value == 'SYSRE' ? true : false
        validationRequireField(_this, 'sfhzghldspyj', flag)
    }


}

hfzgldsp = FlowForm.createClass(hfzgldsp);
export default hfzgldsp;