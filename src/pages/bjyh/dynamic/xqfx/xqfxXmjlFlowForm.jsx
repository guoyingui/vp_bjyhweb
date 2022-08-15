import React, { Component } from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { findWidgetByName, formDataToWidgetProps } from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, vpAdd, VpAlertMsg, VpMWarning } from "vpreact";
import { xmsxsq, fileValidation, initHiddenColumn_swxx } from '../code';
import { findFiledByName } from 'utils/utils';
import moment from "moment";

//项目 需求分析 流程 项目经理提交 审批节点
class xqfxXmjlFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
        //console.log("date", this);
    }

    onFormRenderSuccess(formData) {
        vpQuery('/{bjyh}/xzxt/shifouzfry', { loginname: vp.cookie.getTkInfo('username') }).then((response) => {
            if (response.flag == '1') {
                initHiddenColumn_swxx(formData);
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

    //数据加载前
    onGetFormDataSuccess = data => {
        let _this = this
        let ixgxqwd = findWidgetByName.call(data.form, 'ixgxqwd');
        let sfxq = ixgxqwd.field.widget.default_value
        let names = vp.cookie.getTkInfo("nickname");
        let scode = findWidgetByName.call(data.form, 'scode');
        let piid = _this.props.piid
        //附件可删除
        let rfj = findWidgetByName.call(data.form, 'rfj');
        if (rfj) {
            rfj.field.widget.load_template.map(element => {
                if (element) {
                    element.options.delete = true
                }
            })
        }

        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/xzxt/getwaibushuju', {
                scode: scode.field.widget.default_value
            }).then((response) => {
                console.log('datadatadatadata', data);
                // 自动获取该项目的项目经理和开发负责人
                for (var i = 0; i < data.handlers.length; i++) {
                    if (data.handlers[i].flag == "SYSC") {
                        data.handlers[i].ids = vp.cookie.getTkInfo('userid');
                        data.handlers[i].names = vp.cookie.getTkInfo('nickname');
                    } else if (data.handlers[i].flag == "SYSB") {
                        data.handlers[i].ids = response.iid;
                        data.handlers[i].names = response.sname;
                    } else if (data.handlers[i].flag == "SYSA") {
                        if (data.handlers[i].ids == null || data.handlers[i].ids == undefined || data.handlers[i].ids == '') {
                            if (response.isfsjsywbsj == '1') {
                                data.handlers[i].ids = '1417';
                                data.handlers[i].names = '韩爽';
                                let isjwbsh = findWidgetByName.call(data.form, 'isjwbsh');
                                isjwbsh.field.widget.default_value = '1';
                                let sdescription = findWidgetByName.call(data.form, 'sdescription');
                                sdescription.field.widget.default_value = response.swbsjsqid;
                            }
                            if(response.ids!=null && response.ids!=undefined){
                                if(data.handlers[i].ids != null &&  data.handlers[i].ids != undefined &&  data.handlers[i].ids != ''){
                                    data.handlers[i].ids =data.handlers[i].ids+"," +response.ids;
                                    data.handlers[i].names =data.handlers[i].names +response.names;
                                }else{
                                    data.handlers[i].ids =response.ids;
                                    data.handlers[i].names =response.names;

                                }

                            }
                        }
                    }
                }

                _this.props.form.setFieldsValue({
                    'isfsjjcsjcs': response.isfsjjcsjcs,
                    'isfsjsjjg': response.isfsjsjjg,
                    'isfsjjgbs': response.isfsjjgbs,
                    'isfsjsjzlzg': response.isfsjsjzlzg,
                })

                resolve(data)
            })
        })
        return promise;
    }

    //数据加载成功方法
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this
        let piid = _this.props.piid

        //是否修改需求文档
        let ixgxqwd = formData.findWidgetByName('ixgxqwd');
        console.log("ixgxqwd", ixgxqwd.field.fieldProps.initialValue);
        //判断核心系统4个值
        //设计数据加工 isjsjjg 设计数据标准 isjsjbz 涉及回单柜员核心 isjhdgyhx  涉及账务及交易 isjzwjy
        let isfsjsjjg = formData.findWidgetByName('isfsjsjjg');
        let isfsjjgbs = formData.findWidgetByName('isfsjjgbs');
        let isfsjjcsjcs = formData.findWidgetByName('isfsjjcsjcs');
        let isfsjsjzlzg = formData.findWidgetByName('isfsjsjzlzg');
        // if(isfsjsjjg==null&&isfsjjgbs==null&&isfsjjcsjcs==null&&isfsjsjzlzg==null){
        //     this.getUser(handlers, '6', '', true, formData)
        // }
        let isjsjjg = formData.findWidgetByName('isjsjjg');
        let isjsjbz = formData.findWidgetByName('isjsjbz');
        let isjhdgyhx = formData.findWidgetByName('isjhdgyhx');
        let isjzwjy = formData.findWidgetByName('isjzwjy');
        //是否涉及外部数据 isjwbsh
        let isjwbsh = formData.findWidgetByName('isjwbsh');
        let jg = isjsjjg.field.fieldProps.initialValue
        let bz = isjsjbz.field.fieldProps.initialValue
        let hx = isjhdgyhx.field.fieldProps.initialValue
        let jy = isjzwjy.field.fieldProps.initialValue
        let wb = isjwbsh.field.fieldProps.initialValue
        handlers.map(item => {
            console.log("item", item);
            if (item.flag == "SYSA") {
                if (item.ids == null || item.ids == undefined || item.ids == '') {
                    //console.log("没有处理人");
                } else {
                    console.log("item.ids",item.ids)
                    let userids=item.ids;
                    console.log("item.ids",userids.charAt(userids.length - 1))

                    if(userids.charAt(userids.length - 1)==","){
                        userids=userids.substring(0,userids.length-1)
                    }
                    console.log("userids",userids)

                    vpQuery('/{bjyh}/xqfx/deleteSYSD', {
                        iid: userids, piid: piid
                    }).then((response) => {
                        //console.log("response",response.data);
                        if (response.data.length > 0) {
                            let res = response.data
                            let xmjl_kffzr = ''
                            let ids = ''
                            for (let i = 0; i < res.length; i++) {
                                if (ids.indexOf(res[i].iid) == -1) {
                                    ids += res[i].iid + ','
                                    xmjl_kffzr += res[i].sname + ','
                                }
                            }
                            ids = ids.substring(0, ids.length - 1)
                            xmjl_kffzr = xmjl_kffzr.substring(0, xmjl_kffzr.length - 1)
                            console.log("ids", ids)
                            console.log("xmjl_kffzr", xmjl_kffzr)
                            // 自动获取该项目的项目经理和开发负责人
                            item.ids = ids
                            item.names = xmjl_kffzr
                            let stepkey = formData.findWidgetByName(item.stepkey)
                            //console.log('stepkey..',stepkey);
                            if (stepkey) {
                                // _this.props.form.setFieldsValue({
                                //     [item.stepkey]:ids,
                                //     [item.stepkey+"_lable"]:xmjl_kffzr
                                // })
                                let eobj = { target: { value: '' } }
                                if (ixgxqwd.field.fieldProps.initialValue == "1") {
                                    _this.props.form.setFieldsValue({ scondition: 'SYSB' })
                                    eobj.target.value = 'SYSB'
                                    _this.handleCondition(eobj)
                                } else {
                                    // if(jg=="2"&&bz=="2"&&hx=="2"&&jy=="2"){
                                    if (bz == "2" && hx == "2" && jy == "2" && wb == "2") {
                                        _this.props.form.setFieldsValue({ scondition: 'SYSC' })
                                        eobj.target.value = 'SYSC'
                                    } else {
                                        _this.props.form.setFieldsValue({ scondition: 'SYSA' })
                                        eobj.target.value = 'SYSA'
                                    }
                                    _this.handleCondition(eobj)
                                }

                            }
                        }
                    })
                }
            }
        })
        _this.props.form.setFieldsValue({
            sjlspqk: "0,0,0,0,0,0,0,0"
        })

        //默认屏蔽两个节点
        let scondition = formData.findWidgetByName('scondition')
        if (scondition) {
            scondition.field.props.options_.map(item => {
                if (ixgxqwd.field.fieldProps.initialValue == "1") {
                    //console.log("ixgxqwd","jinlia");
                    item.value == 'SYSA' ? item.hidden = true : null
                    // item.value=='SYSB'?item.hidden=true:null
                    item.value == 'SYSC' ? item.hidden = true : null
                } else {
                    // item.value=='SYSA'?item.hidden=true:null
                    if (jg == "2" && bz == "2" && hx == "2" && jy == "2") {
                        item.value == 'SYSA' ? item.hidden = true : null
                        item.value == 'SYSB' ? item.hidden = true : null
                        item.value == 'SYSC' ? item.hidden = false : null
                    } else {
                        item.value == 'SYSB' ? item.hidden = true : null
                        item.value == 'SYSC' ? item.hidden = true : null
                    }
                }
            })
        }
        //获取字段
        // 是否相关部门审核 sxgbmsh
        let sxgbmsh = formData.findWidgetByName('sxgbmsh')
        let isffhkf = formData.findWidgetByName('isffhkf')
        let fbxmyjtrje = formData.findWidgetByName('fbxmyjtrje')
        //console.log("fbxmyjtrje",fbxmyjtrje.field.fieldProps.initialValue)
        //console.log("fbxmyjtrje",fbxmyjtrje.fbxmyjtrje)
        if (fbxmyjtrje.field.fieldProps.initialValue == "null") {
            _this.props.form.setFieldsValue({
                fbxmyjtrje: "0"
            })
        }

        let iyspc = formData.findWidgetByName('iyspc')
        //console.log("iyspc",iyspc)
        //console.log("iyspc",iyspc.field.fieldProps.initialValue)
        var sysbh1 = formData.findWidgetByName("sysbh1");
        var sysbh2 = formData.findWidgetByName("sysbh2");
        var sysbh3 = formData.findWidgetByName("sysbh3");
        var sysbh4 = formData.findWidgetByName("sysbh4");
        var sysbh5 = formData.findWidgetByName("sysbh5");
        var sysmc1 = formData.findWidgetByName("sysmc1");
        var sysmc2 = formData.findWidgetByName("sysmc2");
        var sysmc3 = formData.findWidgetByName("sysmc3");
        var sysmc4 = formData.findWidgetByName("sysmc4");
        var sysmc5 = formData.findWidgetByName("sysmc5");
        if (iyspc.field.fieldProps.initialValue == 0) {
            sysbh1.field.hidden = true;
            sysbh2.field.hidden = true;
            sysbh3.field.hidden = true;
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc1.field.hidden = true;
            sysmc2.field.hidden = true;
            sysmc3.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        } else if (iyspc.field.fieldProps.initialValue == 1) {
            sysbh2.field.hidden = true;
            sysbh3.field.hidden = true;
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc2.field.hidden = true;
            sysmc3.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        } else if (iyspc.field.fieldProps.initialValue == 2) {
            sysbh3.field.hidden = true;
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc3.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        } else if (iyspc.field.fieldProps.initialValue == 3) {
            sysbh4.field.hidden = true;
            sysbh5.field.hidden = true;
            sysmc4.field.hidden = true;
            sysmc5.field.hidden = true;
        } else if (iyspc.field.fieldProps.initialValue == 4) {
            sysbh5.field.hidden = true;
            sysmc5.field.hidden = true;
        }
        _this.props.form.setFieldsValue({
            sxgbmsh: "1"
        })

        //是否需求文档 ixgxqwd 设计数据加工 isjsjjg 设计数据标准 isjsjbz 涉及回单柜员核心 isjhdgyhx  涉及账务及交易 isjzwjy
        //是否涉及外部数据  isjwbsh
        ixgxqwd.field.fieldProps.onChange = function (value) {
            //0否 1是
            //console.log("监听是否需求文档");
            console.log("value:", value.target.value);
            // "【是否修改需求文档】=否，则下一步流程步骤为“相关部门审核”环节 SYSA
            // 【是否修改需求文档】=是，则下一步流程步骤为“需求提出人修改需求文档”环节" SYSB

            let isjsjjg = _this.props.form.getFieldsValue(['isjsjjg']).isjsjjg;
            let isjsjbz = _this.props.form.getFieldsValue(['isjsjbz']).isjsjbz;
            let isjhdgyhx = _this.props.form.getFieldsValue(['isjhdgyhx']).isjhdgyhx;
            let isjzwjy = _this.props.form.getFieldsValue(['isjzwjy']).isjzwjy;
            let isjwbsh = _this.props.form.getFieldsValue(['isjwbsh']).isjsjjg;
            console.log("isjsjjg", isjsjjg)
            console.log("isjsjbz", isjsjbz)
            console.log("isjhdgyhx", isjhdgyhx)
            console.log("isjzwjy", isjzwjy)
            console.log("isjwbsh", isjwbsh)
            let val = value.target.value
            let eobj = { target: { value: '' } }
            switch (val * 1) {
                case 1:
                    scondition.field.props.options_.map(item => {
                        if (item.value == 'SYSA') {
                            item.hidden = true
                        } else if (item.value == 'SYSB') {
                            item.hidden = false
                        } else if (item.value == 'SYSC') {
                            item.hidden = true
                        }
                    })
                    _this.props.form.setFieldsValue({ scondition: 'SYSB' })
                    eobj.target.value = 'SYSB'
                    _this.handleCondition(eobj)
                    break
                case 0:

                    scondition.field.props.options_.map(item => {
                        if (isjsjbz == "2" && isjhdgyhx == "2" && isjzwjy == "2" && isjwbsh == "2") {
                            item.value == 'SYSA' ? item.hidden = true : null
                            item.value == 'SYSB' ? item.hidden = true : null
                            item.value == 'SYSC' ? item.hidden = false : null
                            _this.props.form.setFieldsValue({ scondition: 'SYSC' })
                            eobj.target.value = 'SYSC'
                            _this.handleCondition(eobj)
                        } else {
                            item.value == 'SYSA' ? item.hidden = false : null
                            item.value == 'SYSB' ? item.hidden = true : null
                            item.value == 'SYSC' ? item.hidden = true : null
                            _this.props.form.setFieldsValue({ scondition: 'SYSA' })
                            eobj.target.value = 'SYSA'
                            _this.handleCondition(eobj)
                        }
                    })
                    break
            }


        }
        isjsjjg.field.fieldProps.onChange = function (value) {
            //2否 1是
            //console.log("监听设计数据加工");
            if (value.target.value == 1) {
                let flag = _this.getUser(handlers, '1', value.target.value, true, formData)
                //console.log(flag);
            } else {
                let flag = _this.getUser(handlers, '1', value.target.value, false, formData)
                //console.log(flag);
            }

        }

        // let isjsjbz =formData.findWidgetByName('isjsjbz');
        isjsjbz.field.fieldProps.onChange = function (value) {
            //2否 1是
            //console.log("监听设计数据标准");
            //console.log("value:",value.target.value);
            if (value.target.value == 1) {
                let flag = _this.getUser(handlers, '2', value.target.value, true, formData)
                //console.log(flag);
            } else {
                let flag = _this.getUser(handlers, '2', value.target.value, false, formData)
                //console.log(flag);
            }

        }

        isjhdgyhx.field.fieldProps.onChange = function (value) {
            //2否 1是
            //console.log("监听涉及回单柜员核心");
            //console.log("value:",value.target.value);
            if (value.target.value == 1) {
                let flag = _this.getUser(handlers, '3', value.target.value, true, formData)
                //console.log(flag);
            } else {
                let flag = _this.getUser(handlers, '3', value.target.value, false, formData)
                //console.log(flag);
            }
        }

        // let isjzwjy =formData.findWidgetByName('isjzwjy');
        isjzwjy.field.fieldProps.onChange = function (value) {
            //2否 1是
            //console.log("监听涉及账务及交易");
            //console.log("value:",value.target.value);
            if (value.target.value == 1) {
                let flag = _this.getUser(handlers, '4', value.target.value, true, formData)
                //console.log(flag);
            } else {
                let flag = _this.getUser(handlers, '4', value.target.value, false, formData)
                //console.log(flag);
            }
        }

        isjwbsh.field.fieldProps.onChange = function (value) {
            //2否 1是
            //console.log("是否涉及外部数据");
            //console.log("value:",value.target.value);
            if (value.target.value == 1) {
                let flag = _this.getUser(handlers, '5', value.target.value, true, formData)
                //console.log(flag);
            } else {
                let flag = _this.getUser(handlers, '5', value.target.value, false, formData)
                //console.log(flag);
            }

        }
        //带出项目对应的需求提出人和开发负责人

        var scode = formData.findWidgetByName("scode");
        //console.log("scode",scode);
        vpQuery('/{bjyh}/xqfx/queryXqtcrByProjectId', {
            Scode: scode.field.fieldProps.initialValue, Sname: '需求提出人'
        }).then((response) => {
            //console.log("response.data",response);
            let res = response.data
            //console.log("res",res);
            let fzr = ''
            let ids = ''
            for (let i = 0; i < res.length; i++) {
                if (ids.indexOf(res[i].iuserid) == -1) {
                    ids += res[i].iuserid + ','
                    fzr += res[i].sname + ','
                }

            }
            ids = ids.substring(0, ids.length - 1)
            fzr = fzr.substring(0, fzr.length - 1)
            _this.props.form.setFieldsValue({
                sxqtcr: fzr
            })
        })
        vpQuery('/{bjyh}/xqfx/queryRoleBytcr', {
            RoleName: "开发负责人", Scode: scode.field.fieldProps.initialValue
        }).then((response) => {
            //console.log("response.data",response);
            let res = response.data
            let fzr = ''
            let ids = ''
            for (let i = 0; i < res.length; i++) {
                if (ids.indexOf(res[i].iuserid) == -1) {
                    ids += res[i].iuserid + ','
                    fzr += res[i].username + ','
                }
            }
            ids = ids.substring(0, ids.length - 1)
            fzr = fzr.substring(0, fzr.length - 1)
            _this.props.form.setFieldsValue({
                skffzr: fzr
            })
        })
    }
    /**
     * 填充处理人
     * @param handlers 处理人集合
     * @param response 返回的值
     */
    getUser(handlers, response, values, flag, formData) {
        let _this = this;
        //console.log("_this",_this)
        //console.log("handlers",handlers)
        //console.log("response",response)
        //4个值 2否 1是
        //console.log("values",values)
        //console.log("  ",)
        //console.log("  ",)
        //console.log("  ",)
        //设计数据加工 isjsjjg 设计数据标准 isjsjbz 涉及回单柜员核心 isjhdgyhx  涉及账务及交易 isjzwjy
        //是否涉及外部数据 isjwbsh
        let isjsjjg = _this.props.form.getFieldsValue(['isjsjjg']).isjsjjg;
        let isjsjbz = _this.props.form.getFieldsValue(['isjsjbz']).isjsjbz;
        let isjhdgyhx = _this.props.form.getFieldsValue(['isjhdgyhx']).isjhdgyhx;
        let isjzwjy = _this.props.form.getFieldsValue(['isjzwjy']).isjzwjy;
        let isjwbsh = _this.props.form.getFieldsValue(['isjwbsh']).isjwbsh;
        let isfsjjcsjcs = _this.props.form.getFieldsValue(['isfsjjcsjcs']).isfsjjcsjcs;
        let isfsjsjjg = _this.props.form.getFieldsValue(['isfsjsjjg']).isfsjsjjg;
        let isfsjjgbs = _this.props.form.getFieldsValue(['isfsjjgbs']).isfsjjgbs;
        let isfsjsjzlzg = _this.props.form.getFieldsValue(['isfsjsjzlzg']).isfsjsjzlzg;

        let isnotnull=false;
        if((isfsjsjjg==""||isfsjsjjg==null)&&(isfsjjgbs==""||isfsjjgbs==null)&&(isfsjjcsjcs==""||isfsjjcsjcs==null)&&(isfsjsjzlzg==""||isfsjsjzlzg==null)){
            console.log("新增4个选项全都为空")
            isnotnull=true;
            // this.getUser(handlers, '6', '', true, formData)
        }
        //console.log("isfsjsjjg"+isfsjsjjg)
        //console.log("isfsjjgbs"+isfsjjgbs)
        //console.log("isfsjjcsjcs"+isfsjjcsjcs)
        //console.log("isfsjsjzlzg"+isfsjsjzlzg)
        if (response == "1") {
            if (values != "3") {
                console.log("jinlai l ", values)
                isjsjjg = values;
            }
        } else if (response == "2") {
            isjsjbz = values;
        } else if (response == "3") {
            isjhdgyhx = values;
        } else if (response == "4") {
            isjzwjy = values;
        } else if (response == "5") {
            isjwbsh = values;
        }

        //console.log("isjsjjg",isjsjjg)
        //console.log("isjsjbz",isjsjbz)
        //console.log("isjhdgyhx",isjhdgyhx)
        //console.log("isjzwjy",isjzwjy)
        //是否修改需求文档
        let ixgxqwd = _this.props.form.getFieldsValue(['ixgxqwd']);
        //console.log("ixgxqwd",ixgxqwd.ixgxqwd)
        //默认屏蔽两个节点
        let scondition = formData.findWidgetByName('scondition')
        if (scondition) {
            scondition.field.props.options_.map(item => {
                // //console.log("ixgxqwd","jinlia");
                // if(isjsjjg=="2"&&isjsjbz=="2"&&isjhdgyhx=="2"&&isjzwjy=="2"){
                // if(isjsjbz=="2"&&isjhdgyhx=="2"&&isjzwjy=="2"){
                //增加判断新增的4个值属性判断 如果都是否 则默认走SYSC分支
                if(isjsjbz == "2"){
                    //如果“是否涉及数据标准”字段有值 则代表不存在新增的4个字段
                    isnotnull=false;
                    if (isjsjbz == "2"
                    && isjhdgyhx == "2"
                    && isjzwjy == "2"
                    && isjwbsh == "2"){
                       item.value == 'SYSA' ? item.hidden = true : null
                       item.value == 'SYSB' ? item.hidden = true : null
                       item.value == 'SYSC' ? item.hidden = false : null
                   } else {
                       if (ixgxqwd.ixgxqwd == "1") {
                           item.value == 'SYSA' ? item.hidden = true : null
                           item.value == 'SYSB' ? item.hidden = false : null
                           item.value == 'SYSC' ? item.hidden = true : null
                       } else {
                           item.value == 'SYSA' ? item.hidden = false : null
                           item.value == 'SYSB' ? item.hidden = true : null
                           item.value == 'SYSC' ? item.hidden = true : null
                       }
                   }
                }else{
                    if ((isjsjbz == "2"||isjsjbz==""||isjsjbz==null)
                    && isjhdgyhx == "2"
                    && isjzwjy == "2"
                    && isjwbsh == "2"
                    &&(isfsjsjjg=="2"||isfsjsjjg==undefined)
                    &&(isfsjjgbs=="2"||isfsjjgbs==undefined)
                    &&(isfsjjcsjcs=="2"||isfsjjcsjcs==undefined)
                    &&(isfsjsjzlzg=="2"||isfsjsjzlzg==undefined)){
                       item.value == 'SYSA' ? item.hidden = true : null
                       item.value == 'SYSB' ? item.hidden = true : null
                       item.value == 'SYSC' ? item.hidden = false : null
                   } else {
                       if (ixgxqwd.ixgxqwd == "1") {
                           item.value == 'SYSA' ? item.hidden = true : null
                           item.value == 'SYSB' ? item.hidden = false : null
                           item.value == 'SYSC' ? item.hidden = true : null
                       } else {
                           item.value == 'SYSA' ? item.hidden = false : null
                           item.value == 'SYSB' ? item.hidden = true : null
                           item.value == 'SYSC' ? item.hidden = true : null
                       }
                   }
                }
            })
        }
        handlers.map(item => {
            let eobj = { target: { value: '' } }
            // if(isjsjjg=="2"&&isjsjbz=="2"&&isjhdgyhx=="2"&&isjzwjy=="2"){
            // if(isjsjbz=="2"&&isjhdgyhx=="2"&&isjzwjy=="2"){
                 //增加判断新增的4个值属性判断 如果都是否 则默认走SYSC分支
                if(isjsjbz == "2"){
                     //如果“是否涉及数据标准”字段有值 则代表不存在新增的4个字段
                     isnotnull=false;
                        if (isjsjbz == "2"
                            && isjhdgyhx == "2"
                            && isjzwjy == "2"
                            && isjwbsh == "2"){
                        // console.log("item",item);
                        if (ixgxqwd.ixgxqwd == "1") {
                            _this.props.form.setFieldsValue({ scondition: 'SYSB' })
                            eobj.target.value = 'SYSB'
                        } else {
                            _this.props.form.setFieldsValue({ scondition: 'SYSC' })
                            eobj.target.value = 'SYSC'
                        }
                        _this.handleCondition(eobj)
                    } else {
                        if (ixgxqwd.ixgxqwd == "1") {
                            _this.props.form.setFieldsValue({ scondition: 'SYSB' })
                            eobj.target.value = 'SYSB'
                        } else {
                            _this.props.form.setFieldsValue({ scondition: 'SYSA' })
                            eobj.target.value = 'SYSA'
                        }
                        _this.handleCondition(eobj)
                    }
                }else{
                        if ((isjsjbz == "2"||isjsjbz==""||isjsjbz==null)
                            && isjhdgyhx == "2"
                            && isjzwjy == "2"
                            && isjwbsh == "2"
                            &&(isfsjsjjg=="2"||isfsjsjjg==undefined)
                            &&(isfsjjgbs=="2"||isfsjjgbs==undefined)
                            &&(isfsjjcsjcs=="2"||isfsjjcsjcs==undefined)
                            &&(isfsjsjzlzg=="2"||isfsjsjzlzg==undefined)){
                        // console.log("item",item);
                        if (ixgxqwd.ixgxqwd == "1") {
                            _this.props.form.setFieldsValue({ scondition: 'SYSB' })
                            eobj.target.value = 'SYSB'
                        } else {
                            _this.props.form.setFieldsValue({ scondition: 'SYSC' })
                            eobj.target.value = 'SYSC'
                        }
                        _this.handleCondition(eobj)
                    } else {
                        if (ixgxqwd.ixgxqwd == "1") {
                            _this.props.form.setFieldsValue({ scondition: 'SYSB' })
                            eobj.target.value = 'SYSB'
                        } else {
                            _this.props.form.setFieldsValue({ scondition: 'SYSA' })
                            eobj.target.value = 'SYSA'
                        }
                        _this.handleCondition(eobj)
                    }
                }
                
        })

        let name = "";
        if (response == 1) {
            name = "'数据管理中心'"
        } else if (response == 2) {
            name = "'数据治理办公室'"
        } else if (response == 3) {
            name = "'运营管理部'"
        } else if (response == 4) {
            name = "'对公摘要\',\'个人摘要\',\'核心系统'"
        } else if (response == 5) {
            name = "'科技管理'"
        }else if (response == 6) {
            name = "'四个值都是空'"
        }
        if (!flag) {
            if (response == 1) {
                _this.props.form.setFieldsValue({ isjsjjg: "2" });
                //console.log("isjsjjg1",isjsjjg.isjsjjg)
                isjsjjg = _this.props.form.getFieldsValue(['isjsjjg']);
                //console.log("isjsjjg2",isjsjjg.isjsjjg)
            } else if (response == 2) {
                _this.props.form.setFieldsValue({ isjsjbz: "2" });
            } else if (response == 3) {
                _this.props.form.setFieldsValue({ isjhdgyhx: "2" });
            } else if (response == 4) {
                _this.props.form.setFieldsValue({ isjzwjy: "2" });
            } else if (response == 5) {
                _this.props.form.setFieldsValue({ isjwbsh: "2" });
            }
            name = "'null'";
        }
        //console.log("name",name);
        if (response == 1) {
            if (isjsjbz == 1) {
                name = name + ",'数据治理办公室'"
            }
            if (isjhdgyhx == 1) {
                name = name + ",'运营管理部'"
            }
            if (isjzwjy == 1) {
                name = name + ",'对公摘要\',\'个人摘要\',\'核心系统'"
            }
            if (isjwbsh == 1) {
                name = name + ",'科技管理'"
            }
            if (isfsjjcsjcs == 1) {
                name = name + ",'基础数据产生'"
            }
            if (isfsjsjjg == 1) {
                name = name + ",'数据加工'"
            }
            if (isfsjjgbs == 1) {
                name = name + ",'监管报送'"
            }
            if (isfsjsjzlzg == 1) {
                name = name + ",'数据质量整改'"
            }
        } else if (response == 2) {
            if (isjsjjg == 1) {
                name = name + ",'数据管理中心'"
            }
            if (isjhdgyhx == 1) {
                name = name + ",'运营管理部'"
            }
            if (isjzwjy == 1) {
                name = name + ",'对公摘要\',\'个人摘要\',\'核心系统'"
            }
            if (isjwbsh == 1) {
                name = name + ",'科技管理'"
            }
            if (isfsjjcsjcs == 1) {
                name = name + ",'基础数据产生'"
            }
            if (isfsjsjjg == 1) {
                name = name + ",'数据加工'"
            }
            if (isfsjjgbs == 1) {
                name = name + ",'监管报送'"
            }
            if (isfsjsjzlzg == 1) {
                name = name + ",'数据质量整改'"
            }
        } else if (response == 3) {
            if (isjsjjg == 1) {
                name = name + ",'数据管理中心'"
            }
            if (isjsjbz == 1) {
                name = name + ",'数据治理办公室'"
            }
            if (isjzwjy == 1) {
                name = name + ",'对公摘要\',\'个人摘要\',\'核心系统'"
            }
            if (isjwbsh == 1) {
                name = name + ",'科技管理'"
            }
            if (isfsjjcsjcs == 1) {
                name = name + ",'基础数据产生'"
            }
            if (isfsjsjjg == 1) {
                name = name + ",'数据加工'"
            }
            if (isfsjjgbs == 1) {
                name = name + ",'监管报送'"
            }
            if (isfsjsjzlzg == 1) {
                name = name + ",'数据质量整改'"
            }
        } else if (response == 4) {
            if (isjsjjg == 1) {
                name = name + ",'数据管理中心'"
            }
            if (isjsjbz == 1) {
                name = name + ",'数据治理办公室'"
            }
            if (isjhdgyhx == 1) {
                name = name + ",'运营管理部'"
            }
            if (isjwbsh == 1) {
                name = name + ",'科技管理'"
            }
            if (isfsjjcsjcs == 1) {
                name = name + ",'基础数据产生'"
            }
            if (isfsjsjjg == 1) {
                name = name + ",'数据加工'"
            }
            if (isfsjjgbs == 1) {
                name = name + ",'监管报送'"
            }
            if (isfsjsjzlzg == 1) {
                name = name + ",'数据质量整改'"
            }
        } else if (response == 5) {
            if (isjsjjg == 1) {
                name = name + ",'数据管理中心'"
            }
            if (isjsjbz == 1) {
                name = name + ",'数据治理办公室'"
            }
            if (isjhdgyhx == 1) {
                name = name + ",'运营管理部'"
            }
            if (isjzwjy == 1) {
                name = name + ",'对公摘要\',\'个人摘要\',\'核心系统'"
            }
            if (isfsjjcsjcs == 1) {
                name = name + ",'基础数据产生'"
            }
            if (isfsjsjjg == 1) {
                name = name + ",'数据加工'"
            }
            if (isfsjjgbs == 1) {
                name = name + ",'监管报送'"
            }
            if (isfsjsjzlzg == 1) {
                name = name + ",'数据质量整改'"
            }
        }
        
        console.log("isnotnull",isnotnull);
        console.log("name1",name);
        if(isnotnull){
            name = name + ",'四个值都是空'"
        }
        console.log("name",name);
        if (!flag) {
            //console.log("name",name.length);
            //console.log("name",name.split(1,name.length));
        }
        vpQuery('/{bjyh}/xqfx/querySjzd', {
            Sname: name, piid: _this.props.piid
        }).then((response) => {

            //console.log("对公摘要','个人摘要','法律合规部','核心系统", response)
            if (response.data.length > 0) {
                let res = response.data
                let fzr = ''
                let ids = ''
                for (let i = 0; i < res.length; i++) {
                    ids += res[i].iid + ','
                    fzr += res[i].sname + ','
                }

                ids = ids.substring(0, ids.length - 1)
                fzr = fzr.substring(0, fzr.length - 1)
                //console.log("fzr",fzr);
                for (var i = 0; i < handlers.length; i++) {
                    //console.log( handlers[i].flag)
                    if (handlers[i].flag == "SYSA") {
                        //console.log("stepkey:",handlers[i].stepkey);
                        let id = handlers[i].stepkey;
                        let label = handlers[i].stepkey + "_label";
                        //console.log("id:",id);
                        //console.log("label:",label);
                        handlers[i].ids = ids;
                        handlers[i].names = fzr;
                        console.log("res[0].stepkey", res[0].stepkey);
                        _this.refs[res[0].stepkey + '_Modal'].setState({
                            name: fzr,
                            value: ids,
                        })
                        _this.props.form.setFieldsValue({
                            [id]: ids,//id
                            [label]: fzr
                        })
                    }
                }
                //把查到的人 添加state中
                this.setState({
                    handlers: handlers
                })
                //console.log( "handlers",handlers)
            } else {
                for (var i = 0; i < handlers.length; i++) {
                    //console.log( handlers[i].flag)
                    if (handlers[i].flag == "SYSA") {
                        //console.log("stepkey:",handlers[i].stepkey);
                        let id = handlers[i].stepkey;
                        let label = handlers[i].stepkey + "_label";
                        _this.props.form.setFieldsValue({
                            [id]: "",//id
                            [label]: ""
                        })
                    }
                }
            }
        })
        return true;
    }
}

xqfxXmjlFlowForm = FlowForm.createClass(xqfxXmjlFlowForm);
export default xqfxXmjlFlowForm;