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

//生成爆炸图片
function createBoom( obj , i ,oBox) {
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
    },i == 2 ?1500:500);
}