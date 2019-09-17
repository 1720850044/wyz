<template>
    <div class="MenuBox">
        <p class="menuTitle">
            <i class="iconfonts icon-renwu1"></i>
            <span>合同详情</span>
        </p>
        <ul class="MenuUl">
            <li v-for="(item,index) in menuList" :class="{'activeSty':item.selectFlag}">
                <div class="child" @click="selectTab(item,index)">
                    <span>{{item.tab}}</span>
                    <span class="status" :class="[{'Imperfect':item.status == -1},{'Perfect':item.status == 0},{'NOconfirmed':item.status ==1},{'confirmed':item.status == 2}]">{{item.status | coverStatus}}</span>
                    <span class="moreIco" v-if="index == 2"><i class="iconfonts icon-fangxiangxia" :class="{'rotateSty':slideFlag}"></i></span>
                </div>
                <div class="childList" v-if="index == 2" @click="stopEvent($event)" :style="{ height : slideFlag ? (item.list.length + !companyType) * 45 + 'px' : 0 }">
                    <p @click="selectOrder(list,index)" :class="{'activeSty':list.selectFlag}" v-for="(list,index) in item.list">
                        <span>{{list.group_name}}</span>
                        <span class="childStatus" :class="[{'Perfect':item.status == 0},{'NOconfirmed':item.status ==1},{'confirmed':item.status == 2}]">{{list.status | coverStatus}}</span>
                    </p>
                    <p class="addList" v-if="companyType == 0">
                        <Button @click="addList" style="height: 35px;line-height: 35px;width: 100px" type="primary" icon="android-add">添加清单</Button>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: "menu-list",
        computed: {
            menuList(){
                return this.$store.state.contract.contractData.menuList;
            }
        },
        data(){
            return {
                companyType: Cookies.get('company') ? JSON.parse(Cookies.get('company')).type : null,
                slideFlag: false,
                output: {
                    parent: null,
                    creent: null
                }
            };
        },
        methods: {
            selectTab(item, index){
                if (item.name == 'three'){
                    this.output = {
                        parent: item.name,
                        creent: null
                    };
                    this.slideFlag = !this.slideFlag;
                } else {
                    this.slideFlag = false;
                    this.output = {
                        parent: null,
                        creent: item.name
                    };
                }
                this.$store.commit('setMenuChildActice', 999);
                this.$store.commit('setMenuActive', index);
                this.$emit('selectMenu', this.output);
            },
            stopEvent(e){
                e.stopPropagation();
            },
            selectOrder(item, index){
                this.output.creent = index;
                this.$store.commit('setMenuChildActice', index);
                this.$emit('selectMenu', this.output);
            },
            addList(){
                this.$store.commit('setMenuChildActice', 999);
                this.output.creent = 'addBtn';
                this.$emit('selectMenu', this.output);
            }
        },
        mounted(){
            let _this = this;
            this.$bus.on('submitPrice', function () {
                let len = _this.menuList[2].list.length;
                let index = len - 1;
                let item = _this.menuList[2].list[index];
                _this.$nextTick(()=>{
                    _this.selectOrder(item, index);
                });
            });
            this.$bus.on('addList', function () {
                _this.addList();
            });
        },
        filters: {
            coverStatus(status){
                let strStatus = null;
                switch (status){
                    case -1 : strStatus = '未完善';
                        break;
                    case 0 : strStatus = '已完善';
                        break;
                    case 1 : strStatus = '待确认';
                        break;
                    case 2 : strStatus = '已确认';
                        break;
                }
                return strStatus;
            }
        }
    };
</script>
<style lang="less" scoped>
    .MenuBox{
        width: 360px;
        float: left;
        border-radius: 3px;
        background: #ffffff;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
        .menuTitle{
            text-align: center;
            padding: 16px 0;
            border-bottom: 1px solid #f1f1f1;
            i{font-size: 15px}
            span{font-size: 14px}
        }
        .MenuUl{
            width: 100%;
            padding: 16px 20px;
            li{
                padding: 0 24px;
                /*line-height: 45px;*/
                font-size: 14px;
                &.activeSty{
                    background: @base;
                    color: @white;
                    span{
                        color: @white !important;
                    }
                }
                span{

                    /*display: flex;*/
                    /*flex: 1;*/
                    /*justify-content: space-between;*/
                    /*align-items: center;*/
                    &.activeColor{
                        color: @base !important;
                    }
                    &:hover{
                        cursor: pointer;
                        color: @base;
                    }

                    i{
                        transition: all .5s;
                        transform: rotate(0deg);
                        &.rotateSty{
                            transform: rotate(180deg);
                        }
                    }
                }
                .status{
                    position: absolute;
                    right: 80px;
                    &.Imperfect{
                        color: #ff9283;
                    }
                    &.Perfect{
                        color: @base;
                    }
                    &.NOconfirmed{
                        color: #ff9283;
                    }
                    &.confirmed{
                        color: @base;
                    }

                }
                .moreIco{
                    position: absolute;
                    right: 0;
                }
                .child{
                    display: flex;
                    line-height: 45px;
                    height: 45px;
                    position: relative;
                }
                .childList{
                    height: 0;
                    overflow: hidden;
                    transition: all .5s;
                    p{
                        position: relative;
                        height: 45px;
                        line-height: 45px;
                        padding: 0 20px;
                        .childStatus{
                            position: absolute;
                            right: 80px;
                            &.Perfect{
                                color: @base;
                            }
                            &.NOconfirmed{
                                color: #ff9283;
                            }
                            &.confirmed{
                                color: @base;
                            }
                        }
                        &:hover{
                            cursor: pointer;
                            color: @base;
                        }
                        &.activeSty{
                            background: @base;
                            color: @white;
                        }
                        &.addList{
                            span{

                            }
                        }
                    }
                }

            }
        }
    }
</style>
