import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation,validationRequireField,singleInputFill} from '../code';
import moment from "moment";
import accessFlowForm from '../flowAccess/accessFlowForm'

//项目 需求分析 流程 需求评审 审批节点
class  xqfxXqpsFlowForm extends accessFlowForm.Component{
    constructor(props){
        super(props);
        console.log("xqfxXqpsFlowForm") ;
        console.log("date",this) ; 
        this.state.addtype=4

    }
    //数据加载前
    onGetFormDataSuccess = data => {
        let _this = this 
        
        let scode = findWidgetByName.call(data.form,'scode');
        console.log("scode",scode)
        console.log("piid",_this.props.piid )
        console.log("iobjectid",_this.props.iobjectid )
        //"预设处理人：
        // 开发负责人评估工作量：默认项目【开发负责人】"
        if(scode){
            let  promise = new Promise(resolve => {
                // vpQuery('/{bjyh}/xqfx/queryXqtcrByProjectId',{ Scode: scode.field.widget.default_value,Sname:'开发负责人'
                vpQuery('/{bjyh}/xqfx/queryByProjectid', { iid: _this.props.iobjectid
                }).then((response) => {
                    if (response.data.length > 0) {
                        let res = response.data
                        let xmjl_kffzr = ''
                        let ids = ''
                        
                        let xmjl = ''
                        let xmjlids = ''
                        for (let i = 0; i < res.length; i++) {
                                if (res[i].rolename == "开发负责人") {
                                    ids += res[i].iuserid + ','
                                    xmjl_kffzr += res[i].username + ','
                                }else  if (res[i].rolename == "项目经理") {
                                    xmjlids += res[i].iuserid + ','
                                    xmjl += res[i].username + ','
                                }
                        }
                        console.log("开发负责人：",ids+"---"+xmjl_kffzr);
                        console.log("项目经理",xmjlids+"---"+xmjl);
                        
                        ids = ids.substring(0, ids.length - 1)
                        xmjl_kffzr = xmjl_kffzr.substring(0, xmjl_kffzr.length - 1)

                        
                        xmjlids = xmjlids.substring(0, xmjlids.length - 1)
                        xmjl = xmjl.substring(0, xmjl.length - 1)
                        console.log("ids",ids )
                        console.log("xmjl_kffzr",xmjl_kffzr )
                        
                        console.log("开发负责人：",ids+"---"+xmjl_kffzr);
                        console.log("项目经理",xmjlids+"---"+xmjl);
                        // 自动获取该项目的项目经理和开发负责人
                        for (var j = 0; j <   data.handlers.length; j++) { 
                            console.log( data.handlers[j].flag)
                            if(data.handlers[j].flag=="SYSF"){
                                data.handlers[j].ids = ids
                                data.handlers[j].names = xmjl_kffzr
                            }else if(data.handlers[j].flag=="SYSG"){
                                data.handlers[j].ids = xmjlids
                                data.handlers[j].names = xmjl
                            }
                        }
                        resolve(data)
                    }else{
                        resolve(data)
                    }
                })
            })
            return promise;




        
    }
    }
    //数据加载成功方法
    onDataLoadSuccess = (formData,handlers) => {
        let _this=this
        console.log("handlers",handlers) 
    }
    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value
        console.log("scondition",scondition);
       
        let flag = e.target.value == 'SYSG' ? true : false
        validationRequireField(_this, 'sdescription', flag)
        
    }
}
 
xqfxXqpsFlowForm=FlowForm.createClass(xqfxXqpsFlowForm);
export default xqfxXqpsFlowForm;