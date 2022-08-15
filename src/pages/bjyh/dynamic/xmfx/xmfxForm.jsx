import React, { Component } from "react";
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import {vpQuery, VpAlertMsg, VpConfirm, VpMWarning, vpAdd} from "vpreact";
import {common, validationRequireField} from '../code';
import moment from "moment";

// 架构评审
class xmfxForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
        moment.locale('zh_cn');
        console.log('moment', moment().format('YYYYMMDD'));
        console.log('jgspForm', this);
    }



    //自定义控件行为
    onDataLoadSuccess = formData => {
        let _this = this;
        this.basicsInfoAuto(_this, formData)
        this.projectChange(_this, formData)
       
        // 架构评审中项目名称选择只显示启动和暂停状态的项目
        let rxmmc = formData.findWidgetByName('rxmmc');
        rxmmc.field.props.modalProps.condition=[{
            field_name:'istatusid',
            field_value:'5,83',
            expression:'in'
        }]
    }
    /**
     * 自动带出基础信息onSave----
     * @param _this
     * @param formData
     */
    basicsInfoAuto = (_this, formData) => {
        

    }
    /**
     * 选择项目事件
     * @param _this
     * @param formData
     */
    projectChange = (_this, formData) => {
        let rxmmc = formData.findWidgetByName("rxmmc")
        if (rxmmc != null) {
            rxmmc.field.fieldProps.onChange = (value) => {
                this.projectBasicsInfo(_this, value, formData)
            }
        }
    }
    /**
     * 项目基础信息
     * @param _this
     * @param value
     */
    projectBasicsInfo = (_this, value, formData) => {
        return new Promise(resolve => {
            vpQuery('/{vpplat}/vfrm/entity/getRowData', {
                entityid: '7', iid: value, viewcode: 'vpm_pj_project'
            }).then((response) => {
                if (response.data != null) {
                    let data = response.data
                    console.log('data', data)
                    // 项目编号：根据项目名称字段自动带出
                        let sxmbh = formData.findWidgetByName("sxmbh")
                        if (sxmbh != null) {
                            _this.props.form.setFieldsValue({
                                sname: data.sname,
                                sxmbh: data.scode
                            })
                        }
                        this.projectExtInfo(_this, value, formData)
                        resolve(formData)
                    }
                resolve(false)
            })
        })
    }

    /**
     * 项目其他信息
     * @param _this
     * @param value
     */
    projectExtInfo = (_this, value, formData) => {
        _this.props.form.setFieldsValue({
            sname: _this.props.form.getFieldValue('sname') ,
        })
        vpQuery('/{bjyh}/xmfx/querySpecialProjectById', {
            projectid: value
        }).then((response) => {
            if (response.data != null) {
                let data = response.data
                console.log('data', data)
                _this.props.form.setFieldsValue({
                    rxmjl: data.xmjl,
                    rxmjl_label:data.xmjlname,
                    rjsjl: data.rkffzr,
                    rjsjl_label:data.rkffzrname,
                })
            }
        })
    }
    getCustomeButtons = () => {
        return ['ok', {
            name:'chuli',
            text:'处理',
            className:"vp-btn-br",
            handler: this.hanglecl
        }, 'cancel']
    }
    hanglecl = () => {
        console.log(this.props.formData);
    }




}

xmfxForm = DynamicForm.createClass(xmfxForm)
export default xmfxForm
