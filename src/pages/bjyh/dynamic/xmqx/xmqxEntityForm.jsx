import React, { Component } from "react"
import {
    vpQuery, VpMWarning
} from 'vpreact'

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm"
import {vpPostAjax} from "../../../templates/dynamic/utils";
import { common } from '../code';

//项目取消--流程实体
class xmqxEntityForm extends DynamicForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        let _this = this;
        // 获取字段
        let rxqtcr = formData.findWidgetByName('rxqtcr')
        // 若存在 取消提出人：自动带出为当前系统登录人
        if (rxqtcr) {//rxqtcr
            _this.props.form.setFieldsValue({
                'rxqtcr': common.userid,
                'rxqtcr_label': common.nickname
            })
        }

        let rxmmc = formData.findWidgetByName("rxmmc")
        let sxmbh = formData.findWidgetByName("sxmbh")
        let zttcr =  _this.props.form.getFieldsValue(['rxqtcr'])
        if (rxmmc != null) {
            rxmmc.field.fieldProps.onChange = function (value) {
                vpQuery('/{vpplat}/vfrm/entity/getRowData', {
                    entityid: '7', iid: value, viewcode: 'vpm_pj_project'
                }).then((response) => {
                    if (response.data != null) {
                        let data = response.data
                        if (data.istatusid == 86) {// || data.istatusid == 83
                            VpMWarning({
                                title: '这是一条警告通知',
                                content: '【取消】状态的项目不允许发起项目取消流程' //和【暂停】
                            })
                            _this.props.form.resetFields(['rxmmc','rxmmc_label'])
                        } else { // 项目编号：根据项目名称字段自动带出
                            if (sxmbh != null) {
                                vpPostAjax('/{bjyh}/ZKsecondSave/queryXqtcrByProjectId',{ projectid: data.scode, zttcr: zttcr.rxqtcr },"POST",function(res){
                                    if(!res){
                                        VpMWarning({
                                            title: '这是一条警告通知',
                                            content: '对不起，您不是该项目的需求提出人~'
                                        })
                                        _this.props.form.resetFields(['rxmmc','rxmmc_label'])
                                    } else {
                                        _this.props.form.setFieldsValue({
                                            sxmbh: data.scode,
                                            sname: data.sname + '_项目取消'
                                        })
                                    }
                                })
                            }
                        }
                    }
                })
            }
        }
       //项目取消流程中项目名称选择只显示启动和暂停的项目，并且需求提出人是当前登陆人的
        rxmmc.field.props.modalProps.condition=[{
            field_name:'istatusid',
            field_value:'5,83',
            expression:'in'
        },{
            field_name:'roleid1000018',
            field_value:vp.cookie.getTkInfo('userid'),
            expression:'in'
        }]
    }

}
xmqxEntityForm = DynamicForm.createClass(xmqxEntityForm)
export default xmqxEntityForm
