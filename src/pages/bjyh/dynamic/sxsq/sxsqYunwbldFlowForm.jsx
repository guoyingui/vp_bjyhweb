import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation, validationRequireField,singleInputFill } from '../code';
import moment from "moment";


//项目上线申请流程 运维部领导 审批节点
class  sxsqYunwbldFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log("sxsqYunwbldFlowForm") ; 
        console.log("date",this) ; 
    }
    onGetFormDataSuccess = data => {
        let _this = this
        console.log("_this", _this)
        console.log("projectid", _this.props.iobjectid)
        console.log("piid", _this.props.piid)
        // 执行人执行：默认<开发负责人提供上线文档>环节运营代表审批人员
        let  promise = new Promise(resolve => {
            vpQuery('/{bjyh}/ZKXmsxFrom/queryPiidByUsers',{ ppid:_this.props.piid,stepKey:'SYSK',tableName:'WFENT_SXSQLC'
            }).then((response) => {
                let fzr = ''
                let ids = ''
                if (response.data.length > 0) {
                    let res = response.data
                    for (let i = 0; i < res.length; i++) {
                            ids += res[i].iid + ','
                            fzr += res[i].sname + ','
                    }
                    ids = ids.substring(0, ids.length - 1)
                    fzr = fzr.substring(0, fzr.length - 1)
                    console.log("ids",ids)
                    console.log("fzr",fzr)
                    // 默认<开发负责人提供上线文档>环节运营代表审批人员
                    for (var i = 0; i <   data.handlers.length; i++) {
                        if(data.handlers[i].flag=="SYSZB"){
                            data.handlers[i].ids = ids
                            data.handlers[i].names = fzr
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
            singleInputFill(formData, btnName, 'syybldspyj', true)
        }
    }
  //自定义控件行为
  onDataLoadSuccess = formData => {
    let _this=this;
    //是否通过1
    let iywyzsftg11=formData.findWidgetByName('iywyzsftg');
    iywyzsftg11.field.props.label="是否通过";
    //是否返回业务1
    let isffhyw11=formData.findWidgetByName('isffhyw1');
    isffhyw11.field.props.label="是否返回业务";
    //是否与需求符合6
    let ixqfh66=formData.findWidgetByName('ixqfh6');
    ixqfh66.field.props.label="是否与需求符合";
    //是否与需求符合7
    let ixqfh77=formData.findWidgetByName('ixqfh7');
    ixqfh77.field.props.label="是否与需求符合";

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
        if(scondition=="SYSZC"){
            //拒绝：设置【是否直接到运营部】=3
            // 是否直接到运营部 ssfzjdyyb 是否直接到业务部领导 ssfzjdywbld  业务直返运营项目 sywzfyyxm 
            _this.props.form.setFieldsValue({
                'ssfzjdyyb':"3"
            })
        }
        
        let flag = e.target.value == 'SYSZC' ? true : false
        validationRequireField(_this, 'syybldspyj', flag)
    }
        
}

sxsqYunwbldFlowForm=FlowForm.createClass(sxsqYunwbldFlowForm);
export default sxsqYunwbldFlowForm;