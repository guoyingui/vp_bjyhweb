
import React from 'react';
import {
    VpCol,
    VpFormCreate, VpInput, VpModal, VpRadioGroup,
    VpTable, VpRow, VpSelect, VpOption, VpButton, VpIcon
} from 'vpreact';
import './style.less';
import { SeachInput, FindCheckbox, VpDynamicForm } from 'vpbusiness';
import { vpQuery, vpRemove, vpAdd } from 'vpreact';
import Choosen from "../../templates/dynamic/Form/ChooseEntity";

class updateProjectDate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            projectcodes1: '',
            projectcodes2: ''
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    handlesearch1 = (e) => {
        const searchVal = $.trim(e.target.value);
        this.setState({
            projectcodes1: searchVal
        })
    }

    handlesearch2 = (e) => {
        const searchVal = $.trim(e.target.value);
        this.setState({
            projectcodes2: searchVal
        })
    }

    updateDate1 = () => {
        let _this = this
        let projectcodes1 = this.state.projectcodes1;
        console.log('projectcodes1', projectcodes1);
        vpQuery('/{bjyh}/updateProjectDate/updateQuxiaoDate', {
            projectcodes1: projectcodes1
        }).then((res) => {
            console.log(res)
        });
    }

    updateDate2 = () => {
        let _this = this
        let projectcodes2 = this.state.projectcodes2;
        console.log('projectcodes2', projectcodes2);
        vpQuery('/{bjyh}/updateProjectDate/updateJiexiangDate', {
            projectcodes2: projectcodes2
        }).then((res) => {
            console.log(res)
        });
    }

    render() {
        return (
            <div className="sysdefine-container full-height">
                {
                    <div className="p-b-sm m-b-sm b-b bg-white">
                        <VpRow gutter={1}>
                            <VpCol span={30} className="text-left p-lr-sm"><h4 className="ant-form-item-required">取消时间--项目编号：</h4></VpCol>
                            <VpInput type='textarea' rows={4} maxLength={4000} span={3}
                                value={this.state.projectcodes1 || ''}
                                onChange={this.handlesearch1}>
                            </VpInput>
                            <VpButton type="primary" shape="circle" className="vp-btn-br-lg" onClick={this.updateDate1} span={20}>
                                <VpIcon type="edit" />
                            </VpButton>
                        </VpRow>
                    </div>
                }

                {
                    <div className="p-b-sm m-b-sm b-b bg-white">
                        <VpRow gutter={1}>
                            <VpCol span={30} className="text-left p-lr-sm"><h4 className="ant-form-item-required">结项时间--项目编号：</h4></VpCol>
                            <VpInput type='textarea' rows={4} maxLength={4000} span={3}
                                value={this.state.projectcodes2 || ''}
                                onChange={this.handlesearch2}>
                            </VpInput>
                            <VpButton type="primary" shape="circle" className="vp-btn-br-lg" onClick={this.updateDate2} span={20}>
                                <VpIcon type="edit" />
                            </VpButton>
                        </VpRow>
                    </div>
                }
            </div>
        );
    }
}
export default updateProjectDate = VpFormCreate(updateProjectDate);