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
    vpQuery,VpConfirm
    
} from 'vpreact';

import {requireFile } from 'utils/utils';
import {connect} from 'react-redux';
import List from "../../../templates/dynamic/List/index";
import StartFlowButton from '../../../templates/dynamic/Flow/StartFlowButton';
import FlowHandler from "../../../templates/dynamic/Flow/FlowHandler";
/**
 * 流程列表表格
 */
class FlowListTabTable extends List.NormalTable.Component{
    constructor(props){
        super(props);
        console.log("FlowListTabTable");

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
            dataUrl:'/bjyhprovider/xmlc/queryXmLc?ientityid='+ this.props.entityid+'&iobjectid='+this.props.iid
        }
    }

    onRowClick = (record, index) => {
        console.log("onRowClick",record);
        this.setState(record)
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
                    //_this.onStopFlowSuccess(record);
                    _this.reloadTable();
                })
            },
            onCancel(){}
        }); 
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
        console.log("header",_header);
        
        this.setState({
            table_headers: _header,
        });
        this.props.getAddflag(true,1)
    }

    controlAddButton =(page,reslist)=>{
        super.controlAddButton(page,reslist)
        console.log('reslist',reslist);
        
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
        vpQuery('/{bjyh}/customDevUtil/getFlowRole', {
            entityid: this.props.entityid,
            iid:this.props.iid
        }).then((response)=>{
            if(response){
                console.log("response",response)
                this.setState({flowRole:response.flowRole})
            }
        })

        vpQuery('/{bjyh}/tfsrest/lookOldProject', {
            iid: this.props.iid
        }).then((response) => {
            if (response == '0') {
                this.setState({isshowoldbutton:true})
            }
        })
    }

    getCustomeButtons(){
        let _this = this
        //console.log("this.state.isshowoldbutton",this.state.isshowoldbutton);
        
        if(this.state.flowRole){
            if(this.state.isshowoldbutton){
                return [{
                        name:"add",
                        render:function(_thislist,props){
                            return (
                                <StartFlowButton {...props} entityid={_thislist.props.entityid} iid={_thislist.props.iid}/>
                            )
                        }
                    },{
                        name:"查看老项目流程",
                        render:function(_thislist,props){
                            return ( 
                                <VpTooltip placement="top" title="查看老系统流程">
                                    <VpButton type="Primary" shape="round" size="large" className="m-l-xs" onClick={_this.Look}>
                                        查看老系统流程
                                    </VpButton>
                                </VpTooltip>
                            )
                        }
                    }
                ]
            }else{
                return [{
                        name:"add",
                        render:function(_thislist,props){
                            return (
                                <StartFlowButton {...props} entityid={_thislist.props.entityid} iid={_thislist.props.iid}/>
                            )
                        }
                    }
                ]
            }


            
        }else{
            if(this.state.isshowoldbutton){
                return [{
                        name:"查看老项目流程",
                        render:function(_thislist,props){
                            return ( 
                                <VpTooltip placement="top" title="查看老系统流程">
                                    <VpButton type="Primary" shape="round" size="large" className="m-l-xs" onClick={_this.Look}>
                                        查看老系统流程
                                    </VpButton>
                                </VpTooltip>
                            )
                        }
                }]
            }else{
                return [{}]
            }
            
        }
        
    }
    Look = () => {
        //console.log("iid:",this.props.iid);
        //console.log("userid:",vp.cookie.getTkInfo('userid'));
        const w=window.open('about:blank');
        //w.location.href='http://10.160.2.187:9080/project/timeOutLogin.jsp?id='+this.props.iid+'&userid='+vp.cookie.getTkInfo('userid');//测试环境
        w.location.href='http://10.116.147.167:8088/project/timeOutLogin.jsp?id='+this.props.iid+'&userid='+vp.cookie.getTkInfo('userid');//生产环境
        this.setFormSubmiting(false);
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
        flowRole={this.state.flowRole}
        />;
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
    return wrapClass;
}
export default createClass(FlowListTab);