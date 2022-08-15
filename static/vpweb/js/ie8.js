
// IE8右侧内容区高度
if (window.innerHeight){
	winHeight = window.innerHeight;
}else{
	winHeight = document.body.clientHeight;
}

var contentMain = document.getElementById('content-main');
contentMain.style.height = winHeight - 100 + 'px'