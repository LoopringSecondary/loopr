import Account from "./Account";
import {fromMnemonic} from '../../common/Loopring/ethereum/account';

export default class MnemonicUnlockAccount extends Account {

  constructor(input) {
    const wallet = fromMnemonic(input.mnemonic, input.dpath, input.password);
    super({unlockType: 'mnemonic', address:wallet.address})
    this.path = input.path
    this.mnemonic = input.mnemonic
    this.dpath = input.dpath
    this.password = input.password
    this.wallet = input.wallet
  }

  getAddress() {
    if(this.web3) return this.web3.eth.accounts[0]
    else return null
  }

  async signTx(rawTx){
    const signMethod = () => {
      return new Promise((resolve)=>{
        this.web3.eth.sign(this.account, this.web3.sha3(rawTx), function(error, result){
          if(!error){
            console.log(result);
            resolve(result)
          } else {
            console.error(error);
          }
        })
      })
    }
    if(this.web3) {
      return await signMethod()
    } else {
      //TODO
      console.log("no metamask")
    }
  }

  async sendTransaction(rawTx) {
    console.log("metamask:", rawTx)
    const send = () => {
      return new Promise((resolve) => {
        this.web3.eth.sendTransaction({...rawTx}, function(err, transactionHash) {
          if (!err) {
            console.log(transactionHash);
            resolve(transactionHash)
          } else {
            console.log(err);
          }
        });
      })
    }
    if(this.web3) {
      return await send()
    } else {
      //TODO
      console.log("no metamask")
    }
  }
}
