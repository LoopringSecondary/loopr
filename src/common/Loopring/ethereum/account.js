require('babel-polyfill');
import validator from '../common/validator'
import {addHexPrefix, formatAddress, formatKey, toBuffer} from '../common/formatter'
import {decryptKeystoreToPkey, pkeyToKeystore} from './keystore'
import {privateToAddress, privateToPublic, publicToAddress} from 'ethereumjs-util'
import {mnemonictoPrivatekey} from "./mnemonic";
import {generateMnemonic} from "bip39";
import {trimAll} from "../common/utils";
import HDKey from 'hdkey';
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

export async function getAddresses({publicKey,chainCode,pageSize, pageNum}) {
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
  const privateKey = mnemonictoPrivatekey(mnemonic, password, dpath || path);
  return new Account(privateKey)
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
  return new Account(privateKey)
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
  /**
   * @description Returns ethereum address of this account
   * @returns {string}
   */
  getAddress() {
    return privateKeytoAddress(this.privateKey)
  }

  signEthereumTx(){

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
}

export class MnemonicAccount extends KeyAccount {

  /**
   * @property
   * @param mnemonic string
   * @param password string
   * @param path string
   */
  constructor({mnemonic, password, dpath}) {
    const privateKey = mnemonictoPrivatekey(mnemonic, password, dpath);
    super(privateKey);
    this.mnemonic = mnemonic;
    this.password = password;
    this.dpath = dpath;
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
  getPath() {
    return this.dpath
  }
}



