import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

import { VpRadio, VpRadioGroup,vpQuery } from 'vpreact';

import {findFiledByName} from 'utils/utils';
import {singleInputFill} from "../code";


class  xmcqXxForm extends FlowForm.Component {

    constructor(props) {
        super(props);
        console.log('xmcqXxForm', this);
    }

    handleCondition(e) {    //单选框  0为同意分支 ，1为拒绝分支
        super.handleCondition(e);
        let scondition = e.target.value;
        let nm = vp.cookie.getTkInfo("nickname");
        console.log(scondition + "------------" + nm);
        let _this = this;
        //判断部门，然后回写及校验必填
         this.getDpt((res)=>{
             if(res!=null){
                 let dpt=res;
                 if (scondition == "SYSC") {
                     _this.props.form.resetFields([dpt]);
                     let rules1 = _this.state.formData.findWidgetByName(dpt).field.fieldProps.rules;
                     rules1[1] = {required:false,message:""};
                     /*     let ap=`同意 \n签批人：${nm}`;
                          _this.props.form.setFieldsValue({[tmp]:ap});
                          _this.props.form.validateFields([tmp],{force:true});*/
                 } else if(scondition == "SYSD"){
                     _this.props.form.resetFields([dpt]);
                     let rules = _this.state.formData.findWidgetByName(dpt).field.fieldProps.rules;
                     rules[1] = {required:true,message:"此处必输,并填写拒绝意见和签批人"};
                     _this.props.form.validateFields([dpt],{force:true});

                 }
                 _this.forceUpdate();
             }

         })

    }
    //获取该登录人所在部门
    getDpt(callback){
        vpQuery(`/{bjyh}/xmcq/queryBm`, {userid: vp.cookie.getTkInfo('userid')}).then((response) => {
            if (response.data != null) {
                let sname = response.data;
               // let dpt = sname == "软件开发部" ? 'srjkfbyj' : 'sxxkjglbyj';
                let dpt = sname == "信息科技管理部" ? 'sxxkjglbyj' : 'srjkfbyj';

                callback(dpt);
            }
        })
    }

    //onBeforeSave 保存前事件，覆盖此接口能实现对保存数据做一些逻辑操作
   onBeforeSave(formData,btnName){
        console.log("btnName="+btnName);
            let _this = this;
            let nm = vp.cookie.getTkInfo("nickname");
            let op='';
           let sparam=JSON.parse(formData.sparam);
                return  new Promise(resolve => {
                    this.getDpt((res) =>{
                     let dpt=res;
                        //如果同意意见没有填写，自动填写,不同意的话有必填校验
                        /*   let values=this.props.form.getFieldValue(dpt);
                              if(values==null&&values==''){
                                  op=`同意 \n签批人：${nm}`;
                              }else {
                                  op=values+`\n签批人：${nm}`;
                              }
                                   sparam[dpt]=op;
                               formData.sparam=JSON.stringify(sparam);*/
                        singleInputFill(formData, btnName, dpt, true);
                        resolve(formData);
                    })
                })

            return true;
        }

    onGetFormDataSuccess(formData){
        let _this = this;
        console.log("formData" + formData);
        return new Promise(resolve => {
            vpQuery(`/{bjyh}/xmcq/queryBm`, {userid: vp.cookie.getTkInfo('userid')}).then((response) => {
                if (response.data != null) {
                    let sname = response.data;
                    let srjkfbyj = findFiledByName(formData.form,'srjkfbyj');//软件开发部意见
                    let sxxkjglbyj = findFiledByName(formData.form,'sxxkjglbyj');//信息管理科技部意见
                    let rxmmc = findFiledByName(formData.form,'rxmmc').field.widget.default_label;
                    vpQuery('/{bjyh}/xmcq/queryXmjl', {sname:rxmmc}).then((response) => {   // 查询项目经理
                        if (response.data != null) {
                            let res = response.data;
                            let iid = res[0].iid;
                            let nm = res[0].sname;
                            let hand=formData.handlers;
                            for (let i = 0; i < hand.length; i++) {
                                let flag=hand[i].flag;
                                if (flag=="SYSC"){
                                    hand[i].ids=  iid+"";
                                    hand[i].names= nm ;
                                } else if(flag=="SYSD"){
                                    //hand[i].ids= vp.cookie.getTkInfo().userid+"";
                                    //hand[i].names= vp.cookie.getTkInfo().nickname;
                                }
                                console.log("iid="+iid+"nm="+nm);
                            }
                            resolve(formData);
                        }
                    })

                    if (sname == "信息科技管理部") {
                        if (srjkfbyj) {
                            formData.form.groups[3].group_type=1;//收缩面板
                            srjkfbyj.field.disabled = true;//置灰
                        }
                    } else if (sname == "软件开发部"||sname=="业务营销部") {
                        if (sxxkjglbyj) {
                            formData.form.groups[2].group_type=1;
                          sxxkjglbyj.field.disabled = true;//置灰
                        }
                    }

                }
                       //  resolve(formData);
            })

        })

    }



}
xmcqXxForm=FlowForm.createClass(xmcqXxForm);
export default xmcqXxForm;