const { maxArr, minArr, getMapItem } = require("../services/kline");
const Proto = require("../core/proto");
const logger = require("../utils/logger");
const { getNowTime } = require("../utils/time");
const { sell } = require("../order/sell");
const proto = new Proto();

const orderStatus = {
  0: "开仓",
  1: "平仓",
  2: "止损",
};

const dir = {
  0: "buy",
  1: "sell",
};

const sellController = ({ id, high, low, close, vol, cnt }, isMock = 0) => {
  const { isOpen, kLine, point, cnt: sellCnt, total } = proto; // 将里面的元素都解构出来
  const lastKLine = getMapItem({}); // 最后一根k线

  if (!isOpen) {
    // 开仓
    if (
      // 连续上涨的次数 <= -1
      lastKLine.line5.cnt + cnt <= -1 &&
      // lastKLine.line5.cnt + cnt >= -2 &&
      // 最高价 < 上一根k线 5分钟的最高价
      high < lastKLine.line5.max.high &&
      // close < 上一根k线 5分钟的最高价
      close < lastKLine.line5.max.high
    ) {
      //   !isMock && sell();
      logger.sell(
        `开仓时间: ${getNowTime(
          id
        )}, 开仓 卖空 当前价${close}, 当前最高价${high}, 连续上涨次数:${
          lastKLine.line5.cnt + cnt
        }, 上一根k线的5分钟 最高价${lastKLine.line5.max.high}`
      );

    //   logger.sell(
    //     JSON.stringify(getMapItem({}).line480.queueVol)
    //   );
      proto.isOpenToggle();
      proto.setKLine(lastKLine);
    }
  } else {
    // 平仓
    if (close < kLine.line5.min.low || close < lastKLine.line5.min.low) {
      //   !isMock && sell();
      // 盈利点数增加
      proto.pointChange(kLine.close - close);
      // 总数自增
      proto.totalIncrement();

      // 赢钱次数 +1
      if (close - kLine.close < 0) {
        proto.cntChange(1);
      }
      // 写日志
      logger.sell(
        `平仓时间: ${getNowTime(
          id
        )}, 平空单 当前价：${close}， 赢钱概率: ${proto.probability()} 盈利点数: ${
          proto.point
        }
        `
      );
      // 设置isOpen为false
      proto.isOpenToggle();
      proto.setKLine({});
    } else if (
      close > kLine.line5.max.high ||
      close > lastKLine.line5.max.high
    ) {
      //   !isMock && sell();
      // 止损
      // 盈利点数减少
      proto.pointChange(kLine.close - close);
      // 总数自增
      proto.totalIncrement();

      // 赢钱次数 -1
      if (close - kLine.close > 0) {
        proto.cntChange(-1);
      }
      // 写日志
      logger.sell(
        `止损时间: ${getNowTime(
          id
        )}, 止损单 当前价：${close}， 赢钱概率: ${proto.probability()} 盈利点数: ${
          proto.point
        }
        `
      );
      // 设置isOpen为false
      proto.isOpenToggle();
      proto.setKLine({});
    }
  }
};

module.exports = {
  sellController,
};
