import React, { Component } from 'react'
import {requireFile} from "utils/utils";
import {vpQuery } from 'vpreact';

/**
 * 动态表单分发，根据表单定义自动分发到特定表单上
 * 使用方式
 * 1. 实体表单定义时，onLoad事件输入定制的页面地址比如：templates/DynamicForm/DynamicFormDispatcher
 * 2. 在功能链接中的将”属性“的功能链接改成templates/DynamicForm/DynamicFormDispatcher
 */
class DynamicFormDispatcher extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentWillMount() {
        this.getFormEvent();
    }

    /**
     * 平台配置onload作为表单转发地址
     */
    getFormEvent() {
        let {entityid, iid} = this.props;
        vpQuery('/{vpplat}/vfrm/entity/getformevent', {
            entityid: entityid, iid: iid, viewtype:""
        }).then((response) => {
            let defaultFormUrl = "templates/DynamicForm/DynamicForm"; //默认表单渲染地址
            let formUrl;
            if(response.data){
                formUrl = response.data.onload;
            }
            this.setState({
                formUrl: formUrl||defaultFormUrl
            });
        })
    }
    render() {
        if(!this.state.formUrl){
            return null;
        }
        let DynamicForm = requireFile(this.state.formUrl);
        return (
            <DynamicForm {...this.props} />
        )
    }
}
/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomForm extends DynamicForm.Component {
 *
 * }
 * CustomForm = DynamicForm.createClass(CustomForm);
 * @param newClass
 */
let createClass = function(newClass){
    let wrapClass = newClass;
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(DynamicFormDispatcher);