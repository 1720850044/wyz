'use strict'

import Vue from 'vue'
import Axios from '../../axios/axios'
import {onlyAPI} from '../../axios/apiConfig'
import global from '../../global/Global'

const state = {
    qualityId:null,
    ndsSortList: [
        {
            label: '最新上传',
            icon: 'ios-arrow-thin-down',
            value: 0
        }, {
            label: '待审天数',
            icon: 'ios-arrow-thin-down',
            value: 1
        }, {
            label: '剩余时间',
            icon: 'ios-arrow-thin-up',
            value: 2
        }
    ],
    nsfkSortList: [
        {
            label: '等待修改',
            icon: 'ios-arrow-thin-down'
        }, {
            //   label: '反馈时间',
            //   icon: 'ios-arrow-thin-down'
            // }, {
            label: '剩余时间',
            icon: 'ios-arrow-thin-up'
        }
    ],
    khdsSortList: [
        {
            label: '送审时间',
            icon: 'ios-arrow-thin-down'
        }, {
            label: '待审天数',
            icon: 'ios-arrow-thin-down'
        }, {
            label: '剩余时间',
            icon: 'ios-arrow-thin-up'
        }
    ],
    khfkSortList: [
        {
            label: '反馈时间',
            icon: 'ios-arrow-thin-down'
        }, {
            label: '等待修改',
            icon: 'ios-arrow-thin-down'
        }, {
            label: '剩余时间',
            icon: 'ios-arrow-thin-up'
        }
    ],
    statusList: [
        {
            label: '待开始',
            value: 1
        }, {
            label: '执行中',
            value: 2
        }, {
            label: '暂停',
            value: 3
        }, {
            label: '完成',
            value: 4
        }
    ],
    taskType: [],
    subProjectList: [],
    detail: {
        projectInfo: null,
        setDetailAll: null,
        taskInfo: null,
    },
    primaryMission: null,      // 主任务id
    userStatus: null,          //进入工作台任务的状态 成员或者组长
};

const getters = {
    getNdsSortList: state => state.ndsSortList,
    getNsfkSortList: state => state.nsfkSortList,
    getKhdsSortList: state => state.khdsSortList,
    getKhfkSortList: state => state.khfkSortList,
    getStatusList: state => state.statusList,
    getTaskType: state => state.taskType,
    getSubProjectList: state => state.subProjectList
};

const actions = {
    fetchTaskList({commit, state}, data) {
        Axios.post(global.baseRouter + onlyAPI.task_project_tasktypelist, data)
            .then(response => response.data)
            .then(response => response.data)
            .then(response => {
                commit('updateTaskList', response)
            })
    },
    fetchSubProject({commit, state}, data) {
        Axios.post(global.baseRouter + onlyAPI.task_child_list, data)
            .then(res => res.data)
            .then(res => res.data)
            .then(res => {
                commit('updateSubProjectList', res)
            })
    }
};

const mutations = {
    setQualityId(state,data){
        state.qualityId = data
    },
    updateTaskList(state, data) {
        state.taskType = data;
    },
    updateSubProjectList(state, data) {
        state.subProjectList = data
    },
    setProjectInfoDetails(state, data) {
        Vue.set(state.detail, 'projectInfo', data)

    },
    /*进入任务详情时获得List*/
    setDetailAll(state, data) {
        Vue.set(state.detail, 'setDetailAll', data)
    },
    /*获取主任务ID*/
    setPrimaryMission(state, data) {
        state.primaryMission = data;
    },
    /*获取工作台任务的身份- 成员或者组长*/
    setUserStatus(state, data) {
        state.userStatus = data;
    },
    /*进入任务详情时获得info*/
    setTaskInfo(state, data) {
        Vue.set(state.detail, 'taskInfo', data)
    },


};

export default {
    state,
    getters,
    actions,
    mutations
}
