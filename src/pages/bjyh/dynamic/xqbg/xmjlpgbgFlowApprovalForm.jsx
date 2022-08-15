import React, { Component } from "react"
import { vpQuery, VpAlertMsg } from 'vpreact'
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { validationRequireField, singleInputFill, initHiddenColumn_swxx } from "../code";

//需求变更--流程--项目经理评估变更
class xmjlpgbgFlowApprovalForm extends FlowForm.Component {

    constructor(props) {
        super(props)
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
    }

    onFormRenderSuccess(formData) {
        vpQuery('/{bjyh}/xzxt/shifouzfry', { loginname: vp.cookie.getTkInfo('username') }).then((response) => {
            if (response.flag == '1') {
                //initHiddenColumn_swxx(formData);
                const buttons = this.state.newButtons;
                buttons.map(item => {
                    if (item.name === 'ok') {
                        item.className = 'hidden'
                    }
                })
                this.setState({ newButtons: buttons })
            }
        })
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data) {
        let _this = this

        let handlers = data.handlers
        for (let i = 0; i < data.handlers.length; i++) {
            if (handlers[i].flag == 'SYSA') {
                return new Promise(resolve => {
                    vpQuery('/{bjyh}/xqbg/getXgfzrqrByiobjectId', {
                        entityId: _this.props.iobjectid
                    }).then((response) => {
                        if (response.data != null) {
                            let res = response.data
                            let xgfzr_label = ''
                            let xgfzr = ''
                            // 自动获取该项目的相关负责人
                            for (let j = 0; j < res.length; j++) {
                                xgfzr += res[j].iuserid + ','
                                xgfzr_label += res[j].sname + ','
                            }
                            xgfzr = xgfzr.substring(0, xgfzr.length - 1)
                            xgfzr_label = xgfzr_label.substring(0, xgfzr_label.length - 1)
                            data.handlers[i].ids = xgfzr
                            data.handlers[i].names = xgfzr_label
                            resolve(data)
                        } else {
                            resolve(data)
                        }
                    })
                })
            }
        }
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        let _this = this

        // 附件增加删除功能
        let rfj = formData.findWidgetByName('rfj');
        let arrfile = rfj.field.props.widget.load_template;
        arrfile.map(item => {
            item.options.delete = true;
        })

        let projectId = formData.findWidgetByName('rxmmc').field.fieldProps.initialValue;
        let lastChangePer = ''
        vpQuery('/{bjyh}/xqbg/getWorkLoadByProjectId', {
            projectId: projectId
        }).then((res) => {
            if (res.data != null) {
                _this.props.form.setFieldsValue({
                    "fzgzlry": res.data.workLoadOfTotal + "",
                })
                lastChangePer = res.data.LastChangeWorkLoad
            }
        })
        let fbggzlry = formData.findWidgetByName('fbggzlry')
        fbggzlry.field.fieldProps.onChange = function (v) {
            let fzgzlry = _this.props.form.getFieldValue('fzgzlry')
            let changeBit = 0
            if (v) {
                changeBit = fzgzlry == 0 ? 0 : v / fzgzlry * 100
                _this.props.form.setFieldsValue({
                    "fbgzlbfb": changeBit + "",
                    "fljbggzl": changeBit + lastChangePer + ""
                })
            } else {
                _this.props.form.setFieldsValue({
                    "fbgzlbfb": '0',
                    "fljbggzl": changeBit + lastChangePer + ""
                })
            }
        }
        let ibgfl = formData.findWidgetByName("ibgfl");//变更分类
        let sflly = formData.findWidgetByName("sflly");//分类理由
        ibgfl.field.fieldProps.rules.push({ validator: this.checkBGFL });
        ibgfl.field.fieldProps.onChange = (value) => {
            if (value == 2) {//客观原因
                validationRequireField(_this, 'sflly', true, '请输入0~1000个字符!');
            } else {
                validationRequireField(_this, 'sflly', false, '请输入0~1000个字符!');
            }
        }
        //ibgfl.field.fieldProps.onChange(ibgfl.field.fieldProps.initialValue);
    }

    checkBGFL = (rule, value, callback) => {
        if (value == 0) {
            callback([new Error('变更分类不能为空或无')]);
        } else {
            callback();
        }
    }

    onBeforeSave(formData, btnName) {
        let _this = this
        let sparam = JSON.parse(formData.sparam);
        /**
         * 项目管理系统（六期）项目 14.优化PC端处理功能
         * 
         * 4)需求变更流程项目经理评估步骤增加项目经理意见，拒绝时必填意见。
         * 需求变更流程在【项目经理评估变更】步骤增加“项目经理意见”字段，
         * 如审批结论为同意，则 “项目经理意见”非必填，且提交流程时，在此字段中自动填写“同意+签批人：姓名”；
         * 如审批结论为拒绝，则 “项目经理意见”必填，提交流程时，在此字段中填写的意见下方自动填写“签批人：姓名”
         */
        if (btnName == 'ok') { //提交按钮时验证 
            let scondition = sparam.scondition;//处理意见
            let sxmjlpgbgyj = sparam.sxmjlpgbgyj;//项目经理评估变更意见
            let content = '';//自动填写内容 
            if (scondition == 'SYSB') {//拒绝时 
                content = "签批人：" + vp.cookie.getTkInfo("nickname");//拒绝时的自动添加内容 
                if (!sxmjlpgbgyj) {//项目经理评估变更意见为空时 进行必填项的提示 
                    VpAlertMsg({
                        message: "消息提示",
                        description: "审批结果为拒绝，则 “项目经理评估变更意见”必填,请填写项目经理评估变更意见",
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    return false; //终止提交
                } else {// 项目经理评估变更意见 验证通过时 
                    //if(!sxmjlpgbgyj.includes(content)){ }//预留 判断项目经理评估变更意见 是否存在 相同的内容                                          
                    //_this.props.form.setFieldsValue({"sxmjlpgbgyj": sxmjlpgbgyj + content })
                    sparam.sxmjlpgbgyj = sxmjlpgbgyj + content;
                }
            } else if (scondition == 'SYSA') {//同意时
                content = "同意 签批人：" + vp.cookie.getTkInfo("nickname");
                //if(!sxmjlpgbgyj.includes(content)){}//预留 判断项目经理评估变更意见 是否存在 相同的内容     
                //_this.props.form.setFieldsValue({ "sxmjlpgbgyj": sxmjlpgbgyj + content })
                sparam.sxmjlpgbgyj = sxmjlpgbgyj + content;
            }
            formData.sparam = JSON.stringify(sparam)
            singleInputFill(formData, btnName, 'sxmjlpgbgyj', true)
        }
    }

    /**
     * 监听单选框
     * @param ek
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSB' ? true : false
        validationRequireField(_this, 'fbggzlry', !flag, '请输入0~1000000000之间的数值!');
        validationRequireField(_this, 'ibgfl', !flag, '必填项不能为空!');
        validationRequireField(_this, 'isjjhbg', !flag, '必填项不能为空!');
    }
}

xmjlpgbgFlowApprovalForm = FlowForm.createClass(xmjlpgbgFlowApprovalForm)
export default xmjlpgbgFlowApprovalForm
