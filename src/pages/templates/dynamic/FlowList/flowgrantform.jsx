import React, { Component } from 'react'
import { vpAdd ,
    VpFormCreate, 
    VpDatePicker, 
    VpOption, 
    VpForm, 
    VpButton, 
    VpSelect, 
    VpModal, 
    VpAlertMsg,
    vpQuery,
    VpRow, 
    VpCol, 
    VpInput
 } from 'vpreact';
import Choosen from '../Form/ChooseEntity';

class flowgrantform extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            usernames: '',
            userids: '',
            options: [],
            visible_flow: false,
            type: '0',
            flow: '',
            starttime:'',
            endtime:'',
        }
    }

    componentWillMount() {

    }
    handleSubmit(e) {
        e.preventDefault();
    }

    showUserModal = () => {
        this.setState({ visible: true });
    }

    cancelModal = () => {
        this.setState({ visible: false });
    }

    okUserModal = (selectedItem) => {
        let userids = selectedItem.map(item => item.iid).join();
        if (userids.length > 0) {
            this.cancelModal()
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: '请选择需要添加的用户！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
        }
        let usernames = selectedItem.map(item => item.sname).join();
        this.setState({ usernames, userids });
    }

    changeType = (type) => {
        this.setState({
            type
        }, () => {
                if (type == 0) {
                    this.setState({ options: [] })
                }
                if (type == 1) {
                    vpQuery('/{vpflow}/rest/workflow/list', {
                    }).then((response) => {
                        let options = response.data.map((item) => {
                            return <VpOption key={item.skey}>{item.sname}</VpOption>
                        });
                        this.setState({ options })
                    })
                    return
                }
                vpQuery('/{vpflow}/rest/process/list', {
                }).then((response) => {
                    let options = response.data.map((item) => {
                        return <VpOption key={item.piId}>{item.piName}</VpOption>
                    })
                    this.setState({ options })
                });

            })

    }
    okModal = () => {
        // this.props.form.validateFields((errors, values) => {
        //     if (!!errors) {
        //         console.log(errors);
        //         return;
        //     }
        // })
        
        let delegatee = this.state.userids
        let type = this.state.type
        let flow = this.state.flow
        // let starttime = $('#starttime').val().replace(/\s/g, "")
        // let endtime = $('#endtime').val().replace(/\s/g, "")
        if (delegatee==""){
            VpAlertMsg({
                message: "消息提示",
                description: '所选用户不能为空！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            return;
        }
        if (type != '0' && flow == "") {
            VpAlertMsg({
                message: "消息提示",
                description: '流程不能为空！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            return;
        }
        this.props.cancelModal()
        let starttime = this.state.starttime
        let endtime = this.state.endtime
        let params = {delegatee, type, flow, starttime, endtime }
        vpAdd('/{vpflow}/rest/flowgrant/save', params).then((rst) => {
            this.props.okModal()
        })
        
    }

    render() {
        const { getFieldProps } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <div style={{ marginTop: 100 }}>
                <VpForm horizontal onSubmit={this.handleSubmit}>
                    <div>
                        {/* <VpFInput label="授予" placeholder="选择相关用户"
                            onClick={this.showUserModal}
                            {...formItemLayout}
                            {...getFieldProps('delegatee', {
                                initialValue: this.state.usernames,
                                rules: [
                                    {
                                        required: true,
                                        message: '用户不能为空!'
                                    },
                                ],
                            })} /> */}

                        <VpRow style={{ marginTop: 15 }}>
                            <VpCol span={6} className="text-right p-lr-sm">
                                <label> 授予 :</label>
                            </VpCol>
                            <VpCol span={14}>
                                <VpInput placeholder="选择相关用户" 
                                    value={this.state.usernames} onClick={this.showUserModal}
                                />
                            </VpCol>
                        </VpRow>
                        <VpRow style={{ marginTop: 15 }}>
                            <VpCol span={6} className="text-right p-lr-sm">
                                <label> 授权方式 :</label>
                            </VpCol>
                            <VpCol span={14}>
                                <VpSelect defaultValue={this.state.type} onChange={this.changeType}>
                                    <VpOption value="0">所有</VpOption>
                                    <VpOption value="1">流程</VpOption>
                                    <VpOption value="2">运行中的流程</VpOption>
                                </VpSelect>
                            </VpCol>
                        </VpRow>
                        <VpRow style={{ marginTop: 15 }}>
                            <VpCol span={6} className="text-right p-lr-sm">
                                <label> 流程 :</label>
                            </VpCol>
                            <VpCol span={14} >
                                <VpSelect defaultValue={this.state.flow} onChange={(flow)=> this.setState({flow})}>
                                    <VpOption value="">请选择</VpOption>
                                    {this.state.options}
                                </VpSelect>
                            </VpCol>
                        </VpRow>
                        <VpRow style={{ marginTop: 15 }}>
                            <VpCol span={6} className="text-right p-lr-sm">
                                <label> 授权时间 :</label>
                            </VpCol>
                            <VpCol span={14}>
                                <VpRow>
                                    <VpCol span={11}>
                                        <VpDatePicker defaultValue={this.state.starttime} onChange={(value, dateString)=>this.setState({starttime:dateString})} placeholder="开始时间" />
                                    </VpCol>
                                    <VpCol span={2}>
                                    </VpCol>
                                    <VpCol span={11}>
                                        <VpDatePicker defaultValue={this.state.endtime} onChange={(value, dateString)=>this.setState({endtime:dateString})} placeholder="结束时间" />
                                    </VpCol>
                                </VpRow>

                            </VpCol>
                        </VpRow>
                        <div className="footer-button-wrap ant-modal-footer" >
                            <VpButton className="m-r-xs" type="primary" onClick={() => this.okModal()}>保存</VpButton>
                            <VpButton className="m-r-xs" onClick={()=>  this.props.cancelModal()}>取消</VpButton>
                        </div>
                    </div>
                </VpForm>
                <VpModal
                    title='选择用户'
                    visible={this.state.visible}
                    onCancel={() => this.cancelModal()}
                    width={'70%'}
                    wrapClassName='modal-no-footer'
                    footer={null}
                >
                    {this.state.visible ?
                        <Choosen
                            item={{ irelationentityid: '2' }}
                            ientityid={2}
                            initValue={[]}
                            params={{}}
                            onCancel={() => this.cancelModal()}
                            onOk={(selectItem) => this.okUserModal(selectItem)}
                        />
                        : ''
                    }

                </VpModal>
            </div>
        )
    }
}


export default flowgrantform = VpFormCreate(flowgrantform);