import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { registerWidgetPropsTransform, registerWidget, getCommonWidgetPropsFromFormData } from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'
import { common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';

class kjsx01 extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("kjsx01");
    }

    onGetFormDataSuccess = data => {
        let _this = this
        let dptid = vp.cookie.getTkInfo('idepartmentid')//部门
        data.handlers.map(item => {
            if (item.flag === 'SYSN') {//业务部领导审批
                item.searchCondition = [{
                    field_name: 'idepartmentid',
                    field_value: dptid,
                    flag: '3'
                }]
                item.ajaxurl = '/{bjyh}/xzxt/getUser';
            }
        })
    }
}

kjsx01 = FlowForm.createClass(kjsx01);
export default kjsx01;