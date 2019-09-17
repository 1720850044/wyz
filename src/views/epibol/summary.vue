<template>
    <div>
        <Button type="primary" @click="linkTo('/project')">普通项目</Button>
        <Button type="primary" @click="linkTo('/project')">分包项目</Button>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        methods: {
            linkTo(url, params) {
                if (params) {
                    this.$router.push({path: url, query: params});
                } else {
                    this.$router.push(url);
                }
            }

        }
    };
</script>

<style>

</style>
