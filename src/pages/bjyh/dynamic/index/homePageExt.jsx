/*
 * @Author: SL.
 * @Date: 2020-06-09 09:28:45
 * @LastEditTime: 2020-09-15 14:44:54
 * @LastEditors: Please set LastEditors
 * @Description: 各种弹框
 * @FilePath: \bjyhweb\src\pages\bjyh\dynamic\index\homePageExt.jsx
 */ 
import React, { Component } from 'react'
import { VpMInfo, vpQuery, vpDownLoad, vpAdd, VpMWarning, VpTable} from "vpreact";
// const data = [];
// for (let i = 0; i < 46; i++) {
//     data.push({
//         key: i,
//         name: `李大嘴${i}`,
//         age: 32,
//         address: `西湖区湖底公园${i}号`,
//     });
// }
const columns = [
    { title: '需求编号', dataIndex: 'scode', key: 'scode', width: 160 },
    { title: '项目名称', dataIndex: 'sname', key: 'sname' , 
        render: (text, record) => <div style={{whiteSpace: 'normal'}}>{text}</div>
        },
    { title: '需求提出部门', dataIndex: 'xqtcbm', key: 'xqtcbm',
        render: (text, record) => <div style={{whiteSpace: 'normal'}}>{text}</div>
        },
    { title: '项目等级', dataIndex: 'xmdj', key: 'xmdj'},
    { title: '需求提出人', dataIndex: 'ywdb', key: 'ywdb'},
    { title: '项目经理', dataIndex: 'xmjlname', key: 'xmjlname'},
    { title: '开发负责人', dataIndex: 'kffzr', key: 'kffzr'},
    { title: '当前处理步骤', dataIndex: 'stepname', key: 'stepname',
        render: (text, record) => <div style={{whiteSpace: 'normal'}}>{text}</div>
        },
    { title: '当前处理人', dataIndex: 'assignee', key: 'assignee'},
    { title: '需求受理时间', dataIndex: 'xqsldate', key: 'xqsldate'},
    { title: '立项耗时（工作日）', dataIndex: 'difdays2', key: 'difdays2', width: 150},
];
/** 
    需求86-1
    用户首次登录系统后，弹出提示框，提示框显示通知内容（详细内容见附件）及文档下载链接，可下载文档。
    用户点击提示框中的“已阅读”按钮后，再次登录系统后，不再弹出此提示框。
    通知内容和可下载文档，详见以下附件。
    此提示弹框为第一优先提示
 */
export default class HomePageExt  {
    constructor(onOk = () => {}){
        if(onOk && typeof onOk === 'function'){
            this.okFunc = onOk.bind(this);
        }
    }
    /**
     * @description:用于查询当前用户是否‘已阅读’系统提示，若没有则弹出提示
     * @param {} 
     * @return: 
     */
    checkReadedNotice = () => {        
        // vpQuery('/{bjyh}/workNotice/checkSysNotice').then(response => {
        //     if(response.isDelayed){
        //         this.xmsqNotic(response.resultList)
        //     }
        //     if (!response.sysRead) {
        //         this.notice()
        //     }
        //     if (!response.sysRead2) {
        //         return this.notice2()
        //     }
        // })

        vpQuery('/{bjyh}/ZKsecondSave/usreDcl', {token:window.vp.cookie.getToken()
        }).then((response) => {
            if(response.tstk==1){
                VpMInfo({
                    width: 600,
                    title: '上线申请流程提示',
                    content: '开发负责人审核要求在周五中午12点前完成',
                    okText: '已阅读', 
                    onOk() {
                        sessionStorage.setItem('notice',false)
                    },
                });
            }else if(response.tstk==2){
                VpMInfo({
                    width: 600,
                    title: '上线申请流程提示',
                    content: '开发负责人上传文档要求在周一中午12点前完成',
                    okText: '已阅读', 
                    onOk() {
                        sessionStorage.setItem('notice',false)
                    },
                });
            }else if(response.tstk==3){
                VpMInfo({
                    width: 600,
                    title: '上线申请流程提示',
                    content: '开发负责人审核要求在周五中午12点前完成，上传文档要求在周一中午12点前完成',
                    okText: '已阅读', 
                    onOk() {
                        sessionStorage.setItem('notice',false)
                    },
                });
            }
            
        })
    }

    setsessionStorage = () => {
        sessionStorage.setItem('notice',false)
    }

    /**
     * @description:文件下载
     * @param {e} 1：模板,2：样例
     * @return: 
     */  
    onDownload = e => {
        let condition = {}
        switch (e) {
            case 1:
                condition = {
                    filePath: '',
                    fileName: 'ywcsysbgV4.doc',
                    downLoadName: '业务测试验收报告V4.doc',
                }
                break;
            case 2:
                condition = {
                    fileName: 'ywcsysbg(yl).doc',
                    downLoadName: '业务测试验收报告(样例).doc',
                }
                break;
            case 3:
                condition = {
                    fileName: 'gygfywcsysbgbxyqdtz.doc',
                    downLoadName: '《关于规范业务测试验收报告编写要求的通知》.doc',
                }
                break;
            case 4:
                condition = {
                    fileName: 'ywcsysbg.zip',
                    downLoadName: '业务测试验收报告.zip',
                }
                break;
            case 5:
                condition = {
                    fileName: 'ywcsal(mb).xls',
                    downLoadName: '业务测试案例(模板).xls',
                }
                break;
            case 6:
                condition = {
                    fileName: 'ywcsalbxgfV0.3.doc',
                    downLoadName: '业务测试案例编写规范V0.3.doc',
                }
                break;
        }
        
        vpDownLoad('/{bjyh}/util/fileDownload', condition)
    }
    /**
     * @description: 点击‘已阅读’更新用户ssysnotice
     */
    readNotice = (field) => {        
        vpAdd('/{bjyh}/workNotice/readNotice',{field})
    }
    /**
     * @description: 提醒弹框
     */
    notice = () => {
        let _this = this
        VpMInfo({
            width: 600,
            title: '关于规范业务测试验收报告编写要求的通知',
            content: (
                <div style = {{fontSize : 15, lineHeight : 1.6}}>
                    <p>&nbsp;&nbsp;&nbsp;为落实2019年度北京银保监局现场检查监管意见，提高业务测试工作质量，保障上线系统稳定性，我部将进一步规范《业务测试验收报告》的编写要求，并制定了业务测试案例模板。</p>
                    <p>&nbsp;&nbsp;&nbsp;自2020年7月1日起，立项类的软件开发项目均需要按照要求编写《业务测试验收报告》、《业务测试案例》，并在发起项目上线申请时，将填写完整的业务测试案例做为业务测试验收报告附件、与项目上线业务验证情况汇总表一并上传项目管理系统。项目分阶段上线时，每次上线均需要提交。</p>
                    <p>&nbsp;&nbsp;&nbsp;《业务测试验收报告》、《业务测试案例》模版以及样例可在项目管理系统-文档管理-文档库-公共文档-软件项目管理文档中下载。使用中如有问题，可联系对应的项目经理进行咨询，感谢各部门的配合。</p>
                    <p><a onClick={e => _this.onDownload(1)}>1、下载：《业务测试验收报告》、《业务测试案例》模板</a></p>
                    <p><a onClick={e => _this.onDownload(2)}>2、下载：《业务测试验收报告》、《业务测试案例》样例</a></p>
                </div>
            ),
            okText: '已阅读',
            onOk() {
                (_this.okFunc && _this.okFunc()) || _this.readNotice('ssysnotice')
            },
        });
    }
    notice2 = () => {
        let _this = this
        VpMInfo({
            width: 600,
            title: '《业务测试案例编写规范》',
            content: (
                <div style = {{fontSize : 15, lineHeight : 1.6}}>
                    <p>&nbsp;&nbsp;&nbsp;为落实2019年度北京银保监局现场检查监管意见，自2020年7月1日起，立项类的软件开发项目均需要编写《业务测试案例》。</p>
                    <p>&nbsp;&nbsp;&nbsp;为了提高业务测试案例编写质量，我部特拟定《业务测试案例编写规范》，供各项目参考使用。如有问题，可联系对应的项目经理进行咨询，感谢各部门的配合。</p>
                    <p><a onClick={e => _this.onDownload(5)}>1、《业务测试案例编写规范》</a></p>
                    <p><a onClick={e => _this.onDownload(6)}>2、《业务测试案例》模板</a></p>
                </div>
            ),
            okText: '已阅读',
            onOk() {
                (_this.okFunc && _this.okFunc()) || _this.readNotice('ssysnotice2')
            },
        });
    }
    /**
     * @description: 上线申请流程第一步的弹框提醒
     */
    notice_sxsq = () => { 
        const style = {color:'red'}
        let _this = this
        !!!sessionStorage.getItem('notice') && VpMInfo({
            width: 500,
            title: '关于规范业务测试验收报告编写要求的通知',
            content: (
                <div>
                    <p>
                        请按照<a style={style} onClick={e => _this.onDownload(3)}><u>《关于规范业务测试验收报告编写要求的通知》</u></a>
                        要求上传
                        <a style={style} onClick={e => _this.onDownload(4)}><u>业务测试案例</u></a>
                    </p>
                </div>
            ),
            okText: '关闭',
            onOk() {},
            onCancel() {},
            closable: true,
        });
    }

    /**
     * @description: 需求71
     * @param {} 
     * @return: 
     */
    static checkAddAccess = (ref) => {
        vpQuery('/{bjyh}/xmsq/checkAddAccess').then(response => {
            const data = response.data
            if (!data.pjname) {
                return
            }
            let username = vp.cookie.getTkInfo('nickname')
            let infos = "“" + data.pjname.split(",").join('”、“') + "”"
            VpMWarning({
                width: 500,
                title: '提示',
                content: `${username}您好，您尚未完成${infos} 的后评价流程，无法提出项目申请流程，请在完成后评价流程处理后再提出项目申请流程`,
                okText: '确定',
                onOk() {
                    ref.cancelModal();
                },
            });
        })
    }
    /**
     * @description: 需求87，超时的项目申请弹框提醒
     * @param {type} 
     * @return: 
     */
    xmsqNotic = (data) => {
        !!!sessionStorage.getItem('notice') && VpMWarning({
            width: 820,
            title: `${vp.cookie.getTkInfo('nickname')}您好，以下项目已立项超时，请及时处理，本项目将计入超时统计并向领导汇报。`,
            content: (
                <div>
                    <VpTable 
                        columns = {columns} 
                        dataSource = {data} 
                        scroll = {{ x: 1000, y: 350 }} 
                        resize 
                        //title={() => '页头'} 
                        bordered = {true}
                        pagination = {false}
                        size = {'small'}
                        rowClassName={(record, index) => {
                            if(index % 2 === 1)
                            return 'bg-row';
                        }}
                    />
                </div>
            ),
            okText: '确定',
            onOk() {
                sessionStorage.setItem('notice',false)
            },
        });
    }

}