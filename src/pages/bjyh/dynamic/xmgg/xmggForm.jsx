import React, { Component } from "react";
import { common } from '../code';
import DynamicForm from '../../../templates/dynamic/DynamicForm/DynamicForm';

/**
 * 公告
 */
class xmggForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
    }
    /**
        * 表单数据加载成功后
        * @param formData
        */
    onDataLoadSuccess = formData => {
        let _this = this
        this.basicsInfoAuto(_this, formData)
    }
    /**
       * 自动带出基础信息
       * @param _this
       * @param formData
       */
    basicsInfoAuto = (_this, formData) => {
        // 若存在 发布人：自动带出为当前系统登录人
        let ipublish = formData.findWidgetByName('ipublish')
        if (ipublish) {
            _this.props.form.setFieldsValue({
                'ipublish': common.userid,
                'ipublish_label': common.nickname
            })
        }
         // 默认当前时间
         let dproposetime = formData.findWidgetByName('dproposetime')
         if (dproposetime) {
             _this.props.form.setFieldsValue({
                 'dproposetime': common.currentDate
             })
         }
    }
    // getDefaultButtons(){
    //     let _this =this;
    //     let superDefBtns = super.getDefaultButtons();
    //    console.log(superDefBtns)
    //    if(superDefBtns.ok){
    //     superDefBtns.ok.handler = this.handleSave;
    // }
    // if(superDefBtns.cancel){
    //     superDefBtns.cancel.handler = this.cancelModal;
    // }
    // let constDefBtns = {
    //     ...superDefBtns,
    //     "saveAndFlow":{
    //         name:'saveAndFlow',
    //         text:'保存并发起',
    //         className:"vp-btn-br",
    //         handler:this.handleSaveAndFlow
    //     },"saveAndNew":{
    //         name:'saveAndNew',
    //         text:'保存并新建',
    //         className:'vp-btn-br',
    //         handler:this.handleSaveAndNew,
    //     }
    // }
    // return constDefBtns;
    // }
}

xmggForm = DynamicForm.createClass(xmggForm);

export default xmggForm;