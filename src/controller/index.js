const { maxArr, minArr, getMapItem } = require("../services/kline");
const { buyController } = require("./buy");
// const { sellController } = require("./sell");
const { sellController } = require("./sell2");

// 处理当下的k线数据
const handleNowData = (arr, isMock) => {
  const { id, open, close, high, low, vol } = arr;

  const diff = close - open;
  const cnt = diff > 0 ? 1 : -1;

  // console.log(vol, '当下的量能');

  // console.log(
  //   "当前价：",
  //   close,
  //   "最后一分钟k线",
  //   getMapItem({}),
  //   "当前支撑位",
  //   maxArr,
  //   "当前压力位",
  //   minArr
  // );

  // 多头趋势
  // buyController({ id, high, low, close, vol, cnt });
  // // 空头趋势
  sellController({ id, high, low, close, vol, cnt }, isMock);
};

module.exports = {
  handleNowData,
};
