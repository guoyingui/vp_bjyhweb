import React, { Component } from "react";
import {VpIconFont, VpInput} from "vpreact";

export default class Child extends Component {

    constructor(props){
        super(props)

    }

    componentWillReceiveProps(){

    }

    shouldComponentUpdate(){
        return this.props.message == 'aa';
    }

    render() {
        return (
            <div>
                我是个子组件，
                父组件说： <span>{this.props.message}</span>

                <VpInput onChange={this.props.changeName} />
            </div>
        )
    }
}