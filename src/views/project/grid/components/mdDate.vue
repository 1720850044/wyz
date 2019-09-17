<template>
  <div class="module">
    <Card style="width: 350px;">
       <div class="module-title">
          <slot name="title">
            <Icon type="navicon-round"></Icon>日程提醒
            <span v-if="visible">{{number}}</span>
          </slot>
          <Icon type="close-round" @click="remove()" class="close" v-if="operable"></Icon>
        </div>
        <div class="module-body">
          <!-- <slot></slot> -->
          <ul>
            <li v-for="(item,index) in dateList" :key="index">
              <span v-if="item.type == 1">假</span>
              <span v-else-if="item.type == 2">班</span>
              <span v-else-if="item.type == 3">加</span>
              <span v-else-if="item.type == 4"><Icon type="volume-medium"></Icon></span>
              {{item.title}}
            </li>
          </ul>
        </div>
    </Card>
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
    data() {
        return {
            dateList: [{
                type: 1,
                title: '春节 2018-1-15 至 2018-2-1'
            }, {
                type: 2,
                title: '春节 2018-1-15 至 2018-2-1'
            }, {
              type: 3,
              title: '春节 2018-1-15 至 2018-2-1'
          }, {
            type: 1,
            title: '春节 2018-1-15 至 2018-2-1'
        }, {
          type: 4,
          title: '春节 2018-1-15 至 2018-2-1'
      }]
        };
    },
    methods: {
        remove(item) {
            this.$emit('removed', item);
        }
    }
};
</script>

<style scoped lang="less">
.close{
  float: right;
}
.module-body{
  margin: 20px 0;
  float: left;
  height: 170px;
  overflow: auto;
  ul{
    li{
      float: left;
      width: 100%;
      line-height: 34px;
      span{
        display: inline-block;
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        background: #ff9900;
        color: #fff;
        margin-right: 10px;
      }
    }
  }
}
</style>
