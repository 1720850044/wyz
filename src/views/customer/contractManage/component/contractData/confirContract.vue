<template>
    <div class="newContractData autoHeight">
        <div class="confirContract">
            <!-- 合同预览 -->

            <div class="lookContract">
                <div v-if="!pdfUrl&&filesList.length>0" class="contractIndex">
                        <span v-for="(item,index) in filesList" :key="index" :class="{selet:index==Cindex}"
                              @click="contractImg(index,item.file_url)">
                                <img :src="item.file_url">
                                第{{index + 1}}页
                        </span>
                </div>
                <div class="contract">

                    <!--<iframe class="pdf-viewer" v-if="pdfUrl&&network =='2'" :src='`/static/pdf/web/viewer.html?file=${pdfUrl}`' width="100%"-->
                            <!--height="100%">-->
                        <!--您的浏览器不支持PDF阅读-->
                    <!--</iframe>-->

                    <iframe v-if="pdfUrl&&network =='2'" :src="pdfUrl" width="100%" height="100%"></iframe>

                    <img v-else :src="imgUrl">
                </div>
                <div class="clear"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import api from 'api';
    export default {
        data() {
            return {
                filesList: [],
                imgUrl: '',
                Cindex: 0,
                pdfUrl: null,
            };
        },
        props: {
            filesData: {
                type: Array,
                default: []
            }
        },
        mounted() {
            this.initFileData();
            this.autoHeight();
            if (this.network == '2') {
                this.getPdf();
            }
        },
        methods: {
            // autoH
            autoHeight() {
                $(".newContractData .autoHeight").height($(window).height() - 270);
                $(".confirContract .contract,.confirContract .contractIndex").height($(window).height() - 295);
            },
            // initFileData
            initFileData() {
                this.filesList = this.filesData;
                this.$nextTick(() => {
                    this.getContractFile();
                });
            },
            // changeImg
            contractImg(index, url) {
                this.Cindex = index;
                this.imgUrl = url;
            },
            // defultImg
            getContractFile() {
                if (this.filesList&&this.filesList[0]) {
                    this.imgUrl = this.filesList[0].file_url;

                }
            },
            async getPdf() {
                let {data} = await api.getTsignPdf({contract_id: this.contractID});
                if (data.err_code === 0) {
                    this.pdfUrl = this.GLOBAL.imgDomain + ':8080/contract/227/contract_last.pdf';
//                    this.pdfUrl = data.data
                }
            }
        },
        computed: {
            ...mapState({
                network(value) {
                    return value.paySkip.network;
                },
            }),
            contractID() {
                return this.$store.state.paySkip.contractID;
            },
        },
        watch: {
            network(value) {
                if (value == '2') {
                    this.getPdf();
                }
            }
        }
    };
</script>
<style scoped>

</style>

