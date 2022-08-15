
import React from 'react';
import {
    vpAdd,
    vpDownLoad,
    VpFormCreate,
    VpTable,
    VpRow,
    VpCol,
    VpTooltip,
    VpButton
} from 'vpreact';
import './style.less';

function getHeader() {
    return [
        {
            title: '名称',
            dataIndex: 'sname',
            key: 'sname',
            width: '',
            fixed: ''
        },
        {
            title: '编号',
            dataIndex: 'scode',
            key: 'scode',
            width: '',
            fixed: ''
        },
        {
            title: '负责人',
            dataIndex: 'username',
            key: 'username',
            width: '',
            fixed: ''
        },
        {
            title: '层级结构',
            dataIndex: 'departmentowner',
            key: 'departmentowner',
            width: '',
            fixed: ''
        }
    ];
}
class workspaceExport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabs: '1',
            data_array: [],
            pagination: '',
            perpage: 10000,
            page: 1,
            rows: ''
        }
    }

    componentWillMount() {
        this.getData()
    }
    componentDidMount() {
        $(".wkExport").find('.ant-table-body').height($(window).height() - 225)
    }

    getData = () => {
        vpAdd('/{vpplat}/vfm/studioExport/getStudioList', {
            
        }).then((response) => {
            const { data } = response
            let showTotal = () => {
                return '共' + data.totalRows + '条'
            }
            this.setState({
                data_array: data.resultList,
                page: data.currentPage,
                rows: data.totalRows,
                perpage: data.numPerPage,
                pagination: {
                    showTotal: showTotal,
                    pageSize: data.numPerPage,
                    showSizeChanger: false,
                    showQuickJumper: false,
                }
            })
        })

    }

    onChange = (pagination, filters, sorter) => {
        this.setState({
            perpage: pagination.pageSize || this.state.perpage,
            page: pagination.current || this.state.page,
        }, () => {
            this.getData()
        })
    }
    wkExport = () => {
        vpDownLoad('/{vpplat}/vfm/studioExport/exportfile',
            { exportType: 'workspace' }
        )
    }
    render() {

        return (
            <div className="business-container pr " style={{ marginTop: 10 }}>
                <div className="subAssembly b-b bg-white" >
                    <VpRow gutter={1}>
                        <VpCol className="gutter-row text-right" >
                            <VpTooltip placement="left" title="导出工作空间初始化脚本">
                                <VpButton style={{ marginLeft: '10px' }} type="primary" onClick={() => this.wkExport()}>导出配置</VpButton>
                            </VpTooltip>
                        </VpCol>
                    </VpRow>
                </div>
                <div className=" bg-white full-height">
                    <VpTable
                        className="wkExport"
                        columns={getHeader()}
                        dataSource={this.state.data_array}
                        onChange={this.onChange}
                        pagination={this.state.pagination}
                        resize
                        // bordered
                    />
                </div>
            </div>
        );
    }
}
export default workspaceExport = VpFormCreate(workspaceExport);