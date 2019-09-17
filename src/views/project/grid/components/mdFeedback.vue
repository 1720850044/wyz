<template>
  <div class="module">
    <Card style="width: 430px;">
       <div class="module-title">
          <slot name="title">
            <Icon type="navicon-round"></Icon>反馈待处理
            <span v-if="visible">{{number}}</span>
          </slot>
          <Icon type="close-round" @click="remove()" class="close" v-if="operable"></Icon>
        </div>
        <div class="module-body">
          <!-- <slot></slot> -->
          <div class="item" v-for="(item,index) in feedbackList" :key="index">
            <div class="pic" :style="`background: url(${item.src}) center center / 100% 100% no-repeat`">
              <div class="tips" v-if="item.endStatus == 1">暂停</div>
              <div class="timetips">{{item.time}}</div>
            </div>
            <div class="title">{{item.title}}</div>
            <div class="message">
              <div class="type">{{item.status}}</div>
              <div class="person"><img :src="item.icon" width="15" />{{item.name}}</div>
            </div>
          </div>
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
            feedbackList: [{
                src: '/src/assets/images/logo.png',
                title: '变形金刚之大黄蜂',
                status: '内部反馈',
                name: '易中天',
                icon: '/src/assets/images/leader.png',
                endStatus: 1,
                time: '10天前'
            }, {
                src: '/src/assets/images/logo.png',
                title: '变形金刚之大黄蜂',
                status: '内部反馈',
                name: '易中天',
                icon: '/src/assets/images/leader.png',
                endStatus: 0,
                time: '10天前'
            }, {
              src: '/src/assets/images/logo.png',
              title: '变形金刚之大黄蜂',
              status: '内部反馈',
              name: '易中天',
              icon: '/src/assets/images/leader.png',
              endStatus: 0,
              time: '10天前'
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
  height: 480px;
  overflow: auto;
  .item{
    float: left;
    width: 182px;
    height: 172px;
    padding: 5px;
    margin: 8px;
    background: #e8e8e8;
    .pic{
      width: 170px;
      height: 92px;
      .tips{
        float: left;
        width: 36px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: rgba(153, 51, 0, 0.7);
        color: #fff;
      }
      .timetips{
        width: 50px;
        height: 20px;
        float: right;
        line-height: 20px;
        text-align: center;
        background: rgba(255, 153, 0, 0.8);
        color: #fff;
      }
    }
    .title{
      line-height: 40px;
      color: #5E5E5E;
    }
    .message{
      .type{
        font-size: 14px;
        color: #aeaeae;
        float: left;
      }
      .person{
        float: right;
        img{
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
