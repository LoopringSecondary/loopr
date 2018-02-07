import {projects} from "../../config/data";
import validator from './validator';
import {configs} from "../../config/data";
import {generateAbiData} from "./abi";
import Transaction from './transaction';
import request from '../common/request'

const bindContractAddress = configs['bindContractAddress'];

export async function  bind(privateKey, token, address, gasPrice, gasLimit, nonce, chainId) {
  validator.validate({value: token, type: 'LOOPRING_TOKEN'});
  const projectId = projects[token];
  const tx = {};
  tx.to = bindContractAddress;
  tx.value = "0x0";
  tx.data = generateAbiData({method: "bind", address, projectId});

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

export async function unbind(privateKey, token, gasPrice, gasLimit, nonce, chainId) {

  validator.validate({value: token, type: 'LOOPRING_TOKEN'});
  const projectId = projects[token];
  const tx = {};
  tx.to = bindContractAddress;
  tx.value = "0x0";
  tx.data = generateAbiData({method: "unbind", projectId});

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
  return transaction.send(privateKey);
}

export async function getBindingAddress(owner, token, tag) {

  validator.validate({value: token, type: 'LOOPRING_TOKEN'});
  const projectId = projects[token];
  validator.validate({value: owner, type: 'ADDRESS'});
  tag = tag || "latest";
  if (tag) {
    try {
      validator.validate({value: tag, type: "RPC_TAG"})
    } catch (e) {
      throw new Error('Invalid tag, must be one of latest, pending,earliest')
    }
  }
  const tx = {};
  tx.to = bindContractAddress;
  tx.data = generateAbiData({method: "getBindingAddress", owner, projectId});
  const params = [tx,tag];
  const body = {};
  body.method = 'eth_call';
  body.params = params;
  return request({
    method: 'post',
    body,
  })
}
