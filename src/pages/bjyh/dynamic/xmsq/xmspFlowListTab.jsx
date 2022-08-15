import React, { Component } from "react";
import FlowListTab from '../../../templates/dynamic/Flow/FlowListTab';

import {
    vpQuery, vpAdd, VpAlertMsg
} from 'vpreact';


import { common, validationRequireField, singleInputFill,initHiddenColumn,xmsqHiddenColumn,initHiddenColumn_history } from '../code';

/**
 * 项目申请流程List
 */
class xmspFlowListTab extends FlowListTab.Component {
    constructor(props) {
        super(props);
        console.log('xmspFlowListTab',this);
    }

    onStopFlowSuccess(record){
        console.log(record);
        vpAdd('/{bjyh}/xmsq/resetFlagField', {
            entityid:record.entityid,
            iid:record.iid,
        }).then(data => {

        })
    }

}

export default xmspFlowListTab;