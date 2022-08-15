import React, { Component } from "react";
import {
    vpAdd,
    VpIconFont,
    VpRow,
    VpCol,
    VpModal,
    VpInput,
    VpIcon,
    VpTooltip,
    VpButton,
    VpPopconfirm,
    VpWidgetGroup,
    VpAlertMsg,
    VpSwitch,
    VpAlert,
} from "vpreact";
import { VpSearchInput,VpDTable } from 'vpbusiness';
import  RelReqCaseModal  from './relReqCaseModal';
import RelReqCaseEditAttr from './reqCaseEditAttr';
import ReqCaseReadOnlyAttr from "./reqCaseReadOnlyAttr";
const data1 = [];
for (let i = 0; i < 46; i++) {
    data1.push({
        "case_id": i,
        "case_code": "CODE_CC_"+i,
        "case_name": "用例名称"+i,
        "project_code": "PR_"+i,
        "project_name": "项目名称"+i,
        "entity_id": "22",
        "flow_id": "22"+i,
        "task_id": "3"+i,
        "task_code": "TASK_"+i,
        "task_name": "任务名称"+i,
        "file_id": "附件id",
        "file_name": "附件名称",
        "case_type": "1",
        "case_type_name": "用例类型名称",
        "department_id": "部门id",
        "department_name": "部门名称",
        "case_des": "用例简述概要",
        "rel_system": "涉及系统",
        "case_status": "1",
        "case_status_name": "用例状态名称",
        "user_code": "创建人工号",
        "user_name": "创建人姓名",
        "creat_time": "创建时间",
        "upate_time": "更新时间",
        "rel_filename": "关联附件名称,只有在（用例新增流程）中用到",
        "flow_type": "流程类型",
        "rel_flag": "创建关联标识,只有在（已关联项目的需求用例变更流程）中用到",
        "case_change_name": "用例变更是:取消关联,创建关联,变更内容,只有在（已关联项目的需求用例变更流程）中用到",
        "flow_status": "流程状态",
    });
}
class ReqCaseChildPage extends Component{
    constructor(props) {
        super(props)
        this.state={
            relReqCaseModalVisible:false,//关联用例框是否弹出
            reqCaseEditAttrVisible:false,//属性框是否弹出
            reqCaseReadOnlyAttrVisible:false,
            tableHeight:300, //表格高度
            formData:{},//属性表单值
            quickvalue:'',
            table_array:[],
            stepcode: this.props.stepcode,
            parentForm:this.props.registerSubForm&&this.props.registerSubForm(this.props.field_name,this)
        }
    }
    componentWillMount(){
        this.getListData();
    }
    handleChange = (e) => {
        this.setState({
            quickvalue:e.target.value
        })
	}
    searchButton = () => {
        this.handleEnter();
	}
    onRowClick=(record)=>{
        console.log(record)
        this.setState({reqCaseReadOnlyAttrVisible:true,formData:record});
    }
    //关联用例按钮模态窗打开事件
    relReqCase=(record)=>{
        this.setState({relReqCaseModalVisible:true});
    }
    //关联用例按钮模态窗关闭事件
    handleCancel = () => {
        this.setState({
            reqCaseEditAttrVisible: false,
            relReqCaseModalVisible:false,
            reqCaseReadOnlyAttrVisible:false
        },()=>{
            this.getListData();
        });
    }
    handleEnter = () => {
        console.log(this.state.quickvalue);
        this.getListData();
	}
    //取消关联事件
    unlinkClick=(record)=>{
        console.log("取消关联",record);
        console.log("主表单",this.state.parentForm);
        console.log("项目编号",this.state.parentForm.props.form.getFieldValue('sxmbh'),this.state.parentForm.props.form.getFieldValue('rxmmc_label'));
        let jsonPara={
            case_id:record.case_id,
            flow_id:this.props.piid
        }
        vpAdd(window.vp.config.jgjk.xqbg.deleteVpCaseAdd,{jsonPara:JSON.stringify(jsonPara)}).then(res=>{
            if(res.code==200){
                VpAlertMsg({
                    message:"消息提示",
                    description:"取消关联成功",
                    type:"success",
                    showIcon: true
                }, 3)
                this.getListData();
            }else{
                VpAlertMsg({
                    message:"消息提示",
                    description:"取消关联失败",
                    type:"success",
                    showIcon: true
                }, 3)
            }
        })
    }
    getFormValue=(value)=>{
        console.log(value)
    }
    saveForm=()=>{
        let form=this.state.parentForm.props.form;
        let obj={};
        if(form){
            obj={
                "project_code": form.getFieldValue('sxmbh'),
                "project_name": form.getFieldValue('rxmmc_label')
            }
        }
        this.attrRef.onSaveForm(obj);
    }
    onValidate=(options,callback)=>{
        VpAlertMsg({
            message:"消息提示",
            description:"验证成功",
            type:"success",
            showIcon: true
        }, 3)
        callback(null,null)
    }
    getListData=()=> {
        let form=this.state.parentForm.props.form;
        const _this = this;
        let jsonPara={
                quickSearch:this.state.quickvalue,
                flow_id:this.props.piid,
                project_code:form.getFieldValue('sxmbh'),
                flow_type:2
            }
        vpAdd(window.vp.config.jgjk.xqbg.xqbgListUrl, {
            jsonPara:JSON.stringify(jsonPara)
        }).then((datas) => {
            if(datas.rows){
                let data = datas.rows;
                _this.setState({
                    table_array: data
                })
            }
        })
    }
    render() {
        let optionsCol = {
            title: '操作',
            fixed: 'right',
            iwidth: '150',
            optionsData: [
                {  title:'取消关联',render:(record)=>{
                    return(
                        <VpPopconfirm title="确定要取消关联这个用例吗？" onConfirm={(e)=>{this.unlinkClick(record)}}>
                            <VpTooltip placement="topLeft" title="取消关联" arrowPointAtCenter>
                                <VpIconFont type="vpicon-unlink" onClick={(e) => { e.stopPropagation() }} className='text-danger m-lr-xs'/>
                            </VpTooltip>
                        </VpPopconfirm>
                    )
                }},
            ]
        }
        let data=[{
            "case_id": "1",
            "case_code": "用例编号",
            "case_name": "用例名称1",
            "project_code": "项目编号",
            "project_name": "项目名称",
            "entity_id": "vp的实体id",
            "flow_id": "vp的流程id",
            "task_id": "3",
            "task_code": "任务编号",
            "task_name": "任务名称",
            "file_id": "附件id",
            "file_name": "附件名称",
            "case_type": "用例类型",
            "case_type_name": "用例类型名称",
            "department_id": "部门id",
            "department_name": "部门名称",
            "case_des": "用例简述概要",
            "rel_system": "涉及系统",
            "case_status": "用例状态",
            "case_status_name": "用例状态名称",
            "user_code": "创建人工号",
            "user_name": "创建人姓名",
            "creat_time": "创建时间",
            "upate_time": "更新时间",
            "rel_filename": "关联附件名称,只有在（用例新增流程）中用到",
            "flow_type": "流程类型",
            "rel_flag": "创建关联标识,只有在（已关联项目的需求用例变更流程）中用到",
            "case_change_name": "用例变更是:取消关联,创建关联,变更内容,只有在（已关联项目的需求用例变更流程）中用到",
            "flow_status": "流程状态",
        },{
            "case_id": "2",
            "case_code": "用例编号",
            "case_name": "用例名称2",
            "project_code": "项目编号",
            "project_name": "项目名称",
            "entity_id": "vp的实体id",
            "flow_id": "vp的流程id",
            "task_id": "4",
            "task_code": "任务编号",
            "task_name": "任务名称",
            "file_id": "12",
            "file_name": "附件名称",
            "case_type": "用例类型",
            "case_type_name": "用例类型名称",
            "department_id": "部门id",
            "department_name": "部门名称",
            "case_des": "用例简述概要",
            "rel_system": "涉及系统",
            "case_status": "用例状态",
            "case_status_name": "用例状态名称",
            "user_code": "创建人工号",
            "user_name": "创建人姓名",
            "creat_time": "创建时间",
            "upate_time": "更新时间",
            "rel_filename": "关联附件名称,只有在（用例新增流程）中用到",
            "flow_type": "流程类型",
            "rel_flag": "创建关联标识,只有在（已关联项目的需求用例变更流程）中用到",
            "case_change_name": "用例变更是:取消关联,创建关联,变更内容,只有在（已关联项目的需求用例变更流程）中用到",
            "flow_status": "流程状态",
        },{
            "case_id": "主键",
            "case_code": "用例编号",
            "case_name": "用例名称",
            "project_code": "项目编号",
            "project_name": "项目名称",
            "entity_id": "vp的实体id",
            "flow_id": "vp的流程id",
            "task_id": "5",
            "task_code": "任务编号",
            "task_name": "任务名称",
            "file_id": "附件id",
            "file_name": "附件名称",
            "case_type": "用例类型",
            "case_type_name": "用例类型名称",
            "department_id": "部门id",
            "department_name": "部门名称",
            "case_des": "用例简述概要",
            "rel_system": "涉及系统",
            "case_status": "用例状态",
            "case_status_name": "用例状态名称",
            "user_code": "创建人工号",
            "user_name": "创建人姓名",
            "creat_time": "创建时间",
            "upate_time": "更新时间",
            "rel_filename": "关联附件名称,只有在（用例新增流程）中用到",
            "flow_type": "流程类型",
            "rel_flag": "创建关联标识,只有在（已关联项目的需求用例变更流程）中用到",
            "case_change_name": "用例变更是:取消关联,创建关联,变更内容,只有在（已关联项目的需求用例变更流程）中用到",
            "flow_status": "流程状态",
        },{
            "case_id": "主键",
            "case_code": "用例编号",
            "case_name": "用例名称",
            "project_code": "项目编号",
            "project_name": "项目名称",
            "entity_id": "vp的实体id",
            "flow_id": "vp的流程id",
            "task_id": "5",
            "task_code": "任务编号",
            "task_name": "任务名称",
            "file_id": "附件id",
            "file_name": "附件名称",
            "case_type": "用例类型",
            "case_type_name": "用例类型名称",
            "department_id": "部门id",
            "department_name": "部门名称",
            "case_des": "用例简述概要",
            "rel_system": "涉及系统",
            "case_status": "用例状态",
            "case_status_name": "用例状态名称",
            "user_code": "创建人工号",
            "user_name": "创建人姓名",
            "creat_time": "创建时间",
            "upate_time": "更新时间",
            "rel_filename": "关联附件名称,只有在（用例新增流程）中用到",
            "flow_type": "流程类型",
            "rel_flag": "创建关联标识,只有在（已关联项目的需求用例变更流程）中用到",
            "case_change_name": "用例变更是:取消关联,创建关联,变更内容,只有在（已关联项目的需求用例变更流程）中用到",
            "flow_status": "流程状态",
        }];
        const columns = [
            { title: '用例编号', width: 100, dataIndex: 'case_code',  },
            { title: '用例名称', width: 100, dataIndex: 'case_name', },
            { title: '项目编号', dataIndex: 'project_code',  width: 150 },
            { title: '项目名称', dataIndex: 'project_name',  width: 150 },
            { title: '任务编号', dataIndex: 'task_code',  width: 150 },
            { title: '任务名称', dataIndex: 'task_name', width: 150 },
            { title: '用例类型名称', dataIndex: 'case_type_name',  width: 150 },
            { title: '用例简述概要', dataIndex: 'case_des', width: 150 },
            { title: '涉及系统', dataIndex: 'rel_system',  width: 150 },
            { title: '用例状态', dataIndex: 'case_status_name',  width: 150 },
            { title: '操作状态', dataIndex: 'case_change_name',  width: 150 },
            { title: '创建人', dataIndex: 'user_name',  width: 150 },
            { title: '创建时间', dataIndex: 'creat_time',  width: 150 },
            //{ title: '操作', key: 'operation',  width: 100, render: () => <VpButton type="primary" onClick={this.relReqCase}>关联用例</VpButton>, },
        ];
        // const pagination = {
        //     total: 45,
        //     showSizeChanger: true,
        //     onShowSizeChange(current, pageSize) {
        //         console.log('Current: ', current, '; PageSize: ', pageSize);
        //     },
        //     onChange(current) {
        //         console.log('Current: ', current);
        //     },
        // };
        const rowSelection = {
            getCheckboxProps: record => ({
                disabled: record.name === '李大嘴1',    // 配置无法勾选的列
            }),
        };
        let form=this.state.parentForm.props.form;
        let obj={};
        if(form){
            obj={
                "project_code": form.getFieldValue('sxmbh'),
                "project_name": form.getFieldValue('rxmmc_label')
            }
        }
        console.log('obj',obj)
        return (
            <div style={{ marginLeft: 0, marginRight: 30,marginBottom:20 }}>
                <VpRow className="bg-white">
                    <VpCol span={5}>
                        <VpSearchInput
                        ref={dom => this.searchInput = dom}
                        onPressEnter={this.handleEnter}
                        onChange={this.handleChange}
                        placeholder="请输入搜索内容"
                        searchButton={this.searchButton} />
                    </VpCol>
                    <VpCol offset={16} span={3} className="gutter-row text-right">
                        {this.state.stepcode == '01' ?
                            <VpButton type="primary" onClick={this.relReqCase}>关联用例</VpButton> : null
                        }                    </VpCol>
                </VpRow>
                <VpRow className="b-b bg-white" style={{top:10}}>
                    <VpCol span={24}>
                        <VpDTable
                        columns={columns}
                        dataSource={data/*this.state.table_array*/}
                        scroll={{ y: this.state.tableHeight }}
                        resize
                        bindThis={this}
                        pagination={false}
                        onRowClick={this.onRowClick}
                        //rowSelection={rowSelection}
                        optionsCol={this.state.stepcode=='01'?optionsCol:null}
                        />
                    </VpCol>
                </VpRow>
                <VpModal
                    title="选择需要关联的需求用例"
                    visible={this.state.relReqCaseModalVisible}
                    onCancel={this.handleCancel}
                    width={'70%'}
					wrapClassName='modal-no-footer dynamic-modal'
                    footer={null}>
                    {this.state.relReqCaseModalVisible?
                    <RelReqCaseModal
                    onOk={this.handleCancel}
                    piid={this.props.piid||''}
                    taskid={this.props.taskid||''}
                    item={{
                        irelationentityid:2,
                        modalProps:{ajaxurl:""},
                        widget_type:""
                    }}
                    {...obj}
                    />:null}
                </VpModal>
                <VpModal
                    title={"查看"}
                    width="60%"
                    visible={this.state.reqCaseReadOnlyAttrVisible}
                    irelationentityid={2}
                    onCancel={this.handleCancel}
                    style={{height:'70%'}}
                    footer={
                        <div className="text-center">
                        {/*<VpButton type="primary" onClick={this.saveForm}>保存</VpButton>
                        <VpButton type="ghost" onClick={this.handleCancel}>取消</VpButton>*/}
                        </div>
                    }>
                    {this.state.reqCaseReadOnlyAttrVisible?<RelReqCaseEditAttr
                    bindThis={(e)=>this.attrRef=e}
                    parent={this}
                    data={this.state.formData}
                    piid={this.props.piid||''}
                    taskid={this.props.taskid||''}/>:null}
                </VpModal>
                {/* <VpModal
                    title="查看"
                    width="60%"
                    visible={this.state.reqCaseReadOnlyAttrVisible}
                    irelationentityid={2}
                    onCancel={this.handleCancel}
                    style={{height:'80%'}}
                    footer={<div className="text-center">
                    <VpButton type="primary" onClick={this.saveForm}>保存</VpButton>
                    <VpButton type="ghost" onClick={this.handleCancel}>取消</VpButton>
                    </div>}>
                    {this.state.reqCaseReadOnlyAttrVisible?<ReqCaseReadOnlyAttr data={this.state.formData}/>:null}
                </VpModal> */}
            </div>
        );
    }
}
export default ReqCaseChildPage;