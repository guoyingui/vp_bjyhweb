var subIframs = new Array();

var _single_lable="col-sm-4 col-md-3";
var _double_lable="col-sm-2 col-md-3";
var _single_input="col-sm-8 col-md-9 sub-head" ;
var _double_input="col-sm-10 col-md-9 sub-head";

var _single_select="col-xs-8";
var _double_select="col-xs-10";

var _table = '<div class="ibox-content p-n clearfix"><div class="form-horizontal m-t" id="signupForm">{#tr}</div></div>';

var _blank_td = "";
var _double_td = '<div class="form-group"><div class="col-sm-6">{#content1}</div><div class="col-sm-6">{#content2}</div></div>';
var _single_td = '<div class="form-group"><div class="col-sm-12">{#content}</div></div>';
var _singlefile_td = '<div class="form-group state up-file"><div class="col-sm-12">{#content}</div></div>';


var _lable = '<label class="{#lableclass} control-label text-ellipsis">{#lable}:</label>';
var _addfile = ' <div class="vp-pr vp-height-35 m-b-sm"><a class="btn btn-white" id="{#id}"><i class="fa fa-cloud-upload" aria-hidden="true"></i>添加附件</a></div>';

var _mustLable = '<div class="lableMust"></div>';
 
var _input = '<div class="{#lableinput}"><input id="{#id}" name="{#name}" hidID="{#hidID}" number="{#number}" {#readonly} value="{#value}" onclick="{#click}" class="form-control" type="text"></div>';

var _dateInput = '<div class="{#lableinput}"><input id="{#id}" name="{#name}" placeholder="{#lable}"  value="{#value}" readonly class="form-control input-sm padding-right-30 vp-radius" type="text"><i class="fa fa-calendar text-muted"></i></div>';

var _select = '<div class="{#lableselect}"><select id="{#id}" name="{#name}" class="form-control" {#disabled}>{#option}</select></div>';
var _selectList = '<td class="otherCell"><select id="{#id}" style="{#height}" class="inputSelect" size="{#size}" {#multiple} {#cstProperty} {#disabled}>{#option}</select></td>';
var _selectOption = '<option value="{#value}" {#selected}>{#text}</option>';
var _radio = '<div class="{#lableinput}">{#radiobox}</div>';
var _radiobox = '<div class="radio radio-info radio-inline"><input type="radio" value="{#value}" name="{#name}" /><label for="itriggermode1">{#text}</label></div>';
var _checkbox = '<div class="checkbox checkbox-info checkbox-inline"><input type="checkbox" value="{#value}" name="{#name}" /><label for="itriggermode1">{#text}</label></div>';
var _textarae = '<div class="{#lableinput}"><textarea id="{#id}" name="{#name}" class="form-control">{#value}</textarea></div>';
var _richText = '<div class="{#lableinput}"><div id="{#id}" style="width:100%;height:304px;border:1px #a2a4b0 solid;overflow:auto;"><iframe id="preview4Ueditor_{#id}" width="100%" height="100%" frameborder="0" src="ueditor.html?fieldId={#id}&isRead={#mustInput}"></iframe></div></div>';

var _link = '<div class="formlink"><a href="#" onclick="#click">{#text}</a></div>';

var _group = '<div class="ibox-title border-bottom p-l-none"><h5>{#title}</h5><div class="ibox-tools"><a class="collapse-link" data-toggle="tooltip" data-placement="top" title="收起"><i class="fa fa-caret-up"></i></a></div></div>';

var _cstProperty = ' mustInput = "{#mustInput}" propertyText = "{#propertyText}" propertyType="{#propertyType}" systype="{#systype}"';
var _file =	'<div class="upload-list" id="{#id}_list">{#files}</div>';
var _file2 ='<a class="vp-pr p-xxs text-primary" href="" data="{#value}" onclick="{#click}"><i class="fa fa-paperclip"></i>{#filename}<em class="fa pull-right">x</em></a>';
var _richTextdiv =	'<div id="{#id}_temp" style="display:none;">';
var _strHTML = "";

var tableID = 0;
var Form = {
	formFieldList: [],
	setFormField: function(cfg){
		Form.formFieldList.push(cfg);
	},
	getFormField: function(cfg){
		return Form.formFieldList;
	},
	addTable: function(table){
		_strHTML += table.getHtml().replace('{#tableID}','table_id_' + tableID);
		tableID++;
	},
	addGroup: function(group){
		_strHTML += group.getHtml().replace('{#tableID}','table_id_' + tableID).replace('{#groupID}','group_id_' + tableID);
	},
	make: function(el){
		//String.prototype.replaceAll  = function(s1,s2){   
		//	return this.replace(new RegExp(s1,"gm"),s2);   
		//}
		//alert(typeof _strHTML == "string");
		//xx.innerHTML = _strHTML.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
		//console.log(_strHTML);
		document.getElementById(el).innerHTML = _strHTML;
	},
	Table: function(tablecfg){
		this.tableRow = [];
		this.currentCol = 'left';
		this.defaultWrap = tablecfg.defaultWrap;
		this.addRow = function(cfg){
			//获取添加元素的hmtl
			var strHtml = cfg.formItme.getHtml();
			
			var lable;

			//元素的显示的名称 lable中的text
			lable = _lable.replace('{#lable}',cfg.lable);
			
			//0：只读 1：可选输入 2：必须输入';
			//添加必输项标识
			if(cfg.mustInput == 2){
				lable = lable.replace('{#mustLable}',_mustLable);
			}else{
				lable = lable.replace('{#mustLable}',"");
			}
			//组合元素的名称 和 元素的hmtl
			//strHtml = lable + strHtml;
			if(cfg.lable){
				strHtml = lable + strHtml;
			}
			//增加到table格式中
			var fieldTable =strHtml;
			
			//如果是单列布局
			//console.log(cfg.col+"********************");
			if(cfg.col == 2){
				//添加到表格行中

				fieldTable=fieldTable.replace('{#lableinput}', _double_input).replace('{#lableclass}', _double_lable).replace('{#lableselect}', _double_select);
				
				if(cfg.propertyType==12){
					this.tableRow.push(_singlefile_td.replace('{#content}', fieldTable));
				}else{
					this.tableRow.push(_single_td.replace('{#content}', fieldTable));
				}

				this.currentCol = 'left';
			}else{//如果是双列布局
				//程序中根据顺序自动判断左右列
				//左侧列时
				fieldTable=fieldTable.replace('{#lableinput}', _single_input).replace('{#lableclass}', _single_lable).replace('{#lableselect}', _single_select);
				//console.log(cfg.col+"********************currentCol="+this.currentCol);
				if(this.currentCol == 'left'){
					//添加到表格行中 只有左侧
					this.tableRow.push(_double_td.replace('{#content1}', fieldTable));
					this.currentCol = 'right';
				}else{//右侧列时
					//从表格行中取得只有左侧列的html
					var trHtml = this.tableRow[this.tableRow.length - 1];
					
					//console.log(trHtml);
					//将右侧列加到hmtl中，并覆盖到表格行中
					this.tableRow[this.tableRow.length - 1] = trHtml.replace('{#content2}', fieldTable);
					this.currentCol = 'left';
				}
			}
		};
		this.getHtml = function(){
			var tr = "";
			for(var i=0;i<this.tableRow.length;i++){
				//console.log(this.tableRow[i]);
				tr += this.tableRow[i].replace('{#content2}','');
			}
			
			var html = _table.replace('{#tr}', tr);
			//defaultwrap;//默认展开 1:展开 0:收缩
			if(this.defaultWrap == '1'){
				html = html.replace('{#display}','');
			}else{
				html = html.replace('{#display}','display:none');
			}
			console.log(html);
			return html;
		};
	},
	getProperty: function(cfg){
		var property = _cstProperty.replace('{#propertyType}',cfg.propertyType).replace('{#systype}',cfg.systype);
		property = property.replace('{#propertyText}', cfg.propertyText);
		property = property.replace('{#mustInput}', cfg.mustInput);
		Form.setFormField(cfg);
		if(cfg.title){
			property = property + ' title="' + cfg.title + '" ';
		}
		if(cfg.onvc){
			if(cfg.propertyType==11){
				property = property + ' onchange="'+cfg.onvc+'" ';		
			}else{
				property = property + ' onpropertychange="'+cfg.onvc+'" ';				
			}
			
		}
		return property;
	},
	Input: function(cfg){
		this.getName = function(){
			return "Input";
		};
		this.getHtml = function(){
			var property = Form.getProperty(cfg);
			var className = "inputText";
			var readonly = "";
			var number = "false";
			//0：只读 1：可选输入 2：必须输入';
			var color = "#ffffff";
			if(cfg.mustInput == 2){
				className = "inputTextCheck";
				//color = "#f8ecd4";
			}else if(cfg.mustInput == 0){
				readonly = 'readonly';
				className = "inputTextRead";
				// color = "#f7f7f7";
			}
			//是否数字类型
			if(cfg.number == true){
				number = 'true';
			}
			
			var input = _input.replace('{#id}', cfg.id);
			input = input.replace('{#name}', cfg.id);
			input = input.replace('{#value}', cfg.value);
			input = input.replace('{#cstProperty}', property);
			input = input.replace('{#class}',className);
			input = input.replace('{#color}',color);
			input = input.replace('{#readonly}',readonly);
			input = input.replace('{#number}',number);
			input = input.replace('{#hidID}',cfg.hidID?cfg.hidID:"");
			input = input.replace('{#click}', '');
			return input;
		}
	},
	ObjectInput: function(cfg){
		//alert(JSON.stringify(cfg) );
		this.getName = function(){
			return "Input";
		};
		this.getHtml = function(){
			var property = Form.getProperty(cfg);
			var className = "inputText";
			var readonly = "";
			var number = "false";
			//0：只读 1：可选输入 2：必须输入';
			var color = "#ffffff";
			if(cfg.mustInput == 2){
				className = "inputTextCheck";
				// color = "#f8ecd4";
			}else if(cfg.mustInput == 0){
				className = "inputTextRead";
				// color = "#f7f7f7";
			}
			//是否数字类型
			if(cfg.number == true){
				number = 'true';
			}
			var input = _input.replace('{#id}', cfg.id);
			input = input.replace('{#name}', cfg.id);
			input = input.replace('{#value}', cfg.value);
			input = input.replace('{#cstProperty}', property);
			input = input.replace('{#class}',className);
			input = input.replace('{#color}',color);
			input = input.replace('{#readonly}','readonly');
			input = input.replace('{#hidID}',cfg.hidID?cfg.hidID:"");
			input = input.replace('{#number}',number);

			if(cfg.mustInput == 0){
				input = input.replace('{#click}', '');
			}else{
				input =input.replace('{#click}', cfg.clickFn);
			}
			input = input.replace('{#icon}',cfg.icon);
			return input;
		}
	},
	Page: function(cfg){
		this.getName = function(){
			return "Page";
		};
		
			if(window.attachEvent){
				window.attachEvent('onlaod',function(){
					var th=document.body.clientHeight,ah=0;
					jQuery('.form_body_frame_table').each(function(i){						
						ah+=this.scrollHeight+5;
					});
					ah-=document.getElementById('frmItems'+cfg.fieldName).clientHeight;
					if(ah<th){
						if((th-ah-22-7)<300){
							document.getElementById('frmItems'+cfg.fieldName).style.height='300px';
						}else{
							document.getElementById('frmItems'+cfg.fieldName).style.height=(th-ah-22-7)+'px';
						}
					}
				});
			}else{
				window.addEventListener('load',function(){
					var th=document.body.clientHeight,ah=0;
					jQuery('.form_body_frame_table').each(function(i){						
						ah+=this.scrollHeight+5;
					});
					ah-=document.getElementById('frmItems'+cfg.fieldName).clientHeight;
					if(ah<th){
						if((th-ah-22-7)<300){
							document.getElementById('frmItems'+cfg.fieldName).style.height='300px';
						}else{
							document.getElementById('frmItems'+cfg.fieldName).style.height=(th-ah-22-7)+'px';
						}
					}
					try{
						var remarkth = document.getElementById("remarkth");
						if(remarkth){
							Common.showText(remarkth, "remark");
						}
					}catch(e){
						
					}
				},false);	
			}
		this.getHtml = function(){
			var a1 = "?";
			if(cfg.url.indexOf("?")==-1){
				//没有?
			}else{
				a1 = "&";
			}
			var urlSrc = cfg.url+a1+'objectID='+document.getElementById('objectID').value
				+'&workItemID='+document.getElementById('workItemID').value
				+'&projectID='+document.getElementById('relProjectID').value;
			subIframs.push('frmItems'+cfg.fieldName);
			return '<td colspan=2 style="height:20px; padding-left: 25px; padding-top: 3px;"><iframe id="frmItems'+cfg.fieldName+'"  src="'+urlSrc+'" style="border: 0px; width: 100%; height: 300px;"></iframe></td>';
		}
	},
	File: function(cfg){
		this.getName = function(){
			return "File";
		};
		this.getHtml = function(){
			var property = Form.getProperty(cfg);//添加附件
			//alert(JSON.stringify(cfg));
			
			
			
			
			
			var file = _file.replace('{#cstProperty}', property);
			file = file.replaceAll('{#inputType}', cfg.inputType);
			file = file.replaceAll('{#id}', cfg.id);
			file = file.replaceAll('{#entityID}', cfg.entityID);
			file = file.replaceAll('{#entityInstanceID}', cfg.entityInstanceID);
			file = file.replaceAll('{#fileCfg}', cfg.fileCfg);
			file = file.replaceAll('{#disabled}', cfg.inputType==0?'disabled="disabled"':'');
			
			var opHtml="";
			for(var i=0;i<cfg.valueList.length;i++){
				var _file2=_file2
				var item = cfg.valueList[i];
				opHtml += _file2.replace('{#filename}', item.text).replace('{#value}', item.value);
				
				
			}
			file=file.replaceAll('{#files}', opHtml);
			file=_addfile.replaceAll('{#id}', cfg.id)+file;
			
			console.log(file);
			return file;
		};
	},


	MoneyInput: function(cfg){
		this.getName = function(){
			return "Input";
		};
		this.getHtml = function(){
			var property = Form.getProperty(cfg);
			var className = "inputText";
			var readonly = "";
			var number = "false";
			//0：只读 1：可选输入 2：必须输入';
			if(cfg.mustInput == 2){
				className = "inputTextCheck";
			}else if(cfg.mustInput == 0){
				readonly = 'readonly';
				className = "inputTextRead";
			}
			//是否数字类型
			if(cfg.number == true){
				number = 'true';
			}
			var _moneyInput = '<td class="textCell"><input id="{#id}" name="{#name}" hidID="{#hidID}" number="{#number}" type="text" onkeypress="{#onkeypress}" onfocus="{#onfocus}" onblur="{#onblur}" class="{#class}"  value="{#value}" {#cstProperty} {#readonly}/></td>';
			var input = _moneyInput.replace('{#id}', cfg.id);
			input = input.replace('{#name}', cfg.id);
			input = input.replace('{#value}', MoneyObj.covert2MoneyStr(cfg.value));
			input = input.replace('{#cstProperty}', property);
			input = input.replace('{#class}',className);
			input = input.replace('{#onkeypress}','return MoneyObj.textIsNumbers(event,this)');
			input = input.replace('{#onfocus}','MoneyObj.removeMoneyFormat(this);');
			input = input.replace('{#onblur}','MoneyObj.convert2Money(this)');
			input = input.replace('{#readonly}',readonly);
			input = input.replace('{#number}',number);
			
			return input;
		}
	},
	Select: function(cfg){
		this.getName = function(){
			return "Select";
		};
		this.getHtml = function(){
			var property = Form.getProperty(cfg);
			var opHtml = "";
			var html = "";
			var className = "inputSelect";
			for(var i=0;i<cfg.option.length;i++){
				var item = cfg.option[i];
				opHtml += _selectOption.replace('{#value}', item.value).replace('{#text}', item.text);
				if(item.selected == true){
					opHtml = opHtml.replace('{#selected}', 'selected');
				}else{
					opHtml = opHtml.replace('{#selected}', '');
				}
			}
			
			html = _select.replace('{#id}', cfg.id).replace('{#option}', opHtml).replace('{#cstProperty}', property);
			
			//0：只读 1：可选输入 2：必须输入';
			if(cfg.mustInput == 2){
				className = "inputSelectCheck";
			}else if(cfg.mustInput == 0){
				html = html.replace('{#disabled}','disabled');
				className = "inputSelectRead";
			}
			
			html = html.replace('{#class}',className);
			//console.log(html);
			return html;
		}
	},
	SelectList: function(cfg){
		this.getName = function(){
			return "SelectList";
		};
		this.getHtml = function(){
			var property = Form.getProperty(cfg);
			var opHtml = "";
			for(var i=0;i<cfg.option.length;i++){
				var item = cfg.option[i];
				opHtml += _selectOption.replace('{#value}', item.value).replace('{#text}', item.text);
				if(item.selected == true){
					opHtml = opHtml.replace('{#selected}', 'selected');
				}else{
					opHtml = opHtml.replace('{#selected}', '');
				}
			}
			var multiple = "";
			if(cfg.multiple == true){
				multiple = "multiple";
			}
			
			var html = _selectList.replace('{#id}', cfg.id).replace('{#option}', opHtml).replace('{#cstProperty}', property).replace('{#multiple}', multiple).replace('{#size}', cfg.size).replace('{#height}',parseFloat(cfg.size)*16+"px");
			//0：只读 1：可选输入 2：必须输入';
			if(cfg.mustInput == 0){
				html = html.replace('{#disabled}','disabled');
			}else if(cfg.mustInput == 2){
				html = html.replace('{#disabled}','');
			}
			return html;
		}
	},
	DateInput: function(cfg){
		this.getName = function(){
			return "DateInput";
		};
		this.getHtml = function(){
			var property = Form.getProperty(cfg);
			var className = "inputText";
			var color = "#ffffff";
			//0：只读 1：可选输入 2：必须输入';
			if(cfg.mustInput == 2){
				className = "inputTextCheck";
				//color = "#f8ecd4";
			}
			else if(cfg.mustInput == 0){
				className = "inputTextRead";
				// color = "#f7f7f7";
			}
			var input = _dateInput.replace('{#id}', cfg.id);
			input = input.replace('{#name}', cfg.id);
			input = input.replace('{#value}', cfg.value);
			input = input.replace('{#lable}', cfg.propertyText);
			input = input.replace('{#cstProperty}', property);
			input = input.replace('{#class}',className);
			input = input.replace('{#readonly}','readonly');
			input = input.replace('{#color}',color);

			if(cfg.mustInput == 0){
				//input = input.replace('{#click}', '');
				
			}else{
				//input = input.replace('{#click}', 'showCalendar('+cfg.id+','+cfg.id+','+cfg.id+',\'\')');
				
			}

			return input;
		}
	},
	Radiobox: function(cfg){
		this.getName = function(){
			return "Radiobox";
		};
		this.getHtml = function(){
			var property = Form.getProperty(cfg);
			var opHtml = "";
			for(var i=0;i<cfg.valueList.length;i++){
				var item = cfg.valueList[i];
				opHtml += _radiobox.replace('{#value}', item.value).replace('{#text}', item.text).replace('{#name}', cfg.id);
				opHtml = opHtml.replace('{#cstProperty}', property);
				if(item.checked == true){
					opHtml = opHtml.replace('{#checked}', 'checked');
				}else{
					opHtml = opHtml.replace('{#checked}', '');
				}
				//0：只读 1：可选输入 2：必须输入';
				if(cfg.mustInput == 0){
					opHtml = opHtml.replace('{#disabled}','disabled');
				}else if(cfg.mustInput == 2){
					opHtml = opHtml.replace('{#disabled}','');
				}
			}
			return _radio.replace('{#radiobox}', opHtml);
		}
	},
	Checkbox: function(cfg){
		this.getName = function(){
			return "Checkbox";
		};
		this.getHtml = function(){
			var property = Form.getProperty(cfg);
			var opHtml = "";
			for(var i=0;i<cfg.valueList.length;i++){
				var item = cfg.valueList[i];
				opHtml += _checkbox.replace('{#value}', item.value).replace('{#text}', item.text).replace('{#name}', cfg.id);
				opHtml = opHtml.replace('{#cstProperty}', property);
				if(item.checked == 'true'){
					opHtml = opHtml.replace('{#checked}', 'checked');
				}else{
					opHtml = opHtml.replace('{#checked}', '');
				}
				//0：只读 1：可选输入 2：必须输入';
				if(cfg.mustInput == 0){
					opHtml = opHtml.replace('{#disabled}','disabled');
				}else if(cfg.mustInput == 2){
					opHtml = opHtml.replace('{#disabled}','');
				}
			}
			console.log(opHtml);
			return _radio.replace('{#radiobox}', opHtml);
		}
	},
	Textarae: function(cfg){
		this.getName = function(){
			return "Textarae";
		};
		this.getHtml = function(){
			var className = "inputTextarea";
			var property = Form.getProperty(cfg);
			var input = _textarae.replace('{#id}', cfg.id).replace('{#value}', cfg.value).replace('{#cstProperty}', property);
			
			input = input.replace('{#rows}', cfg.rows);
			//0：只读 1：可选输入 2：必须输入';
			if(cfg.mustInput == 0){
				input = input.replace('{#readonly}','readonly');
				className = "inputTextareaRead";
			}else if(cfg.mustInput == 2){
				input = input.replace('{#readonly}','');
				className = "inputTextareaCheck";
			}
			
			input = input.replace('{#class}',className);
			return input;
		}
	},
	RichText: function(cfg){
		this.getName = function(){
			return "RichText";
		};
		this.getHtml = function(){
			Form.getProperty(cfg);
			var rows = cfg.rows * 50;
			var input = _richText.replaceAll('{#id}', cfg.id).replace('{#height}', rows);
			//0：只读 1：可选输入 2：必须输入';
			if(cfg.mustInput == 0){
				input = input.replace('{#mustInput}', "true");
			}
			else {
				input = input.replace('{#mustInput}', "false");
			}

			//alert(cfg.mustInput);
			/*
			//0：只读 1：可选输入 2：必须输入';
			if(cfg.mustInput != 0){
				input = input.replace('{#button}','<div style="height:20px;margin-top:5px;" class="formlink"><a style="cursor: pointer;" href="javascript:editRichText(\''+cfg.id+'\')" >编辑富文本信息</a></div>');
			}else{
				input = input.replace('{#button}','');
			}
			*/
			//input = input.replace('{#button}','');
			return input;
		}
	},
	Group: function(cfg){
		this.getHtml = function(){
			var html = _group.replace('{#title}', cfg.title);
			//viewable;//是否显示 1:显示 0:不显示
			//wrapable;//是否可收缩展开 1:展开 0:不可展开
			//defaultwrap;//默认展开 1:展开 0:收缩
			if(cfg.viewable == '1'){
				html = html.replace('{#display}','');
			}else{
				html = html.replace('{#display}','display:none');
			}
			if(cfg.wrapable == '1'){
				html = html.replace('{#click}','Form.displayGroup(this,\'{#tableID}\',\'{#groupID}\')');
			}else{
				html = html.replace('{#click}','');
			}
			if(cfg.defaultWrap == '1'){
				html = html.replace('{#icon}','formgroup_icon_visible');
				html = html.replace('{#formgroup}','formgroup2');
			}else{
				html = html.replace('{#icon}','formgroup_icon_hidden');
				html = html.replace('{#formgroup}','formgroup');
			}
			
			return html;
		}	
	},
	displayGroup: function(obj,divName,grpName){
		var objArr = obj.getElementsByTagName('div');
		for(var i=0;i<objArr.length;i++){
			if(objArr[i].className == 'formgroup_icon_hidden'){
				objArr[i].className = 'formgroup_icon_visible';
				break;
			}
			if(objArr[i].className == 'formgroup_icon_visible'){
				objArr[i].className = 'formgroup_icon_hidden';
				break;
			}
		}
		
		var objGroup = document.getElementById(divName);
		if(objGroup.style.display == undefined || objGroup.style.display == ''){
			objGroup.style.display = 'none';
		}else{
			objGroup.style.display = '';
		}
		
		
	},
	getFieldData: function(){
		$(document.body).trigger("mousedown");
		var fieldList = Form.formFieldList;
		var list = [];
		for(var i=0;i<fieldList.length;i++){
			var field = fieldList[i];
			this.FieldHelper.process(field);
			list.push(field);
		}
		return list;
	},	

//	字段的类型 
//	0：字符串; 1：多行文本; 2：金额; 4：数字; 8：时间; 
//	11：单选列表; 12：复选列表; 15 单选框;	16: 复选框;
//	81: 复选用户; 82: 复选项目; 83：复选部门; 91: 用户; 92：项目; 93：部门; 
//	94：实体; 97：合同; 98：项目群； 999: 通用查找
//	Form.FieldHelper.registHandler({
//		handleThis: function(field){
//			return field.propertyType==12;
//		},
//		process: function(field){
//			var obj = document.getElementById(field.id);
//			var arrValue = [];
//			for(var j=0;j<obj.options.length;j++){
//				if(obj.options[j].selected){
//					arrValue.push(obj.options[j].value);
//				}
//			}
//			field.value = arrValue.toString();
//			return field;
//		}
//	});
	FieldHelper:{
		handlers: [],
		/**扩展字段处理引擎*/
		registHandler: function(handle){
			this.handlers.push(handle);
		},
		process: function(field){
			/**用户扩展处理引擎*/
			var activeHandler = undefined;
			for(var i=0, len=this.handlers.length;i<len;i++){
				var handler = this.handlers[i];
				if(handler.handleThis(field)){
					activeHandler = handler;
				}
			}
			if(activeHandler){
				activeHandler.process(field);
				return field;
			}
			//默认处理引擎
	    	var typeStr = ","+field.propertyType+",";
	    	if(',0,1,2,4,5,6,7,13,14,'.indexOf(typeStr)>=0){
	    		var obj = document.getElementById(field.id);
				if(',13,14,'.indexOf(typeStr)>=0){
					field.value = obj.getAttribute("hidID");
				}else{
					field.value = obj.value || "";
				}
		    }else if(',9,10,8,'.indexOf(typeStr)>=0){// 单选框  复选框
		    	var arrValue = [];
				var obj = document.getElementsByName(field.id);
				for(var j=0;j<obj.length;j++){
					if(obj[j].checked){
						arrValue.push(obj[j].value);
					}
				}
				field.value = arrValue.toString();
		    }else if(',3,'.indexOf(typeStr)>=0){//富文本
		    	field.value = encodeURIComponent(document.getElementById('preview4Ueditor_'+field.id).contentWindow.getValue());
		    }else if(',12,'.indexOf(typeStr)>=0){//附件
		    	
		    	console.log($("#"+field.id+"_list>a"));
		    	var f=$("#"+field.id+"_list>a");
		    	
		    	var ids="";
		    	
		    	for(var k=0;k<f.length;k++){
		    		if(k==0){
		    			ids=ids+$(f[k]).attr("data");
		    		}else{
		    			ids=ids+","+$(f[k]).attr("data");
		    		}
		    		
		    	}
		    	field.value = ids;
		    }
			return field;
		}
	}
};



function resizeBatchFrame(size,frameId){
	var bf=document.getElementById(frameId);
	if(bf){
		bf.style.height=size+'px';
	}
	var rf=frameId.substring(0,frameId.length-2);
}
/*
function flashChecker(nv){
	try{
	nv=parseFloat(nv);
    var hasFlash=0;　　　　//是否安装了flash
    var flashVersion=0;　　//flash版本
    if(document.all){
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash'); 
        if(swf){
	        hasFlash=true;
	        VSwf=swf.GetVariable("$version");
	        flashVersion=parseFloat(VSwf.split(" ")[1].replace(/,/g,'.'));
	       
        }
    }else{
        if(navigator.plugins&&navigator.plugins.length>0){
	        var swf=navigator.plugins["Shockwave Flash"];
	        if (swf){
	        	hasFlash=true;
	            var words = swf.description.split(" ");
	            for (var i = 0; i < words.length; ++i){
	                 if(isNaN(parseFloat(words[i]))) 
	                	 continue;
	                 flashVersion = parseFloat(words[i]);
	        	}
	        }
        }
	}
    if(hasFlash&&flashVersion>=nv){
    	return true;
    }else{
    	return false;
    }
	}catch(e){
		return false;
	}
}

(function(){	
	var func=function(){
		if(flashChecker(9.0)){
			jQuery('.batchUploadFrame').each(function(){
				var cur=this;
				var cfgName=cur.getAttribute("cfgName");
				if(cfgName){
					if(!window[cfgName].isMultiFile){
						return;
					}
				}				
				var frameId=cur.getAttribute('frameId')||'';
				var frameType=cur.getAttribute('frameType');
				var hasListFrame=cur.getAttribute('hasListFrame')||'0';
				var realfileFrameId=cur.getAttribute('realfileFrameId')||'fileIfrm1';
				var frameSrc=cur.getAttribute('frameSrc')||'/project/document/batUploadabs.jsp?time=10000';
				cur.innerHTML=' <iframe name="'+frameId+'" id="'+frameId+'" allowtransparency="true" src="'+frameSrc+'&type='+frameType+'&msgID='+frameId+'&realfileFrameId='+realfileFrameId+'&hasListFrame='+hasListFrame+'" frameborder="0" scrolling="no"  style="width:100%;height:20px;" ></iframe>';
				cur.style.height='20px';				
			});
		};		
	};
	if(window.attachEvent){
		window.attachEvent('onload',func);
	}else{
		window.addEventListener('load',func,false);
	}
})();
*/

function getRichTextDivHtml(divName){
	return $('#'+divName).html();
}

//选择框
function toSearch(objid, entityID, ff) {
	var cfg = new Object();
	cfg.entityID = entityID;
	cfg.multiple = ff;
	var array = new Array();
	try {
		var uname = $('#' + objid).val();
		var uid = $('#' + objid).attr('hidID');
		if (null != uid && '' != uid) {
			var uids = uid.split(',');
			var unames = uname.split(',');
			for (var i = 0, len = uids.length; i < len; i++) {
				var map = {};
				map['id'] = uids[i];
				map['sname'] = unames[i];
				array.push(map);
			}
		}
		cfg.checkedObj = array;
	} catch (e) {
	}
	
	if (objid.indexOf("roleid") != -1) {// 根据角色选择用户
		cfg.condition = "id in (select userid from org_userroleinfo where roleid=" + objid.replace("roleid", "") + ")";
	} else {
		cfg.condition = "";
	}
	// cfg.width = "90%";//设置弹框宽度
	// cfg.height = "70%";//设置弹框高度
	parent.Chosen.chosenEntity(cfg, function(data) {
		var ids = "";
		var names = "";
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				if (i == 0) {
					ids = data[0].iid;
					names = data[0].sname;
				} else {
					ids = ids + "," + data[i].iid;
					names = names + "," + data[i].sname;
				}
			}
			$('#' + objid).val(names);
			$('#' + objid).attr("hidID", ids);

		} else {
			$('#' + objid).attr("hidID", '');
			$('#' + objid).val('');
		}
	});
}


