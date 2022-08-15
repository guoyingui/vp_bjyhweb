import React, { Component } from "react"
import { vpQuery, VpMWarning } from 'vpreact'
import { common } from '../code';
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm"

//系统终止
class ztzzForm extends DynamicForm.Component {
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
        this.basicsInfoAuto(_this, formData)
        this.projectChange(_this, formData)
    }

    /**
     * 自动带出基础信息
     * @param _this
     * @param formData
     */
    basicsInfoAuto = (_this, formData) => {
        // 若存在 变更申请人：自动带出为当前系统登录人
        let rlxr = formData.findWidgetByName('rlxr')
        if (rlxr) {//rxqtcr
            _this.props.form.setFieldsValue({
                'rlxr': common.userid,
                'rlxr_label': common.nickname,
            })
        }
        // 若存在 变更申请部门：自动带出为当前系统登录人所在部门
        let rsqbs = formData.findWidgetByName('rsqbs')
        if (rsqbs) {//rxqtcr
            _this.props.form.setFieldsValue({
                'rsqbs': common.idepartmentid,
                'rsqbs_label': common.dptname
            })
        }

        // // 默认当前时间
        // let dsqsj = formData.findWidgetByName('dsqsj')
        // if (dsqsj) {
        //     // 若存在申请时间
        //     if (dsqsj.field.fieldProps.initialValue) {
        //         _this.props.form.setFieldsValue({
        //             'dsqsj': dsqsj.field.fieldProps.initialValue
        //         })
        //     } else {
        //         _this.props.form.setFieldsValue({
        //             'dsqsj': common.currentDate
        //         })
        //     }
        // }
    }

    /**
     * 选择项目事件
     * @param _this
     * @param formData
     */
    projectChange = (_this, formData) => {
        let rxtmc = formData.findWidgetByName("rxtmc")
        rxtmc.field.fieldProps.onChange = (value) => {
            this.projectBasicsInfo(_this, value, formData)
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
                entityid: '81', iid: value, viewcode: 'vpm_system'
            }).then((response) => {
                if (response.data != null) {
                    let data = response.data
                    console.log('data', data)

                    let tempstr = '';
                    let rywfzr1 = data.rywfzr1;
                    let rkffzraj1 = data.rkffzraj1;
                    let ryfzraj1 = data.ryfzraj1;
                    if (rywfzr1 == undefined) { rywfzr1 = ''; }
                    if (rkffzraj1 == undefined) { rkffzraj1 = ''; }
                    if (ryfzraj1 == undefined) { ryfzraj1 = ''; }
                    if ('' != rywfzr1) {
                        tempstr = rywfzr1;
                    }
                    if ('' == tempstr) {
                        if ('' != rkffzraj1) {
                            tempstr = rkffzraj1;
                        }
                    } else {
                        if ('' != rkffzraj1) {
                            tempstr = tempstr + ',' + rkffzraj1;
                        }
                    }
                    if ('' == tempstr) {
                        if ('' != ryfzraj1) {
                            tempstr = ryfzraj1;
                        }
                    } else {
                        if ('' != ryfzraj1) {
                            tempstr = tempstr + ',' + ryfzraj1;
                        }
                    }

                    _this.props.form.setFieldsValue({
                        sname: data.sname + '_系统终止',
                        sxtbh: data.scode,
                        rxkxmjl1: tempstr
                    })
                    resolve(formData)
                }
                resolve(false)
            })
        })
    }
}
ztzzForm = DynamicForm.createClass(ztzzForm)
export default ztzzForm
