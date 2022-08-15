import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";


//分行APP上线申请 京智办公开发负责人审批节点
class jzbgkffzr extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("jzbgkffzr");
    }
    onGetFormDataSuccess(data) {
        let _this = this
        console.log("data", data)
        console.log("data", data.handlers.length)


      
        var sjzsfzjdxmjl = findWidgetByName.call(data.form,'sjzsfzjdxmjl')
        console.log("sjzsfzjdxmjl",sjzsfzjdxmjl.field.widget.default_value); 
        //默认屏蔽两个节点
        let scondition = findWidgetByName.call(data.form,'scondition')
        if(scondition){
            scondition.field.widget.load_template.map(item=>{
                    if(sjzsfzjdxmjl.field.widget.default_value==1){
                        item.value=='SYSG'?item.hidden=true:null
                        // item.value=='SYSO'?item.hidden=true:null
                        item.value=='SYSP'?item.hidden=true:null
                        // item.value=='SYSRB'?item.hidden=true:null
                        scondition.field.widget.default_value='SYSO'
                        data.scondition = 'SYSO'
                    }else if(sjzsfzjdxmjl.field.widget.default_value==2){
                        item.value=='SYSG'?item.hidden=true:null
                        item.value=='SYSO'?item.hidden=true:null
                        // item.value=='SYSP'?item.hidden=true:null
                        // item.value=='SYSRB'?item.hidden=true:null
                        scondition.field.widget.default_value='SYSP'
                        data.scondition = 'SYSP'
                    }else{
                        // item.value=='SYSG'?item.hidden=true:null
                        item.value=='SYSO'?item.hidden=true:null
                        item.value=='SYSP'?item.hidden=true:null
                        // item.value=='SYSRB'?item.hidden=true:null
                        scondition.field.widget.default_value='SYSG'
                        data.scondition = 'SYSG'
                    }
                        
            })
        }
         
    }

     
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'skffzrshyj', true)
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
        if(scondition=="SYSRB"){
            //拒绝：设置【是否直接到项目经理】=1
            // 是否直接到项目经理 sywzjdxmjl 
            _this.props.form.setFieldsValue({
                'sywzjdxmjl':"1"
            })
        }
        let flag = e.target.value == 'SYSRB' ? true : false
        validationRequireField(_this, 'skffzrshyj', flag)
    }


}

jzbgkffzr = FlowForm.createClass(jzbgkffzr);
export default jzbgkffzr;