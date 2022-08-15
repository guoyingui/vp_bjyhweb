/*
 * author jiangsw
 * date 2017-12-16
 */
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
			enable: true
		}
	}
};
/**
 * 自定义DOM节点
 */
function addDiyDom(treeId, treeNode) {
	var spaceWidth = 15;
	var liObj = $("#" + treeNode.tId);
	var aObj = $("#" + treeNode.tId + "_a");
	var switchObj = $("#" + treeNode.tId + "_switch");
	var icoObj = $("#" + treeNode.tId + "_ico");
	var spanObj = $("#" + treeNode.tId + "_span");
	var spanObjText = $("#" + treeNode.tId + "_span").text();

	aObj.attr('title', '');
	aObj.append('<div class="divTd swich fnt" style="width:100%"></div>');
	var div = $(liObj).find('div').eq(0);
	//从默认的位置移除
	switchObj.remove();
	spanObj.remove();
	icoObj.remove();
	//在指定的div中添加
	div.append(switchObj);
	div.append(spanObj);
	//隐藏了层次的span
	var spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
	switchObj.before(spaceStr);
	switchObj.after(icoObj);
}

//初始化列表
function queryHandler(zTreeNodes) {
	//初始化树
	$.fn.zTree.init($("#dataTree"), setting, zTreeNodes);
	//添加表头
	var rows = $("#dataTree").find('li');
	if (!rows.length > 0) {
		$("#dataTree").append('<li ><div style="text-align: center;line-height: 30px;" >无符合条件数据</div></li>')
	}
}
function formatHtml(treeNode) {
	var htmlStr = '';
	htmlStr += '<i class="fa fa-edit fa-fw text-success" onclick="doEdit(\'' + treeNode.tId + '\',\'' + treeNode.id + '\')"  data-toggle="tooltip" title="编辑"></i>';
	htmlStr += '<i class="fa fa-times fa-fw text-danger" onclick="doDelete(\'' + treeNode.tId + '\',\'' + treeNode.id + '\')"  data-toggle="tooltip" title="删除"></i>';
	return htmlStr;
}
function opt(treeNode) {
	var htmlStr = '';
	htmlStr += '<i class="fa fa-copy fa-fw text-success" onclick="doDelete(\'' + treeNode.tId + '\',\'' + treeNode.id + '\')"  data-toggle="tooltip" title="复制"></i>';
	htmlStr += '<i class="fa fa-times fa-fw text-danger" onclick="doDelete(\'' + treeNode.tId + '\',\'' + treeNode.id + '\')"  data-toggle="tooltip" title="删除"></i>';
	htmlStr += '<i class="fa fa-toggle-on fa-fw text-success" onclick="doDelete(\'' + treeNode.tId + '\',\'' + treeNode.id + '\')"  data-toggle="tooltip" title="是否启用"></i>';
	return htmlStr;
}

function doEdit(treeNode){
	alert(treeNode)
}

function doDelete(treeNode){
	alert(treeNode)
}