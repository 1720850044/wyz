'use strict'

import Axios from '../../axios/axios'
import {onlyAPI} from '../../axios/apiConfig';
import global from '../../global/Global'
import Cookie from 'js-cookie'

const state = {
    deptList: [],
    dutyList: [],
    postList: [],
    authList: [],
    deptLFComId: 0,
    deptLFdeptId: 0,
    dutyLFComId: 0,
    dutyLFpostId: 0
}

const getters = {
    getDeptList: state => state.deptList,
    getDutyList: state => state.dutyList,
    getPostList: state => state.postList,
    getAuthList: state => state.authList,
    getDeptLFComId: state => state.deptLFComId,
    getDeptLFdeptId: state => state.deptLFdeptId,
    getDutyLFComId: state => state.dutyLFComId,
    getDutyLFpostId: state => state.dutyLFpostId,
}

const actions = {
    fetchDeptList({commit, state}, data) {
        Axios.post(global.baseRouter + onlyAPI.task_list, data)
            .then(res => res.data)
            // .then(res => res.data)
            .then(res => {
                //console.log(res)
                let fetchList = res.data;
                fetchList.push({
                    company_id: Cookie.get('company').id,
                    id: 0,
                    member_count: res.free_member,
                    name: '未分配部门'
                })
                // sessionStorage.fetchList=JSON.stringify(fetchList)
                // console.log('获取部门列表',fetchList,res.free_member)
                commit('updateDeptList', fetchList);
                commit('updateDeptLFComId', Cookie.get('company').id);
                commit('updateDeptLFdeptId', res.data[0].id);
            })
    },
    fetchDutyList({commit, state}, data) {

        Axios.post(global.baseRouter + onlyAPI.task_postlist, data)
            .then(res => res.data)
            // .then(res => res.data)
            .then(res => {
                let fetchList = res.data;
                fetchList.push({
                    company_id: Cookie.get('company').id,
                    id: 0,
                    member_count: Math.abs(res.free_member),
                    name: '未分配职能'
                })
                commit('updateDutyList', fetchList);
                commit('updateDutyLFComId', Cookie.get('company').id);
                commit('updateDutyLFpostId', res.data[0].id);
            })
    },
    fetchAuthList({commit, state}, data) {
        Axios.post(global.baseRouter + onlyAPI.system_auth_list, data)
            .then(res => res.data)
            .then(res => {
                // console.log(res)
                let fetchList = res.data
                let postNameList = [];
                let authList = [];
                fetchList.forEach((item) => {
                    postNameList.push(item)
                });
                postNameList.forEach((item, index) => {
                    authList.push(item.auth)
                    // authList.push({auth:item.auth, postid: item.id})
                })
                commit('updatePostList', postNameList);
                commit('updatAuthList', authList);
            })
    }
}

const mutations = {
    updateDeptList(state, data) {
        state.deptList = data;
    },
    updateDeptLFComId(state, data) {
        state.deptLFComId = data;
    },
    updateDeptLFdeptId(state, data) {
        state.deptLFdeptId = data;
    },
    updateDutyList(state, data) {
        state.dutyList = data;
    },
    updateDutyLFComId(state, data) {
        state.dutyLComId = data;
    },
    updateDutyLFpostId(state, data) {
        state.dutyLFpostId = data;
    },
    updatePostList(state, data) {
        state.postList = data;
    },
    updatAuthList(state, data) {
        state.authList = data;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
