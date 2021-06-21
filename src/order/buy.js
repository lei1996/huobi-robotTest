const { order } = require("../core/order");

const BUY_DATA = {
  isOpen: false, // 是否开仓
  orderId: 0, // 开仓的ID 用于平仓
  lock: 5, // 最多允许错5次, 少于 0 不执行
  lastTime: 0,
};

// 只执行买多，然后用一个变量作为开关，永远只能持仓一个多单.
const index = () => {
  if (+new Date() - BUY_DATA.lastTime < 1000) return;
  const { isOpen, orderId } = BUY_DATA;

  BUY_DATA.lastTime = +new Date();
  if (!isOpen) {
    const { order_id } = order({ direction: "buy", offset: "open" });
    BUY_DATA.orderId = order_id;
    BUY_DATA.isOpen = true;
  } else {
    order({
      direction: "sell",
      offset: "close",
      client_order_id: orderId,
    });
    BUY_DATA.orderId = 0;
    BUY_DATA.isOpen = false;
  }
};

module.exports = {
  buy: index,
};
