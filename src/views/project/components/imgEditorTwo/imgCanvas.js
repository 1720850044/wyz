//canvas
const imgCanvas=(action, vm)=>{
    let cavs, cavT;
    let iMouse=false;
    let startT={x: 0, y: 0};

    function cavsTo(x, y){
        let cbox=cavs.getBoundingClientRect();
        return {x: x - cbox.left, y: y - cbox.top};
    }

    function canvasRun(){
        cavs = document.getElementById('cav');
        cavT = cavs.getContext('2d');
        // cavT.fillStyle='rgba(0,0,0,0.5)';
        // cavT.fillRect(0,0,canvasW,canvasH);
        if (action == 'true') {
            cavT.clearRect(0, 0, 10000, 10000);
        }
        cavs.onmouseup=function(e){
            // sessionStorage.ImgData=JSON.stringify(Data);
            iMouse=false;
            let canvas = cavs.getBoundingClientRect();
            let overAt = {
                x: e.clientX - canvas.left,
                y: e.clientY - canvas.top,
            };
            vm.imgdef(overAt);
        };
        cavs.onmouseout=function(e){
            iMouse=false;
        };

        cavs.onmousedown=function(e){
            iMouse=true;
            startT=cavsTo(e.clientX, e.clientY);
            let QAQ=sessionStorage.totalNum;
            let i=1.1;
            if (QAQ>0){
                // 放大
                for (let k=0;k<QAQ;k++){
                    startT.x=startT.x/i;
                    startT.y=startT.y/i;
                }
            } else if (QAQ<0){
                //缩小
                for (let k=0;k<Math.abs(QAQ);k++){
                    startT.x=startT.x*i;
                    startT.y=startT.y*i;
                }
            }
        };
        cavs.onmousemove=function(e){
            if (iMouse){
                // 监听确认标记
                vm.$bus.emit('moveEdit');
                let stopT=cavsTo(e.clientX, e.clientY);
                let QAQ=sessionStorage.totalNum;
                let i=1.1;
                if (QAQ>0){
                    // 放大
                    for (let k=0;k<QAQ;k++){
                        stopT.x=stopT.x/i;
                        stopT.y=stopT.y/i;
                    }
                } else if (QAQ<0){
                    //缩小
                    for (let k=0;k<Math.abs(QAQ);k++){
                        stopT.x=stopT.x*i;
                        stopT.y=stopT.y*i;
                    }
                }
                cavT.beginPath();
                cavT.lineWidth = '3';
                cavT.strokeStyle = '#e43';
                cavT.moveTo(startT.x, startT.y);
                cavT.lineTo(stopT.x, stopT.y);
                cavT.lineJoin = 'round';
                cavT.lineCap = 'round';
                cavT.stroke();
                startT=stopT;
            }
        };
    }

    canvasRun();
};
export {imgCanvas};
