import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation,validationRequireField,singleInputFill} from '../code';
import moment from "moment";


//项目 需求分析 流程 相关部门审核 审批节点
class  xqfxXgbmshFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log("xqfxXgbmshFlowForm") ;
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
                        if(data.handlers[i].flag=="SYSD"){
                            data.handlers[i].ids = ids
                            data.handlers[i].names = fzr
                        }
                        if(data.handlers[i].flag=="SYSE"){
                            data.handlers[i].ids = ids
                            data.handlers[i].names = fzr
                        }

                    }
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

        let ssjglzxyj= formData.findWidgetByName('ssjglzxyj')
        let ssjzlbgsyj= formData.findWidgetByName('ssjzlbgsyj')
        let syyglbyj= formData.findWidgetByName('syyglbyj')
        let sdgzyyj= formData.findWidgetByName('sdgzyyj')
        let sgrzyyj= formData.findWidgetByName('sgrzyyj')
        let sflhgbyj= formData.findWidgetByName('sflhgbyj')
        let shxxtyj= formData.findWidgetByName('shxxtyj')
        let lspqk= _this.props.form.getFieldsValue(['sjlspqk'])
        //科技管理意见
        let sxxkjglbyj= formData.findWidgetByName('sxxkjglbyj')

        vpQuery('/{bjyh}/xqfx/getXqfxStepPS', { piid: _this.props.piid
        }).then((response) => {
                console.log("response",response);
                let data=response.data;
                if(data.flag){
                    ssjglzxyj.field.fieldProps.initialValue=data.ssjglzxyj;
                    syyglbyj.field.fieldProps.initialValue=data.syyglbyj;
                    sdgzyyj.field.fieldProps.initialValue=data.sdgzyyj;
                    sgrzyyj.field.fieldProps.initialValue=data.sgrzyyj;
                    sflhgbyj.field.fieldProps.initialValue=data.sflhgbyj;
                    shxxtyj.field.fieldProps.initialValue=data.shxxtyj;
                    sxxkjglbyj.field.fieldProps.initialValue=data.sxxkjglbyj;
                    setTimeout(() => {
                        let eobj = {target:{value:''}}
                        _this.props.form.setFieldsValue({scondition:'SYSD'})
                        eobj.target.value='SYSD'
                        _this.handleCondition(eobj)
                    }, 1000);
                }
                
        })

        console.log("lspqk",lspqk);
        console.log("handlers",handlers) 
        return new Promise(resolve => {
            this.getThisRole((res) => {
                if (res != null) {
                    // 开发负责人与项目经理是不是同一人 需要
                    console.log("res",res);
                    
                    if (res.length >0) {
                        console.log("res",res[0].stext);
                        if(res[0].stext=="数据治理办公室"){
                                // ssjglzxyj.field.hidden = true;
                                ssjzlbgsyj.field.hidden = true;
                                syyglbyj.field.hidden = true;
                                sdgzyyj.field.hidden = true;
                                sgrzyyj.field.hidden = true;
                                sflhgbyj.field.hidden = true;
                                shxxtyj.field.hidden = true;
                                sxxkjglbyj.field.hidden = true;
                                
                                //记录审批情况
                                let sjlspqk= formData.findWidgetByName('sjlspqk')
                                console.log("sjlspqk",sjlspqk);
                                if(sjlspqk!=null){
                                    console.log("sjlspqk",sjlspqk.field.fieldProps.initialValue);
                                    let sj=sjlspqk.field.fieldProps.initialValue.substring(0,1)
                                    let sjs=sjlspqk.field.fieldProps.initialValue.substring(1,sjlspqk.field.fieldProps.initialValue.length)
                                    _this.props.form.setFieldsValue({
                                        sjlspqk:"1"+sjs
                                    })
                                }
                        // }else if(res[0].stext=="数据治理办公室"){
                        //         ssjglzxyj.field.hidden = true;
                        //         // ssjzlbgsyj.field.hidden = true;
                        //         syyglbyj.field.hidden = true;
                        //         sdgzyyj.field.hidden = true;
                        //         sgrzyyj.field.hidden = true;
                        //         sflhgbyj.field.hidden = true;
                        //         shxxtyj.field.hidden = true;
                                // sxxkjglbyj.field.hidden = true;

                        //         //记录审批情况
                        //         let sjlspqk= formData.findWidgetByName('sjlspqk')
                        //         console.log("sjlspqk",sjlspqk);
                        //         if(sjlspqk!=null){
                        //             console.log("sjlspqk",sjlspqk.field.fieldProps.initialValue);
                        //             let left=sjlspqk.field.fieldProps.initialValue.substring(0,2)
                        //             let right=sjlspqk.field.fieldProps.initialValue.substring(3,sjlspqk.field.fieldProps.initialValue.length)
                        //             _this.props.form.setFieldsValue({
                        //                 sjlspqk:left+"1"+right
                        //             })
                        //         }
                        }else if(res[0].stext=="运营管理部"){
                                ssjglzxyj.field.hidden = true;
                                ssjzlbgsyj.field.hidden = true;
                                // syyglbyj.field.hidden = true;
                                sdgzyyj.field.hidden = true;
                                sgrzyyj.field.hidden = true;
                                sflhgbyj.field.hidden = true;
                                shxxtyj.field.hidden = true;
                                sxxkjglbyj.field.hidden = true;

                                //记录审批情况
                                let sjlspqk= formData.findWidgetByName('sjlspqk')
                                console.log("sjlspqk",sjlspqk);
                                if(sjlspqk!=null){
                                    console.log("sjlspqk",sjlspqk.field.fieldProps.initialValue);
                                    let left=sjlspqk.field.fieldProps.initialValue.substring(0,4)
                                    let right=sjlspqk.field.fieldProps.initialValue.substring(5,sjlspqk.field.fieldProps.initialValue.length)
                                    _this.props.form.setFieldsValue({
                                        sjlspqk:left+"1"+right
                                    })
                                }
                        }else if(res[0].stext=="对公摘要"){
                                ssjglzxyj.field.hidden = true;
                                ssjzlbgsyj.field.hidden = true;
                                syyglbyj.field.hidden = true;
                                // sdgzyyj.field.hidden = true;
                                sgrzyyj.field.hidden = true;
                                sflhgbyj.field.hidden = true;
                                shxxtyj.field.hidden = true;
                                sxxkjglbyj.field.hidden = true;

                                //记录审批情况
                                let sjlspqk= formData.findWidgetByName('sjlspqk')
                                console.log("sjlspqk",sjlspqk);
                                if(sjlspqk!=null){
                                    console.log("sjlspqk",sjlspqk.field.fieldProps.initialValue);
                                    let left=sjlspqk.field.fieldProps.initialValue.substring(0,6)
                                    let right=sjlspqk.field.fieldProps.initialValue.substring(7,sjlspqk.field.fieldProps.initialValue.length)
                                    _this.props.form.setFieldsValue({
                                        sjlspqk:left+"1"+right
                                    })
                                }
                        }else if(res[0].stext=="个人摘要"){
                                ssjglzxyj.field.hidden = true;
                                ssjzlbgsyj.field.hidden = true;
                                syyglbyj.field.hidden = true;
                                sdgzyyj.field.hidden = true;
                                // sgrzyyj.field.hidden = true;
                                sflhgbyj.field.hidden = true;
                                shxxtyj.field.hidden = true;
                                sxxkjglbyj.field.hidden = true;

                                //记录审批情况
                                let sjlspqk= formData.findWidgetByName('sjlspqk')
                                console.log("sjlspqk",sjlspqk);
                                if(sjlspqk!=null){
                                    console.log("sjlspqk",sjlspqk.field.fieldProps.initialValue);
                                    let left=sjlspqk.field.fieldProps.initialValue.substring(0,8)
                                    let right=sjlspqk.field.fieldProps.initialValue.substring(9,sjlspqk.field.fieldProps.initialValue.length)
                                    _this.props.form.setFieldsValue({
                                        sjlspqk:left+"1"+right
                                    })
                                }
                        }else if(res[0].stext=="法律合规部"){
                                ssjglzxyj.field.hidden = true;
                                ssjzlbgsyj.field.hidden = true;
                                syyglbyj.field.hidden = true;
                                sdgzyyj.field.hidden = true;
                                sgrzyyj.field.hidden = true;
                                // sflhgbyj.field.hidden = true;
                                shxxtyj.field.hidden = true;
                                sxxkjglbyj.field.hidden = true;

                                //记录审批情况
                                let sjlspqk= formData.findWidgetByName('sjlspqk')
                                console.log("sjlspqk",sjlspqk);
                                if(sjlspqk!=null){
                                    console.log("sjlspqk",sjlspqk.field.fieldProps.initialValue);
                                    let left=sjlspqk.field.fieldProps.initialValue.substring(0,10)
                                    let right=sjlspqk.field.fieldProps.initialValue.substring(11,sjlspqk.field.fieldProps.initialValue.length)
                                    _this.props.form.setFieldsValue({
                                        sjlspqk:left+"1"+right
                                    })
                                }
                        }else if(res[0].stext=="核心系统"){
                                ssjglzxyj.field.hidden = true;
                                ssjzlbgsyj.field.hidden = true;
                                syyglbyj.field.hidden = true;
                                sdgzyyj.field.hidden = true;
                                sgrzyyj.field.hidden = true;
                                sflhgbyj.field.hidden = true;
                                // shxxtyj.field.hidden = true;
                                sxxkjglbyj.field.hidden = true;

                                //记录审批情况
                                let sjlspqk= formData.findWidgetByName('sjlspqk')
                                console.log("sjlspqk",sjlspqk);
                                if(sjlspqk!=null){
                                    console.log("sjlspqk",sjlspqk.field.fieldProps.initialValue);
                                    let left=sjlspqk.field.fieldProps.initialValue.substring(0,12)
                                    let right=sjlspqk.field.fieldProps.initialValue.substring(13,sjlspqk.field.fieldProps.initialValue.length)
                                    _this.props.form.setFieldsValue({
                                        sjlspqk:left+"1"+right
                                    })
                                }
                        }else if(res[0].stext=="科技管理"){
                            ssjglzxyj.field.hidden = true;
                            ssjzlbgsyj.field.hidden = true;
                            syyglbyj.field.hidden = true;
                            sdgzyyj.field.hidden = true;
                            sgrzyyj.field.hidden = true;
                            sflhgbyj.field.hidden = true;
                            shxxtyj.field.hidden = true;
                            // sxxkjglbyj.field.hidden = true;

                            //记录审批情况
                            let sjlspqk= formData.findWidgetByName('sjlspqk')
                            console.log("sjlspqk",sjlspqk);
                            if(sjlspqk!=null){
                                console.log("sjlspqk",sjlspqk.field.fieldProps.initialValue);
                                let left=sjlspqk.field.fieldProps.initialValue.substring(0,14)
                                let right=sjlspqk.field.fieldProps.initialValue.substring(15,sjlspqk.field.fieldProps.initialValue.length)
                                _this.props.form.setFieldsValue({
                                    sjlspqk:left+"1"+right
                                })
                            }
                    }
                    }
                }
                resolve(formData)
            })
        })

    }

    onBeforeSave(formData, btnName) {
        let _this = this  
        console.log("_this",_this);
        //流程步骤通用定制
            // return new Promise(resolve => {
            return new Promise(resolve => {
                if (btnName == 'ok') {
                    this.getThisRole((res) => {
                        if (res != null) {
                            console.log("res",res);
                            if (res.length >0) {
                                console.log("res",res[0].stext);
                                if(res[0].stext=="数据治理办公室"){
                                    singleInputFill(formData, btnName, 'ssjglzxyj', true)
                                // }else if(res[0].stext=="数据治理办公室"){
                                //     singleInputFill(formData, btnName, 'ssjzlbgsyj', true)
                                }else if(res[0].stext=="运营管理部"){
                                    singleInputFill(formData, btnName, 'syyglbyj', true)
                                }else if(res[0].stext=="对公摘要"){
                                    singleInputFill(formData, btnName, 'sdgzyyj', true)
                                }else if(res[0].stext=="个人摘要"){
                                    singleInputFill(formData, btnName, 'sgrzyyj', true)
                                }else if(res[0].stext=="法律合规部"){
                                    singleInputFill(formData, btnName, 'sflhgbyj', true)
                                }else if(res[0].stext=="核心系统"){
                                    singleInputFill(formData, btnName, 'shxxtyj', true)
                                }else if(res[0].stext=="科技管理"){
                                    singleInputFill(formData, btnName, 'sxxkjglbyj', true)
                                }
                            }
                            // resolve(formData)
                        }
                        // resolve(formData)
                        resolve(formData)
                    },()=>{
                        resolve(formData)
                    })
                }else{
                    resolve(formData)
                }  
            })
            // console.log("promise:",promise);
            // return false
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
        let flag = e.target.value == 'SYSE' ? true : false
        
        _this.getThisRole((res) => {
            if (res != null) {
                // 开发负责人与项目经理是不是同一人 需要
                console.log("res",res);
                if (res.length >0) {
                    console.log("res",res[0].stext);
                    if(res[0].stext=="数据治理办公室"){
                        validationRequireField(_this, 'ssjglzxyj', flag)
                    // }else if(res[0].stext=="数据治理办公室"){
                    //     validationRequireField(_this, 'ssjzlbgsyj', flag)
                    }else if(res[0].stext=="运营管理部"){
                        validationRequireField(_this, 'syyglbyj', flag)
                    }else if(res[0].stext=="对公摘要"){
                        validationRequireField(_this, 'sdgzyyj', flag)
                    }else if(res[0].stext=="个人摘要"){
                        validationRequireField(_this, 'sgrzyyj', flag)
                    }else if(res[0].stext=="法律合规部"){
                        validationRequireField(_this, 'sflhgbyj', flag)
                    }else if(res[0].stext=="核心系统"){
                        validationRequireField(_this, 'shxxtyj', flag)
                    }else if(res[0].stext=="科技管理"){
                        validationRequireField(_this, 'sxxkjglbyj', flag)
                    }
                }
            }
        })
        
    }

    /**
     * 获取当前登录人在该项目中的角色
     * @param callback
     */
    getThisRole(callback) {
        let _this = this
        let userid=vp.cookie.getTkInfo('userid');
        vpQuery('/{bjyh}/xqfx/queryUsernameByXqtcr',{ Sname:vp.cookie.getTkInfo("nickname")
        }).then((response) => {
            console.log("response",response);
            console.log("response.data.length",response.data.length);
            if (response.data.length > 0) {
                let res = response.data
                callback(res)
            }
            callback(null)
        })
    }
}
 
xqfxXgbmshFlowForm=FlowForm.createClass(xqfxXgbmshFlowForm);
export default xqfxXgbmshFlowForm;