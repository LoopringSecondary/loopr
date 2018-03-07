import Account from "./Account";
import {getAddress,sign} from "../../common/Loopring/ethereum/trezor";
import Transaction from "../../common/Loopring/ethereum/transaction";
import EthTransaction from 'ethereumjs-tx'
import {signatureRecover} from '../../common/Loopring/ethereum/utils'

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
      // window.TrezorConnect.ethereumSignMessage(this.path, rawTx, function (result) {
      //   if (result.success) {
      //     resolve(result.signature)
      //   } else {
      //     console.error('Error:', result.error); // error message
      //     resolve({error:{message:result.error}})
      //   }
      // });

      window.TrezorConnect.ethereumSignTx(
        rawTx.from,
        rawTx.nonce,
        rawTx.gasPrice,
        rawTx.gasLimit,
        rawTx.to,
        rawTx.value,
        rawTx.data,
        rawTx.chainId,
        function (response) {
          if (response.success) {
            console.log('Signature V (recovery parameter):', response.v); // number
            console.log('Signature R component:', response.r); // bytes
            console.log('Signature S component:', response.s); // bytes
            const newTx = new EthTransaction({...rawTx, ...response})
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
    const signed = await this.signTx(rawTx)
    if(signed.result){
      return await tx.sendSignedTx(signatureRecover(...signed))
    } else {
      throw new Error(signed.error)
    }
  }
}
