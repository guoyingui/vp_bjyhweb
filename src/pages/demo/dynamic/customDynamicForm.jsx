import React, {Component} from "react";
import DynamicForm from "../../templates/dynamic/DynamicForm/DynamicForm";
import {parseValidator} from "../../templates/dynamic/Form/Widgets";
import {requireFile} from "../../../script/utils";

class CustomDynamicForm2 extends DynamicForm.Component{
    constructor(props){
        super(props);
    }

    getCustomSaveUrl(){
        return "/save";
    }
    /**
     * 自定义按钮
     * @returns {*[]}
     */
    getCustomeButtons() {
        let _this = this;
        let button1 = {
            name:"button1",
            text:"不校验",
            /**
             * 是否启用校验：
             * true : 使用默认的校验函数，
             * false: 不校验
             * function(_thisform,callback){} //自定义校验
             */
            validate:false,
            /**
             * 事件处理
             * @param values 表单值
             * @param _thisform 当前表单实例
             */
            handler:function(values,_thisform){
                debugger;
            }
        };
        let button2 = {
            name:"button2",
            text:"自定义校验",
            /**
             * 自定义校验函数
             * @param _thisform 当前表单实例
             * @param callback
             */
            validate:function(_thisform,callback){
                debugger;
                let form = _thisform.props.form;
                form.validateFields(["priceInput"],callback);
            },
            handler:function(values,_thisform){
                debugger;
            }
        }

        return [{
            name:"ok"
        },"status",button1,button2,{
            name:"cancel",
            handler:function(values,_thisform){
                _this.cancelModal();
            }
        }];
    }
    /**
     * 自定义控件及行为
     */
    onDataLoadSuccess = formData => {

        //插入控件
        let groups = formData.groups;
        let groupIndex = 0;
        let fieldIndex = groups[0].fields.length;

        debugger;
        let snameData = formData.findWidgetByName("sname");
        snameData.field.fieldProps.initialValue = "aaa";
        //
        // formData.insertNewWidget({groupIndex,fieldIndex},{
        //     "field_name":"priceInput",
        //     "widget_type":"priceInput",
        //     all_line:1,
        //     props:{
        //         "label": "价格输入",
        //         labelCol: { span: 6 },
        //         wrapperCol: { span: 14 },
        //     },
        //     fieldProps:{
        //         initialValue:{
        //             number:10,
        //             currency:"dollar"
        //         },
        //         rules:[{
        //             required:true
        //         }]
        //     }
        // });

        //插入部门控件
        formData.insertNewWidget({groupIndex,fieldIndex:++fieldIndex},{
            "field_name":"selectOrg",
            "widget_type":"selectmodel",
            all_line:1,
            props:{
                "label": "部门",
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                iconstraint:1,
                irelationentityid:1,
                modalProps:{
                    url:'templates/Form/ChooseEntity'
                },
                initialName:'新维数联',
            },
            fieldProps:{
                rules:[{
                    required:true
                }],
                initialValue : "1",
            }
        });

        //插入用户控件
        formData.insertNewWidget({groupIndex,fieldIndex:++fieldIndex},{
            "field_name":"selectUser",
            "widget_type":"selectmodel",
            all_line:1,
            props:{
                "label": "用户",
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                iconstraint:1,
                irelationentityid:2,
                modalProps:{
                    url:'templates/Form/ChooseEntity'
                },
                initialName:'管理员',
            },
            fieldProps:{
                rules : [],
                initialValue : "1",
            }
        });



        let optionsData1 = [{"value": "0","label": "北京"},{"value": "1","label": "上海"},{"value":"4","label":"隐藏价格输入"}];
        let optionsData2 = [{"value": "2","label": "杭州"},{"value": "3","label": "武汉"}];

        formData.insertNewWidget({groupIndex,fieldIndex:++fieldIndex},{
            "field_name":"select",
            "widget_type":"select",
            all_line:1,
            props:{
                "label": "根据部门动态调整下拉框值",
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                optionsData:optionsData1
            },
            fieldProps:{
                initialValue:"0",
            }
        });

        //控件级联动作
        let seldeptWidget = formData.findWidgetByName("selectOrg"); //部门控件
        let seluserbydeptWidget = formData.findWidgetByName("selectUser"); //问题负责人控件
        let selectWidget = formData.findWidgetByName("select"); //下拉控件
        let selectPriceInput = formData.findWidgetByName("priceInput"); //下拉控件

        let count = 0;
        seldeptWidget.field.fieldProps.onChange = function(value){
            //部门值变化时，替换下拉控件值
            if(value === '1'){
                selectWidget.field.fieldProps.initialValue = "1";
                selectWidget.field.props.optionsData = optionsData1;
            }else{
                selectWidget.field.fieldProps.initialValue = "3";
                selectWidget.field.props.optionsData = optionsData2;
            }

            //部门值变化时，用户实体选择范围变化
            if(value === '1'){
                seluserbydeptWidget.field.props.modalProps.url = "templates/Form/ChooseEntity";
            }else{
                seluserbydeptWidget.field.props.modalProps.url = "sample/customizedChooseEntity";
            }
        }

        selectWidget.field.fieldProps.onChange = function(value){
            if(value === "4"){
                //隐藏价格输入
                selectPriceInput.field.hidden = true;
            }else{
                selectPriceInput.field.hidden = false;
            }
        }


        // formData.insertNewWidget({groupIndex,fieldIndex:++fieldIndex},{
        //     "field_name":"childpage",
        //     "widget_type":"childpage",
        //     all_line:1,
        //     props:{
        //         "label": "根据部门动态调整下拉框值",
        //         labelCol: { span: 6 },
        //         wrapperCol: { span: 14 },
        //         optionsData:optionsData1
        //     },
        //     fieldProps:{
        //         initialValue:"0",
        //     }
        // });


        return formData;
    }

    onBeforeSave = formData =>{

    }
}
CustomDynamicForm2 = DynamicForm.createClass(CustomDynamicForm2);
export default CustomDynamicForm2;