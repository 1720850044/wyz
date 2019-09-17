<template>
  <div>
    <main-native>
      <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>
    </main-native>
  </div>
</template>

<script>
import mainNative from '../main-components/mainNative.vue';
export default {
    components: {
        mainNative
    },
    data() {
        return {

        };
    },
    created() {
        let title = "正在开发中";
        let content = '<p>程序小哥哥正在努力开发中</p><p>敬请期待后续内容！</p>';
        this.$Modal.warning({
            title: title,
            content: content
        });
    }
};
</script>

<style>

</style>
