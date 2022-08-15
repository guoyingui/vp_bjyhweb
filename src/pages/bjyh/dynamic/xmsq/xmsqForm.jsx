
import React, { Component } from "react";
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg, VpConfirm, VpPopover, VpMWarning } from "vpreact";
import moment from "moment";
import './xmsqForm.less'
import { vpAdd } from "vpreact/public/Vp";
import FlowSpecialMsg from 'pages/custom/Flow/FlowSpecialMsg';
import HomePageExt from '../index/homePageExt';
import { validationRequireFieldBitian } from '../code';
//项目申请
var iyspctemp = '0';
class xmsqForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
    }
    // 加载成功后执行
    componentDidMount() {
        super.componentDidMount()
        if (this.props.add) {
            //HomePageExt.checkAddAccess(this);
        }
    }

    onDataLoadSuccess = formData => {
        //默认带出当前登录人
        let _this = this;
        if (_this.props.add) {
            _this.props.form.setFieldsValue({
                'rywdb': vp.cookie.getTkInfo('userid'),
                'rywdb_label': vp.cookie.getTkInfo('nickname'),
                'rxqtcbm': vp.cookie.getTkInfo('idepartmentid'),
                'rxqtcbm_label': vp.cookie.getTkInfo('dptname'),
                'dtcrq': new Date(),
                'stxsm': '指本项目估计投入的预算费用金额（含软、硬件），用于项目立项过程中分级，并非用于商务流程的工作量评估费用金额。',
            })
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
         * 项目管理系统（六期）项目 51.项目申请增加预期应用效果字段
         * 1.在新建实体时 将字段内容存入数据库 后面流程直接使用 
         * 2.默认值 ： 配置实体时已经配置完成 （可在投资收益、市场反馈、应用效果等方面进行预期评估，此指标将用于项目后评价分析。）
         * 3.在实体节中 隐藏该字段 
         */
        //formData.findWidgetByName('syqyyxgsm').field.hidden=true;
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
        let fbxmyjtrj=formData.findWidgetByName('fbxmyjtrje');
        let swyjfyyy=formData.findWidgetByName('swyjfyyy');
        if(fbxmyjtrj&&swyjfyyy){
            let fbxmyjtrjeVal = fbxmyjtrj.field.fieldProps.initialValue;
            if (fbxmyjtrjeVal == 0) {
                swyjfyyy.field.props.readOnly = false;
                swyjfyyy.field.props.disabled = false;
                swyjfyyy.field.fieldProps.rules[1] = { required: true, message: "本项目预计投入费用等于0，请填写无预计费用原因" };
            }
        }
        //申请完成日期改变时，判断是不是大于当前时间
        let dsqwcrq = formData.findWidgetByName('dsqwcrq');
        dsqwcrq.field.fieldProps.rules.push({ validator: this.dateValidator })
        /* dsqwcrq.field.fieldProps.onChange = function (v) {
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
                _this.props.form.setFieldsValue({dsqwcrq:''})
            }
        } */

        // 预算编号和名称动态设定
        let stxsm = formData.findWidgetByName('stxsm');
        stxsm.field.props.className = "red";
        let fbxmyjtrje = formData.findWidgetByName('fbxmyjtrje');
        fbxmyjtrje.field.props.placeholder = '单位为元';

        let iyspc = formData.findWidgetByName('iyspc');
        iyspctemp = iyspc && iyspc.field.fieldProps.initialValue;

        let sysbh1 = formData.findWidgetByName('sysbh1');
        let sysbh2 = formData.findWidgetByName('sysbh2');
        let sysbh3 = formData.findWidgetByName('sysbh3');
        let sysbh4 = formData.findWidgetByName('sysbh4');
        let sysbh5 = formData.findWidgetByName('sysbh5');
        let sysmc1 = formData.findWidgetByName('sysmc1');
        let sysmc2 = formData.findWidgetByName('sysmc2');
        let sysmc3 = formData.findWidgetByName('sysmc3');
        let sysmc4 = formData.findWidgetByName('sysmc4');
        let sysmc5 = formData.findWidgetByName('sysmc5');
        let sysmc = { 1: sysmc1, 2: sysmc2, 3: sysmc3, 4: sysmc4, 5: sysmc5 }
        let sysbh = { 1: sysbh1, 2: sysbh2, 3: sysbh3, 4: sysbh4, 5: sysbh5 }

        if (iyspctemp == "0") {
            formData.groups[sysmc1.groupIndex].fields.splice(sysmc1.fieldIndex - 1, 10)
        } else if (iyspctemp == "1") {
            formData.groups[sysmc1.groupIndex].fields.splice(sysbh2.fieldIndex, 8)
        } else if (iyspctemp == "2") {
            formData.groups[sysmc1.groupIndex].fields.splice(sysbh3.fieldIndex, 6)
        } else if (iyspctemp == "3") {
            formData.groups[sysmc1.groupIndex].fields.splice(sysbh4.fieldIndex, 4)
        } else if (iyspctemp == "4") {
            formData.groups[sysmc1.groupIndex].fields.splice(sysbh5.fieldIndex, 2)
        } else if (iyspctemp == "5") {

        }

        _this.setState({ lastnum: iyspctemp })//首次进入页面 初始化lastnum

        iyspc.field.fieldProps.onChange = (v) => {
            let lastnum = _this.state.lastnum || 0
            let dvalue = v * 1 - lastnum * 1
            let element_ = formData.findWidgetByName('sysmc' + lastnum)
            if (!element_) {
                element_ = formData.findWidgetByName('stxsm')
            }

            if (v == "0") {
                //if(_this.state.lastnum||0 != 0){
                _this.props.form.setFieldsValue({
                    'sysbh1': '', 'sysbh2': '', 'sysbh3': '',
                    'sysbh4': '', 'sysbh5': '',
                    'sysmc1': '', 'sysmc2': '', 'sysmc3': '',
                    'sysmc4': '', 'sysmc5': '',
                })
                formData.groups[sysmc1.groupIndex].fields.splice(sysbh1.fieldIndex, (lastnum * 1) * 2)
                //}
            } else if (v == "1") {
                if (dvalue > 0) {
                    _this.scrption(formData, element_, sysmc, sysbh, dvalue)
                } else {
                    formData.groups[sysbh1.groupIndex].fields.splice(sysmc1.fieldIndex + 1, (lastnum * 1 - 1) * 2)
                }

            } else if (v == "2") {
                if (dvalue > 0) {
                    _this.scrption(formData, element_, sysmc, sysbh, dvalue)
                } else {
                    formData.groups[sysbh2.groupIndex].fields.splice(sysmc2.fieldIndex + 1, (lastnum * 1 - 1) * 2)
                }

            } else if (v == "3") {
                if (dvalue > 0) {
                    _this.scrption(formData, element_, sysmc, sysbh, dvalue)
                } else {
                    formData.groups[sysmc3.groupIndex].fields.splice(sysmc3.fieldIndex + 1, (lastnum * 1 - 1) * 2)
                }

            } else if (v == "4") {
                if (dvalue > 0) {
                    _this.scrption(formData, element_, sysmc, sysbh, dvalue)
                } else {
                    formData.groups[sysmc4.groupIndex].fields.splice(sysmc4.fieldIndex + 1, (lastnum * 1 - 1) * 2)
                }

            } else if (v == "5") {
                _this.scrption(formData, element_, sysmc, sysbh, dvalue)
            }
            _this.setState({ lastnum: v })
        }

        //分行查询过滤
        let rtcxqfh = formData.findWidgetByName('rtcxqfh');
        rtcxqfh.field.props.modalProps.condition = [{
            field_name: 'scode',
            field_value: 'fh',
            expression: 'like'
        }]

        // 项目名称增加提按钮提示
        let sname = formData.findWidgetByName('sname');
        const content = (
            <div>
                <p style={{ fontWeight: 600 }}>1、明确系统的项目</p>
                <p>采用A+B的形式。</p>
                <p>A：系统名称；</p>
                <p>B：项目对源系统的影响（新建、功能提升（具体功能）、N.0、重构））</p>
                <p>举例：财富系统4.0项目、个人手机银行5.0项目、贵宾权益系统新建项目、网银系统功能提升（增加结售汇功能）、银保通系统重构项目。</p>
                <p style={{ fontWeight: 600 }}>2、明确产品的项目：</p>
                <p>采用A+B的形式。</p>
                <p>A：产品全称 ；</p>
                <p>B：项目对原有产品的影响：新增、完善、N期 </p>
                <p>举例：网银贷产品新增、网银贷产品完善（变更企业准入规则）、网银贷产品二期。</p>
                <p style={{ fontWeight: 600 }}>3、明确业务场景、多项目组成的项目群：</p>
                <p>采用A+B的形式。</p>
                <p>A：描述业务场景</p>
                <p>B：此项目在该场景中的组成部分或涉及系统。</p>
                <p>举例：人行261号文改造（黑名单校验）、反洗钱客户信息改造（CIF唯一性）、网络DNS改造（ESB系统）。</p>
            </div>
        )
        if (sname) {
            sname.field.props.addonAfter = (
                <div className='ant-select ant-select-enabled'
                    style={{ margin: '-5px -7px', width: '70px', lineHeight: '32px' }}
                >

                    <VpPopover style={{ width: 70 }} content={content} autoAdjustOverflow={true}
                        title="命名规范" trigger="click" >

                        <div style={{ cursor: 'pointer' }}>命名规范</div>
                    </VpPopover>

                </div>
            )
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
            debugger;
            let ixmdj_xmsxxx = formData.findWidgetByName('ixmdj_xmsxxx');
            ixmdj_xmsxxx.field.props.label = '项目等级';
            //
            let ixmsx_pmo = formData.findWidgetByName('ixmsx_pmo');
            ixmsx_pmo.field.props.label = '项目属性';
            //
            let rsjxt_pmo = formData.findWidgetByName('rsjxt_pmo');
            rsjxt_pmo.field.props.label = '涉及系统';
        } catch (e) {
            console.log(e);
        }
    }

    onBeforeSave(formData, btnName) {
        vpPostAjax(
            '/{bjyh}/lcTcTxJXzRest/getXmSqTxFlag', {
            userId: vp.cookie.getTkInfo('userid')
        }, 'GET'
            , function (data) {
                if (data.flag) {
                    VpMWarning({
                        title: '这是一条提醒通知',
                        width: 800,
                        content:
                            <FlowSpecialMsg
                                msg1={data.msg1}
                                msg2={data.msg2}
                                msg3={data.msg3}
                            />
                    })
                }
            });


        let sparam = JSON.parse(formData.sparam);
        let fbxmyjtrje = sparam.fbxmyjtrje;
        let iyspc = sparam.iyspc;
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
                                    resolve(flag)
                                }
                            })
                        }
                    })
                }
            })
        })
    }

    dateValidator = (rule, value, callback) => {
        console.log(rule, value, callback);

        let t1 = moment().format('YYYYMMDD');
        let t2 = moment(value).format('YYYYMMDD');
        if (moment(t2).isBefore(t1)) {
            VpAlertMsg({
                message: "消息提示",
                description: "输入的【申请完成日期】不能小于当前日期，请重新输入！",
                type: "warning",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5);
            callback('输入的【申请完成日期】不能小于当前日期')
            //_this.props.form.setFieldsValue({dsqwcrq:''})
        }
        callback()
    }


    scrption = (formData, element_, sysmc, sysbh, dvalue) => {
        let lastnum = this.state.lastnum || 0
        let index_ = 1
        for (let index = 1; index <= dvalue; index++) {
            formData.insertNewWidget({
                groupIndex: sysbh[1].groupIndex,
                fieldIndex: element_.fieldIndex + index_
            }, element_.field.props.field_name === 'stxsm' ? sysbh[index * 1].field : sysbh[lastnum * 1 + 1 + index - 1].field)
            formData.insertNewWidget({
                groupIndex: sysbh[1].groupIndex,
                fieldIndex: element_.fieldIndex + index_ + 1
            }, element_.field.props.field_name === 'stxsm' ? sysmc[index * 1].field : sysmc[lastnum * 1 + 1 + index - 1].field)
            index_ = index_ + 2
        }
    }
}
xmsqForm = DynamicForm.createClass(xmsqForm);
export default xmsqForm;