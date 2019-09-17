import Cookies from 'js-cookie';

const user = {
    state: {
        groupInfo:null,// 列表点击之后获取
    },
    mutations: {
        groupInfo(state,data){
            state.groupInfo = data
        }

    },
    actions:{

    }
};

export default user;
