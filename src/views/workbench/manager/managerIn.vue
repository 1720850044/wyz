<template>
    <div class="income">
        <p class="income_head">{{$t('workbench.work_income')}}</p>
        <Row class="income_row">
            <Col span="12" class="income_row_dashad">
                <div class="clearfix income_row_children">
                    <img src="../../../assets/images/managaer_one.png" class="income_row_img"/>
                    <div class="income_row_box">
                        <p class="income_row_num">￥<span class="income_num">{{data.income}}</span></p>
                        <P class="income_row_title">{{$t('workbench.work_receivable')}}</p>
                    </div>
                </div>
            </Col>
            <Col span="12" class="income_row_right">
                <div class="clearfix income_row_children">
                    <img src="../../../assets/images/manager_four.png" class="income_row_img"/>
                    <div class="income_row_box">
                        <p class="income_row_nums">￥<span class="income_num">{{data.wait_income}}</span></p>
                        <P class="income_row_title">{{$t('workbench.work_uncollected')}}</p>
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
    .income {
        .base-card;
        &_head {
            .base-card-head;
        }
        &_row {
            &_dashad {
                height: 100%;
                border-right: 1px dashed rgb(224, 224, 224);
                margin: 0px 0px 12px 0px;
            }
            &_right {
                height: 100%;
            }
            &_children {
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: flex-end;
            }
            &_img {
                float: left;
                height: 60px;
                width: 60px;
            }
            &_box {
                float: left;
                margin-left: 10px;
            }
            &_num {
                font-size: 15px;
                color: @base;
            }
            &_nums {
                font-size: 15px;
                color: @red;
            }
            .income_num {
                font-size: 20px;
            }
            &_title {
                font-size: 13px;
                text-align: center;
                color: @black_2
            }
        }
    }
</style>
