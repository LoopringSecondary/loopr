import EthTransaction from 'ethereumjs-tx'
import validator from './ethereum_validator'
import {toHex, toBuffer} from '../common/formatter'
import {estimateGas, getGasPrice, getTransactionCount} from './utils';
import {generateAbiData} from './abi';
import request from '../common/request'


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
    if (!this.raw.gasPrice) {
      this.raw.gasPrice = await getGasPrice().result
    }
  }

  setChainId() {
    this.raw.chainId = this.raw.chainId || 1
  }

  async setNonce(address, tag) {
    tag = tag || 'pending';
    this.raw.nonce = await getTransactionCount(address, tag).result;
  }

  async hash() {
    try {
      validator.validate({value: this.raw, type: "TX"});
    } catch (e) {
      await this.complete();
    }
    return new EthTransaction(this.raw).hash()
  }

  async sign(privateKey) {

    try {
      validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
    } catch (e) {

    }
    privateKey = toBuffer(privateKey);
    try {
      validator.validate({value: this.raw, type: "TX"});
    } catch (e) {
      await this.complete();
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

  async complete() {
    this.setChainId();
    this.setGasLimit();
    this.setGasPrice();
    this.setNonce();
  }
}






