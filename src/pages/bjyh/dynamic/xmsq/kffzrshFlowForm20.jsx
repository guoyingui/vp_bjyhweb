import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { formDataToWidgetProps } from '../../../templates/dynamic/Form/Widgets';
import { common, validationRequireField, singleInputFill, initHiddenColumn, xmsqHiddenColumn, initHiddenColumn_history } from '../code';
import { findFiledByName } from 'utils/utils';

//项目申请
var iyspctemp = '0';

/**
 * 开发负责人审核20
 */
class kffzrshFlowForm20 extends FlowForm.Component {
    constructor(props) {
        super(props);
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
        //自动带出项目经理
        vpAdd('/{bjyh}/xmsq/getStepInfoBysid', {
            piid: _this.props.piid, stepkey: 'sid-866A2EB5-D43A-44A1-B2AE-B00EEE0A3431'
        }).then(res => {
            if (res) {
                let handlers = _handlers
                handlers.map(item => {
                    if (item.flag === 'SYSL') {
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

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSM' ? true : false
        // 开发负责人与项目经理是同一人
        validationRequireField(_this, 'skffzryj', flag)
    }

    onBeforeSave = (_formData, _btnName) => {
        let _this = this;
        let sparam = JSON.parse(_formData.sparam)
        sparam.szjtjkf = '1'
        //该步骤提交时重置该字段值。是为了项目经理确认步骤准备。
        sparam.isfjgsth=''
        sparam.isfsjglbth=''
        _formData.sparam = JSON.stringify(sparam)
        singleInputFill(_formData, _btnName, 'skffzryj', true)

        //5、总经理办公会会议纪要系统校验：（高）（3人/天）
        //1） 业务提交项目申请时，如科技立项且预算>=300W,则系统校验需要有会议纪要
        //2） 开发负责人审核时，如科技立项且选择了新建系统，一个附件的名字需要包换“总经理办公会会议纪要”字样
        let rxqtcbm = sparam.rxqtcbm;//需求提出部门
        return new Promise(resolve => {
            let flag = true;
            vpAdd('/{bjyh}/xzxt/getbumen', { rxqtcbm: rxqtcbm }).then((response) => {
                //校验编号
                if (response.flag == '1') {
                    let fbxmyjtrje = sparam.fbxmyjtrje;//预算
                    let isfxjxt = sparam.isfxjxt;    //是否新建系统（0：否，1：是）
                    let flagstr = true;
                    const fileNames = _this.rfjRef.state.childNodes;     // 上传文件的集合
                    fileNames.map(v => {
                        let filename = v.filename.substring(0, v.filename.lastIndexOf('.'));
                        if (filename.indexOf('总经理办公会会议纪要') != -1) {
                            flagstr = false;
                        }
                    })
                    if ((isfxjxt == 1 || fbxmyjtrje * 1 >= 3000000) && flagstr) {
                        VpAlertMsg({
                            message: "消息提示",
                            description: "请上传“总经理办公会会议纪要”文档!",
                            type: "error",
                            onClose: this.onClose,
                            closeText: "关闭",
                            showIcon: true
                        }, 5);
                        flag = false
                    }
                    resolve(flag)
                } else {
                    resolve(flag)
                }
            })
        })
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
kffzrshFlowForm20 = FlowForm.createClass(kffzrshFlowForm20);
export default kffzrshFlowForm20;