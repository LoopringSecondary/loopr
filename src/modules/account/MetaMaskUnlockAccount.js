import Account from "./Account";
import {hashPersonalMessage} from "ethereumjs-util"
import Transaction from "../../common/Loopring/ethereum/transaction";
import * as fm from "../../common/Loopring/common/formatter";
import {getOrderHash} from "Loopring/relay/order";

export default class MetaMaskUnlockAccount extends Account {

  constructor(input) {
    if(input.web3 && input.web3.eth.accounts[0]) {
      super({unlockType: 'MetaMask', address: input.web3.eth.accounts[0]})
      this.web3 = input.web3
      this.account = this.web3.eth.accounts[0]
      this.web3.version.getNetwork((err, netId) => {
        if(netId !== '1') throw new Error("Sorry, we currently only support MetaMask using Ethereum mainnet")
      })
    }
  }

  getAddress() {
    if(this.web3 && this.web3.eth.accounts[0]) return this.web3.eth.accounts[0]
    else return null
  }

  async signMessage(hash){
    const signMethod = () => {
      return new Promise((resolve)=>{
        this.web3.eth.sign(this.account, hash, function(err, result){
          if(!err){
            const r = result.slice(0,66);
            const s = fm.addHexPrefix(result.slice(66,130));
            const v = fm.toNumber(fm.addHexPrefix(result.slice(130,132)));
            resolve({r, s, v})
          } else {
            console.error(err);
            const errorMsg = err.message.substring(0, err.message.indexOf(' at '))
            resolve({error:{message:errorMsg}})
          }
        })
      })
    }
    if(this.web3 && this.web3.eth.accounts[0]) {
      return await signMethod()
    } else {
      throw new Error("Not found MetaMask")
    }
  }

  async sendTransaction(tx) {
    let newTx = new Transaction(tx)
    await newTx.complete()
    /**
     * Could not use `web3.eth.sign()` to get signedTx and use `sendRawTransaction(signed)` to send due to the reason below, so use `sendTransaction` supported by Metamask directly
     * In addition to this, you can sign arbitrary data blobs using web3.eth.sign(fromAddress, data, callback), although it has protections to sign it differently than a transaction, so users aren't tricked into signing transactions using this method.
     */
    const sendMethod = () => {
      return new Promise((resolve)=>{
        this.web3.eth.sendTransaction(newTx.raw, function(err, transactionHash) {
          if (!err){
            resolve({result:transactionHash})
          } else {
            const errorMsg = err.message.substring(0, err.message.indexOf(' at '))
            resolve({error:{message:errorMsg}})
          }
        })
      })
    }
    if(this.web3 && this.web3.eth.accounts[0]) {
      const response =  await sendMethod();
      return {response,rawTx:newTx.raw};
    } else {
      throw new Error("Not found MetaMask")
    }
  }

  async signOrder(order) {
    const hash = getOrderHash(order);
    const signed = await this.signMessage(fm.toHex(hashPersonalMessage(hash)))
    if(signed.error) {
      let errorMsg = signed.error.message
      if(errorMsg && errorMsg.startsWith("Error:")){
        errorMsg = errorMsg.substr(6)
      }
      throw new Error(errorMsg)
    } else {
      return {...order, ...signed};
    }
  }
}
