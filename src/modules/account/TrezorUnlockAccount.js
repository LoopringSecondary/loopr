import Account from "./Account";
import {getAddress,sign} from "../../common/Loopring/ethereum/trezor";
import Transaction from "../../common/Loopring/ethereum/transaction";
import EthTransaction from 'ethereumjs-tx'
import {signatureRecover} from '../../common/Loopring/ethereum/utils'
import {clearPrefix, toBuffer,toHex,addHexPrefix} from '../../common/Loopring/common/formatter'

export default class TrezorUnlockAccount extends Account {

  constructor(input) {
    super({unlockType: 'trezor', address: input.address})
    this.path = input.path
  }

  getAddress() {
    return super.getAddress()
  }

  async signTx(rawTx){
    return new Promise((resolve) => {
      const tx = [clearPrefix(rawTx.nonce), clearPrefix(rawTx.gasPrice), clearPrefix(rawTx.gasLimit), clearPrefix(rawTx.to),
        clearPrefix(rawTx.value) === '' ? null : clearPrefix(rawTx.value), clearPrefix(rawTx.data)].map(item=>{
        if(item && item.length % 2 === 1) {
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
            const newTx = new EthTransaction({...rawTx, v:response.v, s:toBuffer(addHexPrefix(response.s)), r:toBuffer(addHexPrefix(response.r))})
            resolve({result:newTx.serialize()})
          } else {
            console.error('Error:', response.error); // error message
            resolve({error:response.error})
          }
        });
    })
  }

  async sendTransaction(rawTx) {
    let tx = new Transaction(rawTx)
    await tx.complete()
    const signed = await this.signTx(rawTx)
    if(signed.result){
      return await tx.sendRawTx(toHex(signed.result))
    } else {
      throw new Error(signed.error)
    }
  }
}
