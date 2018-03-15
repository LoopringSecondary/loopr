import Account from "./Account";
import EthTransaction from 'ethereumjs-tx'
import Transaction from "../../common/Loopring/ethereum/transaction";
import * as fm from "../../common/Loopring/common/formatter";
import {getOrderHash} from "Loopring/relay/order";

export default class MetaMaskUnlockAccount extends Account {

  constructor(input) {
    if(input.web3 && input.web3.eth.accounts[0]) {
      super({unlockType: 'metamask', address: input.web3.eth.accounts[0]})
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
        // this.web3.personal.sign('0x68e5a63aa6ce880629b509c4aebf7ccfc025bfc28297f6b6b5489f9a24bfa0b9', this.account, function(err, result){
        //   const r = fm.addHexPrefix(result.slice(0,64));
        //   const s = fm.addHexPrefix(result.slice(64,128));
        //   const v = fm.toNumber(fm.addHexPrefix(result.slice(128,130)));
        //   console.log(result.slice(128,130))
        //   resolve({r:r, s:s, v:v})
        // })
        this.web3.eth.sign(this.account, '0x65e5fcf3706e3160eba2548883e13c16dd51dab6e8392d5b287f7f7d78f62bdb', function(err, result){
          if(!err){
            const r = fm.addHexPrefix(result.slice(0,64));
            const s = fm.addHexPrefix(result.slice(64,128));
            const v = fm.toNumber(fm.addHexPrefix(result.slice(128,130)));
            console.log(result.slice(128,130))
            resolve({r:r, s:s, v:v})
          } else {
            console.error(err);
            const errorMsg = err.message.substring(0, err.message.indexOf(' at '))
            resolve({error:{message:errorMsg}})
          }
        })

        /*
        const msgParams = [
          {
            type: 'address',      // Any valid solidity type
            name: 'protocol',     // Any string label you want
            value: "0x6870830c79210e0fff6751d382938f4018b23f01"  // The value to sign
          },
          {
            type: 'address',
            name: 'owner',
            value: '0xee0e807969e118b033dab40050618ee17f730a2b'
          },
          {
            type: 'address',      // Any valid solidity type
            name: 'tokenS',     // Any string label you want
            value: '0xEF68e7C694F40c8202821eDF525dE3782458639f'  // The value to sign
          },
          {
            type: 'address',      // Any valid solidity type
            name: 'tokenB',     // Any string label you want
            value: '0x2956356cD2a2bf3202F771F50D3D14A367b48070'  // The value to sign
          },
          {
            type: 'address',      // Any valid solidity type
            name: 'authAddr',     // Any string label you want
            value: '0xa73090ae54e6ae22c40b5f0b4969febd2c9797fb'  // The value to sign
          },
          {
            type: 'uint',      // Any valid solidity type
            name: 'amountS',     // Any string label you want
            value: '0x1bc16d674ec80000'  // The value to sign
          },
          {
            type: 'uint',      // Any valid solidity type
            name: 'amountB',     // Any string label you want
            value: '0x1bc16d674ec80000'  // The value to sign
          },
          {
            type: 'uint',      // Any valid solidity type
            name: 'validSince',     // Any string label you want
            value: '0x5aaa33e1'  // The value to sign
          },
          {
            type: 'uint',      // Any valid solidity type
            name: 'validUntil',     // Any string label you want
            value: '0x5ad1c0e1'  // The value to sign
          },
          {
            type: 'uint',      // Any valid solidity type
            name: 'lrcFee',     // Any string label you want
            value: '0xaf375e923aba500000'  // The value to sign
          },
          {
            type: 'bool',      // Any valid solidity type
            name: 'buyNoMoreThanAmountB',     // Any string label you want
            value: false  // The value to sign
          },
          {
            type: 'uint',      // Any valid solidity type
            name: 'walletId',     // Any string label you want
            value: '0x1'  // The value to sign
          },
          {
            type: 'uint8',      // Any valid solidity type
            name: 'marginSplitPercentage',     // Any string label you want
            value: 50  // The value to sign
          }
        ]

        this.web3.currentProvider.sendAsync({
          method: 'eth_signTypedData',
          params: [msgParams, this.account],
          from: this.account,
        }, function (err, result) {
          console.log(result)
          const r = fm.addHexPrefix(result.result.slice(0,64));
              const s = fm.addHexPrefix(result.result.slice(64,128));
              const v = fm.toNumber(fm.addHexPrefix(result.result.slice(128,130)));
              console.log(result.result.slice(128,130))
              resolve({r:r, s:s, v:v})
        })
        */
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
      return await sendMethod()
    } else {
      throw new Error("Not found MetaMask")
    }
  }

  async signOrder(order) {
    const newOrder = {}
    newOrder.amountB = "0x1bc16d674ec80000"
    newOrder.amountS = "0x1bc16d674ec80000"
    newOrder.authAddr = "0xa73090ae54e6ae22c40b5f0b4969febd2c9797fb"
    newOrder.authPrivateKey = "016680d107a3a30bd2488b6d9c2cb1843b7038dc8dfebf99bac6d8652caa2094"
    newOrder.buyNoMoreThanAmountB = false
    newOrder.lrcFee = "0xaf375e923aba500000"
    newOrder.marginSplitPercentage = 50
    newOrder.owner = "0xee0e807969e118b033dab40050618ee17f730a2b"
    newOrder.protocol = "0x6870830c79210e0fff6751d382938f4018b23f01"
    newOrder.tokenB = "0x2956356cD2a2bf3202F771F50D3D14A367b48070"
    newOrder.tokenS = "0xEF68e7C694F40c8202821eDF525dE3782458639f"
    newOrder.validSince = "0x5aaa33e1"
    newOrder.validUntil = "0x5ad1c0e1"
    newOrder.walletId = "0x1"
    const hash = getOrderHash(newOrder);
    const signed = await this.signMessage(hash.toString('hex'))
    return {...order, ...signed};
  }
}
