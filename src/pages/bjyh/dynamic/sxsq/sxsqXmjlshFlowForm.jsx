import React, { Component } from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { findWidgetByName } from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg, VpConfirm, VpAlert, VpMsgLoading } from "vpreact";
import { xmsxsq, fileValidation, validationRequireField, singleInputFill } from '../code';
import moment from "moment";

//项目上线申请流程 项目经理审核上线 审批节点
class sxsqXmjlshFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
    }
    onGetFormDataSuccess = data => {
        let _this = this
        // console.log("data", data)
        // console.log("data", data.handlers.length)
        // console.log("iobjectid", _this.props.iobjectid)
        let rywbld = findWidgetByName.call(data.form, 'rywbld')
        console.log("rywbld", rywbld)
        console.log("rywbld", rywbld.field.widget.default_label)
        if (rywbld.field.widget.default_label == undefined) {
            //流程用户组增加过滤条件(部门)
            let dptid = vp.cookie.getTkInfo('idepartmentid')//部门
            data.handlers.map(item => {
                if (item.flag === 'SYSN') {//业务部领导审批
                    item.searchCondition = [{
                        field_name: 'idepartmentid',
                        field_value: dptid,
                        flag: '3'
                    }]
                    item.ajaxurl = '/{bjyh}/xzxt/getUser';
                }
            })
        } else {
            //"预设处理人：业务部领导审批：默认<提交上线申请>环节预设业务部领导"
            for (var i = 0; i < data.handlers.length; i++) {
                console.log(data.handlers[i].flag)
                if (data.handlers[i].flag == "SYSN") {
                    data.handlers[i].ids = rywbld.field.widget.default_value + ""
                    data.handlers[i].names = rywbld.field.widget.default_label + ""
                }
            }
        }
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onBeforeSave(formData, btnName) {
        let _this = this
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'sxmjlshyj', true)
        }
    }

    /**
     * 表单数据加载成功后
     * @param formDat
     */
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this
        let dsqsxsj = formData.findWidgetByName('dsqsxsj');
        console.log("dsqsxsj", dsqsxsj.field.fieldProps.initialValue);
        let t1 = moment().format('YYYYMMDD');
        let t2 = moment(dsqsxsj.field.fieldProps.initialValue).format("YYYYMMDD")
        if (moment(t2).isBefore(t1)) {
            console.log("当前日期", t1)
            console.log("选中日期", t2)
            VpAlertMsg({
                message: "消息提示",
                description: "申请上线日期不能早于当前日期！",
                type: "warning",
                closeText: "关闭",
                showIcon: true
            }, 5);
        }

        // 附件增加删除功能
        let rfj = formData.findWidgetByName('rfj');
        let arrfile = rfj.field.props.widget.load_template;
        arrfile.map(item => {
            item.options.delete = true;
        })

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
        console.log("handlers", handlers)

        //默认屏蔽两个节点
        let scondition = formData.findWidgetByName('scondition')
        if (scondition) {
            scondition.field.props.options_.map(item => {
                // item.value=='SYSP'?item.hidden=true:null    //提交上线
                item.value == 'SYSO' ? item.hidden = true : null //开发
            })
        }
        //获取字段
        // 是否与需求符合6 ixqfh6    是否返回开发 isffhkf
        //是否返回业务1 isffhyw1  是否直接到运营部 ssfzjdyyb 是否直接到业务部领导 ssfzjdywbld  业务直返运营项目 sywzfyyxm 是否直接到业务部领导
        let ixqfh = formData.findWidgetByName('ixqfh6')
        let isffhkf = formData.findWidgetByName('isffhkf')
        let isffhyw1 = formData.findWidgetByName('isffhyw1')

        //是否与需求符合6 ixqfh6    是否返回开发 isffhkf 默认为0
        _this.props.form.setFieldsValue({
            isffhkf: "0",
            isffhyw1: "1"
        })

        //监听是否与需求符合6
        ixqfh.field.fieldProps.onChange = function (v) {
            console.log("TEST 监听！" + ixqfh);
            console.log("ixqfh", ixqfh);
            ixqfh.field.checked = true;
            let value = v.target.value;
            console.log("value", value);
            let eobj = { target: { value: '' } }
            //1 是 2否
            //【是否与需求符合6】=否，则【是否返回业务】只读，且值为是；【是否返回开发】只读，且值为否
            if (value == 1) {
                //返回业务代表 拒绝意见必填 
                validationRequireField(_this, 'sxmjlshyj', false);
                //是否返回开发只读
                isffhkf.field.props.disabled = false;
                isffhyw1.field.props.disabled = false;
                // _this.props.form.setFieldsValue({
                //     isffhkf: "0",//1 是 0否
                //     isffhyw1: "1"//1否 2是
                // })
                _this.props.form.setFieldsValue({ scondition: 'SYSN' })
                eobj.target.value = 'SYSN'
                _this.handleCondition(eobj)
            } else {
                //返回业务代表 拒绝意见必填 
                validationRequireField(_this, 'sxmjlshyj', true);
                //【是否返回业务】只读
                isffhkf.field.props.disabled = true;
                //【是否返回业务】只读
                isffhyw1.field.props.disabled = true;
                _this.props.form.setFieldsValue({
                    isffhkf: "0", //1 是 0否
                    isffhyw1: "2" //1否 2是
                })
                // scondition.field.props.options_.map(item=>{
                //     if(item.value=='SYSP'){
                //         item.hidden=false
                //     }else{
                //         item.hidden=true
                //     }
                // })
                _this.props.form.setFieldsValue({ scondition: 'SYSP' })
                eobj.target.value = 'SYSP'
                _this.handleCondition(eobj)
            }
        }

        var ssfzjdyyb = formData.findWidgetByName("ssfzjdyyb");
        let sfzjdyyb = ssfzjdyyb.field.fieldProps.initialValue;
        console.log("ssfzjdyyb", sfzjdyyb);

        var sywzfyyxm = formData.findWidgetByName("sywzfyyxm");
        let ywzfyyxm = sywzfyyxm.field.fieldProps.initialValue;
        console.log("ywzfyyxm", ywzfyyxm);

        var ssfzjdywbld = formData.findWidgetByName("ssfzjdywbld");
        let sfzjdywbld = ssfzjdywbld.field.fieldProps.initialValue;
        console.log("sfzjdywbld", sfzjdywbld);

        //监听是否返回开发
        isffhkf.field.fieldProps.onChange = function (v) {
            console.log("TEST 监听！" + isffhkf);
            console.log("isffhkf", isffhkf);
            ixqfh.field.checked = true;
            let value = v.target.value;
            console.log("value", value);
            let eobj = { target: { value: '' } }
            // 【是否返回开发】默认选择否
            // 【是否返回开发】=是，则步骤结果为“拒绝”，【是否返回业务】只读，且值为否，并设置【是否直接到运营部】=4，【是否直接到业务部领导】=1"
            //1 是 0否
            if (value == 1) {
                //返回业务代表 拒绝意见必填 
                validationRequireField(_this, 'sxmjlshyj', true);
                //是否返回业务】只读，且值为否
                isffhyw1.field.props.disabled = true;
                _this.props.form.setFieldsValue({
                    isffhyw1: "1",//1否 2是
                    ssfzjdyyb: "4",
                    ssfzjdywbld: "1"
                })
                scondition.field.props.options_.map(item => {
                    if (item.value == 'SYSN') {
                        // item.hidden=true
                    } else if (item.value == 'SYSO') {
                        item.hidden = false
                    } else if (item.value == 'SYSP') {
                        item.hidden = true
                    }
                })
                _this.props.form.setFieldsValue({ scondition: 'SYSO' })
                eobj.target.value = 'SYSO'
                _this.handleCondition(eobj)
            } else {
                //返回业务代表 拒绝意见必填 
                validationRequireField(_this, 'sxmjlshyj', false);
                //是否返回业务】只读，且值为否
                isffhyw1.field.props.disabled = false;
                _this.props.form.setFieldsValue({
                    ssfzjdyyb: sfzjdyyb,
                    ssfzjdywbld: sfzjdywbld
                })
                scondition.field.props.options_.map(item => {
                    if (item.value == 'SYSN') {
                        // item.hidden=true
                    } else if (item.value == 'SYSO') {
                        item.hidden = true
                    } else if (item.value == 'SYSP') {
                        item.hidden = false
                    }
                })
                _this.props.form.setFieldsValue({ scondition: 'SYSN' })
                eobj.target.value = 'SYSN'
                _this.handleCondition(eobj)
            }
        }

        //监听是否返回业务
        isffhyw1.field.fieldProps.onChange = function (v) {
            console.log("TEST 监听！" + isffhkf);
            console.log("isffhkf", isffhkf);
            ixqfh.field.checked = true;
            let value = v.target.value;
            console.log("value", value);
            let eobj = { target: { value: '' } }
            // "【是否返回业务1】默认选择否
            // 【是否返回业务1】=是，则步骤结果为“拒绝”，【是否返回开发】只读，且值为否，并设置【是否直接到运营部】=4，【业务直返运营项目】=2，【是否直接到业务部领导】=1"
            //1否 2是
            if (value == 2) {
                //返回业务代表 拒绝意见必填 
                validationRequireField(_this, 'sxmjlshyj', true);
                //是否返回开发】只读，且值为否
                isffhkf.field.props.disabled = true;
                _this.props.form.setFieldsValue({
                    isffhkf: "0", //1 是 0否
                    ssfzjdyyb: "4",
                    ssfzjdywbld: "1",
                    sywzfyyxm: "2"
                })
                //    scondition.field.props.options_.map(item=>{
                //         if(item.value=='SYSN'){
                //             item.hidden=true
                //         }else if(item.value=='SYSP'){
                //             item.hidden=false
                //         }
                //     })
                _this.props.form.setFieldsValue({ scondition: 'SYSP' })
                eobj.target.value = 'SYSP'
                _this.handleCondition(eobj)
            } else {
                //返回业务代表 拒绝意见必填 
                validationRequireField(_this, 'sxmjlshyj', false);
                //是否返回业务】只读，且值为否
                isffhkf.field.props.disabled = false;
                _this.props.form.setFieldsValue({
                    ssfzjdyyb: sfzjdyyb,
                    ssfzjdywbld: sfzjdywbld,
                    sywzfyyxm: ywzfyyxm
                })
                //    scondition.field.props.options_.map(item=>{
                //             if(item.value=='SYSP'){
                //                 item.hidden=true
                //             }else if(item.value=='SYSN'){
                //                 item.hidden=false
                //             }
                //         })
                _this.props.form.setFieldsValue({ scondition: 'SYSN' })
                eobj.target.value = 'SYSN'
                _this.handleCondition(eobj)
            }
        }
    }

    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value
        console.log("scondition", scondition)
        console.log("_this", _this)
        // if(scondition=="SYSM"){
        //     //隐藏运维部组长领导
        //     let rywbzz = _this.props.form.getFieldValue('rywbzz_label')
        //     console.log("rkfbld",rywbzz)
        //     rywbzz.display =none;
        // }
    }

    /**
     * 表单数据渲染后
     */
    onFormRenderSuccess(formData) {
        vpQuery('/{bjyh}/xzxt/shifouzfry', { loginname: vp.cookie.getTkInfo('username') }).then((response) => {
            if (response.flag == '1') {
                document.getElementById('hetongbut').style.display = 'none';
                document.getElementById('dingdanbut').style.display = 'none';
                const buttons = this.state.newButtons;
                buttons.map(item => {
                    if (item.name === 'ok') {
                        item.className = 'hidden'
                    }
                })
                this.setState({ newButtons: buttons })
            }
        })
        /**
         * 项目管理系统（六期）项目 53.增加一个投产与立项过近的提醒
         * 上线流程中的申请上线时间和项目的立项时间进行校验，如超过规定间隔时间则系统提醒：项目实施周期过短，请记录项目情况。间隔时间按自然日计算。
         * 以上提醒在上线流程的项目经理审核节点进行提醒，点击处理进入流程页面时进行提醒，不做其他处理。
         * 申请上线时间和立项时间的间隔时间需在数据字典中可配置。
         */
        vpPostAjax(
            '/{bjyh}/xmsq/getXmJlTxFlag'
            , {
                xmId: formData.findWidgetByName("rxmmc").field.fieldProps.initialValue,
                sqSxSj: formData.findWidgetByName("dsqsxsj").field.fieldProps.initialValue
            }
            , 'GET'
            , function (data) {
                if (data.flag) {
                    VpConfirm({
                        title: '提示',
                        content: '项目实施周期过短，请记录项目情况！',
                        cancelText: '关闭',
                        onOk() {
                        },
                        onCancel() {
                        }
                    })
                    //VpMsgLoading('项目实施周期过短，请记录项目情况！', 0, true);
                }
            }
        );
    }

    onBeforeSave(formData, btnName) {
        let sparam = JSON.parse(formData.sparam);
        if (sparam.isffhkf && sparam.isffhkf == '1') {
            sparam.scondition = 'SYSO'
        } else if (sparam.isffhyw1 && sparam.isffhyw1 == '2') {
            sparam.scondition = 'SYSP'
        } else {
            sparam.scondition = 'SYSN'
        }
        // _this.props.form.setFieldsValue({
        //     isffhkf: "0",//1 是 0否
        //     isffhyw1: "1"//1否 2是
        // })
        formData.sparam = JSON.stringify(sparam);
        console.log('formData.sparam', formData.sparam)
    }
}

sxsqXmjlshFlowForm = FlowForm.createClass(sxsqXmjlshFlowForm);
export default sxsqXmjlshFlowForm;