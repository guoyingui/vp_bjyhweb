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

import './SjxtEntity.less';

/*function build(menuList) {
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
}*/

class SjxtEntity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],  //部门树形数据
            table_headers: [], //头部标题数据
            selectItem: [], //所选项目
//table_array[0]{ientityid: "2"，iid: "100003",ilike: "",key: "100003",num: "1",scode: "000006",sdescription: "",sname: "闫冰竹",ssequencekey: ""}
            table_array: [],
            cur_page: 1,//当前页
            page: 1,
//{onShowSizeChange: ƒ (),pageSize: 10,showQuickJumper: true,showSizeChanger: true,showTotal: ƒ showTotal(),total: 862,__proto__: Object}
            pagination: {},
            limit: 10, //每页记录数
            quickvalue: '',  //搜索查询关键字
            idepartmentid: '', //部门ID
            item: this.props.item,
/* item里所有属性
all_line: 2
detailClick: ƒ ()
disabled: false
field_label: "涉及系统"
field_name: "sjxt"
irelationentityid: 2
panes: []
url: "templates/Form/ChooseEntity"
widget: {default_value: null, default_label: null}
widget_type: "selectmodel"
__proto__: Object*/
            params: this.props.params || {}   //参数
        }
       // this.onRowClick = this.onRowClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.tableChange = this.tableChange.bind(this);
        this.onShowSizeChange = this.onShowSizeChange.bind(this);
        this.getListData = this.getListData.bind(this);
      //  this.getListHeader = this.getListHeader.bind(this);
       // this.getDptTreeData = this.getDptTreeData.bind(this);
        this.handlesearch = this.handlesearch.bind(this);
        this.onRowClicks = this.onRowClicks.bind(this);
    }
    //在组件接收到一个新的 prop (更新后)时被调用
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
              //  this.getDptTreeData()
              //  this.getListHeader()
                this.getListData()
            })
        }
    }
    //在渲染前调用,在客户端也在服务端。
    componentWillMount() {
        let initValue = this.props.initValue||[]
        let selectsValues = initValue[0]!=undefined?initValue[0].iid==""?[]:initValue:[]
        this.setState({
            item: this.props.item,
            selectItem: selectsValues,
            selectedRowKeys: selectsValues.map((item, i) => {
                return item.iid
            })
        }, () => {
           // this.getDptTreeData()
           // this.getListHeader()
            this.getListData()
        })

    }
    //在第一次渲染后调用，只在客户端
    componentDidMount(){
        $('.search').find('input').attr('maxlength',400)
    }
   /* getDptTreeData() {
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
    }*/
    getListData() {
        const _this = this;
        const { cur_page, limit, item } = _this.state;
        const params = _this.state.params || {};
        let ientityid = item.ientityid
           // let roleid = ''
            let key = item.field_name
            if (key != undefined && key.indexOf('roleid') == 0) {
                roleid = key.substring(6)
            }
            let sparam = {
                currentPage: cur_page,
                pageSize: limit,
                ientityid: this.props.item.entityid,
               // irelentityid: item.irelationentityid,
                // iid: params.iid,
                //  idpttype: item.idpttype != 1 ? 0 : 1,
                //  idepartmentid: this.state.idepartmentid,
                // roleid: roleid,
                //viewcode: 'modelList',
                quickSearch: this.state.quickvalue
            }
            vpQuery('/{bjyh}/objpjres/dynamiclistdata',{
                //sparam:JSON.stringify(sparam)
                currentPage: cur_page.toString(),
                pageSize: limit.toString(),
                quickSearch: this.state.quickvalue
            }).then(function(datas){
                let data=datas.data;
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
    // 初始化表头信息
    /*initHeaders(table_headers) {
        const _this = this;
        let headers = table_headers.map((item, i) => {
            let column = { title: item.field_label, width: item.width, dataIndex: item.field_name, key: i }
            if (item.sort) {
                column.sorter = true;
            }
            return column
        })
        return headers;
    }*/

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

   /* onRowClick(record, index) {
        this.setState({
            idepartmentid: record.iid
        }, () => {
            this.getListData()
        })
    }*/
   /* onExpandedRowsChange(expandedRows) {
        console.log(expandedRows)
    }
    onExpand(expanded, record) {
        console.log(expanded, record)
    }*/
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
        /*
ientityid: "2"
iid: "100003"
ilike: ""
key: "100003"
num: "1"
scode: "000006"
sdescription: ""
sname: "闫冰竹"
ssequencekey: ""*/
        console.log(record)
        let idx = 0;
        if (this.props.item.widget_type == 'selectmodel') {
            if (selected) {
                this.setState({
                  //  selectItem: [record]
                    selectItem: selectedRows
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
                  /*  selectedRowKeys: this.state.selectedRowKeys,
                    selectItem: this.state.selectedRows*/
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
       /* const columns = [
            { title: '编号', dataIndex: 'sname', key: 'sname' }
        ]*/
       //{title: "编号", width: undefined, dataIndex: "scode", key: 0}
        const columns = [
            { title: '名称', dataIndex: 'sname', key: 0 },
            { title: '编号', dataIndex: 'scode', key: 1 },
            { title: '开发负责人A角', dataIndex: 'Kffzraj1', key: 2 },
            { title: '描述', dataIndex: 'sdescription', key:3  },
        ]
        const { selectedRowKeys } = this.state;
       // let type = this.props.item.widget_type == 'selectmodel' ? 'radio' : 'checkbox';
        let type = this.props.item.widget_type == 'selectmodel' ? 'checkbox' : 'radio';
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
                                   {/* <div className="p-sm" style={{ maxHeight: '500px', overflow: 'auto' }}>
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
                                    </div>*/}
                                </div>
                            </VpCol>
                            <VpCol span={16}>
                                <div className="bg-white">
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

export default SjxtEntity;

