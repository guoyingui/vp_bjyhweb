import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { registerWidgetPropsTransform, registerWidget, getCommonWidgetPropsFromFormData } from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'
import { common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';

// 新增系统流程架构管理办公室节点
class xzxt08FlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("xzxt08FlowForm");
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value === 'SYSG'? false :true
        validationRequireField(_this, 'sdescription', scondition)
    }

    /**
     * 表单提交前
     * @param formData
     * @returns {Promise<any>}
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'sdescription', true)
    }





    /**
      * 表单数据加载成功后
      * @param formData
      */
    // onDataLoadSuccess = (formData, handlers) => {
    //     let _this = this
    //     _this.props.form.setFieldsValue({
    //         scondition: 'SYSG',
    //         ifhbm: '0',
    //     })
    //     let scondition = formData.findWidgetByName('scondition')
    //     scondition.field.props.disabled = true;
    //     if (scondition) {
    //         scondition.field.props.options_.map(item => {
    //             item.value == 'SYSI' ? item.hidden = true : null
    //             item.value == 'SYSJ' ? item.hidden = true : null
    //         })
    //     }
    //     let ifhbm = formData.findWidgetByName('ifhbm')
    //     if (ifhbm.field.fieldProps.initialValue == "0") {
    //         scondition.field.props.options_.map(item => {
    //             if (item.value == 'SYSG') {
    //                 item.hidden = false
    //                 _this.props.form.setFieldsValue({
    //                     scondition: 'SYSG',
    //                 })
    //             } else if (item.value == 'SYSH') {
    //                 item.hidden = false
    //             } else if (item.value == 'SYSI') {
    //                 item.hidden = true
    //             } else if (item.value == 'SYSJ') {
    //                 item.hidden = true
    //             }
    //         })
    //     } else if (ifhbm.field.fieldProps.initialValue == "1") {
    //         scondition.field.props.options_.map(item => {
    //             if (item.value == 'SYSG') {
    //                 item.hidden = false
    //             } else if (item.value == 'SYSH') {
    //                 item.hidden = false
    //                 _this.props.form.setFieldsValue({
    //                     scondition: 'SYSH',
    //                 })
    //             } else if (item.value == 'SYSI') {
    //                 item.hidden = true
    //             } else if (item.value == 'SYSJ') {
    //                 item.hidden = true
    //             }
    //         })
    //     } else if (ifhbm.field.fieldProps.initialValue == "2") {
    //         scondition.field.props.options_.map(item => {
    //             if (item.value == 'SYSG') {
    //                 item.hidden = false
    //             } else if (item.value == 'SYSH') {
    //                 item.hidden = true
    //             } else if (item.value == 'SYSI') {
    //                 item.hidden = false
    //                 _this.props.form.setFieldsValue({
    //                     scondition: 'SYSI',
    //                 })
    //             } else if (item.value == 'SYSJ') {
    //                 item.hidden = true
    //             }
    //         })
    //     } else if (ifhbm.field.fieldProps.initialValue == "3") {
    //         scondition.field.props.options_.map(item => {
    //             if (item.value == 'SYSG') {
    //                 item.hidden = false
    //             } else if (item.value == 'SYSH') {
    //                 item.hidden = true
    //             } else if (item.value == 'SYSI') {
    //                 item.hidden = true
    //             } else if (item.value == 'SYSJ') {
    //                 item.hidden = false
    //                 _this.props.form.setFieldsValue({
    //                     scondition: 'SYSJ',
    //                 })
    //             }
    //         })
    //     }

    //     ifhbm.field.fieldProps.onChange = (v) => {
    //         let scondition = formData.findWidgetByName('scondition')
    //         if (v.target.value == "0") {
    //             scondition.field.props.options_.map(item => {
    //                 if (item.value == 'SYSG') {
    //                     item.hidden = false
    //                     _this.props.form.setFieldsValue({
    //                         scondition: 'SYSG',
    //                     })
    //                 } else if (item.value == 'SYSH') {
    //                     item.hidden = false
    //                 } else if (item.value == 'SYSI') {
    //                     item.hidden = true
    //                 } else if (item.value == 'SYSJ') {
    //                     item.hidden = true
    //                 }
    //             })
    //         } else if (v.target.value == "1") {
    //             scondition.field.props.options_.map(item => {
    //                 if (item.value == 'SYSG') {
    //                     item.hidden = false
    //                 } else if (item.value == 'SYSH') {
    //                     item.hidden = false
    //                     _this.props.form.setFieldsValue({
    //                         scondition: 'SYSH',
    //                     })
    //                 } else if (item.value == 'SYSI') {
    //                     item.hidden = true
    //                 } else if (item.value == 'SYSJ') {
    //                     item.hidden = true
    //                 }
    //             })
    //         } else if (v.target.value == "2") {
    //             scondition.field.props.options_.map(item => {
    //                 if (item.value == 'SYSG') {
    //                     item.hidden = false
    //                 } else if (item.value == 'SYSH') {
    //                     item.hidden = true
    //                 } else if (item.value == 'SYSI') {
    //                     item.hidden = false
    //                     _this.props.form.setFieldsValue({
    //                         scondition: 'SYSI',
    //                     })
    //                 } else if (item.value == 'SYSJ') {
    //                     item.hidden = true
    //                 }
    //             })
    //         } else if (v.target.value == "3") {
    //             scondition.field.props.options_.map(item => {
    //                 if (item.value == 'SYSG') {
    //                     item.hidden = false
    //                 } else if (item.value == 'SYSH') {
    //                     item.hidden = true
    //                 } else if (item.value == 'SYSI') {
    //                     item.hidden = true
    //                 } else if (item.value == 'SYSJ') {
    //                     item.hidden = false
    //                     _this.props.form.setFieldsValue({
    //                         scondition: 'SYSJ',
    //                     })
    //                 }
    //             })
    //         }
    //     }
    // }

}

xzxt08FlowForm = FlowForm.createClass(xzxt08FlowForm);
export default xzxt08FlowForm;