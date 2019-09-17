<template>
    <div class="improtExcelBox">
        <div class="modalContent">
            <div class="leftStep">
                <p class="operationStep">{{$t('memberAauthority.power_operationSteps')}}</p>
                <Steps :current="ExcelObj.current" direction="vertical">
                    <Step title="点击">
                        <Button type="ghost" icon="ios-cloud-download-outline" style="font-size:12px;"
                                @click="ExcelObj.current = 1">
                            <a :href="ExcelObj.downloadUrl" download>下载Excel模板</a>
                        </Button>
                    </Step>
                    <Step title="上传Excel文件"></Step>
                    <Step title="成功导入"></Step>
                </Steps>
            </div>
            <div class="rightContent">
                <div class="rightContentBox" v-show="!ExcelObj.aginFlag">
                    <Upload :action="uploadUrl" name="file" :show-upload-list="false" :on-format-error="formatError"
                            :on-success="uploadSuccess" :on-error="uploadFail" accept="xls,xlsx"
                            :format="['xls','xlsx']">
                        <Button type="ghost" icon="ios-cloud-upload-outline" style="min-width: 140px;">上传Excel文件
                        </Button>
                    </Upload>
                </div>
                <div class="rightIner" v-show="ExcelObj.aginFlag">
                    <button class="againUpload" @click="aginUpload">重新上传</button>
                    <div class="fileName">
                        <span>{{ ExcelObj.excelName }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <button type="primary" size="large" @click="confrimFun" :disabled="ExcelObj.disabled">确认导入</button>
        </div>
    </div>
</template>

<script>
    import {newContractApi} from 'api';
    export default {
        name: "import-excel",
        data(){
            return {
                ExcelObj: {
                    importExcelContract: false,
                    current: 0,
                    disabled: true,
                    downloadUrl: 'https://yhc-static.oss-cn-shanghai.aliyuncs.com/%E8%B5%84%E6%BA%90%E6%B8%85%E5%8D%95%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF.xlsx',
                    excelName: null,
                    excelFid: null,
                    aginFlag: false
                }
            };
        },
        computed: {
            // 上传地址（必填）
            uploadUrl() {
                let baseURL = window.location.host.indexOf("banbooyun.com") !== -1 ? window.location.protocol + "//" + window.location.host : "https://dev.banbooyun.com";
                let base = baseURL + '/' + this.GLOBAL.baseRouter;
                return base + this.$GLOBALAPI.file_file_upload;
            }
        },
        methods: {
            // 文件格式验证失败时的钩子
            formatError(event) {
                if (event.type != "xls" || event.type != "xlsx") {
                    this.$Message.warning(i18n.t('memberAauthority.power_ErrorMessageNine'));
                }
            },
            // 文件上传成功时的钩子
            uploadSuccess(res, file) {
                this.ExcelObj.current = 2;
                this.ExcelObj.excelName = res.file.name;
                this.ExcelObj.excelFid = res.file.fid;
                this.ExcelObj.aginFlag = true;
                this.ExcelObj.disabled = false;
            },
            aginUpload() {
                this.ExcelObj.current = 1;
                this.ExcelObj.excelName = null;
                this.ExcelObj.excelFid = null;
                this.ExcelObj.aginFlag = false;
                this.ExcelObj.disabled = true;
            },
            async confrimFun() {
                let parms = {
                    file_id: this.ExcelObj.excelFid
                };
                let {data} = await newContractApi.importExcel(parms);
                if (data.err_code == 0) {
                    if (data.data.count > 0) {
                        this.$Message.warning('共'+data.data.total_count+'条清单，'+data.data.count + '条数据错误');
                    } else {
                        this.$emit('importExcel', data.data.list);
                        this.$Message.success('导入成功！');
                        this.ExcelObj.importExcelContract = false;
                        this.ExcelObj.current = 0;
                        this.ExcelObj.excelName = null;
                        this.ExcelObj.excelFid = null;
                        this.ExcelObj.aginFlag = false;
                        this.ExcelObj.disabled = true;
                    }
                }
            },
            // 文件上传失败时的钩子
            uploadFail(error, file) {
                this.ExcelObj.current = 1;
                this.ExcelObj.disabled = true;
            }
        }
    };
</script>

<style lang="less">
    .improtExcelBox{
        .modalContent {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin: 30px 0px;
            .leftStep {
                width: 40%;
                padding: 30px 0px 30px 30px;
                background: #f2f2f2;
                margin-right: 16px;
                .ivu-steps {
                    .ivu-steps-item {
                        .ivu-steps-tail {
                            i {
                                background-color: #bcbcbc;
                            }
                        }
                        .ivu-steps-head {
                            background-color: #f2f2f2;
                            .ivu-steps-head-inner {
                                border-color: #ffcc00;
                                background-color: #ffcc00;
                                span {
                                    color: @black_1;
                                }
                            }
                        }
                        .ivu-steps-main {
                            min-height: 55px;
                            .ivu-steps-title {
                                background-color: #f2f2f2;
                            }
                            .ivu-btn-ghost {
                                min-width: 130px;
                                color: @base_active;
                                background-color: #fff;
                                border-color: @base_active;
                                border-radius: 6px;
                                vertical-align: baseline;
                                padding: 5px 10px;
                            }
                        }
                    }
                }
                .operationStep {
                    margin-bottom: 35px;
                    font-size: 16px;
                    color: #616161;
                }
            }
            .rightContent {
                width: 60%;
                background: #f2f2f2;
                display: flex;
                justify-content: center;
                align-items: center;
                .rightContentBox {
                    border: 1px dashed @base;
                    padding: 45px;
                    cursor: pointer;
                    .ivu-icon {
                        color: @base;
                    }
                    span {
                        color: @base;
                        font-size: @fs13;
                    }
                }
                .rightIner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    .againUpload {
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        width: 102px;
                        height: 38px;
                        line-height: 38px;
                        background: #3cd2b4;
                        color: #ffffff;
                        border-radius: 4px;
                        border: none;
                        outline: none;
                        &:hover {
                            background: @base_dark;
                            cursor: pointer;
                        }
                    }
                    .fileName {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 16px;
                        &:hover {
                            cursor: pointer;
                            color: @base;
                        }
                    }
                }
            }
        }
        .footer{
            text-align: right;
            button{
                width: 102px;
                height: 38px;
                line-height: 38px;
                background: #3cd2b4;
                color: #ffffff;
                border-radius: 4px;
                border: none;
                outline: none;
                &:hover{
                    background: @base_dark;
                    cursor: pointer;
                }
                &:disabled{
                    cursor: not-allowed;
                }
            }
        }
    }
</style>
