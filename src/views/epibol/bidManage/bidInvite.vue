<template>
    <div class="newBidList">
        <template v-if="MsgDataAssemble && MsgDataAssemble.length > 0">
            <dl>
            <dd v-for="(item,index) in MsgDataAssemble" :key="item.id" :id="'newBidList'+index">
                <i :class="{'bidNo':item.status==0}" v-if="item.status==0 && item.join_end_time > Math.round(new Date().getTime()/1000)" class="Statuslabel">待确认</i>
                <i :class="{'bidNo':item.status==0}" v-if="item.status==0 && item.join_end_time < Math.round(new Date().getTime()/1000)" class="Statuslabel">已过期</i>
                <i :class="{'bidYes':item.status==1}" v-if="item.status==1 || item.status==2" class="Statuslabel">{{item.status==1?'已接受':'已拒绝'}}</i>

                <div class="topContent">
                    <div class="bidTitle">
                        {{item.project_name}}
                        <em class="iconfonts icon-backs" @click.self="closeSlide(item)"></em>
                    </div>
                    <div class="bidInviteMoney">
                        <span>项目预计</span>
                        <p>￥<em>{{item.project_max_price}}</em></p>
                    </div>
                </div>

                <div class="content">
                    <div class="projectInfo">
                        <p class="titleSty">项目描述</p>
                        <span :title="item.description">{{item.description || '暂无' | substringLength}}</span>
                    </div>
                    <div class="projectTime">
                        <div>
                            <p class="titleSty">项目时间</p>
                            <span>{{item.start_time}} ~ {{item.end_time}}</span>
                        </div>
                        <div class="btnsSty" v-if="item.status==0 && item.join_end_time > Math.round(new Date().getTime()/1000)">
                            <button @click="updateInvite(item.id,1)">接受</button>
                            <button @click="updateInvite(item.id,2)">拒绝</button>
                        </div>

                    </div>
                </div>
                <previewlist :propsData="{ShowFlag:item.ShowFlag,screenshotID:'newBidList'+index,id:item.id}" @closeSlide="closeSlide(item)"></previewlist>
            </dd>
        </dl>
        <Page v-if="page.total > page.page_size"
              class-name="pageSty"
              :current=page.creentPage
              :total="page.total"
              :show-total=false
              :page-size="page.page_size"
              @on-change="onChangePage"
        >
        </Page>
        </template>
        <template v-else>
            <div style="min-height: 800px;position: relative">
                <nothink type="project" text="暂无邀请"></nothink>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    data(){
        return {
            page: {
                creentPage: 1,
                total: 0,
                page_size: 12
            },
            inviteData: []
        };
    },
    mounted(){
        this.inviteGet();
    },
    computed: {
        MsgDataAssemble(){
            this.inviteData.forEach((creent, index, arr)=>{
                creent.ShowFlag = false;
            });
            return this.inviteData;
        }
    },
    methods: {
        // 邀请列表
        inviteGet(){
            this.$Loading.start();
            let url = this.GLOBAL.baseRouter+this.$GLOBALAPI.task_my_invite_list;
            let parms = {
                page: this.page.creentPage,
                page_size: this.page.page_size,
            };
            this.$axios.post(url, parms).then(msg=>{
                if (msg.data.err_code==0){
                    this.page.total = parseInt(msg.data.page.count);
                    this.inviteData=msg.data.data;
                    this.$Loading.finish();
                } else {
                    this.$Loading.error();
                    this.$Message.error(bidList.data.err_message);
                }
            });
        },
        // 更新状态
        updateInvite(id, status){
            this.$Loading.start();
            let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_update_invite_status;
            let params={
                id: id,
                status: status
            };
            this.$axios.post(url, params).then(()=>{
                this.$Loading.finish();
                this.$Message.success('提交成功');
                this.inviteGet();
            }, ()=>{
                this.$Loading.error();
            });
        },
        closeSlide(data){
            this.$forceUpdate();
            data.ShowFlag = !data.ShowFlag;
        },
        onChangePage(nowPage){
            this.page.creentPage = nowPage;
            this.inviteGet();
        }
    },
    filters: {
        substringLength(val){
            if (val){
                return val.length >= 40 ? val.substring(0, 40)+'...' : val;
            }
        }
    }
};
</script>
