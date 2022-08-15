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

//业务负责人/开发负责人上线处理02
class CoustomFlowForm06 extends FlowForm.Component {
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
        return new Promise(resolve=>{
            //根据流程实例id获取流程历史某个步骤的处理人。
            vpQuery('/{bjyh}/ldxfRest/getHistoryStepUser',{
                piid:this.props.piid,
                stepcode:'05'
            }).then(res=>{
                if(res.status==200){
                    //将不为空的步骤处理人设置为查询出来的处理人，如果已有默认值，则不处理。因为这步只有一条分支，所以flag为空。就不做判断。
                    data.handlers.map(item=>{
                        if(item.ids==null||item.ids==''){
                            item.ids=res.data.ids;
                            item.names=res.data.names;
                        }
                    })
                }
                resolve(data)
            })
        })
    }
}
CoustomFlowForm06 = FlowForm.createClass(CoustomFlowForm06);
export default CoustomFlowForm06;