import React, { Component } from 'react'
import {
    vpQuery,
    vpDownLoad,
    vpAdd,
    VpIframe,
    VpAlertMsg,
    VpTable,
    VpIcon,
    VpTooltip,
    VpTabs,
    VpModal,
    VpTabPane,
    VpButton,
    VpRow,
    VpCol,
    VpFormCreate,
    VpIconFont,VpPopconfirm
} from 'vpreact';
import { RightBox, VpDynamicForm } from 'vpbusiness';
import { requireFile } from 'utils/utils';
import './wbs.less';

//列表字段
function getTaskHeader() {
    var header = [
        {
            title: '名称',
            dataIndex: 'sname',
            key: 'sname',
            width: '200px',
            fixed: ''
        },
        {
            title: '编号',
            dataIndex: 'scode',
            key: 'scode',
            width: '100px',
            fixed: ''
        },
        {
            title: '开始时间',
            dataIndex: 'dstartdate',
            key: 'dstartdate',
            width: '100px',
            fixed: ''
        },
        {
            title: '结束时间',
            dataIndex: 'denddate',
            key: 'denddate',
            width: '100px',
            fixed: ''
        },
        {
            title: '描述',
            dataIndex: 'sdescription',
            key: 'sdescription',
            width: '200px',
            fixed: ''
        }
    ];

    return header;
}

function validateDate(value, key) {
    let result = {};
    result.flag = true;
    let start = "";
    let end = "";
    if (value[key] != null && value[key] != '') {
        end = value[key];
        if (key == 'dforecastenddate') {
            start = value.dforecaststartdate;
            if (start > end) {
                result.flag = false;
                result.msg = '预测开始时间不能大于预测结束时间！';
            }
        } else if (key == 'dplanenddate') {
            start = value.dplanstartdate;
            if (start > end) {
                result.flag = false;
                result.msg = '计划开始时间不能大于计划结束时间！';
            }
        } else if (key == 'dactualenddate') {
            start = value.dactualstartdate;
            if (start > end) {
                result.flag = false;
                result.msg = '实际开始时间不能大于实际结束时间！';
            }
        }
    }

    return result;
}

class wbs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [],
            visible2: false,
            targetKeys: [],
            showRightBox: false,
            showTaskRightBox: false,
            widget_show_none: '',
            widget_show_none_tool: '',
            filter_data: [],
            table_headers: [],
            table_array: [],
            tableTaskHeader: [],
            tableTaskData: [],
            cur_page: 1,
            page: 1,
            pagination: {},
            filtervalue: '', //过滤器值
            limit: 50, //每页记录数
            quickvalue: '', //快速搜索内容
            sortfield: '', //排序列key
            sorttype: '', //排序方式
            multipleData: [], //多条件搜索数据
            activeKey: '1',
            increaseData: [], // 新增动态数据
            tabs_array: [],
            tabs: null,
            filterDropdownVisible: false,
            isAdd: false,
            formSearch_data: [],
            form_data: [],
            formdata: [],
            iids: '',
            row_id: '',
            entityiid: '',
            add: true,
            visible: false,
            modaltitle: '',
            searchVal: '',//快速搜索
            wbsiid: '',
            entityrole: false,
            newFlag: false,
            wbsvisible: false,
            wbsChildrenVisible: false,
            expandedRowKeys: [],
            selectedRowKeys: [],
            selectItems: [],
            selectrecord: {},
            mainentityid: '',
            tableHeight: '',
            isShowTask: false,
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);

        this.handlesearch = this.handlesearch.bind(this);
        this.tableChange = this.tableChange.bind(this);
        this.filterChange = this.filterChange.bind(this);
        this.saveRowData = this.saveRowData.bind(this);
        this.tabsChange = this.tabsChange.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.queryFormData = this.queryFormData.bind(this);
        this.getData = this.getData.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.confirm = this.confirm.bind(this);
        this.okModal = this.okModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.menuClick = this.menuClick.bind(this);
        this.toolBarClick = this.toolBarClick.bind(this);
        this.closeRightModal = this.closeRightModal.bind(this);
        this.getTaskList = this.getTaskList.bind(this);
        this.closeTaskRightModal = this.closeTaskRightModal.bind(this);
    }

    componentWillMount() {
        this.setState({
            entityid: this.props.entityid,
            iid: this.props.iid,//项目iid
        }, () => {
            this.getHeader()
            this.getData()
        })
        this.tabs = {}
        this.tabs.WorkFlow = requireFile('vfm/WorkFlow/workflow')
        //this.tabs.WorkFlow = requireFile('bjyh/templates/Flow/FlowListTab')
        this.tabs.RelationList = requireFile('vfm/Team/relationList')
        this.tabs.DocumentList = requireFile('vfm/Document/documentList')
        this.tabs.DiscussList = requireFile('vfm/Discuss/index')
        //this.tabs.Dynamic = requireFile('bjyh/xmcq/xmcqFlowForm')
        this.tabs.Dynamic = requireFile('vfm/DynamicForm/dynamic')
    }

    componentDidMount() {
        parent.window.appdoclist = this
        let tHeight = $(window).height() - 265 // 这里的255是指表格最大高度之外的距离（主要是距离顶部和底部）
        $(".pjwbstable").find(".ant-table-body").height(tHeight)
        this.setState({
            tableHeight: tHeight
        })
    }

    //查询实体权限
    queryentityRole = (entityid, iid) => {
        let _this = this
        if (this.props.isflow) {
            _this.setState({
                entityrole: _this.props.entityrole
            })
        } else {
            vpQuery('/{vpplat}/vfrm/entity/entityRole', {
                entityid, iid
            }).then((response) => {
                let role = _this.props.entityrole
                if (role) {
                    role = response.data.entityRole
                }

                _this.setState({
                    entityrole: role
                })
            })
        }
    }

    //获取表头数据
    getHeader() {
        let _this = this;

        vpQuery('/{vpplat}/vfrm/entity/getheaders', {
            entityid: 10, scode: 'list'
        }).then(function (data) {
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
                                    if (key == 'iwidth') {
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
                                            fixed: _fixed,
                                            width: _field_width,
                                        });
                                    }
                                }
                            })

                            const tips = (
                                <div>
                                    <VpTooltip title="进度"><VpIconFont type="vpicon-tip" className="m-r-xs text-success" /></VpTooltip>
                                    <VpTooltip title="状态"><VpIconFont type="vpicon-check" className="m-r-xs text-success" /></VpTooltip>
                                    <VpTooltip title="评论"><VpIconFont type="vpicon-pinglun" className="m-r-xs text-success" /></VpTooltip>
                                    <VpTooltip title="文档"><VpIconFont type="vpicon-wenben" className="m-r-xs text-success" /></VpTooltip>
                                    <VpTooltip title="任务"><VpIconFont type="vpicon-yewu-o" className="m-r-xs text-success" /></VpTooltip>
                                </div>
                            )
                            //指示灯类型
                            const indiclass = ['bg-success', 'bg-warning', 'bg-danger', 'bg-success']
                            const image = ['vpicon-tip', 'vpicon-check-circle-m text-success', 'vpicon-pinglun text-success', 'vpicon-wenben text-success', 'vpicon-yewu-o text-success']
                            const empty = '../vpstatic/images/empty.gif'
                            const title = ['进度', '已完成', '评论', '文档', '任务']
                            const emptytitle = ['进度正常', '未开始', '无评论', '无文档', '无任务']
                            const columns = {
                                title: tips, width: 120, dataIndex: 'indicator', key: 'indicator',
                                render: (value, record) => {//value 0_0_0_0_0:未开始、进度正常、无评论、无文档
                                    return (
                                        <div className="indic-wrapper">
                                            {
                                                value
                                                    ?
                                                    value.split("_").map((item, i) => {
                                                        if (i == 0) {//进度
                                                            if (parseInt(item) > 0 && (parseInt(item) < 4)) {
                                                                return <span key={'indicator' + record.iid} >
                                                                    <VpTooltip title={title[i]}>
                                                                        <VpIconFont key={'icon' + record.iid + '_' + item} type={indiclass[item]} />
                                                                    </VpTooltip>
                                                                </span>
                                                            } else if (parseInt(item) > 3) {
                                                                return <span key={'indicator' + record.iid} >
                                                                    <VpTooltip title={emptytitle[i]}>
                                                                        <VpIconFont key={'icon' + record.iid + '_3'} type={indiclass[3]} />
                                                                    </VpTooltip>
                                                                </span>
                                                            } else {
                                                                return <span key={'indicator' + record.iid} >
                                                                    <VpTooltip title={emptytitle[i]}>
                                                                        <VpIconFont key={'icon' + record.iid + '_0'} type={indiclass[0]} />
                                                                    </VpTooltip>
                                                                </span>
                                                            }
                                                        } else {
                                                            if (item == '0') {
                                                                return <span key={i} style={{ margin: "0 2px" }}>
                                                                    <VpTooltip title={emptytitle[i]} >
                                                                        <img src={empty} />
                                                                    </VpTooltip>
                                                                </span>
                                                            } else {
                                                                return <span key={i} style={{ margin: "0 2px" }}>
                                                                    <VpTooltip title={title[i]}  >
                                                                        {<VpIconFont type={image[i]} />}
                                                                    </VpTooltip>
                                                                </span>
                                                            }
                                                        }
                                                    })
                                                    :
                                                    <div>
                                                        <span key={0} style={{ margin: "0 0px" }}>
                                                            <VpTooltip title={emptytitle[0]} >
                                                                <VpIconFont key={'icon' + record.iid + '_0'} type={empty[0]} />
                                                            </VpTooltip>
                                                        </span>
                                                        <span key={1} style={{ margin: "0 2px" }}>
                                                            <VpTooltip title={emptytitle[1]}>
                                                                <img src={empty} />
                                                            </VpTooltip>
                                                        </span>
                                                        <span key={2} style={{ margin: "0 2px" }}>
                                                            <VpTooltip title={emptytitle[2]} >
                                                                <img src={empty} />
                                                            </VpTooltip>
                                                        </span>
                                                        <span key={3} style={{ margin: "0 2px" }}>
                                                            <VpTooltip title={emptytitle[3]} >
                                                                <img src={empty} />
                                                            </VpTooltip>
                                                        </span>
                                                        <span key={4} style={{ margin: "0 2px" }}>
                                                            <VpTooltip title={emptytitle[4]} >
                                                                <img src={empty} />
                                                            </VpTooltip>
                                                        </span>
                                                    </div>
                                            }
                                        </div>
                                    )
                                }
                            }
                            const optcolumn = {
                                title: '操作', width: 120, fixed: 'right', key: 'operation', render: (text, record) => {
                                    let iclassid = record.iclassidval
                                    return (
                                        <span>
                                            {_this.props.entityrole ?
                                                <div style={{ textAlign: 'left' }} className="cursor" data-id={record.iid} data-sname={record.sname} className="optmenu" >
                                                    <VpTooltip placement="top" title="批量操作">
                                                        <VpIcon data-id={record.id} onClick={(e, record) => {
                                                            e.stopPropagation()
                                                            _this.handleModal(e, record)
                                                        }}
                                                            style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }} type="edit" />
                                                    </VpTooltip>
                                                    {(record.iid != '0' && record.pid != '') ?
                                                        <VpTooltip placement="top" title="查看">
                                                            <VpIconFont onClick={(e) => {
                                                                e.stopPropagation();
                                                                _this.loadAttribute(record.ientityid, record.iid, record.children == undefined, record.pid != '')
                                                            }}
                                                                style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }}
                                                                className="cursor m-lr-xs" type="vpicon-see-o" />
                                                        </VpTooltip>
                                                        :
                                                        ''
                                                    }
                                                    {(record.children == undefined && record.pid != '') ?
                                                        <VpTooltip placement="top" title="关联任务活动">
                                                            <VpIconFont onClick={(e) => { e.stopPropagation(); _this.wbsMatchTask(record.ientityid, record.iid) }} className="cursor m-lr-xs"
                                                                style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }}
                                                                type="vpicon-implement" />
                                                        </VpTooltip>
                                                        :
                                                        ''
                                                    }
                                                </div> : ''
                                            }
                                        </span>
                                    )
                                }
                            }
                            let hh = [columns]
                            let namecol = _header.filter(item => item.dataIndex == 'sname')
                            namecol.map(item => { item.width = 280; hh.push(item) })
                            _header.map((item, index) => {
                                let sname = item.dataIndex
                                if (sname != 'sname') {
                                    hh.push(item)
                                }
                            })
                            _this.props.entityrole ? hh.push(optcolumn) : ''
                            _this.setState({ table_headers: hh })
                        }
                    }
                }
            }
        }).catch(function (err) {
            console.log(err);
        });

        //获取导航数据
        vpQuery('/{vpplat}/vfrm/entity/getConfig', {
            entityid: 10
        }).then(function (data) {
            if (data.hasOwnProperty('data')) {
                if (data.data.hasOwnProperty('search')) {
                    _this.setState({
                        widget_show_none: data.data.search,
                        filters: data.data.search.filters,
                        entityrole: data.data.entityrole
                    });

                }
                if (data.data.hasOwnProperty('toolbar')) {
                    _this.setState({ widget_show_none_tool: data.data.toolbar });
                    if (data.data.toolbar.hasOwnProperty('formSearch')) {
                        if (data.data.toolbar.formSearch.hasOwnProperty('form')) {
                            if (data.data.toolbar.formSearch.form.hasOwnProperty('groups')) {
                                if (data.data.toolbar.formSearch.form.groups[0].hasOwnProperty('fields')) {
                                    data.data.toolbar.formSearch.form.groups[0].fields[0].field_name = 'form_sname';
                                    _this.setState({ formSearch_data: data.data.toolbar.formSearch.form.groups[0].fields });
                                }
                            }
                        }
                    }
                    if (data.data.toolbar.hasOwnProperty('tabs')) {
                        _this.setState({ tabs: data.data.toolbar.tabs });
                    }
                }
            }
        })
    }

    // 获取表格数据
    getData() {
        const { iid, entityid, searchVal
        } = this.state;
        vpAdd('/{vpmprovider}/vpmwbs/wbsTreeData', {
            entityid: 10,//关联关系实体ID
            ientityid: entityid,
            quickSearch: searchVal,
            iid: iid,
            viewtype: 'tree'   //主实体的当前行数据ID
        }).then((response) => {
            const { data } = response
            let showTotal = () => {
                return '共' + data.totalRows + '条'
            }
            this.setState({
                table_array: data.resultList,
                cur_page: data.currentPage,
                total_rows: data.totalRows,
                num_perpage: data.numPerPage,
                pagination: {
                    showTotal: showTotal,
                    pageSize: data.numPerPage,
                    showSizeChanger: false,
                    showQuickJumper: false,
                }
            })

            let expandArr = this.getExpandedRowa(data.resultList, [])
            //设置展开行
            this.setState({
                expandedRowKeys: expandArr
            })
        }).catch((e) => {
            if (!(typeof e == 'function')) {
                console.log('Error:' + e)
            } else {
                e();
            }
        })
    }

    // 展开行
    getExpandedRowa(srcArr, resArr) {
        const _this = this
        let expandArr = resArr
        if (srcArr.length) {
            let tmpArr = []
            srcArr.map((item) => {
                expandArr.push(item.iid)
                if (item.hasOwnProperty('children')) {
                    tmpArr = _this.getExpandedRowa(item.children, expandArr)
                    tmpArr.map((tmpid) => {
                        const idx = expandArr.findIndex((iid) => tmpid === iid)
                        if (idx == -1) {
                            expandArr.push(tmpid)
                        }
                    })
                }
            })
        }
        return expandArr
    }

    // 获取行详情
    getRowData(id) {
        vpQuery('/{vpplat}/cfgent/getdata', { id }).then((response) => {
        })
    }

    handleModal = (e, record) => {
        e.stopPropagation();
        let wbsTaskID = $(e.target).closest('.optmenu').attr('data-id');
        let wbsTaskName = $(e.target).closest('.optmenu').attr('data-sname');
        wbsTaskName = encodeURI(wbsTaskName)
        const _this = this
        let righturl = ""
        let title = 'WBS计划'
        if (wbsTaskID == 0) {
            righturl = getPagePath() + "/vpm/wbs/ganttEdit-new.html?rwFlag=2&relentityId=" + _this.state.entityid + "&projectID=" + _this.state.iid + "&projectName=" + wbsTaskName;
        } else {
            righturl = getPagePath() + "/vpm/wbs/ganttEdit-new.html?rwFlag=2&relentityId=" + _this.state.entityid + "&projectID=" + _this.state.iid + "&projectName=test" + "&wbsObjId=" + wbsTaskID;
        }

        if (righturl != "" && righturl != undefined) {
            //isPhaseRel: false, isIframe: true,
            _this.setState({ rightwbsurl: righturl, rightTitle: title, wbsvisible: true })
        }
    }

    // 搜索框确定事件
    handlesearch(value) {
        const searchVal = value.replace(/\s/g, "");
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

    }

    confirm() {
        const _this = this;
        let sparam = {
            entityid: 9, iid: _this.state.row_id
        }
        vpAdd('/{vpplat}/vfrm/entity/deleteData', sparam

        ).then(function (data) {
            _this.getData();
        })
    }

    //高层计划工具栏按钮点击操作
    toolBarClick(optType) {
        const _this = this
        if (optType == 'make') {
            vpAdd('/{vpmprovider}/vpmphasecopytowbs/phaseCopyToWBS',
                { entityId: _this.state.entityid, projectId: _this.state.iid }
            ).then(function (data) {
                VpAlertMsg({
                    message: "消息提示",
                    description: data.data.msg,
                    type: "success",
                    onClose: _this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                _this.getData()  //刷新数据
            })
        } else if (optType == 'refresh') {
            _this.getData()
        } else if (optType == 'clear') {
            vpAdd('/{vpmprovider}/vpmwbs/delete',
                {
                    entityid: 10,//主实体ID
                    optType: optType,
                    projectId: _this.state.iid
                }
            ).then(function (data) {
                _this.getData()
            })
        } else if (optType == 'export') {
            _this.wbsExport()
        } else if (optType == 'exportMSP') {
            _this.wbsExportMSP()
        } else if (optType == 'compareGantt') {
            _this.openCompareGantt()
        } else if (optType == 'relwbs') {
            _this.openRelWBS()
        } else if (optType == 'mirrorView') {
            _this.openMirrorView()
        }
    }

    //设置选中模板的信息
    setTempInfo = (value) => {
        let _this = this
        let objparam = { templateid: value, scode: 'tempinfo' }
        vpAdd('/{vpmprovider}/vfrm/phase/getSelectOption',
            { sparam: JSON.stringify(objparam) }
        ).then(function (data) {
            let tempCount = data.data.tempCount
            let workCount = data.data.workCount
            let countAnalogy = data.data.countAnalogy
            let tempInfo = data.data.tempInfo
            let dataform = _this.state.increaseData
            let fields = []
            dataform.groups[0].fields.map(function (item) {
                let sname = item.field_name
                if (sname == 'workCount') {
                    if (parseFloat(tempCount) > 0) {
                        item.readonly = false
                    } else {
                        item.readonly = true
                    }
                }
                fields.push(item)
            })
            dataform.groups.fields = fields
            _this.setState({
                increaseData: dataform
            })
            const { setFieldsValue } = _this.dynamic
            setFieldsValue({ 'tempCount': tempCount, 'workCount': workCount, 'countAnalogy': countAnalogy, 'tempInfo': tempInfo })
        })
    }
    //设置总总工作量类比系数
    setAnalogy = (obj) => {
        let value = obj.target.value
        const { setFieldsValue, getFieldValue } = this.dynamic
        let tempCount = getFieldValue('tempCount')
        let countAnalogy = (parseFloat(value) / parseFloat(tempCount)).toFixed(2)
        setFieldsValue({ 'countAnalogy': countAnalogy })
    }
    //WBS计划导出
    wbsExport() {
        const _this = this;
        let filtervalue = ' and a.irelentityid=' + _this.state.entityid + ' and a.iprojectid=' + _this.state.iid
        vpDownLoad('/{vpmprovider}/vpm/wbsfiles/exportexcelfile',
            { ientityid: 10, relentityId: _this.state.entityid, projectId: _this.state.iid, filtervalue: filtervalue, type: 'expdata' }
        )
    }
    //WBS计划MSP文件导出
    wbsExportMSP() {
        const _this = this;
        let filtervalue = ''
        vpDownLoad('/{vpmprovider}/vpm/wbsfiles/exportMSPfile',
            { relentityId: _this.state.entityid, projectId: _this.state.iid, filtervalue: filtervalue }
        )
    }
    //比较甘特图
    openCompareGantt() {
        const _this = this;
        _this.setState({ isIframe: true, rightTitle: '比较甘特图', showRightBox: true }, () => {
            let tabDiv = $('.wbsProjectTab').find('.ant-tabs-tab')
            tabDiv.each((index, item) => {
                if (index == '2') {
                    $(item).click()
                }
            })
        })
    }
    //镜像管理
    openRelWBS() {
        const _this = this;
        _this.setState({ isIframe: true, rightTitle: '镜像管理', showRightBox: true, entityid: _this.state.entityid }, () => {
            let tabDiv = $('.wbsProjectTab').find('.ant-tabs-tab')
            tabDiv.each((index, item) => {
                if (index == '0') {
                    $(item).click()
                }
            })
        })
    }
    //WBS镜像视图
    openMirrorView() {
        const _this = this;
        _this.setState({ isIframe: true, rightTitle: 'WBS镜像视图', showRightBox: true, entityid: _this.state.entityid }, () => {
            let tabDiv = $('.wbsProjectTab').find('.ant-tabs-tab')
            tabDiv.each((index, item) => {
                if (index == '1') {
                    $(item).click()
                }
            })
        })
    }

    //删除数据事件
    handleConfirm(e) {
        e.stopPropagation();
        let row_id = e.target.dataset.id;
        this.setState({ row_id: row_id });
    }

    // 过滤器事件
    filterChange(e) {
        this.setState({
            filtervalue: e.target.value
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

    cancelWBSModal() {
        this.setState({
            wbsvisible: false
        })
    }

    //关闭窗口并刷新数据
    closeWBSModal() {
        this.setState({
            wbsvisible: false
        })
        this.getData()  //刷新数据
    }

    //关闭窗口并重新打开
    openIframeRightWindow() {
        this.setState({
            isIframe: true,
            showRightBox: false
        })

        this.openRelWBS();
    }

    //关闭并打开窗口并刷新数据
    openWBSModal() {
        this.setState({
            wbsvisible: false
        })
        this.setState({
            wbsvisible: true
        })
        this.getData()  //刷新数据
    }

    handleCancel() {
        this.setState({
            showRightBox: false
        })
    }
    handleOk() {
        this.saveRowData(this.props.form.getFieldsValue());
    }

    tabsChange(tabs) {
        /*  const tab = this.state.tabs_array[tabs];
         let currtabs;
         if (tab.type) {
             currtabs = require('../../' + tab.url + '.jsx').default;
             this.setState({
                 tabs: currtabs
             })
         } */
    }

    onExpand(expanded, record) {
        //console.log("wbs onExpand: " + expanded, record)
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

    // 保存表单
    saveRowData(value, statusid) {
        const _this = this;
        for (const key in value) {
            if (value[key] == undefined) {
                value[key] = ''
            } else if (value[key] == null) {
                value[key] = 0
            } else if (value[key] instanceof Date) {
                value[key] = formatDateTime(value[key])
            }
            if (key == 'dforecastenddate' || key == 'dplanenddate' || key == 'dactualenddate') {
                let result = validateDate(value, key)
                if (!result.flag) {
                    VpAlertMsg({
                        message: "消息提示",
                        description: result.msg,
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5)
                    success = false
                }
            }
            if (key.indexOf('_label') == -1) {
                vae[key] = value[key]
            }
        }

        let curiid = '';
        if (_this.state.newFlag) {
            curiid = ''
            value['iparent'] = _this.state.wbsiid
            value['iprojectid'] = _this.state.iid
            value['irelentityid'] = _this.state.entityid
        } else {
            curiid = _this.state.wbsiid
        }

        vpAdd('/{vpplat}/vfrm/entity/saveFormData',
            {
                sparam: JSON.stringify(value),
                entityid: 10,//主实体ID
                iid: curiid,//主实体数据ID
            }
        ).then(function (data) {
            _this.setState({
                showRightBox: false,
                increaseData: {}
            }, () => {
                _this.updateTimeInfo(10, data.data.iid)
            })
        }).catch(function (err) {
            _this.setState({
                showRightBox: false,
                increaseData: {}
            }, _this.getData())
        });
    }

    updateTimeInfo(entityid, iid) {
        const _this = this
        let sparam = {
            iid: iid,
            entityid: entityid
        }
        vpAdd('/{vpmprovider}/vpmwbs/saveTaskInfo', sparam).then(function (data) {
            _this.getData()
        })
    }

    //表单字段信息
    queryFormData(iids, iclassid, iparent) {
        const _this = this
        vpQuery('/{vpplat}/vfrm/entity/getform', {
            entityid: 9, iid: iids, iclassid: iclassid, iparent: iparent
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
                } else {
                    // TODO
                }
            }
        }).catch(function (err) {
            console.log(err);
        });
    }

    onRowClick(record, index) {
        if (record.onclick == 'false') {
        } else {
            const _this = this
            if (_this.props.entityrole) {
                let iid = record.iid
                _this.setState({
                    title: 'WBS属性',
                    showRightBox: true,
                    isShowTask: record.children == undefined,
                    wbsiid: iid,
                })
            }
        }

    }

    menuClick(a, b, c) {
        let key = a.key
        if (key == 'newPhase' || key == 'newact' || key == 'newlcb' || key == 'newjfw') {
            let iclassid = "0"
            if (key == 'newPhase') {
                iclassid = "91"
            } else if (key == 'newact') {
                iclassid = "92"
            } else if (key == 'newlcb') {
                iclassid = "93"
            } else if (key == 'newjfw') {
                iclassid = "94"
            }
            this.setState({
                increaseData: {},
                newFlag: true, isPhaseRel: false,
                isIframe: false, showRightBox: true
            })
            this.queryFormData('', iclassid, this.state.wbsiid);
        } else if (key == 'setCurPhase' || key == 'up' || key == 'down') {
            const _this = this;
            let curiid = _this.state.wbsiid
            let value = { optType: key, iprojectid: _this.state.iid }
            vpAdd('/{vpmprovider}/vfrm/phase/optMenu',
                {
                    sparam: JSON.stringify(value),
                    entityid: 9,//主实体ID
                    iid: curiid,//主实体数据ID
                }
            ).then(function (data) {
                _this.setState({
                    visible: false
                }, _this.getData())
            })
        } else if (key == 'delete') {
            const _this = this;
            let sparam = {
                entityid: 9, iid: _this.state.wbsiid
            }
            vpAdd('/{vpplat}/vfrm/entity/deleteData', sparam

            ).then(function (data) {
                _this.getData();
            })
        } else if (key == 'doc') {
            const _this = this
            let righturl = getPagePath() + "/vpm/wbs/ganttEdit-new.html?rwFlag=2&relentityId=" + _this.state.entityid + "&projectID=" + _this.state.iid + "&projectName=李瑞测试"
            let title = 'WBS计划'

            _this.setState({ righturl: righturl, isPhaseRel: false, isIframe: true, rightTitle: title, wbsvisible: true })
        }
    }


    loadAttribute = (entityid, wbsId, children, ispidempty) => {
        const _this = this;

        _this.setState({
            title: 'WBS属性',
            showRightBox: true,
            isShowTask: children && ispidempty,
            wbsiid: wbsId,
        })
    }

    loadRightWindow() {
        let WorkFlow = this.tabs.WorkFlow
        let DocumentList = this.tabs.DocumentList
        let RelationList = this.tabs.RelationList
        let DiscussList = this.tabs.DiscussList
        let Dynamic = this.tabs.Dynamic
        //整个项目WBS比较甘特图
        let rightProjectMapUrl = getPagePath() + "/vpm/wbs/wbsMap.html?ientityid=" + this.state.entityid + "&projectid=" + this.state.iid
        let rightProjectMapViewUrl = "";
        if (this.state.entityid == 8) {
            rightProjectMapViewUrl = getPagePath() + "/vpm/wbs/wbsMapView.html?ientityid=10" + "&projectId=" + this.state.iid + "&relentityId=8"
        } else {
            rightProjectMapViewUrl = getPagePath() + "/vpm/wbs/wbsMapView.html?ientityid=10" + "&projectId=" + this.state.iid + "&relentityId=7"
        }
        let rightProjectCompareUrl = getPagePath() + "/vpm/wbs/compareGantt.html?ientityid=" + this.state.entityid + "&projectid=" + this.props.iid + "&iparent=0&relentityId=7";

        //WBS节点的比较甘特图
        let rightwbscompareurl = getPagePath() + "/vpm/wbs/compareGantt.html?relentityId=" + this.state.entityid + "&projectid=" + this.props.iid + "&wbsId=" + this.state.wbsiid
        let rightwbsmirrorurl = getPagePath() + "/vpm/wbs/wbsMapView.html?relentityId=" + this.state.entityid + "&ientityid=10&projectId=" + this.props.iid + "&iid=" + this.state.wbsiid

        return (
            this.state.isIframe ?
                this.state.showRightBox ?
                    this.state.entityid == 8 ?
                        <VpTabs destroyInactiveTabPane defaultActiveKey="0" onChange={this.tabsChange} className="wbsProjectTab">
                            <VpTabPane tab="镜像管理" key='0'>
                                <VpIframe url={rightProjectMapUrl} />
                            </VpTabPane>
                            <VpTabPane tab="WBS镜像视图" key='1'>
                                <VpIframe url={rightProjectMapViewUrl} />
                            </VpTabPane>
                        </VpTabs>
                        :
                        <VpTabs destroyInactiveTabPane defaultActiveKey="0" onChange={this.tabsChange} className="wbsProjectTab">
                            <VpTabPane tab="镜像管理" key='0'>
                                <VpIframe url={rightProjectMapUrl} />
                            </VpTabPane>
                            <VpTabPane tab="WBS镜像视图" key='1'>
                                <VpIframe url={rightProjectMapViewUrl} />
                            </VpTabPane>
                            <VpTabPane tab="比较甘特图" key='2'>
                                <VpIframe url={rightProjectCompareUrl} />
                            </VpTabPane>
                        </VpTabs>
                    : ''
                : this.state.isShowTask ?
                    window.vp.config.vpmbuttonvisible.wbsIsShowTab ?
                        <VpTabs destroyInactiveTabPane defaultActiveKey="0" onChange={this.tabsChange} className="wbsTab">
                            <VpTabPane tab='属性' key='0'>
                                <Dynamic
                                    add={false}
                                    entityrole={true}
                                    handleOk={this.saveRowData}
                                    closeRightModal={() => this.closeRightModal()}
                                    refreshList={() => this.getData()}
                                    row_id={this.state.wbsiid}
                                    row_entityid='10'
                                    skey={this.props.skey}
                                    okText="保 存"
                                />
                            </VpTabPane>
                            <VpTabPane tab='关联文档' key='1' >
                                <DocumentList
                                    bindthis={() => { }}
                                    doctype="3"
                                    entityrole={this.props.entityrole}
                                    irelentityid="10"
                                    irelobjectid={this.state.wbsiid}
                                    mainentityid={this.state.entityid}
                                    mainiid={this.state.iid}
                                    fromtabs='wbs'
                                />
                            </VpTabPane>
                            <VpTabPane tab='WBS关联任务活动' key="2">
                                <div className="edit-table-tree full-height bg-white">
                                    <div className="" ref="table">
                                        <RelationList entityid='10' iid={this.state.wbsiid}
                                            stabparam='iwbstaskid' skey="entity114_attr" entityrole={true} />
                                    </div>
                                </div>
                            </VpTabPane>
                            <VpTabPane tab='比较甘特图' key='3' >
                                <VpIframe title='wbs甘特图' url={rightwbscompareurl} />
                            </VpTabPane>
                            <VpTabPane tab='镜像视图' key='4' >
                                <VpIframe title='wbs甘特图' url={rightwbsmirrorurl} />
                            </VpTabPane>
                            <VpTabPane tab='评论' key='5' >
                                <DiscussList entityid="10" entityrole={this.props.entityrole} iid={this.state.wbsiid} />
                            </VpTabPane>
                            <VpTabPane tab='流程管理' key='6'>
                                <WorkFlow entityid={'10'} entityrole={this.props.entityrole} iid={this.state.wbsiid} />
                            </VpTabPane>
                        </VpTabs>
                        :
                        <VpTabs destroyInactiveTabPane defaultActiveKey="0" onChange={this.tabsChange} className="wbsTab">
                            <VpTabPane tab='属性' key='0'>
                                <Dynamic
                                    add={false}
                                    entityrole={true}
                                    handleOk={this.saveRowData}
                                    closeRightModal={() => this.closeRightModal()}
                                    refreshList={() => this.getData()}
                                    row_id={this.state.wbsiid}
                                    row_entityid='10'
                                    skey={this.props.skey}
                                    okText="保 存"
                                />
                            </VpTabPane>
                            <VpTabPane tab='关联文档' key='1' >
                                <DocumentList
                                    bindthis={() => { }}
                                    doctype="3"
                                    entityrole={this.props.entityrole}
                                    irelentityid="10"
                                    irelobjectid={this.state.wbsiid}
                                    mainentityid={this.state.entityid}
                                    mainiid={this.state.iid}
                                    fromtabs='wbs'
                                />
                            </VpTabPane>
                            <VpTabPane tab='WBS关联任务活动' key="2">
                                <div className="edit-table-tree full-height bg-white">
                                    <div className="" ref="table">
                                        <RelationList entityid='10' iid={this.state.wbsiid}
                                            stabparam='iwbstaskid' skey="entity114_attr" entityrole={true} />
                                    </div>
                                </div>
                            </VpTabPane>
                            <VpTabPane tab='评论' key='5' >
                                <DiscussList entityid="10" entityrole={this.props.entityrole} iid={this.state.wbsiid} />
                            </VpTabPane>
                            <VpTabPane tab='流程管理' key='6'>
                                <WorkFlow entityid={'10'} entityrole={this.props.entityrole} iid={this.state.wbsiid} />
                            </VpTabPane>
                        </VpTabs>
                    :
                    window.vp.config.vpmbuttonvisible.wbsIsShowTab ?
                        <VpTabs destroyInactiveTabPane defaultActiveKey="0" onChange={this.tabsChange} className="wbsTab">
                            <VpTabPane tab='属性' key='0'>
                                <Dynamic
                                    add={false}
                                    entityrole={false}
                                    handleOk={this.saveRowData}
                                    closeRightModal={() => this.closeRightModal()}
                                    refreshList={() => this.getData()}
                                    row_id={this.state.wbsiid}
                                    row_entityid='10'
                                    skey={this.props.skey}
                                    okText="保 存"
                                />
                            </VpTabPane>
                            <VpTabPane tab='关联文档' key='1' >
                                <DocumentList
                                    bindthis={() => { }}
                                    doctype="3"
                                    entityrole={this.props.entityrole}
                                    irelentityid="10"
                                    irelobjectid={this.state.wbsiid}
                                    mainentityid={this.state.entityid}
                                    mainiid={this.state.iid}
                                    fromtabs='wbs'
                                />
                            </VpTabPane>
                            <VpTabPane tab='比较甘特图' key='3' >
                                <VpIframe title='wbs甘特图' url={rightwbscompareurl} />
                            </VpTabPane>
                            <VpTabPane tab='镜像视图' key='4' >
                                <VpIframe title='wbs甘特图' url={rightwbsmirrorurl} />
                            </VpTabPane>
                            <VpTabPane tab='评论' key='5' >
                                <DiscussList entityid="10" entityrole={this.props.entityrole} iid={this.state.wbsiid} />
                            </VpTabPane>
                            <VpTabPane tab='流程管理' key='6'>
                                <WorkFlow entityid={'10'} entityrole={this.props.entityrole} iid={this.state.wbsiid} />
                            </VpTabPane>
                        </VpTabs>
                        :
                        <VpTabs destroyInactiveTabPane defaultActiveKey="0" onChange={this.tabsChange} className="wbsTab">
                            <VpTabPane tab='属性' key='0'>
                                <Dynamic
                                    add={false}
                                    entityrole={false}
                                    handleOk={this.saveRowData}
                                    closeRightModal={() => this.closeRightModal()}
                                    refreshList={() => this.getData()}
                                    row_id={this.state.wbsiid}
                                    row_entityid='10'
                                    skey={this.props.skey}
                                    okText="保 存"
                                />
                            </VpTabPane>
                            <VpTabPane tab='关联文档' key='1' >
                                <DocumentList
                                    bindthis={() => { }}
                                    doctype="3"
                                    entityrole={this.props.entityrole}
                                    irelentityid="10"
                                    irelobjectid={this.state.wbsiid}
                                    mainentityid={this.state.entityid}
                                    mainiid={this.state.iid}
                                    fromtabs='wbs'
                                />
                            </VpTabPane>
                            <VpTabPane tab='评论' key='5' >
                                <DiscussList entityid="10" entityrole={this.props.entityrole} iid={this.state.wbsiid} />
                            </VpTabPane>
                            <VpTabPane tab='流程管理' key='6'>
                                <WorkFlow entityid={'10'} entityrole={this.props.entityrole} iid={this.state.wbsiid} />
                            </VpTabPane>
                        </VpTabs>
        );
    }

    // 关闭右侧弹出    
    closeRightModal() {
        this.setState({
            showRightBox: false,
            isPhaseRel: false,
            isIframe: false
        })
    }



    //WBS任务分配活动类型
    wbsMatchTask = (wbsentityid, wbsId) => {
        const _this = this;

        // _this.setState({
        //     title: 'WBS关联任务活动', 
        //     showTaskRightBox: true, 
        //     tableTaskHeader: [],
        //     tableTaskData: [],
        //     wbsId: wbsId,
        // }, () => {
        // })

        this.setState({ wbsiid: wbsId, showRightBox: true, isShowTask: true }, () => {
            let tabDiv = $('.wbsTab').find('.ant-tabs-tab')
            tabDiv.each((index, item) => {
                if (index == '2') {
                    $(item).click()
                }
            })
        })
    }

    getTaskList = (value) => {
        this.setState({

        }, () => {
            this.queryTaskHeader()
            this.queryTaskData()
        })
    }

    queryTaskHeader = () => {
        let data = []
        data = getTaskHeader();
    }

    queryTaskData = (wbsId) => {
        //const { iid, entityid} = this.state;
        let str = '';
        const _this = this
        vpAdd('/{vpmprovider}/vpmwbs/getTaskList', {
            wbsId: wbsId,
        }).then((response) => {
            const data = response.data
            if (data.resultList.length > 0) {
                str = data.resultList[0].iwbstaskids;
            }
            _this.setState({
                wbsId: wbsId,
                tableTaskHeader: getTaskHeader(),
                tableTaskData: data.resultList,
                selectedRowKeys: str.split(',')
                // cur_page: data.currentPage,
                // total_rows: data.totalRows,
                // num_perpage: data.numPerPage,
                // pagination: {
                //     total: data.totalRows,
                //     showTotal: showTotal,
                //     pageSize: data.numPerPage,
                //     onShowSizeChange: _this.onShowSizeChange,
                //     showSizeChanger: true,
                //     showQuickJumper: true,
                // }
            })
        }).catch((e) => {
            if (!(typeof e == 'function')) {
                console.log('Error:' + e)
            } else {
                e();
            }
        })
    }

    //保存WBS分配任务活动
    handleTaskSave = () => {
        let saveflag = false

        vpAdd('/{vpmprovider}/vpmwbs/saveWBSTask', {
            projectid: '',
            wbsId: this.state.wbsId,
            sparam: JSON.stringify(this.state.selectItems)
        }).then((response) => {
            this.closeTaskRightModal()
        })
    }

    // 关闭右侧弹出    
    closeTaskRightModal() {
        this.setState({
            showTaskRightBox: false
        })
    }

    handleSelect = (record, selected, selectedRowKeys) => {
        let idx = 0;
        if (selected) {
            //console.log(this.state.selectItems);
            this.setState({
                selectedRowKeys: [...this.state.selectedRowKeys, record.iid],
                selectItems: [...this.state.selectItems, record]
            })
            //console.log(this.state.selectItems);
        } else {
            this.state.selectedRowKeys.forEach((element, i) => {
                if (element === record.iid) {
                    idx = i
                }
            });

            this.setState({
                selectedRowKeys: [...this.state.selectedRowKeys.slice(0, idx), ...this.state.selectedRowKeys.slice(idx + 1)],
                selectItems: [...this.state.selectItems.slice(0, idx), ...this.state.selectItems.slice(idx + 1)]
            })
        }
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        const _this = this
        //console.log('selectedRowKeys changed: ', selectedRowKeys);
        _this.setState({ selectedRowKeys, selectedRows: selectedRows });
        //console.log(this.state.selectedRows);
    }

    handleSelectAll = (selected, selectedRows, changeRows) => {
        //console.log(selected, selectedRows, changeRows)
        this.setState({
            selectItems: selectedRows
        })
    }
    //将高层计划日期同步wbs计划
    synwbs = () => {
        const { iid, entityid } = this.state;
        vpAdd('/{bjyh}/phase/synWbs', {
            entityid: 9,//关联关系实体ID
            ientityid: entityid,
            projectid: iid,
        }).then((response) => {
            if(response.data){
                VpAlertMsg({
                    message: "消息提示",
                    description: `执行成功，同步了${response.data}条数据。`,
                    type: "success",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            }
        })
    }
    //Porject模板下载
    wbsTemplate = () => {
        vpDownLoad('/{bjyh}/phase/wbsTemplateDownload')
    }

    render() {
        let params = {
            entityrole: this.state.entityrole
        }

        let { selectedRowKeys } = this.state

        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            onChange: this.onSelectChange,
        }

        const clearMsg = "执行“清除WBS计划”功能";
        return (
            <div className="business-container pr full-height phase">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                    <VpRow gutter={1}>
                        {
                            this.props.entityrole ?
                            <div>
                                <VpCol className="gutter-row text-left" sm={12}>
                                    <VpTooltip placement="rightTop" title="Porject模板下载">
                                        <VpButton type="ghost" style={{ margin: "0 3px" }}
                                         icon="download" onClick={this.wbsTemplate} ></VpButton>
                                    </VpTooltip>
                                </VpCol>
                                <VpCol className="gutter-row text-right" sm={12}>
                                    {(this.state.entityid == '7') ?
                                        <VpTooltip placement="top" title="高层计划转WBS计划">
                                            <VpButton type="primary" icon="link" onClick={() => this.toolBarClick('make')}></VpButton>
                                        </VpTooltip> : ''
                                    }
                                    {(window.vp.config.vpmbuttonvisible.wbsmirror == '1') ?
                                        <VpTooltip placement="top" title="镜像管理">
                                            <VpButton type="primary" style={{ margin: "0 3px" }} icon="setting" onClick={() => this.toolBarClick('relwbs')} ></VpButton>
                                        </VpTooltip> : ''
                                    }
                                    <VpTooltip placement="top" title="同步高层计划时间">
                                            <VpButton type="primary" style={{ margin: "0 3px" }} icon="swap" onClick={() => this.synwbs('synwbs')} ></VpButton>
                                    </VpTooltip>
                                    <VpTooltip placement="top" title="刷新">
                                        <VpButton type="ghost" style={{ margin: "0 3px" }} icon="reload" onClick={() => this.toolBarClick('refresh')} ></VpButton>
                                    </VpTooltip>
                                    {window.vp.config.URL.devflag?
                                    <VpTooltip placement="top" title="清除">
                                        <VpPopconfirm id="aaaa" placement="bottomLeft" title={clearMsg} onConfirm={() => this.toolBarClick('clear')} onCancel={this.cancel}>
                                            <VpButton type="ghost" style={{ margin: "0 3px" }} icon="delete" ></VpButton>
                                        </VpPopconfirm>
                                    </VpTooltip>:null}
                                    {(window.vp.config.vpmbuttonvisible.wbsmirror == '1') ?
                                        <VpTooltip placement="top" title='WBS镜像视图'>
                                            <VpButton type="ghost" style={{ margin: "0 3px" }} icon="retweet" onClick={() => this.toolBarClick('mirrorView')} ></VpButton>
                                        </VpTooltip> : ''
                                    }
                                    {(this.state.entityid == '7' && window.vp.config.vpmbuttonvisible.wbscomparegantt == '1') ?
                                        <VpTooltip placement="top" title='比较甘特图'>
                                            <VpButton type="ghost" style={{ margin: "0 3px" }} icon="android" onClick={() => this.toolBarClick('compareGantt')} ></VpButton>
                                        </VpTooltip> : ''
                                    }
                                    <VpTooltip placement="top" title='导出Excel'>
                                        <VpButton type="ghost" size="small" onClick={() => this.toolBarClick('export')} >
                                            <VpIcon type="vpicon-excel text-muted" />
                                        </VpButton>
                                    </VpTooltip>
                                    <VpTooltip placement="top" title='导出MSP'>
                                        <VpButton type="ghost" style={{ margin: "0 3px" }} icon="export" onClick={() => this.toolBarClick('exportMSP')} ></VpButton>
                                    </VpTooltip>
                                </VpCol> 
                            </div>: ''
                        }
                    </VpRow>
                </div>

                <div className="p-sm" id="table" >
                    <VpTable
                        className="pjwbstable"
                        onExpand={this.onExpand}
                        columns={this.state.table_headers}
                        dataSource={this.state.table_array}
                        onChange={this.tableChange}
                        onRowClick={this.onRowClick}
                        pagination={this.state.pagination}
                        expandIconColumnIndex={1}
                        rowKey={record => record.iid}
                        expandedRowKeys={this.state.expandedRowKeys}
                        scroll={{ x: 2400, y: this.state.tableHeight }}
                        resize
                    // bordered
                    />
                </div>

                <VpModal
                    title={this.state.modaltitle}
                    visible={this.state.visible}
                    onOk={() => this.okModal()}
                    onCancel={() => this.cancelModal()}
                    width={'70%'}
                    footer={null}
                    wrapClassName='modal-no-footer'>
                    <VpDynamicForm
                        ref={(node) => this.dynamic = node}
                        bindThis={this}
                        className="p-sm full-height scroll p-b-xxlg"
                        formData={this.state.increaseData}
                        handleOk={this.saveRowData}
                        handleCancel={this.handleCancel}
                        params={params}
                        okText="提 交" />
                </VpModal>

                <RightBox
                    max={false}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    tips={
                        <div className="tips p-xs">
                            <VpTooltip placement="top" title="0000">
                                <VpIcon type="exclamation-circle text-muted m-r-xs" />
                            </VpTooltip>
                        </div>
                    }
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? this.loadRightWindow() : null}
                </RightBox>

                {this.state.wbsvisible ? <VpModal title='wbs甘特图' maskClosable={false}
                    visible={this.state.wbsvisible}
                    onOk={() => this.okModal()}
                    onCancel={() => this.cancelWBSModal()}
                    width={'90%'}
                    style={{ top: '10%' }}
                    footer={null}
                    wrapClassName='modal-no-footer vpwbs'>
                    <VpIframe title='wbs甘特图' url={this.state.rightwbsurl} />
                </VpModal> : ''}



                {/* 未使用 */}
                <RightBox
                    max={this.state.max}
                    button={
                        <div className="icon p-xs" onClick={this.closeTaskRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showTaskRightBox}
                >
                    {
                        this.state.showTaskRightBox ?
                            <VpTabs style={{}} defaultActiveKey="0">
                                <VpTabPane tab={this.state.title} key="0">
                                    <div className="edit-table-tree full-height bg-white">
                                        <div className="" ref="table">
                                            <RelationList
                                                entityid='10'
                                                iid={this.state.wbsId}
                                                stabparam='iwbstaskid'
                                                skey="entity114_attr"
                                                entityrole={true}
                                            />

                                        </div>
                                    </div>
                                </VpTabPane>
                            </VpTabs>
                            :
                            ''
                    }
                </RightBox>

                {/* 多个tab(未使用) */}
                {this.state.wbsChildrenVisible ? <VpModal title='WBS详细' maskClosable={false}
                    visible={this.state.wbsChildrenVisible}
                    onOk={() => this.okModal()}
                    onCancel={() => this.cancelWBSChildModal()}
                    width={'90%'}
                    style={{ top: '10%' }}
                    footer={null}
                    wrapClassName='modal-no-footer vpwbs'>

                    <VpTabs defaultActiveKey="0">
                        <VpTabPane tab='跟踪视图' key="0">
                            <VpIframe title='跟踪视图' url={this.state.rightwbsurl} />
                        </VpTabPane>
                        <VpTabPane tab='比较甘特图' key="1">
                            <VpIframe title='比较甘特图' url={this.state.rightwbscompareurl} />
                        </VpTabPane>
                        <VpTabPane tab='镜像视图' key="2">
                            <VpIframe title='镜像视图' url={this.state.rightwbsmirrorurl} />
                        </VpTabPane>
                        <VpTabPane tab='评论' key="3">

                            33333
                        </VpTabPane>
                    </VpTabs>
                </VpModal> : ''}
            </div>
        );
    }
}


export default wbs = VpFormCreate(wbs);