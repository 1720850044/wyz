<template>
    <div>
            <div id="workSpace" style="padding:0px; overflow-y:auto; overflow-x:hidden;border:1px solid #e5e5e5;position:relative;"></div>

            <div id="taZone" style="display:none;" class="noprint">
            <textarea rows="8" cols="150" id="ta"></textarea>
            </div>


            <div id="gantEditorTemplates" style="display:none;">
            <div class="__template__" type="GANTBUTTONS"><!--
            <div class="ganttButtonBar noprint">
                        <div class="buttons">
                            <button onclick="$('#workSpace').trigger('indentCurrentTask.gantt');" class="button textual" title="缩进"><span class="teamworkIcon">.</span></button>
                            <button onclick="$('#workSpace').trigger('outdentCurrentTask.gantt');" class="button textual" title="取消缩进"><span class="teamworkIcon">:</span></button>
                            <button onclick="$('#workSpace').trigger('moveUpCurrentTask.gantt');" class="button textual" title="升级"><span class="teamworkIcon">k</span></button>
                            <button onclick="$('#workSpace').trigger('moveDownCurrentTask.gantt');" class="button textual" title="降升"><span class="teamworkIcon">j</span></button>
                            <button onclick="$('#workSpace').trigger('deleteCurrentTask.gantt');" class="button textual" title="删除"><span class="teamworkIcon">&cent;</span></button>
                        </div>
                        <div class="headTool-right">
                            <span>刻度</span>
                            <span>
                            <select class="selectDate">
                                <option value="getDay">天</option>
                                <option value="getWeek">周</option>
                                <option value="getMoon">月</option>
                            </select>
                            </span>
                        </div>
                        <div class="clear"></div>
            </div>
            --></div>

                <div class="__template__" type="TASKSEDITHEAD"><!--
            <table class="gdfTable" cellspacing="0" cellpadding="0">
                <thead>
                <tr style="height:40px">
                <th class="gdfColHeader gdfResizable" style="width:200px;">任务名称</th>
                <th class="gdfColHeader gdfResizable" style="width:100px;">参与人</th>
                <th class="gdfColHeader gdfResizable" style="width:70px;">类型</th>
                </tr>
                </thead>
            </table>
            --></div>

                <div class="__template__" type="TASKROW"><!--
            <tr taskId="(#=obj.id#)" class="taskEditRow" level="(#=level#)">
                <td class="gdfCell indentCell" style="padding-left:(#=obj.level*10#)px;">
                <div class="(#=obj.isParent()?'exp-controller expcoll exp':'exp-controller'#)" align="center"></div>
                <input type="text" name="name" value="(#=obj.name#)">
                </td>
                <td class="gdfCell proChild"><input type="text" name="projectChild" value="(#=obj.projectChild#)">

                </td>
                <td class="gdfCell gdfper"><input type="text" ></td>
                <td class="gdfCell"><input type="text" name="code" value="(#=obj.code?obj.code:''#)"></td>
                <td class="gdfCell"><input type="text" name="depends" value="(#=obj.depends#)" (#=obj.hasExternalDep?"readonly":""#)></td>

            </tr>
            --></div>

            <div class="__template__" type="TASKEMPTYROW"><!--
            <tr class="taskEditRow emptyRow" >
                <td class="gdfCell"></td>
                <td class="gdfCell"></td>
                <td class="gdfCell"></td>
                <td class="gdfCell"></td>
            </tr>
            --></div>

            <div class="__template__" type="TASKBAR"><!--
            <div class="taskBox taskBoxDiv" taskId="(#=obj.id#)" >
                <div class="layout (#=obj.hasExternalDep?'extDep':''#)">
                <div class="taskStatus" status="(#=obj.status#)"></div>
                <div class="taskProgress" style="width:(#=obj.progress>100?100:obj.progress#)%; background-color:(#=obj.progress>100?'red':'rgb(153,255,51);'#);"></div>
                <div class="milestone (#=obj.startIsMilestone?'active':''#)" ></div>

                <div class="taskLabel"></div>
                <div class="milestone end (#=obj.endIsMilestone?'active':''#)" ></div>
                </div>
            </div>
            --></div>

            <div class="__template__" type="CHANGE_STATUS">
                <div class="taskStatusBox">
                <div class="taskStatus cvcColorSquare" status="STATUS_ACTIVE" title="active"></div>
                <div class="taskStatus cvcColorSquare" status="STATUS_DONE" title="completed"></div>
                <div class="taskStatus cvcColorSquare" status="STATUS_SUSPENDED" title="suspended"></div>
                <div class="taskStatus cvcColorSquare" status="STATUS_FAILED" title="failed"></div>
                </div>
                <!--<div class="taskStatusBox">
                <div class="taskStatus cvcColorSquare" status="STATUS_ACTIVE" title="active"></div>
                <div class="taskStatus cvcColorSquare" status="STATUS_DONE" title="completed"></div>
                <div class="taskStatus cvcColorSquare" status="STATUS_FAILED" title="failed"></div>
                <div class="taskStatus cvcColorSquare" status="STATUS_SUSPENDED" title="suspended"></div>
                <div class="taskStatus cvcColorSquare" status="STATUS_UNDEFINED" title="undefined"></div>
                </div>-->
            </div>


            <div class="__template__" type="ASSIGNMENT_ROW"><!--
            <tr taskId="(#=obj.task.id#)" assigId="(#=obj.assig.id#)" class="assigEditRow" >
                <td ><select name="resourceId"  class="formElements" (#=obj.assig.id.indexOf("tmp_")==0?"":"disabled"#) ></select></td>
                <td ><select type="select" name="roleId"  class="formElements"></select></td>
                <td ><input type="text" name="effort" value="(#=getMillisInHoursMinutes(obj.assig.effort)#)" size="5" class="formElements"></td>
                <td align="center"><span class="teamworkIcon delAssig" style="cursor: pointer">d</span></td>
            </tr>
            --></div>


            <div class="__template__" type="RESOURCE_EDITOR"><!--
            <div class="resourceEditor" style="padding: 5px;">

                <h2>Project team</h2>
                <table  cellspacing="1" cellpadding="0" width="100%" id="resourcesTable">
                <tr>
                    <th style="width:100px;">name</th>
                    <th style="width:30px;" id="addResource"><span class="teamworkIcon" style="cursor: pointer">+</span></th>
                </tr>
                </table>

                <div style="text-align: right; padding-top: 20px"><button id="resSaveButton" class="button big">save</button></div>
            </div>
            --></div>


            <div class="__template__" type="RESOURCE_ROW"><!--
            <tr resId="(#=obj.id#)" class="resRow" >
                <td ><input type="text" name="name" value="(#=obj.name#)" style="width:100%;" class="formElements"></td>
                <td align="center"><span class="teamworkIcon delRes" style="cursor: pointer">d</span></td>
            </tr>
            --></div>


            </div>
    </div>
</template>
<script>
// 引入外部JS
require([
    "./http://libs.baidu.com/jqueryui/1.8.22/jquery-ui.min.js",
    "./libs/jquery.livequery.min.js",
    "./libs/jquery.timers.js",
    "./libs/platform.js",
    "./libs/date.js",
    "./libs/i18nJs.js",
    "./libs/dateField/jquery.dateField.js",
    "./libs/JST/jquery.JST.js",
    "./libs/jquery.svg.min.js",
    "./libs/jquery.svgdom.1.8.js",
    "./ganttUtilities.js",
    "./ganttTask.js",
    "./ganttDrawerSVG.js",
    "./ganttGridEditor.js",
    "./ganttMaster.js"
]);

export default {
    
};
</script>
<style>
@import './platform.css';
@import './libs/dateField/jquery.dateField.css';
@import './gantt.css';
@import './print.css';
@import './libs/jquery.svg.css';
</style>
