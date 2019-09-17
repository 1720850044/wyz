<template>
    <div class="contractBox">
        <menu-list @selectMenu="selectMenu"></menu-list>
        <contractBody :creentMenu="creentMenu"></contractBody>
        <!--<Modal title="确认保存？" width="300px">-->
            <!--<div class="leaveBox">-->
                <!--<div class="contentTips">-->
                    <!--<p>离开页面,数据将会丢失！</p>-->
                    <!--<p>是否保存数据？</p>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div slot="footer" class="footerBtns">-->
                <!--<button>取消</button>-->
                <!--<button>保存</button>-->
            <!--</div>-->
        <!--</Modal>-->
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import {newContractApi} from "api";
    import menuList from './components/menuList';
    import contractBody from './components/contractBody';

    export default {
        name: "index",
        components: {
            menuList,
            contractBody
        },
        computed: {
            contractInfo(){
                return this.$store.state.contract.contractData;
            }
        },
        data() {
            return {
                creentMenu: null,
                ID: this.$route.query.ID
            };
        },
        methods: {
            selectMenu(creentMenu) {
                this.creentMenu = creentMenu;
            },
            init() {
                this.$store.commit('cleanContractInfo');
                this.$nextTick(async()=>{
                    let companyType = JSON.parse(Cookies.get('company'));
                    if (companyType.type) {
                        alert('jiafang');
                    } else {
                        let data = await newContractApi.yiInitApi();
                        if (data.err_code == 0) {
                            let ID = this.ID || this.contractInfo.ID;
                            if (ID) {
                                let IDBOJ = {
                                    type: 'ID',
                                    data: ID
                                };
                                this.$store.commit('setContractData', IDBOJ);
                                this.$nextTick(() => {
                                    this.$store.dispatch("getContractInfo");
                                });
                            }
                        }
                    }
                })
            }
        },
        mounted() {
            this.init();
        }
    };
</script>

<style lang="less" scoped>
    .contractBox {
        width: 100%;
        height: 100%;
    }
    .leaveBox{
        .contentTips{
            padding: 15px 0;
            font-size: 14px;
            color: #777;
        }
    }
    .footerBtns{
        button{
            width: 90px;
            height: 35px;
            line-height: 35px;
            background: #3cd2b4;
            color: #ffffff;
            border-radius: 4px;
            border: none;
            outline: none;
            &:hover{
                cursor: pointer;
                background: @base_dark;
            }
        }
    }
</style>
