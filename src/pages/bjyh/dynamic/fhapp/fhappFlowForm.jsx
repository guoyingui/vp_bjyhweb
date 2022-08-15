import React, { Component } from "react";

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery,VpAlertMsg,VpConfirm} from "vpreact";
import { validationRequireField  } from '../code';
import moment from "moment";

//分行app流程表单
class  fhappFlowForm extends DynamicForm.Component{
    constructor(props){
        super(props); 
        console.log("fhappFlowForm");
        
    }
 
   
    //自定义控件行为
    onDataLoadSuccess = formData => {
        var _this=this;
         
        //选择项目自动带出项目编号 项目部门 项目类型
        var rxmmc = formData.findWidgetByName("rxmmc");
        var sxmbh = formData.findWidgetByName("sxmbh");
        var sname = formData.findWidgetByName("sname");
        //项目部门
        var rxmtcbm = formData.findWidgetByName("rxmtcbm");
        //项目类别
        var sxmsslb = formData.findWidgetByName("sxmsslb");

        let zttcr =  vp.cookie.getTkInfo('userid')
        //选择项目名称自动带出项目编号，项目名称只可选择“是否为分行自建APP项目”=是 的项目 //0：是 1：否
        rxmmc.field.props.modalProps.condition=[{
            field_name:'ifhzjappxm',
            field_value:'0',
            expression:'in'
        }]
        
        if(rxmmc!=null){ 
            rxmmc.field.fieldProps.onChange = function(value){
                vpQuery('/{vpplat}/vfrm/entity/getRowData',{
                    entityid:"274", iid:value, viewcode:"bobj_branch_project"
                }).then((response)=>{ 
                    if(response.data != null){
                        let data = response.data
                        console.log("data",data);
                        //带出项目名称到名称里面
                        _this.props.form.setFieldsValue({
                            'sname':data.sname 
                        })
                         //带出项目编号
                        if(sxmbh != null){ _this.props.form.setFieldsValue({sxmbh:data.scode}); } 
                        //带出项目部门
                        _this.props.form.setFieldsValue({
                            'rxmtcfh':data.idepartmentid,//id
                            'rxmtcfh_label':data.idepartmentid_name,//显示的汉字
                        })
                        // 判断需求提出人
                        vpQuery('/{bjyh}/FhApp/queryUserId',{ id: data.rxqtcr
                        }).then((response) => {
                            console.log("response",response);
                            
                            if(response.data!=""){
                                // ssfxqtcr
                                _this.props.form.setFieldsValue({
                                    'rsxsqr_label':response.data,//id
                                    'rsxsqr':data.rxqtcr
                                })
                            } 
                        })
                    
                    }
                   

                })
            }
        }
         
    }

}
fhappFlowForm=DynamicForm.createClass(fhappFlowForm);
export default fhappFlowForm;