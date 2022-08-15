import React,{Component} from 'react';
import {
    vpAdd,
    VpAlertMsg,
    VpButton,
    VpFInput,
    VpForm,
    VpFSelect,
    VpIcon,
    VpModal, VpOption,
    vpQuery,
    VpSelect,
    VpTooltip,
    VpFormCreate
} from "vpreact";
import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';
import Form from '../Form/Form';
import {setContext} from 'reduxs/actions/action';

/**
 * 更改处理人按钮
 */
class StartFlowButton extends Component {
    constructor(props) {
        super(props);
        this.state ={
            showRightBox:false,
        }
        this.onClick = this.onClick.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.okJumpModal = this.okJumpModal.bind(this);
    }

    componentWillMount() {
        this.queryActStep();
    }

    /**
     * 设置表单提交状态
     * */
    setFormSubmiting(submiting){
        this.props.setFormSubmiting && this.props.setFormSubmiting(this.props._contextid,submiting);
    }

    //查询流程所有步骤
    queryActStep = () => {
        vpQuery('/{vpflow}/rest/workflow/tasks', {
            key: this.props.pdid.split(':')[0]
        }).then((response) => {
            this.setState({
                steps: response.data
            })
        })
    }

    cancelModal() {
        this.setFormSubmiting(false);
        this.setState({
            visible: false
        })
    }

    onClick(){
        this.queryActStep()
        this.setState({
            visible: true,
            activityName: this.props.activityName
        })
    }

    okJumpModal(values) {
        debugger;
        const _this = this
        vpAdd('/{vpflow}/rest/intervene/jump', {
            ...values,
            taskId: _this.props.staskid,
        }).then((response) => {
            _this.cancelModal()
            VpAlertMsg({
                message: "消息提示",
                description: '更改步骤成功！',
                type: "success",
                closeText: "关闭",
                showIcon: true
            }, 5)
            _this.props.closeRight && _this.props.closeRight()
        })
    }

    render() {
        if(!this.state.steps || !this.state.steps.length){
            return null;
        }
        let {name,text,...otherProps} = this.props.btnProps;
        let formItemLayoutAllLine = {
            labelCol: { span: 3 },
            wrapperCol: { span: 19 }
        }
        let formData = {
            "groups": [{
                "group_label": "自由跳转", //组标题
                "group_type": 3, //组类型，0-节固定，1-节默认展开，2-节默认收起，3-节标题不显示，4-节和属性隐藏不显示
                "fields": [{
                    widget_type: 'text',
                    field_name: 'currentStep',
                    all_line: 2,
                    props: {
                        label: '当前步骤',
                        readOnly: true,
                        ...formItemLayoutAllLine
                    },
                    fieldProps: {
                        initialValue: this.state.activityName
                    }
                }, {
                    widget_type: 'select',
                    field_name: 'jumpStepkey',
                    all_line: 2,
                    props: {
                        label: '跳转步骤',
                        ...formItemLayoutAllLine,
                        optionsData: this.state.steps.map((item, index) => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        })
                    },
                    fieldProps: {
                        rules:[{
                            required:true,message:"请选择跳转步骤"
                        }]
                    }
                }, {
                    widget_type: 'selectmodel',
                    field_name: 'userids',
                    all_line: 2,
                    props: {
                        label: '处理人',
                        "irelationentityid":2,
                        ...formItemLayoutAllLine
                    },
                    fieldProps: {
                        rules:[{
                            required:true,message:"请选择处理人"
                        }]
                    }
                }]
            }]
        };

        return (
            <div style={{display:'inline-block'}} className="text-left" >{/*加text-left样式是为了抵消父div中有text-right样式*/}
                <VpButton loading={this.props.submiting} {...otherProps}  key={name}   onClick={this.onClick} > {text}</VpButton>
                <VpModal
                    title='自由跳转'
                    visible={this.state.visible}
                    width={'50%'}
                    height={'60%'}
                    wrapClassName='modal-no-footer'
                >
                    {
                        this.state.visible ?
                            <Form
                                handleOk={this.okJumpModal}
                                handleCancel={this.cancelModal}
                                formData={formData}
                            />
                            :
                            ''
                    }
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
    let wrapClass = VpFormCreate(connect(mapStateToProps,mapToDispatchToProps)(newClass));
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(StartFlowButton);