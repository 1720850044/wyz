<template>
    <div class="record-detailed" >
        <div class="list-header">
        <span>{{$t('lang.lang_date')}}</span>
        <span>{{$t('companyProject.com_modificationDetails')}}</span>
        <span>{{$t('companyProject.com_operator')}}</span>
        </div>
        <dl v-if="recordList">
            <dd v-for="(item,index) in recordList" :key='index'>
                <span>{{item.time}}</span>
                <span :title="item.action" style="cursor: pointer;">{{item.action}}</span>
                <span>{{item.realname}}</span>
            </dd>
        </dl>
        <template v-else>
          <div style="min-height: 350px;position: relative">
            <nothink type="project" :text="noData"></nothink>
          </div>
        </template>
    </div>
</template>
<script>
import api from "api";
export default {
    data() {
        return {
          noData: i18n.t('tip.tip_noData')
        };
    },
    props: {
        recordList: {
            type: Array
        }
    },
    components: {},
    mounted() {},
    methods: {}
};
</script>
<style lang="less" >
.record-detailed {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .list-header {
    display: flex;
    justify-content: space-between;
    color: #bdbdbd;
    height: 46px;
    line-height: 46px;
    font-weight: lighter;
    background-color: #fafbfb;
    border-bottom: 1px solid #eef1f2;
    margin-bottom: 0;
    font-size: 14px;
    span {
      flex: 1;
      text-align: center;
      &:first-child {
        flex: 1;
      }
      &:nth-child(2){
        flex: 2;
      }
    }
  }
  dl {
    overflow: auto;
    height: 100%;
  }
  dd {
    text-align: center;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e1e1e1;
    background: #fff;
    margin: 0;
    font-size: 13px;
    height: 60px;
    line-height: 60px;
    overflow: hidden;
    span {
      color: #777;
      font-size: 13px;
      flex: 1;
      text-align: center;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      &:first-child {
        flex: 1;
      }
      &:nth-child(2){
        flex: 2;
      }
    }
    i {
      font-style: normal;
      cursor: pointer;
    }
  }
}
</style>
