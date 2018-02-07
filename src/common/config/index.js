const config = require('./config.json');

function getToken(value='',type='symbol'){
  const tokens = config.tokens || []
  if(!value){ return {} }
  if(type==='symbol'){
    return tokens.find(token=>token.symbol.toLowerCase()===value.toLowerCase())
  }
  if(type==='address'){
    return tokens.find(token=>token.address.toLowerCase()===value.toLowerCase())
  }
}

export default {
	getToken
}