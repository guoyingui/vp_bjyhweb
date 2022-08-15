import React,{Component} from 'react';

import {
    VpFormCreate, VpInput, VpForm, VpRow, VpCol, VpFCollapse, VpPanel, FormItem, VpButton, VpAlertMsg, vpAdd, VpModal, VpCheckbox,vpQuery
} from 'vpreact';

import {setContext} from 'reduxs/actions/action';
import {connect} from 'react-redux';
import {mergeButtons} from "../utils";
import {formDataToWidgetProps} from "../Form/Widgets";
import { requireFile, formatDateTime } from 'utils/utils';
import  Form from '../Form/Form';
import ModUserButton from './ModUserButton';
import JumpStepButton from './JumpStepButton';

import {randomKey} from "../utils";

/**
 * 流程页面表单
 */
// const options=[{label:'系统消息',value:1},{label:'邮件',value:2},{label:'短信',value:4},{label:'OCS',value:8}]

class FlowForm extends Form.Component{
    /**
     * bindThis 父组件this指针
     * tablePagination=false 表格是否分页
     * formData 表格数据
     * handleOk ok事件
     * handleCancel 取消事件
     * handleStatus 其他按钮事件
     * buttonList {
     *     sname: '保 存',
            className: 'ghost',
            iid: 'submit',
            visible: true,
            disabled: false,
            sflag: 'submit'
     * } 其他按钮
     * okText ok按钮名称
     * @param props
     */
    constructor(props){
        super(props);
        this.state = {
            ...this.state,
            checkboxValues:[],
            options:[],
            btnDisabled:false,
            show:false,
            shouldShow:true,
            nextStepName:"下一节点名称",
            stepkey:"",
            usermode:'',
            steps:[],
            getCustomSaveUrl:'/{vpflow}/rest/flowentity/saveform',
            getCustomSubmitUrl:'/{vpflow}/rest/flowentity/handle-task',
            selectedFlowScondition:"",
            moduserprops:{}
        }
        this.handleSave = this.handleSave.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onBeforeSave = this.onBeforeSave.bind(this);
        this.onSaveSuccess = this.onSaveSuccess.bind(this);
        this.handleCondition = this.handleCondition.bind(this);
        this.onSave = this.onSave.bind(this);
        this.displayProps = this.displayProps.bind(this);
        this.setFormSubmiting = this.setFormSubmiting.bind(this);
    }
    /**
     * 增加onDataLoadSuccess方法
     * @author SL.
     * @param {*} formData 
     */
    onDataLoadSuccess(formData,handlers){
        //this.props.onDataLoadSuccess && this.props.onDataLoadSuccess(formData,this);
    }

    /**
     * onFormRenderSuccess
     * @description 表单数据渲染后
     * @author SL.
     * @param {*} formData
     */
    onFormRenderSuccess(formData){
        this.props.onFormRenderSuccess && this.props.onFormRenderSuccess(formData,this);
    }

    /**
     * 屏蔽当前属性所在的节点！
     * @author SL.
     * @param {*} formData,props
     * @param {*} props 屏蔽参数值
     * @param {*} flag true显示 false 隐藏
     */
    displayProps(formData,props,flag){
        if(flag){
            formData.groups[props.groupIndex].group_type = 2
        }else{
            formData.groups[props.groupIndex].group_type = 4
        }

    }
    /**
     * onGetFormDataSuccess
     */
    onGetFormDataSuccess(data){
        if(this.props.onGetFormDataSuccess){
            data = this.props.onGetFormDataSuccess(data,this);
        }
    }


    /**
     * 加载数据
     */
    loadFormData(){   
        let _this = this;
        if(!this.props.formData){
            return;
        }
        let data = this.props.formData;

        let ret = _this.onGetFormDataSuccess(data);

        Promise.resolve(ret||data).then(data => {
            let sublist = data.sublist; //子标签list
            let eventmap = data.eventmap; //表单事件
            let onloadevent = eventmap ? eventmap.onload : ''

            if (onloadevent != '' && onloadevent != undefined) {
                let param = {
                    'value': data,
                    'entityid': _this.props.entityid,
                    'iid': _this.props.iobjectid,
                }
                let result = formeven(param, onloadevent)
                if (result != '' && result != undefined && result != null) {
                    data = result;
                }
                let flowflag = top.window.branch//分支字段名
                let fields0 = data.form.groups[0].fields.filter(x => {
                    return x.field_name == 'scondition'
                })
                //获取并设置条件分支结果值 data.scondition
                data.form.groups.map(group => {
                    if (group.fields) {
                        group.fields.map(x => {
                            if (x.field_name == flowflag) {
                                if (x.widget.default_value && data.handlers && fields0.length > 0) {
                                    data.scondition = x.widget.default_value
                                }
                            }
                        })
                    }
                })
                data.form.groups[0].fields = data.form.groups[0].fields.map(x => {
                    if (x.field_name == 'scondition') {
                        let load_template = []
                        data.branchTypeList.map(branchType => {
                            let branch = {}
                            if (branchType.value == '1') { // 同意需要自动计算分支
                                branch.label = branchType.label
                                x.widget.load_template.map(obj => {
                                    if (branchType.value == obj.btype) {
                                        let idx = load_template.findIndex((cur) => branch.label == cur.label)
                                        if (obj.value == data.scondition) {
                                            if (idx != -1) {
                                                load_template = [...load_template.slice(0, idx), ...load_template.slice(idx + 1)]
                                            }
                                            branch.value = obj.value
                                            load_template.push(branch)
                                        } else {
                                            if (idx == -1) {
                                                branch.value = obj.value
                                                load_template.push(branch)
                                            }
                                        }
                                    }
                                })
                            } else {
                                let branchNum = 0
                                x.widget.load_template.map(obj => {
                                    if (branchType.value == obj.btype) {
                                        branchNum = branchNum + 1
                                        branch.value = obj.value
                                        branch.label = obj.label
                                        load_template.push(branch)
                                    }
                                })
                                if (branchNum == 1) {
                                    branch.label = branchType.label
                                }
                            }
                        })
                        x.widget.load_template = [...load_template]
                        x.widget.default_value = data.scondition

                    }
                    return x
                })
                data = data
            }

            let tabsdata = data.tabsdata
            let defaultTab = data.defaultTab
            let handlers = data.handlers||[]
            //解决保存后再提交默认分支条件的处理人不显示问题
            let scondition = data.scondition||this.getScondition(data);
            let condition = "";
            //多分支时先提出与条件相符的handler
            let sconditionHandler;
            handlers.map((item,index) => {
                if(item.flag===scondition){
                    sconditionHandler = item
                }
            })
            let newdata = handlers ? handlers.filter((item,index) => {
                //若为拒绝分支则 并入包涵网关
                let flag,type
                if(sconditionHandler){
                    type = sconditionHandler.condition.charAt(sconditionHandler.condition.length-1)
                }
                if(type&&type==2){
                    flag = item.flag == scondition || item.condition == null || item.condition == ''
                }else{
                    flag = item.flag == scondition 
                    || item.condition == null  
                    || item.condition == ''   
                    || (item.condition+"'").indexOf("'6'")!=-1
                }

                if(flag){
                    condition = item.condition;
                }
                return flag
            }) : [];

            newdata = newdata.map(x => {
                return {
                    all_line: 2,
                    field_label: x.stepname,
                    field_name: x.stepkey,
                    irelationentityid: x.irelationentityid,
                    disabled: x.lastuserflag == 1 && !(x.ids == null || x.ids == '') ? true : false,
                    //url: "vfm/ChooseEntity/ChooseEntity",
                    url:'bjyh/templates/Form/ChooseEntity',
                    groupids:x.groupids||"",
                    condition:x.searchCondition||'',//增加查询条件
                    ajaxurl:x.ajaxurl,//模态框自定义url
                    validator: { message: "输入内容不能为空！", required: true },
                    widget: { default_value: x.ids, default_label: x.names },
                    widget_type: x.widget_type||"multiselectmodel"
                }
            })
            let flow_handler = {
                "group_label": "预设处理人",
                "group_type": 1,
                "fields": newdata
            }

            let flow_relation_entity = {
                "group_label": "关联实体",
                "group_type": 2,
                "fields": [
                    {
                        "field_name": "tabslist",
                        "widget_type": "tabs",
                        "iconstraint": 1,
                        "field_label": "关联实体",
                        "all_line": 2,
                        "itype": 0,
                        "inorule": 0,
                        "tabsdata": tabsdata,
                        "defaultActiveKey": defaultTab,
                    }
                ]
            }

            data.form.groups = data.form.groups.map(x => {
                if (x.group_code == "flow_handler") {
                    flow_handler.group_label = x.group_label
                    flow_handler.group_type = x.group_type
                    flow_handler.group_code = 'flow_handler'
                    return flow_handler
                } else if (x.group_code == "flow_relation_entity") {
                    flow_relation_entity.group_label = x.group_label
                    flow_relation_entity.group_type = x.group_type
                    flow_relation_entity.group_code = 'flow_relation_entity'
                    return flow_relation_entity
                }
                return x
            })
            let formData = formDataToWidgetProps(data.form,_this);
            let onLoadRet = this.onDataLoadSuccess(formData,handlers);
            Promise.resolve(onLoadRet||formData).then(data => {
                this.setState({
                    condition,
                    formData:data,
                    handlers:handlers
                },()=>{
                    this.onFormRenderSuccess(data,handlers)
                    this.props.onSetStateFromData && this.props.onSetStateFromData(data, handlers, this)
                })
            });
        })
    }

    //从字段信息中获取审批意见
    getScondition = (data) => {
        if(data.form){
            for(let item of data.form.groups){
                for(let field of item.fields){
                    if(field.field_name=="scondition"){
                        return field.widget.default_value
                    }
                }
            }
        }
        return ''
    }

    // 动态表单事件
    handleCondition(e){
        let scondition = e.target.value
        let handlers = this.state.handlers

        let condition = ""
        let newdata = handlers ? handlers.filter((item) => {
            let flag = item.flag == scondition || item.condition == null || item.condition == ''||(item.condition+"'").indexOf("'6'")!=-1
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
                widget_type: x.widget_type||"multiselectmodel"
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
    }

    /**
     * 获取表单数据
     */
    getFormRenderData(){
        return this.state.formData;
    }
    componentWillMount() {
        super.componentWillMount();
        this.loadFormData();
       // this.getMsgType();
    }
    componentWillReceiveProps(nextProps, nextContext) {
        super.componentWillReceiveProps();
        //this.loadFormData();
        if(!window.flowtabs){
            window.flowtabs={};
        }
    }

    /**
     * 保存表单后台地址
     * @returns {string}
     */
    getCustomSaveUrl(){
        return null;
    }

    /**
     * 待办提交按钮
     */
    getCustomSubmitUrl(){
        return null;
    }

    /**
     * 获取表单值
     */
    getFormValues() {
        let sparam = super.getFormValues();
        Object.keys(sparam).forEach((key, i) => {
            if (sparam[key] == undefined) {
                sparam[key] = ''
            } else if (sparam[key] == null) {
                sparam[key] = 0
            }
            else if (sparam[key] instanceof Date) {
                sparam[key] = formatDateTime(sparam[key])
            }
        });
        let { entityid, iobjectentityid, iobjectid, piid, staskid, stepkey, formkey } = this.props
        
        return {
            sparam: JSON.stringify(sparam),
            entityid: entityid,
            iobjectentityid: iobjectentityid,
            iobjectid: iobjectid,
            piid: piid,
            staskid: staskid,
            stepkey: stepkey,
            formkey: formkey,
        }
    }
    /**
     *
     * @param {保存成功后} formData
     */
    onSaveSuccess(responseData,btnName, formData){
        return this.props.onSaveSuccess && this.props.onSaveSuccess(responseData,btnName,formData,this);
    }
    /**
     * 上帝模式保存成功后执行（避免重载定制表单中的onSaveSuccess）
     * @param {*} responseData 
     * @param {*} btnName 
     * @param {*} formData 
     */
    onGodSaveSuccess(responseData,btnName, formData){
        return this.props.onGodSaveSuccess && this.props.onGodSaveSuccess(responseData,btnName,formData,this);
    }

    onBeforeSave(formData,btnName){
        return this.props.onBeforeSave && this.props.onBeforeSave(formData,btnName,this);
    }

    /**
     * 保存动作
     * @param formData
     */
    onSave(formData,btnName,callback,errorCallback) {
        let _this = this;
        let formdata = JSON.parse(formData.sparam);
        let param = { taskId: _this.props.staskid, formdata: formdata }
        let { entityid, iobjectentityid, iobjectid, piid, staskid, stepkey, formkey } = _this.props
        this.setFormSubmiting(true);
        let beforeResult = this.onBeforeSave(formData,btnName);
        Promise.resolve(beforeResult).then((flag) => {
            if(flag === false){
                this.setFormSubmiting(false);
                errorCallback && errorCallback();
            }else{
                vpAdd(this.getCustomSaveUrl()||_this.state.getCustomSaveUrl, {
                    ...formData
                }).then(data => {
                    //待办提交成功后，调用“流程表单同步到实体表单”接口
                    vpAdd("/{bjyh}/ZKsecondSave/synFlowToEntity",{ sparam: JSON.stringify(param),
                        entityid: entityid,
                        iobjectentityid: iobjectentityid,
                        iobjectid: iobjectid,})
                    .then((response)=>{
                        //callback && callback(submitReturn);
                    }).catch((error) => {
                        errorCallback&&errorCallback(error);
                    });
                    _this.setFormSubmiting(false);
                    callback && callback(data,btnName,_this);
                }).catch(function (err) {
                    errorCallback&&errorCallback();
                    _this.setFormSubmiting(false);
                });
            }
        });
    }
    /**
     * 处理保存事件
     * @param formData
     */
    handleSave(formData){
        let _this = this;
        let btnName = "save";
        top.window.submit = false;
        let saveForm = () => {
            this.submit(btnName,{
                onSaveSuccess:({mainFormSaveReturnData,btnName,formData}) => {
                    VpAlertMsg({
                        message:"消息提示",
                        description:'操作成功！',
                        type:"success",
                        closeText:"关闭",
                        showIcon: true
                    }, 5);
                    this.onSaveSuccess(mainFormSaveReturnData,btnName,formData);
                    this.onGodSaveSuccess(mainFormSaveReturnData,btnName,formData);
                    _this.cancelModal();
                },
                onSave:(formData,successCallback,errorCallback) => {
                    this.onSave(formData,btnName,(data) => {
                        successCallback(this.props.iobjectid,data);
                    })
                }
            });
        }

        //校验各个子页面的保存是否成功
        let sublist = this.props.formData.sublist||[]
        let promisearr = []
        sublist.map((item) => {
            if (window.flowtabs&&window.flowtabs[item] && window.flowtabs[item].handleSubSave) {
                let p = window.flowtabs[item].handleSubSave(this,btnName);
                promisearr.push(p)
            }
        })
        if (promisearr.length > 0) {
            Promise.all(promisearr).then(function (resolve, reject) {
                let error = ''
                resolve.map((item, index) => {
                    if (!item.success) {
                        error += item.message
                    }
                })
                if (error != undefined && error != '') {
                    VpAlertMsg({
                        message: "消息提示",
                        description: error,
                        type: "error",
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    _this.setFormSubmiting(false);
                    return
                } else {
                    saveForm()
                }
            });
        } else {
            saveForm()
        }
    }

    /**
     * 待办提交接口
     * @param formData
     * @param btnName
     * @param callback
     * @param errorCallback
     */
    onSubmit(formData,btnName,callback,errorCallback) {
        let _this = this;
        let formdata = JSON.parse(formData.sparam);
        let param = { taskId: _this.props.staskid, formdata: formdata }
        let { entityid, iobjectentityid, iobjectid, piid, staskid, stepkey, formkey } = _this.props
        vpAdd(this.getCustomSubmitUrl() || _this.state.getCustomSubmitUrl, {
            sparam: JSON.stringify(param)
        }).then((response) => {
            if (response.data == undefined) {
                VpAlertMsg({
                    message: "消息提示",
                    description: response.msg,
                    type: "error",
                    onClose: _this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
                errorCallback&&errorCallback(response);
            }else{
                let submitReturn = response;
                //待办提交成功后，调用“流程表单同步到实体表单”接口
                vpAdd("/{bjyh}/ZKsecondSave/synFlowToEntity",{ sparam: JSON.stringify(param),
                    entityid: entityid,
                    iobjectentityid: iobjectentityid,
                    iobjectid: iobjectid,})
                .then((response)=>{
                    //callback && callback(submitReturn);
                })
                .catch((error) => {
                    errorCallback&&errorCallback(error);
                });
                //测试时先放在这里
                callback && callback(submitReturn);
            }
        }).catch((error) => {
            errorCallback&&errorCallback(error);
        })
    }
    /**
     * 处理提交事件
     * 1. 调用各子标签页的保存接口，window.flowtabs[item].handleSubSave
     * 2. 标签页都保存成功后，再保存本表单
     * 3. 表单保存成功后，再触发代办提交
     * @param value
     */
    handleSubmit(formData) {
        this.setState({selectedFlowScondition:formData.scondition});
        let _this = this
        top.window.submit = true
        let onsaveinfo = this.state.eventmap ? this.state.eventmap.onsave : ''
        if (onsaveinfo != '' && onsaveinfo != undefined) {
            let param = {
                iflowentityid: this.props.entityid,
                iobjectentityid: this.props.iobjectentityid,
                iobjectid: this.props.iobjectid,
                formdata: formData,
            }
            onsave(param, onsaveinfo)
        }

        if (!top.window.submit) {
            VpAlertMsg({
                message: "消息提示",
                description: '验证失败！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            return
        }

        let btnName = "ok";
        let saveForm = () => {
            this.submit(btnName,{
                onSaveSuccess:({mainFormSaveReturnData,btnName,formData}) => {
                    VpAlertMsg({
                        message:"消息提示",
                        description:'操作成功！',
                        type:"success",
                        closeText:"关闭",
                        showIcon: true
                    }, 5);
                    _this.onSaveSuccess(mainFormSaveReturnData,btnName,formData);
                    _this.onGodSaveSuccess(mainFormSaveReturnData,btnName,formData);
                    _this.setFormSubmiting(false);
                    _this.cancelModal();
                    _this.setState({show:true});
                    //如果流程下一步信息未查询到，就不显示发送消息的弹框，此页面就无法关闭。因此需要调用cancelModal关闭页面
                    if(!this.state.shouldShow){
                        _this.cancelModal();
                    }
                },
                onSave:(formData,successCallback,errorCallback) => {
                    this.onSave(formData,btnName,(saveReturn) => {
                        this.onSubmit(formData,btnName,(submitReturn) => {
                            successCallback(this.props.iobjectid,{
                                saveReturn,submitReturn
                            });
                        });
                    }) 
                }
            });
        }

        //校验各个子页面的保存是否成功
        let sublist = this.props.formData.sublist||[];
        let promisearr = []
        sublist.map((item) => {
            if (window.flowtabs&&window.flowtabs[item] && window.flowtabs[item].handleSubSave) {
                let p = window.flowtabs[item].handleSubSave(this,btnName);
                promisearr.push(p)
            }
        })
        if (promisearr.length > 0) {
            Promise.all(promisearr).then(function (resolve, reject) {
                let error = ''
                resolve.map((item, index) => {
                    if (!item.success) {
                        error += item.message
                    }
                })
                if (error != undefined && error != '') {
                    VpAlertMsg({
                        message: "消息提示",
                        description: error,
                        type: "error",
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    _this.setFormSubmiting(false);
                    return
                } else {
                    saveForm()
                }
            });
        } else {
            saveForm()
        }
    }
    /**
     * 根据condition获取分支结果是否是“拒绝”或“不通过”，以此来判断是否是回退步骤，回退步骤不做非空校验
     */
    /* isRefuse = ()=>{
        if(!this.state.condition){
            return false
        }
        let arr = this.state.condition.split("'")
        //分支结果
        let fzjg = arr[arr.length-1]
        if(fzjg=="2"||fzjg=="5"){
            return true
        }
        return false
    } */
    /**
     * 自定义表单按钮
     */
    getCustomeButtons(){
        let buttons = this.props.buttons;        
        if(!buttons){
            //如果没有自定义按钮，用默认的
            buttons = [];
            if(this.props.staskid){
                buttons.push("ok");
                buttons.push("save");
                if(this.props.ijump){
                    //自由跳转
                    buttons.push("jump");
                }
                //if(this.props.usermode){
                    //修改处理人
                    buttons.push("moduser");
                //}
            }
            buttons.push("cancel");
        }
        return buttons;
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
            }
        }
        //部分步骤才显示更改处理人功能
        _this.state.moduserprops.ismoduser?defaultBtns.moduser={
            name: 'moduser',
            text: '更改处理人',
            className: "ghost inline-display m-r-xs vp-btn-br",
            type: "ghost",
            render(btnItem,_thisform){
                let {handler,render,...btnProps} = btnItem;
                return <ModUserButton {...btnDefaultProps} btnProps={btnProps} {..._this.state.moduserprops} />
            }
        }:null
        return defaultBtns;
    }

    cancelModal(){
        this.setFormSubmiting(false);
        this.props.closeRight && this.props.closeRight(false);
    }

    /**
     * 根据condition获取分支结果是否是“拒绝”或“不通过”，以此来判断是否是回退步骤，回退步骤不做非空校验
     */
    isRefuse = ()=>{
        if(!this.state.condition){
            return false
        }
        let arr = this.state.condition.split("'")
        //分支结果
        let fzjg = arr[arr.length-1]
        if(fzjg=="2"||fzjg=="5"){
            return true
        }
        return false
    }
        
    //评审定制评委隐藏更改处理人
    /* getStepInfo=()=>{      
        vpAdd("{vpczccb}/flow/getStepInfo", {
            piid:this.props.piid,
            taskid:this.props.staskid
        }).then((response) => {            
            const setObj = {'accessCreator':response.data.assignee_}
            if(response.data.end_time_){  
                setObj.isStepOver=true
            }
            this.setState(setObj);  
        })
    } */

    componentWillUpdate(nextProps, nextState, nextContext) {
       if(this.state.formData && this.props.formData.formurl && this.props.formData.formurl=="czccb/rjxq/autoCreateChildTaskFlowForm"){
           this.state.formData.groups.map(item=>{
               if(item.group_label=='预设处理人'){
                if(item.fields.length==3){
                    let onlyOne = [];
                    item.fields.map(item2=>{
                       if(item2.props.field_label=='开发排期'){
                           onlyOne.push(item2)
                       }
                    })
                    if(onlyOne.length!=0){
                        item.fields=onlyOne;
                    }
                }
               }
           })
       }
    }

    render(){
        if(!this.state.formData){
            return null;
        }        
        return (
           <div className="full-height">
                {super.render()}
           </div>
        )
    }

}
FlowForm = Form.createClass(FlowForm);
export default FlowForm;
