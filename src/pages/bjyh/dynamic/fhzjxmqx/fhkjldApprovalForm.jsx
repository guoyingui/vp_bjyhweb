import React, { Component } from "react"
import {
    vpQuery,
} from 'vpreact'

import {common, singleInputFill, validationRequireField} from '../code';
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

//分行自建项目取消--流程--项目经理审核
class fhkjldApprovalForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSD' ? true : false
        validationRequireField(_this, 'sxmjlqxspyj', flag)
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        console.log("ggggg")
        let _this = this
        return new Promise(resolve => {
            //收缩节点 意见订制
            let spyjValue = formData.findWidgetByName('sfhkjldqxyj')
            spyjValue.field.props.disabled = true
            formData.groups[spyjValue.groupIndex].group_type = 2

            resolve(formData)
        })
    }
    //动作中已处理。此处代码无用 java代码 ：ZKFhzjXmqxFlowFunc
    onBeforeSave = (formData,btnName) => {
        let _this = this
        console.log(_this.props.iobjectid);
        if(btnName == 'ok'){ //_this.props.iobjectid
            singleInputFill(formData, btnName, 'sxmjlqxspyj', true)
            // vpQuery('/{bjyh}/fhzjxmqx/getFhzjxmsqInfoByEntityId',{ entityId: _this.props.iobjectid
            // }).then((response) => {
            //     if (response.data != null) {
            //         let param = { pdId: response.data.proc_def_id_, piId: response.data.proc_inst_id_ }
            //         vpQuery('/{vpflow}/rest/process/end-process', {
            //             ...param
            //         }).then((response) => {
            //             _this.reloadTable();
            //         })
            //     }
            // })
        }
    }
}
fhkjldApprovalForm = FlowForm.createClass(fhkjldApprovalForm)
export default fhkjldApprovalForm
