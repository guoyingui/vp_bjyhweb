import React, { Component } from "react"
import {nextStepHandler} from './fhzjxmsq';
import { common, fhzjxmsq, fileValidation} from '../code';
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {  vpQuery, vpAdd,VpAlertMsg } from 'vpreact';

//分行自建项目申请--流程--提交申请
class fhzjfzrFlowApplyForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        // //流程用户组增加过滤条件(部门)
        // let _this = this
        // // _this.
        // let scode = vp.cookie.getTkInfo('idepartmentid')
        // console.log("data", data);
        // data.handlers.map(item => {
        //     item.searchCondition = [{
        //         field_name: 'scode',
        //         field_value: scode
        //     }]
        //     item.ajaxurl = '/{bjyh}/fhzjxmsq/getUserGroupByDepId';
        // })
        return nextStepHandler(data, fhzjxmsq.lcyhz_fhkjzg)
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     * @return Promise<any> 如果返回false,则不执行保存，不返回或返回其他值都执行保存
     *
     */
    onBeforeSave = (formData, btnName) => {
        let _this = this
        return fileValidation(_this, btnName, common.lcbm_fhzjxmsq, fhzjxmsq.lcbzbm_fhxmfzrtjsq)
    }
    // 加载成功后执行
    onDataLoadSuccess = formData => {
        let _this = this;
        console.log("piid",_this.props.piid);
        let sfhkjzgldshyj =formData.findWidgetByName('sfhkjzgldshyj');
        let sfhkjldyj =formData.findWidgetByName('sfhkjldyj');
        let spmoclyj =formData.findWidgetByName('spmoclyj');

        let clyj = sfhkjzgldshyj.field.fieldProps.initialValue
        let fhzgclyj = sfhkjldyj.field.fieldProps.initialValue
        let pmoclyj = spmoclyj.field.fieldProps.initialValue

        //判断当前是哪个阶段拒绝回来的
        vpAdd('/{bjyh}/ZKsecondSave/searchJjhl',{
            piid:_this.props.piid,entityname:"WFENT_FHZJXMSQ"
        }).then(res=>{
            console.log(res);
            if(res=="2"){
                vpAdd('/{bjyh}/ZKsecondSave/searchJj',{
                    piid:_this.props.piid,name:'SYSB',userid:vp.cookie.getTkInfo().userid,entityname:"WFENT_FHZJXMSQ"
                }).then(res=>{
                    console.log(res);
                    if(res.flag){
                        VpAlertMsg({
                            message:'分行科技管理领导审核处理意见',
                            description:''+clyj, 
                            closeText:'关闭',
                            type:'info', 
                            showIcon:true
                        },30);
                    }
                    
                })
            }else  if(res=="3"){
                vpAdd('/{bjyh}/ZKsecondSave/searchJj',{
                    piid:_this.props.piid,name:'SYSD',userid:vp.cookie.getTkInfo().userid,entityname:"WFENT_FHZJXMSQ"
                }).then(res=>{
                    console.log(res);
                    if(res.flag){
                        VpAlertMsg({
                            message:'分行主管科技行领导处理意见',
                            description:''+fhzgclyj, 
                            closeText:'关闭',
                            type:'info', 
                            showIcon:true
                        },30);
                    }
                    
                })
            }else  if(res=="4"){
                vpAdd('/{bjyh}/ZKsecondSave/searchJj',{
                    piid:_this.props.piid,name:'SYSF',userid:vp.cookie.getTkInfo().userid,entityname:"WFENT_FHZJXMSQ"
                }).then(res=>{
                    console.log(res);
                    if(res.flag){
                        VpAlertMsg({
                            message:'PMO处理意见',
                            description:''+pmoclyj, 
                            closeText:'关闭',
                            type:'info', 
                            showIcon:true
                        },30);
                    }
                    
                })
            }
            
        })


        
    }
}

fhzjfzrFlowApplyForm = FlowForm.createClass(fhzjfzrFlowApplyForm)
export default fhzjfzrFlowApplyForm
