/*
 * @Author:zhangfeng.
 * @Date: 2021-11-15 12:46:36
 * @LastEditTime: 2021-11-15 17:02:51
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: 
 */
import React, {
    Component
} from "react";
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {
    singleInputFill,
    validationRequireField
} from '../code';
import { vpQuery,VpConfirm } from "vpreact";
import {findFiledByName} from 'utils/utils';

//运营中心发起漏洞申请01
class CoustomFlowForm01 extends FlowForm.Component {
    constructor(props) {
        super(props);
    }
    onGetFormDataSuccess(data) {
        if(data.handlers){
            data.handlers.map(item=>{
                //设置弹出窗为单选实体
                item.widget_type = 'selectmodel';
            })
        }
    }
}

CoustomFlowForm01 = FlowForm.createClass(CoustomFlowForm01);
export default CoustomFlowForm01;