<template>
    <ul class="foreach-tree">
        <li class="first-level">
            <p class="level-item" v-if="data.children && data.children.length > 0" @click.stop="collapseLevel(data)">
                <Icon :type="data.expand ? 'arrow-down-b' : 'arrow-right-b'"></Icon>
                <span class="first-level-name">{{data.title}}</span>
            </p>
            <div class="sub-level-item" :class="{'item-selected': data.selected}" v-else @click.stop="selectDepartmentMember(data)">
                <label class="head-img">
                    <img :src="data.url" />
                </label>
                <span class="third-level-name">{{data.title}}</span>
                <Icon type="ios-checkmark-empty" v-if="data.selected"></Icon>
            </div>
            <tree-item v-if="data.expand" v-for="(item, index) in data.children" :key="index" :data="item" @selectDepartmentMember="selectDepartmentMember" :multiple="multiple"></tree-item>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "treeItem",
        props: {
            data: {
                type: Object,
                default () {
                    return {};
                }
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {

            };
        },
        mounted () {
            // this.init();
        },
        methods: {
            init () {
                console.log(this.multiple);
            },
            collapseLevel (item) {
                item.expand = !item.expand;
            },
            selectDepartmentMember (item) {
                // if (this.multiple) {
                //     item.selected = !item.selected;
                // } else {
                //     this.$set(item, 'selected', true);
                //     // item.selected = true;
                // }
                this.$emit('selectDepartmentMember', item);
            }
        }
    };
</script>

<style lang="less" scoped>
    .foreach-tree {
        width: 100%;
        margin-bottom: 5px;
        li {
            line-height: 30px;
            li {
                padding: 0 20px;
            }
            .sub-level-item {
                position: relative;
                padding: 2px 5px;
                cursor: pointer;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                &.item-selected {
                    background: rgba(60, 210, 180, 0.35);
                }
                > label {
                    display: block;
                    float: left;
                    width: 28px;
                    height: 28px;
                    border: 1px solid #efefef;
                    margin: 0 8px 0 0;
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    border-radius: 50%;
                    overflow: hidden;
                    > img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                }
                i {
                    position: absolute;
                    color: @base;
                    font-size: 34px;
                    top: 0;
                    right: 10px;
                }
            }
        }
    }
</style>
