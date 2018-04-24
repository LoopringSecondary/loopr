
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
    return 'LRC-WETH'
  }

}
const toggleFavor = (market)=>{
  let markets = {}
  if(
    localStorage.markets &&
    localStorage.markets !== 'undefined' &&
    localStorage.markets !== 'null'
  ){
    markets = JSON.parse(localStorage.markets)
  }
  if(typeof markets.favors !== 'object'){
    markets.favors = {}
  }
  markets.favors[market] = !markets.favors[market]
  localStorage.markets = JSON.stringify(markets)
}
const getFavors = (market)=>{
  if(localStorage.markets){
    let markets = JSON.parse(localStorage.markets)
    return markets.favors || {}
  }else{
    return {}
  }
}

export default {
  setCurrent,
  getCurrent,
  toggleFavor,
  getFavors,
}

