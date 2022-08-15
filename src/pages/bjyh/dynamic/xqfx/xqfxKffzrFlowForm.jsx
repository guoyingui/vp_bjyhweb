import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation,singleInputFill} from '../code';
import moment from "moment";


//项目 需求分析 流程 项目经理提交 审批节点
class  xqfxKffzrFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log("xqfxKffzrFlowForm") ;
        console.log("date",this) ; 
    }
    //数据加载前
    onGetFormDataSuccess = data => {
        let _this = this 
       // 需求评审：默认流程发起人员，即<项目经理提交流程>环节发起人 SYSA,'SYSB','SYSC 3个节点都有可能走
       let promise = new Promise(resolve => {
        // vpQuery('/{bjyh}/ZKXmsxFrom/queryPiidByUsers', {
        //     ppid: _this.props.piid, stepKey: "SYSA','SYSB','SYSC",tableName:'WFENT_XQFXLC'
        vpQuery('/{bjyh}/xqfx/queryByProjectid', { iid: _this.props.iobjectid
        }).then((response) => {
            let fzr = ''
            let ids = ''
            if (response.data.length > 0) {
                let res = response.data
                for (let i = 0; i < res.length; i++) {
                        // ids += res[i].iid + ','
                        // fzr += res[i].sname + ','
                        if (res[i].rolename == "项目经理") {
                            ids += res[i].iuserid + ','
                            fzr += res[i].username + ','
                        }
                }
                ids = ids.substring(0, ids.length - 1)
                fzr = fzr.substring(0, fzr.length - 1)
                console.log("ids", ids)
                console.log("fzr", fzr)
                // 默认流程发起人员，即<项目经理提交流程>环节发起人 
                
                data.handlers[0].ids = ids
                data.handlers[0].names = fzr
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
        console.log("piid",_this.props.piid);
        //如果是拒绝回来的则显示拒绝原因
        vpQuery('/{bjyh}/ZKsecondSave/searchJj',{
            piid:_this.props.piid,name:'项目经理确认评估工作量',userid:vp.cookie.getTkInfo().userid,entityname:"WFENT_XQFXLC"
        }).then(res=>{
            console.log(res);
            
            if(res.flag){
                VpAlertMsg({
                    message:'项目经理确认评估工作量处理意见',
                    description:''+res.message, 
                    closeText:'关闭',
                    type:'info', 
                    showIcon:true
                },30);
            }
        })
         
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
 
xqfxKffzrFlowForm=FlowForm.createClass(xqfxKffzrFlowForm);
export default xqfxKffzrFlowForm;