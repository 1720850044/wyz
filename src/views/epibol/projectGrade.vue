<template>
    <div class="projectManage">
        <main-native>
            <div class="main-haeder-style">
                <ul class="setMenuList">
                    <li v-for="(item,index) in tabsInfo.tabs" :class="{'checked':index == tabsInfo.tabIndex}"
                        @click="tabsInfo.tabIndex = index">
                        {{item}}
                        <div></div>
                    </li>
                </ul>
            </div>
            <!--<div class="main-header-style" v-else><span class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>-->
        </main-native>

        <project-score></project-score>


    </div>
</template>
<script>
    import {mapState} from "vuex";
    import Cookies from "js-cookie";
    import api from "api";
    import date from "date";
    import AddProbox from "./projectManage/addProject.vue";
    import projectList from "./projectManage/projectList";
    import projectChart from "./projectManage/projectChart";
    import mainNative from "../main-components/mainNative.vue";
    import AccordionCollapse from "../../components/accordionCollapse.vue";
    import Timeline from "../../components/timeline.vue";
    import ProjectScore from "./projectManage/projectScore";
    import projectInvite from "./projectManage/projectInvite"; // 0.9.1 项目邀请

    export default {
        data() {
            return {
                shrinkModalShow: true,
                modalWidth: 1150,
                needGuideData: false,
                timeLineStyle: {
                    dateHeight: 20,
                    dateWidth: 10,
                    listHeight: 25
                },
                height: null,
                projectTimeLine: null,
                startEndTime: null,
                projectDate: null,
                contractList: null,
                sortList: [
                    {label: "创建时间", action: "setUp", Cindex: 1},
                    {label: "剩余天数", action: "remDay", Cindex: 0},
                    {label: "项目进度", action: "proSch", Cindex: 0}
                ],
                setUp: 1,
                remDay: 0,
                proSch: 0,
                stateList: [
                    {value: 0, label: "不限"},
                    {value: 1, label: "进行中"},
                    {value: 2, label: "暂停"},
                    {value: 3, label: "已完成"}
                ],
                MSelect: 0,
                pactList: [
                    {value: 0, label: "不限"},
                    {value: 1, label: "有"},
                    {value: 2, label: "无"}
                ],
                PSelect: 0,
                modelSelet: "",
                search: "",
                SLindex: 0,
                modal: false,
                AddPorData: null,
                MsgData: [],
                Prostatus: "",
                remIconUp: true,
                remIconDown: false,
                comFlag: true,
                projectTitle: "新建项目",
                ContList: [],
                btnStatus: false,
                companyType: JSON.parse(Cookies.get("company")).type,

                /*0.9.1*/
                tabsInfo: {
                    tabs: ["项目", "项目评分", "项目邀请"],
                    tabIndex: 0
                }
            };
        },
        components: {
            ProjectScore,
            Timeline,
            AccordionCollapse,
            AddProbox: AddProbox,
            projectList: projectList,
            projectChart: projectChart,
            mainNative: mainNative,
            projectInvite
        },
        beforeCreate() {
            this.$bus.$off("editProjectInfo");
        },

        mounted() {
            this.$bus.on("AddProInfo", val => {
                this.AddPorData = val;
            });
            this.$bus.on("editProjectInfo", val => {
                //          this.editPro(val);
                this.getProjectInfo(val);
            });
            this.$bus.on("delProjectFun", val => {
                //          this.getCont();
            });
            // this.getData();
            this.getContractList();

            // this.getProjectSchedule()
            this.initGuide();

            this.getRouterBid();
        },
        methods: {
            // 初始化获取是否引导
            async initGuide() {
                let {data} = await api.companyProjectIndex();
                const elementArray = [
                    {
                        element: document.querySelector(".project-guide-create"),
                        intro: this.$lau.guide_words.k31,
                        position: "right",
                        disableInteraction: "1",
                        start: "1",
                        total: "3"
                    },
                    {
                        element: document.querySelector(".project-guide-model"),
                        intro: this.$lau.guide_words.k32,
                        position: "bottom-left-aligned",
                        disableInteraction: "1",
                        start: "2",
                        total: "3"
                    },
                    {
                        element: document.querySelector(".project-guide-list"),
                        intro: this.$lau.guide_words.k33,
                        position: "right",
                        disableInteraction: "1",
                        total: "3"
                    }
                ];
                if (data.err_code === 0) {
                    if (data.guide === "createProject") {
                        this.needGuideData = true;
                    }
                    await this.getProjectSchedule();
                    await this.getData();
                    if (data.guide === "createProject") {
                        this.introGuide(data);
                    }
                }
            },

            async addProjectGuide() {
                let {data} = await api.getAddProjectGuide();
                if (data.err_code === 0 && data.guide === "addProject") {
                    this.bubble();
                }
            },
            // 具体流程操作
            introGuide(data) {
                setTimeout(() => {
                    this.$guide()
                        .setOptions(this.$CONSTANT.guideOptions)
                        .addSteps(elementArray)
                        .start()
                        .onchange(({dataset}) => {
                            this.modal = true;
                            this.$nextTick(() => {
                                this.$guide().exit();
                            });
                        })
                        .onafterchange(({dataset}) => {
                            setTimeout(() => {
                                this.$nextTick(() => {
                                    $("#projectScheduleModal .ivu-modal-wrap").removeClass(
                                        "introjs-fixParent"
                                    );
                                });
                                this.$guide()
                                    .setOptions(
                                        Object.assign({}, this.$CONSTANT.guideOptions, {
                                            overlayOpacity: 0
                                        }),
                                        this.$CONSTANT.guideOptions
                                    )
                                    .addSteps(elementArray)
                                    .goToStepNumber(2)
                                    .start()
                                    .onchange(() => {
                                        this.modal = false;
                                        this.$nextTick(() => {
                                            this.$guide().exit();
                                            this.$guide()
                                                .setOptions(this.$CONSTANT.guideOptions)
                                                .start()
                                                .oncomplete(() => {
                                                    this.needGuideData = "";
                                                    this.initGuide();
                                                })
                                                .onskip(() => {
                                                    this.needGuideData = "";
                                                    this.initGuide();
                                                });
                                        });
                                    })
                                    .onskip(() => {
                                        // this.modal = false;
                                        this.needGuideData = "";
                                        this.addProjectGuide();
                                        this.initGuide();
                                    });
                                $(".introjs-helperLayer").css(
                                    "background-color",
                                    "rgba(255, 255, 255, 0)"
                                );
                            }, 300);
                        })
                        .onskip(() => {
                            this.needGuideData = "";
                            this.initGuide();
                        });
                });
            },
            // 气泡引导逻辑
            bubble() {
                let text = this.$lau.bubble.newProjectGuide;
                this.$nextTick(() => {
                    let guideOptions = [
                        {
                            id: "newTaskContract", // 之前的id有点不对 我这里修改了
                            position: "top",
                            title: text[0].title,
                            content: text[0].content,
                            relative: "body"
                        },
                        {
                            id: "ProjectScheduleGuide",
                            position: "top",
                            title: text[1].title,
                            content: text[1].content,
                            relative: "body"
                        }
                    ];
                    let fn = ({id}) => {
                        if (id === "ProjectScheduleGuide") {
                            this.needGuideData = false;
                            this.getContractList();
                        }
                    };
                    setTimeout(() => {
                        this.$bubble(guideOptions, fn);
                    }, 200);
                });
            },
            async getContractList() {
                let objform = {
                    page_size: 999,
                    company_id: this.companyID.company_id,
                    needGuideData: this.needGuideData ? true : null
                };

                let {data} = await api.contractList(objform);
                if (data.err_code === 0 && data.data) {
                    this.contractList = data.data;
                    this.contractList.map((item, index) => {
                        this.$set(item, "date", `${item.start_time}~${item.end_time}`);
                    });
                }
            },
            async getProjectSchedule() {
                return new Promise(async (resolve, reject) => {
                    let {data} = await api.getProjectSchedule();
                    if (data.err_code === 0 && data.data) {
                        this.projectTimeLine = data.data.data;
                        this.getComponentDate(data.data);
                        this.startEndTime = [data.data.start_time, data.data.end_time];
                        resolve();
                    }
                });
            },
            async getComponentDate({
                                       start_time,
                                       end_time,
                                       addProject,
                                       dateStart,
                                       dateEnd
                                   }) {
                let objForm = {
                    start_time: date.getFormattingTime(start_time),
                    end_time: date.getFormattingTime(end_time)
                };
                let {data} = await api.getComponentDate(objForm);
                if (data.err_code === 0 && data.data) {
                    let array = [];
                    data.data.map((item, index) => {
                        if (index % 7 === 0) {
                            array.push(item);
                        }
                    });
                    this.projectDate = array;
                    // this.projectDate = data.data
                    if (addProject) {
                        this.clearSelfProject();
                        this.projectTimeLine.unshift([
                            {
                                start_date: date.getFormattingTime(dateStart),
                                end_date: date.getFormattingTime(dateEnd),
                                selfProject: true,
                                name: "新建项目"
                            }
                        ]);
                        // console.log(78, this.projectTimeLine);
                        if (this.$refs.timeline) {
                            this.$refs.timeline.setBoxHeight(1);
                        }
                    }
                }
            },
            async getProjectInfo({id}) {
                //          this.getCont();
                this.modal = true;
                this.Prostatus = "editPro";
                this.projectTitle = "编辑项目";

                let {data} = await api.getProjectInfo({id: id});
                if (data.err_code === 0 && data) {
                    this.$bus.emit("EditProData", data);
                    this.changeTimeLine({
                        startTime: data.start_time,
                        endTime: data.end_time
                    });
                    if (data.contract != "0" && this.$refs.scheduleTool) {
                        this.$refs.scheduleTool.contractListShow = true;
                    } else if (this.$refs.scheduleTool) {
                        this.$refs.scheduleTool.contractListShow = false;
                    }
                }
            },

            getRouterBid() {
                if (this.$route.query.bid) {
                    this.modal = true;
                }
            },

            clearSelfProject() {
                if (
                    this.projectTimeLine &&
                    this.projectTimeLine[0] &&
                    this.projectTimeLine[0][0]
                ) {
                    if (this.projectTimeLine[0][0].selfProject) {
                        this.projectTimeLine.shift();
                    }
                }
            },
            changeContract() {
                this.$refs.scheduleTool.contractHidden();
            },
            changeContractVal(id) {
                this.bindingContract(null, null, id);
                //          this.$refs.scheduleTool.changeContractVal(id)
            },
            changeTimeLine({startTime, endTime}) {
                let start = startTime.split("-");
                let end = endTime.split("-");
                let dateStart =
                    new Date(start[0], Number(start[1]) - 1, start[2]).getTime() / 1000;
                let dateEnd =
                    new Date(end[0], Number(end[1]) - 1, end[2]).getTime() / 1000;

                let maxTime = Math.max(
                    dateStart,
                    dateEnd,
                    this.startEndTime[0],
                    this.startEndTime[1]
                ); // 结束时间
                let minTime = Math.min(
                    dateStart,
                    dateEnd,
                    this.startEndTime[0],
                    this.startEndTime[1]
                ); // 开始时间

                //&& dateEnd<Number(this.startEndTime[1])
                if (dateStart > Number(this.startEndTime[0])) {
                    // 都没超过时间的情况
                    let day = (dateStart - Number(this.startEndTime[0])) / 86400;
                    let maxDay = (maxTime - minTime) / 86400;
                    let is_beyond = dateStart > Number(this.startEndTime[1]) ? 565 : 0;
                    this.$nextTick(() => {
                        if (this.$refs.timeline) {
                            this.$refs.timeline.newProjectLeft =
                                -10 * (day > maxDay ? maxDay : day) + is_beyond;
                        }
                    });
                }
                this.getComponentDate({
                    start_time: minTime,
                    end_time: maxTime,
                    addProject: true,
                    dateStart: dateStart,
                    dateEnd: dateEnd
                });
            },
            // 获取公司合同和管理人员列表
            //      getCont(){
            //          let _this=this;
            //          let url=_this.GLOBAL.baseRouter+this.$GLOBALAPI.task_projectget_contract_list
            //          // let manageURL=_this.GLOBAL.baseRouter+this.$GLOBALAPI.task_get_company_member;
            //          _this.$axios.get(url).then(msgData=>{
            //              _this.ContList=msgData.data.data;
            //
            //          });
            //          // _this.$axios.get(manageURL).then(ManageData=>{
            //          //     _this.manageData=ManageData.data.data;
            //          // })
            //      },
            cutProjectList() {
                this.comFlag = true;
            },
            cutProjectChart() {
                this.comFlag = false;
            },
            //   筛选选择
            sortAction(index, action) {
                this.SLindex = index;
                if (action == "setUp") {
                    this.sortList[0].Cindex = 0;
                    this.proSch = 0;
                    this.remDay = 0;
                    if (this.setUp == 0) {
                        this.sortList[0].Cindex = 1;
                        this.MsgData.sort((a, b) =>
                            Date.parse(Date.parse(a.start_date) - b.start_date)
                        );
                        this.setUp = 1;
                    } else {
                        this.sortList[0].Cindex = 2;
                        this.MsgData.sort(
                            (a, b) => Date.parse(b.start_date) - Date.parse(a.start_date)
                        );
                        this.setUp = 0;
                    }
                } else if (action == "proSch") {
                    this.sortList[1].Cindex = 0;
                    this.remDay = 0;
                    this.setUp = 0;
                    if (this.proSch == 0) {
                        this.sortList[2].Cindex = 1;
                        this.MsgData.sort((a, b) => a.rate_task > b.rate_task);
                        this.proSch = 1;
                    } else {
                        this.sortList[2].Cindex = 2;
                        this.MsgData.sort((a, b) => a.rate_task < b.rate_task);
                        this.proSch = 0;
                    }
                } else if (action == "remDay") {
                    this.proSch = 0;
                    this.setUp = 0;
                    this.sortList[2].Cindex = 0;
                    if (this.remDay == 0) {
                        this.sortList[1].Cindex = 1;
                        this.MsgData.sort(
                            (a, b) => Date.parse(b.end_date) - Date.parse(a.end_date)
                        );
                        this.remDay = 1;
                    } else {
                        this.sortList[1].Cindex = 2;
                        this.MsgData.sort(
                            (a, b) => Date.parse(a.end_date) - Date.parse(b.end_date)
                        );
                        this.remDay = 0;
                    }
                }
            },
            bindingContract(item, index, id) {
                if (this.contractList) {
                    this.contractList.map((contract, i) => {
                        if (contract && id === contract.id) {
                            this.$set(contract, "is_ok", true);
                        } else {
                            this.$set(contract, "is_ok", false);
                        }
                    });
                }
                if (!id && item) {
                    this.$set(item, "is_ok", true);
                    if (this.$refs.probox) {
                        this.$refs.probox.proCont = item.id;
                        // this.$refs.probox.proName = item.contract_name
                    }
                }
            },
            //   新建项目
            addProject() {
                //        this.getCont();
                this.modal = true;
                this.addProjectGuide();
                // if(this.$refs.scheduleTool){
                //     this.$refs.scheduleTool.contractListShow = true
                // }

                // if(this.companyType == 1 &&this.$refs.scheduleTool){
                if (this.$refs.scheduleTool) {
                    this.$refs.scheduleTool.contractListShow = false;
                }
                // } else if(this.$refs.scheduleTool){
                //     this.$refs.scheduleTool.contractListShow = true
                // }

                this.Prostatus = "NewAdd";
                this.projectTitle = "新建项目";
                this.$bus.emit("submitOk");
                this.clearSelfProject();
                this.bindingContract(null, null, null);
                this.getProjectSchedule();
                this.$nextTick(() => {
                    setTimeout(() => {
                        if (this.$refs.timeline) {
                            this.$refs.timeline.newProjectLeft = 0;
                        }
                    });
                });
            },
            // 编辑项目
            editPro(item) {
                this.bindingContract(null, null, null);
                //        this.getCont();
                this.modal = true;

                // if(this.$refs.scheduleTool){
                //     this.$refs.scheduleTool.contractListShow = true
                // }

                this.Prostatus = "editPro";
                let EditProObj = {
                    EPid: item.id,
                    EPname: item.name,
                    EPleader: item.leader,
                    EPcontract: item.contract,
                    EPtag: item.tag,
                    EPstartTime: item.start_date,
                    EPendTime: item.end_date,
                    EPstatus: item.status,
                    EPpicture: item.picture,
                    EpmanangeName:
                        item.realname == null || item.realname == " "
                            ? {name: "NotName"}
                            : {name: item.realname}
                };
                this.$bus.emit("EditProData", EditProObj);
                this.$nextTick(() => {
                    if (this.$refs.timeline) {
                        this.$refs.timeline.newProjectLeft = 0;
                    }
                });
            },
            // 联动查询
            async DataFilte(val) {
                let _this = this;
                this.MSelect = val;
                let {data} = await api.taskProjectFilte(this.PSelect, this.MSelect);
                if (data.err_code == 0){
                    _this.MsgData = data.project;
                }
            },
            async HDataFilte(val) {
                let _this = this;
                this.PSelect = val;
                let {data} = await api.taskProjectFilte(this.PSelect, this.MSelect);
                if (data.err_code == 0){
                    _this.MsgData = data.project;
                }
            },

            // 新建或编辑项目
            async subOk() {
                this.$refs.probox.EmitData();
                let _this = this;
                let bid = this.$route.query.bid;
                let obj = {
                    id: _this.AddPorData.Pid, //项目id
                    name: _this.AddPorData.proName, //项目名称
                    start_time: _this.AddPorData.startDate, //开始时间
                    end_time: _this.AddPorData.endDate, //结束时间
                    tag: _this.AddPorData.count.toString(), //标签
                    leader: _this.AddPorData.manageCount, //负责人ID
                    picture: _this.AddPorData.uploadurl, //图片地址
                    status: _this.AddPorData.state, //状态 1正常,2暂停
                    contract: _this.AddPorData.contract, //状态 1正常,2暂停
                    member: _this.AddPorData.member, //成员
                    tasktype: _this.AddPorData.tasktype, //添加公司任务类型,
                    delete_tasktype: _this.AddPorData.delete_tasktype //删除项目任务类型,
                };
                if (bid) {
                    obj.bid = bid;
                }
                if (!obj.name) {
                    this.$Message.error("请填写项目名称！");
                } else if (!obj.leader) {
                    this.$Message.error("请选择项目负责人！");
                } else if (!obj.start_time) {
                    this.$Message.error("请选择开始时间！");
                } else {
                    this.btnStatus = true;
                    if (this.Prostatus == "NewAdd") {
                        delete obj.id;
                        let {data} = await api.addProject(obj);
                        if (data.err_code == 0){
                            _this.$Message.success("添加成功");
                            _this.$bus.emit("submitOk");
                            _this.getData();
                            // // 刷新导航
                            _this.$store.dispatch("createNav");
                            _this.btnStatus = false;
                            _this.modal = false;
                            this.getContractList();
                            if (_this.contractList) {
                                _this.contractList.map((contract, i) => {
                                    _this.$set(contract, "is_ok", false);
                                });
                            }
                        } else {
                            _this.btnStatus = false;
                            _this.modal = false;
                        }
                    } else if (this.Prostatus == "editPro") {
                        let {data} = await api.updateProject(obj);
                        if (data.err_code == 0){
                            _this.$Message.success("修改成功");
                            _this.$store.dispatch("createNav");
                            _this.modal = false;
                            _this.getData();
                            _this.$bus.emit("submitOk");
                            _this.btnStatus = false;
                            this.getContractList();
                            if (_this.contractList) {
                                _this.contractList.map((contract, i) => {
                                    _this.$set(contract, "is_ok", false);
                                });
                            }
                        } else {
                            _this.btnStatus = false;
                            _this.modal = false;
                        }
                    }
                }
            },
            // 取消Model
            cancel() {
                this.modal = false;
                if (this.Prostatus == "editPro") {
                    this.$bus.emit("submitOk");
                }
            },
            // 获取列表数据
            async getData(search = this.search) {
                let _this = this;
                let params = {
                    order: "create_time",
                    order_by: "desc",
                    search: search,
                    page_size: 50,
                    needGuideData: this.needGuideData ? true : null
                };
                let {data} = await api.taskProjectPage(params);
                if (data.err_code == 0){
                    let MsgData = data.data;
                    MsgData.project.forEach(function (curren, index, arr) {
                        if (curren.last_day > 1) {
                            curren.last_day_text = "剩余";
                        } else if (curren.last_day == 1) {
                            curren.last_day_text = "今日结束";
                        } else if (curren.last_day < 1) {
                            curren.last_day = curren.last_day;
                            curren.last_day_text = "延期";
                        }
                    });
                    _this.MsgData = MsgData.project;
                }
            },
            // 搜索
            ProSearch() {
                this.getData(this.search);
            },
            shrinkModal() {
                this.modalWidth = this.shrinkModalShow ? 500 : 1150;
                const fn = () => {
                    this.shrinkModalShow = !this.shrinkModalShow;
                };
                if (this.shrinkModalShow === false) {
                    setTimeout(() => {
                        fn();
                    }, 300);
                } else {
                    fn();
                }
            }
        },
        computed: {
            ...mapState({
                companyID(data) {
                    return data.paySkip.company;
                }
            })
        }
    };
</script>
<style lang="less">
    .projectManage {
        height: 100%;
        .project-invite {
            height: 100%;
            .nothink {
                display: flex;
                align-items: center;
                justify-content: center;
                background: url("../../assets/images/contract.png") no-repeat #ffffff;
                background-position: center 35%;
                height: 100%;
                width: 100%;
                span {
                    font-size: 12px;
                    color: @black_2;
                }
            }
        }
    }

    .projectMenu {
        display: block;
        dt {
            float: left;
            padding: 2px;
            em {
                background: #fff;
                color: @base;
                display: inline-block;
                cursor: pointer;
                width: 35px;
                height: 35px;
                line-height: 38px;
                text-align: center;
                float: left;
                border-radius: @r4 0px 0px @r4;
                &:nth-of-type(2) {
                    border-radius: 0px @r4 @r4 0px;
                    .iconfonts {
                        font-size: @fs18;
                    }
                }
            }
            .showEm {
                color: #fff;
                background: @base;
            }
        }
        .conditionFilert {
            // background:black;
            margin-left: 5px;
            border-radius: @r4;
            .ivu-input-group {
                top: 0px;
                height: 40px;
                line-height: 40px;
                .ivu-input {
                    height: 40px;
                    padding-right: 0px;
                }
                .ivu-input-group-append {
                    /*background:@base;color:@white;border-width:0px;*/
                }
                .ivu-btn-icon-only {
                    font-size: @fs18;
                }
            }
            .ivu-input-group-append:not(:first-child):not(:last-child),
            .ivu-input-group-prepend:not(:first-child):not(:last-child),
            .ivu-input-group > .ivu-input:not(:first-child):not(:last-child) {
                // border-radius:@r4;
            }
            .ivu-select-visible .ivu-select-selection {
                border-color: @base;
                outline: none;
                -webkit-box-shadow: 0 0 0 2px rgba(255, 255, 255, 0);
                box-shadow: 0 0 0 2px rgba(255, 255, 255, 0);
            }
            .ivu-select {
                .ivu-select-selection:hover {
                    border-color: @base;
                }
            }
            .ivu-select-item-selected {
                background: @base;
            }
            .search-input {
                .ivu-input {
                    border: none;
                }
            }
        }
        .condtition {
            border: @r4;
            padding: 0px @p10;
            font-size: 13px;
        }
        dd {
            float: right;
            .ivu-select {
                margin: 0px !important;
            }
            .ivu-select-selection {
                margin: 0px !important;
                height: 40px !important;
                border: none;
                .ivu-select-placeholder {
                    font-size: 12px;
                    color: @black_3;
                    height: 40px;
                    line-height: 40px;
                }
                .ivu-select-arrow:first-of-type {
                    display: inherit;
                }
                .ivu-select-selected-value {
                    color: @base;
                    line-height: 40px !important;
                    height: 40px !important;
                }
                .ivu-icon-arrow-down-b {
                    font-size: 12px;
                }
            }
            .spanLine {
                display: flex;
                align-items: center;
                border-left: 1px dashed @gray;
                padding: 3px @p15;
                &:after {
                    content: "";
                    display: inline-block;
                    height: 15px;
                    width: 9px;
                    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAB0CAYAAACIY2IQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANwSURBVGhD7ZdLaBNhFIVdiNWFUrrQQosoWvGxsAsV86hoiwsXiloQF+4EF1YsaBHEuhB0oRZBXIgIKuJjqYtmWkzSByoiNG3c1aKt2EWUElNaUbCaeO6fM8kkbTIPFQr+Hxzmv+e/9ySTTJLJAivb3hg1gUGjzz/UuZmWe4LxUB1CxqCMP2YkfYPGFm45xxc36gMxIyEheYVSgQEjwBZ7fLHOBjVUEJKVPxaa9g2EdrG1PMGhkD842NWER28tCEItvuyz1RlyGkVBzk/Lig6yZ/4FaTSassy/D60OsuePg/7aL63db38wZjSy1Z4SdyOTnl6n4vuj7UPdW7nlnuwdW6hfniEtjUbzD+jt7a2JRCJ9OHr/dxQOh+sQMhaNRjM4JlG7/3eEoXoEJCTEohR8599HGGiQIUuAVdOQs39HPT09fjxyE06n1Roitfiyz1ZnyGlYg1ydlhUdZM/8C9JoNK5Jp9OrIAPaQcsbCDiSATh20PIGApoZdJ6WNxBwkEHttLzhKQjNm6A70AZa1lPLBWG9HHoA7aNVCDZ2c2gG2kjvEL0LrKuhz/RaxJsTbJ5k0wwOFdBq1s3cT7C+qgaswNwJHWZpDXsLtUE/oWtQmP4ltkrvfmiPWXyTBrBQGQDeCXoy+ItLWV9hi4J2RhXY/MS6QhkEfit9BepZFyX9hCqw+EhjkTIswGuBfkAFz8QEvrwx42ZRMkjA1gouZ1EcNCFBqnAJgybMYpzPaKUyHIKRSs7lXqOjYghYT0HTDjTFEZlpU0ECilPQMDSJvZSdpA96D51jhEbzv4DLfil0DOrHx0GBdRw6jmUl28rD5hyox6BRlgrU5X910fCYjaPQASyXcUu+Mirg7YWG2WNwqxBsdLDhKa2SoOc6e2/RygKjlhsjtGxB7wvO5L8MUdymuYaWLeit5kyEljK/Q0mWjsHMOwkDS5QhK5jdqnABZu5zdp0yWHSpwgWYucfZ9abxFXVKFS7AnLq+cFysDKzv0qhVhgPQW8WZ57SUuZZmnJYt6H3GmezrYwLjMjee0CoJem6w9yKtQiSEDR+gRixztzkCvAbIfMvL/8Sj8Sz7FAwt/tA+4vEVx+YGDXKfeAbqg5LQF+g11I55dWeCtfqWwDF/ZXsFITcZ9pCWd+QZMew0Le8gZETCWHoHQVXpdPrlbwmk0RfpuGVuAAAAAElFTkSuQmCC") no-repeat;
                    background-position-y: -46px;
                    margin-left: 5px;
                }
                &.byAsc {
                    &:after {
                        background-position-y: 0 !important;
                        transform: rotate(0deg);
                    }
                }
                &.byDesc {
                    &:after {
                        background-position-y: 0px !important;
                        transform: rotate(-180deg);
                    }
                }

                &:nth-of-type(1) {
                    border-width: 0px;
                    padding: 3px @p15;
                }
            }
            .MLeft {
                margin-left: 40px;
            }
            .MLeft10 {
                margin-left: 10px;
            }
            .descIcon {
                background: url("https://static.banbooyun.com/public/img/desc.png") 0px 8px no-repeat;
                width: 20px;
                display: inline-block;
                background-size: 15px;
                height: 20px;
                float: left;
            }
            .remIcon {
                background: url("https://static.banbooyun.com/public/img/icon-sort.png") 6px 11px no-repeat;
                width: 20px;
                height: 32px;
                display: inline-block;
                float: left;
            }
            .remIconUp {
                background: url("https://static.banbooyun.com/public/img/icon-sort-up.png") 6px 11px no-repeat;
                width: 20px;
                height: 32px;
                display: inline-block;
                float: left;
            }
            .remIconDown {
                background: url("https://static.banbooyun.com/public/img/icon-sort-down.png") 6px 11px no-repeat;
                width: 20px;
                height: 32px;
                display: inline-block;
                float: left;
            }
            a {
                font-style: normal;
                color: @black_3;
                height: 32px;
                line-height: 32px;
                &:hover {
                    color: @base;
                }
            }
            .show {
                color: @base;
            }
            .ivu-btn-primary {
                margin-left: 20px;
            }
            span {
                float: left;
                line-height: 30px;
                display: inline-block;
                size: @fs13;
            }
        }
    }

    .projectManageContent {
        margin-top: 20px;
        height: 88%;
        overflow: auto;
        i {
            font-style: normal;
        }
        .ContentRow:nth-of-type(3n) {
            margin-right: 0 !important;
        }
        .ContentRow {
            height: 285px;
            width: 32.3%;
            float: left;
            margin-bottom: 1.5%;
            background: @white;
            margin-right: 1.5%;
            border-radius: @r4;
            position: relative;
            animation: appear 0.3s ease;
            @keyframes appear {
                0% {
                    opacity: 0;
                }
                50% {
                    opacity: 0.7;
                }
                100% {
                    opacity: 1;
                }
            }
            .state_introd,
            .state_participation {
                width: 90px;
                height: 20px;
                line-height: 20px;
                color: @white;
                text-align: center;
                position: absolute;
                top: 4px;
                left: -34px;
                background: @base;
                transform: rotate(-45deg);
            }
            .state_participation {
                background: @orange;
            }
            &:hover {
                cursor: pointer;
                .edit {
                    opacity: 1;
                }
            }
        }
        .ContentRow:hover {
            box-shadow: 0px 4px 12px 2px #c5c3c38f;
        }
        .RowTitle {
            position: relative;
            padding: 20px;
            overflow: hidden;
            .MLeft20 {
                margin-left: 20px;
                margin-right: 10px;
            }
            span {
                .tips {
                    position: relative;
                    left: -60px;
                    top: -30px;
                }
                img {
                    width: 90px;
                    height: 90px;
                    border: 0px;
                    border-radius: @r4;
                    &:hover {
                        cursor: pointer;
                    }
                }
                .font14 {
                    font-size: @fs14;
                    font-weight: lighter;
                    color: @black_2;
                    margin-right: @p5;
                    &:hover {
                        cursor: pointer;
                        text-decoration: underline;
                    }
                }
                .tag {
                    .i {
                        background: @white;
                        border-radius: 2px;
                        padding: 1px 2px;
                        color: @base;
                        margin: 0 4px;
                        border: 1px solid @base;
                        font-size: 12px;
                    }
                }
                p {
                    display: block;
                    line-height: 26px;
                    color: @baseFont;
                    font-size: 12px;
                    img {
                        width: 20px;
                        height: 20px;
                        border-radius: 100%;
                        margin-left: 5px;
                        margin-right: 5px;
                    }
                }
            }

            .edit {
                opacity: 0;
                .iconfonts {
                    cursor: pointer;
                    margin-left: @p5;
                    color: @black_3;
                    font-size: @fs16;
                    &:hover {
                        color: @base;
                    }
                }
                .icon-shanchu:hover {
                    color: @red;
                }
            }
            .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .realname {
                float: right;
            }
        }
        .content {
            border-top: 1px dashed @gray;
            padding: 20px;
            .listTitle {
                display: block;
                text-align: center;
                &:hover {
                    cursor: pointer;
                }
                .lastDay {
                    color: #bdbdbd;
                    font-size: 12px;
                    span {
                        color: @base;
                        font-size: 14px;
                    }
                }
                .nowDay {
                    background: @red;
                    color: @white;
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                }
            }
            .listLine {
                .line {
                    margin: 15px 0px;
                    .title {
                        float: left;
                        width: 100px;
                        display: inline-block;
                        text-align: right;
                        padding-right: 15px;
                        font-size: 12px;
                        color: #bdbdbd;
                    }
                    .lineRow {
                        margin-left: 100px;
                        display: block;
                    }
                }
            }
            .lineTime {
                .ivu-progress-bg {
                    background: #3bceb6;
                }
            }
            .linePost {
                .ivu-progress-bg {
                    background: #7cbefc;
                }
            }
            .lineFile {
                .ivu-progress-bg {
                    background: #fcc44a;
                }
                .ivu-progress-success {
                    .ivu-progress-text {
                        color: #fcc44a;
                    }
                }
            }
            .ivu-progress-show-info .ivu-progress-outer {
                padding-right: 65px;
                margin-right: -65px;
            }
        }
    }

    .projectScheduleModal {
        .shrinkButton {
            position: absolute;
            top: 50%;
            right: 5px;
            width: 18px;
            height: 34px;
            text-align: center;
            line-height: 34px;
            transform: translateY(-50%);
            color: @white;
            background: @base;
            border-radius: 0 7px 7px 0;
        }
        .ivu-modal-wrap {
            /*display: flex;*/
            /*align-items: center;*/
            /*justify-content: center;*/
        }
        .ivu-modal {
            top: 118px;
            transition: all 0.5s;
        }
        ::-webkit-scrollbar-track-piece {
            //滚动条凹槽的颜色，还可以设置边框属性
            background-color: #eef1f2;
        }
        ::-webkit-scrollbar {
            //滚动条的宽度
            width: 4px;
            height: 9px;
        }
        ::-webkit-scrollbar-thumb {
            //滚动条的设置
            background-color: #aae4db;
            background-clip: padding-box;
            min-height: 28px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: #bbb;
        }
    }

    .projectScheduleBox {
        display: flex;
        .projectScheduleTool {
            width: 100%;
            color: @black_2;
            .contractList {
                display: flex;
                margin-top: 5px;
                justify-content: space-between;
                align-items: center;
                .contractInfo {
                    display: flex;
                    .title {
                        width: 140px;
                        margin-left: 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .contractButton {
                    width: 70px;
                    height: 26px;
                    text-align: center;
                    line-height: 26px;
                    background: #fff;
                    color: @base;
                    border: 1px solid #eef1f2;
                    cursor: pointer;
                    &:hover,
                    &:focus {
                        border: 1px solid @base !important;
                        outline: none;
                    }
                }
                .binding {
                    color: @white;
                    background: @base;
                    border: 1px solid @base;
                }
            }
        }
    }
</style>
