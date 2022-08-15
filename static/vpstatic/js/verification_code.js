(function () {
    var Verification = function (targetDom, options) {
        if (!(this instanceof Verification)) {
			return new Verification(targetDom, options);
		}else {
			this.options = options;
			this.targetDom = document.getElementById(targetDom);
			var html = 
				"<div class='slide-box'>" +
					"<div class='slide-img-block'>" +
						"<div class='slide-img-border'>" +
							"<div class='slide-img-div'>" +
								"<div class='scroll-background slide-bottom-refresh' id='refreshBtn' title='更换图片'></div>" +
								"<div class='slide-img-nopadding'>" +
									"<img class='slide-img' id='slideImg' src='' />" +
									"<div class='slide-block' id='slideBlock'></div>" +
									"<div class='slide-box-shadow' id='cutBlock'></div>" +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
					"<div class='scroll-bar'>" +
						"<div style='display: inline-block;position: absolute;left:0;height:40px' id='slideHintBox'></div>" +
						"<div class='slide-btn' id='slideBtn'>" +
							"<span class='icon-light' id='slideIcon'></span>" +
						"</div>" +
						"<div class='slide-title' style='display: inline-block' id='slideHint'>" +
							"<div style='display: inline-block' id='slideHintText'>按住滑块，拖动完成拼图</div>" +
						"</div>" +
					"</div>" +
				"</div>";
			this.targetDom.innerHTML = html;
			this.slideBtn = document.getElementById("slideBtn");               
			this.refreshBtn = document.getElementById("refreshBtn");           
			this.slideHint = document.getElementById("slideHint");             
			this.slideHintBox = document.getElementById("slideHintBox");       
			this.slideHintText = document.getElementById("slideHintText");     
			this.slideImg = document.getElementById("slideImg");                
			this.cutBlock = document.getElementById("cutBlock");               
			this.slideBlock = document.getElementById("slideBlock");            
			this.slideIcon = document.getElementById("slideIcon");               
			this.resultX = 0;
			this.startX = 0;
			this.timer = 0;
			this.startTamp = 0;
			this.endTamp = 0;
			this.x = 0;
			this.imgWidth = 350;
			this.imgHeight = 116;
			this.imgList = [];
			this.isSuccess = true;
			this.cutImgUrl = "";
			for (var i = 1; i < 10; i++) {
				this.imgList.push(i + ".jpg");
			};
			this.eveInit();
			this.cutImg();
		}
    }
    Verification.prototype = {
        eveInit: function () {
            this.event();
        },
        extend: function (obj, obj2) {
            for (var k in obj2) {
                obj[k] = obj2[k];
            }
            return obj;
        },
        event: function () {
            var _this = this;
            _this.reToNewImg();
            _this.slideBtn.onmousedown = function(event){
                _this.mousedown(_this, event);
            } 
            _this.refreshBtn.onclick = function(){
                _this.refreshBtnClick(_this);
            }
        },
        refreshBtnClick: function(_this){
            _this.isSuccess = true;
            _this.slideBlock.style.cssText = "";
            _this.cutBlock.style.cssText = "";
			_this.reToNewImg(true);
			this.cutImg();
        },
        reToNewImg: function (bool) {
            var _this = this;
            var index = Math.round(Math.random() * 8);        
			var imgSrc = "../vpstatic/images/login/" + _this.imgList[index] + "";
            _this.slideImg.setAttribute("src", imgSrc);
            _this.slideBlock.style.backgroundImage = "url("+ imgSrc +")";
            _this.slideImg.onload = function (e) {
				var _event = e || window.event; 
				if(_event.stopPropagation) { 
					_event.stopPropagation(); 
				}else{ 
					_event.returnValue = false; 
					if(!bool) {
						_this.cutImgUrl = imgSrc;
						_this.slideBlock.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+imgSrc+",sizingMethod='scale')";
					}
				}
                _this.imgWidth = _this.slideImg.offsetWidth;           
                _this.imgHeight = _this.slideImg.offsetHeight;        
            }
        },
        cutImg: function (e) {
            var _this = this;
			var _cutImgUrl;
            _this.cutBlock.style.display = "block";
            var cutWidth = _this.cutBlock.offsetWidth;   
			var cutHeight = _this.cutBlock.offsetHeight; 
            _this.resultX = Math.floor(Math.random() * (_this.imgWidth - cutWidth * 2 - 4) + cutWidth);
            var cutTop = Math.floor(Math.random() * 68 + 5);
            _this.cutBlock.style.cssText = "top:" + cutTop + "px;" + "left:" + _this.resultX + "px; display: block;";
			_this.slideBlock.style.top = cutTop + "px";
			var userAgent = navigator.userAgent;
	      	var fIEVersion = parseFloat(RegExp["$1"]);
			if (fIEVersion != 8) { 
				_this.slideBlock.style.backgroundPosition = "-" + _this.resultX + "px -" + cutTop + "px";
			 }
            _this.slideBlock.style.opacity = "1";
			_this.slideBlock.style.filter = "alpha(opacity=1)";
			if(_cutImgUrl != _this.cutImgUrl) {
				_this.slideBlock.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+_this.cutImgUrl+",sizingMethod='scale')";
			}
			_cutImgUrl = _this.cutImgUrl;
		},
        mousedown: function (_this, e) {
			var _event = e || window.event; 
			if(_event.preventDefault) { 
				_event.preventDefault(); 
			}else{ 
				_event.returnValue = false; 
			}
			_this.startX = _event.clientX;
            _this.startTamp = (new Date()).valueOf();
            if(_this.isSuccess){
				_this.imgWidth = _this.slideImg.offsetWidth;
				_this.imgHeight = _this.slideImg.offsetHeight;
            }
			if(document.addEventListener){
				document.addEventListener('mousemove', mousemove);
				document.addEventListener('mouseup', mouseup);
			}else{
				document.attachEvent('onmousemove',mousemove);
				document.attachEvent('onmouseup',mouseup);
			}
            function mousemove(e) {
				var _event = e || window.event; 
                _this.x = _event.clientX - _this.startX;
                if (_this.x < 0) {
                    _this.slideBtn.style.left = "0px";
                    _this.slideBlock.style.left = "2px";
				} else if (_this.x >= 0 && _this.x <= 305) {
                    _this.slideBtn.style.left = _this.x + "px";
                    _this.slideBlock.style.left = _this.x + "px";
                } else {
					_this.slideBtn.style.left = "305px";
                    _this.slideBlock.style.left = "305px";
                }
                _this.slideBtn.style.transition = "none";
                _this.slideBlock.style.transition = "none";
				_this.slideHintText.innerHTML = "";
				_this.slideHintBox.style.width = _this.slideBtn.style.left;
				_this.slideHintBox.style.transition = "width 0s";
            };
            function mouseup(e) {
				if(document.removeEventListener){
					document.removeEventListener('mousemove', mousemove);
					document.removeEventListener('mouseup', mouseup);
				}else{
					document.detachEvent('onmousemove',mousemove);
					document.detachEvent('onmouseup',mouseup);
				}
                var left = _this.slideBlock.style.left;
                left = parseInt(left.substring(0, left.length-2));
                if(_this.resultX > (left - 5) && _this.resultX < (left + 5)){
                    _this.isSuccess = false;
                    _this.endTamp = (new Date()).valueOf();
                    _this.timer = ((_this.endTamp - _this.startTamp) / 1000).toFixed(1);
                    _this.slideBlock.style.opacity = "0";
					_this.slideBlock.style.filter = "alpha(opacity=0)";
                    _this.slideBlock.style.transition = "opacity 0.6s";
                    _this.cutBlock.style.opacity = "0";
					_this.cutBlock.style.filter = "alpha(opacity=0)";
                    _this.cutBlock.style.transition = "opacity 0.6s";
                    _this.slideIcon.style.backgroundPosition = "0 -471px";
					_this.slideIcon.style.width = "17px";
					_this.slideIcon.style.height = "11px";
					_this.slideHint.style.opacity = "0";
					_this.slideHint.style.filter = "alpha(opacity=0)";
					_this.slideHintBox.style.backgroundColor = "#d2f4ef";
					_this.slideBtn.style.backgroundColor = "#52ccba";
					_this.refreshBtn.style.display = "none";
					_this.options.success&&_this.options.success();
					_this.mousedown = function (params) {};
                }else{
					if (_this.startX != e.clientX) {
						_this.isSuccess = false;
						_this.slideBlock.style.left = "2px";
						_this.slideBlock.style.transition = "left 0.6s";
						_this.slideIcon.style.backgroundPosition = "0 -82px";
						_this.slideIcon.style.height = "12px";
						_this.slideHintBox.style.backgroundColor = "#fce1e1";
						_this.slideBtn.style.backgroundColor = "#f57a7a";
						_this.slideBtn.style.left = "0";
						_this.slideHintBox.style.width = 0;
						_this.slideHintBox.style.transition = "width 0.6s";
						_this.slideHintBox.style.border = 0;
						_this.slideBtn.style.transition = "left 0.6s";
						_this.reToNewImg();
						_this.cutImg(e);
					}
                    _this.options.fail&&_this.options.fail();
					setTimeout(function(){
						_this.slideIcon.style.backgroundPosition = "0 -26px";
						_this.slideBtn.style.backgroundColor = "#fff";
						_this.slideHintBox.style.backgroundColor = "";
						_this.slideHintText.innerHTML = "按住滑块，拖动完成拼图";
					}, 600);
                }
            }
        }
	}
	window.Verification = Verification;
})();