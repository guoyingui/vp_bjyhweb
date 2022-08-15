/*
 * @Author: SL
 * @Date: 2020-06-02 09:58:38
 * @LastEditTime: 2020-07-07 14:48:57
 * @Description: 首页公告栏点击后滑出的表单定制
 * @FilePath: \bjyhweb\src\pages\bjyh\dynamic\index\xtggList.jsx
 */ 
import React from "react";
import { VpTable, vpQuery, VpModal } from 'vpreact';
import Notice from '../Notice/notice';
import red from '../../images/red.png';
export default class XtggList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noticeList: null,
            showTabsRightBox: false,
            tabsentityid: '',
            tabsiid: '',
        };
    }
    componentWillMount() {
        this.setNoticeSubtract(this.props.noticeList);
    }
    componentWillReceiveProps(nextProps) {
        this.setNoticeSubtract(nextProps.noticeList);
    }
    setNoticeSubtract(data) {
        if (!data.length == 0) {
            this.state.noticeList = data.filter((item, index) => {
                // return <VpRow type="flex" justify="space-between" key={index}>
                //             <VpCol span={7}>{item.iclassid}</VpCol>
                //             <VpCol span={10}>{item.sname}</VpCol>
                //             <VpCol span={7}>{item.dproposetime}</VpCol>
                //         </VpRow>
                if (item.istatusflag == 1) {
                    return {
                        key: index,
                        iclassid: item.iclassid,
                        sname: item.sname,
                        dproposetime: item.dproposetime,
                        num: item.num
                    }
                }

            })
        }
    }
    rowClickNotice = (record, index) => {
        console.log("点击事件");
        let _this = this
        vpQuery('/{bjyh}/notice/getnotice', {
			entityid: record.ientityid,
			iid:  record.iid
		}).then(function (data) {
			if (data) {
				if (data.hasOwnProperty('data')) {
					_this.setState({
						formData: data.data,
						detail: true,
						entityid: record.ientityid,
						iid: record.iids,
					})
				}
            }
        })
    }
    
    cancelChoosen = () => {
        this.addNoticeList()
		this.setState({
			detail: false
		})
	}
    // 公告列表请求
    addNoticeList = () => {
        // vpAdd('{vpplat}/vfrm/entity/dynamicListData', {
            vpQuery('/{bjyh}/notice/flagGetNotice', {
            token:window.vp.cookie.getToken(),
            currentPage: 1,
            numPerPage: 10,
            sortfield: '',
            sorttype: '',
            filter: '',
            entityid: 129,
            currentkey: 'filter0',
            condition: [],
            filtervalue: 0,
            quickSearch: '',
            viewtype: 'list',
            datafilter: 'auth',
        }).then((response) => {
            this.setState({
                noticeList: response.data.resultList
            })
        })
    }
    render() {
        const columns = [
            { dataIndex: 'num', key: 'num',width:12,  render(text, record){ 
                if(record.flag=="0"){
                    return  <div><img src={red}  style={{maxWidth:8, height:'auto'}} alt="" /></div>
                }else{
                    return  "";
                }
               
            } },
            { dataIndex: 'iclassid', key: 'iclassid'},
            { dataIndex: 'sname', key: 'sname', },
            { dataIndex: 'dproposetime', key: 'dproposetime', }
        ];
        const data = this.state.noticeList
        return (
            <div>
                <VpTable
                    columns={columns}
                    showHeader={false}
                    dataSource={data}
                    pagination={false}
                    defaultWidth="90"
                    scroll={{ y: 320 }}
                    onRowClick={this.rowClickNotice}
                />
                <VpModal
					title={'公告'}
					visible={this.state.detail}
					width={'70%'}
					footer={null}
					wrapClassName='modal-no-footer'
                    onCancel={() => this.cancelChoosen()}
				>
					{
						this.state.detail ?
                            <Notice
                                className="p-sm full-height scroll p-b-xxlg"
                                formData={this.state.formData}
                                iid={this.state.iid}
                                closeModal={() => this.cancelChoosen()}
                            />
                        : null
					}

				</VpModal>
            </div>

        );
    }


}

