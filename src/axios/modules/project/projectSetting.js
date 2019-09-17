import Vue from 'vue';
import {onlyAPI} from '../../apiConfig';
const url = 'index.php?r=';
const urls = {
    projectSetIndex: onlyAPI.company_project_setindex, //  project/page/project-set/index
    projectSetWorkTime: onlyAPI.company_set_work_time, //task/project/set-work-time
    projectSetUpdate: onlyAPI.company_project_setupdate, //task/project/update
    projectSetUpdateCo: onlyAPI.company_update_collaboration, //system/auth/update-collaboration
    projectSetDelete: onlyAPI.company_delete_collaboration, //system/auth/delete-collaboration
    projectSetAdd: onlyAPI.company_add_collaboration, //system/auth/add-collaboration
    projectSetList: onlyAPI.company_collaboration_list, // system/auth/collaboration-list
    projectSetContract: onlyAPI.company_get_contract_list, //task/contract/get-contract-list
    projectGetWorkTime: onlyAPI.company_get_work_time_by_project, //task/project/get-work-time-by-project
    projectSetInfo: onlyAPI.company_project_info, //task/project/project-info
    projecSetSelect: onlyAPI.company_select_info, //system/auth/select-info



}

let accToken = null;
/** 项目团队初始化接口
 *
 * */
export const projectSetIndex = async (params) => {
    return new Promise(async (resolve, reject) => {
        let data = await Vue.$axios.post(url + urls.projectSetIndex, params);
        sessionStorage.setAccToken = data.data.data.acc_token;
        accToken = sessionStorage.setAccToken ? sessionStorage.setAccToken : '';
        resolve(data);
    })
};

export const projectSetContract = async (params) => {
    return Vue.$axios.post(url + urls.projectSetContract, {...params, ...{acc_token: accToken}})

};
export const projectSetWorkTime = async (params) => {
    return Vue.$axios.post(url + urls.projectSetWorkTime, {...params, ...{acc_token: accToken}})

};
export const projectGetWorkTime = async (params) => {
    return Vue.$axios.post(url + urls.projectGetWorkTime, {...params, ...{acc_token: accToken}})

};
export const projectSetUpdate = async (params) => {
    return Vue.$axios.post(url + urls.projectSetUpdate, {...params, ...{acc_token: accToken}})

};
export const projectSetList = async (params) => {
    return Vue.$axios.post(url + urls.projectSetList, {...params, ...{acc_token: accToken}})

};
export const projectSetAdd = async (params) => {
    return Vue.$axios.post(url + urls.projectSetAdd, {...params, ...{acc_token: accToken}})

};
export const projectSetUpdateCo = async (params) => {
    return Vue.$axios.post(url + urls.projectSetUpdateCo, {...params, ...{acc_token: accToken}})

};
export const projectSetDelete = async (params) => {
    return Vue.$axios.post(url + urls.projectSetDelete, {...params, ...{acc_token: accToken}})

};export const projecSetSelect = async (params) => {
    return Vue.$axios.post(url + urls.projecSetSelect, {...params, ...{acc_token: accToken}})

};




