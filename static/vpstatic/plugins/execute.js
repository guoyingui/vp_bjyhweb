function formeven(param,fun){
  if(isExitsFunction(fun)){
    var result = eval(fun+"("+JSON.stringify(param)+")");
    return result;
  }else{
	  if(fun!=undefined){
		  console.log("表单中'"+fun+"'方法未定义！")
      }
  }
}

function onChangeEvent(eventname,param){
    if(isExitsFunction(eventname)){
      var result = eval(eventname+"("+JSON.stringify(param)+")");
      return result;
    }else{
    	if(eventname!=undefined){
            console.log("onchange中'"+eventname+"'方法未定义！")
          }
    }
}

function isExitsFunction(funcName) {
  try {
    if (typeof(eval(funcName)) == "function") {
      return true;
    }
  } catch(e) {}
  return false;
}



