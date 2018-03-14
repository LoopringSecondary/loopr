import Account from "./Account";
import {getAddress, sign} from "../../common/Loopring/ethereum/trezor";
import Transaction from "../../common/Loopring/ethereum/transaction";
import EthTransaction from 'ethereumjs-tx'
import {signatureRecover} from '../../common/Loopring/ethereum/utils'
import {clearPrefix, toBuffer, toHex, addHexPrefix} from '../../common/Loopring/common/formatter'
import {wallets} from "../../common/config/data";
import HDKey from 'hdkey';
import {publicKeytoAddress} from "Loopring/ethereum/account";

export default class TrezorUnlockAccount extends Account {

  constructor(input) {
    super({unlockType: 'trezor'});
    const wallet = wallets.find(wallet => wallet.name.toUpperCase() === 'TREZOR (ETH)');
    this.dpath = wallet.dpath;
    this.publicKey = input.publicKey;
    this.chainCode = input.chainCode
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

  setIndex(index) {
    this.index = index
  }

  getAddress() {
    const hdk = new HDKey();
    hdk.publicKey = new Buffer(this.publicKey, 'hex');
    hdk.chainCode = new Buffer(this.chainCode, 'hex');
    const dkey = hdk.derive(`m/${this.index}`);
    return publicKeytoAddress(dkey.publicKey,true)
  }


  signMessage(message) {
    console.log("Trezor sign")
    //TODO
  }

  async signTx(rawTx) {
    return new Promise((resolve) => {
      const tx = [clearPrefix(rawTx.nonce), clearPrefix(rawTx.gasPrice), clearPrefix(rawTx.gasLimit), clearPrefix(rawTx.to),
        clearPrefix(rawTx.value) === '' ? null : clearPrefix(rawTx.value), clearPrefix(rawTx.data)].map(item => {
        if (item && item.length % 2 === 1) {
          return "0" + item
        }
        return item
      })
      window.TrezorConnect.ethereumSignTx(
        this.path,
        ...tx,
        rawTx.chainId,
        function (response) {
          if (response.success) {
            const newTx = new EthTransaction({
              ...rawTx,
              v: response.v,
              s: toBuffer(addHexPrefix(response.s)),
              r: toBuffer(addHexPrefix(response.r))
            })
            resolve({result: newTx.serialize()})
          } else {
            console.error('Error:', response.error); // error message
            resolve({error: response.error})
          }
        });
    })
  }

  async sendTransaction(tx) {
    let newTx = new Transaction(tx)
    await newTx.complete()
    const signed = await this.signTx(newTx.raw)
    if (signed.result) {
      return await newTx.sendRawTx(toHex(signed.result))
    } else {
      throw new Error(signed.error)
    }
  }
}
