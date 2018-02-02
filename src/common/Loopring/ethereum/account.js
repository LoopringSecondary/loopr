import validator from '../common/validator'
import {toHex, toBuffer,formatKey,formatAddress} from '../common/formatter'
import {decryptKeystoreToPkey, pkeyToKeystore} from '../common/keystore'
import {privateToAddress, privateToPublic, publicToAddress} from 'ethereumjs-util'
import {mnemonictoPrivatekey} from "../common/mnemonic";
import {generateMnemonic} from "bip39"

const path = "m/44'/60'/0'/0/0";

export function privateKeytoAddress(privateKey) {
  try {
    validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
  } catch (e) {
    throw new Error('Invalid private key')
  }
  return formatKey(privateToAddress(toBuffer(privateKey)))
}

export function publicKeytoAddress(publicKey) {
  try {
    validator.validate({value: publicKey, type: 'PRIVATE_KEY'});
  } catch (e) {
    throw new Error('Invalid private key')
  }
  return formatAddress(publicKeytoAddress(toBuffer(publicKey)))
}

export function privateKeytoPublic(privateKey) {
  try {
    validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
  } catch (e) {
    throw new Error('Invalid private key')
  }
  return formatKey(privateToPublic(toBuffer(privateKey)))
}

export function create(password) {
  const mnemonic = generateMnemonic();
  const privateKey = mnemonictoPrivatekey(mnemonic,password,path);
  const publicKey = privateToPublic(privateKey);
  const address = privateToAddress(privateKey);
  return {
    mnemonic,
    privateKey:formatKey(privateKey),
    publicKey:formatKey(publicKey),
    address:formatAddress(address),
  }
}

export function encrypt(privateKey, password) {
  return pkeyToKeystore(privateKey, password) // keystoreJsonV3
}

export function decrypt(keystoreJsonV3, password) {
  const privateKey = decryptKeystoreToPkey(keystoreJsonV3, password); // privateKey
  console.log(formatKey(privateKey));
  const publicKey = privateToPublic(privateKey);
  const address = publicToAddress(publicKey);
  return {
    privateKey:formatKey(privateKey),
    publicKey:formatKey(publicKey),
    address:formatAddress(address),
  }
}


export function fromMnemonic(mnemonic,password,dpath) {
  const privateKey = mnemonictoPrivatekey(mnemonic,password, dpath||path);
  const publicKey = privateToPublic(privateKey);
  const address = privateToAddress(privateKey);
  return {
    mnemonic,
    privateKey:formatKey(privateKey),
    publicKey:formatKey(publicKey),
    address:formatAddress(address),
  }
}

