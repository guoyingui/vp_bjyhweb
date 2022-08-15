var NumberUtils = {
	//添加千分符
	addComma:function(num){
		var numStr = num+"";
		if(numStr=="" || isNaN(num)){
			return "";
		}
		num = num+"";
		if(/^.*\..*$/.test(num)){
			var pointIndex =num.lastIndexOf(".");
			var intPart = num.substring(0,pointIndex);
			var pointPart =num.substring(pointIndex+1,num.length);
			intPart = intPart +"";
			var re =/(-?\d+)(\d{3})/
			while(re.test(intPart)){
				intPart =intPart.replace(re,"$1,$2")
			}
			num = intPart+"."+pointPart;
		}else{
			num = num +"";
			var re =/(-?\d+)(\d{3})/
			while(re.test(num)){
				num =num.replace(re,"$1,$2")
			}
		}
		return num;
	},
	//删除千分符
	deleteComma:function(num){
		var numStr = num+"";
		if((num+"")==""){
			return"";
		}
		num=num.replace(/,/gi,'');
		return num;
	}
};
//将页面对象处理为JSON格式
var json={
	isSimple:function(o){
		var is=false;
		var type=Object.prototype.toString.apply(o);
		if(type=='[object Array]'||type=='[object Function]'||type=='[object Object]'){
			is=false;
		}else{
			is=true;
		}
		return is ;
	},isInput:function(o){
		return Object.prototype.toString.apply(o)=='[object HTMLInputElement]';
	},isObj:function(o){
		var type=Object.prototype.toString.apply(o);
		return type=='[object Object]';
	},isArray:function(o){
		return Object.prototype.toString.apply(o)=='[object Array]';
	},isFunc:function(o){
		return Object.prototype.toString.apply(o)=='[object Function]';
	},isSimple:function(o){
		var type=Object.prototype.toString.apply(o);
		return (type=='[object String]'||type=='[object Number]');
	},isNumber:function(o){
		var type=Object.prototype.toString.apply(o);
		return type=='[object Number]';
	},toJSON:function(o){
		if(json.isObj(o)){
			var jstr='{',j=0;
			for(var i in o){
				var cur=o[i];
				if(cur!==undefined&&cur!==null&&!json.isFunc(cur)){
					var brace=json.isSimple(cur)?(json.isNumber(cur)?'':'"'):'';
					jstr+=(j!=0?',"':'"')+i+'":'+brace+json.toJSON(cur)+brace;
					j++;
				}
			}
			jstr+='}';
			
			return jstr;
		}else if(json.isArray(o)){
			var str=[];
			for(var k=0;k<o.length;k++){
				var cur=o[k],brace=json.isSimple(cur)?(json.isNumber(cur)?'':'"'):'';
				str.push(brace+json.toJSON(cur)+brace);
			}
			return '['+str.join(',')+']';
		}else{
			
			return o;
		}
	},toJSONEnCode:function(o){
		var str=json.toJSON(o);
		str=str.replace(/[\r\n]/g,' ');
		return encodeURIComponent(str);
		
	}
};