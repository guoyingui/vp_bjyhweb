import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import accessFlowForm from "../flowAccess/accessFlowForm";

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';

import {
    formDataToWidgetProps
} from '../../../templates/dynamic/Form/Widgets';
import { common, validationRequireField, singleInputFill,initHiddenColumn,xmsqHiddenColumn,initHiddenColumn_history } from '../code';
import {findFiledByName} from 'utils/utils';

//项目申请
var iyspctemp = '0';

/**
 * A类项目评审
 */
class A_TypeAssess17 extends accessFlowForm.Component {
    constructor(props) {
        super(props);
        this.state.addtype = 4
        this.state.accessType = 'normal'
    }
    
    onFormRenderSuccess(formData){
        initHiddenColumn(iyspctemp)
    }  
    
    // 加载成功后执行
    onDataLoadSuccess = (formData,_handlers) => {

        // 删除生产环境的bjyhweb的div标签元素
        let devflag = window.vp.config.URL.devflag;
        if(!devflag){
            if(document.getElementById("bjyhweb")){
                document.getElementById("bjyhweb").remove()
            }
        }

        //console.log(this,formData);
        let _this = this

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

        /* let rpsry = formData.findWidgetByName('rpsry');
        if(rpsry){
            let psryids = rpsry.field.fieldProps.initialValue
            let param = {
                idList:psryids,
                piid:this.props.piid,
                taskid:this.props.taskid||this.props.staskid||this.props.formData.curtask.taskId
            }

            vpAdd("/{bjyh}/flowAccess/addAssesser", {
                param:JSON.stringify(param)
            }).then((response) => {
                accessThis.object.child.tableRef.getTableData()//刷新子页面
            })
        } */

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

    //请求完assessList后
    onGetListSuccess(obj){
        if(this.props.assessid){
            return
        }

        let _this = this
        console.log('onGetListSuccess',obj)
        let canAcross = true
        if(obj.resultList.length===0){
            canAcross = false
        }
        obj.resultList.map(item=>{
            if(item.p_iid == -1 && ((item.results==2 ||item.status==1))){
                canAcross=false
            }
            // if(item.results==2 ||item.status==1){
            // }
        })

        const eobj = {target:{value:''}}
        let scondition = _this.state.formData.findWidgetByName('scondition');
        if(!canAcross){
            _this.props.form.setFieldsValue({scondition:'SYSZD'})
            eobj.target.value = 'SYSZD'
            _this.handleCondition(eobj)
            scondition.field.props.options_.map(item=>{
                if(item.value!=='SYSZD'){
                    item.disabled = true
                }
            })
        }
    }

    //底部按钮设置
    getCustomeButtons(){
        let buttons = this.props.buttons; 
          
        if(!buttons){
            //如果没有自定义按钮，用默认的
            buttons = [];
            if(this.props.staskid){
                if(this.isCreator()){
                    buttons.push({name: "ok",
                    text: "结束评审",
                    validate: true,
                    handler: this.handleSubmit,
                    className: "m-r-xs vp-btn-br",
                    type: "primary",
                    size: "default"})
                }else{
                    buttons.push({name: "ok",
                    text: "提交",
                    validate: true,
                    handler: this.handleSubmit,
                    className: "m-r-xs vp-btn-br",
                    type: "primary",
                    size: "default"})
                }
                buttons.push("save");
                if(this.props.ijump){
                    //自由跳转
                    buttons.push("jump");
                }
                if(!this.isCreator() &&
                    this.state.assesserData.p_assesser == '-1'){
                    buttons.push({
                        name: "modify",
                        text: "指定评审人",
                        validate: false,
                        // handler: this.state.subflag?this.modifyUser:null,
                        // className: `vp-btn-br ${this.state.subflag?'':'disabled'}`,
                        handler:this.modifyUser,
                        className: `vp-btn-br`,
                        size: "default"
                    });
                }
            }
            buttons.push("cancel");
        }
        return buttons;
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
A_TypeAssess17 = FlowForm.createClass(A_TypeAssess17);
export default A_TypeAssess17;