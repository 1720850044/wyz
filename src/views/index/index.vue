<template>
    <div id="index">
        <div class="index-banner">
            <div class="wd1200 clearfix">
                <div class="index-logo fl">
                    <a :href="GLOBAL.apiDomain+'/index2'"><img src="https://static.banbooyun.com/public/img/welcome/welcome-logo.png" /></a>
                </div>
                <div class="index-login fr clearfix" v-if="!islogin">
                    <div style="float:left"><router-link to="/login">登录</router-link></div>
                    <div style="float:right"><router-link :to="{path:'/login',query:{toTag:'isRegister'}}">注册</router-link></div>
                </div>
                <div class="toIndex clearfix">
                    <div  class="fl"><a :href="GLOBAL.apiDomain+'/index2'" >进入斑驳云首页</a></div>
                    <div  class="fr"><router-link to="/">进入项目管理页</router-link></div>
                </div>
            </div>
        </div>

        <!-- <img class="img1" src="https://static.banbooyun.com/public/js/welcome/welcome-middle-1.png" />
        <img class="img2" src="https://static.banbooyun.com/public/js/welcome/welcome-middle-2.png" />
        <img class="img3" src="https://static.banbooyun.com/public/js/welcome/welcome-middle-3.png" />
        <img class="img4" src="https://static.banbooyun.com/public/js/welcome/welcome-middle-4.png" />
        <img class="bottom" src="https://static.banbooyun.com/public/js/welcome/welcome-bottom.png" /> -->

        <div class="resource-container">
            <div class="resource-left-part">
                <div class="resource-item">
                    <!-- 此处展示不同类型的资源文件 -->
                </div>
                <p class="word-desc">试试看，左键旋转，右健移动，双击标记</p>
            </div>
            <div class="resource-right-part">
                <h1>在线浏览，及时反馈</h1>
                <p>资源浏览黑科技，更轻松浏览资源，更及时地反馈沟通</p>
                <p>反馈标记，精确定位问题</p>
                <p>文件属性检测，数据规范标准化</p>
                <p>辅助浏览工具，就是这么方便</p>
                <p>从此，即便异地合作，也能指哪改哪了</p>
                <div class="switch-resource-display">
                    <a class="td-icon" title="3D资源" @click="switchDisplay('3d')">3D资源</a>
                    <a class="img-icon" title="2D资源" @click="switchDisplay('2d')">2D资源</a>
                    <a class="video-icon" title="视频资源" @click="switchDisplay('video')">视频资源</a>
                    <!--<a class="audio-icon" title="音频资源" @click="switchDisplay('audio')">音频资源</a>-->
                </div>
            </div>
        </div>

        <!--<img class="img1" src="https://static.banbooyun.com/public/img/welcome/img-1.png" />-->
        <img class="img2" src="https://static.banbooyun.com/public/img/welcome/welcome-middle-2.png" />
        <img class="img3" src="https://static.banbooyun.com/public/img/welcome/welcome-middle-3.png" />
        <img class="img4" src="https://static.banbooyun.com/public/img/welcome/welcome-middle-4.png" />
        <div class="bottom">
            <!--img  src="https://static.banbooyun.com/public/img/welcome/welcome-bottom.png" /-->
            <Row class="wd1200">
                <Col span="5">
                    <ul>
                        <li>平台</li>
                        <li><router-link to="/">产品介绍</router-link></li>
                        <li><router-link to="/">价格</router-link></li>
                        <li><router-link to="/">更新日志</router-link></li>
                        <li><router-link to="/">数据安全</router-link></li>
                        <li><router-link to="/">开发者中心</router-link></li>
                    </ul>
                </Col>
                <Col span="5">
                    <ul>
                        <li>服务</li>
                        <li><router-link to="/">解决方案</router-link></li>
                        <li><router-link to="/">帮助中心</router-link></li>
                        <li><router-link to="/">官方博客</router-link></li>
                        <li><router-link to="/">用户社区</router-link></li>
                    </ul>
                </Col>
                <Col span="5">
                    <ul>
                        <li>服务</li>
                        <li><router-link to="/">关于我们</router-link></li>
                        <li><router-link to="/">媒体报道</router-link></li>
                        <li><router-link to="/">隐私声明</router-link></li>
                        <li><router-link to="/">服务条款</router-link></li>
                    </ul>
                </Col>
                <Col span="4">
                    <ul>
                        <li>其它 </li>
                        <li><router-link to="/">合作伙伴</router-link></li>
                        <li><router-link to="/">加入我们</router-link></li>
                    </ul>
                </Col>
                <Col span="5">
                    <ul>
                        <li>联系客户顾问</li>
                        <li class="colorGray">qq:1515112701@qq.com</li>
                        <li class="colorGray">手机:+86 400-060-5579</li>
                        <li class="colorGray">时间:周一至周日 8:00-20:00</li>
                    </ul>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: '',
        layout: 'welcomeIndex',
        data () {
            return {
                islogin: !!Cookies.get('user')
            };
        },
        created () {
            // console.log('Cookies.get(user)', Cookies.get('user'))
        },
        mounted () {
            this.initIndex();
        },
        methods: {
            initIndex () {
                // console.log('Loading resource......');
            },
            switchDisplay (type) {
                // console.log(type);
            }
        }
    };
</script>

<style lang="less" scoped>
    .wd1200{
          padding-top: 10px;
          width:1200px;
          margin:0 auto;
    }
    #index{
        width: 100%;
        overflow: hidden;
        text-align: center;
        margin:0 0;
        padding-top:1104px;
        background: url('https://static.banbooyun.com/public/img/welcome/top-bg.png') no-repeat left top / 1920px;
        /*background-position: left top;*/
        /*background-repeat:no-repeat;*/
        /*background-size: 1920px;*/
        .toIndex{
            left:50%;
            margin-left:-210px;
            position:absolute;
            top:740px;
            width: 420px;
            div{
                width: 200px;
                line-height: 46px;
                font-size: 20px;
                background-color: #ffffff;
                border-radius: 3px;
                a{
                    color:@base;
                }
            }

        }
        .index-banner{
            position: absolute;
            left:0;
            right:0;
            top:0;
            padding:10px ;
            .index-logo{
                img{
                    width: 162px;
                    height: 66px;
                }
            }
            .index-login{
                width: 190px;
                margin-top: 18px;
            }
        }

        .resource-container {
            position: relative;
            width: 100%;
            height: 875px;
            background: url("../../assets/images/welcome/index-resource-bg.png") no-repeat left top / 1920px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            .resource-left-part {
                position: absolute;
                top: 5px;
                left: 220px;
                width: 935px;
                height: 785px;

                .resource-item {
                    /*position: absolute;*/
                    /*top: 5px;*/
                    /*left: 220px;*/
                    width: 935px;
                    height: 725px;
                    background: rgba(0, 0, 0, 0.22) url("../../assets/images/welcome/car-pic.png") no-repeat center 100px;
                    background-size: 78%;
                    -webkit-border-radius: 8px;
                    -moz-border-radius: 8px;
                    border-radius: 8px;
                    -webkit-box-shadow: 8px 8px 15px #dedede;
                    -moz-box-shadow: 8px 8px 15px #dedede;
                    box-shadow: 8px 8px 15px #dedede;
                }
                .word-desc {
                    text-align: left;
                    font-size: 16px;
                    color: #777;
                    margin-top: 26px;
                }
            }
            .resource-right-part {
                position: absolute;
                top: 5px;
                left: 1255px;
                width: 500px;
                height: 725px;
                text-align: left;
                h1 {
                    font-size: 36px;
                    font-weight: 300;
                    color: #333;
                    line-height: 1;
                    margin: 0 0 45px;
                }
                p {
                    position: relative;
                    font-size: 18px;
                    color: #777;
                    margin: 0 0 35px;
                    padding-left: 28px;
                    &:before {
                        position: absolute;
                        display: block;
                        content: '';
                        margin-top: 11px;
                        left: 0;
                        width: 6px;
                        height: 6px;
                        background: #bdbdbd;
                        -webkit-border-radius: 50%;
                        -moz-border-radius: 50%;
                        border-radius: 50%;
                    }
                }
                .switch-resource-display {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    a {
                        display: block;
                        font-size: 18px;
                        color: #333;
                        padding: 0 0 0 40px;
                        margin-top: 25px;
                        height: 28px;
                        line-height: 28px;
                        &.td-icon {
                            background: url("../../assets/images/welcome/index-3d-icon.png") no-repeat left center/ contain;
                        }
                        &.img-icon {
                            background: url("../../assets/images/welcome/index-2d-icon.png") no-repeat left center/ contain;
                        }
                        &.video-icon {
                            background: url("../../assets/images/welcome/index-video-icon.png") no-repeat left center/ contain;
                        }
                        &.audio-icon {
                            background: url("../../assets/images/welcome/index-video-icon.png") no-repeat left center/ contain;
                        }
                        &:hover {
                            color: @base;
                        }
                    }
                }
            }
        }

        .index-login div{
            border-radius: 3px;
            color: #ffffff;
            font-size: 18px;
            padding: 3px 3px;
            width: 80px;
            border:1px solid #ffffff;
            a{
                color: #ffffff;
                width: 100%;
                margin: 0;
                padding: 0;
                display: inline-block;
            }


        }
        .img1,.img2,.img3,.img4,.bottom{
            width: 1920px;
            margin:0 auto;
            display: block;
            line-height: unset;
            margin: 0 0 ;
        }
        .img1{

            height: 893px;
            border: 0px solid @red;
        }
        .img2{
            height: 992px;
            border:0px solid @blue;
            padding:0px;margin:0;
        }
        .img3{height: 1220px;}
        .img4{height: 701px;}
        .bottom{
            height: 326px;
            background: url('https://static.banbooyun.com/public/img/welcome/index-bottom-bg.png') top center no-repeat;
            .wd1200{
                padding-top: 43px;
                width:1200px;
                margin:0 auto;
                ul{
                    li{
                        color:#dddddd;
                        text-align: left;
                        line-height: 37px;
                        border:0px solid @red;
                        a{
                            color:#999999;
                        }
                    }
                    li:nth-child(1){
                        font-size: 16px;
                        line-height: 55px;
                    }
                    li.colorGray{
                        color:#999999;
                    }
                }

            }
        }

        }
    .app-main{height:auto}
    html, body{height: auto;position:unset !important;overflow-y:auto !important}
</style>
