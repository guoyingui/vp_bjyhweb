import React, {
    Component
} from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {
    singleInputFill,
    validationRequireField
} from '../code';
import { vpQuery,VpConfirm } from "vpreact";
import {findFiledByName} from 'utils/utils';

//部门负责人分配系统负责人03
class CoustomFlowForm03 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    onDataLoadSuccess = (formData,handlers) => {
        if (!this.props.isHistory) {
            this.props.form.setFieldsValue({
                'dqrrq': new Date()
            })
        }
        // let ildclbm = formData.findWidgetByName('ildclbm');
        // if(ildclbm){
        //     let ildclbmVal=ildclbm.field.fieldProps.initialValue;
        //     handlers.map(item => {
        //         //系统负责人弹出窗过滤
        //         if (item.flag === 'AGREE_XT') {
        //             item.searchCondition = [{
        //                 idepartmentid: 1109
        //             }]
        //             item.ajaxurl = '/{bjyh}/ldxfRest/getUser';
        //         }
        //     })
        //     this.setState(handlers);
        // }
    }
    onGetFormDataSuccess(data) {
        let ildclbm = findFiledByName(data.form, 'ildclbm');
        if(ildclbm){
            let ildclbmVal=ildclbm.field.widget.default_value;
            if(data.handlers){
                data.handlers.map(item=>{
                    //设置选择系统人弹出窗过滤
                    if (item.flag === 'AGREE_XT'&&ildclbmVal=='1') {
                        item.searchCondition = [{
                            idepartmentid: 1110
                        }]
                        item.ajaxurl = '/{bjyh}/ldxfRest/getUser';
                    }else if(item.flag === 'AGREE_XT'&&ildclbmVal=='2'){
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
    }
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'REFUSE' ? true : false
        // 拒绝时将sjgsshyj设置为必填
        validationRequireField(_this, 'sdescription', flag)   
    }
}
CoustomFlowForm03 = FlowForm.createClass(CoustomFlowForm03);
export default CoustomFlowForm03;