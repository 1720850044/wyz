<template>
    <div>
        <div style="min-height:86px">
            <p v-for="item in fileAskData">{{item.file_format}}<span><b>{{item.require[0].value}}</b></span></p>
        </div>
        <div class="demo-upload-list" v-for="item in MuploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <!-- :format="['jpg','jpeg','png','gif']"
        :max-size="2048" -->
        <Upload
            ref="upload"
            :show-upload-list="true"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action="fileup"
            >
            <div style="padding:10px 0px">
                <Icon type="ios-cloud-upload-outline" size="30"></Icon>&nbsp;&nbsp;拖入/点击上传
            </div>
        </Upload>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                defaultList: [],
                imgName: '',
                visible: false,
                MuploadList: [],
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
                        if (val.is_main==0){
                            _this.fileAskData.push(val);
                        }
                    });
                });
            },

            //文件上传
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                file.url = this.url;
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
            let _this=this;
            _this.MuploadList = _this.$refs.upload.fileList;
            _this.$bus.on('RemoveFile', ()=>{
                _this.$refs.upload.fileList.splice(0);
            });
            this.$bus.on("taskTypeID", (val)=>{
                this.taskTypeID=val.taskTypeID;
                this.fileAsk();
            });
        },
        watch: {
            MuploadList(val){
                this.$bus.emit('MinFile', val);
            }
        }

    };
</script>
<style>
    .demo-upload-list{
        display:none;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
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
