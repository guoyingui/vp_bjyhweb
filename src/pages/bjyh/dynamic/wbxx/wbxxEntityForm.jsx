/*
 * @author: SL.
 */
import React, { Component } from "react";

import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import {vpQuery,VpAlertMsg,VpConfirm, VpPopover} from "vpreact";
import { validationRequireField  } from '../code';
import {fieldModelInfo} from './yl_json'
import moment from "moment";

//外部信息
class wbxxEntityForm extends DynamicForm.Component{
    constructor(props){
        super(props);
    }

    //保存前
    onBeforeSave(formData,btnName){
        
    }
   
    //自定义控件行为
    onDataLoadSuccess = async formData => {
        const _this = this
        this.renderFieldOnAfter(Object.keys(fieldModelInfo), formData)

        //是否涉及立项 isjlx
        const isjlx = formData.findWidgetByName('isjlx');
        isjlx && (isjlx.field.fieldProps.onChange = e => {
            const val = e.target.value
            if(val == 2) {
                // _this.props.form.setFieldsValue({
                //     sxmbh:'', rxmmc: '', rxmjl: '', rxqfzr: '', rxmsqbm: '',
                //     sxmbh_label: '', rxmmc_label: '', rxmjl_label: '', rxqfzr_label: '', rxmsqbm_label: '',
                // })
                _this.props.form.resetFields(['rxmmc', 'rxmmc_label', 'sxmbh', 'sxmbh_label',
                    'rxmjl', 'rxmjl_label', 'rxqfzr', 'rxqfzr_label', 'rxmsqbm', 'rxmsqbm_label',
                    'rxqtcr', 'rxqtcr_label'
                ])
            }
        })
        //项目选择后 自动带出相关信息
        const rxmmc = formData.findWidgetByName('rxmmc')
        rxmmc && (rxmmc.field.fieldProps.onChange = val => {           
            vpQuery('/{bjyh}/util/getProjectInfo',{
                projectID:val
            }).then((response) => {
                const pjInfo = response.data
                const { scode='', rxqtcbm='', bmname='', team} = pjInfo
                const fieldNode = {}
                team.map(element => {
                    switch (element.iroleid * 1) {
                        case 6:
                            fieldNode.rxmjl = element.userid
                            fieldNode.rxmjl_label = element.username
                            break;
                        case 1000018:
                            fieldNode.rxqtcr = element.userid
                            fieldNode.rxqtcr_label = element.username
                            break;
                        case 1000017:
                            fieldNode.rxqfzr = element.userid
                            fieldNode.rxqfzr_label = element.username
                            break;
                    }
                    
                })
                _this.props.form.setFieldsValue({
                    sxmbh: scode, rxmsqbm: rxqtcbm, rxmsqbm_label: bmname, ...fieldNode
                })
            })
        })

        //分行项目选择后，自动带出相关信息
        const rfhxmmc = formData.findWidgetByName('rfhxmmc')
        rfhxmmc.field.fieldProps.onChange = function (val) {           
            vpQuery('/{bjyh}/externalData/queryBranchMaster',{
                iid:val
            }).then((response)=>{
                const fhInfo = response.data
                const { scode='', xmjl='',xmjlname='' } = fhInfo                
                _this.props.form.setFieldsValue({
                    sfhxmbh: scode, sfhxmjl: xmjlname, sfhxmjl_label: xmjlname,
                })
            })
        }
        
        if(this.props.add) {
            //申请日期自动带出当前日期
            this.props.form.setFieldsValue({dsqrq: new Date()})
            let response = await vpQuery('/{bjyh}/fhzjxmsq/getUserInfoByUserId',{id: vp.cookie.getTkInfo('userid') })
            const phone = response.data.sphone
            _this.props.form.setFieldsValue({slxfs: phone})
        }
        
    }

    /**
     * @description 多字段添加‘样例’提示
     * @param {fields: [], formData: {}} 
     * @return {type} 
     */
    renderFieldOnAfter = (fields, formData) => {
        fields.length && fields.map(element => {
            const field = formData.findWidgetByName(element);            
            if(field){
                const content = fieldModelInfo[element] ? fieldModelInfo[element].content : null
                let reactElement = (<div dangerouslySetInnerHTML={{__html: content}} />)
                content && (field.field.props.addonAfter = (
                    <div className='ant-select ant-select-enabled' 
                        style={{margin:'-5px -7px',width: '70px',lineHeight:'32px'}}>
                        <VpPopover style={{ width: 70 }} content={reactElement} autoAdjustOverflow={true} 
                            title="" trigger="click" >
                            <div style={{ cursor: 'pointer' }}>样例</div>
                        </VpPopover>
                    </div>
                ))
            }
        })
    }
}
wbxxEntityForm = DynamicForm.createClass(wbxxEntityForm);
export default wbxxEntityForm;