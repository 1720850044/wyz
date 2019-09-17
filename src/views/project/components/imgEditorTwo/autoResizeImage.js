const AutoResizeImage = (maxWidth, maxHeight, objImg) => {
    let img = new Image();
    img.src = objImg.src;
    let hRatio;
    let wRatio;
    let ratio = 1;
    let returnW = img.width;
    let returnH = img.height;
    wRatio = maxWidth / returnW;
    hRatio = maxHeight / returnH;

    // New calculation ratio
    if (maxWidth > 0 && maxHeight === 0) {
        ratio = wRatio;
    }
    if (maxWidth === 0 && maxHeight > 0) {
        ratio = hRatio;
    }
    if (maxWidth > 0 && maxHeight > 0) {
        ratio = wRatio || hRatio;
    }
    if (wRatio > 1 || hRatio > 1) {
        ratio = 1;
    }

    returnW = parseInt(returnW * ratio);
    returnH = parseInt(returnH * ratio);

    objImg.height = returnH;
    objImg.width = returnW;

    let objWH = {
        width: returnW,
        height: returnH,
    };
    return objWH;
};
export {AutoResizeImage};
