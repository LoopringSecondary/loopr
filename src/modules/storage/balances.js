
const setBalances = (balances)=>{
  localStorage.balances = JSON.stringify(balances)
}
const getBalances = (balances)=>{
  if(localStorage.balances){
    return JSON.parse(localStorage.balances)
  }else{
    return null
  }
}
const getBalanceBySymbol = (symbol)=>{
  // TODO
}
const getBalanceByAddress = (address)=>{
  // TODO
}

export default {
  setBalances,
  getBalances,
  getBalanceBySymbol,
  getBalanceByAddress,
}

