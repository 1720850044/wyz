import Vue from 'vue';
import {onlyAPI} from '../../apiConfig';
const url = 'index.php?r=';
const urls = {
    resourceIndex:onlyAPI.project_project_resourceindex,
    resourcePage:onlyAPI.project_project_resourcepage,
    tasktypeCount:onlyAPI.project_task_tasktype_count,
    stagePage:onlyAPI.project_stage_page,
    resourceCount:onlyAPI.project_project_resourcecount,
    resourceProjectInfo:onlyAPI.project_project_resourceproject_info,
}
let accToken = null;

/** 项目资源初始化接口
 *
 * */
export const pjResourceIndex =  (params) => {
    return new Promise(async (resolve, reject) => {
        let data = await Vue.$axios.post(url + urls.resourceIndex, params);
        accToken = sessionStorage.accToken ? sessionStorage.accToken : '';
        resolve(data);
    })

};

export const pjTasktypeCount = async (params) => {

    return Vue.$axios.post(url + urls.tasktypeCount, {...params,...{acc_token:accToken}})

};
export const pjStagePage = async (params) => {

   return Vue.$axios.post(url + urls.stagePage, {...params,...{acc_token:accToken}})

};

export const pjResourceCount = async (params) => {
    return Vue.$axios.post(url + urls.resourceCount, {...params,...{acc_token:accToken}})

};

export const pjresourcePage = async (params) => {
    return Vue.$axios.post(url + urls.resourcePage, {...params,...{acc_token:accToken}})

};
export const resourceProjectInfo = async (params) => {
    return Vue.$axios.post(url + urls.resourceProjectInfo, {...params,...{acc_token:accToken}})

};



