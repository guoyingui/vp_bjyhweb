import React, { Component } from "react";
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';

import {validationRequireField, singleInputFill,initHiddenColumn,xmsqHiddenColumn  } from '../code';

//项目申请
var iyspctemp = '0';
/**
 * 项目
 */
class sjxtForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
    }

    getCustomeButtons(){
        let buttons = this.props.buttons;
        if(!buttons){
            //如果没有自定义按钮，用默认的
            buttons = [];
            if(this.state.entityrole !== false){//用户对表单是读状态时
                buttons.push("ok"); //默认的保存按钮，见Form.jsx中定义
                if(this.props.add){
                    //新增页面时
                    buttons.push("saveAndNew");
                }
                if(this.state.flowtype == '3' && (this.props.add || this.props.entityrole) ){
                    //如果实体是工作流类，且是添加（this.props.add=true)或编辑时(this.props.entityrole=true)
                    if(!this.state.isFlowed){
                        buttons.push("saveAndFlow");
                    }
                }else{
                    buttons.push("status");
                }
            }
            buttons.push("cancel");

            if(vp.cookie.getTkInfo('userid')==1){
                buttons.push({
                    name: "modify",
                    text: "TFS项目同步",
                    validate: false,
                    handler: this.xxx,
                    className: `vp-btn-br`,
                    size: "default"
                });
            }
        }
        return buttons;
    }

    xxx = () => {
        console.log(this.props.iid);
        let _this = this;
        vpQuery('/{bjyh}/tfsrest/tfssjxt', {
            iid: _this.props.iid
        }).then((response) => {
                if (response == '0') {
                    VpAlertMsg({
                        message:"消息提示",
                        description:"TFS项目同步成功。",
                        type:"success",
                        closeText:"关闭",
                        showIcon: true
                    }, 5)
                }else{
                    VpAlertMsg({
                        message: "消息提示",
                        description: "TFS项目同步失败。",
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                }
                _this.setFormSubmiting(false);
                //_this.loadFormData();
        }).catch(function (err) {
            VpAlertMsg({
                message: "消息提示",
                description: "TFS项目同步失败。",
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5);
            _this.setFormSubmiting(false);
        });
    }
}
sjxtForm = DynamicForm.createClass(sjxtForm);
export default sjxtForm;