<template>
  <div class="grid">
    <div class="handleBox" v-if="isLayout">
      <Button type="primary" icon="plus-round" @click="openAddItem()">增加模块</Button>
      <Button type="primary">保存</Button>
      <Button type="ghost" @click="cancel()">取消</Button>
    </div>
    <div class="handleBox" v-else>
      <Button type="primary" icon="ios-search" @click="changeLayout()">布局调整</Button>
    </div>
    <Tabs :animated="false">
      <TabPane label="我的工作">
        <mdProject :operable="isLayout"></mdProject>
        <mdDate :operable="isLayout"></mdDate>
        <mdFollow :operable="isLayout"></mdFollow>
        <mdExamine :operable="isLayout"></mdExamine>
        <mdFeedback :operable="isLayout"></mdFeedback>
      </TabPane>
      <TabPane label="日程安排">日程安排</TabPane>
    </Tabs>
    <Modal v-model="modules" width="500">
      <p slot="header" style="text-align:left;margin-left: 10px;">
        <span>增加功能模块</span>
      </p>
      <div style="float: left;">
        <div class="module-item"
        v-for="(item,index) in moduleList"
        :key="index"
        :class="{'actived' : moduleNum == index}"
        @click="choiced(index)">
          <div class="module-item-top">
            <div class="module-item-top-left">
              <img :src="item.img" />
            </div>
            <div class="module-item-top-right">
              <div class="title">{{item.title}}</div>
              <Icon type="checkmark-circled" class="icon" color="#00cc00" v-if="isModule"></Icon>
              <div class="message">{{item.content}}</div>
            </div>
          </div>
          <div class="module-item-bottom" v-if="isModule">
            <div class="module-item-bottom-left">
              <span>数据来源</span>
              <Select v-model="model3" style="width:120px">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </div>
            <div class="module-item-bottom-right">
              <span>输入功能模块名称</span>
              <Input v-model="moduleName" placeholder="模块名称" style="width: 290px"></Input>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" style="text-align: left;border-top: 0;">
        <Button type="primary">确定</Button>
        <Button type="ghost" @click="closeMd()">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import mdProject from "./components/mdProject";
import mdDate from "./components/mdDate";
import mdFollow from "./components/mdFollow";
import mdExamine from "./components/mdExamine";
import mdFeedback from "./components/mdFeedback";
import mdPending from "./components/mdPending";
import GridItem from './components/GridItem.vue';
import GridLayout from './components/GridLayout.vue';
import TestElement from './components/TestElement.vue';
var testLayout = [
  {"x": 0, "y": 0, "w": 2, "h": 2, "i": "0", resizable: true, draggable: true},
  {"x": 2, "y": 6, "w": 2, "h": 2, "i": "1", resizable: false, draggable: false}
];
export default {
    components: {
        mdProject,
        mdDate,
        mdFollow,
        mdExamine,
        mdFeedback,
        mdPending,
        GridLayout,
        GridItem,
        TestElement
    },
    data() {
        return {
            isLayout: false,
            modules: false,
            isModule: false,
            layout: JSON.parse(JSON.stringify(testLayout)),
            draggable: false,
            resizable: false,
            mirrored: false,
            rowHeight: 30,
            colNum: 12,
            index: 0,
            moduleNum: null,
            moduleName: '',
            model3: '',
            cityList: [{
                value: 'New York',
                label: 'New York'
            }, {
                value: 'London',
                label: 'London'
            }],
            moduleList: [{
                title: '我的任务清单',
                content: '相关功能模块描述相关功能模块描述相关功能模块描述相关功能功能模块描述相关功能模块描述',
                img: '/src/assets/images/logo.png'
            }, {
                title: '待审文件',
                content: '相关功能模块描述相关功能模块描述相关功能模块描述相关功能功能模块描述相关功能模块描述',
                img: '/src/assets/images/logo.png'
            }, {
              title: '客户已审',
              content: '相关功能模块描述相关功能模块描述相关功能模块描述相关功能功能模块描述相关功能模块描述',
              img: '/src/assets/images/logo.png'
          }]
        };
    },
    methods: {
        changeLayout() {
            this.isLayout = true;
            this.draggable = true;
            this.resizable = true;
        },
        cancel() {
            this.isLayout = false;
            this.draggable = false;
            this.resizable = false;
        },
        closeMd() {
            this.modules = false;
        },
        openAddItem() {
            this.modules = true;
        },
        choiced(item) {
            this.moduleNum = item;
            this.isModule = true;
        },
        move(i, newX, newY) {
      // console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
        },
        resize(i, newH, newW){
      // console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW);
        },
        moved(i, newX, newY){
      // console.log("### MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
        },
        resized(i, newH, newW, newHPx, newWPx){
      // console.log("### RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
        },
    }
};
</script>

<style lang="less">
@import "./style/grid.less";
</style>
