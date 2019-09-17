
import {newContractApi} from 'api';
import {Message} from 'iview';
import router from "../../router";
const contract = {
    state: {
        contractId: null,
        judgeType: '',

        // saveContractData: {
        //     basic: null,
        //     files: [],
        //     price: [],
        //     copyPrice: null,
        //     ID: null,
        //     isEditFlag: false,
        //     isShowLeaveModal: false,
        //     priceIndex: null,
        //     setpStatus: {}
        // },


        contractData: {
            ID: null,
            menuList: [
                {
                    tab: '基础信息',
                    name: 'one',
                    selectFlag: true,
                    status: -1
                },
                {
                    tab: '合同扫描件',
                    name: 'two',
                    selectFlag: false,
                    status: -1
                },
                {
                    tab: '资源及金额',
                    name: 'three',
                    selectFlag: false,
                    status: -1,
                    list: []
                },
                {
                    tab: '结算清单',
                    name: 'four',
                    selectFlag: false,
                    status: -1
                }
            ],
            base: {},
            files: [],
            price: [],
            step: [],
            progress: [],
            copyPrice: null,
            setpStatus: {}
        }
    },
    mutations: {
        setContractData(state, data){
            state.contractData[data.type] = data.data;
        },
        setMenuListStatus(state, status){
            state.contractData.setpStatus.baseStatus = status.baseStatus;
            state.contractData.setpStatus.fileStatus = status.fileStatus;
            state.contractData.setpStatus.priceStatus = status.priceStatus;
            state.contractData.setpStatus.stepStatus = status.stepStatus;
            state.contractData.setpStatus.contractStatus = status.contractStatus;

            state.contractData.menuList[0].status = status.baseStatus;
            state.contractData.menuList[1].status = status.fileStatus;
            state.contractData.menuList[2].status = status.priceStatus;
            state.contractData.menuList[3].status = status.stepStatus;
        },
        setMenuChildList(state, list){
            state.contractData.menuList[2].list = list;
        },
        setMenuActive(state, index){
            state.contractData.menuList.forEach((creent)=>{
                creent.selectFlag = false;
            });
            if(index == 2){
                state.contractData.menuList[index].selectFlag = false;
            }else {
                state.contractData.menuList[index].selectFlag = true;
            }
        },
        setMenuChildActice(state, index){
            if(index == 999){
                state.contractData.menuList[2].list.forEach((creent)=>{
                    creent.selectFlag = false;
                });
            }else {
                state.contractData.menuList[2].list.forEach((creent)=>{
                    creent.selectFlag = false;
                });
                state.contractData.menuList[2].list[index].selectFlag = true;
            }
        },
        copyPrice(state, data) {
            state.contractData.copyPrice = JSON.parse(JSON.stringify(state.contractData.price));
        },
        updataPrice(state, data) {
            state.contractData.price = [];
            state.contractData.price = data;
        },
        pushPriceList(state, data) {
            state.contractData.price.push(data);
        },
        cleanContractInfo(state){
            state.contractData.ID = null;
            state.contractData.menuList= [
                {
                    tab: '基础信息',
                    name: 'one',
                    selectFlag: true,
                    status: -1
                },
                {
                    tab: '合同扫描件',
                    name: 'two',
                    selectFlag: false,
                    status: -1
                },
                {
                    tab: '资源及金额',
                    name: 'three',
                    selectFlag: false,
                    status: -1,
                    list: []
                },
                {
                    tab: '结算清单',
                    name: 'four',
                    selectFlag: false,
                    status: -1
                }
            ];
            state.contractData.base= {};
            state.contractData.files= [];
            state.contractData.price= [];
            state.contractData.step= [];
            state.contractData.progress= [];
            state.contractData.copyPrice= null;
            state.contractData.setpStatus= {};
        },
        deleteOrder(state,index){
            state.contractData.price.splice(index,1);
        }
    }
    ,
    actions: {
        //保存合同数据
        saveContractAction({ commit, state }, type) {
            return new Promise(async(resolve, reject) => {
                let ID = state.contractData.ID;
                let base = state.contractData.base;
                let files = state.contractData.files;
                let price = state.contractData.price;
                if (price.length > 0){
                    price.forEach((creent)=>{
                        if (creent.record) {
                            delete creent.record;
                        }
                    });
                }
                if (base.contract_name){
                    let parms = {
                        basic_list: JSON.stringify(base),
                        files_list: JSON.stringify(files),
                        price_list: JSON.stringify(price)
                    };
                    if (ID){
                        parms.contract_id = ID;
                    }
                    let {data} = await newContractApi.OutsourceUpdataContract(parms);
                    if (data.err_code == 0) {
                        let IDOBJ = {
                            type: 'ID',
                            data: data.data
                        };
                        commit('setContractData', IDOBJ);
                        router.push({path: '/epibol/contract', query: {ID: data.data}});
                        if (type){
                            Message.success('合同保存成功！');
                        }
                        resolve();
                    }
                }else {
                    Message.warning('合同名称不能为空！');
                }
            })
        },
        //获取合同信息
        getContractInfo({ commit , state },type) {
            return new Promise(async(resolve, reject) => {
                let ID = state.contractData.ID;
                let { data } = await newContractApi.getOutsourceContractInfo({contract_id: ID});
                if (data.err_code == 0) {
                    let base = data.base;
                    let files = data.files;
                    let price = data.price_list;
                    let step = data.step_list;
                    let progress = data.base.progress;
                    if (type == 'addOrder') {
                        let len = price.length;
                        price[len-1].selectFlag = true;
                    }
                    let progressData = {
                        type: 'progress',
                        data: progress
                    };
                    let baseData = {
                        type: 'base',
                        data: {
                            business_people: base.business_people,
                            contract_name: base.contract_name,
                            contract_price: base.contract_price,
                            customer_id: base.customer_id,
                            customer_name: base.customer_name,
                            customer_people_name: base.customer_people_name,
                            customer_phone: base.customer_phone,
                            end_time: base.end_time,
                            manager: base.manager,
                            project_expect_time: base.project_expect_time,
                            start_time: base.start_time
                        }
                    };
                    let filesData = {
                        type: 'files',
                        data: files
                    };
                    let priceData = {
                        type: 'price',
                        data: price
                    };
                    let stepData = {
                        type: 'step',
                        data: step
                    };
                    let status = {
                        baseStatus:data.contract_status,
                        fileStatus:data.file_status,
                        priceStatus:data.price_status,
                        stepStatus:data.step_status,
                        contractStatus:data.status
                    };
                    commit('setContractData', baseData);
                    commit('setContractData', progressData);
                    commit('setContractData', filesData);
                    commit('setContractData', priceData);
                    commit('setContractData', stepData);
                    commit('setMenuListStatus', status);
                    commit('setMenuChildList', price);
                    resolve(data);
                }
            })
        }
    }
};

export default contract;
