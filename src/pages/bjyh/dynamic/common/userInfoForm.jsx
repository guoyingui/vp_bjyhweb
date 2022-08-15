import React, { Component } from "react";
import DynamicForm from '../../../templates/dynamic/DynamicForm/DynamicForm';
import {vpAdd, VpAlertMsg, vpDownLoad} from "vpreact";
import ModUserButton from "pages/templates/dynamic/Flow/ModUserButton";

/**
 * 此页面为每个实体属性公共页面
 */
class userInfoForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
    }

    onBeforeSave = (formData, btnName) => {
        let sparam = JSON.parse(formData.sparam)

        // console.log(sparam.sloginname, sparam.rldjzbm)
        return new Promise(resolve => {
            vpAdd('/{bjyh}/hxcsystem/userSaveAction',{
                sloginname: sparam.sloginname, dptIds: sparam.rldjzbm
            }).then(res=>{
                // console.log('res', res)
                if(res){
                    resolve(res.data)
                } else {
                    resolve(false)
                }
            })
        })
    }
    getCustomeButtons() {
        let buttons = this.props.buttons;
        if(!buttons){
            //如果没有自定义按钮，用默认的
            buttons = [];
            buttons.push("ok");
                buttons.push({
                    name: "sendemail",
                    text: "发送新增用户成功邮件",
                    validate: true,
                    handler: this.onSaveAndSendMail,
                    //type:'primary',
                    className: `vp-btn-br`,
                    size: "default"
                });
            if(!this.props.add) {
                buttons.push({
                    name: "updatesendemail",
                    text: "发送更新用户成功邮件",
                    validate: true,
                    handler: this.onUpdateAndSendMail,
                    //type:'primary',
                    className: `vp-btn-br`,
                    size: "default"
                });
            }
            buttons.push("cancel");
        }
        return buttons;
    }
    onUpdateAndSendMail = (formData) => {
        let btnName = "ok";
        this.submit(btnName,{
            onSaveSuccess:({mainFormSaveReturnData,btnName}) => {
                let semail = formData.semail;
                if(semail!=undefined && semail!='') {
                    VpAlertMsg({
                        message: "消息提示",
                        description: '操作成功！',
                        type: "success",
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                }
                this.setState({
                    newiid:mainFormSaveReturnData.data.iid,
                });
                this.onSaveSuccess(mainFormSaveReturnData,btnName)
                this.updatesendemail(formData)
                if(this.props.add && this.state.closeAfterAdd) {//新建保存自动关闭
                    this.props.closeRightModal && this.props.closeRightModal();
                }
            },
            onSave:(formData,successCallback,errorCallback) => {
                this.onSave(formData,btnName,(data) => {
                    successCallback(data.data.iid,data);
                })
            }
        })
    }
    onSaveAndSendMail = (formData) => {
        let btnName = "ok";
        this.submit(btnName,{
            onSaveSuccess:({mainFormSaveReturnData,btnName}) => {
                let semail = formData.semail;
                if(semail!=undefined && semail!='') {
                    VpAlertMsg({
                        message: "消息提示",
                        description: '操作成功！',
                        type: "success",
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                }
                this.setState({
                    newiid:mainFormSaveReturnData.data.iid,
                });
                this.onSaveSuccess(mainFormSaveReturnData,btnName)
                this.sendemail(formData)
                if(this.props.add && this.state.closeAfterAdd) {//新建保存自动关闭
                    this.props.closeRightModal && this.props.closeRightModal();
                }
            },
            onSave:(formData,successCallback,errorCallback) => {
                this.onSave(formData,btnName,(data) => {
                    successCallback(data.data.iid,data);
                })
            }
        })
    }
    sendemail = (formData) => {
        let scode = formData.scode;
        let spassword = formData.spassword;
        let sname = formData.sname;
        let sloginname = formData.sloginname;
        let semail = formData.semail;
        if(semail==undefined){
            VpAlertMsg({
                message: "消息提示",
                description: "该用户没有保存或者配置邮箱地址",
                type: "info",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5);
            this.setFormSubmiting(false);
            return;
        }
        vpAdd('/{bjyh}/hxcsystem/sendEmailByUserid',{
            spassword:spassword,
            sloginname:sloginname,
            scode:scode,
            eamil:semail,
            sname:sname
        }).then((response)=>{
            console.log("sendEmailByUserid===response",response.data.msg);

        })
    }
    updatesendemail= (formData) => {
        let scode = formData.scode;
        let spassword = formData.spassword;
        let sname = formData.sname;
        let sloginname = formData.sloginname;
        let semail = formData.semail;
        if(semail==undefined){
            VpAlertMsg({
                message: "消息提示",
                description: "该用户没有保存或者配置邮箱地址",
                type: "info",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5);
            this.setFormSubmiting(false);
            return;
        }
        vpAdd('/{bjyh}/hxcsystem/updatesendEmailByUserid',{
            spassword:spassword,
            sloginname:sloginname,
            scode:scode,
            eamil:semail,
            sname:sname
        }).then((response)=>{
            console.log("updatesendEmailByUserid===response",response.data.msg);

        })
    }

}

userInfoForm = DynamicForm.createClass(userInfoForm);

export default userInfoForm;