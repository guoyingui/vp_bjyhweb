import React, { Component } from 'react'
import { VpTable, VpAlertMsg, VpIcon, VpIconFont, VpTooltip, VpRow, VpCol, VpFormCreate, VpButton } from 'vpreact';
import { vpQuery, vpAdd } from 'vpreact';
import Flowtabs from '../Flow/FlowHandler';
import FlowBatch from '../Flow/flowbatch';
import { findWidgetByName } from "../Form/Widgets";
import { vpPostAjax2 } from "../utils";
import {
    SeachInput,
    CheckRadio,
    RightBox,
} from 'vpbusiness';


//待处理流程
class processflowplcl extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHeader: [],
            tableData: [],
            curr: 1,
            limit: 10,
            filtervalue: this.props.filtervalue || '',
            quickvalue: '',
            showRightBox: false,
            showFlowBatch: false,
            total_rows: '',
            pagination: {},
            visible: false,
            staskid: '',
            entityid: '',
            iid: '',
            record: {},
            usermode: '',
            tableHeight: '',
            selectedRowKeys: [],
            selectedRows: [],
            loading: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            filtervalue: nextProps.filtervalue,
            quickvalue: nextProps.quickvalue
        }, () => {
            this.getData()
        })
    }
    componentWillMount() {
        this.getHeader()
        this.getData()
    }
    componentDidMount() {
        this.props.batchSelect(this)
    }
    //获取列头
    getHeader = () => {
        let headers = [
            {
                title: '状态', dataIndex: 'taskState', key: 'taskState', width: 50,
                render: (text, record) => (
                    <span>
                        {
                            record.taskState == 0 ?
                                <VpTooltip placement="top" title="未超时">
                                    <VpIcon className="m-r-xs" type="vpicon-clock" />
                                </VpTooltip>
                                :
                                <VpTooltip placement="top" title="已超时">
                                    <VpIcon className="m-r-xs" type="vpicon-handle" />
                                </VpTooltip>
                        }
                    </span>
                )
            },
            {
                title: '流程名称', dataIndex: 'flowName', key: 'flowName',
                sorter: (a, b) => a.flowName.localeCompare(b.flowName)
            },
            {
                title: '流程版本', dataIndex: 'version', key: 'version',
                sorter: (a, b) => a.version.localeCompare(b.version)
            },
            {
                title: '对象名称', dataIndex: 'objectName', key: 'objectName',
                sorter: (a, b) => a.objectName.localeCompare(b.objectName)
            },
            {
                title: '当前步骤', dataIndex: 'taskName', key: 'taskName',
                sorter: (a, b) => a.taskName.localeCompare(b.taskName)
            },
            {
                title: '到达时间', dataIndex: 'createTime', key: 'createTime',
                sorter: (a, b) => a.createTime.localeCompare(b.createTime)
            },
            {
                title: '发起人', dataIndex: 'startUsername', key: 'startUsername',
                sorter: (a, b) => a.startUsername.localeCompare(b.startUsername)
            },
            {
                title: '发起时间', dataIndex: 'startTime', key: 'startTime',
                sorter: (a, b) => a.startTime.localeCompare(b.startTime)
            },
        ];

        headers.push({
            title: '操作',
            fixed: 'right',
            width: 120,
            key: 'operation',
            render: (text, record) => (
                <div className="full-height">
                    <VpTooltip placement="top" title="查看">
                        <VpIconFont onClick={(e) => this.viewTaskClick(e, record)} className="cursor text-primary m-lr-xs" type="vpicon-see-o" />
                    </VpTooltip>
                    {/* {
                        record.assign == null || record.assign == '' ? '' :
                            <VpTooltip placement="top" title="归还">
                                <VpIconFont onClick={(e) => this.returnTaskClick(e, record)} className="cursor text-primary m-lr-xs" type="vpicon-chehui" />
                            </VpTooltip>
                    } */}
                </div>
            )
        })

        this.setState({
            tableHeader: headers
        })
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        let taskids = selectedRows.map(item => item.taskId).join();
        this.setState({
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows,
            taskids
        });
    }

    batchSelect = () => {
        //this.setState({loading:true});
        let _this = this;
        let batch_flag = true
        let batch_value = ''
        if (this.state.selectedRows.length == 0) {
            VpAlertMsg({
                message: "消息提示",
                description: '请选择相关记录!',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            this.setState({ loading: false })
            return
        }
        this.state.selectedRows.map(x => {
            //debugger;
            if (batch_value == '') {
                batch_value = x.pdId + x.stepkey
            }
            if ((x.pdId + x.stepkey) != batch_value) {
                batch_flag = false
            }

        })
        let taskids = this.state.taskids;
        if (batch_flag) {
            let handlers, scondition, newdata, stepkey, handlerId, handlerName, flowInfo;
            // 获取步骤信息
            vpPostAjax2('/{vpflow}/rest/flowbatch/batchform', {
                taskids
            }, 'GET', function (response1) {
                handlers = response1.data.handlers;
                scondition = response1.data.scondition;
                newdata = handlers ? handlers.filter((item) => {
                    return item.flag == scondition || item.condition == null || item.condition == ''
                }) : [];
                stepkey = "";//提交步骤
                newdata = newdata.map(x => {
                    stepkey = x.stepkey;
                })
                //组装流程提交需要的全部参数 
                handlerId = stepkey;
                handlerName = stepkey + "_label";
                flowInfo = {
                    scondition: "SYSZB"
                    , [handlerId]: ""
                    , [handlerName]: ""
                    , syybldspyj: "同意\n签批人：" + vp.cookie.getTkInfo('nickname')
                    , sdescription: "同意"
                }

                /**
                 * 循环需要提交的流程 
                 * 流程提交的主要操作 
                 *  1.保存流程表单信息 
                 *  2.提交流程
                 *  3.流程成功后同步信息到实体  
                 */
                _this.state.selectedRows.map(x => {//循环需要提交的数据   
                    //获取流程信息 
                    vpPostAjax2('/{vpflow}/rest/process/task-info_assess', {
                        taskId: x.taskId, assessid: x.assessid
                    }, 'GET', function (response2) {
                        if (response2.data == undefined) {
                            VpAlertMsg({
                                message: "消息提示",
                                description: response2.msg,
                                type: "error",
                                onClose: this.onClose,
                                closeText: "关闭",
                                showIcon: true
                            }, 5)
                            return
                        }
                        //查询表单信息
                        vpPostAjax2('/{bjyh}/workFlowBatch/getFLowFormExt', {
                            taskID: x.taskId, piId: x.piId, iobjectid: x.iobjectid
                        }, 'GET', function (response3) {
                            if (response3.data.sextends) {
                                let flowInfo_temp = Object.assign(JSON.parse(response3.data.sextends), flowInfo);
                                //设置好默认的处理人
                                vpPostAjax2('/{bjyh}/ZKXmsxFrom/queryPiidByUsers', {
                                    ppid: response2.data.record.piId
                                    , stepKey: 'SYSK'
                                    , tableName: 'WFENT_SXSQLC'
                                }, 'GET', function (response4) {
                                    if (response4.data.length > 0) {
                                        let fzr = ''
                                        let ids = ''
                                        let res = response4.data
                                        for (let i = 0; i < res.length; i++) {
                                            ids += res[i].iid + ','
                                            fzr += res[i].sname + ','
                                        }
                                        ids = ids.substring(0, ids.length - 1)
                                        fzr = fzr.substring(0, fzr.length - 1)
                                        flowInfo_temp[handlerId] = ids
                                        flowInfo_temp[handlerName] = fzr
                                        //保存表单信息
                                        vpPostAjax2('/{vpflow}/rest/flowentity/saveform', {
                                            sparam: JSON.stringify(flowInfo_temp)
                                            , entityid: response2.data.record.iflowentityid
                                            , iobjectentityid: response2.data.entityId
                                            , iobjectid: response2.data.objectId
                                            , piid: response2.data.record.piId
                                            , staskid: response2.data.taskId
                                            , stepkey: ''
                                        }, 'GET', function (response5) {
                                            vpPostAjax2('/{vpflow}/rest/flowbatch/handle-task?', {
                                                taskids: response2.data.taskId,
                                                sparam: JSON.stringify({ formdata: flowInfo_temp })
                                            }, 'GET', function (response6) {
                                                if (response6.data == undefined) {
                                                    VpAlertMsg({
                                                        message: "消息提示",
                                                        description: response6.msg,
                                                        type: "error",
                                                        onClose: this.onClose,
                                                        closeText: "关闭",
                                                        showIcon: true
                                                    }, 5)
                                                    this.setState({ loading: false });
                                                    return
                                                }
                                                //保存成功后，调用“流程表单同步到实体表单”接口
                                                vpPostAjax2('/{bjyh}/ZKsecondSave/synFlowToEntity', {
                                                    sparam: JSON.stringify({ 'formdata': flowInfo_temp })
                                                    , entityid: response2.data.record.iflowentityid
                                                    , iobjectentityid: response2.data.entityId
                                                    , iobjectid: response2.data.objectId
                                                }, 'GET', function (response7) {
                                                    console.log(flowInfo_temp);
                                                });
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    });
                })
            });
            _this.getData();
            return;
        }
        VpAlertMsg({
            message: "消息提示",
            description: '请选择相同版本相同步骤批量提交!',
            type: "error",
            onClose: this.onClose,
            closeText: "关闭",
            showIcon: true
        }, 5)
        this.setState({ loading: false })
    }

    // 获取表格数据
    getData = () => {
        //vpQuery('/{vpflow}/rest/process/processflow', {
        vpQuery('/{vpflow}/rest/process/processflow_sxsq1', {
            curr: this.state.curr,
            limit: this.state.limit,
            quickvalue: this.state.quickvalue,
            filtervalue: this.state.filtervalue,
        }).then((response) => {
            if (response.data == undefined) {
                VpAlertMsg({
                    message: "消息提示",
                    description: response.msg,
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                return
            }
            let data = response.data
            let showTotal = () => {
                return '共' + data.count + '条'
            }
            let theight = vp.computedHeight(data.count, '.processflow')
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
        debugger
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
            showFlowBatch: false,
            increaseData: {}
        }, () => {
            this.getData()
        })
        this.props.setBreadCrumb()
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
            showFlowBatch: msg,
            showRightBox: msg,
            staskid: ''
        })
        this.props.setBreadCrumb2()
    }

    returnTaskClick = (e, record) => {
        e.stopPropagation();
        vpAdd('/{vpflow}/rest/task/return-task', {
            taskId: record.taskId
        }).then((response) => {
            this.getData()
        })
    }
    viewTaskClick = (e, record) => {
        this.onRowClick(record)
    }
    onRowClick = (record) => {
        vpQuery('/{vpflow}/rest/process/task-info_assess', {
            taskId: record.taskId, assessid: record.assessid
        }).then((response) => {
            if (response.data == undefined) {
                VpAlertMsg({
                    message: "消息提示",
                    description: response.msg,
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                return
            }
            let data = response.data
            this.setState({
                showRightBox: true,
                //modaltitle: record.flowName,
                record: data.record,
                staskid: data.taskId,
                iid: data.objectId,
                usermode: data.usermode == 2 ? false : true,
                entityid: data.entityId,
                iid: data.objectId
            })
            this.props.setBreadCrumb(record.flowName)
        })
    }
    addNewDom = () => {
        let record = this.state.record
        return (
            <Flowtabs
                activityName={record.activityName}
                usermode={this.state.usermode}
                stepkey={record.activityId}
                staskid={this.state.staskid}
                piid={record.piId}
                pdid={record.pdId}
                assessid={record.assessid}
                iobjectentityid={this.state.entityid}
                iobjectid={this.state.iid}
                entityid={record.iflowentityid}
                endTime={record.endTime}
                closeRight={msg => this.closeRight(msg)}
                getData={() => this.getData()}
            />
        )

    }

    render() {
        const rowSelection = { onChange: this.onSelectChange };
        let _this = this
        return (
            <div className="full-height">
                <VpRow>
                    <VpCol className="gutter-row text-right">
                        <VpButton type="primary" loading={this.state.loading} style={{ margin: "0 3px" }} onClick={this.batchSelect}>同意</VpButton>
                    </VpCol>
                </VpRow>
                <VpTable
                    className="processflow"
                    rowSelection={rowSelection}
                    rowKey={record => record.taskId + '_' + record.assessid}
                    columns={this.state.tableHeader}
                    dataSource={this.state.tableData}
                    onChange={this.tableChange}
                    pagination={this.state.pagination}
                    onRowClick={this.onRowClick}
                    scroll={{ y: this.state.tableHeight - 40 }}
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
                    show={this.state.showRightBox || this.state.showFlowBatch}>
                    {this.state.showRightBox ? this.addNewDom() : null}
                    {this.state.showFlowBatch ?
                        <FlowBatch
                            taskids={this.state.taskids}
                            closeRight={() => this.closeRightModal()}
                            getData={() => this.getData()}
                        /> : null}
                </RightBox>
            </div>
        );
    }
}


export default processflowplcl = VpFormCreate(processflowplcl);