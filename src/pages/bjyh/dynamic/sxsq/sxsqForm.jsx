import React, { Component } from "react";
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg, VpConfirm } from "vpreact";
import { validationRequireField } from '../code';
import moment from "moment";

//上线申请
class sxsqForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
        moment.locale('zh_cn');
        console.log('moment', moment().format('YYYYMMDD'));
        console.log('sxsqForm', this);
    }

    //保存前
    onBeforeSave(formData, btnName) {
        let flag = true;
        let _this = this;
        let projectid = this.props.form.getFieldsValue(['sxmbh']);
        let iyxqfh = this.props.form.getFieldsValue(['iyxqfh']);
        let zttcr = vp.cookie.getTkInfo('userid')
        console.log("zttcr", zttcr);
        console.log('tkinfo', vp.cookie.getTkInfo())
        console.log("btnName", btnName);
        console.log("iyxqfh", iyxqfh);

        let dsqsxsj = this.props.form.getFieldsValue(['dsqsxsj']);
        let sxsj = moment(dsqsxsj.dsqsxsj).format("YYYYMMDD");
        let sname = this.props.form.getFieldsValue(['sname']);
        let subname = sname.sname.substring(0, sname.sname.length - 8);
        console.log("sxsj", sxsj);
        console.log("subname", subname);

        let sparam = JSON.parse(formData.sparam);
        sparam.sname = subname + sxsj;
        formData.sparam = JSON.stringify(sparam);

        if (iyxqfh.iyxqfh == 2) {
            VpAlertMsg({
                message: "消息提示",
                description: "需求不符合，不能发起流程！",
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5);
            return false;
        } else {
            if (btnName == "ok" || btnName == "saveAndNew" || btnName == "saveAndFlow") {
                return new Promise(resolve => {
                    vpQuery('/{bjyh}/ZKsecondSave/queryXqtcrByProjectId', {
                        projectid: projectid.sxmbh, zttcr: zttcr
                    }).then((response) => {
                        console.log("response.data", response.data);
                        if (response.data == false) {
                            VpAlertMsg({
                                message: "消息提示",
                                description: "非本项目提出人，请联系项目提出人发起上线流程！",
                                type: "error",
                                onClose: this.onClose,
                                closeText: "关闭",
                                showIcon: true
                            }, 5);
                            resolve(false);
                        } else {
                            //保存并发起流程 判断需求符合字段
                            if (btnName == "saveAndFlow") {
                                //是否与需求符合
                                let iyxqfh = this.props.form.getFieldsValue(['iyxqfh']);
                                //1为是 2 为否
                                console.log("iyxqfh", iyxqfh.iyxqfh);
                                if (iyxqfh.iyxqfh == 2) {
                                    VpAlertMsg({
                                        message: "消息提示",
                                        description: "需求不符合，不能发起流程！",
                                        type: "error",
                                        onClose: this.onClose,
                                        closeText: "关闭",
                                        showIcon: true
                                    }, 5);
                                    resolve(false);
                                } else {
                                    // 判断当前项目是否发起过上线流程
                                    vpQuery('/{bjyh}/ZKsecondSave/querySxsqByProjectId', {
                                        projectid: projectid.sxmbh
                                    }).then((response) => {
                                        if (response.data == true) {
                                            VpConfirm({
                                                title: "消息提示",
                                                content: "本项目已经发起过最终上线流程，是否仍然继续提交？",
                                                onText: "提交",
                                                CancelText: "取消",
                                                onOk() {
                                                    console.log("OK1");
                                                    resolve(true);
                                                },
                                                onCancel() {
                                                    //清空项目
                                                    console.log("----")
                                                    _this.props.form.setFieldsValue({
                                                        'rxmmc': null,//id
                                                        'rxmmc_label': null//显示的汉字
                                                    })
                                                    _this.props.form.setFieldsValue({ sxmbh: null });
                                                    resolve(false);
                                                }
                                            }, 5);
                                        } else {
                                            resolve(true);
                                        }
                                    })
                                }
                            } else {
                                // 判断当前项目是否发起过上线流程
                                vpQuery('/{bjyh}/ZKsecondSave/querySxsqByProjectId', {
                                    projectid: projectid.sxmbh
                                }).then((response) => {
                                    if (response.data == true) {
                                        VpConfirm({
                                            title: "消息提示",
                                            content: "本项目已经发起过最终上线流程，是否仍然继续提交？",
                                            onText: "提交",
                                            CancelText: "取消",
                                            onOk() {
                                                console.log("OK2");
                                                resolve(true);
                                            },
                                            onCancel() {
                                                //清空项目
                                                console.log("----")
                                                _this.props.form.setFieldsValue({
                                                    'rxmmc': null,//id
                                                    'rxmmc_label': null//显示的汉字
                                                })
                                                _this.props.form.setFieldsValue({ sxmbh: null });
                                                resolve(false);
                                            }
                                        }, 5);
                                    } else {
                                        resolve(true);
                                    }
                                })
                            }
                        }
                    })
                })
            }
        }
    }

    onGetFormDataSuccess = data => {
        // 非上线日投产原因分类
        let ifsxrtcyyflArray = [];
        data.form.groups.map(item => {
            if (item.group_label == '基本信息') {
                item.fields.map(item1 => {
                    if (item1.field_name == 'ifsxrtcyyfl' && item1.widget.default_label == '') {
                        console.log("ifsxrtcyyfl", item1);
                        item1.widget.load_template.map(item2 => {
                            if (item2.label == '监管/第三方机构要求' || item2.label == '技术紧急修正' || item2.label == '快捷上线/特殊批准') {
                                console.log("item2", item2);
                            } else {
                                ifsxrtcyyflArray.push(item2);
                            }
                        })
                        item1.widget.load_template = ifsxrtcyyflArray;
                    }
                })
            }
        })
    }

    //自定义控件行为
    onDataLoadSuccess = formData => {
        //默认带出当前登录人
        let _this = this;
        //是否通过1
        let iywyzsftg11 = formData.findWidgetByName('iywyzsftg');
        iywyzsftg11.field.props.label = "是否通过";
        //是否返回业务1
        let isffhyw11 = formData.findWidgetByName('isffhyw1');
        isffhyw11.field.props.label = "是否返回业务";
        //是否与需求符合6
        let ixqfh66 = formData.findWidgetByName('ixqfh6');
        ixqfh66.field.props.label = "是否与需求符合";
        //是否与需求符合7
        let ixqfh77 = formData.findWidgetByName('ixqfh7');
        ixqfh77.field.props.label = "是否与需求符合";

        console.log('sxsqForm', formData);
        console.log('tkinfo', vp.cookie.getTkInfo())
        //获取字段
        let rywdb = formData.findWidgetByName('rywdb')
        //若存在
        if (rywdb) {
            // console.log('rywdb',rywdb)
            // console.log('rywdb',rywdb.field.fieldProps.initialValue)
            if (rywdb.field.fieldProps.initialValue > 0) {
                //代表当前人已经设置值 则不用带出当前登录人
            } else {
                _this.props.form.setFieldsValue({
                    'rywdb': vp.cookie.getTkInfo('userid'),//id
                    'rywdb_label': vp.cookie.getTkInfo('nickname')//显示的汉字
                })
            }

        }
        //获取字段
        //选择项目自动带出项目编号 项目部门 项目类型
        var rxmmc = formData.findWidgetByName("rxmmc");
        var sxmbh = formData.findWidgetByName("sxmbh");
        var sname = formData.findWidgetByName("sname");
        //项目部门
        var rxmtcbm = formData.findWidgetByName("rxmtcbm");
        //项目类别
        var sxmsslb = formData.findWidgetByName("sxmsslb");

        let zttcr = vp.cookie.getTkInfo('userid')
        //选择项目时 状态为启动，并且需求提出人是当前登陆人的
        rxmmc.field.props.modalProps.condition = [{
            field_name: 'istatusid',
            field_value: '5',
            expression: 'in'
        }, {
            field_name: 'roleid1000018',
            field_value: vp.cookie.getTkInfo('userid'),
            expression: 'in'
        }]

        /**
         * 76.优化需求(二)
         * 5.在上线申请流程【业务代表提交申请】审批节点增加“预期应用效果”字段，
         * 对于未填写“预期应用效果”的项目此字段必填，
         * 已经填写“预期应用效果”的项目自动带出此字段的内容，且只读
         * 1.在填写项目上线申请时 选择项目后将 项目本身的预期应用效果存到上线申请的实体中
         * 2.隐藏 预期应该效果的两个字段 
         */
        formData.findWidgetByName('syqyyxg').field.hidden = true;
        formData.findWidgetByName('syqyyxg_xmsq').field.hidden = true;

        if (rxmmc != null) {
            rxmmc.field.fieldProps.onChange = function (value) {
                vpQuery('/{vpplat}/vfrm/entity/getRowData', {
                    entityid: "7", iid: value, viewcode: "vpm_pj_project"
                }).then((response) => {
                    if (response.data != null) {
                        let data = response.data
                        console.log('data', data);
                        if (data.istatusid != 5) {
                            VpAlertMsg({
                                message: "消息提示",
                                description: "非【启动】状态的项目，如仍需发起上线，请联系项目经理进行处理！",
                                type: "error",
                                onClose: this.onClose,
                                closeText: "关闭",
                                showIcon: true
                            }, 5);
                            //清空项目
                            console.log("----")

                            _this.props.form.setFieldsValue({
                                'rxmmc': null,//id
                                'rxmmc_label': null//显示的汉字
                            })
                            _this.props.form.setFieldsValue({ sxmbh: null });
                        } else {
                            //带出项目编号
                            if (sxmbh != null) { _this.props.form.setFieldsValue({ sxmbh: data.scode }); }
                            if (sxmsslb != null) { _this.props.form.setFieldsValue({ sxmsslb: data.iclassid }); }
                            if (sname != null) { _this.props.form.setFieldsValue({ sname: "【" + data.sname + "】上线申请" + moment().format('YYYYMMDD') }); }
                            //带出项目部门
                            _this.props.form.setFieldsValue({
                                'rxmtcbm': data.idepartmentid,//id
                                'rxmtcbm_label': data.idepartmentid_name,//显示的汉字
                                'iwcshjsx': data.iwcshjsx,//带出项目的是否为测试环境上线
                                'syqyyxg': data.syqyyxg,//预期应用效果
                                'syqyyxg_xmsq': data.syqyyxg//预期应用效果_项目申请（将项目申请时的预期应用效果存入，方便校验使用）
                            })
                            // 如一致则【是否需求提出人】字段设置为1
                            vpQuery('/{bjyh}/ZKsecondSave/queryXqtcrByProjectId', {
                                projectid: data.scode, zttcr: zttcr
                            }).then((response) => {
                                if (response.data == true) {
                                    // ssfxqtcr
                                    _this.props.form.setFieldsValue({
                                        'ssfxqtcr': "1"
                                    })
                                } else {
                                    // ssfxqtcr
                                    _this.props.form.setFieldsValue({
                                        'ssfxqtcr': ""
                                    })
                                }
                            })
                        }


                    }
                })
            }
        }
        // 监听是否部分上线
        //获取字段
        let isfbfsx = formData.findWidgetByName('isfbfsx')
        let isfzzsx = formData.findWidgetByName('isfzzsx')
        isfbfsx.field.fieldProps.onChange = function (v) {
            // console.log("TEST 监听！"+isfbfsx);
            // console.log("isfbfsx",isfbfsx);
            // console.log("isfbfsx",isfbfsx.checked);
            //isfzzsx.field.checked=true;
            let value = v.target.value;
            console.log("isfzzsx", isfzzsx);
            console.log("value", value);
            if (value == 1) {
                isfzzsx.field.props.disabled = true;
            } else {
                isfzzsx.field.props.disabled = false;
            }

            _this.props.form.setFieldsValue({
                isfzzsx: value == "1" ? "0" : "1"
            })
        }

        //监听上线申请时间
        let dsqsxsj = formData.findWidgetByName('dsqsxsj')
        dsqsxsj.field.fieldProps.onChange = function (v) {
            let t1 = moment().format('YYYYMMDD');
            let t2 = moment(v).format("YYYYMMDD")
            let t3 = moment(v).format("YYYY-MM-DD")
            let txjg = '';
            let txxs = '';
            let shangxianri = false;
            let shifoujiaoyanzhu = false;
            let swt=false;
            let message='';
            vpPostAjax(
                '/{bjyh}/xmsq/getXmSxTxFlag'
                , {
                    sqSxSj: t2,
                    SxSj: t3
                }
                , 'GET'
                , function (data) {
                    txjg = data.txjg;
                    txxs = data.txxs;
                    shangxianri = data.shangxianri;
                    shifoujiaoyanzhu = data.shifoujiaoyanzhu;
                    swt=data.switch.flag||false;
                    message=data.switch.message||'';
                }
            );

            if (moment(t2).isBefore(t1)) {
                console.log("当前日期", t1)
                console.log("选中日期", t2)
                console.log('输入的【申请上线时间】小于系统日期，请重新输入！');

                VpAlertMsg({
                    message: "消息提示",
                    description: "输入的【申请上线时间】小于系统日期，请重新输入！",
                    type: "warning",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
                //申请上线时间小于当前系统时间，系统提示后，上线信息无需保存
                _this.resetFields(_this,'dsqsxsj','');
                //项目上线时间与维护表中的标准上线是否一致

            } else if (shangxianri && shifoujiaoyanzhu) {
                //选中的时间是上线日，但是当前系统时间小于配置的时间间隔。也是无法提上线申请单。
                VpAlertMsg({
                    message: "消息提示",
                    description: "请于上线前一周的周四" + txxs + "点前完成业务测试工作并将上线申请提交到信息技术部门。",
                    type: "warning",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
                _this.resetFields(_this,'dsqsxsj','');

            } else if(!shangxianri&&swt){
                //这个是非上线日能不能上线的开关。为swt=true则不能进行非上线日上线。
                VpAlertMsg({
                    message: "消息提示",
                    description: message,
                    type: "warning",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
                _this.resetFields(_this,'dsqsxsj','');
            }else if (!shangxianri && shifoujiaoyanzhu) {
                //这个是非上线日，但是当前系统时间和选中的申请上线时间差小于配置的时间差。所以也不能提上线流程。
                VpAlertMsg({
                    message: "消息提示",
                    description: "请于投产日" + txjg + "天前完成业务测试工作并将上线申请提交到信息技术部门。",
                    type: "warning",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
                _this.resetFields(_this,'dsqsxsj','');

            } else {
                console.log("选中日期", t2)
                console.log("当前日期", t1)
                console.log("选中日期", t3)
                if (t3 == "Invalid date") {
                    console.log("true")
                } else {
                    if (shangxianri) {
                        //这个是上线日
                        _this.props.form.setFieldsValue({
                            ssfzcsx: '1'
                        })

                        validationRequireField(_this, 'ifsxrtcyyfl', false, "请填写原因分类！")
                        validationRequireField(_this, 'sfsxrtcxxyy', false, "请填写详细原因！")
                    } else {
                        VpAlertMsg({
                            message: "消息提示",
                            description: "您所选择的日期非信息技术总部规定的标准上线日，如确定申请该日期上线，请填写原因！",
                            type: "warning",
                            onClose: this.onClose,
                            closeText: "关闭",
                            showIcon: true
                        }, 5);
                        _this.props.form.setFieldsValue({
                            ssfzcsx: '1'
                        })
                        validationRequireField(_this, 'ifsxrtcyyfl', true, "请填写原因分类！")
                        validationRequireField(_this, 'sfsxrtcxxyy', true, "请填写详细原因！")
                    }
                }
            }
        }
    }
    resetFields=(_this,name,value)=>{
        _this.props.form.setFieldsValue({[name]:value})
        _this.props.form.resetFields(name)
    }
}

sxsqForm = DynamicForm.createClass(sxsqForm);
export default sxsqForm;