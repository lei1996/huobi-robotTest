const { order } = require("../core/order");

const SELL_DATA = {
  isOpen: false, // 是否开仓
  orderId: 0, // 开仓的ID 用于平仓
  lock: 5, // 最多允许错5次, 少于 0 不执行
  lastTime: 0,
};

// 只执行买多，然后用一个变量作为开关，永远只能持仓一个多单.
const index = () => {
  if (+new Date() - SELL_DATA.lastTime < (1000 * 30)) return;
  const { isOpen, orderId } = SELL_DATA;

  SELL_DATA.lastTime = +new Date();
  if (!isOpen) {
    const { order_id } = order({ direction: "sell", offset: "open" });
    SELL_DATA.orderId = order_id;
    SELL_DATA.isOpen = true;
  } else {
    order({
      direction: "buy",
      offset: "close",
      client_order_id: orderId,
    });
    SELL_DATA.orderId = 0;
    SELL_DATA.isOpen = false;
  }
};

module.exports = {
  sell: index,
};
