import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';


/**
 * 评审资料准备
 */
class accessPlanFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
    }


    // 加载成功后执行
    onDataLoadSuccess = (formData,_handlers) => {
        let _this = this
        console.log(_this);
        // 附件增加删除功能
        let rfj = formData.findWidgetByName('rfj');
        let arrfile = rfj.field.props.widget.load_template;
        arrfile.map(item=>{
            item.options.delete = true;
        })
    }

    onGetFormDataSuccess = data => {
        let formData = data.form.groups
        let handlers = data.handlers
        handlers.map(item=>{
            item.ids=vp.cookie.getTkInfo('userid')
            item.names=vp.cookie.getTkInfo('nickname')
        })
    }

//底部按钮设置
getCustomeButtons(){
    let buttons = this.props.buttons; 
      
    if(!buttons){
        //如果没有自定义按钮，用默认的
        buttons = [];
        if(this.props.staskid){
            buttons.push({name: "ok",
            text: "发起评审",
            validate: true,
            handler: this.handleSubmit,
            className: "m-r-xs vp-btn-br",
            type: "primary",
            size: "default"})
            
            buttons.push("save");
            if(this.props.ijump){
                //自由跳转
                buttons.push("jump");
            }
        }
        buttons.push("cancel");
    }
    return buttons;
}
}
accessPlanFlowForm = FlowForm.createClass(accessPlanFlowForm);
export default accessPlanFlowForm;