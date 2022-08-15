/*
 * @Author: SL.
 * @Date: 2020-05-25 15:29:34
 * @LastEditTime: 2020-07-14 11:38:56
 * @LastEditors: Please set LastEditors
 * @Description: A类项目评审定制
 * @FilePath: \bjyhweb\src\pages\bjyh\dynamic\A_TypeProjectFlow\A_TypeAssessFlowForm.jsx
 */ 
import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import accessFlowForm from "../flowAccess/accessFlowForm";

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';

import {findFiledByName} from 'utils/utils';
/**
 * A类项目评审
 */
class A_TypeAssessFlowForm extends accessFlowForm.Component {
    constructor(props) {
        super(props);
        this.state.addtype=4
        this.state.accessType = 'normal'
    }

    //请求完assessList后
    onGetListSuccess(obj){
        if(this.props.assessid){
            return
        }

        let _this = this
        console.log('onGetListSuccess',obj)
        let canAcross = true
        if(obj.resultList.length===0){
            canAcross = false
        }
        obj.resultList.map(item=>{
            if(item.p_iid == -1 && ((item.results==2 ||item.status==1))){
                canAcross=false
            }
            // if(item.results==2 ||item.status==1){
            // }
        })

        const eobj = {target:{value:''}}
        let scondition = _this.state.formData.findWidgetByName('scondition');
        if(!canAcross){
            _this.props.form.setFieldsValue({scondition:'SYSZD'})
            eobj.target.value = 'SYSZD'
            _this.handleCondition(eobj)
            scondition.field.props.options_.map(item=>{
                if(item.value!=='SYSZD'){
                    item.disabled = true
                }
            })
        }
    }

    //底部按钮设置
    getCustomeButtons(){
        let buttons = this.props.buttons; 
          
        if(!buttons){
            //如果没有自定义按钮，用默认的
            buttons = [];
            if(this.props.staskid){
                if(this.isCreator()){
                    buttons.push({name: "ok",
                    text: "结束评审",
                    validate: true,
                    handler: this.handleSubmit,
                    className: "m-r-xs vp-btn-br",
                    type: "primary",
                    size: "default"})
                }else{
                    buttons.push({name: "ok",
                    text: "提交",
                    validate: true,
                    handler: this.handleSubmit,
                    className: "m-r-xs vp-btn-br",
                    type: "primary",
                    size: "default"})
                }
                buttons.push("save");
                if(this.props.ijump){
                    //自由跳转
                    buttons.push("jump");
                }
                if(!this.isCreator() &&
                    this.state.assesserData.p_assesser == '-1'){
                    buttons.push({
                        name: "modify",
                        text: "指定评审人",
                        validate: false,
                        // handler: this.state.subflag?this.modifyUser:null,
                        // className: `vp-btn-br ${this.state.subflag?'':'disabled'}`,
                        handler:this.modifyUser,
                        className: `vp-btn-br`,
                        size: "default"
                    });
                }
            }
            buttons.push("cancel");
        }
        return buttons;
    }
    
    //右上角弹框提示
    alertMsg=(desc,type,message)=>{
        return(
            VpAlertMsg({
                message: message||"消息提示",
                description: desc||'!',
                type: type||'info',
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        )
    }

   

}
A_TypeAssessFlowForm = FlowForm.createClass(A_TypeAssessFlowForm);
export default A_TypeAssessFlowForm;