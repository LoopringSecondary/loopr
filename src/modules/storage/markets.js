
const setCurrent = (market)=>{
  if(localStorage.markets){
    let markets = JSON.parse(localStorage.markets)
    markets.current = market
    localStorage.markets = JSON.stringify(localStorage.markets)
  }

}
const getCurrent = (balances)=>{
  if(localStorage.markets){
    let markets = JSON.parse(localStorage.markets)
    return markets.current
  }else{
    return 'RDN-WETH'
  }

}
const favor = (balances)=>{
  let markets = JSON.parse(localStorage.markets)
  return localStorage.market || 'RDN-WETH'
}
const unFavor = (balances)=>{
  return localStorage.market || 'RDN-WETH'
}

export default {
  setCurrent,
  getCurrent,
}

