<template>
  <div>
      <div class="ModuleROW">
          <IMGEditor v-if="IMGflag"></IMGEditor>
          <VedioEditor v-if="VIDflag"></VedioEditor>
      </div>
      <div class="four_flash">
			<div class="flashBg">
				<ul class="mobile">
                    <li v-for="item in RollData" @click="AParams(item.id,item.type)">
						 <img :src="item.thumb"/>
                    </li>
				</ul>
			</div>
			<div class="but_left" @click="but_left"><Icon type="ios-arrow-left" size='40'></Icon></div>
			<div class="but_right" @click="but_right"><Icon type="ios-arrow-right" size='40'></Icon></div>
	   </div>
  </div>
</template>
<script>
import { baseUrl } from '../../../config/env.js';
import IMGEditor from './imgEditor.vue';
import VedioEditor from './vedioEditor.vue';
var _index=0;

export default {
    components: {
        // IMGEditor,
        // VedioEditor
    },
    data(){
        return {
            RollData: [],
            TagData: [],
            taskID: 2,
            TID: 80,
            IMGflag: false,
            VIDflag: false
        };
    },
    
    mounted(){
        this.RollGet();
    },
    methods: {
        but_right(){
            _index++;
            let len=$(".flashBg ul.mobile li").length;
            if ((_index+len)-2>len){
                // $(".four_flash .flashBg ul.mobile").stop().append($("ul.mobile").html());
                // $(".but_right").hide();
            }
            $(".four_flash .flashBg ul.mobile").stop().animate({left: -_index*138}, 500);
        },
        but_left(){
            let len=$(".flashBg ul.mobile li").length;
            if ((_index+len)-2<len){
                // $("ul.mobile").prepend($("ul.mobile").html());
                // $("ul.mobile").css("left","-1380px");
                // _index=len
                // $(".but_right").show();
            }
            _index--;
            $(".four_flash .flashBg ul.mobile").stop().animate({left: -_index*138}, 500);
        },
        RollGet(){
            let _this=this;
            let url=baseUrl+'index.php?r=task/task/stage-list&task_id='+_this.taskID;
            _this.$http.get(url).then(function(msg){
                let code=msg.data.err_code;
                if (code==0){
                    let TagData=msg.data.data;
                    let TID=_this.TID;
                    //遍历符合TID的数组
                    for (let i=0;i<TagData.length;i++){
                        if (TagData[i].id==TID){
                            _this.RollData=TagData[i].file;
                        }
                    }
                    //判断第一个文件的类型
                    if (_this.RollData[0].type=='image'){
                        _this.IMGflag=true;
                        _this.VIDflag=false;
                    } else if (_this.RollData[0].type=='video'){
                        _this.IMGflag=false;
                        _this.VIDflag=true;
                    }
                } else {
                    
                }
            });

        },
        ImgInfo(id, type){
            let fileID=id;
            let IType=type;
            if (IType=='video'){
                console.log(fileID+"/"+IType);
            } else if (IType=='image'){
                console.log(IType+"/"+fileID);
            }
        },
        AParams(id, type){
            if (type=='video'){
                //设置显示组件
                this.IMGflag=false;
                this.VIDflag=true;
                
                // 加载第三方控件
                let head = document.getElementsByTagName('head')[0];  
                let script = document.createElement('script');  
                script.async = true;  
                script.src = "http://vjs.zencdn.net/6.6.3/video.js";  
                head.appendChild(script);
                script.classList.add("video_js");
                
                console.log("fileID"+id+"|| TID"+this.TID);
            } else if (type=="image"){
                //设置显示组件
                this.IMGflag=true;
                this.VIDflag=false;
                console.log("fileID"+id+"|| TID"+this.TID);
            }
        }

    }
};
</script>
<style>
.ModuleROW{height:440px;}
.four_flash{position:relative;width:458px;height:130px; margin:0 auto;position:absolute;}
.four_flash .flashBg{width:415px;height:110px; margin:0 auto;position:relative;overflow:hidden;}
.four_flash .flashBg ul.mobile{width:2000%;height:130px; position:absolute;top:15; left:0;}
.four_flash .flashBg ul.mobile li{border:1px solid #1ebca4;float:left;width:130px;height:110px;margin:0px 4px;background:#fff;}
.four_flash .flashBg ul.mobile li img{width:128px;height:108px;display:block; margin:0 auto;cursor:pointer;}
.four_flash .but_left{width:20px;height:40px;position:absolute;top:50%;margin-top:-30px;left:0px;cursor:pointer;}
.four_flash .but_right{width:20px;height:40px; position:absolute;top:50%;margin-top:-30px;right:0px;cursor:pointer;}
</style>