<template>
  <div>
    <Modal v-model="showAddNew" class="memberShowAddNewModal" width="920">
      <div slot="header">{{$t('memberAauthority.power_addMember')}}</div>
      <!-- <Tabs value="1" v-model="status" @on-click="changeTabs()"> -->
        <!-- 邀请成员 邀请成员功能暂隐藏 -->
        <!-- <TabPane :label="$t('memberAauthority.power_invitedMembers')" name="1">
          <div class="importTips">
            <p class="titlePrompt"><span class="icon">!</span>{{$t('memberAauthority.power_invitedTips')}}</p>
            <p class="clickImport" @click="importMember">{{$t('memberAauthority.power_batchImportMembers')}}</p>
          </div>
          <transition-group name="memberinfo">
            <table border="0" style="table-layout:fixed;border-collapse:separate;border-spacing:0px 20px;" key="list">
              <tr>
                <td width="260px">{{$t('lang.lang_email')}}</td>
                <td width="260px">{{$t('lang.lang_department')}}</td>
                <td width="260px">{{$t('lang.lang_position')}}</td>
              </tr>
              <tr v-for="item in memberInfoList" :key="item.id" v-if="isShowMemberinfolist">
                <td width="280">
                  <Input v-model="item.email" :placeholder="$t('lang.lang_email')" @on-blur="getEmailName(item)" style="width: 260px"/>
                </td>
                <td width="280">
                  <Select v-model.number="item.department_id" style="width:260px">
                    <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </td>
                <td width="280">
                  <Select v-model.number="item.post_id" style="width:260px">
                    <Option v-for="item in jobList" :value="item.id" :key="item.id" @click.native="getMoreParams(item)">{{ item.name }}</Option>
                  </Select>
                </td>
                <td TOP="50%" class="td-style">
                  <Button size="small" class="remove-btn" type="ghost" style="top:50%;margin-right:20px;width: 30px;" title="移除成员" @click="delInviteMember(item)"> - </Button>
                </td>
              </tr>
              <tr v-for="(item,index) in memberInfoList" :key="index" v-if="!isShowMemberinfolist" class="importMemberList">
                <td width="280">
                  <Input v-model="memberInfoList[index].email" placeholder="邮箱" @on-blur="getEmailName(item)" style="width: 260px"/>
                </td>
                <td width="280">
                  <Select v-model.number="memberInfoList[index].department_id" style="width:260px">
                    <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </td>
                <td width="280">
                  <Select v-model.number="memberInfoList[index].post_id" style="width:260px">
                    <Option v-for="item in jobList" :value="item.id" :key="item.id"  @click.native="getMoreParams(item)">{{ item.name }}</Option>
                  </Select>
                </td>
                <td TOP="50%"  class="td-style">
                  <Button size="small" class="remove-btn" type="ghost" style="top:50%;margin-right:20px;width: 30px" title="移除成员" @click="delInviteMember(item)"> - </Button>
                </td>
              </tr>
            </table>
          </transition-group>
          <Button size="small" class="increase-btn" type="ghost" align="right" @click="addInviteMember" style="width: 30px" title="增加成员" :disabled='changeStatus'> + </Button>
        </TabPane> -->
        <!-- 邀请成员 -->

        <!-- <TabPane label="增加内部账号" name="2"> -->
          <div class="importTips">
            <p class="titlePrompt">
              <span class="icon">!</span>{{$t('memberAauthority.importInnerAccountTips')}}
            </p>
            <p class="clickImport" @click="importMember">{{$t('memberAauthority.power_importInnerAccount')}}</p>
          </div>
          <!-- 增加内部账号 -->
          <transition-group name="memberinfo">
            <table border="0" style="table-layout:fixed;border-collapse:separate;border-spacing:0px 20px;" key="list">
              <tr>
                <td width="200px">{{$t('lang.lang_login')}}{{$t('memberAauthority.power_userName')}}</td>
                <td colspan="2" width="160px">{{$t('memberAauthority.power_loginPassword')}}</td>
                <td width="160px">{{$t('pc.pc_realName')}}</td>
                <td width="160px">{{$t('workbench.work_subordinateDepartments')}}</td>
                <td width="160px">{{$t('lang.lang_position')}}</td>
              </tr>
              <tr class="importMemberList" v-for="(item,index) in interiorMemberInfoList" :key="index" v-if="isShowMemberinfolist" >
                <td width="200">
                  <Input v-model="item.account" :placeholder="$t('lang.lang_login') + $t('memberAauthority.power_userName')" style="width: 180px"/>
                </td>
                <td colspan="2" width="160" style="padding-right:17px;">
                  <!-- <input type="password" style="display:none"> -->
                  <!-- autocomplete="new-password" -->
                  <Input v-model="item.password" :placeholder="$t('memberAauthority.power_loginPassword')" style="width:140px" autocomplete="off"/>
                </td>
                <td width="160">
                  <Input v-model="item.realname" :placeholder="$t('pc.pc_realName')" style="width: 140px"/>
                </td>
                <td width="160">
                  <Select v-model.number="item.department_id" style="width:140px">
                    <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </td>
                <td width="160">
                  <Select v-model.number="item.post_id" style="width:140px">
                    <Option v-for="item in jobList" :value="item.id" :key="item.id" @click.native="getMoreParams(item)">{{ item.name }}</Option>
                  </Select>
                </td>
                <td TOP="50%" class="td-style">
                  <Button class="remove-btn" size="small" type="ghost" style="top:50%;width: 30px" @click="delInteriorMember(item)" :title="$t('memberAauthority.power_removeMembers')"> - </Button>
                </td>
              </tr>
              <!-- 批量导入内部账号 start  -->
              <tr class="importMemberList" v-for="(item,index) in interiorMemberInfoList" :key="index" v-if="!isShowMemberinfolist">
                <td width="200">
                  <Input v-model="interiorMemberInfoList[index].account" :placeholder="$t('lang.lang_login') + $t('memberAauthority.power_userName')" style="width:180px"/>
                </td>
                <td colspan="2" width="160" style="padding-right:17px;">
                  <Input v-model="interiorMemberInfoList[index].password" :placeholder="$t('memberAauthority.power_loginPassword')" style="width: 140px"/>
                </td>
                <td width="160">
                  <Input v-model="interiorMemberInfoList[index].realname" :placeholder="$t('pc.pc_realName')" style="width: 140px"/>
                </td>
                <td width="160">
                  <Select v-model="interiorMemberInfoList[index].department_id" style="width:140px">
                    <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </td>
                <td width="160">
                  <Select v-model="interiorMemberInfoList[index].post_id" style="width:140px">
                    <Option v-for="item in jobList" :value="item.id" :key="item.id" @click.native="getMoreParams(item)">{{ item.name }}</Option>
                  </Select>
                </td>
                <td TOP="50%"  class="td-style">
                  <Button size="small" class="remove-btn" type="ghost" style="top:50%;width: 30px" @click="delInteriorMember(item)" :title="$t('memberAauthority.power_removeMembers')"> - </Button>
                </td>
              </tr>
              <!-- 批量导入内部账号 end -->
            </table>
          </transition-group>
          <Button size="small" class="increase-btn" type="ghost" @click="addInteriorMember" style="width: 30px" :title="$t('memberAauthority.power_addMembers')"> + </Button>
        <!-- </TabPane> -->
      <!-- </Tabs> -->
      <div slot="footer">
        <!-- v-if="invite" -->
        <!-- <Button size="large" type="primary" @click="inviteMember" v-if="invite">邀请</Button> -->
        <Button size="large" type="primary" @click="addMember" :disabled='changeStatus'>{{$t('lang.lang_add')}}</Button>
      </div>
    </Modal>
    <!-- 批量导入对话框 start -->
    <Modal v-model="importMemberModal" width="720">
      <div slot="header" class="headerContent">
        <div class="headerBack">
          <Icon type="chevron-left" style="font-size:16px;"></Icon>
          <span @click="backTo">{{$t('lang.lang_back')}}</span>
        </div>
        <!-- <div v-if="invite">批量导入成员</div> -->
        <div>{{$t('memberAauthority.power_importInnerAccount')}}</div>
      </div>
      <div class="modalContent">
        <div class="leftStep">
          <p class="operationStep">{{$t('memberAauthority.power_operationSteps')}}</p>
          <Steps :current="current" direction="vertical">
            <!-- <Step title="点击" v-if="invite"><Button type="ghost" icon="ios-cloud-download-outline" style="font-size:12px;" @click="downloadMember">下载成员模板</Button></Step> -->
            <Step :title="$t('memberAauthority.power_click')"><Button type="ghost" icon="ios-cloud-download-outline" style="font-size:12px;" @click="downloadInterior">{{$t('memberAauthority.power_downloadTemplateInner')}}</Button></Step>
            <!-- <Step title="上传成员模板文件" v-if="invite"></Step> -->
            <Step :title="$t('memberAauthority.power_uploadTemplateInner')"></Step>
            <!-- <Step title="成功导入" v-if="invite"></Step> -->
            <Step :title="$t('memberAauthority.power_success')"></Step>
          </Steps>
        </div>
        <div v-show="editShow" class="rightContent">
          <div class="rightContentBox">
            <Upload :action="uploadUrl" name="file" :show-upload-list="false" :on-format-error="formatError" :on-progress="handleUpload" :on-success="uploadSuccess" :on-error="uploadFail" accept="xls,xlsx" :format="['xls','xlsx']">
              <Button type="ghost" icon="ios-cloud-upload-outline" style="min-width: 140px;">{{$t('memberAauthority.power_uploadFiles')}}</Button>
            </Upload>
          </div>
        </div>
        <div v-show="!editShow" class="rightIner">
          <p class="againUpload" @click="againUploadFile">{{$t('memberAauthority.power_reupload')}}</p>
          <div class="fileName">
            <span v-if="fileList !== null">{{ fileList.name }}</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="confirmImport" :disabled="disabled">{{$t('memberAauthority.power_confirmImport')}}</Button>
      </div>
    </Modal>
    <!-- 批量导入对话框 end -->
    <!-- 加载中 -->
    <div class="popUp" v-if="loadingStatus">
      <Spin size="large" class="spinSty"></Spin>
    </div>
  </div>
</template>

<script>
import md5 from "md5";
import { mapGetters } from "vuex";
import { mapMutations, mapActions } from "vuex";
import Cookies from "js-cookie";
import api from "api";
export default {
    name: "memberinvite",
    data() {
        return {
            num: 1,
            status: "1",
            invite: true,
            showAddNew: false,
            newToDoItemValue: "",
            initmemberinfo: {
                num: 0,
                account: "",
                name: "",
                profession: ""
            },
            memberInfoList: [
                {
                    id: 1,
                    email: "",
                    name: "",
                    department_id: "",
                    post_id: "",
                    disable: false
                }
            ],
            initinteriormemberinfo: {
                num: 0,
                account: "",
                password: "",
                name: "",
                profession: ""
            },
            inviteArr: [],
            inviteData: {
                email: "",
                name: "",
                department_id: "",
                post_id: ""
            },
            addData: {
                company_id: JSON.parse(Cookies.get('company')).company_id, // company_id1
                realname: "",
                password: "",
                email: "",
                phone: "",
                department_id: "",
                post_id: ""
            },
            interiorMemberInfoList: [
                {
                    id: 1,
                    account: "",
                    password: "",
                    realname: "",
                    department_id: "",
                    post_id: ""
                }
            ],
            importMemberModal: false, // 批量导入邀请成员对话框
            disabled: true,
            editShow: true,
            current: 0,
            fileList: null,
            fileId: 0,
            loadingStatus: false,
      // uploadType: "outside", // 上传类型   邀请成员功能暂时隐藏
            uploadType: "inside", // 上传类型
            importMemberData: [],
            internalMembersData: [],
            isShowMemberinfolist: true,
            isShowExitMemberinfolist: true,
            token: localStorage.token,
            jobList: null,
            changeStatus: false,
        };
    },
    computed: {
        ...mapGetters({
            deptList: "getDeptList",
            dutyList: "getDutyList"
        }),
    // 上传地址（必填）
        uploadUrl() {
            let baseURL = window.location.host.indexOf("banbooyun.com") !== -1 ? window.location.protocol + "//" + window.location.host : "https://dev.banbooyun.com";
            let base = baseURL + '/' + this.GLOBAL.baseRouter;
            return base + this.$GLOBALAPI.file_file_upload;
        },
        a() {
            return this.$store.state.dutyList;
        }
    },
    mounted() {
        this.dutyListData();
    },
    watch: {
        dutyList(value) {

            this.jobList = value.slice(1, value.length);

        },
    },
    methods: {
        ...mapMutations(['getCompanyMembers']),
        getMoreParams(obj) {
            if (obj.id == 99999) {
                this.$Message.warning(i18n.t('memberAauthority.power_authorityTips'));
                this.changeStatus = true;
            } else {
                this.changeStatus = false;
            }
        },
        async getInitInfo() {
            let {data} = await api.getInfoRole();
            if (deta.err_code == 0){
                this.getCompanyMembers(data.company.member_count + '');
            }
        },

    /**
     * 获取加密密码的密钥
     */
        async fetchKey() {
            let {data} = await api.getPublicSecretKey();
            if (data.err_code == 0){
                this.publicKey = data.public_key;
            }
        },
     // ---------------- 邀请成员功能暂隐藏start ------------------ //
    /**
     * tab切换，显示当前tab
     */
    // changeTabs() {
    //   if (this.status == "1") {
    //     this.invite = true;
    //     this.uploadType = "outside";
    //   } else if (this.status == "2") {
    //     this.invite = false;
    //     this.uploadType = "inside";
    //   }
    // },
     // ---------------- 邀请成员功能暂隐藏end ------------------ //
    //表单验证

    /**
     * 部门列表
     */
        deptListData() {
            let data = {
                company_id: JSON.parse(Cookies.get('company')).company_id// company_id1
            };
            this.$store.dispatch("fetchDeptList", data);
        },

    /**
     * 职位列表
     */
        dutyListData() {
            let data = {
                company_id: JSON.parse(Cookies.get('company')).company_id// company_id1
            };
            this.$store.dispatch("fetchDutyList", data);
      //  setTimeout(()=>{
      //     console.log(1222,this.dutyList)
      //  },1000)

        },

    /**
     * 邀请成员
     */
        inviteMember() {
            let _this = this;
            let exp = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
            let flag = false;
            this.disabled = true;
            this.editShow = true;
      // 手动邀请外部成员
            if (_this.isShowMemberinfolist) {
                _this.memberInfoList.map(function(creent, index, array) {
                    if (!creent.email || creent.email == null || creent.email == "") {
                        _this.$Message.error(i18n.t('memberAauthority.power_ErrorMessageOne'));
                        return (flag = false);
                    } else if (!exp.test(creent.email)){
                        _this.$Message.error(i18n.t('memberAauthority.power_ErrorMessageTwo'));
                        return (flag = false);
                    } else {
                        return (flag = true);
                    }
                });
                if (flag) {
                    let params = [];
                    _this.memberInfoList.map((items, index) => {
                        params.push({
                            email: items.email,
                            department_id: items.department_id,
                            post_id: items.post_id
                        });
                    });
                    let Add = async () => {
                        let Addmember = await api.Addmember(params);
                        if (Addmember.data.err_code == 0) {
                            this.$Message.success(i18n.t('companySetUp.setUp_addSuccess'));
                            _this.memberInfoList.map((item, index) => {
                                item.email = "";
                                item.department_id = "";
                                item.post_id = "";
                            });
                            _this.memberInfoList.length = 1;
                            this.showAddNew = false;
                        } else {
                            this.$Message.error(Addmember.data.err_message);
                            _this.memberInfoList.map((item, index) => {
                                item.email = "";
                                item.department_id = "";
                                item.post_id = "";
                            });
                            _this.memberInfoList.length = 1;
                            this.showAddNew = false;
                        }
                    };
                    Add();
                }
        // 批量上传邀请
            } else {
                _this.memberInfoList.map(function(items, index) {
                    if ( items.email == 'error' || items.name == 'error' || items.post_id == 'error'){
                        _this.$Message.error(i18n.t('memberAauthority.power_ErrorMessageThree'));
                        return (flag = false);
                    } if (items.department_id == 'error'){
                    } else {
                        return (flag = true);
                    }
                });
                if (flag) {
                    let Add = async () => {
                        let Addmember = await api.Addmember(_this.memberInfoList);
                        if (Addmember.data.err_code == 0) {
                            this.$Message.success(i18n.t('companySetUp.setUp_addSuccess'));
                            _this.memberInfoList.map((item, index) => {
                                item.department_id = '';
                                item.email = '';
                                item.post_id = '';
                            });
                            _this.memberInfoList.length = 1;
                            this.showAddNew = false;
                        } else {
                            this.$Message.error(Addmember.data.err_message);
                            this.showAddNew = false;
                        }
                    };
                    Add();
                }
            }
        },

    /**
     * 新增辅助成员
     */
        addMemberFun(){
            let _this = this;
            let flag = false;

            _this.$axios.get(_this.GLOBAL.baseRouter + this.$GLOBALAPI.system_get_public_secret_key).then(res => res.data).then(res => {
                if (res.err_code == 0) {
                    let encrypt = new JSEncrypt(); // 新建JSEncrypt对象
                    encrypt.setPublicKey(res.public_key);
                    let params = [];
                    _this.interiorMemberInfoList.forEach((creent, index) => {
                        creent.password = encrypt.encrypt(md5(md5(creent.password)));
                        params.push({
                            account: creent.account,
                            password: creent.password,
                            realname: creent.realname,
                            department_id: creent.department_id,
                            post_id: creent.post_id
                        });
                    });
                    let getData = async function() {
                        let res = await api.addInteriorPersonnel({data: JSON.stringify(params)});
                        let returnData = res.data.data;
                        returnData.map((items, index, array)=>{
                            if (items.error == ''){
                                return (flag = true);
                            } else {
                                _this.$Message.error(items.error);
                                _this.showAddNew = false;
                                _this.interiorMemberInfoList[index].account = "";
                                _this.interiorMemberInfoList[index].password = "";
                                _this.interiorMemberInfoList[index].realname = "";
                                _this.interiorMemberInfoList[index].department_id = "";
                                _this.interiorMemberInfoList[index].post_id = "";
                                _this.interiorMemberInfoList.length = 1;
                      // _this.interiorMemberInfoList.splice(1,index)
                                return (flag = false);
                            }
                        });
                        if (res.data.err_code == 0 && flag) {
                      // _this.$Message.success("添加辅助成员成功");
                            _this.$Message.success(i18n.t('memberAauthority.power_ErrorMessageEleven'));
                            _this.getInitInfo();
                            _this.showAddNew = false;
                            _this.interiorMemberInfoList.forEach((item, index) => {
                                item.account = "";
                                item.password = "";
                                item.realname = "";
                                item.department_id = "";
                                item.post_id = "";
                            });
                            _this.interiorMemberInfoList.length = 1;
                        }
                        _this.deptListData();
                        _this.dutyListData();
                        _this.$emit("test", null, sessionStorage.comId, sessionStorage.deptId);
                    };
                    getData();
                }
            });

        },
        addMember() {
            let _this = this;
            let state = false;
            this.disabled = true;
            this.editShow = true;
            if (_this.isShowMemberinfolist) {
                _this.interiorMemberInfoList.map(function(items, index) {
                    if (items.account == "") {
                        _this.$Message.error(i18n.t('memberAauthority.power_ErrorMessageEleven'));
                        return (state = false);
                    } else if (items.password == "") {
                        _this.$Message.error(i18n.t('memberAauthority.power_emptyErrorPrompt'));
                        return (state = false);
                    } else if (items.password.length < 6) {
                        _this.$Message.error(i18n.t('memberAauthority.power_ErrorMessageSix'));
                        return (state = false);
                    } else if (items.password.indexOf(" ") >=0){
                        _this.$Message.error(i18n.t('memberAauthority.power_blankErrorPrompt'));
                        return (state = false);
                    } else if (items.realname == "") {
                        _this.$Message.error(i18n.t('memberAauthority.power_ErrorMessageNight'));
                        return (state = false);
                    } else {
                        return (state = true);
                    }
                });
                if (state) {
                    _this.addMemberFun();
                }
            } else {
        // console.log("批量导入内部成员！！！");
                _this.addMemberFun();
            }
        },

    // ---------------------- + 号 --------------------------- //
    //   增加一行艺术家用户信息
        addInviteMember() {
            this.num++;
            var info = {
                id: this.num,
                email: "",
                name: "",
                department_id: "",
                post_id: "",
                disable: false
            };
            this.memberInfoList.push(info);
        },
    //   增加一行内部用户信息
        addInteriorMember() {
            this.num++;
            var info = {
                id: this.num,
                realname: "",
                password: "",
                email: "",
                department_id: "",
                post_id: ""
            };
            this.interiorMemberInfoList.push(info);
        },
    // ---------------------- - 号 --------------------------- //
        removeFromList() {
      //需要移动到工具函数中
            Array.prototype.indexOf = function(val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) {return i;}
                }
                return -1;
            };
      //需要移动到工具函数中
            Array.prototype.remove = function(val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
        },
    //   删除一行艺术家用户信息
        delInviteMember(item) {
            this.removeFromList();
            this.memberInfoList.remove(item);
            this.importMemberData.remove(item);
        },
    //   删除一行内部用户信息
        delInteriorMember(item) {
            this.removeFromList();
            this.interiorMemberInfoList.remove(item);
            this.internalMembersData.remove(item);
        },

    /**
     * 外部显示弹窗接口
     */
        isShowPage(isShow) {
            if (isShow.constructor == Boolean) {
                this.showAddNew = isShow;
            } else {
                this.showAddNew = false;
            }
        },

    /*根据邮箱获取姓名*/
        async getEmailName(item) {
            let { data } = await api.getEmailName({ email: item.email });
            if (data.err_code === 0) {
                item.disable = false;
                if (data.data) {
                    item.disable = true;
                }
                item.name = data.data;
            }
        },
    // 批量导入邀请成员
        importMember() {
            this.importMemberModal = true;
            this.showAddNew = false;
            this.editShow = true;
            this.isShowMemberinfolist = !this.isShowMemberinfolist;
        },
    // 返回
        backTo() {
            this.importMemberModal = false;
            this.showAddNew = true;
        },
    // 重新上传按钮
        againUploadFile() {
            this.disabled = true;
            this.editShow = true;
       // ---------------- 邀请成员功能暂隐藏start ------------------ //
      // if (this.uploadType === "outside" && this.isShowMemberinfolist){
      //   this.memberInfoList.map((items,index)=>{
      //     items.email = "";
      //     items.name = "";
      //     items.department_id = "";
      //     items.post_id = "";
      //   })
      // } else
      // ---------------- 邀请成员功能暂隐藏end ------------------ //
            if (this.uploadType === "inside" && !this.isShowMemberinfolist){
                this.interiorMemberInfoList.map((val, index)=>{
                    val.account = "";
                    val.password = "";
                    val.realname = "";
                    val.department_id = "";
                    val.post_id = "";
                });
            }
        },
    // 文件格式验证失败时的钩子
        formatError(event) {
            if (event.type != "xls" || event.type != "xlsx") {
                this.$Message.warning(i18n.t('memberAauthority.power_ErrorMessageNine'));
            }
        },
    // 文件上传时的钩子
        handleUpload(event, file) {
            this.fileList = file;
            this.fileName = file.name;
            this.loadingStatus = true;
            return false;
        },
    // 文件上传成功时的钩子
        uploadSuccess(res, file) {
            this.disabled = false;
            this.editShow = false;
            this.loadingStatus = false;
            this.fileId = res.file.fid;
            return false;
        },
    // 文件上传失败时的钩子
        uploadFail(error, file) {
            this.loadingStatus = false;
            return false;
        },
    // 确认批量导入
        async confirmImport() {
            let exp = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
            this.importMemberModal = false;
            this.showAddNew = true;
            let params = {
                file_id: this.fileId,
                type: this.uploadType
            };
            let { data } = await api.importMember(params);
       // ---------------- 邀请成员功能暂隐藏start ------------------ //
      // if (this.uploadType === "outside") {
      //   if (data.err_code === 0 && data.data.length > 0) {
      //     let newArray  = [];
      //     this.importMemberData = data.data;
      //     this.importMemberData.forEach((val, index) => {
      //       if(val.email.value  == ""){
      //         this.$Message.error('邮箱不能为空!');
      //       }else if(!exp.test(val.email.value)){
      //         this.$Message.error('邮箱格式错误!');
      //       }else if(val.department.value == 'error'){
      //         this.deptList.map((item,index)=>{
      //           if(item.name == "未分配部门"){
      //             val.department.value = val.department.value = item.id;
      //           }
      //         })
      //       }
      //       if(val.post.value == 'error'){
      //         this.dutyList.map((item,index)=>{
      //           if(item.name == "未分配职能"){
      //             val.post.value = val.post.value = item.id;
      //           }
      //         })
      //       }
      //       newArray.push({
      //         email: val.email.value,
      //         // name: val.realname.value,
      //         department_id: parseInt(val.department.value),
      //         post_id: parseInt(val.post.value),
      //       });
      //     });
      //     this.memberInfoList = newArray;
      //   }else{
      //     this.$Message.error(data.err_message);
      //   }
      // } else
      // ---------------- 邀请成员功能暂隐藏end ------------------ //
            if (this.uploadType === "inside") {
                if (data.err_code === 0 && data.data.length > 0) {
                    let newArray = [];
                    this.internalMembersData = data.data;
                    this.internalMembersData.forEach((val, index) => {
                        if (val.account.value == ''){
                            this.$Message.error(i18n.t('memberAauthority.power_ErrorMessageTen'));
                        }
                        if (val.password.value == ''){
                            this.$Message.error(i18n.t('memberAauthority.power_ErrorMessageFive'));
                        } else if (val.password.value.toString().length < 6){
                            this.$Message.error(i18n.t('memberAauthority.power_lengthErrorPrompt'));
                        }
                        if (val.department.value == 'error'){
                            this.deptList.map((item, index)=>{
                                if (item.name == i18n.t('workbench.work_unallocatedDepartments')){
                                    val.department.value = val.department.value = item.id;
                                }
                            });
                        } else {
              // console.log(110,val.department.value);

                        }
                        if (val.post.value == 'error'){
                            this.dutyList.map((item, index)=>{
                                if (item.name == i18n.t('memberAauthority.power_unassignedFunc')){
                                    val.post.value = val.post.value = item.id;
                                }
                            });
                        } else {
              // console.log(999,parseInt(val.post.value));
                        }
            // if(val.post.value == '99999'){
            //   this.changeStatus = true;
            // } else{
            //   this.changeStatus = false;
            // }
                        newArray.push({
                            account: val.account.value,
                            password: val.password.value + '',
                            realname: val.realname.value,
                            department_id: parseInt(val.department.value),
                            post_id: parseInt(val.post.value),
                        });
                    });
                    this.interiorMemberInfoList = newArray;
                } else {
                    this.$Message.error(data.err_message);
                }
            }
        },
    // 点击下载成员模板
        downloadMember() {
            let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_excel_template;
            let hostName = Cookies.get("hostName");
            let download = hostName + '/'+ url + "&token=" + this.token + "&type=" + 'outside';
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = download;
            a.click(); //点击触发下载
        },
    // 点击下载内部账号模板
        downloadInterior() {
            let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_excel_template;
            let hostName = Cookies.get("hostName");
            let download = hostName + '/'+ url + "&token=" + this.token + "&type=" + 'inside';
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = download;
            a.click(); //点击触发下载
        },
    }
};
</script>
<style lang="less" scoped>
.ivu-tabs {
  padding-bottom: 190px;
}
.importTips {
  display: flex;
  justify-content: space-between;
  background: #e0e0e0;
  margin-top: 20px;
}
.titlePrompt {
  height: 35px;
  padding-left: 10px;
  line-height: 35px;
  color: @orange;
  border-radius: 4px;
}

.icon {
  display: inline-block;
  width: 13px;
  height: 13px;
  margin-right: 5px;
  color: @orange;
  border: 1px solid @orange;
  border-radius: 50%;
  text-align: center;
  line-height: 13px;
}
.clickImport {
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  color: @base;
  cursor: pointer;
  padding-right: 10px;
}
.ivu-modal-header {
  div,
  span {
    font-size: 16px !important;
    color: #fff !important;
    font-weight: 100 !important;
  }
  .headerContent {
    display: flex;
    .headerBack {
      padding-right: 245px;
      cursor: pointer;
    }
  }
}

.modalContent {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 30px 0px;
}
.operationStep {
  margin-bottom: 35px;
  font-size: 16px;
  color: #616161;
}

.rightContent {
  width: 60%;
  background: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  .rightContentBox {
    border: 1px dashed @base;
    padding: 45px;
    cursor: pointer;
    .ivu-icon {
      color: @base;
    }
    span {
      color: @base;
      font-size: @fs13;
    }
  }
}
.rightIner {
  width: 60%;
  background: #f2f2f2;
  .againUpload {
    display: inline-block;
    font-size: @fs14;
    color: @base;
    border: 1px dashed @base;
    border-radius: @r4;
    padding: 5px 10px;
    margin-top: 15px;
    margin-left: 295px;
    cursor: pointer;
  }
  .fileName {
    text-align: center;
    color: @base;
    font-size: @fs14;
    padding-top: 120px;
    padding-bottom: 55px;
  }
}
</style>
<style lang="less">
.memberShowAddNewModal {
  .ivu-modal-body {
    padding: 0 30px 20px 30px;
  }
}
.importMemberList {
  .memberEmail,
  .memberRealname,
  .memberDepartment,
  .memberPost,
  .memberPwd {
    border-color:@red;
  }
}
// .internalMenmberList {
//   td {
//   }
//   .td-style{
//     .remove-btn{
//     &:hover{
//       color: @base;
//       border-color: @base !important;
//       }
//     }
//   }
// }
.leftStep {
  width: 40%;
  padding: 30px 0px 30px 30px;
  background: #f2f2f2;
  margin-right: 16px;
  .ivu-steps {
    .ivu-steps-item {
      .ivu-steps-tail {
        i {
          background-color: #bcbcbc;
        }
      }
      .ivu-steps-head {
        background-color: #f2f2f2;
        .ivu-steps-head-inner {
          border-color: #ffcc00;
          background-color: #ffcc00;
          span {
            color: @black_1;
          }
        }
      }
      .ivu-steps-main {
        min-height: 55px;
        .ivu-steps-title {
          background-color: #f2f2f2;
        }
        .ivu-btn-ghost {
          min-width: 130px;
          color: @base_active;
          background-color: #fff;
          border-color: @base_active;
          border-radius: 6px;
          vertical-align: baseline;
          padding: 5px 10px;
        }
      }
    }
  }


}
</style>
