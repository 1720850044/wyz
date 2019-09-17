<template>
    <div class="lookOver">
        <div class="lookImg">
            <div v-if="!isFile" class="NoFile">暂无文件</div>
            <img-preview v-if="showFileType === 'img'" :currentFileData="{file_url: fileDtat.file}"></img-preview>
            <video-preview v-if="showFileType === 'video'" :currentFileData="{file_url: fileDtat.file}"></video-preview>
            <model-preview v-if="showFileType === '3d'"></model-preview>
        </div>
        <div class="fooder">
            <p class="content">
                <i class='iconfonts icon-loudong'></i>
                {{lookDate.company}}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="isFile">稿件源文件：<a :href="fileDtat.file+'?response-content-type=application%2Foctet-stream'" download >下载</a></span>
            </p>
            <div data-start="6" data-step="3" data-last="6" data-disable-interaction="6" :data-intro="guideSteps.step6" data-position="right" style="float: right">
                <p style="float:right" v-if="lookDate.end_days < 0" >
                    <Button v-if="btnStatus.yesBtn" type="success" @click.native="bidStatus(1)">设为中标</Button>

                    <Button v-if="btnStatus.notice || lookDate.status==1 || lookDate.status==8 || lookDate.status==9 " :class="(notice_type==0 || notice_type==2) ? 'ivu-btn-info' : 'notice-button'" @click.native="(notice_type==0 || notice_type==1) ? notice('project') : ''" :disabled="(notice_type==0 || notice_type==1) ? false:true">项目邀请</Button>
                    <Button v-if="btnStatus.notice|| lookDate.status==1 || lookDate.status==8 || lookDate.status==9 " :class="(notice_type==0 || notice_type==1) ? 'ivu-btn-info' : 'notice-button'" @click.native="(notice_type==0 || notice_type==1) ? notice('contract') : ''" :disabled="(notice_type==0 || notice_type==1) ? false:true">合同邀请</Button>

                    <Button v-if="btnStatus.addBtn && is_join > 0" type="info" @click.native="gotoepibolCompany">已加入公司库</Button>
                    <Button v-if="btnStatus.addBtn && is_join <= 0" type="info" @click.native="bidStatus(4)">加入合作公司库</Button>
                    <Button v-if="btnStatus.noBtn" type="error" @click.native="bidStatus(2)">不满意</Button>
                </p>
            </div>

            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
import api from 'api';
import ImgPreview from "@/components/uploadAndPreview/imagePreview";
import VideoPreview from "@/components/uploadAndPreview/videoPreview";
import ModelPreview from "@/components/uploadAndPreview/tdModulePreview";

import {mapState, mapMutations} from 'vuex';
export default {
    data(){
        return {
            isFile: true,
            fileDtat: {},
            taskStatus: false,
            disabled: false,
            notice_type: 0,
            btnStatus: {
                yesBtn: false,
                addBtn: false,
                noBtn: false,
                notice: false,
            },
            is_join: 1,
            testfileData: {},
            showFileType: null,
            companyID: null,
            powerToken: null
        };
    },
    components: {
        // filebrowse,
        ImgPreview,
        VideoPreview,
        ModelPreview
    },
    props: ['lookDate', 'needGuideData', 'guideSteps'],
    mounted() {
        this.initFun();
    },
    methods: {
        ...mapMutations(['changeComponentFileURl']),
        // 页面初始化接口
        async initFun() {
            let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_test_infoindex;
            this.$axios.post(url).then(({data})=>{
                if (data.err_code === 0){
                    this.powerToken = data.data.acc_token;
                }
            }, ()=>{
                this.$Message.error('请求失败');
            });
        },
        gotoepibolCompany(){
            this.$router.push({path: '/epibol/cooperation/cooperationIndex'});
        },
        bidStatus(status){
            if (status == 1){
                let _this = this;
                this.btnStatus.yesBtn = false;
                this.btnStatus.notice = true;
                this.btnStatus.noBtn = false;
                (async function () {
                    let obj = {
                        id: _this.lookDate.test_id,
                        bid_id: _this.lookDate.id
                    };
                    const winBid = await api.getWinBid(obj);
                    if (winBid.data.err_code == 0){
                        _this.$Message.success(winBid.data.err_message);
                        //_this.$emit("chanageStatu");
                    } else {
                        _this.$Message.error(winBid.data.err_message);
                    }
                })();
                // 加入合作公司库
            } else if (status == 4){
                this.getNewCooperativeCompaniesList();
            } else {
                let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_update_bid_status;
                this.$axios.post(url, {bid_id: this.lookDate.id, status: status}).then(()=>{
                    this.$Message.success('请求成功');
                    this.$emit("chanageStatu");
                }, ()=>{
                    this.$Message.error('提交失败');
                });
            }
        },
        // 点击加入公司合作库
        getNewCooperativeCompaniesList() {
            let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.join_ooperative_company_reasury;
            this.$axios.post(url, {company_id: this.companyID, acc_token: this.powerToken}).then(({data})=>{
                if (data.err_code === 0){
                    this.$Message.success('请求成功');
                    this.$emit("chanageStatu");
                }
            }, ()=>{
                this.$Message.error('提交失败');
            });
        },
        notice(type){
            let _this = this;
            (async function () {
                let obj = {
                    type: type,
                    bid_id: _this.lookDate.id
                };
                const noticeInfo = await api.sendNotice(obj);
                if (noticeInfo.data.err_code == 0){
                    _this.$Message.success(noticeInfo.data.err_message);
                    _this.$emit("chanageStatu");
                } else {
                    _this.$Message.error(noticeInfo.data.err_message);
                }
            })();

        },
        async TestTaskBidInfos(id, type){
            const TestTaskBidInfos = await api.getTestTaskBidinfos({bid_id: id, type: type, needGuideData: this.needGuideData ? true : null});
            if (TestTaskBidInfos.data.err_code == 0){
                let status = TestTaskBidInfos.data.data.status;
                this.notice_type = TestTaskBidInfos.data.data.notice_type;
                this.is_join = TestTaskBidInfos.data.data.is_join;
                this.companyID = TestTaskBidInfos.data.data.company_id;
                // 0 待公布 1 中标 2 落选 3 招标失败 4 加入公司库,5已报价,6已上传,7报价未通过，8待确认收款，9招标完成
                switch (status){
                    case 0:
                    case 5:
                    case 6:
                    case 4:
                        this.btnStatus = {yesBtn: true, addBtn: true, noBtn: true};
                        break;
                    case 1:
                    case 2:
                    case 8:
                    case 9:
                        this.btnStatus = {yesBtn: false, addBtn: true, noBtn: false};
                        break;
                    case 3:
                    case 7:
                        this.btnStatus = {yesBtn: false, addBtn: false, noBtn: false};
                        break;
                }
                // debugger
                let data = TestTaskBidInfos.data.data.upload;
                if (data != false){
                    this.isFile = true;
                    let mainFile = data.file.filter(function (creen, index, arr) {
                        return creen.is_main === '1';
                    });
                    mainFile.map(function (creen) {
                        if (creen.file !=null ||creen.file !=''){
                            if (creen.file.indexOf('.fbx') > 0 || creen.file.indexOf('.FBX')> 0 ){
                                creen.file = creen.file.split('.fbx')[0]+'.fbx';
                            }
                        }
                    });
                    this.fileDtat = mainFile[0];
                    let index = mainFile[0].file.lastIndexOf('.');
                    let ext = mainFile[0].file.substring(index).toLowerCase();
                    switch (ext) {
                        case '.jpg':
                        case '.png':
                        case '.jpeg':
                        case '.bmp':
                        case '.gif':
                            this.showFileType = 'img';
                            break;
                        case '.mp4':
                        case '.rmvb':
                        case '.avi':
                            this.showFileType = 'video';
                            break;
                        case '.fbx':
                        case '.3ds':
                        case '.obj':
                        case '.json':
                        case '.stl':
                            this.showFileType = '3d';
                            this.changeComponentFileURl(mainFile[0].file+'.fbx');
                            break;
                        default:
                            this.showFileType = 'unknown';
                            break;
                    }
                } else {
                    this.isFile = false;
                }
            }
        }
    },
    watch: {
        lookDate(val){
            this.TestTaskBidInfos(val.id, 'pass');
        }
    },
};
</script>
<style type="text/css" lang="less" scoped>
    .lookOver{
        min-height:350px;
        .notice-button{
            background: rgba(254, 203, 152, 1);
            border-color:rgba(254, 203, 152, 1);
        }
        .fooder{
            //margin-top:10px;padding-top:20px;
            padding: 10px 0;
            p{
                float:left;
                a{
                    color:@base;
                }
            }
            .content{
                font-size:14px;line-height:30px;font-weight:lighter;color:@black_2;

            }
            .ivu-btn-success{
                background: @base;
                border-color:@base;
            }
            .ivu-btn-info{
                background:@orange;
                border-color: @orange;
            }
            .ivu-btn-error{
                background:@red;
                border-color: @red;
            }
            .ivu-btn{
                padding: 0px 15px;
                line-height: 40px;
                height: 40px;
                width: 110px;
                color: #ffffff;
                border: 0px;
                border-radius: 2px;
            }
        }
        .lookImg{
            min-height:300px;
            height: 500px;
            overflow: hidden;
        }
    }

    .lookImg{
        position: relative;
        .NoFile{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            background: #848484;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 20px;
        }
    }

</style>
