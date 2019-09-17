window.onload=function(){
    function getGantt(projectID){
        $.ajax({
            type: 'get',
            url: ganttURL+'task/task/list&project_id='+projectID+'&token='+window.localStorage.token,
            async: true,
            dataType: 'json',
            success: function(msg){
                var data=msg.data;
        // console.log(data);
                if (msg.err_code==0){
                    var arr=[];
                    $.each(data, function(index, item){
                        var localChange = {
                            '1': 'STATUS_FAILED',
                            '2': 'STATUS_SUSPENDED',
                            '3': 'STATUS_DONE',
                            '4': 'STATUS_ACTIVE',
                        };
                        item.status = localChange[item.status];
                        arr.push({
                            'id': item.id,
                            'name': item.name,
                            'code': item.tasktype_name, //类型 待修改
                            'projectChild': item.project_child,
                            'status': item.status, //状态
                            'start': item.expect_start_time, //预计开始时间
                            'duration': item.expect_work_day, //预计工作时间，待修改
                            'end': item.expect_end_time, //预计结束时间
                            'level': 1, //?层级？
                            'canWrite': true,
                            'startIsMilestone': true, //里程碑?
                            'endIsMilestone': false,
                            'collapsed': false, //折叠
                            'assigs': [],
                            'hasChild': true,
                        });
                    });
          //子项目相关
                    var childProjects;
                    $.ajax({
                        type: 'get',
                        async: false,
                        url: ganttURL+'task/project/child-list&id='+projectID+'&token='+window.localStorage.token,
                        dataType: 'json',
                        success: function(data){
                            childProjects=data.data;
                        },
                    });
                    childProjects.forEach(function(child){
                        arr.forEach(function(task){
                            if (task.projectChild==child.id){
                                task.projectChild=child.name;
                            } else {
                                task.projectChild='----';
                            }
                        });
                    });

          //处理字符串
                    var ssta='{"tasks":[';
                    var tasksString='';
                    for (var i=0;i<arr.length;i++){
                        tasksString += JSON.stringify(arr[i]) + ',';
                    }
                    tasksString = tasksString.substring(0, tasksString.length-1);
                    var este='],"selectedRow":0,"canWrite":true,"canWriteOnParent":true}';
                    document.getElementById('ta').value=ssta+tasksString+este;
                    loadGanttFromServer();
          // console.log(data);
                    var taskTag=[
            {'name': '原画组', 'num': 10, 'taskID': 'yh'},
            {'name': '特效组', 'num': 7, 'taskID': 'tx'},
            {'name': '动作组', 'num': 15, 'taskID': 'dz'},
            {'name': '策划组', 'num': 3, 'taskID': 'ch'},
                    ];
                    var str='<option>----</option>';
                    taskTag.forEach(function(item){
                        str+='<option value='+item.name+'>'+item.name+'</option>';
                    });
                    $('.selectStyle select').append(str);
                }
            },
            error: function() {
        // alert('请求失败')
            },
        });
    }  
    getGantt(gantt_projectID);
};
