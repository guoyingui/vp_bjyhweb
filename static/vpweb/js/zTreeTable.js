/*
 * author vpsoft
 * date 2017-12-16
 */
/**
 * 配置zTree
 */
var cols = new Array();
var clicks = new Array();

var setting = {
	view: {
		showLine: false,
		nameIsHTML: false,
		addDiyDom: addDiyDom,
	},
	data: {
		simpleData: {
			enable: true,
			idKey: "id",
            pIdKey: "parentid",
			rootPId:0
		}
	},
	callback: {
		onExpand: onExpand,
		onClick: zTreeOnClick
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
	var entityID="-1";
	if(treeNode['entityid']!=undefined){
		entityID=treeNode['entityid'];
	}
	aObj.attr('title', '');
	// 名称前的图标样式
	switch (entityID)
	{
		case '2031':
			$('<i class="fa fa-file-text-o"></i>').prependTo(spanObj);
		break;
		case '2634':
			$('<i class="fa fa-cubes"></i>').prependTo(spanObj);
		break;
		default:
	}
	// 隐藏了层次的span
	var spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";

	var editStr = '';
	var namecos = 0;
	$.each(cols, function(i, item) {//动态加载列
		if(item.title=='指示灯' || item.field=='indicator'){
			var vl_ = treeNode[item.field].split("_");
			var dsv_ = "";
			for (var i=0; i<vl_.length; i++) {				
				if (vl_[i] == 2) { dsv_ += "<i class=\'treeIcon label-danger\'></i>" ; }
				else if (vl_[i] == 1) { dsv_ += "<i class=\'treeIcon label-warning\'></i>" ; } 
				else { dsv_ += "<i class=\'treeIcon label-info\'></i>" ; }
			}
			editStr += '<div class="divTd" style="width: '+item.width+'px;">' + dsv_+ '</div>';
		}
		else if (item.field=="sonoff") { // 状态开启和关闭列
			var dsv_ = treeNode[item.field];
			var dstitle_ = '';
			if (dsv_ == 'on') {
				dstitle_ = "开启";
				dsv_ = 'fa fa-toggle-on fa-fw text-success';
			}
			else {
				dstitle_ = "关闭";
				dsv_ = 'fa fa-toggle-off fa-fw text-fail';
			}
			editStr += '<div class="divTd" style="width: '+item.width+'px;"><i class="'+dsv_+'" onclick="toggleState(this)" data-toggle="tooltip" data-placement="right" title="" data-original-title="'+dstitle_+'" style="margin-right: 20px;"></i>  </div>';
		}
		else if((entityID=="1" && item.field=='projectname') || item.field=='name'){
			editStr += '<div class="divTd swich fnt" style="width:'+item.width+'px;text-align:left;"></div>';
			namecos = i;
		}
		else{
		   editStr += '<div class="divTd" style="width: '+item.width+'px;">' + treeNode[item.field] + '</div>';
		}
	}); 
	// 操作列
	// editStr += '<div class="divTd fixTd_r" style="width:100px;">' + opt(treeNode) + '</div>';
		
	aObj.append(editStr);
	var div = $(liObj).find('div').eq(namecos);

	//从默认的位置移除
	switchObj.remove();
	spanObj.remove();
	icoObj.remove();
	//在指定的div中添加
	div.append(switchObj);
	div.append(spanObj);
	
	//隐藏了层次的span
	var levelSpace = 0;
	var spaceWidth = 15;
	if(treeNode.level!=0&&treeNode.level!=1){
		levelSpace = (spaceWidth - 10) * treeNode.level * 1.5;
	}else{
		levelSpace = spaceWidth * treeNode.level;
	}  
	var spaceStr = "<span style='height:1px;display: inline-block;width:" + levelSpace + "px'></span>";
	switchObj.before(spaceStr);
	switchObj.after(icoObj);
}

// 捕获节点被点击的事件回调函数
function zTreeOnClick(event, treeId, treeNode){
	var treeObj = $.fn.zTree.getZTreeObj("dataTree");
	formview(treeNode);
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

function opt(treeNode) {
	var htmlStr = '';
	
	htmlStr += '<i class="fa fa-edit fa-fw text-success" onclick="doEdit(\'' + treeNode.entityid + '\',\'' + treeNode.entityname + '\',\'' + treeNode.id + '\',\'' + treeNode.name + '\')"  data-toggle="tooltip" title="编辑"></i>';
	htmlStr += '<i class="fa fa-times fa-fw text-danger" onclick="doDelete(\'' + treeNode.entityid + '\',\'' + treeNode.id + '\')"  data-toggle="tooltip" title="删除"></i>';
	//htmlStr += '<i class="fa fa-copy fa-fw text-success" onclick="doDelete(\'' + treeNode.tId + '\',\'' + treeNode.id + '\')"  data-toggle="tooltip" title="复制"></i>';
	return htmlStr;
}

// 操作列是否开启
function operation(objentityid,objectid,clicktype){
	if(true){
		var htmlStr = '';
            htmlStr += '<div class="dropdownDiv"><i onclick="openNav(\'' + objentityid + '\',\''+objectid+'\',\''+clicktype+'\')" class="fa fa-toggle-down text-success"></i></div>';
	}else{
		htmlStr = '-'
	}
	return htmlStr;
}
function openNav(objentityid,objectid,clicktype){

	var targetParent = $(event.target).closest('.divTd');
	var offsetTop = 10 + targetParent.offset().top - $('.ztree').offset().top + targetParent.outerHeight()/2;
	var offsetLeft = 10 + targetParent.offset().left - $('.ztree').offset().left + targetParent.outerWidth()/2;
	var htmlStr = '';
		htmlStr += '<div class="animated fadeInRight divSert" style="left:'+ offsetLeft +'px;top:'+ offsetTop +'px">';
        htmlStr += '<ul class="padding-10 vp-radius">';
        $.each(clicks, function(i, item) {//动态加载列
        	if(clicktype==item.type){
        		htmlStr += '<li><a id="'+item.id+'" onclick="doEvent(\'' + objentityid + '\',\''+objectid+'\',\''+clicktype+'\',\''+item.id+'\')"><i class="fa fa-circle-o fa-fw text-success"></i>'+item.name+'</a></li>';
        	}
   	    }); 
        
        htmlStr += '</ul>';
        htmlStr += '</div>';
    // 关闭其他的下拉层
	$('.divSert').remove()
	targetParent.after(htmlStr);

	// 如果下边空间不足于显示下拉层改为往上显示
	if($(window).height() - $(event.target).offset().top < targetParent.next('.divSert').outerHeight()){
		offsetTop -= targetParent.next('.divSert').outerHeight();
		
		targetParent.next('.divSert').css('top', offsetTop + 'px');
	}
}

function doEvent(objentityid,objectid,clicktype,checkid){
	alert('拿到行ID：'+objectid+checkid)
}

function doEdit(entityid,entityname, iid,name){
	//alert(treeNode)
}
function doDelete(entityid, iid){
	//alert(treeNode)
	layer.confirm('真的删除行么', function(index){
		//obj.del(); //删除对应行（tr）的DOM结构
		vpPostAjax('/project/agile/board/vpboard.jsp?method=dellistdata', { entityid : entityid,iid :iid }, 'GET', function(data){
			if(data.success) {
				o.reload();
			}
		});
		layer.close(index);
	});
}

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
			$(els).css('width', l + 'px');
			$('.index_'+index).css('width', l + 'px');
		}else{
			$(els).css('width', oldW + 'px');
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

//展开树
function expandAll(tree){
    //获取 zTree 的全部节点数据将节点数据转换为简单 Array 格式
    var nodes = tree.transformToArray(tree.getNodes());
    for(var i=0;i<nodes.length;i++){
        if(nodes[i].level == 0){
            //根节点展开
            tree.expandNode(nodes[i],true,true,false);
            onExpand('','',nodes[i]);
        }
		else{
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
		pArr.push($(this).outerWidth()+0.1)
	});
	oLis.each(function(index, el) {
		var cArr = [];
		var _this = $(this);
		$(this).find('.divTd').not('.fixTd_r').each(function(indx, els) {
			$(this).addClass('index_'+indx)
			cArr.push($(this).outerWidth()+0.1)
			// 如果父级宽度变了新展开的子级也要变
			for(var i=0;i<pArr.length;i++){
				if(cArr[i]!==pArr[i]){
					_this.find('.divTd').not('.fixTd_r').eq(i).css('width', pArr[i] + 'px')
				}
			}
		});
	});
};


// 初始化列表
function vptree(oparam) {	
	//添加表头
	var li_head = '';	
	var imgSpan ="<img src=\"/project/images/icon/icon_zsq1.gif\" title=1>&nbsp;"
	+"<img src=\"/project/images/icon/icon_zsq2.gif\" title=2>&nbsp;"
	+"<img src=\"/project/images/icon/icon_zsq3.gif\" title=3>&nbsp;"
	+"<img src=\"/project/images/icon/icon_zsq4.gif\" title=4>&nbsp;";
	var data = new Array();

	vpPostAjax(oparam.vptreeurl+'?method=tree', oparam.param, 'GET', function(rst) {
		if(rst.success) {	
			if ($('#'+oparam.el+' li').length < 1) {
				$.each(rst.headers, function(i, item) {
					cols.push(item);
				});
				$.each(rst.operation, function(i, item) {
					clicks.push(item);
				});
				
				li_head += '<li class="head"><a>';
								
				$.each(rst.headers, function(i, item) {
					if(item.title=='指示灯'){
						var tstr=item.templet;
						if(tstr==""){
							tstr='指示灯';
						}
						li_head += '<div class="divTd" style="width:'+item.width+'px;">'+tstr+'<div class="drag-handle"></div></div>';	
					}
					else{
						li_head += '<div class="divTd" style="width: '+item.width+'px;">'+item.title+'</div>';
					}
				});
				// li_head +='	<div class="divTd fixTd_r" style="width:100px;">操作</div>';
				li_head += '</a></li>';
			}
			data = rst.data;
			
			//初始化树
			var treeObj =$.fn.zTree.init($('#'+oparam.el+''), setting, data);
			setting["oparam"] = oparam;
			
			var rows = $('#'+oparam.el+' li');
			if (rows.length > 0) {
				rows.eq(0).before(li_head)
				// 这里是给每行里面的列添加索引方便操作
				rows.each(function(index, el) {
					$(this).find('.divTd').not('.fixTd_r').each(function(ind, els) {
						$(this).addClass('index_'+ind)
					});
				});
			} else {
				$('#'+oparam.el+'').append(li_head);
				$('#'+oparam.el+'').append('<li ><div style="text-align: center;line-height: 30px;">'+lbl002+'</div></li>')
			}
			// 鼠标移到该元素上拖
			$('.drag-handle').each(function(index, el) {
		        bindResize(index,el);
		    });
		    // 如果添加了固定列，列前一个要距离固定列的宽少1px
		    if($('.fixTd_r').length > 0){
		    	var fixEle = $('.fixTd_r')
		    	fixEle.prev('.divTd').css('margin-right', fixEle.outerWidth() - 1 +'px'); 
		    }
		    expandAll(treeObj);//默认展开到一级树
		}
	});
}