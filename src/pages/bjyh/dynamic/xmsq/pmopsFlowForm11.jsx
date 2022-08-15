import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg,VpConfirm
} from 'vpreact';

import {
    formDataToWidgetProps
} from '../../../templates/dynamic/Form/Widgets';
import { common, validationRequireField, singleInputFill,initHiddenColumn,xmsqHiddenColumn,initHiddenColumn_history } from '../code';
import {findFiledByName} from 'utils/utils';

//项目申请
var iyspctemp = '0';

/**
 * PMO审批
 */
class pmopsFlowForm11 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        super.componentWillMount()
    }

    onFormRenderSuccess(formData){
        initHiddenColumn(iyspctemp)
    }  

    // 加载成功后执行
    onDataLoadSuccess = (formData,handlers) => {

        // 删除生产环境的bjyhweb的div标签元素
        let devflag = window.vp.config.URL.devflag;
        if(!devflag){
            if(document.getElementById("bjyhweb")){
                document.getElementById("bjyhweb").remove()
            }
        }

        let _this = this;
        console.log(_this,formData);       
        
        let ixmbq1 = formData.findWidgetByName('ixmbq1')
        ixmbq1.field.props.label="项目标签";
        let ixmbq = formData.findWidgetByName('ixmbq')
        ixmbq.field.fieldProps.initialValue=ixmbq1.field.fieldProps.initialValue;
        const ixmbq2 = formData.findWidgetByName('ixmbq2')
        ixmbq2 && (ixmbq2.field.props.label="项目标签");
        
        /**
         * 70.项目申请流程优化
         * 2、【PMO评审】
         *  审批节点增加字段“是否需业务线领导审批”，A类项目此字段为必选，B类项目此字段为只读，
         * “是否需业务线领导审批”=是，则流程提交给【业务部领导审批】，
         * 【业务部领导审批】提交流程给【业务线领导审批】；“是否需业务线领导审批”=否，
         * 则流程提交给【业务部领导审批】，【业务部领导审批】提交流程给【PMO确认】
         */
        // let ixmdj = formData.findWidgetByName('ixmdj')
        // ixmdj.field.fieldProps.onChange = e =>{
        //     if(e*1 == 1){
        //         _this.state.formData.findWidgetByName('isfxywxldsp').field.props.disabled = false ;
        //         //第一次 选择时 没有必填属性时 公共方法无法提示
        //         _this.state.formData.findWidgetByName('isfxywxldsp').field.fieldProps.rules[1] = {required:true};   
        //         validationRequireField(_this, 'isfxywxldsp', true,'A级项目必选')
        //     }else{
        //         _this.state.formData.findWidgetByName('isfxywxldsp').field.props.disabled = true ;
        //         validationRequireField(_this, 'isfxywxldsp', false)            
        //     }
        // }

        /* 评审结果（下拉单选）为通过/不通过时 审批结果自动同意/拒绝 */
        const eobj = {target:{value:''}}
        let ipsjg = formData.findWidgetByName('ipsjg')//0通过 1不通过
        ipsjg.field.fieldProps.onChange = e =>{
            switch (e*1) {
                case 0:
                    eobj.target.value = 'SYSQ'
                    _this.handleCondition(eobj)
                    _this.props.form.setFieldsValue({scondition:'SYSQ'})
                    validationRequireField(_this, 'spsyj', false)
                    break;
                case 1:
                    eobj.target.value = 'SYSR'
                    _this.handleCondition(eobj)
                    _this.props.form.setFieldsValue({scondition:'SYSR'})
                    validationRequireField(_this, 'spsyj', true)
                    break;
            }
        }
        /*  */

        //根据预算数量隐藏...
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
    }

    onBeforeSave = (formData,btnName)=>{
        let _this = this
        
        //提交时校验项目等级
        let {ixmdj,ixmlb,scondition,sdescription,fbxmyjtrje,isfxjxt} = _this.props.form.getFieldsValue([
            'ixmdj','ixmlb','scondition','sdescription','fbxmyjtrje','isfxjxt'])
        if(!fbxmyjtrje){
            fbxmyjtrje = 0
        }
        if(ixmdj&&scondition&&ixmlb&&btnName=='ok'){
            switch (scondition) {
                case 'SYSQ':
                    if(0==ixmlb){
                        if('0'!=ixmdj){
                            this.alertMsg('支持类的项目等级只能是无!','warning');
                            return false;
                        }
                    }else{
                        if(0==ixmdj){
                            this.alertMsg('开发类的项目等级不能是无!','warning');
                            return false;
                        }
                        /**
                         * 项目管理系统（六期）项目 56.立项级别与新建系统与预算强制校验
                         * 项目申请的PMO评审中项目级别和预算不一致，则流程无法提交。
                         * 项目申请中“是否新建系统”为是或“本项目预计投入费用”>=300万，则项目级别只能A级，如项目级别选择不正确，则流程无法提交。
                         * 项目等级 ixmdj  0无 1A 2B ,是否新建系统 isfxjxt 0否 1是
                         */
                        if( fbxmyjtrje*1>=3000000 && ixmdj!= "1" ){
                            this.alertMsg('本项目预计投入费用大于或等于300万，项目级别只能A级，请修改项目等级!','warning');
                            return false ;
                        }
                        if( "1"==isfxjxt && ixmdj!= "1" ){
                            this.alertMsg('本项目是新建系统的项目，项目级别只能A级，请修改项目等级!','warning');
                            return false ;
                        }
                        // 当“本项目预计投入费用”<300万 并且“是否新建系统”为否 时 只能项目级别只能B级
                        if( "0"==isfxjxt && fbxmyjtrje*1<3000000 && ixmdj!="2" ){
                            this.alertMsg('“本项目预计投入费用”<300万 并且“是否新建系统”为否，项目级别只能B级，请修改项目等级!','warning');
                            return false ;
                        }

                    }
                    break;
                case 'SYSR':
                    break;
            }
        }
        singleInputFill(formData, btnName, 'spsyj', true,true,this.state.formData)

        //若是被退回 展开一些节点
        // TODO
    }

    /**
     * 表单加载之前动作
     * @param data
     */
    onGetFormDataSuccess(data){
        let _this = this
        let scondition = findFiledByName(data.form,'scondition')
        let ipsjg = findFiledByName(data.form,'ipsjg')
        let ywbld = findFiledByName(data.form,'rywbld')
        
        if(ipsjg.field.widget.default_value==0){
            data.scondition = 'SYSQ'
            scondition.field.widget.default_value='SYSQ'
        }else{
            scondition.field.widget.default_value='SYSR'
            data.scondition = 'SYSR'
        }

        if(_this.props.isHistory){
            return;
        }

        let pdid = _this.props.pdid;
        let version = pdid.split(':')[1];
        let rywdb = findFiledByName(data.form, 'rywdb');
        if (version > 48) {
            return new Promise(resolve => {
                try {
                    if(ywbld.field.widget.default_value) {
                        data.handlers.map(item => {
                            if (item.flag === 'SYSQ') { //业务部领导审批
                                item.ids = ywbld.field.widget.default_value
                                item.names = ywbld.field.widget.default_label
                            }
                        })
                        resolve(data)
                    }
                } catch (error) {
                    
                }
                
                vpAdd('/{bjyh}/util/getDptInfoByUserids', {
                    userids: rywdb.field.widget.default_value
                }).then(res => {
                    if (res.data) {
                        const dptid = res.data.iid
                        data.handlers.map(item => {
                            if (item.flag === 'SYSQ') { //业务部领导审批
                                item.searchCondition = [{
                                    field_name: 'idepartmentid',
                                    field_value: dptid,
                                    flag: '3'
                                }]
                                item.ajaxurl = '/{bjyh}/xzxt/getUser';
                            }
                        })
                        resolve(data)
                    }
                })
            })
        } else {
            return new Promise(resolve => {
                vpAdd('/{bjyh}/xmsq/fristStepAssigne', {
                    piid: _this.props.piid,
                    //iid:_this.props.iobjectid
                }).then(res => {
                    if (res) {
                        //业务代表自动带出
                        data.handlers.map(item => {
                            if (item.flag === 'SYSQ') {
                                item.ids = res.data.iid
                                item.names = res.data.sname
                            }
                        })
                        resolve(data)
                    }
                })
            })
        }
    }

    //右上角弹框提示
    alertMsg=(desc,type,message)=>{
        return(
            VpAlertMsg({
                message: message||"消息提示",
                description: desc||'!',
                type: type||'info',
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        )
    }

}
pmopsFlowForm11 = FlowForm.createClass(pmopsFlowForm11);
export default pmopsFlowForm11;