<template>
  <div class="module">
    <Card style="width: 530px;">
       <div class="module-title">
          <slot name="title">
            <Icon type="navicon-round"></Icon>等待内审 
            <span v-if="visible">{{number}}</span>
          </slot>
          <Icon type="close-round" @click="remove()" class="close" v-if="operable"></Icon>
        </div>
        <div class="module-body">
          <!-- <slot></slot> -->
          <div class="item" v-for="(item,index) in examineList" :key="index">
            <img :src="item.imgsrc" />
            <div class="message">
              <ul>
                <li>{{item.title}}</li>
                <li>{{item.uploadtime}}</li>
                <li>{{item.remaintime}}</li>
                <li><span>{{item.stage}}</span> / {{item.total}}</li>
              </ul>
              <ul>
                <li>{{item.subtitle}}</li>
                <li>上传</li>
                <li>剩余时间</li>
                <li>进度</li>
              </ul>
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
            examineList: [{
                imgsrc: '/src/assets/images/logo.png',
                title: '诛仙角色',
                uploadtime: '今天',
                remaintime: 3,
                stage: 3,
                total: 5,
                subtitle: '暗黑世界'
            }, {
                imgsrc: '/src/assets/images/logo.png',
                title: '诛仙角色',
                uploadtime: '今天',
                remaintime: 3,
                stage: 3,
                total: 5,
                subtitle: '暗黑世界'
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
    width: 496px;
    height: 76px;
    float: left;
    background: rgba(228, 228, 228, 0.5);
    margin-bottom: 20px;
    img{
      width: 69px;
      height: 43px;
      margin: 15px 5px;
      float: left;
    }
    .message{
      width: 417px;
      float: left;
      ul{
        height: 38px;
        li{
          float: left;
          width: 20%;
          text-align: center;
          line-height: 38px;
          span{
            color: #ff9900;
          }
        }
        li:first-child{
          width: 40%;
          text-align: left;
        }
      }
    }
  }
}
</style>
