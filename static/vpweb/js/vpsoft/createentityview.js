var appendStr='';
var appendStrToDel='';
var selectedObj;
var isDel=false;
var isAdd=false;

function disableMove(){
	$("#moveArea").sortable("disable");
}
function activeMove(){
	$("#moveArea").sortable("enable");
}
/**
 * 
 * @param {} obj
 */
function selectRowToAdd(obj){	
	if(selectedObj!=$(obj))
    selectedObj=$(obj);
	
   $(obj).css("background-color","#cccccc");
   $(obj).siblings("[aliasName='selectableRow']").css("background-color","#ffffff");
   $("table[aliasName='selectedRow']").css("background-color","#ffffff");
   $("#delSelected").attr("disabled",true);
   $("#addSelected").removeAttr("disabled");
   isDel=false;
   isAdd=true;
}
/** 
 * @param {} obj
 */
function selectRowToDel(obj){
	if(selectedObj!=$(obj))
     selectedObj=$(obj);
  	$(obj).css("background-color","#cccccc");
  	$(obj).siblings("[aliasName='selectedRow']").css("background-color","#ffffff");
 	$("tr[aliasName='selectableRow']").css("background-color","#ffffff");
 	$("#delSelected").removeAttr("disabled");
  	$("#addSelected").attr("disabled",true);
   	isDel=true;
   	isAdd=false;
}
/**
 * 
 * @return {Boolean}
 */
function doAddRow(){ 
	if(isDel)return false;
	if(!selectedObj )return false;
	var dataTypeMap=new FastMap();
	dataTypeMap.add("0","");
	dataTypeMap.add("1","");
	globalSequencekey++;
   var selectedVal=selectedObj.attr("aliasVal");
   
   var fieldName=selectedVal.split(",")[0];
   var dataType=selectedVal.split(",")[1];
   var displayName=selectedVal.split(",")[2];
   var fieldiid=selectedVal.split(",")[3];

   appendStr='<table id=\"selected_'+globalSequencekey+'\" onclick=\"selectRowToDel(this);\" aliasName=\"selectedRow\"  width=\"96%\" border=\"0\" cellspacing=\"0\" ' 
   appendStr+='aliasVal=\"'+fieldName+','+dataType+','+displayName+'\" '
   appendStr+='style=\"table-layout: fixed;border-top: solid white 0px;border-bottom: solid #ededed 1px;cursor:default; \" onmouseup=\"this.style.cursor=\'auto\';\" onmousedown=\"this.style.cursor=\'move\';\" >'
   appendStr+='<tr >'
   appendStr+='	<td width=\"50%\" style=\"padding-left:10px;\">'+displayName+'</td>'
   appendStr+='<td width="25%" style="padding-left:10px;">';
   appendStr+='<select name="inputType" class="inputSelect"  fieldName=\"'+fieldName+'\" fieldiid=\"'+fieldiid+'\" style="width:90%">';	
	
	if(iconstraint==2){
		appendStr+='<option value="2"  selected>只读</option>';
		appendStr+='<option value="1"  >可选输入</option>';
		appendStr+='<option value="0"  >必须输入</option>';
	} else if(iconstraint==1){
		appendStr+='<option value="2"  >只读</option>';
		appendStr+='<option value="1"  selected>可选输入</option>';
		appendStr+='<option value="0"  >必须输入</option>';
	}else{
		appendStr+='<option value="2"  >只读</option>';
		appendStr+='<option value="1"  >可选输入</option>';
		appendStr+='<option value="0" selected >必须输入</option>';
	}
	appendStr+='</select></td>';
   appendStr+='	<td width="25%" style=\"padding-left:10px;\"><input name=\"colWidth\" class=\"inputText\" fieldName=\"'+fieldName+'\" sequencekey=\"'+globalSequencekey+'\" fieldiid=\"'+fieldiid+'\" type=\"text\" value=\"0\" style=\"width:92%;\"></td>'
   appendStr+='</tr>'
   appendStr+='</table>';
   $(appendStr).appendTo("#moveArea");
   appendStr='';
   selectedObj.remove();
   selectedObj=false;

}
function doAddRowobj(values){ 
	if(!values )return false;
	globalSequencekey++;
   var selectedVal=values;
   var fieldName=selectedVal.split(",")[0];
   var dataType=selectedVal.split(",")[1];
   var displayName=selectedVal.split(",")[2];
   var fieldiid=selectedVal.split(",")[3];
   var iwidth=selectedVal.split(",")[4];
   if (iwidth == 0 || iwidth == '') {
	   iwidth = 100;
   }
   var iconstraint=selectedVal.split(",")[5];
   appendStr='<table id=\"selected_'+globalSequencekey+'\" onclick=\"selectRowToDel(this);\" aliasName=\"selectedRow\"  width=\"96%\" border=\"0\" cellspacing=\"0\" ' 
   appendStr+='aliasVal=\"'+fieldName+','+dataType+','+displayName+'\" '
   appendStr+='style=\"table-layout: fixed;border-top: solid white 0px;border-bottom: solid #ededed 1px;cursor:default; \" onmouseup=\"this.style.cursor=\'auto\';\" onmousedown=\"this.style.cursor=\'move\';\" >'
   appendStr+='<tr >'
   appendStr+='	<td width=\"50%\" style=\"padding-left:5px;\">'+displayName+'</td>'
   appendStr+='<td width="15%" id="iconstrainttd'+fieldName+'" style="padding-left:10px;">';
   appendStr+='<select name="inputType" class="inputSelect"  fieldName=\"'+fieldName+'\" fieldiid=\"'+fieldiid+'\" style="width:90%">';	
	
	if(iconstraint==2){
		appendStr+='<option value="2"  selected>只读</option>';
		appendStr+='<option value="1"  >可选输入</option>';
		appendStr+='<option value="0"  >必须输入</option>';
	} else if(iconstraint==1){
		appendStr+='<option value="2"  >只读</option>';
		appendStr+='<option value="1"  selected>可选输入</option>';
		appendStr+='<option value="0"  >必须输入</option>';
	}else{
		appendStr+='<option value="2"  >只读</option>';
		appendStr+='<option value="1"  >可选输入</option>';
		appendStr+='<option value="0" selected >必须输入</option>';
	}
	appendStr+='</select></td>';   
   appendStr+='	<td width=\"15%\"  style=\"padding-left:5px;\"><input name=\"colWidth\" class=\"inputText\" fieldName=\"'+fieldName+'\" sequencekey=\"'+globalSequencekey+'\" fieldiid=\"'+fieldiid+'\" type=\"text\" value=\"'+iwidth+'\" style=\"width:99%;\"></td>'
   appendStr+='	<td width=\"15%\" style=\"padding-left:5px;\"><input name=\"coldisplay" class=\"inputText\" fieldName=\"'+fieldName+'\" sequencekey=\"'+globalSequencekey+'\" fieldiid=\"'+fieldiid+'\" type=\"checkbox" value=\"'+iconstraint+'\" '+(iconstraint==-1?"checked=\"true\"":"")+' style=\"width:99%;\"></td>'
   appendStr+='</tr>'
   appendStr+='</table>';
   $(appendStr).appendTo("#moveArea");
   appendStr='';

}
/**
 * 
 * @return {Boolean}
 */
function doDelRow(){
	if(isAdd) return false;
	if(!selectedObj)return false;
	var dataTypeMap=new FastMap();
	dataTypeMap.add("0","");
	dataTypeMap.add("1","");
	globalSequencekey--;

	resortSequencekey();
	selectedObj.remove();
	selectedObj=false;
	return;
}
function  resortSequencekey(){ 
	var curSeque=selectedObj.find("input").attr("sequencekey");
	selectedObj.siblings("[aliasName='selectedRow']").each(function(){
		var v_input=$(this).find("input");
		var v_seque=v_input.attr("sequencekey");
		if(v_seque>curSeque){
		 v_input.attr("sequencekey",Number(v_seque)-1);
		}
	});
}

/**
 *
 */
function doAddAllRow(objs){
	//$("tr[aliasName='selectableRow']").each(function(){
	 	//selectRowToAdd($(this));
	 	doAddRow();
	//});

} 
/**
 * 
 */
function doDelAllRow(){
	$("table[aliasName='selectedRow']").each(function(){
	 	selectRowToDel($(this));
	 	doDelRow();
	});
}

/**
 * 
 * @param {} resObj
 */
function clickBtn(resObj){
	switch(resObj.buttonID){
		case 'savaBtn':
		saveViewInfo(resObj);
			break;
		case 'calBtn':
			parent.doClose();//top.window.close();
			break;
		case 'editBtn':
		
			break;
	}
}

function checkSortField(obj){
	var val = obj.value;
	if(val != ''){
		var sortRule = $('#sortRule').val();
		var html = '<option value="asc"></option><option value="desc"></option>';
		$('#sortRule').html(html);
		$('#sortRule').val(sortRule);
	}else{
		var html = '<option value="" checked>-----</option>';
		$('#sortRule').html(html);
	}
}

