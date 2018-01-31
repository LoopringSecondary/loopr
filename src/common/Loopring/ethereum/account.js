import validator from '../common/validator'
import {toHex, toBuffer,formatKey,formatAddress} from '../common/formatter'
import {decryptKeystoreToPkey, pkeyToKeystore} from '../common/keystore'
import {randomBytes} from 'crypto'
import {privateToAddress, privateToPublic, publicToAddress} from 'ethereumjs-util'

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


export function create() {
  const privateKey = randomBytes(32);
  const publicKey = privateToPublic(privateKey);
  const address = privateToAddress(privateKey);
  return {
    privateKey,
    publicKey,
    address,
  }
}

export function encrypt(privateKey, password) {
  return pkeyToKeystore(privateKey, password) // keystoreJsonV3
}

export function decrypt(keystoreJsonV3, password) {
  const privateKey = decryptKeystoreToPkey(keystoreJsonV3, password); // privateKey
  const publicKey = privateToPublic(privateKey);
  const address = publicToAddress(publicKey);
  return {
    privateKey: toHex(privateKey),
    publicKey,
    address,
  }
}




