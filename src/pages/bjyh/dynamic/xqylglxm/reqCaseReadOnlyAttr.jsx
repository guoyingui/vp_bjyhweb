import React, { Component } from "react";
import {
    VpFormCreate,
    VpForm,
    VpFInput,
    VpFInputNumber,
    VpButton,
    VpFCheckbox,
    VpFRadio,
    VpRadioGroup,
    VpRadioButton,
    VpSelect,
    VpOption,
    VpFSelect,
    VpFSwitch,
    VpFCascader,
    VpFSlider,
    VpFDatePicker,
    VpFTimePicker,
    VpFUpload,
    VpUpLoad,
    VpFRangePicker,
    VpRow,
    VpCol,
    vpQuery,
} from 'vpreact';
import { VpSearchInput } from 'vpbusiness';
import { VpFUploader } from "./VpFUploader";
import VpChooseModal from "./VpChooseModal";
class ReqCaseReadOnlyAttr extends Component{
    constructor(props) {
        super(props)
        this.state={
            task_id:this.props.data.task_id||"",
            task_name:this.props.data.task_name||"",
            caseType:[]//用例类型
        }
    }
    componentWillMount(){
        //加载用例类型
        this.getReqCaseType();
    }
    //获取需求用例类型
    getReqCaseType=()=>{
        let caseType=[{
            value:1,
            label:'业务服务类'
        },{
            value:2,
            label:'产品配置类'
        },{
            value:3,
            label:'交互式视觉类'
        },{
            value:4,
            label:'接口API'
        },{
            value:5,
            label:'参数化维护与数据补录类'
        },{
            value:6,
            label:'查询报表类'
        }];
        this.setState({caseType})
    }
    onSaveForm=()=>{
        let flag=this.props.form.validateFieldsAndScroll();
        let formData=this.props.form.getFieldsValue();
        console.log(flag,formData)
    }
    render() {
        const formData=this.props.data;
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const item={
            field_label:"附件",
            field_name:"rfj",
            iconstraint:1,
            ientityid:10006,
            irelationentityid:0,
            iwidth:0,
            label:"附件",
            readonly:true,
            labelCol:{span:3},
            widget:{load_template:[{
                createtime: 1649704173000,
                creator: "刘嘉文",
                fileid: "6919303725265715224",
                filename: "总经理办公会会议纪要.txt",
                instanceid: 16325,
                options: {update: false, preview: false, edit: false, delete: false, download: true},
                size: 45,
                status: "complete"
            }],default_value:''},
            load_template:[]
        }
        const taskProps={
            data: {initialValue: formData.task_id},
            field_name: "task_id",
            initialName: formData.task_name,
            irelationentityid: 2,//这是弹出窗里要弹出的实体id列表
            label: "任务名称",
            labelCol: {span: 6},
            modalProps: {url: 'bjyh/templates/Form/ChooseEntity',ajaxurl:''},
            value: formData.task_id,
            widget_type: "selectmodel",
            wrapperCol: {span: 18}
        }
        let{caseType} =this.state;
        return(
            <VpForm horizontal>
                <div>
                    <VpRow>
                        <VpCol span={12}>
                            <VpFInput
                            disabled
                            {...formItemLayout}
                            {...getFieldProps('case_code',{initialValue:formData.case_code})}
                            label='用例编号'/>
                        </VpCol>
                        <VpCol span={12}>
                            <VpFInput
                            disabled
                            {...formItemLayout}
                            {...getFieldProps('case_name',{initialValue:formData.case_name})}
                            label='用例名称'/>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={12}>
                            <VpFInput
                            disabled
                            {...formItemLayout}
                            {...getFieldProps('project_code',{initialValue:formData.project_code})}
                            label='项目编号'/>
                        </VpCol>
                        <VpCol span={12}>
                            <VpFInput
                            disabled
                            {...formItemLayout}
                            {...getFieldProps('project_name',{initialValue:formData.project_name})}
                            label='项目名称'/>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={12}>
                            <VpFInput
                            disabled
                            {...formItemLayout}
                            {...getFieldProps('task_code',{initialValue:formData.task_code})}
                            label='任务编号'/>
                        </VpCol>
                        <VpCol span={12}>
                            <VpFInput
                            disabled
                            {...formItemLayout}
                            {...getFieldProps('task_name',{initialValue:formData.task_name})}
                            label='任务名称'/>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={12}>
                            <VpFInput
                            disabled
                            {...formItemLayout}
                            {...getFieldProps('case_name',{initialValue:formData.case_name})}
                            label='用例名称'/>
                        </VpCol>
                        <VpCol span={12}>
                            <VpChooseModal disabled {...taskProps} form={this.props.form}/>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={12}>
                            <VpFInput
                                disabled
                                {...formItemLayout}
                                {...getFieldProps('rel_system',{initialValue:formData.rel_system})}
                                label='涉及系统'/>
                        </VpCol>
                        <VpCol span={12}>
                            <VpFSelect label="用例类型" {...formItemLayout}>
                                <VpSelect 
                                disabled
                                optionsData={caseType.length>0?caseType:null}
                                {...getFieldProps('case_type',{initialValue:formData.case_type})}>
                                </VpSelect>
                            </VpFSelect>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={12}>
                            <VpFSelect label="用例状态" {...formItemLayout}>
                                <VpSelect disabled {...getFieldProps('case_status',{initialValue:formData.case_status})}>
                                    <VpOption value="1">新增</VpOption>
                                    <VpOption value="2">已审批</VpOption>
                                    <VpOption value="3">未通过</VpOption>
                                    <VpOption value="4">已投产</VpOption>
                                </VpSelect>
                            </VpFSelect>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={24}>
                        <VpFInput
                            disabled
                            labelCol= {{span: 3}}
                            wrapperCol={{span: 21}}
                            type="textarea"
                            {...getFieldProps('case_des',{initialValue:formData.case_des})}
                            label='用例简述概要'/>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={24}>
                            <VpFUpload 
                                {...getFieldProps('rfj',{initialValue:''})}
                                label='文件上传' 
                                labelCol= {{span: 3}}
                                wrapperCol={{span: 21}}>
                                    <VpFUploader
                                    {...getFieldProps('rfj',{initialValue:''})}
                                    form={this.props.form}
                                    item={item}
                                    />
                            </VpFUpload>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol style={{display:'none'}}>
                            
                        </VpCol>
                    </VpRow>
                </div>
            </VpForm>
        )
    }
}
export default VpFormCreate(ReqCaseReadOnlyAttr);