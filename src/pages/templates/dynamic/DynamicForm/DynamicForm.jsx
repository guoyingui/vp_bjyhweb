import React, { Component } from 'react'
import {
    vpQuery,
    vpAdd,
    VpFormCreate,
    VpModal,
    vpDownLoad,
    VpTooltip,
    VpIcon,
    VpAlertMsg,
    vpFormatDate
} from 'vpreact';
import { RightBox} from 'vpbusiness';
import { formatDateTime } from 'utils/utils';
import FirstFlow from '../Flow/FirstFlow';
import DetailForm from './detailForm';
import Form from '../Form/Form';
import {
    registerWidgetPropsTransform,
    registerWidget,
    getCommonWidgetPropsFromFormData,
    formDataToWidgetProps
} from '../Form/Widgets';

import StatusButton from './StatusButton';

import {setContext} from 'reduxs/actions/action';
import {connect} from 'react-redux';
import {mergeButtons,randomKey} from "../utils";


//判断变量是否以某个字符串结尾
function endWithStr(field,endStr){
    if(!field || !endStr){
        return false;
    }
    var d = field.length - endStr.length;
    return (d >= 0 && field.lastIndexOf(endStr) == d)
}

/**
 * 动态表单
 * 示例：
 *  import DynamicForm from 'templates/dynamic/DynamicForm/DynamicForm'
 *  <DynamicForm
 *      entityid={"1"} 实体定义id
 *      iid = {"1"} 实体实例id
 *  />
 *
 *  定制开发时，通过继承DynamicForm.Component，然后重写父类提供的接口
 *  示例：
 *  import DynamicForm from 'templates/dynamic/DynamicForm/DynamicForm'
 *  class CustomDynamicForm extends DynamicForm.Component{
 *      ...重写父类接口
 *  }
 *  CustomDynamicForm = DynamicForm.createClass(CustomDynamicForm); //必须调用父类的createClass方法
 *
 *  DynamicForm提供一下接口，具体用法见类中接口注释
 *  getCustomeButtons 自定义表单按钮，
 *  getCustomSaveUrl 自定义表单保存后台地址
 *  onSaveSuccess 保存成功后事件
 *  onBeforeSave 保存前事件，覆盖此接口能实现对保存数据做一些逻辑操作
 *  onSave 保存动作
 *  onDataLoadSuccess 表单数据加载成功后，覆盖此接口可以对表单数据做一些逻辑操作，比如添加自定义按钮，监听字段变化事件
 *  getFormValues 获取表单数据
 *
 */
class DynamicForm extends Form.Component {
    constructor(props) {
        super(props)
        this.state = {
            ...this.state,
            statusList:[],
            varilsForm:{}, //变迁表单
            closeAfterAdd:true,
            isFlowed:false
        }

        this.handleSave = this.handleSave.bind(this);
        this.onSave = this.onSave.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.loadFormData = this.loadFormData.bind(this);
        this.handleSaveAndNew = this.handleSaveAndNew.bind(this);
        this.handleSaveAndFlow = this.handleSaveAndFlow.bind(this);
        this.getFormValues = this.getFormValues.bind(this);
        this.handleStatus = this.handleStatus.bind(this);


        //给当前list起个唯一名称
        this._contextid = this.props._contextid||randomKey();
    }

    componentWillMount() {        
        super.componentWillMount();
        this.getEntityType(); //获取实体类型
        this.queryEntityRole();
        this.loadFormData();
    }
    componentDidMount() {
        super.componentDidMount();
        window.form = this
    }

    //获取实体信息
    getEntityType (){
        let _this = this
        return vpAdd('/{vpplat}/vfrm/entity/entitytype', {
            entityid: this.props.entityid||this.props.row_entityid
        }).then((response) => {
            let flowtype = response.data.flowtype; //实体流程类型，1-无流程；2-状态变迁；3-工作流
            if(flowtype == '2' && !_this.props.add){
                //查询状态按钮
                this.queryStatusList();
            }else if(flowtype==3){//bjyh 若是有流程查询是否有运行中
                this.getFlowStatus()
            }

            this.setState({
                flowtype: flowtype
            },()=>{
                this.getButtons()
            });
        });
    }

    //查询实体权限
    queryEntityRole() {
        let {iid,skey,entityrole} = this.props;
        let entityid = this.props.entityid||this.props.row_entityid
        let tabsformrole = false
        if (!iid) {//新建时默认为true
            tabsformrole = true
            this.setState({
                entityrole: tabsformrole
            })
        } else {
            if (endWithStr(skey,'subitem')) {//判断是否为主子关系
                if (entityrole) {//如果父级对于tabs有写权限，则不用查自己的权限
                    tabsformrole = entityrole
                    this.setState({
                        entityrole: tabsformrole
                    })
                } else {
                    vpQuery('/{vpplat}/vfrm/entity/entityRole', {
                        entityid, iid
                    }).then((response) => {
                        tabsformrole = response.data.entityRole
                        this.setState({
                            entityrole: tabsformrole
                        })
                    })
                }
            } else {//对等关系
                if(this.props.entityrole){
                    vpQuery('/{vpplat}/vfrm/entity/entityRole', {
                        entityid, iid
                    }).then((response) => {
                        tabsformrole = response.data.entityRole
                        this.setState({
                            entityrole: tabsformrole
                        })
                    })
                }else{
                    this.setState({
                        entityrole: false
                    })
                }
            }
        }
    }

    //状态变迁按钮
    queryStatusList() {
        const _this = this
        vpAdd('/{vpplat}/vfrm/entity/getStatusList', {
            entityid: _this.props.entityid||_this.props.row_entityid,
            iid: _this.props.iid
        }).then((response) => {
            let varis = response.data.varis
            _this.setState({
                statusList: varis,
            },()=>{
                this.getButtons()
            });

            
        })
    }

    //查看是否已发起流程
    getFlowStatus =() =>{
        let _this = this;
        if(!_this.props.iid){
            return
        }
        vpQuery('/{bjyh}/util/getFlowStatus', {
            entityid: _this.props.entityid||_this.props.row_entityid,
            iid: _this.props.iid
        }).then((response) => {
            if(response && response.data>0){
                this.setState({
                    isFlowed:true
                },()=>{
                    this.getButtons()
                })
            }
        })
    }

    /**
     *
     * @param {保存成功后} formData
     */
    onSaveSuccess(formData,btnName){
        return this.props.onSaveSuccess && this.props.onSaveSuccess(formData,btnName,this);
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
        this.setFormSubmiting(true);
        let beforeResult = this.onBeforeSave(formData,btnName);
        Promise.resolve(beforeResult).then((flag) => {
            console.log("onSave---- flag",flag)
            if(flag === false){
                this.setFormSubmiting(false);
                errorCallback && errorCallback();
            }else{
                vpAdd(this.getCustomSaveUrl(), {
                    ...formData
                }).then(data => {
                    _this.setFormSubmiting(false);
                    callback && callback(data,btnName,_this);
                }).catch(function (err) {
                    VpAlertMsg({
                        message:"消息提示",
                        description:'提交失败！',
                        type:"error",
                        closeText:"关闭",
                        showIcon: true
                    }, 5)
                    errorCallback&&errorCallback();
                    _this.setFormSubmiting(false);
                });
            }
        });
    }

    //保存方法
    handleSave(formData) {
        let btnName = "ok";
        this.submit(btnName,{
            onSaveSuccess:({mainFormSaveReturnData,btnName}) => {
                VpAlertMsg({
                    message:"消息提示",
                    description:'操作成功！',
                    type:"success",
                    closeText:"关闭",
                    showIcon: true
                }, 5);
                this.setState({
                    newiid:mainFormSaveReturnData.data.iid,
                });
                this.onSaveSuccess(mainFormSaveReturnData,btnName)
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

    /**
     * 处理状态按钮
     * @param variid 状态ID
     * @param statusFormValues 状态表单数据
     */
    handleStatus(variid,statusFormValues){
        let btnName = "status";
        this.submit(btnName,{
            onSaveSuccess:({mainFormSaveReturnData,btnName}) => {
                VpAlertMsg({
                    message:"消息提示",
                    description:'操作成功！',
                    type:"success",
                    closeText:"关闭",
                    showIcon: true
                }, 5);
                this.onSaveSuccess(mainFormSaveReturnData,btnName);
                this.loadFormData();
                this.queryEntityRole();
                this.queryStatusList();
                this.props.closeRightModal && this.props.closeRightModal();
            },
            onSave:(formData,successCallback,errorCallback) => {
                let sparam = JSON.parse(formData.sparam);
                sparam = { ...sparam, ...statusFormValues }
                formData.variid = variid;
                formData.sparam = JSON.stringify(sparam);
                this.onSave(formData,btnName,(data) => {
                    successCallback(data.data.iid,data);
                })
            }
        })
    }

    /**
     * 保存并发起流程
     * @param formData
     */
    handleSaveAndFlow(formData){
        let _this = this;
        let btnName = "saveAndFlow";
        this.submit(btnName,{
            onSaveSuccess:({mainFormSaveReturnData,btnName}) => {
                _this.setState({
                    newiid:mainFormSaveReturnData.data.iid,
                    startflow:true,
                });
                this.onSaveSuccess(mainFormSaveReturnData,btnName)
            },
            onSave:(formData,successCallback,errorCallback) => {
                this.onSave(formData,btnName,(data) => {
                    successCallback(data.data.iid,data);

                })
            }
        });
    }

    /**
     * 保存并新建
     * @param formData
     */
    handleSaveAndNew(formData){
        let _this = this;
        let btnName = "saveAndNew";
        this.submit(btnName,{
            onSaveSuccess:({mainFormSaveReturnData,btnName}) => {
                VpAlertMsg({
                    message:"消息提示",
                    description:'操作成功！',
                    type:"success",
                    closeText:"关闭",
                    showIcon: true
                }, 5);
                _this.setState({
                    newiid:'',
                    formData:{}
                },()=>{
                    _this.loadFormData();
                    _this.props.form.resetFields()
                    //刷新列表 addButton增加reloadTable方法
                    this.props.reloadTable && this.props.reloadTable()
                });
                this.onSaveSuccess(mainFormSaveReturnData,btnName);
            },
            onSave:(formData,successCallback,errorCallback) => {
                this.onSave(formData,btnName,(data) => {
                    successCallback(data.data.iid,data);
                })
            }
        });
    }

    /**
     * 保存表单后台地址
     * @returns {string}
     */
    getCustomSaveUrl(){
        return '/{vpplat}/vfrm/entity/saveFormData';
    }

    /**
     * 自定义按钮
     * 系统提供一下默认按钮
     * ok: 保存按钮
     * saveAndFlow： 保存并发起流程按钮
     * saveAndNew：保存并新建按钮
     * status ： 状态按钮，实体为状态驱动时才有值,值为下一个状态动作
     * 自定按钮用法见From.getButtons方法的注释
     */
    getCustomeButtons() {
        return this.props.buttons;
    }

    /**
     * 默认按钮
     */
    getDefaultButtons(){
        let _this =this;
        let superDefBtns = super.getDefaultButtons();
        if(superDefBtns.ok){
            superDefBtns.ok.handler = this.handleSave;
        }
        if(superDefBtns.cancel){
            superDefBtns.cancel.handler = this.cancelModal;
        }
        let constDefBtns = {
            ...superDefBtns,
            "saveAndFlow":{
                name:'saveAndFlow',
                text:'保存并发起',
                className:"vp-btn-br",
                handler:this.handleSaveAndFlow
            },/* "saveAndNew":{
                name:'saveAndNew',
                text:'保存并新建',
                className:'vp-btn-br',
                handler:this.handleSaveAndNew,
            } */
        }

        if(this.state.statusList && this.state.statusList.length){
            
            let statusBtns = this.state.statusList.map((statusItem,statusIndex) => {
                let statusBtn = {

                    name:statusItem.iid,
                    text:statusItem.sname,
                    className:'ghost vp-btn-br',
                    iid:statusItem.iid,
                    entityid:_this.props.entityid||_this.props.row_entityid,
                    sflag:statusItem.sflag,
                    render:function(btnItem,_thisform){
                        let {render,...props} = btnItem;
                        let form = _thisform.props.form;
                        return <StatusButton getFormValues={_thisform.getFormValues} 
                        form={form} entityid={_this.props.entityid||_this.props.row_entityid}  
                        {...props} _contextid={_this._contextid} 
                        onSave={_this.handleStatus}/>
                    }
                };
                return statusBtn;
            });
            constDefBtns["status"] = statusBtns; //状态按钮
        }
        return constDefBtns;//setState({cbottons:constDefBtns})
    }

    /**
     * 如果没有自定义按钮，使用默认的自定义按钮
     */
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
        }
        return buttons;
    }


    /**
     * 表单数据加载成功后
     * @param formData 表单数据
     * formData除了包含表单数据外，还提供一下获取以下方法
     * findWidgetByName()  根据字段名称获取控件
     * insertNewWidget({groupIndex,fieldIndex},props); 插入自定义控件
     *
     * 覆盖此方法可以实现对表单控件的逻辑控制
     *
     * 示例1: 控件联动，下拉控件2根据下拉控件1的值联动控制
     *  import DynamicForm from 'templates/dynamic/DynamicForm/DynamicForm'
     *  class CustomDynamicForm extends DynamicForm.Component{
     *      onDataLoadSuccess(formData){
     *          let optionsData1 = [{"value": "0","label": "北京"},{"value": "1","label": "上海"}];
     *          let optionsData2 = [{"value": "2","label": "杭州"},{"value": "3","label": "武汉"}];
     *          let select1Widget = formData.findWidgetByName("select1"); //下拉控件1，根据字段名称取控件属性
     *          let select2Widget = formData.findWidgetByName("select2"); //下拉控件2
     *          seldeptWidget.field.fieldProps.onChange = function(value){
     *              //监听下拉控件1的变化事件
     *              if(value === '1'){
                        selectWidget.field.fieldProps.initialValue = "1"; //改写下拉控件2的默认值为1
                        selectWidget.field.props.optionsData = optionsData1; //改写下拉控件2的下拉选项为optionsData1
                    }else{
                        selectWidget.field.fieldProps.initialValue = "3";
                        selectWidget.field.props.optionsData = optionsData2;
                    }
     *          }
     *      }
     *  }
     *  CustomDynamicForm = DynamicForm.createClass(CustomDynamicForm); //必须调用父类的createClass方法
     *
     *  示例2: 在第一组的第一个位置插入自定义控件
     *  CustomDynamicForm = DynamicForm.createClass(CustomDynamicForm); //必须调用父类的createClass方法
     *  import DynamicForm from '/pages/templates/dynamic/DynamicForm/DynamicForm'
     *  import CustomFormControl from '/pages/sample/dynamic/customizedFormControl' //自定义控件写法见https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
     *  class CustomDynamicForm extends DynamicForm.Component{
     *      onDataLoadSuccess(formData){
     *          formData.insertNewWidget({groupIndex:0,fieldIndex:0},{
     *              "field_name":"priceInput",
                    "widget_type":"priceInput",
                    all_line:1,
                    props:{
                        "label": "价格输入",
                        labelCol: { span: 6 },
                        wrapperCol: { span: 14 },
                    },
                    fieldProps:{
                        initialValue:{
                            number:10,
                            currency:"dollar"
                        },
                        rules:[{
                            required:true
                        }]
                    }
     *          })
     *      }
     *  }
     *  CustomDynamicForm = DynamicForm.createClass(CustomDynamicForm); //必须调用父类的createClass方法
     *
     *
     */
    onDataLoadSuccess(formData){
        if(this.props.onDataLoadSuccess){
            formData = this.props.onDataLoadSuccess(formData,this);
        }
    }
    
    /**
     * onGetFormDataSuccess
     */
    onGetFormDataSuccess(data){
        if(this.props.onGetFormDataSuccess){
            data = this.props.onGetFormDataSuccess(data,this);
        }
        //return data
    }
    
    /**
     * 处理数据，修复一个显示bug
     * @author wuchen
     * @date 2019-07-09
     */
    onDataBeforeFormdata = formData =>{
        let iprojectid = formData.findWidgetByName("iprojectid");//归属项目
        if(iprojectid){
            if(iprojectid.field.fieldProps.initialValue == undefined ||
                iprojectid.field.fieldProps.initialValue == null ||
                iprojectid.field.fieldProps.initialValue == ''){
                    iprojectid.field.props.initialName = ''
            }
        }
        //自动带出时间
        let dcreatordate = formData.findWidgetByName('dcreatordate')
        if(dcreatordate && !dcreatordate.field.fieldProps.initialValue){
            dcreatordate.field.fieldProps.initialValue=new Date()
        }
        return formData;
    }

    //表单字段信息
    loadFormData(flag) {
        const _this = this;
        // bjyh 定制发起流程后隐藏保存并发起按钮
        if(flag==='saveAndFlow'){
            //_this.getFlowStatus()
            let _newButtons = _this.state.newButtons
            _newButtons.map((item,index)=>{
                if(item.name==='saveAndFlow'){
                    item.className = item.className+' hidden'
                }
            })
            _this.setState({newButtons:_newButtons})
        }
        let initdata = null

        let iid = _this.props.iid
        if(_this.state.newiid){
            iid = _this.state.newiid
        }
        //兼容平台列表新建
        let entityid = _this.props.entityid||_this.props.row_entityid;
        let formparam = {}
        //关联页签/实体新建根据所选类别显示默认状态
        let viewcode = _this.props.viewcode;
        if(_this.props.params && _this.props.params.data && !iid){
            viewcode = _this.props.params.data.viewcode;
            initdata = _this.props.params.data;
        }
        if(this.props.formType == 'tabs'){//关联页签
            formparam = {
                mainentityid: _this.props.mainentity,
                mainiid: _this.props.mainentityiid,
                entityid,
                iid,
		        stabparam:this.props.stabparam,
                 viewcode,
                formType: 'tabs' //分辨出这个实体挂在tab页的，还是一级实体
            }
        }else{//实体列表
            formparam = {
                entityid,
                iid,
                iparent: _this.props.row_id,
                viewcode
            }
        }

        vpQuery('/{vpplat}/vfrm/entity/getform', {
           ...formparam,
           initdata:JSON.stringify(initdata)
        }).then(function (response) {
            let data = response.data

            _this.onGetFormDataSuccess(data);

            let onloadevent = _this.props.eventmap ? _this.props.eventmap.onload :''
            if(onloadevent!=''&&onloadevent!=undefined){
                let param = {
                    'value': data,
                    'entityid': _this.props.row_entityid||_this.props.entityid,
                    'iid': _this.props.row_id
                }
                data = formeven(param,onloadevent)
            }  
            if (data) {
                if (data.hasOwnProperty('form')) {
                    if (data.form.hasOwnProperty('groups')) {

                        let formData = formDataToWidgetProps(data.form,_this);
                        formData = _this.onDataBeforeFormdata(formData);
                        //提供调用者拦截数据
                        _this.onDataLoadSuccess(formData);
                        _this.setState({
                            formData: formData,
                        })
                    }
                }
            }
	    /* 因为报错而注释
            _this.setState({
                loading: false
            })
	    */
        });
        
    }

    cancelModal(){
        this.setFormSubmiting(false);
        this.props.closeRightModal && this.props.closeRightModal();
    }


    /**
     * 获取表单值,去掉label等字段值
     */
    getFormValues()  {
        let formData;
        let sparam = super.getFormValues();
        let viewcode = ''
        if(this.props.params!=undefined&&this.props.params.data!=undefined){
            viewcode = this.props.params.data.viewcode
        }
        let entityid = this.props.entityid||this.props.row_entityid
        let iid = this.state.newiid||this.props.iid
        if(this.props.formType == 'tabs'){
            //如果是tab
            sparam['sfieldname'] = this.props.stabparam;//关系码
            sparam["irelentityid"] = this.props.mainentity;
            sparam["irelobjectid"] =this.props.mainentityiid;
            formData = {
                sparam: JSON.stringify(sparam),
                entityid: this.props.mainentity,//主实体ID
                iid: this.props.mainentityiid,//主实体数据ID
                irelationentityid: entityid,//关联实体ID
                irelationentityiid: iid,//关联实体对象数据ID
                irelationid: this.props.irelationid,//关联实体关联关系ID
                viewcode
            }
        }else{
            formData = {
                sparam: JSON.stringify(sparam),
                entityid, 
                iid, 
                viewcode
            }
        }
        return formData;
    }

    updateTimeInfo(entityid, iid) {
        const _this = this
        let sparam = {
            iid: iid,
            entityid: entityid,
        }
        vpAdd('/{vpmprovider}/vpmwbs/saveTaskInfo', sparam).then(function (data) {
            _this.loadFormData()
            _this.props.refreshList()
        })
    }

    //销毁发起流程DOM
    destoryFlowDom=(flag)=>{
        this.setState({
            startflow:false
        })
        if(flag == 'startflow'){
            this.props.closeRightModal && this.props.closeRightModal();
        }else{
            this.props.closeRightModal && this.props.closeRightModal();
        }
    }

    /**
     * 重写表单渲染数据接口，数据从state.formData中取
     * */
    getFormRenderData(){
        let formData = this.state.formData;
        return formData;
    }

    render() {
        let formData = this.getFormRenderData();
        if(!formData){
            return null;
        }
        return (
            <div className="full-height">
                {super.render()}
                {
                    this.state.startflow?
                       <FirstFlow
                            flowtype = {false}
                            entityid = {this.props.entityid||this.props.row_entityid}
                            iid = {this.state.newiid}
                            refreshFormData = {(flag)=>this.loadFormData(flag)}
                            destoryDom = {(flag)=>this.destoryFlowDom(flag)}
                            showfirstnodepage={true}
                       />
                    :''
                }
            </div>
        )
    }
}
DynamicForm = Form.createClass(DynamicForm);

export default DynamicForm;