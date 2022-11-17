import React, { Component } from "react";
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import { vpQuery, VpAlertMsg } from "vpreact";
import moment from "moment";

// 子风险属性页面
class RiskForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
    }
    //自定义控件行为
    onDataLoadSuccess = formData => {
        let _this = this;
        this.basicsInfoAuto(_this, formData)
        this.projectChange(_this, formData)
        // 架构评审中项目名称选择只显示启动和暂停状态的项目
        let rxmmc = formData.findWidgetByName('rxmmc');
        rxmmc.field.props.modalProps.condition=[{
            field_name:'istatusid',
            field_value:'5,83',
            expression:'in'
        }]
    }
    /**
     * 自动带出基础信息onSave----
     * @param _this
     * @param formData
     */
    basicsInfoAuto = (_this, formData) => {
        formData.groups[0].fields.map((item) => {
            if (item.field_name === 'djjrq') {
                item.fieldProps.initialValue = moment().format('YYYY-MM-DD');
            }
        })
        _this.props.form.setFieldsValue({
            roleid1000198: '',
            roleid1000198_label: '',
        });
    }
    /**
     * 选择项目事件
     * @param _this
     * @param formData
     */
    projectChange = (_this, formData) => {
        let rxmmc = formData.findWidgetByName("rxmmc")
        if (rxmmc != null) {
            rxmmc.field.fieldProps.onChange = (value) => {
                this.projectBasicsInfo(_this, value, formData)
            }
        }
    }
    /**
     * 项目基础信息
     * @param _this
     * @param value
     */
    projectBasicsInfo = (_this, value, formData) => {
        return new Promise(resolve => {
            vpQuery('/{vpplat}/vfrm/entity/getRowData', {
                entityid: '7', iid: value, viewcode: 'vpm_pj_project'
            }).then((response) => {
                if (response.data != null) {
                    let data = response.data
                    console.log('data', data)
                    // 项目编号：根据项目名称字段自动带出
                        let sxmbh = formData.findWidgetByName("sxmbh")
                        if (sxmbh != null) {
                            _this.props.form.setFieldsValue({
                                sname: data.sname,
                                sxmbh: data.scode
                            })
                        }
                        this.projectExtInfo(_this, value, formData)
                        resolve(formData)
                    }
                resolve(false)
            })
        })
    }

    /**
     * 项目其他信息
     * @param _this
     * @param value
     */
    projectExtInfo = (_this, value, formData) => {
        _this.props.form.setFieldsValue({
            sname: _this.props.form.getFieldValue('sname') ,
        })
        vpQuery('/{bjyh}/xmfx/querySpecialProjectById', {
            projectid: value
        }).then((response) => {
            if (response.data != null) {
                let data = response.data
                console.log('data', data)
                _this.props.form.setFieldsValue({
                    roleid115: data.xmjl,
                    roleid115_label: data.xmjlname,
                });
            }
        })
    }
    /**
     * 处理状态按钮
     * @param variid 状态ID
     * @param statusFormValues 状态表单数据
     */
    handleStatus(variid,statusFormValues){
    console.log(variid,statusFormValues, 'variid,statusFormValues');
    return
        let btnName = "status";
        this.submit(btnName,{
            onSaveSuccess:({mainFormSaveReturnData,btnName}) => {
                VpAlertMsg({
                    message:"消息提示",
                    description:'操作成功！',
                    type:"success",
                    closeText:"关闭",
                    showIcon: true
                }, 5);
                this.onSaveSuccess(mainFormSaveReturnData,btnName);
                this.loadFormData();
                this.queryEntityRole();
                this.queryStatusList();
                this.props.closeRightModal && this.props.closeRightModal();
            },
            onSave:(formData,successCallback,errorCallback) => {
                let sparam = JSON.parse(formData.sparam);
                sparam = { ...sparam, ...statusFormValues , sydcs: statusFormValues.sadvice };
                formData.variid = variid;
                formData.sparam = JSON.stringify(sparam);
                this.onSave(formData,btnName,(data) => {
                    successCallback(data.data.iid,data);
                })
            }
        })
    }
}
RiskForm = DynamicForm.createClass(RiskForm)
export default RiskForm
