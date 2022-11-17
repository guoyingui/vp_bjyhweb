import React, { Component } from 'react'
import {vpAdd, VpIframe, vpQuery, VpTabPane, VpTabs,VpFormCreate} from "vpreact";
import {NotFind} from "vplat";
import {requireFile} from 'utils/utils';


/**
 * 实体详情
 * @props
 * entityid: 实体id
 * iid: 实体实例id
 * functionid:功能点id
 * defaultActiveKey: 默认显示标签key
 * setBreadCrumb
 * closeRightModal: 关闭弹出框
 */
class EntityDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            tabs_array:null //标签页
        }
    }

    /**
     * 加载标签页
     */
    loadTabs(){  
        console.log('entitydetail ..',this.props);     
        vpAdd('/{vpplat}/vfrm/entity/dynamicTabs', {
            entityid: this.props.entityid
            , iid: this.props.iid,
            functionid:this.props.functionid
        }).then((response) => {
            let tabsarr = response.data.tabs;
            if(this.props.type&&this.props.type=='child'){
                tabsarr = tabsarr.slice(0,1)
            }
            const tabs = tabsarr;
            if((!tabs || !tabs.length)  && (this.props.entityid == 11||this.props.entityid == 132||this.props.entityid == 10)){
                //有几个实体没有配置功能链接，需要单独处理
                this.setState({
                    tabs_array: [{
                        iaccesslevel: "1",
                        ientityid: this.props.entityid,
                        iid: this.props.iid,
                        ilinktype: "0",
                        skey: "entity"+this.props.entityid+"_attrtab",
                        sname: "属性",
                        ssequencekey: "015007003",
                        staburl: "vfm/DynamicForm/dynamic"
                    }],
                    defaultActiveKey: "entity"+this.props.entityid+"_attrtab"
                });
            }else{
                this.setState({
                    tabs_array: tabs
                })
            }
        });
    }
    componentWillMount() {
        //获取实体标签
        this.loadTabs();
    }

    render(){

        if(!this.state.tabs_array || !this.state.tabs_array.length){
            return null;
        }
        let defaultActiveKey = this.state.tabs_array[0].skey + 'tab';
        let tabs_array = this.state.tabs_array;
        return (
            <VpTabs defaultActiveKey={this.props.defaultActiveKey||defaultActiveKey} destroyInactiveTabPane>
                {

                    this.state.tabs_array.map((item, idx) => {
                        if (item.staburl) {
                            if (item.ilinktype == '1') {
                                //不使用路由的
                                return <VpTabPane tab={item.sname} key={item.skey + 'tab'}>
                                    <VpIframe
                                        url={item.staburl + "?entityid=" + this.props.entityid + "&iid=" + this.props.iid}/>
                                </VpTabPane>
                            } else {
                                    //使用react路由
                                let tabUrl = item.staburl.split('?')
                                let staburl = tabUrl[0]
                                let stabparam = ''
                                if (tabUrl.length > 1) {
                                    stabparam = tabUrl[1]
                                }
                                let skey = item.skey;
                                let skeyentity = "entity" + this.props.entityid + "_doclist";
                                if (skey != skeyentity) {
                                    //TODO 测试完后记得删掉
                                    if(staburl == 'vfm/DynamicForm/dynamic'){
                                        staburl = 'templates/DynamicForm/DynamicForm';
                                    }
                                    let Tabs = requireFile(staburl) || NotFind;
                                    Tabs = VpFormCreate(Tabs);
                                    return <VpTabPane
                                            tab={item.sname}
                                            key={item.skey == undefined ? idx : item.skey + 'tab'}
                                        >
                                        <Tabs
                                            setBreadCrumb={(sname) => this.props.setBreadCrumb(sname)}
                                            add={false} //是否添加页面
                                            closeRightModal={this.props.closeRightModal}
                                            entityid={this.props.entityid} //实体定义id
                                            iid={this.props.iid} //实体实例id
                                            irelationid={item.iid} //功能id
                                            imainentity={item.imainentity} //
                                            irelationentity={item.irelationentity}
                                            row_entityid={this.props.entityid} //实体定义id
                                            skey={item.skey} //功能编号/key
                                            row_id={this.props.iid} //实体实例id
                                            viewtype={this.state.viewtype} //视图类型
                                            iaccesslevel={item.iaccesslevel} //(0:读 1:写)
                                            entityrole={item.iaccesslevel == '1' ? true : false}
                                            stabparam={stabparam} //标签页参数
                                            doctype="3"
                                        />
                                    </VpTabPane>
                                } else {
                                    let Tabs = requireFile(staburl)
                                    return <VpTabPane
                                            tab={item.sname}
                                            key={item.skey == undefined ? idx : item.skey + 'tab'}
                                        >
                                        <DocumentList
                                            doctype="3"
                                            iaccesslevel={item.iaccesslevel} //(0:读 1:写)
                                            entityrole={item.iaccesslevel == '1' ? true : false}
                                            irelentityid={this.props.entityid}
                                            irelobjectid={this.props.iid}
                                            mainentityid="7"
                                            mainiid={this.state.subItemProjectId}/>
                                    </VpTabPane>
                                }
                            }
                        }

                        return (
                            <VpTabPane tab={item.sname} key={idx + 'tabs'}>

                            </VpTabPane>
                        )
                    })
                }
            </VpTabs>
        )
    }
}

export default EntityDetail;