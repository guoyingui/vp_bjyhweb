import React,{Component} from 'react';

import {
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
    vpQuery,
    vpAdd,
    VpConfirm
} from 'vpreact';

import {requireFile } from 'utils/utils';
import {connect} from 'react-redux';
import List from "../List/index";
import StartFlowButton from './StartFlowButton';
import FlowHandler from "./FlowHandler";

/**
 * 流程列表表格
 */
class FlowListTabTable extends List.NormalTable.Component{
    constructor(props){
        super(props);

        this.closeRight = this.closeRight.bind(this);
        this.handleStop = this.handleStop.bind(this);
       
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
        }
    }

    onRowClick = (record, index) => {
        let piId = record.piId
        this.setState(record)
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
        let _this = this
        this.setState({
            showRightBox: msg,
            staskid: ''
        })
        this.reloadTable();
        //使流程页面返回列表页
        this.props.closeRightModal && this.props.closeRightModal()
    }

    //重写右侧弹出框内容
    renderRightBoxBody(props){
        return (
            <FlowHandler
                activityName={this.state.record.activityName}
                usermode={this.state.usermode}
                staskid={this.state.staskid}
                formkey={this.state.formkey}
                iobjectentityid={this.state.record.ientityid || this.props.entityid}
                iobjectid={this.state.record.iid || this.props.iid}
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
                        _this.onStopFlowSuccess(record);
                        vpAdd('/{bjyh}/customFlowConf/resetEntityFlag', {
                            ...record
                        }).then(resdata =>{
                            _this.props.closeRightModal && _this.props.closeRightModal(false);
                        })
                    }
                    //_this.reloadTable();
                })
            },
            onCancel(){}
        }); 
    }

    onStopFlowSuccess(record){
        this.props.onStopFlowSuccess && this.props.onStopFlowSuccess(record,this)
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
    
}
FlowListTabTable = List.NormalTable.createClass(FlowListTabTable);
/**
 * 实体详情页流程列表页面
 */
class FlowListTab extends List.Component{

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
        if(this.props.entityid==9||this.props.entityid==10){//高层计划，任务计划流程，根据页签是否有写权限来控制是否可以发起流程
            this.setState({flowRole:this.props.entityrole})
        }else{
            vpQuery('/{bjyh}/customDevUtil/getFlowRole', {
                entityid: this.props.entityid,
                iid:this.props.iid
            }).then((response)=>{
                if(response){
                    this.setState({flowRole:response.flowRole})
                }
            })
        }
    }

    getCustomeButtons(){
        if(this.state.flowRole){
            return [{
                name:"add",
                render:function(_thislist,props){
                    return (
                        <StartFlowButton {...props} entityid={_thislist.props.entityid} iid={_thislist.props.iid}/>
                    )
                }
            }]
        }else{
            return []
        }
        
    }

    /**
     * 不需要显示视图切换，只有普通视图一个选项
     */
    renderViewSwitch(){
        this.state.viewtype = 'list';
        this.state.view = 'list';
        return null;
    }

    /**
     * 过滤器位置
     * @returns {string}
     */
    getFilterPosition(){
        return "top";
    }
    /**
     * 渲染列表
     * @returns {*}
     */
    renderNormalTable(props){
        return <FlowListTabTable  {...props} iid={this.props.iid} 
        flowRole={this.state.flowRole} onStopFlowSuccess={this.onStopFlowSuccess}
        closeRightModal={this.props.closeRightModal}
        />;
    }

    /**
     * 点击强行终止后
     */
    onStopFlowSuccess(record){
        
    }
}

/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends StatusButton.Component {
 *
 * }
 * CustomComponent = FlowHandle.createClass(CustomComponent);
 */
let createClass = function(newClass){
    let wrapClass = List.createClass(newClass);
    wrapClass.createClass = createClass;
    wrapClass.Table = FlowListTabTable;
    wrapClass.Component = FlowListTab;
    return wrapClass;
}
export default createClass(FlowListTab);