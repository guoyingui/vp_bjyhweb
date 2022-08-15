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
    vpAdd,
    VpAlertMsg
} from 'vpreact';
import { VpSearchInput,VpSelectObject } from 'vpbusiness';
import { VpFUploader } from "./VpFUploader";
import VpChooseModal from "./VpChooseModal";
class RelReqCaseAttr extends Component{
    constructor(props) {
        super(props)
        this.props.form.setFieldsValue({ "task_id_label": this.props.data.task_name })
        this.state={
            task_id:this.props.data.task_id||"",
            task_name:this.props.data.task_name||"",
           // task_id_label:this.props.data.task_name||"",
            itemdp : {
                widget_type: "selectmodel",
                field_name: "dept_name",
                field_label: "部门名称",
                select_type: "radio",
                all_line: 1,
                widget: {
                    treeUrl: "/{bjyh}/xqyl/model/getDptTree",
                    treeKey: "iid",
                    tableHeaderUrl: "/{vpplat}/vfrm/entity/getlistHeader?irelentityid=1&scode=modelList",
                    tableDataUrl: "/{bjyh}/xqyl/model/getDptList",
                    tableMethod: "GET",
                    tableKey: "iid",
                    default_value:this.props.data.departmentId,
                    default_label:this.props.data.departmentName
                }
            },
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
        //从配置文件获取用例类型的接口url
        // let reqCaseTypeUrl=window.vp.config.jgjk.reqCaseTypeUrl||'';
        // vpQuery(reqCaseTypeUrl,{}).then(res=>{
        //     this.setState({caseType:res.caseType})
        // })
    }
    getFileArray=(record)=>{
        let fileId= record.fileId;
        if(fileId){
            return [{
                createtime: record.fileUptime,
                creator: record.fileUpname,
                fileid: record.fileId,
                filename: record.fileName,
                options: {update: false, preview: false, edit: false, delete: false, download: true},
                size: record.isize,
                status: "complete"
            }]
        }else{
            return []
        }
    }
    selectmodelChange = (val, names) => {
        this.setState({ selectValue: val })
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
            field_name:"fileId",
            iconstraint:1,
            ientityid:10006,
            irelationentityid:0,
            iwidth:0,
            label:"附件",
            default_value: formData.fileId,
            readonly:true,
            disabled:true,
            labelCol:{span:3},
            widget:{load_template:this.getFileArray(formData),default_value:formData.fileId},
            load_template:[]
        }
        const taskProps = {
            initialName:formData.taskName,
            widget_type: "selectmodel",
            field_name: "taskId",
            field_label: "任务名称",
            labelCol: { "span": 6 },
            wrapperCol: { "span": 18 },
            value:formData.taskId,
            readOnly: false,
            label: "任务名称",
            modalProps: {
                //url: 'bjyh/templates/Form/ChooseEntity',
                ajaxurl: window.vp.config.jgjk.xqbg.taskListUrl
            },
            onChange: this.selectmodelChange,
            "data-meta": {
                "rules": [{ "required": true }],
                "validate": [{
                    "trigger": ["onChange"],
                    "rules": [{ "required": true }]
                }]
            },
            widget:{default_value:formData.taskCode},
        }
        let{caseType} =this.state;
        const itemdp = this.state.itemdp;
        return(
            <VpForm horizontal>
                <div>
                    <VpRow>
                        <VpCol span={12}>
                            <VpFInput
                            {...formItemLayout}
                            {...getFieldProps('caseCode',{initialValue:formData.caseCode,rules:[{required:true, message: "用例编号不能为空"}]})}
                            label='用例编号'/>
                        </VpCol>
                        <VpCol span={12}>
                            <VpFInput
                            {...formItemLayout}
                            {...getFieldProps('caseName',{initialValue:formData.caseName,rules:[{required:true, message: "用例名称不能为空"}]})}
                            label='用例名称'/>
                        </VpCol>
                        
                    </VpRow>
                    <VpRow>
                        <VpCol span={12}>
                            <VpFInput
                                {...formItemLayout}
                                {...getFieldProps('relSystem',{initialValue:formData.relSystem,rules:[{required:true, message: "涉及系统不能为空"}]})}
                                label='涉及系统'/>
                        </VpCol>
                        <VpCol span={12}>
                            <VpFSelect label="用例类型" {...formItemLayout}>
                                <VpSelect 
                                optionsData={caseType.length>0?caseType:null}
                                {...getFieldProps('caseType',{initialValue:formData.caseType,rules:[{required:true, message: "用例类型不能为空"}]})}>
                                </VpSelect>
                            </VpFSelect>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={12}>
                            <VpFSelect label="用例状态" {...formItemLayout}>
                                <VpSelect {...getFieldProps('caseStatusId',{initialValue:formData.caseStatusId,rules:[{required:true, message: "用例状态不能为空"}]})} disabled>
                                    <VpOption value="1">新增</VpOption>
                                    <VpOption value="2">已审批</VpOption>
                                    <VpOption value="3">未通过</VpOption>
                                    <VpOption value="4">已投产</VpOption>
                                </VpSelect>
                            </VpFSelect>
                        </VpCol>
                        <VpCol span={12}>
                        <VpSelectObject
                                form={this.props.form}
                                item={itemdp}
                                bindThis={this}
                            />
                            {/* <VpChooseModal {...deptProps} form={this.props.form}/> */}
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span='12'>
                            <VpChooseModal  {...taskProps} form={this.props.form}/>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={24}>
                        <VpFInput
                            labelCol= {{span: 3}}
                            wrapperCol={{span: 21}}
                            type="textarea"
                            {...getFieldProps('caseDes',{initialValue:formData.caseDes,rules:[{required:true, message: "用例简述概要不能为空"}]})}
                            label='用例简述概要'/>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={24}>
                            <VpFUpload 
                                label='文件上传' 
                                labelCol= {{span: 3}}
                                wrapperCol={{span: 21}}>
                                    <VpFUploader
                                    {...getFieldProps('fileId',{initialValue:item.default_value,rules:[{required:true, message: "附件不能为空"}]})}
                                    form={this.props.form}
                                    item={item}
                                    />
                            </VpFUpload>
                        </VpCol>
                    </VpRow>
                </div>
            </VpForm>
        )
    }
}
export default VpFormCreate(RelReqCaseAttr);