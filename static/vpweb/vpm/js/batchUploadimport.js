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
		try{
			if(flashChecker(9.0)){
				jQuery('.batchUploadFrame').each(function(){
					var cur=this;
					var frameId=cur.getAttribute('frameId')+'_c';
					var frameType=cur.getAttribute('frameType');
					var cs=cur.childNodes;
					for(var i=0;i<cs.length;i++){
						var c=cs[i];
						if(c.style){
							c.style.display='none';
						}
					}
					var div=document.createElement('div');
					cur.appendChild(div);
					div.innerHTML='<iframe name="fileIfrm'+frameId+'" id="fileIfrm'+frameId+'" allowtransparency="true" src="/project/document/batUploadabs.jsp?type='+frameType+'&msgID='+frameId+'" frameborder="0" scrolling="no"  style="width:100%;height:20px;" ></iframe>';

					
				});
			};
		}catch(e){
			alert(e.message);
		}
		
		

		
	};
	if(window.attachEvent){
		window.attachEvent('onload',func);
	}else{
		window.addEventListener('load',func,false);
	}
})();