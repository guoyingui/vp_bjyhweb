import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';

import {
    formDataToWidgetProps
} from '../../../templates/dynamic/Form/Widgets';
import { common, validationRequireField, singleInputFill,xmsqHiddenColumn } from '../code';
import {findFiledByName} from 'utils/utils';

/**
 * 需求提出人确认
 */
class xqtcrqrFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData,_handlers) => {
        let _this = this;
        console.log(_this,formData)    

        //自动带出项目经理
        vpAdd('/{bjyh}/xmsq/getStepInfoBysid',{
            piid:_this.props.piid,stepkey:'sid-1BD92C21-9C7A-4575-8E77-56AF764EB5DB'
        }).then(res=>{
            if(res.data){
                let handlers = _handlers
                handlers.map(item=>{
                    if(item.stepname === '项目经理确认'){
                        item.ids=res.data.assignee_;
                        item.names=res.data.username;
                        _this.props.form.setFieldsValue({
                            [item.stepkey]:res.data.assignee_,
                            [item.stepkey+'_label']:res.data.username
                        })
                    }
                })
                _this.setState({handlers:handlers})           
            }
        })

    }

    //右上角弹框提示
    alertMsg=(desc,type,message)=>{
        return(
            VpAlertMsg({
                message: message||"消息提示",
                description: desc||'!',
                type: type||'info',
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        )
    }

   

}
xqtcrqrFlowForm = FlowForm.createClass(xqtcrqrFlowForm);
export default xqtcrqrFlowForm;