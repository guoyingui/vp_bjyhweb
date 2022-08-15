/**
 * 设置默认值
 */
$.extend(true,$.fn.dataTable.defaults,{
	"deferLoading" : null,//延期加载时间，number类型。0为同步加载
	"pagingType" : "full_numbers",//分页工具栏样式 numbers - Page number buttons only (1.10.8),simple - 'Previous' and 'Next' buttons only,simple_numbers - 'Previous' and 'Next' buttons, plus page numbers
									//full - 'First', 'Previous', 'Next' and 'Last' buttons
									//full_numbers - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
									//first_last_numbers - 'First' and 'Last' buttons, plus page numbers
	"pagination" : true,//如果为true，则在控件底部显示分页工具栏。
	"paging" : true,//显示分页工具栏
	"info" : true,//控制是否显示表格左下角的信息
	"lengthChange" : true,//是否允许用户改变表格每页显示的记录数
	"pageLength" : 10,//改变初始化页长度（每页多少条数据）
	"searching" : false,//是否允许Datatables开启本地搜索
	"processing" : true,//是否显示处理状态(排序的时候，数据很多耗费时间长的话，也会显示这个)
	"autoWidth" : false,//自动宽度
	"ordering" : false,//排序
	"scrollX" : true,//设置水平滚动 修改默认滚动
	"scrollY" : false,//设置垂直滚动
	"showIndex" : true,//显示索引
	"showOpt" : false,//显示详情
	"singleSelect" : false,//多选按钮只允许选择一行
	sAjaxDataProp:"rows",
	"lengthMenu": [10, 20, 50 ],
	"bAjaxDataGet":true,
	"serverSide":true,
	"sServerMethod":"POST",
	"language": {
	    "url": 'static/plugins/jquery-dataTables/i18n/Chinese.json'
	},
	"dom":
		"<'row'<'col-sm-12'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-2'i><'col-sm-3'l><'col-sm-7'p>>"
});
$.extend(true,$.fn.dataTable.models.oSettings,{
	
});
$.extend(true,$.fn.dataTable.defaults.column,{
	defaultContent:'', //数据为空时默认显示值
});

(function($, window) {
	
	 var _api_register = $.fn.DataTable.Api.register;
     var _api_registerPlural = $.fn.DataTable.Api.registerPlural;
     var _ext = $.fn.dataTableExt;
     var _oApi = _ext.oApi;
	/**
	 * 通过field找到列索引
	 */
     _api_register( 'columns().getColumnsIndex()', function (field){
		// 找到所有列
		var aoColumns = this.table().settings()[0].aoColumns;
		// 找到field对应列索引
		var columnsIndex = -1;
		$.each(aoColumns, function(index) {
			if (this.data == field) {
				columnsIndex = index;
				return false;
			}
		});
		return columnsIndex;
		
	});
     
     /**
      * 在行前面新增行
      */
     _api_register( 'row().before()', function ( row ) {
 		// Allow a jQuery object to be passed in - only a single row is added from
 		// it though - the first element in the set
 		if ( row instanceof $ && row.length ) {
 			row = row[0];
 		}
 		if(!this.length){
 			return this.row.add(row);
 		}
 		var rowIndex = this.index();
 		var rowNode = this.node();
 		var rows = this.iterator( 'table', function ( settings ) {
 			var newRowIndex = _oApi._fnAddData( settings, row );
 			var aoData = settings.aoData;
 			aoData.splice(rowIndex,0,aoData.pop()); //重新排序
	   		$(rowNode).before($(settings.aoData[rowIndex+1].nTr));
	   		// Update the cached indexes
 			for ( i=0, ien=aoData.length ; i<ien ; i++ ) {
				loopRow = aoData[i];
				loopRow.idx = i;
				loopCells = loopRow.anCells;
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
 			return rowIndex;
 		} );
 		// Return an Api.rows() extended instance, with the newly added row selected
 		return this.row( rows[0] );
 	} );
     /**
      * 在行后面新增行
      */
     _api_register( 'row().after()', function ( row ) {
    	 // Allow a jQuery object to be passed in - only a single row is added from
    	 // it though - the first element in the set
    	 if ( row instanceof $ && row.length ) {
    		 row = row[0];
    	 }
 		if(!this.length){
 			return this.row.add(row);
 		}
    	 var rowIndex = this.index();
    	 var rowNode = this.node();
    	 var rows = this.iterator( 'table', function ( settings ) {
    		 var newRowIndex = _oApi._fnAddData( settings, row );
    		 var aoData = settings.aoData;
    		 aoData.splice(rowIndex+1,0,aoData.pop()); //重新排序
    		// Update the cached indexes
 			for ( i=0, ien=aoData.length ; i<ien ; i++ ) {
				loopRow = aoData[i];
				loopRow.idx = i;
				loopCells = loopRow.anCells;
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
 			 $(rowNode).after($(settings.aoData[rowIndex+1].nTr));
    		 return rowIndex+1;
    	 } );
    	 // Return an Api.rows() extended instance, with the newly added row selected
    	 return this.row( rows[0] );
     } );
     
     /**
      * 获取列定义属性
      */
     _api_register('column().options()',function(){
    	 var index = this.index();
    	 var settings = this.settings()[0];
    	 return settings.aoColumns[index];
     });
     /**
      * 获取列定义属性
      */
     _api_register('columns().options()',function(){
    	 var ret = [];
    	 var settings = this.settings();
    	 this.iterator("column",function(){
    		 var index = this.index();
        	 ret.push(settings.aoColumns[index]);
    	 });
    	 return ret;
     });


    /**
     * 扩展 修改data 不改变原有行结构
     */
    _api_register( 'row().udata()', function ( data ) {
        var ctx = this.context;

        if ( data === undefined ) {
            // Get
            return undefined;
        }
        // Set
        ctx[0].aoData[ this[0] ]._aData = data;

        var settings = ctx[0], rowIdx = this[0];
        var row = settings.aoData[rowIdx];
        var i,ien;

        // For both row and cell invalidation, the cached data for sorting and
        // filtering is nulled out
        row._aSortData = null;
        row._aFilterData = null;

        // Invalidate the type for a specific column (if given) or all columns since
        // the data might have changed
        var cols = settings.aoColumns;

        for ( i=0, ien=cols.length ; i<ien ; i++ ) {
            cols[i].sType = null;
        }

        // Update DataTables special `DT_*` attributes for the row
        _ext.internal._fnRowAttributes( settings, row );

        return this;
    } );
 	
	/**
	 * 合并单元格，options包含以下属性：
		index：行索引。
		field：字段名称。
		rowspan：合并的行数。
		colspan：合并的列数。
	 */
	$.fn.dataTable.Api.register( 'columns().mergeCells()', function (options) {
		// 找到field对应列索引
		var columnsIndex = this.getColumnsIndex(options.field);
		if (columnsIndex == -1)
			return false;

		$('>tbody>tr', this.table().node()).each(
				function(index) {
					if (options.index > index)
						return true;
					if (options.index + options.rowspan <= index)
						return false;
					var td = $('>td:eq(' + columnsIndex + ')', this);
					if (options.index == index) {
						td.attr('rowspan', options.rowspan);
					} else {
						td.hide();
					}
					for (var i = 1; i <= options.colspan && td
							&& td.length > 0; i++) {
						if (i == 1) {
							td.attr('colspan', options.colspan);
						} else {
							td.hide();
						}
						td = td.next();
					}
				});
	} );

	/**
	 * 分级别合并单元格，从左至右
	 * 例子：this.api().columns().mergeCellsByTier('mergeCellsByTier',"一级列名,二级列名,三级列名");
	 */
	$.fn.dataTable.Api.register( 'columns().mergeCellsByTier()', function (colList) {
		//分级别合并单元格
		function mergeCells(rows,ColArray,ColArrayIndex,startIndex,TableRowCnts)
		{
			var CurTxt="";
			var PerTxt=Math.random();//避免重复
			var tmpA=1;
			var tmpB=0;
			if(startIndex<0)
				return;
		  //遍历所有行
		  for (var i = startIndex; i <= TableRowCnts; i++) {
		 	 //行结尾
		       if (i == TableRowCnts) {
		     	  //清空-避免重复
		           CurTxt = new Date().getTime()+parseInt(Math.random()*10000);
		       }
		       else {
		     	  //和获取i行ColArray[j]列的值
		           CurTxt = rows[i][ColArray[ColArrayIndex]];
		       }
		       //如果和上一行相同
		       if (PerTxt === CurTxt) {
		     	  //恢复单行
		           tmpA += 1;
		           this.mergeCells( {//合并单元格事件
		               index: i ,//从刚才的行数开始合并
		               field: ColArray[ColArrayIndex],//要合并的列
		               rowspan: 1,//纵向合并的行数
		               colspan: null//横向合并行数
		           });
		       }
		       else {
		     	  //合并起始行加刚合并的行数
		           tmpB += tmpA;

		           if(i-1>=0)
	        	   this.mergeCells( {//合并单元格事件
		               index: i - tmpA,//从刚才的行数开始合并
		               field: ColArray[ColArrayIndex],//要合并的列
		               rowspan: tmpA,//纵向合并的行数
		               colspan: null//横向合并行数
		           });
		           if(ColArrayIndex-1>=0 && i != startIndex)
		          	 mergeCells.call(this,rows,ColArray,ColArrayIndex-1,
		          		 i - tmpA,startIndex+tmpB-1);
		           
		          //合并完成重新初始化要合并的行数
		           tmpA = 1;
		       }
		       //赋值上一行字符串
		       PerTxt = CurTxt;
		   }
		}
		//获取被合并的列
		if(typeof colList == 'string'){
			//字符串分割为数组
			colList = colList.split(",");
		}else{
			//拷贝数组
			colList = colList.slice(0);
		}
		//数组左右交换
		for(var i=0;i<parseInt(colList.length/2);i++){
			var t = colList[i];
			colList[i] = colList[colList.length - i - 1];
			colList[colList.length - i - 1] = t;
		}
		var rows = this.table().data();
		mergeCells.call(this,rows,colList,colList.length - 1,0,rows.length);
	} );
	
	
	
	var selectCheckbox = 'td>input[type="checkbox"]';
	var _dataTable = $.fn.dataTable;
	$.fn.dataTable = function(options) {
		if(options === undefined){
			var instance = $(this).data('dataTable');
			if(instance){
				return instance;
			}
			$.fn.dataTable.call(this,{});
			return $(this).data('dataTable');
		}
		if (typeof options == 'object') {
			var defOptions = {
					singleSelect : false,//多选按钮只允许选择一行
					//重绘完毕
					fnDrawCallback:function(oSettings){
					},
					//初始化成功
					fnInitComplete:function(oSettings){
					}
			};
			var opts = $.extend(defOptions, options);
			$.each(opts.columns || [],function(){
				if(typeof this.type == 'string'){
					if(this.type.toLowerCase() == 'date'.toLowerCase()){
						$.extend(this,{
					        render: function(data, type, row, meta) {
					        	if(!data) return '';
					        	var opt = meta.settings.oInit.aoColumns[meta.col];
					        	var format = opt.format || 'yyyy-MM-dd hh:mm:ss';
//					        	return new Date(data).format(format);
					        	return Comm.date.formatJavaStr(data,format);
					        }
						});
					} else if(this.type.toLowerCase() == 'selModel'.toLowerCase()){
						$.extend(this,{
					        render: function(data, type, row, meta) {
					        	if(!data && data != 0) return '';
					        	var opt = meta.settings.oInit.aoColumns[meta.col];
					        	var format = opt.format;
					        	if(!format) return '';
					        	return dictUtil.val2text(format,data);
					        }
						});
					}
				}
				
				if(typeof this.selModel == 'string'){
					$.extend(this,{
				        render: function(data, type, row, meta) {
				        	var opt = meta.settings.oInit.aoColumns[meta.col];
				        	var mat = opt.format||'{0}';
				        	if(!data && data != 0) return mat.format('');
				        	return mat.format(dictUtil.val2text(opt.selModel,data));
				        }
					});
				}
			});
			var _this = _dataTable.apply(this, [ opts ]);
			$(this).data('dataTable', $.extend(_this, {
				options : opts,
				$element : $(this)
			}));
			$(_this.api().settings()[0].nTHead).unbind('change','th>input[type="checkbox"]').on('change','th>input[type="checkbox"]',function(){
				var ischecked=$(this).is(':checked');
				if(ischecked){
					if(_this.options.singleSelect){
						$(this).prop("checked",false);
						return ;
					}
					$('input[type="checkbox"]',_this).not(':checked').prop("checked",true).change();
				}else{
					$('input[type="checkbox"]',_this).filter(':checked').prop("checked",false).change();
				}
				
			});
			//多选框事件
			$(this).unbind('change',selectCheckbox).on('change',selectCheckbox,function(e){
				var rowIndex = $(_this).dataTable('getIndexByChildren',this);
				var rowData = $(_this).dataTable('getRows')[rowIndex];
				var ischecked=$(this).is(':checked');
				if(ischecked){
					if(_this.options.singleSelect){
						$(selectCheckbox,_this).not(this).prop("checked",false).change();
					}
					options.onCheck && options.onCheck.call(_this,rowIndex,rowData);
				}else{
					options.onUncheck && options.onUncheck.call(_this,rowIndex,rowData);
				}
				if(!_this.options.singleSelect){
					var tag = true;
					$(selectCheckbox,_this).each(function(){
						if(!$(this).is(':checked')){
							return tag = false;
						}
					});
					$('th>input[type="checkbox"]',_this.api().settings()[0].nTHead).prop("checked",tag);
				}
			});
			$(this).unbind('click',selectCheckbox).on('click',selectCheckbox,function(event){
//				阻止事件冒泡，避免到行点击事件中
				event.stopPropagation();
			});
//			行点击事件
			$(this).unbind('click','>tbody>tr').on('click','>tbody>tr',function(){
				var $cb = $(selectCheckbox,this);
				$cb.prop("checked",!$cb.is(':checked')).change();
			});
			
			return _this;
		} else if (typeof options === 'string') {
			if ($.fn.dataTable.methods[options]) {
				var ret = undefined;
				var args = Array.prototype.slice.call(arguments, 1);
				this
						.each(function() {
							var instance = $(this).data('dataTable');
							ret = $.fn.dataTable.methods[options].apply(
									instance, args);
						});
				return ret;
			}
			var api = $(this).data('dataTable').api();
			if (api[options]) {
				var args = Array.prototype.slice.call(arguments, 1);
				return api[options].apply(api, args);
			}
			return _dataTable.apply(this, arguments);
		}
	}
	$.extend($.fn.dataTable.prototype, _dataTable.prototype);
	$.extend($.fn.dataTable, _dataTable);
	$.fn.dataTable.methods = $.extend($.fn.dataTable.methods || {}, {
		options:function(){
			return $(this).data('dataTable').options;
		},
		api:function(){
			return this.api();
		},
		getRows:function(isEdit){
			var rows = [];
			var data = null;
			if(isEdit){
				data = this.api().rows().getEditingData();
			}else{
				data = this.api().data();
			}
			
			for(var i=0;i<data.length;i++){
				rows.push(data[i]);
			}
			return rows;
		},
		/**
		 * 通过子元素获取行索引
		 */
		getIndexByChildren : function(children){
			var index = $('>tbody>tr[role="row"]',this).index($(children).closest('tr[role="row"]'));
			return index;
		},
		/**
		 * 通过field找到列索引
		 */
		getColumnsIndex : function(field){
			return this.api().columns().getColumnsIndex(field);
		},
		/**
		 * 获取选择的行数据
		 * @returns
		 */
		getChecked : function(){
			var _this = this;
			var ret = [];
			var rows = $(this).dataTable('getRows');
			$(selectCheckbox + ':checked',this).each(function(){
				var index = $(_this).dataTable('getIndexByChildren',this);
				ret.push(rows[index]);
			});
			return ret;
		},
		
		removeChecked:function(){
			var that = this;
			$(selectCheckbox + ':checked',this).each(function(){
				var $row = $(this).closest('tr[role="row"]')
				that.api().row($row).remove().draw();
			});
		},
		
		checkRow:function(index,checked){
			var tr = this.api().rows(index).nodes();
			checked = !!checked;
			var $cb = $(selectCheckbox + '',tr);
			if($cb.is(':checked') != checked){
				$cb.prop("checked",checked).change();
			}
		},
		/**
		 * 重载数据
		 * paging：是否重载分页，默认true
		 */
		reload : function(url, params, options) {
			options = options||{};
			if (typeof url == 'object') {
				//如果第一个参数不是url则表示第一个参数是params
				options = params || {};
				params = url;
				url = undefined;
			}
			$.extend(this.options,options,{
				paging:options.paging!==false,//只有等于false时才是false,其它情况都视为true
				mergerParam:options.mergerParam!==false,//只有等于false时才是false,其它情况都视为true
			});
			
			var options = this.options;
			if (url !== undefined) {
				options.url = url;
				options.ajax && (options.ajax.url = url);
			}
			if (params !== undefined) {
				if(options.mergerParam){
					options.params = $.extend(options.params || {}, options.ajax
							&& options.ajax.data, params);
				}else{
					options.params = params;
				}
				
			}else if(!options.params){
				options.params = {};
			}
			var url = options.ajax && options.ajax.url || options.url;
			var settings = this.api().settings()[0];
			if(!settings.ajax){
				settings.ajax = {};
			}
			//设置了分页
			if(this.options.paging){
				$.extend(options.params,{
					page:1,
					size:10
				});
			}
			settings.ajax.url = url;
			settings.ajax.data = options.params;
			this.api().ajax.reload();

		},
		/**
		 * 加载静态数据
		 * 注意检查 serverSide : false
		 */
		load : function(data){
			var api = this.api();
			api.clear();
			$.each(data || [],function(){
				api.row.add(this);
			});
			api.draw();
		},
		/**
		 * 合并单元格，options包含以下属性：
			index：行索引。
			field：字段名称。
			rowspan：合并的行数。
			colspan：合并的列数。
		 */
		mergeCells : function(options) {
			return this.api().columns().getColumnsIndex(options);
		},

		/**
		 * 分级别合并单元格，从左至右
		 * 例子：$table.dataTable('mergeCellsByTier',"一级列名,二级列名,三级列名");
		 */
		mergeCellsByTier : function(colList){
			return this.api().columns().mergeCellsByTier(colList);
		}
	});

})(jQuery, window);