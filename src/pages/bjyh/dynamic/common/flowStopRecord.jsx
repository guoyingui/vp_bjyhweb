import { VpModal,NormalTable,vpAdd,
        VpFormCreate,
        VpInput,
        VpForm,
        VpRow,
        VpCol,
        VpFCollapse,
        VpPanel,
        FormItem,
        VpButton,
        VpTooltip,
        VpIcon,
        VpTable,
        vpQuery,VpPopover 
    } from 'vpreact';
import React, { Component } from "react";
import List from "../../../templates/dynamic/List/index";

import DynamicForm from '../../../templates/dynamic/DynamicForm/DynamicForm';
import FlowListTab from "../../../templates/dynamic/Flow/FlowListTab";

import {requireFile } from 'utils/utils';
import {connect} from 'react-redux';
import StartFlowButton from '../../../templates/dynamic/Flow/StartFlowButton';
import FlowHandler from "../../../templates/dynamic/Flow/FlowHandler";
import { VpAlertMsg } from 'vpreact/public/Vp';

/**
 * 流程列表表格
 */
class FlowListTabTable extends List.NormalTable.Component{
    constructor(props){
        super(props);

        this.closeRight = this.closeRight.bind(this);
        this.handleStop = this.handleStop.bind(this);
        
        this.state.visible=false
    }


    getQueryParams(){
        let {quickSearch:quickvalue,filtervalue,_k} = this.props.queryParams || {};
        return {
            quickvalue,
            filtervalue,
            ientityid: this.props.entityid,//主实体id（可能不是，具体看配置是1:n还是m:n）
            iobjectid: this.props.iid,//主实体iid
            _k
        }
    }

    getCustomTableOptions(){
        return {
            dataUrl:'/{vpflow}/rest/process/objectflow'
            //onChange:this.getDesc()
        }
    }

    onRowClick = (record, index) => {
        let piId = record.piId
        vpQuery('/{vpflow}/rest/process/activitytask', {
            piId: piId
        }).then((response) => {
            this.setState({
                showRightBox: true,
                modaltitle: record.sname,
                record: record,
                staskid: response.data.taskId,
                usermode: response.data.usermode == 2 ? false : true,
                formkey: response.data.formkey || ''
            })
        });
    }

    closeRight = (msg) => {
        this.setState({
            showRightBox: msg,
            staskid: ''
        })
        this.reloadTable();
    }

    //重写右侧弹出框内容
    renderRightBoxBody(props){        
        return (
            <FlowHandler
                activityName={this.state.record.activityName}
                usermode={this.state.usermode}
                staskid={this.state.staskid}
                formkey={this.state.formkey}
                iobjectentityid={this.props.entityid}
                iobjectid={this.props.iid}
                stepkey={this.state.record.activityId}
                piid={this.state.record.piId}
                pdid={this.state.record.pdId}
                entityid={this.state.record.iflowentityid}
                endTime={this.state.record.endTime}
                closeRight={this.closeRight}
                getData={this.reloadTable}
            />
        );
    }

    handleStop = (e, record) => {
        console.log('rEcOd...',record);
        e.stopPropagation();
        this.setState({
            visible:true,
            stopRecord:record
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
                        viewState = <VpTooltip  placement="rightTop" title={`已终止：${record.desc||''}`} 
                        content={`${record.desc}`}
                        >
                            <VpIcon className="m-r-xs" type="vpicon-close" />
                        </VpTooltip >;
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
            { title: '当前步骤', dataIndex: 'activityName', key: 'activityName', width: 150 ,render: (text, record) =>{
                let arr = text.split(",");
                let str = [];
                arr.map((item)=>{
                    if(!str.includes(item)){
                        str.push(item)
                    }
                })
                record.activityName = str.join(",");
                return str.join(",");
            }},
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
                    {record.canStop&&this.props.flowRole ?
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

    componentWillMount() {
        console.log("../../../ ",this.props);
        super.componentWillMount();
        this.getDesc();        
    }

    getDesc=(resultList) =>{        
        vpAdd('/{vpczccb}/flow/getFlowShutDescList',{
            entityid:this.props.entityid,
            iid:this.props.iid,       
        }).then(response => {
            this.setState({flowDesc:response.data})
        })

    }
    
    //数据加载完
    controlAddButton(numPerPage, resultList){
        console.log('contorlAdd',resultList);
        this.getDesc(resultList)
        let flowDesc = this.state.flowDesc
        if(flowDesc){
            resultList.map((item, i) => {            
                item.desc=item.taskState===1?flowDesc[item.piId]||'':''
            })
        }

        let theight = vp.computedHeight(resultList.length, '.entityTable')
            theight = theight - 50
        let expandArr = this.getExpandedRowa(resultList, [])

        this.setState({
            tableloading: false,
            expandedRowKeys: expandArr,
            tableHeight: theight
        })

        //super.controlAddButton(numPerPage, resultList);
    }

    /**
     * 操作模态框
     */
    handleOk = () => {
        if(!this.state.reason){
            VpAlertMsg({
                message: "提示",
                description: '请填写终止原因',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
            return
        }
        this.setState({visible: false});
        let param = {pdId:this.state.stopRecord.pdId, piId:this.state.stopRecord.piId }
        vpQuery('/{vpflow}/rest/process/end-process', {
            ...param
        }).then((response) => {
            vpAdd('/{vpczccb}/flow/flowShutDesc',{
                ...this.state.stopRecord,
                entityid:this.props.entityid,
                iid:this.props.iid,
                desc:this.state.reason||''
            }).then((response) => {
                this.reloadTable();
            })
            this.doOtherSomethingMethod(this.state.stopRecord);
        })
    }
    handleCancel = () => {
        console.log('点击了取消');
        this.setState({
            visible: false,
        });
    }
    //流程终止后做的事情
    doOtherSomethingMethod=(data)=>{
        if(this.props.entityid==229){
            vpAdd("/{vpczccb}/czccb/deleteRcryAllDataByPiid",
                {piid:data.piId}
            ).then((response) => {
            })
        }
    }

    sReason =(e,s)=>{
        this.setState({reason:e.target.value})
    }

    render(){
        return(
            <div>
                {super.render()}
                 <VpModal title="登记" height={350}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading||false}
                    onCancel={this.handleCancel} >
                    
                    <label>强行终止原因:</label>
                    <VpInput type='textarea' rows={4} maxLength={2000}
                                value={this.state.reason||''} 
                                onChange={(e) => this.sReason(e,'reason')}>
                    </VpInput>
                </VpModal>
            </div>
        )
    }



}
FlowListTabTable = List.NormalTable.createClass(FlowListTabTable);

class FlowRecord extends FlowListTab.Component{
    constructor(props) {
        super(props);
    }

    /**
     * 渲染列表
     * @returns {*}
     */
    renderNormalTable(props){
        return <FlowListTabTable  {...props} iid={this.props.iid} flowRole={this.state.flowRole}/>;
    }

}
FlowRecord = FlowListTab.createClass(FlowRecord); //必须调用父类的createClass方法
export default FlowRecord;