const Proto = function () {
  this.isOpen = false; // 是否开仓
  this.kLine = {}; // 上一次开仓k线
  this.point = 0; // 盈利点数
  this.cnt = 0; // 赢钱次数
  this.total = 0; // 总次数
};

/**
 * 开关
 * @return {null}
 */
Proto.prototype.isOpenToggle = function () {
  this.isOpen = !this.isOpen;
};

/**
 * 点数 往里面 塞数值 number
 * @return {null}
 */
Proto.prototype.pointChange = function (point) {
  this.point += point;
};

/**
 * 设置 上一根 k线
 * @return {object}
 */
Proto.prototype.setKLine = function (kline = {}) {
  this.kLine = kline;
};

/**
 * 赢钱次数 自增
 * @return {object}
 */
Proto.prototype.cntChange = function (val) {
  this.cnt += val;
};

/**
 * 总次数 自增
 * @return {object}
 */
Proto.prototype.totalIncrement = function () {
  this.total++;
};

/**
 * 返回盈利概率
 * @return {string}
 */
Proto.prototype.probability = function () {
  if (this.total > 0 && this.cnt > 0) {
    // return this.cnt / this.total;
    return `${(this.cnt / this.total) * 100}%`;
  }
  return "0%";
};

module.exports = Proto;
