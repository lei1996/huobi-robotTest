const { maxArr, minArr, getMapItem } = require("../services/kline");
const Proto = require("../core/proto");
const moment = require("moment");
const logger = require("../utils/logger");
const { getNowTime } = require("../utils/time");
const proto = new Proto();

const enums = {
  0: "开仓",
  1: "平仓",
  2: "止损",
};

const enums1 = {
  0: "卖空",
  1: "平空单",
  2: "止损单",
};

const sellController = ({ id, high, low, close, cnt }) => {
  if (
    !proto.data.isOpen &&
    // - 6 0.6666666666666666
    // -5 0.7333333333333333   点数： -0.002349999999999852
    // -4 0.48717948717948717  点数： -0.0006199999999989547
    // -3 0.4936708860759494   点数： 0.008040000000000935
    // -2 0.34306569343065696  点数： 0.05078999999999878
    // -1 0.34306569343065696  点数： 0.052329999999998655
    // 0 0.16778523489932887   点数： 0.0013899999999988921
    // 1 0.16                  点数： -0.0016500000000010395
    getMapItem({}).line5.cnt + cnt <= -1 &&
    high < getMapItem({}).line5.max.high &&
    close < getMapItem({}).line5.max.high
  ) {
    logger.sell(`开仓时间: ${getNowTime(id)}, 开仓 卖空 当前价${close}`);
    proto.data.isOpen = true;
    proto.data.kLine = getMapItem({});
  }

  // 止盈逻辑
  if (
    proto.data.isOpen &&
    (close < proto.data.kLine.line5.min.low ||
      close < getMapItem({}).line5.min.low)
  ) {
    proto.data.point += Math.abs(proto.data.kLine.close - close);
    proto.data.total += 1;

    if (close - proto.data.kLine.close < 0) {
      proto.data.cnt += 1;
    }

    logger.sell(
      `平仓时间: ${getNowTime(
        id
      )}, 平空单 当前价：${close}， 赢钱概率: ${proto.probability()} 盈利点数: ${
        proto.data.point
      }`
    );
    proto.data.isOpen = false;
    proto.data.kLine = {};
    return;
  }

  if (
    // 止损逻辑
    proto.data.isOpen &&
    (close > proto.data.kLine.line5.max.high ||
      close > getMapItem({}).line5.max.high)
  ) {
    proto.data.point -= Math.abs(proto.data.kLine.close - close);
    proto.data.total += 1;

    if (close - proto.data.kLine.close > 0) {
      proto.data.cnt -= 1;
    }
    logger.sell(
      `止损时间: ${getNowTime(
        id
      )}, 止损单 当前价：${close}， 赢钱概率: ${proto.probability()} 盈利点数: ${
        proto.data.point
      }`
    );
    proto.data.isOpen = false;
    proto.data.kLine = {};
  }
};

module.exports = {
  sellController,
};
