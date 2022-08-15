import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import {vpQuery, vpAdd, VpAlertMsg} from 'vpreact';
import {registerWidgetPropsTransform,registerWidget,getCommonWidgetPropsFromFormData} from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'

// 新增系统流程架构管理办公室节点
class bgxt02FlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("bgxt02FlowForm");
    }

    // 保存前校验
    onBeforeSave(formData, btnName) {
        let _this = this;
        let sparam = JSON.parse(formData.sparam);
        return new Promise(resolve => {
            let flag = true;
            vpAdd('/{bjyh}/bgxt/checkBgxt', { sparam: JSON.stringify(sparam), method: 'getchuliren02_2' }).then((response) => {
                //校验编号
                if (response.success == '1') {
                    VpAlertMsg({
                        message: "消息提示",
                        description: "元系统三位简称已经在其他系统中存在，请核实后再填写。",
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    flag = false
                    resolve(flag)
                } else {
                    resolve(flag)
                }
            })
        })
    }
}

bgxt02FlowForm = FlowForm.createClass(bgxt02FlowForm);
export default bgxt02FlowForm;