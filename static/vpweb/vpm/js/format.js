

function formatNumber(num,pattern){  
  //处理正负号
  var flg = num.toString().substr(0,1);
  //alert(flg);
  if(flg=='-'){
  	num=num.toString().substr(1,num.lenth);
  } 
  var strarr = num?num.toString().split('.'):['0'];   
  var fmtarr = pattern?pattern.split('.'):[''];   
  var retstr='';   
  
  // 整数部分   
  var str = strarr[0];   
  var fmt = fmtarr[0];   
  var i = str.length-1;     
  var comma = false;   
  for(var f=fmt.length-1;f>=0;f--){   
    switch(fmt.substr(f,1)){   
      case '#':   
        if(i>=0 ) retstr = str.substr(i--,1) + retstr;   
        break;   
      case '0':   
        if(i>=0) retstr = str.substr(i--,1) + retstr;   
        else retstr = '0' + retstr;   
        break;   
      case ',':   
        comma = true;   
        retstr=','+retstr;   
        break;   
    }   
  }   
  if(i>=0){   
    if(comma){   
      var l = str.length;   
      for(;i>=0;i--){   
        retstr = str.substr(i,1) + retstr;   
        if(i>0 && ((l-i)%3)==0) retstr = ',' + retstr;    
      }   
    }   
    else retstr = str.substr(0,i+1) + retstr;   
  }   
  
  retstr = retstr+'.';   
  // 处理小数部分   
  str=strarr.length>1?strarr[1]:'';   
  fmt=fmtarr.length>1?fmtarr[1]:'';   
  i=0;   
  for(var f=0;f<fmt.length;f++){   
    switch(fmt.substr(f,1)){   
      case '#':   
        if(i<str.length) retstr+=str.substr(i++,1);   
        break;   
      case '0':   
        if(i<str.length) retstr+= str.substr(i++,1);   
        else retstr+='0';   
        break;   
    }   
  }   
  retstr=retstr.replace(/^,+/,'').replace(/\.$/,''); 
  if(flg=='-'){
  	retstr=flg+retstr;
  }
  return retstr;   
}   

function num(value){
   var num = new Number(value);
   return num.toFixed(2);
}
function percent(n1,n2){
   n1 = parseFloat(document.getElementById(n1).value);
   n2 = parseFloat(document.getElementById(n2).value);

   if(n2 == 0){
      return num(0);
   }else{
      return num(n1/n2*100);
   }
}

function sum(exp){
	var result = 0.0;

	if(exp.indexOf(":") != -1){
		var exp = exp.split(":");

		for(var i=parseInt(exp[0].replace("D",""));i<=parseInt(exp[1].replace("D",""));i++){
			result += parseFloat(document.getElementById("D"+i).value);
		}
		
		for(var i=parseInt(exp[0].replace("C",""));i<=parseInt(exp[1].replace("C",""));i++){
			result += parseFloat(document.getElementById("C"+i).value);
		}
		
	}else if(exp.indexOf("+") != -1){
		var exp = exp.split("+");
		result = parseFloat(document.getElementById(exp[0]).value) + parseFloat(document.getElementById(exp[1]).value);
	}else if(exp.indexOf("-") != -1){
		var exp = exp.split("-");
		result = parseFloat(document.getElementById(exp[0]).value) - parseFloat(document.getElementById(exp[1]).value);
	}else{
		return result;
	}

	return num(result);
}

function formatin(){
   //使用jquery的选择器更新百分比
   $("[@id^=D]").each(function(i) {//这种^=的选择器可以得到用=号右侧的字符串开头的元素的集合
   		var dd = this.id;
   		//alert(this.id);
   		if(!($(this).val().indexOf("%")>0))
			$(this).attr('value',replaceAll($(this).val(),',',''));		
	});
	$("[@id^=C]").each(function(i) {//这种^=的选择器可以得到用=号右侧的字符串开头的元素的集合
   		var dd = this.id;
   		//alert(this.id);
   		if(!($(this).val().indexOf("%")>0))
			$(this).attr('value',replaceAll($(this).val(),',',''));		
	});
}

function formatout(){
   //使用jquery的选择器更新百分比
   $("[@id^=D]").each(function(i) {//这种^=的选择器可以得到用=号右侧的字符串开头的元素的集合
   		var dd = this.id;
   		//alert(this.id);
   		if(!($(this).val().indexOf("%")>0)||!($(this).val().indexOf(",")>0))
			$(this).attr('value',formatNumber($(this).val(),'#,##0.00'));		
	});
	$("[@id^=C]").each(function(i) {//这种^=的选择器可以得到用=号右侧的字符串开头的元素的集合
   		var dd = this.id;
   		//alert(this.id);
   		if(!($(this).val().indexOf("%")>0)||!($(this).val().indexOf(",")>0))
			$(this).attr('value',formatNumber($(this).val(),'#,##0.00'));		
	});
	$("[@id^=EMinus]").each(function(i) {//这种^=的选择器可以得到用=号右侧的字符串开头的元素的集合
   		var dd = this.id;
   		//alert(this.id);
   		if(!($(this).val().indexOf("%")>0)||!($(this).val().indexOf(",")>0))
			$(this).attr('value',formatNumber($(this).val(),'#,##0.00'));		
	});
}

