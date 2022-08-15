import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { formDataToWidgetProps } from '../../../templates/dynamic/Form/Widgets';
import { common, validationRequireField, singleInputFill, fileValidation, initHiddenColumn, xmsqHiddenColumn, initHiddenColumn_history, initHiddenColumn_swxx, validationRequireFieldBitian } from '../code';
import { findWidgetByName } from '../../../templates/dynamic/Form/Widgets'
import { findFiledByName } from 'utils/utils';
/**
 * 项目经理申请资源
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
        initHiddenColumn(iyspctemp)
        vpQuery('/{bjyh}/xzxt/shifouzfry', { loginname: vp.cookie.getTkInfo('username') }).then((response) => {
            if (response.flag == '1') {
                initHiddenColumn_swxx(formData);
                document.getElementById("sname").readOnly = true;
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

    // 加载成功后执行
    onDataLoadSuccess = (formData, handlers) => {

        // 删除生产环境的bjyhweb的div标签元素
        let devflag = window.vp.config.URL.devflag;
        if (!devflag) {
            if (document.getElementById("bjyhweb")) {
                document.getElementById("bjyhweb").remove()
            }
        }

        let _this = this;
        console.log('_this', _this);
        console.log('_formData', formData, handlers);

        // 附件增加删除功能
        let rfj = formData.findWidgetByName('rfj');
        let arrfile = rfj.field.props.widget.load_template;
        arrfile.map(item => {
            item.options.delete = true;
        })

        // 预算编号和名称动态设定
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

        let szjtjkf = formData.findWidgetByName("szjtjkf");
        let szjtjkfval = szjtjkf.field.fieldProps.initialValue
        let stcfh = formData.findWidgetByName("stcfh");
        let stcfhval = stcfh.field.fieldProps.initialValue

        //是否测试环境上线 若为是运维部用户组改为开发部用户组
        let sfcshjsx = formData.findWidgetByName("iwcshjsx");//1是 2否
        let kfgroup, ywgroup, yuhandler//开发和运维的group

        handlers.map(item => {
            if (item.stepcode === 'kfldzpkfzy') {
                kfgroup = { ...item }
            } else if (item.stepcode === 'ywldzpywzy') {
                ywgroup = { ...item }
                yuhandler = formData.findWidgetByName(item.stepkey);
            }
        })
        if (kfgroup && ywgroup && yuhandler) {

            if (sfcshjsx.field.fieldProps.initialValue == 1) {
                handlers.map(item => {
                    if (item.stepcode === 'ywldzpywzy') {
                        item.groupids = kfgroup.groupids
                        yuhandler.field.props.modalProps.groupids = kfgroup.groupids
                    }
                })
            } else if (sfcshjsx.field.fieldProps.initialValue == 2) {
                handlers.map(item => {
                    if (item.stepcode === 'ywldzpywzy') {
                        item.groupids = ywgroup.groupids
                        yuhandler.field.props.modalProps.groupids = ywgroup.groupids
                    }
                })
            }

            sfcshjsx.field.fieldProps.onChange = (v) => {
                console.log('yuhandler', yuhandler);

                if (v.target.value == 1) {
                    handlers.map(item => {
                        if (item.stepcode === 'ywldzpywzy') {
                            item.groupids = kfgroup.groupids
                            yuhandler.field.props.modalProps.groupids = kfgroup.groupids
                        }
                    })
                } else {
                    handlers.map(item => {
                        if (item.stepcode === 'ywldzpywzy') {
                            item.groupids = ywgroup.groupids
                            yuhandler.field.props.modalProps.groupids = ywgroup.groupids
                        }
                    })
                }
                this.forceUpdate()
            }
        }

        //增加项目标签2 显示项目标签
        let ixmbq2 = formData.findWidgetByName('ixmbq2')
        ixmbq2 && (ixmbq2.field.props.label = "项目标签")
        let ixmbq1 = formData.findWidgetByName('ixmbq1')
        ixmbq1 && (ixmbq1.field.props.label = "项目标签")

        this.forceUpdate()
    }


    /**
     * 默认选中按钮，并显示对应的 预设处理人 选项
     */
    onGetFormDataSuccess = data => {
        for (var i = 0; i < data.handlers.length; i++) {
            console.log(data.handlers[i])
            if (data.handlers[i].groupids == "510") {
                data.handlers[i].ids = '1461',//id
                    data.handlers[i].names = '贺怡龙'//显示的汉字 
            }
        }
        let formData = data.form.groups
        let handlers = data.handlers
        let szjtjkf = findFiledByName(data.form, 'szjtjkf')//直接提交开发
        let stcfh = findFiledByName(data.form, 'stcfh')//提出分行bb
        let scondition = findFiledByName(data.form, 'scondition')
        //控制住显示的按钮
        if (szjtjkf.field.widget.default_value == '1') {
            data.scondition = 'SYSF'
            scondition.field.widget.load_template.map(item => {
                if (item.value != 'SYSF' && item.value != 'SYSG') {
                    item.hidden = true
                    scondition.field.widget.default_value = 'SYSF'
                }
            })
        } else {
            if (stcfh.field.widget.default_value == '1') {
                data.scondition = 'bb'
                scondition.field.widget.load_template.map(item => {
                    if (item.value != 'bb' && item.value != 'SYSG') {
                        item.hidden = true
                        scondition.field.widget.default_value = 'bb'
                    }
                })
            } else {
                data.scondition = 'aa'
                scondition.field.widget.load_template.map(item => {
                    if (item.value != 'aa' && item.value != 'SYSG') {
                        item.hidden = true
                        scondition.field.widget.default_value = 'aa'
                    }
                })
            }
        }

        let rtcxqfh = findFiledByName(data.form, 'rtcxqfh')//提出分行
        let fhuserids, fhusernames
        return new Promise(resolve => {
            vpQuery('/{bjyh}/util/getDictionaryListByCode', {
                scode: 'fh',
                flag: 'fhuser'
            }).then(res => {
                if (res.data) {
                    res.data.map(item => {
                        if (`${item.dptid}` === rtcxqfh.field.widget.default_value) {
                            fhuserids = item.ids
                            fhusernames = item.username
                        }
                    })
                }
                data.handlers.map(item => {
                    if (item.flag === 'bb') {
                        item.ids = fhuserids
                        item.names = fhusernames
                    }
                })

                resolve(data)
            })
        })
    }


    // 动态表单事件
    handleCondition(e) {
        let scondition = e.target.value
        let handlers = this.state.handlers

        let condition = ""
        let newdata = handlers ? handlers.filter((item) => {
            let flag
            switch (scondition) {
                case 'SYSG':
                    flag = item.flag == scondition || item.condition == null || item.condition == ''
                    break;
                case 'bb':
                    flag = item.flag == scondition || item.condition == null || item.condition == '' || (item.condition + "'").indexOf("'6'") != -1
                    break;
                case 'aa':
                    flag = item.flag == scondition || item.condition == null || item.condition == '' || (item.condition + "'").indexOf("'6'") != -1
                    break;
                case 'SYSF':
                    flag = item.flag == scondition || item.condition == null || item.condition == ''
                    break;
                default:
                    flag = item.flag == scondition || item.condition == null || (item.condition + "'").indexOf("'6'") != -1
                    break;
            }
            if (flag) {
                condition = item.condition;
            }
            return flag
        }) : []
        this.state.condition = condition;
        newdata = newdata.map(x => {
            return {
                all_line: 2,
                field_label: x.stepname,
                field_name: x.stepkey,
                irelationentityid: x.irelationentityid,
                disabled: x.lastuserflag == 1 && !(x.ids == null || x.ids == '') ? true : false,
                //url: "vfm/ChooseEntity/ChooseEntity",
                url: 'bjyh/templates/Form/ChooseEntity',
                groupids: x.groupids || "",//新增按流程用户组用户过滤用户选择
                condition: x.searchCondition || '',//增加查询条件
                ajaxurl: x.ajaxurl,//模态框自定义url
                validator: { message: "输入内容不能为空！", required: true },
                widget: { default_value: x.ids, default_label: x.names },
                widget_type: "multiselectmodel"
            }
        });

        //将数据转换成新
        let flowHandlerGroupData = formDataToWidgetProps({
            groups: [{
                fields: newdata
            }]
        }, this);

        let formData = this.state.formData

        /* 去除非选中分支处理人校验 */
        let handlerGroups = null;
        formData.groups.map(x => {
            if (x.group_code == "flow_handler") {
                handlerGroups = x;
            }
        });
        if (handlerGroups == null) {
            //没有处理人节
            return;
        }
        if (handlerGroups.fields) {
            //清空处理人字段
            const form = this.props.form;
            handlerGroups.fields.forEach((field) => {
                form.getFieldProps(field.field_name, {
                    rules: [] //清空校验
                })
                form.getFieldProps(field.field_name + "_label", {
                    rules: [] //清空校验
                })
            });
        }
        formData.groups = formData.groups.map(x => {
            if (x.group_code == "flow_handler") {
                x.fields = flowHandlerGroupData.groups[0].fields
                return x
            }
            return x
        })
        let _this = this
        let flag = e.target.value == 'SYSG' ? true : false
        validationRequireField(_this, 'sxmjlclyj', flag);
        validationRequireFieldBitian(_this, 'iwcshjsx', !flag);
        validationRequireFieldBitian(_this, 'ixmbq2', !flag);
    }

    onBeforeSave(formData, btnName) {
        let _this = this
        if (btnName == "ok") {
            let username = vp.cookie.getTkInfo('nickname');
            let sparam = JSON.parse(formData.sparam);
            let fbxmyjtrje = sparam.fbxmyjtrje;
            let iyspc = sparam.iyspc;
            let scondition = sparam.scondition;
            let sxmjlclyj = sparam.sxmjlclyj;//项目经理处理意见
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

            formData.sparam = JSON.stringify(sparam)
            singleInputFill(formData, btnName, 'sxmjlclyj', true)
        }
    }

}
ywdbtjsqFlowForm = FlowForm.createClass(ywdbtjsqFlowForm);
export default ywdbtjsqFlowForm;