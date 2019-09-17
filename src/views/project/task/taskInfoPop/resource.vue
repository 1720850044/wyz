<template>
    <!--资源-->
    <div class="resourceContainer">
        <div class="box">
            <div class="content" v-for="(item,index) in formItem"
                 :class="[{'green':item.stageDetalis ? item.stageDetalis.StageStatus === '5' ? true : false : false},{'creentSty':item.stage == stageFileInfos.stage}]"
                 @click="showimg(item)" :key="index">
                <div class="resourceTitle" >
                    <p>
                        <i class="steps">{{item.stage}}</i>
                        <span class="stepsTitle">{{item.stage_name}}</span>
                        <span class="uploadFileBtn" @click.stop="StageUploadFile(item)">{{$t('project.pro_uploadTaskFile')}}</span>
                        <span class="downloadFileBtn" v-if="item.stageDetalis && initData.download == 1" @click.stop="StageDownloadFile(item)">{{$t('upload.upload_download')}}</span>
                    </p>
                    <div v-if="item.stageDetalis">
                        <p class="resourceStatus" style="text-align: right">{{item.stageDetalis ? item.stageDetalis.StageStatus : null | stateData}}</p>
                        <p class="stageTime">{{item.stageDetalis ? item.stageDetalis.uploadStageTime : '00:00:00'}}</p>
                    </div>
                </div>
                <div class="file" v-if="item.stage == stageFileInfos.stage">
                    <!--<p class="textB3" >上传文件规格</p>-->
                    <ul v-if="stageFileInfos.type == 'image'">
                        <li class="fileList">
                            <span>{{$t('project.pro_width')}}</span>
                            <span>{{stageFileInfos.width}} {{$t('project.pro_px')}}</span>
                        </li>
                        <li class="fileList">
                            <span>{{$t('project.pro_height')}}</span>
                            <span>{{stageFileInfos.height}} {{$t('project.pro_px')}}</span>
                        </li>
                        <li class="fileList">
                            <span>{{$t('project.pro_format')}}</span>
                            <span>{{stageFileInfos.ext}}</span>
                        </li>
                    </ul>
                    <ul v-if="stageFileInfos.type === 'video' || stageFileInfos.type === '3D' || stageFileInfos.type === 'audio'">
                        <li class="fileList">
                            <span>{{$t('project.pro_size')}}</span>
                            <span>{{Math.floor(stageFileInfos.size/1024)}} KB</span>
                        </li>
                        <li class="fileList">
                            <span>{{$t('project.pro_format')}}</span>
                            <span>{{stageFileInfos.ext}}</span>
                        </li>
                    </ul>
                </div>
                <div v-if="index < formItem.length-1" class="arrowBox" >
                    <Icon  class="arrowIcon" type="arrow-down-a"></Icon>
                </div>
            </div>
        </div>
        <!--下载面板-->
        <upload-download-modal ref="uploadComponent" v-if="showDownloadPage" :initModalParams="toDownloadParams" @closeModal="showDownloadPage=false"></upload-download-modal>
    </div>
</template>

<script>
    import {taskDetail} from 'api';
    import UploadDownloadModal from "@/components/resourceManagement/uploadDownloadModal";
    export default {
        components: {
            UploadDownloadModal
        },
        props: {
            taskInfos: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            fileInfos: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            initData: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        mounted(){
            this.init();
        },
        data() {
            return {
                formItem: [],
                formStageList: [],
                stageFileInfos: this.fileInfos,
                showDownloadPage: false,
                toDownloadParams: {
                    type: 'download'
                },
            };
        },
        methods: {
            /*初始化上传了文件的阶段*/
            init(){
                let data = this.taskInfos;
                this.formItem = data.stage||null;
                if (data.stage_list.length > 0){
                    this.formStageList = data.stage_list;
                    // let arr = this.$PublicFuns.sortByKey(this.formStageList,'stage');
                    let arr1 = this.formItem;
                    let arr2 = this.$PublicFuns.sortByKey(this.formStageList, 'stage');
                    for (let i=0;i<arr1.length;i++){
                        for (let j=0;j<arr2.length;j++){
                            if (arr1[i].stage == arr2[j].stage){
                                arr1[i].stageDetalis = {
                                    uploadStageID: arr2[j].id,
                                    StageStatus: arr2[j].status,
                                    uploadStageTime: arr2[j].time,
                                    Stage: arr2[j].stage
                                };
                            }
                        }
                    }
                }
            },

            /*点击切换阶段*/
            async showimg(item){
                if (item.stageDetalis && item.stageDetalis.Stage){
                    let {data} = await taskDetail.taskStageInfo({id: item.stageDetalis.uploadStageID});
                    if (data.err_code === 0){
                        let url = data.file.filter(creent => creent.is_main === '1');
                        let _this = this;
                        if (url[0].type === 'image'){
                            let image = new Image();
                            let imageWidth = null;
                            let imageHeight = null;
                            image.src = url[0].file;
                            image.onload = function () {
                                imageWidth = image.width;
                                imageHeight = image.height;
                                _this.stageFileInfos = {
                                    type: 'image',
                                    width: imageWidth,
                                    height: imageHeight,
                                    ext: url[0].ext,
                                    stage: data.stage,
                                    stageID: data.stage_id
                                };
                            };
                        } else if (url[0].type === 'video' || url[0].type === '3D' || url[0].type === 'audio'){
                            _this.stageFileInfos = {
                                type: url[0].type,
                                size: url[0].size,
                                ext: url[0].ext,
                                stage: data.stage,
                                stageID: data.stage_id
                            };
                        }
                        this.$emit('resourceTabFun', data);
                    } else {
                        this.$Message.error(data.err_message);
                    }
                } else {
                    this.$emit('resourceTabFun', {});
                }
            },
            //阶段上传
            StageUploadFile(item){
                if (this.taskInfos.project_status == 2 || this.taskInfos.project_status == 4){
                    this.$Message.error(i18n.t('project.pro_thisProjectPause'));
                } else if (this.taskInfos.status == 1){
                    this.$Message.error(i18n.t('project.pro_startTask'));
                } else {
                    this.$emit('openUploadPop', item.stage);
                }
            },
            //阶段下载
            async StageDownloadFile(item){
                this.showDownloadPage = true;
                let {data} = await taskDetail.downloadStage({stage_id: item.stageDetalis.uploadStageID});
                if (data.err_code == 0){

                } else {
                    this.$refs.uploadComponent.closeModal();
                    this.$Message.error(i18n.t('project.pro_packagingFailure'));
                }
            }
        },
        watch: {
            taskInfos(){
                this.init();
            },
            fileInfos(val){
                this.stageFileInfos = val;
            }
        },
        filters: {
            stateData(status){
                let state = null;
                switch (status) {
                    case '1':
                        state=i18n.t('project.pro_internalPending');
                        break;
                    case '2':
                        state=i18n.t('project.pro_externalPending');
                        break;
                    case '3':
                        state=i18n.t('project.pro_internalFeedback');
                        break;
                    case '4':
                        state=i18n.t('project.pro_externalFeedback');
                        break;
                    case '5':
                        state=i18n.t('project.pro_stageComplete');
                        break;
                    case null:
                        state='--';
                        break;
                }
                return state;
            }
        },
    };
</script>

<style lang="less" >
    .resourceContainer {
        margin-top: 20px;
        .box{
            max-height: 650px;
            overflow: auto;
            .ivu-steps .ivu-steps-title{
                margin-left: 43px;
                color: @base !important;
            }
        }
        .green{
            .steps{
                background: @base !important;
            }
            .stepsTitle,.arrowIcon,.resourceStatus{
                color: @base !important;
            }
        }
        .content {
            margin-bottom: 40px;
            font-size: 14px;
            cursor: pointer;
            padding: 0 5px;
            border: 1px solid transparent;
            &.creentSty{
                border: 1px solid @base!important;
                border-radius: 3px;
                background: #f5fcfb !important;
            }
            &:last-child{
                margin-bottom: 0!important;
            }
            .resourceTitle{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 18px;
                .steps{
                    font-style: normal;
                    display: inline-block;
                    background: #c5c5c5;
                    color: #fff;
                    font-size: 14px;
                    border-radius: 100%;
                    width: 25px;
                    height: 25px;
                    text-align: center;
                    line-height: 25px;
                }
                .stepsTitle{
                    color:  @black_3;
                    margin-left: 10px;
                }
                .uploadFileBtn,.downloadFileBtn{
                    font-size: 12px;
                    border: 1px solid @base;
                    border-radius: 3px;
                    padding: 2px;
                    color:@base;
                    margin-left: 10px;
                    &:hover{
                        cursor: pointer;
                        background: @base;
                        color: #fff;
                    }
                }
            }
            .stageTime{
                font-size: 12px;
                color: @black_3;
            }
            .arrowIcon{
                color:  #c5c5c5;
            }
            .file{
                .fileList{
                    display: flex;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 10px;
                    margin: 10px 0;
                    justify-content: space-between;
                    color: #3cd2b4;
                    background: #eff6f5;
                    border-radius: 4px;
                }
            }
            .arrowBox{
                position: relative;
                .arrowIcon{
                    position: absolute;
                    top:5px;
                    left: 6px;
                }
            }
            .currentSty{display: none}
            .resourceStatus{
                color:  @black_3;
            }
        }
    }
</style>
