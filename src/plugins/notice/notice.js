// position 通知框定位
// left-top 提示框出现在左上角
// left-bottom 提示框出现左下角
// right-top 提示框出现在右上角
// right-bottom 提示框出现在右下角
// remindtype 通知类型
// remindtype: '1' 为项目通知
// remindtype: '2' 任务通知
// remindtype: '3' 投标通知
// remindtype: '4' 为邀请通知
// remindtype: '5' 为合同通知
// imgUrl 为null 或 '' 为默认
// remindtype为 null 或 '' 为默认通知
// 默认是出现在中
function ymywindow(_object,vm,eventData){
    if (window.Notification) {
      // var button = document.getElementById('button'), text = document.getElementById('text');
      var popNotice = function() {
          if (Notification.permission == "granted") {
              var notification = new Notification(`${_object.title}`, {
                  body: _object.message.split('。')[0],
                  icon: _object.message.split('。')[1]
              });
              notification.onclick = function() {
                console.log('消息通知显示的内容',_object);
                console.log('点击通知栏跳转',JSON.stringify(eventData));
                if(eventData.type === 'project'){
                    // vm.$router.push({path: eventData.href,query: { id:eventData.id}});
                    sessionStorage.projectID = eventData.id;
                }
                  vm.$router.push({path: eventData.href})
                // else if(eventData.type === 'task'){
                //     vm.$router.push({path: eventData.href})
                // } else if(eventData.type === 'bid'){
                //     vm.$router.push({path: eventData.href,});
                // } else if(eventData.type === 'other'){
                //     vm.$router.push({path:eventData.href});
                // }


                  // text.innerHTML = '张小姐已于' + new Date().toTimeString().split(' ')[0] + '加你为好友！';
                  notification.close();
              };
              notification.onerror = function (err) {
                console.log('出错了，小伙子在检查一下吧');
                throw err;
            }
          }
      }
      // button.onclick = function() {
          if (Notification.permission == "granted") {
              popNotice();
          } else if (Notification.permission != "denied") {
              Notification.requestPermission(function (permission) {
                popNotice();
              });
          }
      // };
  } else {
      alert('浏览器不支持Notification');
  }
 }
  function ymNotice(_objects) {
    var className = ''
    var remindText = ''
    var messageRight = ''
    var imgClass = '' // 显示图标所用
    if (_objects) {
      const remind = Number(_objects.remindtype)
      if (remind === 1) {
        remindText = '项目通知'
      } else if (remind === 2) {
        remindText = '任务通知'
      } else if (remind === 3) {
        remindText = '投标通知'
      } else if (remind === 4) {
        remindText = '邀请通知'
      } else if (remind === 5) {
        remindText = '合同通知'
      } else {
        remindText = '提醒'
      }
    } else {
      remindText = '提醒'
    }
    if (_objects.position != null && _objects.position != '') {
      className = _objects.position
    } else {
      className = 'center'
    }
    if (!_objects.imgUrl) {
      imgClass = 'body-box-hidden'
      messageRight = 'message_bodys'
    } else {
      imgClass = 'body-box-show'
      messageRight = 'message_body'
    }
    const _boxString = `<div class='notice_box'>
    <p class='close_label'>x</p>
    <div class='top_left_box'>
    <p class='top_left_notice'>${remindText}</p>
    </div>
    <div class='clearfix body-box'>
      <div class='msg_img_box ${imgClass}'>
       <img src='${_objects.imgUrl}'>
      </div>
      <div class='${messageRight}'>
        <p>${!_objects.title ? '' : _objects.title}</p>
        <p>${!_objects.message ? '' : _objects.message}</p>
        <p class='chat_class'>查看</p>
      </div>
    </div>
    <p class='time_real'>刚刚</p>
    </div>`;
    const centents = document.createElement('div') // body下添加一个div
    centents.setAttribute('class', `nitice_box_all ${className}`) // 给这个元素添加class
    centents.innerHTML = _boxString // 插入这个元素
    document.body.appendChild(centents) // 添加到body元素里面
    getLook() // 添加点击事件
    if (className == 'left-bottom' || className == 'right-bottom') {
      leftBottom(className)
      closeLabel(className)
    }
    if (className == 'left-top' || className == 'right-top') {
      leftTop(className)
      closeLabel(className)
    }
 }
// 查看添加事件
function getLook () {
  const documents = document.getElementsByClassName('chat_class')[0]
  documents.addEventListener('click', function() {
    window.open('https://www.baidu.com')
  }, false)
}
// 关闭标签
function closeLabel (name) {
  let closeBox = Array.from(document.getElementsByClassName(name)) // 得到的html对象转换成数组
  const lengths = closeBox.length;
  console.log('点击的节点', lengths)
  for (let i= 0; i < lengths; i++) {
    const closeLabel = closeBox[i].firstElementChild.firstElementChild
    closeLabel.setAttribute('name', `${i}`)
    closeLabel.addEventListener('click', del) // 直接写函数会执行多次
  }
}
// 删除元素
function del(e) {
  const niticeBox = this.parentNode.parentNode.parentNode // 要删除的父元素
  const greadNodes = this.parentNode.parentNode // 获取关闭按钮的最外层元素
  const biaoCode = Number(this.getAttribute('name')) // 获取元素的位置
  const greadClass = greadNodes.getAttribute('class').split(" ")[1] // 获取删除标签的位置
  niticeBox.removeChild(greadNodes) // 移除最外层元素
  delLabel(greadClass, biaoCode)
  // console.log(greadNodes.getAttribute('class'))
  // delLabel(this)
  console.log(e)
}
// 删除后bottom距离
function delLabel(name, index) {
  let closeBox = Array.from(document.getElementsByClassName(name))
  const closeLength = closeBox.length
  for (let i = 0; i < closeLength; i++) {
    // const nextBoxCode = Number(closeBox[i].firstElementChild.firstElementChild.getAttribute('name'))
    const nextBoxCode = i + 1;
    if(nextBoxCode > index) {
      const magins = 160*(nextBoxCode-1) + 10 + 'px';
      console.log('删除数据', magins, index)
      if (name == 'left-bottom' || name == 'right-bottom') {
        closeBox[i].setAttribute('style', `bottom:${magins};left:10px;`)
        closeBox[i].firstElementChild.firstElementChild.setAttribute('name', `${i}`)
      }
      if (name == 'left-top' || name == 'right-top') {
        closeBox[i].setAttribute('style', `top:${magins};`)
        closeBox[i].firstElementChild.firstElementChild.setAttribute('name', `${i}`)
      }
    }
  }
  // console.log('删除', index)
}
// 计算bottom距离
function leftBottom(className) {
  let _leftBottom = Array.from(document.getElementsByClassName(className))
  _leftBottom.forEach((elements, index) => {
    // if (index!=0) {
      const magins = 160*index + 10 + 'px';
      _leftBottom[index].setAttribute('style', `bottom: ${magins};left: 10px;`)
    // }
  })
}
// 计算top距离
function leftTop(className) {
  let _leftBottom = Array.from(document.getElementsByClassName(className))
  _leftBottom.forEach((elements, index) => {
    // if (index!=0) {
      const magins = 160*index + 10 + 'px';
      _leftBottom[index].setAttribute('style', `top: ${magins}`)
    // }
  })
}
export default {
  ymywindow,
  ymNotice
}
