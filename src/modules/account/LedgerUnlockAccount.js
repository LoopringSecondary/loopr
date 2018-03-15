import Account from "./Account";
import Transaction from "../../common/Loopring/ethereum/transaction";
import EthTransaction from 'ethereumjs-tx'
import { toBuffer, addHexPrefix, bufferToHex } from 'ethereumjs-util';
import {signatureRecover} from '../../common/Loopring/ethereum/utils'
import {toHex} from '../../common/Loopring/common/formatter'
import trimStart from 'lodash/trimStart';
import HDKey from 'hdkey';
import {publicKeytoAddress} from "Loopring/ethereum/account";
import {getOrderHash} from "Loopring/relay/order";

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
      const hdk = new HDKey();
      hdk.publicKey = new Buffer(this.publicKey, 'hex');
      hdk.chainCode = new Buffer(this.chainCode, 'hex');
      const dkey = hdk.derive(`m/${input.index}`);
      this.setAddress(publicKeytoAddress(dkey.publicKey,true));
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
    return new Promise((resolve, reject) => {
      this.ledger
        .signPersonalMessage_async(this.dpath+"/"+this.index, msg).then(result => {
        if (result.error) {
          return reject(this.ledger.getError(result.error));
        }

        try {
          resolve({v:result.v, r:addHexPrefix(result.r), s:addHexPrefix(result.s)});
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
            v: result.v,
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
    const signed = await this.signRawTransaction(new EthTransaction(newTx.raw))
    if(signed.result){
      return await newTx.sendRawTx(toHex(signed.result))
    } else {
      throw new Error(signed.error)
    }
  }

  async signOrder(order) {
    const newOrder = {}
    newOrder.amountB = "0x1bc16d674ec80000"
    newOrder.amountS = "0x1bc16d674ec80000"
    newOrder.authAddr = "0xa73090ae54e6ae22c40b5f0b4969febd2c9797fb"
    newOrder.authPrivateKey = "016680d107a3a30bd2488b6d9c2cb1843b7038dc8dfebf99bac6d8652caa2094"
    newOrder.buyNoMoreThanAmountB = false
    newOrder.lrcFee = "0xaf375e923aba500000"
    newOrder.marginSplitPercentage = 50
    newOrder.owner = "0xee0e807969e118b033dab40050618ee17f730a2b"
    newOrder.protocol = "0x6870830c79210e0fff6751d382938f4018b23f01"
    newOrder.tokenB = "0x2956356cD2a2bf3202F771F50D3D14A367b48070"
    newOrder.tokenS = "0xEF68e7C694F40c8202821eDF525dE3782458639f"
    newOrder.validSince = "0x5aaa33e1"
    newOrder.validUntil = "0x5ad1c0e1"
    newOrder.walletId = "0x1"
    console.log("order:", newOrder)
    const hash = getOrderHash(newOrder);
    const signed = await this.signMessage(hash.toString('hex'))
    console.log("signed:",signed)
    return {...order, ...signed};
  }
}
