import React, { Component } from "react";

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg,VpConfirm} from "vpreact";
import { validationRequireField ,common } from '../code';
import moment from "moment";

//上线申请
class  kjcxForm extends DynamicForm.Component{
    constructor(props){
        super(props);
        moment.locale('zh_cn');
        console.log('moment',moment().format('YYYYMMDD'));
        console.log('kjcxForm',this);
    }

    //保存前
    onBeforeSave(formData,btnName){ 
        let _this=this;
        let ixmyjzq =  _this.props.form.getFieldsValue(['ixmyjzq']);
        let sbcjtnx =  _this.props.form.getFieldsValue(['sbcjtnx']);
        console.log("ixmyjzq",ixmyjzq.ixmyjzq);
        console.log("ixmyjzq",sbcjtnx.sbcjtnx);
        if(ixmyjzq.ixmyjzq=="3"&&(sbcjtnx.sbcjtnx==""||sbcjtnx.sbcjtnx==undefined)){
            VpAlertMsg({
                message:"消息提示",
                description: "请填写‘补充具体年限’",
                type:"error",
                onClose:this.onClose,
                closeText:"关闭",
                showIcon: true
            }, 5) ;
            return false;
        }
       
    }
   
    //自定义控件行为
    onDataLoadSuccess = formData => {
        //默认带出当前登录人
        let _this=this;
        // //是否通过1
        // let iywyzsftg11=formData.findWidgetByName('iywyzsftg');
        // iywyzsftg11.field.props.label="是否通过";
        let ixmyjzq = formData.findWidgetByName('ixmyjzq')
        ixmyjzq.field.fieldProps.onChange = function (v) { 
            console.log("TEST 监听！ixmyjzq",v); 
            if(v=="3"){
                formData.findWidgetByName('sbcjtnx').field.props.disabled=false; 
            }else{      
                formData.findWidgetByName('sbcjtnx').field.props.disabled=true;
            }
        } 
        // 申请时间 默认为当前时间
        let dsqsj = formData.findWidgetByName('dsqsj')
        // console.log("dsqsj",dsqsj.field.fieldProps.initialValue);
        if (dsqsj.field.fieldProps.initialValue=="") {
            _this.props.form.setFieldsValue({
                'dsqsj': common.currentDate
            })
        }
    }

}
kjcxForm=DynamicForm.createClass(kjcxForm);
export default kjcxForm;