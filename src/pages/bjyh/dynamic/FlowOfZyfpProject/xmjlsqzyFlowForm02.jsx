import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';

import {
    formDataToWidgetProps
} from '../../../templates/dynamic/Form/Widgets';
import { common, validationRequireField, singleInputFill,fileValidation } from '../code';
import {findWidgetByName} from '../../../templates/dynamic/Form/Widgets'
import {findFiledByName} from 'utils/utils';
/**
 * 项目经理申请资源
 */
class ywdbtjsqFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
    }

    // 加载成功后执行
    onDataLoadSuccess = (formData,handlers) => {
        let _this = this;
        console.log('_this',_this);
        console.log('_formData',formData,handlers);

        let szjtjkf = formData.findWidgetByName("szjtjkf");
        let szjtjkfval = szjtjkf.field.fieldProps.initialValue
        let stcfh = formData.findWidgetByName("stcfh");
        let stcfhval = stcfh.field.fieldProps.initialValue
        
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
    }


    /**
     * 默认选中按钮，并显示对应的 预设处理人 选项
     */
    onGetFormDataSuccess = data => {
        let formData = data.form.groups
        let handlers = data.handlers
        let szjtjkf = findFiledByName(data.form,'szjtjkf')//直接提交开发
        let stcfh = findFiledByName(data.form,'stcfh')//提出分行bb
        let scondition = findFiledByName(data.form,'scondition')
        //控制住显示的按钮
        if (szjtjkf.field.widget.default_value == '1') {
            data.scondition = 'SYSF'
            scondition.field.widget.load_template.map(item=>{
                if(item.value!='SYSF' && item.value!='SYSG'){
                    item.hidden=true
                    scondition.field.widget.default_value='SYSF'
                }
            })
        } else {
            if (stcfh.field.widget.default_value == '1') {
                data.scondition = 'bb'
                scondition.field.widget.load_template.map(item=>{
                    if(item.value!='bb' && item.value!='SYSG'){
                        item.hidden=true
                        scondition.field.widget.default_value='bb'
                    }
                })
            } else {
                data.scondition = 'aa'
                scondition.field.widget.load_template.map(item=>{
                    if(item.value!='aa' && item.value!='SYSG'){
                        item.hidden=true
                        scondition.field.widget.default_value='aa'
                    }
                })
            }
        }

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
        let scondition = e.target.value
        let handlers = this.state.handlers

        let condition = ""
        let newdata = handlers ? handlers.filter((item) => {
            let flag
            switch (scondition) {
                case 'SYSG':
                    flag = item.flag == scondition || item.condition == null || item.condition == ''
                    break;
                case 'bb':
                    flag = item.flag == scondition || item.condition == null || item.condition == ''||(item.condition+"'").indexOf("'6'")!=-1
                    break;
                case 'aa':
                    flag = item.flag == scondition || item.condition == null || item.condition == ''||(item.condition+"'").indexOf("'6'")!=-1
                    break;
                case 'SYSF':
                    flag = item.flag == scondition || item.condition == null || item.condition == ''
                    break;
                default:
                    flag = item.flag == scondition || item.condition == null ||(item.condition+"'").indexOf("'6'")!=-1
                    break;
            }
            if(flag){
                condition = item.condition;
            }
            return flag
        }) : []
        this.state.condition = condition;
        newdata = newdata.map(x => {
            return {
                all_line: 2,
                field_label: x.stepname,
                field_name: x.stepkey,
                irelationentityid: x.irelationentityid,
                disabled: x.lastuserflag == 1 && !(x.ids == null || x.ids == '') ? true : false,
                //url: "vfm/ChooseEntity/ChooseEntity",
                url:'bjyh/templates/Form/ChooseEntity',
                groupids:x.groupids||"",//新增按流程用户组用户过滤用户选择
                condition:x.searchCondition||'',//增加查询条件
                ajaxurl:x.ajaxurl,//模态框自定义url
                validator: { message: "输入内容不能为空！", required: true },
                widget: { default_value: x.ids, default_label: x.names },
                widget_type: "multiselectmodel"
            }
        });

        //将数据转换成新
        let flowHandlerGroupData = formDataToWidgetProps({
            groups:[{
                fields:newdata
            }]
        },this);

        let formData = this.state.formData

        /* 去除非选中分支处理人校验 */
        let handlerGroups = null;
        formData.groups.map(x => {
            if (x.group_code == "flow_handler") {
                handlerGroups = x;
            }
        });
        if(handlerGroups == null){
            //没有处理人节
            return;
        }
        if(handlerGroups.fields){
            //清空处理人字段
            const form = this.props.form;
            handlerGroups.fields.forEach((field)=>{
                form.getFieldProps(field.field_name,{
                    rules:[] //清空校验
                })
                form.getFieldProps(field.field_name+"_label",{
                    rules:[] //清空校验
                })
            });
        }
        formData.groups = formData.groups.map(x => {
            if (x.group_code == "flow_handler") {
                x.fields = flowHandlerGroupData.groups[0].fields
                return x
            }
            return x
        })
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
            if (fbxmyjtrje > 0) {
                if (iyspc <= 0) {
                    VpAlertMsg({
                        message: "消息提示",
                        description: "本项目预计投入费用大于0，请添加预算信息，准确预算信息请在商务管理系统中查询！",
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    return false
                }
            }
            singleInputFill(formData, btnName, 'sxmjlclyj', true)
            if(scondition != 'SYSG'){
                return new Promise(resolve => {
                    let flag = true;
    
                    vpAdd('/{bjyh}/xmsq/checkYs', { sparam: JSON.stringify(sparam), method: 'chenknamecodecuowu' }).then((response1) => {
                        //校验编号
                        if (response1.success == '1') {
                            VpAlertMsg({
                                message: "消息提示",
                                description: response1.message,
                                type: "error",
                                onClose: this.onClose,
                                closeText: "关闭",
                                showIcon: true
                            }, 5);
                            flag = false
                            resolve(flag)
                        }
                        if (response1.success == 0) {
                            vpAdd('/{bjyh}/xmsq/checkYs', { sparam: JSON.stringify(sparam), method: 'chenknamecodecuowu1' }).then((response2) => {
                                //检验编号，名称和一致性
                                if (response2.success == '1') {
                                    VpAlertMsg({
                                        message: "消息提示",
                                        description: response2.message,
                                        type: "error",
                                        onClose: this.onClose,
                                        closeText: "关闭",
                                        showIcon: true
                                    }, 5);
                                    flag = false
                                    resolve(flag)
                                }
                                if (response2.success == '0') {
                                    //校验金额
                                    vpAdd('/{bjyh}/xmsq/checkYs', { sparam: JSON.stringify(sparam), method: 'chenkmoney' }).then((response3) => {
                                        if (response3.success == '1') {
                                            VpAlertMsg({
                                                message: "消息提示",
                                                description: "预算金额不足，请重新填写项目预算金额",
                                                type: "error",
                                                onClose: this.onClose,
                                                closeText: "关闭",
                                                showIcon: true
                                            }, 5);
                                            flag = false
                                            resolve(flag)
                                        }
                                        if (response3.success == '0') {
                                            //附件验证
                                            flag = fileValidation(_this, btnName, "xmsq", "ywdbtjsq");
                                            resolve(flag)
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            }
            
        }
    }

}
ywdbtjsqFlowForm = FlowForm.createClass(ywdbtjsqFlowForm);
export default ywdbtjsqFlowForm;