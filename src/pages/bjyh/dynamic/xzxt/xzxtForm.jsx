import React, { Component } from "react";

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg, VpConfirm } from "vpreact";
import moment from "moment";
import { vpAdd } from "vpreact/public/Vp";

//新增系统
class xzxtForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
    }

   // 加载成功后执行
   onDataLoadSuccess = formData => {
        let scode = formData.findWidgetByName('scode');
        scode.field.props.disabled = true;
        scode.field.fieldProps.rules[0].required=false;
    }


    // 保存前校验
    onBeforeSave(formData, btnName) {
        let _this = this;
        let sparam = JSON.parse(formData.sparam);
        return  new Promise(resolve =>{
            let flag = true;
            vpAdd('/{bjyh}/xzxt/checkXzxt', { sparam: JSON.stringify(sparam), method: 'chenkxitongmingcheng' }).then((response1) => {
                //校验编号
                if (response1.success == '1') {
                    VpAlertMsg({
                        message: "消息提示",
                        description: "系统名称已经在其他系统中存在，请核实后再填写。",
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    flag = false
                    resolve(flag)
                }else{
                    sparam.scode = response1.scode;
                    formData.sparam = JSON.stringify(sparam);
                    resolve(flag)
                }
            })
        })
    }
}
xzxtForm = DynamicForm.createClass(xzxtForm);
export default xzxtForm;