var fullW = $(window).width(); // screen.availWidth;
var fullH = $(window).height(); // screen.availHeight;
var wEdit = screen.availWidth - 500;
if (wEdit < 860) {
	wEdit = 860;
}

var cwindow = {
	openNew:function(url, param) {
		
		this.params = param;
		
		cwindow.init(url, wEdit, fullH, 0, 0);
	},
	init:function(url, w, h, t, l){
	  
		var paramStr = '';
		var m = 0;
		for(var prop in this.params){
			paramStr += " "+prop+"='"+this.params[prop]+"'";
			if('wincount'==prop){
				m = this.params[prop];	
			}
		}
		
		// 遮罩弹出窗口层
		if(typeof($("#win_0")[0]) == "undefined") {
			$("body").prepend(""
				+ '<style>'
				+ ' div[id^=win] {'
				+ '   z-index: 1320; position: fixed; border: 0px; width: '+w+'px; height: '+h+'px;'
				+ '   top: 0px; right: 0px; background-color: #ffffff; overflow: hidden; box-shadow:-4px 0px 18px #c3c3c3; ' 
				+ ' }'
				+ '</style>'
				+ "<div id='win_"+m+"' "+paramStr+" formchangle='false'>"
				+ "  <iframe id='frmFormPage' src='"+url+"' style='border: 0px; width:"+w+"px; height:"+h+"px;'></iframe>"
				+ "</div>");

			var _jd_shadow = $("#win_"+m);
			_jd_shadow.css("width", w + "px");
			_jd_shadow.css("height", h + "px");
		}
		else {
			if(this.params['fromType']=='myflow'){
				$("#win_"+m).attr('tipName',this.params['tipName']);
				$("#win_"+m).attr('fromType','myflow');
			}else{
				$("#win_"+m).attr('tipName',this.params['tipName']);
			}
			
			document.getElementById("frmFormPage").src = url;
		}
	},
	confirm:function(callback){
		this.callback = callback;
		if(typeof($("#confirm")[0]) == "undefined") {
			var _h = 230;
			var _w = 400;
			var _t = (document.documentElement.clientHeight - _h) / 2;
			var _l = (document.documentElement.clientWidth - _w) / 2;
			$("body").prepend(""
				+ '<style>'
				+ '#lockDiv {'
				+ '  position: fixed; top:0; left:0; z-index: 1329; width:100%; height:100%; background-color:#000; '
				+ '  opacity:0.1; filter: alpha(opacity=10); display: block;'
				+ '}'
				+ ' #window {'
				+ '   z-index: 1330; border-radius: 5px; position: fixed; width: '+ _w +'px; height: '+ _h +'px;'
				+ '   top: '+ _t +'px; left: '+ _l +'px; background-color: #ffffff; overflow: hidden; box-shadow: 1px 1px 1px 1px #cccccc; ' 
				+ ' }'
				+ 'h1 {'
				+ '  width:354px; margin-top: 8px; font:18px/40px "微软雅黑", "黑体"; color:#333333;'
				+ '  letter-spacing: 3px;font-weight: 700; text-align: left;'
				+ '  margin-left: 20px;border-bottom:1px solid #f1f1f1;'
				+ '}'
				+ '.warning {'
				+ '  color: #333333; text-align: left;  line-height: 90px; vertical-align:middle;'
				+ '  width:342px; margin-left: 26px; border-radius: 5px; height: 90px; font-size: 16px;'
				+ '}'
				+ '.button {'
				+ '  line-height:32px; text-align:center; border:0px; color:#fff; min-width: 80px; font-size: 14px;'
				+ '  border-radius:5px; cursor:pointer; margin-left:32px; margin-top:10px; background: rgb(51,122,183);'
				+ '}'
				+ '.cancel {'
				+ '  background: rgb(133,154,176);'
				+ '}'
				+ '</style>'
				+ '<div id="confirm">'
				+ "  <div id='lockDiv'></div>"
				+ "  <div id='window'>"
				+ '      <h1>警告</h1> <img src="./images/close.png" style="position: absolute; top: 22px; right: 30px;" onclick="cwindow.doConfirm(this)">'
				+ '      <div class="warning">'
				+ '        未保存的数据将会丢失! 要离开此页吗?'
				+ '      </div>'
				+ '      <input id="btnsave" name="btnsave" type="button" class="button" value="保 存" onclick="cwindow.doConfirm(this)"> '
				+ '      <input id="btncancel" name="btncancel" type="button" class="button cancel" value="取 消" onclick="cwindow.doConfirm(this)"> '
				+ '      <input id="btncontinue" name="btncontinue" type="button" class="button" value="继续修改" onclick="cwindow.doConfirm(this)"> '
				+ "  </div>"
				+ '</div>'
			);
		}		
	},
	doConfirm:function(obj) {
		var flag = 0; /* 0:保存 1:继续修改 -1:取消/关闭 */
		if (obj.id == 'btnsave') {
			flag = 0;
		}
		else if (obj.id == 'btncontinue') {
			flag = 1;
		}
		else {
			flag = -1;
		}
		$("#confirm").remove();
		if (this.callback != undefined) {
			this.callback(flag);
		}
		else {
			formEvent(flag);
		}
	},
	close:function(){
		if (document.getElementById("frmFormPage"))	{
			document.getElementById("frmFormPage").location = document.getElementById("frmFormPage").location;
		}
		
		$('#win_0', parent.document).remove();
		
	}
};