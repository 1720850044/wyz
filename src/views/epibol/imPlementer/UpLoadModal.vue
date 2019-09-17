<template>
    <div>
        <div slot="header" style="height:30px;">
            <b>{{data.name}}</b>
        </div>
        <div class="ProjectFile">
            <div class="MainFile">
                <dl>
                    <dt>主文件</dt>
                    <dd>
                      <MainFileUpLoad></MainFileUpLoad>
                    </dd>
                </dl>
            </div>
            <div class="MinFile">
                <dl>
                    <dt>附加文件</dt>
                    <dd>
                        <MinFileUpLoad></MinFileUpLoad>
                    </dd>
                </dl>
            </div>
            <div class="clear"></div>
        </div>
        <div class="stageSelect">
             <h5>选择文件上传阶段</h5>
             <div class="stageRow">
                  <Steps :current="current" status="finish">
                      <Step :title="item.stage_name" v-for="(item,index) in ComStage" @click.native="current=index" :key="index"></Step>
                  </Steps>
             </div>
         </div>
         <div class="stageText">
              <Input v-model="value" placeholder="在这里输入上传说明" style="width: 100%"></Input>
         </div>
    </div>
</template>
<script>
import MainFileUpLoad from './MainFlieUpLoad.vue';
import MinFileUpLoad from './MinFlieUpLoad.vue';
export default {
    data(){
        return {
            current: 0,
            data: [],
            value: '',
            taskID: 0,
            stage: [],
            ShowStage: true,
        };
    },
    computed: {
        ComStage(){
            if (typeof this.stage==='string'){
                return ' ';
            } else {
                return this.stage;
            }
        }
    },
    
    created(){
        this.$bus.on('EMname', (val)=>{
            this.data=val;
            this.taskID=val.id;
            this.stage=val.stage;
            this.current=val.progress;
        });
        this.$bus.on("RemoveFile", ()=>{
            this.value='';
        });
    },
    components: {
        MainFileUpLoad,
        MinFileUpLoad
    },
    watch: {
        current(val){
            this.$bus.emit('UpCurrent', val);
        },
        taskID(val){
            this.$bus.emit("TaksID", val);
        },
        value(val){
            this.$bus.emit("UpValue", val);
        }
    }
};
</script>
