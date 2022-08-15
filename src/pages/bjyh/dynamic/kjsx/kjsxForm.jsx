import React, { Component } from "react";
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg, VpConfirm } from "vpreact";
import { validationRequireField } from '../code';
import moment from "moment";

// 快捷上线
class kjsxForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
        moment.locale('zh_cn');
        console.log('moment', moment().format('YYYYMMDD'));
        console.log('sxsqForm', this);
    }



    //自定义控件行为
    onDataLoadSuccess = formData => {
        let _this = this;
        //默认带出当前登录人
        _this.props.form.setFieldsValue({
            'rywdb': vp.cookie.getTkInfo('userid'),//id
            'rywdb_label': vp.cookie.getTkInfo('nickname')//显示的汉字
        })
        //获取字段
        //选择项目自动带出项目编号 项目部门 项目类型
        var rxmmc = formData.findWidgetByName("rxmmc");
        rxmmc.field.props.modalProps.condition = [{
            field_name: 'istatusid',
            field_value: '5',
            expression: 'in'
        }, {
            field_name: 'roleid1000018',
            field_value: vp.cookie.getTkInfo('userid'),
            expression: 'in'
        }]
        if (rxmmc != null) {
            rxmmc.field.fieldProps.onChange = function (value) {
                vpQuery('/{vpplat}/vfrm/entity/getRowData', {
                    entityid: "7", iid: value, viewcode: "vpm_pj_project"
                }).then((response) => {
                    if (response.data != null) {
                        let data = response.data
                        console.log('data', data);
                        if (data.istatusid != 5) {
                            VpAlertMsg({
                                message: "消息提示",
                                description: "非【启动】状态的项目，如仍需发起上线，请联系项目经理进行处理！",
                                type: "error",
                                onClose: this.onClose,
                                closeText: "关闭",
                                showIcon: true
                            }, 5);
                            //清空项目
                            console.log("----")

                            _this.props.form.setFieldsValue({
                                'rxmmc': null,//id
                                'rxmmc_label': null//显示的汉字
                            })
                            _this.props.form.setFieldsValue({ sxmbh: null });
                        } else {
                            //带出项目编号
                            //带出项目部门
                            _this.props.form.setFieldsValue({
                                'sxmbh': data.scode,
                                'sname': "【" + data.sname + "】快捷上线" + moment().format('YYYYMMDD'),
                                'rxmtcbm': data.idepartmentid,//id
                                'rxmtcbm_label': data.idepartmentid_name,//显示的汉字
                            })
                        }
                    }
                })
            }
        }
    }

}

kjsxForm = DynamicForm.createClass(kjsxForm)
export default kjsxForm
