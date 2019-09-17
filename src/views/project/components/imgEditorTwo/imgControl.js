const canvasControl = () => {
    let oSign = document.getElementById('signx');
    let oCanvas = document.getElementById('cav');
    let oImg = document.getElementById('oImg');
    let controlDiv = document.getElementsByClassName('oControl')[0];
    let imgFocus = document.querySelector('.imgFocus');

    let addEvent = (obj, sType, fn) => {
        if (obj.addEventListener) {
            obj.addEventListener(sType, fn, false);
        } else {
            obj.attachEvent('on' + sType, fn);
        }
    };

    let removeEvent = (obj, sType, fn) => {
        if (obj.removeEventListener) {
            obj.removeEventListener(sType, fn, false);
        } else {
            obj.detachEvent('on' + sType, fn);
        }
    };

    let prEvent = (ev) => {
        let oEvent = ev || window.event;
        if (oEvent.preventDefault) {
            oEvent.preventDefault();
        }
        return oEvent;
    };

    let addWheelEvent = (obj, callback) => {
        if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
            addEvent(obj, 'DOMMouseScroll', wheel);
        } else {
            addEvent(obj, 'mousewheel', wheel);
        }

        function wheel (ev) {
            let wEvent = prEvent(ev);
            let delta = wEvent.detail ? wEvent.detail > 0 : wEvent.wheelDelta < 0;
            callback && callback.call(wEvent, delta);
            return false;
        }
    };
    let osi = 0;
    addEvent(controlDiv, 'mousedown', function (ev) {
        // 初始化坐标
        let osiTop = oSign.offsetTop;
        let osiLeft = oSign.offsetLeft;
        oSign.style.marginLeft = '';
        oSign.style.marginTop = '';
        if (osi == 0) {
            oSign.style.left = osiLeft + 'px';
            oSign.style.top = osiTop + 'px';
            osi++;
        }
        // 坐际赋值方法
        let oEvent = prEvent(ev);
        let oParent = oSign.parentNode;
        let disX = oEvent.clientX - oSign.offsetLeft;
        let disY = oEvent.clientY - oSign.offsetTop;
        let startMove = function (ev) {
            if (oParent.setCapture) {
                oParent.setCapture();
            }
            let oEvent = ev || window.event;
            let l = oEvent.clientX - disX;
            let t = oEvent.clientY - disY;
            // console.log(l,t)

            // divMove
            oSign.style.left = l + 'px';
            oSign.style.top = t + 'px';

            oParent.onselectstart = function () {
                return false;
            };
        };

        // 释放方法
        let endMove = function (ev) {
            if (oParent.releaseCapture) {
                oParent.releaseCapture();
            }
            oParent.onselectstart = null;
            removeEvent(oParent, 'mousemove', startMove);
            removeEvent(oParent, 'mouseup', endMove);
        };
        addEvent(oParent, 'mousemove', startMove);
        addEvent(oParent, 'mouseup', endMove);
        return false;
    });

    // 放大缩小方法
    let restrict = 1.1;
    let totalNum = 0;
    addWheelEvent(controlDiv, function (delta) {
        // 初始化坐标
        let osiTop = oSign.offsetTop;
        let osiLeft = oSign.offsetLeft;
        oSign.style.marginLeft = '';
        oSign.style.marginTop = '';
        if (osi == 0) {
            oSign.style.left = osiLeft + 'px';
            oSign.style.top = osiTop + 'px';
            osi++;
        }
        // 坐标点
        // let ratioL = (this.clientX - oSign.offsetLeft) / oSign.offsetWidth;
        // let ratioT = (this.clientY - oSign.offsetTop) / oSign.offsetHeight;
        let sginDiv = document.getElementsByClassName('signIndex');
        // let ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1;
        let w, h;
        if (!delta) {
            // 放大
            totalNum++;
            w = Math.round(oSign.offsetWidth * restrict);
            h = Math.round(oSign.offsetHeight * restrict);
            if (sginDiv.length > 0) { //标记点放大
                for (let i = 0; i < sginDiv.length; i++) {
                    sginDiv[i].style.left = Math.round(parseInt(sginDiv[i].style.left) * restrict) + 'px';
                    sginDiv[i].style.top = Math.round(parseInt(sginDiv[i].style.top) * restrict) + 'px';
                }
            }
        } else {
            // 缩小
            totalNum--;
            w = Math.round(oSign.offsetWidth / restrict);
            h = Math.round(oSign.offsetHeight / restrict);
            if (sginDiv.length > 0) { //标记点缩小
                for (let i = 0; i < sginDiv.length; i++) {
                    sginDiv[i].style.left = Math.round(parseInt(sginDiv[i].style.left) / restrict) + 'px';
                    sginDiv[i].style.top = Math.round(parseInt(sginDiv[i].style.top) / restrict) + 'px';
                }
            }
        }
        // 缓存计数器
        sessionStorage.totalNum = totalNum;

        // 当画布大于容器
        let containerWidth = imgFocus.clientWidth;
        let containerHeight = imgFocus.clientHeight;
        oSign.style.left = (containerWidth - w) / 2 + 'px';
        oSign.style.top = (containerHeight - h) / 2 + 'px';

        // let l = Math.round(this.clientX - (w * ratioL));
        // let t = Math.round(this.clientY - (h * ratioT));

        // imgChange
        oImg.style.width = w + 'px';
        oImg.style.height = h + 'px';
        // oImg.style.left = l + 'px';
        // oImg.style.top = t + 'px';

        // divChange
        oSign.style.width = w + 'px';
        oSign.style.height = h + 'px';
        // oSign.style.left = l + 'px';
        // oSign.style.top = t + 'px';

        // canvasChange
        oCanvas.style.width = w + 'px';
        oCanvas.style.height = h + 'px';
        // oCanvas.style.left=l +'px';
        // oCanvas.style.top=t +'px';

        controlDiv.style.width = w + 'px';
        controlDiv.style.height = h + 'px';
    });
};
export {canvasControl};
