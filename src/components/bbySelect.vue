<template>
    <div class="bbySelect" v-click-outside.capture="onClickOutside" >
        <Input v-if="isMultiple && !Array.isArray(vModel)" class="standardInput" v-model="vModel" readonly :placeholder="placeholder" @click.native="selectUnfold"    type="text"></Input>
        <template v-else>
            <p  v-if="vModel && vModel.length<=0" class="inputBox"  @click="selectUnfold">{{placeholder}}</p>
            <div v-else class="multipleBox" @click="selectUnfold">
                <div class="multiple" v-for="(item,index) in vModel" :key="index">
                    {{item.tasktype_name}}
                </div>
            </div>
        </template>
        <!-- input 三角-->
        <div class="triangleIcon"  >
            <Icon  :class="[{'arrowTop':selectShow},{'arrowDown':!selectShow}]" type="arrow-down-b" size="14"></Icon>
        </div>

        <!--tab切换-->
        <div v-if="selectTab && selectTab.length>0"  @click.stop class="standardSelectTab" v-show="selectShow" >
            <p v-for="(item,index) in selectTab" @click="changeSelectTab(index,$event)" :key="index"
               class="selectTabs" :class="{'selectTabsAction':selectIndex === index}">{{item}}</p>
        </div>

        <!--列表-->
        <ul class="standardSelectUl" :class="{'tabNone':!isTab}" @click.stop v-show="selectShow"  >
            <div v-show="selectIndex === 0">
                <slot name="select1"></slot>
            </div>
            <div class="treeSelectBox" :class="{'tabNoneTree':!isTab}" v-show="selectIndex === 1">
                <slot name="select2"></slot>
            </div>
        </ul>
    </div>
</template>

<script>
    import {directive as clickOutside} from 'v-click-outside-x';
    export default {
        name: "bbySelect",
        directives: { clickOutside },
        props: {
            placeholder: {
                type: String,
                default: ''
            },
            multiple: {
                type: Boolean,
                default: false
            },
            vModel: {
            },
            selectTab: {
                type: Array,
                default: () => []
            },
            disabledFlag: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                InputVal: this.vModel?'7777':'',
                selectIndex: 0,
                selectShow: false,
            };
        },
        mounted() {

        },
        methods: {
            onClickOutside(){
                this.selectShow = false;
            },
            selectUnfold(e) {
                // let fn = (e) => {
                //     console.log(999)
                //         if(e.target.getAttribute('class') == "standardSelectTab" || e.target.getAttribute('class') == "changeSelectTab"){
                //             e.preventDefault()
                //             document.removeEventListener("mousedown", fn, false);
                //         }
                // }
                //
                // document.addEventListener("mousedown", fn, false);
                this.selectShow = true;
                // document.body.onclick = ((e) => {
                //     // if(e.target.getAttribute('class') == "standardSelectTab" || e.target.getAttribute('class') == "changeSelectTab"){
                //     //     e.preventDefault()
                //     //     document.removeEventListener("mousedown", fn, false);
                //     // }
                //     this.selectShow = false
                //     document.body.onclick = null
                // })
            },
            changeSelectTab(index, e) {

                this.selectIndex = index;
            },
            blurCallback(){

                // this.$emit('blur')
            },
            closeSelect(){
                this.selectShow = false;

                // if(this.selectShow){
                //     this.selectShow = false
                // }else{
                //     this.selectShow = true
                // }
            },

        },
        computed: {
            isTab(){
                return this.selectTab && this.selectTab.length>0;
            },
            isMultiple(){
                if (this.multiple && Array.isArray(this.vModel) && this.vModel.length>0){
                    return false;
                } else {
                    return true;
                }
            }
        },
    };
</script>

<style lang="less" scoped>
    .bbySelect {
        position: relative;
        width: 100%;
        .inputBox{
            width: 100%;
            height: 40px;
            padding: 9px 30px 9px 10px;
            line-height: 22px;
            color: #ccc;
            font-size: 14px;
            border: 1px solid #dfdfdf;
            border-radius: 4px;
        }
        .multipleBox{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            min-height: 40px;
            padding: 0 24px 0 4px;
            border: 1px solid #dddee1;
            border-radius: 4px;
            .multiple{
                height: 30px;
                padding: 0 8px;
                margin: 3px 4px 3px 0;
                text-align: center;
                line-height: 30px;
                color: @base;
                border-radius: 2px;
                background: #e2faf6;
            }
        }
        /*.standardInput {*/
            /*width: 100%;*/
            /*height: 40px;*/
            /*color: #495060;*/
            /*border: 1px solid #dddee1;*/
            /*line-height: 40px;*/
            /*padding: 0 8px 0 10px;*/
            /*border-radius: 4px;*/
        /*}*/
        /*.standardInput:disabled{*/
            /*background: #f1f1f1 !important;*/
            /*color: #ccc!important;*/
            /*cursor: not-allowed;*/
        /*}*/
        /*.standardInput::placeholder {*/
            /*color: #c3cbd6;*/
        /*}*/
        /*.standardInput {*/
            /*&::-moz-placeholder{*/
                /*color: red;*/
            /*}*/
        /*}*/

        .triangleIcon {
            position: absolute;
            top: 50%;
            right: 8px;
            transform: translateY(-50%);
            color: #80848f;
            z-index: 5;
            .ivu-icon{
                transition: all .3s;
            }
            .arrowDown{
                transform: rotate(0deg) ;
            }
            .arrowTop{
                transform: rotate(180deg) ;
            }
        }

        .standardSelectTab {
            display: flex;
            position: absolute;
            bottom: -42px;
            left: -1px;
            width: 101%;
            height: 40px;
            padding-left: 10px;
            line-height: 40px;
            border: 1px solid #dddee1;
            background: @white;
            z-index: 6;

            .selectTabs {
                margin-right: 15px;
                color: @black_2;
            }

            .selectTabsAction {
                color: @base;
            }
        }

        .standardSelectUl {
            position: absolute;
            bottom: -242px;
            left: 0px;
            z-index: 6;
            width: 100%;
            height: 200px;
            padding: 10px 0;
            overflow-y: auto;
            color: @black_2;
            /*border: 1px solid #dddee1;*/
            background: @white;
            border-radius: 0 0 4px 4px;
            box-shadow: 0 1px 6px rgba(0,0,0,.2);
            .ivu-icon {
                margin-right: 10px;
            }

        }
        .tabNone{
            bottom: 45px !important;
        }
    }
</style>

