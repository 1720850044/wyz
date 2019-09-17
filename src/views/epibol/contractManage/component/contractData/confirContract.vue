<template>
    <div class="newContractData autoHeight" style="min-height: 580px;max-height: 640px">
        <div class="confirContract">
            <!-- 合同预览 -->
            <!--contrateCommit-->
            <div v-if="uploadShowFlag" class="lookContract">
                    <div class="contractIndex">
                        <file-upload>
                            <span class="ageUpload" id="browse" slot="upload">
                                <p>
                                    <Icon type="android-upload" size="35"></Icon><br/>
                                    点击上传合同
                                </p>
                            </span>
                        </file-upload>
                        <span v-for="(item,index) in filesList" :key="index" :class="{selet:index==Cindex}" @click="contractImg(index,item.file_url)">
                                <em class="delete" @click.stop="deleteImg(index)"><Icon type="trash-a" size="16"></Icon></em>
                                <img :src="item.file_url+'?x-oss-process=style/420'">
                                第{{index+1}}页
                        </span>
                    </div>
                    <div class="contract">
                        <!--<div class="restContractStyle" @click="restContract" v-show="contrateButton"><Icon type="arrow-return-left" size="16"></Icon>&nbsp;&nbsp;重选合同类型</div>-->
                        <img :src="imgUrl" id="bigImg">
                    </div>
                    <div class="clear"></div>
            </div>

            <!-- 合同上传 -->
            <div v-else>
                <!-- 线下合同 -->
                <div class="offlineContract">
                    <!--<div class="title">-->
                        <!--<em class="iconfonts icon-hetong"></em>签定线下合同-->
                        <!--<p>如双方已已签定纸质合同，请上传合同</p>-->
                    <!--</div>-->

                        <file-upload :fileType="fileType"  :parameter="{type:'contract'}" >
                            <div slot="upload" slot-scope="slotData">

                                <div  class="offineUpLoad" id="browse">
                                    <template v-if="!slotData.listLenght||slotData.listLenght.length===0" >
                                    <Icon type="android-upload" size="45"></Icon>
                                      <p >
                                          点击上传合同扫描件<br/>
                                        <em>支持JPG, PNG, JPEG, BMP格式合同文件</em>
                                      </p>
                                  </template>
                                </div>
                            </div>
                        </file-upload>
                </div>

                    <div class="clear"></div>
            </div>
        </div>

    </div>
</template>
<script>
    import fileUpload from '../../../../../components/upload';

    const fileType = [
        {
            title: "Image files",
            extensions: "jpg,png,jpeg,bmp,JPG,PNG,JPEG,BMP"
        }
    ];
// import {AutoResizeImage} from '../../../../project/components/imgEditorTwo/autoResizeImage.js';
    export default {
        data(){
            return {
                fileType: fileType,
                imgUrl: '',
                Cindex: 0,
                filesList: [
                    {
                        fid: null,
                        file_url: null,
                        mimeType: null,
                        fileType: null
                    }
                ],
                configure: {},
        //    0.9.1
                uploadShowFlag: false
            };
        },
        mounted(){
            this.initFileData();
        // this.autoHeight();
        // this.getContractFile();
            this.$bus.on("FileUploaded", (val)=>{
                this.uploadCallBack(val);
            });
        },
        components: {
            fileUpload: fileUpload
        },
        props: ["filesData"],
        computed: {
        // contrateButton(){
        //     return this.$store.state.paySkip.contrateButton;
        // },
        // contrateCommit(){
        //     return this.$store.state.paySkip.contrateCommit;
        // },

        },
        methods: {
        // initFileData
            initFileData(){
                let filesData = this.filesData;
                if (filesData && filesData.length > 0){
                    if (filesData[0].fid){
                        this.uploadShowFlag = true;
                        this.filesList = filesData;
                        this.imgUrl = filesData[0].file_url;
                        this.$bus.emit("ContractUploadFile", filesData);
                    } else {
                        this.uploadShowFlag = false;
                        this.filesList = [];
                        let tempArr = [
                            {
                                fid: null,
                                file_url: null,
                                mimeType: null,
                                fileType: null
                            }
                        ];
                        this.$bus.emit("ContractUploadFile", tempArr);
                    }
                } else {
                    this.uploadShowFlag = false;
                    this.filesList = [];
                    let tempArr = [
                        {
                            fid: null,
                            file_url: null,
                            mimeType: null,
                            fileType: null
                        }
                    ];
                    this.$bus.emit("ContractUploadFile", tempArr);
                }
            // console.log(this.filesData)
        //     if(this.filesData && this.filesData.length>0){
        //         if(this.filesData[0].fid){
        //             this.filesList = this.filesData;
        //             this.$store.commit('getContrateCommit',true);
        //             this.$nextTick(()=>{
        //                 this.getContractFile();
        //                 this.contractRow();
        //             })
        //         }else {
        //             this.$store.commit('getContrateCommit',false);
        //         }
        //     }
        //     this.$bus.emit("ContractUploadFile",this.filesList)
            },
        // uploadCallBack
            uploadCallBack(data){
                this.uploadShowFlag = true;
                let filesData = this.filesList;
                if (filesData && filesData.length > 0){
                    if (filesData[0].fid){
                        filesData.push(JSON.parse(data.response));
                    } else {
                        filesData = [];
                        filesData.push(JSON.parse(data.response));
                    }
                } else {
                    filesData.push(JSON.parse(data.response));
                    this.imgUrl = filesData[0].file_url;
                }
                this.$bus.emit("ContractUploadFile", filesData);
                this.$nextTick(()=>{
                    this.contractRow();
                });

           //  if(this.filesList[0].fid == null){
           //      this.filesList = [];
           //  }
           //  this.filesList.push(JSON.parse(data.response));
           // this.filesList.forEach(val=>{
           //     delete val.Status;
           // })
           //
           // this.$store.commit('getContrateCommit',true);
           // this.$store.commit('getContractServerButton',true);
           // this.$nextTick(()=>{
           //      this.getContractFile();
           //      this.contractRow();
           // })
           // this.$bus.emit("ContractUploadFile",this.filesList)
           //  this.$emit('changeIsSubmit')
            },

        // autoH
        // autoHeight() {
        //     $('.newContractData .autoHeight').height($(window).height() - 397)
        // },
            contractRow(){
                $(".lookContract .contract,.lookContract .contractIndex").css("maxHeight", $(window).height()-252);
                let cw=($(".lookContract .contract").width()/2)-70;
                $(".restContractStyle").css("margin-left", cw);
            },
        // changeImg
            contractImg(index, url){
                this.Cindex=index;
                this.imgUrl=url;
            },
        // deleteImg
            deleteImg(index){
                this.filesList.splice(index, 1);
                if (this.filesList.length == 0){
                    this.filesList = [];
                    this.uploadShowFlag = false;
                    let tempArr = [
                        {
                            fid: null,
                            file_url: null,
                            mimeType: null,
                            fileType: null
                        }
                    ];
                    this.$bus.emit("ContractUploadFile", tempArr);
                } else {
                    this.imgUrl = this.filesList[0].file_url;
                    this.$bus.emit("ContractUploadFile", this.filesList);
                }

            // console.log(this.filesList)
            //
            // if(this.filesList.length==0){
            //
            //
            //     this.restContract();
            //     this.$store.commit('getContractServerButton',false);
            // }
            // this.$bus.emit("ContractUploadFile",this.filesList)
            },
        // defultImg
        // getContractFile(){
//
//             if(this.filesList&&this.filesList.length!=0){
//
//                 this.imgUrl=this.filesList[0].file_url;
//             }
//         },
        // restContract
            restContract(){
            // this.$store.commit('getContrateCommit',true);
            // this.$nextTick(()=>{
            //     this.autoHeight();
            // })
            }
        }
    };
</script>
<style>

</style>
