
import React from 'react';
import {
    VpCol,
    VpFormCreate, VpInput, VpModal, VpRadioGroup,
    VpTable, VpRow, VpSelect, VpOption, VpButton, VpIcon,vpDownLoad
} from 'vpreact';
import './style.less';
import { SeachInput, FindCheckbox, VpDynamicForm } from 'vpbusiness';
import { vpQuery, vpRemove, vpAdd } from 'vpreact';
import Choosen from "../../templates/dynamic/Form/ChooseEntity";


function getInlineHeader() {
    return [
        {
            title: '预算名称',
            dataIndex: 'name',
            key: 'name',
            width: '',
            fixed: ''
        },
        {
            title: '预算编号',
            dataIndex: 'code',
            key: 'code',
            width: '',
            fixed: ''
        },
        {
            title: '预算金额',
            dataIndex: 'money',
            key: 'money',
            width: '',
            fixed: ''
        }
    ];
}
class budgetList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableHeight: '',
            editModelVisible: false,
            record: {},
            newrecord: {},
            projectcodes: ''
        }
    }

    componentWillMount() {

    }
    componentDidMount() {
        // $(".budgetList").find('.ant-table-body').height($(window).height()-170)
        let theight = vp.computedHeight(this.state.resultList, '.budgetList', 170);
        this.setState({
            tableHeight: theight
        })
    }

    controlAddButton = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length, '.budgetList', 170)
        //设置展开行
        this.setState({
            tableHeight: theight,
            resultList: resultList.length
        })

    }

    /* 增加右侧滑框 */
    onRowClick = (record, index) => {
        console.log('record', record)

        this.setState({
            editModelVisible: true,
            record: { ...record },
            newrecord: { ...record }
        })
        // console.log('record', this.state.record)
        //}
    }

    inputChangeName = (e) => {
        let _this = this
        let namerecord = _this.state.newrecord
        namerecord.name = e.target.value
        _this.setState({
            newrecord: namerecord
        })
        // console.log(_this.state.record);
        // console.log(_this.state.newrecord);
    }

    inputChangeCode = (e) => {
        let _this = this
        let coderecord = _this.state.newrecord
        coderecord.code = e.target.value
        _this.setState({
            newrecord: coderecord
        })
        // console.log(_this.state.record);
        // console.log(_this.state.newrecord);
    }

    cancelModal() {
        this.setState({
            editModelVisible: false
        })
    }

    handleOk = () => {

        let record = this.state.record
        let newrecord = this.state.newrecord
        console.log(this.state.record)


        vpAdd('{bjyh}/hxcsystem/updateObjBudge', {
            code: record.code, name: record.name, newCode: newrecord.code, newName: newrecord.name
        }).then(res => {
            this.cancelModal();
            this.tableRef.getTableData()
        })

    }
    // 搜索框确定事件
    handlesearch = (value) => {
        const searchVal = $.trim(value);//value.replace(/\s/g, ""); 
        this.setState({
            quickvalue: searchVal
        })
    }

    handlesearch1 = (e) => {
        const searchVal = $.trim(e.target.value);
        this.setState({
            projectcodes: searchVal
        })
    }

    // 附件批量下载
    fileDownload = () => {
        let _this = this
        let projectcodes = this.state.projectcodes;
        console.log('projectcodes', projectcodes);
        vpDownLoad('/{bjyh}/pcl/downloadZipFiles1', {
            projectcodes: projectcodes
        }).then((res) => {
            console.log(res)
        });
    }

    render() {
        const menu = (
            this.state.searchStatus
                ?
                <div className="search-forms bg-white ant-dropdown-menu">
                    <VpDynamicForm
                        ref={(node) => this.dynamic = node}
                        bindThis={this}
                        className="p-sm full-height scroll p-b-xxlg"
                        formData={this.state.increaseData}
                        handleOk={(value) => this.okSearchModal(value)}
                        handleCancel={this.cancelSearchModal}
                        chooseModalVisible={this.chooseModalVisible}
                        okText="查 询" />
                </div>
                : <div></div>
        )
        return (
            <div className="sysdefine-container full-height">
                {
                    <div className="p-b-sm m-b-sm b-b bg-white">
                        <VpRow gutter={1}>
                            <VpCol className="gutter-row" span={4}>
                                <SeachInput onSearch={(value) => this.handlesearch(value)} />
                            </VpCol>

                            <VpInput type='textarea' rows={2} maxLength={1000}
                                value={this.state.projectcodes || ''}
                                onChange={this.handlesearch1}>
                            </VpInput>

                            <VpButton type="primary" shape="circle" className="vp-btn-br-lg" onClick={this.fileDownload}>
                                <VpIcon type="download" />
                            </VpButton>

                        </VpRow>
                    </div>
                }
                <div className=" bg-white full-height">
                    <VpTable
                        ref={table => this.tableRef = table}
                        className="budgetList"
                        params={{
                            name: this.state.quickvalue
                        }
                        }
                        dataUrl={'/{bjyh}/hxcsystem/getObjBudgetList'}
                        controlAddButton={
                            (numPerPage, resultList) => {
                                this.controlAddButton(numPerPage, resultList)
                            }
                        }

                        onRowClick={this.onRowClick}
                        columns={getInlineHeader()}
                        pagination={false}
                        scroll={{ y: this.state.tableHeight }}
                        resize
                    // bordered
                    />


                    <VpModal
                        title='预算信息'
                        visible={this.state.editModelVisible}
                        width={'40%'}
                        height={450}
                        okText="确定"
                        onOk={this.handleOk}
                        wrapClassName='modal-no-footer'
                        onCancel={() => this.cancelModal()}
                    >
                        {
                            this.state.editModelVisible ?

                                <div>
                                    <div className='ant-row ant-form-item'>
                                        <VpCol span="3" className='ant-form-item-label'>
                                            <label>预算名称</label>
                                        </VpCol>
                                        <VpCol span="8" className='ant-form-item-control' >
                                            <VpInput type='input' onChange={this.inputChangeName}
                                                value={this.state.newrecord.name}
                                            >
                                            </VpInput>
                                        </VpCol>
                                    </div>

                                    <div className='ant-row ant-form-item'>
                                        <VpCol span="3" className='ant-form-item-label'>
                                            <label>预算编号</label>
                                        </VpCol>
                                        <VpCol span="8" className='ant-form-item-control' >
                                            <VpInput type='input' onChange={this.inputChangeCode}
                                                value={this.state.newrecord.code}
                                            >
                                            </VpInput>
                                        </VpCol>
                                    </div>

                                    <div className='ant-row ant-form-item'>
                                        <VpCol span="3" className='ant-form-item-label'>
                                            <label>预算金额</label>
                                        </VpCol>
                                        <VpCol span="8" className='ant-form-item-control' >
                                            <VpInput type='input' disabled='true'
                                                value={this.state.newrecord.money}
                                            >
                                            </VpInput>
                                        </VpCol>
                                    </div>
                                </div>
                                :
                                null
                        }
                    </VpModal>

                </div>
            </div>


        );
    }


}
export default budgetList = VpFormCreate(budgetList);