import Vue from 'vue';
import {onlyAPI} from '../../apiConfig';
const url = 'index.php?r=';
const urls = {
    surveyIndex:onlyAPI.project_project_generalindex,
    surveyProjectInfo:onlyAPI.project_project_info,
    surveyCountShow:onlyAPI.project_count_show_pro,

}
let accToken = null;

/** 项目概况初始化接口
 *
 * */

export const surveyIndex = async (params) => {
    await Vue.$axios.post(url + urls.surveyIndex, params)
     accToken = sessionStorage.accToken?sessionStorage.accToken:'';

};

export const surveyProjectInfo = async (params) => {
    return Vue.$axios.post(url + urls.surveyProjectInfo, {...params,...{acc_token:accToken}})

};
export const surveyCountShow = async (params) => {
   return Vue.$axios.post(url + urls.surveyCountShow, {...params,...{acc_token:accToken}})

};
