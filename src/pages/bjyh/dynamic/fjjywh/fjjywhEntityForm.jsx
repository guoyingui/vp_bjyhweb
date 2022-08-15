import React, { Component } from "react"
import {
    VpMWarning
} from 'vpreact'

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm"

// 附件校验维护--实体
class fjjywhEntityForm extends DynamicForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        let _this = this;
        // 流程名称
        let slcmc = formData.findWidgetByName('slcmc')
        // 步骤名称
        let sbzmc = formData.findWidgetByName('sbzmc')
        if (slcmc) {
            slcmc.field.props.onBlur = function (v) {
                let value = v.target.value
                let sbzmc_value = _this.props.form.getFieldValue('sbzmc')
                _this.props.form.setFieldsValue({
                    'sname': value != '' && sbzmc_value != '' ? value + '--' + sbzmc_value : value + sbzmc_value
                })
            }
        }
        if (sbzmc) {
            sbzmc.field.props.onBlur = function (v) {
                let value = v.target.value
                let slcmc_value = _this.props.form.getFieldValue('slcmc')
                _this.props.form.setFieldsValue({
                    'sname': value != '' && slcmc_value != '' ? slcmc_value + '--' + value : slcmc_value + value
                })
            }
        }
    }

    /**
     * 表单数据提交之前
     * @param formData
     * @param btnName
     */
    // onBeforeSave = (formData, btnName) => {
    //     let _this = this
    //     let ffjgs = _this.props.form.getFieldValue('ffjgs')
    //     let sfjwjm1 = _this.props.form.getFieldValue('sfjwjm1')
    //     if (sfjwjm1) {
    //         if (ffjgs) {
    //             if (ffjgs == sfjwjm1.split(',').length) {
    //                 return true
    //             } else {
    //                 VpMWarning({
    //                     title: '这是一条警告通知',
    //                     content: '【附件个数】和【附件文件名1】的附件个数不匹配'
    //                 })
    //                 return false
    //             }
    //         } else {
    //             return false
    //         }
    //     }
    // }

}
fjjywhEntityForm = DynamicForm.createClass(fjjywhEntityForm)
export default fjjywhEntityForm
