import Account from "./Account";
import EthTransaction from 'ethereumjs-tx'
import Transaction from "../../common/Loopring/ethereum/transaction";
import {toHex, toBuffer, addHexPrefix} from '../../common/Loopring/common/formatter'
import {privateKeytoAddress,download} from 'Loopring/ethereum/account';

export default class PrivateKeyUnlockAccount extends Account {

  constructor(input) {
    const address = privateKeytoAddress(input.privateKey);
    super({unlockType: 'privateKey', address: address,password:input.passsword});
    this.privateKey = input.privateKey;
  }

  getAddress() {
    super.getAddress()
  }

  signMessage(message) {
    console.log("private key sign");
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

  download(mime) {
    const privateKey = toBuffer(addHexPrefix(this.privateKey));
    return download(privateKey,this.password,mime)
  }

}
