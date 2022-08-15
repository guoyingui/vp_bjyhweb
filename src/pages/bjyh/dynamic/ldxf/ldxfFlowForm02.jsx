import React, {
    Component
} from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {fileValidation} from '../code';
import {
    singleInputFill,
    validationRequireField
} from '../code';
import { vpQuery,VpConfirm } from "vpreact";
import {findFiledByName} from 'utils/utils';

//信科明确负责人02
class CoustomFlowForm02 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    onDataLoadSuccess = (formData,handlers) => {
        //分发人设置默认值
        let rffr=formData.findWidgetByName('rffr');
        console.log(rffr)
        if(rffr){
            if(!rffr.field.fieldProps.initialValue){
                this.props.form.setFieldsValue({
                    'rffr': vp.cookie.getTkInfo('userid'),
                    'rffr_label': vp.cookie.getTkInfo('nickname')
                })
            }
        }
        //分发日期设置默认值
        let dffrq=formData.findWidgetByName('dffrq');
        if(dffrq){
            if(!dffrq.field.fieldProps.initialValue){
                this.props.form.setFieldsValue({
                    'dffrq': new Date()
                })
            }
        }
        //是否紧急需求 1是 2否
        let ildclbm = formData.findWidgetByName('ildclbm');
        let scondition = formData.findWidgetByName('scondition');
        if(ildclbm){
            ildclbm.field.fieldProps.onChange= e => {
                //1是 2 否
                let val = e.target.value;
                let eobj = {target:{value:''}}
                scondition.field.props.options_.map(item => {
                    if (item.value == 'AGREE_YW'&&val==3) {
                        item.hidden = false
                        this.props.form.setFieldsValue({scondition:'AGREE_YW'});
                        eobj.target.value='AGREE_YW';
                    } else if(item.value == 'AGREE_YYKF'&&(val==1||val==2)) {
                        item.hidden = false;
                        this.props.form.setFieldsValue({scondition:'AGREE_YYKF'});
                        eobj.target.value='AGREE_YYKF';
                        console.log('----------',item);
                    }else{
                        item.hidden = true;
                    }
                    
                })
                handlers.map(item => {
                    //每次点击选择漏洞处理部门时，都进行清空步骤处理人。防止退回步骤自动带的处理人。
                    item.ids='';
                    item.names='';
                    //开发或运营
                    if ((val==1||val==null)&&item.flag === 'AGREE_YYKF') {
                        item.searchCondition = [{
                            idepartmentid: 1110
                        }]
                        item.ajaxurl = '/{bjyh}/ldxfRest/getUser';
                        
                    }else if(val==2&&item.flag === 'AGREE_YYKF'){
                        item.searchCondition = [{
                            idepartmentid: 1109
                        }]
                        item.ajaxurl = '/{bjyh}/ldxfRest/getUser';
                    }
                })
                this.setState(handlers,() =>{
                    this.handleCondition(eobj)
                    this.forceUpdate()
                });
            }
        }
        
    }

    onGetFormDataSuccess(data) {
        let ildclbm = findFiledByName(data.form, 'ildclbm');
        let scondition = findFiledByName(data.form, 'scondition');
        if(ildclbm&&scondition){
            let ildclbmVal=ildclbm.field.widget.default_value;
            //如果是紧急需求，则走 AGREE_JJ 分支。
            scondition.field.widget.load_template.map(item => {
                if(ildclbmVal==3 && item.value == 'AGREE_YW'){
                    item.hidden = false
                    scondition.field.widget.default_value = 'AGREE_YW'
                    data.scondition = 'AGREE_YW';
                } else if((ildclbmVal==1||ildclbmVal==2||ildclbmVal==null)&& item.value == 'AGREE_YYKF'){
                    item.hidden = false
                    scondition.field.widget.default_value = 'AGREE_YYKF'
                    data.scondition = 'AGREE_YYKF';
                }else{
                    item.hidden=true;
                }
            })
            //处理步骤处理人弹出窗
            data.handlers.map(item=>{
                //开发或运营
                if ((ildclbmVal==1||ildclbmVal==null)&&item.flag === 'AGREE_YYKF') {
                    item.searchCondition = [{
                        idepartmentid: 1110
                    }]
                    item.ajaxurl = '/{bjyh}/ldxfRest/getUser';
                }else if(ildclbmVal==2&&item.flag === 'AGREE_YYKF'){
                    item.searchCondition = [{
                        idepartmentid: 1109
                    }]
                    item.ajaxurl = '/{bjyh}/ldxfRest/getUser';
                }
                //设置弹出窗为单选实体
                item.widget_type = 'selectmodel';
            })
        }
        
    }
    /**
     * 表单数据加载成功后
     * @param formData
     */
    onBeforeSave = (formData, btnName) => {
        let _this = this
        return fileValidation(_this, btnName, 'ldxflc', '02')
    }
}

CoustomFlowForm02 = FlowForm.createClass(CoustomFlowForm02);
export default CoustomFlowForm02;