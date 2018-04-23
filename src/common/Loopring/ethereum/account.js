require('babel-polyfill');
import validator from '../common/validator'
import {addHexPrefix, clearHexPrefix, formatAddress, formatKey, toBuffer, toHex, toNumber} from '../common/formatter'
import {decryptKeystoreToPkey, pkeyToKeystore} from './keystore'
import {privateToAddress, privateToPublic, publicToAddress, sha3, hashPersonalMessage, ecsign} from 'ethereumjs-util'
import {mnemonictoPrivatekey} from "./mnemonic";
import {generateMnemonic} from "bip39";
import {trimAll} from "../common/utils";
import HDKey from 'hdkey';
import EthTransaction from 'ethereumjs-tx';
import {getOrderHash} from "../relay/order";
import * as Trezor from "./trezor";
import * as Ledger from "./ledger";

const wallets = require('../../config/wallets.json');
const LoopringWallet = wallets.find(wallet => trimAll(wallet.name).toLowerCase() === 'loopringwallet');
export const path = LoopringWallet.dpath;

/**
 * @description Returns the ethereum address  of a given private key
 * @param privateKey
 * @returns {string}
 */
export function privateKeytoAddress(privateKey) {
  try {
    if (typeof privateKey === 'string') {
      validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
      privateKey = toBuffer(addHexPrefix(privateKey))
    } else {
      validator.validate({value: privateKey, type: 'PRIVATE_KEY_BUFFER'});
    }
  } catch (e) {
    throw new Error('Invalid private key')
  }
  return formatAddress(privateToAddress(privateKey))
}

/**
 * @description Returns the ethereum address of a given public key.
 * Accepts "Ethereum public keys" and SEC1 encoded keys.
 * @param publicKey Buffer | string
 * @param sanitize bool [sanitize=false] Accept public keys in other formats
 * @returns {string}
 */
export function publicKeytoAddress(publicKey, sanitize) {
  publicKey = toBuffer(publicKey);
  return formatAddress(publicToAddress(publicKey, sanitize))
}

/**
 *
 * @param publicKey
 * @param chainCode
 * @param pageSize
 * @param pageNum
 * @returns {<Array>}
 */
export function getAddresses({publicKey, chainCode, pageSize, pageNum}) {
  const addresses = [];
  const hdk = new HDKey();
  hdk.publicKey = new Buffer(publicKey, 'hex');
  hdk.chainCode = new Buffer(chainCode, 'hex');
  for (let i = 0; i < pageSize; i++) {
    const dkey = hdk.derive(`m/${i + pageSize * pageNum}`);
    addresses.push(publicKeytoAddress(dkey.publicKey, true));
  }
  return addresses;
}

/**
 * @description Returns the ethereum public key of a given private key.
 * @param privateKey Buffer | string
 * @returns {string}
 */
export function privateKeytoPublic(privateKey) {
  try {
    if (typeof privateKey === 'string') {
      validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
      privateKey = toBuffer(addHexPrefix(privateKey))
    } else {
      validator.validate({value: privateKey, type: 'PRIVATE_KEY_BUFFER'});
    }
  } catch (e) {
    throw new Error('Invalid private key')
  }
  return formatKey(privateToPublic(privateKey))
}

/**
 * @description Returns Account of given mnemonic, dpath and password
 * @param mnemonic string
 * @param dpath string
 * @param password string
 * @returns {Account}
 */
export function fromMnemonic(mnemonic, dpath, password) {
  return new MnemonicAccount({mnemonic, dpath, password})
}

/**
 * @description Returns Account of a given private key
 * @param privateKey string | buffer
 * @returns {Account}
 */
export function fromPrivateKey(privateKey) {
  try {
    if (typeof privateKey === 'string') {
      validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
      privateKey = toBuffer(addHexPrefix(privateKey))
    } else {
      validator.validate({value: privateKey, type: 'PRIVATE_KEY_BUFFER'});
    }
  } catch (e) {
    throw new Error('Invalid private key')
  }
  return new KeyAccount(privateKey)
}

/**
 * @description Returns Account of the given keystore
 * @param keystore string
 * @param password string
 * @returns {Account}
 */
export function fromKeystore(keystore, password) {
  const privateKey = decryptKeystoreToPkey(keystore, password); // privateKey
  return new Account(privateKey)
}

/**
 * @description  Returns a new account with given password and dpath
 * @param password
 * @param dpath
 * @returns {MnemonicAccount}
 */
export function generateNewAccount(password, dpath) {
  const mnemonic = generateMnemonic(256);
  dpath = dpath || path;
  return new MnemonicAccount({mnemonic, password, dpath})
}

export class Account {

  getAddress() {
    throw Error('unimplemented')
  }


  /**
   * @description sign
   * @param hash
   */
  sign(hash){
    throw Error('unimplemented')
  }

  /**
   * @description Returns serialized signed ethereum tx
   * @param rawTx
   * @returns {string}
   */
  signEthereumTx(rawTx) {
    throw Error('unimplemented')
  }

  /**
   * @description Returns given order along with r, s, v
   * @param order
   */
  signOrder(order) {
    throw Error('unimplemented')
  }

  /**
   * @description Calculates an Ethereum specific signature with: sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))).
   * @param message string
   */
  signMessage(message) {
    throw Error('unimplemented')
  }

}

export class KeyAccount extends Account {
  /**
   * @property
   * @param privateKey string | Buffer
   */
  constructor(privateKey) {
    super();
    try {
      if (typeof privateKey === 'string') {
        validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
        privateKey = toBuffer(addHexPrefix(privateKey))
      } else {
        validator.validate({value: privateKey, type: 'PRIVATE_KEY_BUFFER'});
      }
    } catch (e) {
      throw new Error('Invalid private key')
    }
    this.privateKey = privateKey;
  }

  /**
   * @description Return V3 type keystore of this account
   * @param password
   * @returns {{version, id, address, crypto}}
   */
  toV3Keystore(password) {
    return pkeyToKeystore(this.privateKey, password)
  }

  /**
   * Returns ethereum public key of this account
   * @returns {string}
   */
  getPublicKey() {
    return privateKeytoPublic(this.privateKey)
  }

  /**
   * @description Returns ethereum private key of this account
   * @returns {string}
   */
  getPrivateKey() {
    return formatKey(this.privateKey)
  }

  getAddress() {
    return privateKeytoAddress(this.privateKey);
  };

  sign(hash) {
    hash = toBuffer(hash);
    return ecsign(hash, this.privateKey);
  };

  signMessage(message) {
    const hash = sha3(message);
    const finalHash = hashPersonalMessage(hash);
    return this.sign(finalHash)
  };

  signEthereumTx(rawTx) {
    validator.validate({type: 'TX', value: rawTx});
    const ethTx = new EthTransaction(rawTx);
    ethTx.sign(this.privateKey);
    return toHex(ethTx.serialize());
  }

  signOrder(order) {
    const hash = getOrderHash(order);
    const signature = ecsign(hashPersonalMessage(hash), this.privateKey);
    const v = toNumber(signature.v);
    const r = toHex(signature.r);
    const s = toHex(signature.s);
    return {
      ...order, v, r, s
    }
  }
}

export class MnemonicAccount extends KeyAccount {

  /**
   * @property
   * @param mnemonic string
   * @param password string
   * @param path string
   */
  constructor({mnemonic, password, dpath}) {
    if (mnemonic && dpath) {
      const privateKey = mnemonictoPrivatekey(mnemonic, password, dpath);
      super(privateKey);
      this.mnemonic = mnemonic;
      this.password = password;
      this.dpath = dpath;
    } else {
      throw new Error('mnemonic or dpath can\'t be null');
    }
  }

  /**
   * @description Returns mnemonic of this account
   * @returns {string}
   */
  getMnemonic() {
    return this.mnemonic;
  }

  /**
   * @description Returns password of this account
   * @returns {string}
   */
  getPassword() {
    return this.password;
  }

  /**
   * @description Returns dpath of this account
   * @returns {string}
   */
  getDpath() {
    return this.dpath
  }
}

export class TrezorAccount extends Account {

  constructor(dpath) {
    super();
    this.dpath = dpath
  }

  async getAddress() {
    const result = Trezor.getAddress(this.dpath);
    if (result.error) {
      throw new Error(result.error)
    } else {
      return result.result;
    }
  }

  async signMessage(message) {
    const result = await Trezor.signMessage(this.dpath, message)
    if (result.error) {
      throw new Error(result.error)
    } else {
      return result.result;
    }
  }

  async signEthereumTx(rawTX) {
    const result = await Trezor.signMessage(this.dpath, rawTX)
    if (result.error) {
      throw new Error(result.error)
    } else {
      return result.result;
    }
  }

}

export class LedgerAccount extends Account {

  constructor(ledger, dpath) {
    super();
    this.ledger = ledger;
    this.dpath = dpath;
  }

  async getAddress() {
    const result = await Ledger.getXPubKey(this.dpath, this.ledger);
    if (result.error) {
      throw new Error(result.error)
    } else {
      return result.result.address;
    }
  }

  async signMessage(message) {
    const result = await Ledger.signMessage(this.dpath, message, this.ledger)
    if (result.error) {
      throw new Error(result.error)
    } else {
      return result.result;
    }
  }

  async signEthereumTx(rawTx) {
    const result = await Ledger.signEthereumTx(this.dpath, rawTx, this.ledger);
    if (result.error) {
      throw new Error(result.error)
    } else {
      return result.result;
    }
  }

  async signOrder(order) {
    const hash = getOrderHash(order);
    const result = await Ledger.signMessage(this.dpath, clearHexPrefix(toHex(hash)), this.ledger);
    if (result.error) {
      throw new Error(result.error)
    } else {
      return {...order, ...result.result};
    }
  }
}

export class MetaMaskAccount extends Account {

  constructor(input) {
    if (input.web3 && input.web3.eth.accounts[0]) {
      super();
      this.web3 = input.web3;
      this.account = this.web3.eth.accounts[0];
    }
  }

  getAddress() {
    if (this.web3 && this.web3.eth.accounts[0]) return this.web3.eth.accounts[0]
    else return null
  }

  sign(hash){
    return new Promise((resolve) => {
      this.web3.eth.sign(this.account, hash, function (err, result) {
        if (!err) {
          const r = result.slice(0, 66);
          const s = addHexPrefix(result.slice(66, 130));
          const v = toNumber(addHexPrefix(result.slice(130, 132)));
          resolve({r, s, v})
        } else {
          console.error(err);
          const errorMsg = err.message.substring(0, err.message.indexOf(' at '))
          resolve({error: {message: errorMsg}})
        }
      })
    })
  }


  async signMessage(message) {
    const hash = hashPersonalMessage(sha3(message));
    if (this.web3 && this.web3.eth.accounts[0]) {
      return await sign(hash)
    } else {
      throw new Error("Not found MetaMask")
    }
  }

  async signEthereumTx(rawTx) {
    validator.validate({type: 'TX', value: rawTx});
    const ethTx = new EthTransaction(rawTx);
    const hash = toHex(ethTx.hash(false));
    const signature = this.sign(hash);
    signature.v += ethTx._chainId * 2 +8;
    Object.assign(ethTx,signature);
    return toHex(ethTx.serialize());
  }

  signOrder(order) {
    const hash = toHex(hashPersonalMessage(getOrderHash(order)));
    const signature = this.signMessage(hash);
    return {...order, ...signature};
  }

  async sendTransaction(tx) {
    validator.validate({type: 'TX', value: tx});
    const sendMethod = () => {
      return new Promise((resolve)=>{
        this.web3.eth.sendTransaction(tx, function(err, transactionHash) {
          if (!err){
            resolve({result:transactionHash})
          } else {
            const errorMsg = err.message.substring(0, err.message.indexOf(' at '))
            resolve({error:{message:errorMsg}})
          }
        })
      })
    };
    if(this.web3 && this.web3.eth.accounts[0]) {
      return await sendMethod()
    } else {
      throw new Error("Not found MetaMask")
    }
  }

}
