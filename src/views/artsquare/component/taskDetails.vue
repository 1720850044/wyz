<template>
    <div class="taskDetails">
        <dl>
            <dt>{{$t('projectHall.pro_essentialInformation')}}</dt>
            <dd v-if="emitDetailsData.test_price"><span>{{$t('projectHall.pro_testingCost')}}</span><em> <i>￥</i>{{emitDetailsData.test_price}} <i>{{$t('projectHall.pro_yuan')}}</i> </em></dd>
            <dd v-else><span>{{$t('projectHall.pro_testingCost')}}</span><em style="font-size: 13px"> {{$t('projectHall.pro_serviceProviderQuotation')}} </em></dd>
            <dd><span>{{$t('projectHall.pro_totalProject')}}</span><em><i>￥</i>{{emitDetailsData.project_max_price}} <i>{{$t('projectHall.pro_yuan')}}</i></em></dd>
            <dd><span>{{$t('projectHall.pro_registrationDeadline')}}</span><em>{{emitDetailsData.bid_end_time}}</em></dd>
            <dd><span>{{$t('projectHall.pro_deadlineForContributions')}}</span><em>{{emitDetailsData.end_time}}</em></dd>
            <dd><span>{{$t('projectHall.pro_registeredCompany')}}</span><em><i style="color: #3bceb6;font-size: 14px">{{emitDetailsData.join_num}}</i> {{$t('projectHall.pro_home')}}</em></dd>
            <dt>{{$t('projectHall.pro_manuscriptRequirements')}}</dt>
            <dd v-if="emitDetailsData.file_require"><span>{{$t('projectHall.pro_manuscriptSpecification')}}</span><em>{{JSON.parse(emitDetailsData.file_require).spec}}</em></dd>
            <dd v-if="emitDetailsData.file_require"><span>{{$t('projectHall.pro_format')}}</span><em>{{JSON.parse(emitDetailsData.file_require).format}}</em>
                <!--{{emitDetailsData.file_require}}-->
                <!--<span v-if="emitDetailsData.file_require">{{emitDetailsData.file_require}}</span>-->
                <!--<span v-else>暂无</span>-->
            </dd>
            <dt>{{$t('projectHall.pro_referenceAnnex')}}</dt>
            <dd>
                <ol v-if="uploadFile && uploadFile.length>0" style="max-height: 100px;overflow: auto;width: 100%">
                    <li v-for="item in uploadFile">
                        <a v-if="item.response" :href="JSON.parse(item.response).file_url+'?response-content-type=application%2Foctet-stream'" download >{{item.name}}<i class="icon iconfonts icon-xiazai"></i></a>
                        <a v-else :href="item.file_url+'?response-content-type=application%2Foctet-stream'" download >{{item.name}}<i class="icon iconfonts icon-xiazai"></i></a>
                    </li>
                </ol>
                <span v-else>{{$t('projectHall.pro_no')}}</span>
            </dd>
            <!--<dt>其它说明</dt>-->
            <!--<dd>-->
                <!--<span v-if="emitDetailsData.description">{{emitDetailsData.description}}</span>-->
                <!--<span v-else>暂无</span>-->
            <!--</dd>-->
        </dl>
    </div>
</template>
<script>
export default {
    props: {
        emitDetailsData: {
            type: Object,
            default: {}
        }
    },
    computed: {
        uploadFile(){
            let res = null;
            if (this.emitDetailsData.file){
                let files = JSON.parse(this.emitDetailsData.file);
                res = files;
            } else {
                res = [];
            }
            return res;
        }
    }
};
</script>
<style lang="less" scoped>
    .taskDetails{
        // padding: 20px 0;
        dl{
            dt{
                font-size: 14px;
                margin: 10px 0 10px 0;
            }
            dd{
                padding: 8px 0;
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                span{
                    color: #bdbdbd;
                }
                em{
                    font-style: normal;
                    color: @black_2;
                    font-size: @fs16;
                    i{
                        font-style: normal;
                        font-size: 12px;
                        color: @black_3;
                    }
                }
                ul{
                    list-style: inside;
                    list-style-type: decimal;
                    color: #9c9c9c;
                    li{
                        padding: 4px 0;
                    }
                }
                ol{
                    li{
                        padding: 5px 0;
                        a{
                            color: #9c9c9c;
                            i{margin-left: 100px;color: #3bceb6;}
                            /*margin-left: 100px;*/
                        }
                    }
                }
            }
        }
    }
</style>
