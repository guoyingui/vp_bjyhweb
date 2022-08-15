'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var fs = require('fs');

function geFileList(path) {
    var filesList = [];
    var targetObj = {};
    readFile(path, filesList, '');
    return filesList;
}

//遍历读取文件
function readFile(path, filesList, relativePath) {
    var files = fs.readdirSync(path); //需要用到同步读取
    files.forEach(walk);

    function walk(file) {
        var states = fs.statSync(path + '/' + file);
        // console.log(file, states);
        var isExist = fs.existsSync(path + '/' + file + '/dynamic');
        if(/dynamic/.test(path) || /dynamic/.test(file)){
            isExist = true;
        }
        // console.log(isExist, file, path);

        if (states.isDirectory() && isExist) {
            readFile(path + '/' + file, filesList, relativePath ? relativePath + '/' + file : file);
        } else if(isExist) {
            //创建一个对象保存信息
            var obj = new Object();
            obj.name = file; //文件名
            obj.path = path + '/' + file; //文件绝对路径
            obj.relativePath = relativePath + '/' + file;
            filesList.push(obj.relativePath);
        }
    }
}

function writeFile(fileName, data) {
    fs.writeFile(fileName, data, 'utf-8', complete);

    function complete() {
        console.log("generate.js执行成功");
    }
}
var args = process.argv.splice(2);

if(args[0] === 'dll'){
    writeFile("./src/pages/dynamicIndex.js", `
        module.exports = {}
    `);
    return false;
}

var filesList = geFileList("./src/pages");
var importStr = '';
var exportObj = '';
// let importList = {index: true};
// filesList.map((item, index) => {
//     const importName = item.split('/').join('').split('.')[0];
//     if (!/\.(jsx|js)$/.test(item)) return;
//     if(importList[importName]) return 
//     importList[importName] = true;
//     importStr += `import ${importName} from './${item.split('.')[0]}';`
//     exportObj += `'${item.split('.')[0]}':${importName},`
// })
var importJSObj = {};
var importJSXObj = {};
filesList.map(function (item, index) {
    var importName = item.split('/').join('').split('.')[0];
    if (!/\.(jsx|js)$/.test(item)) return;
    if (/\.jsx$/.test(item)) {
        importJSXObj[importName] = item;
    } else {
        importJSObj[importName] = item;
    }
});
var importObj = _extends({}, importJSObj, importJSXObj);
if(importObj.dynamicIndex) delete importObj.dynamicIndex;
for (var key in importObj) {
    var name = importObj[key].replace('/dynamic/','/');
    // var name = importObj[key]
    importStr += 'import ' + key + ' from \'./' + importObj[key] + '\';';
    // importStr += `const ${key} = () => {
    //     return new Promise((res, rej) => {
    //         require.ensure([], require => { 
    //             res(require('./${importObj[key]}').default);
    //         }, '${key}');
    //     })
    // };`
    exportObj += '\'' +  name.split('.')[0] + '\':' + key + ',';
}
// importStr +=`import { NotFind } from './vfm/NotFind/404.jsx';`;
// exportObj += `'NotFind': NotFind`;
var str = importStr + "module.exports = {#1}".replace("#1", exportObj);
// var str = importStr + "let app = window.vpapp || {}; app.definde = Object.assign({}, (app.define || {}), {#1})".replace("#1", exportObj);
writeFile("./src/pages/dynamicIndex.js", str);