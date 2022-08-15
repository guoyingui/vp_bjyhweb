import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { vpQuery, vpAdd, VpAlertMsg, VpMWarning } from 'vpreact';
import { formDataToWidgetProps } from '../../../templates/dynamic/Form/Widgets';
import { validationRequireField, singleInputFill, initHiddenColumn, xmsqHiddenColumn, initHiddenColumn_history } from '../code';
import { findFiledByName } from 'utils/utils';
import FlowSpecialMsg from 'pages/custom/Flow/FlowSpecialMsg'

//项目申请
var iyspctemp = '0';
/**
 * 业务部领导审批12
 */
class ywbldspFlowForm12 extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
    }

    onFormRenderSuccess(formData) {
        initHiddenColumn(iyspctemp)
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData, _handlers) => {

        // 删除生产环境的bjyhweb的div标签元素
        let devflag = window.vp.config.URL.devflag;
        if (!devflag) {
            if (document.getElementById("bjyhweb")) {
                document.getElementById("bjyhweb").remove()
            }
        }

        let _this = this;
        console.log(_this, formData)

        //根据预算数量隐藏...
        let iyspc = formData.findWidgetByName('iyspc');
        if (_this.props.isHistory) {
            initHiddenColumn_history(formData)
        }
        iyspctemp = iyspc && iyspc.field.fieldProps.initialValue;
        iyspc.field.fieldProps.onChange = (v) => {
            if (v == "0") {
                _this.props.form.setFieldsValue({
                    'sysbh1': '',
                    'sysbh2': '',
                    'sysbh3': '',
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc1': '',
                    'sysmc2': '',
                    'sysmc3': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "1") {
                _this.props.form.setFieldsValue({
                    'sysbh2': '',
                    'sysbh3': '',
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc2': '',
                    'sysmc3': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "2") {
                let obj = _this.props.form.getFieldsValue(['sysbh1', 'sysmc1', 'scpmc'])
                console.log('obj...', obj);
                _this.props.form.setFieldsValue({
                    'sysbh3': '',
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc3': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "3") {
                _this.props.form.setFieldsValue({
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "4") {
                _this.props.form.setFieldsValue({
                    'sysbh5': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "5") {
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
            }
        }
        //20220420去掉，因为去掉了业务线领导步骤。
        // 根据需求提出部门判断业务线领导
        // var rxqtcbm = formData.findWidgetByName("rxqtcbm");
        // vpQuery('/{bjyh}/xzxt/getbumen', { rxqtcbm: rxqtcbm.field.fieldProps.initialValue }).then((response) => {
        //     if (response.flag == '1') {
        //         vpQuery('/{bjyh}/xzxt/getuseridnmae', { xuanze: '1' }).then((response1) => {
        //             _this.state.handlers.map(item => {
        //                 if (item.flag === 'SYSV') {
        //                     item.names = response1.sname
        //                     item.ids = response1.iid
        //                     _this.props.form.setFieldsValue({
        //                         [item.stepkey]: response1.iid,
        //                         [item.stepkey + '_label']: response1.sname
        //                     })
        //                 }
        //             })
        //         })
        //     } 
        //     else {
        //         //业务线领导只有一人时自动带出
        //         let sparam = {
        //             condition: [{
        //                 field_name: 'idepartmentid',
        //                 field_value: vp.cookie.getTkInfo('idepartmentid'),
        //                 flag: '2'
        //             }],
        //         }
        //         vpQuery('/{bjyh}/xzxt/getUser', {
        //             sparam: JSON.stringify(sparam)
        //         }).then(res => {
        //             if (res.data) {
        //                 if (res.data.resultList.length === 1) {
        //                     let userData = res.data.resultList[0]
        //                     _this.state.handlers.map(item => {
        //                         if (item.flag === 'SYSV') {
        //                             item.names = userData.sname
        //                             item.ids = userData.iid
        //                             _this.props.form.setFieldsValue({
        //                                 [item.stepkey]: userData.iid,
        //                                 [item.stepkey + '_label']: userData.sname
        //                             })
        //                         }
        //                     })
        //                 }

        //             }
        //         })
        //     }
        // })

        //受理人立项自动带出需求受理人
        vpAdd('/{bjyh}/xmsq/getStepInfoBysid', {
            piid: _this.props.piid, stepkey: 'sid-106399A9-DC31-45FD-9528-BAD3D5BA680E'
        }).then(res => {
            if (res) {
                let handlers = _handlers
                handlers.map(item => {
                    if (item.flag === 'SYSX') {
                        item.ids = res.data.assignee_;
                        item.names = res.data.username;
                        _this.props.form.setFieldsValue({
                            [item.stepkey]: res.data.assignee_,
                            [item.stepkey + '_label']: res.data.username
                        })
                    }
                })
                _this.setState({ handlers: handlers })
            }

        })

		/**
         * 68.流程提出提醒及限制(一期)
         *  1)增加对于流程数量的条件
         *      b.增加【业务部门领导】、【需求受理人审核确认项目类型】以及【立项审批】三个审批节点
         *      的提醒“本项目需求提出人提出流程已超过*个，为保证项目实施过程顺利、资源充沛，建议由其他人员负责”。
         *  2)增加实施中项目数量的提醒和限制
         *      b.增加【业务部门领导】、【需求受理人审核确认项目类型】以及【立项审批】三个审批节点的提醒“本项目需求提出人负责项目已超过5个，
         *      为保证项目实施过程顺利、资源充沛，建议由其他人员负责”。
         */
        if (this.state.newButtons[0].name == "ok") {
            let proc_inst_id_ = _this.props.piid;//流程实例ID
            vpAdd('/{bjyh}/lcTcTxJXzRest/getXmSqTxFlag12b', {
                proc_inst_id_: proc_inst_id_
            }).then(res => {
                if (res.data.flag) {
                    VpMWarning({
                        title: '这是一条提醒通知',
                        content:
                            <FlowSpecialMsg
                                msg1={res.data.msg1}
                                msg2={res.data.msg2}
                            />
                    })
                }

            })
            // //需求68_1_b
            // vpAdd('/{bjyh}/lcTcTxJXzRest/getXmSqTxFlag_1b',{
            //     proc_inst_id_ :proc_inst_id_
            // }).then(res=>{
            //     if(res.data.flag){
            //         VpMWarning({
            //             title: '这是一条提醒通知',
            //             content: res.data.msg
            //         })
            //     }

            // })
            // //需求68_2_b
            // vpAdd('/{bjyh}/lcTcTxJXzRest/getXmSqTxFlag_2b',{
            //     proc_inst_id_ :proc_inst_id_
            // }).then(res=>{
            //     if(res.data.flag){
            //         VpMWarning({
            //             title: '这是一条提醒通知',
            //             content: res.data.msg
            //         })
            //     }

            // })
        }
        /**
         * 修改表单上 
         *  1.项目等级_项目属性信息 -> 项目等级
         *  2.项目属性_PMO -> 项目属性
         *  3.涉及系统_PMO -> 涉及系统
         * 字段的展示名称
         */
        //
        try {
            let ixmdj_xmsxxx = formData.findWidgetByName('ixmdj_xmsxxx');
            ixmdj_xmsxxx.field.props.label = '项目等级';
            //
            let ixmsx_pmo = formData.findWidgetByName('ixmsx_pmo');
            ixmsx_pmo.field.props.label = '项目属性';
            //
            let rsjxt_pmo = formData.findWidgetByName('rsjxt_pmo');
            rsjxt_pmo.field.props.label = '涉及系统';
        } catch (e) {

        }
        //增加项目标签2 显示项目标签
        let ixmbq2 = formData.findWidgetByName('ixmbq2')
        ixmbq2 && (ixmbq2.field.props.label = "项目标签")
        let ixmbq1 = formData.findWidgetByName('ixmbq1')
        ixmbq1 && (ixmbq1.field.props.label = "项目标签")
    }

    onGetFormDataSuccess = data => {
        //流程用户组增加过滤条件(部门)
        let dptid = vp.cookie.getTkInfo('idepartmentid')//部门
        data.handlers.map(item => {
            if (item.flag === 'SYSV') {//业务部领导审批
                item.searchCondition = [{
                    field_name: 'idepartmentid',
                    field_value: dptid,
                    flag: '2'
                }]
                item.ajaxurl = '/{bjyh}/xzxt/getUser';
            }
        })

        /* 开发B类、支持类走需求立项的分支  */
        let scondition = findFiledByName(data.form, 'scondition')
        let ixmlb = findFiledByName(data.form, 'ixmlb')
        let ixmdj = findFiledByName(data.form, 'ixmdj')
        if (ixmlb && ixmdj) {
            const ixmlb_val = ixmlb.field.widget.default_value
            const ixmdj_val = ixmdj.field.widget.default_value
            scondition.field.widget.load_template.map(item => {
                if (ixmdj_val == 2 || ixmlb_val == 0) {
                    if (item.value == 'SYSV') {
                        item.hidden = true
                        data.scondition = 'SYSX'
                        scondition.field.widget.default_value = 'SYSX'
                    }
                } else {
                    if (item.value == 'SYSX') {
                        item.hidden = true
                        data.scondition = 'SYSV'
                        scondition.field.widget.default_value = 'SYSV'
                    }
                }

            })
        }
        /*  */
    }

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSU' ? true : false
        validationRequireField(_this, 'sywbldpyj', flag)

    }

    onBeforeSave = (_formData, _btnName) => {
        singleInputFill(_formData, _btnName, 'sywbldpyj', true)
    }

    //右上角弹框提示
    alertMsg = (desc, type, message) => {
        return (
            VpAlertMsg({
                message: message || "消息提示",
                description: desc || '!',
                type: type || 'info',
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        )
    }
}
ywbldspFlowForm12 = FlowForm.createClass(ywbldspFlowForm12);
export default ywbldspFlowForm12;