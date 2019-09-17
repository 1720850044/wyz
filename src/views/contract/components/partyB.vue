<template>
    <div>
        <ul class="FormTable">
            <li>
                <p>合同名称<em>*</em></p>
                <Input v-model="formData.contract_name" placeholder="输入合同名称" :disabled="disableFlag"></Input>
            </li>
            <li class="lineSty">
                <div class="box">
                    <p>合同起始时间</p>
                    <DatePicker :editable="false" :value="formData.start_time" @on-change="formData.start_time = $event" type="date" placement="bottom-start" placeholder="选择合同起始日期" style="width: 100%"  :disabled="disableFlag"></DatePicker>
                </div>
                <div class="box">
                    <p>合同结束时间</p>
                    <DatePicker :editable="false" :value="formData.end_time" @on-change="formData.end_time = $event" type="date" placement="bottom-start" placeholder="选择合同结束日期" style="width: 100%"  :disabled="disableFlag"></DatePicker>
                </div>
            </li>
            <li class="lineSty bottomBorder">
                <div class="box">
                    <p>合同经办人</p>
                    <Select v-model="formData.manager" style="width:100%" placeholder="选择经办人"  :disabled="disableFlag">
                        <Option v-for="item in operatorList" :value="item.user_id" :key="item.user_id">{{ item.realname }}</Option>
                    </Select>
                </div>
                <div class="box">
                    <p>合同对接商务</p>
                    <Select v-model="formData.business_people" style="width:100%" placeholder="选择对接人"  :disabled="disableFlag">
                        <Option v-for="item in userList" :value="item.user_id" :key="item.user_id">{{ item.realname }}</Option>
                    </Select>
                </div>
            </li>
            <li class="marTop">
                <p>关联项目</p>
                <Select v-model="formData.project_id" style="width:100%" placeholder="选择关联项目"  :disabled="disableFlag">
                    <Option v-for="item in projectList" :value="item.id" :key="item.user_id">{{ item.name }}</Option>
                </Select>
            </li>
            <li class="lineSty bottomBorder">
                <div class="box">
                    <p>项目预计总金额</p>
                    <!--<Input v-model="formData.contract_price" placeholder="输入项目预计总金额"></Input>-->
                    <InputNumber :min="0" v-model="formData.contract_price" style="width: 100%"  placeholder="输入项目预计总金额"  :disabled="disableFlag"></InputNumber>
                </div>
                <div class="box">
                    <p>项目预计启动时间</p>
                    <DatePicker :editable="false" :value="formData.project_expect_time" @on-change="formData.project_expect_time = $event" type="date" placement="bottom-start" placeholder="选择项目预计启动日期" style="width: 100%"  :disabled="disableFlag"></DatePicker>
                </div>
            </li>

            <li class="marTop">
                <p>甲方公司</p>
                <div class="ipnutBox">
                    <Input v-model="formData.customer_name" ref="outFocus" placeholder="搜索选择甲方公司名称" :disabled="disableFlag" @on-blur="searchFlag = false;" @on-change="companySearch(formData.customer_name)"></Input>
                    <ul class="companyList" v-show="searchFlag" :style="{'top':searchCompanyList.length >= 3 ? '-140px' : '40px'}">
                        <li v-for="(item, index) in searchCompanyList" :class="{'activeSty':formData.customer_id == item.id}" @mousedown="stopDefualt($event)" @click="selectCompany(item)">{{item.company}}</li>
                    </ul>
                </div>
            </li>
            <li class="lineSty">
                <div class="box">
                    <p>甲方对接人</p>
                    <Input v-model="formData.customer_people_name" disabled></Input>
                </div>
                <div class="box">
                    <p>对接人联系方式</p>
                    <Input v-model="formData.customer_phone" disabled></Input>
                </div>
            </li>
        </ul>
        <p>
            <em class="iconfonts icon-jingao"></em>
            <span>甲方对接人和联系方式由甲方确认合同后，自动向您公开！</span>
        </p>
    </div>
</template>

<script>
    import {newContractApi} from "api";

    export default {
        name: "party-b",
        data() {
            return {
                formData: {
                    contract_name: null,
                    start_time: null,
                    end_time: null,
                    contract_price: 1500,
                    project_expect_time: null,
                    manager: 0,
                    business_people: 0,
                    project_id: null,
                    customer_name: null,
                    customer_id: null,
                    customer_people_name: null,
                    customer_phone: null
                },
                operatorList: [],
                userList: [],

                searchFlag: false,
                searchCompanyList: [],
                projectList: [],
                searchChangeFlag: false
            };
        },
        computed: {
            base(){
                return this.$store.state.contract.contractData.base;
            },
            disableFlag(){
                return this.$store.state.contract.contractData.disableFlag;
            }
        },
        beforeDestroy(){
            this.$bus.$off('saveContractData');
        },
        mounted() {
            this.getoperatorList();
            this.getuserList();
            this.getProjectList();
            let _this = this;
            this.$bus.on('saveContractData', function () {
                _this.saveContractData();
            });
        },
        methods: {
            async getoperatorList() {
                let {data} = await newContractApi.getoperatorList();
                if (data.err_code == 0) {
                    this.operatorList = data.data;
                }
            },
            async getuserList() {
                let {data} = await newContractApi.getuserList();
                if (data.err_code == 0) {
                    this.userList = data.data;
                }
            },
            async getProjectList() {
                let {data} = await newContractApi.getProjectList();
                if (data.err_code == 0){
                    this.projectList = data.data;
                }
            },
            stopDefualt(e){
                e.preventDefault();
            },
            async companySearch(query) {
                this.formData.customer_id = 0;
                this.formData.customer_name = query;
                this.$store.commit('setSendBtnFlag', 0);
                if (query) {
                    let {data} = await newContractApi.searchDemand({company_name: query});
                    if (data.err_code == 0){
                        this.searchFlag = true;
                        if (data.data.length > 0){
                            this.searchCompanyList = data.data;
                        }
                    } else {
                        this.searchFlag = false;
                    }
                }
            },
            selectCompany(item){
                this.formData.customer_name = item.company;
                this.formData.customer_id = item.id;
                this.searchFlag = false;
                this.$refs.outFocus.blur();
                this.$store.commit('setSendBtnFlag', item.id);
            },
            async saveContractData() {
                let baseInfo = this.formData;
                let basicData = {
                    type: 'base',
                    data: baseInfo
                };
                this.$store.commit('setContractData', basicData);
            }
        },
        watch: {
            // base: {
            //     handler(baseInfo) {
            //         this.formData = baseInfo;
            //     },
            //     deep: true
            // },
            base(baseInfo){
                this.formData = baseInfo;
            }
        }
    };
</script>

<style lang="less" scoped>
    .FormTable {
        width: 90%;
        li {
            padding-bottom: 10px;
            p {
                margin-bottom: 9px;
                color: #a0a0a0;
                em{
                    font-style: normal;
                    color: red;
                    margin-left: 10px;
                    font-size: 12px;
                }
            }
            .ipnutBox{
                position: relative;
                .companyList{
                    position: absolute;
                    width: 99%;
                    background: #fff;
                    z-index: 9;
                    box-shadow: 0 1px 6px rgba(0,0,0,.2);
                    border-radius: 5px;
                    top: 40px;
                    right: -1px;
                    margin: 5px 0;
                    padding: 5px 0;
                    max-height: 130px;
                    overflow-y: auto;
                    li{
                        padding: 7px 16px;
                        &:hover{
                            cursor: pointer;
                            background: #f3f3f3;
                        }
                        &.activeSty{
                            background: @base;
                            color: @white;
                        }
                    }
                }
            }
            &.lineSty {
                display: flex;
                justify-content: space-between;
                .box {
                    width: 49%;
                }
            }
            &.bottomBorder{
                border-bottom: 1px dashed #dddee1;
            }
            &.marTop{
                margin-top: 10px;
            }
        }
    }
</style>
