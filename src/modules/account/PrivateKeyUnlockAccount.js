import Account from "./Account";
import Transaction from "../../common/Loopring/ethereum/transaction";
import {getTransactionCount} from '../../common/Loopring/ethereum/utils';
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
    console.log("private key sign")
    return this.signWithPrivateKey(rawTx, this.privateKey)
  }

  async sendTransaction(rawTx) {
    let tx = new Transaction(rawTx)
    const signed = await this.sign(rawTx)
    return await tx.sendSignedTx(signed)
  }
}
