import React, { Component } from 'react';
import {
    VpRow,
    VpCol,
    VpFormCreate,
    VpMenu,
    VpMenuItem,
    VpSubMenu,
    VpIconFont,
    VpTooltip,
    VpIcon, VpModal,
    vpQuery, VpPopconfirm, VpAlertMsg, VpTable, vpAdd, VpButton, VpDropdown, VpMSuccess
} from 'vpreact';
import {
    SeachInput,
    QuickCreate,
    RightBox,
    VpDynamicForm
} from 'vpbusiness';
import './index.less';
import { requireFile } from 'utils/utils';
import VpHandleForm from './handleForm'
const DynamicTabs = requireFile("vfm/DynamicTabs/dynamictabs");
import { formDataToWidgetProps } from "../../templates/dynamic/Form/Widgets";
import Form from '../../templates/dynamic/Form/Form';

class myworkitem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filtervalue: '',
            quickvalue: '',
            filterData: [],
            tab: '1',
            current: '324',
            openKeys: ['sub1'],
            shrinkShow: true,
            currentkey: 'sub1',
            filters: [],
            showRightBox: false,
            table_headers: [],
            table_array: [],
            varilist: [],
            cur_page: 1,
            num_perpage: 10, //每页记录数
            pagination: {},
            formdata: [],
            visible: false,
            showlist: false,
            modaltitle: '',
            selectiid: '',
            selectItem: [],
            selectedRowKeys: [],
            iflagValue: 0,
            snameValue: '',
            surlValue: '',
            siconValue: '',
            functionList: [],
            selectRowArr: [],
            iflagArr: [],
            startMsg: '',
            navTitle: '',
            isSysEnable: '',
            showTabsRightBox: false,
        }
        this.tableChange = this.tableChange.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getData = this.getData.bind(this);
        this.okModal = this.okModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        //this.onExpand = this.onExpand.bind(this);
        //this.toolBarClick = this.toolBarClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }
    componentWillMount() {
        this.queryFilter();
    }
    componentDidMount() {

    }

    queryFilter = () => {
        return vpQuery('/{vpplat}/workbench/getiremaintypes', {
        }).then((response) => {
            if (response.data != null) {
                let data = response.data
                //屏蔽 缺陷和用例
                let filterData = []
                data.map((item,index)=>{
                    if(item.iid!=326 && item.iid!=327){
                        filterData.push(item)
                    }
                })
                this.setState({
                    filterData: filterData,
                    current: data[0].iid
                },()=>{
                    this.getHeader();
                })
            }
        })
    }

    filterChange = (e) => {
        this.setState({
            filtervalue: e.target.value
        })
    }

    // 搜索框确定事件
    handlesearch = (value) => {
        const searchVal = value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal
        })
    }

    tabsChange = (tab) => {
        this.setState({
            tab
        }, () => {
            this.queryFilter()
        })
    }

    shrinkLeft = (e) => {
        this.setState({
            shrinkShow: !this.state.shrinkShow
        }, () => {
            console.log(this.state.shrinkShow)
        })
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
            openKeys: e.keyPath.slice(1),
            currentkey: e.keyPath.slice(1)[0]
        }, () => {
            this.getData();
        });
    }

    handleClickMenu = (currentkey1) => {
        this.setState({
            currentkey: currentkey1
        });
    }

    onToggle = (info) => {
        this.setState({
            openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
        });
    }

    toolBarAddClick = () => {
        this.setState({ visible: true });
    }

    cancelModal = () => {
        this.setState({
            visible: false
        })
    }

    okModal = () => {
        this.table.getTableData()
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

    //获取表头数据
    getHeader = () => {
        let headers = [
            { title: '实体名称', dataIndex: 'entityname', key: 'entityname', width: 100 },
            { title: '编号', dataIndex: 'objscode', key: 'objscode', width: 200 },
            { title: '名称', dataIndex: 'title', key: 'title', width: 200 },
            { title: '状态', dataIndex: 'statusname', key: 'statusname', width: 150 },
            { title: '处理人', dataIndex: 'assignname', key: 'assignname', width: 150 },
            { title: '到达时间', dataIndex: 'statetime', key: 'statetime', width: 200 }
        ];
        headers.push({
            title: '操作',
            fixed: 'right',
            width: 220,
            key: 'operation',
            render: (text, record, index) => {
                let menu1 = (
                    <VpMenu key={'vpm' + index} onClick={this.handleStatus}>
                        {record.varilist != null ?
                            record.varilist.map((item1, index1) => {
                                return (<VpMenuItem key={item1.iid} ientityid={record.ientityid} objectid={record.objectid}>{item1.sname}</VpMenuItem>)
                            })
                            : null
                        }
                    </VpMenu>
                )
                return (
                    <span onClick={(e) => e.stopPropagation()}>
                        <VpTooltip placement="top" title="处理">
                            <VpIcon className="cursor text-primary m-lr-xs" type="retweet" onClick={(e) => this.WorkItemonClick(record)} />
                        </VpTooltip>
                        {
                            // record.endTime != null ? "" :
                            //     <VpTooltip placement="top" title={record.varilist != null && record.varilist.length > 0 ? '处理' : '无操作'}>
                            //         <VpDropdown overlay={menu1} trigger={['click']}
                            //             getPopupContainer={() => document.body}>
                            //             <VpIcon type="vpicon-stop" className="cursor text-primary m-lr-xs" />
                            //         </VpDropdown>
                            //     </VpTooltip>
                        }
                    </span>
                )
            }



        })
        this.setState({
            table_headers: headers
        }, () => {
            this.getData()
        })
    }
    // 获取表格数据
    getData = () => {
        const _this = this
        vpQuery('/{vpplat}/workbench/myworktemspage',
            {
                curr: this.state.cur_page,
                limit: this.state.num_perpage,
                currentkey: this.state.currentkey,
                filtervalue: this.state.current,
            }
        ).then(function (res) {
            const data = res.data
            let showTotal = () => {
                return '共' + data.totalRows + '条'
            }
            let theight = vp.computedHeight(data.resultList.length, '.myworkitemtable')
            if (data.resultList.length) {
                theight = theight - 50
            }
            _this.setState({
                tableHeight: theight,
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
        
    }
    WorkItemonClick = (record) => {
        this.setState({
            showTabsRightBox: true,
            tabsentityid: record.ientityid,
            tabsiid: record.objectid
        })
    }
    addTabsDom = () => {
        let entityid = this.state.tabsentityid
        let iid = this.state.tabsiid
        if (entityid == 114) {
            return (
                <VpHandleForm
                    entityid={entityid}
                    iid={iid}
                    closeRightModal={() => this.closeTabsRightModal()}
                />
            )
        } else {
            return (
                <DynamicTabs
                    param={{
                        entityid: entityid,
                        iid: iid,
                        type: false,
                        viewtype: '',
                        entitytype: false,
                        defaultActiveKey: ''
                    }}
                    closeRightModal={() => this.closeTabsRightModal()}
                    refreshList={() => { }}
                />
            )
        }
    }

    // 关闭右侧弹出    
    closeTabsRightModal = () => {
        this.setState({
            showTabsRightBox: false,
            selectedRowKeys: []
        }, () => {
            this.getData()
        })
    }


    //点击当前行选中
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
        this.setState({ selectedRowKeys });
    }

    handleSelectAll(selected, selectedRows, changeRows) {
        this.setState({
            selectItem: selectedRows
        })
    }

    onExpand(expanded, record) {

    }

    cancelListModal = () => {
        this.setState({
            showlist: false
        })
    }

    /**
      * 通知信息,任务完成时
      */
    messageInfo = () => {
        const modal = VpMSuccess({
            title: '提醒',
            content: '请先进行该任务或下属子任务的报工 或 确认该任务或下属子任务的报工已经提交！'
        });
        // setTimeout(() => modal.destroy(),1000);
    }

    //状态变迁
    handleStatus = (e) => {
        let entityid = e.item.props.ientityid;
        let objectid = e.item.props.objectid;
        let variid = e.key;
        let sflag = false;
        let url='/{vpplat}/vfrm/entity/varilsForm';
        if(entityid==15){
            url='/{bjyh}/riskRest/varilsForm';
        }
        //获取变迁表单
        vpAdd(url, {
            sflag: sflag,
            entityid: entityid,
            iid: objectid,
            variid:variid
        }).then((response) => {
            let varilsForm = formDataToWidgetProps(response.data);
            let iassigntoData = varilsForm.findWidgetByName("iassignto");
            if (iassigntoData && iassigntoData.field) {
                iassigntoData.field.fieldProps.rules = [{
                    required: true, message: "下一步处理人不能为空"
                }];
            }
            this.setState({
                varivisible: true,
                varilsForm: varilsForm,
                variid: variid,
                ientityid: entityid,
                objectid: objectid,
                sflag: sflag,
                iassignto: response.data.iassignto
            })
        })
    }


    //状态变迁提交按钮
    handleStatusSubmit(values) {
        if (this.state.sflag == 2) {
            values.iassignto = this.state.iassignto
        }
        let iassignto = values.iassignto
        let ivarifield = this.state.variid
        if (ivarifield == '') {
            VpAlertMsg({
                message: "消息提示",
                description: '操作不能为空!',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            return;
        }

        if (iassignto > 0 || this.state.sflag == 2) {
            let val = { ...values }
            val.entityid = this.state.ientityid
            val.variid = ivarifield
            val.iid = this.state.objectid
            let param = {};
            param.param = JSON.stringify(val);
            this.saveRowData(param, false)
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: '下一步处理人不能为空!',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
        }
    }
    onRowClick = (record) => {
        this.setState({
            showTabsRightBox: true,
            tabsentityid: record.ientityid,
            tabsiid: record.objectid
        })
    }
    saveRowData = (value, btn) => {
        const _this = this
        vpAdd('/{vpplat}/vfrm/entity/savestatus', {
            ...value
        }).then(function (data) {
            let param =JSON.parse(value.param) 
            if(param.variid == 197 ){//任务审批通过时的变迁动作，审批中--进行中，变迁名：审批通过
                //审批通过时的工时与基准工时同步
                vpAdd('/{bjyh}/devUtil/taskPass',{objectid:param.iid }).then((response)=>{
    
                })
            }
            VpAlertMsg({
                message: "消息提示",
                description: '操作成功！',
                type: "success",
                closeText: "关闭",
                showIcon: true
            }, 5);
            _this.cancelModal();
            _this.getData();

        }).catch(function (err) {
            _this.setState({
                loading: false
            })
        });
    }
    //关闭变迁状态弹出的模态框
    cancelModal = () => {
        this.setState({
            varivisible: false,
            varilsForm: {},
            selectedRowKeys: []
        }, () => {
            this.getData()
        })
    }

    render() {
        let { selectedRowKeys } = this.state
        const rowSelection = null
        const clearMsg = '确认处理所选记录?'
        let { taskWork } = this.state
        return (
            <div className="business-container pr full-height myworkitem">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                </div>

                <div className="business-wrapper p-t-sm full-height">
                    <div className="bg-white p-sm full-height">
                        <VpRow gutter={16} className="full-height">
                            <VpCol span={this.state.shrinkShow ? '4' : '0'} className="full-height pr menuleft">
                                <VpMenu className="full-height" onClick={this.handleClick}
                                    openKeys={this.state.openKeys}
                                    onOpen={this.onToggle}
                                    onClose={this.onToggle}
                                    selectedKeys={[this.state.current]}
                                    mode="inline">
                                    <VpSubMenu key="sub1" title={<span><VpIconFont type="vpicon-clock" className="m-r-xs" /><span>分配我</span></span>}>
                                        {
                                            this.state.filterData.map((item, index) => {
                                                return <VpMenuItem key={item.iid}>{item.stext}</VpMenuItem>
                                            })
                                        }
                                    </VpSubMenu>
                                    <VpSubMenu key="sub2" title={<span><VpIconFont type="vpicon-check-circle-o" className="m-r-xs" /><span>我负责</span></span>}>
                                        {
                                            this.state.filterData.map((item, index) => {
                                                return <VpMenuItem key={item.iid}>{item.stext}</VpMenuItem>
                                            })
                                        }
                                    </VpSubMenu>
                                    <VpSubMenu key="sub3" title={<span><VpIconFont type="vpicon-clock" className="m-r-xs" /><span>我创建</span></span>}>
                                        {
                                            this.state.filterData.map((item, index) => {
                                                return <VpMenuItem key={item.iid}>{item.stext}</VpMenuItem>
                                            })
                                        }
                                    </VpSubMenu>
                                    <VpSubMenu key="sub4" title={<span><VpIconFont type="vpicon-users" className="m-r-xs" /><span>我关注</span></span>}>
                                        {
                                            this.state.filterData.map((item, index) => {
                                                return <VpMenuItem key={item.iid}>{item.stext}</VpMenuItem>
                                            })
                                        }
                                    </VpSubMenu>
                                </VpMenu>
                                {this.state.shrinkShow ?
                                    <div className="navswitch cursor text-center" onClick={this.shrinkLeft}>
                                        <VpIconFont type="vpicon-navclose" />
                                    </div>
                                    :
                                    ''
                                }
                            </VpCol>
                            <VpCol span={this.state.shrinkShow ? '20' : '24'} className="full-height">
                                {this.state.shrinkShow ?
                                    ''
                                    :
                                    <div className="shrink p-tb-sm cursor text-center" onClick={this.shrinkLeft}>
                                        <VpIconFont type="vpicon-navopen" />
                                    </div>
                                }
                                {
                                    <div className="business-wrapper p-t-sm full-height">
                                        <div className="p-sm bg-white" >
                                            <VpTable
                                                className="myworkitemtable"
                                                onExpand={this.onExpand}
                                                columns={this.state.table_headers}
                                                dataSource={this.state.table_array}
                                                onChange={this.tableChange}
                                                pagination={this.state.pagination}
                                                rowKey={record => record.iid}
                                                scroll={{ y: this.state.tableHeight }}
                                                onRowClick={this.onRowClick}
                                                resize
                                            />
                                        </div>
                                    </div>
                                }
                            </VpCol>
                        </VpRow>
                    </div>
                </div>
                <VpModal
                    title='状态变迁'
                    visible={this.state.varivisible}
                    onCancel={() => this.cancelModal()}
                    width={'70%'}
                    footer={null}
                    wrapClassName='modal-no-footer'
                >
                    {this.state.varivisible ?
                        <Form
                            className="p-sm full-height scroll p-b-xxlg"
                            formData={this.state.varilsForm}
                            handleOk={(values) => this.handleStatusSubmit(values)}
                            okText="提 交"
                            iid={this.props.row_id}
                            taskWork={taskWork}
                            loading={this.state.loading}
                            handleCancel={() => this.cancelModal()} />
                        : null
                    }
                </VpModal>
                <RightBox
                    max={true}
                    button={
                        <div className="icon p-xs" onClick={this.closeTabsRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showTabsRightBox}>
                    {this.state.showTabsRightBox ?
                        this.addTabsDom()
                        :
                        null}
                </RightBox>
            </div >
        )
    }
}


export default myworkitem = VpFormCreate(myworkitem);;
