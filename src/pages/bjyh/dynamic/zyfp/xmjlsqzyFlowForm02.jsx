import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';

import {
    formDataToWidgetProps
} from '../../../templates/dynamic/Form/Widgets';
import { common, validationRequireField, singleInputFill,fileValidation,initHiddenColumn,xmsqHiddenColumn,initHiddenColumn_history } from '../code';
import {findWidgetByName} from '../../../templates/dynamic/Form/Widgets'
import {findFiledByName} from 'utils/utils';
/**
 * 项目经理申请资源
 */
 //项目申请
var iyspctemp = '0';
class xmjlsqzyFlowForm02 extends FlowForm.Component {
    constructor(props) {
        super(props);
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
        console.log('_this',_this);
        console.log('_formData',formData,handlers);

        let stcfh = formData.findWidgetByName("stcfh");
        
        //是否测试环境上线 若为是运维部用户组改为开发部用户组
        let sfcshjsx = formData.findWidgetByName("iwcshjsx");//1是 2否
        let kfgroup,ywgroup,yuhandler//开发和运维的group

        handlers.map(item=>{
            if(item.stepcode==='kfldzpkfzy'){
                kfgroup = {...item}
            }else if(item.stepcode==='ywldzpywzy'){
                ywgroup = {...item}
                yuhandler = formData.findWidgetByName(item.stepkey);
            }
        })
        if(kfgroup&&ywgroup&&yuhandler){
            
            if(sfcshjsx.field.fieldProps.initialValue==1){
                handlers.map(item=>{
                    if(item.stepcode==='ywldzpywzy'){
                        item.groupids = kfgroup.groupids
                        yuhandler.field.props.modalProps.groupids=kfgroup.groupids
                    }
                })
            }else if(sfcshjsx.field.fieldProps.initialValue==2){
                handlers.map(item=>{
                    if(item.stepcode==='ywldzpywzy'){
                        item.groupids = ywgroup.groupids
                        yuhandler.field.props.modalProps.groupids=ywgroup.groupids
                    }
                })
            }

            sfcshjsx.field.fieldProps.onChange = (v) => {
                console.log('yuhandler',yuhandler);
                
                if(v.target.value==1){
                    handlers.map(item=>{
                        if(item.stepcode==='ywldzpywzy'){
                            item.groupids = kfgroup.groupids
                            yuhandler.field.props.modalProps.groupids=kfgroup.groupids
                        }
                    })
                }else{
                    handlers.map(item=>{
                        if(item.stepcode==='ywldzpywzy'){
                            item.groupids = ywgroup.groupids
                            yuhandler.field.props.modalProps.groupids=ywgroup.groupids
                        }
                    })
                }
                this.forceUpdate()
            }
        }
        this.forceUpdate()

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
    }


    /**
     * 默认选中按钮，并显示对应的 预设处理人 选项
     */
    onGetFormDataSuccess = data => {
        let formData = data.form.groups
        let handlers = data.handlers
        
        let rtcxqfh = findFiledByName(data.form,'rtcxqfh')//提出分行
        let fhuserids,fhusernames
        return new Promise(resolve => {
            vpQuery('/{bjyh}/util/getDictionaryListByCode',{
                scode:'fh',
                flag:'fhuser'
            }).then(res=>{
                if(res.data){
                    res.data.map(item=>{
                        if(`${item.dptid}`===rtcxqfh.field.widget.default_value){
                            fhuserids=item.ids
                            fhusernames=item.username
                        }
                    })
                }
                data.handlers.map(item=>{
                    if(item.flag==='bb'){
                        item.ids=fhuserids
                        item.names=fhusernames
                    }
                })

                resolve(data)
            })
        })
    }


    // 动态表单事件
    handleCondition(e){
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSG' ? true : false
        validationRequireField(_this, 'sxmjlclyj', flag)
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
            
            formData.sparam = JSON.stringify(sparam)

            singleInputFill(formData, btnName, 'sxmjlclyj', true)            
        }
    }

}
xmjlsqzyFlowForm02 = FlowForm.createClass(xmjlsqzyFlowForm02);
export default xmjlsqzyFlowForm02;