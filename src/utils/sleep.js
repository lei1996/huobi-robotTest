const sleep = (ms) => new Promise((resolve) => void setTimeout(resolve, ms));

module.exports = { sleep };
