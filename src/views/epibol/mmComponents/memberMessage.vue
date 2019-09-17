<template>
    <Modal v-model="showAddNew" :title="$t('memberAauthority.power_editTeamMembers')" width=720 :closable="false">
        <table border=0 style="table-layout:fixed;border-collapse:separate;border-spacing:0px 20px;" key="list">
            <!-- <tr>
              <td width=300px>登录用户名</td>
              <td width=120px colspan='2'>登录密码</td>
            </tr>
            <tr>
              <td width=320>
                <Input v-model="param.userName" placeholder="登录用户名" style="width: 300px" :disabled="editStatus"/>
              </td>
              <td width=320 colspan='2'>
                <Input v-model="param.password" placeholder="登录密码" style="width: 300px" :disabled="editStatus"/>
              </td>
            </tr> -->

            <tr>
                <td width=300px>{{$t('pc.pc_realName')}}</td>
                <td width=120px>{{$t('workbench.work_subordinateDepartments')}}</td>
                <td width=120px>{{$t('lang.lang_position')}}</td>
            </tr>
            <tr>
                <td width=320><Input v-model="param.realname" disabled :placeholder="$t('memberAauthority.power_memoName')" style="width: 300px"/></td>
                <td width=160>
                    <Select v-model="param.department_id" style="width:140px" class="select-style">
                        <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>

                    </Select>
                </td>
                <td width=160>
                    <Select v-model="param.post_id" style="width:140px" :disabled='disabled' class="select-style">
                        <Option v-for="item in dutyList" :value="item.id" :key="item.id"
                                @click.native="getMoreParams(item)">{{ item.name }}
                        </Option>
                    </Select>
                </td>
            </tr>
            <!-- <tr>
              <td width=300px>手机</td>
              <td width=120px colspan='2'>邮箱</td>
            </tr>
            <tr>
              <td width=320>
                <Input v-model="param.phone" placeholder="手机" style="width: 300px" :disabled="editStatus"/>
              </td>
              <td width=320 colspan='2'>
                <Input v-model="param.email" placeholder="邮箱" style="width: 300px" :disabled="editStatus"/>
              </td>
            </tr> -->
            <tr>
                <td width=300px>{{$t('memberAauthority.power_userName')}}</td>
                <td width=120px colspan='2'>{{$t('main.main_password')}}</td>
            </tr>
            <tr>
                <td width=320>
                    <Input v-model="param.account" :placeholder="$t('memberAauthority.power_userName')" style="width: 300px" :disabled="editStatus"/>
                </td>
                <td width=320 colspan='2'>
                    <Input v-model="param.password" :placeholder="$t('memberAauthority.power_enterMdifiedPassword')" style="width: 300px" type='password'/>
                </td>
            </tr>
        </table>
        <div slot="footer" class="btn-style">
            <Button v-if="param && param.post_id != 99999" type="error" style="float:left;" @click="remove(param.id)"
                    class="remove-btn">{{$t('companySetUp.setUp_moveOutOperator')}}
            </Button>
            <Button @click="cancel" class="cancel-btn">{{$t('lang.lang_cancel')}}</Button>
            <Button type="primary"
                    @click="revise(param.id,param.realname,param.department_id,param.post_id,param.password)"
                    :disabled='changeStatus'>{{$t('lang.lang_modify')}}
            </Button>
        </div>
    </Modal>
</template>

<script>
    import Cookies from "js-cookie";
    import {mapGetters} from "vuex";

    var qs = require("querystring");
    var t = 0;
    export default {
        props: {
            param: {
                type: Object,
                default: () => ({})
            },
            editStatus: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                showAddNew: false,
                model1: t,
                disabled: false,
                changeStatus: false,
                editPassWord: '123456'
            };
        },
        created() {
        },
        watch: {
            param(value) {
                this.param = value;
                // console.log(value)
            }
        },
        mounted() {
            this.deptListData();
            this.dutyListData();
        },
        computed: {
            ...mapGetters({
                deptList: "getDeptList",
                dutyList: "getDutyList"
            })
        },
        methods: {

            /**
             * 外部显示弹窗接口
             */
            isShowPage(isShow) {
                if (isShow.constructor == Boolean) {
                    this.showAddNew = isShow;

                    // if(data){
                    // console.log("从父组件拿过来的值",this.param)
                    // }
                    // console.log(isShow);
                    if (this.param.post_id == 99999) {
                        this.disabled = true;
                    } else {
                        this.disabled = false;
                    }

                    // this.$Modal.confirm({
                    //   onOk: () => {
                    //       this.$Message.info('Clicked ok');
                    //   },
                    //   onCancel: () => {
                    //       this.$Message.info('Clicked cancel');
                    //   }
                    // });
                    // let deptList =this.deptList;
                    // let dutyList =this.dutyList;
                    // if(deptList[deptList.length-1].name=="未分配部门"){
                    //     deptList.remove(deptList,deptList[deptList.length-1].name=="未分配部门")
                    // }
                    // if(dutyList[dutyList.length-1].name=="未分配角色"){
                    //       dutyList.remove(dutyList,dutyList[dutyList.length-1].name=="未分配角色")
                    // // console.log(121,deptList)
                    // // console.log(131,dutyList)
                    // }
                } else {
                    // console.log(false);
                    this.showAddNew = false;
                    // console.log(11110)
                }
            },

            /**
             * 部门列表
             */
            deptListData() {
                let data = {
                    company_id: JSON.parse(Cookies.get("company")).company_id //company_id1
                };
                this.$store.dispatch("fetchDeptList", data);
            },

            /**
             * 职位列表
             */
            dutyListData() {
                let data = {
                    company_id: JSON.parse(Cookies.get("company")).company_id // company_id1
                };
                this.$store.dispatch("fetchDutyList", data);
            },
            remove(id) {
                this.$emit("removed", id);
            },
            cancel() {
                this.$emit("cancel");
                this.changeStatus = false;
                this.showAddNew = false;
                // console.log(this.deptList)
            },
            revise(id, rname, did, pid, pwd) {
                this.$emit("revised", id, rname, did, pid, pwd);
            },
            getMoreParams(obj) {
                if (obj.id == 99999) {
                    this.$Message.warning(i18n.t('memberAauthority.power_authorityTips'));
                    this.changeStatus = true;
                } else {
                    this.changeStatus = false;
                }
            }
        }
    };
</script>

<style lang="less">
    .btn-style {
        .remove-btn {
            &:hover {
                color: white;
                border-color: transparent !important;
            }
        }
        .cancel-btn {
            color: #495060;
            background-color: transparent;
            border-color: transparent;
            &:hover {
                border-color: transparent !important;
                color: @base;

            }
        }
    }
</style>
