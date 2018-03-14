import Account from "./Account";
import {fromMnemonic, download, privateKeytoAddress} from '../../common/Loopring/ethereum/account';
import EthTransaction from 'ethereumjs-tx'
import Transaction from "../../common/Loopring/ethereum/transaction";
import {toHex, toBuffer, addHexPrefix} from '../../common/Loopring/common/formatter'

export default class MnemonicUnlockAccount extends Account {

  constructor(input) {
    super({unlockType: 'mnemonic', address: input.address, password: input.password});
    this.mnemonic = input.mnemonic;
    this.dpath = input.dpath;
    this.index = input.index;
    this.privateKey = input.privateKey;
  }

  setIndex(index) {
    this.index = index;
    if(this.mnemonic && this.dpath){
      const account = fromMnemonic(this.mnemonic, this.dpath.concat(`/${index}`), this.password);
      this.setPrivateKey(account.privateKey);
    }
  }

  setPrivateKey(privateKey) {
    this.privateKey = privateKey;
    this.address = privateKeytoAddress(privateKey)
  }

  getPrivateKey(){
    return this.privateKey;
  }

  getMnemonic(){
    return this.mnemonic
  }
  getAddresses(pageSize, pageNum) {
    const addresses = [];
    for (let i = 0; i < pageSize; i++) {
      addresses.push(fromMnemonic(this.mnemonic, this.dpath.concat(`/${pageSize * pageNum + i}`), this.password).address)
    }
    return addresses;
  }

  signMessage(message) {
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

  download(password,mime) {
    password = password || this.password;
    const privateKey = toBuffer(addHexPrefix(this.privateKey));
    return download(privateKey, password, mime)
  }
}
