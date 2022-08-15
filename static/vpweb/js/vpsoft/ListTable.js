var msg001 = "VIEW-100001：格式解析错误";
var msg002 = "VIEW-100002：数据请求发生错误";
var msg003 = "VIEW-100003：绑定容器不存在";
var msg004 = "VIEW-100004：未定义的实现方法";
var msg005 = "VIEW-100005：未绑定列表操作事件";

var lbl001 = "请输入您需要的内容…";
var lbl002 = "无符合条件数据";
var ListTable = (function(window) {
	var ListTable = function(obj) {
		return new ListTable.fn.init(obj);
	}

	ListTable.fn = ListTable.prototype = {
		constructor: ListTable,
		init: function(obj) {
			this.obj = obj;
			this.parseEl = function() {
				this.parseHtml(this.obj);
			};
		},
		parseHtml: function(obj) {	
			if (obj.el == undefined || $("#"+obj.el).length == 0) {
				layer.msg(msg003, { icon: 2, time: 2000 });
			}
			else {
				$("#"+obj.el).parent().children().each(function(i,item){
					if($("#"+obj.el).next()&&$("#"+obj.el).next().attr('id')==obj.optBar){
						
					}else{
						$("#"+obj.el).next().remove();
					}
				});
				var html = '';
				html += '<script type="text/html" id="selectBar">';
				html += '  <a lay-event="radio" ><input type="radio" name="radio" value="radio" title=" "></a>';
				html += '</script>';
				$("#"+obj.el).after(html);
				loadListTable(obj);
			}			
		}
	}

	ListTable.fn.init.prototype = ListTable.fn;

	return ListTable;
})();

function loadListTable(cfg){
	vpPostAjax(cfg.vpurl, cfg.param, 'POST', function(rst) {
		var listdata = rst.content;
		var	coloums = [];
		if(cfg.listType=='checkbox'){
			coloums.push({field:'iid', title: '',checkbox: true, fixed: true});
		}else if(cfg.listType=='radio'){
			coloums.push({field:'iid', title: '', width:60,toolbar:'#selectBar'});
		} 
		
		$.each(listdata.headers, function(i, item) {
			if(item.title=='指示灯' || item.field=='indicator'){
				
			}else{
				coloums.push(item);
			}
		});
		if(cfg.optBar){
			coloums.push({field:'opt', title: '操作',fixed:'right', width:70, toolbar:"#"+cfg.optBar});
		}
		layui.use('table', function() {
		       var table = layui.table;
		       table.render({
		            elem: '#'+cfg.el,
		            cols: [coloums],
		            data: listdata.data,
		            height: 'full-100',
		            limit:listdata.numperpage
		       });
		       var isCheckBox = false;
		       if(cfg.listType=='checkbox'){
		    	   	isCheckBox = true;
		       		//监听多选框
				    table.on('checkbox('+cfg.layfilter+')', function(obj){
				    	var checkStatus = table.checkStatus(cfg.el);
				    	obj['event']='checkbox';
				    	obj['checkStatus']=checkStatus;
				    	doListEvent(obj,isCheckBox);
				    }); 
		       }
		       //监听工具条
		       table.on('tool('+cfg.layfilter+')', function(obj){
		    	   doListEvent(obj,isCheckBox);
		       });
		});
		//加载自定义分页
		layui.use(['laypage', 'layedit'], function(){
			this.laypage.render({
				elem: cfg.pageBar,
				count: listdata.totalrows,
				limit: listdata.numperpage,
				curr:  listdata.currentpage,
				limits: [10, 20, 30, 50, 100],
				layout: ['count', 'first', 'prev', 'page', 'next', 'last', 'limit', 'skip'],
				jump: function(o, first) {
					if (!first) {
						var param = cfg.param;
						param['limit'] = o.limit;
						param['curr'] = o.curr;	
						cfg.param = param;
						loadListTable(cfg);
					}
				}
			 });
		});
	});
	
}

function doListEvent(obj,ischeckbox){
	layer.msg(msg005, { icon: 2, time: 2000 });
}