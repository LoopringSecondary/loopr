import Account from "./Account";

export default class MnemonicUnlockAccount extends Account {

  constructor(input) {
    super({unlockType: 'mnemonic'})
    this.path = input.path
    this.mnemonic = input.mnemonic
    this.privateKey = input.privateKey
  }

  sign(rawTx){

  }
}
