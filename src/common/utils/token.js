import {toNumber} from "Loopring/common/formatter";

export function getTokenAmount(symbol,amount){
  if(symbol && typeof symbol === 'string'){
    console.error('symbol is required')
  }
  if(amount && typeof amount === 'number'){
    console.error('amount is required')
  }
  const tokenConfig = window.CONFIG.getTokenBySymbol(symbol) || {}
  return (toNumber(amount) / Number('1e' + tokenConfig.digits)).toFixed(tokenConfig.precision)
}
export function getTokenValue(symbol,amount,price){
  if(price && typeof price === 'number'){
    console.error('price is required & must be number')
  }
  const formattedAmount = getTokenAmount(symbol,amount)
  return (formattedAmount * price ).toFixed(2)
}

export default class Token {
  constructor(token){
      const {symbol,address} = token
      let tokenConfig = {}
      if(symbol){
        tokenConfig = window.CONFIG.getTokenBySymbol(symbol) || {}
      }else{
        if(address){
          tokenConfig = window.CONFIG.getTokenByAddress(address) || {}
        }
      }
      let newToken = {...tokenConfig,...token}
      let keys = Object.keys(newToken)
      keys.forEach(key=>{
        this[key] = newToken[key]
      })
      // this.digits = tokenConfig.digits
      // this.precision = tokenConfig.precision
      // this.symbol = tokenConfig.symbol
      // this.address = tokenConfig.address
      // this.balance = tokenConfig.balance
  }
  getToken(){
    return this.token
  }
  getAmount(amount){
    return (toNumber(amount) / Number('1e' + this.digits)).toFixed(this.precision)
  }
  getAmountValue(amount,price){
    const formattedAmount = this.getAmount(amount)
    return ( formattedAmount * price ).toFixed(2)
  }
  getBalance(){
    return this.getAmount(this.balance)
  }
  getBalanceValue(price){
    return this.getAmountValue(this.balance,price)
  }
}
