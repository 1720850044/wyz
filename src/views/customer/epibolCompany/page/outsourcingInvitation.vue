<template>
    <div>
        <div class="fileCondition">
            <em>
                <Input v-model="intivesearch" icon="ios-search" style="width:200px;" placeholder="输入任务名称" @keyup.enter.native="intivesearchBtn"></Input>
            </em>
            <em>
                <button class="AddBtnPublicSty" type="success" @click="newAddIntive"><i class="iconfonts icon-xinjian"></i> 合作邀请</button>
            </em>
            <div class="clear"></div>
        </div>
        <company-invite :intivesearch="intivesearch"  ref="companyIntive"></company-invite>
    </div>
</template>

<script>
    import companyInvite from '../component/companyInvite';
    export default {
        name: "outsourcing-invitation",
        components: {
            companyInvite
        },
        data(){
            return {
                intivesearch: null,
            };
        },
        methods: {
            intivesearchBtn(){
                this.$refs.companyIntive.companyInvite(false);
            },
            newAddIntive(){
                this.$refs.companyIntive.newAdd();
            },

        }
    };
</script>

<style scoped>

</style>
