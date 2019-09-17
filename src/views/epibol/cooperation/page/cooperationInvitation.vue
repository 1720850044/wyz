<template>
    <div>
        <div class="fileCondition">
            <em>
                <Input v-model="intiveSearch" icon="ios-search" style="width:200px;" placeholder="输入名称搜索" @keyup.enter.native="intivesearchBtn"></Input>
            </em>
            <em>
                <button class="AddBtnPublicSty" @click="newAddIntive"><i class="iconfonts icon-xinjian"></i> 合作邀请</button>
            </em>
        </div>
        <cooperation-invitation-page :search="intiveSearch" ref="cooperationIntive" ></cooperation-invitation-page>
    </div>
</template>

<script>
    import cooperationInvitationPage from "../component/cooperationInvitationPage"; // 合作邀请列表
    export default {
        name: "cooperation-invitation",
        components: {
            cooperationInvitationPage
        },
        data(){
            return {
                intiveSearch: null,
            };
        },
        methods: {
            // 合作邀请=====>名称搜索
            intivesearchBtn() {
                this.$refs.cooperationIntive.invitationList();
            },
            // 合作邀请=====>新增邀请
            newAddIntive() {
                this.$refs.cooperationIntive.newAdd();
            }
        }
    };
</script>

<style lang="less" scoped>
    .fileCondition{
        display: flex;
        justify-content: flex-end;
        padding: 0 0 20px 0;
        em {
            margin-left: 5px;
            font-style: normal;
            float: left;
        }
        .ivu-select-selection{
            .ivu-select-selected-value{
                color: @base!important;
            }
        }
        .AddBtnPublicSty{
            background: @base;
            border: 0;
            height: 100%;
            padding: 0 10px;
            border-radius: 3px;
            color: #fff;
            outline: none;
            &:hover{
                cursor: pointer;background: #35ab93;
            }
        }
    }
</style>
