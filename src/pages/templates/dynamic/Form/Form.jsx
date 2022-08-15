import React, { Component } from 'react';

import {
    VpFormCreate, VpInput, VpForm, VpRow, VpCol, VpFCollapse, VpPanel, FormItem, VpButton,VpAlertMsg
} from 'vpreact';

import { requireFile, formatDateTime } from 'utils/utils';
import { getWidget } from "./Widgets";
import { setContext } from 'reduxs/actions/action';
import { connect } from 'react-redux';
import { mergeButtons } from "../utils";
import { createSubForm } from "./SubForm";

import { randomKey } from "../utils";

/**
 * 表单组件
 * 用法：
 *  <Form
 form={this.props.form}  //调用VpFormCreate获取到的表单
 formData={this.state.formData} //表单数据，表单数据说明见下文
 handleOk={this.handleSave} //保存按钮事件
 buttons={this.getButtons()} //自定义按钮，参见：getButtons 方法说明
 handleCancel={this.cancelModal}> //取消按钮事件
 noFooter={true/false} //是否显示页脚，也就是按钮栏
 </Form>
 *
 *  表单数据（formData）的说明：
 Form控件可以识别的数据格式是：
 {"groups": [{
        //组定义，可以定义多个组
        "group_label": "表单类型1",
        "group_type": 1, //组类型，0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
        "fields": [{
               //单个控件定义，每个控件的数据格式不一样，具体控件数据格式详见：Widgets中的控件定义，如selectmodel的控件数据格式如下
               widget_type:'selectmodel', //控件类型
               field_name:"sname", //控件名称，英文名称，跟表字段对应的
               all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
               props:{ //控件自身属性
                    labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
                    wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
                    readOnly:true/false, //是否只读
                    label:'名称',  //label值
                    initialName:'管理员',  // 初始值对应的文字描述
                    irelationentityid:2, //绑定的实体id
                    modalProps:{ //模型属性
                        url:"templates/ChooseEntity", //弹出的选择框页面
                    },
                },
                fieldProps:{ //控件在表单中的属性
                    rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
                    initialValue : '1' //默认值，
                    onChange: function(value){}  //控件值变化时触发
                }
            },...]
        }]
     }
 如果是实体表单渲染时需要将实体表单定义的数据格式转换成Form组件能识别的数据格式
 实体表单数据格式一般是
 {"groups": [{
        "group_label": "表单类型1",
        "group_type": 1,
        "fields": [{
                //单个字段定义
                "field_name": "seldept",
                "widget_type": "selectmodel",
                "url": "templates/ChooseEntity",
                "iconstraint": 1,
                "validator": {},
                "iwidth": 0,
                "field_label": "部门1",
                "all_line": 1,
                "itype": 0,
                "irelationentityid":1,
                "widget": {

                }
            },...]
        }]
     }

 Widgets中提供了将实体定义的表单数据转换成Form表单需要的数据格式，转换工具 import {formDataToWidgetProps} from 'Widgets'。具体用法如下：
 import {formDataToWidgetProps} from 'Widgets';
 vpQuery('/{vpplat}/vfrm/entity/getform', {参数..}).then(function (response) {
       a. 通过ajax获取实体表单定义数据
       let data = response.data.form

       b. 将实体表单定义数据转换成表单数据(即data.form格式)
         经过formDataToWidgetProps转换后，数据格式（即formData的数据格式）是
        let formData = formDataToWidgetProps(data,_this);
    });
 *
 *
 */
class Form extends Component {
    /**
     *
     * @param props
        {
          formData:[{
            "groups": [{
                "group_label": "表单类型1", //组标题
                "group_type": 1, //组类型，0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                "fields": [{
                    widget_type:widget_type, //控件类型
                    field_name:otherProps.field_name, //控件名称，英文名称，跟表字段对应的
                    all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
                    props:{}, //组件属性 具体控件属性看Widgets.jsx中注册的控件说明
                    fieldProps:{} //组件表单属性，如rules, initialValue 具体控件属性看Widgets.jsx注册的控件说明
                }]
            }]
          }],

      }
     */
    constructor(props) {
        super(props);
        this.state = {
            activeKeys: []
        }
        this.nameid = 1; //控件唯一名称，给未命名的控件用的

        this.subFormList = [];
        this.subFormList.getSubForm = (asyncSave) => { //获取同步或异步保存的表单
            let subform = [];
            this.subFormList.forEach((item, index) => {
                if (item.options.asyncSave === asyncSave) {
                    subform.push(item);
                }
            });
            return subform;
        }

        this.registerSubForm = this.registerSubForm.bind(this);
        this.handlerSave = this.handlerSave.bind(this); //保存按钮处理
        this.getButtons = this.getButtons.bind(this);
        this.onPanelChange = this.onPanelChange.bind(this);
        this.setFormSubmiting = this.setFormSubmiting.bind(this);
        this.cancelModal = this.cancelModal.bind(this); //取消按钮处理

        this.props.onRef && this.props.onRef(this);

        this._contextid = this.props._contextid || randomKey();
    }

    /**
     * 注册子表单
     * @param SubForm
     * @param options
     */
    registerSubForm(fieldName, SubForm, options) {
        let defOpts = {
            asyncSave: true, //是否是同时保存主子表，如果为true,则子表单类必须实现getFormValues接口,如果为false,则实现onSave接口
            onValidate: "onValidate", //如果默认的onValidate与类有冲突时，可以使用自定义名称替换onValidate函数
            onSave: "onSave",  //如果默认的onSave与类有冲突时，可以使用自定义名称替换onSave函数
            getFormValues: "getFormValues" //如果默认的getFormValues与类有冲突时，可以使用自定义名称替换getFormValues函数
        }

        let finded = -1;
        //去重，避免重复注册
        for (var i = 0; i < this.subFormList.length; i++) {
            let item = this.subFormList[i];
            if (item.fieldName === fieldName) {
                finded = i;
                break;
            }
        }
        if (finded > -1) {
            this.subFormList[finded] = {
                fieldName: fieldName,
                object: SubForm,
                options: { ...defOpts, ...options }
            }
        } else {
            this.subFormList.push({
                fieldName: fieldName,
                object: SubForm,
                options: { ...defOpts, ...options }
            });
        }
        return this;
    }

    /**
     * 渲染组件
     * @param options
     * @return {*}
     */
    createWidget(options) {
        options = { ...options }; //避免污染原始数据
        if (!options.field_name) {
            options.field_name = "field" + this.nameid++;
        }
        let widget = getWidget(options.widget_type, options, this);
        let style = {};
        if (options.hidden) {
            style["display"] = "none";
        }
        return (
            <VpCol key={options.field_name} span={(options.all_line == 1) ? 12 : 24} style={style}>
                {widget}
            </VpCol>
        );
    }

    componentWillMount() {
        
    }

    /**
     * 获取表单渲染数据
     * @returns {*}
     */
    getFormRenderData() {
        return this.props.formData;
    }

    showFooter() {
        return !this.props.noFooter;
    }
    componentDidMount() {
        if (this.props.onLoad) {
            this.props.onLoad()
        }
        this.getButtons();
    }
    componentWillReceiveProps(nextProps) {
    }
    componentWillUpdate(){
        //this.getButtons();
    }
    /**
     * 设置成表单不加载状态
     */
    setFormSubmiting(flag) {
        this.props.setFormSubmiting && this.props.setFormSubmiting(this._contextid, flag);
    }

    /**
     * 获取表单提交状态
     * @returns {*}
     */
    getFormSubmiting() {
        if (!this.props.store || !this.props.store[this._contextid]) {
            return false;
        }
        return !!this.props.store[this._contextid].submiting;
    }


    /**
     * 提交表单
     * @param btnName 提交表单时按钮
     * @param options { //调用提交表单选项
     *
     *      保存动作
     *      @param btnName 触发保存的按钮
     *      @param formData 表单数据
     *      @param successCallback 保存成功后回调，函数写法如下
     *          @param iid 保存成功后的表单数据主键值
     *          @param saveReturnData 保存成功后的表单数据
     *          function(iid,saveReturnData){
     *          }
     *
     *      @param errorCallback 保存失败后回调，函数写法如下
     *          function(){
     *          }
     *     onSave:function(formData,successCallback,errorCallback){
     *     }
     *
     *     主表单保存成功 （在全部保存成功后，包括子表单保存函数触发后）,
     *     如果有异步保存的子表单保存失败，也会触发此函数，此时需要开发人员做好补偿措施，避免造成重复保存
     *     @param saveReturnData{ //保存子表单、表单保存成功后传递的数据
                    iid, 保存成功后表单数据iid
                    btnName,  触发按钮
                    formData, 保存前主表单数据
                    mainFormSaveReturnData 保存后的主表单数
                }
     *     onSaveSuccess:function(saveReturnData){
     *     }
     *
     *     主表单保存失败，如果有异步保存的子表单保存失败，不会触发onSaveError函数
     *     onSaveError:function(){
     *
     *     }
     * }
     */
    submit(btnName, options) {
        //获取子表单值
        let formData = this.getFormValues();
        let asyncSaveForm = this.subFormList.getSubForm(true);
        if (asyncSaveForm.length) {
            //有子表单是，获取需要同步保存的子表单数据
            let getSubFormData = (index) => {
                if (index === asyncSaveForm.length) {
                    //最后一个子表单时
                    this.doSave(btnName, formData, options);
                    return;
                }

                let subForm = asyncSaveForm[index];
                let getSubFormValuesFun = subForm.object[subForm.options.getFormValues];
                if (getSubFormValuesFun) {
                    getSubFormValuesFun.call(subForm.object, {
                        btnName: btnName
                    }, (subFormData) => {
                        formData[subForm.fieldName] = JSON.stringify(subFormData);
                        getSubFormData(++index);
                    });
                } else {
                    getSubFormData(++index);
                }

            }
            getSubFormData(0);
        } else {
            this.doSave(btnName, formData, options);
        }
    }

    /**
     * 保存表单,
     * 1. 先保存主表表单，主表表单保存成功后，调用options.onMainFormSaveSuccess
     * 2. 主表单保存成功后，返回保存后的数据iid及新的表单渲染数据
     * 2. 接着保存各种需要异步保存的子表单：调用子表单onSave方法，将主表单iid传递给子表单
     * @param formData
     */
    doSave(btnName, formData, options) {
        if (options.onSave) {
            //全部保存成功后触发
            let onSaveSuccess = (saveReturnData) => {
                this.setFormSubmiting(false);
                //保存成功后，触发子表单保存成功方法
                let asyncSaveForm = this.subFormList.getSubForm(true);
                asyncSaveForm.forEach((item) => {
                    item.object[item.options.onMainFormSaveSuccess] && item.object[item.options.onMainFormSaveSuccess](saveReturnData);
                });
                options.onSaveSuccess && options.onSaveSuccess(saveReturnData)
            }

            let onSaveError = () => {
                this.setFormSubmiting(false);
                options.onSaveError && options.onSaveError()
            }
            /**
             * 保存主表单成功后触发
             * @param iid 保存后的数据iid
             * @param mainFormSaveReturnData 主表单保存后返回的数据
             */
            let successCallback = (iid, mainFormSaveReturnData) => {
                let saveReturnData = { //保存子表单、表单保存成功后传递的数据
                    iid, btnName, formData, mainFormSaveReturnData
                }
                //更新表单iid
                let unAsyncSaveForm = this.subFormList.getSubForm(false);
                if (unAsyncSaveForm.length) {
                    //有子表单需要异步保存的
                    let saveSubFormErrors = [];
                    let doSubFormSave = (index) => {

                        if (index === unAsyncSaveForm.length) {
                            //最后一个子表单保存完成
                            onSaveSuccess({
                                ...saveReturnData,
                                saveSubFormErrors
                            });
                            return;
                        }

                        let subForm = unAsyncSaveForm[index];
                        let subFormSaveFun = subForm.object[subForm.options.onSave];
                        if (subFormSaveFun) {
                            subFormSaveFun.call(subForm.object, saveReturnData, function () {
                                //子表单保存成功后调用
                                doSubFormSave(++index);
                            }, function () {
                                //子表单保存失败后调用
                                saveSubFormErrors.push(subForm)
                                //只要主表单保存成功，子表单保存失败不影响其它子表单保存
                                doSubFormSave(++index);
                            })
                        } else {
                            doSubFormSave(++index);
                        }
                    }
                    doSubFormSave(0);
                } else {
                    onSaveSuccess(saveReturnData);
                }
            }
            let errorCallback = function () {
                this.setFormSubmiting(false);
            }
            options.onSave(formData, successCallback, onSaveError);
        }
    }

    /**
     * 处理保存按钮时，兼容以前版本
     */
    handlerSave(values, _this) {
        let that = this
        if (this.props.handleOk) {
            this.submit("ok", {
                onSave: (formData, successCallback, errorCallback) => {
                    that.props.handleOk(formData, _this);
                    successCallback();
                }
            });
        }
    }


    /**
     * 取消按钮
     */
    cancelModal() {
        if (this.props.handleCancel) {
            this.setFormSubmiting(false);
            this.props.handleCancel();
        }
    }

    /**
     * 获取表达数据
     * @returns {*}
     */
    getFormValues() {
        let formData = this.props.form.getFieldsValue();
        let params = {};
        for (const key in formData) {
            if (key.indexOf('_label') > -1) {
                continue;
            }
            let val = formData[key];
            if (val == undefined) {
                val = ''
            } else if (val == null) {
                val = 0
            } else if (val instanceof Date) {
                val = formatDateTime(val)
            }
            params[key] = val;
        }
        return params;
    }

    onButtonClick = (button, e) => {
        let _this = this;
        if (!button.handler) {
            return;
        }
        this.setFormSubmiting(true);
        //是否拒绝
        //let isRefuse = button.isRefuse && button.isRefuse()
        let isRefuse = button.isRefuse && typeof button.isRefuse==='function'?button.isRefuse():button.isRefuse||false
        
        if (button.validate !== false && !isRefuse) {//拒绝不校验
            //需要校验
            let validator;
            if (typeof button.validate == "function") {
                //如果是个函数，则直接使用自定义校验方法
                validator = button.validate.bind(button, this);
            } else {
                //如果只是boolean值，则使用默认的校验方法
                validator = this.props.form.validateFieldsAndScroll.bind(this.props.form);
            }
            let promise = [];
            let validators = [];
            validators.push(validator);
            this.subFormList.forEach((item, index) => {
                item.object[item.options.onValidate] && validators.push(item.object[item.options.onValidate].bind(item.object, { btnName: button.name }));
            });
            let allErrors = [];

            //依次校验各子组件
            let validating = function (index) {
                if (index == validators.length) {
                    //最后一个子组件后，判断是否有错误
                    if (allErrors.length) {
                        VpAlertMsg({ 
                            message:"提示",
                            description:"表单校验失败，请检查表单必填项！",
                            type:"error",
                            closeText:"关闭"
                        }, 5)
                        _this.setFormSubmiting(false);
                    } else {
                        button.handler && button.handler(_this.props.form.getFieldsValue(), _this);
                    }
                    return;
                }

                validators[index]((errors, values) => {
                    if (errors) {
                        allErrors = allErrors.concat(errors);
                        console.error(allErrors);
                    }
                    //一个一个串行校验，返回结果后才校验下一个，校验不通过时，也继续校验下一个
                    validating(++index);
                });
            }
            validating(0);
        } else {
            button.handler && button.handler(_this.props.form.getFieldsValue(), _this);
        }
    }

    /**
     * 表单按钮
     * 自定义按钮格式如下：
     * {
     *      name:"ok",  //按钮名称，如果和 默认按钮同名，则跟默认按钮参数合并
            text:"保存", //按钮名称
            hidden:false, // 是否隐藏
            handler:function(formValues){
                //formValues：表单数据
               ...自定义处理逻辑
            },
            loading:this.props.loading, //加载状态
            className:"m-r-xs vp-btn-br", //按钮样式类
            type:"primary", //按钮类型，
            size:"default" //按钮大小
     * }
     * 提示：1. 按钮className、type、size属性具体用法参见http://www.vpsoft.cn:8082/apiweb/#/VpButton?_k=h3wo11
     2.名称跟默认按钮名称一致时，系统自动合并默认按钮与自定义按钮数据
     * 样例：
     *  要求：
     *      1. "保存“按钮名称统一改成”确定“，
     *      2. 添加自定义按钮”挂起“
     *      3. 保留"取消”按钮
     *  代码：
     *  let buttons = [];
     *  //"保存“按钮名称统一改成”确定“，
     *  buttongs.push({
     *      name:"ok",
     *      text:"确定",
     *  });
     *  //自定义按钮hang
     *  buttons.push({
     *     name:"hang",
     *     text:"保存",
            hidden:false,
            handler:function(formValues){
               ...自定义处理逻辑
            },
            className:"m-r-xs vp-btn-br",
            type:"ghost", //ghost风格按钮
            size:"default"
     *  });
     *  //保留cancel按钮
     *  buttons.push("cancel"); //如果只填写名称，系统自动使用默认的参数
     */
    getDefaultButtons() {
        return {
            "ok": {
                name: "ok",
                text: "保存",
                validate: true,
                handler: this.handlerSave,
                className: "m-r-xs vp-btn-br",
                type: "primary",
                size: "default"
            }, "cancel": {
                name: "cancel",
                text: "取消",
                validate: false,
                handler: this.cancelModal,
                className: "vp-btn-br",
                size: "default"
            }
        }
    }
    getCustomeButtons() {
        return this.props.buttons || ["ok", "cancel"]; //如果没有自定义按钮，用默认的;
    }

    getButtons() {       
        let _this = this 
        let defaultBtns = this.getDefaultButtons();
        let buttons = this.getCustomeButtons();
        buttons = mergeButtons(buttons, defaultBtns);
        let newButtons = buttons.map((btnItem, btnIndex) => {
            if (typeof btnItem == 'string') {
                return btnItem;
            }
            let btn = btnItem;
            if (btn.handler) {
                btn.handlerWrap = this.onButtonClick.bind(this, btn);
            }
            if (!btn.className) {
                btn.className = " vp-btn-br ";
            }
            btn.className += " m-r-xs ";
            if (btn.hidden) {
                //如果按钮需要隐藏，加hide样式
                btn.className = btn.className + " hide ";
            } else {
                btn.className = btn.className + " inline-display ";
            }
            btn.type = btn.type || "ghost"; //默认按钮样式
            return btn;
        });
        _this.setState({newButtons:newButtons})
        console.log('getButtons 调用');
        
        //return newButtons;
    }

    /**
     * 组隐藏或显示事件
     * @param activePanel
     * @param a
     */
    onPanelChange(activePanel, a) {
        if (!this.panelStatus) {
            return;
        }
        this.panelStatus.forEach((item, index) => {
            if (item.type == 0) {
                //0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                item.active = true;
            } else if (activePanel.indexOf(index.toString()) > -1) {
                item.active = true;
            } else {
                item.active = false;
            }
        });
        let activeKeys = [];
        this.panelStatus.forEach((item, index) => {
            if (item.active) {
                activeKeys.push(index.toString());
            }
        })
        this.setState({
            activeKeys
        })
    }

    /**
     * 判断表单数据是否变化，重置活动标签
     */
    resetActiveKeys(formRenderData) {
        if (!formRenderData || !formRenderData.groups || !formRenderData.groups.length) {
            return [];
        }

        //先判断两个组数据是否一样
        let formRenderDataEq = true;
        if (!this.panelStatus
            || !this.formRenderData
            || !this.formRenderData.groups
            || this.formRenderData.groups.length !== formRenderData.groups.length
        ) {
            formRenderDataEq = false;
        } else {
            for (let i = 0; i < this.formRenderData.groups.length; i++) {
                let pre = this.formRenderData.groups[i];
                let the = formRenderData.groups[i];
                if (pre.group_type != the.group_type
                    || pre.group_label != the.group_label
                ) {
                    //如果前后两个数据的group_type或group_label不一样时视为这组数据不一样
                    formRenderDataEq = false;
                    break;
                }
            }
        }

        if (!formRenderDataEq) {
            //如果原有表单数据与当前表单数据不一致时，重新取当前活动节点
            let panelStatus = [];
            let groups = formRenderData.groups;
            groups.forEach((item, index) => {
                panelStatus[index] = {
                    type: item.group_type,
                    active: item.group_type != 2  //group_type：0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                }
            });
            this.formRenderData = formRenderData
            this.panelStatus = panelStatus;

            let activeKeys = [];
            this.panelStatus.forEach((item, index) => {
                if (item.active) {
                    activeKeys.push(index.toString());
                }
            })
            this.state.activeKeys = [...activeKeys]
        }
    }


    render() {
        let formRenderData = this.getFormRenderData(); //表单渲染数据

        if (!formRenderData) {
            return null;
        }

        let formData = formRenderData.groups ? formRenderData.groups.slice() || [] : [];
        let btns = this.state.newButtons||[];
        //let btns = this.getButtons();
        
        /**
         * 节显示样式
         * @param type
         * @returns {string}
         */
        const panelClasstype = (type) => {
            switch (type) {
                case 0: //固定
                    return 'panel-open'
                case 1: //打开
                    return ''
                case 2: //关闭
                    return ''
                case 3: // 不显示表头
                    return 'panel-no-header'
                case 4: // 隐藏
                    return 'hide'
            }
        }

        this.resetActiveKeys(formRenderData);

        return (
            <div className={`vp-dynamic-form full-height p-b-xxlg pr ${this.props.wrapClassName || ''}`}>
                <div className={'full-height scroll p-r-sm ' + (this.props.className ? this.props.className : '')}>
                    <VpForm horizontal ref='form'>
                        <VpRow>
                            {
                                formData.length ?
                                    <VpFCollapse onChange={this.onPanelChange} activeKey={this.state.activeKeys} className={`dynamic-form-wrapper  ${this.props.noHeader ? 'panel-no-header' : ''}`}>
                                        {
                                            formData.map((item, i) => {
                                                let count = 2;
                                                let newLine = false;
                                                let odd = [];
                                                return (
                                                    <VpPanel header={item.group_label} key={i} className={panelClasstype(item.group_type)}>
                                                        {
                                                            formData[i].fields.map((item, index) => {
                                                                item.detailClick = this.props.detailClick ? this.props.detailClick : () => { };
                                                                if (this.props.chooseModalVisible) {
                                                                    if (item.widget_type == "multiselectmodel" || item.widget_type == "selectmodel") {
                                                                        item.chooseModalVisible = this.props.chooseModalVisible;
                                                                    }
                                                                }
                                                                item.hasOwnProperty('headers') ? (
                                                                    item.header = this.props.header ? this.props.header : [],
                                                                    item.data = this.props.dataSource ? this.props.dataSource : [],
                                                                    item.pagination = this.props.tablePagination == false ?
                                                                        false :
                                                                        this.props.tablePagination == undefined ? {} : this.props.tablePagination
                                                                ) : item;
                                                                item.hasOwnProperty("tabsdata") ?
                                                                    (item.tabsdata.map((item_tabs, index_tabs) => {
                                                                        item_tabs.key = item_tabs.props ? item_tabs.props.key ? item_tabs.props.key : index_tabs : index_tabs;
                                                                        if (item_tabs.url && item_tabs.url.indexOf("http") === -1 && item_tabs.url.indexOf("https") === -1) {
                                                                            let Tabs = requireFile(item_tabs.url.split("?")[0]);
                                                                            if (Tabs) {
                                                                                item_tabs.content = <Tabs {...item_tabs.props} stabparam={item_tabs.url.split("?")[1]} />;
                                                                            }
                                                                        } else {
                                                                            item_tabs.content = item_tabs.url;
                                                                        }
                                                                    }), item.panes = item.tabsdata)
                                                                    : item.panes = [];
                                                                if (count == 1 && !item.hidden) {
                                                                    count = 2;
                                                                    newLine = true;
                                                                    return (
                                                                        <VpRow key={item.hasOwnProperty('field_name') ? item.field_name : index}>
                                                                            {odd}
                                                                            {this.createWidget(item)}
                                                                        </VpRow>
                                                                    )
                                                                } else {
                                                                    if (newLine) {
                                                                        odd = [];
                                                                        newLine = false;
                                                                    }
                                                                    if (index === formData[i].fields.length - 1) {
                                                                        return (
                                                                            <VpRow key={item.hasOwnProperty('field_name') ? item.field_name : index}>
                                                                                {odd}
                                                                                {this.createWidget(item)}
                                                                            </VpRow>
                                                                        )
                                                                    }
                                                                    odd.push(this.createWidget(item))
                                                                    if (item.all_line != 2 && !item.hidden) {
                                                                        count--;
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    </VpPanel>
                                                )
                                            })
                                        }
                                    </VpFCollapse>
                                    : null
                            }
                        </VpRow>
                        {
                            this.showFooter()?
                                <div className="footFixed p-sm b-t text-center">
                                    {
                                        btns.map((btnItem, btnIndex) => {
                                            if (!btnItem || !(typeof btnItem === 'object')) {
                                                return null;
                                            }
                                            let { name, text, handler, handlerWrap, render: btnRender, ...otherProps } = btnItem;
                                            return btnRender ?
                                                btnRender(btnItem, this) :
                                                <VpButton loading={this.getFormSubmiting()} {...otherProps} key={name} onClick={handlerWrap} > {text}</VpButton>
                                        })
                                    }
                                </div> : ''
                        }
                    </VpForm>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        store: state
    }
}



function mapToDispatchToProps(dispatch, ownProps) {
    return {
        setFormSubmiting: (contextid, submiting) => {
            dispatch(setContext(contextid, {
                submiting
            }));
        }
    }
}

/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends XX.Component {
 *
 * }
 * CustomComponent = XX.createClass(CustomComponent);
 * @param newClass
 */
let createClass = function (newClass) {
    let wrapClass = VpFormCreate(connect(mapStateToProps, mapToDispatchToProps)(newClass));
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(Form);


