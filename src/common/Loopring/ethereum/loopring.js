import {generateAbiData} from './abi'
import validator from './validator'
import Transaction from './transaction'

export default class Loopring {

  constructor(address){
    validator.validate({value:address,type:"ADDRESS"})
    this.address = address;
  }

  async cancelOrder(order,privateKey,gasPrice, gasLimit, nonce, chainId){
    const tx = {};
    tx.to = this.address;
    tx.value = "0x0";
    tx.data = generateAbiData({method: "cancelOrder",order});

    if (gasPrice) {
      tx.gasPrice = gasPrice
    }
    if (gasLimit) {
      tx.gasLimit = gasLimit
    }
    if (nonce) {
      tx.nonce = nonce
    }
    if (chainId) {
      tx.chainId = chainId
    }
    const transaction = new Transaction(tx);
    return transaction.send(privateKey)
  }
  async cancelAllOrders(privateKey,timestamp,gasPrice, gasLimit, nonce, chainId){
    const tx = {};
    tx.to = this.address;
    tx.value = "0x0";
    tx.data = generateAbiData({method: "setCutoff",timestamp});

    if (gasPrice) {
      tx.gasPrice = gasPrice
    }
    if (gasLimit) {
      tx.gasLimit = gasLimit
    }
    if (nonce) {
      tx.nonce = nonce
    }
    if (chainId) {
      tx.chainId = chainId
    }
    const transaction = new Transaction(tx);
    return transaction.send(privateKey)
  }
}
