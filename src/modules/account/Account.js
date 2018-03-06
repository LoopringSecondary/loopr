import Transaction from "../../common/Loopring/ethereum/transaction";

export default class Account {

  constructor(input) {
    this.unlockType = input.unlockType
    this.address = input.address
  }

  getAddress() {
    return this.address
  }

  isUnlocked() {
    return this.unlockType !== ''
  }

  getUnlockedType() {
    return this.unlockType
  }

  signWithPrivateKey(rawTx, privateKey) {
    let tx = new Transaction(rawTx)
    return tx.sign(privateKey)
  }
}
