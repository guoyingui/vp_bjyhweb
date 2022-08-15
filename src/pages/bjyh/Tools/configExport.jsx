import React, { Component } from 'react'
import { vpAdd, vpDownLoad, VpButton, VpCheckbox, VpRadioGroup, VpRadio, VpRow, VpCol, VpFormCreate, VpAlertMsg } from 'vpreact'
class ConfigExport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedValues: ['baseconfig', 'dictionary', 'role', 'quota', 'entity', 'schedu' ],
            disabled: true,
            expvalues: '1',
        }
    }

    componentWillMount() {
        this.getConfig()
    }

    componentDidMount() {
        $('.configExport').find(".ant-table-body").height($(document).height() - 230)
    }
    getConfig = () => {
        const _this = this
        vpAdd('/{vpplat}/vfm/studioExport/getConfig', {}
        ).then(function (res) {
            let disabled = true
            if (res.data.accesslevel > 0) {
                disabled = false
            }
            _this.setState({
                disabled: disabled
            })
        }).catch(function (err) {

        });
    }
    wkExport = () => {
        if (this.state.checkedValues.length > 0 && this.state.expvalues != '') {
            vpDownLoad('/{vpplat}/exportinit/exp',
                { 
                    checkedValues: this.state.checkedValues.join(),
                    checkModel: this.state.expvalues
                 }
            )
            /*
                vpDownLoad('/{vpplat}/vfm/studioExport/exportfile',
                    { exportType: 'workspace', checkedValues: this.state.checkedValues.join() }
                )
            */
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: '请至少选择一个模块和一个导出模式',
                type: "info",
                closeText: "关闭",
                showIcon: true
            }, 5)
        }
    }
    onChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
        let chkidx1 = checkedValues.findIndex((objval) => objval === 'function')
        let chkidx2 = checkedValues.findIndex((objval) => objval === 'navigation')
        let chkidx3 = checkedValues.findIndex((objval) => objval === 'access')
        let newValues = []
        if (chkidx1 != -1) {
            let oldValues = this.state.checkedValues
            let idx1 = oldValues.findIndex((objval) => objval === 'function')
            let idx2 = oldValues.findIndex((objval) => objval === 'navigation')
            let idx3 = oldValues.findIndex((objval) => objval === 'access')
            if (idx1 != -1 && ((chkidx2 == -1 && idx2 != -1) || (chkidx3 == -1 && idx3 != -1))) { //取消导航或权限时联动取消功能
                checkedValues.map((item) => {
                    if (item != 'function') {
                        newValues.push(item)
                    }
                })
            } else if (idx1 == -1) { //选中功能时联动选中导航和权限
                checkedValues.map((item) => {
                    newValues.push(item)
                })
                if (chkidx2 == -1) {
                    newValues.push('navigation')
                }
                if (chkidx3 == -1) {
                    newValues.push('access')
                }
            } else {
                newValues = checkedValues
            }
        } else {
            newValues = checkedValues;
        }
        console.log('newValues = ', newValues);
        this.setState({
            checkedValues: newValues
        })
    }
    onexpChange = (e) => {
        //this.setState({
        //    expvalues: checkedValues
        //})
        console.log('radio checked', e.target.value);
        this.setState({
            expvalues: e.target.value,
        });
    }
    render() {
        const optionsWithDisabled = [
            { label: '基础配置', value: 'baseconfig', disabled: false },
            { label: '数据字典', value: 'dictionary', disabled: false },
            { label: '实体', value: 'entity', disabled: false },
            { label: '授权', value: 'role', disabled: false },
            { label: '考核指标', value: 'quota', disabled: false },
            { label: '定时任务', value: 'schedu', disabled: false },
            //{ label: '功能', value: 'function', disabled: false },
            //{ label: '导航', value: 'navigation', disabled: false },
            //{ label: '权限', value: 'access', disabled: false },
            //{ label: '数据字典', value: 'dictionary', disabled: false },
            { label: '部门&工作空间', value: 'dept', disabled: false },
            { label: '用户', value: 'user', disabled: false }
        ];
        const expoption = [
            { label: '全量', value: '1', disabled: false },
            { label: '增量', value: '2', disabled: false }
        ];
     
        return (
            <div className="business-container pr full-height" >
                <div className="bg-white" >
                    <VpRow gutter={1} >
                        <VpCol span={3} className="text-right p-lr-sm"><h4 className="ant-form-item-required">导出说明：</h4></VpCol>
                        <VpCol span={20} className="text-left p-lr-sm"><h4>基础配置包括功能权限，导航配置，系统定义，成本定义，指示器，工序定义</h4></VpCol>
                    </VpRow>
		    <VpRow gutter={1} >
                        <VpCol span={3} className="text-right p-lr-sm"><h4 > </h4></VpCol>
                        <VpCol span={20} className="text-left p-lr-sm"><h4>授权包括角色组，角色</h4></VpCol>
                    </VpRow>
		    <VpRow gutter={1} >
                        <VpCol span={3} className="text-right p-lr-sm"><h4 > </h4></VpCol>
                        <VpCol span={20} className="text-left p-lr-sm"><h4>考核指标包括指标库，考核定义</h4></VpCol>
                    </VpRow>
		    <VpRow gutter={1} >
                        <VpCol span={3} className="text-right p-lr-sm"><h4 > </h4></VpCol>
                        <VpCol span={20} className="text-left p-lr-sm"><h4>定时任务包括定时任务，定时计划</h4></VpCol>
                    </VpRow>
                    <br />
                    <VpRow gutter={1} >
                        <VpCol span={3} className="text-right p-lr-sm"><h4 className="ant-form-item-required">可选模块：</h4></VpCol>
                        <VpCol className="gutter-row text-left" span={20}>
                            <VpCheckbox options={optionsWithDisabled} disabled value={this.state.checkedValues} onChange={this.onChange} />
                        </VpCol>
                    </VpRow>
                    <br />
                    <VpRow gutter={1} >
                        <VpCol span={3} className="text-right p-lr-sm"><h4 className="ant-form-item-required">导出模式：</h4></VpCol>
                        <VpCol className="gutter-row text-left" span={20}>
                           
                            <VpRadioGroup onChange={this.onexpChange} value={this.state.expvalues==''?'2':this.state.expvalues}>                                
                                <VpRadio key="1" value={'1'}>全量</VpRadio>
                                <VpRadio key="2" value={'2'}>增量</VpRadio>
                            </VpRadioGroup>
                        </VpCol>
                    </VpRow>
                </div>
                <div className="footFixed p-sm b-t text-center" style={{ marginBottom: 10 }}>
                    {
                        this.state.disabled
                            ? <VpButton className="vp-btn-br" type="primary" onClick={() => this.wkExport()} >导出数据</VpButton>
                            : <VpButton className="vp-btn-br" type="primary" onClick={() => this.wkExport()} >导出数据</VpButton>
                    }
                </div>
            </div >
        );
    }
}

export default ConfigExport = VpFormCreate(ConfigExport);