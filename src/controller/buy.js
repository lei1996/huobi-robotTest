const { maxArr, minArr, getMapItem } = require("../services/kline");
const logger = require("../utils/logger");
const moment = require("moment");
const Proto = require("../core/proto");

const buyProto = new Proto();

const buyController = (arr = {}) => {
  const { id, high, low, close, cnt } = arr;
  if (
    !buyProto.data.isOpen &&
    getMapItem({}).line5.cnt + cnt >= 1 &&
    low > getMapItem({}).line5.min.low &&
    close > getMapItem({}).line5.min.low
  ) {
    // buy();
    logger.buy(
      `开仓时间: ${id}|${moment(Number(`${id}000`))
        .utcOffset(8 * 60)
        .format("YYYY-MM-DD HH:mm:ss")},买多 当前价${close}`
    );
    buyProto.data.isOpen = true;
    // 这里有一个bug， getMapItem 拿到的是一分钟之前的数据 ，并不是当下的数据.
    buyProto.data.kLine = getMapItem({});
  }

  if (
    buyProto.data.isOpen &&
    (close > buyProto.data.kLine.line5.max.high ||
      close > getMapItem({}).line5.max.high)
  ) {
    // buy();

    // 这里有bug.
    buyProto.data.point += close - buyProto.data.kLine.close;
    buyProto.data.total += 1;

    if (close - buyProto.data.kLine.close > 0) {
      buyProto.data.cnt += 1;
    }
    buyProto.data.probability = buyProto.data.cnt / buyProto.data.total;

    logger.sell(
      `平仓时间: ${id}|${moment(Number(`${id}000`))
        .utcOffset(8 * 60)
        .format("YYYY-MM-DD HH:mm:ss")}, 平空单 当前价：${close}， 赢钱概率: ${
        buyProto.data.probability
      } 盈利点数: ${buyProto.data.point}`
    );

    buyProto.data.isOpen = false;
    buyProto.data.kLine = {};
    return;
  }
  if (
    // 止损逻辑
    buyProto.data.isOpen &&
    (close < buyProto.data.kLine.line5.min.low ||
      close < getMapItem({}).line5.min.low)
  ) {
    buyProto.data.point -= Math.abs(buyProto.data.kLine.close - close);
    buyProto.data.total += 1;

    if (close - buyProto.data.kLine.close < 0) {
      buyProto.data.cnt -= 1;
    }
    buyProto.data.probability = buyProto.data.cnt / buyProto.data.total;
    logger.sell(
      `止损时间: ${id}|${moment(Number(`${id}000`))
        .utcOffset(8 * 60)
        .format("YYYY-MM-DD HH:mm:ss")}, 止损单 当前价：${close}， 赢钱概率: ${
        buyProto.data.probability
      } 盈利点数: ${buyProto.data.point}`
    );
    buyProto.data.isOpen = false;
    buyProto.data.kLine = {};
  }
};

module.exports = {
  buyController,
};
