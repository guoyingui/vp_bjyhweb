import React, { Component } from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { findWidgetByName } from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation, validationRequireField, singleInputFill, initHiddenColumn_swxx } from '../code';
import moment from "moment";

//项目 需求分析 流程 项目经理确认 审批节点
class xqfxXmjlqrFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
    }
    //数据加载前
    onGetFormDataSuccess = data => {
        let _this = this

    }

    onFormRenderSuccess(formData) {
        vpQuery('/{bjyh}/xzxt/shifouzfry', { loginname: vp.cookie.getTkInfo('username') }).then((response) => {
            if (response.flag == '1') {
                initHiddenColumn_swxx(formData);
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

    //数据加载成功方法
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this
        var shnry = formData.findWidgetByName("shnry");
        var shwry = formData.findWidgetByName("shwry");

        console.log("shnry", shnry)

        _this.props.form.setFieldsValue({
            'fkfgzl': shnry.field.fieldProps.initialValue,
            'fwbgzl': shwry.field.fieldProps.initialValue,
        })
        let iyspc = formData.findWidgetByName('iyspc')
        console.log("iyspc", iyspc)
        console.log("iyspc", iyspc.field.fieldProps.initialValue)
        var sysbh1 = formData.findWidgetByName("sysbh1");
        var sysbh2 = formData.findWidgetByName("sysbh2");
        var sysbh3 = formData.findWidgetByName("sysbh3");
        var sysbh4 = formData.findWidgetByName("sysbh4");
        var sysbh5 = formData.findWidgetByName("sysbh5");
        var sysmc1 = formData.findWidgetByName("sysmc1");
        var sysmc2 = formData.findWidgetByName("sysmc2");
        var sysmc3 = formData.findWidgetByName("sysmc3");
        var sysmc4 = formData.findWidgetByName("sysmc4");
        var sysmc5 = formData.findWidgetByName("sysmc5");
        if (iyspc.field.fieldProps.initialValue == 0) {
            sysbh1.field.hidden = true;
            sysbh2.field.hidden = true;
            sysbh3.field.hidden = true;
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc1.field.hidden = true;
            sysmc2.field.hidden = true;
            sysmc3.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        } else if (iyspc.field.fieldProps.initialValue == 1) {
            sysbh2.field.hidden = true;
            sysbh3.field.hidden = true;
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc2.field.hidden = true;
            sysmc3.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        } else if (iyspc.field.fieldProps.initialValue == 2) {
            sysbh3.field.hidden = true;
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc3.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        } else if (iyspc.field.fieldProps.initialValue == 3) {
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        } else if (iyspc.field.fieldProps.initialValue == 4) {
            sysbh5.field.hidden = true;
            sysmc5.field.hidden = true;
        }

        /**
         * 76.优化需求(二)
         * “项目管理工作量（人天）”、“需求分析工作量（人天）”手工填写，必填，
         * “项目经理工作量(人月)”自动计算，“项目经理工作量(人月)”=[项目管理工作量（人天）+需求分析工作量（人天）]/22
         */
        let fxqfxgzl = formData.findWidgetByName('fxqfxgzl');
        fxqfxgzl.field.fieldProps.onChange = e => {
            let fxmglgzl = _this.props.form.getFieldValue("fxmglgzl");
            if (Number.isFinite(e) && Number.isFinite(fxmglgzl * 1)) {
                _this.props.form.setFieldsValue({ 'fxmjlgzl': Number.parseFloat((fxmglgzl * 1 + e * 1) / 22) + "" });
            }
        }
        let fxmglgzl = formData.findWidgetByName('fxmglgzl');
        fxmglgzl.field.fieldProps.onChange = e => {
            let fxqfxgzl = _this.props.form.getFieldValue("fxqfxgzl");
            if (Number.isFinite(e) && Number.isFinite(fxqfxgzl * 1)) {
                _this.props.form.setFieldsValue({ 'fxmjlgzl': Number.parseFloat((fxqfxgzl * 1 + e * 1) / 22) + "" });
            }
        }

    }
    onBeforeSave(formData, btnName) {
        let _this = this
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'sxmjlqryj', true)
        }
    }
    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value
        console.log("scondition", scondition);

        let flag = e.target.value == 'SYSI' ? true : false
        validationRequireField(_this, 'sxmjlqryj', flag)

    }
}

xqfxXmjlqrFlowForm = FlowForm.createClass(xqfxXmjlqrFlowForm);
export default xqfxXmjlqrFlowForm;