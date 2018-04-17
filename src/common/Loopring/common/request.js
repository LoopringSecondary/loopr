import fetch from 'dva/fetch';
import crypto from 'crypto';

const headers = {
  'Content-Type': 'application/json'
};

/**
 *
 * @param host
 * @param options
 * @returns {Promise}
 */
function request(host, options) {
  if (options.body) {
    options.headers = options.headers || headers;
    options.body.id = id();
    options.body = JSON.stringify(options.body);
  }
  return fetch(host, options).then(res => res.json())
}

/**
 * @description Returns a random hex string
 */
function id() {
  return crypto.randomBytes(8).toString('hex');
}

export default request;
