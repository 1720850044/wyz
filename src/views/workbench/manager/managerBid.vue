<template>
   <div class="bid_all">
      <div class="clearfix bid_head">
         <p class="bid_head_msg">{{$t('workbench.work_bid')}}</p>
         <!-- <p class="bid_head_but  iconfonts icon-shenglve-"></p> -->
      </div>
       <!-- bid main -->
      <div class="bid_main">
         <div class="bid_main_top">
           <i-circle
            :size="140"
            :trail-width="8"
            :stroke-width="8"
            :percent="bidList.win_rate"
            stroke-linecap="square"
            trail-color="#fcf0d4"
            stroke-color="@orange">
            <div class="demo-Circle-custom">
              <p class="bid_fen"><span class="bid_number">{{bidList.win_rate}}</span>%</p>
              <p class="bid_zhong">{{$t('workbench.work_winning_rate')}}</p>
              <p class="bid_left_title">
                 <span class="iconfonts icon-xiangshang01" style="color: #f44336;font-size: 13px;font-weight: bolder"></span>
                 <span style="color: #f44336">+{{bidList.add}}</span>
                 <span style="color: #bdbdbd;font-size: 12px">%</span>
               </p>
            </div>
           </i-circle>
        </div>
        <div class="bid_main_bottom">
           <div class="bid_bottom_bx">
               <p class="numberSty">{{bidList.total}}</p>
              <!--<p class="bid_sign">{{bidList.total}}</p>-->
              <p class="brief">{{$t('workbench.work_enrolment')}}</p>
           </div>
            <div class="bid_bottom_bx bid_bx_center">
                <p class="numberSty">{{bidList.file}}</p>
              <!--<p class="bid_hand">{{bidList.file}}</p>-->
              <p class="brief">{{$t('workbench.work_manuscriptSubmitted')}}</p>
           </div>
            <div class="bid_bottom_bx">
                <p class="numberSty">{{bidList.win_bid}}</p>
              <!--<p class="bid_hit">{{bidList.win_bid}}</p>-->
              <p class="brief">{{$t('workbench.work_bidding')}}</p>
           </div>
        </div>
      </div>
   </div>
</template>
<script>
export default {
    props: ['bidList'],
    data () {
        return {
        };
    }
};
</script>
<style lang='less'>
.bid_all{
  .base-card;
  .bid_head{
    .bid_head_msg{
      .base-card-operation-head;
    }
    .bid_head_but{
      .base-card-operation-icon;
    }
  }
  .bid_main{
    width: 100%;
    @wo: 30px;
    height: calc(~"100% - @{wo}");
    &_top{
      width: 100%;
      @widths: 60px;
      height: calc(~"100% - @{widths}");
      display: flex;
      justify-content: center;
      align-items: center;
      .demo-Circle-custom{
        & .bid_fen{
          font-size: 12px;
          color: #bdbdbd;
        }
        .bid_number {
          font-size: 20px;
          color: @orange;
        }
        .bid_zhong {
          font-size: 13px;
          margin: 5px 0;
          color: #bdbdbd;
        }
      }
    }
    &_bottom{
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .bid_bx_center{
        /*margin: 0px 100px;*/
      }
      .bid_bottom_bx{
        height: 100%;
        .numberSty{
          font-size: 20px;
          color: @black_2;
          text-align: center;
        }
        .bid_sign,.bid_hand,.bid_hit{
          font-size: 16px;
          text-align: center;
        }
        .bid_sign{
          color: @orange;
        }
        .bid_hand{
            color: @blue;
        }
        .bid_hit{
            color: @red;
        }
        .brief{
          color: @black_3;
          font-size: 13px;
          text-align: center;
        }
      }
    }
  }
}
</style>
