const { hbApi } = require("../utils/http");

// 开/平 仓
const order = async ({
  contractCode = "MATIC-USDT",
  clientOrderId,
  volume = 1,
  direction,
  offset,
}) => {
  const res = await hbApi.restApi({
    path: `/linear-swap-api/v1/swap_cross_order`,
    method: "POST",
    body: {
      contract_code: contractCode,
      client_order_id: clientOrderId,
      volume: volume,
      direction: direction,
      offset: offset,
      lever_rate: 75,
      order_price_type: "opponent",
    },
  });

  return res;
};

module.exports = {
  order,
};
