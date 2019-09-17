<template>
    <div class="memberBox" :id="id+1">
        <ul class="memberDateUl" :id="id+2" @mousedown="slide" onselectstart="return false;" :style="{'left':`${newProjectLeft}px`}" >
                <li class="memberDate" v-for="(item,index) in dateList" :key="index" v-if="type !== 'smart'"
                :class="{'red':item.is_holiday == 1, 'custom-style': type === 'smart'}">
                <template v-if="index === 0 || item.d == 1">{{ item.m}}{{$t('lang.lang_month')}}</template>
                {{ item.d}}
                <template v-if=" index === 0 ||  item.d == 1">{{$t('lang.lang_day')}}</template>
            </li>
            <li class="memberDate" v-for="(item,index) in dateList" :key="index" v-if="type === 'smart'"
                :class="{'red':item.is_holiday == 1, 'custom-style': type === 'smart'}">
                <template>{{item.m}}{{$t('lang.lang_month')}}{{item.d}}{{$t('lang.lang_day')}}</template>
            </li>
            <!--<ul class="taskDateBox" :style="{height:`${items.length*10}px`}" v-for="(items,index) in arr" :key="index">-->
            <!--<li class="taskDate" :class="{'otherTask':i === 1}"  :title="item.name" :style="taskStyle(item,index)" v-for="(item,i) in items"-->
            <!--:key="i">-->
            <!--&lt;!&ndash;{{item.name}}&ndash;&gt;-->
            <!--</li>-->
            <!--</ul>  -->
            <ul class="taskDateBox" :style="{height:`${items.length*10}px`}" v-for="(items,index) in taskFormat"
                :key="index">
                <li v-if="item.project === projectId && type === 'smart' && !showAllProject"
                    class="taskDate"
                    :class="[{'current-project':item.project === projectId && type !== 'project'}]"
                    :title="`${item.name}（${item.start_date}~${item.end_date}）`"
                    :style="taskStyle(item,index)" v-for="(item,i) in items" :key="i">
                </li>
                <li v-if="type === 'smart' && showAllProject"
                    class="taskDate"
                    :class="[{'current-project':item.project === projectId && type !== 'project'}]"
                    :title="`${item.name}（${item.start_date}~${item.end_date}）`"
                    :style="taskStyle(item,index)" v-for="(item,i) in items" :key="i">
                </li>
                <li v-if="type !== 'smart'"
                    class="taskDate"
                    :class="[{'otherTask':item.project_id === projectId && type !== 'project'},{'selfProject':item.selfProject}]"
                    :title="`${item.name}（${item.start_date}~${item.end_date}）`"
                    :style="taskStyle(item,index)" v-for="(item,i) in items" :key="i">
                </li>
            </ul>
        </ul>
    </div>
</template>

<script>
    import date from 'date';

    /**
     * id : 使用多个组件时需要传入不同值
     * taskFormat : 数据 [[a],[b]] 二维数组 a为第一层 b为第二层
     * dateList  : 时间列表 []
     * dateHeight 时间列表高度 默认20
     */

    export default {
        name: 'timeline',
        props: {
            id: {
                type: String,
                default: 'timeline'
            },
            taskFormat: {
                type: Array,
                default: () => []
            },
            dateList: {
                type: Array,
                default: () => []
            },
            styleObj: {
                type: Object,
                default: () => ({
                    dateHeight: 20,
                    dateWidth: 70,
                    listHeight: 25,
                })
            },

            type: {
                type: String,
                default: 'default'
            },
            showAllProject: {
                type: Boolean,
                default: false
            }
        },
        created () {

        },
        mounted () {
            this.setBoxHeight();
        },
        data () {
            return {
                projectId: sessionStorage.projectID,
                newProjectLeft: 0,
            };
        },
        methods: {
            // 设置box高度 参数用于选择项目时添加一行
            setBoxHeight (number = 0) {
                let {listHeight, dateHeight} = this.styleObj;

                const boxDom = document.querySelector(`#${this.id + 1}`);
                if (this.type === 'smart') {
                    boxDom.style.height = `${listHeight * Object.keys(this.taskFormat).length + 60}px`;
                } else {
                    boxDom.style.height = `${listHeight * (Object.keys(this.taskFormat).length+number) + dateHeight}px`;
                }
            },
            // 拖拽事件
            slide (e) {
                e.preventDefault();
                e.stopPropagation();
                const boxDom = document.querySelector(`#${this.id + 1}`);
                const timeline = document.querySelector(`#${this.id + 2}`);
                console.log(timeline.style.transform);

                let clientX = e.clientX;
                let x = Number(timeline.style.left.split('px')[0]);
                timeline.onmousemove = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    timeline.onselectstart = null;
                    let newClientX = event.clientX;
                    let offset = newClientX - clientX;
                    if ((x + offset) <= 15 && -(timeline.offsetWidth - boxDom.offsetWidth) <= (x + offset + 15)) {
                        timeline.style.left = x + offset + 'px';
                    }
                };
                document.body.onmouseup = () => {
                    timeline.onmousemove = null;
                };
            },
            // 位置的样式
            taskStyle (item, index) {
                let {dateWidth, listHeight} = this.styleObj;
                let getDays = date.getDays;
                const widthDays = getDays(item.start_date, item.end_date);
                const days = getDays(this.dateList[0].date, item.start_date);
                const key = Object.keys(this.taskFormat)[index];

                if (this.type === 'smart') {
                    return {
                        width: `${80 * (widthDays + 1)}px`,
                        left: `${80 * days}px`,
                        borderRadius: '10px',
                        top: `${60 + listHeight * key}px`,
                        // marginTop:'10px',
                    };
                } else {
                    return {
                        // width: `${dateWidth/7 * (widthDays + 1)}px`,
                        width: `${dateWidth * (widthDays + 1)}px`,
                        // left: `${dateWidth/7 * days}px`,
                        left: `${dateWidth * days}px`,
                        borderRadius: '10px',
                        top: `${25 + listHeight * key}px`,
                        // marginTop:'10px',
                    };
                }
            }
        },
        computed: {},
        components: {}
    };
</script>

<style lang="less" scoped>
    .memberBox {
        position: relative;
        display: flex;
        /*max-width: 600px;*/
        /*min-width: 600px;*/
        width: 100%;
        overflow: hidden;

        .memberDateUl {
            flex: 1;
            display: flex;
            position: absolute;
            left: 0;
            height: 100%;
            color: @black_2;
            .red {
                color: @red;
            }
            .memberDate {
                flex: 1;
                max-width: 70px;
                min-width: 70px;
                text-align: center;
                height: 20px;
                &.custom-style {
                    min-width: 80px;
                    max-width: 80px;
                    height: 48px;
                    line-height: 48px;
                    background: rgba(60, 210, 180, 0.38);
                    font-size: 14px;
                    color: #999;
                }
            }
            .taskDateBox {
                height: 100%;
                .taskDate {
                    position: absolute;
                     top: 70px;
                    /*top:20px !important;*/
                    height: 16px;
                    background: #7cbefc;
                }
                .current-project {
                    background: @base;
                }
                .otherTask {
                    background: @base;
                }
                .selfProject {
                    background: @base;
                    border: 1px solid @base;
                }
            }

        }
    }

</style>
