import React, { Component } from 'react'
import {
    vpAdd, vpQuery, VpRow, VpCol,
    VpButton, VpPopconfirm, VpFormCreate,
    VpTable, VpTooltip, VpModal, VpAlertMsg
} from 'vpreact';
import Choosen from '../Form/ChooseEntity';

function userHeader() {
    return [
        // {
        //     title: 'id',
        //     dataIndex: 'iid',
        //     key: 'iid',
        //     width: '',
        //     fixed: ''
        // },
        {
            title: '用户名称',
            dataIndex: 'sname',
            key: 'sname',
            width: '',
            fixed: ''
        },
        {
            title: '用户编码',
            dataIndex: 'scode',
            key: 'scode',
            width: '',
            fixed: ''
        }, {
            title: '用户登录名',
            dataIndex: 'sloginname',
            key: 'sloginname',
            width: '',
            fixed: ''
        }
    ];
}
class userList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedUserRows: [],
            selectedRowKeys: [],
            selected: '',
            choseUser: false,
            tableHeight:''
        }

    }

    componentWillMount() {

    }

    componentDidMount() {
        let bodyheight = $(window).height() - 260
        $('.users').find('.ant-table-body').css({
            height: bodyheight
        })
        this.setState({
            bodyheight: bodyheight
        })
    }
    cancelModal = () => {
        this.setState({
            choseUser: false
        }, () => {
            $('.users').find('.ant-table-body').height(this.state.bodyheight)
        })
    }
    handleAddUser = () => {
        this.setState({
            choseUser: true
        })
    }
    handleUserDelete = () => {
        let arr = this.state.selectedUserRows
        let newArr = []
        arr.map((item, index) => {
            newArr.push(item.iid)
        })
        if (newArr.length > 0) {
            vpAdd('/{vpflow}/rest/flowgroup/user/delete', {
                userids: newArr.join(),
                groupId: this.props.groupId
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

                this.setState({
                    selected: [],
                    selectedRowKeys: []
                }, () => {
                    this.tableRefs.getTableData()
                })
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
    controlAddButton = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length,'.users')
        if(resultList.length){
            theight = theight -70
        }else{
            theight = theight -100
        }
        this.setState({
            tableHeight: theight
        })

    }
    okUserModal = (selecteItem) => {
        let newArr = []
        selecteItem.map((item, index) => {
            newArr.push(item.iid)
        })
        if (newArr.length > 0) {
            vpAdd('/{vpflow}/rest/flowgroup/user/save', {
                userids: newArr.join(),
                groupId: this.props.groupId
            }).then((response) => {
                this.setState({
                    selectedUserRows: [],
                    selectedRowKeys: []
                }, () => {
                    this.cancelModal()
                })
            })
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: '请选择需要添加的用户！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
        }

    }
    render() {
        const _this = this
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                _this.setState({
                    selectedUserRows: selectedRows,
                    selectedRowKeys: selectedRowKeys
                })
            },
            onSelect(record, selected, selectedRows) {
            },
            onSelectAll(selected, selectedRows, changeRows) {
                _this.setState({
                    selected: selected
                })
            },
        };
        return (
            <div className="business-container pr full-height">
                {
                    <div className="subAssembly b-b bg-white" style={this.props.style}>
                        <VpRow gutter={1}>
                            <VpCol className="gutter-row text-right" span={30}>
                                <VpTooltip placement="top" title="新建">
                                    <VpButton type="primary" style={{ margin: "0 3px" }} shape="circle" icon="plus" onClick={(e) => this.handleAddUser()}></VpButton>
                                </VpTooltip>

                                <VpTooltip placement="top" title="删除">
                                    <VpButton onClick={(e) => this.handleUserDelete()} type="ghost" style={{ margin: "0 3px" }} shape="circle" icon="cross" ></VpButton>
                                </VpTooltip>
                            </VpCol>
                        </VpRow>
                    </div>
                }
                <div className="business-wrapper p-t-sm full-height">
                    <div className="p-sm bg-white" >
                        {
                            this.state.choseUser ?
                                null
                                :
                                <VpTable
                                    rowKey={record => record.iid}
                                    rowSelection={rowSelection}
                                    ref={table => this.tableRefs = table}
                                    params={{
                                        groupId: this.props.groupId
                                    }
                                    }
                                    controlAddButton={
                                        (numPerPage, resultList) => {
                                            this.controlAddButton(numPerPage, resultList)
                                        }
                                    }
                                    dataUrl={'/{vpflow}/rest/flowgroup/user/page2'}
                                    columns={userHeader()}
                                    bindThis={this}
                                    className="users"
                                    scroll={{ y: this.state.tableHeight }}
                                // bordered
                                />
                        }

                    </div>
                </div>
                <VpModal
                    title='选择用户'
                    visible={this.state.choseUser}
                    onCancel={() => this.cancelModal()}
                    width={'70%'}
                    wrapClassName='modal-no-footer'
                    footer={null}
                >
                    {
                        this.state.choseUser ?
                            <Choosen
                                item={{ irelationentityid: '2' }}
                                initValue={[]}
                                params={{}}
                                onCancel={() => _this.cancelModal()}
                                onOk={(selectItem) => _this.okUserModal(selectItem)}
                            />
                            :
                            null
                    }
                </VpModal>


            </div>
        );
    }
}


export default userList = VpFormCreate(userList);