<template>
    <div class="confirmContractContainer">
        <div class="confirmContract">
            <div class="company">
                <Icon :class="{'activegreen':aCertified}" type="checkmark-circled"></Icon>
                <span>
                    <p class="title">甲方</p>
                    <p class="name" v-if="promptInfo&&promptInfo.confirm">{{promptInfo.confirm[1].name}}</p>

                </span>
            </div>
            <div class="company">
                <Icon :class="{'activegreen':bCertified}" type="checkmark-circled"></Icon>
                <span>
                    <p class="title">乙方</p>
                    <p class="name" v-if="promptInfo&&promptInfo.confirm">{{promptInfo.confirm[0].name}}</p>
                </span>
            </div>
        </div>
        <div class="cpmtractMain">

            <!--<iframe class="pdf-viewer" v-if="pdfUrl" :src="`/static/pdf/web/viewer.html?file=${pdfUrl}`" width="100%"-->
            <!--height="100%">-->
            <!--您的浏览器不支持PDF阅读-->
            <!--</iframe>-->

            <iframe v-if="pdfUrl" :src="pdfUrl" width="100%" height="100%"></iframe>
        </div>

    </div>
</template>


<script>
    import api from 'api';
    import {mapState} from 'vuex';
    import axios from 'axios';
    import tool from '@/global/tool';

    export default {
        created() {

        },
        mounted() {
            this.getTsignPdf();

        },
        props: {
            aCertified: {
                type: Boolean,
                default: false
            },
            bCertified: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                pdfUrl: null
            };
        },
        methods: {
            async getTsignPdf() {
                this.$Spin.show({
                    render: (h) => h('div', {'class': 'demo-spin-icon-load-pdf-container'}, [
                        h('Icon', {
                            'class': 'demo-spin-icon-load',
                            props: {
                                type: 'load-c',
                                size: 18,
                            },

                        }),
                        h('div', '电子合同生成中，请稍等！')
                    ])
                });
                let {data} = await api.getTsignPdf({contract_id: this.contractId});
                if (data.err_code === 0 && data.data) {
                    this.pdfUrl = data.data;
//                    await   this.ajax(data.data)
                    this.$Spin.hide();
                }
            },

            ajax(url) {
                let a = 0;
                const ajax = new XMLHttpRequest();
                ajax.open('get', url);
                ajax.onreadystatechange = (res) => {
                    if (res.currentTarget.status === 200) {
                        this.pdfUrl = url;
                        this.$Spin.hide();
                        return false;
                    }
                };
                ajax.send();
                const timeId = setInterval(() => {
                    const ajax = new XMLHttpRequest();
                    ajax.open('get', url);
                    ajax.onreadystatechange = (res) => {
                        a++;
                        if (res.currentTarget.status === 200) {
                            this.pdfUrl = url;
                            this.$Spin.hide();
                            clearInterval(timeId);
                        } else if (a >= 10) {
                            this.$Message.error('数据请求发生错误');
                            this.$Spin.hide();
                            clearInterval(timeId);

                        }

                    };
                    ajax.send();
                }, 1000);
            },
            download() {
                window.location.href = this.pdfUrl;
            },

        },
        computed: {
            ...mapState({
                contractId(value) {
                    return value.paySkip.contractID;
                },
                promptInfo(value) {
                    return value.paySkip.promptInfo;
                }
            })
        },
        components: {}
    };
</script>

<style lang="less" scoped>
    .confirmContractContainer {
        position: relative;
        width: 100%;
        height: 100%;
        .confirmContract {
            display: flex;
            /*position: absolute;*/
            /*left: 0;*/
            /*bottom: 0;*/
            /*width: 100%;*/
            /*text-align: center;*/
            /*line-height: 40px;*/
            .company {
                flex: 1;
                display: flex;
                i {
                    font-size: 30px;
                }
                span {
                    margin-left: 15px;
                    .title {

                        font-size: 12px;
                        color: #bdbdbd;
                    }
                    .name {
                        font-size: 14px;
                        color: #777777;
                    }
                }
                .activegreen {
                    color: #3bceb6;
                }
            }
        }
        .cpmtractMain {
            height: 100%;
            margin-top: 30px;
            border: 1px solid @baseboard;
            padding: 25px 40px;
        }
    }
</style>
<style lang="less">
    .demo-spin-icon-load-pdf-container {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translateY(-50%);

    }
</style>