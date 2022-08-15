import React, { Component } from 'react'
import {
    vpAdd,
    VpAlertMsg,
    VpTable,
    VpIcon,
    VpTooltip,
    VpRow,
    VpCol,
    VpFormCreate,
    VpTabs,
    VpTabPane
} from 'vpreact';
import {
    SeachInput,
    RightBox,
} from 'vpbusiness';
import { VpDynamicForm } from 'vpbusiness';
import { formatDateTime } from 'utils/utils';

//分配资源
class disResource extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHeader: [],
            quickvalue: '',
            showRightBox: false,
            entityid: '',
            iid: '',
            max: false,
            resiid: '',
            increaseData: {},
        }

    }

    componentWillReceiveProps(nextProps) {

    }
    componentWillMount() {
        let entityid = this.props.viewtype == 'pjtree' ? this.props.row_entityid : this.props.entityid
        let iid = this.props.viewtype == 'pjtree' ? this.props.row_id : this.props.iid
        this.setState({
            entityid, iid
        })
    }
    componentDidMount() {
        $(".ant-table-body").height($(window).height() - 220)
    }
    onRowClick = (record, index) => {
        this.setState({
            showRightBox: true,
            resiid: record.iid
        }, () => {
            this.queryFormData(record.iid);
        })
    }
    closeRightModal = () => {
        this.setState({
            showRightBox: false
        })
    }
    // 搜索框确定事件
    handlesearch = (value) => {
        const searchVal = value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal
        }, () => {
            this.tableRef.getTableData()
        })
    }
    //查询资源表单
    queryFormData = (iid) => {
        const _this = this
        vpAdd('/{bjyh}/objpjres/getResForm', {
            iid: iid
        }).then(function (data) {
            if (data) {
                if (data.hasOwnProperty('data')) {
                    if (data.data.hasOwnProperty('form')) {
                        if (data.data.form.hasOwnProperty('groups')) {
                            _this.setState({
                                increaseData: data.data.form
                            })
                        }
                    }
                }
            }
        }).catch(function (err) {
        });
    }

    //提交资源表单
    saveRowData = (value, statusid) => {
        const _this = this
        let vae = {}
        Object.keys(value).forEach((key, i) => {
            if (value[key] == undefined) {
                value[key] = ''
            } else if (value[key] == null) {
                value[key] = 0
            } else if (value[key] instanceof Array && value[key][0] instanceof Date) {
                value[key] = value[key].map(item => formatDateTime(item))
            }
            if (key.indexOf('_label') == -1) {
                vae[key] = value[key]
            }
        })
        let param = {
            formdata: vae,
            iid: this.state.resiid
        }
        vpAdd('/{bjyh}/objpjres/save', {
            sparam: JSON.stringify(param)
        }).then((response) => {
            VpAlertMsg({
                message: "消息提示",
                description: '修改成功！',
                type: "success",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            _this.setState({
                showRightBox: false
            }, () => {
                _this.tableRef.getTableData()
            })
            _this.synTFS();
        })
    }

    synTFS = () => {
        //同步TFS
        vpAdd('/{bjyh}/tfsrest/tfsxmsq', {
            iid: this.props.iid
        }).then((response) => {
                if (response == '0') {
                    VpAlertMsg({
                        message:"消息提示",
                        description:"TFS项目同步成功。",
                        type:"success",
                        closeText:"关闭",
                        showIcon: true
                    }, 5)
                }else{
                    VpAlertMsg({
                        message: "消息提示",
                        description: "TFS项目同步失败。",
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                }
                //_this.loadFormData();
        }).catch(function (err) {
            VpAlertMsg({
                message: "消息提示",
                description: "TFS项目同步失败。",
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5);
        });
    }

    render() {
        let _this = this
        const columns = [
            { title: '资源名称', dataIndex: 'iuserid' },
            { title: '投入工时（人天）', dataIndex: 'iworkload' },
            { title: '预测开始', dataIndex: 'dforecaststartdate' },
            { title: '预测结束', dataIndex: 'dforecastenddate' },
            //{ title: '计划开始', dataIndex: 'dplanstartdate' },
            //{ title: '计划结束', dataIndex: 'dplanenddate' },
            { title: '实际开始', dataIndex: 'dactualstartdate' },
            { title: '实际结束', dataIndex: 'dactualenddate' },
            { title: '是否有效', dataIndex: 'sfsx' },
            { title: '涉及系统', dataIndex: 'sjxt' },
            { title: '备注', dataIndex: 'sremark' }

        ];
        return (
            <div className="business-container pr full-height">
                <div className="subAssembly b-b bg-white" style={_this.props.style}>
                    <VpRow gutter={10}>
                        <VpCol className="gutter-row" span={4}>
                            <SeachInput onSearch={_this.handlesearch} />
                        </VpCol>
                    </VpRow>
                </div>
                <div className="business-wrapper p-t-sm full-height">
                    <VpTable
                        ref={dom => _this.tableRef = dom}
                        params={{
                            iid: _this.state.iid,
                            ientityid: _this.state.entityid,
                            quickvalue: this.state.quickvalue,
                            numPerPage: 10000
                        }}
                        columns={columns}
                        dataUrl={'/{bjyh}/objpjres/page'}
                        onRowClick={_this.onRowClick}
                        pagination={false}
                        scroll={{ x: 1500, y: $(".ant-table-body").height($(window).height() - 220) }}
                        resize
                    // bordered
                    />
                </div>
                <RightBox
                    max={this.state.max}
                    button={
                        <div className="icon p-xs" onClick={_this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={_this.state.showRightBox}
                >
                    <VpTabs>
                        <VpTabPane tab={'资源管理'} key='1'>
                            {
                                this.state.showRightBox ?
                                    <VpDynamicForm
                                        className="full-height scroll p-b-xxlg"
                                        formData={this.state.increaseData}
                                        iid={this.props.iid}
                                        handleOk={this.props.entityrole ? this.saveRowData : ''}
                                        handleCancel={_this.closeRightModal}
                                        okText="保 存" />
                                    : ''
                            }
                        </VpTabPane>
                    </VpTabs>
                </RightBox>
            </div>
        );
    }
}


export default disResource = VpFormCreate(disResource);