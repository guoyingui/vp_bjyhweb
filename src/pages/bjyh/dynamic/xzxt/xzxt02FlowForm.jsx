import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import {vpQuery, vpAdd, VpAlertMsg} from 'vpreact';
import {registerWidgetPropsTransform,registerWidget,getCommonWidgetPropsFromFormData} from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'

// 新增系统流程架构管理办公室节点
class xzxt02FlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("xzxt02FlowForm");
    }

    // 保存前校验
    onBeforeSave(formData, btnName) {
        let _this = this;
        let sparam = JSON.parse(formData.sparam);
        return new Promise(resolve => {
            let flag = true;
            vpAdd('/{bjyh}/xzxt/checkXzxt', { sparam: JSON.stringify(sparam), method: 'getchuliren02_2' }).then((response) => {
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

    /**
    * 表单数据加载成功后
    * @param formData
    */
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this;
        console.log('formData', formData);
        console.log('handlers', handlers);
        // 根据项目把相关信息带出来
        var rxmmc = formData.findWidgetByName("rxmmc");
        vpQuery('/{bjyh}/xzxt/checkXzxt', { projectid: rxmmc.field.fieldProps.initialValue, method: 'getchuliren02_1' }).then((response) => {
            var rxkxmjl1 = formData.findWidgetByName("rxkxmjl1");
            if(rxkxmjl1.field.fieldProps.initialValue==null){
                _this.props.form.setFieldsValue({
                    'rxkxmjl1': response.id1,
                    'rxkxmjl1_label': response.name1,
                })
            }
            var rywfzr1 = formData.findWidgetByName("rywfzr1");
            if(rywfzr1.field.fieldProps.initialValue==null){
                _this.props.form.setFieldsValue({
                    'rywfzr1': response.id2,
                    'rywfzr1_label': response.name2,
                })
            }
            var rywzgbm1 = formData.findWidgetByName("rywzgbm1");
            if(rywzgbm1.field.fieldProps.initialValue==null){
                _this.props.form.setFieldsValue({
                    'rywzgbm1': response.id3,
                    'rywzgbm1_label': response.name3,
                })
            }
        })
    }
}

xzxt02FlowForm = FlowForm.createClass(xzxt02FlowForm);
export default xzxt02FlowForm;