import React, { Component } from 'react'
import {VpAlertMsg,VpTable,vpAdd,VpFormCreate,VpIcon, VpRow,VpCol,VpTooltip,VpButton,VpTabs,VpTabPane,VpForm,VpFInput   } from 'vpreact';
import { SeachInput, RightBox,} from 'vpbusiness';
import UserList from './userList'
class flowgrant extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHeight:'',
            quickvalue: '',
            tableHeader: [],
            selectedRows: [],
            selectedRowKeys: [],
            showRightBox: false,
            flowgroup:{},
            showRightBoxTab: false
        }

    }

    componentDidMount() {
        $('.ant-table-body').height($(window).height() - 200)
        //$(".flowgroup").find(".ant-table-body").height($(window).height() - 180)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            quickvalue:nextProps.quickvalue
        },()=>{
            this.tableRef.getTableData()
        })
    }

    componentWillMount() {
        const columns = [
            { title: '组名', dataIndex: 'sname', key: 'sname', width: '', fixed: '' },
            { title: '描述', dataIndex: 'sdescription', key: 'sdescription', width: '', fixed: '' },
            {
                title: '操作',
                fixed: 'right',
                width: 120,
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <VpIcon title="查看" style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }} type="edit" />
                        <VpIcon  title="删除" onClick={(e) => this.handleDelete(e, record)} className="cursor m-lr-xs" type="vpicon-close" />
                    </span>
                )
            },
        ]
        this.setState({
            tableHeader: columns
        })
    }
   
    // 搜索框确定事件
    handlesearch = (value) => {
        const searchVal = value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal
        })
    }

    // 关闭右侧弹出    
    closeRightBox = () => {
        this.setState({showRightBox: false,})
    }

    showRightBox =() => {
        this.setState({showRightBox: true,showRightBoxTab:false,flowgroup:{}})
    }

    delSelectClick = () =>{
        let arr = this.state.selectedRows;
        // let newArr = []
        // arr.map((item, index) => {
        //     newArr.push(item.iid)
        // })
        if (arr.length > 0) {
            vpAdd('/{vpflow}/rest/flowgroup/delete', {
                // ids: newArr.join()
                ids: arr.map(item => item.iid).join()
            }).then((response) => {
                if(response.data==undefined){
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
                this.tableRef.getTableData();
                
            })
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: '请选择需要删除的数据！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
        }
    }

    handleDelete = (e, record) => {
        e.stopPropagation();
        vpAdd('/{vpflow}/rest/flowgroup/delete', {
            ids: record.iid
        }).then((response) => {
            if(response.data==undefined){
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
            this.tableRef.getTableData()
        })
    }

    onRowClick = (record, index) => {
        this.setState({flowgroup:record,showRightBoxTab:true,showRightBox:true})
    }

    // onSelectChange = (selectedRowKeys) => {
    //     console.log('selectedRowKeys changed: ', selectedRowKeys);
    //     this.setState({ selectedRowKeys });
    // }

    controlAddButton = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length,'.flowGroup')
        if(resultList.length){
            theight = theight +200
        }
        this.setState({
            tableHeight: theight
        })

    }

    onSelectChange = (selectedRowKeys,selectedRows) => {
        console.log(selectedRows);
        this.setState({
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows
        });
    }

    render() {
        let _this = this;
        const rowSelection = { onChange: this.onSelectChange };
        return (
            <div className="business-container pr full-height">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                    <VpRow gutter={10}>
                        <VpCol className="gutter-row" span={4}>
                            <SeachInput onSearch={this.handlesearch} />
                        </VpCol>
                        <VpCol className="gutter-row text-right" span={20}>
                            <VpTooltip placement="top" title="新建">
                                <VpButton type="primary" style={{ margin: "0 3px" }} shape="circle" icon="plus" onClick={this.showRightBox}></VpButton>
                            </VpTooltip>

                            <VpTooltip placement="top" title="删除">
                                <VpButton type="ghost" style={{ margin: "0 3px" }} shape="circle" icon="cross" onClick={this.delSelectClick}></VpButton>
                            </VpTooltip>
                        </VpCol>
                    </VpRow>
                </div>
                <div className="business-wrapper p-t-sm full-height overflow">
                    <div className="p-sm bg-white full-height scroll-y" >
                        <VpTable
                            className="flowGroup"
                            controlAddButton={
                                (numPerPage, resultList) => {
                                    this.controlAddButton(numPerPage, resultList)
                                }
                            }
                            rowSelection={rowSelection}
                            ref={table => this.tableRef = table}
                            dataUrl={'/{vpflow}/rest/flowgroup/page2'}
                            params={{quickvalue: this.state.quickvalue,}}
                            columns={this.state.tableHeader}
                            onRowClick={this.onRowClick}
                            bindThis={this}
                            rowKey={record => record.iid}
                            resize
                            scroll={{ y: this.state.tableHeight }}
                            // bordered
                        />
                    </div>
                </div>
                <RightBox
                    button={
                        <div className="icon p-xs" onClick={this.closeRightBox}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    // tips={
                    //     <div className="tips p-xs">
                    //         <VpTooltip placement="top" title="0000">
                    //             <VpIcon type="exclamation-circle text-muted m-r-xs" />
                    //         </VpTooltip>
                    //     </div>
                    // }
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? 
                            <UserModel tableRef={this.tableRef} flowgroup = {this.state.flowgroup} showRightBoxTab={this.state.showRightBoxTab}
                            closeRightBox={() => this.closeRightBox()} 
                            handleSave={()=>this.handleSave()}/> : null}
                </RightBox>
            </div>
        )
    }
}

class UserModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iid: this.props.flowgroup.iid,
            sname: this.props.flowgroup.sname,
            sdescription: this.props.flowgroup.sdescription,
            showRightBoxTab: this.props.showRightBoxTab
        }

    }

    handleSave =()=>{
        this.props.form.validateFields((errors, values) => {
            if (errors == null) {
                if(values.sname.replace(/\s+/g, "")==''){
                    VpAlertMsg({
                        message: "消息提示",
                        description: "组名不能为空！",
                        type: "error",
                        closeText: "关闭",
                        showIcon: true
                    }, 5)
                    return
                }
                if(values.sdescription==null||values.sdescription==undefined){
                    values.sdescription = ''
                }
                vpAdd('/{vpflow}/rest/flowgroup/save', {
                    ...values,iid:this.state.iid
                }).then((response) => {
                    this.props.tableRef.getTableData()
                    this.props.closeRightBox();
                })
            }
        })
    }

    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <div className="full-height">
                <VpTabs defaultActiveKey="0" onChange={this.tabsChange} >
                    <VpTabPane tab='属性' key='0'>
                        <VpForm style={{ paddingTop: 50 }}>
                            <VpFInput  {...formItemLayout} label="组名" type="text"
                                {...getFieldProps('sname', {
                                    initialValue: this.state.sname,
                                    rules: [
                                        {
                                            required: true,
                                            message: '组名不能为空!'
                                        },
                                    ],
                                })} />
                            <VpFInput  {...formItemLayout} label="描述" type="textarea"
                                {...getFieldProps('sdescription',{
                                    initialValue: this.state.sdescription,
                                })} />
                            <div className="footer-button-wrap ant-modal-footer" style={{ bottom: '10px', zIndex: 10 }}>
                                <VpButton  className="m-r-xs" type="primary" onClick={this.handleSave}>保存</VpButton>
                                <VpButton  className="m-r-xs" onClick={this.props.closeRightBox} >取消</VpButton>
                            </div>
                        </VpForm>
                    </VpTabPane>
                    {this.state.showRightBoxTab? 
                    <VpTabPane tab='用户列表' key={1} >
                        <UserList groupId={this.state.iid}/>
                    </VpTabPane>:
                    <VpTabPane tab='用户列表' key={1} disabled>
                    </VpTabPane>}
                </VpTabs>
            </div>
        )
    }
}

UserModel = VpFormCreate(UserModel);

export default flowgrant = VpFormCreate(flowgrant);