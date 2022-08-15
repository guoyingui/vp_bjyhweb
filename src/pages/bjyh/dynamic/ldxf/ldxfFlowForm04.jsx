import React, {
    Component
} from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {
    fileValidation,
    validationRequireField
} from '../code';
import { vpQuery,VpConfirm } from "vpreact";
import {findFiledByName} from 'utils/utils';

//业务部门负责人/系统负责人处理04
class CoustomFlowForm04 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    onGetFormDataSuccess(data) {
        let ildclbm = findFiledByName(data.form, 'ildclbm');
        let scondition = findFiledByName(data.form, 'scondition');
        if(ildclbm&&scondition){
            let ildclbmVal=ildclbm.field.widget.default_value;
            if(ildclbmVal==3){
                //如果是从信科直接过来的，拒绝直接到信科那。
                scondition.field.widget.load_template.map(item => {
                    if (item.value == 'REFUSE_XK'||item.value == 'AGREE'||item.value == 'AGREE_JS') {
                        item.hidden = false
                    } else {
                        item.hidden = true;
                    }
                })
            }else{
                scondition.field.widget.load_template.map(item => {
                    if(item.value == 'REFUSE_LD'||item.value == 'AGREE'||item.value == 'AGREE_JS'){
                        item.hidden = false
                    }else{
                        item.hidden=true;
                    }
                })
            }
        }
        let iyzfs = findFiledByName(data.form, 'iyzfs');
        if(iyzfs){
            //根据验证方式校验上线日期是否必填。验证方式为：仅测试环境验证或仅生产环境验证 时，进行控制上线日期必填。
            let iyzfsVal=iyzfs.field.widget.default_value;
            if(iyzfsVal==1||iyzfsVal==2){
                let dsxrq = findFiledByName(data.form, 'dsxrq');
                if(dsxrq){
                    dsxrq.field.validator.message= "请填写上线日期"
                    dsxrq.field.validator.required=true
                }
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
                stepcode:'01'
            }).then(res=>{
                if(res.status==200){
                    //将不为空的步骤处理人设置为查询出来的处理人，如果已有默认值，则不处理。
                    data.handlers.map(item=>{
                        if(item.flag=='AGREE'&&(item.ids==null||item.ids=='')){
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
        let yzfs=formData.findWidgetByName('iyzfs');
        if(yzfs){
            yzfs.field.fieldProps.onChange= e => {
                //1：仅测试环境验证  2：仅生产环境验证 3：测试及生产环境验证
                let flag = e.target.value==1||e.target.value==2 ? true : false;
                // 获取fieldProp 的校验规则集合
                validationRequireField(this, 'dsxrq', flag,'请填写上线日期!')
            }
        }
        if (!this.props.isHistory) {
            this.props.form.setFieldsValue({
                'dxfrq': new Date()
            })
        }
    }
    handleCondition(e) {
        super.handleCondition(e)
        let _this = this
        let flag = e.target.value == 'REFUSE_LD' ? true : false;
        // 拒绝时将sjgsshyj设置为必填
        validationRequireField(_this, 'sdescription', flag)
        let flag1 = e.target.value == 'AGREE_JS'||e.target.value == 'REFUSE_LD'||e.target.value == 'REFUSE_XK' ? false : true;
        // 获取fieldProp 的校验规则集合
        validationRequireField(_this, 'iyzfs', flag1,'请选择验证方式!')
        validationRequireField(_this, 'dsxrq', false)
        _this.props.form.resetFields(['dsxrq','iyzfs']);
    }
    /**
     * 保存前
     * @param formData
     */
    onBeforeSave = (formData, btnName) => {
        let scondition = this.props.form.getFieldValue('scondition');
        if(scondition=='REFUSE_LD'||scondition=='REFUSE_XK'){
            return new Promise((resolve)=>{
                resolve(true)
            })
        }else{
            return fileValidation(this, btnName, 'ldxflc', '04')
        }
    }
}
CoustomFlowForm04 = FlowForm.createClass(CoustomFlowForm04);
export default CoustomFlowForm04;