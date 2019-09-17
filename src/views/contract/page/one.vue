<template>
    <div class="oneStepBox">
        <div class="baseInfo">
            <party-a v-if="companyType"></party-a>
            <party-b v-else></party-b>
        </div>
        <div class="timeLine">
            <time-line :logList="logList"></time-line>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import partyA from '../components/partyA';
    import partyB from '../components/partyB';
    import timeLine from '../components/timeLine';

    export default {
        name: "base-info",
        computed: {
            logList() {
                return this.$store.state.contract.contractData.base.progress;
            }
        },
        components: {
            partyA,
            partyB,
            timeLine
        },
        data() {
            return {
                companyType: Cookies.get('company') ? JSON.parse(Cookies.get('company')).type : null,
            };
        },
        methods: {

        }
    };
</script>

<style lang="less" scoped>
    .oneStepBox {
        width: 100%;
        height: 100%;
        padding: 50px 30px;
        display: flex;
        justify-content: space-between;
        .baseInfo {
            width: 50%;
            border-right: 1px dashed #ccc;
            overflow: auto;
        }
        .timeLine {
            width: 50%;
        }
    }
</style>
