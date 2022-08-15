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
    VpMInfo
} from "vpreact";
import { VpSearchInput,VpDTable } from 'vpbusiness';
import  RelReqCaseModal  from './relReqCaseModal';
import RelReqCaseEditAttr from './reqCaseEditAttr';
import ReqCaseReadOnlyAttr from "./reqCaseReadOnlyAttr";
class ReqCaseChildPage extends Component{
    constructor(props) {
        super(props)

        this.state={
            iconstraint:this.props.iconstraint,//0-->必填 1--可选输入 2-->只读
            relReqCaseModalVisible:false,//关联用例框是否弹出
            reqCaseEditAttrVisible:false,//属性框是否弹出
            reqCaseReadOnlyAttrVisible:false,
            tableHeight:300, //表格高度
            formData:{},//属性表单值
            quickvalue:'',
            table_array:[],
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
        let jsonPara={
            case_id:record.case_id,
            flow_id:this.props.piid
        }
        vpAdd(window.vp.config.jgjk.sxsq.deleteCase,{jsonPara:JSON.stringify(jsonPara)}).then(res=>{
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

    getListData=()=> {
        let form=this.state.parentForm.props.form;
        const _this = this;
        let jsonPara={
                quickSearch:this.state.quickvalue,
                flow_id:this.props.piid,
                project_code:form.getFieldValue('sxmbh'),
                flow_type:5
            }
        vpAdd(window.vp.config.jgjk.sxsq.sxsqListUrl, {
            jsonPara:JSON.stringify(jsonPara)
        }).then((datas) => {
            if(datas.rows){
                let data = datas.rows;
                _this.setState({
                    table_array: data
                })
            }
        }).catch((error)=>{
            VpAlertMsg({ 
                message:"消息提示",
                description:"调用IT架构平台数据接口异常，请联系系统管理员。",
                type:"error",
                showIcon: true
            }, 3)
        })
    }
    render() {
        let optionsCol = {
            title: '操作', 
            fixed: 'right', 
            iwidth: '150', 
            optionsData: [
                {  title:'取消关联',render:(record)=>{
                    return(this.state.iconstraint!='2'?
                        <VpPopconfirm title="确定要取消关联这个用例吗？" onConfirm={(e)=>{this.unlinkClick(record)}}>
                            <VpTooltip placement="topLeft" title="取消关联" arrowPointAtCenter>
                                <VpIconFont type="vpicon-unlink" onClick={(e) => { e.stopPropagation() }} className='text-danger m-lr-xs'/>
                            </VpTooltip>
                        </VpPopconfirm>:null
                    )
                }}
            ]
        }
        
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
            { title: '创建人', dataIndex: 'user_name',  width: 150 },
            { title: '创建时间', dataIndex: 'creat_time',  width: 150 },
        ];
        let form=this.state.parentForm.props.form;
        let obj={};
        if(form){
            obj={
                "project_code": form.getFieldValue('sxmbh'),
                "project_name": form.getFieldValue('rxmmc_label')
            }
        }
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
                        {
                            this.state.iconstraint!='2'?<VpButton type="primary" onClick={this.relReqCase}>关联用例</VpButton>:null
                        }
                    </VpCol>
                </VpRow>
                <VpRow className="b-b bg-white" style={{top:10}}>
                    <VpCol span={24}>
                        <VpDTable 
                        columns={columns} 
                        dataSource={this.state.table_array}
                        scroll={{ y: this.state.tableHeight }}
                        resize
                        bindThis={this}
                        pagination={false}
                        onRowClick={this.onRowClick}
                        //rowSelection={rowSelection}
                        optionsCol={optionsCol}
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
                    title="查看"
                    width="60%"
                    visible={this.state.reqCaseReadOnlyAttrVisible}
                    irelationentityid={2}
                    onCancel={this.handleCancel}
                    style={{height:'70%'}}
                    footer={
                        <div className="text-center">
                       {/* <VpButton type="primary" onClick={this.saveForm}>保存</VpButton>
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