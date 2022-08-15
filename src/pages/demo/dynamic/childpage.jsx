import React, { Component } from 'react'; //必须引入，因为jsx最终会被编译成React调用函数
import { VpFormCreate, VpForm, VpFInput, VpButton, VpCheckbox, VpFRadio, VpRadio, VpRadioGroup ,VpFCheckbox,vpAdd  } from 'vpreact';

class Demo extends Component {

    constructor(props){
        super(props);

        this.parentForm = this.props.registerSubForm(this.props.field_name,this,{
            asyncSave: false, //是否是同时保存主子表，如果为true,则子表单类必须实现getFormValues接口,如果为false,则实现onSave接口
            onValidate:"onValidate", //如果默认的onValidate与类有冲突时，可以使用自定义名称替换onValidate函数
            onSave:"onMySave",  //如果默认的onSave与类有冲突时，可以使用自定义名称替换onSave函数
            getFormValues:"getFormValues", //如果默认的getFormValues与类有冲突时，可以使用自定义名称替换getFormValues函数
            onMainFormSaveSuccess:"onMainFormSaveSuccess"  //同步保存时，主表单保存成功后
        });
    }

    onValidate(options,callback){
        debugger;
        callback(null,null); //如果校对通过则errors为null,否则为不通过描述，同form.validateFieldsAndScroll方法返回值
    }

    onMySave(options,successCallback,errorCallback){
        debugger
        successCallback();
    }

    getFormValues(options,callback){
        debugger
        callback({
            name:'xxxx'
        });
    }

    componentWillMount() {

    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
        let url = '{bjyh}/save';
        vpAdd(url, this.props.form.getFieldsValue()).then( (response) => {
            debugger;
            this.setState({
                id:'1'
            })
        });
    }
    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <div>子页面</div>
        )
    }
}
Demo = VpFormCreate(Demo);
export default Demo;