import React, { Component } from 'react'
import { vpAdd, VpAlertMsg, VpTable, VpButton, VpFormCreate } from 'vpreact';
class FunctionTree extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [],
            table_headers: [],
            table_array: [],
            cur_page: 1,
            page: 1,
            pagination: {},
            limit: 10, //每页记录数
            sortfield: '', //排序列key
            sorttype: '', //排序方式
            selectItem: [],
            selectedRowKeys: [],
            expandedRowKeys: []
        }
        this.tableChange = this.tableChange.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getData = this.getData.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }


    componentWillMount() {
        this.setState({
            relationid: this.props.relationid,
            navigationid: this.props.navigationid
        }, () => {
            this.getHeader()
            this.getData()
        })

    }
    componentDidMount() {

    }

    //获取表头数据
    getHeader() {
        let _this = this;
        let listparams = {
            listType: 'funlistTree'
        }
        vpAdd('/{vpplat}/status/process/getListHeader',
            { sparam: JSON.stringify(listparams) }
        ).then(function (data) {
            if (data) {
                if (data.hasOwnProperty('data')) {
                    _this.setState({ loading: false });
                    if (data.data.hasOwnProperty('grid')) {
                        let _header = [];
                        if (data.data.grid.hasOwnProperty('fields')) {
                            data.data.grid.fields.map(function (records, index) {
                                let _title, data_index, _field_width, _fixed;
                                for (let key in records) {
                                    key == 'field_label' ? _title = records[key] :
                                        key == 'field_name' ? data_index = records[key] : '';
                                    if (key == 'fixed') {
                                        _fixed = records[key];
                                    }
                                    if (key == 'field_width') {
                                        _field_width = records[key];
                                    }
                                }
                                if (_title && data_index) {
                                    if (_fixed == 'left' || _fixed == 'right') {
                                        _header.push({
                                            title: _title,
                                            dataIndex: data_index,
                                            key: data_index,
                                            width: _field_width,
                                            fixed: _fixed
                                        });
                                    } else {
                                        _header.push({
                                            title: _title,
                                            dataIndex: data_index,
                                            key: data_index,
                                            fixed: _fixed
                                        });
                                    }
                                }
                            })

                            let hh = []
                            let namecol = _header.filter(item => item.dataIndex == 'sname')
                            namecol.map(item => { item.width = 280; hh.push(item) })
                            _header.map((item, index) => {
                                let sname = item.dataIndex
                                if (sname != 'sname') {
                                    hh.push(item)
                                }
                            })
                            _this.setState({ table_headers: hh })
                        }
                    }
                }
            }
        }).catch(function (err) {
            console.log(err);
        });

    }

    // 获取表格数据
    getData() {
        const _this = this
        let listparams = {
            listType: 'funlistTree',
            iid: this.props.iid
        }
        
        vpAdd('/{vpplat}/status/process/getToolFunlistTreeData',
            { sparam: JSON.stringify(listparams) }
        ).then(function (res) {
            console.log(new Date())
            const page = res.data.page
            const list = res.data.list
            let showTotal = () => {
                return '共' + page.totalRows + '条'
            }
            _this.setState({
                table_array: page.resultList,
                cur_page: page.currentPage,
                total_rows: page.totalRows,
                num_perpage: page.numPerPage,
                pagination: {
                    showTotal: showTotal,
                    pageSize: page.numPerPage,
                    showSizeChanger: false,
                    showQuickJumper: false,
                }
            })
            let expandArr = []
            //设置选中,张开行
            list.map((item, index) => {
                if (item.checked == 0) {
                    _this.onRowClick(item)
                    if (item.isleaf == -1) {
                        const idx = expandArr.findIndex((iid) => item.iparent === iid)
                        if (idx == -1) {
                            expandArr.push(item.iparent)
                        }
                    }
                }
                if (item.isleaf == 1) { // 非叶子节点
                    expandArr.push(item.iid)
                }
            })
            console.log(new Date())
            _this.setState({
                expandedRowKeys: expandArr
            })
            //console.log(_this.state.selectedRowKeys)
        }).catch((e) => {
            if (!(typeof e == 'function')) {
                console.log('Error:' + e)
            } else {
                e();
            }
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

    //点击当前行选中
    onRowClick(record) {
        //console.log('onRowClick changed: ', record);
        const idx = this.state.selectedRowKeys.findIndex((iid) => record.iid === iid)
        let selected = true
        if (idx != -1) {
            selected = false
        }
        if (selected) {
            this.setState({
                selectedRowKeys: [...this.state.selectedRowKeys, record.iid],
                selectItem: [...this.state.selectItem, record]
            }, () => {
                if (record.hasOwnProperty('children')) {
                    //this.cascadeSelect(record, selected)
                }
            })
        } else {
            this.setState({
                selectedRowKeys: [...this.state.selectedRowKeys.slice(0, idx), ...this.state.selectedRowKeys.slice(idx + 1)],
                selectItem: [...this.state.selectItem.slice(0, idx), ...this.state.selectItem.slice(idx + 1)]
            }, () => {
                if (record.hasOwnProperty('children')) {
                    //this.cascadeSelect(record, selected)
                }
            })
        }
    }

    handleSelect(record, selected) {
        //console.log('handleSelect changed: ', record);
        let idx = 0;
        if (selected) {
            this.setState({
                selectedRowKeys: [...this.state.selectedRowKeys, record.iid],
                selectItem: [...this.state.selectItem, record]
            }, () => {
                if (record.hasOwnProperty('children')) {
                    //this.cascadeSelect(record, selected)
                }
            })
        } else {
            this.state.selectedRowKeys.forEach((element, i) => {
                if (element === record.iid) {
                    idx = i
                }
            });
            this.setState({
                selectedRowKeys: [...this.state.selectedRowKeys.slice(0, idx), ...this.state.selectedRowKeys.slice(idx + 1)],
                selectItem: [...this.state.selectItem.slice(0, idx), ...this.state.selectItem.slice(idx + 1)]
            }, () => {
                if (record.hasOwnProperty('children')) {
                    //this.cascadeSelect(record, selected)
                }
            })
        }
    }
    cascadeSelect(record, selected) {
        //console.log('cascadeSelect changed: ', selected, record)
        let idx = 0
        let keyArr = []
        let itemArr = []
        if (record.hasOwnProperty('children')) {
            record.children.forEach((element, i) => {
                idx = this.state.selectedRowKeys.findIndex((iid) => element.iid === iid)
                if (selected) {
                    //console.log("selected ", i)
                    if (idx == -1) {
                        keyArr.push(element.iid)
                        itemArr.push(element)
                    }
                } else {
                    //console.log("unselected ", i)
                    if (idx != -1) {
                        keyArr.push(element.iid)
                        itemArr.push(element)
                    }
                }
            })
        }

        if (selected) {
            this.setState({
                selectedRowKeys: [...this.state.selectedRowKeys, ...keyArr],
                selectItem: [...this.state.selectItem, ...itemArr]
            }, () => {
                //console.log('cascadeSelect selectedRowKeys: ', this.state.selectedRowKeys);
            })
        } else {
            let selectedRowKeys = []
            let selectItem = []
            this.state.selectItem.forEach((element, i) => {
                idx = keyArr.findIndex((iid) => element.iid === iid)
                if (idx == -1) {
                    selectItem.push(element)
                    selectedRowKeys.push(element.iid)
                }
            })
            this.setState({
                selectedRowKeys: selectedRowKeys,
                selectItem: selectItem
            }, () => {
                //console.log('cascadeSelect selectedRowKeys: ', this.state.selectedRowKeys);
            })
        }
    }
    onSelectChange(selectedRowKeys) {
        //console.log('onSelectChange selectedRowKeys: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handleSelectAll(selected, selectedRows, changeRows) {
        //console.log('handleSelectAll changed: ', selected, selectedRows, changeRows)
        this.setState({
            selectItem: selectedRows
        })
    }

    okClick() {
        if (this.state.selectItem.length > 0) {
            let isOk = false
            this.state.selectItem.map((item) => {
                if (item.isleaf <= 0) { // 功能0,权限-1，分组1，排除分组
                    isOk = true
                }
            })
            if (isOk) {
                this.props.okClick(this.state.selectItem)
            } else {
                VpAlertMsg({
                    message: "消息提示",
                    description: "请至少选择一条类别为功能的数据！",
                    type: "error",
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            }
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: "请至少选择一条数据！",
                type: "error",
                closeText: "关闭",
                showIcon: true
            }, 5)
        }
    }
    cancelClick() {
        this.props.cancelClick()
    }

    onExpand(expanded, record) {
        //console.log(expanded, record)
        if (!expanded) {
            const idx = this.state.expandedRowKeys.findIndex((iid) => record.iid === iid)
            this.setState({
                expandedRowKeys: [...this.state.expandedRowKeys.slice(0, idx), ...this.state.expandedRowKeys.slice(idx + 1)]
            }, () => {
                //console.log(this.state.expandedRowKeys)
            })
        } else {
            this.setState({
                expandedRowKeys: [...this.state.expandedRowKeys, record.iid]
            }, () => {
                //console.log(this.state.expandedRowKeys)
            })
        }
    }

    render() {
        let { selectedRowKeys } = this.state
        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            onChange: this.onSelectChange,
        }
        return (
            <div className="bg-white scroll full-height p-b-xxlg" >
                <div className="p-sm">
                    <VpTable
                        onExpand={this.onExpand}
                        columns={this.state.table_headers}
                        dataSource={this.state.table_array}
                        onChange={this.tableChange}
                        onRowClick={this.onRowClick}
                        pagination={this.state.pagination}
                        rowSelection={rowSelection}
                        rowKey={record => record.iid}
                        expandedRowKeys={this.state.expandedRowKeys}
                        resize
                        // bordered
                    />
                </div>
                <div className="footer-button-wrap ant-modal-footer" style={{ position: 'absolute' }}>
                    <VpButton key="confirmBtn" type="primary" size="large" onClick={() => this.okClick()} >确认</VpButton>
                    <VpButton key="cancelBtn" type="primary" size="large" onClick={() => this.cancelClick()}>取消</VpButton>
                </div>
            </div>
        );
    }
}

export default FunctionTree = VpFormCreate(FunctionTree);