import React, { Component } from 'react'
import {
    VpMenu,
    VpMenuItem,
    VpDropdown,
    VpIcon,
    VpTooltip,
    VpTabs,
    VpModal,
    VpTabPane,
    VpButton,
    VpRow,
    VpCol,
    VpFormCreate,
    VpIconFont,
    vpDownLoad,
    vpQuery,
    vpAdd,
    VpIframe,
    VpSubMenu,
    VpRadioButton,
    VpRadioGroup,
    VpInputUploader,
    VpPopconfirm,
    VpSpin,
    VpUploader,
    VpTag,
    VpAlertMsg,
    VpProgress,
    VpSelect,VpOption
} from 'vpreact';
import { NotFind } from 'vplat';
// import SearchForm from 'pages/vfm/dynamic/DynamicForm/SearchForm';
// import Dynamic from 'pages/vfm/dynamic/DynamicForm/dynamic';
// import DocumentList from 'pages/vfm/dynamic/Document/documentList';
import './entityList.less';
import { requireFile } from 'utils/utils';
import SearchForm from "../../templates/dynamic/List/EntitySearchForm";
const Dynamic = requireFile("vfm/DynamicForm/dynamic");
const DocumentList = requireFile("vfm/Document/documentList");


import {
    SeachInput,
    QuickCreate,
    FindCheckbox,
    RightBox,
    EditTableCol,
    VpDTable
} from 'vpbusiness';

//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

//判断变量是否以某个字符串结尾
function endWithStr(field, endStr) {
    var d = field.length - endStr.length;
    return (d >= 0 && field.lastIndexOf(endStr) == d)
}

function getPjTreeHeader() {
    return [
        {
            title: '名称',
            dataIndex: 'sname',
            key: 'sname',
            width: 250,
            fixed: '',
            render: (text, record) => {
                switch (record.ientityid) {
                    case "7":
                        return (
                            <div className="inline-display">
                                <VpTooltip title="项目">
                                    <VpIconFont type="vpicon-project m-lr-xs text-success" />
                                </VpTooltip>
                                {text}
                            </div>
                        )
                        break;
                    case "6":
                        return (
                            <div className="inline-display">
                                <VpTooltip title="项目群">
                                    <VpIconFont type="vpicon-wenben m-lr-xs text-primary" />
                                </VpTooltip>
                                {text}
                            </div>
                        )
                        break;
                    case "8":
                        return (
                            <div className="inline-display">
                                <VpTooltip title="子项目">
                                    <VpIconFont type="vpicon-file-text m-lr-xs text-info" />
                                </VpTooltip>
                                {text}
                            </div>
                        )
                        break;
                    case "114":
                        return (
                            <div className="inline-display">
                                <VpTooltip title="任务">
                                    <VpIconFont type="vpicon-file-zip m-lr-xs text-warning" />
                                </VpTooltip>
                                {text}
                            </div>
                        )
                        break;
                    default:
                        return (
                            <div className="inline-display">
                                {text}
                            </div>
                        )
                        break;
                }
            }
        },
        {
            title: '编号',
            dataIndex: 'scode',
            key: 'scode',
            width: '',
            fixed: ''
        },
        {
            title: '类别',
            dataIndex: 'iclassid',
            key: 'iclassid',
            width: '',
            fixed: ''
        },
        {
            title: '状态',
            dataIndex: 'istatusid',
            key: 'istatusid',
            width: '',
            fixed: ''
        },
        {
            title: '归属部门',
            dataIndex: 'idepartmentid',
            key: 'idepartmentid',
            width: '',
            fixed: ''
        },
        {
            title: '上级项目群组',
            dataIndex: 'iparent',
            key: 'iparent',
            width: '',
            fixed: ''
        },
        {
            title: '负责人',
            dataIndex: 'inamerole',
            key: 'inamerole',
            width: '',
            fixed: ''
        },
    ];
}


class Entity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [],
            visible: false,
            showRightBox: false,
            table_headers: [],
            table_array: [],
            filtervalue: '0', //过滤器值
            quickvalue: '', //快速搜索内容
            increaseData: [], // 新增动态数据
            tabs_array: [],
            filterDropdownVisible: false,
            isAdd: false,
            entityid: '',
            iids: '',
            row_id: '',
            row_entityid: '',
            entityiid: '',
            add: true,
            statusList: [],//状态变迁
            formvalue: {},//表单数据储存
            varilsForm: {},
            viewtype: '',
            entityrole: false,//实体是否有可读或者可写权限
            exShow: false,
            exList: [],
            entityVisible: false,
            toolbar: {},
            rowbar: [],
            SearchFormData: {},
            searchData: [],
            loading: false,
            expandedRowKeys: [],
            tableHeight: '',
            tips: '',
            defaultActiveKey: '0',
            activeKey: '0',
            shrinkShow: true,
            openKeys: ['filter0'],
            view: 'list', //看板视图切换参数
            entityList: [], //有权限新建的实体s
            statusFilters: [],
            classFilters: [],
            myfilters: [],
            currentkey: null,
            scode: '',
            sname: '',
            subItemProjectId: '',
            entitytype: false, //实体类型是否为流程
            spinning: false,
            editrowdata: {},//需要保存的编辑数据
            tableloading: true,
            VpUploader: false,
            filearr: {},
            doctypelist: [],//编辑类表上传文档类型数据源
            selectType: '',
            isClickMenu: false,
            classList: [],
            functionid: '',//功能点id
            searchkey: 1, //强行触发渲染,置空快速搜索框
            isaddflag: 0,
            isdeleteflag: 0
        }
        this.objectid = 0;
        this.closeRightModal = this.closeRightModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handlesearch = this.handlesearch.bind(this);
        this.handleVisibleChange = this.handleVisibleChange.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.dropVisbleChange = this.dropVisbleChange.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.addNewDom = this.addNewDom.bind(this);
        this.getDynamicTabs = this.getDynamicTabs.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.exTypeData = this.exTypeData.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params) {
            if (nextProps.params.entityid != this.props.params.entityid || nextProps.params.isFat != this.props.params.isFat) {
                let searchData=undefined;//清除高级搜索缓存
                //表格排序清除
                this.tableRef.state.sortfield = "";
                this.tableRef.state.sorttype = "";
                this.tableRef.state.sorterObj = undefined;
                this.tableRef.refs.vpTable.state.sortColumn = null;
                this.tableRef.refs.vpTable.state.sortOrder = "";
                this.setState({
                    entityid: nextProps.params.entityid,
                    showRightBox: false,
                    viewtype: nextProps.params.type,
                    functionid: nextProps.params.functionid,
                    tabs_array: [],
                    quickvalue: '',
                    currentclassname: '',
                    searchkey: ++this.state.searchkey,
                    searchData,
                    currentkey:null,
                    ixmbqValue:''
                }, () => {
                    this.getHeader()
                    this.querySearchFormData()
                    this.queryentityList()
                    this.queryEntityType()
                    this.queryclassList()
                    //清除高级搜索
                    this.handleSearchForm()
                    this.getconfig()
                    //调用子组件，清空子组件的查询值
                    if(this.child){
                        this.child.clearSearch()
                    }
                })
            }
            if (nextProps.params.type != this.props.params.type) {
                this.setState({
                    viewtype: nextProps.params.type,
                    showRightBox: false,
                    tabs_array: [],
                    quickvalue: '',
                    currentclassname: '',
                    searchkey: ++this.state.searchkey
                }, () => {
                    this.getHeader()
                    this.querySearchFormData()
                    this.queryentityList()
                    this.queryEntityType()
                    this.getconfig()
                    this.queryclassList()
                    //清除高级搜索
                    this.handleSearchForm()
                })
            }
        } else {
            this.setState({
                viewtype: nextProps.viewtype,
                entityid: nextProps.entityid,
                toolbar: nextProps.toolbar,
                rowbar: nextProps.rowbar,
                showRightBox: false,
                functionid: nextProps.functionid,
                tabs_array: [],
                quickvalue: '',
                currentclassname: '',
                searchkey: ++this.state.searchkey
            }, () => {
                this.getHeader()
                this.queryEntityType()
                this.getconfig()
                this.queryclassList()
            })
        }
    }
    componentWillMount() {
        this.setState({
            entityid: this.props.params ? this.props.params.entityid : this.props.entityid,
            viewtype: this.props.params ? this.props.params.type : this.props.type,
            toolbar: this.props.toolbar,
            rowbar: this.props.rowbar,
            functionid: this.props.params ? this.props.params.functionid : '',
        }, () => {
            this.getHeader()
            this.exTypeData()
            this.querySearchFormData()
            this.queryentityList()
            this.queryEntityType()
            this.loadDocType()
            this.queryclassList()
            //清除高级搜索
            this.handleSearchForm()
            this.getconfig()
            //获取项目标签
            this.getProjectTags();
        })
    }
    componentDidMount() {
        $('.search').find('input').attr('maxlength', 400)
        //优化tabs宽度
        if ($(".ant-tabs-nav-scroll .ant-tabs-nav").width() < $(".ant-tabs-content").width()) {
            $(".ant-tabs-nav-container").removeClass("ant-tabs-nav-container-scrolling")
            $(".ant-tabs-tab-prev").hide()
            $(".ant-tabs-tab-next").hide()
        }
    }
    componentDidUpdate() {
        $(".ixmbqSelect .ant-select-selection__rendered").css({"line-height":"28px","max-height":"28px","overflow":"auto"});
    }
    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }
    /**
     * 获取项目标签
     */
    getProjectTags = () => {
        if(this.state.entityid!=7) {
            return;
        }
        vpQuery('/{bjyh}/util/getFiledDictionaryList', {
            entityid: this.state.entityid,
            fieldname:"ixmbq"
        }).then((res) => {
            if(res.data){
                let vpOptionList = [];
                for(let item of res.data){
                    vpOptionList.push(<VpOption key={item.ivalue} value={item.ivalue}>{item.stext}</VpOption>)
                }
                this.setState({
                    vpOptionList:vpOptionList
                })
            }
        });

    }

    /**
     * 查询实体类别，绑定表单
     */
    queryclassList = () => {
        vpQuery('/{vpplat}/vfrm/tasks/classList', {
            entityid: this.state.entityid
        }).then((response) => {
            let classList = response.data
            this.setState({
                classList
            })
            if (this.state.entityid == 2) {
                if (classList.length == 1) {
                    let viewcode = classList[0].scode
                    let currentclassid = classList[0].iid
                    this.setState({
                        viewcode,
                        currentclassid
                    });
                }
            }
        })
    }

    //编辑列表获取上传文档类型
    loadDocType = () => {
        vpQuery('/{vpplat}/vfrm/entity/doctype', {
            entityid: this.state.entityid
        }).then((response) => {
            this.setState({
                doctypelist: response.data,
                selectType: response.data[0].value
            })
        })
    }
    queryEntityType = () => {
        let _this = this
        vpQuery('/{vpplat}/vfrm/entity/entitytype', {
            entityid: this.state.entityid
        }).then((response) => {
            // let filtervalue = '0'
            // let currentkey = 'filter0'
            // if (_this.props.location == undefined || _this.props.location.state.param == undefined || _this.props.location.state.param.filter == undefined) {
            //     /* let flowtype = response.data.flowtype
            //     let entityid = this.state.entityid
            //     if (entityid == 1 || entityid == 2) {//用户、部门时，默认是启用
            //         filtervalue = '6'
            //     } else {
            //         if (flowtype == 1) {//无状态变迁的默认为我负责的
            //             filtervalue = '1'
            //         } else if (flowtype == 2) {//状态变迁类实体，默认为待处理
            //             filtervalue = '2'
            //         } else {//流程类默认为我负责的
            //             filtervalue = '1'
            //         }
            //     } */

            // } else {
            //     let urlparam = _this.props.location.state.param
            //     filtervalue = urlparam.filter
            //     currentkey = urlparam.currentkey
            //     this.setState({
            //         filtervalue: filtervalue,
            //         currentkey: currentkey,
            //         openKeys: [currentkey],
            //     })
            // }
            this.setState({
                entitytype: response.data.entitytype
            })
        })
    }
    querySearchFormData = () => {
        vpQuery('/{vpplat}/vfrm/entity/searchForm', {
            entityid: this.state.entityid, scode: 'search'
        }).then((response) => {
            this.setState({
                SearchFormData: response.data.form
            })
        })
    }
    // 返回参数给父层控制是否关闭下拉层
    chooseModalVisible = (visible) => {
        this.chooseVisible = visible
    }

    getEditHeader = () => {
        let _this = this;
        let param = {
            entityid: _this.state.entityid,
            viewcode: 'initeditlist',
        }
        vpQuery('/{vpplat}/vfrm/entity/initEditGrids', {
            ...param
        }).then(function (data) {
            if (data) {
                if (data.hasOwnProperty('data')) {
                    let _header = [];
                    let newData = data.data.fields
                    if (newData.length == 0) {
                        VpAlertMsg({
                            message: "消息提示",
                            description: '未查询到编辑列表视图！',
                            type: "error",
                            onClose: this.onClose,
                            closeText: "关闭",
                            showIcon: true
                        }, 5)
                        _this.setState({ table_headers: [] });
                        return
                    }
                    let len = newData.length
                    newData.map(function (records, index) {
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
                                    width: _field_width,
                                    key: data_index,
                                    fixed: _fixed,
                                    render: !records.edit_col ? null : (text, record) => {
                                        return (
                                            <EditTableCol
                                                callBack={_this.callBack}
                                                record={record}
                                                widget={records.widget}
                                                item={{ ...records.widget, irelationentityid: records.irelationentityid }}
                                                value={text}
                                            />
                                        )
                                    }
                                });
                            }
                        }
                    });
                    _header.push({
                        title: '操作', fixed: 'right', width: () => {
                            return (vp.config.vpplat != undefined && vp.config.vpplat.operation != undefined && vp.config.vpplat.operation != undefined && vp.config.vpplat.operation.width != undefined ? vp.config.vpplat.operation.width : 100);
                        }, key: 'operation', render: (text, record) => (
                            <span>
                                <VpTooltip placement="top" title="附件">
                                    <VpIconFont onClick={() => _this.openupload(record)} className="text-primary m-lr-xs cursor" type="vpicon-paperclip" />
                                </VpTooltip>
                                {record.istatusflag == '0' && _this.state.entityaddrole && (record.principal != '0' || _this.state.entityid == '2') ?
                                    <VpTooltip placement="top" title="删除">
                                        <VpPopconfirm title="确定要删除这条信息吗？" onConfirm={() => _this.confirm(record.ientityid, record.iid)} onCancel={_this.cancel}>
                                            <VpIconFont className="cursor m-lr-xs text-danger" type="vpicon-shanchu" />
                                        </VpPopconfirm>
                                    </VpTooltip>
                                    : null
                                }
                                {
                                    record.iid > 0 ?
                                        <VpTooltip placement="top" title="查看详情">
                                            <VpIconFont onClick={() => _this.onRowClick(record, '')} className="text-primary m-lr-xs cursor" type="vpicon-navopen" />
                                        </VpTooltip>
                                        :
                                        null
                                }
                            </span>
                        )
                    });
                    _this.setState({ table_headers: _header, tableloading: false });
                }
            }
        }).catch(function (err) {
            console.log(err);
            _this.setState({ tableloading: false });
        });

    }

    openupload = (record) => {
        let iid = record.iid
        this.state.editrowdata[iid] = record
        this.setState({
            VpUploader: true,
            currentiid: record.iid,
            editrowdata: this.state.editrowdata
        })
    }

    //编辑表格触发回调
    callBack = (rowdata) => {
        let iid = rowdata.iid
        this.state.editrowdata[iid] = rowdata
        this.setState({
            editrowdata: this.state.editrowdata
        })
    }

    //编辑表格新增
    handleEditAdd = () => {
        this.tableRef.addTableRow({ iid: this.objectid-- });
        let theight = vp.computedHeight(1);
        this.setState({
            tableHeight: theight
        })
    }
    //编辑表格保存
    handleEditSave = () => {
        let editData = this.state.editrowdata
        if ($.isEmptyObject(editData)) {
            VpAlertMsg({
                message: "消息提示",
                description: '暂无可保存的数据！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            return;
        }
        let saveData = []
        for (const key in editData) {
            if (editData.hasOwnProperty(key)) {
                const rowdatas = editData[key];
                delete rowdatas['undefined'];
                delete rowdatas['className'];
                let fileinfo = this.state.filearr[rowdatas.iid]
                if (fileinfo != '' && fileinfo != undefined) {
                    rowdatas['fileinfo'] = fileinfo
                }
                for (const field in rowdatas) {
                    if (endWithStr(field, 'val')) {
                        let newfield = field.replace("val", "")
                        rowdatas[newfield] = rowdatas[field]
                    }
                }
                rowdatas.iid = rowdatas.iid > 0 ? rowdatas.iid : ""
                saveData.push(rowdatas)
            }
        }
        vpAdd('/{vpplat}/vfrm/entity/saveEditData', {
            entityid: this.state.entityid,
            editData: JSON.stringify(saveData)
        }).then((response) => {
            this.tableRef.getTableData()
            this.setState({
                editrowdata: {},//需要保存的编辑数据
                filearr: {}
            })
        })
    }
    //编辑表格刷新
    handleReload = () => {
        this.setState({
            tableloading: true
        })
        this.tableRef.getTableData()
    }

    getOptionList = (record) => {
        let list = []
        if (record.ientityid == '6' || record.ientityid == '7') {
            list.push({
                key: 'summary',
                sname: '计算汇总',
                classname: 'cursor m-r-xs f16 text-primary',
                type: 'vpicon-see-o'
            })
        }
        if (record.ientityid == '7') {
            list.push({
                key: 'weekreport',
                sname: '生成周报',
                classname: 'cursor m-r-xs f16 text-primary',
                type: 'vpicon-progress'
            })
        }
        if (record.action) {
            record.action.map((item, index) => {
                list.push({
                    key: item.skey,
                    sname: 'item.sname',
                    classname: 'cursor m-r-xs f16 text-primary',
                    type: 'item.icontype'
                })
            })
        }
        return list;
    }

    //获取表头数据
    getHeader() {
        this.setState({
            tableloading: true
        })
        let _this = this;
        let { viewtype } = _this.state
        if (viewtype == 'edit') {
            this.getEditHeader()
            return
        }
        vpQuery('/{vpplat}/vfrm/entity/getheaders', {
            entityid: _this.state.entityid
        }).then(function (data) {
            if (data) {
                if (data.hasOwnProperty('data')) {
                    let isdeleteflag=data.data.delflag == undefined ? 0 : data.data.delflag
                    _this.setState({
                        loading: false,
                        isdeleteflag,
                        isaddflag: data.data.addflag == undefined ? 0 : data.data.addflag
                    });
                    if (data.data.hasOwnProperty('grid')) {
                        let _header = [];
                        if (data.data.grid.hasOwnProperty('fields')) {
                            data.data.grid.fields.map(function (records, index) {
                                let _title, data_index, _field_width, _fixed,data_type;
                                for (let key in records) {
                                    key == 'field_label' ? _title = records[key] :
                                        key == 'field_name' ? data_index = records[key] : '';
                                    if (key == 'fixed') {
                                        _fixed = records[key];
                                    }
                                    if (key == 'iwidth') {
                                        _field_width = records[key];
                                    }
                                    if(key=='datatype'){
                                        data_type =  records[key];
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
                                            sorter: data_index == 'inamerole' || data_index == 'irolegroupid' || data_index == 'icreator' || data_type=='14' ? false : true //命名角色不排序
                                        });
                                    }
                                }
                            });
                            if (_this.state.view == 'pjtree') {
                                _header = getPjTreeHeader()
                            }
                            //指示灯类型
                            // const indiclass = ['bg-success', 'bg-warning', 'bg-danger']
                            // const lights = (
                            //     <div>
                            //         <VpTooltip title="进度"><VpIconFont type="vpicon-tip" className="m-r-xs text-success" /></VpTooltip>
                            //         <VpTooltip title="成本"><VpIconFont type="vpicon-tip" className="m-r-xs text-primary" /></VpTooltip>
                            //         <VpTooltip title="质量"><VpIconFont type="vpicon-tip" className="m-r-xs text-warning" /></VpTooltip>
                            //         <VpTooltip title="风险"><VpIconFont type="vpicon-tip" className="m-r-xs text-danger" /></VpTooltip>
                            //         {/*  <VpTooltip title="管控模式"><VpIconFont type="vpicon-sitemap" className="m-r-xs text-danger" /></VpTooltip> */}
                            //     </div>
                            // )
                            // const columns = {
                            //     title: lights, width: 115, dataIndex: 'indicator', key: 'indicator',
                            //     render: (value, record) => {
                            //         let ischedule = record.ischeduleindicator
                            //         let icost = record.icostindicator
                            //         let irisk = record.iriskindicator
                            //         let iquality = record.iqualityindicator
                            //         return (
                            //             <div className="indic-wrapper">
                            //                 <span key={0} className={indiclass[ischedule]}></span>
                            //                 <span key={1} className={indiclass[icost]}></span>
                            //                 <span key={2} className={indiclass[irisk]}></span>
                            //                 <span key={3} className={indiclass[iquality]}></span>
                            //                 {/* <VpTooltip title={record.icontroltype == '2'?'敏捷':"瀑布"}>
                            //                 <VpIconFont type={record.icontroltype == '2'?"vpicon-milestone":"vpicon-milepost"} className="m-r-xs text-danger" />
                            //                 </VpTooltip> */}
                            //             </div>
                            //         )
                            //     }
                            // }
                            let _headerNew = _header

                            let { entityid } = _this.state

                            // if (entityid == 6 || entityid == 7 || entityid == 8) {
                            //     _headerNew.unshift(columns)
                            // }
                            _headerNew.map((item, index) => {
                                if (item.key == 'icontrolmode') {
                                    const pop = (
                                        <div className="inline-display">
                                            管控模式
                                        </div>
                                    )
                                    item.title = pop
                                    item.render = (
                                        (text, record) => {
                                            return (
                                                <div className="indic-wrapper">
                                                    {record.icontroltype == '2' ? <VpTag color="blue" className="vp-btn-br p-lr-lg">{record.icontrolmode}</VpTag>
                                                        : <VpTag color="yellow" className="vp-btn-br p-lr-lg">{record.icontrolmode}</VpTag>}
                                                </div>
                                            )
                                        }
                                    )
                                } else if (item.key == 'istatusid') {
                                    item.render = (
                                        (text, record) => {
                                            return (
                                                <div className="indic-wrapper">
                                                    {/* <VpIconFont type={record.istatusflag == '0' ? "vpicon-circle-o text-primary" : "vpicon-circle-o text-primary"} className="m-r-xs" /> */}
                                                    {text}
                                                </div>
                                            )
                                        }
                                    )
                                } else if (item.key == 'iclassid') {
                                    item.render = (
                                        (text, record) => {
                                            return (
                                                <div className="indic-wrapper">
                                                    {
                                                        text
                                                    }
                                                </div>
                                            )
                                        }
                                    )
                                } else if (item.key == 'scurrentphase') {
                                    item.render = (
                                        (text, record) => {
                                            return (
                                                <div className="indic-wrapper">
                                                    {
                                                        text != '' ?
                                                            <VpTag color={record.phasetype == '1' ? 'green' : 'gray'} className="vp-btn-br p-lr-lg">{text}</VpTag>
                                                            : null
                                                    }
                                                </div>
                                            )
                                        }
                                    )
                                }
                                else if (item.key == 'iactualcomplete') {
                                    const statusstr = ['', 'active', 'exception']
                                    item.render = (
                                        (text, record) => {
                                            return (
                                                <div>
                                                    <VpProgress percent={record.iactualcomplete == '' ? "0" : record.iactualcomplete}
                                                        status={statusstr[record.ischeduleindicator]}
                                                        strokeWidth={10} />
                                                </div>
                                            )
                                        }
                                    )
                                }
                            })
                            _headerNew.push({
                                title: '操作', fixed: 'right', width: 100, key: 'operation',
                                render: (text, record) => {
                                    let optionlist = []
                                    let delflag = false
                                    if (record.istatusflag == '0' && _this.state.entityaddrole && (record.principal != '0' || _this.state.entityid == '2')) {
                                        delflag = true
                                    }
                                    else {
                                        delflag = false
                                    }
                                    { // 增加config参数控制操作是否显示，以及显示顺序   add by oyq
                                        (vp.config.vpplat != undefined && vp.config.vpplat.operation != undefined && vp.config.vpplat.operation.oprlist != undefined) ?
                                            vp.config.vpplat.operation.oprlist.map((item, ss) => {
                                                if (item.key == 'collect') {
                                                    let stitle = item.sname == undefined ? "关注" : item.sname
                                                    optionlist.push({
                                                        key: 'collect',
                                                        sname: record.ilike == 0 ? stitle : '取消' + stitle,
                                                        classname: 'text-primary m-lr-xs cursor',
                                                        type: record.ilike == 1 ? "vpicon-star" : "vpicon-star-o"
                                                    });
                                                }
                                                else if (item.key == 'discuss') {
                                                    let stitle = item.sname == undefined ? "评论" : item.sname
                                                    optionlist.push({
                                                        key: 'discuss',
                                                        sname: stitle,
                                                        classname: 'text-primary m-lr-xs cursor',
                                                        type: "vpicon-pinglun"
                                                    });
                                                }
                                                else if (item.key == 'delete' && delflag == true && isdeleteflag =='1') {
                                                    let stitle = item.sname == undefined ? "删除" : item.sname
                                                    optionlist.push({
                                                        key: 'delete',
                                                        sname: stitle,
                                                        classname: 'cursor m-r-xs f16 text-danger',
                                                        type: "vpicon-shanchu"
                                                    });
                                                }
                                            })
                                            :
                                            null
                                    }

                                    if (optionlist.length == 0) {
                                        optionlist.push({
                                            key: 'collect',
                                            sname: record.ilike == 0 ? "关注" : '取消关注',
                                            classname: 'text-primary m-lr-xs cursor',
                                            type: record.ilike == 1 ? "vpicon-star" : "vpicon-star-o"
                                        })
                                        optionlist.push({
                                            key: 'discuss',
                                            sname: '评论',
                                            classname: 'text-primary m-lr-xs cursor',
                                            type: 'vpicon-pinglun'
                                        })

                                        if (delflag == true && isdeleteflag =='1') {
                                            optionlist.push({
                                                key: 'delete',
                                                sname: "删除",
                                                classname: 'cursor m-r-xs f16 text-danger',
                                                type: "vpicon-shanchu"
                                            });
                                        }
                                    }

                                    _this.getOptionList(record).map((item, i) => {
                                        optionlist.push(item)
                                    })

                                    let moreOplit = []
                                    let ishow = (vp.config.vpplat != undefined && vp.config.vpplat.operation != undefined && vp.config.vpplat.operation.count != undefined) ? vp.config.vpplat.operation.count : 2
                                    return (
                                        <span>
                                            {
                                                optionlist.map((item, i) => {
                                                    if (i < ishow) {
                                                        return (item.key == 'delete'&& isdeleteflag =='1' ?
                                                            (
                                                                <VpTooltip placement="top" title="删除">
                                                                    <VpPopconfirm title="确定要删除吗？" onConfirm={() => _this.confirm(record.ientityid, record.iid)}>
                                                                        <VpIconFont onClick={(e) => { e.stopPropagation() }} className={item.classname} type={item.type} />
                                                                    </VpPopconfirm>
                                                                </VpTooltip>
                                                            )
                                                            :
                                                            (
                                                                <VpTooltip placement="top" title={item.sname}>
                                                                    <VpIconFont onClick={(e) => _this.barEvent(item.key, e, record.ientityid, record.iid, record)}
                                                                        className={item.classname} type={item.type} />
                                                                </VpTooltip>
                                                            )
                                                        )
                                                    }
                                                    else {
                                                        moreOplit.push(item)
                                                    }
                                                })

                                            }

                                            {
                                                moreOplit.length > 0 ?
                                                    <VpTooltip placement="top" title="更多">
                                                        {
                                                            _this.state.isClickMenu ? null :
                                                                <VpDropdown overlay={(
                                                                    <VpMenu onClick={(e) => _this.menuClick(e, record.ientityid, record.iid)}>

                                                                        {
                                                                            moreOplit.map((item, index) => {

                                                                                return (
                                                                                    <VpMenuItem key={item.key}>
                                                                                        <VpIconFont className={item.classname} type={item.type} />
                                                                                        {item.sname}
                                                                                    </VpMenuItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </VpMenu>
                                                                )}
                                                                    trigger={['click']}
                                                                    getPopupContainer={() => document.body}
                                                                >
                                                                    <VpIconFont data-id={record.iid} className="cursor m-lr-xs f16" type='vpicon-wait-x'
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                </VpDropdown>
                                                        }

                                                    </VpTooltip>

                                                    : null
                                            }
                                        </span>
                                        // <span>
                                        //     {/* {(record.ientityid == '8') ?
                                        //     <VpTooltip placement="top" title="关联文档">
                                        //         <VpIconFont onClick={(e) => _this.documentList(e, record.ientityid, record.iid)} className="text-primary m-lr-xs cursor" type="vpicon-paperclip" />
                                        //     </VpTooltip>
                                        //     :
                                        //     ''
                                        // } */}
                                        //     <VpTooltip placement="top" title={record.ilike == 0 ? "关注" : '取消关注'}>
                                        //         <VpIconFont onClick={(e) => _this.handleLike(e, record.ientityid, record.iid, record)}
                                        //             className="text-primary m-lr-xs cursor" type={record.ilike == 1 ? "vpicon-star" : "vpicon-star-o"} />
                                        //     </VpTooltip>
                                        //     {
                                        //         _this.state.entityid != 127 ?
                                        //             <VpTooltip placement="top" title="评论">
                                        //                 <VpIconFont onClick={(e) => _this.discuss(e, record.ientityid, record.iid)} className="text-primary m-lr-xs cursor" type="vpicon-pinglun" />
                                        //             </VpTooltip>
                                        //             : null
                                        //     }
                                        //     {/* record.istatusflag == '0' && _this.state.entityaddrole && (record.principal != '0' || _this.state.entityid == '2') ?
                                        //         <VpTooltip placement="top" title="删除">
                                        //             <VpPopconfirm title="确定要删除这条信息吗？" onConfirm={() => _this.confirm(record.ientityid, record.iid)} onCancel={_this.cancel}>
                                        //                 <VpIconFont onClick={(e) => e.stopPropagation()} className="cursor m-lr-xs text-danger" type="vpicon-shanchu" />
                                        //             </VpPopconfirm>
                                        //         </VpTooltip>
                                        //         : null */
                                        //     }
                                        //     {
                                        //         optionlist.length || record.action || record.ientityid == '6' || record.ientityid == '7' ?
                                        //             <VpTooltip placement="top" title="更多">
                                        //                 {
                                        //                     _this.state.isClickMenu ? null :
                                        //                         <VpDropdown overlay={(
                                        //                             <VpMenu onClick={(e) => _this.menuClick(e, record.ientityid, record.iid)}>
                                        //                                 {
                                        //                                     optionlist.map((item, index) => {
                                        //                                         if (item.key == "delete") {
                                        //                                             return (
                                        //                                                 <VpMenuItem key={item.key}>
                                        //                                                     <VpIconFont className="cursor  m-r-xs f16 text-danger" type="vpicon-shanchu" />
                                        //                                                     删除
                                        //                                                 </VpMenuItem>
                                        //                                             )
                                        //                                         } else {
                                        //                                             return (
                                        //                                                 <VpMenuItem key={item.key}>
                                        //                                                     <VpIconFont className={item.classname} type={item.type} />
                                        //                                                     {item.sname}
                                        //                                                 </VpMenuItem>
                                        //                                             )
                                        //                                         }
                                        //                                     })
                                        //                                 }
                                        //                             </VpMenu>
                                        //                         )}
                                        //                             trigger={['click']}
                                        //                             getPopupContainer={() => document.body}
                                        //                         >
                                        //                             <VpIconFont data-id={record.iid} className="cursor m-lr-xs f16" type='vpicon-wait-x'
                                        //                                 onClick={(e) => e.stopPropagation()}
                                        //                             />
                                        //                         </VpDropdown>
                                        //                 }

                                        //             </VpTooltip>

                                        //             : null
                                        //     }
                                        //</span>
                                    )
                                }
                            });

                            _this.setState({ table_headers: _headerNew, tableloading: false });

                        }
                    }
                }
            }

        }).catch(function (err) {
            console.log(err);
        });
    }

    getconfig = () => {
        let _this = this
        //获取导航数据
        vpQuery('/{vpplat}/vfrm/entity/getConfig', {
            entityid: _this.state.entityid
        }).then(function (data) {
            if (data.hasOwnProperty('data')) {
                if (data.data.hasOwnProperty('search')) {
                    let filtervalue = data.data.lastview
                    filtervalue = filtervalue == "" || filtervalue == undefined ? '0' : filtervalue
                    let currentkey = null
                    let filters = data.data.search.filters
                    
                    //去掉‘有红灯的’过滤器
                    if(data.data.search.myfilters){
                        data.data.search.myfilters[0].children.map((item,index)=>{
                            if(item.name==='有红灯的'){
                                data.data.search.myfilters[0].children.splice(index,1)
                            }
                        })
                    }
                    
                    let obj ={
                        // filtervalue: filtervalue,
                        // currentkey: currentkey,
                        // openKeys: [currentkey],
                        filters: filters,
                        statusFilters: data.data.search.statusFilters || [],
                        classFilters: data.data.search.classFilters || [],
                        myfilters: data.data.search.myfilters || []
                    }

                    //功能链接配置过滤器
                    if (_this.props.location == undefined || _this.props.location.state.param == undefined || _this.props.location.state.param.filter == undefined) {
                        obj.filtervalue = filtervalue
                        obj.currentkey = 'filter0'
                        obj.openKeys = ['filter0']
                    } else {
                        let urlparam = _this.props.location.state.param
                        obj.filtervalue = urlparam.filter
                        obj.currentkey = urlparam.currentkey
                        obj.openKeys = [urlparam.currentkey]
                    }
     
                    _this.setState(obj);
                }
                if (data.data.hasOwnProperty('toolbar')) {
                    if (data.data.hasOwnProperty('entityrole')) {
                        _this.setState({ entityaddrole: data.data.entityrole });
                    }
                }

            }
        })
    }

    //排序
    sorter = (a, b) => {

    }

    barEvent = (key, e, entityid, iid, recond) => {
        if (key == 'summary') {
            this.setState({ isClickMenu: true })
            vpAdd('/{vpplat}/vfrm/entity/summary', {
                entityid, iid
            }).then((response) => {
                this.setState({ isClickMenu: false })
                VpAlertMsg({
                    message: "消息提示",
                    description: '计算汇总成功!',
                    type: "success",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            })
        } else if (key == 'weekreport') {
            this.setState({ isClickMenu: true })
            vpQuery('/{vpmprovider}/weekport/addweekreport', {
                projectid: iid,
                startdate: '',
                enddate: ''
            }).then((response) => {
                this.setState({ isClickMenu: false })
                VpAlertMsg({
                    message: "消息提示",
                    description: '生成周报成功!',
                    type: "success",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            })
        }
        else if (key == 'delete') {
            this.confirm(entityid, iid)
        }
        else if (key == 'discuss') {
            this.discuss(e, entityid, iid)
        }
        else if (key == 'collect') {
            this.handleLike(e, entityid, iid, recond)
        }
        else {
            if (entityid == '7' && this.state.viewtype == 'pjtree') {
                iid = iid.substr(0, iid.length - 1);
            }
            this.jumpTabs(key, entityid, iid)
        }
    }

    //更多操作列点击事件
    menuClick = (e, entityid, iid, recond) => {
        this.barEvent(e.key, e, entityid, iid, recond)
    }

    discuss = (e, ientityid, iids) => {
        try {
            e.stopPropagation();
        }
        catch (e) { }
        let skey = 'entity' + ientityid + '_discuss';
        this.jumpTabs(skey, ientityid, iids)
    }

    document = (e, ientityid, iids) => {
        try {
            e.stopPropagation();
        }
        catch (e) { }
        let skey = 'entity' + ientityid + '_file';
        this.jumpTabs(skey, ientityid, iids)
    }

    jumpTabs = (skey, ientityid, iids) => {
        this.getDynamicTabs(true, ientityid, iids)
        this.setState({
            defaultActiveKey: skey + 'tab',
            activeKey: skey + 'tab',
            showRightBox: true,
            entityiid: iids,
            row_entityid: ientityid,
            row_id: iids,
        })
    }

    documentList = (e, ientityid, iids) => {
        try {
            e.stopPropagation();
        }
        catch (e) { }
        let skey = 'entity' + ientityid + '_doclist';
        this.jumpDocListTabs(skey, ientityid, iids)
    }

    jumpDocListTabs = (skey, ientityid, iids) => {
        this.getDynamicTabs(true, ientityid, iids)

        vpQuery('/{vpmprovider}/project/getProjectBySub', {
            subiid: iids,
        }).then((response) => {
            this.setState({
                defaultActiveKey: skey + 'tab',
                activeKey: skey + 'tab',
                showRightBox: true,
                subItemProjectId: response.data.iprojectid,
                entityiid: iids,
                row_entityid: ientityid,
                row_id: iids
            })
        })
    }

    //异步加载树
    onExpand(expanded, record) {
        /* if (this.state.viewtype == 'pjtree' && record.ientityid == '7' && expanded) {
            let iid = record.iid
            vpAdd('/{vpplat}/vfrm/entity/subList', {
                iid: iid.substr(0, iid.length - 1)
            }).then((response) => {
                record.children.splice(0)
                let sublist = response.data
                record.children.push(...sublist)
            })
        } */
        if (!expanded) {
            const idx = this.state.expandedRowKeys.findIndex((iid) => record.key === iid)
            this.setState({
                expandedRowKeys: [...this.state.expandedRowKeys.slice(0, idx), ...this.state.expandedRowKeys.slice(idx + 1)]
            })
        } else {
            this.setState({
                expandedRowKeys: [...this.state.expandedRowKeys, record.key]
            })
        }
    }

    //点击下拉存放ID
    handleDropDown(e) {
        try {
            e.stopPropagation();
        }
        catch (e) { }
    }

    //获取导出类型
    exTypeData() {
        vpQuery('/{vpplat}/vfrm/entity/exListType', {
            entityid: this.state.entityid
        }).then((repsonse) => {
            this.setState({
                exList: repsonse.data
            })
        })
    }

    // 展开行
    getExpandedRowa = (srcArr, resArr) => {
        const _this = this
        let expandArr = resArr
        if (srcArr.length) {
            let tmpArr = []
            srcArr.map((item) => {
                expandArr.push(item.key)
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

    handleSearchForm = (searchData) => {
        this.setState({
            searchData,
            s_visible: false
        })
    }
    //tabs页签
    getDynamicTabs(type, ientityid, iids) {
        if (type) {
            setTimeout(() => {
                vpAdd('/{vpplat}/vfrm/entity/dynamicTabs', {
                    entityid: this.state.viewtype == 'pjtree' ? ientityid : this.state.entityid
                    , iid: iids,
                    functionid: this.state.functionid
                }).then((response) => {
                    const tabs = response.data.tabs;
                    this.setState({
                        tabs_array: tabs
                    }, () => {
                        //优化tabs宽度
                        if ($(".ant-tabs-nav-scroll .ant-tabs-nav").width() < $(".ant-tabs-content").width()) {
                            $(".ant-tabs-nav-container").removeClass("ant-tabs-nav-container-scrolling")
                            $(".ant-tabs-tab-prev").hide()
                            $(".ant-tabs-tab-next").hide()
                        }
                    })
                })
            }, 200);
        } else {
            this.setState({
                tabs_array: []
            })
        }

    }

    dropVisbleChange(visible) {
        this.setState({ filterDropdownVisible: visible })
    }

    // 搜索框确定事件
    handlesearch(value) {
        //const searchVal = value.replace(/\s/g, "");
        const searchVal = $.trim(value);
        if(searchVal!=this.state.quickvalue){
            this.setState({
                quickvalue: searchVal,
                tableloading: true
            })
        }
    }

    onShowSizeChange(value) {
    }


    //删除数据确认事件
    confirm = (entityid, iid) => {
        const _this = this;
        console.log("this",this); 
        vpAdd('/{bjyh}/deleteFlowCheck/Check', {
            iid: iid,
            entityid: entityid
        }).then(function (data) {
            console.log("data",data);
            if(data.flag){
                _this.tableRef.getTableData()
            }else{
                VpAlertMsg({
                    message: "消息提示",
                    description: data.msg,
                    type: "info",
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            } 
        })
        // vpAdd('/{vpplat}/vfrm/entity/deleteData', {
        //     iid: iid,
        //     entityid: entityid
        // }).then(function (data) {
        //     _this.tableRef.getTableData()
        // })
    }

    // 展示右侧弹出
    showModal(e) {
        const { id } = e.target.dataset;
        this.setState({
            showRightBox: true,
            isAdd: false
        })
    }
    // 关闭右侧弹出    
    closeRightModal() {
        this.setState({
            showRightBox: false,
            tabs_array: [],
            add: false,
            currentclassname: ''
        }, () => {
            this.tableRef.getTableData()
        })
        this.props.setBreadCrumb()
    }
    // 新增实体
    addNewAttr(e) {
        let viewcode = ''
        let currentclassid = ''
        let { classList } = this.state
        if (classList.length == 1) {
            viewcode = classList[0].scode
            currentclassid = classList[0].iid
        }
        this.formevent(this.state.entityid, "", viewcode);
        vpQuery('/{vpplat}/vfrm/entity/newformurl', {
            entityid: this.state.entityid
        }).then((response) => {
            let formurl = response.data
            this.setState({
                showRightBox: true,
                add: true,
                entityiid: '',
                statusList: [],
                defaultActiveKey: '0',
                activeKey: '0',
                viewcode,
                currentclassid,
                formurl,
                currentclassname: $(".ant-breadcrumb>span:last>span>a>span").text()
            });
        })
    }
    // 新增实体--带当前行数据
    addNewAttrparam(e) {
        const _this = this;
        let row_id = e.record.iid;
        this.setState({
            showRightBox: true,
            add: true,
            entityiid: '',
            row_id: row_id,
            statusList: []
        });

    }

    //关闭变迁状态弹出的模态框
    handleStatusCancel() {
        this.setState({
            visible: false,
            entityVisible: false,
            varilsForm: {},
        })
    }
    //关闭变迁状态弹出的模态框
    cancelModal() {
        this.setState({
            visible: false,
            entityVisible: false,
            varilsForm: {}
        })
    }
    handleOk() {
        this.setState({
            showRightBox: false,
        })
        this.saveRowData(this.props.form.getFieldsValue());
    }
    handleVisibleChange() {
        if (!this.chooseVisible) {
            let { SearchFormData } = this.state
            if (SearchFormData && SearchFormData.groups.length > 0) {
                this.setState({ s_visible: !this.state.s_visible })
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

    onRowClick(record, index) {
        let iids = record.iid
        let sname = record.sname
        let scode = record.scode
        let ientityid = record.ientityid
        if ((ientityid == '7' || ientityid == '8') && this.state.viewtype == 'pjtree') {
            iids = iids.substr(0, iids.length - 1);
        }
        vpQuery('/{vpplat}/vfrm/entity/EntityCaseExists', {
            entityid: ientityid, iid: iids
        }).then((data) => {
            let flag = data.data
            if (flag) {
                this.setState({
                    showRightBox: true,
                    subItemProjectId: record.iprojectid,
                    add: false,
                    entityiid: iids,
                    row_entityid: ientityid,
                    row_id: iids,
                    s_visible: false,
                    defaultActiveKey: "entity7_generaltab",
                    activeKey: 'entity7_generaltab',
                    sname: sname,
                    scode: scode
                }, () => {
                    this.getDynamicTabs(true, ientityid, iids);
                    this.formevent(ientityid, iids, "");
                });
                this.props.setBreadCrumb(sname)
            } else {
                VpAlertMsg({
                    message: "消息提示",
                    description: '该数据已经被删除！',
                    type: "error",
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                this.tableRef.getTableData()
            }
        })
    }

    //查询表单onsave，onload方法
    formevent = (ientityid, iids, viewtype) => {
        vpQuery('/{vpplat}/vfrm/entity/getformevent', {
            entityid: ientityid, iid: iids, viewtype
        }).then((response) => {
            this.setState({
                eventmap: response.data
            })
        })
    }

    //查询实体权限
    queryentityRole = (entityid, iid) => {
        vpQuery('/{vpplat}/vfrm/entity/entityRole', {
            entityid, iid
        }).then((response) => {
            this.setState({
                entityrole: response.data.entityRole
            })
        })
    }

    handleStatus = (item, value, error) => {

    }
    //点击内容跳转tab
    goToActive(data) {
        //判断传入的值是否为空或者不存在
        if (data && data != undefined && data != null) {
            this.setState({
                activeKey: data + ''
            })
        }
    }
    //点击切换tab
    onTabClick(data) {
        this.setState({
            activeKey: data + ''
        })
    }
    //自定义按钮事件
    // clickThirdPartyBotton(data){
    //     console.log(data)
    //     if(data.sflag == 'FormPrint'){//判断sflag唯一标示
    //         //相关业务逻辑代码
    //         FormPrint()
    //     }else{
    //         console.log(data.sflag)
    //     }
    // }
    onSaveSuccessReload(formData,btnName){
        if(btnName === 'ok'){
            let fields="scode,sname";
            vpQuery('/{vpplat}/api/all/listData', {
                entityid:this.state.entityid,fields,quickSearch:'',condition:JSON.stringify([{field_name:'iid',field_value:formData.data.iid,expression:'eq'}])
            }).then((response) => {
                let record = response.data[0]
                record.iid = formData.data.iid
                record.ientityid=this.state.entityid
                this.onRowClick(record,0);
            })
        }
    }
    addNewDom() {
        let params = {
            iid: this.state.entityiid,
            entityrole: this.state.entityrole,
            data: {
                currentclassid: this.state.currentclassid,
                viewcode: this.state.viewcode
            }
        }
        let { formurl } = this.state
        if (formurl == '' || formurl == undefined) {
            formurl = 'vfm/DynamicForm/dynamic'
        }
        let NewForm = requireFile(formurl) || NotFind
        return (
            <VpTabs defaultActiveKey={this.state.defaultActiveKey} activeKey={this.state.activeKey} onTabClick={this.onTabClick.bind(this)} destroyInactiveTabPane>
                {
                    this.state.tabs_array.length ? this.state.tabs_array.map((item, idx) => {
                        if (item.staburl) {
                            if (item.ilinktype == '1') {
                                return <VpTabPane tab={item.sname} key={item.skey + 'tab'} >
                                    <VpIframe url={item.staburl + "?entityid=" + this.state.entityid + "&iid=" + this.state.entityiid} />
                                </VpTabPane>
                            } else {
                                let tabUrl = item.staburl.split('?')
                                let staburl = tabUrl[0]
                                let stabparam = ''
                                if (tabUrl.length > 1) {
                                    stabparam = tabUrl[1]
                                }
                                let skey = item.skey;
                                let skeyentity = "entity" + this.state.entityid + "_doclist";
                                if (skey != skeyentity) {
                                    let Tabs = requireFile(staburl) || NotFind
                                    return <VpTabPane tab={item.sname} key={item.skey == undefined ? idx : item.skey + 'tab'} >
                                        <Tabs
                                            setBreadCrumb={(sname) => this.props.setBreadCrumb(sname)}
                                            entitytype={this.state.entitytype} //实体发起类型
                                            eventmap={this.state.eventmap} //表单onsave，onload方法
                                            add={false}
                                            bindThis={this}
                                            entityname={this.state.sname}
                                            params={params}
                                            closeRightModal={() => this.closeRightModal()}
                                            refreshList={() => this.tableRef.getTableData()}
                                            entityid={this.state.entityid}
                                            iid={this.state.entityiid}
                                            irelationid={item.iid}
                                            imainentity={item.imainentity}
                                            irelationentity={item.irelationentity}
                                            row_entityid={this.state.row_entityid}
                                            skey={item.skey}
                                            issubitem={item.issubitem}
                                            row_id={this.state.row_id}
                                            viewtype={this.state.viewtype}
                                            iaccesslevel={item.iaccesslevel} //(0:读 1:写)
                                            entityrole={item.iaccesslevel == '1' ? true : false}
                                            stabparam={stabparam}
                                            doctype="3"
                                            goToActive={this.goToActive.bind(this)}
                                            tabsArray={this.state.tabs_array}
                                        // isThirdPartyBottonlist={this.state.isThirdPartyBottonlist}//自定义按钮数据源
                                        // clickThirdPartyBotton={this.clickThirdPartyBotton.bind(this)}//自定义按钮事件
                                        />
                                    </VpTabPane>
                                } else {
                                    let Tabs = requireFile(staburl)
                                    return <VpTabPane tab={item.sname} key={item.skey == undefined ? idx : item.skey + 'tab'} >
                                        <DocumentList doctype="3"
                                            iaccesslevel={item.iaccesslevel} //(0:读 1:写)
                                            entityrole={item.iaccesslevel == '1' ? true : false}
                                            irelentityid={this.state.row_entityid}
                                            irelobjectid={this.state.row_id}
                                            mainentityid="7"
                                            mainiid={this.state.subItemProjectId} />
                                    </VpTabPane>
                                }
                            }
                        }

                        return (
                            <VpTabPane tab={item.sname} key={idx + 'tabs'} >

                            </VpTabPane>
                        )
                    }) :
                        <VpTabPane tab='属性' key={'0'} >
                            {
                                this.state.add ?
                                    <NewForm
                                        setBreadCrumb={(sname) => this.props.setBreadCrumb(sname + this.state.currentclassname)}
                                        params={params}
                                        entitytype={this.state.entitytype} //实体发起类型
                                        eventmap={this.state.eventmap} //表单onsave，onload方法
                                        add={true}
                                        bindThis={this}
                                        entityrole={true}
                                        onSaveSuccessReload={this.onSaveSuccessReload}
                                        closeRightModal={() => this.closeRightModal()}
                                        refreshList={() => this.tableRef.getTableData()}
                                        row_id=''
                                        row_entityid={this.state.entityid}
                                    /> : ''
                            }
                        </VpTabPane>
                }
            </VpTabs>
        );
    }

    //导入导出模板点击事件
    handleMenuClick(e) {
        let type = e.item.props.type
        let key = e.key
        if (type == 5) {
            this.setState({
                entityVisible: true
            })
        } else {
            let param = {}
            const searchData = this.state.searchData?[...this.state.searchData]:[];
            if(this.state.entityid==7&&!!this.state.ixmbqValue){
                searchData.push({field_name:"ixmbq",expression:"in",field_value:this.state.ixmbqValue});
            }
            vpDownLoad("/{vpplat}/vfrm/ent/exportfile", {
                quickvalue: this.state.quickvalue,
                ientityid: this.state.entityid,
                type: 'expdata',
                viewcode: 'expexcel',
                filtervalue: this.state.filtervalue,
                currentkey: this.state.currentkey,
                condition: JSON.stringify(searchData)
            })
        }
    }

    handleSubmit(type) {
        if (type == 'upload') {
            //导入数据
            this.inputUploader.upload.upload()
        } else {
            //导出数据
            vpDownLoad("/{vpplat}/vfrm/ent/exportfile",
                {
                    ientityid: this.state.entityid,
                    type: ''
                })
        }
    }

    uploadSuccess = (file, res) => {
        VpAlertMsg({
            message: "消息提示",
            description: '导入成功！',
            type: "success",
            onClose: this.onClose,
            closeText: "关闭",
            showIcon: true
        }, 5)
        this.setState({
            entityVisible: false
        }, () => this.tableRef.getTableData())
    }

    uploadClick = () => {
        this.inputUploader.upload.on("beforeFileQueued", (file) => {
            this.props.form.setFieldsValue({ "xls_label": file.name })
        })
    }

    inputUploaderChange = (value) => {
    }

    cancelSearch = () => {
        this.setState({
            s_visible: false
        })
    }

    handleLike = (e, ientityid, iid, record) => {
        try {
            e.stopPropagation();
        }
        catch (e) { }
        vpAdd('/{vpplat}/vfrm/entity/handleLike', {
            ientityid,
            iid,
            record: JSON.stringify(record)
        }).then((data) => {
            this.tableRef.getTableData()
        })
    }

    //左侧伸缩
    shrinkLeft = (e) => {
        this.setState({
            shrinkShow: !this.state.shrinkShow
        })
    }

    //点击菜单
    handleClick = (e) => {
        let filtervalue = e.key;
        let openKeys = e.keyPath.slice(1);
        let currentkey = e.keyPath.slice(1)[0];
        if (this.state.filtervalue == filtervalue && this.state.currentkey == currentkey) {
            return;
        } else {
            this.setState({
                filtervalue,
                openKeys,
                currentkey,
                tableloading: true
            });
        }
    }

    onToggle = (info) => {
        this.setState({
            openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
        });
    }

    //看板视图切换
    handleViewChange = (e) => {
        this.setState({
            view: e.target.value,
            viewtype: e.target.value
        }, () => {
            this.getHeader()
        })
    }

    queryentityList = () => {
        vpQuery('/{vpplat}/vfrm/entity/entityList', {

        }).then((response) => {
            this.setState({
                entityList: response.data
            })
        })
    }

     /**
     * 子组件注册到父组件中
     */
    onRef = (ref) =>{
        this.child = ref;
    }


    handleNewClick = (e) => {
        this.queryentityRole(e.key, '')
        this.setState({
            showRightBox: true,
            add: true,
            entityiid: '',
            statusList: [],
            entityid: e.key,
            defaultActiveKey: '0'
        })
    }

    controlAddButton = (numPerPage, resultList) => {
        
        let theight = vp.computedHeight(resultList.length, '.entityTable')
        if (this.props.fromtype == 'resource') {
            theight = theight - 50
        }
        let expandArr = this.getExpandedRowa(resultList, [])
        //设置展开行
        this.setState({
            tableloading: false,
            expandedRowKeys: expandArr,
            tableHeight: theight
        })

    }

    onUploadAccept = (file, response) => {
        const _this = this
        let fileinfo = { fileid: response.data.fileid, doctype: response.data.doctype }
        if (_this.state.filearr[_this.state.currentiid] != undefined &&
            _this.state.filearr[_this.state.currentiid] != null) {

            _this.state.filearr[_this.state.currentiid] = [
                ..._this.state.filearr[_this.state.currentiid],
                fileinfo
            ]
        } else {
            _this.state.filearr[_this.state.currentiid] = [
                fileinfo
            ]
        }
        this.setState({
            filearr: _this.state.filearr
        })
    }

    handleFileCancel = () => {
        this.setState({
            VpUploader: false
        })
    }
    handleNewFormClick = (e) => {
        let viewcode = e.key.split(",")[1]
        let currentclassid = e.key.split(",")[0]
        let currentclassname = e.domEvent.currentTarget.innerText
        this.formevent(this.state.entityid, "", viewcode);
        vpQuery('/{vpplat}/vfrm/entity/newformurl', {
            entityid: this.state.entityid
        }).then((response) => {
            let formurl = response.data
            this.setState({
                showRightBox: true,
                row_entityid: this.state.entityid,
                row_id: '',
                add: true,
                entityiid: '',
                statusList: [],
                defaultActiveKey: '0',
                activeKey: '0',
                viewcode,
                currentclassid,
                formurl,
                currentclassname
            });
        })
    }
    /**
     * 项目标签
     */
    onChange_ixmbq = (value) => {
        this.setState({
            ixmbqValue:value.join()
        })
    }

    render() {
        const _this = this
        const searchData = this.state.searchData?[...this.state.searchData]:[];
        if(this.state.entityid==7&&!!this.state.ixmbqValue){
            let ixmbqValueTemp = this.state.ixmbqValue.split(",");
            for(var i=0; i<ixmbqValueTemp.length; i++){
                searchData.push({field_name:"ixmbq",expression:"eq",field_value:ixmbqValueTemp[i]});
            }
        }
        const params = {
            entityid: this.state.entityid,
            currentkey: this.state.currentkey,
            condition: JSON.stringify(searchData),
            filtervalue: this.state.filtervalue,
            quickSearch: this.state.quickvalue,
            viewtype: this.state.viewtype == 'edit' ? 'initeditlist' : this.state.viewtype,
            datafilter: 'auth'//权限过滤需要加这个参数
        }        
        let vpplat = window.vp.config.vpplat
        let custFilter = []
        if (vpplat == undefined || vpplat.custFilter == undefined) {
			if(_this.state.entityid==3||_this.state.entityid==205){
				custFilter = ["filter", "class"]
			}else{
				custFilter = ["filter", "status", "class"]
			}
            
        } else {
            custFilter = vpplat.custFilter || []
        }
        const classList = (
            <VpMenu onClick={this.handleNewFormClick}>
                {
                    this.state.classList.map((item, index) => {
                        return <VpMenuItem key={item.iid + ',' + item.scode}><VpIconFont type={item.icon} /> {item.sname}</VpMenuItem>
                    })

                }
            </VpMenu>
        )
        let options = []
        if (this.state.viewtype == 'edit' && this.state.entityaddrole) {
            options = [
                {
                    title: '新增',
                    tooltip: false,
                    className: 'cursor blue',
                    type: 'plus-circle-o',
                    iconClickFunction: this.handleEditAdd,
                },
                {
                    title: '保存',
                    tooltip: false,
                    className: 'cursor green',
                    type: 'save',
                    iconClickFunction: this.handleEditSave
                },
                {
                    title: '刷新',
                    tooltip: false,
                    className: 'cursor sky_blue',
                    type: 'reload',
                    iconClickFunction: this.handleReload
                }
            ]
        }

        const extypeList = (
            <VpMenu onClick={this.handleMenuClick}>
                {
                    _this.state.exList.map((item, index) => {
                        return (
                            <VpMenuItem key={item.iid} type={item.iviewtype}>{item.sname}</VpMenuItem>
                        )
                    })
                }
            </VpMenu>
        )
        const menu = (
            <div className="search-form bg-white ant-dropdown-menu">
            <SearchForm 
                onRef = {this.onRef}
                chooseModalVisible={this.chooseModalVisible}
                    cancelSearch={this.cancelSearch}
                    handleSearchForm={this.handleSearchForm}
                    entityid={this.props.params.entityid}
                    formData={this.state.SearchFormData} />
            </div>
        )
        const entityList = (
            <VpMenu onClick={this.handleNewClick}>
                {
                    this.state.entityList.map((item, index) => {
                        return <VpMenuItem key={item.entityid}>{item.sname}</VpMenuItem>
                    })

                }
            </VpMenu>
        )
        let { viewtype, entityid } = this.state;

        return (
            <div className="business-container pr full-height entity">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                    <VpRow gutter={10}>
                        <VpCol className="gutter-row" span={4}>
                            <div className="m-b-sm search entitysearch" >
                                <SeachInput key={this.state.searchkey} onSearch={this.handlesearch} />
                            </div>
                        </VpCol>
                        { this.state.entityid==7?
                            (<VpCol className="gutter-row" span={6}>
                                <div className="m-b-sm ixmbqSelect" >
                                    <VpSelect multiple style={{ width: '100%' }} 
                                        optionFilterProp="children"
                                        placeholder="请选择项目标签"
                                        onChange={this.onChange_ixmbq}>

                                        {this.state.vpOptionList}

                                    </VpSelect>
                                </div>
                            </VpCol>):null
                        }
                        <VpCol className="gutter-row text-right" span={this.state.entityid==7?14:20}>
                            {
                                this.state.entityaddrole && this.state.isaddflag == 1 ?
                                    viewtype == 'pjtree' ?
                                        this.state.entityList.length > 0 ?
                                            <VpTooltip placement="top" title="快速创建">
                                                <VpDropdown
                                                    trigger={['click']}
                                                    overlay={entityList}
                                                >
                                                    <div style={{ display: 'inline-block' }}>
                                                        <VpButton type="primary" shape="circle" icon="plus" className="m-l-xs" />
                                                    </div>
                                                </VpDropdown>
                                            </VpTooltip>
                                            : ''
                                        :

                                        this.state.classList.length > 1 && this.state.isaddflag == 1 ?
                                            <VpTooltip placement="top" title="快速创建">
                                                <VpDropdown
                                                    trigger={['click']}
                                                    overlay={classList}
                                                >
                                                    <div style={{ display: 'inline-block' }}>
                                                        <VpButton type="primary" shape="circle" icon="plus" className="m-l-xs" />
                                                    </div>
                                                </VpDropdown>
                                            </VpTooltip> : <div style={{ display: 'inline-block' }} onClick={_this.addNewAttr.bind(_this)}><QuickCreate /></div>
                                    : ''
                            }
                            {
                                (this.state.entityaddrole &&this.state.entityid!=204)?
                                    <VpDropdown
                                        trigger={['click']}
                                        overlay={extypeList}
                                    >
                                        <div style={{ display: 'inline-block' }}>
                                            <VpTooltip placement="top" title="导入导出">
                                                <VpButton type="ghost" shape="circle" className="m-l-xs">
                                                    <VpIcon type="cloud-upload" />
                                                </VpButton>
                                            </VpTooltip>
                                        </div>
                                    </VpDropdown>
                                    : null
                            }

                            {
                                _this.state.toolbar ?
                                    _this.state.toolbar.hasOwnProperty('left') ?
                                        _this.state.toolbar.left.advanced ?
                                            <VpDropdown
                                                onClick={this.handleVisibleChange} trigger={['click']}
                                                overlay={menu}
                                                onVisibleChange={this.handleVisibleChange}
                                                visible={this.state.s_visible}>
                                                <div style={{ display: 'inline-block' }} id="searchbox">
                                                    <FindCheckbox />
                                                </div>
                                            </VpDropdown>
                                            : '' : ''
                                    :
                                    <VpDropdown
                                        onClick={this.handleVisibleChange}
                                        trigger={['click']}
                                        overlay={menu}
                                        onVisibleChange={this.handleVisibleChange}
                                        visible={this.state.s_visible}>
                                        <div style={{ display: 'inline-block' }} id="searchbox">
                                            <FindCheckbox />
                                        </div>
                                    </VpDropdown>
                            }

                            <div className="fr m-l-xs">
                                <VpRadioGroup defaultValue="list" className="radio-tab" onChange={this.handleViewChange}>
                                    {
                                        (vp.config.vpplat != undefined && vp.config.vpplat.viewlist != undefined && vp.config.vpplat.viewlist.tree == true)
                                            && (this.state.entityid == '6' || this.state.entityid == '7' || this.state.entityid == '8') ?
                                            <VpRadioButton value="pjtree">
                                                <VpTooltip placement="top" title="树表视图">
                                                    <VpIconFont type="vpicon-file-tree" />
                                                </VpTooltip>
                                            </VpRadioButton> :
                                            null
                                    }

                                    {
                                        vp.config.vpplat != undefined && vp.config.vpplat.viewlist != undefined && vp.config.vpplat.viewlist.list == true ?
                                            <VpRadioButton value={this.state.entityid == 1 ? "tree" : "list"}>
                                                <VpTooltip placement="top" title="列表视图">
                                                    <VpIconFont type="vpicon-navlist" />
                                                </VpTooltip>
                                            </VpRadioButton>
                                            : null
                                    }

                                    {
                                        vp.config.vpplat != undefined && vp.config.vpplat.viewlist != undefined && vp.config.vpplat.viewlist.editList == true ?
                                            <VpRadioButton value="edit">
                                                <VpTooltip placement="top" title="编辑视图">
                                                    <VpIconFont type="vpicon-fenlei" />
                                                </VpTooltip>
                                            </VpRadioButton>
                                            : null
                                    }
                                </VpRadioGroup>
                            </div>
                        </VpCol>
                    </VpRow>
                </div>

                <div className="business-wrapper p-t-sm full-height" id="table">
                    <div className="bg-white p-sm entity-list full-height">
                        <VpRow gutter={16} className="full-height">
                            <VpCol span={custFilter.length ? this.state.shrinkShow ? '4' : '0' : '0'} className="full-height pr menuleft">
                                <VpMenu className="full-height scroll-y entity-left-css" onClick={this.handleClick}
                                    openKeys={this.state.openKeys}
                                    onOpen={this.onToggle}
                                    onClose={this.onToggle}
                                    selectedKeys={[this.state.filtervalue]}
                                    mode="inline">
                                    {
                                        custFilter.map((item, index) => {
                                            if (item == "filter") {
                                                return (
                                                    this.state.myfilters.map((filterinfo, index) => {
                                                        return (
                                                            <VpSubMenu key={"filter" + index} title={<span><VpIconFont type={filterinfo.icon || "vpicon-filter"} className="m-r-xs" /><span>{filterinfo.name}</span></span>}>
                                                                {
                                                                    filterinfo.children.map((item, index) => {
                                                                        return <VpMenuItem key={item.value} className="menu-text-overflow">{item.name}</VpMenuItem>
                                                                    })
                                                                }
                                                            </VpSubMenu>
                                                        )
                                                    })
                                                )
                                            } else if (item == "class") {
                                                return (
                                                    <VpSubMenu key="class" title={<span><VpIconFont type="vpicon-fenlei" className="m-r-xs" /><span>类别</span></span>}>
                                                        {
                                                            this.state.classFilters.map((item, index) => {
                                                                return <VpMenuItem key={item.value} className="menu-text-overflow">{item.name}</VpMenuItem>
                                                            })
                                                        }
                                                        <VpMenuItem key='0'>全部</VpMenuItem>
                                                    </VpSubMenu>
                                                )
                                            } else if (item == "status") {
                                                return (
                                                    <VpSubMenu key="status" title={<span><VpIconFont type="vpicon-loading" className="m-r-xs" /><span>状态</span></span>}>
                                                        {
                                                            this.state.statusFilters.map((item, index) => {
                                                                return <VpMenuItem key={item.value} className="menu-text-overflow">{item.name}</VpMenuItem>
                                                            })
                                                        }
                                                        <VpMenuItem key='0'>全部</VpMenuItem>
                                                    </VpSubMenu>
                                                )
                                            }
                                        })
                                    }
                                </VpMenu>
                                {custFilter.length ? this.state.shrinkShow ?
                                    <div className="navswitch cursor text-center" onClick={this.shrinkLeft}>
                                        <VpIconFont type="vpicon-navclose" />
                                    </div>
                                    :
                                    null
                                    :
                                    null
                                }

                            </VpCol>
                            <VpCol span={custFilter.length ? this.state.shrinkShow ? '20' : '24' : '24'} className="full-height scroll-y">
                                {this.state.shrinkShow ?
                                    null
                                    :
                                    <div className="shrink p-tb-sm cursor text-center" onClick={this.shrinkLeft}>
                                        <VpIconFont type="vpicon-navopen" />
                                    </div>
                                }
                                <VpSpin spinning={this.state.spinning} size="large">
                                    {
                                        this.state.currentkey?
                                            <div id="vp-entity-drown" className={this.state.viewtype == 'edit' ? "batch-table" : ""}>
                                                <VpDTable
                                                    loading={this.state.tableloading}
                                                    ref={table => this.tableRef = table}
                                                    queryMethod="POST"
                                                    onExpand={this.onExpand}
                                                    expandedRowKeys={this.state.expandedRowKeys}
                                                    controlAddButton={
                                                        (numPerPage, resultList) => {
                                                            this.controlAddButton(numPerPage, resultList)
                                                        }
                                                    }
                                                    dataUrl={'/{vpplat}/vfrm/entity/dynamicListData'}
                                                    params={params}
                                                    className="entityTable"
                                                    expandIconColumnIndex={
                                                        entityid == 6 || entityid == 7 || entityid == 8 || entityid == 114 ? 1 : 0}
                                                    columns={this.state.table_headers}
                                                    onRowClick={this.state.viewtype == 'edit' ? null : this.onRowClick}
                                                    tableOptions={options}
                                                    bindThis={this}
                                                    rowKey={this.state.viewtype == 'edit' ? 'iid' : 'key'}
                                                    showTotal={this.state.viewtype == 'tree' || this.state.viewtype == 'pjtree' ? true : false}
                                                    resize
                                                    scroll={{ y: this.state.tableHeight }}
                                                />
                                            </div>
                                            : null
                                    }
                                </VpSpin>
                            </VpCol>
                        </VpRow>
                    </div>
                </div>

                <div className="drawer-fixed p-sm hide">
                    <div className="pr full-height">
                        <div className="spin-icon" onclick="closeDrawer">
                            <VpIcon type="verticle-left" />
                        </div>
                        <div className="drawer-box">

                        </div>
                    </div>
                </div>
                <RightBox
                    max={!this.state.isAdd}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? this.addNewDom() : null}
                </RightBox>
                <VpModal
                    title='实体导入'
                    visible={this.state.entityVisible}
                    onCancel={() => this.cancelModal()}
                    width={'70%'}
                    footer={null}
                    wrapClassName='modal-no-footer'
                >
                    {
                        this.state.entityVisible ?
                            <div onClick={this.uploadClick}>
                                <VpInputUploader form={this.props.form} item={{
                                    field_name: "xls",
                                    widget_type: "inputupload",
                                    field_label: "选择文件",
                                    all_line: 2,
                                    tips: '请选择文件（*.xls,*.xlsx)',
                                    auto: false,
                                    widget: {
                                        accept: {
                                            title: 'Xls',
                                            extensions: 'xlsx,xls',
                                        },
                                        upload_url: "/{vpplat}/vfrm/ent/importfile?entityid=" + this.state.entityid,
                                    }
                                }}
                                    ref={upload => this.inputUploader = upload}
                                    onUploadAccept={this.uploadSuccess} />
                            </div>
                            : null
                    }
                    <div className="footFixed p-sm b-t text-center">
                        <VpButton type="primary" onClick={() => this.handleSubmit('upload')}>导入数据</VpButton>
                        <VpButton style={{ marginLeft: '10px' }} type="primary" onClick={() => this.handleSubmit('download')}>下载模板</VpButton>
                    </div>
                </VpModal>
                <VpModal
                    title="选择附件"
                    visible={this.state.VpUploader}
                    onOk={this.handleFileCancel}
                    onCancel={this.handleFileCancel}
                    width={'70%'}
                    height={'80%'}
                    wrapClassName='modal-no-footer dynamic-modal'>
                    {
                        this.state.VpUploader ?
                            <VpUploader
                                server="/{vpplat}/file/uploadfile"
                                onUploadAccept={this.onUploadAccept}
                                fileTypes={this.state.doctypelist}
                                selectType={this.state.selectType}
                            />
                            : null
                    }

                </VpModal>

            </div>
        );
    }
}


export default Entity = VpFormCreate(Entity);