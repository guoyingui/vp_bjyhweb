import React, { Component } from "react"
import {
    vpQuery, VpMWarning
} from 'vpreact'

import { common } from '../code';
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm"

//需求变更--流程实体
class xqbgEntityForm extends DynamicForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = formData => {
        let _this = this
        console.log('_this', _this)
        console.log('ssftbxm', _this.props.form.getFieldValue('ssftbxm'))
        this.basicsInfoAuto(_this, formData)
        this.projectChange(_this, formData)

        // 需求变更流中项目名称选择只显示启动和暂停状态的项目
        let rxmmc = formData.findWidgetByName('rxmmc');
        rxmmc.field.props.modalProps.condition=[{
            field_name:'istatusid',
            field_value:'5,83',
            expression:'in'
        }]
    }

    onBeforeSave(formData, btnName) {
        let sparam = JSON.parse(formData.sparam);
        vpQuery('/{bjyh}/lcTcTxJXzRest/getXqBgTxFlag', {
            projectId : sparam.rxmmc
        }).then((response) => {
            debugger;
            if (response.data != null) {
                if(response.data.flag){
                    VpMWarning({
                        title: '这是一条提醒通知',
                        content:response.data.msg
                    })
                }
            }
            resolve(false)
        })
    
    }    



    /**
     * 自动带出基础信息
     * @param _this
     * @param formData
     */
    basicsInfoAuto = (_this, formData) => {
        // 若存在 变更申请人：自动带出为当前系统登录人
        let rbgsqr = formData.findWidgetByName('rbgsqr')
        if (rbgsqr && _this.props.add) {//rxqtcr
            _this.props.form.setFieldsValue({
                'rbgsqr': common.userid,
                'rbgsqr_label': common.nickname,
                // 'fljbgcs': 0
            })
        }
        // 若存在 变更申请部门：自动带出为当前系统登录人所在部门
        let rbgsqbm = formData.findWidgetByName('rbgsqbm')
        if (rbgsqbm && _this.props.add) {//rxqtcr
            _this.props.form.setFieldsValue({
                'rbgsqbm': common.idepartmentid,
                'rbgsqbm_label': common.dptname
            })
        }



        // 默认当前时间
        let dsqsj = formData.findWidgetByName('dsqsj')
        if (dsqsj) {
            // 若存在申请时间
            if (dsqsj.field.fieldProps.initialValue) {
                _this.props.form.setFieldsValue({
                    'dsqsj': dsqsj.field.fieldProps.initialValue
                })
            } else {
                _this.props.form.setFieldsValue({
                    'dsqsj': common.currentDate
                })
            }
        }
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
                    if (data.istatusid != 5) {
                        VpMWarning({
                            title: '这是一条警告通知',
                            content: '非【启动】状态的项目不可以发起需求变更流程！'
                        })
                        _this.props.form.resetFields(['rxmmc', 'rxmmc_label', 'sname', 'ssftbxm', 'fljbgcs'])
                        resolve(false)
                    } else { // 项目编号：根据项目名称字段自动带出
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
        vpQuery('/{bjyh}/xqbg/querySpecialProjectById', {
            projectid: value
        }).then((response) => {
            if (response.data != null) {
                let data = response.data
                if (!data.ableChange) {
                    VpMWarning({
                        title: '这是一条警告通知',
                        content: '本项目需求变更次数已经超过了'+ data.maxNum + '次，根据管理要求，请与项目经理联系尽快明确项目后期规划!'
                    })
                    // _this.props.form.resetFields(['rxmmc','rxmmc_label'])
                    // return
                }

                let changeNums = data.fljbgcs + 1
                _this.props.form.setFieldsValue({
                    sname: _this.props.form.getFieldValue('sname') + '需求变更',
                    // sname: _this.props.form.getFieldValue('sname') + changeNums,
                    ssftbxm: data.ssftbxm ? 1 : 0,
                    fljbgcs: changeNums + ""
                })
                console.log('ssftbxm', _this.props.form.getFieldValue('ssftbxm'))

            }
        })
    }

}
xqbgEntityForm = DynamicForm.createClass(xqbgEntityForm)
export default xqbgEntityForm
