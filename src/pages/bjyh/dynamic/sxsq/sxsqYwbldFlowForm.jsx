import React, { Component } from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { findWidgetByName } from "../../../templates/dynamic/Form/Widgets";
import { vpPostAjax } from "../../../templates/dynamic/utils";
import { vpQuery, VpAlertMsg } from "vpreact";
import { xmsxsq, fileValidation, validationRequireField, singleInputFill } from '../code';
import moment from "moment";


//项目上线申请流程 业务部领导 审批节点
class sxsqYwbldFlowForm extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("sxsqYwbldFlowForm");
        console.log("date", this);
        this.state.moduserprops = {
            ismoduser: true,//是否启用更改处理人
        }
    }
    componentWillMount() {
        let _this = this
        super.componentWillMount()
        vpQuery('/{vpplat}/vfrm/entity/listDatas', {
            entityid: 1,
            condition: JSON.stringify([{
                field_name: 'sname',
                field_value: '软件开发部',
                expression: 'like'
            }])
        }).then(res => {
            if (res.data) {
                let ids = []
                res.data.map(item => {
                    ids.push(item.iid)
                })
                let moduserprops = _this.state.moduserprops
                moduserprops.moduserCondition[0].field_value = ids.toString()
                _this.setState({
                    moduserprops: moduserprops
                }, () => {
                })
            }
        })
    }
    onGetFormDataSuccess = data => {
        let _this = this
        let sfzcxs = findWidgetByName.call(data.form, 'ssfzcsx');
        let sxmbh = findWidgetByName.call(data.form, 'sxmbh');
        console.log("sxmbh", sxmbh.field.widget.default_value)
        console.log("sfzcsx", sfzcxs)
        console.log("sfzcsx", sfzcxs.field.widget.default_value)
        let zcsx = sfzcxs.field.widget.default_value
        console.log("zcsx", zcsx)
        console.log("zcsx", zcsx)
        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/ZKXmsqFrom/SearchProjectid', {
                sxmbh: sxmbh.field.widget.default_value
            }).then((res) => {
                console.log("11111111", res.data)

                let sconditionField = findWidgetByName.call(data.form, "scondition");
                // 隐藏的按钮的value值
                //SYSQ业务线领导 SYSR开发部领导
                let option = zcsx == 1 ? 'SYSQ' : 'SYSR'
                // 默认单选选中
                let defaultOption = zcsx == 1 ? 'SYSR' : 'SYSQ'
                if (res.data) {
                    console.log("222222", res.data)
                    option = 'SYSQ'
                    defaultOption = 'SYSR'
                }
                // 获取全部单选按钮
                let options = sconditionField.field.widget.load_template
                // 隐藏指定单选按钮
                let newOptions = options.filter(v => v.value != option);
                data.scondition = defaultOption;
                sconditionField.field.widget.default_value = defaultOption;
                sconditionField.field.widget.load_template = newOptions;
                //开发部领导审批：默认<开发负责人提供上线文档>环节预设开发部领导
                let rkfbld = findWidgetByName.call(data.form, 'rkfbld')
                console.log("rkfbld", rkfbld.field.widget.default_value)
                console.log("rkfbld", rkfbld.field.widget.default_label)
                console.log("projectid", _this.props.iobjectid)
                // 如一致则【是否需求提出人】字段设置为1
                vpQuery('/{bjyh}/ZKXmsxFrom/queryNameByUsers', {
                    Sname: '业务线领导', idepartmentid: vp.cookie.getTkInfo('idepartmentid')
                }).then((response) => {
                    console.log("业务线领导/总监", response)
                    let rywbldfzr = ''
                    let ids = ''
                    if (response.data.resultList.length > 0) {
                        let res = response.data
                        if (res.resultList.length > 1) {
                            console.log("data.handlers", data.handlers);
                            let dptid = vp.cookie.getTkInfo('idepartmentid')
                            data.handlers.map(item => {
                                console.log("flag", data.handlers.flag)
                                item.searchCondition = [{
                                    field_name: 'idepartmentid',
                                    field_value: dptid,
                                    flag: '2'
                                }]
                                item.ajaxurl = '/{bjyh}/xzxt/getUser';
                            })
                            for (var i = 0; i < data.handlers.length; i++) {
                                console.log(data.handlers[i].flag)
                                if (data.handlers[i].flag == "SYSR") {
                                    data.handlers[i].ids = rkfbld.field.widget.default_value + ""
                                    data.handlers[i].names = rkfbld.field.widget.default_label + ""
                                }
                            }
                        } else {
                            for (let i = 0; i < res.resultList.length; i++) {
                                ids += res.resultList[i].iid + ','
                                rywbldfzr += res.resultList[i].sname + ','
                            }
                            ids = ids.substring(0, ids.length - 1)
                            rywbldfzr = rywbldfzr.substring(0, rywbldfzr.length - 1)
                            console.log("ids", ids)
                            console.log("rywbldfzr", rywbldfzr)
                            // 自动获取业务部领导负责人
                            for (var i = 0; i < data.handlers.length; i++) {
                                console.log(data.handlers[i].flag)
                                if (data.handlers[i].flag == "SYSQ") {
                                    data.handlers[i].ids = ids
                                    data.handlers[i].names = rywbldfzr
                                }
                                if (data.handlers[i].flag == "SYSR") {
                                    data.handlers[i].ids = rkfbld.field.widget.default_value + ""
                                    data.handlers[i].names = rkfbld.field.widget.default_label + ""
                                }
                            }
                        }
                        resolve(data)
                    } else {
                        resolve(data)
                    }
                })
            })
        })
        return promise
    }


    /**
     * 表单数据加载成功后
     * @param formDat
     */
    onDataLoadSuccess = (formData, handlers) => {
        let _this = this
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
        console.log("handlers", handlers)
        //获取字段
        let ssfzcsx = formData.findWidgetByName('ssfzcsx')
        console.log("ssfzcsx", ssfzcsx)
        let ssfzcssx = _this.props.form.getFieldsValue(['ssfzcsx'])
        console.log("ssfzcssx", ssfzcsx)
        let rxmtcbm = _this.props.form.getFieldsValue(['rxmtcbm'])
        console.log("rxmtcbm", rxmtcbm)

        // 根据需求提出部门判断业务线领导
        var rxqtcbm = formData.findWidgetByName("rxmtcbm");
        vpQuery('/{bjyh}/xzxt/getbumen', { rxqtcbm: rxqtcbm.field.fieldProps.initialValue }).then((response) => {
            if (response.flag == '1') {
                vpQuery('/{bjyh}/xzxt/getuseridnmae', { xuanze: '2' }).then((response1) => {
                    _this.state.handlers.map(item => {
                        if (item.flag === 'SYSQ') {
                            item.names = response1.sname
                            item.ids = response1.iid
                            _this.props.form.setFieldsValue({
                                [item.stepkey]: response1.iid,
                                [item.stepkey + '_label']: response1.sname
                            })
                        }
                    })
                })
            }
        })
    }

    onBeforeSave(formData, btnName) {
        let _this = this
        //流程步骤通用定制
        if (btnName == 'ok') {
            singleInputFill(formData, btnName, 'sywbldspyj', true)
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
        if (scondition == "SYSS") {
            //隐藏运维部组长领导
            // 是否直接到运营部 ssfzjdyyb 是否直接到业务部领导 ssfzjdywbld  业务直返运营项目 sywzfyyxm 
            _this.props.form.setFieldsValue({
                'ssfzjdyyb': "1",
                'ssfzjdywbld': "1",
                'sywzfyyxm': "0"
            })
        }
        let flag = e.target.value == 'SYSS' ? true : false
        validationRequireField(_this, 'sywbldspyj', flag)
    }

}

sxsqYwbldFlowForm = FlowForm.createClass(sxsqYwbldFlowForm);
export default sxsqYwbldFlowForm;