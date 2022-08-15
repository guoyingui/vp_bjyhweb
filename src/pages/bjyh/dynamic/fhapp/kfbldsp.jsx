import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";


//分行APP上线申请 开发部领导审批
class kfbldsp extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("kfbldsp");
    }
    onGetFormDataSuccess(data) {
        let _this = this
        console.log("data", data)
        console.log("data", data.handlers.length)

        var ryybzzsp = findWidgetByName.call(data.form,'ryybzzsp')

        console.log("ryybzzsp", ryybzzsp.field.widget.default_value)
        console.log("ryybzzsp",  ryybzzsp.field.widget.default_label)
        data.handlers.map(item=>{
            console.log("item",item);
            if(item.flag==='SYSJ'){//业务部领导审批 
                if(ryybzzsp.field.widget.default_label!=""){
                    item.names=ryybzzsp.field.widget.default_label
                    item.ids=ryybzzsp.field.widget.default_value
                }else{
                    item.ajaxurl = '/{bjyh}/FhApp/getUser';
                }
                
            }
        })  
    }

     
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'skfbldspyj', true)
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
        if(scondition=="SYSRP"){
            //拒绝：设置【京智是否直接到项目经理】=2
            // 京智是否直接到项目经理 sjzsfzjdxmjl 
            _this.props.form.setFieldsValue({
                'sjzsfzjdxmjl':"2"
            })
        }
        let flag = e.target.value == 'SYSRP' ? true : false
        validationRequireField(_this, 'skfbldspyj', flag)
    }


}

kfbldsp = FlowForm.createClass(kfbldsp);
export default kfbldsp;