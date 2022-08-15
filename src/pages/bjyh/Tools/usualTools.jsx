
import React from 'react';
import { VpFormCreate, VpTabs, VpTabPane, } from 'vpreact';
import './style.less'
import InternetUser from './internetUser';
import Intervene from '../WorkFlow/intervene';
import WorkInterfer from '../System/workInterfer';
import EntityConfigUpdate from './entityConfigUpdate';
import ConfigExport from './configExport';
import Xmzxhpj from './xmzxhpjImprot';
import Plxgxmryxx from './plxgxmryxxImprot';
import BudgetList from './budgetList';
import UpdateProjectDate from './updateProjectDate';
class usualTools extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabs: '1'
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    tabsChange(tabs) {
    }


    render() {
        return (
            <div className="sysdefine-container full-height">
                <div className="p-sm bg-white full-height usualTool">
                    <VpTabs className="full-height" tabPosition="left" onChange={this.tabsChange}>
                        <VpTabPane className="utiltabs" tab="工作项干预" key="2" >
                            <WorkInterfer />
                        </VpTabPane>
                        <VpTabPane className="utiltabs" tab="流程干预" key="1" >
                            <Intervene />
                        </VpTabPane>
                        <VpTabPane className="utiltabs" tab="联机用户" key="3" >
                            <InternetUser />
                        </VpTabPane>
                        <VpTabPane className="utiltabs" tab="实体升级" key="4" >
                            <EntityConfigUpdate />
                        </VpTabPane>
                        <VpTabPane className="utiltabs" tab="基础数据导出" key="5">
                            <ConfigExport />
                        </VpTabPane>
                        <VpTabPane className="utiltabs" tab="项目专项后评价导入" key="6">
                            <Xmzxhpj />
                        </VpTabPane>
                        <VpTabPane className="utiltabs" tab="批量修改项目中人员信息" key="7">
                            <Plxgxmryxx />
                        </VpTabPane>
                        <VpTabPane className="utiltabs" tab="预算视图" key="8">
                            <BudgetList />
                        </VpTabPane>
                        <VpTabPane className="utiltabs" tab="修改项目取消和结项时间" key="9">
                            <UpdateProjectDate />
                        </VpTabPane>
                    </VpTabs>
                </div>
            </div>
        );
    }
}
export default usualTools = VpFormCreate(usualTools);