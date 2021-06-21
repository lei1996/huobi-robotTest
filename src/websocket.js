const WebSocket = require("ws");
const pako = require("pako");
const { sleep } = require("./utils/sleep");
const { getTime } = require("./utils/time");
const { kLine, trendFunc, handleStockData } = require("./services/kline");
const { handleNowData } = require('./controller');

// 上一根k线
let prev = {
  id: 0,
};

function handle(data) {
  if (prev.id !== data.id) {
    prev.id !== 0 && handleStockData(prev);
    trendFunc();
    prev = data;
  }
  handleNowData(data);
}

function subscribe(ws) {
  // 1min k线图
  ws.send(
    JSON.stringify({
      sub: `market.MATIC-USDT.kline.1min`,
      id: `id1`,
    })
  );
}

const websocket = (WS_URL) => {
  const ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    subscribe(ws);
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(
      pako.inflate(data, {
        to: "string",
      })
    );

    if (msg.ping) {
      ws.send(
        JSON.stringify({
          pong: msg.ping,
        })
      );
    } else if (msg.tick) {
      handle(msg.tick);
    } else {
      // console.log(msg);
    }
  });

  ws.on("close", async () => {
    console.log("close");
    await sleep(5000);
    websocket();
  });

  ws.on("error", (err) => {
    console.log("error", err);
    websocket();
  });
};

module.exports = {
  websocket,
};
