import validator from '../common/validator'
import {addHexPrefix, formatAddress, formatKey, toBuffer} from '../common/formatter'
import {decryptKeystoreToPkey, pkeyToKeystore} from '../common/keystore'
import {privateToAddress, privateToPublic, publicToAddress} from 'ethereumjs-util'
import {mnemonictoPrivatekey} from "../common/mnemonic";
import {generateMnemonic} from "bip39"
import {makeBlob, getFileName} from "../common/Blob";

const path = "m/44'/60'/0'/0/0";

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

export function publicKeytoAddress(publicKey,sanitize) {
  return formatAddress(publicToAddress(publicKey,sanitize))
}

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

export function create(password) {
  const mnemonic = generateMnemonic(256);
  const privateKey = mnemonictoPrivatekey(mnemonic, password, path);
  const publicKey = privateToPublic(privateKey);
  const address = privateToAddress(privateKey);
  return {
    mnemonic,
    privateKey: formatKey(privateKey),
    publicKey: formatKey(publicKey),
    address: formatAddress(address),
  }
}

export function encrypt(privateKey, password) {
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
  return pkeyToKeystore(privateKey, password) // keystoreJsonV3
}

export function decrypt(keystoreJsonV3, password) {
  const privateKey = decryptKeystoreToPkey(keystoreJsonV3, password); // privateKey
  const publicKey = privateToPublic(privateKey);
  const address = publicToAddress(publicKey);
  return {
    privateKey: formatKey(privateKey),
    publicKey: formatKey(publicKey),
    address: formatAddress(address),
  }
}

export function fromMnemonic(mnemonic, dpath, password) {
  const privateKey = mnemonictoPrivatekey(mnemonic, password, dpath || path);
  const publicKey = privateToPublic(privateKey);
  const address = privateToAddress(privateKey);
  return {
    mnemonic,
    privateKey: formatKey(privateKey),
    publicKey: formatKey(publicKey),
    address: formatAddress(address),
  }
}

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
  const publicKey = privateToPublic(privateKey);
  const address = privateToAddress(privateKey);
  return {
    privateKey: formatKey(privateKey),
    publicKey: formatKey(publicKey),
    address: formatAddress(address),
  }
}

export function download(privateKey, password, mime) {
  if (typeof privateKey === 'string') privateKey = toBuffer(addHexPrefix(privateKey));
  const address = privateKeytoAddress(privateKey);
  const fileName = getFileName(address);
  const content = encrypt(privateKey, password);
  const blob = makeBlob(content, mime || 'text/json;charset=UTF-8');
  return {fileName, blob, content}
}


