import React, { Component } from 'react';
import {
    VpRow,
    VpCol,
    VpFormCreate,
    VpMenu,
    VpMenuItem,
    VpSubMenu,
    VpIconFont,
    VpTooltip,
    VpIcon,
    vpQuery,
    VpButton 
} from 'vpreact';
import {
    SeachInput,
    QuickCreate,
    RightBox,
} from 'vpbusiness';
import './index.less';
import Processflow from './processflow';
import Myflow from './myflow';
import ProcessflowPlcl from './processflowplcl';
import Processedflow from './processedflow';
import FlowGrant from './flowgrant';
import Flowgrantform from './flowgrantform'

function filterDatas1() {
    return [
        { name: '全部', value: 'alltime' },
        { name: '已超时', value: 'overtime' },
        { name: '未超时', value: 'innotime' }
    ]
}
function filterDatas2() {
    return [
        { name: '全部', value: '' },
        { name: '运行中', value: 'unfinished' },
        { name: '已完成', value: 'finished' },
        { name: '已终止', value: 'deleted' },
    ]
}
function filterDatas3() {
    return [
        { name: '全部', value: '' },
        { name: '运行中', value: 'unfinished' },
        { name: '已完成', value: 'finished' },
        { name: '已终止', value: 'deleted' },
    ]
}
function filterDatas4() {
    return [
        { name: '全部', value: '' },
        { name: '已生效授权', value: 'valid' },
        { name: '未生效授权', value: 'novalid' },
        { name: '已失效授权', value: 'invalid' },
    ]
}
function filterDatas5() {
    return [
        { name: '全部', value: '' },
        { name: '运行中', value: 'unfinished' },
        { name: '已完成', value: 'finished' },
        { name: '已终止', value: 'deleted' },
    ]
}

class workflow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filtervalue: '',
            quickvalue: '',
            filterData: [],
            tab: '1',
            current: 'alltime',
            openKeys: ['sub1'],
            shrinkShow: true,
            currentkey: 'sub1',
            visible: false,
            showFlowSub6 : false 
        }

    }
    componentWillMount() {
        let currentkey = this.props.location.state.currentkey
        if(currentkey!=''&&currentkey!=undefined&&currentkey!=null){
            let current = currentkey=='sub1'?'alltime':''
            this.setState({
                currentkey: currentkey,
                openKeys: [currentkey],
                current:current
            })
        }
        this.showFlowSub6();
    }
    componentDidMount() {
        this.queryFilter();
    }


    showFlowSub6 = () =>{
        vpQuery('/{bjyh}/workFlowBatch/getShowFlag1', {
            userId: vp.cookie.getTkInfo('userid')
        }).then((response) => {
            this.setState({showFlowSub6 :response.data.flag});           
        })
    }

    queryFilter = () => {
        let { tab } = this.state
        let filters = []
        if (tab == '1') {
            filters = filterDatas1()
        } else if (tab == '2') {
            filters = filterDatas2()
        } else {
            filters = filterDatas3()
        }
        this.setState({
            filterData: filters,
        })
    }
    queryFilter2 = () => {
        let { current } = this.state
        let filters = []
        if (current == '1') {
            filters = filterDatas1()
        } else if (current == '2') {
            filters = filterDatas2()
        } else {
            filters = filterDatas3()
        }
        this.setState({
            filterData: filters,
        })
    }
    filterChange = (e) => {
        this.setState({
            filtervalue: e.target.value
        })
    }
    // 搜索框确定事件
    handlesearch = (value) => {
        const searchVal = value.replace(/\s/g, "");
        this.setState({
            quickvalue: searchVal
        })
    }
    tabsChange = (tab) => {
        this.setState({
            tab
        }, () => {
            this.queryFilter()
        })
    }
    shrinkLeft = (e) => {
        this.setState({
            shrinkShow: !this.state.shrinkShow
        }, () => {
            //console.log(this.state.shrinkShow)
        })
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
            openKeys: e.keyPath.slice(1),
            currentkey: e.keyPath.slice(1)[0]
        });
    }
    onToggle = (info) => {
        this.setState({
            openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
        });
    }

    toolBarAddClick = () => {
        this.setState({ visible: true });
    }

    cancelModal = () => {
        this.setState({
            visible: false
        })
    }

    okModal = () => {
        this.table.getTableData()
    }

    batchSelect = () =>{
        this.processflow.batchSelect()
    }

    Look = () => {
        const w=window.open('about:blank');
        //w.location.href='http://10.160.2.187:9080/project/timeOutLogin.jsp?oldSysFlow=oldSysFlow&userid='+vp.cookie.getTkInfo('userid');//测试环境
        w.location.href='http://10.116.147.167:8088/project/timeOutLogin.jsp?oldSysFlow=oldSysFlow&userid='+vp.cookie.getTkInfo('userid');//生产环境
        this.setFormSubmiting(false);
    }

    render() {
        return (
            /*  <div className="pr full-height workflow">
                 <div className="subAssembly b-b bg-white" style={this.props.style}>
                     <VpRow gutter={10}>
                         <VpCol className="gutter-row text-right" span={24}>
                             <div style={{ display: 'inline-block' }} onClick={() => this.toolBarAddClick}><QuickCreate /></div>
                         </VpCol>
                     </VpRow>
                 </div>
                 <div className="p-sm bg-white full-height clearfix" >
                     <VpRow gutter={16} className="full-height">
                         <VpCol span={this.state.shrinkShow ? '4' : '0'} className="full-height pr menuleft">
 
 
                         </VpCol>
                         <VpCol span={this.state.shrinkShow ? '20' : '24'} className="full-height">
                             <div className="shrink p-tb-sm bg-gray cursor" onClick={this.shrinkLeft}>
                                 <VpIconFont type={this.state.shrinkShow ? "vpicon-arrow-left" : "vpicon-arrow-right"} />
                             </div>
 
                         </VpCol>
                     </VpRow>
                 </div>
 
             </div> */


            <div className="business-container pr full-height workflow">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                    <VpRow gutter={10}>
                        <VpCol className="gutter-row text-right" span={4}>
                            <div className="m-b-sm search">
                                <SeachInput onSearch={this.handlesearch} />
                            </div>
                        </VpCol>
                        <VpCol className="gutter-row text-right" span={20}>
                        {/* 我授权的时候才有新增 */}
                        {   /* this.state.currentkey == 'sub1' ?
                            <VpTooltip placement="top" title="批量审批">
                                <VpButton type="primary" style={{ margin: "0 3px" }} shape="circle" onClick={() =>this.batchSelect()}>
                                    <VpIcon className="m-r-xs" type="vpicon-users" />
                                </VpButton>
                                
                            </VpTooltip>:'' */
                        } 
                        {
                              this.state.currentkey == 'sub4' ?
                              <div style={{ display: 'inline-block' }} onClick={() => this.toolBarAddClick()}><QuickCreate /></div>
                              :''
                        }
                        </VpCol>
                        <VpCol className="gutter-row text-right" span={20}>
                            <VpTooltip placement="top" title="查看老系统流程">
                                <VpButton type="Primary" shape="round" size="large" className="m-l-xs" onClick={this.Look}>
                                    查看老系统我处理的流程
                                </VpButton>
                            </VpTooltip>
                        </VpCol>
                    </VpRow>
                    
                </div>

                <div className="business-wrapper p-t-sm full-height">
                    <div className="bg-white p-sm full-height">
                        <VpRow gutter={16} className="full-height">
                            <VpCol span={this.state.shrinkShow ? '4' : '0'} className="full-height pr menuleft">
                                <VpMenu className="full-height scroll-y" onClick={this.handleClick}
                                    openKeys={this.state.openKeys}
                                    onOpen={this.onToggle}
                                    onClose={this.onToggle}
                                    selectedKeys={[this.state.current]}
                                    mode="inline">
                                    <VpSubMenu key="sub1" title={<span><VpIconFont type="vpicon-clock" className="m-r-xs" /><span>待处理</span></span>}>
                                        {
                                            filterDatas1().map((item, index) => {
                                                //console.log(item.value);
                                                return <VpMenuItem key={item.value}>{item.name}</VpMenuItem>
                                            })
                                        }
                                    </VpSubMenu>
                                    <VpSubMenu key="sub2" title={<span><VpIconFont type="vpicon-check-circle-o" className="m-r-xs" /><span>已处理</span></span>}>
                                        {
                                            filterDatas2().map((item, index) => {
                                                return <VpMenuItem key={item.value}>{item.name}</VpMenuItem>
                                            })
                                        }
                                    </VpSubMenu>
                                    <VpSubMenu key="sub3" title={<span><VpIconFont type="vpicon-clock" className="m-r-xs" /><span>我发起</span></span>}>
                                        {
                                            filterDatas3().map((item, index) => {
                                                return <VpMenuItem key={item.value}>{item.name}</VpMenuItem>
                                            })
                                        }
                                    </VpSubMenu>
                                    <VpSubMenu key="sub4" title={<span><VpIconFont type="vpicon-users" className="m-r-xs" /><span>我授权</span></span>}>
                                        {
                                            filterDatas4().map((item, index) => {
                                                return <VpMenuItem key={item.value}>{item.name}</VpMenuItem>
                                            })
                                        }
                                    </VpSubMenu>
                                    {/* 我参与的 */}
                                    <VpSubMenu key="sub5" title={<span><VpIconFont type="vpicon-clock" className="m-r-xs" /><span>我参与的</span></span>}>
                                        {
                                            filterDatas5().map((item, index) => {
                                                console.log(item.value+"---"+item.name);
                                                
                                                return <VpMenuItem key={item.value}>{item.name}</VpMenuItem>
                                            })
                                        }
                                    </VpSubMenu>
                                    {this.state.showFlowSub6  ?
                                        <VpSubMenu key="sub6" title={<span><VpIconFont type="vpicon-clock" className="m-r-xs" /><span>批量审批</span></span>}>
                                            <VpMenuItem key="alltime">全部</VpMenuItem>
                                        </VpSubMenu>
                                    :''}
                                    
                                </VpMenu>
                                {this.state.shrinkShow ?
                                    <div className="navswitch cursor text-center" onClick={this.shrinkLeft}>
                                        <VpIconFont type="vpicon-navclose" />
                                    </div>
                                    :
                                    ''
                                }
                            </VpCol>
                            <VpCol span={this.state.shrinkShow ? '20' : '24'} className="full-height scroll-y">
                                {this.state.shrinkShow ?
                                    null
                                    :
                                    <div className="shrink p-tb-sm cursor text-center" onClick={this.shrinkLeft}>
                                        <VpIconFont type="vpicon-navopen" />
                                    </div>
                                }
                                {
                                    this.state.currentkey == 'sub1' ?
                                        <Processflow
                                            setBreadCrumb={(msg)=>{this.props.setBreadCrumb(msg)}}
                                            setBreadCrumb2={()=>this.props.setBreadCrumb()}
                                            batchSelect={(processflow)=>{this.processflow=processflow}}
                                            filtervalue={this.state.current}
                                            quickvalue={this.state.quickvalue}
                                        />
                                        :
                                        this.state.currentkey == 'sub2' ?
                                            <Processedflow
                                                setBreadCrumb={(msg)=>{this.props.setBreadCrumb(msg)}}
                                                setBreadCrumb2={()=>this.props.setBreadCrumb()}
                                                filtervalue={this.state.current}
                                                quickvalue={this.state.quickvalue}
                                            />
                                        :
                                        this.state.currentkey == 'sub3' ?
                                        <Myflow
                                            setBreadCrumb={(msg)=>{this.props.setBreadCrumb(msg)}}
                                            setBreadCrumb2={()=>this.props.setBreadCrumb()}
                                            filtervalue={this.state.current}
                                            quickvalue={this.state.quickvalue}
                                        />
                                        :
                                        this.state.currentkey == 'sub4' ?
                                        <FlowGrant
                                            bindTable = {table => this.table = table}
                                            filtervalue={this.state.current}
                                            quickvalue={this.state.quickvalue}
                                        />
                                        : 
                                        this.state.currentkey == 'sub5' ?
                                        <Myflow
                                        
                                            setBreadCrumb={(msg)=>{this.props.setBreadCrumb(msg)}}
                                            setBreadCrumb2={()=>this.props.setBreadCrumb()}
                                            filtervalue={this.state.current}
                                            quickvalue={'我参与的'}
                                        />
                                        : 
                                        this.state.currentkey == 'sub6'  ?
                                        <ProcessflowPlcl                                        
                                            setBreadCrumb={(msg)=>{this.props.setBreadCrumb(msg)}}
                                            setBreadCrumb2={()=>this.props.setBreadCrumb()}
                                            batchSelect={(processflow)=>{this.processflow=processflow}}
                                            filtervalue={this.state.current}
                                            quickvalue={this.state.quickvalue}
                                        />
                                        :''
                                }
                            </VpCol>
                        </VpRow>
                    </div>
                </div>
                <RightBox
                    show={this.state.visible}
                    button={
                        <div className="icon p-xs" onClick={()=>this.cancelModal()}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}>

                    <Flowgrantform
                        okModal={() => this.okModal()}
                        cancelModal={() => this.cancelModal()}
                    />
                </RightBox>
            </div>
        )
    }
}


export default workflow = VpFormCreate(workflow);;
