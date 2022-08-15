import React, { Component } from 'react'
import {
    vpQuery, vpDownLoad, vpAdd, VpIframe, VpTable, VpMenuItem, VpMenu, VpDropdown, VpIcon, VpTooltip,
    VpTabs, VpModal, VpTabPane, VpButton, VpRow, VpCol, VpFormCreate, VpPopconfirm, VpIconFont, vpFormatDate, VpAlertMsg
} from 'vpreact';
import { RightBox, VpDynamicForm } from 'vpbusiness';
import './Phase.less';

/* import DynamicForm from '../../../templates/dynamic/DynamicForm/DynamicForm';*/
import PhaseRelate from './PhaseRelate';
import FlowListTab from '../../../templates/dynamic/Flow/FlowListTab';
//import DocumentList from 'pages/vfm/dynamic/Document/documentList';
import { formatDateTime, requireFile } from 'utils/utils';
import {
    formDataToWidgetProps
} from '../../../templates/dynamic/Form/Widgets';

function validateDate(value, key) {
    let result = {};
    result.flag = true;
    let start = "";
    let end = "";
    if (value[key] != null && value[key] != '') {
        end = value[key];
        if (key == 'dforecastenddate') {
            //formatDateTime
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
            //alert(start + "---" + end)
            if (start > end) {
                result.flag = false;
                result.msg = '实际开始时间不能大于实际结束时间！';
            }
        }
    }
    return result;
}
class Phase extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [],
            visible2: false,
            targetKeys: [],
            showRightBox: false,
            widget_show_none: '',
            widget_show_none_tool: '',
            filter_data: [],
            table_headers: [],
            table_array: [],
            cur_page: 1,
            page: 1,
            pagination: {},
            filtervalue: '', //过滤器值
            limit: 10, //每页记录数
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
            phaseiid: '',
            entityrole: false,
            newFlag: false,
            expandedRowKeys: [],
            tableHeight: '',
            loading: false,   //避免重复点击发布按钮
            isClickMenu: false,
            params: {},  // 无镜像
            isshow: true,
            rate: 8,
            workDay: 0,
            isedit: false,
            levelArray:[]
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
        this.handleDropDown = this.handleDropDown.bind(this);
        this.toolBarClick = this.toolBarClick.bind(this);
        this.closeRightModal = this.closeRightModal.bind(this);
    }
    componentWillMount() {
        let isshow = true
        //alert(this.props.iaccesslevel)
        if (this.props.iaccesslevel == 0) {
            isshow = false
        }
        this.setState({
            entityid: this.props.entityid,
            iid: this.props.iid,//项目iid
            isshow: isshow,
            entityrole: this.props.entityrole
        }, () => {
            this.getHeader()
            this.getData()
            this.getRate()
            window.phaseApp = this
        })
        this.tabs = {}
        this.tabs.WorkFlow = FlowListTab
        //this.tabs.WorkFlow = requireFile('bjyh/templates/Flow/FlowListTab')
        this.tabs.documentList = requireFile('vfm/Document/documentList')
    }
    componentDidMount() {
        let tHeight = $(window).height() - 265 // 这里的255是指表格最大高度之外的距离（主要是距离顶部和底部）
        $(".pjphase").find(".ant-table-body").css({
            height: tHeight
        })
        this.setState({
            tableHeight: tHeight
        })
    }
    //获取表头数据
    getHeader() {
        let _this = this;
        vpQuery('/{vpplat}/vfrm/entity/getheaders', {
            entityid: 9, scode: 'list'
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
                                            width: _field_width,
                                            fixed: _fixed
                                        });
                                    }
                                }
                            })
                            const tips = (
                                <div>
                                    <VpTooltip title="进度"><VpIconFont type="vpicon-tip" className="m-r-xs text-success" /></VpTooltip>
                                    <VpTooltip title="当前阶段"><VpIconFont type="vpicon-milepost" className="m-r-xs text-success" /></VpTooltip>
                                    <VpTooltip title="状态"><VpIconFont type="vpicon-check" className="m-r-xs text-success" /></VpTooltip>
                                    <VpTooltip title="流程"><VpIconFont type="vpicon-examine" className="m-r-xs text-success" /></VpTooltip>
                                </div>
                            )
                            //指示灯类型
                            //const indiclass = ['../vpstatic/images/greenPoint.gif', '../vpstatic/images/yellowPoint.gif', '../vpstatic/images/redPoint.gif', '../vpstatic/images/grayPoint.gif']
                            const indiclass = ['bg-success', 'bg-warning', 'bg-danger', 'bg-success']
                            const image = ['../vpstatic/images/process.gif', '../vpstatic/images/currentPhase.gif', '../vpstatic/images/statend.gif', '../vpstatic/images/workflow.gif']
                            const empty = '../vpstatic/images/empty.gif'
                            const title = ['进度', '当前阶段', '已完成', '流程中']
                            const emptytitle = ['进度', '当前阶段', '状态', '流程']
                            const indicolumn = {
                                title: tips, width: 100, dataIndex: 'indicator', key: 'indicator',
                                render: (value, record) => {//value 0_1_0_1:进度正常、非当前阶段、未完成、非流程中
                                    return (
                                        <div className="indic-wrapper">
                                            {
                                                value
                                                    ?
                                                    value.split("_").map((item, i) => {
                                                        if (i == 0) {//进度
                                                            if (parseInt(item) > 0 && (parseInt(item) < 4)) {
                                                                return <span key={'indicator' + record.iid} >
                                                                    {/* <img src={indiclass[item]} title={title[i]} /> */}
                                                                    <VpTooltip title={title[i]}>
                                                                        <VpIconFont key={'icon' + record.iid + '_' + item} type={indiclass[item]} />
                                                                    </VpTooltip>
                                                                </span>
                                                            } else if (parseInt(item) > 3) {
                                                                return <span key={'indicator' + record.iid} >
                                                                    {/* <img src={empty} title={emptytitle[i]} /> */}
                                                                    <VpTooltip title={emptytitle[i]}>
                                                                        <VpIconFont key={'icon' + record.iid + '_3'} type={indiclass[3]} />
                                                                    </VpTooltip>
                                                                </span>
                                                            } else {
                                                                return <span key={'indicator' + record.iid} >
                                                                    {/* <img src={indiclass[0]} title={emptytitle[i]} /> */}
                                                                    <VpTooltip title={emptytitle[i]}>
                                                                        <VpIconFont key={'icon' + record.iid + '_0'} type={indiclass[0]} />
                                                                    </VpTooltip>
                                                                </span>
                                                            }
                                                        } else if (i == 1 || i == 3) {//当前阶段、是否流程中
                                                            if (item == '0') {
                                                                return <span key={i} style={{ margin: "0 2px" }}>
                                                                    <VpTooltip title={title[i]}>
                                                                        <img src={image[i]} />
                                                                    </VpTooltip>
                                                                </span>
                                                            } else {
                                                                return <span key={i} style={{ margin: "0 2px" }}>
                                                                    <VpTooltip title={emptytitle[i]} >
                                                                        <img src={empty} />
                                                                    </VpTooltip>
                                                                </span>
                                                            }
                                                        } else {//是否完成
                                                            if (item == '0') {
                                                                return <span key={i} style={{ margin: "0 2px" }}>
                                                                    <VpTooltip title={emptytitle[i]} >
                                                                        <img src={empty} />
                                                                    </VpTooltip>
                                                                </span>
                                                            } else {
                                                                return <span key={i} style={{ margin: "0 2px" }}>
                                                                    <VpTooltip title={title[i]}  >
                                                                        <img src={image[i]} />
                                                                    </VpTooltip>
                                                                </span>
                                                            }
                                                        }
                                                    })
                                                    :
                                                    <div>
                                                        <span key={'indicator' + record.iid}>
                                                            <VpTooltip title={emptytitle[0]}>
                                                                <VpIconFont key={'icon' + record.iid + '_0'} type={indiclass[0]} />
                                                            </VpTooltip>
                                                        </span>
                                                        <span key={1} style={{ margin: "0 2px" }}>
                                                            <VpTooltip title={emptytitle[1]} >
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
                                                    </div>
                                            }
                                        </div>
                                    )
                                }
                            }
                            const basemenulist = [
                                { key: 'newPhase', sname: '新建阶段', type: 'vpicon-plus-circle text-info' },
                                { key: 'newact', sname: '新建活动', type: 'vpicon-plus-circle text-info' },
                                { key: 'newlcb', sname: '新建里程碑', type: 'vpicon-plus-circle text-info' },
                                { key: 'newjfw', sname: '新建交付物', type: 'vpicon-plus-circle text-info' },
                                { key: 'lcbrel', sname: '里程碑关联关系', type: 'vpicon-navlist' },
                                { key: 'delete', sname: '删除', type: 'vpicon-shanchu text-danger' },
                                { key: 'up', sname: '上移', type: 'vpicon-caret-up text-success' },
                                { key: 'down', sname: '下移', type: 'vpicon-caretdown text-success' },
                                { key: 'flow', sname: '流程', type: 'vpicon-sitemap' },
                                { key: 'doc', sname: '文档', type: 'vpicon-paperclip' }
                            ]
                            const optcolumn = {
                                title: '操作', fixed: 'right', width: 120, key: 'operation', render: (text, record) => {
                                    let iclassid = record.iclassidval
                                    let icurrentphase = record.icurrentphase
                                    let iphasesetmodel = record.iphasesetmodel
                                    let menulist = [...basemenulist,]
                                    if (iphasesetmodel == 2) { // 自动设置当前阶段
                                        menulist = [...basemenulist]
                                    } else {
                                        menulist = [
                                            ...basemenulist,
                                            { key: 'setCurPhase', sname: '设置当前阶段', type: 'vpicon-tag' },
                                            { key: 'clearCurPhase', sname: '清除当前阶段', type: 'vpicon-tag text-danger' }
                                        ]
                                    }
                                    let isShowMenu = false
                                    let curmenu = (
                                        <VpMenu onClick={_this.menuClick}>
                                            {
                                                menulist.map(item => {
                                                    isShowMenu = false
                                                    if (iclassid == 91) {
                                                        if (item.key == 'newact' || item.key == 'newlcb' || item.key == 'newjfw' ||
                                                            (item.key == 'delete' && record.isedit == 0) || item.key == 'up' || item.key == 'down' ||
                                                            (item.key == 'clearCurPhase' && icurrentphase == '0') ||
                                                            (item.key == 'setCurPhase' && icurrentphase != '0') ||
                                                            item.key == 'flow' || item.key == 'doc') {
                                                            isShowMenu = true
                                                        }
                                                    } else if (iclassid == 92) {
                                                        if (item.key == 'newact' || item.key == 'newlcb' || item.key == 'newjfw' ||
                                                            (item.key == 'delete' && record.isedit == 0) || item.key == 'up' || item.key == 'down' ||
                                                            item.key == 'flow' || item.key == 'doc') {
                                                            isShowMenu = true
                                                        }
                                                    } else if (iclassid == 93) {
                                                        if ((item.key == 'delete' && record.isedit == 0) || item.key == 'up' || item.key == 'down' ||
                                                            item.key == 'lcbrel' || item.key == 'flow' || item.key == 'doc') {
                                                            isShowMenu = true
                                                        }
                                                    } else if (iclassid == 94) {
                                                        if ((item.key == 'delete' && record.isedit == 0) || item.key == 'up' || item.key == 'down' ||
                                                            item.key == 'flow' || item.key == 'doc') {
                                                            isShowMenu = true
                                                        }
                                                    } else { // 根节点(项目)
                                                        if (item.key == 'newPhase') {
                                                            isShowMenu = true
                                                        }
                                                    }
                                                    if (isShowMenu) {
                                                        return (
                                                            <VpMenuItem key={item.key}>
                                                                <a><VpIconFont type={item.type} />&nbsp;&nbsp;{item.sname}</a>
                                                            </VpMenuItem>
                                                        )
                                                    }
                                                })
                                            }

                                        </VpMenu>
                                    )
                                    return (
                                        <span>
                                            <div style={{ textAlign: 'left' }} className="optmenu" >
                                                {
                                                    _this.state.isClickMenu || _this.state.showRightBox ? '' :
                                                        <VpDropdown trigger={['click']} overlay={curmenu} getPopupContainer={parents => document.getElementById("phaseTable")} >
                                                            <VpIconFont type="vpicon-navlist" className="cursor" onClick={(e) => _this.handleDropDown(e, record)} />
                                                        </VpDropdown>
                                                }

                                            </div>
                                        </span>
                                    )
                                }
                            }
                            let hh = [indicolumn]
                            let namecol = _header.filter(item => item.dataIndex == 'sname')
                            namecol.map(item => { item.width = 280; hh.push(item) })
                            _header.map((item, index) => {
                                let sname = item.dataIndex
                                if (sname != 'sname') {
                                    hh.push(item)
                                }
                            })
                            _this.state.isshow ? hh.push(optcolumn) : ""
                            _this.setState({ table_headers: hh })
                        }
                    }
                }
            }
        }).catch(function (err) {
            console.log(err);
        });
    }
    getRate = () => {
        const _this = this
        //获取每日工作小时
        vpAdd('/{vpmprovider}/vfrm/phase/getWorkHoursFromCalendar', { type: 'workHour' }).then(function (data) {
            if (data.hasOwnProperty('data')) {
                _this.setState({
                    rate: data.data.rate
                })
            }
        })
    }
    setWorkDay = (start, end, key) => {
        const _this = this
        //获取有效工作天数
        vpAdd('/{vpmprovider}/vfrm/phase/getWorkHoursFromCalendar',
            { type: 'workDay', start: start, end: end, entityid: this.state.entityid, projectid: this.state.iid }
        ).then(function (res) {
            if (res.hasOwnProperty('data')) {
                let dur = res.data.workDay
                let rate = _this.state.rate
                let workHour = (parseInt(dur) * parseInt(rate))
                const { setFieldsValue } = _this.dynamic
                if (key == 'forecast') {
                    //setFieldsValue({ 'fforecastduration': dur, 'fforecastworkload': workHour }) //工时暂不计算
                    setFieldsValue({ 'fforecastduration': dur })
                } else if (key == 'plan') {
                    //setFieldsValue({ 'fplanduration': dur, 'fplanworkload': workHour }) //工时暂不计算
                    setFieldsValue({ 'fplanduration': dur })
                } else if (key == 'actual') {
                    //setFieldsValue({ 'factualduration': dur, 'factualworkload': workHour }) //工时暂不计算
                    setFieldsValue({ 'factualduration': dur })
                }
            }
        })
    }
    // 获取表格数据
    getData() {
        const { iid, entityid, searchVal } = this.state;
        vpAdd('/{vpplat}/vfrm/entity/dynamicListData', {
            entityid: 9,//关联关系实体ID
            ientityid: entityid,
            quickSearch: searchVal,
            iid: iid,
            viewtype: 'tree'   //主实体的当前行数据ID
        }).then((response) => {
            vpAdd('/{vpmprovider}/vfrm/phase/optMenu',
                {
                    iid: 0,
                    sparam: JSON.stringify({ irelentityid: entityid, iprojectid: iid, optType: 'updateProject' })
                }
            ).then(function (data) { }).catch(function (err) { console.log(err) })

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
            let isOpen = true;
            vpAdd('/{vpmprovider}/vfrm/phase/isExistPhase',
                { ientityid: _this.state.entityid, iprojectid: _this.state.iid }
            ).then(function (data) {
                isOpen = !data.data.isExist
                _this.setState({ isOpen, increaseData: {}, })
                if (isOpen) {
                    vpAdd('/{vpmprovider}/vfrm/phase/getPhasePlan',
                        { iprojectid: _this.state.iid }
                    ).then(function (data) {
                        _this.setState({
                            modaltitle: '生成高层计划',
                            increaseData: data.data.form,
                            visible: true
                        })
                    })
                } else {
                    VpAlertMsg({
                        message: "消息提示",
                        description: '高层计划已存在，请先清除后再操作',
                        type: "error",
                        onClose: _this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5)
                }
            })
        } else if (optType == 'refresh') {
            _this.getData()
        } else if (optType == 'clear') {
            let value = { optType: optType, iprojectid: _this.state.iid, irelentityid: this.state.entityid }
            vpAdd('/{vpmprovider}/vfrm/phase/optMenu',
                {
                    sparam: JSON.stringify(value),
                    iid: 0,
                    entityid: 9//主实体ID
                }
            ).then(function (data) {
                _this.getData()
            })
        } else if (optType == 'export') {
            _this.phaseExport()
        } else if (optType == 'relwbs') {
            _this.openIdxTabPage(0, '镜像管理')
        } else if (optType == 'mirrorView') {
            _this.openIdxTabPage(1, '镜像视图')
        } else if (optType == 'milestone') {
            _this.openIdxTabPage(2, '里程碑关联视图')
        } else if (optType == 'baseline') {
            _this.openIdxTabPage(3, '基线比较')
        }
    }
    changeForecastStart = (date, value) => {
        this.dateChangeToDuration(value, 'dforecaststartdate')
    }
    changeForecastEnd = (date, value) => {
        this.dateChangeToDuration(value, 'dforecastenddate')
    }
    aa = (value) => {
        alert(value);
    }
    changePlanStart = (date, value) => {
        this.dateChangeToDuration(value, 'dplanstartdate')
    }
    changePlanEnd = (date, value) => {
        this.dateChangeToDuration(value, 'dplanenddate')
    }
    changeActualStart = (date, value) => {
        this.dateChangeToDuration(value, 'dactualstartdate')
    }
    changeActualEnd = (date, value) => {
        this.dateChangeToDuration(value, 'dactualenddate')
    }
    // 实时计算工期工时
    dateChangeToDuration = (value, key) => {
        const { getFieldValue } = this.dynamic
        if (value != null && value != '') {
            let start = null
            let end = null
            if (key == 'dforecaststartdate' || key == 'dforecastenddate') {
                if (key == 'dforecaststartdate') {
                    start = value
                    end = getFieldValue('dforecastenddate')
                    end = vpFormatDate(end, 'YYYY-MM-DD')
                } else {
                    start = getFieldValue('dforecaststartdate')
                    start = vpFormatDate(start, 'YYYY-MM-DD')
                    end = value
                }
                if (start != null && start != '' && end != null && end != '') {
                    this.setWorkDay(start, end, 'forecast')
                }
            } else if (key == 'dplanstartdate' || key == 'dplanenddate') {
                if (key == 'dplanstartdate') {
                    start = value
                    end = getFieldValue('dplanenddate')
                    end = vpFormatDate(end, 'YYYY-MM-DD')
                } else {
                    start = getFieldValue('dplanstartdate')
                    start = vpFormatDate(start, 'YYYY-MM-DD')
                    end = value
                }
                if (start != null && start != '' && end != null && end != '') {
                    this.setWorkDay(start, end, 'plan')
                }
            } else if (key == 'dactualstartdate' || key == 'dactualenddate') {
                if (key == 'dactualstartdate') {
                    start = value
                    end = getFieldValue('dactualenddate')
                    end = vpFormatDate(end, 'YYYY-MM-DD')
                } else {
                    start = getFieldValue('dactualstartdate')
                    start = vpFormatDate(start, 'YYYY-MM-DD')
                    end = value
                }
                if (start != null && start != '' && end != null && end != '') {
                    this.setWorkDay(start, end, 'actual')
                }
            }
        }
    }
    //加载选中分组下的模板列表
    loadTempList = (value) => {
        let _this = this
        let objparam = { groupid: value, scode: 'templist' }
        vpAdd('/{vpmprovider}/vfrm/phase/getSelectOption',
            { sparam: JSON.stringify(objparam) }
        ).then(function (data) {
            let list = data.data.list
            let defaultvalue = ''
            let tempCount = data.data.tempCount
            let workCount = data.data.workCount
            let countAnalogy = data.data.countAnalogy
            let tempInfo = data.data.tempInfo
            let dataform = _this.state.increaseData
            let fields = []
            dataform.groups[0].fields.map(function (item) {
                let sname = item.field_name
                if (sname == 'tempname') {
                    item.widget.load_template = list
                    defaultvalue = list[0].value
                } else if (sname == 'workCount') {
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
            setFieldsValue({ 'tempname': defaultvalue, 'tempCount': tempCount, 'workCount': workCount, 'countAnalogy': countAnalogy, 'tempInfo': tempInfo })
        })
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
    //高层计划导出
    phaseExport() {
        const _this = this;
        let filtervalue = 'export_' + _this.state.entityid + '_' + _this.state.iid
        vpDownLoad('/{vpplat}/vfrm/ent/exportfile',
            { ientityid: 9, filtervalue: filtervalue, type: 'expdata',viewcode:'expexcel' }
        )
    }
    //打开指定tab页
    openIdxTabPage(idx, rightTitle) {
        const _this = this;
        let righturl0 = getPagePath() + "/vpm/phase/phaseMap.html?ientityid=" + _this.state.entityid + "&iid=" + _this.state.iid
        let righturl1 = getPagePath() + "/vpm/phase/phaseMapView.html?entityid=" + _this.state.entityid + "&projectid=" + _this.state.iid
        let righturl2 = getPagePath() + "/vpm/phase/phaseMilestoneRelation.html?ientityid=" + _this.state.entityid + "&iid=" + _this.state.iid
        let righturl3 = getPagePath() + "/vpm/phase/phaseCompare.html?ientityid=" + _this.state.entityid + "&iid=" + _this.state.iid
        _this.setState({
            righturl0: righturl0, righturl1: righturl1, righturl2: righturl2, righturl3: righturl3,
            isPhaseRel: false, isIframe: true, rightTitle: rightTitle, showRightBox: true
        }, () => {
            let tabDiv = $('.phaseTab').find('.ant-tabs-tab')
            tabDiv.each((index, item) => {
                if (index == idx) {
                    $(item).click()
                }
            })
        })
    }
    //镜像管理
    openRelWBS() {
        const _this = this;
        let righturl = getPagePath() + "/vpm/phase/phaseMap.html?ientityid=" + _this.state.entityid + "&iid=" + _this.state.iid
        _this.setState({ righturl0: righturl, isPhaseRel: false, isIframe: true, rightTitle: '镜像管理', showRightBox: true })
    }

    //镜像视图
    openMirrorView() {
        const _this = this;
        let righturl = getPagePath() + "/vpm/phase/phaseMapView.html?entityid=" + _this.state.entityid + "&projectid=" + _this.state.iid
        _this.setState({ righturl1: righturl, isPhaseRel: false, isIframe: true, rightTitle: '镜像视图', showRightBox: true })
    }

    //里程碑关联关系视图
    openMilestoneRel() {
        const _this = this;
        let righturl = getPagePath() + "/vpm/phase/phaseMilestoneRelation.html?ientityid=" + _this.state.entityid + "&iid=" + _this.state.iid
        _this.setState({ righturl2: righturl, isPhaseRel: false, isIframe: true, rightTitle: '里程碑关系', showRightBox: true })
    }
    //基线比较
    openBaselineCompare() {
        const _this = this;
        let righturl = getPagePath() + "/vpm/phase/phaseCompare.html?ientityid=" + _this.state.entityid + "&iid=" + _this.state.iid
        _this.setState({ righturl3: righturl, isPhaseRel: false, isIframe: true, rightTitle: '基线比较', showRightBox: true })
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
            // alert(e.target.value);
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
    handleDropDown(e, record) {
        e.stopPropagation()
        // let id = $(e.target).closest('.optmenu').attr('data-id')
        // let sname = $(e.target).closest('.optmenu').attr('data-sanme')
        this.setState({
            phaseiid: record.iid,
            phasename: record.sname,
            iclassid: record.iclassidval,
            iparent: record.iparent
        })
    }


    handleCancel() {
        this.setState({
            showRightBox: false,
            isClickMenu: false,
            visible: false
        })
    }
    handleOk() {
        this.saveRowData(this.props.form.getFieldsValue());
    }

    onExpand(expanded, record) {
        if (!expanded) {
            const idx = this.state.expandedRowKeys.findIndex((iid) => record.iid === iid)
            this.setState({
                expandedRowKeys: [...this.state.expandedRowKeys.slice(0, idx), ...this.state.expandedRowKeys.slice(idx + 1)]
            }, () => {
            })
        } else {
            this.setState({
                expandedRowKeys: [...this.state.expandedRowKeys, record.iid]
            }, () => {
            })
        }
    }
    // 保存表单
    saveRowData(value, statusid) {

        this.setState({
            loading: true
        })
        const _this = this;
        let isOpen = _this.state.isOpen
        let vae = {}
        let success = true
        if(this.state.table_array[0].children){
            this.validateName(this.state.table_array[0].children,this.state.phaseiid)
        }
        if(this.state.levelArray.length>0){
            const levelArray = this.state.levelArray
            for(let item of levelArray){
                if(item.sname==$.trim(value.sname) && (this.state.newFlag?true:(item.iid!=this.state.phaseiid))){
                    VpAlertMsg({
                        message: "消息提示",
                        description: "相同层级的名称不能重复",
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5)
                    success = false;
                    break
                }
            }
        }
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
            if (key == 'dactualstartdate' || key == 'dactualenddate') {
                if (value[key] != null && value[key] != '' && (vpFormatDate(value[key], 'YYYY-MM-DD') > vpFormatDate(new Date(), 'YYYY-MM-DD'))) {
                    /**
                     * 项目管理系统（六期）项目 63.优化需求
                     * 7）高层计划填写实际开始/完成时间时晚于当前时间时，系统提示：实际时间不能选择当前时间之后的时间，将此限制提示去掉
                     */
                    // VpAlertMsg({
                    //     message: "消息提示",
                    //     description: '实际时间不能选择当前时间之后的时间',
                    //     type: "error",
                    //     onClose: this.onClose,
                    //     closeText: "关闭",
                    //     showIcon: true
                    // }, 5)
                    // success = false
                }
            }
            if (key.indexOf('_label') == -1) {
                vae[key] = value[key]
            }
            if (key == 'iparent' && value[key] == '') {
                vae[key] = '0'
            }
        }
        if (isOpen) {//生成高层计划
            vpAdd('/{vpmprovider}/vfrm/phase/makePhase',
                {
                    sparam: JSON.stringify(value),
                    entityid: _this.state.entityid,//主实体ID
                    iprojectid: _this.state.iid//项目ID
                }
            ).then(function (data) {
                _this.setState({
                    visible: false,
                    isOpen: false,
                    increaseData: {},
                    loading: false,
                    phaseiid: 0
                }, _this.getData())
            }).catch(function (err) {
                _this.setState({
                    loading: false
                })
            });
        } else {
            let curiid = '';
            if (_this.state.newFlag) {
                curiid = ''
                vae['iparent'] = _this.state.phaseiid
                vae['iprojectid'] = _this.state.iid
                vae['irelentityid'] = _this.state.entityid
            } else {
                curiid = _this.state.phaseiid
            }
            if (success) {
                vpAdd('/{vpplat}/vfrm/entity/saveFormData',
                    {
                        sparam: JSON.stringify(vae),
                        entityid: 9,//主实体ID
                        iid: curiid,//主实体数据ID
                    }
                ).then(function (data) {
                    _this.setState({
                        showRightBox: false,
                        isClickMenu: false,
                        increaseData: {},
                        loading: false,
                        phaseiid: 0
                    }, () => {
                        // _this.getData()
                        _this.updateTimeInfo(9, data.data.iid)
                        //上线阶段调整后 判断是否延期
                        if((value.sname === '上线' || value.iparent_label === '上线') 
                            && new Date(value.dplanenddate) > new Date()) {
                            vae['iprojectid'] = _this.state.iid
                            vpAdd('/{bjyh}/delayed/synDelayedData',{
                                sparam: JSON.stringify(vae)
                            })
                        }
                    })
                }).catch(function (err) {
                    _this.setState({
                        loading: false
                    })
                });
            } else {
                _this.setState({
                    loading: false
                })
            }
        }
    }
    //名称递归查找
    validateName=(children,iparent)=>{
        this.state.levelArray=[]
        if(children){
            if(iparent!="0"){
                this.findLevelNum(children,iparent)
            }else{
                this.state.levelArray = [...children]
            }
        }
    }
    findLevelNum=(children,iparent)=>{
        for(let item of children){
            if(this.state.newFlag){
                //新建
                if(item.iid==iparent){
                    if(item.children){
                        this.state.levelArray=[...item.children]
                    }
                    return
                }else{
                    if(item.children){
                        this.findLevelNum(item.children,iparent)
                    }
                }
            }else{
                //编辑
                if(item.iid==iparent){
                    this.state.levelArray=[...children]
                }else{
                    if(item.children){
                        this.findLevelNum(item.children,iparent)
                    }
                }
            }

        }
    }

    updateTimeInfo(entityid, iid) {
        const _this = this
        let sparam = {
            iid: iid,
            sparam: JSON.stringify({ entityid: entityid, optType: 'updateTimeInfo' })
        }
        vpAdd('/{vpmprovider}/vfrm/phase/optMenu', sparam).then(function (data) {
            _this.getData()
        })
    }
    //表单字段信息
    queryFormData(iids, iclassid, iparent) {
        const _this = this
        //alert(iids)
        vpQuery('/{vpplat}/vfrm/entity/getform', {
            entityid: 9, iid: iids, iclassid: iclassid, iparent: iparent, mainentityid: this.state.entityid, mainiid: this.state.iid
        }).then(function (data) {
            if (data) {
                if (data.hasOwnProperty('data')) {
                    if (data.data.hasOwnProperty('form')) {
                        if (data.data.form.hasOwnProperty('groups')) {
                            let isNotMap = true
                            if (data.data.isMapping) {
                                isNotMap = false
                            }
                            let params = {
                                entityrole: _this.state.entityrole && isNotMap, iid: _this.state.iid, phaserelentityid: _this.state.entityid, rowid: _this.state.phaseiid
                            }

                            let _data = data.data
                            _this.onGetFormDataSuccess(_data,iclassid)

                            _this.setState({
                                increaseData: _data.form,
                                params: params,
                                loading: false
                            }, () => {
                                $(".phaseForm").height($(window).height() - 145)
                                if (iclassid == '93') { //里程碑隐藏结束日期与工期
                                    let divID = ''
                                    $(".phaseForm").find('.ant-form-item').each(function (idx, item) {
                                        divID = $(item).find('label').attr('for')
                                        if (divID == 'dforecastenddate' || divID == 'dplanenddate' || divID == 'dactualenddate' ||
                                            divID == 'fforecastduration' || divID == 'fplanduration' || divID == 'factualduration'
                                        ) {
                                            $(item).parent().addClass('hide')
                                        }
                                    })
                                }
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

    onRowClick(record) {
        if (record.onclick == 'false') { // || record.isedit > 0  删除isedit控制，否则生成wbs后无法点开看详情

        } else {
            let iids = record.iid
            this.setState({
                phaseiid: iids,
                increaseData: {},
                newFlag: false, isPhaseRel: false,
                isIframe: false, showRightBox: true
                , isedit: record.isedit == '0' ? true : false,
                add:false
            });
            this.queryFormData(iids, record.iclassidval, record.iparent);
        }

    }

    menuClick(a, b, c) {
        this.setState({ isClickMenu: true, isedit: true })
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
                isIframe: false, showRightBox: true,
                add:true
            }, () => {
                this.queryFormData('', iclassid, this.state.phaseiid);
            })
        } else if (key == 'setCurPhase' || key == 'clearCurPhase' || key == 'up' || key == 'down') {
            const _this = this;
            let curiid = this.state.phaseiid
            let value = { optType: key, iprojectid: this.state.iid, irelentityid: this.state.entityid }
            vpAdd('/{vpmprovider}/vfrm/phase/optMenu',
                {
                    sparam: JSON.stringify(value),
                    entityid: 9,//主实体ID
                    iid: curiid,//主实体数据ID
                }
            ).then(function (data) {
                _this.setState({
                    visible: false,
                    phaseiid: 0,
                    isClickMenu: false
                }, _this.getData())
            }).catch(function (err) {
                _this.setState({
                    visible: false,
                    phaseiid: 0,
                    isClickMenu: false
                })
            });
        } else if (key == 'delete') {
            const _this = this;
            let sparam = {
                entityid: 9, iid: this.state.phaseiid, sparam: JSON.stringify({ optType: 'checkPhase' })
            }
            vpAdd('/{vpmprovider}/vfrm/phase/optMenu', sparam).then(function (res) {
                if (res.data.success) {
                    vpAdd('/{vpplat}/vfrm/entity/deleteData',
                        { entityid: 9, iid: _this.state.phaseiid }
                    ).then(function (data) {
                        _this.setState({
                            phaseiid: 0,
                            isClickMenu: false
                        })
                        _this.getData();
                    })
                } else {
                    _this.setState({
                        phaseiid: 0,
                        isClickMenu: false
                    })
                    VpAlertMsg({
                        message: "消息提示",
                        description: res.data.msg,
                        type: "error",
                        onClose: _this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5)
                }
            })
        } else if (key == 'doc') {
            if (this.state.phaseiid > 0) {
                this.setState({newFlag: false, isPhaseRel: false, isIframe: false, showRightBox: true }, () => {
                    let tabDiv = $('.phaseTab').find('.ant-tabs-tab')
                    tabDiv.each((index, item) => {
                        if (index == '1') {
                            $(item).click()
                        }
                    })
                })
            }
        } else if (key == 'flow') {
            if (this.state.phaseiid > 0) {
                this.setState({newFlag: false, isPhaseRel: false, isIframe: false, showRightBox: true }, () => {
                    let tabDiv = $('.phaseTab').find('.ant-tabs-tab')
                    tabDiv.each((index, item) => {
                        if (index == '2') {
                            $(item).click()
                        }
                    })
                })
            }
        } else if (key == 'lcbrel') {
            this.setState({ isPhaseRel: true, isIframe: false, showRightBox: true })
        }
    }
    tabsChange(tabs) {
        if (tabs == '0') {
            this.queryFormData(this.state.phaseiid, this.state.iclassid, this.state.iparent);
        }
    }

    loadRightWindow() {
        let WorkFlow = this.tabs.WorkFlow
        let DocumentList = this.tabs.documentList
        return (
            this.state.isPhaseRel
                ?
                <VpTabs destroyInactiveTabPane defaultActiveKey="0" onChange={this.tabsChange} >
                    <VpTabPane tab={'前置里程碑'} key='0'>
                        <PhaseRelate entityid={this.state.entityid}
                            projectid={this.state.iid}
                            phaseid={this.state.phaseiid}
                            reltype='0'
                        />
                    </VpTabPane>
                    <VpTabPane tab={'后置里程碑'} key='1'>
                        <PhaseRelate entityid={this.state.entityid}
                            projectid={this.state.iid}
                            phaseid={this.state.phaseiid}
                            reltype='1'
                        />
                    </VpTabPane>
                </VpTabs>
                :
                this.state.isIframe
                    ?
                    <VpTabs destroyInactiveTabPane defaultActiveKey="0" onChange={this.tabsChange} className="phaseTab" >
                        <VpTabPane tab="镜像管理" key='0'>
                            <VpIframe url={this.state.righturl0} />
                        </VpTabPane>
                        <VpTabPane tab="镜像关系视图" key='1'>
                            <VpIframe url={this.state.righturl1} />
                        </VpTabPane>
                        <VpTabPane tab="里程碑关联视图" key='2'>
                            <VpIframe url={this.state.righturl2} />
                        </VpTabPane>
                        <VpTabPane tab="基线比较" key='3'>
                            <VpIframe url={this.state.righturl3} />
                        </VpTabPane>
                    </VpTabs>
                    :
                    this.state.newFlag
                        ?
                        <VpTabs defaultActiveKey="0" onChange={this.tabsChange} >
                            <VpTabPane tab='属性' key='0'>
                                <div className="p-sm bg-white phaseForm" >
                                    <VpDynamicForm
                                        ref={(node) => this.dynamic = node}
                                        bindThis={this}
                                        className="p-sm full-height scroll p-b-xxlg"
                                        formData={this.state.increaseData}
                                        handleOk={(this.props.entityrole && this.state.isedit) ? this.saveRowData : ''}
                                        handleCancel={this.handleCancel}
                                        params={this.state.params}
                                        loading={this.state.loading}
                                        okText="保 存" />
                                </div>
                            </VpTabPane>
                        </VpTabs>
                        :
                        <VpTabs destroyInactiveTabPane defaultActiveKey='0' onChange={(idx) => this.tabsChange(idx)} className="phaseTab">
                            <VpTabPane tab='属性' key='0'>
                                <div className="p-sm bg-white phaseForm" >
                                    <VpDynamicForm
                                        ref={(node) => this.dynamic = node}
                                        bindThis={this}
                                        className="p-sm full-height scroll p-b-xxlg"
                                        formData={this.state.increaseData}
                                        handleOk={(this.props.entityrole && this.state.isedit) ? this.saveRowData : ''}
                                        handleCancel={this.handleCancel}
                                        params={this.state.params}
                                        loading={this.state.loading}
                                        okText="保 存" />
                                </div>
                            </VpTabPane>
                            <VpTabPane tab='关联文档' key='1' >
                                <DocumentList doctype="3" entityrole={this.state.entityrole}
                                    irelentityid={'9'} irelobjectid={this.state.phaseiid}
                                    mainentityid={this.state.entityid} mainiid={this.state.iid} fromtabs='phase'
                                />
                            </VpTabPane>
                            <VpTabPane tab='流程管理' key='2'>
                                <WorkFlow entityid={'9'} iid={this.state.phaseiid} entityrole={this.props.entityrole} />
                            </VpTabPane>
                        </VpTabs>
        );
    }
    // 关闭右侧弹出    
    closeRightModal() {
        this.setState({
            showRightBox: false,
            isClickMenu: false,
            isPhaseRel: false,
            isIframe: false,
            phaseiid: 0
        })
    }

    //渲染之前处理
    onGetFormDataSuccess(data,iclassid){
        let form = data.form

        //if(this.state.add||this.state.newFlag){
            if(iclassid!=91){//空：新建阶段
                form.groups[0].fields.map((item,index)=>{
                    if(item.field_name=="iflowtype"){
                        item.validator.required = false //阶段类别非必填
                    }
                })
            }
        //}
    }

    render() {
        let params = {
            entityrole: this.state.entityrole
        }
        const clearMsg = "执行“清除高层计划”功能，将删除现有高层计划中的所有内容，包括："
            + "\r\t\n 阶段、任务、里程碑、交付物，\r\t\n里程碑关联信息，\r\t\n高层计划与WBS任务计划的映射关系。"
            + "\r\t\n 通常此功能在项目早期的计划阶段用于完全删除高层计划，\r\t\n以便从高层计划模板重新生成高层计划。"
            + "\r\t\n 请确认是否继续执行清除高层计划的操作？\r\t\n"
        return (
            <div className="business-container pr full-height phase">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                    <VpRow gutter={1}>

                        {
                            this.state.isshow ?
                                <VpCol className="gutter-row text-right" sm={24}>
                                    <VpTooltip placement="top" title="生成高层计划">
                                        <VpButton type="primary" icon="link" onClick={() => this.toolBarClick('make')}></VpButton>
                                    </VpTooltip>
                                    {(window.vp.config.vpmbuttonvisible.phasemirror == '1') ?
                                        <VpTooltip placement="top" title="镜像管理">
                                            <VpButton type="primary" style={{ margin: "0 3px" }} icon="setting" onClick={() => this.toolBarClick('relwbs')} ></VpButton>
                                        </VpTooltip> : ''
                                    }
                                    <VpTooltip placement="top" title="清除">
                                        <VpPopconfirm id="aaaa" placement="bottomLeft" title={clearMsg} onConfirm={() => this.toolBarClick('clear')} onCancel={this.cancel}>
                                            <VpButton type="ghost" style={{ margin: "0 3px" }} icon="delete" ></VpButton>
                                        </VpPopconfirm>
                                    </VpTooltip>
                                    <VpTooltip placement="top" title="刷新">
                                        <VpButton type="ghost" style={{ margin: "0 3px" }} icon="reload" onClick={() => this.toolBarClick('refresh')} ></VpButton>
                                    </VpTooltip>
                                    {(window.vp.config.vpmbuttonvisible.phasemirrorview == '1') ?
                                        <VpTooltip placement="top" title='镜像关系视图'>
                                            <VpButton type="ghost" style={{ margin: "0 3px" }} icon="retweet" onClick={() => this.toolBarClick('mirrorView')} ></VpButton>
                                        </VpTooltip> : ''
                                    }
                                    {(window.vp.config.vpmbuttonvisible.phasemilestoneview == '1') ?
                                        <VpTooltip placement="top" title='里程碑关联视图'>
                                            <VpButton type="ghost" style={{ margin: "0 3px" }} icon="menu-unfold" onClick={() => this.toolBarClick('milestone')} ></VpButton>
                                        </VpTooltip> : ''
                                    }
                                    {(window.vp.config.vpmbuttonvisible.phasebaselinecompare == '1') ?
                                        <VpTooltip placement="top" title='基线比较'>
                                            <VpButton type="ghost" style={{ margin: "0 3px" }} icon="android" onClick={() => this.toolBarClick('baseline')} ></VpButton>
                                        </VpTooltip> : ''
                                    }
                                    <VpTooltip placement="top" title='数据导出'>
                                        <VpButton type="ghost" style={{ margin: "0 3px" }} icon="export" onClick={() => this.toolBarClick('export')} ></VpButton>
                                    </VpTooltip>
                                </VpCol>
                                : ""

                        }
                    </VpRow>
                </div>
                <div className="p-sm" id="phaseTable" >
                    <VpTable
                        className="pjphase"
                        onExpand={this.onExpand}
                        columns={this.state.table_headers}
                        dataSource={this.state.table_array}
                        onChange={this.tableChange}
                        onRowClick={this.onRowClick}
                        pagination={this.state.pagination}
                        expandIconColumnIndex={1}
                        rowKey={record => record.iid}
                        expandedRowKeys={this.state.expandedRowKeys}
                        scroll={{ x: 1500, y: this.state.tableHeight }}
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
                        loading={this.state.loading}
                        okText="保 存" />
                </VpModal>

                <RightBox
                    max={this.state.max}
                    button={
                        <div className="icon p-xs" style={{zIndex:3}} onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? this.loadRightWindow() : null}
                </RightBox>
            </div>
        );
    }
}


export default Phase = VpFormCreate(Phase);