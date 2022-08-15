import React,{Component} from 'react';
import {connect} from 'react-redux';

import {urlParamToObject} from '../utils';

/**
 * 将组件封装成子表单,子表单必须按需实现一下接口
 * onValidate： 保存前数据校验接口
 * onSave： 异步保存接口
 * getFormValues: 获取子表单数据接口，用于主子表同时保存
 *
 * 用法：
 * 1. 编写子表单，模板参考此页面，主要实现以下几点
 *      a. 在componentWillMount中调用this.props.registerSubForm将子表单注册到父表单中
 *      b. 根据实际情况实现onValidate、onSave、getFormValues接口
 * 2. 在需要子表单的实体添加类型为子页面的字段，
 * 子页面地址格式为/templates/Form/SubTableForm?irelationentity=11&stabparam=iprojectid
 * 其中 /templates/Form/SubTableForm：子表单页面地址（记得放在dynamic目录下）
 *      irelationentity：子页面实体id
 *      stabparam：子实体与主实体的关联关系字段名称
 *
 * 例如：项目实体保存时要同时保存子项目，那么在子项目实体中会加一个关联项目的字段，假设字段名称为iprojectid（不是属性名称）
 * 1. 编写子页面，列如地址为src/pages/sample/form/dynamic/customSubTableForm.jsx
 * 2. 在项目实体中添加类型为子页面的字段,页面地址为/sample/form/customSubTableForm?irelationentity=11&stabparam=iprojectid
 *
 */

class SubForm extends Component{

    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        this.registerSubForm();
        this.parseChildPageParams();
    }

    /**
     * 解析子页面参数
     */
    parseChildPageParams(){
        let params = {};
        if(this.props.urlparam){
            params = urlParamToObject(this.props.urlparam);
        }
        this.setState({
            entityid:params.irelationentity,
            mainentityid:this.props.entityid,
            mainentityiid:this.props.iid,
            stabparam:params.stabparam
        });
    }

    /**
     * 注册子表单到父表单参数
     */
    getRegisterSubFormOptions(){
        return {
            asyncSave: true, //是否是同时保存主子表，如果为true,则子表单类必须实现getFormValues接口,如果为false,则实现onSave接口
            onValidate:"onValidate", //如果默认的onValidate与类有冲突时，可以使用自定义名称替换onValidate函数
            onSave:"onSave",  //如果默认的onSave与类有冲突时，可以使用自定义名称替换onSave函数
            getFormValues:"getFormValues", //如果默认的getFormValues与类有冲突时，可以使用自定义名称替换getFormValues函数
            onMainFormSaveSuccess:"onMainFormSaveSuccess"  //同步保存时，主表单保存成功后
        }
    }

    //注册子表单到父表单中,
    registerSubForm(){
        //调用this.props.registerSubForm注册子表单到父表单中，父表单返回父表单this
        this.parentForm = this.props.registerSubForm(this.props.field_name,this,this.getRegisterSubFormOptions());
    }

    /**
     * 校验接口,提供给父表单保存前校验时调用
     * @param callback function(errors,values){
     *
     * } 交验后回调
     * @param options {
     *     btnName,触发按钮名称
     * }
     */
    // onValidate(options,callback){
    //      如果需要取父表单数据，可以通过this.parentForm.props.form.getFieldsValue()取到
    //     callback(errors,values); //如果校对通过则errors为null,否则为不通过描述，同form.validateFieldsAndScroll方法返回值
    // }

    /**
     * 保存接口，如果子表单需要异步保存时，实现此方法。父表单在保存时依次调用各子表单参数
     * @param options {
     *      iid, 主表单保存成功后表单数据iid
            btnName,  触发按钮
            formData, 保存前主表单数据
            mainFormSaveReturnData 保存后的主表单数
     * }
     * @param successCallback 保存成功后回调
     * @param errorCallback 保存失败后回调
     */
    // onSave(options,successCallback,errorCallback){
    // }


    /**
     * 获取表单数据，如果子表单需要同步保存时，实现此方法。父表单在保存时依次调用子表单此接口获取保存数据
     * @param options
     * {
     *      btnName,触发按钮名称
     * }
     * @parma callback  获取值成功后触发，返回子表单数据，子表单数据将会json化后赋值到field_name中传递到后台
     * : function(values){
     *
     * }
     */
    // getFormValues(options,callback){
    //     callback(values);
    // }

    /**
     * 保存成功后回调接口，如果子表单需要监听主表单同步保存后事件，实现此接口
     * @param options {
     *      iid, 主表单保存成功后表单数据iid
            btnName,  触发按钮
            formData, 保存前主表单数据
            mainFormSaveReturnData 保存后的主表单数
     * }
     */
    // onMainFormSaveSuccess(options){
    //
    // }
    render() {
        //由子类实现
    }
}



/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends SubForm.Component {
 *
 * }
 * CustomComponent = SubForm.createClass(CustomComponent);
 * @param newClass
 */
let createClass = function(newClass){
    // let wrapClass = connect(mapStateToProps,mapToDispatchToProps)(newClass);
    let wrapClass = newClass;
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(SubForm);