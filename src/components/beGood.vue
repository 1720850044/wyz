<template>
    <div class="Begood">
        <div class="overFlowDiv" id="overFlowDiv">
            <ul class="typeBar" id="typeBar" @mousedown="moveFun">
                <li v-for="(item,index) in beGoodAtData" :class="{'checked':slectIndex.parentIndex == index}"  @click="selectBeGood(item,index)" :key="index">{{item.name}}</li>
            </ul>
        </div>
        <ul class="typeSelect">
            <li v-for="(item,index) in childList" :class="{'checked':slectIndex.childIndex == index}" @click="selectChild(item,index)" :key="index" >{{item.name}}</li>
        </ul>
    </div>
</template>

<script>
    import api from 'api';
    export default {
        name: "be-good",
        props: ['job'],
        data(){
            return {
                beGoodAtData: [],
                childList: [],
                slectIndex: {
                    parentIndex: 0,
                    childIndex: null
                },
                returnData: {
                    parentName: null,
                    childID: null,
                    childName: null
                }
            };
        },
        watch: {
            job(val){
                this.$nextTick(() => {
                    if (this.beGoodAtData.length > 0){
                        this.checkJob(val);
                    } else {
                        this.getBegoodAt().then((res)=>{
                            this.checkJob(val);
                        });
                    }
                });
            }
        },
        methods: {
            moveFun(e){
                if (e.target.nodeName == 'UL'){
                    let startDisX = e.clientX;
                    let endDisX = 0;
                    let el = document.getElementById('typeBar');
                    let parentElW = document.getElementById('overFlowDiv').offsetWidth;
                    let li = el.getElementsByTagName('li');
                    let liNum = li.length;
                    let liW = li[0].clientWidth+30;
                    let ulW = (liNum * liW)-30;
                    let _this = this;
                    let lefts = this.left;

                    if (ulW > parentElW){
                        const fun = function (e) {
                            endDisX = e.clientX - startDisX + lefts > 0 ? 0 : e.clientX - startDisX + lefts < -(ulW-424) ? -(ulW-424) : e.clientX - startDisX + lefts;
                            _this.left = endDisX;
                            el.setAttribute('style', `width:${ulW}px;margin-left:${endDisX}px`);

                        };
                        const unFun = function () {
                            document.removeEventListener('mousemove', fun, false);
                            document.removeEventListener('mouseup', unFun, false);
                        };
                        document.addEventListener('mousemove', fun, false);
                        document.addEventListener('mouseup', unFun, false);
                    }
                } else {
                    return false;
                }
            },
            selectBeGood(item, index){
                this.slectIndex.parentIndex = index;
                this.childList = this.beGoodAtData[index].child;
                this.slectIndex.childIndex = null;
                this.returnData.parentName = item.name;
                this.returnData.childID = item.child[0].id;
                this.returnData.childName = item.child[0].name;
            },
            selectChild(item, index){
                this.slectIndex.childIndex = index;
                this.returnData.childID = item.id;
                this.returnData.childName = item.name;
                this.$emit('ReceiveData', this.returnData);
            },
            async getBegoodAt(){
                let res = await api.beGoodAtFun();
                if (res.data.err_code == 0){
                    this.beGoodAtData = res.data.data;
                    this.childList = res.data.data[0].child;
                    this.returnData.parentName = res.data.data[0].name;
                    this.returnData.childID = res.data.data[0].child[0].id;
                    this.returnData.childName = res.data.data[0].child[0].name;
                }
                return res.data.data;
            },
            checkJob(val){
                let _this = this;
                let parentData = this.beGoodAtData;
                parentData.forEach((function (creent, index, arr) {
                    creent.child.filter(function (item, i, arr) {
                        if (item.name === val){
                            _this.selectBeGood(creent, index);
                            _this.slectIndex.childIndex = i;
                            _this.returnData.childID = item.id;
                            _this.returnData.childName = item.name;
                        }
                    });
                }));
            }
        },
        created(){
            this.getBegoodAt();
        }
    };
</script>

<style lang="less" scoped>
    .Begood{
        line-height: normal;
        padding: 10px;
        width: 100%;
        border: 1px solid #eae9e9;
        border-radius: 3px;
        .overFlowDiv{
            overflow: hidden;
            border-bottom: 1px solid #eceaea;
        }
        .typeBar{
            white-space: nowrap;
            width: 100%;
            display: flex;
            height: 26px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            li{
                /*display: inline-block;*/
                float: left;
                margin-right: 30px;
                font-size: 13px;
                color: #989797;
                border-bottom: 2px solid rgba(255,255,255,0) !important;
                padding-bottom: 5px;
                &:hover{
                    cursor: pointer;
                    color: @base;
                }
                &.checked{
                    color: @base!important;
                    border-bottom: 2px solid @base !important;
                }
                &:last-child{
                    margin-right: 0!important;
                }
            }
        }
        .typeSelect{
            overflow: hidden;
            li{
                float: left;
                border: 1px solid #ccc;
                padding: 5px;
                border-radius: 3px;
                margin-right: 10px;
                margin-top: 15px;
                color: #989797;
                cursor: pointer;
                &:last-child{
                    margin-right: 0!important;
                }
                &.checked{
                    border: 1px solid @base!important;
                    color: @base!important;
                }
            }
        }
    }
</style>
