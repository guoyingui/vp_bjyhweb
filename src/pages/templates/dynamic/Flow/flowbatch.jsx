import React, { Component } from 'react'
import { VpSpin,VpCollapse, VpIcon, VpTooltip, VpAlertMsg, VpModal, vpQuery, vpAdd, VpIframe, VpTable, VpTabs, VpTabPane, VpFormCreate } from 'vpreact';
import './index.less';
import { VpDynamicForm } from 'vpbusiness';

class flowbatch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: '',
            handlers:[],
            eventmap: {},
            flowtabs_array:[],
            spinning:false,
            loading:false
        }
    }

    componentWillMount() {
        this.setState({ spinning:true })
        let { taskids } = this.props
        if(taskids){
            this.getFormData(taskids)
        }
    }

    componentDidMount() {
        this.setState({spinning:false})
    }

    getFormData=(taskids)=>{
        let _this = this;
        vpQuery('/{vpflow}/rest/flowbatch/batchform', {taskids})
        .then(function (response) {
            let eventmap = response.data.eventmap
            let flowtabs_array = response.data.flowtabs_array
            let form = response.data.form
            top.window.data = response.data
            // let onloadevent = eventmap ? eventmap.onload :''
            // if(onloadevent!=''&&onloadevent!=undefined){
            //     let param = { data:response.data,}
            //     onloads(param,onloadevent)
            //     let flowflag = data.flowflag
            //     data.form.groups[0].fields = data.form.groups[0].fields.map(x=>{
            //         if(x.field_name==flowflag){
            //             if(x.widget.default_value&&data.handlers&&data.handlers.length>1){
            //                 //data.scondition= x.widget.default_value
            //                 data.scondition = x.widget.default_value
            //                 let warn_flag = true
            //                 data.handlers.filter((item) => {
            //                     if( item.flag == data.scondition || item.condition == null || item.condition == ''){
            //                         warn_flag = false
            //                     }
            //                 })
            //                 if(warn_flag){
            //                     //x.validator={"required":true,"message":"没有找到对应流程分支信息"}
            //                     VpAlertMsg({
            //                         message:"消息提示",
            //                         description:'没有找到对应流程分支信息！',
            //                         type:"error",
            //                         onClose:this.onClose,
            //                         closeText:"关闭",
            //                         showIcon: true
            //                     }, 5)
            //                     //return
            //                 }
            //             }
            //         }
            //         return x
            //     })
            //     data.form.groups[0].fields = data.form.groups[0].fields.map(x=>{
            //         if(x.field_name=='scondition'){
            //             x.widget.default_value=data.scondition
            //         }
            //         return x
            //     })
            //     response.data = data
            // }
    
            let handlers = response.data.handlers
            let scondition = response.data.scondition
            let newdata = handlers ? handlers.filter((item) => {
                return item.flag == scondition || item.condition == null || item.condition == ''
            }) : [];
            newdata = newdata.map(x=>{
                return {
                    all_line: 2,
                    field_label: x.stepname,
                    field_name: x.stepkey,
                    irelationentityid: x.irelationentityid,
                    //readonly: true,
                    disabled: x.lastuserflag==1&&!(x.ids==null||x.ids=='')?true:false,
                    url: "vfm/ChooseEntity/ChooseEntity",
                    validator: { message: "输入内容不能为空！", required: true },
                    widget: { default_value: x.ids, default_label: x.names },
                    widget_type: "multiselectmodel"
                }
            })
            let flow_handler = {
                "group_label": "预设处理人",
                "group_type": 1,
                "fields": newdata
            }
            form.groups = form.groups.map(x=>{
                if(x.group_code=="flow_handler"){
                    flow_handler.group_label=x.group_label
                    flow_handler.group_type=x.group_type
                    flow_handler.group_code='flow_handler'
                    return flow_handler
                }
                return x
            })

            form.groups = form.groups.filter(x=>  (x.group_code=="flow_handler"||x.group_code=='info')?true:false)
            _this.setState({formData: form,handlers,eventmap,flowtabs_array})
        }).catch(function (err) {
            console.log(err);
        });
    }

    // 动态表单事件
    handleCondition = (e) => {
        let scondition = e.target.value
        let handlers = this.state.handlers
        let newdata = handlers ? handlers.filter((item) => {
            return item.flag == scondition || item.condition == null || item.condition == ''
        }) : []
        newdata = newdata.map(x=>{
            return {
                all_line: 2,
                field_label: x.stepname,
                field_name: x.stepkey,
                irelationentityid: x.irelationentityid,
                //readonly: true,
                disabled: x.lastuserflag==1&&!(x.ids==null||x.ids=='')?true:false,
                url: "vfm/ChooseEntity/ChooseEntity",
                validator: { message: "输入内容不能为空！", required: true },
                widget: { default_value: x.ids, default_label: x.names },
                widget_type: "multiselectmodel"
            }
        })
        let formData = this.state.formData
        formData.groups = formData.groups.map(x=>{
            if(x.group_code=="flow_handler"){
                x.fields=newdata
                return x
            }
            return x
        })
        this.setState({formData})
    }

    handleChange =(e) =>{
        let value = e;
        if(e.target){
            value= e.target.value
        }
        let formData = this.state.formData
        formdata.scondition=value
        this.setState({formData})
        return true
    }

    resetHandler = () => {
        return (
            <div className="form-edit-table full-height bg-white scroll-y">
                <VpDynamicForm
                    ref={(node) => this.dynamic = node}
                    bindThis={this}
                    tablePagination={false}
                    formData={this.state.formData}
                    handleOk={this.handleSubmit}
                    handleCancel={this.handleCancel}
                    okText="提 交"
                    loading = {this.state.loading}
                />
            </div>

        )
    } 

    handleSubmit = (value) => {
        this.setState({loading:true})
      
        //let param = { taskId: this.props.staskid,  formdata: value }
        vpAdd('/{vpflow}/rest/flowbatch/handle-task?', {
            taskids: this.props.taskids,
            sparam: JSON.stringify({formdata:value})
        }).then((response) => {
            this.setState({loading:false})
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
            this.props.getData()
            this.props.closeRight()
        })
    }

    //子组件向父组件通讯，通过函数传递参数
    handleCancel = () =>{
        this.props.closeRight(false)
    }

    closeRightModal = () => {
        this.props.closeRight(false)
    }

    render() {
        let flowtabs_array =  this.state.flowtabs_array.filter(x=>{
            return x.skey=='flow_step'? true: false
        })
        return (
            <VpSpin spinning = {this.state.spinning} size="large">
            <div className="flowtabs workflow full-height">
                <VpTabs defaultActiveKey="0">
                    {
                        flowtabs_array.map(item=>{
                                // debugger
                                // return 
                                // <VpTabPane tab={item.sname} key='0'>
                                // {this.state.formData.groups ? this.resetHandler() : null}
                                // </VpTabPane>
                            return <VpTabPane tab={item.sname} key='0'>
                            {this.state.formData.groups ? this.resetHandler() : null}
                            </VpTabPane>
                        })
                        
                    }
                </VpTabs>
            </div>
            </VpSpin>
        )
    }


}

export default flowbatch = VpFormCreate(flowbatch);