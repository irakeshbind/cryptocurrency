
const cron = require('node-cron');
const axios = require('axios');
const HistoryData = require('../models/HistoryData');

const COINGECKO_API = process.env.COINGECKO_API;


module.exports = startCron;
