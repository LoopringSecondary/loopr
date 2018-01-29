import EthTransaction from 'ethereumjs-tx'
import validator from '../common/validator'
import {toHex, toBuffer} from '../common/formatter'
import request from '../common/request'

export default class Transaction {
  constructor(rawTx) {
    // TODO validator.validate({value:tx,type:'TX'})
    this.raw = rawTx
  }

  hash() {
    return new EthTransaction(this.raw).hash()
  }

  sign(privateKey) {
    validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
    privateKey = toBuffer(privateKey);
    const ethTx = new EthTransaction(this.raw);
    const signed = ethTx.sign(privateKey).serialize();
    this.signed = signed;
    return toHex(signed)
  }

  async send(privateKey) {
    if(!this.signed){
      this.sign(privateKey)
    }
    validator.validate({value:this.signed,type:'HEX',});
    let body = {};
    body.method = 'eth_sendRawTransaction';
    body.params = [this.signed];
    return request({
      method:'post',
      body,
    })
  }
}






