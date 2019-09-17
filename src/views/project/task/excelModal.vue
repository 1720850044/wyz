<!-- excel解析modal-->
<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal">
                <div class="modal-header">
                    <slot name="header">
                        <div>
                            <h2 style="color: #2b85e4;">批量导入任务</h2>
                        </div>
                        <button type="button" class="btn-close" @click="close">x</button>
                    </slot>
                </div>
                <div class="modal-body">
                    <div style="height: 500px">
                        <div style="margin-top: 30px">
                            <Steps :current="1">
                                <Step title="上传任务excel文件"></Step>
                                <Step title="匹配任务字段"></Step>
                                <Step title="核对确认数据"></Step>
                                <Step title="批量导入完成"></Step>
                            </Steps>

                        </div>
                        <div style="margin: 20px 0 20px 0;color: #2b85e4;">
                            <h3>请上传任务excel文件</h3>
                        </div>
                        <div>
                            <Row>
                                <Col span="12">
                                <Upload action="//jsonplaceholder.typicode.com/posts/">
                                    <Input v-model="value13" placeholder="限xlsx / xls格式" style="width: 800px;">
                                    <Button type="ghost" slot="append" icon="ios-cloud-upload-outline" style="background: #2b85e4;color: #fff;">上传文件
                                    </Button>
                                    </Input>
                                </Upload>
                                </Col>
                            </Row>
                        </div>
                        <h3 style="margin: 20px 0 20px 0">按照系统标准模板编写，批量导入更便捷
                            <span style="color: #2b85e4;">下载参考模版</span>
                        </h3>
                        <Button type="primary" style="position: absolute;bottom: 50px;width: 200px">下一步</Button>
                    </div>
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <button type="button" class="btn-green" @click="close">关闭</button>
                    </slot>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    data() {
        return {
            value13: ""
        };
    },
    methods: {
        close: function() {
            this.$emit("close");
        }
    }
};
</script>
<style>
@import "./taskModal.less";
</style>
