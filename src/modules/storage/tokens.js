const getCurrent = ()=>{
  if(localStorage.tokens){
    let tokens = JSON.parse(localStorage.tokens)
    let selected = tokens.selected || {}
    let current
    for(let key in selected){
      if(selected[key]){
        current = key
      }
    }
    return current
  }else{
    return 'ETH'
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
  getCurrent,
  getFavored,
  getTokens,
  update,
}

