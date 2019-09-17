<!-- 子任务列表组件 -->
<template>
    <div>
        <Table 
        height='660' 
        :columns="columnsTask" 
        :data="dataList" 
        :ellipsis="true"
        size="large"
        ref="table" 
        class="tableStyle"
        >
      </Table>
    </div>
</template>
<script>
    export default {
        props: {
            taskrow: Object
        },
        data(){
            return {
                dataList: [],
                columnsTask: [
                    {
                        title: "任务名",
                        key: "name",
                        align: "left",
                        ellipsis: true,
                        width: 380
                    },
                    {
                        title: "状态",
                        key: "status_text",
                        align: "right",
                        ellipsis: true,
                        width: 100
                    },
                    {
                        title: "类型",
                        key: "tasktype_name",
                        align: "right",
                        ellipsis: true,
                        width: 100
                    },
                    {
                        title: "负责人",
                        key: "run_uname",
                        align: "right",
                        ellipsis: true,
                        width: 120
                    },
                    {
                        title: "实施阶段",
                        key: "stage",
                        align: "left",
                        ellipsis: true,
                        width: 280,
                        render: function(h, params) {
                            let steplist = [];
                            let present = parseInt(params.row.progress)+1;
                            for (let i=0;i<params.row.stage.length;i++) {
                            let str="";
                            if (present == i) {str = params.row.stage[i].stage_name;}
                            steplist.push(
                h("Step", {
                    props: {
                        title: str,
                    }
                })
              );
                        }
                            return h("Steps",
                  {props: {current: present, size: "small"}},
                  steplist
            );
                        }
                    },
                    {
                        title: "任务文件",
                        align: "center",
                        ellipsis: true,
                        key: "file_id",
                        width: 120
                    },
                    {
                        title: "文件最近更新",
                        align: "right",
                        key: "update_date",
                        ellipsis: false,
                        width: 140
                    },
                    {
                        title: "到期时间",
                        align: "right",
                        key: "expect_end_date",
                        ellipsis: false,
                        width: 100
                    },
                    {
                        title: "操作",
                        align: "right",
                        width: 84,
                        render: (h, params) => h("div", [
                            h(
                                "Button",
                            {
                                props: {
                                     type: "text",
                                     size: "small",
                                     confirm: true,
                                     title: "确认删除该任务?",
                                     transfer: true
                                 },
                                style: {
                                     marginLeft: "12px"
                                 },
                                on: {
                                     click: () => {
                                    let cIs = this;
                                    cIs.removetasklistData(params.index);
                                }
                                 }
                            },
                                "删除"
                            )
                        ])
                    }
                ],
            };
        }
    };
</script>
<style >
    .expand-row{
        margin-bottom: 16px;
    }
</style>