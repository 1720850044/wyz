<template>
    <div style="position: relative;">
        <div class="addRow">
            <dl style="margin-top: 30px;">
                <dt>邀请合作企业</dt>
                <dd>
                    <ul class="ul">
                        <li class="title">
                            <Checkbox
                            :indeterminate="indeterminate"
                            :value="checkAll"
                            @click.prevent.native="handleCheckAll">全选</Checkbox>
                            <em>
                                <Input v-model="postData.searchData" style="width:200px" placeholder="输入公司名称" @keyup.13.native="commitSearch">
                                    <Button slot="append" icon="ios-search" size='small' @click="commitSearch"></Button>
                                </Input>
                            </em>
                        </li>
                        <li>
                            <CheckboxGroup v-model="inviteCompany" @on-change="checkAllGroupChange">
                                <span class="span" v-for="item in coopListData" :key="item.id">
                                    <Checkbox :label="item.id">{{item.company}}</Checkbox>
                                </span>
                                <span v-if="coopListData && coopListData.length == 0" class="notCompany">暂无可邀请公司</span>
                            </CheckboxGroup>
                            <div class="clear"></div>
                        </li>
                    </ul>
                    <div>
                      <p style="height: 32px;line-height: 32px;color: #3bceb6;"><span style="vertical-align: baseline;">*&nbsp;</span>非必填项，可直接跳过，点击下一步</p>
                    </div>
                </dd>
            </dl>
            <dl>
                <dt style="margin-top: -65px">招标权限</dt>
                <dd>
                    <Input v-model="postData.is_public" :placeholder="placeholder" style="width:100%" disabled></Input>
                    <div class="testTaskPrice" style="margin-top: 10px">
                        <RadioGroup v-model="radioFlag.radioStatus" @on-change='changeRadio'>
                            <Radio label="1">
                                <span>公开招标</span>
                            </Radio>
                            <Radio label="2">
                                <span>合作招标</span>
                            </Radio>
                        </RadioGroup>
                        <p v-if="radioFlag.radioStatus == 1" style="height: 32px;line-height: 32px;margin-top: 5px; color: #3bceb6;">招标信息对所有人开放，对外公开招标</p>
                        <p v-if="radioFlag.radioStatus == 2" style="height: 32px;line-height: 32px;margin-top: 5px; color: #3bceb6;">招标信息仅限邀请企业查看，不对外公开招标</p>
                    </div>
                </dd>

            </dl>
        </div>
        <div class="footer" style="position: absolute;right:0px;">
            <Button type="ghost" @click="preFun">上一步</Button>
            <Button type="primary" @click="nextFun" :disabled='btnDisabled'>下一步</Button>
        </div>
    </div>
</template>

<script>
    import api from 'api';
    export default {
        data() {
            return {
                placeholder: "公开招标",
                inviteCompany: [],
                indeterminate: false, // 设置 indeterminate 状态，只负责样式控制
                checkAll: false,
                inviteCompanyID: null,
                radioFlag: {
                    flag: true,
                    radioStatus: "1"
                },
                postData: {
                    searchData: null,
                    is_public: null // 是否公开招标
                },
                uploadCallbackData: {
                    id2: "browse2",
                    callbackData2: []
                },
                coopListData: [],
                coopList: [],
                acc_token: null,
                btnDisabled: false
            };
        },
        props: {
            stepThreeData: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        mounted() {
            this.coopListGet();
            if (this.stepThreeData) {
                this.postData = this.stepThreeData;
                if ( this.stepThreeData.is_public === 1) {
                    this.postData.is_public = "公开招标";
                    this.radioFlag.radioStatus == 1;
                } else if ( this.stepThreeData.is_public === 0) {
                this.postData.is_public = "合作招标";
                this.radioFlag.radioStatus == 2;
            }
            }
        },
        methods: {
    // 多选
            handleCheckAll() {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;
                if (this.checkAll) {
                    this.inviteCompany = this.coopList;
                } else {
                    this.inviteCompany = [];
                }
            },
    //
            checkAllGroupChange(data) {
                this.inviteCompanyID = data;
                if (data.length === this.coopList.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
            },
    // 搜索
            commitSearch() {
                this.coopListGet(this.postData.searchData);
            },
    // 获取公司列表
            async coopListGet(search = this.postData.searchData) {
                if (localStorage.acc_token) {
                    this.acc_token = JSON.parse(localStorage.acc_token);
                }
                let params = {
                    search: search,
                    acc_token: this.acc_token
                };
                let {data} = api.companyData(params);
                if (data.err_code == 0){
                    this.coopListData = data.data;
                    if (data.data) {
                    data.data.forEach(val => {
                        this.coopList.push(val.id);
                    });
                }
                } else {
                    this.$Message.error(msg.data.err_message);
                }
            },
    //上一步
            preFun() {
                this.$emit("pre");
            },
    // 下一步
            nextFun() {
                this.$emit("next");
                this.$emit(
        "sendiptVal",
        this.postData,
        this.inviteCompanyID,
        this.radioFlag.radioStatus
      );
            },
    // 切换单选框
            changeRadio(value) {
                if (value === "1") {
                    this.postData.is_public = "公开招标";
                } else if (value === "2") {
                this.postData.is_public = "合作招标";
                if (this.postData.is_public == "合作招标") {
                    if (!this.inviteCompanyID) {
                        this.$Message.error("选择合作招标需要选择相应合作企业");
            // this.btnDisabled = true;
                    } else {
            // this.btnDisabled = false;
                    }
                }
            }
            }
        }
    };
</script>

<style lang="less" scoped>
@import "../../style/addEpibolCom.less";
.addRow {
  .ul {
    border: 1px solid #d3d9e1;
    border-radius: 4px;
    .span {
      float: left;
      width: 50%;
      padding: 5px 0px;
      font-size: 13px;
      .ivu-checkbox-wrapper {
        font-size: 13px !important;
      }
    }
    .notCompany {
      display: block;
      text-align: center;
    }
    li {
      padding: 10px;
      font-size: 12px;
    }
    .title {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d3d9e1;
    }
  }
}
</style>
