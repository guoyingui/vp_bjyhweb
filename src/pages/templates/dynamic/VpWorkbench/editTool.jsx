import React from "react";
import { 
    VpRow,
    VpCol,
    VpIconFont,
    VpButton,
    VpModal, 
    vpAdd,
    vpQuery,
    VpAlertMsg,
 } from "vpreact";

import "./editTool.less";
import FunctionTree from './functionTree';

export default class EditTool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // tool: [
            //     {
            //         groups_title: "发布",
            //         groups_list: [
            //             { id: 1, icon: "vpicon-sitemap", title: "组织机构" , functionid:"21", tabid:"43"},
            //             { id: 2, icon: "vpicon-image", title: "报工", functionid:"1", tabid:"53"},
            //             { id: 3, icon: "vpicon-image", title: "审批报工", functionid:"1", tabid:"54"},
            //             { id: 4, icon: "vpicon-copy", title: "拷贝" },
            //             { id: 5, icon: "vpicon-image", title: "实体" },
            //             { id: 6, icon: "vpicon-copy", title: "项目" },
            //             { id: 7, icon: "vpicon-image", title: "子项目" },
            //             { id: 8, icon: "vpicon-copy", title: "流程" }
            //         ]
            //     }
            // ],
            showlist: false,
            listtitle: '',
            defaultToolList : [],
            functionList: [],
            visible:false,
        };
        this._list = [];
    }

    componentWillMount() {
        this.setToolSubtract(this.props.editToolList);
        this.getAllTools();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this.setToolSubtract(nextProps.editToolList);
        }
    }

    //工具
    getAllTools = () => {
        vpQuery('/{vpplat}/workbench/getalltool',{

        }).then((response)=>{
            if(response.data != null){
                let data = response.data
                this.state.defaultToolList = [];
                this.state.defaultToolList.push(...data);

                this.setState({ 
                    defaultToolList: this.state.defaultToolList 
                });
            }
        })
    } 

    setToolSubtract(data) {
        let _edit_tool_list = [];
        data.map((item, index) => {
            _edit_tool_list.push(item.iid);
        });

        this.state.defaultToolList.map((item_list, index_list) => {
            item_list.subtract ? item_list.subtract = false : '';
            if (_edit_tool_list.indexOf(item_list.iid) >= 0) {
                item_list.subtract = true;
            }
        })
    }
    handleAddToolList = (e,item) => {
        item.subtract = true;
        this._list = [];
        this._list.push(item);

        if(this.props.editToolList.length<9){
        // console.log(!this.props.visible)
        // if(!this.props.visible) {
            this.props.getToolAddList(this._list);
        // }
        }else{
            VpAlertMsg({
                message: "消息提示",
                description: "首页最多只能添加9个工具!",
                type: "error",
                closeText: "关闭",
                showIcon: true
            }, 5)
        }

        vpAdd('/{vpplat}/workbench/save',
            {
                name: item.sname,
                funtionid: item.functionid,
                tabid: item.tabid,
                ientityid: item.ientityid,
            }
        ).then(function (response) {
            if(response.data.success){

            }else{

            }
        }).catch(function (err) {

        });
    }

    okListModal = (functionList) => {
        let totalList = this.state.functionList
        let idx = 0
        functionList.map((item) => {
            idx = totalList.findIndex((obj) => item.iid === obj.iid)
            if (idx == -1 && item.isleaf <= 0) { //只添加未添加的叶子节点
                totalList.push(item)
            }
        })

        vpAdd('/{vpplat}/workbench/savepublishtool',{
                linkList: JSON.stringify(totalList)
            }
        ).then(function (data) {

        }).catch(function (err) {

        });

        this.setState({ 
             functionList: totalList, 
             showlist: false,
        }, () => {
            this.getAllTools();
        })
    }

    cancelListModal = () => {
        this.setState({
            showlist: false,
            listtitle: '',
        })
    }

    btnOptClick = (optType) => {
        if (optType == 'addFun') { //添加
            this.setState({
                showlist: true,
                listtitle: '可选工具列表'
            })
        } else if (optType == 'confirmFun') { //确定
            this.props.cancleEditTool()
        } else if (optType == 'cancelFun') { //取消
            this.props.cancleEditTool()
        }
    }

    render() {
        return (
            <div className="all-edit-tool full-height f14">
                <div className="tool-group" key={0}>
                    <div className="title pr">
                        <span className="bg-white p-lr-sm">发布</span>
                    </div>
                    <VpRow gutter={10} className="m-tb-lg p-lr-sm" >
                        {
                            this.state.defaultToolList.length > 0 ? this.state.defaultToolList.map((item_list, index_list) => {
                                return (
                                    <VpCol span={4} className="m-b-sm" key={index_list}>
                                        <div className="bg-white tool-list pr p-sm text-center cursor">
                                            <VpIconFont type={"f24 " + item_list.icon} />
                                            <p className="m-t-xs">{item_list.sname}</p>
                                            {
                                                item_list.subtract ? 
                                                <VpIconFont type="vpicon-minus-circle" className="add-or-subtract text-danger"/>
                                                :
                                                <VpIconFont 
                                                type="vpicon-plus-circle" 
                                                className="add-or-subtract text-primary"
                                                onClick={(e)=>this.handleAddToolList(e,item_list)}
                                                />
                                            }
                                        </div>
                                    </VpCol>
                                )
                            }) : null
                        }
                    </VpRow>

                    <VpModal
                        title={this.state.listtitle}
                        visible={this.state.showlist}
                        onOk={() => this.cancelListModal()}
                        onCancel={() => this.cancelListModal()}
                        width={'80%'}
                        height={'100%'}
                        maskClosable={false}
                        footer={null}
                        wrapClassName='modal-no-footer'
                    >
                        {
                            this.state.showlist
                                ? <FunctionTree
                                    iid={this.state.iid}
                                    okClick={(functionList) => this.okListModal(functionList)}
                                    cancelClick={() => this.cancelListModal()}
                                />
                                : ''
                        }
                    </VpModal>

                    <div className="footer-button-wrap ant-modal-footer" style={{ position: 'absolute' }} >
                        <VpButton key="addFun" type="ghost" size="large" onClick={() => this.btnOptClick('addFun')}>添加</VpButton>
                        <VpButton key="confirmFun" type="ghost" size="large" onClick={() => this.btnOptClick('confirmFun')}>确定</VpButton>
                        <VpButton key="cancelFun" type="ghost" size="large" onClick={() => this.btnOptClick('cancelFun')}>取消</VpButton>
                    </div>
                </div>
            </div>
        )
    }
}