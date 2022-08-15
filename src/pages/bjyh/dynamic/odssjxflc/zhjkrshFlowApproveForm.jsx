import React, { Component } from "react"
import {common, fhzjxmsq, validationRequireField, singleInputMonitor, singleInputFill} from '../code';

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {findWidgetByName} from '../../../templates/dynamic/Form/Widgets'
import {vpAdd, vpQuery} from "vpreact";

//ODS数据下发流程--流程--总行接口人审批
class zhjkrshFlowApproveForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单加载前，重写单选及流程处理人
     * @param data
     */
    onGetFormDataSuccess = data => {
        let _this = this

        let sconditionField = findWidgetByName.call(data.form,"scondition") ;
        let szjbmspField = findWidgetByName.call(data.form,'szjbmsp');
        if(sconditionField && szjbmspField){
            // 隐藏的按钮的value值
            // let option = szjbmspField.field.widget.default_value == 0 ? 'SYSD' : 'SYSC'
            let option = 'SYSD'
            // 默认单选选中
            // let defaultOption = szjbmspField.field.widget.default_value == 0 ? 'SYSC' : 'SYSD'
            let defaultOption = 'SYSC'
            // 获取全部单选按钮
            let options =  sconditionField.field.widget.load_template
            // 隐藏指定单选按钮
            let newOptions = options.filter(v => v.value != option);
            data.scondition = defaultOption;
            sconditionField.field.widget.default_value = defaultOption;
            sconditionField.field.widget.load_template = newOptions;
        }
    }

    onDataLoadSuccess = () => {
        let _this = this
        vpQuery('/{bjyh}/odssjxflc/getZzjsValue', {
            flowId: _this.props.piid
        }).then((res) => {
            if (res.data != null) {
                _this.props.form.setFieldsValue({
                    "szjjs": res.data ? 1 + '' : 0 + '',
                })
            }
        })
        // // 隐藏的按钮的value值
        // let option = formData.findWidgetByName('szjbmsp').field.fieldProps.initialValue != 0 ? 'SYSD' : 'SYSC'
        // // 默认单选选中
        // let defaultOption = formData.findWidgetByName('szjbmsp').field.fieldProps.initialValue != 0 ? 'SYSC' : 'SYSD'
        // // 获取全部单选按钮
        // let options =  formData.findWidgetByName("scondition").field.props.options
        // // 隐藏指定单选按钮
        // let newOptions = options.filter(v => v.value != option)
        // formData.findWidgetByName("scondition").field.props.options = newOptions
        // // 指定新的默认选中
        // _this.props.form.setFieldsValue({ 'scondition': defaultOption })
    }

    /**
     * 监听单选框
     * @param ek
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSE' ? true : false
        // if (flag) {
        //     _this.props.form.setFieldsValue({
        //         "szjbmsp": 0 + '',
        //     })
        // }
        validationRequireField(_this, 'szhjkr', flag)
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'szhjkr', true)
        // return new Promise(resolve => {
        //     vpAdd('/{bjyh}/odssjxflc/thirdTofourthStep', { flowId: formData.iobjectid
        //     }).then((res) => {
        //         if (res.data != null && res.data != '') {
        //             console.log("111111")
        //             resolve(res.data)
        //         } else {
        //             console.log("22222")
        //             resolve(false)
        //         }
        //     })
        // })
    }

}

zhjkrshFlowApproveForm = FlowForm.createClass(zhjkrshFlowApproveForm)
export default zhjkrshFlowApproveForm
