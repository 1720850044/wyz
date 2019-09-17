<template>
    <div>
        <workbench-echars v-if="clientData.data"
            :objData="clientData"
            :starEndDate="clientDate"
            :accToken="accToken"
            :sort="true"
                          :unit="name"
            :yAxis = "yAxis"
            :percentage = "'postpone'"
            :echarsType = "'barLine'"
            :echarsId = "'merchantChart22222'"
            :echarsUrl="clientUrl">
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
            this.getClientInfo();
        },
        mounted() {

        },
        data() {
            return {
                accToken:sessionStorage.accToken,
                powerToken: '',
                clientData: {},
                clientUrl: '',
                clientDate: [],
                yAxis:[
                    {name: '数量',type: 'value', 
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {name: '效率走势',type: 'value',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ]
            }
        },
        methods: {
            getClientInfo () {
                this.clientUrl = this.GLOBAL.baseRouter + onlyAPI[this.apiUrl];
                this.$axios.post(this.clientUrl,{
                    'acc_token': this.accToken
                }).then(this.getClientSuccess);
            },
            getClientSuccess (res) {
                this.clientData = res.data.data;
                this.clientDate = res.data.data.particle_range_most.split(',');
            }
        },
        computed: {},
        components: {
            WorkbenchEchars,
        }
    }
</script>

