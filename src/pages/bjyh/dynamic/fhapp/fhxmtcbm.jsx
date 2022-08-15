import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";


//分行APP上线申请 业务代表节点
class fhxmtcbm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("fhxmtcbm");
    }
    onGetFormDataSuccess(data) {
        let _this = this
        console.log("data", data)
        console.log("data", data.handlers.length)
        let handlers = data.handlers

        var rxmtcfh = findWidgetByName.call(data.form,'rxmtcfh')
        console.log("rxmtcfh",rxmtcfh);
        console.log("rxmtcfh",rxmtcfh.field.widget.default_value);
        
         

        let newOptions1 = data.handlers;
        let newOptions2 = [];
        console.log("iobjectid", _this.props.iobjectid)
        console.log("projectid", _this.props.iobjectid)
        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/FhApp/queryFenhang', { name:'分行科技领导',deptid: rxmtcfh.field.widget.default_value
            }).then((response) => {
                console.log("response.data",response);
                
                if (response.data) {
                    let res = response.data
                    let xmjl_kffzr =res.sname 
                    let ids = res.iid
                    // 根据分行信息带出对应的分行负责人
                    for (var i = 0; i < data.handlers.length; i++) {
                        console.log(data.handlers[i].flag)
                        if (data.handlers[i].flag == "SYSE") {
                            data.handlers[i].ids = ids
                            data.handlers[i].names = xmjl_kffzr 
                        } 
                    }

                    console.log("newOptions1", newOptions1)
                    console.log("newOptions2", newOptions2) 
                    console.log("data", data)
                    resolve(data)
                } else {
                    resolve(data)
                }
            })
        })
        return promise
    }

     
    /**
     * 表单数据加载成功后
     * @param formData
     */
    // onDataLoadSuccess = (formData,handlers) => {
    //     let _this = this;
  
    // }
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'sfhxmtcbmldspyj', true)
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
        
        let flag = e.target.value == 'SYSRA' ? true : false
        validationRequireField(_this, 'sfhxmtcbmldspyj', flag)
    }

}

fhxmtcbm = FlowForm.createClass(fhxmtcbm);
export default fhxmtcbm;