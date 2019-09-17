
<template>
    <div class="perfect-formation-father">
        <div class="perfectFormationContentDiv">
            <div class="perfectFormationHeader">
                <!-- 目前只开放公司的注册及建立内部帐号，个人艺术家暂时不开放，所以相关功能需要暂时隐藏 2019.03.05-->
                <!-- <i class="iconfonts icon-bottommore" @click="backFlag" v-if="PopFlag.twoPop.showFlag && !closeFlag || PopFlag.ThreePop && !closeFlag"></i> -->
                <span>{{PopFlag.headerTitle}}</span>
                <!-- <template v-if="!statusThreeFlag">
                    <i class="iconfonts icon-cuowu" @click="closeFlagFun" v-if="closeFlag"></i>
                </template> -->
            </div>
            <div class="perfectFormationContent">
                <!-- 目前只开放公司的注册及建立内部帐号，个人艺术家暂时不开放，所以相关功能需要暂时隐藏 2019.03.05 -->
                <!-- <div class="firstSetp" v-if="PopFlag.firstPop">
                    <div class="firstSetpflex">
                        <div>
                            <button @click="selectFun(0)">创建新公司</button>
                            <img src="../../assets/images/perfectformation2.png"/>
                            <span>创建公司后您将成为管理员</span>
                        </div>
                        <div>
                            <button @click="selectFun(1)">加入公司</button>
                            <img src="../../assets/images/perfectformation1.png"/>
                            <span>加入平台已注册的公司</span>
                        </div>
                    </div>
                    <span class="breakBtn" @click="selectFun(2)">跳过</span>
                </div> -->
                <!-- v-if="PopFlag.twoPop.showFlag" -->
                <div class="twoSetp" >
                    <!-- v-if="PopFlag.twoPop.createConpanyFlag" -->
                    <div class="createCompany">
                        <dl>
                            <dt>公司类型</dt>
                            <dd>
                                <div class="joinType" @click="createCompany.companyType = 1" :class="[{'selectedSty':createCompany.companyType == 1},{'green':createCompany.companyType == 1}]">
                                    <p>研发公司</p>
                                    <span>游戏研发运营，游戏制作开发</span>
                                </div>
                                <div class="joinType" @click="createCompany.companyType = 0" :class="[{'selectedSty':createCompany.companyType == 0},{'blue':createCompany.companyType == 0}]">
                                    <p>外包公司</p>
                                    <span>承接外发的数字艺术项目</span>
                                </div>
                            </dd>
                            <dt>公司名称</dt>
                            <dd>
                                <input v-model="createCompany.companyName" type="text" placeholder="输入公司名称 （必填）"/>
                            </dd>
                            <dt>联系人</dt>
                            <dd>
                                <input v-model="createCompany.companyPersion" type="text" placeholder="输入联系人 （必填）"/>
                            </dd>
                            <dt>联系手机</dt>
                            <dd>
                                <input v-model="createCompany.companyTel" type="tel" placeholder="输入联系手机 （必填）"/>
                            </dd>
                        </dl>
                        <button @click="saveData('createCompany')">保存</button>
                    </div>
                    <!-- 目前只开放公司的注册及建立内部帐号，个人艺术家暂时不开放，所以相关功能需要暂时隐藏 2019.03.05 -->
                    <!-- <div class="joinCompany" v-if="PopFlag.twoPop.joinConpanyFlag">
                        <dl>
                            <dt>团队公司名称</dt>
                            <dd>
                                <input v-model="joinCompany.companyName" type="text" placeholder="输入加入团队公司名称 （必填）" @keyup="serchCompany(joinCompany.companyName)"/>
                                <i class="iconfonts icon-findmore"></i>
                                <ul v-if="companyData.companyFlag" class="companylist">
                                    <li v-for="item in companyData.companyList" @click="selectedCompanyFun(item)">{{item.company}}</li>
                                </ul>
                            </dd>
                            <dt>真实姓名</dt>
                            <dd>
                                <input v-model="joinCompany.realName" :disabled="joinCompany.disable" type="text" placeholder="输入您的姓名、方便团队沟通 （必填）"/>
                            </dd>
                        </dl>
                        <button @click="saveData('joinCompany')">保存</button>
                    </div> -->
                </div>
                <!-- 目前只开放公司的注册及建立内部帐号，个人艺术家暂时不开放，所以相关功能需要暂时隐藏 2019.03.05 -->
                <!-- <div class="ThreeSetp" v-if="PopFlag.ThreePop"> -->
                    <!-- <dl> -->
                        <!-- <dt>真实姓名</dt>
                        <dd>
                            <input v-model="breakJump.realName" type="text" placeholder="团队协作使用 （必填）"/>
                        </dd> -->
                        <!-- <dt>擅长</dt> -->
                        <!-- <dd> -->
                            <!-- <beGood @ReceiveData="ReceiveData"></beGood> -->
                            <!-- <choosebe-good @ReceiveData="ReceiveData"></choosebe-good> -->

                        <!-- </dd> -->
                    <!-- </dl> -->
                    <!-- <button @click="saveData('breakJump')">保存</button> -->
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex';
    import beGood from '../../components/beGood';
    import choosebeGood from "../../components/chooseBeGood";
    import api from 'api';
    export default {
        components: {beGood, choosebeGood},
        data(){
            return {
                PopFlag: {
                    firstPop: true,
                    twoPop: {
                        showFlag: false,
                        createConpanyFlag: false,
                        joinConpanyFlag: false
                    },
                    ThreePop: false,
                    headerTitle: '完善资料'
                },
                left: 0,
                companyData: {
                    companyFlag: false,
                    companyList: []
                },
                showListFlag: false,
                closeFlag: false,
                createCompany: {
                    companyType: 1,
                    companyName: null,
                    companyPersion: null,
                    companyTel: null
                },
                joinCompany: {
                    companyName: null,
                    realName: null,
                    companyId: null,
                    disable: false
                },
                breakJump: {
                    realName: null,
                    creentType: null
                },
                statusThreeFlag: false
            };
        },
        methods: {
            ...mapMutations(['setIsproject', 'setPerfectType']),
            selectFun(val, flag){
                this.closeFlag = flag||false;
                this.PopFlag.firstPop = false;
                if (val == 0){
                    this.PopFlag.ThreePop = false;
                    this.PopFlag.twoPop.showFlag = true;
                    this.PopFlag.twoPop.joinConpanyFlag = false;
                    this.PopFlag.twoPop.createConpanyFlag = true;
                    this.PopFlag.headerTitle = '创建新公司';
                } else if (val == 1){
                    if (localStorage.userMsg){
                        let locarealName = JSON.parse(localStorage.userMsg).realname;
                        if (locarealName){
                            this.joinCompany.realName = locarealName;
                            this.joinCompany.disable = true;
                        }
                    }
                    this.PopFlag.ThreePop = false;
                    this.PopFlag.twoPop.showFlag = true;
                    this.PopFlag.twoPop.createConpanyFlag = false;
                    this.PopFlag.twoPop.joinConpanyFlag = true;
                    this.PopFlag.headerTitle = '加入团队';
                } else if (val == 2){
                    // this.getBegoodAt();
                    this.PopFlag.twoPop.showFlag = false;
                    this.PopFlag.twoPop.joinConpanyFlag = false;
                    this.PopFlag.twoPop.createConpanyFlag = false;
                    this.PopFlag.ThreePop = true;
                    this.PopFlag.headerTitle = '完善个人信息';
                    localStorage.isjump = true;
                    this.$store.commit('setbreakJump', true);
                } else if (val == 3){
                    this.statusThreeFlag = true;
                    this.PopFlag.twoPop.showFlag = false;
                    this.PopFlag.twoPop.joinConpanyFlag = false;
                    this.PopFlag.twoPop.createConpanyFlag = false;
                    this.PopFlag.ThreePop = true;
                    this.PopFlag.headerTitle = '完善个人信息';
                    // this.getBegoodAt();
                }
            },
            backFlag(){
                this.PopFlag.firstPop = true;
                this.PopFlag.twoPop.showFlag = false;
                this.PopFlag.ThreePop = false;
                this.PopFlag.headerTitle = '完善资料';
                localStorage.isjump = false;
                this.$store.commit('setbreakJump', false);
            },
            moveFun(e){
                if (e.target.nodeName == 'UL'){
                    let startDisX = e.clientX;
                    let endDisX = 0;
                    let el = document.getElementById('typeBar');
                    let parentElW = document.getElementById('overFlowDiv').offsetWidth;
                    let li = el.getElementsByTagName('li');
                    let liNum = li.length;
                    let liW = li[0].clientWidth+30;
                    let ulW = (liNum * liW)-30;
                    let _this = this;
                    let lefts = this.left;

                    if (ulW > parentElW){
                        const fun = function (e) {
                            endDisX = e.clientX - startDisX + lefts > 0 ? 0 : e.clientX - startDisX + lefts < -(ulW-424) ? -(ulW-424) : e.clientX - startDisX + lefts;
                            _this.left = endDisX;
                            el.setAttribute('style', `width:${ulW}px;margin-left:${endDisX}px`);

                        };
                        const unFun = function () {
                            document.removeEventListener('mousemove', fun, false);
                            document.removeEventListener('mouseup', unFun, false);
                        };
                        document.addEventListener('mousemove', fun, false);
                        document.addEventListener('mouseup', unFun, false);
                    }
                } else {
                    return false;
                }
            },
            saveData(type){
                let _this = this;
                let exg = /^(([a-zA-Z+\.?\·?a-zA-Z+]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/;
                if (type == 'createCompany'){
                    let Data = this.createCompany;
                    if (!Data.companyName ||Data.companyName == null ||Data.companyName == ''||Data.companyName.length <= 0){
                        this.$Message.error('请输入公司名称！');
                    } else if (!Data.companyPersion ||Data.companyPersion == null ||Data.companyPersion == ''||Data.companyPersion.length <= 0){
                        this.$Message.error('请输入联系人！');
                    } else if (!exg.test(Data.companyPersion)){
                        this.$Message.error('联系人姓名格式错误！');
                    } else if (!Data.companyTel ||Data.companyTel == null ||Data.companyTel == ''||Data.companyTel.length <= 0){
                        this.$Message.error('请输入联系手机！');
                    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(Data.companyTel)) && !(/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(Data.companyTel))){
                        this.$Message.error('联系电话格式错误！');
                    } else {
                        let data = {
                            type: 'company',
                            company_type: Data.companyType,
                            company_name: Data.companyName,
                            name: Data.companyPersion,
                            tel: Data.companyTel,
                            field: null
                        };
                        let crateCompany = async function () {
                            let res = await api.crateCompanyFun(data);
                            if (res.data.err_code == 0){
                                _this.$Message.success(res.data.err_message);
                                // localStorage.isproject = `false`;
                                localStorage.isjump = false;
                                _this.$store.commit('setbreakJump', false);
                                // _this.setIsproject();
                                _this.$store.dispatch('getPermissions', {vm: _this});
                                _this.closeFlagFun();
                            } else {
                                _this.$Message.error(res.data.err_message);
                            }
                        };
                        crateCompany();
                    }
                } else if (type == 'joinCompany'){
                    let Data = this.joinCompany;
                    if (!Data.companyName ||Data.companyName == null ||Data.companyName == ''||Data.companyName.length <= 0){
                        this.$Message.error('请输入公司名称！');
                    } else {
                        if (!Data.companyId){
                            this.serchCompany(Data.companyName);
                        } else {
                            if (!Data.realName||Data.realName == null ||Data.realName == ''||Data.realName.length <= 0){
                                this.$Message.error('请输入真实姓名！');
                            } else if (!exg.test(Data.realName)){
                                this.$Message.error('真实姓名格式错误！');
                            } else {
                                let data = {
                                    company_id: Data.companyId,
                                    realname: Data.realName
                                };
                                let joinCompany = async function () {
                                    let res = await api.joinCompanyFun(data);
                                    if (res.data.err_code == 0){
                                        _this.$Message.success('等待公司审核！');
                                        // localStorage.isproject = `false`;
                                        localStorage.isjump = false;
                                        _this.$store.commit('setbreakJump', false);
                                        // _this.setIsproject();
                                        _this.$store.dispatch('createNav', );
                                        _this.closeFlagFun();
                                    }
                                };
                                joinCompany();
                            }
                        }
                    }
                } else if (type == 'breakJump'){
                    let Data = this.breakJump;
                    if (!Data.realName ||Data.realName == null ||Data.realName == ''||Data.realName.length <= 0){
                        this.$Message.error('请输入真实姓名！');
                    } else if (!exg.test(Data.realName)){
                        this.$Message.error('联系人姓名格式错误！');
                    } else if (!Data.creentType ||Data.creentType == null ||Data.creentType == ''||Data.creentType.length <= 0){
                        this.$Message.error('请选择擅长领域！');
                    } else {
                        let data = {
                            type: 'personal',
                            name: Data.realName,
                            field: Data.creentType
                        };
                        let breakJump = async function () {
                            let res = await api.crateCompanyFun(data);
                            if (res.data.err_code == 0){
                                _this.$Message.success(res.data.err_message);
                                _this.closeFlagFun();
                                // localStorage.isproject = `false`;
                                // _this.setIsproject();
                                _this.$store.dispatch('createNav');
                            } else {
                                _this.$Message.error(res.data.err_message);
                            }
                        };
                        breakJump();
                    }
                }
            },
            async serchCompany(val){
                let res = await api.joinSerchCompany({company_name: val});
                if (res.data.err_code == 0){
                    this.companyData.companyList = res.data.data||[];
                    if (res.data.data.length > 0){
                        this.companyData.companyFlag = true;
                    } else {
                        this.companyData.companyFlag = true;
                        this.companyData.companyList = [];
                        this.companyData.companyList.push({company: '暂无此公司'});
                    }
                }
            },
            selectedCompanyFun(item){
                this.companyData.companyFlag=false;
                if (item.id != 'noCompany'){
                    this.joinCompany.companyId=item.id;
                    this.joinCompany.companyName=item.company;
                } else {
                    this.joinCompany.companyName = null;
                }
            },
            closeFlagFun(){
                this.$emit('coloseFlag');
                localStorage.isproject = `false`;
                this.setIsproject();
            },
            ReceiveData(data){
                console.log('擅长', data);
                this.breakJump.creentType = data.id;
                // this.breakJump.creentType = data.childID
            },
        },
    };
</script>
<style lang="less" scoped>
    .perfect-formation-father {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, .3);
        z-index: 999;
        .perfectFormationContentDiv {
            position: absolute;
            width: 514px;
            left: 0;
            top: 15%;
            right: 0;
            margin: auto;
            background: #fdfdfd;
            z-index: 999;
            border-radius: 3px;
            // overflow: hidden;
            .perfectFormationHeader {
                position: relative;
                padding: 0 15px;
                font-size: 18px;
                color: @white;
                height: 60px !important;
                line-height: 60px;
                background: url("../../assets/images/headBarBGimg.png") no-repeat;
                background-size: 100% 100%;
                border-top-left-radius: 3px;
                border-top-right-radius: 3px;
                overflow: hidden;
                .icon-bottommore{
                    display: inline-block;
                    transform:rotate(90deg);
                    position: absolute;
                    z-index: 1;
                    top: 20px;
                    font-size: 20px;
                    cursor: pointer;
                }
                .icon-cuowu{
                    display: inline-block;
                    position: absolute;
                    z-index: 1;
                    top: 22px;
                    right: 15px;
                    font-size: 13px;
                    cursor: pointer;
                }
                span{
                    width: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    text-align: center;
                    z-index: 0;
                }
            }
            .perfectFormationContent {
                padding: 29px;
                .firstSetp{
                    height: 296px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-end;
                    .firstSetpflex{
                        height: 100%;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        div{
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: space-between;
                            height: 90%;
                            width: 50%;
                            &:nth-child(2){
                                border-left: 1px dashed #ccc;
                            }
                            button{
                                width: 90px;
                                border: 1px solid #e1e1e1;
                                background: @white;
                                padding: 4px 0;
                                border-radius: 3px;
                                outline: none;
                                color: #adabab;
                                cursor: pointer;
                                &:hover{
                                    background: @base!important;
                                    color: @white!important;
                                    border-color: @base!important;
                                }
                            }
                            img{
                                width: 50%;
                            }
                            span{
                                color: #adabab;
                            }
                        }
                    }
                    .breakBtn{
                        margin-right: 20px;
                        color: @base;
                        cursor: pointer;
                        &:hover{
                            color:@base_dark
                        }
                    }
                }
                .createCompany,.joinCompany,.ThreeSetp{
                    dl{
                        dt{
                            font-size: 15px;
                            color: #969595;
                        }
                        dd{
                            position: relative;
                            display: flex;
                            justify-content: space-between;
                            margin: 15px 0;
                            .green{
                                border: 2px solid @base_bor;
                            }
                            .blue{
                                border: 2px solid @blue;
                            }
                            .joinType{
                                width: 48%;
                                padding: 15px;
                                position: relative;
                                color: @white;
                                border-radius: 2px;
                                &.selectedSty{
                                    box-shadow: 5px 5px 10px -5px #7b6d6d !important;
                                }
                                &:hover{
                                    cursor: pointer;
                                    box-shadow: 5px 5px 10px -5px #7b6d6d;
                                }
                                &:before{
                                    content: '';
                                    opacity: .3;
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    background-position: bottom right !important;
                                    background-size: 30% !important;
                                }
                                &:nth-child(1){
                                    background: #3bceb6;
                                    &:before{
                                        background: url("../../assets/images/perfectformationWeite2.png") no-repeat;
                                    }
                                }
                                &:nth-child(2){
                                    background: #7cbefc;
                                    &:before{
                                        background: url("../../assets/images/perfectformationWeite1.png") no-repeat;
                                    }
                                }
                                p{font-size: 15px}
                                span{display: inline-block;margin-top: 5px}
                            }
                            input{
                                border: 1px solid #eae9e9;
                                width: 100%;
                                padding: 8px 5px;
                                border-radius: 3px;
                                outline: none;
                            }
                            input::-webkit-input-placeholder{
                                color: #ccc;
                            }
                            .icon-findmore{
                                position: absolute;
                                right: 12px;
                                top: 10px;
                                color: #ccc;
                                font-size: 18px;
                            }
                            .companylist{
                                max-height: 160px;
                                overflow: auto;
                                position: absolute;
                                left: 0;
                                background: @white;
                                width: 100%;
                                top: 35px;
                                border: 1px solid #eae9e9;
                                z-index: 2;
                                &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/border-radius: 3px;-webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);background: rgba(0, 0, 0, 0.2);}
                                &::-webkit-scrollbar-track { /*滚动条里面轨道*/-webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);border-radius: 0;background: rgba(0, 0, 0, 0.1);}
                                &::-webkit-scrollbar{
                                    width: 3px!important;
                                    background: #f5f5f5;
                                }
                                li{
                                    padding: 10px;
                                    border-bottom: 1px solid #eae9e9;
                                    &:hover{
                                        cursor: pointer;
                                        background: @base;
                                        color: @white;
                                    }
                                }
                            }
                        }
                    }
                    button{
                        width: 100%;
                        border: 0;
                        padding: 10px 0;
                        border-radius: 3px;
                        font-size: 14px;
                        color: #fff;
                        background: @base;
                        margin-top: 15px;
                        outline: none;
                        &:hover{
                            cursor: pointer;
                            background: @base_dark;
                        }
                    }
                }
                .ThreeSetp{
                    .Begood{
                        padding: 15px;
                        width: 100%;
                        border: 1px solid #eae9e9;
                        border-radius: 3px;
                        .overFlowDiv{
                            overflow: hidden;
                            border-bottom: 1px solid #eceaea;
                        }
                        .typeBar{
                            white-space: nowrap;
                            width: 100%;
                            display: flex;
                            height: 26px;
                            -webkit-user-select: none;
                            -moz-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            li{
                                /*display: inline-block;*/
                                float: left;
                                margin-right: 30px;
                                font-size: 13px;
                                color: #989797;
                                border-bottom: 2px solid rgba(255,255,255,0) !important;
                                padding-bottom: 5px;
                                &:hover{
                                    cursor: pointer;
                                    color: @base;
                                }
                                &.checked{
                                    color: @base!important;
                                    border-bottom: 2px solid @base !important;
                                }
                                &:last-child{
                                    margin-right: 0!important;
                                }
                            }
                        }
                        .typeSelect{
                            overflow: hidden;
                            li{
                                float: left;
                                border: 1px solid #ccc;
                                padding: 5px;
                                border-radius: 3px;
                                margin-right: 10px;
                                margin-top: 15px;
                                color: #989797;
                                cursor: pointer;
                                &:last-child{
                                    margin-right: 0!important;
                                }
                                &.checked{
                                    border: 1px solid @base!important;
                                    color: @base!important;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>

