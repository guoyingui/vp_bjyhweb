import React,{Component} from 'react';
import {vpAdd, VpAlertMsg, VpButton, VpIcon, VpModal, vpQuery, VpTooltip,VpInput} from "vpreact";
import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';
import Choosen from '../Form/ChooseEntity';
import {setContext} from 'reduxs/actions/action';


/**
 * 更改处理人按钮
 */
class StartFlowButton extends Component {
    constructor(props) {
        super(props);
        this.state ={
            showRightBox:false,
            resionText:""
        }
        this.onClick = this.onClick.bind(this);
        this.cancelChoosen = this.cancelChoosen.bind(this);
    }

    /**
     * 设置表单提交状态
     * */
    setFormSubmiting(submiting){
        this.props.setFormSubmiting && this.props.setFormSubmiting(this.props._contextid,submiting);
    }


    cancelChoosen(){
        this.setState({ updateHandler: false,selectItem:[] })
        this.setFormSubmiting(false);
    }
    submitChoosenBefore = (selectItem) => {
        if(selectItem.length>0){
            this.setState({
                selectItem:[...selectItem],
                visibleResion:true,
                updateHandler:false
            });
        }else{
            VpAlertMsg({
                message: "消息提示",
                description: '请选择处理人！',
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
        }
    }
    submitChoosen = (selectItem) => {
        const _this = this
        vpAdd('/{vpflow}/rest/task/transfer-task', {
            taskId: this.props.staskid,
            userid: selectItem[0].iid,
            resionText:this.state.resionText
        }).then((response) => {
            this.cancelChoosen()
            this.handleCancelResion()
            VpAlertMsg({
                message: "消息提示",
                description: "更改处理人成功!",
                type: "success",
                onClose: _this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5)
            this.props.closeRight && this.props.closeRight();

            /* 20200302 增加更改处理人后发送邮件通知 by SL. */
            if(response.data === 'ok'){
                vpAdd('/{bjyh}/util/sendEmailByUserid',{
                    taskId: this.props.staskid,
                    piid:this.props.piid,
                    userid: selectItem[0].iid,
                    resionText:this.state.resionText
                }).then((response)=>{

                })
            }     
        })
    }

    onClick(){
        this.setState({
            updateHandler: true
        })
    }
    handleOkResion = () => {
        /*if(!this.state.resionText){
            VpAlertMsg({
                message:"消息提示",
                description:"更改处理人原因不能为空",
                type:"error",
                onClose:this.onClose,
                closeText:"关闭",
                showIcon: true
            }, 5)
            return;
        }*/
        this.submitChoosen(this.state.selectItem)
    }
    handleCancelResion = () => {
        this.setState({
            visibleResion:false,
            resionText:""
        })
    }
    setResionText = (e) => {
        this.setState({
            resionText:e.target.value
        })
    }

    render() {
        let {name,text,...otherProps} = this.props.btnProps;
        return (
            <div style={{display:'inline-block'}} className="text-left" >{/*加text-left样式是为了抵消父div中有text-right样式*/}
                <VpButton loading={this.props.submiting} {...otherProps}  key={name}   onClick={this.onClick} > {text}</VpButton>
                <VpModal
                    title='更改处理人'
                    visible={this.state.updateHandler}
                    width={'70%'}
                    footer={null}
                    wrapClassName='modal-no-footer'
                    onCancel={() => this.cancelChoosen()}
                >
                    {
                        this.state.updateHandler ?
                            <Choosen
                                item={{ irelationentityid: '2', widget_type: 'selectmodel',
                                    modalProps:{
                                        condition:this.props.moduserCondition||[],
                                        ajaxurl:this.props.ajaxurl||''
                                        }
                                    }}
                                initValue={[]}
                                onCancel={() => this.cancelChoosen()}
                                onOk={(selectItem) => this.submitChoosenBefore(selectItem)}
                            />
                            : ''
                    }
                </VpModal>
                <VpModal
                    title="更改处理人意见"
                    visible={this.state.visibleResion}
                    maskClosable={false}
                    onOk={this.handleOkResion}
                    onCancel={this.handleCancelResion}
                    okText="确定" cancelText="取消" style={{height:"400px"}}>
                    <div>
                        <VpInput value={this.state.resionText} onChange={(e)=>this.setResionText(e)} type="textarea" rows={8} />
                    </div>
                </VpModal>
            </div>
        )
    }
}


function mapStateToProps(state,ownProps){
    return {
        submiting:state[ownProps._contextid]&&state[ownProps._contextid].submiting
    }
}



function mapToDispatchToProps(dispatch,ownProps){
    return {
        setFormSubmiting : (contextid,submiting) =>{
            dispatch(setContext(contextid,{
                submiting
            }));
        }
    }
}
/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends StatusButton.Component {
 *
 * }
 * CustomComponent = DynamicForm.createClass(CustomComponent);
 * @param newClass
 */
let createClass = function(newClass){
    let wrapClass = connect(mapStateToProps,mapToDispatchToProps)(newClass);
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(StartFlowButton);