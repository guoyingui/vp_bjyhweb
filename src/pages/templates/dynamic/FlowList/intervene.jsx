import React, { Component } from 'react'
import { VpAlertMsg,VpFInput,VpOption,VpSelect,VpFSelect,VpForm,vpAdd, vpQuery, VpModal, VpTable, VpIcon, VpTooltip, VpRow, VpCol, VpFormCreate } from 'vpreact';
import {
    SeachInput,
    CheckRadio,
    RightBox,
    VpDTable
} from 'vpbusiness';
import Choosen from '../Form/ChooseEntity';
import Flowtabs from '../Flow/FlowHandler';

function getHeader() {
    return [
        {
            title: '当前步骤',
            dataIndex: 'activityName',
            key: 'activityName',
            width: 120,
            fixed: ''
        },
        {
            title: '对象名称',
            dataIndex: 'objectName',
            key: 'objectName',
            width: 120,
            fixed: ''
        },
        {
            title: '流程名称',
            dataIndex: 'flowName',
            key: 'flowName',
            width: 120,
            fixed: ''
        },
        {
            title: '到达时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 120,
            fixed: ''
        },
        {
            title: '发起人',
            dataIndex: 'startUserName',
            key: 'startUserName',
            width: 120,
            fixed: ''
        },
        {
            title: '处理人',
            dataIndex: 'handlers',
            key: 'handlers',
            width: 120,
            fixed: ''
        },
        {
            title: '版本',
            dataIndex: 'version',
            key: 'version',
            width: '',
            fixed: ''
        }
    ];
}
function filterDatas() {
    return [
        { name: '全部', value: '' },
        { name: '步骤超时', value: 'overtime' },
        { name: '处理人空', value: 'nohandler' }
    ]
}

//已处理流程
class intervene extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHeader: [],
            filtervalue: '',
            quickvalue: '',
            showRightBox: false,
            visible: false,
            staskid: '',
            entityid: '',
            iid: '',
            record: {},
            usermode: '',
            formkey: '',
            isAdd: false,
            activityName:'',
            steps:[],
            taskId:'',
            userModal:false,
            tableHeight:'',
            jumpman:false
        }

    }

    componentWillReceiveProps(nextProps) {

    }
    componentWillMount() {
        this.getHeader()
    }
    componentDidMount() {
        let theight = vp.computedHeight(this.state.resultList, '.intervene', 220)
        this.setState({
            tableHeight: theight
        })
    }
    //获取列头
    getHeader = () => {
        let headers = getHeader()
        headers.push({
            title: '操作',
            fixed: 'right',
            width: 120,
            key: 'operation',
            render: (text, record) => (
                <span>
                    <VpTooltip placement="top" title="查看">
                        <VpIcon style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }} type="edit" />
                    </VpTooltip>
                    <VpTooltip placement="top" title="终止">
                        <VpIcon onClick={(e) => this.rowOptions(e, 'end',record)} style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }} type="minus-circle-o" />
                    </VpTooltip>
                    <VpTooltip placement="top" title="更改处理人">
                        <VpIcon onClick={(e) => this.rowOptions(e, 'changeChar',record)} style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }} type="user" />
                    </VpTooltip>
                    <VpTooltip placement="top" title="自由跳转">
                        <VpIcon onClick={(e) => this.rowOptions(e, 'jump',record)} style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }} type="tag-o" />
                    </VpTooltip>
                </span>
            )
        })
        this.setState({
            tableHeader: headers
        })
    }

    //查询流程所有步骤
    queryActStep=(flowkey)=>{
        vpQuery('/{vpflow}/rest/workflow/tasks',{
            key:flowkey
        }).then((response)=>{
            this.setState({
                steps:response.data
            })
        })
    }

    //行操作事件
    rowOptions = (e, flag,record) => {
        if ('end' == flag) {
            e.stopPropagation();
            vpQuery('/{vpflow}/rest/process/end-process',{
                pdId:record.pdId,
                piId:record.piId
            }).then((response)=>{
                VpAlertMsg({
                    message: "消息提示",
                    description: '流程已终止！',
                    type: "success",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                this.tableRef.getTableData()
            })
        } else if ('changeChar' == flag) {
            e.stopPropagation();
            this.setState({
                userModal:true,
                taskId:record.taskId
            })
        } else if ('jump' == flag) {
            e.stopPropagation();
            this.setState({
                visible:true,
                activityName:record.activityName,
                taskId:record.taskId
            },this.queryActStep(record.flowkey))
        }
    }
    // 搜索框确定事件
    handlesearch = (value) => {
        const searchVal = value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal
        })
    }

    // 关闭右侧弹出    
    closeRightModal = () => {
        this.setState({
            showRightBox: false,
            increaseData: {}
        })
    }

    cancelUserModal = () => {
        this.setState({
            userModal: false
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
            let staskid = response.data.taskId || ''
            let formkey = response.data.formkey || ''
            let usermode = response.data.usermode || ''
            let entityid = response.data.entityId || ''
            let iid = response.data.objectId || ''
            let records = response.data.record || { piId: record.piId, pdId: record.pdId, endTime: record.endTime }
            this.setState({
                showRightBox: true,
                modaltitle: record.sname,
                record: records,
                staskid: staskid,
                iid: iid,
                usermode: usermode == 2 ? false : true,
                entityid: entityid,
                formkey: formkey
            })

        })

    }
    controlAddButton = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length,'.intervene',220)
        this.setState({
            tableHeight: theight,
            resultList: resultList.length
        })

    }
    filterChange = (e) => {
        this.setState({
            filtervalue: e.target.value
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
    okJumpModal=()=>{
        const _this = this
        let ids = $('#jumpman').attr('idlist')
        this.props.form.validateFields((errors, values) => {
            if(values.jumpStepkey==undefined){
                VpAlertMsg({
                    message: "消息提示",
                    description: '请选择需要跳转的步骤！',
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            }
            else if(ids == undefined || ids == ''){
                VpAlertMsg({
                    message: "消息提示",
                    description: '请选择处理人！',
                    type: "error",
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            }
            else{
                vpAdd('/{vpflow}/rest/intervene/jump',{
                    jumpStepkey:values.jumpStepkey,
                    taskId:this.state.taskId,
                    userids:ids
                }).then((response)=>{
                    this.cancelModal()
                    this.tableRef.getTableData()
                    VpAlertMsg({
                        message: "消息提示",
                        description: '更改步骤成功！',
                        type: "success",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5)
                })
            }
        })
    }
    okUserModal=(selectItem)=>{
        if(selectItem.length>0){
            vpQuery('/{vpflow}/rest/task/transfer-task',{
                taskId:this.state.taskId,
                userid:selectItem[0].iid
            }).then((response)=>{
                VpAlertMsg({
                    message: "消息提示",
                    description: '更改处理人成功！',
                    type: "success",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                this.cancelUserModal()
                this.tableRef.getTableData()
            })
        }else{
            VpAlertMsg({
                message: "消息提示",
                description: '请选择处理人！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
        }
    }
    showChoosenModal = () => {
        this.setState({
            jumpman:true
        })
    }

    cancelJumpChoosen=()=>{
        this.setState({
            jumpman:false
        })
    }

    submitJumpChoosen=(list)=>{
        let idlist = []
        let snamelist = []
        list.map((item,index)=>{
            idlist.push(item.iid);
            snamelist.push(item.sname);
        })
        this.setState({
            jumpman:false
        },()=>{
            $("#jumpman").val(snamelist.join());
            $("#jumpman").attr('idlist',idlist.join());
        })
    }
    render() {
        let _this = this
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        const {getFieldProps } = _this.props.form;
        return (
            <div className="editlist full-height overflow">
                <div className="b-b bg-white p-b-sm">
                    <VpRow gutter={10}>
                        <VpCol className="gutter-row" span={4}>
                            <SeachInput onSearch={_this.handlesearch} />
                        </VpCol>
                        <VpCol className="gutter-row check-radio" span={12}>
                            <CheckRadio
                                filterData={filterDatas()}
                                defaultValue={this.state.filtervalue}
                                onChange={this.filterChange}
                            />
                        </VpCol>
                    </VpRow>
                </div>
                <div className="p-t-sm full-height scroll-y" style={{paddingBottom: 40}}>
                    <VpDTable
                        ref={table => this.tableRef = table}
                        params={{
                            quickvalue: this.state.quickvalue,
                            filtervalue:this.state.filtervalue
                        }
                        }
                        controlAddButton={
                            (numPerPage, resultList) => {
                                this.controlAddButton(numPerPage, resultList)
                            }
                        }
                        dataUrl={'/{vpflow}/rest/intervene/page2'}
                        columns={this.state.tableHeader}
                        onRowClick={this.onRowClick}
                        bindThis={this}
                        className="intervene"
                        scroll={{ y: this.state.tableHeight}}
                        resize
                        // bordered
                    />
                </div>
                <RightBox
                    max={this.state.isAdd}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? this.addNewDom() : null}
                </RightBox>
                <VpModal
                    title='自由跳转'
                    visible={this.state.visible}
                    onOk={() => this.okJumpModal()}
                    onCancel={() => this.cancelModal()}
                    width={'40%'}
                    height={'60%'}
                    wrapClassName='modal-no-footer'
                >
                    {
                        this.state.visible ?
                            <VpForm style={{ marginTop: 20 }}>
                                <VpFInput readOnly  {...formItemLayout} label="当前步骤" type="text"
                                    {...getFieldProps('currentStep', {
                                        initialValue: this.state.activityName
                                    })} />
                                <VpFSelect
                                    label="跳转步骤"
                                    {...formItemLayout}
                                    >
                                    <VpSelect defaultValue=''  {...getFieldProps('jumpStepkey')} style={{ width: '100%' }}>
                                        {   
                                            this.state.steps.map((item,index)=>{
                                                return <VpOption key={index} value={item.id}>{item.name}</VpOption>
                                            })
                                        }
                                    </VpSelect>
                                </VpFSelect>
                                <VpFInput
                                    label="处理人"
                                    className="cursor"
                                    {...formItemLayout}
                                    {...getFieldProps('jumpman')}
                                    onClick={() => { this.showChoosenModal() }}
                                    readOnly={true}
                                    //{...check_form_label}
                                    // value={inputValue}
                                    suffix={
                                        <VpIcon type='search' style={{ marginTop: 7 }} />
                                    }
                                />
                            </VpForm>
                            :
                            ''
                    }
                </VpModal>
                <VpModal
                    title='更改处理人'
                    visible={this.state.userModal}
                    onCancel={() => this.cancelUserModal()}
                    width={'70%'}
                    wrapClassName='modal-no-footer'
                    footer={null}
                >
                   {
                            this.state.userModal ?
                                <Choosen
                                    item={{irelationentityid: '2',widget_type:'selectmodel'}}
                                    initValue={[]}
                                    params={{}}
                                    onCancel={() => _this.cancelUserModal()}
                                    onOk={(selectItem) => _this.okUserModal(selectItem)}
                                />
                                :
                                null
                        }
                </VpModal>
                <VpModal
                    title='选择处理人'
                    visible={this.state.jumpman}
                    width={'70%'}
                    footer={null}
                    wrapClassName='modal-no-footer'
                    onCancel={() => this.cancelJumpChoosen()}
                >
                    {
                        this.state.jumpman ?
                            <Choosen
                                item={{ irelationentityid: '2', widget_type: 'selectmodel' }}
                                initValue={[]}
                                onCancel={() => this.cancelJumpChoosen()}
                                onOk={(selectItem) => this.submitJumpChoosen(selectItem)}
                            />
                            : ''
                    }
                </VpModal>
            </div>
        );
    }
}


export default intervene = VpFormCreate(intervene);