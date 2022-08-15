import React, { Component } from "react";

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation } from '../code';
import moment from "moment";
import { vpAdd } from "vpreact/public/Vp";

// 新增系统流程架构管理办公室节点
class xzxt01FlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("xzxt01FlowForm");
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this;
        console.log('formData', formData);
        console.log('handlers', handlers);
        // 选择项目自动带出预设处理人信息
        var rxmmc = formData.findWidgetByName("rxmmc");
        if (rxmmc != null) {
            rxmmc.field.fieldProps.onChange = function (value) {
                vpQuery('/{bjyh}/xzxt/checkXzxt', { projectid: value, method: 'getchuliren01_1' }).then((response) => {
                    for (let index = 0; index < handlers.length; index++) {
                        let key = handlers[index].stepkey;
                        let label = key + '_label';
                        if (handlers[index].stepname == "信科部负责人维护新增系统相关信息") {
                            _this.props.form.setFieldsValue({
                                [key]: response.id1,
                                [label]: response.name1,
                            })
                        } else if (handlers[index].stepname == "开发部负责人维护新增系统相关信息") {
                            _this.props.form.setFieldsValue({
                                [key]: response.id2,
                                [label]: response.name2,
                            })
                        } else if (handlers[index].stepname == "运维部负责人维护新增系统相关信息") {
                            _this.props.form.setFieldsValue({
                                [key]: response.id3,
                                [label]: response.name3,
                            })
                        }
                    }
                })
            }
        }
    }
}
xzxt01FlowForm = FlowForm.createClass(xzxt01FlowForm);
export default xzxt01FlowForm;