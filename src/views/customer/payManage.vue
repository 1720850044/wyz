<template>
    <div class="payManage">
        <div class="title">
            <span>支付项目：</span><em>Q版Spine动画特效制作欢迎大家涌跃报名测试</em>
        </div>
        <div class="title">
            <span>支付金额：</span><em><i>6500.00</i>元</em>
        </div>
        <div class="payStyle">
            <dl>
                <dt>线上支付</dt>
                <dd>
                    <RadioGroup v-model="payStatus">
                        <Radio label="1"><img src="./epibolCompany/images/1.png" alt="微信支付"></Radio>
                        <Radio label="2"><img src="./epibolCompany/images/2.png" alt="支付宝支付"></Radio>
                        <Radio label="3"><img src="./epibolCompany/images/3.png" alt="银联支付"></Radio>
                    </RadioGroup>
                </dd>
            </dl>
        </div>
        <Button type="warning" class="payBtn" @click.native="atoncePay">立即支付</Button>
        {{ value }}
        <Button @click="handleRender">Custom content</Button>
    </div>
</template>
<script>
export default {
    data(){
        return {
            payStatus: '1',
            data: {},
            value: '1231231'
        };
    },
    computed: {
        testID(){
            return this.$route.params.id;
        }
    },
    methods: {
        atoncePay(){
            let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_payment;
            let parmas={
                test_id: this.testID,
                pay_status: this.payStatus
            };
            this.$axios.post(url, parmas).then(msg=>{
                if (typeof(msg.data.msg)==='object'){
                  //传信息到Vuex
                    this.$store.commit('actionPaySkip', msg.data.msg);
                    this.$router.push('/customer/paySkip');

                } else if (msg.data.err_code>0){
                    this.$$Message.error(msg.data.err_message);
                }
            });
        },
        handleRender () {
            this.$Modal.confirm({
                render: (h)=>h('Input', {
                    props: {
                        value: this.value
                    },
                    on: {
                        input: (val)=>{
                            this.value=val;
                        }
                    }
                })
            });
        }
    }
};
</script>
<style lang="less">
@import './epibolCompany/style/payManage.less';
</style>
