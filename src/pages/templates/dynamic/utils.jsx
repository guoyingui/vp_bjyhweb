import React, { Component } from 'react'
import { VpAlertMsg } from "vpreact";
const randomize = require('randomatic');

/**
 * 自定义按钮与默认按钮合并
 * @param custButtons
 * @param defaultButtons
 * @returns {Array}
 */
export const mergeButtons = function (custButtons, defaultButtons) {
    let newButtons = [];
    custButtons.map((btnItem, btnIndex) => {
        let btn;
        if (typeof btnItem == 'string') {
            if (defaultButtons.hasOwnProperty(btnItem)) {
                //如果是string类型，则映射到默认按钮上，
                // 比如btn = "ok",则变成{name:"ok",title:"保存",...}
                if (defaultButtons[btnItem] instanceof Array) {
                    btn = [...defaultButtons[btnItem]];
                } else {
                    btn = { ...defaultButtons[btnItem] };
                }

            } else {
                //不能映射到默认按钮得，不处理
                btn = btnItem;
            }
        } else if (defaultButtons.hasOwnProperty(btnItem.name)) {
            //如果btn.name在默认按钮中，则合并两者属性。
            // 比如btn值为{name:"ok",text:"确认"}，合并后变成{name:"ok","text":"确认“,handler:this.handleOk,...}
            if (!(defaultButtons[btnItem.name] instanceof Array)) {
                //不是数组才合并属性，是数组得话，直接用自定义的
                btn = { ...defaultButtons[btnItem.name], ...btnItem }
            }
        } else {
            btn = { ...btnItem };
        }
        if (btn instanceof Array) {
            //如果btn是数组
            newButtons = newButtons.concat(btn);
        } else {
            newButtons.push(btn);
        }
    });
    return newButtons;
}

//判断变量是否以某个字符串结尾
export const endWithStr = function (field, endStr) {
    var d = field.length - endStr.length;
    return (d >= 0 && field.lastIndexOf(endStr) == d)
}


/**
 * 供下面treeTableDataTotreeData调用
 * @param {*} menus 
 */
function getMenuName(menus) {
    let datatree = [];
    menus.map((item) => {
        let data = {};
        data.name = item.sname;
        data.tid = item.iid;
        if (item.iparent == '') {
            data.open = 'true';
        } else {
            data.open = 'false';
        }
        data.icon = '';
        data.checked = 'false';
        data.async = 'false';
        if (item.children) {
            data.children = getMenuName(item.children);
        } else {
            data.children = [];
        }
        datatree.push(data);
    })
    return (datatree);
}

/**
 * treeTableData转化成treeData
 * 即：树表数据转化为树形结构数据
 * @param {*} data 
 */
export const treeTableDataTotreeData = function (data) {
    let newTreeData = {};
    newTreeData.timestamp = data.timestamp;
    newTreeData.msgparam = data.msgparam;
    newTreeData.msg = data.msg;
    newTreeData.data = getMenuName(data.data.resultList);
    return newTreeData;
}

/**
 * 生成随机码
 * @return {*}
 */
export const randomKey = function () {
    return randomize('Aa0', 6);
}


/**
 *
 * @return {
 *     "参数名":"参数值"
 *     ...
 * }
 */

export const urlParamToObject = (paramStr) => {
    let params = {};
    let paramNameAndVals = paramStr.split("&"); //参数对
    for (var i = 0; i < paramNameAndVals.length; i++) {
        let paramNameAndVal = paramNameAndVals[i];
        if (paramNameAndVal.trim() == '') {
            //如果是空字符串
            continue;
        }
        let paramNameAndValArray = paramNameAndVal.split("=");
        if (paramNameAndValArray.length == 1) {
            //没有等号的参数，即只有参数名的
            params[paramNameAndValArray[0]] = null;
        } else {
            params[paramNameAndValArray[0]] = unescape(paramNameAndValArray[1]);
        }
    }
    return params;
}

function getRootPath(url) {
    let devflag = window.vp.config.URL.devflag;
    let realUrl = "";
    let urlType = "";
    let config = window.vp.config;  
    let arr = url.split("/");  
    let type = arr[1].substring(1, arr[1].length - 1); 
    urlType = config.SETTING[type];
    if (devflag) {       //开发模式            
        realUrl = config.URL.devMode.proxy[urlType];
        realUrl = realUrl + "/" + arr[2] + "/" + arr[3];
        if(arr.length==5) realUrl = realUrl + "/" + arr[4];
    } else {            //生产模式
        let gatWayUrl = window.vp.config.URL.localHost;
        realUrl = gatWayUrl + "/" + urlType + "/" + arr[2] + "/" + arr[3];
        if(arr.length==5) realUrl = realUrl + "/" + arr[4];
    }

    return realUrl;
}


function vpAjax(url, param, type, callback) {
    url = getRootPath(url);
    $.ajax({
        type: type || 'GET',
        url: url,
        headers: {
            Authorization: "Bearer " + window.vp.cookie.getToken(),
            Locale: 'zh_CN'
        },
        data: param || {},
        async: false, //false代表只有在等待ajax执行完毕后才执行,默认是true
        dataType: "json",
        success: function (rst, status, xhr) {
            console.log(rst);
            if (rst.data != undefined && jQuery.isFunction(callback)) {
                callback.call(this, rst.data);
            }
            // else {
            //     VpAlertMsg({ 
            //         message:"消息提示",
            //         description: rst.msg,
            //         type:"error",
            //         onClose:this.onClose,
            //         closeText:"关闭",
            //         showIcon: true
            //     }, 5) ; 
            // }
        },
        complete: function (xhr, status) {
        },
        error: function (xhr, status, res) {
            try {
                var data = eval('[' + xhr.responseText + ']')[0];
                var smsg = "";
                if (data.infocode == undefined) {
                    smsg = data.exception;
                }
                else {
                    smsg = data.infocode + "：" + data.msg;
                }
                VpAlertMsg({
                    message: "消息提示",
                    description: smsg,
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
            }
            catch (e) {
                VpAlertMsg({
                    message: "消息提示",
                    description: "无法解析的错误信息",
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
            }
        }
    });
}

export const vpPostAjax = function (url, param, type, callback) {
    vpAjax(url, param, type, callback);
}

export const vpPostAjax2 = function (url, param, type, callback) {
    url = getRootPath(url);
    $.ajax({
        type: type || 'GET',
        url: url,
        headers: {
            Authorization: "Bearer " + window.vp.cookie.getToken(),
            Locale: 'zh_CN'
        },
        data: param || {},
        async: false, //false代表只有在等待ajax执行完毕后才执行,默认是true
        dataType: "json",
        success: function (rst, status, xhr) {
            console.log(rst);
            if (rst.data != undefined && jQuery.isFunction(callback)) {
                callback.call(this, rst);
            }
            // else {
            //     VpAlertMsg({ 
            //         message:"消息提示",
            //         description: rst.msg,
            //         type:"error",
            //         onClose:this.onClose,
            //         closeText:"关闭",
            //         showIcon: true
            //     }, 5) ; 
            // }
        },
        complete: function (xhr, status) {
        },
        error: function (xhr, status, res) {
            try {
                var data = eval('[' + xhr.responseText + ']')[0];
                var smsg = "";
                if (data.infocode == undefined) {
                    smsg = data.exception;
                }
                else {
                    smsg = data.infocode + "：" + data.msg;
                }
                VpAlertMsg({
                    message: "消息提示",
                    description: smsg,
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
            }
            catch (e) {
                VpAlertMsg({
                    message: "消息提示",
                    description: "无法解析的错误信息",
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5);
            }
        }
    });
}

/**
 * 如果页面是从菜单入口进入的，调用此方法将菜单菜单转入
 * 将菜单中传进来的参数变成props传入到pageClass中去
 * @param pageClass
 */
export const menuEntryWrap = (PageClass) => {
    return (props)=>{
        let defaultFilter = {};
        if(props.location.state && props.location.state.param){
            let urlparam = props.location.state.param;
            defaultFilter = {
                filtervalue : urlparam.filter,
                currentkey : urlparam.currentkey
            }
        }
        return (
            <PageClass
                {...props}
                {...props.params}
                {...defaultFilter}
            />
        )
    }
}