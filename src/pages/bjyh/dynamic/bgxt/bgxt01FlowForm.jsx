import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation } from '../code';
import moment from "moment";
import { vpAdd } from "vpreact/public/Vp";
import { formDataToWidgetProps, findWidgetByName } from '../../../templates/dynamic/Form/Widgets';
import { findFiledByName } from 'utils/utils';
// 新增系统流程架构管理办公室节点
class bgxt01FlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("bgxt01FlowForm");
    }

    /**
     * 处理数据，修复一个显示bug
     * @author wuchen
     * @date 2019-07-09
     */
    onDataBeforeFormdata = formData => {
        let iprojectid = formData.findWidgetByName("iprojectid");//归属项目
        if (iprojectid) {
            if (iprojectid.field.fieldProps.initialValue == undefined ||
                iprojectid.field.fieldProps.initialValue == null ||
                iprojectid.field.fieldProps.initialValue == '') {
                iprojectid.field.props.initialName = ''
            }
        }
        //自动带出时间
        let dcreatordate = formData.findWidgetByName('dcreatordate')
        if (dcreatordate && !dcreatordate.field.fieldProps.initialValue) {
            dcreatordate.field.fieldProps.initialValue = new Date()
        }
        return formData;
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this;
        console.log('formData', formData);
        console.log('handlers', handlers);
        let deptid = vp.cookie.getTkInfo('idepartmentid');
        console.log("vp.cookie.getTkInfo('userid'):" + vp.cookie.getTkInfo('userid'));
        console.log("vp.cookie.getTkInfo('userid'):" + vp.cookie.getTkInfo('idepartmentid'));
        //默认屏蔽两个节点
        let scondition = formData.findWidgetByName('scondition');
        scondition.field.props.disabled = true;
        // if(scondition){
        //     scondition.field.props.options_.map(item=>{
        //         if(vp.cookie.getTkInfo('idepartmentid')=='1147'){
        //             // item.value=='SYSA'?item.hidden=true:null
        //             item.value=='SYSB'?item.hidden=true:null 
        //         }else{
        //     scondition.field.props.disabled = true;
        //             // vpQuery('/{bjyh}/bgxt/checkDept', {  dept:vp.cookie.getTkInfo('idepartmentid')  }).then((res) => {
        //             //         console.log("res11111:"+res);
        //             //         if(res>0){
        //             //             item.value=='SYSA'?item.hidden=true:null
        //             //             // item.value=='SYSB'?item.hidden=true:null 
        //             //         }
        //             // })
        //         }
        //     })
        // }

        // 选择项目自动带出预设处理人信息
        var rxtmc = formData.findWidgetByName("rxtmc");
        if (rxtmc != null) {
            rxtmc.field.fieldProps.onChange = function (value) {
                vpQuery('/{bjyh}/bgxt/checkBgxt', { projectid: value, method: 'getchuliren01_1' }).then((response) => {
                    for (let index = 0; index < handlers.length; index++) {
                        let key = handlers[index].stepkey;
                        let label = key + '_label';
                        if (handlers[index].stepname == "信科部负责人维护变更系统相关信息") {
                            _this.props.form.setFieldsValue({
                                [key]: response.id1,
                                [label]: response.name1,
                            })
                        } else if (handlers[index].stepname == "开发部负责人维护变更系统相关信息") {
                            _this.props.form.setFieldsValue({
                                [key]: response.id2,
                                [label]: response.name2,
                            })
                        } else if (handlers[index].stepname == "运维部负责人维护变更系统相关信息") {
                            _this.props.form.setFieldsValue({
                                [key]: response.id3,
                                [label]: response.name3,
                            })
                        }
                    }
                })

                vpQuery('/{bjyh}/bgxt/checkBgxt1', { projectid: value }).then((response) => {
                    handlers;
                    formData;
                    let formDatatemp = _this.props.formData.form;
                    formDatatemp.groups[1] = response.data.form.groups[1];
                    formDatatemp.groups[3] = response.data.form.groups[2];
                    formDatatemp.groups[6] = response.data.form.groups[3];
                    //formDatatemp.groups[1].group_type = 2;
                    //formDatatemp.groups[3].group_type = 2;
                    formDatatemp.groups[6].group_type = 2;
                    let formData = formDataToWidgetProps(formDatatemp, _this);
                    formData = _this.onDataBeforeFormdata(formData);
                    //提供调用者拦截数据
                    _this.onDataLoadSuccess(formData);
                    _this.setState({
                        formData: formData,
                    })
                })
            }
        }
    }

    /**
    * 表单加载之前动作
    * @param data
    */
    onGetFormDataSuccess(data) {
        let _this = this
        let scondition = findFiledByName(data.form, 'scondition')
        console.log("vp.cookie.getTkInfo('idepartmentid')111111:" + vp.cookie.getTkInfo('idepartmentid'));
        if (vp.cookie.getTkInfo('idepartmentid') == '1147') {
            data.scondition = 'SYSA'
            scondition.field.widget.default_value = 'SYSA'
        } else {
            return new Promise(resolve => {
                vpAdd('/{bjyh}/bgxt/checkDept', {
                    dept: vp.cookie.getTkInfo('idepartmentid'),
                }).then(res => {
                    console.log("res:" + res);
                    if (res > 0) {
                        scondition.field.widget.default_value = 'SYSB'
                        data.scondition = 'SYSB'
                    }
                    resolve(data)
                })
            })
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
        console.log("scondition", scondition)
        console.log("_this", _this)
    }
}
bgxt01FlowForm = FlowForm.createClass(bgxt01FlowForm);
export default bgxt01FlowForm;