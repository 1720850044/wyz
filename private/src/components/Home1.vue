<template>
    <div id="root">
       <child-component>
            <template slot="girl">
                漂亮、美丽、购物、逛街
            </template>
            <template slot="boy">
                帅气、才实
            </template>
            <div>
                我是一类人，
                我是默认的插槽
            </div>
        </child-component>
    </div>
</template>

<script>
    import Vue from 'vue'
    Vue.component('child-component',{
        template:`
            <div>
            <h4>这个世界不仅有男人和女人</h4>

            <slot name="girl"></slot>

            <div style="height:1px;background-color:red;"></div>

            <slot name="boy"></slot>

            <div style="height:1px;background-color:red;"></div>

            <slot></slot>
            </div>
        `
    })
    let vm = new Vue({
        el:'#root',
        data:{

        }
    })
</script>
