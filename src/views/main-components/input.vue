<template>
  <div class="myinput">
      <input type="text" :placeholder="text" @keyup.enter.native="search()"/> 
      <span class="search"></span>
  </div>
</template>

<script>
export default {
    name: 'input',
    data() {
        return {

        };
    },
    props: {
        text: {
            type: String,
            default: ''
        }
    },
    methods: {
        search() {
            this.$emit('enter');
        }
    }
};
</script>

<style scoped>

</style>
