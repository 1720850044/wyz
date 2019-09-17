<template>
    <div >
        <Modal
            v-model="showTimeAdd"
            width="660"
            class="over"
            ok-text="确定添加"
            @on-ok='addOver'
            title="Common Modal dialog box title">
            <div class="addtime">
                <p class="addtimeinput"> 加班时间
                <span >
                    <DatePicker type="date" format="yyyy/MM/dd" @on-change="on1" placeholder="-请选择-" style="width: 72px;padding-left:10px;"></DatePicker>
                    <TimePicker format="HH:mm"   @on-change="off1"  :open=flag1 style="width: 40px"></TimePicker>
                    <!-- <date-picker type="datetime" placeholder="请选择开始时间" ></date-picker> -->
                    至
                    <DatePicker type="date"  format="yyyy/MM/dd" placeholder="-请选择-"  @on-change="on2" style="width: 72px; padding-left:10px;"></DatePicker>
                    <TimePicker format="HH:mm"  @on-change="off2"  :open=flag2   style="width: 40px"></TimePicker><i class="icon iconfonts icon-icon2"></i> 
                     <!-- <date-picker type="datetime"  placeholder="请选择结束时间"  ></date-picker> -->

                </span>
                <Alert type="warning" ><i class="icon iconfonts icon-jingao"></i>  实际加班 <span class="time">3</span> h(已排除上班时间)</Alert>
                </p>
                <p class="personnel">加班人员（ <span>{{num}}</span> ）<Icon type="checkmark-circled"></Icon></Icon></p>
                <ul class="personelList"  >
                    <li  v-for="(item,index) in addtimeData" :key="index" @click="addEelTime">
                        <span class="img"></span>
                        {{item}}
                        <!-- <Icon v-if="item"  type="ios-plus-outline"></Icon></Icon><Icon v-if="!item" type="checkmark-circled"></Icon> -->
                        <i  class="ivu-icon"></i>
                    </li>
                    
                    
                </ul>
            </div>
       </Modal>
    </div>
</template>
<script>
export default {
    data(){
        return {
            showTimeAdd: false,
            addDel: true,
            num: 0,
            addtimeData: ['范小伟', '无柠檬', 'three', 'four', 'five'],
            addIndex: -1,
            flag1: false,
            flag2: false
        };
    },
    methods: {
        addEelTime(e){
            
            if (e.target!="i"){
            // console.log(e)
                if (!e.target.className){
                    e.target.className='active';
                    this.num++;
                // console.log(this)
                // console.log(this) bnbv n
            
                } else {
                    e.target.className='';
                    this.num--;
                // this.addDel=!this.addDel
                }
            }        
            //  debugger;
            // console.log(e.target.innerHtml)
           
        },
          //确定按钮
        addOver(){
            console.log('111');
            
        },
        on1(){
            // console.log(111)
            this.flag1=true;
            
        },
        off1(){
            this.flag1=false;

        },
        on2(){
            // console.log(111)
            this.flag2=true;
            
        },
        off2(){
            this.flag2=false;

        }
    }
};
</script>
<style lang='less'>
.over{
      .ivu-modal-content{
       
  
          .ivu-modal-body{
            padding: 30px;
        }
        .ivu-modal-footer{
            border: 0;
            padding-bottom: 30px;
            padding-right: 30px;
        
            .ivu-btn{
                width: 100px;
                height: 40px;
                font-size: 16px;
            }
            .ivu-btn-text{
                color: #C6C6C6;

            }
        }
      }
    }

    .addtime{
        color: #BDBDBD;
        .addtimeinput{
            
            &>span{
                display: inline-block;
                margin-left: 16px;
                width: 530px;
                border:1px solid @baseboard;
                height: 40px;
                font-size: 14px;
                line-height: 40px;
                .ivu-date-picker-focused input{
                    border:0!important;
                    box-shadow: none!important;
                }
                .ivu-input{
                    border: 0;
                 
                    padding: 0;
                    // color: #8ADECE;
                    
                }
               .ivu-input:focus, .ivu-input:hover{
                   border:0!important;
               }
                .ivu-input-icon{
                    display: none;
                }
            }
            .iconfonts{
                color: #8ADECE;
                // margin-left: 12px;
            }
            .ivu-alert{
                width: 530px;
                margin-left: 65px;
                background: #FFF8EB;
                color: #FDDFA7;
                font-size: 13px;
                margin-top: 5px;
                .icon{
                    color: #FDDFA7;
                    margin-right: 10px;
                }
                .time{
                    color: #5FD3BD;
                }
            }
        }
        .personnel{
            position: relative;
            margin-top: 22px;
            &>.ivu-icon{
                position: absolute;
                right: 0;
                font-size: 22px;
                color: #3BCEB6;
            }
            span{
                color: #3BCEB6;
            }
        }
        .personelList{
            padding-left: 22px;
            // padding-top: 30px;
            overflow: hidden;
            li{
                width: 100px;
                border: 1px solid @baseboard;
                height: 32px;
                line-height: 28px;
                color: @black_2;
                padding-left: 6px;
                cursor: pointer;
                font-size: 13px;
                position: relative;
                float: left;
                margin-left: 44px;
                margin-top: 30px;
                border-radius: 4px;

                // .ivu-icon{
                //     color: #D0D0D0;
                //     margin-left: 15px;
                //     font-size: 18px;
                // }
                .img{
                    display: inline-block;
                    width: 18px;
                    // margin-right: 8px;
                    
                }
                i{
                    
                    font-style: normal;
                    position: absolute;
                    right: 8px;
                    line-height: 28px;
                    &:after {
                        content: "\F48A";
                        // color: @green2;
                        font-size: 16px;
                    }
                }
               
            } 
            .active{
                background: #DCF6F2;
                border-color: #3BCEB6;
                i{
                    &:after {
                        content: "\F120";
                        // color: @green2;
                        font-size: 16px;
                        color: #3BCEB6;
                    }
                }
            }
        }
    }
</style>
