import Vue from 'vue';
import {onlyAPI} from '../../apiConfig';
const url = 'index.php?r=';
const urls = {
    projectInfoIndex:onlyAPI.project_project_infoindex, //project/page/task/index
    projectInfoStart:onlyAPI.project_start, ///task/task/start
    projectInfoPause:onlyAPI.project_pause, ///task/task/pause
    projectInfoContinue:onlyAPI.project_continue, ///task/task/continue
    projectInfoAdd:onlyAPI.project_add, ////task/task/add
    projectInfoInfo:onlyAPI.project_info, //task/task/info
    projectInfoStageInfo:onlyAPI.project_stage_info, //task/task/stage-info
    projectInfoDelete:onlyAPI.project_delete, ///task/task/delete
    projectInfoDetail:onlyAPI.page_init, ///task/task/delete
}

let accToken = null;
/**项目团队初始化接口
 *
 */
export const projectInfoIndex = async (params) => {
    return new Promise(async (resolve, reject) => {
        let data = await Vue.$axios.post(url + urls.projectInfoIndex, params)
        accToken = sessionStorage.accToken ? sessionStorage.accToken : '';
        resolve(data);
    })
};

export const projectInfoStart = async (params) => {
    return Vue.$axios.post(url + urls.projectInfoStart, {...params, ...{acc_token: accToken}})

};
export const projectInfoPause = async (params) => {
    return Vue.$axios.post(url + urls.projectInfoPause, {...params, ...{acc_token: accToken}})

};

export const projectInfoAdd = async (params) => {
    return Vue.$axios.post(url + urls.projectInfoAdd, {...params, ...{acc_token: accToken}})

};

export const projectInfoInfo = async (params) => {
    return Vue.$axios.post(url + urls.projectInfoInfo, {...params, ...{acc_token: accToken}})

};
export const projectInfoStageInfo = async (params) => {
    return Vue.$axios.post(url + urls.projectInfoStageInfo, {...params, ...{acc_token: accToken}})

};
export const projectInfoDelete = async (params) => {
    return Vue.$axios.post(url + urls.projectInfoDelete, {...params, ...{acc_token: accToken}})

};
export const pjTaskProjectAdd = async (params) => {
    return Vue.$axios.post(url + urls.pjTaskProjectAdd, {...params, ...{acc_token: accToken}})
};
export const projectInfoContinue = async (params) => {
    return Vue.$axios.post(url + urls.projectInfoContinue, {...params, ...{acc_token: accToken}})
};
export const projectInfoDetail = async (params) => {
    return Vue.$axios.post(url + urls.projectInfoDetail, {...params, ...{acc_token: accToken}})
};
