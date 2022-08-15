import React, { Component } from 'react';
import {
    VpRow,
    VpCol,
    VpButton,
    VpTable,
    VpTag,
    vpQuery
} from 'vpreact';
import logopic from 'vpstatic/images/logosm.jpg';
import {
    SeachInput
} from 'vpbusiness';

import './ChooseEntity.less';

function build(menuList) {
    let temp = {};
    let ans = {};
    let newList = [];
    for (let i in menuList) {
        temp[menuList[i].taskId] = menuList[i];
    }
    for (let i in temp) {
        if (temp[i].pid && temp[i].pid != '0') {
            if (!temp[temp[i].pid].children) {
                temp[temp[i].pid].children = new Array();
            }
            temp[temp[i].pid].children.push(temp[i]);
        } else {
            ans[temp[i].taskId] = temp[i];
        }
    }
    for (let i in ans) {
        newList.push(ans[i])
    }
    return newList;
}

class ChooseEntity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            table_headers: [],
            selectItem: [],
            table_array: [],
            selectedRowKeys: ['1'],
            selectItem: [],
            currentPage: 1,
            page: 1,
            pagination: {},
            pageSize: 10, //每页记录数
            quickvalue: '',
            idepartmentid: '',
            item: {modalProps:{},...this.props.item},
            params: this.props.params || {}
        }
        this.onRowClick = this.onRowClick.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.tableChange = this.tableChange.bind(this);
        this.onShowSizeChange = this.onShowSizeChange.bind(this);
        this.getListData = this.getListData.bind(this);
        this.handlesearch = this.handlesearch.bind(this);
        this.onRowClicks = this.onRowClicks.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            let initValue = nextProps.initValue||[];
            let selectsValues = initValue[0]!=undefined?initValue[0].taskId==""?[]:initValue:[]
            this.setState({
                params: nextProps.params,
                selectItem: selectsValues,
                selectedRowKeys: selectsValues.map((item, i) => {
                    return item.taskId
                })
            }, () => {
                this.getListData()
            })
        }
    }
    componentWillMount() {
        let initValue = this.props.initValue||[]
        let selectsValues = initValue[0]!=undefined?initValue[0].taskId==""||!initValue[0].sname?[]:initValue:[]
        this.setState({
            item: {modalProps:{},...this.props.item},
            selectItem: selectsValues,
            selectedRowKeys: selectsValues.map((item, i) => {
                return item.taskId
            })
        }, () => {
            this.getListData()
        })
    }

    componentDidMount(){
        $('.search').find('input').attr('maxlength',400)
    }

    getListData() {
        const _this = this;
        const { currentPage, pageSize, item } = _this.state;
        //console.log("item",item)
        const params = _this.state.params || {};
        let ientityid = item.ientityid
            vpQuery(window.vp.config.jgjk.ylxz.addtaskList, {
                currentPage:currentPage,numPerPage:pageSize,quickSearch:this.state.quickvalue
            }).then((datas) => {
                let data = datas.data;
                let showTotal = () => {
                    return '共' + data.totalRows + '条'
                }
                _this.setState({
                    table_array: build(data.resultList),
                    currentPage: data.currentPage,
                    total_rows: data.totalRows,
                    pageSize: data.numPerPage,
                    pagination: {
                        total: data.totalRows,
                        showTotal: showTotal,
                        pageSize: data.numPerPage,
                        onShowSizeChange: _this.onShowSizeChange,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }
                })
            })
    }


    // 搜索框确定事件
    handlesearch(value) {
        const searchVal = $.trim(value);//value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal,
            currentPage:1
        }, () => {
            this.getListData()
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
            currentPage: pagination.current || this.state.currentPage,
            sortfield: sorter.field,
            sorttype,
            pageSize: pagination.pageSize || this.state.pageSize,
        }, () => {
            this.getListData()
        })
    }

    onShowSizeChange(value) {
        //console.log(value)
    }

    onRowClick(record, index) {
        this.setState({
            idepartmentid: record.taskId,
            currentPage:1
        }, () => {
            this.getListData()
        })
    }
    onExpandedRowsChange(expandedRows) {
        //console.log(expandedRows)
    }
    onExpand(expanded, record) {
        //console.log(expanded, record)
    }
    onClose(item, i) {
        let newList = [...this.state.selectItem.slice(0, i), ...this.state.selectItem.slice(i + 1)];
        this.setState({
            selectItem: newList,
            selectedRowKeys: newList.map((item, i) => {
                return item.taskId
            })
        })
    }


    handleUserSelect = (record, selected, selectedRows) => {
       let idx = 0;
               if (this.props.item.widget_type == 'selectmodel') {
                   if (selected) {
                       this.setState({
                           selectItem: [record]
                       })
                   }
               } else {
                   if (selected) {
                       this.setState({
                           selectItem: [...this.state.selectItem, record]
                       })
                   } else {
                       this.state.selectItem.forEach((element, i) => {
                           if (element.taskId === record.taskId) {
                               idx = i
                           }
                       });
                       this.setState({
                           selectItem: [...this.state.selectItem.slice(0, idx), ...this.state.selectItem.slice(idx + 1)]
                       })
                   }
               }
    }

    //点击当前行选中
    onRowClicks(record, index) {
        const selectedIdx = this.state.selectItem.findIndex((item) => record.taskId === item.taskId)
        if (selectedIdx != -1) {
            this.setState({
                selectItem: [
                    ...this.state.selectItem.slice(0, selectedIdx),
                    ...this.state.selectItem.slice(selectedIdx + 1)
                ],
                selectedRowKeys: [
                    ...this.state.selectedRowKeys.slice(0, selectedIdx),
                    ...this.state.selectedRowKeys.slice(selectedIdx + 1)
                ]

            })
        } else {
            if (this.props.item.widget_type == 'selectmodel') {
                this.setState({
                    selectedRowKeys: [record.taskId],
                    selectItem: [record]
                })
            } else {
                this.setState({
                    selectItem: [
                        ...this.state.selectItem.slice(0),
                        record
                    ],
                    selectedRowKeys: [
                        ...this.state.selectedRowKeys.slice(0),
                        record.taskId
                    ],
                })
            }
        }
    }

    onSelectChange(selectedRowKeys) {
        //console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    handleSelectAll(selected, selectedRows, changeRows) {
        //console.log(selected, selectedRows, changeRows)
        this.setState({
            selectItem: selectedRows
        })
    }
    onOk() {
    console.log("this.state.selectItem",this.state.selectItem)
        this.props.onOk(this.state.selectItem);
        this.setState({
            selectItem: []
        })
    }
    onCancel() {
        this.props.onCancel();
        this.setState({
            selectItem: this.props.initValue,
        })
    }
    onRowDoubleClick=(record, index)=>{
        let widget_type = this.props.item.widget_type
        if(widget_type == 'selectmodel'){
            this.props.onOk([record]);
            this.setState({
                selectItem: []
            })
        }
    }
    render() {
        const columns = [
            { title: '任务id', dataIndex: 'taskId', key: 'taskId'},
            { title: '任务编号', dataIndex: 'taskCode', key: 'taskCode'},
            { title: '任务名称', dataIndex: 'taskName', key: 'taskName'}
        ]
        const { selectedRowKeys } = this.state;
        let type = this.props.item.widget_type == 'selectmodel' ? 'radio' : 'checkbox';
        const rowSelection = {
            type: type,
            onSelect: this.handleUserSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        return (
            <div className="bg-gray full-height vpselectentity" >
                <div className="p-sm full-height  p-b-xxlg">
                    <div className="full-height scroll-y">
                    <VpRow gutter={2} className="overflow">
                        <VpCol span={24}>
                            <div className="bg-white">
                                <div className="p-sm fw infinite bg-white">
                                    <SeachInput onSearch={this.handlesearch} />
                                </div>
                                <div className={this.state.table_array.length ? "p-sm infinite hasdata" : "p-sm infinite"}>
                                    <VpTable
                                        columns={columns}
                                        size="small"
                                        dataSource={this.state.table_array}
                                        rowSelection={rowSelection}
                                        onChange={this.tableChange}
                                        onRowClick={this.onRowClicks}
                                        onDoubleClick={this.onRowDoubleClick}
                                        pagination={this.state.pagination}
                                        resize
                                        // bordered
                                        rowKey={record => record.taskId}
                                    />
                                </div>
                            </div>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={24}>
                            <div className="bg-white m-t-sm" style={{ minHeight: '100px' }}>
                                {
                                this.state.selectItem?
                                    this.state.selectItem.map((item, i) => {
                                        return (
                                            <VpTag className='tag-select' key={item.taskId} closable onClose={this.onClose.bind(this, item, i)}>
                                                <img src={logopic} alt="" />
                                                {item.taskName}
                                            </VpTag>)
                                    }):''
                                }
                            </div>
                        </VpCol>
                    </VpRow>
                    </div>
                </div>
                <div className="footer-button-wrap ant-modal-footer" style={{ position: 'absolute' }}>
                    <VpButton type="primary" className="vp-btn-br" onClick={this.onOk}>确定</VpButton>
                    <VpButton type="ghost" className="vp-btn-br" onClick={this.onCancel}>取消</VpButton>
                </div>
            </div>
        )
    }
}

export default ChooseEntity;

