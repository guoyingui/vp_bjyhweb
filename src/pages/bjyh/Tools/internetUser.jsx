
import React from 'react';
import {
    VpFormCreate,
    VpTable,
} from 'vpreact';
import './style.less';
import { vpQuery, vpRemove, vpAdd } from 'vpreact';


function getInlineHeader(){
    return [
        { title: '用户名称',
        dataIndex: 'user_name',
        key: 'user_name',
        width: '',
        fixed: ''},
        { title: '登录IP',
        dataIndex: 'loginip',
        key: 'loginip',
        width: '',
        fixed: ''},
        { title: '上次登录时间',
        dataIndex: 'logindate',
        key: 'logindate',
        width: '',
        fixed: ''}
    ];
}
class internetUser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHeight:''
        }
    }

    componentWillMount() {

    }
    componentDidMount() {
        // $(".internetUser").find('.ant-table-body').height($(window).height()-170)
        let theight = vp.computedHeight(this.state.resultList, '.internetUser',170);
        this.setState({
            tableHeight: theight
        })
	}
    
    controlAddButton = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length,'.internetUser',170)
        //设置展开行
        this.setState({
            tableHeight: theight,
            resultList: resultList.length
        })

    }

    render() {

        return (
            <div className="sysdefine-container full-height">
                <div className=" bg-white full-height">
                    <VpTable
                        className="internetUser"
                        dataUrl={'/{vpplat}/cfgcommon/userList'}
                        controlAddButton={
                            (numPerPage, resultList) => {
                                this.controlAddButton(numPerPage, resultList)
                            }
                        }
                        columns={getInlineHeader()}
                        scroll={{ y: this.state.tableHeight }}
                        resize
                        // bordered
                    />
                </div>
            </div>
        );
    }
}
export default internetUser = VpFormCreate(internetUser);