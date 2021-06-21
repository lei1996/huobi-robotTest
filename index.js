const { run } = require("./src");
const { websocket } = require("./src/websocket");

// 合约站行情请求以及订阅地址为
const WS_URL = "wss://api.btcgateway.pro/linear-swap-ws";

run().then(() => {
  websocket(WS_URL);
});
