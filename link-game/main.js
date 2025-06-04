'use strict';

// 移动端适配函数
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 屏幕方向和尺寸相关
function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

// 动态调整游戏大小
function adjustGameSize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const gameArea = document.querySelector('.game-area');
  const gameTable = document.getElementById('game');
  
  if (!gameTable) return;
  
  // 计算游戏区域可用空间
  const toolbarHeight = document.querySelector('.toolbar')?.offsetHeight || 0;
  const availableHeight = windowHeight - toolbarHeight;
  const availableWidth = windowWidth;
  
  // 根据方向和尺寸决定单元格大小
  let cellSize = 50; // 默认单元格大小
  const isMobile = isMobileDevice();
  const landscape = isLandscape();
  
  if (isMobile) {
    if (landscape) {
      // 横屏手机
      cellSize = Math.min(40, Math.floor(availableHeight / 7)); // 7是游戏行数
    } else {
      // 竖屏手机
      cellSize = Math.min(50, Math.floor(availableWidth / 10)); // 10是游戏列数
    }
    
    // 小屏幕手机进一步调整
    if (windowWidth < 360 || availableHeight < 500) {
      cellSize = Math.max(35, cellSize - 5);
    }
  }
  
  // 更新CSS变量以便整个游戏使用同一尺寸基准
  document.documentElement.style.setProperty('--cell-size', cellSize + 'px');
  
  // 动态设置canvas尺寸
  const canvas = document.getElementById('canvas');
  if (canvas) {
    canvas.width = cellSize * 10;  // 10列
    canvas.height = cellSize * 7;  // 7行
  }
  
  // 返回计算的单元格尺寸，供游戏逻辑使用
  return cellSize;
}

// 触觉反馈函数 (仅在支持的移动设备上)
function vibrateDevice(duration) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

// 初始化调整大小
document.addEventListener('DOMContentLoaded', function() {
  // 禁止双击缩放
  document.addEventListener('dblclick', function(e) {
    e.preventDefault();
  });
  
  // 禁止页面拖动
  document.body.addEventListener('touchmove', function(e) {
    if (e.target.tagName !== 'INPUT') {
      e.preventDefault();
    }
  }, { passive: false });
  
  // 调整大小
  const cellSize = adjustGameSize();
  
  // 监听窗口尺寸变化和屏幕旋转
  window.addEventListener('resize', adjustGameSize);
  window.addEventListener('orientationchange', adjustGameSize);
  
  // 返回主页按钮功能
  document.querySelector('.back-home-btn')?.addEventListener('click', function() {
    window.location.href = '../../index.html'; // 返回到游戏集合主页
  });
});

function LinkGame(config) {
  if (!(this instanceof LinkGame)) {
    return new LinkGame(config);
  }
  
  // 获取手机适配的单元格尺寸
  const cellSize = adjustGameSize() || 42;
  
  this.score = 0; // 得分
  this.$box = $('#' + (config.boxId || 'game'));
  this.cellWidth = cellSize; // 每格的的宽度
  this.cellHeight = cellSize; // 每格的高度
  this.cols = config.cols + 2 || 10; // 列数
  this.rows = config.rows + 2 || 8; // 行数
  this.level = config.level || 0; // 等级
  this.leftDisorderTime = 5; // 剩余重排次数
  this.isMobile = isMobileDevice(); // 是否为移动设备
  this.gifts = [ // 小图片集合
    'images/gifts/0.png',
    'images/gifts/1.png',
    'images/gifts/2.png',
    'images/gifts/3.png',
    'images/gifts/4.png',
    'images/gifts/5.png',
    'images/gifts/6.png',
    'images/gifts/7.png',
    'images/gifts/8.png',
    'images/gifts/9.png',
    'images/gifts/10.png',
    'images/gifts/11.png',
    'images/gifts/12.png',
    'images/gifts/13.png',
    'images/gifts/14.png',
    'images/gifts/15.png',
    'images/gifts/16.png',
    'images/gifts/17.png',
    'images/gifts/18.png',
    'images/gifts/19.png',
    'images/gifts/20.png',
    'images/gifts/21.png',
    'images/gifts/22.png',
    'images/gifts/23.png',
    'images/gifts/24.png',
    'images/gifts/25.png',
    'images/gifts/26.png',
    'images/gifts/27.png',
    'images/gifts/28.png',
  ];
  this.nums = [
    'images/0.png',
    'images/1.png',
    'images/2.png',
    'images/3.png',
    'images/4.png',
    'images/5.png',
    'images/6.png',
    'images/7.png',
    'images/8.png',
    'images/9.png',
  ];
  this.xnums = [
    'images/x0.png',
    'images/x1.png',
    'images/x2.png',
    'images/x3.png',
    'images/x4.png',
    'images/x5.png',
  ];
  this.pnums = [
    'images/p0.png',
    'images/p1.png',
    'images/p2.png',
    'images/p3.png',
    'images/p4.png',
    'images/p5.png',
    'images/p6.png',
    'images/p7.png',
    'images/p8.png',
    'images/p9.png',
  ];
  return this;
}

LinkGame.prototype = {
  init: function (isReset) {
    var self = this;
    this.stack = [];
    this.iconTypeCount = this.level + 11; // 图片的种类
    this.count = (this.rows - 2) * (this.cols - 2); // 图片的总数
    this.remain = this.count; // 剩余的未有消去的图片
    this.pictures = []; // 图片集合
    this.linkPictures = [];
    this.preClickInfo = null; // 上一次被点中的图片信息
    this.leftTime = 100; // 剩余时间
    this.points = []; // 图片可以相消时的拐点集合
    this.timmer = setInterval(function () {
      self.updateCountDown();
    }, 1000);
    this.createMap();
    this.disorder();
    !isReset && this.bindDomEvents();
    this.updateLevel();
    this.domUpdateScore();
  },
  reset: function () {
    this.init(true);
  },
  nextLevel: function () {
    clearInterval(this.timmer);
    this.reset();
  },
  // 模板替换
  replaceTpl: function (tpl, data) {
    return tpl.replace(/\${(\w+)}/ig, function (match, $1) {
      return data[$1];
    });
  },
  // 合并数组，并把相同的元素排除掉
  mergeArray: function (target, source) {
    source.forEach(function (e) {
      if (target.indexOf(e) === -1) {
        target.push(e);
      }
    })
  },
  // 生成一定范围内的随机数
  random: function (min, max) {
    return parseInt((Math.random() * max) + min);
  },
  // 交换对象属性
  swapProperties: function (obj1, obj2, properties) {
    properties.forEach(function (property) {
      var temp = obj1[property];
      obj1[property] = obj2[property];
      obj2[property] = temp;
    });
  },
  // 克隆对象（浅克隆）
  cloneObj: function (source) {
    var target = {};
    for (var pro in source) {
      source.hasOwnProperty(pro) && (target[pro] = source[pro]);
    }
    return target;
  },
  // 获取历史记录
  getHistoryScore: function () {
    return window.localStorage.getItem('highestScore') || 0;
  },
  // 保存最高分
  setHistoryScore: function (score) {
    var highestScore = this.getHistoryScore('highestScore');
    if (score > highestScore) {
      window.localStorage.setItem('highestScore', score);
    }
  },

  updateDomNumbers: function ($container, value, type) {
    // 移动端直接显示数字，不用图片
    if (this.isMobile) {
      $container.html('<span>' + value + '</span>');
      return;
    }
    
    // 原有逻辑（非移动端）
    var numList = [];
    var nums = type === 1 ? this.nums : (type === 2 ? this.xnums : this.pnums);
    $container.html('');
    do {
      numList.push(value % 10);
      value = parseInt(value / 10);
    } while (value > 0);

    while (numList.length) {
      $container.append(this.replaceTpl('<img src="${src}" />', {
        src: nums[numList.pop()]
      }));
    }
  },

  updateCountDown: function () {
    --this.leftTime;
    if (this.leftTime < 0) {
      clearInterval(this.timmer);
      this.gameOver();
      return;
    }
    this.updateDomNumbers($('.time'), this.leftTime, 1);
  },
  
  gameOver: function () {
    $('.game-over').removeClass('hidden');
    
    // 移动端直接显示数字
    if (this.isMobile) {
      $('.history-score').text(this.getHistoryScore() || 0);
      $('.current-score').text(this.score);
    } else {
      $('.history-score').text(this.getHistoryScore() || 0);
      this.updateDomNumbers($('.current-score'), this.score, 3);
    }
    
    this.setHistoryScore(this.score);
    
    // 在移动设备上触发振动反馈
    if (this.isMobile) {
      vibrateDevice(200);
    }
  },

  updateLevel: function () {
    this.updateDomNumbers($('.level'), this.level + 1, 1);
  },
  
  createMap: function () {
    var count = 0;
    for (var row = 0; row < this.rows; row++) {
      this.pictures.push([]);
      for (var col = 0; col < this.cols; col++) {
        // 边界元素
        if (row === 0 || row === this.rows - 1 || col === 0 || col === this.cols - 1) {
          this.pictures[row].push({
            row: row,
            col: col,
            isEmpty: true,
            isBoundary: true
          });

          // 内部元素
        } else {
          this.pictures[row].push({
            row: row,
            col: col,
            isEmpty: false,
            index: count,
            pic: this.gifts[parseInt(count / 2) % this.iconTypeCount],
            width: this.cellWidth - 10, // 移动端调整图片尺寸
            height: this.cellHeight - 10,
            isBoundary: false
          });
          count++;
        }

      }
    }
  },
  // 打乱顺序
  disorder: function () {
    var pictures = this.pictures;
    var random = this.random.bind(this);
    for (var i = 0; i < this.count * 10; i++) {
      // 随机选中2张图片，调用this.swapProperties交换俩人的pic和isEmpty属性
      var picture1 = pictures[random(1, this.rows - 2)][random(1, this.cols - 2)];
      var picture2 = pictures[random(1, this.rows - 2)][random(1, this.cols - 2)];
      this.swapProperties(picture1, picture2, ['pic', 'isEmpty']);
    }
    this.renderMap();
    this.updateDisorderTime();
    
    // 移动端添加振动反馈
    if (this.isMobile) {
      vibrateDevice(50);
    }
  },

  updateDisorderTime: function () {
    this.updateDomNumbers($('.disorder'), this.leftDisorderTime, 2);
  },
  
  renderMap: function () {
    this.$box.html(''); // 将视图清空
    var html = '';
    var pictures = this.pictures;
    var tpl = '<td><div class="pic-box ${empty}" data-row="${row}" data-col="${col}" data-index="${index}"><img class="pic" draggable=false src="${pic}" width=${width} height=${height} /></div></td>';
    for (var row = 1; row < this.rows - 1; row++) {
      html += '<tr class="game-row">';
      for (var col = 1; col < this.cols - 1; col++) {
        var picture = this.cloneObj(pictures[row][col]);
        picture.empty = picture.isEmpty ? 'empty' : '';
        html += this.replaceTpl(tpl, picture);
      }
      html += '</tr>';
    }
    this.$box.html(html);
  },

  // 检测连通性
  checkMatch: function (curClickInfo) {
    var pictures = this.pictures,
      preClickInfo = this.preClickInfo ? this.preClickInfo : {},
      preRow = +preClickInfo.row,
      preCol = +preClickInfo.col,
      preIndex = +preClickInfo.index,
      curRow = +curClickInfo.row,
      curCol = +curClickInfo.col,
      curIndex = +curClickInfo.index;

    // 如果点击的图片是空白的，则退出
    if (pictures[curRow][curCol].isEmpty) {
      return;
    }
    this.preClickInfo = curClickInfo;
    this.domAddActive(curIndex);
    if (preIndex !== preIndex) { // NaN
      return;
    }


    // 如果前后2次点击的是同一张图片，或者2张图片不是同类型的，则退出
    if (preIndex === curIndex || pictures[preRow][preCol].pic !== pictures[curRow][curCol].pic) {
      this.domRemoveActive(preIndex);
      return;
    }
    if (this.canCleanup(preCol, preRow, curCol, curRow)) {
      // 移动端振动反馈
      if (this.isMobile) {
        vibrateDevice(50);
      }
      
      this.linkPictures = [];
      for (var i = 0; i < this.points.length - 1; i++) {
        this.mergeArray(this.linkPictures, this.countPoints(this.points[i], this.points[i + 1]));
      }
      this.drawLine();
      this.updateStatus(preRow, preCol, curRow, curCol, preIndex, curIndex);
    } else {
      this.domRemoveActive(preIndex);
    }
  },

  countPoints: function (start, end) {
    var points = [];
    var pictures = this.pictures;
    if (start[0] === end[0]) { // 同列
      var x = start[0];
      if (start[1] > end[1]) { // 从下到上
        for (var i = start[1]; i >= end[1]; i--) {
          points.push(pictures[i][x]);
        }
      } else { // 从上到下
        for (var i = start[1]; i <= end[1]; i++) {
          points.push(pictures[i][x]);
        }
      }
    } else if (start[1] === end[1]) { // 同行
      var y = start[1];
      if (start[0] > end[0]) { // 从右到左
        for (var i = start[0]; i >= end[0]; i--) {
          points.push(pictures[y][i]);
        }
      } else { // 从左到右
        for (var i = start[0]; i <= end[0]; i++) {
          points.push(pictures[y][i]);
        }
      }
    }
    return points;
  },

  domAddActive: function (index) {
    $('.game-row .pic-box').eq(index).addClass('active');
    return this;
  },
  
  domRemoveActive: function (index) {
    $('.game-row .pic-box').eq(index).removeClass('active');
    return this;
  },

  domAddEmpty: function (index) {
    $('.game-row .pic-box').eq(index).addClass('empty').removeClass('active');
    return this;
  },

  // 记分
  domUpdateScore: function () {
    this.updateDomNumbers($('.scoring'), this.score, 1);
  },

  // 连线
  drawLine: function (callback) {
    var $canvas = $('#canvas');
    if (!$canvas[0].getContext('2d')) return; // 不支持Canvas
    var linkList = this.linkPictures;
    var coordinate = [];
    
    // 获取单元格大小
    const cellSize = this.cellWidth || 50;
    
    for (var i = 0; i < linkList.length; i++) {
      var x = linkList[i].col === 0 ? 0 : (linkList[i].col === this.cols - 1 ? $('#game').width() : linkList[i].col * cellSize - cellSize/2);
      var y = linkList[i].row === 0 ? 0 : (linkList[i].row === this.rows - 1 ? $('#game').height() : linkList[i].row * cellSize - cellSize/2);
      coordinate.push([x, y]);
    }
    
    var ctx = $canvas[0].getContext('2d');
    ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height); // 清除之前的绘制
    ctx.beginPath();
    ctx.strokeStyle = "#fbff98";
    ctx.fillStyle = "#fbff98";
    ctx.lineWidth = 4;
    ctx.save();
    
    for (var i = 0; i < linkList.length; i++) {
      if (i === 0) {
        ctx.moveTo(coordinate[i][0], coordinate[i][1]);
      }
      ctx.lineTo(coordinate[i][0], coordinate[i][1]);
    }
    
    ctx.stroke();
    ctx.restore();
    $canvas.removeClass('hidden');
    
    setTimeout(function () {
      ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
      $canvas.addClass('hidden');
    }, 200);
  },

  updateStatus: function (preRow, preCol, curRow, curCol, preIndex, curIndex) {
    var self = this;
    this.remain -= 2;
    this.score += 10 * (this.linkPictures.length - 1);
    this.preClickInfo = null;
    this.domUpdateScore();
    setTimeout(function () {
      self.pictures[preRow][preCol].isEmpty = true;
      self.pictures[curRow][curCol].isEmpty = true;
      self.domAddEmpty(preIndex).domAddEmpty(curIndex);
      
      // 检查是否通关
      if (self.remain === 0) {
        ++self.level;
        self.nextLevel();
        // 在移动设备上通关振动
        if (self.isMobile) {
          vibrateDevice([100, 50, 100, 50, 100]);
        }
      }
    }, 200);
  },
  
  isRowEmpty: function (x1, y1, x2, y2) {
    if (y1 != y2) {
      return false;
    }
    x1 > x2 && (x1 = x1 + x2, x2 = x1 - x2, x1 = x1 - x2); //强制x1比x2小
    for (var j = x1 + 1; j < x2; ++j) { //from (x2,y2+1) to (x2,y1-1);
      if (!this.pictures[y1][j].isEmpty) {
        return false;
      }
    }
    return true;
  },
  isColEmpty: function (x1, y1, x2, y2) {
    if (x1 != x2) {
      return false;
    }
    y1 > y2 && (y1 = y1 + y2, y2 = y1 - y2, y1 = y1 - y2); //强制y1比y2小

    for (var i = y1 + 1; i < y2; ++i) { //from (x2+1,y2) to (x1-1,y2);
      if (!this.pictures[i][x1].isEmpty) {
        return false;
      }
    }
    return true;
  },

  addPoints: function () {
    var args = arguments,
      len = args.length,
      i = 0;

    for (; i < len;) {
      this.points.push(args[i++]);
    }
  },
  
  // 判断两个坐标是否可以相互消除
  canCleanup: function (x1, y1, x2, y2) {
    this.points = [];
    if (x1 === x2) {
      if (1 === y1 - y2 || 1 === y2 - y1) { //相邻
        this.addPoints([x1, y1], [x2, y2]);
        return true;
      } else if (this.isColEmpty(x1, y1, x2, y2)) { //直线
        this.addPoints([x1, y1], [x2, y2]);
        return true;
      } else { //两个拐点	(优化)
        var i = 1;
        while ((x1 + i < this.cols) && this.pictures[y1][x1 + i].isEmpty) {
          if (!this.pictures[y2][x2 + i].isEmpty) {
            break;
          } else {
            if (this.isColEmpty(x1 + i, y1, x1 + i, y2)) {
              this.addPoints([x1, y1], [x1 + i, y1], [x1 + i, y2], [x2, y2]);
              return true;
            }
            i++;
          }
        }
        i = 1;
        while ((x1 - i >= 0) && this.pictures[y1][x1 - i].isEmpty) {
          if (!this.pictures[y2][x2 - i].isEmpty) {
            break;
          } else {
            if (this.isColEmpty(x1 - i, y1, x1 - i, y2)) {
              this.addPoints([x1, y1], [x1 - i, y1], [x1 - i, y2], [x2, y2]);
              return true;
            }
            i++;
          }
        }

      }
    }

    if (y1 === y2) { //同行
      if (1 === x1 - x2 || 1 === x2 - x1) {
        this.addPoints([x1, y1], [x2, y2]);
        return true;
      } else if (this.isRowEmpty(x1, y1, x2, y2)) {
        this.addPoints([x1, y1], [x2, y2]);
        return true;
      } else {
        var i = 1;
        while ((y1 + i < this.rows) && this.pictures[y1 + i][x1].isEmpty) {
          if (!this.pictures[y2 + i][x2].isEmpty) {
            break;
          } else {
            if (this.isRowEmpty(x1, y1 + i, x2, y1 + i)) {
              this.addPoints([x1, y1], [x1, y1 + i], [x2, y1 + i], [x2, y2]);
              return true;
            }
            i++;
          }
        }
        i = 1;
        while ((y1 - i >= 0) && this.pictures[y1 - i][x1].isEmpty) {
          if (!this.pictures[y2 - i][x2].isEmpty) {
            break;
          } else {
            if (this.isRowEmpty(x1, y1 - i, x2, y1 - i)) {
              this.addPoints([x1, y1], [x1, y1 - i], [x2, y1 - i], [x2, y2]);
              return true;
            }
            i++;
          }
        }
      }
    }

    //一个拐点
    if (this.isRowEmpty(x1, y1, x2, y1) && this.pictures[y1][x2].isEmpty) { // (x1,y1) -> (x2,y1)
      if (this.isColEmpty(x2, y1, x2, y2)) { // (x1,y2) -> (x2,y2)
        this.addPoints([x1, y1], [x2, y1], [x2, y2]);
        return true;
      }
    }
    if (this.isColEmpty(x1, y1, x1, y2) && this.pictures[y2][x1].isEmpty) {
      if (this.isRowEmpty(x1, y2, x2, y2)) {
        this.addPoints([x1, y1], [x1, y2], [x2, y2]);
        return true;
      }
    }

    //不在一行的两个拐点
    if (x1 != x2 && y1 != y2) {
      i = x1;
      while (++i < this.cols) {
        if (!this.pictures[y1][i].isEmpty) {
          break;
        } else {
          if (this.isColEmpty(i, y1, i, y2) && this.isRowEmpty(i, y2, x2, y2) && this.pictures[y2][i].isEmpty) {
            this.addPoints([x1, y1], [i, y1], [i, y2], [x2, y2]);
            return true;
          }
        }
      }

      i = x1;
      while (--i >= 0) {
        if (!this.pictures[y1][i].isEmpty) {
          break;
        } else {
          if (this.isColEmpty(i, y1, i, y2) && this.isRowEmpty(i, y2, x2, y2) && this.pictures[y2][i].isEmpty) {
            this.addPoints([x1, y1], [i, y1], [i, y2], [x2, y2]);
            return true;
          }
        }
      }

      i = y1;
      while (++i < this.rows) {
        if (!this.pictures[i][x1].isEmpty) {
          break;
        } else {
          if (this.isRowEmpty(x1, i, x2, i) && this.isColEmpty(x2, i, x2, y2) && this.pictures[i][x2].isEmpty) {
            this.addPoints([x1, y1], [x1, i], [x2, i], [x2, y2]);
            return true;
          }
        }
      }

      i = y1;
      while (--i >= 0) {
        if (!this.pictures[i][x1].isEmpty) {
          break;
        } else {
          if (this.isRowEmpty(x1, i, x2, i) && this.isColEmpty(x2, i, x2, y2) && this.pictures[i][x2].isEmpty) {
            this.addPoints([x1, y1], [x1, i], [x2, i], [x2, y2]);
            return true;
          }
        }
      }
    }

    return false;
  },
  
  bindDomEvents: function () {
    var self = this;
    
    // 针对移动设备优化点击事件
    const eventType = this.isMobile ? 'touchstart' : 'click';
    
    $('.wrapper').on(eventType, '.pic-box', function (e) {
      // 如果是触摸事件，阻止默认行为防止滚动
      if (e.type === 'touchstart') {
        e.preventDefault();
      }
      
      var supportDataSet = this.dataset ? true : false;
      var data = { // 兼容IE不支持dataset
        row: supportDataSet ? this.dataset.row : this.getAttribute('data-row'),
        col: supportDataSet ? this.dataset.col : this.getAttribute('data-col'),
        index: supportDataSet ? this.dataset.index : this.getAttribute('data-index')
      }
      self.checkMatch(data);
    })
    
    // 使用适合移动端的事件
    .on(eventType, '.disorder', function (event) {
      if (e.type === 'touchstart') {
        e.preventDefault();
      }
      if(self.leftDisorderTime-- > 0) {
        self.disorder();
      } else {
        // 反馈无法使用
        if (self.isMobile) {
          vibrateDevice([10, 10, 10]);
          $(this).addClass('disabled').delay(300).removeClass('disabled');
        }
      }
    })
    
    // 游戏结束时的重玩按钮
    .on(eventType, '.replay-btn', function (e) {
      if (e.type === 'touchstart') {
        e.preventDefault();
      }
      self.score = 0;
      self.level = 0;
      self.leftDisorderTime = 5;
      $('.game-over').addClass('hidden');
      self.reset();
      
      // 触感反馈
      if (self.isMobile) {
        vibrateDevice(50);
      }
    });
  }
};

// 添加移动端适配的入口点
$(function () {
  const eventType = isMobileDevice() ? 'touchstart' : 'click';
  
  $('.start-btn').on(eventType, function(e) {
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    
    // 播放背景音乐（许多移动浏览器需要用户交互后才能播放音频）
    const audio = $('audio').get(0);
    if (audio) {
      audio.play().catch(function(err) {
        console.log('自动播放受限: ', err);
      });
    }
    
    $('.init-box').addClass('hidden');
    $('.game-box').removeClass('hidden');
    
    // 调整游戏尺寸
    const cellSize = adjustGameSize();
    
    var gameConfig = {
      cellWidth: cellSize,
      cellHeight: cellSize,
      rows: 7,
      cols: 10,
      level: 0,
    }
    
    new LinkGame(gameConfig).init();
    
    // 触感反馈
    if (isMobileDevice() && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  });
});