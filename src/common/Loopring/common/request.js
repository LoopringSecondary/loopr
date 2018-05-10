import fetch from 'dva/fetch';
import crypto from 'crypto';

function checkStatus(res) {
  // TODO
  return res;
}

function parseJSON(res) {
  return res.json();
}

let checkHost = () => {
  const relayHost = window.STORAGE.settings.getRelay()
  window.LOOPRING_PROVIDER_HOST = relayHost + '/rpc/v2'
  window.ETH_HOST = relayHost + '/eth'

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
    options.body.jsonrpc='2.0';
    options.body = JSON.stringify(options.body)
  }
  // options.credentials = 'include'
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
