import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";


//分行APP上线申请 运营部领导审批
class yybldsp extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("yybldsp");
    }
    onGetFormDataSuccess(data) {
        let _this = this
        console.log("data", data)
        console.log("data", data.handlers.length)

        data.handlers.map(item=>{
            console.log("item",item);
            if(item.flag==='SYSL'){//业务部领导审批 
                vpQuery('/{bjyh}/FhApp/queryYydb', {piid:_this.props.piid
                }).then((response) => {
                    console.log("开发部负责人（分配资源）",response)
                    if (response.data.totalRows == 1) { 
                        let res = response.data.resultList
                        console.log("res",res)
                            item.names=res[0].sname
                            item.ids=res[0].iid
                    }         
                })                         
            }
        }) 
         
    }

     
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'syybldspyj', true)
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
        let flag = e.target.value == 'SYSRK' ? true : false
        validationRequireField(_this, 'syybldspyj', flag)
    }
/**
     * 表单数据加载成功后
     * @param formData
     */
   onDataLoadSuccess = (formData, handlers) => {
        let _this=this
       
        console.log("_this", _this)
        console.log("_this", _this.props.piid)
        //判断运营代表
        vpQuery('/{bjyh}/FhApp/queryYydb', {piid:_this.props.piid
            }).then((response) => {
                console.log("开发部负责人（分配资源）",response)
                if (response.data.totalRows == 1) { 
                    let res = response.data.resultList
                    console.log("res",res)
                    _this.state.handlers.map(item=>{
                        console.log("[item.stepkey]",[item.stepkey])
                        if(item.flag==='SYSL'){ 
                            _this.props.form.setFieldsValue({
                                [item.stepkey]:res[0].iid,
                                [item.stepkey+'_label']:res[0].sname
                            })
                        }
                    })
                }         
            }) 
    }

}

yybldsp = FlowForm.createClass(yybldsp);
export default yybldsp;