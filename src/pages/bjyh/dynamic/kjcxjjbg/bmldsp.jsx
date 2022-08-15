import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";
import {findFiledByName} from 'utils/utils';


//科技创新基金 部门领导审批
class bmldsp extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("bmldsp");
    }


    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        // if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'sbmldspyj', true)
        // }
    }

     handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        // console.log("e",e);
        // let flag = e.target.value == 'SYSB' ? true : false
        if(e.target.value == 'SYSB'){
            validationRequireField(_this, 'sbmldspyj', true)
        } else{
            validationRequireField(_this, 'sbmldspyj', false)
           
        }
        
    }
 
}

bmldsp = FlowForm.createClass(bmldsp);
export default bmldsp;