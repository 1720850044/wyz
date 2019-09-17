<template>
    <div style="height: 90%">
        <template v-if="loadingFlag">
            <div style="height: 720px">
                <loading></loading>
            </div>
        </template>
        <template v-else-if="!loadingFlag && (coopCorpData && coopCorpData.length > 0)">
            <div class="coopCorListShit">
                <div class="tableHeade">
                    <span>公司名称</span>
                    <span>合作次数</span>
                    <span>来源</span>
                    <span>联系人</span>
                    <span>联系电话</span>
                    <span>擅长领域</span>
                    <span>备注</span>
                    <span>操作123132</span>
                </div>
                <dl>
                    <dd v-for="item in coopCorpData">
                        <span class="">{{item.company}}</span>
                        <span style="font-size: 14px">{{item.cooperation_num}}</span>
                        <span>{{item.from}}</span>
                        <span>{{item.contact_people}}</span>
                        <span style="font-size: 14px">{{item.tel}}</span>
                        <span >
                            <p class="skilled" v-if="item.ability && item.ability.length > 0">
                                <Tooltip placement="right-start" v-if="item.ability.length > 4">
                                    <em v-for="(tag,index) in item.ability" v-if="index < 4">{{tag.name || '--'}}</em>
                                    <div slot="content" class="tooltipBox">
                                        <em v-for="(tag,index) in item.ability">{{tag.name || '--'}}</em>
                                    </div>
                                </Tooltip>
                                <em v-else v-for="(tag,index) in item.ability">{{tag.name || '--'}}</em>
                            </p>
                        </span>
                        <span>{{item.description}}</span>
                        <span class="shitRight">
                            <!--<Icon type="edit"></Icon>-->
                            <i class="ivu-icon ivu-icon-edit" @click="editCoop(item.id,item.company,item.contact_people,item.tel,item.description,item.tag)"></i>
                            <i class="iconfonts icon-shanchu" @click="delObj.id = item.id;delObj.delModal=true"></i>
                        </span>
                    </dd>
                </dl>
            </div>
        </template>
        <template v-else-if="!loadingFlag && coopCorpData.length == 0">
            <div style="min-height: 720px;position: relative">
                <nothink type="company" text="暂无公司"></nothink>
            </div>
        </template>
          <!-- Modal组件 -->
        <Modal
            v-model="applModal"
            :title="Cooptitle"
            @on-ok="coopOk"
            @on-cancel="coopCancel"
            :ok-text="CoopBtn"
            width="600px"
            >
            <add-coop ref="addCoop"></add-coop>
        </Modal>
        <!--删除-->
        <Modal
            v-model="delObj.delModal"
            title="删除"
            @on-ok="deleteCoop"
            @on-cancel="coopCancel"
            ok-text="删除"
            width="600px"
        >
            <p style="font-size: 15px;padding-top: 20px">
                你确定要<span style="color: #f44336;font-weight: bold"> 删除 </span>吗？
            </p>
        </Modal>
        <Page v-if="page.total > page.page_size"
              class-name="pageSty"
              :current=page.creentPage
              :total="page.total"
              :show-total=false
              :page-size="page.page_size"
              @on-change="onChangePage"
        >
        </Page>
    </div>
</template>
<script>
    import {cooperationApi} from 'api';
    import addCoop from './addCoop';
    export default {
        data(){
            return {
                delObj: {
                    delModal: false,
                    id: null
                },
                applModal: false,
                coopData: {},
                Cooptitle: '',
                CoopBtn: '确认添加',
                coopCorpData: [],
                page: {
                    total: 0,
                    page_size: 20,
                    creentPage: 1
                },
                ability: [],
                loadingFlag:true
            };
        },
        props: ['source', 'search'],
        components: {
            addCoop: addCoop
        },
        mounted(){
            this.abilityList();
            this.coopCorpGet();
            this.$bus.on("emitCoopData", val=>{
                this.coopData=val;
            });
        },
        methods: {
            onChangePage(page){
                this.page.creentPage = page;
                this.coopCorpGet();
            },
        //获取擅长列表
            async abilityList(){
                let {data} = await cooperationApi.getAbilityList();
                if (data.err_code == 0){
                    let arr = data.data;
                    let temp = [];
                    if (arr.length > 0){
                        arr.forEach((creent) =>{
                            temp[creent.id] = creent.name;
                        });
                    }
                    this.ability = temp;
                }
            },
        //list
            async coopCorpGet(){
                let params={
                    demand_id: 1,
                    from: this.source,
                    search: this.search,
                    page: this.page.creentPage,
                    page_size: this.page.page_size
                };
                let {data} = await cooperationApi.getCooperationList(params);
                if (data.err_code == 0){
                    this.loadingFlag = false;
                    let list = data.data;
                    let temp = this.ability;
                    if (list.length > 0){
                        list.forEach((creent) =>{
                            if (creent.ability.length > 0){
                                creent.ability.forEach((item) =>{
                                    if (temp[item.ability_id]){
                                        item.name = temp[item.ability_id];
                                    }
                                });
                            }
                        });
                    }
                    this.coopCorpData = list;
                    this.page.total = parseInt(data.page.count);
                }else {
                    this.loadingFlag = false;
                }
            },
        //编辑
            editCoop(id, company, people, tel, explain, tag){
                this.applModal=true;
                this.Cooptitle='编辑服务商';
                this.CoopBtn='确认修改';
                let obj={
                    Tid: id,
                    company: company,
                    contactPeople: people,
                    tel: tel,
                    explain: explain,
                    tag: tag==null ? [] : tag
                };
                this.$bus.emit('editCoopData', obj);
            },
        // 新增
            newAdd(){
                this.Cooptitle='增加服务商';
                this.CoopBtn='确认添加';
                this.applModal=true;
                this.$bus.emit('newAddCompanyFlag');
            },
        // 提交
            async coopOk(){
                let params={
                    id: this.coopData.Tid,
                    company_id: this.coopData.Cid,
                    contact_people: this.coopData.contactPeople,
                    tel: this.coopData.tel,
                    demand_id: 1,
                    description: this.coopData.explain,
                    tag: JSON.stringify(this.coopData.tag)
                };
                if (params.id==null){
                // 新增
                    let {data} = await cooperationApi.addCooperation(params);
                    if(data.err_code == 0){
                        this.$Message.success("添加成功!");
                        this.$refs.addCoop.clearData();
                        this.coopCorpGet();
                    }
                } else {
                //  编辑
                    let {data} = await cooperationApi.editCooperation(params);
                    if(data.err_code == 0){
                        this.$Message.success("修改成功!");
                        this.$refs.addCoop.clearData();
                        this.coopCorpGet();
                    }
                }
            },
        // 删除
            async deleteCoop(){
                let id = this.delObj.id;
                let {data} = await cooperationApi.deleteCooperation({id:id});
                if(data.err_code == 0){
                    this.coopCorpGet();
                    this.$Message.success("删除成功!");
                }
            },
        // 取消
            coopCancel(){
                this.$refs.addCoop.clearData();
            }
        }
    };
</script>
<style lang="less">
    .ivu-page-item-jump-next:after, .ivu-page-item-jump-prev:after {
        display: inline-block;
    }
    .pageSty{
        margin-top: 10px;
        text-align: center;
        margin-bottom: 30px;
    }
    .skilled{
        .ivu-tooltip-popper[x-placement^=right] .ivu-tooltip-arrow{
            border-right-color: #3bceb6 !important;
        }
        .ivu-tooltip-inner{
            background-color:#3bceb6!important;
            box-shadow:0px 0px 0px;
        }
    }
</style>
<style lang="less" scoped>
    @import '../style/tableStyle.less';
    .skilled{
        em{
            border: 1px solid @base;
            padding: 1px 2px;
            border-radius: 3px;
            margin-right: 2px;
            color: @base;
            cursor: pointer;
        }


        .tooltipBox{
            white-space: normal;
            em{
                display: inline-block;
                margin: 2px;
                color: #fff!important;
                border-color: #fff!important;
            }

        }

    }
</style>
