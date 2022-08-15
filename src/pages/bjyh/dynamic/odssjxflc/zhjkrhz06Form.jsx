import React from "react"

import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import {vpAdd} from "vpreact";

//ODS数据下发流程--流程--总行接口人审批
class zhjkrhz06Form extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     */
    onSaveSuccess = (formData, btnName, data) => {
        let _this = this

        if (btnName == 'ok') {

            return new Promise(resolve => {
                vpAdd('/{bjyh}/odssjxflc/insertTrunkTable',{
                    piid: _this.props.piid, szhjkrhzpsyj: JSON.parse(data.sparam)['szhjkrhzpsyj']
                }).then(res=>{
                    // console.log('res', res)
                    resolve(res.data)
                })
            })
        }
    }

}

zhjkrhz06Form = FlowForm.createClass(zhjkrhz06Form)
export default zhjkrhz06Form
