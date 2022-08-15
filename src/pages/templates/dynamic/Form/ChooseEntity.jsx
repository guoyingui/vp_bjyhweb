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

class ChooseEntity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            table_headers: [],
            selectItem: [],
            table_array: [],
            cur_page: 1,
            page: 1,
            pagination: {},
            limit: 10, //每页记录数
            quickvalue: '',
            idepartmentid: '',
            item: {modalProps:{},...this.props.item},
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
        this.getDptTreeData = this.getDptTreeData.bind(this);
        this.handlesearch = this.handlesearch.bind(this);
        this.onRowClicks = this.onRowClicks.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            let initValue = nextProps.initValue||[];
            let selectsValues = initValue[0]!=undefined?initValue[0].iid==""?[]:initValue:[]
            this.setState({
                params: nextProps.params,
                selectItem: selectsValues,
                selectedRowKeys: selectsValues.map((item, i) => {
                    return item.iid
                })
            }, () => {
                this.getDptTreeData()
                this.getListHeader()
                this.getListData()
            })
        }
    }
    componentWillMount() {
        let initValue = this.props.initValue||[]
        let selectsValues = initValue[0]!=undefined?initValue[0].iid==""||!initValue[0].sname?[]:initValue:[]
        this.setState({
            item: {modalProps:{},...this.props.item},
            selectItem: selectsValues,
            selectedRowKeys: selectsValues.map((item, i) => {
                return item.iid
            })
        }, () => {
            this.getDptTreeData()
            this.getListHeader()
            this.getListData()
        })        
    }

    componentDidMount(){
        $('.search').find('input').attr('maxlength',400)
    }
    getDptTreeData() {
        let sparam = {
            idpttype: this.state.item.idpttype != 1 ? 0 : 1
        }
        vpQuery('/{vpplat}/model/getDptTree', {
            sparam:JSON.stringify(sparam)
        }).then((response) => {
            const treedata = build(response.data);
            this.setState({
                data: treedata
            })
        })
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
        //console.log("item",item)
        const params = _this.state.params || {};
        let ientityid = item.ientityid
        if (this.props.item.irelationentityid == -2) {
            vpQuery('/{vpflow}/rest/flowgroup/pagechosen2', {
            //vpQuery('/{vpczccb}/flowConf/getFlowGroupList', {
                curr:cur_page,limit:limit,quickSearch:this.state.quickvalue
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
            let condition = ''
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
                condition:[...condition,...this.state.item.modalProps.condition||[]],
                viewcode: 'modelList',
                quickSearch: this.state.quickvalue,
                groupids:item.modalProps&&item.modalProps.groupids||""
            }
            vpQuery(this.state.item.modalProps.ajaxurl||'/{vpplat}/model/dynamiclistdata', {
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
                        current:data.currentPage,
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
            let column = { title: item.field_label, width: item.iwidth, dataIndex: item.field_name, key: i }
            if (item.sort) {
                column.sorter = true;
            }
            return column
        })
        return headers;
    }

    // 搜索框确定事件
    handlesearch(value) {
        const searchVal = $.trim(value);//value.replace(/\s/g, "");
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
        //console.log(value)
    }

    onRowClick(record, index) {
        this.setState({
            idepartmentid: record.iid,
            cur_page:1
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
                return item.iid
            })
        })
    }
    handleSelect(record, selected, selectedRows) {
        //console.log(record)
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
    //其他按钮，用于查询全部数据
    reloadAll = () =>{
        this.setState({
            item:{...this.props.item,
                modalProps:{},
                groupids:'',
                condition:[],
                idepartmentid:'',
                currentPage: 1,
                pageSize: 10,
            }
        },()=>{
            this.getListData()
        })
        
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
                        <VpCol span={8}>
                            <div className="bg-white">
                                <div className="p-sm fw infinite bg-white">
                                    <SeachInput onSearch={this.handlesearch} />
                                </div>
                                <div className="p-sm" style={{ maxHeight: '500px', overflow: 'auto' }}>
                                    <VpTable
                                        onExpand={this.onExpand}
                                        onExpandedRowsChange={this.onExpandedRowsChange}
                                        columns={columns}
                                        dataSource={this.state.data}
                                        onRowClick={this.onRowClick}
                                        pagination={false}
                                        size="small"
                                        showHeader={false}
                                        // bordered
                                    />
                                </div>
                            </div>
                        </VpCol>
                        <VpCol span={16}>
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
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={24}>
                            <div className="bg-white m-t-sm" style={{ minHeight: '100px' }}>
                                {
                                this.state.selectItem?
                                    this.state.selectItem.map((item, i) => {
                                        return (
                                            <VpTag className='tag-select' key={item.iid} closable onClose={this.onClose.bind(this, item, i)}>
                                                <img src={logopic} alt="" />
                                                {item.sname}
                                            </VpTag>)
                                    }):''
                                }
                            </div>
                        </VpCol>
                    </VpRow>
                    </div>
                </div>
                <div className="footer-button-wrap ant-modal-footer" style={{ position: 'absolute' }}>
                {this.props.item.irelationentityid ==2?
                    <VpButton type="ghost" className="vp-btn-br" onClick={this.reloadAll}>其他</VpButton>
                :null}
                    <VpButton type="primary" className="vp-btn-br" onClick={this.onOk}>确定</VpButton>
                    <VpButton type="ghost" className="vp-btn-br" onClick={this.onCancel}>取消</VpButton>
                </div>
            </div>
        )
    }
}

export default ChooseEntity;

