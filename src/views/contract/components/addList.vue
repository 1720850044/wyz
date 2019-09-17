<template>
    <div class="addListBox">
        <div class="addTool">
            <Input style="width: 30%" v-model="group_name" placeholder="输入该笔清单名称"></Input>
            <div class="rightTool">
                <span @click="ExcelObj.importExcelContract = true">导入清单(Excel)</span>
                <button @click="addListFun">
                    <i class="iconfonts icon-jia1"></i>
                    添加清单项
                </button>
            </div>
        </div>
        <div class="tableList">
            <ul class="tableHead">
                <li>资源名称</li>
                <li>类型</li>
                <li>单位</li>
                <li>单价/元</li>
                <li>天数</li>
                <li>资源数量</li>
                <li>完成时间</li>
                <li>小计</li>
            </ul>
            <ul class="tableBody">
                <li class="tableTr" v-for="(item,index) in orderList">
                    <dl>
                        <dd>
                            <Input v-model="item.key" placeholder="输入资源名称"></Input>
                        </dd>
                        <dd>
                            <Select v-model="item.ability_id" style="width: 100px" :label-in-value="true"
                                    @on-change="item.ability_id = $event.value;item.ability_name = $event.label">
                                <Option v-for="item in abilityList" :value="item.id" :key="item.id">{{ item.name }}
                                </Option>
                            </Select>
                        </dd>
                        <dd>
                            <Select v-model="item.unit" style="width: 100px">
                                <Option v-for="item in selectUnit" :value="item.value" :key="item.value">{{ item.label
                                    }}
                                </Option>
                            </Select>
                        </dd>
                        <dd>
                            <InputNumber :min="0" v-model="item.unitprice" style="width: 100px"
                                         placeholder="输入单价金额"></InputNumber>
                        </dd>
                        <dd>
                            <InputNumber :min="0" v-model="item.unit == 2 ? item.day = 0 :item.day"
                                         :disabled="item.unit === 2" style="width: 100px"
                                         placeholder="输入天数"></InputNumber>
                        </dd>
                        <dd>
                            <InputNumber :min="0" v-model="item.count" style="width: 100px"
                                         placeholder="输入资源数量"></InputNumber>
                        </dd>
                        <dd>
                            <DatePicker type="date" :value="item.finish_date" placeholder="选择完成时间"
                                        @on-change="item.finish_date = $event"></DatePicker>
                        </dd>
                        <dd>
                            <span>￥{{(item.subtotal = item.unit == 2 ? item.unitprice * item.count : item.unitprice * item.day * item.count).toFixed(2)}}</span>
                            <i @click="deleteList(index)" class="iconfonts icon-sourceDel"></i>
                        </dd>
                    </dl>
                </li>
            </ul>
            <div class="tableFooter">
                <span>
                    交付资源数量：<em>{{num}}</em>
                </span>
                <span>
                    清单总金额：<em>￥{{money.toFixed(2)}}</em>
                </span>
            </div>
        </div>
        <div class="submitBtn">
            <button @click="submitList">提交清单</button>
        </div>


        <!-- 批量导入对话框 start -->
        <Modal v-model="ExcelObj.importExcelContract" width="720" title="导入清单(Excel)">
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
            <div slot="footer">
                <Button type="primary" size="large" @click="confrimFun" :disabled="ExcelObj.disabled">确认导入</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {newContractApi} from 'api';

    export default {
        name: "add-list",
        data() {
            return {
                group_name: null,
                orderList: [
                    {
                        key: null,
                        ability_id: null,
                        ability_name: null,
                        unit: null,
                        unitprice: 0,
                        day: 1,
                        count: 1,
                        finish_date: null,
                        subtotal: '0.00'
                    }
                ],
                abilityList: [],
                selectUnit: [
                    {value: 1, label: '单人/天'},
                    {value: 2, label: '个'}
                ],
                num: 0,
                money: 0,
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
            saveContractData() {
                return this.$store.state.contract.contractData;
            },
            contraceID() {
                return this.$store.state.contract.contractData.ID;
            },
            priceList() {
                return this.$store.state.contract.contractData.price;
            },
            // 上传地址（必填）
            uploadUrl() {
                let baseURL = window.location.host.indexOf("banbooyun.com") !== -1 ? window.location.protocol + "//" + window.location.host : "https://dev.banbooyun.com";
                let base = baseURL + '/' + this.GLOBAL.baseRouter;
                return base + this.$GLOBALAPI.file_file_upload;
            },
        },
        methods: {
            addListFun() {
                let obj = {
                    key: null,
                    ability_id: null,
                    ability_name: null,
                    unit: null,
                    unitprice: 0,
                    day: 1,
                    count: 1,
                    finish_date: null,
                    subtotal: '0.00'
                };
                this.orderList.push(obj);
            },
            deleteList(index) {
                this.orderList.splice(index, 1);
            },
            async contractAbilityList() {
                let {data} = await newContractApi.contractAbilityList();
                if (data.err_code == 0) {
                    this.abilityList = data.data;
                }
            },
            submitList() {
                let _this = this;
                let submit = false;
                if (this.group_name) {
                    if (this.orderList.length > 0) {
                        this.orderList.forEach(function (item) {
                            if (!item.key) {
                                submit = false;
                                _this.$Message.warning('请填写资源名称！');
                            } else if (!item.ability_id) {
                                submit = false;
                                _this.$Message.warning('请选择类型！');
                            } else if (!item.unit) {
                                submit = false;
                                _this.$Message.warning('请选择单位！');
                            } else if (!item.finish_date) {
                                submit = false;
                                _this.$Message.warning('请选择完成时间！');
                            } else {
                                submit = true;
                            }
                        });
                        if (submit) {
                            let submitObj = {
                                group_name: this.group_name,
                                is_update: 0,  // 0 可以修改  1不可以修改
                                list: this.orderList,
                                selectFlag: true,  //交互用
                                status: 0, // 0未同步 1已同步
                                create_time: this.createTimeFun()
                            };
                            this.$store.commit('pushPriceList', submitObj);
                            this.$nextTick(() => {
                                this.$bus.emit('saveContractData');
                                this.$nextTick(() => {
                                    this.$store.dispatch("saveContractAction", true).then((res) => {
                                        this.$store.dispatch("getContractInfo", 'addOrder').then((data) => {
                                            this.$bus.emit('submitPrice');
                                        });
                                    });
                                });
                            });
                        }
                    } else {
                        this.$Message.warning('清单列表不能为空！');
                        this.addListFun();
                    }
                } else {
                    this.$Message.warning('清单名称不能为空！');
                }
            },
            resetData() {
                this.group_name = null;
                this.orderList = [
                    {
                        key: null,
                        ability_id: null,
                        ability_name: null,
                        unit: null,
                        unitprice: 0,
                        day: 1,
                        count: 1,
                        finish_date: null,
                        subtotal: '0.00'
                    }
                ];
            },
            createTimeFun() {
                let dateTime = null;
                let date = new Date();
                let year = date.getFullYear();
                let month = (date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
                let day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate;
                let H = date.getHours() > 10 ? date.getHours() : '0' + date.getHours();
                let M = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes();
                let S = date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds();
                return dateTime = year + '-' + month + '-' + day + ' ' + H + ':' + M + ':' + S;
            },
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
                        this.$Message.warning(data.data.count + '条数据错误');
                    }else {
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
            },
        },
        updated() {
            let num = 0;
            let money = 0;
            this.orderList.forEach(function (creent) {
                num += creent.count;
                money += creent.subtotal;
            });
            this.num = num;
            this.money = money;
        },
        mounted() {
            this.resetData();
            this.contractAbilityList();
        }
    };
</script>

<style lang="less" scoped>
    .addListBox {
        height: 100%;
        overflow: hidden;
        .addTool {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .rightTool {
                display: flex;
                align-items: center;
                span {
                    color: @base;
                    font-size: 14px;
                    margin-right: 25px;
                    &:hover {
                        color: @base_dark;
                        cursor: pointer;
                    }
                }
                button {
                    height: 38px;
                    line-height: 38px;
                    width: 100px;
                    /*padding: 8px 10px;*/
                    background: @base;
                    border: 0;
                    border-radius: 3px;
                    color: @white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    outline: none;
                    &:hover {
                        cursor: pointer;
                        background: @base_dark;
                    }
                    .icon-jia1 {
                        margin-right: 5px;
                        font-size: 14px;
                    }
                }
            }
        }
        .tableList {
            margin-top: 20px;
            border: 1px solid #ececec;
            .tableHead {
                height: 50px;
                line-height: 50px;
                display: flex;
                justify-content: space-between;
                background: #fbfbfb;
                padding: 0 30px;
                li {
                    flex: 1;
                    text-align: center;
                    font-size: 13px;
                    color: #888;
                }
            }
            .tableBody {
                max-height: 470px;
                overflow: auto;
                .tableTr {
                    border-top: 1px solid #ececec;
                    padding: 20px 30px;
                    dl {
                        display: flex;
                        dd {
                            flex: 1;
                            text-align: center;
                            &:last-child {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                span {
                                    font-size: 13px;
                                }
                                .icon-sourceDel {
                                    font-size: 13px;
                                    margin-left: 15px;
                                    color: #b9b9b9;
                                    &:hover {
                                        cursor: pointer;
                                        color: red;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .tableFooter {
                background: #fbfbfb;
                border-top: 1px solid #ececec;
                height: 50px;
                line-height: 50px;
                text-align: right;
                padding: 0 30px;
                span {
                    font-size: 14px;
                    color: #bdbdbd;
                    &:first-child {
                        margin-right: 30px;
                    }
                    em {
                        font-style: normal;
                        color: @base;
                        font-size: 16px;
                    }
                }
            }
        }
        .submitBtn {
            margin-top: 30px;
            text-align: right;
            button {
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
        }
    }

    .modalContent {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin: 30px 0px;
    }
</style>
<style lang="less">
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
</style>
