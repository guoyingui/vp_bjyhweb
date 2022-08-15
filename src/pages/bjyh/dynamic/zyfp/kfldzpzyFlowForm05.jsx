import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';

import {formDataToWidgetProps} from '../../../templates/dynamic/Form/Widgets';
import ModUserButton from '../../../templates/dynamic/Flow/ModUserButton';

import { common, validationRequireField, singleInputFill,initHiddenColumn,xmsqHiddenColumn,initHiddenColumn_history } from '../code';
import {findFiledByName} from 'utils/utils';
import moment from "moment";

/**
 * 开发领导指派资源04
 */
//项目申请
var iyspctemp = '0';
class kfldzpzyFlowForm05 extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops={
            ismoduser:true,//是否启用更改处理人
            ajaxurl:'',//数据源接口地址：不定义则使用默认地址
            moduserCondition:[{//更改处理人用户列表查询条件
                field_name:'idepartmentid',
                field_value:"100061",
                expression:'in'
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
                field_name:'SSEQUENCEKEY',
                field_value:'100000008001',//	D000801
                expression:'like'
            }])
        }).then(res=>{
            if(res.data){
                let ids = []
                res.data.map(item=>{ ids.push(item.iid) })

                vpQuery('/{vpplat}/vfrm/entity/listDatas', {
                    entityid:1,
                    condition:JSON.stringify([{
                        field_name:'scode',
                        field_value:'D0010',//	D000801
                        expression:'like'
                    }])
                }).then(res=>{
                    if(res.data){
                        let ides = []
                        res.data.map(item=>{ ides.push(item.iid) })
                        console.log("ids1:"+ides);
                        //查询金科运开发部id 拼到‘开发负责人’的查询条件中去
                    vpQuery('/{vpplat}/vfrm/entity/listDatas', {
                        entityid: 1,
                        condition: JSON.stringify([{
                            field_name: 'idepartmentid',
                            field_value: "100013,"+ides.toString(),
                            expression: 'in'
                        }])
                    }).then(res => {
                        if (res.data) {
                            let jkywIds = res.data[0].iid
                            if (jkywIds) {
                                let formData = _this.state.formData
                                let moduserprops=_this.state.moduserprops
                                moduserprops.moduserCondition[0].field_value = jkywIds + ',' + ids.toString()+',1134'
                                _this.setState({ moduserprops: moduserprops, })
                                let rkffzr = formData.findWidgetByName('rkffzr') 
                                rkffzr.field.props.modalProps.condition = [{
                                    field_name: 'idepartmentid',
                                    field_value: jkywIds + ',' + ids+',1134',
                                    expression: 'in'
                                }]
                            }
                        }
                    })
                    }
                });
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
        console.log(_this,formData)

        /* 字段【是否等待资源】 onchange */
        let isfddzykf = formData.findWidgetByName('isfddzykf')//0是1否
        let dddkskf = formData.findWidgetByName('dddkskf')
        let rkffzr = formData.findWidgetByName('rkffzr')
        /* if(isfddzykf.field.fieldProps.initialValue==0){
            rkffzr.field.fieldProps.rules[0].required=false
        }else{
            rkffzr.field.fieldProps.rules[0].required=true
        } */
        
        if(isfddzykf&&dddkskf){
            isfddzykf.field.fieldProps.onChange = e =>{
                if(e == 0){
                    //rkffzr.field.fieldProps.rules[0].required=false
                    //_this.setRequire(rkffzr,false,false); 
                    _this.props.form.setFieldsValue({dddkskf:moment().format('YYYY-MM-DD hh:mm:ss')})
                }else{
                    //rkffzr.field.fieldProps.rules[0].required=true
                    //_this.setRequire(rkffzr,true,false); 
                    _this.props.form.setFieldsValue({dddkskf:''})
                }
                _this.props.form.validateFields(['rkffzr','rkffzr_label'],{force:true})
            }
        }  
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
 
        //自动带出项目经理
        vpAdd('/{bjyh}/xmsq/getStepInfoBysid',{
            piid:_this.props.piid,stepkey:'sid-DFB8E1FE-4BA9-470B-B377-5E1699BC0D9A'
        }).then(res=>{
            if(res){
                let handlers = _handlers
                handlers.map(item=>{
                    if(item.flag === 'SYSG'){
                        item.ids=res.data.assignee_;
                        item.names=res.data.username;
                        _this.props.form.setFieldsValue({
                            [item.stepkey]:res.data.assignee_,
                            [item.stepkey+'_label']:res.data.username
                        })
                    }
                })
                _this.setState({handlers:handlers})           
            }
        })
    }

    onGetFormDataSuccess = data => {
        
        data.handlers.map(item=>{
            if(item.flag==='SYSJ'){
                item.names = item.names === '管理员'?'':item.names
                item.ids = item.ids === '1'?'':item.ids  
            }
        })
    }

    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'SYSK' ? true : false
        validationRequireField(_this, 'skfldclyj', flag)
    }

    onBeforeSave = (formData, btnName) => {
        let sparam = JSON.parse(formData.sparam)
        let scondition = sparam.scondition;
        let rkffzr = sparam.rkffzr //开发负责人
        //let isfddzykf = sparam.isfddzykf //是否等待0是1否
        if(btnName=='ok'){
            if(scondition!='SYSK'){
                sparam.dddjskf = moment().format('YYYY-MM-DD hh:mm:ss')
                //开发负责人等字段提交时校验非空
                if(!rkffzr){
                    VpAlertMsg({
                        message: "消息提示",description: '开发负责人不能为空！',
                        type: "warning",onClose: this.onClose,
                        closeText: "关闭",showIcon: true
                    }, 3)
                    return false
                }
            }
        }
        formData.sparam = JSON.stringify(sparam)

        singleInputFill(formData, btnName, 'skfldclyj', true)
    }

    onSaveSuccess = (ss, btnName, formData) => {
        let _this = this
        let sparam = JSON.parse(formData.sparam)

        if (btnName == 'ok' && sparam.isfddzykf==0) 
        vpAdd('/{bjyh}/xmsq/getStepInfoBysid',{
            piid:_this.props.piid,stepkey:'sid-866A2EB5-D43A-44A1-B2AE-B00EEE0A3431'
            }).then(res=>{
            vpQuery('/{vpplat}/vfrm/api/sendmail', {
                title: `${sparam.sname} 资源排队提醒`,
                content: `${sparam.sname} 项目申请流程开发领导指派资源步骤选择了资源排队`,
                receiver: res.data.semail
            }).then((res1) => {
                console.log('发送结束邮件，给所有节点处理人及评审人发送邮件')
            })
        })
        _this.cancelModal();
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
                /* render(btnItem,_thisform){
                    let {handler,render,...btnProps} = btnItem;
                    return <ModUserButton 
                        {...btnDefaultProps} 
                        btnProps={btnProps} 
                        condition={[{
                            field_name:'idepartmentid',
                            field_value:vp.cookie.getTkInfo('idepartmentid'),//部门,
                            expression:'eq'
                            }]} />
                } */
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
                required: requiredFlag, message: ""
            }];
            //obj.field.props.disabled=disabledFlag
            //if(!requiredFlag){
                let props = _this.props.form.getFieldProps(obj.field.field_name);
                if(props){
                    //props['data-__meta'].hidden = !requiredFlag;
                    props['data-__meta'].rules[0].required=requiredFlag
                    props['data-__meta'].rules[0].message= requiredFlag?'输入内容不能为空':''
                }
            //}           
        }
    }

}
kfldzpzyFlowForm05 = FlowForm.createClass(kfldzpzyFlowForm05);
export default kfldzpzyFlowForm05;