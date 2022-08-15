import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation} from '../code';
import moment from "moment";


//项目 需求分析 流程 需求提出人 审批节点
class  xqfxXqtcrFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log("xqfxXqtcrFlowForm") ;
        console.log("date",this) ; 
    }
    //数据加载前
    onGetFormDataSuccess = data => {
        let _this = this 

        console.log("iobjectid", _this.props.iobjectid)
        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/xqfx/queryByProjectid', { iid: _this.props.iobjectid
            }).then((response) => {
                if (response.data.length > 0) {
                    let res = response.data
                    let xmjl_kffzr = ''
                    let ids = ''
                    for (let i = 0; i < res.length; i++) {
                        console.log("res[i].rolename", res[i].rolename)
                        if (res[i].rolename == "项目经理") {
                            ids += res[i].iuserid + ','
                            xmjl_kffzr += res[i].username + ','
                        }
                    }
                    ids = ids.substring(0, ids.length - 1)
                    xmjl_kffzr = xmjl_kffzr.substring(0, xmjl_kffzr.length - 1)
                    // 自动获取该项目的项目经理和开发负责人
                    for (var i = 0; i < data.handlers.length; i++) {
                        console.log(data.handlers[i].flag)
                        // if (data.handlers[i].flag == "SYSA") {
                            data.handlers[i].ids = ids
                            data.handlers[i].names = xmjl_kffzr
                        // }
                        
                    }
                    console.log("data", data)
                    resolve(data)
                } else {
                    resolve(data)
                }
            })
        })
        return promise
       
    }
    //数据加载成功方法
    onDataLoadSuccess = (formData,handlers) => {
        let _this=this
        console.log("handlers",handlers) 
        
        let iyspc = formData.findWidgetByName('iyspc') 
        console.log("iyspc",iyspc) 
        console.log("iyspc",iyspc.field.fieldProps.initialValue) 
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
        if(iyspc.field.fieldProps.initialValue==0){
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
        }else if(iyspc.field.fieldProps.initialValue==1){
            sysbh2.field.hidden = true;
            sysbh3.field.hidden = true;
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc2.field.hidden = true;
            sysmc3.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        }else if(iyspc.field.fieldProps.initialValue==2){
            sysbh3.field.hidden = true;
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc3.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        } else if(iyspc.field.fieldProps.initialValue==3){
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        } else if(iyspc.field.fieldProps.initialValue==4){
            sysbh5.field.hidden = true;
            sysmc5.field.hidden = true;
        } 
        
    }
    
}
 
xqfxXqtcrFlowForm=FlowForm.createClass(xqfxXqtcrFlowForm);
export default xqfxXqtcrFlowForm;