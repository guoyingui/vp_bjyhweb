export const getElementsByClassName = (className, element) => {
    //解决IE8之类不支持getElementsByClassName
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (className, element) {
            var children = (element || document).getElementsByTagName('*');
            var elements = new Array();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var classNames = child.className.split(' ');
                for (var j = 0; j < classNames.length; j++) {
                    if (classNames[j] == className) {
                        elements.push(child);
                        break;
                    }
                }
            }
            return elements;
        };
    }
    return document.getElementsByClassName(className, element);
}

// export const requireFile = async (filename) => {
//     let app = window.vpapp || {};
//     let module = filename;
//     if(app.definde[filename] === undefined){
//         module = 'NotFind';
//     }
//     let  comp = await app.definde[module]();
//     return  comp;
// }

export const requireFile = (filename) => {
    let app = window.vpapp || {};
    let module = filename;
    if(app.definde[filename] === undefined){
        module = 'NotFind';
    }
    let  comp = app.definde[module];
    console.log(filename, comp);
    return  comp;
}

// export const requireFiles = async (data, urlName = 'staburl') => {
//     let compArr = [];
//     if( data instanceof Array) {
//         let arr = data.map(async function (item, index) {
//             let promise = await requireFile(item[urlName]);
//             return {...item, comp:promise}
//         })
//         await Promise.all(arr).then(compData => {
//             return compArr = compData
//         })
//         return compArr;
//     }
//     return compArr;
// }

export const formatDateTime = function (date) {  
    if (!date instanceof Date || date.toString() === 'Invalid Date') {
        return;
    }
    let y = date.getFullYear();  
    let m = date.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    let d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    let h = date.getHours();  
    h=h < 10 ? ('0' + h) : h;  
    let minute = date.getMinutes();  
    minute = minute < 10 ? ('0' + minute) : minute;  
    let second=date.getSeconds();  
    second=second < 10 ? ('0' + second) : second;  
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
}; 

var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

function isPlainObject(obj) {
    var proto, Ctor;
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }
    proto = Object.getPrototypeOf(obj);
    if (!proto) {
        return true;
    }
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
}


export function extend() {
    // 默认不进行深拷贝
    var deep = false;
    var name, options, src, copy, clone, copyIsArray;
    var length = arguments.length;
    // 记录要复制的对象的下标
    var i = 1;
    // 第一个参数不传布尔值的情况下，target 默认是第一个参数
    var target = arguments[0] || {};
    // 如果第一个参数是布尔值，第二个参数是 target
    if (typeof target == 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }
    // 如果target不是对象，我们是无法进行复制的，所以设为 {}
    if (typeof target !== "object" && !isFunction(target)) {
        target = {};
    }

    // 循环遍历要复制的对象们
    for (; i < length; i++) {
        // 获取当前对象
        options = arguments[i];
        // 要求不能为空 避免 extend(a,,b) 这种情况
        if (options != null) {
            for (name in options) {
                // 目标属性值
                src = target[name];
                // 要复制的对象的属性值
                copy = options[name];

                // 解决循环引用
                if (target === copy) {
                    continue;
                }

                // 要递归的对象必须是 plainObject 或者数组
                if (deep && copy && (isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy)))) {
                    // 要复制的对象属性值类型需要与目标属性值相同
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    target[name] = extend(deep, clone, copy);

                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    
    return target;
};

export function vpJSONStringify(values){
    return JSON.stringify(values, (key, item) => {
        if(item instanceof Array){
            return item.join(',')
        }
        return item
    })
}


/**
 * 根据名称查找表单数据中字段信息
 * @param formData {
 *     groups:[{
 *         fields:[]
 *     }]
 * }
 * @param name
 * @returns {*}
 */
export const  findFiledByName = function(formData,name){
    if(!formData){
        return null;
    }
    formData = formData.groups;
    let result;
    for(let groupIndex=0; groupIndex< formData.length; groupIndex++){
        let groupItem = formData[groupIndex];
        let fields =  groupItem.fields;
        for(let fieldIndex=0; fieldIndex<fields.length; fieldIndex++){
            let fieldItem = fields[fieldIndex];

            let fieldName = fieldItem.field_name;
            if(fieldName == name){
                result = {
                    groupIndex:groupIndex,
                    fieldIndex:fieldIndex,
                    field:fieldItem
                }
                return result;
            }
        }
    }
    return null;
}