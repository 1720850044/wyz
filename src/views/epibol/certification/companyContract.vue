<template>
    <div >
        <div class="certificationSealerContainer" >
            <!--是否获取信息-->
            <template v-if="formData.signer&&pageType||!pageType">
                <!--经办人-->
                <section class="agentContainer" v-if="pageType===0">
                    <div class="title">
                        <Button type="primary" @click="operatorShow('addOperator',operatorList)">
                            <Icon type="ios-plus-outline" size="18"></Icon>
                            {{$t('companySetUp.setUp_increaseOperator')}}
                        </Button>
                    </div>
                    <section v-for="(item,index) in operatorList" :key="index" class=" agentContainerList">
                        <div class="signTextContainer">
                            <p class="signText">{{$t('companySetUp.setUp_operator')}}</p>

                        </div>
                        <div class="operatorInfo">
                            <div class="operatorExhibition">
                                <div>
                                    <img v-if="item.headimage" :src="item.headimage" alt="">
                                    <img v-else src="../../../assets/images/leader.png" alt="">
                                </div>
                                <span>{{item.realname||'空'}}</span>
                                <!-- <Icon type="chatbox-working" style="color: #62d8c5;"></Icon> -->
                                <div style="margin-top:10px;">
                                  <span class="changeButton"  @click="operatorShow('changeOperator',item)" style="">{{$t('companySetUp.setUp_replaceOperator')}}</span>
                                  <span class="delButton" @click="delOperator(item)" >{{$t('companySetUp.setUp_moveOutOperator')}}</span>

                                </div>
                            </div>
                            <ul class="agentInfoList">
                                <li><span style="color: #cfcfcf;font-size:13px;">{{$t('companySetUp.setUp_realNameAuthentication')}}</span>
                                    <p>
                                        <Icon :class="{'green':item.is_confirm}" type="checkmark-circled"
                                              size="16"></Icon>
                                    </p>
                                </li>
                                <li><span style="color: #cfcfcf;font-size:13px;">{{$t('companySetUp.setUp_electronicSignature')}}</span>
                                    <p>
                                        <Icon :class="{'green':item.is_sign}" type="checkmark-circled"
                                              size="16"></Icon>
                                    </p>
                                </li>
                                <li><span style="color: #cfcfcf;font-size:13px;">{{$t('companySetUp.setUp_function')}}</span>
                                    <p>{{item.post_name}}</p>
                                </li>
                                <li><span style="color: #cfcfcf;font-size:13px;">{{$t('companySetUp.setUp_contactInformation')}}</span>
                                    <p >
                                        <span style="font-size: 14px;">{{item.phone}}</span>
                                        <Icon style="padding: 0 8px;color:#62d8c5 " type="checkmark-circled" size="16"></Icon>
                                        <span style="color:#62d8c5">{{$t('companySetUp.setUp_certified')}}</span>
                                    </p>
                                </li>

                            </ul>
                        </div>
                    </section>


                </section>
                <!-- 签章人-->
                <section v-else-if="pageType===1" style="flex: 1;" >
                  <section class="operatorList">
                    <div class="signTextContainer">
                      <p class="signText">{{$t('companySetUp.setUp_signer')}}</p>
                   </div>
                    <div class="operatorInfo">
                        <div class="operatorExhibition">
                            <div>
                                <img :src="formData.signer_headimage" alt="">
                            </div>
                            <span>{{formData.signer_name}}</span>
                            <!-- <Icon type="chatbox-working"></Icon> -->
                            <div style="margin-top:10px;">
                              <span class="changeButton"  @click="operatorShow('changeSigner')">{{$t('companySetUp.setUp_replaceSigner')}}</span>
                            </div>
                        </div>

                        <ul class="agentInfoList" >
                            <li><span style="color: #cfcfcf;font-size:13px;">{{$t('companySetUp.setUp_function')}}</span>
                              <p>
                                {{formData.signer_post}}
                              </p>
                            </li>
                            <li><span style="color: #cfcfcf;font-size:13px;">{{$t('lang.lang_phone')}}</span>
                              <span>{{formData.signer_phone}}
                                <Icon style="padding: 0 8px;color:#62d8c5 " type="checkmark-circled" size="16"></Icon>
                                <span style="color:#62d8c5">{{$t('companySetUp.setUp_certified')}}</span>
                              </span>
                            </li>
                            <li><span style="color: #cfcfcf;font-size:13px;">{{$t('companySetUp.setUp_realNameAuthentication')}}</span>
                                <p>
                                  <Icon :class="{'green':formData.is_confirm}" type="checkmark-circled" size="16"></Icon>
                                </p>
                            </li>


                        </ul>
                    </div>

                  </section>
                </section>
                <!-- 经办人/签章人右侧说明文字 -->
                <section class="promptContainer">
                    <p class="title">{{$t('companySetUp.setUp_explain')}}</p>
                    <ul class="promptList" v-if="pageType">
                        <li>{{$t('companySetUp.setUp_explanatoryNoteOne')}}</li>
                        <li>{{$t('companySetUp.setUp_explanatoryNoteTwo')}}</li>
                        <li>{{$t('companySetUp.setUp_explanatoryNoteThree')}}</li>
                        <li>{{$t('companySetUp.setUp_explanatoryNoteFour')}}</li>
                    </ul>
                    <ul v-else class="promptList">
                        <li>{{$t('companySetUp.setUp_explanatoryNoteFive')}}</li>
                        <li>{{$t('companySetUp.setUp_explanatoryNoteSix')}}</li>
                        <li>{{$t('companySetUp.setUp_explanatoryNoteSeven')}}</li>
                        <li>{{$t('companySetUp.setUp_explanatoryNoteNight')}}</li>
                        <li>{{$t('companySetUp.setUp_explanatoryNoteNightT')}}</li>
                    </ul>
                </section>
            </template>
            <div v-else style="width:100%;margin-top: 300px;height: 100%;text-align: center;">
                <div v-if="pageType===1" @click="operatorShow('changeSigner')">
                    <img :src="require('@/assets/images/signer.png')" alt="">
                    <p>{{$t('companySetUp.setUp_explanatoryNoteNine')}}</p>
                </div>
                <div v-else @click="operatorShow('changeOperator')">
                    <p>{{$t('companySetUp.setUp_explanatoryNoteTen')}}</p>
                    <p>{{$t('companySetUp.setUp_explanatoryNoteEleven')}}</p>
                </div>
            </div>
        </div>
        <!-- 更换经办人面板 -->
          <Modal
                class="addOperatorModal"
                v-model="changeOperatorModal"
                width="600px"
                ok-text="确认更换"
                @on-ok="changeOperator"
                :title="$t('companySetUp.setUp_replaceOperator')">
                <ul class="signTextContainerList">
                    <li v-for="(item,index) in changeOperatorList" :key="index" @click="selectSigner(item,index,'_operator')"
                        :class="{'activeButton':item.active}">
                        <img v-if="item.headimage" class="headImage" :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.user_id"></img>
                        <img v-else class="headImage" src="../../../assets/images/leader.png"></img>
                        <div :title="item.realname" class="title">{{item.realname}}</div>
                        <Icon v-if="!item.active" class="icon" type="ios-plus-outline" size="16"></Icon>
                        <Icon v-else :class="[{'green':item.active},'icon']" size="16" type="checkmark-circled"></Icon>
                    </li>

                </ul>
        </Modal>
        <!-- 增加经办人面板 -->
         <Modal
                class="addOperatorModal"
                v-model="addOperatorModal"
                width="600px"
                ok-text="确认增加"
                @on-ok="submit"
                :title="$t('companySetUp.setUp_increaseOperator')">
            <ul class="signTextContainerList">
                <li  v-for="(item,index) in addOperatorList" :key="index" @click="selectSigner(item,index,'_operator')"
                    :class="{'activeButton':item.active}">
                    <img v-if="item.headimage" class="headImage" :src="GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+item.user_id"></img>
                    <img v-else class="headImage" src="../../../assets/images/leader.png"></img>
                    <div :title="item.realname" class="title">{{item.realname}}</div>
                    <Icon v-if="!item.active" class="icon" type="ios-plus-outline" size="16"></Icon>
                    <Icon v-else :class="[{'green':item.active},'icon']" size="16" type="checkmark-circled"></Icon>
                </li>

            </ul>
        </Modal>
        <!-- 签章人面板 -->
        <Modal
                class="addOperatorModal"
                v-model="addSignerModal"
                width="600px"
                ok-text="确认修改"
                @on-ok="submit"
                :title="isChangeSigner?$t('companySetUp.setUp_addSigner'):$t('companySetUp.setUp_replaceSigner')">
            <ul class="signTextContainerList">
                <li  v-for="(item,index) in signerList" :key="index" @click="selectSigner(item,index,'_signer')"
                    :class="{'activeButton':item.active}">
                    <img v-if="item.headimage" class="headImage" :src="item.headimage"></img>
                    <img v-else class="headImage" src="../../../assets/images/leader.png"></img>
                    <div :title="item.remark_name" class="title">{{item.remark_name}}</div>
                    <Icon v-if="!item.active" class="icon" type="ios-plus-outline" size="16"></Icon>
                    <Icon v-else :class="[{'green':item.active},'icon']" size="16" type="checkmark-circled"></Icon>
                </li>

            </ul>
        </Modal>
    </div>
</template>

<script>
import api from "api";
export default {
    created() {
        this.initsealer();
        this.getOperatorList();
        this.initCurrent();
    },
    mounted() {
        this.$bus.on("attestation", () => {
            this.attestation();
        });
    },
    props: {
        pageType: {
            type: Number // 签章人1（true） 经办人0（false）
        }
    },
    data() {
        return {
            changeOperatorID: null, // 更换经办人时要添加的id
            operatorList: [], // 经办人列表
            addSignerModal: false,
            changeOperatorModal: false,
            addOperatorModal: false,
            value: "",
            formData: {
                work: "",
                signer_phone: "",
                is_confirm: false,
                signer_headimage: "",
                signer: "",
                signer_name: "",
                signer_post: ""
            },
            signer_name: "",
            signer_phone: "",
            headimage: "",
            signerList: [],
            isAttestation: false,
            user_id: [],
            signer: [],
            changeUserId: null, // 被更改人id
            changeOperatorList: [], // 原始modal列表 取消的时候赋值
            addOperatorList: [], // 增加经办人弹出面板的经办人列表
            isChangeOperator: false, //
            isChangeSigner: false, //
        };
    },
    methods: {
        operatorShow(role, item) {
            this.active();
            this.user_id = [];
            console.log('aaaaaaaaaa');
      
      // 判断角色是经办人还是签章人
            if (role === "changeOperator") {
                this.isChangeOperator = true;
                this.changeOperatorModal = true;

                this.changeUserId = item.operator_id; // 点击更换经办人得到被更换人的id
                this.changeOperatorList = this.signerList;
                this.filterState(item);
            } 
            else if (role === "addOperator") {
                this.isChangeOperator = false;
                this.addOperatorModal = true;

                var array1 = item;
                var array2 = this.signerList;
                var result = [];
                for (var i = 0; i < array2.length; i++) {
                    var obj = array2[i];
                    var num = obj.user_id;
                    var isExist = false;
                    for (var j = 0; j < array1.length; j++) {
                      var aj = array1[j];
                      var n = aj.operator_id;
                      if (n == num) {
                        isExist = true;
                        break;
                    }
                  }
                    if (!isExist) {
                      result.push(obj);
                  }
                }
                console.log(result);
        
                this.addOperatorList = result;
            } 
            else if (role === "changeSigner") {
                this.isChangeSigner = true;
                this.addSignerModal = true;
            }
            else if (role === "addSigner") {
                this.isChangeSigner = false;
                this.addSignerModal = true;
            }
            else {
                this.addSignerModal = false;
                this.changeOperatorModal = false;
                this.addOperatorModal = false;
                this.isChangeOperator = false;
                this.isChangeSigner= false;
            }
        },

    /* 筛选 把选中的隐藏掉  */
        filtrate(item) {
            this.changeOperatorList = this.signerList.filter(sealer => sealer.active === false);
        },

    //信息初始化-------getconfirmInfo公司认证-------//
        async initCurrent() {
            let { data } = await api.getconfirmInfo();
            if (data.err_code === 0 && data.data) {
        // 已认证
                this.attestation();
                if (this.pageType === 1) {
                    this.formData = data.data;
                    this.formData.signer_headimage =
            this.formData.signer_headimage ||
            require("../../../assets/images/leader.png");
                }
            }
        },
    // 签章人列表getSignerList
        async initsealer() {
            let { data } = await api.getSignerList();
            this.signerList = data.data;
            this.active();
        },
    //选择经办人
        selectSigner(item, index, type) {
            console.log('bbbbbbbbbb');
      
            if (type == '_operator') {
        // 增加经办人
                if (!this.isChangeOperator) {
                    this.addOperatorList.map((items, i) => {
                      if (index === i) {
                        if (!items.active) {
                          this.$set(items, "active", true);
                      } else {
                          this.$set(items, "active", false);
                      }
                    } else if (this.pageType) {
                      this.$set(items, "active", false);
                  }
                  });
                    if (item.active) {
                      this.user_id.push(item.user_id);
                  } else {
                      this.user_id.map((data, index) => {
                        if (item.user_id === data) {
                          this.user_id.splice(index, 1);
                      }
                    });
                  }
                } 
                else {
          // 经办人更改
                    this.changeOperatorID = item.user_id;
                    this.sealerName(item);
                }
            }
            else if (type == '_signer') {
                if (!this.isChangeSigner) {
                    this.signer = item.user_id;
                    this.submit();
                }
                else {
                    this.signer = item.user_id;
                    this.submit();
                }
            }
        },
    // 
        sealerName(item) {
      // 签章人
            this.changeOperatorList.forEach((itemData, index) => {
                if (item.user_id === itemData.user_id) {
                    this.$set(itemData, "active", true);
                } else {
                    itemData.active = false;
                }
            });
        },
    // 筛选状态将状态为true的隐藏掉
        filterState(item) {
            this.changeOperatorList = this.signerList.filter(sealer => sealer.active === false);
        },

    // sealerNameList是签章人列表       operatorList是经办人列表
        active() {
            if (this.signerList) {
                this.signerList.map(items => {
                    this.$set(items, "active", false);
                });
                this.signerList.map((items, index) => {
                    if (this.pageType) {
                      if (this.formData.signer === items.user_id) {
                        this.$set(items, "active", true);
                    }
                  } else {
                      this.operatorList.map((item, idx) => {
                        if (items.user_id === item.operator_id) {
                          this.$set(items, "active", true);
                      }
                    });
                  }
                });
            }
        },

    // 添加签章人1getTsignSigner    经办人0
        async submit() {
            if (this.pageType === 1) {
                let { data } = await api.getTsignSigner({
                    signer: this.signer
                });
                if (data.err_code === 0) {
                    this.$Message.success(data.err_message);
                    this.initCurrent();
                    this.initsealer();
                    this.addSignerModal=false;
                } else {
                    this.$Message.error(data.err_message);
                }
            } else {
                this.addOperator();
            }
        },
        changeOperator() {
            if (this.changeUserId) {
                this.delOperator(this.changeUserId);
                this.changeAddOperator();
            }
        },

        attestation() {
      // this.isAttestation = true
        },

    // --------------------------------------    经办人api    -------------------------------------- //
        async changeAddOperator() {
            let { data } = await api.setOperator({ operator: this.changeOperatorID });
            if (data.err_code === 0) {
                this.getOperatorList();
            }
        },
    // 选择后的经办人列表getOperatorList
        async getOperatorList() {
            let { data } = await api.getOperatorList();
            if (data.err_code === 0 && data.data) {
                this.operatorList = data.data;
            }
        },
    // 设置增加经办人setOperator
        async addOperator() {
            let isAdd = false;
            if (this.user_id) {
                this.user_id.map(async (item, index) => {
                    let { data } = await api.setOperator({ operator: item });
                    if (data.err_code === 0 && index === this.user_id.length - 1) {
                      isAdd = true;
                  }
                    if (isAdd) {
                      this.getOperatorList();
                  }
                });
            }
        },
    //删除经办人delOperator
        async delOperator(item) {
            let { data } = await api.delOperator({
                operator: item.operator_id || item
            });
            if (data.err_code === 0) {
                this.getOperatorList();
                this.$Message.success(data.err_message);
            } else {
                this.$Message.error(data.err_message);
            }
        }
    }
};
</script>

<style lang="less" scoped>
.certificationSealerContainer {
  padding: 30px;
  display: flex;
  background: #fff;
  .agentContainerList,
  .operatorList {
    flex: 1;
    margin-right: 30px;
    border: 1px solid @baseboard;
    border-radius: 4px;
    .signTextContainer {
      position: relative;
      height: 55px;
      padding-right: 30px;
      text-align: right;
      line-height: 55px;
      overflow: hidden;
      .signText {
        position: absolute;
        top: 6px;
        left: -30px;
        width: 100px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        transform: rotate(-45deg);
        color: #fff;
        background: @base;
      }
      span {
        color: @base;
        cursor: pointer;
      }
    }
  }
  .agentContainerList {
    position: relative;
    margin-top: 30px;
    height: 220px;
    .editButton {
      position: absolute;
      top: 0;
      right: 0;
      .icon {
        padding: 5px;
        margin: 10px 5px 0 0;
        color: #bebebe;
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
  .editButton {
    .icon {
      font-size: 40px;
    }
  }
}
.agentContainerList,
.operatorList {
  flex: 1;
  margin-right: 30px;
  border: 1px solid @baseboard;
  border-radius: 4px;
  .signTextContainer {
    position: relative;
    height: 55px;
    padding-right: 30px;
    text-align: right;
    line-height: 55px;
    overflow: hidden;
    .signText {
      position: absolute;
      top: 6px;
      left: -30px;
      width: 100px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      transform: rotate(-45deg);
      color: #fff;
      background: @base;
    }
    span {
      color: @base;
      cursor: pointer;
    }
  }
}
.agentContainerList {
  position: relative;
  margin-top: 30px;
  .editButton {
    position: absolute;
    top: 0;
    right: 0;
    .icon {
      padding: 5px;
      margin: 10px 5px 0 0;
      color: #bebebe;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
.operatorInfo {
  display: flex;
  height: 89%;
  .operatorExhibition {
    width: 240px;
    text-align: center;
    font-size: 13px;
    height: 140px;
    border-right: 1px dashed #e0e0e0;
    margin-bottom:20px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-bottom: 15px;
    }
    span {
      color: @base;
    }
      .button{
          padding: 5px 8px;
          border: 1px solid @baseboard;
          border-radius: 4px;
          font-size: 12px;
          color: #8c8c8c;
          cursor: pointer;
      }
      .changeButton {
        .button;
          &:hover{
              color: @base;
          }
      }
      .delButton{
          .button;
          &:hover{
              color: @red;
          }
      }

  }

  .agentInfoList,
  .operatorInfoList {
    width: 100%;
    li {
      display: flex;
      justify-content: space-between;
      .green {
        color: #62d8c5;
      }
    }
  }
  .operatorInfoList {
    li {
      display: inline;
    }
  }
  .agentInfoList {
    display: flex;
    flex-direction: column;
    li:nth-of-type(3) {
      font-size: 13px;
    }
    li:nth-of-type(4) {
      font-size: 14px;
    }
    li {
      padding: 0px 235px 20px 40px;
      text-align: left;
      p {
        font-size: 13px;
        text-align: right;
        display: inline;
        margin: 0px 10px;
      }
    }
  }
}
.promptContainer {
  max-width: 400px;
  min-width: 200px;
  max-height: 500px;
  background: #fefaf2;
  color: #777777;
  .title {
    height: 50px;
    padding-left: 32px;
    line-height: 50px;
    font-size: 16px;
    border-bottom: 1px solid #fdeabf;
  }
  .promptList {
    padding: 30px 39px 30px 30px;
    li {
      padding-bottom: 30px;
      font-size: 14px;
    }
  }
}
.agentContainer {
  flex: 1;
  .title {
    font-size: 14px;
    text-align: right;
    margin-right: 30px;
  }
}
</style>
<style lang="less">
.addOperatorModal {
  .ivu-modal-close {
    padding-right: 10px;
  }
  .ivu-modal-header {
    padding: 30px;
  }
  .ivu-modal-footer {
    padding: 30px;
    border-top: 1px solid transparent;
  }
  .ivu-modal-body {
    padding: 30px 30px 0px 30px;
  }
  .signTextContainerList {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .title {
      width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .activeButton {
      display: flex;
      border: 1px solid @base !important;
    }
    .green {
      color: @base !important;
    }
    li {
      display: flex;
      justify-content: space-between;
      min-width: 130px;
      max-width: 130px;
      height: 40px;
      padding: 5px 7px;
      margin-right: 6.6px;
      margin-bottom: 20px;
      line-height: 30px;
      border: 1px solid @baseboard;
      border-radius: 4px;
      cursor: pointer;
      .headImage {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      span,
      .headImage {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .icon {
        margin-top: 7px;
      }
    }
    li:nth-of-type(4n) {
      margin-right: 0 !important;
    }
  }
}
</style>


