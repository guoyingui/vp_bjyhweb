import React, { Component } from 'react';
import EntityList from '../../templates/dynamic/List/index';
import {VpFormCreate } from 'vpreact'

/**
 *
 */
class entitylist extends Component {
    constructor(props) {
        super(props)
        console.log('customEntityList',this);
        
    }
    render() {
        let defaultFilter = {};
        if(this.props.location.state && this.props.location.state.param){
            let urlparam = this.props.location.state.param
            defaultFilter = {
                filtervalue : urlparam.filter,
                currentkey : urlparam.currentkey
            }
        }
        return (
            <EntityList
                entityid = {this.props.params.entityid}//实体id
                type={this.props.params.type}//视图类型
                {...defaultFilter}
                {...this.props}
            />
        )
    }
}

export default entitylist = VpFormCreate(entitylist);