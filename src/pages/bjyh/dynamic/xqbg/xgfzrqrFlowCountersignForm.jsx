import React, { Component } from "react"
import {
    vpAdd,
    vpQuery,
} from 'vpreact'

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";

//需求变更--流程--相关负责人确认
class xgfzrqrFlowCountersignForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        let _this = this
        console.log("_this.props.iobjectid:",_this.props.iobjectid);
        return new Promise(resolve => {
            vpQuery('/{bjyh}/xqbg/whetherSpecialProject',{ id: _this.props.iobjectid
            }).then((res) => {
                if (res) {
                    console.log('res', res)
                    let sconditionField = findWidgetByName.call(data.form,"scondition")
                    let szjbmspField = findWidgetByName.call(data.form,'fljbggzl')
                    if(sconditionField && szjbmspField){
                        // 隐藏的按钮的value值
                        let option ='SYSE'
                        // 默认单选选中
                        let defaultOption ='SYSC'
                        
                        console.log('fljbggzl', szjbmspField.field.widget.default_value)
                        //取消超出周期的限制
                        if(/*!res.data.sfcczq&&*/ szjbmspField.field.widget.default_value < 20){
                            console.log('sfcczq', "未超出周期并且累计报工工作量小于20%")
                            // 隐藏的按钮的value值
                            option = res.data.date || szjbmspField.field.widget.default_value < 20 ? 'SYSC' : 'SYSE'
                            // 默认单选选中
                            defaultOption = res.data.date || szjbmspField.field.widget.default_value < 20 ? 'SYSE' : 'SYSC'
                            
                        }
                       
                        // 获取全部单选按钮
                        // let options =  formData.findWidgetByName("scondition").field.props.options_
                        // 获取全部单选按钮
                        let options =  sconditionField.field.widget.load_template
                        // 隐藏指定单选按钮
                        let newOptions = options.filter(v => v.value != option)
                        // formData.findWidgetByName("scondition").field.fieldProps.initialValue = defaultOption
                        data.scondition = defaultOption;
                        sconditionField.field.widget.default_value = defaultOption;
                        sconditionField.field.widget.load_template = newOptions;

                        vpQuery('/{bjyh}/xqbg/getXmjlByiobjectId',{ entityId: _this.props.iobjectid
                        }).then((res) => {
                            for (let i = 0; i < data.handlers.length; i++) {
                                if (data.handlers[i].flag != 'SYSF') {
                                    if (res.data != null) {
                                        // 自动获取该项目的项目经理
                                        data.handlers[i].ids = res.data.iuserid + ""
                                        data.handlers[i].names = res.data.sname
                                    }
                                }
                            }
                            resolve(data)
                        })
                    }
                }
            })
        })
        // return new Promise(resolve => {
        //     vpQuery('/{bjyh}/xqbg/getXmjlByiobjectId',{ entityId: _this.props.iobjectid
        //     }).then((res) => {
        //         for (let i = 0; i < data.handlers.length; i++) {
        //             if (data.handlers[i].flag != 'SYSF') {
        //                 if (res.data != null) {
        //                     // 自动获取该项目的项目经理
        //                     data.handlers[i].ids = res.data.iuserid + ""
        //                     data.handlers[i].names = res.data.sname
        //                 }
        //             }
        //         }
        //         resolve(data)
        //     })
        // })
    }

    /**
     * 表单加载成功事件
     * @param formData
     */
    // onDataLoadSuccess = (formData) => {
    //     let _this = this
    //
    //     return new Promise(resolve => {
    //         vpQuery('/{bjyh}/xqbg/whetherSpecialProject',{ id: _this.props.iobjectid
    //         }).then((res) => {
    //             if (res) {
    //                 console.log('res', res)
    //                 debugger
    //                 // 隐藏的按钮的value值
    //                 let option = res.data || formData.findWidgetByName("fljbggzl").field.fieldProps.initialValue < 20 ? 'SYSC' : 'SYSE'
    //                 // 默认单选选中
    //                 let defaultOption = res.data || formData.findWidgetByName("fljbggzl").field.fieldProps.initialValue < 20 ? 'SYSE' : 'SYSC'
    //                 // 获取全部单选按钮
    //                 let options =  formData.findWidgetByName("scondition").field.props.options_
    //                 // 隐藏指定单选按钮
    //                 let newOptions = options.filter(v => v.value != option)
    //                 // formData.findWidgetByName("scondition").field.fieldProps.initialValue = defaultOption
    //                 formData.findWidgetByName("scondition").field.props.options_ = newOptions
    //                 // 指定新的默认选中
    //                 _this.props.form.setFieldsValue({ 'scondition': defaultOption })
    //                 // 动态表单加载
    //                 const e = {
    //                     target:{
    //                         value: defaultOption
    //                     }
    //                 }
    //                 _this.handleCondition(e)
    //                 _this.forceUpdate();
    //             }
    //             resolve(formData)
    //         })
    //     })
    // }
}

xgfzrqrFlowCountersignForm = FlowForm.createClass(xgfzrqrFlowCountersignForm)
export default xgfzrqrFlowCountersignForm
