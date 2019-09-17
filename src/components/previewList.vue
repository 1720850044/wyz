<template>
    <div class="previewListSty" v-if="propsData.ShowFlag">
        <p class="tiele" >选择转发对象</p>
        <ul v-if="chatMemberList.length > 0">
            <li v-for="item in chatMemberList" @click="selectItem($event, item)" :key="item.group_key">
                <img v-if="item.type === 'user'" :src="`${GLOBAL.imgDomain}/index.php?r=system/user/get-headimage&id=${item.user_id}`" alt="">
                <img v-else-if="item.type === 'group'" src="../assets/images/groupHead.png" alt="">
                <span>{{item.name||'暂无成员'}}</span>
            </li>
        </ul>
        <span v-else style="margin-top: 20px;display: inline-block">暂无成员</span>
    </div>
</template>

<script>
    import api from 'api';
    export default {
        name: "preview-list",
        data(){
            return {
                // arr:[{name:'李四'},{name:'王五'},{name:'趙六'},{name:'孫七'},{name:'乾八'},{name:'周九'}],
                chatMemberList: []
            };
        },
        computed: {

        },
        props: {
            propsData: {
                type: Object,
                default: (()=>({}))
            },
            // taskData:{
            //     type:Object,
            //     default:(()=>{
            //         return {}
            //     })
            // }
        },
        watch: {
            propsData: {
                handler(val, oldVal){
                    if (val.ShowFlag){
                        this.getChatMemberList();
                    }
                },
                deep: true
            }
        },
        methods: {
            selectItem(event, item){
                event.stopPropagation();
                this.$emit('closeSlide');
                let el = this.propsData.screenshotID;

                // let parentEl = document.getElementById(el);
                // let isImg = parentEl.getElementsByTagName('img');
                // if(isImg.length > 0){
                //     let img = parentEl.getElementsByClassName('headImg')[0];
                //     let src = img.getAttribute('src');
                //     this.$PublicFuns.switchImgToBase64(src, (returnBaseUrl) => {
                //         img.src = returnBaseUrl
                //     });
                // }

                this.$store.commit('setGroupKey', item.group_key);
                this.$PublicFuns.getOssKey({type: 'group-chat', group: item.group_id}).then((OssKey=>{
                    this.$PublicFuns.getHtml2canvas(el).then((base64)=>{
                        this.$PublicFuns.uploadOss(base64, OssKey).then((imgUrl)=>{
                            let hrefUrl = this.$PublicFuns.getURL();
                            let imgSrc = imgUrl;
                            // console.log(hrefUrl);
                            switch (hrefUrl){
                                case '/epibol/contractManage':
                                    imgSrc += '#href:'+hrefUrl+',contractID:'+this.propsData.contractID;
                                    break;
                                case '/project/task':
                                    imgSrc += '#href:'+hrefUrl+',project:'+this.propsData.project+',id:'+this.propsData.id;
                                    break;
                                case '/epibol/statistics':
                                    imgSrc += '#href:'+hrefUrl+',tabName:'+this.propsData.tabName;
                                    break;
                                case '/epibol/bidManage':
                                    if (this.propsData.type){
                                        //已报名
                                        hrefUrl+='/singUp';
                                        imgSrc += '#href:'+hrefUrl+',id:'+this.propsData.id+',task:'+this.propsData.testId+',type:'+this.propsData.type;
                                    } else {
                                        //外包邀请
                                        hrefUrl+='/Invitation';
                                        // imgSrc += '#href:'+hrefUrl+',id:'+this.propsData.id
                                        imgSrc += '#href:'+hrefUrl;
                                    }
                                    break;
                                case '/epibol/projectManage':
                                    imgSrc += '#href:'+hrefUrl+',id:'+this.propsData.id;
                                    break;
                                case '/customer/contractManage':
                                    imgSrc += '#href:'+hrefUrl+',id:'+this.propsData.id+',network:'+this.propsData.network+',status:'+this.propsData.status;
                                    break;
                            }
                            this.$store.commit('setImg', imgSrc);
                            // console.log(imgSrc);
                        });
                    });
                }));
            },
            async getChatMemberList(){
                let {data} = await api.chatInit({client_id: localStorage.client_id});
                if (data.err_code === 0){
                    this.chatMemberList = data.data;
                }
            },
        },
        mounted(){
            let _this = this;
            window.addEventListener('click', function (event) {
                if (_this.propsData.ShowFlag){
                    _this.$emit('closeSlide');
                }
            });
        }
    };
</script>

<style lang="less" scoped>
    .previewListSty{
        position: absolute;
        border: 1px solid #17ceb1;
        background: #fff;
        padding: 0 10px;
        width: 160px;
        height: 185px;
        border-radius: 3px;
        z-index: 1;
        text-align: center;
        right: 5px;
        top: 50px;
        .tiele{
            padding: 15px 0;
            border-bottom: 1px solid #e4e5e6;
        }
        ul {
            height: 110px;
            overflow: auto;
            font-size: 12px;
            li{
                display: flex;
                align-items: center;
                padding: 5px 0;
                &:hover{
                    cursor: pointer;
                    background: #17ceb1;
                    color: #fff;
                }
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 100%;
                }
                span{
                    margin-left: 10px;
                }
            }
        }

    }
</style>
