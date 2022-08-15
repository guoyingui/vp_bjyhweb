import React, { Component } from "react"
import {
    vpQuery,
    VpAlertMsg
} from 'vpreact'

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

//需求变更--流程--提交申请
class xqbgFlowApplyForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        let _this = this

        return new Promise(resolve => {
            vpQuery('/{bjyh}/xqbg/getXmjlByiobjectId',{ entityId: _this.props.iobjectid
            }).then((response) => {
                if (response.data != null) {
                    let res = response.data
                    // 自动获取该项目的项目经理
                    data.handlers[0].ids = res.iuserid + ""
                    data.handlers[0].names = res.sname

                    resolve(data)
                }else{
                    resolve(data)
                }
            })
        })
    }
    // 加载成功后执行
    onDataLoadSuccess = formData => {
        let _this = this;
        console.log(_this);
        const isHistory = _this.props.isHistory//是否历史数据
        console.log("isHistory1",isHistory)
        // let sxmjlpgbgyj =formData.findWidgetByName('sqtyx');
        let sxmjlpgbgyj =formData.findWidgetByName('sxmjlpgbgyj');
        let clyj = sxmjlpgbgyj.field.fieldProps.initialValue
        // let clyj = "11110";
     //如果是拒绝回来的则显示拒绝原因
        vpQuery('/{bjyh}/ZKsecondSave/searchJj',{
            piid:_this.props.piid,name:'SYSB',userid:vp.cookie.getTkInfo().userid,entityname:"WFENT_XQBGLC",dqskey:"SYSA"
        }).then(res=>{ 
            if(res.flag){
                VpAlertMsg({
                    message:'项目经理评估变更拒绝意见',
                    description:''+clyj, 
                    closeText:'关闭',
                    type:'info', 
                    showIcon:true
                },30);
            }
        })
    }
}

xqbgFlowApplyForm = FlowForm.createClass(xqbgFlowApplyForm)
export default xqbgFlowApplyForm
