import React, {Component} from "react";
import DynamicForm from "../../../templates/dynamic/DynamicForm/DynamicForm";
import {parseValidator} from "../../../templates/dynamic/Form/Widgets";

import { vpAdd } from "vpreact/public/Vp";



class CustomDynamicForm extends DynamicForm.Component{
    constructor(props){
        super(props);
        console.log('onSaveSuccess - ',this.props);
    }


    /**
     *  表单属性定制
     */
    onDataLoadSuccess = formData => {

    }



}

CustomDynamicForm = DynamicForm.createClass(CustomDynamicForm);
export default CustomDynamicForm;