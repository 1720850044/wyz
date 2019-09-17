<template>
  <div id="contraniner">
     <span :id="ids" @click="getClick"></span>
  </div>
</template>
<script>
import plupload from 'plupload/js/plupload.min.js';
export default {
    props: ['ids'],
    data () {
        return {
            configure: {},
        };
    },
    mounted () {
        this.upload();
    },
    methods: {
    // 点击
        getClick() {
            this.$store.state.blob = false;
        },
        upload () {
            var _this = this;
            window.uploader = new plupload.Uploader({
                browse_button: this.ids, // 触发文件选择对话框的按钮，为那个元素id
                runtimes: 'html5,flash,silverlight,html4',
                url: this.configure.url, // 服务器端的上传页面地址
                flash_swf_url: 'js/Moxie.swf', // swf文件，当需要使用swf方式进行上传时需要配置该参数
                max_file_size: '10MB', // 限制为2MB
                container: document.getElementById('contraniner'),
                filters: [{title: "Image files", extensions: "jpg,gif,png,zip,rar"}], // 图片限制
                silverlight_xap_url: 'js/Moxie.xap', // silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
//            filters: {
//                mime_types:this.ids == 'wenjian' ? [{ title : "Zip files", extensions : "zip,rar" }] : [{ title : "Image files", extensions : "jpg,gif,png,bmp" }],
//                // mime_types : [ //只允许上传图片和zip,rar文件
//                //     { title : "Image files", extensions : "jpg,gif,png,bmp" },
//                //     { title : "Zip files", extensions : "zip,rar" }
//                // ],
//                max_file_size : '10mb', //最大只能上传10mb的文件
//                prevent_duplicates : false //不允许选取重复文件
//            },
            });
      // 在实例对象上调用init()方法进行初始化
            uploader.init();
      //图片选择完毕触发
            uploader.bind('FilesAdded', function(uploader, files){
                _this.$PublicFuns.getOssKey().then((OssKey=>{
                    let config = {
                      'key': OssKey.dir + files[0].name,
                      'policy': OssKey.policy,
                      'OSSAccessKeyId': OssKey.accessid,
                      'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                      'callback': OssKey.callback,
                      'signature': OssKey.signature,
                  };
                    _this.configure = {
                      'url': OssKey.host,
                      'multipart_params': config
                  };
                    uploader.setOption(_this.configure);
                    uploader.start();
                }));
            });
      // uploader.bind('UploadProgress', function(uploader, files) {
      // })
      // 图片上传成功触发，ps:data是返回值（第三个参数是返回值）
            uploader.bind('FileUploaded', function(uploader, files, data){
                const datas = JSON.parse(data.response);
                const mimeType = datas.mimeType.split('/')[0];
                if (mimeType == 'image') {
                    _this.$store.commit('setImg', datas.file_url);
                } else {
                    _this.$store.state.file = {
                      fileName: files.name,
                      fileDown: datas.file_url,
                      fileSize: (files.origSize/1024).toFixed(2)+'KB'
                  };
                }
            });
      // 上传发生错误时
            uploader.bind('Error', function (uploader, error) {
        // console.log('上传错误123', error)
            });
        }
    }
};
</script>
<style scoped>
#contraniner{
 width: 100%;
 height: 100%;
 position: absolute;
 z-index: 999;
 top:0;
 left: 0;
}
#contraniner>span{
 display: block;
 width: 100%;
 height: 100%;
}
</style>
