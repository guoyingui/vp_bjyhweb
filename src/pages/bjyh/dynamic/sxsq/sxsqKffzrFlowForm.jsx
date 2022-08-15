import React, { Component } from "react";

import { findWidgetByName } from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg, VpConfirm } from "vpreact";
import { xmsxsq, fileValidation, common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";


//项目上线申请流程 开发负责人节点
class sxsqKffzrFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("sxsqKffzrFlowForm");
        console.log("date", this);
    }
    onGetFormDataSuccess(data) {
        let _this = this
        //    //是否直接到运营部 ssfzjdyyb 是否返回业务 isffhyw 是否与需求符合7 ixqfh7
        // let ssfzjdyyb = findWidgetByName.call(data.form,'ssfzjdyyb');
        // let isffhyw = findWidgetByName.call(data.form,'isffhyw');
        // let ixqfh7 = findWidgetByName.call(data.form,'ixqfh7');

        // let sfzjdyyb =ssfzjdyyb.field.widget.default_value
        // let sffhyw =isffhyw.field.widget.default_value
        // let xqfh7 =ixqfh7.field.widget.default_value

        // console.log("sfzjdyyb1111",sfzjdyyb)
        // console.log("sffhyw",sffhyw)
        // console.log("xqfh7",xqfh7)

        let handlers = data.handlers
        //默认屏蔽所有节点
        //业务直返运营项目 如果为空则默认0
        var ssfzjdyyb = findWidgetByName.call(data.form, 'ssfzjdyyb')
        //console.log("ssfzjdyyb",ssfzjdyyb.field.fieldProps.initialValue);
        //默认屏蔽两个节点
        let scondition = findWidgetByName.call(data.form, 'scondition')
        if (scondition) {
            scondition.field.widget.load_template.map(item => {
                // 开发负责人 判断是否直接到运营部
                // 0 --开发部领导   SYSF
                // 2 --运维部组长	SYSG
                // 3 -- 运维部领导	SYSH
                // 4 --项目经理审核  SYSE
                if (ssfzjdyyb.field.widget.default_value == 0) {
                    item.value == 'SYSE' ? item.hidden = true : null
                    //item.value=='SYSF'?item.hidden=true:null
                    item.value == 'SYSH' ? item.hidden = true : null
                    item.value == 'SYSG' ? item.hidden = true : null
                    item.value == 'SYSD' ? item.hidden = true : null
                    //  item.value=='SYSJ'?item.hidden=true:null
                    scondition.field.widget.default_value = 'SYSF'
                    data.scondition = 'SYSF'
                } else if (ssfzjdyyb.field.widget.default_value == 2) {
                    item.value == 'SYSE' ? item.hidden = true : null
                    item.value == 'SYSF' ? item.hidden = true : null
                    item.value == 'SYSH' ? item.hidden = true : null
                    //item.value=='SYSG'?item.hidden=true:null
                    item.value == 'SYSD' ? item.hidden = true : null
                    //  item.value=='SYSJ'?item.hidden=true:null
                    scondition.field.widget.default_value = 'SYSG'
                    data.scondition = 'SYSG'
                } else if (ssfzjdyyb.field.widget.default_value == 3) {
                    item.value == 'SYSE' ? item.hidden = true : null
                    item.value == 'SYSF' ? item.hidden = true : null
                    //item.value=='SYSH'?item.hidden=true:null
                    item.value == 'SYSG' ? item.hidden = true : null
                    item.value == 'SYSD' ? item.hidden = true : null
                    //  item.value=='SYSJ'?item.hidden=true:null
                    scondition.field.widget.default_value = 'SYSH'
                    data.scondition = 'SYSH'
                } else if (ssfzjdyyb.field.widget.default_value == 4) {
                    //item.value=='SYSE'?item.hidden=true:null
                    item.value == 'SYSF' ? item.hidden = true : null
                    item.value == 'SYSH' ? item.hidden = true : null
                    item.value == 'SYSG' ? item.hidden = true : null
                    item.value == 'SYSD' ? item.hidden = true : null
                    //  item.value=='SYSJ'?item.hidden=true:null
                    scondition.field.widget.default_value = 'SYSE'
                    data.scondition = 'SYSE'
                } else {
                    item.value == 'SYSE' ? item.hidden = true : null
                    item.value == 'SYSF' ? item.hidden = true : null
                    item.value == 'SYSH' ? item.hidden = true : null
                    item.value == 'SYSG' ? item.hidden = true : null
                    //item.value=='SYSD'?item.hidden=true:null
                    //  item.value=='SYSJ'?item.hidden=true:null
                    scondition.field.widget.default_value = 'SYSD'
                    data.scondition = 'SYSD'
                }
            })
        }

        console.log("data", data)
        console.log("data", data.handlers.length)
        console.log("iobjectid", _this.props.iobjectid)
        console.log("projectid", _this.props.iobjectid)
        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/ZKXmsxFrom/queryPojectCodeByUsers', {
                projectId: _this.props.iobjectid
            }).then((response) => {
                if (response.data.length > 0) {
                    let res = response.data
                    if (res[0] != null) {
                        // 自动获取该项目的运营代表
                        console.log("handlers", data.handlers)
                        for (var i = 0; i < data.handlers.length; i++) {
                            console.log(data.handlers[i].flag)
                            console.log(res[0])
                            if (data.handlers[i].flag == "SYSD") {
                                data.handlers[i].ids = res[0].iid + ""
                                data.handlers[i].names = res[0].sname
                            }
                        }
                    }

                    resolve(data)
                } else {
                    resolve(data)
                }
            })
        })
        return promise
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */
    onBeforeSave = (formData, btnName) => {
        let _this = this
        let sparam = JSON.parse(formData.sparam);
        let scondition = sparam.scondition
        //【是否完成压力测试】=是，则显示【压力测试报告附件】字段，且在提交时要求上传《压力测试报告》文档 0是 1否 
        //let isfwcylcs = _this.props.form.getFieldsValue(['isfwcylcs'])
        //流程步骤通用定制             
        if (btnName === 'ok') {
            singleInputFill(formData, btnName, 'skffzrclyj', true)
            //同意 (回退到提交申请步骤) 的话 则不需要判断附件效验 为否的话 才会效验
            if (scondition === "SYSJ") {
                sparam.sywzfyyxm = 3
            } else if (scondition === 'SYSZK') {
                const { SYSZK = 'SYSZK', handlers } = _this.state
                let stepkey = '';
                handlers.map(item => item.flag === 'SYSZK' && (stepkey = item.stepkey))
                return new Promise(resolve => {
                    if (sparam[stepkey] == SYSZK) {
                        sparam.sjumpflag01 = 'SYSZH'
                        formData.sparam = JSON.stringify(sparam)
                        VpConfirm({
                            title: '提示',
                            content: '是否将流程退回给所有系统负责人？',
                            onOk() { resolve(true) },
                            onCancel() { resolve(false) }
                        });
                    } else {
                        resolve(true)
                    }
                })
            } else {
                //校验 是否涉及App --1 是 2否
                let isfsjappsx = _this.props.form.getFieldsValue(['isfsjappsx'])
                //lcbzbm_kffzr(1||2)  此处两个验证 lcbzbm_kffzr1 021包含App校验的 lcbzbm_kffzr2 022不包含App校验
                //是否涉及App 为是
                if (isfsjappsx.isfsjappsx == "1") {//包含apk
                    return fileValidation(_this, btnName, xmsxsq.lcbm_sxsqlc, xmsxsq.lcbzbm_kffzr1)
                } if (isfsjappsx.isfsjappsx == "3") {//无apk
                    return fileValidation(_this, btnName, xmsxsq.lcbm_sxsqlc, xmsxsq.lcbzbm_kffzr3)
                } else {//不涉及app
                    return fileValidation(_this, btnName, xmsxsq.lcbm_sxsqlc, xmsxsq.lcbzbm_kffzr2)
                }
            }
        }
        formData.sparam = JSON.stringify(sparam)
    }
    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = (formData, handlers) => {

        let _this = this
        //是否通过1
        let iywyzsftg11 = formData.findWidgetByName('iywyzsftg');
        iywyzsftg11.field.props.label = "是否通过";
        //是否返回业务1
        let isffhyw11 = formData.findWidgetByName('isffhyw1');
        isffhyw11.field.props.label = "是否返回业务";
        //是否与需求符合6
        let ixqfh66 = formData.findWidgetByName('ixqfh6');
        ixqfh66.field.props.label = "是否与需求符合";

        //判断开发部领导
        var rkfbld = formData.findWidgetByName("rkfbld");
        console.log("rkfbld", rkfbld)
        console.log("idepartmentid", vp.cookie.getTkInfo('idepartmentid'))
        console.log("rkfbld", rkfbld)
        var sfzjdyyb = formData.findWidgetByName("ssfzjdyyb").field.fieldProps.initialValue
        console.log("sfzjdyyb", sfzjdyyb)
        var sfzjdyyb = formData.findWidgetByName("ssfzjdyyb").field.fieldProps.initialValue
        var sxmbh = formData.findWidgetByName("sxmbh").field.fieldProps.initialValue;
        console.log("sxmbh", sxmbh)

        var dsqsxsj = formData.findWidgetByName("dsqsxsj").field.fieldProps.initialValue;
        console.log("dsqsxsj", dsqsxsj);
        let sxsj = moment(dsqsxsj).format("YYYY-MM-DD")

        //隐藏开发部领导
        if (sfzjdyyb == 0) {
            rkfbld.field.hidden = true;
        } else {
            vpQuery('/{bjyh}/ZKXmsxFrom/queryKfbld', {
                dept: vp.cookie.getTkInfo('idepartmentid'), sxmbh: sxmbh, sxsj: sxsj
            }).then((response) => {
                console.log("开发部负责人（分配资源）", response)
                if (response.data.totalRows > 1) {
                    rkfbld.field.props.modalProps.ajaxurl = '/{bjyh}/ZKXmsxFrom/queryKfbld';
                    rkfbld.field.props.modalProps.condition = [vp.cookie.getTkInfo('idepartmentid'), sxmbh, sxsj];
                } else {
                    let res = response.data.resultList
                    console.log("res", res)
                    _this.props.form.setFieldsValue({
                        'rkfbld': res[0].iid,//id
                        'rkfbld_label': res[0].sname//显示的汉字
                    })
                }
            })
        }




        // //判断开发部
        // var rkfbld = formData.findWidgetByName("rkfbld");
        var rxmmc = formData.findWidgetByName("rxmmc");
        //有值可以用它隐藏
        // console.log("formData",formData)
        // this.displayProps(formData,rywbld,false);
        // formData.groups[rywbld.groupIndex].group_type = 4
        console.log("rkfbld", rkfbld.field.props.initialName)
        // if(rkfbld.field.props.initialName!=null){
        //     rkfbld.field.hidden = true;
        // }else{
        //     if(rkfbld!=null){
        //         // 如一致则【是否需求提出人】字段设置为1
        //         vpQuery('/{bjyh}/ZKXmsxFrom/queryNameByUsers',{ Sname:'开发部负责人（分配资源）'
        //         }).then((response) => {
        //             console.log("开发部负责人（分配资源）",response)
        //             if (response.data.length > 0) {
        //                 let res = response.data
        //                 let rkfbldfzr = ''
        //                 let ids = ''
        //                 for (let i = 0; i < res.length; i++) {
        //                     ids += res[i].iid + ','
        //                     rkfbldfzr += res[i].sname + ','
        //                 }
        //                 ids = ids.substring(0, ids.length - 1)
        //                 rkfbldfzr = rkfbldfzr.substring(0, rkfbldfzr.length - 1)
        //                 // 自动获取ka开发部领导负责人
        //                 _this.props.form.setFieldsValue({
        //                     'rkfbld':ids,//id
        //                     'rkfbld_label':rkfbldfzr//显示的汉字
        //                 })
        //                 rkfbld.field.hidden=true;
        //             }
        //         })
        //     }
        // }


        //监听是否完成压力测试 字段
        let isfwcylcs = formData.findWidgetByName('isfwcylcs')

        var rfj2 = formData.findWidgetByName("rfj2");

        //压力测试附件 默认隐藏
        rfj2.field.widget_type = ""
        isfwcylcs.field.fieldProps.onChange = function (v) {
            let value = v.target.value;
            console.log("value", value);
            console.log("formData", formData.groups[rfj2.groupIndex].fields);
            console.log("formData", formData.groups[rfj2.groupIndex].fields[4]);
            //0 是 1否
            if (value == 0) {
                rfj2.field.widget_type = "upload"
                // validationRequireField(_this,'rfj2', true)
                let findWidgetByName = _this.state.formData.findWidgetByName('rfj2');
                if (findWidgetByName) {
                    let rules = findWidgetByName.field.fieldProps.rules
                    // 是否存在必填校验规则
                    let requiredRule = null
                    if (rules) {
                        rules.forEach((item) => {
                            if (item && item.hasOwnProperty('required')) {
                                requiredRule = item
                            }
                        })
                    }
                    // 修改必填规则
                    if (requiredRule) {
                        requiredRule.required = true
                        requiredRule.message = "请填写《压力测试》附件！"
                    } else {
                        rules.push({ required: true, message: "请填写《压力测试》附件！" });
                    }
                }
            } else {
                rfj2.field.widget_type = ""
            }
        }



        //下一步处理意见

        ////0代表开发拒绝 1代表运营拒绝 4 代表 项目经理拒绝 
        var zjdyyb = formData.findWidgetByName("ssfzjdyyb");
        let yydbsp = formData.findWidgetByName('syydbspyj');
        let xmjlsp = formData.findWidgetByName('sxmjlshyj');
        let yyclyj = yydbsp.field.fieldProps.initialValue;
        let xmclyj = xmjlsp.field.fieldProps.initialValue;

        console.log("zjdyyb.field.fieldProps.initialValue:" + zjdyyb.field.fieldProps.initialValue);

        if (zjdyyb.field.fieldProps.initialValue == 1) {
            if (yyclyj == null || yyclyj == undefined || yyclyj == '') {
            } else {
                vpQuery('/{bjyh}/ZKsecondSave/searchJj', {
                    piid: _this.props.piid, name: 'SYSL', userid: vp.cookie.getTkInfo().userid, entityname: "WFENT_SXSQLC", dqskey: "SYSD"
                }).then(res => {
                    console.log(res);
                    if (res.flag) {
                        VpAlertMsg({
                            message: '运营代表审批处理意见',
                            description: '' + yyclyj,
                            closeText: '关闭',
                            type: 'info',
                            showIcon: true
                        }, 30);
                    }

                })
                //       VpAlertMsg({
                //           message:'运营代表审批处理意见',
                //           description:''+yyclyj, 
                //           closeText:'关闭',
                //           type:'info', 
                //           showIcon:true
                //       },30);
            }
        } else if (zjdyyb.field.fieldProps.initialValue == 4) {
            if (xmclyj == null || xmclyj == undefined || xmclyj == '') {
            } else {
                vpQuery('/{bjyh}/ZKsecondSave/searchJj', {
                    piid: _this.props.piid, name: 'SYSO', userid: vp.cookie.getTkInfo().userid, entityname: "WFENT_SXSQLC", dqskey: "SYSD"
                }).then(res => {
                    console.log(res);
                    if (res.flag) {
                        VpAlertMsg({
                            message: '项目经理审核处理意见',
                            description: '' + xmclyj,
                            closeText: '关闭',
                            type: 'info',
                            showIcon: true
                        }, 30);
                    }

                })
                //   VpAlertMsg({
                //       message:'项目经理审核处理意见',
                //       description:''+xmclyj, 
                //       closeText:'关闭',
                //       type:'info', 
                //       showIcon:true
                //   },30);
            }
        }

        //将handlers 中的ids另外存一份
        handlers.map(item => item.flag === 'SYSZK' && (_this.setState({ SYSZK: item.ids })))
        let ixqfh7 = formData.findWidgetByName('ixqfh7');
        ixqfh7.field.props.label = "是否与需求符合";


    }
    /**
     * 
     * @param {*} val 
     */
    getRadio = (yyd, xqfh, yw, scondition) => {
        console.log("Radio--val");
        let _this = this
        let eobj = { target: { value: '' } }

        if (yyd == "1" && xqfh == "1" && yw == 1) {
            console.log("val1");
            scondition.field.props.options_.map(item => {
                if (item.value == 'SYSD') {
                    item.hidden = false
                }
            })
            _this.props.form.setFieldsValue({ scondition: 'SYSD' })
            eobj.target.value = 'SYSD'
            _this.handleCondition(eobj)

        } else if (yyd == "4" && xqfh == "1" && yw == 1) {
            console.log("val2");
            scondition.field.props.options_.map(item => {
                if (item.value == 'SYSD') {
                    item.hidden = true
                } else if (item.value == 'SYSE') {
                    item.hidden = false
                }
            })
            _this.props.form.setFieldsValue({ scondition: 'SYSE' })
            eobj.target.value = 'SYSE'
            _this.handleCondition(eobj)
        } else if (yyd == "0" && xqfh == "1" && yw == 1) {
            console.log("val3");
            scondition.field.props.options_.map(item => {
                if (item.value == 'SYSD') {
                    item.hidden = true
                } else if (item.value == 'SYSF') {
                    item.hidden = false
                }
            })
            _this.props.form.setFieldsValue({ scondition: 'SYSF' })
            eobj.target.value = 'SYSF'
            _this.handleCondition(eobj)

        } else if (yyd == "2" && xqfh == "1" && yw == 1) {
            console.log("val4");
            scondition.field.props.options_.map(item => {
                if (item.value == 'SYSD') {
                    item.hidden = true
                } else if (item.value == 'SYSG') {
                    item.hidden = false
                }
            })
            _this.props.form.setFieldsValue({ scondition: 'SYSG' })
            eobj.target.value = 'SYSG'
            _this.handleCondition(eobj)

        } else if (yyd == "3" && xqfh == "1" && yw == 1) {
            console.log("val5");
            scondition.field.props.options_.map(item => {
                if (item.value == 'SYSD') {
                    item.hidden = true
                } else if (item.value == 'SYSH') {
                    item.hidden = false
                }
            })
            _this.props.form.setFieldsValue({ scondition: 'SYSH' })
            eobj.target.value = 'SYSH'
            _this.handleCondition(eobj)

        } else if (yw == "2") {
            console.log("val6");
            scondition.field.props.options_.map(item => {
                if (item.value == 'SYSJ') {
                    item.hidden = false
                }
            })
            _this.props.form.setFieldsValue({ scondition: 'SYSJ' })
            eobj.target.value = 'SYSJ'
            _this.handleCondition(eobj)

        }
    }

    /**
     * 获取当前登录人在该项目中的角色
     * @param fileNamees 附件名称文件集合
     * @param fjname 所校验的附件名称
     */
    getThisRole(fileNamees, fjname) {
        console.log("fileNamees", fileNamees)
        console.log("fjname", fjname)
        let _this = this
        const fileNames = fileNamees // 上传文件的集合
        console.log("filenames", fileNames)
        console.log("fileNames.length", fileNames.length)
        //判断集合内有没有附件
        if (fileNames.length > 0) {
            for (var i = 0; i < fileNames.length; i++) {
                let wjname = fileNames[i].name || fileNames[i].filename
                console.log("wjname", wjname)
                console.log(wjname.indexOf(fjname))
                if (wjname.indexOf(fjname) != -1) {
                    console.log(wjname.indexOf(fjname))
                    return true;
                }
            }
            if (fjname == "测试案例" || fjname == "测试报告" || fjname == "实施方案" || fjname == "代码规范检查文档" || fjname == "代码安全检查文档") {
                VpAlertMsg({
                    message: "消息提示",
                    description: "请提交前上传《测试案例》、《测试报告》、《实施方案》、《代码规范检查文档》、《代码安全检查文档》！",
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
            } else if (fjname == "移动应用安全检测报告" || fjname == "移动应用安全检测加固记录表") {
                VpAlertMsg({
                    message: "消息提示",
                    description: "请提交前上传《移动应用安全检测报告》、《移动应用安全检测加固记录表》！",
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
            } else {
                VpAlertMsg({
                    message: "消息提示",
                    description: "请提交前上传《" + fjname + "》！",
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
            }
            return false;
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: "请提交前上传《" + fjname + "》！",
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5);
            return false;
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
        let rkfbld = _this.state.formData.findWidgetByName('rkfbld');
        let flag = e.target.value == 'SYSJ' ? true : false
        if (scondition == "SYSJ") {
            validationRequireField(_this, 'skffzrclyj', flag)
            //隐藏开发部领导
            rkfbld.field.hidden = true
            rkfbld.field.fieldProps.rules[0].required = false
            this.setRequire(rkfbld, false, false);
            validationRequireField(_this, 'isfsjappsx', false, '必填项不能为空!');
        } else {
            validationRequireField(_this, 'skffzrclyj', false)
            rkfbld.field.hidden = false
            rkfbld.field.fieldProps.rules[0].required = true
            this.setRequire(rkfbld, true, false);
            validationRequireField(_this, 'isfsjappsx', true, '必填项不能为空!');
        }
        _this.props.form.validateFields(['rkfbld_label'], { force: true })
    }

    /**
     * @description: selectModel类字段必填切换
     * @param {obj, requiredFlag, disabledFlag} 
     * @return: 
     */
    setRequire = (obj, requiredFlag, disabledFlag) => {
        let _this = this;
        if (obj) {
            obj.field.fieldProps.rules[0].required = requiredFlag
            obj.field.fieldProps.rules = requiredFlag ? [{
                required: requiredFlag,
                message: "输入内容不能为空"
            }] : [{
                required: requiredFlag,
                message: ""
            }];
            obj.field.props.disabled = disabledFlag
            //if(!requiredFlag){
            let props = _this.props.form.getFieldProps(obj.field.field_name);
            if (props) {
                props['data-__meta'].hidden = !requiredFlag;
                props['data-__meta'].rules[0].required = requiredFlag
                props['data-__meta'].rules[0].message = requiredFlag ? '输入内容不能为空' : ''
            }
            //}
        }
    }
}

sxsqKffzrFlowForm = FlowForm.createClass(sxsqKffzrFlowForm);
export default sxsqKffzrFlowForm;