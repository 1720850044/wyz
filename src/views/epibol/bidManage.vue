<template>
    <!-- 投标 -->
    <div class="bidManage">
        <routerlink>
            <ul slot="linkList" class="linkTab">
                <router-link tag="li" to="/epibol/bidManage/bidIndex">已报名</router-link>
                <!--<router-link tag="li" to="/epibol/bidManage/bidInvite">外包邀请</router-link>-->
                <router-link tag="li" to="/epibol/bidManage/testInvite">测试邀请</router-link>
            </ul>
        </routerlink>
        <router-view></router-view>
    </div>
</template>
<style lang="less">
    .bidManage {
        height: 100%;
        .ivu-tabs-nav-wrap {
            margin-top: 0px;
            .ivu-tabs-nav {
                border: 0px;
                margin-left: 1.5%;
                .ivu-tabs-ink-bar {
                    background-color: @base;
                    bottom: -1px;
                    height: 2px;
                }
                .ivu-tabs-tab-active {
                    &:hover {
                        color: @base;
                    }
                }
                .ivu-tabs-tab {
                    font-size: @fs16;
                    font-weight: lighter;
                    &:hover {
                        color: @base;
                        .ivu-badge-count {
                            color: @base;
                        }
                    }
                }
            }
        }
        .ivu-tabs-nav-scroll {
            border-bottom: 1px dashed #ddd;
            overflow: initial;
            height: 56px;
        }

        //---------------------骚气的分割线---------------------
        .newBid {
            height: 100%;
            .nothink {
                display: flex;
                align-items: center;
                justify-content: center;
                background: url("../../assets/images/contract.png") no-repeat #FFFFFF;
                background-position: center 35%;
                height: 100%;
                width: 100%;
                span {
                    font-size: 12px;
                    color: @black_2;
                }
            }
        }
        .newBidList {
            margin-top: 20px;
            dl {
                dd:nth-of-type(3n) {
                    margin-right: 0 !important;
                }
                dd {
                    position: relative;
                    width: 32.4%;
                    height: 285px;
                    display: inline-block;
                    background: @white;
                    margin-bottom: @p15;
                    margin-right: 1.4%;
                    border-radius: @r4;
                    cursor: pointer;
                    overflow: hidden;
                    &:hover .bidTitle {
                        em {
                            opacity: 1
                        }
                    }
                    .Statuslabel {
                        font-style: normal;
                        display: inline-block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 105px;
                        height: 25px;
                        line-height: 25px;
                        text-align: center;
                        background: @base;
                        color: #fff;
                        -webkit-transform: translate(-26px, 13px) rotate(-42deg);
                        transform: translate(-26px, 13px) rotate(-42deg);
                        font-size: 12px;
                    }
                    .title {
                        height: 60px;
                        border-bottom: 1px dashed @line;
                        display: block;
                        line-height: 60px;
                        text-align: center;
                        font-size: @fs18;
                        color: @black_2;
                        font-weight: lighter;
                        font-family: @ff;
                    }
                    .bidTitle {
                        &:extend(.bidManage .newBidList dl dd .title);
                        cursor: pointer;
                        border-width: 0px;
                        position: relative;
                        em {
                            position: absolute;
                            right: 0;
                            margin: 20px;
                            font-size: 18px;
                            color: @black_3;
                            opacity: 0;
                        }
                        em:hover {
                            color: @base;
                        }
                    }
                    .topContent {
                        height: 50%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        .bidInviteMoney {
                            border-bottom: 1px dashed @gray;
                            padding-bottom: 20px;
                            text-align: center;
                            span {
                                color: #adadad;
                            }
                            p {
                                color: #adadad;
                                em {
                                    font-size: 23px;
                                    color: @base;
                                    font-style: normal;
                                }
                            }
                        }
                    }
                    .content {
                        height: 50%;
                    }
                    .bidMoney {
                        border-bottom: 1px dashed @gray;
                        height: 110px;
                        span {
                            width: 50%;
                            display: inline-block;
                            text-align: center;
                            margin: 20px 0px 0px 0px;
                            float: left;
                            color: @black_3;
                            p {
                                em {
                                    font-size: 24px;
                                    color: @base;
                                    font-style: normal;
                                }
                            }
                        }
                    }
                    .bidPerso {
                        padding: 20px 20px 20px 20px;
                        bottom: 0px;
                        .persoInfo {
                            color: @baseFont;
                            .span {
                                float: left;
                                width: 50%;
                                text-align: left;
                                font-size: 12px;
                                &:nth-of-type(2) {
                                    text-align: right;
                                }
                            }
                            .progress {
                                margin-top: 15px;
                                .ivu-progress-bg {
                                    background-color: @base;
                                }
                                .ivu-progress-show-info {
                                    .ivu-progress-outer {
                                        padding-right: 70px;
                                        margin-right: -70px;
                                    }
                                    .ivu-progress-text {
                                        float: right;
                                    }
                                }
                                button {
                                    width: 100%;
                                    padding: 9px;
                                    border: 0;
                                    border-radius: 4px;
                                    color: #fff;
                                    font-size: 14px;
                                    background: @base;
                                    outline: none;
                                    &:hover {
                                        cursor: pointer;
                                        background: @base_active;
                                    }
                                }
                            }
                        }
                    }
                    .bidStatus {
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        color: #fff;
                        font-size: 13px;
                        button {
                            border: none;
                            width: 49.9%;
                            color: #fff;
                            cursor: pointer;
                            outline: none;
                        }
                        .confirmBtn {
                            float: left;
                            background: @base;
                        }
                        .cancelBtn {
                            float: right;
                            background: @orange;
                        }
                    }
                    .delete {
                        background-color: #ccc;
                    }
                    .bidYes {
                        background-color: @orange;
                    }
                    .bidNo {
                        background-color: @orange;
                    }
                    .iconL {
                        background: #fafbfb;
                        height: 20px;
                        width: 20px;
                        display: inline-block;
                        border-radius: 100%;
                        float: left;
                        margin-top: -10px;
                        margin-left: -10px;
                    }
                    .iconR {
                        &:extend(.bidManage .newBidList dl dd .iconL);
                        float: right;
                        margin-top: -10px;
                        margin-right: -10px;
                    }
                    .selectContent {
                        padding: 0px 20px !important;
                    }
                    .content {
                        padding: @p20;
                        font-weight: 300;
                        .projectStatis {
                            display: block;
                            text-align: center;
                            color: @baseFont;
                            p {
                                color: @black_2;
                                margin-bottom: @p5;
                            }
                            span {
                                color: @base;
                                font-size: @fs20;
                                font-family: @ff;
                            }
                        }
                        .projectTime {
                            display: flex;
                            justify-content: space-between;
                            .titleSty {
                                font-size: 13px;
                                color: #8a8a8a;
                            }
                            span {
                                color: #b3b3b3;
                                font-size: 13px;
                                display: inline-block;
                                padding: 4px 0;
                                width: 100%;
                            }
                        }
                        .btnsSty {
                            button {
                                padding: 7px 30px;
                                border-radius: 3px;
                                border: 1px solid transparent;
                                background: #FFF;
                                outline: none;
                                cursor: pointer;
                                &:first-child {
                                    border-color: @base !important;
                                    color: @base;
                                    margin-right: 20px;
                                    &:hover {
                                        background: @base;
                                        color: #fff;
                                    }
                                }
                                &:last-child {
                                    border-color: @orange !important;
                                    color: @orange;
                                    &:hover {
                                        background: @orange;
                                        color: #fff;
                                    }
                                }
                            }
                        }
                        .projectInfo {
                            margin-bottom: 10px;
                            .titleSty {
                                font-size: 13px;
                                color: #8a8a8a;
                            }
                            span {
                                color: #b3b3b3;
                                font-size: 12px;
                                display: inline-block;
                                padding: 4px 0;
                                width: 100%;
                            }
                        }
                    }
                }
                dd:hover {
                    box-shadow: 0px 4px 12px 2px #c5c3c38f;
                }
            }
        }

        //--------------------- 骚气的结束 ---------------------

        .bidList {
            margin-top: 5px;
            dt {
                height: 30px;
                line-height: 30px;
                font-weight: bold;
                font-size: @fs14;
                width: 100%;
                display: block;
                background: #f8f8f9;
                margin-bottom: 5px;
                span {
                    width: 14%;
                    display: inline-block;
                    text-align: center;
                    float: left;
                }
            }
            dd {
                background: #f8f8f9;
                margin: 5px 0px;
                em {
                    font-style: normal;
                }
                span {
                    width: 14%;
                    display: inline-block;
                    text-align: center;
                    padding: 10px;
                    float: left;
                    line-height: 51px;
                    &:nth-of-type(1) {
                        width: 26%;
                        text-align: left;
                        img {
                            width: 80px;
                            height: 51px;
                            float: left;
                            border-radius: @borderRadius12;
                        }
                        em {
                            float: left;
                            margin-left: 10px;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                            width: 75%;
                        }
                    }
                    &:nth-of-type(2) {
                        font-weight: bold;
                        color: @orange;
                    }
                    &:nth-of-type(4) {
                        width: 10.1%;
                        img {
                            width: 25px;
                            height: 25px;
                            border-radius: 100%;
                        }
                    }
                    &:nth-of-type(5) {
                        .action {
                            color: @orange;
                        }
                    }
                    &:nth-of-type(6) {
                        width: 10%;
                        color: #818181;
                        .await {
                            color: @orange;
                        }
                        .upload {
                            color: green;
                        }
                    }
                    &:nth-of-type(7) {
                        width: 10.3%;
                        text-align: right;
                        em {
                            background: #aaa;
                            color: #fff;
                            padding: 0px 1px;
                        }
                        .await {
                            background: @orange;
                        }
                        .bidding {
                            background: @orange;
                        }
                    }
                }

            }
        }
        .invite {
            dt {
                padding: 0px 10px;
                span {
                    width: 19.3%;
                    &:nth-of-type(1) {
                        width: 40%;
                    }
                    &:nth-of-type(2) {
                        width: 18.1%;
                    }
                    &:nth-of-type(4) {
                        width: 25%;
                        text-align: left;
                    }
                    &:nth-of-type(5) {
                        width: 10%;
                        text-align: right;
                    }
                }
            }
            dd {
                padding: 0px 10px;
                span {
                    &:extend(.bidManage .invite dt span);
                    line-height: 28px;
                    padding: 5px 0px;
                    &:nth-of-type(1) {
                        width: 40%;
                        .ivu-btn {
                            border: 0px;
                        }
                    }
                    &:nth-of-type(2) {
                        width: 18.1%;
                    }
                    &:nth-of-type(4) {
                        width: 25%;
                        text-align: left;
                    }
                    &:nth-of-type(5) {
                        width: 10%;
                        text-align: right;
                    }
                    .ivu-btn {
                        padding: 2px 10px;
                        span {
                            padding: 0px;
                            line-height: 16px;
                        }
                    }
                }
            }
        }
        .ivu-tabs-tab-active {

            .ivu-badge-count {
                background: none;
                color: @base;
                font-size: @fs16;
                margin-top: -3px;
                margin-left: -3px;
                border: 0px;
                font-weight: lighter;
                font-family: @ff;
                box-shadow: 0px 0px 0px #fff;
            }
        }
        .ivu-badge-count {
            &:extend(.bidManage .ivu-tabs-tab-active .ivu-badge-count);
            color: #657180;
            transition: all .4s;
        }
    }
</style>
