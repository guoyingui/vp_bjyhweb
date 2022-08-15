import React,{Component} from 'react';
import {VpSpin
    ,VpIcon
    ,VpIconFont
    ,VpInput
    ,VpFInput
    ,VpInputNumber
    ,VpFInputNumber
    ,VpCheckbox
    ,VpFCheckbox
    ,VpRadioGroup
    ,VpFRadio
    ,VpRadio
    ,VpFSelect
    ,VpSelect
    ,VpSwitch
    ,VpFSwitch
    ,VpCascader
    ,VpFCascader
    ,VpSlider
    ,VpFSlider
    ,VpDatePicker
    ,VpFDatePicker
    ,VpRangePicker
    ,VpFRangePicker
    ,VpTimePicker
    ,VpFTimePicker
    ,VpFUpload
    ,VpModal
    ,VpCollapse
    ,EditableCol
    ,VpEditColTable
    ,VpTable1
    ,VpTreeSelect
    ,VpDropdown
    ,VpCalendar
    ,VpIframeRouter
    ,VpIframe
    ,VpLink
    /*,VpFUploader*/
    ,VpUEditor
    ,VpFUEditor
    ,VpInputUploader
    ,VpConfirmTag
    ,FormItem
    ,VpTable
    ,VpTooltip
} from "vpreact";

import {VpDTabs,EditTableCol} from 'vpbusiness';

import VpChooseModal from './VpChooseModal';

import {requireFile} from 'utils/utils';

import {VpFUploader} from './VpFUploader';

/**
 * 实体表单定义的数据转换成控件参数
 * @type {{}}
 */
const widgetPropsTransforms = {

}
/**
 *
 * @param type 控件类型
 * @param widget 控件类
 */
export const registerWidget = function(type,widget){
    let types = type.split(",");
    types.forEach((type) => {
        widgets[type] = widget;
    });
}
/**
 * 注册数据转换器，将实体表单定义的数据转换成控件参数
 * @param type
 * @param transform 实体定义的表单数据
 * @return 控件参数
 */
export const registerWidgetPropsTransform = function(type,transform){
    let types = type.split(",");
    types.forEach((type) => {
        widgetPropsTransforms[type] = transform;
    });
}

/**
 * 获取实体表单定义转控件属性函数
 * @param type
 * @returns {*}
 */
export const getWidgetPropsTransform = function(type){
    return widgetPropsTransforms[type];
}



/**
 * 从表单控件定义数据中，根据名称获取控件位置，方便在控件前、后插入新的控件
 * @param formWidgets 是Widgets.formDataToWidgetProps转换成控件属性后的数据
 */
export const  findWidgetByName = function(name){
    let formWidgets = this;
    if(!formWidgets.groups){
        return null;
    }
    let formData = formWidgets.groups;
    let result;
    for(let groupIndex=0; groupIndex< formData.length; groupIndex++){
        let groupItem = formData[groupIndex];
        let fields =  groupItem.fields;
        for(let fieldIndex=0; fieldIndex<fields.length; fieldIndex++){
            let fieldItem = fields[fieldIndex];

            let fieldName = fieldItem.field_name;
            if(fieldName == name){
                result = {
                    groupIndex:groupIndex,
                    fieldIndex:fieldIndex,
                    field:fieldItem
                }
               return result;
            }
        }
    }
    return null;
}

/**
 * 在指定位置插入新的元素
 * @param formWidgets
 * @param name
 * @param newWidget
 */
function insertNewWidget(pos,newWidget){
    let formWidgets = this;
    if(!formWidgets.groups){
        formWidgets.groups = [{
            fields:[]
        }];
    }
    if(!formWidgets.groups.fields){
        formWidgets.groups.fields = [];
    }
    let groups = formWidgets.groups;
    let group;
    if(groups.length < pos.groupIndex){
        group = {
            fields:[]
        };
        groups.push(group);
    }else{
        group = groups[pos.groupIndex];
    }

    if(group.fields.length < pos.fieldIndex ){
        group.fields.push(newWidget);
    }else{
        group.fields.splice(pos.fieldIndex,0,newWidget);
    }
}

/**
 * 表单定义数据转换成控件属性，
 * @param formData 实体表单定义参考VpDynamicForm.json
 * @return 返回表单控件定义json, 表单控件定义参考各表单控件注册信息
 */
export const formDataToWidgetProps = function(formData,_thisform){
    let widgetProps = {
    };
    widgetProps.insertNewWidget = insertNewWidget.bind(widgetProps);
    widgetProps.findWidgetByName = findWidgetByName.bind(widgetProps);

    var groups = widgetProps.groups = [];
    formData = formData.groups || [];
    formData.forEach((groupItem, groupIndex) => {
        let newItem = {};
        for(let key in groupItem){
            if(key != 'fields' && groupItem.hasOwnProperty(key)){
                //除key='fields'(字段定义)外，其它属性复制到新对象上
                newItem[key] = groupItem[key];
            }
        }
        newItem.fields = [];
        groupItem.fields.forEach((fieldItem, fieldIndex) => {
            let widget_type = fieldItem.widget_type;
            let transform = getWidgetPropsTransform(widget_type);
            if(transform){
                //如果有转换函数，使用转换函数转换
                var newFieldProps = transform(fieldItem,_thisform);
                newFieldProps.widget_type = widget_type;
                newFieldProps.field_name = fieldItem.field_name;
                newItem.fields.push(newFieldProps)
            }else{
                //如果没有转换函数，直接返回默认值
                newItem.fields.push({...fieldItem});
            }
        });
        groups.push(newItem);
    });
    return widgetProps;
}

/**
 * 从实体表单数据中提取通用的控件属性
 * @param formData
 * @param _thisform
 */
export const getCommonWidgetPropsFromFormData = function(props,_thisform){
    /**
     *
     * react控件属性有两种：
     * 1. props:{}, 直接写在控件后面的，如<Input type="text" />
     * 2. fieldProps:{} 使用getFieldProps注册时的，如getFieldProps(options.field_name, {initialValue: default_value});
     *
     */
    let {widget={},onchange,all_line,readonly,validator,widget_type,...otherProps} = props;
    return {
        widget_type:widget_type,
        field_name:otherProps.field_name,
        all_line:all_line,
        props:{
            ...otherProps,
            ...formItemLayout(all_line),
            readOnly:readonly,
            label:props.field_label
        },
        fieldProps:{
            rules : parseValidator(props),
            initialValue : widget.default_value,
            onChange: onchange?_thisform[onchange]:undefined
        }
    }
}

/**
 * 控件注册
 * @type {{}}
 */
const widgets = {
}

/**
 * 获取表单控件
 * @param type
 * @param options
 * @param _thisform
 * @returns {*}
 */
export const getWidget = function(type,options,_thisform){
    var widget = widgets[type];
    if(widget){
        return widget(options,_thisform);
    }
}


/**
 * 表单元素label与控件布局
 * @param all_line
 * @returns {{wrapperCol: {span: number}, labelCol: {span: number}}}
 */
const formItemLayout = (all_line) => {
    let formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };
    let formItemLayoutAllLine = {
        labelCol: { span: 3 },
        wrapperCol: { span: 19 }
    };
    return all_line==2?formItemLayoutAllLine:formItemLayout;
}


/**
 * 通用的获取控件属性
 * @param options
 * @param _thisform
 */
function getFieldProps(options,_thisform){
    const {getFieldProps} = _thisform.props.form;
    let fieldProps = getFieldProps(options.field_name,options.fieldProps);
    return {
        ...(options.props||{}),
        ...fieldProps
    }
}

/**
 * 将value变成string类型
 * @param value
 * @returns {*|string}
 */
function parseString(value) {
    let newValue = value;
    if(newValue == null){
        return newValue;
    }
    if(value instanceof Array){
        newValue = value.map(item => item.toString()).join(',')
    }else{
        newValue = newValue.toString();
    }
    return newValue
}

/**
 * 将值变成array
 * @param value
 * @returns {*}
 */
function parseArray(value){
    let newValue = value;
    if(!value){
        return [];
    }
    if(value instanceof Array){
        newValue = value.map(item => item.toString());
    }else{
        newValue = newValue.toString().split(",");
    }
    return newValue;
}

export const parseValidator = function(item){
    let validator = [];
    var type = item.widget_type;
    if (item.hasOwnProperty('validator')) {
        let hasProp = false;
        for (let key in item.validator) {
            hasProp = true;
            break;
        }
        if(type === "number"){
            // item.validator.type = "number";
            const min = item.validator.rMin || item.validator.min;
            const max = item.validator.rMax || item.validator.max;
            item.validator.rMin = min;
            item.validator.rMax = max;
            delete item.validator.max;
            delete item.validator.min;
            if(min !== undefined || max !== undefined){
                validator.push({ validator: (rule, value, callback) => {
                        const message = item.validator.message;
                        const nowValue = parseFloat(value);
                        let err = false;
                        if(!err && min !== undefined){
                            if(min > nowValue){
                                callback(message);
                                err = true
                            }
                        }
                        if(!err && max !== undefined){
                            if(max < nowValue){
                                callback(message);
                                err = true
                            }
                        }
                        if(!err){
                            callback()
                        }
                    }})
            }
        }
        validator = hasProp ? [...validator, item.validator] : validator;
    }
    return validator;
}



/**
 * 文本控件
 * @param props {
    "all_line": 1,
    "widget_type": "text", //控件类型，text,hidden,textarea,password
    "field_label": "名称", //字段标签
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"message": "请输入5~200个字符!", "max": 200,"min": 5, "required": true}, //校验
    "widget": {"default_value": "Visual 应用平台项目", "default_label": "Visual 应用平台项目"}
   }
 */
registerWidgetPropsTransform("text,hidden,textarea,password",function(props,_thisform){
    var newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    newProps.props.autoComplete = props.widget_type == "password" ? "new-password" : "on";
    if(props.widget_type === 'hidden'){
        newProps.hidden = true;
        newProps.props.hidden=true;
    }
    newProps.props.type = props.widget_type;
    return newProps;
});
/**
 * @param options {
        widget_type:'text', //控件类型，text,textarea,password
        field_name:"sname", //控件名称，英文名称，跟表字段对应的
        all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
        props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : '1', //默认值
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 */
registerWidget("text,hidden,textarea,password",function(options,_thisform){
    let rules=options.fieldProps.rules;
    if(null!=rules && rules!=undefined){
        // rules.push({validator:blank});
        for(let i=0;i<rules.length;i++){
            if(rules[i].hasOwnProperty('required') && rules[i].required){
                rules[i].pattern='[a-zA-Z0-9\u4e00-\u9fa5!@#$%^&\\*()_\\-]+';
                options.fieldProps.rules=rules;
                break;
            }
        }
    }
    var fieldProps = getFieldProps(options,_thisform);
    return <VpFInput {...fieldProps}/>
});

/**
 * @param options {
 *
 * }
 */
registerWidget("richtext",function(options,_thisform){
    var fieldProps = getFieldProps(options,_thisform);
    return <VpFUEditor config={{scaleEnabled:true}} id={options.field_name}
                       form={_thisform.props.form} item={options}
                       label={options.field_label} {...fieldProps}/>
});

/**
 * 日期控件
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "date", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "default_value": "2018-05-28" //默认值，格式为yyyy-MM-dd
    }
 * }
 */
registerWidgetPropsTransform("date",function(props,_thisform){
    var newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    newProps.props.format = props.format || 'yyyy-MM-dd';
    return newProps;
});
/**
 * 日期控件，
 * @param options {
       widget_type:'date', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : "2018-05-28" //默认值，格式为yyyy-MM-dd
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 * 时间格式化工具：
    import { formatDateTime } from 'utils/utils';
    formatDateTime(new Date()); // '2018-08-29 9:22:00'
    具体说明见：http://www.vpsoft.cn:8082/apiweb/#/VpDealDate?_k=e4vey0
 */
registerWidget("date",function(options,_thisform){
    var fieldProps = getFieldProps(options,_thisform);
    return <VpFDatePicker {...fieldProps} />
});
/**
 * 日期时间控件
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "datetime", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "default_value": "2018-05-28 00:00:00" //默认值，格式为yyyy-MM-dd HH:mm:ss
    }
 * }
 */
registerWidgetPropsTransform("datetime",function(props,_thisform){
    var newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    newProps.props.format = props.format || 'yyyy-MM-dd HH:mm:ss';
    return newProps;
});
/**
 * 日期时间控件
 * @param options {
       widget_type:'datetime', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : "2018-05-28 00:00:00" //默认值，格式为yyyy-MM-dd HH:mm:ss
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 *  时间格式化工具：
 import { formatDateTime } from 'utils/utils';
 formatDateTime(new Date()); // '2018-08-29 9:22:00'
 具体说明见：http://www.vpsoft.cn:8082/apiweb/#/VpDealDate?_k=e4vey0
 */
registerWidget("datetime",function(options,_thisform){
    var fieldProps = getFieldProps(options,_thisform);
    return <VpFDatePicker {...fieldProps} showTime />
});
/**
 * 日期范围控件，
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "rangedate", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "default_value": ['2018-05-28','2018-05-30'] //默认值，格式为[开始日期，结束日期]
    }
 * }
 */
registerWidgetPropsTransform("rangedate",function(props,_thisform){
    var newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    return newProps;
});
/**
 * 日期时间控件
 * @param options {
       widget_type:'rangedate', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : ['2018-05-28','2018-05-30'] //默认值，格式为[开始日期，结束日期]
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 *  时间格式化工具：
 import { formatDateTime } from 'utils/utils';
 formatDateTime(new Date()); // '2018-08-29 9:22:00'
 具体说明见：http://www.vpsoft.cn:8082/apiweb/#/VpDealDate?_k=e4vey0
 */
registerWidget("rangedate",function(options,_thisform){
    var fieldProps = getFieldProps(options,_thisform);
    return (
        <VpFRangePicker {...fieldProps} />
    );
});
/**
 * 将时间范围控件的平台数据转换成前端控件数据格式
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "rangedatetime", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "default_value": ['2018-05-28 00:00:00','2018-05-30 00:00:00'] //默认值，格式为[开始日期时间，结束日期时间]
    }
 * }
 * @return 见rangedatetime控件的数据格式
 */
registerWidgetPropsTransform("rangedatetime",function(props,_thisform){
    var newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    return newProps;
});
/**
 * 注册日期时间控件
 * @param options {
       widget_type:'rangedatetime', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : ['2018-05-28 00:00:00','2018-05-30 00:00:00'] //默认值，格式为[开始日期时间，结束日期时间 ]
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 *  时间格式化工具：
 import { formatDateTime } from 'utils/utils';
 formatDateTime(new Date()); // '2018-08-29 9:22:00'
 具体说明见：http://www.vpsoft.cn:8082/apiweb/#/VpDealDate?_k=e4vey0
 */
registerWidget("rangedatetime",function(options,_thisform){
    var fieldProps = getFieldProps(options,_thisform);
    return (
        <VpFRangePicker {...fieldProps} showTime/>
    );
});
/**
 * 将时间控件的平台数据转换成前端控件数据格式
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "time", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "default_value": '00:00:00'//默认值，格式为HH:mm:ss
    }
 * }
 * @return 见rangedatetime控件的数据格式
 */
registerWidgetPropsTransform("time",function(props,_thisform){
    var newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    return newProps;
});
/**
 * 注册时间控件
 * @param options {
       widget_type:'time', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : '00:00:00' //默认值，格式为HH:mm:ss
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 *  时间格式化工具：
 import { formatDateTime } from 'utils/utils';
 formatDateTime(new Date()); // '2018-08-29 9:22:00'
 具体说明见：http://www.vpsoft.cn:8082/apiweb/#/VpDealDate?_k=e4vey0
 */
registerWidget("time",function(options,_thisform){
    var fieldProps = getFieldProps(options,_thisform);
    return (
        <VpFTimePicker {...fieldProps}/>
    );
});


/**
 * 将滑动控件的平台数据转换成前端控件数据格式
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "slider", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "default_value": '1'//默认值，格式为HH:mm:ss
    }
 * }
 * @return 见slider控件的数据格式
 */
registerWidgetPropsTransform("slider",function(props,_thisform){
    var newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    return newProps;
});
/**
 * 注册滑动控件
 * @param options {
       widget_type:'slider', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : '1' //默认值，
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 */
registerWidget("slider",function(options,_thisform){
    var fieldProps = getFieldProps(options,_thisform);
    return <VpFSlider {...fieldProps} />
});

let _optionsValToString = function(optionsData){
    if(!optionsData){
        return optionsData;
    }
    optionsData.map((item,index) => {
        //将值中的value转成string
        if(item.value != null){
            item.value =  item.value.toString();
        }
        if(item.children && item.children.length > 0){
            item.children = _optionsValToString(item.children);
        }
        return item;
    });
    return optionsData;
}

/**
 * 将下拉（select）控件的平台数据转换成前端控件数据格式
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "select", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "default_value": '1',//默认值-value
        "default_label": "武汉", //默认值描述-label
        "load_template":[{
                "value":1,  //下拉选项值
                "label":"武汉" //下拉选项值描述
        }],
    }
 * }
 * @return 见select控件的数据格式
 */
registerWidgetPropsTransform("select",function(props,_thisform){
    let {widget={},multiple} = props;
    let {load_template=[],default_value} = widget;
    var newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    newProps.props.optionsData = load_template;
    newProps.fieldProps.initialValue = multiple?parseArray(default_value):parseString(default_value);
    return newProps;
});

/**
 * 注册选择控件
 * @param options {
       widget_type:'select', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
            initialName:'武汉', //初始值描述
            optionsData:[{  //下拉选项
                "value":1,  //下拉选项值
                "label":"武汉" //下拉选项值描述
            }],
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : '1' //默认值，
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 */
registerWidget("select",function(options,_thisform){
    options.fieldProps.initialValue = options.props.multiple?parseArray(options.fieldProps.initialValue):parseString(options.fieldProps.initialValue);
    _optionsValToString(options.props.optionsData);
    let {label,labelCol,wrapperCol,...fieldProps} = getFieldProps(options,_thisform);
    return (
        <VpFSelect label={label} labelCol={labelCol} wrapperCol={wrapperCol} >
            <VpSelect {...fieldProps}></VpSelect>
        </VpFSelect>
    );
});

/**
 * 将多选下拉（multiselect）控件的平台数据转换成前端控件数据格式
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "select", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "default_value": '1,2',//默认值-value
        "load_template":[{
                "value":1,  //下拉选项值
                "label":"武汉" //下拉选项值描述
        }],
    }
 * }
 * @return 见select控件的数据格式
 */
registerWidgetPropsTransform("multiselect",function(props,_thisform){
    props.multiple = true;
    var newProps = getWidgetPropsTransform("select")(props,_thisform);
    return newProps;
});
/**
 * 注册多选选择控件
 * @param options {
       widget_type:'select', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
            optionsData:[{  //下拉选项
                "value":1,  //下拉选项值
                "label":"武汉" //下拉选项值描述
            }],
            multiple:true,  //multiple必须为true,为false时，为单选框
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : '1' //默认值，
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 */
registerWidget("multiselect",function(options,_thisform){
    options.multiple = true;
    return getWidget("select",options,_thisform);
});

/**
 * 将级联控件（cascadeselect）的平台数据转换成前端控件数据格式
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "select", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "load_template": [
            { "value": "zhejiang", "label": "浙江", "children": [
                { "value": "hangzhou", "label": "杭州", "children": [
                    { "value": "xihu", "label": "西湖" }
                    ,{ "value": "leifengta", "label": "雷峰塔" }
                ]
                }]
            },
            { "value": "jiangsu", "label": "江苏","disabled": true, "children": [
                { "value": "nanjing", "label": "南京", "children": [
                    { "value": "zhonghuamen", "label": "中华门" }]
                }]
            }
        ],
        "default_value": "zhejiang,hangzhou,xihu",
    }
 * }
 * @return 见select控件的数据格式
 */
registerWidgetPropsTransform("cascadeselect",function(props,_thisform){
    let {widget={},multiple} = props;
    let {load_template=[],default_value} = widget;
    var newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    newProps.fieldProps.initialValue = parseArray(default_value);
    newProps.props.options = load_template;
    return newProps;
});
/**
 * 注册级联控件
 * @param options {
       widget_type:'cascadeselect', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
            //options 级联选项
            options:[{ "value": "zhejiang", "label": "浙江", "children": [
                { "value": "hangzhou", "label": "杭州", "children": [
                    { "value": "xihu", "label": "西湖" }
                    ,{ "value": "leifengta", "label": "雷峰塔" }
                ]
                }]
            },
            { "value": "jiangsu", "label": "江苏","disabled": true, "children": [
                { "value": "nanjing", "label": "南京", "children": [
                    { "value": "zhonghuamen", "label": "中华门" }]
                }]
            }],
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : 'zhejiang,hangzhou,xihu' //默认值，
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 */
registerWidget("cascadeselect",function(options,_thisform){
    _optionsValToString(options.props.options);
    var fieldProps = getFieldProps(options,_thisform);
    return <VpFCascader {...fieldProps}/>
});

/**
 * 将单选控件（radio）的平台数据转换成前端控件数据格式
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "radio", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "load_template": [{  //下拉选项
                "value":'1',  //下拉选项值
                "label":"单选1" //下拉选项值描述
        },{
                "value":'2',  //下拉选项值
                "label":"单选2" //下拉选项值描述
        }],
        "default_value": "1",
    }
 * }
 * @return 见radio控件的数据格式
 */
registerWidgetPropsTransform("radio",function(props,_thisform){
    let {widget={}} = props;
    let {load_template=[],default_value} = widget;
    let newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    newProps.props.options_ = load_template;
    return newProps;
});

/**
 * 注册单选控件
 * @param options {
       widget_type:'radio', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
            //options 级联选项
            options:[{  //下拉选项
                "value":'1',  //下拉选项值
                "label":"单选1" //下拉选项值描述
            },{
                "value":'2',  //下拉选项值
                "label":"单选2" //下拉选项值描述
            }],
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : '1' //默认值，
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 */
registerWidget("radio",function(options,_thisform){
    options.fieldProps.initialValue = parseString(options.fieldProps.initialValue);
    _optionsValToString(options.props.options_);
    var fieldProps = getFieldProps(options,_thisform);
    var radioItems = options.props.options_ || [];
    return (
        <VpFRadio {...fieldProps}>
            <VpRadioGroup {...fieldProps}>
                { radioItems.map((item, index) => {
                        if(!item.hidden){
                            return (
                                <VpRadio
                                    className={item.className||''}
                                    key={item.value||index}
                                    value={item.value||''}
                                    disabled={item.disabled || false}>
                                    <VpTooltip placement="topLeft" title={options.tip||''}>
                                        <span>{item.label||''}</span>
                                    </VpTooltip>
                                </VpRadio>
                                )
                        }
                    })
                }
            </VpRadioGroup>
        </VpFRadio>
    );
});

/**
 * 将多选控件（checkbox）的平台数据转换成前端控件数据格式
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "checkbox", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "widget": {
        "load_template": [{
                "value":'1',
                "label":"多选1"
        },{
                "value":'2',
                "label":"多选2"
        }],
        "default_value": "1",
    }
 * }
 * @return 见checkbox控件的数据格式
 */
registerWidgetPropsTransform("checkbox",function(props,_thisform){
    let {widget={}} = props;
    let {load_template=[],default_value} = widget;
    let newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    newProps.fieldProps.initialValue = parseArray(default_value);
    newProps.props.options = load_template;
    return newProps;
});

/**
 * 注册多选控件
 * @param options {
       widget_type:'checkbox', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
            //options 级联选项
            options:[{  //选项
                "value":'1',
                "label":"多选1"
            },{
                "value":'2',
                "label":"多选2"
            }],
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : '1' //默认值，
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 */
registerWidget("checkbox",function(options,_thisform){
    _optionsValToString(options.props.options);
    let fieldProps = getFieldProps(options,_thisform);
    return <VpFCheckbox  {...fieldProps} />
});
/**
 * 将数字控件（number）的平台数据转换成前端控件数据格式
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "checkbox", //控件类型
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true,"min": "-123","max": "30", "message": "请输入-123-30"}, //校验
    "widget": {
        "load_template": [],
        "default_value": "10",
    }
 * }
 * @return 见number控件的数据格式
 */
registerWidgetPropsTransform("number",function(props,_thisform){
    let {widget={}} = props;
    let {load_template=1} = widget;
    let {default_value} = props.widget
    if(default_value){
        props.widget.default_value = default_value==='null'?0:default_value
    }
    let newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    newProps.props.step = load_template;
    newProps.fieldProps.getValueFromEvent = (value) => { return (value !== undefined ? value : "")+""}
    return newProps;
});


/**
 * 注册输入数字控件
 * @param options {
       widget_type:'number', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            readOnly:true/false, //是否只读
            label:'名称',  //label值
            //options 级联选项
            step:[{  //选项
                "value":'1',
                "label":"多选1"
            },{
                "value":'2',
                "label":"多选2"
            }],
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : '10' //默认值，
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 */
registerWidget("number",function(options,_thisform){
    let initialValue = options.fieldProps.initialValue;
    options.fieldProps.initialValue = initialValue?parseString(initialValue):''; //要转成字符串
    var fieldProps = getFieldProps(options,_thisform);
    return (
        <VpFInputNumber style={{width: '100%'}} {...fieldProps} />
    )
});


/**
 * 将实体选择控件（selectmodel）的平台数据转换成前端控件数据格式
 * @param props {
 *  "all_line": 1,
    "field_label": "名称", //字段标签
    "widget_type": "selectmodel", //控件类型, 单选selectmodel，多选multiselectmodel
    "field_name": "sname", //字段名称
    "readonly": false, //是否只读
    "validator": {"required": true}, //校验
    "irelationentityid":2, //绑定的实体id
    "widget": {
        "url":"templates/ChooseEntity", //选择框页面
        "default_value": "1",
    }
 * }
 * @return 见number控件的数据格式
 */
registerWidgetPropsTransform("selectmodel,multiselectmodel",function(props,_thisform){
    /**
     *
     * selectmodel由两个控件组成,
     * 1. input 值
     * 3. modal 弹出框
     * 所以有一下几组对象
     * props:{}, input控件属性
     * fieldProps:{} 使用getFieldProps注册时的，如getFieldProps(options.field_name, {initialValue: default_value});
     * modalProps:{
     *     //模型属性
     * }
     */
    let {widget={},onchange,all_line,readonly,validator,widget_type,groupids,url,ajaxurl,condition,...otherProps} = props;
    return {
        widget_type:widget_type,
        field_name:otherProps.field_name,
        all_line:all_line,
        props:{
            widget,
            widget_type:widget_type,
            ...otherProps,
            ...formItemLayout(all_line),
            readOnly:readonly,
            label:props.field_label,
            modalProps:{ //模型属性
                //url:url,
                url:'bjyh/templates/Form/ChooseEntity',//改为模板url
                groupids,
                condition:condition,//查询条件
                ajaxurl:ajaxurl//自定义请求路径
            },
            initialName:widget.default_label //默认初始值描述，fieldProps.initialValue 对应的文字描述
        },
        fieldProps:{
            rules : parseValidator(props),
            initialValue : widget.default_value, //默认值
            onChange: onchange?_thisform[onchange]:undefined,
        }
    }

});

/**
 * 注册实体选择控件
 * @param options {
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
 * }
 */
registerWidget("selectmodel,multiselectmodel",function(options,_thisform){
     let fieldProps = getFieldProps(options,_thisform);
    return (
        <VpChooseModal {...fieldProps} form={_thisform.props.form} ref={`${options.field_name}_Modal`}/>
    )
});

/**
 * 注册文件上传控件
 * @param options {
       widget_type:'inputupload', //控件类型
       field_name:"sname", //控件名称，英文名称，跟表字段对应的
       all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
       "field_label": "名称", //字段标签
       "readonly": false, //是否只读
       "validator": {"required": true}, //校验
       "tips": "请选择项目模板文档（*.doc,*.docx)",
        "widget": {
            "accept": {
                "title": "Doc",
                "extensions": "docx,doc"
            }
        }
 * }
 */
registerWidget("inputupload",function(options,_thisform){
    return (
        <VpInputUploader form={_thisform.props.form} item={options} bindThis={_thisform} />
    )
});



/**
 * 注册文件上传控件
 * @param options {
"field_name": "upload",
        "widget_type": "upload",
        "validator": {"required": true, "message": "上传附件不能为空"},
        "field_label": "upload",
        "all_line": 1,
        "widget": {
            "upload_url": "www.baidu.com",
            "download_url": "www.baidu.com",
            "load_template": [
                {
                    "fileid": "d828484a84c9410c90ff0a21405c",
                    "filename": "ceshi.png",
                    "size": "8888",
                    "creator": "cs",
                    "createtime": "1527040056935",
                    "status": "complete",
                    "options": {
                        "delete": true,
                        "download": true,
                        "preview": true,
                        "edit": true,
                        "update": true
                    }
                },
                {
                    "fileid": "1212",
                    "filename": "ceshi.zip",
                    "describe": "描述",
                    "size": "88828",
                    "creator": "cs",
                    "createtime": "1527040056935",
                    "status": "complete",
                    "options": {
                        "delete": true,
                        "download": true,
                        "preview": false,
                        "edit": false,
                        "update": false
                    }
                }
            ]
        }
 * }
 */
registerWidgetPropsTransform("upload",function(props,_thisform){
    let {widget={}} = props;
    var newProps = getCommonWidgetPropsFromFormData(props,_thisform);
    newProps.props.widget = widget;
    return newProps;
});

/**
 * 注册文件上传控件
 * @param options {
        "field_name": "upload",
        "widget_type": "upload",
        widget_type:'selectmodel', //控件类型
        field_name:"sname", //控件名称，英文名称，跟表字段对应的
        all_line:1, //控件占一行还是半行，1:控件占半行，也就是一行可以显示两列控件，2:控件占一行，也就是一行只显示一列控件
        props:{ //控件自身属性
            labelCol: { span: 6 }, //label占用列数。如果一行显示一个控件时，值为{span：3}；如果一行显示两个控件时，值为{span：6}
            wrapperCol: { span: 14 }, //input控件占用列数。如果一行显示一个控件时，值为{span：19}；如果一行显示两个控件时，值为{span：14}
            label:"名称",
            "uploadUrl": "www.baidu.com",
             "downloadUrl": "www.baidu.com",
             params:{},
            "widget": {
                "load_template": [
                    {
                        "fileid": "d828484a84c9410c90ff0a21405c",
                        "filename": "ceshi.png",
                        "size": "8888",
                        "creator": "cs",
                        "createtime": "1527040056935",
                        "status": "complete",
                        "options": {
                            "delete": true,
                            "download": true,
                            "preview": true,
                            "edit": true,
                            "update": true
                        }
                    },
                    {
                        "fileid": "1212",
                        "filename": "ceshi.zip",
                        "describe": "描述",
                        "size": "88828",
                        "creator": "cs",
                        "createtime": "1527040056935",
                        "status": "complete",
                        "options": {
                            "delete": true,
                            "download": true,
                            "preview": false,
                            "edit": false,
                            "update": false
                        }
                    }
                ]
            }
        },
        fieldProps:{ //控件在表单中的属性
            rules : [], //校验规则，参考https://github.com/yiminghe/async-validator
            initialValue : '1' //默认值，
            onChange: function(value){}  //控件值变化时触发
        }
 * }
 */
class CustomVpFUploader extends  VpFUploader{
    constructor(props){
        super(props);
        this.props.onRef&&this.props.onRef(this)
    }
}
registerWidget("upload",function(options,_thisform){
    let field_name = options.field_name;
    let field_label = options.props.label;
    let form = _thisform.props.form;

    let initialValue = options.fieldProps.initialValue;
    options.fieldProps.initialValue = initialValue!=null?parseString(initialValue):''; //要转成字符串

    let fieldProps = getFieldProps(options,_thisform);
    const data = form.getFieldValue(`${field_name}_label`) || [];
    return (
        <VpFUpload label={field_label} {...fieldProps}>
            <CustomVpFUploader
                onRef={ref => {_thisform[field_name+"Ref"] = ref}}
                data={data} 
                form={form}
                item={options.props}
                {...fieldProps}/>
        </VpFUpload>
    )
});

/**
 * 标签页
 * @param options{
        "field_name": "tabslist",
        "all_line":2,
        "widget_type": "tabs",
        "tabs_type": "card",  //页签的基本样式，可选 line、card（） editable-card 类型。详见http://www.vpsoft.cn:8082/apiweb/#/VpTabs?_k=uc8aiu
        "field_label": "页签",
        "tabsdata": [{
                "title": "测试一",
                "icon": "",
                "tabsdata":[

                ]
            },
            {
                "title": "测试二",
                "disabled": true,
                "icon": "",
                "url": "demo/TabDemo1/index"
            }, {
                "title": "外链",
                "icon": "",
                "url": "http://www.vpsoft.cn/"
            }
        ],
 * }
 */
registerWidgetPropsTransform("tabs",function(props,_thisform){
    if(props){
        props.all_line = "2"; //只要是标签业，默认独占一行
    }
    return props;
});
/**
 * 标签页
 * @param options{
        "field_name": "tabslist",
        "all_line":2,
        "widget_type": "tabs",
        "tabs_type": "card",  //页签的基本样式，可选 line、card（） editable-card 类型。详见http://www.vpsoft.cn:8082/apiweb/#/VpTabs?_k=uc8aiu
        "field_label": "页签",
        "tabsdata": [{
                "title": "测试一",
                "icon": "",
                "tabsdata":[

                ]
            },
            {
                "title": "测试二",
                "disabled": true,
                "icon": "",
                "url": "demo/TabDemo1/index"
            }, {
                "title": "外链",
                "icon": "",
                "url": "http://www.vpsoft.cn/"
            }
        ],
 * }
 */
registerWidget("tabs",function(options,_thisform){
    return (
        <VpDTabs panes={options.panes} type={options.tabs_type} defaultActiveKey={options.defaultActiveKey ? options.defaultActiveKey : "0"} />
    )
});

/**
 * 表格表单
 */
registerWidget("iframe",function(options,_thisform){
    let tableHeader = [];
    let headers=  (options.headers && options.headers.fields) || [];
    let dataSource = (options.listdata && options.listdata.resultList) || [];
    headers.map((item,index) => {
        tableHeader.push(
            {
                title: item.field_label,
                dataIndex: item.field_name,
                fixed: item.fixed,
                width: item.field_width,
                edit_col: item.edit_col,
                widget: item.widget,
                render: !item.edit_col ? null : (text, record) => {
                    return (
                        <EditTableCol id="iid" data={_thisform.state.data} callBack={_thisform.callBack} record={record} widget={item.widget} value={text} />
                    )
                }
            }
        );
    });
    return (
        <VpTable editCol bordered columns={tableHeader} dataSource={dataSource}/>
    )
});
/**
 * 子页面
 * @param options{
    "widget_type": "childpage",
    "url": "sample/customizedFiledForm",
    "urltype": "0",
    "height": 600,
    "param": {
        "className": "test",
        field_name:'field_name'
    }
 * }
 */
registerWidget("childpage",function(options,_thisform){
    let url = options.url;
    if (url){
        if (options.urltype == 1) {
            return (
                    <VpIframe url={url} />
            );
        } else if (options.urltype == 0 && options.urltype != "") {
            let ChilePage = requireFile(url);
            return (
                ChilePage ? <ChilePage {...(options.param||{})}  registerSubForm={_thisform.registerSubForm} entityrole={_thisform.state.entityrole}/> : ''
            );
        }
    }
});
