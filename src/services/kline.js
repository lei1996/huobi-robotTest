const MaxMinQueue = require("../core/queue");
const { getTime } = require("../utils/time");

// k线数据
const map = new Map();
// 最后一个存储的 Id
let lastId = 0;

const kLineArr = [5, 10, 15, 20, 30, 60, 120, 240, 480];
// 不同时间段的最大值
const maxArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
// 不同时间段的最小值
const minArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
// 用于判断行情的指针
const index = [0, 0];

// 存储公共队列数据
const Global_DATA = {};

for (const k of kLineArr) Global_DATA["data" + k] = new MaxMinQueue();

const StockData = (arr, k) => {
  Global_DATA["data" + k].push_back(arr);
  if (Global_DATA["data" + k].queue1.length > k) {
    Global_DATA["data" + k].pop_front();
  }

  return [
    Global_DATA["data" + k].max_value(),
    Global_DATA["data" + k].min_value(),
    Global_DATA["data" + k].cnt,
    Global_DATA["data" + k].average(),
    Global_DATA["data" + k].averageVol(),
    Global_DATA["data" + k].queueVol,
  ];
};

const handleStockData = (arr) => {
  const { id, open, close, high, low, vol } = arr;
  if (getTime(id) === id) return;
  const tmp = {};

  if (!map.has(id)) {
    // 得到压力位 支撑位 上涨概率的值 均线值
    for (const k of kLineArr) {
      const stockData = StockData(arr, k);
      tmp["line" + k] = {
        max: stockData[0], // 最大值
        min: stockData[1], // 最小值
        cnt: stockData[2], // 连续上涨次数
        average: stockData[3], // 均线值
        averageVol: stockData[4], // 均量
        queueVol: stockData[5], // 均量
      };
    }

    map.set(id, {
      open,
      close,
      high,
      low,
      vol,
      ...tmp,
    });
    // 存储最后一个id
    lastId = id;
  }
};

// 返回某一个k线值.
const getMapItem = ({ id = 0 }) => map.get(id || lastId);

// 定时器调用 每一分钟 找当前趋势 5分钟 10 15 20 30 60 120 240
const trendFunc = () => {
  for (let i = 0; i < maxArr.length; i++) {
    maxArr[i] = getMapItem({})["line" + kLineArr[i]].max.high;
    minArr[i] = getMapItem({})["line" + kLineArr[i]].min.low;
  }
};

module.exports = {
  kLine: map,
  lastId,
  maxArr,
  minArr,
  getMapItem,
  trendFunc,
  handleStockData,
};

