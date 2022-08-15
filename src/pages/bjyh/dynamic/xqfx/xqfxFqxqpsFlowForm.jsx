import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation,validationRequireField,singleInputFill} from '../code';
import moment from "moment";
import accessPlanFlowForm from "../flowAccess/accessPlanFlowForm";

//项目 需求分析 流程 相关部门审核 审批节点
class  xqfxFqxqpsFlowForm extends accessPlanFlowForm.Component{
    constructor(props){
        super(props);
        console.log("xqfxFqxqpsFlowForm") ;
        console.log("date",this) ;  this.state.moduserprops={
            ismoduser:true,//是否启用更改处理人
         }
    }
    //数据加载前
    onGetFormDataSuccess = data => {
        let _this = this 
        console.log(_this.props.piid);
        
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
                    for (var i = 0; i < data.handlers.length; i++) {
                        console.log(data.handlers.length)
                            data.handlers[i].ids = ids
                            data.handlers[i].names = fzr
                    }
                    resolve(data)
                } else {
                    resolve(data)
                }
            })
        })
        return promise
    }
    //数据加载成功
    onDataLoadSuccess = (formData,handlers) => {
        let _this=this;
        //84-5需求5、1）需求分析流程的【发起需求评审】审批节点、项目计划评审流程的【发起计划评审】审批节点、
        // 阶段需求评审流程的【发起需求评审】审批节点、
        // 阶段业务测试用例评审流程的【发起业务测试用例评审】审批节点中的“评审人员”
        // 字段中自动带出项目的“开发负责人”“项目经理”“需求提出人”“测试负责人”四个字段的内容
        vpQuery('/{bjyh}/xqfx/queryProjectRole',{ iid: _this.props.iobjectid,flag:1
            }).then((response) => {
                console.log("response",response);
                
                 if(response!=null){
                    _this.props.form.setFieldsValue({
                        'rpsry':response.userids,//id
                        'rpsry_label':response.usernames//显示的汉字
                    })
                 }
            })
    }
   
}
 
xqfxFqxqpsFlowForm=FlowForm.createClass(xqfxFqxqpsFlowForm);
export default xqfxFqxqpsFlowForm;