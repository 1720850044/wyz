<template>
<div>
    <Echarts :objData="objData" :starEndDate="starEndDate"></Echarts>
</div>
</template>

<script>
import axios from 'axios'
import Echarts from './Echarts'
import qs from 'querystring'
export default {
    components: {
        Echarts
    },
    data () {
        return {
            objData: {},
            starEndDate:[]
        }
    },
    methods: {
        getDataInfo () {
            axios.post('https://dev.banbooyun.com/index.php?r=hanstest/test',qs.stringify({
                
            })).then(this.getDataSuess);
        },
        getDataSuess (res) {
            this.objData = res.data.data;
            this.starEndDate = ['2018-04-01','2018-04-07'];
        }
       
    },
    mounted() {
        this.getDataInfo();
    }
}
</script>

<style>

</style>
