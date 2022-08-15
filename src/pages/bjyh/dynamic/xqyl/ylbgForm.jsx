import React, { Component } from "react";
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm.jsx";
import { vpPostAjax } from "../../../templates/dynamic/utils.jsx";
import {vpQuery, VpAlertMsg, VpConfirm, VpMWarning, vpAdd} from "vpreact";
import {common, validationRequireField} from '../code';
import moment from "moment";

// 用例发起页面
class ylbgForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
        moment.locale('zh_cn');
        console.log('moment', moment().format('YYYYMMDD'));
        console.log('ylbgForm', this);
    }
    //自定义控件行为
    onDataLoadSuccess = formData => {
        let _this = this;
        this.basicsInfoAuto(_this, formData)

    }

    /**
     * 自动带出基础信息
     * @param _this
     * @param formData
     */
    basicsInfoAuto = (_this, formData) => {
        // 若存在 申请人：自动带出为当前系统登录人
        let rjgsqr = formData.findWidgetByName('rjgsqr')
        if (rjgsqr && _this.props.add) {//rjgsqr
            _this.props.form.setFieldsValue({
                'rjgsqr': common.userid,
                'rjgsqr_label': common.nickname,
            })
        }


    }

}

ylbgForm = DynamicForm.createClass(ylbgForm)
export default ylbgForm
