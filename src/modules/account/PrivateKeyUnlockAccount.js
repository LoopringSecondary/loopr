import Account from "./Account";
import EthTransaction from 'ethereumjs-tx'
import Transaction from "../../common/Loopring/ethereum/transaction";
import {toHex, toBuffer, addHexPrefix} from '../../common/Loopring/common/formatter'
import {privateKeytoAddress} from '../../common/Loopring/ethereum/account';

export default class PrivateKeyUnlockAccount extends Account {

  constructor(input) {
    const address = privateKeytoAddress(input.privateKey)
    super({unlockType: 'privateKey', address: address})
    this.privateKey = input.privateKey
  }

  getAddress() {
    super.getAddress()
  }

  signTx(rawTx){
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
