import React, { Component } from "react";
import {
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
    VpAlertMsg,
    VpMSuccess
  } from "vpreact";
import EditTool from "../../templates/dynamic/VpWorkbench/editTool";
import { CustomForm} from 'vpbusiness';
import {requireFile} from "utils/utils";
import { Link } from 'react-router';
import Flowtabs from '../../templates/dynamic/Flow/FlowHandler';
const DynamicTabs = requireFile('vfm/DynamicTabs/dynamictabs');
const VpHandleForm = requireFile('vfm/VpHandleForm/index');
import "./index.less";
import {
    RightBox,
} from 'vpbusiness';
import {formDataToWidgetProps} from "../../templates/dynamic/Form/Widgets"
//import CustomForm from "../../czccb/dynamic/rwgl/customForm";


export default class Workbench extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commission: [],
            woritem: [],
            woritemlist: [],
            warning: [],
            selected: {},
            selectkey:0,
            dispose: true,
            editTool: false,
            editToolList: [],
            mytoollist: [],
            myflowcount:0,
            mytimesheetcount:0,
            warningcount:0,
            varivisible:false,
            showRightBox:false,
            showTabsRightBox:false,
            tabsentityid:'',
            tabsiid:'',
            activityName:''
            // removeToolList: [],
        };
    }
    componentWillMount() {
        console.log('.k.k.k.');
        
        this.getMyTimesheet();
        this.getMyworkitem();
        this.getMyworkitems();
        this.queryMessage();
        this.getMyTools();
    }
    handleClick = (e,key) => {
        $(".work-big-box").attr("class","bg-gray work-big-box");
        let _box = $(e.target).parents(".work-big-box");
        $(_box[0]).attr("class", "selected work-big-box");
        this.setState({
            selected: { [key]: true },
            selectkey:key
        },()=>this.getMyworkitems())
    }

    changeMenu(e, key, title, router, address) {
        e.stopPropagation();
        let _this = window.app;
        _this.addTabs(key, title, router);
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
    handleEditToolRemove = (e,id) => {
        this.state.editToolList.map((item,index)=>{
            if(item.iid == id) {
                // this.state.removeToolList.push(id);
                this.state.editToolList.splice(index,1);
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
        if(list) {
            this.state.editToolList.push(...list);
        }
        this.setState({ editToolList: this.state.editToolList });
    }
    //工具
    getMyTools = () => {
        vpQuery('/{vpplat}/workbench/getmytool',{

        }).then((response)=>{
            if(response.data != null){
                let data = response.data
                //this.setState({
                //    mytoollist:data
                //})

                this.state.editToolList.push(...data);

                this.setState({ 
                    editToolList: this.state.editToolList 
                });
            }
        })
    } 
    getMyTimesheet = () => {

        vpQuery('/{vpplat}/workbench/mytimesheet',{
        }).then((response)=>{
            if(response.data!=null){
            let data = response.data
            let myflow=[];
            let counts=0;

            if(data!=null&&data.length>0){
                data.map(function (value, index) {
                  if(index<5){
                   myflow.push(value);
                  }
              })
            }else{
                counts=data.length;
            }  
            this.setState({
                mytimesheetcount: counts,
                commission:myflow
            })
        }
        })
       
    }
    getMyworkitem = () => {

        vpQuery('/{vpplat}/workbench/myworkitem',{
        }).then((response)=>{
            if(response.data!=null){
            let data = response.data
            this.setState({
                woritem:data
            })
        }
        })
       
    } 
    getMyworkitems = () => {
        vpQuery('/{vpplat}/workbench/myworkitems?type='+this.state.selectkey,{
        }).then((response)=>{
            if(response.data!=null){
            let data = response.data
            this.setState({
                woritemlist:data
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
    let entityid=e.item.props.ientityid;
    let objectid=e.item.props.objectid;
    let variid=e.key;
    let sflag = false;
    if(variid == 200 || variid == 261){//从进行中--已关闭  变迁名：已完成和处理完成
        sflag =2;
        vpAdd('/{vpczccb}/customDynamic/getTaskWork',{objectid:objectid}).then((response) =>{
            let taskWork = response.data//是否需要报工，0--是，1--否,需要报工时不可流转
            if(taskWork == 1){
                //获取变迁表单
                vpAdd('/{vpplat}/vfrm/entity/varilsForm', {
                    sflag:sflag,
                    entityid:entityid,
                    iid:objectid
                }).then((response) => {
                    let varilsForm = formDataToWidgetProps(response.data);
                    let iassigntoData = varilsForm.findWidgetByName("iassignto");
                    if(iassigntoData && iassigntoData.field){
                        iassigntoData.field.fieldProps.rules = [{
                            required:true,message:"下一步处理人不能为空"
                        }];
                    }
                    this.setState({
                        varivisible: true,
                        varilsForm: varilsForm,
                        variid: variid,
                        ientityid: entityid,
                        objectid: objectid,
                        sflag: sflag,
                        iassignto:response.data.iassignto,
                        taskWork
                    })
                })
            }else{
                this.messageInfo();
            }
        })
    }else{
        //获取变迁表单
        vpAdd('/{vpplat}/vfrm/entity/varilsForm', {
            sflag:sflag,
            entityid:entityid,
            iid:objectid
        }).then((response) => {
            let varilsForm = formDataToWidgetProps(response.data);
            let iassigntoData = varilsForm.findWidgetByName("iassignto");
            if(iassigntoData && iassigntoData.field){
                iassigntoData.field.fieldProps.rules = [{
                    required:true,message:"下一步处理人不能为空"
                }];
            }
            this.setState({
                varivisible: true,
                varilsForm: varilsForm,
                variid: variid,
                ientityid: entityid,
                objectid: objectid,
                sflag: sflag,
                iassignto:response.data.iassignto
            })
        })
    }

} 
 //状态变迁提交按钮
 handleStatusSubmit(values) {
    if(this.state.sflag == 2){
        values.iassignto = this.state.iassignto
    }
    let iassignto = values.iassignto
    if (iassignto > 0 || this.state.sflag == 2) {
        let val = {...values }
        val.entityid=this.state.ientityid
        val.variid=this.state.variid
        val.iid=this.state.objectid
        let param={};
        param.param=JSON.stringify(val);
        this.saveRowData(param,val,false)
    } else {
        VpAlertMsg({ 
            message:"消息提示",
            description:'下一步处理人不能为空!',
            type:"error",
            onClose:this.onClose,
            closeText:"关闭",
            showIcon: true
        }, 5)
    }
}
saveRowData = (value,val,btn) => {
    const _this = this
    vpAdd('/{vpplat}/vfrm/entity/savestatus', {
        ...value
    }).then(function (data) {
        if(val.variid == 197 ){//任务审批通过时的变迁动作，审批中--进行中，变迁名：审批通过
            //审批通过时的工时与基准工时同步
            vpAdd('/{vpczccb}/devUtil/taskPass',{objectid:val.iid }).then((response)=>{

            })
        }
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
   cancelModal = ()=> {
    this.setState({
        varivisible: false,
        varilsForm: {}
    })
}
queryMessage=()=>{
    vpQuery('/{vpplat}/cfgmsg/list?msgtype=1',{

    }).then((response)=>{
        let warning=[];
        response.data.map((item,index)=>{
            if(index<5){
            item.icon='vpicon-warning'
            item.title=item.sname
            warning.push(item)
            }
        })
        this.setState({
            warning:warning,
            warningcount:response.data.length
        })
    })
}
addFlowTabs=()=>{
    let _this = window.app
    _this.addTabs('workflow','流程','/custom/workflow')
}
addMyworkitemTabs=()=>{
    let _this = window.app
    _this.addTabs('myworkitem','待办','/myworkitem')
}
addMessageTabs=()=>{
    let _this = window.app
    _this.addTabs('systemMessage','系统消息','/systemMessage')
}

addCommonTab=(e, item)=>{
    let _this = window.app
    _this.addTabs('systemMessage' + item.id, item.title, item.surl)
}

timesheetClick=(iprojectid)=>{
    vpQuery('/{vpplat}/workbench/apptimesheet?iprojectid='+iprojectid,{
    }).then((response)=>{
        this.setState({
            commission:[]
        },()=>{
            this.getMyTimesheet();
        })
    })
}
onRowClick=(record)=>{
    vpQuery('/{vpflow}/rest/process/task-info',{
        taskId:record.taskId
    }).then((response)=>{
        if(response.data == undefined){
            VpAlertMsg({ 
                message:"消息提示",
                description:response.msg,
                type:"error",
                onClose:this.onClose,
                closeText:"关闭",
                showIcon: true
            }, 5)
            return 
        }
        let data = response.data 
        this.setState({
            showRightBox:true,
            modaltitle:record.sname,
            record:data.record,
            staskid:data.taskId,
            flowiid:data.objectId,
            usermode:data.usermode==2?false:true,
            flowentityid:data.entityId,
            activityName:data.activityName
        })
    })
}
addNewDom=()=>{
    let record = this.state.record
    return(
        <Flowtabs
        	activityName={this.state.activityName}
            usermode = {this.state.usermode}
            stepkey = {record.activityId}
            staskid = {this.state.staskid}
            piid = {record.piId}
            pdid = {record.pdId}
            iobjectentityid = {this.state.flowentityid}
            iobjectid = {this.state.flowiid}
            entityid = {record.iflowentityid}
            endTime = {record.endTime}
            closeRight = {()=>this.closeRightModal()}
            />
    )
    
}

addTabsDom=()=>{
    let entityid = this.state.tabsentityid
    let iid = this.state.tabsiid
    if(entityid == 114){
        return(
            <VpHandleForm 
            entityid = {entityid}
            iid = {iid}
            closeRightModal={() => this.closeTabsRightModal()}
            />
        )
    }else{
        return(
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
            refreshList={() => {}}
        />
        )
    }
}

  // 关闭右侧弹出    
  closeRightModal=()=> {
    this.setState({
        showRightBox: false,
        mytimesheetcount: 0,
        commission:[]
    })
    this.getMyTimesheet();
}

  // 关闭右侧弹出    
  closeTabsRightModal=()=> {
    this.setState({
        commission:[],
        showTabsRightBox: false
    },()=>{
        this.getMyTimesheet();
        this.getMyworkitems();
        this.getMyworkitem();
    })
}

cancleEditTool=()=>{
    this.setState({
        visible:false
    })
}

WorkItemonClick=(record)=>{
   this.setState({
       showTabsRightBox:true,
       tabsentityid:record.ientityid,
       tabsiid:record.objectid
   })
}
render() {
        const _this = this
        return (
            <div className="workbench full-height">
                <VpRow gutter={10}>
                    <VpCol className="gutter-row" span={17}>
                        <div className="bg-white p-sm">
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
                                        </Link>
                                    </VpCol>
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
                            <div className="ibox-content p-sm scroll">
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
                                                                     {
                                                                      item.type == "flow" ?
                                                                      <span className="inline-display m-r-lg">
                                                                          <VpIconFont type="vpicon-user" className="m-r-xs f12" ></VpIconFont>
                                                                          {item.name}
                                                                      </span>
                                                                        : null
                                                                    }
                                                                     {
                                                                      item.type == "flow" ?
                                                                      <span className="inline-display m-r-lg">
                                                                          <VpIconFont type="vpicon-implement-clock" className="m-r-xs f12" ></VpIconFont>
                                                                          {item.time}
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
                                                            item.type == "flow"  ?
                                                                <VpButton type="dashed" className="text-primary" onClick={(e)=>this.onRowClick(item)}>处理</VpButton>
                                                                :
                                                                <VpButton type="dashed" className="text-primary" onClick={(e)=>this.timesheetClick(item.iprojectid)}>批准</VpButton>
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
                        <div className="bg-white p-sm m-tb-sm">
                            <div className="p-b-sm b-b">
                                <span className="fw f14">我的工作项</span>
                                <span className="title-a fr">
                                <span className="title-a fr">
                                <Link
										to={{
                                            pathname:'/customWorkItem',
                                            state: { address: 'pages/custom/List/myworkitem',
                                            currentkey:'sub1'
                                        }
										}}
										data-key="dealt" 
										className="block ant-col-24"
										onClick={this.addMyworkitemTabs}
									>
                                        <VpTooltip title="更多">
                                            <VpIcon type="ellipsis" className="m-t-xs" />
                                        </VpTooltip>
									</Link>
                                </span>
                                </span>
                            </div>
                            <div className="left-bottom p-tb-sm">
                                <VpRow gutter={16} className="m-b-sm">
                                    {
                                        this.state.woritem ? this.state.woritem.map((item,index)=>{
                                            let _obj = index == 0 ? { className: "selected work-big-box" } : { className: "bg-gray work-big-box"};
                                            return (
                                                <VpCol key={index} span={6}>
                                                    <div {..._obj} onClick={(e)=>this.handleClick(e,index)}>
                                                        <div className="gutter-box b p-sm text-muted clearfix work-box cursor" >
                                                            <div className="fl m-t-sm text-center" style={{width: "50%"}}>
                                                                <div className="fw f24 p-xs font-num text-primary">{item.num}</div>
                                                                <div className="">{item.title}</div>
                                                            </div>
                                                            <div className="fr f12" style={{ width: "40%" }}>
                                                                {item.tasklen ? item.tasklen.map((item1,index1)=>{

                                                                        return (<div key={index1} className="p-b-xs">{item1.stext}: {item.countlist[index1]}</div>)

                                                                }):null
                                                                }
                                                                </div>
                                                           
                                                        </div>
                                                        {
                                                            index == 0 || this.state.selected[index] == 0 || this.state.selected[index]?
                                                            <span className="triangle-down"></span>
                                                            : null
                                                        }
                                                    </div>
                                                </VpCol>
                                            )
                                        }): null
                                    }
                                    <VpCol span={24}>
                                        <ul className="m-t-sm">
                                            {
                                                this.state.woritemlist ? this.state.woritemlist.map((item,index)=>{
                                                    let menu1 = (
                                                        <VpMenu key={'vpm'+index} onClick={this.handleStatus}>
                                                            {item.varilist!=null?
                                                                item.varilist.map((item1,index1)=>{
                                                               return ( <VpMenuItem key={item1.iid}  ientityid={item.ientityid} objectid={item.objectid}>{item1.sname}</VpMenuItem>)
                                                            })
                                                            :null
                                                            }
                                                        </VpMenu>
                                                    )

                                                    return (
                                                        <li key={index+'item'} className="b-b p-tb-sm clearfix">
                                                            <VpIconFont type={item.icon} className="fl" />
                                                            
                                                            <VpDropdown overlay={menu1} trigger={['click']}>
                                                            
                                                                <span className={`span-menu cursor inline-display m-lr-lg p-lr-sm fl ${item.color}`}>
                                                                {item.varilist!=null&& item.varilist.length>0 ?'待处理':'无操作'} 
                                                                <VpIconFont type="vpicon-caret-down-s" />
                                                                </span>
                                                                
                                                            </VpDropdown>
                                                           
                                                            <div className="fl cursor">
                                                                <div className="" style={{padding: "3px 0"}} onClick={(e)=>this.WorkItemonClick(item)}>{item.title}</div>
                                                                <div className="f12 p-t-xs text-muted">{item.state}</div>
                                                            </div>
                                                            <div className="fr text-right">
                                                                <div style={{ padding: "3px 0" }}>
                                                                    <span>
                                                                        <VpIconFont type="vpicon-implement-clock" className="m-r-xs f12" />
                                                                        {item.time}
                                                                    </span>
                                                                    <span className="inline-display m-l-sm" >
                                                                        <VpIconFont type="vpicon-user" className="m-r-xs f12" />
                                                                        {item.name}
                                                                    </span>
                                                                </div>
                                                                <div className="m-t-xs f12 text-muted">{item.statetime}</div>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                                : null
                                            }
                                        </ul>
                                    </VpCol>
                                </VpRow>
                            </div>
                        </div>
                    </VpCol>
                    <VpCol className="gutter-row" span={7}>
                        <div className="bg-white p-sm">
                            <div className="p-b-sm b-b m-b-sm">
                                <span className="title-a fr">
                 
                                        {/* 更多 */}
                                        <Link
										to={{
                                            pathname:'/systemMessage',
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
                                <span className="fw f14">我的预警 <VpBadge count={this.state.warningcount}/></span>
                            </div>       
                            <ul className="list-content scroll">
                                {
                                    this.state.warning ? this.state.warning.map((item,index) => {
                                        let _obj = index < 3 ? { className: "m-r-xs text-warning" } : { className: "m-r-xs"}
                                        return (
                                            <li key={index} className="waring-list text-muted p-tb-sm">
                                                <VpIconFont {..._obj} type={item.icon} />
                                                <span className="inline-display">
                                                    {item.title}
                                                </span>
                                            </li>
                                        )
                                    }): null
                                }
                            </ul>
                        </div>
                        <div className="tool bg-white p-sm m-t-sm">
                            <div className="p-b-sm b-b">
                                <span className="fr" style={{paddingTop:2}}>
                                    <VpTooltip title="编辑">
                                        <VpIcon type="cursor vpicon-setting" onClick={this.handleEditTool} />
                                    </VpTooltip>
                                </span>
                                <span className="fw f14">常用工具</span>
                            </div>   
                            <div className="tool-content p-tb-sm">
                                <VpRow gutter={10}>
                                    {
                                        this.state.editToolList.length > 0 ? this.state.editToolList.map((item,index)=>{
                                            return (
                                                <VpCol span={8} className="m-b-sm" key={index}>
                                                    <div className="tool-list bg-white p-sm text-center cursor pr">
                                                        <VpIconFont type={"f24 " + item.icon} style={{color:item.color}} />
                                                        <p className="m-t-sm">
                                                            {/* <Link
                                                                to={{
                                                                    pathname:item.surl,
                                                                    state: { 
                                                                        address: item.surl,
                                                                        currentkey: item.id
                                                                    }
                                                                }}
                                                                data-key="dealt" 
                                                                className="block ant-col-24"
                                                                onClick={(e)=>this.addCommonTab(e,item)}
                                                            >
                                                                {item.title} 
                                                            </Link> */}

                                                            <Link
                                                                to={{
                                                                    pathname: item.ilinktype == '1' ?
                                                                        '/iframe' :
                                                                        item.ientityid == 0 ? item.surl :
                                                                        item.surl + '/' + item.ientityid+'/0',
                                                                    state: { fromDashboard: true, url: item.surl, address: item.hasOwnProperty('sclass') ? item.sclass : '' }
                                                                }}
                                                                onClick={(e) => {
                                                                    this.changeMenu(e, item.iid, item.sname, item.ilinktype == '1' ? item.surl :
                                                                    item.ientityid == 0 ? item.surl :
                                                                    item.surl + '/' + item.ientityid, item.sclass)
                                                                }}
                                                            >
                                                            {item.hasOwnProperty('sname') ? item.sname : ''}
                                                        </Link>
                                                        </p>
                                                        
                                                        {
                                                            this.state.editTool ? 
                                                            <VpIconFont 
                                                                type="vpicon-minus-circle" 
                                                                className="add-or-subtract text-danger" 
                                                                onClick={(e)=>this.handleEditToolRemove(e,item.iid)}
                                                            />
                                                            : null
                                                        }
                                                    </div>
                                                </VpCol>
                                            )
                                        }) : null
                                    }
                                    {
                                        this.state.editTool ? 
                                        <VpCol span={8} className="m-b-sm pr">
                                            <div className="text-center b cursor new-add" onClick={this.handleEditToolAdd}>
                                                <VpIconFont type="vpicon-plus f24" />
                                            </div>
                                        </VpCol>
                                        : null
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
                        cancleEditTool  = {()=>this.cancleEditTool()}
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
                     handleCancel={() => this.cancelModal()}/>
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
                    { this.state.showRightBox ? this.addNewDom() : null}
                </RightBox>
                <RightBox
                    max={true}
                    button={
                        <div className="icon p-xs" onClick={this.closeTabsRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showTabsRightBox}>
                    { this.state.showTabsRightBox ?
                        this.addTabsDom()
                        : 
                        null}
                </RightBox>
            </div>
        )
    }
}