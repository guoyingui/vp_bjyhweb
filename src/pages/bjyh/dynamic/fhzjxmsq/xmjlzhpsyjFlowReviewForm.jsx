import React, { Component } from "react"
import {common, fhzjxmsq, validationRequireField, singleInputMonitor, singleInputFill} from '../code';

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import accessFlowForm from "../flowAccess/accessFlowForm";
import { vpQuery } from "vpreact";

//分行自建项目申请--流程--项目经理汇总评审意见
class xmjlzhpsyjFlowReviewForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    onGetFormDataSuccess(data){
        let _this = this
        return new Promise(resolve => {
            let handlers = data.handlers
            if (handlers) {
                for (let i = 0; i < handlers.length; i++) {
                    if (handlers[i].flag == 'SYSM') {
                        vpQuery('/{bjyh}/fhzjxmsq/getIcreatorByFlowEntityId',{ entityId: _this.props.iobjectid
                        }).then((res) => {
                            if (res) {
                                handlers[i].ids = res.data.iid + ""
                                handlers[i].names = res.data.sname
                            }
                            resolve(data)
                        })
                    }
                }
            }
            resolve(data)
        })
    }

    onDataLoadSuccess = formData => {
        let _this = this
        let ipsjg = formData.findWidgetByName('ipsjl')
        //项目经理结论radio点击事件
        if (ipsjg) {
            ipsjg.field.fieldProps.onChange = e =>{
                let flag = e.target.value * 1 == 1 ? false : true
                validationRequireField(_this,  'sxmjlhzps', flag)
            }
        }
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     */
    onBeforeSave = (formData, btnName) => {
        singleInputFill(formData, btnName, 'sxmjlhzps', true)
    }

    onSaveSuccess = (ss, btnName, formData) => {
        let _this = this
        let sparam = JSON.parse(formData.sparam)
        let scondition = sparam.hasOwnProperty('scondition') ? sparam['scondition'] : '';
        let ipsjl = sparam.hasOwnProperty('ipsjl') ? sparam['ipsjl'] : '';
        let sname = sparam.hasOwnProperty('sname') ? sparam['sname'] : '';
        let flag = ipsjl == 1 ? '' : '不'

        if (btnName == 'ok' && scondition == 'SYSL') {
            vpQuery('/{bjyh}/fhzjxmsq/getAllStepAndAssesser',{ flowId: _this.props.piid
            }).then((res) => {
                if (res.data) {
                    res.data.map(v => {
                        vpQuery('/{vpplat}/vfrm/api/sendmail', {
                            title: '分行自建项目申请流程结束',
                            content: v.sname + ',您好：【' + sname + '】 分行自建项目申请最终评审结论为' + flag + '同意立项',
                            receiver: v.semail
                        }).then((res1) => {
                            console.log('发送结束邮件，给所有节点处理人及评审人发送邮件')
                        })
                    })
                }
                // vpQuery('/{vpplat}/vfrm/api/sendmail', {
                //     title: '分行自建项目申请流程结束',
                //     content: (ipsjl == 1 ? '' : '不') + '同意立项',
                //     receiver: res.data.semail
                // }).then((res1) => {
                //     console.log('发送结束邮件，给所有节点处理人及评审人发送邮件')
                // })
            })
        }
    }
}

xmjlzhpsyjFlowReviewForm = FlowForm.createClass(xmjlzhpsyjFlowReviewForm)
export default xmjlzhpsyjFlowReviewForm
