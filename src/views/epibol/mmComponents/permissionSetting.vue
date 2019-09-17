<template>
    <Layout>
        <Sider >
            <auth-type :title="title" :number="number" :postList="postList" :dutyList='dutyList' @openAuth="authData"></auth-type>
        </Sider>
        <Layout>
            <Content>
                <auth-message ref="authMesg" :tabs="authList"></auth-message>
            </Content>
        </Layout>
    </Layout>
</template>

<script>
    import Cookies from 'js-cookie';
    import {mapGetters} from 'vuex';
    import authType from '../mmComponents/authType.vue';
    import authMessage from '../mmComponents/authMessage.vue';
    export default {
        name: "permission-setting",
        components: {
            authType,
            authMessage
        },
        data(){
            return {
                title: JSON.parse(Cookies.get('company')).company_name,
                number: JSON.parse(Cookies.get('company')).member_count.toString()
            };
        },
        computed: {
            ...mapGetters({
                postList: 'getPostList',
                dutyList: 'getDutyList',
                authList: 'getAuthList'
            }),
        },
        updated() {
            this.initialLoad();
        },
        mounted(){
            this.getInitInfo();
            this.authListData();
            this.dutyListData();
        },
        methods: {
            getInitInfo() {
                this.$axios
                    .get(this.GLOBAL.baseRouter+this.$GLOBALAPI.system_info)
                    .then(res => res.data)
                    .then(res => {
                        //公司改名后 重新设置Cookie
                        this.title = res.company.company_name;
                        Cookies.set('company', res.company);
                        this.number = res.company.member_count.toString();
                    });
            },
            initialLoad() {
                if (this.postList.length > 0) {
                    let arr = this.postList;
                    this.authData(0, arr[0].id, arr);
                }
            },

            /**
             * 获取职位列表
             */
            dutyListData() {
                let data = {
                    company_id: JSON.parse(Cookies.get('company')).company_id// company_id1
                };
                this.$store.dispatch('fetchDutyList', data);
            },

            /**
             * 获取权限列表
             */
            authListData() {
                let data = {};
                this.$store.dispatch('fetchAuthList', data);
            },
            // 切换职位类型获取对应数据
            authData(index, postId, postList) {
                sessionStorage.postId = postId;
                this.$bus.emit("changeAuth", postId, postList);
            },
        }
    };
</script>

<style scoped>

</style>
