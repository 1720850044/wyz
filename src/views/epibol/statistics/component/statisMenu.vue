<template>
    <div class="ivu-div">
        <Menu  :open-names="['1']" width="auto" @on-select="selectMenu" :active-name="activeName" ref="side_menu">
            <Submenu name="1" >
                    <template slot="title">
                        <i class="iconfonts icon-zhexiantu"></i>
                        统计概述
                    </template>
                    <MenuItem :name="(index+2)" v-for="(item,index) in menuData" :key="index">{{item.title}}</MenuItem>
            </Submenu>
        </Menu>
     </div>
</template>
<script>
export default {
    data(){
        return {
            menuData: [],
            activeName: '2',
        };
    },
    mounted(){
        this.getMenuData();
    },
    methods: {
        // changeMenu
        selectMenu(name){
            console.log('当前选中的是', name);
        },
        // MenuData
        getMenuData(){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+this.$GLOBALAPI.task_catalog_list;
            _this.$axios.get(url).then(msg=>{
                delete msg.data.err_code;
                delete msg.data.err_message;
                console.log(JSON.stringify(msg.data));
                for (let i in msg.data){
                    _this.menuData.push(msg.data[i]);
                }
                _this.$nextTick(() => {
                    _this.$refs.side_menu.updateOpened();
                    _this.$refs.side_menu.updateActiveName();
                    _this.activeName=_this.menuData[0].Titem[0].title;
                });
            });
        }

    }
};
</script>
