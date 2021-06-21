'use strict';

const path = require('path');
const log4js = require('log4js');

const layout = {
  type: 'pattern',
  pattern: '[%d{yyyy/MM/dd hh:mm:ss}] [%p] %c - %m'
};

const commonOpts = {
  type: 'file',
  layout,
  maxLogSize: 500 * 1024 * 1024, // = 500Mb
  numBackups: 3, // keep three backup files
  compress: true, // compress the backups 
  encoding: 'utf-8'
};

let log4jsConfig = {
  appenders: {
    console: {
      layout,
      type: 'console'
    },
    info: {
      filename: path.resolve(__dirname, '../../logs/info.log'),
      ...commonOpts
    },
    warn: {
      filename: path.resolve(__dirname, '../../logs/warn.log'),
      ...commonOpts
    },
    error: {
      filename: path.resolve(__dirname, '../../logs/error.log'),
      ...commonOpts
    },
    buy: {
      filename: path.resolve(__dirname, '../../logs/buy.log'),
      ...commonOpts
    },
    sell: {
      filename: path.resolve(__dirname, '../../logs/sell.log'),
      ...commonOpts
    },
  },
  categories: {
    default: { appenders: ['info'], level: 'info' },
    info: { appenders: ['info'], level: 'info' },
    buy: { appenders: ['buy'], level: 'info' },
    sell: { appenders: ['sell'], level: 'info' },
    warn: { appenders: ['warn'], level: 'warn' },
    error: { appenders: ['error'], level: 'error' }
  }
};

if (process.env.DEBUG) {
  let categories = log4jsConfig.categories;
  for (let key in categories) {
    categories[key].appenders.push('console');
  }
}

log4js.configure(log4jsConfig);

let infoLogger = log4js.getLogger('info');
let warnLogger = log4js.getLogger('warn');
let errorLogger = log4js.getLogger('error');
let buyLogger = log4js.getLogger('buy');
let sellLogger = log4js.getLogger('sell');

module.exports = {
  getLogger: log4js.getLogger,

  info(...args) {
    infoLogger.info(...args);
  },

  warn(...args) {
    warnLogger.warn(...args);
  },

  error(...args) {
    errorLogger.error(...args);
  },

  buy(...args) {
    buyLogger.info(...args);
  },

  sell(...args) {
    sellLogger.info(...args);
  },
};
