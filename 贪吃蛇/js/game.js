window.onload = function(){
    init();
}
function init(){
    initDatas();
}

var initDatas = (function (){
    var oBox = document.getElementById("box");
    function getDatas(){                       
        initGame();
    } 
    function initGame(){
        var oH1 = document.createElement("h1"),
            oP, 
            e = e || window.event, 
            frag = document.createDocumentFragment(),                  
            arrTxt = ["简单难度" , "中等难度" , "困难难度" , "变态附体"];
        oH1.innerHTML = "飞机大战v5.0";
        oBox.appendChild( oH1 );
        for (var i = 0; i < 4; i++) {
             oP = document.createElement("p");
             oP.className = i===3?"diff bt":"diff";
             oP.innerHTML = arrTxt[i];            
             (function (j){
                addEvent(oP,'click',function(e){            
                    start(j,e);
                });  
             })(i);
                                
             frag.appendChild( oP );                         
        }
        oBox.appendChild( frag );
    } 

    function  start(index,e){
        oBox.innerHTML = "";
        enemy(index , plane(e,index));//执行生成敌军的函数
        score(); //积分器
    } 
    //积分
    function score(){
        oBox.score = 0;
        var oSpan = document.createElement("span");
        oSpan.className = "score";
        oSpan.innerHTML = oBox.score;
        oBox.appendChild(oSpan);
    }
    function plane(e,index){
        //生成飞机图片
        var oPlane = new Image();
        oPlane.src = "img/plane.png";
        oPlane.width = 60;
        oPlane.height = 36;
        oPlane.className = 'plane';
        oPlane.style.left = pagePos(e).X - getElemDocPostion(oBox).left - oPlane.width/2 + 'px';
        oPlane.style.top = pagePos(e).Y - getElemDocPostion(oBox).top - oPlane.width/2 + 'px';
        oBox.appendChild(oPlane);
        //飞机位置的边界
        var leftMax,leftMin,topMax,topMin;
        leftMin = -oPlane.width/2;
        leftMax = getStyles(oBox,'width') - oPlane.width/2;
        topMin = 0;
        topMax = getStyles(oBox,'height') - oPlane.height/2;
        //跟随鼠标移动 
             
        addEvent(document,'mousemove',function(e){       
            var left = pagePos(e).X - getElemDocPostion(oBox).left - oPlane.width/2,
                top = pagePos(e).Y - getElemDocPostion(oBox).top - oPlane.width/2;           
            left = Math.max(left , leftMin);
            left = Math.min(left , leftMax);
            top = Math.max(top , topMin);
            top = Math.min(top , topMax);           
            oPlane.style.left = left + 'px';
            oPlane.style.top = top + 'px';
        });
        planebiu(oPlane,index);//我军子弹
        return oPlane; 
    }  
    //我军子弹
    function planebiu(oPlane,index){
        
        var biuTime = [200 , 300 , 350 , 13];
        oPlane.bTimer = setInterval(function () {
            var oBiu = new Image();
            oBiu.src = "img/bullet.png";
            oBiu.width = 6;
            oBiu.height = 22;
            oBiu.className = "biu";
            oBiu.style.left = getStyles(oPlane,'left') + oPlane.width/2 - oBiu.width/2 + 'px';
            oBiu.style.top = getStyles(oPlane,'top') - oBiu.height + 17 + 'px';
            //console.log(oPlane.offsetLeft);
            //console.log(getStyles(oPlane,'left'));
            oBox.appendChild(oBiu);
            function m(){
                oBiu.style.top = getStyles(oBiu,'top') - 17 + 'px';
                if ( getStyles(oBiu,'top') <= -oBiu.height/2 ){
                    oBox.removeChild(oBiu);
                }else{
                    oBiu.timer = requestAnimationFrame(m);
                }
            }
            oBiu.timer = requestAnimationFrame(m);
        },biuTime[index]);
    }
    //生成敌军+碰撞检测
    function enemy(index , oPlane){
        var eTime = [500,400,200,50], //生成的间隔
            boxW = getStyles(oBox,'width'),
            boxH = getStyles(oBox,'height');
        oBox.timer = setInterval(function(){
            //生成敌军
            var oEnemy = new Image();
            oEnemy.src = "img/enemy.png";
            oEnemy.width = 23;
            oEnemy.height = 30;
            oEnemy.className = "enemy";
            oEnemy.style.top = -oEnemy.height + 'px';
            oEnemy.style.left = Math.random()*boxW - oEnemy.width/2 + 'px';
            oBox.appendChild( oEnemy );
            oEnemy.speed = Math.random()*8+2;
        function m(){
            oEnemy.style.top = getStyles(oEnemy,'top') + oEnemy.speed + 'px';
            if(getStyles(oEnemy,'top') >= boxH){
                oBox.removeChild( oEnemy );
            }else{
                //和所有子弹的碰撞检测
                var allBiu = oBox.getElementsByClassName("biu");
                for (var i = 0,length=allBiu.length; i < length; i++) {
                    if ( coll(oEnemy , allBiu[i]) ){
                        //移除子弹
                        cancelAnimationFrame(allBiu[i].timer);
                        oBox.removeChild(allBiu[i]);
                        //生成爆炸图片
                        createBoom(oEnemy , "");
                        //移除敌军
                        oBox.removeChild(oEnemy);
                        //积分
                        oBox.getElementsByClassName("score")[0].innerHTML = ++oBox.score;
                        return;
                    }
                }
                //和我军的碰撞
                if ( oPlane.parentNode && coll( oEnemy , oPlane ) ){
                    clearInterval(oPlane.bTimer); //停止子弹发射
                    clearInterval(oBox.timer); //停止敌军生成
                    //生成爆炸图片
                    createBoom(oEnemy , "");
                    createBoom(oPlane , "2");
                    //移除敌军/我军
                    oBox.removeChild(oEnemy);
                    oBox.removeChild(oPlane);
                    //解除鼠标移动事件
                    document.onmousemove = null;
                    
                    return;
                }
                oEnemy.parentNode && requestAnimationFrame(m);
            }
        }
        requestAnimationFrame(m);
        },eTime[index])
    }
    //游戏结束
    function over() {
        oBox.innerHTML = "";
        var oDiv = document.createElement("div");
        oDiv.className = "over";
        oDiv.innerHTML = "<h2>Game Over</h2>" +
            "<p class='showScore'>您的最终得分是：</p>" +
            "<p class='scoreTxt'><span>"+oBox.score+"</span> 分</p>";
        var oBtn = document.createElement("div");
        oBtn.className = "reStart";
        oBtn.innerHTML = "重新开始";        
        addEvent(oBtn,'click',function(){
            //console.log(1);
            initGame();
        });
        oDiv.appendChild(oBtn);
        oBox.appendChild(oDiv);
    }
    //生成爆炸图片
    function createBoom( obj , i ) {
        var oEnemyBoom = new Image();
        oEnemyBoom.src = "img/boom"+i+".png";
        oEnemyBoom.width = obj.width;
        oEnemyBoom.height = obj.height;
        oEnemyBoom.className = "boom";
        oEnemyBoom.style.top = getStyles(obj,'top') + 'px';
        oEnemyBoom.style.left = getStyles(obj,'left') + 'px';
        oBox.appendChild(oEnemyBoom);
        setTimeout(function () {
            oEnemyBoom.parentNode && oBox.removeChild(oEnemyBoom);
            i && over();
        },i?1500:500);
    }

    //碰撞检测
    function coll(obj1 , obj2){
        var T1 = getStyles(obj1,'top'),
            B1 = T1 + getStyles(obj1,'height'),
            L1 = getStyles(obj1,'left'),
            R1 = L1 + getStyles(obj1,'width');

        var T2 = getStyles(obj2,'top'),
            B2 = T2 + getStyles(obj2,'height'),
            L2 = getStyles(obj2,'left'),
            R2 = L2 + getStyles(obj2,'width');

        return !(R1 < L2 || B1 < T2 || L1 > R2 || T1 > B2);

    }

    return function(){
        getDatas();       
    }
})();