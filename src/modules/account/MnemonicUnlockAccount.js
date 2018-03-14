import Account from "./Account";
import {fromMnemonic} from '../../common/Loopring/ethereum/account';
import EthTransaction from 'ethereumjs-tx'
import Transaction from "../../common/Loopring/ethereum/transaction";
import {toHex, toBuffer, addHexPrefix} from '../../common/Loopring/common/formatter'

export default class MnemonicUnlockAccount extends Account {

  constructor(input) {
    super({unlockType: 'mnemonic'});
    this.mnemonic = input.mnemonic;
    this.dpath = input.dpath;
    this.password = input.password
  }

  getAddress() {
    return this.address
  }

  setIndex(index){
    this.index = index
  }
  setPrivateKey(privateKey){
    this.privateKey = privateKey;
  }

  getAddresses(pageSize,pageNum){
    const addresses=[];
    for(let i =0;i< pageSize;i++){
      addresses.push(fromMnemonic(this.mnemonic,this.dpath.concat(`/${pageSize * pageNum + i}`),this.password).address)
    }
    return addresses;
  }
  signMessage(message){
    console.log("private key sign")
    return this.signWithPrivateKey(message, this.privateKey)
  }

  async sendTransaction(tx) {
    let newTx = new Transaction(tx)
    await newTx.complete()
    const ethTx = new EthTransaction(newTx.raw);
    ethTx.sign(toBuffer(addHexPrefix(this.privateKey)));
    const signed = toHex(ethTx.serialize());
    return await newTx.sendRawTx(signed)
  }
}
