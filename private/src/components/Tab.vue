<template>
<div>
    <div>
        <Tag v-for="item in count" 
            :key="item" 
            :name="item" closable
            checkable
            @on-close="handleClose2" 
            @on-change="handleChange">
            标签{{ item + 1 }}
         </Tag>
        <Button icon="ios-add" type="dashed" size="small" @click="handleAdd">添加标签</Button>
    </div>
    <div>
        2222
    </div>
    <div>
        <Tag type="dot" closable color="primary" @on-close="dotVal" @on-change="handleDotVal" checkable>标签一</Tag>
        <Tag type="dot" closable color="success">标签二</Tag>
        <Tag type="dot" closable color="error">标签三</Tag>
        <Tag type="dot" closable color="warning">标签四</Tag>
    </div>
    <div>
        信誉度<Icon type="md-alert" />
    </div>
</div>
</template>

<script>
    export default {
        data () {
            return {
                count: [0, 1, 2]
            }
        },
        methods: {
            handleAdd () {
                if (this.count.length) {
                    this.count.push(this.count[this.count.length - 1] + 1);
                } else {
                    this.count.push(0);
                }
            },
            handleClose2 (event, name) {
                const index = this.count.indexOf(name);
                this.count.splice(index, 1);
            },
            dotVal () {
                console.log(11)
            },
            handleDotVal (checked, name) {
                console.log(checked, name)
            },
            handleChange (checked, name) {
                console.log(checked, name)
            }
        }
    }
</script>