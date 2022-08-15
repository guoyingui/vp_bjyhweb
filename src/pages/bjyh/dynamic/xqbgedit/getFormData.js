/*
 * @Author: sl.
 * @Date: 2020-07-14 15:05:57
 * @LastEditTime: 2020-08-07 11:13:13
 * @Description: 流程修改列表表头
 * @FilePath: \bjyhweb\src\pages\bjyh\dynamic\GodMode\Headers.js
 */
export const data = {
    "form": {
        "groups": [{
            "group_label": "用例明细",
            "group_type": 0,
            "fields": [{
                "field_name": "project_apply_code",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": true,
                "field_label": "项目申请编号",
                "all_line": 1
            }, {
                "field_name": "project_code",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": false,
                "field_label": "项目编号",
                "all_line": 1
            },{
                "field_name": "project_name",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": true,
                "field_label": "项目名称",
                "all_line":1
            },{
                "field_name": "case_code",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": false,
                "field_label": "用例编号",
                "all_line": 1
            },{
                "field_name": "case_name",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": false,
                "field_label": "用例名称",
                "all_line": 1
            },{
                "field_name": "task_id",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": false,
                "field_label": "任务编号",
                "all_line": 1
            },{
                "field_name": "task_name",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": false,
                "field_label": "任务名称",
                "all_line": 1
            },{
                "field_name": "case_type",
                "widget_type": "select",
                "widget": {
                    "load_template": [{
                        "value": 0,
                        "label": "业务服务类"
                    },{
                        "value": 1,
                        "label": "产品配置类"
                    },{
                        "value": 2,
                        "label": "交互式视觉类"
                    },{
                        "value": 3,
                        "label": "接口API"
                    },{
                        "value": 4,
                        "label": "参数化维护与数据补录类"
                    },{
                        "value": 5,
                        "label": "查询报表类"
                    }],
                    "default_value": "0",
                    "default_label": "0"
                },
                "readonly": false,
                "field_label": "用例类型",
                "all_line": 1
            },{
                "field_name": "rel_system",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "field_label": "涉及系统",
                "all_line": 1,
                "disabled": false
            },{
                "field_name": "case_status",
                "widget_type": "radio",
                "widget": {
                    "load_template": [{
                        "value": 0,
                        "label": "新增"
                    }, {
                        "value": 1,
                        "label": "已投产"
                    }],
                    "default_value": "0",
                    "default_label": "0"
                },
                "readonly": false,
                "field_label": "用例状态",
                "all_line": 1
            },{
                "field_name": "user_code",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": false,
                "field_label": "创建人",
                "all_line": 1
            },{
                "field_name": "case_des",
                "widget_type": "textarea",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": false,
                "field_label": "用例简要概述",
                "all_line": 2
            },{
                "field_name": "file_id",
                "widget_type": "upload",
                "widget": {
                    "upload_url":"http://baidu.com",
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": false,
                "field_label": "用例附件",
                "all_line": 2
            }]
        }]
    },"godModeGroupInfo": {
        "groups": [{
            "group_label": "附件明细",
            "group_type": 0,
            "fields": [{
                "field_name": "project_apply_code",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": true,
                "field_label": "项目申请编号",
                "all_line": 1
            }, {
                "field_name": "project_code",
                "widget_type": "text",
                "widget": {
                    "default_value": "",
                    "default_label": ""
                },
                "readonly": false,
                "field_label": "项目编号",
                "all_line": 1
            },{
                "field_name": "file_id",
                "widget_type": "upload",
                "widget": {
                    "upload_url":"/{bjyh}/jgps/queryfj",
                    "default_value": "",
                    "default_label": ""

                },
                "readonly": false,
                "field_label": "用例附件",
                "all_line": 2
            }]
        }]
    }

}




// export default godModeStaticData;