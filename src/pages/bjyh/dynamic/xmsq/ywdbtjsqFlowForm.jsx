import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import moment from "moment";
import { fileValidation, validationRequireFieldBitian, initHiddenColumn, xmsqHiddenColumn, initHiddenColumn_history } from '../code'
import { findFiledByName, formatDateTime } from 'utils/utils';
import { VpConfirm, VpButton } from "vpreact/public/Vp";

/**
 * 业务代表提交申请
 */
//项目申请
var iyspctemp = '0';
class ywdbtjsqFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
    }

    onFormRenderSuccess(formData) {
        try {
            initHiddenColumn(iyspctemp)
        } catch (error) {

        }
    }

    // 加载成功后执行
    onDataLoadSuccess = formData => {
        //是否涉及基础数据产生
        let isfsjjcsjcs=formData.findWidgetByName('isfsjjcsjcs');
        if(isfsjjcsjcs){
            //给该单选框增加悬浮提示。
            isfsjjcsjcs.field.tip='输入和输出信息是否涉及客户、产品、协议、机构、渠道、账户等基础业务数据的产生';
        }
        //是否涉及数据加工
        let isfsjsjjg=formData.findWidgetByName('isfsjsjjg');
        if(isfsjsjjg){
            //给该单选框增加悬浮提示。
            isfsjsjjg.field.tip='是否涉及非监管类指标、标签、数据分析挖掘模型等数据应用加工需求';
        }
        //是否涉及监管报送
        let isfsjjgbs=formData.findWidgetByName('isfsjjgbs');
        if(isfsjjgbs){
            //给该单选框增加悬浮提示。
            isfsjjgbs.field.tip='本项目产生的业务数据是否属于人行、银监各类监管报送范围';
        }
        //是否涉及监管报送
        let isfsjsjzlzg=formData.findWidgetByName('isfsjsjzlzg');
        if(isfsjsjzlzg){
            //给该单选框增加悬浮提示。
            isfsjsjzlzg.field.tip='本项目是否涉及《全行数据质量整改任务清单》中的整改任务';
        }
        // 删除生产环境的bjyhweb的div标签元素
        let devflag = window.vp.config.URL.devflag;
        if (!devflag) {
            if (document.getElementById("bjyhweb")) {
                document.getElementById("bjyhweb").remove()
            }
        }

        let _this = this;
        let sxqslrshclyj = formData.findWidgetByName('sxqslrshclyj');
        let clyj = sxqslrshclyj.field.fieldProps.initialValue

        if (clyj == null || clyj == undefined || clyj == '') {
            formData.groups[sxqslrshclyj.groupIndex].group_type = 2
        } else {
            formData.groups[sxqslrshclyj.groupIndex].group_type = 1
            // VpConfirm({
            //     title:'需求受理人审核处理意见',
            //     content:''+clyj,
            //     width:'600',
            //     okText:'关闭',
            //     iconType:'warning', 
            //     footer(){null}
            // });
            //自动带出项目经理
            vpAdd('/{bjyh}/ZKsecondSave/searchJj', {
                piid: _this.props.piid, name: 'SYSD', userid: vp.cookie.getTkInfo().userid, entityname: "WFENT_XMSQ", dqskey: "SYSA"
            }).then(res => {
                console.log(res);
                if (res.flag) {
                    VpAlertMsg({
                        message: '需求受理人审核处理意见',
                        description: '' + clyj,
                        closeText: '关闭',
                        type: 'info',
                        showIcon: true
                    }, 30);
                }

            })
        }

        let iyspc = formData.findWidgetByName('iyspc');
        if (_this.props.isHistory) {
            try {
                initHiddenColumn_history(formData)
            } catch (error) {

            }
        }
        //1） 增加单选框“是否涉及使用外部数据，”如是，输入框“使用行外数据的内容”为必输项；（0.5人/天）
        //2） 增加单选框“是否已提交外部数据申请ID”,如是，“外部数据申请ID”输入框为必输（0.5人/天）
        formData.findWidgetByName('isfsjsywbsj').field.fieldProps.onChange = function (v) {
            if (v.target.value == 0) {
                validationRequireFieldBitian(_this, 'ssyhwsjnr', false);
            } else {
                validationRequireFieldBitian(_this, 'ssyhwsjnr', true);
            }
        }
        formData.findWidgetByName('isfytjwbsjsqid').field.fieldProps.onChange = function (v) {
            if (v.target.value == 0) {
                validationRequireFieldBitian(_this, 'swbsjsqid', false);
            } else {
                validationRequireFieldBitian(_this, 'swbsjsqid', true);
            }
        }
        /**
          * 项目管理系统（六期）项目 55.预算不能为0，为0需填写原因
          * 1.本项目预计投入费用（元）字段添加onchange事件 
          * 2.根据 本项目预计投入费用（元）的值给 无预计费用原因添加校验
          */
        formData.findWidgetByName('fbxmyjtrje').field.fieldProps.onChange = function (v) {
            if (v == 0) {
                _this.props.form.resetFields(['swyjfyyy']);
                _this.state.formData.findWidgetByName('swyjfyyy').field.props.readOnly = false;
                _this.state.formData.findWidgetByName('swyjfyyy').field.props.disabled = false;
                _this.state.formData.findWidgetByName('swyjfyyy').field.fieldProps.rules[1] = { required: true, message: "本项目预计投入费用等于0，请填写无预计费用原因" };
                _this.props.form.validateFields(['swyjfyyy'], { force: true });
            } else {
                _this.props.form.resetFields(['swyjfyyy']);
                _this.props.form.setFieldsValue({ 'swyjfyyy': '' });
                _this.state.formData.findWidgetByName('swyjfyyy').field.props.readOnly = true;
                _this.state.formData.findWidgetByName('swyjfyyy').field.props.disabled = true;
                _this.state.formData.findWidgetByName('swyjfyyy').field.fieldProps.rules[1] = { required: false, message: "" };
            }
        }
        let fbxmyjtrjeVal = formData.findWidgetByName('fbxmyjtrje').field.fieldProps.initialValue;
        if (fbxmyjtrjeVal == 0) {
            formData.findWidgetByName('swyjfyyy').field.props.readOnly = false;
            formData.findWidgetByName('swyjfyyy').field.props.disabled = false;
            formData.findWidgetByName('swyjfyyy').field.fieldProps.rules[1] = { required: true, message: "本项目预计投入费用等于0，请填写无预计费用原因" };
        }
        iyspctemp = iyspc && iyspc.field.fieldProps.initialValue;
        iyspc.field.fieldProps.onChange = (v) => {
            //document.getElementsByClassName('ant-tabs-tabpane')[0].innerHTML='';
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
                });
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

        //申请完成日期改变时，判断是不是大于当前时间
        let dsqwcrq = formData.findWidgetByName('dsqwcrq');
        dsqwcrq.field.fieldProps.onChange = function (v) {
            let t1 = moment().format('YYYYMMDD');
            let t2 = moment(v).format('YYYYMMDD');
            if (moment(t2).isBefore(t1)) {
                VpAlertMsg({
                    message: "消息提示",
                    description: "输入的【申请完成日期】不能小于当前日期，请重新输入！",
                    type: "warning",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
                _this.props.form.setFieldsValue({ 'dsqwcrq': '' })
            }
        }
        // 预算编号和名称动态设定
        let fbxmyjtrje = formData.findWidgetByName('fbxmyjtrje');
        fbxmyjtrje.field.props.placeholder = '单位为元';

        let szjtjxmjlquer = formData.findWidgetByName("szjtjxmjlquer");
        let szjtjxmjlquerval = szjtjxmjlquer.field.fieldProps.initialValue
        //控制住显示的按钮
        let scondition = formData.findWidgetByName("scondition");
        if (szjtjxmjlquerval == null || szjtjxmjlquerval == undefined || szjtjxmjlquerval == '' || szjtjxmjlquerval == '0') {
            _this.props.form.setFieldsValue({
                'szjtjxmjlquer': '0',
                'scondition': 'SYSA'
            })
            let options = [];
            options.push(scondition.field.props.options_[0])
            scondition.field.props.options_ = options
        } else {
            _this.props.form.setFieldsValue({
                'scondition': 'SYSB'
            })
            let options = [];
            options.push(scondition.field.props.options_[1])
            scondition.field.props.options_ = options
        }

        //分行查询过滤
        let rtcxqfh = formData.findWidgetByName('rtcxqfh');
        rtcxqfh.field.props.modalProps.condition = [{
            field_name: 'scode',
            field_value: 'fh',
            expression: 'like'
        }]
        this.forceUpdate()

        let ywdb = formData.findWidgetByName('rywdb');

        if (ywdb && ywdb.field.props.widget.default_value) {
            let ywbld = formData.findWidgetByName('rywbld');
            ywbld && vpAdd('/{bjyh}/util/getDptInfoByUserids', {
                userids: ywdb.field.props.widget.default_value
            }).then(res => {
                if (res.data) {
                    const dptid = res.data.iid
                    ywbld.field.props.modalProps.condition = [{
                        field_name: 'idepartmentid',
                        field_value: dptid,
                        flag: '3'
                    }]
                    ywbld.field.props.modalProps.ajaxurl = '/{bjyh}/xzxt/getUser';
                }
            })
        }
    }

    /**
     * 默认选中按钮，并显示对应的 预设处理人 选项
     */
    onGetFormDataSuccess = data => {
        let formData = data.form.groups
        let szjtjxmjlquerval = findFiledByName(data.form, 'szjtjxmjlquer').field.widget.default_value
        //控制住显示的按钮

        if (szjtjxmjlquerval == null || szjtjxmjlquerval == undefined || szjtjxmjlquerval == '' || szjtjxmjlquerval == '0') {
            data.scondition = 'SYSA'
        } else {
            data.scondition = 'SYSB'
        }
    }

    onBeforeSave(formData, btnName) {
        let _this = this
        if (btnName == "ok") {

            let sparam = JSON.parse(formData.sparam);
            let fbxmyjtrje = sparam.fbxmyjtrje;
            let iyspc = sparam.iyspc;
            let rtcxqfh = sparam.rtcxqfh//提出需求分行
            // sparam.sfhkjfzr = '0'//分行科技负责人
            // sparam.szjtjkf ='0' //直接提交开发负责人

            if (rtcxqfh) {
                sparam.stcfh = '1'//提出分行
            }
            //该步骤提交时重置该字段值。是为了项目经理确认步骤准备。
            sparam.isfjgsth=''
            sparam.isfsjglbth=''
            formData.sparam = JSON.stringify(sparam)

            if (fbxmyjtrje > 0) {
                if (iyspc <= 0) {
                    VpAlertMsg({
                        message: "消息提示",
                        description: "本项目预计投入费用大于0，请添加预算信息，准确预算信息请在商务管理系统中查询！",
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    return false
                }
            }
            return new Promise(resolve => {
                let flag = true;

                vpAdd('/{bjyh}/xmsq/checkYs', { sparam: JSON.stringify(sparam), method: 'chenknamecodecuowu' }).then((response1) => {
                    //校验编号
                    if (response1.success == '1') {
                        VpAlertMsg({
                            message: "消息提示",
                            description: response1.message,
                            type: "error",
                            onClose: this.onClose,
                            closeText: "关闭",
                            showIcon: true
                        }, 5);
                        flag = false
                        resolve(flag)
                    }
                    if (response1.success == 0) {
                        vpAdd('/{bjyh}/xmsq/checkYs', { sparam: JSON.stringify(sparam), method: 'chenknamecodecuowu1' }).then((response2) => {
                            //检验编号，名称和一致性
                            if (response2.success == '1') {
                                VpAlertMsg({
                                    message: "消息提示",
                                    description: response2.message,
                                    type: "error",
                                    onClose: this.onClose,
                                    closeText: "关闭",
                                    showIcon: true
                                }, 5);
                                flag = false
                                resolve(flag)
                            }
                            if (response2.success == '0') {
                                //校验金额
                                vpAdd('/{bjyh}/xmsq/checkYs', { sparam: JSON.stringify(sparam), method: 'chenkmoney' }).then((response3) => {
                                    if (response3.success == '1') {
                                        VpAlertMsg({
                                            message: "消息提示",
                                            description: "预算金额不足，请重新填写项目预算金额",
                                            type: "error",
                                            onClose: this.onClose,
                                            closeText: "关闭",
                                            showIcon: true
                                        }, 5);
                                        flag = false
                                        resolve(flag)
                                    }
                                    if (response3.success == '0') {
                                        //附件验证
                                        flag = fileValidation(_this, btnName, "xmsq", "ywdbtjsq");
                                        resolve(flag)
                                    }
                                })
                            }
                        })
                    }
                })
            })
        }
    }
}
ywdbtjsqFlowForm = FlowForm.createClass(ywdbtjsqFlowForm);
export default ywdbtjsqFlowForm;