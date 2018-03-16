import fetch from 'dva/fetch';
import crypto from 'crypto';

function checkStatus(res) {
  // TODO
  return res;
}

function parseJSON(res) {
  return res.json();
}

//'https://relay1.loopring.io/rpc/v2'
window.LOOPRING_PROVIDER_HOST = "http://13.112.62.24/rpc/v2";
// https://relay1.loopring.io/eth
window.ETH_HOST = 'https://relay1.loopring.io/eth';

let checkHost = () => {
  if (!window.LOOPRING_PROVIDER_HOST) {
    throw new Error('host is required. Do not forget: new Loopring(host)')
  }
  if(!window.ETH_HOST){
    throw new Error('host is required. Do not forget: new ETH(host)')
  }
};

let headers = {
  'Content-Type': 'application/json'
};

function request(options) {
  checkHost();
  let method;
    if (options.body) {
    method = options.body.method;
    options.headers = options.headers || headers;
    options.body.id = id();
    options.body = JSON.stringify(options.body)
  }
  const url =  method.startsWith('eth')? window.ETH_HOST : window.LOOPRING_PROVIDER_HOST;

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      console.log(`${method} response:`, res);
      return res
    })
}

function id() {
  return crypto.randomBytes(8).toString('hex');
}

export default request;
