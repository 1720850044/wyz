<template>
     <div class="addRow">
        <dl>
            <dt class="title">基本信息</dt>
        </dl>
        <dl>
            <dt>任务名称</dt>
            <dd>
                <Input v-model="postData.test_name" placeholder="输入项目名称" :disabled='flag'></Input>
            </dd>
        </dl>
        <!--<dl>-->
            <!--<dt>任务图片</dt>-->
            <!--<dd class="ImaUpload">-->
                <!--<upload-box v-on:FileUploadedSuccess="FileUploadedSuccess" :id="uploadCallbackData.id1">-->
                    <!--<template slot='upload'>-->
                        <!--<div id="browse1" class="uploadElement">-->
                            <!--<p v-if="uploadCallbackData.showFlag1"><Icon type="plus"></Icon> 上传图片</p>-->
                            <!--<img v-else v-for="img in uploadCallbackData.callbackData1" :src="JSON.parse(img.response).file_url"/>-->
                        <!--</div>-->
                    <!--</template>-->
                <!--</upload-box>-->
            <!--</dd>-->
        <!--</dl>-->
        <dl>
            <dt style="margin-top: 25px">测试费用</dt>
            <dd class="testTaskPrice">
                <RadioGroup v-model="xuqiuFlag.animal">
                    <Radio label="1">
                        <span>服务商报价</span>
                    </Radio>
                    <Radio label="2">
                        <span>我方报价</span>
                    </Radio>
                </RadioGroup>
                <p v-if="xuqiuFlag.animal == 1">测试任务发布成功后，参与投标的服务方报价</p>
                <Input v-if="xuqiuFlag.animal == 2" v-model="postData.test_price"  placeholder="测试费用" style="margin-top: 5px" :disabled='flag'></Input>
            </dd>
        </dl>
        <dl>
            <dt>项目预计总额</dt>
            <dd>
                <Input v-model="postData.project_max_price" placeholder="项目预计总额" :disabled='flag'></Input>
            </dd>
        </dl>
         <dl>
             <dt v-if="xuqiuFlag.animal == 2">报名时间截止</dt>
             <dt v-if="xuqiuFlag.animal == 1">报价时间截止</dt>
             <dd>
                 <DatePicker type="date" placeholder="选择结束时间" style="width: 100%" @on-change="changeEnrollDate" :value="postData.bid_end_time" :disabled='flag'></DatePicker>
             </dd>
         </dl>
        <dl>
            <dt>交稿截止时间</dt>
            <dd>
                <DatePicker type="date" placeholder="选择结束时间" style="width: 100%" @on-change="changeDate" :value="postData.end_time" :disabled='flag'></DatePicker>
            </dd>
        </dl>
        <dl>
            <dt class="title">测试任务要求</dt>
        </dl>
        <dl>
            <dt>任务类型</dt>
            <dd>
                <Select v-model="postData.task_type">
                    <Option value="原画">原画</Option>
                    <Option value="UI">UI</Option>
                    <Option value="角色">角色</Option>
                    <Option value="场景">场景</Option>
                    <Option value="动作">动作</Option>
                    <Option value="特效">特效</Option>
                    <Option value="其它">其它</Option>
                </Select>
            </dd>
        </dl>
        <dl>
            <dt>交稿要求</dt>
            <dd>
                <Input v-model="postData.file_require" type="textarea" placeholder="交稿要求.." style="font-size: 12px" :autosize="{minRows: 2,maxRows: 5}" :disabled='flag'></Input>
            </dd>
        </dl>
        <dl>
            <dt>参考附件</dt>
            <dd style="display: flex;justify-content: space-between;align-items: center">
                <ul class="listP" v-if="uploadFile && uploadFile.length > 0">
                    <li  v-for="(item,index) in uploadFile">{{item.name}}</li>
                </ul>
                <general-upload  :showOtherInfos="showOtherInfos" :initParams="initParams"></general-upload>
            </dd>
        </dl>
    </div>
</template>
<script>
    import GeneralUpload from "../../../../components/uploadAndPreview/generalUpload";
    export default {
        components: {
            GeneralUpload,
        },
        data(){
            return {
                initParams: {
                    definedBtnStyle: 'margin:0;width:auto;',
                    definedIconStyle: {},
                    smallBtnText: '上传附件'
                },
                showOtherInfos: {
                    fieldLabel: false,
                    styleLabel: false,
                    fileDescribe: false
                },
                xuqiuFlag: {
                    flag: true,
                    animal: '1'
                },
                postData: {
                    id: null,
                    create_demand: 1,
                    test_name: null,
                    task_type: null,
                    test_price: null,
                    project_max_price: null,
                    bid_end_time: null,
                    end_time: null,
                    file_require: null,
                },
                uploadFile: null,
                flag: false,
                uploadCallbackData: {
                    id2: 'browse2',
                    callbackData2: [],
                },
            };
        },
        methods: {
        //改变报名日期
            changeEnrollDate(date){
                this.postData.bid_end_time=date;
            },
        // 改变日期
            changeDate(date){
                this.postData.end_time=date;
            },
            clearData(){
                this.postData={
                    id: null,
                    create_demand: 1,
                    test_name: null,
                    task_type: null,
                    test_price: null,
                    project_max_price: null,
                    bid_end_time: null,
                    end_time: null,
                    file_require: null,
                };
                this.uploadFile = null;
            }
        },
        watch: {
            xuqiuFlag: {
                handler(val){
                    if (val.animal == 1){
                        this.postData.test_price = null;
                    }
                },
                deep: true
            }
        },
        updated(){
            this.postData.file = this.uploadFile;
            this.postData.picture = 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3429908815,845996252&fm=27&gp=0.jpg';
            this.$bus.emit('emitAddData', this.postData, this.xuqiuFlag.animal);
        },
        mounted(){

        /* 上传成功回调 */
            this.$bus.$on('confirmUpload', (obj) => {
                let fileList = obj.response;
            //3D文件后缀去重
                fileList.forEach(function (creent) {
                    if (creent.fileType === '3d'){
                        var strindex = creent.file_url;
                        var arr = strindex.split('.');
                        var SuffixName = strindex.split('.')[arr.length-1];
                        var lastIndex = strindex.lastIndexOf('.'+SuffixName);
                        creent.file_url = strindex.substring(0, lastIndex);
                    }
                });
                this.uploadFile = fileList;
            });
        },
        destroyed(){
            this.$bus.$off();
        },
        filters: {
            substring(val){
                return val.length > 30 ? val.substring(15) : val;
            }
        }
    };
</script>
<style lang="less" scoped>
@import '../style/addEpibolCom.less';
    .general-upload-container{
    width: auto!important;
}
    .uploadElement{
        display: inline-block;
        border: 1px solid #d7dde4;
        min-width: 100px;
        height: 100px;
        line-height: 100px;
        overflow: hidden;
        padding: 1px 0;
        font-size: 12px;
        border-radius: 3px;
        color: #babfc5;
        cursor: pointer;
        &:hover{
            border-color: #3bceb6!important;
            box-shadow: 0 0 3px #3bceb6!important;
        }
        p{
            display: inline-block;
            width: 100%;
            text-align: center;
        }
        img{
            width: 100px;
            height: 100px;
            padding: 1px;
        }

    }
    .listP{
        max-height: 100px;
        overflow: auto;
        li{
            padding: 5px 0;
        }
    }
    .testTaskPrice{
        display: flex;flex-direction: column;align-items: flex-start!important;
        .ivu-radio-checked .ivu-radio-inner{
            border-color: #3bceb6 !important;
        }
        .ivu-radio-inner:after{
            background-color:#3bceb6 !important;
        }
        p{
            height: 32px;
            line-height: 32px;
            margin-top: 5px;
            color: #3bceb6;
        }
    }
</style>
