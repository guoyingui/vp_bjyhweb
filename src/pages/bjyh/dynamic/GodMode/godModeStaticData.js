/*
 * @Author: sl.
 * @Date: 2020-07-14 15:05:57
 * @LastEditTime: 2020-08-07 11:13:13
 * @Description: 流程修改列表表头
 * @FilePath: \bjyhweb\src\pages\bjyh\dynamic\GodMode\Headers.js
 */
export const godModeStaticData = {
    godMode_headers: [
        {
            title: '对象名称',
            dataIndex: 'objectname',
            key: 'objectname',
            width: 320,
            fixed: ''
        },
        {
            title: '流程名称',
            dataIndex: 'sflowname',
            key: 'sflowname',
            width: 120,
            fixed: ''
        },
        {
            title: '发起人',
            dataIndex: 'fqr',
            key: 'fqr',
            width: 120,
            fixed: ''
        },
        {
            title: '流程开始时间',
            dataIndex: 'flowstarttime',
            key: 'flowstarttime',
            width: 120,
            fixed: ''
        },
        {
            title: '流程结束时间',
            dataIndex: 'flowstartend',
            key: 'flowstartend',
            width: 120,
            fixed: ''
        },
        {
            title: '当前步骤',
            dataIndex: 'dangqianbuzhouming',
            key: 'dangqianbuzhouming',
            width: 120,
            fixed: ''
        },
        {
            title: '当前处理人',
            dataIndex: 'dangqianchuliren',
            key: 'dangqianchuliren',
            width: 120,
            fixed: ''
        }
    ],

    godModeGroupInfo: {
        "group_label": "步骤信息",
        "group_type": 1,
        "group_code": "00",
        "fields": [{
            "field_name": "godMode_handler",
            "widget_type": "selectmodel",
            "iconstraint": 2,
            "iid": 155,
            "iwidth": 0,
            "url": "vfm/ChooseEntity/ChooseEntity",
            "urlparam": "",
            "widget": {
                "load_template": [],
                "default_value": "",
                "default_label": ""
            },
            "field_label": "处理人",
            "all_line": 2,
            "irelationentityid": 2,
            "readonly": true,
            "disabled": true
        }, {
            "field_name": "godMode_startTime",
            "widget_type": "text",
            "iconstraint": 0,
            "iwidth": 0,
            "widget": {
                "load_template": [],
                "default_value": "2020-03-14"
            },
            "field_label": "到达时间",
            "all_line": 2,
            "irelationentityid": 0,
            "validator": {
                "message": "必填项不能为空!",
                "required": true
            },
        }, {
            "field_name": "godMode_endTime",
            "widget_type": "text",
            "iconstraint": 0,
            "iwidth": 0,
            "widget": {
                "load_template": [],
                "default_value": "2020-05-05"
            },
            "field_label": "处理时间",
            "all_line": 2,
            "irelationentityid": 0,
            "validator": {
                "message": "必填项不能为空!",
                "required": true
            },
        },
        ]
    },
}
/**
 * @description: 表单数据污染
 * @param {type} 
 */
export const polluteFormData = form => {
    const fileOptions = {
        delete: true,
        download: true,
        edit: false,
        preview: false,
        update: false,
    }
    const fileFieldNames = []
    form.groups.map(group => {
        group.fields.map(field => {
            //附件字段类型参数配置
            if (field.widget_type === 'upload') {
                field.godMode = true
                field.widget.load_template.map(file => {
                    file.options = fileOptions
                })
                fileFieldNames.push(field.field_name)
            }
        })
    })
    return fileFieldNames
}

// export default godModeStaticData;