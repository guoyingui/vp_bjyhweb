window._FnInvoker = {};
top.frameNames;//数组类型, 例如：["top", "right", "botton"], 需要遮盖的frame id frame元素必须有ID属性
top.cloud;//Function 类型，需要遮盖窗口时调用，例如cloud(handle); 参数handle为遮盖完成后的回调函数。
var frameMap = {};
var isCloud = false;
var initComplete = false;
function initBecloud(frameNames){
	top.frameNames = frameNames;
	initTopFrameMap();
}
function initTopFrameMap(){
	for(var f in frameNames){
		setFrame(frameNames[f]);
	}
	initComplete = true;
}
function setFrame(frameId){
	var $frame = $("#"+frameId);
	 $frame[0]&&(frameMap[frameId] = new FrameObj($frame[0]));
}
function getFrame(frameId){
	return frameMap[frameId].frame;
}
var FrameObj = function(frame){
	frame.frameObj = this;
	this.frame = frame;
	this.isReady = function(){
		var fwin = this.frame.contentWindow;
		return  fwin && fwin.document && fwin.document.readyState=="complete";
	}
	var onFrameUnLoad = function(){
		unCloud();
	}
	var onFrameLoad = function(){
		var binder = top.window._FnInvoker["frameUnloadBinder"+this.id];
		binder.obj = this.contentWindow;
		binder.invok();
	}
	var cfg = {
		id: "frameUnloadBinder"+frame.id,
		obj: frame.contentWindow,
		fn: function(){
			if(this.attachEvent){
				this.attachEvent("onunload",  onFrameUnLoad);
			}else if(this.addEventListener){
				this.addEventListener('unload',  onFrameUnLoad,  false);
			}
		},
		cdt: function(){
			return this.attachEvent || this.addEventListener;
		},
		params: undefined,
		maxTyrTime: 100
	};
	var unLoadBinder = new FnInvoker(cfg);
	$(frame).bind("load", onFrameLoad);
}
var FnInvoker = function(cfg){
	window._FnInvoker[cfg.id] = this;
	var cfg = cfg;
	this.obj = cfg.obj;
	var count = 0;
	this.invok = function(){
		if(count++>cfg.maxTyrTime){
			distory();
			count = 0;
			return;
		}
		if(cfg.cdt.call(this.obj)){
			count = 0;
			distory();
			cfg.fn.call(this.obj, cfg.params);
		}else{
			window.setTimeout("_FnInvoker['"+cfg.id+"'].invok();", 100);
		}
	}
	var distory = function(){
		//window._FnInvoker.removeAttribute(cfg.id);
	}
	window.setTimeout("_FnInvoker['"+cfg.id+"'].invok();", 100);
}

function cloud(afterCloud){
	if(tryTime>0 && tryTime<= 100 || isCloud)return;
	doCloud(afterCloud);
}
var tryTime = 0
function doCloud(afterCloud){
	_afterCloud = afterCloud;
	if(tryTime++ >= 100){
		tryTime = 0;
		return;
	}
	if(!initComplete){
		setTimeout("doCloud(_afterCloud);", 200);
		return;
	}
	var readyCount = 0;
	for(var f in frameMap){
		if(frameMap[f].isReady()){
			readyCount++;
		}
	}
	if(readyCount==frameNames.length){
		tryTime = 0;
		for(var f in frameMap){
			cloudFrame(f);
		}
		isCloud = true;
		try{
			if(afterCloud)afterCloud();
		}catch(e){
			unCloud();
		}
		_afterCloud = undefined;
	}else{
		setTimeout("doCloud(_afterCloud);", 200);
	}
}
function cloudFrame(frameId){
	$(frameMap[frameId].frame.contentWindow.document.body).append(newBecloud())
}
function newBecloud(){
	return '<div id="becloudDiv" class="becloud-div"></div>';
}
function unCloud(){
	if(isCloud==false){
		if(tryTime>0){
			tryTime=101;
		}
		return;
	}
	isCloud = false;
	for(var f in frameMap){
		unCloudFrame(f);
	}
}
function unCloudFrame(frameId){
	try{
		var frameBody = frameMap[frameId].frame.contentWindow.document.body;
		frameBody.removeChild($("#becloudDiv", frameBody)[0]);
		//$(frameBody).remove("#becloudDiv");
	}catch(e){}
}