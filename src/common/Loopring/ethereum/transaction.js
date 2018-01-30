import EthTransaction from 'ethereumjs-tx'
import validator from '../common/validator'
import {toHex, toBuffer} from '../common/formatter'
import request from '../common/request'

export default class Transaction {
  constructor(rawTx) {
    // TODO validator.validate({value:tx,type:'TX'})
    this.raw = rawTx
    this.setGasLimit()
    this.setGasPrice()
    this.setTo()
    this.setValue()
    this.setChainId()
    this.setData()
  }

  setGasLimit(){
    const gasLimit = this.input.gasLimit
    this.raw.gasLimit = utils.getGasLimit(gasLimit)
  }
  setGasPrice(){
    this.raw.gasPrice = utils.getGasPrice()
  }
  setTo(){
    const token = this.token
    const address = this.input.address
    if(this.type === ('approve' || 'convert' || 'approveCancel')){
      this.raw.to = token.address	 // token address
    }
    if(this.type === 'transfer'){
      if(token.name ===' ETH'){
        this.raw.to = address  // user address
      }else{
        this.raw.to = token.address
      }
    }
    if(this.type ==== ('cancelOrder' || 'cancelAllOrders') ){
      this.raw.to = utils.getContractAddress() // TO CONFIRM: loopring contract address
    }
  }
  setValue(){
    if(this.type === ('approve' || 'approveCancel' || 'cancelOrder' || 'cancelAllOrders')){
      this.raw.value = utils.getAmount(0)
    }
    if(this.type === ('transfer' || 'convert')){
      if(token.name==='ETH'){
        this.raw.value = utils.getAmount(amount)
      }else{
        this.raw.value = utils.getAmount(0)
      }
    }
  }
  setData(){
    const digits = this.token.digits
    const amount = this.amount && utils.getAmount(this.amount,digits)
    if(this.type === 'approve'){
      const spender = utils.getDelegateAddress()
      this.raw.data = abis.generateTransferData(spender, amount)
      if(token.allowance > 0){
        this.cancelTx = {...this.raw}
        this.cancelTx.data = abis.generateTransferData(spender, '0x0')
      }
    }
    if(this.type === 'transfer'){
      const address = this.address // user address ,not token address
      const token = this.token // TODO
      if(token.name==='ETH'){
        this.raw.data = data || '0x'
      }else{
        this.raw.data = abis.generateTransferData(address, amount)
      }
    }
    if(this.type === 'convert'){
      const fromToken = this.input.fromToken // TODO
      const token = this.token // TODO
      if(fromToken === 'ETH'){
        this.raw.data = '0xd0e30db0'
      }else{
        this.raw.data = abis.generateWithdrawData(amount)
      }
    }
    if(this.type === 'cancelOrder'){
      const signedOrder = this.input.signedOrder
      this.raw.data = abis.generateCancelOrderData(signedOrder)
    }
    if(this.type === 'cancelAllOrders'){
      const timestamp = utils.toHex(Date.parse(new Date()) / 1000)
      this.raw.data = abis.generateCutOffData(timestamp)
    }
  }
  setChainId(){
    this.raw.chainId = this.input.chainId || 1
  }
  async setNonce(address,tag){
    const tag = tag ? tag || 'latest'
    const nonce = await apis.getTransactionCount(address,tag)
    this.raw.nonce = utils.toHex(nonce+1)
  }


  hash() {
    return new EthTransaction(this.raw).hash()
  }

  sign(privateKey) {
    validator.validate({value: privateKey, type: 'PRIVATE_KEY'});
    privateKey = toBuffer(privateKey);
    const ethTx = new EthTransaction(this.raw);
    const signed = ethTx.sign(privateKey).serialize();
    this.signed = signed;
    return toHex(signed)
  }

  async send(privateKey) {
    if(!this.signed){
      this.sign(privateKey)
    }
    validator.validate({value:this.signed,type:'HEX',});
    let body = {};
    body.method = 'eth_sendRawTransaction';
    body.params = [this.signed];
    return request({
      method:'post',
      body,
    })
  }
}






