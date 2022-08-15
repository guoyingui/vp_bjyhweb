import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";


//分行APP上线申请 京智办公开发运营代表审批节点
class jzbgyydb extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("jzbgyydb");
    }
    onGetFormDataSuccess(data) {
        let _this = this
        console.log("data", data)
        console.log("data", data.handlers.length)

        var ssfzjdyyb = findWidgetByName.call(data.form,'ssfzjdyyb')
        console.log("ssfzjdyyb",ssfzjdyyb.field.widget.default_value); 
        //默认屏蔽两个节点
        let scondition = findWidgetByName.call(data.form,'scondition')
        if(scondition){
            scondition.field.widget.load_template.map(item=>{
                    if(ssfzjdyyb.field.widget.default_value==1){
                        item.value=='SYSH'?item.hidden=true:null 
                        // item.value=='SYSQ'?item.hidden=true:null
                        // item.value=='SYSRC'?item.hidden=true:null
                        scondition.field.widget.default_value='SYSQ'
                        data.scondition = 'SYSQ'
                    }else{
                        // item.value=='SYSH'?item.hidden=true:null 
                        item.value=='SYSQ'?item.hidden=true:null
                        // item.value=='SYSRC'?item.hidden=true:null 
                        scondition.field.widget.default_value='SYSH'
                        data.scondition = 'SYSH'
                    }
                        
            })
        }

        var rxmmc =  findWidgetByName.call(data.form,'rxmmc')
        console.log("rxmmc",rxmmc);
        console.log("rxmmc",rxmmc.field.widget.default_value);

        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/FhApp/queryFenhangXmjl', {
                rxmmc:rxmmc.field.widget.default_value
            }).then((response) => {
                console.log("response",response);
                
                if (response.data) {
                    let res = response.data 
                    console.log("res",res);
                    
                    // 自动获取该项目的项目经理和开发负责人
                    for (var i = 0; i < data.handlers.length; i++) {
                        if (data.handlers[i].flag == "SYSH") {
                            data.handlers[i].ids =res.iid
                            data.handlers[i].names = res.sname
                        }
                    }
                    resolve(data)
                }else{
                    resolve(data)
                } 
            })
        })
        return promise
    }

     
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'syydbshyj', true)
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
        console.log("scondition",scondition)
        console.log("_this",_this)
        if(scondition=="SYSRC"){
            //拒绝：设置【是否直接到项目经理】=2
            // 是否直接到项目经理 sywzjdxmjl 
            _this.props.form.setFieldsValue({
                'sywzjdxmjl':"2"
            })
        }
        let flag = e.target.value == 'SYSRC' ? true : false
        validationRequireField(_this, 'syydbshyj', flag)
    }
/**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = (formData,handlers) => {

        let _this=this
        //判断开发部领导
        var ryybzzsp = formData.findWidgetByName("ryybzzsp");
        console.log("ryybzzsp", ryybzzsp)
        console.log("ssfzjdyyb", ryybzzsp.field.props.widget.default_label)
        console.log("ssfzjdyyb", ryybzzsp.field.props.initialName)
        console.log("idepartmentid", vp.cookie.getTkInfo('idepartmentid'))
        console.log("ryybzzsp", ryybzzsp)
        vpQuery('/{bjyh}/FhApp/queryYybld', {deptname:"系统运营部"
    }).then((response) => {
        console.log("开发部负责人（分配资源）",response)
        if (response.data.totalRows > 1) {
            ryybzzsp.field.props.modalProps.ajaxurl='/{bjyh}/FhApp/queryYybld';
            ryybzzsp.field.props.modalProps.condition=["系统运营部"];
        }else{
            let res = response.data.resultList
            console.log("res",res)
            _this.props.form.setFieldsValue({
                'ryybzzsp':res[0].iid,//id
                'ryybzzsp_label':res[0].sname//显示的汉字
            })                 
        }           
    }) 
        if(ryybzzsp.field.props.widget.default_label!=undefined){
            ryybzzsp.field.hidden = true;
        }
    }

}

jzbgyydb = FlowForm.createClass(jzbgyydb);
export default jzbgyydb;