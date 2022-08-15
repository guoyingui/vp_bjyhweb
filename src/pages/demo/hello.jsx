import React, { Component } from 'react'; //必须引入，因为jsx最终会被编译成React调用函数
import { VpFormCreate, VpForm, VpFInput, VpButton, VpCheckbox, VpFRadio, VpRadio, VpRadioGroup ,VpFCheckbox,vpAdd  } from 'vpreact';

class Demo extends Component {
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
            <VpForm horizontal onSubmit={this.handleSubmit}>
                <div>
                    <VpFInput
                        disabled
                        label="id"
                        {...formItemLayout}
                        {...getFieldProps('id')}
                        placeholder="ID" />
                    <VpFInput
                        disabled
                        label="用户名"
                        {...formItemLayout}
                        {...getFieldProps('userName1')}
                        placeholder="请输入用户名" />
                    <VpFInput
                        label="密码"
                        type="password"
                        {...formItemLayout}
                        {...getFieldProps('password1')}
                        placeholder="请输入密码" />
                    <VpFRadio
                        {...formItemLayout}
                        {...getFieldProps('radio', { initialValue: '单选2' })}
                        label="测试单选">
                        <VpRadioGroup defaultValue={1}>
                            <VpRadio key="a" value={1}>Option A</VpRadio>
                            <VpRadio key="b" value={2}>Option B</VpRadio>
                            <VpRadio key="c" value={3}>Option C</VpRadio>
                        </VpRadioGroup>
                    </VpFRadio>
                    <VpFInput
                        label="备注"
                        type="textarea"
                        {...formItemLayout}
                        {...getFieldProps('textarea1')}
                        rows={5}
                        placeholder="随便写点儿啥" />
                    <VpFCheckbox
                        label="卖身华府"
                        {...formItemLayout}
                        {...getFieldProps('agree')}
                        options={[
                            {label: '同意', value: 'agree'},
                            {label: '同意',value: 'disabled',disabled:true}
                        ]} />
                    <div className="ant-row ant-form-item" style={{marginTop:24}}>
                        <div className="ant-col-16 ant-col-offset-6">
                            <div className="ant-form-item-control ">
                                <VpButton style={{marginTop: 2}} type="primary" htmlType="submit">确定</VpButton>
                            </div>
                        </div>
                    </div>
                </div>
            </VpForm>
        )
    }
}
Demo = VpFormCreate(Demo);
export default Demo;