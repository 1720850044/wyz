<template>
    <div class="twoStepBox">
        <upload-contract v-if="!isContractFlag" @fileUploadComplete="fileUploadComplete"></upload-contract>
        <preview-contract v-else :uploadList="uploadList" :type="type" :isContractID="isContractFlag"></preview-contract>
    </div>
</template>

<script>
    import upload from "@/components/upload";
    import PreviewContract from "../components/previewContract";
    import UploadContract from "../components/uploadContract";
    export default {
        name: "resource-money",
        computed: {
            ID(){
                return this.$store.state.contract.contractData.ID;
            },
            files(){
                return this.$store.state.contract.contractData.files;
            }
        },
        components: {
            UploadContract,
            upload,
            PreviewContract
        },
        data(){
            return {
                isContractFlag: false,
                uploadList: [],
                type: 'add'
            };
        },

        methods: {
            fileUploadComplete(uploadList){
                this.uploadList = uploadList;
                this.isContractFlag = true;
            }
        },
        mounted(){
            if (this.ID && this.files.length > 0){
                this.isContractFlag = true;
                this.uploadList = this.files;
                this.type = 'updata';
            } else {
                this.isContractFlag = false;
                this.uploadList = [];
                this.type = 'add';
            }
        }
    };
</script>

<style lang="less" scoped>
    .twoStepBox{
        width: 100%;
        height: 100%;
        padding: 30px 0;

    }
</style>
