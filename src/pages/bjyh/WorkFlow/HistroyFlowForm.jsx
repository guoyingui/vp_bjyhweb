import React from 'react';
import FlowForm from '../../templates/dynamic/Flow/FlowForm';
import {vpQuery} from 'vpreact';


/**
 *查看已处理的节点信息
 */
class HistroyFlowForm extends FlowForm.Component{
    /**
     * 自定义表单按钮
     */
    getCustomeButtons(){
        let buttons = [];
        //如果没有自定义按钮，用默认的  
        // buttons.push("cancel");
        return buttons;
    }

}

export default FlowForm.createClass(HistroyFlowForm);