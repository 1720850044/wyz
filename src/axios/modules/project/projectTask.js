import Vue from 'vue';
import {onlyAPI} from '../../apiConfig';
const url = 'index.php?r=';
const urls = {
    pjTaskIndex: onlyAPI.project_task_projectindex,
    pjTaskCateList: onlyAPI.project_task_projectcate_list,
    pjTaskMemberList: onlyAPI.project_member_list,
    pjTaskPage: onlyAPI.project_task_projectpage,
    pjTaskProjectInfo: onlyAPI.project_task_projectproject_info,
    pjTaskList: onlyAPI.project_task_projectlist,
    pjTaskJoined: onlyAPI.project_task_projectjoined_members,
    pjTaskChildList: onlyAPI.project_child_list,
    pjTaskTaskList: onlyAPI.project_task_list,
    pjTaskCount: onlyAPI.project_task_projecttask_count,
    pjTaskTasktypeCount: onlyAPI.project_get_tasktype_task_count,
    pjTaskContract: onlyAPI.company_contract_price_task,
    // pjTaskContract: onlyAPI.system_create_task,
    pjTaskSchedule: onlyAPI.company_member_task_schedule,
    pjTaskMemberTime: onlyAPI.company_datelist,
    pjTaskProjectAdd: onlyAPI.project_task_projectadd,
    pjTaskChidAdd: onlyAPI.project_child_add,
    pjTaskChildUpdate: onlyAPI.project_child_update,
    pjTaskDetail: onlyAPI.page_init,
    pjTaskTaskInfo: onlyAPI.project_task_projecttask_info,
    pjTaskTaskUpdate: onlyAPI.project_task_update,
    pjTaskStart: onlyAPI.project_task_project_start,
    pjTaskPause: onlyAPI.project_task_pause,
    pjTaskContinue: onlyAPI.project_task_continue,
    pjTaskStageInfo: onlyAPI.project_task_projectstage_info,
    pjTaskStageUpdate: onlyAPI.project_stage_update,
    pjTaskDownload: onlyAPI.project_task_projectdownload,
    pjTaskInsideAudit: onlyAPI.project_task_projectinside_audit,
    pjTaskDelete: onlyAPI.project_task_delete,
    pjTaskChart: onlyAPI.project_task_progress_chart,
    pjTaskProjectProgress: onlyAPI.project_project_progress,
    pjTaskMemberProgress: onlyAPI.project_member_progress,
    pjTaskChildprogress: onlyAPI.project_child_project_progress,
    pjTaskChilDelete: onlyAPI.project_child_delete,

}
let accToken = null;

/** 项目任务初始化接口
 *
 * */
export const pjTaskIndex = async (params) => {
    return new Promise(async (resolve, reject) => {
        let data = await Vue.$axios.post(url + urls.pjTaskIndex, params)
        accToken = sessionStorage.accToken ? sessionStorage.accToken : '';
        resolve(data);
    })
};

export const pjTaskContract = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskContract, { ...{acc_token: accToken},...params})
};
export const pjTaskSchedule = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskSchedule, { ...{acc_token: accToken},...params})
};
export const pjTaskMemberTime = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskMemberTime, { ...{acc_token: accToken},...params})
};
export const pjTaskTaskList = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskTaskList, { ...{acc_token: accToken},...params})
};
export const pjTaskDelete = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskDelete, { ...{acc_token: accToken},...params})
};
export const pjTaskMemberList = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskMemberList, { ...{acc_token: accToken},...params})
};
export const pjTaskCateList = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskCateList, { ...{acc_token: accToken},...params})
};
export const pjTaskList = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskList, { ...{acc_token: accToken},...params})
};
export const pjTaskJoined = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskJoined, { ...{acc_token: accToken},...params})
};
export const pjTaskChildList = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskChildList, { ...{acc_token: accToken},...params})
};
export const pjTaskTaskUpdate = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskTaskUpdate, { ...{acc_token: accToken},...params})
};
export const pjTaskProjectAdd = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskProjectAdd, { ...{acc_token: accToken},...params})
};
export const pjTaskProjectProgress = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskProjectProgress, { ...{acc_token: accToken},...params})
};
export const pjTaskMemberProgress = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskMemberProgress, { ...{acc_token: accToken},...params})
};
export const pjTaskChildprogress = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskChildprogress, { ...{acc_token: accToken},...params})
};
export const pjTaskChart = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskChart, { ...{acc_token: accToken},...params})
};
export const pjTaskCount = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskCount, { ...{acc_token: accToken},...params})
};
export const pjTaskProjectInfo = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskProjectInfo, { ...{acc_token: accToken},...params})
};
export const pjTaskTasktypeCount = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskTasktypeCount, { ...{acc_token: accToken},...params})
};
export const pjTaskChidAdd = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskChidAdd, { ...{acc_token: accToken},...params})
};
export const pjTaskChildUpdate = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskChildUpdate, { ...{acc_token: accToken},...params})
};
export const pjTaskChilDelete = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskChilDelete, { ...{acc_token: accToken},...params})
};





