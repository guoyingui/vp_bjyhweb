import React, { Component } from "react"
import { common, fhzjxmsq, fileValidation} from '../code';
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";

//分行自建项目申请--流程--分行项目负责人修改文档
class fhxmfzrModifyDocForm extends FlowForm.Component {

    constructor(props) {
        super(props)
    }

    /**
     * 保存前拦截
     * @param saveData 要保存的数据
     * @return Promise<any> 如果返回false,则不执行保存，不返回或返回其他值都执行保存
     *
     */
    onBeforeSave = (formData, btnName) => {
        let _this = this
        return fileValidation(_this, btnName, common.lcbm_fhzjxmsq, fhzjxmsq.lcbzbm_fhxmfzrxgsqwd)
    }
}

fhxmfzrModifyDocForm = FlowForm.createClass(fhxmfzrModifyDocForm)
export default fhxmfzrModifyDocForm
