function resizeBatchFrame(size,frameId){
	var bf=document.getElementById(frameId);
	if(bf){
		bf.style.height=size+'px';
	}
	
}
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
				
				var frameId=cur.getAttribute('frameId')||'';
				var frameType=cur.getAttribute('frameType');
				var hasListFrame=cur.getAttribute('hasListFrame')||'0';
				var realfileFrameId=cur.getAttribute('realfileFrameId')||'fileIfrm1';
				var frameSrc=cur.getAttribute('frameSrc')||'/project/document/batUploadabsFlow.jsp?time=10000';
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