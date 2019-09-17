import Vue from 'vue';
import {onlyAPI} from '../../apiConfig';
const url = 'index.php?r=';
const urls = {
    taskTypeIndex:onlyAPI.project_project_tasktypeindex,
    taskTypeCateList:onlyAPI.project_cate_list,
    taskTypeInfo:onlyAPI.project_project_tasktypeinfo,
    taskTypeList:onlyAPI.project_list,
    taskTypeAdd:onlyAPI.project_project_tasktypeadd,
    taskTypeTaskInfo:onlyAPI.project_task_info,
    abilityList:onlyAPI.company_abilitylist,
    taskTypeNorms:onlyAPI.project_norms,
    taskTypeUpdate:onlyAPI.project_project_tasktypeupdate,
    taskTypeDelete:onlyAPI.project_project_tasktypedelete,
}

/** 项目规范初始化接口
 *
 * */
let accToken = null;
export const taskTypeIndex = async (params) => {
    return new Promise(async (resolve, reject) => {
       let data =  await Vue.$axios.post(url + urls.taskTypeIndex, params)
        accToken = sessionStorage.accToken ? sessionStorage.accToken : '';
        resolve(data);
    })
};

export const taskTypeCateList = async (params) => {
    return Vue.$axios.post(url + urls.taskTypeCateList, {...params,...{acc_token:accToken}})

};
export const taskTypeInfo = async (params) => {
    return Vue.$axios.post(url + urls.taskTypeInfo, {...params,...{acc_token:accToken}})

};

export const taskTypeList = async (params) => {
    return Vue.$axios.post(url + urls.taskTypeList, {...params,...{acc_token:accToken}})

};

export const taskTypeAdd = async (params) => {
    return Vue.$axios.post(url + urls.taskTypeAdd, {...params,...{acc_token:accToken}})

};
export const taskTypeTaskInfo = async (params) => {
    return Vue.$axios.post(url + urls.taskTypeTaskInfo, {...params,...{acc_token:accToken}})

};
export const abilityList = async (params) => {
    return Vue.$axios.post(url + urls.abilityList, {...params,...{acc_token:accToken}})

};
export const taskTypeNorms = async (params) => {
    return Vue.$axios.post(url + urls.taskTypeNorms, {...params,...{acc_token:accToken}})

};
export const taskTypeUpdate = async (params) => {
    return Vue.$axios.post(url + urls.taskTypeUpdate, {...params,...{acc_token:accToken}})

};
export const taskTypeDelete = async (params) => {
    return Vue.$axios.post(url + urls.taskTypeDelete, {...params,...{acc_token:accToken}})

};


