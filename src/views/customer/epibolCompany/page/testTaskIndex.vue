<template>
    <div>
        <div class="fileCondition">
            <em>
                <Select v-model="stateData" style="min-width:80px">
                    <Option v-for="item in stateList" :value="item.index" :key="item.index">{{ item.value }}</Option>
                </Select>
            </em>
            <em>
                <Input v-model="searchData" icon="ios-search" placeholder="输入任务名称" style="width:200px;" @keyup.enter.native="search"></Input>
            </em>
            <em data-step="1" data-disable-interaction="1" :data-intro="guideSteps.step1" data-last="6" data-start="1">
                <button class="AddBtnPublicSty" type="success" @click="newAdd"><i class="iconfonts icon-xinjian"></i> 新增测试任务</button>
            </em>
        </div>
        <test-task @guideSteps="getguideSteps" :needGuideData="needGuideData" :stateData="stateData" :searchData="searchData" ref="testTaskRef"></test-task>
    </div>

</template>

<script>
    import testTask from '../component/testTask';
    export default {
        name: "test-task-index",
        components: {
            testTask
        },
        data(){
            return {
                stateData: 5,
                stateList: [
                    {value: '全部', index: 5},
                    {value: '待支付', index: 0},
                    {value: '征集中', index: 1},
                    {value: '待选稿件', index: 2},
                    {value: '招标成功', index: 3},
                    {value: '招标失败', index: 4}
                ],
                searchData: null,
                //引导数据
                guideSteps: {
                    step1: "",
                    step2: "",
                    step3: ""
                },
                needGuideData: null
            };
        },
        methods: {
            newAdd(){
                this.$refs.testTaskRef.newAdd();
            },
            getguideSteps(val){
                this.guideSteps = val;
            },
            search(){
                this.$refs.testTaskRef.testTaskGet();
            }
        },
        watch: {
            stateData(val){
                this.stateData = val;
                this.$nextTick(() => {
                    this.$refs.testTaskRef.testTaskGet();
                });
            },
        }
    };
</script>

<style scoped>

</style>
