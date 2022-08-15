import React, { Component } from "react";
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import moment from "moment";
import { vpQuery, vpAdd, VpAlertMsg } from 'vpreact';
import { registerWidgetPropsTransform, registerWidget, getCommonWidgetPropsFromFormData } from '../../../templates/dynamic/Form/Widgets';
import { fileValidation } from '../code'
import { common, fhzjxmsq, singleInputFill, validationRequireField } from '../code';

class kjsx02 extends FlowForm.Component {
    constructor(props) {
        super(props);
        console.log("kjsx02");
    }

    onGetFormDataSuccess = data => {
        let _this = this
        let promise = new Promise(resolve => {
            vpQuery('/{bjyh}/ZKXmsxFrom/queryNameByUsers', {
                Sname: '业务线领导', idepartmentid: vp.cookie.getTkInfo('idepartmentid')
            }).then((response) => {
                console.log("业务线领导/总监", response)
                let rywbldfzr = ''
                let ids = ''
                if (response.data.resultList.length > 0) {
                    let res = response.data
                    if (res.resultList.length > 1) {
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
                    } else {
                        for (let i = 0; i < res.resultList.length; i++) {
                            ids += res.resultList[i].iid + ','
                            rywbldfzr += res.resultList[i].sname + ','
                        }
                        ids = ids.substring(0, ids.length - 1)
                        rywbldfzr = rywbldfzr.substring(0, rywbldfzr.length - 1)
                        // 自动获取业务部领导负责人
                        for (var i = 0; i < data.handlers.length; i++) {
                            console.log(data.handlers[i].flag)
                            if (data.handlers[i].flag == "SYSA") {
                                data.handlers[i].ids = ids
                                data.handlers[i].names = rywbldfzr
                            }
                        }
                    }
                    resolve(data)
                } else {
                    resolve(data)
                }

            })
        })
        return promise
    }

   /**
     * 监听单选框
     * @param e
     */
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let scondition = e.target.value == "SYSB" ? true : false
        validationRequireField(_this, 'sywbldspyj', scondition)
    }

    /**
     * 表单提交前
     * @param formData
     * @returns {Promise<any>}
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'sywbldspyj', true)
    }


}

kjsx02 = FlowForm.createClass(kjsx02);
export default kjsx02;