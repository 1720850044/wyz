import Vue from 'vue';
import {onlyAPI} from '../../apiConfig';
const url = 'index.php?r=';
const urls = {
    teamIndex:onlyAPI.project_team_workindex,
    getmembers:onlyAPI.project_get_members,
    joinedMembers:onlyAPI.project_team_workjoined_members,
    teamPage:onlyAPI.project_team_workpage,
    removeMember:onlyAPI.project_remove_member,
    joinProject:onlyAPI.project_join_the_project,
}

let accToken = null;
/** 项目团队初始化接口
 *
 * */
export const pjTeamIndex = async (params) => {
    await Vue.$axios.post(url + urls.teamIndex, params)
    accToken = sessionStorage.accToken ? sessionStorage.accToken : '';
};

export const pjTeamGetmembers = async (params) => {
    return Vue.$axios.post(url + urls.getmembers, {...params, ...{acc_token: accToken}})

};
export const pjTeamJoinedMembers = async (params) => {
    return Vue.$axios.post(url + urls.joinedMembers, {...params, ...{acc_token: accToken}})

};

export const pjTeamTeamPage = async (params) => {
    return Vue.$axios.post(url + urls.teamPage, {...params, ...{acc_token: accToken}})

};

export const pjTeamRemoveMember = async (params) => {
    return Vue.$axios.post(url + urls.removeMember, {...params, ...{acc_token: accToken}})

};
export const pjTeamJoinProject = async (params) => {
    return Vue.$axios.post(url + urls.joinProject, {...params, ...{acc_token: accToken}})

};



