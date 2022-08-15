import React, { Component } from 'react'
import {
    VpFormCreate,
    VpModal,
    VpTooltip,
    VpIcon,
    VpMsgSuccess,
    VpTabs,
    VpTabPane,
    vpQuery,
    VpAlertMsg
} from 'vpreact';
import { VpDTable, RightBox } from 'vpbusiness';
import DynamicTabs from './EntityDetail';

function headers() {
    return [
        {
            title: 'ID',
            dataIndex: 'iid',
            key: 'iid',
            width: '',
            fixed: ''
        },
        {
            title: '名称',
            dataIndex: 'sname',
            key: 'sname',
            width: '',
            fixed: ''
        }
    ]
}

class detailform extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showDetailRightBox: false,
            entitytype: '',
            eventmap: '',
            entityrole: false,
            detailVisible: false,
            chosenArray: [],
            selectedSkeys: '',
            selectedRowKeys: '',
        }
    }

    componentWillMount() {        
        let entityid = this.props.widgetDetail.irelationentityid
        let widget_type = this.props.widgetDetail.widget_type
        if (widget_type == 'selectmodel' || this.props.chosenList.length == 1) {
            let iid = this.props.chosenList[0].iid
            this.setState({
                showDetailRightBox: true,
                entityid,
                iid,
                detailVisible:false
            });
        } else {
            this.setState({
                chosenArray: this.props.chosenList,
                detailVisible: true,
                showDetailRightBox: false,
                entityid
            })
        }
    }

    closeDetailRightModal = () => {
        this.setState({
            showDetailRightBox: false
        }) 
        this.props.destoryDetailDom()
    }

    cancelModal = () => {
        this.setState({
            detailVisible: false
        })
        this.props.destoryDetailDom()
    }

    okModal = () => {
        let iid = this.state.selectedRowKeys
        if (iid == '') {
            VpAlertMsg({ 
                message:"消息提示",
                description:'请选择需要查看的数据!',
                type:"error",
                onClose:this.onClose,
                closeText:"关闭",
                showIcon: true
            }, 5)
        } else {
            this.setState({
                iid:iid.join(","),
                showDetailRightBox: true,
                detailVisible: false
            },()=>this.props.opensDetailRightBox())
        }
    }

    handleSelect = (record, selected, selectedRows) => {
        let idx = 0;
        let entityid = this.props.widgetDetail.irelationentityid;
        let iid = record.iid
        if (selected) {
            this.setState({
                selectedSkeys: [record.iid],
                showDetailRightBox: true,
                entityid,
                iid,
                detailVisible:false
            })
        }
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    onRowClick = (record, index) => {
        this.setState({
            selectedRowKeys: [record.iid],
            selectedSkeys: [record.iid]
        })
    }

    onDoubleClick = (record, index) => {

    }


    //解决递归render
    /* shouldComponentUpdate(nextProps,nextState){

        return false
    } */


    render() {
        const rowSelection = {
            type: 'radio',
            onSelect: this.handleSelect,
            selectedRowKeys: this.state.selectedSkeys,
            onChange: this.onSelectChange,
        }
        return (
            <div className="full-height">
                    {
                        this.state.showDetailRightBox ?
                            <DynamicTabs
                                type='child'
                                entityid={this.state.entityid}
                                iid={this.state.iid}
                                closeRightModal={() => this.closeDetailRightModal()}
                            />
                            :
                            ''
                    }
                {
                    this.state.detailVisible ?
                        <VpModal
                            title='选择查看对象'
                            visible={this.state.detailVisible}
                            onCancel={() => this.cancelModal()}
                            onOk={() => this.okModal()}
                            width={'70%'}
                            wrapClassName='modal-no-footer'
                        >
                            <VpDTable
                                rowSelection={rowSelection}
                                columns={headers()}
                                dataSource={this.state.chosenArray}
                                onRowClick={this.onRowClick}
                                onDoubleClick={this.onDoubleClick}
                                rowKey={record => record.iid}
                                resize
                                // bordered
                            />
                        </VpModal>
                        : ''
                }

            </div>
        )
    }
}


export default detailform = VpFormCreate(detailform);