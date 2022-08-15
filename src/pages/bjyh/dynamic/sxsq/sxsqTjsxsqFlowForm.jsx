import React, { Component } from "react";

import {findWidgetByName} from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation,common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import HomePageExt from '../index/homePageExt'

//项目上线申请流程1
class sxsqTjsxsqFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        super.componentWillMount();
        if(this.props.staskid && !this.props.isHistory) {
            const homePageExt = new HomePageExt();
            homePageExt.notice_sxsq();
        }
    }
    onGetFormDataSuccess(data) {
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
        let _this = this
        let handlers = data.handlers
        var sywzfyyxm = findWidgetByName.call(data.form,'sywzfyyxm')
        //默认屏蔽两个节点
        let scondition = findWidgetByName.call(data.form,'scondition')
        if(scondition){
            scondition.field.widget.load_template.map(item=>{
                    if(sywzfyyxm.field.widget.default_value==1){
                        if(item.value !== 'SYSB'){
                            item.hidden=true
                        }
                        scondition.field.widget.default_value='SYSB'
                        data.scondition = 'SYSB'
                    }else if(sywzfyyxm.field.widget.default_value==2){
                        if(item.value !== 'SYSC'){
                            item.hidden=true
                        }
                        scondition.field.widget.default_value='SYSC'
                        data.scondition = 'SYSC'
                    }else if(sywzfyyxm.field.widget.default_value == 3){
                        if(item.value !== 'SYSZZ'){
                            item.hidden = true
                        }
                        scondition.field.widget.default_value = 'SYSZZ'
                        data.scondition = 'SYSZZ'
                    }else{
                        if(item.value !== 'SYSA'){
                            item.hidden=true
                        }
                        scondition.field.widget.default_value='SYSA'
                        data.scondition = 'SYSA'
                    }
                        
            })
        }
        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/xmqx/queryDesignatedRoleByProjectId', {
                tableName: "BOBJ_PRODUCTION_APPLY_EXT", projectid: _this.props.iobjectid
            }).then((response) => {
                if (response.data.length > 0) {
                    let res = response.data
                    let xmjl_kffzr = ''
                    let ids = ''
                    for (let i = 0; i < res.length; i++) {
                        console.log("res[i].rolename", res[i].rolename)
                        if (res[i].rolename == "开发负责人") {
                            ids += res[i].iuserid + ','
                            xmjl_kffzr += res[i].username + ','
                        }
                    }
                    ids = ids.substring(0, ids.length - 1)
                    xmjl_kffzr = xmjl_kffzr.substring(0, xmjl_kffzr.length - 1)
                    // 自动获取该项目的项目经理和开发负责人
                    for (var i = 0; i < data.handlers.length; i++) {
                        console.log(data.handlers[i].flag)
                        if (data.handlers[i].flag == "SYSA") {
                            data.handlers[i].ids = ids
                            data.handlers[i].names = xmjl_kffzr
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
        return this.getThisStepCount().then(res=>{
            if(!res){
                //这是在这步骤第一次提交，进行校验上线日规则。
                return this.getValidationFlag()
            }else{
                //这个是不是第一次提交，就不校验上线日规则，直接返回true。进行下一步校验
                return new Promise(res=>{res(true)})
            }
        }).then(res=>{
            if(res){
                //这个是第一次提交上线日校验通过，或者不是第一次提交。然后进行校验附件是否上传完整。
                return fileValidation(this, btnName, xmsxsq.lcbm_sxsqlc, xmsxsq.lcbzbm_tjsxsq)
            }else{
                //如果第一次提交时，校验上线日规则不通过。则直接拒绝提交。进行提示。不得不说，这块的写的真完美。偷偷告诉你，是张峰写的。记得膜拜他。
                return new Promise(res=>{res(false)})
            }
        })
        // console.log("formData",this.props.form.getFieldValue('dsqsxsj'))
        // let _this = this
        // return fileValidation(_this, btnName, xmsxsq.lcbm_sxsqlc, xmsxsq.lcbzbm_tjsxsq)
    }
    /**
     * 上线日校验规则。
     * @returns 
     */
    getValidationFlag=()=>{
        let dsqsxsjVal=this.props.form.getFieldValue('dsqsxsj');
        let t1 = moment().format('YYYYMMDD');
        let t2 = moment(dsqsxsjVal).format("YYYYMMDD")
        let txjg = '';
        let txxs = '';
        let shangxianri = false;
        let shifoujiaoyanzhu = false;
        return new Promise(reslove=>{
            vpQuery('/{bjyh}/xmsq/getXmSxTxFlag', {
                sqSxSj: t2
            }).then(data=>{
                txjg = data.data.txjg;
                txxs = data.data.txxs;
                shangxianri = data.data.shangxianri;
                shifoujiaoyanzhu = data.data.shifoujiaoyanzhu;
                if (moment(t2).isBefore(t1)) {
                    VpAlertMsg({
                        message: "消息提示",
                        description: "输入的【申请上线时间】小于系统日期，请重新输入！",
                        type: "warning",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    reslove(false);
                }else if (shangxianri && shifoujiaoyanzhu) {
                    //选中的时间是上线日，但是当前系统时间小于配置的时间间隔。也是无法提上线申请单。
                    VpAlertMsg({
                        message: "消息提示",
                        description: "请于上线前一周的周四" + txxs + "点前完成业务测试工作并将上线申请提交到信息技术部门。如有疑问，请联系系统管理员。",
                        type: "warning",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    reslove(false);
                }else if (!shangxianri && shifoujiaoyanzhu) {
                    //这个是非上线日，但是当前系统时间和选中的申请上线时间差小于配置的时间差。所以也不能提上线流程。
                    VpAlertMsg({
                        message: "消息提示",
                        description: "请于投产日" + txjg + "天前完成业务测试工作并将上线申请提交到信息技术部门。如有疑问，请联系系统管理员。",
                        type: "warning",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    reslove(false);
                }else{
                    reslove(true);
                }
            })
        })
    }
    /**
     * 
     * @returns 该步骤执行多次则返回false 执行一次为true
     */
    getThisStepCount=()=>{
        return new Promise(reslove=>{
            vpQuery('/{bjyh}/xmsq/getThisStepCount',{
                piid:this.props.piid
            }).then(res=>{
                if(res>1){
                    reslove(true)
                }else{
                    reslove(false)
                }
            })
        })
    }
    /**
     * 表单数据加载成功后
     * @param formData
     */
    onDataLoadSuccess = (formData,handlers) => {
        let _this = this;
        //是否通过1
        let iywyzsftg11=formData.findWidgetByName('iywyzsftg');
        iywyzsftg11.field.props.label="是否通过";
        //是否返回业务1
        let isffhyw11=formData.findWidgetByName('isffhyw1');
        isffhyw11.field.props.label="是否返回业务";
        //是否与需求符合6
        let ixqfh66=formData.findWidgetByName('ixqfh6');
        ixqfh66.field.props.label="是否与需求符合";
        //是否与需求符合7
        let ixqfh77=formData.findWidgetByName('ixqfh7');
        ixqfh77.field.props.label="是否与需求符合";

        console.log('sxsqTjsxsqFlowForm--onDataLoadSuccess', formData);
        console.log('shandlers', handlers);

        //业务直返运营项目 如果为空则默认0
        var sywzfyyxm = formData.findWidgetByName("sywzfyyxm");
        console.log("sywzfyyxm",sywzfyyxm.field.fieldProps.initialValue);
        if(sywzfyyxm.field.fieldProps.initialValue==null){
            _this.props.form.setFieldsValue({
                'sywzfyyxm': "0"
            })
        }

        //默认屏蔽两个节点
        // let scondition = formData.findWidgetByName('scondition')
        // let eobj = {target:{value:''}}
        // if(scondition){
        //     scondition.field.props.options_.map(item=>{
        //             if(sywzfyyxm.field.fieldProps.initialValue==1){
        //                 item.value=='SYSA'?item.hidden=true:null
        //                 // item.value=='SYSB'?item.hidden=true:null
        //                 item.value=='SYSC'?item.hidden=true:null
        //             }else if(sywzfyyxm.field.fieldProps.initialValue==2){
        //                     item.value=='SYSA'?item.hidden=true:null
        //                     item.value=='SYSB'?item.hidden=true:null
        //                     //item.value=='SYSC'?item.hidden=true:null
        //                     _this.props.form.setFieldsValue({scondition:'SYSC'})
        //                     eobj.target.value='SYSC'
        //                     _this.handleCondition(eobj)
        //             }else{
        //                 // item.value=='SYSA'?item.hidden=true:null
        //                 item.value=='SYSB'?item.hidden=true:null
        //                 item.value=='SYSC'?item.hidden=true:null
        //             }
                        
        //     })
        // }
        //是否直接到运营部 如果为空则默认1
        var ssfzjdyyb = formData.findWidgetByName("ssfzjdyyb");
        console.log("ssfzjdyyb",ssfzjdyyb.field.fieldProps.initialValue);
        if(ssfzjdyyb.field.fieldProps.initialValue==null){
            _this.props.form.setFieldsValue({
                'ssfzjdyyb': "1"
            })
        }
        
        _this.props.form.setFieldsValue({
            'ssfhts': "0",
            'SYSG': "1"
        })

        //判断业务部领导
        var rywbld = formData.findWidgetByName("rywbld");
        //有值可以用它隐藏
        // console.log("formData",formData)
        // this.displayProps(formData,rywbld,false);
        // formData.groups[rywbld.groupIndex].group_type = 4
        console.log("rywbld", rywbld)
        rywbld.field.props.modalProps.ajaxurl='/{bjyh}/ZKXmsxFrom/queryNameByUsers';
        rywbld.field.props.modalProps.condition=['业务部领导',vp.cookie.getTkInfo('idepartmentid')];
        console.log("rywbld", rywbld)
        // if (rywbld != null) {
        //     // 如一致则【是否需求提出人】字段设置为1
        //     vpQuery('/{bjyh}/ZKXmsxFrom/queryNameByUsers', {
        //         Sname: '业务部领导',UserID:vp.cookie.getTkInfo('userid')
        //     }).then((response) => {
        //         console.log("业务部", response)

        //         if (response.data.length > 0) {
        //             let res = response.data
        //             let rywbldfzr = ''
        //             let ids = ''
        //             for (let i = 0; i < res.length; i++) {
        //                 ids += res[i].iid + ','
        //                 rywbldfzr += res[i].sname + ','
        //             }
        //             ids = ids.substring(0, ids.length - 1)
        //             rywbldfzr = rywbldfzr.substring(0, rywbldfzr.length - 1)
        //             // 自动获取业务部领导负责人
        //             _this.props.form.setFieldsValue({
        //                 'rywbld': ids,//id
        //                 'rywbld_label': rywbldfzr//显示的汉字
        //             })
        //         }
        //     })
        // }
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
                                'rxmtcbm_label': data.idepartmentid_name//显示的汉字
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
            // console.log("value1",v);

            let t1 = moment().format('YYYYMMDD');
            let t2 = moment(v).format("YYYYMMDD")
            let t3 = moment(v).format("YYYY-MM-DD")
            // console.log("当前日期：",t1)
            // console.log("选中日期：",t2)
            // console.log("比较：",moment(t2).isBefore(t1))
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
                // _this.props.form.setFieldsValue({
                //     'sqsxsj':null,//id
                //     'sqsxsj_label':null//显示的汉字
                // })
                //项目上线时间与维护表中的标准上线是否一致

            } else {
                console.log("选中日期", t2)
                console.log("当前日期", t1)
                console.log("选中日期", t3)
                vpQuery('/{bjyh}/ZKXmsqFrom/ContrastTwoTimes', {
                    dqsj: t3
                }).then((response) => {
                    console.log("data", response.data)
                    if (response.data == 1) {
                        _this.props.form.setFieldsValue({
                            ssfzcsx: '1'
                        })
                    } else if (response.data == 0) {
                        VpAlertMsg({
                            message: "消息提示",
                            description: "您所选择的申请上线时间偏差小于设置的阈值，如确定申请该日期上线，请填写原因！",
                            type: "warning",
                            onClose: this.onClose,
                            closeText: "关闭",
                            showIcon: true
                        }, 5);
                        _this.props.form.setFieldsValue({
                            ssfzcsx: '1'
                        })
                    } else if(response.data==2) {
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
                    }
                })


            }
        }
 
        ////0代表开发拒绝 1代表运营拒绝 2 代表 项目经理拒绝 直接到业务
        var yyxm = formData.findWidgetByName("sywzfyyxm");
        let kffzrcl =formData.findWidgetByName('skffzrclyj');
        let yydbsp =formData.findWidgetByName('syydbspyj');
        let xmjlsp =formData.findWidgetByName('sxmjlshyj');
        let clyj = kffzrcl.field.fieldProps.initialValue;
        let yyclyj = yydbsp.field.fieldProps.initialValue;
        let xmclyj = xmjlsp.field.fieldProps.initialValue;

        console.log("yyxm.field.fieldProps.initialValue:"+yyxm.field.fieldProps.initialValue);
        
        if(yyxm.field.fieldProps.initialValue==1){
            if(yyclyj == null || yyclyj == undefined || yyclyj == ''){
            }else{
                vpQuery('/{bjyh}/ZKsecondSave/searchJj',{
                    piid:_this.props.piid,name:'SYSM',userid:vp.cookie.getTkInfo().userid,entityname:"WFENT_SXSQLC",dqskey:"SYSA"
                }).then(res=>{
                    console.log(res);
                    if(res.flag){
                        VpAlertMsg({
                            message:'运营代表审批处理意见',
                            description:''+yyclyj, 
                            closeText:'关闭',
                            type:'info', 
                            showIcon:true
                        },30);
                    }
                    
                })
                // VpAlertMsg({
                //     message:'运营代表审批处理意见',
                //     description:''+yyclyj, 
                //     closeText:'关闭',
                //     type:'info', 
                //     showIcon:true
                // },30);
            }
        }else if(yyxm.field.fieldProps.initialValue==2){
            if(xmclyj == null || xmclyj == undefined || xmclyj == ''){
            }else{
                vpQuery('/{bjyh}/ZKsecondSave/searchJj',{
                    piid:_this.props.piid,name:'SYSP',userid:vp.cookie.getTkInfo().userid,entityname:"WFENT_SXSQLC",dqskey:"SYSA"
                }).then(res=>{
                    console.log(res);
                    if(res.flag){
                        VpAlertMsg({
                            message:'项目经理审核处理意见',
                            description:''+xmclyj, 
                            closeText:'关闭',
                            type:'info', 
                            showIcon:true
                        },30);
                    }
                    
                })
                // VpAlertMsg({
                //     message:'项目经理审核处理意见',
                //     description:''+xmclyj, 
                //     closeText:'关闭',
                //     type:'info', 
                //     showIcon:true
                // },30);
            }
        }else{
            if(clyj == null || clyj == undefined || clyj == ''){
            }else{

                vpQuery('/{bjyh}/ZKsecondSave/searchJj',{
                    piid:_this.props.piid,name:'SYSJ',userid:vp.cookie.getTkInfo().userid,entityname:"WFENT_SXSQLC",dqskey:"SYSA"
                }).then(res=>{
                    console.log(res);
                    if(res.flag){
                        VpAlertMsg({
                            message:'开发部提交文档处理意见',
                            description:''+clyj, 
                            closeText:'关闭',
                            type:'info', 
                            showIcon:true
                        },30);
                    }
                    
                })


                // VpAlertMsg({
                //     message:'开发部提交文档处理意见',
                //     description:''+clyj, 
                //     closeText:'关闭',
                //     type:'info', 
                //     showIcon:true
                // },30);
            }
        }

        /**
         * 76.优化需求(二)
         * 5.在上线申请流程【业务代表提交申请】审批节点增加“预期应用效果”字段，
         * 对于未填写“预期应用效果”的项目此字段必填，
         * 已经填写“预期应用效果”的项目自动带出此字段的内容，且只读
         * 
         * 1.获取 预期应用效果_项目申请 字段的值 用作最初原始值进行比较 
         * 2.隐藏 预期应用效果_项目申请 字段
         */
        let syqyyxgVal = formData.findWidgetByName('syqyyxg_xmsq').field.fieldProps.initialValue;   
        formData.findWidgetByName('syqyyxg_xmsq').field.hidden=true;
        let syqyyxg =formData.findWidgetByName('syqyyxg');          
        if(syqyyxgVal!=null && syqyyxgVal.length > 0 ){ // 项目本身没有预期应用效果（预期应用效果_项目申请没有值）        
            syqyyxg.field.props.readOnly = true ;
            syqyyxg.field.props.disabled = true ;                                  
        }else{
            syqyyxg.field.props.readOnly = false ;
            syqyyxg.field.props.disabled = false ;  
        }

    }

}

sxsqTjsxsqFlowForm = FlowForm.createClass(sxsqTjsxsqFlowForm);
export default sxsqTjsxsqFlowForm;