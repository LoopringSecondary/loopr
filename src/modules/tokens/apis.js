import { tokens } from '../../common/config/data';

export function fetchList({filters={},page={},sort={},}){
  let keys = Object.keys(filters)
  let results = [...tokens]
  keys.map(key=>{
    const value = filters[key]
    if(key==='ifOnlyShowMyFavorite'){
      results = results.filter(token=> !!token.isFavored === !!value)
    }
    if(key==='ifHideSmallBalance'){
      if(value){
        results = results.filter(token=>Number(token['balance']) > 0)
      }
    }
    if(key==='keywords'){
      results = results.filter(token=>{
        let text = (token.symbol + token.title).toLowerCase()
        return text.indexOf(value.toLowerCase()) > -1
      })
    }
  })
  return {
    items:results
  }
}

export function updateItem({item={}}){
   tokens.forEach((token,index)=>{
    if(token.symbol===item.symbol){
      tokens[index] = {
        ...token,
        ...item,
      }
    }
   })
   return {
    items:tokens
   }
}
export function deleteItem({item={}}){
   // TODO
}

export function createItem({item={}}){
   // TODO
}



