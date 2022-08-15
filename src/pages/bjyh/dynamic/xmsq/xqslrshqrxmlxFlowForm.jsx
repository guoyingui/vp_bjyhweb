import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import {
    vpQuery, vpAdd, VpAlertMsg,VpMWarning
} from 'vpreact';

import {
    registerWidgetPropsTransform,
    registerWidget,
    getCommonWidgetPropsFromFormData
} from '../../../templates/dynamic/Form/Widgets';
import { common, validationRequireField, singleInputFill,fileValidation,initHiddenColumn,xmsqHiddenColumn,initHiddenColumn_history } from '../code';
import FlowSpecialMsg from 'pages/custom/Flow/FlowSpecialMsg'
 //项目申请
 var iyspctemp = '0';
/**
 * 需求受理人审核确认项目类型
 */
class xqslrshqrxmlxFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops={
            ismoduser:true,//是否启用更改处理人
            ajaxurl:'',//数据源接口地址：不定义则使用默认地址
            moduserCondition:[{//更改处理人用户列表查询条件
                field_name:'sloginname',
                field_value:"'gl','gs','ls','kf','yw'",
                expression:'in'
            }]//零售业务、公司及金融市场业务、管理类业务
        }
        
    }

    onFormRenderSuccess(formData){
        initHiddenColumn(iyspctemp)
    }

    // 加载成功后执行
    onDataLoadSuccess = formData => {
        
        // 删除生产环境的bjyhweb的div标签元素
        let devflag = window.vp.config.URL.devflag;
        if(!devflag){
            if(document.getElementById("bjyhweb")){
                document.getElementById("bjyhweb").remove()
            }
        }

        let _this = this
        console.log(_this,formData);
        let isfddzyxqsl = formData.findWidgetByName('isfddzyxqsl');
        let dddksxqslval = _this.props.form.getFieldValue('dddksxqsl');
        isfddzyxqsl.field.fieldProps.onChange = (value) => {
            if (value == '0') {
                if (!dddksxqslval) {
                    _this.props.form.setFieldsValue({
                        'dddksxqsl': new Date()
                    })

                }
            }else{
                _this.props.form.setFieldsValue({
                    'dddksxqsl':'',
                    'dddjsxqsl':''
                })
            }
        }
        let iyspc = formData.findWidgetByName('iyspc');
        if(_this.props.isHistory){
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
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display='none';
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
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display='none';
            } else if (v == "2") {
                let obj =_this.props.form.getFieldsValue(['sysbh1','sysmc1','scpmc'])
                console.log('obj...',obj);
                _this.props.form.setFieldsValue({
                    'sysbh3': '',
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc3': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display='none';
            } else if (v == "3") {
                _this.props.form.setFieldsValue({
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display='none';
            } else if (v == "4") {
                _this.props.form.setFieldsValue({
                    'sysbh5': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display='none';
            } else if (v == "5") {
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display='block';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display='block';
            }
        
        }



        /**
         * 68.流程提出提醒及限制(一期)
         *  1)增加对于流程数量的条件
         *      b.增加【业务部门领导】、【需求受理人审核确认项目类型】以及【立项审批】三个审批节点
         *      的提醒“本项目需求提出人提出流程已超过*个，为保证项目实施过程顺利、资源充沛，建议由其他人员负责”。
         *  2)增加实施中项目数量的提醒和限制
         *      b.增加【业务部门领导】、【需求受理人审核确认项目类型】以及【立项审批】三个审批节点的提醒“本项目需求提出人负责项目已超过5个，
         *      为保证项目实施过程顺利、资源充沛，建议由其他人员负责”。
         */
        if(this.state.newButtons[0].name == "ok"){
            let proc_inst_id_ = _this.props.piid ;//流程实例ID
            vpAdd('/{bjyh}/lcTcTxJXzRest/getXmSqTxFlag12b',{
                proc_inst_id_ :proc_inst_id_
            }).then(res=>{
                if(res.data.flag){
                    VpMWarning({
                        title: '这是一条提醒通知',
                        content: 
                        <FlowSpecialMsg 
                        msg1 = {res.data.msg1} 
                        msg2 = {res.data.msg2}
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
        try{
            let ixmdj_xmsxxx=formData.findWidgetByName('ixmdj_xmsxxx');
            ixmdj_xmsxxx.field.props.label='项目等级';
            //
            let ixmsx_pmo=formData.findWidgetByName('ixmsx_pmo');
            ixmsx_pmo.field.props.label='项目属性';
            //
            let rsjxt_pmo=formData.findWidgetByName('rsjxt_pmo');
            rsjxt_pmo.field.props.label='涉及系统';
        }catch(e){

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
        let flag = e.target.value == 'SYSD' ? true : false
        validationRequireField(_this, 'sxqslrshclyj', flag)
    }

    onBeforeSave(formData, btnName) {
        let _this = this
        if (btnName == 'ok') { 
            let sparam = JSON.parse(formData.sparam);
            let username = vp.cookie.getTkInfo('nickname');
            //let sxqslrshclyj = sparam.sxqslrshclyj;
            let scondition = sparam.scondition;//SYSC--同意 SYSD -- 拒绝
            let dddjsxqsl = sparam.dddjsxqsl;//等待结束-需求受理
            let isfddzyxqsl = sparam.isfddzyxqsl//是否等待资源0是1否
            
            formData.sparam = JSON.stringify(sparam)
            singleInputFill(formData, btnName, 'sxqslrshclyj', true)
            if (scondition == 'SYSC') {
                if(isfddzyxqsl == '0' && (dddjsxqsl == null || dddjsxqsl == undefined || dddjsxqsl == '')){
                    let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                    sparam.dddjsxqsl = time
                }
            }
        }
    }


}
xqslrshqrxmlxFlowForm = FlowForm.createClass(xqslrshqrxmlxFlowForm);
export default xqslrshqrxmlxFlowForm;