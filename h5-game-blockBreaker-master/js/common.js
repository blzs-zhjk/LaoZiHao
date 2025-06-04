/* by：弦云孤赫——David Yang
** github - https://github.com/yangyunhe369
*/
// 封装打印日志方法
const log = console.log.bind(console)
// 生成图片对象方法
const imageFromPath = function (src) {
  let img = new Image()
  img.src = './images/' + src
  return img
}
// 检测页面不可见时自动暂停游戏方法
const isPageHidden = function (game) {
  let hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
    'mozHidden' in document ? 'mozHidden' :
    null
  let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')
  // 监听页面是否可见事件
  document.addEventListener(visibilityChangeEvent, function () {
    if (!document[hiddenProperty]) { // 可见状态
      setTimeout(function () {
        game.state = game.state_RUNNING
      }, 100)
    } else { // 不可见状态
      game.state = game.state_STOP
    }
  })
}


const getRandomBlockImage = function() {
  // 生成一个 1 到 12（包括 1 和 12）之间的随机数
  const randomNumber = Math.floor(Math.random() * 12) + 1;
  // 如果需要，将数字格式化为带前导零的形式（例如，1 变为 001，12 保持 012）
  const formattedNumber = String(randomNumber).padStart(3, '0');
  // 修正：使用模板字面量来拼接字符串
  return `block${formattedNumber}.png`;
};

// 图片素材路径
const allImg = {
  background: 'background.jpg',
  paddle: 'paddle.png',
  ball: 'ball.png',
  // 现在 block1 将是 block001.png 到 block012.png 之间的一张随机图片
  block1: getRandomBlockImage(),
  block2: 'block013.png',
}

// 访问 block1 查看随机结果的示例
// console.log(allImg.block1);