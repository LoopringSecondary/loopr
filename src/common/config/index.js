//const config = require('./config.json');
const config = require('./testConfig.json');
const tokensIcons = require('./tokens_icons.json');
let tokens = config.tokens || []
tokens.forEach(token=>{
  token.icon = tokensIcons[token.symbol]
})
const markets = config.markets
const txs = config.txs;
const data= require('./data')
const projects =  data.projects;

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

function getTokenBySymbol(symbol){
  if(!symbol){ return {} }
  return tokens.find(token=>token.symbol.toLowerCase()===symbol.toLowerCase()) || {}
}

function getTokenByAddress(address){
  if(!address){ return {} }
  return tokens.find(token=>token.address.toLowerCase()===address.toLowerCase())
}

function getCustomTokens(){
  return tokens.filter(token=>token.custom)
}

function getTokens(){
  return tokens
}

function getMarketByPair(pair) {
  if (pair) {
    const pairArr = pair.split('-')
    if(pairArr && pairArr.length === 2) {
      return getMarketBySymbol(pairArr[0], pairArr[1])
    }
  }
}

function getProjectByName(name) {
  if(!name){return {}}
 return  projects.find(project=> project.name.toLowerCase() === name.toLowerCase())
}

function getProjectById(id) {
  if(!id){return {}}
  return projects.find(project=> project.projectId === id)
}
function getProjectByLrx(lrx) {
  if(!lrx){return {}}
  return  projects.find(project=> project.lrx.toLowerCase() === lrx.toLowerCase())
}


function getMarketBySymbol(tokenx, tokeny) {
  if (tokenx && tokeny) {
    return markets.find(market=> {
        return (market.tokenx === tokenx && market.tokeny === tokeny) || (market.tokenx === tokeny && market.tokeny === tokenx)
      }
    )
  }
}

function getGasLimitByType(type) {
  if(type){
    return txs.find(tx => type === tx.type)
  }

}


export default {
  getTokenBySymbol,
  getTokenByAddress,
  getTokens,
  getMarketBySymbol,
  getMarketByPair,
  getProjectByName,
  getProjectById,
  getProjectByLrx,
  getGasLimitByType
}
