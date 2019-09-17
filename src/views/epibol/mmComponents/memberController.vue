<template>
    <Button type="primary" icon="plus-round" @click="clickButton">{{$t('memberAauthority.power_addMember')}}</Button>
</template>

<script>
    export default {
        name: 'membercontroller',
        data(){
            return {
            };
        },
        methods: {

        /**
         * 点击按钮
         */
            clickButton(info) {
            // console.log(info);
            // window.location.reload()
            },
        }
    };
</script>