<template>
    <div class='memberlist'>
        <!-- @on-current-change="changeRow" -->

        <Table highlight-row :columns="membercolumns" :data="memberdata"
              @on-row-click="clickRow" :loading="loadingStatus" size="large" class='memberlisttable' id="memberListId"></Table>
        <Page ref="pages" :total="count" :page-size="pageSize"
              show-total class="paging" :current.sync="currentPage" @on-change="changepage"></Page>
    </div>
</template>
<script>
import {mapMutations, mapGetters } from 'vuex';
import Cookies from 'js-cookie';
export default {
    name: 'memberlist',
    data(){
        return {

            membercolumns: [
                {
                    title: i18n.t('pc.pc_realName'),
                    key: 'realname',
                    align: 'center',
                    className: 'demo-table-info-column'
                },
                // {
                //     title:'昵称',
                //     key:'nickname',
                //     align:'center',
                //     className: 'demo-table-info-column'
                //
                // },
                {
                    title: i18n.t('lang.lang_phone'),
                    key: 'phone',
                    align: 'center',
                    className: 'demo-table-info-column'

                }, {
                    title: i18n.t('lang.lang_email'),
                    key: 'email',
                    align: 'center',
                    className: 'demo-table-info-column'

                }, {
                    title: i18n.t('lang.lang_department'),
                    key: 'department_name',
                    align: 'center',
                    className: 'demo-table-info-column'

                }, {
                    title: i18n.t('lang.lang_position'),
                    key: 'post_name',
                    align: 'center',
                    className: 'demo-table-info-column'

                },
            ],
            memberdata: [],
            allData: [],
            count: 0,
            pageSize: 20,
            loadingStatus: false,
            // yema:department_id
            dept: '',
            currentPage: 1

        };
    },
    mounted() {
        this.deptListData();
        // this.init()
        console.log(
            this.deptList,
            this.deptLComId,
            this.deptLdeptId,
            this.dutyLComId,
            this.dutyLpostId,

        );

    },
    computed: {
        ...mapGetters({
            deptList: 'getDeptList',
            deptLComId: 'getDeptLFComId',
            deptLdeptId: 'getDeptLFdeptId',
            dutyList: 'getDutyList',
            dutyLComId: 'getDutyLFComId',
            dutyLpostId: 'getDutyLFpostId'
        })
    },
    methods: {
        ...mapMutations(['updateDeptLFdeptId']),
        deptListData() {
            let data = {
                company_id: JSON.parse(Cookies.get('company')).company_id// company_id1
            };
            this.$store.dispatch('fetchDeptList', data);

            this.deptFData();
        },
        deptFData(searchValue) {
            let data = {
                company_id: this.deptLComId,
                department_id: this.deptLdeptId
            };
            if (searchValue){
                data.search = searchValue;
            }
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_page, data)
            .then(res => res.data)
            .then(res => {
                if (res.err_code == 0) {
                    this.pageSize = res.page.page_size;
                    this.allData = res.data;
                    if (this.allData <= this.pageSize) {
                        this.memberdata = this.allData;
                    } else {
                        this.memberdata = this.allData.slice(0, this.pageSize);
                    }
                    this.count = parseInt(res.page.count);
                } else {
                    this.$Message.error(res.err_message);
                }
            });
        },
        dutyListData() {
            let data = {
                company_id: JSON.parse(Cookies.get('company')).company_id// company_id1
            };
            this.$store.dispatch('fetchDutyList', data);
            this.dutyFData();
            // console.log(this.dutyLComId,this.dutyLpostId)
        },
        dutyFData() {
            let data = {
                company_id: this.dutyLComId,
                post_id: this.dutyLpostId
            };
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_page, data)
            .then(res => res.data)
            .then(res => {
                // console.log(res)
                if (res.err_code == 0) {
                    this.pageSize = res.page.page_size;
                    this.allData = res.data;
                    if (this.allData <= this.pageSize) {
                        this.memberdata = this.allData;
                    } else {
                        this.memberdata = this.allData.slice(0, this.pageSize);
                    }
                    this.count = parseInt(res.page.count);
                } else {
                    this.$Message.error(i18n.t('memberAauthority.power_dataError'));
                }
            });
        },

        /**
         * 切换数据
         */
        deptData(comId, deptId){
            // console.log(9999)
            this.updateDeptLFdeptId(deptId);
            // this.$Loading.start();
            this.loadingStatus = true;
            let data = {
                company_id: comId,
                department_id: deptId
            };
            this.currentPage = 1;
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_page, data)
            // this.$axios.get(this.GLOBAL.baseRouter+this.$GLOBALAPI.this.$GLOBALAPI.task_member_page, data)
            .then(res => res.data)
            .then(res => {
                if (res.err_code == 0) {
                    this.pageSize = res.page.page_size;
                    this.allData = res.data;
                        // console.log(1,this.allData)
                    if (this.allData <= this.pageSize) {
                        this.memberdata = this.allData;
                    } else {
                        this.memberdata = this.allData.slice(0, this.pageSize);
                    }
                    this.count = parseInt(res.page.count);
                    // this.$Loading.finish();
                    this.loadingStatus = false;
                } else {
                    this.$Message.error(i18n.t('memberAauthority.power_dataError'));
                }
                // console.log(res)
            });
            // this.memberdata = [this.initAMemberData(comId,deptId)];
        },
        dutyData(comId, dutyId){
            this.loadingStatus = true;
            let data = {
                company_id: comId,
                post_id: dutyId
            };
            // console.log(data)
            this.currentPage = 1;
            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_page, data)
            .then(res => res.data)
            .then(res => {
                if (res.err_code == 0) {
                    this.pageSize = res.page.page_size;
                    this.allData = res.data;
                    if (this.allData <= this.pageSize) {
                        this.memberdata = this.allData;

                    } else {
                        this.memberdata = this.allData.slice(0, this.pageSize);

                    }
                    this.count = parseInt(res.page.count);
                    this.loadingStatus = false;

                } else {
                    this.$Message.error(i18n.t('memberAauthority.power_dataError'));
                }
                // console.log(res)
            });
        },
        changepage(index) {

            let data = {
                company_id: this.deptLComId,
                department_id: this.deptLdeptId,
                page: index
            };

            this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_page, data)
            .then(res => res.data).then(res=>{
                this.pageSize = res.page.page_size;
                this.allData = res.data;
                var _start = ( index - 1 ) * this.pageSize;
                var _end = index * this.pageSize;
                // console.log(123,this.allData)
                this.memberdata = this.allData;
            });
        },
            // this.dutyFData()
        changeRow(currentRow) {
            this.$emit('choiseRow', currentRow);
            // console.log(currentRow)
        },
        clickRow(index) {
            this.$emit('choiseRow', index);
            // console.log(121, index)
        }
    }
};
</script>
<style lang="less">
    .paging{
        float:right;
        margin-top:10px;
    }
    .ivu-table th.demo-table-info-column{
        color: @black_3;
    }
    .ivu-table td.demo-table-info-column{
        color: @black_2;
        &:hover{
            background-color: @base_option;
        }
    }
    .memberlist{

        .memberlisttable,.ivu-table-wrapper{
            border:none;
            .ivu-table{
                border:none;
                border-style: none;
                border-radius: 3px;
                background: @white;
                box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
            }
        }
    }
</style>
