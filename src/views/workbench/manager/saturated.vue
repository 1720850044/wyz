<template>
    <div>
        <workbench-echars v-if="saturatedData.data"
            :objData="saturatedData"
            :starEndDate="saturatedDate"
            :accToken="accToken"
            :sort="true"
            :unit="name"
            :yAxis = "yAxis"
            :echarsType = "'line'"
            :percentage = "'trend,last_pass,this_pass'"
            :changePercentage = "'rate,change'"
            :echarsId = "'merchantChart1111'"
            :echarsUrl="saturatedUrl">
        </workbench-echars>
        <template v-else>
            <div style="height: 720px;">
                <loading></loading>
            </div>
        </template>
    </div>
</template>

<script>
    /** 工作概述 */
    import WorkbenchEchars from "../../../components/WorkbenchEchars.vue";
    import { onlyAPI } from "../../../axios/apiConfig"
    import api from 'api'
    export default {
        props:{
            apiUrl:{   // 请求的表格数据
                type:String,
                default:''
            },
            name:{   // 请求的表格数据
                type:String,
                default:''
            },
        },
        created() {
           this.getSaturatedInfo();
        },
        mounted() {

        },
        data() {
            return {
                accToken:sessionStorage.accToken,
                saturatedData: {},
                saturatedUrl: '',
                saturatedDate: [],
                yAxis:[
                    {name: '过剩项目',type: 'value',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
            }
        },
        methods: {

            getSaturatedInfo () {
                this.saturatedUrl = this.GLOBAL.baseRouter + onlyAPI[this.apiUrl];

                this.$axios.post(this.saturatedUrl,{
                    'acc_token': this.accToken
                }).then(this.getSaturatedSuccess);
            },
            getSaturatedSuccess (res) {
                this.saturatedData = res.data.data;
                this.saturatedDate = res.data.data.particle_range_most.split(',');
            }
        },
        computed: {},
        components: {
            WorkbenchEchars,
        }
    }
</script>

