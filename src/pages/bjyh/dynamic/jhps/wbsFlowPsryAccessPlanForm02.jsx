import React, { Component } from "react";
import { vpQuery,vpAdd,VpMWarning } from 'vpreact';
import accessPlanFlowForm from "../flowAccess/accessPlanFlowForm";
import { fileValidation } from '../code'
import { findFiledByName } from 'utils/utils';

/**
 * 阶段需求评审流程的【发起需求评审】审批节点、阶段业务测试用例评审流程的【发起业务测试用例评审】审批节点中的“评审人员”字段中自动带出项目的“开发负责人”“项目经理”“需求提出人”“测试负责人”四个字段的内容
 */
class wbsFlowPsryAccessPlanForm extends accessPlanFlowForm.Component {
    constructor(props) {
        super(props);
    }
      //数据加载成功
    onDataLoadSuccess = (formData,handlers) => {
        let _this=this;
        let rsynproject = formData.findWidgetByName('rsynproject');
        console.log("rsynproject:",rsynproject);
        var projectid =formData.findWidgetByName("rsynproject").field.fieldProps.initialValue;
        console.log("projectid:",projectid);
         //84-5需求
         //2、阶段设计评审流程的【发起设计评审】审批节点中的“评审人员”字段中自动带出项目的“开发负责人”“项目经理”“运营代表”三个字段的内容
        vpQuery('/{bjyh}/xqfx/queryProjectRole',{ iid: projectid,flag:2
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
wbsFlowPsryAccessPlanForm = accessPlanFlowForm.createClass(wbsFlowPsryAccessPlanForm);
export default wbsFlowPsryAccessPlanForm;