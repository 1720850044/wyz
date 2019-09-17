<template>
    <div  v-if="currenVal !== '' && !disabled" class="taskselect" @click.stop >
        <div style="overflow: hidden">
            <input type="text" :value="currenVal" :disabled="disabled" class="currenVal" readonly @click.stop="isShowFun = !isShowFun"/>
            <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow" style="color: #9E9E9E;"></i>
        </div>

        <div class="selectContent" v-if="isShowFun">
            <ul class="dataList" v-if="dataList">
                <li v-for="(item,index) in dataList" :label="item.name" :value="item.id" :key="item.id"  @click="getVal(item.name,item.id)">{{ item.name }} </li>
            </ul>
            <p><input type="text" v-model="values" :placeholder="$t('companySpecificationLibrarys.com_enterNewLabel')" @keyup.enter="$emit('addNormsFun',values)"/></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "taskselect",
        props: {
            isSubmit: {
                type: Boolean,
            },
            project: {
                type: Boolean,

            },
            dataList: {
                type: Array,
                default: {},
            },
            normName: String,
            disabled: Boolean,
            callbackStatus: Boolean,
            parentIndex: Number,
            chilenIndex: Number,
            module: {
                type: Array,
                default: []
            }
        },
        watch: {
            callbackStatus(val){
                if (val) {this.values = null;}
            }
        },
        data(){
            return {
                isShowFun: false,
                currenVal: this.normName || i18n.t('companySpecificationLibrarys.com_specificationLabel'),
                values: null
            };
        },
        methods: {
            getVal(val, id){
                this.currenVal = val;
                this.isShowFun = false;
                if (this.parentIndex!=null){
                    this.module[this.parentIndex].require[this.chilenIndex].norm = id;
                    this.$emit('Selectdata', {data: this.module, falg: true});
                } else {
                    this.$emit('Selectdata', {id: id, val: val, falg: false});
                }
                // console.log(this.dataList)
                // console.log(this.parentIndex);
                // console.log(this.chilenIndex);
                // console.log(index);
                // console.log(JSON.stringify(this.module));
                // console.log(this.module[0])

                    // console.log(JSON.stringify(this.module));

            }
        },
        mounted () {
            var _this = this;
//           if(!this.project){

            document.body.addEventListener('click', (e)=> {
                   // alert(1411)

                var ev = e || event;
                ev.stopPropagation();
                _this.isShowFun = false;

                   // ev.preventDefault();

                   // return false

            });
//           }

        },
    };
</script>

<style lang="less" scoped>
    .taskselect{
        // border: 1px solid @black_4;
        width: 120px;
        height: 30px;
        /*text-align: center;*/
        position: relative;
        border-radius: 3px;
        cursor: pointer;
        margin: 0 0px 0 8px;
        .currenVal{
            display: inline-block;
            width: 100%;
            height: 28px;
            line-height: 30px;
            border: none;
            outline: none;
            padding: 0 8px;
            color: @black_3;
            font-size:12px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            border-radius: 3px;
            &:disabled{
                background: #f3f3f3;
                color: #ccc;
                &:hover{cursor: no-drop}
            }
            &:hover{
                cursor: pointer;
            }
        };
        .selectContent{
            position: absolute;
            left: 0;
            right: 0;
            top: 32px;
            box-shadow: 0px 1px 3px 1px #d2d2d2;
            border-radius: 6px;
            z-index: 999;
            background: #fff;
            .dataList{
                width: 100%;
                height: 100%;
                max-height: 120px;
                overflow: auto;
                z-index: 999;
                background: #fff;
                border-bottom: 1px solid #e4e4e4;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                li{
                    height: 30px;
                    line-height: 30px;
                    padding: 0 8px;
                    &:hover{
                        background: #f1f1f1;
                        cursor: pointer;
                    }
                }
            }
            p{
                z-index: 999;
                height: 30px;
                line-height: 30px;
                input{
                    width: 100%;
                    border: none;
                    outline: none;
                    border-radius: 8px;
                    padding: 0 8px;
                }
            }
        }

    }
</style>
