import React, { Component } from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { findWidgetByName } from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation, validationRequireField, singleInputFill } from '../code';
import moment from "moment";


//项目上线申请流程 开发部领导 审批节点
class sxsqKfbldFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        // console.log("sxsqKfbldFlowForm") ;
        // console.log("date",this) ;
    }
    onGetFormDataSuccess = data => {
        let _this = this
        var sxmbh = findWidgetByName.call(data.form, 'sxmbh')
        var iwcshjsx = findWidgetByName.call(data.form, 'iwcshjsx')
        console.log("sxmbh", sxmbh.field.widget.default_value);
        let cshjsx = iwcshjsx.field.widget.default_value
        let iclassid = "";
        //默认屏蔽两个节点
        let scondition = findWidgetByName.call(data.form, 'scondition')
        return new Promise(resolve => {
            vpQuery('/{bjyh}/ZKXmsxFrom/queryProject', {
                sxmbh: sxmbh.field.widget.default_value
            }).then((res) => {
                console.log("1111111111111111111111111111111", res);
                iclassid = res.data.iclassid
                console.log("类别1", iclassid);
                console.log("是否测试环境上限 / 1是 2 否", cshjsx);
                if (iclassid != 107) {
                    data.scondition = 'SYSX'
                    scondition.field.widget.load_template.map(item => {
                        item.value == 'SYSW' ? item.hidden = true : null
                        item.value == 'SYSV' ? item.hidden = true : null
                        scondition.field.widget.default_value = 'SYSX'
                    })
                } else {
                    if (cshjsx == 1) {
                        data.scondition = 'SYSW'
                        scondition.field.widget.load_template.map(item => {
                            item.value == 'SYSX' ? item.hidden = true : null
                            item.value == 'SYSV' ? item.hidden = true : null
                            scondition.field.widget.default_value = 'SYSW'
                        })
                    } else {
                        data.scondition = 'SYSV'
                        scondition.field.widget.load_template.map(item => {
                            item.value == 'SYSX' ? item.hidden = true : null
                            item.value == 'SYSW' ? item.hidden = true : null
                            scondition.field.widget.default_value = 'SYSV'
                        })
                        console.log("data", data);
                    }
                }
                for (var i = 0; i < data.handlers.length; i++) {
                    console.log(data.handlers[i])
                    if (data.handlers[i].flag == "SYSV") {
                        data.handlers[i].ids = res.data.iid,
                        data.handlers[i].names = res.data.sname
                    }
                }
                resolve(data)
            })
        })
    }

    /**
    * 表单数据加载成功后
    * @param formDat
    */
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this;
        //是否通过1
        let iywyzsftg11 = formData.findWidgetByName('iywyzsftg');
        iywyzsftg11.field.props.label = "是否通过";
        //是否返回业务1
        let isffhyw11 = formData.findWidgetByName('isffhyw1');
        isffhyw11.field.props.label = "是否返回业务";
        //是否与需求符合6
        let ixqfh66 = formData.findWidgetByName('ixqfh6');
        ixqfh66.field.props.label = "是否与需求符合";
        //是否与需求符合7
        let ixqfh77 = formData.findWidgetByName('ixqfh7');
        ixqfh77.field.props.label = "是否与需求符合";

        console.log("handlers", handlers);
        var iwcshjsx = formData.findWidgetByName("iwcshjsx").field.fieldProps.initialValue;

        let eobj = { target: { value: '' } }
        vpQuery('/{bjyh}/ZKXmsxFrom/queryPiidByUsers', {
            ppid: _this.props.piid, stepKey: 'SYSK', tableName: 'WFENT_SXSQLC'
        }).then((response) => {
            let fzr = ''
            let ids = ''
            if (response.data.length > 0) {
                let res = response.data
                for (let i = 0; i < res.length; i++) {
                    ids += res[i].iid + ','
                    fzr += res[i].sname + ','
                }
                ids = ids.substring(0, ids.length - 1)
                fzr = fzr.substring(0, fzr.length - 1)
                console.log("执行人节点ids", ids)
                console.log("执行人节点fzr", fzr)
                console.log("iwcshjsx", iwcshjsx)
                // 默认<开发负责人提供上线文档>环节运营代表审批人员
                for (var i = 0; i < handlers.length; i++) {
                    if (handlers[i].flag == "SYSW") {
                        // console.log("111");

                        handlers[i].ids = ids
                        handlers[i].names = fzr
                        if (iwcshjsx == 1) {
                            _this.props.form.setFieldsValue({ scondition: 'SYSW' })
                            eobj.target.value = 'SYSW'
                            this.handleCondition(eobj)
                        }
                    }
                }
                this.setState({
                    handlers: handlers
                })
                console.log("handlers", handlers);
            }
        })
    }
    onBeforeSave(formData, btnName) {
        let _this = this
        let sparam = JSON.parse(formData.sparam);
        let scondition = sparam.scondition;
        console.log("sparam", sparam);
        console.log("scondition", scondition);
        if (scondition == "SYSY") {
            sparam.ssfzjdyyb = '0'
        }
        formData.sparam = JSON.stringify(sparam)
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'skfbldspyj', true)
        }
    }
    /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value
        console.log("scondition", scondition)
        console.log("_this", _this)
        let flag = e.target.value == 'SYSY' ? true : false
        validationRequireField(_this, 'skfbldspyj', flag)
    }

}

sxsqKfbldFlowForm = FlowForm.createClass(sxsqKfbldFlowForm);
export default sxsqKfbldFlowForm;