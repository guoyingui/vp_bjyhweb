import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import {vpQuery, vpAdd, VpAlertMsg} from 'vpreact';
import {registerWidgetPropsTransform,registerWidget,getCommonWidgetPropsFromFormData} from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'

// 新增系统流程架构管理办公室节点
class xzxt04FlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("xzxt04FlowForm");
    }

    /**
    * 表单数据加载成功后
    * @param formData
    */
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this;
        console.log('formData', formData);
        console.log('handlers', handlers);
        let sdescription = formData.findWidgetByName("sdescription");
        sdescription.field.hidden = true;
        // 根据项目把相关信息带出来
        var rxmmc = formData.findWidgetByName("rxmmc");
        vpQuery('/{bjyh}/xzxt/checkXzxt', { projectid: rxmmc.field.fieldProps.initialValue, method: 'getchuliren04_1' }).then((response) => {
            var ryyfzraj1 = formData.findWidgetByName("ryyfzraj1");
            if(ryyfzraj1.field.fieldProps.initialValue==null){
                _this.props.form.setFieldsValue({
                    'ryyfzraj1': response.id1,
                    'ryyfzraj1_label': response.name1,
                })
            }
        })
    }
}

xzxt04FlowForm = FlowForm.createClass(xzxt04FlowForm);
export default xzxt04FlowForm;