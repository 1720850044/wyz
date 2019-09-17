<template>
    <div class="subtasksList">
        <section v-for="(items,index) in taskList"  @click="editChildTask(items)" :key="index" class="taskList">
            <p class="pause"  >{{items.status|status}}</p>
            <p class="sign" :class="'sign'+items.status"></p>
            <p class="taskListTitle">{{items.name}}</p>
            <div class="info">
                <span>
                    <span style="font-size: 16px;">{{items.expect_work_day}}</span>{{$t('workbench.work_workDayText')}}
                </span>
                <span>
                    <img class="headImg" :src="items.headimage" alt="">
                    <span style="margin-left: 10px;">{{items.realname}}</span>
                </span>
            </div>
        </section>
    </div>
</template>

<script>
    import api from 'api';
    export default {
        props: {
            taskInfos: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        mounted() {
            this.listInit();
        },
        data() {
            return {
                taskList: [],
                accToken:sessionStorage.accToken
            };
        },
        methods: {
            async listInit() {
                let {data} = await api.taskTaskList({father: this.taskInfos.id, project_id: this.taskInfos.project,acc_token:this.accToken});
                this.taskList = [];
                if (data.err_code === 0) {
                    let dataArr = data.data;
                    if (dataArr.length > 0){
                        dataArr.forEach(creent =>{
                            if (parseInt(creent.father) > 0){
                                this.taskList.push(creent);
                            }
                        });
                    } else {
                        this.taskList = [];
                    }
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            editChildTask(items){
                this.$emit('editChildTask', items);
            }
        },
        filters: {
            status(value){
                if (value === '1'){
                    return i18n.t('workbench.work_noBegin');
                } else if (value === '2'){
                    return i18n.t('project.pro_InProduction');
                } else if (value === '3'){
                    return i18n.t('project.pro_InSuspend');
                } else if (value === '4'){
                    return i18n.t('workbench.work_complete');
                }
            }
        }
    };
</script>

<style lang="less">
    .subtasksList {
        .taskList {
            position: relative;
            padding: 15px;
            color: #777;
            border: 1px solid @base;
            border-radius: 4px;
            margin: 10px 0;
            cursor: pointer;
            .pause {
                position: absolute;
                top: 7px;
                right: 0;
                z-index: 3;
                color: #fff;
                transform: rotate(41deg);
                font-size: 12px;
            }
            .sign1{
                border-right: 60px solid #fdbf64 !important;
            }
            .sign2{
                border-right: 60px solid #7bbff5 !important;
            }
            .sign4{
                border-right: 60px solid @base !important;
            }
            .sign {
                position: absolute;
                top: 20px;
                right: 0px;
                width: 0;
                height: 0;
                margin-top: -20px;
                border-top:  none;
                border-right: 60px solid #ff7970;
                border-bottom: 50px solid transparent;
                border-left: 50px solid transparent;
                z-index: 2;
            }
            .taskListTitle {
                font-size: 13px;
                font-weight: bold;
            }
            .info {
                display: flex;
                margin-top: 8px;
                font-size: 12px;
                justify-content: space-between;
                align-items: center;
                .headImg {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    vertical-align: middle;
                }
            }
        }
    }
</style>
