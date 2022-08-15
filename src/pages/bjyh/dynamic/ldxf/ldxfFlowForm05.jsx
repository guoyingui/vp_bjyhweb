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

//运营中心负责人验证05
class CoustomFlowForm05 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    onGetFormDataSuccess(data) {
        let iyzfs = findFiledByName(data.form, 'iyzfs');
        let scondition = findFiledByName(data.form, 'scondition');
        if(iyzfs&&scondition){
            let iyzfsVal=iyzfs.field.widget.default_value;
            if(iyzfsVal==3){
                //如果是从信科直接过来的，拒绝直接到信科那。
                scondition.field.widget.load_template.map(item => {
                    if (item.value == 'REFUSE'||item.value == 'AGREE_SX') {
                        item.hidden = false
                        scondition.field.widget.default_value = 'AGREE_SX'
                        data.scondition = 'AGREE_SX';
                    } else {
                        item.hidden = true;
                    }
                })
            }else{
                scondition.field.widget.load_template.map(item => {
                    if(item.value == 'REFUSE'||item.value == 'AGREE_JS'){
                        item.hidden = false
                        scondition.field.widget.default_value = 'AGREE_JS'
                        data.scondition = 'AGREE_JS';
                    }else{
                        item.hidden=true;
                    }
                })
            }
        }
        if(iyzfs){
            let dcsyzrq = findFiledByName(data.form, 'dcsyzrq');
            let dscyzrq = findFiledByName(data.form, 'dscyzrq');
            let dsxrq = findFiledByName(data.form, 'dsxrq');
            switch(iyzfs.field.widget.default_value*1){
                case 1 :
                    if(dcsyzrq){
                        dcsyzrq.field.validator.message= "验证方式为仅测试环境，测试验证日期必填"
                        dcsyzrq.field.validator.required=true
                    }
                    if(dsxrq){
                        dsxrq.field.validator.message= "请填写上线日期"
                        dsxrq.field.validator.required=true
                    }
                    break;
                case 2 :
                    if(dscyzrq){
                        dscyzrq.field.validator.message= "验证方式为仅生产环境，生产验证日期必填"
                        dscyzrq.field.validator.required=true
                    }
                    if(dsxrq){
                        dsxrq.field.validator.message= "请填写上线日期"
                        dsxrq.field.validator.required=true
                    }
                    break;
                case 3 :
                    if(dcsyzrq){
                        dcsyzrq.field.validator.message= "验证方式为测试及生产环境，测试验证日期必填"
                        dcsyzrq.field.validator.required=true
                    }
                    break;
            }
        }
        if(data.handlers){
            data.handlers.map(item=>{
                //设置弹出窗为单选实体
                item.widget_type = 'selectmodel';
            })
        }
        return new Promise(resolve=>{
            //根据流程实例id获取流程历史某个步骤的处理人。
            vpQuery('/{bjyh}/ldxfRest/getHistoryStepUser',{
                piid:this.props.piid,
                stepcode:'04'
            }).then(res=>{
                if(res.status==200){
                    //将不为空的步骤处理人设置为查询出来的处理人，如果已有默认值，则不处理。
                    data.handlers.map(item=>{
                        if(item.flag=='AGREE_SX'&&(item.ids==null||item.ids=='')){
                            item.ids=res.data.ids;
                            item.names=res.data.names;
                        }
                    })
                }
                resolve(data)
            })
        })
    }
    onDataLoadSuccess=(formData,handlers)=>{
        
    }
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'REFUSE' ? true : false;
        // 拒绝时将sjgsshyj设置为必填
        validationRequireField(_this, 'sdescription', flag)
    }
}
CoustomFlowForm05 = FlowForm.createClass(CoustomFlowForm05);
export default CoustomFlowForm05;