import Cookies from 'js-cookie';
import api from 'api';
const notice = {
    state: {
        noticeNum:sessionStorage.noticeNum?JSON.parse(sessionStorage.noticeNum):{
            bid:0,
            contract:0,
            project:0,
            system:0,
            task:0,
            total:0,
        }
    },
    getter(){

    },
    mutations: {
        setNoticeNum(state,data){
            state.noticeNum = {...data}
        }
    },
    actions:{
        async getMsgNoticeNum({commit}) {
            let {data} = await api.systemNoticeNum();
            if(data && data.data){
                commit('setNoticeNum',data.data)
                sessionStorage.noticeNum = JSON.stringify(data.data);
            }
        }
    }
};

export default notice;
