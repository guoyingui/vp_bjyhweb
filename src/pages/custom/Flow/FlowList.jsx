import React, { Component } from 'react';

import FlowList from '../../templates/dynamic/FlowList/workflow';

class CustomFlowList extends  Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <FlowList {...this.props}/>
        );
    }
}

export default  CustomFlowList;