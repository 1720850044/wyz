<template>
    <div class="tabs-nav-container">
        <ul class="tabs-nav" :style="styleTab" v-if="tabList.length>1">
            <li v-for="(item,index) in tabList" :class="{'checked':index == tabIndex}"
                @click="changeNav(item,index)" :key="index">
                {{item.tab}}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'navTav',
        props: {
            tabList: {
                type: Array,
                default: [],
            }
        },
        created() {
        },
        mounted() {
        },
        data() {
            return {
                tabIndex: 0,
            };
        },
        methods: {
            changeNav(item, index) {
                this.tabIndex = index;
                this.$emit('changeNav', {index});
            },
        },
        computed: {
            styleTab() {
                return {width: this.tabList.length * 90+'px'};
            }
        },
        components: {}
    };
</script>

<style lang="less" scoped>
    .tabs-nav-container {
        .tabs-nav {
            display: flex;
            margin-bottom: 5px;
            border-right: 6px;
            background: #e6e9ea;
            li {
                min-width: 86px;
                height: 32px;
                margin: 2px;
                line-height: 32px;
                text-align: center;
                color: @black_3;
            }
        }
        .checked {
            color: @base !important;
            background: @white !important;
            border-right: 6px;
        }
    }
</style>
