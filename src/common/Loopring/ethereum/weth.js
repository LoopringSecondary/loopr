import Token from './token';
import {generateAbiData} from './abi'
import validator from './validator'
import Transaction from './transaction'
import {privateToAddress} from 'ethereumjs-util';
import {toBuffer, toHex} from '../common/formatter';

export default class WETH extends Token {

  async deposit(amount, privateKey, gasPrice, gasLimit, nonce, chainId) {
    validator.validate({value: privateKey, type: "PRIVATE_KEY"});
    const tx = {};
    tx.to = this.address;
    tx.from = toHex(privateToAddress(toBuffer(privateKey)));
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
    return transaction.send(privateKey)

  }

  async withDraw(amount, privateKey, gasPrice, gasLimit, nonce, chainId) {
    validator.validate({value: privateKey, type: "PRIVATE_KEY"});
    const tx = {};
    tx.to = this.address;
    tx.from = toHex(privateToAddress(toBuffer(privateKey)));
    tx.value = amount;
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
    return transaction.send(privateKey)
  }

}
