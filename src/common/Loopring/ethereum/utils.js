import validator from '../common/validator'
import request from '../common/request'

/**
 * @description Returns the number of transactions sent from an address.
 * @param host
 * @param address
 * @param tag
 * @returns {Promise}
 */
export async function getTransactionCount(host, address, tag) {
  validator.validate({value: host, type: 'URL'});
  validator.validate({value: address, type: "ADDRESS"});
  tag = tag || "pending";
  if (tag) {
    try {
      validator.validate({value: tag, type: "RPC_TAG"})
    } catch (e) {
      throw new Error('Invalid tag, must be one of latest, pending, earliest')
    }
  }
  const params = [address, tag];
  const body = {};
  body.method = 'eth_getTransactionCount';
  body.params = params;
  return request({
    host,
    method: 'post',
    body,
  })
}

/**
 * @description Returns the current price per gas in wei.
 * @param host server host
 * @returns {Promise}
 */
export async function getGasPrice(host) {
  validator.validate({value: host, type: 'URL'});
  const params = [];
  const body = {};
  body.method = 'eth_gasPrice';
  body.params = params;

  return request({
    host,
    method: 'post',
    body,
  })
}

/**
 * @description Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
 * @param host server host
 * @param tx
 * @returns {Promise}
 */
export async function estimateGas(host, tx) {
  validator.validate({value: host, type: 'URL'});
  const body = {};
  body.method = 'eth_estimateGas';
  body.params = [tx];
  return request({
    host,
    method: 'post',
    body,
  })
}

/**
 * @description Returns the ethereum balance of the account of given address.
 * @param host
 * @param address
 * @param tag
 * @returns {Promise}
 */
export async function getAccountBalance(host, address, tag) {
  validator.validate({value: host, type: 'URL'});
  validator.validate({value: address, type: "ADDRESS"});
  tag = tag || "latest";
  if (tag) {
    try {
      validator.validate({value: tag, type: "RPC_TAG"})
    } catch (e) {
      throw new Error('Invalid tag, must be one of latest, pending,earliest')
    }
  }
  const params = [address, tag];
  const body = {};
  body.method = 'eth_getBalance';
  body.params = params;
  return request({
    host,
    method: 'post',
    body,
  })
}

/**
 * @description Returns the information about a transaction requested by transaction hash.
 * @param host server host
 * @param hash ethereum tx hash
 * @returns {Promise}
 */
export async function getTransactionByhash(host, hash) {
  validator.validate({value: host, type: 'URL'});
  validator.validate({value: hash, type: "ETH_DATA"});
  const params = [hash];
  const body = {};
  body.method = 'eth_getTransactionByHash';
  body.params = params;
  return request({
    host,
    method: 'post',
    body,
  })
}

/**
 * @description Executes a new message call immediately without creating a transaction on the block chain.
 * @param host
 * @param tx
 * @param tag
 * @returns {Promise}
 */
export async function call(host, tx,tag) {
  validator.validate({value: host, type: 'URL'});
  tag = tag || "latest";
  if (tag) {
    try {
      validator.validate({value: tag, type: "RPC_TAG"})
    } catch (e) {
      throw new Error('Invalid tag, must be one of latest, pending, earliest')
    }
  }
  const params = [tx, tag];
  const body = {};
  body.method = 'eth_call';
  body.params = params;
  return request({
    method: 'post',
    body,
  });
}













