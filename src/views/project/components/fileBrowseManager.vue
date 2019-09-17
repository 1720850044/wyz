<template>
    <div class="manage-detail-container">
        <template v-if="showLoading">
            <div class="loading">
                <loading></loading>
            </div>
        </template>
        <section v-if="!fileType && !showLoading" class="notIMG without">
            <div class="imgContainer">
                <img src="./image/without.png" alt="">
                <p style="text-align: center">{{$t('project.pro_notBeenUploaded')}}</p>
            </div>
        </section>

        <imgeditor class="imgModel" v-if="fileType === 'img'" ref="imgeditor" :taskInfos="taskInfos" :is_collaboration="is_collaboration"></imgeditor>
        <videoeditor v-if="fileType === 'video'" ref="videoeditor" :taskInfos="taskInfos" :is_collaboration="is_collaboration"></videoeditor>
        <modeleditor v-if="fileType === '3d'" ref="modeleditor" :taskInfos="taskInfos" @signSumNumber="signSumNumber" :is_collaboration="is_collaboration"></modeleditor>
        <audio-player v-if="fileType === 'audio'" ref="audioPlayer" :taskInfo="taskInfos" :isCollaboration="is_collaboration" :audioCanvasId="'audioCanvas'"></audio-player>

        <feedback-info class="feenbackModel" :taskInfos="taskInfos" :is_collaboration="is_collaboration" @commitEidt="commitEidt" :sumSign="sumSign"></feedback-info>
    </div>
</template>

<script>
    import imgeditor from './imgEditor';
    import videoeditor from './vedioEditor';
    import modeleditor from './threeModule';
    import feedbackInfo from './feedbackInfo.vue';
    import AudioPlayer from '../../../components/uploadAndPreview/audioPlayer';

    export default {
        props: {
            //当前任务当前阶段信息
            stageInfos: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            is_collaboration: {
                type: Number
            }
        },
        watch: {
            stageInfos(){
                this.initFileBrowse();
            }
        },
        components: {
            AudioPlayer,
            imgeditor,
            videoeditor,
            modeleditor,
            feedbackInfo
        },
        data() {
            return {
                showLoading: true,
                fileType: null,
                taskInfos: {},
                initAudit: {
                    audit: false
                },
                sumSign: 0,
            };
        },
        mounted () {
            this.initFileBrowse();
        },
        methods: {
            initFileBrowse(){
                this.fileType = null;
                let type = null;
                if (this.stageInfos.file && this.stageInfos.file.length > 0){
                    let mainFile = this.stageInfos.file.filter((creent) =>creent.is_main === '1');
                    type = mainFile[0].type.toLowerCase();
                }
                this.taskInfos = this.stageInfos;
                setTimeout(() => {
                    //显示不同的组件
                    switch (type) {
                        case 'image':
                            this.fileType = 'img';
                            break;
                        case 'video':
                            this.fileType = 'video';
                            break;
                        case 'audio':
                            this.fileType = 'audio';
                            break;
                        case '3d':
                        case 'other':
                            this.fileType = '3d';
                            break;
                        default:
                            this.fileType = null;
                            break;
                    }
                    this.showLoading = false;
                }, 10);
            },
            commitEidt(data){
                let obj = {};
                let url = null;
                let mainFile = this.stageInfos.file.filter((creent) =>creent.is_main === '1');
                let stageInfos = mainFile[0];

                if (data.isTestTask){
                    url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_testinside_audit;
                    obj = {
                        upload_id: stageInfos.upload_id,
                        state: data.type === 'ok' ? 1 : 2,
                        feedback: data.FeedbackValue,
                        tag: null
                    };
                } else {
                    url = data.type === 'edit' || data.type === 'ok' ? this.GLOBAL.baseRouter + this.$GLOBALAPI.task_inside_audit : this.GLOBAL.baseRouter + this.$GLOBALAPI.task_client_audit;
                    obj = {
                        stage_id: stageInfos.stage_id,
                        audit: data.type === 'edit'||data.type === 'clientEdit' ? 2 : 1,
                        feedback: data.FeedbackValue,
                        file: null
                    };
                }

                //图片
                if (this.fileType === 'img'){
                    if (data.type === 'edit' || data.type === 'clientEdit'){
                        let tag = sessionStorage.ImgData;
                        //如果有图片标注 就截图 没有标注 就不用截图了
                        if (tag){
                            this.threeRequest().then((imgUrl) =>{
                                let ImgData = JSON.parse(tag);
                                if (data.isTestTask){
                                    obj.tag = JSON.stringify([{
                                        'file_id': stageInfos.id,
                                        'tag': ImgData,
                                        'label': imgUrl
                                    }]);
                                } else {
                                    obj.file = JSON.stringify([{
                                        'file_id': stageInfos.id,
                                        'tag': ImgData,
                                        'label': imgUrl
                                    }]);
                                }
                                this.submitRequest(url, obj, data.isTestTask);
                            });
                        } else {
                            if (data.isTestTask){
                                obj.tag = JSON.stringify([{
                                    'file_id': stageInfos.id,
                                    'tag': null,
                                    'label': stageInfos.file
                                }]);
                            } else {
                                obj.file = JSON.stringify([{
                                    'file_id': stageInfos.id,
                                    'tag': null,
                                    'label': stageInfos.file
                                }]);
                            }
                            this.submitRequest(url, obj, data.isTestTask);
                        }
                    } else {
                        obj.tag = JSON.stringify([{
                            'file_id': stageInfos.id,
                            'tag': null,
                            'label': null
                        }]);
                        this.submitRequest(url, obj, data.isTestTask);
                    }
                //3D 视频
                } else if (this.fileType === '3d' || this.fileType === 'video'){
                    let threeData = sessionStorage.threeData ? JSON.parse(sessionStorage.threeData) : null;
                    let videoTime = sessionStorage.videoTime ? JSON.parse(sessionStorage.videoTime) : null;
                    if (data.isTestTask){
                        obj.tag = JSON.stringify([{
                            'file_id': stageInfos.id,
                            'tag': this.fileType === '3d' ? threeData : videoTime
                        }]);
                    } else {
                        obj.file = JSON.stringify([{
                            'file_id': stageInfos.id,
                            'tag': this.fileType === '3d' ? threeData : videoTime,
                        }]);
                    }
                    this.submitRequest(url, obj, data.isTestTask);
                }
            },
            //三件套
            threeRequest(){
                const msg = this.$Message.loading({
                    content: i18n.t('project.pro_screenshot')+'...',
                    duration: 0
                });
                return new Promise((resolve, reject)=>{
                    this.$PublicFuns.getOssKey().then((OssKey => {
                        this.$PublicFuns.getHtml2canvas('clipScreenCanvas').then((base64) => {
                            this.$PublicFuns.uploadOss(base64, OssKey).then((imgUrl) => {
                                setTimeout(msg, 10);
                                resolve(imgUrl);
                            });
                        });
                    }));
                });
            },
            //提交审核
            submitRequest(url, obj, type){
                this.$axios.post(url, obj).then(msg => {
                    if (msg.data.err_code == 0){
                        //成功审核后 更新当前阶段数据
                        if (type){
                            this.$emit('referTestInfo');
                        } else {
                            this.$emit('referStageInfo', obj.stage_id);
                        }
                        sessionStorage.removeItem('ImgData');
                        sessionStorage.removeItem('threeData');
                        sessionStorage.removeItem('videoTime');
                        this.$Message.success(msg.data.err_message);
                    } else {
                        this.$Message.error(msg.data.err_message);
                    }
                });
            },
            signSumNumber (sum) {
                this.sumSign = sum;
            }
        }
    };
</script>

<style lang="less" scoped>
    .manage-detail-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .loading {
            height: 100%;
        }
        .without {
            position: relative;
            height: 100%;
            color: #000;
            background: #fff;
            .imgContainer {

                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate3d(-50%, -50%, 0);

            }
            p {
                text-align: center;
                font-size: 14px;
                color: @black_2;
            }

        }
    }
</style>
