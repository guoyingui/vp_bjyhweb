import React, { Component } from "react";
import DynamicForm from '../../../templates/dynamic/DynamicForm/DynamicForm';

/**
 * 此页面为每个实体属性公共页面
 */
class baseDynamicForm extends DynamicForm.Component {
    constructor(props) {
        super(props);
    }

}

baseDynamicForm = DynamicForm.createClass(baseDynamicForm);

export default baseDynamicForm;