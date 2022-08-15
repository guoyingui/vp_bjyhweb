//选中节点高亮显示css
Array.prototype.contain = function (c) {
    var i = 0;
    for (; i < this.length && this[i] != c; i++) ;
    return (i == this.length) ? false : true;
}

function getFontCss(treeId, treeNode) {
	return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};  
}
/**
 *使用搜索数据 加高亮显示功能，需要2步  
 *1.在tree的setting 的view 设置里面加上 fontCss: getFontCss 设置  
 *2.在ztree容器上方，添加一个文本框，并添加onkeyup事件，该事件调用固定方法  changeColor(id,key,value)
  *id指ztree容器的id，一般为ul，key是指按ztree节点的数据的哪个属性为条件来过滤,value是指过滤条件，该过滤为模糊过滤  
**/
var lastValue = "", nodeList = [], allParentIds = [], fontCss = {};
var preParentIds = [];
//去除重复ID的方法
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}
//定位方法
function changeColor(zTree,key,values,reQuery) {
    var value = $.trim(values);
    if(reQuery)
    	lastValue = '';
    if (lastValue === value)
    	return;
    lastValue = value;
    if (value == "" ) {
        revertNodes(false,zTree);
        lastValue = "";
        zTree.expandAll(false);
        allParentIds = [];
        return;
    }
    allParentIds = [];
    nodeList = zTree.getNodesByParamFuzzy("name", value);
    for (var i = 0; i < nodeList.length; i++) {
        if (nodeList[i].level ==0) {
        	allParentIds.push(nodeList[i].tid);
        } else {
        	allParentIds.push(nodeList[i].tid);
        	getParentNodes_ztree(allParentIds,nodeList[i]);
        }
    }
    allParentIds = unique(allParentIds);
    if(preParentIds.length >0){
        //排除需要打开的
        revertNodes(false,zTree);
    }
    updateNodes(true,zTree,nodeList,allParentIds);
    preParentIds = allParentIds;
}

function getParentNodes_ztree(allParentIds, node){
	var parentNode = node.getParentNode();
	if (parentNode != null) {
        allParentIds.push(node.tid)
        getParentNodes_ztree(allParentIds, parentNode);
    }else{
    	allParentIds.push(node.tid);
    }
}

function updateNodes(highlight,zTree,nodeList) {
    for (var i = 0; i < nodeList.length; i++) {
        var node = nodeList[i];
        if (node) {
            if (node.name.indexOf($.trim(lastValue)) != -1 || highlight == false) {
                node.highlight = highlight;
            }
            zTree.updateNode(node);
           var expand =  zTree.expandNode(node, true, false);
           if(expand == null){
               zTree.expandNode(node.getParentNode(), true, false);
           }
        }
    }
}

function revertNodes(highlight,zTree) {
    for (var i = 0; i < preParentIds.length; i++) {
            var node = zTree.getNodeByParam("tid", preParentIds[i], null);
            if (node) {
                if (node.name.indexOf($.trim(lastValue)) != -1 || highlight == false) {
                    node.highlight = highlight;
                }
                zTree.updateNode(node);
                if(!allParentIds.contain(preParentIds[i])){
                    zTree.expandNode(node, highlight, false);
                }


        }
    }
}
