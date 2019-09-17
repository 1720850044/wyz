<template>
    <div class="typelibLeftContainer typelib-guide-left" >
        <div class="addTypelibHeader">
            <span>{{$t('companySpecificationLibrarys.com_specificationLibrary')}}</span>
            <a class="addButton" @click="append(null, 'all')">+ {{$t('companySpecificationLibrarys.com_newFolders')}}</a>
        </div>

        <div class="typeTree">
            <Tree class="treeMapContainer" @on-toggle-expand="showTree" :data="treeMap"
                  :render="renderContent"></Tree>
        </div>
        <!--<p class="shade"></p>-->
        <!--复制-->
        <Modal class="treeMapWindow" v-model="copy.show" :title="$t('companySpecificationLibrarys.com_selectCopyDirectory')" @on-ok="copyNode"
               @on-cancel="copy.show = false">
            <Select v-model="copy.newId" style="width:200px">
                <Option v-for="(item,index) in folder" :value="item.cate_id" :key="index">{{ item.name }}</Option>
            </Select>
        </Modal>
        <!--删除-->
        <Modal class="treeMapWindow" :title="$t('lang.lang_delete')" v-model="del.show" @on-ok="remove" @on-cancel="del.show = false">
            {{$t('companySpecificationLibrarys.com_deleteTips')}}
        </Modal>
        <!--修改名称-->
        <Modal class="treeMapWindow" :title="$t('lang.lang_modify')" v-model="changName.show" @on-ok="selecText"
               @on-cancel="changName.show = false">
            <Input v-model="changName.value" style="width: 90%" :placeholder="$t('lang.lang_pleaseEnter') + $t('companySpecificationLibrarys.com_newName')"></Input>
        </Modal>

        <!--上传组件测试-->
        <!--<v-upload></v-upload>-->
    </div>
</template>
<script>
    import {mapState, mapMutations, mapActions} from 'vuex';
    import qs from 'querystring';
    import vUpload from '@/components/upload.vue';
    import api from 'api';

    export default {
        created() {
            if (!sessionStorage.expandStatus){
                sessionStorage.expandStatus = 0;
            }
        },
        mounted() {

            /*树状图初始化*/
            this.init();

            /*规范详情删除*/
            this.$bus.on('deleteDetails', data => {
                this.isDelete = true;
                this.delButton('details', data);
            });

            /*info触发树状图更新*/
            this.$bus.on('treeUpdate', data => {
                if (data && data.id) {
                    this.init(data.id);
                    this.expandDetails = data.id;
                    sessionStorage.expandDetails = data.id;
                } else {
                    this.init();
                }

            });
        },
        beforeDestroy() {
            // this.$bus.$off()
        },
        props: {

        },
        data() {
            return {
                isNewTasktype: false, //禁止创建多个新建规范
                treeMapData: null,
                expandStatus: sessionStorage.expandStatus?sessionStorage.expandStatus:0,
                expandArray: JSON.parse(sessionStorage.getItem('expand')) || [],
                expandDetails: sessionStorage.getItem('expandDetails')?sessionStorage.getItem('expandDetails'):null,
                company_id: sessionStorage.getItem('userId'),
                copy: {
                    show: false,
                    id: '',
                    newId: ''
                },
                del: {
                    show: false,
                    id: '',
                    data: ''
                },
                changName: {
                    show: false,
                    id: '',
                    value: ''
                },
                folder: [],
                newTreeTitle: '',
                treeMap: [
                    {
                        name: i18n.t('lang.lang_all'),
                        rank: 0,
                        expand: true,
                        render: (h, {root, node, data}) => {
                        },
                        children: []
                    }
                ],
                buttonProps: {
                    type: 'ghost',
                    size: 'small'
                }
            };
        },
        methods: {
            ...mapMutations(['setTreeData']),
            ...mapActions(['setDefIdAction']),

            async init(backId, isInfo = true) {
                // 参数是用来添加新规范的时候 刷新列表还显示底纹
                let {data} = await api.taskCateList();
                if (data.err_code === 0 && data.data) {

                    /*一级处理*/
                    let rank = 0;
                    data.data.map((item, index) => {
                        item.rank = rank;

                        /*给系统默认添加标识*/
                        if (item.company_id === '0') {
                            item.status = 0; // 系统默认
                        }

                        /*展开点击了详情的分类  默认展示系统默认*/
                        if (this.expandArray&&this.expandArray.length <= 0 && index === 0) {
                            item.expand = true;
                            this.expandArray = [ {
                                rank: 0,
                                expand: true,
                                cate_id: item.cate_id
                            }];
                        }

                            /*展开之前选中的分类*/
                        this.showExpand(item);

                        /*二级遍历处理*/
                        if (item.children) {
                            this.arrData(item.children, rank + 1, item.status, backId, index, isInfo);
                        }
                    });
                    this.treeMap[0].children = data.data;
                    this.setTreeData(data.data);
                    this.isNewTasktype = false;

                } else {
                    this.$Message.error(data.err_message);
                }
            },

            /*递归遍历*/
            arrData(data, rank, status, backId, initIndex, isInfo) {
                data.map((item, index) => {
                    item.rank = rank;
                    item.status = status;
                    item.editText = false;
                    if (this.expandArray&&this.expandArray.length <= 1&&rank === 1 && initIndex === 0&&index === 0){
                        this.expandArray.push({rank: 1, expand: true, cate_id: item.cate_id});
                        sessionStorage.expand = JSON.stringify(this.expandArray);
                    }

//                    /*展开详情*/
//                    if(this.expandArray&&this.expandArray.length <= 0){
//
//                        if(this.expandDetails&&!this.expandDetails[1]){
//                            if (index ===0 && rank ===1) {
//                                item.expand = true
//                            }
//                        }else{
//                            if(item.cate_id ===this.expandDetails[1]){
//                                item.expand = true
//
//                            }
//                        }
//                    }

                    /*展开之前选中的子分类*/
                    this.showExpand(item);

                    /*存在类别*/
                    if (item.tasktype) {
                        item.children = item.tasktype;
                        item.isTasktype = true;
                        let is_set = false;
                        // 处理类别
                        item.children.map((children, idx) => {
                            // 新建成功时添加背景色
                            if (backId && backId == children.id) {
                                this.$set(children, 'background', true);
                            } else if (this.expandDetails){
//                                sessionStorage.expandStatus = 1

                                is_set = true;
                                if (!backId&&this.expandDetails == children.id){

                                    this.$set(children, 'background', true);
                                }
                            } else if (index === 0 && status === 0 && idx === 0) {

                                // 系统默认
                                this.expandDetails = children.id;
                                if (this.expandDetails){
                                    sessionStorage.expandDetails = this.expandDetails;
                                }
                                is_set = true;
                                this.$set(children, 'background', true);
                            }
                        });
                        if (is_set && isInfo) {
                            this.setDefIdAction(this.expandDetails);
                        }
                    }

                    /*有分类*/
                    if (item.children) {
                        this.arrData(item.children, rank + 1, status, backId);
                    }
                });
            },
            renderContent(h, {root, node, data}) {
                let textTitle = h('span', data.name ? data.name : data.tasktype_name);
                return this.renderingTree(h, root, node, data, textTitle);
            },

            /*渲染所有*/
            renderingTree(h, root, node, data, textTitle, ) {
                let className = '';
                if (data.rank === 0) {
                    className = 'node0';
                } else if (data.rank === 1) {
                    className = 'node1';
                } else {
                    className = 'node2';
                }
                return h(
                    'p',
                    {
                        style: {
                            display: 'inline-block',
                            width: '100%',
                            height: '35px',
                            lineHeight: '35px',
                            paddingLeft: '10px',
                            overflow: 'hidden',
                            background: data.rank === 0 ? '#ffffff' : data.background ? '#ccf2ec' : '',
                            color: data.rank === 0 || data.rank === 1 ? '#9E9E9E ' : '#616161',
                            borderRadius: '2px',
                        },
                        class: 'standardListName',
                    },
                    [
                        h('span', [
                            data.rank === 1
                                ? h('Icon', {
                                    props: {
                                        type: 'folder'
                                    },
                                    style: {
                                        marginRight: '8px',
                                        color: '#bdbdbd',
                                        fontSize: '20px'
                                    }
                                })
                                : data.rank === 2 && data.icon_url
                                ? h('span', {
                                    style: {
                                        position: 'relative',
                                        top: '-17px',
                                        display: 'inline-block',
                                        width: '20px',
                                        height: '28px',
                                        margin: '0 10px 0 0',
                                        background: `url(${
                                            data.icon_url
                                            }) 0% 0% / 18px no-repeat`,
                                        backgroundSize: '18px',
                                        verticalAlign: 'sub',
                                        filter: `drop-shadow(${
                                            data.color ? data.color : 'black'
                                            } 0px 28px)`
                                    }
                                })
                                : '',
                            h(
                                'span',
                                {
                                    style: {
                                        width: '100px',
                                        fontSize:
                                            data.rank === 0
                                                ? '15px'
                                                : data.rank === 1
                                                ? '14px'
                                                : '13px',

                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            this.goTaskList(data, root, node);
                                        }
                                    }
                                },
                                [textTitle]
                            )
                        ]),

                        data.status !== 0
                            ? h(
                            'span',
                                {
                                    class: 'buttonList'
                                },
                                [
                                    data.rank === 2
                                    ? ''
                                    : h(
                                    'Button',
                                        {
                                            style: {
                                                border: '1px solid transparent',
                                                background: 'transparent',
                                                padding: 0
                                            },
                                            on: {
                                                click: () => {
                                                    this.append(data, '222');
                                                }
                                            }
                                        },
                                        [
                                            h('Icon', {
                                                style: {
                                                    marginRight: '8px',
                                                    fontSize: '20px'
                                                },
                                                props: {
                                                    type: 'ios-plus-outline'
                                                }
                                            })
                                        ]
                                    ),

                                    data.rank === 2
                                    ? ''
                                    : h(
                                    'Button',
                                        {
                                            style: {
                                                border: '1px solid transparent',
                                                background: 'transparent',
                                                padding: 0
                                            },
                                            on: {
                                                click: () => {
                                                    this.changeName(data);
                                                }
                                            }
                                        },
                                        [
                                            h('Icon', {
                                                style: {
                                                    marginRight: '8px',
                                                    fontSize: '20px'
                                                },
                                                props: {
                                                    type: 'edit'
                                                }
                                            })
                                        ]
                                    ),

                                    data.rank !== 2
                                    ? h(
                                    'Button',
                                        {
                                            style: {
                                                border: '1px solid transparent',
                                                background: 'transparent',
                                                padding: 0
                                            },
                                            on: {
                                                click: () => {
                                                    this.delButton(root, node, data);
                                                }
                                            }
                                        },
                                        [
                                            h('Icon', {
                                                style: {
                                                    marginRight: '8px',
                                                    fontSize: '20px',
                                                },
                                                props: {
                                                    type: 'ios-trash-outline'
                                                }
                                            })
                                        ]
                                    )
                                    : ''
                                ]
                            )
                            : ''
                    ]
                );
            },

            /* 添加 */
            async append(treeData, type) {

                let obj = null;

                /*添加分类*/
                if (type === 'all') {
                    obj = {
                        name: i18n.t('companySpecificationLibrarys.com_newStandardClass'),
                        company_id: this.company_id
                    };
                } else if (treeData.rank === 0) {

                    /*添加类型*/
                    obj = {
                        name: i18n.t('companySpecificationLibrarys.com_newManufactureCode'),
                        parent_id: treeData.cate_id
                    };
                    treeData.expand = true;
                    this.showTree(treeData);

//                    sessionStorage.expand = this.expandArray

                } else {
                    if (this.isNewTasktype){
                        this.$Message.info(i18n.t('companySpecificationLibrarys.com_createdSpecification'));
                        return;
                    }
                    this.isNewTasktype = true;
                    this.clearActive();
                    treeData.expand = true;
                    this.classifyExpand(treeData);
                    treeData.children.map((items, index) => {
                        items.background = false;
                    });
                    treeData.children.push({
                        name: i18n.t('companySpecificationLibrarys.com_newSpecification'),
                        parent_id: treeData.cate_id,
                        rank: 2,
                        temporary: true,
                        btnShow: false,
                        background: true
                    });
                    this.$bus.emit('addType', treeData);

                    return false;
                }

                let {data} = await api.taskCateAdd(obj);
                if (data.err_code === 0) {
                    this.init();
                    this.$Message.success(data.err_message);
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            clearActive() {
                if (this.treeMap) {
                    this.treeMap.map((items, index) => {
                        if (items.children) {
                            items.children.map((item, idx) => {
                                if (item.children) {
                                    item.children.map((child, i) => {
                                        if (child.children) {
                                            child.children.map(children => {
                                                children.background = false;
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            },

            /*点击进入详情*/
            goTaskList(data, root, node) {

                /*详情展开*/
                if (data.rank === 2) {
                    sessionStorage.expandStatus = data.status === 0?0:1;
                    this.detailsExpand(data, root, node);
                    if (data.temporary) {

                        // 新建时没保存 但是用户点击了其他详情，又点击回来
                        this.$bus.emit('addType', data);
                    } else {
                        this.$bus.emit('typesDetail', data);

                    }
                    // 增加选中背景色
                    this.treeMap[0].children.map(item => {
                        if (item.children) {
                            item.children.map(typeList => {
                                typeList.children.map(data => {
                                    if (data.id === this.expandDetails) {
                                        this.$set(data, 'background', true);
                                    } else if (data.background) {
                                        data.background = false;
                                    }
                                });
                            });
                        }
                    });
                }
            },

            /*详情展开*/
            detailsExpand(data, root, node) {
                let nodeSecond = null,
                    nodeStair = null;
                nodeSecond = node.parent;
                this.expandDetails = data.id;
                root.map(roots => {
                    if (roots.nodeKey === nodeSecond) {
//                        this.expandDetails[1] = roots.node.cate_id
                        nodeStair = roots.parent;
                    }
                });
                if (nodeStair !== null) {
                    root.map(roots => {
                        if (roots.nodeKey === nodeStair) {
//                            this.expandDetails[0] = {
//                                id: roots.node.cate_id,
//                                status: roots.node.status
//                            }
                        }
                    });
                }

                sessionStorage.setItem('expandDetails', this.expandDetails);

            },

            /*删除弹窗*/
            delButton(root, node, data) {
                // 详情删除
                if (root === 'details') {
                    this.del.show = true;
                    this.del.id = node.id;
                    this.del.data = node;
                } else {
                    // 文件夹删除
                    this.del.show = true;
                    this.del.id = data.cate_id;
                    this.del.data = data;
                }
            },

            /*删除*/
            remove() {
                let url = this.$GLOBALAPI.task_cate_delete;
                let obj = {id: this.del.id};
                //类型删除
                if (this.del.data.rank === 2 || this.isDelete) {
                    url = this.$GLOBALAPI.task_task_typedelete;
                    obj = {id: this.del.data.id};
                    this.isDelete = false;
                }

                /*分类 删除*/
                this.$axios.post(this.GLOBAL.baseRouter + url, obj).then(({data}) => {
                    if (data.err_code === 0) {
                        sessionStorage.removeItem('expandDetails');
                        this.init(null, false);
                        this.$bus.emit('projectInfoClear');
                    } else {
                        this.$Message.error(data.err_message);
                    }
                });
                this.del.show = false;

            },

            /*更改名弹窗*/
            changeName(data) {
                this.changName.show = true;
                this.changName.value = data.name;
                this.changName.id = data.cate_id;
            },

            /*更改名字*/
            async selecText() {
                let {data} = await api.taskCateUpdate({
                    id: this.changName.id,
                    name: this.changName.value
                });

                if (data.err_code === 0) {
                    this.init();
                } else {
                    this.$Message.error(data.err_message);
                }
            },

            /*复制弹窗*/
            copyButton(data) {
                this.copy.show = !this.copy.show;
                this.copy.id = data.id;
            },

            /*复制*/
            copyNode() {
                this.$axios
                    .post(this.GLOBAL.baseRouter + 'newtask/new-task-type/copy-type', {
                        tid: this.copy.id,
                        togid: this.copy.newId
                    })
                    .then(data => {
                    });
                this.copy.show = false;
            },

            /*展开*/
            async showTree(data) {
                // 手风琴 关闭其他的
                this.closeTree(data.rank, data.nodeKey);

                /*分类展开存储id*/
                this.classifyExpand(data);
            },

            /*分类展开*/
            classifyExpand(data) {

//                data.expand = true
                let arrayExpand = sessionStorage.expand ? JSON.parse(sessionStorage.expand) : [];
                let is_add = arrayExpand.every(item => item.rank !== data.rank);
                if (is_add) {
                    // 添加
                    arrayExpand.push({rank: data.rank, expand: data.expand, cate_id: data.cate_id});
                } else {
                    // 修改

                    arrayExpand.map((item, i, array) => {
                        if (data.rank === item.rank) {
                            item.expand = data.expand;
                            item.cate_id = data.cate_id;
                        }
//                        if(data.rank == 0){
//                            arrayExpand = [array[0]]
//                        }
                    });

                }
                this.expandArray = arrayExpand;
                sessionStorage.expand = JSON.stringify(arrayExpand);
            },
            closeTree(rank, nodeKey) {
                if (this.treeMap) {
                    this.treeMap.map((items, index) => {
                        if (items.children) {
                            items.children.map((item, idx) => {
                                if (rank == 0 && item.nodeKey !== nodeKey) {
                                    this.$set(item, 'expand', false);
                                }
                                if (item.children) {
                                    item.children.map((child, i) => {
                                        if (rank == 1 && child.nodeKey !== nodeKey) {
                                            this.$set(child, 'expand', false);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            },

            /*展开分类和子分类具体实现*/
            showExpand(item) {
                this.expandArray.map((expandObj, i) => {
                    if (item.cate_id === expandObj.cate_id) {
                        this.$set(item, 'expand', expandObj.expand);
                    }
                });
            }
        },
        computed: {
            ...mapState({
                defId(data) {
                    return data.typelib.defId;
                }
            })
        },
        components: {
            vUpload
        }
    };
</script>
<style lang="less">
    .typeTree {
        width: 96%;
        height: 90%;
        overflow: auto;
        position: absolute;
        left: 0px;
    }

    .treeMapWindow {
        .ivu-modal-header {
            // border: 1px solid transparent !important;
        }

        .ivu-modal-footer {
            border-top: 1px solid transparent !important;
        }
    }

    .typelibLeftContainer {
        // .base-card;
        position: relative;
        height: 100%;
        min-height: 830px;
        margin-right: 30px;
        margin-bottom:30px;
        overflow-y: hidden;
        .base-card;
        -webkit-flex: 1;
        flex: 1;
        .ivu-tree li ul {
            padding: 0 0 0 6px !important;
        }
        .ivu-tree-arrow {
            position: relative;
            top: -14px;
            left: 5px;
            z-index: 10;
        }
        .addTypelibHeader {
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            height: 32px;
            border-bottom: 1px solid #f2f2f2;
            color: @black_1;
            padding: 0 0 10px 10px;
            a {
                font-size: 12px;
                color: rgb(119, 119, 119);
                &:hover{
                    color: @base;
                }
            }
        }
        .treeMapContainer {
            position: absolute;
            width: 94%;
            height: 95% !important;
            .ivu-tree-children:nth-of-type(1) {
                //  height: 100% !important;
            }
            ul:nth-child(1) > li:nth-child(1) > span:nth-child(1) {
                display: none !important;
            }
            ul li ul li ul {
                margin: 0 0 0 20px;
            }
            .buttonList {
                position: absolute;
                right: 0;

                .ivu-icon-ios-trash-outline{
                    &:hover{
                        color: @red;
                    }
                }
                i {
                    color: #bdbdbd;
                    vertical-align: middle;
                    &:hover{
                        color: @base;
                    }
                }
            }
        }
    }

    .standardListName {
        .buttonList {
            visibility: hidden;
        }
        &:hover {
            .buttonList {
                visibility: visible;
            }
        }
    }
</style>
