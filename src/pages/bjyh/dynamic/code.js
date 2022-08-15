/*
    通用
 */
import { VpAlertMsg, VpConfirm, VpMSuccess, VpMWarning, vpQuery } from "vpreact";



export const common = {
    currentDate: new Date(),    // 当前时间
    userid: vp.cookie.getTkInfo('userid'),  // 当前登录人ID
    username: vp.cookie.getTkInfo('username'),  // 当前登录人账号(工号)
    nickname: vp.cookie.getTkInfo('nickname'),  // 当前登录人昵称
    idepartmentid: vp.cookie.getTkInfo('idepartmentid'),    // 当前登录人部门ID
    dptname: vp.cookie.getTkInfo('dptname'),    // 当前登录人部门名称
    lcbm_fhzjxmsq: 'fhzjxmsq',  // 流程编码--分行自建项目申请流程编码
}

/**
 * 日期转字符串
 * @param date
 * @param symbol
 * @returns {*}
 */
export const dateToString = (date, symbol) => {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString()
    let day = (date.getDate()).toString()
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    return year + symbol + month + symbol + day
}
/*
    需求变更
 */
export const xqbg = {
    rjkfbbh: 'D000801',   // 软件开发部编号
    xxkjglbbh: 'D000803', // 信息科技管理部编号
    zhanghua_code: '004024', // 张华username
    maxiaoxu_code: '005195', // 马晓煦username
    zongyongtao_code: '005731', // 宗泳涛username
}
/*
    分行自建项目申请
 */
export const fhzjxmsq = {
    lcbzbm_fhxmfzrtjsq: 'fhxmfzrtjsq', // 流程步骤编码--分行项目负责人提交申请
    lcbzbm_fhkjzgldsh: 'fhkjzgldsh', // 流程步骤编码--分行科技主管领导
    lcbzbm_fhzgkjldsp: 'fhzgkjldsp', // 流程步骤编码--分行主管科技领导
    lcbzbm_xmjlcs: 'xmjlcs', // 流程步骤编码--项目经理初审
    lcbzbm_fhxmfzrxgsqwd: 'fhxmfzrxgsqwd', // 流程步骤编码--分行项目负责人修改文档
    lcyhz_fhkjzg: '分行科技主管', // 流程用户组--分行科技主管
    lcyhz_fhkjld: '分行科技领导',   // 流程用户组--分行科技领导
}
/*
    上线申请
 */
export const xmsxsq = {
    lcbm_sxsqlc: 'sxsqlc', // 流程编码--上线申请流程
    lcbzbm_tjsxsq: '01', // 流程步骤编码--提交上线申请
    lcbzbm_kffzr1: '021', // 流程步骤编码--开发负责人 此处两个验证 021包含App校验的 022不包含App校验
    lcbzbm_kffzr2: '022', // 流程步骤编码--开发负责人
}
/*
    ODS数据下发流程
 */
export const odssjxf = {
    lcbzbm_odssjxf: 'fhsqrsqsjxf',  // 流程编码--分行自建项目申请流程编码
}

/**
 * 单个input 校验当前审批人意见
 * @param fieldProp
 * @param required
 * @param message 需要返回固定意见的可传参 如不用 可不传参 例子： validationRequireField(_this, 'XXXX', true) 
 */
export const validationRequireField = (_this, fieldProp, required, message) => {
    // 获取fieldProp 的校验规则集合
    let findWidgetByName = _this.state.formData.findWidgetByName(fieldProp);
    if (findWidgetByName) {
        let rules = findWidgetByName.field.fieldProps.rules
        // 是否存在必填校验规则
        let requiredRule = null
        if (rules) {
            rules.forEach((item) => {
                if (item && item.hasOwnProperty('required')) {
                    requiredRule = item
                }
            })
        }
        // 修改必填规则
        if (requiredRule) {
            requiredRule.required = required
            if (message) {
                requiredRule.message = message
            } else {
                requiredRule.message = "请填写拒绝意见！"
            }

        } else {
            rules.push({ required: required, message: message || "请填写拒绝意见！" });
        }
        _this.props.form.validateFields([fieldProp], { force: true })
    }
}

// 流程返回时必填取消
export const validationRequireFieldBitian = (_this, fieldProp, required, message) => {
    // 获取fieldProp 的校验规则集合
    let findWidgetByName = _this.state.formData.findWidgetByName(fieldProp);
    if (findWidgetByName) {
        let rules = findWidgetByName.field.fieldProps.rules
        // 是否存在必填校验规则
        let requiredRule = null
        if (rules) {
            rules.forEach((item) => {
                if (item && item.hasOwnProperty('required')) {
                    requiredRule = item
                }
            })
        }
        // 修改必填规则
        if (requiredRule) {
            requiredRule.required = required
            if (message) {
                requiredRule.message = message
            } else {
                requiredRule.message = "必填项不能为空!"
            }

        } else {
            rules.push({ required: required, message: message || "必填项不能为空!" });
        }
        _this.props.form.validateFields([fieldProp], { force: true })
    }
}

/**
 * 单个 input 填充
 * @param formData 表单
 * @param field 字段
 * @param flag 是否同步至流程意见
 */
export const singleInputFill = (formData, btnName, field, flag) => {
    if (btnName == 'ok') {
        let sparam = JSON.parse(formData.sparam)
        let fieldValue = sparam[field]
        if (!fieldValue) {
            sparam['sdescription'] = '同意'
            if (field != 'sdescription') {
                sparam[field] = '同意' + `\n签批人：${common.nickname}`
            }
        } else {
            if (fieldValue.indexOf('签批人') > -1) {
                fieldValue = fieldValue.split('签批人')[0]
            }
            if (flag) {
                sparam['sdescription'] = fieldValue
            }
            if (field != 'sdescription') {
                sparam[field] = fieldValue + `\n签批人：${common.nickname}`
            }
        }
        formData.sparam = JSON.stringify(sparam)
    }
}

/**
 * 附件校验
 * @param _this
 * @param btnName
 * @param flowCode  流程编码
 * @param stepCode  步骤编码
 * @returns {Promise<any>}
 */
export const fileValidation = (_this, btnName, flowCode, stepCode) => {
    if (btnName == 'ok') {
        return new Promise(resolve => {
            vpQuery('/{bjyh}/fjjywh/getEnclosureValidate', {
                flowCode: flowCode, stepCode: stepCode
            }).then((res) => {
                if (res.data) {
                    let stxnr = res.data.stxnr  // 提醒内容
                    let ffjgs = res.data.ffjgs  // 附件个数
                    const fileNames = _this.rfjRef.state.childNodes     // 上传文件的集合
                    let filterFiles = []  // 文件去重后
                    let requireFile = res.data.hasOwnProperty('sfjwjm1') ? res.data.sfjwjm1.split(',') : ''   // 指定上传的文件
                    if (requireFile == '') {
                        if (ffjgs > fileNames.length) {
                            VpMWarning({
                                title: '这是一条警告通知',
                                content: stxnr
                            })
                            resolve(false)
                        } else {
                            resolve(true)
                        }
                    } else {
                        fileNames.map(v => {
                            let filename = v.filename.substring(0, v.filename.lastIndexOf('.'));
                            if (filterFiles.indexOf(filename) == -1) {
                                filterFiles.push(filename)
                            }
                        })
                        // 是否已上传指定文件
                        let num = 0
                        for (let i = 0; i < requireFile.length; i++) {
                            for (let j = 0; j < filterFiles.length; j++) {
                                if (requireFile[i].indexOf("-") != -1) {
                                    // console.log("requireFile[i]:"+requireFile[i]);
                                    //附件效验名称 包含- 符号 代表多个文件包含其一即可。
                                    let files = requireFile[i].split('-')
                                    for (let k = 0; k < files.length; k++) {
                                        console.log("files[k]:" + files[k]);
                                        if (filterFiles[j].indexOf(files[k]) != -1) {
                                            // console.log("通过效验的文件:"+filterFiles[j]+"---"+files[k]);
                                            num++
                                            break
                                        }
                                    }
                                } else if (filterFiles[j].indexOf(requireFile[i]) != -1) {
                                    // console.log("通过效验的文件:"+filterFiles[j]+"---"+requireFile[i]);
                                    num++
                                    break
                                }
                            }
                        }
                        // if (filterFiles.filter(v => v.indexOf(requireFile) != -1).length != ffjgs) {
                        // console.log("num:"+num+"---"+requireFile.length);
                        if (num != requireFile.length) {
                            if (res.data.isfqz == 1) { // 非强制
                                VpConfirm({
                                    title: stxnr + ',是否继续？',
                                    onOk() {
                                        resolve(true)
                                    },
                                    onCancel() {
                                        resolve(false)
                                    }
                                })
                            } else {    // 强制
                                //如果通过条数大于或等于当前效验的附件文件名称条数，则让他通过
                                if (num >= requireFile.length) {
                                    resolve(true)
                                } else {
                                    VpMWarning({
                                        title: '这是一条警告通知',
                                        content: stxnr
                                    })
                                    resolve(false)
                                }
                            }
                        } else {
                            //搞定后修改回来 true
                            resolve(true)
                        }
                    }
                } else {
                    resolve(true)
                }
            })
        })
    }
}

export const initHiddenColumn = (iyspctemp) => {
    if (iyspctemp == "0") {
        document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    } else if (iyspctemp == "1") {
        document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    } else if (iyspctemp == "2") {
        document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    } else if (iyspctemp == "3") {
        document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    } else if (iyspctemp == "4") {
        document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    }
}

export const xmsqHiddenColumn = (formData, iyspctemp, _this) => {

    let iyspc = formData.findWidgetByName('iyspc');
    if (iyspc) {
        iyspctemp = iyspc && iyspc.field.fieldProps.initialValue;
        iyspc.field.fieldProps.onChange = (v) => {
            if (v == "0") {
                _this.props.form.setFieldsValue({
                    'sysbh1': '',
                    'sysbh2': '',
                    'sysbh3': '',
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc1': '',
                    'sysmc2': '',
                    'sysmc3': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "1") {
                _this.props.form.setFieldsValue({
                    'sysbh2': '',
                    'sysbh3': '',
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc2': '',
                    'sysmc3': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "2") {
                let obj = _this.props.form.getFieldsValue(['sysbh1', 'sysmc1', 'scpmc'])
                console.log('obj...', obj);
                _this.props.form.setFieldsValue({
                    'sysbh3': '',
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc3': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "3") {
                _this.props.form.setFieldsValue({
                    'sysbh4': '',
                    'sysbh5': '',
                    'sysmc4': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "4") {
                _this.props.form.setFieldsValue({
                    'sysbh5': '',
                    'sysmc5': '',
                })
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } else if (v == "5") {
                document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
                document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'block';
            }
        }
    }
}

//隐藏数算编号流程历史表单查看时 使用控件隐藏方式
export const initHiddenColumn_history = (formData) => {
    // 预算编号和名称动态设定
    let iyspc = formData.findWidgetByName('iyspc');
    let sysbh1 = formData.findWidgetByName("sysbh1");
    let sysbh2 = formData.findWidgetByName("sysbh2");
    let sysbh3 = formData.findWidgetByName("sysbh3");
    let sysbh4 = formData.findWidgetByName("sysbh4");
    let sysbh5 = formData.findWidgetByName("sysbh5");

    let sysmc1 = formData.findWidgetByName("sysmc1");
    let sysmc2 = formData.findWidgetByName("sysmc2");
    let sysmc3 = formData.findWidgetByName("sysmc3");
    let sysmc4 = formData.findWidgetByName("sysmc4");
    let sysmc5 = formData.findWidgetByName("sysmc5");

    if (iyspc.field.fieldProps.initialValue == "0") {
        sysbh1.field.hidden = true;
        sysbh2.field.hidden = true;
        sysbh3.field.hidden = true;
        sysbh4.field.hidden = true;
        sysbh5.field.hidden = true;
        sysmc1.field.hidden = true;
        sysmc2.field.hidden = true;
        sysmc3.field.hidden = true;
        sysmc4.field.hidden = true;
        sysmc5.field.hidden = true;
    } else if (iyspc.field.fieldProps.initialValue == "1") {

        sysbh2.field.hidden = true;
        sysbh3.field.hidden = true;
        sysbh4.field.hidden = true;
        sysbh5.field.hidden = true;
        sysmc2.field.hidden = true;
        sysmc3.field.hidden = true;
        sysmc4.field.hidden = true;
        sysmc5.field.hidden = true;
    } else if (iyspc.field.fieldProps.initialValue == "2") {

        sysbh3.field.hidden = true;
        sysbh4.field.hidden = true;
        sysbh5.field.hidden = true;
        sysmc3.field.hidden = true;
        sysmc4.field.hidden = true;
        sysmc5.field.hidden = true;
    } else if (iyspc.field.fieldProps.initialValue == "3") {

        sysbh4.field.hidden = true;
        sysbh5.field.hidden = true;
        sysmc4.field.hidden = true;
        sysmc5.field.hidden = true;
    } else if (iyspc.field.fieldProps.initialValue == "4") {

        sysbh5.field.hidden = true;
        sysmc5.field.hidden = true;
    }

}

// 项目经理转处理人以后转给其他人后不能看到商务信息
export const initHiddenColumn_swxx = (formData) => {
    document.querySelector(`label[for="${'iyspc'}"]`).parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('fbxmyjtrje').parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('sysbh1').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('sysbh2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('sysbh3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('sysbh4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('sysbh5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('sysmc1').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('sysmc2').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('sysmc3').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('sysmc4').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    document.getElementById('sysmc5').parentElement.parentElement.parentElement.parentElement.style.display = 'none';
}
