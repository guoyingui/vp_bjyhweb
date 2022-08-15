'use strict';
var fs = require('fs');
const baseConfig = require('./webpack.base.config.js');
//遍历读取文件
+function readFile() {
    var path = "./webapp";
    var jslist = [];
    var csslist = [];
    var files = fs.readdirSync(path); 
    var _weblist = [], _css = '', _js = '';
    files.map(function(item, index) {
        if (item == baseConfig.appname) {
            _weblist.push(item);
        }
    });
    _weblist.forEach(walk);
    function walk(file) {
        var filelist = fs.readdirSync(path + '/' + file);
        filelist.map(function(item, index) {
            if (/^main\.[\s\S]*\.js$/.test(item) || /^commons\.[\s\S]*\.js$/.test(item)) {
                jslist.push('../' + file + '/' + item + '');
            }
            if (/^main[\s\S]*\.css$/.test(item) || /^commons[\s\S]*\.css$/.test(item)) {
                csslist.push('../' + file + '/' + item + '');
            }
        })
    };
    var jsonhtml = "function "+baseConfig.appname+"js() {\n return {js:"+JSON.stringify(jslist)+",css:"+JSON.stringify(csslist)+"}\n}";
    fs.writeFile('./webapp/'+baseConfig.appname+'/json.js', jsonhtml, 'utf-8', function complete() {
        console.log("insertjson.js执行成功");
    });
}();

