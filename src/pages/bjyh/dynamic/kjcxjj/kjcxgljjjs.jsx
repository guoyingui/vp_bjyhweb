import React, { Component } from "react"; 
import FlowForm from "../../../templates/dynamic/Flow/FlowForm"; 
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code'; 
import accessFlowForm from "../flowAccess/accessFlowForm";

//科技创新基金 科技创新管理基金结束评审
class kjcxgljjjs extends accessFlowForm.Component {
    constructor(props) {
        super(props);
        console.log("kjcxgljjjs");
    }


    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        // if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'sdescription', true)
        // }
    }


    onDataLoadSuccess = (formData,handlers) => {
        let _this=this;
        //是否涉及外部数据 isjwbsh
        let ipsjg=  formData.findWidgetByName('ipsjg');
        //默认屏蔽两个节点
        let scondition = formData.findWidgetByName('scondition')
        ipsjg.field.fieldProps.onChange = function (value) {
            console.log("value:",value.target.value);
            let val = value.target.value
            let eobj = {target:{value:''}}

            switch(val*1){
                case 0:
                    _this.props.form.setFieldsValue({scondition:'SYSG'})
                    eobj.target.value='SYSG'
                    _this.handleCondition(eobj)
                    break
                case 1:
                    _this.props.form.setFieldsValue({scondition:'SYSG'})
                    eobj.target.value='SYSG'
                    _this.handleCondition(eobj)
                    //不通过的按钮也需要填写审批意见
                    validationRequireField(_this, 'sdescription', true)
                    break
                case 2:
                    _this.props.form.setFieldsValue({scondition:'SYSF'})
                    eobj.target.value='SYSF'
                    _this.handleCondition(eobj)
                    break
                }
        }
    }
     handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        console.log("e",e);
        // let flag = e.target.value == 'SYSB' ? true : false
         if(e.target.value == 'SYSF'){
            validationRequireField(_this, 'sdescription', true)
        }else{
            validationRequireField(_this, 'sdescription', false) 
        }
        
    }
 
}

kjcxgljjjs = FlowForm.createClass(kjcxgljjjs);
export default kjcxgljjjs;