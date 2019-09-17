<template>
  <div class="module">
    <Card style="width:350px">
       <div class="module-title">
          <slot name="title">
            <Icon :type="icon"></Icon>{{title}} 
            <span v-if="visible">{{number}}</span>
          </slot>
          <Icon type="close-round" @click="remove()" class="close" v-if="operable"></Icon>
        </div>
        <div class="module-body">
          <slot></slot>
        </div>
    </Card>
    <!-- <div class="box">
      <div class="module-header">
        <div class="module-title">
          <slot name="title">
            <Icon :type="icon"></Icon>{{title}} 
            <span v-if="visible">{{number}}</span>
          </slot>
          <Icon type="close-round" @click="remove()"></Icon>
        </div>
      </div>
      <div class="module-body">
        <slot></slot>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
    name: 'module',
    props: {
        title: {
            type: String,
            defaule: ''
        },
        icon: {
            type: String,
            defaule: 'navicon-round'
        },
        visible: {
            type: Boolean,
            defaule: false
        },
        number: {
            type: Number,
            defaule: null
        },
        operable: {
            type: Boolean,
            defaule: false
        }
    },
    methods: {
        remove(item) {
            this.$emit('removed', item);
        }
    }
};
</script>

<style>
.close{
  float: right;
}
</style>
