<template>
  <div>
      <main-native>
          <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>
      </main-native>
      <!--筛选条件-->
      <ul class="screenBar">
          <li>
              <dl>
                  <dd v-for="(item,index) in filterList" :class="[(index == currenIndex) ? item.orderBy == 'asc' ? 'byAsc' : 'byDesc' : null]" @click="CheckStatus(item,index)">{{item.label}}</dd>
              </dl>
          </li>
          <li style="margin-right: 10px">
              <Select v-model="searchCondition.bid_status" size="large" @on-change="selectStatus" style="outline: none;width: 80px" placeholder="状态">
                  <Option v-for="item in filterStatus" :value="item.status" :key="item.label">{{item.label}}</Option>
              </Select>
          </li>
          <li class="searchBar">
              <div>
                  <Input v-model="searchCondition.search" icon="ios-search" :placeholder="$t('projectHall.pro_taskName')" style="width: 200px" @keyup.enter.native="sendSearchData"></Input>
                  <!--<input v-model="searchCondition.search" type="text"  placeholder="任务名称" @keyup.enter="sendSearchData"/>-->
                  <!--<button @click="sendSearchData"></button>-->
              </div>
          </li>
      </ul>
      <div style="clear:both"></div>
      <task-list class="Datalist" :searchCondition="searchCondition" ref="taskList"></task-list>
  </div>
</template>
<script>
import taskList from './component/taskList';
import mainNative from '../main-components/mainNative.vue';
import api from 'api';
export default {
    data(){
        return {
            taskData: [],
            filterList: [
          {label: i18n.t('projectHall.pro_submitManuscripts'), action: "setUp", type: 'end_time', orderBy: '', index: 0},
          {label: i18n.t('projectHall.pro_testPrice'), action: "remDay", type: 'test_price', orderBy: '', index: 1},
          {label: i18n.t('projectHall.pro_estimate'), action: "proSch", type: 'project_max_price', orderBy: '', index: 2}
            ],
            filterStatus: [
          {label: i18n.t('projectHall.pro_wholes'), status: 0},
          {label: i18n.t('projectHall.pro_haveInHand'), status: 1},
          {label: i18n.t('projectHall.pro_hasEnded'), status: 2}
            ],
            currenIndex: null,
            searchCondition: {
                search: null,    //搜索文本内容
                bid_status: 0,  //筛选状态
                order: null,     //筛选类型
                orderby: null   //排序方式 ASC || DESC
            },
        };
    },
    components: {
        taskList: taskList,
        mainNative: mainNative
    },
    methods: {
      //选择状态
        selectStatus(){
            this.sendSearchData();
        },
      //筛选条件
        CheckStatus(item, index){
            this.currenIndex = index;
            if (item.orderBy == 'asc'){
                item.orderBy = 'desc';
            } else if (item.orderBy == 'desc'){
                item.orderBy = 'asc';
            } else {
                item.orderBy = 'asc';
            }
            this.searchCondition.order = item.type;
            this.searchCondition.orderby = item.orderBy;
            this.sendSearchData();
        },
      //发送数据
        sendSearchData(){
            let parms = this.searchCondition;
            this.$refs.taskList.taskListData(parms);
        },
      //自動適應高度
        autoH(){
            $('.Datalist').height($(window).height()-165);
        },

    }
};
</script>

<style lang="less" scoped>
    .screenBar{
        overflow: hidden;height: 40px;float: right;background: #fff;border-radius: 4px;
        & > li{
            float: left;display: flex;align-items: center;height:100%;
            dl{
                height: 100%;
                dd{
                    float: left;font-size: 13px;color: @black_2;height: 100%;display: flex;align-items: center;border-left: 1px dashed #e7e7e7;padding: 0 15px;cursor: pointer;
                    &:after{
                        content: '';display: inline-block;height: 12px;width: 9px;
                        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAB0CAYAAACIY2IQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANwSURBVGhD7ZdLaBNhFIVdiNWFUrrQQosoWvGxsAsV86hoiwsXiloQF+4EF1YsaBHEuhB0oRZBXIgIKuJjqYtmWkzSByoiNG3c1aKt2EWUElNaUbCaeO6fM8kkbTIPFQr+Hxzmv+e/9ySTTJLJAivb3hg1gUGjzz/UuZmWe4LxUB1CxqCMP2YkfYPGFm45xxc36gMxIyEheYVSgQEjwBZ7fLHOBjVUEJKVPxaa9g2EdrG1PMGhkD842NWER28tCEItvuyz1RlyGkVBzk/Lig6yZ/4FaTSassy/D60OsuePg/7aL63db38wZjSy1Z4SdyOTnl6n4vuj7UPdW7nlnuwdW6hfniEtjUbzD+jt7a2JRCJ9OHr/dxQOh+sQMhaNRjM4JlG7/3eEoXoEJCTEohR8599HGGiQIUuAVdOQs39HPT09fjxyE06n1Roitfiyz1ZnyGlYg1ydlhUdZM/8C9JoNK5Jp9OrIAPaQcsbCDiSATh20PIGApoZdJ6WNxBwkEHttLzhKQjNm6A70AZa1lPLBWG9HHoA7aNVCDZ2c2gG2kjvEL0LrKuhz/RaxJsTbJ5k0wwOFdBq1s3cT7C+qgaswNwJHWZpDXsLtUE/oWtQmP4ltkrvfmiPWXyTBrBQGQDeCXoy+ItLWV9hi4J2RhXY/MS6QhkEfit9BepZFyX9hCqw+EhjkTIswGuBfkAFz8QEvrwx42ZRMkjA1gouZ1EcNCFBqnAJgybMYpzPaKUyHIKRSs7lXqOjYghYT0HTDjTFEZlpU0ECilPQMDSJvZSdpA96D51jhEbzv4DLfil0DOrHx0GBdRw6jmUl28rD5hyox6BRlgrU5X910fCYjaPQASyXcUu+Mirg7YWG2WNwqxBsdLDhKa2SoOc6e2/RygKjlhsjtGxB7wvO5L8MUdymuYaWLeit5kyEljK/Q0mWjsHMOwkDS5QhK5jdqnABZu5zdp0yWHSpwgWYucfZ9abxFXVKFS7AnLq+cFysDKzv0qhVhgPQW8WZ57SUuZZmnJYt6H3GmezrYwLjMjee0CoJem6w9yKtQiSEDR+gRixztzkCvAbIfMvL/8Sj8Sz7FAwt/tA+4vEVx+YGDXKfeAbqg5LQF+g11I55dWeCtfqWwDF/ZXsFITcZ9pCWd+QZMew0Le8gZETCWHoHQVXpdPrlbwmk0RfpuGVuAAAAAElFTkSuQmCC") no-repeat;
                        background-position-y: -46px;margin-left: 5px;
                    };
                    &.byAsc{
                        &:after{
                            background-position-y: 0 !important;
                            transform: rotate(0deg);
                        }
                    };
                    &.byDesc{
                        &:after{
                            background-position-y: 0px !important;
                            transform: rotate(-180deg);}
                    }
                }
            }
            .ivu-select-visible .ivu-select-selection{
                border-color: @base;
                outline: none;
                 -webkit-box-shadow: 0 0 0 2px rgba(255, 255, 255, 0);
                box-shadow: 0 0 0 2px rgba(255, 255, 255, 0);
            }
            .ivu-select{
                .ivu-select-selection:hover{
                    border-color: @base;
                }
            }
            .ivu-select-item-selected{
                background: @base;
            }
        }
        .searchBar{
            div{
                /*position: relative;width: 200px;height: 100%;overflow: hidden;*/
                /*input{height: 100%;width: 100%;border: none;border-radius: 3px;padding-left: 10px;outline: none;};*/
                /*<!--button{-->*/
                    /*<!--position: absolute;top: 0;bottom:0;right: 0;width: 44px;height:100%;border: 0;outline: none;border-radius: 3px;-->*/
                    /*<!--background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAB0CAYAAACIY2IQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANwSURBVGhD7ZdLaBNhFIVdiNWFUrrQQosoWvGxsAsV86hoiwsXiloQF+4EF1YsaBHEuhB0oRZBXIgIKuJjqYtmWkzSByoiNG3c1aKt2EWUElNaUbCaeO6fM8kkbTIPFQr+Hxzmv+e/9ySTTJLJAivb3hg1gUGjzz/UuZmWe4LxUB1CxqCMP2YkfYPGFm45xxc36gMxIyEheYVSgQEjwBZ7fLHOBjVUEJKVPxaa9g2EdrG1PMGhkD842NWER28tCEItvuyz1RlyGkVBzk/Lig6yZ/4FaTSassy/D60OsuePg/7aL63db38wZjSy1Z4SdyOTnl6n4vuj7UPdW7nlnuwdW6hfniEtjUbzD+jt7a2JRCJ9OHr/dxQOh+sQMhaNRjM4JlG7/3eEoXoEJCTEohR8599HGGiQIUuAVdOQs39HPT09fjxyE06n1Roitfiyz1ZnyGlYg1ydlhUdZM/8C9JoNK5Jp9OrIAPaQcsbCDiSATh20PIGApoZdJ6WNxBwkEHttLzhKQjNm6A70AZa1lPLBWG9HHoA7aNVCDZ2c2gG2kjvEL0LrKuhz/RaxJsTbJ5k0wwOFdBq1s3cT7C+qgaswNwJHWZpDXsLtUE/oWtQmP4ltkrvfmiPWXyTBrBQGQDeCXoy+ItLWV9hi4J2RhXY/MS6QhkEfit9BepZFyX9hCqw+EhjkTIswGuBfkAFz8QEvrwx42ZRMkjA1gouZ1EcNCFBqnAJgybMYpzPaKUyHIKRSs7lXqOjYghYT0HTDjTFEZlpU0ECilPQMDSJvZSdpA96D51jhEbzv4DLfil0DOrHx0GBdRw6jmUl28rD5hyox6BRlgrU5X910fCYjaPQASyXcUu+Mirg7YWG2WNwqxBsdLDhKa2SoOc6e2/RygKjlhsjtGxB7wvO5L8MUdymuYaWLeit5kyEljK/Q0mWjsHMOwkDS5QhK5jdqnABZu5zdp0yWHSpwgWYucfZ9abxFXVKFS7AnLq+cFysDKzv0qhVhgPQW8WZ57SUuZZmnJYt6H3GmezrYwLjMjee0CoJem6w9yKtQiSEDR+gRixztzkCvAbIfMvL/8Sj8Sz7FAwt/tA+4vEVx+YGDXKfeAbqg5LQF+g11I55dWeCtfqWwDF/ZXsFITcZ9pCWd+QZMew0Le8gZETCWHoHQVXpdPrlbwmk0RfpuGVuAAAAAElFTkSuQmCC") no-repeat @base;-->*/
                    /*<!--background-position: 13px -88px;cursor: pointer;-->*/
                /*<!--}-->*/
            }
        }
        .allDownBtn{
            background: @base;padding: 0 10px;margin-left: 10px;border-radius: 3px;overflow: hidden;width: 100px;
            button{
                border: 0;color: #fff;outline: none;cursor: pointer;background: @base;width: 100%;
                .downbtn{
                    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAB0CAYAAACIY2IQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANwSURBVGhD7ZdLaBNhFIVdiNWFUrrQQosoWvGxsAsV86hoiwsXiloQF+4EF1YsaBHEuhB0oRZBXIgIKuJjqYtmWkzSByoiNG3c1aKt2EWUElNaUbCaeO6fM8kkbTIPFQr+Hxzmv+e/9ySTTJLJAivb3hg1gUGjzz/UuZmWe4LxUB1CxqCMP2YkfYPGFm45xxc36gMxIyEheYVSgQEjwBZ7fLHOBjVUEJKVPxaa9g2EdrG1PMGhkD842NWER28tCEItvuyz1RlyGkVBzk/Lig6yZ/4FaTSassy/D60OsuePg/7aL63db38wZjSy1Z4SdyOTnl6n4vuj7UPdW7nlnuwdW6hfniEtjUbzD+jt7a2JRCJ9OHr/dxQOh+sQMhaNRjM4JlG7/3eEoXoEJCTEohR8599HGGiQIUuAVdOQs39HPT09fjxyE06n1Roitfiyz1ZnyGlYg1ydlhUdZM/8C9JoNK5Jp9OrIAPaQcsbCDiSATh20PIGApoZdJ6WNxBwkEHttLzhKQjNm6A70AZa1lPLBWG9HHoA7aNVCDZ2c2gG2kjvEL0LrKuhz/RaxJsTbJ5k0wwOFdBq1s3cT7C+qgaswNwJHWZpDXsLtUE/oWtQmP4ltkrvfmiPWXyTBrBQGQDeCXoy+ItLWV9hi4J2RhXY/MS6QhkEfit9BepZFyX9hCqw+EhjkTIswGuBfkAFz8QEvrwx42ZRMkjA1gouZ1EcNCFBqnAJgybMYpzPaKUyHIKRSs7lXqOjYghYT0HTDjTFEZlpU0ECilPQMDSJvZSdpA96D51jhEbzv4DLfil0DOrHx0GBdRw6jmUl28rD5hyox6BRlgrU5X910fCYjaPQASyXcUu+Mirg7YWG2WNwqxBsdLDhKa2SoOc6e2/RygKjlhsjtGxB7wvO5L8MUdymuYaWLeit5kyEljK/Q0mWjsHMOwkDS5QhK5jdqnABZu5zdp0yWHSpwgWYucfZ9abxFXVKFS7AnLq+cFysDKzv0qhVhgPQW8WZ57SUuZZmnJYt6H3GmezrYwLjMjee0CoJem6w9yKtQiSEDR+gRixztzkCvAbIfMvL/8Sj8Sz7FAwt/tA+4vEVx+YGDXKfeAbqg5LQF+g11I55dWeCtfqWwDF/ZXsFITcZ9pCWd+QZMew0Le8gZETCWHoHQVXpdPrlbwmk0RfpuGVuAAAAAElFTkSuQmCC") no-repeat @base;
                    background-position-y: -70px;padding-left: 20px;
                }
                i{font-style: normal;
                    &:after{content: "\F29C";color: #fff;font-size: 15px;padding: 0 5px}
                }
            }
        }
    }
</style>
