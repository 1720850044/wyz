/**
 * 引导配置规则说明
 * template:
 * <div  data-step="1" data-disable-interaction="1" :data-intro="guideSteps.step1"></div>
 * <div  data-step="2" data-disable-interaction="1" :data-intro="guideSteps.step2"></div>
 * <div  data-step="3" data-disable-interaction="1" :data-intro="guideSteps.step3"></div>
 *
 * request interface:
     this.$PublicFuns.guideInitInterface(url)
        .then(result => {
            if (JSON.stringify(result.guideSteps) !== "{}") {
                _this.guideSteps =result.guideSteps;
                setTimeout(() => {
                    _this.$guide().setOptions(this.$CONSTANT.guideOptions).start();
                });
            }
            console.log("accToken ==>", result.accToken);
        });
 *
 * 说明：url: 页面的初始化接口
 *          返回的 result 对象有两个值分别为  引导步骤（guideSteps） 和  accToken
 */

import lau from '../global/zh_cn.js'
export default {
    guideOptions: {
        prevLabel: "上一步",
        nextLabel: "下一步",
        skipLabel: "×",
        doneLabel: "知道了",
        hidePrev: true,
        exitOnEsc: false,
        exitOnOverlayClick: false,
        showBullets: true,
        showStepNumbers: false,
        overlayOpacity: 0.5
    },

    // 根据页面配置相关的引导数据
    guidePageData: {
        guide_test: [
            {
                step: 1,
                tips: '<h1>提示1标题。。。</h1><p>提示步骤一</p>'
            },
            {
                step: 2,
                tips: '<h1>提示2标题。。。</h1><p>提示步骤二</p>'
            },
            {
                step: 3,
                tips: '<h1>提示3标题。。。</h1><p>提示步骤三</p>'
            }
        ],
        //研发合同(甲)
        devContract:[
            {
                step: 1,
                tips: lau.guide_words.k42
            },
            {
                step: 2,
                tips: lau.guide_words.k43
            },
            {
                step: 3,
                tips: lau.guide_words.k44
            },
            {
                step: 4,
                tips: lau.guide_words.k45
            }
        ],

        // 外包合同（乙）
        collContract:[
            {
                step: 1,
                tips: lau.guide_words.k46
            },
            {
                step: 2,
                tips: lau.guide_words.k47
            },
            {
                step: 3,
                tips: lau.guide_words.k48
            },
            {
                step: 4,
                tips: lau.guide_words.k49
            } ,
            {
                step: 5,
                tips: lau.guide_words.k50
            } ,

        ],
        // 外包合同剩余异步（乙）
        collContractLast:[
            {
                step: 1,
                tips: lau.guide_words.k51
            }
        ],

        // 甲方项目管理
        // partyAProjectManagement: [
        //     {
        //         step: 1,
        //         tips: '<h1>管理项包项目</h1><p>为保障项目质量，资源文件乙方审核后，将提交至甲方最终确认</p>'
        //     },
        //     {
        //         step: 2,
        //         tips: '<h1>查看项目进度</h1><p>项目交付类型，子项目，成员任务数等维度去把控项目进度</p>'
        //     },
        //     {
        //         step: 3,
        //         tips: '<h1>审核、下载、管理项目文件</h1><p>可审核，下载项目资源文件</p>'
        //     }

        // ],
        // 乙方项目管理引导
        // partyBProjectManagement: [
        //     {
        //         step: 1,
        //         tips: '<h1>点击管理项目</h1><p>进入项目可了解项目进度，把控项目质量，下载已完成资源文件</p>'
        //     },
        //     {
        //         step: 2,
        //         tips: '<h1>设定任务流程与制作规范</h1><p>设置项目任务制作流程，及资源审核节点。</p>'
        //     },
        //     {
        //         step: 3,
        //         tips: '<h1>点击创建任务</h1><p>进入项目可了解项目进度，把控项目质量，下载已完成的资源文件。</p>'
        //     },
        //     {
        //         step: 4,
        //         tips: '<h1>管理任务进度及排期</h1><p>项目交付类型，子项目，成员任务数等维度去把控项目进度</p>'
        //     },
        //     {
        //         step: 5,
        //         tips: '<h1>管理项目资源</h1><p>审核管理不同状态的资源文件，已完成资源文件将纳入“归档”分类下面</p>'
        //     }
        // ],
        // 乙方审核任务引导
        // auditTask:[
        //     {
        //         step: 1,
        //         tips: '<h1>选择待审任务</h1><p>乙方审核之后，资源文件将提交至甲方确认，甲方确认后所有</p>'
        //     },
        //     {
        //         step: 2,
        //         tips: '<h1>标注修改内容</h1><p>通过相关工具可查看资源，通过标注工具可直接在资源文件上反馈</p>'
        //     },
        //     {
        //         step: 3,
        //         tips: '<h1>提交反馈结果</h1><p>未通过审核乙方将继续修改，通过审核后该资源完成制作</p>'
        //     }
        // ],
        //任务大厅 投标
        // taskHall:[
            // {
            //     step: 1,
            //     tips: '<h1>选择投标项目</h1><p>项目招标基础信息展示，点击查看详情</p>'
            // },
            // {
            //     step: 2,
            //     tips: '<h1>报名投标</h1><p>确认项目招标信息符合要求后，点击报名/报价进行报名</p>'
            // },
            // {
            //     step: 3,
            //     tips: '<h1>已报名投标任务</h1><p>点击进入招标任务详情页，查看任务详情及分配人员</p>'
            // },
            // {
            //     step: 4,
            //     tips: '<h1>招标任务信息区</h1><p>项目招标任务的基础信息以及分配人员区域</p>'
            // },
            // {
            //     step: 5,
            //     tips: '<h1>任务分配</h1><p>分配该任务的制作人和负责人</p>'
            // },
            // {
            //     step: 6,
            //     tips: '<h1>稿件展示区</h1><p>制作人上传稿件完成后，展示在该区域</p>'
            // },
            // {
            //     step: 7,
            //     tips: '<h1>审核稿件</h1><p>负责人对稿件进行质量审核，若通过则等待结果；或填写修改意见返回修改后，再次审核直到通过</p>'
            // },
        // ],
        //招标
        tenderTask:[
            {
                step: 1,
                tips: lau.guide_words.k52
            },
            {
                step: 2,
                tips: lau.guide_words.k53
            },
            {
                step: 3,
                tips: lau.guide_words.k54
            },
            {
                step: 4,
                tips: lau.guide_words.k55
            },
            {
                step: 5,
                tips: lau.guide_words.k56
            },
            {
                step: 6,
                tips: lau.guide_words.k57
            }
        ],
        tenderKey:[
            {
                step: 1,
                tips: '<h1>xx</h1><p>xxxxxxxx</p>' 
            }
        ],
        // 规范库
        standardLibrary:[
            {
                step: 1,
                tips: lau.guide_words.k58
            },
            {
                step: 2,
                tips: lau.guide_words.k59
            },
            {
                step: 3,
                tips: lau.guide_words.k60
            }
        ] ,
        // 公司
        createProject:[
            {
                step: 1,
                tips: lau.guide_words.k61
            },
            {
                step: 2,
                tips: lau.guide_words.k62
            },
            {
                step: 3,
                tips: lau.guide_words.k63
            }
        ],
        // 项目类型库
        projectStandard:[
            {
                step: 1,
                tips: lau.guide_words.k64
            },
            {
                step: 2,
                tips: lau.guide_words.k65
            },
            {
                step: 3,
                tips: lau.guide_words.k66
            }
        ]
    }
}
