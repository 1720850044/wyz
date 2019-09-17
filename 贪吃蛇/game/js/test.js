(function(doc){
    var Game = function () {
        this.doc = doc;
        this.arrText = ["简单难度" , "中等难度" , "困难难度" , "变态附体"];
    }
    Game.prototype = {
        init: function(){
            this.initTitileTpl();
            this.bindEvent();
        },
        initTitileTpl: function(){
            var oH1 = document.createElement('h1');
            oH1.innerHTML = "飛機大作戰";
            this.doc.appendChild(oH1);
            this.initPTpl();
        },
        initPTpl:function(){
            var frag = document.createDocumentFragment();
            this.arrText.forEach(function(val,index){
                var oP = document.createElement('p');
                oP.innerHTML = val;
                oP.className = index === 3 ? "diff bt" : "diff"; 
                frag.appendChild(oP);
            })
            this.doc.appendChild(frag);
        },
        bindEvent: function(){
            addEvent(this.doc,'click',this.start.bind(this));
        },
        start: function(e){
            var e = e || window.event,
                tar = e.target || e.srcElement;
            if(/^diff/.test(tar.className)){
                var idx = this.arrText.indexOf(tar.innerHTML);
                this.doc.innerHTML = "";
                this.plane(idx,e);
            }
        },
        plane: function(index,e){
            var oPlane = new Image();
            oPlane.width = 60;
            oPlane.height = 36;
            oPlane.src = "img/plane.png"
            oPlane.className = "plane";
            oPlane.style.left = pagePos(e).X - getElemDocPostion(this.doc).left - oPlane.width/2 + 'px';
            oPlane.style.top = pagePos(e).Y - getElemDocPostion(this.doc).top - oPlane.height/2 + 'px';
            this.doc.appendChild(oPlane);
            //飞机位置的边界
            var leftMax,leftMin,topMax,topMin;
            leftMin = -oPlane.width/2;
            leftMax = getStyles(doc,'width') - oPlane.width/2;
            topMin = 0;
            topMax = getStyles(doc,'height') - oPlane.height/2;
            //跟随鼠标移动  
            addEvent(document,'mousemove',function(e){   
                var left = pagePos(e).X - getElemDocPostion(doc).left - oPlane.width/2,
                    top = pagePos(e).Y - getElemDocPostion(doc).top - oPlane.height/2;          
                left = Math.max(left , leftMin);
                left = Math.min(left , leftMax);
                top = Math.max(top , topMin);
                top = Math.min(top , topMax);           
                oPlane.style.left = left + 'px';
                oPlane.style.top = top + 'px';
            });
            this.enemy(index,oPlane);
            this.planebiu(index,oPlane);
        },
        planebiu: function(index,oPlane){
            var biuTime = [200 , 300 , 350 , 13];
            oPlane.bTimer = setInterval(function(){
                var oBiu = new Image();
                oBiu.src = "img/bullet.png";
                oBiu.width = 6;
                oBiu.height = 22;
                oBiu.className = "biu";
                oBiu.style.left = getStyles(oPlane,'left') + oPlane.width/2 - oBiu.width/2 + 'px';
                oBiu.style.top = getStyles(oPlane,'top') - oBiu.height + 17 + 'px';
                doc.appendChild(oBiu);
                function m(){
                    oBiu.style.top = getStyles(oBiu,'top') - 17 + 'px';
                    if ( getStyles(oBiu,'top') <= -oBiu.height/2 ){
                        doc.removeChild(oBiu);
                    }else{
                        oBiu.timer = requestAnimationFrame(m);
                    }
                }
                oBiu.timer = requestAnimationFrame(m);
            },biuTime[index]);
        },
        enemy: function(index,oPlane){
            var eTime = [500,400,200,50], //生成的间隔
            boxW = getStyles(doc,'width'),
            boxH = getStyles(doc,'height');
            doc.timer = setInterval(function(){
                var oEnemy = new Image();
                oEnemy.src = "img/enemy.png";
                oEnemy.width = 23;
                oEnemy.height = 30;
                oEnemy.className = "enemy";
                oEnemy.style.top = -oEnemy.height + 'px';
                oEnemy.style.left = Math.random()*boxW - oEnemy.width/2 + 'px';
                console.log(111);
                doc.appendChild( oEnemy );
                oEnemy.speed = Math.random()*8+2;
                function m(){
                    oEnemy.style.top = getStyles(oEnemy,'top') + oEnemy.speed + 'px';
                    if(getStyles(oEnemy,'top') >= boxH){
                        doc.removeChild( oEnemy );
                    }else{
                        requestAnimationFrame(m);
                    }
                }
                requestAnimationFrame(m);
            },eTime[index])
        }
    }

    window.Game = Game;
})(document.getElementById('box'));

new Game().init();