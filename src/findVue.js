// var fs = require('fs');
// var path = require('path');
// var dirPath = path.resolve(__dirname);
// var arr = [];
//
// function displayFile(param) {
//     //转换为绝对路径
//     var param = path.resolve(param);
//     fs.stat(param, function (err, stats) {
//         //如果是目录的话，遍历目录下的文件信息
//         if (stats.isDirectory()) {
//             fs.readdir(param, function (err, file) {
//                 file.forEach((item) => {
//                     //遍历之后递归调用查看文件函数
//                     //遍历目录得到的文件名称是不含路径的，需要将前面的绝对路径拼接
//                     var absolutePath = path.resolve(path.join(param, item));
//                     displayFile(absolutePath)
//                 })
//             })
//         } else {
//             arr.push(param);
//             //如果不是目录，打印文件信息
//             //         fs.readFile(param, 'utf8', function (err, data) {
//             //             console.log(data);
//             //         })
//         }
//     })
//     fileterType(arr);
// }
//
// displayFile(dirPath);
//
//

//


var fs = require('fs');
var path = require('path');
var dirPath = path.resolve(__dirname);
var readdir = promisify(fs.readdir);
var stat = promisify(fs.stat);
var readFile = promisify(fs.readFile);
var onlyApi = require('./axios/ApiScript.js');
// 简单实现一个promisify
function promisify(fn) {
    return function () {
        var args = arguments;
        return new Promise(function (resolve, reject) {
            [].push.call(args, function (err, result) {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve(result);
                }
            });
            fn.apply(null, args);
        });
    }
}

function readDirRecur(file, callback) {
    return readdir(file).then((files) => {
        files = files.map((item) => {
            var fullPath = file + '\\' + item;

            return stat(fullPath).then((stats) => {
                if (stats.isDirectory()) {
                    return readDirRecur(fullPath, callback);
                } else {
                    /*not use ignore files*/
                    if (item[0] == '.') {
                        //console.log(item + ' is a hide file.');
                    } else {
                        callback && callback(fullPath)
                    }
                }
            })
        });
        return Promise.all(files);
    });
}

var fileList = [];
readDirRecur(dirPath, function (filePath) {
    fileList.push(filePath)
}).then(function () {
    // console.log(fileList);
    fileterType(fileList);
}).catch(function (err) {
    console.log(err);
});

function fileterType(arr) {
    var filterArr = [];
    arr.forEach(function (item) {
        if (path.extname(item) == '.vue') {
            filterArr.push(item)
        }
    })
    readFileFun(filterArr);
}

function readFileFun(arr) {
    var api = onlyApi.api;
    arr.forEach(function (creent) {
        fs.readFile(creent,'utf8',function (err,data) {
            var result = data;
            for (var key in api) {
                var t = "'" + api[key] + "'";
                var t1 = '"' + api[key] + '"';
                var t2 = '`' + api[key] + '`';
                // var t3 = "'/"+ api[key] + "'";
                // console.log(t2);
                result = result.replace(new RegExp(t, 'g'), 'this.$GLOBALAPI.'+key);
                result = result.replace(new RegExp(t1, 'g'),'this.$GLOBALAPI.'+key);
                result = result.replace(new RegExp(t2, 'g'),'this.$GLOBALAPI.'+key);
                // result = result.replace(new RegExp(t3, 'g'),'this.$GLOBALAPI.'+key);
            }

            fs.writeFile(creent, result, 'utf8', function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("写入成功");
                }
            });
        })

    })
}
