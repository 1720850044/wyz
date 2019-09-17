<template>
  <div class="module">
    <Card>
       <div class="module-title">
          <slot name="title">
            <Icon type="navicon-round"></Icon>我负责的项目
            <span v-if="visible">{{number}}</span>
          </slot>
          <Icon type="close-round" @click="remove()" class="close" v-if="operable"></Icon>
        </div>
        <div class="module-body">
          <!-- <slot></slot> -->
          <div class="pitem" v-for="(item,index) in projectList" :key="index">
            <div class="pitem-left">
              <div class="pitem-left-top">{{item.ending}}</div>
              <div class="pitem-left-center">
                <div class="percent">{{item.percent}}%<span class="tips">当前完成</span></div>
                <div id="J_bg2_1" class="demo1-bg2-1"></div>
                <div id="J_bg2_2" class="demo1-bg2-2"></div>
              </div>
              <div class="pitem-left-bottom">{{item.title}}
                <span class="tips" v-if="item.ispause!=''">{{item.ispause}}</span>
                <span class="subtitle" v-if="item.subtitle!=''">>大天使组</span>
              </div>
            </div>
            <div class="pitem-right">
              <div class="progress">
                <div class="item">
                  <span>即将完成</span>
                  <div class="linebg">
                    <div class="flinefg" :style="`width: ${100 - item.residue}%;`"></div>
                  </div>
                  <span class="red">{{item.residue}}%</span>
                </div>
                <div class="item">
                  <span>时间进度</span>
                  <div class="linebg">
                    <div class="slinefg" :style="`width: ${item.time}%;`"></div>
                  </div>
                  <span class="red">{{item.time}}%</span>
                </div>
                <div class="item">
                  <span>文件进度</span>
                  <div class="linebg">
                    <div class="tlinefg" :style="`width: ${item.file / item.files * 100}%;`"></div>
                  </div>
                  <span class="red">{{item.file}}</span>
                  <span>/{{item.files}}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="pitem">
            <div class="pitem-left">
              <div class="pitem-left-top">今日结束</div>
              <div class="pitem-left-center">
                <div class="percent">70%<span class="tips">当前完成</span></div>
                <div id="J_bg2_1" class="demo1-bg2-1"></div>
                <div id="J_bg2_2" class="demo1-bg2-2"></div>
              </div>
              <div class="pitem-left-bottom">奇迹MU<span class="subtitle">>大天使组</span><span class="tips">暂停</span></div>
            </div>
            <div class="pitem-right">
              <div class="progress">
                <div class="item">
                  <span>即将完成</span>
                  <div class="linebg">
                    <div class="flinefg"></div>
                  </div>
                  <span class="red">15%</span>
                </div>
                <div class="item">
                  <span>时间进度</span>
                  <div class="linebg">
                    <div class="slinefg"></div>
                  </div>
                  <span class="red">80%</span>
                </div>
                <div class="item">
                  <span>文件进度</span>
                  <div class="linebg">
                    <div class="tlinefg"></div>
                  </div>
                  <span class="red">115</span>
                  <span>/251</span>
                </div>
              </div>
            </div>
          </div> -->
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
    data() {
        return {
            projectList: [{
                ending: '今日结束',
                percent: 70,
                title: '新战国无双',
                subtitle: '',
                ispause: '暂停',
                residue: 15,
                time: 80,
                file: 115,
                files: 251
            }, {
                ending: '还剩23天',
                percent: 12,
                title: '奇迹MU',
                subtitle: '大天使子组',
                ispause: '',
                residue: 15,
                time: 80,
                file: 115,
                files: 251
            }]
        };
    },
    computed: {
    // currPer() {
      // return this.curr / this.total * 100;
    // }
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
.module-body {
  margin: 20px 0;
  float: left;
  .pitem:last-child{
    border-right: none;
  }
  .pitem{
    float: left;
    width: 480px;
    height: 170px;
    padding: 0 30px;
    border-right: 1px solid #e8e8e8;
    &-left{
      float: left;
      width: 190px;
      &-top{
        width: 70px;
        line-height: 20px;
        background: #ff6600;
        border-radius: 3px;
        text-align: center;
        color: #fff;
        margin-left: 15px;
      }
      &-center{
        width: 100px;
        height: 100px;
        margin: 10px 0;
        display: -webkit-box;
        -webkit-box-pack: center;
        -webkit-box-align: center;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 0 5px #00CC00 inset;
        .demo1-bg2-1,.demo1-bg2-2{
          position: relative;
          margin: 0;
          padding: 0;
          -webkit-box-flex: 1;
          height: 100px;
          background: #fff;
          border: 5px solid grey;
        }
        .demo1-bg2-1{
          border-radius: 50px 0 0 50px;
          border-color: grey transparent grey grey;
          transform-origin: 100% 50%;
          z-index: 1;
        }
        .demo1-bg2-2{
          border-radius: 0 50px 50px 0;
          border-color: grey grey grey transparent;
          transform-origin: 0 50%;
          z-index: 2;
        }
        .percent{
          position: absolute;
          z-index: 3;
          font-size: 36px;
          text-align: center;
          margin: 13px;
          color: #00CC00;
          .tips{
            font-size: 14px;
            color: #89929d;
          }
        }
      }
      &-bottom{
        font-size: 18px;
        color: #515151;
        .subtitle{
          color: #949494;
          margin-left: 3px;
        }
        .tips{
          font-size: 12px;
          padding: 2px 3px;
          background: #990000;
          color: #fff;
          margin-left: 5px;
        }
      }
    }
    &-right{
      float: left;      
      width: 220px;
      .progress{
        .item{
          text-align: left;
          height: 50px;
          line-height: 50px;
          .linebg{
            width: 78px;
            height: 8px;
            background: #e4e4e4;
            border-radius: 3px;
            float: left;
            margin: 22px 10px 0 10px;
            .flinefg{
              width: 50%;
              height: 100%;
              background: #ffcc00;
              border-radius: 3px;
            }
            .slinefg{
              width: 50%;
              height: 100%;
              background: #ff9900;
              border-radius: 3px;
            }
            .tlinefg{
              width: 50%;
              height: 100%;
              background: #9dd4c9;
              border-radius: 3px;
            }
          }
          span{
            display: block;
            float: left;
          }
          .red{
            color: @red;
          }
        }
      }
    }
  }
}
</style>
