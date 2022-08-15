import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";


//分行APP上线申请 执行人执行
class zxrzx extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("zxrzx");
    }
    onGetFormDataSuccess(data) {
        let _this = this
        console.log("data", data)
        console.log("data", data.handlers.length)
         
        var rsxsqr = findWidgetByName.call(data.form,'rsxsqr')
        console.log("rsxsqr",rsxsqr);
        
        console.log("rsxsqr",rsxsqr.field.widget.default_value); 
        console.log("rsxsqr",rsxsqr.field.widget.default_label); 
        // 业务验证人验证：需求提出人 而  上线申请人-根据项目名称自动带出“需求提出人”
        data.handlers[0].ids = rsxsqr.field.widget.default_value
        data.handlers[0].names = rsxsqr.field.widget.default_label
        
    }

     
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'szxrzxjgms', true)
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
    }


}

zxrzx = FlowForm.createClass(zxrzx);
export default zxrzx;