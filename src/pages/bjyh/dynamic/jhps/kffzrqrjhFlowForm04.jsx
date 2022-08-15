import React, { Component } from "react";
import { vpQuery,vpAdd,VpMWarning, vpDownLoad } from 'vpreact';
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { fileValidation } from '../code'
import { findFiledByName } from 'utils/utils';

/**
 * 计划评审流程--开发负责人确认计划
 */
class kffzrqrjhFlowForm04 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    onDataLoadSuccess = (formData,_handlers) => {
        //预设处理人自动带出项目经理
        let rxmjl = formData.findWidgetByName('rxmjl')
        if(rxmjl){
            this.props.form.setFieldsValue({
                [_handlers[0].stepkey]:rxmjl.field.fieldProps.initialValue,
                [_handlers[0].stepkey+'_label']:rxmjl.field.props.initialName,
            })
        }
    }
    onBeforeSave(formData, btnName) {
        if (btnName === "ok") {
            //检验附件个数 至少有个一
            const fileArr = this.rfjRef.state.childNodes
            if(fileArr.length<1){
                VpMWarning({
                    title: '缺少附件',
                    content: '请至少上传一个附件！'
                })
                return false;
            }
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
kffzrqrjhFlowForm04 = FlowForm.createClass(kffzrqrjhFlowForm04);
export default kffzrqrjhFlowForm04;