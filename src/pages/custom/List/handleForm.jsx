import React from "react";
import {
    VpRow,
    VpCol,
    VpSteps,
    VpDropdown, VpMenu, VpMenuItem,
    VpCheckbox,
    VpIconFont,
    vpQuery,
    vpAdd,
    VpModal,
    VpTooltip,
    VpAlertMsg ,
    VpIcon,
    VpIframe
} from "vpreact";
import { requireFile, extend } from "utils/utils";
const RelationEntity = requireFile("vfm/ChooseEntity/RelationEntity");
//import RelationEntity from '../ChooseEntity/RelationEntity'
const SubTask = requireFile("vfm/Task/subTask");
//import SubTask from '../Task/subTask'
const Follow = requireFile("vfm/Follow/follow");
//import Follow from '../Follow/follow'
import {VpDTable,VpDynamicForm,RightBox} from "vpbusiness";
const DynamicTabs = requireFile("vfm/DynamicTabs/dynamictabs");
// import DynamicTabs from 'pages/vfm/dynamic/DynamicTabs/dynamictabs';
import "./index.less";
const Step = VpSteps.Step;

function headers() {
    return [
        {
            title: '名称',
            dataIndex: 'sname',
            key: 'sname',
            width: '',
            fixed: ''
        },
        {
            title: '编号',
            dataIndex: 'scode',
            key: 'scode',
            width: '',
            fixed: ''
        }
    ];
}


export default class HandleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            menStep: {},//每个工序的完成情况
            stepData: [],//工序数组
            taskbaseinfo: {},//任务基本信息
            irelentityiid: '',
            choosenmodal:false,
            tablearray:[],
            choosenarray:[],
            selectItem: [],
            selectedSkeys: [],
            selectedRowKeys:[],
            entitytype:'',
            statusList:[],
            varivisible: false,
            varilsForm: {},
            variid: '',
            iassignto:'',
            loading:false,
            showDetail:false
        };
        this.menStepKey = ""
    }

    componentWillMount() {
        this.taskbaseinfo()
        this.taskprocess()
        this.queryStatusList()
        if(this.props.entityid == 114){
            vpQuery('/{vpplat}/vfrm/entity/taskurldata',{
                iid:this.props.iid
            }).then((response)=>{
                this.setState({
                    pocdata:response.data
                })
            })
        }
    }

    //状态变迁按钮
    queryStatusList = () => {
        const _this = this
        vpAdd('/{vpplat}/vfrm/entity/getStatusList', {
            entityid: this.props.entityid,
            iid: this.props.iid
        }).then((response) => {
            let varis = response.data.varis
            this.setState({
                statusList: varis,
            })
        })
    }

    taskbaseinfo = () => {
        vpQuery('/{vpplat}/vfrm/tasks/taskbaseinfo', {
            entityid: this.props.entityid,
            iid: this.props.iid
        }).then((response) => {
            this.setState({
                taskbaseinfo: response.data
            })
        })
    }

    taskprocess = () => {
        vpQuery('/{vpplat}/vfrm/tasks/taskprocess', {
            entityid: this.props.entityid,
            iid: this.props.iid
        }).then((response) => {
            let data = response.data
            let menStep = {}
            let current = 0
            data.processlist.map((item,index)=>{
                let flag = item.isuccess==1?true:false
                menStep[item.skey] = flag
                if(item.idefault==1){
                    current = index
                }
            })
            this.setState({
                stepData: data.processlist,
                menStep,
                current
            },()=>{
                if(data.processlist.length>0){
                    this.relateddata()
                }
            })
        })
    }

    relateddata=()=>{
        let firststep = this.state.stepData[this.state.current]
        if(firststep.ilinktype == "1"){
            this.setState({
                choosenarray:[1]
            })
        }else{
            vpQuery('/{vpplat}/vfrm/tasks/relateddata', {
                entityid: this.props.entityid,
                iid: this.props.iid,
                irelentity:this.state.stepData[this.state.current].irelentity
            }).then((response) => {
                let data = response.data
                let choosenarray = []
                let visable = false
                if(data.length == 1){
                    choosenarray = data
                }else if(data.length == 0){
                    this.setState({
                        tablearray: [],
                        choosenarray:[],
                        choosenmodal:false
                    },()=> {
                        VpAlertMsg({
                            message:"消息提示",
                            description:"暂无关联的数据，请从任务的关联中进行添加！",
                            type:"info",
                            onClose:this.onClose,
                            closeText:"关闭",
                            showIcon: true
                        }, 5)
                    })
                    return;
                }else{
                    visable = true
                }
                this.setState({
                    tablearray: data,
                    choosenarray,
                    choosenmodal:visable
                })
            })
        }
    }

    updateSuccess=(iid,isuccess)=>{
        vpAdd('/{vpplat}/vfrm/tasks/updateSuccess',{
            stepid:iid,
            isuccess,
            taskid:this.props.iid,
            entityid:this.props.entityid
        }).then((response)=>{

        })
    }

    handleMenuChange = (checkedValue, key,iid) => {
        let isuccess = 0;
        if(checkedValue.length==2){
            isuccess = 1;
        }
        this.updateSuccess(iid,isuccess)
        if(this.state.menStep[key]){
            this.state.menStep[key] = false;
        }else{
            this.state.menStep[key] = checkedValue;
        }
        this.setState({
            menStep: this.state.menStep
        });
    }

    stepclick=(skey)=>{
        let idx = 0;
        this.state.stepData.map((item,index)=>{
            if(item.skey == skey){
                idx = index;
                return;
            }
        })
        if(this.state.current == idx){

        }else{
            this.setState({
                current:idx,
                choosenarray:[]
            },()=>{
                this.relateddata()
            })
        }
    }

    addnewdom=()=>{
        if(!this.state.choosenmodal&&this.state.choosenarray.length == 1){
            let item = this.state.stepData[this.state.current]
            let url = item.staburl
            let ilinktype = item.ilinktype
            let irelentityid = item.irelentity||''
            let irelentityiid = this.state.choosenarray[0].iid||''
            let param = ''
            if(this.props.iid>0&&this.state.pocdata!=undefined){
                param = JSON.stringify(this.state.pocdata)
            }
            if(ilinktype == '1'){
               return <VpIframe url={url + "?entityid=" + irelentityid + "&iid=" + irelentityiid +"&param="+param} />
            }else{
                let tabUrl = url.split('?')
                let staburl = tabUrl[0]
                let stabparam = ''
                if (tabUrl.length > 1) {
                    stabparam = tabUrl[1]
                }
                let Tabs = requireFile(staburl)
                let skey = item.skey;
                return(
                    <Tabs
                        entitytype={this.state.entitytype} //实体发起类型
                        eventmap={{}} //表单onsave，onload方法
                        add={irelentityiid==''?true:false}
                        params={{}}
                        closeRightModal={() => {}}
                        refreshList={() => {}}
                        entityid={irelentityid}
                        iid={irelentityiid}
                        row_entityid={irelentityid}
                        skey={skey}
                        row_id={irelentityiid}
                        viewtype={''}
                        hidden = {true}
                        iaccesslevel={item.iaccesslevel} //(0:读 1:写)
                        entityrole={item.iaccesslevel == '1' ? true : false}
                        stabparam={stabparam}
                        param = {
                           { formType : 'tabs'}
                        }
                        //关联实体参数
                        mainentity = {this.props.entityid}
                        mainentityiid = {this.props.iid}
                    />
                )
            }
        }
    }

    choosenmodal=()=>{
        if(this.state.selectItem.length == 1){
            this.setState({
                choosenarray:this.state.selectItem,
                //irelentityiid:this.state.selectItem.iid,
                choosenmodal:false
            })
        }else{
            VpAlertMsg({
                message:"消息提示",
                description:'请选择对象！',
                type:"error",
                onClose:this.onClose,
                closeText:"关闭",
                showIcon: true
            }, 5)
        }

    }

    canclechoosenmodal=()=>{
        this.setState({
            choosenmodal:false
        })
    }

    onRowClick=(record,index)=>{
        const selectedIdx = this.state.selectItem.findIndex((item) => record.iid === item.iid)
        if(selectedIdx != -1){
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
        }else{
            this.setState({
                selectedRowKeys: [record.iid],
                selectItem: [record]
            })
        }
    }

    onRowDoubleClick=(record,index)=>{

    }

    tableChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,selectedRowKeys
        })
    }

    //状态变迁
    handleStatus = (e) => {
        let variid=e.key;
        //获取变迁表单
        vpAdd('/{vpplat}/vfrm/entity/varilsForm', {
            sflag:false,
            entityid:this.props.entityid,
            iid:this.props.iid
        }).then((response) => {
            this.setState({
                varivisible: true,
                varilsForm: response.data,
                variid: variid,
                sflag: false,
                iassignto:response.data.iassignto
            })
        })
    }

     //关闭变迁状态弹出的模态框
   cancelModal = ()=> {
        this.setState({
            varivisible: false,
            varilsForm: {}
        })
    }

    //状态变迁提交按钮
    handleStatusSubmit(values) {
        if(this.state.sflag == 2){
            values.iassignto = this.state.iassignto
        }
        let iassignto = values.iassignto
        if (iassignto > 0 || this.state.sflag == 2) {
            let val = {...values }
            val.entityid=this.props.entityid
            val.variid=this.state.variid
            val.iid=this.props.iid
            let param={};
            param.param=JSON.stringify(val);
            this.saveRowData(param,false)
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

    saveRowData = (value,btn) => {
        const _this = this
        vpAdd('/{vpplat}/vfrm/entity/savestatus', {
            ...value
        }).then(function (data) {
            _this.setState({
                menStep: {},//每个工序的完成情况
                stepData: [],//工序数组
                taskbaseinfo: {},//任务基本信息
                statusList:[]
            },()=>{
                _this.taskprocess()
                _this.taskbaseinfo()
                _this.queryStatusList()
                _this.cancelModal();
            })
        }).catch(function (err) {
            _this.setState({
                loading: false
            })
        });
    }

    destoryDetailDom = () => {
        this.setState({
            showDetail: false
        })
    }

    openSrcDetail=()=>{
        let info =  this.state.taskbaseinfo
        let src_entityid,src_iid
        if(info.srcentity!=''&&info.src_entity!=undefined){
            src_entityid = info.srcentity;
            src_iid = info.srcentityiid
        }else{
            src_entityid = info.ientityid;
            src_iid = info.iid
        }
        this.setState({
            src_entityid,src_iid,showDetail:true
        })
    }

    render() {
        let _this = this
        let baseinfo = this.state.taskbaseinfo
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.tableChange,
        }
        if(this.state.stepData.length>0){
            return (
                <div className="handle-form full-height pr bg-white">
                    <VpRow gutter={10} className="full-height">
                        <VpCol span={16} className="full-height">
                            <div className="bg-white full-height pts">
                                <div className="title p-sm step-head">
                                    <VpSteps current={this.state.current}>
                                        {
                                            this.state.stepData ? this.state.stepData.map((item, index) => {
                                                return (
                                                    <Step
                                                        key={item.skey}
                                                        onClick = {()=>this.stepclick(item.skey)}
                                                        status={
                                                            this.state.stepData[this.state.current].skey === item.skey?
                                                            "":
                                                            this.state.menStep[item.skey] ?'finish':
                                                            'wait'}
                                                        title={
                                                            <VpDropdown trigger={['click']} overlay={
                                                                <VpMenu>
                                                                    <VpMenuItem key='0'>
                                                                        <VpCheckbox
                                                                            defaultValue = {[this.state.menStep[item.skey]]}
                                                                            className="m-xs"
                                                                            options={[{ value: true, label: "已完成" }]}
                                                                            onChange={(value) => this.handleMenuChange(value, item.skey,item.iid)} />
                                                                    </VpMenuItem>
                                                                </VpMenu>
                                                            }>
                                                                <span className="cursor">{item.sname}</span>
                                                            </VpDropdown>} />
                                                )
                                            }) : null
                                        }
                                    </VpSteps>
                                </div>
                                <div className="handle-form-content full-height">
                                {
                                    this.addnewdom()

                                }
                                </div>
                            </div>
                        </VpCol>
                        <VpCol span={8} className="handle-form-right full-height pr">
                            <div className="bg-white p-sm full-height scroll b-l">
                                <div className="p-b-sm b-b">
                                    <span className="fw f14">{baseinfo.taskname}</span>
                                    <span className="fr">
                                        {/* <VpTooltip title="保存">
                                            <VpIconFont className="text-primary m-r-sm cursor" type="vpicon-save"/>
                                        </VpTooltip> */}
                                         <VpDropdown

                                            overlay={
                                                <VpMenu onClick={(e) => _this.handleStatus(e)}>
                                                    {this.state.statusList.length > 0 ?
                                                        this.state.statusList.map((item, index) => {
                                                            return <VpMenuItem key={item.iid}>{item.sname}</VpMenuItem>
                                                        })
                                                        : null}
                                                </VpMenu>
                                            }>
                                            <VpTooltip title="任务流转">
                                                <VpIconFont type="f18 vpicon-circulation cursor" />
                                            </VpTooltip>
                                        </VpDropdown>
                                    </span>
                                </div>
                                <div className="detail p-tb-sm">
                                    <div className="title">
                                        <VpIconFont type="vpicon-file-text" />
                                        <span className="inline-display p-l-xs">基本信息</span>
                                    </div>
                                    <div className="content text-muted p-sm">
                                        <div className="m-b-sm clearfix">
                                            <span className="inline-display m-r-sm msg-title fl">
                                                <VpIconFont type="vpicon-user" className="m-r-md" />负责人
                                            </span>
                                            <span className="inline-display m-l-sm">{baseinfo.principal}</span>
                                        </div>
                                        <div className="m-b-sm clearfix">
                                            <span className="inline-display m-r-sm msg-title fl">
                                                <VpIconFont type="vpicon-fenlei" className="m-r-md" />类别
                                            </span>
                                            <span className="inline-display m-l-sm">{baseinfo.iclassid}</span>
                                        </div>
                                        <div className="m-b-sm clearfix">
                                            <span className="inline-display m-r-sm msg-title fl">
                                                <VpIconFont type="vpicon-collar" className="m-r-md" />状态
                                            </span>
                                            <span className="inline-display m-l-sm">{baseinfo.istatusid}</span>
                                        </div>
                                        <div className="m-b-sm clearfix">
                                            <span className="inline-display m-r-sm msg-title fl">
                                                <VpIconFont type="vpicon-implement-clock" className="m-r-md" />要求时间
                                            </span>
                                            <span className="inline-display m-l-sm">{baseinfo.dstartdate} -- {baseinfo.denddate}</span>
                                        </div>
                                        <div className="m-b-sm clearfix">
                                            <span className="inline-display m-r-sm msg-title fl">
                                                <VpIconFont type="vpicon-project" className="m-r-md" />工作内容
                                            </span>
                                            <span className="inline-display m-l-sm">{baseinfo.workbentch}</span>
                                        </div>
                                        <div className="m-b-sm clearfix">
                                            <span className="inline-display m-r-sm msg-title fl">
                                                <VpIconFont type="vpicon-users" className="m-r-md" />参与人
                                            </span>
                                            <span className="inline-display m-l-sm">{baseinfo.team}</span>
                                        </div>
                                        <div className="m-b-sm clearfix">
                                            <span className="inline-display m-r-sm msg-title fl ">
                                                <VpIconFont type="vpicon-hand-left" className="m-r-md" />任务来源
                                            </span>
                                            <span className="inline-display m-l-sm weiy" onClick={this.openSrcDetail}>{baseinfo.src}</span>
                                        </div>
                                    </div>
                                </div>
                                <div >
                                    <SubTask
                                        entityid={this.props.entityid}
                                        group_type={3}
                                        iid={this.props.iid}
                                    />
                                </div>
                                <div >
                                    <Follow
                                        entityid={this.props.entityid}
                                        entityrole={true}
                                        iid={this.props.iid}
                                        fromtype='handleform'
                                    />
                                </div>
                                <div >
                                    <RelationEntity
                                        entityid={this.props.entityid}
                                        group_type={3}
                                        iid={this.props.iid}
                                        origin={''}
                                        fromtype = 'daiban'
                                        taskprocess = {()=>this.taskprocess()}
                                    />
                                </div>
                            </div>
                        </VpCol>
                    </VpRow>
                    <VpModal
                        title='选择对象'
                        visible={this.state.choosenmodal}
                        onOk={() => this.choosenmodal()}
                        onCancel={() => this.canclechoosenmodal()}
                        width={'70%'}
                    >
                        {
                            this.state.choosenmodal?
                            <VpDTable
                                rowSelection={rowSelection}
                                columns={headers()}
                                dataSource={this.state.tablearray}
                                onRowClick={this.onRowClick}
                                onDoubleClick={this.onRowDoubleClick}
                                rowKey={record => record.iid}
                                pagination={false}
                                resize
                                // bordered
                            />
                            :null
                        }
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
                            <VpDynamicForm
                                className="p-sm full-height scroll p-b-xxlg"
                                formData={this.state.varilsForm}
                                iid={this.props.taskid}
                                handleOk={(values) => this.handleStatusSubmit(values)}
                                handleCancel={() => this.cancelModal()}
                                loading={this.state.loading}
                                okText="提 交" />
                            : null
                        }
                    </VpModal>
                    <RightBox
                        max={false}
                        button={
                            <div className="icon p-xs" onClick={this.destoryDetailDom}>
                                <VpTooltip placement="top" title=''>
                                    <VpIcon type="right" />
                                </VpTooltip>
                            </div>}

                        show={this.state.showDetail}>
                        {this.state.showDetail ?
                        <DynamicTabs
                            param={{
                                entityid: this.state.src_entityid,
                                iid: this.state.src_iid,
                                type: false,
                                viewtype: '',
                                entitytype: this.state.entitytype,
                                defaultActiveKey: ''
                            }}
                            data={{

                            }}
                            closeRightModal={() => this.destoryDetailDom()}
                            refreshList={() => { }}
                        />
                        :
                        ''}
                </RightBox>
                </div>
            )
        }else{
            return (
                <DynamicTabs
                    param={{
                        entityid: this.props.entityid,
                        iid: this.props.iid,
                        type: false,
                        viewtype: '',
                        entitytype: false,
                        defaultActiveKey: ''
                    }}
                    closeRightModal={() => this.props.closeRightModal()}
                    refreshList={() => {}}
                />
            )
        }

    }
}