import React, { Component } from "react";

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import {vpQuery,VpAlertMsg,VpMWarning } from "vpreact";
import {vpPostAjax} from "../../../templates/dynamic/utils";


//项目重启   继承实体表单
class  xmcqFlowForm extends DynamicForm.Component{

    constructor(props){
        super(props);
        console.log('xmcqFlowForm',this);
    }

    onDataLoadSuccess = formData => {
        let _this=this;
        console.log('xmcqFlowForm',formData);
        console.log('tkinfo',vp.cookie.getTkInfo());
        //获取字段
        let rbgsqbm = formData.findWidgetByName('rbgsqbm');
        //若存在
        if(rbgsqbm){
            _this.props.form.setFieldsValue({
                'rbgsqbm':vp.cookie.getTkInfo('userid'),//id
                'rbgsqbm_label':vp.cookie.getTkInfo('nickname')//显示的汉字
            })
        }
        let rxmmc = formData.findWidgetByName('rxmmc');//获取项目名称
        let sxmbh =formData.findWidgetByName('sxmbh');//获取项目编号
        let ssqsj =formData.findWidgetByName('ssqsj'); //获取项目暂停原因
        let userid =vp.cookie.getTkInfo('userid');//获取当前用户id
        let sname =formData.findWidgetByName('sname');//名称
        //选择项目时 状态为启动，并且需求提出人是当前登陆人的
        rxmmc.field.props.modalProps.condition=[{
            field_name:'istatusid',
            field_value:'83',
            expression:'in'
        },{
            field_name:'roleid1000018',
            field_value:vp.cookie.getTkInfo('userid'),
            expression:'in'
        }]
      if(rxmmc!=null){   //若存在，发起判断
           rxmmc.field.fieldProps.onChange = function (value) {
                      vpQuery('{vpplat}/vfrm/entity/getRowData',{
                                  entityid:"7",iid:value,viewcode:"vpm_pj_project"
                              }).then((response)=>{
                                  if(response.data!=null){
                                      let res=response.data
                                      console.log('data',res);
                              let istatusid=  res.istatusid.toString();
                              if(istatusid=='83'){ //判断项目状态，若状态为‘暂停’，自动带出信息
                                  //如果流程发起人(当前登录人)不等于所选项目的需求提出人（角色id:1000018）
                                  let flag=true;

                                  //流程发起人是当前登录用户 id(rbgsqbm) ,
                                  console.log("项目编号="+res.scode+",流程发起人id="+vp.cookie.getTkInfo('userid'));
                                  vpPostAjax('/{bjyh}/xmcq/queryXqtcrByProjectId',{projectid:res.scode,zttcr:vp.cookie.getTkInfo('userid') },"POST",function (data) {
                                      console.log("flag",data);
                                      _this.props.form.resetFields(['sxmbh','ssqsj','sname']);
                                      if(data == false){
                                          VpMWarning({
                                              title: '错误警告：',
                                              content: '对不起，您不能在该项目下新建流程！'
                                          })
                                          //提示页面点击确定，清空所选项
                                         // _this.props.form.resetFields(['rxmmc','rxmmc_label']);
                                          _this.props.form.resetFields(['rxmmc','rxmmc_label','sxmbh','ssqsj','sname']);
                                          flag = false;
                                      }else {
                                          if(sxmbh!=null){  //带出项目编号
                                              _this.props.form.setFieldsValue({sxmbh:res.scode});
                                          }
                                          if(ssqsj!=null){  //带出项目暂停原因sztyy
                                              _this.props.form .setFieldsValue({ssqsj:res.sztyy});
                                          }
                                          //带出其他中的 名称  项目名_项目重启 sname
                                          _this.props.form.setFieldsValue({sname:`${res.sname}_项目重启`});
                                      }
                                  })
                                  return  flag;

                              }else {  //判断项目状态，若状态不为‘暂停’，给出提示,
                                  VpMWarning({
                                      title: '错误警告：',
                                      content: '非【暂停】状态的项目不能发起项目重启流程！'
                                  })
                                  //提示页面点击确定，清空所选项
                                  _this.props.form.resetFields(['rxmmc','rxmmc_label','sxmbh','ssqsj','sname']);
                               //   this.props.form.resetFields()
                              }


                          }
                          })
                      }}
                      }
                  }





xmcqFlowForm=DynamicForm.createClass(xmcqFlowForm);
export default xmcqFlowForm;