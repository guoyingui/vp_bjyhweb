import React, { Component } from "react"
import {common, fhzjxmsq, validationRequireField, singleInputMonitor, singleInputFill} from '../code';

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {findWidgetByName} from '../../../templates/dynamic/Form/Widgets'
import accessFlowForm from "../flowAccess/accessFlowForm";

//ODS数据下发流程--流程--总行科技系统负责人审批
class zhjkrzzsjgsywbmFlowReviewForm extends accessFlowForm.Component {

    constructor(props) {
        super(props)
        //ods指定评审人后将自己改为已转发状态
        this.state={
            ...this.state,
            addtype:'4'
        }
    }

    /**
     * 监听单选框
     * @param ek
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSJ' ? true : false
        validationRequireField(_this, 'sdescription', flag)
    }

    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'sdescription', false)
    }

    //底部按钮设置
    getCustomeButtons(){
        let buttons = this.props.buttons; 
          
        if(!buttons){
            //如果没有自定义按钮，用默认的
            buttons = [];
            if(this.props.staskid){
                if(this.state.subflag||this.state.accessCreator == vp.cookie.getTkInfo('userid')){
                    buttons.push("ok")
                }else{
                    buttons.push({name: "ok",
                    text: "提交",
                    validate: true,
                    handler: null,
                    className: "m-r-xs vp-btn-br disabled",
                    type: "primary",
                    size: "default"})
                }
                buttons.push("save");
                if(this.props.ijump){
                    //自由跳转
                    buttons.push("jump");
                }
                if(this.state.accessCreator != vp.cookie.getTkInfo('userid')){
                    buttons.push({
                        name: "modify",
                        text: "指定评审人",
                        validate: false,
                        handler: this.state.subflag?this.modifyUser:null,
                        className: `vp-btn-br ${this.state.subflag?'':'disabled'}`,
                        size: "default"
                    });
                }
            }
            buttons.push("cancel");
        }
        return buttons;
    }
}

zhjkrzzsjgsywbmFlowReviewForm = FlowForm.createClass(zhjkrzzsjgsywbmFlowReviewForm)
export default zhjkrzzsjgsywbmFlowReviewForm
