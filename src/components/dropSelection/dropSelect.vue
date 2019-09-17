<template>
    <div class="drop-select-container"
         v-click-outside.capture="onClickOutside">
        <div class="selected-box" @click="dropDownContainer()">
            <span class="selected-item selected-item-holder" v-if="selectedItem && selectedItem.length <= 0">{{selectedHolder}}</span>
            <span class="selected-item" v-for="(item, index) in selectedItem" :key="index">{{item.title}}</span>
            <Icon :type="showDropContainer ? 'arrow-up-b' : 'arrow-down-b'"></Icon>
            <div class="drop-down-container" v-if="showDropContainer" @click.stop>
                <ul class="drop-tabs" >
                    <li v-for="(item, index) in dropTabs" :key="index" :class="{'tab-active': currentTab === index}" @click.stop="changeTab(item)">{{item.name}}</li>
                </ul>
                <div class="search-item">
                    <input type="text" :placeholder="$t('lang.lang_search') + $t('lang.lang_member')" v-model="searchKeyword.word" @keyup="onEnterSearch($event)" />
                    <Icon type="ios-search" @click.stop.native="onEnterSearch('click')"></Icon>
                </div>
                <div class="tree-list-container">
                    <div class="simple-list" v-if="currentTab === 0 || currentTab === 2">
                        <ul>
                            <li class="sort-items" :title="member.title" v-for="(member, index) in memberData" :key="index">
                                <h1 class="sort-title">{{member.title}}</h1>
                                <p class="member-name" v-for="(item, label) in member.children" :key="label" :class="{'member-selected': item.selected}" @click.stop="selectMember(item)">
                                    <label>
                                        <img :src="item.url" />
                                    </label>
                                    <span>{{item.title}}</span>
                                    <Icon type="ios-checkmark-empty" v-if="item.selected"></Icon>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div class="tree-list" v-if="currentTab === 1">
                        <tree-item v-if="isShowTree && departmentData && departmentData.length > 0" v-for="(item, index) in departmentData" :key="index" :data="item" :allData="departmentData" @selectDepartmentMember="selectDepartmentMember" :multiple="multiple"></tree-item>
                    </div>
                </div>
                <!-- Search member -->
                <div class="search-result" v-if="isSearchResult">
                    <ul v-if="searchResult && searchResult.length>0">
                        <li v-for="(search, index) in searchResult" :key="index" @click.stop="chooseResult(search)">
                            <label>
                                <img :src="search.url" />
                            </label>
                            <p>{{search.title}}</p>
                        </li>
                    </ul>
                    <p  class="notFound" v-else-if="searchResult && searchResult.length === 0">{{$t('tip.tip_notFoundMember')}}</p>
                </div>
                <div class="word-href" v-if="currentTab === 0">
                    <a v-for="(word, index) in wordList" :key="index" @click.stop="jump(word, index)">{{word.name}}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {directive as clickOutside} from 'v-click-outside-x';
    import TreeItem from "./treeItem";
    export default {
        name: "dropSelect",
        directives: { clickOutside },
        components: {TreeItem},
        props: {
            type: {
                type: String,
                default: ''
            },
            multiple: {
                type: Boolean,
                default: false
            },
            selectedHolder: {
                type: String,
                default: i18n.t('lang.lang_pleaseSelect')
            },
            selectedItem: {
                type: Array,
                default: () => []
            },
            memberData: {
                type: Array,
                default: () => []
            },
            departmentData: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                showDropContainer: false,
                dropTabs: [
                    {index: 0, name: i18n.t('lang.lang_member')},
                    {index: 1, name: i18n.t('lang.lang_department')},
                    {index: 2, name: i18n.t('lang.lang_position')}
                ],
                currentTab: 0,
                showCurrentTab: 0,
                wordList: [],
                collapse: false,
                isShowTree: false,
                isSearchResult: false,
                searchKeyword: {
                    word: '',
                    type: this.type
                },
                searchResult: []
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.matchedSelected();
                this.isShowTree = true;
                this.wordList = this.memberData.map(item => ({
                    name: item.title
                }));
            },
            dropDownContainer () {
                this.showDropContainer = !this.showDropContainer;
                this.init();
            },
            foreachData (data, type) {
                let _this = this;
                function setFalse (departData) {
                    for (let item of departData) {
                        if (item.id) {
                            _this.$set(item, 'selected', false);
                        }
                        if (item.children) {
                            setFalse(item.children);
                        }
                    }
                }
                if (_this.multiple && type === 'department') {
                    setFalse(data);
                }

                for (let item of data) {
                    for (let selected of _this.selectedItem) {
                        if (!_this.multiple) {
                            _this.$set(item, 'selected', false);
                        }
                        if (item.id && item.id === selected.id) {

                            _this.$set(item, 'selected', true);
                        }
                        if (item.children) {
                            _this.foreachData(item.children);
                        }
                    }
                }
                return data;
            },
            matchedSelected () {

                // 成员
                this.memberData = this.foreachData(this.memberData, null);
                // 职位
                this.departmentData = this.foreachData(this.departmentData, 'department');
            },
            changeTab (tab) {
                this.isSearchResult = false;
                this.currentTab = tab.index;
                this.$emit('changeCurrentTab', {index: tab.index, type: this.type});
                setTimeout(() => {
                    this.init();
                });
            },
            selectMember (memberItem) {
                let _this = this;
                if (_this.multiple) {
                    memberItem.selected = !memberItem.selected;
                    if (memberItem.selected) {
                        _this.selectedItem.push(memberItem);
                    } else {
                        let id = memberItem.id;
                        _this.selectedItem.forEach((item, index) => {
                            if (item.id === id) {
                                _this.selectedItem.splice(index, 1);
                            }
                        });
                    }
                } else {
                    _this.memberData.forEach(item => {
                        if (item.children) {
                            item.children.forEach(opt => {
                                opt.selected = false;
                            });
                        }
                    });
                    memberItem.selected = true;
                    _this.selectedItem[0] = memberItem;
                }
            },
            jump (word, index) {
                let _this = this;
                let hasIndex = false;
                let sortList = document.querySelectorAll('.sort-items');
                let currentWordName = word.name;
                let sortTitles = [];
                for (let item of sortList) {
                    sortTitles.push(item.getAttribute('title'));
                }
                circle();
                function circle () {
                    hasIndex = sortTitles.includes(currentWordName);
                    let titleStr = sortTitles.join().replace(/,/g, '');
                    if (hasIndex) {
                        index = titleStr.indexOf(currentWordName);
                    } else {
                        index = index > 0 ? (index - 1) : (index + 1);
                        currentWordName = _this.wordList[index].name;
                        circle();
                    }
                }
                let total = sortList[index].offsetTop;

                let ele = document.querySelector('.tree-list-container');
                let distance = ele.scrollTop;
                let step = total / 50;
                if (total > distance) {
                    smoothDown();
                } else {
                    let newTotal = distance - total;
                    step = newTotal / 50;
                    smoothUp();
                }

                function smoothDown () {
                    if (distance < total) {
                        distance += step;
                        ele.scrollTop = distance;
                        setTimeout(smoothDown, 1);
                    } else {
                        ele.scrollTop = total;
                    }
                }
                function smoothUp () {
                    if (distance > total) {
                        distance -= step;
                        ele.scrollTop = distance;
                        setTimeout(smoothUp, 1);
                    } else {
                        ele.scrollTop = total;
                    }
                }
            },
            selectDepartmentMember (sec) {
                let _this = this;
                function foreachDepartment (data) {
                    if (data && data.length > 0) {
                        for (let index in data) {
                            let currentItem = data[index];
                            if (currentItem.hasOwnProperty('selected')) {
                                _this.$set(currentItem, 'selected', false);
                            }
                            if (currentItem.children) {
                                foreachDepartment(currentItem.children);
                            }
                        }
                    }
                    return data;
                }
                if (this.multiple) {
                    // sec.selected = !sec.selected;
                    _this.$set(sec, 'selected', !sec.selected);
                    for (let item of _this.selectedItem) {
                        if (sec.selected) {
                            if (item.id !== sec.id) {
                                _this.selectedItem.push(sec);
                                return;
                            }
                        } else {
                            _this.selectedItem.forEach((item, index) => {
                                if (item.id === sec.id) {
                                    _this.selectedItem.splice(index, 1);
                                }
                            });
                        }
                    }
                    this.matchedSelected();
                } else {
                    _this.departmentData = foreachDepartment(_this.departmentData);
                    _this.$nextTick(() => {
                        Vue.set(sec, 'selected', true);
                        _this.$set(_this.selectedItem, 0, sec);
                    });
                }
            },
            // Search
            onEnterSearch (e) {
                this.isSearchResult = this.searchKeyword.word.trim().length > 0 ;
                if (this.isSearchResult) {
                    this.$emit('searchMemberData', this.searchKeyword);
                }
            },
            chooseResult (search) {
                let _this = this;
                let result = false;
                if (!this.multiple) {
                    _this.selectedItem.shift();
                    _this.selectedItem[0] = search;
                } else {
                    result = _this.selectedItem.some(item => item.id === search.id);
                    if (!result) {
                        _this.selectedItem.push(search);
                    }
                }
                this.isSearchResult = false;
                this.matchedSelected();
            },
            onClickOutside () {
                this.showDropContainer = false;
                if (this.memberData) {
                    this.memberData.map((items, index) => {
                        if (items.children) {
                            items.children.map((item) => {
                                item.selected = false
                            })
                        }
                    })
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .drop-select-container {
        width: 100%;
        height: auto;
        .selected-box {
            position: relative;
            width: 100%;
            min-height: 40px;
            padding: 9px 30px 9px 0;
            border: 1px solid #dfdfdf;
            background: #fff;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .selected-item {
                font-size: 13px;
                color: #777777;
                /*line-height: 40px;*/
                padding: 0 0 0 10px;
                &.selected-item-holder {
                    color: #ccc;
                }
            }
            > i {
                position: absolute;
                right: 10px;
                top: 13px;
                font-size: 14px;
                color: #999;
            }
            .drop-down-container {
                position: absolute;
                top: 38px;
                left: 0;
                width: 100%;
                height: 283px;
                border: 1px solid #dfdfdf;
                background: #fff;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                z-index: 999;
                .drop-tabs {
                    width: 100%;
                    overflow: hidden;
                    > li {
                        float: left;
                        padding: 0 10px;
                        line-height: 32px;
                        color: #777;
                        cursor: pointer;
                        -webkit-transition: all 0.3s;
                        -moz-transition: all 0.3s;
                        -ms-transition: all 0.3s;
                        -o-transition: all 0.3s;
                        transition: all 0.3s;
                        &.tab-active {
                            color: @base;
                        }
                    }
                }
                .search-item {
                    position: relative;
                    margin: 0 10px;
                    height: 30px;
                    background: #f7f7f7;
                    /*border: 1px solid #dfdfdf;*/
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    padding: 0 10px;
                    overflow: hidden;
                    > input {
                        width: 100%;
                        height: 28px;
                        border: none;
                        padding: 0 30px 0 0;
                        background: #f7f7f7;
                        color: #999;
                        outline: none;
                        -webkit-box-shadow: 0 0 0 #000;
                        -moz-box-shadow: 0 0 0 #000;
                        box-shadow: 0 0 0 #000;
                    }
                    > i {
                        position: absolute;
                        right: 10px;
                        top: 6px;
                        font-size: 18px;
                        color: #999;
                    }
                }
                .tree-list-container {
                    position: relative;
                    margin: 10px;
                    height: 180px;
                    overflow-y: auto;
                    .simple-list {
                        position: relative;
                        width: 100%;
                        > ul {
                            > li.sort-items {
                                width: 100%;
                                height: auto;
                                > h1.sort-title {
                                    font-size: 16px;
                                    color: @base;
                                    text-align: left;
                                    font-weight: normal;
                                }
                                > p.member-name {
                                    position: relative;
                                    font-size: 14px;
                                    color: #777;
                                    line-height: 28px;
                                    margin: 5px 0;
                                    padding: 3px 0;
                                    overflow: hidden;
                                    -webkit-border-radius: 3px;
                                    -moz-border-radius: 3px;
                                    border-radius: 3px;
                                    &.member-selected {
                                        background: rgba(60, 210, 180, 0.35);
                                    }
                                    > label {
                                        display: block;
                                        width: 28px;
                                        height: 28px;
                                        float: left;
                                        margin: 0 0 0 15px;
                                        overflow: hidden;
                                        -webkit-border-radius: 50%;
                                        -moz-border-radius: 50%;
                                        border-radius: 50%;
                                        border: 1px solid #efefef;
                                        > img {
                                            max-width: 100%;
                                            max-height: 100%;
                                        }
                                    }
                                    > span {
                                        float: left;
                                        margin: 0 0 0 10px;
                                    }
                                    > i {
                                        position: absolute;
                                        right: 10px;
                                        top: 0;
                                        font-size: 34px;
                                        color: @base;
                                    }
                                }
                            }
                        }
                    }

                    .tree-list {
                        position: relative;
                        width: 100%;
                        li {
                            padding: 0 0 0 15px;
                        }
                        .first-level {
                            width: 100%;
                            line-height: 30px;
                            color: #777;
                            padding: 0;
                            i {
                                float: left;
                                margin-top: 8px;
                                font-size: 16px;
                                color: #999;
                            }
                            p > span {
                                margin: 0 0 0 8px;
                            }
                            .second-level {
                                width: 100%;
                                line-height: 30px;
                                color: #777;
                                p > span {
                                    margin: 0 0 0 8px;
                                }
                                .third-level {
                                    position: relative;
                                    margin: 0 10px 5px 0;
                                    padding: 2px 0 0 15px;
                                    line-height: 30px;
                                    color: #777;
                                    -webkit-border-radius: 3px;
                                    -moz-border-radius: 3px;
                                    border-radius: 3px;
                                    &.selected-member {
                                        background: rgba(60, 210, 180, 0.35);
                                    }
                                    > label.head-img {
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
                                    > i {
                                        position: absolute;
                                        right: 10px;
                                        font-size: 34px;
                                        top: -1px;
                                        margin: 0;
                                        padding: 0;
                                        color: @base;
                                    }
                                }
                            }
                        }
                    }
                }
                .search-result {
                    position: absolute;
                    top: 70px;
                    left: 0;
                    padding: 10px;
                    width: 100%;
                    height: 210px;
                    overflow-y: auto;
                    background: #fff;
                    z-index: 99;

                    li {
                        line-height: 32px;
                        margin: 0 0 5px;
                        padding: 0 10px;
                        -webkit-border-radius: 3px;
                        -moz-border-radius: 3px;
                        border-radius: 3px;
                        &:hover {
                            cursor: pointer;
                            background: rgba(60, 210, 180, 0.3);
                        }
                        > label {
                            display: block;
                            width: 28px;
                            height: 28px;
                            float: left;
                            margin: 0 0 0 15px;
                            overflow: hidden;
                            -webkit-border-radius: 50%;
                            -moz-border-radius: 50%;
                            border-radius: 50%;
                            border: 1px solid #efefef;
                            > img {
                                max-width: 100%;
                                max-height: 100%;
                            }
                        }
                    }
                    .notFound{
                        display: flex;
                        width: 100%;
                        height: 190px;
                        justify-content: center;
                        align-items: center;
                    }
                }
                .word-href {
                    position: absolute;
                    bottom: 3px;
                    left: 0;
                    width: 100%;
                    padding: 0 10px;
                    border-top: 1px solid #dfdfdf;
                    background: #fff;
                    display: flex;
                    justify-content: space-around;
                    > a {
                        line-height: 24px;
                        font-size: 12px;
                        color: #bbb;
                        &:hover {
                            color: @base;
                        }
                    }
                }
            }
        }
    }
</style>
