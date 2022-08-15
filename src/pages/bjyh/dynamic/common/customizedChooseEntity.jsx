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

import './customizedChooseEntity.less';

function build(menuList) {
    let temp = {};
    let ans = {};
    let newList = [];
    for (let i in menuList) {
        temp[menuList[i].iid] = menuList[i];
    }
    for (let i in temp) {
        if (temp[i].pid && temp[i].pid != '0') {
            if (!temp[temp[i].pid].children) {
                temp[temp[i].pid].children = new Array();
            }
            temp[temp[i].pid].children.push(temp[i]);
        } else {
            ans[temp[i].iid] = temp[i];
        }
    }
    for (let i in ans) {
        newList.push(ans[i])
    }
    return newList;
}

class CustomizedChooseEntity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            table_headers: [],
            selectItem: [],
            table_array: [],
            cur_page: 1,
            page: 1,
            pagination: {},
            limit: 10, //每页记录数
            quickvalue: '',
            idepartmentid: '',
            item: this.props.item,
            params: this.props.params || {}
        }
        this.onRowClick = this.onRowClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.tableChange = this.tableChange.bind(this);
        this.onShowSizeChange = this.onShowSizeChange.bind(this);
        this.getListData = this.getListData.bind(this);
        this.getListHeader = this.getListHeader.bind(this);
        this.handlesearch = this.handlesearch.bind(this);
        this.onRowClicks = this.onRowClicks.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            let initValue = nextProps.initValue
            let selectsValues = initValue[0]!=undefined?initValue[0].iid==""?[]:initValue:[]
            this.setState({
                params: nextProps.params,
                selectItem: selectsValues,
                selectedRowKeys: selectsValues.map((item, i) => {
                    return item.iid
                })
            }, () => {
                this.getListHeader()
                this.getListData()
            })
        }
    }

    componentWillMount() {
        let initValue = this.props.initValue
        let selectsValues = initValue[0]!=undefined?initValue[0].iid==""?[]:initValue:[]
        this.setState({
            item: this.props.item,
            selectItem: selectsValues,
            selectedRowKeys: selectsValues.map((item, i) => {
                return item.iid
            })
        }, () => {
            this.getListHeader()
            this.getListData()
        })
    }

    componentDidMount(){
        $('.search').find('input').attr('maxlength',400)
    }

    getListHeader() {
        vpQuery('/{vpplat}/vfrm/entity/getlistHeader', {
            irelentityid: this.state.item.irelationentityid,
            scode: 'modelList'
        }).then((response) => {
            const table_headers = this.initHeaders(response.data.grid.fields);
            this.setState({
                table_headers
            })
        })
    }
    getListData() {
        const _this = this;
        const { cur_page, limit, item } = _this.state;
        const params = _this.state.params;
        let ientityid = item.ientityid
        if (this.props.item.irelationentityid == -2) {
            vpQuery('/{vpflow}/rest/flowgroup/pagechosen2', {
            }).then((datas) => {
                let data = datas.data;
                let showTotal = () => {
                    return '共' + data.totalRows + '条'
                }
                _this.setState({
                    table_array: data.resultList,
                    cur_page: data.currentPage,
                    total_rows: data.totalRows,
                    num_perpage: data.numPerPage,
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
        } else {
            let roleid = ''
            let key = item.field_name
            let condition = item.condition || ''
            if (params.hasOwnProperty('phaserelentityid')) {
                ientityid = params.phaserelentityid
                condition = params.rowid ? params.rowid : ''
            }
            if (key != undefined && key.indexOf('roleid') == 0) {
                roleid = key.substring(6)
            }
            let sparam = {
                currentPage: cur_page,
                pageSize: limit,
                ientityid: ientityid,
                irelentityid: item.irelationentityid,
                iid: params.iid,
                idpttype: item.idpttype != 1 ? 0 : 1,
                idepartmentid: this.state.idepartmentid,
                roleid: roleid,
                condition: condition,
                viewcode: 'modelList',
                quickSearch: this.state.quickvalue
            }
            vpQuery('/{vpplat}/model/dynamiclistdata', {
                sparam:JSON.stringify(sparam)
            }).then(function (datas) {
                let data = datas.data;
                let showTotal = () => {
                    return '共' + data.totalRows + '条'
                }
                _this.setState({
                    table_array: data.resultList,
                    cur_page: data.currentPage,
                    total_rows: data.totalRows,
                    num_perpage: data.numPerPage,
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
    }
    // 初始化表头信息
    initHeaders(table_headers) {
        const _this = this;
        let headers = table_headers.map((item, i) => {
            let column = { title: item.field_label, width: item.width, dataIndex: item.field_name, key: i }
            if (item.sort) {
                column.sorter = true;
            }
            return column
        })
        return headers;
    }

    // 搜索框确定事件
    handlesearch(value) {
        const searchVal = value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal,
            cur_page:1
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
            cur_page: pagination.current || this.state.cur_page,
            sortfield: sorter.field,
            sorttype,
            limit: pagination.pageSize || this.state.limit,
        }, () => {
            this.getListData()
        })
    }

    onShowSizeChange(value) {
        console.log(value)
    }

    onRowClick(record, index) {
        this.setState({
            idepartmentid: record.iid
        }, () => {
            this.getListData()
        })
    }
    onExpandedRowsChange(expandedRows) {
        console.log(expandedRows)
    }
    onExpand(expanded, record) {
        console.log(expanded, record)
    }
    onClose(item, i) {
        let newList = [...this.state.selectItem.slice(0, i), ...this.state.selectItem.slice(i + 1)];
        this.setState({
            selectItem: newList,
            selectedRowKeys: newList.map((item, i) => {
                return item.iid
            })
        })
    }
    handleSelect(record, selected, selectedRows) {
        console.log(record)
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
                    if (element.iid === record.iid) {
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
        const selectedIdx = this.state.selectItem.findIndex((item) => record.iid === item.iid)
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
                    selectedRowKeys: [record.iid],
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
                        record.iid
                    ],
                })
            }
        }
    }

    onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    handleSelectAll(selected, selectedRows, changeRows) {
        console.log(selected, selectedRows, changeRows)
        this.setState({
            selectItem: selectedRows
        })
    }
    onOk() {
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
            { title: '编号', dataIndex: 'sname', key: 'sname' }
        ]
        const { selectedRowKeys } = this.state;
        let type = this.props.item.widget_type == 'selectmodel' ? 'radio' : 'checkbox';
        const rowSelection = {
            type: type,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        return (
            <div className="bg-gray full-height vpselectentity" >
                <div className="p-sm full-height  p-b-xxlg">
                    <div className="full-height scroll-y">
                    <VpRow gutter={10} className="overflow">
                                <div style={{width: '300px'}}>
                                    <SeachInput onSearch={this.handlesearch} />
                                </div>
                            <div className="bg-white">
                                <div className={this.state.table_array.length ? "p-sm infinite hasdata" : "p-sm infinite"}>
                                    <VpTable
                                        columns={this.state.table_headers}
                                        size="small"
                                        dataSource={this.state.table_array}
                                        rowSelection={rowSelection}
                                        onChange={this.tableChange}
                                        onRowClick={this.onRowClicks}
                                        onDoubleClick={this.onRowDoubleClick}
                                        pagination={this.state.pagination}
                                        resize
                                        // bordered
                                        rowKey={record => record.iid}
                                    />
                                </div>
                            </div>

                    </VpRow>
                    <VpRow>
                        <VpCol span={24}>
                            <div className="bg-white m-t-sm" style={{ minHeight: '100px' }}>
                                {
                                    this.state.selectItem.map((item, i) => {
                                        return (
                                            <VpTag className='tag-select' key={item.iid} closable onClose={this.onClose.bind(this, item, i)}>
                                                <img src={logopic} alt="" />
                                                {item.sname}
                                            </VpTag>)
                                    })
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

export default CustomizedChooseEntity;

