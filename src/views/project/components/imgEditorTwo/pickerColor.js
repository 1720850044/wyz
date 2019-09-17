const pickerImgColor = (type) => {
    (function ($) {
        $('#canvasPickerColor').remove();
        $.fn.pickerColor = function (option) {
            let opt = {
                callback: function () {
                },
            };
            let _this = this;
            opt = $.extend(opt, option);
            _this.off('click').on('click', function (e) {
                let imgData;
                if (type === 'img') {
                    $('#canvasPickerColor').remove();
                    let pickerCanvas = '<canvas id="canvasPickerColor" style="position: fixed;left: 200px;top:55px;z-index: 9999;"></canvas>';
                    let imgEle = document.getElementById('oImg');
                    $('body').append(pickerCanvas);
                    let cvs = document.getElementById('canvasPickerColor');
                    let ctx = cvs.getContext('2d');
                    cvs.height = 1;
                    cvs.width = 1;
                    let osX = e.offsetX, osY = e.offsetY;
                    ctx.drawImage(imgEle, osX, osY, 1, 1, 0, 0, 1, 1);
                    imgData = ctx.getImageData(0, 0, 1, 1);
                }
                if (type === '3d') {
                    // let canvasX = e.offsetX;
                    // let canvasY = e.offsetY;
                    // let cvs = _this[0].getContext('2d');
                    // imgData = cvs.getImageData(canvasX, canvasY, 1, 1);
                }
                if (opt.callback) {opt.callback(imgData.data[0] + ',' + imgData.data[1] + ',' + imgData.data[2]);}
            });
        };
    })(jQuery);
};
export {pickerImgColor};
