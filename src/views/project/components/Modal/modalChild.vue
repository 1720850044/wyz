<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal">
                <div class="modal-header">
                    <h1>这是Modal标题</h1>
                </div>
                <div class="modal-body">
                  <h1>这是Modal内容</h1>
                </div>
                <div class="modal-footer">
                <slot name="footer"> 这是Modal脚部
                <button type="button" class="btn-green" @click="close">关闭</button>
                </slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        components: {},
        data() {
            return {};
        },
        methods: {
            close: function () {
                this.$emit('close');
            },
        },
        mounted() {

        },
    };
</script>

<style scoped>

</style>