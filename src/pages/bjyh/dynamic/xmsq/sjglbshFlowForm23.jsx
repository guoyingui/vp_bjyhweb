import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import { vpQuery, vpAdd, VpAlertMsg, VpMWarning } from 'vpreact';
import { formDataToWidgetProps } from '../../../templates/dynamic/Form/Widgets';
import { validationRequireField, singleInputFill, initHiddenColumn, xmsqHiddenColumn, initHiddenColumn_history, initHiddenColumn_swxx } from '../code';
import { findFiledByName } from 'utils/utils';

//数据管理部审核
var iyspctemp = '0';

/**
 * 项目经理申请资源
 */
class sjglbshFlowForm23 extends FlowForm.Component {
    constructor(props) {
        super(props);
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
    }
    componentWillMount() {
        super.componentWillMount()
    }

    onFormRenderSuccess(formData) {
        initHiddenColumn(iyspctemp)
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

    // 加载成功后执行
    onDataLoadSuccess = (formData, handlers) => {
        // 删除生产环境的bjyhweb的div标签元素
        let devflag = window.vp.config.URL.devflag;
        if(!devflag){
            if(document.getElementById("bjyhweb")){
                document.getElementById("bjyhweb").remove()
            }
        }
        let _this = this;
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
        //增加项目标签2 显示项目标签
        let ixmbq2 = formData.findWidgetByName('ixmbq2')
        ixmbq2 && (ixmbq2.field.props.label = "项目标签")
        let ixmbq1 = formData.findWidgetByName('ixmbq1')
        ixmbq1 && (ixmbq1.field.props.label = "项目标签")
        //页面数据组装完成后，根据分支条件默认值。设置 是否数据管理部退回 字段值。
        let scondition=formData.findWidgetByName("scondition");
        if(scondition){
            let sconditionVal=scondition.field.fieldProps.initialValue;
            //审批意见为拒绝。将是否数据管理部退回字段设置为是。为项目经理确认步骤设置默认条件分支做准备
            if(sconditionVal=='REFUSE'){
                this.props.form.setFieldsValue({'isfsjglbth':'1'})
            }else{
                this.props.form.setFieldsValue({'isfsjglbth':'2'})
            }
            //设置 是否架构师退回 为空
            this.props.form.setFieldsValue({'isfjgsth':''})
        }
    }
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'REFUSE' ? true : false;
        // 拒绝时将sjgsshyj设置为必填
        validationRequireField(_this, 'ssjglbshyj', flag);
        //点击流程分支时进行设置 是否数据管理部退回 字段的值。拒绝时设置为  是。
        if(flag){
            this.props.form.setFieldsValue({'isfsjglbth':'1'})
        }else{
            this.props.form.setFieldsValue({'isfsjglbth':'2'})
        }
        //设置 是否架构师退回 为空，为保证如果两个分支各有多次退回。在项目经理审核步骤始终只有一个字段有值。这样就好判断是哪个步骤拒绝的。良苦用心，望你深知。
        this.props.form.setFieldsValue({'isfjgsth':''})
    }
    async onBeforeSave(formData, btnName) {
        console.log("数据管理部提交表单",formData)
        //将审批将审批意见同步至审批日志
        singleInputFill(formData, btnName, 'ssjglbshyj', true)
        let piid=formData.piid;
        let staskid=formData.staskid;
        let iobjectid=formData.iobjectid;
        let sparam=JSON.parse(formData.sparam)
        let scondition = sparam.scondition;
        //如果审批结果是拒绝，则需要一键否决，如果并行分支流程在架构管理室审核那，则需要自动提交到下一步。提交到下一步后，才能进行本步骤的提交。这是特殊定制。
        if(scondition=='REFUSE'){
            return await vpQuery('/{bjyh}/xmsq/autoCompleteTask',{
                piid:piid,
                iobjectid:iobjectid,
                staskid:staskid
            }).then(res=>{
                console.log(11111)
            })
        }
        //获取流程正在运行的步骤
    }
    //右上角弹框提示
    alertMsg = (desc, type, message) => {
        return (
            VpAlertMsg({
                message: message || "消息提示",
                description: desc || '!',
                type: type || 'info',
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        )
    }
}
sjglbshFlowForm23 = FlowForm.createClass(sjglbshFlowForm23);
export default sjglbshFlowForm23;