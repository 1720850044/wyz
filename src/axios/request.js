import Vue from 'vue'
const url = 'index.php?r=';
export default {
    // 获取消息未读通知数量
    systemNoticeNum: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_notice_num, data)
    },
    /*公司规范库*/
    taskCateList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_cate_list, data)           // 树状图list
    },
    taskCateAdd: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_cate_add, data)            // 分类增加
    },
    taskCateinfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_task_typeinfo, data)                // 类型详情
    },
    taskprojectCateUpdate: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_project_tasktypeupdate, data)       // 项目更新
    },
    taskCateUpdate: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_cate_update, data)         // 分类更新
    },
    taskTypeUpdate: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_task_typeupdate, data)         // 类型更新
    },
    getNorms: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_norms, data)               // 获取规范
    },
    addNorm: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_add_norm, data)            // 添加规范
    },
    deleteNorm: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_delete_norm, data)         // 删除规范
    },
    getIconList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_icon_list, data)           // 获取图标库
    },
    taskTypeAdd: (data, changeUrl) => {
        return Vue.$axios.post(url + changeUrl, data)                            // 新增类型
    },
    insideAudit: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_inside_audit, data)   // 内部审核                          // 任务详情里面的阶段详情
    },
    clientAudit: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_client_audit, data)   // 客户审核                          // 任务详情里面的阶段详情
    },
    /*项目级类型库*/
    //  项目类型库初始化
    projectTasktypeIndex: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_project_tasktypeindex, data)
    },
    //  公司类型库初始化
    specificationLibraryIndex: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_specification_libraryindex, data)
    },
    //  创建项目初始化
    companyProjectIndex: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_projectindex, data)
    },
    //  甲方合同列表初始化
    demandContractIndex: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_demand_contractindex, data)
    },
    //  甲方合同详情初始化
    demandContractInfoIndex: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_demand_contract_infoindex, data)
    },
    //  乙方合同详情初始化
    outsourceContractInfoIndex: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_outsource_contractindex, data)
    },
    //需求合同详情
    demandContractInfo: (data) =>{
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_demand_contractcontract_info, data)
    },
    //合同详情
    contractInfo: (data) =>{
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_contract_info, data)
    },
    //甲方确认合同
    comfirmContract: (data) =>{
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_set_contract_status, data)
    },
    //删除合同
    deleteContract: (data) =>{
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_delete_contract, data)
    },
    //乙方合同确认收款
    outsourceContracGathering: (data) =>{
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_gathering, data)
    },
    //甲方合同付款
    demandContractPay: (data) =>{
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_pay, data)
    },
    //  新建任务成员列表
    newTaskMemberList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_membermember_list, data)
    },  //  气泡 - 新建任务 -  addProject
    getAddProjectGuide: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_add_guide_index, data)
    },
    //  气泡 - 我的任务 - 组员 mytask
    bubbleMyTask: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_wk_my_task, data)
    },
    //  气泡 - 工作台上传资源 - 组员 - workbencResource
    bubbleResource: (data) => {
        // return Vue.$axios.post(url + 'workbench/page/resource/index', data)
         return Vue.$axios.post(url + Vue.$GLOBALAPI.system_wk_resource, data)
    },
    //  气泡 - 项目资源 - 组员 - feaTures
    bubbleDownload: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_task_downloadindex, data)
    },

    //  气泡 - 团队工作 - 组长
    bubbleTeamwork: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.worlbench_teamwork_index, data)
    },
    //  气泡 - 日程安排 - 所有人 - schedule
    bubbleSchedule: (data) => {
        // return Vue.$axios.post(url + 'workbench/page/schedule/index', data)
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_wk_schedule, data)
    },
    //  气泡 - 消息通知 -  message
    bubbleMessage: (data) => {
        // return Vue.$axios.post(url + 'workbench/page/message/index', data)
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_message, data)
    },
    //  气泡 - 聊天消息通知 -  chat
    bubbleChat: (data) => {
        // return Vue.$axios.post(url + 'workbench/page/chat/index', data)
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_chat, data)
    },
    //  气泡 - 项目小助手 -  projectAide
    bubbleProjectHelper: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_projectindex, data)
    },
    //  气泡 - 财务-引导逾期款提醒功能 - balance
    bubbleFinance: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_financelist, data)
    },
    //  气泡 - 财务-明细 - incomeOrExpenditure
    bubbleFinanceList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_finance_listindex, data)
    },
    //  气泡 - 任务管理 - incomeOrExpenditure
    bubbleTaskManage: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_finance_listindex, data)
    },
    //  气泡 - 项目团队 - 组长 - addTeam
    bubbleGetmembers: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_team_workindex, data)
    },
    //  气泡 - 项目排期介绍 - 组长 - projectSchedule
    bubbleProjectSchedule: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_project_schedule_helperindex, data)
    },
    //  气泡 - 项目排期说明 - 组长 - reviseSchedule
    bubbleReviseSchedule: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_revise_scheduleindex, data)
    },
    //  气泡 - 项目排期说明 - 组长 - addFile
    bubbleAddFile: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_file_guide_index, data)
    },
    //  气泡 - 任务介绍 - 组长 - taskPlan
    bubbleTaskProject: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_task_listindex, data)
    },

    //  获取任务类型列表
    getTaskTypeList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_task_typelist, data)
    },
    //  获取项目时间轴
    getProjectSchedule: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_project_scheduleproject_schedule, data)
    },
    //  获取任务类型列表
    getMemberList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_member_list, data)
    },
    //  获取任务助手时间列表
    getComponentDate: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_datelist, data)
    },
    //  任务列表查询
    componentSchedulePrice: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_create_task, data)
    },
    //  助手成员工作表
    memberTaskSchedule: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_member_task_schedule, data)
    },
    //  获取项目角色进度
    getMemberTaskSchedule: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_member_task_schedule, data)
    },
    //  获取类型库任务计数
    tasktypeTaskCount: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_get_tasktype_task_count, data)
    },
    //  获取有任务成员计数
    getTaskCount: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_task_count, data)
    },
    //  更新项目库
    taskProjectUpdate: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_projectupdate, data)
    },
    //  获取项目库详情
    getTaskProjectInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_info, data)
    },
    projectTaskList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_project_tasktypelist, data)                            // 新增类型
    },
    projectTaskInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_project_tasktypeinfo, data)                            // 新增类型
    },
    taskStageInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_stage_info, data)                            // 任务详情里面的阶段详情
    },
    addProject: (data)=> {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_projectadd, data)
    },
    updateProject: (data)=> {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_projectupdate, data)
    },
    // 项目列表
    taskProjectPage: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_projectpage, data)
    },
    taskProjectFilte: (parms1,parms2) =>{
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_projectpage+`&is_contract=${parms1}&status=${parms2}`)
    },
    taskTaskList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_task_list, data)
    },
    //项目概况
    getProjectInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_project_info, data)
    },
    // 任务详情反馈信息
    getStageInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_stage_info, data)
    },
    accessoryUpload: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_taskupdate, data)
    },
    // 之前的上传
    imageUpload: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.file_file_upload, data)                             // 任务详情里面的阶段详情
    },
    // 权限
    getInfoRole: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_info, data)                             // 权限
    },
    // 任务详情权限
    detailInfoRole: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.page_init, data)                             // 权限
    },
    // 工作台nav权限
    getAuthMenu: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_menu2, data)
    },
    /**  二级菜单权限
     *  参数: 点击只有一级菜单传入type 点击二级菜单传入project_id
     *
     */
    getAuthTable: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_menu_table, data)
    },
    //批量导入Excel数据匹配
    mateExcel: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_mate_excel, data)
    },
    //批量导入Excel数据
    addBatch: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_batch_add, data)
    },
    //公司团队添加成员
    Addmember: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_member_add, {data: JSON.stringify(data)})
    },
    //普通任务列表 成员工作台
    getCommonTaskList: (xdays) => {
        return Vue.$axios.get(url + Vue.$GLOBALAPI.task_taskshaft, xdays)
    },
    //获取普通任务详情
    getTaskdetailInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_taskinfo, data)
    },
    //乙方测试任务详情-----详情基本信息
    getTestTaskInfo: (id) => {
        return Vue.$axios.get(url + Vue.$GLOBALAPI.task_bid_info+`&bid_id=${id}`)
    },
    getTestinfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_testinfo, data)
    },
    //乙方测试任务详情-----实施人员列表
    // getExecuteUserList:(data) =>{
    //     return Vue.$axios.post(url + Vue.$GLOBALAPI.task_set_work_user, data)
    // }
    //普通任务上传
    StageUpload: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_stage_upload, data)
    },
    //测试任务详情-----上传后的信息
    getTestTaskBidinfos: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_testbid_info, data)
    },
    //companyUserList
    getcompanyUserList: (project_id) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_member_page, project_id)
    },
    //测试任务详情-------设置实施/负责人员接口
    setRelatedUser: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_set_work_user, data)
    },
    //上传测试任务
    uploadTestHttp: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_test_upload, data)
    },
    //获取负责人测试任务列表
    AuditTestTaskList: () => {
        return Vue.$axios.get(url + Vue.$GLOBALAPI.task_audit_list)
    },
    //获取测试任务日志接口
    getTestTaskLog: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_bid_log, data)
    },
    //测试任务上传审核接口
    testTaskUpLoad: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_testinside_audit, data)
    },
    //乙方获取招标列表
    getBidList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_testbid_list, data)
    },
    //乙方报价
    postBaojia: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_testjoin_test, data)
    },
    //甲方获取测试任务详情
    getTaskDetail: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_test_info, data)
    },
    //项目大厅
    getTaskHall: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_test_hall, data)
    },
    //甲方选择(确认)报价
    choiceBidPrice: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_choice_bid_price, data)
    },
    //甲方选择乙方中标流程
    getWinBid: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_win_bid, data)
    },
    //甲方付款接口
    paytoyi: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_pay, data)
    },
    collect: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_confirm_receipt, data)
    },
    getTaskTaskStage: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_task_stage, data)
    },
    // 添加协作方成员
    addCollaborationMember: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_collaboration_member_add, data)
    },
    // 移除协作方成员
    delCollaborationMember: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_collaboration_member_del, data)
    },
    //
    sendNotice: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_notice, data)
    },
    // ---------------------------------公司----------------------------------
    getCompanyInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_company_info, data)    // 获取公司基础信息
    },
    contractList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_get_contract_list, data); //合同table
    },
    updateCompanyInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_update_company_info, data)    // 更新公司基础信息
    },
    getconfirmInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_confirm_info, data)    // 公司认证
    },
    getCompanyConfirm: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_company_confirm, data)    // 公司认证
    },
    getCompanyCodeConfirm: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_company_code_confirm, data)     // 金额验证
    },
    getBankInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_bank_info, data)                  //  银行支行查询接口
    },
    getCompanyAccount: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_company_account, data)                  //  电子签名
    },
    getTsignSigner: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_signer, data)                      //  修改签章人
    },
    getSignerList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_signer_list, data)                      //  签章人列表
    },
    setOperator: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_operator, data)                      //  设置经办人
    },
    getOperatorList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_operator_list, data)                      //  获取选择后的经办人列表
    },
    delOperator: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_operator_del, data)                      // 删除经办人
    },
    getDepartmentList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_list, data)                                  //  获取部门成员
    },
    getContractList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_projectget_contract_list, data)       //  获取合同公司列表
    },
    getSelectInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_select_info, data)           //  根据内容搜搜公司或者个人
    },
    addCollaboration: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_add_collaboration, data)           //  添加协作方
    },
    collaborationList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_collaboration_list, data)           //  协作方列表
    },
    deleteCollaboration: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_delete_collaboration, data)           //  删除协办方
    },
    updateCollaboration: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_update_collaboration, data)           //  删除协办方
    },
    /*---------------------------------合同----------------------------------*/
    getConfirmContract: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_confirm_contract, data)                      //  签章页面乙确认合同
    },
    contractAbilityList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_abilitylist, data)                      //  合同类型列表
    },
    addContract: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_add_contract, data)                      //  添加合同
    },
    editContract: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_edit_contract, data)                      //  修改合同
    },
    getTsignCode: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_tsignsend_code, data)                                  //  签章页面获取验证码
    },
    getTsignPdf: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_pdf, data)                                  //  签章页面获取PDF
    },
    getCreateCertificate: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_create_certificate, data)                                  //  确认签章
    },
    getValid: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_valid, data)                                  //  获取通知
    },
    getNowTsign: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_now, data)                                  //  判断当前用户的合同权限
    },
    pdfDownload: (data) => {
        return Vue.$axios.get(url + Vue.$GLOBALAPI.system_pdf_download+`&contract_id=${data}`)                                   //pdf下载
    },
    /*---------------------------------注册----------------------------------*/
    sendLoginEmail: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_email_send, data)                                  //  获取注册邮箱验证码
    },
    getEmailName: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_name, data)                                  //  获取注册邮箱验证码
    },
    /*---------------------------------重置密码----------------------------------*/
    sendResetEmail: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_send_code, data)                                  //  获取已注册的邮箱验证码
    },
    ResetPwd: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_forget_pwd, data)                                  //  获取已注册的邮箱验证码
    },
    /*---------------------------------个人中心----------------------------------*/
    sendUserEmailCode: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_useremail_send, data)                                  //  获取修改邮箱验证码
    },
    updateUserEmailCode: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_email_update, data)                                  //  修改邮箱验证码
    },
    sendUserPhoneCode: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_phone_send, data)                                  //  获取手机验证码
    },
    updateUserPhoneCode: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_phone_update, data)                                  //  修改手机号
    },
    chatInit: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_init_chat, data)                                  //  获取websockt 的id
    },
    /*--------------------------------- 消息聊天 ----------------------------------*/
    createChatOne: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_create_chat_one, data)                                  //   创建私聊
    },
    createGroupOne: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_create_chat_group, data)                                  //   创建私聊
    },
    getChatRecord: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_chat_record, data)                                  //   获取聊天记录
    },
    addChatsStar: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_star, data)                                  //   添加星标
    },
    cancelChatsStar: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_cancel_star, data)                                  //   取消星标
    },
    getChatStarList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_star_list, data)                                  //   获取星标列表
    },
    getChatMasters: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_chat_masters, data)                                  //   获取聊天组长
    },
    chatSetVip: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_set_vip, data)                                  //   设置vip
    },
    chatUnsetVip: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_unset_vip, data)                                  //    取消vip
    },
    getChatGroupUser: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_group_users, data)                                  //    获取群成员
    },
    quitChatGroup: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_quit_chat_group, data)                                  //    退群
    },
    dissolveGroup: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_dissolve_group, data)                                  //    群解散
    },
    updateGroupName: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_update_group, data)                                  //    修改群名
    },
    joinChatGroup: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_join_chat_group, data)                                  //    设置内添成员
    },
    kickChatGroup: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_kick_chat_group, data)                                  //    设置内删成员
    },
    getEmailPhone: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_by_email_phone, data)                           //   根据邮箱手机号获取用户id
    },
    //   获取通知的合同列表
    geTnoticeContract: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_notice_contract_list, data)
    },
    getUserMsgList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_user_notice_config, data)
    },
    setUserMsgList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_set_user_notice_config, data)
    },
    // ----------------------------------  新手引导  -----------------------------------//
    updateGuideState: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_i_know, data)                                  //  新手引导
    },
    // ----------------------------------  项目动态  -----------------------------------//
    getComProjecNewsInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_count_show, data)                                  //  统计显示 公司级
    },
    //--------------------------------  聊天消息提醒 获取项目列表----------------------------//
    getChartMsgProjectList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_notice_project_list, data)
    },
    //--------------------------------  聊天消息提醒 根据ID获取未读消息--------------------//
    getChartUnreadMsgList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_notice_list, data);
    },
    //-------------------------------  聊天消息提醒 获取任务列表-----------------------------//
    getChartTaskList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_notice_task_list, data);
    },
    //-------------------------------  聊天消息提醒 单个标记已读-----------------------------//
    SetChartReadMsg: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_read_notice, data);
    },
    //------------------------------   消息转通知 ----------------------------------//
    MsgTrunNotice: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_message_to_notice, data);
    },
    //------------------------------   消息置顶 -----------------------------------//
    setMsgTop: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_top_chat, data);
    },
    //-------------------------------- 打开某聊天群组页面记录   ------------------------------//
    getVisitGroup: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_visit_group, data);
    },
    //--------------------------------  獲取未讀消息  ---------------------------------//
    getUnread: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_unread, data);
    },
    //--------------------------------  全部标识已读 -----------------------------------//
    setAllMsgSigned: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_notice_all_read, data);
    },
    importMember: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_import_member, data);
    },
    //--------------------------------  批量导入内部成员 -----------------------------------//
    addInteriorPersonnel: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_members_add, data);
    },
    //成員工作台任務走勢
    getMemberChartTaskData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_task_num, data);
    },
    //成员工作台质量走势
    getMemberChartTaskQualityData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_task_quality, data);
    },
    //成员工作台速度走势
    getMemberChartTaskSpeedData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_task_speed, data);
    },
    //成员工作台所有任务列表
    getAllTaskListData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_task_list, data);
    },
    //注册 加入团队 公司搜素接口
    joinSerchCompany: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_company_like, data);
    },
    //注册 加入公司接口
    joinCompanyFun: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_join_company, data);
    },
    //注册 创建公司接口
    crateCompanyFun: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_complete_info, data);
    },
    //注册 个人擅长列表
    beGoodAtFun: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_ability_list, data);
    },
    leaveCompany: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_leave_company, data);
    },

    //---------------------------------  工作台统计 工作概况---------------------------------------//
    // 初始化
    workbenchStatisticsIndex: async (data) => {
       return  Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_statistics_index, data);
    },
    // 客户增长表格
    workbenchStatisticsClientAdd: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_statistics_client_add, {...data,...{acc_token: sessionStorage.accToken}});
    },
    workbenchStatisticsTag: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_statistics_tag, {...data,...{acc_token: sessionStorage.accToken}});
    },
    //---------------------------------  工作台统计 成员概况---------------------------------------//
    // 初始化
    workbenchWorkMemberIndex: async (data) => {
       return  Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_work_member_index, data);
    },
    workbenchWorkMemberEfficiency: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_work_member_efficiency, {...data,...{acc_token: sessionStorage.accToken}});
    },
    workbenchWorkMemberTag: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_work_member_tag, {...data,...{acc_token: sessionStorage.accToken}});
    },


    //---------------------------------  财务系统---------------------------------------//
    //---------------------------------  财务系统——收入明细 ---------------------------------------//
    // 收入明细列表初始化接口
    incomeInitInterface: () => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_finance_listindex);
    },
    // 收入明细列表
    getIncomeData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_finance_listlist, data);
    },
    // 编辑收入明细
    editIncomeData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_finance_listupdate, data);
    },
    // 删除收入明细
    delIncomeData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_finance_listdelete, data);
    },
    // 查看修改记录
    viewIRecordData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_record, data);
    },
    // 付款方筛选项
    getPayerData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_counterparty, data);
    },
    // 负责人筛选项
    getLeaderData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_leader, data);
    },
    // 付款方列表
    getPayData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_select, data);
    },
    // 项目负责人列表
    memberList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_member_list, data);
    },
    // 收入来源列表
    getSourceList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_select_source, data);
    },
    screenDate: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_select_list, data);
    },
    //---------------------------------  财务系统——财务总览 ---------------------------------------//
    // 财务总览初始化接口
    totalInitInterface: () => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_financeindex);
    },
    getProjectIndex () {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_statisticsindex);
    },
    getWorkbenchInfo () {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_statistics_index);
    },
    getCustomerInfo: () => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_statisticsindex);
    },
    // 公司里面的部门
    getDepartmentInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_get_dep, data);
    },
    // 获取职位
    getPositionInfo: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_get_post, data);
    },
    // 财务总览
    getTotalData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_total, data);
    },
    // 未收款提醒
    getNopaymentReminderData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_financelist, data);
    },
    // 删除未收款详情数据
    delNopaymentData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_financedelete, data);
    },
    // 编辑未收款详情数据
    editNopaymentData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_financeupdate, data);
    },
    // 获取图表数据
    getIncomeTrendData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_trend, data);
    },
    //---------------------------------  财务系统 ———— 支出明细 ---------------------------------------//
    // 支出明细列表初始化接口
    payInitInterface: () => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_pay_listindex);
    },
    // 支出明细列表
    getExpenditureData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_pay_listlist, data);
    },
    delExpenditureData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_pay_listdelete, data);
    },
    addExpenditureData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_pay_listadd, data);
    },
    editExpenditureData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_pay_listupdate, data);
    },
    viewRecordData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_pay_listrecord, data);
    },
    filterDate: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_select, data);
    },
    // 筛选 收款方列表
    payeeData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_pay_listcounterparty, data);
    },
    // 筛选 经办人列表
    leaderData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_pay_listleader, data);
    },
    // 添加支出之经办列表
    operatorData: () => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_operator_list);
    },
    // 收款方列表company/page/pay-list/select
    receiveData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.companny_select,data);
    },
    //---------------------------------  公司》团队能力开始---------------------------------------//
    getTeamPowerData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_team_aidelist, data);
    },
    getUserLevelList: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_type_list, data);
    },
    //修改团队信息
    getTeamPowerChartData: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_chart_list, data);
    },
    //修改用户评分
    updateUserScore: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_team_aideupdate, data);
    },
    getUserInfoById: (id) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_userinfo, {id: id});
    },
    //初始化接口
    getTeamPowerInitApi: () => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_team_aideindex);
    },
    //---------------------------------  团队能力结束---------------------------------------//
    getTestList:(data)=>{
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_get_test_list, data);
    },
    deleteTest:(data)=>{
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_delete_test_task, data);
    },
    // 新增测试任务
    addTestTask: (data) => {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_testadd, data);
    },
    task_headman_wp:(data) =>{
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_headman_wp, data);
    },
}
//---------------------------------  网盘开始---------------------------------------//
//网盘 acc_token
let ksydrive_acc_token = null;
export class ksydrive {
    //初始化接口
    static ksydriveInit() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_resourceindex).then(res => {
            ksydrive_acc_token = {acc_token: res.data.data.acc_token}
            return res;
        })
    }
    //资源列表
    static getresourceList(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_resourcelist, Object.assign(data, ksydrive_acc_token));
    }
    //移动文件、文件夹
    static movefolderApi(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_move, Object.assign(data, ksydrive_acc_token));
    }
    //复制文件、文件夹
    static copyfolderApi(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_copy, Object.assign(data, ksydrive_acc_token));
    }
    //资源文件详情
    static lookFileDetailApi(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_resourceget_detail, Object.assign(data, ksydrive_acc_token));
    }
    //资源打包下载
    static resourceDownLoadApi(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_pick_zip, Object.assign(data, ksydrive_acc_token));
    }
    //新建文件夹
    static newFolderApi(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_mk_dir, Object.assign(data, ksydrive_acc_token));
    }
    //删除文件目录列表
    static getrecoveryListApi() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_deleted_list, ksydrive_acc_token);
    }
    //恢复文件夹
    static recoveryFolderApi(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_reset, Object.assign(data, ksydrive_acc_token));
    }
    //删除资源
    static deleteResourceApi(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_resourcedelete, Object.assign(data, ksydrive_acc_token));
    }
    //重命名
    static renameApi(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_rename, Object.assign(data, ksydrive_acc_token));
    }
    //3D文件保存缩略图
    static saveThumb(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_save_thumb, Object.assign(data, ksydrive_acc_token));
    }
}
//---------------------------------  网盘结束---------------------------------------//
//---------------------------------  日程安排开始---------------------------------------//
//日程安排 acc_token
let schedule_acc_token = null;
export class schedule {
    static init() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_index).then(res => {
            schedule_acc_token = {acc_token: res.data.data.acc_token}
            return res;
        });
    }
    static Calendar(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_list, Object.assign(data, schedule_acc_token));
    }
    static eventDeatil(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_get_detail, Object.assign(data, schedule_acc_token));
    }
    static getprojctList() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_get_ptc_list, schedule_acc_token);
    }
    static getmembersList() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_member_list, schedule_acc_token);
    }
    static addEvent(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_add_event, Object.assign(data, schedule_acc_token));
    }
    static serchEvent(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_search, Object.assign(data, schedule_acc_token));
    }
}
//--------------------------------  日程安排结束---------------------------------------//
//---------------------------------  定价助手Pricing assistant  ---------------------------------------//
let price_acc_token = null;
export class priceAide {
    // 初始化接口
    static initAide() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_index).then(res => {
            price_acc_token = {acc_token: res.data.data.acc_token}
            // console.log(456,price_acc_token);
            return res
        });
    }
    // 获取分类列表
    static classifyData() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_get_type, price_acc_token);
    }
    // 获取能力列表
    static aideData() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_list, price_acc_token);
    }
    // 新增能力列表数据
    static addAideData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_add, Object.assign(data, price_acc_token));
    }
    // 删除能力列表数据
    static delAideData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_delete, Object.assign(data, price_acc_token));
    }
    // 删除分类列表数据
    static delTypeData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_delete_all, Object.assign(data, price_acc_token));
    }
    // 编辑分类列表数据
    static updateTypeData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_update, Object.assign(data, price_acc_token));
    }
}
//---------------------------------  任务详情重构开始  ---------------------------------------//
let taskDetails_acc_token = null;
export class taskDetail {
    static index(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_taskindex, data).then((res) => {
            taskDetails_acc_token = {acc_token: res.data.data.acc_token};
            return res;
        })
    }
    static init(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.page_init, data);
    }
    static getTaskData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_taskinfo, data);
    }
    static getJoinMembers(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_joined_members, data);
    }
    static getTaskType(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_project_tasktypelist, data);
    }
    static getChildProject(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_child_list, data);
    }
    static deleteTask(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_taskdelete, data);
    }
    static updateTask(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_taskupdate, data);
    }
    static addTask(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_taskadd, data);
    }
    static taskStageInfo(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_stage_info, data)                            // 任务详情里面的阶段详情
    }
    static downloadStage(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.project_download, Object.assign(data, taskDetails_acc_token))
    }
}
/*---------------------------------------------------客服系统-----------------------------------------------------------*/
let customer_acc_token = null;
export class customerApi {
    static clientChatInit() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_call)                                  //  客服系统 客户呼叫客服
    }
    static getClientMsgList() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_client_user_list)                                  //  客服获取客户列表
    }
    static getChatLog(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_chat_log, data)                                  //  获取历史聊天记录
    }
    static closeService(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_close_service, data)                                  //  关闭服务  客服
    }
    static closeChat() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_close_chat)                                  //  关闭服务  用户
    }
}
//---------------------------------  公司====>合作====>公司合作库START  ---------------------------------------//
let cooperation_acc_token = null;
let power_acc_token = null;
export class cooperationAide {
    // 初始化接口
    static initCooperation() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_cooperateindex).then(res => {
            cooperation_acc_token = {acc_token: res.data.data.acc_token};
            return res
        });
    }

    // 获取公司合作库列表
    static cooperationData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_cooperatelist, Object.assign(data, cooperation_acc_token));
    }
    // 删除公司合作库
    static delCooperateData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_cooperatedelete, Object.assign(data, cooperation_acc_token));
    }
    // 增加公司合作库
    static addCooperateData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_cooperateadd, Object.assign(data, cooperation_acc_token));
    }
    // 编辑公司合作库
    static editCooperateData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_edit, Object.assign(data, cooperation_acc_token));
    }
    // 搜索公司名称
    static searchCompany(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_search_company, Object.assign(data, cooperation_acc_token));
    }
    // 优化（0.9.2）
    //  新合作公司列表初始化接口
    static newCooperativeCompanyListIndex() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_cooperate_inviteindex).then((res) => {
            power_acc_token = {acc_token: res.data.data.acc_token};
            return res;
        })
    }
    // 增加公司合作库（优化后的接口）
    static newAddCooperateData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_cooperative_new_add, Object.assign(data, power_acc_token));
    }
    // 新增合作公司列表（优化后的接口）
    static newCooperativeCompaniesList() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_cooperative_list, power_acc_token);
    }
    // 新增合作公司响应
    static newCooperativeCompaniesResponse(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_cooperative_response, Object.assign(data, power_acc_token));
    }
}
//---------------------------------  公司====>合作====>公司合作库END  ---------------------------------------//
/*---------------------------------------------------（甲方）项目评分-----------------------------------------------------------*/
let projectScore_acc_token = null;
export class scoreApi {
    static scoreInit() {                                                                              // 项目评分 甲方初始化接口
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_scoreindex).then((res) => {
            projectScore_acc_token = {acc_token: res.data.data.acc_token};
            return res;
        })
    }
    static getProjectHttp(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_scorelist, Object.assign(data, projectScore_acc_token))
    }
    static getProjectDtailHttp(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_scoreget_detail, Object.assign(data, projectScore_acc_token))
    }
    static ReleaseHttp(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_assess, Object.assign(data, projectScore_acc_token))
    }
    static yiscoreInit() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_project_scoreindex).then((res) => {                 // 项目评分 乙方初始化接口
            projectScore_acc_token = {acc_token: res.data.data.acc_token};
            return res;
        })
    }
    static getYiProjectHttp(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_project_scorelist, Object.assign(data, projectScore_acc_token))
    }
    static getYiProjectDtailHttp(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_get_detail, Object.assign(data, projectScore_acc_token))
    }
}
//---------------------------------  公司====>合作====>合作邀请START  ---------------------------------------//
let invitation_acc_token = null;
export class invitationApi {
    static invitationInit() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_cooperate_inviteindex).then((res) => {
            invitation_acc_token = {acc_token: res.data.data.acc_token};
            return res;
        })
    }
    // 合作邀请列表
    static invitationData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_invite_project_list, Object.assign(data, invitation_acc_token))
    }
    // 增加合作邀请
    static addInvitationData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_invite_project, Object.assign(data, invitation_acc_token))
    }
    // 获取合作公司列表
    static companyData(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_get_cooperation_list, Object.assign(data, invitation_acc_token))
    }
    // 获取资源类型
    static abilityList() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_abilitylist, invitation_acc_token)
    }
    // 合作邀请详情
    static cooperationInvitationDetail(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_invite_project_info, Object.assign(data, invitation_acc_token))
    }
}
//---------------------------------  公司====>合作====>合作邀请END  ---------------------------------------//
//-------------------------------------------------乙方合同0.9.1优化-----------------------------------------------------------
let contractInit_acc_token = null;
export class contractApi {
    static contractInit() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_contract_aeindex).then((res) => {
            contractInit_acc_token = {acc_token: res.data.data.acc_token};
            return res;
        })
    }
    static contractInfo(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_contractinfo, Object.assign(data, contractInit_acc_token))  //详情
    }
    static firstStepHttp(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_first_step, Object.assign(data, contractInit_acc_token))
    }
    static twoStepHttp(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_second_step, Object.assign(data, contractInit_acc_token))
    }
    static threeStepHttp(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_third_step, Object.assign(data, contractInit_acc_token))
    }
    static getOperatorList() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_operator_list, contractInit_acc_token)                      //  获取选择后的经办人列表
    }
    static searchDemand(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_search_demand, Object.assign(data, contractInit_acc_token))   //公司搜索
    }
    static contractAbilityList() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_abilitylist, contractInit_acc_token)                      //  合同类型列表
    }
    static getcompanyUserList(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_member_page, Object.assign(data, contractInit_acc_token))
    }
}

//------------------------------------------0.9.1个人中心重构start-------------------------------------------------------------
export class userInfosApi {
    static getUserInfo(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_userinfo, data)
    }

    static getAtbegood(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_ability_list, data)
    }

    static userUpdata(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_userupdate, data)
    }

    static getPublicSecretKey() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_public_secret_key)        //获取公钥
    }

    static chackUserpassword(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_check_user_by_password, data)   //验证密码
    }

    static savePassword(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_edit_password, data)        //保存密码
    }

    static getPhoneCode(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_phone_send, data)          //获取手机验证码
    }

    static savePhone(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_phone_update, data)        //修改手机号
    }

    static getEmailCode(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_useremail_send, data)          //获取修改邮箱验证码
    }

    static saveEmail(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_email_update, data)        //修改邮箱验证码
    }

    static leaveCompany() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_leave_company);     //离开公司
    }
}
// 测试邀请
let testInvite_acc_token = null;
export class testInviteApi {
    static testInviteInit() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_bid_inviteindex).then((res) => {
            testInvite_acc_token = {acc_token: res.data.data.acc_token};
            return res;
        })
    }

    // 测试邀请列表
    static testInviteData() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_bid_invitelist, Object.assign(testInvite_acc_token))
    }

    // 测试邀请详情
    static testInviteDetail(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_info, Object.assign(data, testInvite_acc_token))
    }

    // 测试拒绝邀请 /  同意邀请
    static testInviteBtn(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_response, Object.assign(data, testInvite_acc_token))
    }
}
// 项目邀请
let projectInvite_acc_token = null;
export class projectInviteApi {
    static projectInviteInit() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_project_inviteindex).then((res) => {
            projectInvite_acc_token = {acc_token: res.data.data.acc_token};
            return res;
        })
    }

    // 项目邀请列表
    static projectInviteData() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_project_invitelist, projectInvite_acc_token)
    }

    // 项目邀请详情
    static projectInviteDetail(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_project_inviteinfo, Object.assign(data, projectInvite_acc_token))
    }

    // 项目拒绝邀请 /  同意邀请
    static projectInviteBtn(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_project_inviteresponse, Object.assign(data, projectInvite_acc_token))
    }
}
let teamWork_acc_token = null;
export class teamWorkDemand {
    static companyWorkIndex() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_group_workindex).then((res) => {
            teamWork_acc_token = {acc_token: res.data.acc_token}
            return res;
        }); //初始化
    }

    static companyFreeTrend(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_member_free_trend, Object.assign(data, teamWork_acc_token)); //折线图
    }

    static companyMemberWork(data,) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_member_work, Object.assign(data, teamWork_acc_token)); //成员工作
    }

    static companyWorkCompany() {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_company, teamWork_acc_token); //右侧数量
    }

    static companyProjectWork(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_working_project, Object.assign(data, teamWork_acc_token)); //项目table
    }

    static companyTaskWork(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_working_task, Object.assign(data, teamWork_acc_token)); //任务table
    }

    static companyTestTaskWork(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_working_bid_test, Object.assign(data, teamWork_acc_token)); //测试任务table
    }

    static companyContractWork(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_working_contract, Object.assign(data, teamWork_acc_token)); //合同table
    }

    static getUserTaskList(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_chart_personal_task_list, Object.assign(data, teamWork_acc_token))
    }

    static getUsertaskTrend(data) {
        return Vue.$axios.post(url + Vue.$GLOBALAPI.workbench_chart_personal, Object.assign(data, teamWork_acc_token))
    }
}
export class guideApi {
    static novice(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_novice)
    }
    static wk_company(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_wk_company)
    }
    static green_help(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_green_help)
    }
}
export class systemApi {
    static login_info(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_info)
    }
    static login_logout(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_logout)
    }
}
export class cooperationApi {
    static getAbilityList(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_abilitylist)
    }
    static getCooperationList(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_cooperation_list)
    }
    static addCooperation(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_add_cooperation)
    }
    static editCooperation(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_edit_cooperation)
    }
    static deleteCooperation(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_delete_cooperation)
    }
    static task_invite_info(data){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_invite_info,data)
    }
}
export class loginApi{
    static getInviteInfo(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_invite_info)
    }
    static getPublicSecretKey(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_get_public_secret_key)
    }
    static register(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_register)
    }
    static login(data){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.system_login,data)
    }
}
export class companyInviteApi{
    static inviteList(data){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_invite_list,data)
    }
    static addInvite(data){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_add_invite,data)
    }
}
export class memberApi{
    static taskStart(data){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_start,data)
    }
    static testTaskShaft(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_test_shaft)
    }
    static getTaskList(data){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.task_taskshaft,data)
    }
}

let newContract_acc_token = null;
export class newContractApi{
    static yiInitApi(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/index',data).then(({data})=>{
            newContract_acc_token = {acc_token: data.data.acc_token};
            return data;
        })
    }
    static getoperatorList(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_operator_list);
    }
    static getuserList(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_member_list);
    }
    static searchDemand(data) {
        return Vue.$axios.post(url + 'company/component/contract/search-company', Object.assign(data, newContract_acc_token))   //公司搜索
    }
    static addContractApi(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/add ', Object.assign(data, newContract_acc_token));
    }
    static getOutsourceContractInfo(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/contract-info ', Object.assign(data, newContract_acc_token));
    }
    static OutsourceUpdataContract(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/update ', Object.assign(data, newContract_acc_token));
    }
    static contractAbilityList(){
        return Vue.$axios.post(url + Vue.$GLOBALAPI.company_abilitylist, newContract_acc_token)                      //  合同类型列表
    }
    static getPriceDetails(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/price-group', Object.assign(data, newContract_acc_token))
    }
    static getPricePayList(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/price-pay', Object.assign(data, newContract_acc_token))
    }
    static orderPay(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/pay', Object.assign(data, newContract_acc_token))
    }
    static getPayList(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/pay-list', Object.assign(data, newContract_acc_token))
    }
    static getPayDetails(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/pay-detail', Object.assign(data, newContract_acc_token))
    }
    static PayStep(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/add-step', Object.assign(data, newContract_acc_token))
    }
    static sendContract(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/sync', Object.assign(data, newContract_acc_token))
    }
    static completConstract(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/complete', Object.assign(data, newContract_acc_token))
    }
    static importExcel(data){
        return Vue.$axios.post(url + 'company/page/outsource-contract-info/import-excel', Object.assign(data, newContract_acc_token))
    }
}
