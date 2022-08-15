var cols = new Array(); 

/**
 * 配置zTree
 */
var setting = {
	view: {
		showLine: false,
		nameIsHTML: false,
		addDiyDom: addDiyDom,
	},
	data: {
		simpleData: {
			enable: true,
			idKey: "iid",
            pIdKey: "iparentid",
			rootPId:0
		}
	},
	callback: {
		onExpand: onExpand/* ,
		onClick: zTreeOnClick */
	}
};

//加载树表头及数据
function vptree(oparam){
	var li_head = '';	
	var data = new Array();

	vpPostAjax(oparam.vpurl, oparam.param, 'GET', function(rst) {
		cols = rst.headers;

		//初始化树数
		$("#"+oparam.el).children().remove();    
		var treeObj = $.fn.zTree.init($("#dataTree"), setting, data);
		var rows = $("#"+oparam.el).find('li');
		//加载表头
		var imgSpan = '编辑';
		li_head = '<li class="head"><a>'
				+ '	<div class="divTd" style="width:50px;min-width:50px;text-indent:5px;">ID<div class="drag-handle"></div></div>'
				+ '	<div class="divTd" style="width:80px;min-width:80px;">'+imgSpan+'<div class="drag-handle"></div></div>'
				+ '	<div class="divTd" style="width:200px;text-align:center;">任务<div class="drag-handle"></div></div>'
				+ '	<div class="divTd" style="width:120px;text-align:center;">标志<div class="drag-handle"></div></div>';

		$.each(cols, function(i, item) {//动态加载列
			if(item.fieldname=='sname'){
				
			}
			else{
				li_head +='	<div class="divTd" style="width:'+item.width+'px;">'
						+ '		'+item.displayname+'<div class="drag-handle"></div>'
						+ '	</div>';
			}
		});
		li_head += '</a></li>'
		if (rows.length > 0) {
			rows.eq(0).before(li_head);//添加表头
			// 这里是给每行里面的列添加索引方便操作
			rows.each(function(index, el) {
				$(this).find('.divTd').not('.fixTd_r').each(function(ind, els) {
					$(this).addClass('index_'+ind)
				});
			});
		} else {
			$("#"+oparam.el).append(li_head);//添加表头
			$("#"+oparam.el).append('<li ><div style="text-align: center;line-height: 30px;" >无符合条件数据</div></li>')
		}
		// 鼠标移到该元素上拖
		$('.drag-handle').each(function(index, el) {
			bindResize(index,el);
		});
		// 如果添加了固定列，列前一个要距离固定列的宽少1px
		if($('.fixTd_r').length > 0){
			var fixEle = $('.fixTd_r')
			//fixEle.prev('.divTd').css('margin-right', fixEle.outerWidth() - 1 +'px'); 
			fixEle.css('margin-right', '-10px'); 
		}
		expandAll(treeObj);//默认展开到一级树
	
    }); 
}

/**
 * 自定义DOM节点
 */
function addDiyDom(treeId, treeNode) {
	var liObj = $("#" + treeNode.tId);
	var aObj = $("#" + treeNode.tId + "_a");
	var switchObj = $("#" + treeNode.tId + "_switch");
	var icoObj = $("#" + treeNode.tId + "_ico");
	var spanObj = $("#" + treeNode.tId + "_span");
	var spanObjText = $("#" + treeNode.tId + "_span").text();
	var editStr = '';
	aObj.attr('title', '');
	var optHtml = '<div class="divTd" style="width:50px;min-width:50px;" >'
				+ '	' + treeNode.rownum + ' '
				+ '</div>';
	
	aObj.append(optHtml);
	var imgHtml = '';
	if(treeNode.acutalenddate!=''){//编辑
		imgHtml += '<a id="taskEdit"  onclick="openeditWin(\''+ treeNode.taskid +'\',\''+ treeNode.name +'\',\'' + urlParams.projectID +'\')"><i class="fa fa-edit fa-fw text-success"></i></a>';
	}else{
		imgHtml += '<a id="taskEdit"  onclick="openeditWin(\''+ treeNode.taskid +'\',\''+ treeNode.name +'\',\'' + urlParams.projectID +'\')"><i class="fa fa-edit fa-fw text-success"></i></a>';
	}
	
	aObj.append('<div class="divTd" style="width:80px;min-width:80px;text-align:center;">'+imgHtml+'</div>');
	aObj.append('<div class="divTd swich fnt" style="width:200px;text-align:center;"></div>');
	
	
    var aObj2 = $("#" + treeNode.tId + "_a");
	var imgHtml2 = '';
	if("0"==treeNode.flag1){//标志
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_wks.gif\" title=\"未开始\"/>&nbsp;";
	}else if("1"==treeNode.flag1){
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_jxz.gif\" title=\"进行中\"/>&nbsp;";
	}else if(undefined==treeNode.flag1){
		
	}else {
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_ywc.gif\" title=\"已完成\"/>&nbsp;";
	}
	if("0"==treeNode.flag2){//指示灯
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_green.gif\" title=\"进度正常\"/>&nbsp;";
	}else if("1"==treeNode.flag2){
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_yellow.gif\" title=\"进度警告\"/>&nbsp;";
	}else if(undefined==treeNode.flag2){
		
	}else{
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_red.gif\" title=\"进度延迟\"/>&nbsp;";
	}
	if("0"==treeNode.flag3){//文档
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_word_no.gif\" title=\"无文档\"/>&nbsp;";
	}else if(undefined==treeNode.flag3){
		
	}else{
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_word_yes.gif\" title=\"有文档\"/>&nbsp;";
	}
	var workstatname="无评论消息";
	if("0"==treeNode.flag4){
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_successful.gif\"  title=\""+workstatname+"\"/>";
	}else if("1"==treeNode.flag4){
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_trouble.gif\" title=\""+workstatname+"\"/>";
	}else if(undefined==treeNode.flag4){
		
	}else{
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_problem.gif\" title=\""+workstatname+"\"/>";
	}
	if("0"==treeNode.flag5){
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_cjyes.gif\" title=\"可裁剪\"/>";
	}else if(undefined==treeNode.flag5){
		
	}else{
		imgHtml2 += "<img src=\"/project/images/wbstask/icon_cjno.gif\" title=\"不可裁剪\"/>";
	}
	aObj.append('<div class="divTd" style="width:120px;text-align:center;">'+imgHtml2+'</div>');
	
	
	var div = $(liObj).find('div').eq(2);
	//从默认的位置移除
	switchObj.remove();
	spanObj.remove();
	icoObj.remove();
	//在指定的div中添加
	div.append(switchObj);
	div.append(spanObj);
	
	
	//隐藏了层次的span
	var levelSpace = 0;
	var spaceWidth = 25;
	if(treeNode.level!=0 && treeNode.level!=1){
		levelSpace = (spaceWidth - 10) * treeNode.level * 1.5;
	}else{
		levelSpace = spaceWidth * treeNode.level;
	}  
	var spaceStr = "<span style='height:1px;display: inline-block;width:" + levelSpace + "px'></span>";
	switchObj.before(spaceStr);
	switchObj.after(icoObj);
	$.each(cols, function(i, item) {//动态加载列
		var fieldname = item.fieldname;
		var colwidth = parseFloat(item.width);
		if(fieldname=='taskname'){
			
		}else if(item.fieldname=='flags'){
			
		}else{
			editStr +='<div class="divTd" style="width:'+colwidth+'px;" >'
					+ '	<a onclick="openDetail(this);" projectID="' + urlParams.projectID + '" milestoneortask="" taskname="' + treeNode.name + '" taskid="' + treeNode.taskid + '" objectid="'+treeNode.objectid+'">' + treeNode[fieldname] +'</a>'
					+ '</div>';
		}
	});
	aObj.append(editStr);
}

function itemOver(event){
	var obj = event;
	if(!obj.status || !obj.status=="clicked"){
		obj.src = "/project/vframe/images/other/icon_openhover.gif";
	} 
}
function itemOut(event){
	var obj = event;
	if(!obj.status || !obj.status=="clicked"){
		obj.src = "/project/vframe/images/other/icon_openlink.gif";
	} 
}

//刷新按钮
$("#refresh").on('click',function(event) {
	initTaskTree();
});

//高层计划转任务计划
$("#changeToTask").on('click',function(event) {
	var url="/project/wbs/matrix/copyTaskAction.do?projectID="+ urlParams.projectID + "&flag=1";
	Common.sendFormData(url,undefined,function(res){
		if(res == "success"){
			Common.showMessage("转成任务计划成功");
			initTaskTree();
		}else{
			Common.showMessage("转成任务计划失败："+res);
		}
		return;
	},new Object());
});

//导出Excel按钮
$("#export").on('click',function(event) {
	//console.log("urlParams:" + JSON.stringify(urlParams));
	var urll = "/project/wbs/task/getExportTaskPlanTrackViewAction.do?objectID=31&rwflag2=2&projectID="+ urlParams.projectID + "&projectName=&taskID=&searchByFilterid=4&showDepth=1";
	Common.sendFormData(urll,undefined,function(res){
		if(res.success){
			var name = encodeURIComponent(encodeURIComponent(res.fileName));
			$("#downloadFrame").attr("src", baseurl + '?method=downloadExcel&fileName=' + name);
		}else{
			Common.showMessage("导出失败\n" + res.errMessage);
		}
	},new Object());
});

//导出MSP按钮
$("#exportMSP").on('click',function(event) {
	ow('/project/wbs/task/export4Project.jsp?projectID=' + urlParams.projectID + '&taskID=');
});

function ow(url){
	if('workitem1033'=='<%=fromPage%>'){
		parent.dialog.openQuery('导出WBS', url);
	}else{
		parent.dialog.openQuery('导出WBS', url);
	}
}

//展开树
function expandAll(tree){
    //获取 zTree 的全部节点数据将节点数据转换为简单 Array 格式
    var nodes = tree.transformToArray(tree.getNodes());
    for(var i=0;i<nodes.length;i++){
        if(nodes[i].level == 0){
            //根节点展开
            tree.expandNode(nodes[i],true,true,false);
            onExpand('','',nodes[i]);
        }else{
            tree.expandNode(nodes[i],false,true,false);
            onExpand('','',nodes[i]);
        }
    }
}

// 展开回调
function onExpand(event, treeId, treeNode) {
	var oLis = $("#"+treeNode.tId+"_ul").find('li');
	var oAs = $("#"+treeNode.tId+"_a").find('.divTd').not('.fixTd_r');
	// 这里是给每行里面的列添加索引方便操作
	var pArr = [];
	oAs.each(function(index, el) {
		pArr.push($(this).outerWidth())
	});
	oLis.each(function(index, el) {
		var cArr = [];
		var _this = $(this);
		$(this).find('.divTd').not('.fixTd_r').each(function(indx, els) {
			$(this).addClass('index_'+indx)
			cArr.push($(this).outerWidth())
			// 如果父级宽度变了新展开的子级也要变
			for(var i=0;i<pArr.length;i++){
				if(cArr[i]!==pArr[i]){
					_this.find('.divTd').not('.fixTd_r').eq(i).css('width', pArr[i] + 'px')
				}
			}
		});
	});
};

// 给头部插入拖动列宽功能
function bindResize(index,el) {
	//获取要改变宽的元素
	var els = $(el).closest('.divTd')[0];
	var oldW = $(els).outerWidth();
	index = index ? index : 0 ;
	//鼠标的 X 和 Y 轴坐标
	x = 0;
	//鼠标按下事件
	$(el).mousedown(function(e) {
		//按下元素后，计算当前鼠标与对象计算后的坐标
		x = e.clientX - $(els).outerWidth();
		//支持 setCapture,此方法是IE特有
		el.setCapture ? (
			//捕捉焦点
			el.setCapture(),
			//设置事件
			el.onmousemove = function(ev) {
				mouseMove(ev || event);
			},
			el.onmouseup = mouseUp
		) : (
			//绑定事件
			$(document).on("mousemove",mouseMove).on("mouseup", mouseUp)
		);
		//防止默认事件发生
		e.preventDefault();
		
	});
	//移动事件
	function mouseMove(e) {
		//动态赋值元素宽度
		var l = e.clientX - x;
		if(l>oldW){
			$(els).css('width', (l) + 'px');
			$('.index_'+index).css('width', l + 'px');
		}else{
			$(els).css('width', (oldW) + 'px');
			$('.index_'+index).css('width', oldW + 'px');
		}
	}
	//停止事件
	function mouseUp() {
		//支持 releaseCapture
		el.releaseCapture ? (
			//释放焦点
			el.releaseCapture(),
			//移除事件
			el.onmousemove = el.onmouseup = null
		) : (
			//卸载事件
			$(document).off("mousemove", mouseMove).off("mouseup", mouseUp)
		);
	}
}

// 点击其他位置关闭滑出层
$(document).on('click', function(event) {
	event.preventDefault();
	var et = $(event.target);
	// 关闭浮出的菜单
	if(et.hasClass('dropdownDiv') || et.closest('.dropdownDiv').hasClass('dropdownDiv')){

	}else{
		$('.divSert').remove()
	}
});

