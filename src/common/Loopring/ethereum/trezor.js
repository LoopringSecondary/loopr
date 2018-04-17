/**
 * only support browser， make sure you have include trezor connect library in your page:
 * <script src="https://connect.trezor.io/4/connect.js"></script>
 * help website: https://github.com/trezor/connect
 */

import {publicKeytoAddress} from "./account";

/**
 * @param path
 * @returns {Promise}
 */
export async function getAddress(path) {

  if (path) {
    return new Promise((resolve) => {
      window.TrezorConnect.ethereumGetAddress(path, function (result) {
        if (result.success) {
          resolve(result.address)
        } else {
          throw new Error(result.error);
        }
      });
    })
  } else {
    throw new Error('dpath can\'t be null')
  }
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
 * @description sign message, can only verify be TREZOR.
 * @param path string
 * @param message string
 * @returns {Promise}
 */
export async function signMessage({path, message}) {
  if (path) {
    return new Promise((resolve) => {
      window.TrezorConnect.ethereumSignMessage(path, message, function (result) {
        if (result.success) {
          resolve(result.signature)
        } else {
          throw new Error(result.error);
        }
      });
    })
  } else {
    throw new Error('dpath can\'t be null')
  }
}






