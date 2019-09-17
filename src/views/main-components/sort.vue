<template>
  <dl>
    <dd v-for="(item,index) in sortList" :key="index" @click="choseSort(index)" :class="{'byAsc':sortIndex == index}">
      {{item.label}}
    </dd>
  </dl>
</template>

<script>
    export default {
        name: 'sort',
        data() {
            return {
                sortIndex: 0
            };
        },
        props: {
            num: {
                type: Number,
                default: 0
            },
            sortList: {
                type: Array,
                default: []
            }
        },
        methods: {
            choseSort(index) {
                this.sortIndex = index;
                this.$emit('choiced', index);
            }
        }
    };
</script>
