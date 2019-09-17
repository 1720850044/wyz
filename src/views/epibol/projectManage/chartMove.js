
const runMove=(style)=>{
    let oBox = document.getElementById('move');
    let nBox = document.getElementsByClassName('chartNav')[0];
    let mBox = document.getElementsByClassName('MchartNav')[0];
    let containers = document.getElementsByClassName('chartNavBox')[0] || document.getElementsByClassName('chartNavBoxMonth')[0];
    let oldX = null ;
    oBox.onmousedown = function(e){
        var oEvent =e || window.event,
            disL = oEvent.clientX - oBox.offsetLeft;

        document.onmousemove = function(e){
            let cWidth = containers.clientWidth;
            console.log('cWidth', cWidth);
            var oEvent = e || window.event,
                disX = oEvent.clientX - disL;
            oBox.style.cursor='pointer';
            if (style=='week'){

                if (oldX>disX && oldX !== null){
                    console.log('左滑');
						// if((-disX)>nBox.clientWidth-cWidth){
						// 	return false;
						// }
                } else {
                    console.log('右滑动');
						// if(disX>100  && oldX !== null){
						// 	return false;
						// }
                }
                oBox.style.left = disX + 'px';
                nBox.style.left = disX + 'px';
                oldX = disX;
            } else if (style=='month'){

                if (oldX>disX && oldX !== null){ //左滑
                    if ((-disX)>mBox.clientWidth-cWidth) {return false;}
                } else { //右滑
                    if (disX>100 && oldX !== null) {return false;}
                }
                oBox.style.left = disX + 'px';
                mBox.style.left = disX + 'px';
                oldX = disX;
            }
        };
        return false;
    };
    document.onmouseup = function(){
        document.onmousemove = null;
        oBox.style.cursor='default';
    };
    document.onmouseout=function(){
        document.onmousemove = null;
        oBox.style.cursor='default';
    };

};
const initW=(val, style)=>{
    let num=null;
    let oBox = document.getElementById('move');
    let nBox = document.getElementsByClassName('chartNav')[0];
    let mBox = document.getElementsByClassName('MchartNav')[0];
    let oRangeW= document.getElementById('range').clientWidth/4;
	//if(nBox.style.left>0){return false;}
    if (style=='week'){
        num=20;
        oBox.style.left = -((val*num)-oRangeW) + 'px';
        nBox.style.left = -((val*num)-oRangeW) + 'px';
    } else if (style=='month'){
        num=10;
        oBox.style.left = -((val*num)-oRangeW) + 'px';
        mBox.style.left = -((val*num)-oRangeW) + 'px';
    }

};
export {runMove, initW};
