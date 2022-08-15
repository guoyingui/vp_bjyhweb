import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import { VpRadio, VpRadioGroup,vpQuery } from 'vpreact';

import {findFiledByName} from 'utils/utils';
import {singleInputFill, validationRequireField} from "../code";

//继承流程表单
class ywdbtjsqFlowForm extends FlowForm.Component {

    constructor(props) {
        super(props);
    }

    onDataLoadSuccess = (formData,_handlers) => {
        let _this = this;
        console.log(_this,formData)

        //业务部领导只有一人时自动带出
        let sparam = {
            condition:[{
                field_name: 'idepartmentid',
                field_value: vp.cookie.getTkInfo('idepartmentid'),
                flag: '3'
            }],
        }
        vpQuery('/{bjyh}/xzxt/getUser', {
            sparam:JSON.stringify(sparam)
        }).then(res =>{
            if(res.data){
                if(res.data.resultList.length===1){
                    let userData = res.data.resultList[0]
                    _this.state.handlers.map(item=>{
                        //if(item.flag==='SYSS'){
                            item.names = userData.sname
                            item.ids = userData.iid
                            _this.props.form.setFieldsValue({
                                [item.stepkey]:userData.iid ,
                                [item.stepkey+'_label']:userData.sname
                            })
                        //}
                    })
                }
                
            }
        })
    
    }

    onGetFormDataSuccess = data => {
        //流程用户组增加过滤条件(部门)
        let dptid = vp.cookie.getTkInfo('idepartmentid')//部门
        data.handlers.map(item=>{
            //业务部领导审批
            item.searchCondition = [{
                field_name: 'idepartmentid',
                field_value: dptid,
                flag: '3'
            }]
            item.ajaxurl = '/{bjyh}/xzxt/getUser';
            
        })
    }
}

ywdbtjsqFlowForm=FlowForm.createClass(ywdbtjsqFlowForm);
export default ywdbtjsqFlowForm;