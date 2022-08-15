import React, { Component } from "react";
import { vpQuery, VpFormCreate } from 'vpreact';
import EntityList from '../../../templates/dynamic/List/index';
/**
 * 阶段设计评审流程
 */
class XmfxTabEntityList extends EntityList.Component{

}
XmfxTabEntityList = EntityList.createClass(XmfxTabEntityList);

class xmfxTabList extends Component {
  constructor(props) {
      super(props)
      console.log('customEntityList',this);
      
  }
  render() {
      return (
          <XmfxTabEntityList
              entityid = {this.props.params.entityid}//实体id
              {...this.props}
          />
      )
  }
}

export default xmfxTabList = VpFormCreate(xmfxTabList);