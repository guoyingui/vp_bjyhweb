import React, { Component } from "react";
import { vpQuery } from 'vpreact';
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
/**
 * 阶段设计评审流程
 */
class sjpsFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    /**
     * 加载数据成功后调用
     */
    onDataLoadSuccess(formData, handlers) {
        for (let item of handlers) {
            if (item.stepcode == 'upload') {//上传文档步骤
                let step = formData.findWidgetByName(item.stepkey);
                if (step && !step.field.fieldProps.initialValue) {//已经有值，不重新设置值
                    vpQuery('/{bjyh}/phaseFlow/getkffzr', {
                        phaseid: this.props.iobjectid,
                        piid: this.props.piid
                    }).then((res) => {
                        item.ids = res.data.ids;
                        item.names = res.data.names;
                        this.initChooseModal(item.ids, item.names, step);
                    })
                }
            }else if(item.stepcode == 'fsps'){//发送评审步骤
                let step = formData.findWidgetByName(item.stepkey);
                if (step && !step.field.fieldProps.initialValue) {//已经有值，不重新设置值
                    vpQuery('/{bjyh}/phaseFlow/getPM', {
                        phaseid: this.props.iobjectid,
                        piid: this.props.piid
                    }).then((res) => {
                        item.ids = res.data.ids;
                        item.names = res.data.names;
                        this.initChooseModal(item.ids, item.names, step);
                    })
                }
            }
        }
        let sprojectcode = formData.findWidgetByName("sprojectcode");
        if (sprojectcode && !sprojectcode.field.fieldProps.initialValue) {//已经有值，不重新设置值
            vpQuery('/{bjyh}/phaseFlow/getPjInfo', {
                phaseid: this.props.iobjectid,
                piid: this.props.piid
            }).then((res) => {
                this.props.form.setFieldsValue(res.data);
            })
        }
    }
    /**
     * 初始化选择实体字段值
     */
    initChooseModal = (ids, names, widget) => {
        if (widget) {
            //页面渲染前初始值
            widget.field.fieldProps.initialValue = ids;
            widget.field.props.initialName = names;
            widget.field.props.widget.default_value = ids;
            widget.field.props.widget.default_label = names;
            //页面渲染后设置新值
            this.changeState(ids, names, this.refs[`${widget.field.field_name}_Modal`]);
        }
    }
    //设置选择实体的值和小灯泡
    changeState = (iids, snames, _this) => {
        if (!_this) {//不存在退出
            return;
        }
        iids = !iids ? "" : iids + "";
        snames = !snames ? "" : snames + "";
        const valueArr = iids ? iids.split(',') : [];
        const nameArr = snames ? snames.split(',') : [];
        const original = valueArr.map((value, index) => {
            return { key: value, iid: value, sname: nameArr[index] }
        })
        _this.setState({
            value: iids,
            name: snames,
            original,
            details: original
        })
        //设置父页面字段值，并调用onchange方法
        const { setFieldsValue } = _this.props.form;
        setFieldsValue({ [_this.props.field_name + "_label"]: snames });
        _this.triggerChange(iids);
    }
}
sjpsFlowForm = FlowForm.createClass(sjpsFlowForm);
export default sjpsFlowForm;