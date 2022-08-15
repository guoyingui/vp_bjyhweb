import React, { Component } from "react";
import { vpQuery,vpAdd,VpMWarning, vpDownLoad } from 'vpreact';
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { fileValidation } from '../code'
import { findFiledByName } from 'utils/utils';

/**
 * 计划评审流程--各系统负责人上传计划
 */
class gxtfzrscjhFlowForm03 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    onDataLoadSuccess = (formData,_handlers) => {
        //预设处理人自动带出开发负责人
        let rkffzr = formData.findWidgetByName('rkffzr')
        if(rkffzr){
            this.props.form.setFieldsValue({
                [_handlers[0].stepkey]:rkffzr.field.fieldProps.initialValue,
                [_handlers[0].stepkey+'_label']:rkffzr.field.props.initialName,
            })
        }
    }

    /**
     * @description:紧急需求，计划评审的2，3，4步骤加按钮‘下载Project模板’
     * @param {type} 
     * @return: 
     */
    getCustomeButtons() {
        let buttons = this.props.buttons;
        if(!buttons){
            //如果没有自定义按钮，用默认的
            buttons = [];
            if(this.props.staskid){
                buttons.push("ok");
                buttons.push("save");
                if(this.props.ijump){
                    //自由跳转
                    buttons.push("jump");
                }
                if(this.props.usermode){
                    //修改处理人
                    buttons.push("moduser");
                }
            }
            buttons.push("cancel");
            buttons.push({
                name: "downLoadProject",
                text: "Project模板下载",
                validate: false,
                handler: this.downLoadProject,
                //type:'primary',
                className: `vp-btn-br`,
                size: "default"
            });
        }
        return buttons;
    }

    downLoadProject = () => {
        this.setFormSubmiting(false)
        vpDownLoad('/{bjyh}/phase/wbsTemplateDownload')
    }

}
gxtfzrscjhFlowForm03 = FlowForm.createClass(gxtfzrscjhFlowForm03);
export default gxtfzrscjhFlowForm03;