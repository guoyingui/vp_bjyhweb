import React, { Component } from 'react'
import {VpIconFont, VpAlertMsg,VpTable, VpIcon, VpTooltip,
     vpQuery, VpFormCreate,VpModal,VpInput,vpAdd, VpConfirm  } from 'vpreact';
import Flowtabs from '../Flow/FlowHandler';
import { RightBox } from 'vpbusiness';

//已处理流程
class myflow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHeader: [],
            tableData: [],
            curr: 1,
            limit: 10,
            filtervalue: this.props.filtervalue||'',
            quickvalue: '',
            showRightBox: false,
            total_rows: '',
            pagination: {},
            visible: false,
            staskid: '',
            entityid: '',
            iid: '',
            record: {},
            usermode: '',
            formkey: '',
            tableHeight:0,
            showStopModle:false,
            flowDesc:{}
        }

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            filtervalue:nextProps.filtervalue,
            quickvalue:nextProps.quickvalue
        },()=>{
            this.getData()
        })
    }
    componentWillMount() {
        this.getHeader()
        this.getData()
    }
    componentDidMount() {
        let tHeight = $(window).height() - 255 // 这里的255是指表格最大高度之外的距离（主要是距离顶部和底部）
        $(".myflow").find(".ant-table-body").css({
            height: tHeight
        })
    }
    //获取列头
    getHeader = () => {
        let headers =  [
            {
                title: '状态', dataIndex: 'taskState', key: 'taskState', width:80,
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
                        viewState = <VpTooltip placement="top" title={'已终止'}>
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
            {title: '流程名称',dataIndex: 'flowName',key: 'flowName', },        
            {title: '对象名称',dataIndex: 'objectName',key: 'objectName', },        
            {title: '当前步骤',dataIndex: 'activityName',key: 'activityName', },        
            {title: '发起时间',dataIndex: 'startTime',key: 'startTime', },        
            {title: '处理人',dataIndex: 'handlers',key: 'handlers', },        
            {title: '到达时间',dataIndex: 'createTime',key: 'createTime', }
        ];
        headers.push({
            title: '操作',
            fixed: 'right',
            width: 120,
            key: 'operation',
            render: (text, record) => (
                <span>
                    <VpTooltip placement="top" title="查看">
                        <VpIconFont className="cursor text-primary m-lr-xs" type="vpicon-see-o" />
                    </VpTooltip>
                    {
                    record.taskState != 0?"":
                    <span>
                        <VpTooltip placement="top" title="终止">
                            <VpIconFont onClick={(e)=>this.handleStop(e,record)} className="cursor text-primary m-lr-xs" type="vpicon-stop" />
                        </VpTooltip>
                        {/* <VpTooltip placement="top" title="催办">
                            <VpIconFont onClick={(e)=>this.handleUrge(e,record)} className="cursor text-primary m-lr-xs" type="vpicon-msgs" />
                        </VpTooltip> */}
                    </span>
                    }
                </span>
            )
        })
        this.setState({
            tableHeader: headers
        })
    }

    // 获取表格数据
    getData = () => {                
        vpQuery('/{vpflow}/rest/process/myflow', {
            curr: this.state.curr,
            limit: this.state.limit,
            quickvalue: this.state.quickvalue,
            filtervalue: this.state.filtervalue,
        }).then((response) => {
            let data = response.data           
            let showTotal = () => {
                return '共' + data.count + '条'
            }
            let theight = vp.computedHeight(data.count,'.myflow')
            this.setState({
                tableHeight: theight,
                tableData: data.result,
                curr: data.curr,
                total_rows: data.count,
                limit: data.limit,
                pagination: {
                    total: data.count,
                    showTotal: showTotal,
                    pageSize: data.limit,
                    onShowSizeChange: this.onShowSizeChange,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }
            })
        })
    }
    onShowSizeChange = (value) => {
    }

    handleStop = (e, record) => {
        e.stopPropagation();
        let _this= this
        this.setState({showStopModle: false});
        let param = {pdId:record.pdId, piId:record.piId }
        VpConfirm({
            title: '提示',
            content: '是否确认强行终止流程？',
            onOk(){
                vpQuery('/{vpflow}/rest/process/end-process', {
                    ...param
                }).then((response) => {
                    if(response.data ==='ok'){
                        vpAdd('/{bjyh}/customFlowConf/resetEntityFlag', {
                            ...record
                        }).then(resdata =>{
                            _this.props.closeRightModal && _this.props.closeRightModal(false);
                        })
                    }
                    _this.getData();
                })
            },
            onCancel(){}
        }); 
    }

    handleUrge=(e,record)=>{
        e.stopPropagation();
        let param = {pdId:record.pdId,piId:record.piId}
        vpQuery('/{vpflow}/rest/process/urge-process',{
            ...param
        }).then((response)=>{
            if (response.data == undefined) {
                VpAlertMsg({
                    message: "消息提示",
                    description: response.msg,
                    type: "error",
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                return
            }
            VpAlertMsg({
                message: "消息提示",
                description: '催办成功!',
                type: "success",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            this.getData()
        })
    }

    // 搜索框确定事件
    handlesearch = (value) => {
        const searchVal = value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal
        }, () => {
            this.getData()
        })
    }
    // 表格的变动事件
    tableChange = (pagination, filters, sorter) => {
        let sorttype = ''
        if (sorter.order === 'descend') {
            sorttype = 'desc';
        } else if (sorter.order === 'ascend') {
            sorttype = 'asc';
        }
        this.setState({
            curr: pagination.current || this.state.curr,
            sortfield: sorter.field,
            sorttype,
            limit: pagination.pageSize || this.state.limit,
        }, () => {
            this.getData()
        })
    }


    // 关闭右侧弹出    
    closeRightModal = () => {
        this.setState({
            showRightBox: false,
            increaseData: {}
        })
        this.props.setBreadCrumb2()
    }

    tabsChange = (tabs) => {
        const tab = this.state.tabs_array[tabs];
        let currtabs;
        /*   if () {
              currtabs = require('../../RelEntity/relEntity.jsx').default;
              this.setState({
                  tabs: currtabs
              })
          }  */
    }

    filterChange = (e) => {
        this.setState({
            filtervalue: e.target.value
        }, () => {
            this.getData()
        })
    }
    cancelModal = () => {
        this.setState({
            visible: false
        })
    }
    closeRight = (msg) => {
        this.setState({
            showRightBox: msg,
            staskid: ''
        })
    }
    onRowClick = (record, index) => {
        let piId = record.piId
        vpQuery('/{vpflow}/rest/process/activitytask', {
            piId: piId
        }).then((response) => {
            let staskid = response.data.taskId|| ''
            let formkey = response.data.formkey || ''
            let usermode = response.data.usermode || ''
            let entityid = response.data.entityId || ''
            let iid = response.data.objectId || ''
            let records = response.data.record || {piId:record.piId,pdId:record.pdId,endTime:record.endTime}
            this.setState({
                showRightBox: true,
                //modaltitle: record.sname,
                record: records,
                staskid: staskid,
                iid: iid,
                usermode: usermode == 2 ? false : true,
                entityid: entityid,
                formkey: formkey
            })
            this.props.setBreadCrumb(record.flowName)
        })

    }
    addNewDom = () => {
        let record = this.state.record
        return (
            <Flowtabs
                usermode={this.state.usermode}
                stepkey={record.activityId}
                staskid={this.state.staskid}
                piid={record.piId}
                pdid={record.pdId}
                iobjectentityid={this.state.entityid}
                iobjectid={this.state.iid}
                entityid={record.iflowentityid}
                endTime={record.endTime}
                formkey={this.state.formkey}
                closeRight={msg => this.closeRight(msg)}
                getData={() => this.getData()}
            />
        )

    }

    /**
     * 操作模态框
     */
    handleOk = () => {
        
    }

    render() {
        let _this = this
        return (
            <div className="full-height">
                <VpTable
                    className="myflow"
                    columns={this.state.tableHeader}
                    dataSource={this.state.tableData}
                    onChange={this.tableChange}
                    pagination={this.state.pagination}
                    onRowClick={this.onRowClick}
                    scroll={{y: this.state.tableHeight}}
                    resize
                    // bordered
                />
                <RightBox
                    max={true}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    tips={
                        <div className="tips p-xs">
                            <VpTooltip placement="top" title="0000">
                                <VpIcon type="exclamation-circle text-muted m-r-xs" />
                            </VpTooltip>

                        </div>
                    }
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? this.addNewDom() : null}
                </RightBox>

            </div>
        );
    }
}


export default myflow = VpFormCreate(myflow);