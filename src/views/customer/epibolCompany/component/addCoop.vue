<template>
    <div class="addCoop">
        <dl>
            <dt>公司名称</dt>
            <dd>
                <Input v-model="company" placeholder="输入公司名称" :disabled="isEditer" @keyup.13.native="searchCompany($event)" @on-blur="searchCompany"></Input>
                <div class="demo-spin-col" v-if="upload">
                    <Spin fix>加载中...</Spin>
                </div>
            </dd>
        </dl>
        <dl>
            <dt>联系人</dt>
            <dd>
                <Input v-model="contactPeople"></Input>
            </dd>
        </dl>
        <dl>
            <dt>联系电话</dt>
            <dd>
                <Input v-model="tel"></Input>
            </dd>
        </dl>
        <dl>
            <dt>备注说明</dt>
            <dd>
                <Input v-model="explain" type="text" placeholder="备注说明.."></Input>
            </dd>
        </dl>
    </div>
</template>
<script>
export default {
    data(){
        return {
            Cid: null,
            company: null,
            contactPeople: '',
            tel: '',
            explain: '',
            spinShow: true,
            upload: false,
            Tid: null,
            isEditer: false
        };
    },
    mounted(){
        this.$bus.on('newAddCompanyFlag', ()=>{
            this.isEditer = false;
        });
        this.$bus.on('editCoopData', (val)=>{
            this.isEditer = true;
            this.Tid=val.Tid;
            this.company=val.company;
            this.contactPeople=val.contactPeople;
            this.tel=val.tel;
            this.explain=val.explain;
            this.addLabDIV = false;
        });
    },
    methods: {
        // 清空数据
        clearData(){
            this.Cid=null;
            this.company=null;
            this.contactPeople='';
            this.tel='';
            this.explain='';
        },
        editCoop(){
            let obj={
                Tid: this.Tid,
                Cid: this.Cid,
                company: this.company,
                contactPeople: this.contactPeople,
                tel: this.tel,
                explain: this.explain,
            };
            this.$bus.emit('emitCoopData', obj);
        },
        // 搜索公司
        searchCompany(e){
            let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_search_company;
            let params={
                company_name: this.company
            };
            if (this.company==null||this.company==""){
                return;
            }
            this.upload=!this.upload;
            this.$axios.post(url, params).then(msg=>{
                this.upload=!this.upload;
                let msgData=msg.data;
                if (msgData.company==undefined){
                    this.$Message.error('公司名称不正确!');
                } else {
                    this.Cid=msgData.id;
                    this.company=msgData.company;
                    this.contactPeople=msgData.contact_people;
                    this.tel=msgData.tel;
                }
            });
        }
    },
    updated(){
        this.editCoop();
    }
};
</script>
<style lang="less" scoped>
    @import '../style/epibolCompany';
</style>
