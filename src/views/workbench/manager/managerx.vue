<template>
   <div class="incomes">
      <p class="incomes_head">{{$t('workbench.work_expenditure')}}</p>
      <Row class="incomes_row">
        <Col span="12" class="incomes_row_dashad">
          <div class="clearfix incomes_row_children">
            <img src="../../../assets/images/manager_three.png" class="incomes_row_img"/>
            <div class="incomes_row_box">
              <p class="incomes_row_nume">￥<span class="incomes_numdd">{{data.pay}}</span></p>
              <P class="incomes_row_title">{{$t('workbench.work_paid')}}</p>
            </div>
          </div>
        </Col>
        <Col span="12" class="incomes_row_right">
          <div class="clearfix incomes_row_children">
            <img src="../../../assets/images/manager_two.png" class="incomes_row_img"/>
            <div class="incomes_row_box">
              <p class="incomes_row_numx">￥<span class="incomes_numdd">{{data.wait_pay}}</span></p>
              <P class="incomes_row_title">{{$t('workbench.work_unpaid')}}</p>
            </div>
          </div>
        </Col>
      </Row>
   </div>
</template>
<script>
export default {
    props: ['data'],
    data () {
        return {
        };
    }
};
</script>
<style lang="less">
.incomes{
    .base-card;
    &_head{
      .base-card-head;
    }
    &_row{
      &_dashad{
        height: 100%;
        border-right: 1px dashed rgb(224,224,224);
        margin: 0px 0px 12px 0px;
      }
      &_right{
        height: 100%;
      }
      &_children {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items:flex-end;
      }
      &_img{
        float: left;
        height: 60px;
        width: 60px;
      }
      &_box{
        float: left;
        margin-left: 10px;
      }
      &_nume{
        font-size: 15px;
          color: @blue;
      }
      &_numx{
        font-size: 12px;
          color: @orange;
      }
      .incomes_numdd{
        font-size: 20px;
      }
      &_title{
        font-size: 13px;
        text-align: center;
        color:@black_2
      }
    }
}
</style>
