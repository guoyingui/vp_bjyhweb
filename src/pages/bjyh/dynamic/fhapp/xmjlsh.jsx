import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";


//分行APP上线申请 项目经理审批节点
class xmjlsh extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("xmjlsh");
    }
    onGetFormDataSuccess(data) {
        let _this = this
        console.log("data", data)
        console.log("data", data.handlers.length)
         
        var sxmbh = findWidgetByName.call(data.form,'sxmbh')
        console.log("sxmbh",sxmbh);
        console.log("sxmbh",sxmbh.field.widget.default_value);


        let newOptions1 = data.handlers;
        let newOptions2 = [];
        console.log("iobjectid", _this.props.iobjectid)
        console.log("projectid", _this.props.iobjectid)
        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/FhApp/queryKfbld', { sxmbh: sxmbh.field.widget.default_value
            }).then((response) => {
                console.log("response.data",response);
                if (response.data) {
                    let res = response.data
                    let xmjl_kffzr =res.resultList[0].sname 
                    let ids = res.resultList[0].iid
                    // 根据分行信息带出对应的分行负责人
                    for (var i = 0; i < data.handlers.length; i++) {
                        console.log(data.handlers[i].flag)
                        if (data.handlers[i].flag == "SYSI") {
                            data.handlers[i].ids =ids,//id
                            data.handlers[i].names = xmjl_kffzr//显示的汉字 
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
     * @param formDat
     */
    onDataLoadSuccess = (formData,handlers) => {
        let _this=this
        
        //是否返回业务 isffhyw  是否返回开发 isffhkf 是否返回运营 isffhyy
        // 0： 是 1：否
        let isffhyw = formData.findWidgetByName('isffhyw')
        let isffhkf = formData.findWidgetByName('isffhkf')
        let isffhyy = formData.findWidgetByName('isffhyy')
        


        //默认屏蔽两个节点
        let scondition = formData.findWidgetByName('scondition')
        if(scondition){
            scondition.field.props.options_.map(item=>{
                        // item.value=='SYSI'?item.hidden=true:null    //提交上线
                        // item.value=='SYSRD'?item.hidden=true:null //开发
                        item.value=='SYSRO'?item.hidden=true:null //开发
                        item.value=='SYSRH'?item.hidden=true:null //开发
            })
        }
        

        // //全部默认为1 否 
        _this.props.form.setFieldsValue({
            isffhyw:"1",
            isffhkf:"1",
            isffhyy:"1"
        })
        //3个隐藏返回值
        var sywzjdxmjl = formData.findWidgetByName("sywzjdxmjl");
        let ywzjdxmjl=sywzjdxmjl.field.fieldProps.initialValue;
        console.log("sywzjdxmjl",ywzjdxmjl);

        
        var sjzsfzjdxmjl = formData.findWidgetByName("sjzsfzjdxmjl");
        let jzsfzjdxmjl=sjzsfzjdxmjl.field.fieldProps.initialValue;
        console.log("sjzsfzjdxmjl",jzsfzjdxmjl);

        var ssfzjdyyb = formData.findWidgetByName("ssfzjdyyb");
        let sfzjdyyb=ssfzjdyyb.field.fieldProps.initialValue;
        console.log("ssfzjdyyb",sfzjdyyb);



        //监听是否返回业务
        isffhyw.field.fieldProps.onChange = function (v) {
            console.log("TEST 监听！"+isffhyw); 
            isffhyw.field.checked=true;
            let value = v.target.value;
            console.log("value",value);
            let eobj = {target:{value:''}}
            //0 是 1否
            //监听是否返回业务=是， 其他两项则为否 
            if(value==0){
                //返回业务代表 拒绝意见必填 
                validationRequireField(_this,'sxmjlshyj',true );
                //其他两项只读
                isffhkf.field.props.disabled = true;
                isffhyy.field.props.disabled = true;
                _this.props.form.setFieldsValue({
                    isffhkf:"1",//0： 是 1：否
                    isffhyy:"1",//0： 是 1：否
                    sywzjdxmjl:"3"
                })
                scondition.field.props.options_.map(item=>{
                    if(item.value=='SYSRD'){
                        item.hidden=false
                    }else if(item.value=='SYSRO'){
                        item.hidden=true
                    }else if(item.value=='SYSRH'){
                        item.hidden=true
                    }
                })
                _this.props.form.setFieldsValue({scondition:'SYSRD'})
                eobj.target.value='SYSRD'
                _this.handleCondition(eobj)
                       
            }else{
                //返回业务代表 取消拒绝意见必填 
                validationRequireField(_this,'sxmjlshyj',false );

                _this.props.form.setFieldsValue({ 
                    sywzjdxmjl:ywzjdxmjl
                })
                //取消其他两项只读
                isffhkf.field.props.disabled = false;
                isffhyy.field.props.disabled = false;

                _this.props.form.setFieldsValue({scondition:'SYSI'})
                eobj.target.value='SYSI'
                _this.handleCondition(eobj)
            }
        }

        //监听是否返回开发isffhkf
        isffhkf.field.fieldProps.onChange = function (v) {
            console.log("TEST 监听！"+isffhkf); 
            isffhkf.field.checked=true;
            let value = v.target.value;
            console.log("value",value);
            let eobj = {target:{value:''}}
            //0 是 1否
            //监听是否返回开发=是， 其他两项则为否 
            if(value==0){
                //返回开发 拒绝意见必填 
                validationRequireField(_this,'sxmjlshyj',true );
                //其他两项只读
                isffhyw.field.props.disabled = true;
                isffhyy.field.props.disabled = true;
                _this.props.form.setFieldsValue({
                    isffhyw:"1",//0： 是 1：否
                    isffhyy:"1",//0： 是 1：否
                    sjzsfzjdxmjl:"1"
                })
                scondition.field.props.options_.map(item=>{
                    if(item.value=='SYSRD'){
                        item.hidden=true
                    }else if(item.value=='SYSRO'){
                        item.hidden=false
                    }else if(item.value=='SYSRH'){
                        item.hidden=true
                    }
                })
                _this.props.form.setFieldsValue({scondition:'SYSRO'})
                eobj.target.value='SYSRO'
                _this.handleCondition(eobj)
            }else{
                //返回开发 取消拒绝意见必填 
                validationRequireField(_this,'sxmjlshyj',false );
                _this.props.form.setFieldsValue({ 
                    sjzsfzjdxmjl:jzsfzjdxmjl
                })
                //取消其他两项只读
                isffhyw.field.props.disabled = false;
                isffhyy.field.props.disabled = false;

                _this.props.form.setFieldsValue({scondition:'SYSI'})
                eobj.target.value='SYSI'
                _this.handleCondition(eobj)
            }
        }

         //监听是否返回运营isffhyy
         isffhyy.field.fieldProps.onChange = function (v) {
            console.log("TEST 监听！"+isffhyy); 
            isffhyy.field.checked=true;
            let value = v.target.value;
            console.log("value",value);
            let eobj = {target:{value:''}}
            //0 是 1否
            //监听是否返回开发=是， 其他两项则为否 
            if(value==0){
                //返回开发 拒绝意见必填 
                validationRequireField(_this,'sxmjlshyj',true );
                //其他两项只读
                isffhyw.field.props.disabled = true;
                isffhkf.field.props.disabled = true;
                _this.props.form.setFieldsValue({
                    isffhyw:"1",//0： 是 1：否
                    isffhkf:"1",//0： 是 1：否
                    ssfzjdyyb:"0"
                })
                scondition.field.props.options_.map(item=>{
                    if(item.value=='SYSRD'){
                        item.hidden=true
                    }else if(item.value=='SYSRO'){
                        item.hidden=true
                    }else if(item.value=='SYSRH'){
                        item.hidden=false
                    }
                })
                _this.props.form.setFieldsValue({scondition:'SYSRH'})
                eobj.target.value='SYSRH'
                _this.handleCondition(eobj)

                
            }else{
                //返回开发 取消拒绝意见必填 
                validationRequireField(_this,'sxmjlshyj',false );
                _this.props.form.setFieldsValue({ 
                    ssfzjdyyb:sfzjdyyb
                })
                //取消其他两项只读
                isffhyw.field.props.disabled = false;
                isffhkf.field.props.disabled = false;

                _this.props.form.setFieldsValue({scondition:'SYSI'})
                eobj.target.value='SYSI'
                _this.handleCondition(eobj)
            }
        }

    }




     
    onBeforeSave(formData, btnName) {
        let _this = this  
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'sxmjlshyj', true)
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
        // if(scondition=="SYSRD"){
        //     //拒绝：设置【是否直接到项目经理】=3
        //     // 是否直接到项目经理 sywzjdxmjl 
        //     _this.props.form.setFieldsValue({
        //         'sywzjdxmjl':"3"
        //     })
        // }
        // let flag = e.target.value == 'SYSRD' ? true : false
    }


}

xmjlsh = FlowForm.createClass(xmjlsh);
export default xmjlsh;