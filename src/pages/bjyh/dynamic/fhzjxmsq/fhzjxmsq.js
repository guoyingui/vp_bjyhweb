import {vpQuery} from "vpreact";
import { common } from "../code";

/**
 * 分行自建项目申请 获取下一步处理人
 * @param resolve
 * @param data
 * @param groupName
 */
export const nextStepHandler = (data, groupName, btn) => {
    return new Promise(resolve => {
        vpQuery('/{bjyh}/fhzjxmsq/getUserInfoByCond',{ groupName: groupName, idepartmentid: common.idepartmentid
        }).then((res) => {
            if (res.data.length === 1) {
                res = res.data
                let pers = ''
                let ids = ''
                for (let i = 0; i < res.length; i++) {
                    ids += res[i].iid + ','
                    pers += res[i].sname + ','
                }
                ids = ids.substring(0, ids.length - 1)
                pers = pers.substring(0, pers.length - 1)
                // 自动获取该流程的分行科技主管
                let handlers = data.handlers
                if (handlers) {
                    let flag = true
                    for (let i = 0; i < handlers.length; i++) {
                        if (btn) {
                            flag = handlers[i].flag == btn ? true : false
                        }
                        if (flag) {
                            handlers[i].ids = ids
                            handlers[i].names = pers
                        }
                    }
                }
            }
            resolve(data)
        })
    })
}