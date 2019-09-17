window.onload = function(){
    init();
}

function init(){
    initCourseList();
}

var initCourseList = (function (){
    var oBtnGroup = document.getElementsByClassName("btn-group")[0],//下面按钮组div
        oBtnItems = document.getElementsByClassName("btn-item"),//每一个按钮1 2 3 4
        oList = document.getElementsByClassName("js-list")[0],//ul
        oTpl = document.getElementById("J-itemTpl").innerHTML,//模板li获取
        oLoading = document.getElementsByClassName("loading")[0],//加载loading
        page = 0,//页数
        t = null,//时间
        cache = {};//缓存
    function init(){
        getAjaxCourses(page);//ajax
        bindEvent(); 
    }
    function render(data){
        var list = '',
            len = data.length,
            item;
        for(var i=0;i<len;i++){
            item = data[i];
            list += setTplToHTML(oTpl,regTpl,{
                folder: item.folder,
                classname: item.classname,
                name: item.name,
                watched: item.watched
            });
        }
        oList.innerHTML = list;
    }
    function bindEvent(){
        addEvent(oBtnGroup,'click',btnClick);
    }

    function btnClick(e){
        var e = e || window.event,
            tar = e.target || e.srcElement,
            oParent = tar.parentNode,
            className = oParent.className,
            indexof = Array.prototype.indexOf,
            thisIdx = -1;
        if(className === 'btn-item'){
            thisIdx = indexof.call(oBtnItems,oParent);
            var len = oBtnItems.length,
                item;
            page = thisIdx;
            // if(cache[page]){
            //     getCacheCourses();
            // }else{
            //     getAjaxCourses(); 
            // }
            //console.log(cache);
            cache[page] ? getCacheCourses() : getAjaxCourses();
            //getAjaxCourses();
            for(var i = 0;i<len;i++){jj
                item = oBtnItems[i];
                item.className = "btn-item";
            }
            oParent.className += " cur";
            
        }
    }

    function getAjaxCourses(){
        ajaxReturn({
            url: APIs.getCourses,
            data: {
                page: page
            },
            success: function(data){
                //console.log(data);
                cache[page] = data;
                oLoading.style.display = 'block';
                t = setTimeout(function(){
                    render(data);
                    oLoading.style.display = 'none';
                },500)
            },
            error: function(){
                alert("失败");
            }
        });
    }
    function getCacheCourses(){
        var data = cache[page];
        render(data);
    }
    return function(){
        init();
    }
})();
var APIs = {
    getCourses: 'http://study.lfclass.com/Index/getCourses'
};
function ajaxReturn(opt){
    $.ajax({
        url: opt.url,
        type: 'POST',
        dataType: 'JSON',
        data: opt.data,
        timeout: 100000,
        success: opt.success,
        error: opt.error
    });
}

function setTplToHTML(tpl,regExp,opt){
    return tpl.replace(regExp(),function(node,key){
        //console.log(node,key);
        return opt[key];
    });
}
function regTpl(){
    return new RegExp(/{{(.*?)}}/,'gim')
}