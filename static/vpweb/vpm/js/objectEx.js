Object.prototype.isSimple=function(){
	var is=false;
	var type=Object.prototype.toString.apply(this);
	if(type=='[object Array]'||type=='[object Function]'||type=='[object Object]'){
		is=false;
	}else{
		is=true;
	}
	return is ;
};
Object.prototype.isInput=function(){
	return Object.prototype.toString.apply(this)=='[object HTMLInputElement]';
};
Object.prototype.isObj=function(){
	var type=Object.prototype.toString.apply(this);
	return type=='[object Object]';
};

Object.prototype.isArray=function(){
	return Object.prototype.toString.apply(this)=='[object Array]';
};
Object.prototype.isFunc=function(){
	return Object.prototype.toString.apply(this)=='[object Function]';
};
Object.prototype.isSimple=function(){
	var type=Object.prototype.toString.apply(this);
	return (type=='[object String]'||type=='[object Number]');
}

Object.prototype.toJSON=function(){
	if(this.isObj&&this.isObj()){
		var json='{',j=0;
		for(var i in this){
			var cur=this[i];
			if(cur!==undefined&&cur!==null&&cur.isFunc&&!cur.isFunc()){
				var brace=cur.isSimple()?'"':'';
				json+=(j!=0?',':'')+i+':'+brace+cur.toJSON()+brace;
				j++;
			}
		}
		json+='}';
		return json;
	}else if(this.isArray&&this.isArray()){
		var str=[];
		for(var k=0;k<this.length;k++){
			var cur=this[k],brace=cur.isSimple()?'"':'';
			str.push(brace+cur.toJSON()+brace);
		}
		return '['+str.join(',')+']';
	}else{
		
		return this;
	}
};

Object.prototype.toC1JSON=function(mark){
	if(!mark)return;
	var j=0,str='{';
	for(var i in this){
		if(mark[i]&&!mark[i].isFunc()){
			str+=(j>0?',':'')+i+':'+this[i]
			j++;
		}
	}
	str+='}';
	return str;
};
Object.prototype.toJSONArrayByFields=function(fs){
	if(!fs)return;
	var mark={},len=fs.length;
	for(var k=0;k<len;k++){
		mark[fs[k]]=true;
	}
	var a=[];
	for(var i in this){
		if(this[i].isObj())
			a.push(this[i].toC1JSON(mark));
	}
	return '['+a.join(',')+']';
};

Object.prototype.toC1Obj=function(mark){
	if(!mark)return;
	var obj={};
	for(var i in this){
		if(mark[i]&&!mark[i].isFunc()){
			obj[i]=this[i];
		}
	}
	return obj;
};
Object.prototype.toObjArrayByFields=function(fs){
	if(!fs)return;
	var mark={},len=fs.length;
	for(var k=0;k<len;k++){
		mark[fs[k]]=true;
	}
	var a=[];
	for(var i in this){
		if(this[i].isObj())
			a.push(this[i].toC1Obj(mark));
	}
	return a;
};

Object.prototype.toJSONArray=function(){
	var a=[];
	for(var i in this){
		if(this[i]&&this[i].isObj&&this[i].isObj())
			a.push(this[i].toJSON());
	}
	return '['+a.join(',')+']';
};
Object.prototype.toJSONEnCode=function(){
	if(this.toJSON){
		var str=this.toJSON();
		str=str.replace(/[\r\n]/g,' ');
		return encodeURIComponent(str);
	}else{
		return '';
	}
	
};