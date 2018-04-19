import fetch from 'dva/fetch';
import crypto from 'crypto';
import _ from 'lodash';

const headers = {
  'Content-Type': 'application/json'
};

/**
 * @description Supports single request and batch request;
 * @param host
 * @param options
 * @returns {Promise}
 */
function request(host, options) {
  if (options.body) {
    options.headers = options.headers || headers;
    if (_.isArray(options.body)) {
      options.body = options.body.map(option => {
        option.id = option.id  || id();
        return option;
      });
    } else {
      options.body.id =  options.body.id || id();
    }
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
