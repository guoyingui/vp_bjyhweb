import React from 'react';
import { VpTabs, VpAlertMsg, vpQuery, VpTimeline, VpRow, VpCol } from 'vpreact';
import './style.less'
import FlowForm from "../../../templates/dynamic/Flow/FlowForm";
import { godModeStaticData, polluteFormData } from './godModeStaticData';
import { requireFile } from 'utils/utils'
import { vpAdd } from 'vpreact/public/Vp';
import loading from '../../images/loading.gif';
export default class FlowInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history_array: [],
            record: {},
            _k: +new Date()
        }
    }
    componentWillMount() {
        this.loadHistory()
    }

    loadHistory = () => {
        vpQuery('/{bjyh}/customFlowConf/history', {
            piId: this.props.piid
        }).then((response) => {
            const history_array = response.data
            this.setState({ history_array: response.data })
            this.forceUpdate()
            this.onClick(history_array[0], 0)
        })
    }

    onClick = (record, index) => {
        let { history_array } = this.state
        history_array[index].onClick = true
        this.setState({
            staskid: '',
            history_array,
            onClickIndex: index
        })
        let _this = this
        const taskId = record.task_id_
        const { stepkey } = this.state
        const { iflowentityid, ientityid, iobjectid, piid } = this.props
        const { godModeGroupInfo } = godModeStaticData
        const { fields } = godModeGroupInfo

        if (record.type_ === '发起') {
            fields.map(field => {
                switch (field.field_name) {
                    case 'godMode_handler':
                        field.widget.default_label = record.sname
                        field.widget.default_value = record.user_id_
                        break;
                    case 'godMode_startTime':
                        field.widget.default_value = record.start_time_
                        field.iconstraint = 2
                        field.readonly = true
                        field.disabled = true
                        break;
                    case 'godMode_endTime':
                        field.widget.default_value = record.start_time_
                        field.iconstraint = 0
                        field.readonly = false
                        field.disabled = false
                        break;
                }
            })
            setTimeout(() => {
                this.setState({
                    staskid: taskId,
                    formData: {
                        form: {
                            groups: [godModeGroupInfo]
                        },
                    },
                    formurl: '',
                    ientityid,
                    iobjectid,
                    piid,
                    record,
                });
                return
            }, 5);
        } else if (record.type_ === '流程结束') {
            fields.map(field => {
                switch (field.field_name) {
                    case 'godMode_handler':
                        field.widget.default_label = record.sname
                        field.widget.default_value = record.user_id_
                        break;
                    case 'godMode_startTime':
                        field.widget.default_value = record.end_time_
                        field.iconstraint = 2
                        field.readonly = true
                        field.disabled = true
                        break;
                    case 'godMode_endTime':
                        field.widget.default_value = record.end_time_
                        field.iconstraint = 0
                        field.readonly = false
                        field.disabled = false
                        break;
                }
            })
            setTimeout(() => {
                this.setState({
                    staskid: taskId,
                    formData: {
                        form: {
                            groups: [godModeGroupInfo]
                        },
                    },
                    formurl: '',
                    ientityid,
                    iobjectid,
                    piid,
                    record,
                });
                return
            }, 5);
        } else {
            fields.map(field => {
                switch (field.field_name) {
                    case 'godMode_handler':
                        field.widget.default_label = record.sname
                        field.widget.default_value = record.user_id_
                        break;
                    case 'godMode_startTime':
                        field.widget.default_value = record.start_time_
                        field.iconstraint = 0
                        field.readonly = false
                        field.disabled = false
                        break;
                    case 'godMode_endTime':
                        field.widget.default_value = record.end_time_
                        field.iconstraint = 0
                        field.readonly = false
                        field.disabled = false
                        break;
                }
            })
        }

        vpQuery('/{vpflow}/rest/flowentity/getform', {
            entityid: iflowentityid,
            iobjectentityid: ientityid,
            iobjectid: iobjectid,
            piid: piid,
            staskid: taskId,
            stepkey: stepkey,
            isHistory: true,
        }).then((response) => {
            let formurl = response.data.formurl; //表单url
            let data = response.data
            data.form.groups.unshift(godModeGroupInfo)
            //字段配置
            const fileFieldNames = polluteFormData(data.form)
            _this.setState({
                staskid: taskId,
                formData: data,
                formurl,
                ientityid,
                iobjectid,
                piid,
                record,
                fileFieldNames,
            });
        })
    }

    getFormDom = () => {
        let formurl = this.state.formurl
        let FormModal = FlowForm;
        if (formurl != '' && formurl != undefined) {
            FormModal = requireFile(formurl) || FlowForm
        }
        return (
            <FormModal
                onSetStateFromData={this.onSetStateFromData}
                formData={this.state.formData}
                className="p-sm full-height scroll p-b-xxlg"
                buttons={this.createButtons()}
                tablePagination={false}
                _k={this.state._k}
                //closeRight={this.handleStepCancel} 
                isHistory={true}
                entityid={this.props.iflowentityid}
                iobjectentityid={this.props.ientityid}
                iobjectid={this.props.iobjectid}
                piid={this.props.piid}
                staskid={this.state.staskid}
                stepkey={this.state.stepkey}
                godMode={true}
                onGodSaveSuccess={this.onGodSaveSuccess}
            />
        );
    }

    onSetStateFromData = (data, handlers, ref) => {
        this.setState(() => ({ initData: ref.props.form.getFieldsValue() }))
    }

    createButtons = () => {
        const buttons = [{
            name: "save",
            text: "保存",
            validate: false,
            className: "m-r-xs vp-btn-br",
            type: "primary",
            size: "default"
        }]
        return buttons
    }

    /**
     * @description: 表单保存成功后，单独修改保存步骤信息
     * @todo 是否会影响集成表单原有 onSaveSuccess 方法
     * @param {formData} 
     */
    onGodSaveSuccess = (responseData, btName, formData, ref) => {
        const formParm = JSON.parse(formData.sparam);
        //计算初始表单数据和提交表单数据的差集
        const { initData } = this.state
        const diffParam = {}
        for (const [key, value] of Object.entries(formParm)) {
            if (key === 'scondition' || key === 'sdescription') {
                continue;
            }
            (value !== initData[key] || key.startsWith('godMode')) && [diffParam[key] = value]
        }
        //获取附件信息放入diffParam
        let fieldNodeArr = []
        if (this.state.fileFieldNames) {
            this.state.fileFieldNames.map(field_name => {
                ref[field_name + 'Ref'] && ref[field_name + 'Ref'].state.childNodes.map(node => {
                    let obj = {
                        fileid: node.fileid,
                        createtime: node.createtime,
                    }
                    fieldNodeArr = fieldNodeArr.concat(obj)
                })
            })
        }
        diffParam.godMode_fileInfoArray = fieldNodeArr
        formData.sparam = JSON.stringify(diffParam);
        formData.hisData = JSON.stringify(initData);
        const { history_array, record } = this.state
        formData.record = JSON.stringify(record);

        vpAdd('/{bjyh}/God/updateStepInfo', formData).then(res => {
            //this.loadHistory()
            if (res.data.success) {
                VpAlertMsg({
                    message: "消息提示",
                    description: "修改完成",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)

                if (record.type_ === '发起') {
                    history_array[this.state.onClickIndex].start_time_ = diffParam.godMode_endTime
                    history_array[this.state.onClickIndex].end_time_ = diffParam.godMode_endTime
                } else if (record.type_ === '流程结束') {
                    history_array[this.state.onClickIndex].start_time_ = diffParam.godMode_endTime
                    history_array[this.state.onClickIndex].end_time_ = diffParam.godMode_endTime
                } else {
                    history_array[this.state.onClickIndex].start_time_ = diffParam.godMode_startTime
                    history_array[this.state.onClickIndex].end_time_ = diffParam.godMode_endTime
                }
                this.setState(history_array, () => {
                    this.onClick(record, this.state.onClickIndex)
                })
            }
        }).catch(
            (e) => {
                this.setState(
                    () => ({ _k: +new Date() })
                )
            }
        )
    }

    /**
     * @description: 特殊步骤（发起）保存时使用的保存方法
     * @param {formData :: Object}  表单数据
     * @param {point :: Object}  FlowForm指针
     */
    otherSave = (formData, point) => {
        const data = {
            sparam: JSON.stringify(formData),
            piid: this.state.piid,
            staskid: this.state.staskid,
            taskType: 'startEvent',
        }
        this.onSaveSuccess(null, null, data, point)
        point.setFormSubmiting(false);
    }

    render() {
        const { history_array } = this.state
        return (
            <div className={'ant-tabs ant-tabs-left ant-tabs-vertical ant-tabs-line godMode'}>
                <VpRow type="flex" justify="start">
                    <VpCol span={4}>
                        {history_array.length &&
                            <VpTimeline>
                                {
                                    history_array.map((item, index) => {
                                        return (
                                            <VpTimeline.Item color={'green'}>
                                                <div className={`stepUL ${item.onClick ? 'click_this' : ''}`} onClick={() => this.onClick(item, index)} ><p>{item.taskname}</p></div>
                                            </VpTimeline.Item>
                                        )
                                    })
                                }
                            </VpTimeline>
                        }
                    </VpCol>
                    <VpCol span={20}>
                        {this.state.staskid ? this.getFormDom() : <div className='img_box'><img src={loading} /></div>}
                    </VpCol>
                </VpRow>
            </div>

        );
    }
}
