import Account from "./Account";

export default class AddressUnlockAccount extends Account {

  constructor(input) {
    super({unlockType: 'Address', address: input.address})
  }

  async signMessage(hash){
    throw new Error("Current wallet unlocked by address, do not support this operation")
  }

  async sendTransaction(tx) {
    throw new Error("Current wallet unlocked by address, do not support this operation")
  }

  async signOrder(order) {
    throw new Error("Current wallet unlocked by address, do not support this operation")
  }
}
