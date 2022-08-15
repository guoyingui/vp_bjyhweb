import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { validationRequireField, singleInputFill } from '../code';
import { findFiledByName } from 'utils/utils';

//信息科技管理部外部信息负责人结束评审
class xxkjbjsps06 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = (formData, handlers) => {
        console.log("formData", formData);
        const _this = this
        const rywbldsp = formData.findWidgetByName("rywbldsp");
        const rywbldspLabel = rywbldsp && rywbldsp.field.props.widget.default_label || null
        const rywbldspValue = rywbldsp && rywbldsp.field.props.widget.default_value || null
        const ixgsq = formData.findWidgetByName('ixgsq');
        ixgsq.field.fieldProps.onChange = (e) => {
            //隐藏总行联系人字段
            if (e.target.value == 1) {
                //分支切换
                const scondition = _this.props.form.getFieldInstance('scondition')
                scondition && scondition.props.options_.map(item => {
                    if (item.value == 'SYSI') {
                        item.hidden = true
                    } else {
                        item.hidden = false
                    }
                    item.disabled = true
                })
                let eobj = { target: { value: 'SYSL' } }
                this.props.form.setFieldsValue({ scondition: 'SYSL' })
                this.handleCondition(eobj)
            } else {
                //分支切换
                const scondition = _this.props.form.getFieldInstance('scondition')
                scondition && scondition.props.options_.map(item => {
                    if (item.value == 'SYSL') {
                        item.hidden = true
                    } else {
                        item.hidden = false
                    }
                    item.disabled = false
                })
                let eobj = { target: { value: 'SYSH' } }
                this.props.form.setFieldsValue({ scondition: 'SYSH' })
                this.handleCondition(eobj)
            }
        }

        //查询数据字典中配置的信科领导和软开领导 wbxx_hqld
        vpQuery('/{bjyh}/externalData/getDictionaryItem', {
            groupID: 'wbxx_hqld'
        }).then(res => {
            if (res.data) {
                let arrIds = rywbldspValue && [rywbldspValue] || []
                let arrNames = rywbldspLabel && [rywbldspLabel] || []
                res.data.forEach(element => {
                    arrIds.push(element.userid);
                    arrNames.push(element.username);
                })
                handlers.forEach(item => {
                    if (item.flag === 'SYSH') {
                        item.ids = arrIds.toString()
                        item.names = arrNames.toString()
                        _this.props.form.setFieldsValue({
                            [item.stepkey]: item.ids.toString(),
                            [item.stepkey + '_label']: item.names.toString()
                        })
                    }
                })
                _this.setState(handlers)
            }
        })
    }

    onBeforeSave(formData, btnName) {
        singleInputFill(formData, btnName, 'sdescription', true)
    }

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSH' ? false : true
        validationRequireField(_this, 'sdescription', flag)
    }

    onGetFormDataSuccess = data => {
        let scondition = findFiledByName(data.form, 'scondition')
        let ixgsq = findFiledByName(data.form, 'ixgsq')
        if (ixgsq.field.widget.default_value == 1) {
            const flag = 'SYSI';
            data.scondition = 'SYSL';
            scondition.field.widget.load_template.map(item => {
                if (item.value == flag) {
                    item.hidden = true
                }
                item.disabled = true
            })
            scondition.field.widget.default_value = 'SYSL'
        } else {
            const flag = 'SYSL';
            data.scondition = 'SYSH';
            scondition.field.widget.load_template.map(item => {
                if (item.value == flag) {
                    item.hidden = true
                }
                item.disabled = false
            })
            scondition.field.widget.default_value = 'SYSH'
        }
    }
}

xxkjbjsps06 = FlowForm.createClass(xxkjbjsps06);
export default xxkjbjsps06;