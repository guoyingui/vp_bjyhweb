import React, { Component } from "react";
import { vpQuery, VpFormCreate } from 'vpreact';
import FlowForm from '../../../templates/dynamic/Flow/FlowForm';
import EntityList from '../../../templates/dynamic/List/index';
/**
 * 阶段设计评审流程
 */
class XmfxEntityList extends EntityList.Component{

  getCustomeButtons(){
    return ['add']
  }
}
XmfxEntityList = EntityList.createClass(XmfxEntityList);

class xmfxList extends Component {
  constructor(props) {
      super(props)
  }
  render() {
      return (
          <XmfxEntityList
              entityid = {this.props.params.entityid}//实体id
              {...this.props}
          />
      )
  }
}

export default xmfxList = VpFormCreate(xmfxList);