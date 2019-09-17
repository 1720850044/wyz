<template>
    <modal-child v-show="isTabModal" @close="closeTabmodal"></modal-child>
        <Button type="success" @click="showModal">打开modal</Button>
</template>

<script>
    import modalChild from "../../components/Modal/modalChild";
    export default {
        components: {
            modalChild
        },
        data() {
            return {
                isTabModal: false
            };
        },
        methods: {
            showModal: function () {
                this.isTabModal = true;
            },
            closeModal: function () {
                this.isTabModal = false;
            },
        },
        mounted() {

        },
    };
</script>

<style scoped>

</style>