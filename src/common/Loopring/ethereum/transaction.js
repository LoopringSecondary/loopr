import EthTransaction from 'ethereumjs-tx'
import validator from './validator'
import {addHexPrefix, toBuffer, toHex} from '../common/formatter'
import {getGasPrice, getTransactionCount} from './utils';
import request from '../common/request'


/**
 * @description submit ethereum signed tx
 * @param signedTx
 */
export  function send(signedTx) {
  let body = {};
  body.method = 'eth_sendRawTransaction';
  body.params = [signedTx];
  return request({
    method: 'post',
    body,
  })
}


export default class Transaction {
  constructor(rawTx) {
    validator.validate({value: rawTx, type: 'BASIC_TX'});
    this.raw = rawTx;
  }

  setGasLimit() {
    this.raw.gasLimit = this.raw.gasLimit || configs['defaultGasLimit']
  }

  async setGasPrice() {
    this.raw.gasPrice = this.raw.gasPrice || (await getGasPrice()).result
  }

  setChainId() {
    this.raw.chainId = this.raw.chainId || 1
  }

  async setNonce(address, tag) {
    tag = tag || 'pending';
    this.raw.nonce = this.raw.nonce || (await getTransactionCount(address, tag)).result;
  }

  hash() {
    validator.validate({value: this.raw, type: "TX"});
    return new EthTransaction(this.raw).hash()
  }

  async sign(privateKey) {
    try {
      validator.validate({value: this.raw, type: "TX"});
    } catch (e) {
      await this.complete();
    }
    try {
      if (typeof privateKey === 'string') {
        validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
        privateKey = toBuffer(addHexPrefix(privateKey))
      } else {
        validator.validate({value: privateKey, type: 'PRIVATE_KEY_BUFFER'});
      }
    } catch (e) {
      throw new Error('Invalid private key')
    }
    const ethTx = new EthTransaction(this.raw);
    ethTx.sign(privateKey);
    const signed = toHex(ethTx.serialize());
    this.signed = signed;
    return signed
  }



  async complete() {
    this.setChainId();
    this.setGasLimit();
    await this.setGasPrice();
  }
}






