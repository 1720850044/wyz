import Global from '../global/Global.js';
import axios from '../axios/axios';
import {onlyAPI} from '../axios/apiConfig';
import iView from 'iview';
import CONSTANT from './constant';
// import global from './global/Global'//引用全局变量文件

export default class PublicFuns {
    /*
    * getOssKey() 获取OSSKEY权限
    * type上传类型 upload
    * */
    static getOssKey (params) {
        let url = Global.baseRouter+onlyAPI.file_oss;
        let obj = params ? params : {type: 'upload'};
        return new Promise((resolve, reject) => {
            axios.post(url, obj)
                .then(data => {
                    if (data.data.err_code == 0) {
                        resolve(data.data);
                    } else {
                        iView.Message.error({content: 'OSSKey获取失败！', duration: 3});
                    }
                });
        });
    }

    /*
    * getHtml2canvas() 截取DOM元素然后转化为base64
    * el 被截取的元素id 或者 dom
    * callback 回调函数
    * */
    static getHtml2canvas (el, callback) {
        let ele = null;
        if (el instanceof HTMLElement) {
            ele = el;
        } else if (typeof el == 'string') {
            ele = document.getElementById(el);
        } else {
            return '请传入正确的值';
        }
        return new Promise((resolve, reject) => {
            $LAB.script('/static/html2canvas.min.js')
                .wait(() => {
                    html2canvas(ele, {useCORS: true, logging: true, proxy: null})
                        .then(function (canvas) {
                            if (callback) {
                                callback(canvas);
                                resolve();
                            } else {
                                let dataURL = canvas.toDataURL('image/png');
                                resolve(dataURL);
                            }
                        });
                });
        });
    }

    /*
    * uploadOss() 上传到OSS服务器
    * base64Codes 转化的base64编码
    * OSSdata OSSKEY权限
    * */
    static uploadOss (base64Codes, OSSdata, randomStr) {
        var option = OSSdata;
        var UploadUrl = OSSdata.host;
        var file = this.convertImgDataToBlob(base64Codes);
        //IE 浏览器不支持 newFile方法
        // var tt = new File([file], 'tt', {type: 'image/jpeg'});
        // console.log(tt)
        var formData = new FormData();
        if (randomStr) {
            formData.append('key', option.dir + randomStr + '/' + this.GenNonDuplicateID());
        } else {
            formData.append('key', option.dir + this.GenNonDuplicateID());
        }
        formData.append('policy', option.policy);
        formData.append('OSSAccessKeyId', option.accessid);
        formData.append('success_action_status', '200');
        formData.append('signature', option.signature);
        formData.append('callback', option.callback);
        formData.append('file', file, 'tt');
        return new Promise((resolve, reject) => {
            $.ajax({
                url: UploadUrl,
                data: formData,
                processData: false,
                cache: false,
                async: false,
                contentType: false,
                dataType: 'JSON',
                type: 'post',
                success: function (data) {
                    if (data.Status == 'Ok') {
                        resolve(data.file_url);
                    }
                },
                error: function (data) {
                    if (data.status == 403) {
                        iView.Message.info({content: '上传超时，请重新上传！', duration: 3});
                    }
                },
            });
        });
    }

    /*
    * convertImgDataToBlob 转bolb方法
    * base64Data 转化的base64编码
    * */
    static convertImgDataToBlob (base64Data) {
        var format = 'image/jpeg';
        var base64 = base64Data;
        var code = window.atob(base64.split(',')[ 1 ]);
        var aBuffer = new window.ArrayBuffer(code.length);
        var uBuffer = new window.Uint8Array(aBuffer);
        for (var i = 0; i < code.length; i++) {
            uBuffer[ i ] = code.charCodeAt(i) & 0xff;
        }
        var blob = null;
        try {
            blob = new Blob([ uBuffer ], {type: format});
        }
        catch (e) {
            window.BlobBuilder = window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
                window.MSBlobBuilder;
            if (e.name == 'TypeError' && window.BlobBuilder) {
                var bb = new window.BlobBuilder();
                bb.append(uBuffer.buffer);
                blob = bb.getBlob('image/jpeg');
            }
            else if (e.name == 'InvalidStateError') {
                blob = new Blob([ aBuffer ], {type: format});
            }
            else {
            }
        }
        return blob;
    }

    /*
    * GenNonDuplicateID() 随机生成不重复的文件名
    * */
    static GenNonDuplicateID () {
        var randomStr = Number(Math.random()
            .toString()
            .substr(3, 12) + Date.now())
            .toString(36);
        return randomStr.substring(0, randomStr.length - 4);
    }

    /*
    * 获取当前url
    * */
    static getURL () {
        let url = window.location.href;
        let splitUrl = url.split('#')[ 1 ];
        if(splitUrl.indexOf('?') > 0){
            splitUrl = splitUrl.split('?')[ 0 ]
        }
        return splitUrl;
    }

    /**
     * 异步引入echart
     */

    static drawEchart (callback) {
        $LAB
            .script('https://static.banbooyun.com/public/js/echarts.min.js')
            .wait()
            .script('https://static.banbooyun.com/public/js/echartTheme.js')
            .wait(() => {
                callback();
            });
    }

    /*
    * imgsrc 转BASE64
    * */
    static switchImgToBase64 (url, callback) {
        let canvas = document.createElement('canvas');   //创建canvas DOM元素
        let ctx = canvas.getContext('2d');
        let img = new Image;
        img.setAttribute('crossOrigin', '*');
        img.src = url + '?rand=' + Math.random(0, 9999);
        let ext = url.substring(url.lastIndexOf('.') + 1)
            .toLowerCase();
        img.onload = function () {
            canvas.height = img.height; //指定画板的高度,自定义
            canvas.width = img.width; //指定画板的宽度，自定义
            ctx.drawImage(img, 0, 0, img.width, img.height); //参数可自定义
            let dataURL = canvas.toDataURL('image/' + ext);
            callback.call(this, dataURL); //回掉函数获取Base64编码
            canvas = null;
        };
    }

    /**
     * 获取随机数
     * min: 最小长度
     * max: 最大长度
     */
    static randomRange (min, max) {
        let returnStr = '',
            range = (max ? Math.round(Math.random() * (max - min)) + min : min),
            arr = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

        for (let i = 0; i < range; i++) {
            let index = Math.round(Math.random() * (arr.length - 1));
            returnStr += arr[ index ];
        }
        return returnStr;
    }

    /*
    * 下载函数
    * 浏览器下载图片，文档资源时会自动打开预览 而不是下载  所以这个函数专治这种疑难杂症
    * url 文件地址
    * filename 文件名
    * */
    static download (url, filename) {
        //文件资源转换成BASE64 然后在模拟点击事件 就不会直接打开了 而是下载
        this.switchImgToBase64(url, function (_baseUrl) {
            // 创建隐藏的可下载链接
            var eleLink = document.createElement('a');
            eleLink.download = filename || '下载';
            eleLink.style.display = 'none';
            // 图片转base64地址
            eleLink.href = _baseUrl;
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
        });
    }

    /*
    * Parameter: Time seconds
    * @return String '24:00:00'
    */
    static calculationTime (videoSeconds) {
        if (videoSeconds <= 0) {
            return '00:00';
        }
        if (videoSeconds > 0 && videoSeconds < 60) {
            return '00:' + (Array(2)
                .join('0') + parseInt(videoSeconds)).slice(-2);
        }
        if (videoSeconds >= 60 && videoSeconds < 3600) {
            let minutes = (Array(2)
                .join('0') + (parseInt(videoSeconds / 60))).slice(-2);
            let seconds = (Array(2)
                .join('0') + (parseInt(videoSeconds % 60))).slice(-2);
            return minutes + ':' + seconds;
        }
        if (videoSeconds >= 3600) {
            let hours = (Array(2)
                .join('0') + (parseInt(videoSeconds / 3600))).slice(-2);
            let minutes = (Array(2)
                .join('0') + (parseInt((videoSeconds % 3600) / 60))).slice(-2);
            let seconds = (Array(2)
                .join('0') + (parseInt(videoSeconds % 60))).slice(-2);
            return hours + ':' + minutes + ':' + seconds;
        }
    }

    /**
     * 字节转化
     */
    static byteSizeConversion (bytes) {
        let unit = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB' ];
        if (bytes <= 0) {
            return '0Byte';
        } else {
            let e = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, e)).toFixed(2) + unit[ e ];
        }
    }

    /**
     * 根据数组对象 字段（key）排序
     */
    static sortByKey (arr, field) {
        return arr.sort((a, b) => {
            return a[ field ] - b[ field ];
        });
    }

    /**
     * 页面初始化请求（guideSteps, guideKey）接口公共方法
     */
    static guideInitInterface (url) {
        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(result => {
                    if (result.data.err_code === 0) {
                        let guideSteps = {};
                        let guide = result.data.guide || null;
                        if (guide) {
                            CONSTANT.guidePageData[ guide ].forEach((item, index) => {
                                guideSteps[ 'step' + (index + 1) ] = item.tips;
                            });
                        }
                        let resolveData = {
                            guideSteps: guideSteps,
                            guideKey: guide,
                        };
                        if (result.data.data && result.data.data.acc_token) {
                            resolveData.acc_token = result.data.data.acc_token;
                        }
                        resolve(resolveData);
                    }
                });
        });
    }

    /**
     * 页面跳转时需要调用的后台接口方法
     * params: key ==> guideKey
     */
    static completePageGuide (key) {
        let url = Global.baseRouter + onlyAPI.company_open;
        return new Promise((resolve, reject) => {
            axios.post(url, {key: key})
                .then(result => {
                    if (result.data.err_code === 0) {
                        resolve(true);
                    }
                });
        });
    }

    /**
     * Reset 页面引导调用后台接口方法
     * params: key ==> guideKey
     */
    static resetPageGuide (key) {
        let url = Global.baseRouter + onlyAPI.company_guidereset;
        return new Promise((resolve, reject) => {
            axios.post(url, {key: key})
                .then(result => {
                    if (result.data.err_code === 0) {
                        resolve(true);
                    }
                });
        });
    }
}
