<template>
  <div class="newImgEditor">
      <div class="imgEditorCom">
          <!-- 加载动画 -->
          <OnLoad id="onload"></OnLoad>
          <div class="imgFocus">
                <!-- 控制canvas -->
                <div :class="[canvasSign?'controlCanvas showCanvas':'controlCanvas hideCanvas']">
                     <span @click="canvasHidden"><s class="iconfonts icon-tuichu"></s>退出标注</span>
                </div>
                <!-- 标注层 -->
                <div class="sginCanvas" id="signx">
                    <!-- 修改编辑层 -->
                    <div class="editSginDiv">
                      <textarea id="sginText"></textarea>
                      <div class="signButton">
                          <span class="sginEditCommit">修改</span>
                          <span class="editSignbox">取消</span>
                      </div>
                    </div>
                    <!-- 画布层 -->
                    <canvas id="cav" width="1400" height="750" v-show="hiddenSign">
                      <span>浏览器不支持画布标注！o(╯□╰)o</span>
                    </canvas>
                    <!-- 控件层 -->
                    <div class="oControl"></div>
                    <!-- 图片层 -->
                    <img :src="url" class="ImgOnlod" id="oImg"/>
                </div>

          </div>
          <!-- 工具条 -->
          <div class="toolBar">
              <span :class="[canvasSign?'barLeft barselet':'barLeft']" @click="canvasHidden">
                  <Icon type="edit" class="add"></Icon>{{barText}}
              </span>
              <span class="clearCanvas" @click="clearCanvas" v-show="canvasSign"><s class="iconfonts icon-qingchu"></s>清除标注</span>
              <span class="barRight">
                  <s><i class="iconfonts icon-qimai-guanjiancizhishuduibi"></i>查看上次反馈</s>
                  <s @click="sginHidden"><i class="iconfonts icon-yincang"></i>{{hiddenSignText}}</s>
              </span>
              <div class="clear"></div>
          </div>
          <!-- 标注提交 -->
          <div v-if="AllowEditRow" class="AllowEdit">
            <span class="EditIcon"></span>
            <span class="EditInput">
                <input type="text" placeholder="请输入你要反馈的内容" id="EditInput" v-model="FeedbackValue" AUTOCOMPLETE="off">
            </span>
            <span class="EditSub">
                <button @click="commitEidt('edit')">需修改</button>
                <button @click="commitEidt('ok')">通过</button>
            </span>
          </div>
          <!-- 反馈信息 -->
          <div v-if="SataeInfo" class="feedbackInfo">
            <span><p>状态</p><br/>{{StateFeedBack | filtStat}}</span>
            <span><p>等待时间</p><br/><Icon type="android-time"></Icon><span style="color: #3bceb6">{{insTime > cliTiem ? insDate : cliDate}}</span></span>
            <span><p>审核人</p><br/><i  class="iconfonts icon-hezuobaoxiangongsi"  style="vertical-align: text-bottom;font-size: 18px;"></i></span>
            <div class="clear"></div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  import OnLoad from './onLoad.vue';
  import {imgSign} from './imgEditorTwo/imgSign.js';
  import {imgCanvas} from './imgEditorTwo/imgCanvas.js';
  import {canvasControl} from './imgEditorTwo/imgControl.js';
  import {AutoResizeImage} from './imgEditorTwo/autoResizeImage.js';
  var qs = require('querystring');
  export default {
      components: {
          OnLoad: OnLoad
      },
      data () {
          return {
              newDate: null,
              data: [],
              IMGdata: [],
              url: '',
              TID: 80,
              TaskID: 0,
              IMGlist: [],
              AllowEditRow: false,
              SataeInfo: false,
              StateFeedBack: 0,
              insTime: 0,
              cliTiem: 0,
              insDate: 0,
              cliDate: 0,
              liIndex: 0,
              FeedbackValue: '',
              onload: true,
              fileID: 0,
              stageID: 0,
              AllowEdit: false, //是否允许标注
              barText: '标注反馈',
              hiddenSign: true,
              canvasSign: false,
              hiddenSignText: '隐藏标记'
          };
      },
      filters: {
          filtStat(val){
              if (val==1){
                  return '内部待审';
              } else if (val==2){
                  return '客户待审';
              } else if (val==3){
                  return '内部已反馈';
              } else if (val==4){
                  return '客户已反馈';
              } else if (val==5){
                  return '审核通过';
              } else {
                  return '--';
              }
          }
      },
      mounted(){
          this.initImgEditor();
          this.loadWH();
      },
      destroyed(){
          this.clearSession();
      },
      computed: {
          storeTaskID(){
              return this.$store.state.ImgVedioStatus.TaskID;
          },
          storeFileURl(){
              return this.$store.state.ImgVedioStatus.FileURl;
          },
          fileup(){
              return this.$store.state.paySkip.fileUpload;
          },
      },
      methods: {
      // clearSession
          clearSession(){
              sessionStorage.removeItem('ImgData');//存图片标注信息
              sessionStorage.removeItem('totalNum');//存图片放大缩小信息
          },
      // clearCanvas
          clearCanvas(){
              this.$Modal.confirm({
                  title: "清除标注",
                  content: "是否确定清除画布上面的内容,清除后将无法撤消！",
                  onOk: () => {
                      this.$Message.info('清除成功！└(^o^)┘');
                      imgCanvas("true");
                  },
              });
          },
      // hideSgin
          canvasHidden(){
              let cav=document.getElementById("cav");
              if (this.canvasSign){
                  this.barText="标注反馈";
                  cav.style.zIndex="12";
                  this.canvasSign=!this.canvasSign;
              } else {
                  this.barText="退出标注";
                  cav.style.zIndex="14";
                  this.canvasSign=!this.canvasSign;
              }
          },
          sginHidden(){
              if (this.hiddenSign){
                  $(".signIndex").css("display", "none");
                  this.hiddenSign=!this.hiddenSign;
                  this.hiddenSignText="显示标记";
              } else {
                  $(".signIndex").css("display", "block");
                  this.hiddenSign=!this.hiddenSign;
                  this.hiddenSignText="隐藏标记";
              }

          },
      //colseWindow
          InfoRefresh(){
              this.$bus.emit('InfoRefresh');
          },
          initImgEditor(){
              this.url="http://pic2.52pk.com/files/160218/3716262_185245_5644.jpg";
        // this.url=this.storeFileURl;
              this.get();
              this.onLoad();
              this.clearSession();
          },
          GetImgInfo(width, height){
              let arrWH=[width, height];
              this.$store.commit('getImgEditorWH', arrWH);
          },
          onLoad(cControl="false"){
              let _this=this;
              let el=document.getElementsByClassName("ImgOnlod")[0];
              let el2=document.getElementById("onload");
              let sgin=document.getElementsByClassName("sginCanvas")[0];
              let controlDiv=document.getElementsByClassName("oControl")[0];
              let imgFocus=document.getElementsByClassName("imgFocus")[0];
              el.onload=function(){
                  el2.style.display="none";
                  let maxH=parseInt(imgFocus.style.height);
                  let maxW=parseInt(imgFocus.style.width);
                  _this.GetImgInfo(el.naturalWidth, el.naturalHeight);
              //  autoZoom
                  if ((el.height-maxH)>50){
                      AutoResizeImage(0, maxH, el);
                  } else {
                      AutoResizeImage(maxW, 0, el);
                  }
                  if (el.width>maxW&&el.height<maxH){
                      AutoResizeImage(maxW, 0, el);
                  }

                  let canvasW=el.width;
                  let canvasH=el.height;
                  let canID=document.getElementById("cav");

              //  sginDiv
                  sgin.style.width=canvasW+"px";
                  sgin.style.height=canvasH+"px";
                  sgin.style.marginTop=-(canvasH/2)+"px";
                  sgin.style.marginLeft=-(canvasW/2)+"px";

              //  controlDiv
                  controlDiv.style.width=canvasW+"px";
                  controlDiv.style.height=canvasH+"px";

              // canvasDiv
                  canID.width=canvasW;
                  canID.height=canvasH;

                  imgCanvas(cControl, canvasW, canvasH);
                  canvasControl();

              };
          },
          loadWH(){
              let sw=$(".single-page-con").width()-500;
              let sh=$(".single-page-con").height()-200;
              $(".imgFocus").height(sh);//先注解
              $(".imgEditorCom,.imgFocus").width(sw);//先注解
              $(".toolBar").css("margin-top", sh+5);//先注解
          },
          defue(){
        // sign
              imgSign(this.AllowEdit);

          },

      //edit
          commitEidt(type){
              let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_inside_audit;
              let Okparams={
                  "stage_id": this.stageID,
                  "audit": 1, //1为通过审核,2为不通过
                  "feedback": '',
                  "file": [JSON.stringify({
                      "file_id": this.fileID,
                      "tag": []
                  })]
              };

              let EDITparams={
                  "stage_id": this.stageID,
                  "audit": 2,
                  "files": [],
                  "feedback": this.FeedbackValue,
                  "file": JSON.stringify([{
                      "file_id": this.fileID,
                      "tag": sessionStorage.ImgData!=undefined?JSON.parse(sessionStorage.ImgData):'[]'
                  }])
              };
              if (type=='edit'){
            // canvas upload
                  let canvas=document.getElementById("cav");
                  let canvasImg=canvas.toDataURL();
                  let getBlobBydataURI=(dataURI, type)=>{
                      let binary = atob(dataURI.split(',')[1]);
                      let array = [];
                            for (var i = 0; i < binary.length; i++) {
                                  array.push(binary.charCodeAt(i));
                            }
                            return new Blob([new Uint8Array(array)], {type: type });
                      };
                  let $Blob= getBlobBydataURI(canvasImg, 'image/jpeg');
                  let formData = new FormData();
                  formData.append("files", $Blob, "file_"+Date.parse(new Date())+".jpeg");
                  this.$axios.post(this.fileup, formData).then(msg=>{
                      if (msg.data.err_code==0){
                  //  EDITparams;
                          let EDITparams={
                              "stage_id": this.stageID,
                              "audit": 2,
                              "feedback": this.FeedbackValue,
                              "file": JSON.stringify([{
                                  "file_id": this.fileID,
                                  "tag": sessionStorage.ImgData!=undefined?JSON.parse(sessionStorage.ImgData):'[]',
                                  "label": msg.data.files.url
                              }])
                          };
                  // Sgin upload
                          this.$axios.post(url, EDITparams).then(msg=>{
                              this.$Message.success(msg.data.err_message);
                              this.initImgEditor();
                              sessionStorage.removeItem('ImgData');
                          }, ()=>{
                              this.$Message.error(msg.data.err_message);
                          });
                      } else {
                          this.$Message.error(msg.data.err_message);
                      }
                  }, ()=>{
                      this.$Message.error("请求失败!");
                  });
              } else if (type=='ok'){
                  this.$axios.post(url, Okparams).then(msg=>{
                      this.$Message.success(msg.data.err_message);
                      this.initImgEditor();
                      sessionStorage.removeItem('ImgData');
                  }, ()=>{
                      this.$Message.error(msg.data.err_message);
                  });
              }
          },
          imgdef(){
              $.sign.bindSign('.sginCanvas');
              $.sign.loadingSign(this.data);
          },
          changeState(state){
        //  controlImgSign
              if (state=='1'||state=='2'){
                  this.AllowEditRow=true;
                  this.SataeInfo=false;
                  this.AllowEdit=true;
              } else if (state=='3'||state=='4'||state=='5'){
                  this.AllowEditRow=false;
                  this.SataeInfo=true;
              } else {
                  this.AllowEditRow=false;
                  this.SataeInfo=false;
              }
          },
          get(){
          //  getImgSignInfo
              let TaskID=this.storeTaskID;
          //  let TaskID=590
              if (TaskID == 0 || TaskID === null ) {
                  return false;
              }

              let _this=this;
              let url=this.GLOBAL.baseRouter+this.$GLOBALAPI.task_task_stage+'&task_id='+TaskID;

              _this.$axios.get(url).then(function(msg){
                  let Sdate=msg.data;
                  if (Sdate.err_code==0){

//                _this.newDate = Sdate.data[]
                      _this.IMGlist = [];
                      _this.IMGlist = Sdate.data;

                      _this.IMGlist.forEach((val, index)=>{
                          if (val.file.file==_this.storeFileURl){
                    // 设置初始化值
                              _this.data=val.file.tag;
                              _this.StateFeedBack=val.status;
                              _this.insTime=val.inside_audit_time;
                              _this.cliTiem=val.client_audit_time;
                              _this.insDate=val.inside_audit_date;
                              _this.cliDate=val.client_audit_date;
                              _this.liIndex=index;
                              _this.fileID=val.file.id;
                              _this.stageID=val.file.stage_id;
                          }
                      });
                //  _this.changeState('2');
                      _this.changeState(_this.StateFeedBack);
              // 把StageID传到提交
                      let stageID = _this.stageID;
                      let fileID=_this.fileID;
                      _this.defue();
                      _this.imgdef();
                  } else {

                  }
              }, ()=>{
                  _this.$Message.error('请求失败');
              });
          },
      }

  };
</script>
<style lang='less'>
@import './imgEditorTwo/style/imgEditor.less';
</style>
