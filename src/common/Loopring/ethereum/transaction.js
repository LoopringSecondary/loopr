import EthTransaction from 'ethereumjs-tx'
import validator from './validator'
import {toHex, toBuffer,addHexPrefix} from '../common/formatter'
import {estimateGas, getGasPrice, getTransactionCount} from './utils';
import request from '../common/request'
import {privateKeytoAddress} from "./account";

export default class Transaction {
  constructor(rawTx) {
    validator.validate({value: rawTx, type: 'BASIC_TX'});
    this.raw = rawTx;
  }

  async setGasLimit() {
    if (!this.raw.gasLimit) {
      const tx = {to: this.raw.to};
      if (this.raw.data) {
        tx.data = this.raw.data
      }
      this.raw.gasLimit = await estimateGas(tx).result
    }
  }

  async setGasPrice() {
    this.raw.gasPrice = this.raw.gasPrice || await getGasPrice().result
  }

  setChainId() {
    this.raw.chainId = this.raw.chainId || 1
  }

  async setNonce(address, tag) {
    tag = tag || 'pending';
    this.raw.nonce = this.raw.nonce || await getTransactionCount(address, tag).result;
  }

  async hash() {
    validator.validate({value: this.raw, type: "TX"});
    return new EthTransaction(this.raw).hash()
  }

  async sign(privateKey) {
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

    try {
      validator.validate({value: this.raw, type: "TX"});
    } catch (e) {
      const address = privateKeytoAddress(privateKey);
      await this.complete(address);
    }
    const ethTx = new EthTransaction(this.raw);
    const signed = ethTx.sign(privateKey).serialize();
    this.signed = signed;
    return toHex(signed)
  }

  async send(privateKey) {
    if (!this.signed) {
      await this.sign(privateKey)
    }
    let body = {};
    body.method = 'eth_sendRawTransaction';
    body.params = [this.signed];
    return request({
      method: 'post',
      body,
    })
  }

  async complete(address) {
    await this.setChainId();
    await this.setGasLimit();
    await this.setGasPrice();
    await this.setNonce(address);
  }
}






