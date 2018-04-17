import ledger from 'ledgerco';
import {getXPubKey} from "./trezor";

/**
 * @description connect to Ledger
 * @returns {Promise}
 */
export async function connect() {
  return new Promise((resolve) => {
    ledger.comm_u2f.create_async()
      .then(comm => {
        try {
          resolve({result: new ledger.eth(comm)});
        } catch (e) {
          resolve({error: e.message})
        }
      })
  })
}

/**
 * @description Returns publicKey and chainCode
 * @param dpath
 * @param ledgerConnect
 * @returns {Promise}
 */
export async function getXPubKey(dpath, ledgerConnect) {
  if (dpath) {
    return new Promise((resolve) => {
      ledgerConnect.getAddress_async(dpath, false, true)
        .then(res => {
          resolve(res)
        }).catch(err => {
        resolve({error: err})
      });
    })
  } else {
    throw new Error('dpath can\'t be null')
  }
}



