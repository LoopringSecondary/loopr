import validator from '../common/validator'
import {toHex, toBuffer} from '../common/formatter'
import {decryptKeystoreToPkey, pkeyToKeystore} from '../common/keystore'
import {randomBytes} from 'crypto'
import {privateToAddress, privateToPublic, publicToAddress} from 'ethereumjs-util'

export default class Account {
  constructor(privateKey) {
    if (!privateKey) {
      this.privateKey = randomBytes(32)
    } else {
      try {
        validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
      } catch (e) {
        throw new Error('Invalid private key')
      }
    }
    this.privateKey = toBuffer(privateKey);
    this.publicKey = privateToPublic(privateKey);
    this.address = privateToAddress(privateKey)
  }

  static create() {
    const privateKey = randomBytes(32);
    const publicKey = privateToPublic(privateKey);
    const address = privateToAddress(privateKey);
    return {
      privateKey,
      publicKey,
      address,
    }
  }

  static encrypt(privateKey, password) {
    return pkeyToKeystore(privateKey, password) // keystoreJsonV3
  }

  static decrypt(keystoreJsonV3, password) {
    const privateKey = decryptKeystoreToPkey(keystoreJsonV3, password); // privateKey
    const publicKey = privateToPublic(privateKey);
    const address = publicToAddress(publicKey);
    return {
      privateKey: toHex(privateKey),
      publicKey,
      address,
    }
  }

  static download() {
    // TODO
  }

}

