import React, { Component } from 'react'
import {
    VpButton,
    VpFormCreate,
    vpAdd,
    VpModal,
    VpAlertMsg
} from "vpreact";
import Form from '../Form/Form';
import {
    formDataToWidgetProps
} from '../Form/Widgets';

import {setContext} from 'reduxs/actions/action';
import {connect} from 'react-redux';

/**
 * 状态变迁按钮
 */
class StatusButton extends Component {
    /**
     *
     * @param props
     * {
     *     formData {} 整个要提交的表单数据
     *     sflag string 表单状态
     *     entityid string 实体id
     *     iid  string 实体实例id
     * }
     */
    constructor(props){
        super(props);
        this.state={
            visible:false,
            varilsForm:{}
        }
        this.onClick = this.onClick.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.handleStatusSubmit = this.handleStatusSubmit.bind(this);
    }


    //点击状态变迁按钮
    onClick (){
        this.setFormSubmiting(true);
        this.props.form.validateFieldsAndScroll((errors,values) => {
            if(errors && this.props.text!='更改处理人'){
                this.setFormSubmiting(false);
                return;
            }
            //获取变迁表单
            vpAdd('/{vpplat}/vfrm/entity/varilsForm', {
                sflag: this.props.sflag,
                entityid: this.props.entityid,
                iid: this.props.iid
            }).then((response) => {
                let varilsForm = formDataToWidgetProps(response.data);
                let iassigntoData = varilsForm.findWidgetByName("iassignto");
                if(iassigntoData && iassigntoData.field){
                    iassigntoData.field.fieldProps.rules = [{
                        required:true,message:"下一步处理人不能为空"
                    }];
                }
                this.setState({
                    visible: true,
                    varilsForm: varilsForm,
                    iassignto: response.data.iassignto
                })
            });
        });
        
    }

    /**
     * 提交表单
     * @param values
     */
    handleStatusSubmit(values){
        this.props.onSave && this.props.onSave(this.props.iid,values);
        this.closeModal();
    }

    closeModal(){
        this.setState({
            visible:false
        })
    }

    cancelModal = () => {
        this.setFormSubmiting(false);
        this.closeModal();
    }

     /**
      * 设置成表单提交状态
      */
     setFormSubmiting = (submiting) => {
        this.props.setFormSubmiting && this.props.setFormSubmiting(this.props._contextid,submiting);
     }

    render(){
        let {name,text,handler,handlerWrap,...otherProps} = this.props;
        return(
            <div style={{display:'inline-block'}}>
            <VpButton loading={this.props.submiting} {...otherProps}  key={name}   onClick={this.onClick} > {text}</VpButton>
            <VpModal
                title='状态变迁'
                visible={this.state.visible}
                onCancel={this.cancelModal}
                width={'70%'}
                footer={null}
                wrapClassName='modal-no-footer'
            >
                {this.state.visible ?
                    <Form
                        className="p-sm full-height scroll p-b-xxlg"
                        formData={this.state.varilsForm}
                        handleOk={this.handleStatusSubmit}
                        okText="提 交"
                        handleCancel={this.cancelModal}>
                    </Form>:''
                }
            </VpModal>
            </div>
        );
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
 * class CustomStatusButton extends StatusButton.Component {
 *
 * }
 * CustomStatusButton = DynamicForm.createClass(CustomStatusButton);
 * @param newClass
 */
let createClass = function(newClass){
    let wrapClass = connect(mapStateToProps,mapToDispatchToProps)(newClass);
    wrapClass.Component = newClass;
    wrapClass.createClass = createClass;
    return wrapClass;
}
export default createClass(StatusButton);
