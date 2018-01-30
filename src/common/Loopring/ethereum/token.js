import {generateAbiData} from './abi';
import validator from './validator';
import Transaction from './transaction';
import request from '../common/request';

export default class Token {

  constructor(input) {
    validator.validate({value: input, type: 'BASIC_TOKEN'});
    this.address = input.address;
    this.symbol = input.symbol || "";
    this.name = input.name || "";
    this.digits = input.digits || 18;
    this.unit = input.unit || "";
    if (input.website) {
      this.website = input.website
    }
    this.allowance = input.allowance || 10000;
    this.precision = input.precision || 6;
    this.minTradeValue = input.minTradeValue || 0.0001
  }

  async transfer(privateKey, to, amount, gasPrice, gasLimit, nonce, chainId) {
    const tx = {};
    tx.to = this.address;
    tx.value = "0x0";
    tx.data = generateAbiData({method: "transfer", address:to, amount});

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

  async approve(spender, amount,privateKey, gasPrice, gasLimit, nonce, chainId) {
    const tx = {};
    tx.to = this.address;
    tx.value = "0x0";
    tx.data = generateAbiData({method: "approve", spender, amount});
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

  async balanceOf(owner,tag) {
    validator.validate({value: owner, type: "ADDRESS"});
    const tx =  this.address;
    tx.data = generateAbiData({method: "balanceOf", address:owner});

    tag = tag || "pending";
    if (tag) {
      try {
        validator.validate({value: tag, type: "RPC_TAG"})
      } catch (e) {
        throw new Error('Invalid tag, must be one of latest, pending,earliest')
      }
    }
    const params = [this.address, tag];
    const body = {};
    body.method = 'eth_call';
    body.params = params;
    return request({
      method: 'post',
      body,
    })
  }

  async getAllowance(owner,spender,tag){
    validator.validate({value: owner, type: "ADDRESS"});
    validator.validate({value: spender, type: "ADDRESS"});
    const tx =  this.address;
    tx.data = generateAbiData({method: "allowance", owner, spender});
    tag = tag || "pending";
    if (tag) {
      try {
        validator.validate({value: tag, type: "RPC_TAG"})
      } catch (e) {
        throw new Error('Invalid tag, must be one of latest, pending,earliest')
      }
    }
    const params = [this.address, tag];
    const body = {};
    body.method = 'eth_call';
    body.params = params;
    return request({
      method: 'post',
      body,
    })
  }

}
