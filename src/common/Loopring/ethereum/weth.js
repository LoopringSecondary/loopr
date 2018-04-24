import Token from './token';
import {generateAbiData} from './abi'
import validator from './validator'
import Transaction from './transaction'

export default class WETH extends Token {

  async deposit({amount, privateKey, gasPrice, gasLimit, nonce, chainId,walletType,path}) {
    validator.validate({value:amount,type:"ETH_DATA"});
    const tx = {};
    tx.to = this.address;
    tx.value = amount;
    tx.data = generateAbiData({method: "deposit"});

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
    return transaction.send({privateKey,walletType,path})

  }

  async withDraw({amount, privateKey, gasPrice, gasLimit, nonce, chainId,walletType,path}) {
    validator.validate({value:amount,type:"ETH_DATA"});
    const tx = {};
    tx.to = this.address;
    tx.value = '0x0';
    tx.data = generateAbiData({method: "withdraw", amount});

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
    return transaction.send({privateKey,walletType,path})
  }

}
