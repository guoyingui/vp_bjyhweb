$.fn.bootstrapValidator.i18n.endtime = {
	'default' : '不能在提出时间之前'
};
/**
 * 默认值
 * 
 */
$.extend($.fn.bootstrapValidator.DEFAULT_OPTIONS,{
	/**
	 * 日期控件值改变量触发changeDate事件,select改变会触发change事件,其它默认触发input事件
	 */
	trigger:"input change changeDate" 
});
$.fn.bootstrapValidator.validators.endtime = {
	/**
	 * 时间校验 普通：'#ID' 表格形式：'field:field' 其他：content:closest->find
	 */
	html5Attributes : {
		message : 'message',
		target : 'target',
		trigger:'trigger'
	},
	validate : function(validator, $field, options) {
		var value = $field.val();
		var param = options.target;
		if (!param)
			return true;
		if (param.indexOf("content:") == 0) {
			param = param.substring("content:".length).split("->");
		} else {
			param = [ param ];
		}
		var crPutTime = param[0];
		if (param.length == 2) {
			// 如果两个参数，第一个参数向上查找，第二个参数向下查找
			crPutTime = $field.closest(param[0]).find(param[1]);
			crPutTime = crPutTime.val();
		} else if (crPutTime.indexOf("field:") == 0) {
			// 如果是表格
			crPutTime = crPutTime.split("field:")[1];
			crPutTime = $field.closest("table").closest("tr").find(
					"td[field='" + crPutTime + "']").find("input:hidden")
					.datebox('getValue');
			return value >= crPutTime;
		} else
			crPutTime = $(param[0]).datebox('getValue');
		return crPutTime && value >= crPutTime;
	}
};

/**
 * 重写远程校验，远程校验扩展支持直接返回true或false而不是{valid:true/false,message}
*/
$.fn.bootstrapValidator.validators.remote.validate = function(validator, $field, options) {
   var value = $field.val(),
       dfd   = new $.Deferred();
   if (value === '') {
       dfd.resolve($field, 'remote', { valid: true });
       return dfd;
   }

   var name    = $field.attr('data-bv-field'),
       data    = options.data || {},
       url     = options.url,
       type    = options.type || 'GET',
       headers = options.headers || {};

   // Support dynamic data
   if ('function' === typeof data) {
       data = data.call(this, validator);
   }

   // Parse string data from HTML5 attribute
   if ('string' === typeof data) {
       data = JSON.parse(data);
   }

   // Support dynamic url
   if ('function' === typeof url) {
       url = url.call(this, validator);
   }

   data[options.name || name] = value;
   function runCallback() {
       var xhr = $.ajax({
           type: type,
           headers: headers,
           url: url,
           dataType: 'json',
           data: data
       });
       xhr.then(function(response) {
    	   if(typeof response == 'boolean'){
    		   response = {
    				   valid:response
    		   } 
    	   }else{
    		   response.valid = response.valid === true || response.valid === 'true';
    	   }
           dfd.resolve($field, 'remote', response);
       });

       dfd.fail(function() {
           xhr.abort();
       });
       return dfd;
   }
   
   if (options.delay) {
       // Since the form might have multiple fields with the same name
       // I have to attach the timer to the field element
       if ($field.data('bv.remote.timer')) {
           clearTimeout($field.data('bv.remote.timer'));
       }

       $field.data('bv.remote.timer', setTimeout(runCallback, options.delay));
       return dfd;
   } else {
       return runCallback();
   }
}

/**
 * 在goalEditor中，同一级别数据名称唯一
 */
$.fn.bootstrapValidator.validators.goalEditorSameLevelUnique = {
	html5Attributes : {
		message : 'message',
		trigger:'trigger'
	},
	validate : function(validator, $field, options) {
		var value = $field.val();
		var fieldName = $field.attr("name");
		var $ztree = $field.closest(".goaleditor-tree");
		var $node =  $field.closest("li[treenode]");
		var ztreeObj = $.fn.zTree.getZTreeObj($ztree.attr("id"));
		var node = ztreeObj.getNodeByTId($node.attr("id"));
		var nodes; //同级所有Node
		var parentNode = node.getParentNode();
		if(parentNode){
			nodes = parentNode.children;
		}else{
			nodes = ztreeObj.getNodes();
		}
		if(nodes.length){
			for(var i=0; i<nodes.length; i++){
				var c = nodes[i];
				if(c!=node && value == c[fieldName]){
					//节点名称相同时
					return false;
				}
			}
		}
		return true;
	}
};

