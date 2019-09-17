<template>
    <!--群管理-->
    <div class="groupMembershipContainer">
        <header class="groupTitle">
            <span class="backButton" @click="groupMembershipShow"><Icon type="ios-arrow-back"/>&nbsp;&nbsp;返回</span>
            <span class="groupTitleText">{{seting ? '群管理' : '新建聊天'}}</span>
        </header>
        <section v-if="seting">
            <div class="groupName "><span>群名称</span>
                <p v-if="isProject" class="comDeleteButton deleteButton" @click="deleteGroup">删除群聊</p></div>
            <Input v-model="groupName" placeholder="请输入群的名称"></Input>
        </section>
        <section>
            <p class="groupMemberTitle">群成员</p>
            <div class="groupMemberMain">
                <div class="groupMemberMainLeft">
                    <p class="memberListTitle">成员列表</p>
                    <div v-if="searchMember&&searchMember.id" class="searchList" @click="addSrarchMember">
                        <div class="addedListMain">
                            <img :src="`${GLOBAL.imgDomain}/index.php?r=system/user/get-headimage&id=${searchMember.id}`"
                                 alt="">
                            <span>{{searchMember.realname||searchMember.nickname}}</span>
                        </div>
                        <Icon class="deleteIcon" size="18" @click.native.self="searchMember = null"
                              type="ios-close-outline"></Icon>
                    </div>
                    <div v-else class="treeBox">
                        <Tree :data="data5" :render="renderContent"></Tree>
                    </div>

                    <div class="searchButton">
                        <Input v-model="searchValue" placeholder="搜索公司成员/外部成员邮件" icon="ios-search" @on-click='getSearchMember'>
                            <!-- <Icon @click.native="getSearchMember" style="cursor: pointer;padding: 5px;" type="ios-search-strong" slot="append"></Icon> -->
                        </Input>
                    </div>
                </div>
                <div class="groupMemberMainRight">
                    <div class="memberListTitle"><span>已选择成员({{addedListLenght}})</span>
                        <p class="comDeleteButton" @click="deleteAddedList">删除全部</p></div>
                    <ul class="addedListBox">
                        <li class="addedList" v-for="(item,index) in addedList " :key="index" v-if="item.user_id != userId">
                            <div class="addedListMain">
                                <img :src="`${GLOBAL.imgDomain}/index.php?r=system/user/get-headimage&id=${item.user_id}`"
                                     alt="">
                                <span>{{item.realname}}</span>
                                <span v-if="item.type==='2'" @click="setVip(item)"
                                      class="iconfonts icon-king1 king"></span>
                                <span v-else-if="userId!==item.user_id" @click="setVip(item)"
                                      class="iconfonts icon-king1 "></span>
                                <!--<Icon size="18" type="university"></Icon>-->
                            </div>
                            <!-- 管理员不要删除按钮  -->
                            <Icon v-if="item.type !== '1'" class="deleteIcon" size="18" @click.native="deleteMember(item,index)"
                                  type="ios-close-outline"></Icon>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        <footer class="footer">
            <p class="comCancelButton" @click="groupMembershipShow">取消</p>
            <Button type="primary" @click="submit">保存</Button>
        </footer>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import api from 'api';
    import Cookies from 'js-cookie';

    export default {
        mounted() {
            this.getcompanyName();
            this.getDepartmentList();

            /* 设置的情况下加载群成员 */
            this.getChatGroupUser();
        },
        props: {
            seting: {
                type: Boolean
            },
            turnToNoticeObj: {
                type: Object,
                default: {}
            },
            currentGourpName: {
                type: String
            },
            isProject: {
                type: Boolean,
            }
        },
        data() {
            return {
                searchMember: null,
                searchValue: '',
                groupName: this.currentGourpName || '',  // 群名称
                addedList: [],  // 已添加成员
                departmentList: null,  //成员列表
                data5: [
                    {
                        title: '',
                        children: [],
                        expand: true,
                        rank: 0,
                    }
                ],
                buttonProps: {
                    type: 'ghost',
                    size: 'small',
                },
//                userId:sessionStorage.userId

            };
        },
        methods: {

            /* 返回 */
            groupMembershipShow() {
                this.$emit('groupMembershipShow');
            },

            /* 公司名放到tree */
            getcompanyName() {
                this.data5[0].title = this.companyName.company_name;
            },

            /* 删除所有已添加成员 */
            deleteAddedList() {
                if (!this.seting) {
                    this.addedList = [];
                } else {
                    this.addedList.map(async (item, index) => {
                        let {data} = await api.kickChatGroup({user_id: item.user_id, group_id: this.groupInfo.group_id});
                        if (data.err_code === 0 && this.addedList.length - 1 === index) {
                            this.getChatGroupUser();
                        }
                    });
                }

            },

            /* 获取公司部门列表 */
            async getDepartmentList() {
                let {data} = await api.getDepartmentList();
                if (data.err_code === 0 && data.data) {

                    this.departmentList = data.data;
                    this.departmentList.push({
                        company_id: JSON.parse(Cookies.get('company')).id,
                        id: 0,
//                        member_count: res.free_member,
                        name: '未分配部门'

                    });

                }

                /* 添加部门成员 */
                this.appendDepartmentUser();
            },

            /* 添加部门成员 */

            appendDepartmentUser() {
                if (this.departmentList) {
                    this.departmentList.forEach(async (item, index) => {
                        item.title = item.name;
                        this.$set(item, 'rank', 1);
                        let {data} = await api.getcompanyUserList({company_id: item.company_id, department_id: item.id});
                        if (data.err_code === 0 && data.data) {
                            data.data.forEach((member) => {
                                member.title = member.realname;
                                this.$set(member, 'rank', 2);
                            });
                            this.$set(item, 'children', data.data);
                        }
                    });
                    this.$set(this.data5[0], 'children', this.departmentList);
                }
            },

            /* 加载群成员 */
            async getChatGroupUser() {
                if (!this.seting) {
                    return;
                }
                let {data} = await api.getChatGroupUser({group_id: this.groupInfo.group_id});
                if (data.err_code === 0 && data.data) {
                    this.addedList = data.data;
                }
            },

            /* 搜索成员 */
            async getSearchMember() {
                let is_team = true;
                if (this.departmentList) {
                    this.departmentList.map((items) => {
                        if (items.children) {
                            items.children.map((item) => {
                                if (item.remark_name === this.searchValue) {
                                    this.searchMember = {
                                        realname: item.realname,
                                        id: item.id,
                                    };
                                    is_team = false;
                                }
                            });
                        }
                    });
                }
                let {data} = await api.getEmailPhone({search: this.searchValue});
                if (data.err_code === 0) {
                    if (is_team) {
                        this.searchMember = data;
                    }
                }
            },

            /* 添加搜索人 */
            async addSrarchMember() {
                if (!this.seting) {
                    this.$set(this.searchMember, 'user_id', this.searchMember.id);
                    const is_add = this.addedList.some((item) => item.user_id === this.searchMember.id);
                    if (!is_add) {
                        this.addedList.push(this.searchMember);

                    }
                } else {
                    const objForm = {
                        user_id: this.searchMember.id,
                        group_id: this.groupInfo.group_id
                    };

                    let {data} = await api.joinChatGroup(objForm);
                    if (data.err_code === 0 && data.id) {
                        this.getChatGroupUser();
                    }
                }
                this.searchMember = null;
            },

            /* tree配置 */
            renderContent(h, {root, node, data}) {
                // 成员头像
                let imgDomain = this.GLOBAL.imgDomain;
                const headImg = data.rank === 2 ? h('span', {
                    style: {
                        display: 'inline-block',
                        width: '25px',
                        height: '25px',
                        margin: '0px 10px 0px 0px',
                        borderRadius: '50%',
                        background: `url("${imgDomain}/index.php?r=system/user/get-headimage&id=${data.user_id}")  0% 0% / 26px no-repeat`,
                        verticalAlign: 'middle',
                    }
                }) : '';
                //成员样式
                const rank2Name = data.rank === 2 ? {
                    position: 'relative',
                    left: '-45px',
                    display: 'inline-block',
                    width: '110%',
                    paddingLeft: '45px',
                    fontSize: '14px',
                    margin: '4px 0px',
                    cursor: 'pointer',
                } : {};
                // 公司与部门添加按钮
                const is_addButton = data.children && data.children.length > 0 && data.rank !== 2;
                const addButton = is_addButton ? h('span', {
                    class: 'iconfonts icon-jiahao',
                    style: {
                        marginRight: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                    },
                    on: {
                        click: () => {
                            this.append(data, node);
                        }
                    }
                }) : '';

                return h('span', {
                    style: rank2Name,
                    on: {
                        click: () => {
                            if (data.rank === 2) {
                                console.log(data);
                                this.addSingleMember(data);
                            }
                        }
                    }
                }, [
                    h('span', [

                        /* 图标 */
                        headImg,
                        h('span', data.rank === 2
                            ? {style: {fontSize: '14px', margin: '4px 0px', verticalAlign: 'middle'}}
                            : {style: {fontSize: '14px', margin: '4px 0px', verticalAlign: 'middle'}},
                            data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px',
                        }
                    }, [

                        /* 按钮 */
                        addButton
                    ])
                ]);
            },

            /*成员添加*/
            async addSingleMember(memberData) {

                if (!this.seting) {
                    const some = this.addedList.some((item) => item.id === memberData.id);
                    if (!some) {
                        this.addedList.push(memberData);
                    }
                } else {

                    this.setingAddmember(memberData);
                }

            },

            /* 设置内添加成员 */
            async setingAddmember(memberData) {
                let {data} = await api.joinChatGroup({user_id: memberData.user_id, group_id: this.groupInfo.group_id});
                if (data.err_code === 0) {
                    this.getChatGroupUser();
                }
            },

            /* 成员删除 */

            async deleteMember(item, index) {
                // 创建
                if (!this.seting) {
                    this.addedList.splice(index, 1);
                } else {
                    // 设置内删成员
                    let {data} = await api.kickChatGroup({user_id: item.user_id, group_id: this.groupInfo.group_id});
                    if (data.err_code === 0) {
                        this.getChatGroupUser();
                        this.$emit('getChatMemberList');
                    }
                }
            },
            // 设置vip
            async setVip(item) {

                if (item.type === '1') {
                    // 已经是vip
                    let {data} = await api.chatUnsetVip({t_user_id: item.user_id, group_id: this.groupInfo.group_id});
                    if (data.err_code === 0) {
                        this.getChatGroupUser();
                    }

                } else {
                    let {data} = await api.chatSetVip({t_user_id: item.user_id, group_id: this.groupInfo.group_id});
                    if (data.err_code === 0) {
                        this.getChatGroupUser();
                    }
                }

            },

            /* 提交 */
            submit() {
                if (!this.seting) {
                    this.createGroup();
                } else {
                    this.updateGroup();
                }
            },

            /* 创建群 */
            async createGroup() {

                if (this.addedList.length > 0) {
                    if (this.turnToNoticeObj.message_id && this.turnToNoticeObj.group_id) {
                        //消息转通知接口
                        let userList = [];
                        this.addedList.forEach((creent, index, arr) => {
                            userList.push(creent.user_id);
                        });
                        this.turnToNoticeObj.users = JSON.stringify(userList);
                        this.msgTrunNotice(this.turnToNoticeObj);
                    } else {

                        if (this.addUserNumber(0)) {
                            this.$Message.info('不能只添加自己');
                            
                        } else if (this.addUserNumber(1)) {
                            this.addone();
                        } else if (this.addUserNumber(2)) {
                            this.addGroup();
                        }
                    }
                } else {
                    this.$Message.error('至少选择一个');
                }
            },

            /* 创建群时添加人数 */
            addUserNumber(type) {
                let obj = null;

                /* 无人 */
                if (type === 0) {
                    obj = this.addedList.length === 1 && this.addedList[0].user_id === this.userId;
                } else if (type === 1) {

                    /* 一人 */
                    obj = this.addedList.length === 1 || (this.addedList.some(item => item.user_id === this.userId) && this.addedList.length === 2);
                } else if (type === 2) {

                    /* 多人 */
                    obj = this.addedList.length > 1;
                }
                return obj;
            },

            /* 修改群 */
            updateGroup() {
                this.updateGroupName();

            },

            /* 修改群名 */
            async updateGroupName() {
                if (this.groupName !== ''&&this.groupName!==this.currentGourpName) {
                    let {data} = await api.updateGroupName({group_id: this.groupInfo.group_id, name: this.groupName});
                    if (data.err_code === 0) {
                        this.$emit('getChatMemberList');
                        this.$emit('groupMembershipShow');
                    }
                } else {
                    this.$emit('groupMembershipShow');
                }
            },

            /* 删群 */
            async deleteGroup() {
                let {data} = await api.dissolveGroup({group_id: this.groupInfo.group_id});
                if (data.err_code === 0) {
                    this.groupMembershipShow();
                    this.$emit('getChatMemberList');
                }
            },
            //消息转通知
            async msgTrunNotice(TrunObj) {
                let {data} = await api.MsgTrunNotice(TrunObj);
                if (data.err_code == 0) {
                    this.$Message.success('消息转发成功！');
                    this.$emit('groupMembershipShow');
                } else {
                    this.$Message.error(data.err_message);
                }
            },

            /* 添加私聊 */
            async addone() {
                let {data} = await api.createChatOne({user_id: this.addedList[0].user_id});
                if (data.err_code === 0) {
                    this.addedList = [];
                    this.groupMembershipShow();
                    this.$emit('getChatMemberList');
                }
            },

            /* 添加群聊 */
            async addGroup() {

                let userArray = [];
                this.addedList.map((item, index) => {
                    userArray.push(item.user_id);
                });
                let {data} = await api.createGroupOne({user_id: JSON.stringify(userArray)});
                if (data.err_code === 0) {
                    this.addedList = [];
                    this.groupMembershipShow();
                    this.$emit('getChatMemberList');
                }
            },
            // 公司和部门添加
            append(data, parentNode) {

                // 公司添加
                if (data.rank === 0) {
                    this.addCompany(data);
                }
                // 部门添加
                else if (data.rank === 1) {
                    this.addDepartment(data, parentNode.nodeKey);
                }

            },
            // 公司添加
            async addCompany(companyData) {
                if (!this.seting) {
                    this.addedList = [];
                }
                if (companyData.children) {
                    companyData.children.map((items, index) => {
                        if (!this.seting) {
                            if (items.children) {
                                this.addedList = this.addedList.concat(items.children);
                            }
                        } else {
                            this.setaddDepartment(items);
                        }

                    });
                }

            },

            // 部门添加
            addDepartment(data, nodeKey) {

                if (!this.seting) {
                    this.createAddDepartment(data);
                } else {
                    this.setaddDepartment(data);
                }

            },

            /* 创建添加部门成员 */
            createAddDepartment(data) {
                let notAdded = [];
                data.children.map((item, index) => {
//                    this.$set(item,'parentNode',nodeKey)
                    if (this.addedList) {
                        let is_exist = true;
                        this.addedList.map((selec, idx) => {
                            if (item.id === selec.id) {
                                is_exist = false;
                            }
                        });
                        // 并不包含的成员
                        if (is_exist) {
                            this.addedList.push(item);
                        }
                    }
                });

            },

            /* 设置添加部门成员 */
            setaddDepartment(departmentData) {

                departmentData.children.map(async (item, index) => {
                    let {data} = await api.joinChatGroup({user_id: item.user_id, group_id: this.groupInfo.group_id});
                    if (data.err_code === 0 && index === departmentData.children.length - 1) {
                        this.getChatGroupUser();
                    }
                });

            },

        },
        computed: {
            ...mapState({
                groupInfo(value) {
                    return value.message.groupInfo;
                },
            }),

            /* 公司名称 */
            companyName() {
                return JSON.parse(Cookies.get("company"));
            },
            userId() {
                return sessionStorage.getItem('userId');
            },

            /* 已选择成员个数 */
            addedListLenght() {
                return this.addedList ? this.addedList.filter(item=>item.user_id!==this.userId).length : 0;

            }

        },
        components: {}
    };
</script>

<style lang="less" scoped>
    .groupMembershipContainer {
        width: 100%;
        padding: 0 30px 33px;
        color: #777777;
        .groupTitle {
            position: relative;
            height: 52px;

            line-height: 52px;
            text-align: center;
            font-size: 14px;
            border-bottom: 1px solid @baseboard;
            .groupTitleText {
                color: @black_2;
            }
            .backButton {
                position: absolute;
                top: 0;
                left: 5px;
                color: #bdbdbd;
                cursor: pointer;
                &:hover{
                    color: @base;
                }
            }
        }
        .groupName {
            display: flex;
            justify-content: space-between;
            margin: 30px 0 23px;
            font-size: @fs14;
            color: @black_2;
            .deleteButton {
                position: relative;
                top: -10px;
            }
        }
        .groupMemberTitle {
            margin: 10px 0 10px;
            font-size: @fs16;
            color: @black_2;
        }
        .groupMemberMain {
            display: flex;
            height: 475px;
            padding: 0 20px;

            border: 1px solid @baseboard;
            border-radius: 4px;
            .groupMemberMainLeft {
                position: relative;
                width: 445px;
                border-right: 1px solid @baseboard;
                .treeBox {
                    height: 360px;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                .memberListTitle {

                    height: 45px;
                    margin-right: 20px;
                    line-height: 45px;
                    font-size: 14px;
                    border-bottom: 1px solid @baseboard;
                    color: @black_2;
                }
                .searchButton {
                    position: absolute;
                    bottom: 20px;
                    width: 100%;
                    padding-right: 20px;

                }

            }

            .groupMemberMainRight {
                width: 300px;
                border-bottom: 1px solid @baseboard;
                margin-left: 20px;
                .memberListTitle {
                    display: flex;
                    height: 45px;
                    justify-content: space-between;
                    align-items: center;
                    line-height: 45px;
                    font-size: 14px;
                    border-bottom: 1px solid @baseboard;
                    color: @black_2;

                }
                .addedListBox {
                    height: 400px;
                    padding-top: 12px;
                    overflow-y: auto;

                }
            }
            .searchList, .addedList {

                display: flex;
                padding: 9px 0;
                justify-content: space-between;
                align-items: center;
                .addedListMain {
                    font-size: 14px;
                    .king {
                        color: @yellow;
                    }
                    img {
                        width: 26px;
                        height: 26px;
                        border-radius: 50%;
                    }
                    img, i, span {
                        vertical-align: middle;
                    }

                }
                .deleteIcon {
                    font-size: 18px;
                }
                &:hover {
                    .deleteIcon {
                        color: #ff5252;

                    }
                }
            }
        }

        .footer {
            position: absolute;
            bottom: 30px;
            width: 92%;
            display: flex;
            margin-top: 30px;
            justify-content: flex-end;
            .comCancelButton{
                &:hover{
                    color: @base;
                }
            }
        }
    }
</style>
<style lang="less">
    .groupMembershipContainer {
        .groupMemberMainLeft {
            .ivu-input-group-append {

                width: 40px;
                font-size: 18px;
                background: #fff;
                border-left: 1px solid transparent !important;
            }
            .ivu-input-group .ivu-input {
                border-right: 1px solid transparent !important;

            }
            .ivu-input-wrapper{
                .ivu-icon-ios-search{
                    &:hover{
                        cursor: pointer;
                    }
                }
            }

        }

    }
</style>
