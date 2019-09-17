<template>
    <div>
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{this.compTitle}}<div></div></span></div>
        </main-native>
        <keep-alive>
            <component :is="compName"></component>
        </keep-alive>
    </div>
</template>
<script>
import echartsDayTask from './echartsDayTask.vue';
import EchartsTaskPlan from './echartsTaskPlan.vue';
import EchartsHours from './echartsHours.vue';
import EchartsStyle from './echartsStyle.vue';
import EchartsTask from './echartsTask.vue';
import EchartsTypeTask from './echartsTypeTask.vue';
import EchartsState from './echartsState.vue';
import mainNative from '../../main-components/mainNative.vue';
export default {
    data(){
        return {
            compName: null,
            compTitle: null
        };
    },
    components: {
        echartsDayTask,
        mainNative
    },
    computed: {
        routeParams(){
            return this.$route.params.style;
        },
    },
    methods: {
        comCut(){
            switch (this.routeParams){
                case 'echartsDayTask':
                    this.compName=echartsDayTask;
                    this.compTitle='每日任务动态统计';
                    break;
                case 'EchartsTaskPlan':
                    this.compName=EchartsTaskPlan;
                    this.compTitle='项目任务进度';
                    break;
                case 'EchartsHours':
                    this.compName=EchartsHours;
                    this.compTitle='成员工时进度';
                    break;
                case 'EchartsStyle':
                    this.compName=EchartsStyle;
                    this.compTitle='成员工时占比';
                    break;
                case 'EchartsTask':
                    this.compName=EchartsTask;
                    this.compTitle='成员任务统计';
                    break;
                case 'EchartsTypeTask':
                    this.compName=EchartsTypeTask;
                    this.compTitle='任务类型工时';
                    break;
                case 'EchartsState':
                    this.compName=EchartsState;
                    this.compTitle='任务状态统计';
                    break;
            }
        }
    },
    mounted(){
        this.comCut();
    },
};
</script>
