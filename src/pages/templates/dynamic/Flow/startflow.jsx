import React, { Component } from 'react'
import {
    vpQuery,
    VpAlertMsg,
    VpModal,
} from 'vpreact';
import { VpDTable } from 'vpbusiness';
import { vpAdd } from 'vpreact/public/Vp';

//发起流程列表
function fqflow(){
    return [
        {
            title: '流程名称',
            dataIndex: 'sname',
            key: 'sname',
            width: 100
        },
        {
            title: '版本号1',
            dataIndex: 'iversion',
            key: 'iversion',
            width: 100
        }
    ];
}



export default class startflow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            statusList: [],
            increaseData: {},
            loading: false,
            formvalue: '',
            visible: false,
            varilsForm: '',
            variid: '',
            sub_header: [],
            sub_data: [],
            iid:0,
            edit_data:[],
            keyindex:0,
            modalvisible:false,
            flowArray:[],
            flowHeader:[],
            selectedRowKeys:'',
            selectedSkeys:'',
            newiid:'',
            startflowUrl:'/{bjyh}/customFlowConf/flowStartList',
            access: true,
        }
    }

    componentWillMount() {
        this.setState({
            flowHeader:fqflow()
        },()=>{
            this.handleflow()
        })
    }

    componentDidMount() {
        
    }
 

    handleflow=()=>{
        let sparam = {
            iid:this.props.iid,
            ientityid:this.props.entityid
        }
        let url = this.state.startflowUrl
        if(this.props.entityid==9||this.props.entityid==10){//高层计划，任务计划流程，发起流程用流程服务
                url = '/{vpflow}/rest/flowstart/list';
        }
        vpQuery(url,sparam).then((reponse)=>{
            let array = reponse.data
            if(this.props.entityid==9||this.props.entityid==10){//高层计划，任务计划流程，发起流程用流程服务
                array = reponse.data.result
            }
            this.checkFlows(array).then(v => {                
                if(array.length==1){
                    if(v.length && v[0].access === false){
                        this.alertMsg(`没有完成的 ${v[0].dependentName} ，无法发起 ${v[0].sname}。`, 'warning');
                        return this.props.destoryDom()
                    } else {
                        let entityid = this.props.entityid
                        let iid = this.props.iid
                        let flowdatas = array[0]
                        vpQuery('/{vpflow}/rest/process/start-process',{
                            skey:flowdatas.skey,
                            ientityid:entityid,
                            iobjectid :iid
                        }).then((response)=>{
                            if(response.data == undefined){
                                VpAlertMsg({ 
                                    message:"消息提示",
                                    description:'无可发起流程！',
                                    type:"error",
                                    onClose:this.onClose,
                                    closeText:"关闭",
                                    showIcon: true
                                }, 5)
                                this.props.destoryDom()
                                return 
                            }
                            VpAlertMsg({ 
                                message:"消息提示",
                                description:'流程发起成功！',
                                type:"success",
                                onClose:this.onClose,
                                closeText:"关闭",
                                showIcon: true
                            }, 5)
                            this.props.refreshFormData()
                            this.props.destoryDom(response.data.record)
                        })
                    }
                    
                }else if (array.length==0) {
                        this.props.destoryDom()
                        VpAlertMsg({ 
                        message:"消息提示",
                        description:'暂无可发起的流程！',
                        type:"error",
                        onClose:this.onClose,
                        closeText:"关闭",
                        showIcon: true
                    }, 5)
                }else{
                    this.setState({
                        flowArray:array,
                        modalvisible:true,
                    })
                }
            })
           
       })
    }   

    checkFlows = ([...array]) => {
        return new Promise((resolve,reject) => {
            let _this = this
            array.map(item => {
                // if(item.skey === 'jdsjps') {
                //     item.dependent = 'jgpslc'
                //     item.dependentName = '架构评审流程'
                //     item.entityid = 7;
                // } else 
                if(item.skey === 'jgpslc') {
                    item.dependent = 'xqfxlc'
                    item.dependentName = '需求分析流程'
                } else {
                    array.pop(item)
                }
            })
            if(!array && !array.length){
                resolve([]);
            }
            vpAdd('{bjyh}/checkFlowStart/checkAccess',{
                iid: this.props.iid,
                entityid: this.props.entityid,
                flows: JSON.stringify(array)
            }).then(response => {
                if(response.data && response.data.length) {
                    _this.setState({
                        startAccess: response.data
                    })
                    resolve(response.data)
                }else {
                    resolve([])
                }
            })
        })
    }
    checkAccess = selectedSkeys =>{
        let {startAccess} = this.state
        let access = true
        startAccess && startAccess.map(element => {
            if(element.skey === selectedSkeys && element.access === false) {
                access = false
                this.alertMsg(`没有完成的 ${element.dependentName} 无法发起 ${element.sname}。`, 'warning');
            }
        })
        return access
    }

    okflowModal=()=>{
        let _this = this
        let {selectedSkeys} = _this.state
        let entityid = _this.props.entityid
        let iid = _this.props.iid
        if(selectedSkeys==''){
            VpAlertMsg({ 
                message:"消息提示",
                description:'请选择相关流程！',
                type:"error",
                onClose:this.onClose,
                closeText:"关闭",
                showIcon: true
            }, 5)
            return;
        }
        const access = this.checkAccess(selectedSkeys[0]);
        if(!access) {
            return
        }
        vpQuery('/{vpflow}/rest/process/start-process',{
            skey:selectedSkeys,
            ientityid:entityid,
            iobjectid :iid
        }).then((response)=>{
            if(response.data == undefined){
                //alert(response.msg);
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
            //alert(response.data.record.piId)
            VpAlertMsg({ 
                message:"消息提示",
                description:'流程发起成功！',
                type:"success",
                onClose:this.onClose,
                closeText:"关闭",
                showIcon: true
            }, 5)
            _this.setState({
                modalvisible:false,
            },()=>{
                _this.props.refreshFormData('saveAndFlow')
                _this.props.destoryDom(response.data.record)
            }) 
        })
    }

    cancelflowModal=()=>{
        this.setState({
            modalvisible:false
        })
        this.props.refreshFormData()
        this.props.destoryDom()
    }

    handleSelect=(record, selected, selectedRows)=>{
        let idx = 0;
        if(selected){
            this.setState({
                selectItem: [ record],
                selectedSkeys:[record.skey]
            })
        }
    }
    onSelectChange=(selectedRowKeys)=> {
        this.setState({ selectedRowKeys });
    }

    onFlowRowClick=(record)=>{
        this.setState({
            selectItem:[record],
            selectedSkeys:[record.skey]
        }) 
    }

    onFlowRowDoubleClick= (record, index)=>{
        //alert(1)
        let _this = this
        let entityid = _this.props.entityid
        let iid = _this.props.iid

        const access = this.checkAccess(record.skey);
        if(!access) {
            return
        }
        vpQuery('/{vpflow}/rest/process/start-process',{
            skey:[record.skey],
            ientityid: entityid,
            iobjectid: iid,
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
            _this.props.refreshFormData()
            _this.props.destoryDom(response.data.record)
        })
    }

    alertMsg=(desc,type,message)=>{
        //return(
            VpAlertMsg({
                message: message||"消息提示",
                description: desc||'!',
                type: type||'info',
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 3)
        //)
    }

    render() {
        const rowSelection = { 
            type:'radio',
            onSelect: this.handleSelect, 
            selectedRowKeys:this.state.selectedSkeys,
            onChange: this.onSelectChange,
        }
        return (
                <VpModal
                    title='发起流程'
                    visible={this.state.modalvisible}
                    onOk={() => this.okflowModal()}
                    onCancel={() => this.cancelflowModal()}
                    width={'70%'}
                    >
                    <VpDTable 
                        rowSelection={rowSelection} 
                        columns={this.state.flowHeader}
                        dataSource={this.state.flowArray}
                        onRowClick={this.onFlowRowClick}
                        onDoubleClick={this.onFlowRowDoubleClick}
                        rowKey={record => record.skey}
                        resize
                        // bordered
                    />
                </VpModal>
        )
    }
}
