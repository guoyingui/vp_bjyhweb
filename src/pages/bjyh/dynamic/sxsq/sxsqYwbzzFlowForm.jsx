import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation, validationRequireField,singleInputFill } from '../code';
import moment from "moment";


//项目上线申请流程 运维部组长 审批节点
class  sxsqYwbzzFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log("sxsqYwbldFlowForm") ;
        console.log("date",this) ; 
        this.state.moduserprops={
            ismoduser:true,//是否启用更改处理人
            ajaxurl:'',//数据源接口地址：不定义则使用默认地址
            moduserCondition:[{//更改处理人用户列表查询条件
                 field_name:'idepartmentid',
                 field_value:"1110",//系统运营部
                 expression:'in'
             }]//系统运营部
         }
    }
    // onGetFormDataSuccess = data => {
    //     let _this = this
    //     let  promise = new Promise(resolve => {
    //         vpQuery('/{bjyh}/ZKXmsxFrom/queryNameByUsers',{ Sname:'运维部领导'
    //         }).then((response) => {
    //             console.log("运维部领导",response)

    //             let rywbldfzr = ''
    //             let ids = ''
    //             if (response.data.length > 0) {
    //                 let res = response.data
    //                 for (let i = 0; i < res.length; i++) {
    //                         ids += res[i].iid + ','
    //                         rywbldfzr += res[i].sname + ','
    //                 }
    //                 ids = ids.substring(0, ids.length - 1)
    //                 rywbldfzr = rywbldfzr.substring(0, rywbldfzr.length - 1)
    //                 console.log("ids",ids)
    //                 console.log("rywbldfzr",rywbldfzr)
    //                 // 自动获取业务部领导负责人
    //                 for (var i = 0; i <   data.handlers.length; i++) {
    //                     console.log( data.handlers[i].flag)
    //                     if(data.handlers[i].flag=="SYSZ"){
    //                         data.handlers[i].ids = ids
    //                         data.handlers[i].names = rywbldfzr
    //                     }
    //                 }  
    //                 resolve(data)
    //             }else{
    //                 resolve(data)
    //             }
    //         })
    //     })
    //     return promise  
    // }
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
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'syybzzspyj', true)
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
        if(scondition=="SYSZA"){
            //拒绝：设置【是否直接到运营部】=2
            // 是否直接到运营部 ssfzjdyyb  
            _this.props.form.setFieldsValue({
                'ssfzjdyyb':"2"
            })
        }
        let flag = e.target.value == 'SYSZA' ? true : false
        validationRequireField(_this, 'syybzzspyj', flag)
    }

}

sxsqYwbzzFlowForm=FlowForm.createClass(sxsqYwbzzFlowForm);
export default sxsqYwbzzFlowForm;