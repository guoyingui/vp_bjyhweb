import React, { Component } from "react";
import { vpQuery,vpAdd,VpMWarning } from 'vpreact';
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

/**
 * 项目经理修改确认计划
 */
class xmjlxgqrjhFlowForm05 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    onDataLoadSuccess = (formData,_handlers) => {
        //预设处理人自动带出项目经理（当前用户）
        this.props.form.setFieldsValue({
            [_handlers[0].stepkey]:vp.cookie.getTkInfo().userid,
            [_handlers[0].stepkey+'_label']:vp.cookie.getTkInfo().nickname,
        })
        this.forceUpdate();
        
    }


}
xmjlxgqrjhFlowForm05 = FlowForm.createClass(xmjlxgqrjhFlowForm05);
export default xmjlxgqrjhFlowForm05;