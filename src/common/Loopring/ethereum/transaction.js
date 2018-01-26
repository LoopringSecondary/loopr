import EthTransaction from 'ethereumjs-tx'
import abis from '../common/abis'
import validator from '../common/validator'
import {toHex,toBuffer} from '../common/formatter'
import * as apis from '../common/apis'
// import {BaseTx,RawTx,SignedTx,RPC_TAG,ADDRESS} from '../common/types'

export default class Transaction {
  constructor(rawTx) {
    // TODO validator.validate({value:tx,type:'TX'})
    this.raw = rawTx
  }
  hash(){
    return new EthTransaction(this.raw).hash()
  }
  sign(privateKey){
    validator.validate({value:privateKey,type:'PRIVATE_KEY'})
    privateKey = toBuffer(privateKey)
    const ethTx = new EthTransaction(this.raw)
    const signed = ethTx.sign(privateKey).serialize()
    return toHex(signed)
  }
  async send(){
    return apis.sendRawTransaction(this.signed)
  }
}






