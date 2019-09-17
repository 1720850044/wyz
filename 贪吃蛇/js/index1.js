
window.onload = function(){
    render();
}
function render(){
    var jsonData = document.getElementById("J_data").innerHTML,//
        tpl = document.getElementById("J_tpl").innerHTML,//模板
        data = JSON.parse(jsonData),
        len = data.length,
        oList = document.getElementsByClassName("js-list")[0],
        list = '',
        item;
    //console.log(tpl);
    for(var i = 0;i<len;i++){
        item = data[i];
        list += setTplToHTML(tpl,regTpl,{
            career: item.career,
            city: item.city,
            salary: item.salary,
            img: item.img
        });
    }
    oList.innerHTML = list;
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