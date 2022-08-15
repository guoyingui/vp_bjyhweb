import React, {Component} from "react";
import {VpFormCreate, VpInput,VpForm,VpRow,VpCol,VpFCollapse,VpPanel,FormItem,VpButton,vpAdd,VpAlertMsg } from 'vpreact';
import {requireFile} from "utils/utils";
import Form from "../templates/dynamic/Form/Form"


class CustomForm extends Form.Component {
    constructor(props) {
        super(props);
        this.state ={
        }

        this.handlerSave = this.handlerSave.bind(this);
    }

    getFormRenderData(){
        let formData = {
            "groups": [{
                //组定义，可以定义多个组
                "group_label": "组固定",
                "group_type": 0, //组类型，0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                "fields": [{
                    //单个控件定义，每个控件的数据格式不一样，具体控件数据格式详见：Widgets中的控件定义，如selectmodel的控件数据格式如下
                    widget_type: 'text', //控件类型
                    field_name: "sname", //控件名称，英文名称，跟表字段对应的
                    all_line: 1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
                    props: { //控件自身属性
                        labelCol: {span: 6}, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
                        wrapperCol: {span: 14}, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
                        readOnly: false, //是否只读
                        label: '名称',  //label值
                    },
                    fieldProps: { //控件在表单中的属性
                        rules: [], //校验规则，参考https://github.com/yiminghe/async-validator
                        initialValue: '这是一个输入框', //默认值，
                        onChange: function (value) {
                        }  //控件值变化时触发
                    }
                },{
                    //单个控件定义，每个控件的数据格式不一样，具体控件数据格式详见：Widgets中的控件定义，如selectmodel的控件数据格式如下
                    widget_type: 'text', //控件类型
                    field_name: "sname", //控件名称，英文名称，跟表字段对应的
                    all_line: 1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
                    props: { //控件自身属性
                        labelCol: {span: 6}, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
                        wrapperCol: {span: 14}, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
                        readOnly: false, //是否只读
                        label: '名称22',  //label值
                    },
                    fieldProps: { //控件在表单中的属性
                        rules: [], //校验规则，参考https://github.com/yiminghe/async-validator
                        initialValue: '这是一个输入框222', //默认值，
                        onChange: function (value) {
                        }  //控件值变化时触发
                    }
                }]
            }, {
                //组定义，可以定义多个组
                "group_label": "节默认展开",
                "group_type": 1, //组类型，0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                "fields": [{
                    //单个控件定义，每个控件的数据格式不一样，具体控件数据格式详见：Widgets中的控件定义，如selectmodel的控件数据格式如下
                    widget_type: 'text', //控件类型
                    field_name: "sname1", //控件名称，英文名称，跟表字段对应的
                    all_line: 1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
                    props: { //控件自身属性
                        labelCol: {span: 6}, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
                        wrapperCol: {span: 14}, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
                        readOnly: false, //是否只读
                        label: '名称',  //label值
                    },
                    fieldProps: { //控件在表单中的属性
                        rules: [], //校验规则，参考https://github.com/yiminghe/async-validator
                        initialValue: '这是一个节默认展开输入框', //默认值，
                        onChange: function (value) {
                        }  //控件值变化时触发
                    }
                }]
            }, {
                //组定义，可以定义多个组
                "group_label": "节默认收起",
                "group_type": 2, //组类型，0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                "fields": [{
                    //单个控件定义，每个控件的数据格式不一样，具体控件数据格式详见：Widgets中的控件定义，如selectmodel的控件数据格式如下
                    widget_type: 'text', //控件类型
                    field_name: "sname2", //控件名称，英文名称，跟表字段对应的
                    all_line: 1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
                    props: { //控件自身属性
                        labelCol: {span: 6}, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
                        wrapperCol: {span: 14}, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
                        readOnly: false, //是否只读
                        label: '名称',  //label值
                    },
                    fieldProps: { //控件在表单中的属性
                        rules: [], //校验规则，参考https://github.com/yiminghe/async-validator
                        initialValue: '这是一个节默认收起输入框', //默认值，
                        onChange: function (value) {
                        }  //控件值变化时触发
                    }
                }]
            }, {
                //组定义，可以定义多个组
                "group_label": "节标题不显示",
                "group_type": 3, //组类型，0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                "fields": [{
                    //单个控件定义，每个控件的数据格式不一样，具体控件数据格式详见：Widgets中的控件定义，如selectmodel的控件数据格式如下
                    widget_type: 'text', //控件类型
                    field_name: "sname3", //控件名称，英文名称，跟表字段对应的
                    all_line: 1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
                    props: { //控件自身属性
                        labelCol: {span: 6}, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
                        wrapperCol: {span: 14}, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
                        readOnly: false, //是否只读
                        label: '名称',  //label值
                    },
                    fieldProps: { //控件在表单中的属性
                        rules: [], //校验规则，参考https://github.com/yiminghe/async-validator
                        initialValue: '这是一个节标题不显示输入框', //默认值，
                        onChange: function (value) {
                        }  //控件值变化时触发
                    }
                }]
            }, {
                //组定义，可以定义多个组
                "group_label": "节和属性隐藏不显示",
                "group_type": 4, //组类型，0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                "fields": [{
                    //单个控件定义，每个控件的数据格式不一样，具体控件数据格式详见：Widgets中的控件定义，如selectmodel的控件数据格式如下
                    widget_type: 'text', //控件类型
                    field_name: "sname4", //控件名称，英文名称，跟表字段对应的
                    all_line: 1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
                    props: { //控件自身属性
                        labelCol: {span: 6}, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
                        wrapperCol: {span: 14}, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
                        readOnly: false, //是否只读
                        label: '名称',  //label值
                    },
                    fieldProps: { //控件在表单中的属性
                        rules: [], //校验规则，参考https://github.com/yiminghe/async-validator
                        initialValue: '这是一个节和属性隐藏不显示输入框', //默认值，
                        onChange: function (value) {
                        }  //控件值变化时触发
                    }
                }]
            }, {
                //组定义，可以定义多个组
                "group_label": "同步保存表单类型1",
                "group_type": 1, //组类型，0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                "fields": [{
                    "widget_type": "childpage",
                    "url": "sample/form/customSubForm",
                    field_name: "childpage1",
                    "urltype": "0",
                    "height": 600,
                    param: {
                        field_name: 'childpage1'
                    }
                }]
            },{
                //组定义，可以定义多个组
                "group_label": "异步保存表单类型2",
                "group_type": 1, //组类型，0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                "fields": [{
                    "widget_type": "childpage",
                    "url": "sample/form/customUnAsyncSubForm",
                    field_name:"childpage2",
                    "urltype": "0",
                    "height": 600,
                    param:{
                        field_name:'childpage2'
                    }
                }]
             }
            ]
        }
        return formData;
    }

    /**
     * 重写表单保存数据接口
     * @returns {{iid: string, sparam: string}}
     */
    getFormData()  {
        let formData;
        let sparam = super.getFormData();
        let iid = this.state.newiid;
        return {
            sparam: JSON.stringify(sparam),
            iid: iid
        }
    }

    handlerSave(){
        this.submit("ok",{
            onSaveSuccess:function({mainFormSaveReturnData,btnName}) {
                VpAlertMsg({
                    message: "消息提示",
                    description: '操作成功！',
                    type: "success",
                    closeText: "关闭",
                    showIcon: true
                }, 5);
            },
            onSave:function(formData,successCallback,errorCallback){
                vpAdd("{vpczccb}/sample/form/save",formData)
                    .then( (data) => {
                        successCallback(data.data.iid,data);
                    });
            }
        });
    }

    render() {
        return (
            super.render()
        )
    }
}
export default VpFormCreate(CustomForm);