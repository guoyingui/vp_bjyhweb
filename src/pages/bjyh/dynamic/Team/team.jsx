import React, { Component } from 'react';
import {
    VpRow,
    VpCol,
    VpIcon,
    VpTable,
    VpTooltip,
    VpModal,
    VpButton,
    VpFormCreate,
    vpAdd,
    VpIconFont,
    VpAlertMsg,
    vpQuery,
    VpForm
} from 'vpreact';
import './index.less';
import Choosen from '../../../templates/dynamic/Form/ChooseEntity';
import VpChooseModal from '../../../templates/dynamic/Form/VpChooseModal';

class team extends Component {
    constructor(props) {
        super(props)
        this.state = {
            maxHeight: $(window).height() - 290,
            roleHeader: [],
            roleData: [],
            roleGroup: [],
            roleiid: '',
            iprincipal: '',
            visible: false,
            cur_page: '1',
            num_perpage: '10',
            total_rows: '',
            selectedRowKeys: '',
            initValue: [],
            iroletype: '0',
            tableHeight: '',
            allcount: 0,
            editModelVisible: false
        }
        this.groupClick = this.groupClick.bind(this);
        this.queryRoleHeader = this.queryRoleHeader.bind(this);
        this.queryRoleGroup = this.queryRoleGroup.bind(this);
        this.addRel = this.addRel.bind(this);
        this.delRel = this.delRel.bind(this);
        this.okModal = this.okModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.tableChange = this.tableChange.bind(this);
    }
    componentWillMount() {
        let entityid = this.props.viewtype == 'pjtree' ? this.props.row_entityid : this.props.entityid
        let iid = this.props.viewtype == 'pjtree' ? this.props.row_id : this.props.iid
        this.setState({
            entityid, iid
        }, () => {
            this.queryRoleHeader()
            this.queryRoleGroup()
        })

    }

    onShowSizeChange(value) {
        console.log(value)
    }

    //查询角色组列头以及数据
    queryRoleHeader() {
        let param = {
            ientityid: this.state.entityid,
            iid: this.state.iid,
            roleid: this.state.roleiid,
            curr: this.state.cur_page,
            limit: this.state.num_perpage
        }
        vpAdd('/{bjyh}/projectTeam/page', {
            sparam: JSON.stringify(param)
        }).then((response) => {
            let _header = []
            let data = response.data
            let headers = data.headers
            const loginUserid = vp.cookie.getTkInfo('userid')
            headers.map((item, index) => {
                let obj = {}
                obj.title = item.title
                obj.dataIndex = item.field
                _header.push(obj)
            })
            let showTotal = () => {
                return '共' + data.totalrows + '条'
            }
            
            this.setState({
                selectedRowKeys: [],
                roleHeader: _header,
                roleData: data.data,
                cur_page: data.currentpage,
                total_rows: data.totalRows,
                num_perpage: data.numperpage,
                pagination: {
                    total: data.totalrows,
                    showTotal: showTotal,
                    pageSize: data.numperpage,
                    onShowSizeChange: this.onShowSizeChange,
                    showSizeChanger: true,
                    showQuickJumper: true,
                },
                tableHeight: vp.computedHeight(data.totalrows,".teamTable")-70
            })
        })

    }

    // 表格的变动事件
    tableChange(pagination, filters, sorter) {
        this.setState({
            cur_page: pagination.current || this.state.cur_page,
            num_perpage: pagination.pageSize || this.state.num_perpage,
        }, () => {
            this.queryRoleHeader()
        })
    }

    //查询角色组
    queryRoleGroup() {
        let param = { ientityid: this.state.entityid, iid: this.props.iid }
        vpAdd('/{vpplat}/cfgrole/getbyentity', {
            sparam: JSON.stringify(param)
        }).then((response) => {
            let groups = response.data.data
            this.setState({
                roleGroup: groups,
                allcount: response.data.allcounts
            })
        })

    }

    //角色组点击切换事件
    groupClick(e, roleiid, iprincipal, iroletype) {
        $('.rolegroup>ul>li>a').removeClass('active')
        $('#role' + roleiid).addClass('active')
        this.setState({
            roleiid: roleiid == '-1' ? '' : roleiid,
            iprincipal: iprincipal,
            iroletype: iroletype
        }, () => this.queryRoleHeader())
    }

    addRel(e) {
        this.setState({
            visible: true,
            initValue: []
        })
    }

    delRel(e) {
        const _this = this
        let param = {
            ids: _this.state.selectedRowKeys.toString(),
            roleid: this.state.roleiid,
            enid: this.state.entityid,
            eniid: this.state.iid,
        }
        vpAdd('/{vpplat}/objteam/delete', {
            sparam: JSON.stringify(param)
        }).then((response) => {
            this.setState({
                visible: false
            }, () => {
                _this.queryRoleHeader()
                _this.queryRoleGroup()
            })
        })
    }

    okModal(selectItem) {
        const _this = this
        let ids = ''
        selectItem.map((item, index) => {
            if (index == 0) {
                ids += item.iid
            } else {
                ids += ',' + item.iid
            }
        })
        let param = {
            userIds: ids,
            roleid: this.state.roleiid,
            enid: this.state.entityid,
            eniid: this.state.iid,
        }
        vpAdd('/{vpplat}/objteam/save', {
            sparam: JSON.stringify(param)
        }).then((response) => {
            this.setState({
                visible: false
            }, () => {
                _this.queryRoleHeader()
                _this.queryRoleGroup()
                _this.synTFS()
            })
        })
    }

    synTFS = () => {
        //同步TFS
        vpQuery('/{bjyh}/tfsrest/tfsxmsq', {
            iid: this.props.iid
        }).then((response) => {
                if (response == '0') {
                    VpAlertMsg({
                        message:"消息提示",
                        description:"TFS项目同步成功。",
                        type:"success",
                        closeText:"关闭",
                        showIcon: true
                    }, 5)
                }else{
                    VpAlertMsg({
                        message: "消息提示",
                        description: "TFS项目同步失败。",
                        type: "error",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                }
                //_this.loadFormData();
        }).catch(function (err) {
            VpAlertMsg({
                message: "消息提示",
                description: "TFS项目同步失败。",
                type: "error",
                onClose: this.onClose,
                closeText: "关闭",
                showIcon: true
            }, 5);
        });
    }

    cancelModal() {
        this.setState({
            visible: false
        })
    }

    /* 增加右侧滑框 */
    onRowClick = (record, index) => {
        this.setState({
            editModelVisible: true,
            record: record
        })
    }

    handleOk = () => {
        let formData = this.props.form.getFieldsValue();
        let values = this.state.selectValue||'';
        let record = this.state.record;
        this.setState({
            editModelVisible: false,
        })

        vpAdd('{bjyh}/projectTeam/saveSjxt',{
            ...record,
            sjxt:values,
            iitemid:this.props.iid
        }).then(res => {
            this.queryRoleHeader();
            this.synTFS();
        })
        
    }

    handleCancel = () => {
        this.setState({
            editModelVisible: false,
        })
    }

    selectmodelChange = (val,names) => {
        this.setState({selectValue:val})        
    }

    renderDom = () => {
        const fileProps = {
            "widget": {
                "load_template": [],
                default_value: this.state.record.sjxtid,
                default_label: this.state.record.sjxt
                },
                "widget_type": "multiselectmodel",
                "ientityid": 398,
                "field_name": "rsjxt",
                "imobileshow": 0,
                "iconstraint": 1,
                "iid": "3",
                "iwidth": 0,
                "showdetail": true,
                "itype": 3,
                "urlparam": "",
                "propertyType": 14,
                "ilength": 22,
                "idictionaryid": 0,
                "field_label": "涉及系统",
                "inorule": 1,
                "irelationentityid": 81,
                "labelCol": { "span": 4 },
                "wrapperCol": { "span": 18 },
                "readOnly": false,
                "label": "涉及系统",
                "modalProps": { "url": "bjyh/templates/Form/ChooseEntity" },
                "id": "rxxx",
                initialName:this.state.record.sjxt||'',
                value:this.state.record.sjxtid||'',
                "onChange":this.selectmodelChange,
                "data-__meta": {
                    "rules": [{"required": false}],
                    "validate": [{
                        "trigger": ["onChange"],
                        "rules": [{"required": false}]
                    }]
                }
        }

        return (
            <VpForm>
                <VpChooseModal {...fileProps} form={this.props.form} />
            </VpForm>
        )
    }

    render() {
        const _this = this
        let entityid = this.state.entityid
        let flag = (entityid == 6 || entityid == 7 || entityid == 8) ? true : false
        let item = {
            irelationentityid: '2'
        }
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                _this.setState({
                    selectedRowKeys: selectedRowKeys
                })
            },
            onSelect(record, selected, selectedRows) {
            },
            onSelectAll(selected, selectedRows, changeRows) {
            },
        };
        return (
            <div className="full-height scroll team">
                <div className="full-height p-sm">
                    <VpRow gutter={8} className="full-height">
                        <VpCol span={4} className="full-height">
                            <div className="full-height bg-white ">
                                <h4 className="p-b-sm fw b-b">角色</h4>
                                <div className="m-tb-sm rolegroup">
                                    <ul className="clearfix f14">
                                        <li data-iid=''
                                            data-iprincipal=''
                                            key='all'
                                            onClick={(e) => this.groupClick(e, '-1', '', '0')}><a id="role-1" className="active">全部（{this.state.allcount}）</a></li>
                                        {
                                            this.state.roleGroup ?
                                                this.state.roleGroup.map((item, index) => {
                                                    return (
                                                        <li key={index} onClick={(e) => this.groupClick(e, item.iid, item.iprincipal, item.iroletype)}>
                                                            <a id={"role" + item.iid}>{item.sname}（{item.count}）</a>
                                                        </li>
                                                    )
                                                })
                                                : null
                                        }
                                    </ul>
                                </div>
                                {
                                    this.props.entityrole ?
                                            <VpButton type="primary" icon="plus" className={this.state.iroletype == '0'||this.state.iroletype == '4' ? 'hide' : 'ant-col-24 vp-btn-br'} onClick={(e) => _this.addRel(e)}>关联成员</VpButton>
                                        : null
                                    }
                                

                            </div>
                        </VpCol>
                        <VpCol span={20} className="full-height">
                            <div className="p-sm bg-white pr full-height set-box-team">
                                <div className="p-b-sm b-b set-title">
                                    {
                                        this.props.entityrole ?
                                            <div className="fr">
                                                {/* <VpTooltip placement="top" title="关联成员">
                                                    <VpIcon style={this.state.iroletype == '0'
                                                        ? { display: 'none' }
                                                        : { display: 'inline-block' }} onClick={(e) => _this.addRel(e)} className="cursor m-lr-xs f18" type="team" />
                                                </VpTooltip> */}
                                                <VpTooltip placement="top" title="删除关联">
                                                    <VpIconFont
                                                        style={this.state.iroletype == '0'
                                                            ? { display: 'none' }
                                                            : { display: 'inline-block' }}
                                                        onClick={(e) => _this.delRel(e)} className="cursor m-lr-xs f18" type="vpicon-shanchu" />
                                                </VpTooltip>
                                            </div>
                                            : ''
                                    }
                                    <span className="fw f14">成员</span>
                                </div>
                                <div>
                                    <VpTable
                                        className="teamTable"
                                        rowSelection={rowSelection}
                                        columns={this.state.roleHeader}
                                        dataSource={this.state.roleData}
                                        pagination={this.state.pagination}
                                        onChange={this.tableChange}
                                        rowKey={record => record.iid}
                                        onRowClick={this.onRowClick}
                                        scroll={{  y: this.state.tableHeight }}
                                    />
                                </div>
                            </div>
                        </VpCol>
                    </VpRow>

                    <VpModal
                        title='选择用户'
                        visible={this.state.visible}
                        width={'70%'}
                        footer={null}
                        wrapClassName='modal-no-footer'
                        onCancel={() => _this.cancelModal()}
                    >
                        {
                            this.state.visible ?
                                <Choosen
                                    item={item}
                                    initValue={_this.state.initValue}
                                    params={{}}
                                    onCancel={() => _this.cancelModal()}
                                    onOk={(selectItem) => _this.okModal(selectItem)}
                                />
                                :
                                null
                        }

                    </VpModal>

                    <VpModal
                        title="涉及系统"
                        visible={this.state.editModelVisible}
                        maskClosable={false}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText="确定" cancelText="取消" style={{height:"300px"}}>
                        {this.state.editModelVisible ? this.renderDom() : null}
                    </VpModal>

                </div>
            </div>
        )
    }
}


export default team = VpFormCreate(team);;
