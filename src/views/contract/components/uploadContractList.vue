<template>
    <ul class="upload-contract-list">
        <li v-for="(item,index) in uploadList" :class="{'activeSty' : selectImgIndex == index}" @click="selectUrl(item.file_url,index)">
            <img :src="item.file_url"/>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "preview-list",
        props: {
            uploadList: {
                type: Array,
                default: ()=>[]
            }
        },
        data(){
            return {
                selectImgIndex: 0
            };
        },
        methods: {
            selectUrl(url, index){
                this.selectImgIndex = index;
                this.$emit('returnUrl', url);
            }
        }
    };
</script>

<style lang="less" scoped>
    .upload-contract-list{
        width: 100%;
        li{
            width: 100%;
            margin-top: 5px;
            border-radius: 3px;
            &.activeSty{
                border: 2px solid @base_active;
            }
            img{
                width: 100%;
                display: block;
                &:hover{
                    cursor: pointer;
                }
            }
        }
    }
</style>
