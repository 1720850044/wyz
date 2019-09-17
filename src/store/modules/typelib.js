/*类型库*/


const typelib = {
    state: {
        defId:null, // 默认id
        treeData:null,
    },
    mutations: {
        setDefId(state,data){
            state.defId = data
        },
        setTreeData(state,data){
            // console.log('66',data);

            state.treeData = data
        }
    },
    actions:{
        setDefIdAction({commit},data){

         commit('setDefId',data)
        }
    }
};

export default typelib;
