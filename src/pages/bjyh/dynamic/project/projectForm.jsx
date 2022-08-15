import React, { Component } from "react";
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";

import {
    vpQuery, vpAdd, VpAlertMsg,VpPopover
} from 'vpreact';

import {validationRequireField, singleInputFill,initHiddenColumn,xmsqHiddenColumn  } from '../code';

//项目申请
var iyspctemp = '0';
/**
 * 项目
 */
class projectForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
        this.state = {
            xmsftzcglgyOldVal : ''
        }
    }

    componentDidMount(){
        let _this = this;
        super.componentDidMount()
        // vpQuery('/{bjyh}/tfsrest/lookOldProject', {
        //     iid: _this.props.iid
        // }).then((response) => {
        //     if (response == '0') {
        //         this.setState({isshowoldbutton:true},()=>{
        //             this.getButtons()
        //         })
        //     }
        // })
        //保证已经能够拿到Element
        /* setTimeout(function(){
            if (iyspctemp == "0") {
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
            } else if (iyspctemp == "1") {
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display='none';
            } else if (iyspctemp == "2") {
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display='none';
            } else if (iyspctemp == "3") {
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display='none';
            } else if (iyspctemp == "4") {
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display='none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display='none';
            }
        }, 1500); */
    }
    
   


    // 加载成功后执行
    onDataLoadSuccess = (formData,_handlers) => {
        let _this = this;        
        //根据当前登录人角色判断是否可以修改 “项目是否停滞超过2个月” 字段
        vpQuery('/{bjyh}/lcTcTxJXzRest/getUserRoleFlag', {
            iid: _this.props.iid
            ,userId : vp.cookie.getTkInfo('userid')
        }).then((response) => {
            try{
                let ixmsftzcglgy = formData.findWidgetByName('ixmsftzcglgy');                   
                if(response.data.flag){
                    ixmsftzcglgy.field.props.disabled = false ;   
                }else{
                    ixmsftzcglgy.field.props.disabled = true ;   
                }
                _this.setState({
                    xmsftzcglgyOldVal : ixmsftzcglgy.field.fieldProps.initialValue
                });
                
            }catch(e){
                console.log(e);
            }           
        })
 
        //根据预算数量隐藏...
        let iyspc = formData.findWidgetByName('iyspc');
        iyspctemp = iyspc && iyspc.field.fieldProps.initialValue;
        let sysbh1 = formData.findWidgetByName('sysbh1');
        let sysbh2 = formData.findWidgetByName('sysbh2');
        let sysbh3 = formData.findWidgetByName('sysbh3');
        let sysbh4 = formData.findWidgetByName('sysbh4');
        let sysbh5 = formData.findWidgetByName('sysbh5');
        let sysmc1 = formData.findWidgetByName('sysmc1');
        let sysmc2 = formData.findWidgetByName('sysmc2');
        let sysmc3 = formData.findWidgetByName('sysmc3');
        let sysmc4 = formData.findWidgetByName('sysmc4');
        let sysmc5 = formData.findWidgetByName('sysmc5');
        let sysmc = {1:sysmc1,2:sysmc2,3:sysmc3,4:sysmc4,5:sysmc5}
        let sysbh = {1:sysbh1,2:sysbh2,3:sysbh3,4:sysbh4,5:sysbh5}

        if (iyspctemp == "0") {
            formData.groups[sysmc1.groupIndex].fields.splice(sysmc1.fieldIndex-1,10)
        } else if (iyspctemp == "1") {
            formData.groups[sysmc1.groupIndex].fields.splice(sysbh2.fieldIndex,8)
        } else if (iyspctemp == "2") {
            formData.groups[sysmc1.groupIndex].fields.splice(sysbh3.fieldIndex,6)
        } else if (iyspctemp == "3") {
            formData.groups[sysmc1.groupIndex].fields.splice(sysbh4.fieldIndex,4)
        } else if (iyspctemp == "4") {
            formData.groups[sysmc1.groupIndex].fields.splice(sysbh5.fieldIndex,2)
        } else if (iyspctemp == "5") {

        }

        _this.setState({lastnum:iyspctemp})//首次进入页面 初始化lastnum

        iyspc.field.fieldProps.onChange = (v) => {
            let lastnum = _this.state.lastnum||0
            let dvalue = v*1-lastnum*1
            let element_ = formData.findWidgetByName('sysmc'+lastnum)
            if(!element_){
                element_ = formData.findWidgetByName('fbxmyjtrje')
            }

            if (v == "0") {
                //if(_this.state.lastnum||0 != 0){
                    _this.props.form.setFieldsValue({
                        'sysbh1': '','sysbh2': '','sysbh3': '',
                        'sysbh4': '','sysbh5': '',
                        'sysmc1': '','sysmc2': '','sysmc3': '',
                        'sysmc4': '','sysmc5': '',
                    })
                    formData.groups[sysmc1.groupIndex].fields.splice(sysbh1.fieldIndex,(lastnum*1)*2)
                //}
            } else if (v == "1") {
                if(dvalue>0){
                    _this.scrption(formData,element_,sysmc,sysbh,dvalue)
                }else{
                    formData.groups[sysbh1.groupIndex].fields.splice(sysmc1.fieldIndex+1,(lastnum*1-1)*2)
                }
                    
            } else if (v == "2") {                
                if(dvalue>0){
                    _this.scrption(formData,element_,sysmc,sysbh,dvalue)
                }else{
                    formData.groups[sysbh2.groupIndex].fields.splice(sysmc2.fieldIndex+1,(lastnum*1-1)*2)
                }
                
            } else if (v == "3") {
                if(dvalue>0){
                    _this.scrption(formData,element_,sysmc,sysbh,dvalue)
                }else{
                    formData.groups[sysmc3.groupIndex].fields.splice(sysmc3.fieldIndex+1,(lastnum*1-1)*2)
                }
               
            } else if (v == "4") {
                if(dvalue>0){
                    _this.scrption(formData,element_,sysmc,sysbh,dvalue)
                }else{
                    formData.groups[sysmc4.groupIndex].fields.splice(sysmc4.fieldIndex+1,(lastnum*1-1)*2)
                }

            } else if (v == "5") {
                _this.scrption(formData,element_,sysmc,sysbh,dvalue)
            }
            _this.setState({lastnum:v})
        }
        

        // 项目名称增加提按钮提示
        let sname = formData.findWidgetByName('sname');     
        const content = (
            <div>
                <p style={{fontWeight:600}}>1、明确系统的项目</p>
                <p>采用A+B的形式。</p>
                <p>A：系统名称；</p>
                <p>B：项目对源系统的影响（新建、功能提升（具体功能）、N.0、重构））</p>
                <p>举例：财富系统4.0项目、个人手机银行5.0项目、贵宾权益系统新建项目、网银系统功能提升（增加结售汇功能）、银保通系统重构项目。</p>
                <p style={{fontWeight:600}}>2、明确产品的项目：</p>
                <p>采用A+B的形式。</p>
                <p>A：产品全称 ；</p>
                <p>B：项目对原有产品的影响：新增、完善、N期 </p>
                <p>举例：网银贷产品新增、网银贷产品完善（变更企业准入规则）、网银贷产品二期。</p>
                <p style={{fontWeight:600}}>3、明确业务场景、多项目组成的项目群：</p>
                <p>采用A+B的形式。</p>
                <p>A：描述业务场景</p>
                <p>B：此项目在该场景中的组成部分或涉及系统。</p>
                <p>举例：人行261号文改造（黑名单校验）、反洗钱客户信息改造（CIF唯一性）、网络DNS改造（ESB系统）。</p>
            </div>
        )   
        if(sname){
            sname.field.props.addonAfter = (
                <div className='ant-select ant-select-enabled' 
                    style={{margin:'-5px -7px',width: '70px',lineHeight:'32px'}}
                    >

                    <VpPopover style={{ width: 70 }} content={content} autoAdjustOverflow={true} 
                        title="命名规范" trigger="click" >

                        <div style={{ cursor: 'pointer' }}>命名规范</div>
                    </VpPopover>

                </div>
            )
        }
        //暂停状态的项目 才显示‘暂停原因’字段
        let pauseReason = formData.findWidgetByName('sztyy');
        let istatusid = formData.findWidgetByName('istatusid');
        const statusID = istatusid.field.fieldProps.initialValue
        if(statusID != 83 && pauseReason) {
            pauseReason.field.hidden = true
        }
        
    }

    getCustomeButtons(){
        let buttons = this.props.buttons;
        if(!buttons){
            //如果没有自定义按钮，用默认的
            buttons = [];
            if(this.state.entityrole !== false){//用户对表单是读状态时
                buttons.push("ok"); //默认的保存按钮，见Form.jsx中定义
                if(this.props.add){
                    //新增页面时
                    buttons.push("saveAndNew");
                }
                if(this.state.flowtype == '3' && (this.props.add || this.props.entityrole) ){
                    //如果实体是工作流类，且是添加（this.props.add=true)或编辑时(this.props.entityrole=true)
                    if(!this.state.isFlowed){
                        buttons.push("saveAndFlow");
                    }
                }else{
                    buttons.push("status");
                }
            }
            buttons.push("cancel");

            if(vp.cookie.getTkInfo('userid')==1){
                buttons.push({
                    name: "modify",
                    text: "TFS项目同步",
                    validate: false,
                    handler: this.xxx,
                    className: `vp-btn-br`,
                    size: "default"
                });
            }
            // if(this.state.isshowoldbutton){
            //     buttons.push({
            //         name: "lookOldProjectFlow",
            //         text: "查看老项目流程",
            //         handler: this.Look,
            //         className: `vp-btn-br`,
            //         size: "default"
            //     });
            // }
        }
        return buttons;
    }
    Look = () => {
        console.log("iid:",this.props.iid);
        console.log("userid:",vp.cookie.getTkInfo('userid'));
        const w=window.open('about:blank');
        //w.location.href='http://10.160.2.187:9080/project/timeOutLogin.jsp?id='+this.props.iid+'&userid='+vp.cookie.getTkInfo('userid');//测试环境
        w.location.href='http://10.116.147.167:8088/project/timeOutLogin.jsp?id='+this.props.iid+'&userid='+vp.cookie.getTkInfo('userid');//生产环境
        this.setFormSubmiting(false);
    }
    xxx = () => {
        console.log(this.props.iid);
        let _this = this;
        vpQuery('/{bjyh}/tfsrest/tfsxmsq', {
            iid: _this.props.iid
        }).then((response) => {
                if (response == '0') {
                    VpAlertMsg({
                        message:"消息提示",
                        description:"TFS项目同步成功。",
                        type:"success",
                        closeText:"关闭",
                        showIcon: true
                    }, 5)
                }else{
                    VpAlertMsg({
                        message: "消息提示",
                        description: "TFS项目同步失败。",
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                }
                _this.setFormSubmiting(false);
                //_this.loadFormData();
        }).catch(function (err) {
            VpAlertMsg({
                message: "消息提示",
                description: "TFS项目同步失败。",
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5);
            _this.setFormSubmiting(false);
        });
    }

    scrption = (formData,element_,sysmc,sysbh,dvalue)=>{
        let lastnum = this.state.lastnum||0
        let index_ = 1
        for (let index=1; index <= dvalue; index++) {
            formData.insertNewWidget({
                groupIndex:sysbh[1].groupIndex,
                fieldIndex:element_.fieldIndex+index_
                },element_.field.props.field_name==='stxsm'?sysbh[index*1].field:sysbh[lastnum*1+1+index-1].field)
            formData.insertNewWidget({
                groupIndex:sysbh[1].groupIndex,
                fieldIndex:element_.fieldIndex+index_+1
                },element_.field.props.field_name==='stxsm'?sysmc[index*1].field:sysmc[lastnum*1+1+index-1].field)
            index_=index_+2
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

    onSaveSuccess(formData,btnName){
        let _this = this
        if (btnName == 'ok') {
            console.log(this.props.iid);
            let _this = this;
            vpQuery('/{bjyh}/tfsrest/tfsxmsq', {
                iid: _this.props.iid
            }).then((response) => {
                    if (response == '0') {
                    }else{
                    }
                    _this.setFormSubmiting(false);
                    //_this.loadFormData();
            }).catch(function (err) {
            });
            //项目标签中标注为“京匠-”前缀的项目，自动设置为各项目经理的关注项目
            vpQuery('/{bjyh}/careProject/addCare', {
                objectid: _this.props.iid
            }).then((response) => {
                
            })
        }
    }


    onBeforeSave(formData, btnName) {
        let _this = this ;
        let sparam = JSON.parse(formData.sparam);
        let ixmsftzcglgy = sparam.ixmsftzcglgy;
        if(ixmsftzcglgy != this.state.xmsftzcglgyOldVal ){
            let userName = vp.cookie.getTkInfo('nickname');
            let date = new Date();
            let y = date.getFullYear();
            let m = date.getMonth()+1;
            let d = date.getDate() ; 
            let hh = "";
            if(sparam.sbz != ""){
                hh = "\n";
            }
            if(ixmsftzcglgy == 1*1 ){
                formData.setFieldsValue
                sparam.sbz = sparam.sbz + hh + userName + "标记了项目停滞超过2个月，日期："+y+"年"+m+"月"+d+"日";               
            }else if(ixmsftzcglgy == 0*1 ){
                sparam.sbz = sparam.sbz + hh + userName + "取消了项目停滞超过2个月，日期："+y+"年"+m+"月"+d+"日";                 
            }
            _this.props.form.setFieldsValue({
                'sbz':sparam.sbz
            })
            _this.setState({
                xmsftzcglgyOldVal : ixmsftzcglgy
            })
            formData.sparam=JSON.stringify(sparam)
        }
        
    }
}
projectForm = DynamicForm.createClass(projectForm);
export default projectForm;