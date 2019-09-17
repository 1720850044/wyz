<template>
    <div>
        <workbench-echars v-if="freeData.data"
            :objData="freeData"
            :starEndDate="freeDate"
            :accToken="powerToken"
            :sort="true"
            :yAxis = "yAxisFree"
            :percentage = "'trend'"
            :changePercentage = "'last_pass'"
            :echarsType = "'bar'"
            :freePercentage = "'this_pass'"
            :position = "position"
            :department = "department"
            :echarsId = "'merchantChart'"
            :echarsUrl="freeUrl">
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
            position:{   // 请求的表格数据
                type:Boolean,
                default:false
            },
            department:{   // 请求的表格数据
                type:Boolean,
                default:false
            },

        },
        created() {
            this.getMerchantChartInfo();
        },
        mounted() {

        },
        data() {
            return {
                accToken:sessionStorage.accToken,
                powerToken: '',
                freeData: {},
                freeUrl: '',
                freeDate: [],
                yAxisFree:[
                    {name: '人数',type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ]
            }
        },
        methods: {
            async getMerchantChartInfo () {
                    this.freeUrl = this.GLOBAL.baseRouter + onlyAPI[this.apiUrl];
                    this.$axios.post(this.freeUrl,{
                        'acc_token': this.accToken
                    }).then(this.getSaturatedSuccess);
            },
            getSaturatedSuccess (res) {
                this.freeData = res.data.data;
                this.freeDate = res.data.data.particle_range_most.split(',');
            }
        },
        computed: {},
        components: {
            WorkbenchEchars,
        }
    }
</script>

