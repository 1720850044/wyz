<template>
    <div class="previewBox">
        <div class="previewLeft">
            <div v-if="isShowUploadFlag" class="uploadBox">
                <upload @FileUploadedSuccess="FileUploadedSuccess" :id="uploadBtn">
                    <div slot="upload" :parameter="{type:'contract'}" class="uploadMain">
                        <div id="browseTop">
                            <p class='iconfonts icon-ymy-upload-copy'></p>
                            <span>点击上传合同</span>
                        </div>
                    </div>
                </upload>
            </div>
            <upload-contract-list v-if="isShowFlag" :uploadList="uploadList" @returnUrl="creentUrl = $event"></upload-contract-list>
            <change-conctract v-else :uploadList="uploadList" @returnUrl="creentUrl = $event"></change-conctract>
            <button class="changeBtn" v-if="!companyType && !isShowFlag" @click="changeContract">变更合同</button>
        </div>
        <div class="previewContent">
            <img v-if="isShowImgFlag" :src="creentUrl"/>
            <upload-contract v-else @fileUploadComplete="fileUploadComplete"></upload-contract>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import upload from "@/components/upload";
    import uploadContractList from "./uploadContractList";
    import ChangeConctract from "./changeConctract";
    import UploadContract from "./uploadContract";

    export default {
        name: "preview-contract",
        components: {
            UploadContract,
            ChangeConctract,
            uploadContractList,
            upload
        },
        props: {
            uploadList: {
                type: Array,
                default: () => []
            },
            isContractID: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'add'
            }
        },
        data() {
            return {
                uploadBtn: 'browseTop',
                companyType: Cookies.get('company') ? JSON.parse(Cookies.get('company')).type : null,
                // uploadList: [
                //     {
                //         "status": 0,
                //         "slideFlag": false,
                //         "list": [{
                //             "Status": "Ok",
                //             "fid": 27569,
                //             "dir": 0,
                //             "log_id": null,
                //             "path": "",
                //             "file_path": "/555.jpg",
                //             "file_url": "https://yhc-1.oss-cn-shanghai.aliyuncs.com/file-upload/2019/05/20/TtkP7gnG/555.jpg",
                //             "mimeType": "image/jpeg",
                //             "fileType": "image",
                //             "ext": "jpg",
                //             "name": "555.jpg"
                //         }],
                //         "file_status": 0
                //     },
                //     {
                //         "status": 0,
                //         "slideFlag": false,
                //         "list": [{
                //             "Status": "Ok",
                //             "fid": 27569,
                //             "dir": 0,
                //             "log_id": null,
                //             "path": "",
                //             "file_path": "/555.jpg",
                //             "file_url": "https://yhc-1.oss-cn-shanghai.aliyuncs.com/file-upload/2019/05/20/TtkP7gnG/555.jpg",
                //             "mimeType": "image/jpeg",
                //             "fileType": "image",
                //             "ext": "jpg",
                //             "name": "555.jpg"
                //         }],
                //         "file_status": 0
                //     }
                // ],
                creentUrl: null,

                isShowUploadFlag: true,
                isShowFlag: false,
                isShowImgFlag: false,
                pushType: 'add'
            };
        },
        methods: {
            FileUploadedSuccess(data) {
                let responseData = JSON.parse(data.response);
                responseData.name = data.name;
                if (this.type == 'add') {
                    this.uploadList.push(responseData);
                } else {
                    let len = this.uploadList.length;
                    this.uploadList[len - 1].list.push(responseData);
                }
            },
            fileUploadComplete(uploadList) {
                this.isShowUploadFlag = true;
                let len = this.uploadList.length;
                if (this.pushType === 'add'){
                    this.uploadList[len - 1].list = uploadList;
                    this.creentUrl = this.uploadList[len - 1].list[0].file_url;
                    this.isShowImgFlag = true;
                } else {
                    let oldArr = this.uploadList[len - 1].list;
                    this.uploadList[len - 1].list = oldArr.concat(uploadList);
                    this.creentUrl = this.uploadList[len - 1].list[0].file_url;
                    this.isShowImgFlag = true;
                }
            },
            changeContract() {
                this.isShowUploadFlag = false;
                let result = this.uploadList.filter(function (creent) {
                    if (creent.status == 1) {
                        return creent;
                    }
                });
                if (result.length > 0) {
                    let len = this.uploadList.length;
                    this.uploadList[len-1].slideFlag = true;
                    if (result[0].file_status == 0) {
                        this.isShowImgFlag = false;
                        this.pushType = 'updata';
                    } else if (result[0].file_status == 1){
                        this.uploadList.forEach(function (creent) {
                            creent.status = 0;
                            creent.slideFlag = false;
                        });
                        this.uploadList.push({
                            status: 1,
                            list: [],
                            slideFlag: true,
                            file_status: 0
                        });
                        this.isShowImgFlag = false;
                    }
                } else {
                    this.uploadList.forEach(function (creent) {
                        creent.slideFlag = false;
                    });
                    this.pushType = 'add';
                    this.isShowImgFlag = false;
                    this.uploadList.push({
                        status: 1,
                        list: [],
                        slideFlag: true,
                        file_status: 0
                    });
                }
            },
            saveFilesContractData(){
                let fileList = null;
                if (this.type == 'add'){
                    fileList = this.uploadList;
                } else {
                    let len = this.uploadList.length;
                    fileList = this.uploadList[len - 1].list;
                }

                let fileData = {
                    type: 'files',
                    data: fileList
                };
                this.$store.commit('setContractData', fileData);
            }
        },
        mounted() {
            if (this.type == 'add') {
                this.creentUrl = this.uploadList[0].file_url;
                this.isShowFlag = true;
                this.isShowImgFlag = true;
            } else {
                //检测列表是否全部废弃 全部废弃 不显示上传组件
                let isAllfeiqi = this.uploadList.some(function (creent) {
                    return creent.status > 0;
                });
                if (!isAllfeiqi){
                    this.isShowUploadFlag = false;
                }

                let len = this.uploadList.length;
                this.uploadList[len -1].slideFlag = true;
                if (this.uploadList[len - 1].list && this.uploadList[len - 1].list.length > 0){
                    this.creentUrl = this.uploadList[len - 1].list[0].file_url;
                } else {
                    this.uploadList[len - 1].list = [];
                    this.creentUrl = null;
                }
                this.isShowFlag = false;
                this.isShowImgFlag = true;
            }
            //监听保存事件
            let _this = this;
            this.$bus.on('saveContractData', function () {
                _this.saveFilesContractData();
            });
        },
        beforeDestroy(){
            this.$bus.$off('saveContractData');
        },
    };
</script>
<style lang="less" scoped>
    .previewBox {
        width: 100%;
        height: 100%;
        .previewLeft {
            width: 280px;
            height: 100%;
            float: left;
            border-right: 1px dashed #ccc;
            overflow-y: auto;
            padding: 0 30px;
            text-align: center;
            .uploadBox {
                width: 100%;
                height: 175px;
                display: flex;
                justify-content: center;
                align-items: center;
                .uploadMain {
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #f5f5f5;
                    div {
                        font-size: 13px;
                        color: @base;
                        &:hover {
                            cursor: pointer;
                            color: @base_dark;
                        }
                        .icon-ymy-upload-copy {
                            font-size: 45px;
                        }
                        span {
                            font-size: 12px;
                        }
                    }
                }
            }
            .changeBtn {
                background: @base;
                color: @white;
                padding: 8px 20px;
                border: 0;
                border-radius: 4px;
                outline: none;
                margin-top: 30px;
                &:hover {
                    cursor: pointer;
                    background: @base_dark;
                }
            }
        }
        .previewContent {
            height: 100%;
            margin-left: 281px;
            text-align: center;
            img {
                max-width: 100%;
            }
        }
    }
</style>
