import React, { Component } from 'react'
import { vpAdd, vpDownLoad, VpTable, VpButton, VpIcon, VpTooltip, VpModal, VpRow, VpCol, VpFormCreate } from 'vpreact';
import {
    SeachInput,
    VpDTable
} from 'vpbusiness';

//列表字段
function getHisHeader() {
    var header = [
        {
            title: '变迁名称',
            dataIndex: 'sactionname',
            key: 'sactionname',
            width: '',
            fixed: ''
        },
        {
            title: '当前状态',
            dataIndex: 'pretatusname',
            key: 'pretatusname',
            width: '',
            fixed: ''
        },
        {
            title: '下一状态',
            dataIndex: 'nextstatusname',
            key: 'nextstatusname',
            width: '',
            fixed: ''
        },
        {
            title: '接收时间',
            dataIndex: 'starttime',
            key: 'startTime',
            width: '',
            fixed: ''
        },
        {
            title: '处理时间',
            dataIndex: 'endtime',
            key: 'endTime',
            width: '',
            fixed: ''
        },
        {
            title: '处理人',
            dataIndex: 'username',
            key: 'username',
            width: '',
            fixed: ''
        },
        {
            title: '意见',
            dataIndex: 'sdescription',
            key: 'sdescription',
            width: '200',
            fixed: ''
        }
        
    ];
    return header;
}
//文件列表
function fileHeader() {
    var header = [
        {
            title: '文件名称',
            dataIndex: 'sname',
            key: 'sname',
            width: '',
            fixed: ''
        },
        {
            title: '文件类型',
            dataIndex: 'stype',
            key: 'stype',
            width: '',
            fixed: ''
        },
        {
            title: '文件大小',
            dataIndex: 'isize',
            key: 'isize',
            width: '',
            fixed: ''
        },
        {
            title: '上传用户',
            dataIndex: 'upname',
            key: 'upname',
            width: '',
            fixed: ''
        },
        {
            title: '上传时间',
            dataIndex: 'uptime',
            key: 'uptime',
            width: '',
            fixed: ''
        }
    ];
    return header;
}
class statusChangeHis extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [],
            filter_data: [],
            table_headers: [],
            table_array: [],
            cur_page: 1,
            page: 1,
            pagination: {},
            limit: 10, //每页记录数
            quickvalue: '', //快速搜索内容
            sortfield: '', //排序列key
            sorttype: '', //排序方式
            tabs_array: [],
            entityid: '',
            iid: '',
            visible: false,
            modaltitle: '',
            fileArray: [],
            fileHeader: [],
            filepagination: {},
            record: {},
            bodyheight: ''
        }
        this.handlesearch = this.handlesearch.bind(this);
        this.tableChange = this.tableChange.bind(this);
        this.tabsChange = this.tabsChange.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getData = this.getData.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
    }

    componentWillMount() {
        this.setState({
            entityid: this.props.entityid,//主实体id（可能不是，具体看配置是1:n还是m:n）
            iid: this.props.iid,//主实体iid
        }, () => {
            this.getHeader()
        })

    }
    componentDidMount() {
        // let bodyheight = $(window).height() - 260
        // $('.chgtable').find('.ant-table-body').css({
        //     height: bodyheight
        // })
        // this.setState({
        //     bodyheight: t_height
        // })
    }
    //获取表头数据
    getHeader() {
        let _this = this
        let _header = getHisHeader();
        // _header.push({
        //     title: '操作', fixed: 'right', width: 120, key: 'operation1', render: (text, record) => (
        //         <span>
        //             <VpTooltip placement="top" title="附件下载">
        //                 <VpIcon data-id={record.iid} style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }}
        //                     type="vpicon-download" onClick={() => this.openDownloadWindow(record)} />
        //             </VpTooltip>
        //         </span>
        //     )
        // });
        let _fileheader = fileHeader();
        // _fileheader.push({
        //     title: '操作', fixed: 'right', width: 120, key: 'operation2', render: (text, record) => (
        //         <span>
        //             <VpTooltip placement="top" title="下载">
        //                 <VpIcon data-id={record.iid} style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }}
        //                     type="vpicon-download" onClick={() => this.downloadfile(record)} />
        //             </VpTooltip>
        //         </span>
        //     )
        // });
        _this.setState({
            table_headers: _header,
            // fileHeader: _fileheader
        });
    }

    // 获取表格数据
    getData() {
        const { cur_page, limit, quickvalue } = this.state;
        vpAdd('/{vpplat}/vfrm/entity/getStatusChangeHis', {
            entityid: this.state.entityid,//主实体ID
            iid: this.state.iid,//主实体iid
            currentPage: cur_page,
            numPerPage: limit,
            quickvalue: quickvalue
        }).then((response) => {
            const { data } = response
            let showTotal = () => {
                return '共' + data.page.totalRows + '条'
            }
            this.setState({
                table_array: data.page.resultList,
                cur_page: data.page.currentPage,
                total_rows: data.page.totalRows,
                num_perpage: data.page.numPerPage,
                pagination: {
                    total: data.page.totalRows,
                    showTotal: showTotal,
                    pageSize: data.page.numPerPage,
                    onShowSizeChange: this.onShowSizeChange,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }
            },()=>{
                let t_height = vp.computedHeight(this.state.table_array.length, '.chgtable', 220);
            })
        }).catch((e) => {
            if (!(typeof e == 'function')) {
                console.log('Error:' + e)
            } else {
                e();
            }
        })
    }

    // 搜索框确定事件
    handlesearch(value) {
        const searchVal = $.trim(value);//value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal
        }, () => {
            this.getData()
        })
    }
    // 表格的变动事件
    tableChange(pagination, filters, sorter) {
        let sorttype = ''
        if (sorter.order === 'descend') {
            sorttype = 'desc';
        } else if (sorter.order === 'ascend') {
            sorttype = 'asc';
        }
        this.setState({
            cur_page: pagination.current || this.state.cur_page,
            sortfield: sorter.field,
            sorttype,
            limit: pagination.pageSize || this.state.limit,
        }, () => {
            this.getData()
        })
    }

    onShowSizeChange(value) {
        console.log(value)
    }

    cancelModal() {
        this.setState({
            visible: false
        })
    }

    tabsChange(tabs) {
        console.log(tabs)
    }

    onRowClick(record) {
        console.log(record)
    }
    openDownloadWindow(record) {
        vpAdd('/{vpplat}/vfrm/entity/getStatusChangeFileList', {
            iid: record.iid
        }).then((response) => {
            const { data } = response
            let showTotal = () => {
                return '共' + data.data.length + '条'
            }
            this.setState({
                fileArray: data.data,
                filepagination: {
                    total: data.data.length,
                    showTotal: showTotal,
                    pageSize: 1000,
                    onShowSizeChange: this.onShowSizeChange,
                    showSizeChanger: false,
                    showQuickJumper: false,
                },
                visible: true,
                modaltitle: '附件列表'
            })
        }).catch((e) => {
            console.log('Error:' + e)
        })
    }
    downloadfile(record) {
        vpDownLoad("/{vpplat}/file/downloadfile", {
            fileid: record.iid, entityid: this.state.entityid, instanceid: this.state.iid 
        })
    }
    controlAddButton = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length, '.chgtable')-30
        //设置展开行
        this.setState({
            bodyheight: theight
        },()=>{
            if(resultList.length==0){
                $(".chgtable .ant-table-placeholder").css("maxHeight",theight+"px");
            }
        })
    }
    render() {
        const _this = this;
        return (
            <div className="business-container pr full-height SCH">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                    <VpRow gutter={10}>
                        <VpCol className="gutter-row" span={4}>
                            <SeachInput onSearch={_this.handlesearch} />
                        </VpCol>
                    </VpRow>
                </div>
                <VpDTable
                    ref={table => this.tableRef = table}
                    queryMethod="POST"
                    controlAddButton={
                        (numPerPage, resultList) => {
                            this.controlAddButton(numPerPage, resultList)
                        }
                    }
                    dataUrl={'/{vpplat}/vfrm/entity/getStatusChangeHis'}
                    params={{
                        entityid: this.state.entityid,//主实体ID
                        iid: this.state.iid,//主实体iid
                        quickvalue: this.state.quickvalue
                    }}
                    className="chgtable"
                    bindThis={this}
                    columns={this.state.table_headers}
                    onChange={this.tableChange}
                    onRowClick={this.onRowClick}
                    scroll={{ y: this.state.bodyheight }}
                    resize
                />
                <VpModal
                    title={this.state.modaltitle}
                    visible={this.state.visible}
                    onOk={() => this.cancelModal()}
                    onCancel={() => this.cancelModal()}
                    width={'70%'}
                    footer={
                        <div className="text-center">
                            <VpButton type="primary" onClick={() => this.cancelModal()}>取 消</VpButton>
                        </div>
                    }>
                    <VpTable
                        columns={this.state.fileHeader}
                        dataSource={this.state.fileArray}
                        onRowClick={this.onRowClick}
                        pagination={this.state.filepagination}
                        rowKey={record => record.iid}
                        resize
                        // bordered
                    />
                </VpModal>

            </div>
        );
    }
}


export default statusChangeHis = VpFormCreate(statusChangeHis);