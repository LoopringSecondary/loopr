import Account from "./Account";
import {fromMnemonic} from '../../common/Loopring/ethereum/account';
import EthTransaction from 'ethereumjs-tx'
import Transaction from "../../common/Loopring/ethereum/transaction";
import {toHex, toBuffer, addHexPrefix} from '../../common/Loopring/common/formatter'

export default class MnemonicUnlockAccount extends Account {

  constructor(input) {
    super({unlockType: 'mnemonic', address:input.address})
    this.mnemonic = input.mnemonic
    this.dpath = input.dpath
    this.password = input.password
    this.privateKey = input.privateKey
  }

  getAddress() {
    return super.getAddress()
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
