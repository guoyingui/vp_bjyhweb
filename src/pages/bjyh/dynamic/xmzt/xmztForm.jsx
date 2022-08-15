import React, { Component } from "react";

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery, VpAlertMsg, VpConfirm} from "vpreact";

//项目暂停
class  xmztForm extends DynamicForm.Component{
    constructor(props){
        super(props);
        console.log('xmztForm',this);
    }
    //保存前
    onBeforeSave(formData,btnName){
        let flag = true;
        let iid = this.props.iobjectid;
        let projectid =  this.props.form.getFieldsValue(['sxmbh']);
        let zttcr =  this.props.form.getFieldsValue(['rbgsqbm']);
         console.log("zttcr", zttcr);
         console.log("btnName", btnName);
        if(btnName == "ok"||btnName=="saveAndNew"||btnName=="saveAndFlow"){
            return  new Promise(resolve => {
                vpQuery('/{bjyh}/ZKsecondSave/queryXqtcrByProjectId',{ projectid: projectid.sxmbh,zttcr:zttcr.rbgsqbm
                }).then((response) => {
                    console.log("response.data",response.data);
                    if(response.data == false){
                        VpAlertMsg({
                            message:"消息提示",
                            description: "对不起，您不能在该项目下新建流程！",
                            type:"error",
                            onClose:this.onClose,
                            closeText:"关闭",
                            showIcon: true
                        }, 5) ;
                        resolve(false);
                    }else{
                        resolve(true);
                    }
                })
            })
        }
    }
    //自定义控件行为
    onDataLoadSuccess = formData => {
        //默认带出当前登录人
        let _this=this;
        console.log('xmztForm',formData);
        console.log('tkinfo',vp.cookie.getTkInfo())
        //获取字段
        let rbgsqbm = formData.findWidgetByName('rbgsqbm')
        //若存在
        if(rbgsqbm){
            _this.props.form.setFieldsValue({
                'rbgsqbm':vp.cookie.getTkInfo('userid'),//id
                'rbgsqbm_label':vp.cookie.getTkInfo('nickname')//显示的汉字
            })

        }

        //选择项目自动带出项目编号
        var rxmmc = formData.findWidgetByName("rxmmc");
        var sxmbh = formData.findWidgetByName("sxmbh");
        var sname = formData.findWidgetByName("sname");
          //选择项目时 状态为启动
        rxmmc.field.props.modalProps.condition=[{
            field_name:'istatusid',
            field_value:'5',
            expression:'in'
        }]
        if(rxmmc!=null){
            console.log('rxmmc11112 ');
            console.log('rxmmc11112 2222');
            rxmmc.field.fieldProps.onChange = function(value){
                vpQuery('/{vpplat}/vfrm/entity/getRowData',{
                    entityid:"7", iid:value, viewcode:"vpm_pj_project"
                }).then((response)=>{
                    if(response.data != null){
                        let data = response.data
                        console.log('data',data);
                        if(data.istatusid!=5){
                            VpAlertMsg({
                                message:"消息提示",
                                description: "非【启动】状态的项目不可以发起暂停流程！",
                                type:"error",
                                onClose:this.onClose,
                                closeText:"关闭",
                                showIcon: true
                            }, 5) ;
                            //清空项目
                            console.log("----")

                            _this.props.form.setFieldsValue({
                                'rxmmc':null,//id
                                'rxmmc_label':null//显示的汉字
                            })
                            _this.props.form.setFieldsValue({sxmbh:null});
                        }else{
                            //带出项目编号
                            if(sxmbh != null){ _this.props.form.setFieldsValue({sxmbh:data.scode}); }
                            if(sname != null){ _this.props.form.setFieldsValue({sname:data.sname+"_项目暂停"}); }
                        }


                    }
                })
            }
        }
    }


}
xmztForm=DynamicForm.createClass(xmztForm);
export default xmztForm;