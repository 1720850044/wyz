<template>
    <div class="contractDeta">
        <!-- 合同列表 -->
        <div class="contractList" v-if="network != '2'">
            <template>
                <p v-for="(item,index) in filesData" :key="index">
                    <img :src="item.file_url" :class="[nIndex==index?'showImg':'']" @click="showIMG(index)"/>
                    第 {{index + 1}} 页
                </p>
            </template>
        </div>
        <!-- 合同 -->
        <div class="contract" :class="{'pdfContract':network != '2'}">
            <iframe v-if="pdfUrl&&network =='2'" :src="pdfUrl" width="100%" height="100%"></iframe>
            <img v-else :src="Csrc"/>
        </div>
        <!-- //END -->
        <div class="clear"></div>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import api from 'api';

    export default {
        data() {
            return {
                filesData: Array,
                Csrc: "",
                nIndex: 0,
                pdfUrl: null
            };
        },
        mounted() {
            this.autoH();
            this.getPdf();
        },
        methods: {
            autoH() {

                let H = document.documentElement.clientHeight;
                if (document.getElementsByClassName('contractList')[0]) {

                    document.getElementsByClassName('contractList')[0].style.height = H - 250 + 'px';
                }
                if (document.getElementsByClassName('contract')[0]) {
                    document.getElementsByClassName('contract')[0].style.height = H - 250 + 'px';
                }

            },
            // 组件数据
            moduleData(data) {
                this.filesData = data;
                if (data && data[0]) {
                    this.Csrc = data[0].file_url;

                }
            },
            showIMG(index) {
                this.nIndex = index;
                if (this.filesData && this.filesData[index]) {
                    this.Csrc = this.filesData[index].file_url;

                }
            },
            async getPdf() {
                if (this.network == '2') {
                    let {data} = await api.getTsignPdf({contract_id: this.contractID});
                    console.log(1111);
                    if (data.err_code === 0) {
                        this.pdfUrl = data.data;
                        console.log(222);
                    }
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
        }
    };
</script>
