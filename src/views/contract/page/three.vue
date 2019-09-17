<template>
    <div class="threeStepBox">
        <three-detail v-if="threeDetailFlag" :creent="creentObj" :priceIndex="priceIndex"></three-detail>
        <add-list v-else></add-list>
    </div>
</template>

<script>
    import {newContractApi} from 'api';
    import threeDetail from '../components/threeDetail';
    import addList from "../components/addList";
    export default {
        components: {
            threeDetail,
            addList
        },
        name: "upload-contract",
        props: ['threeDetailFlag', 'priceIndex'],
        computed: {
            priceList(){
                return this.$store.state.contract.contractData.price;
            }
        },
        data(){
            return {
                creentObj: null
            };
        },
        watch: {
            priceIndex(index){
                this.creentObj = this.priceList[index];
            }
        },
        methods: {
            // flagCallback(){
            //     this.threeDetailFlag = true;
            //     alert(this.priceIndex);
            // }
        },
        mounted(){
            if (this.threeDetailFlag){
                this.creentObj = this.priceList[this.priceIndex];
            }
        }
    };
</script>

<style lang="less" scoped>
    .threeStepBox{
        padding: 30px ;
        width: 100%;
        height: 100%;
    }
</style>
