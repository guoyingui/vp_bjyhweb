import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';

import {
    formDataToWidgetProps
} from '../../../templates/dynamic/Form/Widgets';
import ModUserButton from '../../../templates/dynamic/Flow/ModUserButton';
import { common, validationRequireField, singleInputFill,initHiddenColumn,xmsqHiddenColumn,initHiddenColumn_history } from '../code';
import {findFiledByName} from 'utils/utils';
import moment from "moment";

//项目申请
var iyspctemp = '0';
/**
 * 运维部领导指派资源06
 */
class ywbldFlowForm06 extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops={
            ismoduser:true,//是否启用更改处理人
            ajaxurl:'',//数据源接口地址：不定义则使用默认地址
            moduserCondition:[{//更改处理人用户列表查询条件
                
            }]
        }
    }

    onFormRenderSuccess(formData){
        initHiddenColumn(iyspctemp)
    }

    componentWillMount() {
        let _this = this
        super.componentWillMount()
        vpQuery('/{vpplat}/vfrm/entity/listDatas', {
            entityid:1,
            condition:JSON.stringify([{
                field_name:'sname',
                field_value:'系统运营部',
                expression:'like'
            }])
        }).then(res=>{
            if(res.data){
                let ids = []
                res.data.map(item=>{
                    ids.push(item.iid)
                })
                let moduserprops=_this.state.moduserprops
                moduserprops.moduserCondition[0].field_value=ids.toString()+",100012"
                moduserprops.moduserCondition[0].field_name='idepartmentid'
                moduserprops.moduserCondition[0].expression='in'
                _this.setState({
                    moduserprops:moduserprops
                })
            }
        })
        //查询金科运维部id 拼到‘运维代表’的查询条件中去
        vpQuery('/{vpplat}/vfrm/entity/listDatas', {
            entityid: 1,
            condition: JSON.stringify([{
                field_name: 'scode',
                field_value: 'JK000102',
                expression: 'eq'
            }])
        }).then(res => {
            if (res.data) {
                let jkywIds = res.data[0].iid
                if (jkywIds) {
                    let formData = _this.state.formData
                    let ryweidb = formData.findWidgetByName('ryweidb') //运维代表
                    let dptIds = '1110';
                    ryweidb.field.props.modalProps.condition = [{
                        field_name: 'idepartmentid',
                        field_value: jkywIds + ',' + dptIds,
                        expression: 'in'
                    }]


                }
            }
        })
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
        
        let _this = this;
        let ryweidb = formData.findWidgetByName('ryweidb')//运维代表
        let dptIds = '1110';
        ryweidb.field.props.modalProps.condition=[{
            field_name:'idepartmentid',
            field_value: dptIds,
            expression:'in'
        }]
       
        _handlers.map(item=>{
            if(item.flag==='SYSJ'){
                let kffzrhandler = formData.findWidgetByName(item.stepkey)
                if(kffzrhandler){

                    formData.groups[kffzrhandler.groupIndex].group_type=4//隐藏节
                    //kffzrhandler.field.hidden=true 
                    item.names = kffzrhandler.field.props.widget.default_label||'管理员'
                    item.ids = kffzrhandler.field.props.widget.default_value||'1'
                    _this.props.form.setFieldsValue({
                        [item.stepkey]:kffzrhandler.field.props.widget.default_value||'1',
                        [item.stepkey+'_label']:kffzrhandler.field.props.widget.default_label||'管理员'
                    })
                }
            }
        })

       /* 字段【是否等待资源】 onchange */
        let isfddzyyw = formData.findWidgetByName('isfddzyyw')//0是1否
        let ryweidbProps = _this.props.form.getFieldProps('ryweidbProps')
        console.log('ryweidbProps',ryweidbProps);
        
        /* if(isfddzyyw.field.fieldProps.initialValue==0){
            ryweidb.field.fieldProps.rules[0].required=false
        }else{
            ryweidb.field.fieldProps.rules[0].required=false
        } */
       
       let dddksyw = formData.findWidgetByName('dddksyw')  
       if(isfddzyyw&&dddksyw){
           
           isfddzyyw.field.fieldProps.onChange = e =>{
                if(e == 0){//0是1否
                    //ryweidb.field.fieldProps.rules[0].required=false
                    //_this.setRequire(ryweidb,false,false); 
                    _this.props.form.setFieldsValue({dddksyw:moment().format('YYYY-MM-DD hh:mm:ss')})

                }else if(e==1){
                    //ryweidb.field.fieldProps.rules[0].required=true
                    //_this.setRequire(ryweidb,true,false); 
                    _this.props.form.setFieldsValue({dddksyw:'',dddjs:''})
                }

               _this.props.form.validateFields(['ryweidb_label','dddjs'],{force:true})
           }
       } 

        //根据预算数量 隐藏那啥
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
        //增加项目标签2 显示项目标签
        let ixmbq2 = formData.findWidgetByName('ixmbq2')
        ixmbq2 && (ixmbq2.field.props.label = "项目标签")
        let ixmbq1 = formData.findWidgetByName('ixmbq1')
        ixmbq1 && (ixmbq1.field.props.label = "项目标签")
    }

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSK' ? true : false
        validationRequireField(_this, 'sywldclyj', flag)
    }

    onBeforeSave = (formData, btnName) => {
        let sparam = JSON.parse(formData.sparam)
        let scondition = sparam.scondition;
        if(btnName=='ok'){
            if(scondition!='SYSK'){
                if(sparam.isfddzyyw==0){
                    sparam.dddjs = moment().format('YYYY-MM-DD hh:mm:ss')
                }
                //开发负责人等字段提交时校验非空
                if(!sparam.ryweidb){
                    VpAlertMsg({
                        message: "消息提示",description: '运维代表不能为空！',
                        type: "warning",onClose: this.onClose,
                        closeText: "关闭",showIcon: true
                    }, 3)
                    return false
                }
            }
        }
        formData.sparam = JSON.stringify(sparam)

        singleInputFill(formData, btnName, 'sywldclyj',true)
    }

    onSaveSuccess = (ss, btnName, formData) => {
        let _this = this
        let sparam = JSON.parse(formData.sparam)

        if (btnName == 'save' && sparam.isfddzyyw==0 && !sparam.rkffzr){ 
            vpAdd('/{bjyh}/xmsq/getStepInfoBysid',{
                piid:_this.props.piid,stepkey:'sid-866A2EB5-D43A-44A1-B2AE-B00EEE0A3431'
                }).then(res=>{
                vpQuery('/{vpplat}/vfrm/api/sendmail', {
                    title: `${sparam.sname} 资源排队提醒`,
                    content: `${sparam.sname} 项目申请流程运维部领导指派资源步骤选择了资源排队`,
                    receiver: res.data.semail
                }).then((res1) => {
                    console.log('发送结束邮件，给所有节点处理人及评审人发送邮件')
                })
            })
            _this.cancelModal();
        }
    }

    /**
     * 系统默认按钮
     * @return {*}
     */
    getDefaultButtons(){
        let _this = this
        let superDefBtns = super.getDefaultButtons();
        let btnDefaultProps = {
            activityName:this.props.activityName,
            usermode:this.props.usermode,
            staskid:this.props.staskid,
            formkey:this.props.formkey,
            iobjectentityid:this.props.iobjectentityid,
            iobjectid:this.props.iobjectid,
            stepkey:this.props.stepkey,
            piid:this.props.piid,
            pdid:this.props.pdid,
            entityid:this.props.entityid,
            endTime:this.props.endTime,
            closeRight:this.props.closeRight,
        }

        superDefBtns.ok = {
            ...superDefBtns.ok,
            text:"提交",
            handler:this.handleSubmit,
            isRefuse:false
        }
        superDefBtns.cancel = {
            ...superDefBtns.cancel,
            handler:this.cancelModal
        }
        let defaultBtns = {
            ...superDefBtns,
            "save":{
                name:'save',
                text:'保存',
                className:"ghost inline-display m-r-xs vp-btn-br",
                type:"ghost",
                handler:this.handleSave,
                isRefuse:false
            },
            "jump":{
                name:'jump',
                text:'跳转',
                className:"ghost inline-display m-r-xs vp-btn-br",
                type:"ghost",
                render(btnItem,_thisform){
                    let {handler,render,...btnProps} = btnItem;
                    return (
                        <JumpStepButton {...btnDefaultProps} btnProps={btnProps} />
                    )
                }
            },
            "moduser": {
                name: 'moduser',
                text: '更改处理人',
                className: "ghost inline-display m-r-xs vp-btn-br",
                type: "ghost",
                render(btnItem,_thisform){
                    let {handler,render,...btnProps} = btnItem;
                    return <ModUserButton {...btnDefaultProps} btnProps={btnProps} {..._this.state.moduserprops} />
                }
            }
        }
        return defaultBtns;
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

    setRequire=(obj,requiredFlag,disabledFlag)=>{
        let _this = this;
        if(obj){
            obj.field.fieldProps.rules[0].required=requiredFlag
            obj.field.fieldProps.rules = requiredFlag ? [{
                required: requiredFlag, message: "输入内容不能为空"
            }]:[{
                required: requiredFlag, message: "输入内容不能为空"
            }];                     
            obj.field.props.disabled=disabledFlag
            //if(!requiredFlag){
                let props = _this.props.form.getFieldProps(obj.field.field_name);
                if(props){
                    props['data-__meta'].hidden = !requiredFlag;
                    //props['data-__meta'].rules[0].required=requiredFlag
                    //props['data-__meta'].rules[0].message= requiredFlag?'输入内容不能为空':''
                }
            //}           
        }
    }
   

}
ywbldFlowForm06 = FlowForm.createClass(ywbldFlowForm06);
export default ywbldFlowForm06;