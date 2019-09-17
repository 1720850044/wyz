<template>
    <upload @fileUploadComplete="fileUploadComplete" @FileUploadedSuccess="FileUploadedSuccess">
        <div slot="upload" :parameter="{type:'contract'}" class="uploadMain">
            <p class="mainP" id="browse">
                <i class='iconfonts icon-ymy-upload-copy'></i>
                <span>
                    <em>点击上传合同扫描件</em><br/>
                    <em>支持JPG, PNG, JPEG, BMP格式合同文件</em>
                </span>
            </p>
        </div>
    </upload>
</template>

<script>
    import upload from "@/components/upload";
    export default {
        name: "upload-contract",
        components: {
            upload
        },
        data(){
            return {
                uploadList: []
            };
        },
        methods: {
            FileUploadedSuccess(data){
                let responseData = JSON.parse(data.response);
                responseData.name = data.name;
                this.uploadList.push(responseData);
            },
            fileUploadComplete(){
                this.$emit('fileUploadComplete', this.uploadList);
            }
        }
    };
</script>

<style lang="less" scoped>
    .uploadMain{
        height: 100%;
        display: flex;
        align-items: center;
        .mainP{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: @base;
            padding: 20px 0;
            &:hover{
                cursor: pointer;
                color: @base_dark;
            }
            .icon-ymy-upload-copy{
                font-style: normal;
                font-size: 50px;
            }
            span{
                margin-left: 5px;
                em{
                    font-style: normal;
                    &:first-child{
                        font-weight: bold;
                        font-size: 16px;
                        margin-bottom: 2px;
                        display: inline-block;
                    }
                }
            }
        }
    }
</style>
