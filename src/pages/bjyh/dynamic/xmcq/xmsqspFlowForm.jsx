import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import { VpRadio, VpRadioGroup,vpQuery } from 'vpreact';

import {findFiledByName} from 'utils/utils';
import {singleInputFill, validationRequireField} from "../code";

//继承流程表单
class   xmsqspFlowForm extends FlowForm.Component {

    constructor(props) {
        super(props);
        console.log('xmsqspFlowForm', this);
        this.state.moduserprops={
                        ismoduser:true,//是否启用更改处理人
                    }
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        let _this = this

        let handlers = data.handlers
        for (let i = 0; i < data.handlers.length; i++) {
            if (handlers[i].hasOwnProperty('flag') && handlers[i].flag == 'SYSA') {
                return new Promise(resolve => {
                    vpQuery('/{bjyh}/xqbg/getHandlerForIsZxzjxt',{ tableName: 'BOBJ_PROJECT_RESTART_EXT', entityId: _this.props.iobjectid
                    }).then((response) => {
                        if (response.data != null) {
                            let res = response.data
                            let hqld_label = ''
                            let hqld = ''
                            // 自动获取该项目的相关负责人
                            for (let j = 0; j < res.length; j++) {
                                hqld += res[j].iuserid + ','
                                hqld_label += res[j].sname + ','
                            }
                            hqld = hqld.substring(0, hqld.length - 1)
                            hqld_label = hqld_label.substring(0, hqld_label.length - 1)
                            data.handlers[i].ids = hqld
                            data.handlers[i].names = hqld_label
                        }
                        resolve(data)
                    })
                })
            }
        }
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSB' ? true : false
        validationRequireField(_this, 'sxmsqbmyj', flag)
    }

    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, "sxmsqbmyj", true)
    }

   // handleCondition(e){    //单选框  0为同意分支 ，1为拒绝分支
   //      super.handleCondition(e);
   //      let scondition = e.target.value;
   //      let nm=vp.cookie.getTkInfo("nickname");
   //     console.log(scondition+"------------"+nm);
   //     if(scondition == "SYSB"){
   //         this.props.form.resetFields(['sxmsqbmyj']);
   //         let rules = this.state.formData.findWidgetByName("sxmsqbmyj").field.fieldProps.rules;
   //         rules[1] = {required:true,message:"此处必输,并填写拒绝意见和签批人"};
   //         this.props.form.validateFields(['sxmsqbmyj'],{force:true});
   //
   //     }else{
   //         this.props.form.resetFields(['sxmsqbmyj']);
   //         let rules = this.state.formData.findWidgetByName("sxmsqbmyj").field.fieldProps.rules;
   //         rules[1] = {required:false,message:""};
   //         /*    let ap=`同意 \n签批人：（${nm+")"}`;
   //         this.props.form.setFieldsValue({"sxmsqbmyj":ap});*/
   //     }
   //
   //  }
   //  /**
   //   * 提交保存之前进行审批意见赋值
   //   * @param formData
   //   * @param btnName
   //   */
   //  onBeforeSave = (formData, btnName) => {
   //      singleInputFill(formData, btnName, "sxmsqbmyj", true)
        // let _this=this;
        // let values=this.props.form.getFieldValue("sxmsqbmyj");
        // let nm = vp.cookie.getTkInfo("nickname");
        // let ap=``;
        // let sparam=JSON.parse(formData.sparam);
        // if(btnName='ok'){
        //     if(values==''){
        //         ap=`同意 \n签批人：${nm}`;
        //     }else {
        //         ap=values+`\n签批人：${nm}`;
        //     }
        //     sparam["sxmsqbmyj"]=ap;
        //     formData.sparam = JSON.stringify(sparam);
        // }
        //   return true;
    // }

    // onGetFormDataSuccess(formData){
    //     let rxmmcField = findFiledByName(formData.form,'rxmmc');
    //
    //     if(!rxmmcField){
    //         return;
    //     }
    //     let projectid = rxmmcField.field.widget.default_value;
    //     if(projectid == null){
    //         return;
    //     }
    //     return new Promise(resolve => {
    //         vpQuery('{vpplat}/vfrm/entity/getRowData', {
    //             entityid:"7", iid:projectid,viewcode: "vpm_pj_project"
    //         }).then((response) => {
    //             if (response.data != null) {
    //                 let data = response.data;
    //                 console.log("data",data);
    //                 let isfwzxyhzjxtxm = data.isfwzxyhzjxtxm; //是否为直销银行系统标志
    //                 //信息科技管理部   004692 王曦
    //                 // 软件开发部     005195  马晓煦
    //                 let userid="";
    //                 let name="";
    //                 console.log("isfwzxyhzjxtxm="+isfwzxyhzjxtxm);
    //                 //如果是银行直销系统，直接在数据库里把 马晓煦改为张华
    //                 vpQuery(`/{bjyh}/xmcq/queryXqbg`,{isfwzxyhzjxtxm:isfwzxyhzjxtxm}).then((response) => {
    //                     if (response.data != null) {
    //                         let res = response.data;
    //                         for (let i = 0; i <res.length ; i++) {
    //                             userid +=res[i].iid+ ",";
    //                             name +=res[i].sname+ ",";
    //                         }
    //                             userid=userid.substring(0,userid.length-1);
    //                             name=name.substring(0,name.length-1);
    //                          /*   if (isfwzxyhzjxtxm == '0') {  //是 为 马晓煦，王曦
    //                                 name.replace(/马晓煦/, "张华");
    //                             }*/
    //                             //遍历handlers  取出flag
    //                         let hand=formData.handlers;
    //                         for (let i = 0; i < hand.length; i++) {
    //                               let flag=hand[i].flag;
    //                               if (flag=="SYSA"){
    //                                   hand[i].ids=  userid;
    //                                   hand[i].names= name ;
    //                               } else {
    //                                   hand[i].ids= vp.cookie.getTkInfo('userid');
    //                                   hand[i].names= vp.cookie.getTkInfo('nickname');
    //                               }
    //                         }
    //                         console.log(userid+"-----" +name);
    //                 }
    //                     resolve(formData);
    //             })
    //
    //
    //             }else{
    //                 resolve(formData);
    //             }
    //     })
    // })
    // }
    //  onDataLoadSuccess = formData => {
    //      let _this= this;
    //      let rcDialogTitle0 = formData.findWidgetByName('rcDialogTitle0');
    //      let mc = "";
    //      let rxmmcField = formData.findWidgetByName('rxmmc');//根据项目id寻找 项目再去找其他属性
    //      if(!rxmmcField){
    //         return;
    //      }
    //
    //
    //  }

}

xmsqspFlowForm=FlowForm.createClass(xmsqspFlowForm);
export default xmsqspFlowForm;