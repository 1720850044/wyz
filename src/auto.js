var fs = require('fs');
var path = require('path');
var filePath = path.resolve(__dirname + '/axios/');
var onlyApi = require('./axios/ApiScript.js');

console.log(typeof onlyApi.api)

fs.readFile(filePath + '/interfacePaths.js', 'utf8', function (err, data) {
    var api = onlyApi.api;
    if (err) {
        console.log(err);
    } else {
        var result = data;
        console.log(data);
        for (var key in api) {
            var t = "'" + api[key] + "'";
            var t1 = '"' + api[key] + '"';
            var t2 = '`' + api[key] + '`';
            var t3 = "'/"+ api[key] + "'";
            // console.log(t2);
            result = result.replace(new RegExp(t, 'g'), 'Vue.$GLOBALAPI.'+key);
            result = result.replace(new RegExp(t1, 'g'),'Vue.$GLOBALAPI.'+key);
            result = result.replace(new RegExp(t2, 'g'),'Vue.$GLOBALAPI.'+key);
            result = result.replace(new RegExp(t3, 'g'),'Vue.$GLOBALAPI.'+key);
        }
        fs.writeFile(filePath + '/interfacePaths.js', result, 'utf8', function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("写入成功");
            }
        });
    }
})


