/*
 Copyright (c) 2012-2014 Open Lab
 Written by Roberto Bicchierai and Silvia Chelazzi http://roberto.open-lab.com
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
//甘特图形SVG类,目前逻辑用的这个类
//区域范围，开始时间，结束时间，父物体，最小尺寸
function Ganttalendar(zoom, startmillis, endMillis, master, minGanttSize) {
  
    this.master = master; // is the a GantEditor instance
    this.element; // is the jquery element containing gantt
    this.highlightBar;

    this.svg; // instance of svg object containing gantt

    this.tasksGroup; //instance of svg group containing tasks
    this.linksGroup; //instance of svg group containing links

    this.zoom = zoom;
    this.minGanttSize = minGanttSize;
    this.includeToday = true; //when true today is always visible. If false boundaries comes from tasks periods
    this.showCriticalPath = false; //when true critical path is highlighted

    this.zoomLevels = [ 'd', 'w', 'm', 'q', 's', 'y' ];//日、周、月、季、半年、年

    this.element = this.create(zoom, startmillis, endMillis);

    this.linkOnProgress = false; //set to true when creating a new link

}
//时间轴刻度调整
Ganttalendar.prototype.zoomGantt = function (isPlus) {
    console.log('zoomGantt');
  
    var curLevel = this.zoom;
    var pos = this.zoomLevels.indexOf(curLevel + '');
    var newPos = pos;
//	if (isPlus) {
//	newPos = pos <= 0 ? 0 :pos-1;
//
//	} else {
//	  newPos = pos >= this.zoomLevels.length - 1 ? this.zoomLevels.length - 1 : pos + 1;
//	}

 //Select切换
    switch (isPlus){
  	case 1:
  		//切换到周
  		newPos = 1;
  		break;
  	case 2:
  		newPos = 2;
  		break;
  	case 3:
  		//切换到月
  		newPos = 3;
  		break;
    }

    if (newPos != pos) {
        curLevel = this.zoomLevels[newPos];
        this.zoom = curLevel;
        this.refreshGantt();
    }

};
//创建甘特函数，目前会调用3次
Ganttalendar.prototype.create = function (zoom, originalStartmillis, originalEndMillis) {
    var self = this;
  //获得周期
    function getPeriod(zoomLevel, stMil, endMillis) {
        var start = new Date(stMil);
        var end = new Date(endMillis);
    //reset hours
        if (zoomLevel == 'd') {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            start.setFirstDayOfThisWeek();
            end.setFirstDayOfThisWeek();
            end.setDate(end.getDate() + 6);
      //reset day of week
        } else if (zoomLevel == 'w') {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            start.setFirstDayOfThisWeek();
            end.setFirstDayOfThisWeek();
            end.setDate(end.getDate() + 6);

      //reset day of month
        } else if (zoomLevel == 'm') {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            start.setDate(1);
            end.setDate(1);
            end.setMonth(end.getMonth() + 1);
            end.setDate(end.getDate() - 1);

      //reset to quarter
        } else if (zoomLevel == 'q') {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            start.setDate(1);
            start.setMonth(Math.floor(start.getMonth() / 3) * 3);
            end.setDate(1);
            end.setMonth(Math.floor(end.getMonth() / 3) * 3 + 3);
            end.setDate(end.getDate() - 1);

      //reset to semester
        } else if (zoomLevel == 's') {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            start.setDate(1);

            start.setMonth(Math.floor(start.getMonth() / 6) * 6);
            end.setDate(1);
            end.setMonth(Math.floor(end.getMonth() / 6) * 6 + 6);
            end.setDate(end.getDate() - 1);

      //reset to year - > gen
        } else if (zoomLevel == 'y') {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            start.setDate(1);
            start.setMonth(0);

            end.setDate(1);
            end.setMonth(12);
            end.setDate(end.getDate() - 1);
        }
        return {start: start.getTime(), end: end.getTime()};
    }
  //创建顶部第一行
    function createHeadCell(lbl, span, additionalClass, width) {
        var th = $('<th>').html(lbl).attr('colSpan', span);
        if (width) {th.width(width);}
        if (additionalClass) {th.addClass(additionalClass);}
        return th;
    }
  //创建顶部第二行
    function createBodyCell(span, isEnd, additionalClass) {
        var ret = $('<td>').html('').attr('colSpan', span).addClass('ganttBodyCell');
        if (isEnd) {ret.addClass('end');}
        if (additionalClass) {ret.addClass(additionalClass);}
        return ret;
    }
  //创建甘特
    function createGantt(zoom, startPeriod, endPeriod) {
        var tr1 = $('<tr>').addClass('ganttHead1');
        var tr2 = $('<tr>').addClass('ganttHead2');
        var trBody = $('<tr>').addClass('ganttBody');

        function iterate(renderFunction1, renderFunction2) {
            var start = new Date(startPeriod);
      //loop for header1
            while (start.getTime() <= endPeriod) {
                renderFunction1(start);
            }

      //loop for header2
            start = new Date(startPeriod);
            while (start.getTime() <= endPeriod) {
                renderFunction2(start);
            }
        }

    //this is computed by hand in order to optimize cell size
        var computedTableWidth;
    // year
        if (zoom == 'y') {
            computedTableWidth = Math.floor(((endPeriod - startPeriod) / (3600000 * 24 * 360)) * 100); //180gg = 1 sem = 100px
            iterate(function (date) {
                tr1.append(createHeadCell(date.format('yyyy'), 2));
                date.setFullYear(date.getFullYear() + 1);
            }, function (date) {
                var sem = (Math.floor(date.getMonth() / 6) + 1);
                tr2.append(createHeadCell(GanttMaster.messages.GANTT_SEMESTER_SHORT + sem, 1, null, 100));
                trBody.append(createBodyCell(1, sem == 2));
                date.setMonth(date.getMonth() + 6);
            });
        } else if (zoom == 's') { //semester
            computedTableWidth = Math.floor(((endPeriod - startPeriod) / (3600000 * 24 * 180)) * 100); //90gg = 1 quarter = 100px
            iterate(function (date) {
                var end = new Date(date.getTime());
                end.setMonth(end.getMonth() + 6);
                end.setDate(end.getDate() - 1);
                tr1.append(createHeadCell(date.format('MMM') + ' - ' + end.format('yyyy - MMM'), 2));
                date.setMonth(date.getMonth() + 6);
            }, function (date) {
                var quarter = ( Math.floor(date.getMonth() / 3) + 1);
                tr2.append(createHeadCell(GanttMaster.messages.GANTT_QUARTER_SHORT + quarter, 1, null, 100));
                trBody.append(createBodyCell(1, quarter % 2 == 0));
                date.setMonth(date.getMonth() + 3);
            });
      
        } else if (zoom == 'q') { //quarter
            computedTableWidth = Math.floor(((endPeriod - startPeriod) / (3600000 * 24 * 90)) * 300); //1 month= 300px
            iterate(function (date) {
                var end = new Date(date.getTime());
                end.setMonth(end.getMonth() + 3);
                end.setDate(end.getDate() - 1);
                tr1.append(createHeadCell(date.format('MMM') + ' - ' + end.format('MMM yyyy'), 3));
                date.setMonth(date.getMonth() + 3);
            }, function (date) {
                var lbl = date.format('MMM');
                tr2.append(createHeadCell(lbl, 1, null, 300));
                trBody.append(createBodyCell(1, date.getMonth() % 3 == 2));
                date.setMonth(date.getMonth() + 1);
            });
        } else if (zoom == 'm') { //月
            computedTableWidth = Math.floor(((endPeriod - startPeriod) / (3600000 * 24)*25) ); //1 day= 25px
            iterate(function (date) {
                var sm = date.getTime();
                date.setMonth(date.getMonth() + 1);
                var daysInMonth = Math.round((date.getTime() - sm) / (3600000 * 24) );
                tr1.append(createHeadCell(new Date(sm).format('yyyy - MMMM'), daysInMonth)); //spans mumber of dayn in the month
            }, 
              function (date) {
                  tr2.append(createHeadCell(date.format('d'), 1, isHoliday(date) ? 'holyH' : null, 25));

                  var nd = new Date(date.getTime());
                  nd.setDate(date.getDate() + 1);
                  trBody.append(createBodyCell(1, nd.getDate() == 1, isHoliday(date) ? 'holy' : null));
                  date.setDate(date.getDate() + 1);
              });
        } else if (zoom == 'w') { //week
            computedTableWidth = Math.floor(((endPeriod - startPeriod) / (3600000 * 24 * 7)) * 40); //1 day= 40px
            iterate(function (date) {
                var end = new Date(date.getTime());
                end.setDate(end.getDate() + 6);
                tr1.append(createHeadCell(date.format('MMM d') + ' - ' + end.format("MMM d'yy"), 7));
                date.setDate(date.getDate() + 7);
            }, function (date) {
                tr2.append(createHeadCell(date.format('EEEE').substr(0, 1), 1, isHoliday(date) ? 'holyH' : null, 40));
                trBody.append(createBodyCell(1, date.getDay() % 7 == (self.master.firstDayOfWeek + 6) % 7, isHoliday(date) ? 'holy' : null));
                date.setDate(date.getDate() + 1);
            });
        } else if (zoom == 'd') { //days
            computedTableWidth = Math.floor(((endPeriod - startPeriod) / (3600000 * 24)) * 100); //1 day= 100px
            iterate(function (date) {
                var end = new Date(date.getTime());
                end.setDate(end.getDate() + 6);
                tr1.append(createHeadCell(date.format('MMMM - d') + ' - ' + end.format('yyyy - d - MMMM'), 7));
                date.setDate(date.getDate() + 7);
            }, function (date) {
                tr2.append(createHeadCell(date.format('EEE - d'), 1, isHoliday(date) ? 'holyH' : null, 100));
                trBody.append(createBodyCell(1, date.getDay() % 7 == (self.master.firstDayOfWeek + 6) % 7, isHoliday(date) ? 'holy' : null));
                date.setDate(date.getDate() + 1);
            });
        } else {
            console.error('Wrong level ' + zoom);
        }
    //set a minimal width
        computedTableWidth = Math.max(computedTableWidth, self.minGanttSize);

        var table = $('<table cellspacing=0 cellpadding=0>');
        table.append(tr1).append(tr2).css({width: computedTableWidth});

        var head = table.clone().addClass('fixHead');
        table.append(trBody).addClass('ganttTable');
        var height = self.master.editor.element.height();
        table.height(height);

        var box = $('<div>');
        box.addClass('gantt unselectable').attr('unselectable', 'true').css({position: 'relative', width: computedTableWidth});
        box.append(table);
        box.append(head);

    //highlightBar
        var hlb = $('<div>').addClass('ganttHighLight');
        box.append(hlb);
        self.highlightBar = hlb;

        var rowHeight = 41; // todo get it from css?
    //create the svg
        box.svg({settings: {class: 'ganttSVGBox'},
            onLoad: function (svg) {
                var defs = svg.defs('myDefs');
                svg.linearGradient(defs, 'taskGrad', [ [ 0, '#3bceb6' ], [ 1, '#3bceb6' ] ], 0, 0, 0, '100%');
		    svg.linearGradient(defs, 'taskAsh', [ [ 0, '#f0f0f0' ], [ 1, '#f0f0f0' ] ], 0, 0, 0, '100%');//添加灰色背景
        //背景
                var extDep = svg.pattern(defs, 'extDep', 0, 0, 40, 40, 0, 0, 40, 40, {patternUnits: 'userSpaceOnUse'});
                svg.image(extDep, 0, 0, 80, 80, 'res/hasExternalDeps.png');

                self.svg = svg;
                $(svg).addClass('ganttSVGBox');

        //创建网格
                var gridGroup = svg.group('gridGroup');
                for (var i = 40; i <= height; i += rowHeight) {
                    svg.line(gridGroup, 0, i, '100%', i, {class: 'ganttLinesSVG'});
                }
                self.linksGroup = svg.group('linksGroup');//创建链接组
                self.tasksGroup = svg.group('tasksGroup');//创建任务组
                self.fx = computedTableWidth / (endPeriod - startPeriod);//比例
        //今天
                var timeNow = Math.round(new Date().getTime());
                if (timeNow > self.startMillis && timeNow < self.endMillis) {
                    var x = Math.round(((timeNow) - self.startMillis) * self.fx);
                    svg.line(gridGroup, x, 0, x, '100%', {class: 'ganttTodaySVG'});
                }
            },
        });

        return box;
    }
  //if include today synch extremes
    if (this.includeToday) {
        var today = Math.round(new Date().getTime());
        originalStartmillis = originalStartmillis > today ? today : originalStartmillis;
        originalEndMillis = originalEndMillis < today ? today : originalEndMillis;
    }
  //get best dimension fo gantt
    var period = getPeriod(zoom, originalStartmillis, originalEndMillis); //this is enlarged to match complete periods basing on zoom level
    self.startMillis = period.start; //real dimension of gantt
    self.endMillis = period.end;
    self.originalStartMillis = originalStartmillis; //minimal dimension required by user or by task duration
    self.originalEndMillis = originalEndMillis;
    var table = createGantt(zoom, period.start, period.end);
    return table;
};
//<%-------------------------------------- 甘特任务图形元素--------------------------------------%>
//绘制任务
Ganttalendar.prototype.drawTask = function (task) {
    var self = this;
    editorRow = task.rowElement;
  // console.log(task.start);
  // console.log(new Date(task.start*1000));
  // console.log(new Date(self.startMillis*1000));
    var _taskBox_x = Math.round((parseInt(task.start) - self.startMillis) * self.fx);
    var _taskBox_y = editorRow.position().top + editorRow.offsetParent().scrollTop();
    var _taskBox_width = Math.round((parseInt(task.end) - parseInt(task.start)) * self.fx);
  // console.log(_taskBox_x,_taskBox_y,_taskBox_width);
  
    task.hasChild = task.isParent();

    var taskBox = $(_createTaskSVG(task, {x: _taskBox_x, y: _taskBox_y, width: _taskBox_width}));
    task.ganttElement = taskBox;

    if (self.showCriticalPath && task.isCritical) {taskBox.addClass('critical');}

    if (this.master.canWrite && task.canWrite) {

    //bind all events on taskBox
        taskBox.click(function (e) { // manages selection
            e.stopPropagation();// to avoid body remove focused
            self.element.find('.focused').removeClass('focused');
            $('.ganttSVGBox .focused').removeClass('focused');
            var el = $(this);
            if (!self.resDrop) {el.addClass('focused');}
            self.resDrop = false; //hack to avoid select

            $('body').off('click.focused').one('click.focused', function () {
                $('.ganttSVGBox .focused').removeClass('focused');
            });
        })
            .dblclick(function (e) {

              //鼠标双击事件
              //self.master.showTaskEditor($(this).attr("taskid"));
                console.log('当前task_id:'+$(this).attr('taskid')); //返回当前进度条的ID

                userTaskID=$(this).attr('taskid');
                var cwidth, cheight;
                cwidth=$(window).width()/1.5;
                cheight=$(window).height()/1.3;
                $('.openDetails').css({'width': cwidth, 'height': cheight, 'top': '10%', 'left': '15%', 'display': 'block'});
                e.stopPropagation();
                userTaskFun(userTaskID);
                $('.openDetails').click(function(e){
                    $(this).show;
                    e.stopPropagation();
                });

                $(document).click(function(){
                    $('.openDetails').hide();
                });
            })
            .mouseenter(function () {

              //bring to top
                var el = $(this);
                if (!self.linkOnProgress) {
                    el.find('.linkHandleSVG').show();
                } else {
                    el.addClass('linkOver');
                //el.find(".linkHandleSVG"+(self.linkFromEnd?".taskLinkStartSVG ":".taskLinkEndSVG")).show()
                }
            })
            .mouseleave(function () {
                var el = $(this);
                el.removeClass('linkOver').find('.linkHandleSVG').hide();
                $('.openShow').hide();
            })
            .mouseup(function (e) {
                $(':focus').blur(); // in order to save grid field when moving task
                $('.openShow').hide();
            })
            .mousedown(function () {
                $('.openShow').hide();
                var task = self.master.getTask($(this).attr('taskId'));
                task.rowElement.click();
            })
            .dragExtedSVG($(self.svg.root()), {
                canResize: this.master.canWrite && task.canWrite,
                canDrag: !task.depends && this.master.canWrite && task.canWrite,
                startDrag: function (e) {
                    $('.ganttSVGBox .focused').removeClass('focused');
                },
                drag: function (e) {
                    $('[from=' + task.id + '],[to=' + task.id + ']').trigger('update');
                },
                drop: function (e) {
                    self.resDrop = true; //hack to avoid select
                    var taskbox = $(this);
                    var task = self.master.getTask(taskbox.attr('taskid'));
                    var s = Math.round((parseFloat(taskbox.attr('x')) / self.fx) + self.startMillis);
                    self.master.beginTransaction();
                    self.master.moveTask(task, new Date(s));
                    self.master.endTransaction();
                },
                startResize: function (e) {
                //console.debug("startResize");
                    $('.ganttSVGBox .focused').removeClass('focused');
                    var taskbox = $(this);
                    var text = $(self.svg.text(parseInt(taskbox.attr('x')) + parseInt(taskbox.attr('width') + 8), parseInt(taskbox.attr('y')), '', {'font-size': '10px', 'fill': 'red'}));
                    taskBox.data('textDur', text);
                },
                resize: function (e) {
                //find and update links from, to
                    var taskbox = $(this);
                    var st = Math.round((parseFloat(taskbox.attr('x')) / self.fx) + self.startMillis);
                    var en = Math.round(((parseFloat(taskbox.attr('x')) + parseFloat(taskbox.attr('width'))) / self.fx) + self.startMillis);
                    var d = computeStartDate(st).distanceInWorkingDays(computeEndDate(en));
                    var text = taskBox.data('textDur');
                    text.attr('x', parseInt(taskbox.attr('x')) + parseInt(taskbox.attr('width')) + 8).html(d);

                    $('[from=' + task.id + '],[to=' + task.id + ']').trigger('update');
                },
                stopResize: function (e) {
                    self.resDrop = true; //hack to avoid select
                //console.debug(ui)
                    var textBox = taskBox.data('textDur');
                    if (textBox) {textBox.remove();}
                    var taskbox = $(this);
                    var task = self.master.getTask(taskbox.attr('taskid'));
                    var st = Math.round((parseFloat(taskbox.attr('x')) / self.fx) + self.startMillis);
                    var en = Math.round(((parseFloat(taskbox.attr('x')) + parseFloat(taskbox.attr('width'))) / self.fx) + self.startMillis);
                    self.master.beginTransaction();
                    self.master.changeTaskDates(task, new Date(st), new Date(en));
                    self.master.endTransaction();
                },
            });

    //binding for creating link
        taskBox.find('.linkHandleSVG').mousedown(function (e) {
            e.preventDefault();
            e.stopPropagation();
            var taskBox = $(this).closest('.taskBoxSVG');
            var svg = $(self.svg.root());
            var offs = svg.offset();
            self.linkOnProgress = true;
            self.linkFromEnd = $(this).is('.taskLinkEndSVG');
            svg.addClass('linkOnProgress');

      // create the line
            var startX = parseFloat(taskBox.attr('x')) + (self.linkFromEnd ? parseFloat(taskBox.attr('width')) : 0);
            var startY = parseFloat(taskBox.attr('y')) + parseFloat(taskBox.attr('height')) / 2;
            var line = self.svg.line(startX, startY, e.pageX - offs.left - 5, e.pageY - offs.top - 5, {class: 'linkLineSVG'});
            var circle = self.svg.circle(startX, startY, 5, {class: 'linkLineSVG'});

      //bind mousemove to draw a line
            svg.bind('mousemove.linkSVG', function (e) {
                var offs = svg.offset();
                var nx = e.pageX - offs.left;
                var ny = e.pageY - offs.top;
                var c = Math.sqrt(Math.pow(nx - startX, 2) + Math.pow(ny - startY, 2));
                nx = nx - (nx - startX) * 10 / c;
                ny = ny - (ny - startY) * 10 / c;
                self.svg.change(line, { x2: nx, y2: ny});
                self.svg.change(circle, { cx: nx, cy: ny});
            });

      //bind mouseup un body to stop
            $('body').one('mouseup.linkSVG', function (e) {
                $(line).remove();
                $(circle).remove();
                self.linkOnProgress = false;
                svg.removeClass('linkOnProgress');

                $(self.svg.root()).unbind('mousemove.linkSVG');
                var targetBox = $(e.target).closest('.taskBoxSVG');
        //console.debug("create link from " + taskBox.attr("taskid") + " to " + targetBox.attr("taskid"));

                if (targetBox && targetBox.attr('taskid') != taskBox.attr('taskid')) {
                    var taskTo;
                    var taskFrom;
                    if (self.linkFromEnd) {
                        taskTo = self.master.getTask(targetBox.attr('taskid'));
                        taskFrom = self.master.getTask(taskBox.attr('taskid'));
                    } else {
                        taskFrom = self.master.getTask(targetBox.attr('taskid'));
                        taskTo = self.master.getTask(taskBox.attr('taskid'));
                    }

                    if (taskTo && taskFrom) {
                        var gap = 0;
                        var depInp = taskTo.rowElement.find('[name=depends]');
                        depInp.val(depInp.val() + ((depInp.val() + '').length > 0 ? ',' : '') + (taskFrom.getRow() + 1) + (gap != 0 ? ':' + gap : ''));
                        depInp.blur();
                    }
                }
            });
        });
    }
  //ask for redraw link
    self.redrawLinks();
  //prof.stop();

    function _createTaskSVG(task, dimensions) {
        var svg = self.svg;
        var taskSvg = svg.svg(self.tasksGroup, 
                          dimensions.x, 
                          dimensions.y, 
                          dimensions.width, 
                          35, 
                          {class: 'taskBox taskBoxSVG', taskid: task.id});
    //svg.title(taskSvg, task.name);
    //external box
        var lw=100+'%';
        var layout = svg.rect(taskSvg, 0, 2, lw, '100%', {class: 'taskLayout', rx: '0', ry: '0'});

        if (task.hasExternalDep) {
            layout.style.fill = 'url(#extDep)';
        } else {
            layout.style.fill = 'url(#taskGrad)';
        }
    //绘制进度
        if (task.progress > 0) {
            var progress = svg.rect(taskSvg, 0, 2, (task.progress > 100 ? 100 : task.progress) + '%', '100%', {fill: (task.progress > 100 ? 'red' : 'rgb(153,255,51)'), rx: '6', ry: '6', opacity: 0.4});
            if (dimensions.width > 50) {
                var textStyle = {fill: '#888', 'font-size': '10px'};
                if (task.progress > 90) {textStyle.transform = 'translate(-30)';}
                svg.text(taskSvg, (task.progress > 90 ? 100 : task.progress) + '%', 18, task.progress + '%', textStyle);
            }
        }

    //status
    // if (dimensions.width > 15){
    //console.log(dimensions)

      //  function ganttPost(){
          // var taskID=task.id;
          // var taskName=task.name;
          // var taskName=task.name;
          // var taskID=task.id;
          // onsole.log(taskName+" "+taskID)
          // var taskURL="http://192.168.2.19/index.php?r=task/task/update";
          // $.ajax({
          //   type:'post',
          //   url:taskURL,
          //   async:true,
          //   dataType:"json",
          //   data:{"id":taskID,"name":taskName},
          //   //data:{"id":taskID,"name":taskName,"expect_start_time":taskStartDate,"expect_end_time":taskEndDate},
          //   success:function(msg){
          //     console.log(msg)
          //   }
          // })
      // }

        // $(".taskBoxSVG").mousedown(function(){
          // var taskStart=new Date(((task.start)/1000)*1000);
          // var taskStart_Y=taskStart.getFullYear();
          // var taskStart_M=taskStart.getMonth()+1;
          // var taskStart_D=taskStart.getDate()
          // var taskStartDate=taskStart_Y+"-"+taskStart_M+"-"+taskStart_D;

          // var taskEnd=new Date((parseInt((task.end)/1000))*1000);
          // var taskEnd_Y=taskEnd.getFullYear();
          // var taskEnd_M=taskEnd.getMonth()+1;
          // var taskEnd_D=taskEnd.getDate()
          // var taskEndDate=taskEnd_Y+"-"+taskEnd_M+"-"+taskEnd_D;
          // console.log(taskStartDate+"--"+taskEndDate)
          // $.post(taskURL,{"id":taskID,"expect_start_time":taskStartDate,"expect_end_time":taskEndDate}).then(function(msg){
          //   console.log(msg)
          // })
        // })
        //  $.post(taskURL,{"id":taskID,"name":taskName}).then(function(msg){
        //     console.log(msg)
        //  })

        //SVG上的时间戳
        //console.log("开始时间："+(task.start)/1000+"结束时间："+parseInt((task.end)/1000))

    // }
        // var gdata="";
        //进度条
        var n=20+'%';
        var an=n.replace('%', '');

        //判断图标的颜色，如果为黄，则进度条为灰色
        if (task.status=='STATUS_SUSPENDED'){
            layout.style.fill = 'url(#taskAsh)';//灰色背景
            svg.rect(taskSvg, 0, 2, n, 35, {stroke: 1, rx: '0', ry: '0', status: task.status, class: 'taskStatusSVG'});//黄色标记背景宽度
        }

        if (task.status=='STATUS_ACTIVE'){}

        if (task.status=='STATUS_FAILED'){
            svg.rect(taskSvg, 0, 2, '100%', 35, {stroke: 1, rx: '0', ry: '0', status: task.status, class: 'taskStatusSVG'});//灰色状态
        }

        if (task.status=='STATUS_DONE'){
            svg.rect(taskSvg, 0, 2, '100%', 35, {stroke: 1, rx: '0', ry: '0', status: 'STATUS_SUSPENDED', class: 'taskStatusSVG'});
            svg.rect(taskSvg, '101%', 2, 25, 35, {stroke: 1, rx: '0', ry: '0', status: 'STATUS_DONE', class: 'taskStatusSVG'});
            svg.text(taskSvg, '101.5%', 20, '+'+6, {class: 'taskLabelSVG', transform: 'translate(2,-1)'});
        }

    //图标事件
        $(function(){
    	//点击
    	$('.taskBoxSVG').hover(function(){
        var oTop=$(this).offset().top;
        var oLeft=$(this).offset().left;
        $('.openShow').show().css({'left': oLeft, 'top': oTop+23});
        var wLeft=$(window).width()-510;
        if (oLeft>wLeft){
            $('.openShow').show().css({'left': wLeft, 'top': oTop+23});
        }
        // $(this).addClass('appRect')
    	}, function(){
    	  $('.openShow').hide();
    	  // $(this).removeClass('appRect');
    });

      // 参与人选择
            $('.gdfper input').unbind('click').click(function(e){
                console.log('参与人');
        
                $(this).addClass('thispeo');
        // AddPeopleDiv
                var pTop=$(this).offset().top-1;
                var pLeft=$(this).offset().left-1;
                var pWidth=$(this).width()*1.7;
                var pHeight=$('.addpeople').height();
                $('.addpeople').fadeIn().css({'top': pTop, 'left': pLeft, 'width': pWidth});
                $('.peopleInt').val($(this).val()).css({'width': pWidth}).focus();
                $('.addpeople dd').css({'height': pHeight});
        // EditPeople
                $('.addpeople dt a').click(function(){
                    $(this).parent().find('a').removeClass('show');
                    $(this).addClass('show');
                    var aindex=$(this).index();
                    $('.addpeople dd').hide();
                    $('.addpeople dd:eq('+aindex+')').css('display', 'block');
                });
                $('.peopleInt').change(function(){
                    peopleIntTxt=$.trim($(this).val());
                    $('.thispeo').val(peopleIntTxt);
                });
        // EditInput
                $('.addpeople dd input').unbind('click').click(function(){
                    if ($(this).is(':checked')){
                        var addinptVal=$(this).val();
                        $('.peopleInt').val(addinptVal);
                        $('.thispeo').val(addinptVal);
                    } else {
                        var addinptVal=$(this).val();
                        $('.peopleInt').val($('.peopleInt').val().replace(addinptVal, ''));
                        $('.thispeo').val($('.thispeo').val().replace(addinptVal, ''));
                    }
                });
                e.stopPropagation();
            });

            $('.addpeople').click(function(e){
                $(this).show();
                e.stopPropagation();
                console.log('addpeople');
        
            });

      // 子项目选择
            $('.proChild input').unbind('click').click(function(e){
                $(this).addClass('thisChild');
                var pTop=$(this).offset().top;
                var pLeft=$(this).offset().left;
                var PHeight=$(this).height();
                var Pwidth=$(this).width();
                $('.selectStyle').css({'display': 'block', top: pTop, left: pLeft, height: PHeight+3, width: auto});
                $('.selectStyle select').focus().css('height', PHeight+1);
                $('.selectStyle select option:first').prop('selected', 'selected');

                $('.selectStyle select').change(function(){
                    $('.thisChild').val($(this).val());
                    $(this).parent().hide();
                    $('.proChild input').removeClass('thisChild');
                    console.log($(this).val());
                });
                e.stopPropagation();
            });

            $('.selectStyle').click(function(e){
                $(this).show();
                e.stopPropagation();
            });

            $(document).click(function(){
                $('.addpeople,.selectStyle').hide();
                $('.proChild input').removeClass('thisChild');
                $('.gdfper input').removeClass('thispeo');
            });

        });

        if (task.endIsMilestone) {
            svg.image(taskSvg, '100%', 4, 18, 18, 'res/milestone.png', {transform: 'translate(-9)'});
        }

    //link tool
        if (task.level>0) {
            svg.circle(taskSvg, '0', 14, 4, {class: 'taskLinkStartSVG linkHandleSVG', transform: 'translate(0)'});
            svg.circle(taskSvg, '100%', 14, 4, {class: 'taskLinkEndSVG linkHandleSVG', transform: 'translate(0)'});
        }
        return taskSvg;
    }
};
//
Ganttalendar.prototype.addTask = function (task) {
  //set new boundaries for gantt
    this.originalEndMillis = this.originalEndMillis > task.end ? this.originalEndMillis : task.end;
    this.originalStartMillis = this.originalStartMillis < task.start ? this.originalStartMillis : task.start;
};
//<%-------------------------------------- Gantt SVG元素 --------------------------------------%>
//'from' and 'to' are tasks already drawn
Ganttalendar.prototype.drawLink = function (from, to, type) {
    var self = this;
  //console.debug("drawLink")
    var peduncolusSize = 10;

  /**
   * Given an item, extract its rendered position
   * width and height into a structure.
   */
    function buildRect(item) {
        var p = item.ganttElement.position();
        var rect = {
            left: parseFloat(item.ganttElement.attr('x')),
            top: parseFloat(item.ganttElement.attr('y')),
            width: parseFloat(item.ganttElement.attr('width')),
            height: parseFloat(item.ganttElement.attr('height')),
        };
        return rect;
    }

  /**
   * The default rendering method, which paints a start to end dependency.
   */
    function drawStartToEnd(from, to, ps) {
        var svg = self.svg;

    //this function update an existing link
        function update() {
            var group = $(this);
            var from = group.data('from');
            var to = group.data('to');

            var rectFrom = buildRect(from);
            var rectTo = buildRect(to);

            var fx1 = rectFrom.left;
            var fx2 = rectFrom.left + rectFrom.width;
            var fy = rectFrom.height / 2 + rectFrom.top+8;

            var tx1 = rectTo.left;
            var tx2 = rectTo.left + rectTo.width;
            var ty = rectTo.height / 2 + rectTo.top+8;

            var tooClose = tx1 < fx2 + 2 * ps;
            var r = 0; //radius
            var arrowOffset = 5;
            var up = fy > ty;
            var fup = up ? -1 : 1;

            var prev = fx2 + 2 * ps > tx1;
            var fprev = prev ? -1 : 1;

            var image = group.find('image');
            var p = svg.createPath();

            if (tooClose) {
                var firstLine = fup * (rectFrom.height / 2 - 2 * r + 5);
                p.move(fx2, fy)
          .line(ps, 0, true)
          .arc(r, r, 90, false, !up, r, fup * r, true)
          .line(0, firstLine, true)
          .arc(r, r, 90, false, !up, -r, fup * r, true)
          .line(fprev * 2 * ps + (tx1 - fx2), 0, true)
          .arc(r, r, 90, false, up, -r, fup * r, true)
          .line(0, (Math.abs(ty - fy) - 4 * r - Math.abs(firstLine)) * fup - arrowOffset, true)
          .arc(r, r, 90, false, up, r, fup * r, true)
          .line(ps, 0, true);
                image.attr({x: tx1 - 5, y: ty - 5 - arrowOffset});

            } else {
                p.move(fx2, fy)
          .line((tx1 - fx2) / 2 - r, 0, true)
          .arc(r, r, 90, false, !up, r, fup * r, true)
          .line(0, ty - fy - fup * 2 * r + arrowOffset, true)
          .arc(r, r, 90, false, up, r, fup * r, true)
          .line((tx1 - fx2) / 2 - r, 0, true);
                image.attr({x: tx1 - 5, y: ty - 5 + arrowOffset});
            }

            group.find('path').attr({d: p.path()});
        }

    // create the group
        var group = svg.group(self.linksGroup, '' + from.id + '-' + to.id);
        svg.title(group, from.name + ' -> ' + to.name);

        var p = svg.createPath();

    //add the arrow
        svg.image(group, 0, 0, 4, 10, 'res/linkArrow.png');
    //create empty path
        svg.path(group, p, {class: 'taskLinkPathSVG'});

    //set "from" and "to" to the group, bind "update" and trigger it
        var jqGroup = $(group).data({from: from, to: to }).attr({from: from.id, to: to.id}).on('update', update).trigger('update');

        if (self.showCriticalPath && from.isCritical && to.isCritical) {jqGroup.addClass('critical');}

        jqGroup.addClass('linkGroup');
        return jqGroup;
    }

  /**
   * A rendering method which paints a start to start dependency.
   */
    function drawStartToStart(from, to) {
        console.error('StartToStart not supported on SVG');
        var rectFrom = buildRect(from);
        var rectTo = buildRect(to);
    }

    var link;
  // Dispatch to the correct renderer
    if (type == 'start-to-start') {
        link = drawStartToStart(from, to, peduncolusSize);
    } else {
        link = drawStartToEnd(from, to, peduncolusSize);
    }

    if (this.master.canWrite && (from.canWrite || to.canWrite)) {
        link.click(function (e) {
            var el = $(this);
            e.stopPropagation();// to avoid body remove focused
            self.element.find('.focused').removeClass('focused');
            $('.ganttSVGBox .focused').removeClass('focused');
            var el = $(this);
            if (!self.resDrop) {el.addClass('focused');}
            self.resDrop = false; //hack to avoid select

            $('body').off('click.focused').one('click.focused', function () {
                $('.ganttSVGBox .focused').removeClass('focused');
            });

        });
    }

};
//
Ganttalendar.prototype.redrawLinks = function () {
  //console.debug("redrawLinks ");
    var self = this;
    this.element.stopTime('ganttlnksredr');
    this.element.oneTime(60, 'ganttlnksredr', function () {

    //var prof=new Profiler("gd_drawLink_real");

    //remove all links
        $('#linksSVG').empty();

        var collapsedDescendant = [];

    //[expand]
        var collapsedDescendant = self.master.getCollapsedDescendant();
        for (var i = 0; i < self.master.links.length; i++) {
            var link = self.master.links[i];

            if (collapsedDescendant.indexOf(link.from) >= 0 || collapsedDescendant.indexOf(link.to) >= 0) {continue;}

            self.drawLink(link.from, link.to);
        }
    //prof.stop();
    });
};
//
Ganttalendar.prototype.reset = function () {
    this.element.find('.linkGroup').remove();
    this.element.find('[taskId]').remove();
};
// 重绘任务
Ganttalendar.prototype.redrawTasks = function () {
  // console.log("redrawTasks");
  //[expand]
    var collapsedDescendant = this.master.getCollapsedDescendant();
    var Garr=[];
  // console.log(this.master.tasks);
  
    for (var i = 0; i < this.master.tasks.length; i++) {
        var task = this.master.tasks[i];
        if (collapsedDescendant.indexOf(task) >= 0) {continue;}
        this.drawTask(task);
        Garr.push(task);
    // console.log(task.id+":"+task.name)
    }
    function ganttNameUpdata(){
        for (var i=0;i<Garr.length;i++){
            var taskID=Garr[i].id;
            var taskName=Garr[i].name;
            $.post(taskURL, {'id': taskID, 'name': taskName}).then(function(msg){
                console.log(msg);
            });
        }
    }

    function ganttSVGUpdata(){
        for (var s=0;s<Garr.length;s++){
            var taskID=Garr[s].id;
            var taskStart=new Date(Garr[s].start);
            var taskStart_Y=taskStart.getFullYear();
            var taskStart_M=taskStart.getMonth()+1;
            var taskStart_D=taskStart.getDate();
            var taskStartDate=taskStart_Y+'-'+taskStart_M+'-'+taskStart_D;

            var taskEnd=new Date(Garr[s].end);
            var taskEnd_Y=taskEnd.getFullYear();
            var taskEnd_M=taskEnd.getMonth()+1;
            var taskEnd_D=taskEnd.getDate();
            var taskEndDate=taskEnd_Y+'-'+taskEnd_M+'-'+taskEnd_D;
            console.log(taskStartDate+'--'+taskEndDate);
          // $.post(taskURL,{"id":taskID,"expect_start_time":taskStartDate,"expect_end_time":taskEndDate}).then(function(msg){
          //   console.log(msg)
          // })
        }

    }

    $('.gdfCell input').blur(function(){
    // ganttNameUpdata()
    });

    $('.taskBoxSVG').mouseleave(function(){
    // ganttSVGUpdata()
    });
};
// 刷新甘特图
Ganttalendar.prototype.refreshGantt = function () {
  // console.log('refreshGantt');
  // console.log(this.master.tasks);
  
    if (this.showCriticalPath) {
        this.master.computeCriticalPath();
    }
    var parent = this.element.parent();
    this.element.remove();
  //guess the zoom level in base of period
    if (!this.zoom) {
        var days = Math.round((this.originalEndMillis - this.originalStartMillis) / (3600 * 24));
        this.zoom = this.zoomLevels[days < 2 ? 0 : (days < 15 ? 1 : (days < 60 ? 2 : (days < 150 ? 3 : 4 ) ) )];
    }
    var domEl = this.create(this.zoom, this.originalStartMillis, this.originalEndMillis);
    this.element = domEl;
    parent.append(domEl);

    this.redrawTasks();
    parent.scrollTop(parent.scrollTop());
    parent.scrollLeft(parent.scrollLeft());
    this.synchHighlight();
};
//
Ganttalendar.prototype.fitGantt = function () {
    delete this.zoom;
    this.refreshGantt();
};
//
Ganttalendar.prototype.synchHighlight = function () {
    if (this.master.currentTask && this.master.currentTask.ganttElement) {this.highlightBar.css('top', parseInt(this.master.currentTask.ganttElement.attr('y')) + 'px');}
    //   this.highlightBar.css("top","45px");
};
//
Ganttalendar.prototype.centerOnToday = function () {
    var x = Math.round((Math.round(new Date().getTime()) - this.startMillis) * this.fx) - 30;
  //console.debug("centerOnToday "+x);
    this.element.parent().scrollLeft(x);
};

/**
 * Allows drag and drop and extesion of task boxes. Only works on x axis
 * @param opt
 * @return {*}
 */
 // SVG拖放
$.fn.dragExtedSVG = function (svg, opt) {

  //doing this can work with one svg at once only
    var target;
    var svgX;
    var rectMouseDx;

    var options = {
        canDrag: true,
        canResize: true,
        resizeZoneWidth: 15,
        minSize: 20,
        startDrag: function (e) {},
        drag: function (e) {},
        drop: function (e) {},
        startResize: function (e) {},
        resize: function (e) {},
        stopResize: function (e) {},
    };

    $.extend(options, opt);

    this.each(function () {
        var el = $(this);
        svgX = svg.parent().offset().left; //parent is used instead of svg for a Firefox oddity
        if (options.canDrag) {el.addClass('deSVGdrag');}//鼠标移动图标

        if (options.canResize || options.canDrag) {
            el.bind('mousedown.deSVG',
        function (e) {
            if ($(e.target).is('image')) {
                e.preventDefault();
            }

            target = $(this);
            var x1 = parseFloat(el.offset().left);

          //var x1 = parseFloat(el.attr("x"));
            var x2 = x1 + parseFloat(el.attr('width'));

            var posx = e.pageX;

            $('body').unselectable();

          //start resize
            var x = x2 - posx;
            if (options.canResize && (x >= 0 && x <= options.resizeZoneWidth)) {
            //store offset mouse x1
                rectMouseDx = x2 - e.pageX;
                target.attr('oldw', target.attr('width'));

                var one = true;

            //bind event for start resizing
                $(svg).bind('mousemove.deSVG', function (e) {

                    if (one) {
                //trigger startResize
                        options.startResize.call(target.get(0), e);
                        one = false;
                    }

              //manage resizing
                    var posx = e.pageX;
                    var nW = posx - x1 + rectMouseDx;

                    target.attr('width', nW < options.minSize ? options.minSize : nW);
              //callback
                    options.resize.call(target.get(0), e);
                });

            //bind mouse up on body to stop resizing
                $('body').one('mouseup.deSVG', stopResize);

            // start drag
            } else if (options.canDrag) {
            //store offset mouse x1
                rectMouseDx = parseFloat(target.attr('x')) - e.pageX;
                target.attr('oldx', target.attr('x'));

                var one = true;
            //bind event for start dragging
                $(svg).bind('mousemove.deSVG', function (e) {

                    if (one) {
                //trigger startDrag
                        options.startDrag.call(target.get(0), e);
                        one = false;
                    }

              //manage resizing
                    target.attr('x', rectMouseDx + e.pageX);
              //callback
                    options.drag.call(target.get(0), e);

                }).bind('mouseleave.deSVG', drop);

            //bind mouse up on body to stop resizing
                $('body').one('mouseup.deSVG', drop);

            }
        }

      ).bind('mousemove.deSVG',
        function (e) {
            var el = $(this);
            var x1 = el.offset().left;
            var x2 = x1 + parseFloat(el.attr('width'));
            var posx = e.pageX;

          //console.debug("mousemove", options.canResize && x2 - posx)
          //set cursor handle
            var x = x2 - posx;
            if (options.canResize && (x >= 0 && x <= options.resizeZoneWidth)) {
                el.addClass('deSVGhand');
            } else {
                el.removeClass('deSVGhand');
            }
        }

      ).addClass('deSVG');
        }
    });
    return this;

    function stopResize(e) {
        $(svg).unbind('mousemove.deSVG').unbind('mouseup.deSVG').unbind('mouseleave.deSVG');
    //if (target && target.attr("oldw")!=target.attr("width"))
        if (target) {options.stopResize.call(target.get(0), e);} //callback
        target = undefined;
        $('body').clearUnselectable();
    }

    function drop(e) {
        $(svg).unbind('mousemove.deSVG').unbind('mouseup.deSVG').unbind('mouseleave.deSVG');
        if (target && target.attr('oldx') != target.attr('x')) {options.drop.call(target.get(0), e);} //callback
        target = undefined;
        $('body').clearUnselectable();
    }

};
