
const setBalances = (balances)=>{
  localStorage.balances = JSON.stringify(balances)
}
const getBalances = (balances)=>{
  if(localStorage.balances){
    return JSON.parse(localStorage.balances)
  }else{
    return null
  }
}

export default {
  setBalances,
  getBalances,
}

