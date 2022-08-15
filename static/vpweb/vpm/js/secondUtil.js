// 更多项目动态
function doMoreDic() {
	parent.location = "/project/titleAction.do?titleText=项目动态&titleIcon=/project/vframe/images/title/position_work.gif&url=/project/vocation/pjdynamic/SearchPjdynamicAction.do?submitFlag=toDynamicLi";
}

// 更多流程
function doMoreFlow() {
	parent.location = "/project/titleAction.do?titleText=待处理的流程&titleIcon=/project/vframe/images/title/position_work.gif&url=/project/mywork/getMyFlagToolbarAction.do?objectType=412";
}
//费用报销表单里根据项目ID初始化费用明细的成本科目
function refrashBXMX(){
	var ppid = $("#projectid").attr("hidid");
	if(ppid=='{#hidID}'){
		ppid = $("#relProjectID").attr("value");
	}
	var workItemidd = document.getElementById("workItemID").value;
	var mentityinstid = document.getElementById("mentityinstid").value;
	document.getElementById("frmItems").src = "/project/vocation/cost/feePay.jsp?mainEntityID=2024&mainEntityInstanseID="+mentityinstid+"&allowRelated=1&fromType=relation&fromPage=flow&limit=50&loadextramenu=1&objectID=2024&start=1&iid="+workItemidd+"&rtype=1&display=1&workItemID="+workItemidd+"&eid=2024&displayflag=2&objectID=2024&workItemID="+workItemidd+"&projectID="+ppid;
}
//费用报销表单里根据项目ID初始化费用明细的成本科目
function refrashFlowBXMX(){
	var ppid = $("#projectid").attr("hidid");
	document.getElementById("frame_m_mx").src = document.getElementById("frame_m_mx").src+"&projectID="+ppid;
}

function doLoadVersion() {
	if ($("#bbjh").attr("hidid") != '' && $("#bbjh").attr("hidid") != '0') {
		var url="/project/system/tools/genValueBySql.jsp?sql=select to_char(a.m_xqfx,'yyyy-MM-dd')||'~'||to_char(a.m_kfrq,'yyyy-MM-dd')||'~'||to_char(a.m_csrq,'yyyy-MM-dd')||'~'||to_char(a.m_tcrq,'yyyy-MM-dd') srtn from workitem_1660_field a where a.itemid="+$("#bbjh").attr("hidid");
		$.get(url,null,function(data) {
			var rtndata = data.trim().split("~");
			try {
				$("#m_xqrq").val(rtndata[0]);
				$("#m_kfrq").val(rtndata[1]);
				$("#m_csrq").val(rtndata[2]);
				$("#m_tcrq").val(rtndata[3]);
				//alert(rtndata);
				//$("#departmentid").attr("hidID", rtndata[0]);
			}
			catch (e)
			{ }
		});
	}
}

function doLoadRisk() {
	var url="/project/system/tools/genValueBySql.jsp?sql=select name||'~'||pri||'~'||m_fxyx||'~'||m_knx||'~'||m_sjkj||'~'||m_hg||'~'||m_gjz from workitem_1661 a left outer join workitem_1661_field b on a.id=b.itemid where a.id="+$("#fxk").attr("hidid");
	$.get(url,null,function(data) {
		var rtndata = data.trim().split("~");
		try {
			$("#name").val(rtndata[0]);
			$("#pri option[value='"+rtndata[1]+"']").attr("selected", "selected");
			$("#probability option[value='"+rtndata[3]+"']").attr("selected", "selected");
			$("#timeframework option[value='"+rtndata[4]+"']").attr("selected", "selected");
			$("#aftereffect option[value='"+rtndata[5]+"']").attr("selected", "selected");
			$("#m_gjz").val(rtndata[6]);
			setEffectValue();
		}
		catch (e)
		{ }
	});
}

function calDiffDay() {		
	var sbegin = $("#planstartdate").val(); // "2016-06-01";
	if (sbegin == '') {
		$("#m_gq").val(0);
		$("#planworktime").val(0);
		return false;
	}
	var send = $("#planfinishdate").val(); // "2016-06-30";
	if (send == '') {
		$("#m_gq").val(0);
		$("#planworktime").val(0);
		return false;
	}
	var dbegin = new Date(sbegin.replace(/-/g, "/"));
	var dend = new Date(send.replace(/-/g, "/"));
	var itmp = (dend-dbegin)/(1000*60*60*24)+1; // 自然日期相差数
	var iweek = 0;
	var dtmp;
	for (var i = 0; i<itmp; i++) {
		dtmp = new Date(dbegin.getFullYear(),dbegin.getMonth(),dbegin.getDate()+i);
		var day = dtmp.getDay();
		if (day == 0 || day ==6 ) {
			iweek++;
		}
	}

	var url = "/project/system/tools/genValueBySql.jsp?sql=select sum(case when workflag=1 then 1 else 0 end)||'~'||sum(case when workflag=0 then 1 else 0 end) icount from wbs_calendar where projectid=-1 and delflag=0 and caldate between to_date('"+sbegin+"', 'yyyy-MM-dd') and to_date('"+send+"', 'yyyy-MM-dd')";
	$.get(url,null,function(data) {
		var rtndata = data.trim().split("~");
		try {		
			// alert(itmp-iweek+parseInt(rtndata[0])-parseInt(rtndata[1]));
			if (rtndata[0] == '') {
				$("#m_gq").val(itmp-iweek);
			}
			else {
				$("#m_gq").val(itmp-iweek+parseInt(rtndata[0])-parseInt(rtndata[1]));
			}
			calTime();
		}
		catch (e)
		{ }
	});
}

function calTime() {
	var suerid = $("#m_cyr").attr("hidid");
	var assignto = $("#assignto").attr("hidid");
	var ss = suerid.split(",");
	var ilen = ss.length;
	var bl = false;
	for (var i=0; i<ilen; i++) {
		if (assignto == ss[i]) {
			bl = true;
			break;
		}
	}
	if (!bl && suerid != '') {
		ilen++;
	}
	var url = "/project/system/tools/genValueBySql.jsp?sql=select hoursofday||'~'||hourofweek hh from cfg_system a";
	$.get(url,null,function(data) {
		var rtndata = data.trim().split("~");
		try {
			$("#planworktime").val(ilen*parseFloat(rtndata[0])*parseInt($("#m_gq").val()));
		}
		catch (e)
		{ }
	});
}