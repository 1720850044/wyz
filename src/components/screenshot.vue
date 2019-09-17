<template>
    <div v-show="moveShow">
        <!-- 用于画rect的canvas -->
        <canvas id="canvas" :width="canvasW" :height="canvasH" ref="canvas" class="screenshot"
                @click="$event.stopPropagation()" @mousedown="mousedown" @mouseup="mouseup"></canvas>
        <!--<div class="buttonList">-->
        <!--<Button id="asd" type="primary" @click="submitBase64">确认</Button>-->
        <!--<Button type="error" @click="cancel">取消</Button>-->
        <!--</div>-->
        <!--用于存储base64的canvas-->
        <canvas style="opacity: 0;" id="imgCanvas" :width="imgCanvasW" :height="imgCanvasH"></canvas>
    </div>
</template>

<script>
    import PublicFuns from '@/libs/PublicFuns';
    export default {
        created() {
        },
        mounted() {
        },
        data() {
            return {
                moveShow: false,
                dataUrl: null,
                ossKey: null,
                dataBase64: null,
                imgCanvas: null,
                canvasDom: null,
                ctx: null,
                is_move: true,
                nowX: 0,
                nowY: 0,
                newX: 0,
                newY: 0,
                rectWidth: 0,
                rectHeight: 0,
                canvasW: 0,
                canvasH: 0,
                imgCanvasW: 0,
                imgCanvasH: 0,
                group_id: null,
                chatType: null
            };
        },
        methods: {
            // 初始化 Rect canvas 宽高
            init(id, type) {
                this.chatType = type;
                this.group_id = id;
                this.moveShow = true;
                this.canvasDom = document.querySelector('#canvas');
                this.canvasW = document.documentElement.clientWidth - 8;
                this.canvasH = document.documentElement.clientHeight - 8;
                this.ctx = this.canvasDom.getContext("2d");
                this.is_move = true;
//                this.dataUrl = null
            },

            /* 鼠标按下 记录初始坐标 并监听move事件*/
            mousedown(e) {
                e.preventDefault();
                if (e.button === 2) {
                    this.moveShow = false;
                }
                if (e.button !== 0) {
                    return;
                }
                // 点击裁剪
                if (this.is_move) {
                    // 获取初始坐标
                    this.nowX = e.clientX;
                    this.nowY = e.clientY;
                    // 并调用move事件
                    this.canvasDom.addEventListener('mousemove', this.strokeRect);
                }
            },

            /* 鼠标离开 获取img url值*/
            async mouseup(e) {
                // 非左键操作
                if (e.button !== 0) {
                    return;
                }
                this.canvasDom.style.background = 'transparent';
                if (this.chatType === 'chat'){
                    this.$bus.emit('MsgIsShowTrue');
                } else if (this.chatType === 'customer') {
                    this.$store.commit('setCustomerShowOrHiden', true);      //副开关 显示隐藏不会调用接口
                }

                this.moveShow = false;
                this.clearRect();
                this.$Message.success('截图成功，正在加载...');
                // 停止move事件
                this.canvasDom.removeEventListener('mousemove', this.strokeRect);
                // 点击取消
                this.is_move = false;
                // 初始化img canvas的宽高
                this.imgCanvasW = this.rectWidth;
                this.imgCanvasH = this.rectHeight;
                // 获取body的canvas 并根据坐标裁剪出base64图片
                await PublicFuns.getHtml2canvas(document.body, (data) => {
                    let imgCanvasDom = document.querySelector('#imgCanvas');
                    imgCanvasDom.getContext("2d").drawImage(data, this.nowX, this.nowY, this.rectWidth, Math.abs(this.rectHeight), 0, 0, Math.abs(this.rectWidth), Math.abs(this.rectHeight));
                    this.dataBase64 = imgCanvasDom.toDataURL('image/png');
                });
                // 获取osskey值
                this.ossKey = await PublicFuns.getOssKey({type: 'group-chat', group: this.group_id});
                // 根据base64 osskey 上传oss 获取url地址
                this.dataUrl = await PublicFuns.uploadOss(this.dataBase64, this.ossKey);
                this.submitBase64();
            },

            /* canvas画矩形 */
            strokeRect(e) {
                this.canvasDom.style.background = 'rgba(0,0,0,.2)';
                const ctx = this.ctx;
//                ctx.fillStyle = "transparent";
                ctx.fillStyle = "rgba(255,255,255,.4)";
                ctx.strokeStyle = "#f44336";
                ctx.lineWidth = 1;
                this.rectWidth = e.clientX >= this.nowX ? e.clientX - this.nowX : -(this.nowX - e.clientX);
                this.rectHeight = e.clientY >= this.nowY ? e.clientY - this.nowY : -(this.nowY - e.clientY);
                this.clearRect();
                ctx.fillRect(this.nowX, this.nowY, this.rectWidth, this.rectHeight); //填充的四个参数(x,y,width,height)
                ctx.strokeRect(this.nowX, this.nowY, this.rectWidth, this.rectHeight); //线的四个参数(x,y,width,height)
            },

            /* 把url传给父组件 */
            submitBase64() {
                this.$emit('sendImg', this.dataUrl+'#screen');
            },

            /* 取消 */
            cancel() {
                this.moveShow = false;
                this.clearRect();
            },

            /* 清空画布 */
            clearRect() {
                this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
            }
        },
        computed: {},
        components: {}
    };
</script>

<style scoped>
    .screenshot {
        position: fixed;
        top: 0;
        left: 0;
        /*width: 100%;*/
        /*height: 100%;*/
        border: 4px solid #0db2ff;
        z-index: 999;
    }
    .buttonList {
        position: fixed;
        z-index: 999;
    }
</style>
