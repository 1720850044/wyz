const imgSign = function (AllowEdit, vm) {
    let Data = [];
    (function ($, vm) {
        // console.log(vm);
        let cX, cY, indexId = 0, removeId, DOM;
        let signX, signY;
        let Rleft, Rtop, TVT, TnT;//需要删除的坐标
        jQuery.sign = {
            bindSign: function (dom, startLocation) {
                DOM = dom;
                defined(dom, startLocation);
            },
            loadingSign: function (data) {
                data = data || [];
                Data.concat(data);
                Data = Data.filter(item => item !== null);
                if (data && data.length > 0) {
                    loading(data);
                } else if (!Data || Data.length <= 0) {
                    $('.signIndex').remove();
                }
            },
            clearSign: (flag) => {
                if (flag) {
                    $(DOM).find('.signIndex').remove();
                    Data = [];
                }
            },
        };
        // document.oncontextmenu = function (e) {
        //     e.preventDefault();
        // };//阻止鼠标右键默认事件
        $(document).on('click', '.imgFocus img', function (e) {
            $('.inputSignBox').hide();
            e.stopPropagation();
        });

        function mouseUpShowSignBox (dom, startLocation) {
            if (AllowEdit && startLocation) {
                $('.inputSignBox').remove();
                $('.editSginDiv').hide();
                let l = startLocation.x;
                let t = startLocation.y;
                cX = l;
                cY = t;
                signX = l - 12;
                signY = t - 12;
                $(dom).append('<div class=\'inputSignBox\'></div>');
                $('.inputSignBox').append('<div class=\'sginBoxIcon\'></div>');
                $('.inputSignBox').append('<div class=\'signbox\' contenteditable=\'true\' id=\'inputText\' tabindex=\'-1\'><em id=\'deflutText\'></em></div>');
                $('.inputSignBox').append('<div class=\'signButton\'><span class=\'sureSign confirm-btn\'>标注</span><span class="outSignbox close-sign-box">取消</span></div>');
                $('.inputSignBox').css({'left': cX - 13, 'top': cY + 9});
                // e.stopPropagation();
            }
        }

        function defined (dom, startLocation) {
            mouseUpShowSignBox(dom, startLocation);
            //是否显示标记
            // if (!AllowEdit) {
            //     return;
            // }
            //鼠标双击
            // $(document).off('dblclick', dom).on('dblclick', dom, function (e) {
            //     $('.inputSignBox').remove();
            //     $('.editSginDiv').hide();
            //     let l = e.clientX - $(dom).offset().left;
            //     let t = e.clientY - $(dom).offset().top;
            //     cX = l;
            //     cY = t;
            //     signX = l - 12;
            //     signY = t - 12;
            //     $(dom).append('<div class=\'inputSignBox\'></div>');
            //     $('.inputSignBox').append('<div class=\'sginBoxIcon\'></div>');
            //     $('.inputSignBox').append('<div class=\'signbox\' contenteditable=\'true\' id=\'inputText\' tabindex=\'-1\'><em id=\'deflutText\'></em></div>');
            //     $('.inputSignBox').append('<div class=\'signButton\'><span class=\'sureSign confirm-btn\'>标注</span><span class="outSignbox close-sign-box">取消</span></div>');
            //     $('.inputSignBox').css({'left': cX - 13, 'top': cY + 9});
            //     e.stopPropagation();
            // });
            //添加编辑
            $(document).off('click', '#inputText').on('click', '#inputText', function () {
                $(this).focus();
                $('.signbox em').remove();
            });//编辑框聚焦
            $(document).off('click', '.outSignbox').on('click', '.outSignbox', function () {
                $('.inputSignBox').remove();
            });//退出编辑
            $(document).off('click', '.sureSign').on('click', '.sureSign', function () {
                if ($('.signbox em').length > 0) {
                    $('.inputSignBox').remove();
                } else if ($('.signbox').text().length <= 0) {
                    $('.inputSignBox').remove();
                } else {
                    indexId = Data.length + 1;
                    let text = $.trim($('.signbox').text());
                    $('.inputSignBox').remove();
                    $(dom).append('<div class=\'signIndex\' id=\'Ts' + indexId + '\' theSign=\'' + text + '\' data-index=\'' + indexId + '\'>' +
                        '<span class="index-num">' + indexId + '</span>' +
                        '<div class=\'hintBox\'' + 'title=' + text + '>' + text + '</div>' + '</div>');
                    $('#Ts' + indexId).css({'left': signX, 'top': signY});
                    let mes = {left: signX, top: signY, message: text, index: indexId};
                    let ToT = sessionStorage.totalNum;
                    let TuT = 1.1;
                    if (ToT > 0) {
                        //放大
                        for (let k = 0; k < ToT; k++) {
                            mes.left = Math.round(mes.left / TuT);
                            mes.top = Math.round(mes.top / TuT);
                        }
                        Data[Data.length] = mes;
                    } else if (ToT == undefined || ToT == 0) {
                        //原始尺寸
                        Data[Data.length] = mes;
                    } else if (ToT < 0) {
                        //缩小
                        for (let k = 0; k < Math.abs(ToT); k++) {
                            mes.left = Math.round(mes.left * TuT);
                            mes.top = Math.round(mes.top * TuT);
                        }
                        Data[Data.length] = mes;
                    }
                    sessionStorage.ImgData = JSON.stringify(Data);
                    vm.$store.commit('calculateSignSum', Data.length);
                }
            });
            //确认编辑
            $(document).off('mouseenter', '[id*=Ts]').on('mouseenter', '[id*=Ts]', function (e) {
                let m = $(this).attr('id').replace(/[^0-9]/ig, '');
                e.stopPropagation();
                removeId = m;
                $('.chooseBox').remove();
                Rleft = parseInt($(this).css('left'));
                Rtop = parseInt($(this).css('top'));
                TVT = $(this).find('.index-num').text();
                TnT = $.trim($(this).find('.hintBox').text());
                $(this).find('.hintBox').css('display', 'block');
                if (vm.isShowSignEnter) {
                    $(this).append('<div class=\'chooseBox\'><ul><li class=\'edit\' id=\'editSign\'></li><li id=\'deleteSign\'></li></ul></div>');
                    let hintBoxWidth = $(this).find('.hintBox').width();
                    $('.chooseBox').css({'left': (hintBoxWidth + 44) + 'px', 'top': -1 + 'px'});
                }
            });
            // 鼠標移出取消編輯
            $(document).off('mouseleave', '[id*=Ts]').on('mouseleave', '[id*=Ts]', function (e) {
                e.stopPropagation();
                $(this).find('.hintBox').css('display', 'none');
                $('.chooseBox').remove();
            });
            //弹出取消标记
            $(document).off('click', '#deleteSign').on('click', '#deleteSign', function () {
                $('#Ts' + removeId).remove();
                deleteData(TVT);
            });//删除标记

            //编辑标记
            $(document).off('click', '#editSign').on('click', '#editSign', function () {
                $('.inputSignBox').remove();
                $('.sginCanvas .editSginDiv').show().css({'top': Rtop + 'px', 'left': (Rleft + 30) + 'px'});
                $('.sginCanvas #sginText').focus().val(TnT);
            });

            // 关闭标记
            $('.sginCanvas .editSignbox').click(function () {
                $('.sginCanvas .editSginDiv').hide();
            });

            // 提交修改
            $('.sginCanvas .sginEditCommit').click(function () {
                let sgintxt = $('.sginCanvas #sginText').val();
                let signIndex = document.getElementsByClassName('signIndex');
                for (let k = 0; k < Data.length; k++) {
                    if (Data[k].index == TVT) {
                        Data[k].message = sgintxt;
                    }
                }
                sessionStorage.ImgData = JSON.stringify(Data);
                // 修改显示的文本
                for (let j = 0; j < signIndex.length; j++) {
                    if (signIndex[j].getAttribute('data-index') == TVT) {
                        signIndex[j].children[1].title = sgintxt;
                        signIndex[j].children[1].innerText = sgintxt;
                    }
                }
                $('.sginCanvas .editSginDiv').hide();
            });

            // $(document).click(function () {
            //     $('.chooseBox').remove();
            // });
            //点击消失
        }

        // 删除数据
        function deleteData (TVT) {
            let signNodes = document.querySelectorAll('#signx .signIndex');
            signNodes.forEach((item, index) => {
                item.id = 'Ts' + (index + 1);
                item.firstElementChild.innerHTML = index + 1;

            });
            for (let i = 0; i < Data.length; i++) {
                if (Data[i].index === parseInt(TVT)) {
                    Data.splice(i, 1);
                    Data.forEach((item, index) => {
                        item.index = (index + 1);
                    });
                    sessionStorage.ImgData = JSON.stringify(Data);
                    vm.$store.commit('calculateSignSum', Data.length);
                }
            }
        }

        // 加载数据
        function loading (data) {
            $('.signIndex').remove();
            if (data != null && data.length > 0) {
                data.forEach((item, index) => {
                    let signEle = '<div class="signIndex" id="Ts' + (index + 1) + '" theSign="' + item.message + '">' +
                        '<span class="index-num">' + (index + 1) + '</span>' +
                        '<div class="hintBox" title="' + item.message + '">' +
                        item.message +
                        '</div>' +
                        '</div>';
                    $(DOM).append(signEle);
                    $('#Ts' + (index + 1)).css({'left': item.left + 'px', 'top': item.top + 'px'});
                });

                // let l = Data.length;
                // for (let i = 0; i < data.length; i++) {
                //     // indexId++;
                //     $(DOM).append('<div class=\'signIndex\' id=\'Ts' + l + '\' theSign=\'' + data[i].message + '\'>' +
                //         '<span class="index-num">' + data.index + '</span>' +
                //         '<div class=\'hintBox\'' +
                //         'title=' + data[i].message + '>' +
                //         data[i].message + '</div>' + '</div>');
                //     $('#Ts' + l).css({'left': Number(data[i].left), 'top': Number(data[i].top)});
                //     // l++;
                // }
                // indexId = l;
            }

        }//载入数据
    })(jQuery, vm);
};
export {imgSign};
