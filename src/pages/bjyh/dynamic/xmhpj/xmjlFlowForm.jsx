import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation, validationRequireField,singleInputFill } from '../code';
import moment from "moment";


//项目后评价项目经理 审批节点
class  xmjlFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log("xmjlFlowForm") ;
        // console.log("date",this) ;
    }



     /**
     * 表单数据加载成功后
     * @param formDat
     */
    onDataLoadSuccess = (formData,handlers) => {
        let _this=this;
        var sxmbh = formData.findWidgetByName("sxmbh");
        console.log("sxmbh",sxmbh.field.fieldProps.initialValue)
        vpQuery('/{bjyh}/ZKsecondSave/queryProjectRole',{
            Projectcode:sxmbh.field.fieldProps.initialValue
        }).then((response)=>{
            if(response.data.length > 0){
                let res = response.data
                for (let j = 0; j < res.length; j++) {
                    console.log("res[i].rolename",res[j].rolename);
                    if(res[j].rolename=="需求提出人"){
                        _this.props.form.setFieldsValue({
                            'rbgsqbm':res[j].iuserid+''||'',//id
                            'rbgsqbm_label': res[j].username+''||''//显示的汉字
                        })
                    }
                }  
            }
        })
    }

    onGetFormDataSuccess = data => {
        let sxmbh = findWidgetByName.call(data.form,'sxmbh')
        console.log("sxmbh",sxmbh.field.widget.default_value)
        console.log(" data.handlers", data.handlers)
        return new Promise(resolve => {
            vpQuery('/{bjyh}/ZKsecondSave/queryProjectRole',{Projectcode:sxmbh.field.widget.default_value
            }).then((response) => {
                if (response.data.length > 0) {
                    let res = response.data
                    for (var i = 0; i <   data.handlers.length; i++) {
                        // console.log("stepname",data.handlers[i].stepname)
                        if(data.handlers[i].stepname=="项目提出部门进行后评价"){
                            for (let j = 0; j < res.length; j++) {
                                // console.log("res[i].rolename",res[j].rolename);
                                if(res[j].rolename=="需求提出人"){
                                    // console.log("res[i].iuserid",res[j].iuserid);
                                    // console.log("res[i].iuserid",res[j].username);
                                    
                                    data.handlers[i].ids = res[j].iuserid+''||''
                                    data.handlers[i].names = res[j].username+''||''
                                }
                            }   
                        }
                        else if( data.handlers[i].stepname=="开发部门进行后评价"){
                            for (let j = 0; j < res.length; j++) {
                                // console.log("res[i].rolename",res[j].rolename);
                                if(res[j].rolename=="开发负责人"){
                                    data.handlers[i].ids = res[j].iuserid+''||''
                                    data.handlers[i].names = res[j].username+''||''
                                }
                            }   
                        }else if( data.handlers[i].stepname=="运营部门进行后评价"){
                            for (let j = 0; j < res.length; j++) {
                                // console.log("res[j].rolename",res[j].rolename);
                                if(res[j].rolename=="运营代表"){
                                    data.handlers[i].ids = res[j].iuserid+''||''
                                    data.handlers[i].names = res[j].username+''||''
                                }
                            }   
                        }
                    } 
                    resolve(data)
                }else{
                    resolve(data)
                }
            })
        })
    }
    
}

xmjlFlowForm=FlowForm.createClass(xmjlFlowForm);
export default xmjlFlowForm;