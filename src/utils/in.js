const bigDecimal = require('js-big-decimal');


// 浮点数保留 x 位小数
console.log(bigDecimal.round("12345.6789", 2)); // 12345.68

// 浮点数相加/相减/相乘/相除
console.log(bigDecimal.add("71.680", "71.520")); // 143.200
console.log(bigDecimal.subtract("71.680", "71.520")); // 0.160
console.log(bigDecimal.multiply("71.680", "71.520")); // 5126.5536
console.log(bigDecimal.divide("45", "4", 2)); // 11.25

// 斜率写成 utils 
function slope({ 
  section = [71.520, 71.680], // 区间 前某分钟的值 -> 目标分钟的值
  x = 60, // 时间差值
}) {
  const [left, right] = section;
  const diff = right - left;

  return ;
}

// 计算量能


function MaxMinLimit({
  initalValue = 0,
  minNum = 0,
  maxNum = 5,
  disable = false,
}) {
  this.datas = {
    count: initalValue,
    minNum,
    maxNum,
    disable,
  };
}

MaxMinLimit.prototype.increment = function () {
  const { count, maxNum, disable } = this.datas;

  if (disable) return;

  if (count < maxNum) {
    this.datas.count = count + 1;
  }
};

MaxMinLimit.prototype.decrement = function () {
  const { count, minNum, disable } = this.datas;

  if (disable) return;

  if (count > minNum) {
    this.datas.count = count - 1;
  }
};