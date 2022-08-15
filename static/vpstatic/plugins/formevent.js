
//poc 表单onload事件
function pjpoc(param) {
    var fields = param.value.form.groups[0].fields;
    var flag = false;
    var index = -1;
    for(var i=0;i<fields.length;i++){   
        if(fields[i].field_name=='iissub'&&fields[i].widget.default_value=='0'){ 
            flag = true;
        }
        if(fields[i].field_name=='rrelprj'){
            index = i;
        }
    }
    if(index!=-1&&flag){
        param.value.form.groups[0].fields[index].disabled = true;
    }
    return param.value;
}

function saveevent(param) {
    alert('onsave')
    return 1<2;
}

function onload(param){
    alert("onload")
    return param.value;
}

function flowload(param){
    top.window.branch='sflow_flag';
    return param.value;
}

function flowload1(param){
    top.window.branch='scode';
    return param.value;
}

/*
 * 产品平台7.4.1版本增加，实体表单发起流程提交分支条件到流程中  魏洋
 * 7.4.4修改，传递单值模式
 */
function setEntityFlowCondition(oparam){
	//流程时，将表单中代表分支条件值的字段存放在window里
	var fieldname = oparam["scon_fieldname"];
	var scondition = '';
	try
	{
		scondition = window.form.dynamic.getFieldValue(fieldname);
	}
	catch (e)
	{
		console.log('未在表单中找到属性'+fieldname);
	}
	
	top.window['scondition'] = scondition;
	return true;
}

/*
 * 产品平台7.4.4版本增加，实体表单发起流程提交分支条件到流程中  魏洋
 * 传递多条件属性值
 */
function setEntityFlowConditionJson(oparam){
	//流程时，将表单中代表分支条件值的字段存放在window里
	var fieldname = oparam["scon_fieldname"];
	var scondition = {};
	try
	{
		scondition[fieldname] = window.form.dynamic.getFieldValue(fieldname);
	}
	catch (e)
	{
		console.log('未在表单中找到属性'+fieldname);
	}
	
	top.window.scondition = scondition;
	return true;
}

/*
 * 产品平台7.4.1版本增加，工作流表单中条件分支提交到服务端  魏洋
 */
function setFlowCondition(oparam){
	//流程时，将表单中代表分支条件值的字段存放在window里
	
	return oparam.value;
}

//czccb by hgj. 判断子任务工时是否超过父任务工时
/*
function checkWorkTime(oparam){
	var flag = true;
	var formData = oparam.value;
	var iid = oparam.iid;
	var fworktime = formData.fworktime;
	//判断工时是否为非负整数
	var reg = /^[0-9]*[1-9][0-9]*$/;
	flag = reg.test(fworktime);
	if(!flag)
	alert("工时必须为非负整数");
	if(iid == ""){
		iid = -1;
	}
	var devflag = window.vp.config.URL.devflag;
	var realUrl = "";
	if(devflag){       //开发模式
		realUrl = window.vp.config.URL.devMode.proxy[vp.config.SETTING.vpczccb] + "/rw/querySumByIparent";
    }else{            //生产模式
        var gatWayUrl = window.vp.config.URL.localHost;
        realUrl = gatWayUrl + "/" + vp.config.SETTING.vpczccb + "/rw/querySumByIparent";
    }
	//父任务id
	var iparent = formData.iparent;
	if(iparent != ""  && typeof(iparent) != "undefined" && flag){   
		$.ajax({
			url: realUrl,
			data: {iparent:iparent,iid:iid},
			type:"GET",
			dataType:"json",
			async:false,
			// beforeSend:function(XMLHttpRequest){
			// 	XMLHttpRequest.setRequestHeader("Authorization",window.vp.cookie.getToken());
			// },
			headers: {
				Authorization: "Bearer "+ window.vp.cookie.getToken(),   
				// "Content-Type": "application/x-www-form-urlencoded"
			},
			success: function(data){
				debugger
				if(data.data.flag == true){
					var sum = data.data.sum;
					var parentSum = data.data.parentSum;
					if(parentSum < (sum + fworktime)){
						flag = false;
						alert("子任务工时总和不能大于父任务工时！");
					}
				}				
			}
		});
	
	}

	return flag;
}*/


