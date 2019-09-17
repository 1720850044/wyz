function addEvent(el, type, fn){
    if(el.addEventListener){
        el.addEventListener(type, fn, false);
    }else if(el.attachEvent){
        el.attachEvent('on' + type, function(){
            fn.call(el);
        })
    }else{
        el['on' + type] = fn;
    }
  }

function removeEvent(el,type,fn){
    if(el.addEventListener){
        el.removeEventListener(type,fn,false);
    }else if(el.attachEvent){
        el.detachEvent('on'+type,fn);
    }else{
        el['on' + type] = null;
    }
}

function cancelBubble(e){
    //console.log('cancelBubble')
    var e = e || window.event;
    if(e.stopPropagation){
      e.stopPropagation();
    }else{
      e.cancelBubble = true;
    }      
  }
  
  function preventDefaultEvent(e){
    var e = e || window.event;
    if(e.preventDefault){
      event.preventDefault();
    }else{
      event.returnValue = false;
    }
  }

  function getScrollOffset(){
      if(window.pageXOffset){
        return {
            left: window.pageXOffset,
            top: window.pageYOffset
        }
      }else{
          return {
              left: document.body.scrollLeft + document.documentElement.scrollLeft,
              top: document.body.scrollTop + document.documentElement.scrollTop
          }
      }
  }

  function pagePos(e){
    var sLeft = getScrollOffset().left,
        sTop = getScrollOffset().top,
        cLeft = document.documentElement.clientLeft || 0,
        cTop = document.documentElement.clientTop || 0;

    return {
        X: e.clientX + sLeft - cLeft,
        Y: e.clientY + sTop - cTop
    }
  }

  function getStyles(elem,prop){
    if(window.getComputedStyle){
        if(prop){
            return parseInt(window.getComputedStyle(elem,null)[prop]);
        }else{
            return window.getComputedStyle(elem,null);
        }
    }else{
        if(prop){
            return parseInt(elem.currentStyle[prop]);
        }else{
            return elem.currentStyle;
        }
    }
  }

  function getViewportSize(){
    if(window.innerWidth){
      return{
        width: window.innerWidth,
        height: window.innerHeight
      }
    }else{
      if(document.compatMode === 'BackCompat'){
        return {
          width: document.body.clientWidth,
          height: document.body.clientHeight
        }
      }else{
        return {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight
        }
      }
    }
  }

  function getElemDocPostion(el){
      var parent = el.offsetParent,
          offsetLeft = el.offsetLeft,
          offsetTop = el.offsetTop;
      while(parent){
        offsetLeft += parent.offsetLeft;
        offsetTop += parent.offsetTop;
        parent = parent.offsetParent;
      }
      return {
          left: offsetLeft,
          top: offsetTop
      }
  }