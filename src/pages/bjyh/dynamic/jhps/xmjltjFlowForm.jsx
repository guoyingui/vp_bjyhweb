import React, { Component } from "react";
import { vpQuery, vpAdd, VpMWarning } from 'vpreact';
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { fileValidation } from '../code'
import { validationRequireField } from "../code";

/**
 * 计划评审流程--项目经理提交
 */
class xmjltjFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
    }

    onFormRenderSuccess(formData) {
        vpQuery('/{bjyh}/xzxt/shifouzfry', { loginname: vp.cookie.getTkInfo('username') }).then((response) => {
            if (response.flag == '1') {
                document.getElementById('sid-B8DF76C1-D2BD-4BB8-B033-15E94C5A70AD_label').disabled = true;
                document.getElementById('sid-B8DF76C1-D2BD-4BB8-B033-15E94C5A70AD_label').parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                const buttons = this.state.newButtons;
                buttons.map(item => {
                    if (item.name === 'ok') {
                        item.className = 'hidden'
                    }
                })
                this.setState({ newButtons: buttons })
            }
        })
    }

    /**
     * 加载数据成功后调用
     */
    onDataLoadSuccess(formData, handlers) {
        let _this = this
        //判断是第一次发起计划评审（由需求分析流程自动发起），后续是计划评审流程记录变更次数
        !this.props.isHistory && vpQuery('/{bjyh}/phaseFlow/getJhpsRunCounts', {
            entityid: this.props.iobjectentityid,
            iid: this.props.iobjectid,
            piid: this.props.piid,
            taskid: this.props.staskid
        }).then((res) => {
            if (!res.data.isOver) {
                let sjhbgyy = formData.findWidgetByName("sjhbgyy");//计划变更原因
                let ibgfl = formData.findWidgetByName("ibgfl");//变更分类
                let sflly = formData.findWidgetByName("sflly");//分类理由
                let fbgcs = formData.findWidgetByName("fbgcs");//变更次数
                if (res.data.counts == 0) {
                    sjhbgyy.field.fieldProps.rules[0].required = false;
                    ibgfl.field.fieldProps.rules[0].required = false;
                } else {
                    ibgfl.field.fieldProps.rules.push({ validator: this.checkBGFL })
                }
                fbgcs.field.fieldProps.initialValue = res.data.counts + "";
                ibgfl.field.fieldProps.onChange = (value) => {
                    if (value == 2) {//客观原因
                        validationRequireField(_this, 'sflly', true, '请输入0~1000个字符!');
                    } else {
                        validationRequireField(_this, 'sflly', false, '请输入0~1000个字符!');
                    }
                }
                //ibgfl.field.fieldProps.onChange(ibgfl.field.fieldProps.initialValue)
            } else {
                let sjhbgyy = formData.findWidgetByName("sjhbgyy");//计划变更原因
                let ibgfl = formData.findWidgetByName("ibgfl");//变更分类
                let sflly = formData.findWidgetByName("sflly");//分类理由
                sjhbgyy.field.fieldProps.rules[0].required = false;
                ibgfl.field.fieldProps.rules[0].required = false;
                sflly.field.fieldProps.rules[0].required = false;
            }
            _this.props.form.setFieldsValue({
                'sxmlb': res.data.classname,
                'sxmzt': res.data.statname
            })
            //强制刷新
            this.forceUpdate();
        })

        let fieldsValue = {}
        //自动带出项目经理，需求提出人和开发负责人       
        !this.props.isHistory && vpAdd('/{vpplat}/objteam/getObjTeam', {
            ientityid: _this.props.iobjectentityid,
            iid: _this.props.iobjectid
        }).then(res => {
            if (res) {
                res.data.data.map(item => {
                    switch (item.iroleid * 1) {
                        case 1000014://开发负责人
                            fieldsValue.rkffzr = item.iuserid
                            fieldsValue.rkffzr_label = item.username
                            fieldsValue[handlers[0].stepkey] = item.iuserid
                            fieldsValue[handlers[0].stepkey + '_label'] = item.username
                            break;
                        case 1000018://需求提出人
                            fieldsValue.rxqtcr = item.iuserid
                            fieldsValue.rxqtcr_label = item.username
                            break;
                        case 1000015://测试负责人
                            fieldsValue.rcsfzr = item.iuserid
                            fieldsValue.rcsfzr_label = item.username
                            break;
                        case 6://测试负责人
                            fieldsValue.rxmjl = item.iuserid
                            fieldsValue.rxmjl_label = item.username
                            break;
                    }
                })
            }
            _this.props.form.setFieldsValue(fieldsValue)
            this.forceUpdate();
        })
    }

    checkBGFL = (rule, value, callback) => {
        if (value == 0) {
            callback([new Error('变更分类不能为空或无')]);
        } else {
            callback();
        }
    }
}
xmjltjFlowForm = FlowForm.createClass(xmjltjFlowForm);
export default xmjltjFlowForm;