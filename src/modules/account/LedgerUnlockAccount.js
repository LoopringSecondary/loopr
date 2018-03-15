import Account from "./Account";
import {getAddress,sign} from "../../common/Loopring/ethereum/trezor";
import Transaction from "../../common/Loopring/ethereum/transaction";
import EthTransaction from 'ethereumjs-tx'
import { toBuffer, addHexPrefix, bufferToHex } from 'ethereumjs-util';
import {signatureRecover} from '../../common/Loopring/ethereum/utils'
import {clearPrefix,toHex} from '../../common/Loopring/common/formatter'
import trimStart from 'lodash/trimStart';

import HDKey from 'hdkey';
import {publicKeytoAddress} from "Loopring/ethereum/account";

export default class LedgerUnlockAccount extends Account {

  constructor(input) {
    super({unlockType: 'ledger'})
    this.ledger = input.ledger
  }

  getAddresses(pageSize, pageNum) {
    const addresses = [];
    const hdk = new HDKey();
    hdk.publicKey = new Buffer(this.publicKey, 'hex');
    hdk.chainCode = new Buffer(this.chainCode, 'hex');
    for (let i = 0; i < pageSize; i++) {
      const dkey = hdk.derive(`m/${i + pageSize * pageNum}`);
      addresses.push(publicKeytoAddress(dkey.publicKey,true));
    }
    return addresses;
  }

  async getIndexAddress(index) {
    await this.ledger.getAddress_async(this.dpath + "/" + index, false, true)
  }

  getPathAddress(dpath, index) {
    return new Promise((resolve, reject) => {
      this.ledger.getAddress_async(dpath + "/" + index, false, true)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.error("error:", err)
          resolve({error:err})
        });
    })
  }

  getPublicKey(dpath) {
    return new Promise((resolve, reject) => {
      this.ledger.getAddress_async(dpath, false, true)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.error("error:", err)
          resolve({error:err})
        });
    })
  }

  setPublicKey(input) {
    this.publicKey = input.publicKey
    this.chainCode = input.chainCode
  }

  setIndex(input) {
    this.dpath = input.dpath
    this.index = input.index
    if(this.dpath && this.index >-1) {
      return new Promise((resolve, reject) => {
        this.ledger.getAddress_async(this.dpath + "/" + this.index, false, true)
          .then(res => {
            if(input.address) {
              if(res.address === input.address) {
                this.address = input.address
                resolve(res)
              } else {
                resolve({error:"Mismatch index and address"})
              }
            } else {
              resolve(res)
            }
          })
          .catch(err => {
            console.error("error:", err)
            resolve({error:err})
          });
      })
    } else {
      throw new Error("dpath and index has not selected")
    }
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

  signMessage(msg) {
    const msgHex = Buffer.from(msg).toString('hex');

    return new Promise((resolve, reject) => {
      this.ledger
        .signPersonalMessage_async(this.getPath(), msgHex, async (signed, error) => {
        if (error) {
          return reject(this.ledger.getError(error));
        }

        try {
          resolve(signed);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

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
