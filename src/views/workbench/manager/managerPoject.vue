<template>
    <div class="pjt_all">
        <div class="pjt_head">
            <p class="pjt_head_msg global-card-title-font">{{$t('lang.lang_project')}}</p>
            <!-- <p class="pjt_head_but iconfonts icon-shenglve-"></p> -->
        </div>
        <div class="pjt_main" id="pjt_bx">

        </div>
    </div>
</template>
<script>
    export default {
        props: ['jectList'],
        data() {
            return {};
        },
        mounted() {
            // this.$nextTick(() => {
            //    this.getEcharts()
            // })
            this.$PublicFuns.drawEchart(() => {
                //成员任务数量
                this.getEcharts();
            });
        },
        watch: {
            jectList: function (e) {
                this.$PublicFuns.drawEchart(() => {
                    //成员任务数量
                    this.getEcharts();
                });
            }
        },
        methods: {
            // echars
            getEcharts() {
                let echarts = require('echarts');
                const obj = this.jectList;
                const datas = [
                    {value: obj.outside, name: i18n.t('workbench.work_outsource')},
                    {value: obj.doing, name: i18n.t('workbench.work_implementation')},
                    {value: obj.inside, name: i18n.t('workbench.work_insideProject')},
                    {value: obj.pause, name: i18n.t('workbench.work_suspend')}
                ];
                const myCharts = echarts.init(document.getElementById('pjt_bx'), 'echartTheme');
                myCharts.setOption({
                    // color: ['#3cd2b4', '#4CAF50', '#2196F3', '#616161'],
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['51%', '60%'],
                            label: {
                                normal: {
                                    formatter: '{c|{c}} {b|个\n\n{b}}  ',
                                    rich: {
                                        c: {
                                            fontSize: 20,
                                        },
                                        b: {
                                            fontSize: 13,
                                            color: '#777777',
                                        }
                                    }
                                }
                            },
                            data: datas
                        }
                    ]
                });
            }
        }
    };
</script>
<style lang='less'>
    .pjt_all {
        .base-card;
        .pjt_head {
            .pjt_head_msg {
                .base-card-operation-head;
            }
            .pjt_head_but {
                .base-card-operation-icon;
            }
        }
    }

    .pjt_main {
        .base-card;
        height: 100%;
        box-shadow: 0 0 0 0;
    }
</style>
