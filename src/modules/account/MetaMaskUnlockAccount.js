import Account from "./Account";

export default class MetaMaskUnlockAccount extends Account {

  constructor(input) {
    if(input.web3) {
      super({unlockType: 'metamask', address: input.web3.eth.accounts[0]})
      this.web3 = input.web3
      this.account = this.web3.eth.accounts[0]
      console.log(this.account)
      this.web3.version.getNetwork((err, netId) => {
        if(netId !== '1') throw new Error("Sorry, we currently only support MetaMask mainnet")
      })
    }
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
