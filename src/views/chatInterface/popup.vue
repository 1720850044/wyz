<template>
    <div class="popup" @click="opupFlag" v-if="thisSrc.thisFlag">
        <div class="popupDiv">
            <img :src="thisSrc.thisSrc"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'popup',
        props: ['thisSrc'],
        methods: {
            opupFlag(){
                this.thisSrc.thisFlag = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    .popup{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        .popupDiv{
            display: inline-block;
            max-width: 1024px;
            max-height: 768px;
            img{max-width: 1024px;max-height: 768px;}
        }
    }
</style>
