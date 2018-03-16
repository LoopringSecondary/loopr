
const setCurrent = (market)=>{
  let markets = {}
  if(
    localStorage.markets &&
    localStorage.markets !== 'undefined' &&
    localStorage.markets !== 'null'
  ){
    markets = JSON.parse(localStorage.markets)
  }
  markets.current = market
  localStorage.markets = JSON.stringify(markets)
}
const getCurrent = ()=>{
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

