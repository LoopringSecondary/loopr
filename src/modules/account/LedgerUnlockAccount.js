import Account from "./Account";
import {getAddress,sign} from "../../common/Loopring/ethereum/trezor";
import Transaction from "../../common/Loopring/ethereum/transaction";
import EthTransaction from 'ethereumjs-tx'
import { toBuffer, addHexPrefix, bufferToHex } from 'ethereumjs-util';
import {signatureRecover} from '../../common/Loopring/ethereum/utils'
import {clearPrefix,toHex} from '../../common/Loopring/common/formatter'
import trimStart from 'lodash/trimStart';

export default class LedgerUnlockAccount extends Account {

  constructor(input) {
    super({unlockType: 'ledger'})
    this.ledger = input.ledger
  }

  selected(input){
    this.dpath = input.dpath
    this.index = input.index
    super.setAddress(input.address)
  }

  getAddress() {
    return super.getAddress()
  }

  signMessage(message){
    console.log("Ledger sign")
    //TODO
  }

  getPathAddress(dpath, index) {
    return new Promise((resolve, reject) => {
      this.ledger.getAddress_async(dpath + "/" + index, false, true)
        .then(res => {
          console.log(dpath + "/" + index)
          resolve(res)
        })
        .catch(err => {
          console.error("error:", err)
          resolve({error:err})
        });
    })
  }

  hexEncodeQuantity(value) {
    const trimmedValue = trimStart((value).toString('hex'), '0');
    return addHexPrefix(trimmedValue === '' ? '0' : trimmedValue);
  }

// When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.
  hexEncodeData(value) {
    return bufferToHex(toBuffer(value));
  }

  // Get useable fields from an EthTx object.
  getTransactionFields = (t) => {
    // For some crazy reason, toJSON spits out an array, not keyed values.
    const { data, gasLimit, gasPrice, to, nonce, value } = t;

    const chainId = t.getChainId();

    return {
      value: this.hexEncodeQuantity(value),
      data: this.hexEncodeData(data),
      // To address is unchecksummed, which could cause mismatches in comparisons
      to: this.hexEncodeData(to),
      // Everything else is as-is
      nonce: this.hexEncodeQuantity(nonce),
      gasPrice: this.hexEncodeQuantity(gasPrice),
      gasLimit: this.hexEncodeQuantity(gasLimit),
      chainId
    };
  };

  signRawTransaction(t) {
    t.v = Buffer.from([t._chainId]);
    t.r = toBuffer(0);
    t.s = toBuffer(0);

    return new Promise((resolve, reject) => {
      this.ledger
        .signTransaction_async(this.dpath+"/"+this.index, t.serialize().toString('hex'))
        .then(result => {
          const strTx = this.getTransactionFields(t);
          const txToSerialize = {
            ...strTx,
            v: addHexPrefix(result.v),
            r: addHexPrefix(result.r),
            s: addHexPrefix(result.s)
          };

          const eth = new EthTransaction(txToSerialize)
          const serializedTx = eth.serialize();
          resolve({result:serializedTx});
        })
        .catch(err => {
          return reject(Error(err + '. Check to make sure contract data is on'));
        });
    });
  }

  async sendTransaction(tx) {
    let newTx = new Transaction(tx)
    await newTx.complete()
    console.log("raw:", newTx.raw)
    const signed = await this.signRawTransaction(new EthTransaction(newTx.raw))
    if(signed.result){
      console.log(toHex(signed.result))
      return await newTx.sendRawTx(toHex(signed.result))
    } else {
      throw new Error(signed.error)
    }
  }
}
