import Account from "./Account";
import EthTransaction from 'ethereumjs-tx'
import {toHex, toBuffer, addHexPrefix} from '../../common/Loopring/common/formatter'
import {privateKeytoAddress,download} from 'Loopring/ethereum/account';
import {sign} from 'Loopring/relay/order'
import {sendRawTransaction} from "../../common/Loopring/ethereum/utils";


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
    return this.signWithPrivateKey(message, this.privateKey)
  }

  async sendTransaction(host,tx) {
    tx.chainId = tx.chainId || 1;
    const ethTx = new EthTransaction(tx);
    ethTx.sign(toBuffer(addHexPrefix(this.privateKey)));
    const signed = toHex(ethTx.serialize());
    return await sendRawTransaction(host,{signedTx:signed});
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
