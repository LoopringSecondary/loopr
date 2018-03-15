
const setCurrentMarket = (market)=>{
  localStorage.market = market
}
const getCurrentMarket = (balances)=>{
  return localStorage.market || 'RDN-WETH'
}
export default {
  setCurrentMarket,
  getCurrentMarket,
}

