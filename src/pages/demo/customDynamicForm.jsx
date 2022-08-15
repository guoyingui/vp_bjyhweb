import React, {Component} from "react";
import {VpFormCreate} from 'vpreact';
import {requireFile} from "utils/utils";
//import CustomDynamicForm from './dynamic/customDynamicForm';
const CustomDynamicForm = requireFile('demo/customDynamicForm')


class CustomForm extends Component {
    constructor(props) {
        super(props);
        this.state ={
        }
    }

    render() {
        let params = this.props.params||{};

        return (
            <CustomDynamicForm
                entityid={params.entityid||"16"}
                iid={params.iid}
                entityrole={true}
                form={this.props.form}
            />
        )
    }
}

export default VpFormCreate(CustomForm);
