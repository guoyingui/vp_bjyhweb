import React, { Component } from "react";

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg} from "vpreact";
import moment from "moment";

//项目后评价
class  xmhpjForm extends DynamicForm.Component{
    constructor(props){
        super(props);
        moment.locale('zh_cn');
        console.log('moment',moment().format('YYYYMMDD'));
        console.log('xmhpjForm',this);
    }
    //自定义控件行为
    onDataLoadSuccess = formData => {
        

        //默认带出当前登录人
        let _this=this;
        console.log('xmhpjForm',formData);
        console.log('tkinfo',vp.cookie.getTkInfo())
        _this.props.form.setFieldsValue({
            //评价日期带出当前日期
            'tpjrq': moment().format('YYYY-MM-DD hh:mm:ss')
        })
       
        //选择项目自动带出项目编号
        var rxmmc = formData.findWidgetByName("rxmmc");
        var sxmbh = formData.findWidgetByName("sxmbh");
        var sname = formData.findWidgetByName("sname");
         //选择项目时 状态为启动，结项
         rxmmc.field.props.modalProps.condition=[{
            field_name:'istatusid',
            field_value:'5,84',
            expression:'in'
        }]
        if(rxmmc!=null){
            rxmmc.field.fieldProps.onChange = function(value){
                vpQuery('/{vpplat}/vfrm/entity/getRowData',{
                    entityid:"7", iid:value, viewcode:"vpm_pj_project"
                }).then((response)=>{
                    if(response.data != null){
                        let data = response.data
                        //根据项目编号查询当前项目所处于的状态和阶段
                        console.log('data',data);
                        console.log('projectid',data.iid);

                        vpQuery('/{bjyh}/ZKsecondSave/queryXqtcrByProjectStatusAndPhase',{ projectid: data.iid
                        }).then((response) => {
                            console.log('response',response.data);
                            //3.【取消】和【暂停】状态的项目不允许发起项目后评价！

                            if(response.data.ztname=="取消"||response.data.ztname=="暂停"){
                                VpAlertMsg({
                                    message:"消息提示",
                                    description: "【取消】和【暂停】状态的项目不允许发起项目后评价",
                                    type:"error",
                                    onClose:this.onClose,
                                    closeText:"关闭",
                                    showIcon: true
                                }, 5) ;
                                //清空项目
                                _this.props.form.setFieldsValue({
                                    'rxmmc':null,//id
                                    'rxmmc_label':null//显示的汉字
                                })
                                _this.props.form.setFieldsValue({sxmbh:null});
                            //隐藏原来的判断条件 因为已经添加筛选项目的状态 所以判断阶段的就不需要了
                            // }else if(response.data.statusname!="立项"){
                            //     VpAlertMsg({
                            //         message:"消息提示",
                            //         description: "未立项的项目，不能发起项目后评价！",
                            //         type:"error",
                            //         onClose:this.onClose,
                            //         closeText:"关闭",
                            //         showIcon: true
                            //     }, 5) ;
                            //     //清空项目
                            //     _this.props.form.setFieldsValue({
                            //         'rxmmc':null,//id
                            //         'rxmmc_label':null,//显示的汉字
                            //         'rsqsj':null,//id
                            //         'rsqsj_label':null,//显示的汉字
                            //         'rxmsqr':null,//id
                            //         'rxmsqr_label':null
                            //     })
                            //     _this.props.form.setFieldsValue({sxmbh:null});
                            }else{
                                //带出项目编号
                                if(sxmbh != null){ _this.props.form.setFieldsValue({sxmbh:data.scode}); }
                                if(sname != null){ _this.props.form.setFieldsValue({sname:data.sname+"_项目后评价"}); }
                                //带出项目申请部门和项目申请人
                                _this.props.form.setFieldsValue({
                                    //部门
                                    'rsqsj':response.data.deptid,//id
                                    'rsqsj_label':response.data.deptname,//显示的汉字
                                    'rxmsqr':response.data.iuserid,//id
                                    'rxmsqr_label':response.data.username
                                })
                            }
                        })

                    }
                })
            }
        }

    }


}
xmhpjForm=DynamicForm.createClass(xmhpjForm);
export default xmhpjForm;