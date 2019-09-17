<template>
    <div>
        <form id="pay_form" name="pay_form" :action="payStore.post_url" method="post">
            <input type="hidden" name="version" id="version" :value="payStore.version" />
            <input type="hidden" name="encoding" id="encoding" :value="payStore.encoding" />
            <input type="hidden" name="txnType" id="txnType" :value="payStore.txnType" />
            <input type="hidden" name="txnSubType" id="txnSubType" :value="payStore.txnSubType" />
            <input type="hidden" name="bizType" id="bizType" :value="payStore.bizType" />
            <input type="hidden" name="frontUrl" id="frontUrl" :value="payStore.frontUrl" />
            <input type="hidden" name="backUrl" id="backUrl" :value="payStore.backUrl" />
            <input type="hidden" name="signMethod" id="signMethod" :value="payStore.signMethod" />
            <input type="hidden" name="channelType" id="channelType" :value="payStore.channelType" />
            <input type="hidden" name="accessType" id="accessType" :value="payStore.accessType" />
            <input type="hidden" name="currencyCode" id="currencyCode" :value="payStore.currencyCode" />
            <input type="hidden" name="merId" id="merId" :value="payStore.merId" />
            <input type="hidden" name="orderId" id="orderId" :value="payStore.orderId" />
            <input type="hidden" name="txnTime" id="txnTime" :value="payStore.txnTime" />
            <input type="hidden" name="txnAmt" id="txnAmt" :value="payStore.txnAmt" />
            <input type="hidden" name="payTimeout" id="payTimeout" :value="payStore.payTimeout" />
            <input type="hidden" name="certId" id="certId" :value="payStore.certId" />
            <input type="hidden" name="signature" id="signature" :value="payStore.signature" />
            <!-- <input type="submit" type="hidden">-->
        </form>
    </div>
</template>
<script>
export default {
    data(){
        return {
            payData: {}
        };
    },
    computed: {
        payStore(){
            return this.$store.state.paySkip.payData;
        }
    },
    mounted(){
        document.pay_form.submit();
    }
};
</script>
