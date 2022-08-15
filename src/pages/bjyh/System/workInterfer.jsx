import React, { Component } from 'react'
import { VpSelect, VpOption, vpAdd, VpAlertMsg, VpMenu, VpMenuItem, VpDropdown, VpForm, VpInput, VpCheckbox, VpTable, VpTooltip, VpModal, VpButton, VpRow, VpCol, VpIcon, VpFormCreate } from 'vpreact'
import './workInterfer.less';
import { SeachInput, FindCheckbox, VpDynamicForm } from 'vpbusiness';
import ChooseEntity from '../../templates/dynamic/Form/ChooseEntity';
class WorkInterfer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [],
            table_headers: [],
            table_array: [],
            cur_page: 1,
            num_perpage: 10, //每页记录数
            pagination: {},
            increaseData: [],
            visible: false,
            showSearch: false,
            modaltitle: '',
            notifierArr: [],
            notifierSelectedArr: [],
            updateCharer: false,
            chosenType: 'selectmodel',
            clickid: '',
            searchConditon: {},
            iassignto: '',
            iassigntoname: '',
            selectrecord: {},
            searchStatus: false,
            entityTemplate: [],
            entityType: '-1',
            quickvalue: '',
            tableHeight: ''
        }
        this.tableChange = this.tableChange.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getData = this.getData.bind(this);
        this.okModal = this.okModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
    }


    componentWillMount() {
        this.getHeader()
        this.openSearchModal()
        this.getEntityList()
    }
    componentDidMount() {
        let theight = vp.computedHeight(this.state.table_array.length, '.workInterfer');
        this.setState({ tableHeight: theight - 30})
    }

    //获取表头数据
    getHeader = () => {
        let _this = this;
        vpAdd('/{vpplat}/vfm/workInterfer/getListHeader',
            {}
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
                            const menu = (
                                <VpMenu onClick={_this.menuClick}>
                                    <VpMenuItem key="open">
                                        <a>重新分配</a>
                                    </VpMenuItem>
                                </VpMenu>
                            )

                            let hh = [{
                                title: '操作', key: 'menu', width: 100, render: (text, record) => {
                                    return (
                                        <div style={{ textAlign: 'center' }}>
                                            <VpDropdown overlay={menu}
                                                trigger={['click']}>
                                                <VpIcon type='caret-circle-down' onClick={(e) => _this.handleDropDown(e, record)} />
                                            </VpDropdown>
                                        </div>
                                    )
                                }
                            }]

                            /*  _header.map((item, index) => {
                                 hh.push(item)
                             }) */
                            _header.push(hh[0])
                            _this.setState({ table_headers: _header })
                        }
                    }
                }
            }
        }).catch(function (err) {
            console.log(err);
        });

    }
    getEntityList = () => {
        const _this = this
        vpAdd('/{vpplat}/vfm/workInterfer/getEntityList',
            {}
        ).then(function (res) {
            console.log(res)
            _this.setState({
                entityTemplate: res.data
            })
        }).catch((e) => {
            if (!(typeof e == 'function')) {
                console.log('Error:' + e)
            } else {
                e();
            }
        })
    }
    // 获取表格数据
    getData = () => {
        const _this = this
        if(_this.state.entityType=='-1'){
            let theight = vp.computedHeight(0, '.workInterfer')
            this.setState({
                tableHeight: theight - 30,
                table_array:[],
                cur_page: 1,
                total_rows: 0,
                num_perpage: 10,
                pagination: {
                    total: 0,
                    showTotal: false,
                    pageSize: 10
                }

            })
            return;
        }
        let listparams = this.state.searchConditon
        listparams['curr'] = this.state.cur_page
        listparams['limit'] = this.state.num_perpage
        let ientityid = listparams.ientityid
        let sname = listparams.sname
        if (ientityid == ''||ientityid == undefined) {
            listparams['ientityid'] = this.state.entityType
        }
        if (sname == '') {
            listparams['sname'] = this.state.quickvalue
        }
        vpAdd('/{vpplat}/vfm/workInterfer/getListData',
            { sparam: JSON.stringify(listparams) }
        ).then(function (res) {
            const data = res.data
            let showTotal = () => {
                return '共' + data.totalRows + '条'
            }
            let theight = vp.computedHeight(data.resultList.length, '.workInterfer')
            _this.setState({
                tableHeight: theight - 30,
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
    handleDropDown = (e, record) => {
        e.stopPropagation()
        this.setState({
            selectrecord: record
        })
    }
    menuClick = (a, b, c) => {
        let key = a.key
        if (key == 'open') {
            this.showChangeModal(this.state.selectrecord);
        }
    }
    onShowSizeChange(value) {
        console.log(value)
    }

    // 表格的变动事件
    tableChange(pagination, filters, sorter) {
        this.setState({
            cur_page: pagination.current || this.state.cur_page,
            num_perpage: pagination.pageSize || this.state.num_perpage,
        }, () => {
            this.getData()
        })
    }

    openSearchModal = () => {
        const _this = this
        let value = { loadType: 'search' }
        vpAdd('/{vpplat}/vfm/workInterfer/loadForm',
            { sparam: JSON.stringify(value) }
        ).then(function (res) {
            _this.setState({
                increaseData: res.data.form
            })
        })
    }

    okSearchModal = (value) => {
        if(this.state.entityType!='-1'&&this.state.entityType!=''){
            Object.keys(value).forEach((key, i) => {
                if (value[key] == undefined) {
                    value[key] = ''
                } else if (value[key] == null) {
                    value[key] = ''
                }
            })
            console.log(value)
            this.setState({
                searchStatus: false,
                searchConditon: value
            }, () => {
                this.getData()
            })
        }else{
            VpAlertMsg({
                message: "消息提示",
                description: '请选择实体！',
                type: "info",
                closeText: "关闭",
                showIcon: true
            }, 5)
        }
        
    }

    cancelSearchModal = () => {
        this.setState({
            searchStatus: false
        })
    }

    //打开重新分配窗口
    showChangeModal(record) {
        console.log(record)
        this.setState({
            iid: record.iid,
            entityid: record.entityid,
            modaltitle: '重新分配>' + record.sname,
            iassignto: record.iassignto,
            iassigntoname: record.iassigntoname,
            visible: true,
            notifierArr: []
        }, () => {

        })
    }

    //点击当前行选中
    onRowClick(record) {
        this.showChangeModal(record)
    }

    btnOptClick = (optType) => {
        if (optType == 'ok') { //确认变更
            const _this = this
            let iassignto = $('#iassignto').attr('data-id')
            if (iassignto == '' || iassignto == undefined) {
                VpAlertMsg({
                    message: "消息提示",
                    description: '分配给不能为空！',
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            } else {
                let entityid = this.state.entityid
                let iid = this.state.iid
                let remark = $('#remark').val()
                let notifierArr = this.state.notifierSelectedArr
                let objparam = { iassignto, remark, notifierArr }
                console.log(objparam)
                vpAdd('/{vpplat}/vfm/workInterfer/save',
                    { entityid: entityid, iid: iid, sparam: JSON.stringify(objparam) }
                ).then(function (res) {
                    console.log(res)
                    _this.setState({
                        visible: false,
                        notifierSelectedArr: []
                    }, () => {
                        _this.getData()
                    })
                })
            }
        } else if (optType == 'cancel') { //取消变更
            this.setState({
                visible: false
            })
        }
    }

    okModal() {
        this.setState({
            visible: false,
            notifierArr: []
        })
    }

    cancelModal() {
        this.setState({
            visible: false,
            notifierArr: []
        })
    }
    cancelChoosen = () => {
        this.setState({
            updateCharer: false
        })
    }
    submitChoosen = (selectItem) => {
        let { clickid } = this.state
        if (clickid == 'iassignto') { // 分配给 单选
            let snames = ''
            let ids = ''
            selectItem.map((item, index) => {
                if (index > 0) {
                    snames += ','
                    ids += ','
                }
                snames += item.sname
                ids += item.iid
            })
            $('#' + clickid).val(snames)
            $('#' + clickid).attr('data-id', ids)
            this.cancelChoosen()
        } else if (clickid == 'notifierDiv') { //通知人 多选
            let idx = 0
            let arr1 = this.state.notifierArr
            let arr2 = this.state.notifierSelectedArr
            selectItem.map((item, index) => {
                idx = arr1.findIndex((obj) => item.iid === obj.value)
                if (idx == -1) {
                    arr1.push({ value: item.iid, label: item.sname })
                    arr2.push(item.iid)
                }
            })
            this.setState({
                notifierArr: [],
                notifierSelectedArr: []
            }, () => {
                console.log(this.state.notifierArr, this.state.notifierSelectedArr);
                this.cancelChoosen()
                this.setState({
                    notifierArr: arr1,
                    notifierSelectedArr: arr2
                })
            })
        }

    }
    chosenUser = (clickid) => {
        let chosenType = ''
        if (clickid == 'iassignto') { // 分配给 单选
            chosenType = 'selectmodel'
        } else if (clickid == 'notifierDiv') { //通知人 多选
            chosenType = 'checkbox'
        }
        this.setState({
            chosenType: chosenType,
            updateCharer: true,
            clickid: clickid
        })
    }
    onChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
        this.setState({
            notifierSelectedArr: checkedValues
        })
    }
    // 搜索框确定事件
    handlesearch = (value) => {
        const searchVal = $.trim(value);//value.replace(/\s/g, "");
        if (this.state.entityType > 0) {
            this.setState({
                quickvalue: searchVal,
                searchConditon: { ientityid: '', sname: '' }
            }, () => {
                this.getData()
            })
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: '请先筛选实体！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
        }
    }
    chooseModalVisible = (visible) => {
        this.chooseVisible = visible
    }
    handleVisibleChange = () => {
        if (!this.chooseVisible) {
            let { increaseData } = this.state
            if (increaseData.groups) {
                this.setState({ searchStatus: !this.state.searchStatus })
            } else {
                VpAlertMsg({
                    message: "消息提示",
                    description: '暂无可搜索项，请配置搜索表单！',
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            }
        }
    }
    handleEntityChange = (value) => {
        this.setState({
            entityType: value,
            searchConditon: {}
        }, () => {
            this.getData()
        })
    }
    render() {
        const menu = (
            this.state.searchStatus
                ?
                <div className="search-forms bg-white ant-dropdown-menu">
                    <VpDynamicForm
                        ref={(node) => this.dynamic = node}
                        bindThis={this}
                        className="p-sm full-height scroll p-b-xxlg"
                        formData={this.state.increaseData}
                        handleOk={(value) => this.okSearchModal(value)}
                        handleCancel={this.cancelSearchModal}
                        chooseModalVisible={this.chooseModalVisible}
                        okText="查 询" />
                </div>
                : <div></div>
        )
        return (
            <div className="full-height overflow">
                {
                    <div className="p-b-sm m-b-sm b-b bg-white">
                        <VpRow gutter={1}>
                            <VpCol className="gutter-row" span={4}>
                                <VpSelect
                                    defaultValue={this.state.entityType}
                                    style={{ width: 150 }}
                                    onChange={this.handleEntityChange}
                                >
                                    <VpOption value='-1'>请选择实体</VpOption>
                                    {this.state.entityTemplate.map((option, index) => {
                                        return (
                                            <VpOption
                                                key={index}
                                                value={option.hasOwnProperty('value') ? option.value : ''}>
                                                {option.hasOwnProperty('label') ? option.label : ''}
                                            </VpOption>
                                        );
                                    })
                                    }
                                </VpSelect>
                            </VpCol>
                            <VpCol className="gutter-row" span={4}>
                                <SeachInput onSearch={(value) => this.handlesearch(value)} />
                            </VpCol>
                            <VpCol className="gutter-row text-right">
                                <VpDropdown
                                    onClick={() => this.handleVisibleChange()}
                                    trigger={['click']}
                                    overlay={menu}
                                    onVisibleChange={() => this.handleVisibleChange()}
                                    visible={this.state.searchStatus}>
                                    <div style={{ display: 'inline-block' }} id="searchbox">
                                        <FindCheckbox />
                                    </div>
                                </VpDropdown>
                            </VpCol>
                        </VpRow>
                    </div>
                }
                <div className="business-wrapper full-height">
                    <div className="bg-white scroll-y full-height">
                        <VpTable
                            columns={this.state.table_headers}
                            dataSource={this.state.table_array}
                            onChange={this.tableChange}
                            onRowClick={this.onRowClick}
                            pagination={this.state.pagination}
                            rowKey={record => record.iid}
                            className='workInterfer'
                            scroll={{ y: this.state.tableHeight }}
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
                    width={'80%'}
                    height={'100%'}
                    maskClosable={false}
                    footer={[
                        <div className="text-center" key="btn">
                            {
                                <VpButton className="vp-btn-br" key="ok" type="primary" size="large" onClick={() => this.btnOptClick('ok')}>确定</VpButton>
                            }
                            {
                                <VpButton className="vp-btn-br" key="cancel" type="primary" size="large" onClick={() => this.btnOptClick('cancel')} >取消</VpButton>
                            }
                        </div>
                    ]} >
                    {
                        this.state.visible ?
                            <div className="business-container full-height">
                                <div className="baseDiv" key="baseDiv">
                                    <VpForm horizontal >
                                        <VpRow >
                                            <VpCol span={3} className="text-center p-lr-sm"><h4 className="ant-form-item-required">分配给:</h4></VpCol>
                                            <VpCol span={20}>
                                                <VpInput id="iassignto" defaultValue={this.state.iassigntoname} data-id={this.state.iassignto}
                                                    suffix={<VpIcon type='search' style={{ marginTop: 7 }} onClick={() => this.chosenUser('iassignto')} />}
                                                    onClick={() => this.chosenUser('iassignto')} placeholder="请选择用户" readOnly="true" />
                                            </VpCol>
                                        </VpRow >
                                        <VpRow style={{ marginTop: 20 }} >
                                            <VpCol span={3} className="text-center p-lr-sm"><h4>通知人:</h4></VpCol>
                                            <VpCol span={20}>
                                                <VpRow style={{ marginTop: 5 }} >
                                                    <VpCol span={24} className="text-left">
                                                        <a onClick={() => this.chosenUser('notifierDiv')}><h3>查找/添加通知人</h3></a>
                                                    </VpCol>
                                                </VpRow >
                                                <VpRow style={{ marginTop: 5 }} >
                                                    <VpCol span={24} className="text-left">
                                                        <div id="notifierDiv" className="notifierDiv" >
                                                            <VpRow style={{ marginTop: 3 }} >
                                                                <VpCol span={24} className="padding5" >
                                                                    {
                                                                        this.state.notifierArr.length > 0
                                                                            ?
                                                                            <VpCheckbox options={this.state.notifierArr} defaultValue={this.state.notifierSelectedArr} onChange={this.onChange} />
                                                                            : ""
                                                                    }
                                                                </VpCol>
                                                            </VpRow >
                                                        </div>
                                                    </VpCol>
                                                </VpRow >
                                            </VpCol>
                                        </VpRow >
                                        <VpRow style={{ marginTop: 20 }} >
                                            <VpCol span={3} className="text-center p-lr-sm"><h4>备注:</h4></VpCol>
                                            <VpCol span={20}>
                                                <VpInput id='remark' type="textarea" rows={5} />
                                            </VpCol>
                                        </VpRow >
                                    </VpForm>
                                </div>
                            </div>
                            : ''
                    }
                </VpModal>
                <VpModal
                    title='干预对象选择'
                    visible={this.state.showSearch}
                    onOk={() => this.cancelSearchModal()}
                    onCancel={() => this.cancelSearchModal()}
                    width={'60%'}
                    height={'100%'}
                    maskClosable={false}
                    footer={null}
                    wrapClassName='modal-no-footer'
                >
                    {
                        this.state.showSearch
                            ?
                            <VpDynamicForm
                                ref={(node) => this.dynamic = node}
                                bindThis={this}
                                className="p-sm full-height scroll p-b-xxlg"
                                formData={this.state.increaseData}
                                handleOk={(value) => this.okSearchModal(value)}
                                handleCancel={this.cancelSearchModal}
                                okText="查 询" />
                            : ''
                    }
                </VpModal>
                <VpModal
                    title='选择用户'
                    visible={this.state.updateCharer}
                    width={'70%'}
                    footer={null}
                    wrapClassName='modal-no-footer'
                    onCancel={() => this.cancelChoosen()}
                >
                    {
                        this.state.updateCharer ?
                            <ChooseEntity
                                item={{ irelationentityid: '2', widget_type: this.state.chosenType }}
                                initValue={[]}
                                params={{}}
                                onCancel={() => this.cancelChoosen()}
                                onOk={(selectItem) => this.submitChoosen(selectItem)}
                            />
                            : ''
                    }
                </VpModal>
            </div>
        );
    }
}

export default WorkInterfer = VpFormCreate(WorkInterfer);