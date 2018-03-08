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

  signTx(rawTx){
    console.log("private key sign")
    return this.signWithPrivateKey(rawTx, this.privateKey)
  }

  async sendTransaction(rawTx) {
    rawTx.from = this.address
    let tx = new Transaction(rawTx)
    await tx.complete()
    const ethTx = new EthTransaction(tx.raw);
    ethTx.sign(toBuffer(addHexPrefix(this.privateKey)));
    const signed = toHex(ethTx.serialize());
    return await tx.sendRawTx(signed)
  }
}
