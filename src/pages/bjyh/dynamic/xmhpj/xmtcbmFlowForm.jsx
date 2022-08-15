import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import {  xmsxsq, fileValidation, validationRequireField,singleInputFill } from '../code';
import moment from "moment";


//项目提出部门进行后评价 审批节点
class  xmjlFlowForm extends FlowForm.Component{
    constructor(props){
        super(props);
        console.log("xmjlFlowForm") ;
        // console.log("date",this) ;
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
                        if(data.handlers[i].stepname=="项目经理确认"){
                            for (let j = 0; j < res.length; j++) {
                                // console.log("res[i].rolename",res[j].rolename);
                                if(res[j].rolename=="项目经理"){
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
    
	onDataLoadSuccess = formData => {
        let _this = this;
        console.log("formData",formData)
        /**
         * 项目管理系统（六期）项目 54.后评价内容限制，不少于50字，增加填写提示
         * 项目后评价中需求满足度、应用效果、预算执行情况、实施过程评价、外包公司服务水平、系统运行情况六个字段中填写内容不能少于50字，
         * 少于50字时系统提示：需求满足度/应用效果/预算执行情况/实施过程评价/外包公司服务水平/系统运行情况填写内容不可少于50字。
         * 以上六个字段中有对应模板文字，用户可在此文字上进行修改后提交流程 。
         */       
        vpPostAjax(
            '/{bjyh}/ZKsecondSave/queryPlaceholder'
            ,{}
            ,'GET'
            ,function(data){
                if(data){
                    debugger;
                    //1.需求满足度
                    let sxqmzd = formData.findWidgetByName('sxqmzd');
                    sxqmzd.field.props.placeholder = data.sxqmzd;                    
                    if(sxqmzd.field.props.readOnly !=true && sxqmzd.field.props.disabled !=true && sxqmzd.field.fieldProps.rules[0].required == true ){
                        sxqmzd.field.fieldProps.rules[0].message = '请输入50~1000个字符!';
                        sxqmzd.field.fieldProps.rules.push({validator: _this.contentValidator})    
                        if(!sxqmzd.field.fieldProps.initialValue){
                            sxqmzd.field.fieldProps.initialValue =  data.sxqmzd;
                        }               
                    }
                    //2.应用效果
                    let syyxg = formData.findWidgetByName('syyxg');
                    syyxg.field.props.placeholder = data.syyxg;                   
                    if(syyxg.field.props.readOnly !=true && syyxg.field.props.disabled !=true && syyxg.field.fieldProps.rules[0].required == true ){
                        syyxg.field.fieldProps.rules[0].message = '请输入50~1000个字符!';
                        syyxg.field.fieldProps.rules.push({validator: _this.contentValidator})      
                        if(!syyxg.field.fieldProps.initialValue){
                            syyxg.field.fieldProps.initialValue =  data.syyxg;
                        }             
                    }    
                    //3.预算执行情况
                    let syszxqk = formData.findWidgetByName('syszxqk');
                    syszxqk.field.props.placeholder = data.syszxqk;                   
                    if(syszxqk.field.props.readOnly !=true && syszxqk.field.props.disabled !=true && syszxqk.field.fieldProps.rules[0].required == true ){
                        syszxqk.field.fieldProps.rules[0].message = '请输入50~1000个字符!';
                        syszxqk.field.fieldProps.rules.push({validator: _this.contentValidator})  
                        if(!syszxqk.field.fieldProps.initialValue){
                            syszxqk.field.fieldProps.initialValue =  data.syszxqk;
                        }                 
                    } 
                    //4.实施过程评价
                    let sssbm = formData.findWidgetByName('sssbm');
                    sssbm.field.props.placeholder = data.sssbm;                   
                    if(sssbm.field.props.readOnly !=true && sssbm.field.props.disabled !=true && sssbm.field.fieldProps.rules[0].required == true ){
                        sssbm.field.fieldProps.rules[0].message = '请输入50~1000个字符!';
                        sssbm.field.fieldProps.rules.push({validator: _this.contentValidator})  
                        if(!sssbm.field.fieldProps.initialValue){
                            sssbm.field.fieldProps.initialValue =  data.sssbm;
                        }                 
                    } 
                    //5.外包公司服务水平
                    let swbgs = formData.findWidgetByName('swbgs');
                    swbgs.field.props.placeholder = data.swbgs;                   
                    if(swbgs.field.props.readOnly !=true && swbgs.field.props.disabled !=true && swbgs.field.fieldProps.rules[0].required == true ){
                        swbgs.field.fieldProps.rules[0].message = '请输入50~1000个字符!';
                        swbgs.field.fieldProps.rules.push({validator: _this.contentValidator})  
                        if(!swbgs.field.fieldProps.initialValue ){
                            swbgs.field.fieldProps.initialValue =  data.swbgs;
                        }                 
                    } 
                    //6.系统运行情况填
                    let syxqk = formData.findWidgetByName('syxqk');
                    syxqk.field.props.placeholder = data.syxqk;                    
                    if(syxqk.field.props.readOnly !=true && syxqk.field.props.disabled !=true && syxqk.field.fieldProps.rules[0].required == true ){
                        syxqk.field.fieldProps.rules[0].message = '请输入50~1000个字符!';
                        syxqk.field.fieldProps.rules.push({validator: _this.contentValidator})     
                        if(!syxqk.field.fieldProps.initialValue ){
                            syxqk.field.fieldProps.initialValue =  data.syxqk;
                        }              
                    } 
                }
            }
        );
    }
    
    //项目管理系统（六期）项目 54.后评价内容限制，不少于50字
    contentValidator = (rule, value, callback) => {
        if (value && value.length >= 50 ) {
            callback();
        } else {
            setTimeout(() => {
                if (value.length < 50 ) {
                    callback([new Error('内容不可少于50字')]);
                } else {
                    callback();
                }
            }, 800);
        }
    }
}

xmjlFlowForm=FlowForm.createClass(xmjlFlowForm);
export default xmjlFlowForm;