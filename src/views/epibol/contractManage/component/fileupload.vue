<template>
    <Upload
        ref="fileUpload"
        :default-file-list="defaultList"
        multiple
        :on-success="fileSuccess"
        :on-remove="fileRemove"
        :max-size="2048"
        :on-exceeded-size="fileMaxSize"
        :action="fileup"
        >
        <Button type="ghost" icon="ios-cloud-upload-outline"  :style="fileWidth">点击/拖入可上传</Button>
    </Upload>
</template>
<script>
export default {
    data(){
        return {
            accFile: [],
            defaultList: [],
            fileWidth: ''
        };
    },
    computed: {
        fileup(){
            return this.$store.state.paySkip.fileUpload;
        },
    },
    methods: {
        //初始化附件的宽度
        setWidth(data){
            this.fileWidth='width:'+data+'px';
        },
        // 附件上传
        fileSuccess(res, file){
            this.accFile.push(res.file);
        },
        //删除附件
        fileRemove(res, fileList){
            for (let i=0;i<this.accFile.length;i++){
                if (res.name==this.accFile[i].name){
                    this.accFile.splice(i, 1);
                }
            }
        },
        //超过限制
        fileMaxSize(file){
            this.$Notice.warning({
                title: '文件大小超过限制',
                desc: '文件  ' + file.name + ' 太大了，不超过 2M.'
            });
        },
        //
        clearFileData(){
            this.accFile=[];
            this.defaultList=[];
        },
        defaFile(data){
            this.accFile=data;
            this.defaultList=data;
        }
    },
    watch: {
        accFile(val){
            this.$bus.emit('contractFileData', val);
        }
    }
};
</script>
<style>
    .ivu-upload-list{
        position:static;
    }
</style>

