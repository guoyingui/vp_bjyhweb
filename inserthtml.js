'use strict';
var fs = require('fs');

//遍历读取文件
+function readFile() {
    var path = "./static";
    var files = fs.readdirSync(path); 
    var _weblist = [], _css = '', _js = '';
    files.map(function(item, index) {
        if(item.indexOf("web") !== -1 && item!='frameweb') {  //在开发模式时排除frameweb的相关文件，因为此时菜单取的是vplat包
            _weblist.push(item);
        }
    });
    _weblist.forEach(walk);
    function walk(file) {
        var filelist = fs.readdirSync(path + '/' + file);
        filelist.map(function(item, index) {
            if (/^main\.[\s\S]*\.js$/.test(item) || /^commons\.[\s\S]*\.js$/.test(item)) {
                _js += '<script src="' + '../' + file + '/' + item + '" type="text/javascript"></script>';
            }
            if (/^main[\s\S]*\.css$/.test(item) || /^commons[\s\S]*\.css$/.test(item)) {
                _css += '<link href="' + '../' + file + '/' + item + '" rel="stylesheet" />';
            }
        })
    };
    if (!process.env.MODE) _css = _js = "";
    var _html = '<!DOCTYPE html>\
        <html>\
            <head>\
                <meta charset="utf-8">\
                <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\
                <title>维普-VALM</title>\
                <link href="../vpstatic/favicon.ico" rel="icon" type="image/x-icon" />' 
                + _css +
                '<link rel="stylesheet" href="../vpstatic/style/theme.css">\
                <script src="../vpstatic/plugins/jquery-1.11.1.min.js"></script>\
                <script src="../vpstatic/plugins/execute.js"></script>\
                <script src="../vpstatic/plugins/jquery-ui.min.js"></script>\
                <script src="../vpstatic/plugins/Aes/core.min.js" type="text/javascript"></script> \
                <script src="../vpstatic/plugins/Aes/crypto-js.min.js" type="text/javascript"></script>\
                <script src="../vpstatic/plugins/Aes/aes.min.js" type="text/javascript"></script>\
                <script src="../vpstatic/plugins/Rsa/security.js" type="text/javascript"></script>\
                <script src="../vpstatic/plugins/Rsa/base64.min.js" type="text/javascript"></script>\
                <script src="../vpstatic/js/diyfun.js"></script>\
                <script src="../vpcommon/config.js"></script>\
                <script src="../vpcommon/vputils.min.js"></script>\
				<script src="../vpstatic/plugins/formevent.js"></script>\
				<script src="../vpstatic/plugins/changeevent.js"></script>\
                <!--[if lte IE 9]>\
                    <link rel="stylesheet" href="../vpstatic/style/ie8.css">\
                    <script src="../vpstatic/plugins/html5shiv.min.js"></script>\
                    <script src="../vpstatic/plugins/respond.js"></script>\
                    <script src="../vpstatic/js/ie8.js"></script>\
                <![endif]-->\
                <script>document.title = window.vp.config.URL.systemtitle;</script>\
                <script src="../vpstatic/plugins/UEditor/ueditor.config.js"></script>\
                <script src="../vpstatic/plugins/UEditor/ueditor.all.min.js"></script>\
                <script src="../dll.vendor.js"></script>\
            </head>\
            <body class="bg-gray">'
                + _js +
            '</body>\
        </html>';
    fs.writeFile('./src/index.html', _html, 'utf-8', function complete() {
        console.log("inserthtml.js执行成功");
    });
}();

