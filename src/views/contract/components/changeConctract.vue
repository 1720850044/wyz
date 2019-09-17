<template>
    <ul class="twoDimensionalUl">
        <li v-for="(item,index) in uploadList">
            <div class="slideDown">
                <p class="lable" :class="{'discard':!item.status,'use':item.status}" @click="slideFun(index)">
                    <span>合同 ({{item.status | statusType}})</span>
                    <i class="iconfonts icon-fangxiangshang" :class="{'rotateUp':item.slideFlag,'rotateDown':!item.slideFlag}"></i>
                </p>
                <dl v-if="item.slideFlag">
                    <dd v-for="(img,index) in item.list" :class="{'selectSty':selectUrlIndex == index}" @click="selectUrl(img.file_url,index)">
                        <img :src="img.file_url"/>
                    </dd>
                </dl>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "change-conctract",
        props: {
            uploadList: {
                type: Array,
                default: ()=>[]
            }
        },
        data(){
            return {
                selectUrlIndex: 0
            };
        },
        methods: {
            slideFun(index1){
                this.uploadList.forEach(function (creent, index) {
                    if (index != index1){
                        creent.slideFlag = false;
                    } else {
                        creent.slideFlag = !creent.slideFlag;
                    }
                });
            },
            selectUrl(url, index){
                this.selectUrlIndex = index;
                this.$emit('returnUrl', url);
            }
        },
        filters: {
            statusType(val){
                return val ? '使用中' : '弃用';
            }
        }
    };
</script>
<style lang="less" scoped>
    .twoDimensionalUl{
        width: 100%;
        li{
            margin-top: 20px;
            .slideDown{
                .lable{
                    color: @white;
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 30px;
                    border-radius: 3px;
                    &:hover{
                        cursor: pointer;
                    }
                    &.discard{
                        background: #ff898e;
                        &:hover{
                            background: #df7075;
                        }
                    }
                    &.use{
                        background: @base;
                        &:hover{
                            background: @base_dark;
                        }
                    }

                    .rotateUp{
                        transform: rotate(180deg);
                        transition: all .5s;
                    }
                    .rotateDown{
                        transform: rotate(0deg);
                        transition: all .5s;
                    }
                }
                dl{
                    overflow: hidden;
                    transition: height .3s;
                    dd{
                        margin-top: 5px;
                        border-radius: 3px;
                        &.selectSty{
                            border: 2px solid @base_active;
                        }
                        img{
                            width: 100%;
                            max-height: 135px;
                            display: block;
                            &:hover{
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
