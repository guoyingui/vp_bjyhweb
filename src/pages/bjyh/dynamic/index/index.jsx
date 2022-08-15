import React, { Component } from "react";
import {
    VpMInfo,
    VpRow,
    VpCol,
    VpIconFont,
    VpIcon,
    VpTooltip,
    VpDropdown,
    VpMenu,
    VpMenuItem,
    VpButton,
    VpModal,
    vpQuery,
    VpBadge,
    vpAdd,
    VpTable,
    VpAlertMsg,
    VpMSuccess,
    VpTabPane,
    VpTabs
} from "vpreact";
import { Table } from 'antd';
import EditTool from "./editTool";
import XtggList from "./xtggList";
import { CustomForm } from 'vpbusiness';
import { requireFile } from "utils/utils";

import { Link } from 'react-router';
import Flowtabs from '../../../templates/dynamic/Flow/FlowHandler';    //../../../templates/dynamic/Flow/FlowHandler
//const DynamicTabs = requireFile('vfm/DynamicTabs/dynamictabs');
//const DynamicTabs = requireFile('bjyh/dynamic/tastdynamictabs');
import DynamicTabs from '../../../templates/dynamic/Form/tastdynamictabs'; 

const VpHandleForm = requireFile('vfm/VpHandleForm/index');
import "./index.less";
import {
    RightBox,
    VpDTable
} from 'vpbusiness';
import { formDataToWidgetProps } from "../../../templates/dynamic/Form/Widgets"
import { Base64 } from 'js-base64';
import HomePageExt from './homePageExt'
const DESKEY = 'sGhygzya8Qo='

const homePageExt = new HomePageExt();
homePageExt.checkReadedNotice();
const processArray = [{
    icon: 'vpicon-project',
    color: '#466771',
    sname: '项目申请',
    //surl: 'entity/list/266/732',
    surl: '',
    ientityId: 266
}, {
    icon: 'vpicon-plus-circle-o',
    color: '#466771',
    sname: '上线申请',
    //surl: 'entity/list/267/753',
    surl: '',
    ientityId: 267
}, {
    icon: 'vpicon-circulation',
    color: '#466771',
    sname: '需求变更',
    //surl: 'entity/list/268/774',
    surl: '',
    ientityId: 268
}, {
    icon: 'vpicon-lingcunwei',
    color: '#466771',
    sname: 'ODS数据下发',
    //surl: 'entity/list/275/921',
    surl: '',
    ientityId: 275
}, {
    icon: 'vpicon-pinglun',
    color: '#466771',
    sname: '项目后评价',
    //surl: 'entity/list/269/795',
    surl: '',
    ientityId: 269
}, {
    icon: 'vpicon-handle',
    color: '#466771',
    sname: '项目暂停',
    //surl: 'entity/list/270/816',
    surl: '',
    ientityId: 270
}, {
    icon: 'vpicon-implement',
    color: '#466771',
    sname: '项目重启',
    //surl: 'entity/list/271/837',
    surl: '',
    ientityId: 271
}, {
    icon: 'vpicon-close-circle',
    color: '#466771',
    sname: '项目取消',
    //surl: 'entity/list/272/858',
    surl: '',
    ientityId: 272
}, {
    icon: 'vpicon-demand',
    color: '#466771',
    sname: '分行自建项目申请',
    //surl: 'entity/list/274/900',
    surl: '',
    ientityId: 274
},]

export default class Workbench extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commission: [],
            woritem: [],
            woritemlist: [],
            warning: [],
            selected: {},
            selectkey: 0,
            dispose: true,
            editTool: false,
            editToolList: [{
                icon: 'vpicon-sitemap',
                color: '#2db7f5',
                sname: '结构'
            }, {
                icon: 'vpicon-image',
                color: '#f60',
                sname: '图片'
            }],
            ProcessStatus: [],
            mytoollist: [],
            myflowcount: 0,
            mytimesheetcount: 0,
            warningcount: 0,
            varivisible: false,
            showRightBox: false,
            showTabsRightBox: false,
            tabsentityid: '',
            tabsiid: '',
            activityName: '',
            // removeToolList: [],
            noticeList: [],   //公告列表
            attentionList: [],   //关注项目列表
            showFlowSub6  : true , //显示批量处理sub6选项卡
        };
        this.callbackFn = this.callbackFn.bind(this)
    }
    componentWillMount() {
        this.getMyTimesheet();
        this.getMyworkitem();
        this.getMyworkitems();
        this.queryMessage();
        this.getMyTools();
        this.addNoticeList();
        this.addAttentionList();
        this.showFlowSub6();
    }

    showFlowSub6 = () =>{
        vpQuery('/{bjyh}/workFlowBatch/getShowFlag1', {
            userId: vp.cookie.getTkInfo('userid')
        }).then((response) => {
            this.setState({showFlowSub6 :response.data.flag});           
        })
    }

    handleClick = (e, key) => {
        $(".work-big-box").attr("class", "bg-gray work-big-box");
        let _box = $(e.target).parents(".work-big-box");
        $(_box[0]).attr("class", "selected work-big-box");
        this.setState({
            selected: { [key]: true },
            selectkey: key
        }, () => this.getMyworkitems())
    }

    changeMenu(e, key, title, router, address) {
        // e.stopPropagation();
        // let _this = window.app;
        // _this.addTabs(key, title, router);
        //改成新建页面
        this.handleNewFormClick(key)
    }

    handleOk = () => {
        this.setState({ visible: false });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }


    handleEditTool = () => {
        this.setState({ editTool: !this.state.editTool });
    }
    handleEditToolRemove = (e, id) => {
        this.state.editToolList.map((item, index) => {
            if (item.iid == id) {
                // this.state.removeToolList.push(id);
                this.state.editToolList.splice(index, 1);
            }
        });
        this.setState({
            editToolList: this.state.editToolList,
            // removeToolList: this.state.removeToolList
        });

        let sparam = {
            iid: id,
        }
        //删除数据
        vpAdd('/{vpplat}/workbench/delete',
            sparam
        ).then(function (data) {

        })
    }
    handleEditToolAdd = () => {
        this.setState({ visible: true });
    }
    getToolAddList = (list) => {
        if (list) {
            this.state.editToolList.push(...list);
        }
        this.setState({ editToolList: this.state.editToolList });
    }
    //左下角发起业务流程显示
    getMyTools = () => {
        vpQuery('/{vpplat}/cfgfunctionnav/list', {
        
        }).then((data) => {
            if(!data.data){
                return
            }
            let entityarr = []
            let ProcessStatus = []
            const cfglist = data.data.data
            for (const key in cfglist) {
                if (cfglist.hasOwnProperty(key)) {
                    const element = cfglist[key].children;
                    for (const key2 in element) {
                        if (element.hasOwnProperty(key2)) {
                            const element2 = element[key2];
                            entityarr.push(element2.ientityid*1)
                        }
                    }
                }
            }
            console.log('entityarr',entityarr);
            processArray.map(item=>{
                if(entityarr.includes(item.ientityId)){
                    ProcessStatus.push(item)
                }
            })
            this.setState({ProcessStatus:ProcessStatus})
        })
    }
    getMyTimesheet = () => {

        // vpQuery('/{vpplat}/workbench/mytimesheet', {
        vpQuery('/{bjyh}/ZKsecondSave/usreDcl', {token:window.vp.cookie.getToken()
        }).then((response) => {
            if (response.data != null) {
                let data = response.data
                let myflow = [];
                let counts = 0;

                if (data != null && data.length > 0) {
                    data.map(function (value, index) {
                        if (index < 5) {
                            myflow.push(value);
                        }
                    })
                } else {
                    counts = data.length;
                }
                this.setState({
                    mytimesheetcount: counts,
                    commission: myflow
                })
            }
            
        })

    }
    getMyworkitem = () => {
        vpQuery('/{vpplat}/workbench/myworkitem', {
        }).then((response) => {
            if (response.data != null) {
                let data = response.data
                this.setState({
                    woritem: data
                })
            }
        })

    }
    getMyworkitems = () => {
        vpQuery('/{vpplat}/workbench/myworkitems?type=' + this.state.selectkey, {
        }).then((response) => {
            if (response.data != null) {
                let data = response.data
                this.setState({
                    woritemlist: data
                })
            }
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
        if (variid == 200 || variid == 261) {//从进行中--已关闭  变迁名：已完成和处理完成
            sflag = 2;
            vpAdd('/{vpczccb}/customDynamic/getTaskWork', { objectid: objectid }).then((response) => {
                let taskWork = response.data//是否需要报工，0--是，1--否,需要报工时不可流转
                if (taskWork == 1) {
                    //获取变迁表单
                    vpAdd('/{vpplat}/vfrm/entity/varilsForm', {
                        sflag: sflag,
                        entityid: entityid,
                        iid: objectid
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
                            iassignto: response.data.iassignto,
                            taskWork
                        })
                    })
                } else {
                    this.messageInfo();
                }
            })
        } else {
            //获取变迁表单
            vpAdd('/{vpplat}/vfrm/entity/varilsForm', {
                sflag: sflag,
                entityid: entityid,
                iid: objectid
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
    }

    //状态变迁提交按钮
    handleStatusSubmit(values) {
        if (this.state.sflag == 2) {
            values.iassignto = this.state.iassignto
        }
        let iassignto = values.iassignto
        if (iassignto > 0 || this.state.sflag == 2) {
            let val = { ...values }
            val.entityid = this.state.ientityid
            val.variid = this.state.variid
            val.iid = this.state.objectid
            let param = {};
            param.param = JSON.stringify(val);
            this.saveRowData(param, val, false)
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

    saveRowData = (value, val, btn) => {
        const _this = this
        vpAdd('/{vpplat}/vfrm/entity/savestatus', {
            ...value
        }).then(function (data) {
            _this.cancelModal();
            _this.getMyworkitem();
            _this.getMyworkitems();

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
            varilsForm: {}
        })
    }
    queryMessage = () => {
        vpQuery('/{vpplat}/cfgmsg/list?msgtype=1', {

        }).then((response) => {

            let warning = [];
            response.data.map((item, index) => {
                if (index < 5) {
                    item.icon = 'vpicon-warning'
                    item.title = item.sname
                    warning.push(item)
                }
            })
            this.setState({
                warning: warning,
                warningcount: response.data.length
            })
        })
    }
    //(url?: string, target?: string, features?: string, replace?: boolean): Window | null;
    toVPServer = () => {
        let vprul = vp.config.URL.vpaddress
        let loginName = vp.cookie.getTkInfo('username')
        //let loginName = Baser64.encode(vp.cookie.getTkInfo('username'))
        let url = `http://${vprul}/project/login.jsp?access=${DESKEY}&loginname=${loginName}`
        window.open(url)
    }
    // 公告列表请求
    addNoticeList = () => {
        vpQuery('/{bjyh}/notice/flagGetNotice', {
            token:window.vp.cookie.getToken(),
            currentPage: 1,
            numPerPage: 10,
            sortfield: '',
            sorttype: '',
            filter: '',
            entityid: 129,
            currentkey: 'filter0',
            condition: [],
            filtervalue: 0,
            quickSearch: '',
            viewtype: 'list',
            datafilter: 'auth',
        }).then((response) => {
            this.setState({
                noticeList: response.data.resultList
            })
        })
    }

    // 关注项目列表请求
    addAttentionList = () => {
        //vpAdd('{vpplat}/vfrm/entity/dynamicListData', {
        vpAdd('{bjyh}/HomePage/pjlist', {
            currentPage: 1,
            numPerPage: 9999,
            sortfield: '',
            sorttype: '',
            filter: '',
            entityid: 7,
            currentkey: 'filter0',
            condition: JSON.stringify([{
                'field_name':'istatusid',
                'field_value':'5,83'
            }]),
            filtervalue: -1,
            quickSearch: '',
            viewtype: 'list01',
            datafilter: 'auth',
        }).then((response) => {
            this.setState({
                attentionList: response.data.resultList
            })
        })
    }
    addFlowTabs = () => {
        let _this = window.app
        _this.addTabs('workflow', '流程', '/custom/workflow')
    }
    addMyworkitemTabs = () => {
        let _this = window.app
        _this.addTabs('myworkitem', '项目', '/myworkitem')
    }
    // addMessageTabs = () => {
    //     let _this = window.app
    //     _this.addTabs('systemMessage', '系统消息', '/systemMessage')
    // }
    addNoticeTabs = () => {
        let _this = window.app
        _this.addTabs('systemNotice', '系统公告', '/entity/list')
    }
    addCommonTab = (e, key, title, router, address) => {
        let _this = window.app
        _this.addTabs(key, title, router)
    }
    timesheetClick = (iprojectid) => {
        vpQuery('/{vpplat}/workbench/apptimesheet?iprojectid=' + iprojectid, {
        }).then((response) => {
            this.setState({
                commission: []
            }, () => {
                this.getMyTimesheet();
            })
        })
    }
    onRowClick = (record) => {
        vpQuery('/{vpflow}/rest/process/task-info_assess', {
            taskId: record.taskId,assessid:record.assessid
        }).then((response) => {
            if (response.data == undefined) {
                VpAlertMsg({
                    message: "消息提示",
                    description: response.msg,
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                return
            }
            let data = response.data

            this.setState({
                showRightBox: true,
                modaltitle: record.sname,
                record: data.record,
                staskid: data.taskId,
                flowiid: data.objectId,
                usermode: data.usermode == 2 ? false : true,
                flowentityid: data.entityId,
                activityName: data.activityName
            })
        })
    }
    addNewDom = () => {
        let record = this.state.record
        console.log(record)
        return (
            <Flowtabs
                activityName={this.state.activityName}
                usermode={this.state.usermode}
                stepkey={record.activityId}
                staskid={this.state.staskid}
                piid={record.piId}
                pdid={record.pdId}
                assessid={record.assessid}
                iobjectentityid={this.state.flowentityid}
                iobjectid={this.state.flowiid}
                entityid={record.iflowentityid}
                endTime={record.endTime}
                closeRight={() => this.closeRightModal()}
            />
        )

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
            let { formurl } = this.state
            if (formurl == '' || formurl == undefined) {
                formurl = 'vfm/DynamicForm/dynamic'
            }
            let NewForm = requireFile(formurl) || NotFind
            let plx = {
                entityid: entityid,
                iid: iid,
                type: false,
                viewtype: '',
                entitytype: false,
                defaultActiveKey: '',
            }
            if(this.state.add){  
                return (
                    <VpTabs defaultActiveKey={'0'} destroyInactiveTabPane>
                        <VpTabPane tab='属性' key={'0'} >
                            <NewForm
                                params={{
                                    entityid: entityid,
                                    iid: iid,
                                    type: false,
                                    viewtype: '',
                                    entitytype: false,
                                    defaultActiveKey: '',
                                    data:{
                                        currentclassid:this.state.currentclassid,
                                        viewcode:'form'
                                    }
                                }}
                                add={true}
                                viewcode={'form'}
                                row_id=''
                                row_entityid={this.state.tabsentityid}
                                closeRightModal={() => this.closeTabsRightModal()}
                                refreshList={() => { }}
                            />
                        </VpTabPane>
                    </VpTabs>
                    )
            }else{
                return (
                    <DynamicTabs
                        params={plx}
                        param={plx}
                        row_id=''
                        row_entityid={this.state.tabsentityid}
                        closeRightModal={() => this.closeTabsRightModal()}
                        //closeRight={() => this.closeTabsRightModal()}
                        refreshList={() => { }}
                    />
                )
            }
        }
    }

    //发起业务流程新建表单查询
    handleNewFormClick = (e) => {
        vpQuery('/{vpplat}/vfrm/entity/newformurl', {
            entityid: e
        }).then((response) => {
            let formurl = response.data
            /**
             * 查询实体类别，绑定表单
             */
            vpQuery('/{vpplat}/vfrm/tasks/classList', {
                entityid: e
            }).then((response) => {
                let classList = response.data
                //this.setState({classList})
                //if(classList.length == 1){
                let viewcode = classList[0].scode
                let currentclassid = classList[0].iid
                this.setState({
                    viewcode,
                    currentclassid,
                    add: true,
                    entityiid: '',
                    showTabsRightBox: true,
                    tabsentityid: e,
                    formurl
                });
                //}
            })
        })
    }

    // 关闭右侧弹出    
    closeRightModal = () => {
        this.setState({
            showRightBox: false,
            mytimesheetcount: 0,
            commission: []
        })
        this.getMyTimesheet();
    }
    // 关闭右侧弹出    
    closeTabsRightModal = () => {
        this.setState({
            commission: [],
            showTabsRightBox: false,
            add:false
        }, () => {
            this.getMyTimesheet();
            this.getMyworkitems();
            this.getMyworkitem();
        })
    }
    cancleEditTool = () => {
        this.setState({
            visible: false
        })
    }
    WorkItemonClick = (record) => {
        this.setState({
            showTabsRightBox: true,
            tabsentityid: record.ientityid,
            tabsiid: record.objectid
        })
    }
    // 项目列表到属性
    rowClickFn = (record, index) => {
        vpQuery('/{vpplat}/vfrm/entity/getform', {
            entityid: record.ientityid,
            iid: record.iid,
            iparent: record.key,
            viewcode: '',
            initdata: null
        }).then((response) => {
            if (response.data == undefined) {
                VpAlertMsg({
                    message: "消息提示",
                    description: response.msg,
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                return
            }
            this.setState({
                showTabsRightBox: true,
                tabsentityid: record.ientityid,
                tabsiid: record.iid,
            })
        })
    }
    // 公告列表到属性
    callbackFn(data) {
        this.setState({
            showTabsRightBox: true,
            tabsentityid: data.ientityid,
            tabsiid: data.iid,
        })
    }
    render() {
        const _this = this;
        const fullHeight = document.body.clientHeight;
        //指示灯类型
        const indiclass = ['bg-success', 'bg-warning', 'bg-danger']
        const titleElement = (
            <div>
                <p>红灯：暂停状态或延期（计划上线时间早于当前日期，且无最终上线或尚未结项）的项目</p>
                <p>黄灯：超过3次需求变更的项目</p>
                <p>绿灯：项目没有以上两种情况中的任何一种</p>
            </div>
        )
        const lights = (
            <div>
                <VpTooltip title={titleElement} placement='topRight'>
                    <VpIconFont type="vpicon-tip" className="m-r-xs text-success" />
                </VpTooltip>
            </div>
            
        )
        const lightCol = {
            title: lights, dataIndex: 'indicator',width:'50px',
            render: (value, record) => {
                let num = 0;
                if(record.istatusidval === 83 || record.redLight) {
                    num = 2
                } else if (record.yellowLight){
                    num = 1
                }
                
                return (
                    <div className="indic-wrapper">
                        <span key={0} className={indiclass[num]}></span>
                    </div>
                )
            }
        }
        const columns = [
            { title: '编号', dataIndex: 'scode',width:'130px',key:'scode'},
            { title: '名称', dataIndex: 'sname',width:'auto',key:'sname' },
            //{ title: '状态', dataIndex: 'istatusid',width:'40px' },
            { title: '项目经理', dataIndex: 'roleid6val',width:'80px',key:"roleid6"},
            { title: '需求提出人', dataIndex: 'roleid1000018val',width:'90px',key:'roleid1000018' },
            { title: '开发负责人', dataIndex: 'roleid1000014val',width:'90px',key:'roleid1000014' },
            { title: '阶段', dataIndex: 'rcurrentphase',width:'80px',key:"rcurrentphase" },
        ];
        columns.unshift(lightCol)
        const data = this.state.attentionList
        return (
            <div className="workbench full-height">
                <VpRow gutter={10}>
                    <VpCol className="gutter-row" span={17}>
                        <div className="bg-white p-sm item-h" style={{ height: fullHeight - 450 + 'px' , borderRadius:'8px' }}>
                            <div className="p-b-sm b-b m-b-sm">
                                <VpRow>
                                    <VpCol span={2} className="fw title-a f14">
                                        <Link
                                            to={{
                                                pathname: '/custom/workflow',
                                                state: {
                                                    address: 'pages/custom/Flow/FlowList',
                                                    currentkey: 'sub1'
                                                }
                                            }}
                                            data-key="dealt"
                                            className="block ant-col-24"
                                            onClick={this.addFlowTabs}
                                        >
                                            我待办
                                                <span className="inline-display m-lr-sm">|</span>
                                            <VpBadge count={this.state.myflowcount + this.state.mytimesheetcount} />
                                        </Link>
                                    </VpCol>
                                    <VpCol span={2} className="fw title-a f14">
                                        <Link
                                            to={{
                                                pathname: '/custom/workflow',
                                                state: {
                                                    address: 'pages/custom/Flow/FlowList',
                                                    currentkey: 'sub2'
                                                }
                                            }}
                                            data-key="dealt"
                                            className="block ant-col-24"
                                            onClick={this.addFlowTabs}
                                        >
                                            我已办
                                            <span className="inline-display m-lr-sm">|</span>
                                        </Link>
                                    </VpCol>
                                    <VpCol span={2} className="fw title-a f14">
                                        <Link
                                            to={{
                                                pathname: '/custom/workflow',
                                                state: {
                                                    address: 'pages/custom/Flow/FlowList',
                                                    currentkey: 'sub3'
                                                }
                                            }}
                                            data-key="dealt"
                                            className="block ant-col-24"
                                            onClick={this.addFlowTabs}
                                        >
                                            我发起
                                            <span className="inline-display m-lr-sm">|</span>
                                        </Link>
                                    </VpCol>
                                    {/* 新增页签 */}
                                    { <VpCol span={2} className="fw title-a f14">
                                        <Link
                                            to={{
                                                pathname: '/custom/workflow',
                                                state: {
                                                    address: 'pages/custom/Flow/FlowList',
                                                    currentkey: 'sub5'
                                                }
                                            }}
                                            data-key="dealt"
                                            className="block ant-col-24"
                                            onClick={this.addFlowTabs}
                                        >
                                            我参与的
                                            <span className="inline-display m-lr-sm">|</span>
                                        </Link>
                                    </VpCol> }

                                    {this.state.showFlowSub6 ? <VpCol span={2} className="fw title-a f14">
                                        <Link
                                            to={{
                                                pathname: '/custom/workflow',
                                                state: {
                                                    address: 'pages/custom/Flow/FlowList',
                                                    currentkey: 'sub6'
                                                }
                                            }}
                                            data-key="dealt"
                                            className="block ant-col-24"
                                            onClick={this.addFlowTabs}
                                        >
                                            批量处理
                                            <span className="inline-display m-lr-sm">|</span>
                                        </Link>
                                    </VpCol> : null }            


                                    {/* <VpCol span={2} className="fw title-a f14">
                                        <Link
                                            to={{
                                                pathname: '/workflow',
                                                state: {
                                                    address: 'pages/vfm/workflow',
                                                    currentkey: 'sub3'
                                                }
                                            }}
                                            data-key="dealt"
                                            className="block ant-col-24"
                                            onClick={this.addFlowTabs}
                                        >
                                            我参与的
                                            <span className="inline-display m-lr-sm">|</span>
                                        </Link>
                                    </VpCol> */}
                                    {/* <VpCol span={2} className="fw title-a f14">
                                        <Link
                                            to={null}
                                            data-key="dealt"
                                            className="block ant-col-24"
                                            onClick={this.toVPServer}
                                        >
                                            我的待办(旧系统)
                                            <span className="inline-display m-lr-sm">|</span>
                                        </Link>
                                    </VpCol>
                                    <VpCol span={2} className="fw title-a f14">
                                        <Link
                                            to={{
                                                pathname: '/bjyh/report',
                                                state: {
                                                    address: 'pages/custom/Reports/InnerReport',
                                                    currentkey: 'sub3'
                                                }
                                            }}
                                            data-key="dealt"
                                            className="block ant-col-24"
                                            onClick={this.addFlowTabs}
                                        >
                                            报表
                                        </Link>
                                    </VpCol> */}


                                    <VpCol className="title-a fr">
                                        <Link
                                            to={{
                                                pathname: '/custom/workflow',
                                                state: {
                                                    address: 'pages/custom/Flow/FlowList',
                                                    currentkey: 'sub1'
                                                }
                                            }}
                                            data-key="dealt"
                                            className="block ant-col-24"
                                            onClick={this.addFlowTabs}
                                        >
                                            <VpTooltip title="更多">
                                                <VpIcon type="ellipsis" className="m-t-xs" />
                                            </VpTooltip>
                                        </Link>
                                    </VpCol>
                                </VpRow>
                                {/*  <span className="title-a fr">
                                <Link
										to={{
                                            pathname:'/workflow',
                                            state: { address: 'pages/custom/Flow/FlowList',
                                                        currentkey:'sub1'
                                                    }
										}}
										data-key="dealt" 
										className="block ant-col-24"
										onClick={this.addFlowTabs}
									>
									  <a href="#">
                                        <VpTooltip title="更多">
                                            <VpIcon type="ellipsis" className="m-t-xs" />
                                        </VpTooltip>
                                    </a>
									</Link>
                                </span>
                                <span className="fw title-a f14">
                                <Link
										to={{
                                            pathname:'/workflow',
                                            state: { address: 'pages/custom/Flow/FlowList',
                                            currentkey:'sub1'
                                        }
										}}
										data-key="dealt" 
										className="block ant-col-24"
										onClick={this.addFlowTabs}
									>
									  <a href="#">
                                        我待办 <VpBadge count={this.state.myflowcount+this.state.mytimesheetcount}/>
                                    </a>
                                </Link>
                                </span> 
                                <span className="inline-display m-lr-sm">|</span>
                                <span className="title-a fw f14">
                                    <Link
										to={{
                                            pathname:'/workflow',
                                            state: { 
                                                address: 'pages/custom/Flow/FlowList',
                                                currentkey:'sub2'
                                            }
										}}
										data-key="dealt" 
										className="block ant-col-24"
										onClick={this.addFlowTabs}
									>
									 <a href="#">我已办</a>
									</Link>
                                </span> 
                                <span className="inline-display m-lr-sm">|</span> 
                                <span className="title-a fw f14">
                                <Link
										to={{
                                            pathname:'/workflow',
                                            state: { address: 'pages/custom/Flow/FlowList',
                                            currentkey:'sub3'
                                        }
										}}
										data-key="dealt" 
										className="block ant-col-24"
										onClick={this.addFlowTabs}
									>
									 <a href="#">我发起</a>
									</Link>
                                </span> */}
                            </div>
                            <div className="ibox-content p-sm scroll" style={{ maxHeight: fullHeight - 515 + 'px', height: fullHeight - 515 + 'px',borderRadius:'8px' }}>
                                {
                                    
                                    this.state.commission.length > 0 ?
                                        <ul>
                                            {
                                                this.state.commission.map((item, index) => {
                                                    return (
                                                        <li key={index} className="clearfix b-b p-sm pr ibox-content-list">
                                                            <VpIconFont type={item.icon} className={"f18 fl m-r-md " + item.color} />
                                                            <div className="fl">
                                                                <div className="f14 m-b-xs">{item.objname} {item.title}</div>
                                                                <div className="text-muted f12">
                                                                    {
                                                                        /*  item.type == "flow" ?
                                                                         <span className="inline-display m-r-sm">对象名称: {item.objname}</span>
                                                                         : null */
                                                                    }
                                                                    {/* {
                                                                        item.type == "flow" ?
                                                                            <span className="inline-display m-r-lg">
                                                                                <VpIconFont type="vpicon-user" className="m-r-xs f12" ></VpIconFont>
                                                                                {item.name}
                                                                            </span>
                                                                            : null
                                                                    } */}
                                                                    {
                                                                        item.type == "flow" ?
                                                                            <span className="inline-display m-r-lg">
                                                                                <VpIconFont type="vpicon-implement-clock" className="m-r-xs f12" ></VpIconFont>
                                                                                {item.createTime}
                                                                            </span>
                                                                            : null
                                                                    }
                                                                    {
                                                                        item.type == "flow" ?
                                                                            <span className="inline-display m-r-lg">
                                                                                步骤：{item.taskName}
                                                                            </span>
                                                                            : null
                                                                    }

                                                                    {
                                                                        item.type == "flow" ?
                                                                            <span className="inline-display m-r-lg">
                                                                                {item.sc}
                                                                            </span>
                                                                            : null
                                                                    }
                                                                    {
                                                                        item.type != "flow" ?
                                                                            <span className="inline-display">
                                                                                <span className="inline-display m-r-lg">正常工时：{item.manhour} h</span>
                                                                                <span className="inline-display m-r-lg">加班工时：{item.overmanhour} h</span>
                                                                            </span>
                                                                            : null
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="fr m-t-sm">
                                                                {
                                                                    item.type == "flow" ?
                                                                        <VpButton type="dashed" className="text-primary" onClick={(e) => this.onRowClick(item)}>处理</VpButton>
                                                                        :
                                                                        <VpButton type="dashed" className="text-primary" onClick={(e) => this.timesheetClick(item.iprojectid)}>批准</VpButton>
                                                                }
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                        :
                                        <div className="text-center full-height f20 text-muted success">
                                            <VpIconFont type="vpicon-hand" className="m-r-xs f20" />
                                            恭喜你，完成了所有待办！
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="bg-white p-sm m-tb-sm " style={{ height: '370',borderRadius:'8px' }} >
                            <div className="p-b-sm b-b">
                                <span className="fw f14">关注项目</span>
                                <span className="title-a fr">
                                    <span className="title-a fr">
                                        <Link
                                            to={{
                                                pathname: '/entity/list/7/47',
                                                state: {
                                                    address: 'pages/bjyh/customlist/',
                                                    currentkey: 'sub1'
                                                }
                                            }}
                                            data-key="dealt"
                                            className="block ant-col-24"
                                            onClick={this.addMyworkitemTabs}>
                                            <VpTooltip title="更多">
                                                <VpIcon type="ellipsis" className="m-t-xs" />
                                            </VpTooltip>
                                        </Link>
                                    </span>
                                </span>
                            </div>

                            <div className="tool-content t-container p-tb-sm scroll" style={{height:'320',maxHeight:'320'}}>
                                <VpRow className="m-b-sm">
                                    <Table
                                        className='myProject'
                                        rowKey={'myProject'}
                                        columns={columns}
                                        dataSource={data}
                                        onChange={this.onChange}
                                        pagination={false}
                                        onRowClick={this.rowClickFn}
                                        bindThis={this}
                                        resize
                                    />
                                </VpRow>
                            </div>
                        </div>
                    </VpCol>
                    <VpCol className="gutter-row" span={7}>
                        <div className="bg-white bg-system p-sm" style={{ height: fullHeight - 450 + 'px',borderRadius:'8px' }}>
                            <div className="p-b-sm b-b m-b-sm">
                                <span className="title-a fr">
                                    {/* 更多 */}
                                    {/* <Link
                                        to={{
                                            pathname: '/entity/list/129/110',
                                            state: { address: 'pages/vfm/entity/list' }
                                        }}
                                        data-key="dealt"
                                        className="block ant-col-24"
                                        // onClick={this.addMessageTabs}
                                        onClick={this.addNoticeTabs}>
                                        <VpTooltip title="更多">
                                            <VpIcon type="ellipsis" className="m-t-xs" />
                                        </VpTooltip>
                                    </Link> */}
                                </span>
                                <span className="fw f14">系统公告 <VpBadge count={this.state.warningcount} /></span>
                            </div>
                            <div className="scroll" style={{ maxHeight: fullHeight - 515 + 'px', height: fullHeight - 515 + 'px' }}>
                                <XtggList noticeList={this.state.noticeList} callback={this.callbackFn} />
                            </div>
                            {/* <ul className="list-content scroll">
                                {this.state.warning ? this.state.warning.map((item, index) => {
                                    let _obj = index < 3 ? { className: "m-r-xs text-warning" } : { className: "m-r-xs" }
                                    return (
                                        <li key={index} className="waring-list text-muted p-tb-sm">
                                            <VpIconFont {..._obj} type={item.icon} />
                                            <span className="inline-display">
                                                {item.title}
                                            </span>
                                        </li>
                                    )
                                }) : null
                                }
                            </ul> */}
                        </div>
                        {/* 重点项目 */}
                        {/* <div className="bg-white p-sm m-t-sm">
                            <div className="p-b-sm b-b m-b-sm">
                                <span className="title-a fr">

                                    <Link
                                        to={{
                                            pathname: '/systemMessage',
                                            state: { address: 'pages/vfm/Message/systemMessage' }
                                        }}
                                        data-key="dealt"
                                        className="block ant-col-24"
                                        onClick={this.addMessageTabs}
                                    >
                                        <VpTooltip title="更多">
                                            <VpIcon type="ellipsis" className="m-t-xs" />
                                        </VpTooltip>
                                    </Link>


                                </span>
                                <span className="fw f14">重点项目<VpBadge count={this.state.warningcount} /></span>
                            </div>
                            <ul className="list-content scroll">
                                {
                                    this.state.warning ? this.state.warning.map((item, index) => {
                                        let _obj = index < 3 ? { className: "m-r-xs text-warning" } : { className: "m-r-xs" }
                                        return (
                                            <li key={index} className="waring-list text-muted p-tb-sm">
                                                <VpIconFont {..._obj} type={item.icon} />
                                                <span className="inline-display">
                                                    {item.title}
                                                </span>
                                            </li>
                                        )
                                    }) : null
                                }
                            </ul>
                        </div> */}
                        
                        <div className="tool bg-white p-sm m-tb-sm" style={{ height: '370',borderRadius:'8px' }}>
                            <div className="p-b-sm b-b">
                                <span className="fw f14">发起业务流程</span>
                            </div>
                            <div className="tool-content p-tb-sm">
                                <VpRow gutter={10}>
                                    {this.state.ProcessStatus.length > 0 ? this.state.ProcessStatus.map((item, index) => {
                                        return (
                                            <VpCol span={8} className="m-b-sm" key={index}>
                                                <div className="tool-list bg-white p-sm text-center cursor pr"
                                                    onClick={(e) => {
                                                        this.changeMenu(e, item.ientityId, item.sname,
                                                            item.ilinktype == '1' ? item.surl :
                                                                item.ientityId == 0 ? item.surl : item.surl + '/',//+ item.ientityId, 
                                                            item.sclass)

                                                    }}>
                                                    <Link
                                                        to={{
                                                            pathname: item.ilinktype == '1' ?
                                                                '/iframe' :
                                                                item.ientityId == 0 ? item.surl :
                                                                    item.surl + '/',//+ item.ientityId,
                                                            state: { fromDashboard: true, url: item.surl, address: item.hasOwnProperty('sclass') ? item.sclass : '' }
                                                        }}
                                                        onClick={(e) => {
                                                            this.changeMenu(e, item.ientityId, item.sname,
                                                                item.ilinktype == '1' ? item.surl :
                                                                    item.ientityId == 0 ? item.surl : item.surl + '/',//+ item.ientityId, 
                                                                item.sclass)
                                                        }}
                                                    >
                                                        <VpIconFont type={"f24 " + item.icon} style={{ color: item.color }} />
                                                        <p className="m-t-sm">
                                                            {item.hasOwnProperty('sname') ? item.sname : ''}
                                                        </p>
                                                    </Link>
                                                </div>
                                            </VpCol>
                                        )
                                    }) : null
                                    }
                                </VpRow>
                            </div>
                        </div>
                    </VpCol>
                </VpRow>
                <VpModal
                    title="常用工具"
                    width="60%"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null} >
                    <EditTool
                        // removeToolList={this.state.removeToolList} 
                        editToolList={this.state.editToolList}
                        visible={this.state.visible}
                        getToolAddList={this.getToolAddList}
                        cancleEditTool={() => this.cancleEditTool()}
                    />
                </VpModal>
                <VpModal
                    title='状态变迁'
                    visible={this.state.varivisible}
                    onCancel={() => this.cancelModal()}
                    width={'70%'}
                    footer={null}
                    wrapClassName='modal-no-footer'
                >
                    {this.state.varilsForm ?
                        <CustomForm
                            className="p-sm full-height scroll p-b-xxlg"
                            formData={this.state.varilsForm}
                            handleOk={(values) => this.handleStatusSubmit(values)}
                            okText="提 交"
                            iid={this.props.row_id}
                            taskWork={this.state.taskWork}
                            loading={this.state.loading}
                            handleCancel={() => this.cancelModal()} />
                        // <VpDynamicForm
                        //     className="p-sm full-height scroll p-b-xxlg"
                        //     formData={this.state.varilsForm}
                        //     iid={this.props.row_id}
                        //     handleOk={(values) => this.handleStatusSubmit(values)}
                        //     handleCancel={() => this.cancelModal()}
                        //     loading={this.state.loading}
                        //     okText="提 交" />
                        : null
                    }
                </VpModal>
                <RightBox
                    max={true}
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
                    {this.state.showRightBox ? this.addNewDom() : null}
                </RightBox>
                <RightBox
                    max={true}
                    button={
                        <div className="icon p-xs" onClick={this.closeTabsRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showTabsRightBox}
                >
                    {this.state.showTabsRightBox ?
                        this.addTabsDom()
                        :
                        null}
                </RightBox>
                {/* 发起业务流程 新建页面 */}
                {/* <RightBox
                    max={true}
                    button={
                        <div className="icon p-xs" onClick={this.closeTabsRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.newEntityForm}
                >
                    {this.state.newEntityForm ? this.addNewEntityForm() : null}
                </RightBox> */}
            </div>
        )
    }
}