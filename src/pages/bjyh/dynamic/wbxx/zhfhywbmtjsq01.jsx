import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { validationRequireField, singleInputFill } from '../code';
import { findFiledByName } from 'utils/utils';

//总行/分行业务部门提交申请
class zhfhywbmtjsq01 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this;
        const ifhsq = formData.findWidgetByName('ifhsq');
        const rzhlxr = formData.findWidgetByName('rzhlxr');
        const rywbldsp = formData.findWidgetByName('rywbldsp');
        const ixgsq = formData.findWidgetByName('ixgsq');
        ifhsq.field.fieldProps.onChange = (e) => {
            //隐藏总行联系人字段
            if (ixgsq.field.fieldProps.initialValue == 1) {
                rzhlxr.field.hidden = true;
                rzhlxr.field.fieldProps.rules[0].required = false;
                rywbldsp.field.hidden = true
                rywbldsp.field.fieldProps.rules[0].required = false;
                //分支切换
                const flag = 'SYSM';
                const instance = _this.props.form.getFieldInstance('scondition');
                instance && instance.props.options_.map(item => {
                    item.value != flag ? (item.hidden = true) : (item.hidden = false)
                })
                let eobj = { target: { value: flag } }
                this.props.form.setFieldsValue({ scondition: flag })
                this.handleCondition(eobj)
            } else {
                const hidden = e.target.value * 1 == 2 ? true : false
                rzhlxr.field.hidden = hidden
                rzhlxr.field.fieldProps.rules[0].required = !hidden
                rywbldsp.field.hidden = !hidden
                rywbldsp.field.fieldProps.rules[0].required = hidden
                _this.props.form.validateFields(['rzhlxr_label', 'rywbldsp_label'], { force: true })
                //分支切换
                const flag = e.target.value * 1 == 2 ? 'SYSA' : 'SYSB'
                const instance = _this.props.form.getFieldInstance('scondition')
                instance && instance.props.options_.map(item => {
                    item.value != flag ? (item.hidden = true) : (item.hidden = false)
                })
                let eobj = { target: { value: flag } }
                this.props.form.setFieldsValue({ scondition: flag })
                this.handleCondition(eobj)
            }
        }

        if (ixgsq.field.fieldProps.initialValue == 1) {
            rzhlxr.field.hidden = true;
            rzhlxr.field.fieldProps.rules[0].required = false;
            rywbldsp.field.hidden = true
            rywbldsp.field.fieldProps.rules[0].required = false;
        } else {
            //隐藏总行联系人
            if (rzhlxr && ifhsq.field.fieldProps.initialValue === 2) {
                rzhlxr.field.hidden = true
                rzhlxr.field.fieldProps.rules[0].required = false
            } else {
                rywbldsp.field.hidden = true
                rywbldsp.field.fieldProps.rules[0].required = false
            }
        }

        //是否涉及立项 isjlx
        const isjlx = formData.findWidgetByName('isjlx');
        isjlx && (isjlx.field.fieldProps.onChange = e => {
            const val = e.target.value
            if (val == 2) {
                // _this.props.form.setFieldsValue({
                //     sxmbh:'', rxmmc: '', rxmjl: '', rxqfzr: '', rxmsqbm: '',
                //     sxmbh_label: '', rxmmc_label: '', rxmjl_label: '', rxqfzr_label: '', rxmsqbm_label: '',
                // })
                _this.props.form.resetFields(['rxmmc', 'rxmmc_label', 'sxmbh', 'sxmbh_label',
                    'rxmjl', 'rxmjl_label', 'rxqfzr', 'rxqfzr_label', 'rxmsqbm', 'rxmsqbm_label',
                    'rxqtcr', 'rxqtcr_label'
                ])
            }
        })
        //项目选择后 自动带出相关信息
        const rxmmc = formData.findWidgetByName('rxmmc')
        rxmmc && (rxmmc.field.fieldProps.onChange = val => {
            vpQuery('/{bjyh}/util/getProjectInfo', {
                projectID: val
            }).then((response) => {
                const pjInfo = response.data
                const { scode = '', rxqtcbm = '', bmname = '', team } = pjInfo
                const fieldNode = {}
                team.map(element => {
                    switch (element.iroleid * 1) {
                        case 6:
                            fieldNode.rxmjl = element.userid
                            fieldNode.rxmjl_label = element.username
                            break;
                        case 1000018:
                            fieldNode.rxqtcr = element.userid
                            fieldNode.rxqtcr_label = element.username
                            break;
                        case 1000017:
                            fieldNode.rxqfzr = element.userid
                            fieldNode.rxqfzr_label = element.username
                            break;
                    }

                })
                _this.props.form.setFieldsValue({
                    sxmbh: scode, rxmsqbm: rxqtcbm, rxmsqbm_label: bmname, ...fieldNode
                })
            })
        })

        //分行项目选择后，自动带出相关信息
        const rfhxmmc = formData.findWidgetByName('rfhxmmc')
        rfhxmmc.field.fieldProps.onChange = function (val) {
            vpQuery('/{bjyh}/externalData/queryBranchMaster', {
                iid: val
            }).then((response) => {
                const fhInfo = response.data
                const { scode = '', xmjl = '', xmjlname = '' } = fhInfo
                _this.props.form.setFieldsValue({
                    sfhxmbh: scode, sfhxmjl: xmjlname, sfhxmjl_label: xmjlname,
                })
            })
        }

        //自动将负责人 带入 申请人员rsqry
        const param = {
            ientityid: _this.props.iobjectentityid,
            iid: _this.props.iobjectid
        }
        vpAdd('/{vpplat}/objteam/getObjTeam', param).then(res => {
            if (res) {
                const setFieldObj = {}
                res.data.data.forEach(item => {
                    switch (item.iroleid * 1) {
                        case 1364:
                            setFieldObj.rsqry = item.iuserid
                            setFieldObj.rsqry_label = item.username
                            break;
                    }
                })
                _this.props.form.setFieldsValue(setFieldObj)
            }
        })

    }

    onGetFormDataSuccess = data => {
        let scondition = findFiledByName(data.form, 'scondition')
        let ifhsq = findFiledByName(data.form, 'ifhsq')
        let ixgsq = findFiledByName(data.form, 'ixgsq')
        if (ixgsq.field.widget.default_value == 1) {
            const flag = 'SYSM';
            data.scondition = flag
            scondition.field.widget.load_template.map(item => {
                if (item.value != flag) {
                    item.hidden = true
                }
            })
            scondition.field.widget.default_value = flag
        } else {
            if (ifhsq && ifhsq.field.widget.default_value) {
                const flag = ifhsq.field.widget.default_value == 2 ? 'SYSA' : 'SYSB';
                data.scondition = flag
                scondition.field.widget.load_template.map(item => {
                    if (item.value != flag) {
                        item.hidden = true
                    }
                })
                scondition.field.widget.default_value = flag
            }
        }
    }
}

zhfhywbmtjsq01 = FlowForm.createClass(zhfhywbmtjsq01);
export default zhfhywbmtjsq01;