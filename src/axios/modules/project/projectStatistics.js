import Vue from 'vue';
import {onlyAPI} from '../../apiConfig';
const url = 'index.php?r=';
const urls = {
    statisticsIndex:onlyAPI.project_project_countindex,
    statisticsCount:onlyAPI.project_project_count,
    statisticsTaskCount:onlyAPI.project_task_count,
    statisticsByProject:onlyAPI.project_task_status_by_project,
    statisticsAuditRate:onlyAPI.project_audit_pass_rate,
    statisticsWorkByProject:onlyAPI.project_tasktype_work_time_by_project,

}
let accToken = null;

/** 项目统计初始化接口
 *
 * */
export const statisticsIndex = async (params) => {
     await Vue.$axios.post(url + urls.statisticsIndex, params);
     accToken = sessionStorage.accToken?sessionStorage.accToken:'';
};

export const statisticsCount = async (params) => {
    return Vue.$axios.post(url + urls.statisticsCount, {...params,...{acc_token:accToken}})

};
export const statisticsTaskCount = async (params) => {
    return Vue.$axios.post(url + urls.statisticsTaskCount, {...params,...{acc_token:accToken}})

};

export const statisticsByProject = async (params) => {
    return Vue.$axios.post(url + urls.statisticsByProject, {...params,...{acc_token:accToken}})

};

export const statisticsAuditRate = async (params) => {
   return Vue.$axios.post(url + urls.statisticsAuditRate, {...params,...{acc_token:accToken}})

};
export const statisticsWorkByProject = async (params) => {
    return Vue.$axios.post(url + urls.statisticsWorkByProject, {...params,...{acc_token:accToken}})

};



