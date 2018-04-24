import Account from "./Account";
import EthTransaction from 'ethereumjs-tx'
import Transaction from "../../common/Loopring/ethereum/transaction";
import {toHex, toBuffer, addHexPrefix} from '../../common/Loopring/common/formatter'
import {privateKeytoAddress,download} from 'Loopring/ethereum/account';
import {sign} from 'Loopring/relay/order'

export default class PrivateKeyUnlockAccount extends Account {

  constructor(input) {
    const address = privateKeytoAddress(input.privateKey);
    super({unlockType: 'PrivateKey', address: address,password:input.password});
    this.privateKey = input.privateKey;
  }

  getPrivateKey(){
    return this.privateKey;
  }

  signMessage(message) {
    console.log("private key sign");
    return this.signWithPrivateKey(message, this.privateKey)
  }

  async sendTransaction(tx) {
    let newTx = new Transaction(tx)
    await newTx.complete();
    const ethTx = new EthTransaction(newTx.raw);
    ethTx.sign(toBuffer(addHexPrefix(this.privateKey)));
    const signed = toHex(ethTx.serialize());
    const response =  await newTx.sendRawTx(signed)
    return {response,rawTx:newTx.raw}
  }

  download(password,mime) {
    const privateKey = toBuffer(addHexPrefix(this.privateKey));
    return download(privateKey,password,mime)
  }

 async signOrder(order){
    return new Promise((resolve)=>{
      resolve(sign(order,this.privateKey) )
    })
  }
}
