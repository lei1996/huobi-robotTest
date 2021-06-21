// 最大最小值
const MaxMinQueue = function () {
  this.queue1 = [];
  // 维护最大值
  this.queue2 = [];
  // 维护最小值
  this.queue3 = [];

  // 成交量
  this.queueVol = [];

  // 连续上涨次数
  this.cnt = 0;
  // 收盘价总数 - 用于记录均线值
  this.sum = 0;
  // 总成交量
  this.totalVol = 0;

  // 最大的成交量
  this.maxVol = 0;
};

/**
 * @return {number}
 */
MaxMinQueue.prototype.max_value = function () {
  if (this.queue2.length) {
    return this.queue2[0];
  }
  return -1;
};

/**
 * @return {number}
 */
MaxMinQueue.prototype.min_value = function () {
  if (this.queue3.length) {
    return this.queue3[0];
  }
  return -1;
};

/**
 * 均价
 * @return {number}
 */
MaxMinQueue.prototype.average = function () {
  if (!this.queue1.length) {
    return 0;
  }
  return this.sum / this.queue1.length;
};

/**
 * 平均量
 * @return {number}
 */
MaxMinQueue.prototype.averageVol = function () {
  if (!this.queue1.length) {
    return 0;
  }
  return this.totalVol / this.queue1.length;
};

/**
 * 往队列推入一个 k线对象
 * @param {number} value
 * @return {void}
 */
MaxMinQueue.prototype.push_back = function (value) {
  this.queue1.push(value);
  while (
    this.queue2.length &&
    this.queue2[this.queue2.length - 1].high < value.high
  ) {
    this.queue2.pop();
  }
  this.queue2.push(value);
  while (
    this.queue3.length &&
    this.queue3[this.queue3.length - 1].low > value.low
  ) {
    this.queue3.pop();
  }
  this.queue3.push(value);

  this.queueVol.push(value.vol);

  // 上涨 cnt + 1
  if (value.close - value.open > 0) {
    this.cnt++;
  } else if (value.close === value.open) {
  } else {
    this.cnt--;
  }

  // 收盘价总和
  this.sum += value.close;

  // 总量
  this.totalVol += value.vol;

  // 最大的成交量
  this.maxVol = Math.max(this.maxVol, value.vol);
};

/**
 * @return {number}
 */
MaxMinQueue.prototype.pop_front = function () {
  if (!this.queue1.length) {
    return -1;
  }
  const val = this.queue1.shift();
  if (val.high === this.queue2[0].high) {
    this.queue2.shift();
  }
  if (val.low === this.queue3[0].low) {
    this.queue3.shift();
  }

  this.queueVol.shift();

  // 弹出的元素 如果是上涨 cnt - 1
  // 上涨 cnt + 1
  if (val.close - val.open > 0) {
    this.cnt--;
  } else if (val.close === val.open) {
  } else {
    this.cnt++;
  }

  // 总价
  this.sum -= val.close;

  // 总量
  this.totalVol -= val.vol;

  return val;
};

module.exports = MaxMinQueue;
