<template>
    <div class="smart-schedule-page">
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{$route.meta.title}}<div></div></span></div>
        </main-native>
        <div class="scheduling-container">
            <template>
                <smart-scheduling v-if="isGetAccToken" :accToken="accToken"></smart-scheduling>
            </template>
        </div>
    </div>
</template>

<script>
    import api from 'api';
    import SmartScheduling from "../../../components/smartScheduling/smartScheduling";
    import MainNative from "../../main-components/mainNative";
    export default {
        name: "smartSchedulePage",
        components: {MainNative, SmartScheduling},
        data () {
            return {
                projectId: null,
                isGetAccToken: false,
                accToken: {}
            };
        },
        mounted () {
            this.initSchedule();
            this.initPagePermission();
        },
        methods: {
            bubble(){
                let text = this.$lau.bubble.projectScheduleTool;
                this.$nextTick(() => {
                    let defaultOptions = [
                        {
                            id: 'menuContainer',
                            position: 'right',
                            title: text[0].title,
                            content: text[0].content,
                            relative: 'body',
                            subClassName: 'ivu-menu-item-selected'
                        },
                        {
                            id: 'projectProduce',
                            position: 'bottom',
                            title: text[1].title,
                            content: text[1].content,
                            relative: 'body',
                        },
                        {
                            id: 'teamInfoContainer',
                            position: 'bottom',
                            title: text[2].title,
                            content: text[2].content,
                            relative: 'body',
                        },
                        {
                            id: 'calendarView',
                            position: 'left',
                            title: text[3].title,
                            content: text[3].content,
                            relative: 'body',
                        },
                        {
                            id: 'scheduleContainer',
                            position: 'top',
                            title: text[4].title,
                            content: text[4].content,
                            relative: 'body',
                        },
                    ];
                    setTimeout(() => {
                        this.$bubble(defaultOptions);
                    }, 100);
                });
            },
            initSchedule () {
                this.projectId = sessionStorage.projectID;
            },
            initPagePermission () {
                let _this = this;
                let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.company_project_schedule_helperindex;
                this.$axios.post(url)
                    .then(result => {
                        if (result.data.err_code === 0) {
                            _this.accToken = {
                                acc_token: result.data.data.acc_token
                            };
                            _this.isGetAccToken = true;
                            if (result.data.guide && result.data.guide === 'projectSchedule'){
                                this.bubble();
                            }
                        } else {
                            _this.$Message.warning(result.data.err_message);
                        }
                    });
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
