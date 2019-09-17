<template>
  <div class="module">
    <Card style="width: 430px;">
       <div class="module-title">
          <slot name="title">
            <Icon type="navicon-round"></Icon>重点关注
            <span v-if="visible">{{number}}</span>
          </slot>
          <Icon type="close-round" @click="remove()" class="close" v-if="operable"></Icon>
        </div>
        <div class="module-body">
          <!-- <slot></slot> -->
          <div class="item" v-for="(item,index) in followList" :key="index">
            <ul>
              <li>{{item.title}}</li>
              <li><span :class="{'tips': item.endStatus == 1}">{{item.endtime}}</span></li>
              <li><span>{{item.stage}}</span> / {{item.total}}</li>
            </ul>
            <ul>
              <li><img class="icon" src="/src/assets/images/leader.png" width="15" />{{item.name}}</li>
              <li>结束</li>
              <li>{{item.type}}</li>
            </ul>
            <div class="linebg">
              <div class="linefg" :style="`width: ${item.stage / item.total * 100}%;`"></div>
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
            followList: [{
                title: '诛仙角色',
                endtime: '延期10天',
                stage: 3,
                total: 5,
                name: '李一天',
                type: '贴图',
                endStatus: 1
            }, {
                title: '变形金刚之大黄蜂',
                endtime: '今天结束',
                stage: 3,
                total: 5,
                name: '李一天',
                type: '框架',
                endStatus: 1
            }, {
              title: '20个UI图标',
              endtime: '2天后',
              stage: 3,
              total: 5,
              name: '李一天',
              type: '次时代',
              endStatus: 0
          }, {
            title: '20个UI图标',
            endtime: '10天后',
            stage: 5,
            total: 5,
            name: '李一天',
            type: '模型上色阶段',
            endStatus: 0
        }, {
          title: '变形金刚之大黄蜂',
          endtime: '15天后',
          stage: 1,
          total: 5,
          name: '李一天',
          type: '上色',
          endStatus: 0
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
    width: 396px;
    height: 76px;
    float: left;
    background: rgba(228, 228, 228, 0.5);
    margin-bottom: 20px;
    ul{
      height: 38px;
      li{
        padding: 0 10px;
        float: left;
        width: 30%;
        text-align: right;
        line-height: 38px;
        span{
          color: #ff9900;
        }
        .tips{
          padding: 2px 3px;
          background: #ff9900;
          color: #fff;
        }
      }
      li:first-child{
        width: 40%;
        text-align: left;
      }
    }
    .linebg{
      width: 100%;
      height: 3px;
      background: #e4e4e4;
      .linefg{
        width: 50%;
        height: 3px;
        background: #00CC00;
      }
    }
  }
}
</style>
