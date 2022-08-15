import React, { Component } from 'react'
import { vpAdd, VpAlertMsg, VpTable, VpTooltip, VpModal, VpButton, VpRow, VpCol, VpFormCreate, VpPopconfirm } from 'vpreact';
import { VpDynamicForm } from 'vpbusiness';

class PhaseRelate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [],
            showRightBox: false,
            table_headers: [],
            table_array: [],
            cur_page: 1,
            page: 1,
            pagination: {},
            limit: 10, //每页记录数
            sortfield: '', //排序列key
            sorttype: '', //排序方式
            increaseData: [], // 新增动态数据
            formdata: [],
            visible: false,
            modaltitle: '',
            selectiid: '',
            selectItem: [],
            selectedRowKeys: [],
            projectname: ''
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.tableChange = this.tableChange.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getData = this.getData.bind(this);
        this.queryFormData = this.queryFormData.bind(this);
        this.saveRowData = this.saveRowData.bind(this);
        this.okModal = this.okModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.toolBarClick = this.toolBarClick.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.setSrcType = this.setSrcType.bind(this);
    }


    componentWillMount() {
        this.setState({
            entityid: this.props.entityid,
            projectid: this.props.projectid,
            phaseid: this.props.phaseid,
            reltype: this.props.reltype
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
        //alert(this.state.reltype);
        vpAdd('/{vpmprovider}/vfrm/phase/getRelListHeader',
            {
                entityid: this.state.entityid,
                projectid: this.state.projectid,
                phaseid: this.state.phaseid,
                reltype: this.state.reltype
            }
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
                            _this.setState({ table_headers: _header })
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
        vpAdd('/{vpmprovider}/vfrm/phase/getRelListData',
            {
                currentPage: this.state.cur_page,
                pageSize: this.state.limit,
                entityid: this.state.entityid,
                projectid: this.state.projectid,
                phaseid: this.state.phaseid,
                reltype: this.state.reltype
            }
        ).then(function (res) {
            const data = res.data
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
        }).catch((e) => {
            if (!(typeof e == 'function')) {
                console.log('Error:' + e)
            } else {
                e();
            }
        })
    }
    onShowSizeChange(value) {
        console.log(value)
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


    okModal() {
        this.setState({
            visible: false
        })
    }

    cancelModal() {
        this.setState({
            visible: false
        })
    }

    //点击下拉存放ID
    handleDropDown(e) {
        e.stopPropagation()
        this.setState({
            selectiid: e.target.dataset.id
        })
    }

    handleCancel() {
        this.setState({
            //increaseData:{},
            visible: false,
        })
    }
    handleOk() {
        this.saveRowData(this.props.form.getFieldsValue());
    }

    // 保存表单
    saveRowData(value, statusid) {
        const _this = this;
        Object.keys(value).forEach((key, i) => {
            if (value[key] == undefined) {
                value[key] = ''
            } else if (value[key] == null) {
                value[key] = 0
            }
        })
        let entityid = this.state.entityid
        if (this.state.srctype == '2') { // 跨实体
            if (this.state.entityid == '7') {
                entityid = '6'
            } else {
                entityid = '7'
            }
        }
        value['entityid'] = this.state.entityid
        value['projectid'] = this.state.projectid
        value['phaseid'] = this.state.phaseid

        let isSave = true
        if (value.project == '') {
            isSave = false
            VpAlertMsg({
                message: "消息提示",
                description: "请选择项目/项目群！",
                type: "error",
                closeText: "关闭",
                showIcon: true
            }, 5)
        } else if (value.milestone == '') {
            isSave = false
            VpAlertMsg({
                message: "消息提示",
                description: "请选择里程碑！",
                type: "error",
                closeText: "关闭",
                showIcon: true
            }, 5)
        } else if (value.milestone == value.phaseid) {
            isSave = false
            VpAlertMsg({
                message: "消息提示",
                description: "前置里程碑不允许选择当前里程碑！",
                type: "error",
                closeText: "关闭",
                showIcon: true
            }, 5)
        }
        value['preentityid'] = entityid
        value['formType'] = 'relate'
        console.log(value)
        if (isSave) {
            vpAdd('/{vpmprovider}/vfrm/phase/save',
                { sparam: JSON.stringify(value) }
            ).then(function (data) {
                if (data.data.success) {
                    _this.setState({
                        visible: false,
                        increaseData: {}
                    }, _this.getData())
                } else {
                    VpAlertMsg({
                        message: "消息提示",
                        description: data.data.msg,
                        type: "error",
                        closeText: "关闭",
                        showIcon: true
                    }, 5)
                }
            })
        }
    }

    //表单字段信息
    queryFormData() {
        const _this = this
        const { entityid, projectid, phaseid } = this.state
        let sparam = { entityid, projectid, phaseid }
        let titlename = '添加前置里程碑'
        vpAdd('/{vpmprovider}/vfrm/phase/getForm',
            { formType: 'relate', sparam: JSON.stringify(sparam) }
        ).then(function (data) {
            let namestr = ''
            data.data.form.groups[0].fields.map(function (item) {
                let sname = item.field_name
                if (sname == 'project') {
                    namestr = item.widget.default_label
                }
            })
            _this.setState({
                srctype: '0',
                modaltitle: titlename,
                increaseData: data.data.form,
                visible: true,
                projectname: namestr,
                params: {
                    entityrole: true, iid: _this.state.projectid, phaserelentityid: entityid
                }
            }, () => console.log(_this.state.projectid))
        })
    }

    //工具栏按钮点击操作
    toolBarClick(optType) {
        const _this = this
        if (optType == 'add') {
            this.setState({
                visible: true,
                selectiid: '0',
                increaseData: {}
            })
            this.queryFormData();
        } else if (optType == 'del') {
            let value = { ids: this.state.selectedRowKeys }
            vpAdd('/{vpmprovider}/vfrm/phase/delete',
                { formType: 'relate', sparam: JSON.stringify(value) }
            ).then(function (data) {
                if (data.data.success) {
                    _this.setState({
                        visible: false,
                        increaseData: {}
                    }, _this.getData())
                } else {
                    VpAlertMsg({
                        message: "消息提示",
                        description: data.data.msg,
                        type: "error",
                        closeText: "关闭",
                        showIcon: true
                    }, 5)
                }
            })
        }
    }

    //点击当前行选中
    onRowClick(record) {
        const selectedIdx = this.state.selectedRowKeys.findIndex((iid) => record.iid === iid)
        if (selectedIdx != -1) {
            this.setState({
                selectedRowKeys: [
                    ...this.state.selectedRowKeys.slice(0, selectedIdx),
                    ...this.state.selectedRowKeys.slice(selectedIdx + 1)
                ]

            })
        } else {
            this.setState({
                selectedRowKeys: [
                    ...this.state.selectedRowKeys.slice(0),
                    record.iid
                ],
            })
        }
    }

    handleSelect(record, selected, selectedRowKeys) {
        let idx = 0;
        if (selected) {
            this.setState({
                selectedRowKeys: [...this.state.selectedRowKeys, record.iid]
            })
        } else {
            this.state.selectedRowKeys.forEach((element, i) => {
                if (element === record.iid) {
                    idx = i
                }
            });
            this.setState({
                selectedRowKeys: [...this.state.selectedRowKeys.slice(0, idx), ...this.state.selectedRowKeys.slice(idx + 1)]
            })
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

    onExpand(expanded, record) {
        console.log(expanded, record)
    }

    setProjectID(value) {
        console.log("value:" + value)
        let dataform = this.state.increaseData
        let fields = []
        dataform.groups[0].fields.map(function (item) {
            let sname = item.field_name
            if (sname == 'milestone') {
                if (parseInt(value) > 0) {
                    item.disabled = false
                } else {
                    item.disabled = true
                }
            }
            fields.push(item)
        })
        console.log(fields)
        dataform.groups.fields = fields
        let params = this.state.params
        params.iid = value
        this.setState({
            params: params,
            increaseData: dataform
        }, () => { console.log(this.state.params) })
        const { setFieldsValue } = this.dynamic
        setFieldsValue({ 'milestone': '', 'milestone_label': '' })
    }

    setSrcType(obj) {
        let srctype = obj.target.value
        let entityid = '7'
        let projectid = '0'
        let projectname = ''
        let disbaled = false
        if (srctype == '0') {
            projectid = this.state.projectid
            projectname = this.state.projectname
            disbaled = true
        } else {
            projectid = ''
            projectname = ''
            disbaled = false
            if (srctype == '1') { //本实体
                entityid = this.state.entityid
            } else { //跨实体
                if (this.state.entityid == '7') {
                    entityid = '6'
                } else {
                    entityid = '7'
                }
            }
        }
        //alert(srctype + ":" + projectname)
        let dataform = this.state.increaseData
        let fields = []
        dataform.groups[0].fields.map(function (item) {
            let sname = item.field_name
            if (sname == 'milestone') {
                if (parseInt(projectid) > 0) {
                    item.disabled = false
                } else {
                    item.disabled = true
                }
            } else if (sname == 'project') {
                item.disabled = disbaled
                item.irelationentityid = entityid
            }
            fields.push(item)
        })
        console.log(fields)
        dataform.groups.fields = fields
        let params = this.state.params
        params.iid = projectid
        params.phaserelentityid = entityid
        this.setState({
            srctype: srctype,
            params: params,
            increaseData: dataform
        })
        const { setFieldsValue } = this.dynamic
        setFieldsValue({ 'project': projectid, 'project_label': projectname, 'milestone': '', 'milestone_label': '' })
    }

    render() {
        let { selectedRowKeys } = this.state
        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            onChange: this.onSelectChange,
        }
        const clearMsg = '确认删除所选记录?'
        return (
            <div className="business-container pr full-height">
                {
                    this.state.reltype == '0'
                        ?
                        <div className="subAssembly b-b bg-white" style={this.props.style}>
                            <VpRow gutter={1}>
                                <VpCol className="gutter-row text-right" span={30}>
                                    <VpTooltip placement="left" title="添加">
                                        <VpButton type="ghost" icon="plus" onClick={() => this.toolBarClick('add')}></VpButton>
                                    </VpTooltip>

                                    <VpTooltip placement="left" title="删除">
                                        <VpPopconfirm placement="bottomLeft" title={clearMsg} onConfirm={() => this.toolBarClick('del')} onCancel={this.cancel}>
                                            <VpButton type="ghost" style={{ margin: "0 3px" }} icon="cross" ></VpButton>
                                        </VpPopconfirm>
                                    </VpTooltip>
                                </VpCol>
                            </VpRow>
                        </div>
                        :
                        ''
                }
                <div className="business-wrapper p-t-sm full-height">
                    <div className="p-sm bg-white" >
                        <VpTable
                            onExpand={this.onExpand}
                            columns={this.state.table_headers}
                            dataSource={this.state.table_array}
                            onChange={this.tableChange}
                            onRowClick={this.onRowClick}
                            pagination={this.state.pagination}
                            rowSelection={rowSelection}
                            rowKey={record => record.iid}
                            resize
                            // bordered
                        />
                    </div>
                </div>
                <VpModal
                    title={this.state.modaltitle}
                    visible={this.state.visible}
                    onOk={() => this.okModal()}
                    onCancel={() => this.cancelModal()}
                    width={'70%'}
                    footer={null}
                    wrapClassName='modal-no-footer' >
                    <VpDynamicForm
                        ref={(node) => this.dynamic = node}
                        bindThis={this}
                        className="p-sm full-height scroll p-b-xxlg"
                        formData={this.state.increaseData}
                        handleOk={this.saveRowData}
                        handleCancel={this.handleCancel}
                        params={this.state.params}
                        okText="提 交" />
                </VpModal>

            </div>
        );
    }
}

export default PhaseRelate = VpFormCreate(PhaseRelate);