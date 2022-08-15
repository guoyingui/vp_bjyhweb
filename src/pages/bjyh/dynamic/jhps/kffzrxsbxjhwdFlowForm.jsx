/*
 * @Author:SL.
 * @Date: 2020-04-16 14:43:40
 * @LastEditTime: 2020-06-18 11:05:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bjyhweb\src\pages\bjyh\dynamic\jhps\kffzrxsbxjhwdFlowForm.jsx
 */ 
import React, { Component } from "react";
import { vpQuery,vpAdd,VpMWarning, vpDownLoad } from 'vpreact';
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { fileValidation } from '../code'
import {findFiledByName} from 'utils/utils';

/**
 * 计划评审流程--开发负责人编写文档
 */
class kffzrxsbxjhwdFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.checkFileFlag = true;//是否需要附件校验
    }
    //预设处理人逻辑处理
    handlerProcess = (sysRoleArr, otherParams) => {
        let _this = this
        const eobj = {
            target: {
                value: ''
            }
        }
        if (sysRoleArr.length > 0) {
            //将对象数组转换 逗号隔开字符串
            const ids = [];
            const names = [];
            sysRoleArr.map(element => {
                if (element.sysroleid && !ids.includes(element.sysroleid)) {
                    ids.push(element.sysroleid);
                    names.push(element.sysrolename);
                }
            })
            //预设处理人赋值
            let handlers = _this.state.handlers
            handlers.map(item => {
                if (item.flag === 'SYSA') {
                    item.ids = ids.join(',');
                    item.names = names.join(',');
                    _this.props.form.setFieldsValue({
                        [item.stepkey]: ids.join(','),
                        [item.stepkey + '_label']: names.join(','),
                    })
                }
            })
            _this.setState({handlers:handlers})
            //分支flag切换
            _this.props.form.setFieldsValue({
                scondition: 'SYSA',
            })
            eobj.target.value = 'SYSA'
            _this.handleCondition(eobj)
            _this.setState({
                checkFileFlag: false,
            })
            _this.forceUpdate();
        } else {
            let handlers = _this.state.handlers
            let xmjlid = _this.props.form.getFieldValue('rxmjl');
            let xmjlname = _this.props.form.getFieldValue('rxmjl_label');

            //if(otherParams && Array.isArray(otherParams) ){
            handlers.map(item => {
                if (item.flag === 'SYSB' && !item.ids) {
                    item.ids = xmjlid || '';
                    item.names = xmjlname || '';
                    _this.props.form.setFieldsValue({
                        [item.stepkey]: xmjlid || '',
                        [item.stepkey + '_label']: xmjlname || '',
                    })
                }
            })
            _this.setState({
                handlers: handlers,
                checkFileFlag: true,
            })
            _this.props.form.setFieldsValue({
                scondition: 'SYSB'
            })
            eobj.target.value = 'SYSB'
            _this.handleCondition(eobj)
        }
    }
    //渲染数据之前
    // onGetFormDataSuccess = data => {
    //     let scondition = findFiledByName(data.form,'scondition')
    //     scondition.field.widget.load_template.map(item=>{
    //         if(item.value=='SYSB'){
    //             item.hidden=true
    //             data.scondition = 'SYSA'
    //             scondition.field.widget.default_value='SYSA'
    //         }
    //     })
    // }

    onBeforeSave(formData, btnName) {
        if (btnName === "ok") {
            //检验附件个数 至少有个一
            if(this.state.checkFileFlag) {
                const fileArr = this.rfjRef.state.childNodes
                if (fileArr.length < 1) {
                    VpMWarning({
                        title: '缺少附件',
                        content: '请至少上传一个附件！'
                    })
                    return false;
                }
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
kffzrxsbxjhwdFlowForm = FlowForm.createClass(kffzrxsbxjhwdFlowForm);
export default kffzrxsbxjhwdFlowForm;