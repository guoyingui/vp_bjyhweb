import React, { Component } from "react";

import { findWidgetByName } from "../../../templates/dynamic/Form/Widgets";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation, common, validationRequireField, singleInputFill } from '../code';
import moment from "moment";
import { hidden } from "ansi-colors";
import { findFiledByName } from 'utils/utils';


//科技创新基金 业务代表节点
class xmjltjsqFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("xmjltjsqFlowForm");
    }

    /**
     * 表单数据加载成功后
     * @param formData
     */

    onDataLoadSuccess = (formData, handlers) => {
        let _this = this;
        var scode = formData.findWidgetByName("scode").field.fieldProps.initialValue
        console.log("scode", scode)
        //项目负责人在流程中修改后。预设处理人也要根据当前选择人的部门所变化
        let rxmfzr = formData.findWidgetByName('rxmfzr')
        rxmfzr.field.fieldProps.onChange = function (v) {
            console.log("TEST rxmfzr", v);
            console.log("v", v);
            vpQuery('/{bjyh}/Kjcs/QueryByUidtoInto', {
                uid: v
            }).then((response) => {
                console.log("response", response);
                let res = response.data.resultList
                handlers.map(item => {
                    console.log("item", item);
                    item.searchCondition = [{
                        field_name: 'idepartmentid',
                        field_value: res[0].idepartmentid,
                        flag: '1'
                    }, {
                        field_name: 'isfld',
                        field_value: '1',
                        flag: '1'
                    },
                    ]
                    item.ajaxurl = '/{bjyh}/xzxt/getUser';
                })
                _this.setState(handlers, () => {
                    const eobj = { target: { value: '' } }
                    eobj.target.value = ''
                    _this.handleCondition(eobj)
                    _this.forceUpdate()
                });
            })
        }
    }
    onGetFormDataSuccess(data) {
        let _this = this
        let scode = findFiledByName(data.form, 'scode')
        console.log("scode", scode.field.widget.default_value)
        console.log("data", data)
        console.log("data", data.handlers.length)
        let idepartmentid = "";
        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/Kjcs/QueryByScodetoInto', {
                scode: scode.field.widget.default_value
            }).then((response) => {
                let res = response.data.resultList
                idepartmentid = res[0].idepartmentid
                console.log("idepartmentid", idepartmentid);
                data.handlers.map(item => {
                    item.searchCondition = [{
                        field_name: 'idepartmentid',
                        field_value: idepartmentid,
                        flag: '1'
                    }, {
                        field_name: 'isfld',
                        field_value: '1',
                        flag: '1'
                    },
                    ]
                    item.ajaxurl = '/{bjyh}/xzxt/getUser';
                })

                console.log("res", res)
                _this.props.form.setFieldsValue({
                    'rxmfzr': res[0].iid,//id
                    'rxmfzr_label': res[0].sname,//显示的汉字 
                    'idepartmentid': res[0].idepartmentid,//显示的汉字
                    'idepartmentid_label': res[0].deptname//显示的汉字
                })
                resolve(data);
            })
        })
        return promise
    }
}

xmjltjsqFlowForm = FlowForm.createClass(xmjltjsqFlowForm);
export default xmjltjsqFlowForm;