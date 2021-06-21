const moment = require("moment");

// k线的时间戳 10位
const getTime = () =>
  new Date(moment().format("YYYY-MM-DD HH:mm")).getTime() / 1000;

// 输出时间
const getNowTime = (id) =>
  `${id}|${moment(Number(`${id}000`))
    .utcOffset(8 * 60)
    .format("YYYY-MM-DD HH:mm:ss")}`;

module.exports = {
  getTime,
  getNowTime
};
