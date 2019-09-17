<template>
  <div class="excel">
    <Steps :current="current" class='excelSetps'>
      <Step :title="$t('project.pro_uploadExcelFile')"></Step>
      <Step :title="$t('project.pro_analysisExcel')"></Step>
      <Step :title="$t('project.pro_adjustTaskField')"></Step>
      <Step :title="$t('project.pro_completeImport')"></Step>
    </Steps>
    <div>
      <excel-upload :fcert="cert" v-if="current==0" @next="next" ></excel-upload>
      <excel-analysis v-if="current==1" @next="next" @pre="pre"></excel-analysis>
      <excel-table v-if="current==2" @next="next" @pre="pre" @refreshTaskList="$emit('refreshTaskList')"></excel-table>
      <excel-import v-if="current==3" @pre="pre"></excel-import>
    </div>
  </div>
</template>

<script>
    import ExcelUpload from './excel/ExcelUpload';
    import ExcelAnalysis from './excel/ExcelAnalysis';
    import ExcelTable from './excel/ExcelTable';
    import ExcelImport from './excel/ExcelImport';
    export
    default {
        components: {
            ExcelUpload,
            ExcelAnalysis,
            ExcelTable,
            ExcelImport
        },
        data() {
            return {
                current: 0,
                displayTable: 'none',
                uploadFile: true,
                cert: '',
            };
        },
        methods: {
            pre() {
                this.current --;
            },
            next() {
                this.current ++;
            },

            /**
             * 获取上传文件的凭证
             */
            getCert() {
                this.$axios.get(this.GLOBAL.baseRouter+this.$GLOBALAPI.file_upload_cert)
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code == 0) {
                            this.cert = res.upload_cert;
                        } else {
                            this.$Modal.error({
                                title: i18n.t('project.pro_uploadDocumentsFail'),
                                content: res.err_message
                            });
                        }
                    });
            },

            /**
             * 外部显示弹窗接口
             */
            isShowPage(isShow) {
                if (isShow.constructor == Boolean) {
                    this.current = 0;
                    // console.log(isShow);
                    this.showAddNew = isShow;
                    sessionStorage.analysisExcel = {};
                    this.getCert();
                } else {
                    // console.log(false);
                    this.showAddNew = false;
                }
            }
        }
    };
</script>

<style lang="less">
  .excel{
    .ivu-steps .ivu-steps-main {
      display: inline-block !important;
    }
  }

</style>
<style lang="less" >
  .excel {
    // min-height: 600px;
    .excelSetps {
      margin-top: 5px;
      .ivu-steps-item{
            width: 30% !important;

            &:last-child{
                width: 10% !important;
                .ivu-steps-main{
                    .ivu-steps-title{
                    &:last-child{
                            padding-right: 0px !important;
                        // width: 11% !important;
                    }
                    }
                }
            }

      }
      .ivu-steps-status-process{
          .ivu-steps-head{
              .ivu-steps-head-inner{
                    border-color: @base !important;
                    background-color: @base !important;
                    span{
                        color: white;
                    }
              }
          }
          .ivu-steps-tail{
              i{
                  background-color: @base;
              }
          }
      }
      .ivu-steps-status-finish{
          .ivu-steps-tail{
              i{
                  &:after{
                          background: @base;
                  }
              }
          }
          .ivu-steps-head{
              .ivu-steps-head-inner{
                border-color: @base;
                .ivu-steps-icon{
                        color: @base;
                }
              }
          }
      }
    }
  }

</style>

