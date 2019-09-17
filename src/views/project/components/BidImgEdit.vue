<!--<template>-->
    <!--<div class="defaultH">-->
        <!--<div class="imgEditorCom" id="imgEditorCom">-->
            <!--&lt;!&ndash; 加载动画 &ndash;&gt;-->
            <!--<OnLoad id="onload"></OnLoad>-->
            <!--<canvas id="myCanvas" @mousewheel="mousewheel" @mousedown="mousedown"></canvas>-->
            <!--&lt;!&ndash;<img :src="url" id="ImgOnlod"/>&ndash;&gt;-->
            <!--&lt;!&ndash; 标注提交 &ndash;&gt;-->
            <!--<div v-if="AllowEditRow" class="AllowEdit">-->
            <!--<span class="EditInput">-->
                <!--<input type="text" placeholder="请输入你要反馈的内容" id="EditInput" v-model="FeedbackValue">-->
            <!--</span>-->
                <!--<span class="EditSub">-->
                <!--<button class="actionPost" @click="commitEidt('edit')">需修改</button>-->
            <!--</span>-->
                <!--<span class="EditSub">-->
                <!--<button class="subPass" @click="commitEidt('ok')">通过</button>-->
                <!--<em @click="InfoRefresh" id="InfoRefresh"></em>-->
            <!--</span>-->
            <!--</div>-->

            <!--&lt;!&ndash; 反馈信息 &ndash;&gt;-->
            <!--<div v-if="SataeInfo" class="feedbackInfo feedbackInfoTow">-->
                <!--<span><p>审核意见</p><br/>{{Biddata.examine_description}}</span>-->
                <!--<span><p>审核结果</p><br/><b-->
                        <!--:class="[Biddata.status==2?'NOT':'']">{{Biddata.status==2?'需求修改':'通过'}}</b></span>-->
                <!--<span><p>审核人</p><br/>{{Biddata.examine_user}}</span>-->
                <!--<span><p>审核时间</p><br/>{{Biddata.examine_days==0?'今天':Math.abs(Biddata.examine_days)+'天前'}}</span>-->
                <!--<div class="clear"></div>-->
            <!--</div>-->
        <!--</div>-->
    <!--</div>-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
<!--</template>-->
<!--<script>-->
    <!--var Data = [];-->
    <!--var FX, FY = 0;-->
    <!--var ctx, W, H, img = null;-->
    <!--var qs = require('querystring');-->
    <!--import OnLoad from './onLoad.vue';-->

    <!--export default {-->
        <!--components: {-->
            <!--OnLoad-->
        <!--},-->
        <!--data () {-->
            <!--return {-->
                <!--data: [],-->
                <!--IMGdata: [],-->
                <!--Biddata: [],-->
                <!--url: '',-->
                <!--AllowEditRow: false,-->
                <!--SataeInfo: false,-->
                <!--StateFeedBack: 0,-->
                <!--insTime: 0,-->
                <!--cliTiem: 0,-->
                <!--insDate: 0,-->
                <!--cliDate: 0,-->
                <!--insUid: 0,-->
                <!--cliUid: 0,-->
                <!--liIndex: 0,-->
                <!--FeedbackValue: '',-->
                <!--onload: true,-->
                <!--fileID: 0,-->
                <!--stageID: 0,-->
                <!--bidFileStatus: null-->
            <!--};-->
        <!--},-->
        <!--mounted () {-->
            <!--this.loadWH();-->
        <!--},-->
        <!--methods: {-->
            <!--InfoRefresh () {-->
                <!--this.$bus.emit('InfoRefresh');-->
            <!--},-->
            <!--onLoad (url) {-->
                <!--this.fileStatus();-->
                <!--let canvas = document.getElementById('myCanvas');-->
                <!--W = parseInt($('#imgEditorCom').width());-->
                <!--H = parseInt($('#imgEditorCom').height());-->
                <!--canvas.width = W;-->
                <!--canvas.height = H;-->
                <!--ctx = canvas.getContext('2d');-->
                <!--let el2 = document.getElementById('onload');-->
                <!--img = new Image();-->
                <!--img.src = url;-->
                <!--FX = W / 2;-->
                <!--FY = H;-->
                <!--img.onload = function () {-->
                    <!--el2.style.display = 'none';-->
                    <!--ctx.drawImage(img, (W - (W / 2)) / 2, 0, W / 2, H);-->
                <!--};-->
            <!--},-->
            <!--mousewheel (e) {-->
                <!--ctx.clearRect(0, 0, W, H);-->
                <!--if (e.wheelDelta > 0) {-->
                    <!--FX += 3;-->
                    <!--FY += 2;-->
                <!--} else {-->
                    <!--FX -= 3;-->
                    <!--FY -= 2;-->
                <!--}-->
                <!--ctx.drawImage(img, (W - (W / 2)) / 2, 0, FX, FY);-->
            <!--},-->
            <!--mousedown (e) {-->
                <!--ctx.clearRect(0, 0, W, H);-->
                <!--ctx.drawImage(img, 0, 0, FX, FY);-->
                <!--console.log(e);-->
                <!--var X = e;-->
            <!--},-->
            <!--loadWH () {-->

            <!--},-->
            <!--defue (BID, status) {-->
                <!--(function ($) {-->
                    <!--var cX, cY, indexId = 0, removeId, DOM;-->
                    <!--var Rleft, Rtop;//需要删除的坐标-->
                    <!--jQuery.sign = {-->
                        <!--bindSign: function (dom) {-->
                            <!--DOM = dom;-->
                            <!--defined(dom);-->
                        <!--},-->
                        <!--loadingSign: function (data) {-->
                            <!--console.log(data);-->
                            <!--loading(data);-->
                            <!--Data.concat(data);-->
                        <!--}-->
                    <!--};-->
                    <!--document.oncontextmenu = function (e) {-->
                        <!--e.preventDefault();-->
                    <!--};//阻止鼠标右键默认事件-->
                    <!--$(document).on('click', '.imgFocus img', function (e) {-->
                        <!--$('.inputSignBox').hide();-->
                        <!--e.stopPropagation;-->
                    <!--});-->

                    <!--function defined (dom) {-->
                        <!--//是否显示标记-->
                        <!--if (status == '1' || status == '2') {-->
                            <!--return;-->
                        <!--}-->
                        <!--//鼠标右键-->
                        <!--$(document).on('mousedown', dom, function (e) {-->
                            <!--e.preventDefault();-->
                            <!--if (e.which == 3) {-->
                                <!--$('.inputSignBox').remove();-->
                                <!--var l = e.clientX - $(dom).offset().left;-->
                                <!--var t = e.clientY - $(dom).offset().top;-->
                                <!--cX = l;-->
                                <!--cY = t;-->
                                <!--$(dom).append('<div class=\'inputSignBox\'></div>');-->
                                <!--$('.inputSignBox').append('<div class=\'outSignbox\'>X</div>');-->
                                <!--$('.inputSignBox').append('<div class=\'signbox\' contenteditable=\'true\' id=\'inputText\' tabindex=\'-1\'><em id=\'deflutText\'>输入标记</em></div>');-->
                                <!--$('.inputSignBox').append('<div class=\'sureSign\'>标注</div>');-->
                                <!--$('.inputSignBox').css({'left': cX, 'top': cY});-->
                                <!--e.stopPropagation();-->
                            <!--}-->
                        <!--});-->
                        <!--//添加编辑-->
                        <!--$(document).on('click', '#inputText', function () {-->
                            <!--$(this).focus();-->
                            <!--$('.signbox em').remove();-->
                        <!--});//编辑框聚焦-->
                        <!--$(document).on('click', '.outSignbox', function () {-->
                            <!--$('.inputSignBox').remove();-->
                        <!--});//退出编辑-->
                        <!--$(document).on('click', '.sureSign', function () {-->
                            <!--if ($('.signbox em').length > 0) {-->
                                <!--$('.inputSignBox').remove();-->
                            <!--} else if ($('.signbox').text().length <= 0) {-->
                                <!--$('.inputSignBox').remove();-->
                            <!--} else {-->
                                <!--indexId++;-->
                                <!--var text = $.trim($('.signbox').text());-->
                                <!--$('.inputSignBox').remove();-->
                                <!--$(dom).append('<div class=\'signIndex\' id=\'Ts' + indexId + '\' theSign=\'' + text + '\'>' + '<div class=\'hintBox\'' + 'title=' + text + '>' + text + '</div>' + '</div>');-->
                                <!--$('#Ts' + indexId).css({'left': cX - 11, 'top': cY - 29});-->
                                <!--var mes = {left: cX - 11, top: cY - 29, message: text};-->
                                <!--Data[Data.length] = mes;-->
                                <!--sessionStorage.ImgData = JSON.stringify(Data);-->

                            <!--}-->
                        <!--});//确认编辑-->
                        <!--$(document).on('mouseenter', '[id*=Ts]', function (e) {-->
                            <!--var m = $(this).attr('id').replace(/[^0-9]/ig, '');-->
                            <!--// if(e.which==3){-->
                            <!--e.stopPropagation();-->
                            <!--removeId = m;-->
                            <!--$('.chooseBox').remove();-->
                            <!--Rleft = $(this).css('left').replace(/[^0-9]/ig, '');-->
                            <!--Rtop = $(this).css('top').replace(/[^0-9]/ig, '');-->
                            <!--var l = e.clientX - $(dom).offset().left, t = e.clientY - $(dom).offset().top;-->
                            <!--$(this).append('<div class=\'chooseBox\'><ul><li id=\'deleteSign\'>X</li></ul></div>');-->
                            <!--$('.chooseBox').css({'left': 45, 'top': -20});-->
                            <!--// }-->
                        <!--});//弹出取消标记-->
                        <!--$(document).on('click', '#deleteSign', function () {-->
                            <!--deleteData(Rleft, Rtop);-->
                            <!--$('#Ts' + removeId).remove();-->
                        <!--});//删除标记-->

                        <!--$(document).click(function () {-->
                            <!--$('.chooseBox').remove();-->
                        <!--});-->
                        <!--//点击消失-->
                    <!--}-->

                    <!--function deleteData (left, top) {-->
                        <!--for (var i = 0; i < Data.length; i++) {-->
                            <!--if (Data[i].left == left && Data[i].top == top) {-->
                                <!--Data.splice(i, 1);-->
                                <!--sessionStorage.ImgData = JSON.stringify(Data);-->
                                <!--break;-->
                            <!--} else {-->
                                <!--continue;-->
                            <!--}-->

                        <!--}-->
                    <!--}//删除数据-->
                    <!--function loading (data) {-->
                        <!--$('.signIndex').remove();-->
                        <!--if (data != null) {-->
                            <!--var l = Data.length;-->
                            <!--for (var i = 0; i < data.length; i++) {-->
                                <!--indexId++;-->
                                <!--$(DOM).append('<div class=\'signIndex\' id=\'Ts' + l + '\' theSign=\'' + data[i].message + '\'>' + '<div class=\'hintBox\'' + 'title=' + data[i].message + '>' + data[i].message + '</div>' + '</div>');-->
                                <!--$('#Ts' + l).css({'left': Number(data[i].left), 'top': Number(data[i].top)});-->
                                <!--l++;-->
                            <!--}-->
                            <!--indexId = l;-->
                        <!--}-->

                    <!--}//载入数据-->
                <!--})(jQuery);-->
            <!--},-->
            <!--//需要修改-->
            <!--commitEidt (type) {-->
                <!--let Okparams = {-->
                    <!--'id': this.stageID,-->
                    <!--'status': 1,-->
                    <!--'examine_description': this.FeedbackValue,-->
                <!--};-->
                <!--let EDITparams = {-->
                    <!--'id': this.stageID,-->
                    <!--'tag': JSON.stringify(sessionStorage.ImgData),-->
                    <!--'examine_description': this.FeedbackValue,-->
                <!--};-->
                <!--if (type == 'edit') {-->
                    <!--let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_bid_tag;-->
                    <!--this.$axios.post(url, EDITparams).then(msg => {-->
                        <!--this.$Message.success(msg.data.err_message);-->
                        <!--this.Editget();-->
                        <!--sessionStorage.removeItem('ImgData');-->
                    <!--}, () => {-->
                        <!--this.$Message.error(msg.data.err_message);-->
                    <!--});-->
                <!--} else {-->
                    <!--let url = this.GLOBAL.baseRouter + this.$GLOBALAPI.task_examine_bid;-->
                    <!--this.$axios.post(url, Okparams).then(msg => {-->
                        <!--this.Editget();-->
                        <!--this.$Message.success(msg.data.err_message);-->
                        <!--sessionStorage.removeItem('ImgData');-->
                    <!--}, () => {-->
                        <!--this.$Message.error(msg.data.err_message);-->
                    <!--});-->
                <!--}-->
            <!--},-->
            <!--imgdef () {-->
                <!--$.sign.bindSign('#signx');-->
                <!--$.sign.loadingSign(this.data);-->
            <!--},-->
            <!--fileStatus () {-->
                <!--if (this.bidFileStatus == 0) { //允许标注-->
                    <!--this.AllowEditRow = true;-->
                    <!--this.SataeInfo = false;-->
                <!--} else if (this.bidFileStatus == 1 || this.bidFileStatus == 2) { //不允许标注-->
                    <!--this.AllowEditRow = false;-->
                    <!--this.SataeInfo = true;-->
                <!--}-->
            <!--},-->
            <!--Editget (bidFile) {-->
                <!--console.log(bidFile);-->
                <!--let _this = this;-->
                <!--_this.onLoad(bidFile.file);-->
                <!--sessionStorage.removeItem('FeedbackValue');-->
                <!--//  控制图片是否可标注-->
                <!--_this.bidFileStatus = bidFile.status;-->
                <!--_this.data = bidFile.tag;-->
                <!--_this.url = bidFile.file;-->
                <!--_this.Biddata = bidFile;-->
                <!--_this.stageID = bidFile.id;-->
                <!--_this.defue(bidFile.id, bidFile.status);-->
                <!--_this.imgdef();-->
            <!--},-->

        <!--}-->

    <!--};-->
<!--</script>-->
<!--<style lang='less' scoped>-->
    <!--@import '../../../assets/styles/imgEditor.less';-->

    <!--.defaultH, .imgEditorCom, .imgFocus, #myCanvas {-->
        <!--width: 100%;-->
        <!--height: 100%;-->
        <!--text-align: center;-->
        <!--background: #ccc;-->
    <!--}-->

    <!--#ImgOnlod {-->
        <!--display: none;-->
        <!--/*width: 30%;*/-->
        <!--/*height: 100%;*/-->
    <!--}-->
<!--</style>-->
