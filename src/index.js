const { hbApi } = require("./utils/http");
const { handleStockData } = require("./services/kline");
const { handleNowData } = require('./controller');
const logger = require("./utils/logger");

async function run() {
  /*****
   * root user info
   */
  // 永续 合约 账户金额
  // const account = await hbApi.restApi({
  //   path: `/linear-swap-api/v1/swap_cross_account_info`,
  //   method: "POST",
  //   body: { margin_account: "USDT" },
  // });
  // console.log("account:", account[0]);
  // 开/平仓
  const start = +new Date() / 1000;
  const historyKline = await hbApi.restApi({
    path: `/linear-swap-ex/market/history/kline`,
    method: "GET",
    query: {
      // contract_code: "BTC-USDT",
      contract_code: "MATIC-USDT",
      period: "1min",
      size: "1440",
      // size: "5",
    },
  });
  for (const arr of historyKline) {
    handleStockData(arr);
    // console.log(arr, 'arr--');
    handleNowData(arr, 1); // 跑测试数据用的
  }
  logger.info(`初始化数据完成，用时: ${+new Date() / 1000 - start}秒`);
}

module.exports = {
  run
}
