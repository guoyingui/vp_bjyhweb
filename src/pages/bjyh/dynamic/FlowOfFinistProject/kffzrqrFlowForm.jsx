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
 * 开发负责人确认
 */
class kffzrqrFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData,_handlers) => {
        let _this = this;
        console.log(_this,formData)    
        //自动带出项目经理
        // let dev,devid
        // vpAdd('/{vpplat}/objteam/getObjTeam',{
        //     ientityid:_this.props.iobjectentityid,
        //     iid:_this.props.iobjectid
        // }).then(res=>{
        //     if(res){
        //         res.data.data.map(item=>{
        //             switch (item.iroleid*1) {
        //                 case 6://项目经理
        //                     devid = item.iuserid
        //                     dev = item.username 
        //                 break;
        //             }
        //         })
        //     }
        //     console.log(dev,devid,demand,demandid,{
        //         [_this.state.handlers[0].stepkey]:devid,
        //         [_this.state.handlers[0].stepkey+'_label']:dev,
        //     });
        //     _this.props.form.setFieldsValue({
        //         [_this.state.handlers[0].stepkey]:devid,
        //         [_this.state.handlers[0].stepkey+'_label']:dev,
        //     })        
        // })

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
kffzrqrFlowForm = FlowForm.createClass(kffzrqrFlowForm);
export default kffzrqrFlowForm;