import store from '@/store/index';
// 截屏粘贴功能模块
const screenshot = function () {
    var imgReader = function (item) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        const temp = randomChar(6) + '.png';
        uploader.addFile(blob, temp);
        store.state.blob = true;
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img['class'] = 'img_screenshot';
            img.style.maxWidth = '400px';
            document.getElementById('testInput').appendChild(img);
        };
        reader.readAsDataURL(blob);
    };
    document.getElementById('testInput').addEventListener('paste', function (e) {
        const clipboardData = e.clipboardData; // 谷歌
        var items = [];
        var item = [];
        var types = [];
        if (clipboardData) {
            items = clipboardData.items;
            if (!items) {
                return;
            }
            item = items[0];
            types = clipboardData.types || [];
            for (let i = 0; i < types.length; i++) {
                if (types[i] === 'Files') {
                    item = items[i];
                    break;
                }
            }
            if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
                imgReader(item);
            }
        }
    }, false);
};
function randomChar(l) {
    const x='0123456789qwertyuioplkjhgfdsazxcvbnm';
    var tmp='';
    var timestamp = new Date().getTime();
    for (var i = 0; i < l; i++) {
        tmp+= x.charAt(Math.ceil(Math.random()*100000000)%x.length);
    }
    return timestamp+tmp;
}
export {
  screenshot,
};
