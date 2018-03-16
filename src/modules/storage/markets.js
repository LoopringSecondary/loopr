
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
const favor = (market)=>{
  let markets = {}
  if(
    localStorage.markets &&
    localStorage.markets !== 'undefined' &&
    localStorage.markets !== 'null'
  ){
    markets = JSON.parse(localStorage.markets)
  }
  markets.favors[market] = true
  localStorage.markets = JSON.stringify(markets)
}
const unFavor = (market)=>{
  let markets = {}
  if(
    localStorage.markets &&
    localStorage.markets !== 'undefined' &&
    localStorage.markets !== 'null'
  ){
    markets = JSON.parse(localStorage.markets)
  }
  markets.favors[market] = false
  localStorage.markets = JSON.stringify(markets)
}
const getFavors = (market)=>{
  if(localStorage.markets){
    let markets = JSON.parse(localStorage.markets)
    return markets.favors
  }else{
    return {}
  }
}

export default {
  setCurrent,
  getCurrent,
  favor,
  unFavor,
  getFavors,
}

