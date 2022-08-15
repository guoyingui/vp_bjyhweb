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
 * 第一步 项目经理确认
 */
class xmjxFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData,_handlers) => {
        let _this = this;
        console.log(_this,formData)
        let dev,devid,demand,demandid
        //自动带出项目经理和需求提出人
        vpAdd('/{vpplat}/objteam/getObjTeam',{
            ientityid:_this.props.iobjectentityid,
            iid:_this.props.iobjectid
        }).then(res=>{
            if(res){
                res.data.data.map(item=>{
                    switch (item.iroleid*1) {
                        case 1000014://开发负责人
                            devid = item.iuserid
                            dev = item.username 
                           break;
                        case 1000018://需求提出人
                            demandid = item.iuserid
                            demand = item.username 
                           break;
                    }
                })
            }
            console.log(res,dev,devid,demand,demandid,{
                [_this.state.handlers[0].stepkey]:devid,
                [_this.state.handlers[0].stepkey+'_label']:dev,
                [_this.state.handlers[1].stepkey]:demandid,
                [_this.state.handlers[1].stepkey+'_label']:demand
            });
            _this.props.form.setFieldsValue({
                ['sid-615DE484-9C5C-4371-86A2-F0FA701DA124']:devid,
                ['sid-615DE484-9C5C-4371-86A2-F0FA701DA124'+'_label']:dev,
                ['sid-06389275-064F-4221-A088-0CBC3EA9FC3B']:demandid,
                ['sid-06389275-064F-4221-A088-0CBC3EA9FC3B'+'_label']:demand
            })        
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
xmjxFlowForm = FlowForm.createClass(xmjxFlowForm);
export default xmjxFlowForm;