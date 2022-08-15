import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { registerWidgetPropsTransform, registerWidget, getCommonWidgetPropsFromFormData } from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code';

// 新增系统流程架构管理办公室节点
class bgxt03FlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("bgxt03FlowForm");
    }

    /**
    * 表单数据加载成功后
    * @param formData
    */
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this;
        console.log('formData', formData);
        console.log('handlers', handlers);

        //业务线领导只有一人时自动带出
        let sparam = {
            condition: [{
                field_name: 'idepartmentid',
                field_value: vp.cookie.getTkInfo('idepartmentid'),
                flag: '1'
            }],
        }
        vpQuery('/{bjyh}/xzxt/getUser', {
            sparam: JSON.stringify(sparam)
        }).then(res => {
            if (res.data) {
                if (res.data.resultList.length === 1) {
                    let userData = res.data.resultList[0]
                    _this.state.handlers.map(item => {
                        //if(item.flag==='SYSV'){
                        item.names = userData.sname
                        item.ids = userData.iid
                        _this.props.form.setFieldsValue({
                            [item.stepkey]: userData.iid,
                            [item.stepkey + '_label']: userData.sname
                        })
                        //}
                    })
                } else if (res.data.resultList.length === 0) {
                    _this.state.handlers.map(item => {
                        //if(item.flag==='SYSV'){
                        item.names = '马晓煦'
                        item.ids = '1261'
                        _this.props.form.setFieldsValue({
                            [item.stepkey]: '1261',
                            [item.stepkey + '_label']: '马晓煦'
                        })
                        //}
                    })
                }

            }
        })
    }

    onGetFormDataSuccess = data => {
        //流程用户组增加过滤条件(部门)
        let dptid = vp.cookie.getTkInfo('idepartmentid')
        console.log("dptid", dptid);
        console.log("data", data);
        data.handlers.map(item => {
            item.searchCondition = [{
                field_name: 'idepartmentid',
                field_value: dptid,
                flag: '1'
            }]
            item.ajaxurl = '/{bjyh}/xzxt/getUser';
        })
        // 优化新增系统开发负责组字段
        let ikffzzArray = [];
        data.form.groups.map(item => {
            if (item.group_label == '开发信息') {
                item.fields.map(item1 => {
                    if (item1.field_name == 'ikffzz') {
                        item1.widget.load_template.map(item2 => {
                            if (item2.label == '分析系统组' || item2.label == '分析系统分组' || item2.label == '渠道组'
                                || item2.label == '专业前置组' || item2.label == '综合前置组') {
                                console.log("item2", item2);
                            } else {
                                ikffzzArray.push(item2);
                            }
                        })
                        item1.widget.load_template = ikffzzArray;
                    }
                })
            }
        })
    }
}

bgxt03FlowForm = FlowForm.createClass(bgxt03FlowForm);
export default bgxt03FlowForm;