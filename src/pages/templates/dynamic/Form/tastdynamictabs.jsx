import React, { Component } from 'react';
import {
    vpQuery,
    VpTabs,
    VpTabPane,
    VpIframe,
    vpAdd
} from 'vpreact';
import { requireFile } from 'utils/utils';
import  {NotFind}  from 'vplat';
export default class tastdynamictabs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabs_array: [],
            eventmap: {},
            subItemProjectId: '',
            entityid: '',
            viewtype: '',
            iid: '',
            entitytype: false //实体类型是否为流程
        }
    }
    componentWillReceiveProps(nextProps) {

    }
    componentDidMount() {
        let { param } = this.props
        this.setState({
            entityid: param.entityid,
            iid: param.iid,
            type: param.type,//是否为新增
            viewtype: param.viewtype,
            entitytype: param.entitytype,
            defaultActiveKey: param.defaultActiveKey,
        }, () => {
            this.getDynamicTabs();
            this.formevent();
            this.getProjectBySub();
        })
    }

    getProjectBySub = () => {
        //wbs才去查
        if (this.state.iid != '' && this.state.entityid === 10) {
            vpQuery('/{vpmprovider}/project/getProjectBySub', {
                subiid: this.state.iid,
            }).then((response) => {
                this.setState({
                    subItemProjectId: response.data.iprojectid
                })
            })
        }
    }

    //tabs页签
    getDynamicTabs = () => {
        if (!this.state.type) {
            if (this.state.entityid == 11||this.state.entityid == 132||this.state.entityid == 10) {
                this.setState({
                    tabs_array: [{
                        iaccesslevel: "1",
                        ientityid: this.state.entityid,
                        iid: this.state.iid,
                        ilinktype: "0",
                        skey: "entity"+this.state.entityid+"_attrtab",
                        sname: "属性",
                        ssequencekey: "015007003",
                        staburl: "vfm/DynamicForm/dynamic"
                    }],
                    defaultActiveKey: "entity"+this.state.entityid+"_attrtab"
                })
            } else {
                vpAdd('/{vpplat}/vfrm/entity/dynamicTabs', {
                    entityid: this.state.entityid,
                    iid: this.state.iid
                }).then((response) => {
                    const tabs = response.data.tabs;
                    let activeKey = this.state.defaultActiveKey;
                    if (activeKey == '' || activeKey == undefined) {
                        activeKey = tabs[0].skey + 'tab'
                    }
                    this.setState({
                        tabs_array: tabs,
                        defaultActiveKey: activeKey
                    })
                })
            }
        } else {
            this.setState({
                tabs_array: [{
                    iaccesslevel: "1",
                    ientityid: this.state.entityid,
                    iid: "",
                    ilinktype: "0",
                    skey: "entity" + this.state.entityid + "_attr",
                    sname: "属性",
                    ssequencekey: "",
                    staburl: "templates/DynamicForm/DynamicForm"
                }],
                defaultActiveKey: "entity" + this.state.entityid + "_attrtab"
            })
        }

    }

    //查询表单onsave，onload方法
    formevent = () => {
        vpQuery('/{vpplat}/vfrm/entity/getformevent', {
            entityid: this.state.entityid,
            iid: this.state.iid,
            viewtype: ''
        }).then((response) => {
            this.setState({
                eventmap: response.data
            })
        })
    }

    render() {
        let params = {
            iid: this.state.iid
        }
        if (this.props.data != undefined) {
            params.data = this.props.data
        }
        if (this.state.tabs_array.length > 0) {
            return (
                <VpTabs defaultActiveKey={this.state.defaultActiveKey} destroyInactiveTabPane>
                    {
                        this.state.tabs_array.map((item, idx) => {
                            if (item.staburl) {
                                if (item.ilinktype == '1') {
                                    return <VpTabPane tab={item.sname} key={item.skey + 'tab'} >
                                        <VpIframe url={item.staburl + "?entityid=" + this.state.entityid + "&iid=" + this.state.iid} />
                                    </VpTabPane>
                                } else {
                                    let tabUrl = item.staburl.split('?')
                                    let staburl = tabUrl[0]
                                    let stabparam = ''
                                    if (tabUrl.length > 1) {
                                        stabparam = tabUrl[1]
                                    }
                                    if (this.props.param.type && this.props.param.formType == 'tabs') { //tabs下并且是新建的时候 关系码从父页面传过来
                                        stabparam = this.props.param.stabparam
                                    }
                                    let skey = item.skey;
                                    let Tabs = requireFile(staburl)||NotFind
                                    return <VpTabPane tab={item.sname} key={item.skey == undefined ? idx : item.skey + 'tab'} >
                                        <Tabs
                                            setBreadCrumb = {(sname)=>this.props.setBreadCrumb(sname)}
                                            entitytype={this.state.entitytype} //实体发起类型
                                            eventmap={this.state.eventmap} //表单onsave，onload方法
                                            add={this.props.param.type}
                                            params={params}
                                            closeRightModal={() => this.props.closeRightModal()}
                                            refreshList={() => this.props.refreshList()}
                                            entityid={this.state.entityid}
                                            iid={this.state.iid}
                                            irelationid={item.iid}
                                            imainentity={item.imainentity}
                                            irelationentity={item.irelationentity}
                                            row_entityid={this.state.entityid}
                                            skey={item.skey}
                                            row_id={this.state.iid}
                                            viewtype={this.state.viewtype}
                                            iaccesslevel={item.iaccesslevel} //(0:读 1:写)
                                            entityrole={item.iaccesslevel == '1' ? true : false}
                                            stabparam={stabparam}
                                            formType={this.props.param.formType}
                                            fromentity={this.props.param.fromentity}
                                            //关联实体参数
                                            mainentity={this.props.param.mainentity}
                                            mainentityiid={this.props.param.mainentityiid}
                                            //文档参数
                                            doctype="3"
                                            irelentityid={this.state.entityid}
                                            irelobjectid={this.state.iid}
                                            mainentityid="7"
                                            mainiid={this.state.subItemProjectId}
                                            extradata={this.props.param.extradata}
                                        //
                                        />
                                    </VpTabPane>
                                }
                            }
                        })
                    }
                </VpTabs>
            )
        } else {
            return null

        }
    }
}


