/**
 *
 * help website: https://github.com/trezor/connect
 */

import TrezorConnect from '../common/trezor-connect';
import {clearHexPrefix, addHexPrefix, padLeftEven} from "../common/formatter";
import EthTransaction from 'ethereumjs-tx';
import BN from 'bn.js'

/**
 * @description Returns ethereum address of given dpath
 * @param dpath
 * @returns {Promise}
 */
export async function getAddress(dpath) {
  if (dpath) {
    return new Promise((resolve) => {
      TrezorConnect.ethereumGetAddress(dpath, (result) => {
        if (result.success) {
          resolve(result.address)
        } else {
          resolve({error: result.error});
        }
      });
    })
  } else {
    throw new Error('dpath can\'t be null')
  }
}

/**
 * @description sign message, can only be verified by TREZOR.
 * @param path string
 * @param message string
 * @returns {Promise}
 */
export async function signMessage({path, message}) {
  if (path) {
    return new Promise((resolve) => {
      TrezorConnect.ethereumSignMessage(path, message, (result) => {
        if (result.success) {
          resolve(result.signature)
        } else {
          resolve({error: result.error});
        }
      });
    })
  } else {
    throw new Error('dpath can\'t be null')
  }
}

/**
 * @description  sign ethereum tx
 * @param path string | array,  examples: "m/44'/60'/0'/0" or [44 | 0x80000000,60 | 0x80000000,0  | 0x80000000,0 ];
 * @param rawTx
 * @returns {Promise}
 */
export async function signEthereumTx(path, rawTx) {


  return new Promise((resolve) => {
    const tx = [rawTx.nonce, rawTx.gasPrice, rawTx.gasLimit, rawTx.to, rawTx.value === '' ? '' : rawTx.value, rawTx.data].map(item => padLeftEven(clearHexPrefix(item).toLowerCase()));
    TrezorConnect.ethereumSignTx(
      path,
      ...tx,
      rawTx.chainId,
      (result) => {
        if (result.success) {
          const ethTx = new EthTransaction({
            ...rawTx,
            v: addHexPrefix(new BN(result.v).toString(16)),
            s: addHexPrefix(result.s),
            r: addHexPrefix(result.r)
          });
          resolve({result: ethTx.serialize()})
        } else {
          resolve({error: result.error});
        }
      });
  })
}

/**
 * Returns xpubkey and chainCode
 * @param dpath
 * @returns {Promise}
 */
export async function getXPubKey(dpath) {
  if (dpath) {
    return new Promise((resolve)=>{
      TrezorConnect.setCurrency('BTC');
      TrezorConnect.getXPubKey(dpath, (result) => {
        if (result.success) {
          resolve({result})
        } else {
          resolve({error: result.error});
        }
      });
    })
  } else {
    throw new Error('dpath can\'t be null')
  }
}


