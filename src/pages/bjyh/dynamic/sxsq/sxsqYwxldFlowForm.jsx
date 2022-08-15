import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation, validationRequireField,singleInputFill } from '../code';
import moment from "moment";


//项目上线申请流程 业务线领导 审批节点
class  sxsqYwxldFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log("sxsqYwbldFlowForm") ;
        console.log("date",this) ; 
        this.state.moduserprops={
            ismoduser:true,//是否启用更改处理人
         }
    }
    onGetFormDataSuccess = data => {
        let _this = this
        //开发部领导审批：默认<开发负责人提供上线文档>环节预设开发部领导
        let rkfbld = findWidgetByName.call(data.form,'rkfbld')
         
        console.log("rkfbld",rkfbld.field.widget.default_value)
        console.log("rkfbld",rkfbld.field.widget.default_label)

        // 自动获取业务部领导负责人 
        for (var i = 0; i <   data.handlers.length; i++) { 
            console.log( data.handlers[i].flag)
            if(data.handlers[i].flag=="SYST"){
                data.handlers[i].ids = rkfbld.field.widget.default_value+""
                data.handlers[i].names = rkfbld.field.widget.default_label+""
            }
        } 
    }
       
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'sywxldspyj', true)
        }
    }
      //自定义控件行为
  onDataLoadSuccess = formData => {
    let _this=this;
    //是否通过1
    let iywyzsftg11=formData.findWidgetByName('iywyzsftg');
    iywyzsftg11.field.props.label="是否通过";
    //是否返回业务1
    let isffhyw11=formData.findWidgetByName('isffhyw1');
    isffhyw11.field.props.label="是否返回业务";
    //是否与需求符合6
    let ixqfh66=formData.findWidgetByName('ixqfh6');
    ixqfh66.field.props.label="是否与需求符合";
    //是否与需求符合7
    let ixqfh77=formData.findWidgetByName('ixqfh7');
    ixqfh77.field.props.label="是否与需求符合";

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

        let flag = e.target.value == 'SYSU' ? true : false
        validationRequireField(_this, 'sywxldspyj', flag)
    }
}

sxsqYwxldFlowForm=FlowForm.createClass(sxsqYwxldFlowForm);
export default sxsqYwxldFlowForm;