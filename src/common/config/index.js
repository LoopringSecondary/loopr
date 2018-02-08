const config = require('./config.json');
let tokens = config.tokens || []

// mock some tokens's data read from localstorage
const localTokens = [
  {
    "symbol": "LOCAL-TEST1",
    "name": "BBB",
    "digits": 18,
    "address": "",
    "unit": "ETH",
    "website": "https://ethereum.org",
    "allowance": "1000000000000000000000",
    "allowanceWarn": "500000000000000000000",
    "precision": 6,
    "minTradeValue": 0.001,
    "custom":true
  },
  {
    "symbol": "LOCAL-TEST2",
    "name": "AAA",
    "digits": 18,
    "address": "",
    "unit": "ETH",
    "website": "https://ethereum.org",
    "allowance": "1000000000000000000000",
    "allowanceWarn": "500000000000000000000",
    "precision": 6,
    "minTradeValue": 0.001,
    "custom":true
  }
]
tokens = tokens.concat(localTokens)

function getTokenBySymbol(value){
  if(!value){ return {} }
  return tokens.find(token=>token.symbol.toLowerCase()===value.toLowerCase())
}

function getTokenByAddress(address){
  if(!address){ return {} }
  return tokens.find(token=>token.address.toLowerCase()===address.toLowerCase())
}

function getCustomTokens(){
  return tokens.filter(token=>token.custom)
}


export default {
  getTokenBySymbol,
  getTokenByAddress
}
