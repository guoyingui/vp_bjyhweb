import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { registerWidgetPropsTransform, registerWidget, getCommonWidgetPropsFromFormData } from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'
import { common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';

class kjsx03 extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("kjsx03");
    }

    /**
     * 表单数据加载成功后
     * @param formDat
     */
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this
        vpQuery('/{bjyh}/xzxt/get_kjsxld', { xuanze: '2' }).then((response1) => {
            _this.state.handlers.map(item => {
                console.log('1111', item);
                console.log('22222', response1);
                if (item.stepname === '开发部领导审批') {
                    item.names = response1[0].sname
                    item.ids = response1[0].iid
                    _this.props.form.setFieldsValue({
                        [item.stepkey]: response1[0].iid,
                        [item.stepkey + '_label']: response1[0].sname
                    })
                } else if (item.stepname === '运维部领导审批') {
                    item.names = response1[1].sname
                    item.ids = response1[1].iid
                    _this.props.form.setFieldsValue({
                        [item.stepkey]: response1[1].iid,
                        [item.stepkey + '_label']: response1[1].sname
                    })
                } else if (item.stepname === '信息科技管理部领导审批') {
                    item.names = response1[2].sname
                    item.ids = response1[2].iid
                    _this.props.form.setFieldsValue({
                        [item.stepkey]: response1[2].iid,
                        [item.stepkey + '_label']: response1[2].sname
                    })
                }
            })
        })
    }

    /**
      * 监听单选框
      * @param e
      */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value == "SYSD" ? true : false
        validationRequireField(_this, 'sywxldspyj', scondition)
    }

    /**
     * 表单提交前
     * @param formData
     * @returns {Promise<any>}
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'sywxldspyj', true)
    }

}

kjsx03 = FlowForm.createClass(kjsx03);
export default kjsx03;