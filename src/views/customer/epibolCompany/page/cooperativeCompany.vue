<template>
    <div>
        <div class="fileCondition">
            <em>
                <Select v-model="sourceData" style="width:80px">
                    <Option v-for="item in sourceList" :value="item.index" :key="item.index">{{ item.value }}</Option>
                </Select>
            </em>
            <em>
                <Input v-model="searchData" icon="ios-search" style="width:200px;" placeholder="公司名称/联系人/电话/擅长" @keyup.enter.native="searchCoop"></Input>
            </em>
            <em>
                <button class="AddBtnPublicSty" type="success" @click="newAddCoop"><i class="iconfonts icon-xinjian"></i> 添加公司</button>
            </em>
            <div class="clear"></div>
        </div>
        <coop-corp :source="sourceData" :search="searchData" ref="coopCorpRef"></coop-corp>
    </div>
</template>

<script>
    import coopCorp from '../component/coopCorp';
    export default {
        name: "cooperative-company",
        components: {
            coopCorp
        },
        data(){
            return {
                sourceData: 0,
                sourceList: [
                    {value: '全部', index: 0},
                    {value: '手动添加', index: 1},
                    {value: '测试', index: 2}
                ],
                searchData: null,
            };
        },
        methods: {
            newAddCoop(){
                this.$refs.coopCorpRef.newAdd();
            },
            searchCoop(){
                this.$refs.coopCorpRef.coopCorpGet();
            }
        },
        watch: {
            sourceData(val){
                this.sourceData = val;
                this.$nextTick(() => {
                    this.$refs.coopCorpRef.coopCorpGet();
                });
            }
        }
    };
</script>

<style scoped>

</style>
