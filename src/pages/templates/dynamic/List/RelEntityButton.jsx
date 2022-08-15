import React, { Component } from 'react'
import {VpButton, VpIcon,VpModal,vpAdd } from "vpreact";

import Choosen from '../Form/ChooseEntity';
import {randomKey} from "../utils";

import {connect} from 'react-redux';
import {changeQueryParams} from 'reduxs/actions/action';

/**
 * 关联实体按钮
 */
class RelEntityButton extends  Component{
    constructor(props){
        super(props);

        this.state ={
            addReal:false,
        }

        this.submitChoosen = this.submitChoosen.bind(this);
        this.addRealtion = this.addRealtion.bind(this);
        this.cancelChoosen = this.cancelChoosen.bind(this);
    }

    changeQueryParams(queryParams){
        this.props.changeQueryParams && this.props.changeQueryParams(queryParams);
    }

    //保存关联选择实体，保存关联关系
    submitChoosen(selectItem) {
        const _this = this
        let param = {
            selectitem: selectItem,
            irealid: this.state.irelationid,
            curentity: this.props.mainentityid,
            mainentityiid: this.props.mainentityiid,
            irelationentity: this.props.entityid,
            isTab: "true",
            stabparam: this.props.stabparam
        }
        vpAdd('/{vpplat}/vfrm/entity/addReal', {
            sparam: JSON.stringify(param)
        }).then((response) => {
            _this.setState({
                addReal: false
            });
            this.changeQueryParams({
                _k:new Date().getTime()
            })
        })
    }

    //弹出选择关联实体
    addRealtion() {
        this.setState({
            addReal: true
        })
    }

    //关闭选择实体
    cancelChoosen() {
        this.setState({
            addReal: false
        })
    }

    render(){
        let _this = this;
        return (
            <div style={{display:'inline-block'}}  className="text-left">
                <VpButton onClick={_this.addRealtion} icon="team" type="primary" shape="circle" className="m-l-xs"></VpButton>
                <VpModal
                    title='关联实体'
                    visible={this.state.addReal}
                    width={'70%'}
                    footer={null}
                    wrapClassName='modal-no-footer'
                    onCancel={() => _this.cancelChoosen()}
                >
                    {
                        this.state.addReal ?
                            <Choosen
                                item={{ irelationentityid: this.props.entityid}}
                                params={{}}
                                onCancel={() => _this.cancelChoosen()}
                                onOk={(selectItem) => _this.submitChoosen(selectItem)}
                            />
                            : ''
                    }
                </VpModal>
            </div>
        )
    }
}



function mapStateToProps(state,ownProps){
    return {
    }
}


function mapToDispatchToProps(dispatch,ownProps){
    return {
        changeQueryParams:function(queryParams){
            dispatch(changeQueryParams(ownProps._contextid,queryParams));
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
export default createClass(RelEntityButton);