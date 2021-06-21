const { HbApi } = require("huobi-api-js");

const options = {
  apiBaseUrl: "https://api.hbdm.com",
  profileConfig: {
    accessKey: "填写你自己的accessKey",
    secretKey: "填写你自己的secretKey",
  },
};

const hbApi = new HbApi(options);

module.exports = {
  hbApi,
};
