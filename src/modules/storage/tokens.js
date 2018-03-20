const getSelected = ()=>{
  if(localStorage.tokens){
    let tokens = JSON.parse(localStorage.tokens)
    return tokens.current
  }else{
    return 'LRC-WETH'
  }

}
const getFavored = (market)=>{
  if(localStorage.tokens){
    let tokens = JSON.parse(localStorage.tokens)
    return tokens.favors || {}
  }else{
    return {}
  }
}
const getTokens = (market)=>{
  if(localStorage.tokens){
    let tokens = JSON.parse(localStorage.tokens)
    return tokens
  }else{
    return {}
  }
}

const update = (tokens)=>{
  console.log('update tokens',tokens)
  if(
    localStorage.tokens &&
    localStorage.tokens !== 'undefined' &&
    localStorage.tokens !== 'null'
  ){
    let orgin_tokens = JSON.parse(localStorage.tokens)
    let new_tokens = {
      ...orgin_tokens,
      ...tokens,
    }
    localStorage.tokens = JSON.stringify(new_tokens)
  }else{
    localStorage.tokens = JSON.stringify(tokens)
  }
}


export default {
  getSelected,
  getFavored,
  getTokens,
  update,
}

