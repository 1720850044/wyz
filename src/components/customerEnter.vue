<template>
    <!--<div class="customerEnter" @click="$emit('showCustomer')" @mousedown.stop="mousedown($event)" @mousemove="mousemove($event)" @mouseup.stop="mouseup($event)"></div>-->
    <div class="customerEnter" @mousedown="mousedown" @click="EventListener($event)"></div>
    <!---->
</template>

<script>
    export default {
        name: "customer-enter",
        data(){
            return {
                startX: null,
                startY: null,
                left: null,
                top: null
            };
        },
        mounted(){
            this.init();
        },
        methods: {

            mousedown(e){
                let _this = this;
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.left = e.target.offsetLeft;
                this.top = e.target.offsetTop;
                document.body.addEventListener('mousemove', _this.mouseMove);
            },
            mouseMove(e){
                let _this = this;
                let moveX = (e.clientX - _this.startX + _this.left) + 'px';
                let moveY = (e.clientY - _this.startY + _this.top) + 'px';
                $('.customerEnter').css({
                    left: moveX,
                    top: moveY,
                });
            },
            init(){
                let _this = this;
                let dom = document.querySelector('.customerEnter');
                dom.addEventListener('mouseup', function (e) {
                    e.stopPropagation();
                    if ((e.clientX == _this.startX) && e.clientY == _this.startY){
                        _this.$emit('showCustomer');
                    }
                    document.body.removeEventListener('mousemove', _this.mouseMove);
                });
            },
            EventListener(event){
                event.stopPropagation();
            },
        }
    };
</script>

<style scoped lang="less">
    .customerEnter{
        background: url("../assets/images/customerEnter.png") no-repeat @base;
        width: 60px;
        height: 60px;
        background-size: 100% 100%;
        position: fixed;
        left: 0%;
        z-index: 999;
        bottom: 0%;
        border-radius: 100%;
        margin-left: 20px;
        margin-bottom: 20px;
        &:hover{
         cursor: pointer;
            box-shadow: 0px 0px 20px 0px @base;
        }
    }
</style>
