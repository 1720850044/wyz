<template>
    <div class="addProjectContainer">
        <div class="addProjectBody" :class="{'editBox':is_edit}">
            <dl style="position: relative;">
                <dd style="display: flex">
                   <span style="flex: 1;display: flex;align-items: center;">
                       <span class="leftSty">{{$t('workbench.work_projectName')}}</span>
                       <div class="rightSty">
                           <Input v-model="proName" @on-blur="infoUpdateProject" style="width: 100%;"
                                  :placeholder="inputProjectName"></Input>
                       </div>
                   </span>
                    <span v-if="companyType != 1" class="deveSwitch"
                          :class="companyType == 1 ? 'deveSwitch' : 'epibolySwitch'"
                          style="width: 70px;padding-left: 10px;">
                        <p style="color: #777;font-size: 12px;">{{switch1 ? cooperationProject : internalProjects}}</p>
                        <i-switch v-model="switch1" :disabled="companyType ? true :false" @on-change="changeContract"
                                  :title="companies"></i-switch>
                    </span>
                </dd>
                <dd v-if="switch1">
                    <span class="leftSty">{{$t('companyProject.com_relatedContracts')}}</span>
                    <div class="rightSty">
                        <!--编辑-->
                        <Select v-model="proCont" clearable @on-change="changeContractVal">
                            <Option v-for="(item,index) in contractList" :value="item.id" :key="index"
                                    v-if="contractShow(item)">
                                {{item.contract_name}} (projectId:{{item.contract_id}})
                            </Option>
                        </Select>


                        <!--注释掉-->
                        <!--<Select v-if="contractList&&proCont !== '0'" clearable  @on-change="changeContractVal"   v-model="proCont">-->
                        <!--<Option v-if="item.status && Number(item.status)>0&&(item.project_id == 0||item.id == proCont)" v-for="(item,index) in contractList"-->
                        <!--:value="item.id" :key="'index1'+index"> {{item.contract_name}}  (编号:{{item.contract_id}})-->
                        <!--</Option>-->
                        <!--</Select>-->

                        <!--<Select v-else-if="proCont === '0'" clearable  @on-change="changeContractVal"   v-model="proCont">-->
                        <!--<Option v-if="item.status && Number(item.status)>0&&(item.project_id == 0||item.id == proCont)" v-for="(item,index) in contractList"-->
                        <!--:value="item.id" :key="'index2'+index"> {{item.contract_name}}  (编号:{{item.contract_id}})-->
                        <!--</Option>-->
                        <!--</Select>-->

                        <!--概况页-->
                        <!--<Select v-else-if="editContList"  @on-change="infoUpdateProject" v-model="proCont" >-->
                        <!--<Option v-if="item.status>0" v-for="(item,index) in editContList" :value="item.id"-->
                        <!--:key="index"> {{item.contract_name}}  (编号:{{item.contract_id}})-->
                        <!--</Option>-->
                        <!--</Select>-->
                    </div>
                </dd>
                <dd>
                    <span class="leftSty ">{{$t('project.pro_projectTime')}}</span>
                    <div class="rightSty projectDate">
                        <DatePicker :options="endDateOptions" split-panels :editable="false" type="daterange"
                                    :placeholder="setProjectTime" @on-change="startTime" :value="DateConat"
                                    style="width: 100%"></DatePicker>
                    </div>
                </dd>
                <dd>
                    <span class="leftSty">{{$t('workbench.work_projectChargeMember')}}</span>
                    <div class="rightSty" style="border: 1px solid transparent;">
                        <!--<Select v-model="MangageVal"  @on-change="infoUpdateProject()">-->
                        <!--<Option v-for="item in manageData" :value="item.id" :key="item.id">{{ item.realname }}-->
                        <!--</Option>-->
                        <!--</Select>-->
                        <drop-select v-if="leaderMemberData&&leaderMemberData.length>0" ref="leaderSelec"
                                     @changeCurrentTab="changeCurrentTab" @searchMemberData="searchMemberData"
                                     type="leader" :selectedHolder="inputProjectLeader" :selectedItem="selectedItem"
                                     :memberData="leaderMemberData"
                                     :departmentData="departmentDataLeader"></drop-select>
                    </div>
                </dd>
                <dd>
                    <span class="leftSty">{{$t('companyProject.com_projectMembers')}}</span>
                    <div class="rightSty">
                        <!--<Select v-model="memberVal" multiple style="width:100%" @on-change="infoUpdateProject()">-->
                        <!--<Option v-for="item in memberList" :value="item.id" :key="item.id">{{ item.realname }}-->
                        <!--</Option>-->
                        <!--</Select>-->
                        <drop-select v-if="memberData&&memberData.length>0" ref="memberSelec" multiple
                                     @changeCurrentTab="changeCurrentTab" @searchMemberData="searchMemberData"
                                     type="member" :selectedHolder="pleaseSelect" :selectedItem="memberItem"
                                     :memberData="memberData" :departmentData="departmentDataMember"></drop-select>

                    </div>
                </dd>
                <dd>
                    <span class="leftSty">{{$t('companyProject.com_resourceSpecification')}}</span>
                    <div class="rightSty">
                        <bby-select ref="bbySelectComTask" :v-model="typeVal" :placeholder="pleaseSelectResources" multiple>
                            <template slot="select1">
                                <Tree class="treeSelect" :data="data5" :render="renderContent"></Tree>
                            </template>
                        </bby-select>
                        <!--<Select v-model="typeVal" multiple   @on-change="infoUpdateProject()" >-->
                        <!--<Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.tasktype_name-->
                        <!--}}-->
                        <!--</Option>-->
                        <!--</Select>-->
                    </div>
                </dd>
                <dd>
                    <span class="leftSty">{{$t('companyProject.com_projectLabel')}}</span>
                    <div class="rightSty">
                        <div style="display: flex;flex-wrap: wrap">
                            <span class="labs" v-for="(item,index) in count" :key="index" :name="item"
                                  @click.stop="Closelabel(index)">
                                {{ item }}
                                <span class="iconfonts icon-cuowu-yuankuang-xianxing fontSty"></span>
                            </span>
                            <div class="addTag" v-if="addLabDIV">
                                <Input v-model="LabelVal" :placeholder="pleaseLabel" style="width: 100px;"
                                       @keyup.13.native="submitLabel($event)" autofocus></Input>
                                <button class="addBtn" @click.stop="submitLabel">{{$t('lang.lang_add')}}</button>
                                <button class="CancelBtn" @click.stop="closeAddDIV">{{$t('lang.lang_cancel')}}</button>
                            </div>
                            <button class="addProjectCharge" @click="Addlabel" v-else>{{$t('companyProject.com_addLabel')}}</button>
                        </div>
                    </div>
                </dd>
                <!--<dd>-->
                <!--<span class="leftSty">项目图片</span>-->
                <!--<div class="rightSty ImaUpload">-->
                <!--<div v-if="uploadList" class="demo-upload-list">-->
                <!--<img :src="uploadList">-->
                <!--<div v-if="uploadList" class="demo-upload-list-cover">-->
                <!--<Icon type="ios-trash-outline" @click.native="handleRemove" size="30"></Icon>-->
                <!--</div>-->
                <!--</div>-->

                <!--<file-upload class="uploadSty" v-else-->
                <!--v-on:FileUploadedSuccess="FileUploadedSuccess"></file-upload>-->
                <!--</div>-->
                <!--</dd>-->
                <!--<div class="ImaUpload">-->
                <!--<div v-if="uploadList" class="demo-upload-list" >-->
                <!--<img :src="uploadList">-->
                <!--<div v-if="uploadList" class="demo-upload-list-cover">-->
                <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)" size="30"></Icon>-->
                <!--</div>-->
                <!--</div>-->

                <!--<file-upload v-else v-on:FileUploadedSuccess="FileUploadedSuccess">-->
                <!--&lt;!&ndash;<template slot="upload">&ndash;&gt;-->
                <!--&lt;!&ndash;<button id="browse" class="browse">选择文件</button>&ndash;&gt;-->
                <!--&lt;!&ndash;<p class="button">选择文件</p>&ndash;&gt;-->
                <!--&lt;!&ndash;</template>&ndash;&gt;-->
                <!--</file-upload>-->
                <!--</div>-->
                <dd>
                    <span class="leftSty">{{$t('companyProject.com_projectStatus')}}</span>
                    <div class="rightSty">
                        <Select v-model="state" @on-change="chanState">
                            <!--<Option v-for="(item,index) in statusList" :value="item.value" :key="index"> {{item.lable}}</Option>-->
                            <Option :value="1" :key="0" :label="conducting"> {{$t('workbench.work_conducting')}} <span style="color: #8a8a8a">{{$t('companyProject.com_projectPreStatus')}}</span>
                            </Option>
                            <Option :value="2" :key="1" :label="pause"> {{$t('lang.lang_pause')}} <span
                                style="color: #8a8a8a">{{$t('companyProject.com_noticeTeam')}}</span></Option>
                            <Option :value="4" :key="2" :label="stop"> {{$t('companyProject.com_stop')}} <span
                                style="color: #8a8a8a">{{$t('companyProject.com_noticeTeamStop')}}</span></Option>
                            <!--<Option  :value="3" :key="3" label="已完成" :disabled="!taskOver"> 已完成 <span style="color: #8a8a8a">（项目任务未完，无法选择）</span></Option>-->
                            <Option :value="3" :key="3" :label="complete"> {{$t('workbench.work_complete')}}</Option>

                        </Select>
                    </div>
                </dd>
                <!--<dd >-->
                <!--<span class="leftSty">状态</span>-->
                <!--<div class="rightSty">-->
                <!--<i-switch size="large" v-model="state" @on-change="chanState">-->
                <!--<span slot="open">开启</span>-->
                <!--<span slot="close">暂停</span>-->
                <!--</i-switch>-->
                <!--</div>-->
                <!--</dd>-->
            </dl>
        </div>
    </div>
</template>
<script>
    import api from 'api';
    import fileUpload from '@/components/upload';
    import Cookies from 'js-cookie';
    import BbySelect from "../../../components/bbySelect";
    import DropSelect from "../../../components/dropSelection/dropSelect";

    export default {
        props: {

            contractList: {  //合同列表
                type: Array,
                default: [],
            },
            is_edit: {  //是项目页还是概况页
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                inputProjectName: i18n.t('companyProject.com_inputProjectName'),
                complete: i18n.t('workbench.work_complete'),
                stop: i18n.t('companyProject.com_stop'),
                pause: i18n.t('lang.lang_pause'),
                conducting: i18n.t('workbench.work_conducting'),
                pleaseLabel: i18n.t('companyProject.com_pleaseLabel'),
                pleaseSelectResources: i18n.t('companyProject.com_pleaseSelectResources'),
                pleaseSelect: i18n.t('companyProject.com_pleaseSelect'),
                inputProjectLeader: i18n.t('companyProject.com_inputProjectLeader'),
                setProjectTime: i18n.t('companyProject.com_setProjectTime'),
                projectId: i18n.t('companyProject.com_projectId'),
                cooperationProject: i18n.t('companyProject.com_cooperationProject'),
                internalProjects: i18n.t('companyProject.com_internalProjects'),
                companies: i18n.t('companyProject.com_companies'),
                memberAbility: null,
                memberDefault: null,
                selectedItem: [],
                memberItem: [],
                leaderMemberData: [],
                memberData: [],
                departmentDataLeader: [],
                departmentDataMember: [],
                addTask: [],
                removeTaskType: [],
                data5: [
                    {
                        title: 'parent 1',
                        expand: true,
                        render: (h, {root, node, data}) => h('span', {
                            style: {
                                display: 'inline-block',
                                width: '80%'
                            }
                        }, [
                            h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-folder-outline'
                                    },
                                    style: {
                                        marginRight: '8px'
                                    }
                                }),
                                h('span', data.title)
                            ]),
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    float: 'right',
                                    marginRight: '32px'
                                }
                            })
                        ]),
                        children: []
                    }
                ],
                originalVal: [],
                memberVal: [],
                memberList: [],
                typeVal: [],
                typeAddArray: [],
                typeDeleArray: [],
                typeList: [],
                taskTypeShow: false,
                project_tasktype: [],
                switch1: true,
                cityList: [],
                model10: [],
                project_id: sessionStorage.getItem('projectID'),
                Pid: 0,
                proCont: '',
                // ContList:[],
                editContList: null,
                proName: '',
                startDate: '',
                endDate: '',
                DateConat: [],
                count: [],
                manageCount: [],
                state: 1,
                uploadList: null,
                url: [],
                LabelVal: '',
                MangageVal: '',
                addLabDIV: false,
                addManageDIV: false,
                manageData: [],
                projectTitle: i18n.t('companyProject.com_foundProject'),
                companyType: JSON.parse(Cookies.get('company')).type,
                endDateOptions: {
                    disabledDate(date) {
//                    return date && date.valueOf() < Date.now() - 86400000;
                    }
                },

                //0.9.1
                taskOver: true
            };
        },
        beforecreate() {
            this.$bus.off();
        },
        computed: {
            fileup() {
                return this.$store.state.paySkip.fileUpload;
            },
        },
        methods: {
            async getNewTaskMemberList(type) {
                let {data} = await api.newTaskMemberList({type: type});
                if (data.err_code === 0 && data.data) {
                    data.data.map((items, index) => {
                        items.title = items.name;
                        items.children = items.child;
                        this.$set(items, 'selected', false);
                        if (items.children) {
                            items.children.map((item, idx) => {
                                item.title = item.realname;
                                item.url = this.GLOBAL.imgDomain + '/index.php?r=system/user/get-headimage&id=' + item.user_id;
                                this.$set(item, 'selected', false);
                            });
                        }
                    });

                    if (type === 'pinyin') {
                        this.memberDefault = data.data;
                        this.memberData = JSON.parse(JSON.stringify(data.data));
                        this.leaderMemberData = JSON.parse(JSON.stringify(data.data));
                    } else if (type === 'ability') {
                        this.memberAbility = data.data;
                    }
                }
            },
            async getNewTaskMemberTree() {
                let {data} = await api.newTaskMemberList({type: 'department'});
                if (data.err_code === 0 && data.data) {
                    this.recursionTree(data.data, 0);
                    this.departmentDataLeader = data.data;
                    this.departmentDataMember = data.data;
                }
            },
            recursionTree(treeData, rank) {
                if (treeData) {
                    treeData.map((items, index) => {
                        items.title = items.name || items.realname;
                        items.children = items.child;
                        items.rank = rank;
                        this.$set(items, 'expand', false);
                        if (rank === 1) {
                            items.url = this.GLOBAL.imgDomain + '/index.php?r=system/user/get-headimage&id=' + items.user_id;
                        }
                        this.recursionTree(items.children, rank + 1);
                    });
                }
            },
            async changeCurrentTab({index, type}) {
                if (index == 0) {
                    if (type === 'leader') {
                        this.leaderMemberData = JSON.parse(JSON.stringify(this.memberDefault));
                    } else if (type === 'member') {
                        this.memberData = JSON.parse(JSON.stringify(this.memberDefault));
                    }
                } else if (index == 2) {
                    if (type === 'leader') {
                        this.leaderMemberData = JSON.parse(JSON.stringify(this.memberAbility));
                    } else if (type === 'member') {
                        this.memberData = JSON.parse(JSON.stringify(this.memberAbility));
                    }
                }

            },
            async searchMemberData({type, word}) {

                let {data} = await api.newTaskMemberList({search: word});
                if (data.err_code === 0 && data.data) {
                    data.data.map((item) => {
                        item.title = item.realname;
                        item.url = this.GLOBAL.imgDomain + '/index.php?r=system/user/get-headimage&id=' + item.user_id;
                    });
                    if (type === 'leader') {
                        this.$refs.leaderSelec.searchResult = data.data;
                    } else if (type === 'member') {
                        this.$refs.memberSelec.searchResult = data.data;
                    }

                }
            },

            async getComTaskType() {
                let {data} = await api.taskCateList();
                if (data.err_code === 0 && data.data) {
                    data.data.map((items, index) => {
                        items.title = items.name;
                        items.rank = 0;
                        if (items.children) {
                            items.children.map((children, idx) => {
                                children.title = children.name;
                                children.rank = 1;
                                if (children.tasktype) {
                                    children.children = children.tasktype;
                                    children.children.map((cld, i) => {
                                        cld.title = cld.tasktype_name;
                                        cld.rank = 2;
                                        this.typeVal.map((type) => {
                                            if (type.id === cld.id) {
                                                this.$set(cld, 'active', true);
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                    this.$nextTick(() => {
                        this.data5[0].children = data.data;
                    });
                }
            },
            renderContent(h, {root, node, data}) {
                return h('span', {
                    class: data.active ? 'treeComActive' : '',
                    style: {
                        display: 'inline-block',
                        alignItems: 'center',
                        width: '80%',
                        height: '32px',
                        lineHeight: '32px',
                        paddingLeft: '5px',
                    },
                    on: {
                        click: () => {
                            if (data.tasktype_name) {
                                this.$set(data, 'active', !data.active);
                                this.selectProjectVal(data);
                            }
                        }
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: (data.rank === 0 || data.rank === 1) ? 'ios-folder-outline' : 'ios-paper-outline',
                            },
                            style: {
                                marginRight: '8px',
                                fontSize: '14px',
                                verticalAlign: 'text-bottom',
                            },

                        }),
                        h('span', data.title, {})
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        },
                    }, )
                ]);
            },
            selectProjectVal(item, index) {
                let is_delete = this.typeVal.some((type) => type.id === item.id);
                if (is_delete) {
                    let index = this.typeVal.findIndex((type) => type.id === item.id);
                    let tasktype_id = this.typeVal[index].tasktype_id;
                    if (tasktype_id) {
                        this.removeTaskType.push(tasktype_id);
                        this.typeVal.splice(index, 1);
                    } else {
                        this.addTask.splice(index, 1);
                        this.typeVal.splice(index, 1);
                    }
                } else {
                    this.typeVal.push({id: item.id, tasktype_name: item.tasktype_name});
                    this.addTask.push({id: item.id, tasktype_name: item.tasktype_name});
                }
                // this.$set(this.taskInfos,'tasktype_name',item.tasktype_name)
                // this.$refs.bbySelectComTask.selectShow = false
                this.infoUpdateProject();
            },

            /* 保存数据 */
            async infoUpdateProject() {
                if (!this.is_edit) {
                    return;
                }
                let addArray = this.arrayContrast(this.typeVal, this.originalVal);
                let removeArray = this.arrayContrast(this.originalVal, this.typeVal, true);
                // let member = this.memberItem?this.memberItem.map((itme) => {
                //     return item.user_id
                // }):[]
                let objForm = {
                    id: this.Pid, //项目id
                    name: this.proName, //项目名称
                    start_time: this.startDate, //开始时间
                    end_time: this.endDate, //结束时间
                    tag: this.count.toString(), //标签
                    leader: this.selectedItem[0].user_id, //负责人ID
                    picture: this.uploadList, //图片地址
                    status: Number(this.state),
                    // status: Number(this.state) == 1 ? 1 : 2,//状态 1正常,2暂停
                    member: member.join(','),
                    tasktype: addArray.join(','),
                    delete_tasktype: removeArray.join(','),
                    contract: this.proCont,
                };
                let {data} = await api.taskProjectUpdate(objForm);
                if (data.err_code === 0) {
                    this.$store.dispatch('createNav');
                    // this.typeVal = []
                    // this.originalVal = []
//                this.project_tasktype=[];
                    this.typeAddArray = [];
                    this.typeDeleArray = [];
                    this.delete_tasktype = [];
//                this.getProjectInfo()
//                this.$bus.emit("submitOk");
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            // 概况
            async getProjectInfo() {
                if (!this.is_edit) {
                    return;
                }
                let {data} = await api.getProjectInfo({id: this.project_id});
                if (data.err_code === 0) {
                    this.DateConat = [data.start_time, data.end_time];
                    this.Pid = data.id;
                    this.proCont = data.contract;
                    this.proName = data.name;
                    this.startDate = data.start_time;
                    this.endDate = data.end_time;
                    this.count = data.tag == '' ? [] : data.tag.split(',');
                    this.uploadList = data.picture;
                    this.state = Number(data.status);
                    this.taskOver = data.task_over;
                    // this.state = data.status == 2 ? false : true;
                    this.MangageVal = this.selectedItem[0].id;
                    this.projectTitle = i18n.t('companyProject.com_editProject');
                    this.manageCount = [];
                    this.manageCount.push({name: data.leader_name});
                    this.memberVal = data.member.map((item, index) => item.id);

                    // this.typeVal = data.project_tasktype.map((item, index) => {
                    //     return item.id
                    // })
                    // this.originalVal = data.project_tasktype.map((item, index) => {
                    //     return item
                    // })
                    this.typeVal = data.project_tasktype;

                }
            },
            async getTaskTypeList() {
                let {data} = await api.getTaskTypeList();
                if (data.err_code === 0 && data.data) {
                    this.typeList = data.data;
                }
            },

            async getMemberList() {
                let {data} = await api.getMemberList();
                if (data.err_code === 0 && data.data) {
                    this.memberList = data.data;
                }
            },
            // 编辑标签
            editTtag(item) {
                this.MangageVal = item;
                this.addManageDIV = true;
                this.manageCount.splice(0, 1);
            },
            startTime(date) {
                this.DateConat = [date[0], date[1]];
                this.startDate = date[0];
                this.endDate = date[1];
                this.EmitData();

                this.infoUpdateProject();
                this.$emit('changeTimeLine', {startTime: date[0], endTime: date[1]});
            },

            contractShow(item){
                return item.id === this.proCont || ( item.project_id == '0' && item.status != '999');
            },

            // 添加标签
            Addlabel() {
                this.addLabDIV = true;
                this.LabelVal = '';
            },
            // 添加资源
            addTaskType() {
                this.taskTypeShow = true;
                this.typeVal = '';
            },
            submitLabel() {
                if (this.LabelVal == '') {
                    this.$Message.error(i18n.t('resources.res_notNull'));

                } else {
                    this.count.push(this.LabelVal);
                    this.addLabDIV = false;
                    this.infoUpdateProject();
                }
            },
            closeAddDIV() {
                this.addLabDIV = false;
            },
            // 删除标签
            Closelabel(index) {
                this.count.splice(index, 1);
            },

            closeTaskType() {
                this.taskTypeShow = false;
            },

            // 添加经理
            AddManage() {
                this.addManageDIV = true;
                this.MangageVal = '';
            },
            submitManage() {
                if (this.MangageVal == '') {
                    this.$Message.error(i18n.t('resources.res_notNull'));

                } else {
                    let MListObj = {};
                    this.manageData.forEach(val => {
                        if (val.id == this.MangageVal) {
                            MListObj.name = val.realname;
                        }
                    });
                    this.manageCount.push(MListObj);
                    this.addManageDIV = false;
                    this.infoUpdateProject();
                }
            },
            closeManageDIV() {
                this.addManageDIV = false;
            },
            // 删除经理
            CloseManage(event, name) {
                const index = this.manageCount.indexOf(name);
                this.manageCount.splice(index, 1);
            },
            // 状态改变
            chanState() {
//          this.state=!this.state
                this.infoUpdateProject();
            },
            // 图片删除
            handleRemove(file) {
                this.uploadList = null;
            },

            handleFormatError(file) {
                this.$Notice.warning({
                    title: i18n.t('companyProject.com_fileFormat'),
                    desc: i18n.t('companyProject.com_file') + file.name + i18n.t('companyProject.com_notFormat')
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: i18n.t('companyProject.com_fileSize'), 
                    desc: i18n.t('companyProject.com_fileName') + file.name + i18n.t('companyProject.com_tooBig') 
                });
            },
            handleBeforeUpload(file) {
                this.url = window.URL.createObjectURL(file);
            },
            // 获取公司合同和管理人员列表
            getManage() {
                let _this = this;
                // let url=_this.GLOBAL.baseRouter+'task/project/get-contract-list&company_id='+1;
                let manageURL = _this.GLOBAL.baseRouter + this.$GLOBALAPI.task_get_company_member;
                // _this.$axios.get(url).then(msgData=>{
                //      _this.ContList=msgData.data.data;
                // });
                _this.$axios.get(manageURL).then(ManageData => {
                    _this.manageData = ManageData.data.data;
                });
            },
            // 发送数据
            EmitData() {

                let addArray = this.arrayContrast(this.typeVal, this.originalVal);
                let removeArray = this.arrayContrast(this.originalVal, this.typeVal, true);
                let member = this.memberItem ? this.memberItem.map((item) => item.id) : [];
                let obj = {};
                let addTask = this.addTask ? this.addTask.map((item) => item.id) : [];
                obj.proName = this.proName;
                obj.startDate = this.startDate;
                obj.endDate = this.endDate;
                obj.count = this.count;

                obj.manageCount = this.selectedItem[0] ? this.selectedItem[0].user_id : 0;
                obj.state = Number(this.state);
                // obj.state = Number(this.state) == 1 ? 1 : 2;
                obj.uploadurl = this.uploadList;
                obj.Pid = this.Pid;
                obj.contract = this.switch1 ? this.proCont : '0';
                obj.member = member.join(',');
                // obj.tasktype = addArray.join(',');// 公司类型库
                obj.tasktype = addTask.join(',');// 公司类型库
                obj.delete_tasktype = this.removeTaskType.join(','); //项目类型库
                this.$bus.emit("AddProInfo", obj);

            },
            // 对比资源类型数组  获取筛选之后的参数1  ( [1,2,3] , [2]) => [1,3]
            arrayContrast(data, condition, type) {
                let array = [];
                data.map((items) => {
                    let isAdd = true;
                    condition.map((item) => {
                        if (type && (items.id === item)) {
                            isAdd = false;
                        } else if (!type && (items === item.id)) {
                            isAdd = false;
                        }
                    });
                    if (isAdd && type) {
                        array.push(items.tasktype_id);
                    } else if (isAdd) {
                        array.push(items);
                    }
                });
                return array;
            },
            FileUploadedSuccess(data) {
                this.uploadList = JSON.parse(data.response).file_url;
                this.infoUpdateProject();
            },

            changeContract(val) {
                this.$emit('changeContract');
                if (this.proCont && this.proCont != '0' && val) {
                    this.changeContractVal(this.proCont);
                }
            },
            changeContractVal(val) {
                if (val && val !== '0') {
                    this.$emit('changeContractVal', val);
                    const data = this.contractList.find(item => item.id === val);
                    if (this.proName === '') {
                        this.proName = data ? data.contract_name : '';
                    }
                } else {
                    this.$emit('changeContractVal', val);
                }
            },
            clearComTaskType () {
                this.data5[0].children.map((items, index) => {
                    items.title = items.name;
                    items.rank = 0;
                    if (items.children) {
                        items.children.map((children, idx) => {
                            children.title = children.name;
                            children.rank = 1;
                            if (children.tasktype) {
                                children.children = children.tasktype;
                                children.children.map((cld, i) => {
                                    cld.title = cld.tasktype_name;
                                    cld.rank = 2;
                                    this.$set(cld, 'active', false);
                                });
                            }
                        });
                    }
                });
            },
            clearInfo() {
                this.DateConat = [];
                this.uploadList = null;
                this.proCont = "";
                this.proName = "";
                this.startDate = "";
                this.endDate = "";
                this.count = [];
                this.state = 1;
                this.manageCount = [];
                this.memberVal = [];
                this.typeVal = [];
                this.addTask = [];
                this.project_tasktype = [];
                this.typeAddArray = [];
                this.typeDeleArray = [];
                this.selectedItem = [];
                this.memberItem = [];
                this.switch1 = false;

                this.clearComTaskType(this.departmentData);
                if (this.departmentDataLeader) {
                    this.departmentDataLeader.map((items, index) => {
                        if (items.children) {
                            items.children.map((item) => {
                                item.selected = false;
                            });
                        }
                    });
                }
                if (this.memberData) {
                    this.memberData.map((items, index) => {
                        if (items.children) {
                            items.children.map((item) => {
                                item.selected = false;
                            });
                        }
                    });
                }
                if (this.leaderMemberData) {
                    this.leaderMemberData.map((items, index) => {
                        if (items.children) {
                            items.children.map((item) => {
                                item.selected = false;
                            });
                        }
                    });
                }
            },
        },
        mounted() {
            this.getNewTaskMemberList('pinyin');
            this.getNewTaskMemberList('ability');
            this.getNewTaskMemberTree();
            this.getTaskTypeList();
            this.getMemberList();
            this.getManage();
            this.getProjectInfo();

            this.$bus.on("submitOk", () => {
                this.clearInfo();
            });

            // 项目列表
            this.$bus.on("EditProData", (val) => {
                this.DateConat = [val.start_time, val.end_time];
                this.Pid = val.id;
                this.proCont = val.contract ? val.contract : '';
                this.proName = val.name;
                this.startDate = val.start_time;
                this.endDate = val.end_time;
                this.count = val.tag == '' ? [] : val.tag.split(',');
                this.uploadList = val.picture;
                this.state = Number(val.status);
                this.taskOver = Boolean(val.task_over);
                // this.state = val.status == 2 ? false : true;
                this.MangageVal = val.leader;
                this.selectedItem = [{title: val.leader_name, user_id: val.leader, id: val.leader}];

                this.projectTitle = i18n.t('companyProject.com_editProject');
                this.manageCount = [{title: val.leader_name, user_id: val.leader, id: val.leader}];

                this.memberVal = val.member.map((item, index) => item.id);
                this.typeVal = val.project_tasktype;
                if (val.member) {
                    val.member.map((item) => {
                        item.title = item.realname;
                        item.selected = true;
                    });
                }
                this.memberItem = val.member;

                this.originalVal = val.project_tasktype.map((item, index) => item);
                this.switch1 = this.proCont !== '0';
                this.getComTaskType();
                if (!this.switch1) {
                    this.changeContract();
                }
            });
            this.getComTaskType();
        },
        updated() {
            this.EmitData();
        },
        components: {
            DropSelect,
            BbySelect,
            fileUpload
        },

    };
</script>

<style lang="less">

    .addProjectContainer {
        max-width: 650px;

        .editBox {
            margin: 30px 0 0 50px;
        }
        .addProjectBody {
            height: 500px;
            padding-right: 20px;
            margin-top: 15px;
            overflow-y: auto;
            .treeSelect {
                position: absolute;
                top: -30px;
                left: 0;
                width: 100%;
                font-size: 200px !important;
                .treeComActive {
                    color: @white;
                    background: @base;
                }
            }
            .ivu-tag {
                background: #e2faf6;
                border-color: #e2faf6;
                .ivu-tag-text {
                    color: @base;
                }
            }
            .projectDate {
                .ivu-icon-ios-calendar-outline, .ivu-icon-ios-close {
                    margin: 1px 1px 0 0;
                }
            }
            .deveSwitch {
                .ivu-switch-checked {
                    border-color: @blue !important;
                    background: @blue !important;
                }
                .ivu-switch {
                    border-color: @base;
                    background: @base;
                }
            }
            .epibolySwitch {
                .ivu-switch-checked {
                    border-color: @base !important;
                    background: @base !important;
                }
                .ivu-switch {

                    border-color: @blue;
                    background: @blue;
                }
            }
            dt {
                line-height: 30px;
                height: 30px;
                font-weight: bold;
                font-size: 12px;
                margin-bottom: 15px;
                span {
                    font-weight: normal;
                    margin-left: 5px;
                    color: #888;
                }
            }
            dd {
                margin-bottom: 25px;
                display: flex;
                align-items: center;
                .ivu-input {
                    height: 34px;
                    line-height: 34px;
                }
                .ivu-switch-checked {
                    background: @base;
                    border-color: @base;
                }
                .addLabel {
                    display: flex;
                    align-items: center;
                    //width:215px;
                    //height: 95px;
                    //border: 1px dashed @gray;
                    //padding: 5px 0 5px 5px;
                    border-radius: 3px;
                    position: absolute;
                    top: -3px;
                    //left: 80px;
                    background: @white;
                }
                .addTag {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    line-height: 40px;
                }
                .leftSty {
                    width: 80px;
                    display: inline-block;
                    text-align: right;
                    color: @black_3;
                    font-size: 12px
                }
                .rightSty {
                    position: relative;
                    width: 100%;
                    margin-left: 20px;
                    display: flex;
                    // border: 1px solid #eef1f2;
                    //   position: relative;
                    .ivu-icon-ios-close {
                        z-index: 666;
                        background: @white;
                    }
                    .addProjectCharge {
                        cursor: pointer;
                        background: @white;
                        outline: none;
                        border: 1px dashed @gray;
                        color: @black_2;
                        height: 40px;
                        width: 100px;
                        /*padding: 0 10px;*/
                        border-radius: 4px;
                        font-size: 12px;
                    }
                    .addProjectCharge:hover {
                        border-color: @base
                    }
                    .ivu-select-selection .ivu-select-input {
                        font-size: 13px;
                        color: @black_2 !important;
                        height: 36px !important;
                        line-height: 36px
                    }
                    /*.ivu-input-wrapper{margin-bottom: 10px;}*/
                    .ivu-input-wrapper .ivu-input {
                        font-size: 13px;
                        color: @black_2 !important;
                    }
                    .labs {
                        position: relative;
                        display: inline-block;
                        background: #c8f9f3;
                        color: #7e8080;
                        border-radius: 4px;
                        height: 40px;
                        line-height: 40px;
                        padding: 0 10px;
                        text-align: center;
                        margin-right: 10px;
                        margin-bottom: 10px;
                        &:hover {
                            cursor: pointer;
                            background: @base;
                            color: #fff;
                        }
                        .fontSty {
                            position: absolute;
                            top: 2px;
                            right: 2px;
                            font-size: 12px;
                            display: none;
                        }
                        &:hover .fontSty {
                            display: block;
                        }
                    }
                    .addLabel, .addTag {
                        //.ivu-select{margin-bottom: 10px;}
                        button {
                            border: 0;
                            color: @white;
                            padding: 0 10px;
                            border-radius: 3px;
                            outline: none;
                            height: 40px;
                            cursor: pointer;
                            width: 50px;
                        }
                        .addBtn {
                            background: @base;
                            margin: 0 10px;
                        }
                        .CancelBtn {
                            background: #f7f7f7;;
                            color: @black_2
                        }
                    }
                    .ivu-btn-dashed {
                        &:hover {
                            border: 1px dashed @base
                        }
                    }
                    .uploadSty {
                        border: 1px solid #e1e1e1;
                        border-radius: 3px
                    }
                }
                &:last-child {
                    margin-bottom: 0;
                }
            }
            .ImaUpload {
                width: 220px;
                height: 130px;
                display: block;
                overflow: hidden;
                .demo-upload-list {
                    height: 130px;
                    width: 218px;
                    display: block;
                    text-align: center;
                    line-height: 90px;
                    border: 1px solid #e1e1e1;
                    border-radius: 3px;
                    overflow: hidden;
                    background: @white;
                    position: absolute;
                    z-index: 11;
                    box-shadow: 0 1px 1px rgba(0, 0, 0, 0);
                    border-radius: 4px;
                    &:hover {
                        .demo-upload-list-cover {
                            display: block;
                        }
                    }
                    img {
                        width: 100%;
                        height: 100%
                    }
                }
            }
        }
        .ivu-select-selection:hover {
            border-color: @base
        }
        .ivu-input:hover {
            border-color: @base
        }
        .uploadContainer {
            margin-top: 0;
            height: 100%;
            button, .button {
                width: 100% !important;
                height: 100% !important;
                line-height: 130px;
                color: #ccc;
                border: 1px dashed #ccc;
                background: @white;
            }
            &:hover {
                .button {
                    cursor: pointer;
                    border: 1px dashed @base;
                }
            }
        }
        .MainFile {
            .demo-upload-list {
                img {
                    width: 100%;
                    height: 90px;
                }
                &:hover {
                    .demo-upload-list-cover {
                        display: block;
                    }
                }
            }
        }
        .demo-upload-list-cover {

            padding-top: 13%;
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, .6);
            i {
                color: @white;
                font-size: 20px;
                cursor: pointer;
                margin: 0 2px;
            }
        }
    }
</style>
