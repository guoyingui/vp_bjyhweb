import React, { Component } from "react";
import FlowListTab from '../../../templates/dynamic/Flow/FlowListTab';

import {
    vpQuery,VpConfirm,vpAdd,VpTooltip,VpIcon
} from 'vpreact';
class CoustomFlowListTabTable extends FlowListTab.Table.Component{
    constructor(props) {
        super(props);
    }
    handleStop (e, record) {
        e.stopPropagation();
        let _this = this
        record.entityid = _this.props.entityid
        record.iid = _this.props.iid
        let param = { pdId: record.pdId, piId: record.piId }
        VpConfirm({
            title: '提示',
            content: '是否确认强行终止流程？',
            onOk(){
                vpQuery('/{vpflow}/rest/process/end-process', {
                    ...param
                }).then((response) => {
                    if(response.data ==='ok'){
                        //将流程实体状态设置为强行终止。
                        _this.changeObjectState();
                        _this.tableRef.getTableData();//刷新页面
                    }
                })
            },
            onCancel(){}
        }); 
    }
    changeObjectState=()=>{
        vpAdd('/{bjyh}/ldxfRest/changeObjectState', {
            iid:this.props.iid,
            stateCode:'010',
            entityid:this.props.entityid
        }).then(resdata =>{
            console.log(resdata)
        })
    }
    getHeader(){
        let _header = [
            {
                title: '状态', dataIndex: 'taskState', key: 'taskState', width: 60,
                render: (text, record) => {
                    let viewState = "";
                    if (record.taskState == -1) {
                        viewState = <VpTooltip placement="top" title="进行中 已超时">
                            <VpIcon className="m-r-xs" type="vpicon-handle" />
                        </VpTooltip>;
                    }
                    if (record.taskState == 0) {
                        viewState = <VpTooltip placement="top" title="进行中 未超时">
                            <VpIcon className="m-r-xs" type="vpicon-clock" />
                        </VpTooltip>;
                    }
                    else if (record.taskState == 1) {
                        viewState = <VpTooltip placement="top" title="已终止">
                            <VpIcon className="m-r-xs" type="vpicon-close" />
                        </VpTooltip>;
                    }
                    else if (record.taskState == 2) {
                        viewState = <VpTooltip placement="top" title="已完成">
                            <VpIcon className="m-r-xs" type="vpicon-check" />
                        </VpTooltip>;
                    }
                    return (<span>{viewState}</span>)
                }
            },
            { title: '流程名称', dataIndex: 'flowName', key: 'flowName', width: 150 },
            { title: '当前步骤', dataIndex: 'activityName', key: 'activityName', width: 150 },
            { title: '发起时间', dataIndex: 'startTime', key: 'startTime', width: 150 },
            { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 150 },
            { title: '发起人', dataIndex: 'startUsername', key: 'startUsername', width: 90 },
            { title: '版本号', dataIndex: 'version', key: 'version', width: 60 }];
        _header.push({
            title: '操作', fixed: 'right', width: 100, key: 'operation', render: (text, record) => (
                <span>
                    <VpTooltip placement="top" title={record.endTime == null&&this.props.flowRole ? "处理" : "查看"}>
                        <VpIcon data-id={record.id} style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }} type="edit" />
                    </VpTooltip>
                    {this.props.flowRole ?
                        <VpTooltip placement="top" title="终止">
                            <VpIcon onClick={(e) => this.handleStop(e, record)} className="cursor text-primary m-lr-xs" type="vpicon-stop" />
                        </VpTooltip> : ''
                    }
                </span>
            )
        });
        this.setState({
            table_headers: _header,
        });
        this.props.getAddflag(true,1)
    }
}
CoustomFlowListTabTable=FlowListTab.Table.createClass(CoustomFlowListTabTable);
/**
 * 项目申请流程List
 */
class CoustomFlowListTab extends FlowListTab.Component {
    constructor(props) {
        super(props);
    }
/**
     * 配置信息，表头、过滤器
     */
    getConfig(){
        const filterData = {
            filters:[{ name: '全部', value: '-1' }, { name: '运行中', value: '0' }, { name: '终止', value: '1' }, { name: '已完成', value: '2' }]
        }
        this.setState({
            filterData,
        });
        vpQuery('/{bjyh}/flowBatchApply/getFlowRole', {
            entityid: this.props.entityid,
            iid:this.props.iid
        }).then((response)=>{
            if(response){
                this.setState({flowRole:response.flowRole})
            }
        })
    }
    /**
     * 渲染列表
     * @returns {*}
     */
     renderNormalTable(props){
        return <CoustomFlowListTabTable  {...props} iid={this.props.iid} 
        flowRole={this.state.flowRole} onStopFlowSuccess={this.onStopFlowSuccess}
        closeRightModal={this.props.closeRightModal}
        />;
    }
}

export default CoustomFlowListTab;