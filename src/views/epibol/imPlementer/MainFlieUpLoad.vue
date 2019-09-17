<template>
    <div class="MainFile">
        <div style="min-height:86px">
            <p v-for="item in fileAskData">{{item.config_name}}<span><b>{{item.value}}</b></span></p>
        </div>
        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)" size="30"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <!-- :max-size="2048" 
             :format="['jpg','jpeg','png','mp4','max']"
        -->
        <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
           
            
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            type="drag"
            :action="fileup"
            style="display:block;width:100%;">
            <div style="width:100%;padding:67px 0px;display:block;">
                <Icon type="ios-cloud-upload-outline" size="30"></Icon>&nbsp;&nbsp;拖入/点击上传
             </div>
        </Upload>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                imgName: '',
                uploadList: [],
                Flag: false,
                defaultList: [],
                url: [],
                taskTypeID: 0,
                fileAskData: []
            };
        },
        computed: {
            fileup(){
                return this.$store.state.paySkip.fileUpload;
            },
        },
        methods: {
            // 文件格式要求
            fileAsk(){
                let _this=this;
                let url=_this.GLOBAL.baseRouter+'task/task-type/info&id='+_this.taskTypeID;
                _this.$axios.get(url).then(msg=>{
                    msg.data.file.forEach(val => {
                        if (val.is_main==1){
                            _this.fileAskData=val.require;
                        }
                    });
                });
            },
            //上传
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                file.url = this.url;
                this.$bus.emit('MainFile', this.uploadList);
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式是不正确的',
                    desc: '文件格式 ' + file.name + ' 不正确，请选择jpg或png格式.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件大小超过限制',
                    desc: '文件  ' + file.name + ' 太大了，不超过 2M.'
                });
            },
            handleBeforeUpload (file) {
                this.url=window.URL.createObjectURL(file);
            },
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
            this.$bus.on("RemoveFile", ()=>{
                this.$refs.upload.fileList.splice(0);
            });
            this.$bus.on("taskTypeID", (val)=>{
                this.taskTypeID=val.taskTypeID;
                this.fileAsk();
            });
        },
    };
</script>
<style>
    .MainFile .demo-upload-list{
        display: block;
        width: 298px;
        height: 164px;
        text-align: center;
        line-height: 170px;
        /* border: 1px solid transparent; */
        border-radius: 0px;
        overflow: hidden;
        background: #fff;
        position:absolute;
        margin:1px;
        z-index:11;
        box-shadow: 0 1px 1px rgba(0,0,0,0);
        border-radius:4px;
    }
    .MainFile .demo-upload-list img{
        width: 100%;
        height: 100%!important;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: -30px!important;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>