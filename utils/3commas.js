const threeCommasAPI = require('./3commas-api')
const { THREE_API_KEY, THREE_SECRET_KEY } = process.env;

const API = new threeCommasAPI({
  apiKey: THREE_API_KEY,
  apiSecret: THREE_SECRET_KEY,
});

module.exports = API;