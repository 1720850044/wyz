<!-- 任务评审组件-->
<template>
    <div>
        <!-- <div v-show="status == 1">
          <input class="message" type="text" v-model="feedback" placeholder="输入您要反馈的内容" />
          <div class="change">需修改</div>
          <div class="success">通过</div>
        </div> -->
        <div v-show="status == 2" style="margin: 20px 0 0 20px;">
          <ul class="list">
            <li>反馈内容</li>
            <li>反馈结果</li>
            <li>反馈人</li>
            <li>反馈时间</li>
          </ul>
          <ul class="list">
            <li>把以上标注修改即可，把以上标注修改即可把以上标注修改即可</li>
            <li>需修改</li>
            <li>刘德华</li>
            <li>今天/3天前</li>
          </ul>
        </div>
        <div v-show="status == 3" style="margin: 20px 0 0 100px;">
          <ul class="list">
            <li>反馈状态</li>
            <li>反馈人</li>
            <li>等待时间</li>
          </ul>
          <ul class="list">
            <li>客户待审</li>
            <li>四川义美游有限公司</li>
            <li>今天提交/3天前</li>
          </ul>
        </div>
        <div v-show="status == 4" style="margin: 20px 0 0 20px;">
          <ul class="list">
            <li>反馈内容</li>
            <li>反馈结果</li>
            <li>反馈人</li>
            <li>反馈时间</li>
          </ul>
          <ul class="list">
            <li>把以上标注修改即可，把以上标注修改即可把以上标注修改即可</li>
            <li>需修改</li>
            <li>刘德华</li>
            <li>今天/3天前</li>
          </ul>
        </div>
    </div>
</template>
