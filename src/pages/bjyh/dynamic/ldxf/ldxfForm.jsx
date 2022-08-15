
import React, { Component } from "react";
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg, VpConfirm, VpPopover, VpMWarning } from "vpreact";
import moment from "moment";
import { vpAdd } from "vpreact/public/Vp";
import FlowSpecialMsg from 'pages/custom/Flow/FlowSpecialMsg';
import HomePageExt from '../index/homePageExt';
import { validationRequireFieldBitian } from '../code';

class CustomLdxfForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
    }
    // 加载成功后执行
    componentDidMount() {
        super.componentDidMount()
        if (this.props.add) {
            //HomePageExt.checkAddAccess(this);
        }
    }

    onDataLoadSuccess = formData => {
        //默认带出当前登录人
        let _this = this;
        if (_this.props.add) {
            _this.props.form.setFieldsValue({
                'dtcsj': new Date(),
                'rtcr': vp.cookie.getTkInfo('userid'),
                'rtcr_label': vp.cookie.getTkInfo('nickname')
            })
        }
    }
}
CustomLdxfForm = DynamicForm.createClass(CustomLdxfForm);
export default CustomLdxfForm;